# Star Atlas Landing Page

A static marketing site for Star Atlas built with hand-authored HTML, CSS, and JavaScript plus a small Node-based generator for secondary pages.

## Structure

- `index.html`: redesigned homepage
- `404.html`: custom not-found page
- `styles.css`: shared design system, layout, motion, and responsive styles
- `src/main.js`: navigation, reveal motion, showcase switching, reduced-motion handling
- `site/generate.mjs`: static page generator
- `site/pages-data/*.json`: content model for generated pages
- `game/`, `economy/`, `newsroom/`, `roadmap/`, `company/`, `contact/`: generated output routes
- `docs/REDESIGN_NOTES.md`: sitemap, cleanup guidance, and QA checklist

## Commands

- `npm run generate`: regenerate all route pages plus `sitemap.xml` and `robots.txt`

## Content model

Each file in `site/pages-data/` defines one generated route.

Core fields:
- `path`
- `template`
- `navKey`
- `title`
- `description`
- `heroTitle`
- `heroSummary`
- `heroMedia`
- `heroStats`
- `heroPanel`
- `primaryAction`
- `secondaryAction`
- `sections`
- `finalCta`

Supported section types:
- `cards`
- `metrics`
- `story`
- `timeline`
- `faq`

## Notes

- The homepage intentionally leads with one primary conversion goal: launch the browser experience.
- Product-state language is structured around `playable now`, `expanding next`, and `long-range ambition`.
- The shared shell is built to keep generated pages visually consistent with the homepage.
