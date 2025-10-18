import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { canisterId as mshambaBackendCanisterId, createActor as createMshambaBackendActor } from "declarations/mshamba_backend";

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
        const whitelist = [mshambaBackendCanisterId]; // Farm token ledgers will be added dynamically as needed
        const isMainnet = process.env.DFX_NETWORK === "ic" || window.location.hostname.includes("ic0.app");
        const host = isMainnet ? "https://ic0.app" : "http://localhost:4943";
        
        console.log("Connecting to Plug with host:", host);
        
        // Request connection with proper parameters
        const connected = await window.ic.plug.requestConnect({
          whitelist,
          host,
          timeout: 50000,
        });
        
        if (!connected) {
          throw new Error("Plug connection was denied");
        }
        
        // Plug wallet handles agent creation internally, including root key for local
        const principal = await window.ic.plug.agent.getPrincipal();
        setPlugPrincipal(principal);
        setIsPlugConnected(true);

        // Farm-specific token actors will be created dynamically when needed
        setPlugActor(null); // No default token actor anymore

        console.log("Plug Wallet connected successfully:", principal.toText());
      } catch (error) {
        console.error("Plug Wallet connection failed:", error);
        setIsPlugConnected(false);
        setPlugPrincipal(null);
        setPlugActor(null);
      }
    } else {
      alert("Plug Wallet not found. Please install it from https://plugwallet.ooo/");
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

  const principal = identity ? identity.getPrincipal() : null;
  
  return { isAuthenticated, actor, identity, principal, login, logout, isPlugConnected, plugPrincipal, plugActor, connectPlugWallet, disconnectPlugWallet };
}