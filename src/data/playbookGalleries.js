// Items of the Wix "Masonry" galleries on the BUILD / ELEVATE / EXPAND playbook pages
// (extracted from the live page data). Image = Wix media id with ~mv2 stripped,
// link = local blog-post slug. Order matches the live galleries.
const item = (title, description, image, slug) => ({ title, description, image: `/media/${image}`, href: `/single-post/${slug}` });

export const build = [
  item('Value Proposition', 'Why do you want to start a business?', '760f7c_671347cdbc854e9080bffba7d5e99a0d.png', 'value-proposition'),
  item('Vision & Mission', 'What will your business do? How will you reach your goals?', '760f7c_5efc0968fb064bc095c309710b4774cf.png', 'what-will-your-business-do'),
  item('Market Research', 'Who will your business serve? Do they exist?', '760f7c_818351e4406d4c12b270a8a712a979a3.png', 'market-research'),
  item('5 Ps of Marketing', 'How will you establish an online presence?', '760f7c_32e98378b9ac4066bb5adce3b8ffa20e.png', '5-ps-of-marketing-explained'),
  item('Building a Website', 'How will you establish an online presence?', '760f7c_a0d3076535844db6a39e32abda324cd4.png', 'how-to-build-a-website'),
  item('Social Media 101', 'How will you establish an online presence?', '760f7c_e95614bf7fd343a6bc71f37acd6063dd.png', 'social-media-101'),
  item('Generating Customer Feedback', 'How will you get returning customers?', '760f7c_768c9c16078649f19955d844d9c9a269.png', 'customer-feedback'),
  item('Promotion Strategies', 'How will you get returning customers?', '760f7c_2d7b635acfbc45669655274a0168c4f0.png', 'promotion-strategies'),
  item('Email Etiquette', 'What things do you have to do to deliver value?', '85b1e5_c63c110706f14db7ab2f3efa07fe3938.png', 'how-do-i-construct-professional-emails'),
  item('Networking 101', 'What things do you have to do to deliver value?', '760f7c_7942fb4ca4f947cb9d5a031107cd7a1f.png', 'networking-101'),
  item('Problem Solving 101', 'What things do you have to do to deliver value?', '760f7c_ebefb9a494524c1b954bd2ede5bcbbc3.png', 'problem-solving-101'),
  item('Building Processes', 'What things do you have to do to deliver value?', '85b1e5_585615532f124641976fd5f116331cb8.png', 'business-process-improvement-bpi'),
  item('Data-Driven Decision Making', 'What resources do you need to make these things happen?', '760f7c_a2dad91425af4761b5e8aa7cc3b3e384.png', 'data-driven-decision-making'),
  item('Contract Negotiation', 'What resources do you need to make these things happen?', '760f7c_5864ec8e0c074a969ca307ea0d8a3aab.png', 'contract-negotiation'),
  item('Supplier Scorecard', 'Who do you need to make these things happen?', '760f7c_3da281f9d7214f7e87c08d396c2e07cc.png', 'supplier-scorecard'),
  item('Strategic Partnerships', 'Who do you need to make these things happen?', '760f7c_6bc21b66481d467a9d8627598941639c.png', 'building-strategic-partnerships'),
  item('Accounting 101', 'How will you make money? What will all this cost?', '760f7c_f5e52b96f2b9407dbb9115f1e0255a45.png', 'accounting-101'),
  item('Business Registration', 'How will you make your operation official?', '760f7c_4ff0510596da489bb0fd32d749e2adf9.png', 'business-registration'),
  item('Nonprofit Status', 'How will you make your operation official?', '760f7c_bdd7bf3cc88d4e9682bded1c2c509292.png', 'achieving-nonprofit-status'),
  item('Loan Resources', 'What are different ways to get money for your business?', '760f7c_797eb116dd98499da07f0c05c88ab72c.png', 'loan-resources'),
  item('Grant Guide', 'What are different ways to get money for your business?', '760f7c_fb668cdab84946c9b1ddd3094ce41a6b.png', 'grant-funding'),
  item('Business Plan Writing', 'How do I write a business plan?', '760f7c_95e7a701db28445ebfe76909f87cb1ee.png', 'business-plan-writing'),
];

export const elevate = [
  // (the live "Loan Resources" tile links to the upskilling post — kept as-is)
  item('Loan Resources', 'What are different ways to get money for your business?', '760f7c_797eb116dd98499da07f0c05c88ab72c.png', 'small-business-upskilling'),
  item('Grant Guide', 'What are different ways to get money for your business?', '760f7c_fb668cdab84946c9b1ddd3094ce41a6b.png', 'grant-funding'),
  item('Small Business Insurance', 'How can you protect your business?', '85b1e5_94e5f6d8cda3406e97862cc1ac80c93c.png', 'small-business-insurance'),
  item('Data Foundations', 'How can you make better decisions?', '85b1e5_832d1aac4286446093ee3a3fc64ffb0d.png', 'data-foundations'),
  item('Excel for Small Business Owners', 'How can you make better decisions?', '85b1e5_d70eef4abb0847f68d1d662cfefb9eb7.png', 'excel-for-small-business-owners'),
  item('Small Business Upskilling', 'How can you grow as a business owner?', '85b1e5_849763f90b9a432994b338d611343eb9.png', 'small-business-upskilling'),
  item('Partnership Building', 'How can you work with partners to achieve your goals?', '85b1e5_2b79621d07364b56bfb84948c71f1e18.png', 'partnership-building'),
  item('A/B Testing', 'How can you elevate your online presence?', '85b1e5_70148cbb380141e29b87f22e643cf81f.png', 'a-b-testing'),
  item('Social Media Ads', 'How can you elevate your online presence?', '85b1e5_b904e80a62c043ae93d823a173bb58f0.png', 'social-media-ads'),
  item('Pricing', 'How do I appropriately budget and price?', '760f7c_dee8836d8cd9433d97a0bef7bf783a30.png', 'pricing'),
];

export const expand = [
  item('AB testing', 'How can I reach a larger market to find my business’s niche?', '760f7c_d6efeed8d0214461b20922054b045f5e.jpg', 'a-b-testing-2'),
  item('Finding and Retaining Investors', 'What are different ways to get money for your business?', '760f7c_77833d0317bf48f0a4a64cc6d7a4a80f.png', 'finding-and-retaining-investors'),
  item('Operational Analysis', 'Am I using all of my employees effectively?', '760f7c_9b10cb7665984f238ec9a1e1d0885575.jpg', 'operational-analysis-and-measuring-employee-effectiveness'),
  item('Financial Statements_edited_edited', 'How can I take track my profits and costs?', '760f7c_a3667c56e95a4c8c8bd56fc98c6bb565.jpg', 'creating-financial-statements'),
  item('Competitive Analysis', 'How does my business compare to competition?', '760f7c_c2d0587005d747d8b2783a9284184271.png', 'introduction-to-competitive-analysis'),
];
