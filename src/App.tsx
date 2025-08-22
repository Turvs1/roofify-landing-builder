
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
// import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SiteMap from "./pages/SiteMap";
import RoofReport from "./pages/RoofReport";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Team from "./pages/Team";
import SafetyQuality from "./pages/SafetyQuality";
import Contact from "./pages/Contact";
import RoofInstallation from "./pages/services/RoofInstallation";
import RoofRepairs from "./pages/services/RoofRepairs";
import RoofMaintenance from "./pages/services/RoofMaintenance";
import NewConstruction from "./pages/services/NewConstruction";
import Renovations from "./pages/services/Renovations";
import Extensions from "./pages/services/Extensions";
import Insurance from "./pages/services/Insurance";
import InsulationServices from "./pages/services/InsulationServices";
import GutterSystems from "./pages/services/GutterSystems";
import Locations from "./pages/Locations";
import BrisbaneLocation from "./pages/BrisbaneLocation";
import GoldCoastLocation from "./pages/GoldCoastLocation";
import SunshineCoastLocation from "./pages/SunshineCoastLocation";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import WebPTest from "./pages/WebPTest";
import PreWorksFormTest from "./pages/PreWorksFormTest";
import AdminDashboard from "./pages/AdminDashboard";

// Lazy load heavy components with proper error handling
const PreWorksForm = lazy(() => 
  import("./pages/PreWorksForm").catch(() => ({
    default: () => <div className="flex items-center justify-center min-h-screen">Error loading form. Please refresh the page.</div>
  }))
);

const JobUploads = lazy(() => 
  import("./pages/JobUploads").catch(() => ({
    default: () => <div className="flex items-center justify-center min-h-screen">Error loading uploads. Please refresh the page.</div>
  }))
);

const JobViewerPage = lazy(() => 
  import("./pages/JobViewerPage").catch(() => ({
    default: () => <div className="flex items-center justify-center min-h-screen">Error loading job viewer. Please refresh the page.</div>
  }))
);

// Loading component with better UX
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-arw-navy"></div>
    <p className="mt-4 text-arw-navy">Loading...</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  // <ServiceWorkerRegistration>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/roof-installation" element={<RoofInstallation />} />
              <Route path="/services/roof-repairs" element={<RoofRepairs />} />
              <Route path="/services/roof-maintenance" element={<RoofMaintenance />} />
              <Route path="/services/new-construction" element={<NewConstruction />} />
              <Route path="/services/renovations" element={<Renovations />} />
              <Route path="/services/extensions" element={<Extensions />} />
              <Route path="/services/insurance" element={<Insurance />} />
              <Route path="/services/insulation-services" element={<InsulationServices />} />
              <Route path="/services/gutter-systems" element={<GutterSystems />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/brisbane" element={<BrisbaneLocation />} />
              <Route path="/locations/gold-coast" element={<GoldCoastLocation />} />
              <Route path="/locations/sunshine-coast" element={<SunshineCoastLocation />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectSlug" element={<ProjectDetails />} />
              <Route path="/team" element={<Team />} />
              <Route path="/safety-quality" element={<SafetyQuality />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sitemap" element={<SiteMap />} />
              <Route path="/roof-report" element={<RoofReport />} />
              <Route path="/job-uploads" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <JobUploads />
                </Suspense>
              } />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/pre-works-form" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PreWorksForm />
                </Suspense>
              } />
              <Route path="/webp-test" element={<WebPTest />} />
              <Route path="/pre-works-test" element={<PreWorksFormTest />} />
              {/* HIDDEN ADMIN ROUTE - Internal staff only */}
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/job-viewer" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <JobViewerPage />
                </Suspense>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  // </ServiceWorkerRegistration>
);

export default App;
