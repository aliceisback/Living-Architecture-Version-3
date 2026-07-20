/* ═══════════════════════════════════════════════════════════
   Living Architecture — Interactive Script
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Navigation Scroll State ─────────────────────────────── */
  const nav = document.querySelector('.nav');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Mobile Menu Toggle ──────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Scroll Reveal (Intersection Observer) ───────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── KaTeX Rendering ─────────────────────────────────────── */
  const renderEquations = () => {
    document.querySelectorAll('[data-katex]').forEach(el => {
      const tex = el.getAttribute('data-katex');
      try {
        katex.render(tex, el, {
          displayMode: true,
          throwOnError: false,
          output: 'html',
          trust: true,
        });
      } catch (e) {
        console.warn('KaTeX render error:', e);
        el.textContent = tex;
      }
    });
  };

  // Wait for KaTeX to load
  if (typeof katex !== 'undefined') {
    renderEquations();
  } else {
    window.addEventListener('load', () => {
      if (typeof katex !== 'undefined') {
        renderEquations();
      }
    });
  }

  /* ── Gallery Lightbox ────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── Smooth Scroll for CTA ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Active Nav Highlight ────────────────────────────────── */
  const sections = document.querySelectorAll('.section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const activateNavLink = () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.style.color = 'var(--accent-blue)';
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });

  /* ── Internationalization (i18n) ──────────────────────────── */
  const langSelect = document.getElementById('lang-select');
  let translations = {};

  const applyTranslations = (lang) => {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;
    localStorage.setItem('la-lang', lang);
  };

  // Load translations
  fetch('translations.json')
    .then(r => r.json())
    .then(data => {
      translations = data;
      // Check saved language
      const saved = localStorage.getItem('la-lang');
      if (saved && translations[saved]) {
        langSelect.value = saved;
        if (saved !== 'en') applyTranslations(saved);
      }
    })
    .catch(err => console.warn('Translations not loaded:', err));

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyTranslations(e.target.value);
    });
  }
});
