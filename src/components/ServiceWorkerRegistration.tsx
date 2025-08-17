import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ServiceWorkerRegistrationProps {
  children: React.ReactNode;
}

const ServiceWorkerRegistration: React.FC<ServiceWorkerRegistrationProps> = ({ children }) => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      setSwRegistration(registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setIsUpdateAvailable(true);
              toast({
                title: "Update Available",
                description: "A new version of the app is available. Click to update.",
                action: (
                  <Button 
                    size="sm" 
                    onClick={() => updateServiceWorker(registration)}
                    className="bg-arw-navy hover:bg-arw-blue"
                  >
                    Update Now
                  </Button>
                )
              });
            }
          });
        }
      });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = async (registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const checkForUpdates = async () => {
    if (swRegistration) {
      await swRegistration.update();
    }
  };

  // Add offline/online detection
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "Back Online",
        description: "Your connection has been restored.",
        variant: "default"
      });
    };

    const handleOffline = () => {
      toast({
        title: "You're Offline",
        description: "Some features may be limited. Your data will be saved locally.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return (
    <>
      {children}
      
      {/* Update notification */}
      {isUpdateAvailable && (
        <div className="fixed bottom-4 right-4 bg-arw-navy text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <h3 className="font-semibold mb-2">Update Available</h3>
          <p className="text-sm mb-3">A new version of the app is ready.</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => updateServiceWorker(swRegistration!)}
              className="bg-arw-blue hover:bg-blue-600"
            >
              Update Now
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsUpdateAvailable(false)}
              className="text-white border-white hover:bg-white hover:text-arw-navy"
            >
              Later
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceWorkerRegistration;
