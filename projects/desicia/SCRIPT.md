# Website script — DESICIA

> Phase 2. Written before any design or code. Every word below ships as written (the page is built from this file).
> Rules applied: taste `copy.md`, `copy-voice.md`, `copy-tells.md`, `sections.md`; open-design `copywriting`
> (clarity over cleverness, benefit + mechanism, one CTA) and `marketing-psychology` (loss aversion on the stalled
> pilot, risk reversal through written terms and exit-after-any-phase, commitment ladder: demo → call).

## Fact sheet
| Field | Content | Source |
|---|---|---|
| What it is | An AI engineering firm: data analytics, automation and the process change around them | prompt |
| For whom | COO, CFO, CIO / CDO at enterprise and high-growth companies, worldwide | prompt |
| Not for | Teams wanting slideware-only strategy, or a one-off chatbot | derived |
| Instead today | Big consultancy (3–18 months, advisory), platform vendor (tools, no outcome), in-house pilots that stall | research |
| True difference | One team takes one decision from raw data to an automated, measured action in production | research gap, client to confirm |
| Numbers | 12 weeks to a first system in production; demo every second week; 2-week diagnosis | proposed terms, `data-assumed`, client to confirm |
| A limit | We are new: no case studies yet | brief |
| An enemy | The stalled pilot: the model or dashboard that never changes a decision | research |
| The offer | A call; scope and price follow in writing | brief |

## Voice card
```
Voice: technical and dry, with proof (copy-registers 2), tuned for executives
Pairs: exact, not cold; sure, not loud
Person: "you" for what the buyer gets, "we" for the work, DESICIA as the subject of claims
Sentences: 8 to 18 words; one longer one per section where it explains
Humour: none, except one dry line in the form microcopy
House words: decision, system, production, your cloud, approve, measure (same word every time)
Never: transform/unlock/revolutionize/synergy/seamless/robust/powerful, virtue words, coined concepts, invented figures
```

## Narrative arc
What is this → why projects like it fail → what DESICIA builds → see it work → is it for my industry → how it runs →
the questions I would ask → is it safe and fair → book a call.

## Sitemap (screens at 1440 × 900)
| # | id | Section | Idea | Picture | Screens |
|---|---|---|---|---|---|
| 1 | top | Hero | What it is, for whom, one hard fact | Ops console window: signal → forecast → proposed action → approval (timed loop) on a still mesh ground | 1 |
| 2 | thesis | Problem / thesis | Pilots stall between insight and action | Bowtie diagram: Snowflake, SAP, Salesforce → forecast model → Slack decision, SAP order, CFO report | 1 |
| 3 | services | The 3 pillars | Analytics, automation, transformation | Three open cards, each with its own UI: forecast chart, automation run log, migration board | 1 |
| 4 | demo | Live capability showcase | Operate a working system | Dark band; tabs: Data pipeline · Automation run · Value estimate (calculator) | 1 |
| 5 | industries | Use cases | Where we build first, by industry | Rows table + hub diagram of systems we connect | 1 |
| 6 | method | How DESICIA delivers | 12 weeks to production, then operate | Gantt timeline across the wrap + four steps | 1 |
| 7 | questions | FAQ (calm) | The six questions buyers ask | none (FAQ) | 1 |
| 8 | security | Security, ownership, terms (trust) | What you get in writing | Commitments list + audit log window | 1 |
| 9 | book | Consultation | Book a call | Form + what happens next | 1 |
| 10 | contact | Footer close | Book a call | Close-type big button, links, legal | 1 |

## Copy

### Head
- Title: `DESICIA: Enterprise AI, data analytics and automation`
- Description: `DESICIA builds forecasting, automation and the process change around them, inside your cloud, with a first system in production in 12 weeks.`

### Nav
Wordmark **DESICIA** · Services · Demo · Industries · Method · Security · [Book a call]
Services panel: Data analytics — "Forecasts and answers from your data" · Automation — "Agents that act inside your systems" · Transformation — "New processes your teams can run"

