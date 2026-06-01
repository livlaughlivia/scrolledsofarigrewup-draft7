gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollSmoother);

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

const delayed = selectAll(".insta-update");
const stage = select('.stage');
let smoother;


// ── MARK: CLIP PATH SHAPES ────────────────────────────────────
const SHAPES = {
    // ── Era 1 ──
    'shape-17': `
    <path d="M208.73,547.36c-12.21.44-19.66-6.27-22.66-14.84-3.11-8.89.92-19.08,6.29-24.43,7.28-7.24,10.36-13.35,10.36-21.16,0-13.56-14.74-29.59-29.59-29.59s-24.79,9.98-28.49,21.72c-3,9.52-7.63,16.12-17.09,22.83-12.17,8.63-21.43,9.88-43.67,9.88-23.96,0-43.67,17.56-43.67,43.67,0,13.8,6.28,26.64,16.83,34.77h169.52c4.81-4.99,7.24-11.76,7.24-17.76,0-8.06-6.43-25.75-25.08-25.08Z"/>
    `,
    'shape-18': `
    <path d="M577.64,226.82c-19.57-13.87-29.12-27.5-35.34-47.19-7.65-24.27-27.9-44.91-58.9-44.91s-61.17,33.14-61.17,61.17c0,16.15,6.38,28.79,21.42,43.75,11.11,11.05,19.44,32.12,13.01,50.5-6.2,17.72-21.59,31.58-46.84,30.67-38.56-1.38-51.85,35.19-51.85,51.85,0,23.15,17.46,51.85,51.85,51.85,5.03,0,11.4-1.28,17.02-3.02,7.41-2.28,16.85-.54,25.46,6.27,7.82,6.19,13.05,17.84,12.26,24.84-.54,4.79-.61,7.04-.61,10.01,0,23.38,14.46,41.56,41.56,41.56,17.07,0,41.56-11.4,41.56-41.56,0-20.39,12.89-33.11,25.08-41.56,11.97-8.31,34.77-13.14,53.94-3.52,4.46,2.24,9.3,4.13,14.23,5.66v-176.53c-27.39-1.42-43.24-6.09-62.68-19.87Z"/>
    `,

    // ── Era 2 ──
    // Floater 2: Halbkreis links-unten
    'shape-19': `
    <path d="M155.39,496.52c-42.47,0-76.9,34.43-76.9,76.9,0,5.77.66,11.38,1.86,16.78h150.09c1.2-5.4,1.86-11.02,1.86-16.78,0-42.47-34.43-76.9-76.9-76.9Z"/>
    `,
    // Floater 1: grosser Kreis rechts
    'shape-20': `
    <path d="M526.85,161.77c-99.72,0-180.55,80.84-180.55,180.55s80.84,180.55,180.55,180.55c42.99,0,82.46-15.03,113.47-40.12V201.88c-31.01-25.08-70.48-40.12-113.47-40.12Z"/>
    `
};

const BASE_W = 640.32;
const BASE_H = 684.64;

// Gibt den Shape-Inhalt mit korrektem Offset zurück
function getShapeContent(shapeId, frameW, frameH) {
    // Unten ausgerichtete Shapes (links-unten)
    if (shapeId === 'shape-17' || shapeId === 'shape-19') {
        const offsetY = frameH - BASE_H;
        return `<g transform="translate(0, ${offsetY})">${SHAPES[shapeId]}</g>`;
    }
    // Rechts ausgerichtete Shapes
    if (shapeId === 'shape-18' || shapeId === 'shape-20') {
        const offsetX = frameW - BASE_W;
        return `<g transform="translate(${offsetX}, 0)">${SHAPES[shapeId]}</g>`;
    }
    return SHAPES[shapeId];
}

// Floater: weiss = sichtbar, schwarz = unsichtbar
function applyClipToElement(el, shapeId, frameW, frameH) {
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;

    const uid = Math.random().toString(36).slice(2, 8);
    const maskId = `mask-${shapeId}-${uid}`;
    const shapeContent = getShapeContent(shapeId, frameW, frameH);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${frameW} ${frameH}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;';

    svg.innerHTML = `
        <defs>
          <mask id="${maskId}">
            <rect x="0" y="0" width="${frameW}" height="${frameH}" fill="black"/>
            <g fill="white">${shapeContent}</g>
          </mask>
        </defs>
        <image href="${img.src}" x="0" y="0" width="${frameW}" height="${frameH}"
          preserveAspectRatio="xMidYMid slice" mask="url(#${maskId})"/>
    `;

    img.style.display = 'none';
    el.appendChild(svg);
    el._clipSvg = svg.querySelector('image');
}

// Hauptbild: invertierte Maske — schwarz = ausgeschnitten
function applyInvertedMask(el, shapeIds, frameW, frameH) {
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;

    const uid = Math.random().toString(36).slice(2, 8);
    const maskId = `mask-main-${uid}`;
    const blackShapes = shapeIds
        .map(id => getShapeContent(id, frameW, frameH))
        .join('');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${frameW} ${frameH}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;';

    svg.innerHTML = `
        <defs>
          <mask id="${maskId}">
            <rect x="0" y="0" width="${frameW}" height="${frameH}" fill="white"/>
            <g fill="black">${blackShapes}</g>
          </mask>
        </defs>
        <image href="${img.src}" x="0" y="0" width="${frameW}" height="${frameH}"
          preserveAspectRatio="xMidYMid slice" mask="url(#${maskId})"/>
    `;

    img.style.display = 'none';
    el.appendChild(svg);
}

