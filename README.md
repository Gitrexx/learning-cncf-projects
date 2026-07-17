# Learning the CNCF Graduated Projects

A personalized, self-paced learning project for going deep on all **36 CNCF graduated projects** —
the cloud-native tools that have reached CNCF's highest maturity tier and are proven in production
across many organizations (Kubernetes, Envoy, Istio, Prometheus, Cilium, Argo, OpenTelemetry, and
30 more). It's built for someone already fluent in Kubernetes who keeps seeing these project names
in blogs and talks and wants to actually *know* what each one is, what problem it solves, and how it
works.

**How it works:** each project gets its own standalone, interactive HTML deep-dive in `/content`,
with a hands-on element (a simulator, visualization, step-through, or quiz). A tiny static app
(`index.html`) reads `content/manifest.json` and presents the whole landscape — grouped by area,
with progress tracking — and opens each deep-dive in place. No build step, no server: it's plain
static files deployed to GitHub Pages.

The full plan lives in [`ROADMAP.md`](./ROADMAP.md) — 36 projects across 8 areas (foundations,
networking/mesh, observability, delivery/GitOps, security/supply-chain, app runtimes, storage,
and registry/distribution). Content is grown **one project at a time**: ask Claude Code to
*"continue the next deep-dive"* and it follows the routine in
[`.claude/CLAUDE.md`](./.claude/CLAUDE.md) — research the project, write its page, mark it done in
the manifest, and open a PR that auto-merges and redeploys.
