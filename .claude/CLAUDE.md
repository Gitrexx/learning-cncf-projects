# CNCF Graduated Projects — Learning Project

## What this is
A personalized learning project for the **36 CNCF graduated projects**. Learner context: fluent
and comfortable with Kubernetes, but keeps running into the *names* of graduated projects in blogs
and talks without knowing what they actually are, what problem they solve, or how they work. The
goal is to turn each project from "a name I've seen" into real, working understanding — studied at
roughly one project per day.

Deep-dives are interactive HTML pages in `/content`, planned by `/ROADMAP.md`, indexed by
`content/manifest.json`, and shown by the static app at `/index.html` (deployed to GitHub Pages).

## Project structure
- `/ROADMAP.md` — the guide: the full plan (source of truth for what to build and in what order),
  a **landscape** of 36 projects across 8 sections.
- `/content/manifest.json` — index of sub-topics with status (`planned`/`done`); what the app renders.
- `/content/<slug>.html` — the deep-dive pages (created one at a time by the routine below).
- `/assets/theme.css` — the shared design system; every deep-dive links `../assets/theme.css`.
- `/index.html`, `/assets/app.js` — the app shell (manifest-driven nav, progress, iframe loader).
- `/README.md` — one-paragraph intro.

The two GitHub Actions workflows already in the repo do the rest: `static.yml` deploys the root as
a Pages site; `auto-merge-content.yml` auto-merges conflict-free content PRs and redeploys.

## Learner level — pitch every deep-dive here
- **Assume Kubernetes fluency.** You can freely use Pods, Deployments, Services, controllers,
  `kubectl`, CRDs, operators, namespaces, RBAC without re-explaining them. Reference Kubernetes as
  the shared anchor.
- **Do NOT assume knowledge of the project being taught**, or of adjacent graduated projects, unless
  they're listed as prerequisites and already `done`. Introduce the project from "what is it / why
  does it exist / what problem did people have before it."
- Explain the *why it graduated / where it's used in production* angle — that's the learner's whole
  motivation (understanding the names they see in the wild).
- Depth target: ~15–40 minutes of engaged study. Go into real mechanism (architecture, the core
  algorithm or data model, the request/data flow), not just marketing bullet points. Be concrete and
  technical, but explain jargon on first use (use the `.term` primitive).
- Tone: knowledgeable peer talking to a capable engineer. No fluff, no condescension.

## Routine: creating the next deep-dive
Follow these rules whenever asked to add/continue learning content:

1. **Read `/ROADMAP.md` first** — it is the guide. Re-read it every time; don't work from memory.
   It has a `Covers`, `Prerequisites`, and `Interactive idea` entry for every project.
2. **Check what already exists** — read `content/manifest.json` and see which items are `"done"`.
3. **Pick the next sub-topic** — the earliest-`order` `"planned"` item (by section order, then item
   order) whose prerequisites are all `"done"`. Because this is a landscape, order is flexible and
   prerequisites are light — the user may also just name a specific slug (e.g. "do `cilium` next").
4. **Research the sub-topic deeply first.** Don't write from memory alone — these projects move.
   Verify current architecture, terminology, and any recent changes (e.g. Istio ambient mode, the
   Argo family's sub-projects) via web search where it matters. Get the mechanism right.
5. **Write `/content/<slug>.html`** — a standalone page that:
   - `<link>`s `../assets/theme.css` in the `<head>` (relative path — it lives in `/content`).
   - Wraps content in `<main class="deepdive">` and uses the theme's primitives (`.callout` with
     `.note`/`.tip`/`.warn`/`.danger`/`.key`, `.widget`, `.quiz`, `.eyebrow`, `.term`, `.badge`,
     `figure`/`figcaption`, tables, `.btn`, `pre`/`code`).
   - Teaches the project comprehensively **at the learner's level** (see above): what it is, the
     problem it solves, where it sits relative to Kubernetes, core architecture/mechanism, and when
     you'd reach for it (and what it's often confused with).
   - Includes **at least one genuinely interactive element** — ideally the one sketched in the
     roadmap's "Interactive idea" for that project (a simulation, visualization, step-through, live
     playground, or quiz). Make it actually work with vanilla JS inside a `<script>` in the page.
   - Keep the filename **== the slug** in the roadmap/manifest (e.g. `content/cilium.html`).
6. **Update `content/manifest.json`** — set that item's `status` to `"done"` (confirm `file` matches).
7. **Open a PR** with just this one sub-topic (branch → commit → PR). The `auto-merge-content.yml`
   workflow merges it if conflict-free and redeploys Pages. **One sub-topic per PR** keeps manifest
   edits from colliding — build them one at a time.

## Conventions
- **Style comes from the theme, not the page.** Every deep-dive `<link>`s `../assets/theme.css` and
  reuses its CSS variables and components. Do **not** introduce a new visual style, palette, or fonts
  — the whole repo must look like one product (a "cloud-native control plane": Kubernetes blue + cyan
  accent, hexagon motifs, monospace technical labels, blueprint-grid background).
- **Page-specific CSS is only for wiring an interactive widget** (sizing/positioning a canvas or SVG,
  an animation) and must stay within the theme's variables and palette. If you find yourself restyling
  headings, colors, links, or layout chrome — stop; that belongs in the theme, not the page.
- The **interactivity (JavaScript) is what varies** page to page; the look does not.
- Deep-dives must work both inside the app's `<iframe>` and when opened directly (standalone HTML,
  relative theme link, self-contained scripts — no external CDN/build step).
- Keep everything static and dependency-free: vanilla JS, relative paths, no bundler, no external
  scripts. It must run as-is on GitHub Pages.

## Scope note
The list is pinned to the 36 CNCF **graduated** projects (verified from the `cncf/landscape` source,
July 2026). If CNCF graduates a new project later, add it as a new item in the appropriate manifest
section and a new entry in `ROADMAP.md`, then build its deep-dive like any other.
