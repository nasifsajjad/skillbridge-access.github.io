
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Function to report web vitals metrics
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Use the correct functions from web-vitals v4
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}
