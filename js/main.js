/* =============================================================
   Danfo portfolio: David Nnodu
   Small interactions, each in its own function, started by init().
   1. NEPA toggle (dark mode)
   2. Conductor call-outs in the hero
   3. Bus moving along the projects route
   4. Mobile menu
   5. Section highlight on the project page
   6. Footer year
   No libraries.
   ============================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ---------- Helpers ---------- */

  // localStorage can throw when storage is blocked, so never let it break the page
  function saveSetting(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;
    void toast.offsetWidth; // restart the fade-in
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.hidden = true; }, 250);
    }, 1500);
  }


  /* ---------- 1. NEPA toggle (dark mode) ---------- */

  function isLightOff() {
    return root.getAttribute('data-theme') === 'night';
  }

  function updateNepaButtons() {
    var off = isLightOff();
    document.querySelectorAll('.nepa-toggle').forEach(function (button) {
      button.setAttribute('aria-pressed', off ? 'true' : 'false');
      button.querySelector('.nepa-label').textContent = off ? 'No light' : 'NEPA';
      button.title = off
        ? 'Light is off (dark mode). Click to bring NEPA back.'
        : 'NEPA: what Nigerians still call the power company. Click to turn the light off (dark mode).';
    });
  }

  function setLightOff(off) {
    if (off) {
      root.setAttribute('data-theme', 'night');
    } else {
      root.removeAttribute('data-theme');
    }
    saveSetting('nepa', off ? 'off' : 'on');
    updateNepaButtons();
  }

  function initNepa() {
    updateNepaButtons();

    document.querySelectorAll('.nepa-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        // Light is off: bring it back and celebrate
        if (isLightOff()) {
          setLightOff(false);
          showToast('Up NEPA!');
          return;
        }

        // Light is on: flicker, then off
        if (reduceMotion.matches) {
          setLightOff(true);
          return;
        }
        root.classList.add('flicker');
        setTimeout(function () {
          root.classList.remove('flicker');
          setLightOff(true);
        }, 400);
      });
    });
  }


  /* ---------- 4. Mobile menu ---------- */

  function initMenu() {
    var button = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!button || !nav) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        button.focus();
      }
    });
  }


  /* ---------- 6. Footer year ---------- */

  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = year; });
  }


  /* ---------- Start ---------- */

  function init() {
    initNepa();
    initMenu();
    initYear();
  }

  init();
})();
