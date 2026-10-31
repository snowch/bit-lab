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

function Bits({
  label,
  value,
  width,
  onChange,
}: {
  label: string;
  value: number;
  width: number;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="bit-row">
      <span className="bit-label">{label}</span>
      <div className="bit-groups" role="group" aria-label={label}>
        {Array.from({ length: Math.ceil(width / 8) }, (_, group) => {
          const count = Math.min(8, width),
            highest = width - group * 8 - 1;
          return (
            <div className="byte-group" key={group}>
              {width > 8 && (
                <span className="bit-label">
                  {group === 0 ? "High byte" : "Low byte"} · bits {highest}–
                  {highest - count + 1}
                </span>
              )}
              <div
                className="bits"
                style={{
                  gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                  maxWidth: count * 46,
                }}
              >
                {Array.from({ length: count }, (_, i) => {
                  const bit = highest - i,
                    on = Boolean(value & (2 ** bit));
                  return onChange ? (
                    <button
                      className={on ? "bit on" : "bit"}
                      key={bit}
                      aria-label={`${label} bit ${bit}: ${+on}`}
                      aria-pressed={on}
                      onClick={() => onChange(value ^ (2 ** bit))}
                    >
                      <small>{bit}</small>
                      {+on}
                    </button>
                  ) : (
                    <span className={on ? "bit on" : "bit"} key={bit}>
                      <small>{bit}</small>
                      {+on}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CarryDiagram({
  a,
  b,
  width,
  subtract,
}: {
  a: number;
  b: number;
  width: number;
  subtract: boolean;
}) {
  const result = arithmetic(a, b, width, subtract);
  return (
    <div
      className="diagram-scroll"
      tabIndex={0}
      aria-label="Carry chain, scroll horizontally if needed"
    >
      <svg
        className="carry-diagram"
        viewBox="0 0 680 225"
        role="img"
        aria-label="Full adders connected by carries from right to left"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6" fill="currentColor" />
          </marker>
        </defs>
        {result.columns.map((c, i) => {
          const x = 510 - i * 155;
          return (
            <g key={i}>
              <text x={x + 50} y="20" textAnchor="middle">
                bit {i}
              </text>
              <text x={x + 25} y="47">
                A={c.a}
              </text>
              <text x={x + 25} y="68">
                {subtract ? "~B" : "B"}={c.b}
              </text>
              <path d={`M${x + 45},75 V92`} stroke="currentColor" />
              <rect x={x} y="92" width="105" height="64" rx="4" />
              <text x={x + 52} y="118" textAnchor="middle">
                full adder
              </text>
              <text x={x + 52} y="141" textAnchor="middle">
                sum {c.sum}
              </text>
              <path
                className={c.incoming ? "live-wire" : ""}
                d={`M${x + 150},124 H${x + 108}`}
                stroke="currentColor"
                markerEnd="url(#arrow)"
              />
              <text x={x + 125} y="111" textAnchor="middle">
                {c.incoming}
              </text>
              <path
                d={`M${x + 52},157 V180`}
                stroke="currentColor"
                markerEnd="url(#arrow)"
              />
              <text x={x + 52} y="204" textAnchor="middle">
                {c.sum}
              </text>
            </g>
          );
        })}
        <path d="M44,124 H10" stroke="currentColor" markerEnd="url(#arrow)" />
        <text x="23" y="111" textAnchor="middle">
          {result.C}
        </text>
        <text x="650" y="165" textAnchor="middle">
          carry in
        </text>
      </svg>
      <p className="muted">
        Carries travel from bit 0 towards bit 3. Each box uses two XOR gates,
        two AND gates and one OR gate.
      </p>
      <div className="column-cards">
        {result.columns.map((c) => (
          <details key={c.bit}>
            <summary>Inside bit {c.bit}</summary>
            <p>
              First XOR: {c.a} XOR {c.b} = {c.xor}
            </p>
            <p>
              Sum: {c.xor} XOR {c.incoming} = {c.sum}
            </p>
            <p>
              Carry: ({c.a} AND {c.b}) OR ({c.xor} AND {c.incoming}) = {c.carry}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

const initial: Record<Topic, [number, number, number]> = {
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
  const topic = interactive.props["topic"] as Topic;
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
