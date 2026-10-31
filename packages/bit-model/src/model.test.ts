// Copyright © 2026 Christopher Snow
import { describe, expect, it } from "vitest";
import {
  arithmetic,
  bytes,
  compare,
  fullAdder,
  parseInteger,
  shift,
  signed,
  widen,
  word,
} from "./index";

describe("fixed-width arithmetic", () => {
  it("checks every full-adder input against the integer sum", () => {
    for (let a = 0; a < 2; a++)
      for (let b = 0; b < 2; b++)
        for (let c = 0; c < 2; c++) {
          const result = fullAdder(a, b, c);
          expect(result.sum + 2 * result.carry).toBe(a + b + c);
        }
  });
  for (const width of [4, 8])
    it(`checks all ${width}-bit operand pairs for add, subtract, flags and comparison`, () => {
      const m = 2 ** width;
      for (let a = 0; a < m; a++)
        for (let b = 0; b < m; b++) {
          const sa = a < m / 2 ? a : a - m,
            sb = b < m / 2 ? b : b - m;
          for (const subtract of [false, true]) {
            const exact = subtract ? a - b : a + b;
            const exactSigned = subtract ? sa - sb : sa + sb;
            const expected = ((exact % m) + m) % m;
            const result = arithmetic(a, b, width, subtract);
            const actual = [
              result.result,
              result.N,
              result.Z,
              result.C,
              result.V,
            ];
            const oracle = [
              expected,
              +(expected >= m / 2),
              +(expected === 0),
              subtract ? +(a >= b) : +(exact >= m),
              +(exactSigned < -m / 2 || exactSigned >= m / 2),
            ];
            if (actual.some((v, i) => v !== oracle[i]))
              throw new Error(
                `${width} bits: ${a} ${subtract ? "-" : "+"} ${b}: ${actual} != ${oracle}`,
              );
            const reconstructed = result.columns.reduce(
              (sum, c) => sum + c.sum * 2 ** c.bit,
              0,
            );
            if (reconstructed !== expected)
              throw new Error("Carry diagram disagrees with the result");
          }
          const decision = compare(a, b, width);
          if (
            decision.unsignedLess !== a < b ||
            decision.signedLess !== sa < sb
          )
            throw new Error(`Comparison disagrees at ${a}, ${b}`);
        }
    });
  it("sign extension preserves all byte values and logical extension preserves unsigned values", () => {
    for (let a = 0; a < 256; a++) {
      expect(signed(widen(a, 8, 16, true), 16)).toBe(a < 128 ? a : a - 256);
      expect(widen(a, 8, 16, false)).toBe(a);
    }
  });
  it("distinguishes arithmetic shifting from truncating signed division", () => {
    expect(shift(245, 8, 2, "arithmetic")).toBe(253);
    expect(shift(245, 8, 2, "logical")).toBe(61);
    expect(shift(128, 8, 1, "left")).toBe(0);
    expect(() => shift(1, 8, 8, "left")).toThrow();
  });
  it("lays out every sixteen-bit word so either matching order reconstructs it", () => {
    for (let n = 0; n < 65536; n++) {
      const le = bytes(n, true),
        be = bytes(n, false);
      if (le[0]! + 256 * le[1]! !== n || 256 * be[0]! + be[1]! !== n)
        throw new Error(`Byte order at ${n}`);
    }
  });
  it("accepts taught notation without turning blank or malformed input into zero", () => {
    expect(parseInteger("−3")).toBe(-3);
    expect(parseInteger("0xEA")).toBe(234);
    expect(parseInteger("0b1101")).toBe(13);
    expect(parseInteger("0o17")).toBe(15);
    for (const text of [
      "",
      " ",
      "1e2",
      "1.5",
      "0x",
      "NaN",
      "Infinity",
      "1101 junk",
    ])
      expect(parseInteger(text)).toBeUndefined();
    expect(word(-1, 8)).toBe(255);
    expect(() => word(0, 0)).toThrow();
    expect(() => word(0, 32)).toThrow();
  });
});
