export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType: string;
  canonical: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export const seoConfig: Record<string, SEOConfig> = {
  home: {
    title: "ARW Construction | Premium Roofing & Construction | QLD",
    description: "Leading Queensland construction company specializing in premium roofing solutions, heritage restoration, and comprehensive construction services. 15+ years of excellence.",
    keywords: ["roofing", "construction", "heritage restoration", "Queensland", "ARW Construction", "roof repairs", "commercial roofing", "industrial roofing"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au",
    ogSiteName: "ARW Construction",
    ogLocale: "en_AU",
    twitterCard: "summary_large_image",
    twitterSite: "@ARWConstruction",
    twitterCreator: "@ARWConstruction"
  },
  about: {
    title: "About ARW Construction | Our Story & Mission | QLD",
    description: "Discover ARW Construction's journey from 2013 to becoming Queensland's trusted roofing and construction partner. Learn about our commitment to quality and innovation.",
    keywords: ["about ARW", "construction company", "Queensland", "roofing history", "company mission"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/about"
  },
  services: {
    title: "Roofing & Construction Services | ARW Construction | QLD",
    description: "Comprehensive roofing and construction services including installation, repairs, maintenance, new construction, renovations, and heritage restoration across Queensland.",
    keywords: ["roofing services", "construction services", "roof installation", "roof repairs", "heritage restoration", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services"
  },
  projects: {
    title: "Our Projects | ARW Construction Portfolio | QLD",
    description: "Explore ARW Construction's impressive portfolio of residential, commercial, industrial, and heritage restoration projects across Queensland. View our completed work.",
    keywords: ["construction projects", "roofing projects", "portfolio", "Queensland projects", "heritage restoration"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/projects"
  },
  team: {
    title: "Our Team | ARW Construction | QLD",
    description: "Meet the experienced professionals behind ARW Construction. Our team brings 15+ years of expertise in roofing, construction, and heritage restoration.",
    keywords: ["construction team", "roofing experts", "Queensland", "professional team", "construction professionals"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/team"
  },
  contact: {
    title: "Contact ARW Construction | Get Your Quote | QLD",
    description: "Contact ARW Construction for all your roofing and construction needs. Get a free quote, emergency assistance, or general inquiries. Serving Queensland with excellence.",
    keywords: ["contact", "quote", "emergency roofing", "Queensland", "construction quote"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/contact"
  },
  roofInstallation: {
    title: "Roof Installation Services | ARW Construction | QLD",
    description: "Professional roof installation services for residential, commercial, and industrial properties. Expert installation with premium materials and guaranteed workmanship.",
    keywords: ["roof installation", "new roof", "roofing contractor", "Queensland", "commercial roofing"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/roof-installation"
  },
  roofRepairs: {
    title: "Roof Repair Services | Emergency & Maintenance | ARW Construction",
    description: "Fast, reliable roof repair services for all types of damage. Emergency repairs, storm damage restoration, and preventive maintenance across Queensland.",
    keywords: ["roof repairs", "emergency roofing", "storm damage", "roof maintenance", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/roof-repairs"
  },
  roofMaintenance: {
    title: "Roof Maintenance Services | ARW Construction | QLD",
    description: "Professional roof maintenance services to extend your roof's lifespan. Regular inspections, cleaning, repairs, and preventive care across Queensland.",
    keywords: ["roof maintenance", "roof inspection", "preventive care", "Queensland", "roof cleaning"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/roof-maintenance"
  },
  newConstruction: {
    title: "New Construction Services | ARW Construction | QLD",
    description: "Complete new construction services for commercial and industrial projects. Project management, design consultation, and quality control across Queensland.",
    keywords: ["new construction", "commercial construction", "industrial construction", "Queensland", "project management"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/new-construction"
  },
  renovations: {
    title: "Renovation Services | ARW Construction | QLD",
    description: "Comprehensive renovation and upgrade services for existing properties. Structural upgrades, modernization, and energy efficiency improvements across Queensland.",
    keywords: ["renovations", "building upgrades", "structural improvements", "Queensland", "modernization"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/renovations"
  },
  extensions: {
    title: "Building Extensions | ARW Construction | QLD",
    description: "Professional building extensions and additions. Design planning, permit assistance, and seamless integration with existing structures across Queensland.",
    keywords: ["building extensions", "property additions", "construction planning", "Queensland", "permit assistance"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/extensions"
  },
  insurance: {
    title: "Insurance Roofing Services | ARW Construction | QLD",
    description: "Specialized insurance roofing services for storm damage, hail damage, and insurance claims. Expert assessment and restoration services across Queensland.",
    keywords: ["insurance roofing", "storm damage", "hail damage", "insurance claims", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/insurance"
  },
  insulationServices: {
    title: "Insulation Services | ARW Construction | QLD",
    description: "Energy-efficient insulation solutions for homes and commercial buildings. Ceiling, wall, and underfloor insulation installation across Queensland.",
    keywords: ["insulation services", "energy efficiency", "ceiling insulation", "Queensland", "thermal performance"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/insulation-services"
  },
  gutterSystems: {
    title: "Gutter Systems | ARW Construction | QLD",
    description: "Complete gutter and drainage solutions for residential and commercial properties. Installation, maintenance, and leaf guard systems across Queensland.",
    keywords: ["gutter systems", "drainage solutions", "gutter installation", "Queensland", "leaf guards"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/gutter-systems"
  },
  projectDetails: {
    title: "Project Details | ARW Construction | QLD",
    description: "Detailed information about ARW Construction projects. View specifications, timelines, and outcomes of our completed roofing and construction work.",
    keywords: ["project details", "construction projects", "roofing projects", "Queensland", "project portfolio"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/projects"
  },
  roofReport: {
    title: "Roof Report | ARW Construction | QLD",
    description: "Comprehensive roof assessment and reporting services. Professional inspections, detailed reports, and maintenance recommendations across Queensland.",
    keywords: ["roof report", "roof assessment", "inspection services", "Queensland", "maintenance recommendations"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/roof-report"
  },
  jobUploads: {
    title: "Job Uploads | ARW Construction | QLD",
    description: "Upload your roofing and construction job requirements. Submit project details, photos, and specifications for professional assessment and quotes.",
    keywords: ["job uploads", "project submission", "construction quotes", "Queensland", "roofing assessment"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/job-uploads"
  },
  sitemap: {
    title: "Site Map | ARW Construction | QLD",
    description: "Complete site map of ARW Construction website. Navigate through all our services, projects, and company information pages.",
    keywords: ["site map", "website navigation", "ARW Construction", "Queensland", "services directory"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/sitemap"
  },
  notFound: {
    title: "Page Not Found | ARW Construction | QLD",
    description: "The page you're looking for cannot be found. Return to ARW Construction's homepage for roofing and construction services in Queensland.",
    keywords: ["page not found", "404 error", "ARW Construction", "Queensland", "roofing services"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au"
  },
  brisbaneRoofing: {
    title: "Brisbane Roofing Services | Expert Roofing Contractor | ARW Construction",
    description: "Professional roofing services across Brisbane including CBD, Paddington, Chermside & surrounding suburbs. Heritage restoration, storm damage repair & new installations.",
    keywords: ["Brisbane roofing", "roofing contractor Brisbane", "heritage roofing Brisbane", "storm damage repair Brisbane", "Paddington roofing", "Chermside roofing", "CBD roofing"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/brisbane-roofing"
  },
  goldCoastRoofing: {
    title: "Gold Coast Roofing Services | Coastal Roofing Experts | ARW Construction",
    description: "Expert roofing services across the Gold Coast from Surfers Paradise to hinterland. Coastal roofing, storm protection & heritage restoration specialists.",
    keywords: ["Gold Coast roofing", "coastal roofing", "Surfers Paradise roofing", "storm protection roofing", "hinterland roofing", "salt air protection", "tropical roofing"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/gold-coast-roofing"
  },
  sunshineCoastRoofing: {
    title: "Sunshine Coast Roofing Services | Coastal & Hinterland Roofing | ARW Construction",
    description: "Professional roofing services from Caloundra to Noosa. Coastal environment expertise, heritage restoration & modern installations across the Sunshine Coast.",
    keywords: ["Sunshine Coast roofing", "Caloundra roofing", "Noosa roofing", "coastal roofing", "hinterland roofing", "heritage restoration", "tropical climate roofing"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/services/sunshine-coast-roofing"
  },
  locations: {
    title: "Roofing Services by Location | ARW Construction | QLD",
    description: "Find ARW Construction roofing services in your area. Professional roofing solutions across Brisbane, Gold Coast, and Sunshine Coast. Local expertise, trusted service.",
    keywords: ["roofing services", "Brisbane roofing", "Gold Coast roofing", "Sunshine Coast roofing", "local roofing", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/locations"
  },
  "location-brisbane": {
    title: "Brisbane Roofing Services | ARW Construction | QLD",
    description: "Professional roofing services across Greater Brisbane. Expert installation, repairs, maintenance, and new construction. Local Brisbane team with 15+ years experience.",
    keywords: ["Brisbane roofing", "roofing Brisbane", "roof repairs Brisbane", "roof installation Brisbane", "Brisbane roofers", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/locations/brisbane"
  },
  "location-gold-coast": {
    title: "Gold Coast Roofing Services | ARW Construction | QLD",
    description: "Expert coastal roofing solutions for the Gold Coast. Specialized storm protection, salt-resistant materials, and cyclonic-rated installation. Local Gold Coast expertise.",
    keywords: ["Gold Coast roofing", "roofing Gold Coast", "coastal roofing", "storm protection", "Gold Coast roofers", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/locations/gold-coast"
  },
  "location-sunshine-coast": {
    title: "Sunshine Coast Roofing Services | ARW Construction | QLD",
    description: "Reliable roofing services throughout the Sunshine Coast. Coastal and hinterland expertise from Caloundra to Noosa. Local team with regional knowledge.",
    keywords: ["Sunshine Coast roofing", "roofing Sunshine Coast", "coastal roofing", "hinterland roofing", "Sunshine Coast roofers", "Queensland"],
    ogImage: "/og-image.png",
    ogType: "website",
    canonical: "https://arwc.com.au/locations/sunshine-coast"
  }
};

export const generateMetaTags = (page: string, project?: any) => {
  let config = seoConfig[page] || seoConfig.home;
  
  // If it's a project details page and we have project data, generate dynamic meta tags
  if (page === 'projectDetails' && project) {
    // Create a more descriptive title
    const projectTitle = `${project.title} | ${project.category} Project | ARW Construction | QLD`;
    
    // Create a comprehensive, searchable description
    let projectDescription = `${project.title} - ${project.description}. `;
    projectDescription += `Located at ${project.location}. `;
    projectDescription += `This ${project.category} project was completed by ARW Construction with ${project.duration} timeline and ${project.value} value. `;
    projectDescription += `View detailed specifications, challenges, solutions, and outcomes.`;
    
    // Ensure description stays within optimal length (120-320 characters)
    if (projectDescription.length > 320) {
      projectDescription = projectDescription.substring(0, 317) + '...';
    }
    
    // Generate project-specific keywords
    const projectKeywords = [
      project.category,
      project.type,
      project.location.split(',')[0], // Just the suburb/city
      'roofing project',
      'construction case study',
      'ARW Construction',
      'Queensland'
    ];
    
    // Add project-specific features as keywords if available
    if (project.features && Array.isArray(project.features)) {
      projectKeywords.push(...project.features.slice(0, 3).map(f => f.toLowerCase()));
    }
    
    config = {
      ...config,
      title: projectTitle,
      description: projectDescription,
      keywords: [...config.keywords, ...projectKeywords],
      canonical: `https://arwc.com.au/projects/${project.slug}`,
      ogImage: project.images && project.images.length > 0 ? project.images[0] : config.ogImage
    };
  }
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(", "),
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage: config.ogImage,
    ogType: config.ogType,
    canonical: config.canonical
  };
};
