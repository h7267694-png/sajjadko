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

## Step 38

- Arabic-only `ar/zawali.md` (`zawali`). Client: zawali are sold three ways — ready-made, cut by the metre (5–15 KWD/m²), and custom-made (تفصيل). No ready-made sizes/prices yet. We do not sell Iranian rugs.

## Step 39

- Zawali page: common ready-made sizes table (market sizes, "we confirm stock"). Products `nasaq-custom-border-zawali` and `kuthban-custom-wave-zawali` (category `zawali`, no price). Products without price/priceRange show "by size and finish" and emit **no** Product JSON-LD (Google requires offers). No `latestWork` without a confirmed area. Never publish photos carrying another business's watermark or phone number.

## Step 40

- Product naming rule (client, 2026-10-10): formal, type-based names and factual descriptions. No invented brand-style names (Remal, Sidra, Lujain…), no hype words (جريئة، راقي، فاخر، قطعة فنية). Admin hint updated. Slugs/SKUs unchanged (locked URLs).

## Step 41

- Home is a store front: `HomeStore.astro` (category tiles for published pages, offers row, all-products grid with category filter) and `ui/ProductCard.astro`. All store images lazy + `fetchpriority=low`; LCP stays the text hero (~1s throttled mobile).
- Product `offer` field (active, price, was, unit, until, label). Shown only while active and not past `until`; emits `Offer` + `priceValidUntil`. Daily scheduled deploy (21:05 UTC) + inline script remove expired offers. Never invent offers or "was" prices.

## Step 42

- Published (client-approved) Arabic: mosque-carpets, musalla, services/carpet-cutting, services/carpet-installation, services/hand-carving, red-carpet; English: mosque-carpet, prayer-room-carpet. Other EN drafts stay draft (70/30 rule). No mention of mosque administration or invoices "in your name".
- Header grid is `auto | minmax(0,1fr) | auto` with tighter link padding and the theme toggle hidden between lg and xl, so five top-level items never overlap the buttons.

## Steps 43–46

- Arabic hub `ar/carpets.md` (`carpets`) is the `parent` of hallway, stairs, bedroom, kids, diwaniya-majlis and mosque-carpets (Arabic files only; EN has no hub). Contact and about pages in both languages; Arabic prices guide `ar/carpet-prices-kuwait.md` (`guides/carpet-prices-kuwait`, a `pages` entry). Footer `secondaryLinks` per locale in `navigation.ts`.

## Step 48 (section images, 50 products, latest works)

- Product field `services` (`hand-carving`, `carpet-cutting`, `carpet-installation`) links a product to a service page; `productGrid.services` filters by it (hand-carving page shows carved works).
- All source images in `src/assets/products/` and `src/assets/sections/` are WebP q80, max 1600px (same as admin uploads; client 2026-10-10). Section icons are `sections/<translationKey>.webp`, 600×600. New photos must be saved the same way.
- Real jobs (client, 2026-10-10): one product per job with `latestWork` (area required) and `places` for every section it covers (e.g. hallway + bedroom), `services: [carpet-installation]`; the installation page lists them.
- Every product carries full Arabic and English copy (name, direct answer, usage, care, SEO title/description, FAQ with a price and a free-visit question). Job products name the area in the SEO title and target «سجاد + place» keywords from plan sections 2.1 and 22.

## Step 49 (home aisles, speed)

- Home products are category aisles (`HomeStore.astro`): a section sign (brand navy, section photo, count, page link) plus two products; `[data-aisle-more]` reveals the rest (`ProductCard extra` → `hidden`, lazy images not fetched until shown). Jobs first. No filter chips.
- Keep store images lazy + `fetchpriority=low`: eager section tiles delayed the text LCP (1.4 → 1.9 s). Inlining CSS broke the 40KB HTML budget; not used.
- Unused AstroWind widgets were deleted (CSS 131 → 86KB). Do not re-add template widgets that are not used.
- Header sticky state uses an IntersectionObserver sentinel, never `scrollY` reads (forced reflow).

## Step 59 (price units, client 2026-10-11)

- Turkish carpet, thicker moquette, zawali cut by the metre and thick stair carpet: **5–15 KWD per running metre of a 4 m wide roll** (`priceRange.unit: linear-m`, schema MTR). Metres = min(ceil(W/4)×L, ceil(L/4)×W); 3×4 room = 3 m. Hallway runners: 5–15 KWD per running metre of runner.
- Per m² stays only for lightweight carpet (1.250–3), mosque/musalla (6/7/8), carpet tiles (5–6) and red carpet rental (0.750/1). Never write "5 to 15 per m²" again.

## Step 60

- Home `.cat-tile` and `.aisle` use `content-visibility: auto` (+ `contain-intrinsic-size`) so off-screen lazy images are not fetched during load (Chrome prefetches lazy images 1250–2500px ahead; 41 → 18 image requests). Keep it when adding sections or products.

## Step 61 (bounded lists, permanent speed guards)

