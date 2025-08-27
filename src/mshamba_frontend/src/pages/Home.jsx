import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  Smartphone,
  Globe,
  BarChart3,
  Leaf,
  Star
} from 'lucide-react';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const themeClasses = isDarkMode 
    ? 'bg-green-950 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isDarkMode 
        ? 'bg-green-950/95 backdrop-blur-md border-b-2 border-green-700'
        : 'bg-white/95 backdrop-blur-md border-b-2 border-green-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                 src="/images/Mshamba Logo.jpg"
                alt="Mshamba Logo" 
                className="h-8 w-8 mr-3"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Mshamba
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600'
              }`}>
                Features
              </a>
              <a href="#how-it-works" className={`font-medium hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600'
              }`}>
                How it works
              </a>
              <a href="#about" className={`font-medium hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600'
              }`}>
                About
              </a>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-green-900 text-yellow-400 hover:bg-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <a 
                 href="/profile-selection"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'bg-green-900 text-yellow-400 hover:bg-green-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${
            isDarkMode ? 'bg-green-950 border-t border-green-800' : 'bg-white border-t border-gray-100'
          }`}>
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#features" className={`block px-3 py-2 text-base font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
              }`}>
                Features
              </a>
              <a href="#how-it-works" className={`block px-3 py-2 text-base font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
              }`}>
                How it works
              </a>
              <a href="#about" className={`block px-3 py-2 text-base font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
              }`}>
                About
              </a>
              <a 
               href="/profile-selection"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors inline-block text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${
                isDarkMode 
                  ? 'bg-green-900/40 text-green-300 border border-green-800' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                <Leaf className="h-4 w-4 mr-2" />
                Revolutionizing Agricultural Finance
              </div>

              <h1 className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Farm smarter,
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  {' '}invest better
                </span>
              </h1>

              <p className={`text-xl mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Connect farmers with investors through blockchain-powered tokenization. 
                No more predatory loans. Just transparent, profitable partnerships that grow Kenya's agricultural future.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a 
                  href="/auth?type=investor"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                >
                  Start Investing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a 
                  href="/auth?type=farmer"
                  className={`px-8 py-4 rounded-full text-lg font-semibold border-2 transition-all duration-300 hover:shadow-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'border-green-600 text-green-400 hover:bg-green-600 hover:text-white' 
                      : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  List Your Farm
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    37%
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Kenya's GDP from Agriculture
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    5M+
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Smallholder Farmers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    Zero
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Collateral Required
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                <img 
                  src="images/Kenyan Farmers.png"
                  alt="Kenyan farmers working in green fields"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                />
                
                {/* Floating Card */}
                <div className={`absolute top-1/2 -right-6 p-3 rounded-xl shadow-xl ${
                  isDarkMode ? 'bg-green-900 border border-green-700' : 'bg-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Blockchain Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={`py-20 ${isDarkMode ? 'bg-green-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose Mshamba?
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Breaking free from traditional lending through blockchain innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Blockchain Security",
                description: "All transactions secured by Internet Computer Protocol with transparent, immutable records.",
                color: "blue"
              },
              {
                icon: TrendingUp,
                title: "Real Returns",
                description: "Share in actual farm profits with average returns of 15-25% annually through tokenized ownership.",
                color: "green"
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Connect Kenyan farmers with worldwide investors, democratizing agricultural finance.",
                color: "purple"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isDarkMode ? 'bg-green-900 border border-green-700' : 'bg-white shadow-lg'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === 'blue' ? 'bg-blue-100' :
                  feature.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <feature.icon className={`h-8 w-8 ${
                    feature.color === 'blue' ? 'text-blue-600' :
                    feature.color === 'green' ? 'text-green-600' : 'text-purple-600'
                  }`} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Simple steps to transform farming through tokenization
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Farmers */}
            <div>
              <h3 className={`text-2xl font-bold mb-8 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <img src="/images/Mshamba Logo.jpg" alt="Farmer icon" className="h-6 w-6" />
                </div>
                For Farmers
              </h3>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: "Register Your Farm", desc: "Submit farm details, crops, and funding needs" },
                  { step: 2, title: "Get Verified", desc: "Professional assessment and blockchain verification" },
                  { step: 3, title: "Raise Funds", desc: "Investors buy tokens representing farm shares" },
                  { step: 4, title: "Share Profits", desc: "Distribute returns to token holders transparently" }
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start space-x-4">
                    <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                      </h4>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Investors */}
            <div>
              <h3 className={`text-2xl font-bold mb-8 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                For Investors
              </h3>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: "Browse Farms", desc: "Explore verified agricultural opportunities" },
                  { step: 2, title: "Analyze & Invest", desc: "Review farm data and purchase tokens" },
                  { step: 3, title: "Track Performance", desc: "Monitor your investments in real-time" },
                  { step: 4, title: "Earn Returns", desc: "Receive profits automatically via smart contracts" }
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                      </h4>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                About Mshamba
              </h2>
              <p className={`text-lg mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Mshamba is revolutionizing agricultural finance in Kenya by connecting farmers directly with investors 
                through blockchain-powered tokenization. We're breaking the cycle of predatory lending that has trapped 
                farmers for generations.
              </p>
              <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Built on the Internet Computer Protocol, our platform enables transparent, secure investment 
                opportunities that benefit both farmers and investors while supporting Kenya's agricultural backbone.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                    Mission
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    End predatory lending in agriculture
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                    Vision
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Democratize agricultural investment
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/images/Tomatoes farming.png"
                alt="Modern farming with technology"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent`}></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-sm font-medium opacity-90">Empowering Farmers</div>
                <div className="text-2xl font-bold">Building Kenya's Future</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Transform Agriculture?
          </h2>
          <p className={`text-xl mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of farmers and investors building Kenya's agricultural future through blockchain innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a 
               href="/profile-selection"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-xl"
            >
              Start Your Journey
            </a>
           
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {['Blockchain Secured', 'Zero Collateral', 'Transparent Returns', 'Africa-First'].map((item) => (
              <div key={item} className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;