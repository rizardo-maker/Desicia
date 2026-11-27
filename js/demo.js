/* DECISIA demo workspace: three click-driven views, and the continuous motion around them.
   - Data pipeline: "Run pipeline" resets the steps and plays sources -> ingest -> validate -> features -> forecast
     (about 2 s), then hands the connectors back to the live stream. Reduced motion: the states change at once.
   - Automation run: Approve / Reject answer the waiting step; "Replay run" puts it back to waiting.
   - Value estimate: the visitor's four inputs drive one formula, updated on input.
   - Live: the console and the workspace get .is-live while on screen, so their CSS loops (the data stream on the
     connectors, the console's spinner) run without end there and stop off screen.
   - Phone: the kit holds the console still under 640px; DECISIA's console keeps telling its story there too. */
import { loop } from '../assets/ui/ui.js';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, reduced() ? 0 : ms));
const fmt = n => Math.round(n).toLocaleString('en-US');
const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

function flow(el) {
  if (!el || reduced()) return;
  el.classList.remove('is-flow'); void el.offsetWidth; el.classList.add('is-flow');
}

function pipeline(root) {
  const btn = root.querySelector('[data-pipe-run]');
  const status = root.querySelector('[data-pipe-status]');
  const steps = [...root.querySelectorAll('.step')];
  const out = root.querySelector('[data-pipe-out]');
  const srcPipes = [...root.querySelectorAll('.src__pipe')];
  let running = false;
  btn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    root.classList.add('is-running');
    btn.disabled = true;
    status.textContent = 'Running · reading 4 sources';
    steps.forEach(s => s.classList.remove('is-done', 'is-run'));
    out.classList.add('is-pending');
    await wait(120);
    srcPipes.forEach(flow);
    await wait(420);
    const notes = ['Ingesting 41.2M rows', 'Running 212 checks', 'Building 64 features', 'Forecasting 8 weeks'];
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.add('is-run');
      status.textContent = `Running · ${notes[i]}`;
      await wait(380);
      steps[i].classList.remove('is-run');
      steps[i].classList.add('is-done');
      flow(steps[i].querySelector('.step__pipe'));
      await wait(140);
    }
    out.classList.remove('is-pending');
    status.textContent = `Last run finished ${clock()} · 212 of 212 checks passed`;
    await wait(520);
    root.querySelectorAll('.is-flow').forEach(el => el.classList.remove('is-flow'));
    root.classList.remove('is-running');
    btn.disabled = false;
    running = false;
  });
}

function automation(root) {
  const ask = root.querySelector('[data-auto-ask]');
  const after = root.querySelector('[data-auto-after]');
  const r1 = root.querySelector('[data-auto-r1]');
  const r2 = root.querySelector('[data-auto-r2]');
  const status = root.querySelector('[data-auto-status]');
  const approve = root.querySelector('[data-auto-approve]');
  const reject = root.querySelector('[data-auto-reject]');
  const replay = root.querySelector('[data-auto-replay]');
  const q = ask.querySelector('.ask__q');
  const why = ask.querySelector('.ask__why');
  const btns = ask.querySelector('.ask__btns');
  const original = { q: q.textContent, why: why.textContent };

  const answer = ok => {
    const t = clock();
    ask.classList.add('is-answered');
    q.textContent = ok ? `Approved by you at ${t}` : `Rejected by you at ${t}`;
    why.textContent = ok ? 'The agent carries out the two actions below.' : 'Nothing was sent. The invoice goes to the AP queue for a person.';
    btns.hidden = true;
    r1.textContent = ok ? 'Payment held in SAP' : 'Invoice moved to the AP review queue';
    r2.textContent = ok ? 'Query sent to the supplier · logged to the audit trail' : 'Supplier not contacted · logged to the audit trail';
    after.hidden = false;
    status.textContent = ok ? `Run 2,482 finished ${t} · 2 actions, 1 approval` : `Run 2,482 closed ${t} · rejected, no actions`;
    replay.focus({ preventScroll: true });
  };
  approve.addEventListener('click', () => answer(true));
  reject.addEventListener('click', () => answer(false));
  replay.addEventListener('click', () => {
    ask.classList.remove('is-answered');
    q.textContent = original.q; why.textContent = original.why;
    btns.hidden = false; after.hidden = true;
    status.textContent = 'Run 2,482 is waiting for your approval';
    approve.focus({ preventScroll: true });
  });
}

function value(root) {
  const v = k => +root.querySelector(`[data-v="${k}"]`).value;
  const set = (k, t) => root.querySelectorAll(`[data-res="${k}"]`).forEach(el => { el.textContent = t; });
  const out = (k, t) => { const el = root.querySelector(`[data-out="${k}"]`); if (el) el.textContent = t; };
  const bar = root.querySelector('[data-res-bar]');
  const update = () => {
    const people = v('people'), hours = v('hours'), cost = v('cost'), share = v('share') / 100;
    out('people', fmt(people)); out('hours', fmt(hours)); out('cost', `$${fmt(cost)}`); out('share', `${Math.round(share * 100)}%`);
    const weekly = people * hours;
    const returned = Math.round(weekly * 46 * share); // whole hours first, so hours × cost reads true on screen
    set('hours', fmt(returned));
    set('value', `$${fmt(returned * cost)}`);
    set('today', `${fmt(weekly)} h a week`);
    set('after', `${fmt(weekly * (1 - share))} h a week`);
    if (bar) bar.style.setProperty('--w', String(1 - share));
  };
  root.querySelectorAll('input[type="range"]').forEach(i => i.addEventListener('input', update));
  update();
}

