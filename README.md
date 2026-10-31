# Bloom Memories — Unofficial Concept Prototype

An independent portfolio/learning prototype exploring how digital postcard collections inspired by Pikmin Bloom could become personalized printed keepsake albums. It is not affiliated with, endorsed by, or sponsored by Nintendo or the Pikmin Bloom development team.

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
