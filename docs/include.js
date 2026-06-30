/* ════════════════════════════════════════════════════
   include.js — loads header.html + footer.html into
   <div id="site-header-include"></div> and
   <div id="site-footer-include"></div>, then wires up
   all header/footer interactivity.
   Add this script tag near the end of <body> on every page:
   <script src="/include.js"></script>
   ════════════════════════════════════════════════════ */

(function () {

  function loadPartial(url, targetId, done) {
    var target = document.getElementById(targetId);
    if (!target) { if (done) done(); return; }
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.text();
      })
      .then(function (html) {
        target.outerHTML = html;
        if (done) done();
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  var headerLoaded = false, footerLoaded = false;

  function checkBothLoaded() {
    if (headerLoaded) initHeader();
    if (footerLoaded) initFooter();
    if (headerLoaded || footerLoaded) initSharedAfterInject();
  }

  loadPartial('/header.html', 'site-header-include', function () {
    headerLoaded = true;
    checkBothLoaded();
  });

  loadPartial('/footer.html', 'site-footer-include', function () {
    footerLoaded = true;
    checkBothLoaded();
  });

  /* ── Header behavior ── */
  function initHeader() {
    var h = document.getElementById('site-header');
    if (h) {
      window.addEventListener('scroll', function () {
        h.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }

    window.toggleMega = function (id, e) {
      if (e) e.preventDefault();
      var li = document.getElementById(id);
      var isOpen = li.classList.contains('open');
      closeAllMega();
      if (!isOpen) {
        li.classList.add('open');
        li.querySelector('.nav-dd-trigger').setAttribute('aria-expanded', 'true');
      }
    };

    function closeAllMega() {
      document.querySelectorAll('.nav-dd-li.open').forEach(function (li) {
        li.classList.remove('open');
        li.querySelector('.nav-dd-trigger').setAttribute('aria-expanded', 'false');
      });
    }
    window._closeAllMega = closeAllMega;

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-dd-li')) closeAllMega();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllMega();
        closeSearch();
        closeDrawer();
      }
    });

    /* Search */
    window.toggleSearch = function () {
      var ov = document.getElementById('search-overlay');
      var btn = document.querySelector('.nav-search-btn');
      var isOpen = ov.classList.contains('open');
      ov.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) setTimeout(function () { document.getElementById('search-input').focus(); }, 50);
      else document.getElementById('search-input').blur();
    };

    function closeSearch() {
      var ov = document.getElementById('search-overlay');
      if (ov) ov.classList.remove('open');
    }
    window.closeSearch = closeSearch;

    var searchOverlay = document.getElementById('search-overlay');
    if (searchOverlay) {
      searchOverlay.addEventListener('click', function (e) {
        if (e.target === e.currentTarget) closeSearch();
      });
    }
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var q = e.target.value.trim();
          if (q) window.location.href = '/?s=' + encodeURIComponent(q);
        }
      });
    }

    /* Mobile drawer */
    window.toggleDrawer = function () {
      var drawer = document.getElementById('mobile-drawer');
      var overlay = document.getElementById('drawer-overlay');
      var btn = document.getElementById('hamburger-btn');
      var isOpen = drawer.classList.contains('open');
      drawer.classList.toggle('open');
      overlay.classList.toggle('open');
      btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    function closeDrawer() {
      var drawer = document.getElementById('mobile-drawer');
      var overlay = document.getElementById('drawer-overlay');
      var btn = document.getElementById('hamburger-btn');
      if (!drawer) return;
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    window.closeDrawer = closeDrawer;

    window.toggleDrawerAcc = function (id) {
      var el = document.getElementById(id);
      var btn = el.querySelector('.drawer-acc-btn');
      var isOpen = el.classList.contains('open');
      el.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    };

    /* Lang keyboard support */
    document.querySelectorAll('.lang-opt').forEach(function (opt) {
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof setLang === 'function') setLang(opt.dataset.lang);
        }
      });
    });
  }

  /* ── Footer behavior ── */
  function initFooter() {
    window.subscribeNewsletter = function () {
      var emailEl = document.getElementById('nl-email');
      var successEl = document.getElementById('nl-success');
      if (!emailEl || !successEl) return;
      var email = emailEl.value.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      successEl.style.display = 'block';
      emailEl.value = '';
    };
  }

  /* ── Shared: active nav highlighting (runs once both/either partial is in the DOM) ── */
  function initSharedAfterInject() {
    var path = window.location.pathname;
    document.querySelectorAll('.main-nav a, .mobile-drawer a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '/' && href === '/')) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

})();