const p = document.querySelector('[data-pipe]'); if (p) pipeline(p);
const a = document.querySelector('[data-auto]'); if (a) automation(a);
const val = document.querySelector('[data-value]'); if (val) value(val);

/* ------------------------------------------------ continuous motion */
// .is-live while on screen: the CSS loops run only then, and stop for reduced motion or a hidden tab
function live() {
  const els = [...document.querySelectorAll('.dw, .dwin')];
  if (!els.length || reduced() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting)),
    { rootMargin: '80px 0px' });
  els.forEach(el => io.observe(el));
  // the workspace's flow has its own pause button (it moves for more than 5 s)
  const btn = document.querySelector('[data-flow-pause]'), win = btn && btn.closest('.dwin');
  if (!btn || !win) return;
  const PAUSE = btn.innerHTML;
  const PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.25 3.7v8.6c0 .62.68 1 1.2.66l6.5-4.3c.47-.31.47-1 0-1.32l-6.5-4.3c-.52-.34-1.2.04-1.2.66Z"/></svg>';
  btn.addEventListener('click', () => {
    const paused = win.classList.toggle('is-paused');
    const label = paused ? 'Play the data flow' : 'Pause the data flow';
    btn.innerHTML = paused ? PLAY : PAUSE;
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', label); btn.title = label;
  });
}
live();

// the hero console on a phone: the same story as layout.js plays on wider screens (steps 900 ms apart, a
// short hold on the finished thread, then again), on the kit's loop so it pauses off screen and has its pause button
function phoneConsole() {
  const box = document.querySelector('.dw__thread[data-ly-steps]');
  if (!box || innerWidth >= 640 || reduced()) return;
  const items = [...box.querySelectorAll('[data-step]')].filter(el => getComputedStyle(el).display !== 'none');
  if (!items.length) return;
  const every = parseInt(box.dataset.lySteps, 10) || 700;
  const set = n => items.forEach((s, k) => s.classList.toggle('is-off', k >= n));
  const done = () => set(items.length);
  loop(box, async api => {
    await api.wait(1800);
    set(0);
    for (let n = 1; n <= items.length; n++) { await api.wait(n === 1 ? 380 : every); set(n); }
  }, { still: done, rest: 1200 });
}
phoneConsole();

/* ------------------------------------------------ page chrome (not the demo, but small enough to live here) */
// 1. the nav marks the section in view (aria-current="location"), no animation beyond the kit's underline
function navCurrent() {
  const links = new Map([...document.querySelectorAll('.nav__links > .nav__item > .nav__link')]
    .map(a => [a.getAttribute('href'), a]).filter(([h]) => h && h.startsWith('#')));
  const sections = [...links.keys()].map(h => document.querySelector(h)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const seen = new Map();
  const io = new IntersectionObserver(es => {
    es.forEach(e => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
    let best = null, ratio = 0;
    seen.forEach((r, el) => { if (r > ratio) { ratio = r; best = el; } });
    links.forEach(a => a.removeAttribute('aria-current'));
    if (best && ratio > 0) links.get('#' + best.id)?.setAttribute('aria-current', 'location');
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.01, 0.5, 1] });
  sections.forEach(s => io.observe(s));
}

// 2. menu entries for one demo view open that tab, then bring the demo into view
function openTabLinks() {
  const open = id => {
    const tab = document.getElementById(id);
    if (!tab || tab.getAttribute('role') !== 'tab') return false;
    tab.click();
    document.getElementById('demo')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    tab.focus({ preventScroll: true });
    return true;
  };
  document.querySelectorAll('a[data-open-tab]').forEach(a => a.addEventListener('click', ev => {
    if (open(a.getAttribute('href').slice(1))) { ev.preventDefault(); history.replaceState(null, '', '#demo'); }
  }));
  if (/^#tab-/.test(location.hash)) open(location.hash.slice(1));
}

navCurrent(); openTabLinks();

/* The hero console stays whole inside the first screen. CSS tightens the hero's spacing; where a screen is still too
   short, the console is zoomed down just enough to end above the hero's bottom padding (never under 0.75; past that
   the hero simply grows and the console stays whole below the fold). Re-measured on resize and once fonts settle. */
function fitHeroConsole() {
  const hero = document.querySelector('main > .hero--centred');
  const win = hero && hero.querySelector('.hero__window');
  const piece = win && win.querySelector('.ly-piece');
  if (!piece) return;
  let frame = 0;
  const fit = () => {
    frame = 0;
    piece.style.removeProperty('--fit');
    const hs = getComputedStyle(hero), ws = getComputedStyle(win);
    const screen = parseFloat(hs.minHeight) || innerHeight;   // 100svh, resolved to px
    const limit = screen - parseFloat(hs.paddingBottom) - parseFloat(ws.paddingBottom);
    const top = piece.getBoundingClientRect().top - hero.getBoundingClientRect().top;
    const s = Math.max(0.75, Math.min(1, (limit - top) / piece.offsetHeight));
    if (s < 0.999) piece.style.setProperty('--fit', s.toFixed(3));
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(fit); };
  fit();
  addEventListener('resize', queue);
  if (document.fonts) document.fonts.ready.then(queue);
}
fitHeroConsole();
