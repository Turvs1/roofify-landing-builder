export interface ProjectTemplate {
  category: 'residential' | 'commercial' | 'industrial' | 'heritage' | 'government';
  type: string;
  defaultFeatures: string[];
  defaultKeywords: string[];
  seoTemplate: {
    titleTemplate: string;
    descriptionTemplate: string;
  };
}

export const projectTemplates: Record<string, ProjectTemplate> = {
  residential: {
    category: 'residential',
    type: 'Residential',
    defaultFeatures: [
      'Custom roofing solutions',
      'Heritage preservation',
      'Storm damage restoration',
      'Insurance claim support'
    ],
    defaultKeywords: [
      'residential roofing',
      'home roofing',
      'house roof',
      'Queensland homes',
      'storm damage repair'
    ],
    seoTemplate: {
      titleTemplate: '{title} | Residential Roofing Project | ARW Construction | QLD',
      descriptionTemplate: '{title} - {description}. Located at {location}. This residential roofing project was completed by ARW Construction with {duration} timeline and {value} value. Professional roofing solutions for Queensland homes.'
    }
  },
  commercial: {
    category: 'commercial',
    type: 'Commercial',
    defaultFeatures: [
      'Commercial roofing systems',
      'Box gutter upgrades',
      'Structural improvements',
      'Business continuity'
    ],
    defaultKeywords: [
      'commercial roofing',
      'business roofing',
      'office buildings',
      'retail roofing',
      'Queensland commercial'
    ],
    seoTemplate: {
      titleTemplate: '{title} | Commercial Roofing Project | ARW Construction | QLD',
      descriptionTemplate: '{title} - {description}. Located at {location}. This commercial roofing project was completed by ARW Construction with {duration} timeline and {value} value. Professional commercial roofing solutions across Queensland.'
    }
  },
  industrial: {
    category: 'industrial',
    type: 'Industrial',
    defaultFeatures: [
      'Industrial roofing systems',
      'Heavy-duty materials',
      'Safety compliance',
      'Long-term durability'
    ],
    defaultKeywords: [
      'industrial roofing',
      'factory roofing',
      'warehouse roofing',
      'Queensland industrial',
      'heavy-duty roofing'
    ],
    seoTemplate: {
      titleTemplate: '{title} | Industrial Roofing Project | ARW Construction | QLD',
      descriptionTemplate: '{title} - {description}. Located at {location}. This industrial roofing project was completed by ARW Construction with {duration} timeline and {value} value. Professional industrial roofing solutions for Queensland businesses.'
    }
  },
  heritage: {
    category: 'heritage',
    type: 'Heritage Restoration',
    defaultFeatures: [
      'Heritage preservation',
      'Period-accurate materials',
      'Historical compliance',
      'Modern functionality'
    ],
    defaultKeywords: [
      'heritage restoration',
      'historical roofing',
      'period restoration',
      'Queensland heritage',
      'heritage preservation'
    ],
    seoTemplate: {
      titleTemplate: '{title} | Heritage Restoration Project | ARW Construction | QLD',
      descriptionTemplate: '{title} - {description}. Located at {location}. This heritage restoration project was completed by ARW Construction with {duration} timeline and {value} value. Professional heritage preservation and restoration across Queensland.'
    }
  },
  government: {
    category: 'government',
    type: 'Government & Public Infrastructure',
    defaultFeatures: [
      'Public safety compliance',
      'Government standards',
      'Infrastructure development',
      'Community facilities'
    ],
    defaultKeywords: [
      'government construction',
      'public infrastructure',
      'government roofing',
      'Queensland government',
      'public facilities',
      'infrastructure projects'
    ],
    seoTemplate: {
      titleTemplate: '{title} | Government Infrastructure Project | ARW Construction | QLD',
      descriptionTemplate: '{title} - {description}. Located at {location}. This government infrastructure project was completed by ARW Construction with {duration} timeline and {value} value. Professional government construction and public infrastructure solutions across Queensland.'
    }
  }
};

export const generateProjectSEO = (project: any, template?: ProjectTemplate) => {
  const projectTemplate = template || projectTemplates[project.category] || projectTemplates.residential;
  
  // Generate title
  let title = projectTemplate.seoTemplate.titleTemplate
    .replace('{title}', project.title)
    .replace('{category}', project.category)
    .replace('{type}', project.type);
  
  // Generate description
  let description = projectTemplate.seoTemplate.descriptionTemplate
    .replace('{title}', project.title)
    .replace('{description}', project.description)
    .replace('{location}', project.location)
    .replace('{duration}', project.duration)
    .replace('{value}', project.value);
  
  // Ensure description stays within optimal length
  if (description.length > 320) {
    description = description.substring(0, 317) + '...';
  }
  
  // Generate keywords
  const keywords = [
    ...projectTemplate.defaultKeywords,
    project.category,
    project.type,
    project.location.split(',')[0], // Just the suburb/city
    'roofing project',
    'construction case study',
    'ARW Construction',
    'Queensland'
  ];
  
  // Add project-specific features if available
  if (project.features && Array.isArray(project.features)) {
    keywords.push(...project.features.slice(0, 3).map(f => f.toLowerCase()));
  }
  
  return {
    title,
    description,
    keywords: [...new Set(keywords)], // Remove duplicates
    category: projectTemplate.category,
    type: projectTemplate.type,
    defaultFeatures: projectTemplate.defaultFeatures
  };
};

export const createNewProject = (projectData: any) => {
  const template = projectTemplates[projectData.category];
  const seoData = generateProjectSEO(projectData, template);
  
  return {
    ...projectData,
    ...seoData,
    features: projectData.features || template.defaultFeatures,
    // Add any other auto-generated fields
  };
};
