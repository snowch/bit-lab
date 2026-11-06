# Carry and architecture implementation

Copyright © 2026 Christopher Snow.

## Scope and checked facts

The user approved the standalone architecture mockups for implementation in both
courses. This change concerns Bit Lab's existing adder and ALU lessons; it adds no
lesson, calculator mode or exercise. The existing unsigned14+5 challenge, lesson
marks and saved challenge work remain in place. No storage or cache code changes.

The earlier learning-design review found that the required7+1 example and14+5
practice never encountered three input ones in one column. The worked inputs now
use3+3, whose bit1 combines1+1+incoming1. Its computed outputs are kept1 and
carry1, with retained word0110. The arithmetic model already implements this
correctly. The change exposes its existing per-column records rather than adding
another arithmetic implementation.

`AdderDetail` connects all four visible columns, a selected column's three inputs
and two outputs, and its five gate values. It uses `arithmetic` for the actual
ADD/SUB operation and column records. A full-adder SVG shows complete connections
and junctions; five visible computed equations provide the textual mechanism.
Its output status node remains in place while the selected column changes.

Lesson3 shows the whole computed result before the detailed column. ALU7 reuses
the same component for ADD and SUB, with a compact adder-output→selector→result
context. Existing connected circuits, all nine operations, unary/shift behaviour,
flag conventions and investigation presets remain. The signed-overflow7+1 preset
retains the original worked case after the default/reset changed to3+3. The
existing global operation overview stays available; another full ALU diagram is
not added.

The view remains a functional four-bit model, not CPU execution or electrical
timing. SUB's focused B signal is the inverted adder input and starts with
carry1; ADD passes B and starts with0. An internal carry is not automatically
a stored processor flag. The existing ALU rules retain absent flags as dashes.

New copy and lesson adaptations were drafted separately from model facts in
`adder-architecture-brief.md` and recorded in `adder-architecture-copy.md`.
The managing implementation agent did not author that copy. No prototype theme,
tab or administrative chrome enters the course.

## Focused validation and review corrections

- Initial focused model/content/component run: four files,37 tests passed.
  Existing model tests exhaustively check all four/eight-bit arithmetic pairs
  against independent integer results. New component tests exercise all eight
  input triples, both outputs, five gates, ADD/SUB boundaries and column changes.
- TypeScript initially caught unsupported Testing Library `exact` options in
  new unit tests. Those options were removed; no assertion or product behaviour
  was relaxed. The following TypeScript and production build commands passed.
- Initial built browser run:44 tests passed, using the existing Desktop Chrome
  and Pixel7 projects at a separate test port with one worker. It included the
  new375/700/1280 light/dark matrix, all eight column triples, all nine ALU
  operations and presets, original challenges, regrade/clear, calculator cache
  isolation and retained reference pages. This result predates the correction
  below and is not the final review verdict.
- Independent learner/source review found that the five proof equations preceded
  the XOR/AND/OR definitions on phones. The existing gate-guide paragraph now
  precedes the two-panel grid; the later duplicate was removed. A DOM-order
  regression checks this prerequisite relationship. No new copy was needed.
- Final connector polish removes small gaps between the context/column connector
  tracks and their nodes. Functional signal values and calculations are unchanged.

The corrected build passed TypeScript, all13 focused component tests and the
production build. An independent reviewer who did not author this implementation
reported no open learner or technical blocker after checking375/1280px in both
actual themes and700px in light. Their checks included all eight selected-column
triples and five named gate values per triple against independent oracles, all
nine ALU operations and flags, the retained flags-lesson diagram, definitions
before the first proof, keyboard/live-node behaviour and formal-work retention.
That independently verifies the accepted definition-order correction.

The independent record is preserved in `adder-architecture-independent-review.md`;
measured browser artifacts remain in the session's
`/workspace/scratch/architecture-implementation-review/`. Their separate
Assembly-only finding is outside this repository.

Final full validation: `CI=true npm run check` exited0 on the corrected source.
Formatting, platform integrity, TypeScript, all10 unit files/101 tests, production
build and all48 browser tests passed. The stock browser suite used its two
configured device projects and two workers and finished in1.3minutes, with no
skips or failures. Its result is separate from the earlier focused44-test pass
and the isolated13-test correction check; those commands retain their own scope.
No timeout or meaningful assertion was relaxed.

No novice learning session, physical touch device, screen-reader speech or other
browser engine is claimed.
