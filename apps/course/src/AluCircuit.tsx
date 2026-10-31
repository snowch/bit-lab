// Copyright © 2026 Christopher Snow
import { aluTrace, type AluOperation } from "@bl/bit-model";

type GateKind = "AND" | "OR" | "XOR" | "NOT";
function Gate({
  kind,
  x,
  y,
  small = false,
}: {
  kind: GateKind;
  x: number;
  y: number;
  small?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${small ? 0.8 : 1})`}
      className="circuit-gate"
      data-gate={kind}
    >
      {kind === "NOT" ? (
        <>
          <path d="M-18,-22 H18 L0,14 Z" />
          <circle cy="20" r="5" />
        </>
      ) : kind === "AND" ? (
        <path d="M-22,-24 H22 V0 A22,24 0 0 1 -22,0 Z" />
      ) : (
        <>
          <path d="M-22,-24 Q0,-16 22,-24 Q22,12 0,24 Q-22,12 -22,-24 Z" />
          {kind === "XOR" && (
            <path className="gate-curve" d="M-22,-30 Q0,-22 22,-30" />
          )}
        </>
      )}
    </g>
  );
}

function Cell({
  x,
  y,
  value,
  label,
  toggle,
}: {
  x: number;
  y: number;
  value: number | null;
  label: string;
  toggle?: () => void;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`circuit-bit ${value === 1 ? "on" : ""} ${toggle ? "editable" : "readonly"}`}
      role={toggle ? "button" : "img"}
      tabIndex={toggle ? 0 : undefined}
      aria-label={`${label}: ${value ?? "hidden"}`}
      aria-pressed={toggle ? value === 1 : undefined}
      onClick={toggle}
      onKeyDown={
        toggle
          ? (event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                toggle();
              }
            }
          : undefined
      }
    >
      {toggle && (
        <rect className="circuit-hit" x="-29" y="-29" width="58" height="58" />
      )}
      <rect
        className="circuit-cell"
        x="-22"
        y="-22"
        width="44"
        height="44"
        rx="6"
      />
      <text y="7" textAnchor="middle">
        {value ?? "?"}
      </text>
    </g>
  );
}

export function AluCircuit({
  a,
  b,
  operation,
  revealed,
  onA,
  onB,
}: {
  a: number;
  b: number;
  operation: AluOperation;
  revealed: boolean;
  onA: (value: number) => void;
  onB: (value: number) => void;
}) {
  const trace = aluTrace(a, b, 4, operation);
  const { output } = trace;
  const xs = (bit: number) => 370 - bit * 90;
  const bits = [3, 2, 1, 0];
  const arithmetic = output.path === "arithmetic";
  const usesB = operation !== "NOT" && output.path !== "shift";
  const show = (value: number | null) =>
    value === null ? "—" : revealed ? String(value) : "?";
  function wire(d: string, value: number, carry = false) {
    return (
      <path
        d={d}
        className={`circuit-wire ${carry ? "carry-wire" : ""} ${revealed ? (value ? "on" : "off") : "pending"}`}
      />
    );
  }
  return (
    <div
      className="connected-circuit-scroll"
      role="group"
      aria-label="Connected circuit, inputs and flag gates"
    >
      <svg
        className="connected-circuit"
        viewBox="0 0 440 466"
        role="group"
        aria-label={`Four-bit ${operation} circuit. Click input bits to change them.`}
        data-path={output.path}
        data-revealed={revealed}
      >
        {bits.map((bit) => (
          <text
            className="circuit-small"
            x={xs(bit)}
            y="16"
            key={`index-${bit}`}
            textAnchor="middle"
          >
            bit {bit}
          </text>
        ))}
        <text className="circuit-row-label" x="429" y="56" textAnchor="middle">
          A
        </text>
        <text className="circuit-row-label" x="429" y="120" textAnchor="middle">
          B
        </text>

        {output.path !== "shift" &&
          bits.map((bit) => {
            const x = xs(bit),
              av = trace.bitsA[bit]!,
              bv = trace.bitsB[bit]!;
            const cell = trace.columns[bit];
            const unary = operation === "NOT";
            return (
              <g key={`operation-${bit}`}>
                {wire(
                  `M${x},72 V82 H${x - 30} V170 H${unary ? x : x - 11} V${arithmetic ? 190 : unary ? 188 : operation === "AND" ? 186 : 189}`,
                  av,
                )}
                {usesB &&
                  (operation === "SUB" ? (
                    <>
                      {wire(`M${x + 11},136 V141`, bv)}
                      <Gate kind="NOT" x={x + 11} y={159} small />
                      {wire(`M${x + 11},179 V190`, cell!.b)}
                      <text className="circuit-small" x={x + 24} y="181">
                        {show(cell!.b)}
                      </text>
                    </>
                  ) : (
                    wire(
                      `M${x + 11},136 V${arithmetic ? 190 : operation === "AND" ? 186 : 189}`,
                      bv,
                    )
                  ))}
                {arithmetic ? (
                  <>
                    <g className="circuit-gate" data-gate="FA">
                      <rect x={x - 25} y="190" width="50" height="40" rx="4" />
                      <text x={x} y="217" textAnchor="middle">
                        FA
                      </text>
                    </g>
                    {wire(
                      `M${x - 25},210 H${bit === 3 ? 30 : xs(bit + 1) + 25}`,
                      cell!.carry,
                      true,
                    )}
                    <text
                      className="circuit-small"
                      data-carry-index={bit + 1}
                      data-value={revealed ? cell!.carry : undefined}
                      x={bit === 3 ? 52 : x - 45}
                      y="200"
                      textAnchor="middle"
                    >
                      {show(cell!.carry)}
                    </text>
                    {bit === 0 && (
                      <>
                        {wire("M395,210 H430", cell!.incoming, true)}
                        <text
                          className="circuit-small"
                          data-carry-index="0"
                          data-value={revealed ? cell!.incoming : undefined}
                          x="417"
                          y="200"
                          textAnchor="middle"
                        >
                          {show(cell!.incoming)}
                        </text>
                        <text
                          className="circuit-small"
                          x="418"
                          y="241"
                          textAnchor="middle"
                        >
                          cin
                        </text>
                      </>
                    )}
                  </>
                ) : (
                  <Gate kind={operation as GateKind} x={x} y={210} />
                )}
                {wire(
                  `M${x},${arithmetic ? 230 : 235} V278`,
                  trace.resultBits[bit]!,
                )}
              </g>
            );
          })}

        {output.path === "shift" && (
          <>
            {bits.map((bit) => (
              <g key={`source-${bit}`}>
                {wire(
                  `M${xs(bit)},72 V82 H${xs(bit) - 30} V151 H${xs(bit)} V164`,
                  trace.bitsA[bit]!,
                )}
              </g>
            ))}
            {bits.map((bit) => {
              const source = trace.shiftSources[bit],
                x = xs(bit);
              const zeroX = operation === "LSL" ? 415 : 55;
              return (
                <g key={`shift-${bit}`}>
                  {source === null ? (
                    <>
                      <circle
                        className="circuit-constant"
                        cx={zeroX}
                        cy="186"
                        r="13"
                      />
                      <text
                        className="circuit-small"
                        x={zeroX}
                        y="192"
                        textAnchor="middle"
                      >
                        0
                      </text>
                      {wire(`M${zeroX},199 L${x},250 V278`, 0)}
                    </>
                  ) : (
                    wire(
                      `M${xs(source!)},164 L${x},250 V278`,
                      trace.bitsA[source!]!,
                    )
                  )}
                </g>
              );
            })}
            {operation === "ASR" && (
              <circle className="circuit-junction" cx="100" cy="164" r="4" />
            )}
            {operation === "LSL" ? (
              <>
                {wire("M100,164 H20 V210", output.C!, true)}
                <circle className="circuit-junction" cx="100" cy="164" r="4" />
                <text data-circuit-flag="C" x="20" y="235" textAnchor="middle">
                  C={show(output.C)}
                </text>
              </>
            ) : (
              <>
                {wire("M370,164 H425 V255", output.C!, true)}
                <circle className="circuit-junction" cx="370" cy="164" r="4" />
                <text data-circuit-flag="C" x="425" y="278" textAnchor="end">
                  C={show(output.C)}
                </text>
              </>
            )}
          </>
        )}

        {arithmetic ? (
          <>
            <text data-circuit-flag="C" x="8" y="197">
              C
            </text>
            {wire("M30,210 V254", trace.carryOutOfSign!, true)}
            {wire("M145,210 V240 H54 V254", trace.carryIntoSign!, true)}
            <circle className="circuit-junction" cx="145" cy="210" r="3" />
            <circle className="circuit-junction" cx="30" cy="210" r="3" />
            <g data-flag-gate="V">
              <Gate kind="XOR" x={42} y={274} small />
            </g>
            {wire("M42,294 V302", output.V!)}
            <text data-circuit-flag="V" x="42" y="322" textAnchor="middle">
              V={show(output.V)}
            </text>
          </>
        ) : (
          <>
            {output.path === "logic" && (
              <text data-circuit-flag="C" x="12" y="217">
                C —
              </text>
            )}
            <text data-circuit-flag="V" x="12" y="272">
              V —
            </text>
          </>
        )}

        {bits.map((bit) => {
          const x = xs(bit),
            fraction = (x - 75) / 320;
          return (
            <g key={`result-${bit}`}>
              {wire(
                `M${x},322 V${366 + 48 * fraction * (1 - fraction)}`,
                trace.resultBits[bit]!,
              )}
              <Cell
                x={x}
                y={300}
                value={revealed ? trace.resultBits[bit]! : null}
                label={`Result bit ${bit}`}
              />
            </g>
          );
        })}
        <text className="circuit-row-label" x="429" y="306" textAnchor="middle">
          R
        </text>
        {wire("M100,336 H25", output.N)}
        <circle className="circuit-junction" cx="100" cy="336" r="3" />
        <text data-circuit-flag="N" x="25" y="358" textAnchor="middle">
          N={show(output.N)}
        </text>
        <g className="circuit-gate" data-flag-gate="Z">
          <path d="M75,366 Q235,390 395,366 Q370,400 235,414 Q100,400 75,366 Z" />
          <circle cx="235" cy="420" r="5" />
          <text x="235" y="402" textAnchor="middle">
            NOR of R
          </text>
        </g>
        {wire("M235,425 V440", output.Z)}
        <text data-circuit-flag="Z" x="235" y="458" textAnchor="middle">
          Z={show(output.Z)}
        </text>

        {bits.map((bit) => (
          <g key={`inputs-${bit}`}>
            <Cell
              x={xs(bit)}
              y={50}
              value={trace.bitsA[bit]!}
              label={`A bit ${bit}`}
              toggle={() => onA(a ^ (1 << bit))}
            />
            <Cell
              x={xs(bit)}
              y={114}
              value={trace.bitsB[bit]!}
              label={`B bit ${bit}`}
              toggle={() => onB(b ^ (1 << bit))}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
