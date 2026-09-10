// Site navigation. Top-level hrefs are the consolidated family pages (current live-site
// slugs kept for SEO continuity); children are section anchors on the parent page.
export const nav = [
  { label: 'About', href: '/about-us', children: [
    { label: 'Meet the Team', href: '/about-us#meet-the-team' },
    { label: 'Board of Advisors', href: '/about-us#board-of-advisors' },
    { label: 'In the News', href: '/about-us#in-the-news' },
  ]},
  { label: 'Microloans', href: '/copy-of-loans', children: [
    { label: "Microloan FAQ's", href: '/copy-of-loans#faq' },
    { label: 'Schedule Loan Call', href: '/copy-of-loans#schedule' },
  ]},
  { label: 'Consulting', href: '/copy-2-of-consulting', children: [
    { label: 'Schedule Consultation Call', href: '/copy-2-of-consulting#schedule' },
    { label: 'Our Methodology', href: '/copy-2-of-consulting#methodology' },
  ]},
  { label: 'Education', href: '/copy-of-education', children: [
    { label: 'Resource Index', href: '/copy-of-education#resources' },
    { label: 'Events', href: '/events' },
  ]},
  { label: 'Support AMI', href: '/copy-of-donate', children: [] },
];

export const social = {
  facebook: 'https://www.facebook.com/azmicrocredit/',
  instagram: 'http://instagram.com/azmicrocredit',
  linkedin: 'https://www.linkedin.com/company/arizona-microcredit-initiative/',
  twitter: 'http://www.twitter.com/azmicrocredit',
};
