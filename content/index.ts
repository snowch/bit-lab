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
  checkTitle: string;
  retry: string;
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
      "A bit can be 0 or 1. A four-bit word is a group of four bits. From right to left, their place values are 1, 2, 4 and 8. Add the place values of the bits that are 1 to read the word as a number. This is **binary notation**.\n\nThis reading is **unsigned** because all the place values are positive. Leading zeroes show the width of the word. Both `0101` and `101` represent 5, and only the first has four bits.",
    try: "The page starts with A = `0000`. Predict the value when only the leftmost bit is on. Press **A bit 3**, select **Reveal result** and read **Unsigned**. Then turn bit 3 off and turn bits 2, 1 and 0 on. Predict and reveal the value again. Can the three smaller places add up to the value of bit 3?",
    explanation:
      "Each new position has twice the weight of the one to its right. Its weight is one greater than the sum of all the smaller weights. That is why each unsigned value has just one pattern at a given width.\n\nHexadecimal groups bits in fours. The symbols `0` to `9`, then `A` to `F`, name the sixteen patterns of a group. The prefix `0x` marks a hexadecimal number. The prefix `0b` marks a binary number. Both notations can describe the same stored bits.",
    limit:
      "This experiment uses four bits so you can inspect every place value. The next lesson uses the same width to represent negative numbers.",
    a: 11,
    b: 0,
    width: 4,
    task: "What unsigned value does the four-bit pattern `1011` represent?",
    checkTitle: "Read an unsigned word",
    retry:
      "Count the positions containing 1, then write down the place value for each.",
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
    try: "The page starts with A = `0111`. Select **Reveal result** and find **Unsigned** and **Signed**. Predict both values for `1111`, then press **A bit 3** and select **Reveal result** again. Why do the readings agree for `0111` and differ for `1111`?",
    explanation:
      "When the leading bit is 0, both readings agree. When it is 1, the signed reading is the unsigned reading minus the number of possible patterns. At four bits there are sixteen patterns.\n\nMoving one step past the largest unsigned pattern returns to zero. Moving through the same patterns with a signed reading crosses from the largest positive value to the most negative value. The pattern sequence has not changed; your interpretation has.",
    limit:
      "Two’s complement is a representation. It does not by itself determine whether a programming language permits an overflowing calculation.",
    a: 13,
    b: 0,
    width: 4,
    task: "What signed value does `1101` represent in four-bit two’s complement?",
    checkTitle: "Read a signed word",
    retry: "Check the sign of your answer before adding the place values.",
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
      "A **full adder** adds three bits: one from each input word and a **carry in** from the column to its right. It keeps the rightmost bit of the sum in its own column and passes the other bit to the left as **carry out**. The rightmost column starts with carry in 0.\n\nFor example, three input ones add to binary `11`. The kept bit is 1 and the carry out is 1. A **logic gate** computes a bit from other bits.",
    try: "The page starts with A = B = `0011`. Predict which columns pass a carry of 1 to the left. Select **Reveal result**, then follow the arrows from bit 0 towards bit 3. Select **Bit 1** in the carry chain and read **Carry in**, **Kept bit** and **Carry out**. How does the carry from bit 0 change the sum at bit 1?",
    explanation:
      "The XOR gate gives 1 when its two inputs differ. The first XOR compares the two input bits. A second XOR combines that answer with the incoming carry to find the kept bit. The carry out is 1 when at least two of the three inputs are 1.\n\nEach column uses the carry from the column on its right. The four-bit result keeps four bits, so the leftmost carry appears separately as **Carry beyond the word**.",
    limit:
      "The diagram shows logical dependencies. It does not model electrical delay or the faster carry circuits used in many processors.",
    a: 14,
    b: 5,
    width: 4,
    task: "Add unsigned 14 and 5 in a four-bit word. What unsigned value remains in the result word? Do not include the carry beyond it.",
    checkTitle: "Keep the four-bit sum",
    retry:
      "Write the full sum in binary and draw a line before its rightmost four bits.",
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
      "At a fixed width, subtracting B can be computed as adding the bitwise inverse of B and then adding 1. Inversion changes every 0 to 1 and every 1 to 0. The final extra 1 enters as the first carry. An **unsigned borrow** is needed when A is smaller than B. This adder uses the Arm convention: C is 0 when there is a borrow and 1 otherwise.\n\nThe result bits do not tell you everything about the calculation. Four additional bits, called flags, record useful facts. N copies the result’s leading bit. Z says the result is zero. C records the carry out of the adder. V says the exact signed answer is outside the signed range.",
    try: "The page starts with A = `0011` and B = `0101`. Treat both as unsigned. Predict whether 3 − 5 needs a borrow. Select **Reveal result** and check **C**. Then press **B bits 2 and 1** to change B to `0011`. Predict again and reveal the result. What does C tell you when A and B are equal?",
    explanation:
      "The two C values tell you whether the unsigned result fits. The signed reading of the stored result uses a different range. **N** is the sign bit of that stored result. **V** is 1 if the exact signed answer is outside −8 to +7.\n\nTo see N and V both set, turn on **A bit 2** to make A = `0111`, then turn on **B bits 3 and 2** to make B = `1111`. Predict the signed result before you reveal it. Compare the exact signed difference with **Signed**, **N** and **V**.",
    limit:
      "This is the Arm subtraction carry convention. x86’s carry flag reports a borrow for subtraction, so its meaning is the opposite. The model uses small words for inspection; it is not an Arm instruction emulator.",
    a: 3,
    b: 9,
    width: 4,
    task: "Subtract unsigned 9 from unsigned 3 in the four-bit model. What is C under the Arm convention?",
    checkTitle: "Read the carry flag",
    retry: "Decide whether you can take 9 away from 3 without borrowing.",
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
    try: "The page starts with A = `10100110`, **Mask** = `00001111` and **Operation** = **AND**. Predict the leftmost four bits of **Result**. Select **Reveal result** to check them. Then select **OR**, followed by **XOR**, from **Operation**. For each, predict result bits 1 and 0 before you reveal them. Which operation changes an input 1 to 0 where the mask is 1?",
    explanation:
      "To extract a group of bits, first clear the surrounding positions with AND. If you need the group as a number starting at bit zero, move it right afterwards. The next lesson explores that movement.\n\nUse OR when a setting must end up on, even if it is already on. Use XOR when it must change. Applying the same XOR mask twice restores the original pattern; applying an OR mask twice leaves the selected bits on.",
    limit:
      "These operations act on fixed-width patterns. In C, integer promotions and operand types also affect the width and signedness of an expression.",
    a: 182,
    b: 15,
    width: 8,
    task: "What unsigned value results from `0b10110110` AND `0b00001111`?",
    checkTitle: "Keep the low four bits",
    retry: "Line up the input and the mask, starting at the rightmost bit.",
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
    try: "The page starts with A = `11100101`, **Shift** = **Logical right** and **Places** = **1**. Predict the leftmost bit of **Result**, then select **Reveal result**. Change **Shift** to **Arithmetic right** and repeat. Turn off **A bit 7** and try both shifts again. When do both shifts fill the new place with the same bit?",
    explanation:
      "A left shift multiplies an unsigned value by a power of two and keeps the bits that fit. A logical right shift divides an unsigned value by a power of two, rounding down. An arithmetic right shift does the same for the signed value, also rounding down.\n\nThat last rule matters for a negative odd value. Rounding down makes the result more negative than rounding towards zero. You cannot always replace signed division with an arithmetic shift and expect the same result.",
    limit:
      "Shift counts here range from zero to one less than the word width. The model does not define C’s shift rules. In C11, right shifting a negative signed value is implementation-defined; signed division truncates towards zero.",
    a: 245,
    b: 2,
    width: 8,
    task: "Shift the eight-bit pattern `11110101` right by two places using an arithmetic shift. What unsigned value does the result represent?",
    checkTitle: "Apply an arithmetic shift",
    retry:
      "Write the eight result positions and cross out the two bits that leave on the right.",
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
      "An **arithmetic logic unit** (ALU) combines arithmetic, logic and shift circuits. **Operation** controls a selector, also called a **multiplexer**, that connects one of those circuits to the result. The same inputs can produce different results when you change the selection.",
    try: "The page starts with A = B = `0011` and **Operation** = **ADD**. Predict the four-bit result and whether a carry will leave bit 3. Select **Reveal result** and check **Result (R)** and **C**. Use the worked example for bit 1 to see how a carry moves between columns.\n\nKeep A and B unchanged. Select **SUB**, predict its result, then reveal it. What does C tell you about borrowing? Next, select **AND**, predict and reveal the result. Which flags still have values?",
    explanation:
      "ADD and SUB share an adder. ADD uses B and starts with carry in 0. SUB uses the inverted bits of B and starts with carry in 1. Each **FA** box is a full adder. It takes two input bits and a carry in, keeps one result bit and passes a carry to the next column.\n\n**V** reports whether the exact signed sum or difference fits. To see how it differs from C, open **Load a case to investigate**, choose **Signed overflow** and reveal the result. The unsigned sum 8 fits in four bits, so C is 0. The signed sum +8 exceeds the range −8 to +7, so V is 1.\n\nFor a shift, try **A bit shifted out**. This prepares an example with **LSR** (logical shift right). **C** shows the bit that leaves A. The other shift choices are **LSL** (logical shift left) and **ASR** (arithmetic shift right). In this model each shifts A by one place.\n\n[Follow a carry through an adder](#/lesson/adder) explains the carry chain. [One addition in Assembly Lab](https://snowch.github.io/assembly-lab/#/lesson/one-addition) shows how an instruction reads registers and writes a result. The [original gate-level ALU](calculator/docs/bit-lab.html) includes a breadboard build.",
    limit:
      "This four-bit model shows how the inputs determine the outputs. A change recomputes the outputs immediately. Real instructions specify how flags are updated or retained. This model illustrates the Arm carry convention for subtraction and omits stored flags and electrical timing.",
    a: 6,
    b: 3,
    width: 4,
    task: "A four-bit ALU receives A = `0110` and B = `0011`. The operation control selects XOR. What unsigned value reaches the result output?",
    checkTitle: "Select the ALU’s output",
    retry: "Compare each pair of input bits in its own column.",
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
    try: "The page starts with A = `1111` and B = `0010`. Predict whether A is less than B under each reading. Select **Reveal result** and compare **Unsigned** and **Signed**. Then turn on **B bit 2** to make B = `0110`. Turn off **A bits 2 and 1** to make A = `1001`. Predict the signed decision and reveal it. Why do you need V as well as N for this case?",
    explanation:
      "The flags come from one subtraction. Choosing a condition gives those flags meaning. Arm names the unsigned less-than condition LO and the signed less-than condition LT. Equality uses Z, and works for both readings.\n\nThis explains why a compiled comparison needs a condition suited to the operands. In C, the comparison uses the operand types after conversions. Merely seeing a negative-looking bit pattern does not tell you which condition a compiler should choose.",
    limit:
      "This is a small-word model of the condition rules, not a recorded compiler listing. Real C conversions and instruction selection are explored further in Assembly Lab and the original C examples.",
    a: 8,
    b: 7,
    width: 4,
    task: "Read A = `1000` and B = `0111` as four-bit two’s complement numbers. Is A less than B?",
    checkTitle: "Compare signed operands",
    retry: "Find the value of A’s leftmost bit under the stated reading.",
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
    try: "The page starts with A = `10010011`. Predict the new high byte under **Zero extension** and **Sign extension**. Select **Reveal result** and check both patterns. Compare **Signed** under **Original byte**, **Zero extension** and **Sign extension**. Which method preserves the original signed value?",
    explanation:
      "When the original leading bit is zero, both extensions add zeroes. When it is one, they differ. Zero extension makes the wider signed reading positive. Sign extension keeps it negative by filling the new high positions with ones.\n\nNarrowing removes high positions. It always preserves the remaining low bits, but preserves the original value only when that value fits the destination’s range. Extending a narrowed word cannot recover discarded information.",
    limit:
      "The lab widens eight bits to sixteen so every bit remains visible. Real instructions may use other widths. A widening instruction’s choice of zero or sign extension must be checked for that instruction.",
    a: 234,
    b: 0,
    width: 8,
    task: "Sign-extend `0xEA` to sixteen bits. What unsigned value does the wider pattern represent?",
    checkTitle: "Sign-extend a byte",
    retry: "Write the original byte in binary and mark its leftmost bit.",
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
    try: "The page starts with `0x4A31`. Predict which byte will appear at **Address 0** in each layout. Select **Reveal result** and compare **Address 0** under **Little-endian** and **Big-endian**. Then flip **A bit 0**, predict which cell will change in each layout, and reveal the result again.",
    explanation:
      "Writing and reading with the same byte order reconstructs the original word. Reading those bytes with the opposite order exchanges the high and low byte roles. This is why a file format or network protocol must specify its byte order.\n\nA hexadecimal word is conventionally written with its most significant digit first. That display convention does not tell you the order of its bytes in memory. Look at the addresses and the format’s rule.",
    limit:
      "The two labelled cells model byte order only. They do not model pointers, alignment, caches or memory protection.",
    a: 0x6b2d,
    b: 0,
    width: 16,
    task: "Store the sixteen-bit word `0x6B2D` in little-endian order at addresses 0 and 1. What byte is stored at address 0?",
    checkTitle: "Place a byte at address 0",
    retry:
      "Write the two bytes separately and identify their positions in the word.",
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
            caption: "Changing an input or operation hides the result again.",
            props: { topic: c.id },
          },
        ],
      },
      { kind: "explanation", title: "Why it works", prose: c.explanation },
      {
        kind: "challenge",
        title: "Try a new case",
        prose: "",
        interactives: [
          {
            id: `${c.id}-check`,
            kind: "challenge",
            timeModel: "none",
            caption: "Your answer is saved in this browser.",
            props: { challengeId: `${c.id}-practice` },
          },
        ],
      },
    ],
    challenges: [
      {
        id: `${c.id}-practice`,
        title: c.checkTitle,
        task: `${c.task}\n\n${
          c.id === "compare"
            ? "Enter 1 for yes or 0 for no."
            : c.id === "flags"
              ? "Enter the flag bit (0 or 1)."
              : c.id === "readings"
                ? "Enter a number in decimal, hexadecimal (prefix `0x`) or binary (prefix `0b`). Put a minus sign before a negative value."
                : "Enter a number in decimal, hexadecimal (prefix `0x`) or binary (prefix `0b`)."
        }`,
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

const finalPractice = {
  id: "put-it-into-practice",
  title: "Put it into practice",
  line: "Use the calculator’s question bank to connect the ideas and explain your answers.",
};

export const learningPath = [...chapters, finalPractice];

lessons.push(
  parseLesson({
    id: finalPractice.id,
    title: finalPractice.title,
    module: chapters.length,
    order: chapters.length,
    sectionLayout: "selected",
    showTimeModelNotes: false,
    objectives: [
      "Choose a width and interpretation, predict a result, and explain what the calculator shows.",
    ],
    prerequisites: ["patterns"],
    sections: [
      {
        kind: "question",
        title: "Can you choose the operations yourself?",
        prose:
          "Once you can read binary numbers and understand bit place values, you can start using the exercise bank. Begin with the reading questions and use each group’s primer when you reach a new topic. The calculator keeps its 110 exercises beside the tool, with worked answers and a tick box for your own progress. You do not need to finish all 110 in one sitting.",
      },
      {
        kind: "prediction",
        title: "Open the questions and predict first",
        prose:
          "1. [Open the calculator exercise bank](calculator/#exh). This link opens **Exercises** for this visit. If you open the calculator from the menu, use **Show exercises** below the keypad.\n2. Open a topic group. Its **Primer** explains the idea and gives an example.\n3. Before pressing **load** or using an operator, write down the word width, signed or unsigned reading, expected result and your reasoning. Then use **load** where available and try the operations.\n4. Open **answer** to compare your reasoning with the worked solution. Tick the exercise when you can explain it.\n\nThese are **self-checked** exercises: revealing an answer or ticking a box does not automatically grade your work. Ticked questions are tucked away; **show … done** brings them back. Ticks are saved in this browser, separately from the course’s study marks.",
      },
      {
        kind: "explanation",
        title: "Check the calculator’s conventions",
        prose:
          "The calculator uses the width named in each question, often 8, 16 or 32 bits. Its signed switch changes how DEC reads the bits. Widening zero-extends; exercise 26 asks you to repair that to preserve a negative value.\n\nFor subtraction, this calculator uses **C = 1 for a borrow**. The ALU lesson uses **C = 1 for no borrow**. In an eight-bit `0 − 1`, both produce `0xFF`, but the calculator sets C and the lesson’s convention clears it. Explain the convention when you explain the flag.\n\nThe calculator also reports flags from its last operation and clears C and V on logical operations. The teaching ALU shows a dash when an operation produces no C or V. Use each tool’s stated rules; the displays are not interchangeable.",
      },
      {
        kind: "challenge",
        title: "Work through a first practice round",
        prose:
          "Use these exercise numbers as a route through the bank. For any difficult topic, read its primer and try neighbouring questions before continuing.\n\n- **Read and interpret:** 5 and 9 — binary to hex, then the same bits read unsigned and signed.\n- **Separate carry from overflow:** 21, 29 and 30 — signed overflow, unsigned wrap-around and borrowing.\n- **Preserve meaning:** 25–27 — changing width, sign extension and signed comparisons.\n- **Select and move bits:** 37, 38 and 58 — masking, extracting a field and shifting beyond the word.\n- **Change byte order:** 72 — swap bytes and explain the resulting word.\n\nFinish with **94–96** in **Digital design capstones**. Build a control-register value, read its fields back, then change just one field. Before each step, name the mask or shift you need and which bits must stay unchanged.",
      },
      {
        kind: "reflection",
        title: "Explain it, then choose what to practise next",
        prose:
          "Choose one answer you initially got wrong. Was the cause the width, the signed reading, an operation, or a flag convention? Change one input and predict what should happen before checking again.\n\nMark this lesson as done when you have completed the practice round and can explain the three register-field capstones. The mark records your own judgement; it does not require every calculator question to be ticked.\n\nContinue with more questions in the same groups, or explore rotates, Unicode and the remaining capstones using their primers. For fresh questions with automatic checking, try the [two’s complement drills](calculator/docs/readings-drills.html) or [flag drills](calculator/docs/flag-drills.html).",
      },
    ],
    challenges: [],
    modelVsReality:
      "Calculator exercises are self-checked and use their stated word widths and flag rules. The calculator is not an instruction-set emulator or a C evaluator.",
    originalityNote: {
      textbookExample: "A standalone revision worksheet.",
      howThisDiffers:
        "Connects the course’s word models to a retained calculator exercise bank, with prediction before worked answers, explicit flag conventions and a register-field capstone.",
    },
  }),
);

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
