export type AreaId =
  | "god"
  | "intimacy"
  | "thirdParty"
  | "money"
  | "location"
  | "children"
  | "vision"
  | "growth"
  | "faith"
  | "conflict";

export type ConstructId =
  | "selfAwareness"
  | "expectationRealism"
  | "partnershipMindset"
  | "relationalCapacity"
  | "growthReadiness";

export type QuestionType = "likert" | "choice" | "scenario" | "multi" | "open";

export interface AnswerOption {
  /** Stable option key (A, B, C...) used for blind-spot rules. */
  key: string;
  label: string;
  /** 0-100 readiness weight for this option. Omitted for unscored questions. */
  score?: number;
}

export interface Question {
  id: string;
  area: AreaId;
  type: QuestionType;
  text: string;
  /** Optional short framing line shown under the question. */
  helper?: string;
  options?: AnswerOption[];
  /** Custom 1-5 mapping for Likert items where "more" is not simply "better". */
  likertMap?: [number, number, number, number, number];
  reverse?: boolean;
  /** Excluded from area/indicator maths; kept for insight and reflection. */
  insightOnly?: boolean;
  constructs?: ConstructId[];
  weight?: number;
  /** Randomize option order at render time. */
  randomize?: boolean;
  reflectionPrompt?: string;
  active?: boolean;
}

export type AnswerValue = number | string | string[];

export type Answers = Record<string, AnswerValue>;

export interface AreaDefinition {
  id: AreaId;
  index: number;
  name: string;
  description: string;
  measures: string;
  healthyReadiness: string;
  strength: string;
  growth: string;
  priority: string;
  reflectionQuestions: string[];
  exercises: string[];
  biblicalReflection: string;
  resources: string[];
  discussionQuestion: string;
  preparationPriority: string;
}
