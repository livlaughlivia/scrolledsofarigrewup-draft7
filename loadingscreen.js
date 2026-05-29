gsap.registerPlugin(MorphSVGPlugin);

// Konvertiert circle und rect zu paths bevor der Morph startet
MorphSVGPlugin.convertToPath("circle, rect");

// Morph-Animation
const morphTl = gsap.timeline({ repeat: -1 });

morphTl.to("#icon-morph", { 
    duration: 0.8, 
    morphSVG: "#icon-era2-ref",  // Kreis
    ease: "power2.inOut" 
  })
  .to("#icon-morph", { 
    duration: 0.8, 
    morphSVG: "#icon-era3-ref",  // Quadrat
    ease: "power2.inOut",
    delay: 0.3
  })
  .to("#icon-morph", { 
    duration: 0.8, 
    morphSVG: "#icon-morph",
    ease: "power2.inOut",
    delay: 0.3
  });

// Nach 5 Sekunden ausblenden
setTimeout(() => {
  morphTl.kill();
  
  gsap.timeline()
    .to('.loading-icon', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to('.loading-screen', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        document.querySelector('.loading-screen').style.display = 'none';
      }
    }, '-=0.2')
    .to('.gradient-overlay', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.6');

}, 5000);