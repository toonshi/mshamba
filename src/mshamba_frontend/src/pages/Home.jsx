import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Mshamba</span>
            </div>
            <Link
              to="/auth"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting Farmers with
            <span className="text-green-600"> Smart Investors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the future of agriculture financing. Farmers get the capital they need,
            investors get sustainable returns from agricultural projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth?type=farmer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              I'm a Farmer <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/auth?type=investor"
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
            >
              I'm an Investor <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Mshamba?</h2>
            <p className="text-xl text-gray-600">Bridging the gap between agriculture and investment</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Farmers</h3>
              <p className="text-gray-600">
                Access funding for your agricultural projects, get expert valuations,
                and track your farm's performance with detailed analytics.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Investors</h3>
              <p className="text-gray-600">
                Discover vetted agricultural investment opportunities with detailed
                market analysis and transparent performance tracking.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Everyone</h3>
              <p className="text-gray-600">
                Join a community focused on sustainable agriculture and responsible
                investing with complete transparency and trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;