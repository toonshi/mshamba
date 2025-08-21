import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ArrowLeft, Shield, Sprout } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mshamba_backend as backendActor } from "declarations/mshamba_backend"; // New import

export const Auth = ({ onBack }) => {
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?type=farmer or ?type=investor from URL
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("type"); 

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const id = client.getIdentity();
        setPrincipal(id.getPrincipal().toText());

        // If already logged in, redirect them immediately
        if (userType === "farmer") {
          navigate("/farmer/dashboard");
        } else if (userType === "investor") {
          navigate("/investor/dashboard");
        }
      }
    };
    initAuth();
  }, [navigate, userType]);

  const handleInternetIdentity = async () => {
    setIsLoading(true);
    await authClient.login({
      identityProvider: 'https://identity.ic0.app/#authorize',
      onSuccess: async () => {
        const id = authClient.getIdentity();
        const currentPrincipal = id.getPrincipal();
        setPrincipal(currentPrincipal.toText());
        setIsLoading(false);

        // Check if profile exists, if not, create one
        try {
          const profile = await backendActor.getProfile(currentPrincipal);
          if (!profile) {
            let role;
            if (userType === "farmer") {
              role = { farmer: null }; // Motoko variant type
            } else if (userType === "investor") {
              role = { investor: null }; // Motoko variant type
            } else {
              // Default role or handle error if no userType
              console.warn("No user type specified, defaulting to investor role for profile creation.");
              role = { investor: null };
            }

            await backendActor.createProfile(
              "New User", // Default name
              "No bio yet", // Default bio
              role,
              [] // Default certifications
            );
            console.log("Profile created for new user:", currentPrincipal.toText());
          }
        } catch (error) {
          console.error("Error checking or creating profile:", error);
          // Handle error, maybe show a message to the user
        }

        // Redirect based on role chosen on Home.jsx
        if (userType === "farmer") {
          navigate("/farmer/dashboard");
        } else if (userType === "investor") {
          navigate("/investor/dashboard");
        } else {
          navigate("/"); // fallback
        }
      },
    });
  };

  const handleLogout = async () => {
    await authClient.logout();
    setPrincipal(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 relative">
          <button
            onClick={() => onBack()}
            className="absolute top-6 left-6 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-green-500 mr-2" />
            <h1 className="text-2xl font-bold">Mshamba</h1>
          </div>

          <h2 className="text-xl font-semibold mb-2">Sign in with Internet Identity</h2>
          <p className="text-gray-400">Securely authenticate using ICP Internet Identity</p>
        </div>

        <button
          onClick={handleInternetIdentity}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span>{isLoading ? 'Signing In...' : 'Sign in with Internet Identity'}</span>
        </button>

        {principal && (
          <div className="mt-6 text-center">
            <p className="mb-2 text-gray-400">Logged in as:</p>
            <p className="mb-4 text-green-500 font-mono">{principal}</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
