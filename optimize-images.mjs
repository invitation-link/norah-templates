import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const directory = 'assets/templates';
const files = await readdir(directory);

for (const file of files) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const source = path.join(directory, file);
  const target = path.join(directory, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  await sharp(source)
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(target);
  console.log(`Optimized ${file} -> ${path.basename(target)}`);
}
