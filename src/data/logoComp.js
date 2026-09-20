// Integro Bank Foundation Logo Competition - content for /logo-comp.
// Primary source: Tom Rietz's draft contest packet (PDF). Cross-referenced
// with Brendan's meta prompts. Conflicts resolved toward the PDF per
// Atharva's instruction; genuinely unsettled details stay PENDING tokens.
export const PENDING = 'Pending';

export const heroFacts = [
  { term: 'Prize', lines: ['$1,500', 'One winning designer'] },
  { term: 'Who', lines: ['AZ small businesses', 'and design students'] },
  { term: 'Entries', lines: ['Open Sep 21', 'Close Oct 10'] },
  { term: 'Winner', lines: ['Oct 24', 'At the pitch competition'] },
];

export const palette = [
  { name: 'Integro gold', hex: '#C2A14D' },
  { name: 'Near black', hex: '#0B0B0C' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Text grey', hex: '#4A4E57' },
];

export const briefRequirements = [
  { title: 'Built on small business.', copy: "The bank exists to help small business maximize growth and employment, and says it is built on integrity, clarity, learning, and growth. Design a mark that can stand next to those ideas." },
  { title: 'Answer the relationship.', copy: 'The mark can join the Integro family, share one device with the bank, or stand on its own. Any of the three can win - explain your choice in two or three sentences.' },
  { title: 'Work in one color.', copy: 'Solid black on white and solid white on black, with nothing lost. A foundation mark gets embroidered, engraved, and printed in one ink.' },
  { title: 'Survive a thumbnail.', copy: 'Most people will meet this mark as a browser tab icon or social avatar. Fine lines, thin type, and small detail disappear - test it small.' },
  { title: 'Look like a foundation.', copy: 'Warm and human, still considered in 10 yrs. Skip the charity cliches: cupped hands, swooshes, sunbursts, figures in a ring, hearts.' },
  { title: 'Be yours to give.', copy: "Original, human-made, and free of any other party's rights. If you set the name in a licensed typeface, name it and its license." },
];

export const enterCards = [
  {
    title: 'Who can enter',
    body: 'Arizona small businesses, students enrolled in an Arizona design program or university, and individual Arizona designers are welcome. Entrants must be 18 or older.',
    note: 'There is no entry fee.',
    pendings: [],
  },
  {
    title: 'What to submit',
    body: 'Submit one ZIP file containing the logo at full size, an SVG vector source file, and black-contrast and white-contrast versions. Include a half-page rationale and evidence of your working process.',
    note: 'Incomplete entries cannot be judged.',
    pendings: [],
  },
  {
    title: 'Human work only',
    body: 'This is a competition for human designers. Ordinary design software, spell-checkers, and reference searches are fine - the line is drawn at generating the mark or its elements. Every entry carries a signed statement of human authorship.',
    note: 'A false statement voids the entry and, if discovered later, the prize and any rights granted.',
    pendings: [],
  },
];

export const timeline = [
  { n: '01', title: 'Entries open', date: 'Sep 21', copy: 'The call opens to Arizona small businesses, individual designers, and Arizona design students.' },
  { n: '02', title: 'Entries close', date: 'Oct 10', copy: 'Submit one complete ZIP through the entry form.' },
  { n: '03', title: 'Finalists present', date: 'Oct 14', copy: 'Finalists present their work to the Integro Bank Foundation board.' },
  { n: '04', title: 'Winner announced', date: 'Oct 24', copy: 'The winner is announced at the West Valley Pitch Competition.' },
];

export const judgingCriteria = [
  { weight: '30', name: 'Idea', copy: 'Does the mark say something true about a foundation built on small business and employment?' },
  { weight: '25', name: 'Craft', copy: 'Drawing, spacing, and type. Built well enough to be a permanent asset.' },
  { weight: '20', name: 'Durability', copy: 'One color, small sizes, embroidery, engraving. Judged at thumbnail size first.' },
  { weight: '15', name: 'Fit with the bank', copy: 'Whichever relationship you proposed, is it argued convincingly and does it hold up?' },
  { weight: '10', name: 'Completeness', copy: 'All four items submitted, vector files usable, rationale clear.' },
];

export const rightsTerms = [
  { title: 'Your rights until you win.', copy: 'You keep every right in your entry unless you win.' },
  { title: 'On acceptance.', copy: 'The winner assigns all copyright and trademark rights in the winning mark to the Integro Bank Foundation, signs a short assignment agreement, and delivers the source files. The Foundation may modify, refine, or extend the mark thereafter.' },
  { title: 'Credit.', copy: 'The winner is credited as the designer wherever the Foundation reasonably can, and may show the work in a portfolio.' },
  { title: 'Showcase.', copy: 'Entrants warrant original, human-authored, non-infringing work. Non-winning entries may appear in a public showcase with credit unless you opt out on the entry form.' },
  { title: 'Taxes.', copy: 'The prize is income. The winner completes a Form W-9 before payment and is responsible for any tax owed.' },
];

export const boardSlots = ['Board member', 'Board member', 'Board member', 'Board member'];

export const entryPendings = [];

export const paletteNeutrals = [
  { name: 'Gold tint', hex: '#E0C87E', use: 'Supporting tint' },
  { name: 'Mid grey', hex: '#8E9298', use: 'Rules, captions' },
  { name: 'Section band', hex: '#F2F2F0', use: 'Section bands' },
];

export const brandFoundations = [
  { k: 'Mission', v: 'To help small business maximize growth and employment.' },
  { k: 'The why', v: 'Employment lifts people up, transforms lives and impacts communities.' },
  { k: 'The how', v: 'We start with integrity to build trust. We evaluate risks by providing consultative advice.' },
  { k: 'Positioning line in market', v: 'Rise to the top, with rock-solid consultative banking.', dark: true },
];

export const brandPillars = [
  { name: 'Integrity', copy: "A foundation of trust. Called the bank's DNA." },
  { name: 'Clarity', copy: 'Helping owners see their world from a different viewpoint.' },
  { name: 'Learning', copy: 'Analytics, data dashboards, performance metrics.' },
  { name: 'Growth', copy: 'Coaching and consulting dedicated to small-business growth.' },
];

export const brandImagery = {
  copy: 'Photography is people-first and transactional: handshakes, small groups in offices, one smiling professional to camera. Neutral backgrounds, even lighting, images cut out or lightly masked. Icons are thin gold line drawings on white - growth arrows, trust, employment.',
  gap: 'No documented photo direction, and stock-feeling imagery where real Arizona small-business owners would be stronger.',
  channels: [
    { name: 'Website', copy: 'Black header, white body, gold accents across the product areas and Integro360.' },
    { name: 'LinkedIn', copy: 'The only social channel linked from the site. Event promotion, CEO Club, and article shares dominate.' },
    { name: 'Events', copy: 'Co-branded graphics. Co-branding rules are undefined.' },
  ],
};

export const brandType = {
  summary: 'The bank\'s site runs on a single humanist sans across headings and body, at a fairly narrow size range. There is no documented type scale, no display face, and no editorial pairing.',
  consequence: 'Because no type system is documented, a submitted wordmark has nothing to sit against. Name the typeface you used and supply outlines - the entry form asks for both - or the winning mark cannot be extended to a website and stationery without redrawing it.',
  licensing: 'A logo built from a retail font usually needs an extended or logo license from the foundry. Declaring the typeface and license on the entry form keeps the Foundation from inheriting a licensing problem with the winning file.',
};

export const brandVoice = {
  traits: 'Direct sentences. First person plural. Verbs of action - grow, lift, transform, deliver. Small business is named constantly, and community impact is the closing argument in almost every section.',
  wobbles: 'Exclamation marks and phrases like "WOW our clients" sit against formal investor language on the same page. Some copy still references COVID-19 recovery. Trademark and service-mark symbols appear inconsistently on Integro360.',
  sentence: 'Our focus on small business creates jobs, transforms lives, and builds strong communities.',
  sentenceNote: "The sentence a new mark has to live up to. It serves as the brand's one-line summary in search results and link previews.",
};
