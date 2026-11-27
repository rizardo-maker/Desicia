import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
const steps = [
  {
    name: "Intake",
    system: "DOCUMENT INBOX",
    title: "Read the source",
    text: "Extract invoice fields and source references. Preserve the original document for review.",
    control: "Only allowlisted sources are accepted.",
  },
  {
    name: "Validate",
    system: "VALIDATION AGENT",
    title: "Check the evidence",
    text: "Match the supplier, purchase order and line items. Route mismatches for investigation.",
    control: "Unmatched records stop before payment.",
  },
  {
    name: "Policy",
    system: "POLICY ENGINE",
    title: "Apply your rules",
    text: "Evaluate value thresholds and duplicate-payment rules against the approved policy.",
    control: "Policy decisions are recorded in the trace.",
  },
  {
    name: "Approve",
    system: "HUMAN CHECKPOINT",
    title: "Keep the right control",
    text: "An authorized reviewer approves this payment before the agent can continue.",
    control: "No financial write without explicit approval.",
  },
  {
    name: "Post",
    system: "ERP CONNECTOR",
    title: "Close the loop",
    text: "Prepare the posting and attach the decision record. This demonstration does not access an ERP.",
    control: "Production connectors need scoped credentials.",
  },
];
export function Workflow() {
  const [selected, setSelected] = useState(1),
    [stage, setStage] = useState(-1),
    [running, setRunning] = useState(false),
    [logs, setLogs] = useState<string[]>([
      "Ready to process a sample invoice.",
    ]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const waiting = running && stage === 3;
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!running || stage === 3 || stage >= 5) return;
    timer.current = setTimeout(() => {
      if (stage === 4) {
        setLogs((l) => [...l, "05 · Posting prepared. Simulation complete."]);
        setStage(5);
        setRunning(false);
        return;
      }
      const n = stage + 1;
      setStage(n);
      setSelected(Math.min(4, n));
      setLogs((l) => [
        ...l,
        [
          "01 · Invoice received: DEMO-2048.",
          "02 · Supplier and line items matched.",
          "03 · Policy passed. Human approval required.",
          "04 · Awaiting reviewer approval.",
        ][n] || "Posting…",
      ]);
    }, 650);
    return () => clearTimeout(timer.current);
  }, [stage, running]);
  const run = () => {
    setLogs(["Simulation started · no external systems connected."]);
    setStage(-1);
    setRunning(true);
  };
  const d = steps[selected];
  return (
    <div className="workflow plate" data-visual="workflow">
      <div className="plate-top">
        <span className="console-brand">
          <Icon name="layers" />
          Workflow studio
        </span>
        <span className="mono demo-label">INVOICE OPERATIONS</span>
      </div>
      <div className="workflow-toolbar">
        <span className="small-label">
          <span className="status-dot" />
          Accounts payable
        </span>
        <span className="mono">SIMULATION / 001</span>
      </div>
      <div
        className="graph"
        aria-label="Invoice workflow. Select a step to inspect it."
      >
        <div className="graph-line" />
        {steps.map((s, i) => (
          <button
            key={s.name}
            className={`graph-node node-${i} ${selected === i ? "selected" : ""} ${stage > i ? "complete" : ""} ${stage === i ? "executing" : ""}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span className="node-icon">
              <Icon
                name={
                  stage > i
                    ? "check"
                    : ["layers", "grid", "shield", "check", "diagonal"][i]
                }
                size={20}
              />
            </span>
            <span>{s.name}</span>
            <small className="mono">0{i + 1}</small>
          </button>
        ))}
      </div>
      <div className="inspector">
        <div className="inspector-top mono">
          <span>STEP 0{selected + 1}</span>
          <span>{d.system}</span>
        </div>
        <h3>{d.title}</h3>
        <p>{d.text}</p>
        <div className="guardrail">
          <Icon name="shield" size={14} />
          {d.control}
        </div>
      </div>
      <div className="execution-bar">
        <span className="mono">
          {waiting
            ? "APPROVAL REQUIRED"
            : running
              ? "RUNNING SIMULATION"
              : stage === 5
                ? "SIMULATION COMPLETE"
                : "READY TO EXECUTE"}
        </span>
        <button
          className="small-button"
          disabled={running && !waiting}
          onClick={
            waiting
              ? () => {
                  setStage(4);
                  setSelected(4);
                  setLogs((l) => [
                    ...l,
                    "04 · Reviewer approved the sample payment.",
                  ]);
                }
              : run
          }
        >
          <Icon name={waiting ? "check" : "play"} size={13} />
          {waiting
            ? "Approve sample"
            : running
              ? "Processing…"
              : stage === 5
                ? "Run again"
                : "Run simulation"}
        </button>
      </div>
      <div className="execution-log" role="status" aria-live="polite">
        <span className="log-dot" />
        {logs.at(-1)}
      </div>
    </div>
  );
}
