import { AREAS } from "@/lib/assessment/areas";
import { CONSTRUCT_DESCRIPTIONS } from "@/lib/assessment/areas";
import { CATEGORY_META, scoreGradient, type Report } from "@/lib/assessment/scoring";
import { QUESTIONS } from "@/lib/assessment/questions";
import type { Answers } from "@/lib/assessment/types";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="eyebrow mb-5 text-stone-400">{children}</p>
);

function ScoreBar({ label, score, gradient }: { label: string; score: number; gradient: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className="font-serif text-lg text-stone-800">{score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200/80">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: gradient }} />
      </div>
    </div>
  );
}

function IndicatorPips({
  label,
  score,
  level,
}: {
  label: string;
  score: number;
  level: string;
}) {
  const filled = Math.max(1, Math.round(score / 20));
  const tone =
    level === "Strong" ? "bg-sage" : level === "Developing" ? "bg-clay" : "bg-oxblood";
  const text =
    level === "Strong" ? "text-sage" : level === "Developing" ? "text-clay" : "text-oxblood";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className={`text-sm font-semibold ${text}`}>{level}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < filled ? tone : "bg-stone-200"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-stone-400">
        {CONSTRUCT_DESCRIPTIONS[label === "Self-Awareness" ? "selfAwareness" : label === "Expectation Realism" ? "expectationRealism" : label === "Partnership Mindset" ? "partnershipMindset" : label === "Relational Capacity" ? "relationalCapacity" : "growthReadiness"]}
      </p>
    </div>
  );
}

