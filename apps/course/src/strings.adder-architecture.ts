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
