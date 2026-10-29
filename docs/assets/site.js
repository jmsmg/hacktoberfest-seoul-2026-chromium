// 테마 전환 · 코드 복사 · 이슈 카드 난이도 거르기 · 목차 현재 위치 표시
(function () {
  var root = document.documentElement;

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = !root.classList.contains('dark');
      root.classList.toggle('dark', dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* 저장 못 해도 이번 화면은 바뀐다 */ }
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }
  document.querySelectorAll('.code-block .copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy') || '').then(function () {
        btn.textContent = '복사됨';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = '복사'; btn.classList.remove('done'); }, 1500);
      }, function () { btn.textContent = '복사 안 됨'; });
    });
  });

  var chips = document.querySelectorAll('.card-filters .chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      document.querySelectorAll('.docs-cards .card-row').forEach(function (row) {
        row.hidden = !(f === 'all' || row.getAttribute('data-level') === f);
      });
    });
  });

  var links = Array.prototype.slice.call(document.querySelectorAll('.doc-toc .toc a'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && byId[e.target.id]) {
          links.forEach(function (a) { a.classList.remove('is-current'); });
          byId[e.target.id].classList.add('is-current');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    document.querySelectorAll('.prose h2[id], .prose h3[id]').forEach(function (h) { obs.observe(h); });
  }
})();
