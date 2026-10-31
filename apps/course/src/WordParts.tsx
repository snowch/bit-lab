// Copyright © 2026 Christopher Snow
import { arithmetic } from "@bl/bit-model";

export function Bits({
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

export function CarryDiagram({
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
