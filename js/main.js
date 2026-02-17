/**
 * Forged Paintball (ForgedPB.com)
 * Main JavaScript - Premium dark-themed e-commerce with samurai cherry blossom aesthetics
 */

(function () {
  'use strict';

  // ============================================================
  // 1. STICKY HEADER
  // ============================================================

  const StickyHeader = (() => {
    let header = null;
    const SCROLL_THRESHOLD = 100;

    function onScroll() {
      if (!header) return;
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      header.classList.toggle('scrolled', scrolled);
    }

    function init() {
      header = document.querySelector('.site-header');
      if (!header) return;
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    function destroy() {
      window.removeEventListener('scroll', onScroll);
    }

    return { init, destroy };
  })();


  // ============================================================
  // 3. MOBILE NAVIGATION
  // ============================================================

  const MobileNav = (() => {
    let nav = null;
    let toggleBtn = null;
    let closeBtn = null;
    let overlay = null;
    let isOpen = false;

    function open() {
      if (!nav || isOpen) return;
      isOpen = true;
      nav.classList.add('active');
      document.body.style.overflow = 'hidden';
      toggleBtn?.setAttribute('aria-expanded', 'true');
    }

    function close() {
      if (!nav || !isOpen) return;
      isOpen = false;
      nav.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }

    function handleToggle(e) {
      e.preventDefault();
      isOpen ? close() : open();
    }

    function handleKeydown(e) {
      if (e.key === 'Escape' && isOpen) close();
    }

    function init() {
      nav = document.getElementById('mobileNav');
      toggleBtn = document.getElementById('menuToggle');
      closeBtn = document.getElementById('mobileNavClose');
      overlay = document.getElementById('mobileNavOverlay');

      if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
      if (closeBtn) closeBtn.addEventListener('click', close);
      if (overlay) overlay.addEventListener('click', close);
      document.addEventListener('keydown', handleKeydown);
    }

    function destroy() {
      if (toggleBtn) toggleBtn.removeEventListener('click', handleToggle);
      if (closeBtn) closeBtn.removeEventListener('click', close);
      if (overlay) overlay.removeEventListener('click', close);
      document.removeEventListener('keydown', handleKeydown);
      close();
    }

    return { init, destroy };
  })();


  // ============================================================
  // 4. SEARCH OVERLAY
  // ============================================================

  const SearchOverlay = (() => {
    let overlay = null;
    let toggleBtn = null;
    let closeBtn = null;
    let searchInput = null;
    let isOpen = false;

    function open() {
      if (!overlay || isOpen) return;
      isOpen = true;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    }

    function close() {
      if (!overlay || !isOpen) return;
      isOpen = false;
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function handleToggle(e) {
      e.preventDefault();
      isOpen ? close() : open();
    }

    function handleKeydown(e) {
      if (e.key === 'Escape' && isOpen) close();
    }

    function handleOverlayClick(e) {
      if (e.target === overlay) close();
    }

    function init() {
      overlay = document.getElementById('searchOverlay');
      toggleBtn = document.getElementById('searchToggle');
      closeBtn = document.getElementById('searchClose');
      searchInput = overlay?.querySelector('input[type="search"], input[type="text"], input');

      if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
      if (closeBtn) closeBtn.addEventListener('click', close);
      if (overlay) overlay.addEventListener('click', handleOverlayClick);
      document.addEventListener('keydown', handleKeydown);
    }

    function destroy() {
      if (toggleBtn) toggleBtn.removeEventListener('click', handleToggle);
      if (closeBtn) closeBtn.removeEventListener('click', close);
      if (overlay) overlay.removeEventListener('click', handleOverlayClick);
      document.removeEventListener('keydown', handleKeydown);
      close();
    }

    return { init, destroy };
  })();


  // ============================================================
  // 5. PRODUCT CAROUSEL
  // ============================================================

  const ProductCarousel = (() => {
    const carousels = [];

    function initCarousel(carouselEl) {
      const track = carouselEl.querySelector('.product-carousel__track');
      if (!track) return;

      const prevBtn = carouselEl.querySelector('.carousel-arrow--left');
      const nextBtn = carouselEl.querySelector('.carousel-arrow--right');

      function getScrollAmount() {
        const card = track.querySelector('.product-card');
        if (!card) return 300;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return card.offsetWidth + gap;
      }

      function scrollPrev() {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }

      function scrollNext() {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }

      if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
      if (nextBtn) nextBtn.addEventListener('click', scrollNext);

      carousels.push({ track, prevBtn, nextBtn, scrollPrev, scrollNext });
    }

    function init() {
      const allCarousels = document.querySelectorAll('.product-carousel');
      allCarousels.forEach(initCarousel);
    }

    function destroy() {
      for (const { prevBtn, nextBtn, scrollPrev, scrollNext } of carousels) {
        if (prevBtn) prevBtn.removeEventListener('click', scrollPrev);
        if (nextBtn) nextBtn.removeEventListener('click', scrollNext);
      }
      carousels.length = 0;
    }

    return { init, destroy };
  })();


  // ============================================================
  // 6. COUNTDOWN TIMER
  // ============================================================

  const CountdownTimer = (() => {
    let intervalId = null;
    let targetDate = null;

    const STORAGE_KEY = 'forged_countdown_target';

    function padZero(num) {
      return String(num).padStart(2, '0');
    }

    function getTargetDate() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const date = new Date(stored);
        if (date > new Date()) return date;
      }
      // Set 3 days from now
      const target = new Date();
      target.setDate(target.getDate() + 3);
      target.setHours(0, 0, 0, 0);
      localStorage.setItem(STORAGE_KEY, target.toISOString());
      return target;
    }

    function update() {
      const now = new Date();
      let diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;

      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;

      const seconds = Math.floor(diff / 1000);

      const daysEl = document.getElementById('countDays');
      const hoursEl = document.getElementById('countHours');
      const minutesEl = document.getElementById('countMinutes');
      const secondsEl = document.getElementById('countSeconds');

      if (daysEl) daysEl.textContent = padZero(days);
      if (hoursEl) hoursEl.textContent = padZero(hours);
      if (minutesEl) minutesEl.textContent = padZero(minutes);
      if (secondsEl) secondsEl.textContent = padZero(seconds);

      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function init() {
      const hasCountdown =
        document.getElementById('countDays') ||
        document.getElementById('countHours') ||
        document.getElementById('countMinutes') ||
        document.getElementById('countSeconds');

      if (!hasCountdown) return;

      targetDate = getTargetDate();
      update();
      intervalId = setInterval(update, 1000);
    }

    function destroy() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    return { init, destroy };
  })();


  // ============================================================
  // 7. SCROLL ANIMATIONS (IntersectionObserver)
  // ============================================================

  const ScrollAnimations = (() => {
    let observer = null;

    const ANIMATED_SELECTORS = [
      '.section-header',
      '.product-card',
      '.category-card',
      '.members-section__content',
      '.banner-section__content',
    ];

    function init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: make everything visible immediately
        document.querySelectorAll(ANIMATED_SELECTORS.join(', ')).forEach((el) => {
          el.classList.add('visible');
        });
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -60px 0px',
          threshold: 0.1,
        }
      );

      const elements = document.querySelectorAll(ANIMATED_SELECTORS.join(', '));

      // Group elements by their parent to apply staggered delays to sibling cards
      const parentGroups = new Map();

      elements.forEach((el) => {
        observer.observe(el);

        // Apply stagger to card-like elements
        if (el.matches('.product-card, .category-card')) {
          const parent = el.parentElement;
          if (!parentGroups.has(parent)) {
            parentGroups.set(parent, []);
          }
          parentGroups.get(parent).push(el);
        }
      });

      // Apply staggered transition-delay to grouped cards
      parentGroups.forEach((cards) => {
        cards.forEach((card, index) => {
          card.style.transitionDelay = `${index * 100}ms`;
        });
      });
    }

    function destroy() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }

    return { init, destroy };
  })();


  // ============================================================
  // 8. NEWSLETTER FORM
  // ============================================================

  const NewsletterForm = (() => {
    let form = null;

    function handleSubmit(e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"], input[name="email"], input');
      if (emailInput && !emailInput.value.trim()) return;

      // Create and display success message
      const successMsg = document.createElement('div');
      successMsg.className = 'newsletter-success';
      successMsg.textContent = 'Thank you for subscribing! Welcome to the Forged family.';
      successMsg.setAttribute('role', 'status');

      Object.assign(successMsg.style, {
        padding: '12px 20px',
        marginTop: '12px',
        background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(166,137,64,0.1))',
        border: '1px solid rgba(201,169,110,0.3)',
        borderRadius: '6px',
        color: '#dbb978',
        fontSize: '14px',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease',
      });

      // Remove any existing success message
      const existing = form.parentElement.querySelector('.newsletter-success');
      if (existing) existing.remove();

      form.parentElement.insertBefore(successMsg, form.nextSibling);
      form.reset();

      // Remove success message after 4 seconds
      setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transition = 'opacity 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
      }, 4000);
    }

    function init() {
      form = document.getElementById('newsletterForm');
      if (!form) return;
      form.addEventListener('submit', handleSubmit);
    }

    function destroy() {
      if (form) form.removeEventListener('submit', handleSubmit);
    }

    return { init, destroy };
  })();


  // ============================================================
  // 9. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================

  const SmoothScroll = (() => {
    function getHeaderHeight() {
      const header = document.querySelector('.site-header');
      return header ? header.offsetHeight : 0;
    }

    function handleClick(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerOffset = getHeaderHeight();
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL hash without jumping
      history.pushState(null, '', targetId);
    }

    function init() {
      document.addEventListener('click', handleClick);
    }

    function destroy() {
      document.removeEventListener('click', handleClick);
    }

    return { init, destroy };
  })();


  // ============================================================
  // 10. CART COUNT
  // ============================================================

  const CartCount = (() => {
    let count = 0;
    let countEls = [];

    const STORAGE_KEY = 'forged_cart_count';

    function updateDisplay() {
      countEls.forEach((el) => {
        el.textContent = count;
        el.classList.toggle('has-items', count > 0);

        // Brief pop animation on update
        el.style.transform = 'scale(1.3)';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
          el.style.transition = 'transform 0.2s ease';
        }, 150);
      });

      localStorage.setItem(STORAGE_KEY, String(count));
    }

    function addItem() {
      count++;
      updateDisplay();
    }

    function handleQuickAdd(e) {
      const btn = e.target.closest(
        '.quick-add, .quick-add-btn, [data-quick-add], .product-card__add, .add-to-cart'
      );
      if (!btn) return;

      e.preventDefault();
      addItem();
    }

    function init() {
      countEls = Array.from(document.querySelectorAll('.cart-count'));
      if (!countEls.length) return;

      // Restore count from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      count = stored ? parseInt(stored, 10) || 0 : 0;
      updateDisplay();

      document.addEventListener('click', handleQuickAdd);
    }

    function destroy() {
      document.removeEventListener('click', handleQuickAdd);
      countEls = [];
    }

    return { init, destroy };
  })();


  // ============================================================
  // INITIALIZATION
  // ============================================================

  function initAll() {
    StickyHeader.init();
    MobileNav.init();
    SearchOverlay.init();
    ProductCarousel.init();
    CountdownTimer.init();
    ScrollAnimations.init();
    NewsletterForm.init();
    SmoothScroll.init();
    CartCount.init();
  }

  function destroyAll() {
    StickyHeader.destroy();
    MobileNav.destroy();
    SearchOverlay.destroy();
    ProductCarousel.destroy();
    CountdownTimer.destroy();
    ScrollAnimations.destroy();
    NewsletterForm.destroy();
    SmoothScroll.destroy();
    CartCount.destroy();
  }

  // Boot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Cleanup on page unload (useful for SPA transitions)
  window.addEventListener('beforeunload', destroyAll);

  // Expose for external use if needed
  window.ForgedPB = {
    reinit: () => {
      destroyAll();
      initAll();
    },
    modules: {
      StickyHeader,
      MobileNav,
      SearchOverlay,
      ProductCarousel,
      CountdownTimer,
      ScrollAnimations,
      NewsletterForm,
      SmoothScroll,
      CartCount,
    },
  };
})();
