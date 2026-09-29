# Images

This folder holds the site's local image assets:

| File | Used for |
| --- | --- |
| `favicon.svg` | Browser tab icon (modern browsers) |
| `favicon-32.png` | Fallback favicon |
| `apple-touch-icon.png` | iOS home-screen icon (180×180) |
| `icon-192.png`, `icon-512.png` | Web app manifest icons (`site.webmanifest`) |

## Photography

Room, café and menu photos are currently served from the Unsplash CDN
(`images.unsplash.com`) as optimized, cropped URLs (`auto=format` serves
WebP/AVIF, `w`/`h`/`q` control size and quality). Every `<img>` declares
`width`/`height`, `loading="lazy"` and `decoding="async"`, and larger images
provide a `srcset`.

To switch to your own photos:

1. Export each photo as WebP (or JPEG) at roughly the sizes used today —
   rooms `800×570`, menu items `600×400`, coffee `1200×800`, hero `2000px` wide.
2. Save them here, e.g. `assets/img/rooms/haven-deluxe.webp`.
3. Update the matching `src`/`srcset` in `index.html` (and the hero
   `background` URL in `assets/css/styles.css` plus the `preload` links in the
   `<head>`), keeping the `width`/`height` attributes in sync with the files.
4. If the images are no longer hosted on Unsplash, remove
   `https://images.unsplash.com` from the `img-src` of the Content Security
   Policy in `index.html` and the `preconnect` link.
