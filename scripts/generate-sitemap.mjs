#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file based on the current site structure.
 * Run this script whenever you add new pages or projects to keep the sitemap updated.
 * 
 * Usage:
 *   npm run generate-sitemap
 *   node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSitemap() {
  const baseUrl = 'https://arwc.com.au';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Static routes configuration
  const staticRoutes = [
    // Main Pages
    { loc: '/', lastmod: currentDate, changefreq: 'weekly', priority: 1.0 },
    { loc: '/about', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/services', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/locations', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/projects', lastmod: currentDate, changefreq: 'weekly', priority: 0.8 },
    { loc: '/team', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/contact', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/roof-report', lastmod: currentDate, changefreq: 'monthly', priority: 0.6 },
    { loc: '/sitemap', lastmod: currentDate, changefreq: 'monthly', priority: 0.3 },
    { loc: '/safety-quality', lastmod: currentDate, changefreq: 'monthly', priority: 0.6 },
    { loc: '/terms-of-service', lastmod: currentDate, changefreq: 'yearly', priority: 0.3 },
    { loc: '/privacy-policy', lastmod: currentDate, changefreq: 'yearly', priority: 0.3 },
    { loc: '/pre-works-form', lastmod: currentDate, changefreq: 'monthly', priority: 0.5 },
    { loc: '/job-uploads', lastmod: currentDate, changefreq: 'monthly', priority: 0.4 },
    
    // Service Pages
    { loc: '/services/roof-installation', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/roof-repairs', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/roof-maintenance', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/new-construction', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/renovations', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/extensions', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/insurance', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/insulation-services', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/services/gutter-systems', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    
    // Location Pages
    { loc: '/locations/brisbane', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/locations/gold-coast', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
    { loc: '/locations/sunshine-coast', lastmod: currentDate, changefreq: 'monthly', priority: 0.8 },
  ];

  // Dynamic project routes - hardcoded for now, can be updated manually
  const projectRoutes = [
    { loc: '/projects/rockhampton-bolsolver-industrial', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/projects/rockhampton-east-street-commercial', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/projects/sydney-cbd-commercial', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/projects/teddington-road-heritage', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
    { loc: '/projects/melbourne-heritage-restoration', lastmod: currentDate, changefreq: 'monthly', priority: 0.7 },
  ];

  // Generate XML sitemap
  const generateUrlElement = (url) => {
    return `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  };

  const allUrls = [...staticRoutes, ...projectRoutes];
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(generateUrlElement).join('\n')}
</urlset>`;

  return xmlContent;
}

async function main() {
  try {
    console.log('🚀 Generating sitemap...');
    
    // Generate the sitemap content
    const sitemapContent = generateSitemap();
    
    // Write to public/sitemap.xml
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    
    console.log('✅ Sitemap generated successfully!');
    console.log(`📁 Location: ${sitemapPath}`);
    
    // Count URLs in the sitemap
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    console.log(`🔗 Total URLs: ${urlCount}`);
    
    console.log('\n📋 Sitemap includes:');
    console.log('  • All main pages (Home, About, Services, etc.)');
    console.log('  • All service pages');
    console.log('  • All location pages');
    console.log('  • All project pages');
    console.log('\n💡 To update projects, edit this script and run again!');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
main();
