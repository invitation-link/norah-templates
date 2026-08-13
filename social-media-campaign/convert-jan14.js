// WebP Conversion for January 14, 2026 Content
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
    const sharp = require('sharp');
    const baseDir = './2026-01-14';

    const folders = [
        path.join(baseDir, 'instagram'),
        path.join(baseDir, 'whatsapp'),
        path.join(baseDir, 'stories')
    ];

    let converted = 0;

    for (const folder of folders) {
        if (!fs.existsSync(folder)) continue;

        const files = fs.readdirSync(folder).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const inputPath = path.join(folder, file);
            const outputPath = path.join(folder, file.replace('.png', '.webp'));

            try {
                await sharp(inputPath)
                    .webp({ quality: 85, effort: 6 })
                    .toFile(outputPath);

                console.log(`✓ ${file} -> ${file.replace('.png', '.webp')}`);
                converted++;
            } catch (err) {
                console.log(`✗ ${file}: ${err.message}`);
            }
        }
    }

    console.log(`\nConverted ${converted} files to WebP`);
}

convertToWebP().catch(console.error);
