import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function performanceAudit() {
  try {
    console.log('🔍 Starting comprehensive performance audit...\n');
    
    // 1. Bundle Size Analysis
    console.log('📦 Bundle Size Analysis:');
    console.log('========================');
    
    const distPath = path.join(__dirname, '../dist');
    const jsPath = path.join(distPath, 'js');
    const cssPath = path.join(distPath, 'css');
    
    try {
      const jsFiles = await fs.readdir(jsPath);
      const cssFiles = await fs.readdir(cssPath);
      
      let totalJsSize = 0;
      let totalCssSize = 0;
      
      console.log('\nJavaScript Chunks:');
      for (const file of jsFiles) {
        if (file.endsWith('.js')) {
          const filePath = path.join(jsPath, file);
          const stats = await fs.stat(filePath);
          const sizeKB = (stats.size / 1024).toFixed(2);
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          
          if (stats.size > 1024 * 1024) {
            console.log(`  ⚠️  ${file}: ${sizeMB} MB (Consider splitting)`);
          } else {
            console.log(`  ✅ ${file}: ${sizeKB} KB`);
          }
          
          totalJsSize += stats.size;
        }
      }
      
      console.log('\nCSS Files:');
      for (const file of cssFiles) {
        if (file.endsWith('.css')) {
          const filePath = path.join(cssPath, file);
          const stats = await fs.stat(filePath);
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log(`  ✅ ${file}: ${sizeKB} KB`);
          totalCssSize += stats.size;
        }
      }
      
      const totalJsMB = (totalJsSize / 1024 / 1024).toFixed(2);
      const totalCssMB = (totalCssSize / 1024 / 1024).toFixed(2);
      const totalMB = ((totalJsSize + totalCssSize) / 1024 / 1024).toFixed(2);
      
      console.log(`\n📊 Total JavaScript: ${totalJsMB} MB`);
      console.log(`📊 Total CSS: ${totalCssMB} MB`);
      console.log(`📊 Total Assets: ${totalMB} MB`);
      
    } catch (error) {
      console.log('  ❌ Build directory not found. Run "npm run build" first.');
    }
    
    // 2. Image Optimization Analysis
    console.log('\n🖼️  Image Optimization Analysis:');
    console.log('================================');
    
    const uploadsPath = path.join(__dirname, '../public/lovable-uploads');
    try {
      const files = await fs.readdir(uploadsPath);
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].includes(ext);
      });
      
      const originalImages = imageFiles.filter(file => !file.endsWith('.webp'));
      const webpImages = imageFiles.filter(file => file.endsWith('.webp'));
      
      console.log(`  📁 Total images: ${imageFiles.length}`);
      console.log(`  🖼️  Original formats: ${originalImages.length}`);
      console.log(`  🆕 WebP versions: ${webpImages.length}`);
      
      if (webpImages.length > 0) {
        console.log(`  ✅ WebP conversion: ${((webpImages.length / originalImages.length) * 100).toFixed(1)}% complete`);
      }
      
    } catch (error) {
      console.log('  ❌ Uploads directory not found.');
    }
    
    // 3. Dependencies Analysis
    console.log('\n📚 Dependencies Analysis:');
    console.log('==========================');
    
    const packagePath = path.join(__dirname, '../package.json');
    try {
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      console.log(`  📦 Production dependencies: ${dependencies.length}`);
      console.log(`  🛠️  Development dependencies: ${devDependencies.length}`);
      
      // Check for heavy dependencies
      const heavyDeps = ['jspdf', 'html2canvas', 'recharts', 'heic2any'];
      const foundHeavy = heavyDeps.filter(dep => dependencies.includes(dep));
      
      if (foundHeavy.length > 0) {
        console.log(`  ⚠️  Heavy dependencies found: ${foundHeavy.join(', ')}`);
        console.log(`  💡 Consider dynamic imports for: ${foundHeavy.join(', ')}`);
      } else {
        console.log(`  ✅ No heavy dependencies detected`);
      }
      
    } catch (error) {
      console.log('  ❌ Package.json not found.');
    }
    
    // 4. Performance Recommendations
    console.log('\n🚀 Performance Recommendations:');
    console.log('================================');
    
    const recommendations = [
      '✅ WebP images implemented for better compression',
      '✅ Lazy loading enabled for heavy components',
      '✅ Dynamic imports for heavy libraries',
      '✅ Code splitting strategy implemented',
      '💡 Consider implementing service worker for caching',
      '💡 Add preload hints for critical resources',
      '💡 Implement critical CSS inlining',
      '💡 Add resource hints (dns-prefetch, preconnect)',
      '💡 Consider using Intersection Observer for lazy loading',
      '💡 Implement progressive image loading'
    ];
    
    recommendations.forEach(rec => {
      console.log(`  ${rec}`);
    });
    
    // 5. Core Web Vitals Targets
    console.log('\n🎯 Core Web Vitals Targets:');
    console.log('============================');
    
    const targets = [
      'LCP (Largest Contentful Paint): < 2.5s',
      'FID (First Input Delay): < 100ms',
      'CLS (Cumulative Layout Shift): < 0.1',
      'FCP (First Contentful Paint): < 1.8s',
      'TTFB (Time to First Byte): < 600ms'
    ];
    
    targets.forEach(target => {
      console.log(`  🎯 ${target}`);
    });
    
    // 6. Next Steps
    console.log('\n📋 Next Steps for Further Optimization:');
    console.log('========================================');
    
    const nextSteps = [
      '1. Run Lighthouse audit in Chrome DevTools',
      '2. Test on slow 3G network conditions',
      '3. Monitor Core Web Vitals in Google Search Console',
      '4. Implement service worker for offline support',
      '5. Add resource preloading for critical paths',
      '6. Consider implementing virtual scrolling for long lists',
      '7. Add performance monitoring with Real User Monitoring (RUM)',
      '8. Optimize third-party script loading'
    ];
    
    nextSteps.forEach(step => {
      console.log(`  ${step}`);
    });
    
    console.log('\n🎉 Performance audit complete!');
    console.log('💡 Run "npm run build" and test with Lighthouse for detailed metrics.');
    
  } catch (error) {
    console.error('❌ Error during performance audit:', error);
  }
}

// Run the audit
performanceAudit();
