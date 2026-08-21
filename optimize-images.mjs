import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'assets/templates';
const files = fs.readdirSync(dir);

async function optimizeImages() {
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const inputPath = path.join(dir, file);
      // We will save it as .webp
      const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/, '.webp'));
      
      try {
        await sharp(inputPath)
          .resize({ width: 1080, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        console.log(`Optimized ${file} to WebP`);
        // We will not delete the original yet, wait to update the code first.
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

optimizeImages();
