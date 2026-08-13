export type Region = "uk" | "us";

export type Tool = {
  slug: string;
  title: string;
  region: Region;
  description: string;
  pillarGuide?: string;
  supportingArticles?: string[];
  relatedTools?: string[];
  methodology?: string;
  authorSlug?: string;
  reviewedBy?: string;
  published?: boolean;
};

export type Guide = {
  slug: string;
  title: string;
  region: Region;
  tool: string;
  description?: string;
  relatedGuides?: string[];
  relatedArticles?: string[];
  authorSlug?: string;
  reviewedBy?: string;
  published?: boolean;
};

export type Article = {
  slug: string;
  title: string;
  region: Region;
  guide: string;
  description?: string;
  relatedArticles?: string[];
  authorSlug?: string;
  reviewedBy?: string;
  published?: boolean;
};

export type Methodology = {
  slug: string;
  title: string;
  toolSlug: string;
  lastReviewed: string;
  reviewedBy?: string;
  published?: boolean;
};

export type Author = {
  slug: string;
  name: string;
  jobTitle: string;
  credentials: string[];
  sameAs: string[];
  bio: string;
  photo?: string;
  publications: string[];
};

export type GlossaryTerm = {
  slug: string;
  title: string;
  definition: string;
  body: string;
  relatedTerms: string[];
  relatedTools: string[];
};

export type Update = {
  date: string;
  title: string;
  body: string;
};

export const authors: Author[] = [
  {
    slug: "glenn-rodgers",
    name: "Glenn Rodgers",
    jobTitle: "Investor",
    credentials: [],
    sameAs: ["https://ihatebeards.substack.com/"],
    bio: "I’m a UK entrepreneur and investor with a slightly obsessive interest in money, investing and working out whether the numbers stack up. I’ve built businesses in a few very different industries and have spent years learning, often the hard way, about investing, saving, tax, property and building wealth. I started this site as a place to share the calculators, research and useful financial stuff I find myself looking for, with a focus on keeping things simple and practical.",
    photo: "/glenn-rodgers.jpg",
    publications: [],
  },
];

export const tools: Tool[] = [
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    region: "uk",
    description: "Free net worth tracker with no sign-up. Your data stays in your browser. Add accounts and see your net worth in under a minute, with a Freedom Framework mode and a 4% withdrawal estimate.",
    pillarGuide: "net-worth-tracker",
    supportingArticles: ["sinking-funds"],
    relatedTools: ["fire-number", "compound-interest", "mortgage-overpayment", "debt-payoff", "multi-currency-budget"],
    methodology: "net-worth-tracker",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    region: "us",
    description: "Free net worth tracker with no sign-up. Your data stays in your browser. Add accounts and see your net worth in under a minute, with a Freedom Framework mode and a 4% withdrawal estimate.",
    pillarGuide: "net-worth-tracker",
    supportingArticles: ["emergency-fund-vs-hysa"],
    relatedTools: ["fire-number", "compound-interest", "mortgage-overpayment", "debt-payoff", "multi-currency-budget"],
    methodology: "net-worth-tracker",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    region: "uk",
    description: "Free compound interest calculator for the UK. See how starting amount, monthly contributions, annual rate and time interact. Solve for any variable and switch between monthly, daily and annual compounding.",
    pillarGuide: "compound-interest",
    supportingArticles: ["how-long-to-save-100k"],
    relatedTools: ["fire-number", "net-worth-tracker", "mortgage-overpayment", "debt-payoff", "multi-currency-budget"],
    methodology: "compound-interest",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    region: "us",
    description: "Free compound interest calculator for the US. See how starting amount, monthly contributions, annual rate and time interact. Solve for any variable and switch between monthly, daily and annual compounding.",
    pillarGuide: "compound-interest",
    supportingArticles: ["how-long-to-save-100k"],
    relatedTools: ["fire-number", "net-worth-tracker", "mortgage-overpayment", "debt-payoff", "multi-currency-budget"],
    methodology: "compound-interest",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    region: "uk",
    description: "Estimate the portfolio size needed to cover annual spending.",
    pillarGuide: "fire-number",
    supportingArticles: ["4-percent-rule"],
    relatedTools: ["net-worth-tracker", "compound-interest", "mortgage-overpayment"],
    methodology: "fire-number",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    region: "us",
    description: "Estimate the portfolio size needed to cover annual spending.",
    pillarGuide: "fire-number",
    supportingArticles: ["4-percent-rule"],
    relatedTools: ["net-worth-tracker", "compound-interest", "mortgage-overpayment"],
    methodology: "fire-number",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment",
    region: "uk",
    description: "Free UK mortgage overpayment calculator. See how much interest you could save by overpaying your mortgage, model fixed-rate and SVR periods, and compare overpaying to investing.",
    pillarGuide: "mortgage-overpayment",
    supportingArticles: ["overpay-vs-isa", "10-percent-overpayment-rule"],
    relatedTools: ["compound-interest", "debt-payoff", "fire-number", "net-worth-tracker"],
    methodology: "mortgage-overpayment",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment",
    region: "us",
    description: "Free US mortgage payoff calculator with extra payments. See how much interest you save by paying off your mortgage early, model escrow, and compare early payoff to investing.",
    pillarGuide: "mortgage-overpayment",
    supportingArticles: ["pay-off-vs-401k", "biweekly-mortgage-payments"],
    relatedTools: ["compound-interest", "debt-payoff", "fire-number", "net-worth-tracker"],
    methodology: "mortgage-overpayment",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    region: "uk",
    description: "Free debt payoff calculator for the UK. Add your credit cards and loans, set a monthly budget, and compare the cheapest order to clear them, with your debt-free date and total interest.",
    pillarGuide: "debt-payoff",
    supportingArticles: ["clear-5000-credit-card"],
    relatedTools: ["mortgage-overpayment", "net-worth-tracker", "compound-interest"],
    methodology: "debt-payoff",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    region: "us",
    description: "Free debt snowball vs avalanche calculator. Add your debts, set a monthly budget, and see side-by-side debt-free dates and total interest for both methods.",
    pillarGuide: "debt-payoff",
    supportingArticles: ["pay-off-10000-credit-card"],
    relatedTools: ["mortgage-overpayment", "net-worth-tracker", "compound-interest"],
    methodology: "debt-payoff",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    region: "uk",
    description: "Add income and spending in different currencies and convert to one base.",
    pillarGuide: "multi-currency-budget",
    supportingArticles: ["exchange-rate-risk"],
    relatedTools: ["net-worth-tracker", "compound-interest"],
    methodology: "multi-currency-budget",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    region: "us",
    description: "Add income and spending in different currencies and convert to one base.",
    pillarGuide: "multi-currency-budget",
    supportingArticles: ["exchange-rate-risk"],
    relatedTools: ["net-worth-tracker", "compound-interest"],
    methodology: "multi-currency-budget",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
];

