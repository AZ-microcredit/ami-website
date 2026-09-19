// Integro Bank Foundation Logo Competition - content for /logo-comp.
// Meeting-settled facts come from the Sep 17, 2026 Granola note.
// Submission specs, eligibility detail, and the authorship mechanism are
// filled from Tom Rietz's draft contest packet per Atharva's override.
// Every remaining unresolved detail stays a PENDING token for one-file swaps.
export const PENDING = 'Pending';

export const heroFacts = [
  { term: 'Prize', lines: ['$1,500', PENDING + ' board approval'] },
  { term: 'Who', lines: ['AZ small businesses', 'and design students'] },
  { term: 'Deadline', lines: [PENDING, 'To be announced'] },
  { term: 'Winner', lines: ['Sat, Oct 24', 'West Valley Pitch Competition'] },
];

export const palette = [
  { name: 'Integro gold', hex: '#C2A14D' },
  { name: 'Near black', hex: '#0B0B0C' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Text grey', hex: '#4A4E57' },
];

export const briefRequirements = [
  { title: 'Answer the relationship.', copy: 'The mark can join the Integro family, share one device with the bank, or stand on its own. Any of the three can win - explain your choice in two or three sentences.' },
  { title: 'Work in one color.', copy: 'Solid black on white and solid white on black, with nothing lost. A foundation mark gets embroidered, engraved, and printed in one ink.' },
  { title: 'Survive a thumbnail.', copy: 'Most people will meet this mark as a browser tab icon or social avatar. Fine lines, thin type, and small detail disappear - test it small.' },
  { title: 'Look like a foundation.', copy: 'Warm and human, still considered in 2036. Skip the charity cliches: cupped hands, swooshes, sunbursts, figures in a ring, hearts.' },
  { title: 'Be yours to give.', copy: 'Original, human-made, and free of any other party\'s rights. If you set the name in a licensed typeface, name it and its license.' },
];

export const enterCards = [
  {
    title: 'Who can enter',
    body: 'Open statewide across Arizona, to Arizona small businesses and to students enrolled in Arizona design programs. Individuals and teams are both welcome; a team names one person to receive the prize. Entrants must be 18 or older, or have a guardian sign the entry form.',
    note: 'No entry fee. Employees, directors and officers of Integro Bank and the Foundation, judging panel members, and their immediate families may not enter.',
    pendings: [],
  },
  {
    title: 'What to submit',
    body: 'One presentation sheet (PDF, letter size) showing the mark at full size, at one inch wide, and as a quarter-inch square, including the one-color black and reversed white versions. Vector source files: AI, EPS, or SVG, with type converted to outlines. A half-page rationale, and evidence of your working process.',
    note: 'Submit your strongest idea - up to two entries as separate complete submissions. A 4K working target was discussed but is not a final rule.',
    pendings: [],
  },
  {
    title: 'AI use',
    body: 'AI tools can support concept ideation, but the final submitted logo may not be purely AI-generated. Every entry carries a signed statement of human authorship.',
    note: 'A false authorship statement voids the entry and, if discovered later, the prize.',
    pendings: ['Detection tools to be named by the Foundation'],
  },
];

export const timeline = [
  {
    n: '01',
    title: 'Submissions close',
    date: PENDING,
    copy: 'The deadline is being finalized with the Foundation. It will close with enough time before the October 14 finalist review.',
    pending: true,
  },
  {
    n: '02',
    title: 'Finalists present',
    date: 'Wed, Oct 14',
    copy: 'Five to eight finalists present to a Foundation board committee and get directional feedback to fine-tune their mark.',
  },
  {
    n: '03',
    title: 'Winner announced',
    date: 'Sat, Oct 24',
    copy: 'The winning logo is announced live at the West Valley Pitch Competition, 11 a.m. to 3 p.m. Arizona time, in Peoria.',
  },
];

export const judgingPoints = [
  { pts: '3', label: 'First choice' },
  { pts: '2', label: 'Second choice' },
  { pts: '1', label: 'Third choice' },
];

export const boardSlots = ['Board member', 'Board member', 'Board member', 'Board member'];

export const entryPendings = ['Contest email address', 'Questions contact', 'Confirmation workflow'];
