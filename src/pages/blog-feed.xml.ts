import type { APIRoute } from 'astro';
import { posts, excerpt, postUrl } from '../lib/blog';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? 'https://www.azmicrocredit.org/').replace(/\/$/, '');
  const items = posts
    .map((p) => {
      const link = base + postUrl(p);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.datePublished).toUTCString()}</pubDate>
      <dc:creator>${esc(p.author)}</dc:creator>
      <description>${esc(excerpt(p, 400))}</description>
      ${p.categories.map((c) => `<category>${esc(c.name)}</category>`).join('')}
      <enclosure url="${base}${p.cover}" type="image/${p.cover.endsWith('.jpg') ? 'jpeg' : 'png'}" length="0" />
      <content:encoded><![CDATA[${p.html}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Arizona Microcredit Initiative | Blog</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/blog-feed.xml" rel="self" type="application/rss+xml" />
    <description>Read the latest news about what our organization is doing in the community!</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(posts[0].dateModified).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
