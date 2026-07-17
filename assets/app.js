/* =====================================================================
   CNCF Graduated Projects — app shell logic
   Manifest-driven, dependency-free. Works as static files on GitHub Pages.
   - fetches content/manifest.json (relative path)
   - builds section-grouped nav with progress
   - overview (landing) view built straight from the manifest
   - loads a "done" item into an isolated <iframe src="content/<file>">
   - reflects the current item in the URL hash (#<slug>) for linkable views
   ===================================================================== */
(function () {
  "use strict";

  var MANIFEST_URL = "content/manifest.json";
  var CONTENT_DIR = "content/";
  var state = { manifest: null, byId: {} };

  var el = {
    sidebar: document.getElementById("sidebar"),
    main: document.getElementById("main"),
    progressFill: document.getElementById("progressFill"),
    progressLabel: document.getElementById("progressLabel")
  };

  /* ------------------------------- utils ------------------------------ */
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.slice(0, 2) === "on" && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] != null) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function sortByOrder(a, b) { return (a.order || 0) - (b.order || 0); }

  function sectionsSorted() {
    return (state.manifest.sections || []).slice().sort(sortByOrder);
  }

  function itemsInSection(sectionId) {
    return state.manifest.items
      .filter(function (i) { return i.sectionId === sectionId; })
      .sort(sortByOrder);
  }

  function isDone(item) { return item.status === "done"; }

  /* ------------------------------ routing ----------------------------- */
  function currentSlug() {
    var hash = (location.hash || "").replace(/^#/, "");
    return hash && hash !== "overview" ? decodeURIComponent(hash) : null;
  }

  function navigate(slug) {
    location.hash = slug ? "#" + encodeURIComponent(slug) : "#overview";
  }

  /* ------------------------------ progress ---------------------------- */
  function progress() {
    var items = state.manifest.items;
    var done = items.filter(isDone).length;
    return { done: done, total: items.length };
  }

  function renderProgress() {
    var p = progress();
    var pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
    el.progressFill.style.width = pct + "%";
    el.progressLabel.textContent = p.done + " / " + p.total + " done";
  }

  /* -------------------------------- nav ------------------------------- */
  function renderNav() {
    clear(el.sidebar);
    var active = currentSlug();

    sectionsSorted().forEach(function (sec) {
      var items = itemsInSection(sec.id);
      if (!items.length) return;
      var doneCount = items.filter(isDone).length;

      var wrap = h("div", { class: "nav-section" });
      wrap.appendChild(h("h3", {}, [
        sec.title,
        h("span", { class: "sec-count", text: doneCount + "/" + items.length })
      ]));

      items.forEach(function (item) {
        var cls = "nav-item " + (isDone(item) ? "done" : "planned");
        if (item.id === active) cls += " active";
        var attrs = {
          class: cls,
          type: "button",
          title: item.summary || item.title,
          onclick: function () { navigate(item.id); }
        };
        var kids = [
          h("span", { class: "dot", "aria-hidden": "true" }),
          h("span", { class: "label", text: item.title })
        ];
        if (!isDone(item)) kids.push(h("span", { class: "np", text: "soon" }));
        wrap.appendChild(h("button", attrs, kids));
      });

      el.sidebar.appendChild(wrap);
    });
  }

  /* ----------------------------- overview ----------------------------- */
  function renderOverview() {
    clear(el.main);
    var m = state.manifest;
    var p = progress();
    var view = h("div", { class: "view" });

    /* hero */
    var hero = h("div", { class: "hero" }, [
      h("p", { class: "eyebrow", text: "CNCF · Cloud Native Computing Foundation" }),
      h("h1", { text: m.topic }),
      h("p", { class: "lead", html:
        "Every project here has <strong>graduated</strong> — CNCF's highest maturity tier, " +
        "meaning it is proven in production across many organizations. This is a self-paced tour " +
        "of all <strong>" + m.items.length + "</strong> of them: what each one is, the problem it " +
        "solves, where it sits in the stack, and how it works under the hood — one interactive " +
        "deep-dive at a time." }),
      h("div", { class: "stat-row" }, [
        stat(m.items.length, "projects"),
        stat(sectionsSorted().length, "areas"),
        stat(p.done, "deep-dives ready"),
        stat((p.total - p.done), "still planned")
      ])
    ]);
    view.appendChild(hero);

    /* how it works / next-up hint */
    var next = pickNext();
    if (p.done === 0) {
      view.appendChild(h("div", { class: "callout note" }, [
        h("strong", { text: "No deep-dives built yet." }),
        h("span", { html:
          " The plan is fully mapped out below (every project is listed). Content is grown one " +
          "project at a time — ask Claude Code to <em>“continue the next deep-dive.”</em> " +
          (next ? "Suggested next: <strong>" + escapeHtml(next.title) + "</strong>." : "") })
      ]));
    } else if (next) {
      var cont = h("div", { class: "callout tip" }, [
        h("strong", { text: "Pick up where you left off" }),
        h("span", { html: " Next suggested project: " }),
        h("a", { href: "#" + encodeURIComponent(next.id), text: next.title }),
        h("span", { text: " — " + (next.summary || "") })
      ]);
      view.appendChild(cont);
    }

    /* section cards */
    view.appendChild(h("h2", { text: "The landscape" }));
    var grid = h("div", { class: "sections-grid" });
    sectionsSorted().forEach(function (sec) {
      var items = itemsInSection(sec.id);
      if (!items.length) return;
      var doneCount = items.filter(isDone).length;
      var card = h("div", { class: "sec-card" }, [
        h("h3", { text: sec.title }),
        h("div", { class: "sec-meta", text: doneCount + " of " + items.length + " ready" }),
        h("div", { class: "chip-list" }, items.map(function (item) {
          return h("button", {
            class: "chip " + (isDone(item) ? "done" : "planned"),
            type: "button",
            title: item.summary || item.title,
            onclick: function () { navigate(item.id); }
          }, [ h("span", { class: "cdot", "aria-hidden": "true" }), item.title ]);
        }))
      ]);
      grid.appendChild(card);
    });
    view.appendChild(grid);

    el.main.appendChild(view);
    document.title = m.topic + " — Learning Landscape";
  }

  function stat(n, label) {
    return h("div", { class: "stat" }, [
      h("div", { class: "n", text: String(n) }),
      h("div", { class: "l", text: label })
    ]);
  }

  /* ------------------------- item (deep-dive) ------------------------- */
  function renderItem(item) {
    clear(el.main);
    var view = h("div", { class: "view" });
    var sec = (state.manifest.sections || []).filter(function (s) { return s.id === item.sectionId; })[0];

    var head = h("div", { class: "frame-head" }, [
      h("div", { class: "crumb", html:
        '<a href="#overview">Overview</a> / ' +
        escapeHtml(sec ? sec.title : "") + " / <strong>" + escapeHtml(item.title) + "</strong>" }),
      h("div", { class: "frame-actions" }, isDone(item) ? [
        h("a", { class: "btn ghost", href: CONTENT_DIR + item.file, target: "_blank", rel: "noopener", text: "Open in new tab ↗" })
      ] : [])
    ]);
    view.appendChild(head);

    if (isDone(item)) {
      var shell = h("div", { class: "iframe-shell" }, [
        h("iframe", {
          class: "deepdive-frame",
          src: CONTENT_DIR + item.file,
          title: item.title + " deep-dive",
          loading: "lazy"
        })
      ]);
      view.appendChild(shell);
    } else {
      view.appendChild(renderPlanned(item));
    }

    el.main.appendChild(view);
    document.title = item.title + " — " + state.manifest.topic;
    el.main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function renderPlanned(item) {
    var prereqs = (item.prerequisites || []).map(function (pid) {
      var p = state.byId[pid];
      return p ? p.title : pid;
    });
    return h("div", { class: "card placeholder" }, [
      h("div", { class: "big-hex", "aria-hidden": "true" }),
      h("p", { class: "eyebrow", text: "Planned deep-dive" }),
      h("h1", { text: item.title }),
      h("p", { class: "lead", text: item.summary || "" }),
      prereqs.length
        ? h("p", { class: "muted", html: "Builds on: " + prereqs.map(escapeHtml).join(", ") })
        : null,
      h("div", { class: "callout note", html:
        "This deep-dive hasn't been built yet. To create it, ask Claude Code to " +
        "<em>“continue the next deep-dive”</em> (or name this project, <code>" +
        escapeHtml(item.id) + "</code>). The routine in <code>.claude/CLAUDE.md</code> will " +
        "research it, write <code>content/" + escapeHtml(item.file) + "</code>, flip it to " +
        "<code>done</code> in the manifest, and it will appear here." }),
      h("p", {}, [ h("a", { class: "btn", href: "#overview", text: "← Back to the landscape" }) ])
    ]);
  }

  /* --------------------------- next-up pick --------------------------- */
  // Earliest planned item (by section order, then item order) whose
  // prerequisites are all done. Honors prereqs; falls back to first planned.
  function pickNext() {
    var ordered = [];
    sectionsSorted().forEach(function (sec) {
      itemsInSection(sec.id).forEach(function (it) { ordered.push(it); });
    });
    var firstPlanned = null;
    for (var i = 0; i < ordered.length; i++) {
      var it = ordered[i];
      if (isDone(it)) continue;
      if (!firstPlanned) firstPlanned = it;
      var ready = (it.prerequisites || []).every(function (pid) {
        return state.byId[pid] && isDone(state.byId[pid]);
      });
      if (ready) return it;
    }
    return firstPlanned;
  }

  /* ------------------------------- render ----------------------------- */
  function route() {
    renderNav();
    renderProgress();
    var slug = currentSlug();
    if (slug && state.byId[slug]) {
      renderItem(state.byId[slug]);
    } else {
      renderOverview();
    }
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* -------------------------------- boot ------------------------------ */
  function fail(msg) {
    clear(el.main);
    el.main.appendChild(h("div", { class: "view" }, [
      h("h1", { text: "Couldn't load the landscape" }),
      h("p", { class: "err", text: msg }),
      h("p", { class: "muted", html:
        "The app reads <code>" + MANIFEST_URL + "</code>. If you're opening this file " +
        "directly from disk, some browsers block <code>fetch</code> of local files — serve the " +
        "folder over HTTP instead (e.g. <code>python3 -m http.server</code>) or view the " +
        "deployed GitHub Pages site." })
    ]));
    clear(el.sidebar);
  }

  fetch(MANIFEST_URL, { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status + " fetching the manifest");
      return r.json();
    })
    .then(function (manifest) {
      state.manifest = manifest;
      state.byId = {};
      (manifest.items || []).forEach(function (i) { state.byId[i.id] = i; });
      window.addEventListener("hashchange", route);
      route();
    })
    .catch(function (e) { fail(e.message || String(e)); });
})();
