import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, DollarSign, TrendingUp, Calendar, BookOpen, Sprout } from 'lucide-react';

export const FarmerRecords = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('books'); // books, categories, subcategories, inputs
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    description: '',
    date: '',
    quantity: '',
    supplier: ''
  });

  const categories = {
    inputs: { name: 'Inputs', icon: Sprout, color: 'bg-green-600', items: ['Seeds', 'Fertilizers', 'Pesticides', 'Tools'] },
    labor: { name: 'Labor', icon: FileText, color: 'bg-blue-600', items: ['Planting', 'Weeding', 'Harvesting', 'General'] },
    opex: { name: 'OpEx', icon: DollarSign, color: 'bg-purple-600', items: ['Transport', 'Storage', 'Processing', 'Marketing'] },
    yields: { name: 'Yields', icon: TrendingUp, color: 'bg-yellow-600', items: ['Harvest Records', 'Quality Assessment', 'Storage'] },
    sales: { name: 'Sales', icon: DollarSign, color: 'bg-indigo-600', items: ['Direct Sales', 'Market Sales', 'Contract Sales'] }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryName = categories[selectedCategory]?.name || selectedCategory;
    alert(`${categoryName} record added successfully!`);
    setCurrentView('categories');
    setFormData({
      name: '',
      cost: '',
      description: '',
      date: '',
      quantity: '',
      supplier: ''
    });
  };

  const handleDateRangeChange = (field, value) => {
    setSelectedPeriod({
      ...selectedPeriod,
      [field]: value
    });
  };

  // Main Books Page
  if (currentView === 'books') {
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
              <h1 className="text-3xl font-bold">To setup your investment enter your farmer record books</h1>
  <p className="text-gray-400">Track capital investments, operating expenses, and revenue to monitor farm profitability and make informed financial decisions</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Books</h2>
            
            <div className="space-y-6">
              <button 
                onClick={() => setCurrentView('categories')}
                className="w-full bg-green-600 hover:bg-green-700 py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 text-lg"
              >
                <FileText className="w-6 h-6" />
                <span>Enter Records</span>
              </button>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 text-lg">
                <Upload className="w-6 h-6" />
                <span>Upload Images</span>
              </button>
              
              <button className="w-full bg-purple-600 hover:bg-purple-700 py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 text-lg">
                <Upload className="w-6 h-6" />
                <span>Upload CSV</span>
              </button>
            </div>

            {/* Date Range Picker */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Date Range</h3>
                <button 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
              
              {showDatePicker && (
                <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">From Date</label>
                    <input
                      type="date"
                      value={selectedPeriod.from}
                      onChange={(e) => handleDateRangeChange('from', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To Date</label>
                    <input
                      type="date"
                      value={selectedPeriod.to}
                      onChange={(e) => handleDateRangeChange('to', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 text-white"
                    />
                  </div>
                  <button 
                    onClick={() => setShowDatePicker(false)}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm transition-colors"
                  >
                    Apply Date Range
                  </button>
                </div>
              )}
              
              <div className="text-sm text-gray-400 mt-2">
                Current Range: {new Date(selectedPeriod.from).toLocaleDateString()} - {new Date(selectedPeriod.to).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Categories Overview View
  if (currentView === 'categories') {
    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentView('books')}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Books</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Record Categories</h1>
                <p className="text-gray-400">Select a category to add records</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Categories</h2>
              <div className="text-sm text-gray-400">
                Period: {new Date(selectedPeriod.from).toLocaleDateString()} - {new Date(selectedPeriod.to).toLocaleDateString()}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key);
                      setCurrentView('subcategories');
                    }}
                    className={`${category.color} hover:opacity-80 p-6 rounded-lg transition-all transform hover:scale-105`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <IconComponent className="w-8 h-8 text-white" />
                      <span className="font-medium text-white text-lg">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-blue-400">Revenue:</div>
                  <div className="font-bold text-blue-400">KSh 450,000</div>
                </div>
                <div>
                  <div className="text-sm text-blue-400">Income:</div>
                  <div className="font-bold text-blue-400">KSh 125,000</div>
                </div>
                <div>
                  <div className="text-sm text-blue-400">Expenses:</div>
                  <div className="font-bold text-blue-400">KSh 85,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subcategories View
  if (currentView === 'subcategories') {
    const category = categories[selectedCategory];
    const IconComponent = category?.icon || FileText;

    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentView('categories')}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Categories</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className={`w-12 h-12 ${category?.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{category?.name} Records</h1>
                <p className="text-gray-400">Select a subcategory to add records</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category?.items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedSubcategory(item);
                    setCurrentView('inputs');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors text-center group"
                >
                  <div className="font-medium group-hover:text-green-400 transition-colors">{item}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Input Form View
  if (currentView === 'inputs') {
    const category = categories[selectedCategory];
    const IconComponent = category?.icon || FileText;

    return (
      <div className="min-h-screen bg-gray-900 text-white w-full">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentView('subcategories')}
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Subcategories</span>
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className={`w-12 h-12 ${category?.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Add {category?.name} Record</h1>
                <p className="text-gray-400">Enter the details for {selectedSubcategory}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                    placeholder={`e.g., ${selectedSubcategory}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {selectedCategory === 'yields' || selectedCategory === 'sales' ? 'Amount/Quantity' : 'Cost'} *
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                    placeholder={selectedCategory === 'yields' ? 'e.g., 2500 kg' : 'e.g., 15000'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Supplier/Source</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                    placeholder="e.g., Local Agro Store"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors text-white"
                  placeholder="Additional details about this record..."
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Attach Receipt/Photo</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Drag and drop files here, or click to browse</p>
                  <input type="file" multiple accept="image/*,.pdf" className="hidden" />
                  <button type="button" className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm transition-colors">
                    Choose Files
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentView('subcategories')}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
};