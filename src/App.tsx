import { useEffect, useRef, useState } from "react";
import { Icon, Mark } from "./components/Icon";
import { World } from "./components/World";
import { Analytics } from "./components/Analytics";
import { Workflow } from "./components/Workflow";
import { Estimator } from "./components/Estimator";
import { AuditDialog } from "./components/AuditDialog";
import { mountMotion } from "./engine/motion";
import { chapterIds } from "./engine/route";

const chapters = [
  "Overview",
  "Intelligence",
  "Automation",
  "Transformation",
  "Let’s talk",
];
function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label mono">
      <span>{number}</span>
      <i />
      {children}
    </div>
  );
}
function App() {
  const [chapter, setChapter] = useState(0),
    [menu, setMenu] = useState(false),
    [modal, setModal] = useState<"audit" | "privacy" | null>(null);
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const page = useRef<HTMLDivElement>(null),
    menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => mountMotion(setChapter), []);
  useEffect(() => {
    // The first native hash lookup happens before React creates chapter elements.
    const id = window.location.hash.slice(1);
    if (!chapterIds.some((chapterId) => chapterId === id)) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled && window.scrollY === 0) {
        document
          .getElementById(id)
          ?.scrollIntoView({ block: "start", behavior: "instant" });
        window.dispatchEvent(new Event("scroll"));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    // Native focus scrolling can leave a partially visible control behind a fixed header.
    let frame = 0;
    const protectFocus = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        target.closest("header, dialog, .chapter-rail, .motion-control") ||
        target.matches(".skip-link")
      )
        return;
      cancelAnimationFrame(frame);
      const ensureVisible = () => {
        const rect = target.getBoundingClientRect();
        const safeTop =
          (document.querySelector("header")?.getBoundingClientRect().bottom ||
            88) + 16;
        if (rect.top < safeTop)
          window.scrollBy({ top: rect.top - safeTop, behavior: "instant" });
        else if (rect.bottom > innerHeight - 20)
          window.scrollBy({
            top: rect.bottom - innerHeight + 20,
            behavior: "instant",
          });
      };
      ensureVisible();
      frame = requestAnimationFrame(ensureVisible);
    };
    document.addEventListener("focusin", protectFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", protectFocus);
    };
  }, []);
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setPaused(q.matches);
    q.addEventListener("change", change);
    return () => q.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    const outside = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenu(false);
    };
    document.addEventListener("keydown", handle);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", handle);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".plate"),
    );
    let raf = 0,
      x = 0,
      y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rects = targets.map((t) => t.getBoundingClientRect());
        targets.forEach((t, i) => {
          t.style.setProperty("--px", `${x - rects[i].left}px`);
          t.style.setProperty("--py", `${y - rects[i].top}px`);
        });
        raf = 0;
      });
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
    };
  }, []);
  const audit = () => setModal("audit");
  return (
    <div ref={page} className={`site active-${chapter}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <World paused={paused} />
      <header className="header">
        <div className="wrap header-inner">
          <a className="brand" href="#signal" aria-label="DESICIA home">
            <Mark />
            <span>DESICIA</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {[1, 2, 3].map((i) => (
              <a
                href={`#${chapterIds[i]}`}
                key={i}
                aria-current={chapter === i ? "location" : undefined}
              >
                {chapters[i]}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-cta" onClick={audit}>
              Let’s talk <Icon name="diagonal" size={15} />
            </button>
            <div className="mobile-menu" ref={menuRef}>
              <button
                aria-label={menu ? "Close navigation" : "Open navigation"}
                aria-expanded={menu}
                aria-controls="mobile-links"
                onClick={() => setMenu(!menu)}
                className="menu-toggle"
              >
                <span />
                <span />
              </button>
              {menu && (
                <nav id="mobile-links" aria-label="Mobile navigation">
                  {chapters.map((c, i) => (
                    <a
                      href={`#${chapterIds[i]}`}
                      key={c}
                      onClick={() => setMenu(false)}
                    >
                      <span className="mono">0{i + 1}</span>
                      {c}
                      <Icon name="diagonal" />
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      </header>
      <aside className="chapter-rail" aria-label="Chapters">
        {chapters.map((c, i) => (
          <a
            key={c}
            href={`#${chapterIds[i]}`}
            aria-label={`Chapter ${i + 1}: ${c}`}
            aria-current={chapter === i ? "location" : undefined}
          >
            <span className="rail-label">{c}</span>
            <span className="rail-number mono">0{i + 1}</span>
            <i />
          </a>
        ))}
      </aside>
      <main id="main">
        <section
          id="signal"
          className="chapter hero"
          aria-labelledby="hero-title"
          data-enter
        >
          <div className="wrap hero-main">
            <div className="hero-copy">
              <div className="hero-eyebrow mono" data-hero-enter>
                <span className="status-dot" />
                ENTERPRISE AI. BUILT AROUND YOUR BUSINESS.
              </div>
              <h1 id="hero-title" data-hero-enter>
                Enterprise AI,
                <br />
                <span>put to work.</span>
              </h1>
              <p className="hero-description" data-hero-enter>
                Connect your data. Automate the work.
                <br className="desktop-break" /> Build an enterprise that can
                act on its intelligence.
              </p>
              <div className="hero-actions" data-hero-enter>
                <button className="button primary" onClick={audit}>
                  Request an audit <Icon name="diagonal" />
                </button>
                <a className="text-link" href="#intelligence">
                  Explore our approach <Icon name="down" size={16} />
                </a>
              </div>
              <div className="hero-footnote mono" data-hero-enter>
                BUSINESS-FIRST STRATEGY. PRODUCTION-GRADE AI.
              </div>
            </div>
            <div className="scene-coordinate mono">
              <span className="coordinate-cross">+</span>
              <div>
                THE CONNECTED ENTERPRISE
                <br />
                <span>DATA → INTELLIGENCE → ACTION</span>
              </div>
              <span>FIG. 001</span>
            </div>
          </div>
          <div className="wrap hero-bottom">
            <div className="hero-intro mono">
              THREE CAPABILITIES.
              <br />
              <span>ONE CONNECTED SYSTEM.</span>
            </div>
            {[
              {
                n: "01",
                name: "Intelligence",
                text: "Make your data a decision advantage.",
                id: "intelligence",
              },
              {
                n: "02",
                name: "Automation",
                text: "Move from insight to action.",
                id: "automation",
              },
              {
                n: "03",
                name: "Transformation",
                text: "Build the operating model behind both.",
                id: "transformation",
              },
            ].map((c) => (
              <a key={c.n} href={`#${c.id}`} className="capability">
                <span className="capability-number mono">{c.n}</span>
                <div>
                  <strong className="capability-title">
                    {c.name}
                    <Icon name="diagonal" size={14} />
                  </strong>
                  <p>{c.text}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section
          id="intelligence"
          className="chapter product-chapter"
          aria-labelledby="intelligence-title"
        >
          <div className="wrap split">
            <div className="chapter-copy">
              <SectionLabel number="01">AI-POWERED ANALYTICS</SectionLabel>
              <h2 id="intelligence-title">
                Enterprise data.
                <br />
                <span>Clear decisions.</span>
              </h2>
              <p>
                Bring disconnected enterprise data into one decision layer. See
                what changed, understand what comes next and give every team a
                reliable starting point.
              </p>
              <div className="capability-list">
                <span>
                  <Icon name="check" size={15} />
                  Cross-system data models
                </span>
                <span>
                  <Icon name="check" size={15} />
                  Predictive scenarios
                </span>
                <span>
                  <Icon name="check" size={15} />
                  Decision-ready reporting
                </span>
              </div>
              <a className="text-link section-link" href="#automation">
                Then put the insight to work <Icon name="arrow" />
              </a>
            </div>
            <Analytics />
          </div>
          <div className="wrap chapter-baseline mono">
            <span>FROM FRAGMENTED DATA</span>
            <span className="baseline-line" />
            <span>TO A CLEARER DECISION</span>
          </div>
        </section>
        <section
          id="automation"
          className="chapter product-chapter"
          aria-labelledby="automation-title"
        >
          <div className="wrap split">
            <div className="chapter-copy">
              <SectionLabel number="02">AUTONOMOUS AI AUTOMATION</SectionLabel>
              <h2 id="automation-title">
                AI workflows.
                <br />
                <span>Less handoff.</span>
              </h2>
              <p>
                Put AI agents to work across your existing systems. Route
                decisions, handle exceptions and keep people in control of the
                actions that matter.
              </p>
              <div className="operating-principle">
                <span className="mono">AUTONOMY, WITH ACCOUNTABILITY.</span>
                <div>
                  <Icon name="shield" size={20} />
                  <p>
                    Human approval where it counts.
                    <br />A trace for every step.
                  </p>
                </div>
              </div>
              <a className="text-link section-link" href="#transformation">
                Build the architecture behind it <Icon name="arrow" />
              </a>
            </div>
            <Workflow />
          </div>
          <div className="wrap chapter-baseline mono">
            <span>FROM MANUAL HANDOFFS</span>
            <span className="baseline-line" />
            <span>TO GOVERNED EXECUTION</span>
          </div>
        </section>
        <section
          id="transformation"
          className="chapter product-chapter transformation"
          aria-labelledby="transformation-title"
        >
          <div className="wrap split">
            <div className="chapter-copy">
              <SectionLabel number="03">
                END-TO-END AI TRANSFORMATION
              </SectionLabel>
              <h2 id="transformation-title">
                A clear path
                <br />
                <span>to AI-native.</span>
              </h2>
              <p>
                Start with the business constraint, not the technology. Build a
                governed architecture around a deployment you can measure—and a
                model you can scale.
              </p>
              <ol className="method">
                {[
                  ["Audit", "Find the highest-value friction."],
                  ["Architect", "Define systems, controls and measures."],
                  ["Deploy", "Prove a focused workflow in production."],
                  ["Scale", "Extend what works. Keep ownership clear."],
                ].map(([a, b], i) => (
                  <li key={a}>
                    <span className="mono">0{i + 1}</span>
                    <div>
                      <strong>{a}</strong>
                      <p>{b}</p>
                    </div>
                    <Icon name={i === 3 ? "diagonal" : "down"} size={14} />
                  </li>
                ))}
              </ol>
            </div>
            <Estimator onAudit={audit} />
          </div>
        </section>
        <section
          id="contact"
          className="chapter closing"
          aria-labelledby="contact-title"
        >
          <div className="wrap closing-main">
            <SectionLabel number="04">A PRACTICAL NEXT STEP</SectionLabel>
            <div className="closing-heading">
              <h2 id="contact-title">
                Your AI roadmap
                <br />
                <span>starts here.</span>
              </h2>
              <div>
                <p>
                  Bring us a business bottleneck. We’ll map the data, decisions
                  and systems behind it—and define a practical place to start.
                </p>
                <button className="button primary" onClick={audit}>
                  Request an audit <Icon name="diagonal" />
                </button>
              </div>
            </div>
            <div className="trust-grid">
              {[
                {
                  icon: "layers",
                  name: "Deployment boundaries.",
                  text: "Define private-network boundaries, integration scope and deployment needs in the architecture review.",
                },
                {
                  icon: "shield",
                  name: "Data governance.",
                  text: "Agree retention, residency and model-provider terms before a production system handles your data.",
                },
                {
                  icon: "check",
                  name: "Evidence & assurance.",
                  text: "Establish the baseline, controls and measurable acceptance criteria. Validate assurance during procurement.",
                },
              ].map((t) => (
                <div key={t.name}>
                  <Icon name={t.icon} size={21} />
                  <h3>{t.name}</h3>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
            <div className="diligence">
              <details>
                <summary>
                  Private deployment & data retention
                  <Icon name="plus" size={14} />
                </summary>
                <p>
                  Define private-VPC boundaries, residency and provider
                  retention settings in the architecture review.
                  Zero-data-retention commitments depend on the selected
                  infrastructure and agreed processing terms.
                </p>
              </details>
              <details>
                <summary>
                  Security assurance & SOC 2<Icon name="plus" size={14} />
                </summary>
                <p>
                  Request applicable independent assurance reports and controls
                  during procurement. No SOC 2 certification is asserted on this
                  site. Requirements must be verified before production access.
                </p>
              </details>
            </div>
          </div>
          <footer className="wrap footer">
            <div className="footer-top">
              <a className="brand" href="#signal">
                <Mark />
                <span>DESICIA</span>
              </a>
              <span className="footer-thesis">
                Enterprise intelligence. Operational impact.
              </span>
              <a href="#signal" className="back-top">
                Back to top <Icon name="up" size={13} />
              </a>
            </div>
            <div className="footer-bottom mono">
              <span>© {new Date().getFullYear()} DESICIA</span>
              <span>DESIGNED FOR WHAT’S NEXT. BUILT FOR WHAT MATTERS.</span>
              <button onClick={() => setModal("privacy")}>
                Data use & privacy <Icon name="diagonal" size={12} />
              </button>
            </div>
          </footer>
        </section>
      </main>
      <div className="motion-control">
        <button
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Resume background motion" : "Pause background motion"
          }
        >
          <Icon name={paused ? "play" : "pause"} size={12} />
          <span className="mono">
            {paused ? "MOTION PAUSED" : "PAUSE MOTION"}
          </span>
        </button>
      </div>
      <AuditDialog open={modal === "audit"} onClose={() => setModal(null)} />
      <AuditDialog
        open={modal === "privacy"}
        privacy
        onClose={() => setModal(null)}
      />
    </div>
  );
}
export default App;
