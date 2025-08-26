import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { ProfileSelection } from './pages/profileselection';
import Dashboard from './pages/Dashboard';
import SetupInvestment from './pages/farmer/SetupInvestment'; // Import SetupInvestment
import { mshamba_backend } from 'declarations/mshamba_backend';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/profile" element={<ProfileSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmer/setup-investment/:farmId" element={<SetupInvestment />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
