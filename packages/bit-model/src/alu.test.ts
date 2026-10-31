// Copyright © 2026 Christopher Snow
import { expect, it } from "vitest";
import { ALU_OPERATIONS, alu } from "./index";

it("selects the correct result and flag sources for every four-bit input pair", () => {
  for (let a = 0; a < 16; a++)
    for (let b = 0; b < 16; b++) {
      const sa = a < 8 ? a : a - 16,
        sb = b < 8 ? b : b - 16;
      const results = {
        ADD: (a + b) % 16,
        SUB: (a - b + 16) % 16,
        AND: a & b,
        OR: a | b,
        XOR: a ^ b,
        NOT: 15 - a,
        LSL: (a * 2) % 16,
        LSR: Math.floor(a / 2),
        ASR: (Math.floor(sa / 2) + 16) % 16,
      };
      for (const op of ALU_OPERATIONS) {
        const out = alu(a, b, 4, op);
        const path =
          op === "ADD" || op === "SUB"
            ? "arithmetic"
            : ["LSL", "LSR", "ASR"].includes(op)
              ? "shift"
              : "logic";
        const exact = op === "SUB" ? sa - sb : sa + sb;
        const C =
          op === "ADD"
            ? +(a + b >= 16)
            : op === "SUB"
              ? +(a >= b)
              : op === "LSL"
                ? +(a >= 8)
                : path === "shift"
                  ? a % 2
                  : null;
        const V = path === "arithmetic" ? +(exact < -8 || exact > 7) : null;
        expect(out, `${a} ${op} ${b}`).toEqual({
          result: results[op],
          path,
          N: +(results[op] >= 8),
          Z: +(results[op] === 0),
          C,
          V,
        });
      }
    }
});

it("does not carry arithmetic flags into logical operations", () => {
  expect(alu(7, 1, 4, "ADD")).toMatchObject({ result: 8, N: 1, C: 0, V: 1 });
  expect(alu(7, 1, 4, "AND")).toMatchObject({
    result: 1,
    N: 0,
    C: null,
    V: null,
  });
  expect(alu(6, 6, 4, "XOR")).toMatchObject({
    result: 0,
    N: 0,
    Z: 1,
    C: null,
    V: null,
  });
});

it("reports the outgoing bit for negative arithmetic shifts and masks wider operands", () => {
  expect(alu(9, 7, 4, "ASR")).toEqual({
    result: 12,
    path: "shift",
    N: 1,
    Z: 0,
    C: 1,
    V: null,
  });
  expect(alu(-1, 256, 8, "NOT")).toMatchObject({
    result: 0,
    Z: 1,
    C: null,
    V: null,
  });
  expect(alu(255, 1, 8, "ADD")).toMatchObject({ result: 0, Z: 1, C: 1, V: 0 });
  expect(alu(128, 1, 8, "SUB")).toMatchObject({ result: 127, C: 1, V: 1 });
});
