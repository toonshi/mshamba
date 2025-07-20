import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Types "types";
import Utils "utils";

module {
  public type Result<T> = Utils.Result<T>;

  // Supply Chain Types
  public type SupplyType = {
    #Transport: TransportDetails;
    #Machinery: MachineryDetails;
    #Skill: SkillDetails;
    #Input: InputDetails;
    #Storage: StorageDetails;
    #Processing: ProcessingDetails;
    #Packaging: PackagingDetails;
    #Marketing: MarketingDetails;
  };

  public type TransportDetails = {
    fromLocation: ?Text; // Optional - null means "general"
    toLocation: ?Text;   // Optional - null means "general"
    vehicleType: TransportVehicle;
    capacity: Text; // e.g., "5 tons", "50 bags"
  };

  public type TransportVehicle = {
    #Truck;
    #Pickup;
    #Motorcycle;
    #Bicycle;
    #Tractor;
    #Donkey;
    #Other: Text;
  };

  public type MachineryDetails = {
    machineryType: MachineryType;
    condition: MachineryCondition;
    availability: Text; // e.g., "Daily", "Weekly", "Seasonal"
  };

  public type MachineryType = {
    #Tractor;
    #Plough;
    #Harrow;
    #Planter;
    #Cultivator;
    #Harvester;
    #Thresher;
    #WaterPump;
    #Sprayer;
    #Weeder;
    #Sheller;
    #Mill;
    #Other: Text;
  };

  public type MachineryCondition = {
    #New;
    #Good;
    #Fair;
    #NeedsRepair;
  };

  public type SkillDetails = {
    skillType: SkillType;
    experience: Text; // e.g., "5 years", "Expert"
    certification: ?Text; // Optional certification details
  };

  public type SkillType = {
    #AgriculturalConsultant;
    #Veterinarian;
    #SoilTesting;
    #IrrigationSpecialist;
    #PestControl;
    #CropSpecialist;
    #LivestockSpecialist;
    #OrganicFarming;
    #Accounting;
    #Marketing;
    #Training;
    #Other: Text;
  };

  public type InputDetails = {
    inputType: InputType;
    quantity: ?Text; // Optional quantity available
    quality: Text; // e.g., "Grade A", "Organic"
  };

  public type InputType = {
    #Seeds;
    #Fertilizer;
    #Pesticide;
    #Feed;
    #Tools;
    #Irrigation;
    #Other: Text;
  };

  public type StorageDetails = {
    storageType: StorageType;
    capacity: Text;
    location: Text;
    climate: ClimateControl;
  };

  public type StorageType = {
    #Warehouse;
    #ColdStorage;
    #Silo;
    #Barn;
    #OpenYard;
    #Other: Text;
  };

  public type ClimateControl = {
    #Controlled;
    #Ventilated;
    #Basic;
  };

  public type ProcessingDetails = {
    processingType: ProcessingType;
    capacity: Text; // e.g., "100kg/day"
  };

  public type ProcessingType = {
    #Milling;
    #Drying;
    #Cleaning;
    #Sorting;
    #Packaging;
    #ValueAddition;
    #Other: Text;
  };

  public type PackagingDetails = {
    packagingType: PackagingType;
    materials: Text; // Available materials
  };

  public type PackagingType = {
    #Bags;
    #Boxes;
    #Containers;
    #Branding;
    #Labeling;
    #Other: Text;
  };

  public type MarketingDetails = {
    marketingType: MarketingType;
    reach: Text; // e.g., "Local", "National", "Export"
  };

  public type MarketingType = {
    #BuyerConnections;
    #MarketResearch;
    #Branding;
    #OnlineMarketing;
    #ExportAssistance;
    #PriceNegotiation;
    #Other: Text;
  };

  public type PriceStructure = {
    #Fixed: Nat; // Fixed price in e8s
    #Hourly: Nat; // Per hour rate
    #Daily: Nat; // Per day rate
    #PerUnit: Nat; // Per unit (kg, bag, etc.)
    #Percentage: Nat; // Percentage of value
    #Negotiable;
  };

  // Supply Offering
  public type SupplyOffering = {
    id: Text;
    supplierId: Principal;
    title: Text;
    description: Text;
    supplyType: SupplyType;
    location: Text;
    pricing: PriceStructure;
    availability: Text; // e.g., "Available now", "Seasonal"
    contactInfo: Text;
    isActive: Bool;
    createdAt: Int;
    updatedAt: Int;
  };

  // Demand Request (Bounty)
  public type DemandRequest = {
    id: Text;
    farmId: Text;
    requesterId: Principal;
    title: Text;
    description: Text;
    supplyType: SupplyType;
    location: Text;
    budget: ?PriceStructure; // Optional budget
    urgency: UrgencyLevel;
    deadline: ?Int; // Optional deadline timestamp
    contactInfo: Text;
    isActive: Bool;
    createdAt: Int;
    updatedAt: Int;
  };

  public type UrgencyLevel = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  // Message between parties
  public type SupplyChainMessage = {
    id: Text;
    fromUser: Principal;
    toUser: Principal;
    relatedOffering: ?Text; // Optional supply offering ID
    relatedRequest: ?Text; // Optional demand request ID
    subject: Text;
    message: Text;
    timestamp: Int;
    isRead: Bool;
  };

  // Match result for proximity-based matching
  public type SupplyMatch = {
    offering: SupplyOffering;
    distance: ?Nat; // Optional distance in km
    relevanceScore: Nat; // 0-100 relevance score
  };

  public type DemandMatch = {
    request: DemandRequest;
    distance: ?Nat; // Optional distance in km
    relevanceScore: Nat; // 0-100 relevance score
  };

  // Factory functions for HashMaps
  public func newSupplyOfferingStore() : HashMap.HashMap<Text, SupplyOffering> {
    HashMap.HashMap<Text, SupplyOffering>(100, Text.equal, Text.hash)
  };

  public func newDemandRequestStore() : HashMap.HashMap<Text, DemandRequest> {
    HashMap.HashMap<Text, DemandRequest>(100, Text.equal, Text.hash)
  };

  public func newMessageStore() : HashMap.HashMap<Text, SupplyChainMessage> {
    HashMap.HashMap<Text, SupplyChainMessage>(100, Text.equal, Text.hash)
  };

  // Create a supply offering
  public func createSupplyOffering(
    caller: Principal,
    offerings: HashMap.HashMap<Text, SupplyOffering>,
    title: Text,
    description: Text,
    supplyType: SupplyType,
    location: Text,
    pricing: PriceStructure,
    availability: Text,
    contactInfo: Text
  ) : Result<SupplyOffering> {
    let offeringId = "supply-" # Int.toText(Time.now());
    let now = Time.now();

    let newOffering: SupplyOffering = {
      id = offeringId;
      supplierId = caller;
      title = title;
      description = description;
      supplyType = supplyType;
      location = location;
      pricing = pricing;
      availability = availability;
      contactInfo = contactInfo;
      isActive = true;
      createdAt = now;
      updatedAt = now;
    };

    offerings.put(offeringId, newOffering);
    #ok(newOffering)
  };

  // Create a demand request
  public func createDemandRequest(
    caller: Principal,
    farmId: Text,
    requests: HashMap.HashMap<Text, DemandRequest>,
    title: Text,
    description: Text,
    supplyType: SupplyType,
    location: Text,
    budget: ?PriceStructure,
    urgency: UrgencyLevel,
    deadline: ?Int,
    contactInfo: Text
  ) : Result<DemandRequest> {
    let requestId = "demand-" # Int.toText(Time.now());
    let now = Time.now();

    let newRequest: DemandRequest = {
      id = requestId;
      farmId = farmId;
      requesterId = caller;
      title = title;
      description = description;
      supplyType = supplyType;
      location = location;
      budget = budget;
      urgency = urgency;
      deadline = deadline;
      contactInfo = contactInfo;
      isActive = true;
      createdAt = now;
      updatedAt = now;
    };

    requests.put(requestId, newRequest);
    #ok(newRequest)
  };

  // Close a demand request (deal closed)
  public func closeDemandRequest(
    caller: Principal,
    requestId: Text,
    requests: HashMap.HashMap<Text, DemandRequest>
  ) : Result<Text> {
    switch (requests.get(requestId)) {
      case null { #err("Request not found") };
      case (?request) {
        if (request.requesterId != caller) {
          #err("Unauthorized: Only the requester can close this request")
        } else {
          let updatedRequest = {
            request with
            isActive = false;
            updatedAt = Time.now();
          };
          requests.put(requestId, updatedRequest);
          #ok("Request closed successfully")
        }
      };
    }
  };

  // Get active supply offerings
  public func getActiveSupplyOfferings(
    offerings: HashMap.HashMap<Text, SupplyOffering>
  ) : [SupplyOffering] {
    let activeOfferings = Array.filter<SupplyOffering>(
      Iter.toArray(offerings.vals()),
      func(offering) = offering.isActive
    );
    activeOfferings
  };

  // Get active demand requests
  public func getActiveDemandRequests(
    requests: HashMap.HashMap<Text, DemandRequest>
  ) : [DemandRequest] {
    let activeRequests = Array.filter<DemandRequest>(
      Iter.toArray(requests.vals()),
      func(request) = request.isActive
    );
    activeRequests
  };

  // Find matching supplies for a demand request
  public func findMatchingSupplies(
    request: DemandRequest,
    offerings: HashMap.HashMap<Text, SupplyOffering>
  ) : [SupplyMatch] {
    let activeOfferings = getActiveSupplyOfferings(offerings);
    let matches = Array.mapFilter<SupplyOffering, SupplyMatch>(
      activeOfferings,
      func(offering) : ?SupplyMatch {
        if (supplyTypesMatch(request.supplyType, offering.supplyType)) {
          let match : SupplyMatch = {
            offering = offering;
            distance = calculateDistance(request.location, offering.location);
            relevanceScore = calculateRelevanceScore(request, offering);
          };
          ?match
        } else {
          null
        }
      }
    );
    
    // Sort by relevance score (descending) and distance (ascending)
    Array.sort<SupplyMatch>(matches, func(a, b) {
      if (a.relevanceScore > b.relevanceScore) { #less }
      else if (a.relevanceScore < b.relevanceScore) { #greater }
      else {
        switch (a.distance, b.distance) {
          case (?distA, ?distB) {
            if (distA < distB) { #less } else { #greater }
          };
          case (null, ?_) { #greater };
          case (?_, null) { #less };
          case (null, null) { #equal };
        }
      }
    })
  };

  // Find matching demands for a supply offering
  public func findMatchingDemands(
    offering: SupplyOffering,
    requests: HashMap.HashMap<Text, DemandRequest>
  ) : [DemandMatch] {
    let activeRequests = getActiveDemandRequests(requests);
    let matches = Array.mapFilter<DemandRequest, DemandMatch>(
      activeRequests,
      func(request) : ?DemandMatch {
        if (supplyTypesMatch(request.supplyType, offering.supplyType)) {
          let match : DemandMatch = {
            request = request;
            distance = calculateDistance(offering.location, request.location);
            relevanceScore = calculateRelevanceScore(request, offering);
          };
          ?match
        } else {
          null
        }
      }
    );
    
    // Sort by urgency, relevance score, and distance
    Array.sort<DemandMatch>(matches, func(a, b) {
      let urgencyA = getUrgencyWeight(a.request.urgency);
      let urgencyB = getUrgencyWeight(b.request.urgency);
      
      if (urgencyA > urgencyB) { #less }
      else if (urgencyA < urgencyB) { #greater }
      else if (a.relevanceScore > b.relevanceScore) { #less }
      else if (a.relevanceScore < b.relevanceScore) { #greater }
      else {
        switch (a.distance, b.distance) {
          case (?distA, ?distB) {
            if (distA < distB) { #less } else { #greater }
          };
          case (null, ?_) { #greater };
          case (?_, null) { #less };
          case (null, null) { #equal };
        }
      }
    })
  };

  // Helper function to check if supply types match
  private func supplyTypesMatch(requestType: SupplyType, offeringType: SupplyType) : Bool {
    switch (requestType, offeringType) {
      case (#Transport(_), #Transport(_)) { true };
      case (#Machinery(_), #Machinery(_)) { true };
      case (#Skill(_), #Skill(_)) { true };
      case (#Input(_), #Input(_)) { true };
      case (#Storage(_), #Storage(_)) { true };
      case (#Processing(_), #Processing(_)) { true };
      case (#Packaging(_), #Packaging(_)) { true };
      case (#Marketing(_), #Marketing(_)) { true };
      case (_, _) { false };
    }
  };

  // Helper function to calculate distance (placeholder - would need actual geolocation)
  private func calculateDistance(location1: Text, location2: Text) : ?Nat {
    // Placeholder implementation - in reality, you'd use geolocation APIs
    // For now, return null to indicate distance calculation not implemented
    null
  };

  // Helper function to calculate relevance score
  private func calculateRelevanceScore(request: DemandRequest, offering: SupplyOffering) : Nat {
    var score : Nat = 50; // Base score
    
    // Increase score for exact location matches
    if (Text.equal(request.location, offering.location)) {
      score += 30;
    };
    
    // Increase score based on urgency
    switch (request.urgency) {
      case (#Critical) { score += 20 };
      case (#High) { score += 15 };
      case (#Medium) { score += 10 };
      case (#Low) { score += 5 };
    };
    
    // Cap at 100
    if (score > 100) { 100 } else { score }
  };

  // Helper function to get urgency weight for sorting
  private func getUrgencyWeight(urgency: UrgencyLevel) : Nat {
    switch (urgency) {
      case (#Critical) { 4 };
      case (#High) { 3 };
      case (#Medium) { 2 };
      case (#Low) { 1 };
    }
  };

  // Send a message between supply chain participants
  public func sendMessage(
    caller: Principal,
    messages: HashMap.HashMap<Text, SupplyChainMessage>,
    toUser: Principal,
    relatedOffering: ?Text,
    relatedRequest: ?Text,
    subject: Text,
    message: Text
  ) : Result<SupplyChainMessage> {
    let messageId = "msg-" # Int.toText(Time.now());

    let newMessage: SupplyChainMessage = {
      id = messageId;
      fromUser = caller;
      toUser = toUser;
      relatedOffering = relatedOffering;
      relatedRequest = relatedRequest;
      subject = subject;
      message = message;
      timestamp = Time.now();
      isRead = false;
    };

    messages.put(messageId, newMessage);
    #ok(newMessage)
  };

  // Get messages for a user
  public func getUserMessages(
    user: Principal,
    messages: HashMap.HashMap<Text, SupplyChainMessage>
  ) : [SupplyChainMessage] {
    let userMessages = Array.filter<SupplyChainMessage>(
      Iter.toArray(messages.vals()),
      func(msg) = Principal.equal(msg.toUser, user) or Principal.equal(msg.fromUser, user)
    );
    
    // Sort by timestamp (newest first)
    Array.sort<SupplyChainMessage>(userMessages, func(a, b) {
      if (a.timestamp > b.timestamp) { #less } else { #greater }
    })
  };
}
