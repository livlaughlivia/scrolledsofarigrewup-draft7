gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollSmoother);

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

const delayed = selectAll(".insta-update");
const stage = select('.stage');
let smoother;


// ── MARK: CLIP PATH SHAPES ────────────────────────────────────
const SHAPES = {
    'shape-16': `
    <rect x="0" y="2.72" width="640.32" height="106.6"/>
    <path d="M483.4,134.73c31,0,51.25,20.64,58.9,44.91,6.21,19.69,15.77,33.32,35.34,47.19,19.44,13.78,35.3,18.46,62.68,19.87V109.32H0v480.88h57.05c-10.55-8.14-16.83-20.98-16.83-34.77,0-26.1,19.71-43.67,43.67-43.67,22.23,0,31.49-1.25,43.67-9.88,9.46-6.71,14.09-13.3,17.09-22.83,3.7-11.74,13.49-21.72,28.49-21.72s29.59,16.03,29.59,29.59c0,7.81-3.08,13.93-10.36,21.16-5.38,5.35-9.4,15.54-6.29,24.43,3,8.57,10.44,15.27,22.66,14.84,18.65-.67,25.08,17.02,25.08,25.08,0,6-2.43,12.77-7.24,17.76h413.75v-166.98c-4.94-1.53-9.78-3.43-14.23-5.66-19.17-9.62-41.97-4.78-53.94,3.52-12.19,8.45-25.08,21.17-25.08,41.56,0,30.16-24.49,41.56-41.56,41.56-27.1,0-41.56-18.18-41.56-41.56,0-2.98.07-5.22.61-10.01.79-7-4.44-18.65-12.26-24.84-8.61-6.81-18.05-8.55-25.46-6.27-5.63,1.73-11.99,3.02-17.02,3.02-34.4,0-51.85-28.7-51.85-51.85,0-16.66,13.29-53.23,51.85-51.85,25.25.9,40.64-12.95,46.84-30.67,6.43-18.38-1.89-39.45-13.01-50.5-15.04-14.96-21.42-27.6-21.42-43.75,0-28.03,30.47-61.17,61.17-61.17Z"/>
  `,
    'shape-17': `
    <path d="M208.73,547.36c-12.21.44-19.66-6.27-22.66-14.84-3.11-8.89.92-19.08,6.29-24.43,7.28-7.24,10.36-13.35,10.36-21.16,0-13.56-14.74-29.59-29.59-29.59s-24.79,9.98-28.49,21.72c-3,9.52-7.63,16.12-17.09,22.83-12.17,8.63-21.43,9.88-43.67,9.88-23.96,0-43.67,17.56-43.67,43.67,0,13.8,6.28,26.64,16.83,34.77h169.52c4.81-4.99,7.24-11.76,7.24-17.76,0-8.06-6.43-25.75-25.08-25.08Z"/>
  `,
    'shape-18': `
    <path d="M577.64,226.82c-19.57-13.87-29.12-27.5-35.34-47.19-7.65-24.27-27.9-44.91-58.9-44.91s-61.17,33.14-61.17,61.17c0,16.15,6.38,28.79,21.42,43.75,11.11,11.05,19.44,32.12,13.01,50.5-6.2,17.72-21.59,31.58-46.84,30.67-38.56-1.38-51.85,35.19-51.85,51.85,0,23.15,17.46,51.85,51.85,51.85,5.03,0,11.4-1.28,17.02-3.02,7.41-2.28,16.85-.54,25.46,6.27,7.82,6.19,13.05,17.84,12.26,24.84-.54,4.79-.61,7.04-.61,10.01,0,23.38,14.46,41.56,41.56,41.56,17.07,0,41.56-11.4,41.56-41.56,0-20.39,12.89-33.11,25.08-41.56,11.97-8.31,34.77-13.14,53.94-3.52,4.46,2.24,9.3,4.13,14.23,5.66v-176.53c-27.39-1.42-43.24-6.09-62.68-19.87Z"/>
  `
};

const BASE_W = 640.32;
const BASE_H = 684.64;

function applyClipToElement(el, shapeId) {
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;

    const uid = Math.random().toString(36).slice(2, 8);
    const clipId = `clip-${shapeId}-${uid}`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${BASE_W} ${BASE_H}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.overflow = 'visible';

    svg.innerHTML = `
    <defs>
      <clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">
        ${SHAPES[shapeId]}
      </clipPath>
    </defs>
    <image
      href="${img.src}"
      x="0" y="0"
      width="${BASE_W}" height="${BASE_H}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#${clipId})"
    />
  `;

    img.style.display = 'none';
    el.appendChild(svg);
    el._clipSvg = svg.querySelector('image');
}

function initClipPaths() {
    document.querySelectorAll('.post-wrapper').forEach((wrapper) => {
        applyClipToElement(wrapper.querySelector('.insta-post:not(.ig-frame)'), 'shape-16');
        applyClipToElement(wrapper.querySelector('.floater1'), 'shape-18');
        applyClipToElement(wrapper.querySelector('.floater2'), 'shape-17');
        applyClipToElement(wrapper.querySelector('.floater3'), 'shape-17');
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
                markers: true
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
        // Floater Parallax
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
                        markers: true
                    },
                    immediateRender: false,
                    ease: 'none'
                }
            );
        });

        // Hauptbild: fade-in beim Scrollen
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