// WebP Conversion Script for Social Media Campaign
// Converts all PNG images to WebP format

const fs = require('fs');
const path = require('path');

async function convertToWebP() {
    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.log('Sharp not installed. Installing...');
        const { execSync } = require('child_process');
        execSync('npm install sharp', { stdio: 'inherit' });
        sharp = require('sharp');
    }

    const baseDir = './2026-01-13';
    const assetsDir = './assets';

    const folders = [
        path.join(baseDir, 'instagram'),
        path.join(baseDir, 'whatsapp'),
        path.join(baseDir, 'stories'),
        path.join(assetsDir, 'logos')
    ];

    let converted = 0;
    let failed = 0;

    for (const folder of folders) {
        if (!fs.existsSync(folder)) {
            console.log(`Folder not found: ${folder}`);
            continue;
        }

        const files = fs.readdirSync(folder).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const inputPath = path.join(folder, file);
            const outputPath = path.join(folder, file.replace('.png', '.webp'));

            try {
                await sharp(inputPath)
                    .webp({ quality: 85, effort: 6 })
                    .toFile(outputPath);

                console.log(`✓ Converted: ${file} -> ${file.replace('.png', '.webp')}`);
                converted++;

                // Optionally delete the PNG after conversion
                // fs.unlinkSync(inputPath);
            } catch (err) {
                console.log(`✗ Failed: ${file} - ${err.message}`);
                failed++;
            }
        }
    }

    console.log('');
    console.log(`Conversion complete: ${converted} files converted, ${failed} failed`);
}

convertToWebP().catch(console.error);
