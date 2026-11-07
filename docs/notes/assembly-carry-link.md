# Assembly companion-link correction

Copyright © 2026 Christopher Snow.

Assembly Lab's author approved simplifying its four-bit arithmetic lesson by removing a separate 32-bit register/ALU activity. The ALU lesson's cross-course paragraph previously promised that activity. It now points to the existing Module 0, lesson 1, One addition, which runs ADD and identifies the input registers and destination. Two unused prototype link fields were removed from the UI strings and their canonical snapshot.

The target id/order, lesson title and input/destination content were checked against Assembly's actual `fundamentals.ts`, labels/prose and primitive ADD figure. Independent learner/UX and technical reviewers checked the reference in source; their records accompany the Assembly lesson simplification. Copy was drafted separately with GPT-6.1 Medium and the canonical paragraph/source snapshot synchronised. No gate/ALU activity, model, question, storage or namespace behaviour changes.

The full local `CI=true npm run check` passed: formatting, platform integrity, TypeScript, 10 unit files / 101 tests, production build and 48 browser tests, with no skips or failures. The browser suite covers the existing course, ALU operations, retained calculator and reference flows. The destination paragraph was independently checked in source; these checks are not a novice study or a claim of complete accessibility. PR CI and deployment outcomes are recorded in the pull request after this note's commit.
