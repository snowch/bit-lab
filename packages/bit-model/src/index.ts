// Copyright © 2026 Christopher Snow
// Small, exact integer models. These model fixed-width words, not C expressions or a CPU.
export function modulus(width: number): number {
  if (!Number.isInteger(width) || width < 1 || width > 16)
    throw new RangeError("Width must be 1 to 16 bits");
  return 2 ** width;
}
export function word(value: number, width: number): number {
  if (!Number.isSafeInteger(value)) throw new RangeError("Use an integer");
  const m = modulus(width);
  return ((value % m) + m) % m;
}
export function signed(value: number, width: number): number {
  const n = word(value, width),
    m = modulus(width);
  return n >= m / 2 ? n - m : n;
}
export function binary(value: number, width: number): string {
  return word(value, width).toString(2).padStart(width, "0");
}
export function hex(value: number, width: number): string {
  return (
    "0x" +
    word(value, width)
      .toString(16)
      .toUpperCase()
      .padStart(Math.ceil(width / 4), "0")
  );
}
export function fullAdder(a: number, b: number, carry: number) {
  const xor = a ^ b;
  return {
    xor,
    ab: a & b,
    xc: xor & carry,
    sum: xor ^ carry,
    carry: (a & b) | (xor & carry),
  };
}
export function arithmetic(
  a: number,
  b: number,
  width: number,
  subtract = false,
) {
  a = word(a, width);
  b = word(b, width);
  const m = modulus(width),
    rhs = subtract ? m - 1 - b : b;
  let carry = subtract ? 1 : 0;
  const columns = Array.from({ length: width }, (_, bit) => {
    const x = (a >> bit) & 1,
      y = (rhs >> bit) & 1,
      incoming = carry;
    const cell = fullAdder(x, y, incoming);
    carry = cell.carry;
    return { bit, a: x, b: y, incoming, ...cell };
  });
  const exact = subtract
    ? signed(a, width) - signed(b, width)
    : signed(a, width) + signed(b, width);
  const result = word(subtract ? a - b : a + b, width);
  return {
    result,
    columns,
    N: +(result >= m / 2),
    Z: +(result === 0),
    C: carry,
    V: +(exact < -m / 2 || exact >= m / 2),
  };
}
export function compare(a: number, b: number, width: number) {
  const flags = arithmetic(a, b, width, true);
  return {
    ...flags,
    unsignedLess: flags.C === 0,
    signedLess: flags.N !== flags.V,
  };
}
export function widen(
  value: number,
  from: number,
  to: number,
  extendSign: boolean,
) {
  if (to < from) throw new RangeError("Widening cannot reduce the width");
  return word(extendSign ? signed(value, from) : word(value, from), to);
}
export type Shift = "left" | "logical" | "arithmetic";
export function shift(
  value: number,
  width: number,
  count: number,
  kind: Shift,
) {
  if (!Number.isInteger(count) || count < 0 || count >= width)
    throw new RangeError("Count must be less than the width");
  const n = kind === "arithmetic" ? signed(value, width) : word(value, width);
  return word(
    kind === "left" ? n * 2 ** count : Math.floor(n / 2 ** count),
    width,
  );
}
export function bytes(value: number, littleEndian: boolean) {
  const n = word(value, 16);
  return littleEndian ? [n & 255, n >> 8] : [n >> 8, n & 255];
}

export const ALU_OPERATIONS = [
  "ADD",
  "SUB",
  "AND",
  "OR",
  "XOR",
  "NOT",
  "LSL",
  "LSR",
  "ASR",
] as const;
export type AluOperation = (typeof ALU_OPERATIONS)[number];
export type AluPath = "arithmetic" | "logic" | "shift";
export interface AluResult {
  result: number;
  path: AluPath;
  N: number;
  Z: number;
  C: number | null;
  V: number | null;
}

/** A combinational teaching ALU, not a processor's flag register.
 * Shifts move one bit; null means this operation produces no such flag.
 */
