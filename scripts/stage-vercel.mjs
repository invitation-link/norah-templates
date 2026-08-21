import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const productionFiles = [
  'index.html',
  'create.html',
  'builder.css',
  'builder.js',
  'invite.html',
  'invite.css',
  'invite.js',
  'templates.html',
  'templates.css',
  'templates.js',
  'templates-data.js',
  'pricing.html',
  'faq.html',
  'about.html',
  'contact.html',
  'terms.html',
  'privacy.html',
  'refund.html',
  'manifest.json',
  'site.webmanifest',
  'favicon.svg',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'sitemap-pages.xml',
  'sitemap-templates.xml',
  'sitemap-guides.xml',
  'acquisition.css',
  'acquisition.js',
  'indexnow-key.txt',
  'vercel.json'
];

const productionDirectories = ['guides', 'templates'];

const stage = await mkdtemp(join(tmpdir(), 'invite-link-vercel-'));

for (const file of productionFiles) {
  await cp(join(root, file), join(stage, basename(file)));
}

await cp(join(root, 'assets'), join(stage, 'assets'), { recursive: true });
for (const directory of productionDirectories) {
  await cp(join(root, directory), join(stage, directory), { recursive: true });
}

console.log(stage);
