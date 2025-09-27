import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { canisterId as mshambaBackendCanisterId, createActor as createMshambaBackendActor } from "declarations/mshamba_backend";
import { canisterId as icrc1LedgerCanisterId, createActor as createIcrc1LedgerActor } from "declarations/icrc1_ledger";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState(null); // Will be set to authenticated actor
  const [identity, setIdentity] = useState(null);
  const [authClient, setAuthClient] = useState(null);

  // Plug Wallet states
  const [isPlugConnected, setIsPlugConnected] = useState(false);
  const [plugPrincipal, setPlugPrincipal] = useState(null);
  const [plugActor, setPlugActor] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      // Create an unauthenticated agent and actor initially
      const unauthenticatedAgent = new HttpAgent({
        host: process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943",
      });
      if (process.env.DFX_NETWORK !== "ic") {
        await unauthenticatedAgent.fetchRootKey();
      }
      const unauthenticatedActor = createMshambaBackendActor(mshambaBackendCanisterId, { agent: unauthenticatedAgent });
      setActor(unauthenticatedActor); // Set initial actor to unauthenticated

      if (await client.isAuthenticated()) {
        const authenticatedIdentity = client.getIdentity();
        setIdentity(authenticatedIdentity);
        const authenticatedAgent = new HttpAgent({
          identity: authenticatedIdentity,
          host: process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943",
        });
        if (process.env.DFX_NETWORK !== "ic") {
          await authenticatedAgent.fetchRootKey();
        }
        const authenticatedActor = createMshambaBackendActor(mshambaBackendCanisterId, { agent: authenticatedAgent });
        setActor(authenticatedActor); // Update actor to authenticated
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "local"
        ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`
        : "https://identity.ic0.app",
      onSuccess: async () => {
        const authenticatedIdentity = authClient.getIdentity();
        setIdentity(authenticatedIdentity);
        const authenticatedAgent = new HttpAgent({
          identity: authenticatedIdentity,
          host: process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943",
        });
        if (process.env.DFX_NETWORK !== "ic") {
          await authenticatedAgent.fetchRootKey();
        }
        const authenticatedActor = createMshambaBackendActor(mshambaBackendCanisterId, { agent: authenticatedAgent });
        setActor(authenticatedActor); // Update actor to authenticated
        setIsAuthenticated(true);
      },
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    // Re-initialize with an unauthenticated actor after logout
    const unauthenticatedAgent = new HttpAgent({
      host: process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943",
    });
    if (process.env.DFX_NETWORK !== "ic") {
      await unauthenticatedAgent.fetchRootKey();
    }
    const unauthenticatedActor = createMshambaBackendActor(mshambaBackendCanisterId, { agent: unauthenticatedAgent });
    setActor(unauthenticatedActor);
    setIdentity(null);
  };

  const connectPlugWallet = async () => {
    if (window.ic && window.ic.plug) {
      try {
        const whitelist = [mshambaBackendCanisterId, icrc1LedgerCanisterId]; // Add other ledger canister IDs as needed
        await window.ic.plug.requestConnect({
          whitelist,
          host: process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://localhost:4943",
        });
        const principal = await window.ic.plug.agent.getPrincipal();
        setPlugPrincipal(principal);
        setIsPlugConnected(true);

        // Create an actor for the ICRC-1 ledger using Plug's agent
        const plugIcrc1Actor = createIcrc1LedgerActor(icrc1LedgerCanisterId, { agent: window.ic.plug.agent });
        setPlugActor(plugIcrc1Actor);

        console.log("Plug Wallet connected:", principal.toText());
      } catch (error) {
        console.error("Plug Wallet connection failed:", error);
        setIsPlugConnected(false);
        setPlugPrincipal(null);
        setPlugActor(null);
      }
    } else {
      alert("Plug Wallet not found. Please install it.");
    }
  };

  const disconnectPlugWallet = async () => {
    if (window.ic && window.ic.plug) {
      try {
        await window.ic.plug.disconnect();
        setIsPlugConnected(false);
        setPlugPrincipal(null);
        setPlugActor(null);
        console.log("Plug Wallet disconnected.");
      } catch (error) {
        console.error("Plug Wallet disconnection failed:", error);
      }
    }
  };

  return { isAuthenticated, actor, identity, login, logout, isPlugConnected, plugPrincipal, plugActor, connectPlugWallet, disconnectPlugWallet };
}