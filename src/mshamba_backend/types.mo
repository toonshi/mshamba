module {
  // User & Roles

  public type Role = {
    #Investor;
    #Farmer;
    #LandOwner;
    #SupplyPartner;
    #Admin;
  };

  public type UserProfile = {
    id : Text;
    name : Text;
    email : Text;
    role : Role;
    wallet : Principal;
    bio : Text;
    location : Text;
    joinedAt : Int;
  };

  //  Farm Project

  public type FarmStatus = {
    #Open;
    #Funded;
    #InProgress;
    #Harvested;
    #Closed;
  };

  public type Farm = {
    farmId : Text;
    name : Text;
    owner : Principal;
    description : Text;
    location : Text;
    fundingGoal : Nat;
    fundedAmount : Nat;
    totalShares : Nat;           // e.g. 1,000,000
    sharePrice : Nat;            // in e8s (ICP format)
    isOpenForInvestment : Bool;
    createdAt : Int;
    status : FarmStatus;
    investors : [Principal];
  };

  //  Primary Investment Tracking

  public type Investment = {
    investmentId : Text;
    investor : Principal;
    farmId : Text;
    amount : Nat;
    sharesReceived : Nat;
    pricePerShare : Nat;
    timestamp : Int;
  };

  //  Share Ownership

  public type FarmShare = {
    owner : Principal;
    farmId : Text;
    sharesOwned : Nat;
    avgBuyPrice : Nat; // Optional for PnL tracking
  };

  //Trade Orders for Secondary Market

  public type OrderType = {
    #Buy;
    #Sell;
  };

  public type OrderStatus = {
    #Open;
    #Matched;
    #Cancelled;
  };

  public type TradeOrder = {
    orderId : Text;
    user : Principal;
    farmId : Text;
    orderType : OrderType;
    quantity : Nat;
    pricePerShare : Nat;
    timestamp : Int;
    status : OrderStatus;
  };

  public type TradeMatch = {
    tradeId : Text;
    farmId : Text;
    buyer : Principal;
    seller : Principal;
    quantity : Nat;
    pricePerShare : Nat;
    timestamp : Int;
  };

  // ===== Land Listings 
  public type LandListing = {
    landId : Text;
    owner : Principal;
    location : Text;
    sizeInAcres : Float;
    leaseRatePerMonth : Nat;
    isAvailable : Bool;
    listedAt : Int;
  };

  // Supply Chain / Merger Network 

  // public type LinkType = {
  //   #Merger;
  //   #SupplyChainPartner;
  //   #Transport;
  //   #EquipmentLease;
  // };

  // public type NetworkLink = {
  //   from : Principal;
  //   to : Principal;
  //   linkType : LinkType;
  //   message : Text;
  //   timestamp : Int;
  // };

  

 
}
