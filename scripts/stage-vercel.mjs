import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const productionFiles = [
  'index.html',
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
  'robots.txt',
  'sitemap.xml',
  'vercel.json'
];

const stage = await mkdtemp(join(tmpdir(), 'invite-link-vercel-'));

for (const file of productionFiles) {
  await cp(join(root, file), join(stage, basename(file)));
}

await cp(join(root, 'assets'), join(stage, 'assets'), { recursive: true });

console.log(stage);
