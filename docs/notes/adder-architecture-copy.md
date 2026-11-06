# Adder architecture: canonical learner copy

Adapted in a separate drafting pass from the approved architecture mock and its independent learner/technical review. No preview chrome, extra lesson or new quiz is introduced. The existing fourteen-plus-five adder exercise and XOR ALU exercise keep their IDs, tasks and checked answers.

Lesson 3 starts with 3 + 3 and demonstrates the general three-one rule before deriving the gates. Its selected-column detail exposes all three inputs and both outputs after Reveal result, without requiring an optional disclosure. XOR, AND and OR are defined locally beside the gate proof. The five equations remain as the accessible text equivalent of the gate drawing. The full chain stays as context.

Lesson 7 retains all nine operations and the connected ALU/flag figure. Its required arithmetic detail reuses the selected-column explanation; a reminder points back to lesson 3. The default is also 3 + 3. The 7 + 1 signed-overflow illustration is explicitly a separate input pair. The Assembly Lab link is a companion activity, not a course prerequisite.

## Exact UI source

```ts
// Copyright © 2026 Christopher Snow

// Separate drafting pass from checked model facts; canonical record: docs/notes/adder-architecture-copy.md
// Literal {name} placeholders are replaced with values from the displayed model state.
export const ADDER_ARCHITECTURE_STRINGS = {
  shared: {
    bit: "Bit {bit}",
    selectedColumn: "Inspect bit",
    inputA: "A",
    inputB: "B",
    adderB: "B at the adder",
    carryIn: "Carry in",
    carryOut: "Carry out",
    kept: "Kept bit",
    pattern: "Pattern",
    unsignedResult: "Unsigned result",
    equation:
      "{a} + {b} + {carryIn} = {total}, written {binaryTotal} in binary.",
    firstXor: "First XOR",
    operandAnd: "Operand AND",
    carryAnd: "Carry AND",
    resultXor: "Result XOR",
    carryOr: "Carry OR",
    gateXor: "{left} XOR {right} = {result}",
    gateAnd: "{left} AND {right} = {result}",
    gateOr: "{left} OR {right} = {result}",
    initialCarry: "Initial carry in",
    carryFrom: "Carry in from bit {previousBit}",
    carryTo: "Carry out to bit {nextBit}",
    carryBeyondWord: "Carry out beyond the {width}-bit word",
  },
  bitLab: {
    title: "One column inside the ALU",
    intro:
      "An arithmetic logic unit (ALU) performs arithmetic and logic operations. A selector chooses the result. This four-bit view follows the shared adder for ADD and SUB.\n\nSelect a position to inspect one full adder: two operand bits and a carry in produce a kept bit and a carry out.",
    inputHeading: "Input words",
    operation: "Operation",
    add: "ADD",
    sub: "SUB",
    addNote: "ADD passes B unchanged and starts with carry in 0.",
    subNote:
      "SUB inverts B, changing each 0 to 1 and each 1 to 0. The same adder starts with carry in 1.",
    aluLabel: "ALU",
    wordAdderLabel: "Shared word adder",
    adderResultLabel: "Adder result",
    wordResultLabel: "Result word",
    functionalLabel: "Functional four-bit model",
    logicPath: "Logic operations",
    selectorLabel: "Result selector",
    wordHeading: "The selected arithmetic path",
    columnHeading: "Inside bit {bit}",
    gateHeading: "The gates produce both outputs",
    gateGuide:
      "XOR gives 1 when its inputs differ. AND gives 1 when both are 1. OR gives 1 when either or both are 1.",
    wireGuide:
      "A dot marks a connection between wires. Crossing lines without a dot are not connected.",
    changeGuide:
      "Change an input or the operation. Outputs follow immediately, with no clock.",
    scope:
      "The connections show logical dependencies. This model omits electrical timing and physical processor layout.",
    lessonLinkLabel:
      "Assembly Lab, Module 1, lesson 3: Arithmetic with four bits",
    lessonLinkHref:
      "https://snowch.github.io/assembly-lab/#/lesson/four-bit-arithmetic",
  },
  adder: {
    title: "Inside bit {bit}",
    intro:
      "Select a position to inspect one full adder: two operand bits and a carry in produce a kept bit and a carry out.",
    gateHeading: "The gates produce both outputs",
    gateGuide:
      "XOR gives 1 when its inputs differ. AND gives 1 when both are 1. OR gives 1 when either or both are 1.",
    wireGuide:
      "A dot marks a connection between wires. Crossing lines without a dot are not connected.",
    scope:
      "The connections show logical dependencies. This model omits electrical timing and physical processor layout.",
  },
} as const;
```

