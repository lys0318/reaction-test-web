import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";

type BenchmarkRow = {
  label: string;
  range: string;
  description: string;
};

const reactionRows: Record<Locale, BenchmarkRow[]> = {
  ko: [
    { label: "프로게이머급", range: "150~200ms", description: "순수 시각 반응 기준으로 매우 빠른 구간입니다. 실제 경기력은 예측, 판단, 손 움직임까지 함께 봐야 합니다." },
    { label: "상위권 게이머", range: "200~240ms", description: "대부분의 게임 상황에서 빠르게 반응하는 편입니다. 장비 지연과 컨디션에 따라 변동될 수 있습니다." },
    { label: "일반 평균권", range: "240~300ms", description: "많은 사용자가 기록하는 자연스러운 범위입니다. 반복 측정 평균을 보는 것이 좋습니다." },
    { label: "환경 점검 권장", range: "300ms+", description: "피로, 산만함, 낮은 주사율, 무선 입력 지연, 브라우저 부하가 영향을 줬을 수 있습니다." },
  ],
  en: [
    { label: "Pro gamer level", range: "150-200ms", description: "A very fast visual reaction range. Real match performance still depends on prediction, decision-making, and hand movement." },
    { label: "High-tier gamer", range: "200-240ms", description: "Fast enough for many game situations, with some variation from hardware latency and focus." },
    { label: "Common range", range: "240-300ms", description: "A natural range for many users. Repeated averages are more useful than a single run." },
    { label: "Check environment", range: "300ms+", description: "Fatigue, distraction, refresh rate, wireless input delay, or browser load may be affecting the result." },
  ],
};

const highScoreRows: Record<Locale, BenchmarkRow[]> = {
  ko: [
    { label: "챔피언권", range: "매우 높은 점수", description: "빠른 판단과 낮은 실수율이 함께 나온 기록입니다." },
    { label: "상위권", range: "높은 점수", description: "기본 속도와 정확도가 안정적인 구간입니다." },
    { label: "성장 구간", range: "중간 점수", description: "실수를 줄이고 리듬을 유지하면 빠르게 개선될 수 있습니다." },
    { label: "연습 권장", range: "낮은 점수", description: "속도보다 정확도를 먼저 잡는 것이 좋습니다." },
  ],
  en: [
    { label: "Champion range", range: "Very high score", description: "Strong speed and low error rate are working together." },
    { label: "High tier", range: "High score", description: "Speed and accuracy are both stable." },
    { label: "Growth range", range: "Mid score", description: "Reducing mistakes and keeping rhythm can improve results quickly." },
    { label: "Practice range", range: "Low score", description: "Prioritize accuracy before chasing speed." },
  ],
};

const wpmRows: Record<Locale, BenchmarkRow[]> = {
  ko: [
    { label: "빠른 타자", range: "80+ WPM", description: "실전 문서 작성이나 채팅에서도 매우 빠른 편입니다." },
    { label: "숙련자", range: "55~80 WPM", description: "정확도만 유지하면 대부분의 입력 작업에 충분히 빠릅니다." },
    { label: "평균권", range: "35~55 WPM", description: "일반적인 문장 입력에서 흔히 볼 수 있는 범위입니다." },
    { label: "기초 연습", range: "35 WPM 이하", description: "키 위치와 오타 감소를 먼저 연습하면 좋습니다." },
  ],
  en: [
    { label: "Fast typist", range: "80+ WPM", description: "Very fast for documents, chats, and daily writing." },
    { label: "Skilled", range: "55-80 WPM", description: "Fast enough for most typing tasks if accuracy stays high." },
    { label: "Common range", range: "35-55 WPM", description: "A frequent range for casual typing." },
    { label: "Practice basics", range: "Below 35 WPM", description: "Start with key familiarity and typo reduction." },
  ],
};

