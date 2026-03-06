import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());
const siteConfigPath = path.join(repoRoot, 'site', 'site.config.json');
const pagesDir = path.join(repoRoot, 'site', 'pages-data');

const navItems = [
    { key: 'game', label: 'Game', href: '/game/' },
    { key: 'universe', label: 'Universe', href: '/game/life-in-galia/' },
    { key: 'economy', label: 'Economy', href: '/economy/' },
    { key: 'updates', label: 'Updates', href: '/newsroom/' },
    { key: 'support', label: 'Support', href: '/contact/' },
];

const footerGroups = [
    {
        title: 'Explore',
        links: [
            { label: 'Game Overview', href: '/game/' },
            { label: 'Universe', href: '/game/life-in-galia/' },
            { label: 'Economy', href: '/economy/' },
            { label: 'Roadmap', href: '/roadmap/' },
        ],
    },
    {
        title: 'Updates',
        links: [
            { label: 'Newsroom', href: '/newsroom/' },
            { label: 'Discord', href: 'https://discord.gg/staratlas', external: true },
            { label: 'X', href: 'https://x.com/staratlas', external: true },
            { label: 'YouTube', href: 'https://www.youtube.com/channel/UCt-y8Npwje5KDG5MSZ0a9Jw', external: true },
        ],
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact', href: '/contact/' },
            { label: 'Company', href: '/company/' },
            { label: 'Help Center', href: 'https://support.staratlas.com/', external: true },
            { label: 'Marketplace', href: 'https://play.staratlas.com/market/', external: true },
        ],
    },
];

function ensureTrailingSlash(value) {
    if (!value) return '';
    return value.endsWith('/') ? value : `${value}/`;
}