## Exact affected chapter records

The following records include the retained exercise copy to make the scope reviewable. Only the explanation/try prose described above changes.

```ts
  {
    id: "adder",
    title: "Follow a carry through an adder",
    line: "Logic gates, sums and fixed-width results.",
    question: "What happens when one column needs to write two bits?",
    before:
      "A full adder combines two operand bits and a carry from the previous column. Its sum output is the bit kept in this column; its carry output goes to the next column on the left. Together they represent the total of the three inputs.\n\nFor three input ones, binary `1 + 1 + 1 = 11`: keep 1 in this column and pass carry 1 to the next. A logic gate computes a bit from other bits. After revealing the addition, inspect how the gates produce both outputs.",
    try: "Start with A = `0011` and B = `0011`. Predict which columns will produce a carry. Reveal the result, then follow the arrows from the rightmost column to the left. Inspect bit 1: add both operand bits and the incoming carry, then follow the kept bit and carry out through the gates.",
    explanation:
      "The carry is one bit passed left; it does not replace either operand bit. The first XOR says whether the two operand bits differ. XOR that with the incoming carry to get the sum bit. An outgoing carry is needed if both operand bits are 1, or if the first XOR and the incoming carry are both 1.\n\nChaining these small adders builds a word adder. The drawing computes each column from the carry coming into it. A carry leaving the leftmost column does not fit in the result word. Keeping only the word’s bits is arithmetic modulo the number of possible patterns.",
    limit:
      "The diagram shows logical dependencies. It does not model electrical delay or the faster carry circuits used in many processors.",
    a: 14,
    b: 5,
    width: 4,
    task: "Add unsigned 14 and 5 in a four-bit word. What unsigned value remains in the result word? Do not include the carry beyond it.",
    hint: "First find the full sum, then keep the low four bits.",
    mistake: "A carry outside the word is separate from the stored result.",
    smaller: "At four bits, adding 1 to 15 returns the result word to zero.",
    partial:
      "There are sixteen patterns. Subtract sixteen once from the full sum.",
    reference: "gates-to-alu.html",
  },
  {
    id: "alu",
    title: "Bring the operations together in an ALU",
    line: "Operation selection, one result word and the flags it produces.",
    question: "How can one unit add, subtract, shift and combine bits?",
    before:
      "An **arithmetic logic unit**, or **ALU**, brings several operations together. The same input words feed an adder and logic circuits. This model also includes a shifter. An operation control selects which calculation supplies the result.\n\nThe selector is called a **multiplexer**: it connects one of several inputs to one output. Changing the operation changes the selected path, even when A and B stay the same. This is how the separate operations you have explored become one unit. [Follow a carry through an adder](#/lesson/adder) shows how one column produces its kept bit and carry out.",
    try: "Start with A = `0011` and B = `0011`. Predict the result and N, Z, C and V for ADD. Reveal them and inspect bit 1. Compare both operand bits with the incoming carry. Follow its kept bit and carry out, then follow the carry towards bit 3. Find where the result feeds N and Z, and where the two carries feed V. Compare the signed and unsigned readings beneath the circuit. Keep A and B unchanged, select SUB and predict again. Then select AND. Which flags still describe the result, and which no longer come from an adder?\n\nTry a shift as well. LSL means logical shift left, LSR means logical shift right, and ASR means arithmetic shift right. Each moves A by one place here. NOT inverts A. These four operations do not use B.",
    explanation:
      "The adder serves both ADD and SUB. For ADD it receives B and an initial carry of zero. For SUB it receives the inverse of B and an initial carry of one. Each FA box is a full adder: it combines two input bits and a carry, producing one result bit and the next carry. Follow the carry chain from right to left. Inspect the selected adder column below the result to follow its three inputs and two outputs. The logic path combines corresponding bits without a carry. The shifter moves A’s bits by one place.\n\nAfter the selector, N copies the result’s leading bit. Z comes from a NOR gate connected to every result bit: OR the bits together, then invert that value. Z is therefore 1 only when every result bit is zero. These two flags can describe any selected result. Carry and overflow need more information: C comes from the adder’s final carry, or from the bit shifted out; V is the carry into the sign bit XOR the carry out. Different carries mean the exact signed arithmetic answer does not fit. For a separate example, `0111 + 0001` gives `1000`: unsigned 8 fits, so C = 0, but signed +8 does not fit the range −8 to +7, so V = 1. The stored word reads as −8 when interpreted as two’s complement.\n\nThis model shows a dash for C and V on logical operations, and for V on shifts. A dash means **not produced**, not zero and not a remembered flag. Changing from ADD to AND must therefore change the flag display as well as the result path. A processor’s instruction rules determine whether its stored flags are updated, cleared or preserved.\n\nThe connected drawing shows the selected operation. Open Operation selection overview to see how a multiplexer chooses between the arithmetic, logic and shift paths.\n\nThe ALU shown here has no clock or memory. Changing an input recomputes its outputs; Reveal result only uncovers them. A register is needed to remember a result or flags between operations. In the next lesson, a comparison uses a subtraction’s flags to make a decision.\n\nFor a real instruction using this arithmetic, see [Assembly Lab, Module 1, lesson 3: Arithmetic with four bits](https://snowch.github.io/assembly-lab/#/lesson/four-bit-arithmetic). It connects a 32-bit `add` to its input registers and destination.\n\nFor more gate detail and the breadboard build, open the [original gate-level ALU](calculator/docs/bit-lab.html).",
    limit:
      "This is a four-bit teaching ALU with a one-place shifter, not an instruction emulator or a timing simulation. SUB uses the Arm no-borrow carry convention. Logical operations produce N and Z here, but no C or V; shifts also produce the bit shifted out as C. These are the model’s output rules, not a claim about every processor’s stored flags. Real machines can organise the shifter and execution units differently.",
    a: 6,
    b: 3,
    width: 4,
    task: "A four-bit ALU receives A = `0110` and B = `0011`. The operation control selects XOR. What unsigned value reaches the result output?",
    hint: "Follow the selected logic path. XOR produces 1 where the two input bits differ.",
    mistake:
      "The inputs also reach the adder, but the selector does not choose its sum. Do not add A and B.",
    smaller:
      "With one-bit inputs 1 and 1, XOR gives 0; with 1 and 0, XOR gives 1.",
    partial:
      "Read the columns from left to right: equal, different, equal, different. Keep that order in the result.",
    reference: "bit-lab.html",
  },
```

## Templates and state

Literal `{name}` placeholders take displayed model values. `carryBeyondWord` takes `{width}` because the word explorer supports widths beyond four; the ALU architecture remains explicitly four-bit. The focused B value is the value at the adder, including inversion during SUB. Bit zero uses the initial carry label rather than inventing a previous bit. Highest-column carry is outside the selected word.

Editing input data or choosing an operation hides the existing prediction result again. Selecting a column inspects the same revealed operation; it does not execute a processor instruction. The model is functional and has no clock. Local scope and wire-junction explanations remain visible with the drawing. No physical processor layout or electrical timing is claimed.
