import { useId, useState } from "react";
import { Icon, Mark } from "./Icon";
const data = {
  Revenue: {
    label: "Net revenue",
    value: "$4.82m",
    change: "+12.4%",
    suffix: "vs. prior period",
    unit: "$m",
    ticks: ["5.0", "3.5", "2.0"],
    actual: [1.8, 2.1, 1.95, 2.65, 2.4, 3.2, 3.0, 3.8, 3.55, 4.5, 4.3, 4.82],
    forecast: "5.46m",
    confidence: "86%",
    rows: [
      ["Collection risk", "EMEA · 8 invoices", "Review"],
      ["Pipeline growth", "Enterprise segment", "+18.2%"],
      ["Regional variance", "APAC · above plan", "+6.4%"],
    ],
  },
  Operations: {
    label: "Orders fulfilled",
    value: "8,642",
    change: "+8.1%",
    suffix: "vs. prior period",
    unit: "k",
    ticks: ["9.0", "6.0", "3.0"],
    actual: [2.8, 3.4, 3.2, 4.8, 4.5, 5.5, 5.4, 6.8, 6.5, 7.7, 7.4, 8.64],
    forecast: "9,180",
    confidence: "82%",
    rows: [
      ["Capacity alert", "West · 3 work centres", "Review"],
      ["Cycle time", "Order to dispatch", "−11.3%"],
      ["Throughput", "Assembly · above plan", "+8.1%"],
    ],
  },
  "Supply chain": {
    label: "On-time delivery",
    value: "96.2%",
    change: "+4.6 pts",
    suffix: "vs. prior period",
    unit: "%",
    ticks: ["100", "90", "80"],
    actual: [81, 84, 83, 88, 86, 90, 89, 93, 92, 95, 94, 96.2],
    forecast: "97.8%",
    confidence: "89%",
    rows: [
      ["Supplier risk", "Components · 2 vendors", "Review"],
      ["Stock coverage", "Critical inventory", "24 days"],
      ["Lead time", "Regional distribution", "−9.2%"],
    ],
  },
};
type View = keyof typeof data;
export function Analytics() {
  const [view, setView] = useState<View>("Revenue");
  const [forecast, setForecast] = useState(true);
  const d = data[view],
    id = useId().replaceAll(":", "");
  const min = Math.min(...d.actual) * 0.8,
    max = Math.max(...d.actual) * 1.17;
  const lastY = 150 - ((d.actual.at(-1)! - min) / (max - min)) * 125;
  const points = d.actual
    .map((n, i) => `${i * 36 + 12},${150 - ((n - min) / (max - min)) * 125}`)
    .join(" ");
  return (
    <div className="console plate" data-visual="analytics">
      <div className="plate-top">
        <span className="console-brand">
          <Mark /> Intelligence console
        </span>
        <span className="mono demo-label">
          <span className="status-dot" />
          Interactive demo
        </span>
      </div>
      <div className="console-tabs" role="tablist" aria-label="Analytics view">
        {(Object.keys(data) as View[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            aria-controls={`panel-${id}`}
            id={`tab-${id}-${v.replaceAll(" ", "-")}`}
            tabIndex={view === v ? 0 : -1}
            onKeyDown={(e) => {
              const keys = Object.keys(data) as View[];
              const i = keys.indexOf(view);
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (i + (e.key === "ArrowRight" ? 1 : -1) + 3) % 3;
                setView(keys[n]);
                (
                  e.currentTarget.parentElement?.children[
                    n
                  ] as HTMLButtonElement
                )?.focus();
              }
            }}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div
        className="console-body"
        role="tabpanel"
        id={`panel-${id}`}
        aria-labelledby={`tab-${id}-${view.replaceAll(" ", "-")}`}
      >
        <div className="metric-row">
          <div>
            <span className="small-label">{d.label}</span>
            <div className="metric-value">
              {d.value}
              <span className="positive">↗ {d.change}</span>
            </div>
            <span className="metric-sub">{d.suffix}</span>
          </div>
          <span className="period mono">
            LAST 12 MONTHS <Icon name="down" size={12} />
          </span>
        </div>
        <div className="chart-key">
          <span>
            <i />
            Actual
          </span>
          <span>
            <i className="forecast-dot" />
            Forecast
          </span>
          <button
            role="switch"
            aria-checked={forecast}
            onClick={() => setForecast(!forecast)}
            aria-label="Show forecast"
          >
            <span className={`toggle ${forecast ? "on" : ""}`} />
            Show forecast
          </button>
        </div>
        <div className="chart">
          <div className="chart-axis mono">
            {d.ticks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <svg
            viewBox="0 0 500 178"
            role="img"
            aria-label={`${d.label} illustrative trend over twelve months; current ${d.value}${forecast ? `, forecast ${d.forecast}` : ""}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d8c6a0" stopOpacity=".16" />
                <stop offset="1" stopColor="#d8c6a0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 75, 125].map((y) => (
              <line
                key={y}
                x1="0"
                x2="500"
                y1={y}
                y2={y}
                stroke="#343b34"
                strokeDasharray="3 5"
              />
            ))}
            <polygon
              points={`12,175 ${points} 408,175`}
              fill={`url(#area-${id})`}
            />
            <polyline
              points={points}
              stroke="#dac9a6"
              strokeWidth="2.5"
              fill="none"
              strokeLinejoin="round"
            />
            {forecast && (
              <>
                <path
                  d={`M408 ${lastY} 448 ${lastY - 14} 488 ${lastY - 30}`}
                  stroke="#b0c5ac"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  fill="none"
                />
                <path
                  d={`m408 ${lastY} 80-42v44Z`}
                  fill="#add3b0"
                  fillOpacity=".06"
                />
              </>
            )}
            <circle cx="408" cy={lastY} r="4" fill="#d8c6a0" />
          </svg>
        </div>
        <div className="chart-months mono">
          <span>JAN</span>
          <span>APR</span>
          <span>JUL</span>
          <span>OCT</span>
          <span>DEC</span>
        </div>
        <div className="insight-heading mono">
          <span>DECISION FEED</span>
          <span>03 SIGNALS</span>
        </div>
        <div className="feed">
          {d.rows.map(([a, b, c], i) => (
            <div className="feed-row" key={a}>
              <span className={`feed-symbol ${i === 0 ? "warning" : ""}`}>
                <Icon name={i === 0 ? "bolt" : "check"} size={13} />
              </span>
              <div>
                <strong>{a}</strong>
                <span>{b}</span>
              </div>
              <span className={i === 0 ? "warning" : "positive"}>{c}</span>
            </div>
          ))}
        </div>
        <div className="console-foot mono">
          <span>ILLUSTRATIVE DATA · NOT CLIENT RESULTS</span>
          <span>MODEL CONFIDENCE {d.confidence}</span>
        </div>
      </div>
    </div>
  );
}
