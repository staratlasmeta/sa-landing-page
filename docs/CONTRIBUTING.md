# Contributing

This guide covers how to edit content, add new game pages, and work with the static site generator.

---

## Quick reference

- **Edit existing game page content**: Update the corresponding object in `site/pages.json`, then run `npm run generate`.
- **Add a new game page**: Add a new object to `site/pages.json` (see schema below), then run `npm run generate`.
- **Change site-wide defaults** (site name, default meta, OG image, keywords): Edit `site/site.config.json`, then run `npm run generate` if you want sitemap/robots and generated pages to reflect a new `siteUrl`.
- **Change homepage**: Edit `index.html` and/or `styles.css`, `src/main.js` as needed. No generator step.

---

## Editing an existing game page

1. Open `site/pages.json`.
2. Find the object whose `path` matches the page you want (e.g. `"path": "game/galia/"`).
3. Edit any of: `title`, `description`, `h1`, `intro`, `sectionNumber`, `videoSrc`, `poster`, `features`, `lore`, `stats`, `guide`, `cta`.
4. Save the file.
5. Regenerate:

   ```bash
   npm run generate
   ```

6. Preview locally (e.g. `python3 -m http.server 8080` or `npx serve .`) and open the page under `/game/...`.

**Important**: Do not edit the HTML files under `game/` by hand; they will be overwritten the next time you run `npm run generate`. All content changes for those pages should be made in `pages.json`.

---

## Adding a new game page

1. Open `site/pages.json`.
2. Add a new object to the array. At minimum, include:
   - `path` — e.g. `"game/my-feature/"`. Use a short, URL-friendly slug. The generator will create `game/my-feature/index.html`.
   - `title` — Used in `<title>` and meta (e.g. "My Feature | Star Atlas").
   - `description` — Meta description and OG/Twitter.
   - `h1` — Main heading (can match `title` or be shorter).
   - `intro` — First paragraph (optional; defaults to `description`).

3. Optionally add any of:
   - `sectionNumber` — e.g. `"0001."`
   - `videoSrc` — path to MP4 (relative to site root)
   - `poster` — path to poster image
   - `features` — array of `{ "title": "...", "description": "...", "bullets": ["...", "..."] }`
   - `lore` — `{ "title": "...", "text": "..." }`
   - `stats` — array of `{ "value": "...", "label": "..." }`
   - `guide` — `{ "title": "...", "steps": ["...", "..."] }`
   - `cta` — `{ "title": "...", "text": "..." }` (button links to Play Now)

4. Save `pages.json`.
5. Run:

   ```bash
   npm run generate
   ```

6. Check that `game/my-feature/index.html` was created and that the new URL appears in `sitemap.xml`. Preview locally to confirm layout and links.

---

## Example: minimal new page

```json
{
  "path": "game/new-mode/",
  "title": "New Mode",
  "description": "Short meta description for New Mode in Star Atlas.",
  "h1": "New Mode",
  "intro": "One or two sentences introducing the mode.",
  "features": [
    {
      "title": "Feature One",
      "description": "Brief description.",
      "bullets": ["Point A", "Point B"]
    }
  ],
  "cta": {
    "title": "Try It",
    "text": "Get started with New Mode today."
  }
}
```

---

## Site-wide configuration

- **site/site.config.json**
  - `siteName`, `siteUrl`, `defaultTitle`, `defaultDescription`, `defaultOgImagePath`, `keywords`.
  - Changing `siteUrl` affects canonicals, OG URLs, and sitemap; keep it in sync with your production domain (e.g. `https://staratlas.com`).

After changing `site.config.json`, run `npm run generate` so that all generated pages and `sitemap.xml` / `robots.txt` use the new values.

---

## Homepage and shared assets

- **index.html**: Edit directly for hero, sections, and meta. For JSON-LD (Organization, WebSite, VideoGame), edit the `<script type="application/ld+json">` block.
- **404.html**: Edit directly if you need to change the not-found message or layout.
- **styles.css**: Global styles; changes apply to the homepage and all generated pages.
- **src/main.js**: Shared behavior (carousels, game-mode toggle, loading bar). Used by the homepage; generated pages also load it for consistent UI (e.g. loading bar).

No generator step is required for these files.

---

## Before committing

1. Run `npm run generate` after any change to `site/pages.json` or `site/site.config.json`.
2. Commit both the JSON edits and the updated `game/*/index.html`, `sitemap.xml`, and `robots.txt` so the deployed site stays in sync with the content source.
