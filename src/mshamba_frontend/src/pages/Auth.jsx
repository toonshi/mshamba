import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

import { ArrowLeft, Shield, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Auth = ({ onBack }) => {
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const id = client.getIdentity();
        setPrincipal(id.getPrincipal().toText());
      }
    };
    initAuth();
  }, []);

  const handleInternetIdentity = async () => {
    setIsLoading(true);
    await authClient.login({
      identityProvider: 'https://identity.ic0.app/#authorize',
      onSuccess: async () => {
        const id = authClient.getIdentity();
        setPrincipal(id.getPrincipal().toText());
        setIsLoading(false);
        // Navigate to profile selection page
        navigate('/profile');
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
            <h1 className="text-2xl font-bold">AgriVest</h1>
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
