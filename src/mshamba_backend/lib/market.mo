import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "types";
import Utils "utils";
import Tokens "tokens";

module {
  public type TradeOrder = Types.TradeOrder;
  public type TradeMatch = Types.TradeMatch;
  public type OrderType = Types.OrderType;
  public type OrderStatus = Types.OrderStatus;
  public type Result<T> = Utils.Result<T>;

  // Storage factories
  public func newOrderStore() : HashMap.HashMap<Text, TradeOrder> {
    HashMap.HashMap<Text, TradeOrder>(100, Text.equal, Text.hash)
  };

  public func newTradeStore() : HashMap.HashMap<Text, TradeMatch> {
    HashMap.HashMap<Text, TradeMatch>(100, Text.equal, Text.hash)
  };

  // Create a buy or sell order
  public func createOrder(
    user: Principal,
    farmId: Text,
    orderType: OrderType,
    quantity: Nat,
    pricePerShare: Nat,
    tokenBalances: HashMap.HashMap<(Principal, Text), Nat>,
    orders: HashMap.HashMap<Text, TradeOrder>
  ) : Result<TradeOrder> {
    
    // Validate user has sufficient tokens for sell orders
    if (orderType == #Sell) {
      let userBalance = Tokens.getTokenBalance(user, farmId, tokenBalances);
      if (userBalance < quantity) {
        return #err("Insufficient tokens to sell");
      };
    };

    let orderId = "order-" # Int.toText(Time.now());
    
    let order: TradeOrder = {
      orderId = orderId;
      user = user;
      farmId = farmId;
      orderType = orderType;
      quantity = quantity;
      pricePerShare = pricePerShare;
      timestamp = Time.now();
      status = #Open;
    };

    orders.put(orderId, order);
    #ok(order)
  };

  // Cancel an order
  public func cancelOrder(
    orderId: Text,
    caller: Principal,
    orders: HashMap.HashMap<Text, TradeOrder>
  ) : Result<TradeOrder> {
    switch (orders.get(orderId)) {
      case (?order) {
        if (not Principal.equal(order.user, caller)) {
          return #err("Only order creator can cancel");
        };
        
        if (order.status != #Open) {
          return #err("Can only cancel open orders");
        };

        let cancelledOrder = { order with status = #Cancelled };
        orders.put(orderId, cancelledOrder);
        #ok(cancelledOrder)
      };
      case null #err("Order not found");
    }
  };

  // Match buy and sell orders
  public func matchOrders(
    farmId: Text,
    orders: HashMap.HashMap<Text, TradeOrder>,
    trades: HashMap.HashMap<Text, TradeMatch>,
    tokenBalances: HashMap.HashMap<(Principal, Text), Nat>,
    transfers: HashMap.HashMap<Text, Types.TokenTransfer>
  ) : [TradeMatch] {
    
    // Get all open orders for this farm
    let farmOrders = Iter.filter<(Text, TradeOrder)>(
      orders.entries(),
      func((_, order)) = Text.equal(order.farmId, farmId) and order.status == #Open
    );
    
    let farmOrdersArray = Iter.toArray(farmOrders);
    
    // Separate buy and sell orders
    let buyOrders = Array.mapFilter<(Text, TradeOrder), (Text, TradeOrder)>(
      farmOrdersArray,
      func((id, order)) = if (order.orderType == #Buy) ?(id, order) else null
    );
    
    let sellOrders = Array.mapFilter<(Text, TradeOrder), (Text, TradeOrder)>(
      farmOrdersArray,
      func((id, order)) = if (order.orderType == #Sell) ?(id, order) else null
    );
    
    var matches: [TradeMatch] = [];
    
    // Simple matching algorithm: match highest buy price with lowest sell price
    for ((buyId, buyOrder) in buyOrders.vals()) {
      for ((sellId, sellOrder) in sellOrders.vals()) {
        if (buyOrder.pricePerShare >= sellOrder.pricePerShare and
            buyOrder.status == #Open and sellOrder.status == #Open) {
          
          // Calculate trade quantity (minimum of both orders)
          let tradeQuantity = if (buyOrder.quantity <= sellOrder.quantity) {
            buyOrder.quantity
          } else {
            sellOrder.quantity
          };
          
          // Execute the trade
          let tradeResult = executeTrade(
            buyOrder, sellOrder, tradeQuantity, sellOrder.pricePerShare,
            orders, trades, tokenBalances, transfers
          );
          
          switch (tradeResult) {
            case (#ok(trade)) {
              matches := Array.append(matches, [trade]);
            };
            case (#err(_)) {}; // Continue to next potential match
          };
        };
      };
    };
    
    matches
  };

  // Execute a trade between matched orders
  private func executeTrade(
    buyOrder: TradeOrder,
    sellOrder: TradeOrder,
    quantity: Nat,
    pricePerShare: Nat,
    orders: HashMap.HashMap<Text, TradeOrder>,
    trades: HashMap.HashMap<Text, TradeMatch>,
    tokenBalances: HashMap.HashMap<(Principal, Text), Nat>,
    transfers: HashMap.HashMap<Text, Types.TokenTransfer>
  ) : Result<TradeMatch> {
    
    // Transfer tokens from seller to buyer
    let transferResult = Tokens.transferTokens(
      sellOrder.user,
      buyOrder.user,
      buyOrder.farmId,
      quantity,
      ?pricePerShare,
      tokenBalances,
      transfers
    );
    
    switch (transferResult) {
      case (#err(msg)) #err(msg);
      case (#ok(_)) {
        // Create trade record
        let tradeId = "trade-" # Int.toText(Time.now());
        let trade: TradeMatch = {
          tradeId = tradeId;
          farmId = buyOrder.farmId;
          buyer = buyOrder.user;
          seller = sellOrder.user;
          quantity = quantity;
          pricePerShare = pricePerShare;
          timestamp = Time.now();
        };
        
        trades.put(tradeId, trade);
        
        // Update order statuses
        let updatedBuyOrder = if (buyOrder.quantity == quantity) {
          { buyOrder with status = #Matched }
        } else {
          { buyOrder with quantity = buyOrder.quantity - quantity }
        };
        
        let updatedSellOrder = if (sellOrder.quantity == quantity) {
          { sellOrder with status = #Matched }
        } else {
          { sellOrder with quantity = sellOrder.quantity - quantity }
        };
        
        orders.put(buyOrder.orderId, updatedBuyOrder);
        orders.put(sellOrder.orderId, updatedSellOrder);
        
        #ok(trade)
      };
    }
  };

  // Get order book for a farm (all open orders)
  public func getOrderBook(
    farmId: Text,
    orders: HashMap.HashMap<Text, TradeOrder>
  ) : {buyOrders: [TradeOrder]; sellOrders: [TradeOrder]} {
    
    let farmOrders = Iter.filter<(Text, TradeOrder)>(
      orders.entries(),
      func((_, order)) = Text.equal(order.farmId, farmId) and order.status == #Open
    );
    
    let farmOrdersArray = Array.map<(Text, TradeOrder), TradeOrder>(
      Iter.toArray(farmOrders),
      func((_, order)) = order
    );
    
    let buyOrders = Array.mapFilter<TradeOrder, TradeOrder>(
      farmOrdersArray,
      func(order) = if (order.orderType == #Buy) ?order else null
    );
    
    let sellOrders = Array.mapFilter<TradeOrder, TradeOrder>(
      farmOrdersArray,
      func(order) = if (order.orderType == #Sell) ?order else null
    );
    
    {buyOrders = buyOrders; sellOrders = sellOrders}
  };

  // Get market price for a farm (last traded price)
  public func getMarketPrice(
    farmId: Text,
    trades: HashMap.HashMap<Text, TradeMatch>
  ) : ?Nat {
    let farmTrades = Iter.filter<(Text, TradeMatch)>(
      trades.entries(),
      func((_, trade)) = Text.equal(trade.farmId, farmId)
    );
    
    let tradesArray = Iter.toArray(farmTrades);
    
    if (Array.size(tradesArray) == 0) return null;
    
    // Sort by timestamp and get the most recent
    let sortedTrades = Array.sort<(Text, TradeMatch)>(
      tradesArray,
      func((_, a), (_, b)) = Int.compare(b.timestamp, a.timestamp)
    );
    
    ?sortedTrades[0].1.pricePerShare
  };

  // Get trading volume for a farm in a time period
  public func getTradingVolume(
    farmId: Text,
    fromTime: Int,
    toTime: Int,
    trades: HashMap.HashMap<Text, TradeMatch>
  ) : {volume: Nat; tradeCount: Nat; totalValue: Nat} {
    
    let farmTrades = Iter.filter<(Text, TradeMatch)>(
      trades.entries(),
      func((_, trade)) = 
        Text.equal(trade.farmId, farmId) and
        trade.timestamp >= fromTime and
        trade.timestamp <= toTime
    );
    
    let tradesArray = Array.map<(Text, TradeMatch), TradeMatch>(
      Iter.toArray(farmTrades),
      func((_, trade)) = trade
    );
    
    let stats = Array.foldLeft<TradeMatch, {vol: Nat; count: Nat; value: Nat}>(
      tradesArray,
      {vol = 0; count = 0; value = 0},
      func(acc, trade) = {
        vol = acc.vol + trade.quantity;
        count = acc.count + 1;
        value = acc.value + (trade.quantity * trade.pricePerShare);
      }
    );
    
    {volume = stats.vol; tradeCount = stats.count; totalValue = stats.value}
  };

  // Get user's order history
  public func getUserOrders(
    user: Principal,
    orders: HashMap.HashMap<Text, TradeOrder>
  ) : [TradeOrder] {
    let userOrders = Iter.filter<(Text, TradeOrder)>(
      orders.entries(),
      func((_, order)) = Principal.equal(order.user, user)
    );
    
    Array.map<(Text, TradeOrder), TradeOrder>(
      Iter.toArray(userOrders),
      func((_, order)) = order
    )
  };

  // Get user's trade history
  public func getUserTrades(
    user: Principal,
    trades: HashMap.HashMap<Text, TradeMatch>
  ) : [TradeMatch] {
    let userTrades = Iter.filter<(Text, TradeMatch)>(
      trades.entries(),
      func((_, trade)) = 
        Principal.equal(trade.buyer, user) or Principal.equal(trade.seller, user)
    );
    
    Array.map<(Text, TradeMatch), TradeMatch>(
      Iter.toArray(userTrades),
      func((_, trade)) = trade
    )
  };

  // Calculate price trend for a farm
  public func getPriceTrend(
    farmId: Text,
    trades: HashMap.HashMap<Text, TradeMatch>
  ) : Text {
    let farmTrades = Iter.filter<(Text, TradeMatch)>(
      trades.entries(),
      func((_, trade)) = Text.equal(trade.farmId, farmId)
    );
    
    let tradesArray = Array.map<(Text, TradeMatch), TradeMatch>(
      Iter.toArray(farmTrades),
      func((_, trade)) = trade
    );
    
    let tradeCount = Array.size(tradesArray);
    if (tradeCount < 2) return "insufficient_data";
    
    // Sort by timestamp
    let sortedTrades = Array.sort<TradeMatch>(
      tradesArray,
      func(a, b) = Int.compare(a.timestamp, b.timestamp)
    );
    
    let oldestPrice = sortedTrades[0].pricePerShare;
    let newestPrice = sortedTrades[tradeCount - 1].pricePerShare;
    
    let changePercent = Float.fromInt(newestPrice - oldestPrice) / Float.fromInt(oldestPrice) * 100.0;
    
    if (changePercent > 5.0) "bullish"
    else if (changePercent < -5.0) "bearish"
    else "stable"
  };
}
