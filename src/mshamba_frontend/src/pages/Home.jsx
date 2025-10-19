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
  Star,
  ChevronDown
} from 'lucide-react';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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
              <a href="#faq" className={`font-medium hover:text-green-600 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600'
              }`}>
                FAQ
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
              <a href="#faq" className={`block px-3 py-2 text-base font-medium ${
                isDarkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
              }`}>
                FAQ
              </a>
              <a 
               href="/ProfileSelection"
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
                Democratizing Agricultural Finance
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
                Each farm launches its own tradeable token, like a company issuing stock. Investors buy farm shares, farmers get capital without debt, and everyone shares in the harvest through transparent blockchain technology.
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
                    24/7
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Trading Markets
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
              A simpler way to invest in farms and raise capital, powered by blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Blockchain Security",
                description: "Each farm's token runs on secure smart contracts. Automatic dividend distribution to shareholders. Locked liquidity pools ensure you can trade anytime.",
                color: "blue"
              },
              {
                icon: TrendingUp,
                title: "True Ownership",
                description: "Buy farm tokens like stocks. Earn dividends from farm profits. Sell anytime on our marketplace. Each token represents real equity in the farm.",
                color: "green"
              },
              {
                icon: Globe,
                title: "One Farm, One Token",
                description: "Every farm creates its own unique token with custom name, symbol, and supply. Just like individual companies on the stock market.",
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
                  { step: 1, title: "Register Your Farm", desc: "Share your farm details, crops, and funding goals" },
                  { step: 2, title: "Launch Your Token", desc: "Create your farm's unique stock token in seconds" },
                  { step: 3, title: "Receive Investment", desc: "Investors buy your tokens. You get capital, no debt." },
                  { step: 4, title: "Share Profits", desc: "Dividends automatically go to token holders each season" }
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
                  { step: 1, title: "Browse Farms", desc: "Explore verified farms and their performance data" },
                  { step: 2, title: "Buy Farm Tokens", desc: "Purchase shares in farms you believe in. Start with any amount." },
                  { step: 3, title: "Track Performance", desc: "Watch your portfolio grow with real-time farm updates" },
                  { step: 4, title: "Earn & Trade", desc: "Receive dividends automatically. Sell tokens anytime on our market" }
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
                We're transforming how farms access capital by turning each farm into its own publicly traded company. 
                No more high-interest loans or impossible collateral requirements.
              </p>
              <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Farmers launch their own tokens and raise funds from investors worldwide. Investors own real farm equity and earn 
                from actual harvests. Everyone wins through transparent blockchain technology that handles everything automatically.
              </p>
              
              
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

      {/* FAQ Section */}
      <div id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to know about farm tokenization
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What is a farm token?",
                answer: "A farm token is like a share in a company, but for a farm. Each farm on Mshamba creates its own unique token (using ICRC-1 standard on the Internet Computer blockchain). When you buy tokens, you own a piece of that specific farm and earn dividends from its profits."
              },
              {
                question: "Is this a loan or investment?",
                answer: "This is equity investment, not a loan. Farmers don't borrow money. They sell ownership shares in their farm. There's no debt, no interest payments, and no collateral required. Investors share both the risks and rewards of the harvest."
              },
              {
                question: "How do I earn money as an investor?",
                answer: "You earn in two ways: (1) Dividends: automatic payments from farm profits after each harvest, distributed via smart contracts, and (2) Token appreciation: you can sell your tokens on our marketplace if their value increases. Trade 24/7 with locked liquidity pools."
              },
              {
                question: "Can I sell my farm tokens anytime?",
                answer: "Yes! Unlike traditional farm investments, your tokens are liquid. Our platform has built-in liquidity pools where you can trade tokens anytime, day or night. You're never locked in."
              },
              {
                question: "How much does it cost for farmers to create a token?",
                answer: "Token creation is covered by the platform (approximately 2 trillion cycles, or ~$2.50). Farmers only need to provide their farm details and business plan. The entire token launch process takes about 7 seconds."
              },
              {
                question: "Do farmers lose control of their farm?",
                answer: "No. Selling tokens means sharing profits, not giving up management. Farmers continue to operate their farms independently. Token holders are passive investors who earn from success but don't make farming decisions."
              },
              {
                question: "How are farms verified?",
                answer: "Every farm undergoes professional assessment before listing. We verify land ownership, crop viability, and business plans. Only verified farms can launch tokens and accept investments."
              },
              {
                question: "What if a farm fails?",
                answer: "Like any investment, there's risk. That's why we recommend diversifying across multiple farms. Our verification process reduces risk, but agriculture has inherent uncertainties. Only invest what you can afford to lose."
              },
              {
                question: "Do I need to understand blockchain or crypto?",
                answer: "Not at all. We handle all the blockchain complexity behind the scenes. You'll interact with a simple interface—buy tokens, track your portfolio, and receive dividends automatically. It's designed to feel like using any modern investment app."
              },
              {
                question: "Is this legal in Kenya?",
                answer: "We're building a compliant platform for agricultural finance. Blockchain-based securities are an emerging area globally. We work within Kenya's regulatory framework and are committed to transparency with authorities as the space evolves."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  isDarkMode 
                    ? openFaqIndex === index 
                      ? 'bg-green-900 border-green-600' 
                      : 'bg-green-900/50 border-green-800 hover:border-green-700'
                    : openFaqIndex === index
                      ? 'bg-white border-green-600 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-green-400 shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                >
                  <span className={`text-lg font-semibold pr-8 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    } ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className={`px-6 pb-5 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
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
            Join thousands turning farms into tradeable assets. Simple, secure, and built for Africa.
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
            {['Blockchain Secured', 'No Debt Required', 'Automatic Dividends', 'Built for Kenya'].map((item) => (
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