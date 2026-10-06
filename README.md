# سجادكو الكويت | Sajjadko Kuwait

الخطة المرجعية: `docs/kuwait_carpet_seo_geo_plan_v2_3_bilingual.md` (v2.3). عند التعارض تُعتمد الأقسام 21–27. حالة التنفيذ في القسم 28 منها، وتُحدَّث بعد كل خطوة.

الأوامر:

- `npm run dev` تشغيل محلي
- `npm run verify` فحص المحتوى ثم البناء ثم حواجز الجودة (نفس ما يعمل في CI)
- `node scripts/check-content.mjs --lock` قفل روابط المنتجات والمشاريع المنشورة الجديدة

قبل الرفع: فعّل 2FA وSecret scanning على المستودع (الخطة 15.6)، وفعّل GitHub Pages بمصدر "GitHub Actions".

## Step 9

- First real install/build: `check`, `build`, quality gates all pass. Fixed: site.yaml hours YAML, collections typing, template announcement bar.
- Dynamic routes for `pages` (`urlPath` per file, pairs via `translationKey`; build fails on missing pair/parent/duplicate URL). Sitemap hreflang from `translationKey`. Slug lock covers pages. `verify` clears the content cache first.
- To add a page: `src/content/pages/{ar,en}/<name>.md` with `lang`, `translationKey`, `urlPath`, `kind`, `status`, then `node scripts/check-content.mjs --lock` after publishing.

## Step 7

- Added: address in site.yaml, src/utils/schema.ts (Organization + HomeGoodsStore on home pages), AnswerBox and SpecTable. Still unbuilt (no network).

## Step 8

- Added: hours (text only), FaqList, RelatedLinks, CategoryLayout. Salford link deferred by client. Unbuilt (no network).

## Step 5 (identity)

- Brand: weave mark (chosen by client, concept 1). SVGs + icons in `public/brand/` (`icon-512.png` for Schema `Organization.logo`). Header mark is inline SVG in `Logo.astro`.
- Pending: Arabic wordmark outlines (needs shaping engine), OG image with Arabic name.
- Colors are tokens in `src/components/CustomStyles.astro` (navy primary, gold accent; gold is decorative-only on white).
- Not yet built/verified: no network in the authoring sandbox. Run `npm ci && npm run check && npm run build` first.

## Step 11

- Added draft pages `ar/red-carpet.md` and `en/red-carpet-events.md` (rental 1 / 0.750 KWD per m², Amazon 6 mm, 12+ colours) and the `red-carpet` WhatsApp message type. Unbuilt (no network): run `npm ci && npm run verify` before publishing. Sale price, roll widths and nav entry still pending.

## Step 12

- Added draft pages `ar/by-meter.md` (`/ar/by-meter/`) and `en/carpet-by-the-meter.md` (`/carpet-by-the-meter/`), key `by-meter`. Turkish carpet and wall-to-wall carpet are 5 to 15 KWD per m² by thickness, pile pressure and density.
- Price scope fix (client, 2026-10-07): 6 / 7 / 8 KWD per m² is for mosque and prayer-room carpet only, not all Turkish carpet. The mosque and prayer-room pages now say so and mention the 5 to 15 range.
- Unbuilt (no network): run `npm ci && npm run verify` before publishing. Pending: client review of English, definitions of pressure and density, navigation entry, SERP check.

## Step 13

- Added draft pages `ar/carpet-cutting.md` and `en/carpet-cutting.md` (`services/carpet-cutting`, key `carpet-cutting`, `kind: service`). Added `service` to the `kind` enum in `src/content.config.ts`.
- Client confirmed the Step 12 assumptions (pressure/density wording, 5 to 15 KWD for carpet and moquette, 6/7/8 for musalla too).
- Still unbuilt: the network is blocked in the authoring sandbox. Run `npm ci && npm run verify` before publishing anything (steps 10 to 13 are all unbuilt).

## Step 14

- Added draft pages `ar/hand-carving.md` and `en/hand-carved-rugs.md` (`services/hand-carving` and `services/hand-carved-rugs`, key `hand-carving`, `kind: service`, `waType: carving`). Text is intentionally thin: no price, timing, materials, or catalogue yet (client data pending). Before and after photos are required before publishing.
- Still unbuilt (network blocked in the sandbox): run `npm ci && npm run verify`.
