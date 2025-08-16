#!/usr/bin/env node

/**
 * Performance Audit Script for ARW Construction
 * 
 * This script analyzes your build output and provides performance optimization recommendations.
 * 
 * Usage:
 *   npm run performance-audit
 *   node scripts/performance-audit.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function analyzeBuildOutput() {
  const distPath = path.join(__dirname, '../dist');
  
  console.log('🔍 Performance Audit for ARW Construction');
  console.log('==========================================\n');
  
  try {
    // Analyze JavaScript bundles
    const jsFiles = fs.readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(distPath, 'assets', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024),
          sizeMB: Math.round(stats.size / 1024 / 1024 * 100) / 100
        };
      });
    
    console.log('📦 JavaScript Bundle Analysis:');
    jsFiles.forEach(file => {
      const status = file.sizeMB > 1 ? '⚠️  LARGE' : '✅ GOOD';
      console.log(`  ${status} ${file.name}: ${file.sizeKB} KB (${file.sizeMB} MB)`);
    });
    
    // Analyze CSS
    const cssFiles = fs.readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(distPath, 'assets', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024)
        };
      });
    
    console.log('\n🎨 CSS Analysis:');
    cssFiles.forEach(file => {
      const status = file.sizeKB > 100 ? '⚠️  LARGE' : '✅ GOOD';
      console.log(`  ${status} ${file.name}: ${file.sizeKB} KB`);
    });
    
    // Analyze images
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    let totalImageSize = 0;
    let imageCount = 0;
    
    function scanDirectory(dir) {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else if (imageExtensions.some(ext => item.toLowerCase().endsWith(ext))) {
          totalImageSize += stats.size;
          imageCount++;
        }
      });
    }
    
    scanDirectory(distPath);
    
    console.log('\n🖼️  Image Analysis:');
    console.log(`  📊 Total Images: ${imageCount}`);
    console.log(`  📏 Total Size: ${Math.round(totalImageSize / 1024 / 1024 * 100) / 100} MB`);
    
    if (totalImageSize > 10 * 1024 * 1024) { // 10MB
      console.log('  ⚠️  IMAGES TOO LARGE - Consider WebP conversion and compression');
    } else {
      console.log('  ✅ Image sizes are reasonable');
    }
    
    // Performance recommendations
    console.log('\n🚀 Performance Recommendations:');
    console.log('================================');
    
    const largeJSFiles = jsFiles.filter(file => file.sizeMB > 1);
    if (largeJSFiles.length > 0) {
      console.log('\n📦 JavaScript Optimization:');
      console.log('  • Large bundles detected - consider code splitting');
      console.log('  • Use dynamic imports for non-critical components');
      console.log('  • Implement tree shaking to remove unused code');
    }
    
    const largeCSSFiles = cssFiles.filter(file => file.sizeKB > 100);
    if (largeCSSFiles.length > 0) {
      console.log('\n🎨 CSS Optimization:');
      console.log('  • Large CSS files detected - consider purging unused styles');
      console.log('  • Implement critical CSS inlining');
      console.log('  • Use CSS modules or styled-components for better tree shaking');
    }
    
    if (totalImageSize > 10 * 1024 * 1024) {
      console.log('\n🖼️  Image Optimization:');
      console.log('  • Convert PNG/JPG to WebP format');
      console.log('  • Implement responsive images with srcset');
      console.log('  • Use lazy loading for offscreen images');
      console.log('  • Consider using a CDN for image delivery');
    }
    
    console.log('\n🔧 General Optimizations:');
    console.log('  • Enable gzip/brotli compression on your server');
    console.log('  • Implement proper caching headers (already done in netlify.toml)');
    console.log('  • Use a CDN for global asset delivery');
    console.log('  • Monitor Core Web Vitals with PerformanceMonitor component');
    
    console.log('\n✅ Performance audit complete!');
    
  } catch (error) {
    console.error('❌ Error during performance audit:', error.message);
    console.log('\n💡 Make sure to run "npm run build" first to generate the dist folder.');
  }
}

// Run the audit
analyzeBuildOutput();
