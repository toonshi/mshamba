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
import FarmDetails from "./pages/investor/FarmDetails";
import MarketAnalysis from "./pages/investor/MarketAnalysis";
import MyAccount from "./pages/investor/MyAccount";

// Marketplace pages
import Marketplace from "./pages/Marketplace";
import CreateListing from "./pages/CreateListing";
import UserRegistration from "./pages/UserRegistration";

function App() {
  return (
    <Router>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<FarmListing />} /> 
        <Route path="/profile-selection" element={<ProfileSelection />} />

        {/* Marketplace Routes */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/create-listing" element={<CreateListing />} />
        <Route path="/register" element={<UserRegistration />} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />}>
        <Route index element={<FarmListing />} /> 
        <Route path="profile" element={<FarmListing />} /> 
          <Route path="records" element={<FarmRecords />} />
          <Route path="setup-investment" element={<SetupInvestment />} />
          <Route path="valuation" element={<ValuationReport />} />
          <Route path="investors" element={<InvestorsList />} />
          <Route path="graphs" element={<FarmGraphs />} />
        </Route>

        {/* Investor Routes */}
        <Route path="/investor/dashboard" element={<InvestorDashboard />}>
          <Route path="profile" element={<InvestorProfile />} />
          <Route index element={<Farms />} />
          <Route path="farms" element={<Farms />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="analysis" element={<MarketAnalysis />} />
        </Route>
        
        {/* Farm Details - Full Page */}
        <Route path="/investor/farm/:farmId" element={<FarmDetails />} />
      </Routes>
    </Router>
  );
}

export default App;