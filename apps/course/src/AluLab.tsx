// Copyright © 2026 Christopher Snow
import { useId, useState } from "react";
import {
  ALU_OPERATIONS,
  alu,
  binary,
  hex,
  signed,
  type AluOperation,
  type AluResult,
} from "@bl/bit-model";
import { Bits, CarryDiagram } from "./WordParts";

const descriptions: Record<AluOperation, string> = {
  ADD: "A + B",
  SUB: "A − B",
  AND: "A AND B",
  OR: "A OR B",
  XOR: "A XOR B",
  NOT: "Invert A",
  LSL: "A shifted left by one",
  LSR: "A shifted right, fill with zero",
  ASR: "A shifted right, copy the sign bit",
};
const flagText = (value: number | null) =>
  value === null ? "—" : String(value);

function AluDiagram({
  a,
  b,
  operation,
  output,
}: {
  a: number;
  b: number;
  operation: AluOperation;
  output: AluResult;
}) {
  const arrow = useId();
  const paths = ["arithmetic", "logic", "shift"] as const;
  const selected = paths.indexOf(output.path);
  const usesB = operation !== "NOT" && output.path !== "shift";
  return (
    <div
      className="diagram-scroll"
      tabIndex={0}
      role="group"
      aria-label="ALU signal diagram; scroll horizontally if needed"
    >
      <svg
        className="alu-diagram"
        viewBox="0 0 720 585"
        role="img"
        aria-label={`${operation} selects the ${output.path} path. Result ${binary(output.result, 4)}. N ${output.N}, Z ${output.Z}, C ${flagText(output.C)}, V ${flagText(output.V)}.`}
      >
        <defs>
          <marker
            id={arrow}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6" fill="currentColor" />
          </marker>
        </defs>
        <rect x="120" y="10" width="200" height="48" rx="4" />
        <text x="220" y="40" textAnchor="middle">
          A · {binary(a, 4)}
        </text>
        <rect x="400" y="10" width="200" height="48" rx="4" />
        <text x="500" y="40" textAnchor="middle">
          B · {usesB ? binary(b, 4) : "unused"}
        </text>
        <path
          className="alu-wire"
          d="M220,58 V88 M100,88 H580 M100,88 V145 M340,88 V145 M580,88 V145"
        />
        <path
          className={`alu-wire ${usesB ? "" : "alu-unused"}`}
          d="M500,58 V110 H140 M140,110 V145 M380,110 V145"
        />
        {[100, 220, 340, 580].map((x) => (
          <circle key={`a-${x}`} cx={x} cy="88" r="3" fill="currentColor" />
        ))}
        {[140, 380, 500].map((x) => (
          <circle key={`b-${x}`} cx={x} cy="110" r="3" fill="currentColor" />
        ))}
        {paths.map((path, i) => {
          const x = 20 + i * 240,
            centre = x + 100,
            active = output.path === path;
          return (
            <g
              key={path}
              data-path={path}
              data-selected={active}
              className={active ? "alu-selected" : "alu-inactive"}
            >
              <rect x={x} y="145" width="200" height="100" rx="5" />
              <text x={centre} y="174" textAnchor="middle">
                {["Shared adder", "Logic gates", "One-place shifter"][i]}
              </text>
              <text
                className="alu-small"
                x={centre}
                y="199"
                textAnchor="middle"
              >
                {["ADD / SUB", "AND / OR / XOR / NOT", "LSL / LSR / ASR"][i]}
              </text>
              <text x={centre} y="225" textAnchor="middle">
                {active
                  ? `${operation} → ${binary(output.result, 4)}`
                  : "not selected"}
              </text>
              <path
                className="alu-wire"
                d={
                  i === 1
                    ? "M360,245 V320"
                    : `M${centre},245 V280 H${i === 0 ? 300 : 420} V320`
                }
                markerEnd={`url(#${arrow})`}
              />
            </g>
          );
        })}
        <path
          className="alu-control"
          d="M20,350 H260"
          markerEnd={`url(#${arrow})`}
        />
        <text x="20" y="328" className="alu-small">
          Operation control: {operation}
        </text>
        <rect
          className="alu-selector"
          x="260"
          y="320"
          width="200"
          height="60"
          rx="4"
        />
        <text x="360" y="345" textAnchor="middle">
          Result selector
        </text>
        <text className="alu-small" x="360" y="366" textAnchor="middle">
          multiplexer
        </text>
        <path
          className="alu-wire alu-result-wire"
          d="M360,380 V420"
          markerEnd={`url(#${arrow})`}
        />
        <rect
          className="alu-selector"
          x="260"
          y="420"
          width="200"
          height="60"
          rx="4"
        />
        <text x="360" y="445" textAnchor="middle">
          Result word
        </text>
        <text x="360" y="468" textAnchor="middle">
          {binary(output.result, 4)}
        </text>
        <path
          className="alu-wire alu-result-wire"
          d="M360,480 V515 H180 V540"
          markerEnd={`url(#${arrow})`}
        />
        <text className="alu-small" x="65" y="505">
          From result bits
        </text>
        <path
          className={`alu-wire alu-flag-wire ${output.C === null ? "alu-unused" : ""}`}
          d={`M${155 + selected * 240},245 V260 H700 V556 H630`}
          markerEnd={`url(#${arrow})`}
        />
        <text className="alu-small" x="480" y="505">
          From selected path
        </text>
        <rect x="90" y="540" width="180" height="34" rx="4" />
        <text x="180" y="563" textAnchor="middle">
          N={output.N} Z={output.Z}
        </text>
        <rect x="450" y="540" width="180" height="34" rx="4" />
        <text x="540" y="563" textAnchor="middle">
          C={flagText(output.C)} V={flagText(output.V)}
        </text>
      </svg>
    </div>
  );
}

