# Claude Code Configuration

See [AGENTS.md](./AGENTS.md) for all project documentation and AI agent instructions.

## Step 15

- Added draft pages `ar/carpet-installation.md` and `en/carpet-installation.md` (`services/carpet-installation`, key `carpet-installation`, `kind: service`, `waType: installation`). Text is thin on purpose: no installation fee figure (agreed by area and location), no duration, no before/after photos yet. Client decision: we install only carpet we supply, never carpet bought elsewhere (FAQ + table row added). Plan section 28.7 lists the assumptions awaiting the client.
- Plan updated: section 22.4 (hand-carving and cutting search volumes) and the carving price decision (negotiated, nothing published).
- Still unbuilt (network blocked in the sandbox): run `npm ci && npm run verify` (14 page files across steps 10 to 15).
- Wording rule (client, 2026-10-07): never use donation words (متبرع, donation, donor), religious or charity phrases that suggest collecting money, or any mention of official bodies, on the site or in the plan. Kuwait regulation bans collecting donations; we sell mosque carpet (supply, cutting, installation). Call the person «صاحب الطلب» / «you». The mosque-order page was cancelled (merged into the hub, see Step 16).

## Step 16

- Offline checks only. `scripts/check-content.mjs` passes (run with a locally available js-yaml), and all 14 page files pass the schema limits by script. No build was run (no network).
- Decided (client, 2026-10-07): the standalone mosque-order page is cancelled and merged into the mosque hub `/ar/mosque-carpets/`. Do not create `/ar/mosque-carpets/order/`.

## Steps 17–18

- Step 17: first real build of all page files; fixed invalid `"preset": "mobile"` in `lighthouserc.json` (blocked every deploy). Site live on https://sajjadko.com via GitHub Pages (Actions).
- Step 18: mosque hub cost sections got a worked 180 m² example (merged mosque-order intent). New drafts `ar/hallway.md` (`carpets/hallway`) and `en/hallway-runners.md`, key `hallway`, no parent yet. Trial publish of all 16 page files passes `verify`.

## Step 19

- First products: 5 Turkish moquette collections in `src/content/products/` (draft), images in `src/assets/products/`. `ProductGrid.astro` + `productGrid` field on `pages` (by-meter and hallway pages use it). The Naseem board photo is excluded (another business watermark).

## Step 20

- Admin at `/admin/` (Sveltia CMS). Config is generated at build from the schema lists in `src/pages/admin/config.yml.ts`; uploads become WebP (q80, max 1600px). Temporary password gate in `public/admin/index.html` (cosmetic, not security; saving needs a GitHub token). Admin is noindex, disallowed in robots, out of sitemap and quality gates.
- Product pages `/products/<slug>/` (`ProductPage.astro`, full Product + AggregateOffer + FAQPage JSON-LD). EN product page builds only when `en.reviewed: true`. New product fields: `slug`, `priceRange`, `latestWork` (Kuwait area from `src/data/kuwait-areas.json`). Latest works page `/projects/` builds only when a product has `latestWork.show`.

## Step 21

- 8 products published and locked (5 moquette collections + 3 hallway runners with rich English copy). Watermark/brand removed from images. Colour codes on swatch boards are samples only (client); do not chase them.

## Step 23

- Real home pages via `HomePage.astro` (text hero is the LCP element). Service cards link only to published pages (auto). Home grid uses `ProductGrid` with `limit` + `compact` (interleaves categories).

## Step 24

- Sitemap built from `scripts/sitemap-data.mjs`: real `lastmod` from git (CI uses `fetch-depth: 0`), hreflang pairs for pages and products. Product lock violations are warnings (admin can delete/unpublish without breaking deploy); `--lock --prune` cleans the lock.

## Steps 25–26

- Language switcher in header (from `alternates`) + home hero button. 12 products now (added stair: Juman, Wasan; office: Reem, Riwaq). Stair/office pages not written yet; they will pick products via `productGrid.places`.

## Step 27

- Stairs (`carpets/stairs` / `stair-carpet`) and offices (`commercial-flooring/offices` / `office-carpet`) pages published. Home: products carousel right after hero (`ProductGrid carousel`, lazy + `fetchpriority=low` images to keep the text LCP fast; measured LCP 0.98–1.38s).

