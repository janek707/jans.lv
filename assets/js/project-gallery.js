(() => {
  const gallery = document.querySelector('#gallery');
  const items = Array.isArray(window.PROJECT_GALLERY) ? window.PROJECT_GALLERY : [];

  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lb-img');
  const closeBtn = document.querySelector('.lb-close');

  // --------- Build gallery (prevents duplicates) ----------
  if (gallery && items.length) {
    const base = gallery.dataset.base || '';

    // hard reset: if script runs twice, no duplicates
    gallery.innerHTML = '';

    items.forEach((name, idx) => {
      const full = base + name;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gitem';
      btn.dataset.full = full;
      btn.setAttribute('aria-label', `Open image ${idx + 1}`);

      const img = document.createElement('img');
      img.src = full;
      img.alt = `Build photo ${idx + 1}`;
      img.loading = 'lazy';

      btn.appendChild(img);
      gallery.appendChild(btn);
    });
  }

  // --------- Lightbox ----------
  if (!lightbox || !lbImg || !closeBtn) return;

  const open = (src) => {
    lbImg.src = src;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.documentElement.style.overflow = '';
  };

  // Always start closed
  close();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.gitem');
    if (!btn) return;
    const src = btn.dataset.full;
    if (src) open(src);
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
})();
