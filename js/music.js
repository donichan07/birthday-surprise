/* Musik latar: hanya mulai setelah interaksi pengguna */
const Music = {
  a: null, playing: false, userPaused: false, missing: false,
  init() {
    const a = Music.a = new Audio(); a.loop = true; a.preload = 'none'; a.src = CONFIG.music.src; a.volume = CONFIG.music.volume;
    $('#vol').value = a.volume;
    a.addEventListener('error', () => { Music.missing = true; Music.ui(false); });
    $('#musicBtn').addEventListener('click', () => Music.toggle(true));
    $('#musicOpt').addEventListener('click', () => Music.toggle(true));
    $('#vol').addEventListener('input', e => { a.volume = +e.target.value; });
  },
  async play() {
    if (Music.missing) return App.toast('Musik belum tersedia. Tambahkan sound/romantic.mp3.');
    try { await Music.a.play(); Music.ui(true); }
    catch (e) { Music.ui(false); if (Music.missing || e.name === 'NotSupportedError') { Music.missing = true; App.toast('Musik belum tersedia. Tambahkan sound/romantic.mp3.'); } }
  },
  toggle(byUser) {
    if (Music.playing) { Music.a.pause(); Music.ui(false); if (byUser) Music.userPaused = true; }
    else { Music.userPaused = false; Music.play(); }
  },
  start() { if (!Music.userPaused && !Music.playing) Music.play(); },
  ui(on) {
    Music.playing = on; $('#music').classList.toggle('on', on);
    $('#musicOpt').textContent = on ? '♫ Musik menyala' : '♫ Nyalakan musik';
  }
};
