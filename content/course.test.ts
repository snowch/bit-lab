// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import { checkLesson, modelProblems } from "@platform/lesson-schema";
import { chapters, learningPath, lessons } from "./index";
import { grade } from "../apps/course/src/book";

describe("course contract and independent exercise answers", () => {
  const answers = [11, -3, 3, 0, 6, 253, 5, 1, 65514, 45];
  it("ends with guided self-checked practice without inventing an automatic grade", () => {
    expect(learningPath.map((lesson) => lesson.id)).toEqual(
      lessons.map((lesson) => lesson.id),
    );
    const final = lessons.at(-1)!;
    expect(final.id).toBe("put-it-into-practice");
    expect(final.prerequisites).toEqual(["patterns"]);
    expect(final.challenges).toEqual([]);
    expect(final.sections.map((section) => section.prose).join(" ")).toContain(
      "self-checked",
    );
  });
  it("makes the ALU a main lesson between shifts and comparisons", () => {
    const index = lessons.findIndex((lesson) => lesson.id === "alu");
    expect(lessons[index - 1]?.id).toBe("shifts");
    expect(lessons[index + 1]?.id).toBe("compare");
    expect(lessons[index]?.prerequisites).toEqual(["shifts"]);
    expect(lessons[index + 1]?.prerequisites).toEqual(["alu"]);
    // Adding the two operands is a plausible answer if the selector is overlooked.
    expect(
      grade(lessons[index]!.challenges[0]!, { answers: { value: "9" } }).passed,
    ).toBe(false);
    expect(
      lessons[index]?.sections
        .flatMap((section) => section.interactives)
        .some((figure) => figure.kind === "alu-lab"),
    ).toBe(true);
  });
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
