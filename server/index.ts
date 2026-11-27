import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import path from "node:path";
import express from "express";
import { createApi } from "./app";
const dataDir = path.resolve(process.env.DATA_DIR || ".data");
mkdirSync(dataDir, { recursive: true, mode: 0o700 });
const dbPath = path.join(dataDir, "audit-requests.sqlite");
const database = new DatabaseSync(dbPath);
chmodSync(dbPath, 0o600);
const app = createApi(database);
if (process.env.NODE_ENV === "production") {
  const root = path.resolve("dist");
  app.use(
    express.static(root, {
      maxAge: "1h",
      index: false,
      setHeaders: (res, filename) => {
        if (filename.includes("/assets/"))
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      },
    }),
  );
  app.get("/", (_req, res) => {
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(root, "index.html"));
  });
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, "0.0.0.0", () =>
  console.log(`DESICIA listening on 0.0.0.0:${port}`),
);
const shutdown = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
