<div align="center">

# Testier · 테스티어

**반응속도 · 에임 · 기억력 · 집중력 · 타자 속도를 측정하고, 결과를 게임 티어로 확인하는 한·영 이중언어 웹 테스트 사이트**

[![Testier](https://test-tier.com/api/og/default)](https://test-tier.com)

### 🔗 **[바로 사용해보기 → test-tier.com](https://test-tier.com)**

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind CSS 4` · `Cloudflare Workers` · `Cloudflare D1`

</div>

---

## 📖 소개

**Testier**(테스티어)는 **Test + Tier**를 합친 이름으로, 짧은 웹 테스트로 반응속도·조준력·기억력·집중력·타자 속도를 측정하고 그 결과를 **브론즈부터 챔피언까지의 게임 티어**로 이해하기 쉽게 보여주는 사이트입니다.

- 🎮 **18종의 인터랙티브 테스트** — 설치 없이 브라우저에서 바로 플레이
- 🌐 **한국어 / 영어** 라우팅 (`/ko`, `/en`)
- 🏆 **전 세계 Top 10 리더보드** (Cloudflare D1)
- 📊 개인 기록은 브라우저에 저장, 최근 기록 추이 그래프 제공
- 🔗 결과를 링크로 공유 (동적 OG 이미지 생성)

> 모든 테스트는 재미와 자기 점검을 위한 참고용이며, 의학적·전문적 진단이 아닙니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| **18종 테스트** | 반응속도, 게이머 속도, 기억력, 집중력, 타자 5개 카테고리 |
| **게임 티어 시스템** | 점수를 Bronze · Silver · Gold · Platinum · Diamond · Master · Champion으로 환산 |
| **글로벌 리더보드** | 테스트별 Top 10, 닉네임 등록, 서버 측 값 검증(어뷰징 방지) |
| **결과 공유** | 점수·티어를 URL에 담아 공유, 소셜 미리보기용 동적 PNG 생성 |
| **이중언어 i18n** | locale별 라우팅 + `<html lang>` 정확 처리 + hreflang |
| **SEO 최적화** | sitemap, robots, canonical, JSON-LD(WebSite/FAQ/Breadcrumb), OG/Twitter 카드 |
| **콘텐츠 가이드** | 반응속도·CPS·타자·기억력 등 12편의 설명 아티클 |
| **반응형 다크 UI** | 모바일 우선, 게이머/랩 컨셉의 다크 테마 |

### 🧪 테스트 목록 (18종)

- **반응속도** — 반응속도 · F1 레이스 스타트 · 소리 반응 · 선택 반응 · 주변시 반응 · 키보드 반응
- **게이머 속도** — FPS 반응 · 에임 · 30타깃 에임 트레이너 · CPS · 스페이스바 카운터
- **기억력** — 숫자 기억력 · 시각 기억력 · 순서 기억력(Simon)
- **집중력** — 색상 매칭(Stroop) · Go/No-Go · 집중력
- **타자** — 타자 속도(WPM)

---

## 🛠 기술 스택

- **프레임워크** — Next.js 16 (App Router, Turbopack)
- **언어/UI** — React 19, TypeScript, Tailwind CSS 4
- **호스팅** — Cloudflare Workers (OpenNext 어댑터, 커스텀 도메인)
- **데이터베이스** — Cloudflare D1 (서버리스 SQLite, 리더보드)
- **분석/광고** — Google Analytics 4, Kakao AdFit
- **저장소** — 브라우저 `localStorage` (개인 기록), D1 (리더보드)

---

## 🏗 아키텍처 & 기술적 포인트

> 포트폴리오 관점에서 이 프로젝트의 핵심 설계 결정과 해결한 문제들을 정리했습니다.

### 1. App Router 기반 i18n
- `app/[locale]/` 동적 세그먼트로 `/ko`, `/en` 라우팅을 구성하고, **루트 레이아웃 자체를 `[locale]` 아래에 두어** 페이지마다 `<html lang>`을 올바르게(`ko`/`en`) 렌더링했습니다. (Next.js 공식 i18n 패턴)
- 사전(dictionary) 기반 번역 + `hreflang`/`canonical` 자동 생성으로 SEO·접근성을 모두 만족시켰습니다.
- `/` 진입 시 `next.config`의 `redirects()`로 기본 로케일(`/ko`)로 이동.

### 2. 글로벌 리더보드 (Cloudflare D1)
- Route Handler(`/api/leaderboard/[slug]`)에서 **D1(SQLite)** 에 접근해 테스트별 Top 10을 제공합니다.
- `GET`은 닉네임별 최고 기록을 테스트의 정렬 방향(반응속도는 낮을수록, CPS는 높을수록)에 맞춰 집계.
- `POST`는 **서버 측에서 닉네임 정화 + scoreType별 값 범위 검증**(예: 사람이 불가능한 80ms 미만 반응속도 거부)으로 기초적인 조작을 차단합니다.
- DB 바인딩이 없으면 빈 리더보드를 반환하도록 설계해, 인프라가 준비되기 전에도 사이트가 깨지지 않습니다.

### 3. Cloudflare Workers 배포 (OpenNext)
- `@opennextjs/cloudflare` 어댑터로 Next.js를 Workers에 배포하고, GitHub 푸시 시 자동 빌드·배포되도록 구성했습니다.
- **해결한 문제 ①** — 기본 설정에서 SSG 프리렌더 페이지가 런타임에 캐시를 못 읽어 전부 404. → **static-assets incremental cache**를 설정해 프리렌더 페이지를 정적 자산에서 직접 서빙하도록 해결.
- **해결한 문제 ②** — `runtime = "edge"` OG 라우트가 어댑터에서 빌드되지 않아 500. → Node 런타임으로 전환해 해결.

### 4. SEO & 공유
- `sitemap.ts` / `robots.ts`로 사이트맵·robots 자동 생성, 페이지별 고유 `title`/`description`.
- `WebSite` · `FAQPage` · `BreadcrumbList` **JSON-LD** 구조화 데이터.
- 결과 공유 페이지는 `next/og` `ImageResponse`로 **점수·티어가 담긴 동적 PNG**를 생성하고, 일반 페이지는 브랜드 **기본 OG 이미지**를 사용합니다.

### 5. 성능
- 대부분의 페이지를 **SSG(100+ 정적 페이지)** 로 프리렌더하여 엣지에서 빠르게 서빙.
- HTML·자산 **Brotli 압축**, `public/_headers`로 `/_next/static/*`을 **immutable 캐시**(해시 파일명 기반)하여 재방문 성능을 개선.

### 6. 점수/티어 시스템
- 개인 최고·최근 기록은 `localStorage`에 저장하고, 커스텀 이벤트로 **여러 컴포넌트 인스턴스 간 상태를 동기화**(테스트 완료 즉시 리더보드 등록 UI에 반영).
- 점수 타입(reaction/cps/accuracy/wpm/memory/score)별로 티어 임계값을 분리하고, **웹 측정 특성(주사율·입력 지연)에 맞춰 반응속도 티어를 재보정**했습니다.

### 7. 광고 연동 (Kakao AdFit)
- SPA(클라이언트 라우팅) 환경에서 광고가 첫 페이지에서만 뜨는 문제를 해결하기 위해, **pathname 변경마다 `<ins>`를 재생성하고 광고 스크립트를 재실행**.
- 뷰포트에 따라 PC(728×90)·모바일(320×100) 유닛을 하나만 렌더링해 한 페이지에 같은 유닛이 중복되지 않도록 했습니다.

---

## 📂 프로젝트 구조

```text
app/
  [locale]/
    layout.tsx          # 루트 레이아웃 (html lang, 헤더/푸터, GA4)
    page.tsx            # 홈
    tests/              # 테스트 목록 + 상세
    guides/             # SEO 가이드 아티클
    share/              # 결과 공유 페이지
    about · contact · privacy · terms
  api/
    leaderboard/[slug]/ # 리더보드 GET/POST (D1)
    og/result · og/default  # 동적/기본 OG 이미지
  sitemap.ts · robots.ts
components/
  common/   # Button, AdFitBanner, Leaderboard 슬롯 등 공용 UI
  layout/   # Header, Footer
  tests/    # 18개 테스트 컴포넌트 + 점수 훅
lib/
  tests.ts · guides.ts · scoring.ts · leaderboard.ts
  dictionary.ts · locales.ts · seo.ts · storage.ts
migrations/             # D1 스키마
wrangler.jsonc          # Cloudflare Workers 설정
```

---

## 💻 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000/ko
```

`.env.example`을 `.env.local`로 복사한 뒤 값을 채워주세요.

| 환경변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical·sitemap·OG에 쓰이는 사이트 주소 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 문의/법적 페이지에 표시되는 이메일 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 측정 ID (선택) |

```bash
npm run build    # 프로덕션 빌드
npm run lint     # 린트
npm run preview  # Cloudflare(workerd) 환경 로컬 미리보기
```

---

## 🚀 배포 (Cloudflare Workers)

```bash
npm run deploy   # opennextjs-cloudflare build && deploy
```

- GitHub 저장소를 Cloudflare **Workers Builds**에 연결하면 `master` 푸시 시 자동 배포됩니다.
- 리더보드용 D1은 `wrangler d1 create` 후 `wrangler.jsonc`의 `database_id`에 연결하고, `migrations/`를 적용합니다.

---

## 📝 라이선스 & 면책

테스트 결과와 티어는 오락·자기 점검을 위한 참고 지표이며, 의학적·전문적 평가가 아닙니다.
