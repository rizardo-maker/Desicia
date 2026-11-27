import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { browserRuntime } from "./browser-runtime.mjs";
const base = process.env.AUDIT_URL || "http://localhost:3000";
const out = "reports/design";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({
  ...(await browserRuntime()),
  headless: true,
});
let expectedHttpError = false;
const results = {
  expectedHttpErrors: [],
  date: new Date().toISOString(),
  base,
  viewports: [],
  interactions: [],
  errors: [],
  performance: {},
};
const check = async (name, fn) => {
  try {
    await fn();
    results.interactions.push({ name, pass: true });
    console.log("PASS", name);
  } catch (e) {
    results.interactions.push({ name, pass: false, error: String(e) });
    console.log("FAIL", name, String(e));
  }
};
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => results.errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error")
      (expectedHttpError ? results.expectedHttpErrors : results.errors).push(
        m.text(),
      );
  });
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__vitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (!e.hadRecentInput) window.__vitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(1300);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => {
      const rect = (e) => {
        const r = e.getBoundingClientRect();
        return {
          left: r.left,
          right: innerWidth - r.right,
          top: r.top,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      };
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        wrappers: [...document.querySelectorAll(".wrap")].map(rect),
        headings: [
          ...document.querySelectorAll("h1,.chapter-copy h2,.closing h2"),
        ].map((e) => ({
          text: e.textContent,
          ...rect(e),
          lines: Math.round(
            e.getBoundingClientRect().height /
              parseFloat(getComputedStyle(e).lineHeight),
          ),
        })),
        chapters: [...document.querySelectorAll("main>section")].map((e) => ({
          id: e.id,
          height: e.offsetHeight,
        })),
        heroVisible:
          document.querySelector("h1").getBoundingClientRect().bottom <
          innerHeight,
        ctaVisible:
          document
            .querySelector(".hero-actions .button")
            .getBoundingClientRect().bottom < innerHeight,
        scene: window.__DESICIA_SCENE__,
        vitals: window.__vitals,
      };
    });
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const record = {
      width,
      height,
      ...metrics,
      axeViolations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    };
    results.viewports.push(record);
    console.log(
      "VIEWPORT",
      width,
      JSON.stringify({
        overflow: metrics.overflow,
        headings: metrics.headings.map((h) => h.lines),
        a11y: record.axeViolations.map((v) => [v.id, v.nodes.length]),
      }),
    );
    await page.screenshot({ path: `${out}/${width}-hero.png` });
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true });
    for (const id of [
      "intelligence",
      "automation",
      "transformation",
      "contact",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `${out}/${width}-${id}.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.waitForTimeout(500);
  await check("analytics tabs update dataset and forecast switch", async () => {
    await page.getByRole("tab", { name: "Operations", exact: true }).click();
    assert(
      await page
        .locator(".metric-value")
        .textContent()
        .then((t) => t.includes("8,642")),
    );
    await page.getByRole("tab", { name: "Supply chain", exact: true }).click();
    assert(
      await page
        .locator(".metric-value")
        .textContent()
        .then((t) => t.includes("96.2%")),
    );
    const toggle = page.getByRole("switch", { name: "Show forecast" });
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-checked"), "false");
    await toggle.click();
    await page.getByRole("tab", { name: "Revenue", exact: true }).click();
  });
  await check("workflow inspector and human approval checkpoint", async () => {
    await page.getByRole("button", { name: /Intake/ }).click();
    assert(
      await page
        .locator(".inspector h3")
        .textContent()
        .then((t) => t.includes("Read")),
    );
    await page
      .getByRole("button", { name: "Run simulation", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Approve sample" })
      .waitFor({ state: "visible", timeout: 10000 });
    await page.getByRole("button", { name: "Approve sample" }).click();
    await page
      .getByRole("button", { name: "Run again" })
      .waitFor({ state: "visible", timeout: 10000 });
    assert(
      await page
        .locator(".execution-log")
        .textContent()
        .then((t) => t.includes("complete")),
    );
  });
  await check(
    "capacity estimator recalculates using its published formula",
    async () => {
      const slider = page.getByLabel("People in the workflow");
      await slider.fill("50");
      await slider.dispatchEvent("input");
      assert(
        await page
          .locator(".estimate-output strong")
          .textContent()
          .then((t) => t.includes("345,600")),
      );
      await slider.fill("25");
      await slider.dispatchEvent("input");
    },
  );
  await check("every chapter anchor and rail stays functional", async () => {
    for (const id of [
      "intelligence",
      "automation",
      "transformation",
      "contact",
      "signal",
    ]) {
      await page.locator(`.chapter-rail a[href="#${id}"]`).click();
      await page.waitForTimeout(650);
      assert.equal(new URL(page.url()).hash, `#${id}`);
    }
  });
  await check("direct chapter URL restores the intended location", async () => {
    await page.goto(base + "/#transformation");
    await page.waitForFunction(
      () =>
        Math.abs(
          document.getElementById("transformation").getBoundingClientRect().top,
        ) < 2,
    );
    assert.equal(new URL(page.url()).hash, "#transformation");
  });
  await check("motion pause stops rendering, resume continues", async () => {
    await page.goto(base);
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Pause background motion" }).click();
    await page.waitForTimeout(900);
    const first = await page.evaluate(() => window.__DESICIA_SCENE__?.frames);
    await page.waitForTimeout(400);
    assert.equal(
      await page.evaluate(() => window.__DESICIA_SCENE__?.frames),
      first,
    );
    await page
      .getByRole("button", { name: "Resume background motion" })
      .click();
    await page.waitForTimeout(300);
    assert(
      (await page.evaluate(() => window.__DESICIA_SCENE__?.frames)) > first,
    );
  });
  await check("audit dialog validation, focus trap and Escape", async () => {
    await page.locator(".hero .primary").click();
    await page.getByRole("dialog").filter({ visible: true }).waitFor();
    assert(
      (await page
        .locator('dialog[open] input[name="name"]')
        .evaluate((e) => document.activeElement === e)) ||
        (await page
          .locator("dialog[open] .dialog-close")
          .evaluate((e) => document.activeElement === e)),
    );
    await page.locator("dialog[open] .form-submit").click();
    assert.equal(
      await page
        .locator('dialog[open] input[name="name"]')
        .evaluate((e) => e.validity.valid),
      false,
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
  });
  const fill = async () => {
    await page.locator(".hero .primary").click();
    await page.locator('dialog[open] input[name="name"]').fill("Browser Audit");
    await page
      .locator('dialog[open] input[name="email"]')
      .fill("browser@example.test");
    await page
      .locator('dialog[open] input[name="company"]')
      .fill("Test Company");
    await page.locator('dialog[open] input[name="consent"]').check();
  };
  await check(
    "audit API saves a real request and displays receipt",
    async () => {
      await fill();
      await page.locator("dialog[open] .form-submit").click();
      await page.getByText("REQUEST SAVED", { exact: true }).waitFor();
      assert.match(await page.locator(".receipt").textContent(), /REFERENCE/);
      await page.screenshot({ path: `${out}/request-receipt.png` });
      await page.keyboard.press("Escape");
    },
  );
  await check("API failure is recoverable, without fake success", async () => {
    expectedHttpError = true;
    await page.route("**/api/audit-requests", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Test storage outage. Please try again.",
        }),
      }),
    );
    await fill();
    await page.locator("dialog[open] .form-submit").click();
    await page.getByRole("alert").waitFor();
    assert(
      await page
        .getByRole("alert")
        .textContent()
        .then((t) => t.includes("outage")),
    );
    await page.keyboard.press("Escape");
    await page.unroute("**/api/audit-requests");
    await page.waitForTimeout(100);
    expectedHttpError = false;
  });
  await check("privacy notice opens and closes", async () => {
    await page.getByRole("button", { name: "Data use & privacy" }).click();
    await page.getByRole("heading", { name: "Your request data." }).waitFor();
    await page.getByRole("button", { name: "Close notice" }).click();
  });
  await check(
    "enterprise diligence disclosures expand with real content",
    async () => {
      await page
        .locator("summary")
        .filter({ hasText: "Security assurance" })
        .click();
      assert(
        await page
          .locator("details[open]")
          .textContent()
          .then((t) => t.includes("No SOC 2 certification")),
      );
      await page
        .locator("summary")
        .filter({ hasText: "Security assurance" })
        .click();
    },
  );
  await check(
    "keyboard focus is never hidden by the fixed header",
    async () => {
      await page.goto(base);
      await page.locator(".skip-link").focus();
      for (let i = 0; i < 38; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(90);
        const bad = await page.evaluate(() => {
          const e = document.activeElement;
          if (!e || e === document.body || e.matches(".skip-link"))
            return false;
          const r = e.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return true;
          const header = document
            .querySelector("header")
            .getBoundingClientRect();
          return (
            !e.closest("header") &&
            !e.closest(".chapter-rail") &&
            !e.closest(".motion-control") &&
            (r.bottom < 0 ||
              r.top >= innerHeight ||
              (r.top < header.bottom && r.bottom > 0))
          );
        });
        assert(!bad, `hidden focus at tab ${i}`);
      }
    },
  );
  await check(
    "mobile menu, navigation and no horizontal overflow",
    async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(base);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.locator('#mobile-links a[href="#automation"]').click();
      assert.equal(await page.locator("#mobile-links").count(), 0);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
        0,
      );
    },
  );
  await check(
    "reduced-motion fallback remains complete with no WebGL engine",
    async () => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base);
      await page.waitForTimeout(500);
      assert.equal(await page.locator(".world.is-ready").count(), 0);
      assert(await page.locator("h1").isVisible());
      assert(await page.locator(".lattice-fallback").isVisible());
      await page.screenshot({ path: `${out}/reduced-motion.png` });
    },
  );
  await check(
    "forced no-GPU path preserves the visual and controls",
    async () => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(base + "/?nogl");
      assert.equal(await page.locator(".world.is-ready").count(), 0);
      assert(await page.locator(".hero .primary").isVisible());
    },
  );
  await check("320px stress test has no horizontal overflow", async () => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(base);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      0,
    );
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  await page.waitForTimeout(8500);
  results.performance = await page.evaluate(() => ({
    scene: window.__DESICIA_SCENE__,
    vitals: window.__vitals,
    resources: performance.getEntriesByType("resource").map((e) => ({
      name: e.name.split("/").at(-1),
      transfer: e.transferSize,
    })),
  }));
  await context.close();
} finally {
  await browser.close();
  await fs.writeFile(
    `${out}/browser-audit.json`,
    JSON.stringify(results, null, 2),
  );
}
const failed = results.interactions.filter((x) => !x.pass);
console.log(
  `DONE ${results.interactions.length - failed.length}/${results.interactions.length} interactions; ${results.errors.length} console errors`,
);
if (
  failed.length ||
  results.errors.length ||
  results.viewports.some((v) => v.overflow !== 0 || v.axeViolations.length)
)
  process.exitCode = 1;