export function AluLab() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(1);
  const [operation, setOperation] = useState<AluOperation>("ADD");
  const [revealed, setRevealed] = useState(false);
  const output = alu(a, b, 4, operation);
  const usesB = operation !== "NOT" && output.path !== "shift";
  function preset(nextA: number, nextB: number, nextOperation: AluOperation) {
    setA(nextA);
    setB(nextB);
    setOperation(nextOperation);
    setRevealed(false);
  }
  const notes = {
    N: "Copies the result’s leading bit.",
    Z: "1 only when every result bit is zero.",
    C:
      output.path === "arithmetic"
        ? operation === "SUB"
          ? "Final adder carry: 1 means no unsigned borrow."
          : "Final adder carry: 1 means the unsigned sum exceeds the word."
        : output.path === "shift"
          ? "The bit shifted out of A."
          : "Not produced by this logic operation.",
    V:
      output.path === "arithmetic"
        ? "1 when the exact signed arithmetic answer does not fit."
        : "Not produced by this operation.",
  };
  return (
    <div className="word-lab alu-lab">
      <p className="muted">
        Four-bit inputs · Position 0 is on the right. Press a bit to change it.
      </p>
      <Bits
        label="A"
        value={a}
        width={4}
        onChange={(value) => {
          setA(value);
          setRevealed(false);
        }}
      />
      <Bits
        label="B"
        value={b}
        width={4}
        onChange={(value) => {
          setB(value);
          setRevealed(false);
        }}
      />
      <label className="alu-operation">
        Operation{" "}
        <select
          value={operation}
          onChange={(event) => {
            setOperation(event.target.value as AluOperation);
            setRevealed(false);
          }}
        >
          {ALU_OPERATIONS.map((op) => (
            <option value={op} key={op}>
              {op} · {descriptions[op]}
            </option>
          ))}
        </select>
      </label>
      <p>
        {usesB
          ? "This operation uses A and B."
          : "This operation uses A only. B stays visible for your next experiment, but does not affect this result."}
      </p>
      <p className="alu-rules">
        N and Z describe every result. ADD and SUB also produce C and V.
        One-place shifts produce the outgoing bit as C. A dash means a flag is
        not produced here; no previous flags are stored.
      </p>
      <div className="controls">
        <button
          className="button primary"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? "Hide result" : "Reveal result"}
        </button>
        <button
          className="button secondary"
          onClick={() => preset(7, 1, "ADD")}
        >
          Reset experiment
        </button>
      </div>
      <details className="alu-presets">
        <summary>Load a case to investigate</summary>
        <div className="controls">
          <button
            className="button secondary"
            onClick={() => preset(7, 1, "ADD")}
          >
            Signed overflow
          </button>
          <button
            className="button secondary"
            onClick={() => preset(15, 1, "ADD")}
          >
            Unsigned carry
          </button>
          <button
            className="button secondary"
            onClick={() => preset(3, 5, "SUB")}
          >
            Unsigned borrow
          </button>
          <button
            className="button secondary"
            onClick={() => preset(6, 6, "XOR")}
          >
            Equal inputs with XOR
          </button>
          <button
            className="button secondary"
            onClick={() => preset(9, 0, "LSR")}
          >
            A bit shifted out
          </button>
        </div>
      </details>
      {!revealed && (
        <p role="status" className="muted">
          Predict the selected result and its flags, then reveal them.
        </p>
      )}
      {revealed && (
        <div className="lab-result" aria-live="polite">
          <h3>Follow {operation} through the ALU</h3>
          <p className="muted">
            The highlighted path supplies the output. Unselected paths are not
            disconnected from the inputs. Dots mark joined wires. Scroll the
            diagram sideways on a narrow screen.
          </p>
          <AluDiagram a={a} b={b} operation={operation} output={output} />
          <Bits label="Result" value={output.result} width={4} />
          <p className="readout" data-alu-result={output.result}>
            <span>{hex(output.result, 4)}</span>
            <span>
              Unsigned: <strong>{output.result}</strong>
            </span>
            <span>
              Signed: <strong>{signed(output.result, 4)}</strong>
            </span>
          </p>
          <div className="flags">
            {(["N", "Z", "C", "V"] as const).map((flag) => (
              <div
                key={flag}
                data-flag={flag}
                className={`flag ${output[flag] === null ? "not-produced" : output[flag] ? "set" : ""}`}
              >
                <strong>
                  {flag} = {flagText(output[flag])}
                </strong>
                <span>{notes[flag]}</span>
              </div>
            ))}
          </div>
          {output.path === "arithmetic" && (
            <details className="alu-detail">
              <summary>Inside the shared adder</summary>
              <p>
                {operation === "SUB"
                  ? "SUB inverts B and supplies an initial carry of 1."
                  : "ADD supplies B unchanged and an initial carry of 0."}
              </p>
              <CarryDiagram
                a={a}
                b={b}
                width={4}
                subtract={operation === "SUB"}
              />
            </details>
          )}
          {output.path === "logic" && (
            <details className="alu-detail">
              <summary>Inside the logic path</summary>
              <div className="column-cards">
                {[3, 2, 1, 0].map((bit) => (
                  <p key={bit}>
                    Bit {bit}:{" "}
                    {operation === "NOT"
                      ? `NOT ${(a >> bit) & 1}`
                      : `${(a >> bit) & 1} ${operation} ${(b >> bit) & 1}`}{" "}
                    = {(output.result >> bit) & 1}
                  </p>
                ))}
              </div>
            </details>
          )}
          {output.path === "shift" && (
            <p>
              {operation === "LSL"
                ? "The old bit 3 leaves the word; bit 0 fills with zero."
                : operation === "ASR"
                  ? "The old bit 0 leaves the word; bit 3 fills with a copy of the old sign bit."
                  : "The old bit 0 leaves the word; bit 3 fills with zero."}{" "}
              The outgoing bit supplies C.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
