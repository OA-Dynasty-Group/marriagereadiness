import { useMemo } from "react";
import { AREAS } from "@/lib/assessment/areas";
import { LIKERT_LABELS } from "@/lib/assessment/questions";
import type { AnswerOption, AnswerValue, Question } from "@/lib/assessment/types";

interface Props {
  question: Question;
  index: number;
  total: number;
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLast: boolean;
}

const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    h = (h * 1103515245 + 12345) % 2147483648;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

function OptionRow({
  option,
  letter,
  selected,
  onSelect,
}: {
  option: AnswerOption;
  letter: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition-transform hover:-translate-y-0.5 ${
        selected
          ? "border border-oxblood/40 bg-oxblood/[0.07] ring-1 ring-oxblood/20"
          : "border border-stone-200/70 bg-stone-50/40"
      }`}
    >
      <span
        className={`flex items-center gap-3 text-sm font-medium ${selected ? "text-stone-800" : "text-stone-600"}`}
      >
        <span
          className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] ${
            selected
              ? "bg-oxblood text-stone-50"
              : "border border-stone-300 text-stone-400"
          }`}
        >
          {letter}
        </span>
        {option.label}
      </span>
      {selected ? (
        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-oxblood">
          <span className="size-1.5 rounded-full bg-stone-50" />
        </span>
      ) : (
        <span className="size-4 shrink-0 rounded-full border border-stone-300" />
      )}
    </button>
  );
}

export function QuestionCard({
  question,
  index,
  total,
  answer,
  onAnswer,
  onBack,
  onNext,
  canGoBack,
  isLast,
}: Props) {
  const area = AREAS[question.area];

  const options = useMemo(() => {
    const list = question.options ?? [];
    return question.randomize ? seededShuffle(list, question.id) : list;
  }, [question]);

  const likertOptions: AnswerOption[] = useMemo(
    () => LIKERT_LABELS.map((label, i) => ({ key: String(i + 1), label })),
    [],
  );

  const selectedMulti = Array.isArray(answer) ? answer : [];
  const answered =
    question.type === "open"
      ? true
      : question.type === "multi"
        ? selectedMulti.length > 0
        : answer !== undefined;

  return (
    <div className="glass-soft rounded-2xl p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage">
          Area {area.index} — {area.name}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
          Question {index + 1} of {total}
        </span>
      </div>

      <h2 className="mt-5 font-serif text-xl leading-snug text-stone-800 sm:text-[1.55rem]">
        {question.text}
      </h2>
      <p className="mt-2 text-[13px] text-stone-400">
        {question.helper ?? "Choose the response that fits you most today. There are no correct answers."}
      </p>

      <div className="mt-6 space-y-2.5">
        {question.type === "likert" &&
          likertOptions.map((o, i) => (
            <OptionRow
              key={o.key}
              option={o}
              letter={String(i + 1)}
              selected={answer === i + 1}
              onSelect={() => onAnswer(i + 1)}
            />
          ))}

        {(question.type === "choice" || question.type === "scenario") &&
          options.map((o, i) => (
            <OptionRow
              key={o.key}
              option={o}
              letter={String.fromCharCode(65 + i)}
              selected={answer === o.key}
              onSelect={() => onAnswer(o.key)}
            />
          ))}

        {question.type === "multi" && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {options.map((o) => {
              const selected = selectedMulti.includes(o.key);
              return (
                <OptionRow
                  key={o.key}
                  option={o}
                  letter={selected ? "✓" : "+"}
                  selected={selected}
                  onSelect={() =>
                    onAnswer(
                      selected
                        ? selectedMulti.filter((k) => k !== o.key)
                        : [...selectedMulti, o.key],
                    )
                  }
                />
              );
            })}
          </div>
        )}

        {question.type === "open" && (
          <textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => onAnswer(e.target.value)}
            rows={5}
            placeholder="Write as much or as little as you want. This is for your reflection."
            className="w-full rounded-xl border border-stone-200/70 bg-stone-50/50 px-4 py-3 text-sm leading-relaxed text-stone-700 outline-none placeholder:text-stone-400 focus:border-oxblood/40 focus:ring-1 focus:ring-oxblood/20"
          />
        )}
      </div>

      <div className="mt-7 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="font-medium text-stone-400 transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!answered}
          className="inline-flex items-center rounded-xl bg-stone-800 px-5 py-2.5 font-medium text-stone-100 transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          {isLast ? "See my profile" : question.type === "open" ? "Continue" : "Continue"}
        </button>
      </div>
    </div>
  );
}
