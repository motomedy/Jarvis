import React from 'react';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>JARVIS Calendar & Task Dashboard</h1>
      <Dashboard />
    </div>
  );
};

export default App;
