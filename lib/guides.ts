import type { Locale } from "./locales";

export type Guide = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  sections: Record<Locale, { heading: string; body: string }[]>;
};

export const guides: Guide[] = [
  {
    slug: "good-reaction-time",
    title: { ko: "좋은 반응속도는 몇 ms일까?", en: "What Is a Good Reaction Time?" },
    description: {
      ko: "온라인 반응속도 테스트 결과를 해석하는 방법과 평균, 빠른 기록, 장비 지연의 차이를 정리했습니다.",
      en: "Learn how to interpret reaction time results, common average ranges, fast scores, and device latency.",
    },
    sections: {
      ko: [
        {
          heading: "일반적인 해석",
          body: "단순 시각 반응속도는 보통 200~300ms 사이에서 많이 나타납니다. 200ms 안팎이면 빠른 편이고, 180ms 아래는 매우 날카로운 기록으로 볼 수 있습니다. 다만 한 번의 결과보다 5회 평균과 최근 기록 흐름을 함께 보는 것이 더 공정합니다.",
        },
        {
          heading: "장비가 결과를 바꾸는 이유",
          body: "모니터 주사율, 화면 응답속도, 마우스나 터치 입력 지연, 브라우저 부하가 모두 ms 단위 결과에 영향을 줍니다. 같은 사람도 PC, 모바일, 노트북 터치패드에서 서로 다른 기록이 나올 수 있습니다.",
        },
        {
          heading: "Testier에서 보는 방법",
          body: "테스티어는 단발 기록보다 평균 기록, 최고/최저 기록, 최근 기록 그래프를 함께 보여줍니다. 티어는 재미있게 비교하기 위한 참고 지표이며, 절대적인 실력 인증이 아닙니다.",
        },
      ],
      en: [
        {
          heading: "Common interpretation",
          body: "Simple visual reaction results often land around 200-300ms. Around 200ms is fast, and below 180ms is very sharp. A 5-round average and recent trend are more useful than a single lucky attempt.",
        },
        {
          heading: "Why hardware changes results",
          body: "Refresh rate, display response, mouse or touch latency, and browser load can all affect millisecond scores. The same person may score differently on a desktop, phone, or trackpad.",
        },
        {
          heading: "How to read Testier results",
          body: "Testier shows averages, best and worst attempts, and recent score trends. Tiers are a friendly comparison tool, not an official certification of ability.",
        },
      ],
    },
  },
  {
    slug: "pro-gamer-reaction-time",
    title: { ko: "프로게이머 반응속도 150ms는 진짜 평균일까?", en: "Is 150ms Really the Average Pro Gamer Reaction Time?" },
    description: {
      ko: "프로게이머급 반응속도라는 표현을 과장 없이 읽는 방법과 실제 게임 실력의 다른 요소를 설명합니다.",
      en: "Understand pro-gamer reaction claims without hype and learn why game skill is more than raw milliseconds.",
    },
    sections: {
      ko: [
        {
          heading: "150ms는 매우 빠른 기록",
          body: "150ms 전후의 단순 반응속도는 일반적인 온라인 테스트에서 최상위권에 가까운 기록입니다. 그래서 '프로게이머 평균'처럼 단정하기보다는 '프로게이머급으로 자주 언급되는 빠른 구간'으로 보는 편이 안전합니다.",
        },
        {
          heading: "게임 실력은 반응속도만이 아닙니다",
          body: "실제 게임에서는 화면 읽기, 예측, 위치 선정, 손 이동, 조준 안정성, 의사결정이 함께 작동합니다. 단순 클릭 반응속도가 빨라도 잘못 읽으면 실전 결과는 달라질 수 있습니다.",
        },
        {
          heading: "비교할 때의 기준",
          body: "같은 기기, 같은 브라우저, 같은 입력장치에서 여러 번 측정한 평균을 비교하세요. 모바일 결과와 고주사율 PC 결과를 같은 조건처럼 비교하면 오해가 생길 수 있습니다.",
        },
      ],
      en: [
        {
          heading: "150ms is extremely fast",
          body: "A simple reaction result around 150ms is close to top-tier territory in many online tests. It is safer to read it as a commonly discussed pro-level range, not a guaranteed pro-gamer average.",
        },
        {
          heading: "Game skill is not only reaction time",
          body: "Real gameplay also depends on screen reading, prediction, positioning, hand movement, aim stability, and decision-making. A fast click does not automatically create better in-game choices.",
        },
        {
          heading: "How to compare fairly",
          body: "Compare averages measured on the same device, browser, and input method. Mixing mobile scores with high-refresh desktop scores can create misleading conclusions.",
        },
      ],
    },
  },
  {
    slug: "refresh-rate-input-lag",
    title: { ko: "모니터 주사율과 입력 지연이 결과에 주는 영향", en: "How Refresh Rate and Input Lag Affect Scores" },
    description: {
      ko: "60Hz, 144Hz, 240Hz 환경과 마우스/터치 입력 지연이 반응속도 테스트에 어떤 차이를 만드는지 설명합니다.",
      en: "See how 60Hz, 144Hz, 240Hz displays and input devices can change reaction test results.",
    },
    sections: {
      ko: [
        {
          heading: "프레임 간격의 차이",
          body: "60Hz 화면은 새 프레임이 약 16.7ms마다 표시되고, 144Hz는 약 6.9ms, 240Hz는 약 4.2ms마다 표시됩니다. 테스트 신호가 어느 프레임에 나타나는지에 따라 작은 차이가 생길 수 있습니다.",
        },
        {
          heading: "입력장치 지연",
          body: "유선 마우스, 무선 마우스, 노트북 터치패드, 모바일 터치는 입력 처리 방식이 다릅니다. 특히 터치는 브라우저와 기기 설정에 따라 반응이 늦게 기록될 수 있습니다.",
        },
        {
          heading: "공정한 측정 팁",
          body: "백그라운드 앱을 줄이고, 같은 브라우저 탭에서 반복 측정하고, 전원 절약 모드를 끄고, TV보다는 모니터를 사용하는 편이 안정적인 결과에 도움이 됩니다.",
        },
      ],
      en: [
        {
          heading: "Frame interval differences",
          body: "A 60Hz display refreshes about every 16.7ms, 144Hz about every 6.9ms, and 240Hz about every 4.2ms. The frame that displays the signal can slightly shift the measured result.",
        },
        {
          heading: "Input device latency",
          body: "Wired mice, wireless mice, trackpads, and mobile touchscreens handle input differently. Touch input can be recorded later depending on browser and device behavior.",
        },
        {
          heading: "Fair testing tips",
          body: "Close background apps, repeat tests in the same browser tab, turn off battery saver, and prefer a monitor over a TV for more stable results.",
        },
      ],
    },
  },
  {
    slug: "f1-start-vs-reaction-test",
    title: { ko: "F1 스타트 반응과 일반 반응속도의 차이", en: "F1 Start Reaction vs Simple Reaction Tests" },
    description: {
      ko: "5개 빨간불을 기다리는 F1 스타트 방식이 일반 색상 변화 테스트와 왜 다르게 느껴지는지 정리했습니다.",
      en: "Understand why a five-light F1-style start feels different from a simple color-change reaction test.",
    },
    sections: {
      ko: [
        {
          heading: "예측을 참는 테스트",
          body: "F1 스타트 방식은 빨간불이 순서대로 켜지기 때문에 사용자가 타이밍을 예측하고 싶어집니다. 그래서 단순 반응뿐 아니라 조기 출발을 참는 능력도 중요합니다.",
        },
        {
          heading: "긴장감과 반응",
          body: "신호가 언제 나올지 모르는 상태에서 기다리면 긴장이 올라가고, 너무 긴장하면 오히려 늦거나 빨리 누를 수 있습니다. 안정적인 자세와 호흡이 기록에 영향을 줍니다.",
        },
        {
          heading: "결과 해석",
          body: "F1 테스트 결과는 일반 반응속도보다 흔들릴 수 있습니다. 여러 번 측정해 평균과 조기 출발 빈도를 같이 확인하는 것이 좋습니다.",
        },
      ],
      en: [
        {
          heading: "A test of resisting prediction",
          body: "The F1-style start turns lights on in sequence, which tempts you to guess the release. It measures not only reaction speed but also your ability to avoid a false start.",
        },
        {
          heading: "Tension and response",
          body: "Waiting for an uncertain signal raises tension. Too much tension can make you late or cause an early press, so posture and breathing matter.",
        },
        {
          heading: "Reading the result",
          body: "F1-style results can vary more than simple reaction tests. Repeat the test and look at averages together with false-start frequency.",
        },
      ],
    },
  },
  {
    slug: "improve-reaction-time",
    title: { ko: "반응속도를 더 안정적으로 측정하고 개선하는 방법", en: "How to Measure and Improve Reaction Time More Reliably" },
    description: {
      ko: "반응속도 기록을 안정적으로 측정하고 개인 기록을 개선할 때 도움이 되는 간단한 루틴을 소개합니다.",
      en: "Use a simple routine to measure reaction time more consistently and improve personal bests.",
    },
    sections: {
      ko: [
        {
          heading: "측정 전 준비",
          body: "손을 입력장치 가까이에 두고, 화면 밝기를 편하게 맞추고, 알림과 백그라운드 작업을 줄이세요. 피곤하거나 산만한 상태에서는 기록 변동이 커집니다.",
        },
        {
          heading: "연습 방법",
          body: "단순 반응속도, 선택 반응속도, 주변시 반응, Go/No-Go를 번갈아 해보세요. 빠르게 누르는 능력과 정확히 판단하는 능력을 따로 연습하면 결과 해석이 쉬워집니다.",
        },
        {
          heading: "기록을 읽는 법",
          body: "최고 기록 하나보다 최근 기록 그래프의 방향을 보세요. 평균이 조금씩 내려가고 편차가 줄어들면 실제로 안정성이 좋아지고 있다는 신호입니다.",
        },
      ],
      en: [
        {
          heading: "Before measuring",
          body: "Keep your hand near the input device, set comfortable brightness, and reduce notifications or background tasks. Fatigue and distraction increase score variance.",
        },
        {
          heading: "Practice routine",
          body: "Rotate simple reaction, choice reaction, peripheral reaction, and Go/No-Go tests. Training speed and decision accuracy separately makes your results easier to interpret.",
        },
        {
          heading: "How to read progress",
          body: "Look at the recent trend, not only one personal best. If your average improves and variance shrinks, your consistency is improving.",
        },
      ],
    },
  },
  {
    slug: "improve-cps-click-speed",
    title: { ko: "CPS(초당 클릭 수)를 안전하게 높이는 방법", en: "How to Improve Your CPS (Clicks Per Second) Safely" },
    description: {
      ko: "CPS 테스트 점수를 올리는 클릭 방법과 손목 부담을 줄이는 주의사항, 짧은 모드와 긴 모드의 차이를 설명합니다.",
      en: "Learn clicking techniques that raise CPS scores, how to avoid wrist strain, and how short and long modes differ.",
    },
    sections: {
      ko: [
        {
          heading: "클릭 방식의 차이",
          body: "일반 클릭은 보통 초당 6~8회 정도이며, 지터 클릭이나 버터플라이 클릭 같은 기법은 더 높은 수치를 만들 수 있습니다. 다만 이런 기법은 손목과 손가락에 무리를 줄 수 있으므로 무리하지 않는 범위에서 시도하세요.",
        },
        {
          heading: "짧은 모드와 긴 모드",
          body: "1초나 5초처럼 짧은 모드는 순간 폭발력이 중요하고, 30초나 60초처럼 긴 모드는 일정한 리듬과 지구력이 더 중요합니다. 목표에 맞는 모드를 골라 연습하면 기록 향상이 더 잘 보입니다.",
        },
        {
          heading: "부상 없이 연습하기",
          body: "통증이 느껴지면 즉시 멈추고 휴식하세요. 마우스 위치를 바꾸거나 손목 받침을 사용하는 것도 도움이 됩니다. CPS는 재미를 위한 지표이므로 건강을 해치면서까지 기록을 올릴 필요는 없습니다.",
        },
      ],
      en: [
        {
          heading: "Different clicking styles",
          body: "Normal clicking is often around 6-8 clicks per second, while techniques like jitter or butterfly clicking can push higher numbers. These techniques can strain your wrist and fingers, so only try them within a comfortable range.",
        },
        {
          heading: "Short modes vs long modes",
          body: "Short modes like 1 or 5 seconds reward burst speed, while longer modes like 30 or 60 seconds reward steady rhythm and endurance. Practicing the mode that matches your goal makes progress easier to see.",
        },
        {
          heading: "Practice without injury",
          body: "Stop and rest immediately if you feel pain. Changing your mouse position or using a wrist rest can help. CPS is a fun metric, so there is no need to chase records at the cost of your health.",
        },
      ],
    },
  },
  {
    slug: "improve-typing-speed",
    title: { ko: "타자 속도(WPM)와 정확도를 함께 높이는 법", en: "How to Improve Typing Speed (WPM) and Accuracy Together" },
    description: {
      ko: "WPM의 의미, 정확도가 속도보다 먼저인 이유, 그리고 꾸준히 타자 속도를 올리는 연습 루틴을 정리했습니다.",
      en: "Understand what WPM means, why accuracy comes before speed, and a routine that steadily raises typing speed.",
    },
    sections: {
      ko: [
        {
          heading: "WPM은 무엇을 뜻하나요",
          body: "WPM은 분당 단어 수로, 보통 5글자를 한 단어로 환산해 계산합니다. 따라서 같은 글자 수라도 오타 수정에 시간을 많이 쓰면 WPM이 떨어집니다. 속도와 정확도는 함께 묶여 있는 지표입니다.",
        },
        {
          heading: "정확도가 먼저인 이유",
          body: "오타가 많으면 지우고 다시 치는 시간이 늘어나 결국 전체 속도가 느려집니다. 처음에는 조금 느리더라도 정확하게 치는 습관을 들이고, 정확도가 안정되면 속도를 점차 올리는 편이 효율적입니다.",
        },
        {
          heading: "연습 루틴",
          body: "손가락을 홈 포지션에 두고, 화면의 문장을 한두 단어 앞서 읽으며, 30초·60초·120초 모드를 번갈아 연습하세요. 같은 문장을 반복하기보다 다양한 문장을 입력하면 실제 타자 능력이 더 고르게 향상됩니다.",
        },
      ],
      en: [
        {
          heading: "What WPM means",
          body: "WPM is words per minute, usually calculated by treating five characters as one word. So even with the same number of characters, spending time fixing typos lowers your WPM. Speed and accuracy are linked.",
        },
        {
          heading: "Why accuracy comes first",
          body: "Many typos mean more time deleting and retyping, which slows your overall speed. It is more efficient to build accurate habits first, even if slightly slower, then raise speed once accuracy is stable.",
        },
        {
          heading: "A practice routine",
          body: "Keep your fingers on the home row, read one or two words ahead, and rotate the 30, 60, and 120 second modes. Typing varied passages instead of repeating the same one improves real typing ability more evenly.",
        },
      ],
    },
  },
  {
    slug: "memory-and-focus-training",
    title: { ko: "기억력·집중력 테스트를 훈련에 활용하는 법", en: "Using Memory and Focus Tests for Training" },
    description: {
      ko: "숫자·시각·순서 기억력 테스트와 집중력 테스트를 단순 점수 이상으로 활용하는 방법과 한계를 설명합니다.",
      en: "How to use number, visual, sequence memory tests and focus tests as more than a single score, and their limits.",
    },
    sections: {
      ko: [
        {
          heading: "묶어서 기억하기(청킹)",
          body: "숫자나 순서를 외울 때 2~3개씩 묶어 기억하는 청킹 기법은 작업 기억의 부담을 줄여줍니다. 시각 기억 테스트에서는 위치를 모양이나 패턴으로 묶어 기억하면 더 오래 버틸 수 있습니다.",
        },
        {
          heading: "집중력과 반응 억제",
          body: "색상 매칭이나 Go/No-Go 같은 테스트는 빠르게 반응하는 능력뿐 아니라 눌러야 할 때와 참아야 할 때를 구분하는 억제력을 함께 봅니다. 오답을 줄이는 연습이 단순히 빠른 손보다 더 중요할 수 있습니다.",
        },
        {
          heading: "결과 해석의 한계",
          body: "이 테스트들은 재미와 자기 점검을 위한 참고 지표이며, 의학적·심리학적 진단이 아닙니다. 컨디션, 수면, 주변 환경에 따라 결과가 크게 달라질 수 있으므로 한 번의 점수보다 흐름을 보세요.",
        },
      ],
      en: [
        {
          heading: "Chunking to remember more",
          body: "Grouping digits or steps into sets of two or three, called chunking, reduces the load on working memory. In visual memory tests, remembering positions as shapes or patterns helps you last longer.",
        },
        {
          heading: "Focus and response inhibition",
          body: "Tests like color matching or Go/No-Go measure not only fast responses but also the inhibition to tell when to press and when to hold back. Reducing wrong answers can matter more than a fast hand.",
        },
        {
          heading: "Limits of interpretation",
          body: "These tests are reference indicators for fun and self-checking, not medical or psychological diagnoses. Results vary with condition, sleep, and environment, so watch the trend rather than a single score.",
        },
      ],
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
