import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateCanonicalUrl, validateCanonicalUrl, shouldCanonicalize } from '../lib/canonicalUrls';

interface CanonicalUrlTesterProps {
  pageKey: string;
  showInDevelopment?: boolean;
}

const CanonicalUrlTester: React.FC<CanonicalUrlTesterProps> = ({ 
  pageKey, 
  showInDevelopment = process.env.NODE_ENV === 'development' 
}) => {
  const location = useLocation();
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [needsCanonicalization, setNeedsCanonicalization] = useState<boolean>(false);

  useEffect(() => {
    if (showInDevelopment) {
      const canonical = generateCanonicalUrl(pageKey);
      setCanonicalUrl(canonical);
      setIsValid(validateCanonicalUrl(canonical));
      setNeedsCanonicalization(shouldCanonicalize(location.pathname, canonical));
    }
  }, [pageKey, location.pathname, showInDevelopment]);

  if (!showInDevelopment) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-yellow-50 border-yellow-200 shadow-lg z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">🔗 Canonical URL Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-2">
          <div>
            <span className="font-semibold">Current Path:</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {location.pathname}
            </Badge>
          </div>
          
          <div>
            <span className="font-semibold">Canonical URL:</span>
            <Badge 
              variant={isValid ? "default" : "destructive"} 
              className="ml-2 text-xs"
            >
              {canonicalUrl}
            </Badge>
          </div>
          
          <div>
            <span className="font-semibold">Status:</span>
            <Badge 
              variant={needsCanonicalization ? "destructive" : "default"} 
              className="ml-2 text-xs"
            >
              {needsCanonicalization ? "Needs Canonicalization" : "Canonical"}
            </Badge>
          </div>
          
          {location.search && (
            <div>
              <span className="font-semibold">Query Params:</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {location.search}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigator.clipboard.writeText(canonicalUrl)}
            className="text-xs"
          >
            Copy Canonical
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.open(canonicalUrl, '_blank')}
            className="text-xs"
          >
            Test URL
          </Button>
        </div>
        
        <div className="text-xs text-yellow-700">
          <strong>Note:</strong> This component only shows in development mode.
          Remove in production or set showInDevelopment={false}.
        </div>
      </CardContent>
    </Card>
  );
};

export default CanonicalUrlTester;
