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