## Step 28

- Free home visit (client): `FreeVisit.astro` on every category/service page (via `CategoryLayout`), product page and home; WhatsApp type `visit`; `makesOffer` price 0 in store schema. AI files `/llms.txt` and `/llms-full.txt` generated at build from published content; robots.txt explicitly allows AI crawlers.

## Step 29

- Prices (client): lightweight carpet (Juman, Wasan, Reem, Riwaq; used for offices and stairs) 1.250–3 KWD/m²; office carpet tiles 5–6 KWD/m²; Turkish/thicker carpet stays 5–15. These four products have no stated origin. KWD fractions display with 3 decimals.

## Step 30

- Search Console: Domain property verified by DNS TXT at Hostinger (GitHub Pages A/AAAA/CNAME records untouched). `https://sajjadko.com/sitemap-index.xml` submitted (status success, 0 discovered pages after a day: normal for a new index). Live sitemap checked: 34 URLs.

## Step 31

- Carpet tiles pages published and locked: `ar/carpet-tiles.md` (`commercial-flooring/carpet-tiles`) and `en/carpet-tiles.md` (`carpet-tiles`), key `carpet-tiles`, WhatsApp type `carpet-tiles`. Only client facts: 40×40 cm, nylon and PP, 5–6 KWD/m², 6.25 tiles/m². No thickness, colours or per-material price. Nav "Office carpet" is now a dropdown; home offers cards added for stairs, offices, carpet tiles.
- `npm run build` fetches invoice-app vendor files from a CDN (added 2026-10-09 by another session); in a sandbox without CDN access run `check:content`, `astro build`, `check:quality` separately.

## Step 32

- Moquette pages published and locked: `ar/moquette.md` (`moquette`) and `en/wall-to-wall-carpet.md`, key `moquette`, product grid `categories: [moquette]`. Type/room intent; by-meter keeps the price/cutting intent.
- Nav rule: at most five top-level items (Carpets, Wall-to-wall carpet, Office carpet, Services, More); every new page goes under its dropdown. Dropdown parents are buttons, so parent pages need not exist. Header WhatsApp button is `whitespace-nowrap`. Checked at 360/390/1024/1280px.

## Step 33

- Language rule (client, 2026-10-10): **70% Arabic, 30% English** (plan 24.2). New pages are Arabic-first; an English pair only when a proven English keyword with buyer intent exists, else `noTranslation: true`. Published URLs unchanged.
- Nav `live` accepts `'ar'` (or `'en'`) for single-language pages.
- First real job: product `lujain-silver-grey-plush` with `latestWork` in Qasr (Jahra), 2026-10-09; `/projects/` pages now build. Arabic-only page `ar/diwaniya-majlis.md` (`carpets/diwaniya-majlis`).

## Step 34

- **URL layout reversed (client, 2026-10-10): Arabic at root `/`, English at `/en/`.** `defaultLocale: 'ar'`; routes in `src/pages/` are Arabic, `src/pages/en/` English. Always build links with `localePrefix()`/`homeHref()` from `src/utils/site.ts` (never hard-code `/ar/` or `/en/`). `urlPath` values unchanged, so `slugs.lock.json` is unchanged.
- Old URLs are frozen in `src/data/legacy-redirects.json` (meta-refresh + canonical pages via Astro `redirects`, excluded from sitemap; quality gate checks targets exist). Never delete entries.

## Step 35

- Arabic-only `ar/bedroom.md` (`carpets/bedroom`). Targeting rule (client): place pages target «سجاد/موكيت + place», never the place alone (keeps out furniture/carpentry searchers). Every Arabic title, H1, H2, nav label and home card for a place carries «سجاد» or «موكيت».

## Step 36

- Arabic-only `ar/carpet-shop-dajeej.md` (`carpet-shop-dajeej`, `kind: local`), NAP copied verbatim from `site.yaml`, Google Maps search link (no embedded map). Nav "More" holds the shop (ar) and projects. Header language button falls back to the other language's home when a page has no translation.

## Step 37

- Arabic-only `ar/kids.md` (`carpets/kids`). No claims about printed/character kids rugs or certifications (unconfirmed).
