// ============================================================
// DiscoverInk - script.js
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
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  nav.appendChild(hamburger);
  document.body.appendChild(overlay);

  const navLinks = document.querySelector('.nav-links-primary');
  const navRightActions = document.querySelector('.nav-right-actions');

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('is-open');
    navLinks.classList.toggle('mobile-open', isOpen);
    navRightActions.classList.toggle('mobile-open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.addEventListener('click', function () {
    hamburger.classList.remove('is-open');
    navLinks.classList.remove('mobile-open');
    navRightActions.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('is-open');
      navLinks.classList.remove('mobile-open');
      navRightActions.classList.remove('mobile-open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
});


// ------------------------------------------------------------
// 3. ACTIVE NAV LINK HIGHLIGHTING
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links-primary li a');

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
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
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
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
      window.location.href = 'artists.html?q=' + encodeURIComponent(query);
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
      const input = searchInputs[index] || searchInputs[0];
      runSearch(input.value);
    });
  });

  function filterArtistCards(query) {
    const cards = document.querySelectorAll('.artist-results .artist-card');
    let visibleCount = 0;
    cards.forEach(function (card) {
      const name = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const style = card.querySelector('.artist-style') ? card.querySelector('.artist-style').textContent.toLowerCase() : '';
      const location = card.querySelector('.artist-location') ? card.querySelector('.artist-location').textContent.toLowerCase() : '';
      const matches = !query || name.includes(query) || style.includes(query) || location.includes(query);
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
        msg.style.cssText = 'text-align:center; color:#aaaaaa; font-size:1.1rem; padding:40px; width:100%;';
        msg.textContent = 'No artists found matching your search. Try a different name, style, or location.';
        const results = document.querySelector('.artist-results');
        if (results) results.appendChild(msg);
      }
      msg.style.display = 'block';
    } else {
      if (msg) msg.style.display = 'none';
    }
  }

  if (isArtistsPage) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      searchInputs.forEach(function (input) { input.value = q; });
      filterArtistCards(q.toLowerCase());
    }
  }
});


// ------------------------------------------------------------
// 6. SIGNUP FORM - PASSWORD VALIDATION
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.signup-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const password = form.querySelector('#password');
      const confirmPassword = form.querySelector('#confirmPassword');
      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          e.preventDefault();
          showFormError(confirmPassword, 'Passwords do not match. Please try again.');
        } else {
          clearFormError(confirmPassword);
        }
      }
    });
  });

  function showFormError(input, message) {
    clearFormError(input);
    const error = document.createElement('small');
    error.className = 'form-error-message';
    error.style.cssText = 'color:#C44040; display:block; margin-top:5px;';
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.style.borderColor = '#C44040';
  }

  function clearFormError(input) {
    const existing = input.parentNode.querySelector('.form-error-message');
    if (existing) existing.remove();
    input.style.borderColor = '';
  }
});


// ------------------------------------------------------------
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
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
// 8. CARD FADE-IN ANIMATION ON SCROLL
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
