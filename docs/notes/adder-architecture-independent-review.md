# Independent review of the carry architecture integration

Copyright © 2026 Christopher Snow.

Reviewed 2026-11-06 by a separate learner/technical reviewer who authored no product
code or learner copy. This record concerns the actual built course, following the
approved standalone mockups. Expert walkthrough is not a novice learning study.

## Learner findings and final verdict

No open instructional blocker on the corrected build. Lesson 3's required 3 + 3 worked
route encounters 1 + 1 + incoming carry 1 and shows both kept 1 and carry 1. The three inputs and
two outputs are visible in context of the four linked columns, without requiring
horizontal exploration or an optional gate panel. Lesson 7 reuses the detail for
ADD/SUB under the retained ALU; logic, shifts, flags and the 7 + 1 overflow preset remain.
The small gate construction is appropriate to this course. Assembly Lab's separate
register bridge provides an optional specific link, not an undeclared prerequisite.

One initial source-order finding was accepted: XOR/AND/OR formulas preceded their
local definitions on the stacked phone layout. The existing guide now precedes the
entire working/circuit grid, with its later duplicate removed. Corrected actual
build DOM order and phone screenshots independently confirm definitions before use.
Wire dot/crossing semantics are locally explained. The five visible equations offer
a textual mechanism alongside the gate image. Functional-model limits are explicit;
the diagrams do not claim real CPU layout or timing.

Worked exploration is not demonstrated mastery. The existing independent challenge
is preserved but does not diagnose every three-input misconception. No new lesson
or assessment is required for the approved scope; a future novice study could check
transfer of the 111 case without prompting.

## Independent actual-build checks

Built routes: lesson/adder, lesson/alu and retained shared use lesson/flags.
Chromium viewports 375/1280, both actual light/dark themes, plus 700 light. No document
overflow, page errors or console errors. All four columns fit and exceed 40px height.
Screenshots were inspected at each width/theme combination.

All eight selected-column triples were generated through actual controls; both
outputs agree with independent integer arithmetic. All five named gate values in
each case separately agree with independent XOR/AND/OR expressions. For 111,
first XOR = 0, operand AND = 1, result XOR = 1, carry AND = 0, carry OR = 1.

All nine ALU operations at 3, 3 were compared with an independent integer/bitwise
oracle, including N/Z/C/V and absent-output dashes. Only ADD/SUB show the new detail.
SUB uses inverted B and initial carry 1; ADD uses original B and initial carry 0. The
Signed overflow preset still produces 8 and V = 1 from 7 + 1. Reset returns to 3, 3 ADD.
The old flags lesson retains its previous CarryDiagram rather than the new detail.

Reveal and input/operation reset gates remain effective. Keyboard Space keeps focus
and avoids unexpected scroll when visible; the live status DOM node survives column
changes and its text updates. Formal challenge work survives experiment Reset and
ordinary reload. Transient exploration resets on reload as before. Storage/cache
code was source reviewed without changes; other calculator legacy paths were not
all manually re-exercised by this reviewer.

Evidence was captured in the shared execution workspace under
`/workspace/scratch/architecture-implementation-review`: brief.md,
learner-review.md, technical-review.md, bit-lab-browser.cjs,
bit-lab-browser.json, bit-lab-gate-oracle.json and route screenshots. The first
postprocessing oracle assumed SVG DOM gate order matched proof order; comparing
by named gate identity corrected that reviewer harness mistake. All 8 × 5 named
checks passed; no product numeric defect was implicated.

Full repository tests, CI and merge belong to the implementing agents and are
recorded separately. This reviewer did not install dependencies, rebuild assets,
run a broad suite, use a physical touch device, listen to screen-reader output or
test another browser engine. No such evidence is claimed.
