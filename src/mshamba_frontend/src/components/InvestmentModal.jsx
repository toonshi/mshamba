import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

const InvestmentModal = ({ isOpen, onClose, onConfirm, farm }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onConfirm(farm.id, parseFloat(amount));
      setAmount('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invest in {farm.name}</h2>
        <p className="text-gray-600 mb-6">Enter the amount you wish to invest in {farm.name}.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount ($)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="investment-amount"
                name="investment-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirm Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
