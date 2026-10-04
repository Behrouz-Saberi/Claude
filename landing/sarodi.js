/* Sarodi landing: i18n hero, word-by-word reveal, video card, and the product widgets (demo room, models, form). */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = (n) => String(n).replace(/\d/g, (d) => FA_DIGITS[d]);

  /* ------------------------------------------------------------------ copy */
  const COPY = {
    fa: {
      dir: 'rtl',
      navLabel: 'منوی اصلی', menuLabel: 'باز کردن منو', barsLabel: 'بخش‌های ویدیو',
      navHome: 'خانه', navModels: 'مدل‌ها', navInstall: 'نصب', navDealers: 'نمایندگی', navCta: 'استعلام قیمت',
      h1: [['یک', 'لمس،'], ['همهٔ', 'خانه'], ['روشن.']],
      tagline: [['کلید', 'لمسی', 'شیشه‌ای', 'Wi-Fi'], ['برای', 'خانه‌ای', 'هوشمندتر،', 'بدون', 'تغییر'], ['سیم‌کشی', 'و', 'بدون', 'هاب.']],
      explore: [['مدل‌ها', 'را', 'ببینید']],
      caption: [['خانه', 'را', 'از', 'هر', 'جا'], ['با', 'یک', 'لمس', 'کنترل', 'کنید']],
      latest: [['برای'], ['هر'], ['خانه']],
      cards: ['آپارتمان', 'ویلا', 'پروژه‌های ساختمانی'],
      partLabel: (i) => 'بخش ' + toFa(i + 1),
    },
    en: {
      dir: 'ltr',
      navLabel: 'Main', menuLabel: 'Open menu', barsLabel: 'Video chapters',
      navHome: 'HOME', navModels: 'MODELS', navInstall: 'INSTALL', navDealers: 'DEALERS', navCta: 'GET A QUOTE',
      h1: [['ONE', 'TOUCH,'], ['WHOLE', 'HOME'], ['ALIGHT.']],
      tagline: [['GLASS', 'TOUCH', 'WI-FI', 'SWITCHES'], ['FOR', 'A', 'SMARTER', 'HOME,', 'NO', 'REWIRING'], ['AND', 'NO', 'HUB.']],
      explore: [['EXPLORE', 'MODELS']],
      caption: [['Control', 'your', 'home'], ['from', 'anywhere']],
      latest: [['FOR'], ['EVERY'], ['Home']],
      cards: ['Apartments', 'Villas', 'Building projects'],
      partLabel: (i) => 'Part ' + (i + 1),
    },
  };

  /* Each block: per-line base delay, per-word step, duration (seconds). */
  const TIMING = {
    h1: { lineDelays: [0.55, 0.75, 0.95], step: 0.08, dur: 1 },
    tagline: { start: 1.15, step: 0.06, dur: 0.7 },
    explore: { start: 1.85, step: 0.06, dur: 0.8 },
    caption: { start: 2.15, step: 0.06, dur: 0.7 },
    latest: { lineDelays: [0, 0.15, 0.3], step: 0.05, dur: 0.9 },
  };

  function wordDelay(timing, lineIndex, wordIndex, runningIndex) {
    if (timing.lineDelays) return timing.lineDelays[lineIndex] + wordIndex * timing.step;
    return timing.start + runningIndex * timing.step;
  }

  function renderWords(el, lines, timing) {
    const frag = document.createDocumentFragment();
    let running = 0;
    lines.forEach((words, li) => {
      const line = document.createElement('span');
      line.className = 'ln';
      words.forEach((word, wi) => {
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = word;
        w.style.setProperty('--delay', wordDelay(timing, li, wi, running).toFixed(2) + 's');
        w.style.setProperty('--dur', timing.dur + 's');
        line.appendChild(w);
        if (wi < words.length - 1) line.appendChild(document.createTextNode(' '));
        running += 1;
      });
      frag.appendChild(line);
    });
    el.replaceChildren(frag);
  }

  /* ------------------------------------------------------------ language */
  const page = $('#page');
  const hero = $('#hero');
  let lang = 'fa';

  function applyLang(next, replay) {
    lang = next;
    const t = COPY[lang];
    page.setAttribute('lang', lang);
    page.setAttribute('dir', t.dir);
    document.documentElement.setAttribute('lang', lang);
    $$('[data-i18n]').forEach((el) => { el.textContent = t[el.dataset.i18n]; });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t[el.dataset.i18nAria]));
    $$('[data-words]').forEach((el) => renderWords(el, t[el.dataset.words], TIMING[el.dataset.words]));
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('#cards .card-label').forEach((s, i) => { s.textContent = t.cards[i]; });
    $$('#bars .bar').forEach((b, i) => b.setAttribute('aria-label', t.partLabel(i)));
    if (replay) {
      hero.classList.remove('anim');
      void hero.offsetWidth; // restart the word animation on language switch
      hero.classList.add('anim');
      latestHeading.classList.add('in');
    }
  }

  /* -------------------------------------------------------- panel glyphs */
  const ring = '<circle class="ring" cx="24" cy="24" r="20.5" fill="none" stroke="currentColor" stroke-width="2"/>';
  const svg48 = (inner) => '<svg viewBox="0 0 48 48" aria-hidden="true">' + ring + '<g class="glyph">' + inner + '</g></svg>';
  const GLYPH = {
    l: (k) => svg48('<path fill="currentColor" transform="rotate(' + k.r + ' 24 24)" d="M24 24 L24 15 A9 9 0 1 1 15 24 Z"/>'),
    f: (k) => {
      let blades = '';
      for (let i = 0; i < k.n; i += 1) blades += '<ellipse cx="24" cy="15.8" rx="3.4" ry="6.2" fill="currentColor" transform="rotate(' + (i * 360 / k.n + 18) + ' 24 24)"/>';
      return svg48(blades + '<circle cx="24" cy="24" r="2.8" fill="currentColor"/>');
    },
    p: () => svg48('<circle cx="24" cy="25" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 17.5C24 13 27 11 30 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="25" r="2.6" fill="currentColor"/>'),
    c: (k) => svg48({
      open: '<polygon points="19,24 13,20 13,28" fill="currentColor"/><polygon points="29,24 35,20 35,28" fill="currentColor"/>',
      stop: '<rect x="19" y="18" width="3" height="12" rx="1" fill="currentColor"/><rect x="26" y="18" width="3" height="12" rx="1" fill="currentColor"/>',
      close: '<polygon points="22.5,24 16.5,20 16.5,28" fill="currentColor"/><polygon points="25.5,24 31.5,20 31.5,28" fill="currentColor"/>',
    }[k.k]),
  };
  const fanIcon = (n, ry) => '<svg viewBox="0 0 24 24"><g fill="currentColor">' + Array.from({ length: n }, (_, i) => '<ellipse cx="12" cy="7.4" rx="2.3" ry="' + ry + '" transform="rotate(' + (i * 360 / n + 20) + ' 12 12)"/>').join('') + '</g></svg>';
  const TERM_ICON = {
    fan: fanIcon(4, 3.8),
    prop: fanIcon(3, 4.2),
    drop: '<svg viewBox="0 0 24 24"><path d="M12 4C9 9 7.5 11.5 7.5 14a4.5 4.5 0 0 0 9 0c0-2.5-1.5-5-4.5-10z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  };

  const L = (r) => ({ t: 'l', r });
  const MODELS = {
    g1: { name: 'تک‌پل', use: 'یک مدار', title: 'کلید تک‌پل', desc: 'برای اتاقی که یک مدار روشنایی دارد: اتاق خواب، سرویس بهداشتی یا انباری.', layout: 'row', keys: [L(45)], term: ['', 'L1', '', '', 'L', 'N'] },
    g2: { name: 'دوپل', use: 'دو مدار', title: 'کلید دوپل', desc: 'دو مدار در یک قاب؛ مثلاً لوستر و نور مخفی سقف.', layout: 'row', keys: [L(-45), L(135)], term: ['L2', '', 'L1', '', 'L', 'N'] },
    g3: { name: 'سه‌پل', use: 'سه مدار', title: 'کلید سه‌پل', desc: 'برای پذیرایی و نشیمن با چند خط روشنایی.', layout: 'row', keys: [L(-45), L(45), L(135)], term: ['L3', 'L2', 'L1', '', 'L', 'N'] },
    g4: { name: 'چهارپل', use: 'چهار مدار', title: 'کلید چهارپل', desc: 'چهار مدار در یک قاب ۸۶ در ۸۶؛ برای فضاهای باز و آشپزخانه‌های اپن.', layout: 'grid', keys: [L(-45), L(45), L(-135), L(135)], term: ['L3', 'L2', 'L1', 'L0', 'L', 'N'] },
    curtain: { name: 'پرده', use: 'باز، توقف، بستن', title: 'کلید پرده', desc: 'باز کردن، توقف و بستن موتور پردهٔ برقی، از روی دیوار یا از اپ.', layout: 'row', exclusive: true, keys: [{ t: 'c', k: 'open', a: 'باز کردن پرده' }, { t: 'c', k: 'stop', a: 'توقف' }, { t: 'c', k: 'close', a: 'بستن پرده' }], term: ['Close', '', 'Open', '', 'L', 'N'] },
    cooler: { name: 'کولر آبی', use: 'پمپ، کند، تند', title: 'کلید کولر آبی', desc: 'پمپ آب، دور کند و دور تند کولر آبی در یک قاب. دو دور هم‌زمان روشن نمی‌شوند.', layout: 'row', keys: [{ t: 'p', a: 'پمپ آب' }, { t: 'f', n: 4, a: 'دور کند', group: 'fan' }, { t: 'f', n: 6, a: 'دور تند', group: 'fan' }], term: ['fan', 'prop', 'drop', '', 'L', 'N'] },
  };

  /** Renders a panel. Interactive panels get buttons; static ones get spans (no nested controls). */
  function buildPanel(el, model, opts = {}) {
    el.innerHTML = '<span class="pmark" aria-hidden="true">sarodi</span>';
    const box = document.createElement('div');
    box.className = 'keys ' + model.layout;
    el.appendChild(box);
    return model.keys.map((k, i) => {
      const on = Boolean(opts.on && opts.on[i]);
      const key = document.createElement(opts.static ? 'span' : 'button');
      key.className = 'key';
      key.innerHTML = GLYPH[k.t](k);
      if (opts.static) {
        if (on) key.setAttribute('data-on', '');
      } else {
        key.type = 'button';
        key.setAttribute('aria-pressed', String(on));
        key.setAttribute('aria-label', (opts.labels && opts.labels[i]) || k.a || ('پل ' + toFa(i + 1)));
        key.addEventListener('click', () => {
          const next = key.getAttribute('aria-pressed') !== 'true';
          if (opts.onToggle) { opts.onToggle(i, next); return; }
          const siblings = $$('.key', box);
          siblings.forEach((s, j) => {
            const sameGroup = model.exclusive || (k.group && model.keys[j].group === k.group);
            if (next && sameGroup) s.setAttribute('aria-pressed', 'false');
          });
          key.setAttribute('aria-pressed', String(next));
        });
      }
      box.appendChild(key);
      return key;
    });
  }

  /* ------------------------------------------------- hero media fallbacks */
  function watchImage(img, onFail) {
    if (img.complete && img.naturalWidth === 0) { onFail(); return; }
    img.addEventListener('error', onFail, { once: true });
  }
  watchImage($('#house'), () => hero.classList.add('noimg'));
  buildPanel($('#heroPanel'), MODELS.g4, { static: true, on: [true, false, false, true] });

  /* ---------------------------------------------------- video card */
  const PARTS = 4;
  const FALLBACK_LOOP_S = 10;
  const vcard = $('#vcard');
  const vid = $('#vid');
  const barsEl = $('#bars');
  const miniKeys = buildPanel($('#miniPanel'), MODELS.g4, { static: true });
  let useFallbackClock = false;
  let clockStart = performance.now();

  const bars = Array.from({ length: PARTS }, (_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'bar';
    b.innerHTML = '<i></i>';
    b.addEventListener('click', () => seekPart(i));
    barsEl.appendChild(b);
    return b;
  });

  function currentPart() {
    if (useFallbackClock) {
      const t = ((performance.now() - clockStart) / 1000) % FALLBACK_LOOP_S;
      return Math.min(PARTS - 1, Math.floor(t / (FALLBACK_LOOP_S / PARTS)));
    }
    if (!vid.duration || !isFinite(vid.duration)) return 0;
    return Math.min(PARTS - 1, Math.floor((vid.currentTime / vid.duration) * PARTS));
  }

  function seekPart(i) {
    if (useFallbackClock) {
      clockStart = performance.now() - i * (FALLBACK_LOOP_S / PARTS) * 1000;
    } else if (vid.duration && isFinite(vid.duration)) {
      vid.currentTime = (vid.duration / PARTS) * i + 0.05;
      keepPlaying();
    }
    paintBars();
  }

  let lastPart = -1;
  function paintBars() {
    const p = currentPart();
    if (p === lastPart) return;
    lastPart = p;
    bars.forEach((b, i) => b.setAttribute('aria-current', String(i === p)));
    if (useFallbackClock) miniKeys.forEach((k, i) => k.toggleAttribute('data-on', i <= p));
  }

  function keepPlaying() {
    if (useFallbackClock || !vid.paused) return;
    const attempt = vid.play();
    if (attempt && attempt.catch) attempt.catch(() => { /* autoplay can be refused until a user gesture; retried below */ });
  }

  function switchToFallback() {
    useFallbackClock = true;
    clockStart = performance.now();
    vcard.classList.add('novideo');
  }

  vid.addEventListener('error', switchToFallback);
  ['pause', 'ended', 'stalled'].forEach((ev) => vid.addEventListener(ev, keepPlaying));
  vid.addEventListener('timeupdate', paintBars);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) keepPlaying(); });
  window.addEventListener('pointerdown', keepPlaying, { once: true });
  setInterval(() => { keepPlaying(); paintBars(); }, 1000);
  if (vid.error || vid.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) switchToFallback();

  /* ------------------------------------------------------ "for every home" cards */
  const CARD_IMAGES = [
    'https://cdn.sceneai.art/Bg%20images/c789ac4d-f2c8-463a-93f6-1f8c6fa09f9a.png',
    'https://cdn.sceneai.art/Bg%20images/bf2e3004-db02-48a1-8e15-c6a58c158b5c.png',
    'https://cdn.sceneai.art/Bg%20images/dce07180-2db9-45fe-889a-7a11657c6234.png',
  ];
  const CARD_FALLBACK_MODEL = [MODELS.g3, MODELS.curtain, MODELS.g4];
  const cardsEl = $('#cards');
  CARD_IMAGES.forEach((src, i) => {
    const card = document.createElement('figure');
    card.className = 'card armed-card';
    card.style.margin = '0';
    card.style.setProperty('--delay', [0.2, 0.35, 0.5][i] + 's');
    card.innerHTML = '<div class="ph"><img loading="lazy" decoding="async" alt="" width="790" height="1000"><div class="panel" aria-hidden="true"></div></div><figcaption class="card-label"></figcaption>';
    const img = $('img', card);
    watchImage(img, () => card.classList.add('noimg'));
    img.src = src;
    buildPanel($('.panel', card), CARD_FALLBACK_MODEL[i], { static: true, on: [true, false, true, false] });
    cardsEl.appendChild(card);
  });

  const latestHeading = $('#latest-h');
  latestHeading.classList.add('armed');
  applyLang('fa', false);

  /* --------------------------------------------------- header behaviour */
  $$('.lang button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang, true); }));
  const burger = $('#burger');
  const menu = $('#menu');
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    $('use', burger).setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });

  /* ------------------------------------------------------ demo room */
  const ZONES = ['هالوژن‌های سقف', 'نور مخفی', 'دیوارکوب تابلو', 'آباژور'];
  const ZONE_DIM_START = 0.55;
  const ZONE_DIM_STEP = 0.11;
  let lights = [true, true, false, false];
  const legend = $('#legend');
  const demoKeys = buildPanel($('#demoPanel'), MODELS.g4, { labels: ZONES, on: lights, onToggle: (i, on) => setLight(i, on) });
  function paintRoom() {
    lights.forEach((on, i) => {
      demoKeys[i].setAttribute('aria-pressed', String(on));
      $('#z' + (i + 1)).classList.toggle('on', on);
    });
    const count = lights.filter(Boolean).length;
    $('#dim').style.opacity = (ZONE_DIM_START - count * ZONE_DIM_STEP).toFixed(2);
    legend.innerHTML = ZONES.map((z, i) => '<span class="' + (lights[i] ? 'on' : '') + '"><i></i>' + z + (lights[i] ? ' روشن' : ' خاموش') + '</span>').join('');
  }
  function setLight(i, on) { lights = lights.map((v, j) => (j === i ? on : v)); paintRoom(); }
  paintRoom();

  /* ---------------------------------------------------------- models */
  const gallery = $('#gallery');
  const mPanel = $('#mPanel');
  const cards = {};
  let finish = 'black';
  let current = 'g4';
  Object.keys(MODELS).forEach((id) => {
    const m = MODELS[id];
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'mcard';
    c.id = 'tab-' + id;
    c.setAttribute('role', 'tab');
    c.setAttribute('aria-controls', 'mdetail');
    c.innerHTML = '<div class="panel" aria-hidden="true"></div><b>' + m.name + '</b><span>' + m.use + '</span>';
    buildPanel($('.panel', c), m, { static: true });
    c.addEventListener('click', () => showModel(id));
    gallery.appendChild(c);
    cards[id] = c;
  });
  gallery.addEventListener('keydown', (e) => {
    const ids = Object.keys(MODELS);
    let i = ids.indexOf(current);
    if (e.key === 'ArrowLeft') i = (i + 1) % ids.length;
    else if (e.key === 'ArrowRight') i = (i - 1 + ids.length) % ids.length;
    else return;
    e.preventDefault();
    showModel(ids[i]);
    cards[ids[i]].focus();
  });
  function showModel(id) {
    current = id;
    const m = MODELS[id];
    buildPanel(mPanel, m, {});
    mPanel.classList.toggle('white', finish === 'white');
    $('#mName').textContent = m.title;
    $('#mDesc').textContent = m.desc;
    $('#term').innerHTML = m.term.map((t) => '<span>' + (TERM_ICON[t] || t) + '</span>').join('');
    $('#mAsk').dataset.model = id;
    Object.keys(cards).forEach((k) => {
      cards[k].setAttribute('aria-selected', String(k === id));
      cards[k].tabIndex = k === id ? 0 : -1;
    });
  }
  showModel('g4');
  $$('.finish button').forEach((b) => b.addEventListener('click', () => {
    finish = b.dataset.c;
    $$('.finish button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('#gallery .panel, #mPanel').forEach((p) => p.classList.toggle('white', finish === 'white'));
  }));

  /* ------------------------------------------------------------ form */
  const pick = $('#pick');
  pick.innerHTML = Object.keys(MODELS).map((id) => '<label><input type="checkbox" id="pk-' + id + '" value="' + id + '"><span>' + MODELS[id].name + '</span></label>').join('');
  $$('[data-role]').forEach((a) => a.addEventListener('click', () => {
    $('#f-role').value = a.dataset.role;
    const box = a.dataset.model && document.getElementById('pk-' + a.dataset.model);
    if (box) box.checked = true;
  }));

  const toLatinDigits = (s) => s
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\s\-()]/g, '');
  function normalizePhone(raw) {
    const p = toLatinDigits(raw);
    if (p.startsWith('+98')) return '0' + p.slice(3);
    if (p.startsWith('98') && p.length === 12) return '0' + p.slice(2);
    return p;
  }
  const fName = $('#f-name');
  const fPhone = $('#f-phone');
  function check(input, errId, ok, message) {
    $('#' + errId).textContent = ok ? '' : message;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  const checkName = () => check(fName, 'e-name', fName.value.trim().length >= 3, 'نام و نام خانوادگی را کامل بنویسید.');
  const checkPhone = () => check(fPhone, 'e-phone', /^09\d{9}$/.test(normalizePhone(fPhone.value)), 'شمارهٔ موبایل ۱۱ رقم است و با ۰۹ شروع می‌شود.');
  fName.addEventListener('blur', () => { if (fName.value) checkName(); });
  fPhone.addEventListener('blur', () => { if (fPhone.value) checkPhone(); });
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameOk = checkName();
    const phoneOk = checkPhone();
    const done = $('#done');
    if (!nameOk || !phoneOk) { done.hidden = true; (nameOk ? fPhone : fName).focus(); return; }
    const picked = $$('input', pick).filter((c) => c.checked).map((c) => MODELS[c.value].name);
    done.hidden = false;
    done.innerHTML = '<svg><use href="#i-check"/></svg><span></span>';
    $('span', done).textContent = 'فرم کامل است' + (picked.length ? ' (مدل‌ها: ' + picked.join('، ') + ')' : '') + '. این صفحه نسخهٔ پیش‌نمایش است؛ در سایت نهایی، درخواست برای کارشناس فروش ارسال می‌شود.';
  });

  /* ------------------------------------- scroll reveals + mobile CTA */
  const mbar = $('#mbar');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const once = (targets, cb, threshold) => {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); }
      }), { threshold });
      targets.forEach((t) => io.observe(t));
    };
    once([latestHeading, ...$$('.armed-card')], (el) => el.classList.add('in'), 0.15);
    const lowBlocks = $$('.rv').filter((el) => el.getBoundingClientRect().top > innerHeight);
    lowBlocks.forEach((el) => el.classList.add('pre'));
    once(lowBlocks, (el) => el.classList.remove('pre'), 0.08);
  } else {
    latestHeading.classList.add('in');
    $$('.armed-card').forEach((c) => c.classList.add('in'));
  }
  if ('IntersectionObserver' in window) {
    let heroVisible = true;
    let formVisible = false;
    const sync = () => mbar.classList.toggle('show', !heroVisible && !formVisible);
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([en]) => { formVisible = en.isIntersecting; sync(); }).observe($('#inquiry'));
  }
})();
