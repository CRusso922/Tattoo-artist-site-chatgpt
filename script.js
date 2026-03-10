// ============================================================
// DiscoverInk - script.js (Full Version)
// ============================================================


// ------------------------------------------------------------
// 1. AUTO-UPDATE COPYRIGHT YEAR
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const yearSpans = document.querySelectorAll('.copyright-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(function (span) {
    span.textContent = currentYear;
  });
});


// ------------------------------------------------------------
// 2. HAMBURGER MENU
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('nav');
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-btn';
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  nav.appendChild(hamburger);
  document.body.appendChild(overlay);

  const navLinks = document.querySelector('.nav-links-primary');
  const navRightActions = document.querySelector('.nav-right-actions');

  function closeMenu() {
    hamburger.classList.remove('is-open');
    navLinks.classList.remove('mobile-open');
    navRightActions.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('is-open');
    navLinks.classList.toggle('mobile-open', isOpen);
    navRightActions.classList.toggle('mobile-open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
});


// ------------------------------------------------------------
// 3. ACTIVE NAV LINK HIGHLIGHTING
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links-primary li a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === '/' && (path === '/' || path === '')) {
      link.classList.add('active');
    } else if (href !== '/' && href !== '' && path.startsWith(href)) {
      link.classList.add('active');
    }
  });
});


// ------------------------------------------------------------
// 4. BACK TO TOP BUTTON
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


// ------------------------------------------------------------
// 5. SEARCH FUNCTIONALITY
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const searchInputs = document.querySelectorAll('.search-input');
  const searchButtons = document.querySelectorAll('.search-button');
  const isArtistsPage = document.querySelector('.artist-results') !== null;

  function runSearch(query) {
    query = query.trim().toLowerCase();
    if (!query) return;
    if (isArtistsPage) {
      filterArtistCards(query);
    } else {
      window.location.href = '/artists/?q=' + encodeURIComponent(query);
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runSearch(input.value);
    });
    if (isArtistsPage) {
      input.addEventListener('input', function () {
        filterArtistCards(input.value.trim().toLowerCase());
      });
    }
  });

  searchButtons.forEach(function (button, index) {
    button.addEventListener('click', function () {
      runSearch((searchInputs[index] || searchInputs[0]).value);
    });
  });

  function filterArtistCards(query) {
    const cards = document.querySelectorAll('.artist-results .artist-card');
    let visibleCount = 0;
    cards.forEach(function (card) {
      const name = (card.querySelector('h3') || {}).textContent || '';
      const style = (card.querySelector('.artist-style') || {}).textContent || '';
      const location = (card.querySelector('.artist-location') || {}).textContent || '';
      const matches = !query || [name, style, location].some(t => t.toLowerCase().includes(query));
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });
    showNoResultsMessage(visibleCount === 0 && query !== '');
  }

  function showNoResultsMessage(show) {
    let msg = document.getElementById('no-results-message');
    if (show) {
      if (!msg) {
        msg = document.createElement('p');
        msg.id = 'no-results-message';
        msg.style.cssText = 'text-align:center;color:#aaaaaa;font-size:1.1rem;padding:40px;width:100%;';
        msg.textContent = 'No artists found matching your search. Try a different name, style, or location.';
        const results = document.querySelector('.artist-results');
        if (results) results.appendChild(msg);
      }
      msg.style.display = 'block';
    } else if (msg) {
      msg.style.display = 'none';
    }
  }

  if (isArtistsPage) {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      searchInputs.forEach(function (input) { input.value = q; });
      filterArtistCards(q.toLowerCase());
    }
  }
});


// ------------------------------------------------------------
// 6. NAV AUTH STATE (Supabase)
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  if (!window.supabaseClient) return;

  function updateNav(session) {
    const link = document.querySelector('.nav-profile-link');
    if (!link) return;
    const avatar = link.querySelector('.nav-avatar');
    const label = link.querySelector('.nav-login-text');
    if (session && session.user) {
      const meta = session.user.user_metadata || {};
      const name = meta.full_name || session.user.email;
      const initials = name.split(' ').map(function (n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
      avatar.innerHTML = '<span style="font-weight:700;font-size:0.8rem;color:#fff;">' + initials + '</span>';
      label.textContent = name.split(' ')[0];
    } else {
      avatar.innerHTML = '<i class="fas fa-user"></i>';
      label.textContent = 'Sign In';
    }
  }

  window.supabaseClient.auth.getSession().then(function (res) {
    updateNav(res.data.session);
  });

  window.supabaseClient.auth.onAuthStateChange(function (event, session) {
    updateNav(session);
  });
});


// ------------------------------------------------------------
// 7. LIGHTBOX GALLERY
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const galleryImages = document.querySelectorAll('.profile-gallery img');
  if (!galleryImages.length) return;

  // Build lightbox DOM
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
    <img class="lightbox-img" src="" alt="Portfolio image">
    <button class="lightbox-nav lightbox-next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const images = Array.from(galleryImages);
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  images.forEach(function (img, index) {
    img.addEventListener('click', function () { openLightbox(index); });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);

  // Close on background click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
});


// ------------------------------------------------------------
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});


// ------------------------------------------------------------
// 9. CARD FADE-IN ANIMATION ON SCROLL
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.artist-card, .reason-item, .step-card, .style-card, .testimonial-card, .blog-post-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) {
      card.classList.add('fade-in-hidden');
      observer.observe(card);
    });
  }
});
