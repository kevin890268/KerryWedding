/* ============================================================
   invite.js — Act II, the long invitation.
   · builds the calendar, the gallery, the countdown and the map links
   · gold confetti over the cover, sparkles by "Save the date"
   · once the card fills the screen, the page glides slowly to the
     bottom — until the reader scrolls or swipes for themselves
   · a slim scrubber on the right for jumping around
   ============================================================ */
(() => {
'use strict';

const W = window.WEDDING || {};
const $ = (s, r = document) => r.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   content that is computed rather than written
   ------------------------------------------------------------------ */
function buildCalendar() {
  const box = $('#calGrid');
  const { year = 2026, month = 11, day = 8 } = W.calendar || {};
  if (!box) return;
  const heads = ['一', '二', '三', '四', '五', '六', '日'];
  const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;   // Monday first
  const days = new Date(year, month, 0).getDate();
  let html = heads.map(h => `<span class="wd">${h}</span>`).join('');
  html += '<span></span>'.repeat(offset);
  for (let d = 1; d <= days; d++) {
    html += `<span class="day${d === day ? ' is-day' : ''}">${d}</span>`;
  }
  html += `<span class="year" aria-hidden="true">${year}</span>`;
  box.innerHTML = html;
}

function buildGallery() {
  const box = $('#gallery');
  const list = W.gallery || [];
  const wide = new Set(W.galleryWide || []);
  if (!box || !list.length) return;

  // a portrait left on its own before a wide shot (or at the end) spans both columns
  const kinds = list.map(f => (wide.has(f) ? 'wide' : 'tall'));
  let run = [];
  const close = () => { if (run.length % 2 === 1) kinds[run[run.length - 1]] = 'solo'; run = []; };
  kinds.forEach((k, i) => { if (k === 'tall') run.push(i); else close(); });
  close();

  box.innerHTML = list.map((f, i) => {
    const cls = kinds[i] === 'tall' ? '' : ` class="${kinds[i]}"`;
    return `<img${cls} src="assets/photos/${f}" alt="" loading="lazy" decoding="async" data-rise>`;
  }).join('');
}

function wireMap() {
  const q = encodeURIComponent(W.mapQuery || '');
  const href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  ['#venueLink', '#addrLink', '#mapLink'].forEach(s => { const a = $(s); if (a) a.href = href; });
}

function startCountdown() {
  const box = $('#count');
  const when = new Date(W.countdownTo || '').getTime();
  if (!box || Number.isNaN(when)) return;
  const cell = u => box.querySelector(`[data-u="${u}"]`);
  const d = cell('d'), h = cell('h'), m = cell('m'), s = cell('s');
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    let left = Math.max(0, when - Date.now());
    const dd = Math.floor(left / 864e5); left -= dd * 864e5;
    const hh = Math.floor(left / 36e5);  left -= hh * 36e5;
    const mm = Math.floor(left / 6e4);   left -= mm * 6e4;
    const ss = Math.floor(left / 1e3);
    d.textContent = pad(dd); h.textContent = pad(hh); m.textContent = pad(mm); s.textContent = pad(ss);
    if (when - Date.now() > 0) setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  };
  tick();
}

/* ------------------------------------------------------------------
   gold that falls over the cover, and twinkles by "Save the date"
   ------------------------------------------------------------------ */
function goldLayer(canvas, { density, fall, flakes }) {
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, bits = [], visible = true;

  const make = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -10,
    s: flakes ? 1.4 + Math.random() * 3.4 : .6 + Math.random() * 1.6,
    vy: fall ? .18 + Math.random() * .45 : (Math.random() - .5) * .08,
    vx: (Math.random() - .5) * .18,
    rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .06,
    ph: Math.random() * Math.PI * 2,
    hue: Math.random()
  });

  const size = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const want = Math.min(innerWidth < 600 ? 55 : 90, Math.round(w * h * density));
    while (bits.length < want) bits.push(make(true));
    bits.length = want;
  };
  new ResizeObserver(size).observe(canvas);
  size();

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  let prev = 0;
  const draw = now => {
    requestAnimationFrame(draw);
    if (!visible || !w) { prev = now; return; }
    const dt = Math.min(2.5, prev ? (now - prev) / 16.67 : 1); prev = now;
    ctx.clearRect(0, 0, w, h);
    for (const b of bits) {
      b.y += b.vy * dt; b.x += (b.vx + Math.sin(now / 900 + b.ph) * .12) * dt; b.rot += b.vr * dt;
      if (b.y > h + 10) Object.assign(b, make(false));
      const tw = .55 + .45 * Math.sin(now / 520 + b.ph);
      ctx.save();
      ctx.translate(b.x, b.y);
      if (flakes) {
        ctx.rotate(b.rot);
        ctx.scale(Math.cos(now / 400 + b.ph), 1);             // a flake turning over as it falls
        ctx.fillStyle = b.hue < .5 ? `rgba(246,214,138,${.85 * tw})` : `rgba(214,168,82,${.8 * tw})`;
        ctx.fillRect(-b.s / 2, -b.s * .35, b.s, b.s * .7);
      } else {
        ctx.fillStyle = `rgba(214,170,90,${.75 * tw})`;
        ctx.beginPath(); ctx.arc(0, 0, b.s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  };
  requestAnimationFrame(draw);
}

/* ------------------------------------------------------------------
   the slow glide to the bottom — it gives way as soon as the reader
   takes over with a real scroll, swipe or key
   ------------------------------------------------------------------ */
const glide = { on: false, paused: false, y: 0, set: -1, last: 0, t0: 0, drift: 0 };

function startGlide() {
  if (reduced) return;
  glide.on = true;
  glide.y = scrollY; glide.set = -1;
  glide.last = glide.t0 = performance.now();
  requestAnimationFrame(stepGlide);
}

function stopGlide() {
  glide.on = false;
}

function stepGlide(now) {
  if (!glide.on) return;
  const dt = Math.min(64, now - glide.last) / 1000;
  glide.last = now;
  if (!glide.paused) {
    const ramp = Math.min(1, (now - glide.t0) / 1800);     // eases in, no jolt
    const max = document.documentElement.scrollHeight - innerHeight;
    glide.y = Math.min(max, glide.y + (W.scrollSpeed || 46) * ramp * dt);
    glide.set = Math.round(glide.y);
    scrollTo(0, glide.y);
    if (glide.y >= max - .5) { stopGlide(); return; }
  }
  requestAnimationFrame(stepGlide);
}

function wireTakeover() {
  // a scroll we did not make: follow it, and give up the glide if it was a big one
  addEventListener('scroll', () => {
    if (!glide.on || glide.set < 0) return;
    const off = scrollY - glide.set;
    if (Math.abs(off) > 2) {
      glide.drift += Math.abs(off);
      glide.y = scrollY; glide.set = scrollY;
      if (glide.drift > 90) stopGlide();
    }
  }, { passive: true });

  addEventListener('wheel', (e) => {
    if (!glide.on) return;
    glide.drift += Math.abs(e.deltaY);
    if (glide.drift > 90) stopGlide();
  }, { passive: true });

  // a finger on the page holds the glide; a real swipe ends it
  let ty = 0;
  addEventListener('touchstart', (e) => {
    if (!glide.on) return;
    glide.paused = true; ty = e.touches[0].clientY;
  }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!glide.on) return;
    if (Math.abs(e.touches[0].clientY - ty) > 36) stopGlide();
  }, { passive: true });
  const lift = () => {
    if (!glide.on) return;
    glide.paused = false; glide.y = scrollY; glide.last = performance.now();
  };
  addEventListener('touchend', lift, { passive: true });
  addEventListener('touchcancel', lift, { passive: true });

  addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) stopGlide();
  });
}

