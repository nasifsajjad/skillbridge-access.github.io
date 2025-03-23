
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { reportWebVitals } from './lib/vitals'

createRoot(document.getElementById("root")!).render(<App />);

// If you want to measure performance in your app, uncomment the following line
// It will log performance metrics to the console in development
// and to whatever monitoring service you use in production
reportWebVitals(console.log);
