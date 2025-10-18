// Farm Escrow Module - Milestone-based fund management for the Four-Wallet System

import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import EscrowTypes "escrow_types";

module {
  public type Milestone = EscrowTypes.Milestone;
  public type MilestoneStatus = EscrowTypes.MilestoneStatus;
  public type MilestoneEvidence = EscrowTypes.MilestoneEvidence;
  public type Investment = EscrowTypes.Investment;
  public type DividendDistribution = EscrowTypes.DividendDistribution;
  public type IFODetails = EscrowTypes.IFODetails;
  public type EscrowStats = EscrowTypes.EscrowStats;
  public type Result<T> = EscrowTypes.Result<T>;

  // Escrow State for a Farm
  public class FarmEscrow(
    farmOwner: Principal,
    farmTokenCanister: Principal,
    platformPrincipal: Principal
  ) {
    
    // Core state
    var totalRaised: Nat = 0;
    var totalDisbursed: Nat = 0;
    var ifoDetails: ?IFODetails = null;
    
    // Milestones
    let milestones = Buffer.Buffer<Milestone>(10);
    var nextMilestoneId: Nat = 0;
    
    // Investments
    let investments = Buffer.Buffer<Investment>(100);
    var nextInvestmentId: Nat = 0;
    
    // Dividends
    let dividendHistory = Buffer.Buffer<DividendDistribution>(50);
    var nextDividendId: Nat = 0;
    
    // Authorized verifiers (platform admins or DAO members)
    let verifiers = Buffer.Buffer<Principal>(5);
    
    // Initialize with platform as first verifier
    verifiers.add(platformPrincipal);
    
    // ==============================
    // IFO Management
    // ==============================
    
    public func initializeIFO(details: IFODetails) : Result<IFODetails> {
      switch (ifoDetails) {
        case (?existing) {
          #err("IFO already initialized")
        };
        case null {
          ifoDetails := ?details;
          #ok(details)
        };
      };
    };
    
    public func getIFODetails() : ?IFODetails {
      ifoDetails
    };
    
    public func updateIFOStatus(isActive: Bool) : Result<Text> {
      switch (ifoDetails) {
        case null { #err("IFO not initialized") };
        case (?details) {
          let updated = {
            details with
            isActive = isActive;
          };
          ifoDetails := ?updated;
          #ok(if (isActive) "IFO activated" else "IFO closed")
        };
      };
    };
    
    // ==============================
    // Investment Processing
    // ==============================
    
    public func recordInvestment(
      investor: Principal,
      amountICP: Nat,
      tokensReceived: Nat
    ) : Result<Investment> {
      
      // Validate IFO is active
      switch (ifoDetails) {
        case null { return #err("IFO not initialized") };
        case (?details) {
          if (not details.isActive) {
            return #err("IFO is not active");
          };
          
          // Check min/max investment limits
          if (amountICP < details.minInvestment) {
            return #err("Investment below minimum");
          };
          
          switch (details.maxInvestment) {
            case (?max) {
              if (amountICP > max) {
                return #err("Investment exceeds maximum");
              };
            };
            case null {};
          };
          
          // Check if IFO is still open
          let now = Time.now();
          if (now > details.ifoEndDate) {
            return #err("IFO has ended");
          };
          
          // Create investment record
          let investment: Investment = {
            id = nextInvestmentId;
            investor = investor;
            amountICP = amountICP;
            tokensReceived = tokensReceived;
            timestamp = now;
          };
          
          investments.add(investment);
          nextInvestmentId += 1;
          
          // Update totals
          totalRaised += amountICP;
          let updatedDetails = {
            details with
            currentRaised = details.currentRaised + amountICP;
          };
          ifoDetails := ?updatedDetails;
          
          #ok(investment)
        };
      };
    };
    
    public func getInvestments() : [Investment] {
      Buffer.toArray(investments)
    };
    
    public func getInvestmentsByInvestor(investor: Principal) : [Investment] {
      let filtered = Buffer.Buffer<Investment>(10);
      for (inv in investments.vals()) {
        if (inv.investor == investor) {
          filtered.add(inv);
        };
      };
      Buffer.toArray(filtered)
    };
    
    // ==============================
    // Milestone Management
    // ==============================
    
    public func addMilestone(
      title: Text,
      description: Text,
      requiredAmount: Nat,
      deadline: Int
    ) : Result<Milestone> {
      
      let milestone: Milestone = {
        id = nextMilestoneId;
        title = title;
        description = description;
        requiredAmount = requiredAmount;
        deadline = deadline;
        status = #Pending;
        evidence = null;
        verifiedBy = null;
        verificationDate = null;
        disbursementDate = null;
      };
      
      milestones.add(milestone);
      nextMilestoneId += 1;
      
      #ok(milestone)
    };
    
    public func getMilestones() : [Milestone] {
      Buffer.toArray(milestones)
    };
    
    public func getMilestone(id: Nat) : ?Milestone {
      for (m in milestones.vals()) {
        if (m.id == id) {
          return ?m;
        };
      };
      null
    };
    
    public func submitMilestoneEvidence(
      caller: Principal,
      milestoneId: Nat,
      invoice: Text,
      photos: [Text],
      gps: ?Text,
      description: Text
    ) : Result<Milestone> {
      
      // Only farm owner can submit evidence
      if (caller != farmOwner) {
        return #err("Only farm owner can submit milestone evidence");
      };
      
      // Find milestone
      var foundIndex: ?Nat = null;
      var idx: Nat = 0;
      for (m in milestones.vals()) {
        if (m.id == milestoneId) {
          foundIndex := ?idx;
        };
        idx += 1;
      };
      
      switch (foundIndex) {
        case null { #err("Milestone not found") };
        case (?index) {
          let milestone = milestones.get(index);
          
          // Check status
          if (milestone.status != #Pending) {
            return #err("Milestone already has evidence or is completed");
          };
          
          // Create evidence
          let evidence: MilestoneEvidence = {
            invoice = invoice;
            photos = photos;
            gpsCoordinates = gps;
            description = description;
            submissionDate = Time.now();
            submittedBy = caller;
          };
          
          // Update milestone
          let updated: Milestone = {
            milestone with
            status = #EvidenceSubmitted;
            evidence = ?evidence;
          };
          
          milestones.put(index, updated);
          #ok(updated)
        };
      };
    };
    
    public func verifyMilestone(
      verifier: Principal,
      milestoneId: Nat,
      approved: Bool,
      notes: Text
    ) : Result<Milestone> {
      
      // Check if caller is authorized verifier
      var isAuthorized = false;
      for (v in verifiers.vals()) {
        if (v == verifier) {
          isAuthorized := true;
        };
      };
      
      if (not isAuthorized) {
        return #err("Not authorized to verify milestones");
      };
      
      // Find milestone
      var foundIndex: ?Nat = null;
      var idx: Nat = 0;
      for (m in milestones.vals()) {
        if (m.id == milestoneId) {
          foundIndex := ?idx;
        };
        idx += 1;
      };
      
      switch (foundIndex) {
        case null { #err("Milestone not found") };
        case (?index) {
          let milestone = milestones.get(index);
          
          // Check status
          if (milestone.status != #EvidenceSubmitted) {
            return #err("Milestone has no evidence submitted or is already processed");
          };
          
          // Update milestone
          let updated: Milestone = {
            milestone with
            status = if (approved) #Verified else #Rejected;
            verifiedBy = ?verifier;
            verificationDate = ?Time.now();
          };
          
          milestones.put(index, updated);
          #ok(updated)
        };
      };
    };
    
    public func disburseMilestone(
      caller: Principal,
      milestoneId: Nat
    ) : Result<Nat> {
      
      // Only authorized verifiers or platform can disburse
      var isAuthorized = false;
      for (v in verifiers.vals()) {
        if (v == caller) {
          isAuthorized := true;
        };
      };
      
      if (not isAuthorized and caller != platformPrincipal) {
        return #err("Not authorized to disburse funds");
      };
      
      // Find milestone
      var foundIndex: ?Nat = null;
      var idx: Nat = 0;
      for (m in milestones.vals()) {
        if (m.id == milestoneId) {
          foundIndex := ?idx;
        };
        idx += 1;
      };
      
      switch (foundIndex) {
        case null { #err("Milestone not found") };
        case (?index) {
          let milestone = milestones.get(index);
          
          // Check status
          if (milestone.status != #Verified) {
            return #err("Milestone must be verified before disbursement");
          };
          
          // Check if enough funds are available
          let lockedAmount = totalRaised - totalDisbursed;
          if (milestone.requiredAmount > lockedAmount) {
            return #err("Insufficient funds in escrow");
          };
          
          // Update milestone
          let updated: Milestone = {
            milestone with
            status = #Disbursed;
            disbursementDate = ?Time.now();
          };
          
          milestones.put(index, updated);
          totalDisbursed += milestone.requiredAmount;
          
          #ok(milestone.requiredAmount)
        };
      };
    };
    
    // ==============================
    // Verifier Management
    // ==============================
    
    public func addVerifier(caller: Principal, newVerifier: Principal) : Result<Text> {
      if (caller != platformPrincipal) {
        return #err("Only platform can add verifiers");
      };
      
      verifiers.add(newVerifier);
      #ok("Verifier added")
    };
    
    public func getVerifiers() : [Principal] {
      Buffer.toArray(verifiers)
    };
    
    // ==============================
    // Dividend Distribution
    // ==============================
    
    public func recordDividendDistribution(
      totalAmount: Nat,
      perTokenAmount: Nat,
      recipientCount: Nat
    ) : Result<DividendDistribution> {
      
      let dividend: DividendDistribution = {
        id = nextDividendId;
        totalAmount = totalAmount;
        perTokenAmount = perTokenAmount;
        distributionDate = Time.now();
        recipientCount = recipientCount;
      };
      
      dividendHistory.add(dividend);
      nextDividendId += 1;
      
      #ok(dividend)
    };
    
    public func getDividendHistory() : [DividendDistribution] {
      Buffer.toArray(dividendHistory)
    };
    
    // ==============================
    // Stats and Queries
    // ==============================
    
    public func getStats() : EscrowStats {
      let lockedAmount = totalRaised - totalDisbursed;
      
      var completed: Nat = 0;
      var pending: Nat = 0;
      for (m in milestones.vals()) {
        switch (m.status) {
          case (#Disbursed) { completed += 1 };
          case (#Pending or #EvidenceSubmitted or #Verified) { pending += 1 };
          case (#Rejected) {};
        };
      };
      
      var totalDividends: Nat = 0;
      for (div in dividendHistory.vals()) {
        totalDividends += div.totalAmount;
      };
      
      {
        totalRaised = totalRaised;
        totalDisbursed = totalDisbursed;
        lockedAmount = lockedAmount;
        totalInvestors = investments.size();
        milestonesCompleted = completed;
        milestonesPending = pending;
        totalDividendsPaid = totalDividends;
      }
    };
    
    public func getFarmOwner() : Principal {
      farmOwner
    };
    
    public func getTokenCanister() : Principal {
      farmTokenCanister
    };
  };
}
