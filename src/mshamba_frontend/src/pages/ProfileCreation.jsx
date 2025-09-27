import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Corrected import path

const ProfileCreation = () => {
  const { actor } = useAuth(); // Get the authenticated actor
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('Farmer'); // Default role
  const [certifications, setCertifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const certsArray = certifications.split(',').map(cert => cert.trim()).filter(cert => cert !== '');
      const roleVariant = role === 'Farmer' ? { Farmer: null } : { Investor: null };

      // Use the authenticated actor
      const success = await actor.createProfile(name, bio, roleVariant, certsArray);

      if (success) {
        alert('Profile created successfully!');
        // Redirect based on the selected role
        if (role === 'Farmer') {
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
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Role:
            </label>
            <select
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Farmer">Farmer</option>
              <option value="Investor">Investor</option>
            </select>
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