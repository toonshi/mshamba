import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, TrendingUp } from 'lucide-react';
import { mshamba_assets } from 'declarations/mshamba_assets'; // Import assets canister
import { mshamba_backend } from 'declarations/mshamba_backend'; // Import backend canister
import { AuthClient } from '@dfinity/auth-client'; // Import AuthClient
import { WalletConnect } from '../components/WalletConnect.jsx'; // Assuming WalletConnect is still needed

const CreateProfile = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null); // State for profile image file (Uint8Array)
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("type") || "Investor"; // Default to Investor if role not specified

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        setProfileImageFile(uint8Array);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setProfileImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    let profilePictureId = "";

    if (profileImageFile) {
      try {
        profilePictureId = await mshamba_assets.uploadImage(Array.from(profileImageFile));
      } catch (error) {
        console.error("Error uploading profile image:", error);
        alert("Failed to upload profile image. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      const profileRole = role === "Farmer" ? { Farmer: null } : { Investor: null };

      const result = await mshamba_backend.createProfile(
        name,
        bio,
        profileRole,
        skillsArray,
        profilePictureId
      );

      if (result.Ok) {
        console.log("Profile created successfully!");
        if (role === "Farmer") {
          navigate('/farmer/dashboard');
        } else if (role === "Investor") {
          navigate('/investor/dashboard');
        } else {
          // Fallback or error handling if role is not recognized
          navigate('/dashboard'); // Or a more appropriate fallback route
        }
      } else {
        console.error("Failed to create profile:", result.Err);
        const errorMessage = result.Err && typeof result.Err === 'object' ? Object.keys(result.Err)[0] : 'Unknown error';
        alert(`Failed to create profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("An error occurred while creating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFarmer = role === 'Farmer';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8 w-full max-w-md">
        <div className="p-6 relative">
          <div className="text-center mb-6">
            <div className={`inline-block p-3 rounded-full bg-gradient-to-r ${isFarmer ? 'from-green-500 to-teal-500' : 'from-blue-500 to-indigo-500'}`}>
              {isFarmer ? <Sprout className="w-8 h-8 text-white" /> : <TrendingUp className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold mt-4">Create Your {role} Profile</h2>
            <p className="text-gray-500">Tell us a bit about yourself.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  rows="3"
                  placeholder="A little bit about your background and goals..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
                <input
                  type="text"
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="e.g., Organic Farming, Financial Analysis"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with a comma.</p>
              </div>
              {/* New field for profile picture */}
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-1">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div className="mt-6">
              <WalletConnect />
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:opacity-50" disabled={isLoading}>
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
