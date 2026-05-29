/* =====================================================
   루트9 (Route9) Official Website — main.js
   ===================================================== */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initHeroParticles();
  initScrollReveal();
  initCounters();
  initServiceTabs();
  initCardModal();
  initContactForm();
  initSmoothScroll();
  initLogoFallback();
});

/* ── Navbar Scroll ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

/* ── Hamburger Menu ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── Hero Particles ── */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 28;
  const colors = ['rgba(255,255,255,', 'rgba(240,171,0,', 'rgba(14,165,233,', 'rgba(46,139,87,'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.3 + 0.1;
    const dur = (Math.random() * 10 + 6).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);
    const tx = (Math.random() * 60 - 30).toFixed(0);
    const ty = (Math.random() * 60 - 30).toFixed(0);

    p.className = 'particle';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${color}${opacity});
      --dur:${dur}s;
      --delay:-${delay}s;
      --tx:${tx}px;
      --ty:${ty}px;
      --op-min:${(opacity*0.5).toFixed(2)};
      --op-max:${(opacity).toFixed(2)};
    `;
    container.appendChild(p);
  }
}

/* ── Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        /* Stagger sibling cards */
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'))
          : [];
        const delay = siblings.includes(entry.target)
          ? siblings.indexOf(entry.target) * 60
          : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ── Counter Animation ── */
function initCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const countEl = item.querySelector('.count');
        const target = parseInt(item.dataset.target, 10);
        if (!countEl || isNaN(target)) return;

        animateCounter(countEl, 0, target, 1800);
        observer.unobserve(item);
      }
    });
  }, { threshold: 0.4 });

  statItems.forEach(item => observer.observe(item));
}

function animateCounter(el, from, to, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    /* Ease out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    el.textContent = current.toLocaleString('ko-KR');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = to.toLocaleString('ko-KR');
    }
  }

  requestAnimationFrame(update);
}

/* ── Service Tabs ── */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));

  tabContents.forEach(c => {
    const isTarget = c.id === `tab-${tabId}`;
    c.classList.toggle('active', isTarget);
    if (isTarget) {
      /* Re-trigger reveal animations inside the new tab */
      c.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('visible')) return;
        /* Already visible, skip */
      });
      /* Trigger fresh reveals */
      const freshReveals = c.querySelectorAll('.reveal:not(.visible)');
      freshReveals.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 60);
      });
    }
  });
}

/* Make switchTab globally accessible for footer links */
window.switchTab = switchTab;

/* ── Service Card Modal ── */
function initCardModal() {
  const overlay = document.getElementById('serviceModal');
  if (!overlay) return;

  /* Add "자세히 보기" hint to all cards */
  document.querySelectorAll('[data-card]').forEach(card => {
    const hint = document.createElement('div');
    hint.className = 'card-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '자세히 보기 <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
    card.appendChild(hint);
  });

  /* Card click → open modal */
  document.addEventListener('click', (e) => {
    if (e.target.closest('#serviceModal')) return;
    const card = e.target.closest('[data-card]');
    if (!card) return;
    openServiceModal(card);
  });

  /* Close on overlay background click */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeServiceModal();
  });

  /* Close button */
  overlay.querySelector('.modal-close').addEventListener('click', closeServiceModal);

  /* Consult button also closes modal before navigating */
  overlay.querySelector('.modal-consult-btn').addEventListener('click', closeServiceModal);

  /* Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeServiceModal();
  });
}

function openServiceModal(card) {
  const overlay = document.getElementById('serviceModal');

  /* Icon */
  const iconEl = card.querySelector('.sc-icon');
  const iconWrap = overlay.querySelector('.modal-icon-wrap');
  iconWrap.innerHTML = iconEl ? iconEl.outerHTML : '';

  /* Title */
  const titleEl = card.querySelector('.sc-header-text h4');
  overlay.querySelector('.modal-title').textContent = titleEl ? titleEl.textContent : '';

  /* Description */
  const descEl = card.querySelector('.sc-desc');
  overlay.querySelector('.modal-desc').innerHTML = descEl ? descEl.innerHTML : '';

  /* Detail grid items */
  const gridEl = card.querySelector('.sc-detail-grid');
  overlay.querySelector('.modal-detail-grid').innerHTML = gridEl ? gridEl.innerHTML : '';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  const overlay = document.getElementById('serviceModal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Contact Form ── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMsg   = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Validate */
    if (!validateForm(form)) return;

    /* UI: Loading state */
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = true;
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    formMsg.className = 'form-msg';
    formMsg.style.display = 'none';

    /* Collect data */
    const data = {
      company: form.company.value.trim(),
      email:   form.email.value.trim(),
      phone:   form.phone.value.trim(),
      url:     form.url.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      /* Try contact.php first, fall back to mailto */
      const response = await fetch('contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        showFormMsg('success', '상담 신청이 완료되었습니다. 24시간 내에 연락드리겠습니다.');
        form.reset();
      } else {
        throw new Error('server_error');
      }
    } catch {
      /* Fallback: open mailto */
      const subject = encodeURIComponent(`[루트9 상담 신청] ${data.company}`);
      const body = encodeURIComponent(
        `업체명: ${data.company}\n이메일: ${data.email}\n연락처: ${data.phone}\n사이트: ${data.url || '없음'}\n\n문의내용:\n${data.message}`
      );
      window.open(`mailto:route9master@gmail.com?subject=${subject}&body=${body}`, '_blank');
      showFormMsg('success', '이메일 클라이언트가 열립니다. 전송 후 24시간 내에 연락드리겠습니다.');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  function validateForm(form) {
    let valid = true;

    ['company', 'email', 'phone', 'message'].forEach(name => {
      const el = form[name];
      if (!el) return;
      el.classList.remove('error');
      if (!el.value.trim()) {
        el.classList.add('error');
        valid = false;
      }
    });

    const emailEl = form.email;
    if (emailEl && emailEl.value.trim() && !isValidEmail(emailEl.value)) {
      emailEl.classList.add('error');
      valid = false;
    }

    const privacy = form.privacy;
    if (privacy && !privacy.checked) {
      showFormMsg('error', '개인정보 수집 및 이용에 동의해주세요.');
      valid = false;
    }

    if (!valid && !form.privacy?.checked) {
      /* Only show generic message if not already showing privacy error */
    } else if (!valid) {
      showFormMsg('error', '필수 항목을 모두 입력해주세요.');
    }

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMsg(type, msg) {
    formMsg.className = `form-msg ${type}`;
    formMsg.textContent = msg;
    formMsg.style.display = 'block';
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Clear error on input */
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('error'));
  });
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Logo Fallback ── */
function initLogoFallback() {
  document.querySelectorAll('.logo-img').forEach(img => {
    img.addEventListener('error', function () {
      this.classList.add('broken');
      this.style.display = 'none';
    });
  });
}
