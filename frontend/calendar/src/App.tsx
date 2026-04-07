import React from 'react';

import Dashboard from './Dashboard';
import DocumentationSection from './DocumentationSection';

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>JARVIS Calendar & Task Dashboard</h1>
      <DocumentationSection />
      <Dashboard />
    </div>
  );
};

export default App;
