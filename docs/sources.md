# Sources and model limits

Copyright © 2026 Christopher Snow.

## Mathematical model

`packages/bit-model` defines exact word arithmetic for widths from one to sixteen bits.
The visible labs use four, eight and sixteen. The model does not implement an instruction
decoder, a compiler, electrical timing or a C evaluator.

The arithmetic oracle in `model.test.ts` uses direct integer sums/differences and signed
range checks, separately from the carry chain. It checks all operand pairs at four and eight
bits, both unsigned and signed comparisons, every byte’s widening, and all sixteen-bit memory
layouts. Worked question answers are independently pinned in `content/course.test.ts`.

The shift model permits counts from zero to width minus one. Arithmetic right shifts round
towards negative infinity. That is not a claim that C division or every language’s right
shift has the same semantics.

## Combined ALU

The ALU selects ADD, SUB, AND, OR, XOR, NOT or a one-place LSL, LSR or ASR.
N and Z are derived from the selected result. ADD and SUB produce carry and signed
overflow; SUB uses the same no-borrow convention as the earlier flags lesson. Shifts
produce the outgoing bit as C. Logic produces neither C nor V; shifts produce no V.
These absent outputs are `null` and displayed as a dash, never as a retained or cleared
processor flag. NOT and shifts do not consume B. The model has no clock or stored flags.

`alu.test.ts` independently checks all nine operations for every four-bit operand pair,
including selection, flag provenance, unary inputs and outgoing bits. Wider boundary cases
cover wrapping and signed overflow. This extends the mathematical model checks, not the
architecture conformance claims.

## Architecture and language references

- [Arm condition codes](https://community.arm.com/arm-community-blogs/b/architectures-and-processors-blog/posts/condition-codes-1-condition-flags-and-codes):
  unsigned subtraction uses C for no borrow; LO tests C clear; LT tests N different from V.
  The arithmetic and comparison tests establish those equations for the small-word model,
  not full architectural conformance.
- [Intel software developer manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html):
  the SUB instruction’s carry flag reports an unsigned borrow. This differs from Arm’s
  subtraction convention and is qualified beside the relevant lesson.
- [C11 committee draft N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf):
  6.5.7 for shift rules, 6.5.5 for integer division, 6.3.1.1 for integer promotions, 6.3.1.8
  for usual arithmetic conversions and 6.5.8 for relational comparisons. The shift qualification
  names C11 explicitly; do not silently generalise it to every C or C++ edition.
- [Assembly Lab sources](https://github.com/snowch/assembly-lab/blob/main/docs/sources.md):
  reference for subsequent work involving compiled C and real instruction execution.

The first draft does not contain newly recorded compiler output and makes no claim to have
passed QEMU or physical-hardware differential tests. Original material in `public/calculator/docs`
retains its existing claims and simplifications; it is a reference collection awaiting further
editorial review, not evidence that the new model implements those instruction sets.

## Assets and provenance

The platform and original calculator are the author’s own work. Source Sans 3, Archivo and
JetBrains Mono are bundled through Fontsource and distributed under the SIL Open Font License.
React and other package dependencies retain their package licences in the installed dependency
tree; the lockfile pins the dependency versions. No new general licence is assigned to the
author’s repositories by this migration.