- Lists never grow with content: category grids and `/projects/` render the first `PAGE_SIZE` (12) items; «عرض المزيد» (`ui/LoadMore.astro`) fetches `/frag/<lang>/<list>/<n>/` card fragments (`src/pages/frag/`, cards from `ui/GridCard.astro` / `ui/WorkCard.astro`, logic in `utils/lists.ts`). `/frag/` is disallowed in robots, excluded from sitemap and quality gates. Home aisles cap at 6 cards (2 shown) then link to the category page.
- CSS is inlined (`build.inlineStylesheets: 'always'`); HTML budget is 55KB gz including CSS.
- Quality gate fails on: >70 `<img>` per page, >3 non-lazy images, >40 product cards, any external `<script src>`; warns at 80% of HTML budget. LHCI asserts SI ≤ 3.4 s, TBT ≤ 200 ms, LCP ≤ 2.5 s on home, /en/, /zawali/ and a product page.

## Step 62 (Cloudflare, done 2026-10-11)

- DNS moved to Cloudflare (nameservers ada/colin; DNSSEC off at Hostinger). Records: GitHub Pages A ×4, AAAA ×4, CNAME www (proxied) and the Google TXT verification on `@` (DNS only, keeps Search Console verified). No MX.
- Only one cache rule: `/_astro/` and `/fonts/` cached 1 year. Do not add an HTML cache/bypass rule (URLs end in `/`; Cloudflare does not cache HTML by default). Rocket Loader must stay off. AI crawler policies Allow, managed robots.txt off.
- Browser Cache TTL: Respect Existing Headers. Bot Fight Mode and AI Labyrinth off. HSTS deferred. Never press "Enable all available settings" on the Speed page (adds RUM beacon and Speed Brain).
- Result: PageSpeed mobile performance back to 100 after Cloudflare (client, 2026-10-11).

## Step 63 (responsive image widths, keyword pull)

- PageSpeed flagged "properly size images" on the home category tile (zawali): 112px tile × DPR 1.75 = 196px but the srcset only had 120/240w. Fix: `src/utils/img-widths.ts` `dprWidths(cssWidths, max)` builds widths for DPR 1, 1.75, 2, 3 from the CSS sizes. Home tiles use `dprWidths([112, 150, 225], 600)`, aisle signs `dprWidths([64, 480], 960)`. New `<Image>` lists should use `dprWidths` with every CSS width in `sizes`. Local Lighthouse after fix: home, /zawali/, /en/ responsive-images pass, perf 100.
- Plan 22.5: hand-carving / diwaniya / living-room / «تفصيل سجاد» / «سجاد نقش» volumes (2026-10-16). Carving terms are 10–20/month; target each product by place + type (diwaniya, majlis, living room, zawali), linked to `services: [hand-carving]`.

## Step 64 (7 hand-carved products, product gallery widths)

- 7 new carved products from 14 client photos (2026-10-16), grouped by design: `carved-majlis-rug-navy-corner-scrolls` (3 photos), `carved-living-room-rug-navy-orange-frame` (2), `carved-majlis-carpet-brown-triangle-frame` (3), `carved-majlis-rug-stepped-geometric-border` (3), `carved-majlis-carpet-grey-blue-cream-design`, `carved-carpet-beige-blue-brown-design`, `carved-entrance-rug-blue-concave-corners`. Checked against the 20 existing carved products: no duplicates. No price (carving is priced on request, so no Product JSON-LD) and no `latestWork` (no area given). Arabic SEO titles carry «حفر يدوي بالكويت»; descriptions use «سجاد حفر يدوي» and «تفصيل سجاد» (plan 22.5). SKU `SJ-HC-MAJLISCARPETGB` (GR was taken).
- Product page gallery now uses `dprWidths`: main image `sizes="(min-width: 768px) 736px, calc(100vw - 32px)"`, thumbs `calc((100vw - 48px) / 3)` (old 100vw/33vw ignored the `px-4` padding and triggered "properly size images", 13KB waste). Local Lighthouse: product pages and /services/hand-carving/ responsive-images pass, perf 100.
- Client (2026-10-16): these 7 carved jobs were done in Mubarak Al-Kabeer governorate → `latestWork` `show: true`, `area: mubarak-al-kabeer`, no `date` (none given, so they sort after dated jobs), `services` + `carpet-installation`, SEO titles name «مبارك الكبير» / Mubarak Al-Kabeer.

## Step 65 (home UI refresh, 2026-10-17)

- Home top is `widgets/OfferSlider.astro` (client: same layout as almasathath.com's slider, dedicated to offers): 21:9 banners at the header container width (max-w-7xl), whole banner is a link, side arrows, dots below, 5 s autoplay with pause. Slides: free visit (fixed first, its image is the LCP), then active product `offer`s (automatic, removed by `until`), then published-section starting prices (offices 1.250, mosque 6/7/8, red carpet rental 0.750, carpet tiles 5–6). Never invent offers. Banner images are cropped 21:9 at build (`fit="cover"`, `position` must be a sharp keyword like `center`/`bottom`, and width ≤ source width or the build fails). Slides 2+ are `display:none` until 2 s after `load`, then only the next is armed.
- H1 and lead moved to a text intro under the slider (same text). Scoped styles need `:global([dir='rtl'])` for RTL rules.
- New tokens `--brand-sand`, `--brand-line`; `.sec-title` (gold bar). Category tiles are circles (same srcset). `ProductCard` shows the job area badge from `latestWork.area`, a bold price and a full-width WhatsApp button. Head/meta/schema/links unchanged on all 316 pages (script diff); only the home `lastmod` changes. Local Lighthouse mobile median LCP: `/` 1428 → 1726 ms, `/en/` 984 → 1207 ms, CLS 0.030 → 0, score 100.
