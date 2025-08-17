import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '../public/lovable-uploads');
const WEBP_QUALITY = 85; // Good balance between quality and file size

async function convertImagesToWebP() {
  try {
    console.log('🖼️  Starting image conversion to WebP...');
    
    // Get all files in the uploads directory
    const files = await fs.readdir(UPLOADS_DIR);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext);
    });
    
    console.log(`📁 Found ${imageFiles.length} image files to convert`);
    
    let totalOriginalSize = 0;
    let totalWebPSize = 0;
    let convertedCount = 0;
    
    for (const file of imageFiles) {
      const filePath = path.join(UPLOADS_DIR, file);
      const fileStats = await fs.stat(filePath);
      const originalSize = fileStats.size;
      totalOriginalSize += originalSize;
      
      // Create WebP filename
      const nameWithoutExt = path.parse(file).name;
      const webpPath = path.join(UPLOADS_DIR, `${nameWithoutExt}.webp`);
      
      try {
        // Convert to WebP
        await sharp(filePath)
          .webp({ quality: WEBP_QUALITY })
          .toFile(webpPath);
        
        // Get WebP file size
        const webpStats = await fs.stat(webpPath);
        const webpSize = webpStats.size;
        totalWebPSize += webpSize;
        
        // Calculate savings
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${file} → ${nameWithoutExt}.webp`);
        console.log(`   📊 ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(webpSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
        
        convertedCount++;
        
        // Optionally remove original file (uncomment if you want to replace originals)
        // await fs.unlink(filePath);
        
      } catch (error) {
        console.error(`❌ Failed to convert ${file}:`, error.message);
      }
    }
    
    // Summary
    console.log('\n🎉 Conversion Complete!');
    console.log(`📈 Converted ${convertedCount}/${imageFiles.length} images`);
    console.log(`💾 Total size reduction: ${((totalOriginalSize - totalWebPSize) / 1024 / 1024).toFixed(2)}MB`);
    console.log(`📊 Average savings: ${((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1)}%`);
    
    // Create a manifest file for reference
    const manifest = {
      convertedAt: new Date().toISOString(),
      totalImages: imageFiles.length,
      convertedCount,
      originalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
      webpSizeMB: (totalWebPSize / 1024 / 1024).toFixed(2),
      savingsMB: ((totalOriginalSize - totalWebPSize) / 1024 / 1024).toFixed(2),
      savingsPercent: ((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1)
    };
    
    await fs.writeFile(
      path.join(UPLOADS_DIR, 'webp-conversion-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('📝 Manifest saved to webp-conversion-manifest.json');
    
  } catch (error) {
    console.error('❌ Error during conversion:', error);
    process.exit(1);
  }
}

// Run the conversion
convertImagesToWebP();
