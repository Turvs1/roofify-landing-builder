/// <reference types="vite/client" />

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
  }
  
  interface LayoutShiftEntry extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
}

export {};
