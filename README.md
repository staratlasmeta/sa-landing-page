# Star Atlas Landing Page

A static, SEO-optimized marketing site for **Star Atlas** — the AAA space exploration MMO. The site is built for [GitHub Pages](https://pages.github.com/) with a programmatic page generator that produces multiple game-feature pages from a single JSON content source.

---

## Overview

- **Purpose**: Marketing and discovery for Star Atlas (game overview, Galia, game modes, fleet command, Holosim, SAGE Labs, etc.) with strong SEO and performance.
- **Stack**: Vanilla HTML/CSS/JS, no build step. Node.js is used only to run the static site generator (`site/generate.mjs`).
- **Hosting**: Designed for GitHub Pages with custom domain (`staratlas.com` via `CNAME`). All asset paths are relative so the site works from any base path.

---

## Repository Structure

```
sa-landing-page/
├── index.html              # Homepage (hand-authored)
├── 404.html                # Custom 404 (GitHub Pages)
├── styles.css              # Global styles (variables, layout, components)
├── Icon.png                # Favicon / OG default image
├── Logo.svg                # Nav logo
├── CNAME                   # Custom domain for GitHub Pages (staratlas.com)
├── robots.txt              # Generated; crawl directives + sitemap URL
├── sitemap.xml             # Generated; list of all public URLs
│
├── src/
│   ├── main.js             # Deferred script: carousels, game-mode toggle, loading bar, etc.
│   └── ...                 # Video and image assets (hero, game section, etc.)
│
├── game/                   # Generated SEO sub-pages (do not edit by hand)
│   ├── index.html          # Game overview
│   ├── galia/
│   ├── game-modes/
│   ├── your-fleet-your-way/
│   ├── life-in-galia/
│   ├── fleet-command/
│   ├── holosim/
│   ├── sage-labs/
│   └── ...
│
└── site/                   # Static site generator
    ├── site.config.json    # Site name, URL, default meta, keywords
    ├── pages.json          # Content for each generated page (title, description, features, etc.)
    └── generate.mjs        # Script that writes game/*/index.html, sitemap.xml, robots.txt
```

- **Hand-authored**: `index.html`, `404.html`, `styles.css`, `src/main.js`, and everything under `site/`.
- **Generated**: Everything under `game/` (each `index.html`), `sitemap.xml`, and `robots.txt`. Regenerate with `npm run generate` after changing `site/pages.json` or `site/site.config.json`.

---

## Features

### SEO

- **Meta**: Unique `<title>`, `<meta name="description">`, and `<meta name="keywords">` per page.
- **Canonical URLs**: Every page has a `rel="canonical"` pointing to the production URL.
- **Open Graph & Twitter Cards**: `og:*` and `twitter:*` tags for rich previews.
- **Structured data**: JSON-LD on homepage (Organization, WebSite, VideoGame) and on generated pages (WebPage + `isPartOf` WebSite).
- **Sitemap & robots**: `sitemap.xml` and `robots.txt` are generated and reference the production domain.

### Performance & UX

- **Deferred scripts**: `main.js` is loaded with `defer` for non-blocking parsing.
- **Preconnect**: Hints for fonts (Google Fonts / Fontshare).
- **Lazy loading**: Video `preload="metadata"` and `poster` where appropriate.
- **Loading bar**: Top-of-page progress indicator driven by `main.js`.

### Accessibility

- **Semantic HTML**: `<nav>`, `<main>`, `<section>`, `<footer>`, heading hierarchy.
- **ARIA**: Labels where needed (e.g. nav “Star Atlas Home”).
- **Screen readers**: `.sr-only` and meaningful `alt` on images.

### Programmatic SEO

- **Single source of truth**: `site/pages.json` defines path, title, description, intro, video, features, lore, stats, guides, and CTA for each game page.
- **Consistent layout**: Generator (`site/generate.mjs`) outputs a shared template with correct relative links, meta, and JSON-LD for each path.
- **Internal linking**: Generated pages include an “Explore More Features” block linking to other game pages.

---

## Development

### Prerequisites

- **Node.js** (v18+ recommended) for running the generator.
- A local static file server for preview (e.g. Python, or `npx serve` if you have npm installed).

### Local preview

Serve the repo root so that `/` and `/game/...` resolve correctly:

```bash
# Python
python3 -m http.server 8080

# Or Node/npm
npx serve . -l 8080
```

Then open `http://localhost:8080` (or the port shown). The 404 page is only used when deployed to GitHub Pages.

### Regenerate game pages and SEO files

After editing `site/pages.json` or `site/site.config.json`:

```bash
npm run generate
```

This will:

1. Create or update `game/<path>/index.html` for each entry in `pages.json`.
2. Write `sitemap.xml` with the homepage and all generated page URLs.
3. Write `robots.txt` with `Allow: /` and the sitemap URL.

---

## Configuration

### `site/site.config.json`

- **siteName**, **siteUrl**: Used in titles, canonicals, OG URLs, and sitemap.
- **defaultTitle**, **defaultDescription**: Fallbacks for pages that don’t override.
- **defaultOgImagePath**: Path (relative to site root) for the default OG/Twitter image (e.g. `Icon.png`).
- **keywords**: Default meta keywords string.

### `site/pages.json`

Array of page objects. Each object defines one generated page. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full schema and [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for how to add or edit pages.

---

## Production deployment (GitHub Pages)

1. Push the repo to GitHub.
2. **Settings → Pages**: Choose the branch (e.g. `main`) and root as source.
3. **Custom domain**: The `CNAME` file sets `staratlas.com`. In the repo, it should contain only the apex domain. In GitHub’s Pages settings, enter the same domain and enable **Enforce HTTPS**.
4. **DNS**: Point the domain to GitHub Pages (see [GitHub’s docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)):
   - **A records** for apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www`: `<username>.github.io` (or the value GitHub shows).

After deployment, the live site is served from `https://staratlas.com`. The generator uses `siteUrl` from `site.config.json` for canonicals and sitemap; keep it in sync with the real domain.

---

## SEO checklist

- [x] Unique title and description per page  
- [x] Canonical URLs  
- [x] Open Graph tags  
- [x] Twitter Card tags  
- [x] JSON-LD (Organization, WebSite, VideoGame on homepage; WebPage on game pages)  
- [x] XML sitemap  
- [x] robots.txt  
- [x] Mobile-friendly viewport  
- [x] Semantic HTML and heading hierarchy  
- [x] Image `alt` attributes  
- [x] Internal linking between game pages  
- [x] Target keywords (e.g. “AAA Space Exploration MMO”) reflected in copy and meta  

---

## Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — How the generator works, page data schema, and output structure.
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** — How to add or edit game pages and run the generator.

---

## License

© 2625 Star Atlas. All rights reserved.
