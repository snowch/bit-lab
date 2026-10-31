// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { checkLesson, modelProblems } from "@platform/lesson-schema";
import { chapters, lessons } from "./index";
import { grade } from "../apps/course/src/book";

describe("course contract and independent exercise answers", () => {
  const answers = [11, -3, 3, 0, 6, 253, 1, 65514, 45];
  it("renders only valid lessons with backwards prerequisite links", () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    expect(modelProblems(lessons, ["word"])).toEqual([]);
    lessons.forEach((lesson, i) => {
      expect(checkLesson(lesson)).toEqual([]);
      for (const prerequisite of lesson.prerequisites)
        expect(lessons.slice(0, i).some((l) => l.id === prerequisite)).toBe(
          true,
        );
    });
  });
  chapters.forEach((chapter, i) =>
    it(`${chapter.id}: accepts the worked answer and rejects a plausible wrong answer`, () => {
      const challenge = lessons[i]!.challenges[0]!;
      expect(grade(challenge, challenge.initial).passed).toBe(false);
      expect(
        grade(challenge, { answers: { value: String(answers[i]) } }).passed,
      ).toBe(true);
      expect(
        grade(challenge, { answers: { value: String(answers[i]! + 1) } })
          .passed,
      ).toBe(false);
      expect(grade(challenge, challenge.reference).passed).toBe(true);
      expect(challenge.reference.answers?.["value"]).toBe(String(answers[i]));
    }),
  );
});
