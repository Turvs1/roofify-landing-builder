import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CoreWebVitalsData {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

const CoreWebVitalsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<CoreWebVitalsData>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      startMonitoring();
    }
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Monitor LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.log('LCP monitoring not supported');
      }

      // Monitor FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          if (firstEntry) {
            setMetrics(prev => ({ ...prev, fid: firstEntry.processingStart - firstEntry.startTime }));
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.log('FID monitoring not supported');
      }

      // Monitor CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.log('CLS monitoring not supported');
      }

      // Monitor FCP (First Contentful Paint)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as PerformanceEntry;
          if (firstEntry) {
            setMetrics(prev => ({ ...prev, fcp: firstEntry.startTime }));
          }
        });
        fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
      } catch (error) {
        console.log('FCP monitoring not supported');
      }

      // Monitor TTFB (Time to First Byte)
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
        }
      } catch (error) {
        console.log('TTFB monitoring not supported');
      }
    }
  };

  const getMetricScore = (metric: keyof CoreWebVitalsData, value: number | null): { score: 'good' | 'needs-improvement' | 'poor', color: string } => {
    if (value === null) return { score: 'needs-improvement', color: 'bg-yellow-500' };

    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 600, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return { score: 'good', color: 'bg-green-500' };
    if (value <= threshold.poor) return { score: 'needs-improvement', color: 'bg-yellow-500' };
    return { score: 'poor', color: 'bg-red-500' };
  };

  const getMetricLabel = (metric: keyof CoreWebVitalsData): string => {
    const labels = {
      lcp: 'Largest Contentful Paint',
      fid: 'First Input Delay',
      cls: 'Cumulative Layout Shift',
      fcp: 'First Contentful Paint',
      ttfb: 'Time to First Byte'
    };
    return labels[metric];
  };

  const getMetricUnit = (metric: keyof CoreWebVitalsData): string => {
    const units = {
      lcp: 'ms',
      fid: 'ms',
      cls: '',
      fcp: 'ms',
      ttfb: 'ms'
    };
    return units[metric];
  };

  const getMetricDescription = (metric: keyof CoreWebVitalsData): string => {
    const descriptions = {
      lcp: 'Measures loading performance. Should be under 2.5 seconds.',
      fid: 'Measures interactivity. Should be under 100ms.',
      cls: 'Measures visual stability. Should be under 0.1.',
      fcp: 'Measures first paint. Should be under 1.8 seconds.',
      ttfb: 'Measures server response time. Should be under 600ms.'
    };
    return descriptions[metric];
  };

  const exportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `core-web-vitals-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-arw-navy">Core Web Vitals Monitor</h2>
        <div className="flex gap-2">
          <Button 
            onClick={startMonitoring} 
            disabled={isMonitoring}
            className="bg-arw-navy hover:bg-arw-blue"
          >
            {isMonitoring ? 'Monitoring...' : 'Start Monitoring'}
          </Button>
          <Button 
            onClick={exportMetrics} 
            variant="outline"
            className="border-arw-navy text-arw-navy hover:bg-arw-navy hover:text-white"
          >
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(metrics).map(([key, value]) => {
          const metricKey = key as keyof CoreWebVitalsData;
          const { score, color } = getMetricScore(metricKey, value);
          
          return (
            <Card key={key} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{getMetricLabel(metricKey)}</CardTitle>
                  <Badge className={color}>
                    {score === 'good' ? 'Good' : score === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-arw-navy">
                  {value !== null ? `${value.toFixed(2)}${getMetricUnit(metricKey)}` : 'N/A'}
                </div>
                <p className="text-sm text-gray-600">{getMetricDescription(metricKey)}</p>
                
                {/* Progress bar for visual representation */}
                {value !== null && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>{getMetricUnit(metricKey) === 'ms' ? '5s' : '0.5'}</span>
                    </div>
                    <Progress 
                      value={Math.min((value / (getMetricUnit(metricKey) === 'ms' ? 5000 : 0.5)) * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg text-arw-navy">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Good: All metrics within target ranges</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Needs Improvement: Some metrics need optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Poor: Critical performance issues detected</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Optimization Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use WebP images and lazy loading for better LCP</li>
              <li>• Minimize JavaScript execution for better FID</li>
              <li>• Avoid layout shifts with proper image dimensions</li>
              <li>• Optimize server response time for better TTFB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoreWebVitalsMonitor;
