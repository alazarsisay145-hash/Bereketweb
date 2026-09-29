#!/usr/bin/env node
/* Smoke test for the Bereket Juice & Salad static site. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function listFiles(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'test') return [];
    return entry.isDirectory() ? listFiles(rel) : [rel];
  });
}

console.log('\nBereket Juice & Salad — smoke test\n');

/* --- core files exist --- */
console.log('Files:');
[
  'index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
  'assets/css/styles.css', 'assets/js/main.js',
  'assets/img/logo.png', 'assets/img/interior.jpg', 'assets/img/juices-salad.jpg',
  '.github/workflows/pages.yml'
].forEach((f) => check(`${f} exists`, fs.existsSync(path.join(root, f))));
check('assets/img/menu/ folder exists', fs.existsSync(path.join(root, 'assets/img/menu')));

const html = read('index.html');
const css = read('assets/css/styles.css');
const js = read('assets/js/main.js');

/* --- branding --- */
console.log('\nBranding:');
const textFiles = listFiles('.').filter((f) => /\.(html|css|js|json|md|txt|xml|webmanifest|yml)$/.test(f));
const corpus = textFiles.map(read).join('\n');
// Banned words are assembled from fragments so this test file doesn't match its own search.
const banned = (parts) => new RegExp(parts.join('|'), 'i');
check('no references to the old demo brand', !banned(['habe' + 'sha']).test(corpus));
check('no hospitality-demo references', !banned(['\\bho' + 'tels?\\b', '\\bro' + 'oms?\\b']).test(corpus));
check('no stock image URLs', !banned(['un' + 'splash', 'pex' + 'els', 'pix' + 'abay', 'shutter' + 'stock']).test(corpus));
check('title uses Bereket Juice & Salad', /<title>Bereket Juice &amp; Salad/.test(html));
check('nav logo uses assets/img/logo.png', /class="logo-mark" src="assets\/img\/logo\.png"/.test(html));
check('favicon + apple-touch-icon use the logo', /rel="icon"[^>]+logo\.png/.test(html) && /rel="apple-touch-icon" href="assets\/img\/logo\.png"/.test(html));
check('OG image uses the logo', /og:image" content="[^"]+assets\/img\/logo\.png/.test(html));
const manifest = JSON.parse(read('site.webmanifest'));
check('manifest icons use the logo', manifest.icons.some((i) => i.src === 'assets/img/logo.png'));
check('palette uses gold, green and mango', /--gold:\s*#f2b824/i.test(css) && /--green:\s*#6fbe44/i.test(css) && /--mango:/i.test(css));
check('dark base background', /--bg:\s*#0d0d0d/i.test(css));

/* --- HTML structure --- */
console.log('\nHTML:');
check('declares lang attribute', /<html lang="en">/.test(html));
check('has meta description', /name="description"/.test(html));
check('has skip link', /class="skip-link" href="#main"/.test(html));
['home', 'menu', 'space', 'why', 'contact', 'order', 'menuGrid', 'menuSearch', 'cartPanel', 'orderForm', 'formStatus']
  .forEach((id) => check(`has #${id}`, new RegExp(`id="${id}"`).test(html)));
check('links stylesheet', /href="assets\/css\/styles\.css"/.test(html));
check('links main script (deferred)', /src="assets\/js\/main\.js" defer/.test(html));
check('no inline event handlers', !/\son[a-z]+="/i.test(html));
['juices', 'smoothies', 'salads', 'combos', 'specials']
  .forEach((c) => check(`category filter "${c}"`, new RegExp(`data-category="${c}"`).test(html)));

const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
let ld = {};
try { ld = JSON.parse(ldMatch[1]); } catch (e) { /* reported below */ }
const ldTypes = [].concat(ld['@type'] || []);
check('JSON-LD is valid Restaurant/FoodEstablishment', ldTypes.includes('Restaurant') && ldTypes.includes('FoodEstablishment'));
check('JSON-LD serves juice, smoothies, salads', ld.servesCuisine === 'Juice, Smoothies, Salads');
check('JSON-LD has logo, email and opening hours', /logo\.png$/.test(ld.logo || '') && /alazarsisay145@gmail\.com/.test(ld.email || '') && Array.isArray(ld.openingHoursSpecification));

/* --- images --- */
console.log('\nImages:');
const imgTags = html.match(/<img\b[^>]*>/g) || [];
check('every <img> has width, height, alt and decoding="async"',
  imgTags.every((tag) => /\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag) && /\balt="/.test(tag) && /decoding="async"/.test(tag)));
const hero = imgTags.find((tag) => /hero-bg/.test(tag)) || '';
check('hero uses juices-salad.jpg, eager + fetchpriority high',
  /assets\/img\/juices-salad\.jpg/.test(hero) && /loading="eager"/.test(hero) && /fetchpriority="high"/.test(hero));
check('all other images are lazy', imgTags.filter((tag) => tag !== hero).every((tag) => /loading="lazy"/.test(tag)));
check('interior photo used in Our Space', /space-image[\s\S]*?assets\/img\/interior\.jpg/.test(html));

/* --- menu data --- */
console.log('\nMenu:');
const sandbox = {};
vm.runInNewContext(js.split('(function () {')[0] + '\nthis.MENU_ITEMS = MENU_ITEMS; this.FORMSPREE_ENDPOINT = FORMSPREE_ENDPOINT;', sandbox);
const items = sandbox.MENU_ITEMS || [];
check(`MENU_ITEMS is an array with items (found ${items.length})`, Array.isArray(items) && items.length >= 4);
check('every item has id, name, description, price, category, image',
  items.every((i) => ['id', 'name', 'description', 'price', 'category', 'image'].every((k) => k in i)));
check('ids are unique', new Set(items.map((i) => i.id)).size === items.length);
check('prices are positive numbers', items.every((i) => typeof i.price === 'number' && i.price > 0));
check('categories are valid', items.every((i) => ['juices', 'smoothies', 'salads', 'combos', 'specials'].includes(i.category)));
check('item images are empty or exist under assets/img/menu/',
  items.every((i) => i.image === '' || (i.image.startsWith('assets/img/menu/') && fs.existsSync(path.join(root, i.image)))));
['Avocado Juice', 'Mango Juice', 'Layered Mixed Juice', 'Fresh Fruit Salad']
  .forEach((n) => check(`seeded with "${n}"`, items.some((i) => i.name === n)));
check('branded placeholder tile for items without a photo', /menu-placeholder/.test(js) && /menu-placeholder/.test(css));
check('search is debounced', /debounce\(renderMenu/.test(js));

/* --- ordering / form --- */
console.log('\nOrdering & form:');
check('cart persists via localStorage', /localStorage/.test(js));
check('Formspree endpoint constant', sandbox.FORMSPREE_ENDPOINT === 'https://formspree.io/f/YOUR_FORM_ID');
check('form submits via fetch with Accept: application/json', /fetch\(FORMSPREE_ENDPOINT/.test(js) && /Accept: "application\/json"/.test(js));
check('form has _subject, _replyto and _gotcha fields', /name="_subject"/.test(html) && /name="_replyto"/.test(html) && /name="_gotcha"/.test(html));
['name', 'email', 'phone', 'orderType', 'message'].forEach((id) => check(`form field #${id}`, new RegExp(`id="${id}"`).test(html)));
check('order types dine-in / takeaway / delivery', /value="Dine-in"/.test(html) && /value="Takeaway"/.test(html) && /value="Delivery"/.test(html));
check('form status uses role="status"', /id="formStatus" role="status"/.test(html));
check('email is obfuscated (built at runtime)', !/alazarsisay145@gmail\.com/.test(html.replace(ldMatch ? ldMatch[0] : '', '')) && /"mailto:"/.test(js));

/* --- a11y & i18n --- */
console.log('\nAccessibility & language:');
check('EN / Amharic translations', /\bam:\s*{/.test(js) && /\ben:\s*{/.test(js));
check('cart dialog has focus trap', /aria-modal="true"/.test(html) && /event\.key === "Tab"/.test(js));
check('supports reduced motion', /prefers-reduced-motion/.test(css));
check('is responsive (media queries)', /@media\s*\(max-width/.test(css));

console.log('');
if (failures) {
  console.error(`${failures} check(s) failed.\n`);
  process.exit(1);
}
console.log('All checks passed ✔\n');
