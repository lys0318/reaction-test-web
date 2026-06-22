import type { Locale } from "./locales";

export type Category =
  | "reaction"
  | "gamer"
  | "memory"
  | "focus"
  | "typing";

export type LocalizedText = Record<Locale, string>;

export type FAQItem = {
  question: string;
  answer: string;
};

export type TestDefinition = {
  slug: string;
  category: Category;
  difficulty: LocalizedText;
  duration: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  faq: Record<Locale, FAQItem[]>;
  keywords: string[];
  higherIsBetter: boolean;
  scoreType: "reaction" | "cps" | "accuracy" | "wpm" | "memory" | "score";
  tips: Record<Locale, string[]>;
};

export const categoryLabels: Record<Category, LocalizedText> = {
  reaction: { ko: "반응속도 테스트", en: "Reaction Tests" },
  gamer: { ko: "게이머 속도 테스트", en: "Gamer Speed Tests" },
  memory: { ko: "기억력 테스트", en: "Memory Tests" },
  focus: { ko: "집중력 테스트", en: "Focus Tests" },
  typing: { ko: "타자 테스트", en: "Typing Tests" },
};

const commonFaq = {
  ko: [
    {
      question: "기록은 어디에 저장되나요?",
      answer: "최고 기록과 최근 기록은 현재 브라우저의 localStorage에 저장됩니다. 리더보드에 등록한 경우에만 입력한 닉네임과 점수가 서버에 저장됩니다.",
    },
    {
      question: "모바일에서도 사용할 수 있나요?",
      answer: "네. 터치 입력을 고려해 모바일에서도 플레이할 수 있게 구성했습니다.",
    },
  ],
  en: [
    {
      question: "Where are my records stored?",
      answer: "Best and recent scores are stored in your browser localStorage. Only when you submit to the leaderboard are the nickname and score you enter saved on a server.",
    },
    {
      question: "Does it work on mobile?",
      answer: "Yes. The tests are built with touch input and mobile layouts in mind.",
    },
  ],
};

function faq(koQuestion: string, koAnswer: string, enQuestion: string, enAnswer: string) {
  return {
    ko: [{ question: koQuestion, answer: koAnswer }, ...commonFaq.ko],
    en: [{ question: enQuestion, answer: enAnswer }, ...commonFaq.en],
  };
}