function initClipPaths() {
    document.querySelectorAll('.post-wrapper').forEach((wrapper) => {
        const frameImg = wrapper.querySelector('.ig-frame img');
        if (!frameImg) return;

        // Era per Attribut bestimmen: data-era="1" oder data-era="2"
        const era = wrapper.getAttribute('data-era') || '1';

        const floater1Shape = era === '2' ? 'shape-20' : 'shape-18';
        const floater2Shape = era === '2' ? 'shape-19' : 'shape-17';
        const floater3Shape = era === '2' ? 'shape-19' : 'shape-17';

        const apply = () => {
            const w = frameImg.naturalWidth;
            const h = frameImg.naturalHeight;
            if (!w || !h) return;

            wrapper.style.aspectRatio = `${w} / ${h}`;

            applyInvertedMask(
                wrapper.querySelector('.insta-post:not(.ig-frame)'),
                [floater2Shape, floater1Shape],
                w, h
            );
            applyClipToElement(wrapper.querySelector('.floater1'), floater1Shape, w, h);
            applyClipToElement(wrapper.querySelector('.floater2'), floater2Shape, w, h);
            applyClipToElement(wrapper.querySelector('.floater3'), floater3Shape, w, h);
        };

        if (frameImg.complete && frameImg.naturalWidth) apply();
        else frameImg.addEventListener('load', apply);
    });
}


// ── MARK: DELAYED (Insta Updates) ────────────────────────────
function initDelayed() {
    delayed.forEach((card) => {
        const holdAttr = parseFloat(card.getAttribute('attr-delay-hold'));
        const holdVh = Number.isFinite(holdAttr) ? holdAttr : 0;

        gsap.set(card, { autoAlpha: 0, y: 20 });

        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 20%",
                end: () => "+=" + holdVh + "px",
                scrub: true,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true,
            }
        })
            .to(card, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'none' }, 0)
            .to(card, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'none' }, 0.2)
            .to(card, { autoAlpha: 0, y: -20, duration: 0.25, ease: 'none' }, 0.75);
    });
}


// ── MARK: PARALLAX ────────────────────────────────────────────
function initParallax() {
    const slides = selectAll(".post-wrapper");

    slides.forEach((slide) => {
        slide.querySelectorAll('.floater').forEach((floater) => {
            const speedY = Number.isFinite(parseFloat(floater.getAttribute('attr-float-speed-y')))
                ? parseFloat(floater.getAttribute('attr-float-speed-y')) : 0;
            const speedX = Number.isFinite(parseFloat(floater.getAttribute('attr-float-speed-x')))
                ? parseFloat(floater.getAttribute('attr-float-speed-x')) : 0;
            const scale = Number.isFinite(parseFloat(floater.getAttribute('attr-scale')))
                ? parseFloat(floater.getAttribute('attr-scale')) : 1;
            const blurStart = Number.isFinite(parseFloat(floater.getAttribute('attr-blur-start')))
                ? parseFloat(floater.getAttribute('attr-blur-start')) : 0;
            const blurEnd = Number.isFinite(parseFloat(floater.getAttribute('attr-blur-end')))
                ? parseFloat(floater.getAttribute('attr-blur-end')) : 0;

            gsap.set(floater, { y: 0, x: 0, force3D: true });

            gsap.fromTo(floater,
                { y: 0, x: 0, scale: 1, filter: `blur(${blurStart}px)` },
                {
                    y: () => speedY + "px",
                    x: () => speedX + "px",
                    scale: scale,
                    filter: `blur(${blurEnd}px)`,
                    scrollTrigger: {
                        trigger: slide,
                        scrub: true,
                        start: "20% 30%",
                        end: "bottom top",
                        invalidateOnRefresh: true,
                    },
                    immediateRender: false,
                    ease: 'none'
                }
            );
        });

        const instaPost = slide.querySelector('.insta-post:not(.ig-frame)');
        if (instaPost) {
            gsap.set(instaPost, { opacity: 0 });
            gsap.to(instaPost, {
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: slide,
                    start: "top 50%",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true,
                }
            });
        }
    });
}


// ── MARK: INIT ────────────────────────────────────────────────
function init() {
    smoother = ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1,
        wrapper: '#smooth-wrapper',
        content: '#smooth-content'
    });
    window.smoother = smoother;

    gsap.set(stage, { autoAlpha: 1 });

    initClipPaths();
    initParallax();

    document.querySelectorAll('.floater').forEach(f => {
        gsap.set(f, { y: 0, x: 0 });
    });

    initDelayed();
    ScrollTrigger.refresh();
}

function initOnFirstScrollIntent() {
    let hasInitialized = false;

    const teardown = () => {
        window.removeEventListener('scroll', onFirstIntent);
        window.removeEventListener('wheel', onFirstIntent);
        window.removeEventListener('touchmove', onFirstIntent);
        window.removeEventListener('keydown', onFirstKeydown);
    };

    const onFirstIntent = () => {
        if (hasInitialized) return;
        hasInitialized = true;
        teardown();
        init();
    };

    const onFirstKeydown = (event) => {
        const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
        if (scrollKeys.includes(event.key)) onFirstIntent();
    };

    window.addEventListener('scroll', onFirstIntent, { passive: true });
    window.addEventListener('wheel', onFirstIntent, { passive: true });
    window.addEventListener('touchmove', onFirstIntent, { passive: true });
    window.addEventListener('keydown', onFirstKeydown);
}

window.addEventListener('load', () => {
    init();
});