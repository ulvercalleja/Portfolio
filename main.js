// ── Mobile hamburger menu (fullscreen overlay) ────────────
(function () {
  const btn      = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuClose');
  const menu     = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function openMenu() {
    menu.style.display = 'flex';
    menu.classList.remove('is-closing');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    menu.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      menu.style.display = 'none';
      menu.classList.remove('is-closing');
    }, 220);
  }

  btn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  menu.querySelectorAll('a.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.style.display === 'flex') closeMenu();
  });
})();

// ── Lightbox (fotos) ──────────────────────────────────────
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


// ── Email lightbox ────────────────────────────────────────
(function () {
  const emailLightbox  = document.getElementById('email-lightbox');
  const backdrop       = document.getElementById('email-lightbox-backdrop');
  const closeBtn       = document.getElementById('email-lightbox-close');
  const copyBtn        = document.getElementById('copyEmailLightboxBtn');
  const copyLabel      = document.getElementById('copyEmailLightboxLabel');
  const EMAIL          = 'jculvercalleja@gmail.com';

  function openEmailLightbox() {
    emailLightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
  }

  function closeEmailLightbox() {
    emailLightbox.style.display = 'none';
    document.body.classList.remove('lightbox-open');
    // Reset copy label
    copyLabel.textContent = 'Copiar dirección';
  }

  // Triggers (sección contacto + footer)
  ['openEmailLightbox', 'openEmailLightboxFooter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openEmailLightbox);
  });

  closeBtn.addEventListener('click', closeEmailLightbox);
  backdrop.addEventListener('click', closeEmailLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emailLightbox.style.display === 'flex') closeEmailLightbox();
  });

  // Copiar email
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyLabel.textContent = '¡Copiado!';
      copyBtn.style.borderColor = 'rgba(56,222,187,0.4)';
      copyBtn.style.color = '#38debb';
      setTimeout(() => {
        copyLabel.textContent = 'Copiar dirección';
        copyBtn.style.borderColor = 'rgba(214,227,255,0.12)';
        copyBtn.style.color = 'rgba(214,227,255,0.6)';
      }, 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  });
})();


// ── Active nav + fast smooth scroll ───────────────────────
(function () {
  const DESKTOP_LINKS = document.querySelectorAll('nav a[href^="#"]');
  const MOBILE_LINKS  = document.querySelectorAll('#mobileMenu a.mobile-nav-link');
  const ACTIVE        = ['text-teal-400', 'border-b-2', 'border-teal-400', 'pb-1'];
  const INACTIVE      = ['text-slate-400', 'hover:text-slate-100', 'transition-colors'];
  const SECTION_IDS   = ['About', 'Experience', 'Formacion', 'Work', 'Contact'];
  const NAV_HEIGHT    = 80;

  function setActive(id) {
    // Desktop links: Tailwind classes
    DESKTOP_LINKS.forEach(link => {
      const isMatch = link.getAttribute('href') === '#' + id;
      link.classList.remove(...ACTIVE, ...INACTIVE);
      link.classList.add(...(isMatch ? ACTIVE : INACTIVE));
    });
    // Mobile links: inline color (last one "Contacto" keeps teal only when active)
    MOBILE_LINKS.forEach(link => {
      const isMatch = link.getAttribute('href') === '#' + id;
      link.style.color = isMatch ? '#38debb' : 'rgba(214,227,255,0.75)';
    });
  }

  function getActiveSection() {
    const scrollY = window.scrollY + NAV_HEIGHT + 10;
    let current = SECTION_IDS[0];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= scrollY) current = id;
    }
    return current;
  }

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

  // Desktop links click
  DESKTOP_LINKS.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id     = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;
      setActive(id);
      smoothScrollTo(target.offsetTop - NAV_HEIGHT, 400);
    });
  });

  // Mobile links click (smooth scroll + close menu handled in hamburger IIFE)
  MOBILE_LINKS.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id     = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(id);
      if (!target) return;
      setActive(id);
      smoothScrollTo(target.offsetTop - NAV_HEIGHT, 400);
    });
  });

  setActive(getActiveSection());

  // Botón hero → Proyectos
  const heroBtn = document.getElementById('heroWorkBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('Work');
      if (!target) return;
      setActive('Work');
      smoothScrollTo(target.offsetTop - NAV_HEIGHT, 400);
    });
  }
})();
