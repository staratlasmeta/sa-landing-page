(function () {
    'use strict';

    const root = document.documentElement;
    const body = document.body;
    const header = document.querySelector('[data-header]');
    const nav = document.querySelector('[data-nav]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navShell = document.querySelector('.nav-shell');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    const isExternalLink = (href) => /^https?:|^mailto:|^tel:/i.test(href || '');

    const setHeaderState = () => {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 24);
    };

    const closeNav = () => {
        if (!nav || !navToggle) return;
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
    };

    const openNav = () => {
        if (!nav || !navToggle) return;
        nav.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('nav-open');
    };

    if (nav && navToggle) {
        navToggle.addEventListener('click', () => {
            if (nav.classList.contains('is-open')) closeNav();
            else openNav();
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('click', (event) => {
            if (!nav.classList.contains('is-open')) return;
            if (navShell && navShell.contains(event.target)) return;
            closeNav();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeNav();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 920) closeNav();
        });
    }

    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealNodes.forEach((node) => node.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.05,
                rootMargin: '20px 0px 0px 0px',
            }
        );

        revealNodes.forEach((node) => revealObserver.observe(node));
        
        // Safety fallback: Reveal everything after 1.5s just in case
        setTimeout(() => {
            revealNodes.forEach(node => {
                if (!node.classList.contains('is-visible')) {
                   node.classList.add('is-visible');
                }
            });
        }, 1500);
    }

    const ambientVideos = Array.from(document.querySelectorAll('video[data-ambient-video]'));

    const tryPlay = (video) => {
        if (!video || prefersReducedMotion) return;
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => {
                video.controls = false;
            });
        }
    };

    if (prefersReducedMotion) {
        ambientVideos.forEach((video) => {
            video.pause();
            video.removeAttribute('autoplay');
        });
    } else if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) tryPlay(video);
                    else video.pause();
                });
            },
            {
                threshold: 0.35,
            }
        );

        ambientVideos.forEach((video) => videoObserver.observe(video));
    } else {
        ambientVideos.forEach((video) => tryPlay(video));
    }

    if (!prefersReducedMotion && hasFinePointer) {
        document.addEventListener('mousemove', (event) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = (event.clientY / window.innerHeight) * 2 - 1;
            root.style.setProperty('--pointer-x', x.toFixed(4));
            root.style.setProperty('--pointer-y', y.toFixed(4));
        });
    }

    const showcaseControls = Array.from(document.querySelectorAll('[data-showcase-control]'));
    const showcaseVideo = document.querySelector('[data-showcase-video]');
    const showcaseSource = document.querySelector('[data-showcase-source]');
    const showcaseEyebrow = document.querySelector('[data-showcase-eyebrow]');
    const showcaseTitle = document.querySelector('[data-showcase-title]');
    const showcaseCopy = document.querySelector('[data-showcase-copy]');
    const showcaseLabel = document.querySelector('[data-showcase-label]');
    const showcasePoints = document.querySelector('[data-showcase-points]');
    const showcaseLink = document.querySelector('[data-showcase-link]');

    const updateShowcase = (control) => {
        if (!control) return;

        showcaseControls.forEach((button) => {
            const active = button === control;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        if (showcaseEyebrow) showcaseEyebrow.textContent = control.dataset.showcaseEyebrow || '';
        if (showcaseTitle) showcaseTitle.textContent = control.dataset.showcaseTitle || '';
        if (showcaseCopy) showcaseCopy.textContent = control.dataset.showcaseCopy || '';
        if (showcaseLabel) showcaseLabel.textContent = control.dataset.showcaseLabel || '';

        if (showcasePoints) {
            showcasePoints.innerHTML = '';
            const points = (control.dataset.showcasePoints || '')
                .split('||')
                .map((item) => item.trim())
                .filter(Boolean);

            points.forEach((point) => {
                const item = document.createElement('li');
                item.textContent = point;
                showcasePoints.appendChild(item);
            });
        }

        if (showcaseLink) {
            const href = control.dataset.showcaseLink || '#';
            showcaseLink.href = href;
            showcaseLink.textContent = control.dataset.showcaseLinkLabel || 'Explore';

            if (isExternalLink(href)) {
                showcaseLink.target = '_blank';
                showcaseLink.rel = 'noopener noreferrer';
            } else {
                showcaseLink.removeAttribute('target');
                showcaseLink.removeAttribute('rel');
            }
        }

        if (showcaseVideo && showcaseSource) {
            const nextSource = control.dataset.showcaseVideo || '';
            const nextPoster = control.dataset.showcasePoster || '';
            if (nextSource) showcaseSource.src = nextSource;
            if (nextPoster) showcaseVideo.poster = nextPoster;
            showcaseVideo.load();
            tryPlay(showcaseVideo);
        }
    };

    showcaseControls.forEach((control) => {
        control.addEventListener('click', () => updateShowcase(control));
    });

    const activeControl = showcaseControls.find((control) => control.classList.contains('is-active')) || showcaseControls[0];
    if (activeControl) updateShowcase(activeControl);
})();
