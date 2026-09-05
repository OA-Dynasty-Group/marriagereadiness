import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { ReportView } from "@/components/assessment/ReportView";
import { AREAS, AREA_ORDER } from "@/lib/assessment/areas";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/assessment/questions";
import { buildReport, CATEGORY_META } from "@/lib/assessment/scoring";
import type { AnswerValue, Answers } from "@/lib/assessment/types";

const STORAGE_KEY = "smrap.progress.v1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Singles Marriage Readiness Assessment Profile" },
      {
        name: "description",
        content:
          "An 80-question marriage preparation instrument across 10 areas. See your readiness profile, blind spots, and a 30-day preparation plan.",
      },
      { property: "og:title", content: "Singles Marriage Readiness Assessment Profile" },
      {
        property: "og:description",
        content:
          "Explore the mindset, expectations, values, and relational capacities you are bringing toward marriage. A preparation tool, not a verdict.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "intro" | "assessment" | "report";

function Index() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Answers; index?: number; phase?: Phase };
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.index === "number") setIndex(parsed.index);
        if (parsed.phase) setPhase(parsed.phase);
      }
    } catch {
      /* ignore malformed local state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, phase }));
  }, [answers, index, phase, hydrated]);

  const question = QUESTIONS[index]!;
  const progress = Math.round(((phase === "report" ? TOTAL_QUESTIONS : index) / TOTAL_QUESTIONS) * 100);
  const report = useMemo(() => (phase === "report" ? buildReport(answers) : null), [phase, answers]);
  const answeredCount = Object.keys(answers).length;

  const setAnswer = (value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

  const next = () => {
    if (index + 1 >= TOTAL_QUESTIONS) {
      setPhase("report");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setPhase("intro");
    window.localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden text-stone-700">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -left-20 -top-24 size-[36rem] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.512 0.033 133 / 22%), transparent 62%)" }}
        />
        <div
          className="absolute right-[-10rem] top-1/3 size-[40rem] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.639 0.093 60 / 18%), transparent 60%)" }}
        />
        <div
          className="absolute bottom-[-12rem] left-1/4 size-[38rem] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.451 0.121 32 / 10%), transparent 60%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-[10px] bg-stone-800/90 shadow-[inset_0_1px_0_oklch(1_0_0/12%)]">
              <span className="font-serif text-lg text-stone-100">S</span>
            </div>
            <div className="leading-tight">
              <p className="font-serif text-base text-stone-800">Singles Marriage Readiness</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
                Assessment Profile
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-[13px] font-medium text-stone-500 sm:flex">
            <a href="#instrument" className="text-stone-800">
              Instrument
            </a>
            <a href="#how-it-works">How it works</a>
            <a href="#the-report">The report</a>
            <a href="#disclaimer">Disclaimer</a>
          </nav>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-stone-800/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-100">
            {TOTAL_QUESTIONS} questions
          </span>
          <span className="rounded-full border border-stone-300/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">
            10 areas
          </span>
          <span className="rounded-full border border-stone-300/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">
            ~25 min
          </span>
        </div>

        <div id="instrument" className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <section className="glass rounded-[20px] p-7 shadow-[var(--shadow-panel)] sm:p-9 lg:col-span-5">
            <p className="eyebrow mb-5 text-oxblood">The question</p>
            <h1 className="max-w-[22ch] font-serif text-[2.1rem] leading-[1.05] text-stone-900 sm:text-[2.6rem]">
              What kind of person are you preparing to be in marriage?
            </h1>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-stone-500">
              A measured, faith-informed instrument that maps the mindset, expectations, and
              relational capacities you are bringing — not a verdict on whether you should marry.
            </p>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                <span>Progress</span>
                <span className="text-stone-600">
                  {phase === "report"
                    ? "Profile complete"
                    : `Question ${Math.min(index + 1, TOTAL_QUESTIONS)} of ${TOTAL_QUESTIONS}`}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200/80">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${progress}%`, background: "var(--gradient-progress)" }}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase("assessment");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center rounded-xl bg-oxblood px-5 py-3 text-sm font-medium text-stone-50 ring-1 ring-oxblood-700/40 transition-transform hover:-translate-y-0.5"
              >
                {phase === "intro" && answeredCount > 0
                  ? "Continue where I left off"
                  : phase === "report"
                    ? "Review my answers"
                    : "Begin the assessment"}
              </button>
              <a
                href="#the-report"
                className="inline-flex items-center rounded-xl border border-stone-300/80 bg-stone-50/50 px-5 py-3 text-sm font-medium text-stone-600 transition-transform hover:-translate-y-0.5"
              >
                {phase === "report" ? "Jump to my profile" : "See what the report contains"}
              </a>
            </div>

            <p className="mt-6 max-w-[46ch] text-[12px] leading-relaxed text-stone-400">
              Not a clinical diagnosis or guarantee of marital outcomes. It is a preparation tool for
              self-reflection and honest conversation.
            </p>
          </section>

          <section className="lg:col-span-7 lg:col-start-6">
            {phase === "assessment" ? (
              <QuestionCard
                question={question}
                index={index}
                total={TOTAL_QUESTIONS}
                answer={answers[question.id]}
                onAnswer={setAnswer}
                onBack={() => setIndex((i) => Math.max(0, i - 1))}
                onNext={next}
                canGoBack={index > 0}
                isLast={index + 1 === TOTAL_QUESTIONS}
              />
            ) : (
              <div id="how-it-works" className="glass-soft rounded-[18px] p-6 shadow-[var(--shadow-soft)] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage">
                    The ten agreement areas
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                    Scored 0–100 each
                  </span>
                </div>
                <p className="mt-5 font-serif text-xl leading-snug text-stone-800">
                  “What are you bringing into marriage, and what may need intentional development
                  before you build a life with another person?”
                </p>
                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {AREA_ORDER.map((id) => (
                    <div
                      key={id}
                      className="rounded-xl border border-stone-200/70 bg-stone-50/40 px-4 py-3"
                    >
                      <p className="text-sm font-medium text-stone-700">
                        <span className="mr-2 text-stone-400">{AREAS[id].index}</span>
                        {AREAS[id].name}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-stone-500">
                        {AREAS[id].measures}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {(["strong", "developing", "explore", "priority"] as const).map((c) => (
                    <div key={c} className="rounded-xl border border-stone-200/70 px-4 py-3">
                      <p className="eyebrow text-oxblood">{CATEGORY_META[c].label}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-stone-500">
                        {c === "strong"
                          ? "80–100"
                          : c === "developing"
                            ? "60–79"
                            : c === "explore"
                              ? "40–59"
                              : "0–39"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div id="the-report" className="relative mx-auto max-w-[1180px] px-5 pb-16 sm:px-8">
        {report ? (
          <ReportView report={report} answers={answers} onRestart={restart} />
        ) : (
          <div className="glass rounded-3xl p-7 shadow-[var(--shadow-deep)] sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200/70 pb-6">
              <div>
                <p className="eyebrow text-oxblood">What you receive</p>
                <h2 className="mt-2 max-w-[30ch] text-3xl leading-tight text-stone-900">
                  Your Marriage Readiness Profile
                </h2>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-stone-500">
                  Not a single readiness percentage. A profile: ten area scores, five cross-cutting
                  indicators, your blind spots, the conversations to have, and a 30-day plan.
                </p>
              </div>
              <span className="rounded-full bg-stone-800/90 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-100">
                Profile, not a verdict
              </span>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                {
                  label: "Five readiness indicators",
                  body: "Self-awareness, expectation realism, partnership mindset, relational capacity, and growth readiness — calculated across the whole assessment.",
                },
                {
                  label: "A blind-spot engine",
                  body: "Your answers are compared against each other, not just averaged, so contradictions between what you value and what you would instinctively do surface.",
                },
                {
                  label: "Ten conversations",
                  body: "Personalised questions to discuss before marriage, drawn from the areas where your responses suggest the least clarity.",
                },
                {
                  label: "A 30-day preparation plan",
                  body: "Know yourself, examine your expectations, build relational skills, then prepare for agreement with another person.",
                },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-stone-200/80 bg-stone-50/40 p-6">
                  <p className="eyebrow text-stone-400">{c.label}</p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl bg-stone-800/95 p-8 text-center shadow-[inset_0_1px_0_oklch(1_0_0/12%)] sm:p-12">
              <p className="mx-auto max-w-[24ch] font-serif text-2xl leading-tight text-stone-100 sm:text-[2.1rem]">
                Before you build with someone else, build within yourself.
              </p>
              <p className="mx-auto mt-5 max-w-[54ch] text-sm leading-relaxed text-stone-300">
                You don't need to have everything figured out before marriage. But you do need the
                humility to recognize what you don't know, the courage to examine what you believe,
                and the willingness to grow.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPhase("assessment");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center rounded-xl bg-oxblood px-6 py-3 text-sm font-medium text-stone-50 ring-1 ring-oxblood-700/40 transition-transform hover:-translate-y-0.5"
                >
                  Begin the assessment
                </button>
              </div>
            </div>

            <p id="disclaimer" className="mt-8 text-[12px] leading-relaxed text-stone-500">
              This assessment is designed for self-reflection, relationship education, and marriage
              preparation. It is not a clinical psychological assessment, diagnosis, or guarantee of
              marital outcomes. Your results are intended to identify areas for reflection and
              growth, not to determine whether you should or should not marry. If serious
              relational, emotional, safety, abuse, or mental-health concerns arise, please seek
              support from a licensed professional.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
