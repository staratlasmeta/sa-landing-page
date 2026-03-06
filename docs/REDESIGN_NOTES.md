# Star Atlas Redesign Notes

## Navigation model

Primary navigation:
- Game
- Universe
- Economy
- Updates
- Support
- Primary CTA: Launch Browser Experience

Primary conversion goal:
- Get first-time visitors into the browser experience with the least possible friction.

## Revised sitemap

- /
- /game/
- /game/galia/
- /game/game-modes/
- /game/your-fleet-your-way/
- /game/life-in-galia/
- /game/fleet-command/
- /game/holosim/
- /game/sage-labs/
- /economy/
- /newsroom/
- /roadmap/
- /company/
- /contact/
- /404.html

## Design system changes

- Unified premium dark shell with shared header, footer, spacing, typography, surfaces, and motion tokens.
- Reduced top-level choices and removed email-gated hero behavior.
- Replaced scattered page chrome with reusable section patterns: hero, story split, card grid, metrics, timeline, FAQ, and CTA banner.
- Added subtle reveal motion, mobile nav, and a controlled homepage showcase that respects `prefers-reduced-motion`.

## Content cleanup recommendations

- Keep the homepage hero limited to one message, one primary CTA, and one secondary CTA.
- Do not reintroduce email capture above the fold unless it is behind a deliberate modal or clearly secondary section.
- Avoid countdowns, campaign timers, and dated urgency language unless tied to a real current event that is actively maintained.
- Use one consistent product-state vocabulary across homepage, roadmap, newsroom, and support. Recommended frame: playable now, expanding next, long-range ambition.
- Promote only genuinely current newsroom items. Archive or visually de-emphasize stale updates quickly.
- Do not feature detailed economy metrics unless they can be refreshed reliably and contextualized.
- Keep support routing explicit. Label external destinations so visitors know when they are leaving the marketing shell.
- Avoid pre-rendered form errors or success states. Show validation only after interaction.

## QA checklist

Accessibility:
- Verify keyboard navigation across header, showcase controls, disclosures, and CTA buttons.
- Confirm contrast on buttons, pills, captions, and footer links.
- Check heading order on homepage and generated pages.
- Confirm meaningful alt text on all non-decorative images.
- Validate reduced-motion behavior for reveal animations and autoplay video.

Responsiveness:
- Review homepage hero, showcase, footer, and card grids at mobile, tablet, and desktop widths.
- Confirm nav drawer behavior below the mobile breakpoint.
- Check long card titles and CTA text wrapping on narrow screens.
- Make sure videos and imagery keep stable aspect ratios without layout shift.

Performance:
- Keep hero and showcase media on `preload="metadata"` unless there is a measured reason to increase it.
- Prefer current editorial proof over fragile live metrics that require heavy data dependencies.
- Audit large imagery and video payloads before production deployment.

Content discipline:
- Validate that each page has one clear primary action.
- Confirm homepage trust strip items are still accurate.
- Check roadmap and newsroom copy for stale state language before publish.
