import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileSelection = ({ actor, principal }) => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleSelection = async (type) => {
    setUserType(type);

    // Optional: send selection to backend canister
    if (actor) {
      await actor.registerUser(principal, type); // assuming `registerUser` exists in Motoko
    }

    // Navigate to dashboard or next page
    if (type === 'farmer') {
      navigate('/farmer/dashboard');
    } else if (type === 'investor') {
      navigate('/investor/dashboard');
    } else {
      navigate('/dashboard'); // Fallback, though should not be reached
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Select Your Profile</h2>
        <p className="mb-6 text-gray-400">Choose your role to continue</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="py-4 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            onClick={() => handleSelection('investor')}
          >
            Investor 💰
          </button>
          <button
            className="py-4 px-6 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium"
            onClick={() => handleSelection('farmer')}
          >
            Farmer 🌾
          </button>
        </div>
      </div>
    </div>
  );
};
