import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'index.html',
  'create.html',
  'builder.css',
  'builder.js',
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
  'favicon.svg',
  'favicon.ico',
  'invite.html',
  'invite.css',
  'invite.js',
  'robots.txt',
  'sitemap.xml',
  'sitemap-pages.xml',
  'sitemap-templates.xml',
  'indexnow-key.txt',
  'vercel.json'
];
const errors = [];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) errors.push(`Missing required file: ${file}`);
}

function read(file) {
  return readFileSync(join(root, file), 'utf8');
}

function checkJavaScript(file) {
  const result = spawnSync(process.execPath, ['--check', join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) errors.push(`${file} has invalid JavaScript:\n${result.stderr.trim()}`);
}

function checkJson(file) {
  try {
    JSON.parse(read(file));
  } catch (error) {
    errors.push(`${file} has invalid JSON: ${error.message}`);
  }
}

function checkStructuredData(file) {
  for (const match of read(file).matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file} has invalid JSON-LD: ${error.message}`);
    }
  }
}

function htmlIds(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
}

function referencedIds(js) {
  return new Set([...js.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g)].map((match) => match[1]));
}

function checkDomContract(jsFile, htmlFile) {
  const ids = htmlIds(read(htmlFile));
  for (const id of referencedIds(read(jsFile))) {
    if (!ids.has(id)) errors.push(`${jsFile} references #${id}, but ${htmlFile} does not define it.`);
  }
}

function checkLocalAssets() {
  const sourceFiles = ['index.html', 'create.html', 'builder.css', 'builder.js', 'templates.html', 'templates.css', 'templates.js', 'templates-data.js', 'invite.html', 'invite.css', 'invite.js'];
  const assetPattern = /["'(]\/((?:assets)\/[^"')?\s]+)/g;

  for (const sourceFile of sourceFiles) {
    for (const match of read(sourceFile).matchAll(assetPattern)) {
      const assetPath = match[1];
      if (!existsSync(join(root, assetPath))) errors.push(`${sourceFile} references missing local asset: /${assetPath}`);
    }
  }
}

function checkMessagingOrigins() {
  for (const file of ['builder.js', 'invite.js']) {
    if (/postMessage\([\s\S]*?,\s*["']\*["']\s*\)/.test(read(file))) {
      errors.push(`${file} uses a wildcard postMessage target origin.`);
    }
  }
}

async function checkExternalAssets() {
  const source = `${read('builder.js')}\n${read('templates-data.js')}\n${read('templates.css')}`;
  const urls = [...new Set([...source.matchAll(/https:\/\/[^"'`\s]+/g)].map((match) => match[0]))]
    .filter((url) => url.includes('images.unsplash.com') || url.includes('soundhelix.com'));

  for (let index = 0; index < urls.length; index += 5) {
    const batch = urls.slice(index, index + 5);
    const results = await Promise.all(batch.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
        return response.ok ? null : `${response.status} ${url}`;
      } catch (error) {
        return `${error.name}: ${url}`;
      }
    }));
    errors.push(...results.filter(Boolean).map((result) => `Unavailable external asset: ${result}`));
  }
}

async function checkExternalModules() {
  const urls = [...new Set([...read('templates.html').matchAll(/https:\/\/esm\.sh\/[^"'\s]+/g)].map((match) => match[0]))];
  const results = await Promise.all(urls.map(async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
      return response.ok ? null : `${response.status} ${url}`;
    } catch (error) {
      return `${error.name}: ${url}`;
    }
  }));
  errors.push(...results.filter(Boolean).map((result) => `Unavailable portal module: ${result}`));
}

checkJavaScript('builder.js');
checkJavaScript('invite.js');
checkJavaScript('templates.js');
checkJavaScript('templates-data.js');
checkJson('vercel.json');
checkStructuredData('index.html');
checkDomContract('builder.js', 'create.html');
checkDomContract('invite.js', 'invite.html');
checkDomContract('templates.js', 'templates.html');
checkLocalAssets();
checkMessagingOrigins();

if (!read('create.html').includes('id="templateTheme"')) {
  errors.push('The occasion selector #templateTheme is missing from create.html.');
}

const occasionCount = (read('create.html').match(/<option value=/g) || []).length;
if (occasionCount < 8) errors.push(`Expected at least 8 occasion options, found ${occasionCount}.`);

if (!read('vercel.json').includes('"source": "/templates"')) {
  errors.push('The /templates route is missing from vercel.json.');
}

if (!read('vercel.json').includes('"source": "/create"')) {
  errors.push('The /create route is missing from vercel.json.');
}

if (!read('index.html').includes('Interactive Invitation Links for Every Occasion')) {
  errors.push('The homepage is missing its search-intent title.');
}

if (!read('index.html').includes("Don't Just Send an Invitation.<br>Make Them Feel Invited.")) {
  errors.push('Yesterday\'s homepage hero is missing or changed.');
}

if (!read('robots.txt').includes('User-agent: OAI-SearchBot')) {
  errors.push('robots.txt does not explicitly allow OAI-SearchBot.');
}

if (!read('sitemap.xml').includes('sitemap-pages.xml') || !read('sitemap.xml').includes('sitemap-templates.xml')) {
  errors.push('The sitemap index does not reference both split sitemaps.');
}

if (!read('create.html').includes('name="robots" content="noindex, follow"')) {
  errors.push('The invitation builder must remain noindex.');
}

if (!read('invite.js').includes("params.get('demo')")) {
  errors.push('The invitation renderer does not expose live demo mode.');
}

if (!read('templates.js').includes("from 'motion/react'")) {
  errors.push('The template portal is not using Motion for React.');
}

function checkAnalytics() {
  const htmlFiles = [
    'index.html', 'create.html', 'invite.html', 'templates.html', 'pricing.html',
    'faq.html', 'about.html', 'contact.html', 'terms.html',
    'privacy.html', 'refund.html'
  ];
  for (const file of htmlFiles) {
    const content = read(file);
    if (!content.includes('G-81CCB5ZMLX')) errors.push(`${file} is missing Google Analytics 4 (G-81CCB5ZMLX).`);
    if (!content.includes('wzp3yr2x2l')) errors.push(`${file} is missing Microsoft Clarity (wzp3yr2x2l).`);
  }
}

checkAnalytics();

if (process.argv.includes('--external')) {
  await checkExternalAssets();
  await checkExternalModules();
}

if (errors.length > 0) {
  console.error(`Verification failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Verification passed${process.argv.includes('--external') ? ', including external assets' : ''}.`);
