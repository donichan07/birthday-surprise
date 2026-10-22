/* Navigasi halaman virtual (hash + History API, aman untuk GitHub Pages) */
const Nav = {
  cur: -1, total: 7, max: 0, hooks: {},
  store(k, v) { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { } },
  read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  fromHash() { const m = /^#p([1-7])$/.exec(location.hash); return m ? +m[1] - 1 : null; },
  init() {
    const dots = $('#dots');
    for (let i = 0; i < Nav.total; i++) { const d = t('button', 'dot'); d.setAttribute('aria-label', 'Halaman ' + (i + 1)); d.addEventListener('click', () => i <= Nav.max && Nav.go(i)); dots.appendChild(d); }
    Nav.max = +Nav.read('hbml-max') || 0;
    const h = Nav.fromHash(), saved = +Nav.read('hbml-page') || 0;
    const start = Math.min(h !== null ? h : saved, Nav.total - 1);
    Nav.max = Math.max(Nav.max, start);
    history.replaceState({}, '', '#p' + (start + 1)); Nav.show(start);
    window.addEventListener('popstate', () => { const i = Nav.fromHash(); Nav.show(i === null ? 0 : i); });
  },
  go(i) { i = Math.max(0, Math.min(Nav.total - 1, i)); if (i === Nav.cur) return; history.pushState({}, '', '#p' + (i + 1)); Nav.show(i); },
  show(i) {
    Nav.cur = i; Nav.max = Math.max(Nav.max, i);
    $$('.page').forEach((p, k) => { p.classList.toggle('active', k === i); if (k === i) p.scrollTop = 0; });
    $$('.dot').forEach((d, k) => { d.classList.toggle('on', k === i); d.classList.toggle('seen', k < i); d.disabled = k > Nav.max; });
    document.body.dataset.page = i + 1;
    Nav.store('hbml-page', i); Nav.store('hbml-max', Nav.max);
    Nav.hooks[i] && Nav.hooks[i]();
  },
  reset() { Nav.store('hbml-page'); Nav.store('hbml-max'); Nav.max = 0; Nav.go(0); }
};
