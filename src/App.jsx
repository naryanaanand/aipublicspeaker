import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PracticeMode from './components/PracticeMode';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<PracticeMode />} />
          {/* Fallback or other routes */}
          <Route path="/login" element={<LandingPage />} /> {/* Placeholder */}
          <Route path="/signup" element={<Dashboard />} /> {/* Placeholder flow */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
