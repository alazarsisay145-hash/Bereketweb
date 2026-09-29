#!/usr/bin/env node
/* Smoke test for the Habesha Haven static site (no dependencies). */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let failures = 0;

function check(label, ok) {
  if (ok) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${label}`);
  }
}

const exists = (rel) => fs.existsSync(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const SITE_URL = 'https://alazarsisay145-hash.github.io/Bereketweb/';

console.log('\nHabesha Haven — smoke test\n');

/* --- files --- */
console.log('Files:');
[
  'index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'README.md', '.gitignore',
  'assets/css/styles.css', 'assets/js/main.js', 'assets/img/favicon.svg', 'assets/img/favicon-32.png',
  'assets/img/apple-touch-icon.png', 'assets/img/icon-192.png', 'assets/img/icon-512.png',
  '.github/workflows/deploy.yml'
].forEach((f) => check(`${f} exists`, exists(f)));

const html = read('index.html');
const css = read('assets/css/styles.css');
const js = read('assets/js/main.js');

/* --- structure --- */
console.log('\nStructure:');
check('no inline <style> block', !/<style[\s>]/i.test(html));
check('links assets/css/styles.css', /<link rel="stylesheet" href="assets\/css\/styles\.css"/.test(html));
check('loads assets/js/main.js with defer', /<script src="assets\/js\/main\.js" defer><\/script>/.test(html));
check('no inline event handlers (on*=) in HTML', !/\son[a-z]+\s*=/i.test(html));
check('no inline event handlers in generated JS markup', !/on(click|input|change|submit)=/i.test(js));
check('no inline style attributes', !/\sstyle=/i.test(html));
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script\s*>/gi)].map((m) => m[1]);
const cspHashes = inlineScripts.map((code) => `'sha256-${crypto.createHash('sha256').update(code).digest('base64')}'`);
check('every inline script is allowed by the CSP hash', cspHashes.every((hash) => html.includes(hash)));

/* --- production copy --- */
console.log('\nProduction copy:');
[['index.html', html], ['assets/js/main.js', js], ['assets/css/styles.css', css], ['404.html', read('404.html')]]
  .forEach(([name, text]) => check(`no demo badge/notes in ${name}`, !/demo/i.test(text)));

/* --- SEO & metadata --- */
console.log('\nSEO:');
check('declares lang attribute', /<html lang="en">/.test(html));
check('has viewport meta', /name="viewport"/.test(html));
check('has meta description', /name="description"/.test(html));
check('has robots meta', /name="robots" content="index, follow"/.test(html));
check('has canonical URL', html.includes(`<link rel="canonical" href="${SITE_URL}"`));
['og:title', 'og:description', 'og:image', 'og:url', 'og:type'].forEach((p) =>
  check(`has Open Graph ${p}`, new RegExp(`property="${p}"`).test(html)));
check('has Twitter card', /name="twitter:card" content="summary_large_image"/.test(html));
check('has favicon', /rel="icon" href="assets\/img\/favicon\.svg"/.test(html));
check('has apple-touch-icon', /rel="apple-touch-icon" href="assets\/img\/apple-touch-icon\.png"/.test(html));
check('links web app manifest', /rel="manifest" href="site\.webmanifest"/.test(html));

const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let graph = [];
try {
  graph = JSON.parse(ldMatch[1])['@graph'] || [];
} catch (error) {
  graph = [];
}
['Hotel', 'Restaurant'].forEach((type) => {
  const node = graph.find((n) => n['@type'] === type);
  check(`JSON-LD ${type} present`, Boolean(node));
  check(`JSON-LD ${type} has name, address, telephone and opening hours`,
    Boolean(node && node.name && node.address && node.telephone && node.openingHoursSpecification));
});

const manifest = JSON.parse(read('site.webmanifest'));
check('manifest has name and icons', Boolean(manifest.name && manifest.icons && manifest.icons.length));
check('manifest icons exist', manifest.icons.every((icon) => exists(icon.src)));
check('robots.txt references sitemap', read('robots.txt').includes(`${SITE_URL}sitemap.xml`));
check('sitemap lists the home page', read('sitemap.xml').includes(`<loc>${SITE_URL}</loc>`));
check('404 page is noindex', /name="robots" content="noindex"/.test(read('404.html')));

/* --- accessibility --- */
console.log('\nAccessibility:');
check('has skip link to #main', /class="skip-link" href="#main"/.test(html));
['<header', '<nav', '<main', '<footer'].forEach((tag) => check(`has ${tag}> landmark`, html.includes(tag)));
check('exactly one <h1>', (html.match(/<h1[\s>]/g) || []).length === 1);
check('no <h4> heading-level skips', !/<h4[\s>]/.test(html));
const imgs = [...html.matchAll(/<img\b[\s\S]*?\/>/g)].map((m) => m[0]);
check(`found images (${imgs.length})`, imgs.length > 0);
check('every image has an alt attribute', imgs.every((img) => /\salt="[^"]*"/.test(img)));
check('every image has width/height', imgs.every((img) => /\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img)));
check('every image is lazy + async decoded', imgs.every((img) => /loading="lazy"/.test(img) && /decoding="async"/.test(img)));
check('menu toggle has aria-expanded + aria-controls',
  /id="menuToggle"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="mobileMenu"/.test(html));
check('cart button has aria-expanded + aria-controls',
  /id="cartButton"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="cartPanel"/.test(html));
check('language button has aria-label', /id="languageBtn"[\s\S]*?aria-label="[^"]+"/.test(html));
check('cart drawer is a modal dialog', /id="cartPanel"[\s\S]*?role="dialog"[\s\S]*?aria-modal="true"/.test(html));
check('modal is a labelled dialog', /role="dialog"\s+aria-modal="true"\s+aria-labelledby="modalTitle"/.test(html));
check('JS traps focus and handles Escape', /function trapFocus/.test(js) && /'Escape'/.test(js));

['name', 'email', 'phone', 'guests', 'checkin', 'checkout'].forEach((id) => {
  check(`#${id} is described by #${id}-error`,
    new RegExp(`id="${id}"[^>]*?aria-describedby="${id}-error"`, 's').test(html) &&
    html.includes(`id="${id}-error"`));
});
check('booking result is a status region', /id="bookingResult"[\s\S]*?role="status"/.test(html));
check('CSS has :focus-visible styles', /:focus-visible/.test(css));
check('CSS respects prefers-reduced-motion', /prefers-reduced-motion: reduce/.test(css));
check('smooth scrolling only without reduced-motion preference',
  /prefers-reduced-motion: no-preference\)\s*\{\s*html\s*\{\s*scroll-behavior: smooth/.test(css));
check('floating card animation disabled for reduced motion',
  /prefers-reduced-motion: reduce\)\s*\{\s*\.floating-card\s*\{\s*animation: none/.test(css));

/* --- design system --- */
console.log('\nDesign system:');
['--green', '--green-dark', '--cream', '--radius', '--shadow', '--transition'].forEach((v) =>
  check(`CSS custom property ${v} defined`, new RegExp(`${v}:`).test(css)));
check('uses glassmorphism (backdrop-filter)', /backdrop-filter:\s*blur/.test(css));
check('is responsive (media queries)', /@media \(max-width: 700px\)/.test(css));

/* --- progressive enhancement --- */
console.log('\nProgressive enhancement:');
const menuItems = (html.match(/class="menu-item glass"/g) || []).length;
check(`menu items are in the HTML (found ${menuItems})`, menuItems >= 12);
check('reveal animation only hides content when JS runs', /\.js \.reveal \{/.test(css) && !/^\.reveal \{/m.test(css));
check('JS-only controls are hidden without JS', /html:not\(\.js\) \[data-requires-js\]/.test(css));
check('booking form posts natively without JS', /<form[\s\S]*?action="https:\/\/[^"]+"[\s\S]*?method="POST"/.test(html));

/* --- functionality --- */
console.log('\nFunctionality:');
check('booking endpoint is a configurable constant', /bookingEndpoint:\s*'https:\/\//.test(js));
check('cart persists via localStorage', /localStorage/.test(js));
check('cart supports increase/decrease/remove', /'increase'/.test(js) && /'decrease'/.test(js) && /'remove'/.test(js));
check('menu search is debounced', /debounce\(/.test(js));
check('menu has empty state', /id="menuEmpty"/.test(html));
check('language switch updates <html lang>', /documentElement\.lang = language/.test(js));

const amStart = js.indexOf('am: {');
const amKeys = new Set([...js.slice(amStart).matchAll(/'([a-z0-9.]+)':/gi)].map((m) => m[1]));
const htmlKeys = new Set([
  ...[...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)]
    .flatMap((m) => m[1].split(';').map((pair) => pair.split(':')[1].trim()))
]);
const missingAm = [...htmlKeys].filter((key) => !amKeys.has(key));
check(`every data-i18n key has an Amharic translation (missing: ${missingAm.join(', ') || 'none'})`, missingAm.length === 0);

console.log('');
if (failures) {
  console.error(`${failures} check(s) failed.\n`);
  process.exit(1);
}
console.log('All checks passed ✔\n');
