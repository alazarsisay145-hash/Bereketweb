# Bereket Juice & Salad 🍹

Official website for **Bereket Juice & Salad** — a fresh juice, smoothie, burger and fruit salad
house in **Hawassa, Sidama, Ethiopia**.

Bright, glassmorphism-styled static site: plain HTML + CSS + vanilla JS, ready for GitHub Pages.

## Highlights

- 🤍 **Light, fresh design** — white/cream base, light-green accents, glass (frosted) cards
- 🥭 **Full menu** — 20 products across juices, smoothies, shakes, burgers, salads and combos,
  each with its **own artwork**
- 💬 **Real WhatsApp ordering** — the cart builds an order message (items, total, name, pickup
  time) and opens WhatsApp so the shop actually receives the order — no backend needed
- 🏡 **Guest house** shown as a small "coming soon" strip (no fake email form)
- ♿ Reduced-motion support, keyboard-friendly dialogs, semantic markup
- 🔎 SEO metadata + Schema.org `Restaurant` structured data

## Running locally

Open `index.html` directly, or serve the folder:

```bash
npm start        # serves the site with `serve`
```

## Tests

```bash
npm test         # smoke test: files, theme, menu data, product images, WhatsApp flow
```

## Configuration

| What | Where |
| --- | --- |
| **WhatsApp number** | `CONFIG.whatsappNumber` at the top of `js/main.js` (digits only, e.g. `2519XXXXXXXX`). Also update the displayed number in the Contact section of `index.html`. |
| Menu items & prices | `PRODUCTS` array in `js/main.js` |
| Product artwork | `assets/menu/*.svg` — to switch to real photography, save photos with the same file names (or update the `img` paths in `PRODUCTS`) |
| Opening hours / address | Contact section + JSON-LD in `index.html` |

## Structure

```
index.html          # single-page site (hero, popular, menu, our place, guest house, contact)
css/styles.css      # light glassmorphism theme
js/main.js          # menu rendering, filters, cart, WhatsApp checkout
assets/             # logo, favicon, hero + per-product artwork
test/smoke.test.js  # smoke test
```
