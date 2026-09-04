import { AREAS, AREA_ORDER, CONSTRUCT_LABELS } from "./areas";
import { QUESTIONS } from "./questions";
import type { AnswerValue, Answers, AreaId, ConstructId, Question } from "./types";

export type ReadinessCategory = "strong" | "developing" | "explore" | "priority";

export interface CategoryMeta {
  id: ReadinessCategory;
  label: string;
  statement: string;
}

export const CATEGORY_META: Record<ReadinessCategory, CategoryMeta> = {
  strong: {
    id: "strong",
    label: "Strong Foundation",
    statement:
      "Your responses suggest a strong foundation in this area. You appear to have developed perspectives and attitudes that can support a healthy marriage.",
  },
  developing: {
    id: "developing",
    label: "Developing Foundation",
    statement:
      "You appear to have a good foundation in this area, while still having opportunities to develop greater clarity, intentionality, or practical preparation.",
  },
  explore: {
    id: "explore",
    label: "Area to Explore",
    statement:
      "Your responses suggest that this area deserves more intentional reflection before marriage.",
  },
  priority: {
    id: "priority",
    label: "Priority Preparation",
    statement:
      "Your responses suggest that this area may require significant attention and preparation. This does not mean you cannot have a successful marriage; it identifies an area where intentional growth could be particularly valuable.",
  },
};

export const categoryFor = (score: number): ReadinessCategory =>
  score >= 80 ? "strong" : score >= 60 ? "developing" : score >= 40 ? "explore" : "priority";

export const QUESTION_MAP: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

/** Numeric 0-100 readiness value for one answered question, or null if unscored. */
export function questionScore(question: Question, answer: AnswerValue | undefined): number | null {
  if (answer === undefined || question.insightOnly || question.type === "open") return null;

  if (question.type === "likert") {
    const v = typeof answer === "number" ? answer : Number(answer);
    if (!Number.isFinite(v) || v < 1 || v > 5) return null;
    if (question.likertMap) return question.likertMap[v - 1] ?? null;
    const base = (v - 1) * 25;
    return question.reverse ? 100 - base : base;
  }

  if (question.type === "multi") return null;

  const chosen = question.options?.find((o) => o.key === answer);
  if (!chosen || chosen.score === undefined) return null;
  return chosen.score;
}

const weightedAverage = (entries: Array<{ score: number; weight: number }>): number | null => {
  if (!entries.length) return null;
  const total = entries.reduce((s, e) => s + e.weight, 0);
  return Math.round(entries.reduce((s, e) => s + e.score * e.weight, 0) / total);
};

export interface AreaResult {
  id: AreaId;
  name: string;
  score: number;
  category: ReadinessCategory;
}

export interface IndicatorResult {
  id: ConstructId;
  label: string;
  score: number;
  level: "Strong" | "Developing" | "Needs Attention";
}

export interface BlindSpot {
  id: string;
  heading: string;
  body: string;
  reflection: string;
}

export interface Report {
  areas: AreaResult[];
  areasByScore: AreaResult[];
  indicators: IndicatorResult[];
  overall: number;
  overallHeadline: { title: string; statement: string };
  blindSpots: BlindSpot[];
  strengths: AreaResult[];
  toExplore: AreaResult[];
  narrative: string;
  priorities: string[];
  discussionQuestions: Array<{ area: string; question: string }>;
  plan: Array<{ week: string; title: string; items: string[] }>;
  answeredCount: number;
}

function scoredEntries(answers: Answers, filter: (q: Question) => boolean) {
  const entries: Array<{ score: number; weight: number }> = [];
  for (const q of QUESTIONS) {
    if (!filter(q)) continue;
    const s = questionScore(q, answers[q.id]);
    if (s === null) continue;
    entries.push({ score: s, weight: q.weight ?? 1 });
  }
  return entries;
}

const likert = (answers: Answers, id: string): number | null => {
  const v = answers[id];
  return typeof v === "number" ? v : null;
};

const choice = (answers: Answers, id: string): string | null => {
  const v = answers[id];
  return typeof v === "string" ? v : null;
};

