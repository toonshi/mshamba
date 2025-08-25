actor {
  // This will be our custom token factory
  // It will be responsible for deploying ICRC-1 ledgers, indices, and archives
  // and correctly setting their controllers.

  public func greet() : async Text {
    "Hello from custom_token_factory!"
  };
};