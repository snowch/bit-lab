// Copyright © 2026 Christopher Snow
import { DEFAULT_STRINGS } from "@platform/lesson-runtime";
export const runtimeStrings = {
  ...DEFAULT_STRINGS,
  lesson: {
    ...DEFAULT_STRINGS.lesson,
    objectives: "What you’ll explore",
    modelVsReality: "What this model covers",
    modelVsRealityNoSimulator: "What this model covers",
    timeModel: { ...DEFAULT_STRINGS.lesson.timeModel, word: "Word model" },
  },
  challenge: {
    ...DEFAULT_STRINGS.challenge,
    run: "Check answer",
    notRun: "",
    passing: "Your answer is correct.",
    failing: "That answer is incorrect.",
    blocked: "Answer could not be checked.",
    graderError:
      "The answer checker stopped with an error. Your work is saved. Try Check answer again. Error: {message}",
    inputs: "Given values",
    actual: "Your answer",
    expected: "Expected answer",
  },
};
