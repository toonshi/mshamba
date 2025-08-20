import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, DollarSign, TrendingUp, Calendar, BookOpen, Sprout } from 'lucide-react';

const categories = {
  inputs: { name: 'Inputs', icon: Sprout, color: 'bg-green-500', items: ['Seeds', 'Fertilizers', 'Pesticides', 'Tools'] },
  labor: { name: 'Labor', icon: FileText, color: 'bg-blue-500', items: ['Planting', 'Weeding', 'Harvesting', 'General'] },
  opex: { name: 'OpEx', icon: DollarSign, color: 'bg-purple-500', items: ['Transport', 'Storage', 'Processing', 'Marketing'] },
  yields: { name: 'Yields', icon: TrendingUp, color: 'bg-orange-500', items: ['Harvest Records', 'Quality Assessment', 'Storage'] },
  sales: { name: 'Sales', icon: DollarSign, color: 'bg-indigo-500', items: ['Direct Sales', 'Market Sales', 'Contract Sales'] }
};

export const FarmerRecords = ({ onBack, onSaveRecord }) => {
  const [view, setView] = useState('books'); // books, categories, subcategories, inputs
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', cost: '', date: '', supplier: '', description: '' });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-12-31' });

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

  // Books View
  if (view === 'books') return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <button onClick={onBack} className="flex items-center space-x-2 text-green-600 mb-6">
        <ArrowLeft /> Back to Dashboard
      </button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Farm Record Books</h1>
            <p className="text-gray-600">Manage your farm records, expenses, and yields</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setView('categories')} className="bg-green-500 text-white py-4 rounded-lg shadow hover:bg-green-600 flex items-center justify-center space-x-2">
            <FileText /> <span>Enter Records</span>
          </button>
          <button onClick={() => document.getElementById('image-upload').click()} className="bg-blue-500 text-white py-4 rounded-lg shadow hover:bg-blue-600 flex items-center justify-center space-x-2">
            <Upload /> <span>Upload Images</span>
          </button>
          <button onClick={() => document.getElementById('csv-upload').click()} className="bg-purple-500 text-white py-4 rounded-lg shadow hover:bg-purple-600 flex items-center justify-center space-x-2">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => setView('books')} className="flex items-center space-x-2 text-green-600 mb-6">
        <ArrowLeft /> Back to Books
      </button>

      <h1 className="text-3xl font-bold mb-6">Select Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(categories).map(([key, cat]) => {
          const Icon = cat.icon;
          return (
            <button key={key} onClick={() => { setSelectedCategory(key); setView('subcategories'); }}
              className={`${cat.color} p-6 rounded-lg shadow hover:scale-105 transform transition flex flex-col items-center`}>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <button onClick={() => setView('categories')} className="flex items-center space-x-2 text-green-600 mb-6">
          <ArrowLeft /> Back to Categories
        </button>
        <h1 className="text-3xl font-bold mb-6">{cat.name} Subcategories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cat.items.map((sub, idx) => (
            <button key={idx} onClick={() => { setSelectedSubcategory(sub); setView('inputs'); }}
              className="bg-gray-100 p-6 rounded-lg shadow hover:bg-gray-200">{sub}</button>
          ))}
        </div>
      </div>
    );
  }

  // Input Form View
  if (view === 'inputs') {
    const cat = categories[selectedCategory];
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button onClick={() => setView('subcategories')} className="flex items-center space-x-2 text-green-600 mb-6">
          <ArrowLeft /> Back to Subcategories
        </button>
        <h1 className="text-3xl font-bold mb-4">Add {cat.name} Record - {selectedSubcategory}</h1>

        <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-2xl mx-auto">
          <input name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <input name="cost" type="number" placeholder="Cost / Quantity" value={formData.cost} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <input name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <input name="supplier" placeholder="Supplier/Source" value={formData.supplier} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" rows={4} />

          <input type="file" multiple onChange={handleFileUpload} className="w-full" />

          <div className="flex space-x-4">
            <button onClick={() => setView('subcategories')} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">Save</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FarmerRecords;
