# Nexpla — V4 Motion Website

Static Vercel-ready site for Nexpla.

## V4 motion direction

The motion system now follows a single narrative: **fragmented context → connected ecosystem → intelligence → action → platform**.

- Cinematic hero with pharma data fragments, live signals, connected nodes and Nexpla core.
- Hero state changes as the visitor scrolls.
- Pointer depth/parallax without a heavy animation dependency.
- Realistic ERP/data context chips that converge into the intelligence layer.
- Existing AI interaction and platform sections retained and strengthened.
- Dark belief section receives a restrained orbital motion treatment.
- Reduced-motion support.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `assets/`

No build step or external runtime dependency is required.


## V6 spatial narrative

Rebuilt the hero around a scene-based WebGL + GSAP ScrollTrigger architecture. The WebGL layer handles the spatial network while HTML/CSS handles readable UI and copy. Scroll synchronizes the two: fragmented context → connection → intelligence → action → platform.


## V6.1 reliability fix

The previous V6 depended on WebGL/Three.js for the hero and could render as an empty white stage when the WebGL context or CDN was unavailable. V6.1 replaces that dependency with a robust high-DPI Canvas 2D spatial renderer while retaining GSAP/ScrollTrigger for scroll choreography. A visual fallback remains underneath so the hero never appears empty.
