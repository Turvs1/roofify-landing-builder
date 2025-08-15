export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ARW Construction",
    "alternateName": "ARW",
    "description": "Leading Australian construction company specializing in premium roofing solutions, heritage restoration, and comprehensive construction services.",
    "url": "https://arwc.com.au",
    "logo": "https://arwc.com.au/lovable-uploads/2ad4d34b-5d39-43bf-82db-a8d5a53727a5.png",
    "image": "https://arwc.com.au/og-image.png",
    "telephone": "+61423736921",
    "email": "info@arwc.com.au",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressRegion": "QLD",
      "addressLocality": "Queensland"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-23.0",
      "longitude": "143.0"
    },
    "areaServed": {
      "@type": "State",
      "name": "Queensland"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "-23.0",
        "longitude": "143.0"
      },
      "geoRadius": "1000000"
    },
    "foundingDate": "2013",
    "founder": {
      "@type": "Person",
      "name": "Dean Willits"
    },
    "employee": [
      {
        "@type": "Person",
        "name": "Dean Willits",
        "jobTitle": "Director",
        "description": "Founder and director with 15+ years of roofing experience"
      },
      {
        "@type": "Person",
        "name": "Daniel Healy",
        "jobTitle": "General Manager",
        "description": "General Manager with over a decade of hands-on roofing and construction experience"
      },
      {
        "@type": "Person",
        "name": "Jesse Edwards",
        "jobTitle": "Project Manager",
        "description": "Project Manager with expertise in construction management and site coordination"
      }
    ],
    "serviceType": [
      "Roof Installation",
      "Roof Repairs",
      "Roof Maintenance",
      "New Construction",
      "Renovations",
      "Extensions",
      "Insurance Roofing",
      "Heritage Restoration",
      "Insulation Services",
      "Gutter Systems"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Construction Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roof Installation",
            "description": "Professional roof installation for residential, commercial, and industrial properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Roof Repairs",
            "description": "Emergency and maintenance roof repair services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heritage Restoration",
            "description": "Specialized heritage building restoration and preservation"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Industrial Property Owner"
        },
        "reviewBody": "ARW delivered a solution that not only fixed our immediate problems but prevented future issues. Their engineering approach was impressive."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Private Residence"
        },
        "reviewBody": "ARW not only restored our roof but improved it beyond the original. They respected the heritage character while making it stronger and safer."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/arwconstruction",
      "https://www.instagram.com/arwconstruction",
      "https://www.linkedin.com/company/arw-construction"
    ],
    "openingHours": "Mo-Fr 07:00-17:00",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "AUD"
  };
};

export const generateConstructionSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ARW Construction",
    "description": "Professional construction and roofing company serving Queensland with premium services and exceptional quality.",
    "url": "https://arwc.com.au",
    "logo": "https://arwc.com.au/lovable-uploads/2ad4d34b-5d39-43bf-82db-a8d5a53727a5.png",
    "foundingDate": "2013",
    "industry": "Construction",
    "numberOfEmployees": "25",
    "parentOrganization": {
      "@type": "Organization",
      "name": "ARW Group"
    },
    "subOrganization": [
      {
        "@type": "Organization",
        "name": "ARW Roofing Division",
        "description": "Specialized roofing services division"
      },
      {
        "@type": "Organization",
        "name": "ARW Construction Division",
        "description": "General construction and renovation services"
      }
    ],
    "knowsAbout": [
      "Roofing",
      "Construction",
      "Heritage Restoration",
      "Storm Damage Repair",
      "Insurance Claims",
      "Commercial Construction",
      "Industrial Construction",
      "Residential Construction"
    ],
    "award": [
      "Industrial Excellence Award 2020",
      "Heritage Restoration Excellence 2022",
      "Commercial Excellence Award 2020"
    ],
    "brand": {
      "@type": "Brand",
      "name": "ARW Construction",
      "slogan": "WE BELIEVE EVERY PROPERTY DESERVES A STRONG ROOF"
    }
  };
};

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateProjectSchema = (project: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.images,
    "creator": {
      "@type": "Organization",
      "name": "ARW Construction"
    },
    "dateCreated": project.startDate,
    "dateModified": project.completionDate,
    "location": {
      "@type": "Place",
      "name": project.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": project.location.split(',')[0],
        "addressRegion": "QLD",
        "addressCountry": "AU"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": project.location.split(',')[0]
    },
    "serviceType": project.type,
    "category": project.category,
    "keywords": project.features.join(", "),
    "review": project.testimonials?.map((testimonial: any) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": testimonial.author
      },
      "reviewBody": testimonial.text
    })) || []
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ARW Construction",
  "image": "https://arwc.com.au/og-image.png",
  "description": "Premium roofing and construction services across SE Queensland including Brisbane, Gold Coast, Sunshine Coast, Logan, and Ipswich.",
  "url": "https://arwc.com.au",
  "telephone": "0423 736 921",
  "email": "info@arwc.com.au",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Construction Way",
    "addressLocality": "Brisbane",
    "addressRegion": "QLD",
    "postalCode": "4000",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -27.4698,
    "longitude": 153.0251
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Brisbane"
    },
    {
      "@type": "City", 
      "name": "Gold Coast"
    },
    {
      "@type": "City",
      "name": "Sunshine Coast"
    },
    {
      "@type": "City",
      "name": "Logan"
    },
    {
      "@type": "City",
      "name": "Ipswich"
    },
    {
      "@type": "City",
      "name": "Redland Bay"
    }
  ],
  "priceRange": "$$",
  "openingHours": "Mo-Fr 07:00-18:00",
  "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
  "currenciesAccepted": "AUD",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Roofing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Roof Installation"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Roof Repairs"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Heritage Restoration"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/arwconstruction",
    "https://www.linkedin.com/company/arw-construction"
  ]
});

export const generateReviewSchema = (reviews: any[]) => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "itemReviewed": {
    "@type": "LocalBusiness",
    "name": "ARW Construction"
  },
  "ratingValue": "4.8",
  "reviewCount": reviews.length || 25,
  "bestRating": "5",
  "worstRating": "1"
});
