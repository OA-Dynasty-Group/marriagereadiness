import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Baby,
  Church,
  Compass,
  Heart,
  MapPin,
  MessagesSquare,
  Sprout,
  Star,
  Users,
  Wallet,
  Sparkles,
  Lock,
  Clock,
  X,
} from "lucide-react";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { ReportView } from "@/components/assessment/ReportView";
import { AREAS, AREA_ORDER } from "@/lib/assessment/areas";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/assessment/questions";
import { buildReport } from "@/lib/assessment/scoring";
import type { AnswerValue, Answers, AreaId } from "@/lib/assessment/types";
import heroImg from "@/assets/hero-reflect.png";

const STORAGE_KEY = "smrap.progress.v1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Singles Marriage Readiness Assessment Profile" },
      {
        name: "description",
        content:
          "A free 80-question marriage preparation test across 10 areas. Get your readiness profile, blind spots, and a 30-day preparation plan.",
      },
      { property: "og:title", content: "Singles Marriage Readiness Assessment Profile" },
      {
        property: "og:description",
        content:
          "Explore the mindset, expectations and relational capacities you bring toward marriage. A profile, not a verdict.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Phase = "intro" | "assessment" | "report";

const AREA_ICONS: Record<AreaId, typeof Heart> = {
  god: Sparkles,
  intimacy: Heart,
  thirdParty: Users,
  money: Wallet,
  location: MapPin,
  children: Baby,
  vision: Compass,
  growth: Sprout,
  faith: Church,
  conflict: MessagesSquare,
};

const ICON_TONES = [
  "bg-peach-soft text-clay",
  "bg-violet-soft text-oxblood",
  "bg-sage/15 text-sage",
];

const FAQ = [
  {
    q: "Is this a test of whether I should get married?",
    a: "No. It is a preparation profile. It shows what you are bringing into marriage and what may need intentional growth — never a pass or fail.",
  },
  {
    q: "How long does it take?",
    a: "About 25 minutes for 80 questions. Your progress saves automatically, so you can stop and come back.",
  },
  {
    q: "Are there right answers?",
    a: "No. Answer honestly for who you are today. Correct-sounding answers only make the profile less useful to you.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your answers stay on this device. Nothing is sent anywhere.",
  },
];

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
        if (parsed.phase === "report") setPhase("report");
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, phase }));
  }, [answers, index, phase, hydrated]);

  const question = QUESTIONS[index]!;
  const report = useMemo(() => (phase === "report" ? buildReport(answers) : null), [phase, answers]);
  const answeredCount = Object.keys(answers).length;

  const start = () => {
    setPhase("assessment");
    window.scrollTo({ top: 0 });
  };

  const next = () => {
    if (index + 1 >= TOTAL_QUESTIONS) {
      setPhase("report");
      window.scrollTo({ top: 0 });
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

  if (phase === "assessment") {
    const pct = Math.round((index / TOTAL_QUESTIONS) * 100);
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="sticky top-0 z-10 border-b border-stone-200 bg-background">
          <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
            <Logo />
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-xs font-semibold text-stone-500">
                <span>{AREAS[question.area].name}</span>
                <span>
                  {index + 1} / {TOTAL_QUESTIONS}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${pct}%`, background: "var(--gradient-progress)" }}
                />
              </div>
            </div>
            <button
              type="button"
              aria-label="Exit test"
              onClick={() => setPhase("intro")}
              className="grid size-9 place-items-center rounded-full text-stone-500 hover:bg-stone-100"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
        <main className="mx-auto max-w-2xl px-5 py-10">
          <QuestionCard
            question={question}
            index={index}
            total={TOTAL_QUESTIONS}
            answer={answers[question.id]}
            onAnswer={(v: AnswerValue) => setAnswers((p) => ({ ...p, [question.id]: v }))}
            onBack={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={next}
            canGoBack={index > 0}
            isLast={index + 1 === TOTAL_QUESTIONS}
          />
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
            <Lock className="size-3.5" /> Progress saved on this device
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-stone-700">
      <SiteHeader onStart={start} />

      {phase === "report" && report ? (
        <main className="mx-auto max-w-[1200px] px-5 py-10">
          <Breadcrumb current="Your profile" />
          <div className="mt-6">
            <ReportView report={report} answers={answers} onRestart={restart} />
          </div>
        </main>
      ) : (
        <>
          {/* Hero */}
          <section style={{ background: "var(--gradient-hero)" }}>
            <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-16">
              <div>
                <Breadcrumb current="Marriage Readiness" />
                <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-clay/30 bg-background px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-clay">
                  <span className="size-2 rounded-full bg-clay" />
                  <span className="size-2 rounded-full bg-stone-700" />
                  Marriage readiness test · free
                </span>
                <h1 className="mt-5 text-5xl leading-[1.02] text-stone-900 sm:text-6xl">
                  Singles Marriage Readiness Profile
                </h1>
                <p className="mt-5 text-2xl font-extrabold leading-snug text-clay">
                  What kind of person are you preparing to be in marriage?
                </p>
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-stone-600">
                  Discover the mindset, expectations and relational habits you are bringing toward
                  marriage — across faith, money, intimacy, family, conflict and more. A profile,
                  not a verdict.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={start}
                    className="inline-flex items-center gap-2 rounded-full bg-oxblood px-8 py-4 text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-panel)] transition-transform hover:-translate-y-0.5"
                  >
                    {answeredCount > 0 ? "Continue my test" : "Find my readiness profile"}
                    <ArrowRight className="size-5" />
                  </button>
                  <div className="text-sm leading-relaxed text-stone-500">
                    <p>No sign-up to start</p>
                    <p>
                      {TOTAL_QUESTIONS} questions · ~25 min
                    </p>
                  </div>
                </div>
                {answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-3 text-sm font-semibold text-stone-400 underline-offset-4 hover:underline"
                  >
                    Start over instead
                  </button>
                )}
                <div className="mt-6 flex items-center gap-3 text-sm text-stone-600">
                  <Stars />
                  Built on marriage-preparation research · 10 areas
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[520px]">
                <div className="absolute inset-x-8 bottom-0 top-16 rounded-t-full bg-violet-soft" />
                <img
                  src={heroImg}
                  alt="A woman sitting on a stack of books, reflecting with a journal"
                  width={1024}
                  height={1152}
                  className="relative mx-auto w-[85%]"
                />
                <FloatChip className="left-0 top-10" label="Partnership mindset" level="Strong" tone="sage" pct={82} />
                <FloatChip className="right-0 top-1/3" label="Expectation realism" level="Developing" tone="clay" pct={64} />
                <div className="absolute -bottom-4 left-2 w-64 rounded-2xl border border-stone-200 bg-background p-4 shadow-[var(--shadow-deep)] sm:left-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-400">
                      Your profile
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">
                      Example result
                    </span>
                  </div>
                  <p className="mt-2 font-extrabold text-stone-900">Developing Foundation</p>
                  <p className="text-xs font-bold text-oxblood">Strongest: Vision & Purpose</p>
                  <MiniBar label="Conflict Resolution" pct={58} tone="clay" />
                  <MiniBar label="Money" pct={78} tone="oxblood" />
                </div>
              </div>
            </div>
          </section>

          {/* Areas */}
          <section id="areas" className="bg-stone-50 py-16">
            <div className="mx-auto max-w-[1200px] px-5">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-3xl text-stone-900">What the test explores</h2>
                <span className="text-sm font-bold text-oxblood">10 areas · scored 0–100</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {AREA_ORDER.map((id, i) => {
                  const Icon = AREA_ICONS[id];
                  return (
                    <div
                      key={id}
                      className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-background p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${ICON_TONES[i % 3]}`}>
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-extrabold text-stone-900">{AREAS[id].name}</p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">{AREAS[id].measures}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="py-16">
            <div className="mx-auto max-w-[1200px] px-5">
              <h2 className="text-3xl text-stone-900">How it works</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { icon: Clock, t: "Answer 80 questions", d: "Statements, scenarios and reflections. No correct answers — just honest ones." },
                  { icon: Sparkles, t: "Get your profile", d: "Ten area scores, five readiness indicators, and blind spots where answers pull in different directions." },
                  { icon: Compass, t: "Follow your plan", d: "Priorities, ten conversations to have, and a 30-day preparation plan built from your results." },
                ].map((s, i) => (
                  <div key={s.t} className="rounded-2xl border border-stone-200 bg-background p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-violet-soft font-extrabold text-oxblood">
                        {i + 1}
                      </span>
                      <s.icon className="size-5 text-stone-400" />
                    </div>
                    <p className="mt-4 text-lg font-extrabold text-stone-900">{s.t}</p>
                    <p className="mt-1 text-stone-500">{s.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl bg-oxblood p-8 text-primary-foreground sm:flex-row sm:p-10">
                <div>
                  <p className="text-2xl font-extrabold sm:text-3xl">
                    Before you build with someone else, build within yourself.
                  </p>
                  <p className="mt-2 opacity-80">Free · private · about 25 minutes</p>
                </div>
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-7 py-3.5 font-extrabold text-oxblood transition-transform hover:-translate-y-0.5"
                >
                  Start the test <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="bg-stone-50 py-16">
            <div className="mx-auto max-w-3xl px-5">
              <h2 className="text-3xl text-stone-900">Questions people ask</h2>
              <div className="mt-6 space-y-3">
                {FAQ.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-stone-200 bg-background p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-extrabold text-stone-900">
                      {f.q}
                      <span className="text-oxblood transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-stone-500">{f.a}</p>
                  </details>
                ))}
              </div>
              <p id="disclaimer" className="mt-10 text-xs leading-relaxed text-stone-400">
                This assessment is designed for self-reflection, relationship education, and
                marriage preparation. It is not a clinical psychological assessment, diagnosis, or
                guarantee of marital outcomes. If serious relational, emotional, safety, abuse, or
                mental-health concerns arise, please seek support from a licensed professional.
              </p>
            </div>
          </section>
        </>
      )}

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 text-sm text-stone-400">
          <Logo />
          <span>A preparation tool, not a verdict.</span>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <span className="text-xl font-black tracking-tight text-stone-900">
      Ready<span className="text-oxblood">wed</span>
    </span>
  );
}

