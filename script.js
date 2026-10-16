/* ===================================================================
   M PAVAN - PORTFOLIO INTERACTION LOGIC
   Features: Dynamic Counter, Filtering, Smooth Navigation, Photo Toggle,
   Clipboard Helper & Interactive Feedback
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileMenuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x-lg');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('bi-list');
          icon.classList.remove('bi-x-lg');
        }
      });
    });
  }

  // 2. Active Link on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.custom-nav .nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 160;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // 3. Animated Stats Counter using IntersectionObserver
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isFloat = counter.getAttribute('data-float') === 'true';
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = (isFloat ? target.toFixed(2) : Math.round(target)) + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = (isFloat ? count.toFixed(2) : Math.floor(count)) + suffix;
            }
          }, stepTime);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-strip');
  if (statsSection) {
    countObserver.observe(statsSection);
  }

  // 4. Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal || category.includes(filterVal)) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('formName');
      const senderName = nameInput ? nameInput.value.trim() : 'Friend';
      
      showToast(`Thank you, ${senderName}! Your message has been sent to M Pavan.`);
      contactForm.reset();
    });
  }

  // 7. Clipboard Copy Helper
  window.copyToClipboard = function(text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label || text} to clipboard!`);
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${label || text} to clipboard!`);
    } catch (err) {
      showToast(`Could not copy: ${text}`);
    }
    document.body.removeChild(textarea);
  }

  // 8. Toast Helper
  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
});
