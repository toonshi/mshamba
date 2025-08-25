import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, DollarSign, TrendingUp, Calendar, BookOpen, Sprout, Moon, Sun } from 'lucide-react';

const categories = {
  inputs: { name: 'Inputs', icon: Sprout, items: ['Seeds', 'Fertilizers', 'Pesticides', 'Tools'] },
  labor: { name: 'Labor', icon: FileText, items: ['Planting', 'Weeding', 'Harvesting', 'General'] },
  opex: { name: 'OpEx', icon: DollarSign, items: ['Transport', 'Storage', 'Processing', 'Marketing'] },
  yields: { name: 'Yields', icon: TrendingUp, items: ['Harvest Records', 'Quality Assessment', 'Storage'] },
  sales: { name: 'Sales', icon: DollarSign, items: ['Direct Sales', 'Market Sales', 'Contract Sales'] }
};

export const FarmerRecords = ({ onBack, onSaveRecord }) => {
  const [view, setView] = useState('books'); // books, categories, subcategories, inputs
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', cost: '', date: '', supplier: '', description: '' });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileUpload = e => setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubcategory) return;
    const payload = { category: selectedCategory, subcategory: selectedSubcategory, ...formData, files: uploadedFiles };
    try {
      await onSaveRecord(payload);
      setFormData({ name: '', cost: '', date: '', supplier: '', description: '' });
      setUploadedFiles([]);
      setView('categories');
    } catch (err) {
      console.error('Error saving record:', err);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const themeClasses = {
    bg: darkMode ? 'bg-green-950' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    card: darkMode ? 'bg-green-900/30' : 'bg-white',
    input: darkMode ? 'bg-green-900/50 border-green-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900',
    buttonSecondary: darkMode ? 'bg-green-900/50 hover:bg-green-800/50 text-white border border-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    subcategoryButton: darkMode ? 'bg-green-900/50 hover:bg-green-800/50 text-white border border-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
  };

  // Books View
  if (view === 'books') return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-6`}>
     {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-green-900 text-yellow-400 hover:bg-green-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
          <h1 className="text-3xl font-bold">To setup your investment enter your farmer record books</h1>
  <p className="text-gray-400">Track capital investments, operating expenses, and revenue to monitor farm profitability and make informed financial decisions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setView('categories')} className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-lg shadow-lg hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
            <FileText /> <span>Enter Records</span>
          </button>
          <button onClick={() => document.getElementById('image-upload').click()} className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-lg shadow-lg hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
            <Upload /> <span>Upload Images</span>
          </button>
          <button onClick={() => document.getElementById('csv-upload').click()} className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-lg shadow-lg hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
            <Upload /> <span>Upload CSV</span>
          </button>
        </div>

        <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
        <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
      </div>
    </div>
  );

  // Categories View
  if (view === 'categories') return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-6`}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleDarkMode}
          className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <button onClick={() => setView('books')} className="flex items-center space-x-2 text-green-500 hover:text-green-400 mb-6 transition-colors">
        <ArrowLeft /> <span>Back to Books</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">Select Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(categories).map(([key, cat]) => {
          const Icon = cat.icon;
          return (
            <button key={key} onClick={() => { setSelectedCategory(key); setView('subcategories'); }}
              className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-lg shadow-lg hover:from-green-700 hover:to-green-600 hover:scale-105 transform transition-all duration-200 flex flex-col items-center">
              <Icon className="w-6 h-6 text-white mb-2" />
              <span className="text-white font-medium">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Subcategories View
  if (view === 'subcategories') {
    const cat = categories[selectedCategory];
    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-6`}>
        {/* Dark Mode Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <button onClick={() => setView('categories')} className="flex items-center space-x-2 text-green-500 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft /> <span>Back to Categories</span>
        </button>
        <h1 className="text-3xl font-bold mb-6">{cat.name} Subcategories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cat.items.map((sub, idx) => (
            <button key={idx} onClick={() => { setSelectedSubcategory(sub); setView('inputs'); }}
              className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-lg shadow-lg hover:from-green-700 hover:to-green-600 transform hover:scale-105 transition-all duration-200 text-white font-medium">{sub}</button>
          ))}
        </div>
      </div>
    );
  }

  // Input Form View
  if (view === 'inputs') {
    const cat = categories[selectedCategory];
    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} p-6`}>
        {/* Dark Mode Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition-all duration-200"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <button onClick={() => setView('subcategories')} className="flex items-center space-x-2 text-green-500 hover:text-green-400 mb-6 transition-colors">
          <ArrowLeft /> <span>Back to Subcategories</span>
        </button>
        <h1 className="text-3xl font-bold mb-4">Add {cat.name} Record - {selectedSubcategory}</h1>

        <div className={`${themeClasses.card} p-6 rounded-xl shadow-lg space-y-4 max-w-2xl mx-auto`}>
          <input name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} className={`w-full border px-3 py-2 rounded ${themeClasses.input}`} />
          <input name="cost" type="number" placeholder="Cost / Quantity" value={formData.cost} onChange={handleInputChange} className={`w-full border px-3 py-2 rounded ${themeClasses.input}`} />
          <input name="date" type="date" value={formData.date} onChange={handleInputChange} className={`w-full border px-3 py-2 rounded ${themeClasses.input}`} />
          <input name="supplier" placeholder="Supplier/Source" value={formData.supplier} onChange={handleInputChange} className={`w-full border px-3 py-2 rounded ${themeClasses.input}`} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className={`w-full border px-3 py-2 rounded ${themeClasses.input}`} rows={4} />

          <input type="file" multiple onChange={handleFileUpload} className={`w-full ${darkMode ? 'text-white' : 'text-gray-900'}`} />

          <div className="flex space-x-4">
            <button onClick={() => setView('subcategories')} className={`flex-1 py-2 rounded transition-colors ${themeClasses.buttonSecondary}`}>Cancel</button>
            <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded hover:from-green-700 hover:to-green-600 transition-all duration-200">Save</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FarmerRecords;