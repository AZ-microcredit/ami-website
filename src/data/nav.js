// Site navigation. Top-level hrefs are the consolidated family pages (current live-site
// slugs kept for SEO continuity); children are section anchors on the parent page.
export const nav = [
  { label: 'Microloans', href: '/microloans', children: [
    { label: "Microloan FAQ's", href: '/microloans#faq' },
    { label: 'Schedule Loan Call', href: '/microloans#schedule' },
  ]},
  { label: 'Consulting', href: '/consulting', children: [
    { label: 'Schedule Consultation Call', href: '/consulting#schedule' },
    { label: 'Our Methodology', href: '/consulting#methodology' },
  ]},
  { label: 'Education', href: '/education', children: [
    { label: 'Resource Index', href: '/education#resources' },
    { label: 'Events', href: '/events' },
  ]},
  { label: 'Support AMI', href: '/donate', children: [] },
  { label: 'About', href: '/about-us', children: [
    { label: 'Meet the Team', href: '/about-us#meet-the-team' },
    { label: 'Board of Advisors', href: '/about-us#board-of-advisors' },
  ]},
];

export const social = {
  facebook: 'https://www.facebook.com/azmicrocredit/',
  instagram: 'http://instagram.com/azmicrocredit',
  linkedin: 'https://www.linkedin.com/company/arizona-microcredit-initiative/',
  twitter: 'http://www.twitter.com/azmicrocredit',
};
