// ── Lightbox ──────────────────────────────────────────────
(function () {
  const lightbox   = document.getElementById('lightbox');
  const lbBackdrop = document.getElementById('lightbox-backdrop');
  const lbClose    = document.getElementById('lightbox-close');
  const lbImg      = document.getElementById('lightbox-img');
  const lbCaption  = document.getElementById('lightbox-caption');
  const lbDesc     = document.getElementById('lightbox-desc');

  function openLightbox(src, caption, desc) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lbDesc.textContent = desc || '';
    lightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  document.querySelectorAll('.photo-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card.dataset.src, card.dataset.caption, card.dataset.desc);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();


// ── Copiar email ───────────────────────────────────────────
const btn = document.getElementById("copyEmailBtn");
btn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("jculvercalleja@gmail.com");
    btn.style.backgroundColor = "#38debb";
    setTimeout(() => { btn.style.backgroundColor = ""; }, 800);
  } catch (err) {
    console.error("Error al copiar:", err);
  }
});


// ── Active nav + fast smooth scroll ───────────────────────
(function () {
  const NAV_LINKS   = document.querySelectorAll('nav a[href^="#"]');
  const ACTIVE      = ['text-teal-400', 'border-b-2', 'border-teal-400', 'pb-1'];
  const INACTIVE    = ['text-slate-400', 'hover:text-slate-100', 'transition-colors'];
  const SECTION_IDS = ['About', 'Experience', 'Formacion', 'Work', 'Contact'];
  const NAV_HEIGHT  = 80;

  function setActive(id) {
    NAV_LINKS.forEach(link => {
      const isMatch = link.getAttribute('href') === '#' + id;
      link.classList.remove(...ACTIVE, ...INACTIVE);
      link.classList.add(...(isMatch ? ACTIVE : INACTIVE));
    });
  }

  // Determina qué sección está activa mirando cuál tiene su top
  // más cercano (por encima o justo en) el punto de referencia del nav
  function getActiveSection() {
    const scrollY = window.scrollY + NAV_HEIGHT + 10;
    let current = SECTION_IDS[0];

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollY) {
        current = id;
      }
    }
    return current;
  }

  // Actualizar al hacer scroll (throttle con rAF)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setActive(getActiveSection());
        ticking = false;
      });
      ticking = true;
    }
  });

  // Easing: easeInOutQuart
  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function smoothScrollTo(targetY, duration) {
    const start = window.scrollY;
    const dist  = targetY - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      window.scrollTo(0, start + dist * easeInOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Estado inicial al cargar
  setActive(getActiveSection());
})();
