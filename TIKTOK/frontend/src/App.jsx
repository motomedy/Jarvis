import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ status: 'error', message: 'Could not connect to backend.' }));
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 40 }}>
      <h1>TikTok Automation Dashboard (React Frontend)</h1>
      <h2>Backend Status Check</h2>
      {status ? (
        <pre style={{ background: '#f0f4ff', padding: 16, borderRadius: 8 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      ) : (
        <p>Loading status...</p>
      )}
    </div>
  );
}

export default App;
