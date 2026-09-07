/* ==========================================================
   BIS Intelligence — Shared Script
   Sticky navbar shadow-on-scroll, mobile nav toggle, smooth
   in-page scrolling with sticky-header offset, and small
   homepage interactions (hero search, example chips).
   Reused as-is across every page of the site.
   ========================================================== */
(function () {
  "use strict";

  // Override this in the page with: window.BIS_API_BASE = "http://127.0.0.1:8000";
  window.BIS_API_BASE = window.BIS_API_BASE || "http://127.0.0.1:8000";

  var NAV_SELECTOR = ".topnav";
  var HAMBURGER_ID = "hamburgerBtn";
  var SHEET_ID = "mobileSheet";

  /* ---------- Sticky navbar shadow ---------- */
  function initNavShadow() {
    var nav = document.querySelector(NAV_SELECTOR);
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 4) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initMobileNav() {
    var btn = document.getElementById(HAMBURGER_ID);
    var sheet = document.getElementById(SHEET_ID);
    if (!btn || !sheet) return;

    var openIcon = btn.getAttribute("data-icon-open") || btn.innerHTML;
    var closeIconMarkup =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    function setOpen(open) {
      sheet.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.innerHTML = open ? closeIconMarkup : openIcon;
    }

    btn.addEventListener("click", function () {
      setOpen(!sheet.classList.contains("open"));
    });

    sheet.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("open")) setOpen(false);
    });
  }

  /* ---------- Smooth in-page scrolling ----------
     html{scroll-behavior:smooth} + scroll-padding-top already
     handles most browsers. This adds a JS fallback and makes
     sure focus lands on the target for accessibility. */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      link.addEventListener("click", function (e) {
        var target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.pushState(null, "", hash);
      });
    });
  }

  /* ---------- Lazy image fallback (belt-and-braces) ----------
     Every <img> in an .img-frame already carries an inline
     onerror handler in the markup. This adds the same behavior
     via JS for any image that lacks it, and re-checks images
     that may already have failed before this script ran. */
  function initImageFallbacks() {
    document.querySelectorAll(".img-frame img").forEach(function (img) {
      function handleError() {
        img.classList.add("img-frame__img--failed");
      }
      img.addEventListener("error", handleError);
      if (img.complete && img.naturalWidth === 0) handleError();
    });
  }

  /* ---------- Shared demo dataset ----------
     Used by find-standards.html, compliance.html, evidence.html,
     and laboratories.html. There is no live backend in this
     prototype, so every page that "searches" is really filtering
     this in-memory array — always labeled as demo data in the UI. */
  var ICONS = {
    check:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    alert:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.3 3.5L2 18a1.5 1.5 0 001.3 2.3h17.4A1.5 1.5 0 0022 18L13.7 3.5a1.5 1.5 0 00-2.6 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
    file:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    eye:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    mapPin:
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    flask:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-2.5L14 9V3" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
    filter:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16l-6.5 8v6l-3 2v-8L4 5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
    search:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  var DEMO_STANDARDS = [
    { number: "IS 302 (Part 1):2008", title: "Safety of Household and Similar Electrical Appliances — General Requirements", category: "Electrical Appliances", version: "5th Revision", status: "Current", verification: "Verified", evidence: 3, keywords: "electrical appliance household safety" },
    { number: "IS 9845:1998", title: "Method of Test for Migration of Constituents from Plastics Materials in Contact with Food", category: "Food-Contact Plastics", version: "1st Revision", status: "Current", verification: "Verified", evidence: 2, keywords: "food contact plastic migration material" },
    { number: "IS 302 (Part 2/Sec 1):2016", title: "Particular Requirements for Electric Water Heaters", category: "Electrical Appliances", version: "2nd Revision", status: "Current", verification: "Verified", evidence: 4, keywords: "water heater electrical appliance" },
    { number: "IS 13252 (Part 1):2010", title: "Information Technology Equipment — Safety, General Requirements", category: "IT Equipment", version: "2nd Revision", status: "Current", verification: "Unverified", evidence: 1, keywords: "it equipment computer safety information technology" },
    { number: "IS 1554 (Part 1):1988", title: "PVC Insulated (Heavy Duty) Electric Cables — Working Voltages up to 1100V", category: "Cables & Wiring", version: "1st Revision", status: "Obsolete — superseded", verification: "Verified", evidence: 2, keywords: "pvc cable wiring electric insulated" }
  ];

  var DEMO_EVIDENCE = [
    { title: "IS 302 (Part 1):2008 — General Requirements", standard: "IS 302 (Part 1):2008", version: "5th Revision", status: "Current", verification: "Verified", source: "Bureau of Indian Standards", page: 14, section: "Clause 7.1 — Marking", text: "Every appliance shall be marked in a legible and durable manner with the rated voltage, rated input, and the name or trademark of the manufacturer.", chunks: 6 },
    { title: "IS 9845:1998 — Migration Testing Method", standard: "IS 9845:1998", version: "1st Revision", status: "Current", verification: "Verified", source: "Bureau of Indian Standards", page: 6, section: "Clause 4.2 — Test Conditions", text: "The specimen shall be brought into contact with the specified food simulant for the duration and at the temperature appropriate to its intended end use.", chunks: 4 },
    { title: "IS 302 (Part 2/Sec 1):2016 — Water Heaters", standard: "IS 302 (Part 2/Sec 1):2016", version: "2nd Revision", status: "Current", verification: "Verified", source: "Bureau of Indian Standards", page: 22, section: "Clause 11 — Heating", text: "Appliances shall not attain a temperature likely to endanger the safety of the user during normal operation as defined in Clause 3.", chunks: 5 }
  ];

  var DEMO_LABS = [
    { name: "National Test House, Kolkata", categories: ["Electrical Appliances", "Cables & Wiring"], location: "Kolkata, WB" },
    { name: "CIPET Testing Centre, Chennai", categories: ["Food-Contact Plastics", "Polymers"], location: "Chennai, TN" },
    { name: "ERTL (East), Kolkata", categories: ["IT Equipment", "Electrical Appliances"], location: "Kolkata, WB" },
    { name: "STQC Testing Centre, Bengaluru", categories: ["IT Equipment"], location: "Bengaluru, KA" }
  ];

  function demoTagHtml() {
    return (
      '<span class="tag tag-neutral" title="Prototype demo data — not a live backend response">' +
      ICONS.alert +
      " Demo data</span>"
    );
  }

  function statusTagHtml(status) {
    if (/obsolete/i.test(status)) return '<span class="tag tag-lo">' + status + "</span>";
    return '<span class="tag tag-hi">' + ICONS.check + " " + status + "</span>";
  }

  function verifyTagHtml(v) {
    if (/unverified/i.test(v)) return '<span class="tag tag-warn">' + ICONS.alert + " " + v + "</span>";
    return '<span class="tag tag-primary">' + ICONS.check + " " + v + "</span>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function standardCardHtml(s) {
    var number = s.number || s.standard || "Unspecified standard";
    var title = s.title || "Untitled standard";
    var category = s.category || "General";
    var version = s.version || "—";
    var status = s.status || "Unknown";
    var verification = s.verification || (s.verified ? "Verified" : "Unverified");
    var score = s.match_score != null ? s.match_score : null;
    var sourceUrl = s.source_url || "https://www.bis.gov.in/";

    return (
      '<div class="result-card">' +
      '<div class="result-top"><div><div class="std-number">' +
      escapeHtml(number) +
      '</div><div class="std-title">' +
      escapeHtml(title) +
      '</div></div><div class="result-meta">' +
      statusTagHtml(escapeHtml(status)) +
      "</div></div>" +
      '<div class="result-meta"><span class="tag tag-neutral">' +
      escapeHtml(category) +
      "</span>" +
      verifyTagHtml(escapeHtml(verification)) +
      (score != null ? '<span class="tag tag-neutral">' + ICONS.search + " " + escapeHtml(score) + "% match</span>" : "") +
      "</div>" +
      '<div class="meta-row">' +
      '<div class="meta-cell"><div class="k">Version</div><div class="v">' + escapeHtml(version) + "</div></div>" +
      '<div class="meta-cell"><div class="k">Category</div><div class="v">' + escapeHtml(category) + "</div></div>" +
      '<div class="meta-cell"><div class="k">Status</div><div class="v">' + escapeHtml(status) + "</div></div>" +
      '<div class="meta-cell"><div class="k">Verification</div><div class="v">' + escapeHtml(verification) + "</div></div>" +
      "</div>" +
      '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">' +
      '<a href="' + escapeHtml(sourceUrl) + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">' + ICONS.eye + " View BIS source</a>" +
      '<a href="compliance.html?q=' + encodeURIComponent(number + " " + title) + '" class="btn btn-ghost btn-sm">Analyze compliance</a>' +
      "</div></div>"
    );
  }

  /* ---------- Find Standards page ---------- */
  function initFindStandards() {
    // The current page uses standardsSearchForm/standardsSearch/standardsResults.
    // The older prototype used findForm/findInput/findResults, so support both.
    var form = document.getElementById("standardsSearchForm") || document.getElementById("findForm");
    var input = document.getElementById("standardsSearch") || document.getElementById("findInput");
    var categoryInput = document.getElementById("standardsCategory");
    var resultsEl = document.getElementById("standardsResults") || document.getElementById("findResults");
    var summaryEl = document.getElementById("standardsCount") || document.getElementById("findSummary");
    var emptyEl = document.getElementById("standardsEmpty");
    if (!form || !input || !resultsEl) return;

    var API = window.BIS_API_BASE || "http://127.0.0.1:8000";

    function render(matches, q, sourceLabel) {
      if (summaryEl) {
        var text = matches.length + " result" + (matches.length === 1 ? "" : "s");
        if (q) text += ' for "' + escapeHtml(q) + '"';
        summaryEl.innerHTML = text + (sourceLabel ? ' <span class="tag tag-neutral" style="margin-left:8px;">' + escapeHtml(sourceLabel) + '</span>' : "");
      }

      resultsEl.innerHTML = matches.map(standardCardHtml).join("");
      if (emptyEl) emptyEl.hidden = matches.length !== 0;
    }

    function renderLoading() {
      resultsEl.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:32px;">' + ICONS.search + ' Searching the indexed BIS standards library…</div>';
      if (emptyEl) emptyEl.hidden = true;
    }

    async function runSearch(query) {
      var q = (query || "").trim();
      input.value = q;
      renderLoading();

      var params = new URLSearchParams();
      if (q) params.set("q", q);
      if (categoryInput && categoryInput.value) params.set("category", categoryInput.value);

      try {
        var response = await fetch(API + "/api/standards?" + params.toString(), {
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        var data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid search response");

        render(data, q, "Live backend");
      } catch (error) {
        console.warn("BIS standards search unavailable; using demo index.", error);
        var lowerQ = q.toLowerCase();
        var category = categoryInput ? categoryInput.value.toLowerCase() : "";
        var matches = DEMO_STANDARDS.filter(function (item) {
          var haystack = (item.number + " " + item.title + " " + item.category + " " + item.keywords).toLowerCase();
          return (!lowerQ || haystack.indexOf(lowerQ) !== -1) && (!category || item.category.toLowerCase().indexOf(category) !== -1);
        });
        render(matches, q, "Demo fallback — backend unavailable");
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch(input.value);
    });

    if (categoryInput) {
      categoryInput.addEventListener("change", function () {
        runSearch(input.value);
      });
    }

    document.querySelectorAll("[data-standard-query], .find-example[data-q]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var q = chip.getAttribute("data-standard-query") || chip.getAttribute("data-q") || "";
        runSearch(q);
      });
    });

    var params = new URLSearchParams(window.location.search);
    runSearch(params.get("q") || "");
  }

  /* ---------- Homepage: hero search + example chips ---------- */
  function initHeroSearch() {
    var form = document.getElementById("heroSearchForm");
    var input = document.getElementById("heroSearchInput");
    if (form && input) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = input.value.trim();
        window.location.href =
          "compliance.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      });
    }
    document.querySelectorAll(".example-chip[data-q]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var q = chip.getAttribute("data-q");
        window.location.href = "compliance.html?q=" + encodeURIComponent(q);
      });
    });
  }

  /* ---------- FAQ accordion (about.html, contact.html, future faq.html) ---------- */
  function initFaqAccordion() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      if (!q) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------- Contact form (Web3Forms) ----------
     Works with any <form data-web3forms> containing a
     `[data-form-status]` element for feedback. Submits via fetch
     so the person stays on the page; falls back to a normal POST
     if fetch/JS is unavailable. */
  function initContactForm() {
    var form = document.querySelector("form[data-web3forms]");
    if (!form) return;
    var status = form.querySelector("[data-form-status]");
    var submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(kind, message) {
      if (!status) return;
      status.className = "form-status visible " + kind;
      status.textContent = message;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var accessKey = form.querySelector('input[name="access_key"]');
      if (!accessKey || !accessKey.value || accessKey.value.indexOf("YOUR_") === 0) {
        setStatus(
          "error",
          "This form needs a Web3Forms access key before it can send messages. Add one at web3forms.com and paste it into the hidden access_key field."
        );
        return;
      }

      var formData = new FormData(form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }
      setStatus("pending", "Sending your message…");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            setStatus(
              "success",
              "Message sent. We'll get back to you at the email address you provided."
            );
            form.reset();
          } else {
            setStatus(
              "error",
              data.message || "Something went wrong sending your message. Please try again."
            );
          }
        })
        .catch(function () {
          setStatus(
            "error",
            "Could not reach the form service. Check your connection and try again."
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || "Send message";
          }
        });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNavShadow();
    initMobileNav();
    initSmoothScroll();
    initImageFallbacks();
    initHeroSearch();
    initFaqAccordion();
    initContactForm();
    // Find Standards and Compliance Assistant are initialized by site-pages.js.
  });
})();