export function alu(
  a: number,
  b: number,
  width: number,
  operation: AluOperation,
): AluResult {
  a = word(a, width);
  b = word(b, width);
  if (operation === "ADD" || operation === "SUB") {
    const { result, N, Z, C, V } = arithmetic(a, b, width, operation === "SUB");
    return { result, path: "arithmetic", N, Z, C, V };
  }
  let result: number;
  let path: AluPath = "logic";
  let C: number | null = null;
  switch (operation) {
    case "AND":
      result = a & b;
      break;
    case "OR":
      result = a | b;
      break;
    case "XOR":
      result = a ^ b;
      break;
    case "NOT":
      result = word(~a, width);
      break;
    case "LSL":
      path = "shift";
      C = (a >> (width - 1)) & 1;
      result = word(a * 2, width);
      break;
    case "LSR":
      path = "shift";
      C = a & 1;
      result = Math.floor(a / 2);
      break;
    case "ASR":
      path = "shift";
      C = a & 1;
      result = word(Math.floor(signed(a, width) / 2), width);
      break;
    default:
      throw new RangeError("Unknown ALU operation");
  }
  return {
    result,
    path,
    N: +(result >= modulus(width) / 2),
    Z: +(result === 0),
    C,
    V: null,
  };
}
export function parseInteger(text: string): number | undefined {
  const s = text.trim().replaceAll("−", "-");
  if (!/^[+-]?(?:\d+|0x[\da-f]+|0b[01]+|0o[0-7]+)$/i.test(s)) return undefined;
  const sign = s.startsWith("-") ? -1 : 1;
  const n = sign * Number(s.replace(/^[+-]/, ""));
  return Number.isSafeInteger(n) ? n : undefined;
}

/** Signals for the connected ALU drawing. Bit arrays run from bit 0 upwards. */
export function aluTrace(
  a: number,
  b: number,
  width: number,
  operation: AluOperation,
) {
  const output = alu(a, b, width, operation);
  const bits = (value: number) =>
    Array.from({ length: width }, (_, bit) => (word(value, width) >> bit) & 1);
  const resultBits = bits(output.result);
  const columns =
    output.path === "arithmetic"
      ? arithmetic(a, b, width, operation === "SUB").columns
      : [];
  const signColumn = columns[width - 1];
  const shiftSources =
    output.path === "shift"
      ? Array.from({ length: width }, (_, bit) => {
          const source = operation === "LSL" ? bit - 1 : bit + 1;
          if (source >= 0 && source < width) return source;
          return operation === "ASR" ? width - 1 : null;
        })
      : [];
  return {
    output,
    bitsA: bits(a),
    bitsB: bits(b),
    resultBits,
    columns,
    shiftSources,
    shiftedOutIndex:
      output.path === "shift" ? (operation === "LSL" ? width - 1 : 0) : null,
    carryIntoSign: signColumn?.incoming ?? null,
    carryOutOfSign: signColumn?.carry ?? null,
    resultOr: resultBits.reduce((value, bit) => value | bit, 0),
  };
}
export type Topic =
  | "patterns"
  | "readings"
  | "adder"
  | "flags"
  | "masks"
  | "shifts"
  | "alu"
  | "compare"
  | "widen"
  | "memory";
export function answer(
  topic: Topic,
  a: number,
  b: number,
  width: number,
): number {
  switch (topic) {
    case "patterns":
      return word(a, width);
    case "readings":
      return signed(a, width);
    case "adder":
      return arithmetic(a, b, width).result;
    case "flags":
      return arithmetic(a, b, width, true).C;
    case "masks":
      return word(a, width) & word(b, width);
    case "shifts":
      return shift(a, width, b, "arithmetic");
    case "alu":
      return alu(a, b, width, "XOR").result;
    case "compare":
      return +compare(a, b, width).signedLess;
    case "widen":
      return widen(a, width, 16, true);
    case "memory":
      return bytes(a, true)[0]!;
  }
}
