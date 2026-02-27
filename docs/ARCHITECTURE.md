# Architecture

This document describes how the Star Atlas landing page repo is structured and how the static site generator produces the game sub-pages and SEO artifacts.

---

## High-level flow

1. **Content** lives in `site/pages.json` (and site-wide defaults in `site/site.config.json`).
2. **Generator** `site/generate.mjs` reads both JSON files and:
   - Renders one HTML file per page into `game/<path>/index.html`.
   - Writes `sitemap.xml` and `robots.txt` at the repo root.
3. **Homepage** `index.html` is hand-authored and not generated.
4. **Assets** (CSS, JS, images, video) are referenced with relative paths so the site works on GitHub Pages at any base path.

---

## Site config (`site/site.config.json`)

Global settings used by the generator and (where relevant) by the hand-authored homepage:

| Field | Purpose |
|-------|--------|
| `siteName` | Brand name (e.g. "Star Atlas") in titles and schema. |
| `siteUrl` | Production origin (e.g. `https://staratlas.com`) for canonicals, OG URLs, sitemap. |
| `defaultTitle` | Default `<title>` suffix when a page doesn’t set one. |
| `defaultDescription` | Default meta description. |
| `defaultOgImagePath` | Path to default OG/Twitter image (e.g. `Icon.png`). |
| `keywords` | Default meta keywords string. |

The generator does not read the homepage HTML; any homepage-specific meta or schema is defined directly in `index.html`.

---

## Page data schema (`site/pages.json`)

`pages.json` is an array of page objects. Each object produces one URL and one `game/<path>/index.html`.

### Required / primary fields

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | URL path without leading slash, with or without trailing slash (e.g. `game/`, `game/galia/`). Generator normalizes to trailing slash and writes to `game/<path>index.html`. |
| `title` | string | Used in `<title>`, meta description fallback, and JSON-LD. |
| `description` | string | Meta description and OG/Twitter description. |
| `h1` | string | Main heading on the page (defaults to `title` if omitted). |
| `intro` | string | First paragraph of body content (optional; falls back to `description`). |

### Optional structure fields

| Field | Type | Description |
|-------|------|-------------|
| `sectionNumber` | string | Label shown next to the h1 (e.g. `"0001."`). |
| `videoSrc` | string | Path to MP4 (relative to site root). |
| `poster` | string | Path to poster image for the video. |
| `features` | array | List of feature cards. Each item: `title`, `description`, optional `bullets` (array of strings). |
| `lore` | object | Optional block: `title`, `text`. |
| `stats` | array | Stat items: `value`, `label` (e.g. `{ "value": "3", "label": "Major Factions" }`). |
| `guide` | object | Optional “how to” block: `title`, `steps` (array of strings). |
| `cta` | object | Call-to-action: `title`, `text`. Button “Play Now” links to `https://play.staratlas.com`. |

### Paths and relative links

- The generator computes a **depth prefix** from each page’s path (e.g. `game/galia/` → `../../`) so that assets (CSS, JS, images, video) and links (e.g. back to `index.html`) work correctly from any subdirectory.
- “Related” links on generated pages point to other entries in `pages.json` (excluding the current page and the game index), with the same prefix logic.

---

## Generator behavior (`site/generate.mjs`)

- **Input**: `site/site.config.json`, `site/pages.json`.
- **Output**:
  - For each item in `pages.json`: `game/<path>/index.html` (directory created if needed).
  - Root `sitemap.xml`: one `<url>` for `siteUrl` and one for each page path.
  - Root `robots.txt`: `User-agent: *`, `Allow: /`, and `Sitemap: <siteUrl>/sitemap.xml`.

### HTML template (generated pages)

Each generated page includes:

- **Head**: charset, viewport, title, description, keywords, robots, theme-color, canonical, OG and Twitter meta, favicon, preconnect + Google Fonts (Orbitron, Space Mono), `styles.css`, and a JSON-LD `WebPage` script.
- **Body**: Loading bar div, grid background layers, mouse spotlight, glow container, then:
  - **Nav**: Logo (link to current “home” index), Game / Economy / Community links, Galactic Marketplace CTA. All hrefs use the depth prefix.
  - **Main**: Section number + h1, intro, video (if `videoSrc`/`poster`), then content blocks: lore, stats, feature grid, guide, CTA, and “Explore More Features” related links.
  - **Footer**: Copyright.
  - **Script**: `src/main.js` with `defer`, path adjusted by prefix.

All user-supplied strings are escaped for HTML (and for JSON inside script) to avoid XSS.

---

## Homepage (`index.html`)

The homepage is **not** generated. It contains:

- Full meta set (including JSON-LD `@graph`: Organization, WebSite, VideoGame).
- Sections for hero, game (third-person vs RTS toggle and carousels), economy, community, etc.
- Inline or script-driven behavior that is partially mirrored in `src/main.js` (e.g. `showGameMode`, carousel controls, loading bar). The JS is attached to `window` so that inline `onclick` handlers in the HTML can call it.

---

## Frontend assets

- **styles.css**: Single global stylesheet. Variables, reset, layout (grid background, nav, footer), components (buttons, feature cards, video container, etc.), and responsive rules. Used by both the homepage and all generated pages.
- **src/main.js**: Deferred; provides game-mode toggle, video carousel logic, loading bar, and any other behavior used by the homepage or shared UI. Some logic is still referenced from inline handlers in `index.html`.
- **Media**: Images and videos under `src/` (and elsewhere) are referenced by relative path from each page. Generated pages use the depth prefix (e.g. `../../src/...`) so that the same assets work from `/game/galia/`, etc.

---

## 404 page

`404.html` is a static, hand-authored page used by GitHub Pages when a URL is not found. It shares the same visual shell (grid, nav, footer) and points users back to the homepage. It uses `noindex,follow` and a canonical to the homepage to avoid indexing the 404 URL.

---

## Sitemap and robots

- **sitemap.xml**: Generated. Homepage has `priority` 1.0; all generated game pages have `priority` 0.8 and `changefreq` weekly.
- **robots.txt**: Generated. Allows all user-agents and points to `Sitemap: <siteUrl>/sitemap.xml`. Ensure `siteUrl` in `site.config.json` matches the actual production domain.
