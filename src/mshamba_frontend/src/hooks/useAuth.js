import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as backend_idl, canisterId as backend_id } from "../../../declarations/mshamba_backend";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState(null);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();

      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setIdentity(identity);

        const actor = await createActor(identity);
        setActor(actor);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setActor(null);
      }
    })();
  }, []);

  async function login() {
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: process.env.NODE_ENV === "development"
        ? `http://localhost:4943?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}` // Local II
        : "https://identity.ic0.app", // Mainnet II
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);

        const actor = await createActor(identity);
        setActor(actor);
        setIsAuthenticated(true);
      },
    });
  }

  async function createActor(identity) {
    const agent = new HttpAgent({
      identity,
      host: process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app"
        : "http://127.0.0.1:4943",
    });

    // Only fetch root key if running locally
    if (process.env.NODE_ENV !== "production") {
      try {
        await agent.fetchRootKey();
        console.log("✅ Local root key fetched");
      } catch (err) {
        console.error("⚠️ Failed to fetch root key. Is dfx running?", err);
      }
    }

    return Actor.createActor(backend_idl, {
      agent,
      canisterId: backend_id,
    });
  }

  return { isAuthenticated, actor, identity, login };
}