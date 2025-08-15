// Canonical URL management for ARW Construction
// This prevents duplicate content issues and consolidates ranking power

export interface CanonicalConfig {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod: string;
}

// Base URL for the website
export const BASE_URL = 'https://arwc.com.au';

// Canonical URL configurations for all pages
export const canonicalUrls: Record<string, CanonicalConfig> = {
  // Main Pages
  home: {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: '2024-12-19'
  },
  about: {
    path: '/about',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: '2024-12-19'
  },
  services: {
    path: '/services',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: '2024-12-19'
  },
  projects: {
    path: '/projects',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: '2024-12-19'
  },
  team: {
    path: '/team',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  contact: {
    path: '/contact',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  
  // Service Pages
  roofInstallation: {
    path: '/services/roof-installation',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  roofRepairs: {
    path: '/services/roof-repairs',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  roofMaintenance: {
    path: '/services/roof-maintenance',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  newConstruction: {
    path: '/services/new-construction',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  renovations: {
    path: '/services/renovations',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  extensions: {
    path: '/services/extensions',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  insurance: {
    path: '/services/insurance',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  insulationServices: {
    path: '/services/insulation-services',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  gutterSystems: {
    path: '/services/gutter-systems',
    priority: 0.7,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  
  // Location-Specific Service Pages (Higher Priority for Local SEO)
  brisbaneRoofing: {
    path: '/services/brisbane-roofing',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  goldCoastRoofing: {
    path: '/services/gold-coast-roofing',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  sunshineCoastRoofing: {
    path: '/services/sunshine-coast-roofing',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  
  // Utility Pages
  roofReport: {
    path: '/roof-report',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: '2024-12-19'
  },
  sitemap: {
    path: '/sitemap',
    priority: 0.3,
    changefreq: 'weekly',
    lastmod: '2024-12-19'
  }
};

// Generate canonical URL for a specific page
export const generateCanonicalUrl = (pageKey: string): string => {
  const config = canonicalUrls[pageKey];
  if (!config) {
    console.warn(`No canonical URL configuration found for page: ${pageKey}`);
    return `${BASE_URL}/`;
  }
  return `${BASE_URL}${config.path}`;
};

// Generate canonical URL for project details
export const generateProjectCanonicalUrl = (projectSlug: string): string => {
  return `${BASE_URL}/projects/${projectSlug}`;
};

// Generate canonical URL for service pages with query parameters
export const generateServiceCanonicalUrl = (servicePath: string, location?: string): string => {
  if (location) {
    // For location-specific queries, canonical should point to the main service page
    return `${BASE_URL}${servicePath}`;
  }
  return `${BASE_URL}${servicePath}`;
};

// Check if a URL should be canonicalized
export const shouldCanonicalize = (currentPath: string, canonicalPath: string): boolean => {
  // Remove query parameters for comparison
  const cleanCurrent = currentPath.split('?')[0];
  const cleanCanonical = canonicalPath.split('?')[0];
  
  return cleanCurrent !== cleanCanonical;
};

// Generate hreflang tags for multi-language support (future expansion)
export const generateHreflangTags = (pageKey: string) => {
  const config = canonicalUrls[pageKey];
  if (!config) return [];
  
  return [
    {
      rel: 'alternate',
      hreflang: 'en-AU',
      href: `${BASE_URL}${config.path}`
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${BASE_URL}${config.path}`
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${BASE_URL}${config.path}`
    }
  ];
};

// Canonical URL validation
export const validateCanonicalUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'arwc.com.au' && parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Generate canonical URL for breadcrumbs
export const generateBreadcrumbCanonical = (breadcrumbs: Array<{name: string, url: string}>) => {
  if (breadcrumbs.length === 0) return BASE_URL;
  
  // Return the last breadcrumb URL as canonical
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
  return lastBreadcrumb.url.startsWith('http') ? lastBreadcrumb.url : `${BASE_URL}${lastBreadcrumb.url}`;
};