export const guides: Guide[] = [
  {
    slug: "fire-number",
    title: "What is a FIRE number?",
    region: "uk",
    tool: "fire-number",
    description: "What is a FIRE number and how do you calculate it for the UK? Learn the 4% rule, safe withdrawal rates, and why UK retirees may need a lower number.",
    relatedArticles: ["4-percent-rule"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "fire-number",
    title: "What is a FIRE number?",
    region: "us",
    tool: "fire-number",
    description: "What is a FIRE number and how do you calculate it in the US? Learn the 4% rule, the Trinity Study, and how to estimate your retirement portfolio size.",
    relatedArticles: ["4-percent-rule"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "What is a multi-currency budget?",
    region: "uk",
    tool: "multi-currency-budget",
    description: "How to build a multi-currency budget in the UK. Track income and spending in pounds, euros, dollars and more with live exchange rates.",
    relatedArticles: ["exchange-rate-risk"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "What is a multi-currency budget?",
    region: "us",
    tool: "multi-currency-budget",
    description: "How to build a multi-currency budget in the US. Track income and spending across dollars, euros, pounds and more with live exchange rates.",
    relatedArticles: ["exchange-rate-risk"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "What is net worth and how do you track it?",
    region: "uk",
    tool: "net-worth-tracker",
    description: "How to calculate and track your net worth in the UK. Understand assets, liabilities, and use the Freedom Framework to measure progress.",
    relatedArticles: ["sinking-funds"],
    relatedGuides: ["fire-number", "multi-currency-budget"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "What is net worth and how do you track it?",
    region: "us",
    tool: "net-worth-tracker",
    description: "How to calculate and track your net worth in the US. Understand assets, liabilities, and use the Freedom Framework to measure progress.",
    relatedArticles: ["emergency-fund-vs-hysa"],
    relatedGuides: ["fire-number", "multi-currency-budget"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Should you overpay your mortgage?",
    region: "uk",
    tool: "mortgage-overpayment",
    description: "Should you overpay your mortgage in the UK? Compare overpaying to ISAs, pensions and LISAs, understand ERCs, and calculate your interest saving.",
    relatedArticles: ["overpay-vs-isa", "10-percent-overpayment-rule"],
    relatedGuides: ["compound-interest", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Should you pay off your mortgage early?",
    region: "us",
    tool: "mortgage-overpayment",
    description: "Should you pay off your mortgage early in the US? Compare extra principal payments to 401(k) investing, understand prepayment penalties, and see worked examples.",
    relatedArticles: ["pay-off-vs-401k", "biweekly-mortgage-payments"],
    relatedGuides: ["compound-interest", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Snowball vs avalanche: which debt payoff method gets you debt-free faster?",
    region: "uk",
    tool: "debt-payoff",
    description: "Snowball vs avalanche in the UK: which debt payoff method actually clears your credit cards and loans faster? Real numbers on a £25k mixed-debt case, 0% balance-transfer context, and a hybrid plan.",
    relatedArticles: ["clear-5000-credit-card"],
    relatedGuides: ["mortgage-overpayment", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Snowball vs avalanche: which debt payoff method gets you debt-free faster?",
    region: "us",
    tool: "debt-payoff",
    description: "Debt snowball vs debt avalanche: which method actually gets you debt-free faster? Real numbers on a $25k mixed-debt case, when each method wins, and a hybrid plan.",
    relatedArticles: ["pay-off-10000-credit-card"],
    relatedGuides: ["mortgage-overpayment", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound interest: the formula, the rule of 72, and how growth actually builds",
    region: "uk",
    tool: "compound-interest",
    description: "How compound interest works in the UK: the formula, the rule of 72, and why regular contributions matter more than chasing a higher rate. ISA and SIPP context.",
    relatedArticles: ["how-long-to-save-100k"],
    relatedGuides: ["fire-number", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound interest: the formula, the rule of 72, and how growth actually builds",
    region: "us",
    tool: "compound-interest",
    description: "How compound interest works in the US: the formula, the rule of 72, and why regular contributions matter more than chasing a higher rate. 401(k) and index-fund context.",
    relatedArticles: ["how-long-to-save-100k"],
    relatedGuides: ["fire-number", "net-worth-tracker"],
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
];

export const articles: Article[] = [
  {
    slug: "4-percent-rule",
    title: "Is the 4% rule safe in the UK?",
    region: "uk",
    guide: "fire-number",
    description: "Is the 4% rule safe for UK retirees? Why US-based research may be too optimistic for UK investors and what withdrawal rate to use instead.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "4-percent-rule",
    title: "Where does the 4% rule come from?",
    region: "us",
    guide: "fire-number",
    description: "Where does the 4% rule come from? A look at Bengen's 1994 study, the Trinity Study, and what US retirees should know about safe withdrawals.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "exchange-rate-risk",
    title: "How do exchange-rate swings affect your UK budget?",
    region: "uk",
    guide: "multi-currency-budget",
    description: "How exchange-rate swings affect a UK budget. Why converting foreign income and spending to pounds matters and how to manage currency risk.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "exchange-rate-risk",
    title: "How do exchange-rate swings affect your US budget?",
    region: "us",
    guide: "multi-currency-budget",
    description: "How exchange-rate swings affect a US budget. Why converting foreign income and spending to dollars matters and how to manage currency risk.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "sinking-funds",
    title: "How do sinking funds work in the UK?",
    region: "uk",
    guide: "net-worth-tracker",
    description: "How sinking funds work in the UK. Set aside small monthly amounts for predictable expenses like Christmas, car maintenance, and holidays.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "emergency-fund-vs-hysa",
    title: "Emergency fund vs high-yield savings: where should US savers keep cash?",
    region: "us",
    guide: "net-worth-tracker",
    description: "Emergency fund versus high-yield savings: where US savers should keep cash. Learn the difference and how much to keep accessible.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "overpay-vs-isa",
    title: "Should you overpay your mortgage or invest in a Stocks and Shares ISA?",
    region: "uk",
    guide: "mortgage-overpayment",
    description: "Should you overpay your mortgage or invest in a UK Stocks and Shares ISA? Compare guaranteed interest savings against tax-free investment growth.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "pay-off-vs-401k",
    title: "Should you pay off your mortgage early or invest in a 401(k)?",
    region: "us",
    guide: "mortgage-overpayment",
    description: "Should you pay off your mortgage early or invest in a 401(k)? Compare guaranteed principal savings against tax-deferred retirement growth.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "10-percent-overpayment-rule",
    title: "The 10% mortgage overpayment rule explained",
    region: "uk",
    guide: "mortgage-overpayment",
    description: "The 10% mortgage overpayment rule explained for UK borrowers. How annual overpayment limits work, when ERCs apply, and how to check your allowance.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "biweekly-mortgage-payments",
    title: "Should you make biweekly mortgage payments?",
    region: "us",
    guide: "mortgage-overpayment",
    description: "Should you make biweekly mortgage payments? Learn how 26 half-payments save interest, when servicers hold funds, and how to avoid setup fees.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "clear-5000-credit-card",
    title: "How long to clear a £5,000 credit card? Real numbers by APR and monthly payment",
    region: "uk",
    guide: "debt-payoff",
    description: "How long to clear a £5,000 credit card in the UK. Real payoff times and interest at 19.9%, 24.9% and 29.9% APR, and why the minimum-payment trap keeps you in debt for years.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "pay-off-10000-credit-card",
    title: "How long will it take to pay off $10,000 in credit card debt? (Tables at 18%, 22%, 26% APR)",
    region: "us",
    guide: "debt-payoff",
    description: "How long to pay off $10,000 in credit card debt. Payoff-time and interest tables at 18%, 22% and 26% APR for $200, $300 and $500 monthly payments.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "how-long-to-save-100k",
    title: "How long does it take to save £100k?",
    region: "uk",
    guide: "compound-interest",
    description: "How long to save £100k in the UK. Tables for different monthly contributions and rates, and how to use the compound interest calculator to find your own timeline.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "how-long-to-save-100k",
    title: "How long does it take to save $100k?",
    region: "us",
    guide: "compound-interest",
    description: "How long to save $100k in the US. Tables for different monthly contributions and rates, and how to use the compound interest calculator to find your own timeline.",
    authorSlug: "glenn-rodgers",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
];

export const methodologies: Methodology[] = [
  {
    slug: "fire-number",
    title: "FIRE Number methodology",
    toolSlug: "fire-number",
    lastReviewed: "2026-08-02",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget methodology",
    toolSlug: "multi-currency-budget",
    lastReviewed: "2026-08-02",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker methodology",
    toolSlug: "net-worth-tracker",
    lastReviewed: "2026-08-09",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment methodology",
    toolSlug: "mortgage-overpayment",
    lastReviewed: "2026-08-04",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff methodology",
    toolSlug: "debt-payoff",
    lastReviewed: "2026-08-09",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest methodology",
    toolSlug: "compound-interest",
    lastReviewed: "2026-08-10",
    reviewedBy: "glenn-rodgers",
    published: true,
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "net-worth",
    title: "Net worth",
    definition: "Net worth is the total value of everything you own minus everything you owe.",
    body: `Net worth is the simplest scorecard for personal wealth. Add up your assets, subtract your liabilities, and the remainder is your net worth.

Assets include cash, investments, property, pensions, and anything else you could sell for a meaningful amount. Liabilities include mortgages, credit cards, student loans, car finance, and any other debt.

The number changes every day as markets move, debts shrink, and savings grow. Tracking it monthly is usually enough. The goal is not a specific figure; it is a clear, honest picture of where you stand.`,
    relatedTerms: ["fire-number", "compound-interest", "freedom-fund"],
    relatedTools: ["net-worth-tracker"],
  },
  {
    slug: "freedom-fund",
    title: "Freedom Fund",
    definition: "Your Freedom Fund is the part of your net worth held in investments that can eventually pay you an income.",
    body: `The Freedom Fund comes from the Freedom Framework, a way of splitting net worth popularised by the Rebel Finance School net worth spreadsheet. It covers income-producing investments such as ISAs, SIPPs, pensions, and brokerage accounts. It excludes cash, your home, and anything you owe.

The point of the framework is to separate wealth that works for you from wealth that sits still or costs money to keep. A large home and a small Freedom Fund is a very different position from a modest home and a large one.

In the Net Worth Tracker, accounts in this group use the Investments category label. The summary panel shows your Freedom Fund total alongside the yearly income it could support at a 4% withdrawal rate.`,
    relatedTerms: ["net-worth", "withdrawal-rate", "fire-number"],
    relatedTools: ["net-worth-tracker", "fire-number"],
  },
  {
    slug: "fire-number",
    title: "FIRE number",
    definition: "Your FIRE number is the portfolio size you need to cover annual spending at a safe withdrawal rate.",
    body: `FIRE stands for Financial Independence, Retire Early. Your FIRE number is the amount of invested capital you would need to stop relying on a salary.

The most common shortcut is annual spending divided by a withdrawal rate. At 4%, a household spending £40,000 a year would need £1,000,000 invested. At 3.5%, the same spending needs roughly £1,140,000.

The right withdrawal rate depends on your age, mix of assets, flexibility, and how long the money must last. A higher number is safer for longer retirements.`,
    relatedTerms: ["net-worth", "withdrawal-rate"],
    relatedTools: ["fire-number"],
  },
  {
    slug: "compound-interest",
    title: "Compound interest",
    definition: "Compound interest is interest earned on both the original amount and the interest already added.",
    body: `Compound interest means your money earns money, and then that money earns money too. The effect is small at first and becomes dramatic over time.

Three inputs control the shape: the starting amount, the rate of return, and time. A higher rate helps, but time is usually the strongest lever. Starting ten years earlier can matter more than finding a slightly better fund.

Contributions also compound. Regular monthly deposits add a second layer of growth on top of the first.

You can model this with the Your Net Worth Compound Interest Calculator, and a quick mental shortcut is the rule of 72: divide 72 by the annual rate to estimate how many years it takes to double your money.`,
    relatedTerms: ["fire-number", "withdrawal-rate", "rule-of-72"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "rule-of-72",
    title: "Rule of 72",
    definition: "The rule of 72 is a quick way to estimate how long it takes money to double at a given annual return.",
    body: `The rule of 72 says: divide 72 by the annual return as a percentage to get the approximate doubling time in years. At 7.2% per year, money doubles in about ten years. At 10%, it doubles in about 7.2 years.

It is not exact, but it is close enough for mental maths. The rule works best for returns between about 5% and 15%. At very low or very high rates it drifts away from the true compound calculation.

It also applies in reverse. Divide 72 by the inflation rate to estimate how long it takes purchasing power to halve. At 6% inflation, a lump sum buys half as much in roughly twelve years.

The rule of 72 is a useful check when you see a compound interest projection. If a headline promises to double your money in a short time, the implied return should be easy to test with this rule.`,
    relatedTerms: ["compound-interest"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "isa",
    title: "ISA",
    definition: "An ISA is a UK account that protects savings and investments from income tax and capital gains tax.",
    body: `ISA stands for Individual Savings Account. In the UK, money inside an ISA grows free of income tax on interest and dividends, and free of capital gains tax on profits.

There are several types. A Cash ISA works like a savings account. A Stocks and Shares ISA holds investments. A Lifetime ISA receives a government bonus but is restricted to first-home buyers or retirement. A Junior ISA is for children.

Each tax year has an annual contribution limit. Unused allowance does not roll over, so timing matters.`,
    relatedTerms: ["sipp", "net-worth"],
    relatedTools: ["net-worth-tracker"],
  },
  {
    slug: "sipp",
    title: "SIPP",
    definition: "A SIPP is a UK pension that gives you full control over the investments inside it.",
    body: `SIPP stands for Self-Invested Personal Pension. It is a UK tax wrapper for retirement savings that lets you choose the underlying investments.

Contributions usually receive tax relief at your marginal rate. Investments grow free of capital gains and income tax while inside the wrapper. Money cannot normally be withdrawn before age 55 for many people, and the normal minimum age rises to 57 from 2028 for those born on or after 6 April 1973.

SIPPs suit people who want to pick their own funds, shares, or property and who understand the tax rules and restrictions.`,
    relatedTerms: ["isa", "net-worth"],
    relatedTools: ["net-worth-tracker"],
  },
  {
    slug: "withdrawal-rate",
    title: "Withdrawal rate",
    definition: "A withdrawal rate is the percentage of a portfolio you take out each year to live on.",
    body: `The withdrawal rate is the heartbeat of retirement planning. Take out too much and the portfolio may not last. Take out too little and you leave life unlived.

The famous 4% rule came from a 1994 study using US historical returns. It suggested that withdrawing 4% of the starting portfolio in year one, then adjusting for inflation, would survive a 30-year retirement most of the time.

A 3% to 3.5% rate is often used for longer retirements or portfolios with lower equity exposure. The right rate depends on your situation, not a universal rule.`,
    relatedTerms: ["fire-number", "compound-interest"],
    relatedTools: ["fire-number"],
  },
  {
    slug: "four-percent-rule",
    title: "4% rule",
    definition: "The 4% rule is a guideline that says you can withdraw 4% of a retirement portfolio in year one, then adjust for inflation.",
    body: `The 4% rule is a rough benchmark, not a guarantee. It was built on US market history and assumes a 30-year retirement with a mixed portfolio of stocks and bonds.

Under the rule, you withdraw 4% of the portfolio value in the first year. In later years, you increase the withdrawal by inflation. The portfolio therefore needs to outpace both withdrawals and rising prices.

Critics point out that future returns may be lower than the historical average, and that early retirees face longer time horizons. Many planners now use 3% to 3.5% as a safer starting point.`,
    relatedTerms: ["withdrawal-rate", "fire-number"],
    relatedTools: ["fire-number"],
  },
  {
    slug: "snowball-method",
    title: "Snowball method",
    definition: "The snowball method pays off the smallest debt first, then rolls that payment into the next smallest.",
    body: `The snowball method clears debts from smallest balance to largest, regardless of interest rate. When one debt is gone, its monthly payment is redirected to the next smallest.

Mathematically, it is rarely the cheapest route. Psychologically, it can be powerful. The early wins build momentum and make the process feel achievable.

It works best for people who need visible progress to stay motivated. For pure cost minimisation, the avalanche method usually wins.`,
    relatedTerms: ["avalanche-method", "minimum-payment"],
    relatedTools: ["debt-payoff"],
  },
  {
    slug: "avalanche-method",
    title: "Avalanche method",
    definition: "The avalanche method pays off the highest-interest debt first, then moves to the next highest.",
    body: `The avalanche method targets the debt with the highest interest rate first. Once it is cleared, the freed-up payment moves to the next highest-rate debt.

This approach minimises the total interest paid and usually clears debt fastest in pure mathematical terms. The downside is that the first win can take a long time if the highest-rate debt is also large.

It suits people who can stay motivated without frequent small victories. Our calculator lets you compare both methods side by side.`,
    relatedTerms: ["snowball-method", "minimum-payment"],
    relatedTools: ["debt-payoff"],
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-currency budget",
    definition: "A multi-currency budget tracks income and spending in more than one currency and converts them to a single base currency.",
    body: `A multi-currency budget is useful for freelancers, expats, travellers, and anyone with income or expenses across borders. Instead of guessing, you convert each line to a base currency at a live rate.

The hard part is exchange-rate movement. A rent payment in euros can look cheaper one month and more expensive the next, even if the local amount stays the same. Converting everything to a base currency removes that illusion.

The tool also helps you see whether your total income covers your total spending, regardless of where each transaction happens.`,
    relatedTerms: ["net-worth", "compound-interest"],
    relatedTools: ["multi-currency-budget"],
  },
  {
    slug: "apr",
    title: "APR",
    definition: "APR is the annual percentage rate: the yearly cost of borrowing, including interest and most fees, expressed as a percentage of the balance.",
    body: `APR stands for annual percentage rate. It rolls the interest rate and most compulsory fees into a single yearly figure, which makes it the cleanest way to compare two credit products.

On a credit card, the APR is applied monthly: each month the issuer charges roughly one twelfth of the APR on your outstanding balance. A card at 24.9% APR charges about 2.075% of the balance every month. On a £5,000 balance that is over £100 of interest a month before your payment touches the principal.

APR is the single most important number when you rank debts for payoff. The avalanche method orders debts by APR, highest first, because that order minimises the total interest you pay.`,
    relatedTerms: ["minimum-payment", "avalanche-method", "snowball-method"],
    relatedTools: ["debt-payoff"],
  },
  {
    slug: "minimum-payment",
    title: "Minimum payment",
    definition: "The minimum payment is the smallest amount a lender requires you to pay each month to keep the account in good standing.",
    body: `On a credit card, the minimum payment is usually a small percentage of the balance (often 1% to 3%) or a fixed floor amount, whichever is higher. It is designed to keep the account current, not to clear the debt quickly.

The trap is that the minimum falls as the balance falls, so a card you could clear in three years at a fixed payment can take well over a decade on minimums alone, with interest mounting all the way. Fixing your payment at today's level, rather than letting it decline, is one of the simplest ways to shorten a payoff timeline.

In a snowball or avalanche plan, every debt gets its minimum payment first, and whatever is left of your monthly budget attacks the priority debt. When a debt clears, its freed minimum rolls onto the next one.`,
    relatedTerms: ["apr", "snowball-method", "avalanche-method"],
    relatedTools: ["debt-payoff"],
  },
  {
    slug: "emergency-fund",
    title: "Emergency fund",
    definition: "An emergency fund is cash set aside to cover essential expenses if your income stops or an unexpected cost hits.",
    body: `Most guides suggest three to six months of essential spending held somewhere safe and accessible. That usually means an easy-access savings account in the UK or a high-yield savings account in the US, not investments that could fall when you need the money.

The fund is for true emergencies: job loss, urgent home repairs, medical bills, or a car failure that lets you keep earning. It is not for planned spending like holidays or Christmas.

Build it before you aggressively invest or overpay low-rate debt. Once it is in place, you can redirect the same monthly amount to longer-term goals.`,
    relatedTerms: ["easy-access-savings", "high-yield-savings-account", "savings-rate"],
    relatedTools: ["net-worth-tracker"],
  },
  {
    slug: "expense-ratio",
    title: "Expense ratio",
    definition: "An expense ratio is the annual fee a fund charges its investors, expressed as a percentage of assets under management.",
    body: `If a fund has a 0.5% expense ratio, it deducts roughly £5 a year for every £1,000 invested. That charge is taken from the fund's returns before they reach you, so a 7% gross return becomes a 6.5% net return.

Expense ratios vary widely. Broad global index trackers often charge below 0.25%. Actively managed funds can charge 0.75% to 1.5% or more. The difference sounds small, but over decades the same gap compounds into a significant drag on final wealth.

In the UK the published number is often the Ongoing Charges Figure (OCF), which includes most fund costs. In the US it is usually the expense ratio. Either way, it is one of the few predictors of future returns you can control.`,
    relatedTerms: ["fee-drag", "compound-interest"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "fee-drag",
    title: "Fee drag",
    definition: "Fee drag is the long-term wealth you lose to fees and charges, beyond the simple annual percentage.",
    body: `A 1% annual fee does not reduce your final balance by 1%. Because the fee is taken from returns that would otherwise have compounded, the drag grows over time. Over twenty or thirty years a 1% fee can easily eat a quarter or more of the portfolio.

Fee drag includes fund expense ratios, platform or brokerage fees, adviser charges, and any other cost that reduces your net return. Some fees are explicit, some are quietly deducted from fund performance.

The simplest way to estimate fee drag is to run the same projection with and without the fee. The gap between the two outcomes is the true cost.`,
    relatedTerms: ["expense-ratio", "compound-interest"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "inflation",
    title: "Inflation",
    definition: "Inflation is the rate at which prices rise and the purchasing power of money falls over time.",
    body: `If inflation runs at 3% for a year, a basket of goods that cost £100 at the start costs roughly £103 at the end. Your cash still says £100, but it buys less.

Inflation matters for every financial plan. A savings account paying 4% interest with 3% inflation delivers a real return of about 1%. A wage rise below inflation is effectively a pay cut.

Central banks target low and stable inflation, commonly 2% in the UK and the US. They measure it with indexes such as the Consumer Prices Index (CPI) or the Consumer Price Index for All Urban Consumers (CPI-U).`,
    relatedTerms: ["real-return", "nominal-return", "purchasing-power"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "purchasing-power",
    title: "Purchasing power",
    definition: "Purchasing power is what a unit of currency can actually buy, after accounting for inflation.",
    body: `A pound or dollar is only useful for what it purchases. If prices double, the same nominal amount buys half as much. That is a loss of purchasing power.

When people talk about money in real terms, they mean purchasing power. £100 today is not the same as £100 in twenty years unless prices stay flat, which rarely happens.

Investors care about purchasing power because the goal is not a large number on a screen but the lifestyle that number can support.`,
    relatedTerms: ["inflation", "real-return", "nominal-return"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "nominal-return",
    title: "Nominal return",
    definition: "Nominal return is the percentage gain on an investment before adjusting for inflation.",
    body: `If your portfolio grows from £10,000 to £11,000 in a year, your nominal return is 10%. That is the number most statements and fund factsheets show first.

Nominal returns are useful for comparing products and tracking account balances. They are not useful for measuring whether you are actually richer, because they ignore what the money can buy.

To see the real return, subtract inflation from the nominal return. A 10% nominal return with 7% inflation gives roughly a 3% real return.`,
    relatedTerms: ["real-return", "inflation", "purchasing-power"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "real-return",
    title: "Real return",
    definition: "Real return is the investment gain after accounting for inflation, showing the change in actual purchasing power.",
    body: `A 5% nominal return with 3% inflation is roughly a 2% real return. Your money grew, but only by 2% in terms of what it can buy.

Real return is what matters for long-term goals. A pension projection in nominal pounds can look impressive while quietly promising a poorer lifestyle than you expect.

The shortcut calculation is: real return = (1 + nominal return) / (1 + inflation) - 1. For small numbers, subtracting inflation is close enough. For larger numbers or longer periods, use the full formula.`,
    relatedTerms: ["nominal-return", "inflation", "purchasing-power"],
    relatedTools: ["compound-interest", "fire-number"],
  },
  {
    slug: "savings-rate",
    title: "Savings rate",
    definition: "Your savings rate is the percentage of your after-tax income that you save or invest rather than spend.",
    body: `If you take home £3,000 a month and save £600, your savings rate is 20%. The higher the rate, the faster you can build an emergency fund, hit a savings goal, or reach financial independence.

Savings rate is one of the most powerful levers in personal finance. A higher rate both increases how much you invest and reduces how much you need to live on, which lowers the target portfolio for independence.

It is usually measured against net income, so taxes and pension contributions taken at source are already accounted for. Include employer pension contributions if you want a fuller picture.`,
    relatedTerms: ["emergency-fund", "fire-number"],
    relatedTools: ["net-worth-tracker", "fire-number"],
  },
  {
    slug: "time-to-goal",
    title: "Time to goal",
    definition: "Time to goal is the number of months or years needed to reach a savings or investment target.",
    body: `Given a starting amount, a monthly contribution, and an expected return, you can calculate when the pot will hit a target. The answer depends more on the contribution amount than on the return rate for short goals, and more on the return rate for long goals.

Time-to-goal maths is the mirror of compound interest. Instead of asking "what will this grow to?", you ask "how long until it grows to that?"

Inflation changes the picture. A goal stated in today's money needs more nominal pounds by the deadline, so the real time to goal is usually longer than the nominal one.`,
    relatedTerms: ["compound-interest", "savings-rate", "inflation"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "pound-cost-averaging",
    title: "Pound-cost averaging",
    definition: "Pound-cost averaging is investing a fixed amount regularly, buying more units when prices are low and fewer when they are high.",
    body: `In the US the same idea is usually called dollar-cost averaging. The principle is identical: you remove the temptation to time the market by automating a steady contribution.

Pound-cost averaging reduces the risk of investing a large lump sum just before a market fall. It also enforces discipline during volatility, because the same monthly amount automatically buys more when prices drop.

It is not a guarantee of better returns than a lump sum. Historically, markets rise more often than they fall, so investing immediately has usually won. But for many people the behavioural benefit of a regular plan outweighs the statistical edge.`,
    relatedTerms: ["compound-interest", "time-to-goal"],
    relatedTools: ["compound-interest"],
  },
  {
    slug: "sequence-of-returns-risk",
    title: "Sequence-of-returns risk",
    definition: "Sequence-of-returns risk is the danger that poor investment returns occur just before or after you start withdrawing from a portfolio.",
    body: `Two retirees can have the same average return over thirty years but very different outcomes if one gets the good years early and the other gets the bad years early. The one with bad years early may run out of money even though the long-term average looks fine.

This risk is highest in the years around retirement, when the portfolio is largest and withdrawals are beginning. A few negative years at that point can permanently reduce the pot.

Common defences include holding cash reserves, using a lower withdrawal rate, and being willing to cut spending after a bad year. It is one reason the 4% rule is a starting point, not a guarantee.`,
    relatedTerms: ["fire-number", "withdrawal-rate", "four-percent-rule"],
    relatedTools: ["fire-number"],
  },
  {
    slug: "fire-variants",
    title: "Coast, Lean and Fat FIRE",
    definition: "Coast, Lean and Fat FIRE are variations of the FIRE movement that trade lifestyle spending against how much capital you need.",
    body: `Lean FIRE means retiring on a frugal budget, which needs a smaller pot but a simpler lifestyle. Fat FIRE means retiring with a generous budget, which needs a much larger pot.

Coast FIRE is different. You save enough early in life that your portfolio can grow to your target by a normal retirement age without further contributions. After that point you only need to cover current living costs, not save more.

Barista FIRE sits somewhere in the middle: you leave a high-pressure career but keep a part-time or lower-paid job for income and perhaps benefits. The right variant depends on your spending, your health, and how much flexibility you want.`,
    relatedTerms: ["fire-number", "withdrawal-rate", "four-percent-rule"],
    relatedTools: ["fire-number"],
  },
  {
    slug: "easy-access-savings",
    title: "Easy-access savings account",
    definition: "An easy-access savings account is a UK account that lets you withdraw money quickly without penalty.",
    body: `Easy-access accounts are the normal home for emergency funds because the cash is available within hours or days. They pay interest, but the rate is usually lower than fixed-term accounts or investments.

The interest may be tax-free if it falls within the Personal Savings Allowance or is held inside a Cash ISA. For most people, the key feature is liquidity, not return.

The US equivalent is usually called a high-yield savings account (HYSA). Both serve the same purpose: keeping safe cash accessible.`,
    relatedTerms: ["emergency-fund", "high-yield-savings-account", "isa"],
    relatedTools: ["net-worth-tracker"],
  },
  {
    slug: "high-yield-savings-account",
    title: "High-yield savings account",
    definition: "A high-yield savings account is a US savings account that pays a higher interest rate than a standard checking or savings account.",
    body: `HYSAs are the normal place for US emergency funds. They are FDIC-insured up to the relevant limits and allow quick transfers to a checking account. Online banks often offer better rates than traditional branches because they have lower overheads.

Rates move with the federal funds rate and the competitive landscape, so the best account today may not be the best account in a year. There is usually no commitment period, unlike a certificate of deposit.

The UK equivalent is an easy-access savings account. Both are designed for cash you might need soon, not for long-term growth.`,
    relatedTerms: ["emergency-fund", "easy-access-savings"],
    relatedTools: ["net-worth-tracker"],
  },
];

export const updates: Update[] = [
  {
    date: "2026-08-02",
    title: "Week 0: site infrastructure live",
    body: "Launched the homepage, about page, editorial policy, glossary shell, and author page scaffolding. Calculators will follow in weekly clusters starting with FIRE Number.",
  },
  {
    date: "2026-08-02",
    title: "Week 1: FIRE Number cluster live",
    body: "Added the FIRE Number calculator for UK and US users, plus pillar guides, supporting articles, and a methodology page.",
  },
  {
    date: "2026-08-02",
    title: "Week 2: Multi-Currency Budget cluster live",
    body: "Added the Multi-Currency Budget calculator for UK and US users, plus pillar guides, a supporting article on exchange-rate risk, and a methodology page.",
  },
  {
    date: "2026-08-03",
    title: "Week 3: Net Worth Tracker cluster live",
    body: "Added the Net Worth Tracker calculator for UK and US users, with Standard and Freedom Framework modes, sinking-fund accounts, per-account sparklines, JSON export and import, plus region-specific guides, supporting articles, and a methodology page.",
  },
  {
    date: "2026-08-04",
    title: "Week 4: Mortgage Overpayment cluster live",
    body: "Added the Mortgage Overpayment calculator for UK and US users, with UK fixed-rate + SVR modelling, US escrow display, an invest-instead counterfactual, dual-line balance chart, plus region-specific guides, supporting articles, and a methodology page.",
  },
  {
    date: "2026-08-09",
    title: "Week 5: Debt Payoff cluster live",
    body: "Added the Debt Payoff calculator for UK and US users, with inline debt entry, a monthly-budget slider, overlaid snowball vs avalanche curves, side-by-side debt-free dates and total interest, plus region-specific pillar guides, supporting articles, and a methodology page.",
  },
  {
    date: "2026-08-10",
    title: "Week 6: Compound Interest cluster live",
    body: "Added the Compound Interest calculator for UK and US users, with a solve-for-any-variable mode, monthly/daily/annual compounding, a stacked contributions-vs-growth chart, plus region-specific pillar guides, a supporting article on how long to save £100k/$100k, a methodology page, and a rule of 72 glossary term.",
  },
  {
    date: "2026-08-11",
    title: "Week 7: polish, speed, research, and embeddability",
    body: "Reviewed and expanded PostHog event tracking, added reviewedBy bylines to all published tools, guides, articles and methodologies, grew the glossary with wave-2 terms, fixed bidirectional relatedTool links, hardened charts against invalid data, and shipped an embeddable compound-interest calculator prototype with iframe auto-resize and attribution.",
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getPublishedTools(): Tool[] {
  return tools.filter((t) => t.published);
}

export function getAllTools(): Tool[] {
  return tools;
}

export function getTool(region: Region, slug: string): Tool | undefined {
  return tools.find((t) => t.region === region && t.slug === slug && t.published);
}

export function getGuide(region: Region, slug: string): Guide | undefined {
  return guides.find((g) => g.region === region && g.slug === slug && g.published);
}

export function getArticle(region: Region, slug: string): Article | undefined {
  return articles.find((a) => a.region === region && a.slug === slug && a.published);
}

export function getMethodology(slug: string): Methodology | undefined {
  return methodologies.find((m) => m.slug === slug && m.published);
}

export function getArticlesByGuide(region: Region, guideSlug: string): Article[] {
  return articles.filter((a) => a.region === region && a.guide === guideSlug && a.published);
}

export function getPublishedToolsByRegion(region: Region): Tool[] {
  return tools.filter((t) => t.region === region && t.published);
}
