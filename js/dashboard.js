/* =========================================
   NexusDigital — Dashboard SPA Engine
   ========================================= */
(function () {
  'use strict';

  // ── Theme init ──────────────────────────────
  const saved = localStorage.getItem('ndTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {

    // ── Element Declarations (Solved temporal dead zone error) ────────────────
    const hamburger = document.getElementById('dash-hamburger');
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const links = document.querySelectorAll('.sidebar-link[data-section]');
    const sections = document.querySelectorAll('.dash-section');
    const pageTitle = document.getElementById('dash-page-title');

    function openSidebar() {
      if (sidebar) sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showSection(id) {
      sections.forEach(function (s) {
        s.classList.remove('active-section', 'fade-in');
      });
      links.forEach(function (l) {
        l.classList.remove('active');
      });
      
      const target = document.getElementById('sec-' + id);
      if (target) {
        target.classList.add('active-section');
        // Force browser reflow to trigger opacity transition
        void target.offsetWidth;
        target.classList.add('fade-in');
      }

      const activeLink = document.querySelector('.sidebar-link[data-section="' + id + '"]');
      if (activeLink) {
        activeLink.classList.add('active');
        if (pageTitle) {
          pageTitle.textContent = activeLink.querySelector('.link-label') 
            ? activeLink.querySelector('.link-label').textContent 
            : activeLink.textContent.trim();
        }
      }
      
      // Close mobile sidebar console drawer after click
      closeSidebar();
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showSection(this.dataset.section);
      });
    });

    // Show default section
    const defaultSec = document.querySelector('.sidebar-link[data-section].active');
    if (defaultSec) {
      showSection(defaultSec.dataset.section);
    } else if (links.length) {
      showSection(links[0].dataset.section);
    }

    // ── Mobile sidebar bindings ────────────────
    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // ── Theme toggle ─────────────────────────
    const themeBtn = document.getElementById('dash-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ndTheme', next);
        this.querySelector('i').className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      });
      // Set correct icon
      const cur = document.documentElement.getAttribute('data-theme');
      themeBtn.querySelector('i').className = cur === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // ── Skill bar animation ───────────────────
    document.querySelectorAll('.skill-fill[data-width]').forEach(function (el) {
      setTimeout(function () { el.style.width = el.dataset.width; }, 300);
    });
  });
})();
