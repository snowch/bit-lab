# Working on Bit Lab

Read `README.md`, `docs/plan.md` and `docs/sources.md` before changing the course.

- The curriculum may change substantially. Preserve useful functionality, not the old page order.
- Keep the calculator and practice available alongside lessons. Distinguish self-checked work
  from automatically graded questions.
- Use the learning-platform schema and runtime. Do not edit `platform/` directly; sync a
  verified upstream revision with `scripts/sync-platform.mjs`.
- Figures and answers come from the model. Test numerical claims independently of the model
  implementation. A toy word model is not a CPU emulator or evidence of a compiler’s output.
- State width, interpretation and any architecture convention beside the activity that needs it.
- Separate C language guarantees, instruction semantics and mathematical bit operations.
- Use British English and explain terms before asking the learner to use them. Give each
  section a teaching purpose; use selected sections when the full template adds repetition.
- Keep all storage and cache ownership under Bit Lab’s namespace. Never clear other projects’
  caches or modify their browser state.
- Run `npm run check` before proposing a change. Report what browser checks actually covered.
  Passing tests establishes behaviour, not that a lesson has received an independent editorial review.
