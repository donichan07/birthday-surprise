/* Helper umum + inisialisasi */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const html = (tag, cls, h) => { const e = t(tag, cls); e.innerHTML = h; return e; }; // hanya untuk markup statis

const App = {
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  // foto dengan fallback placeholder jika file belum ada
  photo(src, alt) {
    const w = t('div', 'photo'), i = new Image();
    i.alt = alt || ''; i.loading = 'lazy';
    i.onerror = () => { i.remove(); w.classList.add('noimg'); w.innerHTML = '<span>♥</span><small></small>'; $('small', w).textContent = 'Letakkan foto di ' + src.replace('./', ''); };
    i.src = src; w.appendChild(i); return w;
  },
  envelope() { return html('div', 'env', '<div class="env-back"></div><div class="env-flap"></div><div class="env-front"></div><div class="seal">♥</div>'); },
  type(el, text, speed, done) {
    if (App.reduced) { el.textContent = text; done && done(); return; }
    let i = 0; (function s() { el.textContent = text.slice(0, ++i); i < text.length ? setTimeout(s, speed) : done && done(); })();
  },
  seq(items, speed, done) {
    let k = 0; (function n() { if (k >= items.length) return done && done(); const [el, tx] = items[k++]; App.type(el, tx, speed, () => setTimeout(n, 250)); })();
  },
  hearts(x, y, n = 6) {
    if (App.reduced) n = 2;
    for (let i = 0; i < n; i++) {
      const h = t('span', 'fh', '♥'); h.style.left = x + 'px'; h.style.top = y + 'px';
      h.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); h.style.setProperty('--s', (.7 + Math.random()).toFixed(2));
      document.body.appendChild(h); setTimeout(() => h.remove(), 1600);
    }
  },
  confetti(n = 140) {
    const c = $('#fx'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; if (App.reduced) n = 25;
    const cols = ['#f08fb0', '#e57fa5', '#d6e8fa', '#1f3a68', '#ffffff'];
    const P = Array.from({ length: n }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, vx: Math.random() * 2 - 1, vy: 2 + Math.random() * 3, r: 3 + Math.random() * 5, a: Math.random() * 6, col: cols[Math.random() * 5 | 0] }));
    let f = 0; (function d() { x.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.x += p.vx + Math.sin(p.a += .05); p.y += p.vy; x.fillStyle = p.col; x.fillRect(p.x, p.y, p.r, p.r * 1.6); }); ++f < 260 ? requestAnimationFrame(d) : x.clearRect(0, 0, c.width, c.height); })();
  },
  toast(msg) { const e = $('#toast'); e.textContent = msg; e.classList.add('show'); clearTimeout(App._t); App._t = setTimeout(() => e.classList.remove('show'), 3200); },
  next(label, cls = '') { const b = t('button', 'btn ' + cls, label); b.addEventListener('click', () => Nav.go(Nav.cur + 1)); return b; },

  init() {
    Object.entries(CONFIG.theme).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
    const o = CONFIG.opening;
    $('#o-eyebrow').textContent = o.eyebrow; $('#o-title').textContent = o.title; $('#o-sub').textContent = o.subtitle;
    $('#o-env').appendChild(App.envelope());
    const pe = $('#petals'); if (!App.reduced) for (let i = 0; i < 16; i++) { const s = t('span'); s.style.cssText = `left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 12}s;--sz:${8 + Math.random() * 10}px`; pe.appendChild(s); }
    const sky = $('#sky'); for (let i = 0; i < 90; i++) { const s = t('i'); s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 4}s;--z:${Math.random() > .8 ? 3 : 2}px`; sky.appendChild(s); }
    sky.appendChild(t('div', 'moon'));
    Interactions.build(); Nav.init(); Music.init(); Interactions.bind();
    window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 900));
    setTimeout(() => $('#loader').classList.add('done'), 3000);
  }
};
document.addEventListener('DOMContentLoaded', App.init);
