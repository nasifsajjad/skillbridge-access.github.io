
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { reportWebVitals } from './lib/vitals'

// Use a more efficient way to render the app
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

// Report web vitals for performance monitoring
reportWebVitals(console.log);
