# Migration record

Copyright © 2026 Christopher Snow.

## Sources

The retained calculator and reference collection came from `snowch/programmer-calculator`
at commit `efa1584bd6deb69b2e287aae579739c4a73bf052`. `import-source.json` records the
original SHA-256 of every imported file before the adaptations below. It records provenance,
not an assertion that adapted files remain byte-identical.

The shared platform is `snowch/learning-platform` at
`bb33c48eb4a32f3c4c1acc1085d907e7b298307c`, the revision used by Assembly Lab at the start
of this work. The style tokens and lesson styles were adapted from Assembly Lab; Bit Lab
uses an amber accent and its own cover, navigation and experiment views.

## What changed

- Added Bit Lab navigation to every retained HTML page.
- Prefixed calculator, ALU, theme and drill storage with `bit-lab:legacy:`.
- Added a one-time copy of old same-origin keys; old state is never overwritten or deleted.
- Gave the calculator manifest its own relative app identity and name.
- Replaced the calculator worker’s origin-wide cache cleanup with cleanup restricted to its
  own cache prefix. Fetch handling is restricted to its own URL scope.
- Kept service-worker activation conservative: no forced takeover of an open app.
- Removed a stale exercise count from the calculator description and updated the old notes’
  statement that Assembly Lab was not yet available.

The 110 exercises keep their own worked solutions and manual completion ticks. The two drill
pages keep their original checking and scores. Native Bit Lab lesson questions use the shared
challenge runner and a separate model-based grader.

No files in the original calculator or the companion course repositories were modified.

## Verification boundary

Automated browser checks cover loading the original interactive pages without JavaScript
exceptions, retaining the calculator exercise count, copying old completion state without
changing it, preserving another app’s cache, and reopening the calculator offline. This is
not an exhaustive revalidation of every original quiz, C claim or calculator operation.
