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

  /* Start Your Consult — interactive booking wizard (replaces the old calendar embed) */
  const wizard = document.getElementById('consultWizard');
  if (wizard) {
    const steps = Array.from(wizard.querySelectorAll('.consult-step'));
    const progressFill = document.getElementById('consultProgressFill');
    const stepCounter = document.getElementById('consultStepCounter');
    const backBtn = document.getElementById('consultBack');
    const totalInputSteps = 4; // step 5 is the summary, not counted in "Step X of 4"
    const state = { style: '', placement: '', size: '', name: '', notes: '' };
    let current = 1;

    function showStep(n) {
      current = n;
      steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
      const pct = Math.min(n, totalInputSteps) / totalInputSteps * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (stepCounter) stepCounter.textContent = n <= totalInputSteps ? `Step ${n} of ${totalInputSteps}` : 'All set';
      if (backBtn) backBtn.classList.toggle('show', n > 1);
      if (n === 5) buildSummary();
    }

    wizard.querySelectorAll('.consult-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.value;
        state[field] = value;
        chip.parentElement.querySelectorAll('.consult-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        setTimeout(() => showStep(current + 1), 320);
      });
    });

    const continueBtn = document.getElementById('consultContinue');
    continueBtn && continueBtn.addEventListener('click', () => {
      state.name = document.getElementById('consultName').value.trim();
      state.notes = document.getElementById('consultNotes').value.trim();
      showStep(5);
    });

    backBtn && backBtn.addEventListener('click', () => { if (current > 1) showStep(current - 1); });

    function buildSummary() {
      const summaryEl = document.getElementById('consultSummary');
      const nameEcho = document.getElementById('consultNameEcho');
      if (nameEcho) nameEcho.textContent = state.name ? `, ${state.name}` : '';

      const rows = [
        ['Style', state.style],
        ['Placement', state.placement],
        ['Size', state.size],
      ];
      if (state.notes) rows.push(['Notes', state.notes]);
      if (summaryEl) {
        summaryEl.innerHTML = rows.map(([label, val]) =>
          `<div class="consult-summary-row"><span>${label}</span><b>${escapeHtml(val)}</b></div>`
        ).join('');
      }

      const greeting = state.name ? `Hey Fatz, I'm ${state.name}!` : 'Hey Fatz!';
      const lines = [
        greeting,
        "I'm interested in booking a tattoo session:",
        `Style: ${state.style}`,
        `Placement: ${state.placement}`,
        `Size: ${state.size}`,
      ];
      if (state.notes) lines.push(`Notes: ${state.notes}`);
      lines.push('(sent from tatzbyfatz.com)');
      const message = lines.join('\n');

      const textBtn = document.getElementById('consultTextBtn');
      const emailBtn = document.getElementById('consultEmailBtn');
      if (textBtn) textBtn.href = `sms:+14434690151?body=${encodeURIComponent(message)}`;
      if (emailBtn) emailBtn.href = `mailto:cjacobs0115@gmail.com?subject=${encodeURIComponent('New tattoo consult request')}&body=${encodeURIComponent(message)}`;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    const restartBtn = document.getElementById('consultRestart');
    restartBtn && restartBtn.addEventListener('click', () => {
      Object.keys(state).forEach(k => state[k] = '');
      wizard.querySelectorAll('.consult-chip.selected').forEach(c => c.classList.remove('selected'));
      const nameInput = document.getElementById('consultName');
      const notesInput = document.getElementById('consultNotes');
      if (nameInput) nameInput.value = '';
      if (notesInput) notesInput.value = '';
      showStep(1);
    });

    showStep(1);
  }

  /* Portfolio grid: masonry-safe columns already handled in CSS via `columns` */

});
