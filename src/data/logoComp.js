// Integro Bank Foundation Logo Competition - content for /logo-comp.
// Every unresolved detail is a PENDING token so review drafts show it and
// launch swaps happen in this one file.
export const PENDING = 'Pending';

export const heroFacts = [
  { term: 'Prize', lines: ['$1,500', PENDING + ' board approval'] },
  { term: 'Who', lines: ['Designers statewide', 'across Arizona'] },
  { term: 'Deadline', lines: [PENDING, 'To be announced'] },
  { term: 'Winner', lines: ['Sat, Oct 24', 'West Valley Pitch Competition'] },
];

export const palette = [
  { name: 'Integro gold', hex: '#C2A14D' },
  { name: 'Near black', hex: '#0B0B0C' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Text grey', hex: '#4A4E57' },
];

export const enterCards = [
  {
    title: 'Who can enter',
    body: 'The competition is open statewide across Arizona.',
    pendings: ['Entrant categories', 'Age limits', 'Teams and organizations', 'Entry limits'],
  },
  {
    title: 'What to submit',
    body: 'A scalable, vectorized logo is required.',
    pendings: ['File formats and exports', 'DPI and sizing', 'Supporting material', 'File size and packaging'],
    note: 'A 4K working target was discussed but is not a final rule.',
  },
  {
    title: 'AI use',
    body: 'AI tools can support ideation. The final logo may not be purely AI-generated.',
    pendings: ['Detection approach', 'Enforcement'],
  },
];

export const timeline = [
  {
    n: '01',
    title: 'Submissions close',
    date: PENDING,
    copy: 'The submission deadline is being finalized with the Foundation.',
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
    copy: 'The winning logo is announced live at the West Valley Pitch Competition, 11 a.m. to 3 p.m. in Peoria.',
  },
];

export const judgingPoints = [
  { pts: '3', label: 'First choice' },
  { pts: '2', label: 'Second choice' },
  { pts: '1', label: 'Third choice' },
];

export const boardSlots = ['Board member', 'Board member', 'Board member', 'Board member'];

export const entryPendings = ['Submission method', 'Entry form or email', 'Questions contact', 'Confirmation workflow'];
