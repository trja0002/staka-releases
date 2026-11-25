(()=>{// Enda platsen där namnet och nedladdningsadresserna står.
const SITE_NAME = 'Skare';
const REPO_NAME = 'Staka';
const RELEASES_URL = 'https://github.com/trja0002/staka-releases/releases/latest';
const DOWNLOADS = {
  mac: { label: 'Mac', file: `${SITE_NAME}-mac.dmg`, hint: 'macOS 13 eller senare, Apple Silicon och Intel' },
  windows: { label: 'Windows', file: `${SITE_NAME}-Setup.exe`, hint: 'Windows 10 eller senare, 64 bit' },
};

document.querySelectorAll('[data-name]').forEach((el) => (el.textContent = SITE_NAME));
document.title = document.title.replace('{name}', SITE_NAME);

// Välj Mac eller Windows efter besökarens system.
const ua = navigator.userAgent;
const os = /Windows/i.test(ua) ? 'windows' : /Mac/i.test(ua) && !/Mobile|iPhone|iPad/i.test(ua) ? 'mac' : null;
const main = document.querySelector('[data-download]');
const other = document.querySelector('[data-download-other]');
const hint = document.querySelector('[data-download-hint]');
if (main) {
  const pick = os ?? 'mac';
  const alt = pick === 'mac' ? 'windows' : 'mac';
  main.href = `${RELEASES_URL}`;
  main.querySelector('[data-dl-label]').textContent = os
    ? `Ladda ned för ${DOWNLOADS[pick].label}`
    : 'Ladda ned för Mac eller Windows';
  if (hint) hint.textContent = os ? DOWNLOADS[pick].hint : 'Skrivbordsappen finns för Mac och Windows.';
  if (other) {
    other.textContent = `Ladda ned för ${DOWNLOADS[alt].label} i stället`;
    other.href = RELEASES_URL;
  }
  document.querySelectorAll(`[data-os-tab="${pick}"]`).forEach((t) => t.click());
}

// Installationsflikar.
document.querySelectorAll('[data-os-tab]').forEach((tab) => {
  tab.addEventListener('click', () => {
    const k = tab.dataset.osTab;
    document.querySelectorAll('[data-os-tab]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.osTab === k)));
    document.querySelectorAll('[data-os-panel]').forEach((p) => (p.hidden = p.dataset.osPanel !== k));
  });
});

// Klippen: spela bara i bild, och inte alls vid minskad rörelse.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video[data-loop]')];
const io = new IntersectionObserver((es) => {
  es.forEach((e) => {
    const v = e.target;
    if (reduce.matches) return v.pause();
    if (e.isIntersecting) { v.preload = 'auto'; v.play().catch((err) => { if (err.name === 'NotAllowedError') stillFor(v); }); } else v.pause();
  });
}, { threshold: 0.2 });
// Spelas ingen källa (format som webbläsaren inte avkodar) visas stillbilden i stället för svart ruta.
const stillFor = (v) => { const i = new Image(); i.src = v.poster; i.alt = v.getAttribute('aria-label') || ''; i.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block'; v.replaceWith(i); };
videos.forEach((v) => {
  v.removeAttribute('autoplay');
  v.addEventListener('error', () => stillFor(v));
  v.lastElementChild?.addEventListener('error', () => stillFor(v));
  io.observe(v);
});
reduce.addEventListener('change', () => videos.forEach((v) => reduce.matches && v.pause()));

// Diagram som växer fram när det kommer i bild.
const charts = document.querySelectorAll('.chart');
const cio = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), cio.unobserve(e.target))), { threshold: 0.4 });
charts.forEach((c) => cio.observe(c));
})();