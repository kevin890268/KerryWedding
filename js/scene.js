/* ============================================================
   scene.js — Act I, in order:
   the envelope glides in from the right → settles in the middle →
   the letter opener waits beneath the bear wax seal (and nudges if
   nobody moves) → push it up and the seal comes off in one piece →
   the flap opens upwards → the invitation slides out on its side,
   turns upright, and grows to fill the screen → Act II takes over.
   ============================================================ */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const el = {
  body:      document.body,
  scene:     $('#scene'),
  svg:       $('#flightSvg'),
  path:      $('#flightPath'),
  fly:       $('#fly'),
  settle:    $('#settle'),
  envelope:  $('#envelope'),
  paper:     $('#paper'),
  inside:    $('#envInside'),
  seal:      $('#seal'),
  opener:    $('#opener'),
  nudge:     $('#openerNudge'),
  openerArt: $('#openerArt'),
  card:      $('#card'),
  hint:      $('#hint'),
  invite:    $('#invite'),
  slot:      $('#cardSlot'),
  dust:      $('#dust')
};

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params  = new URLSearchParams(location.search);
const fast    = params.has('fast');     // ?fast   — skip the flight while editing
const skip    = params.has('invite');   // ?invite — go straight to the invitation
const wait    = ms => new Promise(r => setTimeout(r, ms));
const GLIDE   = 'cubic-bezier(.22,.61,.36,1)';
const SOFT    = 'cubic-bezier(.4,0,.2,1)';
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ------------------------------------------------------------------
   1 · THE FLIGHT — one long, shallow glide in from the right,
   sampled from a real SVG path, sparks trailing behind.
   ------------------------------------------------------------------ */
function buildFlightPath() {
  const w = innerWidth, h = innerHeight;
  const cx = w / 2, cy = h / 2;
  const d =
    `M ${w + w * 0.45} ${h * 0.26} ` +
    `C ${w * 0.92} ${h * 0.30} ${w * 0.80} ${h * 0.60} ${cx + w * 0.30} ${h * 0.56} ` +
    `C ${cx + w * 0.14} ${h * 0.535} ${cx + w * 0.06} ${cy} ${cx} ${cy}`;
  el.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  el.path.setAttribute('d', d);
  return el.path.getTotalLength();
}