function SiteHeader({ onStart }: { onStart: () => void }) {
  return (
    <header className="border-b border-stone-200 bg-background">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-9 font-semibold text-stone-600 md:flex">
          <a href="#areas">Areas</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="#disclaimer">Disclaimer</a>
        </nav>
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-violet-soft px-5 py-2.5 font-bold text-oxblood transition-transform hover:-translate-y-0.5"
        >
          Take the test
        </button>
      </div>
    </header>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <p className="text-sm text-stone-400">
      Home / Tests / <span className="text-stone-500">{current}</span>
    </p>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5 text-clay">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </span>
  );
}

const TONE: Record<string, { bar: string; text: string }> = {
  sage: { bar: "bg-sage", text: "text-sage" },
  clay: { bar: "bg-clay", text: "text-clay" },
  oxblood: { bar: "bg-oxblood", text: "text-oxblood" },
};

function MiniBar({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs font-semibold text-stone-700">
        <span>{label}</span>
        <span className={TONE[tone]!.text}>{pct}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${TONE[tone]!.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FloatChip({
  className,
  label,
  level,
  tone,
  pct,
}: {
  className: string;
  label: string;
  level: string;
  tone: string;
  pct: number;
}) {
  return (
    <div
      className={`absolute hidden w-56 rounded-2xl border border-stone-200 bg-background px-4 py-3 shadow-[var(--shadow-soft)] sm:block ${className}`}
    >
      <div className="flex justify-between text-xs font-bold text-stone-800">
        <span>{label}</span>
        <span className={TONE[tone]!.text}>{level}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${TONE[tone]!.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
