// src/pages/RecordOptions.jsx
import { Link } from 'react-router-dom';

export default function RecordOptions() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">To setep your investment enter your Farm Record Books</h1>
      <p className="mb-6">Manage your farm records, expenses, and progress tracking</p>

      <div className="grid gap-4 w-full max-w-md">
        <Link to="/records/enter">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded flex items-center justify-center">
            📘 Enter Records
          </button>
        </Link>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded flex items-center justify-center">
          📷 Upload Images
        </button>
        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded flex items-center justify-center">
          📄 Upload CSV
        </button>
      </div>
    </div>
  );
}
