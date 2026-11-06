// Copyright © 2026 Christopher Snow

import { Fragment, useId, useState } from "react";
import { arithmetic, binary } from "@bl/bit-model";
import { ADDER_ARCHITECTURE_STRINGS as S } from "./strings.adder-architecture";
import "./adder-detail.css";

type Column = ReturnType<typeof arithmetic>["columns"][number];

export function adderText(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    String(values[name] ?? match),
  );
}

/** A functional full-adder view. Every signal is a column of the word model. */
export function FullAdderGates({ column }: { column: Column }) {
  const arrow = useId();
  const C = S.shared;
  const wire = (d: string, value: number) => (
    <path
      className="adder-wire"
      data-signal={value}
      d={d}
      markerEnd={`url(#${arrow}-${value})`}
    />
  );
  const dot = (cx: number, cy: number, value: number) => (
    <circle
      className="adder-junction"
      data-signal={value}
      cx={cx}
      cy={cy}
      r="3"
    />
  );
  const source = (label: string, x: number, value: number) => (
    <g className="adder-signal">
      <text className="adder-signal-label" x={x} y="20" textAnchor="middle">
        {label}
      </text>
      <rect x={x - 22} y="32" width="44" height="34" rx="4" />
      <text x={x} y="56" textAnchor="middle">
        {value}
      </text>
    </g>
  );
  const output = (label: string, x: number, value: number) => (
    <g className="adder-signal adder-output">
      <text className="adder-signal-label" x={x} y="524" textAnchor="middle">
        {label}
      </text>
      <rect x={x - 38} y="466" width="76" height="34" rx="4" />
      <text x={x} y="490" textAnchor="middle">
        {value}
      </text>
    </g>
  );
  const gate = (
    key: string,
    label: string,
    x: number,
    y: number,
    value: number,
  ) => (
    <g className="adder-gate" data-adder-gate={key} data-value={value}>
      <rect x={x} y={y} width="90" height="54" rx="5" />
      <text
        className="adder-gate-name"
        x={x + 45}
        y={y + 21}
        textAnchor="middle"
      >
        {label}
      </text>
      <text x={x + 45} y={y + 44} textAnchor="middle">
        {value}
      </text>
    </g>
  );
  return (
    <svg
      className="adder-gate-circuit"
      viewBox="0 0 340 538"
      aria-hidden="true"
    >
      <defs>
        {[0, 1].map((value) => (
          <marker
            key={value}
            id={`${arrow}-${value}`}
            viewBox="0 0 8 8"
            refX="8"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path data-signal={value} d="M0 0 L8 4 L0 8 Z" />
          </marker>
        ))}
      </defs>
      {wire("M52 66 V88 H76 V130", column.a)}
      {wire("M52 88 H232 V130", column.a)}
      {wire("M142 66 V104 H120 V130", column.b)}
      {wire("M142 104 H276 V130", column.b)}
      {wire("M97 184 V218 H76 V278", column.xor)}
      {wire("M97 218 H232 V278", column.xor)}
      {wire("M310 66 V244 H120 V278", column.incoming)}
      {wire("M310 244 H276 V278", column.incoming)}
      {wire("M253 184 V204 H328 V376 H276 V390", column.ab)}
      {wire("M253 332 V362 H232 V390", column.xc)}
      {wire("M97 332 V466", column.sum)}
      {wire("M253 444 V466", column.carry)}
      {dot(52, 88, column.a)}
      {dot(142, 104, column.b)}
      {dot(97, 218, column.xor)}
      {dot(310, 244, column.incoming)}
      {source(C.inputA, 52, column.a)}
      {source(C.adderB, 142, column.b)}
      {source(C.carryIn, 310, column.incoming)}
      {gate("first-xor", "XOR", 52, 130, column.xor)}
      {gate("operand-and", "AND", 208, 130, column.ab)}
      {gate("result-xor", "XOR", 52, 278, column.sum)}
      {gate("carry-and", "AND", 208, 278, column.xc)}
      {gate("carry-or", "OR", 208, 390, column.carry)}
      {output(C.kept, 97, column.sum)}
      {output(C.carryOut, 253, column.carry)}
    </svg>
  );
}

