// TATZ BY FATZ — main.js
document.addEventListener('DOMContentLoaded', () => {

  /* Preloader */
  const preloader = document.getElementById('preloader');
  const dismissPreloader = () => preloader && preloader.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(dismissPreloader, 900));
  setTimeout(dismissPreloader, 3200); // hard fallback so it never blocks the site
  preloader && preloader.addEventListener('click', dismissPreloader);

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Hero "Booking [Month] Now" — always reflects the current month */
  const monthEl = document.getElementById('currentMonth');
  if (monthEl) monthEl.textContent = new Date().toLocaleString('en-US', { month: 'long' }) + ' Now';

  /* Sticky nav */
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const toTop = document.getElementById('to-top');
    if (toTop) window.scrollY > 700 ? toTop.classList.add('show') : toTop.classList.remove('show');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle && navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', () => {
    navToggle && navToggle.classList.remove('open');
    navLinks && navLinks.classList.remove('open');
  }));

  /* Back to top */
  const toTop = document.getElementById('to-top');
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Lazy-load & autoplay portfolio motion videos only when in view (saves bandwidth) */
  const lazyVideos = document.querySelectorAll('video[data-lazy-src]');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src && v.dataset.lazySrc) {
            v.src = v.dataset.lazySrc;
            v.load();
          }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    lazyVideos.forEach(v => vio.observe(v));
  }

  /* Hero video: pause if it fails to load so the poster art always shows cleanly */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => heroVideo.style.display = 'none');
  }

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lbMedia = document.getElementById('lbMedia');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');

  function openLightbox(item) {
    const type = item.dataset.type;
    const src = item.dataset.src;
    const caption = item.dataset.caption || '';
    lbMedia.innerHTML = '';

    if (type === 'video') {
      const v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true; v.loop = true; v.muted = false; v.playsInline = true;
      lbMedia.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = src; img.alt = caption;
      lbMedia.appendChild(img);
    }
    lbCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.p-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });
  lbClose && lbClose.addEventListener('click', closeLightbox);
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* Booking iframe: loading state + graceful fallback if the embed fails or times out */
  const bookingIframe = document.getElementById('bookingIframe');
  const bookingLoading = document.getElementById('bookingLoading');
  const bookingFallback = document.getElementById('bookingFallback');
  let bookingResolved = false;

  function bookingLoaded() {
    if (bookingResolved) return;
    bookingResolved = true;
    bookingLoading && bookingLoading.classList.add('hidden');
  }
  function bookingFailed() {
    if (bookingResolved) return;
    bookingResolved = true;
    bookingLoading && bookingLoading.classList.add('hidden');
    bookingFallback && bookingFallback.classList.remove('hidden');
    if (bookingIframe) bookingIframe.style.display = 'none';
  }

  if (bookingIframe) {
    // Trust the browser's own load event — cross-origin embeds (like Google Calendar)
    // can't be reliably probed from here (contentDocument access throws by design for
    // cross-origin frames, and that used to be misread as both "success" and "failure"
    // depending on timing). If it never loads at all, fall back after a generous wait.
    bookingIframe.addEventListener('load', bookingLoaded);
    bookingIframe.addEventListener('error', bookingFailed);
    setTimeout(() => { if (!bookingResolved) bookingFailed(); }, 15000);
  }

  /* Portfolio grid: masonry-safe columns already handled in CSS via `columns` */

});
