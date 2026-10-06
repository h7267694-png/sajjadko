# Claude Code Configuration

See [AGENTS.md](./AGENTS.md) for all project documentation and AI agent instructions.

## Step 15

- Added draft pages `ar/carpet-installation.md` and `en/carpet-installation.md` (`services/carpet-installation`, key `carpet-installation`, `kind: service`, `waType: installation`). Text is thin on purpose: no installation fee figure (agreed by area and location), no duration, no before/after photos yet. Client decision: we install only carpet we supply, never carpet bought elsewhere (FAQ + table row added). Plan section 28.7 lists the assumptions awaiting the client.
- Plan updated: section 22.4 (hand-carving and cutting search volumes) and the carving price decision (negotiated, nothing published).
- Still unbuilt (network blocked in the sandbox): run `npm ci && npm run verify` (14 page files across steps 10 to 15).
- Wording rule (client, 2026-10-07): never use donation words (متبرع, donation, donor), religious or charity phrases that suggest collecting money, or any mention of official bodies, on the site or in the plan. Kuwait regulation bans collecting donations; we sell mosque carpet (supply, cutting, installation). Call the person «صاحب الطلب» / «you»; the mosque-order page is `/ar/mosque-carpets/order/`.

## Step 16

- Offline checks only. `scripts/check-content.mjs` passes (run with a locally available js-yaml), and all 14 page files pass the schema limits by script. No build was run (no network).
- Decided (client, 2026-10-07): the standalone mosque-order page is cancelled and merged into the mosque hub `/ar/mosque-carpets/`. Do not create `/ar/mosque-carpets/order/`.
