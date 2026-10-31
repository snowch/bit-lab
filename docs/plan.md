# Curriculum and first edition

Copyright © 2026 Christopher Snow.

## Agreed direction

The course is **Bit Lab: How computers represent and process data**, in `snowch/bit-lab`.
It shares the course format and learning platform used by Assembly Lab and Digital Design.
It is not limited to comparisons or a compiled `if`.

The author explicitly permits substantial changes to the existing content. The original
material is source material and a working reference, not a fixed syllabus. The calculator
and quizzes remain useful companions. Their presentation and explanations may evolve.

## Teaching approach

Start with a pattern the learner can change. Introduce the interpretation or operation
needed to explain it. Ask for a prediction before revealing computed results. Follow with
a different input that the learner must solve, with feedback and progressively specific hints.

Avoid conflating three different claims:

1. What fixed-width mathematical arithmetic does.
2. What an instruction set defines, including its flag conventions.
3. What a language defines and a particular compiler emits.

The first draft concentrates on the first claim, introduces the Arm flag convention with
explicit qualifications, and points to Assembly Lab for instruction execution and compiler work.

## First path

| Lesson | Learning purpose |
| --- | --- |
| Build a number from bits | Explain place values before introducing hex |
| Read the same bits two ways | Derive two’s complement from the signed top weight |
| Follow a carry through an adder | Connect gates to arithmetic column by column |
| Subtract and explain the flags | Separate unsigned borrowing from signed overflow |
| Select and change individual bits | Use AND, OR and XOR for independent fields |
| Move bits without losing their meaning | Distinguish logical and arithmetic shifts |
| Bring the operations together in an ALU | Connect the operation selector, shared adder, logic, shifter and flag outputs |
| Make a signed or unsigned decision | Explain why N alone is insufficient when V is set |
| Preserve a value in a wider word | Choose zero or sign extension for the intended value |
| Lay out a word in memory | Connect bit patterns to addressed bytes and byte order |

The word model uses four bits where exhaustive visual inspection helps, eight for masks
and shifts, and sixteen for widening and memory. These are teaching widths, explicitly
distinguished from a real processor’s register widths.

## Further paths

The home page labels these as roadmap topics, not available lessons:

- Multiplication, division, wide results, fixed-point scaling and rounding.
- Floating-point representation, approximation and precision.
- Text encodings, packed fields and binary formats.
- C conversions and recorded compiler evidence, linked to Assembly Lab.

The ALU now has a main lesson after shifts and before comparisons. It joins the operations
already taught. Its main experiment uses four clickable bits per word, a connected circuit,
visible carry propagation and flag-generating gates. Signed and unsigned readings share a
table below the circuit. The block overview, adder calculations and individual logic columns
are optional details.

The original gate-level ALU, gate-built register, C edge cases and breadboard activity remain
available in the reference collection. Their eventual course treatment should be decided on
learning value, not on preserving their current place in the old sequence.

## Course boundaries

Digital Design teaches constructing a machine. Bit Lab teaches interpreting and transforming
its data. Assembly Lab teaches driving its instruction set. Cross-links should point to the
specific activity that answers the learner’s next question as the courses evolve.

## Review still needed

This is a usable first draft, not a declaration that the curriculum is complete. Future editorial
work should deepen applications, inspect prerequisites and feedback with learners, and review
the retained exercise bank. Its historical answers are retained; they have not all received a new
technical review in this migration. Add full-course offline support separately from the
calculator’s existing offline shell, with update and saved-work checks.
