# Testier

Testier, also written as 테스티어, combines **Test + Tier**. It is a bilingual revenue-ready web test site for reaction speed, F1 race-start reaction, audio reaction, choice reaction, peripheral reaction, FPS-style target reaction, aim, CPS, spacebar speed, keyboard reaction, number memory, visual memory, color matching, focus, typing speed, and sequence memory.

The app is built with Next.js App Router, TypeScript, React, and Tailwind CSS. It uses no server or database for the MVP. Best scores and recent scores are stored in browser `localStorage`.

## Main Features

- Korean and English routes: `/ko`, `/en`
- Dynamic test pages: `/ko/tests/[slug]`, `/en/tests/[slug]`
- 18 interactive tests
- Shareable result pages, result popups, and dynamic result OG images
- Recent-score trend charts stored in browser localStorage
- SEO guide articles under `/[locale]/guides`
- SEO metadata per locale and test page
- Open Graph and Twitter card metadata
- `sitemap.ts` and `robots.ts`
- FAQ JSON-LD on test pages
- Ad placeholder areas for future Google AdSense or Kakao ad integration
- Game-like score tiers: Bronze, Silver, Gold, Platinum, Diamond, Master, Champion
- Mobile-first dark gamer/lab UI

## Supported Languages

- Korean: `/ko`
- English: `/en`

## Test List

- Reaction Time Test
- F1 Race Start Reaction Test
- Audio Reaction Test
- Choice Reaction Test
- Peripheral Reaction Test
- FPS Reaction Test
- Aim Test
- 30 Target Aim Trainer
- CPS Test
- Spacebar Counter
- Keyboard Reaction Test
- Number Memory Test
- Visual Memory Test
- Color Match Test
- Go/No-Go Focus Test
- Focus Test
- Typing Speed Test
- Sequence Memory Test

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Browser `localStorage`

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/ko](http://localhost:3000/ko).

## Build

```bash
npm run build
```

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL, for example `https://testier.com`.
4. Deploy.

## Folder Structure

```text
app/
  [locale]/
    page.tsx
    guides/
      page.tsx
      [slug]/page.tsx
    share/
      [slug]/page.tsx
    tests/
      page.tsx
      [slug]/page.tsx
    about/page.tsx
    privacy/page.tsx
    terms/page.tsx
  icon.svg
  api/og/result/route.tsx
  sitemap.ts
  robots.ts
components/
  common/
  layout/
  tests/
lib/
  dictionary.ts
  format.ts
  locales.ts
  scoring.ts
  seo.ts
  storage.ts
  tests.ts
  guides.ts
```

## Result Sharing

When a test finishes, a result popup appears with the score, tier, percentile text, and a shareable URL. Shared URLs point to `/[locale]/share/[slug]` and include query parameters such as `score`, `tier`, and `top`. The share page uses a dynamic PNG endpoint at `/api/og/result` for social preview cards.

## Advertising Placeholders

Real ad scripts are not included. `AdPlaceholder` renders locale-aware slots labeled `광고 영역` or `Ad Space`. Add actual Google AdSense or Kakao ad code only after publisher IDs, privacy disclosures, and ad policy checks are ready.

Set `NEXT_PUBLIC_CONTACT_EMAIL` before production deployment so the privacy policy and terms show a real operator contact address.

## Disclaimer

These tests are for entertainment and self-improvement purposes only. They are not medical or professional assessments.
