# AntiGravity — Portfolio & How It Works

[Live demo](https://antigravity-portfolio-fawn.vercel.app/) — Hosted on Vercel

<p align="center">
  <img src="./assets/banner.svg" alt="AntiGravity banner" width="100%" />
</p>

This README focuses on how the project functions (behavior, code paths, and where to customize). If you want a short public README for visitors, let me know and I will extract a concise version — this file is aimed at maintainers and contributors.

---

## High-level overview
AntiGravity is a static, single-page portfolio that combines interactive visuals, downloadable developer roadmaps (PDFs), a lightweight on-site AI assistant, and a responsive project gallery. All interactivity is implemented in plain JavaScript and runs entirely in the browser — no server-side code is required.

Key runtime pieces:
- Floating particles background (pure DOM + CSS animations)
- Navigation with active-link highlighting and a mobile hamburger
- Roadmap download flow with a localStorage-based download counter and "View Online" raw file links
- Chat widget (simple rule-based assistant implemented client-side)
- Smooth scrolling and intersection-observer powered entrance animations
- Contact form stub (Netlify-ready attribute) that currently shows a success notification on submit

---

## Where to look in the code
- `index.html` — HTML structure and content (sections: home, roadmaps, projects, contact, chat widget)
- `style.css` — visual styling, layout, and animations
- `script.js` — all interactive behavior (detailed below)
- `pdfs/` — static PDF assets referenced by the roadmap cards
- `assets/` — banner, preview images or SVGs used in the README and inside the site

---

## Behaviour & implementation details (line references)
Below are the main functional parts implemented in `script.js` with equivalent descriptions and how to change them.

1) Particles background
- Function: `createParticles()` (script.js lines ~1–18)
- What it does: creates 100 small `.particle` DIVs, positions them randomly, and assigns random size, opacity, and animation timings.
- Customize: change `particleCount` or particle styles in `style.css` to change density and appearance.

2) Navigation active link highlighting
- Function: `setupNavigation()` (lines ~20–42)
- What it does: listens to scroll events, determines the current section by comparing `scrollY` to each section's `offsetTop`, and updates `.nav-link.active` accordingly.
- Customize: modify the scroll offset (`-200`) to change when links become active or swap to an IntersectionObserver for better performance.

3) Mobile hamburger menu
- Function: `setupMobileMenu()` (lines ~44–55)
- What it does: toggles `.active` classes on the hamburger and nav menu to show/hide mobile navigation.
- Customize: change CSS for `.nav-menu.active` to customize the mobile menu behaviour/animation.

4) Download counters & PDF download flow
- `initDownloadCounters()` reads counts from `localStorage` keys `downloadCount1..4` and updates DOM elements (lines ~57–66).
- `downloadPDF(filename, cardId)` (lines ~68–91) increments the counter in `localStorage`, updates the visible count, creates a temporary `<a>` tag with `download` and triggers a click to start the download, then shows a temporary notification.
- Notes:
  - The counters are purely local to each visitor's browser — they do not reflect global downloads.
  - Files are served from `/pdfs/` and also linked via the raw GitHub URL (so the "View Online" button points to `https://raw.githubusercontent.com/aklilut40-code/antigravity-portfolio/main/pdfs/...`).
- Customize:
  - To track global downloads, replace the localStorage flow with a server endpoint that logs downloads, or integrate analytics (e.g., Google Analytics, Plausible).
  - To change filenames or add new roadmaps, put PDFs in `pdfs/` and update the links in `index.html`.

5) Notifications
- Function: `showNotification(message)` (lines ~93–115)
- What it does: creates a small floating notification element with a fade animation and auto-removes after 2s.
- Customize: change styles or duration for different UI feedback.

6) AI Chat widget (client-side rule-based)
- Setup: `setupChat()` (lines ~117–202)
- What it does:
  - UI: toggles the chat window open/close, handles send button and Enter key.
  - Logic: `aiResponses` is a JS object with canned answers (skills, projects, roadmaps, experience, contact, default).
  - `getAIResponse(question)` performs simple keyword matching against the incoming question to pick a canned response.
  - Messages are rendered with `addMessage()` and the chat simulates thinking with a 500ms timeout.
- Customize:
  - Edit `aiResponses` to change or expand canned responses.
  - To plug in a real LLM (OpenAI, Anthropic, etc.): implement a server endpoint that accepts user queries and calls the provider (server required to keep API keys secret). Update `sendMessage()` to POST the user query to that endpoint and display the response.
  - Note: for a client-side only demo you can also fetch responses from a small JSON mapping or a remote endpoint.

