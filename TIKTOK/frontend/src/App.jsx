
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
      <div style={{ background: '#eaf6ff', padding: 20, borderRadius: 8, marginBottom: 32 }}>
        <h2 style={{ marginTop: 0 }}>Project Status Summary</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li><b>JARVIS</b>: Voice-first AI assistant for macOS. <br /><i>Backend stable, frontend running, robust integrations. Next: expand integrations, enhance customization.</i></li>
          <li><b>IOS APP</b>: Native iOS client for JARVIS. <br /><i>Swift app, backend connectivity, needs UI/UX polish and new features.</i></li>
          <li><b>STT / STT2</b>: Speech-to-text modules for voice command recognition. <br /><i>Initial pipeline integrated, needs accuracy and multi-language improvements.</i></li>
          <li><b>TIKTOK</b>: Workspace for TikTok API integration. <br /><i>Scaffolded, ready for API implementation and analytics expansion.</i></li>
        </ul>
      </div>
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
