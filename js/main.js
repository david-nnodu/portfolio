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


  /* ---------- 2. Conductor call-outs ---------- */

  function initCallouts() {
    var text = document.getElementById('callout-text');
    if (!text || reduceMotion.matches) return;

    var lines = [
      'Yaba! Lekki! Production! Enter with your change o.',
      'One chance remain! Enter, e dey go!',
      'Straight to deploy, no stopping!'
    ];
    var index = 0;

    setInterval(function () {
      text.classList.add('is-changing');
      setTimeout(function () {
        index = (index + 1) % lines.length;
        text.textContent = lines[index];
        text.classList.remove('is-changing');
      }, 250);
    }, 3500);
  }


  /* ---------- 3. Bus moving along the projects route ---------- */
  // Desktop: the bus moves along the horizontal bar when you hover or focus a project.
  // Tablet and mobile: the route is vertical and the bus follows you as you scroll.

  function initRoute() {
    var wrap = document.querySelector('.route-wrap');
    if (!wrap) return;

    var bus = wrap.querySelector('.route-bus');
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.ticket'));
    var barStops = Array.prototype.slice.call(wrap.querySelectorAll('.route-bar .stop'));
    var desktop = window.matchMedia('(min-width: 1024px)');
    var current = 0;

    // The dot the bus should sit on for project number `index`
    function dotFor(index) {
      if (desktop.matches) {
        var stop = barStops[index + 1]; // stop 0 on the bar is "Driver"
        return stop && stop.querySelector('.stop-dot');
      }
      return cards[index] && cards[index].querySelector('.card-stop');
    }

    function moveBus() {
      var dot = dotFor(current);
      if (!dot) return;
      var wrapBox = wrap.getBoundingClientRect();
      var dotBox = dot.getBoundingClientRect();
      bus.style.setProperty('--bus-x', (dotBox.left - wrapBox.left + dotBox.width / 2) + 'px');
      bus.style.setProperty('--bus-y', (dotBox.top - wrapBox.top + dotBox.height / 2) + 'px');
    }

    function setCurrent(index) {
      current = index;
      barStops.forEach(function (stop, i) {
        stop.classList.toggle('is-current', i === index + 1);
      });
      cards.forEach(function (card, i) {
        card.classList.toggle('is-current', i === index);
      });
      moveBus();
    }

    // Place the bus without animating the first time
    bus.hidden = false;
    bus.classList.add('no-anim');
    setCurrent(0);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bus.classList.remove('no-anim'); });
    });

    // Desktop: hover or keyboard focus picks the stop
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { if (desktop.matches) setCurrent(i); });
      card.addEventListener('focusin', function () { setCurrent(i); });
    });

    // Mobile and tablet: whichever card crosses the middle of the screen
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (desktop.matches) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(cards.indexOf(entry.target));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      cards.forEach(function (card) { observer.observe(card); });
    }

    // Layout changes (resize, fonts loading, images loading) move the dots
    var frame;
    function remeasure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        bus.classList.add('no-anim');
        moveBus();
        requestAnimationFrame(function () { bus.classList.remove('no-anim'); });
      });
    }
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
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
    initCallouts();
    initRoute();
    initMenu();
    initYear();
  }

  init();
})();
