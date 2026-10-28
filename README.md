# Bloom Memories — Unofficial Concept Prototype

An independent portfolio/learning prototype exploring how digital postcard collections inspired by Pikmin Bloom could become personalized printed keepsake albums. It is not affiliated with, endorsed by, or sponsored by Nintendo or the Pikmin Bloom development team.

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local development URL (usually `http://localhost:5173/`).

Build for production:

```bash
npm run build
npm run preview
```

## Stack

- HTML + Vite
- SCSS + Bootstrap 5.3 + Bootstrap Icons
- Vanilla JavaScript (ES-module entry point + ordered, commented browser-script chunks)
- `localStorage` for mock account, drafts, wishlist, cart, currency, locale, and order history
- No real game integration, authentication service, payment gateway, shipping API, or print provider

## Localization architecture

- `src/js/locales/zh-Hant.js` — Traditional Chinese dictionary
- `src/js/locales/en.js` — English dictionary
- `src/js/locales/ja.js` — Japanese dictionary
- `src/js/i18n.js` — locale/currency manager and phrase localization helper

Add a new language by creating a locale dictionary, importing it in `i18n.js`, adding it to `dictionaries`, and adding its option to the language menu. Recognized template phrases are wrapped in `data-i18n` spans, while static navigation and footer labels use explicit `data-i18n` attributes. The current dictionary keys preserve the original Traditional Chinese phrase for compatibility; for production, consider gradually migrating them to semantic keys such as `nav.home`.

## Prototype features

- Album studio starts with draft selection / new-album creation before postcard selection
- Maximum 3 active drafts per account; submitted albums do not count toward the draft limit
- Select up to 24 mock postcards, filter by continent, region, exact place, date, method, and favorites
- Edit postcard text/date and place up to 8 decorations from 8 decoration types per postcard; decorations can be dragged around while preserving original postcard artwork; landscape postcard layout uses image on the left and writing area on the right
- Reorder postcards, upload one image for both the front and back cover, edit the title and subtitle, and preview one landscape postcard per page with a page-turn transition
- Set print quantity (1–20)
- Three clickable homepage album examples: “A Life Overseas”, “Our First Trip Abroad” (Yamagata), and “Baby’s Growing Years”
- Six mock products; product names, descriptions, and three specification paragraphs switch between Traditional Chinese, English, and Japanese. Product details include a gallery, quantity control (max 10), wishlist feedback, and recommendations
- Optional album-only add-ons and wishlist products can be included during album checkout
- FAQ uses the Bootstrap accordion; shipping info includes clearly marked illustrative assumptions; contact form uses Bootstrap form components
- Currency choices: JPY, TWD, USD (illustrative fixed rates, not live FX); language choices: Traditional Chinese, English, Japanese; product names, descriptions, specifications, and key new interface labels are included in the separate locale dictionaries
- Mock credit-card-only checkout, custom-product policy warnings, order creation timestamp, submitted album preview, reorder flow, and local address-book create/edit/delete management

## Important prototype assumptions

Destination coverage, shipping rates, production/delivery estimates, duties, return/cancellation policies, print specs, prices, and product availability are illustrative only and must not be represented as confirmed operational terms. The prototype does not collect real payment details or send contact form submissions. The postcards and product imagery are mock visuals.

## Visual direction

