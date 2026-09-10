# Arizona Microcredit Initiative — website

Code rebuild of [azmicrocredit.org](https://www.azmicrocredit.org) (previously a Wix site) as a static
[Astro](https://astro.build) project. The rebuild mirrors the live site’s routes, including legacy homepage drafts
(same slugs, e.g. `/copy-of-loans` is the LOANS page), the blog posts and events are data files,
and all images are stored locally under `public/media/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321 with live reload
npm run build      # static output in dist/ (deploy that folder anywhere: Netlify, Vercel, GitHub Pages, S3…)
npm run preview    # serve the built dist/ locally
```

## Where things live

| path | what |
| --- | --- |
| `src/pages/*.astro` | one file per page, named after the live URL slug |
| `src/pages/single-post/[slug].astro` | blog post template (data from `src/data/posts.json`) |
| `src/pages/event-details-registration/[slug].astro` | event page template (data from `src/data/events.js`) |
| `src/layouts/Base.astro` | header / footer / cookie banner wrapper used by every page |
| `src/components/` | reusable blocks (hero, slideshow, "why our…" row, schedule CTA, events widget, blog list…) |
| `src/data/nav.js` | navigation menu + social links |
| `src/styles/global.css` | brand colors, fonts, shared classes |
| `public/media/` | all images (named by Wix media id) |
| `tools/` | scripts that were used to import content from Wix (see `tools/README.md`) |

## Editing content

- **Text on a page**: open the page in `src/pages/` and edit the HTML.
- **Blog post**: edit/add an entry in `src/data/posts.json` (`html` holds the article body).
- **Event**: edit/add an entry in `src/data/events.js`. Events with a start date in the future (or no date) show as upcoming on the home / education / events pages.
- **Team, advisors, FAQ, documents lists**: these are plain arrays at the top of the relevant page file.
- **Menu**: `src/data/nav.js`.

## Integrations still to wire up

Wix-hosted widgets could not be copied as code; each has a placeholder in the page with an
`<!-- INTEGRATION: … -->` comment:

- Scheduling calendar (Wix Bookings) on `/copy-of-apply-for-a-loan`, `/copy-of-schedule-a-consultation`, `/marketfund`
- Contact form on `/contact` and event RSVP forms
- Donation checkout on `/copy-of-donate`
- Client-logo carousel on `/copy-2-of-consulting`
- Google Maps on event pages
- Fonts are loaded from Wix's CDN (Helvetica/Avenir/DIN web fonts); swap to self-hosted or Google Fonts if that is ever blocked.

See `CLAUDE.md` for the coding conventions used throughout.

## Repository and rebuild status

Repository: https://github.com/AZ-microcredit/ami-website

The local rebuild is based on the repository's initial commit. Generated output, dependencies,
Astro caches, and environment files are excluded by `.gitignore`.

- The static build generates 430 pages, including `/home`, `/copy-of-home`, and `/copy-of-home-f`.
- `/` and `/copy-of-home-f` share `src/components/HomePage.astro`; the legacy variant shows testimonials in place of the Business Builders Program.
- `/copy-of-home` retains the original video poster and draft testimonial text. Newsletter signup is disabled until an email provider is connected.
- Hosting and the live Wix site have not been changed.
- A broader visual review of the other legacy page families remains pending.
- Known inherited route gaps: punctuation-containing legacy CMS URLs need host redirects; two `huub-workshop-*` form URLs lack parent event detail pages. Some legacy links target posts that no longer exist on the source site.

## Local design preview (September 2026)

The homepage, main service introductions, About page, navigation, and footer have been modernized using the AMI Branding Guide, with Dorm Room Fund as the primary visual reference. Bain Capital Ventures and Legora informed the photographic composition and spacious layouts. All changes are local; nothing has been deployed.

Start the preview with `npm run dev -- --host 127.0.0.1`, then open http://127.0.0.1:4321 in a browser. Keep the terminal running. Stop it with Control-C.

Brand treatment: #5EB346 green, grayscale photography, Helvetica headings, Georgia body copy, sharp rectangular surfaces. Fonts resolve locally without external font requests.

New photography is saved in `public/media/ami-community.jpg` (100_1954.JPG, December 2025 pitch competition) and `public/media/ami-workshop.jpg` (IMG_7768.jpeg, F24 stock photos), from the supplied Google Drive folders. `ami-pitch-2025.jpg` is an additional downloaded branding photo (100_1963.JPG).

The Calendly widget from GitHub main (ee9972b) has been restored locally for consulting and loan meetings, preserving its configured event URLs. Donation checkout remains unconnected and has an email contact fallback; no payment processing or new backend has been added. Legacy content pages keep their routes and receive the shared branding, header, and footer.

Market Fund was removed at the organization’s request. Its three legacy URLs redirect to the current services section. The main CTA is now “Book a free consultation”; the header uses the current official black AMI logo from Drive.
