// Copyright © 2026 Christopher Snow
import { DEFAULT_STRINGS } from "@platform/lesson-runtime";
export const runtimeStrings = {
  ...DEFAULT_STRINGS,
  lesson: {
    ...DEFAULT_STRINGS.lesson,
    objectives: "What you’ll explore",
    modelVsReality: "What this model covers",
    modelVsRealityNoSimulator: "What this model covers",
  },
  challenge: {
    ...DEFAULT_STRINGS.challenge,
    run: "Check answer",
    notRun: "Enter your answer when you are ready.",
    passing: "Your answer is correct.",
    failing: "Try again, or open a hint to work through the idea.",
    blocked: "Check your input",
    inputs: "Given values",
    actual: "Your answer",
    expected: "Expected answer",
  },
};
