gsap.registerPlugin(SplitText, ScrollTrigger);

let splitIntro, animationIntro, splitText, animationText;

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

  // Text (lines)
  splitText && splitText.revert();
  animationText && animationText.revert();

  splitText = SplitText.create(".text", { type: "chars,words,lines" });
  animationText = gsap.from(splitText.lines, {
    rotationX: -100,
    transformOrigin: "50% 50% -160px",
    opacity: 0,
    duration: 0.7,
    ease: "power3",
    stagger: 0.25,
    scrollTrigger: {
      trigger: ".text",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
}

setup();
window.addEventListener("resize", setup);