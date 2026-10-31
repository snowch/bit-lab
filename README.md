# Bit Lab

Copyright © 2026 Christopher Snow.

**How computers represent and process data.** An interactive companion to
[Digital Design](https://snowch.github.io/digital-design/) and
[Assembly Lab](https://snowch.github.io/assembly-lab/).

The first course draft has ten interactive lessons: binary and hex, two’s complement,
adders, subtraction and flags, masks, shifts, the combined ALU, comparisons, widening, and memory byte order.
Each lesson has a computed experiment, a prediction before the result is revealed, and
a checked question with hints. Answers and study marks are saved in the browser.

The programmer calculator, its 110 self-checked exercises, the two randomised drill pages,
and the original interactive notes are retained alongside the new course. Preserving them
does not freeze the curriculum: the new lessons deliberately change its order and scope.
The existing programmer-calculator repository is unchanged.

## Run and check

Requires Node 22 or later.

```sh
npm ci
npm run dev
# http://localhost:5173/bit-lab/

npx playwright install chromium
npm run check
```

`npm run check` runs formatting, the platform integrity check, strict TypeScript,
unit tests, the production build and the browser suite. CI runs the same command.
The browser suite exercises the built site at phone and desktop widths.

## Structure

| Directory | Purpose |
| --- | --- |
| `apps/course` | React course shell, experiments, practice page and calculator |
| `content` | Lesson prose, curriculum, questions and hints |
| `packages/bit-model` | Exact fixed-width arithmetic and representation models |
| `platform` | Unedited learning-platform packages at the same revision as Assembly Lab |
| `tests/educational` | Browser checks of predictions, grading, saved work and imports |
| `docs` | Curriculum decisions, provenance, model limits and validation record |

The course uses the shared platform’s lesson schema, renderer, challenge runner, hint
ladder and answer storage. Its own domain model supplies the experiments and graders.
`platform/SOURCE.json` records the upstream commit and file hashes.

## Publishing

GitHub Pages serves the built app under `/bit-lab/`. The deploy workflow checks it before
publishing a push to `main`. Configure the repository’s Pages source as **GitHub Actions**.
The intended public URL is <https://snowch.github.io/bit-lab/>; an unmerged branch is not
published by this workflow.

## Saved work and offline use

Native course work uses `bit-lab:` keys. The retained calculator and drills use
`bit-lab:legacy:` keys. On first opening retained material, old programmer-calculator
progress on the same origin is copied once, without changing the old keys. Progress on
another browser or origin is not available automatically.

The calculator retains its installable app and offline shell. Its worker owns only its
own cache and URL scope. The native course does not yet have an offline worker; do not
describe the whole course as offline-ready. Clearing site data removes saved work.

See [the curriculum plan](docs/plan.md), [migration notes](docs/migration.md),
[sources and model limits](docs/sources.md), and [validation](docs/validation.md).
