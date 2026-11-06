# Production adder architecture: checked drafting brief

## Observable outcome and preparation

Given two operand bits and incoming carry, explain the kept bit and carry out, then trace both through a full adder's gates. Lesson 3 supplies the required 3 + 3 worked case with bit 1 in focus, following the first two lessons' bits, positions and readings. Its opening explains the general three-one rule before gate derivation. Local gate/wire definitions precede the proof. Lesson 7 reuses that mechanism inside its existing ALU and links to lesson 3; the ALU still supports all nine operations.

## Production placement and copy contract

`content/index.ts` changes only adder/ALU instructional prose. Lesson 3 uses 0011 + 0011 in the try instructions. It retains the separate 14 + 5 exercise, task, hints and ID. Lesson 7 starts with the same worked inputs, names 7 + 1 as a separate overflow example, makes the selected arithmetic-column route explicit, and supplies specific companion links. Its XOR exercise is unchanged.

`ADDER_ARCHITECTURE_STRINGS` supplies `{ shared, bitLab, adder }`; all dynamic messages use literal named templates. Preview/theme/tab chrome is omitted. `carryBeyondWord` takes `{width}` for the variable-width word explorer; the ALU architecture is still explicitly four-bit. The UI and affected chapter source are recorded verbatim in `adder-architecture-copy.md`.

The implementing agent owns defaults, React/CSS, live status, gates, selection controls and tests. Required three-input/two-output content and the gate proof are visible after Reveal result, without an optional disclosure. Changing inputs/operation preserves the existing prediction/reveal contract. The cross-course link is a companion, not a hidden prerequisite. No extra quiz or lesson is introduced.

## Checked facts and sources

- The approved standalone copy and brief are in `/workspace/scratch/architecture-mocks/copy.json` and `brief.md`; the independent review and oracle are in its `review/` directory. These records were read during this production adaptation. They describe completed mock checks, not checks of the new production integration.
- Both unchanged models compute 3 + 3 as `0110` in four retained bits. Bit 0 consumes 1, 1, 0 and produces kept 0, carry 1. Bit 1 consumes 1, 1, 1 and produces kept 1, carry 1. The eight full-adder triples agree with independent integer totals; sum + twice carry equals the input total.
- The selected full-adder gates for three input ones produce first XOR 0, operand AND 1, carry AND 0, result XOR 1 and carry OR 1. The approved visible text equations remain necessary alongside the aria-hidden gate SVG.
- ADD passes B and initial carry zero. SUB uses inverted B and initial carry one in the same word adder. Focused B must come from that prepared adder input, not always raw B. The model is functional and untimed, not a physical CPU circuit claim.
- The actual Assembly Lab model's `add w2, w0, w1` reads both 32-bit sources, writes low 32 bits to w2 and leaves flags unchanged. Its harness has `ret`, but the shown execution moment stops after ADD. The initial w2 is zero. The full unsigned input interval is zero through 2^32 − 1; guide/error bounds are substituted from the input contract.
- A four-bit 15 + 1 retains zero, whereas that same actual 32-bit ADD writes 16. Its low-four-bit crop is zero and its bit-3 carry continues to bit 4. Full-width 0xffffffff + 1 retains zero in w2. The width and cropped-detail qualifications therefore remain local.
- Bit Lab's existing ALU model retains all nine operations and its current flag-output conventions. Logical operations do not silently invent C/V values; shifts do not invent V. No model or flag rules change in this copy pass.

## Drafting and review limits

The sources read include both repositories' AGENTS guidance, Assembly Lab's CLAUDE, authoring/style/visual-language and learning-design guidance, Bit Lab's README/plan/sources, actual current lesson prose and the approved mock source/review. Both style passes checked the new local definition, mechanism order, visible required route, dynamic widths and execution/inspection distinction. Misconceptions about an incoming carry replacing an operand, or a four-bit crop shrinking an Arm register, remain design hypotheses; the author's prior question supports the need to demonstrate three input ones.

No fresh quiz or lesson is introduced in this approved implementation scope. Existing exercises retain their distinct purpose and answer gates. The independent mock review is evidence of mock behaviour only. Production learner/technical/browser review and whole-repository checks belong to the implementing agents. No novice session, screen-reader speech test or physical-device check is claimed by this drafting pass.
