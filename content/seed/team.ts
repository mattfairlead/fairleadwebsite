import type { HubTeamRow } from "@/lib/types";

/**
 * Seed roster — a snapshot of the engagement hub's `team_members` table
 * (github.com/mattfairlead/fairlead), served only when the Supabase env vars
 * are absent. In production the roster, titles, bios, headshots and the
 * on-site/off-site checkbox all come live from the hub; this file exists so
 * local previews and CI builds render the same page shape.
 *
 * Headshots are not vendored (has_photo: false → monogram). Regenerate from
 * the hub when the roster drifts — see README → "Team content".
 */
const SNAPSHOT_AT = "2026-09-02T00:00:00+00:00";

export const team: HubTeamRow[] = [
  {
    id: 1,
    name: "Adam Carte",
    suffix: "CFA, Partner",
    roles: "CEO, CFO, CRO, Board Member, Operating Partner",
    sort_order: 1,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As a founding member and Partner of Fairlead Advisors LLC and an Operating Partner to Denham Capital Management, Mr. Carte provides strategic, commercial, executive management and financial expertise to our clients, a role substantially the same as the one he held previously at Alea Management, which he also co-founded.\n\nSince the formation of Fairlead in 2010, Mr. Carte has led negotiations for acquisitions, divestitures, equity and debt financings, strategic partnerships, licensing agreements and company restructurings for over 24 different companies across a broad range of industries. Adam’s consistent track record of exceeding investor expectations in challenging situations creates repeat business and word-of-mouth referrals among his clients.\n\nPreviously, Mr. Carte was the CFO of The Trigen Companies. During his tenure with Trigen, he jointly led the company’s turnaround and subsequent sell-side process that resulted in the sale of the company for $800 million to Veolia Environment (NYSE:VE), a large French conglomerate, in a process that more than doubled the equity value of the company in less than three years.\n\nPrior to joining Trigen, Mr. Carte spent two years working for Texas-New Mexico Power/First Choice Power (“TNMP”), an electric utility based in Fort Worth, Texas, serving approximately 275,000 customers. He served as VP & Treasurer until the company was sold to PNM Resources, a neighboring utility. During his time at TNMP, Mr. Carte led negotiations for an innovative energy supply agreement after the deregulation of the Texas electricity market.\n\nFrom 1993 to 2003, Mr. Carte worked at NRG Energy, Inc., the third-largest independent power producer in the world. where he served in various financial positions, ultimately as VP & Treasurer and acting-CFO. During his time at NRG he raised over $10 billion in debt and equity capital from financial institutions and the capital markets, including the largest initial public offering in Minnesota history. With the market downturn in 2002, Mr. Carte successfully worked with lenders, their advisors and other creditors to stabilize the company in a managed reorganization process.\n\nMr. Carte received a B.A. in Mathematics from Earlham College and an MBA with a concentration in Finance from the Carlson School of Management at the University of Minnesota. He holds a Chartered Financial Analyst (CFA) designation and was a Certified Treasury Professional (CTP). In August 2004 he was selected by the Association for Financial Professionals as one of the top 300 Professionals in Treasury and Finance. He is an avid runner and has finished 11 marathons, including the 2015 Boston Marathon.",
  },
  {
    id: 2,
    name: "Renee Sass",
    suffix: "Partner",
    roles: "CEO, CFO, CRO, Business Development, Strategic Planning, Operating Partner",
    sort_order: 2,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As a Partner of Fairlead Advisors, Ms. Sass provides strategic, valuation, financial analysis, and funding expertise to our clients. Ms. Sass has extensive experience in principal or advisory roles with private sector cleantech startups, global energy companies, private equity investors and government agencies.\n\nSince joining Fairlead Advisors, Ms. Sass has provided consulting and interim management services for numerous companies. In 2015, Ms. Sass became interim-CFO of an oil field services company with operations primarily in Louisiana and Texas. In 2014, Ms. Sass was interim-CEO of a motor engineering company, focusing on strategic planning, and fundraising. Also, in 2014, Ms. Sass assisted the management team and institutional owners of a Midwestern frac-sand producer with its financial planning and management. In 2013 and 2014, Ms. Sass has supported the M&A and financing activities for a California-based renewable energy company, helping the company with a major expansion of its platform through a $100 million acquisition. In other engagements since 2012, Ms. Sass has assisted several companies in fundraising and company divestiture processes.\n\nSince 2009, Ms. Sass has worked with several federal lending programs in origination, credit analysis and portfolio management roles. She has been part of a credit team supporting the Risk Management Department of the Department of Energy Loan Program Office. She has worked on numerous cleantech corporate and power project finance transactions, including renewable (solar, wind, geothermal), nuclear and fossil-fueled generation projects.\n\nMs. Sass served from 2008 to 2010 as the Vice President of Finance and Chief Financial Officer for a client company, Visiam, a clean energy technology company providing an integrated solution to convert municipal solid waste and other biomass into energy. She was responsible for all finance, accounting, human resources and risk management functions, and led all forecasting and financial planning activities, and investor funding activities.\n\nShe spent four years, from 2004 until 2008, as the Chief Financial Officer of Excelsior Energy, Inc., a start-up developing a $2.3 billion clean coal-fueled integrated gasification combined cycle power plant. In this role, she secured financing for project development, permitting and engineering while overseeing all finance, accounting, human resources, and administrative functions for the start-up company.\n\nFrom 1991 to 2002, Ms. Sass worked at NRG Energy, Inc., the third largest independent power producer in the world at the time. Ms. Sass served in a variety of senior finance and development positions before joining the senior management team as Vice President-Strategic Planning and Portfolio Assessment. She also led a number of acquisitions, greenfield development and financial transactions during her tenure, including a number of unique and ‘first of a kind’ transactions in the U.S. and abroad. International work included completed transactions in the UK, Germany, the Czech Republic and Australia; other international development work was done in Estonia, Poland, Hungary, Indonesia and the Philippines. She worked on several strategic planning and advisory activities with NRG’s largest shareholder, Xcel Energy, and in her last role at NRG, oversaw a $6 billion divestiture program.\n\nMs. Sass started her energy career in 1988 as member of the Utilities Consulting Practice of Ernst & Young, providing services to regulated and unregulated energy companies in North America.\n\nMs. Sass teaches as an adjunct instructor of MBA and undergraduate finance courses at a variety of colleges and universities. Ms. Sass holds an MBA with a concentration in finance from the University of Maryland, and a B.A. with a double major in Communication Arts and Business Marketing from the College of Notre Dame of Maryland, where she graduated summa cum laude.",
  },
  {
    id: 3,
    name: "Charlie Abbott",
    suffix: "P.E., Partner",
    roles: "CEO, COO, Capital Planning, EHS, Project Management, Operating Partner",
    sort_order: 3,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As a founding member and Partner of Fairlead Advisors LLC, Mr. Abbott provides strategic, commercial management, valuation and technical expertise to our clients, a role similar to the position he held at Alea Management, where he was chief operating officer. Over the last three years Mr. Abbott has been involved in the direct management of the improvement of many operating energy assets.\n\nAs the CEO of Greenleaf Power, Mr. Abbott has 10 years of experience acquiring, financing, modifying, and operating woody biomass to electricity facilities across North America.\n\nMr. Abbott was the chief operating officer of The Trigen Companies from 2005 to 2008. In this capacity he was responsible for the execution of the company’s business plan, including day-to-day management and internal growth of the business. During his tenure as chief operating officer, The Trigen Companies made three strategic acquisitions, thereby creating the dominant district energy platform in North America. This enabled the sale of The Trigen Companies to Veolia Environment (NYSE: VE) in a process that more than doubled the equity value of the company.\n\nMr. Abbott served in various capacities for the Trigen Companies after joining the company in 1993. These roles included Vice President District Energy Assets, President Trigen Baltimore, Vice President Trigen Colorado and Manager of Operations Trigen Philadelphia. During this tenure he managed a wide variety of industrial and district energy assets providing steam, chilled water and electricity.\n\nPrior to joining Trigen, Mr. Abbott served as a project manager for Raytheon Engineers and Constructors where he led the design for several large central electric generating stations and air pollution control projects.\n\nMr. Abbott also has extensive central generating station operations experience. He served as Plant Director for Orlando Utilities Commission’s Indian River Plant and as a field service engineer for Foster Wheeler.\n\nMr. Abbott received a BS in Engineering from the University of Vermont and an MBA from the University of Denver. He is a registered professional engineer in Texas.",
  },
  {
    id: 4,
    name: "Jason Salgo",
    suffix: "Partner",
    roles: "CFO, Planning, Valuation, Transactional Services",
    sort_order: 4,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As Partner, Mr. Salgo provides financial planning, valuation, transaction, and financing services to our clients. Mr. Salgo is a corporate finance professional with over 20 years of experience working with executive teams and shareholders, and as a business partner to CEOs. He excels at providing executive leadership, managing comprehensive organizational change, implementing strategic priorities, and executing complex transactions.\n\nHe most recently served 7 years as CFO for Veolia North America, a leading environmental services provider (waste, water & energy) with 8,500 employees and $2.4bn turnover in the US and Canada. At Veolia, Jason was a key driver of a fundamental organizational restructuring of management (executive and operations) and support functions, all aimed at improving the commercial approach to market and at driving cost efficiencies. He was a member of the executive team responsible for growing the business and improving the return on capital employed. Mr. Salgo left Veolia following the successful $1.25bn sale of the North American energy activities of the company.\n\nMr. Salgo has also worked under private equity ownership, part of a management team that led a business turnaround and ultimately a highly successful $800M exit for the sponsor.\n\nOver his career, Mr. Salgo has helped to execute over $8bn of M&A, asset disposal, capital markets and bank financing transactions. He is skilled at finding pathways and solutions to bring transactions to timely close.\n\nJason is experienced at executing key corporate imperatives, including reorganizations, developing policies and procedures to improve internal controls, overseeing corporate governance and delegations of authority, and rolling out compensation plans that align performance with key priorities.\n\nJason has an undergraduate degree from Tufts University and a Master’s Degree from the London School of Economics.",
  },
  {
    id: 18,
    name: "JoAnn Cochran",
    suffix: "CPA (inactive), Consultant",
    roles: "Accounting, Financial Reporting",
    sort_order: 5,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Ms. Cochran is a seasoned consultant with more than 30 years of experience in finance, focusing on corporate international tax, transfer pricing, mergers and acquisitions, financial analysis, compliance and reporting. Her background covers public accounting as well as various roles within the energy and semiconductor sectors during periods of rapid growth and substantial merger and acquisition activity.\n\nDuring her decade at NRG Energy, Inc., Ms. Cochran held several positions, advancing to Executive Director, Taxation. In this capacity, she implemented structured finance strategies, conducted foreign tax due diligence, provided guidance on debt and equity funding options, and developed Excel models for FAS 109 tax liability reporting. She collaborated with interdisciplinary teams across legal, accounting, treasury, and external advisors to support efficient executive decision-making.\n\nMs. Cochran also provided consulting services to Entegris, Inc. in various finance capacities over 16 years, contributing through multiple reorganizations, mergers and acquisitions. Her initiatives included designing new systems and process improvements to ensure compliance with U.S. and international reporting requirements.\n\nMs. Cochran holds a Master of Business Taxation from the University of Minnesota Carlson School of Management and a BBA in Accounting from the University of Iowa.",
  },
  {
    id: 7,
    name: "Mary Day",
    suffix: "CPA (expired), Senior Consultant",
    roles: "Controller, Audit Support, Reporting, ERP Assessment and Implementation",
    sort_order: 6,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As Senior Advisor, Ms. Day provides complete accounting services to our clients including working with client’s independent auditor to finalize the financial audit. Ms. Day also helps clients implement and manage best practices in corporate governance and financial controls. Ms. Day’s background spans a diverse set of financial disciplines, industries, and companies. She has demonstrated expertise in all areas of accounting, planning, reporting, systems and treasury operations.\n\nFrom 2008 to 2013, Ms. Day served as Controller – Portfolio Projects for Wayzata Investment Partners, a private equity firm managing multiple large equity funds. Ms. Day was responsible for the firm’s investments in electricity production, oil and gas, aviation and shipping investments including financial reporting, debt covenant compliance, annual audit completion, annual tax filings, investment analysis and contract compliance. Responsibilities ranged from financial statement preparation, purchase accounting to treasury operations, while investments ranged from $10 million to $500 million in equity. Position required practical understanding of investment accounting for private equity and hedge funds, including recognition of realized and unrealized gains due to market value changes of individual companies and securities. Position also included establishment of controls and reviews to ensure firm’s fiduciary duties were properly performed.\n\nFrom 2004 to 2013, Ms. Day served as Controller of Excelsior Energy, Inc., a power development start-up developing a clean coal-fueled integrated gasification combined cycle power plant. In this role, she established accounting controls for start-up businesses to meet debt issuance requirements, US GAAP accounting requirements, Federal Government Reporting, and IRS requirements.\n\nMs. Day worked as Director of International Accounting at NRG Energy Inc. from 1997 to 2004. In this role, Ms. Day oversaw the accounting for all international joint ventures and wholly owned projects owned by the company. Included were branch offices in four regions, 10 consolidated projects in 9 countries and 10 joint ventures in 6 countries. This position required knowledge of local accounting regulations as well as US accounting regulations.\n\nMs. Day worked in various auditing and accounting positions at manufacturing companies Honeywell Inc. and Donaldson Inc. These positions spanned corporate, divisional, manufacturing, cost, general and international accounting disciplines.\n\nMs. Day holds a Master’s in International Management and a B.A., with a double major in Accounting and French, from the University of St. Thomas.",
  },
  {
    id: 11,
    name: "Mark Edstrom",
    suffix: "CPA, CGMA, Senior Consultant",
    roles: "International Accounting and Tax, Regulatory Compliance, Financial Reporting",
    sort_order: 7,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Mark Edstrom is an accomplished finance and accounting executive with extensive expertise in complex financial reporting, accounting standards implementation, and international financial operations. Known for his ability to enhance financial processes and ensure compliance in challenging environments, Mark has successfully led accounting transformations and M&A integrations and divestitures across sectors including energy, manufacturing, and financial services. His roles have spanned high-impact areas such as regulatory compliance, SOX implementation, and functional start-up, often in organizations experiencing significant growth or transition.\n\nAs a Senior Consultant at Fairlead, Mark leverages his depth in financial analysis, consolidation, and team leadership to deliver precise and timely insights that drive informed decision-making. Mark is a Certified Public Accountant and Chartered Global Management Accountant and holds a Bachelor of Business Administration from the University of North Dakota.  In addition, he has obtained a Chartered Accountant designation in Canada.",
  },
  {
    id: 23,
    name: "Susan Elkind",
    suffix: "Strategic Partner, Structured Finance & Risk",
    roles: "Structured Finance, Credit Risk, Securitization, Real-Asset Financing",
    sort_order: 8,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As a Strategic Partner, Susan brings deep structured finance and credit risk expertise to Fairlead's transaction and advisory work, supporting clients on the evaluation, structuring, and securitization of complex real-asset financings. Susan has over 25 years of investment banking and credit risk management experience across real asset and structured finance transactions, including the evaluation and securitization of billions of dollars of sub-investment-grade asset-backed portfolios, high-yield project development debt, and early-stage developer financing for institutions including the former Chemical Bank, Merrill Lynch, and Financial Security Assurance. She began her career as a banker in the Public Finance group at Manufacturers Hanover Trust. Susan holds a BS/MBA from the New York University Stern School of Business.",
  },
  {
    id: 24,
    name: "Matt Faria",
    suffix: "Strategic Partner, Commercial Diligence & Growth",
    roles: "Commercial Diligence, Go-to-Market Strategy, Growth Planning, Sales & Marketing Systems",
    sort_order: 9,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Matt is a go-to-market operator who works with founder-led B2B businesses on the commercial systems that separate companies built around an individual from companies built to scale. He brings that operator's perspective to Fairlead's transaction work, supporting deal teams on the commercial questions that sit alongside financial diligence — particularly on acquisitions of founder-led businesses where customer relationships, technical reputation, and informal sales processes drive growth.\n\nFor Fairlead engagements, Matt is available to lead or contribute to commercial and growth diligence workstreams as deal characteristics warrant. On smaller transactions, that may mean a focused assessment of customer concentration, founder-dependency, and revenue repeatability. On larger or more complex deals, it can extend to mapping the full go-to-market engine, evaluating sales infrastructure, and developing post-close growth plans. The objective in either case is to give the deal team a clear view of how the target's revenue is generated and what will be required to sustain or accelerate it after close.\n\nMatt's background spans direct operating and advisory work with companies in industrial services, energy management, and B2B technical advisory. He has built marketing systems, sales infrastructure, and partner programs for companies in fragmented industries, and brings that operator's lens to evaluating targets before close and standing up growth plans after.",
  },
  {
    id: 16,
    name: "Jeremy Freyou",
    suffix: "Senior Consultant",
    roles: "Accounting, Financial Reporting",
    sort_order: 10,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Jeremy is a seasoned finance and accounting executive with over 15 years of experience leading corporate finance functions, including treasury management, SEC and audit support, and financial operations. At Fairlead Advisors, Jeremy provides interim and fractional support as Controller and Treasury Manager to portfolio companies undergoing transition, restructuring, or growth.\n\nPrior to joining Fairlead, Jeremy held multiple senior finance roles at KLX Energy Services and Greene’s Energy Group, where he led accounting, reporting, debt compliance, vendor onboarding, and bank communications. He has extensive experience managing accounting teams across AP, AR, payroll, cash flow forecasting, and internal controls implementation. Jeremy also has experience in refinancing processes, annual budgeting, and lender communications.\n\nJeremy began his career in public accounting, where he focused on tax and audit engagements for private and government clients. His early career also includes experience as a high school teacher, underscoring his ability to communicate complex information with clarity and precision.\n\nHe holds an MBA from Nicholls State University, a Master of Studies in Modern History from the University of Oxford, and a BA in History from the University of Louisiana at Lafayette",
  },
  {
    id: 14,
    name: "Jaime Guarino",
    suffix: "Administrative and Operations Manager",
    roles: "Operations, Financial Reporting",
    sort_order: 11,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Jaime Guarino is an experienced Administrative and Operations Manager with over 25 years of expertise spanning executive support, human resources, IT administration, procurement, compliance, and quality assurance. Skilled in managing complex corporate operations, Jaime has supported senior executives with task management and financial oversight while also leading HR functions including payroll, benefits, recruitment, and training. Known for her strong organizational skills, attention to detail, and collaborative approach, Jaime ensures efficient operations while fostering a positive and productive workplace environment.",
  },
  {
    id: 25,
    name: "Rohan Janakiraman",
    suffix: "Associate",
    roles: "Research, Financial Analysis, Due Diligence, Transaction Support",
    sort_order: 12,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As an Associate, Rohan supports all aspects of Fairlead's transactions, including research, marketing, financial analysis and evaluation, and due diligence. Previously, Rohan was an Associate with CIBC Capital Markets in their Energy, Infrastructure and Transition group. Prior to CIBC, he was a Consultant at The Brattle Group, advising several large North American utilities on critical issues including decarbonization strategy and tariff modernization.",
  },
  {
    id: 8,
    name: "Liesa Johnson",
    suffix: "Senior Consultant",
    roles: "Accounting, Inventory, Financial Reporting, ERP Systems",
    sort_order: 13,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "With a BA from Nicholls State University and 16 years of experience in the Oil and Gas Industry, Liesa Johnson specializes in Managing Fixed Assets & Fleet, Sales Tax, Inventory, Accounting, CapEx Project Management & Reporting, and Launching ERP systems. Her expertise in these areas has consistently contributed to the operational efficiency and financial health of her organizations, making her a trusted advisor and a key player in the industry. Liesa’s strategic approach and technical acumen have been pivotal in streamlining operations and driving significant capital expenditure initiatives.",
  },
  {
    id: 20,
    name: "Kristen LaBounty",
    suffix: "Senior Accountant",
    roles: "Accounting",
    sort_order: 14,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Kristen LaBounty brings nearly a decade of accounting and audit expertise to Fairlead Advisors, with a career spanning both corporate and Big Four public accounting. She specializes in financial reporting, audit coordination, and multi-entity accounting, with a proven track record of managing month-end close processes, supporting complex audit engagements, and delivering accurate, timely financial results.\n\nMost recently, Kristen served as Senior Accountant at Greenleaf Power, where she owned financial reporting and audit coordination across a multi-entity structure for nearly four years. Prior to that, she spent nearly four years at PwC in the Greater Sacramento practice, advancing from Audit Associate to Senior Associate. At PwC, she led audit engagements across a range of industries, evaluated internal controls, and navigated complex technical accounting matters in accordance with U.S. GAAP.\n\nKristen holds a Bachelor of Science in Business from Sonoma State University. She is known for her technical rigor, clear communication, and ability to translate accounting complexity into practical insights that support sound business decisions, qualities that align directly with Fairlead Advisors' client-first approach.",
  },
  {
    id: 5,
    name: "Alex MacDonald",
    suffix: "Director",
    roles: "Financial Reporting and Forecasting, Data Analysis, Working Capital Management",
    sort_order: 15,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As Director of Fairlead Advisors, Mr. MacDonald provides financial analysis, financial modeling, valuation, working capital and cash management, and debt compliance for our clients.\n\nSince joining Fairlead Advisors in 2012, Mr. MacDonald has worked across a broad range of industries, including power generation, rare earth mining, artificial intelligence, materials processing, and oil field services. In 2020, Mr. MacDonald became the interim Finance Director of Fairlead Advisor’s large oil field services client and helped to guide them to a successful company sale in 2023.\n\nDuring his tenure with Fairlead Advisors, Mr. MacDonald has provided financial and structuring support for dozens of clients and was integral to the successful M&A, debt financing, and tax equity transactions for many of these clients. Mr. MacDonald is exceptionally skilled at analyzing and valuing complex manufacturing processes, helping to revamp operational decisions and improve financial outcomes. In this role, Mr. MacDonald revamped operational and financial metrics for Cadre Proppants, a producer of frac sand to the oil & gas industry, and Nitonan, Inc., a manufacturer of tantalum powder for capacitors, which led to the successful sale of both companies at improved valuations.\n\nBefore joining Fairlead Advisors, Mr. MacDonald served as the Sr. Financial Analyst at Niotan, Inc., where he played an instrumental role in the turnaround and eventual sale of the company to its largest customer.\n\nMr. MacDonald has a B.S. in Finance from the University of Santa Clara and an MBA with a concentration in Finance from the University of Nevada, Reno.",
  },
  {
    id: 15,
    name: "Mitchell Martin",
    suffix: "P.E., Senior Consultant",
    roles: "Operations, Accounting, Asset Management",
    sort_order: 16,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Mitchell Martin, P.E., is a renewable energy executive with over 15 years of experience in the design, operation, and optimization of power generation assets. As a former Vice President of Engineering and Operations, he managed a 135-MW biomass portfolio with $100M in annual revenue, overseeing P&L, regulatory compliance, and major capital projects. His expertise spans diverse technologies, including utility-scale solar and battery energy storage (BESS), where he recently led the development of 300 MWdc of solar capacity and negotiated a $150M EPC agreement.\n\nA licensed Professional Engineer (California) and Texas A&M graduate, Mitchell combines technical depth with commercial acumen in the private equity space. He has a proven track record in asset acquisition and sale support, having contributed to the successful completion of a $300M credit facility and supported the due diligence for multiple plant transactions. Currently, as the owner of Valinor Energy, he provides disciplined asset management and project execution services for owners navigating complex energy markets and regulatory landscapes.",
  },
  {
    id: 13,
    name: "Ryan Mead",
    suffix: "Senior Consultant",
    roles: "Financial Modeling, Technology Integration",
    sort_order: 17,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Ryan is a Senior Consultant at Fairlead Advisors with over a decade of experience in private equity, infrastructure, and AI-driven ventures. He has led more than $5B in global transactions and previously served as CFO of a media-tech firm, where he launched multiple AI products and led a successful technology exit to a $12B metaverse company. Earlier in his career, Ryan worked in private equity for two of Canada’s largest pension funds—PSP Investments and ATRF—leading due diligence, financial modeling, and asset management. He holds a Bachelor of Commerce in Honors Investment Management from McGill University and speaks English, Spanish, and French.",
  },
  {
    id: 12,
    name: "Nora Murphy",
    suffix: "Senior Advisor",
    roles: "CFO, Financial Management, Operations, Strategic Planning",
    sort_order: 18,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As Senior Advisor, Ms. Murphy provides strategic corporate advisory, financial operational oversight, transaction management, valuation support, and financial planning to Fairlead’s clients, along with a significant track record of capital raising and structuring. Nora has extensive experience managing and advising corporate and portfolio company clients on financial and operational matters.  She has raised capital from and managed relationships with investors across the full range of equity, debt and tax-oriented capital and has worked with large corporates, private equity, family office and venture-backed companies.\n\nNora most recently served for 4 years as the Chief Financial Officer of Ambri, Inc., a leading energy storage technology and manufacturing company.  She was responsible for building and leading the finance, HR, legal, and real estate functional areas and oversaw all strategic and tactical matters relating to finance including tax, audit, treasury, FP&A, and capital raising.  Prior to her departure, she led the company’s successful restructuring through a Chapter 11 process.\n\nPrior to Ambri, Ms. Murphy served as Senior Advisor for Fairlead and provided interim CFO, COO, board advisor, and transaction management services to a broad range of companies.\n\nPrior to joining Fairlead, Nora was a Founding Member & Managing Director of Ansonia Partners, an energy and infrastructure focused advisory firm, where she managed client relationships, investor engagement, transaction execution, and junior resources. She also served as a Managing Director of ERM Capital, an affiliated merchant banking firm, investing in energy and infrastructure opportunities. Prior to Ansonia, she was a Director of EA Markets, an independent capital markets advisory firm, where she provided a range of clients across industries with product-independent capital markets focused advisory services. Prior to EA Markets, Nora was a Finance & Business Development for a venture-backed water infrastructure development start-up company, where she was responsible for investor management, business development, and finance.\n\nMs. Murphy began her career at J.P. Morgan as an Analyst in the Technology, Media & Telecom Group, an investment banking coverage group, where she focused on complex M&A, corporate finance, and capital markets transactions.  She was promoted to Associate and moved to J.P. Morgan’s Global Strategy, Business Development & Principal Investments group, a division of the investment bank, where she was responsible for managing and expanding a portfolio of strategic investments on behalf of the bank.\n\nNora earned a BS from Georgetown University and an MBA from Columbia Business School, where she was active in business plan development and operational consulting to a variety of startup companies based in Manhattan.",
  },
  {
    id: 10,
    name: "Lissen Ney",
    suffix: "CPA, Consultant",
    roles: "Venture Capital Support, Financial Reporting, Payroll, and Automation",
    sort_order: 19,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As an accounting consultant of Fairlead Advisors, Ms. Ney provides complete accounting services to our clients including working with client’s independent auditor. Her experience spans multiple industries with a hands-on approach to understanding and improving the efficiency in daily accounting operations and monthly closing processes.\n\nMs. Ney started her accounting career in 1998 at Vinmar Intl Ltd, an international plastics and chemicals trading company where she built up a strong foundation in the nuts and bolts of accounting while handling a high volume of A/P and A/R, reconciliations, intercompany transactions, payroll, treasury functions, reporting, assisting with monthly closes and audits as well as working through a system conversion to SAP.  From there she has continued to build upon those skills.\n\nWhile working at Trigen, a utility company, between 2002-2003 she handled monthly closings for subsidiary companies.  Between 2003-2005 she worked for Comcast Cable Inc. first as a corporate accountant at the divisional office managing monthly closings and related reporting and variance analyses for multiple counties’ cable systems and later as the accounting manager at one of the field offices handling their daily accounting and monthly close processes. From 2006-2009 Ms. Ney was the accounting manager at Merchant Metals, a division of MMI that manufactured and distributed fencing materials where she managed all the divisional accounting operations including A/R, A/P and Billing for 46 branches.  In 2009 she was entrusted with overseeing the creation of a Shared Services environment to consolidate the accounting operations of all four of MMI’s divisions and later continued managing the Shared Services group.\n\nBetween 2012-2019 Ms. Ney worked at Fisher CPA Firm, managing the monthly closes for multiple clients including reporting and payroll taxes, sales tax audits, assisting with federal tax returns and IRS communications.  From 2020-2022 she worked at Fourlane, a Quickbooks consulting firm where she was involved in the process of helping multiple clients to convert into Quickbooks while simultaneously identifying improvements needed in the accounting and reporting cycle.\n\nThrough all of her prior roles utilizing various accounting software, working with clients big and small, her focus on streamlining accounting processes and strengthening accounting controls has been driven by the ultimate goal of producing timely and accurate reporting that can be used as the basis for management decisions.\n\nMs. Ney has been a licensed CPA in the state of Texas since 2005.  She holds a BBA with a major in Accounting from the University of Houston where she graduated summa cum laude.",
  },
  {
    id: 26,
    name: "Craig Orchant",
    suffix: "Strategic Partner, Broker-Dealer Advisor",
    roles: "M&A Advisory, Capital Raising, Financial Hedging, Broker-Dealer Services",
    sort_order: 20,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Craig brings over 35 years of experience as a professional engineer, investment banker, and advisor across energy and infrastructure, with a rare combination of strategic, transactional, and technical depth. In senior leadership roles at UBS, Deutsche Bank, and Barclays Capital, Craig advised on over $50 billion in M&A transaction value and led underwriting and capital raising transactions in excess of $100 billion across public, private, and structured equity markets. He has also developed deep expertise in financial hedging transactions across the energy and commodity sectors, structuring solutions for both corporate issuers and institutional investors.\n\nBefore his financial career, Craig was a professional geotechnical (civil) engineer — a foundation that informs his approach to evaluating infrastructure and industrial assets from both a financial and technical perspective. He earned an MBA from Columbia Business School and a Master of Science from Cornell University.\n\nCraig is a registered representative of RainBridge Securities LLC (member FINRA/SIPC), through which broker-dealer services associated with his engagements are offered.",
  },
  {
    id: 6,
    name: "Kathy Osteraas",
    suffix: "Consultant",
    roles: "Corporate Governance, Project Management, Back Office Support",
    sort_order: 21,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Ms. Osteraas joined Fairlead in 2022 and provides corporate secretary, corporate governance, project management, and other administrative services for our clients. With over 30 years’ experience working as a senior paralegal for C-Suite executives and corporate boards, and overseeing legal entity formation and maintenance activities, Kathy efficiently provides best practices for corporate governance practices and procedures for our clients.\n\nMs. Osteraas has worked in legal departments for companies across the size and growth continuum, ranging from privately held early-stage independent energy companies to Fortune 500 Companies in the global energy and medical device sectors. Her most recent consulting role was for a multinational medical device company, where she created and maintained a database to manage corporate records and completed annual filings for hundreds of subsidiary companies globally and throughout the United States. Kathy brings attention to detail, organizational skills, and attentiveness to time-sensitive deadlines to every project in which she’s involved.\n\nMs. Osteraas enjoys helping her clients succeed and being part of ethical, results-driven organizations.",
  },
  {
    id: 27,
    name: "Pablo Sandstrom",
    suffix: "Senior Advisor",
    roles: "Marketing, Deal Structuring, Financial Modeling, M&A Execution",
    sort_order: 22,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As a Senior Advisor, Pablo supports the marketing, structuring, and financial modeling that underpin Fairlead's transaction work. Pablo previously worked at Morgan Stanley in their London office, where he served as an Associate with the M&A Execution and Financial Institutions Group teams, working on over 20 high-profile transactions, including many prominent financial advisory assignments across the banking, telecom, and technology industries. Pablo holds a double degree in International Business & Finance from ICADE Business School in Madrid, Spain.",
  },
  {
    id: 17,
    name: "Pam Sarne",
    suffix: "Senior Consultant",
    roles: "Accounting, Financial Reporting, Compliance",
    sort_order: 23,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Pam Sarne brings more than two decades of senior financial leadership experience to Fairlead Advisors, with deep expertise in controllership, financial operations, forecasting, and team development across the energy, media, and manufacturing sectors.\n\nBefore joining Fairlead, Pam served as Senior Vice President of Accounting at Ever-Green Energy, where she oversaw multi-entity consolidations, financial reporting, internal controls, budgeting . Her leadership contributed to the company’s strong financial performance and audit compliance for over a decade. Pam also served as Controller for ReelzChannel, a national television startup, where she led all accounting operations and supported the network’s expansion to New Mexico, including all programming budgets, advertising sales true-up with ratings and incentive program implementation.\n\nPam’s earlier roles include Senior Financial Analyst positions at Deluxe Corporation, Ecolab and Hubbard Broadcasting’s start-up company, USSB, where she supported business unit performance, product profitability analysis, and Sarbanes-Oxley compliance. She began her career in public accounting, supervising audits and preparing tax filings for a range of private companies.\n\nShe holds an MBA in Finance and a B.S. in Accounting from the Carlson School of Management at the University of Minnesota and is a Certified Public Accountant (CPA - retired).",
  },
  {
    id: 21,
    name: "Joe Winters",
    suffix: "Consultant",
    roles: "Accounting, Financial Reporting",
    sort_order: 24,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Joe brings over 25 years of experience in business financial management, with expertise in accounting and financial reporting, the development of complex budgeting and forecasting models, program finance, working capital, audit, and risk management.  His career has spanned a diverse array of business sectors, including investment banking advisory services in corporate finance and mergers and acquisitions, the development of cross-border, tax-based leasing solutions for businesses in the transportation industry, and earned value management and financial reporting for US defense contractors.\n\nJoe has extensive, hands-on experience with providing business management with the tools and capabilities needed for success, including financial analysis, forecast modeling, accounting and other business management functions, including bookkeeping, AR/AP management, billing, cost reporting and other day to day functions.  He has worked with a variety of business management and reporting platforms including Oracle, Hyperion Financial Management, Quickbooks, and Peoplesoft Enterprise Applications.",
  },
  {
    id: 28,
    name: "Peter Wu",
    suffix: "Associate",
    roles: "Project Finance Modeling, Collateral & Capacity Structuring, Scenario Analysis",
    sort_order: 25,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As an Associate, Peter builds the advanced project finance models that support Fairlead's work on large-scale utility and data-center energy agreements, with a focus on collateral and capacity-charge design, modeling, and scenario analysis to inform transaction structuring. Previously, Peter spent six years at E.SUN Financial Holding in Taiwan, progressing from corporate bond analyst and trader to manager, and founding the firm's macroeconomic research team. He later served as a Financial Analyst Intern at the United Nations Secretariat. Peter holds an MBA from NYU Stern and a Master's in Finance from National Taiwan University.",
  },
  {
    id: 29,
    name: "Adam Vosker",
    suffix: "CPA, Senior Consultant",
    roles: "Accounting, Reporting, ERP Implementation, Audit Support",
    sort_order: 26,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "As Senior Advisor, Mr. Vosker has more than two decades of experience leading and building finance teams. Mr. Vosker provides complete financial operations services, including accounting, reporting, investor relations, debt compliance, treasury, tax, regulatory compliance, ERP implementation and optimization, and external audit support. Throughout his career, Mr. Vosker has built a reputation for combining strong technical accounting expertise with strategic financial leadership, helping organizations improve governance, optimize financial performance, execute complex transactions, and scale operations through technology-enabled finance transformation.\n\nFrom 2021 to 2026 Mr. Vosker served as Vice President of Finance at AlphaStruxure, a private equity backed Energy-as-a-Service and microgrid development company, where he built and oversaw finance and accounting operations for a portfolio exceeding $250 million in capital and operating expenditures. His responsibilities included portfolio finance management, tax equity acquisition, project and construction accounting, financial planning and analysis, cash forecasting, debt compliance, regulatory and investor reporting. He led the implementation of Microsoft Dynamics 365 to strengthen project cost controls and consolidated reporting, directed portfolio audits and GAAP compliance initiatives.\n\nPrior to joining AlphaStruxure, Adam served as Corporate Controller for Vicinity Energy, a $1.5 billion district energy company, where he led financial operations across 15+ operating companies. His responsibilities included financial reporting, audit, ERP implementation, and accounting operations. He successfully led a major migration from SAP to Microsoft Dynamics 365, oversaw purchase accounting for acquisitions, and managed a team of finance professionals across corporate and site operations.\n\nEarlier in his career, Adam was Director of Finance & Accounting at Kearsarge Energy, a commercial-scale solar developer. There, he directed all finance and accounting functions, including treasury, financial reporting, tax compliance, investor reporting, and cash flow forecasting. He led the company’s ERP transition to Sage Intacct, managed complex partnership waterfall distributions, and supported banking and investor relations activities for renewable energy development projects.\n\nAdam also spent more than seven years with Black Box Network Services, a publicly traded multinational communications solutions provider, ultimately being promoted to Director of Accounting. In that role, he managed accounting and financial reporting for a federal government solutions division, ensuring compliance with GAAP, SOX, and Federal Acquisition Regulations (FAR). He led ERP modernization efforts, developed financial controls and accounting policies, managed budgeting and forecasting processes, and supported operational leaders with project financial performance management.\n\nHe began his career in public accounting with AAFCPAs, where he performed audit and tax engagements for nonprofit and privately held organizations across multiple industries.",
  },
  {
    id: 30,
    name: "Ann Huynh",
    suffix: "Strategic Partner, Senior Consultant",
    roles: "Advisory, Restructuring, M&A",
    sort_order: 27,
    has_photo: false,
    show_on_website: true,
    updated_at: SNAPSHOT_AT,
    extended_bio:
      "Ann Huynh is a seasoned restructuring and turnaround professional with 25+ years of experience with helping management, lenders, boards of directors, private equity sponsors, and legal counsel to support both company-side and creditor-side engagements, in both in-court and out-of-court settings. Ann brings multi-disciplined experience in capital raise, M&A, finance strategy, business planning, working capital optimization, operational improvements, risk management, turnarounds and restructuring advisory.\n\nWith experience across investment banking, corporate finance, and restructuring advisory, Ann brings a strategic, practical, and results-driven approach to complex business challenges. She has worked across a broad range of industries, including consumer products, manufacturing, real estate, retail services, power, renewables, oil and gas, and healthcare.\n\nPrior to Apex Global Advisors, Ann held senior roles at leading firms including Getzler Henrich, Grant Thornton, and Alvarez & Marsal, where she delivered corporate finance, turnaround and restructuring advisory services. Her “in-house” experience includes serving as Director of Strategic Planning and Analysis for a $5 billion publicly traded retail services company, where she built and led three functionals teams in FP&A, corporate budgeting ($320 million), and sales and marketing anaytics (field operations). Ann began her career in investment banking at Macquarie Bank in New York City, where she executed a wide rang of construction and infrastructure transactions focused on project development, M&A, capital raise, and strategic investments.\n\nShe is a Certified Insolvency and Restructuring Advisor (CIRA) and currently serves as President of the Turnaround Management Association (TMA) Houston Chapter. She also sits on the boards of the Women’s Energy Network (WEN) Houston and Under Our Wings, a nonprofit focused on children’s literacy.\n\nAnn earned a B.S. in Economics (Finance concentration) from the Wharton School of the University of Pennsylvania and a B.A. in Political Sciences, East Asian Studies from the University of Pennsylvania. She also holds an M.B.A. from the Jones Graduate School of Business at Rice University. Ann is speaks several languages, and enjoys international travel, art and tennis.",
  },
];
