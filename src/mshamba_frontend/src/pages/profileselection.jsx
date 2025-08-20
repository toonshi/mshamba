import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, TrendingUp, Users, ArrowRight } from 'lucide-react';

const ProfileSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Sprout className="h-12 w-12 text-green-600 mr-3" />
            <span className="text-3xl font-bold text-gray-900">Mshamba</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h1>
          <p className="text-xl text-gray-600">
            Select your role to get started with the perfect dashboard for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <Link 
            to="/farmer/dashboard"
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Farmer</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get funding for your agricultural projects, track farm records, 
                set up investment opportunities, and connect with investors.
              </p>
              
              <div className="space-y-2 text-left mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Setup investment opportunities
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Track farm records and analytics
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Get professional valuations
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Connect with investors
                </div>
              </div>

              <div className="flex items-center justify-center text-green-600 font-medium group-hover:text-green-700">
                Get Started as Farmer
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Investor Card */}
          <Link 
            to="/investor/dashboard"
            className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm an Investor</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discover agricultural investment opportunities, analyze market trends, 
                and build a sustainable investment portfolio.
              </p>
              
              <div className="space-y-2 text-left mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Browse verified farm investments
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Access detailed market analysis
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Track investment performance
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Connect with farmers directly
                </div>
              </div>

              <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700">
                Get Started as Investor
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;