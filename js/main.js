/* =====================================================
   Route9 — main.js  v3.0  (GSAP + Premium UX)
   ===================================================== */
'use strict';

/* ── Wait for DOM ── */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initIntroVideo();
  initCursor();
  initNav();
  initHeroAnimation();
  initScrollReveal();
  initMarquee();
  initCounters();
  initTabs();
  initModal();
  initMagnetic();
  initContact();
  initLogoFallback();
});

/* ════════════════════════════════════════
   INTRO VIDEO OVERLAY
════════════════════════════════════════ */
function initIntroVideo() {
  const overlay = document.getElementById('intro-overlay');
  const video   = document.getElementById('intro-video');
  const skipBtn = document.getElementById('intro-skip');
  if (!overlay || !video) return;

  /* 인트로 재생 중 스크롤 잠금 */
  document.body.style.overflow = 'hidden';

  function dismiss() {
    overlay.classList.add('fade-out');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', () => {
      overlay.classList.add('hidden');
    }, { once: true });
  }

  /* 영상 끝나면 자연스럽게 전환 */
  video.addEventListener('ended', dismiss);

  /* 스킵 버튼 */
  skipBtn?.addEventListener('click', dismiss);

  /* 영상 로드 실패 시 즉시 스킵 (파일 없을 때 대비) */
  video.addEventListener('error', dismiss);
}

/* ════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════ */
function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function tickCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(tickCursor);
  }
  tickCursor();

  /* Hover state on interactive elements */
  const hoverTargets = 'a, button, .svc-card, .why-card, .stat-item, input, textarea, label';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* Hide/show on leave/enter window */
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '1';
    dot.style.opacity  = '1';
  });
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');
  if (!nav) return;

  /* Scrolled state */
  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* Hamburger */
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('.nl').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && links.classList.contains('open')) {
        links.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ════════════════════════════════════════
   HERO ANIMATION  (GSAP)
════════════════════════════════════════ */
function initHeroAnimation() {
  const words = document.querySelectorAll('.h-word');
  const badge = document.querySelector('.hero-badge');
  const sub   = document.querySelector('.hero-sub');
  const btns  = document.querySelector('.hero-actions');
  const scroll= document.querySelector('.hero-scroll');

  if (!words.length) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Badge */
  if (badge) {
    tl.to(badge, { opacity: 1, y: 0, duration: .7, ease: 'power2.out' }, 0.2);
  }

  /* Words slide up from masked overflow */
  tl.to(words, {
    y: 0,
    duration: .9,
    stagger: 0.07,
    ease: 'power3.out'
  }, 0.45);

  /* Subtitle */
  if (sub) {
    tl.to(sub, { opacity: 1, y: 0, duration: .7 }, '-=0.3');
  }

  /* Buttons */
  if (btns) {
    tl.to(btns, { opacity: 1, y: 0, duration: .6 }, '-=0.4');
  }

  /* Scroll hint */
  if (scroll) {
    tl.to(scroll, { opacity: 1, duration: .6 }, '-=0.2');
  }

  /* Subtle video parallax */
  const video = document.querySelector('.hero-video');
  if (video) {
    gsap.to(video, {
      scale: 1,
      y: '8%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
}

/* ════════════════════════════════════════
   SCROLL REVEAL  (GSAP ScrollTrigger)
════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.gsap-reveal');
  if (!elements.length) return;

  elements.forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: .85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* Stats reveal */
  gsap.utils.toArray('.stat-item').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: .7,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  /* Why cards stagger */
  ScrollTrigger.batch('.why-card', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: .8,
      stagger: 0.15, ease: 'power3.out'
    }),
    start: 'top 85%',
    once: true
  });
}

/* ════════════════════════════════════════
   MARQUEE  (CSS animation — ensure double track)
════════════════════════════════════════ */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  /* Duplicate track content for seamless loop */
  track.innerHTML += track.innerHTML;
}

