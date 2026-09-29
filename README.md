# Habesha Haven — Hotel & Café

Production-ready static website for **Habesha Haven**, an Ethiopian hotel and café.
Plain HTML, CSS and vanilla JavaScript — no framework and no build step.

## Features

- Responsive glassmorphism design (desktop and mobile).
- Rooms with detail dialogs and a booking form with client-side validation,
  inline error messages and an accessible success/status message.
- Café menu with category filters, debounced search and an empty state.
- Cart persisted in `localStorage` (add, increase/decrease, remove, subtotal,
  header badge). Orders are sent via WhatsApp or e-mail.
- English / አማርኛ language switcher (choice is remembered and updates `<html lang>`).
- Accessibility: landmarks, skip link, keyboard-operable dialogs with focus
  trap and <kbd>Esc</kbd> to close, visible focus rings, WCAG AA contrast,
  `prefers-reduced-motion` support.
- SEO: canonical URL, Open Graph / Twitter cards, JSON-LD (`Hotel` + `Restaurant`),
  `robots.txt`, `sitemap.xml`, web app manifest and a styled `404.html`.
- Progressive enhancement: all content (rooms, menu, contact, booking form)
  is readable and usable without JavaScript; JS-only controls are hidden.

## Project structure

```
.
├── index.html               # Semantic markup, meta tags, JSON-LD
├── 404.html                 # Self-contained "page not found" page
├── assets/
│   ├── css/styles.css       # All styles (design tokens in :root)
│   ├── js/main.js           # Nav, language switcher, menu, cart, booking
│   └── img/                 # Favicons / app icons (see assets/img/README.md)
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── test/smoke.test.js       # Static smoke tests (no dependencies)
├── .htmlvalidate.json       # html-validate config
└── .github/workflows/deploy.yml
```

## Run locally

Any static file server works. With Node.js installed:

```bash
npm start            # serves the folder on http://localhost:3000
# or
python3 -m http.server 8080
```

Opening `index.html` directly from disk also works, but a server is
recommended so that `localStorage`, the manifest and absolute paths behave as
in production.

## Test and lint

```bash
npm test             # smoke tests: structure, meta, a11y attributes, i18n keys, CSP hash
npm run lint:html    # html-validate on index.html and 404.html
```

Both run in CI on every push and pull request.

## Configuration — before going live

| What | Where |
| --- | --- |
| Booking form endpoint (Formspree, Getform, Basin, …) | `CONFIG.bookingEndpoint` in `assets/js/main.js` **and** the `action` of `#bookingForm` in `index.html` (used when JS is off). Replace `YOUR_FORM_ID`. Until then the form shows a "call or e-mail us" message instead of sending. |
| WhatsApp number for café orders | `CONFIG.whatsappNumber` in `assets/js/main.js` (digits only, with country code). Empty = orders open an e-mail to `CONFIG.orderEmail`. |
| Phone, e-mail, address, opening hours | Footer in `index.html`, the JSON-LD block in `<head>`, and `CONFIG.contactPhone` / `CONFIG.contactEmail`. The current values are **placeholders**. |
| Site URL (`https://alazarsisay145-hash.github.io/Bereketweb/`) | `canonical`, `og:*`, `twitter:*` and JSON-LD in `index.html`, links in `404.html`, `sitemap.xml`, `robots.txt`. Update if you use a custom domain. |
| Translations | `I18N.am` in `assets/js/main.js`. Every `data-i18n`, `data-i18n-html` and `data-i18n-attr` key used in `index.html` must exist there (`npm test` checks this). English text is read from the HTML. |
| Photos | Served from Unsplash with `width`/`height`, `loading="lazy"` and `decoding="async"`. See `assets/img/README.md` to switch to local images. |

### Content Security Policy

`index.html` sets a CSP via `<meta http-equiv>`. It allows scripts/styles only
from the site itself (plus one hashed inline snippet that adds the `js` class),
images from `images.unsplash.com`, and form/fetch requests to `formspree.io`.
If you change the booking provider or image host, update the policy. If you
edit the inline `<script>` in `<head>`, update its `sha256-…` hash
(`npm test` fails when it is out of date).

## Deploy to GitHub Pages

1. In the repository go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs the tests
   and the HTML linter, then publishes the site.

Only the public files (`index.html`, `404.html`, `assets/`, manifest,
`robots.txt`, `sitemap.xml`) are deployed. GitHub Pages serves `404.html`
automatically for unknown URLs.

> Note: on a project site (`username.github.io/Bereketweb/`) search engines only
> read `robots.txt` from the domain root. The sitemap can still be submitted
> directly in Google Search Console; with a custom domain `robots.txt` works as-is.

## License

MIT
