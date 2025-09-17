import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mshamba_backend } from 'declarations/mshamba_backend';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';

const InvestmentDetails = () => {
  const { investmentId } = useParams();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestmentDetails = async () => {
      try {
        setLoading(true);
        // Assuming a backend function to get a single investment by ID
        // This function does not exist yet, we will need to add it to the backend
        const result = await mshamba_backend.getInvestmentDetails(investmentId);
        if (result.ok) {
          setInvestment(result.ok);
        } else {
          setError(result.err);
          toast.error(`Failed to fetch investment details: ${result.err}`);
        }
      } catch (err) {
        console.error("Error fetching investment details:", err);
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred while fetching investment details.");
      } finally {
        setLoading(false);
      }
    };

    if (investmentId) {
      fetchInvestmentDetails();
    }
  }, [investmentId]);

  if (loading) {
    return <div className="text-center py-8">Loading investment details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!investment) {
    return <div className="text-center py-8">Investment not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/investor/dashboard/my-investments" className="flex items-center text-green-500 hover:underline mb-4">
        <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" /> Back to My Investments
      </Link>
      <h1 className="text-3xl font-bold mb-6">Investment Details for {investment.farmName}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><strong>Investment ID:</strong> {investment.investmentId}</p>
            <p className="text-gray-600"><strong>Farm Name:</strong> {investment.farmName}</p>
            <p className="text-gray-600"><strong>Invested Amount:</strong> ${Number(investment.amount).toLocaleString()}</p>
            <p className="text-gray-600"><strong>Shares Received:</strong> {Number(investment.sharesReceived).toLocaleString()}</p>
            <p className="text-gray-600"><strong>Price Per Share:</strong> ${Number(investment.pricePerShare).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Investor:</strong> {investment.investor.toText()}</p>
            <p className="text-gray-600"><strong>Timestamp:</strong> {new Date(Number(investment.timestamp) / 1_000_000).toLocaleString()}</p>
            {/* Add more details as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;
