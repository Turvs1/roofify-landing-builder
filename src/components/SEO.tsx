import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '../lib/seo';
import { generateOrganizationSchema, generateConstructionSchema, generateFAQSchema, generateProjectSchema, generateBreadcrumbSchema, generateLocalBusinessSchema, generateReviewSchema } from '../lib/schema';
import { generateCanonicalUrl, generateProjectCanonicalUrl, generateHreflangTags } from '../lib/canonicalUrls';

interface SEOProps {
  page: string;
  faqs?: Array<{question: string, answer: string}>;
  project?: any;
  breadcrumbs?: Array<{name: string, url: string}>;
}

const SEO: React.FC<SEOProps> = ({ page, faqs, project, breadcrumbs }) => {
  const meta = generateMetaTags(page, project);
  

  
  // Generate appropriate schema based on page type
  const getSchema = () => {
    if (page === 'home') {
      return [
        generateOrganizationSchema(),
        generateConstructionSchema(),
        generateLocalBusinessSchema(),
        generateReviewSchema([])
      ];
    }
    
    // Add canonical URL schema for all pages
    const canonicalSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": meta.canonical,
      "mainEntity": {
        "@type": "Organization",
        "name": "ARW Construction",
        "url": "https://arwc.com.au"
      }
    };
    
    if (page === 'home') {
      return [
        generateOrganizationSchema(),
        generateConstructionSchema(),
        generateLocalBusinessSchema(),
        generateReviewSchema([]),
        canonicalSchema
      ];
    }
    
    if (page === 'projects' && project) {
      return [
        generateOrganizationSchema(),
        generateProjectSchema(project),
        breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : null,
        canonicalSchema
      ].filter(Boolean);
    }
    
    if (faqs && faqs.length > 0) {
      return [
        generateOrganizationSchema(),
        generateFAQSchema(faqs),
        canonicalSchema
      ];
    }
    
    return [generateOrganizationSchema(), canonicalSchema];
  };

  const schemas = getSchema();

  return (
    <Helmet>
        {/* Basic Meta Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical} />
        
        {/* Hreflang Tags for International SEO */}
        {generateHreflangTags(page).map((tag, index) => (
          <link key={index} rel={tag.rel} hrefLang={tag.hreflang} href={tag.href} />
        ))}
        
        {/* Open Graph Meta Tags */}
             <meta property="og:title" content={meta.ogTitle} />
             <meta property="og:description" content={meta.ogDescription} />
             <meta property="og:image" content={meta.ogImage} />
             <meta property="og:type" content={meta.ogType} />
             <meta property="og:url" content={meta.canonical} />
             <meta property="og:site_name" content="ARW Construction" />
             <meta property="og:locale" content="en_AU" />
             <meta property="og:image:width" content="1200" />
             <meta property="og:image:height" content="630" />
             <meta property="og:image:alt" content="ARW Construction - Premium Roofing & Construction Services" />
        
                  {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@ARWConstruction" />
          <meta name="twitter:creator" content="@ARWConstruction" />
          <meta name="twitter:title" content={meta.ogTitle} />
          <meta name="twitter:description" content={meta.ogDescription} />
          <meta name="twitter:image" content={meta.ogImage} />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="ARW Construction" />
        <meta name="creator" content="ARW Construction" />
        <meta name="publisher" content="ARW Construction" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="AU-QLD" />
        <meta name="geo.placename" content="Queensland" />
        <meta name="geo.country" content="AU" />
        <meta name="format-detection" content="telephone=no, address=no, email=no" />
        <meta name="theme-color" content="#1A3969" />
        <meta name="msapplication-TileColor" content="#1A3969" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ARW Construction" />
        
        {/* Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemas)}
        </script>
      </Helmet>
  );
};

export default SEO;
