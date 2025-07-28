import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff, Sprout, Shield } from 'lucide-react';
import { useState } from 'react';

export const Auth = ({ onBack, mode = 'login', onModeChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'investor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Pass user type to parent component for dashboard routing
      onBack(formData.userType);
    }, 1500);
  };

  const handleInternetIdentity = async () => {
    setIsLoading(true);
    // Simulate Internet Identity authentication
    setTimeout(() => {
      alert('Internet Identity authentication successful!');
      setIsLoading(false);
      // Default to investor for Internet Identity (can be changed later)
      onBack('investor');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
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
          
          <h2 className="text-xl font-semibold mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400">
            {mode === 'login' 
              ? 'Sign in to your account' 
              : 'Join the agricultural investment revolution'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'investor' }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.userType === 'investor'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">💰</div>
                      <div className="text-sm font-medium">Investor</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'farmer' }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.userType === 'farmer'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">🌾</div>
                      <div className="text-sm font-medium">Farmer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-green-500"
                  required
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-green-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:border-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:border-green-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>

          {/* Internet Identity Button */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInternetIdentity}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Internet Identity</span>
          </button>

          {/* Mode Switch */}
          <div className="text-center pt-4">
            <span className="text-gray-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-green-500 hover:text-green-400 font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};