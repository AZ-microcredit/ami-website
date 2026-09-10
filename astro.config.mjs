import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.azmicrocredit.org',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  // The live site exposes a Spanish "/es" mirror via Wix Multilingual, but the content
  // was never translated (it serves the same English pages). Redirect it to the English URLs.
  redirects: {
    '/es': '/',
    // old slug still linked from a few legacy pages
    '/schedule-a-consultation': '/copy-2-of-consulting#schedule',
    // NOTE: a dynamic '/es/[...slug]' -> '/[...slug]' redirect is not possible in static output
    // (Astro requires getStaticPaths for rest params and the build fails). Map /es/* -> /* at the
    // host level (e.g. Netlify/Vercel redirects) instead.
  },
});
