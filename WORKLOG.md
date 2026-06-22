# Testier Work Log

## Project Goal
- Build a revenue-ready bilingual Next.js App Router website named Testier.
- Support Korean and English routes under `/ko` and `/en`.
- Include 18 interactive reaction, speed, memory, focus, and typing tests.
- Prepare SEO metadata, sitemap, robots, FAQ content, benchmark guide content, and ad placeholder slots for future Google AdSense/Kakao ad integration.
- Save best and recent scores in `localStorage` without SSR errors.
- Show game-like result tiers: Bronze, Silver, Gold, Platinum, Diamond, Master, Champion with percentile text.
- Let users share finished results through normal URLs.

## Progress
- 2026-06-22: Read the planning prompt and confirmed the workspace was empty.
- 2026-06-22: Created a new Next.js 16.2.9 + TypeScript + Tailwind CSS app.
- 2026-06-22: Generated a visual concept for a dark gamer/lab interface and started implementation from it.
- 2026-06-22: Noted `npm audit` reports 2 moderate vulnerabilities in the fresh template dependency tree. I did not run `npm audit fix --force` because it can introduce breaking dependency changes.
- 2026-06-22: Added locale utilities, dictionary, test data, SEO helpers, scoring tiers, storage utilities, shared UI, route pages, 12 initial test components, sitemap, robots, and README content.
- 2026-06-22: `npm run build` succeeded. Initial lint found React 19 effect setState errors; corrected finish/record effects with deferred callbacks. One hook dependency warning was then removed.
- 2026-06-22: Browser verification captured desktop, mobile, tests list, and reaction detail screenshots under `output/playwright/`.
- 2026-06-22: Verified the reaction detail page start button changes the test state with Playwright.
- 2026-06-22: Renamed the site from ReflexLab to Testier/테스티어, added a new app icon, result sharing popups, shared-result links, F1 Race Start Reaction Test, sequence memory layout fix, and stronger informational content for SEO/AdSense readiness.
- 2026-06-22: Added benchmark guide content to test detail pages, including pro-gamer-level reaction speed comparisons, average ranges, device/environment caveats, and fair-test tips for stronger SEO and AdSense review depth.
- 2026-06-22: Researched competing reaction/CPS/typing/aim/memory test websites and ad policy docs. Key gaps: richer per-test statistics, multi-attempt averages, result graphs, leaderboard/social cards, expanded benchmark articles, and stronger privacy/terms pages for Google AdSense and Kakao AdFit.
- 2026-06-22: Implemented requested feature set: clarified 5-round reaction average mode, added recent score trend charts, added share result pages with dynamic PNG OG images, added Audio Reaction, Choice Reaction, Peripheral Reaction, 30 Target Aim Trainer, and Go/No-Go tests, expanded CPS and typing duration modes, and added 5 SEO guide articles.
- 2026-06-22: Expanded Privacy Policy and Terms pages for AdSense/AdFit readiness, including localStorage, cookies, third-party ad vendors, opt-out links, retention, minors, user rights, prohibited conduct, ads/external links, service changes, liability limits, and governing law.
- 2026-06-22: Validation passed with `npm run lint`, `npm run build`, HTTP check for `/api/og/result` returning `image/png`, and Playwright fallback smoke checks for reaction start interaction, guide page, share page, privacy, terms, and new test routes.

## Implementation Notes
- Use App Router route segments with `app/[locale]`.
- Keep locales limited to `ko` and `en`.
- Keep ad code as placeholders only; do not add real ad scripts before publisher IDs and policy review are ready.
- Store records by test slug, not locale, so scores persist when language changes.
- Shared result links now point to `/[locale]/share/[slug]` and encode `score`, `tier`, and `top` in query params. They do not require a database.
- `localhost` share links only work on the same computer. Public sharing needs deployment to Vercel or another public host.
- Set `NEXT_PUBLIC_CONTACT_EMAIL` before production deployment so legal pages show a real operator contact.

## Mistakes And Corrections
- Mistake: The first `[locale]/tests/[slug]` `generateStaticParams` returned both `locale` and `slug` even though the parent `[locale]` layout already generates locales. This produced a dev-mode 404 for `/ko/tests/reaction-time`. Correction: changed the child route to return only `{ slug }`.
- Tooling issue: The first Playwright screenshots showed `Internal Server Error` after parallel dev-server compilation. Correction: restarted the dev server, cleared `.next`, verified HTTP 200 responses, and reran screenshots sequentially.
- Tooling issue: The in-app browser later timed out while attaching to the local page. Correction: used Playwright and HTTP checks as the fallback verification path.
- Mistake: The share page initially rendered its in-page preview image with the production `publicSiteUrl`, so local validation showed a broken image. Correction: kept absolute URLs for metadata but changed the visible `<img>` preview to use the relative `/api/og/result` path.
- Tooling issue: In-app Browser connected, but screenshot and click CDP commands timed out during this validation run. Correction: used the skill-approved Playwright fallback and recorded screenshot evidence under `%TEMP%\testier-qa`.

## Next Steps
- Replace the legal-page contact fallback with a real `NEXT_PUBLIC_CONTACT_EMAIL` before applying for ad review.
- Consider adding an optional global leaderboard only after abuse controls, rate limiting, and moderation/storage plans are designed.
- Add real publisher IDs only after Google AdSense/Kakao ad accounts and policy requirements are ready.
- Deploy to a public domain so copied result links use a shareable URL instead of `localhost`.
