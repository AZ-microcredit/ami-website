# Responsive quality checks

Checked September 13, 2026 against the local Astro preview using Chromium through ego-browser.

## Follow-up visual audit

The initial geometry checks below missed a typography regression: standardizing relative font sizes had reduced “Bring it.” to body size while retaining heading letter spacing. This follow-up checked rendered appearance and animation states, not just page overflow.

- Restored display-size serif accents for “Bring it.” and “tangible.” with appropriate letter spacing, retaining the two-font, four-size system.
- Removed horizontal animation travel that made consulting cards collide on phones.
- Prevented donation labels from clipping during normal-flow reveals.
- Reduced funding-note entrance travel and tablet board tilt to keep content within its layout.
- Removed residual heading text over the expanded homepage photo and improved team email wrapping.
- Repaired the team-author link and the resource link for the existing A/B testing article.

Visually reviewed 110 section and animation-state screenshots across the home, consulting, loans, education, donation, and about pages at 390×844 and 1440×900, plus six tablet views at 768×1024. Targeted final regression checks passed all 126 combinations: three affected sections, 14 viewport sizes from 320×568 through 2560×1440, and three scroll positions. These assert heading-accent size, consulting-card separation, funding-note/footer clearance, horizontal overflow, and donation-label clipping. The reusable check is `tools/visual-qc.mjs`, exported as `runVisualQc(page, options)` for an ego-browser page.

Resource search, empty results, and category filtering passed interaction checks. The final production build generated 430 pages successfully, and `git diff --check` passed.

### Remaining content gaps

An internal-link scan of the generated HTML found these ten missing destinations after the two clear link repairs. They require the intended content or an editorial replacement; this audit does not mark them as passing:

- `/single-post/data-driven-decision-making`
- `/single-post/contract-negotiation`
- `/single-post/building-strategic-partnerships`
- `/single-post/data-foundations`
- `/single-post/excel-for-small-business-owners`
- `/single-post/partnership-building`
- `/blog/hashtags/3`
- `/blog/hashtags/hashtag`
- `/blog/hashtags/AZfood`
- `/blog/hashtags/Phoenixfoodie`

The submission and external-flow limitations at the end of this report also remain. Visual results cover Chromium viewport emulation, not independent Safari, Firefox, or physical-device certification.

## Coverage

The 16 primary pages were checked at every viewport below (256 page/viewport combinations). Additional checks covered breakpoint boundaries, article and resource layouts, keyboard interaction, calendar controls, scrolling, reduced motion, and the repaired components (48 final regression combinations).

| Category | Viewports in CSS pixels |
| --- | --- |
| Phones | 320×568, 360×800, 375×667, 390×844, 414×896, 430×932 |
| Landscape phones | 667×375, 844×390 |
| Tablets | 768×1024, 820×1180, 1024×768 |
| Laptops and desktops | 1280×720, 1366×768, 1440×900, 1920×1080, 2560×1440 |

Primary routes: `/`, `/copy-of-loans`, `/copy-2-of-consulting`, `/copy-of-education`, `/copy-of-donate`, `/about-us`, `/events`, `/blog`, `/contact`, `/business-startup-guide`, `/resources-build`, `/loan-application`, `/client-testimonials`, `/impact`, `/privacy-policy`, `/search`.

Additional layout samples: `/resource-index`, `/create-a-budget`, `/single-post/business-registration`. Breakpoint checks: 600, 601, 700, 701, 799, 800, 900, 901, 1100, and 1101px.

## Repairs

- Prevented the phone header from shrinking the menu button and logo. The booking label wraps when needed; the menu button remains 44×44px.
- Bounded the mobile menu to available screen height with internal scrolling. Escape closes it and restores focus. Crossing the desktop breakpoint resets its open state.
- Used the existing heading size for donation words on narrow phones so their icons fit beside them.
- Changed the homepage photo section to natural document flow in windows at most 600px tall, eliminating landscape text overlap.
- Increased calendar controls to at least 44px tap targets and allowed the control row to wrap on narrow phones.

## Results

- No page-wide horizontal overflow, header collisions, or failed loaded images in the primary viewport matrix. Lazy images outside the viewport were not exhaustively loaded.
- Final 48-combination regression: no horizontal overflow, undersized header controls, or overlapping homepage photo-section text.
- FAQ open/close, booking navigation to the consultation section, calendar next month/Today, menu Escape/focus restoration: passed.
- Reduced-motion homepage: cinematic overlay disabled and zero running animations observed.
- Scroll samples across the first 5,400px of the homepage at 390×844, 768×1024, and 1440×900: 89 frame intervals each, none above 50ms. These are observations on this host, not performance guarantees for physical devices.
- `git diff --check`: passed.
- `npm run build`: passed; 430 pages generated.

## Limits and existing integration gaps

These checks emulate viewport dimensions in Chromium. They do not replace physical-device checks or independent Safari/Firefox testing, and do not claim a complete audit of every generated article.

The contact page still has `action="#"` with no submission endpoint. The loan application page still contains a Typeform placeholder. Their responsive layouts were checked, but neither can be considered a functioning submission flow. External Calendly bookings and payment flows were not submitted.
