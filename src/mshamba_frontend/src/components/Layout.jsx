import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Users, 
  BarChart3, 
  User,
  LogOut,
  TrendingUp,
  MapPin
} from 'lucide-react';

const Layout = ({ children, userType, userName = "User" }) => {
  const location = useLocation();
  
  const farmerNavItems = [
    { path: '/farmer/dashboard', icon: LayoutDashboard, label: 'Farm Profile' },
    { path: '/farmer/dashboard/records', icon: FileText, label: 'Farm Records' },
    { path: '/farmer/dashboard/setup-investment', icon: DollarSign, label: 'Setup Investment' },
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center">
            <Sprout className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Mshamba</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path.includes('/dashboard') && location.pathname === item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500 capitalize">{userType}</p>
            </div>
          </div>
          <Link
            to="/auth"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {userType} Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;