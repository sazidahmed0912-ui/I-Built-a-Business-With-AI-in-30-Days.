/**
 * Shared front-end behaviour for the sales page.
 * Reads all copy/URLs from SITE_CONFIG (config.js) — nothing here
 * should need editing when you update your book, price, or URLs.
 */
(function () {
  "use strict";

  /* -----------------------------------------------------------
   * Analytics — clean, configurable, no fake events.
   * Wires up to any window.gtag / window.analytics that exists;
   * if ANALYTICS_ID is empty, events are simply no-ops logged to
   * the console in development so the integration points stay
   * visible without pretending data is being collected.
   * --------------------------------------------------------- */
  function track(eventName, detail) {
    var hasAnalyticsId = !!(window.SITE_CONFIG && window.SITE_CONFIG.ANALYTICS_ID);
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, detail || {});
      return;
    }
    if (window.analytics && typeof window.analytics.track === "function") {
      window.analytics.track(eventName, detail || {});
      return;
    }
    if (!hasAnalyticsId) {
      // No analytics provider configured yet — intentionally silent
      // in production, logged here only to confirm the hook fires.
      // console.debug("[analytics:noop]", eventName, detail);
    }
  }
  window.SITE_TRACK = track;

  document.addEventListener("DOMContentLoaded", function () {
    track("page_view", { path: window.location.pathname });

    applyConfig();
    wireCtaClicks();
    wireFaq();
    wireScrollDepth();
    wireReveal();
    wireStickyCta();
  });

  /* -----------------------------------------------------------
   * Apply SITE_CONFIG values to any element carrying a
   * data-config attribute, so URLs/text live in one file.
   *   data-config="PAYMENT_URL"      -> sets href
   *   data-config-text="BOOK_TITLE"  -> sets textContent
   * --------------------------------------------------------- */
  function applyConfig() {
    if (!window.SITE_CONFIG) return;
    var cfg = window.SITE_CONFIG;

    document.querySelectorAll("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      if (!cfg[key]) return;
      var href = key === "SUPPORT_EMAIL" ? "mailto:" + cfg[key] : cfg[key];
      el.setAttribute("href", href);
    });

    document.querySelectorAll("[data-config-text]").forEach(function (el) {
      var key = el.getAttribute("data-config-text");
      if (cfg[key]) el.textContent = cfg[key];
    });

    // Book cover image swap-in, only if a real image was configured.
    if (cfg.BOOK_COVER_IMAGE) {
      document.querySelectorAll(".cover").forEach(function (coverEl) {
        coverEl.classList.add("has-img");
        coverEl.innerHTML =
          '<img class="cover-img" src="' +
          cfg.BOOK_COVER_IMAGE +
          '" alt="' +
          (cfg.BOOK_TITLE || "Book cover") +
          '">';
      });
    }

    // Price display, only if a real price was configured.
    if (cfg.PRICE) {
      document.querySelectorAll("[data-config-price]").forEach(function (el) {
        el.textContent = cfg.PRICE + " " + (cfg.CURRENCY || "");
        el.hidden = false;
      });
    }
  }

  /* -----------------------------------------------------------
   * CTA click tracking (does not interfere with navigation —
   * the anchor's href, set from PAYMENT_URL, does the work).
   * --------------------------------------------------------- */
  function wireCtaClicks() {
    document.querySelectorAll("[data-cta='payment']").forEach(function (el) {
      el.addEventListener("click", function () {
        track("payment_button_click", { location: el.dataset.ctaLocation || "unknown" });
      });
    });
    document.querySelectorAll("[data-cta='download']").forEach(function (el) {
      el.addEventListener("click", function () {
        track("download_button_click", {});
      });
    });
  }

  /* -----------------------------------------------------------
   * FAQ accordion analytics (native <details> handles the UI).
   * --------------------------------------------------------- */
  function wireFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          var q = item.querySelector("summary");
          track("faq_opened", { question: q ? q.textContent.trim() : "" });
        }
      });
    });
  }

  /* -----------------------------------------------------------
   * Scroll depth tracking at 25/50/75/100%.
   * --------------------------------------------------------- */
  function wireScrollDepth() {
    var thresholds = [25, 50, 75, 100];
    var fired = {};
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var scrollTop = window.scrollY || doc.scrollTop;
        var height = doc.scrollHeight - doc.clientHeight;
        var pct = height > 0 ? Math.round((scrollTop / height) * 100) : 100;

        thresholds.forEach(function (t) {
          if (pct >= t && !fired[t]) {
            fired[t] = true;
            track("scroll_depth", { percent: t });
          }
        });
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -----------------------------------------------------------
   * Single, restrained reveal-on-scroll treatment.
   * --------------------------------------------------------- */
  function wireReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------------------
   * Sticky mobile CTA: appears once the hero CTA scrolls out of
   * view, hides again near the footer so it never covers the
   * final CTA button or footer content.
   * --------------------------------------------------------- */
  function wireStickyCta() {
    var sticky = document.querySelector(".sticky-cta");
    var heroCta = document.querySelector("[data-cta='payment'][data-cta-location='hero']");
    var footer = document.querySelector(".site-footer");
    if (!sticky || !heroCta) return;

    var heroPassed = false;
    var nearFooter = false;

    var heroObserver = new IntersectionObserver(
      function (entries) {
        heroPassed = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
        update();
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroCta);

    if (footer) {
      var footerObserver = new IntersectionObserver(
        function (entries) {
          nearFooter = entries[0].isIntersecting;
          update();
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      footerObserver.observe(footer);
    }

    function update() {
      var shouldShow = heroPassed && !nearFooter;
      sticky.classList.toggle("visible", shouldShow);
    }
  }
})();
