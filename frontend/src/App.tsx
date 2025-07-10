import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WritePage from './pages/WritePage';
import ReplayPage from './pages/ReplayPage';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <nav style={{ 
          backgroundColor: '#007bff', 
          padding: '10px 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            display: 'flex', 
            gap: '20px',
            alignItems: 'center'
          }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Type Recorder
            </Link>
            <Link
              to="/write"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}
            >
              Write
            </Link>
            <Link
              to="/replay"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}
            >
              Replay
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<WritePage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/replay" element={<ReplayPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;