# Marriage Readiness Assessment: Journey, Technical Audit, and Backlog

**Scope:** Current implementation in `src/routes/index.tsx`, `src/components/assessment/QuestionCard.tsx`, `src/components/assessment/ReportView.tsx`, and `src/lib/assessment/`.

**Assessment context:** This is an 80-question, ten-area, faith-informed self-reflection tool. It explicitly says it is preparation, not a clinical assessment or verdict. The audit is based on source inspection; it does not claim user research, accessibility certification, or validated psychometrics.

## 1. Current user journey

| Stage | What the user does and sees | Current behavior / friction |
|---|---|---|
| Discover | Arrives at the home page and sees purpose, areas, report preview, disclaimer, 80 questions, and an estimated 25 minutes. | One long page; the assessment is introduced as a 25-minute task. No user research or completion data is present to support that estimate. |
| Decide | Reviews the preparation framing and chooses **Begin the assessment**. | Intro can offer **Continue where I left off** based on any saved answers. |
| Respond | Answers one question at a time; can go back, change an answer, and continue. Open responses are optional; other types need an answer before continuing. | Progress is shown as question number and a bar. There is no section-level navigation or skip control. Answers autosave in local storage. |
| Resume | Returns to the same browser and continues from stored state. | Storage is device/browser specific and has no visible clear/resume management. Corrupt or stale state is silently ignored only when parsing throws; valid but out-of-range state is not checked. |
| Review | Uses Back to revisit previous questions and edit responses. | No answer summary or jump-to-area review is provided. |
| Complete | Answers the last item and selects **See my profile**. | A report is generated locally. Open items can be blank; the participant is not shown how many scored responses inform each area. |
| Reflect | Reads area scores, five indicators, strengths, areas to explore, possible blind spots, narrative, priorities, discussion questions, four-week plan, and their own written reflections. | Results are printable via browser print. There is no dedicated export/share flow or source/limitations explanation for the scoring model. |
| Start over | Selects **Start a new assessment**. | Clears answers and the saved local record immediately; no confirmation or export prompt. |

### Intended journey outcome

The user should finish with a grounded view of their own expectations and practical next steps, not a pass/fail judgment. The report should help them identify topics for reflection and conversation while making clear what the scores can and cannot establish.

## 2. Technical audit

Severity describes impact on trust, completion, or correctness, not exploitability.

| ID | Severity | Finding | Evidence and impact |
|---|---|---|---|
| A1 | High | Scoring thresholds and answer weights are presented as readiness interpretations without an in-repository validation basis. | `scoring.ts` maps hand-authored option weights and equal question weights to 0–100 scores, then labels scores at 80/60/40 cutoffs. Nothing in the code or README describes piloting, reliability, or validation. A user may interpret precise labels as more authoritative than the model supports. |
| A2 | High | Sensitive answers are persisted without a clear data control. | `index.tsx` writes all answers, including sexual, religious, family, and free-text responses, to `localStorage`. The intro does not disclose this persistence or offer a clear-data action. Anyone with access to that browser profile may see the data. |
| A3 | High | A stale but parseable saved index/phase can break the assessment. | Hydration accepts arbitrary numeric `index` and any truthy `phase`; render then reads `QUESTIONS[index]!`. A future release that changes question count, or edited storage, can result in `question` being undefined. |
| A4 | Medium | Storage writes and browser storage access are not failure-tolerant. | Reads are guarded, writes are not. Disabled storage or quota errors can throw during an effect. The write also occurs for every answer change, including each keystroke in open responses. |
| A5 | Medium | Users cannot see score coverage or incompleteness in the report. | Completion permits blank open responses (intentionally) but all scored questions are required in sequence today. The report does not state how many questions contribute to each score; `answeredCount` is computed but not displayed. Future skip/optional behavior could silently turn missing areas into zero (`weightedAverage(...) ?? 0`). |
| A6 | Medium | Report framing risks conveying false precision. | The overall score drives a readiness headline, while category statements say the person “appear[s] to have” particular foundations. It lacks a visible methods/limitations note beside scores and does not distinguish response patterns from established capabilities. |
| A7 | Medium | Keyboard/screen reader selection semantics need review. | Answer choices are custom buttons with selected state conveyed visually only; no `aria-pressed`, radio group semantics, or visible focus treatment is defined in `OptionRow`. Question changes do not visibly announce progress or move focus. |
| A8 | Medium | The 25-minute estimate and completion burden may reduce completion. | 80 serial items, including open responses, are presented in a one-question flow. There is no save status, section break, time estimate calibration, or user evidence in the repository. |
| A9 | Low | Randomized options display letters based on shuffled position, while answer identity is the stable option key. | This preserves scoring and blind-spot logic, but letter references can be confusing when users revisit an item or discuss an answer. Consider removing letters or showing stable labels. |
| A10 | Low | The public description is hard-coded and may drift. | Route metadata says “80-question” and the page uses `TOTAL_QUESTIONS`; descriptions and README content can diverge as the instrument changes. |

