# AMI website (azmicrocredit.org rebuild)

Local, code-based rebuild of the Arizona Microcredit Initiative Wix site. Static site built with **Astro 5** (no framework, plain CSS). Goal: pixel-faithful replica of the live site at desktop width (1280px), with a sensible responsive layout below 900px (the live Wix mobile layout is broken, so we do not copy it).

## Commands

```bash
npm run dev       # dev server at http://localhost:4321
npm run build     # static build to dist/
npm run preview   # serve dist/ at http://localhost:4321
```

## Layout / conventions

- `src/layouts/Base.astro` — every page uses it: `<Base title="Arizona Microcredit Initiative | X">…</Base>`. It renders Header, `<main>`, Footer and the cookie banner.
- `src/components/` — shared pieces: `Hero` (full-bleed photo + green title boxes + CTA), `WhyRow` ("WHY OUR X | text" row), `ScheduleCTA` ("SCHEDULE A CALL" block), `Slideshow` (hero carousel), `ClientSlider` (slider gallery with caption + counter), `EventsWidget` (upcoming events list / "No events at the moment").
- `src/styles/global.css` — CSS variables and shared classes. Use them instead of re-declaring:
  - colors: `--green #5eb346` (bands, cards, footer), `--green-dark #289e19` (active nav, some buttons), `--navy #070d3a`, `--grey-bg`.
  - fonts: `--font-bold` (Helvetica Bold — all headings and most UI text), `--font-body` (Helvetica Roman), `--font-avenir-light` / `--font-avenir-heavy` (footer, dropdown, blog/event widgets), `--font-din`.
  - classes: `.spaced-title` (big letter-spaced uppercase titles like "O U R  I M P A C T"), `.band` (green strip with white title), `.btn .btn-green .btn-dark-green .btn-outline .btn-outline-black`, `.hero-title .hero-subtitle` (green-highlight text boxes), `.why-row`, `.tile-grid .tile`, `.rich` (long-form text), `.container` (980px Wix grid), `.wide` (1280px).
- Page-specific CSS goes in a `<style>` block inside the page file. Keep desktop widths matching the reference screenshots; add `@media (max-width: 900px)` and `(max-width: 600px)` rules so nothing overflows on phones.
- Site content width is **980px** centered (`--content-width`); heroes and green bands are full-bleed.
- URLs mirror the live Wix slugs exactly (e.g. `/copy-of-loans` is the LOANS page, `/copy-2-of-consulting` is CONSULTING). File = `src/pages/<slug>.astro`. Internal links must use those paths (relative, no domain). Nav data lives in `src/data/nav.js`.
- Images: all site media is already downloaded to `public/media/` named by the Wix media id with `~mv2` stripped, e.g. `https://static.wixstatic.com/media/760f7c_abc~mv2.jpg` → `/media/760f7c_abc.jpg`. Reference them as `/media/<file>`. Icons (SVG) live in `public/icons/`.
- Data: `src/data/posts.json` (36 blog posts: slug, title, description, datePublished, dateModified, readTime, cover, tags, categories, html), `src/data/events.js` (45 events: slug, title, start/end ISO, fullDate, fullLocation, address, image, description[], registrationClosed, rsvpHref, categories).
- Third-party embeds that need credentials (Wix Bookings scheduler, Wix Forms, Facebook feed, Google Maps) are replaced with a clearly-marked placeholder block styled to the same size, plus an HTML comment `<!-- INTEGRATION: … -->` explaining what to wire in. Keep external links (Google Forms, social, issuu, etc.) as-is.

## Reference material (scratchpad, outside the repo)

`/private/tmp/claude-501/-Users-atailor-PROJECTS-ami-website/acfa10c2-bad2-4f74-a203-10c4681a7277/scratchpad/`
- `shots2/<slug>.png` — full-page 1280px screenshot of the live page after scrolling (best reference; some lazy widgets may still be blank). `shots/<slug>.png` — earlier capture without scrolling (sometimes shows a widget the other missed). `<slug>` = URL path with `/` → `__`, `index` for the homepage.
- `content/<slug>.txt` — DOM-order dump of the live page: headings (`#`), paragraphs with font sizes (`p: … {20px}`), links, image URLs, buttons, iframes.
- `raw/<slug>.html` — the original Wix HTML if you need to dig for something (inline styles, colors, JSON-LD).
- `shotlocal.mjs` — screenshot a local page: `cd <scratchpad> && node shotlocal.mjs local /copy-of-loans /copy-of-loans@390` (requires `npm run preview` running on :4321 in the repo). Compare with `shots2/`.

## Verification checklist for a page

1. `npm run build` passes with no errors.
2. Screenshot the local page and compare with `shots2/<slug>.png`: same section order, same text, same colors/fonts, similar spacing.
3. Every image in the content dump appears (no broken `/media/` paths — check `ls public/media | grep <id>`).
4. Links point to local slugs (`/copy-of-loans`, not `https://www.azmicrocredit.org/...`) except real external links.
5. Nothing overflows at 390px width.