/** The same computed columns connect the whole word, a selected cell and its five gates. */
export function AdderDetail({
  a,
  b,
  width = 4,
  subtract = false,
  architecture = false,
}: {
  a: number;
  b: number;
  width?: number;
  subtract?: boolean;
  architecture?: boolean;
}) {
  const [selected, select] = useState(1);
  const C = S.shared;
  const B = S.bitLab;
  const result = arithmetic(a, b, width, subtract);
  const column = result.columns[Math.min(selected, width - 1)]!;
  const total = column.a + column.b + column.incoming;
  const equation = adderText(C.equation, {
    a: column.a,
    b: column.b,
    carryIn: column.incoming,
    total,
    binaryTotal: total.toString(2).padStart(2, "0"),
  });
  const proof = [
    ["first-xor", C.firstXor, C.gateXor, column.a, column.b, column.xor],
    [
      "result-xor",
      C.resultXor,
      C.gateXor,
      column.xor,
      column.incoming,
      column.sum,
    ],
    ["operand-and", C.operandAnd, C.gateAnd, column.a, column.b, column.ab],
    [
      "carry-and",
      C.carryAnd,
      C.gateAnd,
      column.xor,
      column.incoming,
      column.xc,
    ],
    ["carry-or", C.carryOr, C.gateOr, column.ab, column.xc, column.carry],
  ] as const;
  return (
    <div
      className="adder-detail"
      data-adder-operation={subtract ? "SUB" : "ADD"}
    >
      {architecture && (
        <div
          className="adder-word-context"
          role="group"
          aria-label={B.wordHeading}
        >
          <div>
            <span>{B.adderResultLabel}</span>
            <code>{binary(result.result, width)}</code>
          </div>
          <svg viewBox="0 0 30 16" aria-hidden="true">
            <path d="M0 8 H30 M22 2 L30 8 L22 14" />
          </svg>
          <div>
            <span>{B.selectorLabel}</span>
            <code>{subtract ? B.sub : B.add}</code>
          </div>
          <svg viewBox="0 0 30 16" aria-hidden="true">
            <path d="M0 8 H30 M22 2 L30 8 L22 14" />
          </svg>
          <div>
            <span>{B.wordResultLabel}</span>
            <code>{binary(result.result, width)}</code>
          </div>
        </div>
      )}
      <p className="adder-preparation">{subtract ? B.subNote : B.addNote}</p>
      <p>{S.adder.intro}</p>
      <div className="adder-chain" role="group" aria-label={C.selectedColumn}>
        {[...result.columns].reverse().map((cell, index) => (
          <Fragment key={cell.bit}>
            {index > 0 && (
              <span
                className="adder-chain-link"
                aria-label={`${adderText(C.carryTo, { nextBit: cell.bit + 1 })}: ${cell.carry}`}
              >
                <span>{cell.carry}</span>
                <svg viewBox="0 0 18 14" aria-hidden="true">
                  <path d="M18 7 H0 M5 3 L0 7 L5 11" />
                </svg>
              </span>
            )}
            <button
              type="button"
              className="adder-column"
              aria-pressed={column.bit === cell.bit}
              aria-label={adderText(C.bit, { bit: cell.bit })}
              data-adder-column={cell.bit}
              data-a={cell.a}
              data-b={cell.b}
              data-incoming={cell.incoming}
              data-sum={cell.sum}
              data-carry={cell.carry}
              onClick={() => select(cell.bit)}
            >
              <span>{adderText(C.bit, { bit: cell.bit })}</span>
              <code>
                {cell.a}+{cell.b}+{cell.incoming}
              </code>
              <strong>{cell.sum}</strong>
            </button>
          </Fragment>
        ))}
      </div>
      <h3>{adderText(S.adder.title, { bit: column.bit })}</h3>
      <p className="muted adder-gate-guide">{S.adder.gateGuide}</p>
      <div className="adder-column-layout">
        <div
          className="adder-column-working"
          data-selected-adder-bit={column.bit}
        >
          <div className="adder-input-triple">
            {[
              [C.inputA, column.a, "a"],
              [C.adderB, column.b, "b"],
              [C.carryIn, column.incoming, "carry"],
            ].map(([label, value, key]) => (
              <div key={key}>
                <span>{label}</span>
                <strong data-adder-input={key}>{value}</strong>
              </div>
            ))}
          </div>
          <div className="adder-equation" role="img" aria-label={equation}>
            <span aria-hidden="true">
              {column.a} + {column.b} + {column.incoming} ={" "}
              <b data-adder-total>{total.toString(2).padStart(2, "0")}</b>
              <sub>2</sub>
            </span>
          </div>
          <div className="adder-output-pair">
            <div>
              <span>{C.carryOut}</span>
              <strong data-adder-output="carry">{column.carry}</strong>
            </div>
            <div>
              <span>{C.kept}</span>
              <strong data-adder-output="sum">{column.sum}</strong>
            </div>
          </div>
          <p className="muted">
            {column.bit === 0
              ? C.initialCarry
              : adderText(C.carryFrom, { previousBit: column.bit - 1 })}
            : <code>{column.incoming}</code>
            <br />
            {column.bit === width - 1
              ? adderText(C.carryBeyondWord, { width })
              : adderText(C.carryTo, { nextBit: column.bit + 1 })}
            : <code>{column.carry}</code>
          </p>
          <div className="adder-gate-proof">
            {proof.map(([key, label, template, left, right, value]) => (
              <div key={key}>
                <span>{label}</span>
                <code data-adder-proof={key}>
                  {adderText(template, { left, right, result: value })}
                </code>
              </div>
            ))}
          </div>
        </div>
        <div className="adder-gate-panel">
          <h4>{S.adder.gateHeading}</h4>
          <p className="muted">{S.adder.wireGuide}</p>
          <FullAdderGates column={column} />
        </div>
      </div>
      <p className="muted adder-scope">{S.adder.scope}</p>
      <p
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {B.wordResultLabel}: {binary(result.result, width)}.{" "}
        {adderText(C.bit, { bit: column.bit })}. {equation} {C.kept}:{" "}
        {column.sum}. {C.carryOut}: {column.carry}.
      </p>
    </div>
  );
}
