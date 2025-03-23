
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { reportWebVitals } from './lib/vitals'

createRoot(document.getElementById("root")!).render(<App />);

// Report web vitals for performance monitoring
reportWebVitals(console.log);
