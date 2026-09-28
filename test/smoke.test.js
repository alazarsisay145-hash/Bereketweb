#!/usr/bin/env node
/* Smoke test for the Bereket Juice & Salad static site. */
'use strict';

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

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

console.log('\nBereket Juice & Salad — smoke test\n');

/* --- core files exist --- */
console.log('Files:');
['index.html', 'css/styles.css', 'js/main.js', 'assets/logo.svg', 'assets/favicon.svg', 'assets/hero-drinks.svg']
  .forEach((f) => check(`${f} exists`, fs.existsSync(path.join(root, f))));

const html = read('index.html');
const css = read('css/styles.css');
const js = read('js/main.js');

/* --- HTML structure --- */
console.log('\nHTML:');
check('declares lang attribute', /<html lang="en">/.test(html));
check('has viewport meta', /name="viewport"/.test(html));
check('has meta description', /name="description"/.test(html));
check('has Schema.org Restaurant data', /"@type":\s*"Restaurant"/.test(html));
check('mentions Hawassa', /Hawassa/.test(html));
['signature', 'menu', 'place', 'contact', 'menuGrid', 'cartDrawer', 'productModal']
  .forEach((id) => check(`has #${id}`, new RegExp(`id="${id}"`).test(html)));
check('links stylesheet', /href="css\/styles\.css"/.test(html));
check('links main script', /src="js\/main\.js"/.test(html));
check('guest house is a small coming-soon strip (no email form)', /coming soon/i.test(html) && !/notify/i.test(html));

/* --- light theme --- */
console.log('\nTheme:');
check('uses a light background', /--bg:\s*#f/i.test(css));
check('no dark legacy backgrounds (#17110d/#110d09/#0b0806)', !/#17110d|#110d09|#0b0806/i.test(css));
check('uses glassmorphism (backdrop-filter)', /backdrop-filter:\s*blur/.test(css));
check('supports reduced motion', /prefers-reduced-motion/.test(css));
check('is responsive (media queries)', /@media\s*\(max-width/.test(css));

/* --- menu data & product images --- */
console.log('\nMenu:');
const ids = [...js.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);
check(`has at least 18 products (found ${ids.length})`, ids.length >= 18);

const imgs = [...js.matchAll(/img:\s*'([^']+)'/g)].map((m) => m[1]);
check('every product declares an image', imgs.length === ids.length);
const missing = imgs.filter((rel) => !fs.existsSync(path.join(root, rel)));
check(`every product image exists on disk (missing: ${missing.length})`, missing.length === 0);
check('each product has a unique image', new Set(imgs).size === imgs.length);

const categories = new Set([...js.matchAll(/category:\s*'([a-z]+)'/g)].map((m) => m[1]));
['juices', 'smoothies', 'shakes', 'burgers', 'salads', 'combos']
  .forEach((c) => check(`category "${c}" present`, categories.has(c)));

/* --- WhatsApp ordering --- */
console.log('\nOrdering:');
check('checkout builds a WhatsApp link (wa.me)', /wa\.me/.test(js));
check('order message includes items and total', /I'd like to order/.test(js) && /Total: /.test(js));
check('order message asks for name and pickup time', /Name: /.test(js) && /Pickup time: /.test(js));
check('cart persists via localStorage', /localStorage/.test(js));

console.log('');
if (failures) {
  console.error(`${failures} check(s) failed.\n`);
  process.exit(1);
}
console.log('All checks passed ✔\n');
