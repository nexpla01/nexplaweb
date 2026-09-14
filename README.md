# Nexpla Website — Vercel Test Build

This is a static, dependency-free Nexpla website prototype.

## Run locally

Open `index.html` directly in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Vercel

1. Upload this folder to a GitHub repository, or import the ZIP/folder into Vercel.
2. Framework preset: **Other** (or leave Vercel to detect it as a static site).
3. Build command: **leave blank**.
4. Output directory: **leave blank / root**.
5. Deploy.

## Included

- Responsive homepage
- Nexpla logo + icon assets supplied for this build
- Hero molecular visual
- Scroll reveal animations
- AI-native ERP interaction demo
- Interactive Pharma workflow cards
- Platform / intelligence-layer visualization
- Compounding flywheel
- ERP-owner confidential partnership CTA
- “Ask Nexpla” contextual mini-assistant (demo logic, no external AI API)
- Mobile navigation
- Contact form that prepares an email to `rc@nexpla.com`

## Notes

The “Ask Nexpla” assistant is intentionally a front-end prototype. For production, connect it to a controlled knowledge base / LLM endpoint rather than exposing an API key in browser code.

For production performance, replace the Google Fonts import with self-hosted font files if desired and convert the supplied JPG logo to an optimized SVG/WEBP asset.


## Motion update

The hero now includes a custom SVG/canvas-free “living intelligence network”:
- orbiting rings and flowing connection lines
- independently floating nodes
- animated signal particles
- pulsing Nexpla core
- pointer-based 3D parallax
- reduced-motion support
- no animation library or external runtime dependency


## V3 motion system

This version adds narrative motion across the page:
- Cinematic ERP -> intelligence transformation scene
- Interactive Understand -> Decide -> Execute steps
- AI demo state-transition animation
- Platform signal / intelligence-layer animation
- Compounding flywheel active pulse
- Pointer-responsive dark belief section
- Existing hero living network retained
- Reduced-motion support throughout