function placeAt(p, len) {
  const L  = p * len;
  const pt = el.path.getPointAtLength(L);
  const nx = el.path.getPointAtLength(Math.min(L + 6, len));
  const grow  = p < .82 ? p / .82 : 1;
  const scale = 0.24 + 0.76 * grow;
  const dx = nx.x - pt.x, dy = nx.y - pt.y;
  const mag = Math.hypot(dx, dy) || 1;
  const bank = (dx / mag) * 9 * (1 - easeInOut(p));
  const blur = Math.max(0, 2 * (1 - p / .6));      // brief and light: blur is costly on phones
  el.fly.style.transform = `translate3d(${pt.x}px,${pt.y}px,0) rotate(${bank.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
  el.fly.style.opacity   = Math.min(1, p / .16).toFixed(3);
  el.fly.style.filter    = blur > .05 ? `blur(${blur.toFixed(2)}px)` : 'none';
  if (p < .97) emitTrail(pt.x - dx * 2.2, pt.y - dy * 2.2, scale, 1 - p);
}

function flight(duration) {
  return new Promise(resolve => {
    let len = buildFlightPath();
    let t0 = null;
    const onResize = () => { len = buildFlightPath(); };
    addEventListener('resize', onResize);
    const frame = now => {
      if (t0 === null) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      placeAt(easeInOut(p), len);
      if (p < 1) requestAnimationFrame(frame);
      else { removeEventListener('resize', onResize); resolve(); }
    };
    requestAnimationFrame(frame);
  });
}

function holdCentre() {
  const set = () => {
    el.fly.style.transform = `translate3d(${innerWidth / 2}px,${innerHeight / 2}px,0) rotate(0deg) scale(1)`;
  };
  set();
  addEventListener('resize', set);
}

/* ------------------------------------------------------------------
   2 · ARRIVAL — a small physical settle; then the opener appears
   ------------------------------------------------------------------ */
async function arrive() {
  el.fly.style.filter = 'none';
  el.fly.style.opacity = '1';
  holdCentre();
  el.envelope.classList.add('is-arrived');

  if (!reduced && !fast) {
    await el.settle.animate(
      [{ transform: 'scale(.98)' }, { transform: 'scale(1.02)', offset: .55 }, { transform: 'scale(1)' }],
      { duration: 460, easing: SOFT }
    ).finished;
  }
  el.settle.classList.add('is-floating');
  el.opener.classList.add('is-ready');
  await wait(fast ? 0 : 500);
  el.hint.classList.add('is-on');
  armOpener();
  scheduleNudge();
}

/* ------------------------------------------------------------------
   3 · THE OPENER — push it up under the seal; the seal lifts, then
   comes away whole. A tap does it for you. Idle for a moment and
   the opener gives a small push of its own, as a hint.
   ------------------------------------------------------------------ */
let pry = 0;              // 0 … 1 — how far the blade has gone under the seal
let prying = false;
let pried = false;
let nudgeTimer = 0;

function setPry(v) {
  pry = Math.max(0, Math.min(1, v));
  el.opener.style.setProperty('--pry', pry.toFixed(4));
  // the seal only starts to lift once the blade has reached it
  const lift = Math.max(0, Math.min(1, (pry - .3) / .7));
  el.seal.style.setProperty('--lift', lift.toFixed(4));
}

function scheduleNudge(delay = 3000) {
  clearTimeout(nudgeTimer);
  if (pried || reduced) return;
  nudgeTimer = setTimeout(() => {
    if (pried || prying) return;
    el.nudge.classList.remove('is-nudging');
    void el.nudge.offsetWidth;                 // restart the animation
    el.nudge.classList.add('is-nudging');
    scheduleNudge(3600);
  }, delay);
}

function armOpener() {
  const scene = el.scene;
  let startY = 0, startX = 0, startPry = 0, moved = 0, span = 80;

  const down = (ev) => {
    if (pried) return;
    window.Invite?.gesture();                  // lets the music start, if there is any
    clearTimeout(nudgeTimer);
    el.nudge.classList.remove('is-nudging');
    span = Math.max(70, el.envelope.getBoundingClientRect().width * .24);
    startY = ev.clientY; startX = ev.clientX;
    startPry = pry; moved = 0;
    prying = true;
    el.envelope.classList.add('is-prying');
    el.hint.classList.remove('is-on');
    try { scene.setPointerCapture(ev.pointerId); } catch {}
  };

  const move = (ev) => {
    if (!prying) return;
    // mostly upwards; a little leftwards (along the blade) counts too
    const up = (startY - ev.clientY) + (startX - ev.clientX) * .35;
    moved = Math.max(moved, Math.hypot(ev.clientX - startX, ev.clientY - startY));
    setPry(startPry + up / span);
    if (pry >= 1) release();
  };

  const up = () => {
    if (!prying) return;
    prying = false;
    el.envelope.classList.remove('is-prying');
    if (pried) return;
    if (moved < 8) return runPry();            // a tap: do it for them
    if (pry >= .55) return release();
    animatePry(0, 420, () => { el.hint.classList.add('is-on'); scheduleNudge(); });
  };

  scene.addEventListener('pointerdown', down);
  scene.addEventListener('pointermove', move);
  scene.addEventListener('pointerup', up);
  scene.addEventListener('pointercancel', up);
  el.openerArt.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); runPry(); }
  });
}

function animatePry(to, ms, done) {
  const from = pry, t0 = performance.now();
  const step = now => {
    const p = Math.min(1, (now - t0) / ms);
    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    setPry(from + (to - from) * e);
    if (p < 1 && !prying) requestAnimationFrame(step);
    else if (p >= 1) done?.();
  };
  requestAnimationFrame(step);
}

function runPry() {
  if (pried) return;
  animatePry(1, 380 + (1 - pry) * 620, release);
}

/* the seal is free: off it comes, whole, and the opener is set down */
function release() {
  if (pried) return;
  pried = true;
  clearTimeout(nudgeTimer);
  setPry(1);
  el.hint.classList.add('is-off');
  el.seal.classList.add('is-free');
  setTimeout(() => {
    el.opener.classList.add('is-done');
    el.opener.style.setProperty('--pry', '0');     // the blade slides back out as it fades
  }, 260);
  openEnvelope();
}

/* ------------------------------------------------------------------
   4 · THE ENVELOPE OPENS UPWARDS, AND THE INVITATION COMES OUT
   ------------------------------------------------------------------ */
async function openEnvelope() {
  el.settle.classList.remove('is-floating');
  await wait(reduced ? 0 : 520);                   // the seal is clear of the flap
  el.envelope.classList.add('is-open');            // the flap swings up and back, 1s
  await wait(reduced ? 0 : 720);
  await presentCard();
}

async function presentCard() {
  const r = el.card.getBoundingClientRect();
  const lyingH = r.height;                         // lying on its side: this is the card's width
  const envH = el.envelope.getBoundingClientRect().height;
  const at = (y, deg, s) => `translate(-50%,-50%) translateY(${y}px) rotate(${deg}deg) scale(${s})`;

  // drawn up and out of the pocket, still on its side
  const clear = -(envH * 0.52 + lyingH * 0.55);
  const out = el.card.animate(
    [{ transform: at(0, 90, 1) }, { transform: at(clear, 90, 1) }],
    { duration: 1000, easing: GLIDE, fill: 'forwards' }
  );

  // the envelope is set aside while the card is still rising
  await wait(560);
  const away = [
    { transform: 'translateY(0) scale(1)', opacity: 1 },
    { transform: 'translateY(14%) scale(.96)', opacity: 0 }
  ];
  const awayOpts = { duration: 1000, easing: SOFT, fill: 'forwards' };
  el.paper.animate(away, awayOpts);
  el.inside.animate(away, awayOpts);
  el.envelope.querySelector('.env-shadow').style.opacity = '0';

  await out.finished;
  el.envelope.classList.add('is-presenting');

  // it turns upright and comes forward to the middle of the screen
  await el.card.animate(
    [{ transform: at(clear, 90, 1) }, { transform: at(0, 0, 1.3) }],
    { duration: 1100, easing: GLIDE, fill: 'forwards' }
  ).finished;

  await fillScreen();
}

/* the invitation grows until it is the whole screen */
async function fillScreen() {
  const from = el.card.getBoundingClientRect();
  const colW = Math.min(innerWidth, 480);          // mirrors --col
  const left = (innerWidth - colW) / 2;

  el.card.getAnimations().forEach(a => a.cancel());
  el.card.classList.add('is-full');
  Object.assign(el.card.style, {
    transform: 'none',
    left: `${from.left}px`, top: `${from.top}px`,
    width: `${from.width}px`, height: `${from.height}px`
  });
  document.body.appendChild(el.card);
  el.scene.classList.add('is-gone');

  const fullH = (window.CSS && CSS.supports && CSS.supports('height', '100svh')) ? '100svh' : `${innerHeight}px`;
  await el.card.animate(
    [{ left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
     { left: `${left}px`, top: '0px', width: `${colW}px`, height: fullH }],
    { duration: reduced ? 1 : 950, easing: GLIDE, fill: 'forwards' }
  ).finished;

  handOff();
}

/* the card stops being an overlay and becomes the first screen of the page */
function handOff() {
  el.invite.classList.add('is-live');
  el.invite.removeAttribute('aria-hidden');
  el.body.classList.remove('is-locked');
  scrollTo(0, 0);

  el.card.getAnimations().forEach(a => a.cancel());
  el.card.classList.remove('is-full');
  ['transform', 'left', 'top', 'width', 'height'].forEach(p => el.card.style.removeProperty(p));
  el.slot.appendChild(el.card);

  window.Invite?.start();
}

/* ------------------------------------------------------------------
   5 · the air: drifting dust, plus the sparks the envelope trails
   ------------------------------------------------------------------ */
let emitTrail = () => {};

function dust() {
  if (reduced || !el.dust) return;
  const c = el.dust, ctx = c.getContext('2d');
  let dpr = 1, w = 0, h = 0, motes = [], sparks = [], running = true;

  const seed = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    motes = Array.from({ length: Math.round(Math.min(34, w / 26)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: .6 + Math.random() * 1.7,
      vx: -.08 - Math.random() * .16, vy: -.05 - Math.random() * .12,
      a: .05 + Math.random() * .14, ph: Math.random() * Math.PI * 2
    }));
  };
  seed();
  addEventListener('resize', seed);

  // two pre-drawn sprites instead of a fresh gradient per spark per frame
  const sprite = (core) => {
    const s = document.createElement('canvas'); s.width = s.height = 64;
    const g = s.getContext('2d');
    const halo = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    halo.addColorStop(0,   'rgba(214,158,60,.55)');
    halo.addColorStop(.45, 'rgba(203,148,66,.2)');
    halo.addColorStop(1,   'rgba(203,148,66,0)');
    g.fillStyle = halo; g.fillRect(0, 0, 64, 64);
    g.fillStyle = core; g.beginPath(); g.arc(32, 32, 32 / 6, 0, Math.PI * 2); g.fill();
    return s;
  };
  const warmSprite = sprite('rgba(190,132,44,.85)');
  const hotSprite  = sprite('rgba(255,250,236,1)');
  const cap = innerWidth < 600 ? 200 : 420;        // phones get a lighter trail

  emitTrail = (x, y, scale, strength) => {
    const n = strength > .5 && innerWidth >= 600 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const spread = 7 * scale + 2;
      sparks.push({
        x: x + (Math.random() - .5) * spread, y: y + (Math.random() - .5) * spread,
        vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .4 + .10,
        r: (.5 + Math.random() * 1.6) * (.5 + scale),
        life: 1, decay: .010 + Math.random() * .014, hot: Math.random() < .3
      });
    }
    if (sparks.length > cap) sparks.splice(0, sparks.length - cap);
  };

  let prev = 0;
  const draw = now => {
    if (!running) return;
    const dt = Math.min(2.5, prev ? (now - prev) / 16.67 : 1); prev = now;
    ctx.clearRect(0, 0, w, h);
    for (const m of motes) {
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
      if (m.x < -10) m.x = w + 10;
      const tw = m.a * (.65 + .35 * Math.sin(now / 1400 + m.ph));
      ctx.beginPath(); ctx.fillStyle = `rgba(198,167,106,${tw.toFixed(3)})`;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += .006 * dt; s.life -= s.decay * dt;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const halo = s.r * 4.5;
      ctx.globalAlpha = s.life * s.life;
      ctx.drawImage(s.hot ? hotSprite : warmSprite, s.x - halo, s.y - halo, halo * 2, halo * 2);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  // once the invitation has the screen, the dust is no longer needed
  window.addEventListener('invite:live', () => { running = false; c.remove(); }, { once: true });
}

/* ------------------------------------------------------------------
   run
   ------------------------------------------------------------------ */
/* Everything the envelope is made of has to be decoded before it moves,
   or a slow phone would fly in an empty frame. Never wait longer than 6s. */
function ready() {
  const urls = ['assets/env-flap.webp', 'assets/env-pocket.webp', 'assets/env-inside.webp',
                'assets/wax-seal.webp', 'assets/opener.webp', 'assets/photos/sunn0445.jpg'];
  const one = u => new Promise(res => {
    const i = new Image();
    i.onload = () => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()).then(res);
    i.onerror = res;
    i.src = u;
  });
  return Promise.race([Promise.all(urls.map(one)), wait(6000)]);
}

/* The invitation is display:none until the card lands, so its fonts would only
   start downloading then — and swap in mid-glide, shifting the page. Ask for
   exactly the glyphs it uses, now, while the envelope is still on screen. */
function warmFonts() {
  if (!document.fonts || !document.fonts.load) return;
  const text = (el.invite.textContent || '').replace(/\s+/g, '') + '0123456789';
  ['400 16px "Chocolate Classical Sans"', '400 16px Allura']
    .forEach(f => document.fonts.load(f, text).catch(() => {}));
}

/* container query units, with a fallback for phones too old to have them */
function cqFallback() {
  if (window.CSS && CSS.supports && CSS.supports('width', '1cqw')) return;
  if (!('ResizeObserver' in window)) return;
  new ResizeObserver(([e]) => {
    el.card.style.setProperty('--cq', `${e.contentRect.width / 100}px`);
  }).observe(el.card);
}

async function run() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  setPry(0);
  cqFallback();
  warmFonts();

  if (skip) {
    el.scene.classList.add('is-gone');
    handOff();
    return;
  }
  dust();

  await ready();

  if (reduced) {
    buildFlightPath();
    el.fly.style.opacity = '1';
    await arrive();
    return;
  }
  await wait(fast ? 0 : 500);
  await flight(fast ? 300 : 3000);
  await arrive();
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', run);
else run();

})();
