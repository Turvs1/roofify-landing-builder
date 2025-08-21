import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  ClipboardList, 
  Shield, 
  LogOut,
  Building2,
  Calendar,
  Users,
  Settings,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminRoofReport from '../components/AdminRoofReport';
import AdminJobUploads from '../components/AdminJobUploads';
import AdminPreWorksForm from '../components/AdminPreWorksForm'

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('roof-report');
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<string>('');
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const { timestamp, isAuth } = JSON.parse(sessionData);
          const now = new Date().getTime();
          const sessionAge = now - timestamp;
          const hours24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (sessionAge < hours24 && isAuth) {
            setIsAuthenticated(true);
          } else {
            // Session expired, remove it
            localStorage.removeItem('adminSession');
          }
        } catch (error) {
          // Invalid session data, remove it
          localStorage.removeItem('adminSession');
        }
      }
    };

    checkSession();
  }, []);

  // Update session time remaining every minute
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateSessionTime = () => {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const { timestamp } = JSON.parse(sessionData);
          const now = new Date().getTime();
          const sessionAge = now - timestamp;
          const hours24 = 24 * 60 * 60 * 1000;
          const remaining = hours24 - sessionAge;
          
          if (remaining > 0) {
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            setSessionTimeRemaining(`${hours}h ${minutes}m remaining`);
            
            // Show warning when less than 1 hour remaining
            if (remaining < 60 * 60 * 1000) {
              setShowSessionWarning(true);
            } else {
              setShowSessionWarning(false);
            }
          } else {
            // Session expired
            setIsAuthenticated(false);
            localStorage.removeItem('adminSession');
            setSessionTimeRemaining('');
          }
        } catch (error) {
          setSessionTimeRemaining('');
        }
      }
    };

    // Update immediately
    updateSessionTime();
    
    // Update every minute
    const interval = setInterval(updateSessionTime, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Extend session on user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const extendSession = () => {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const { isAuth } = JSON.parse(sessionData);
          const newSessionData = {
            timestamp: new Date().getTime(),
            isAuth: isAuth
          };
          localStorage.setItem('adminSession', JSON.stringify(newSessionData));
        } catch (error) {
          console.error('Error extending session:', error);
        }
      }
    };

    // Extend session on user activity (clicks, keypresses, scrolls)
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, extendSession, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, extendSession);
      });
    };
  }, [isAuthenticated]);

  // Simple password authentication with session persistence
  const handleLogin = () => {
    if (password === 'ARW2024') {
      setIsAuthenticated(true);
      setError('');
      
      // Store session data with timestamp
      const sessionData = {
        timestamp: new Date().getTime(),
        isAuth: true
      };
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    
    // Clear session data
    localStorage.removeItem('adminSession');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ARW Construction</h1>
            <p className="text-blue-200 text-lg">Staff Portal</p>
          </div>

          {/* Login Card */}
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-xl text-white">Admin Access</CardTitle>
              <CardDescription className="text-blue-200">
                Internal staff authentication required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-blue-100">
                  Access Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                    placeholder="Enter your staff password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Shield className="h-4 w-4 text-blue-300" />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <Button 
                onClick={handleLogin} 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                Access Dashboard
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-blue-300">
                  Secure internal access only • ARW Construction
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">ARW Construction</h1>
                <p className="text-sm text-slate-600">Staff Management Portal</p>
                {sessionTimeRemaining && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      Session: {sessionTimeRemaining}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Secure Connection</span>
              </div>
              {sessionTimeRemaining && (
                <div className="relative group">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 cursor-help">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                    {sessionTimeRemaining}
                  </Badge>
                  {/* Session Info Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="text-center">
                      <div className="font-medium">Session Active</div>
                      <div className="text-slate-300">
                        {(() => {
                          const sessionData = localStorage.getItem('adminSession');
                          if (sessionData) {
                            try {
                              const { timestamp } = JSON.parse(sessionData);
                              return new Date(timestamp).toLocaleString('en-AU', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: 'short'
                              });
                            } catch (error) {
                              return 'Unknown';
                            }
                          }
                          return 'Unknown';
                        })()}
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
              )}
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                <Users className="h-3 w-3 mr-1" />
                Staff Access
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session Warning Banner */}
        {showSessionWarning && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800">Session Expiring Soon</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Your admin session will expire in less than 1 hour. You can refresh your session to extend it for another 24 hours.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Refresh session
                    const sessionData = localStorage.getItem('adminSession');
                    if (sessionData) {
                      try {
                        const { isAuth } = JSON.parse(sessionData);
                        const newSessionData = {
                          timestamp: new Date().getTime(),
                          isAuth: isAuth
                        };
                        localStorage.setItem('adminSession', JSON.stringify(newSessionData));
                        setShowSessionWarning(false);
                      } catch (error) {
                        console.error('Error refreshing session:', error);
                      }
                    }
                  }}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  Refresh Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSessionWarning(false)}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Staff Portal</h2>
                <p className="text-slate-600 text-lg">Access all internal tools and management systems</p>
              </div>
              <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Reports Generated</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Files Uploaded</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Assessments</p>
                <p className="text-2xl font-bold text-slate-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-3 h-16 bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            <TabsTrigger 
              value="roof-report" 
              className="flex items-center space-x-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Roof Report</div>
                <div className="text-xs text-slate-500">Generator</div>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="job-uploads" 
              className="flex items-center space-x-3 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Job Uploads</div>
                <div className="text-xs text-slate-500">Manager</div>
              </div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="pre-works" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Pre-Works</div>
                <div className="text-xs text-slate-500">Assessment</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Tool</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('roof-report')}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">Roof Report Generator</div>
                    <div className="text-sm text-blue-700">Generate inspection reports</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('job-uploads')}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-900">Job Uploads Manager</div>
                    <div className="text-sm text-green-700">Manage file uploads</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('pre-works')}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-900">Pre-Works Assessment</div>
                    <div className="text-sm text-purple-700">Complete planning forms</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Content */}
          <TabsContent value="roof-report" className="space-y-4">
            {/* Mobile Tool Header */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Roof Report Generator</h3>
                    <p className="text-sm text-blue-700">Currently Active</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('roof-report')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change Tool
                </button>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-blue-900">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>Roof Report Generator</span>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Generate comprehensive roof inspection reports with detailed assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminRoofReport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job-uploads" className="space-y-4">
            {/* Mobile Tool Header */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Job Uploads Manager</h3>
                    <p className="text-sm text-green-700">Currently Active</p>
                  </div>
                </div>
                <button
                  onClick={() => (document.querySelector('[data-value="job-uploads"]') as HTMLElement)?.click()}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Change Tool
                </button>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-green-900">
                  <Upload className="h-6 w-6 text-green-600" />
                  <span>Job Uploads Manager</span>
                </CardTitle>
                <CardDescription className="text-green-700">
                  Manage job-related documentation, file uploads, and project resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminJobUploads />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pre-works" className="space-y-4">
            {/* Mobile Tool Header */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Pre-Works Assessment</h3>
                    <p className="text-sm text-purple-700">Currently Active</p>
                  </div>
                </div>
                <button
                  onClick={() => (document.querySelector('[data-value="pre-works"]') as HTMLElement)?.click()}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Change Tool
                </button>
              </div>
            </div>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3 text-purple-900">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                  <span>Pre-Works Assessment</span>
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Complete comprehensive pre-works planning and assessment forms
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminPreWorksForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
