/* Halaman 2-7 + interaksi global */
const Interactions = {
  build() { this.letter(); this.memories(); this.cake(); this.future(); this.final(); },

  /* --- Halaman 2: Surat --- */
  letter() {
    const c = CONFIG.letter, s = $('#p2 .slot'); s.innerHTML = '';
    s.append(t('p', 'eyebrow', 'Sebuah surat untukmu'), t('h2', '', 'Surat Cinta'));
    const env = App.envelope(), paper = t('article', 'paper'); paper.hidden = true;
    const g = t('h3'), ps = c.paragraphs.map(() => t('p')), sg = t('p', 'sign');
    paper.append(g, ...ps, sg, t('span', 'stamp', '♥'));
    const read = t('button', 'btn', 'Baca'), more = App.next('Masih Ada Lagi Untukmu'); more.hidden = true;
    read.addEventListener('click', () => {
      read.hidden = true; env.classList.add('open');
      setTimeout(() => {
        env.style.display = 'none'; paper.hidden = false; paper.classList.add('rise');
        App.seq([[g, c.greeting], ...ps.map((p, i) => [p, c.paragraphs[i]]), [sg, c.sign + ' ' + CONFIG.senderName]], 28, () => { more.hidden = false; });
      }, 1000);
    });
    s.append(env, paper, read, more);
  },

  /* --- Halaman 3: Kenangan --- */
  memories() {
    const s = $('#p3 .slot'); s.innerHTML = '';
    s.append(t('p', 'eyebrow', 'Ketuk foto untuk melihat lebih dekat'), t('h2', '', 'Kenangan Kita'));
    const g = t('div', 'polaroids');
    CONFIG.memories.forEach((m, i) => {
      const f = t('button', 'polaroid'); f.style.setProperty('--r', (i % 2 ? 2.5 : -2.5) + 'deg'); f.style.setProperty('--d', Math.min(i, 9) * 0.12 + 's');
      f.append(t('span', 'tape'), App.photo(m.img, m.caption), t('b', '', m.caption), t('small', '', m.date));
      f.addEventListener('click', () => Interactions.lb(i)); g.appendChild(f);
    });
    s.append(g, t('span', 'doodle', '♡ ✦ ♡'), App.next('Lanjut'));
    Nav.hooks[2] = () => { $$('.polaroid').forEach(p => p.classList.remove('in')); requestAnimationFrame(() => requestAnimationFrame(() => $$('.polaroid').forEach(p => p.classList.add('in')))); };
  },
  lb(i) {
    const L = $('#lightbox'), M = CONFIG.memories, n = M.length; this.li = (i + n) % n; const m = M[this.li];
    $('#lb-ph').replaceChildren(App.photo(m.img, m.caption)); $('#lb-cap').textContent = m.caption + ' · ' + m.date; L.hidden = false;
  },


  /* --- Halaman 5: Kue --- */
  cake() {
    const s = $('#p4 .slot'); s.innerHTML = '';
    s.append(t('p', 'eyebrow', CONFIG.birthday && !/Y/.test(CONFIG.birthday) ? CONFIG.birthday : 'Saatnya merayakan'), t('h2', '', 'Perayaan Ulang Tahun'));
    const cake = html('div', 'cake', '<div class="candles"><i class="candle"><b class="flame"></b></i><i class="candle"><b class="flame"></b></i><i class="candle"><b class="flame"></b></i></div><div class="tier t1"></div><div class="tier t2"></div><div class="tier t3"></div><div class="plate"></div>');
    const msg = t('p', 'wish'); msg.hidden = true;
    const row = t('div', 'row'), blow = t('button', 'btn ghost', 'Tiup Lilin'), wish = t('button', 'btn', 'Buat Permohonan'), nx = App.next('Lanjut'); nx.hidden = true;
    const out = () => { $$('.candle', cake).forEach(c => c.classList.add('out')); };
    const done = () => { out(); msg.textContent = CONFIG.cake.wishMessage; msg.hidden = false; nx.hidden = false; App.confetti(); const r = wish.getBoundingClientRect(); App.hearts(r.left + r.width / 2, r.top, 10); };
    blow.addEventListener('click', out); wish.addEventListener('click', done);
    
    row.append(blow, wish); s.append(cake, row, msg, nx);
  },

  /* --- Halaman 6: Masa depan --- */
  future() {
    const s = $('#p5 .slot'); s.innerHTML = '';
    s.append(t('p', 'eyebrow', ''), t('h2', '', 'Pesan untuk Kedepannya'));
    CONFIG.future.forEach(x => s.appendChild(t('p', 'fline', x)));
    s.appendChild(App.next('Satu Kejutan Terakhir'));
    Nav.hooks[4] = () => $$('#p5 .fline').forEach((p, i) => { p.classList.remove('in'); setTimeout(() => p.classList.add('in'), 500 + i * 1800); });
  },

  /* --- Halaman 7: Kejutan akhir --- */
  final() {
    const f = CONFIG.final, s = $('#p6 .slot'); s.innerHTML = '';
    const gift = html('button', 'gift', '<span class="lid"></span><span class="box"></span><span class="rib"></span><span class="tag">Ketuk untuk membuka</span>');
    gift.setAttribute('aria-label', 'Buka hadiahnya');
    const rev = t('div', 'reveal'); rev.hidden = true;
    rev.append(App.photo(f.photo, 'Kita'), t('h2', 'big', f.title), ...f.paragraphs.map(p => t('p', '', p)), t('p', 'sign', f.sign + ' ' + CONFIG.senderName));
    const re = t('button', 'btn', 'Putar Ulang Kisah Kita'); re.hidden = true;
    re.addEventListener('click', () => { Interactions.build(); $('#o-env .env').classList.remove('open'); Nav.reset(); });
    gift.addEventListener('click', () => {
      gift.classList.add('open'); App.confetti(180); const r = gift.getBoundingClientRect(); App.hearts(r.left + r.width / 2, r.top + 40, 14);
      setTimeout(() => { gift.style.display = 'none'; rev.hidden = false; rev.classList.add('rise'); re.hidden = false; $('#p7').scrollTop = 0; }, 1100);
    });
    s.append(t('p', 'eyebrow', 'Satu hal lagi'), gift, rev, re);
  },

  /* --- Binding global --- */
  bind() {
    $('#openBtn').addEventListener('click', () => { $('#o-env .env').classList.add('open'); Music.start(); setTimeout(() => Nav.go(1), 1100); });
    const L = $('#lightbox'), step = d => Interactions.lb(Interactions.li + d);
    $('.lb-x').addEventListener('click', () => L.hidden = true);
    $('.prev', L).addEventListener('click', () => step(-1)); $('.next', L).addEventListener('click', () => step(1));
    L.addEventListener('click', e => { if (e.target === L) L.hidden = true; });
    document.addEventListener('keydown', e => { if (L.hidden) return; if (e.key === 'Escape') L.hidden = true; if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
    document.addEventListener('click', e => { if (e.target.closest('.card,.gift,.btn')) App.hearts(e.clientX, e.clientY, 4); });
    // kursor dekoratif (desktop) + parallax langit
    const gl = $('#glow'), sky = $('#sky');
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !App.reduced) {
      document.body.classList.add('fine');
      addEventListener('pointermove', e => { gl.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; sky.style.transform = `translate(${(e.clientX / innerWidth - .5) * -14}px,${(e.clientY / innerHeight - .5) * -14}px)`; });
    }
  }
};
