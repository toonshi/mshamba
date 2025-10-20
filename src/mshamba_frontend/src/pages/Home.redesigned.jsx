import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is farm tokenization?",
      answer: "Farm tokenization converts farm ownership into digital tokens on the blockchain. Each token represents a share of the farm, similar to company stocks. Investors buy tokens to own a piece of the farm and earn from its profits."
    },
    {
      question: "How do farmers benefit?",
      answer: "Farmers get capital without debt. They maintain farm control while selling equity tokens to investors. Funds go directly to the farm, no middlemen. Plus, they build a global investor base."
    },
    {
      question: "How do investors earn returns?",
      answer: "Investors earn dividends from farm profits, distributed automatically through smart contracts. Tokens can also be sold on our marketplace. Returns typically range from 15-30% annually, depending on the farm."
    },
    {
      question: "Is my investment secure?",
      answer: "Yes. All transactions run on the Internet Computer blockchain. Smart contracts ensure automatic, transparent profit distribution. Farms are verified before listing. Escrow mechanisms protect investor funds."
    },
    {
      question: "What's the minimum investment?",
      answer: "You can start investing with as little as 1000 KSH (approximately $8 USD). This makes farm investment accessible to everyone, not just wealthy individuals."
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-md border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/Mshamba Logo.jpg" alt="Mshamba" className="h-8 w-8" />
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mshamba
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                How It Works
              </a>
              <a href="#faq" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                FAQ
              </a>
              <Link
                to="/profile-selection"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#how-it-works" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                How It Works
              </a>
              <a href="#faq" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                FAQ
              </a>
              <Link
                to="/profile-selection"
                className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className={`text-5xl sm:text-6xl font-bold leading-tight mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Invest in Real Farms.
                <span className="block text-green-600 mt-2">Own Real Assets.</span>
              </h1>
              <p className={`text-xl mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Each farm launches its own tradeable token, like a company issuing stock. Investors buy farm shares, farmers get capital without debt, and everyone shares in the harvest through transparent blockchain technology.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/profile-selection"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all hover:shadow-lg flex items-center justify-center"
                >
                  Start Investing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all border-2 flex items-center justify-center ${
                    isDarkMode 
                      ? 'border-gray-700 text-white hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Learn More
                </a>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-8">
                <div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    50+
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Farms Listed
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    KSH 10M+
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Invested
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    25%
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg. Annual Return
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
              <img 
                src="images/Kenyan Farmers.png"
                alt="Kenyan farmers"
                className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition - Clean Text Only */}
      <div className={`py-20 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Mshamba Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For Farmers",
                points: [
                  "Get capital without debt",
                  "Keep control of your farm",
                  "No middlemen or banks",
                  "Build investor relationships"
                ]
              },
              {
                title: "For Investors",
                points: [
                  "Start from 1000 KSH",
                  "Earn from real harvests",
                  "Trade tokens anytime",
                  "Full transparency"
                ]
              },
              {
                title: "Built on Blockchain",
                points: [
                  "Automatic dividends",
                  "Verified transactions",
                  "Secure ownership",
                  "No manipulation"
                ]
              }
            ].map((section, index) => (
              <div key={index} className={`p-8 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Simple, transparent, and fast
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                number: "1",
                title: "Choose Your Role",
                description: "Sign up as a farmer to raise capital, or as an investor to build your portfolio."
              },
              {
                number: "2",
                title: "Browse or List Farms",
                description: "Farmers list their farms with details. Investors browse verified opportunities."
              },
              {
                number: "3",
                title: "Tokenize or Invest",
                description: "Farmers create farm tokens. Investors buy tokens with ICP or ckUSDT."
              },
              {
                number: "4",
                title: "Track & Earn",
                description: "Monitor farm performance. Receive automatic dividend payments from harvests."
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section (Keep the beautiful one) */}
      <div id="faq" className={`py-20 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all ${
                  isDarkMode ? 'bg-gray-900' : 'bg-white'
                } shadow-sm hover:shadow-md`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className={`px-6 pb-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Get Started?
          </h2>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of farmers and investors transforming agriculture in Kenya
          </p>
          <Link
            to="/profile-selection"
            className="inline-flex items-center bg-green-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all hover:shadow-lg"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/images/Mshamba Logo.jpg" alt="Mshamba" className="h-8 w-8" />
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mshamba
              </span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Mshamba. Built on Internet Computer.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