7) Smooth scroll
- Function: `setupSmoothScroll()` (lines ~204–220)
- What it does: intercepts anchor clicks that start with `#` and uses `scrollIntoView({behavior: 'smooth'})`. Also closes the mobile nav if open.

8) Contact form
- Implementation: basic HTML form with `netlify` attribute (line ~376). There is no backend configured in the repo — the submit handler in `setupContactForm()` prevents default, shows a notification, and resets the form (lines ~222–232).
- To make it functional:
  - Use Netlify Forms (keep the `netlify` attribute and configure in Netlify dashboard), or
  - Add a serverless function (Vercel, Netlify functions) that receives POST requests and sends an email (using SendGrid, Mailgun, or similar), or
  - Wire the form to a service like Formspree or Getform by changing the form `action` to their endpoint.

9) IntersectionObserver animations
- Setup: `setupScrollAnimations()` (lines ~234–256)
- What it does: sets opacity to 0 and translateY on roadmaps, project cards, and contact items; when an element intersects, transitions bring it into place for a smooth entrance effect.
- Customize: add more selectors to animate additional elements, adjust threshold and rootMargin for earlier/later triggers.

10) Initialization
- All features are initialized on `DOMContentLoaded` (lines ~258-280) in this order:
  1. createParticles()
  2. setupNavigation()
  3. setupMobileMenu()
  4. initDownloadCounters()
  5. setupChat()
  6. setupSmoothScroll()
  7. setupContactForm()
  8. setupScrollAnimations()
- This ordering ensures UI is ready before user interaction. If you add a bundler or module system, move initialisation into the appropriate lifecycle hook.

---

## Quick developer notes (how to update functionality)
- Roadmap PDFs: add or remove files in `/pdfs/` and update the roadmap card links in `index.html`. The `download` anchor will trigger the browser save dialog; the JS `downloadPDF()` function is not currently wired to the HTML buttons — you can either wire it by changing the button to call `onclick="downloadPDF('yourfile.pdf', 1)"` or keep the `<a download>` behavior.

- Make download counters global: replace `localStorage` with a server-side counter endpoint and call it from `downloadPDF()` (POST download event). Secure that endpoint to avoid spam.

- Replace canned AI with an LLM: create a server API route that calls OpenAI (or another provider). Example flow:
  1. Client sends POST to `/api/query` with user question.
  2. Server calls OpenAI with an API key and returns the response.
  3. Client displays the server response in the chat.

- Contact form: for production, set up Netlify forms or a serverless/send-email flow and remove the current `preventDefault()` stub in `setupContactForm()`.

---

## Security & Privacy notes
- The AI assistant and download counters are client-only — no user data leaves the visitor's browser under current code.
- If you add analytics or a server-side chat backend, update the privacy policy accordingly and ensure API keys are stored server-side (never commit keys to the repo).

---

## How to run and debug locally
1. Clone repo
```bash
git clone https://github.com/aklilut40-code/antigravity-portfolio.git
cd antigravity-portfolio
```
2. Open `index.html` directly in a browser, or serve with a static server:
```bash
python -m http.server 8000
# open http://localhost:8000
```
3. Open the browser DevTools (Console) to see logs and errors. Modify `script.js` and refresh to test behaviour.

---

## Recommended improvements (prioritized)
1. Wire `downloadPDF()` to the roadmap buttons and optionally add server-side logging for real download stats.
2. Replace canned chat with a secure server-side LLM integration for much richer answers.
3. Add automated tests for critical links and PDF availability (CI check that `pdfs/*.pdf` exist).
4. Replace placeholder contact email (`aklilu.tesfay@example.com`) in `index.html` with your real contact email.
5. Add accessibility improvements: keyboard navigation, aria attributes, and higher contrast where needed.
6. Add a `screenshot-1200x675.png` to `assets/` so the GitHub repo has an attractive preview card.

---

## Contact & maintainer
Owner: Aklilu (Aklilu Tesfay)  
Email in site: aklilu.tesfay@example.com (change in `index.html` to your preferred contact email)  
GitHub: https://github.com/aklilut40-code

---

If you'd like, I can:
- wire `downloadPDF` to the HTML buttons and push the change, so local counters increment on click, or
- implement a simple serverless function to log downloads (Vercel or Netlify) and show global counts in the UI, or
- swap the canned AI for an OpenAI-backed assistant (I'll add a secure server endpoint and show the code), or
- replace the demo SVGs with real screenshots/GIFs from the live site for a richer README preview.

Which of those would you like me to do next?