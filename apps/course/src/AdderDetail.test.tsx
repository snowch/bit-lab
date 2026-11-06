// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdderDetail } from "./AdderDetail";
import { ADDER_ARCHITECTURE_STRINGS as S } from "./strings.adder-architecture";

describe("a visible full-adder column", () => {
  const triples = [0, 1].flatMap((a) =>
    [0, 1].flatMap((b) => [0, 1].map((carry) => [a, b, carry] as const)),
  );
  it.each(triples)(
    "shows both outputs and all gates for %i + %i + incoming %i",
    (a, b, incoming) => {
      // Equal low bits provide the desired carry into bit 1 independently of its operand bits.
      const { container } = render(
        <AdderDetail a={(a << 1) | incoming} b={(b << 1) | incoming} />,
      );
      const total = a + b + incoming;
      expect(
        container.querySelector('[data-selected-adder-bit="1"]'),
      ).not.toBeNull();
      expect(screen.getByRole("button", { name: "Bit 1" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(
        container.querySelector('[data-adder-input="a"]'),
      ).toHaveTextContent(String(a));
      expect(
        container.querySelector('[data-adder-input="b"]'),
      ).toHaveTextContent(String(b));
      expect(
        container.querySelector('[data-adder-input="carry"]'),
      ).toHaveTextContent(String(incoming));
      expect(
        container.querySelector('[data-adder-output="sum"]'),
      ).toHaveTextContent(String(total % 2));
      expect(
        container.querySelector('[data-adder-output="carry"]'),
      ).toHaveTextContent(String(Math.floor(total / 2)));
      expect(container.querySelector("[data-adder-total]")).toHaveTextContent(
        total.toString(2).padStart(2, "0"),
      );
      const xor = (a + b) % 2;
      for (const [key, value] of Object.entries({
        "first-xor": xor,
        "operand-and": Math.floor((a + b) / 2),
        "carry-and": xor * incoming,
        "result-xor": total % 2,
        "carry-or": Math.floor(total / 2),
      })) {
        expect(
          container.querySelector(`[data-adder-gate="${key}"]`),
        ).toHaveAttribute("data-value", String(value));
        expect(
          container.querySelector(`[data-adder-proof="${key}"]`),
        ).toHaveTextContent(new RegExp(`= ${value}$`));
      }
      expect(container.querySelectorAll("[data-adder-column]")).toHaveLength(4);
      expect(container.querySelectorAll("details")).toHaveLength(0);
      expect(
        screen
          .getByText(S.adder.gateGuide)
          .compareDocumentPosition(
            container.querySelector(".adder-gate-proof")!,
          ) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(container).toHaveTextContent(S.adder.wireGuide);
      expect(container).toHaveTextContent(S.adder.scope);
    },
  );

  it.each([
    [3, 3, false],
    [15, 1, false],
    [3, 5, true],
    [0, 0, true],
    [0, 15, true],
  ] as const)(
    "connects each column to the same %i/%i arithmetic with subtraction=%s",
    (a, b, subtract) => {
      const { container } = render(
        <AdderDetail a={a} b={b} subtract={subtract} architecture />,
      );
      const rhs = subtract ? 15 - b : b;
      const expectedWord = ((subtract ? a - b : a + b) + 16) % 16;
      const resultNode = container.querySelector(".adder-word-context code")!;
      expect(resultNode).toHaveTextContent(
        expectedWord.toString(2).padStart(4, "0"),
      );
      const status = screen.getByRole("status");
      for (let bit = 0; bit < 4; bit++) {
        fireEvent.click(screen.getByRole("button", { name: `Bit ${bit}` }));
        const mask = (1 << bit) - 1;
        const incoming = Math.floor(
          ((a & mask) + (rhs & mask) + (subtract ? 1 : 0)) / (1 << bit),
        );
        const total = ((a >> bit) & 1) + ((rhs >> bit) & 1) + incoming;
        expect(
          container.querySelector('[data-adder-input="carry"]'),
        ).toHaveTextContent(String(incoming));
        expect(
          container.querySelector('[data-adder-input="b"]'),
        ).toHaveTextContent(String((rhs >> bit) & 1));
        expect(
          container.querySelector('[data-adder-output="sum"]'),
        ).toHaveTextContent(String(total % 2));
        expect(
          container.querySelector('[data-adder-output="carry"]'),
        ).toHaveTextContent(String(Math.floor(total / 2)));
        expect(screen.getByRole("status")).toBe(status);
        expect(status).toHaveTextContent(`Bit ${bit}`);
        expect(resultNode).toHaveTextContent(
          expectedWord.toString(2).padStart(4, "0"),
        );
      }
      expect(container).toHaveTextContent("Carry out beyond the 4-bit word");
      expect(container).toHaveTextContent(
        subtract ? S.bitLab.subNote : S.bitLab.addNote,
      );
      expect(container).toHaveTextContent(S.bitLab.adderResultLabel);
      expect(container).toHaveTextContent(S.bitLab.selectorLabel);
    },
  );
});
