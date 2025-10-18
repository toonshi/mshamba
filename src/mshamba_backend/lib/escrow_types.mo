// Escrow-specific types for the Four-Wallet System

module {
  public type MilestoneStatus = {
    #Pending;
    #EvidenceSubmitted;
    #Verified;
    #Disbursed;
    #Rejected;
  };

  public type MilestoneEvidence = {
    invoice: Text;           // Invoice number or document reference
    photos: [Text];          // IPFS hashes or URLs
    gpsCoordinates: ?Text;   // GPS location of installation/work
    description: Text;       // Additional notes
    submissionDate: Int;
    submittedBy: Principal;
  };

  public type Milestone = {
    id: Nat;
    title: Text;
    description: Text;
    requiredAmount: Nat;     // Amount in e8s (smallest ICP unit)
    deadline: Int;           // Timestamp
    status: MilestoneStatus;
    evidence: ?MilestoneEvidence;
    verifiedBy: ?Principal;
    verificationDate: ?Int;
    disbursementDate: ?Int;
  };

  public type Investment = {
    id: Nat;
    investor: Principal;
    amountICP: Nat;          // Amount in e8s
    tokensReceived: Nat;
    timestamp: Int;
  };

  public type DividendDistribution = {
    id: Nat;
    totalAmount: Nat;
    perTokenAmount: Nat;
    distributionDate: Int;
    recipientCount: Nat;
  };

  public type IFODetails = {
    targetRaise: Nat;        // Goal in e8s
    currentRaised: Nat;      // Current amount raised
    tokenPrice: Nat;         // Price per token in e8s
    ifoStartDate: Int;
    ifoEndDate: Int;
    minInvestment: Nat;
    maxInvestment: ?Nat;     // Optional cap per investor
    isActive: Bool;
  };

  public type EscrowStats = {
    totalRaised: Nat;
    totalDisbursed: Nat;
    lockedAmount: Nat;
    totalInvestors: Nat;
    milestonesCompleted: Nat;
    milestonesPending: Nat;
    totalDividendsPaid: Nat;
  };

  public type Result<T> = {
    #ok: T;
    #err: Text;
  };
}