function buildBlindSpots(answers: Answers): BlindSpot[] {
  const spots: BlindSpot[] = [];
  const q55 = choice(answers, "Q55");
  const q59 = likert(answers, "Q59");
  const q77 = choice(answers, "Q77");

  const lowWillingness =
    (q55 !== null && ["A", "B", "C"].includes(q55)) || (q59 !== null && q59 <= 3);
  if (q77 === "D" && lowWillingness) {
    spots.push({
      id: "compromise",
      heading: "Something worth exploring",
      body: "You value compromise in principle, but some of your responses suggest that adapting your own preferences may become difficult when the issue is personally important to you.",
      reflection: "What kinds of things would be hardest for you to compromise on?",
    });
  }

  const q3 = likert(answers, "Q3");
  const q6 = choice(answers, "Q6");
  const q14 = likert(answers, "Q14");
  const q60 = choice(answers, "Q60");
  const spouseSolution =
    (q3 !== null && q3 === 5) || q6 === "B" || q60 === "D" || (q14 !== null && q14 >= 4);
  if (spouseSolution) {
    spots.push({
      id: "spouse-solution",
      heading: "Your expectation to explore",
      body: "A spouse can support your growth, but marriage cannot carry responsibility for becoming the solution to every personal need.",
      reflection: "Which of my needs am I quietly expecting marriage to solve?",
    });
  }

  const q18 = choice(answers, "Q18");
  const q21 = likert(answers, "Q21");
  const q22 = choice(answers, "Q22");
  const q19 = choice(answers, "Q19");
  const familyAuthority =
    q18 === "A" || (q21 !== null && q21 >= 4) || q22 === "A" || q19 === "A" || q19 === "D";
  if (familyAuthority) {
    spots.push({
      id: "family-boundaries",
      heading: "A conversation you should have before marriage",
      body: "Several responses point toward significant outside authority in marital decisions. Extended family boundaries are among the most common sources of early marital strain.",
      reflection: "What role should our families have in our decisions once we are married?",
    });
  }

  const q26 = choice(answers, "Q26");
  const q27 = choice(answers, "Q27");
  if (q26 === "A" || q27 === "A" || q27 === "D") {
    spots.push({
      id: "money-power",
      heading: "Financial expectation to explore",
      body: "Your responses associate higher income with greater decision-making authority. That link tends to surface later as a question of respect rather than a question of money.",
      reflection: "How will you separate financial contribution from decision-making authority?",
    });
  }

  const q73 = likert(answers, "Q73");
  const q74 = choice(answers, "Q74");
  const q75 = choice(answers, "Q75");
  const q61 = choice(answers, "Q61");
  const unhealthyInstinct =
    ["B", "C", "E"].includes(q74 ?? "") ||
    ["A", "B", "D"].includes(q75 ?? "") ||
    ["B", "D"].includes(q61 ?? "");
  if (q73 !== null && q73 >= 4 && unhealthyInstinct) {
    spots.push({
      id: "conflict",
      heading: "Conflict pattern to explore",
      body: "You appear to value healthy conflict resolution, but some of your instinctive responses suggest that difficult conversations may be challenging when emotions are high.",
      reflection: "What is my very first instinct in the ten minutes after I feel hurt?",
    });
  }

  const q10 = choice(answers, "Q10");
  const q12 = choice(answers, "Q12");
  if ((q14 !== null && q14 >= 4) || q10 === "A" || ["A", "B"].includes(q12 ?? "")) {
    spots.push({
      id: "intimacy",
      heading: "Intimacy expectation to explore",
      body: "Marriage can provide a context for intimacy, but it does not automatically resolve personal insecurity, communication difficulties, or differences in desire.",
      reflection: "Who could help me work through what I find hard to talk about?",
    });
  }

  const q41 = choice(answers, "Q41");
  const q43 = choice(answers, "Q43");
  const q47 = choice(answers, "Q47");
  if (["D", "E"].includes(q41 ?? "") && (["A", "C", "D"].includes(q43 ?? "") || ["A", "B"].includes(q47 ?? ""))) {
    spots.push({
      id: "children",
      heading: "Family planning conversation",
      body: "Your desire for children appears important. Before marriage, explore what happens if the path to parenthood looks different from what you currently imagine.",
      reflection: "What would we do if biological children were not possible for us?",
    });
  }

  return spots.slice(0, 5);
}

const INDICATOR_LEVEL = (score: number): IndicatorResult["level"] =>
  score >= 75 ? "Strong" : score >= 55 ? "Developing" : "Needs Attention";