The UI has been refreshed with a visual direction inspired by the official [Pikmin Bloom Traditional Chinese website](https://pikminbloom.com/zh_hant): brighter garden greens, airy white space, friendly rounded controls, light seasonal color accents, and playful card surfaces. This is an original interpretation for a portfolio concept; it does not use official artwork or imply affiliation, endorsement, or authorization. The prototype disclaimer remains visible in the interface.

## v5 refinements

- Working product name: Bloom Memories (unofficial concept only); alternate naming ideas are in `docs/product-name-options.md`.
- Added a missing print-confirmation step, which was the cause of the Studio flow failing when entering step 7.
- Added a colophon/copyright page before the back cover, including editable author, completion date and print date fields.
- Added a right-bottom corner page-turn micro-animation to the sample album modal.
- Combined FAQ and shipping content into a two-column Bootstrap List Group navigation layout.
- Added a conceptual privacy policy page and footer link.
- Header language uses a select control; currency uses a symbol button with a dropdown.
- This remains a front-end concept prototype with localStorage and simulated orders; no real Pikmin Bloom integration, payments, print fulfillment or shipping is connected.

## v6 refinement notes

- Product brand is now Bloom Memories.
- Checkout includes optional gift wrap, ribbon, and gift-card message controls for album orders.
- Related product cards include a dedicated add-to-cart action; product detail navigation scrolls to the top.
- Help navigation uses Bootstrap grid columns (`col-lg-3` and `col-lg-9`).
- Preview pages use a 3D book-style page-turn animation, with reduced-motion support.

## Source-code organization

- `src/js/main.js` is the small entry point: it imports Bootstrap/SCSS and loads the ordered, commented browser-script chunks from `public/js/chunks/`.
- `public/js/chunks/01-data*.js` through `08-showcase*.js` separate postcard batches, translation batches, product data, core helpers, page templates, interactions, and album showcase views. `src/js/main.js` lists the exact load order because the classic scripts share the prototype's browser scope.
- `src/js/i18n.js` wraps recognized phrases in `data-i18n` attributes and applies the active locale. English and Japanese phrase dictionaries are split into small phrase-batch modules, then merged by each locale entry point. Product-specific copy is localized by each product's `translations` object.
- `src/scss/main.scss` imports the ordered SCSS pieces in `src/scss/partials/`. The JS, SCSS, HTML, and locale phrase source files are kept below 300 lines where practical to make maintenance easier.

## Add your favicon

Place the favicon file in the project's `public/` folder. For example, if your file is named `favicon.png`, put it at `public/favicon.png`, then remove the HTML comment around this line in `index.html`:

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

If your file uses a different name or format, update the path and `type` accordingly (for example, `/favicon.ico` or `/favicon.svg`). Vite copies files in `public/` to the site root when building the project.

## v7 source-organization refinements

- Added an original SVG flower-mark image for the header and footer brand; replace `public/images/bloom-memories-mark.svg` with your final logo if desired.
- Switched recognized template phrases to `data-i18n` attributes and applied the locale dictionary through the i18n helper.
- Split JavaScript into eight commented chunks and SCSS into six ordered partials, each kept under 200 lines.
- Removed the currency selector border and documented the favicon insertion point.

## v8 maintenance notes

- Added Traditional Chinese meta description, Open Graph/Twitter metadata, crawl directives, and basic WebSite structured data.
- Client-side route changes update the document title.
- Shop and cart template literals are formatted across multiple lines for readability.
- Product cards use flexible vertical layouts; the price and actions sit at the bottom where the card structure supports it.
- Cart quantity and remove actions are separate controls.
- Checkout and order confirmation views include explicit navigation back buttons.
- The app shell uses a flex-column sticky-footer pattern; long pages continue to scroll naturally.
- FAQ and delivery layout uses Bootstrap row/column utilities rather than fixed column widths.
- This is a portfolio prototype with mock products and orders; structured data does not imply an active commercial store.

## v9 bug fixes and maintenance

- Fixed sample album cover/back-cover image paths to match the actual lowercase `.png` asset filenames; the back cover falls back to the front cover image if its own image is missing.
- Fixed skipped even-numbered showcase pages by removing the duplicate document-level handler that caused the same Next/Previous click to advance twice.
- Removed the extra page-corner overlay and the second blur effect from showcase postcard captions to keep the image treatment to one translucent text panel.
- Added a compressed cover-image upload to the album design step. The selected image is used on both the front and back covers and saved with the local draft.
- Decoration selection now clears when clicking outside a decoration; preview/print views no longer render selection outlines, resize handles, or delete controls.
- Standardized postcard method labels to use separate lines, and completed the missing Japanese phrase mappings found in the English/Japanese dictionary comparison.
- Product names, descriptions, and three specification paragraphs now switch languages. Corrected product image paths to match the real asset filenames.
- Split large JavaScript and SCSS source files into ordered pieces below 300 lines, and split English/Japanese locale phrase maps into smaller modules.
