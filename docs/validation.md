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

## Hosted runner adjustment

The first GitHub Actions run failed before tests: `ubuntu-latest` selected Ubuntu 26.04,
which the inherited Playwright 1.56.1 does not support. Both workflows now pin
`ubuntu-24.04`, a supported runner, rather than skipping browser checks.

## ALU lesson addition

The ALU is now lesson 7 of 10, after shifts and before comparisons. The update passed
`npm run check`: formatting, platform integrity, TypeScript, 86 tests across 9 unit/integration
files, the production build and 28 browser tests across desktop and phone projects.

The new mathematical tests check all nine operations for every four-bit input pair. The
expected results and flag sources are calculated independently from the ALU function. Tests
also cover wider boundary values, ignored B inputs, shifted-out bits, signed overflow and
the absence of C/V outputs for logic operations. The graded question rejects the adder's
answer when the operation control selects XOR.

Browser checks select every operation and verify its result, highlighted path and N/Z/C/V
outputs. They check unary operations, a negative arithmetic shift, a zero-producing XOR,
reset behaviour, adder detail, navigation order, saved answers and grading. The generic
lesson checks exercise both themes and reject document-level horizontal overflow.

Visual inspection covered the ALU diagram on desktop in light mode and the experiment on a
390-pixel phone in dark mode. The diagram scrolls within its own panel on narrow screens;
the inputs, result bits and flag cards fit the page. A final inspection checked the added
wire junction marks and the formatted question. No independent editorial review was performed.

The first full browser run had 26 passes and two ALU-test timeouts: the test's exact label
locator included the select's option text. The rendered accessibility tree already named
the combobox correctly. The test now finds that combobox by its role and accessible name;
the focused two-test rerun and the subsequent complete check both passed.

## Connected four-bit ALU

The main experiment now connects clickable A/B bits to full adders, logic gates or shift
wires, and connects the result to N and a NOR gate for Z. ADD/SUB expose the carry chain
and the XOR gate that derives V from the carries into and out of the sign bit. The former
block diagram remains available as an optional overview. A table shows binary, hex, signed
and unsigned readings together.

`npm run check` passed with 87 unit/integration tests and 28 desktop/phone browser tests.
The additional exhaustive trace test reconstructs results from the displayed adder columns
and shift sources, verifies the carry chain and checks the flag gates for all four-bit input
pairs and operations. Browser checks cover hidden computed signals before Reveal, carry
values for 7 + 1, NOR/XOR gate visibility, both readings of 1000, keyboard input toggling,
the optional overview and circuit width on a phone, alongside all previous operation checks.

Visual inspection covered the connected ADD circuit in desktop light mode and 390-pixel
phone dark mode, plus SUB and ASR on the phone. The main circuit fits without horizontal
scrolling at that width; only the optional block overview needs sideways scrolling. An
unused-input label was removed from the SVG after inspection because it crossed the shift
wires; the adjacent prose already explains that B is unused. No independent editorial review
was performed. The earlier build warnings and offline-scope limits still apply.

## Compact ALU spacing

Shorter wire runs and a shallower NOR gate reduce the connected diagram from 590 to 466
SVG units high, while preserving bit sizes, touch targets and text sizes. Mobile-only CSS
tightens paragraph, control and diagram margins. At a 390-pixel viewport, the unrevealed
experiment measured 922 pixels high, down from 1163; the diagram itself went from 445 to
352 pixels. Visual inspection covered ADD, SUB, XOR, LSL and ASR on the phone and ADD in
desktop dark mode. The carry label was repositioned after inspection to stay beside the
final carry wire. `npm run check` passed: 87 unit/integration tests and 28 browser tests,
including the existing operation, keyboard and phone-width checks.

## Guided calculator practice

Lesson 11, Put it into practice, follows memory and directs learners to Show exercises in
the calculator. It provides a selected practice round and the register-field capstones
94–96, distinguishes self-checking from grading, and explains the calculator’s subtraction
carry convention. The learning path and study marks include this lesson; the automatically
graded practice list still contains the ten lesson checks.

The calculator bank starts collapsed without a saved preference. Existing visibility
preferences and ticks remain intact, and explicit `#exh` links open the bank for that visit
without replacing the saved preference. The static markup starts collapsed too, avoiding
a flash of questions before JavaScript runs. The exercise toggle has a 44-pixel minimum height.

`npm run check` passed with 88 unit/integration tests and 32 desktop/phone browser tests.
New browser coverage checks first-visit hiding, keyboard reveal, remembered visibility,
loading an exercise, revealing its answer, saved ticks, showing completed questions,
initial and same-page exercise links, and the final lesson’s navigation and separate study
mark. Existing migration and offline checks also passed. Visual inspection covered the
final lesson and collapsed calculator header at 390 pixels; neither overflowed the page.
The exercise bank’s questions and answers were retained, not independently regraded.

## Lesson completion checkbox

The lesson completion control is now a native checkbox labelled “Mark lesson as done”,
grouped with the forward navigation link, following Assembly Lab’s placement. It uses the
existing study-mark storage, preserving earlier marks. Completed entries in the learning
path display “✓ Done”; the count updates when a lesson is marked or unmarked.

`npm run check` passed with 88 unit/integration tests and 32 browser tests. Updated flows
cover checking, persistence after reload, the contents tick, keyboard unchecking and removal
of the contents tick. Final-practice coverage still verifies that lesson completion does not
tick calculator exercises. Visual inspection covered phone light mode and desktop dark mode.
An inherited checkbox style was corrected after inspection so the native tick stays aligned
inside the 44-pixel label target.
