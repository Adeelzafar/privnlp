/* PrivNLP site script: theme toggle, copy buttons, paper filters, table sorting.
   Everything degrades gracefully: without JavaScript all content is still shown. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Light / dark toggle ---- */
  var toggle = document.getElementById("theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  function effectiveTheme() {
    return root.getAttribute("data-theme") || (media.matches ? "dark" : "light");
  }
  function updateToggle() {
    if (!toggle) return;
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    toggle.querySelector(".theme-toggle-label").textContent = next === "dark" ? "Dark" : "Light";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      updateToggle();
    });
    if (media.addEventListener) media.addEventListener("change", updateToggle);
    updateToggle();
  }

  /* ---- Copy to clipboard (BibTeX, citations) ---- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }
  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-copy]");
    if (!btn) return;
    var src = document.getElementById(btn.getAttribute("data-copy"));
    if (!src) return;
    var label = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", label);
    copyText(src.textContent.trim()).then(function () {
      btn.textContent = "Copied";
    }, function () {
      btn.textContent = "Select the text and copy it manually";
    });
    setTimeout(function () { btn.textContent = label; }, 2200);
  });

  /* ---- Paper search and filters ---- */
  var form = document.getElementById("paper-filter");
  if (form) {
    var papers = Array.prototype.slice.call(document.querySelectorAll(".paper"));
    var groups = Array.prototype.slice.call(document.querySelectorAll("[data-year-group]"));
    var count = document.getElementById("paper-count");
    var empty = document.getElementById("paper-empty");

    function apply() {
      var q = form.q.value.trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var year = form.year.value, topic = form.topic.value, status = form.status.value;
      var shown = 0;
      papers.forEach(function (p) {
        var text = p.getAttribute("data-text") || "";
        var topics = (p.getAttribute("data-topics") || "").split("|");
        var ok = (!year || p.getAttribute("data-year") === year) &&
                 (!status || p.getAttribute("data-status") === status) &&
                 (!topic || topics.indexOf(topic) !== -1) &&
                 terms.every(function (t) { return text.indexOf(t) !== -1; });
        p.hidden = !ok;
        if (ok) shown++;
      });
      groups.forEach(function (g) { g.hidden = !g.querySelector(".paper:not([hidden])"); });
      count.textContent = shown === papers.length ? papers.length + " papers"
                        : shown + " of " + papers.length + " papers shown";
      empty.hidden = shown !== 0;

      var params = new URLSearchParams();
      if (q) params.set("q", q);
      if (year) params.set("year", year);
      if (topic) params.set("topic", topic);
      if (status) params.set("status", status);
      var qs = params.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
    }

    // Restore filters from the URL (topic tags link here with ?topic=...).
    var init = new URLSearchParams(location.search);
    ["q", "year", "topic", "status"].forEach(function (k) {
      if (init.get(k) && form[k]) form[k].value = init.get(k);
    });
    form.addEventListener("input", apply);
    form.addEventListener("change", apply);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    form.addEventListener("reset", function () { setTimeout(apply, 0); });
    apply();
  }

  /* ---- Sortable tables (benchmark) ---- */
  Array.prototype.forEach.call(document.querySelectorAll("table.sortable"), function (table) {
    var headers = table.querySelectorAll("thead th");
    Array.prototype.forEach.call(headers, function (th, col) {
      var btn = th.querySelector("button[data-sort]");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var numeric = btn.getAttribute("data-sort") === "num";
        var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
        Array.prototype.forEach.call(headers, function (h) { h.removeAttribute("aria-sort"); });
        th.setAttribute("aria-sort", dir);
        var tbody = table.tBodies[0];
        var rows = Array.prototype.slice.call(tbody.rows);
        rows.sort(function (a, b) {
          var ca = a.cells[col], cb = b.cells[col];
          var va = ca.hasAttribute("data-value") ? ca.getAttribute("data-value") : ca.textContent.trim();
          var vb = cb.hasAttribute("data-value") ? cb.getAttribute("data-value") : cb.textContent.trim();
          if (numeric) {
            if (va === "" && vb === "") return 0;
            if (va === "") return 1;          // unmeasured values always last
            if (vb === "") return -1;
            return dir === "ascending" ? va - vb : vb - va;
          }
          return dir === "ascending" ? va.localeCompare(vb) : vb.localeCompare(va);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  });
})();
