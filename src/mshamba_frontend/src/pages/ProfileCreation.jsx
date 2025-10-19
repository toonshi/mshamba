import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Corrected import path

const ProfileCreation = () => {
  const { actor } = useAuth(); // Get the authenticated actor
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [roles, setRoles] = useState({ Farmer: false, Investor: false }); // Multiple roles
  const [certifications, setCertifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (roleName) => {
    setRoles({ ...roles, [roleName]: !roles[roleName] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const certsArray = certifications.split(',').map(cert => cert.trim()).filter(cert => cert !== '');
      
      // Convert selected roles to array of variant types
      const rolesArray = [];
      if (roles.Farmer) rolesArray.push({ Farmer: null });
      if (roles.Investor) rolesArray.push({ Investor: null });

      if (rolesArray.length === 0) {
        setError('Please select at least one role.');
        setLoading(false);
        return;
      }

      // Use the authenticated actor
      const success = await actor.createProfile(name, bio, rolesArray, certsArray);

      if (success) {
        alert('Profile created successfully!');
        // Redirect based on primary role (prefer Farmer if both selected)
        if (roles.Farmer) {
          navigate('/farmer/dashboard');
        } else {
          navigate('/investor/dashboard');
        }
      } else {
        setError('Failed to create profile. Please try again.');
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">
              Bio:
            </label>
            <textarea
              id="bio"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Roles (select all that apply):
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roles.Farmer}
                  onChange={() => handleRoleChange('Farmer')}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Farmer (I grow crops and need funding)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roles.Investor}
                  onChange={() => handleRoleChange('Investor')}
                  className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Investor (I want to invest in farms)</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="certifications" className="block text-gray-700 text-sm font-bold mb-2">
              Certifications (comma-separated):
            </label>
            <input
              type="text"
              id="certifications"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;