/* ------------------------------------------------------------------
   the scrubber on the right
   ------------------------------------------------------------------ */
function wireRail() {
  const rail = $('#rail'), track = $('#railTrack'), thumb = $('#railThumb');
  if (!rail) return;
  rail.hidden = false;

  const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const place = () => {
    const room = track.clientHeight - thumb.offsetHeight;
    thumb.style.transform = `translateY(${(scrollY / maxScroll()) * room}px)`;
  };
  let pending = false;
  addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; place(); });
  }, { passive: true });
  addEventListener('resize', place);
  place();

  const jump = (clientY) => {
    const r = track.getBoundingClientRect();
    const room = r.height - thumb.offsetHeight;
    const k = Math.max(0, Math.min(1, (clientY - r.top - thumb.offsetHeight / 2) / room));
    scrollTo(0, k * maxScroll());
  };
  let dragging = false;
  rail.addEventListener('pointerdown', (e) => {
    stopGlide();
    dragging = true;
    rail.classList.add('is-active');
    try { rail.setPointerCapture(e.pointerId); } catch {}
    jump(e.clientY);
    e.preventDefault();
  });
  rail.addEventListener('pointermove', (e) => { if (dragging) jump(e.clientY); });
  const end = () => { dragging = false; rail.classList.remove('is-active'); };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
}

