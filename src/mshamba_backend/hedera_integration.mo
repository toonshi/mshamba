import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Error "mo:base/Error";

import MT "./lib/marketplace_types";

persistent actor HederaIntegration {
  
  // Hedera service URL (will be deployed separately)
  // For local development: http://localhost:3001
  // For production: https://your-hedera-service.com
  private stable var hederaServiceUrl : Text = "http://localhost:3001";

  // Set Hedera service URL (admin function)
  public func setHederaServiceUrl(url: Text) : async () {
    hederaServiceUrl := url;
  };

  // Get current URL
  public query func getHederaServiceUrl() : async Text {
    hederaServiceUrl
  };

  // Log marketplace transaction to Hedera HCS
  public func logMarketplaceTransaction(
    transaction: MT.MarketplaceTransaction,
    listing: MT.MarketplaceListing
  ) : async Result.Result<{transactionId: Text; topicId: Text}, Text> {
    
    // Build event payload for Hedera
    let eventType = switch (listing.category) {
      case (#Seeds) { "INPUT_PURCHASED" };
      case (#Fertilizers) { "INPUT_PURCHASED" };
      case (#Pesticides) { "INPUT_PURCHASED" };
      case (#Tools) { "INPUT_PURCHASED" };
      case (#Equipment) { "INPUT_PURCHASED" };
      case (#Transport) { "SERVICE_PURCHASED" };
      case (#Labor) { "LABOR_ACTIVITY" };
      case (#Storage) { "SERVICE_PURCHASED" };
      case (#Processing) { "SERVICE_PURCHASED" };
      case (#Other(_)) { "MARKETPLACE_PURCHASE" };
    };

    let categoryText = switch (listing.category) {
      case (#Seeds) { "Seeds" };
      case (#Fertilizers) { "Fertilizers" };
      case (#Pesticides) { "Pesticides" };
      case (#Tools) { "Tools" };
      case (#Equipment) { "Equipment" };
      case (#Transport) { "Transport" };
      case (#Labor) { "Labor" };
      case (#Storage) { "Storage" };
      case (#Processing) { "Processing" };
      case (#Other(name)) { name };
    };

    // Create JSON payload
    let payload = "{" #
      "\"eventType\": \"" # eventType # "\"," #
      "\"transactionId\": \"" # transaction.id # "\"," #
      "\"farmId\": \"" # (switch (transaction.farmId) { case (?id) { id }; case null { "MARKETPLACE" }; }) # "\"," #
      "\"buyerId\": \"" # Principal.toText(transaction.buyerId) # "\"," #
      "\"buyerName\": \"" # transaction.buyerName # "\"," #
      "\"sellerId\": \"" # Principal.toText(transaction.sellerId) # "\"," #
      "\"sellerName\": \"" # transaction.sellerName # "\"," #
      "\"category\": \"" # categoryText # "\"," #
      "\"itemName\": \"" # listing.title # "\"," #
      "\"quantity\": " # Nat.toText(transaction.quantity) # "," #
      "\"unit\": \"" # listing.unit # "\"," #
      "\"pricePerUnit\": " # Nat.toText(listing.priceInCkUSDC) # "," #
      "\"totalAmount\": " # Nat.toText(transaction.totalAmount) # "," #
      "\"currency\": \"ckUSDC\"," #
      "\"location\": {" #
        "\"latitude\": " # Float.toText(listing.location.latitude) # "," #
        "\"longitude\": " # Float.toText(listing.location.longitude) # "," #
        "\"region\": \"" # listing.location.region # "\"" #
      "}," #
      "\"timestamp\": " # Int.toText(transaction.createdAt) #
    "}";

    // Make HTTP outcall to Hedera service
    try {
      let url = hederaServiceUrl # "/api/log-event";
      let request_headers = [
        { name = "Content-Type"; value = "application/json" },
      ];

      let http_request : {
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        method : { #get; #post; #head };
        transform : ?{
          function : shared query {
            response : {
              status : Nat;
              headers : [{ name : Text; value : Text }];
              body : Blob;
            };
            context : Blob;
          } -> async {
            status : Nat;
            headers : [{ name : Text; value : Text }];
            body : Blob;
          };
          context : Blob;
        };
      } = {
        url = url;
        max_response_bytes = ?10_000; // 10KB
        headers = request_headers;
        body = ?Text.encodeUtf8(payload);
        method = #post;
        transform = null;
      };

      // Add cycles for HTTP outcall (adjust as needed)
      Cycles.add<system>(230_850_258_000);

      // Note: http_request is part of the management canister interface
      // This is a simplified version - in production you'd use the IC management canister
      // For now, we'll return a mock response and rely on frontend to call Hedera
      
      // TODO: Implement actual HTTP outcall when ready
      // let ic : actor { http_request : ... } = actor("aaaaa-aa");
      // let response = await ic.http_request(http_request);

      Debug.print("Would log to Hedera: " # payload);
      
      // For now, return success (frontend will handle actual Hedera call)
      #ok({
        transactionId = "HEDERA_TXN_" # transaction.id;
        topicId = "0.0.7098281"; // Your actual topic ID
      })
      
    } catch (e) {
      #err("Failed to log to Hedera: " # Error.message(e))
    }
  };

  // Log farm record to Hedera (for backward compatibility)
  public func logFarmRecord(
    farmId: Text,
    farmName: Text,
    eventType: Text,
    category: Text,
    data: Text
  ) : async Result.Result<Text, Text> {
    
    let payload = "{" #
      "\"eventType\": \"" # eventType # "\"," #
      "\"farmId\": \"" # farmId # "\"," #
      "\"farmName\": \"" # farmName # "\"," #
      "\"category\": \"" # category # "\"," #
      "\"data\": " # data # "," #
      "\"timestamp\": " # Int.toText(Time.now()) #
    "}";

    Debug.print("Would log farm record to Hedera: " # payload);
    #ok("HEDERA_TXN_" # farmId)
  };

  // Health check
  public query func health() : async Bool {
    true
  };
}