/* ════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════ */
function initCounters() {
  const items = document.querySelectorAll('.stat-item[data-target]');
  if (!items.length) return;

  items.forEach(item => {
    const countEl = item.querySelector('.count');
    const target  = parseInt(item.dataset.target, 10);
    if (!countEl || isNaN(target)) return;

    let triggered = false;

    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        animateCount(countEl, target);
      }
    });
  });
}

function animateCount(el, to) {
  const obj  = { val: 0 };
  const dur  = to > 100 ? 2.2 : 1.8;

  gsap.to(obj, {
    val: to,
    duration: dur,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString('ko-KR');
    },
    onComplete: () => {
      el.textContent = to.toLocaleString('ko-KR');
    }
  });
}

/* ════════════════════════════════════════
   SERVICE TABS
════════════════════════════════════════ */
function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function switchTab(tabId) {
  /* Buttons */
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  /* Panes */
  document.querySelectorAll('.tab-pane').forEach(p => {
    const isTarget = p.id === `tab-${tabId}`;
    p.classList.toggle('active', isTarget);

    if (isTarget) {
      /* Trigger reveals in new pane */
      p.querySelectorAll('.gsap-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: .6, delay: i * 0.05, ease: 'power3.out' }
        );
      });
    }
  });
}

/* Expose for footer links */
window.switchTab = switchTab;

/* ════════════════════════════════════════
   FULLSCREEN SERVICE MODAL
════════════════════════════════════════ */
function initModal() {
  const modal     = document.getElementById('svcModal');
  const closeBtn  = document.getElementById('svcModalClose');
  const modalCta  = document.getElementById('modalCta');
  if (!modal) return;

  /* ── Open on card click ── */
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('click', e => {
      /* Ignore clicks on contact CTAs inside svc-body */
      if (e.target.closest('.svc-cta')) return;
      openModal(card);
    });
  });

  /* ── Close handlers ── */
  closeBtn?.addEventListener('click', closeModal);

  /* Click overlay backdrop (outside modal-box) */
  modal.addEventListener('click', e => {
    if (!e.target.closest('.svc-modal-box') && !e.target.closest('.svc-modal-close')) {
      closeModal();
    }
  });

  /* ESC key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* CTA: close modal then scroll to contact */
  modalCta?.addEventListener('click', () => {
    closeModal();
  });
}

function openModal(card) {
  const modal = document.getElementById('svcModal');
  if (!modal) return;

  /* ── Populate content ── */

  /* Icon */
  const icoEl = card.querySelector('.svc-ico');
  const icoWrap = document.getElementById('modalIco');
  if (icoWrap && icoEl) {
    icoWrap.innerHTML = icoEl.innerHTML;
    /* Force icon to gold color */
    icoWrap.querySelectorAll('svg').forEach(s => {
      s.style.width  = '32px';
      s.style.height = '32px';
      s.style.color  = 'var(--gold)';
    });
  }

  /* Channel label (which tab is active) */
  const activeTab = document.querySelector('.tab-btn.active');
  const labelMap  = {
    google: 'Google Ads', naver: 'Naver Ads',
    kakao:  'Kakao Ads',  meta:  'Meta Ads',
    aeo:    'AEO',        prod:  'Web & Video Production'
  };
  const tabId  = activeTab?.dataset.tab || '';
  const label  = document.getElementById('modalLabel');
  if (label) label.textContent = labelMap[tabId] || 'Service Detail';

  /* Title */
  const titleEl = card.querySelector('.svc-head h4');
  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) modalTitle.textContent = titleEl?.textContent?.trim() || '';

  /* Short summary */
  const shortEl = card.querySelector('.svc-short');
  const modalShort = document.getElementById('modalShort');
  if (modalShort) modalShort.textContent = shortEl?.textContent?.trim() || '';

  /* Full description */
  const descEl = card.querySelector('.svc-desc');
  const modalDesc = document.getElementById('modalDesc');
  if (modalDesc) {
    modalDesc.textContent = descEl?.textContent?.trim() || shortEl?.textContent?.trim() || '';
  }

  /* Meta items */
  const metaEls = card.querySelectorAll('.svc-meta');
  const modalMetas = document.getElementById('modalMetas');
  if (modalMetas) {
    modalMetas.innerHTML = '';
    metaEls.forEach(meta => {
      const k = meta.querySelector('.meta-k');
      const p = meta.querySelector('p');
      if (!k && !p) return;
      const div = document.createElement('div');
      div.className = 'svc-modal-meta';
      div.innerHTML = `
        <span class="svc-modal-meta-k">${k?.textContent?.trim() || ''}</span>
        <p>${p?.textContent?.trim() || ''}</p>
      `;
      modalMetas.appendChild(div);
    });
  }

  /* ── Show modal ── */
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* GSAP animation: box slides up + fades in */
  gsap.fromTo('.svc-modal-box',
    { scale: 0.88, y: 40, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' }
  );
}

