import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import './index.css';

const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_api_key_here';

if (!isFirebaseConfigured) {
  document.getElementById('root').innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0f7ee,#d4edda);font-family:Inter,sans-serif;padding:20px">
      <div style="background:white;border-radius:24px;padding:40px;max-width:500px;box-shadow:0 20px 60px rgba(45,106,79,0.15);text-align:center">
        <div style="font-size:60px;margin-bottom:16px">🦆</div>
        <h1 style="font-size:28px;font-weight:900;color:#2D6A4F;margin-bottom:8px">MONI Setup Required</h1>
        <p style="color:#5a8f50;margin-bottom:24px">Connect your Firebase project to get started.</p>
        <div style="background:#f0f7ee;border-radius:16px;padding:20px;text-align:left;font-size:13px;line-height:1.8;color:#1a4029">
          <strong>Steps:</strong><br/>
          1. Create a project at <a href="https://console.firebase.google.com" target="_blank" style="color:#2D6A4F">console.firebase.google.com</a><br/>
          2. Enable <strong>Authentication → Google</strong> sign-in<br/>
          3. Create a <strong>Firestore</strong> database<br/>
          4. Enable <strong>Storage</strong><br/>
          5. Copy <code>.env.example</code> → <code>.env</code> and fill in your credentials<br/>
          6. Restart the dev server with <code>npm run dev</code>
        </div>
      </div>
    </div>
  `;
} else {

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
