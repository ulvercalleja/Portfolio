// Lightbox functionality for photo cards
(function () {
  const lightbox = document.getElementById('lightbox');
  const lbBackdrop = document.getElementById('lightbox-backdrop');
  const lbClose = document.getElementById('lightbox-close');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbDesc = document.getElementById('lightbox-desc');

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

  // Copiar email al portapapeles con feedback visual
  const btn = document.getElementById("copyEmailBtn");

  btn.addEventListener("click", async () => {
  const email = "jculvercalleja@gmail.com";

  try {
    await navigator.clipboard.writeText(email);

    // Feedback visual (rápido y limpio)
    btn.style.backgroundColor = "#38debb";

    setTimeout(() => {
      btn.style.backgroundColor = "";
    }, 800);

  } catch (err) {
    console.error("Error al copiar:", err);
  }
});
