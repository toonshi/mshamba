import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from '@dfinity/auth-client';
import { mshamba_backend } from 'declarations/mshamba_backend';
import { ProfileCreationModal } from '../components/ProfileCreationModal';
import { 
  Sprout, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Sun,
  Moon,
  ArrowLeft,
  Users,
  BarChart3,
  Shield,
  Leaf
} from 'lucide-react';

const ProfileSelection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [authClient, setAuthClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
    };
    initAuth();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (profileData) => {
    if (!authClient) return;

    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();

    const profileResult = await mshamba_backend.createProfile(
      profileData.name,
      profileData.bio,
      { [selectedRole]: null },
      profileData.skills
    );

    if (profileResult.Ok) {
      setIsModalOpen(false);
      navigate('/dashboard');
    } else {
      console.error("Failed to create profile:", profileResult.Err);
      // Handle error appropriately
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-green-950 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses} relative overflow-hidden`}>
      {isModalOpen && (
        <ProfileCreationModal 
          role={selectedRole}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-16 left-16 w-56 h-56 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
          isDarkMode ? 'bg-green-500' : 'bg-green-400'
        }`}></div>
        <div className={`absolute bottom-16 right-16 w-56 h-56 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 ${
          isDarkMode ? 'bg-green-600' : 'bg-green-500'
        }`}></div>
      </div>

      {/* Header with back button and theme toggle */}
      <div className="relative z-10 flex justify-between items-center p-3 sm:p-4">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm border group ${
            isDarkMode 
              ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
              : 'hover:bg-gray-100 border-gray-200 hover:border-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        </button>

        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-green-900/40 text-yellow-400 hover:bg-green-800/60 border border-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-0">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl blur-md opacity-60"></div>
                <div className={`relative backdrop-blur-sm p-2 rounded-xl border ${
                  isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'
                }`}>
                  <img 
                    src="/images/Mshamba Logo.jpg"
                    alt="Mshamba Logo" 
                    className="w-8 h-8 sm:w-9 sm:h-9"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Mshamba
            </h1>

            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 ${
              isDarkMode 
                ? 'bg-green-900/40 text-green-300 border border-green-800' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <Leaf className="h-3 w-3 mr-1.5" />
              Choose Your Journey
            </div>

            <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How do you want to
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {' '}grow with us?
              </span>
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Select your role to unlock the perfect dashboard designed for your agricultural journey
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Farmer Card */}
            <div 
              onClick={() => handleRoleSelection('Farmer')}
              className={`cursor-pointer group backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 hover:border-green-500/30' 
                  : 'bg-white/95 border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="relative bg-gradient-to-r from-green-600 to-green-500 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                    <Sprout className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  I'm a Farmer
                </h3>
                <p className={`text-sm sm:text-base mb-4 leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Get funding for your projects, track farm records, and connect with global investors.
                </p>

                <div className="space-y-2 mb-4">
                  {[
                    { icon: Shield, text: "Tokenize your farm assets" },
                    { icon: BarChart3, text: "Track farm analytics & records" },
                    { icon: TrendingUp, text: "Access transparent funding" },
                    { icon: Users, text: "Connect with global investors" }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center text-left">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center mr-2 flex-shrink-0 ${
                        isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                      </div>
                      <span className={`text-xs sm:text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative py-2 sm:py-3 rounded-lg font-medium border flex items-center justify-center space-x-2 text-white">
                    <span className="text-xs sm:text-sm font-semibold">
                      Start as Farmer
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Investor Card */}
            <div 
              onClick={() => handleRoleSelection('Investor')}
              className={`cursor-pointer group backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 hover:border-blue-500/30' 
                  : 'bg-white/95 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  I'm an Investor
                </h3>
                <p className={`text-sm sm:text-base mb-4 leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Discover verified farm opportunities, analyze trends, and build your portfolio.
                </p>

                <div className="space-y-2 mb-4">
                  {[
                    { icon: Shield, text: "Browse verified farm tokens" },
                    { icon: BarChart3, text: "Access detailed market analysis" },
                    { icon: TrendingUp, text: "Track investment performance" },
                    { icon: Users, text: "Connect with farmers directly" }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center text-left">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center mr-2 flex-shrink-0 ${
                        isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <span className={`text-xs sm:text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative py-2 sm:py-3 rounded-lg font-medium border flex items-center justify-center space-x-2 text-white">
                    <span className="text-xs sm:text-sm font-semibold">
                      Start as Investor
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-10 text-center">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5 text-xs sm:text-sm">
              {[
                'Blockchain Secured', 
                'Zero Collateral Required', 
                'Transparent Returns', 
                'Africa-First Platform'
              ].map((item) => (
                <div key={item} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1.5" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
