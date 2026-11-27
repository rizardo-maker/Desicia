import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { leadSchema } from "../shared/validation";

export function createApi(database: DatabaseSync) {
  database.exec(`CREATE TABLE IF NOT EXISTS audit_requests (
    id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL,
    email TEXT NOT NULL, company TEXT NOT NULL, priority TEXT NOT NULL, context TEXT NOT NULL,
    consent INTEGER NOT NULL)`);
  database.exec("PRAGMA journal_mode = WAL");
  const app = express();
  app.disable("x-powered-by");
  app.use(compression());
  const production = process.env.NODE_ENV === "production";
  app.use(
    helmet({
      contentSecurityPolicy: production
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              fontSrc: ["'self'"],
              imgSrc: ["'self'", "data:"],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: [
                "'self'",
                "https://*.e2b.app",
                "https://arena.ai",
                "https://*.arena.ai",
              ],
              upgradeInsecureRequests: null,
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
    }),
  );
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "12kb" }));
  const retentionDays = Math.min(
    365,
    Math.max(1, Number(process.env.LEAD_RETENTION_DAYS) || 30),
  );
  const purge = () =>
    database
      .prepare("DELETE FROM audit_requests WHERE created_at < ?")
      .run(new Date(Date.now() - retentionDays * 86400000).toISOString());
  purge();
  app.get("/api/health", (_req, res) =>
    res.json({ status: "ok", delivery: "local-storage", retentionDays }),
  );
  app.post(
    "/api/audit-requests",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again in 15 minutes." },
    }),
    (req, res) => {
      const origin = req.get("origin");
      if (origin) {
        const allowed = (process.env.ALLOWED_ORIGINS || "")
          .split(",")
          .filter(Boolean);
        let sameOrigin = false;
        try {
          sameOrigin = new URL(origin).host === req.get("host");
        } catch {
          /* malformed origin */
        }
        if (!sameOrigin && !allowed.includes(origin)) {
          res
            .status(403)
            .json({ error: "This request origin is not allowed." });
          return;
        }
      }
      if (!req.is("application/json")) {
        res.status(415).json({ error: "Send a JSON request." });
        return;
      }
      const parsed = leadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      try {
        purge();
        const lead = parsed.data,
          id = randomUUID();
        database
          .prepare("INSERT INTO audit_requests VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
          .run(
            id,
            new Date().toISOString(),
            lead.name,
            lead.email,
            lead.company,
            lead.priority,
            lead.context,
            1,
          );
        // Deliberate integration boundary: storage is authoritative. No pretend email/CRM delivery.
        res
          .status(201)
          .json({ reference: id, status: "saved", delivery: "local-storage" });
      } catch {
        res.status(503).json({
          error:
            "Request storage is temporarily unavailable. Please try again.",
        });
      }
    },
  );
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API route not found." }),
  );
  app.use(
    (
      err: { status?: number },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      res.status(err.status === 413 ? 413 : 400).json({
        error:
          err.status === 413
            ? "Request is too large."
            : "Invalid JSON request.",
      });
    },
  );
  return app;
}
