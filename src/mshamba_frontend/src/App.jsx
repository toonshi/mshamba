// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import { Auth } from "./pages/Auth";
import ProfileSelection from "./pages/ProfileSelection";

// Farmer pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";  
import FarmListing from "./pages/farmer/FarmListing";
import FarmRecords from "./pages/farmer/FarmerRecords";
import SetupInvestment from "./pages/farmer/SetupInvestment";
import ValuationReport from "./pages/farmer/ValuationReport";
import InvestorsList from "./pages/farmer/InvestorsList";
import FarmGraphs from "./pages/farmer/FarmGraphs";


// Investor pages
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import InvestorProfile from "./pages/investor/InvestorProfile";
import Farms from "./pages/investor/Farms";
import MarketAnalysis from "./pages/investor/MarketAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<FarmListing />} /> 
        <Route key="profile-selection-route" path="/profile-selection" element={<ProfileSelection />} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />}>
        <Route index element={<FarmListing />} /> 
        <Route path="profile" element={<FarmListing />} /> 
          <Route path="records" element={<FarmRecords />} />
          <Route path="setup-investment/:farmId" element={<SetupInvestment />} />
          <Route path="valuation" element={<ValuationReport />} />
          <Route path="investors" element={<InvestorsList />} />
          <Route path="graphs" element={<FarmGraphs />} />
        </Route>

        {/* Investor Routes */}
        <Route path="/investor/dashboard" element={<InvestorDashboard />}>
          <Route path="profile" element={<InvestorProfile />} />
          <Route index element={<Farms />} />
          <Route path="farms" element={<Farms />} />
          <Route path="analysis" element={<MarketAnalysis />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;