function depthPrefix(pagePath) {
    const trimmed = ensureTrailingSlash(pagePath).replace(/^\/+/, '').replace(/\/+$/, '');
    if (!trimmed) return '';
    return '../'.repeat(trimmed.split('/').length);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function absoluteUrl(siteUrl, pagePath) {
    const base = siteUrl.replace(/\/+$/, '');
    const cleanPath = String(pagePath ?? '').replace(/^\/+/, '');
    if (!cleanPath) return `${base}/`;
    return `${base}/${cleanPath}`;
}

function isExternalHref(href) {
    return /^(https?:|mailto:|tel:)/i.test(String(href || ''));
}

function resolveHref(prefix, href) {
    if (!href) return '#';
    if (isExternalHref(href) || href.startsWith('#')) return href;
    if (href === '/') return `${prefix}index.html`;
    if (href.startsWith('/#')) return `${prefix}index.html${href.slice(1)}`;
    if (href.startsWith('/')) return `${prefix}${href.slice(1)}`;
    return `${prefix}${href}`;
}

function resolveAsset(prefix, assetPath) {
    if (!assetPath) return '';
    if (isExternalHref(assetPath)) return assetPath;
    return `${prefix}${String(assetPath).replace(/^\/+/, '')}`;
}

function buttonClass(variant = 'primary') {
    if (variant === 'secondary') return 'button button-secondary';
    if (variant === 'ghost') return 'button button-ghost';
    return 'button button-primary';
}

function renderAction(action, prefix, variant) {
    if (!action) return '';
    const href = resolveHref(prefix, action.href);
    const isExternal = action.external || isExternalHref(href);
    const className = buttonClass(variant || action.variant);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const tagLabel = action.tag || (isExternal ? 'External' : '');
    const tag = tagLabel ? `<span class="button-tag">${escapeHtml(tagLabel)}</span>` : '';
    return `<a class="${className}" href="${escapeHtml(href)}"${attrs}>${tag}<span>${escapeHtml(action.label)}</span></a>`;
}

function renderBackground() {
    return `
    <div class="site-background" aria-hidden="true">
        <div class="site-grid"></div>
        <div class="site-noise"></div>
        <div class="site-glow site-glow--one"></div>
        <div class="site-glow site-glow--two"></div>
        <div class="site-glow site-glow--three"></div>
    </div>`;
}

function renderHeader(prefix, currentKey) {
    const links = navItems
        .map((item) => {
            const ariaCurrent = item.key === currentKey ? ' aria-current="page"' : '';
            return `<a class="nav-link" href="${escapeHtml(resolveHref(prefix, item.href))}"${ariaCurrent}>${escapeHtml(item.label)}</a>`;
        })
        .join('');

    return `
    <header class="site-header" data-header>
        <div class="container nav-shell">
            <a class="brand" href="${escapeHtml(resolveHref(prefix, '/'))}" aria-label="Star Atlas home">
                <img src="${escapeHtml(resolveAsset(prefix, 'Logo.svg'))}" alt="Star Atlas">
            </a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>Menu</button>
            <nav class="site-nav" id="site-nav" data-nav>
                <div class="nav-links">${links}</div>
                <div class="nav-actions">
                    <a class="button button-secondary" href="https://play.staratlas.com/" target="_blank" rel="noopener noreferrer"><span class="button-tag">External</span><span>Launch Experience</span></a>
                </div>
            </nav>
        </div>
    </header>`;
}

function renderFooter(prefix) {
    const groups = footerGroups
        .map(
            (group) => `
                <div class="footer-links">
                    <p class="footer-label">${escapeHtml(group.title)}</p>
                    ${group.links
                    .map((link) => {
                        const href = resolveHref(prefix, link.href);
                        const attrs = link.external || isExternalHref(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
                        return `<a href="${escapeHtml(href)}"${attrs}>${escapeHtml(link.label)}</a>`;
                    })
                    .join('')}
                </div>`
        )
        .join('');

    return `
    <footer class="site-footer">
        <div class="container">
            <div class="surface-card footer-shell">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <a class="brand" href="${escapeHtml(resolveHref(prefix, '/'))}" aria-label="Star Atlas home">
                            <img src="${escapeHtml(resolveAsset(prefix, 'Logo.svg'))}" alt="Star Atlas">
                        </a>
                        <p class="footer-description">A premium sci-fi product experience built to clarify the universe, elevate trust, and guide new visitors into the strongest entry point first.</p>
                    </div>
                    ${groups}
                </div>
                <div class="footer-meta">
                    <span>2026 Star Atlas. All rights reserved.</span>
                    <span>Marketing shell redesigned for clarity, restraint, and cinematic scale.</span>
                </div>
            </div>
        </div>
    </footer>`;
}

function renderSectionHeading(section) {
    if (!section.heading && !section.text && !section.eyebrow) return '';
    return `
        <div class="section-heading" data-reveal>
            ${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ''}
            ${section.heading ? `<h2 class="section-title">${escapeHtml(section.heading)}</h2>` : ''}
            ${section.text ? `<p class="section-copy">${escapeHtml(section.text)}</p>` : ''}
        </div>`;
}

function renderBullets(items) {
    if (!items || !items.length) return '';
    return `
        <ul class="bullet-list">
            ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>`;
}

function renderPillList(items) {
    if (!items || !items.length) return '';
    return `
        <div class="pill-list">
            ${items.map((item) => `<div class="pill-item">${escapeHtml(item)}</div>`).join('')}
        </div>`;
}

function renderParagraphs(value) {
    const paragraphs = Array.isArray(value) ? value : value ? [value] : [];
    return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
}

function renderHeroStats(stats) {
    if (!stats || !stats.length) return '';
    return `
        <div class="stat-grid" data-reveal style="--reveal-delay: 120ms;">
            ${stats
            .map(
                (stat) => `
                        <div class="stat-chip">
                            <strong>${escapeHtml(stat.value)}</strong>
                            <span>${escapeHtml(stat.label)}</span>
                        </div>`
            )
            .join('')}
        </div>`;
}

function renderHeroPanel(panel) {
    if (!panel) return '';
    return `
        <aside class="page-hero-panel" data-reveal style="--reveal-delay: 180ms;">
            ${panel.eyebrow ? `<p class="card-kicker">${escapeHtml(panel.eyebrow)}</p>` : ''}
            ${panel.title ? `<h2 class="card-title">${escapeHtml(panel.title)}</h2>` : ''}
            ${panel.body ? `<p class="hero-panel-copy">${escapeHtml(panel.body)}</p>` : ''}
            ${renderBullets(panel.bullets)}
        </aside>`;
}

function renderMedia(media, prefix) {
    if (!media) return '';
    const label = media.label ? `<div class="media-badge">${escapeHtml(media.label)}</div>` : '';
    const caption = media.caption ? `<p class="media-caption">${escapeHtml(media.caption)}</p>` : '';

    if (media.type === 'image') {
        return `
        <div class="media-frame page-media-frame">
            ${label}
            <img src="${escapeHtml(resolveAsset(prefix, media.src))}" alt="${escapeHtml(media.alt || '')}" loading="eager" decoding="async">
            ${caption}
        </div>`;
    }

    return `
    <div class="media-frame page-media-frame">
        ${label}
        <video data-ambient-video autoplay muted loop playsinline preload="metadata" poster="${escapeHtml(resolveAsset(prefix, media.poster || ''))}" aria-label="${escapeHtml(media.alt || media.label || 'Star Atlas preview')}">
            <source src="${escapeHtml(resolveAsset(prefix, media.src))}" type="video/mp4">
        </video>
        ${caption}
    </div>`;
}

function renderCardsSection(section, prefix) {
    const columns = section.columns || Math.min(Math.max(section.cards?.length || 1, 1), 3);
    const cards = (section.cards || [])
        .map(
            (card, index) => `
                <article class="surface-card" data-reveal style="--reveal-delay: ${index * 80}ms;">
                    <div class="card-content">
                        ${card.eyebrow ? `<p class="card-kicker">${escapeHtml(card.eyebrow)}</p>` : ''}
                        <h3 class="card-title">${escapeHtml(card.title)}</h3>
                        ${card.body ? `<p class="card-copy">${escapeHtml(card.body)}</p>` : ''}
                        ${card.badge ? `<div class="inline-badge">${escapeHtml(card.badge)}</div>` : ''}
                        ${renderBullets(card.bullets)}
                        ${renderAction(card.action, prefix, 'ghost')}
                    </div>
                </article>`
        )
        .join('');

    return `
    <section class="page-section"${section.id ? ` id="${escapeHtml(section.id)}"` : ''}>
        <div class="container">
            ${renderSectionHeading(section)}
            <div class="card-grid columns-${columns}">${cards}</div>
        </div>
    </section>`;
}

function renderMetricsSection(section) {
    const columns = section.columns || Math.min(Math.max(section.items?.length || 1, 1), 4);
    const items = (section.items || [])
        .map(
            (item, index) => `
                <article class="metric-card" data-reveal style="--reveal-delay: ${index * 80}ms;">
                    <p class="metric-value">${escapeHtml(item.value)}</p>
                    <p class="metric-label">${escapeHtml(item.label)}</p>
                    ${item.detail ? `<p class="metric-detail">${escapeHtml(item.detail)}</p>` : ''}
                </article>`
        )
        .join('');

    return `
    <section class="page-section"${section.id ? ` id="${escapeHtml(section.id)}"` : ''}>
        <div class="container">
            ${renderSectionHeading(section)}
            <div class="metric-grid columns-${columns}">${items}</div>
        </div>
    </section>`;
}

function renderStorySection(section, prefix) {
    return `
    <section class="page-section"${section.id ? ` id="${escapeHtml(section.id)}"` : ''}>
        <div class="container">
            ${renderSectionHeading(section)}
            <div class="story-grid">
                <article class="surface-card story-copy" data-reveal>
                    ${renderParagraphs(section.body)}
                    ${renderBullets(section.bullets)}
                    ${renderAction(section.action, prefix, section.action?.variant || 'secondary')}
                </article>
                <aside class="surface-card story-aside" data-reveal style="--reveal-delay: 120ms;">
                    ${section.asideEyebrow ? `<p class="card-kicker">${escapeHtml(section.asideEyebrow)}</p>` : ''}
                    ${section.asideTitle ? `<h3 class="card-title">${escapeHtml(section.asideTitle)}</h3>` : ''}
                    ${section.asideBody ? `<p class="story-note">${escapeHtml(section.asideBody)}</p>` : ''}
                    ${renderPillList(section.asidePoints)}
                    ${renderBullets(section.asideBullets)}
                    ${renderAction(section.asideAction, prefix, section.asideAction?.variant || 'ghost')}
                </aside>
            </div>
        </div>
    </section>`;
}

function renderTimelineSection(section) {
    const items = (section.items || [])
        .map(
            (item, index) => `
                <article class="timeline-card" data-reveal style="--reveal-delay: ${index * 90}ms;">
                    ${item.phase ? `<p class="phase-tag">${escapeHtml(item.phase)}</p>` : ''}
                    <h3 class="card-title">${escapeHtml(item.title)}</h3>
                    ${item.body ? `<p class="card-copy">${escapeHtml(item.body)}</p>` : ''}
                    ${renderBullets(item.bullets)}
                </article>`
        )
        .join('');

    return `
    <section class="page-section"${section.id ? ` id="${escapeHtml(section.id)}"` : ''}>
        <div class="container">
            ${renderSectionHeading(section)}
            <div class="timeline-grid">${items}</div>
        </div>
    </section>`;
}

function renderFaqSection(section) {
    const items = (section.items || [])
        .map(
            (item, index) => `
                <details class="disclosure" data-reveal style="--reveal-delay: ${index * 70}ms;">
                    <summary>${escapeHtml(item.question)}</summary>
                    <div class="disclosure-body">${escapeHtml(item.answer)}</div>
                </details>`
        )
        .join('');

    return `
    <section class="page-section"${section.id ? ` id="${escapeHtml(section.id)}"` : ''}>
        <div class="container">
            ${renderSectionHeading(section)}
            <div class="disclosure-list">${items}</div>
        </div>
    </section>`;
}

function renderSections(sections, prefix) {
    return (sections || [])
        .map((section) => {
            if (section.type === 'metrics') return renderMetricsSection(section);
            if (section.type === 'story') return renderStorySection(section, prefix);
            if (section.type === 'timeline') return renderTimelineSection(section);
            if (section.type === 'faq') return renderFaqSection(section);
            return renderCardsSection(section, prefix);
        })
        .join('');
}

function renderFinalCta(finalCta, prefix) {
    if (!finalCta) return '';
    return `
    <section class="page-section">
        <div class="container">
            <div class="surface-card cta-banner" data-reveal>
                <div>
                    ${finalCta.eyebrow ? `<p class="eyebrow">${escapeHtml(finalCta.eyebrow)}</p>` : ''}
                    <h2 class="section-title">${escapeHtml(finalCta.title)}</h2>
                    ${finalCta.text ? `<p class="section-copy">${escapeHtml(finalCta.text)}</p>` : ''}
                </div>
                <div class="cta-banner-actions">
                    ${renderAction(finalCta.primaryAction, prefix, 'primary')}
                    ${renderAction(finalCta.secondaryAction, prefix, finalCta.secondaryAction?.variant || 'secondary')}
                </div>
            </div>
        </div>
    </section>`;
}

function pageTypeForTemplate(template) {
    if (template === 'company') return 'AboutPage';
    if (template === 'contact') return 'ContactPage';
    if (template === 'newsroom') return 'CollectionPage';
    return 'WebPage';
}

function pageHtml({ site, page }) {
    const pagePath = ensureTrailingSlash(page.path);
    const prefix = depthPrefix(pagePath);
    const title = page.title ? `${page.title} | ${site.siteName}` : site.defaultTitle;
    const description = page.description || site.defaultDescription;
    const canonical = absoluteUrl(site.siteUrl, pagePath);
    const ogImage = absoluteUrl(site.siteUrl, page.ogImage || site.defaultOgImagePath);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': pageTypeForTemplate(page.template),
        name: title,
        url: canonical,
        description,
        isPartOf: {
            '@type': 'WebSite',
            name: site.siteName,
            url: site.siteUrl,
        },
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(site.keywords || '')}">
    <meta name="robots" content="index,follow">
    <meta name="theme-color" content="#04060c">
    <meta name="author" content="ATMTA, Inc.">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="icon" type="image/png" href="${escapeHtml(resolveAsset(prefix, 'Icon.png'))}">
    <link rel="apple-touch-icon" href="${escapeHtml(resolveAsset(prefix, 'Icon.png'))}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(site.siteName)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@staratlas">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImage)}">
    <link rel="stylesheet" href="${escapeHtml(resolveAsset(prefix, 'styles.css'))}">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body class="template-${escapeHtml(page.template || 'feature')}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    ${renderBackground()}
    ${renderHeader(prefix, page.navKey)}
    <main id="main-content" class="page-main">
        <section class="page-section page-hero">
            <div class="container page-hero-grid">
                <div class="page-hero-copy" data-reveal>
                    ${page.eyebrow ? `<p class="eyebrow">${escapeHtml(page.eyebrow)}</p>` : ''}
                    <h1 class="display-title page-display">${escapeHtml(page.heroTitle || page.title)}</h1>
                    <p class="hero-lede">${escapeHtml(page.heroSummary || description)}</p>
                    <div class="hero-actions">
                        ${renderAction(page.primaryAction, prefix, 'primary')}
                        ${renderAction(page.secondaryAction, prefix, page.secondaryAction?.variant || 'secondary')}
                    </div>
                    ${renderHeroStats(page.heroStats)}
                    ${page.utilityLine ? `<div class="utility-line"><strong>Status</strong><span>${escapeHtml(page.utilityLine)}</span></div>` : ''}
                </div>
                <div class="hero-media">
                    <div data-reveal style="--reveal-delay: 120ms;">${renderMedia(page.heroMedia, prefix)}</div>
                    ${renderHeroPanel(page.heroPanel)}
                </div>
            </div>
        </section>
        ${renderSections(page.sections, prefix)}
        ${renderFinalCta(page.finalCta, prefix)}
    </main>
    ${renderFooter(prefix)}
    <script src="${escapeHtml(resolveAsset(prefix, 'src/main.js'))}" defer></script>
