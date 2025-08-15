import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { 
  generateCanonicalUrl, 
  validateCanonicalUrl, 
  shouldCanonicalize,
  canonicalUrls,
  BASE_URL 
} from '../lib/canonicalUrls';

const CanonicalUrlTest = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testResults, setTestResults] = useState<any>(null);

  const testCanonicalUrl = () => {
    if (!testUrl) return;

    try {
      const url = new URL(testUrl);
      const path = url.pathname;
      
      // Find matching page key
      const pageKey = Object.keys(canonicalUrls).find(key => 
        canonicalUrls[key].path === path
      );
      
      if (pageKey) {
        const canonical = generateCanonicalUrl(pageKey);
        const isValid = validateCanonicalUrl(canonical);
        const needsCanonicalization = shouldCanonicalize(path, canonical);
        
        setTestResults({
          pageKey,
          currentPath: path,
          canonicalUrl: canonical,
          isValid,
          needsCanonicalization,
          queryParams: url.search,
          fullCanonical: url.search ? `${canonical}${url.search}` : canonical
        });
      } else {
        setTestResults({
          error: 'No matching page found for this path',
          currentPath: path,
          suggestion: 'Check if the path exists in canonicalUrls configuration'
        });
      }
    } catch (error) {
      setTestResults({
        error: 'Invalid URL format',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEO page="sitemap" />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-arw-navy mb-6">🔗 Canonical URL Testing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test and validate canonical URLs for ARW Construction website. 
            This tool helps ensure proper SEO implementation and duplicate content prevention.
          </p>
        </div>

        {/* URL Testing Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Canonical URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testUrl">Enter URL to test:</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="testUrl"
                  type="url"
                  placeholder="https://arwc.com.au/services/brisbane-roofing"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                />
                <Button onClick={testCanonicalUrl}>Test URL</Button>
              </div>
            </div>
            
            {testResults && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Test Results:</h3>
                {testResults.error ? (
                  <div className="space-y-2">
                    <Badge variant="destructive">{testResults.error}</Badge>
                    {testResults.details && <p className="text-sm text-gray-600">{testResults.details}</p>}
                    {testResults.suggestion && <p className="text-sm text-gray-600">{testResults.suggestion}</p>}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div><strong>Page Key:</strong> <Badge variant="outline">{testResults.pageKey}</Badge></div>
                    <div><strong>Current Path:</strong> <Badge variant="outline">{testResults.currentPath}</Badge></div>
                    <div><strong>Canonical URL:</strong> <Badge variant="outline">{testResults.canonicalUrl}</Badge></div>
                    <div><strong>Valid:</strong> <Badge variant={testResults.isValid ? "default" : "destructive"}>
                      {testResults.isValid ? "Yes" : "No"}
                    </Badge></div>
                    <div><strong>Needs Canonicalization:</strong> <Badge variant={testResults.needsCanonicalization ? "destructive" : "default"}>
                      {testResults.needsCanonicalization ? "Yes" : "No"}
                    </Badge></div>
                    {testResults.queryParams && (
                      <div><strong>Query Params:</strong> <Badge variant="outline">{testResults.queryParams}</Badge></div>
                    )}
                    <div><strong>Full Canonical:</strong> <Badge variant="outline">{testResults.fullCanonical}</Badge></div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canonical URL Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Canonical URL Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(canonicalUrls).map(([key, config]) => (
                <div key={key} className="p-3 border rounded-lg">
                  <div className="font-semibold text-sm text-arw-navy">{key}</div>
                  <div className="text-xs text-gray-600 space-y-1 mt-1">
                    <div><strong>Path:</strong> {config.path}</div>
                    <div><strong>Priority:</strong> {config.priority}</div>
                    <div><strong>Change Freq:</strong> {config.changefreq}</div>
                    <div><strong>Last Modified:</strong> {config.lastmod}</div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {BASE_URL}{config.path}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Canonical URL SEO Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-arw-navy mb-3">Duplicate Content Prevention</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Prevents multiple URLs from competing for the same content</li>
                  <li>• Consolidates ranking power to single canonical URLs</li>
                  <li>• Eliminates confusion for search engines</li>
                  <li>• Improves crawl efficiency</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-arw-navy mb-3">Implementation Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Automatic URL canonicalization</li>
                  <li>• Query parameter preservation</li>
                  <li>• Hreflang tag support</li>
                  <li>• Development testing tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CanonicalUrlTest;
