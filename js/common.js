/* =========================================
   common.js — Shared across all pages
   ========================================= */

'use strict';

/* ── 1. Detect active nav page ── */
function setActiveNavPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkPage = href.split('/').pop();
        link.classList.remove('active');
        if (linkPage === path || (path === '' && linkPage === 'index.html')) {
            link.classList.add('active');
            // Also highlight parent dropdown trigger if it exists
            const parentDropdown = link.closest('.nav-dropdown');
            if (parentDropdown) {
                parentDropdown.querySelector('.dropdown-trigger')?.classList.add('active');
            }
        }
    });
}

/* ── 1.5. Mobile Dropdowns ── */
function initDropdowns() {
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (!trigger) return;
        trigger.addEventListener('click', e => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

/* ── 2. Sticky Header ── */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const onScroll = () => {
        header.classList.toggle('sticky', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── 3. Hamburger Menu ── */
function initHamburger() {
    const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
    const nav = document.getElementById('mainNav') || document.querySelector('.nav');
    if (!hamburger || !nav) return;

    // backdrop
    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nav-overlay';
        overlay.style.cssText = `
            display:none;position:fixed;inset:0;
            background:rgba(0,0,0,.5);backdrop-filter:blur(2px);
            z-index:999;opacity:0;transition:opacity .3s ease;
        `;
        document.body.appendChild(overlay);
    }

    function openNav() {
        hamburger.classList.add('active');
        nav.classList.add('active');
        overlay.style.display = 'block';
        requestAnimationFrame(() => overlay.style.opacity = '1');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () =>
        nav.classList.contains('active') ? closeNav() : openNav()
    );
    overlay.addEventListener('click', closeNav);
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNav));
    document.querySelectorAll('.mobile-nav-cta').forEach(b => b.addEventListener('click', closeNav));
}

/* ── 4. Dark / Light Mode ── */
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Inject the futuristic animated toggle capsule structure
    btn.className = 'theme-toggle-capsule';
    btn.innerHTML = `
        <div class="toggle-track">
            <div class="toggle-thumb">
                <i class="fa-solid fa-sun icon-sun"></i>
                <i class="fa-solid fa-moon icon-moon"></i>
            </div>
        </div>
    `;

    const saved = localStorage.getItem('ndTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ndTheme', newTheme);

        window.dispatchEvent(new Event('themechange'));
    });
}

/* ── 5. Scroll Reveal ── */
function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

/* ── 6. Back to Top ── */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () =>
        btn.classList.toggle('active', window.scrollY > 400), { passive: true });
    btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ── 7. Animated Counters ── */
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
    }, 16);
}

function initCounters() {
    const wrappers = document.querySelectorAll('.counters-section');
    wrappers.forEach(wrap => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                wrap.querySelectorAll('.counter').forEach(animateCounter);
                obs.unobserve(wrap);
            }
        }, { threshold: 0.4 });
        obs.observe(wrap);
    });
}

/* ── 8. Progress / Skill Bars ── */
function initSkillBars() {
    const wrapper = document.querySelector('.skills-section');
    if (!wrapper) return;
    const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
            wrapper.querySelectorAll('.skill-fill').forEach(bar => {
                const w = bar.getAttribute('data-width');
                setTimeout(() => bar.style.width = w, 150);
            });
            obs.unobserve(wrapper);
        }
    }, { threshold: 0.3 });
    obs.observe(wrapper);
}

/* ── 9. FAQ Accordion ── */
function initAccordion() {
    document.querySelectorAll('.accordion-item').forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });
}

/* ── 10. Portfolio Filter ── */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            items.forEach(item => {
                const show = filter === 'all' || item.getAttribute('data-category') === filter;
                item.style.display = show ? 'block' : 'none';
                if (show) item.style.animation = 'fadeInUp .4s ease forwards';
            });
        });
    });
}

/* ── 11. Testimonial Slider ── */
function initSlider(sliderSelector) {
    const slides = document.querySelectorAll(`${sliderSelector} .testimonial-slide`);
    const dotsWrap = document.querySelector(`${sliderSelector} + .slider-dots`) ||
                     document.querySelector('.slider-dots');
    if (!slides.length) return;
    let cur = 0;
    let interval;

    if (dotsWrap) {
        slides.forEach((_, i) => {
            const d = document.createElement('span');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        });
    }

    function goTo(idx) {
        slides[cur].classList.remove('active');
        dotsWrap && dotsWrap.querySelectorAll('.dot')[cur]?.classList.remove('active');
        cur = (idx + slides.length) % slides.length;
        slides[cur].classList.add('active');
        dotsWrap && dotsWrap.querySelectorAll('.dot')[cur]?.classList.add('active');
    }

    function start() { interval = setInterval(() => goTo(cur + 1), 5000); }
    function stop() { clearInterval(interval); }

    start();
    document.querySelector(sliderSelector)?.addEventListener('mouseenter', stop);
    document.querySelector(sliderSelector)?.addEventListener('mouseleave', start);
}

/* ── 12. Contact Form Validation ── */
function initContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
            const group = field.closest('.form-group');
            if (!field.value.trim() ||
                (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
                group?.classList.add('error');
                valid = false;
            } else {
                group?.classList.remove('error');
            }
        });
        if (valid) {
            const btn = form.querySelector('button[type="submit"]');
            const msg = form.querySelector('.success-msg');
            if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
            setTimeout(() => {
                form.reset();
                if (btn) { btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>'; btn.disabled = false; }
                if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 5000); }
            }, 1500);
        }
    });
    form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('input', () => field.closest('.form-group')?.classList.remove('error'));
    });
}

/* ── 13. Loader ── */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    const hideLoader = () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 500);
    };

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
    }
}

/* ── 14. Newsletter ── */
function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button');
            if (btn) { btn.innerHTML = '<i class="fa-solid fa-check"></i>'; btn.style.background = '#10b981'; }
            setTimeout(() => {
                form.reset();
                if (btn) { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>'; btn.style.background = ''; }
            }, 3000);
        });
    });
}

/* ── 15. Inject shared CSS animation keyframe ── */
(function injectKf() {
    const s = document.createElement('style');
    s.textContent = `
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        [data-reveal] { opacity:0; transform:translateY(28px); transition:all .7s cubic-bezier(.5,0,0,1); }
        [data-reveal].revealed { opacity:1; transform:translateY(0); }
        [data-reveal][data-delay="1"] { transition-delay:.1s; }
        [data-reveal][data-delay="2"] { transition-delay:.2s; }
        [data-reveal][data-delay="3"] { transition-delay:.3s; }
        [data-reveal][data-delay="4"] { transition-delay:.4s; }
        [data-reveal][data-delay="5"] { transition-delay:.5s; }
    `;
    document.head.appendChild(s);
})();

/* ── 4.5. Profile / Account Dropdown Toggle ── */
function initProfileDropdown() {
    const toggleBtn = document.getElementById('profile-toggle');
    const dropdownMenu = document.getElementById('profileDropdown');
    if (!toggleBtn || !dropdownMenu) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownMenu.classList.remove('active');
        }
    });
}

/* ── Boot All ── */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initStickyHeader();
    initHamburger();
    initDropdowns();
    initTheme();
    initProfileDropdown();
    setActiveNavPage();
    initScrollReveal();
    initBackToTop();
    initCounters();
    initSkillBars();
    initAccordion();
    initPortfolioFilter();
    initSlider('#testimonialSlider');
    initContactForm('contact-form');
    initNewsletter();
});