function closeModal() {
  const modal = document.getElementById('svcModal');
  if (!modal || !modal.classList.contains('open')) return;

  /* GSAP out */
  gsap.to('.svc-modal-box', {
    scale: 0.92, y: 24, opacity: 0,
    duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: .4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
function initContact() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMsg   = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btnTxt  = submitBtn.querySelector('.btn-txt');
    const btnSpin = submitBtn.querySelector('.btn-spin');
    submitBtn.disabled = true;
    if (btnTxt)  btnTxt.style.display  = 'none';
    if (btnSpin) btnSpin.style.display = 'inline';
    formMsg.className = 'form-msg';
    formMsg.textContent = '';

    const data = {
      company: form.company.value.trim(),
      email:   form.email.value.trim(),
      phone:   form.phone.value.trim(),
      url:     form.url.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch('contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        showMsg('success', '상담 신청이 완료되었습니다. 24시간 내에 연락드리겠습니다.');
        form.reset();
      } else throw new Error();
    } catch {
      const sub = encodeURIComponent(`[루트9 상담 신청] ${data.company}`);
      const bod = encodeURIComponent(`업체명: ${data.company}\n이메일: ${data.email}\n연락처: ${data.phone}\n사이트: ${data.url || '없음'}\n\n문의내용:\n${data.message}`);
      window.open(`mailto:route9master@gmail.com?subject=${sub}&body=${bod}`, '_blank');
      showMsg('success', '이메일 클라이언트가 열립니다. 전송 후 24시간 내 연락드리겠습니다.');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      if (btnTxt)  btnTxt.style.display  = 'inline';
      if (btnSpin) btnSpin.style.display = 'none';
    }
  });

  function showMsg(type, text) {
    formMsg.className = `form-msg ${type}`;
    formMsg.textContent = text;
    gsap.fromTo(formMsg, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 });
  }

  function validateForm(f) {
    let valid = true;
    ['company', 'email', 'phone', 'message'].forEach(name => {
      const el = f[name];
      if (!el) return;
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (!f.privacy.checked) {
      valid = false;
      showMsg('error', '개인정보 수집 및 이용에 동의해주세요.');
    }
    if (!valid && document.querySelector('.error')) {
      document.querySelector('.error').focus();
    }
    return valid;
  }

  /* Input focus animations */
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, { scale: 1.01, duration: .2, ease: 'power2.out' });
    });
    input.addEventListener('blur', () => {
      gsap.to(input, { scale: 1, duration: .2 });
      input.classList.remove('error');
    });
  });
}

/* ════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════
   LOGO FALLBACK
════════════════════════════════════════ */
function initLogoFallback() {
  document.querySelectorAll('.nav-logo-img, .footer-logo-img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
}

/* ════════════════════════════════════════
   SECTION SCROLL ANIMATIONS (extras)
════════════════════════════════════════ */
/* Stagger service cards on first tab */
window.addEventListener('load', () => {
  const firstPane = document.querySelector('.tab-pane.active');
  if (!firstPane) return;

  firstPane.querySelectorAll('.svc-card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: .65,
        delay: 0.1 + i * 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });
});
