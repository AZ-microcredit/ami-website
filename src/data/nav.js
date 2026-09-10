// Site navigation. Paths mirror the live Wix site's URL slugs so links match 1:1.
export const nav = [
  { label: 'About', href: '/about-us', children: [
    { label: 'Meet the Team', href: '/meet-the-team' },
    { label: 'Board of Advisors', href: '/board-of-advisors' },
    { label: 'In the News', href: '/in-the-news' },
  ]},
  { label: 'Microloans', href: '/copy-of-loans', children: [
    { label: "Microloan FAQ's", href: '/copy-of-microloan-faq-s-1' },
    { label: 'Schedule Loan Call', href: '/copy-of-apply-for-a-loan' },
  ]},
  { label: 'Consulting', href: '/copy-2-of-consulting', children: [
    { label: 'Schedule Consultation Call', href: '/copy-of-schedule-a-consultation' },
    { label: 'Our Methodology', href: '/copy-of-our-methodology-1' },
  ]},
  { label: 'Education', href: '/copy-of-education', children: [
    { label: 'Resource Index', href: '/copy-2-of-education-f' },
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