</body>
</html>`;
}

async function loadPages() {
    const entries = await fs.readdir(pagesDir);
    const files = entries.filter((entry) => entry.endsWith('.json')).sort();
    const pages = [];

    for (const file of files) {
        const raw = await fs.readFile(path.join(pagesDir, file), 'utf8');
        pages.push(JSON.parse(raw));
    }

    return pages;
}

async function main() {
    const site = JSON.parse(await fs.readFile(siteConfigPath, 'utf8'));
    const pages = await loadPages();

    for (const page of pages) {
        const pagePath = ensureTrailingSlash(page.path);
        const outDir = path.join(repoRoot, pagePath);
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, 'index.html'), pageHtml({ site, page }), 'utf8');
        console.log(`Generated: ${pagePath}index.html`);
    }

    const urls = [
        absoluteUrl(site.siteUrl, ''),
        ...pages.map((page) => absoluteUrl(site.siteUrl, ensureTrailingSlash(page.path))),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map(
                (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === absoluteUrl(site.siteUrl, '') ? '1.0' : '0.8'}</priority>
  </url>`
            )
            .join('\n')}
</urlset>
`;

    await fs.writeFile(path.join(repoRoot, 'sitemap.xml'), sitemap, 'utf8');
    await fs.writeFile(path.join(repoRoot, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(site.siteUrl, 'sitemap.xml')}\n`, 'utf8');
    console.log(`Generated ${pages.length} pages, sitemap.xml, and robots.txt.`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