const memoryRows: Record<Locale, BenchmarkRow[]> = {
  ko: [
    { label: "챔피언 기억력", range: "Lv. 12+", description: "패턴화, 묶음 기억, 리듬 기억이 잘 작동하는 구간입니다." },
    { label: "상위권", range: "Lv. 8~11", description: "짧은 정보 유지 능력이 안정적인 편입니다." },
    { label: "평균권", range: "Lv. 4~7", description: "대부분의 사용자가 여러 번 시도하며 도달하는 범위입니다." },
    { label: "연습 시작", range: "Lv. 1~3", description: "숫자나 색을 작은 묶음으로 나누는 전략이 도움이 됩니다." },
  ],
  en: [
    { label: "Champion memory", range: "Lv. 12+", description: "Patterning, chunking, and rhythm memory are working well." },
    { label: "High tier", range: "Lv. 8-11", description: "Short-term retention is relatively stable." },
    { label: "Common range", range: "Lv. 4-7", description: "A range many users reach after a few attempts." },
    { label: "Practice start", range: "Lv. 1-3", description: "Chunking numbers, colors, or positions can help quickly." },
  ],
};

function rowsFor(test: TestDefinition, locale: Locale): BenchmarkRow[] {
  if (test.scoreType === "reaction") return reactionRows[locale];
  if (test.scoreType === "wpm") return wpmRows[locale];
  if (test.scoreType === "memory") return memoryRows[locale];
  return highScoreRows[locale];
}

export function TestBenchmarkGuide({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const rows = rowsFor(test, locale);
  const isReaction = test.scoreType === "reaction";

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-2xl font-black tracking-tight text-white">
        {locale === "ko" ? "프로게이머급 기준과 평균 비교" : "Benchmark ranges and gamer comparison"}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
        {isReaction
          ? locale === "ko"
            ? "반응속도는 ms 숫자가 낮을수록 빠릅니다. 프로게이머급으로 자주 언급되는 150~200ms 구간은 매우 빠른 편이지만, 실제 게임 실력은 단순 클릭 반응뿐 아니라 화면 이해도, 예측, 의사결정, 손 움직임이 함께 작용합니다."
            : "Lower milliseconds mean faster reaction. The 150-200ms range is often discussed as pro-gamer level, but real game skill also depends on reading the screen, prediction, decision-making, and hand movement."
          : locale === "ko"
            ? "아래 기준은 테스티어에서 결과를 이해하기 쉽게 만든 참고용 범위입니다. 같은 테스트를 같은 기기에서 여러 번 반복해 평균적인 흐름을 보는 것이 가장 좋습니다."
            : "These ranges are reference guides designed to make Testier results easier to understand. Repeating the same test on the same device gives the most useful trend."}
      </p>
      <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
        <div className="grid grid-cols-[1fr_0.8fr_1.6fr] bg-slate-950/80 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
          <div className="p-3">{locale === "ko" ? "구간" : "Range"}</div>
          <div className="p-3">{locale === "ko" ? "기준" : "Benchmark"}</div>
          <div className="p-3">{locale === "ko" ? "해석" : "Interpretation"}</div>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_0.8fr_1.6fr] border-t border-white/10 text-sm text-slate-300">
            <div className="p-3 font-bold text-white">{row.label}</div>
            <div className="p-3 font-mono text-cyan-100">{row.range}</div>
            <div className="p-3 leading-6">{row.description}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-300 md:grid-cols-2">
        <article>
          <h3 className="font-black text-white">{locale === "ko" ? "PC와 모바일 차이" : "PC vs mobile"}</h3>
          <p className="mt-2">
            {locale === "ko"
              ? "마우스 클릭과 모바일 터치는 입력 지연이 다를 수 있습니다. 정확한 비교를 원한다면 같은 기기, 같은 브라우저, 같은 화면 주사율에서 반복 측정하세요."
              : "Mouse clicks and mobile taps can have different input latency. For fair comparison, use the same device, browser, and refresh rate across repeated runs."}
          </p>
        </article>
        <article>
          <h3 className="font-black text-white">{locale === "ko" ? "결과가 흔들리는 이유" : "Why results vary"}</h3>
          <p className="mt-2">
            {locale === "ko"
              ? "피로, 졸림, 배터리 절약 모드, 낮은 주사율, 무선 장비 지연, 브라우저 탭 과부하가 결과에 영향을 줄 수 있습니다. 한 번의 최고 기록보다 최근 5회 기록의 흐름을 함께 보세요."
              : "Fatigue, sleepiness, battery-saving modes, low refresh rate, wireless latency, and heavy browser tabs can affect scores. Look at recent-score trends, not only a single best run."}
          </p>
        </article>
      </div>
    </section>
  );
}
