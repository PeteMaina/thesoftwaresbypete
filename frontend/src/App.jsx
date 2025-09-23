import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SMSTester from './pages/SMSTester';
import SoftwareCatalog from './pages/SoftwareCatalog';
import CustomRequest from './pages/CustomRequest';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sms-tester" element={<SMSTester />} />
          <Route path="/software" element={<SoftwareCatalog />} />
          <Route path="/custom-request" element={<CustomRequest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;