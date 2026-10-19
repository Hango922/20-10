(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BAR = 1950;
  const BPM = 76.5, BEAT = 60000 / BPM, OFF = 450;
  function snap(ms) {
    const U = BEAT * 2; let d = Math.max(1, Math.round(ms / U)) * U;
    if (bgm && !bgm.paused) {
      const t = bgm.currentTime * 1000 - OFF;
      d = Math.max(U * 0.75, Math.round((t + d) / U) * U - t);
    }
    return d;
  }
  const YRS = new Date().getFullYear() - 1930;
  const qp = new URLSearchParams(location.search);
  let TO = (qp.get('to') || '').trim().slice(0, 40);
  let FROM = (qp.get('from') || '').trim().slice(0, 40);
  let REL = (qp.get('rel') || 'crush').trim().toLowerCase();
  let MSG = (qp.get('msg') || '').trim().slice(0, 250);

  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const WISH_TEMPLATES = {
    crush: "Chúc em ngày 20/10 thật nhiều niềm vui, luôn rạng rỡ và hạnh phúc. Cảm ơn em vì đã đến và làm thế giới của anh trở nên dịu dàng hơn mỗi ngày! ❤️",
    mom: "Chúc Mẹ kính yêu của con ngày 20/10 luôn tràn đầy sức khỏe, bình an và hạnh phúc. Cảm ơn Mẹ vì tất cả những hy sinh thầm lặng dành cho gia đình. Con yêu Mẹ rất nhiều! 🌸",
    sister: "Chúc chị/em gái ngày 20/10 luôn xinh đẹp, rạng rỡ, học tập và công việc luôn thuận lợi, sớm đạt được mọi ước mơ nhé! 🌷",
    friend: "Chúc bạn ngày 20/10 luôn vui vẻ, xinh xắn như hoa, tự tin tỏa sáng và gặt hái thật nhiều thành công trên con đường mình chọn! ✨",
    teacher: "Nhân ngày 20/10, em xin kính chúc Cô luôn mạnh khỏe, hạnh phúc và tràn đầy nhiệt huyết trong sự nghiệp trồng người cao quý! 📚"
  };

  /* ================= KỊCH BẢN TÙY BIẾN ================= */
  function buildScript() {
    let introSay = 'này cậu ơi!';
    if (REL === 'mom') introSay = 'Mẹ ơi! Nụ có một món quà nhỏ…';
    else if (REL === 'teacher') introSay = 'Kính gửi Cô giáo kính mến…';
    else if (TO) introSay = 'này <em>' + esc(TO) + '</em> ơi!';

    let heroSay = 'và còn những người không có tên trong sách: bà, mẹ, chị, cô giáo… và cả <em>cậu</em> nữa';
    if (REL === 'mom') heroSay = 'và người phụ nữ vĩ đại nhất trong trái tim con: chính là <em>Mẹ</em>';
    else if (REL === 'crush' && TO) heroSay = 'và với tớ, cô gái tuyệt vời và đáng yêu nhất chính là <em>' + esc(TO) + '</em>';

    return [
      { say: introSay, bars: 1.2, mood: 'wave', mode: 'hero', bg: 0, fx: { meteor: 1 } },
      { say: 'tớ là <em>Nụ</em> — nàng tiên nhỏ của vườn hoa', bars: 1.7, mood: 'talk' },
      { say: 'hôm nay tớ được giao một nhiệm vụ đặc biệt lắm đó…', bars: 1.7, mood: 'shy' },
      { say: 'vì nay là ngày…', bars: 1, mood: 'talk' },
      { scene: 'date', mode: 'side', say: '<em>20/10</em> rồi!', bars: 1.7, mood: 'happy', bg: 2, fx: { petals: .8, meteor: 1 } },

      { scene: 'history', say: 'ngày 20/10/1930, Hội Phụ nữ phản đế Việt Nam ra đời', bars: 2, mood: 'talk', reveal: ['h1', 'h2'] },
      { say: 'đã <em>' + YRS + '</em> năm trôi qua, và 20/10 thành ngày cả nước dành để tri ân phụ nữ', bars: 2.3, mood: 'talk', reveal: ['h3', 'h4'], on() { countTo($('#yrs'), YRS, 2200) } },

      { scene: 'heroes', say: 'trong câu chuyện đất nước, có biết bao người phụ nữ phi thường…', bars: 2, mood: 'talk', bg: 0, fx: { meteor: 1.6 }, reveal: ['n1', 'l1', 'n2', 'l2', 'e12'] },
      { say: 'từ Hai Bà Trưng, Bà Triệu thuở dựng nước, đến những người con gái kiên cường của thế kỷ XX', bars: 2.4, mood: 'talk', reveal: ['n3', 'l3', 'e23', 'n4', 'l4', 'e24', 'n5', 'l5', 'e35', 'e45'] },
      { say: heroSay, bars: 2.5, mood: 'happy', reveal: ['n6', 'l6', 'e46', 'e56'], fx: { meteor: 2.2, petals: .4 } },

      { scene: 'unseen', say: 'có những điều rất nhỏ mà phụ nữ vẫn lặng lẽ làm mỗi ngày…', bars: 2, mood: 'talk', bg: 2, fx: { petals: .3 } },
      { say: '', bars: 1.15, reveal: ['c1'] },
      { say: '', bars: 1.15, reveal: ['c2'] },
      { say: '', bars: 1.15, reveal: ['c3'] },
      { say: '', bars: 1.4, reveal: ['c4'] },
      { say: 'mà hiếm khi có ai nói lời cảm ơn', bars: 1.8, mood: 'shy' },
      { scene: 'none', mode: 'hero', say: 'nên hôm nay, đến lượt <em>' + esc(TO || 'cậu') + '</em> được quan tâm', bars: 2, mood: 'happy', fx: { petals: 1.2 } },

      { say: 'tớ xin gửi cậu bốn lời chúc nhé', bars: 1.5, mood: 'wave', bg: 2 },
      { scene: 'health', mode: 'side', say: 'chúc cậu thật nhiều <em>sức khỏe</em> — để luôn an lành và theo đuổi đam mê', bars: 2.4, mood: 'talk', bg: 1, fx: { meteor: .6 } },
      { scene: 'peace', say: 'chúc cậu <em>bình yên</em> — dù ngoài kia cuộc sống có hối hả thế nào', bars: 2.2, mood: 'talk', bg: 1 },
      { scene: 'free', say: 'chúc cậu đủ <em>tự do</em> để làm điều mình thích, và đủ dũng cảm để mỉm cười mỗi ngày', bars: 2.5, mood: 'talk', bg: 0, fx: { lantern: 1, meteor: .8 } },
      { scene: 'love', say: 'chúc cậu luôn được <em>yêu thương</em> — thật trọn vẹn, chân thành, và ấm áp nhất', bars: 2.5, mood: 'happy', bg: 2, fx: { hearts: 1.2, petals: .4 } },

      { scene: 'none', mode: 'hero', say: 'cậu không cần phải luôn hoàn hảo đâu', bars: 1.6, mood: 'talk', fx: { petals: .8 } },
      { say: 'cậu đẹp ở nụ cười, ở sự nỗ lực, và ở sự dịu dàng vốn có', bars: 2.4, mood: 'shy' },

      { scene: 'gift', mode: 'side', say: 'tớ tặng cậu bó hoa này nè 💐', bars: 1.8, mood: 'happy', bg: 3, fx: { petals: 1.2, meadow: 1.2 } },
      { say: 'loài hoa tượng trưng cho sự trân trọng và những điều tốt đẹp nhất', bars: 2.4, mood: 'talk' },

      { scene: 'question', mode: 'hero', say: 'cho tớ hỏi một câu thôi nhé…<br>hôm nay cậu đã <em>khen bản thân</em> chưa?', bars: 2, mood: 'wink', bg: 2, fx: { petals: .4, meteor: 1 }, wait: true, reveal: ['q1'] },
      { scene: 'final', mode: 'side', say: '', mood: 'happy', bg: 3, fx: { fire: 2.2, petals: 1.2, meadow: 1.5 }, wait: true, final: true }
    ];
  }

  let S = buildScript();

  /* ================= TRẠNG THÁI ================= */
  const nu = $('#nu'), bgls = $$('.bgl'), line = $('#line'), bubble = $('#bubble'), hint = $('#hint'), prog = $('#prog');
  let idx = -1, timer = null, started = false, curScene = null, waiting = false, lock = 0, talkT = null;
  let fxS = { petals: 0, hearts: 0, lantern: 0, fire: 0, meteor: 1, meadow: .6 };

  function mood(m) { nu.className = (m || ''); }
  function talk(on) { clearTimeout(talkT); nu.classList.toggle('talk', on); if (on) talkT = setTimeout(() => nu.classList.remove('talk'), 1500); }

  function say(html) {
    bubble.classList.toggle('empty', !html);
    line.innerHTML = html || '';
    let k = 0;
    (function walk(n) {
      [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (!p.trim()) { f.append(p); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = p; s.style.animationDelay = (k++ * 55) + 'ms'; f.append(s);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    })(line);
  }

  function showScene(name) {
    if (name === undefined) return;
    const next = name === 'none' ? null : $('#sc-' + name);
    if (next === curScene) return;
    if (curScene) { curScene.classList.remove('on'); }
    const old = curScene; curScene = next;
    if (old) setTimeout(() => { if (old !== curScene) $$('.rv.on,.node.on,.edge.on,.lbl.on', old).forEach(e => e.classList.remove('on')); }, 800);
    if (next) setTimeout(() => { if (curScene === next) next.classList.add('on'); }, old ? 420 : 60);
  }

  function countTo(el, to, ms) {
    const t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  }

  function go(n) {
    clearTimeout(timer);
    if (n >= S.length) return;
    idx = n; const st = S[n]; document.body.classList.toggle('bloom', !!st.final);
    if (st.mode) { document.body.classList.toggle('m-side', st.mode === 'side'); document.body.classList.toggle('m-hero', st.mode === 'hero'); }
    if (st.bg !== undefined) bgls.forEach((e, k) => e.classList.toggle('on', k === st.bg));
    if (st.fx) {
      fxS = Object.assign({ petals: 0, hearts: 0, lantern: 0, fire: 0, meteor: 1, meadow: .6 }, st.fx);
      parts.forEach(p => { if ((p.t === 'lantern' && !fxS.lantern) || (p.t === 'heart' && !fxS.hearts)) p.kill = true; });
    }
    showScene(st.scene);
    if (st.mood !== undefined) { const talking = nu.classList.contains('talk'); mood(st.mood); if (talking) nu.classList.add('talk'); }
    say(st.say);
    talk(!!st.say);
    if (st.reveal) st.reveal.forEach((id, j) => setTimeout(() => { const e = document.getElementById(id); if (e) e.classList.add('on'); }, (st.scene ? 650 : 0) + j * 260));
    if (st.on) st.on();
    prog.style.width = ((n + 1) / S.length * 100) + '%';
    hint.classList.toggle('on', n >= 1 && n <= 4);
    waiting = !!st.wait;
    const skipBtn = $('#btn-skip-final');
    if (skipBtn) skipBtn.hidden = !!st.final;
    if (st.final) setupFinal();
  }

  const btnSkip = $('#btn-skip-final');
  if (btnSkip) {
    btnSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      $$('.rv.on,.node.on,.edge.on,.lbl.on').forEach(el => el.classList.remove('on'));
      if (curScene) { curScene.classList.remove('on'); curScene = null; }
      go(S.length - 1);
    });
  }

  function next() { const now = Date.now(); if (now - lock < 380) return; lock = now; if (!waiting && idx < S.length - 1) go(idx + 1); }

  /* ================= TƯƠNG TÁC CHẠM & CLICK RIPPLE ================= */
  document.addEventListener('click', e => {
    createRipple(e.clientX, e.clientY);
    spawnBurst(e.clientX, e.clientY);

    if (!started) return;
    if (e.target.closest('.ui,button,input,textarea,a,.envelope-box,#modal-creator')) return;
    next();
  });

  document.addEventListener('keydown', e => {
    if (started && (e.key === ' ' || e.key === 'ArrowRight') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault(); next();
    }
  });

  function createRipple(x, y) {
    const rip = document.createElement('div'); rip.className = 'click-ripple';
    rip.style.left = x + 'px'; rip.style.top = y + 'px';
    rip.style.background = ['rgba(255,122,184,.8)', 'rgba(255,217,138,.8)', 'rgba(183,155,255,.8)'][Math.floor(Math.random() * 3)];
    rip.style.boxShadow = '0 0 16px ' + rip.style.background;
    document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 800);
  }

  function spawnBurst(x, y) {
    const n = 12;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * 6.28;
      const spd = 60 + Math.random() * 160;
      const hue = [330, 45, 280, 160, 210][(Math.random() * 5) | 0];
      parts.push({
        t: 'spark', x, y,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        life: 0.8 + Math.random() * 0.5,
        hue: hue
      });
    }
  }

  /* ================= CÂU HỎI TƯƠNG TÁC ================= */
  let answered = false;
  function answerQuestion(ans){
    if(answered) return;
    answered = true;
    waiting = false;
    const q1 = $('#q1');
    if (q1) q1.classList.remove('on');
    mood('happy'); talk(true);
    if (ans === 'yes') {
      say('giỏi quá! cứ khen thật nhiều vào nhé — cậu xứng đáng được nâng niu mà 💖');
    } else {
      say('vậy để tớ khen giúp: cậu <em>mạnh mẽ</em> hơn cậu nghĩ, <em>dịu dàng</em> hơn cậu tưởng, và luôn rất tuyệt vời!');
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      $$('.rv.on,.node.on,.edge.on,.lbl.on').forEach(el=>el.classList.remove('on'));
      if(curScene){curScene.classList.remove('on'); curScene=null;}
      go(S.length - 1);
    }, 2500);
  }

  $('#q1').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) {
      e.stopPropagation();
      answerQuestion(b.dataset.a);
    }
  });

  $$('#q1 button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      answerQuestion(btn.dataset.a);
    });
    btn.addEventListener('touchend', e => {
      e.stopPropagation();
      answerQuestion(btn.dataset.a);
    });
  });

  /* ================= MÀN KẾT THÚC & PHONG BÌ 3D ================= */
  const envBox = $('#gift-envelope');

  function setupFinal() {
    const to = TO || 'người phụ nữ tuyệt vời';
    const from = FROM || 'Người luôn yêu mến bạn';
    const customMsg = MSG || WISH_TEMPLATES[REL] || WISH_TEMPLATES.crush;

    $('#f-to').textContent = to;
    $('#f-msg').textContent = customMsg;
    $('#f-from').textContent = from;
    $('#hyou-text').textContent = TO ? 'và ' + TO + ' nữa' : 'và cậu nữa';

    // Khởi động pháo hoa rực rỡ
    fireworksBurst();
  }

  envBox.addEventListener('click', (e) => {
    if (e.target.closest('button, input, textarea, a')) return;
    if (!envBox.classList.contains('opened')) {
      envBox.classList.add('opened');
      fireworksBurst();
      showToast('✨ Thiệp mừng đã được mở! Chúc bạn ngày 20/10 ngập tràn hạnh phúc 🌸');
    }
  });

  function fireworksBurst() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => { spawn('fire'); spawn('fire'); }, i * 350);
    }
  }

  /* Thả tim */
  let heartCount = 0;
  $('#b-heart').addEventListener('click', (e) => {
    e.stopPropagation();
    heartCount++;
    $('#heart-count').textContent = heartCount;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top;

    for (let i = 0; i < 6; i++) {
      parts.push({
        t: 'heart',
        x: cx + (Math.random() - 0.5) * 50,
        y: cy,
        vx: (Math.random() - 0.5) * 60,
        vy: -(90 + Math.random() * 90),
        r: 0, vr: 0,
        s: 0.35 + Math.random() * 0.35,
        ph: Math.random() * 6.28,
        sp: SP.heart,
        a: 1
      });
    }
  });

  /* Chép link */
  $('#b-link').addEventListener('click', (e) => {
    e.stopPropagation();
    const u = new URL(location.href);
    u.search = '';
    if (TO) u.searchParams.set('to', TO);
    if (FROM) u.searchParams.set('from', FROM);
    if (REL) u.searchParams.set('rel', REL);
    if (MSG) u.searchParams.set('msg', MSG);

    const textToCopy = u.toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Đã sao chép link thiệp thành công! Hãy gửi qua Zalo/Messenger 💌');
      }).catch(() => prompt('Sao chép liên kết:', textToCopy));
    } else {
      prompt('Sao chép liên kết:', textToCopy);
    }
  });

  /* Xem lại */
  $('#b-replay').addEventListener('click', (e) => {
    e.stopPropagation();
    $$('.rv.on,.node.on,.edge.on,.lbl.on').forEach(e => e.classList.remove('on'));
    if (curScene) { curScene.classList.remove('on'); curScene = null; }
    envBox.classList.remove('opened');
    setTimeout(() => go(0), 300);
  });

  /* ================= MODAL TẠO THIỆP RIÊNG ================= */
  const modalCreator = $('#modal-creator');
  const btnOpenCreator = $('#btn-open-creator');
  const btnCreateNow = $('#b-create-now');
  const btnCloseModal = $('#btn-close-modal');
  const relPills = $$('.rel-pill');
  const inpTo = $('#inp-to');
  const inpFrom = $('#inp-from');
  const inpMsg = $('#inp-msg');
  const btnCopyGift = $('#btn-copy-gift');
  const btnPreviewGift = $('#btn-preview-gift');

  function openCreatorModal() {
    inpTo.value = TO || '';
    inpFrom.value = FROM || '';
    inpMsg.value = MSG || WISH_TEMPLATES[REL] || WISH_TEMPLATES.crush;

    relPills.forEach(p => p.classList.toggle('active', p.dataset.rel === REL));
    modalCreator.classList.add('open');
  }

  function closeCreatorModal() {
    modalCreator.classList.remove('open');
  }

  btnOpenCreator.addEventListener('click', (e) => { e.stopPropagation(); openCreatorModal(); });
  btnCreateNow.addEventListener('click', (e) => { e.stopPropagation(); openCreatorModal(); });
  btnCloseModal.addEventListener('click', closeCreatorModal);
  modalCreator.addEventListener('click', (e) => { if (e.target === modalCreator) closeCreatorModal(); });

  relPills.forEach(pill => {
    pill.addEventListener('click', () => {
      relPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const selectedRel = pill.dataset.rel;
      REL = selectedRel;
      inpMsg.value = WISH_TEMPLATES[selectedRel] || '';
    });
  });

  btnCopyGift.addEventListener('click', () => {
    TO = inpTo.value.trim();
    FROM = inpFrom.value.trim();
    MSG = inpMsg.value.trim();

    const u = new URL(location.href);
    u.search = '';
    if (TO) u.searchParams.set('to', TO);
    if (FROM) u.searchParams.set('from', FROM);
    if (REL) u.searchParams.set('rel', REL);
    if (MSG) u.searchParams.set('msg', MSG);

    const finalUrl = u.toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(finalUrl).then(() => {
        showToast('Đã tạo & sao chép link thành công! Gửi ngay cho người ấy nhé 💌');
        closeCreatorModal();
      }).catch(() => prompt('Sao chép liên kết:', finalUrl));
    } else {
      prompt('Sao chép liên kết:', finalUrl);
      closeCreatorModal();
    }
  });

  btnPreviewGift.addEventListener('click', () => {
    TO = inpTo.value.trim();
    FROM = inpFrom.value.trim();
    MSG = inpMsg.value.trim();

    S = buildScript();
    closeCreatorModal();
    envBox.classList.remove('opened');
    showToast('Đang mở bản xem thử với thông tin mới ✨');

    $$('.rv.on,.node.on,.edge.on,.lbl.on').forEach(e => e.classList.remove('on'));
    if (curScene) { curScene.classList.remove('on'); curScene = null; }
    setTimeout(() => go(0), 400);
  });

  /* Toast thông báo */
  let toastT = null;
  function showToast(msg, duration = 3000) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), duration);
  }

  /* ================= ÂM THANH ================= */
  const bgm = $('#bgm');
  const muteBtn = $('#mute');
  let actx = null, an = null, fd = null, avg = 0, dpeak = 0.02;

  function setupAudio() {
    if (location.protocol === 'file:') return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = new AC();
      const src = actx.createMediaElementSource(bgm);
      an = actx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = 0.55;
      src.connect(an); an.connect(actx.destination);
      fd = new Uint8Array(an.frequencyBinCount);
      if (actx.state === 'suspended') actx.resume();
    } catch (err) { an = null; }
  }

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bgm.muted = !bgm.muted;
    muteBtn.classList.toggle('muted', bgm.muted);
    document.body.classList.toggle('music-playing', !bgm.muted && !bgm.paused);
  });

  bgm.addEventListener('play', () => { document.body.classList.add('music-playing'); });
  bgm.addEventListener('pause', () => { document.body.classList.remove('music-playing'); });

  $('#start').addEventListener('click', () => {
    if (started) return; started = true;
    $('#start').classList.add('gone');
    setupAudio();
    bgm.volume = 0.9;
    const pr = bgm.play();
    if (pr && pr.catch) pr.catch(() => { });
    setTimeout(() => go(0), 500);
  });

  /* ================= HIỆU ỨNG NỀN (canvas) ================= */
  const cv = $('#fx'), ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1, stars = [], parts = [], pulse = 0, lastP = -1, acc = { p: 0, h: 0, l: 0, f: 0, m: 0 };

  function spr(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
  function petalSpr(c1, c2) {
    return spr(40, 56, (g, w, h) => {
      const gr = g.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
      g.fillStyle = gr; g.beginPath(); g.moveTo(w / 2, h * 0.96); g.bezierCurveTo(-w * 0.25, h * 0.62, w * 0.08, h * 0.02, w / 2, 0); g.bezierCurveTo(w * 0.92, h * 0.02, w * 1.25, h * 0.62, w / 2, h * 0.96); g.fill();
    });
  }

  const SP = {
    petal: [petalSpr('#ff7ab8', '#ffe3f0'), petalSpr('#ffb347', '#fff0c4'), petalSpr('#9b6bff', '#eadfff')],
    heart: spr(48, 44, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffc2dd'); gr.addColorStop(1, '#ff5f9a'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(w / 2, h * 0.95); g.bezierCurveTo(-w * 0.2, h * 0.55, w * 0.12, -h * 0.1, w / 2, h * 0.28); g.bezierCurveTo(w * 0.88, -h * 0.1, w * 1.2, h * 0.55, w / 2, h * 0.95); g.fill();
    }),
    lantern: spr(64, 84, (g, w, h) => {
      const r = g.createRadialGradient(w / 2, h * 0.5, 2, w / 2, h * 0.5, w / 2); r.addColorStop(0, 'rgba(255,200,120,.7)'); r.addColorStop(1, 'rgba(255,160,90,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h);
      const gr = g.createLinearGradient(0, h * 0.25, 0, h * 0.75); gr.addColorStop(0, '#fff0b8'); gr.addColorStop(1, '#ff9a58'); g.fillStyle = gr;
      g.beginPath(); g.moveTo(w * 0.34, h * 0.24); g.quadraticCurveTo(w * 0.14, h * 0.5, w * 0.3, h * 0.74); g.lineTo(w * 0.7, h * 0.74); g.quadraticCurveTo(w * 0.86, h * 0.5, w * 0.66, h * 0.24); g.closePath(); g.fill();
      g.fillStyle = '#ffd9a0'; g.fillRect(w * 0.32, h * 0.2, w * 0.36, h * 0.05); g.fillStyle = '#e07a3c'; g.fillRect(w * 0.32, h * 0.74, w * 0.36, h * 0.04);
    })
  };

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.min(240, Math.round(W * H / 6500)); stars = [];
    for (let i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + 0.4, t: Math.random() * 6.28, s: 0.6 + Math.random() * 1.6, h: Math.random() < 0.25 ? 330 : Math.random() < 0.5 ? 210 : 45 });
  }
  addEventListener('resize', resize); resize();

  let mdw = 0.6; const BL = [];
  function blades() {
    BL.length = 0; const n = Math.round(W / 5);
    for (let i = 0; i < n; i++) BL.push({ x: i / n * W + Math.random() * 4, h: (0.04 + Math.random() * 0.08) * H * (0.55 + 0.9 * Math.pow(Math.sin(i / n * 9 + 1), 2)), ph: Math.random() * 6.28, w: 1 + Math.random() * 1.2, hue: [160, 175, 190, 95, 55, 320][(Math.random() * 6) | 0] });
  }
  blades(); addEventListener('resize', blades);

  function spawn(type) {
    const R = Math.random;
    if (type === 'petal') parts.push({ t: 'petal', x: R() * W, y: -30, vx: -10 + R() * 30, vy: 40 + R() * 55, r: R() * 6.28, vr: (R() - 0.5) * 3, s: 0.35 + R() * 0.45, ph: R() * 6.28, sp: SP.petal[(R() * 3) | 0], a: 1 });
    else if (type === 'heart') parts.push({ t: 'heart', x: R() * W, y: H + 20, vx: (R() - 0.5) * 30, vy: -(50 + R() * 60), r: 0, vr: 0, s: 0.25 + R() * 0.45, ph: R() * 6.28, sp: SP.heart, a: 0.9 });
    else if (type === 'lantern') parts.push({ t: 'lantern', x: R() * W, y: H + 50, vx: (R() - 0.5) * 14, vy: -(24 + R() * 28), r: 0, vr: 0, s: 0.5 + R() * 0.7, ph: R() * 6.28, sp: SP.lantern, a: 0.95 });
    else if (type === 'meteor') { const x = W * (0.3 + R() * 0.7), y = R() * H * 0.35; parts.push({ t: 'meteor', x, y, vx: -(380 + R() * 220), vy: 150 + R() * 100, life: 1 }); }
    else if (type === 'fire') {
      const cx = W * (0.15 + R() * 0.7), cy = H * (0.12 + R() * 0.45), hue = [330, 45, 280, 180, 210][(R() * 5) | 0], n = 45;
      for (let i = 0; i < n; i++) { const a = i / n * 6.283 + R() * 0.2, v = 100 + R() * 150; parts.push({ t: 'spark', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1.1, hue }); }
    }
  }

  let lastT = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    let target = 0;
    if (an && fd && !bgm.paused) {
      an.getByteFrequencyData(fd);
      const lvl = (fd[0] + fd[1] + fd[2] + fd[3]) / (4 * 255);
      avg += (lvl - avg) * Math.min(1, dt * 3.2);
      const d = lvl - avg; dpeak = Math.max(dpeak * Math.pow(0.6, dt), d, 0.02);
      target = Math.min(1, Math.max(0, d / dpeak)); target *= target;
    } else if (started) {
      const bp = BEAT / 1000; target = Math.max(0, 1 - (((now / 1000) % bp) / bp) * 3);
    }
    if (!bgm.paused) {
      const ph = (((bgm.currentTime * 1000 - OFF) % BEAT) + BEAT) % BEAT / BEAT;
      target = Math.max(target, Math.pow(Math.max(0, 1 - ph * 2.4), 2) * 0.65);
    }
    pulse = Math.max(pulse * Math.pow(0.02, dt), target); if (pulse > 1) pulse = 1;
    if (Math.abs(pulse - lastP) > 0.03) { lastP = pulse; document.documentElement.style.setProperty('--p', pulse.toFixed(2)); }

    ctx.clearRect(0, 0, W, H);

    /* vẽ sao lấp lánh */
    for (const s of stars) {
      s.t += dt * s.s; const a = 0.35 + 0.45 * Math.abs(Math.sin(s.t)) + pulse * 0.25;
      ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = 'hsl(' + s.h + ',90%,88%)';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (1 + pulse * 0.35), 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ngọn cỏ neon lung linh */
    mdw += (fxS.meadow - mdw) * Math.min(1, dt * 1.6);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; const tm = now / 1000;
    for (const b of BL) {
      const sw = Math.sin(tm * 1.2 + b.ph + b.x * 0.004) * (5 + b.h * 0.12) + Math.sin(tm * 0.5 + b.x * 0.01) * 4, h = b.h * mdw;
      ctx.strokeStyle = 'hsla(' + b.hue + ',95%,60%,' + (0.5 + pulse * 0.35) + ')'; ctx.lineWidth = b.w;
      ctx.beginPath(); ctx.moveTo(b.x, H); ctx.quadraticCurveTo(b.x + sw * 0.3, H - h * 0.6, b.x + sw, H - h); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    /* tạo các hạt theo nhịp */
    acc.p += dt * fxS.petals * 7; while (acc.p >= 1) { acc.p--; spawn('petal'); }
    acc.h += dt * fxS.hearts * 4; while (acc.h >= 1) { acc.h--; spawn('heart'); }
    acc.l += dt * fxS.lantern * 1.5; while (acc.l >= 1) { acc.l--; spawn('lantern'); }
    acc.f += dt * fxS.fire * 1.2; while (acc.f >= 1) { acc.f--; spawn('fire'); }
    acc.m += dt * fxS.meteor * 0.25; while (acc.m >= 1) { acc.m--; spawn('meteor'); }
    if (parts.length > 450) parts.splice(0, parts.length - 450);

    /* cập nhật & vẽ hạt */
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.t === 'meteor') {
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.1;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        const g = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 0.16, p.y - p.vy * 0.16);
        g.addColorStop(0, 'rgba(255,255,255,' + p.life + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.16, p.y - p.vy * 0.16); ctx.stroke(); continue;
      }
      if (p.t === 'spark') {
        p.vy += 85 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.985; p.life -= dt * 0.75;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = 'hsl(' + p.hue + ',100%,70%)'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 6.283); ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; continue;
      }
      if (p.kill) { p.a -= dt * 0.9; if (p.a <= 0) { parts.splice(i, 1); continue; } }
      p.ph += dt * 2; p.x += (p.vx + Math.sin(p.ph) * 22) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
      if (p.y > H + 60 || p.y < -90) { parts.splice(i, 1); continue; }
      const sc = p.s * (1 + (p.t === 'heart' ? pulse * 0.12 : 0)), w = p.sp.width * sc, h = p.sp.height * sc;
      ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x, p.y); ctx.rotate(p.r);
      if (p.t === 'petal') ctx.scale(Math.abs(Math.cos(p.ph)) * 0.7 + 0.3, 1);
      ctx.drawImage(p.sp, -w / 2, -h / 2, w, h); ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.__go = go;
  document.addEventListener('visibilitychange', () => { if (started && !document.hidden && bgm.paused && !bgm.muted) bgm.play().catch(() => { }); });

  // Tự động mở xem thử nếu có tham số URL
  if (TO || FROM || MSG) {
    setupFinal();
  }
})();
