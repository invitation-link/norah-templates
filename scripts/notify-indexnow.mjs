import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const host = 'www.invitelink.shop';
const key = readFileSync(join(root, 'indexnow-key.txt'), 'utf8').trim();
const sitemapFiles = ['sitemap-pages.xml', 'sitemap-templates.xml', 'sitemap-guides.xml'];
const urls = sitemapFiles.flatMap((file) => {
  const xml = readFileSync(join(root, file), 'utf8');
  return [...xml.matchAll(/<loc>(https:\/\/www\.invitelink\.shop\/[^<]*)<\/loc>/g)].map((match) => match[1]);
});

const payload = {
  host,
  key,
  keyLocation: `https://${host}/indexnow-key.txt`,
  urlList: [...new Set(urls)]
};

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

if (!response.ok) {
  throw new Error(`IndexNow rejected the submission with HTTP ${response.status}: ${await response.text()}`);
}

console.log(`IndexNow accepted ${payload.urlList.length} canonical URLs.`);