### 1 · Hero
- Pill (link to #method): `First system live in 12 weeks` · `See the plan`
- H1: **Enterprise AI, from data to action**
- Sub-line: `DESICIA builds the forecasts, the automations and the process changes that turn your company data into decisions people approve and systems carry out.`
- Buttons: [Book a call] [See the live demo]
- Window (aria): "DESICIA console flagging a stockout risk, proposing a purchase order and waiting for approval"
  - Bar: `Operations console` · `Rotterdam DC` · `SAP · Snowflake`
  - Signals list: `Stockout risk · SKU 4471` 09:12 · `Invoice mismatch · 3 suppliers` 08:57 · `Churn risk · 12 accounts` 08:31
  - Thread: Signal `SKU 4471 will run out at Rotterdam DC in 9 days.` → tool line `Read 26 weeks of sales, 14 open orders and supplier lead times` → proposal `Raise PO 88213: 1,200 units, €18,420, arrives in 6 days. Stock stays above 2 weeks of cover.` → actions `Approve` `Edit`

### 2 · Thesis (id thesis)
- H2: **Where AI and analytics projects stall**
- Lead: `A model gets built and a dashboard ships, yet no decision changes. The value sits in the step after the insight.`
- List (the three gaps):
  - `No owner for the decision` — `Nobody agreed who acts on the forecast, or by when.`
  - `No path into the systems` — `The output stops at a chart and never reaches SAP, Salesforce or the ticket queue.`
  - `No measure of success` — `Nobody wrote down the number that would prove it worked.`
- Closing line: `DESICIA builds all four steps as one system: data, decision, action, measurement.`
- Diagram alt: "Sales, stock and customer data flow from Snowflake, SAP and Salesforce into one forecast, which posts a decision to Slack, raises an order in SAP and updates the CFO report."

### 3 · Services (id services)
- H2: **What DESICIA builds.** <muted>One team for all three, so nothing is lost between them.</muted>
- Card 1 — H3 `Forecasts demand, risk and cash` — `Forecasting on your warehouse, with the drivers behind each number shown to the people who decide.` UI: weekly demand chart, actual vs forecast with range, "Drivers: promotions, lead time, weather".
- Card 2 — H3 `Automates work across systems` — `Agents read, decide within limits you set and write back to SAP, Dynamics 365, Salesforce or ServiceNow.` UI: run log with five steps and an approval.
- Card 3 — H3 `Rebuilds processes around them` — `We redesign the process, retire the manual steps and train the team that runs it after us.` UI: migration board: Legacy / Parallel run / Live.

### 4 · Demo (id demo, dark band, iris-opens)
- H2: **A working system you can operate**
- Lead: `One demo workspace in three views. Run the pipeline, approve the automation, then enter your own numbers.`
- Tabs: `Data pipeline` · `Automation run` · `Value estimate`
- Pipeline view: sources Snowflake (orders, 41.2M rows), SAP S/4HANA (stock, 18 plants), Salesforce (pipeline, 6,140 deals), Kafka (events, 2.3k/s) → steps Ingest · Validate · Features · Forecast → output panel "Forecast ready · Next 8 weeks". Button: `Run pipeline`. Status lines: `Freshness 4 min`, `Checks passed 212 of 212`.
- Automation view: Trigger `Invoice INV-30917 does not match PO 77120 (€2,310 over)` → steps (read contract, compare 3 quotes, draft supplier email) → approval card `Hold payment and send the query to the supplier?` [Approve] [Reject] → result line after approve: `Payment held. Query sent to the supplier. Logged to audit trail 14:02.` Button: `Replay run`.
- Value view (calculator): sliders `People on the process` (12), `Hours each spends on it per week` (9), `Loaded cost per hour` ($68), `Share automated` (60%). Output: `Hours returned per year` and `Value per year`; formula shown: `people × hours × 46 weeks × share × cost`. Note line: `Your inputs, our formula. We test the real figure in the first two weeks.`

### 5 · Industries (id industries)
- H2: **Where we build first**
- Lead: `Industries with many decisions a day and the data to back them.`
- Rows (industry · first system we would build):
  - Financial services · `Credit-risk early warning, reconciliation, KYC review queues`
  - Retail and consumer goods · `Demand forecasting, replenishment, markdown pricing`
  - Manufacturing · `Maintenance prediction, quality checks, supplier risk`
  - Logistics · `Route and capacity planning, exception handling, invoice audit`
  - Healthcare operations · `Staff scheduling, claims triage, supply levels`
  - Software companies · `Churn prediction, renewal forecasts, support routing`
- Diagram (hub, card title in text): `Connects to the systems you run` — Snowflake, Databricks, Microsoft Fabric, SAP, Microsoft Dynamics 365, Salesforce, Oracle, PostgreSQL, Slack, Microsoft Teams (labels: Fabric, Dynamics 365, Teams).

### 6 · Method (id method)
- H2: **How an engagement runs**
- Lead: `The same engineers from the first workshop to production. You see working software every second week.`
- Timeline (weeks 1–12 + after): Diagnose (1–2) · Build (3–8) · Parallel run (9–12) · Operate (after).
- Steps:
  1. `Diagnose` · Weeks 1–2 · `We pick one decision worth money, write down the metric and audit the data behind it.`
  2. `Build` · Weeks 3–8 · `Engineers build in your cloud account. Demo every second Friday.`
  3. `Parallel run` · Weeks 9–12 · `The system runs beside the old process, then takes over with your sign-off.`
  4. `Operate` · After week 12 · `We run and improve it on a monthly plan, or hand it to your team with docs and training.`

### 7 · Questions (id questions, FAQ, all open)
- H2: **Questions buyers ask**
- `Our data is messy. Can we start in week 1?` — `Yes. Weeks 1 and 2 include a data audit, and the first system uses only the sources that pass it.`
- `You are new. Where are the case studies?` — `We are new, so we have none to show yet. You get a written diagnosis in two weeks and can stop there.`
- `Do you replace our data team?` — `No. We build with them, and they own the system at handover.`
- `Which models do you use?` — `The one that fits the job and your contracts: open models in your cloud, or Azure OpenAI, Anthropic or Google through your accounts.`
- `How is it priced?` — `A fixed price per phase, agreed in writing after the first call. No hourly billing.`
- `Where are you based?` — `Remote-first, working with teams in North America, Europe and Asia.`

### 8 · Security (id security)
- H2: **Security, ownership and terms**
- Lead: `What we sign before work starts.`
- Rows:
  - `Your cloud` — `Everything runs in your AWS, Azure or Google Cloud account. Data does not leave it.`
  - `No training on your data` — `Your data is never used to train models, ours or a vendor's.`
  - `People approve risk` — `Payments, orders and customer messages above limits you set wait for a named approver.`
  - `Every action logged` — `Each read, decision and write is in an audit log your team can query.`
  - `You own the work` — `Code, models, prompts and documentation are yours from day one.`
  - `Exit after any phase` — `Stop at the end of any phase and keep everything built so far.`
- Window: `Audit log` — rows: 14:02 `Payment hold · INV-30917` `Approved · J. Moreau, AP lead` · 13:48 `PO 88213 raised · SAP` `Approved · Ops manager` · 13:40 `Forecast refresh · 8 weeks` `Automatic` · 13:12 `Read · Snowflake ORDERS` `Service role` · 12:55 `Customer email · 12 accounts` `Waiting for approval`.
- (Hidden slots: `<template data-slot="logos">`, `<template data-slot="case-studies">` for later proof.)

### 9 · Book (id book)
- H2: **Book a call**
- Lead: `45 minutes with an engineer who would build your system. Bring one decision you want to improve.`
- What happens next (list): `1. We reply within one working day to fix a time.` `2. On the call we pick the decision and check the data behind it.` `3. Within a week you get a written scope, price and success metric.`
- Form: Name · Work email · Company · Area (Data analytics / Automation / Transformation / Not sure yet) · What should change (textarea)
  - Errors: `Write your name.` · `Write a work email address with an @.` · `Write your company's name.` · `Pick the area closest to your problem.` · `Write a sentence or two about the decision you want to improve.`
  - Button: [Book a call]
  - Sending: `Sending your request`
  - Sent: `Your call request is in. We reply within one working day to fix a time.`
  - Failed: `That did not go through. Your text is still here; try again, or check your connection.`
  - Under form: `We reply within one working day.` (= the one response-time promise, worded the same everywhere)

### 10 · Footer close (id contact)
- H2: **Book a call with DESICIA**
- Line: `Bring one decision. Leave with a written scope within a week.`
- Big button: [Book a call] → #book
- Lede: `AI analytics, automation and process change for enterprise operations. Remote-first.`
- Columns: Services (Data analytics, Automation, Transformation) · Company (Method, Security, Questions) · Contact (Book a call → #book, Demo)
- Legal: `© 2026 DESICIA` · Privacy · Terms
