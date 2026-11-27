import { useEffect, useRef, useState } from "react";
import { leadSchema } from "../../shared/validation";
import { Icon, Mark } from "./Icon";
export function AuditDialog({
  open,
  onClose,
  privacy = false,
}: {
  open: boolean;
  onClose(): void;
  privacy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState(""),
    [reference, setReference] = useState("");
  useEffect(() => {
    const d = ref.current;
    if (open && !d?.open) {
      setState("idle");
      setError("");
      d?.showModal();
    }
    if (!open && d?.open) d.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const result = leadSchema.safeParse({
      ...values,
      consent: values.consent === "on",
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/audit-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
        signal: AbortSignal.timeout(12000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "The request could not be saved. Please try again.",
        );
      setReference(data.reference);
      setState("success");
      form.reset();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connection unavailable. Please try again.",
      );
      setState("error");
    }
  };
  return (
    <dialog
      ref={ref}
      className={`audit-dialog ${privacy ? "privacy-dialog" : ""}`}
      aria-labelledby={privacy ? "privacy-title" : "audit-title"}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close icon-button"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <Icon name="close" />
      </button>
      <div className="dialog-logo">
        <Mark />
        <span>DESICIA</span>
      </div>
      {privacy ? (
        <>
          <span className="eyebrow">DATA USE / LOCAL BUILD</span>
          <h2 id="privacy-title">Your request data.</h2>
          <p>
            This local website stores the name, email, company, priority and
            context you submit in a server-side database to demonstrate the
            audit-request flow. It does not send email, book a meeting or share
            the request with a CRM.
          </p>
          <p>
            Do not enter confidential business information. Requests are
            retained for 30 days by default and removed on server startup or
            subsequent submissions after that period. The operator can configure
            a shorter retention period and delete the local database.
          </p>
          <p>
            No analytics cookies, advertising trackers or third-party fonts are
            used. Before a public launch, DESICIA must supply a legal privacy
            policy, controller contact, lawful processing basis and approved
            retention terms.
          </p>
          <button className="button primary" onClick={onClose}>
            Close notice <Icon name="arrow" />
          </button>
        </>
      ) : state === "success" ? (
        <div className="success-state" role="status">
          <span className="success-icon">
            <Icon name="check" size={30} />
          </span>
          <span className="eyebrow">REQUEST SAVED</span>
          <h2 id="audit-title">A clear starting point.</h2>
          <p>Your audit request is saved in this build’s local database.</p>
          <p className="receipt mono">REFERENCE / {reference}</p>
          <p className="local-notice">
            This local build does not send email or confirm a meeting. A
            production notification or CRM connection must be configured before
            launch.
          </p>
          <button className="button primary" onClick={onClose}>
            Back to DESICIA <Icon name="arrow" />
          </button>
        </div>
      ) : (
        <>
          <span className="eyebrow">LET’S MAP THE OPPORTUNITY</span>
          <h2 id="audit-title">Start with your business.</h2>
          <p>
            Tell us where work gets stuck. Define a focused architecture audit
            around your priorities.
          </p>
          <form onSubmit={submit}>
            <div className="form-pair">
              <label>
                Full name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Alex Morgan"
                />
              </label>
              <label>
                Work email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  placeholder="alex@company.com"
                />
              </label>
            </div>
            <label>
              Company
              <input
                name="company"
                autoComplete="organization"
                required
                minLength={2}
                maxLength={160}
                placeholder="Company name"
              />
            </label>
            <label>
              Where would you start?
              <select name="priority" defaultValue="AI analytics">
                <option>AI analytics</option>
                <option>AI automation</option>
                <option>AI transformation</option>
              </select>
            </label>
            <label>
              What is the business bottleneck?{" "}
              <span className="optional">(optional)</span>
              <textarea
                name="context"
                maxLength={2000}
                rows={3}
                placeholder="The workflow, system or decision you want to improve…"
              />
            </label>
            <div className="honey" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="consent">
              <input name="consent" type="checkbox" required />
              <span>
                I agree to store this request in the local demo database. I will
                not include confidential information.
              </span>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button primary form-submit"
              disabled={state === "sending"}
              type="submit"
            >
              {state === "sending"
                ? "Saving your request…"
                : "Request an audit"}
              <Icon name="arrow" />
            </button>
            <p className="local-notice">
              Local build: saves your request; does not send email or book a
              meeting.
            </p>
          </form>
        </>
      )}
    </dialog>
  );
}
