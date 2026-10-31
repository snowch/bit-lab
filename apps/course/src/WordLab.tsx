// Copyright © 2026 Christopher Snow
import { useState } from "react";
import type { InteractiveProps } from "@platform/lesson-runtime";
import {
  arithmetic,
  binary,
  bytes,
  compare,
  hex,
  shift,
  signed,
  widen,
  type Topic,
  type Shift,
} from "@bl/bit-model";

import { Bits, CarryDiagram } from "./WordParts";

const initial: Record<Exclude<Topic, "alu">, [number, number, number]> = {
  patterns: [0, 0, 4],
  readings: [7, 0, 4],
  adder: [7, 1, 4],
  flags: [3, 5, 4],
  masks: [166, 15, 8],
  shifts: [229, 1, 8],
  compare: [15, 2, 4],
  widen: [147, 0, 8],
  memory: [0x4a31, 0, 16],
};
export function WordLab({ interactive }: InteractiveProps) {
  const topic = interactive.props["topic"] as Exclude<Topic, "alu">;
  const defaults = initial[topic];
  if (!defaults) throw new Error("Unknown word lab");
  const [a, setA] = useState(defaults[0]);
  const [b, setB] = useState(defaults[1]);
  const [operation, setOperation] = useState("AND");
  const [revealed, reveal] = useState(false);
  const width = defaults[2];
  function change(setter: (n: number) => void, n: number) {
    setter(n);
    reveal(false);
  }
  const both = ["adder", "flags", "masks", "compare"].includes(topic);
  const subtract = topic === "flags" || topic === "compare";
  const sum = arithmetic(a, b, width, subtract);
  const comparison = compare(a, b, width);
  const masked =
    operation === "AND" ? a & b : operation === "OR" ? a | b : a ^ b;
  const shiftKind: Shift =
    operation === "left" || operation === "arithmetic" ? operation : "logical";
  const moved = topic === "shifts" ? shift(a, width, b, shiftKind) : 0;
  const readings = (n: number, w: number) => (
    <p className="readout">
      <span>{hex(n, w)}</span>
      <span>
        Unsigned: <strong>{n}</strong>
      </span>
      <span>
        Signed: <strong>{signed(n, w)}</strong>
      </span>
    </p>
  );
  return (
    <div className="word-lab">
      <p className="muted">
        {width}-bit inputs · Position 0 is on the right. Press a bit to change
        it.
      </p>
      <Bits
        label="A"
        value={a}
        width={width}
        onChange={(n) => change(setA, n)}
      />
      {both && (
        <Bits
          label={topic === "masks" ? "Mask" : "B"}
          value={b}
          width={width}
          onChange={(n) => change(setB, n)}
        />
      )}
      {topic === "masks" && (
        <label>
          Operation{" "}
          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              reveal(false);
            }}
          >
            {["AND", "OR", "XOR"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      )}
      {topic === "shifts" && (
        <div className="controls">
          <label>
            Shift{" "}
            <select
              value={shiftKind}
              onChange={(e) => {
                setOperation(e.target.value);
                reveal(false);
              }}
            >
              <option value="logical">Logical right</option>
              <option value="arithmetic">Arithmetic right</option>
              <option value="left">Left</option>
            </select>
          </label>
          <label>
            Places{" "}
            <select
              value={b}
              onChange={(e) => change(setB, Number(e.target.value))}
            >
              {Array.from({ length: width }, (_, i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="controls">
        <button className="button primary" onClick={() => reveal(!revealed)}>
          {revealed ? "Hide result" : "Reveal result"}
        </button>
        <button
          className="button secondary"
          onClick={() => {
            setA(defaults[0]);
            setB(defaults[1]);
            setOperation("AND");
            reveal(false);
          }}
        >
          Reset experiment
        </button>
      </div>
      {!revealed && (
        <p role="status" className="muted">
          Make your prediction, then reveal the result.
        </p>
      )}
      {revealed && (
        <div className="lab-result" aria-live="polite">
          {(topic === "patterns" || topic === "readings") && (
            <>
              <div className="weights">
                {Array.from({ length: width }, (_, i) => {
                  const bit = width - i - 1,
                    on = Boolean(a & (2 ** bit));
                  return (
                    <div
                      className={on ? "weight selected" : "weight"}
                      key={bit}
                    >
                      <strong>
                        {topic === "readings" && i === 0 ? "−" : ""}
                        {2 ** bit}
                      </strong>
                      <span>{on ? "included" : "unused"}</span>
                    </div>
                  );
                })}
              </div>
              {topic === "patterns" ? (
                <p className="readout">
                  {binary(a, width)} = {a} unsigned = {hex(a, width)}
                </p>
              ) : (
                readings(a, width)
              )}
              <p>
                The weights above show the{" "}
                {topic === "readings" ? "signed" : "unsigned"} reading.
              </p>
            </>
          )}
          {(topic === "adder" || topic === "flags") && (
            <>
              <CarryDiagram a={a} b={b} width={width} subtract={subtract} />
              <Bits label="Result" value={sum.result} width={width} />
              {readings(sum.result, width)}
              {topic === "adder" && (
                <p>
                  Carry beyond the word: <strong>{sum.C}</strong>
                </p>
              )}
            </>
          )}
          {(topic === "flags" || topic === "compare") && (
            <div className="flags">
              {(["N", "Z", "C", "V"] as const).map((k) => (
                <div className={sum[k] ? "flag set" : "flag"} key={k}>
                  <strong>
                    {k} = {sum[k]}
                  </strong>
                  <span>
                    {
                      {
                        N: "Result’s leading bit",
                        Z: "Result is zero",
                        C: "No unsigned borrow",
                        V: "Signed result does not fit",
                      }[k]
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
          {topic === "masks" && (
            <>
              <Bits label="Result" value={masked} width={width} />
              {readings(masked, width)}
              <p>Every column applies {operation} independently.</p>
            </>
          )}
          {topic === "shifts" && (
            <>
              <div className="shift-arrow" aria-hidden="true">
                {shiftKind === "left" ? "←" : "→"} {b} places
              </div>
              <Bits label="Result" value={moved} width={width} />
              {readings(moved, width)}
              <p>
                {shiftKind === "arithmetic"
                  ? `Fill with the original leading bit (${a >> (width - 1)}).`
                  : "Fill the new positions with zeroes."}{" "}
                Bits leaving the word are discarded.
              </p>
            </>
          )}
          {topic === "compare" && (
            <>
              <div className="comparison">
                <div>
                  <h3>Unsigned</h3>
                  <p>
                    {a} &lt; {b}:{" "}
                    <strong>{String(comparison.unsignedLess)}</strong>
                  </p>
                  <p>Test C = 0.</p>
                </div>
                <div>
                  <h3>Signed</h3>
                  <p>
                    {signed(a, width)} &lt; {signed(b, width)}:{" "}
                    <strong>{String(comparison.signedLess)}</strong>
                  </p>
                  <p>Test N ≠ V.</p>
                </div>
              </div>
              <p>
                Subtraction result: {binary(sum.result, width)}. The comparison
                uses its flags.
              </p>
            </>
          )}
          {topic === "widen" && (
            <>
              <p>Original byte</p>
              {readings(a, width)}
              {[false, true].map((sign) => (
                <div key={String(sign)}>
                  <h3>{sign ? "Sign extension" : "Zero extension"}</h3>
                  <Bits
                    label="Wider word"
                    value={widen(a, 8, 16, sign)}
                    width={16}
                  />
                  {readings(widen(a, 8, 16, sign), 16)}
                </div>
              ))}
            </>
          )}
          {topic === "memory" && (
            <>
              <p className="readout">Word: {hex(a, 16)}</p>
              <div className="comparison">
                {[true, false].map((little) => (
                  <div key={String(little)}>
                    <h3>{little ? "Little-endian" : "Big-endian"}</h3>
                    <div className="memory-cells">
                      {bytes(a, little).map((v, i) => (
                        <div key={i}>
                          <span>Address {i}</span>
                          <strong>{hex(v, 8)}</strong>
                          <small>{binary(v, 8)}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p>
                Addresses increase from left to right. Bits within each byte
                keep their order.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
