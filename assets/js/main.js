/* Vidor Photography — működés: nyelvváltás, menü, galéria, videó, űrlap. */
(function () {
  'use strict';

  var CONTENT = window.VP_CONTENT || { galleries: {}, films: {} };
  var I18N = window.VP_I18N || { hu: {}, en: {} };
  var IMAGES = window.VP_IMAGES || {};
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/vidor.gergely@gmail.com';
  var CONTACT_EMAIL = 'vidor.gergely@gmail.com';
  var LANGS = ['hu', 'en'];

  var root = document.documentElement;
  var lang = LANGS.indexOf(root.lang) > -1 ? root.lang : 'hu';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function t(key, vars) {
    var str = (I18N[lang] && I18N[lang][key]) || I18N.hu[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { str = str.split('{' + k + '}').join(vars[k]); });
    return str;
  }
  function pick(obj) { return obj ? (obj[lang] || obj.hu || '') : ''; }

  // Az eredeti képből a webes változatok (srcset). Ha még nincs legenerálva, az eredetit használja.
  function srcsetFor(src) {
    var m = IMAGES[src];
    if (!m) { if (window.console) console.warn('Nincs webes változat, futtasd: python3 tools/build-images.py →', src); return null; }
    return m.sizes.map(function (w) { return m.base + '-' + w + '.webp ' + w + 'w'; }).join(', ');
  }
  function fallbackSrc(src, target) {
    var m = IMAGES[src];
    if (!m) return src;
    var best = m.sizes[0];
    m.sizes.forEach(function (w) { if (w <= target) best = w; });
    return m.base + '-' + best + '.webp';
  }

  /* ---------------- Nyelv ---------------- */
  function applyLang(next, persist) {
    lang = LANGS.indexOf(next) > -1 ? next : 'hu';
    root.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':');
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    document.title = t('meta.title');
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description'));
    $$('.lang__btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });

    var form = $('#contact-form');
    if (form) {
      form.elements.nyelv.value = lang;
      form.elements._subject.value = t('form.subject');
    }
    updateCounts();
    updateMenuLabel();
    if (viewer.key) renderViewer();
    if (persist) { try { localStorage.setItem('vp-lang', lang); } catch (e) {} }
  }

  function updateCounts() {
    $$('[data-count]').forEach(function (el) {
      var g = CONTENT.galleries[el.getAttribute('data-count')];
      el.textContent = g && g.images.length ? ' · ' + t('works.count', { n: g.images.length }) : '';
    });
  }

  $$('.lang__btn').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang'), true); });
  });

  /* ---------------- Mobil menü ---------------- */
  var header = $('.site-header');
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');

  function updateMenuLabel() {
    if (!toggle) return;
    var open = toggle.getAttribute('aria-expanded') === 'true';
    $('.menu-toggle__label', toggle).textContent = t(open ? 'nav.close' : 'nav.menu');
  }
  function setMenu(open) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    updateMenuLabel();
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------------- Közös párbeszédablak-kezelés ---------------- */
  function openDialog(dlg, trigger) {
    dlg._trigger = trigger || document.activeElement;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    root.classList.add('has-dialog');
  }
  function closeDialog(dlg) {
    if (dlg.open && typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }
  function onDialogClosed(dlg, cb) {
    dlg.addEventListener('close', function () {
      root.classList.remove('has-dialog');
      if (cb) cb();
      var tr = dlg._trigger;
      if (tr && typeof tr.focus === 'function') tr.focus();
    });
    $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { closeDialog(dlg); }); });
    // Kattintás a sötét háttérre (a párbeszédablakon kívül) is bezár.
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDialog(dlg); });
  }

  /* ---------------- Galéria ---------------- */
  var viewerEl = $('#viewer');
  var viewer = { key: null, index: -1 };
  var vGrid = $('#viewer-grid'), vSingle = $('#viewer-single'), vImg = $('#viewer-img');
  var vBack = $('#viewer-back'), vMeta = $('#viewer-meta'), vCaption = $('#viewer-caption');

  function galleryHasImages(key) {
    var g = CONTENT.galleries[key];
    return !!(g && g.images && g.images.length);
  }

  function renderViewer() {
    var g = CONTENT.galleries[viewer.key];
    if (!g) return;
    $('#viewer-title').textContent = pick(g.title);
    vBack.hidden = viewer.index < 0;
    vGrid.hidden = viewer.index >= 0;
    vSingle.hidden = viewer.index < 0;
    viewerEl.classList.toggle('is-single', viewer.index >= 0);

    if (viewer.index < 0) {
      vMeta.textContent = pick(g.note) + ' · ' + t('works.count', { n: g.images.length });
      vGrid.innerHTML = '';
      // Egységes cellaarány: ha a képek többsége fekvő, 3:2, különben 4:5 (a nagy nézet vágatlan).
      var landscape = g.images.filter(function (img) { var m = IMAGES[img.src]; return m && m.w > m.h; }).length;
      vGrid.style.setProperty('--thumb-ratio', landscape > g.images.length / 2 ? '3 / 2' : '4 / 5');
      g.images.forEach(function (img, i) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'viewer__thumb';
        btn.setAttribute('aria-label', t('viewer.open', { alt: pick(img.alt) }));
        var m = IMAGES[img.src];
        var el = document.createElement('img');
        el.loading = i < 8 ? 'eager' : 'lazy';
        el.decoding = 'async';
        el.alt = '';
        var ss = srcsetFor(img.src);
        if (ss) { el.srcset = ss; el.sizes = '(max-width: 600px) 46vw, (max-width: 1100px) 31vw, 23vw'; }
        el.src = fallbackSrc(img.src, 960);
        if (m) { el.width = m.w; el.height = m.h; }
        btn.appendChild(el);
        btn.addEventListener('click', function () { showImage(i); });
        li.appendChild(btn);
        vGrid.appendChild(li);
      });
    } else {
      var item = g.images[viewer.index];
      var ss2 = srcsetFor(item.src);
      vImg.removeAttribute('srcset');
      vImg.src = fallbackSrc(item.src, 1600);
      if (ss2) { vImg.sizes = '100vw'; vImg.srcset = ss2; }
      vImg.alt = pick(item.alt);
      vCaption.textContent = pick(item.alt);
      vMeta.textContent = t('viewer.position', { i: viewer.index + 1, n: g.images.length });
      preload(g.images[(viewer.index + 1) % g.images.length]);
    }
  }

  function preload(item) {
    if (!item) return;
    var p = new Image();
    var ss = srcsetFor(item.src);
    if (ss) { p.sizes = '100vw'; p.srcset = ss; }
    p.src = fallbackSrc(item.src, 1600);
  }

  function openGallery(key, trigger) {
    if (!galleryHasImages(key)) return false;
    viewer.key = key;
    viewer.index = -1;
    renderViewer();
    openDialog(viewerEl, trigger);
    vGrid.scrollTop = 0;
    $('.viewer__body', viewerEl).scrollTop = 0;
    var first = $('.viewer__thumb', vGrid);
    if (first) first.focus();
    return true;
  }

  function showImage(i) {
    var g = CONTENT.galleries[viewer.key];
    var n = g.images.length;
    viewer.index = ((i % n) + n) % n;
    renderViewer();
    $('#viewer-next').focus({ preventScroll: true });
  }
  function backToGrid() {
    var last = viewer.index;
    viewer.index = -1;
    renderViewer();
    var thumbs = $$('.viewer__thumb', vGrid);
    var target = thumbs[last] || thumbs[0];
    if (target) { target.focus(); target.scrollIntoView({ block: 'nearest' }); }
  }

  if (viewerEl) {
    onDialogClosed(viewerEl, function () {
      viewer.key = null; viewer.index = -1;
      vImg.removeAttribute('src'); vImg.removeAttribute('srcset');
    });
    $('#viewer-prev').addEventListener('click', function () { showImage(viewer.index - 1); });
    $('#viewer-next').addEventListener('click', function () { showImage(viewer.index + 1); });
    vBack.addEventListener('click', backToGrid);
    viewerEl.addEventListener('keydown', function (e) {
      if (viewer.index < 0) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(viewer.index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showImage(viewer.index + 1); }
    });
    // Lapozás húzással érintőképernyőn.
    var sx = null, sy = null;
    vSingle.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    vSingle.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showImage(viewer.index + (dx < 0 ? 1 : -1));
      sx = sy = null;
    });
  }

  // Galéria-indítók: üres galéria nem kattintható.
  $$('[data-gallery]').forEach(function (a) {
    var key = a.getAttribute('data-gallery');
    if (!galleryHasImages(key)) {
      if (a.closest('.work')) a.closest('.work').hidden = true; else a.hidden = true;
      return;
    }
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (openGallery(key, a)) e.preventDefault();
    });
  });

  /* ---------------- Videó ---------------- */
  var playerEl = $('#player');
  var frame = $('#player-frame');

  function openFilm(key, trigger) {
    var f = CONTENT.films[key];
    if (!f || !f.vimeo || !playerEl) return false;
    var title = pick(f.title);
    $('#player-title').textContent = title;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://player.vimeo.com/video/' + encodeURIComponent(f.vimeo) + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0';
    iframe.title = t('films.iframeTitle', { title: title });
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    frame.innerHTML = '';
    frame.appendChild(iframe);
    openDialog(playerEl, trigger);
    $('[data-close]', playerEl).focus();
    return true;
  }
  if (playerEl) {
    // Bezáráskor az iframe törlődik, így a lejátszás azonnal leáll.
    onDialogClosed(playerEl, function () { frame.innerHTML = ''; });
  }
  $$('[data-film]').forEach(function (a) {
    var f = CONTENT.films[a.getAttribute('data-film')];
    if (f && f.vimeo && a.classList.contains('film__play')) a.href = 'https://vimeo.com/' + f.vimeo;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (openFilm(a.getAttribute('data-film'), a)) e.preventDefault();
    });
  });

  /* ---------------- Űrlap ---------------- */
  var form = $('#contact-form');
  if (form) {
    var status = $('#form-status');
    var submit = $('.form__submit', form);
    var submitLabel = $('.form__submit-label', form);
    var checks = [
      { el: form.elements.nev, msg: 'form.errName' },
      { el: form.elements.email, msg: 'form.errEmail' },
      { el: form.elements.uzenet, msg: 'form.errMessage' }
    ];

    function fieldValid(c) {
      var v = c.el.value.trim();
      if (!v) return false;
      if (c.el.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return true;
    }
    function showError(c, on) {
      var err = document.getElementById(c.el.getAttribute('aria-describedby'));
      c.el.setAttribute('aria-invalid', String(on));
      if (err) { err.hidden = !on; err.textContent = on ? t(c.msg) : ''; }
    }
    checks.forEach(function (c) {
      c.el.addEventListener('blur', function () { if (c.el.value) showError(c, !fieldValid(c)); });
      c.el.addEventListener('input', function () { if (c.el.getAttribute('aria-invalid') === 'true' && fieldValid(c)) showError(c, false); });
    });

    // Az üzenetmező egysoros alapállapotból a tartalommal együtt nő.
    var msg = form.elements.uzenet;
    function growMessage() { msg.style.height = 'auto'; msg.style.height = (msg.scrollHeight + 1) + 'px'; }
    msg.addEventListener('input', growMessage);

    function setStatus(type, text, withEmail) {
      status.hidden = false;
      status.className = 'form__status form__status--' + type;
      status.textContent = text;
      if (withEmail) {
        var a = document.createElement('a');
        a.href = 'mailto:' + CONTACT_EMAIL;
        a.textContent = CONTACT_EMAIL;
        status.appendChild(a);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      checks.forEach(function (c) {
        var ok = fieldValid(c);
        showError(c, !ok);
        if (!ok && !firstBad) firstBad = c.el;
      });
      if (firstBad) { firstBad.focus(); return; }
      if (form.elements._honey.value) return; // valószínűleg spam

      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      submitLabel.textContent = t('form.sending');
      status.hidden = true;

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (r) {
          // A FormSubmit aktiválás előtt is 200-at adhat, ezért a "success" mezőt nézzük.
          var ok = r.ok && (r.data.success === true || r.data.success === 'true');
          if (!ok) throw new Error((r.data && r.data.message) || 'FormSubmit error');
          form.reset();
          growMessage();
          form.elements.nyelv.value = lang;
          form.elements._subject.value = t('form.subject');
          setStatus('success', t('form.success'));
          status.focus();
        })
        .catch(function (err) {
          if (window.console) console.warn('Űrlapküldés sikertelen:', err && err.message);
          setStatus('error', t('form.error'), true);
          status.focus();
        })
        .then(function () {
          submit.disabled = false;
          form.removeAttribute('aria-busy');
          submitLabel.textContent = t('form.submit');
        });
    });
  }

  /* ---------------- Apróságok ---------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Finom megjelenés görgetéskor (csak ha a felhasználó nem kért csökkentett mozgást).
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = $$('.section-head, .work, .film, .services__list, .approach__text, .about__photos, .about__text, .contact__intro, .form');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // ami már látszik, azt nem animáljuk
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  applyLang(lang, false);
})();
