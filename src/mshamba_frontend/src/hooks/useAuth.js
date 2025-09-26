import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { canisterId as mshambaBackendCanisterId, createActor as createMshambaBackendActor } from "declarations/mshamba_backend";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setIdentity(identity);
        const actor = await createMshambaBackendActor(mshambaBackendCanisterId, { agentOptions: { identity } });
        setActor(actor);
        setIsAuthenticated(true);
      }
    });
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.NODE_ENV === "development"
        ? `http://localhost:4943?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`
        : "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        const actor = await createMshambaBackendActor(mshambaBackendCanisterId, { agentOptions: { identity } });
        setActor(actor);
        setIsAuthenticated(true);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setActor(null);
    setIdentity(null);
  };

  return { isAuthenticated, actor, identity, login, logout };
}