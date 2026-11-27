import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { createApi } from "../server/app";
import { capacityModel, leadSchema } from "../shared/validation";
import type { AddressInfo } from "node:net";
const valid = {
  name: "Test Reviewer",
  email: "reviewer@example.test",
  company: "Test Company",
  priority: "AI analytics",
  context: "A test only.",
  consent: true,
  website: "",
};
test("capacity model is transparent and bounded", () => {
  assert.deepEqual(capacityModel(25, 8, 45, 40), {
    weeklyHours: 80,
    annualValue: 172800,
  });
  assert.equal(capacityModel(0, 8, 45, 40).annualValue, 0);
  assert.equal(capacityModel(-1, 8, 45, 40).annualValue, 0);
  assert.equal(capacityModel(10, 10, 100, 120).weeklyHours, 100);
});
test("lead schema rejects missing consent, invalid email and honeypot", () => {
  assert(leadSchema.safeParse(valid).success);
  for (const patch of [
    { consent: false },
    { email: "not-email" },
    { website: "bot" },
    { priority: "Other" },
    { context: "x".repeat(2001) },
  ])
    assert(!leadSchema.safeParse({ ...valid, ...patch }).success);
});
test("API persists a validated lead and protects data boundaries", async () => {
  const db = new DatabaseSync(":memory:");
  const app = createApi(db),
    server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const root = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  try {
    const health = await fetch(`${root}/api/health`);
    assert.equal(health.status, 200);
    const post = (body: unknown, headers: Record<string, string> = {}) =>
      fetch(`${root}/api/audit-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
    const r = await post(valid);
    assert.equal(r.status, 201);
    const saved = await r.json();
    assert.match(saved.reference, /^[0-9a-f-]{36}$/);
    assert.equal(saved.delivery, "local-storage");
    assert.equal(
      (
        db.prepare("SELECT COUNT(*) AS n FROM audit_requests").get() as {
          n: number;
        }
      ).n,
      1,
    );
    assert.equal((await post({ ...valid, consent: false })).status, 400);
    assert.equal(
      (await post(valid, { Origin: "https://untrusted.test" })).status,
      403,
    );
    assert.equal((await fetch(`${root}/api/audit-requests`)).status, 404);
    assert.equal((await post({ ...valid, website: "spam.test" })).status, 400);
    const badJson = await fetch(`${root}/api/audit-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{broken",
    });
    assert.equal(badJson.status, 400);
    const tooLarge = await post({ ...valid, context: "x".repeat(15000) });
    assert.equal(tooLarge.status, 413);
    for (let i = 0; i < 6; i++) await post(valid);
    assert.equal((await post(valid)).status, 429);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    db.close();
  }
});