### Strengths to preserve

- The introduction, report, and disclaimer consistently frame this as preparation rather than a verdict or diagnosis.
- Scoring and UI content are separated into assessment modules and components.
- Answers can be changed by navigating backward; resume is available without account creation.
- Open reflection responses are excluded from numerical scoring and shown back to the participant.
- The assessment includes indicators, conversation prompts, and practical next steps instead of only a single score.

## 3. Prioritized backlog

Priorities: **P0** trust/safety or data integrity; **P1** core usability and interpretability; **P2** enhancement. Items are proposals, not completed work.

### P0 — Protect interpretation and user data

1. **Explain the scoring model and its limits**
   - Add a short methods note beside the report explaining that scores are rule-based reflection signals, not a validated readiness measure, diagnosis, or prediction.
   - Document how per-question weights, reverse scoring, area scores, and category cutoffs are chosen; identify who owns content review.
   - Acceptance: A user can find the scoring explanation from the report before relying on a result; language does not imply clinical or predictive validity.

2. **Make local saving transparent and controllable**
   - Tell users before they begin that answers, including free text, are saved in this browser for resume; clarify that there is no account/cloud sync if that remains true.
   - Add a clear saved-progress/reset action and handle storage unavailable/quota failures without interrupting the assessment.
   - Acceptance: Users can understand where data is stored and remove it; storage failure leaves in-memory answering usable and shows a non-blocking notice.

3. **Validate persisted state before restoring**
   - Check schema version, phase enum, finite integer index bounds, and answer keys/value shapes against the current instrument. Recover to a safe point when invalid.
   - Catch serialization/write failures as well as read/parse failures.
   - Acceptance: Invalid, obsolete, or partially malformed records never crash rendering or produce an invalid question; recovery behavior is deterministic.

### P1 — Improve completion and result comprehension

4. **Add score coverage and evidence**
   - Show answered/scored counts per area and distinguish “not enough responses” from a low score if skipping is introduced.
   - Display the response patterns behind each main insight with links or question references where appropriate.
   - Acceptance: A participant can tell how much input supports each area result and why a notable flag appeared.

5. **Support accessible answer selection and navigation**
   - Use radio-group semantics for single-select and Likert items, checkbox semantics for multi-select; expose selection state and keyboard operation.
   - Add clear focus styles, announce question/progress changes, and provide a predictable focus target after Back/Continue.
   - Acceptance: The full journey is operable by keyboard and selection/current-question state is understandable to assistive technology.

6. **Reduce the perceived burden of the 80-item flow**
   - Add clear area transitions and a section-level progress summary; consider allowing users to pause and return from a visible save state.
   - Validate the 25-minute estimate with representative users; revise it if measured completion time differs.
   - Acceptance: Participants know how much remains and can resume without uncertainty; estimate is based on observed completion times.

7. **Clarify report language and actionability**
   - Label results as “your responses suggest”; avoid making stable trait claims. Explain that high/low scores are prompts for reflection.
   - Prioritize a small number of next steps and connect each to the participant’s own responses. Make the print output legible and include the limitations statement.
   - Acceptance: Report recommendations are traceable to answers and remain consistent with the non-verdict framing.

### P2 — Extend usefulness after completion

8. **Add explicit review before report generation**
   - Provide a compact answer review grouped by area with edit links; let participants confirm completion before generating the profile.
   - Acceptance: A user can review and correct responses without repeatedly stepping through unrelated questions.

9. **Add privacy-preserving export options**
   - Offer a print-friendly or downloadable report with an explicit choice about including open-text answers; keep export local unless a separate sharing model is designed.
   - Acceptance: Export works without uploading responses and makes inclusion of sensitive reflections clear.

10. **Create an instrument maintenance and review process**
    - Keep question wording, construct mapping, scoring, and report rules reviewed together; add version metadata and a migration policy for saved assessments.
    - Acceptance: Each shipped instrument version is identifiable and saved answers cannot silently be interpreted against changed scoring rules.

## 4. Suggested delivery sequence

1. Ship P0 scoring limitations, local-storage disclosure/controls, and state validation together.
2. Address accessibility and score coverage before driving wider adoption.
3. Observe completion and report comprehension with a small representative pilot; use findings to refine burden, wording, and report actions.
4. Add answer review and export after the core flow and privacy expectations are clear.

## 5. Validation signals to collect

- Assessment start-to-completion rate and median completion time, without collecting answer content.
- Drop-off by question/area and resume success rate.
- Whether participants understand that results are reflective rather than predictive.
- Whether users can identify the responses behind a score or blind-spot flag.
- Keyboard-only completion and screen reader usability across question types.
- Storage failure, invalid-state recovery, and report generation error rates.

Avoid analytics that capture question text answers or free-text reflections. Any event collection should be disclosed and minimized.
