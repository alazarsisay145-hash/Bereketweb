# Bereket Juice & Salad 🍹

Official website for **Bereket Juice & Salad** — *JUICE & SALAD*: fresh juices, smoothies and
fruit salads made to order in **Hawassa, Sidama, Ethiopia**.

Plain HTML + CSS + vanilla JS (no build step), deployed to GitHub Pages.

## Features

- Black / gold / green / mango theme taken from the logo, with glass-style rounded cards (WCAG AA contrast)
- Real brand imagery: logo, shop interior and signature juices & fruit salad
- Menu with category filter (Juices, Smoothies, Salads, Combos, Specials) and debounced search
- Order cart saved in `localStorage`; "Continue to order form" copies the order into the enquiry form
- Contact / Order enquiry form (dine-in / takeaway / delivery) sent through **Formspree** without leaving the page
- EN / አማርኛ language toggle
- Accessibility: skip link, ARIA labels, focus-trapped cart dialog, keyboard support, `prefers-reduced-motion`
- SEO: meta + Open Graph/Twitter tags, `Restaurant` JSON-LD, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `404.html`

## Running locally

```bash
npm start        # serves the folder with `serve`
npm test         # smoke test (files, branding, images, menu data, form, a11y)
```

## Adding menu items and photos

The whole menu is the `MENU_ITEMS` array at the top of [`assets/js/main.js`](assets/js/main.js).

1. Drop the photo in **`assets/img/menu/`** (e.g. `assets/img/menu/papaya-juice.jpg`).
   A 4:3 landscape photo about 800 px wide works best — keep it under ~150 KB.
2. Append one object to `MENU_ITEMS`:

   ```js
   {
     id: "papaya-juice",                 // unique, lowercase, no spaces
     name: "Papaya Juice",
     description: "Fresh papaya with a squeeze of lime.",
     price: 120,                         // ETB, numbers only
     category: "juices",                 // juices | smoothies | salads | combos | specials
     image: "assets/img/menu/papaya-juice.jpg"
   },
   ```

That's all — the item appears in the menu, the filters, search and cart automatically.
Leave `image: ""` if there is no photo yet and a branded Bereket placeholder tile is shown.
The four seeded items (Avocado Juice, Mango Juice, Layered Mixed Juice, Fresh Fruit Salad) use
placeholder prices — update them with the real prices.

## Formspree (contact / order form)

Enquiries are delivered to **alazarsisay145@gmail.com** through [Formspree](https://formspree.io):

1. Sign in to formspree.io with **alazarsisay145@gmail.com** and create a new form.
2. Copy its endpoint (e.g. `https://formspree.io/f/abcdwxyz`).
3. Replace the placeholder in `assets/js/main.js`:

   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```

   and the same placeholder in the form's `action` attribute in `index.html` (used only if
   JavaScript is disabled).
4. Submit the form once from the live site and confirm the verification email Formspree sends,
   otherwise messages won't be delivered. (Free tier: 50 submissions/month.)

The form already includes a `_subject`, a `_replyto` (filled from the customer's email) and a
`_gotcha` honeypot for spam. Until the real ID is set, the form politely asks visitors to call or email.

## Brand images

| File | Used for |
| --- | --- |
| `assets/img/logo.png` | Nav + footer logo, favicon, apple-touch-icon, manifest icon, social share image |
| `assets/img/juices-salad.jpg` | Hero background (1600×1000) |
| `assets/img/interior.jpg` | "Our Space" section (1200×900) |
| `assets/img/menu/*` | Menu item photos |

> **Note:** the original photos attached to the rebrand request could not be downloaded by the build
> agent, so the committed `logo.png`, `juices-salad.jpg` and `interior.jpg` are brand-coloured stand-ins.
> Overwrite them with the original photos (same file names) and they will be used everywhere automatically.

To update an image, overwrite the file with the same name — no code changes needed
(photos are cropped with `object-fit: cover`, so other aspect ratios are fine).

## Before go-live checklist

- [ ] Real phone number in the Contact section, footer and JSON-LD of `index.html` (currently `+251 900 000 000`)
- [ ] Confirm opening hours (Contact, footer, JSON-LD and the `contact.hoursValue` translations in `main.js`)
- [ ] Replace the map placeholder in the Contact section with a Google Maps embed of the exact location
- [ ] Swap in the Formspree form ID (see above)
- [ ] Add real menu items, prices and photos

## Deployment

`.github/workflows/pages.yml` runs `npm test` on every push/PR and deploys the site to GitHub Pages
on pushes to `main` (enable **Settings → Pages → Source: GitHub Actions**). If the site URL changes
from `https://alazarsisay145-hash.github.io/Bereketweb/`, update the canonical/OG URLs and JSON-LD in
`index.html`, `404.html`, `robots.txt` and `sitemap.xml`.

## Structure

```
index.html               # single page: hero, menu, our space, why Bereket, visit us / order form
404.html                 # not-found page
assets/css/styles.css    # theme and layout
assets/js/main.js        # MENU_ITEMS, menu, cart, language toggle, Formspree form
assets/img/              # logo, hero + interior photos, menu/ photos
robots.txt · sitemap.xml · site.webmanifest
test/smoke.test.js       # smoke test
```
