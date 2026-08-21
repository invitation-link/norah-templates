const host = 'www.invitelink.shop';
const key = 'ed2c1c4dbf334dc2865d54075e00f4b1';
const baseUrl = `https://${host}`;
const paths = ['', '/templates', '/pricing', '/faq', '/about', '/contact'];

const payload = {
  host,
  key,
  keyLocation: `${baseUrl}/indexnow-key.txt`,
  urlList: paths.map((path) => `${baseUrl}${path}`),
};

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (!response.ok) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
console.log(`IndexNow accepted ${payload.urlList.length} canonical URLs (${response.status}).`);