export const tests: TestDefinition[] = [
  {
    slug: "reaction-time",
    category: "reaction",
    difficulty: { ko: "쉬움", en: "Easy" },
    duration: { ko: "약 1분", en: "About 1 min" },
    title: { ko: "반응속도 테스트", en: "Reaction Time Test" },
    description: {
      ko: "화면 색상이 바뀌는 순간 최대한 빠르게 클릭하거나 터치해 반응속도를 측정합니다.",
      en: "Click or tap as soon as the screen changes color to measure your reaction time.",
    },
    seoTitle: { ko: "반응속도 테스트 - 무료 온라인 ms 측정", en: "Reaction Time Test - Free Online Reflex Test" },
    seoDescription: {
      ko: "5라운드 반응속도 테스트로 평균, 최고, 최저 기록과 티어를 확인하세요.",
      en: "Measure your reflexes across 5 rounds and review average, best, worst, and tier results.",
    },
    faq: faq(
      "좋은 반응속도는 몇 ms인가요?",
      "대체로 200ms 안팎이면 빠른 편이고, 180ms 이하면 매우 좋은 기록으로 볼 수 있습니다.",
      "What is a good reaction time?",
      "Around 200ms is fast for many users, and below 180ms is an excellent result."
    ),
    keywords: ["reaction time", "reflex test", "반응속도", "ms test"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["손가락을 버튼 가까이에 두세요.", "화면을 응시하되 조급하게 누르지 마세요.", "조기 클릭은 기록을 망칩니다."],
      en: ["Keep your finger close to the input area.", "Focus on the screen without guessing.", "Avoid early clicks."],
    },
  },
  {
    slug: "f1-race-start",
    category: "reaction",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "약 30초", en: "About 30 sec" },
    title: { ko: "F1 레이스 스타트 반응속도 테스트", en: "F1 Race Start Reaction Test" },
    description: {
      ko: "5개의 빨간불이 모두 켜진 뒤 레이스 스타트 신호가 나오면 최대한 빠르게 화면을 눌러 반응속도를 측정합니다.",
      en: "Wait for all five red lights, then tap as soon as the race start signal appears.",
    },
    seoTitle: { ko: "F1 레이스 스타트 반응속도 테스트 - 빨간불 출발 반응 측정", en: "F1 Race Start Reaction Test - Five Lights Reflex Test" },
    seoDescription: {
      ko: "F1 스타트처럼 5개의 빨간불을 기다린 뒤 출발 신호에 반응하는 온라인 반응속도 테스트입니다.",
      en: "An online reaction test inspired by F1 race starts: wait for five red lights and react to the start signal.",
    },
    faq: faq(
      "빨간불이 켜지는 동안 누르면 어떻게 되나요?",
      "레이스 스타트 신호 전에 누르면 조기 출발로 처리됩니다. 다시 시작해서 정확한 출발 신호를 기다려야 합니다.",
      "What happens if I click while the red lights are on?",
      "Clicking before the race start signal counts as a false start. Restart and wait for the exact start signal."
    ),
    keywords: ["f1 reaction test", "race start", "five lights", "F1 스타트", "반응속도"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["빨간불 개수를 세되 마지막 신호를 예측해 누르지 마세요.", "손가락을 화면 가까이에 두고 긴장을 줄이세요.", "조기 출발보다 안정적인 첫 반응이 더 중요합니다."],
      en: ["Count the lights, but do not guess the final signal.", "Keep your finger close and stay relaxed.", "A clean start matters more than a guessed tap."],
    },
  },
  {
    slug: "audio-reaction",
    category: "reaction",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "약 1분", en: "About 1 min" },
    title: { ko: "소리 반응속도 테스트", en: "Audio Reaction Test" },
    description: {
      ko: "화면 변화가 아니라 삐 소리를 듣고 누르는 청각 반응속도 테스트입니다.",
      en: "Measure auditory reaction time by pressing when you hear a beep instead of watching a color change.",
    },
    seoTitle: { ko: "소리 반응속도 테스트 - 청각 반응 ms 측정", en: "Audio Reaction Test - Auditory Reflex in ms" },
    seoDescription: {
      ko: "5회 평균으로 소리 신호에 반응하는 속도를 측정하고 시각 반응속도와 비교해 보세요.",
      en: "Measure your 5-round average response to a sound cue and compare it with visual reaction tests.",
    },
    faq: faq(
      "소리 반응속도와 화면 반응속도는 다른가요?",
      "네. 청각 신호, 스피커/이어폰 지연, 브라우저 오디오 처리 방식이 결과에 영향을 줄 수 있습니다.",
      "Is audio reaction different from visual reaction?",
      "Yes. Audio cues, speaker or headphone latency, and browser audio handling can affect the result."
    ),
    keywords: ["audio reaction", "sound reaction test", "청각 반응속도", "소리 반응"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["이어폰이나 스피커 볼륨을 적당히 맞추세요.", "화면보다 소리에 집중하세요.", "소리가 나기 전 예측 클릭을 피하세요."],
      en: ["Set a comfortable speaker or headphone volume.", "Focus on the sound, not the screen.", "Avoid guessing before the beep."],
    },
  },
  {
    slug: "choice-reaction",
    category: "reaction",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "10라운드", en: "10 rounds" },
    title: { ko: "선택 반응속도 테스트", en: "Choice Reaction Test" },
    description: {
      ko: "표시된 방향에 맞는 버튼이나 방향키를 눌러 판단 속도와 반응속도를 함께 측정합니다.",
      en: "Press the matching arrow button or key to measure decision speed and reaction time together.",
    },
    seoTitle: { ko: "선택 반응속도 테스트 - 방향키 판단 반응 측정", en: "Choice Reaction Test - Decision Reflex Test" },
    seoDescription: {
      ko: "위, 아래, 왼쪽, 오른쪽 방향을 보고 알맞은 키를 누르는 10라운드 선택 반응속도 테스트입니다.",
      en: "A 10-round choice reaction test where you respond to up, down, left, and right cues.",
    },
    faq: faq(
      "단순 반응속도보다 왜 느리게 나오나요?",
      "방향을 판단하고 맞는 입력을 선택해야 해서 단순 클릭 테스트보다 시간이 더 걸릴 수 있습니다.",
      "Why is this slower than simple reaction time?",
      "You must identify the direction and choose the correct input, so it can be slower than a simple click test."
    ),
    keywords: ["choice reaction", "decision reaction", "direction reaction", "선택 반응속도"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["방향키에 손을 미리 올려두세요.", "화살표 모양을 읽고 바로 같은 방향을 누르세요.", "오답을 줄이는 것이 평균 기록에 중요합니다."],
      en: ["Rest your hand near the arrow keys.", "Read the arrow shape and press the same direction.", "Reducing wrong inputs matters for your average."],
    },
  },
  {
    slug: "peripheral-reaction",
    category: "reaction",
    difficulty: { ko: "어려움", en: "Hard" },
    duration: { ko: "8라운드", en: "8 rounds" },
    title: { ko: "주변시 반응속도 테스트", en: "Peripheral Reaction Test" },
    description: {
      ko: "중앙을 바라보다가 화면 가장자리에 나타나는 신호를 빠르게 눌러 주변시 반응을 측정합니다.",
      en: "Watch the center, then react to signals appearing near the screen edges.",
    },
    seoTitle: { ko: "주변시 반응속도 테스트 - 화면 가장자리 신호 감지", en: "Peripheral Reaction Test - Edge Signal Reflex" },
    seoDescription: {
      ko: "게임과 운전 상황처럼 중앙을 보면서 주변 신호를 감지하는 반응속도를 테스트하세요.",
      en: "Test how quickly you detect edge signals while focusing on the center, similar to games and driving contexts.",
    },
    faq: faq(
      "주변시 테스트는 무엇을 보나요?",
      "중앙에 시선을 둔 상태에서 가장자리 신호를 감지하는 능력과 반응속도를 참고용으로 확인합니다.",
      "What does the peripheral test measure?",
      "It checks how quickly you notice edge signals while keeping your eyes near the center."
    ),
    keywords: ["peripheral vision", "edge reaction", "주변시", "반응속도"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["중앙 점을 보면서 화면 전체의 변화를 느껴보세요.", "눈을 크게 움직이기보다 주변 움직임을 감지하세요.", "모바일에서는 화면을 너무 가까이 보지 마세요."],
      en: ["Watch the center dot while sensing the full screen.", "Detect movement with peripheral vision instead of chasing it with your eyes.", "On mobile, avoid holding the screen too close."],
    },
  },
  {
    slug: "fps-reaction",
    category: "gamer",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "약 1분", en: "About 1 min" },
    title: { ko: "FPS 반응속도 테스트", en: "FPS Reaction Test" },
    description: {
      ko: "랜덤하게 나타나는 타깃을 빠르게 클릭해 게이머식 반응속도를 측정합니다.",
      en: "Click random targets as quickly as possible to measure gamer-style reaction speed.",
    },
    seoTitle: { ko: "FPS 반응속도 테스트 - 게이머 타깃 클릭 테스트", en: "FPS Reaction Test - Gamer Target Click Test" },
    seoDescription: {
      ko: "타깃 등장 후 클릭까지 걸리는 시간을 5라운드로 측정하고 티어를 확인하세요.",
      en: "Measure target acquisition speed across 5 rounds and get a gamer tier.",
    },
    faq: faq(
      "FPS 실력과 직접 관련이 있나요?",
      "마우스 반응과 집중력 참고용 지표지만 실제 게임 실력 전체를 의미하지는 않습니다.",
      "Does this directly measure FPS skill?",
      "It is a useful reference for mouse reaction and focus, but it does not represent your full game skill."
    ),
    keywords: ["fps reaction", "gamer test", "target click"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["마우스 감도를 편한 상태로 맞추세요.", "타깃 주변을 넓게 보세요.", "미스 클릭보다 정확한 첫 클릭이 중요합니다."],
      en: ["Use a comfortable mouse sensitivity.", "Scan around the target area.", "A clean first click beats random spam."],
    },
  },
  {
    slug: "aim",
    category: "gamer",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "30초", en: "30 sec" },
    title: { ko: "에임 테스트", en: "Aim Test" },
    description: {
      ko: "랜덤 위치에 나타나는 원형 타깃을 맞춰 조준 정확도와 속도를 측정합니다.",
      en: "Hit circular targets at random positions to measure aim accuracy and speed.",
    },
    seoTitle: { ko: "에임 테스트 - 온라인 조준 정확도 측정", en: "Aim Test - Online Aim Accuracy Trainer" },
    seoDescription: {
      ko: "30초 동안 명중, 실수, 정확도, 평균 타깃 클릭 시간을 측정하세요.",
      en: "Measure hits, misses, accuracy, and average target click time over 30 seconds.",
    },
    faq: faq(
      "에임 테스트에서 중요한 점은 무엇인가요?",
      "높은 명중 수와 낮은 실수 수의 균형이 중요합니다.",
      "What matters in the aim test?",
      "The balance between high hits and low misses matters most."
    ),
    keywords: ["aim test", "accuracy test", "에임"],
    higherIsBetter: true,
    scoreType: "score",
    tips: {
      ko: ["빠르게 움직이되 손목에 힘을 빼세요.", "화면 중앙만 보지 말고 전체를 스캔하세요.", "실수 클릭을 줄이면 점수가 크게 오릅니다."],
      en: ["Move quickly but keep your wrist relaxed.", "Scan the full area, not only the center.", "Reducing misses boosts your score fast."],
    },
  },
  {
    slug: "aim-trainer-30",
    category: "gamer",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "30타깃", en: "30 targets" },
    title: { ko: "30타깃 에임 트레이너", en: "30 Target Aim Trainer" },
    description: {
      ko: "30개의 타깃을 순서대로 맞추고 타깃당 평균 클릭 시간을 측정합니다.",
      en: "Hit 30 targets in sequence and measure your average click time per target.",
    },
    seoTitle: { ko: "30타깃 에임 트레이너 - 타깃당 평균 시간 측정", en: "30 Target Aim Trainer - Average Time Per Target" },
    seoDescription: {
      ko: "30개 타깃을 얼마나 빠르고 안정적으로 맞히는지 평균 반응 시간과 최고 기록으로 확인하세요.",
      en: "Measure how quickly and consistently you hit 30 targets with average time and fastest hit stats.",
    },
    faq: faq(
      "일반 에임 테스트와 무엇이 다른가요?",
      "시간 제한 점수보다 30개 타깃을 모두 맞히는 동안의 평균 타깃 획득 속도에 집중합니다.",
      "How is this different from the regular aim test?",
      "It focuses on average target acquisition time across 30 required targets rather than a timed score."
    ),
    keywords: ["aim trainer", "30 targets", "target click", "에임 트레이너"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["타깃 중심을 정확히 누르세요.", "손목을 급하게 꺾기보다 일정한 이동 리듬을 유지하세요.", "마우스와 터치 입력 결과는 따로 비교하세요."],
      en: ["Click the target center precisely.", "Keep a steady movement rhythm instead of snapping wildly.", "Compare mouse and touch results separately."],
    },
  },
  {
    slug: "cps",
    category: "gamer",
    difficulty: { ko: "쉬움", en: "Easy" },
    duration: { ko: "1/5/10/30/60초", en: "1/5/10/30/60 sec" },
    title: { ko: "CPS 테스트", en: "CPS Test" },
    description: {
      ko: "정해진 시간 동안 클릭 또는 터치 횟수를 세어 초당 클릭 수를 계산합니다.",
      en: "Count clicks or taps during a selected duration and calculate clicks per second.",
    },
    seoTitle: { ko: "CPS 테스트 - 초당 클릭 수 측정", en: "CPS Test - Clicks Per Second" },
    seoDescription: {
      ko: "1초, 5초, 10초, 30초, 60초 CPS 테스트로 클릭 속도와 최고 기록을 확인하세요.",
      en: "Check your click speed and best score with 1, 5, 10, 30, or 60 second CPS tests.",
    },
    faq: faq(
      "테스트 시작 전 클릭도 포함되나요?",
      "아니요. 시작 버튼을 누른 뒤 테스트 영역에서 발생한 클릭만 기록됩니다.",
      "Do clicks before the test count?",
      "No. Only clicks inside the test area after the start are counted."
    ),
    keywords: ["cps", "click speed", "clicks per second"],
    higherIsBetter: true,
    scoreType: "cps",
    tips: {
      ko: ["손가락과 손목에 과한 힘을 주지 마세요.", "짧은 시간은 폭발력, 긴 시간은 리듬이 중요합니다.", "모바일에서는 두드리는 위치를 고정하세요."],
      en: ["Avoid over-tensing your hand.", "Short tests reward burst speed; long tests reward rhythm.", "On mobile, keep your tap point stable."],
    },
  },
  {
    slug: "spacebar-counter",
    category: "gamer",
    difficulty: { ko: "쉬움", en: "Easy" },
    duration: { ko: "5/10/30초", en: "5/10/30 sec" },
    title: { ko: "스페이스바 카운터", en: "Spacebar Counter" },
    description: {
      ko: "스페이스바를 얼마나 빠르게 누를 수 있는지 초당 입력 수로 측정합니다.",
      en: "Measure how quickly you can press the spacebar as inputs per second.",
    },
    seoTitle: { ko: "스페이스바 카운터 - 스페이스바 속도 테스트", en: "Spacebar Counter - Spacebar Speed Test" },
    seoDescription: {
      ko: "스페이스바 입력 횟수와 초당 입력 수를 측정하고 최고 기록을 저장하세요.",
      en: "Measure total spacebar inputs, inputs per second, and save your best record.",
    },
    faq: faq(
      "모바일에서는 어떻게 하나요?",
      "모바일에서는 화면의 큰 탭 버튼으로 같은 방식의 입력 속도를 측정할 수 있습니다.",
      "How does it work on mobile?",
      "On mobile, use the large tap button to measure the same input-speed style."
    ),
    keywords: ["spacebar counter", "keyboard speed", "스페이스바"],
    higherIsBetter: true,
    scoreType: "cps",
    tips: {
      ko: ["키 중앙을 일정하게 누르세요.", "팔 전체보다 손가락 리듬을 사용하세요.", "긴 테스트에서는 속도를 일정하게 유지하세요."],
      en: ["Press the center of the key consistently.", "Use finger rhythm more than arm force.", "Keep a steady pace in longer tests."],
    },
  },
  {
    slug: "keyboard-reaction",
    category: "reaction",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "10라운드", en: "10 rounds" },
    title: { ko: "키보드 반응속도 테스트", en: "Keyboard Reaction Test" },
    description: {
      ko: "화면에 나타난 알파벳 키를 빠르게 입력해 키보드 반응속도를 측정합니다.",
      en: "Type the displayed letter as quickly as possible to measure keyboard reaction time.",
    },
    seoTitle: { ko: "키보드 반응속도 테스트 - 알파벳 입력 반응 측정", en: "Keyboard Reaction Test - Letter Reflex Test" },
    seoDescription: {
      ko: "10라운드 동안 평균 반응속도, 정답, 오답, 정확도를 확인하세요.",
      en: "Check average reaction time, correct answers, wrong answers, and accuracy over 10 rounds.",
    },
    faq: faq(
      "키보드 배열에 영향을 받나요?",
      "네. 익숙한 키보드와 배열을 사용할수록 더 안정적인 기록이 나옵니다.",
      "Does keyboard layout matter?",
      "Yes. A familiar keyboard and layout usually produce more stable results."
    ),
    keywords: ["keyboard reaction", "typing reflex", "keyboard test"],
    higherIsBetter: false,
    scoreType: "reaction",
    tips: {
      ko: ["양손을 홈 포지션에 두세요.", "표시된 글자를 소리 내어 읽지 말고 바로 누르세요.", "오답보다 정확한 입력이 중요합니다."],
      en: ["Keep both hands near home position.", "Press directly without subvocalizing the letter.", "Accuracy matters more than frantic speed."],
    },
  },
  {
    slug: "number-memory",
    category: "memory",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "가변", en: "Variable" },
    title: { ko: "숫자 기억력 테스트", en: "Number Memory Test" },
    description: {
      ko: "잠깐 나타난 숫자를 기억해 입력하고, 정답이면 자리 수가 증가합니다.",
      en: "Memorize a briefly displayed number and type it back as the length increases.",
    },
    seoTitle: { ko: "숫자 기억력 테스트 - 온라인 숫자 암기 게임", en: "Number Memory Test - Online Digit Memory Game" },
    seoDescription: {
      ko: "3자리 숫자부터 시작해 기억 가능한 최고 레벨을 확인하세요.",
      en: "Start from 3 digits and find the highest level you can remember.",
    },
    faq: faq(
      "숫자가 너무 빨리 사라지나요?",
      "레벨이 올라갈수록 도전성이 커지지만 초반에는 충분히 볼 수 있게 표시됩니다.",
      "Does the number disappear too quickly?",
      "Early levels give enough viewing time, while higher levels become more challenging."
    ),
    keywords: ["number memory", "digit memory", "memory test"],
    higherIsBetter: true,
    scoreType: "memory",
    tips: {
      ko: ["숫자를 2~3개 단위로 묶어 기억하세요.", "입력 전에 머릿속에서 한 번 재생하세요.", "긴 숫자는 리듬으로 외우면 도움이 됩니다."],
      en: ["Chunk digits into groups of 2 or 3.", "Replay the number mentally before typing.", "Rhythm helps with longer sequences."],
    },
  },
  {
    slug: "visual-memory",
    category: "memory",
    difficulty: { ko: "어려움", en: "Hard" },
    duration: { ko: "가변", en: "Variable" },
    title: { ko: "시각 기억력 테스트", en: "Visual Memory Test" },
    description: {
      ko: "격자에서 잠깐 빛난 타일 위치를 기억해 다시 선택합니다.",
      en: "Remember highlighted tiles on a grid and select them again.",
    },
    seoTitle: { ko: "시각 기억력 테스트 - 타일 위치 기억 게임", en: "Visual Memory Test - Tile Memory Game" },
    seoDescription: {
      ko: "3x3 격자부터 시작해 레벨이 올라갈수록 어려워지는 시각 기억 테스트입니다.",
      en: "Start with a 3x3 grid and progress through harder visual memory levels.",
    },
    faq: faq(
      "선택 순서도 중요한가요?",
      "이 테스트는 위치 기억이 핵심이라 순서보다 정확한 타일 선택이 중요합니다.",
      "Does selection order matter?",
      "This test focuses on position memory, so selecting the correct tiles matters most."
    ),
    keywords: ["visual memory", "tile memory", "grid memory"],
    higherIsBetter: true,
    scoreType: "memory",
    tips: {
      ko: ["타일을 모양으로 묶어 기억하세요.", "모서리와 중앙을 기준점으로 삼으세요.", "선택 전 전체 패턴을 떠올리세요."],
      en: ["Remember tiles as shapes or clusters.", "Use corners and center as anchors.", "Recall the full pattern before selecting."],
    },
  },
  {
    slug: "color-match",
    category: "focus",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "30초", en: "30 sec" },
    title: { ko: "색상 매칭 테스트", en: "Color Match Test" },
    description: {
      ko: "단어 의미와 실제 글자 색상이 일치하는지 빠르게 판단하는 집중력 테스트입니다.",
      en: "Quickly judge whether a color word matches the actual text color.",
    },
    seoTitle: { ko: "색상 매칭 테스트 - 집중력 Stroop 테스트", en: "Color Match Test - Focus Stroop Test" },
    seoDescription: {
      ko: "30초 동안 일치/불일치를 판단하며 정답 수, 오답 수, 정확도를 확인하세요.",
      en: "Judge match/no match for 30 seconds and review correct answers, mistakes, and accuracy.",
    },
    faq: faq(
      "왜 헷갈리나요?",
      "단어의 의미와 색상 정보가 동시에 들어와 집중과 억제 능력을 요구하기 때문입니다.",
      "Why is it confusing?",
      "The word meaning and visual color compete, requiring focus and inhibition."
    ),
    keywords: ["color match", "stroop test", "focus test"],
    higherIsBetter: true,
    scoreType: "score",
    tips: {
      ko: ["단어를 읽기보다 글자 색을 먼저 보세요.", "버튼 위치를 외워 판단 시간을 줄이세요.", "틀린 직후에도 리듬을 유지하세요."],
      en: ["Look at the text color before reading the word.", "Learn the button positions to decide faster.", "Keep your rhythm after mistakes."],
    },
  },
  {
    slug: "go-no-go",
    category: "focus",
    difficulty: { ko: "어려움", en: "Hard" },
    duration: { ko: "20라운드", en: "20 rounds" },
    title: { ko: "Go/No-Go 집중력 테스트", en: "Go/No-Go Focus Test" },
    description: {
      ko: "눌러야 하는 신호와 참아야 하는 신호를 구분해 반응 억제력과 집중력을 측정합니다.",
      en: "Separate signals you should press from signals you must ignore to test focus and response inhibition.",
    },
    seoTitle: { ko: "Go/No-Go 집중력 테스트 - 반응 억제력 측정", en: "Go/No-Go Focus Test - Response Inhibition" },
    seoDescription: {
      ko: "GO 신호에서는 빠르게 누르고 NO-GO 신호에서는 참으며 정반응, 오경보, 놓침을 확인하세요.",
      en: "Press on GO, hold back on NO-GO, and review hits, false alarms, misses, and accuracy.",
    },
    faq: faq(
      "반응속도 테스트와 무엇이 다른가요?",
      "빠르게 누르는 능력뿐 아니라 누르지 말아야 할 때 참는 억제력을 함께 봅니다.",
      "How is this different from a reaction time test?",
      "It checks not only fast pressing, but also your ability to hold back when you should not press."
    ),
    keywords: ["go no go", "focus test", "response inhibition", "집중력 테스트"],
    higherIsBetter: true,
    scoreType: "accuracy",
    tips: {
      ko: ["GO와 NO-GO 문구를 끝까지 확인하세요.", "빠른 손보다 오경보를 줄이는 것이 중요합니다.", "리듬을 예측하지 말고 신호를 보고 반응하세요."],
      en: ["Read the GO or NO-GO cue fully.", "Reducing false alarms matters more than frantic speed.", "React to the cue instead of predicting the rhythm."],
    },
  },
  {
    slug: "focus",
    category: "focus",
    difficulty: { ko: "어려움", en: "Hard" },
    duration: { ko: "30초", en: "30 sec" },
    title: { ko: "집중력 테스트", en: "Focus Test" },
    description: {
      ko: "여러 도형 중 지정된 타깃만 골라 클릭하며 집중력과 정확도를 측정합니다.",
      en: "Click only the requested targets among many symbols to measure focus and accuracy.",
    },
    seoTitle: { ko: "집중력 테스트 - 온라인 타깃 선택 테스트", en: "Focus Test - Online Target Selection Test" },
    seoDescription: {
      ko: "30초 동안 정답 클릭, 오답 클릭, 정확도와 집중력 티어를 확인하세요.",
      en: "Measure correct clicks, wrong clicks, accuracy, and focus tier over 30 seconds.",
    },
    faq: faq(
      "시간이 지날수록 어려워지나요?",
      "네. 남은 시간이 줄어들수록 더 많은 선택지가 나타납니다.",
      "Does it get harder over time?",
      "Yes. More choices appear as time runs down."
    ),
    keywords: ["focus test", "attention test", "concentration"],
    higherIsBetter: true,
    scoreType: "score",
    tips: {
      ko: ["타깃 모양과 색을 동시에 기억하세요.", "서두르기보다 오답을 줄이세요.", "화면 전체를 일정한 순서로 훑으세요."],
      en: ["Remember both target shape and color.", "Reduce wrong clicks before chasing speed.", "Scan the area in a consistent order."],
    },
  },
  {
    slug: "typing-speed",
    category: "typing",
    difficulty: { ko: "보통", en: "Medium" },
    duration: { ko: "30/60/120초", en: "30/60/120 sec" },
    title: { ko: "타자 속도 테스트", en: "Typing Speed Test" },
    description: {
      ko: "짧은 문장을 입력해 WPM과 정확도를 측정합니다.",
      en: "Type a short passage to measure WPM and accuracy.",
    },
    seoTitle: { ko: "타자 속도 테스트 - WPM 정확도 측정", en: "Typing Speed Test - WPM and Accuracy" },
    seoDescription: {
      ko: "30초, 60초, 120초 모드와 한국어/영어 문장 샘플로 타자 속도, 정확도, 최고 WPM을 확인하세요.",
      en: "Measure typing speed, accuracy, and best WPM with 30, 60, and 120 second modes.",
    },
    faq: faq(
      "한국어 WPM은 어떻게 계산하나요?",
      "입력 글자 수를 기준으로 표준 5글자 단어 단위로 환산해 참고용 WPM을 계산합니다.",
      "How is WPM calculated?",
      "WPM is estimated using the standard 5-character word unit for a practical reference score."
    ),
    keywords: ["typing speed", "wpm", "타자 속도"],
    higherIsBetter: true,
    scoreType: "wpm",
    tips: {
      ko: ["정확도를 먼저 유지하세요.", "문장을 단어 단위로 미리 읽으세요.", "오타 수정 시간을 줄이는 것이 WPM에 중요합니다."],
      en: ["Protect accuracy first.", "Read ahead word by word.", "Reducing correction time matters for WPM."],
    },
  },
  {
    slug: "sequence-memory",
    category: "memory",
    difficulty: { ko: "어려움", en: "Hard" },
    duration: { ko: "가변", en: "Variable" },
    title: { ko: "순서 기억력 테스트", en: "Sequence Memory Test" },
    description: {
      ko: "색상 버튼이 빛나는 순서를 기억하고 같은 순서로 따라 누릅니다.",
      en: "Remember the order of flashing color buttons and repeat the same sequence.",
    },
    seoTitle: { ko: "순서 기억력 테스트 - Simon 방식 기억 게임", en: "Sequence Memory Test - Simon Memory Game" },
    seoDescription: {
      ko: "색상 버튼 순서를 따라 하며 기억력 최고 레벨을 측정하세요.",
      en: "Repeat color button sequences and measure your highest memory level.",
    },
    faq: faq(
      "순서가 길어지면 어떻게 외우나요?",
      "색상 이름보다 위치와 리듬을 함께 기억하면 더 오래 버틸 수 있습니다.",
      "How do I remember longer sequences?",
      "Remember positions and rhythm together rather than only color names."
    ),
    keywords: ["sequence memory", "simon game", "memory game"],
    higherIsBetter: true,
    scoreType: "memory",
    tips: {
      ko: ["색상보다 위치 리듬을 기억하세요.", "입력 중에는 다음 순서를 생각하지 마세요.", "짧은 묶음으로 나누면 길어진 순서도 쉬워집니다."],
      en: ["Remember position rhythm more than color names.", "Do not think ahead while entering.", "Break long sequences into small chunks."],
    },
  },
];

export function getTest(slug: string): TestDefinition | undefined {
  return tests.find((test) => test.slug === slug);
}

export function getTestsByCategory(category: Category): TestDefinition[] {
  return tests.filter((test) => test.category === category);
}
