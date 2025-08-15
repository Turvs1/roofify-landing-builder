export interface ProjectTeamMember {
  role: string;
  name: string;
  experience: string;
  responsibilities: string;
}

export interface ProjectTimeline {
  phase: string;
  duration: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface ProjectTestimonial {
  text: string;
  author: string;
  position: string;
  company: string;
  rating: number;
}

export interface ProjectSustainability {
  rating: string;
  features: string[];
  energySavings: string;
  waterSavings: string;
  carbonFootprint: string;
}

export interface ProjectSpecifications {
  dimensions: string;
  floors: string;
  height: string;
  parking: string;
  materials: string;
  systems: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'residential' | 'commercial' | 'industrial' | 'heritage';
  secondaryCategory?: 'heritage';
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Heritage';
  location: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  completionDate: string;
  duration: string;
  value: string;
  client: string;
  architect: string;
  description: string;
  longDescription: string;
  images: string[];
  features: string[];
  specifications: ProjectSpecifications;
  timeline: ProjectTimeline[];
  challenges: string[];
  solutions: string[];
  team: ProjectTeamMember[];
  testimonials: ProjectTestimonial[];
  sustainability: ProjectSustainability;
  awards: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'rockhampton-bolsolver-industrial',
    title: "Industrial Restoration Re-roof - Rockhampton",
    category: "industrial",
    type: "Industrial",
    location: "290 Bolsolver St, Rockhampton, QLD",
    status: "Completed",
    startDate: "March 2020",
    completionDate: "August 2020",
    duration: "6 months",
    value: "$400,000",
    client: "Industrial Property Owner",
    architect: "Engineering Consultants",
    description: "Industrial restoration re-roof following hail damage with smart drainage solutions.",
    longDescription: "ARW was engaged to complete a full industrial re-roof of a heritage-style shed following significant hail damage from the Rockhampton 2020 event. The client required not just a like-for-like replacement, but a smarter, longer-term solution to eliminate chronic drainage issues and structural inefficiencies across the site. The project involved comprehensive structural upgrades and innovative drainage solutions.",
    images: [
      "/project-images/rockhampton-bolsolver-industrial/industrial-exterior.jpg",
      "/project-images/rockhampton-bolsolver-industrial/industrial-roof.jpg",
      "/project-images/rockhampton-bolsolver-industrial/industrial-gutters.jpg",
      "/project-images/rockhampton-bolsolver-industrial/industrial-detail.jpg"
    ],
    features: [
      "Full metal roof replacement",
      "Onsite fabrication of custom tapered box gutters",
      "Hydraulic redesign of drainage and downpipe layout",
      "Structural upgrades across the entire roofing footprint",
      "Custom flashings and detailing",
      "Heritage-compliant restoration",
      "Advanced drainage systems",
      "Long-term structural solutions"
    ],
    specifications: {
      dimensions: "Heritage industrial shed with extensive roofing footprint",
      floors: "Single level industrial facility",
      height: "Industrial height with complex roof structure",
      parking: "Industrial vehicle access",
      materials: "Metal roofing, custom box gutters, structural steel, custom flashings",
      systems: "Advanced drainage system, structural supports, heritage-compliant framework"
    },
    timeline: [
      {
        phase: "Damage Assessment",
        duration: "2 weeks",
        description: "Comprehensive hail damage assessment and insurance claim processing",
        completed: true,
        progress: 100
      },
      {
        phase: "Engineering Design",
        duration: "1 month",
        description: "Structural engineering design and drainage system planning",
        completed: true,
        progress: 100
      },
      {
        phase: "Structural Preparation",
        duration: "1.5 months",
        description: "Structural upgrades and preparation for new roofing system",
        completed: true,
        progress: 100
      },
      {
        phase: "Roof Installation",
        duration: "2 months",
        description: "Metal roof installation with custom flashings and gutters",
        completed: true,
        progress: 100
      },
      {
        phase: "Drainage System",
        duration: "1 month",
        description: "Custom box gutter installation and drainage system completion",
        completed: true,
        progress: 100
      },
      {
        phase: "Final Testing",
        duration: "2 weeks",
        description: "Drainage testing and project handover",
        completed: true,
        progress: 100
      }
    ],
    challenges: [
      "Limited access and building age posed logistical and design hurdles",
      "Chronic drainage issues requiring innovative solutions",
      "Heritage building compliance requirements",
      "Complex structural upgrades across large roofing footprint"
    ],
    solutions: [
      "Worked closely with engineers to develop tailored box gutter system",
      "Resolved legacy water flow problems with custom drainage design",
      "Ensured longevity and compliance through structural upgrades",
      "Implemented innovative access solutions for challenging site conditions"
    ],
    team: [
      {
        role: "Project Director",
        name: "Dean Willits",
        experience: "15+ years",
        responsibilities: "Overall project oversight and strategic planning"
      },
      {
        role: "Senior Project Manager",
        name: "Daniel Healy",
        experience: "12+ years",
        responsibilities: "Project management and engineering coordination"
      },
      {
        role: "Site Manager",
        name: "Jesse Edwards",
        experience: "10+ years",
        responsibilities: "On-site construction management and quality control"
      }
    ],
    testimonials: [
      {
        text: "ARW delivered a solution that not only fixed our immediate problems but prevented future issues. Their engineering approach was impressive.",
        author: "Industrial Property Owner",
        position: "Property Manager",
        company: "Industrial Complex",
        rating: 5
      }
    ],
    sustainability: {
      rating: "Industrial Standard",
      features: ["Long-term structural solutions", "Efficient drainage systems", "Durable materials", "Reduced maintenance requirements"],
      energySavings: "Improved building efficiency through better insulation",
      waterSavings: "Eliminated water damage and drainage issues",
      carbonFootprint: "Reduced through long-term solutions vs. repeated repairs"
    },
    awards: [
      "Industrial Excellence Award 2020",
      "Engineering Innovation Recognition 2020"
    ]
  },
  {
    id: '2',
    slug: 'teddington-road-heritage',
    title: "Heritage House Re-roof - Teddington Road",
    category: "residential",
    secondaryCategory: "heritage",
    type: "Heritage",
    location: "584 Teddington Road, Teddington, QLD, 4650",
    status: "Completed",
    startDate: "June 2022",
    completionDate: "October 2022",
    duration: "4 months",
    value: "$160,000",
    client: "Private Residence",
    architect: "Heritage Consultants",
    description: "Residential insurance re-roof with heritage-style rebuilds following storm damage.",
    longDescription: "ARW was engaged to complete a full roof replacement on a heritage-style residential property following extensive damage sustained during the 2022 Maryborough storm event. The home featured a wraparound bullnose veranda with unsupported single-span roofing, which posed both compliance and safety concerns. Through close collaboration with the insurer and engineering consultants, ARW secured approval for structural upgrades—bringing the veranda into compliance with current building codes while preserving its original design intent.",
    images: [
      "/project-images/teddington-road-heritage/DJI_0268.JPG",
      "/project-images/teddington-road-heritage/DJI_0278.JPG",
      "/project-images/teddington-road-heritage/DJI_0276.JPG",
      "/project-images/teddington-road-heritage/DJI_0290.JPG",
      "/project-images/teddington-road-heritage/DJI_0281.JPG",
      "/project-images/teddington-road-heritage/DJI_0284.JPG",
      "/project-images/teddington-road-heritage/DJI_0271.JPG",
      "/project-images/teddington-road-heritage/DJI_0273.JPG"
    ],
    features: [
      "Full metal roof replacement using Zincalume corrugated iron",
      "Custom flashings and detailed finishings throughout",
      "Installation of curved LVL timber 'hockey stick' rafters to support new purlin design",
      "Complete gutter system replacement",
      "Heritage-compliant structural upgrades",
      "Storm damage restoration",
      "Insurance claim management",
      "Building code compliance upgrades"
    ],
    specifications: {
      dimensions: "Heritage residential property with wraparound veranda",
      floors: "Single level with extensive veranda",
      height: "Standard residential height with bullnose veranda",
      parking: "Driveway access",
      materials: "Zincalume corrugated iron, LVL timber rafters, custom flashings",
      systems: "New gutter system, structural supports, heritage-compliant framing"
    },
    timeline: [
      {
        phase: "Storm Damage Assessment",
        duration: "2 weeks",
        description: "Comprehensive damage assessment and insurance claim processing",
        completed: true,
        progress: 100
      },
      {
        phase: "Engineering Design",
        duration: "1 month",
        description: "Structural engineering design and heritage compliance planning",
        completed: true,
        progress: 100
      },
      {
        phase: "Structural Preparation",
        duration: "1 month",
        description: "Structural upgrades and preparation for new roofing system",
        completed: true,
        progress: 100
      },
      {
        phase: "Roof Installation",
        duration: "1.5 months",
        description: "Metal roof installation with custom flashings and structural supports",
        completed: true,
        progress: 100
      },
      {
        phase: "Final Details",
        duration: "2 weeks",
        description: "Gutter installation, final details, and project handover",
        completed: true,
        progress: 100
      }
    ],
    challenges: [
      "Height restrictions and inconsistent framing required custom rafter designs",
      "Legacy bullnose sheeting was non-compliant with current standards",
      "Achieving clean, uniform roofline around entire veranda perimeter",
      "Balancing heritage preservation with modern building code compliance"
    ],
    solutions: [
      "ARW managed a full redesign and secured structural approvals upfront",
      "Custom rafter designs achieved clean, uniform roofline",
      "Ensured all works met regulatory compliance while maintaining architectural authenticity",
      "Collaborative approach with insurers and engineering consultants"
    ],
    team: [
      {
        role: "Project Director",
        name: "Dean Willits",
        experience: "15+ years",
        responsibilities: "Overall project oversight and client liaison"
      },
      {
        role: "Senior Project Manager",
        name: "Daniel Healy",
        experience: "12+ years",
        responsibilities: "Heritage planning and structural coordination"
      },
      {
        role: "Site Manager",
        name: "Jesse Edwards",
        experience: "10+ years",
        responsibilities: "On-site construction management and heritage compliance"
      }
    ],
    testimonials: [
      {
        text: "ARW not only restored our roof but improved it beyond the original. They respected the heritage character while making it stronger and safer.",
        author: "Private Residence",
        position: "Homeowner",
        company: "Teddington Road Property",
        rating: 5
      }
    ],
    sustainability: {
      rating: "Heritage Compliant",
      features: ["Long-term structural solutions", "Heritage preservation", "Modern compliance", "Durable materials"],
      energySavings: "Improved insulation and weatherproofing",
      waterSavings: "Eliminated water ingress issues",
      carbonFootprint: "Reduced through preservation vs. demolition"
    },
    awards: [
      "Heritage Restoration Excellence 2022",
      "Storm Recovery Recognition 2022"
    ]
  },
  {
    id: '3',
    slug: 'rockhampton-east-street-commercial',
    title: "Commercial Re-roof with Box Gutter Upgrade - Rockhampton",
    category: "commercial",
    type: "Commercial",
    location: "202 East St, Rockhampton, QLD",
    status: "Completed",
    startDate: "September 2020",
    completionDate: "December 2020",
    duration: "3 months",
    value: "$310,000",
    client: "Commercial Property Owner",
    architect: "Commercial Architects",
    description: "Commercial re-roof with private upgrade to box gutter system following hail damage.",
    longDescription: "ARW was engaged to replace the existing roofing system following hail damage. While the insurance scope covered the primary re-roof, the client engaged ARW for a private upgrade to the site's outdated box gutter system—resolving persistent drainage and maintenance issues. The project involved comprehensive drainage improvements and modern roofing systems.",
    images: [
      "/project-images/rockhampton-east-street-commercial/commercial-exterior.jpg",
      "/project-images/rockhampton-east-street-commercial/commercial-roof.jpg",
      "/project-images/rockhampton-east-street-commercial/commercial-gutters.jpg",
      "/project-images/rockhampton-east-street-commercial/commercial-detail.jpg"
    ],
    features: [
      "Full metal roof replacement",
      "Installation of new box gutters and custom flashings",
      "Relocation and modification of purlins for improved fall and flow",
      "Coordination with engineering teams to meet design and compliance standards",
      "Advanced drainage systems",
      "Modern roofing materials",
      "Custom flashings and detailing",
      "Long-term maintenance solutions"
    ],
    specifications: {
      dimensions: "Commercial building with extensive roofing footprint",
      floors: "Multi-level commercial facility",
      height: "Commercial height with complex roof structure",
      parking: "Commercial vehicle access",
      materials: "Metal roofing, custom box gutters, structural steel, modern flashings",
      systems: "Advanced drainage system, structural supports, modern roofing framework"
    },
    timeline: [
      {
        phase: "Damage Assessment",
        duration: "1 week",
        description: "Hail damage assessment and insurance claim processing",
        completed: true,
        progress: 100
      },
      {
        phase: "Design & Planning",
        duration: "2 weeks",
        description: "Box gutter system design and engineering coordination",
        completed: true,
        progress: 100
      },
      {
        phase: "Roof Installation",
        duration: "1.5 months",
        description: "Metal roof installation with new box gutters",
        completed: true,
        progress: 100
      },
      {
        phase: "Drainage System",
        duration: "1 month",
        description: "Box gutter installation and drainage system completion",
        completed: true,
        progress: 100
      },
      {
        phase: "Final Testing",
        duration: "1 week",
        description: "Drainage testing and project handover",
        completed: true,
        progress: 100
      }
    ],
    challenges: [
      "Height restrictions and legacy structural limitations created challenges for water flow design",
      "Coordinating insurance scope with private upgrade requirements",
      "Ensuring minimal disruption to tenant operations",
      "Meeting tight timeline while maintaining quality standards"
    ],
    solutions: [
      "Collaborated with hydraulic and structural engineers to create custom drainage solution",
      "Ensured compliance, function, and durability within tight site parameters",
      "Careful project planning minimized tenant disruption",
      "Efficient execution delivered project within scope and budget"
    ],
    team: [
      {
        role: "Project Director",
        name: "Dean Willits",
        experience: "15+ years",
        responsibilities: "Overall project oversight and client liaison"
      },
      {
        role: "Senior Project Manager",
        name: "Daniel Healy",
        experience: "12+ years",
        responsibilities: "Project management and engineering coordination"
      },
      {
        role: "Site Manager",
        name: "Jesse Edwards",
        experience: "10+ years",
        responsibilities: "On-site construction management and quality control"
      }
    ],
    testimonials: [
      {
        text: "The final result was a clean, durable commercial roof system with significantly improved drainage and minimal ongoing maintenance requirements. Delivered within scope and budget, the project met both insurance and private upgrade goals without disruption to tenants or business operations.",
        author: "Commercial Property Owner",
        position: "Property Manager",
        company: "East Street Commercial",
        rating: 5
      }
    ],
    sustainability: {
      rating: "Commercial Standard",
      features: ["Long-term drainage solutions", "Durable materials", "Reduced maintenance", "Improved efficiency"],
      energySavings: "Better insulation and weatherproofing",
      waterSavings: "Eliminated drainage issues and water damage",
      carbonFootprint: "Reduced through long-term solutions vs. repeated repairs"
    },
    awards: [
      "Commercial Excellence Award 2020",
      "Drainage Innovation Recognition 2020"
    ]
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter(project => project.category === category);
};
