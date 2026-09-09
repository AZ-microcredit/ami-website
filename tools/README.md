# tools/ — crawl & import scripts used to build this replica

These were used once to pull content out of the live Wix site (azmicrocredit.org). They are kept
here so the import can be re-run if the live site changes. All of them expect to be run from a
scratch directory (they write `raw/`, `shots/`, `content/` there) and need Python 3 with
`beautifulsoup4` + `Pillow`, Node with `puppeteer-core`, and Google Chrome installed.

| script | purpose |
| --- | --- |
| `all_urls.txt` | every URL from the live sitemaps (pages, blog posts, events, CMS collections) |
| `crawl.sh` | `xargs -P4 -n1 ./crawl.sh < all_urls.txt` — downloads each page's HTML to `raw/` and a headless-Chrome screenshot to `shots/` |
| `shot.mjs` | better screenshots: scrolls each page so lazy/animated Wix sections render, saves to `shots2/` |
| `extract.py` | `python3 extract.py raw content` — DOM-order text/image/link dump of every page (what the page builders worked from) |
| `dlimg.py` | downloads every `static.wixstatic.com` image referenced in `content/` into `public/media/` (name = media id, `~mv2` stripped) |
| `parse_blog.py` | Wix blog posts → `src/data/posts.json` (cleaned article HTML, local image paths) |
| `parse_events.py` | Wix Events pages → `src/data/events.js` |
| `optimize_media.py` | downsizes anything in `public/media/` larger than 2000px |
| `shotlocal.mjs` | `node shotlocal.mjs out / /copy-of-loans@390` — screenshots local pages served by `npm run preview` for side-by-side comparison |
