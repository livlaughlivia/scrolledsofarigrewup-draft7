gsap.registerPlugin(SplitText, ScrollTrigger);

let splitIntro, animationIntro, splitQuote;


//--- verschiedene Quotes pro Era ---
const eraQuotes = {
  era1: `
    <span class="quote-line">@Visual-Sun-6018:</span>
    <span class="quote-line">Honestly I miss how unpolished everything felt...</span>
    <span class="divider">✦</span>
  `,
  era2: `
    <span class="quote-line">@CharlesIntheWoods:</span>
    <span class="quote-line">People posted more frequently in 2016...</span>
    <span class="divider">✦</span>
  `,
  era3: `
    <span class="quote-line">@didozer10:</span>
    <span class="quote-line">Photo dumps were very common a decade ago...</span>
  `
};

let currentEra = "era1";

function setupQuotes(era = "era1") {
  splitQuote && splitQuote.revert();

  ScrollTrigger.getAll()
    .filter(t => t.vars.id?.startsWith("quote-block"))
    .forEach(t => t.kill());

  const wrapper = document.querySelector(".quote-block-1");
  if (!wrapper) return;

  wrapper.classList.remove("era1", "era2", "era3");
  wrapper.classList.add(era);

  // 1. CONTENT JE ERA SETZEN
  wrapper.innerHTML = eraQuotes[era];

  // 2. SplitText NEU ERSTELLEN
  splitQuote = SplitText.create(".quote-block-1", { type: "lines" });
  const lines = splitQuote.lines;

  const linesPerPage = 3;
  const totalPages = Math.ceil(lines.length / linesPerPage);

  gsap.set(lines, { opacity: 1, display: "none" });

  const scrollWrapper = document.querySelector(".scroll-sections");
  scrollWrapper.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const section = document.createElement("div");
    section.classList.add("scroll-section");
    section.style.minHeight = "100vh";
    scrollWrapper.appendChild(section);

    const pageLines = lines.slice(i * linesPerPage, (i + 1) * linesPerPage);
    const prevLines = i > 0 ? lines.slice((i - 1) * linesPerPage, i * linesPerPage) : [];
    const nextLines = lines.slice((i + 1) * linesPerPage, (i + 2) * linesPerPage);

    ScrollTrigger.create({
      id: `quote-block-${era}-${i}`,
      trigger: section,
      start: "top center",

      onEnter: () => {
        gsap.set(prevLines, { opacity: 0, display: "none" });
        gsap.set(pageLines, { display: "block" });
        gsap.from(pageLines, { opacity: 0, duration: 0.5, stagger: 0.1 });
      },

      onEnterBack: () => {
        gsap.set(nextLines, { opacity: 0, display: "none" });
        gsap.set(pageLines, { display: "block" });
        gsap.from(pageLines, { opacity: 0, duration: 0.5, stagger: 0.1 });
      }
    });
  }
}

// Era Titles Animation
function initEraTitles1() {
  ScrollTrigger.getAll()
    .filter(t => t.vars.id?.startsWith("era-title-1"))
    .forEach(t => t.kill());

  const era1Lines = document.querySelectorAll('.era1');
  era1Lines.forEach((line, i) => {
    gsap.fromTo(line,
      { fontVariationSettings: '"SRFF" 0, "wght" 700' },
      {
        fontVariationSettings: '"SRFF" 100, "wght" 700',
        ease: 'power2.inOut',
        scrollTrigger: {
          id: `era-title-1-${i}`,
          trigger: line,
          start: 'top 60%',
          end: 'top 40%',
          scrub: 1,
        }
      }
    );
  });
}

function initEraTitles2() {
  ScrollTrigger.getAll()
    .filter(t => t.vars.id?.startsWith("era-title-2"))
    .forEach(t => t.kill());

  const era2Lines = document.querySelectorAll('.era2');
  era2Lines.forEach((line, i) => {
    gsap.fromTo(line,
      { fontVariationSettings: '"SRFF" 100, "wght" 700' },
      {
        fontVariationSettings: '"SRFF" 50, "wght" 700',
        ease: 'power2.inOut',
        scrollTrigger: {
          id: `era-title-2-${i}`,
          trigger: line,
          start: 'top 60%',
          end: 'top 40%',
          scrub: 1,
        }
      }
    );
  });
}

function initEraTitles3() {
  ScrollTrigger.getAll()
    .filter(t => t.vars.id?.startsWith("era-title-3"))
    .forEach(t => t.kill());

  const era3Lines = document.querySelectorAll('.era3');
  era3Lines.forEach((line, i) => {
    gsap.fromTo(line,
      { fontVariationSettings: '"SRFF" 50, "wght" 700' },
      {
        fontVariationSettings: '"SRFF" 0, "wght" 700',
        ease: 'power2.inOut',
        scrollTrigger: {
          id: `era-title-3-${i}`,
          trigger: line,
          start: 'top 60%',
          end: 'top 40%',
          scrub: 1,
        }
      }
    );
  });
}

function setup() {
  // Intro Text (chars)
  splitIntro && splitIntro.revert();
  animationIntro && animationIntro.revert();

  splitIntro = SplitText.create(".intro-text", { type: "chars,words,lines" });
  animationIntro = gsap.from(splitIntro.chars, {
    opacity: 0,
    duration: 0.1,
    ease: "power4",
    stagger: 0.04,
    scrollTrigger: {
      trigger: ".intro-text",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  setupQuotes("era1"); // Start mit Era 1
  initEraTitles1();
  initEraTitles2();
  initEraTitles3();// NEU — hier einfügen
}

document.fonts.ready.then(() => {
  setup();
});

window.addEventListener("resize", setup);

document.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'G') {
    const overlay = document.getElementById('gridOverlay');
    overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
  }
});

ScrollTrigger.create({
  trigger: "#era-1",
  start: "top center",
  onEnter: () => setupQuotes("era1"),
  onEnterBack: () => setupQuotes("era1")
});

ScrollTrigger.create({
  trigger: "#era-2",
  start: "top center",
  onEnter: () => setupQuotes("era2"),
  onEnterBack: () => setupQuotes("era2")
});

ScrollTrigger.create({
  trigger: "#era-3",
  start: "top center",
  onEnter: () => setupQuotes("era3"),
  onEnterBack: () => setupQuotes("era3")
});
