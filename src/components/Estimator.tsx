import { useState } from "react";
import { capacityModel } from "../../shared/validation";
import { Icon } from "./Icon";
export function Estimator({ onAudit }: { onAudit(): void }) {
  const [people, setPeople] = useState(25),
    [hours, setHours] = useState(8),
    [rate, setRate] = useState(45),
    [recovery, setRecovery] = useState(40);
  const { weeklyHours, annualValue } = capacityModel(
    people,
    hours,
    rate,
    recovery,
  );
  const fields = [
    {
      label: "People in the workflow",
      value: people,
      set: setPeople,
      min: 1,
      max: 250,
      step: 1,
      display: String(people),
      id: "people",
    },
    {
      label: "Hours spent per person / week",
      value: hours,
      set: setHours,
      min: 1,
      max: 40,
      step: 1,
      display: `${hours}h`,
      id: "hours",
    },
    {
      label: "Loaded hourly cost (USD)",
      value: rate,
      set: setRate,
      min: 10,
      max: 200,
      step: 5,
      display: `$${rate}`,
      id: "cost",
    },
    {
      label: "Work that could be recovered",
      value: recovery,
      set: setRecovery,
      min: 5,
      max: 80,
      step: 5,
      display: `${recovery}%`,
      id: "recovery",
    },
  ];
  return (
    <div className="estimator plate">
      <div className="plate-top">
        <span className="console-brand">
          <Icon name="grid" />
          Transformation scope
        </span>
        <span className="mono demo-label">YOUR SCENARIO</span>
      </div>
      <div className="estimator-body">
        <div className="estimator-intro">
          <h3>Your transformation scope</h3>
          <p>Explore the capacity in one repetitive workflow.</p>
        </div>
        <div className="ranges">
          {fields.map((f) => (
            <div className="range-field" key={f.id}>
              <div>
                <label htmlFor={f.id}>{f.label}</label>
                <output htmlFor={f.id}>{f.display}</output>
              </div>
              <input
                id={f.id}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.value}
                onChange={(e) => f.set(+e.target.value)}
                style={
                  {
                    "--fill": `${((f.value - f.min) / (f.max - f.min)) * 100}%`,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
        <div className="estimate-output" aria-live="polite">
          <div>
            <span className="mono">ANNUAL CAPACITY VALUE</span>
            <strong>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(annualValue)}
              <small>/ yr</small>
            </strong>
          </div>
          <span className="hours-returned">
            <Icon name="arrow" />
            {weeklyHours.toLocaleString()}h <small>returned / week</small>
          </span>
        </div>
        <p className="formula">
          People × weekly hours × 48 weeks × hourly cost × recoverable work.
        </p>
        <p className="estimate-note">
          Illustrative capacity, not guaranteed savings. Implementation costs
          and adoption affect the business case.
        </p>
        <button className="text-link estimator-cta" onClick={onAudit}>
          Request an audit <Icon name="diagonal" size={14} />
        </button>
      </div>
    </div>
  );
}
