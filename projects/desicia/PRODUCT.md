# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: plain static HTML/CSS/JS built on the taste-skill kit (`site/assets/`), served by a zero-framework Node
server (`site/server.mjs`) that also handles `POST /api/contact`. Chosen so the site deploys anywhere Node 18+ runs
and the static part works from any CDN.

## Users

- Deciders: COO, CFO, CIO / CDO, VP Operations at enterprise and high-growth companies, worldwide (US, EU and
  beyond), reading in English. Situation: an AI pilot or dashboard exists and nothing in the business changed;
  they are comparing a big consultancy, a platform vendor and specialist firms.
- Influencers: heads of data, finance operations, sales operations, engineering leads who will live with the system.

## Product Purpose

DESICIA sells three services: AI data analytics (raw enterprise data → real-time decisions, forecasts, executive
clarity), AI automations (reliable workflow orchestration across ops, sales, finance and engineering) and end-to-end
AI transformation (modernising legacy processes, systems and teams). The site's success = booked calls from
qualified enterprise buyers.

## Positioning

One team takes one business decision from raw data to an automated, measured action in production, inside the
client's cloud, under the client's ownership. (Derived from competitor research; proposed to the client, see
`research/COMPETITORS.md`.)

## Operating Context

Buyers evaluate on a laptop between meetings and forward the link to a CTO or security lead. Their data lives in
Snowflake / Databricks / Microsoft Fabric / SAP / Dynamics 365 / Salesforce / ServiceNow; approvals and audit trails are part of how they work.

## Capabilities and Constraints

- Main action: Book a call. Pricing: not shown, scoped after the call.
- Remote-first, no city shown. Contact requests go to an email address the client has not supplied yet
  (`CONTACT_TO`), SMTP-ready.
- Proposed commitments on the page (client must confirm): 12 weeks to a first system in production, 2-week
  diagnosis, demo every second week, fixed price per phase, client owns code/models/prompts, exit after any phase,
  work inside the client's cloud, no training on client data, named approvers for consequential actions, a 45-minute
  first call, a reply within one working day.

## Brand Commitments

- Name only: DESICIA, in capitals. Colours and fonts delegated.
- Banned: "revolutionize", "unlock the power of AI", "synergy"; purple-blue gradients, glowing AI brains, cards in
  cards; stock photos and placeholder boxes.

## Evidence on Hand

None: no logos, no figures, no testimonials, no case studies, no certifications. Do not fabricate any. Demo
figures inside UI mocks are demo-workspace data; the value estimate uses the visitor's own inputs. Hidden
`<template data-slot>` blocks hold places for logos and case studies later.

## Product Principles

1. Show the mechanism, because there is no proof yet: a demo the buyer can operate beats a claim.
2. Terms are trust: say in writing who owns what and how to leave.
3. One decision at a time: every example is a concrete decision with a number, a system and an approver.
4. Plain words for executives: name the system, the step and the result.

## Accessibility & Inclusion

WCAG 2.2 AA: keyboard operable demo and tabs, visible focus, 4.5:1 body contrast, full prefers-reduced-motion
support, no hover-only information, zero layout shift.
