# First-draft validation

Copyright © 2026 Christopher Snow.

Validated on 31 October 2026 with Node 24.19.0, npm 11.9.0 and Playwright Chromium 141.
CI uses Node 22 and the same locked dependencies and check command.

## Final local check

`npm run check` completed successfully:

- Prettier and unmodified-platform hash check.
- Strict TypeScript.
- 81 unit/integration tests across 8 files, including the platform’s own tests.
- Production build under `/bit-lab/`.
- 24 Playwright tests, 12 each at desktop and Pixel 7 viewport sizes.

The arithmetic tests exhaust all 4-bit and 8-bit operand pairs for addition, subtraction,
carry, signed overflow and signed/unsigned comparisons. They reconstruct the result from
the displayed carry columns. Other checks cover all byte widenings and every sixteen-bit
word’s two byte layouts. These are mathematical model checks, not native CPU execution.

## Browser coverage

- Every new lesson: hidden result, reveal, input change hiding the result, both themes,
  empty and wrong answers, correct answers, restoration after reload and clearing work.
- No JavaScript page errors in those lesson flows and no document-level horizontal overflow.
- Theme persistence, study marks and practice navigation.
- All 110 retained calculator exercises rendered; prior progress copied without changing
  the old key; new progress survives independently.
- The calculator’s service worker preserves a foreign cache and the calculator opens offline.
- Every original interactive note loads without a JavaScript page exception.

Visual inspection covered the cover at desktop and phone sizes, the subtraction carry
diagram on desktop and sign extension on a phone in the dark theme. The initial wide bit rows
required horizontal scrolling. The final version groups sixteen-bit words into labelled high
and low bytes; all eight bits in each group fit the inspected 390-pixel viewport.

## Earlier checks and limits

An initial type check caught a mismatch with the platform’s storage adapter interface; the
adapter was corrected. The first browser start was cancelled after npm argument forwarding
prevented the preview server from listening at the test URL; the test configuration now runs
the workspace’s preview command directly. A complete subsequent browser run passed, followed
by the final full check after the visual changes.

The build reports dependency comment-annotation warnings and a bundle-size warning. These
do not fail the build; splitting the course bundle is a future performance improvement.

No independent learner/editorial review was performed. The original exercise bank was
retained, not exhaustively regraded. The smoke check of original notes does not verify every
interaction or technical claim. Full-course offline operation is not implemented; the
calculator’s offline shell is the scope of the offline test.
