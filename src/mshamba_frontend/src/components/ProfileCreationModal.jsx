import React, { useState } from 'react';
import { Sprout, TrendingUp, X } from 'lucide-react';
import { mshamba_assets } from 'declarations/mshamba_assets'; // Import assets canister

export const ProfileCreationModal = ({ role, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null); // State for profile image file (Uint8Array)

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
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    let profilePictureId = "";

    if (profileImageFile) {
      try {
        profilePictureId = await mshamba_assets.uploadImage(Array.from(profileImageFile));
      } catch (error) {
        console.error("Error uploading profile image:", error);
        alert("Failed to upload profile image. Please try again.");
        return;
      }
    }

    onSubmit({ name, bio, skills: skillsArray, profilePicture: profilePictureId });
  };

  const isFarmer = role === 'Farmer';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-md m-4">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>

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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  rows="3"
                  placeholder="A little bit about your background and goals..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  placeholder="e.g., Organic Farming, Financial Analysis"
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with a comma.</p>
              </div>
              {/* New field for profile picture */}
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
