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
    bio: "Glenn Rodgers is an investor who writes about turning income into lasting financial security. He built Your Net Worth because he believes checking your numbers should not cost your privacy. The tools here run in your browser, with no account required, and the guides stick to what the maths and the primary sources actually say.",
    publications: [],
  },
];

export const tools: Tool[] = [
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    region: "uk",
    description: "Free net worth tracker with no sign-up — your data stays in your browser. Add accounts and see your net worth in under a minute, with a Freedom Framework mode and a 4% withdrawal estimate.",
    pillarGuide: "net-worth-tracker",
    supportingArticles: ["sinking-funds"],
    relatedTools: ["fire-number", "compound-interest"],
    methodology: "net-worth-tracker",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker",
    region: "us",
    description: "Free net worth tracker with no sign-up — your data stays in your browser. Add accounts and see your net worth in under a minute, with a Freedom Framework mode and a 4% withdrawal estimate.",
    pillarGuide: "net-worth-tracker",
    supportingArticles: ["emergency-fund-vs-hysa"],
    relatedTools: ["fire-number", "compound-interest"],
    methodology: "net-worth-tracker",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    region: "uk",
    description: "See how principal, contributions, rate, and time interact.",
    published: false,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    region: "us",
    description: "See how principal, contributions, rate, and time interact.",
    published: false,
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    region: "uk",
    description: "Estimate the portfolio size needed to cover annual spending.",
    pillarGuide: "fire-number",
    supportingArticles: ["4-percent-rule"],
    methodology: "fire-number",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "fire-number",
    title: "FIRE Number",
    region: "us",
    description: "Estimate the portfolio size needed to cover annual spending.",
    pillarGuide: "fire-number",
    supportingArticles: ["4-percent-rule"],
    methodology: "fire-number",
    authorSlug: "glenn-rodgers",
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
    published: true,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    region: "uk",
    description: "Stack your debts and compare snowball versus avalanche strategies.",
    published: false,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    region: "us",
    description: "Stack your debts and compare snowball versus avalanche strategies.",
    published: false,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    region: "uk",
    description: "Add income and spending in different currencies and convert to one base.",
    pillarGuide: "multi-currency-budget",
    supportingArticles: ["exchange-rate-risk"],
    methodology: "multi-currency-budget",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget",
    region: "us",
    description: "Add income and spending in different currencies and convert to one base.",
    pillarGuide: "multi-currency-budget",
    supportingArticles: ["exchange-rate-risk"],
    methodology: "multi-currency-budget",
    authorSlug: "glenn-rodgers",
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
    published: true,
  },
  {
    slug: "4-percent-rule",
    title: "Where does the 4% rule come from?",
    region: "us",
    guide: "fire-number",
    description: "Where does the 4% rule come from? A look at Bengen's 1994 study, the Trinity Study, and what US retirees should know about safe withdrawals.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "exchange-rate-risk",
    title: "How do exchange-rate swings affect your UK budget?",
    region: "uk",
    guide: "multi-currency-budget",
    description: "How exchange-rate swings affect a UK budget. Why converting foreign income and spending to pounds matters and how to manage currency risk.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "exchange-rate-risk",
    title: "How do exchange-rate swings affect your US budget?",
    region: "us",
    guide: "multi-currency-budget",
    description: "How exchange-rate swings affect a US budget. Why converting foreign income and spending to dollars matters and how to manage currency risk.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "sinking-funds",
    title: "How do sinking funds work in the UK?",
    region: "uk",
    guide: "net-worth-tracker",
    description: "How sinking funds work in the UK. Set aside small monthly amounts for predictable expenses like Christmas, car maintenance, and holidays.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "emergency-fund-vs-hysa",
    title: "Emergency fund vs high-yield savings: where should US savers keep cash?",
    region: "us",
    guide: "net-worth-tracker",
    description: "Emergency fund versus high-yield savings: where US savers should keep cash. Learn the difference and how much to keep accessible.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "overpay-vs-isa",
    title: "Should you overpay your mortgage or invest in a Stocks and Shares ISA?",
    region: "uk",
    guide: "mortgage-overpayment",
    description: "Should you overpay your mortgage or invest in a UK Stocks and Shares ISA? Compare guaranteed interest savings against tax-free investment growth.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "pay-off-vs-401k",
    title: "Should you pay off your mortgage early or invest in a 401(k)?",
    region: "us",
    guide: "mortgage-overpayment",
    description: "Should you pay off your mortgage early or invest in a 401(k)? Compare guaranteed principal savings against tax-deferred retirement growth.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "10-percent-overpayment-rule",
    title: "The 10% mortgage overpayment rule explained",
    region: "uk",
    guide: "mortgage-overpayment",
    description: "The 10% mortgage overpayment rule explained for UK borrowers. How annual overpayment limits work, when ERCs apply, and how to check your allowance.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
  {
    slug: "biweekly-mortgage-payments",
    title: "Should you make biweekly mortgage payments?",
    region: "us",
    guide: "mortgage-overpayment",
    description: "Should you make biweekly mortgage payments? Learn how 26 half-payments save interest, when servicers hold funds, and how to avoid setup fees.",
    authorSlug: "glenn-rodgers",
    published: true,
  },
];

export const methodologies: Methodology[] = [
  {
    slug: "fire-number",
    title: "FIRE Number methodology",
    toolSlug: "fire-number",
    lastReviewed: "2026-08-02",
    published: true,
  },
  {
    slug: "multi-currency-budget",
    title: "Multi-Currency Budget methodology",
    toolSlug: "multi-currency-budget",
    lastReviewed: "2026-08-02",
    published: true,
  },
  {
    slug: "net-worth-tracker",
    title: "Net Worth Tracker methodology",
    toolSlug: "net-worth-tracker",
    lastReviewed: "2026-08-09",
    published: true,
  },
  {
    slug: "mortgage-overpayment",
    title: "Mortgage Overpayment methodology",
    toolSlug: "mortgage-overpayment",
    lastReviewed: "2026-08-04",
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

Contributions also compound. Regular monthly deposits add a second layer of growth on top of the first.`,
    relatedTerms: ["fire-number", "withdrawal-rate"],
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
    relatedTerms: ["avalanche-method", "debt-payoff"],
    relatedTools: ["debt-payoff"],
  },
  {
    slug: "avalanche-method",
    title: "Avalanche method",
    definition: "The avalanche method pays off the highest-interest debt first, then moves to the next highest.",
    body: `The avalanche method targets the debt with the highest interest rate first. Once it is cleared, the freed-up payment moves to the next highest-rate debt.

This approach minimises the total interest paid and usually clears debt fastest in pure mathematical terms. The downside is that the first win can take a long time if the highest-rate debt is also large.

It suits people who can stay motivated without frequent small victories. Our calculator lets you compare both methods side by side.`,
    relatedTerms: ["snowball-method", "debt-payoff"],
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
