// Copyright © 2026 Christopher Snow
import { useEffect, useRef, useState } from "react";
import { LessonView } from "@platform/lesson-runtime";
import { chapters, learningPath, futurePaths } from "@bl/content";
import { binary, hex, signed } from "@bl/bit-model";
import { book } from "./book";
import { runtimeStrings } from "./runtime-strings";

const base = import.meta.env.BASE_URL;
const calculator = `${base}calculator/`;
const memory = new Map<string, string | null>();
const storage = {
  getItem(key: string) {
    try {
      if (memory.has(key)) return memory.get(key) ?? null;
      const value = localStorage.getItem(key);
      memory.set(key, value);
      return value;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  setItem(key: string, value: string) {
    memory.set(key, value);
    try {
      localStorage.setItem(key, value);
    } catch {
      window.dispatchEvent(new Event("bit-lab-storage-unavailable"));
    }
  },
  removeItem(key: string) {
    memory.set(key, null);
    try {
      localStorage.removeItem(key);
    } catch {
      window.dispatchEvent(new Event("bit-lab-storage-unavailable"));
    }
  },
  get(key: string) {
    return this.getItem(key);
  },
  set(key: string, value: string) {
    this.setItem(key, value);
  },
  remove(key: string) {
    this.removeItem(key);
  },
  keys() {
    try {
      return [...new Set([...memory.keys(), ...Object.keys(localStorage)])];
    } catch {
      return [...memory.keys()];
    }
  },
};
const lessonHref = (id: string) => `#/lesson/${id}`;
function readCompleted(): string[] {
  try {
    const v: unknown = JSON.parse(
      storage.getItem("bit-lab:studied:v1") ?? "[]",
    );
    return Array.isArray(v)
      ? v.filter(
          (x): x is string =>
            typeof x === "string" && learningPath.some((c) => c.id === x),
        )
      : [];
  } catch {
    return [];
  }
}

function Cover({ completed }: { completed: string[] }) {
  const [value, setValue] = useState(180);
  const next =
    learningPath.find((c) => !completed.includes(c.id)) ?? learningPath[0]!;
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">An interactive course · First draft</p>
          <h1>
            How computers
            <br />
            represent and
            <br />
            <em>process data.</em>
          </h1>
          <p className="hero-intro">
            Change a bit. Follow a carry. Find out why the same pattern can mean
            two different numbers.
          </p>
          <a className="button hero-action" href={lessonHref(next.id)}>
            {completed.length ? "Continue learning" : "Start with bits"}
            <span aria-hidden="true">↗︎</span>
          </a>
          <p className="hero-caption">
            {learningPath.length} lessons · Calculator · Practice
          </p>
        </div>
        <div className="hero-instrument">
          <p className="instrument-label">ONE BYTE / TWO READINGS</p>
          <div className="hero-bits" role="group" aria-label="Explore one byte">
            {binary(value, 8)
              .split("")
              .map((b, i) => (
                <button
                  key={i}
                  aria-label={`Byte bit ${7 - i}: ${b}`}
                  aria-pressed={b === "1"}
                  onClick={() => setValue(value ^ (2 ** (7 - i)))}
                >
                  {b}
                  <small>{7 - i}</small>
                </button>
              ))}
          </div>
          <div className="hero-values" aria-live="polite">
            <div>
              <span>Unsigned</span>
              <strong>{value}</strong>
            </div>
            <div>
              <span>Signed</span>
              <strong>{signed(value, 8)}</strong>
            </div>
            <div>
              <span>Hex</span>
              <strong>{hex(value, 8)}</strong>
            </div>
          </div>
          <p>
            Tap any bit. The pattern changes; each reading follows its own rule.
          </p>
          <div className="signal-line" aria-hidden="true">
            BITS <span>→</span> OPERATIONS <span>→</span> MEANING
          </div>
        </div>
      </section>
      <section className="intro-grid">
        <div>
          <p className="eyebrow">Before you start</p>
          <h2>A little arithmetic is enough.</h2>
          <p>
            You need addition, subtraction and a willingness to try things.
            Binary, hexadecimal, logic operations and signed numbers are
            introduced as you need them.
          </p>
        </div>
        <div>
          <p className="eyebrow">How to use the course</p>
          <h2>Predict. Inspect. Explain.</h2>
          <p>
            Ten lessons build your understanding through small experiments and
            checked questions. The final lesson guides you into the calculator’s
            exercise bank. Your answers and study marks stay in this browser.
          </p>
        </div>
      </section>
      <section aria-labelledby="path-title" className="path">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Learning path 01</p>
            <h2 id="path-title">Bits, arithmetic and decisions</h2>
          </div>
          <span className="progress-count">
            {completed.length} / {learningPath.length} done
          </span>
        </div>
        <ol className="chapter-list">
          {learningPath.map((c, i) => (
            <li key={c.id} data-done={completed.includes(c.id)}>
              <a href={lessonHref(c.id)}>
                <span className="chapter-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.line}</p>
                </div>
                <span className="chapter-status">
                  {completed.includes(c.id) ? (
                    <>
                      <span aria-hidden="true">✓ </span>Done
                    </>
                  ) : (
                    "Open ↗︎"
                  )}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>
      <section className="tools-strip">
        <div>
          <p className="eyebrow">Keep experimenting</p>
          <h2>A workbench beside the lessons.</h2>
          <p>
            The programmer calculator, its exercise bank and the original
            randomised drills remain available.
          </p>
        </div>
        <div className="tool-links">
          <a className="button primary" href={calculator}>
            Open calculator ↗︎
          </a>
          <a className="button secondary" href="#/practice">
            Choose some practice →
          </a>
        </div>
      </section>
      <section>
        <p className="eyebrow">Course roadmap · Not yet lessons</p>
        <h2>Beyond the first path</h2>
        <div className="future-grid">
          {futurePaths.map((p) => (
            <div key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.line}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="companions">
        <h2>Three ways to understand the machine</h2>
        <p>
          <a href="https://snowch.github.io/digital-design/">Digital Design</a>{" "}
          builds it from gates. Bit Lab explores the data and operations.{" "}
          <a href="https://snowch.github.io/assembly-lab/">Assembly Lab</a> puts
          instructions to work.
        </p>
      </section>
    </>
  );
}

function Practice() {
  return (
    <div className="practice-page">
      <p className="eyebrow">Practice</p>
      <h1>
        Make a prediction.
        <br />
        Check the reasoning.
      </h1>
      <p className="lead">
        Start with a lesson check, repeat a randomised drill, or work through
        the calculator’s exercises.
      </p>
      <div className="practice-grid">
        <a href={`${calculator}#exh`}>
          <h2>Calculator exercise bank ↗︎</h2>
          <p>
            Load a starting value, try the operations, reveal the worked answer
            and mark your progress. These exercises are self-checked.
          </p>
        </a>
        <a href={`${calculator}docs/readings-drills.html`}>
          <h2>Two readings: drills ↗︎</h2>
          <p>
            Read and write patterns, negate values and judge whether a result
            fits. Each question checks your prediction.
          </p>
        </a>
        <a href={`${calculator}docs/flag-drills.html`}>
          <h2>Flag drills ↗︎</h2>
          <p>
            Practise comparison flags, signed and unsigned branches, and
            widening loads.
          </p>
        </a>
      </div>
      <h2>Lesson checks</h2>
      <p>
        These questions are checked automatically. Use the hints when you need a
        smaller step.
      </p>
      <ol className="chapter-list">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`${lessonHref(c.id)}?practice`}>
              <span className="chapter-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.line}</p>
              </div>
              <span aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
      <aside className="source-note">
        <h2>More experiments and reference</h2>
        <p>
          The <a href={`${calculator}docs/notes.html`}>original notes</a>{" "}
          include the gate-level ALU, registers, C examples and breadboard
          activities. They are retained as reference material while the new
          course develops.
        </p>
        <p>
          <a href={`${calculator}docs/twos-complement.pdf`}>
            Download the two’s complement tutorial (PDF)
          </a>
        </p>
      </aside>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState(() => location.hash || "#/");
  const [completed, setCompleted] = useState(readCompleted);
  const [theme, setTheme] = useState(() => {
    const t = storage.getItem("bit-lab:theme:v1");
    return t === "light" || t === "dark" ? t : "auto";
  });
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    const onHash = () => setRoute(location.hash || "#/");
    const unavailable = () => setStorageWarning(true);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("bit-lab-storage-unavailable", unavailable);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("bit-lab-storage-unavailable", unavailable);
    };
  }, []);
  useEffect(() => {
    if (theme === "auto") delete document.documentElement.dataset["theme"];
    else document.documentElement.dataset["theme"] = theme;
    storage.setItem("bit-lab:theme:v1", theme);
  }, [theme]);
  const id = route.match(/^#\/lesson\/([a-z-]+)(?:\?practice)?$/)?.[1];
  const lesson = book.lessons.find((l) => l.id === id);
  const index = lesson ? book.lessons.indexOf(lesson) : -1;
  const lastRoute = useRef(route);
  useEffect(() => {
    document.title = `${lesson?.title ?? (route === "#/practice" ? "Practice" : "How computers represent and process data")} · Bit Lab`;
    const shouldFocus =
      lastRoute.current !== route || route.endsWith("?practice");
    lastRoute.current = route;
    if (!shouldFocus) return;
    const frame = requestAnimationFrame(() => {
      const target = route.endsWith("?practice")
        ? document.getElementById("section-challenge")
        : document.getElementById("main");
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route, lesson]);
  const studied = lesson ? completed.includes(lesson.id) : false;
  function toggleStudy() {
    if (!lesson) return;
    const next = studied
      ? completed.filter((x) => x !== lesson.id)
      : [...completed, lesson.id];
    setCompleted(next);
    storage.setItem("bit-lab:studied:v1", JSON.stringify(next));
  }
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Bit Lab home">
          <span className="brand-mark" aria-hidden="true">
            01
          </span>{" "}
          BIT LAB
        </a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={route === "#/" ? "page" : undefined}>
            Learn
          </a>
          <a
            href="#/practice"
            aria-current={route === "#/practice" ? "page" : undefined}
          >
            Practice
          </a>
          <a href={calculator}>Calculator ↗︎</a>
        </nav>
        <div className="header-actions">
          <a
            className="github-star"
            href="https://github.com/snowch/bit-lab"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star Bit Lab on GitHub (opens in a new tab)"
            title="Star Bit Lab on GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
            </svg>
            <span>Star</span>
          </a>
          <label className="theme-label">
            <span>Theme</span>
            <select
              aria-label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="auto">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </header>
      {storageWarning && (
        <p role="status" className="storage-warning">
          Browser storage is unavailable. Your work will remain in this tab
          until you reload or close it.
        </p>
      )}
      <main id="main" tabIndex={-1}>
        {route === "#/" || route === "" ? (
          <Cover completed={completed} />
        ) : route === "#/practice" ? (
          <Practice />
        ) : lesson ? (
          <>
            <div className="lesson-top">
              <a href="#/">← Learning path</a>
              <span>
                Lesson {index + 1} of {learningPath.length}
              </span>
              <a href={calculator} target="_blank" rel="noopener">
                Calculator in a new tab ↗︎
              </a>
            </div>
            <LessonView
              key={lesson.id}
              book={book}
              lesson={lesson}
              storage={storage}
              lessonHref={lessonHref}
              strings={runtimeStrings}
            />
            <nav className="lesson-nav" aria-label="Lesson navigation">
              {index > 0 ? (
                <a href={lessonHref(learningPath[index - 1]!.id)}>
                  ← {learningPath[index - 1]!.title}
                </a>
              ) : (
                <span />
              )}
              <div className="lesson-nav-forward">
                <label className="lesson-done">
                  <input
                    type="checkbox"
                    checked={studied}
                    onChange={toggleStudy}
                    aria-describedby="lesson-done-note"
                  />
                  <span>Mark lesson as done</span>
                </label>
                {index < learningPath.length - 1 ? (
                  <a href={lessonHref(learningPath[index + 1]!.id)}>
                    {learningPath[index + 1]!.title} →
                  </a>
                ) : (
                  <a href="#/practice">Continue with practice →</a>
                )}
              </div>
            </nav>
            <p id="lesson-done-note" className="lesson-done-note">
              Your lesson tick is saved in this browser. Exercise answers and
              calculator ticks are separate.
            </p>
          </>
        ) : (
          <section>
            <h1>That page is not here</h1>
            <p>
              <a href="#/">Return to the learning path</a>.
            </p>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <p>Copyright © 2026 Christopher Snow</p>
        <nav aria-label="Companion projects">
          <a href="https://snowch.github.io/digital-design/">Digital Design</a>
          <a href="https://snowch.github.io/assembly-lab/">Assembly Lab</a>
          <a href="https://github.com/snowch/bit-lab">Source on GitHub</a>
        </nav>
      </footer>
    </>
  );
}
