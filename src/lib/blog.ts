/**
 * Blog data helpers shared by the blog list, single post, category/tag/archive,
 * search, RSS and legacy CMS pages. All data comes from src/data/posts.json.
 */
import rawPosts from '../data/posts.json';
import wixExcerpts from '../data/post-excerpts.json';

export interface Category { name: string; slug: string }
export interface Post {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  author: string;
  cover: string;
  tags: string[];
  categories: Category[];
  html: string;
}

/** The scraped tag list also contains the sidebar tag-cloud entries ("arizona(4)4 posts"); drop those. */
const isCloudEntry = (t: string) => /\(\d+\)\s*\d+ posts?$/.test(t);

/** All posts, newest first, with cleaned tags. */
export const posts: Post[] = (rawPosts as Post[])
  .map((p) => ({ ...p, tags: p.tags.filter((t) => !isCloudEntry(t)) }))
  .sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());

export const POSTS_PER_PAGE = 10;

export const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, '-');

/** Legacy Wix CMS slug: the title lower-cased with spaces -> dashes, punctuation kept ("a/b-testing", "why-conduct-market-research?-"). */
export const legacySlug = (title: string) => title.toLowerCase().replace(/ /g, '-');

export const postUrl = (p: Post) => `/single-post/${p.slug}`;
export const categoryUrl = (slug: string) => `/blog/categories/${slug}`;
export const tagUrl = (tag: string) => `/blog/tags/${slugify(tag)}`;

const TZ = 'America/Phoenix';
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZ });

/** Categories in the order the live site lists them (all exist even when empty). */
export const categories: Category[] = [
  { name: 'Build', slug: 'build' },
  { name: 'Elevate', slug: 'elevate' },
  { name: 'Expand', slug: 'expand' },
  { name: 'Business Plan', slug: 'business-plan' },
  { name: 'Business Registration', slug: 'business-registration' },
  { name: 'Finance/Accounting', slug: 'finance-accounting' },
  { name: 'Fundraising', slug: 'fundraising' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Operations', slug: 'operations' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Success Stories', slug: 'success-stories' },
  { name: 'New Build', slug: 'new-build' },
  { name: 'new custom list', slug: 'new-custom-list' },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const postsInCategory = (slug: string) => posts.filter((p) => p.categories.some((c) => c.slug === slug));

/** Tag cloud: [{ name, slug, count }] sorted the way Wix sorts (case-sensitive alphabetical). */
export const tags = (() => {
  const m = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of posts) for (const t of p.tags) {
    const slug = slugify(t);
    const e = m.get(slug) ?? { name: t, slug, count: 0 };
    e.count++;
    m.set(slug, e);
  }
  return [...m.values()].sort((a, b) => (a.name < b.name ? -1: a.name > b.name ? 1: 0));
})();

export const postsWithTag = (slug: string) => posts.filter((p) => p.tags.some((t) => slugify(t) === slug));

/** Month/year archive derived from datePublished: [{ year, month, label, count }] newest first. */
export const archive = (() => {
  const m = new Map<string, { year: string; month: string; label: string; count: number }>();
  for (const p of posts) {
    const d = new Date(p.datePublished);
    const parts = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', timeZone: TZ }).formatToParts(d);
    const year = parts.find((x) => x.type === 'year')!.value;
    const month = parts.find((x) => x.type === 'month')!.value;
    const key = `${year}-${month}`;
    const label = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', timeZone: TZ }).format(d);
    const e = m.get(key) ?? { year, month, label, count: 0 };
    e.count++;
    m.set(key, e);
  }
  return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1: -1)).map(([, v]) => v);
})();

export const postsInMonth = (year: string, month: string) =>
  posts.filter((p) => {
    const parts = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', timeZone: TZ }).formatToParts(new Date(p.datePublished));
    return parts.find((x) => x.type === 'year')!.value === year && parts.find((x) => x.type === 'month')!.value === month;
  });

/** Posts the live site pins in the "Featured Posts" widget (A/B Testing is the one shown first). */
export const featured: Post[] = ['a-b-testing-5', 'creating-financial-statements', 'business-model-canvas']
  .map((s) => posts.find((p) => p.slug === s)!)
  .filter(Boolean);

export const recent = (n = 10) => posts.slice(0, n);

/** Plain-text excerpt for cards / RSS: the excerpt Wix showed in its post lists, else the SEO description. */
export const excerpt = (p: Post, max = 300) => {
  const t = ((wixExcerpts as Record<string, string>)[p.slug] || p.description).replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…': t;
};

/**
 * URL slugs the legacy Wix CMS pages (/posts/<slug>) used for a post: the exact title-derived slug
 * (with "/", "|", "?", ":" kept: Wix percent-encodes them), the same with a trailing dash (titles that
 * had trailing whitespace), punctuation-stripped variants that a static file server can actually serve,
 * and the modern post slug. Deduplicated; when two posts share a title the newer one wins.
 */
export const legacyPostSlugs = (p: Post): string[] => {
  const base = legacySlug(p.title);
  const safe = base.replace(/[?:|()'".,!]/g, '').replace(/-{2,}/g, '-');
  const out = new Set<string>();
  for (const s of [base, safe]) {
    out.add(s);
    out.add(s + '-');
  }
  out.add(p.slug);
  return [...out].filter((s) => s.length > 0 && !s.startsWith('-'));
};
