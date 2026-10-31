// Copyright © 2026 Christopher Snow
import type { Artifact, Challenge } from "@platform/lesson-schema";
import type {
  Book,
  ChallengeEditorProps,
  Verdict,
} from "@platform/lesson-runtime";
import { answer, parseInteger, type Topic } from "@bl/bit-model";
import { chapters, lessons } from "@bl/content";
import { WordLab } from "./WordLab";

export function grade(challenge: Challenge, artifact: Artifact): Verdict {
  if (challenge.tests.kind !== "answers")
    return {
      passed: false,
      total: 0,
      failures: [],
      blocked: "This activity needs answer tests.",
    };
  const submitted = artifact.answers?.["value"] ?? "";
  const value = parseInteger(submitted);
  if (value === undefined)
    return {
      passed: false,
      total: challenge.tests.cases.length,
      failures: [],
      blocked:
        "Enter a whole number. You can use decimal, 0x hexadecimal or 0b binary.",
    };
  const failures = challenge.tests.cases.flatMap((test, index) => {
    const g = test.given;
    const topic = g["topic"] as Topic;
    if (!chapters.some((c) => c.id === topic))
      throw new Error("Unknown activity topic");
    const expected = answer(
      topic,
      Number(g["a"]),
      Number(g["b"]),
      Number(g["width"]),
    );
    return value === expected
      ? []
      : [
          {
            index,
            label: test.label,
            inputs: Object.fromEntries(
              Object.entries(g)
                .filter(([k]) => k !== "topic")
                .map(([k, v]) => [k, String(v)]),
            ),
            actual: { answer: submitted },
            expected: { answer: String(expected) },
            detail: chapters.find((c) => c.id === topic)!.hint,
          },
        ];
  });
  return {
    passed: failures.length === 0,
    total: challenge.tests.cases.length,
    failures,
  };
}
function AnswerEditor({ challenge, artifact, onChange }: ChallengeEditorProps) {
  return (
    <label className="answer-label" htmlFor={`answer-${challenge.id}`}>
      Your answer
      <input
        id={`answer-${challenge.id}`}
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={artifact.answers?.["value"] ?? ""}
        onChange={(e) => onChange({ answers: { value: e.target.value } })}
      />
    </label>
  );
}
export const book: Book = {
  id: "bit-lab",
  title: "Bit Lab",
  lessons,
  interactives: { "word-lab": WordLab },
  ChallengeEditor: AnswerEditor,
  grade,
  timeModelNotes: {
    word: "Exact fixed-width bit arithmetic. The model does not simulate processor timing or C expression evaluation.",
  },
};