export function buildReport(answers: Answers): Report {
  const areas: AreaResult[] = AREA_ORDER.map((id) => {
    const score = weightedAverage(scoredEntries(answers, (q) => q.area === id)) ?? 0;
    return { id, name: AREAS[id].name, score, category: categoryFor(score) };
  });

  const indicators: IndicatorResult[] = (
    Object.keys(CONSTRUCT_LABELS) as ConstructId[]
  ).map((id) => {
    const score =
      weightedAverage(scoredEntries(answers, (q) => (q.constructs ?? []).includes(id))) ?? 0;
    return { id, label: CONSTRUCT_LABELS[id], score, level: INDICATOR_LEVEL(score) };
  });

  const overall = Math.round(areas.reduce((s, a) => s + a.score, 0) / areas.length);

  const overallHeadline =
    overall >= 80
      ? {
          title: "Your foundation is strong",
          statement:
            "You appear to have developed strong foundations in several areas important to marriage.",
        }
      : overall >= 60
        ? {
            title: "Your foundation is developing",
            statement:
              "You demonstrate promising foundations, with several areas where additional preparation could strengthen your readiness.",
          }
        : overall >= 40
          ? {
              title: "Your preparation deserves attention",
              statement:
                "Your responses identify several areas worth intentionally exploring before marriage.",
            }
          : {
              title: "Your next season of growth",
              statement:
                "Marriage preparation is not about becoming perfect. It is about becoming more self-aware, more intentional, and more prepared to build with another person.",
            };

  const areasByScore = [...areas].sort((a, b) => b.score - a.score);
  const strengths = areasByScore.slice(0, 3);
  const toExplore = [...areasByScore].reverse().slice(0, 3);

  const strongestIndicator = [...indicators].sort((a, b) => b.score - a.score)[0]!;
  const weakestIndicator = [...indicators].sort((a, b) => a.score - b.score)[0]!;

  const narrative = [
    `Your responses suggest that you see marriage primarily as ${
      indicators.find((i) => i.id === "partnershipMindset")!.score >= 70
        ? "a partnership built through shared purpose, mutual responsibility, and joint decision-making"
        : "a relationship that will meet important personal needs, with shared responsibility still coming into focus"
    }.`,
    `You appear particularly strong in ${strengths[0]!.name.toLowerCase()}${
      strengths[1] ? ` and ${strengths[1].name.toLowerCase()}` : ""
    }, and your clearest cross-cutting capacity is ${strongestIndicator.label.toLowerCase()}.`,
    `However, you may need to explore your expectations around ${toExplore
      .map((a) => a.name.toLowerCase())
      .join(", ")} before marriage, and ${weakestIndicator.label.toLowerCase()} is the capacity most likely to be tested first.`,
    `Nothing here is a verdict. It is a description of what you would currently be bringing into a shared life.`,
  ].join(" ");

  const priorities = [
    ...toExplore.map((a) => AREAS[a.id].preparationPriority),
    ...areasByScore.slice(3, 7).map((a) => AREAS[a.id].preparationPriority),
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 5);

  const lower = [...areasByScore].reverse();
  const discussionQuestions: Array<{ area: string; question: string }> = [];
  for (const a of lower) {
    discussionQuestions.push({ area: AREAS[a.id].name, question: AREAS[a.id].discussionQuestion });
  }
  for (const a of lower) {
    if (discussionQuestions.length >= 10) break;
    const extra = AREAS[a.id].reflectionQuestions[0];
    if (extra) discussionQuestions.push({ area: AREAS[a.id].name, question: extra });
  }

  const plan = [
    {
      week: "Week 1",
      title: "Know yourself",
      items: [
        "Name your expectations of marriage in writing, without editing them.",
        "Name your fears about marriage honestly.",
        `Write down your strengths — starting with ${strengths[0]!.name.toLowerCase()}.`,
        "Identify your three most reliable emotional triggers.",
        "List one assumption about marriage you inherited and never questioned.",
      ],
    },
    {
      week: "Week 2",
      title: "Examine your expectations",
      items: [
        "Answer: what do I expect a spouse to provide?",
        "Answer: what do I expect marriage to change about my life?",
        "Answer: what responsibilities do I expect to share?",
        `Review your expectations in ${toExplore[0]!.name.toLowerCase()} specifically.`,
      ],
    },
    {
      week: "Week 3",
      title: "Build relational skills",
      items: [
        "Practise listening without preparing your reply.",
        "Have one difficult conversation you have been avoiding.",
        "Practise an apology with no explanation attached.",
        "Say one respectful boundary sentence out loud until it feels normal.",
        "Notice your body when emotion rises, and name what you feel.",
      ],
    },
    {
      week: "Week 4",
      title: "Prepare for agreement",
      items: [
        `Choose three areas to discuss with someone you are considering marrying — start with ${toExplore
          .map((a) => a.name.toLowerCase())
          .join(", ")}.`,
        "Write the ten questions from this report in your own words.",
        "Decide who you would ask for help if a conversation goes badly.",
      ],
    },
  ];

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;

  return {
    areas,
    areasByScore,
    indicators,
    overall,
    overallHeadline,
    blindSpots: buildBlindSpots(answers),
    strengths,
    toExplore,
    narrative,
    priorities,
    discussionQuestions: discussionQuestions.slice(0, 10),
    plan,
    answeredCount,
  };
}

export const scoreGradient = (category: ReadinessCategory): string =>
  category === "strong"
    ? "var(--gradient-strong)"
    : category === "developing"
      ? "var(--gradient-developing)"
      : category === "explore"
        ? "var(--gradient-developing)"
        : "var(--gradient-priority)";
