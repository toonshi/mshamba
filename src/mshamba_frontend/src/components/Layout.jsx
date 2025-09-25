import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Users, 
  BarChart3, 
  User,
  LogIn,
  LogOut,
  TrendingUp,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children, userType, userName = "User" }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { login, logout, isAuthenticated } = useAuth();
  
  const farmerNavItems = [
    { path: '/farmer/dashboard', icon: LayoutDashboard, label: 'Farm Profile' },
    { path: '/farmer/dashboard/records', icon: FileText, label: 'Setup Investment' },
    //{ path: '/farmer/dashboard/setup-investment', icon: DollarSign, label: 'Setup Investment' },
    { path: '/farmer/dashboard/valuation', icon: TrendingUp, label: 'Valuation Report' },
    { path: '/farmer/dashboard/investors', icon: Users, label: 'Investors List' },
    { path: '/farmer/dashboard/graphs', icon: BarChart3, label: 'Analytics' },
  ];

  const investorNavItems = [
    { path: '/investor/dashboard', icon: MapPin, label: 'Browse Farms' },
    { path: '/investor/dashboard/profile', icon: User, label: 'My Profile' },
    { path: '/investor/dashboard/analysis', icon: BarChart3, label: 'Market Analysis' },
  ];

  const navItems = userType === 'farmer' ? farmerNavItems : investorNavItems;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-green-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out border-r-4 border-green-500
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src="/images/Mshamba Logo.jpg"
                alt="Mshamba Logo" 
                className="h-8 w-8 mr-2 object-contain"
              />
              <span className="text-xl font-bold text-green-800">Mshamba</span>
            </Link>
            {/* Close button for mobile */}
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-green-200 transition-colors"
            >
              <X className="h-6 w-6 text-green-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 bg-gradient-to-b from-green-50 to-white">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path.includes('/dashboard') && location.pathname === item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md transform scale-105'
                      : 'text-gray-700 hover:bg-green-100 hover:text-green-700 hover:shadow-sm'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="truncate font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t bg-green-50">
          {isAuthenticated ? (
            <>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-green-800 truncate">{userName}</p>
                  <p className="text-sm text-green-600 capitalize font-medium">{userType}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-green-700 hover:bg-green-200 hover:text-green-800 rounded-lg transition-colors w-full font-medium"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="flex items-center px-4 py-2 text-green-700 hover:bg-green-200 hover:text-green-800 rounded-lg transition-colors w-full font-medium"
            >
              <LogIn className="h-4 w-4 mr-3" />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-lg border-b-4 border-green-500 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-green-100 mr-4 transition-colors"
              >
                <Menu className="h-6 w-6 text-green-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-green-800 capitalize">
                {userType} Dashboard
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;