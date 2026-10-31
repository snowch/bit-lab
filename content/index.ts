// Copyright © 2026 Christopher Snow
import { parseLesson } from "@platform/lesson-schema";
import { answer, binary, type Topic } from "@bl/bit-model";

export interface Chapter {
  id: Topic;
  title: string;
  line: string;
  question: string;
  before: string;
  try: string;
  explanation: string;
  limit: string;
  a: number;
  b: number;
  width: number;
  task: string;
  hint: string;
  mistake: string;
  smaller: string;
  partial: string;
  reference: string;
}

export const chapters: Chapter[] = [
  {
    id: "patterns",
    title: "Build a number from bits",
    line: "Place values, binary and hexadecimal.",
    question: "How can four switches hold a number?",
    before:
      "A bit has two possible values: 0 and 1. Give each position a weight. Starting on the right, the weights are 1, 2, 4 and 8. Add the weights whose bits are 1. This is binary notation.\n\nA four-bit word is a group of four bits. Its width fixes how many positions it has. Leading zeroes keep those positions visible. The word `0101` has the same unsigned value as `101`, but has a different width.",
    try: "Start with every bit off. Before turning on the leftmost bit, predict how much it will add. Then make the same total using only the other three positions. Is that possible?",
    explanation:
      "Each new position has twice the weight of the one to its right. Its weight is one greater than the sum of all the smaller weights. That is why each unsigned value has just one pattern at a given width.\n\nHexadecimal groups bits in fours. The symbols `0` to `9`, then `A` to `F`, name the sixteen patterns of a group. The prefix `0x` means hexadecimal; `0b` means binary. Changing notation changes how you write the value, not the bits you store.",
    limit:
      "This first reading is unsigned: every weight is positive. The next lesson gives the same bits a signed reading.",
    a: 11,
    b: 0,
    width: 4,
    task: "Read the four-bit pattern `1011` as an unsigned number. Enter its decimal value.",
    hint: "Add the weights of the positions containing 1.",
    mistake:
      "The leftmost position is worth 8, not 4. Positions start at the right.",
    smaller: "For `0011`, the two selected weights are 2 and 1.",
    partial: "In `1011`, select 8, skip 4, then select 2 and 1.",
    reference: "gates-to-alu.html",
  },
  {
    id: "readings",
    title: "Read the same bits two ways",
    line: "Unsigned values and two’s complement.",
    question: "Can a pattern change its meaning without changing a bit?",
    before:
      "An unsigned four-bit word uses weights 8, 4, 2 and 1. For a signed reading called **two’s complement**, change only the leftmost weight: it becomes −8. The other weights stay positive.\n\nThis makes patterns with a leading 1 negative. It also gives zero a single pattern. A signed or unsigned reading is a choice you make about the word; the bits do not carry a separate type label.",
    try: "Set the word to `0111`. Predict both readings after you turn on the leftmost bit. Reveal the values, then switch that bit off again. Notice which weights changed.",
    explanation:
      "When the leading bit is 0, both readings agree. When it is 1, the signed reading is the unsigned reading minus the number of possible patterns. At four bits there are sixteen patterns.\n\nMoving one step past the largest unsigned pattern returns to zero. Moving through the same patterns with a signed reading crosses from the largest positive value to the most negative value. The pattern sequence has not changed; your interpretation has.",
    limit:
      "Two’s complement is a representation. It does not by itself determine whether a programming language permits an overflowing calculation.",
    a: 13,
    b: 0,
    width: 4,
    task: "Read `1101` as a four-bit two’s complement number. Enter its signed decimal value.",
    hint: "Use a negative weight for the leftmost position.",
    mistake:
      "The leading 1 is part of the value; it is not a sign attached to the remaining magnitude.",
    smaller: "The pattern `1000` selects just the weight −8.",
    partial: "For `1101`, add −8, 4 and 1.",
    reference: "readings-drills.html",
  },
  {
    id: "adder",
    title: "Follow a carry through an adder",
    line: "Logic gates, sums and fixed-width results.",
    question: "What happens when one column needs to write two bits?",
    before:
      "An adder combines two bits and a carry from the previous column. The sum output stays in this column; the carry output goes to the next one. Together they represent the total of the three inputs.\n\nA logic gate computes a bit from other bits. AND gives 1 when both inputs are 1. XOR gives 1 when the inputs differ. OR gives 1 when at least one input is 1. Two XOR gates compute the sum. Two AND gates and an OR gate compute the carry.",
    try: "Set A to `0111` and B to `0001`. Predict which columns will produce a carry. Reveal the result, then follow the arrows from the rightmost column to the left.",
    explanation:
      "The first XOR says whether the two operand bits differ. XOR that with the incoming carry to get the sum bit. An outgoing carry is needed if both operand bits are 1, or if the first XOR and the incoming carry are both 1.\n\nChaining these small adders builds a word adder. The drawing computes each column from the carry coming into it. A carry leaving the leftmost column does not fit in the result word. Keeping only the word’s bits is arithmetic modulo the number of possible patterns.",
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
    id: "flags",
    title: "Subtract and explain the flags",
    line: "Negation, borrowing and signed overflow.",
    question: "Why can the same adder perform subtraction?",
    before:
      "At a fixed width, subtracting B can be computed as adding the bitwise inverse of B and then adding 1. Inversion changes every 0 to 1 and every 1 to 0. The final extra 1 enters as the first carry.\n\nThe result bits do not tell you everything about the calculation. Four additional bits, called flags, record useful facts. N copies the result’s leading bit. Z says the result is zero. C records the carry out of the adder. V says the exact signed answer is outside the signed range.",
    try: "Try A smaller than B, then A equal to B. Predict whether subtraction needs a borrow in each case. Reveal C and compare it with your prediction. Then find an example where N and V are both 1.",
    explanation:
      "For subtraction using this adder, C = 1 means **no unsigned borrow**. It does not mean that the result is positive. N describes the stored pattern’s signed reading; V tells you whether that reading represents the exact signed answer.\n\nCarry and signed overflow answer different questions. Carry concerns the unsigned calculation. Signed overflow concerns the signed range. You must choose which question matters before using a flag.",
    limit:
      "This is the Arm subtraction carry convention. x86’s carry flag reports a borrow for subtraction, so its meaning is the opposite. The model uses small words for inspection; it is not an Arm instruction emulator.",
    a: 3,
    b: 9,
    width: 4,
    task: "Compute four-bit 3 − 9 using the subtraction adder. Under the Arm convention, is C 0 or 1? Enter the flag bit.",
    hint: "C tells you whether the unsigned subtraction avoided a borrow.",
    mistake:
      "For this subtraction convention, borrowing clears C; it does not set it.",
    smaller:
      "Subtracting a smaller unsigned value from a larger one needs no borrow.",
    partial:
      "Compare unsigned 3 with unsigned 9. Decide whether the subtraction borrows.",
    reference: "adding-to-subtracting.html",
  },
  {
    id: "masks",
    title: "Select and change individual bits",
    line: "AND, OR and XOR as tools for packed data.",
    question: "How can one word hold several independent settings?",
    before:
      "A word need not represent one number. Each bit can represent a separate setting. A **mask** is a pattern that selects positions for an operation.\n\nAND with a mask keeps positions where the mask is 1 and clears the others. OR sets selected positions. XOR toggles selected positions: a selected 0 becomes 1, and a selected 1 becomes 0. Each column works independently, with no carry between columns.",
    try: "Choose a mask with just one bit on. Predict what AND, OR and XOR will each do to that position. Reveal each result. Then turn on a second mask bit and explain why the first position is unaffected.",
    explanation:
      "To extract a group of bits, first clear the surrounding positions with AND. If you need the group as a number starting at bit zero, move it right afterwards. The next lesson explores that movement.\n\nUse OR when a setting must end up on, even if it is already on. Use XOR when it must change. Applying the same XOR mask twice restores the original pattern; applying an OR mask twice leaves the selected bits on.",
    limit:
      "These operations act on fixed-width patterns. In C, integer promotions and operand types also affect the width and signedness of an expression.",
    a: 182,
    b: 15,
    width: 8,
    task: "Keep only the low four bits of `0b10110110` using AND with `0b00001111`. Enter the result as a number.",
    hint: "A zero in the mask forces that result position to zero.",
    mistake:
      "AND does not shift the selected bits. Their positions stay the same.",
    smaller: "AND with an all-zero mask produces zero in every position.",
    partial:
      "The four remaining bits are the rightmost four bits of the input.",
    reference: "bit-lab.html",
  },
  {
    id: "shifts",
    title: "Move bits without losing their meaning",
    line: "Logical shifts, arithmetic shifts and discarded bits.",
    question: "What should fill the gap when a word moves right?",
    before:
      "A shift moves bits a chosen number of positions. Bits that leave the word are discarded. A left shift fills the low positions with zeroes. A logical right shift fills the high positions with zeroes.\n\nAn arithmetic right shift fills the high positions with copies of the original leading bit. For two’s complement, this preserves the sign. The arrows below show movement within the word; the discarded bits are not stored elsewhere by this model.",
    try: "Use an input whose leading bit is 1. Predict whether logical and arithmetic right shifts will agree. Reveal both. Then repeat with the leading bit off.",
    explanation:
      "A left shift multiplies an unsigned value by a power of two and keeps the bits that fit. A logical right shift divides an unsigned value by a power of two, rounding down. An arithmetic right shift does the same for the signed value, also rounding down.\n\nThat last rule matters for a negative odd value. Rounding down makes the result more negative than rounding towards zero. You cannot always replace signed division with an arithmetic shift and expect the same result.",
    limit:
      "Shift counts here range from zero to one less than the word width. The model does not define C’s shift rules. In C11, right shifting a negative signed value is implementation-defined; signed division truncates towards zero.",
    a: 245,
    b: 2,
    width: 8,
    task: "Arithmetic-right-shift the eight-bit pattern `11110101` by 2 places. Enter the resulting pattern as an unsigned value, in decimal, hex or binary.",
    hint: "Move every bit two places right, then fill the two high positions with the old leading bit.",
    mistake:
      "Filling with zeroes would be a logical shift. The requested operation copies the sign bit.",
    smaller: "Shifting an all-ones word arithmetically leaves it all ones.",
    partial:
      "The first two result bits are 11. Keep the first six input bits after them.",
    reference: "bit-lab.html",
  },
  {
    id: "alu",
    title: "Bring the operations together in an ALU",
    line: "Operation selection, one result word and the flags it produces.",
    question: "How can one unit add, subtract, shift and combine bits?",
    before:
      "An **arithmetic logic unit**, or **ALU**, brings several operations together. The same input words feed an adder and logic circuits. This model also includes a shifter. An operation control selects which calculation supplies the result.\n\nThe selector is called a **multiplexer**: it connects one of several inputs to one output. Changing the operation changes the selected path, even when A and B stay the same. This is how the separate operations you have explored become one unit.",
    try: "Start with A = `0111` and B = `0001`. Predict the result and N, Z, C and V for ADD. Reveal them and follow the highlighted path. Keep A and B unchanged, select SUB and predict again. Then select AND. Which flags still describe the result, and which no longer come from an adder?\n\nTry a shift as well. LSL means logical shift left, LSR means logical shift right, and ASR means arithmetic shift right. Each moves A by one place here. NOT inverts A. These four operations do not use B.",
    explanation:
      "The adder serves both ADD and SUB. For ADD it receives B and an initial carry of zero. For SUB it receives the inverse of B and an initial carry of one. Open the adder detail below the result to inspect those inputs and the carry chain. The logic path combines corresponding bits without a carry. The shifter moves A’s bits by one place.\n\nAfter the selector, N copies the result’s leading bit. Z is 1 only when every result bit is zero. These two flags can describe any selected result. Carry and overflow need more information: C comes from the adder’s final carry, or from the bit shifted out; V comes from checking whether the signed arithmetic answer fits.\n\nThis model shows a dash for C and V on logical operations, and for V on shifts. A dash means **not produced**, not zero and not a remembered flag. Changing from ADD to AND must therefore change the flag display as well as the result path. A processor’s instruction rules determine whether its stored flags are updated, cleared or preserved.\n\nThe ALU shown here has no clock or memory. Changing an input recomputes its outputs; Reveal result only uncovers them. A register is needed to remember a result or flags between operations. In the next lesson, a comparison uses a subtraction’s flags to make a decision.\n\nFor more gate detail and the breadboard build, open the [original gate-level ALU](calculator/docs/bit-lab.html).",
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
  {
    id: "compare",
    title: "Make a signed or unsigned decision",
    line: "Comparison flags and conditional branches.",
    question: "Can the same comparison say both less and greater?",
    before:
      "A comparison can subtract B from A, record the flags and discard the result. An unsigned less-than decision asks whether subtraction needed a borrow. With the Arm convention, that means C = 0.\n\nA signed decision must account for overflow. If the signed subtraction fits, N tells you whether A is less than B. If it overflows, the stored sign is reversed. Signed less-than therefore means N and V differ.",
    try: "Set A’s leading bit and clear B’s. Predict the unsigned and signed less-than decisions. Reveal them, then find an example where using N alone gives the wrong signed decision.",
    explanation:
      "The flags come from one subtraction. Choosing a condition gives those flags meaning. Arm names the unsigned less-than condition LO and the signed less-than condition LT. Equality uses Z, and works for both readings.\n\nThis explains why a compiled comparison needs a condition suited to the operands. In C, the comparison uses the operand types after conversions. Merely seeing a negative-looking bit pattern does not tell you which condition a compiler should choose.",
    limit:
      "This is a small-word model of the condition rules, not a recorded compiler listing. Real C conversions and instruction selection are explored further in Assembly Lab and the original C examples.",
    a: 8,
    b: 7,
    width: 4,
    task: "Interpret A = `1000` and B = `0111` as four-bit two’s complement. Is A less than B? Enter 1 for yes or 0 for no.",
    hint: "Read each operand as a signed value before comparing them.",
    mistake:
      "An unsigned comparison would give a different answer for these patterns.",
    smaller: "Any negative signed value is less than zero.",
    partial:
      "A has only the negative weight selected. B has only positive weights selected.",
    reference: "who-decides.html",
  },
  {
    id: "widen",
    title: "Preserve a value in a wider word",
    line: "Zero extension, sign extension and narrowing.",
    question: "Which bits belong in the new positions?",
    before:
      "A byte is eight bits. Moving a byte into a wider word creates new high positions. **Zero extension** fills them with zeroes and preserves the unsigned value. **Sign extension** copies the original leading bit and preserves the two’s complement value.\n\nNeither operation changes the original low bits. The choice concerns how the wider word should interpret the value you began with.",
    try: "Use a byte with its leading bit set. Predict whether the two extensions produce the same wider pattern. Reveal both, then compare the signed values before and after sign extension.",
    explanation:
      "When the original leading bit is zero, both extensions add zeroes. When it is one, they differ. Zero extension makes the wider signed reading positive. Sign extension keeps it negative by filling the new high positions with ones.\n\nNarrowing removes high positions. It always preserves the remaining low bits, but preserves the original value only when that value fits the destination’s range. Extending a narrowed word cannot recover discarded information.",
    limit:
      "The lab widens eight bits to sixteen so every bit remains visible. Real instructions may use other widths. A widening instruction’s choice of zero or sign extension must be checked for that instruction.",
    a: 234,
    b: 0,
    width: 8,
    task: "Sign-extend the byte `0xEA` to sixteen bits. Enter the wider pattern as an unsigned number, in hex, binary or decimal.",
    hint: "Look at the leading bit of the original byte.",
    mistake:
      "A negative byte needs ones in all the new high positions to retain its signed value.",
    smaller:
      "Sign-extending an all-ones byte gives an all-ones sixteen-bit word.",
    partial: "The low byte stays EA. The high byte becomes FF.",
    reference: "bytes-to-registers.html",
  },
  {
    id: "memory",
    title: "Lay out a word in memory",
    line: "Byte addresses and endianness.",
    question: "Which byte goes at the smaller address?",
    before:
      "A byte-addressed memory gives each byte its own address. A sixteen-bit word occupies two such positions. Its low byte contains the low eight bits; its high byte contains the high eight.\n\n**Little-endian** order places the low byte at the smaller address. **Big-endian** order places the high byte there. Endianness describes the order of bytes in memory, not a reversal of the bits within each byte.",
    try: "Give the high and low bytes different patterns. Predict which byte appears at address 0 in each order. Reveal the memory cells. Switch the order and check that the word’s numeric value stays the same.",
    explanation:
      "Writing and reading with the same byte order reconstructs the original word. Reading those bytes with the opposite order exchanges the high and low byte roles. This is why a file format or network protocol must specify its byte order.\n\nA hexadecimal word is conventionally written with its most significant digit first. That display convention does not tell you the order of its bytes in memory. Look at the addresses and the format’s rule.",
    limit:
      "The two labelled cells model byte order only. They do not model pointers, alignment, caches or memory protection.",
    a: 0x6b2d,
    b: 0,
    width: 16,
    task: "Store the sixteen-bit word `0x6B2D` in little-endian order at addresses 0 and 1. What byte is stored at address 0?",
    hint: "Little-endian puts the low byte at the smaller address.",
    mistake: "Do not reverse the bits within a byte.",
    smaller: "The rightmost pair of hexadecimal digits describes the low byte.",
    partial:
      "Separate the written word into the high byte 6B and the low byte 2D.",
    reference: "twos-complement.html",
  },
];

export const lessons = chapters.map((c, order) => {
  const expected = answer(c.id, c.a, c.b, c.width);
  return parseLesson({
    id: c.id,
    title: c.title,
    module: order,
    order,
    sectionLayout: "selected",
    showTimeModelNotes: false,
    objectives: [c.line],
    prerequisites: order ? [chapters[order - 1]!.id] : [],
    sections: [
      { kind: "question", title: c.question, prose: c.before },
      {
        kind: "prediction",
        title: "Predict, then inspect",
        prose: c.try,
        interactives: [
          {
            id: `${c.id}-lab`,
            kind: c.id === "alu" ? "alu-lab" : "word-lab",
            timeModel: "word",
            caption:
              "Change the inputs, predict the result, then reveal it. Changing an input hides the result again.",
            props: { topic: c.id },
          },
        ],
      },
      { kind: "explanation", title: "Why it works", prose: c.explanation },
      {
        kind: "challenge",
        title: "Try a new case",
        prose:
          "Work out an answer before using the calculator. Your answer is saved in this browser.",
        interactives: [
          {
            id: `${c.id}-check`,
            kind: "challenge",
            timeModel: "word",
            caption: "Check your answer. Hints are available one at a time.",
            props: { challengeId: `${c.id}-practice` },
          },
        ],
      },
    ],
    challenges: [
      {
        id: `${c.id}-practice`,
        title: c.id === "alu" ? "Select the ALU’s output" : c.task,
        task:
          (c.id === "alu" ? `${c.task}\n\n` : "") +
          "You can enter decimal, `0x` hexadecimal or `0b` binary. Use a minus sign for a negative answer.",
        gradedDirection: "answer",
        fields: [{ id: "value", label: "Your answer", kind: "text" }],
        initial: { answers: { value: "" } },
        tests: {
          kind: "answers",
          grader: "word",
          cases: [
            {
              label:
                c.id === "alu"
                  ? "XOR selected for A = 0110 and B = 0011"
                  : c.task,
              given: { topic: c.id, a: c.a, b: c.b, width: c.width },
              expect: { value: expected },
            },
          ],
        },
        hints: [
          c.hint,
          c.mistake,
          c.smaller,
          c.partial,
          `The answer is ${expected}${expected >= 0 ? ` (binary ${binary(expected, c.id === "widen" ? 16 : c.width)})` : ""}. ${c.partial}`,
        ],
        reference: { answers: { value: String(expected) } },
      },
    ],
    modelVsReality: c.limit,
    originalityNote: {
      textbookExample: "A static conversion or arithmetic worksheet.",
      howThisDiffers: `Uses a configurable word model, prediction before reveal, and a separately graded application of ${c.line.toLowerCase()} Adapted from the author's programmer-calculator material with a new sequence.`,
    },
  });
});

export const futurePaths = [
  {
    title: "Multiply, divide and round",
    line: "Products wider than a word, division and fixed-point scaling.",
  },
  {
    title: "Approximate real numbers",
    line: "Floating-point representation, rounding and loss of precision.",
  },
  {
    title: "Read structured data",
    line: "Text encodings, packed fields and binary formats.",
  },
  {
    title: "Connect data to programs",
    line: "C conversions, compiler evidence and links into Assembly Lab.",
  },
];
