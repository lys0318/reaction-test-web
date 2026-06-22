import type { Locale } from "./locales";

export const dictionary = {
  ko: {
    siteName: "Testier",
    tagline: "테스트하고, 티어로 확인하세요.",
    nav: {
      tests: "테스트",
      guides: "가이드",
      about: "소개",
      privacy: "개인정보",
      terms: "이용약관",
    },
    home: {
      title: "반응속도, 에임, 기억력, 집중력을 테스트하세요",
      description:
        "테스티어(Testier)는 Test와 Tier를 합쳐 만든 이름입니다. 반응속도, 조준력, 기억력, 집중력을 테스트하고 결과를 티어로 확인하세요.",
      primaryCta: "반응속도 테스트 시작하기",
      secondaryCta: "모든 테스트 보기",
      popular: "인기 테스트",
      categories: "카테고리",
      howItWorks: "사용 방법",
      steps: ["테스트를 고르세요", "안내에 따라 플레이하세요", "기록과 티어를 확인하세요"],
    },
    tests: {
      title: "모든 테스트",
      description: "반응속도, 클릭 속도, 기억력, 집중력, 타자 속도를 한 곳에서 측정하세요.",
      search: "테스트 검색",
      allCategories: "전체",
      start: "시작하기",
      noResults: "조건에 맞는 테스트가 없습니다.",
    },
    common: {
      ad: "광고 영역",
      best: "최고 기록",
      recent: "최근 기록",
      clear: "기록 지우기",
      start: "시작",
      restart: "다시 시작",
      ready: "준비",
      result: "결과",
      average: "평균",
      accuracy: "정확도",
      hits: "명중",
      misses: "실수",
      score: "점수",
      seconds: "초",
      rounds: "라운드",
      disclaimer: "이 테스트는 재미와 자기 개선을 위한 참고용 테스트이며, 의학적 또는 전문적 진단이 아닙니다.",
      tierIntro: "결과 티어",
      tips: "점수 향상 팁",
      faq: "자주 묻는 질문",
    },
    tiers: {
      bronze: "브론즈",
      silver: "실버",
      gold: "골드",
      platinum: "플래티넘",
      diamond: "다이아",
      master: "마스터",
      champion: "챔피언",
      top: "상위",
    },
    legal: {
      aboutTitle: "테스티어 소개",
      aboutBody:
        "테스티어(Testier)는 Test와 Tier를 합쳐 만든 이름입니다. 반응속도, 조준력, 기억력, 집중력, 타자 속도를 간단히 확인하고 결과를 브론즈부터 챔피언까지의 티어로 이해할 수 있는 무료 웹 테스트 사이트입니다. 모든 테스트는 브라우저 안에서 실행되며 서버나 데이터베이스 없이 기록을 기기에 저장합니다.",
      privacyTitle: "개인정보 처리방침",
      privacyBody:
        "현재 테스티어 MVP는 회원가입, 서버 저장, 개인 식별 정보 수집을 하지 않습니다. 최고 기록과 최근 기록은 사용자의 브라우저 localStorage에만 저장됩니다. 향후 광고 서비스 적용 시 각 광고 플랫폼의 쿠키 및 개인정보 정책이 추가될 수 있습니다.",
      termsTitle: "이용약관",
      termsBody:
        "테스티어의 테스트 결과는 오락과 자기 개선 참고용입니다. 의학적, 과학적, 전문적 평가나 진단으로 사용할 수 없습니다. 사이트 이용 과정에서 발생하는 개인 판단과 결과 해석은 사용자 책임입니다.",
    },
  },
  en: {
    siteName: "Testier",
    tagline: "Test yourself and discover your tier.",
    nav: {
      tests: "Tests",
      guides: "Guides",
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
    },
    home: {
      title: "Test Your Reaction, Aim, Memory, and Focus",
      description:
        "Testier combines Test and Tier: play quick skill tests, then understand your result through clear competitive tiers.",
      primaryCta: "Start Reaction Test",
      secondaryCta: "View All Tests",
      popular: "Popular Tests",
      categories: "Categories",
      howItWorks: "How it works",
      steps: ["Pick a test", "Play by the instructions", "Review your records and tier"],
    },
    tests: {
      title: "All Tests",
      description: "Measure reaction time, click speed, memory, focus, and typing speed in one place.",
      search: "Search tests",
      allCategories: "All",
      start: "Start",
      noResults: "No tests match your filters.",
    },
    common: {
      ad: "Ad Space",
      best: "Best Score",
      recent: "Recent Scores",
      clear: "Clear Scores",
      start: "Start",
      restart: "Restart",
      ready: "Ready",
      result: "Result",
      average: "Average",
      accuracy: "Accuracy",
      hits: "Hits",
      misses: "Misses",
      score: "Score",
      seconds: "sec",
      rounds: "Rounds",
      disclaimer: "These tests are for entertainment and self-improvement purposes only. They are not medical or professional assessments.",
      tierIntro: "Result Tier",
      tips: "Score improvement tips",
      faq: "FAQ",
    },
    tiers: {
      bronze: "Bronze",
      silver: "Silver",
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
      master: "Master",
      champion: "Champion",
      top: "Top",
    },
    legal: {
      aboutTitle: "About Testier",
      aboutBody:
        "Testier combines Test and Tier. It is a free web testing site for checking reaction speed, aim, memory, focus, and typing speed, then interpreting results through tiers from Bronze to Champion. Every test runs in the browser and stores records on your device without a server or database.",
      privacyTitle: "Privacy Policy",
      privacyBody:
        "The current Testier MVP does not require sign-up, server storage, or personally identifiable information. Best and recent scores are stored only in your browser localStorage. If ad services are added later, cookie and privacy notices from each ad platform may apply.",
      termsTitle: "Terms of Use",
      termsBody:
        "Testier results are for entertainment and self-improvement reference only. They are not medical, scientific, or professional evaluations or diagnoses. Your interpretation and use of the results are your responsibility.",
    },
  },
} as const;

export type Dictionary = (typeof dictionary)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}