export function ReportView({
  report,
  answers,
  onRestart,
}: {
  report: Report;
  answers: Answers;
  onRestart: () => void;
}) {
  const openReflections = QUESTIONS.filter(
    (q) => q.type === "open" && typeof answers[q.id] === "string" && (answers[q.id] as string).trim(),
  );

  return (
    <div className="glass rounded-3xl p-7 shadow-[var(--shadow-deep)] sm:p-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200/70 pb-6">
        <div>
          <p className="eyebrow text-oxblood">Final report</p>
          <h2 className="mt-2 max-w-[30ch] text-3xl leading-tight text-stone-900">
            Your Marriage Readiness Profile
          </h2>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-stone-500">
            This assessment is not a verdict. It is a snapshot of the mindset, expectations, and
            relational capacities you are bringing toward marriage.
          </p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-stone-800/90 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-100">
            {report.overallHeadline.title}
          </span>
          <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-stone-500">
            {report.overallHeadline.statement}
          </p>
        </div>
      </div>

      {/* Scores + indicators */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel>Area foundations</SectionLabel>
          <div className="space-y-4">
            {report.areasByScore.map((a) => (
              <ScoreBar
                key={a.id}
                label={a.name}
                score={a.score}
                gradient={scoreGradient(a.category)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <SectionLabel>Readiness indicators</SectionLabel>
          <div className="space-y-5">
            {report.indicators.map((i) => (
              <IndicatorPips key={i.id} label={i.label} score={i.score} level={i.level} />
            ))}
          </div>
        </div>
      </div>

      {/* Section 1 — strongest foundations */}
      <div className="mt-12 border-t border-stone-200/70 pt-8">
        <SectionLabel>Section 1 — Your strongest foundations</SectionLabel>
        <div className="grid gap-5 md:grid-cols-3">
          {report.strengths.map((a, i) => (
            <div key={a.id} className="rounded-2xl border border-stone-200/80 bg-stone-50/40 p-6">
              <p className="eyebrow text-sage">
                {i === 0 ? "Your strongest foundation" : `Strength ${i + 1}`}
              </p>
              <h3 className="mt-3 font-serif text-lg text-stone-800">{a.name}</h3>
              <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-stone-400">
                {a.score} · {CATEGORY_META[a.category].label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{AREAS[a.id].strength}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">
                <span className="font-medium text-stone-700">What it contributes: </span>
                {AREAS[a.id].measures}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                <span className="font-medium text-stone-700">How to protect it: </span>
                {AREAS[a.id].exercises[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 — areas to explore */}
      <div className="mt-12 border-t border-stone-200/70 pt-8">
        <SectionLabel>Section 2 — Areas to explore</SectionLabel>
        <div className="space-y-5">
          {report.toExplore.map((a) => (
            <div key={a.id} className="rounded-2xl border border-clay/30 bg-clay/[0.06] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-serif text-lg text-stone-800">{a.name}</h3>
                <span className="text-[12px] uppercase tracking-[0.14em] text-stone-500">
                  {a.score} · {CATEGORY_META[a.category].label}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                <span className="eyebrow mr-2 text-stone-400">What we noticed</span>
                {CATEGORY_META[a.category].statement}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                <span className="eyebrow mr-2 text-stone-400">Why it matters</span>
                {AREAS[a.id].description}
              </p>
              <div className="mt-4">
                <p className="eyebrow text-stone-400">Reflection questions</p>
                <ul className="mt-2 space-y-1.5">
                  {AREAS[a.id].reflectionQuestions.map((q) => (
                    <li key={q} className="text-sm italic leading-relaxed text-stone-600">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone-700">
                <span className="eyebrow mr-2 text-stone-400">Your next step</span>
                {AREAS[a.id].exercises[0]}
              </p>
              <p className="mt-3 text-sm italic leading-relaxed text-stone-500">
                {AREAS[a.id].biblicalReflection}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — blind spots */}
      {report.blindSpots.length > 0 && (
        <div className="mt-12 border-t border-stone-200/70 pt-8">
          <SectionLabel>Section 3 — Potential blind spots</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            {report.blindSpots.map((b) => (
              <div key={b.id} className="rounded-2xl border border-oxblood/25 bg-oxblood/[0.05] p-6">
                <p className="eyebrow text-oxblood">{b.heading}</p>
                <p className="mt-3 font-serif text-lg leading-snug text-stone-800">{b.body}</p>
                <p className="mt-4 text-sm italic leading-relaxed text-stone-500">
                  Reflect on: “{b.reflection}”
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4 — marriage mindset */}
      <div className="mt-12 border-t border-stone-200/70 pt-8">
        <SectionLabel>Section 4 — Your marriage mindset</SectionLabel>
        <p className="max-w-[70ch] font-serif text-lg leading-relaxed text-stone-700">
          {report.narrative}
        </p>
      </div>

      {/* Section 5 + 6 */}
      <div className="mt-12 grid gap-8 border-t border-stone-200/70 pt-8 lg:grid-cols-2">
        <div>
          <SectionLabel>Section 5 — Your preparation priorities</SectionLabel>
          <ol className="space-y-3">
            {report.priorities.map((p, i) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-stone-600">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-stone-800/90 text-[11px] text-stone-100">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionLabel>Section 6 — Questions to discuss before marriage</SectionLabel>
          <ol className="space-y-3">
            {report.discussionQuestions.map((q, i) => (
              <li key={`${q.area}-${i}`} className="text-sm leading-relaxed text-stone-600">
                <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {q.area}
                </span>
                <span className="italic text-stone-700">“{q.question}”</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Section 7 — 30 day plan */}
      <div id="preparation-plan" className="mt-12 border-t border-stone-200/70 pt-8">

        <SectionLabel>Section 7 — Your 30-day preparation plan</SectionLabel>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {report.plan.map((w) => (
            <div key={w.week} className="rounded-2xl border border-stone-200/80 bg-stone-50/40 p-6">
              <p className="eyebrow text-oxblood">{w.week}</p>
              <h3 className="mt-2 font-serif text-lg text-stone-800">{w.title}</h3>
              <ul className="mt-4 space-y-2">
                {w.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-stone-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Open reflections */}
      {openReflections.length > 0 && (
        <div className="mt-12 border-t border-stone-200/70 pt-8">
          <SectionLabel>Your own words</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            {openReflections.map((q) => (
              <div key={q.id} className="rounded-2xl border border-stone-200/80 bg-stone-50/40 p-6">
                <p className="text-[13px] leading-relaxed text-stone-500">{q.text}</p>
                <p className="mt-3 font-serif text-base leading-relaxed text-stone-800">
                  {answers[q.id] as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closing */}
      <div className="mt-12 rounded-3xl bg-stone-800/95 p-8 text-center shadow-[inset_0_1px_0_oklch(1_0_0/12%)] sm:p-12">
        <p className="mx-auto max-w-[24ch] font-serif text-2xl leading-tight text-stone-100 sm:text-[2.1rem]">
          Before you build with someone else, build within yourself.
        </p>
        <p className="mx-auto mt-5 max-w-[54ch] text-sm leading-relaxed text-stone-300">
          You don't need to have everything figured out before marriage. But you do need the humility
          to recognize what you don't know, the courage to examine what you believe, and the
          willingness to grow.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#preparation-plan"
            className="inline-flex items-center rounded-xl bg-oxblood px-6 py-3 text-sm font-medium text-stone-50 ring-1 ring-oxblood-700/40 transition-transform hover:-translate-y-0.5"
          >
            Explore my marriage preparation plan
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center rounded-xl border border-stone-500/60 px-6 py-3 text-sm font-medium text-stone-200 transition-transform hover:-translate-y-0.5"
          >
            Save my results
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <p className="text-[12px] leading-relaxed text-stone-500">
          This assessment is designed for self-reflection, relationship education, and marriage
          preparation. It is not a clinical psychological assessment, diagnosis, or guarantee of
          marital outcomes. Your results are intended to identify areas for reflection and growth,
          not to determine whether you should or should not marry.
        </p>
        <p className="text-[12px] leading-relaxed text-stone-500">
          If serious relational, emotional, safety, abuse, or mental-health concerns surface for you
          while reflecting, please seek support from a licensed professional or a trusted care
          provider in your area.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="text-[12px] font-medium uppercase tracking-[0.14em] text-stone-400 underline decoration-stone-300 underline-offset-4"
        >
          Start a new assessment
        </button>
      </div>
    </div>
  );
}