/* ------------------------------------------------------------------
   music (only if a track is configured)
   ------------------------------------------------------------------ */
const audio = $('#bgm'), musicBtn = $('#music');
let wantMusic = !!W.music;

function wireMusic() {
  if (!W.music || !audio || !musicBtn) return;
  audio.src = W.music;
  musicBtn.hidden = false;
  musicBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play().catch(() => {}); } else { audio.pause(); }
  });
  audio.addEventListener('play',  () => musicBtn.classList.add('is-playing'));
  audio.addEventListener('pause', () => musicBtn.classList.remove('is-playing'));
}

/* ------------------------------------------------------------------
   entrances
   ------------------------------------------------------------------ */
function observeRises() {
  const items = document.querySelectorAll('#invite [data-rise]');
  if (!('IntersectionObserver' in window)) { items.forEach(n => n.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  items.forEach(n => io.observe(n));
}

/* ------------------------------------------------------------------
   public: set up now; start when the card has the screen
   ------------------------------------------------------------------ */
window.Invite = {
  gesture() {
    // the first touch on the envelope counts as permission to play sound
    if (wantMusic && audio && audio.paused) { wantMusic = false; audio.play().catch(() => {}); }
  },
  start() {
    window.dispatchEvent(new Event('invite:live'));
    wireRail();
    wireTakeover();
    goldLayer($('#saveSparks'), { density: .00012, fall: false, flakes: false });

    // ?invite&at=1600 — open at a given point, everything already in place (for checking layouts)
    const at = new URLSearchParams(location.search).get('at');
    if (at !== null) {
      document.querySelectorAll('#invite [data-rise]').forEach(n => { n.style.transition = 'none'; n.classList.add('is-in'); });
      document.querySelectorAll('#invite img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      if (new URLSearchParams(location.search).has('shot')) {
        // headless screenshots only capture the top of the page: slide the column up instead
        document.querySelector('.inv').style.transform = `translateY(${-(+at || 0)}px)`;
        return;
      }
      const go = () => scrollTo(0, +at || 0);
      go(); addEventListener('load', go);
      return;
    }
    observeRises();
    // a breath on the cover first — and never glide before the fonts are in,
    // or text below would re-flow and nudge the page while it moves
    const fontsIn = document.fonts && document.fonts.ready
      ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))])
      : Promise.resolve();
    Promise.all([fontsIn, new Promise(r => setTimeout(r, 1400))]).then(startGlide);
  }
};

buildCalendar();
buildGallery();
wireMap();
startCountdown();
wireMusic();
goldLayer($('#confetti'), { density: .00055, fall: true, flakes: true });

})();
