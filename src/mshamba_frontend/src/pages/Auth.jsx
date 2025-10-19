import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ArrowLeft, Shield, User, TrendingUp, Moon, Sun } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define Role type based on mshamba_backend.did
const Role = {
  Farmer: null,
  Investor: null,
};

export const Auth = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, isAuthenticated, login: authLogin, identity, logout: authLogout } = useAuth(); // Use the useAuth hook

  // Read ?type=farmer or ?type=investor from URL
  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("type");

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const initAuthAndProfileCheck = async () => {
      if (isAuthenticated && actor) {
        const principal = identity.getPrincipal();
        console.log("Authenticated principal (useEffect):", principal.toText());

        // Check if profile exists using the authenticated actor
        const profileResult = await actor.getProfile(principal);
        console.log("Profile result (useEffect):", profileResult);

        if (profileResult.length === 0) { // No profile found
          console.log("No profile found, creating profile automatically...");
          
          // Auto-create profile based on user type
          const roles = [];
          if (userType === "farmer") {
            roles.push({ Farmer: null });
          } else if (userType === "investor") {
            roles.push({ Investor: null });
          } else {
            // Default to investor if no type specified
            roles.push({ Investor: null });
          }

          try {
            const success = await actor.createProfile(
              "User", // Default name, can be updated later
              "Welcome to Mshamba", // Default bio
              roles,
              [] // No certifications by default
            );

            if (success) {
              console.log("Profile created successfully!");
              // Redirect to appropriate dashboard
              if (userType === "farmer") {
                navigate("/farmer/dashboard");
              } else if (userType === "investor") {
                navigate("/investor/dashboard");
              } else {
                navigate("/");
              }
            } else {
              console.error("Failed to create profile");
              alert("Failed to create profile. Please try again.");
            }
          } catch (error) {
            console.error("Error creating profile:", error);
            alert("Error creating profile: " + error.message);
          }
        } else { // Profile exists, check if role needs to be added
          console.log("Profile found, checking roles...");
          const profile = profileResult[0];
          const hasFarmerRole = profile.roles.some(r => 'Farmer' in r);
          const hasInvestorRole = profile.roles.some(r => 'Investor' in r);

          let roleUpdateNeeded = false;
          let newRole = null;

          if (userType === "farmer" && !hasFarmerRole) {
            roleUpdateNeeded = true;
            newRole = { Farmer: null };
          } else if (userType === "investor" && !hasInvestorRole) {
            roleUpdateNeeded = true;
            newRole = { Investor: null };
          }

          if (roleUpdateNeeded) {
            console.log(`Adding ${userType} role...`);
            try {
              const success = await actor.addRole(newRole);
              if (success) {
                console.log("Role added successfully!");
              } else {
                console.error("Failed to add role to profile");
                alert("Failed to update your profile with the new role.");
              }
            } catch (error) {
              console.error("Error adding role:", error);
              alert("Error updating profile: " + error.message);
            }
          }

          // Redirect after checking/updating role
          console.log("Redirecting after role check...");
          if (userType === "farmer") {
            navigate("/farmer/dashboard");
          } else if (userType === "investor") {
            navigate("/investor/dashboard");
          } else {
            navigate("/"); // fallback
          }
        }
      }
    };
    initAuthAndProfileCheck();
  }, [isAuthenticated, actor, navigate, userType, identity]);

  const handleInternetIdentity = async () => {
    setIsLoading(true);
    await authLogin(); // Use the login function from useAuth
    setIsLoading(false);
    // The useEffect will handle profile check and redirection after authLogin updates state
  };

  const handleLogout = async () => {
    await authLogout(); // Use the logout function from useAuth
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack(); // Use the prop function if provided
    } else {
      navigate('/'); // Fallback to navigate to home
    }
  };

  const getRoleInfo = () => {
    if (userType === "farmer") {
      return {
        icon: User,
        title: "Farmer Authentication",
        description: "Access your farm management dashboard"
      };
    } else if (userType === "investor") {
      return {
        icon: TrendingUp,
        title: "Investor Authentication", 
        description: "View and manage your investments"
      };
    }
    return {
      icon: User,
      title: "User Authentication",
      description: "Sign in to continue"
    };
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Theme classes based on HomePage pattern
  const themeClasses = isDarkMode 
    ? 'bg-green-950 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses} relative overflow-hidden`}>
      {/* Background decorative elements - adapted for both themes */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
          isDarkMode ? 'bg-green-500' : 'bg-green-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 ${
          isDarkMode ? 'bg-green-600' : 'bg-green-500'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500 ${
          isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'
        }`}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header with back button and theme toggle */}
          <div className="flex justify-between items-center mb-8">
            {/* Back button */}
            <button
               onClick={handleBackToHome}
              className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-sm border group ${
                isDarkMode 
                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                  : 'hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-green-900/40 text-yellow-400 hover:bg-green-800/60 border border-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Main card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/95 border-gray-200 shadow-xl'
          }`}>
            {/* Header */}
            <div className="text-center mb-8">
              {/* Logo and brand */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl blur-lg opacity-60`}></div>
                  <div className={`relative backdrop-blur-sm p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'
                  }`}>
                    <img 
                       src="/images/Mshamba Logo.jpg"
                      alt="Mshamba Logo" 
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Mshamba
              </h1>
              
              {/* Role-specific header */}
              <div className="flex items-center justify-center mb-3">
                <RoleIcon className={`w-5 h-5 mr-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`} />
                <h2 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {roleInfo.title}
                </h2>
              </div>
              
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {roleInfo.description}
              </p>
            </div>

            {/* Authentication section */}
            {!isAuthenticated ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className={`text-lg font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Secure Authentication</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Sign in with Internet Identity for decentralized security
                  </p>
                </div>

                <button
                  onClick={handleInternetIdentity}
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`relative backdrop-blur-sm py-4 rounded-xl font-medium transition-all duration-300 border flex items-center justify-center space-x-3 ${
                    isDarkMode 
                      ? 'bg-white/10 border-white/20 group-hover:border-white/30' 
                      : 'bg-white/20 border-white/30 group-hover:border-white/40'
                  }`}>
                    <div className="relative">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Shield className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    <span className="text-white">
                      {isLoading ? 'Signing In...' : 'Sign in with Internet Identity'}
                    </span>
                  </div>
                </button>

                {/* Security info */}
                <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-gray-50/80 border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className={`font-medium mb-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Decentralized Security</p>
                      <p className={`text-xs leading-relaxed ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Internet Identity provides cryptographic authentication without passwords or personal data collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Authenticated state */
              <div className="text-center space-y-6">
                <div className={`backdrop-blur-sm rounded-xl p-6 border ${
                  isDarkMode 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <Shield className={`w-8 h-8 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Authentication Successful
                  </h3>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    You are now signed in as:
                  </p>
                  <div className={`backdrop-blur-sm rounded-lg p-3 border ${
                    isDarkMode 
                      ? 'bg-black/20 border-white/10' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                                      <p className={`font-mono text-sm break-all ${
                                        isDarkMode ? 'text-green-400' : 'text-green-600'
                                      }`}>
                                        {identity.getPrincipal().toText()}
                                      </p>                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (userType === "farmer") {
                        navigate("/farmer/dashboard");
                      } else if (userType === "investor") {
                        navigate("/investor/dashboard");
                      } else {
                        navigate("/");
                      }
                    }}
                    className="w-full group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className={`relative backdrop-blur-sm py-3 rounded-xl font-medium transition-all duration-300 border ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 group-hover:border-white/30' 
                        : 'bg-white/20 border-white/30 group-hover:border-white/40'
                    }`}>
                      <span className="text-white">Continue to Dashboard</span>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`w-full backdrop-blur-sm py-3 rounded-xl font-medium transition-all duration-300 border ${
                      isDarkMode 
                        ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/30 text-red-400' 
                        : 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600'
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className={`text-center mt-6 text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            <p>Powered by Internet Computer Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
};