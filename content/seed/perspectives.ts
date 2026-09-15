import type { Perspective } from "@/lib/types";

/**
 * Perspectives, every post the firm has published, each a full article
 * (§4.6). The legacy press reposts back to 2010 are here in full, converted
 * from the WordPress export.
 *
 * FALLBACK ONLY. The live content is the engagement hub's `perspectives`
 * table, edited in its Perspectives module (lib/data.ts → getPerspectives);
 * this snapshot serves when the hub is unreachable or not configured. It is
 * the same content the hub's migration 20260915000002_perspectives_full_posts.sql
 * seeds, edit there, not here.
 */
export const perspectives: Perspective[] = [
  {
    id: "1",
    slug: "ai-as-core-capability",
    title: "AI as a core capability",
    author_slug: "jason-salgo",
    published_at: "2026-02-15",
    excerpt: "Over the past year, AI moved from experiment to daily production across our engagements. What that actually took, and why most pilots never get there.",
    body_md: `**We no longer think about AI as something to pilot or selectively deploy. We treat it as a core capability, one our team is expected to understand, use, and improve with as part of everyday work, much like financial judgment or operational experience.**

Our team uses AI daily across analysis, preparation, and internal workflows. In addition, we have operated AI-enabled workflows inside portfolio companies, not as pilots or proofs of concept, but as production infrastructure handling real data, real volume, and real operational edge cases.

**That experience shapes how we advise clients.**

When we work with CFOs and management teams on AI adoption, we are not extrapolating from vendor demonstrations or industry commentary. We have already navigated the gap between theoretical capability and practical execution, where invoice formats vary, covenant definitions differ by agreement, and data lives across multiple systems.

##** What this looks like in practice**

We have embedded AI-driven capabilities across several core operational areas:

###** Back-office automation.**

AI-assisted invoice intake, exception handling, and fraud flagging designed to accommodate variability that often breaks traditional automation. Finance teams are able to process higher volumes without adding headcount.

###** Cash and covenant visibility.**

Workflows that pull actuals, maintain forecast logic, and surface variance explanations automatically. This allows finance leaders to focus on decisions rather than rebuilding spreadsheets.

###** Document intelligence.**

Multi-stage processing of compliance, operational, and financial documents across asset portfolios. In one engagement, this reduced approximately $250,000 of annual manual effort.

These are not products we sell. They are examples of what becomes possible when advisors have already crossed the implementation threshold internally.

##** Why this matters for portfolio companies**

Many AI initiatives fail during execution because the advisors involved have not operated within the underlying constraints. Tools are recommended without accounting for integration friction, data quality issues, or the exceptions that still require human judgment.

Our advice is informed by having worked inside those constraints ourselves.

As a result, implementations are designed to embed into existing workflows rather than requiring new habits to succeed. Systems are built to scale without proportional increases in cost or headcount, and guidance is grounded in production experience rather than theory.

##** Conclusion**

We are not the most vocal participants in discussions about AI in private equity. However, when portfolio companies ask whether an approach will work in practice, we are able to answer based on experience rather than optimism.

If this approach is relevant to your portfolio, we are happy to share what we are seeing in practice.`,
    external_url: null,
    visible: true,
  },
  {
    id: "2",
    slug: "fairlead-supports-dion-leaderships-acquisition-by-gallagher",
    title: "Fairlead Supports Dion Leadership’s Acquisition by Gallagher",
    author_slug: "jason-salgo",
    published_at: "2025-12-01",
    excerpt: "At Fairlead Advisors, we’ve long believed that the most enduring companies aren’t just built on clean financials. They’re built on trust, clarity, and a deep understanding of what…",
    body_md: `**At Fairlead Advisors, we’ve long believed that the most enduring companies aren’t just built on clean financials. They’re built on trust, clarity, and a deep understanding of what drives value beneath the surface. That’s why we were proud to support Dion Leadership, a Detroit-based executive coaching and leadership development firm, in its acquisition by Arthur J. Gallagher & Co., a global leader in insurance and HR consulting.**

**What Made This Engagement Unique?**

Dion Leadership isn’t a conventional consulting business. Since its founding in 2019, the firm has built a national reputation with over 60 coaches and consultants helping organizations lead more effectively. Dion was growing steadily, but the real asset wasn’t only in the financials. It was the way the firm delivers client results, scales talent, and sustains long-term client relationships.

Fairlead wasn’t brought in just to clean up spreadsheets. We were engaged to translate Dion’s value into language that investors and strategic buyers would understand. That meant examining the entire business model, not just the metrics.

**Our Role**

We worked closely with founder Steve Dion and his leadership team to:

- Clarify and position Dion’s business model and track record in a format that resonated with acquirers
- Identify strategic and financial partners that could see and build on Dion’s platform
- Support the negotiation and deal structure to reflect both immediate value and long-term potential
- Align founder and buyer around a shared post-transaction vision

**The Result**

Dion Leadership will now operate within Gallagher’s Talent Consulting Practice, adding depth in executive coaching, leadership development, and organizational effectiveness. Gallagher’s CEO J. Patrick Gallagher, Jr. shared, “Dion Leadership’s strong client relationships and expertise... will expand our capabilities in the executive consulting space.”

This outcome speaks to the value of Dion’s team, the clarity of their model, and the strength of the positioning that led to a successful transaction.

**Looking Ahead**

This engagement is a clear example of how Fairlead helps surface and communicate real value. We don’t rely on standard playbooks. We dig in, identify what matters most, and help move deals forward with confidence.

Whether you are a founder, investor, or buyer, we bring seasoned operational insight and transactional support to drive results.

**Hear from Steve Dion**

Steve recently shared his firsthand experience in a thoughtful video reflecting on the sale of Dion Leadership. Hear Steve’s experience with Fairlead Advisors.

▶ Download the full video`,
    external_url: null,
    visible: true,
  },
  {
    id: "3",
    slug: "fairlead-advisors-facilitates-successful-sale-of-product-insight",
    title: "Fairlead Advisors Facilitates Successful Sale of Product Insight",
    author_slug: "renee-sass",
    published_at: "2024-08-27",
    excerpt: "We are pleased to announce that Fairlead Advisors provided strategic financial advisory services for the successful sale of Product Insight, a consultancy focused on improving…",
    body_md: `We are pleased to announce that Fairlead Advisors provided strategic financial advisory services for the successful sale of Product Insight, a consultancy focused on improving operational efficiency through labor-centered product development.

**About Product Insight**

Product Insight has built a strong reputation for delivering high-impact solutions that improve the productivity of workers across various industries. The firm’s commitment to efficiency, transparency, and excellence has established it as a leader in the development of professional products.

**The Sale Process**

In July 2024, Fairlead Advisors assisted Product Insight’s owners in selling the company to an internal buyer. We conducted a comprehensive financial valuation, which informed the negotiation of key sale terms to align with the owners’ financial goals.

**Legal and Transactional Support**

Our team worked closely with legal counsel to finalize the transaction, ensuring all legal and regulatory requirements were met and the deal was completed smoothly.

**Outcome**

The successful sale allowed the owners to achieve their financial objectives, while positioning Product Insight for continued success under new leadership.

**Our Commitment**

Fairlead Advisors is proud to have supported Product Insight in this significant milestone and looks forward to the company’s ongoing success.`,
    external_url: null,
    visible: true,
  },
  {
    id: "4",
    slug: "singrobo-hydropower-plant-wins-power-deal-of-the-year-award",
    title: "Singrobo hydropower plant wins Power Deal of the Year award",
    author_slug: "jason-salgo",
    published_at: "2024-04-03",
    excerpt: "The 44 MW Singrobo hydropower plant in Côte d’Ivoire, which was supported by the African Development Bank, won the Power Deal of the Year award at the IJGlobal Awards.",
    body_md: `The 44 MW Singrobo hydropower plant in Côte d’Ivoire, which was supported by the African Development Bank, won the Power Deal of the Year award at the IJGlobal Awards.

Singrobo (also called Singrobo-Ahouaty) was the first hydropower IPP and private sector-funded climate action investment to reach financial close in West Africa, in December 2022. The bank played the Mandated Lead Arranger role for the Singrobo hydropower plant. The bank financed €40 million (US$43.4 million) out of the total cost of €174.3 million ($189.1 million).

Currently under construction, the project comprises the design, development, operation and transfer of a hydroelectric plant on the Bandama River, and a 3.5-km-long transmission line and substation to evacuate power.

The facility, about 150 km north of Abidjan, could supply electricity to 100,000 households and reduce Côte d’Ivoire’s CO2 emissions by 109,000 tons annually. The project will create 500 jobs during the construction phase, including 150 skilled jobs, and 28 jobs during the operational phase.

A long-term power purchase agreement will see all the energy produced by the Singrobo plant sold to Compagnie Ivoirienne d’Electricite, the operator of Cote d’Ivoire’s national grid. Upon completion, the plant will contribute to Côte d’Ivoire’s energy goal of generating 42% of its electricity from renewable sources by 2030.

Hydro Review reported that the Singrobo-Ahouaty hydropower plant project achieved a 78.93% completion rate as of the end of March 2023, according to the African Development Bank.

Wale Shonibare, the Bank’s Director for Energy Financial Solutions, Policy & Regulation, said the award is “a recognition of our continued efforts to deliver green, affordable, quality energy access to Africa, in line with the bank’s energy and green growth agenda. We are encouraged to continue mobilizing private sector finance, and delivering innovative financial solutions that facilitate just energy transitions and address the unique financing needs of our regional member countries.”

The IJGlobal independent, peer-reviewed awards recognize notable global greenfield and refinancing deals in infrastructure and energy and the organizations that made them happen.

Full article reference: https://www.hydroreview.com/business-finance/finance/singrobo-hydropower-plant-wins-power-deal-of-the-year-award/`,
    external_url: null,
    visible: true,
  },
  {
    id: "5",
    slug: "power-digital-infrastructure-acquisition-ii-corp-xpdb-announces-closing-of-business-combination-with-montana-technologies-llc",
    title: "Power & Digital Infrastructure Acquisition II Corp. (XPDB) Announces Closing of Business Combination with Montana Technologies LLC",
    author_slug: "adam-carte",
    published_at: "2024-03-14",
    excerpt: "Total Capital Commitments Exceeded $50 Million Target Minimum Cash Condition, Led by Carrier, GE Vernova and Rice Investment Group, Providing All Funding Required to Commercialize…",
    body_md: `*Total Capital Commitments Exceeded $50 Million Target Minimum Cash Condition, Led by Carrier, GE Vernova and Rice Investment Group, Providing All Funding Required to Commercialize AirJoule®*

*Combination to Fuel Launch of Recently Announced Joint Venture Between GE Vernova and Montana Technologies to Commercialize AirJoule® Technology for Atmospheric Water Generation and Carrier Air Conditioning Products*

*Montana Technologies Corporation Will Commence Trading on NASDAQ Under the Symbols "AIRJ" and "AIRJW", Respectively*

CHICAGO and RONAN, Mont., March 14, 2024 /PRNewswire/ -- Power & Digital Infrastructure Acquisition II Corp. ("XPDB") (NASDAQ: [XPDB](https://www.prnewswire.com/news-releases/power--digital-infrastructure-acquisition-ii-corp-xpdb-announces-closing-of-business-combination-with-montana-technologies-llc-302089782.html#financial-modal), XPDBW, XPDBU), a special purpose acquisition company focused on the renewable and transition energy sectors, today announced closing of its business combination with Montana Technologies LLC ("Montana"), the inventor of AirJoule® -- a transformational renewable energy and cooling technology.

XPDB and Montana Technologies LLC [exceeded the $50 million target minimum cash condition](https://www.prnewswire.com/news-releases/power--digital-infrastructure-acquisition-ii-corp-xpdb-and-montana-technologies-exceed-50-million-in-private-capital-commitments-led-by-carrier-and-rice-investment-group-expected-to-satisfy-minimum-cash-condition-and-clears-302078516.html) by securing private investments from [Carrier Corporation](https://www.prnewswire.com/news-releases/carrier-signs-agreement-with-montana-technologies-to-commercialize-carbon-reducing-cooling-technology-for-hvac-solutions-302028558.html), the [Rice Investment Group](https://www.prnewswire.com/news-releases/montana-technologies-announces-investment-from-rice-investment-group-302065566.html), and [GE Vernova](https://www.prnewswire.com/news-releases/ge-vernova-and-montana-technologies-close-joint-venture-to-manufacture-transformational-air-conditioning-and-atmospheric-water-harvesting-products-302084809.html?tc=eml_cleartime), among other third parties. The minimum cash condition was also satisfied by joint venture funding commitments and cash that currently remains in XPDB's trust. These capital commitments provide the total funding required to commercialize Montana's AirJoule® technology.

The business combination closed on March 14, 2024. The common stock and warrants of the combined company, which will be renamed "Montana Technologies Corporation," are set to commence trading on the Nasdaq Capital Market ("NASDAQ"), under new ticker symbols, "AIRJ" and "AIRJW", respectively.

Pat Eilers, CEO of XPDB, said, "Montana Technologies Corporation is now fully funded to commercialize its transformational technology through its global supplier, manufacturing, and commercialization partners, including BASF, GE Vernova, CATL, and Carrier."

Matt Jore, CEO of Montana Technologies Corporation, said, "We are in the process of scaling and deploying pre-production AirJoule® units with our world-class partners to the largest, highest probability end customers around the world, which we are confident will generate highly lucrative contracts for the Company in the near-term."

The formal results of the XPDB shareholder vote, as well as the number of holders of shares of Class A Common Stock who exercised their right to redeem their shares for cash, will be included in a Current Report on Form 8-K to be filed by XPDB with the Securities and Exchange Commission ("SEC"). Additional details on the proposed business combination can be found in the definitive proxy statement/prospectus of XPDB, which was filed with the SEC on January 17, 2024.

**About Power & Digital Infrastructure Acquisition II Corp**

Power & Digital Infrastructure Acquisition II Corp (XPDB) is a blank check company incorporated in Delaware for the purpose of effecting a merger, capital stock exchange, asset acquisition, share purchase, reorganization or similar business combination with one or more businesses.

**About Montana Technologies**

Montana Technologies is an atmospheric thermal energy and water harvesting technology company that provides efficient and sustainable air conditioning and pure water from air through its transformational AirJoule *® * technology. For more information, visit [**www.mt.energy** ](https://c212.net/c/link/?t=0&l=en&o=4078297-1&h=1789554647&u=http://www.mt.energy/&a=www.mt.energy).

**Forward Looking Statements**

This press release contains forward-looking statements within the meaning of the United States Private Securities Litigation Reform Act of 1995. Forward-looking statements may include, but are not limited to, statements about the anticipated benefits of the business combination, including the financial and business performance of Montana Technologies Corporation, and Montana Technologies Corporation's anticipated results from operations in future periods; the products and services offered by Montana Technologies Corporation and the markets in which it operates. In addition, any statements that refer to projections, forecasts or other characterizations of future events or circumstances, including any underlying assumptions, are forward-looking statements. Forward-looking statements are typically identified by words such as "plan," "believe," "expect," "anticipate," "intend," "outlook," "estimate," "forecast," "project," "continue," "could," "may," "might," "possible," "potential," "predict," "should," "would" and other similar words and expressions, but the absence of these words does not mean that a statement is not forward-looking.

The forward-looking statements are based on the current expectations of the management of Montana Technologies Corporation and are inherently subject to uncertainties and changes in circumstances and their potential effects and speak only as of the date of such statement. There can be no assurance that future developments will be those that have been anticipated. Forward-looking expectations and assumptions are inherently subject to uncertainties and contingencies regarding future events and, as such, are subject to change. Forward-looking statements involve a number of risks, uncertainties or other factors that may cause actual results or performance to be materially different from those expressed or implied by these forward-looking statements. These risks and uncertainties include, but are not limited to, those discussed and identified in public filings made by Montana Technologies Corporation with the Securities and Exchange Commission (the "SEC"); the risk that the announcement and consummation of the Transaction disrupts Montana Technologies Corporation's current plans; the ability to recognize the anticipated benefits of the business combination; Montana Technologies Corporation's limited operating history; Montana Technologies Corporation's ability to attract and retain qualified management; Montana Technologies Corporation's ability to adapt to rapid and significant technological change and respond to introductions of new products in order to remain competitive; the fact that Montana Technologies Corporation receives a significant portion of its revenues from a small number of customers and the loss of, or nonperformance by, one or more significant customers could adversely affect Montana Technologies Corporation's business; Montana Technologies Corporation relies heavily on manufacturing operations to produce the products and the business could be adversely affected by disruptions of the manufacturing operation; Montana Technologies Corporation's future growth depends on a single product; changes in governmental regulations may reduce demand for Montana Technologies Corporation's products or increase Montana Technologies Corporation's expenses; changes or disruptions in the securities markets; legislative, political or economic developments; the need to obtain permits and comply with laws and regulations and other regulatory requirements; risks of accidents, equipment breakdowns and labor disputes or other unanticipated difficulties or interruptions; the possibility of cost overruns or unanticipated expenses in development programs; and potential future litigation.

Should one or more of these risks or uncertainties materialize or should any of the assumptions made by the management of Montana Technologies Corporation prove incorrect, actual results may vary in material respects from those projected in these forward-looking statements.

These forward-looking statements are provided for illustrative purposes only and are not intended to serve as, and must not be relied on by investors as, a guarantee, an assurance, a prediction or a definitive statement of fact or probability. You should carefully consider the foregoing factors and the other risks and uncertainties described in the "Risk Factors" section of the definitive proxy statement/prospectus filed by XPDB on January 18, 2024 and the other documents filed by XPDB and Montana Technologies Corporation from time to time with the SEC. These filings identify and address other important risks and uncertainties that could cause actual events and results to differ materially from those contained in the forward-looking statements. Forward-looking statements speak only as of the date they are made. All subsequent written and oral forward-looking statements concerning the business combination or other matters addressed herein and attributable to Montana Technologies Corporation, XPDB, Montana Technologies or any person acting on their behalf are expressly qualified in their entirety by the cautionary statements contained or referred to herein. Except to the extent required by applicable law or regulation, Montana Technologies Corporation undertakes no obligation to update these forward-looking statements to reflect events or circumstances after the date hereof to reflect the occurrence of unanticipated events.

**Media Contact**

Andy Maas; Daniel Yunger
Kekst CNC
MTMediaInquiries@kekstcnc.com

SOURCE Montana Technologies; Power & Digital Infrastructure Acquisition II Corp. (XPDB)`,
    external_url: "https://www.prnewswire.com/news-releases/power--digital-infrastructure-acquisition-ii-corp-xpdb-announces-closing-of-business-combination-with-montana-technologies-llc-302089782.html",
    visible: true,
  },
  {
    id: "6",
    slug: "mary-days-reflections-on-working-at-fairlead",
    title: "Mary Day’s Reflections on Working at Fairlead",
    author_slug: "renee-sass",
    published_at: "2023-10-11",
    excerpt: "In a few weeks, Mary Day will begin reducing her workload with the goal of fully retiring in the not-too-distant future. But before she gets distracted by future adventures, we…",
    body_md: `In a few weeks, Mary Day will begin reducing her workload with the goal of fully retiring in the not-too-distant future. But before she gets distracted by future adventures, we sat down with Mary to capture what she’s learned during her tenure with Fairlead.

## A Decade as a Consulting Controller, Key Takeaways for Investors

Before delving into a decade's worth of insights, it's essential to spotlight the person behind these observations: Mary Day. A CPA (expired) and Senior Consultant at Fairlead Advisors with an illustrious background, Mary has carved a niche in the financial landscape. Her tenure in accounting included large companies (e.g., Honeywell and NRG Energy), private equity (e.g., Wayzata Partners), and a wide range of P.E. and V.C.-backed companies while with Fairlead Advisors. Mary's role as a Consulting Controller transcends traditional consultancy. She combines "outside expert" expertise in best practices with a focus on hands-on implementation, subject to real-world budget and human resource constraints. It is from this deep well of experience and knowledge that she draws upon as she shares her journey.

## Observations from Ten Years as Fairlead's Consulting Controller

As I approach the close of a fulfilling decade with Fairlead Advisors and reflect on my many client-specific challenges, some common themes and patterns emerge. Serving as Fairlead's Consulting Controller placed me at the heart of financial transformations and taught me that every company is unique: no "one-size-fits-all" solution exists. But many challenges repeat, or at least rhyme with each other.

## Overcoming the Fear of Disruption

Even when an accounting group continuously fails to deliver timely and meaningful financial reporting, companies wait far too long to make a change. This hesitancy arises from two related and logical concerns. First, the company must invoice customers, process bills, and make payroll. Any change to the people or processes doing this work threatens operations.

Second, the incumbent controller will have substantial knowledge of the company's systems and financial records, and the company often worries that engaging Fairlead will provoke the controller to quit.

Paradoxically, in our experience, delaying action increases the risk that the incumbent controller will leave without supporting the transition. A poorly performing controller knows they are underperforming and will start looking for another job. Once found, their motivation to help with the transition plummets. In contrast, when the company engages Fairlead sooner, the existing controller often appreciates our hands-on and collaborative work ethic and seizes on the opportunity to improve their performance.

If the controller needs to be replaced, they support the transition to protect their professional reputation while looking for a new job.

## The Power of Real-Time Reporting

Effective financial reporting is not just about generating numbers; it's about having real-time processes that enable teams to produce regular and on-the-fly business reports. This agility in reporting allows the company to adapt to evolving and unanticipated business challenges.

## Harness New and Improved Reporting Software

New and inexpensive reporting tools can often deliver quality reporting formerly dependent on high-priced ERP systems. By staying current with new tools and improvements to lower-cost ERP, we were able to create step-change improvements in financial reporting while reducing cost.

## Raise Expectations

Companies with underperforming accounting groups start by searching for what's good enough and forget to ask for what's possible. Spend time with the CEO and other executives to learn what additional business reporting will help them.

## Every Situation is Different

Every time a new engagement came my way, signaling a new challenge, it wasn't just about applying prior experience to a new company. It was about delving into a new story, understanding the unique fabric of that company, and finding the best solutions for them. While I've seen many problems repeatedly, I started each engagement with the humility that every company is different. I enjoyed the personal growth that came from every new engagement, and our team was able to combine Fairlead's background knowledge with company-specific variables to exceed client expectations.

## Never Underestimate the Human Element

Behind every tool, process, and report are people. Empower them with the knowledge, systems, and confidence to succeed in their jobs, and weak performers can become strong.

## Retrospective

Looking back at a decade of challenges, transformations, and successes, I'm grateful and fulfilled for my time at Fairlead. Every company, every challenge, and every number told a unique story, and I am honored to have been a part of so many. As I spend more time with my friends, family, and scuba-diving adventures, my colleagues and successor at Fairlead will continue the journey.`,
    external_url: null,
    visible: true,
  },
  {
    id: "7",
    slug: "team-member-spotlight-carolina-andres",
    title: "Team Member Spotlight - Carolina Andrés",
    author_slug: "adam-carte",
    published_at: "2023-07-24",
    excerpt: "Introducing Fairlead Advisor's newest team member, Carolina Andrés! Hailing from Portugal with an 11-year professional journey spanning Slovakia and Portugal, Carolina's expertise…",
    body_md: `Introducing Fairlead Advisor's newest team member, Carolina Andrés! Hailing from Portugal with an 11-year professional journey spanning Slovakia and Portugal, Carolina's expertise lies in shared service center operations. What she finds most rewarding is embracing challenges and tackling unconventional projects. With fluency in Portuguese, English, and Spanish, Carolina effortlessly bridges cultural gaps in her work. Her ability to manage diverse accounting principles across business units is truly commendable. Notably, she developed a real-time data consolidation tool that enhanced a company's bottom line significantly. In times of crisis, Carolina's adaptability and willingness to learn shine through. For investors managing multi-country investments, she offers valuable advice on understanding different work cultures.

**Tell me a bit about yourself and what you like most about your work.**

I am Portuguese, born and raised. My professional journey spans 11 years, during which I have served in Slovakia and Portugal, primarily engaged in shared service center operations. My responsibilities have been diverse and dynamic, from hands-on operational tasks to establishing shared services for multinational companies. This usually entailed traveling to various countries to understand their needs and then integrating those services into the shared service operations in Portugal or Slovakia.

The aspect of my work that I find the most rewarding is the opportunity to tackle challenges head-on. I thrive when pushed out of my comfort zone and tasked with novel, unconventional projects. This aligns perfectly with my new role at Fairlead, whose clients are often in a time of rapid change. I consider myself fortunate for this opportunity.

**You speak Portuguese, English, and Spanish fluently. How did you do this? Has being tri-lingual influenced the work you’ve done?**

As a native of Portugal, we naturally gravitate towards learning Spanish due to our close geographical and cultural bonds. I started learning Spanish during an internship when I opted to take a language class. Paradoxically, my learning curve for Spanish accelerated when I moved to Slovakia, where I served the Spanish market and shared my life with Spanish locals. This immersive experience caused Spanish to come to me almost effortlessly, becoming a valuable tool in my professional toolkit and personal interactions.

For English, growing up in the south of Portugal, a region teeming with tourists, meant that I was constantly bathed in a sea of different languages, with English dominating. Moreover, my family, scattered across the globe, used English as our official language at home. This bilingual upbringing made mastering English an easy feat for me.

**You have done an impressive amount of work helping shared-service departments manage business units in multiple countries. What have you learned from this experience?**

Every place I've worked in is unique, with different people and customs. Being flexible and understanding their way of life helps to connect. It's the same at work; if people are at ease with you, they're more likely to lend a hand when needed.

It doesn't work well just to tell people, "This is how it's done." It's crucial to understand and respect their culture. The biggest lesson I've learned is to respect others, their language, and their way of life. This respect goes a long way, especially in this line of work. Understanding differences and showing respect not only helps in your personal life but also boosts your career.

**You've helped different business units in the same company manage financial reporting needs for multiple business units, often using different accounting principles; what challenges did this create and how did you manage them?**

Working with US GAAP and IFRS across varied business units is a fun challenge. They share similar foundations, but the devil is in the details. It's like speaking different dialects of the same language.

The trickiest part? Balancing unique reporting needs of each unit while keeping true to their accounting principles. Take for example, in Portugal, where we tweaked US GAAP to fit our local context. The key was to understand these adaptations yet ensure they still sang to the tune of US GAAP.

My secret to managing these challenges? Flexibility and an open mind. It's not just about knowing accounting rules but comprehending how they dance with the rhythm of each unit. I learned to collaborate closely with teams, understanding their needs and aligning their processes with the accounting standards. It was a fantastic balancing act that taught me the value of continuous learning and adaptation in the fascinating world of finance.

**Can you give an example of how you helped a company improve its bottom line, perhaps by making an existing process more efficient or surfacing business insights needed to improve sales and operations?**

In my previous role, we developed a tool that consolidated data from multiple systems for the first time providing vital, real-time insights into the company’s performance. This enabled leaders to identify operational inefficiencies and potential cost savings, offering a live snapshot of the business. Such a tool is incredibly beneficial for the Board of Directors, too, providing immediate, comprehensive insights into the business.

**You’ve been asked to step into a crisis after the sudden departure of multiple team members. Tell me about that experience. What did you learn from it and what advice would you give others in a similar situation?**

Following the unexpected departure of multiple team members, I needed to quickly assume many new responsibilities. Given tight deadlines and a shifting team dynamic, I needed to be adaptable, ready to learn, and take on new tasks, often stepping out of my comfort zone. The situation demanded an immediate response, so it was about jumping into action first and reflecting later. Indeed, it was challenging, but it provided an opportunity to grow personally and professionally, discovering capacities I didn't know I had.

My advice to anyone in a similar situation is to remain adaptable and open-minded. Embrace the challenges as opportunities for growth, not just for the business but for yourself. Sometimes, it's in the face of adversity that we truly discover our potential.

**You've moved financial activities among multiple countries. Have you encountered challenges managing different cultures and work habits of people from different countries?**

Working across different countries, I encountered diverse work habits and cultural variations. For instance, in South America, there's a more relaxed approach to work, with flexibility in hours and a focus on getting things done. In contrast, countries like Denmark prioritize efficiency, starting early and finishing promptly. Adapting to these differences in work culture and scheduling was crucial. Understanding and respecting varying work styles is key when collaborating across borders. Flexibility and adapting meeting times accordingly have been essential in navigating these cultural nuances.

**How do you use business report tools like PowerBI, Oracle, and Excel to give management easy-to-understand data and insights?**

I utilize tools like Power BI, Oracle, and Excel to translate complex data into simple, clear insights for owners and managers. I'm particularly fond of Power BI. Its interactive nature allows me to create dynamic dashboards that investors can access anytime, anywhere. With real-time updates and visually engaging graphs, I make it easy for investors to track key metrics and understand the company's performance, the ability to break down complex financial data into user-friendly visualizations aids in providing quick yet effective insights.

**What tips would you give investors managing investments in multiple countries?**

Make sure you have access to trustworthy financial and business reporting in new countries. This comes from having team members that speak the language and have immersed themselves in the target country. Spend time there, understand the work culture, and adapt to their ways of doing business.`,
    external_url: null,
    visible: true,
  },
  {
    id: "8",
    slug: "case-study-survival-sprint-a-startup-manufacturers-race-to-fundraise",
    title: "Case Study: Survival Sprint - A Startup Manufacturer’s Race to Fundraise",
    author_slug: "adam-carte",
    published_at: "2023-06-01",
    excerpt: "Several years ago, a venture-stage company that we'll call ACME Metals built a commercial-scale manufacturing plant to produce a substance used by high-end computers and cell…",
    body_md: `Several years ago, a venture-stage company that we'll call ACME Metals built a commercial-scale manufacturing plant to produce a substance used by high-end computers and cell phones, using an innovative production process ACME had previously developed.

When it engaged Fairlead, ACME was already successfully producing several grades of its product, attracting customer interest and competitors' attention. However, due to underinvestment in its financial staff and systems, ACME couldn't show whether its process was profitable. What they knew was that they were burning cash and had less than a year before it would exhaust the funding allocated to ACME by its private equity investor.

The raw materials used in the production process were expensive and had to be procured six months in advance, forcing ACME to invest heavily in inventory. This investment helped explain its negative cash flow. But without a functioning accounting system, it didn't know if operating income was counteracting or exacerbating the drain on cash flow.

The financial statements were incomprehensible, and Fairlead subsequently uncovered significant errors in the accounting that forced us to recreate three years of financial statements.

Fairlead's mandate was to help ACME prepare and arrange for additional financing or a company sale before the company ran out of money in about twelve months. We knew we had to prepare credible financial statements as part of the fundraising process, but demonstrating that ACME's plant was more efficient than its competitors was of existential importance. ACME had to prove to skeptical industry engineers that it could deliver high-volume, medium-grade products more efficiently than its competitors and profitably produce low-volume, high-grade products that its competitors couldn't.

Thus began our race against the clock. With less than a year before the money ran out, implementing a manufacturing-focused ERP to measure plant efficiency was out of the question. So while our accounting team worked to restate historical financial statements, our analysis team worked with the VP of Operations, to replicate the production process in Excel.

Each product batch required a month before it was ready for final testing and shipment, with several batches at various stages of production at any given moment. The processing model improved with each new production run. First, we calculated a baseline efficiency calculation that validated the founder's original thesis. Next, the VP of Operations studied the data he now had at his fingertips, made adjustments, and improved plant efficiency during the fundraising process.

With proof of the plant's performance, ACME garnered significant customer and competitor interest. After a competitive auction, ACME's largest customer bought the company at a premium to its invested capital three weeks before running out of money.

(ACME also delivered three years of audited financials at close so the buyer could check a box on its due diligence list).

The hero of this story is ACME's founder, who had the vision and ability to develop and build a better production process. But, while his accomplishment was necessary, it was insufficient. ACME had to demonstrate its breakthrough to skeptical industry insiders and engineers with limited capital and time. Young companies always need more time and money to do everything right, so they prioritize and sometimes make mistakes. These mistakes create challenges when they need more capital that can be overcome by focusing on what's essential to prove the value of the company.`,
    external_url: null,
    visible: true,
  },
  {
    id: "9",
    slug: "fairlead-advises-breakthrough-computer-vision-company-nirenberg-neuroscience-on-its-2022-acquisition-by-a-u-s-based-tech-giant",
    title: "Case Study: Fairlead advises breakthrough computer vision company Nirenberg Neuroscience on its 2022 acquisition by a U.S.-based tech giant.",
    author_slug: "adam-carte",
    published_at: "2023-05-01",
    excerpt: "Fairlead advises breakthrough computer vision company Nirenberg Neuroscience on its 2022 acquisition by a U.S.-based tech giant.",
    body_md: `Fairlead advises breakthrough computer vision company Nirenberg Neuroscience on its 2022 acquisition by a U.S.-based tech giant.

Fairlead provided strategic planning, executive management, and accounting services to Nirenberg Neuroscience (NN), a computer-vision-focused AI company based in New York City. Fairlead supported NN from the company’s initial seed-stage financing until a prominent California-based tech giant acquired NN in early 2022.

The company’s founder, Dr. Sheila Nirenberg ["broke the neural code"](https://www.ted.com/talks/sheila_nirenberg_a_prosthetic_eye_to_treat_blindness) used by human vision to make sense of what we see, efficiently identifying what is necessary and ignoring nonessential visual data, a breakthrough for which she received the MacArthur "Genius" award. She harnessed the neural code for use in computers, dramatically reducing the dimensionality of visual data for computers, as it does for humans. Computers trained to "see" with NN's [software successfully identify objects and behaviors where other approaches fail](https://www.tedmed.com/talks/show?id=619685), and do so with far less data.

Less than six months after raising an angel round of seed financing, NN was wowing audiences with pilot demonstrations, but the company faced a business problem. The technology solved a general problem common to most computer vision tasks, but customers only pay for fully developed solutions to their particular use cases (e.g., detecting shoplifting, violence on subways, etc.) Developing and selling each use case requires a significant investment in engineering and sales resources while leaving most of the software's value unutilized.

NN overcame this challenge in three ways. First, rather than developing a solution for a narrow use case, Nirenberg created pilot applications that proved the software’s power to solve a wide range of common problems. Armed with proof of what NN could do, the company overcame the skepticism of technical “experts” trained to use conventional deep learning algorithms.

Second, NN focused on customers with high-value and general computer vision problems, such as self-driving cars needing to "see" at least as well as humans. This focus led to a license agreement with Ford Motor Company to integrate NN's human-like vision technology into Ford's autonomous car development program.

Following the agreement with Ford, the company partnered with a prominent chip manufacturer to design a chip that gives the power of NN's software to any company, large or small, seeking solutions to computer vision challenges. By embedding the technology on a chip, the complete value of the neural coding software becomes accessible to everyone while protecting the company's patented technology from theft.

This successful partnership ultimately led to this California-based tech giant's acquisition of Nirenberg Neuroscience.

Third, a key aspect of Nirenberg’s success was efficient use of the company’s capital. She shunned image-conscious additions to the team, fancy facilities, and discretionary marketing; instead, she kept NN’s cost structure to a minimum and contracted for fractional commercial, financial, and back-office support from Fairlead Advisors, giving it the benefits of an experienced management team at a small fraction of the cost.

The acquisition of Nirenberg Neuroscience by the U.S.-based tech giant marks a significant achievement for the New York-based company and its founder, Dr. Sheila Nirenberg. By focusing on the science and the strengths of the technology and keeping its cost structure low, the company had the time needed to find a path to make a step-change improvement in the field of computer vision and deliver stellar returns to its investors. The support of Fairlead Advisors played a key role in this achievement.

**About Nirenberg Neuroscience:**

Nirenberg Neuroscience is a New York-based neuroscience company that has made significant advancements in AI-powered computer vision software. Dr. Sheila Nirenberg's work decoding the mysteries of human vision has led to the creation of lightweight and efficient learning algorithms by NN and a potential treatment for returning sight to patients with degenerative retinal diseases through an affiliate, Bionic Sight Inc.

**About Fairlead Advisors:**

Fairlead Advisors supports companies through growth and change, offering a comprehensive range of operating partner services backed by their experienced executive management team. Their expertise spans strategic, managerial, financial, technical, and operational areas, and they have worked with various industries, from fast-growing startups to distressed companies. Fairlead Advisors provides personalized attention and tailored solutions, filling advisory, board representation, and interim-management needs that help attract new investors and monetize investments. Since 2010, Fairlead has enabled companies to unlock untapped value, driving growth and successful transactions with their dedicated team of professionals.

**Additional Information:**

To learn more, contact Fairlead Advisors at acarte@fairleadadvisors.com.`,
    external_url: null,
    visible: true,
  },
  {
    id: "10",
    slug: "klx-energy-services-completes-acquisition-of-greenes-energy-group-in-a-deleveraging-accretive-all-stock-transaction-adding-scope-and-scale-to-its-southwest-segment",
    title: "KLX Energy Services Completes Acquisition of Greene's Energy Group in a Deleveraging, Accretive All-Stock Transaction, Adding Scope and Scale to its Southwest Segment",
    author_slug: "renee-sass",
    published_at: "2023-03-08",
    excerpt: "KLX Energy Services Holdings, Inc. (NASDAQ: KLXE), (\"KLX\" or the \"Company\") announced today it has acquired all of the equity interests of Greene's Energy Group, LLC (\"Greene's\")…",
    body_md: `HOUSTON, March 8, 2023

KLX Energy Services Holdings, Inc. (NASDAQ: KLXE), ("KLX" or the "Company") announced today it has acquired all of the equity interests of Greene's Energy Group, LLC ("Greene's"), including $1.7 million in cash remaining with Greene's, in an all-stock transaction. The total consideration for the acquisition consisted of the issuance of approximately 2.4 million shares of KLX common stock, par value $0.01 per share, subject to customary post-closing adjustments, with an implied enterprise value of approximately $30.3 million based on a 30-day volume weighted average price ("VWAP") as of March 7, 2023 and less acquired cash. Following the closing of the transaction, former shareholders of Greene's hold approximately 14.7% of the fully diluted common stock of the Company.

Greene's is a leading provider of wellhead protection, flowback and well testing services. The acquisition of Greene's, which is expected to be accretive to KLX in 2023, augments the KLX frac rental and flowback offering, providing KLX with a broader presence in the Permian and Eagle Ford basins.

Commenting on the acquisition, Chris Baker, KLX President and Chief Executive Officer, stated, "We are pleased to welcome Greene's exceptional management team and talented employees to KLX. Greene's has an excellent industry reputation and fits naturally within KLX's Southwest segment supporting both Permian and Eagle Ford operators. Greene's has a strong unlevered balance sheet, reporting unaudited $68.0 million in revenue, $5.3 million in net income and $14.7 million in Adjusted EBITDA in 2022. Going forward, we expect the legacy Greene's platform to generate 2023 revenue and Adjusted EBITDA of $70.0 million to $75.0 million and $18.0 million to $20.0 million (inclusive of synergies), respectively.

"Additionally, this transaction is deleveraging for KLX and is expected to be accretive to KLX on all financial metrics," added Baker. "We expect $2.0 million to $3.0 million in annualized cost synergies within twelve months and believe this further enhances KLX's ability to effect industry consolidation as we continue to focus on increasing returns and enhancing shareholder value."

Adam Doyle, President of Greene's, said, "We believe KLX and Greene's will form a strong partnership based on a common culture focused on safety, execution, customer service and returns. We believe the combined company is better positioned to serve the Greene's customer base and support the team members with the addition of KLX's best in-class diversified offerings."

KLX's legal advisor was Vinson & Elkins LLP. Greene's legal advisor was Sidley Austin LLP. Simmons Energy, a Division of Piper Sandler, acted as Greene's financial advisors for the transaction.`,
    external_url: null,
    visible: true,
  },
  {
    id: "11",
    slug: "grp-holdco-monetizes-82-5-million-of-production-tax-credits-for-116-mw-of-biomass-projects-in-georgia",
    title: "GRP Holdco Monetizes $82.5 million of Production Tax Credits for 116 MW of Biomass Projects in Georgia",
    author_slug: "charlie-abbott",
    published_at: "2023-03-07",
    excerpt: "NEW YORK, March 7, 2023 /PRNewswire/ -- Today, GRP Holdco, LLC (\"GRP\"), the owner of two operating biomass projects (the \"Projects\") in Georgia, is pleased to announce the recent…",
    body_md: `NEW YORK, March 7, 2023 /PRNewswire/ -- Today, GRP Holdco, LLC ("GRP"), the owner of two operating biomass projects (the "Projects") in Georgia, is pleased to announce the recent closing of a $82.5 million tax equity financing from Greenprint Capital Management, LLC ("Greenprint"). The financing enables GRP to monetize production tax credits generated by the Projects through 2029.

The Projects are located in Franklin and Madison counties of Georgia and were placed into commercial operation in December 2019. Combined, they provide 116 MW of energy capacity to Georgia Power Company under 30-year power purchase agreements.

GRP is managed by Fairlead Advisors LLC ("Fairlead") and has project debt from a consortium of lenders led by an Ares Management Infrastructure Debt fund ("Ares"). GRP retained NextPower Capital to act as the financial advisor on the transaction. Latham & Watkins represented Ares, and Winthrop & Weinstine represented Greenprint, as legal counsel.

"As the manager of GRP, Fairlead is thrilled to secure a long-term commitment from Greenprint and its financing partners, and we appreciated the collaborative working relationship which resulted in an innovative financing structure to meet the needs of all participants in the transaction," said Adam Carte, Partner at Fairlead and CFO of GRP. "NextPower Capital was able to source an illiquid form of tax equity for a complicated corporate structure in much less time than expected."

"NextPower is proud to participate in the collaboration between GRP, Fairlead, and Greenprint," said David Goldman, Managing Partner at NextPower Capital. "We appreciated the opportunity to help GRP monetize its tax credits and continue to improve the economics of the Projects."

"Greenprint is focused on structuring win/win transactions for our partners and this deal was a great of example of that," said Peter DeFazio, Managing Director at Greenprint. "It was great to work with NextPower Capital on another transaction and form a new relationship with GRP and Fairlead."

**About Greenprint Capital Management**

Greenprint specializes in renewable energy tax credit acquisitions and is a market leader in tax credit underwriting and verification. Greenprint is solely dedicated to investing in climate positive solutions, providing capital to leading companies in energy efficiency, renewable energy, and other sustainable infrastructure markets. For more information, visit [greenprintcapital.com.](http://www.greenprintcapital.com/)

**About Fairlead Advisors**

Founded in 2010, Fairlead Advisors provides operating partner services to portfolio companies of private equity and venture capital investors. For PE and VC investors seeking to optimize outcomes, Fairlead is the path to success. For more information, visit fairleadadvisors.com.

**About NextPower Capital**

Founded in 2016, NextPower Capital is a clean energy investment bank focused on capital raises, M&A, and advisory services across North America. Leveraging its extensive network of capital providers, NextPower Capital specializes in structuring tax-equity and debt transactions across utility-scale, commercial, and residential projects that employ renewable energy and storage technologies. For more information, visit [nextpowercapital.com.](http://www.nextpowercapital.com/) The principals of NextPower Capital acted in their capacity of licensed securities agents of Burch & Company, Inc., member FINRA/SiPC.

CONTACT: David Goldman, dgoldman@nextpowercapital.com

SOURCE GRP Holdco, LLC`,
    external_url: null,
    visible: true,
  },
  {
    id: "12",
    slug: "lighthouse-guild-and-bionic-sight-announce-partnership-to-expand-treatment-options-for-people-who-are-blind",
    title: "Lighthouse Guild and Bionic Sight Announce Partnership to Expand Treatment Options for People Who Are Blind",
    author_slug: "adam-carte",
    published_at: "2022-11-29",
    excerpt: "Lighthouse Guild, the leading not-for-profit vision and healthcare organization, and Bionic Sight, the developer of treatments and technologies for advanced stage blindness…",
    body_md: `Lighthouse Guild, the leading not-for-profit vision and healthcare organization, and Bionic Sight, the developer of treatments and technologies for advanced stage blindness, announced today that they are entering into a partnership that will change the landscape of treatment for people who are blind.

Bionic Sight’s technology focuses on restoring sight to patients with advanced stage blindness due to retinal degenerative diseases, such as [retinitis pigmentosa](https://lighthouseguild.org/retinitis-pigmentosa/). The technology is based on discoveries by researcher and developer Sheila Nirenberg, PhD, a professor at Weill Medical College of Cornell University and the founder of Bionic Sight, who unraveled the neural code of the retina – that is, the code the retina uses to tell the brain what you’re seeing. Dr. Nirenberg has won numerous awards for this work, including a MacArthur Genius Award, and she and Bionic Sight are using it to develop a new approach for treating blindness.

“Lighthouse Guild’s mission includes both providing exceptional services today for people who are visually impaired and creating a future of unlimited potential for our clients and patients. By investing in breakthrough technologies and therapies, Lighthouse Guild can help impact the direction of medical innovation,” said Calvin W. Roberts, MD, President and CEO of Lighthouse Guild. “Retinitis pigmentosa is a common condition among our clients and the discoveries by Bionic Sight may lead to significantly improved vision for people with this eye disorder.”

“Lighthouse Guild and Bionic Sight have a shared commitment to utilizing technology to transform the lives of people who are blind or visually impaired,” said Dr. Nirenberg. “Our goals are naturally aligned. Through this partnership, we will be able to continue exploring and implementing innovative approaches and treatments.”

“Game-changing developments in eye science are breaking down barriers for people who are blind or visually impaired,” said James M. Dubin, Chairman of the Board at Lighthouse Guild. “This partnership with Bionic Sight is a mission-driven initiative that furthers our commitment to providing the most advanced services and programs.”

**About Bionic Sight**

[Bionic Sight](https://www.bionicsightllc.com./) is a biotech company that develops optogenetic gene therapy vectors and devices to treat retinal degenerative diseases. The company leverages the research of Dr. Sheila Nirenberg, the company’s founder and a professor at Weill Medical College of Cornell University. Her work focuses on neuroscience and its applications to brain/machine interfaces and computer vision. Her work on deciphering the retina’s neural code has been described in TED talks, an NBC documentary, a Bloomberg documentary, the Discovery Channel, Scientific American, as well as peer-reviewed journals and patents.

**About Lighthouse Guild**

[Lighthouse Guild](https://lighthouseguild.org/) provides exceptional services that inspire people who are visually impaired to attain their goals, offering coordinated care for eye health, vision rehabilitation, technology, and behavioral health as well as related services. The Lighthouse Guild Technology Center provides people with vision loss access to the latest assistive devices and state-of-the-art technology. The Lighthouse Guild podcast series,** “**[On Tech & Vision with Dr. Cal Roberts,](https://lighthouseguild.org/technology/on-tech-and-vision-podcast/)” offers information and insights about technological innovations that are tearing down barriers for people who are blind or visually impaired.`,
    external_url: null,
    visible: true,
  },
  {
    id: "13",
    slug: "vauban-infrastructure-partners-announces-the-signing-of-an-agreement-for-the-acquisition-of-a-leading-district-energy-platform-located-in-the-united-states",
    title: "Vauban Infrastructure Partners announces the signing of an agreement for the acquisition of a leading district energy platform located in the United States",
    author_slug: "charlie-abbott",
    published_at: "2021-12-30",
    excerpt: "Vauban Infrastructure Partners (\"Vauban\") announced today that on December 30, 2021, it entered into a definitive agreement to acquire the entire stake in DB Energy Assets, LLC…",
    body_md: `Vauban Infrastructure Partners ("Vauban") announced today that on December 30, 2021, it entered into a definitive agreement to acquire the entire stake in DB Energy Assets, LLC ("DBEA") and Beacon Energy Holdings LLC ("Detroit Thermal") (together, the "Company"), which collectively own a portfolio of eight district cooling and heating systems across the Northeast and Michigan, from Basalt Infrastructure Partners II LP ("Basalt") and DCO Energy, LLC ("DCO Energy").

The Company has an attractive portfolio of district cooling and heating systems diversified by location, technology and customers, alongside an experienced management team that will support the platform, its existing customer base and its long-term growth following closing. The Company currently operates across six states, providing reliable, sustainable, and cost-efficient sources of energy solutions to a diverse customer base including universities, urban centers, hospitals, and commercial and industrial customers.

Under Basalt's ownership, the Company enhanced its asset base and executed on a number of strategic projects and opportunities. Following the completion of the acquisition, Vauban will partner with DCO Energy who will continue to operate and maintain the facilities under a long-term contract. DCO Energy will also support the Vauban team with its carbon footprint reduction objectives and ongoing investment in the development and expansion of the facilities and asset base. DCO Energy is an industry-leading developer and operator with experience managing the facilities, as it has driven the development and/or acquisition of the facilities in the Northeast and has operated these facilities post-development or acquisition.

This acquisition will expand Vauban's global footprint to the United States and demonstrates Vauban's strong commitment to sustainability, while building upon its significant experience owning and managing district energy systems. Vauban's interest in acquiring the Company and the facilities is also driven by its commitment to support the ongoing operations of the Company and advance the Company's long-term growth, as it believes there is an opportunity to substantially expand the Company's customer base while reducing the environmental impact of the facilities over time.

The transaction will leverage Vauban's significant experience in the district energy and heating sector since 2016. Vauban currently holds controlling interests in five assets, totaling ~USD 2.2bn in enterprise value in Finland, France, Italy, Norway, and Spain. The deal echoes Vauban's strategy of building long-term relationships with industrial partners. Vauban benefited from the support of its three local Senior Advisors and experts (Leonie Maruani, Steven Klein, and Olivier Ta) with combined experience of over 60 years in the North American infrastructure market.

Gwenola Chambon, CEO and Founding Partner at Vauban Infrastructure Partners comments: "Through this landmark transaction, Vauban Infrastructure Partners enters into the U.S. district energy market. This acquisition will allow Vauban to leverage its considerable experience in the European district energy market and is an important first step for Vauban in building a sustainable, long-term platform in the United States."

Mounir Corm, Deputy CEO and Founding Partner comments: "This groundbreaking acquisition in the U.S. district energy market expands our global energy transition and district energy footprint. Vauban is delighted to strengthen its presence in district heating networks and to support their development in the United States, through a long-term collaboration with DCO Energy, which is in line with our strategy to build long-term relationships with industrial partners."

Gary Fromer, Chief Executive Officer at DCO Energy also remarked: "Over the last few years, in partnership with Basalt, we have significantly invested in and scaled our portfolio of district energy assets. We are excited by our new long-term partnership with Vauban Infrastructure Partners, and look forward to continuing to deliver reliable services to the customers, supporting the communities in which we operate, and participating in the continued development of the Company and its facilities."

David Greenblatt, Head of North America at Basalt said: "Basalt Infrastructure Partners LLC is pleased to have had the opportunity to partner with DCO Energy and the management teams at DBEA and Detroit Thermal. Their steadfast commitment to safely providing sustainable energy across our district energy customer base while executing on organic growth and follow-on acquisitions meaningfully contributed to the success of the business."

The closing of the transaction is subject to the satisfaction of customary regulatory and other approvals.

Vauban was advised by RBC Capital Markets as a financial advisor and Allen & Overy as legal advisor, as well as KPMG, Arup, PA Consulting Group, Cushman & Wakefield and Aon.

Basalt and DCO Energy were advised by TD Securities as financial advisor and Morgan Lewis & Bockius as legal advisor.

About Vauban Infrastructure Partners

Vauban Infrastructure Partners is a leading Infrastructure Asset Manager focused on the core infrastructure investments. Headquartered in Paris, it employs 56 professionals who have been working together for a decade. Vauban is the fully fledged affiliate of Natixis Investment Managers, dedicated to sustainable infrastructure equity investments. Vauban targets predominantly midmarket infrastructure assets pursuing a long-term yield-driven strategy matching the underlying nature of assets and long-term commitment to all stakeholders' interests through a strong focus on creating sustainable value. Vauban has raised c. $7.3 billion across 6 funds in core infrastructure from over 70 investors within 14 different countries and has invested in over 65 assets in mobility, energy transition, social & digital infrastructure across 11 different geographies.

[https://vauban-ip.com/](https://vauban-ip.com/)

About DCO Energy, LLC

DCO Energy, LLC is an independent developer and operator of energy assets, specializing in the development, engineering, construction, start up, commissioning, operation, maintenance and management, as well as, ownership of district energy assets, renewable energy projects and power generation facilities. DCO was formed in 2000 with a core team of energy experts.

[https://www.dcoenergy.com/](https://www.dcoenergy.com/)

About Basalt Infrastructure Partners LLC

Basalt Infrastructure Partners LLC is a leading mid-market infrastructure firm with offices in London and New York focused on equity investments in utilities, power, transport, and digital infrastructure in North America and Europe.`,
    external_url: null,
    visible: true,
  },
  {
    id: "14",
    slug: "ambri-secures-144-million-for-liquid-metal-battery-commercialization",
    title: "Ambri secures $144 million for liquid metal battery commercialization",
    author_slug: "adam-carte",
    published_at: "2021-08-10",
    excerpt: "Ambri Inc., an MIT-spinoff long-duration battery energy storage system developer, secured $144 million in funding to advance calcium-antimony liquid metal battery chemistry.",
    body_md: `Ambri Inc., an MIT-spinoff long-duration battery energy storage system developer, secured $144 million in funding to advance calcium-antimony liquid metal battery chemistry.

The investment round was led by Reliance New Energy Solar Ltd, a unit of Reliance Industries Limited; Paulson & Co. Inc., a group that includes Ambri’s largest shareholder, Bill Gates; and new investors, including Fortistar, Goehring & Rozencwajg Associates, Japan Energy Fund, and others.

The [company plans to use proceeds](https://ambri.com/) to commercialize and grow its long-duration system technology and to build manufacturing facilities, both in the U.S. and internationally.

Ambri also entered into a long-term antimony supply agreement with Perpetua Resources. The agreement helps secure a domestic source of antimony for its supply chain.

## Chemistry

The liquid metal battery is comprised of a liquid calcium alloy anode, a molten salt electrolyte, and a cathode comprised of solid particles of antimony, enabling the use of low-cost materials and a low number of steps in the cell assembly process.

The company said that the active materials in its cells reversibly alloy and de-alloy while charging and discharging. The electrolyte is thermodynamically stable with the electrodes, avoiding side reactions such as film-formation that can lead to performance degradation. The negative electrode is fully consumed when discharged, and reformed on every cycle, resulting in what the company said is a “highly repeatable process with no memory effect.”

Ambri’s chemistry is being developed to meet the demands of large industrial energy customers, such as data centers. Late last year, Ambri agreed with TerraScale, a clean infrastructure design and development firm, to deliver 250 MWh of Ambri systems to TerraScale’s Energos Reno data center project. The site’s battery will be bolstered by a reported 500 MW of on-site renewable generation.

Ambri said that following the funding round it now is able to scale for projects from 10 MWh to over 2 GWh around the globe, with durations ranging from 4 to 24 hours.`,
    external_url: null,
    visible: true,
  },
  {
    id: "15",
    slug: "fairlead-advises-greenleaf-power-on-36-7m-renewable-project-financing",
    title: "Fairlead advises Greenleaf Power on $36.7M renewable project financing",
    author_slug: "renee-sass",
    published_at: "2021-06-14",
    excerpt: "Greenleaf Power Consolidated LLC (Greenleaf), backed by Denham Capital, has secured USD36.7 million in project financing from East West Bank through its wholly-owned subsidiary…",
    body_md: `Greenleaf Power Consolidated LLC (Greenleaf), backed by Denham Capital, has [secured USD36.7 million in project](https://www.privateequitywire.co.uk/2021/06/08/301555/greenleaf-power-secures-usd367m-financing-east-west-bank) financing from East West Bank through its wholly-owned subsidiary Greenleaf Biomass Holdings LLC. This transaction marks one of the largest biomass power project financings in recent North American history.`,
    external_url: "https://www.privateequitywire.co.uk/2021/06/08/301555/greenleaf-power-secures-usd367m-financing-east-west-bank",
    visible: true,
  },
  {
    id: "16",
    slug: "bentley-systems-announces-acquisition-of-sensemetrics",
    title: "Bentley Systems Announces Acquisition of sensemetrics",
    author_slug: "renee-sass",
    published_at: "2021-04-29",
    excerpt: "EXTON, Pa.--(BUSINESS WIRE)--Bentley Systems, Incorporated (Nasdaq: BSY), the infrastructure engineering software company, today announced its acquisitions of sensemetrics…",
    body_md: `EXTON, Pa.--([BUSINESS WIRE](https://www.businesswire.com/))--Bentley Systems, Incorporated (Nasdaq: BSY), the *infrastructure engineering software* company, today announced its acquisitions of sensemetrics (agreement executed) and Vista Data Vision (closed), leading providers of software for Internet of Things (IoT) applications used extensively in infrastructure. sensemetrics and Vista Data Vision will expand the scope of the Bentley iTwin platform to add intrinsic IoT capabilities for infrastructure digital twins to incorporate real-time sensor data. By virtue of the resulting “infrastructure IoT” standardization, the full IoT ecosystem will finally be seamlessly accessible for IT/OT/ET integration, through infrastructure digital twins, to advance asset performance and to mitigate environmental risks.`,
    external_url: null,
    visible: true,
  },
  {
    id: "17",
    slug: "bionic-sight-enters-into-collaboration-agreement",
    title: "Bionic Sight enters into Collaboration Agreement",
    author_slug: "adam-carte",
    published_at: "2020-08-18",
    excerpt: "Bionic Sight LLC, a client of Fairlead Advisors, has entered into a strategic collaboration with Applied Genetic Technologies Corporation (Nasdaq:AGTC).",
    body_md: `Bionic Sight LLC, a client of Fairlead Advisors, has entered into a strategic collaboration with Applied Genetic Technologies Corporation (Nasdaq:AGTC).

Fairlead supported Bionic Sight during the negotiation process.`,
    external_url: null,
    visible: true,
  },
  {
    id: "18",
    slug: "veolia-completes-the-sale-of-its-district-energy-assets-in-the-united-states-for-usd-1-25-billion-to-antin-infrastructure-partners",
    title: "Veolia Completes the Sale of Its District Energy Assets in the United States for USD 1.25 Billion to Antin Infrastructure Partners",
    author_slug: "charlie-abbott",
    published_at: "2019-08-19",
    excerpt: "Veolia (Paris:VIE) regularly reviews its asset portfolio in the light of its strategy and development plan. This review reinforces the capacity and flexibility of the Group to…",
    body_md: `**Veolia (Paris:VIE) regularly reviews its asset portfolio in the light of its strategy and development plan. This review reinforces the capacity and flexibility of the Group to position itself on the best growth opportunities, where Veolia can bring the most added value, and in coherence with the next strategic plan to be presented early 2020. It is within this framework that Veolia, through its subsidiary Veolia Energy North America Holdings, Inc, has finalized today the sale of its district energy assets in the United States to Antin Infrastructure Partners.**

The portfolio comprises steam, hot and chilled water and electricity production plants, including cogeneration, and 13 networks in 10 US cities. An investment fund dedicated to infrastructure, Antin Infrastructure Partners has invested over 7 billion euros in 24 companies in 12 years of existence. Antin Infrastructure Partners is notably the owner since 2018 of Idex, which operates around 40 heating and cooling networks in France.

Veolia group is the global leader in optimized resource management. With over 171,000 employees worldwide, the Group designs and provides water, waste and energy management solutions which contribute to the sustainable development of communities and industries. Through its three complementary business activities, Veolia helps to develop access to resources, preserve available resources, and to replenish them. In 2018, the Veolia group supplied 95 million people with drinking water and 63 million people with wastewater service, produced nearly 56 million megawatt hours of energy and converted 49 million metric tons of waste into new materials and energy. Veolia Environnement (listed on Paris Euronext: VIE) recorded consolidated revenue of €25.91 billion in 2018 (USD 30.6 billion).

Visit www.veolia.com to learn more`,
    external_url: null,
    visible: true,
  },
  {
    id: "19",
    slug: "luminoso-secures-10-million-in-series-b-financing-led-by-dvi-equity-partners",
    title: "Luminoso Secures $10 Million in Series B Financing Led By DVI Equity Partners",
    author_slug: "adam-carte",
    published_at: "2018-12-06",
    excerpt: "Luminoso, the natural language company that provides AI-powered customer insights, today announced the closing of a $10 million Series B funding round led by DVI Equity Partners.…",
    body_md: `DECEMBER 06, 2018

Luminoso, the natural language company that provides AI-powered customer insights, today announced the closing of a $10 million Series B funding round led by DVI Equity Partners. Also joining the round are Liberty Global Ventures, DF Enterprises, Raptor Holdco, Acadia Woods Partners, and Accord Ventures, among others, many of whom participated in Luminoso’s previous rounds of funding totaling over $20 million. Luminoso will use the proceeds to expand and scale its team as its customer base continues to grow internationally.

Luminoso's artificial intelligence and natural language technologies have fundamentally changed how its clients automate the processing of unstructured data. Luminoso’s clients now find insights in minutes, not months, by replacing the otherwise time-consuming process of manually reading open-ended feedback from customers and employees without requiring massive amounts of data or armies of human consultants.

"We believe Luminoso's approach to machine learning leads a dramatic shift in how companies directly incorporate feedback from customers and employees into their sales, marketing, and product efforts," said DVI managing partner Robert Griffin, who joins Luminoso’s board of directors. "We’re looking forward to helping Luminoso further accelerate its growth with our knowledge and experience in the artificial intelligence and data analysis space."

Clients using Luminoso products have reported tangible advantages such as:

- Deflecting 50% of incoming support tickets to automated responses and self-help articles
- Finishing Voice of the Customer analyses in minutes rather than weeks of less accurate, manual processing
- Reducing response times to Customer Experience queries from executive teams from one month to one hour
- Processing Voice of the Employee surveys for over 500,000 employees across ten languages
- Identifying critical customer-reported defects within minutes instead of days

"Our investors' show of confidence reinforces how Luminoso's value proposition, realizing increased sales and operating savings in days instead of months, is a game changer for how organizations discover insights from feedback," said Adam Carte, CEO of Luminoso. "We're eager to work with DVI Equity Partners and our other investors to further grow our customer base as we expand our North American operations and penetrate further into the European, Japan, and Asia-Pacific regions."

Please direct questions to press(at)luminoso.com or 617-682-9056.

About DVI Equity Partners
DVI Equity Partners, LLC has a singular mission of investing in early stage, emerging technology companies specializing in disruptive technology with an emphasis on companies founded and led by women and minorities. The firm evaluates emerging technology companies that create business-to-business (B2B) value in areas including national security, enterprise software, artificial intelligence, and data storage and analysis. DVI shares expertise, resource and forms relationships with entrepreneurs to help them transform the way industries and the public sectors conduct business. Visit [http://www.dviequitypartners.com](http://www.dviequitypartners.com/) for additional information.

About Luminoso
Luminoso Technologies is a leading artificial intelligence (AI) and natural language understanding (NLU) company that enables companies to rapidly discover insights in their unstructured data. Luminoso’s award-winning software applies AI to accurately analyze text-based data, for any industry, without lengthy setup time or training. Luminoso can analyze unstructured data natively in 14 languages, including Chinese, Korean, Japanese, and Arabic. Companies use the insights that Luminoso’s solutions uncover to streamline their contact center processes, monitor brand perception, and optimize the customer experience. The company is privately held and headquartered in Cambridge, MA.

For more information, visit [http://www.luminoso.com](http://www.luminoso.com/)`,
    external_url: null,
    visible: true,
  },
  {
    id: "20",
    slug: "novus-energy-sells-biomass-plant-to-wrz-horger",
    title: "Novus Energy sells biomass plant to WRZ Hörger",
    author_slug: "adam-carte",
    published_at: "2016-12-06",
    excerpt: "An affiliate of Novus Energy GmbH, a client of Fairlead Advisors, sold its CHP biomass plant in Herbrechtingen, Baden-Württemberg, to the local waste disposal company WRZ Hörger…",
    body_md: `An affiliate of Novus Energy GmbH, a client of Fairlead Advisors, sold its CHP biomass plant in Herbrechtingen, Baden-Württemberg, to the local waste disposal company WRZ Hörger from Sontheim, Germany. The transaction was closed on December 6, 2016. The parties agreed to keep the purchase price confidential.

The sale of the plant is part of Novus Energy’s successful exit from the German bio energy market.`,
    external_url: null,
    visible: true,
  },
  {
    id: "21",
    slug: "ford-targets-fully-autonomous-vehicle-for-ride-sharing-in-2021-invests-in-new-tech-companies-double-silicon-valley-team",
    title: "Ford Targets Fully Autonomous Vehicle for Ride Sharing in 2021; Invests in New Tech Companies, Doubles Silicon Valley Team",
    author_slug: "adam-carte",
    published_at: "2016-08-16",
    excerpt: "PALO ALTO, Calif., Aug. 16, 2016 – Ford today announces its intent to have a high-volume, fully autonomous SAE level 4-capable vehicle in commercial operation in 2021 in a…",
    body_md: `**PALO ALTO, Calif., Aug. 16, 2016** – Ford today announces its intent to have a high-volume, fully autonomous SAE level 4-capable vehicle in commercial operation in 2021 in a ride-hailing or ride-sharing service.

To get there, the company is investing in or collaborating with four startups to enhance its autonomous vehicle development, doubling its Silicon Valley team and more than doubling its Palo Alto campus.

“The next decade will be defined by automation of the automobile, and we see autonomous vehicles as having as significant an impact on society as Ford’s moving assembly line did 100 years ago,” said Mark Fields, Ford president and CEO. “We’re dedicated to putting on the road an autonomous vehicle that can improve safety and solve social and environmental challenges for millions of people – not just those who can afford luxury vehicles.”

Autonomous vehicles in 2021 are part of Ford Smart Mobility, the company’s plan to be a leader in autonomous vehicles, as well as in connectivity, mobility, the customer experience, and data and analytics.

**Driving autonomous vehicle leadership**

Building on more than a decade of autonomous vehicle research and development, Ford’s first fully autonomous vehicle will be a [Society of Automotive Engineers-defined level 4-capable vehicle](http://www.sae.org/misc/pdfs/automated_driving.pdf). Plans are to design it to operate without a steering wheel, gas or brake pedal, for use in commercial mobility services such as ride sharing and ride hailing within geo-fenced areas and be available in high volumes.

“Ford has been developing and testing autonomous vehicles for more than 10 years,” said Raj Nair, Ford executive vice president, Global Product Development, and chief technical officer. “We have a strategic advantage because of our ability to combine the software and sensing technology with the sophisticated engineering necessary to manufacture high-quality vehicles. That is what it takes to make autonomous vehicles a reality for millions of people around the world.”

This year, Ford will triple its autonomous vehicle test fleet to be the largest test fleet of any automaker – bringing the number to about 30 self-driving Fusion Hybrid sedans on the roads in California, Arizona and Michigan, with plans to triple it again next year.

Ford was the [first automaker to begin testing its vehicles at Mcity](https://media.ford.com/content/fordmedia/fna/us/en/news/2015/11/13/ford-first-automaker-to-test-autonomous-vehicle-at-mcity.html), University of Michigan’s simulated urban environment, the [first automaker to publicly demonstrate autonomous vehicle operation in the snow](https://media.ford.com/content/fordmedia/fna/us/en/news/2016/03/10/how-fusion-hybrid-autonomous-vehicle-can-navigate-in-winter.html) and [the first automaker to test its autonomous research vehicles at night](https://media.ford.com/content/fordmedia/fna/us/en/news/2016/04/11/no-lights--no-problem--ford-fusion-autonomous-research-vehicles-.html), in complete darkness, as part of LiDAR sensor development.

To deliver an autonomous vehicle in 2021, Ford is announcing four key investments and collaborations that are expanding its strong research in advanced algorithms, 3D mapping, LiDAR, and radar and camera sensors:

-** Velodyne:** Ford has invested in Velodyne, the Silicon Valley-based leader in light detection and ranging (LiDAR) sensors. The aim is to quickly mass-produce a more affordable automotive LiDAR sensor. Ford has a longstanding relationship with Velodyne, and was among the first to use LiDAR for both high-resolution mapping and autonomous driving beginning more than 10 years ago
-** SAIPS:** Ford has acquired the Israel-based computer vision and machine learning company to further strengthen its expertise in artificial intelligence and enhance computer vision. SAIPS has developed algorithmic solutions in image and video processing, deep learning, signal processing and classification. This expertise will help Ford autonomous vehicles learn and adapt to the surroundings of their environment
-** Nirenberg Neuroscience LLC:** Ford has an exclusive licensing agreement with Nirenberg Neuroscience, a machine vision company founded by neuroscientist Dr. Sheila Nirenberg, who cracked the neural code the eye uses to transmit visual information to the brain. This has led to a powerful machine vision platform for performing navigation, object recognition, facial recognition and other functions, with many potential applications. For example, it is already being applied by Dr. Nirenberg to develop a device for restoring sight to patients with degenerative diseases of the retina. Ford’s partnership with Nirenberg Neuroscience will help bring humanlike intelligence to the machine learning modules of its autonomous vehicle virtual driver system
-** Civil Maps:** Ford has invested in Berkeley, California-based Civil Maps to further develop high-resolution 3D mapping capabilities. Civil Maps has pioneered an innovative 3D mapping technique that is scalable and more efficient than existing processes. This provides Ford another way to develop high-resolution 3D maps of autonomous vehicle environments

**Silicon Valley expansion**

Ford also is expanding its Silicon Valley operations, creating a dedicated campus in Palo Alto.

Adding two new buildings and 150,000 square feet of work and lab space adjacent to the current Research and Innovation Center, the expanded campus grows the company’s local footprint and supports plans to double the size of the Palo Alto team by the end of 2017.

“Our presence in Silicon Valley has been integral to accelerating our learning and deliverables driving Ford Smart Mobility,” said Ken Washington, Ford vice president, Research and Advanced Engineering. “Our goal was to become a member of the community. Today, we are actively working with more than 40 startups, and have developed a strong collaboration with many incubators, allowing us to accelerate development of technologies and services.”

Since the new [Ford Research and Innovation Center Palo Alto opened in January 2015](https://media.ford.com/content/fordmedia/fna/us/en/news/2015/01/22/research-and-innovation-center-palo-alto.html), the facility has rapidly grown to be one of the largest automotive manufacturer research centers in the region. Today, it is home to more than 130 researchers, engineers and scientists, who are increasing Ford’s collaboration with the Silicon Valley ecosystem.

Research and Innovation Center Palo Alto’s multi-disciplinary research and innovation facility is the newest of nearly a dozen of Ford’s global research, innovation, IT and engineering centers. The expanded Palo Alto campus opens in mid-2017.

### About Ford Motor Company

*Ford Motor Company (NYSE: F) is a global company based in Dearborn, Michigan, that is committed to helping build a better world, where every person is free to move and pursue their dreams. The company’s Ford+ plan for growth and value creation combines existing strengths, new capabilities and always-on relationships with customers to enrich experiences for and deepen the loyalty of those customers. Ford develops and delivers innovative, must-have Ford trucks, sport utility vehicles, commercial vans and cars and Lincoln luxury vehicles, as well as connected services. Additionally, Ford is establishing leadership positions in mobility solutions, including self-driving technology, and provides financial services through Ford Motor Credit Company. Ford employs about 176,000 people worldwide. More information about the company, its products and Ford Credit is available at corporate.ford.com.*

### Risk Factors

This news release and the related presentations contain forward-looking statements. These statements are based on Ford’s current expectations for future events. There are risks, uncertainties, and other factors that could cause actual results to differ materially from those stated, including: lower-than-anticipated market acceptance of new or existing products or services; discovery of defects in vehicles resulting in delays in new model launches, recall campaigns or increased warranty costs; increased regulations; and cybersecurity risks. For additional information about these risks, see Ford’s 2015 Form 10-K report, as updated by Ford’s Form 10-Q and Form 8-K reports.`,
    external_url: null,
    visible: true,
  },
  {
    id: "22",
    slug: "k-a-care-speeds-up-work-on-clean-energy-strategy",
    title: "K.A.CARE speeds up work on ‘clean energy’ strategy",
    author_slug: "charlie-abbott",
    published_at: "2015-07-08",
    excerpt: "RIYADH: The King Abdullah City for Atomic and Renewable Energy (K.A.CARE) is working closely with the Ministry of Transportation, the Saudi Electricity Company (SEC), the Saudi…",
    body_md: `RIYADH: The King Abdullah City for Atomic and Renewable Energy (K.A.CARE) is working closely with the Ministry of Transportation, the Saudi Electricity Company (SEC), the Saudi Wildlife Authority (SWA) and the Director-General of Military Surveying to speed up work on the creation of a blueprint for the Kingdom’s renewable energy strategy.

Its vision to be achieved by 2032 aims to replace 50 percent of the dependence on traditional fossil fuels with eco-friendly atomic and renewable energy.
The project, entitled “Atlas of the Sources of Renewable Energy in Saudi Arabia”, is set to be a landmark program implemented by K.A.CARE in coordination with government agencies and local and international experts.
The move aims to attract local and foreign investments in the field of renewable energy by harnessing the potential that abounds in the Kingdom in the fields of solar, thermal and wind energy.
The ambitious project seeks to create a profile for the future of clean energy in the Kingdom and will provide technical data and information regarding renewable energy sources in various regions of the Kingdom.
“K.A.CARE works very closely with various government agencies such as the ministry of transportation, SEC, SWA and the directorate-general of military survey with the prime objective being to create atlas-generated information and data,” an official at the K.A.CARE media department said recently.
The Atlas Team is currently working with key partners from the Kingdom and outside the country to provide additional information about airports, dams, water-wells, waste management and volcanic areas, the media department noted.
“Atlas is particularly important as it provides valuable assistance to the government agencies and decision-makers in drawing up their policies and implementing regulations which will be extremely helpful to them when implementing renewable energy projects throughout the Kingdom,” an official said.`,
    external_url: null,
    visible: true,
  },
  {
    id: "23",
    slug: "u-s-silica-to-acquire-regional-frac-sand-producer-cadre-services-inc-for-98-million",
    title: "U.S. Silica to Acquire Regional Frac Sand Producer Cadre Services Inc. for $98 million",
    author_slug: "adam-carte",
    published_at: "2014-07-16",
    excerpt: "FREDERICK, Md., July 16, 2014– U.S. Silica Holdings, Inc. (NYSE: SLCA) today announced that it has signed a stock purchase agreement to acquire all of the outstanding shares of…",
    body_md: `FREDERICK, Md., July 16, 2014– U.S. Silica Holdings, Inc. (NYSE: SLCA) today announced that it has signed a stock purchase agreement to acquire all of the outstanding shares of Cadre Services Inc., a leading regional sand mining Company based in Voca, Texas, for approximately $98 million in cash. Closing is expected by the end of the month.Cadre operates a single frac sand mine and plant, with recently expanded annual capacity of about 800,000 tons per year of Premium Hickory® sand. The fully-automated, state-of-the-art facility, which became operational in 2011, has more than 65 years of high-quality reserves. Because of Cadre’s regional location, they serve customers in the fast growing Permian Basin on both a contract and a spot basis, with about 40 percent of revenue derived from customers under take-or-pay contracts.Bryan Shinn, president and chief executive officer of U.S. Silica said, “This accretive acquisition aligns with our strategy to increase market share by expanding our footprint and product offerings in one of the fastest growing basins in the country. The addition of the Cadre team and their outstanding operational and logistics capabilities allows us to provide our customers with a high quality, regionally-produced product which effectively meets the demands of many Permian oil and gas wells.”The purchase price of $98 million, less the net present value of approximately $14 million in deferred tax assets, results in $84 million of net consideration. Adjusted LTM EBITDA of $11.1 million represents a purchase price multiple of 7.6 times. Projected 2015 Adjusted EBITDA of approximately $18 million after synergies and the benefit of a full year of sales from the March capacity expansion represents a purchase price multiple of 4.7 times. This would result in Adjusted EPS accretion of $0.11 to $0.13 per share in 2015.

A conference call to discuss the strategic benefits of the transaction with investors will be held tomorrow, July 17 at 9:00 a.m. Eastern Time. Hosting the call will be Bryan Shinn, president and chief executive officer. Investors are invited to listen to a live webcast of the call by visiting the “Investor Resources” section of the Company’s website at [www.ussilica.com](http://www.ussilica.com). The call can also be accessed live over the telephone by dialing (855) 325‑2605 or (970) 315‑0758 for international callers. The conference passcode is 74171980. A presentation on the acquisition will be available tomorrow morning on the Company’s website.

### Forward-looking Statements

Certain statements in this press release are “forward-looking statements” made pursuant to the safe harbor provisions of the Private Securities Litigation Reform Act of 1995 and speak only as of this date. Forward-looking statements made include any statement that does not directly relate to any historical or current fact and may include, but are not limited to, statements regarding U.S. Silica’s growth opportunities, strategy, future financial results, forecasts, projections, plans and capital expenditures, and the commercial silica industry. Forward-looking statements are based on our current expectations and assumptions, which may not prove to be accurate. These statements are not guarantees and are subject to risks, uncertainties and changes in circumstances that are difficult to predict. Many factors could cause actual results to differ materially and adversely from these forward-looking statements. Among these factors are: (1) fluctuations in demand for commercial silica; (2) the cyclical nature of our customers’ businesses; (3) operating risks that are beyond our control; (4) federal, state and local legislative and regulatory initiatives relating to hydraulic fracturing; (5) our ability to implement our capacity expansion plans within our current timetable and budget; (6) loss of, or reduction in, business from our largest customers; (7) increasing costs or a lack of dependability or availability of transportation services or infrastructure; (8) our substantial indebtedness and pension obligations; (9) our ability to attract and retain key personnel; (10) silica-related health issues and corresponding litigation; (11) seasonal and severe weather conditions; and (12) extensive and evolving environmental, mining, health and safety, licensing, reclamation and other regulation (and changes in their enforcement or interpretation). Additional information concerning these and other factors can be found in U.S. Silica’s filings with the Securities and Exchange Commission. We undertake no obligation to publicly update or revise any forward-looking statement as a result of new information, future events or otherwise, except as otherwise required by law.

### Adjusted EBITDA and Adjusted EPS

Adjusted EBITDA and Adjusted EPS are not measures of our financial performance or liquidity under GAAP and should not be considered as an alternative to net income as a measure of operating performance, cash flows from operating activities as a measure of liquidity or any other performance measure derived in accordance with GAAP. Additionally, these measures are not intended to be measures of free cash flow for management’s discretionary use, as they do not consider certain cash requirements such as interest payments, tax payments and debt service requirements. These measures contain certain other limitations, including the failure to reflect our cash expenditures, cash requirements for working capital needs and cash costs to replace assets being depreciated and amortized, and excludes certain non-recurring charges that may recur in the future. Management compensates for these limitations by relying primarily on our GAAP results and by using these measures only supplementally. Our measures of Adjusted EBITDA and Adjusted EPS are not necessarily comparable to other similarly titled captions of other companies due to potential inconsistencies in the methods of calculation. We are unable to reconcile our projections to the comparable GAAP measures because we do not predict the future impact of adjustments due to the difficulty of doing so.

### About U.S. Silica

U.S. Silica Holdings, Inc., a member of the Russell 2000, is one of the largest domestic producers of commercial silica, a specialized mineral that is a critical input into the oil and gas proppants end market. The company also processes ground and unground silica sand for a variety of industrial and specialty products end markets such as glass, fiberglass, foundry molds, municipal filtration and recreational uses. During its 100-plus year history, U.S. Silica Holdings, Inc. has developed core competencies in mining, processing, logistics and materials science that enable it to produce and cost-effectively deliver over 250 products to customers across these end markets. U.S. Silica Holdings, Inc. is headquartered in Frederick, Md.

### About Cadre Services

Headquartered in Houston Texas, Cadre Services is a major supplier of API/ISO-quality Premium Hickory® Sand to the oil and gas industry. Cadre produces four products: Cadre 16/30, Cadre 20/40, Cadre 30/50 and Cadre 40/70. With principal operations located in Voca, Texas, Cadre was recognized as the 2012 Outstanding Large Business in McCulloch County and was identified as one of the Houston Top 100 by the Houston Business Journal. For more information, visit [http://www.CadreProppants.com](http://www.CadreProppants.com).`,
    external_url: null,
    visible: true,
  },
  {
    id: "24",
    slug: "tpg-leads-equity-portion-of-110m-financing-for-vitag",
    title: "TPG Leads Equity Portion of $110M Financing for VitAg",
    author_slug: "renee-sass",
    published_at: "2014-07-14",
    excerpt: "Specialty fertilizer company VitAg Corp. said it has received equity and debt financing of more than $110 million, including an investment from TPG Capital.",
    body_md: `Specialty fertilizer company VitAg Corp. said it has received equity and debt financing of more than $110 million, including an investment from TPG Capital.

TPG Alternative and Renewable Technologies is leading the equity portion of the financing, with additional commitments from iron micronutrient producer Agro-Iron and industrial chemical supplier Shrieve Chemical. Beech Island, S.C.-based VitAg has also secured a $64 million offering of 22-year tax-exempt bonds led by Citigroup Global Markets through the Orange County Industrial Finance Authority, as well as a credit facility from an affiliate of Tennenbaum Capital Partners.

VitAg plans to use proceeds from the financing in part to construct a biosolids-to-fertilizer facility in Zellwood, Fla. The site is expected to produce slow-release, organically enhanced premium fertilizer, which will be produced by combining biosolids, sulfuric acid and ammonia.

TPG ART, a unit of Fort Worth, Texas-based firm TPG Capital, focuses on investments in companies that develop and deploy alternative and renewable technologies.

[http://www.tpgart.com](http://www.tpgart.com/)`,
    external_url: null,
    visible: true,
  },
  {
    id: "25",
    slug: "kemet-completes-acquisition-of-niotan-incorporated",
    title: "KEMET Completes Acquisition of Niotan Incorporated",
    author_slug: "adam-carte",
    published_at: "2012-02-21",
    excerpt: "GREENVILLE, S.C., Feb. 21, 2012 KEMET Corporation (NYSE: KEM), a leading manufacturer of tantalum, ceramic, aluminum, film, paper and electrolytic capacitors, announced today that…",
    body_md: `GREENVILLE, S.C., Feb. 21, 2012 KEMET Corporation (NYSE: KEM), a leading manufacturer of tantalum, ceramic, aluminum, film, paper and electrolytic capacitors, announced today that it has completed its acquisition of all of the outstanding shares of Niotan Incorporated ("Niotan"), a leading manufacturer of tantalum powders, from an affiliate of Denham Capital Management LP.

As previously announced, KEMET paid an initial purchase price of $30 million at the closing of the transaction, and will make additional deferred payments of $45 million over a thirty month period after the closing. KEMET will also be required to make quarterly royalty payments for tantalum powder produced by Niotan after the closing of the transaction, in an aggregate amount equal to $10 million by December 31, 2014.

This new KEMET subsidiary, which will be named KEMET Blue Powder Corp., has its headquarters and principle operating location in Carson City, Nevada. KEMET Blue Powder Corp. is the largest western hemisphere production location for tantalum capacitor powder and has demonstrated world- class powder quality which has resulted in exceptionally high level qualification with the world's capacitor manufacturers.

About KEMET

KEMET's common stock is listed on the NYSE under the symbol "KEM." At the Investor Relations section of our web site at http://www.KEMET.com/IR, users may subscribe to KEMET news releases and find additional information about our Company. KEMET applies world class service and quality to deliver industry leading, high performance capacitance solutions to its customers around the world and offers the world's most complete line of surface mount and through-hole capacitor technologies across tantalum, ceramic, film, aluminum, electrolytic, and paper dielectrics. Additional information about KEMET can be found at http://www.kemet.com.

Cautionary Statement on Forward-Looking Statements

Certain statements included herein contain forward-looking statements within the meaning of federal securities laws about KEMET Corporation's (the "Company") financial condition and results of operations that are based on management's current expectations, estimates and projections about the markets in which the Company operates, as well as management's beliefs and assumptions. Words such as "expects," "anticipates," "believes," "estimates," variations of such words and other similar expressions are intended to identify such forward-looking statements. These statements are not guarantees of future performance and involve certain risks, uncertainties and assumptions, which are difficult to predict. Therefore, actual outcomes and results may differ materially from what is expressed or forecasted in, or implied by, such forward-looking statements. Readers are cautioned not to place undue reliance on these forward-looking statements, which reflect management's judgment only as of the date hereof. The Company undertakes no obligation to update publicly any of these forward-looking statements to reflect new information, future events or otherwise.

Factors that may cause actual outcome and results to differ materially from those expressed in, or implied by, these forward-looking statements include, but are not necessarily limited to the following: (i) adverse economic conditions could impact the Company's ability to realize operating plans if the demand for the Company's products declines, and such conditions could adversely affect the Company's liquidity and ability to continue to operate; (ii) adverse economic conditions could cause further reevaluation and the write down of long-lived assets; (iii) an increase in the cost or a decrease in the availability of the Company's principal raw materials; (iv) changes in the competitive environment of the Company; (v) uncertainty of the timing of customer product qualifications in heavily regulated industries; (vi) economic, political, or regulatory changes in the countries in which the Company operates; (vii) difficulties, delays or unexpected costs in completing the Company's restructuring plan; (viii) the inability to attract, train and retain effective employees and management; (ix) the inability to develop innovative products to maintain customer relationships and offset potential price erosion in older products; (x) exposure to claims alleging product defects; (xi) the impact of laws and regulations that apply to the Company's business, including those relating to environmental matters; (xii) volatility of financial and credit markets affecting the Company's access to capital; (xiii) the need to reduce the total costs of the Company's products to remain competitive; (xiv) potential limitation on the use of net operating losses to offset possible future taxable income; (xv) restrictions in the Company's debt agreements that limit the Company's flexibility in operating its business; and (xvi) additional exercise of the warrant by K Equity, LLC which could potentially result in the existence of a significant stockholder who could seek to influence our corporate decisions. Other risks and uncertainties may be described from time to time in the Company's other reports and filings with the Securities and Exchange Commission.`,
    external_url: null,
    visible: true,
  },
  {
    id: "26",
    slug: "constellation-energy-purchases-mxenergy",
    title: "Constellation Energy Purchases MXenergy",
    author_slug: "charlie-abbott",
    published_at: "2011-05-12",
    excerpt: "MXenergy, one of the nation's leading suppliers of natural gas and electricity to homeowners and small businesses, announced today it has reached an agreement to be acquired by…",
    body_md: `MXenergy, one of the nation's leading suppliers of natural gas and electricity to homeowners and small businesses, announced today it has reached an agreement to be acquired by Constellation Energy (NYSE: [CEG](https://www.prnewswire.com/news-releases/constellation-energy-purchases-mxenergy-121725878.html#financial-modal)). Constellation, a major Baltimore-based energy company with over 12,000 megawatts of electric generating capacity and a large wholesale marketing business, will purchase MXenergy in an all-cash transaction. The Board of Directors of MXenergy and key shareholders Denham Capital Management LP, Charterhouse Group LLC and Sempra Energy Trading LLC are fully supportive of the transaction.

"I am excited and energized by the combination of these two great companies," said Jeffrey Mayer, President and CEO of MXenergy. "For over 12 years MXenergy has provided customers with competitive rates and superb customer service, and Constellation is determined to offer customers the same value propositions," he said.

Subject to shareholder and regulatory approvals, Constellation will purchase 100% of the equity of MXenergy, which is currently owned by a number of large institutional investors and others. Denham and Charterhouse each provided substantial support to MXenergy in its early years.

The total base purchase price of the transaction is $175 million. Shareholders can expect to receive between $3.00 and $3.28 per share in cash at closing, currently expected to occur early in the third calendar quarter. Additional payments of up to $.91 per share may be paid to shareholders upon settlement of customary escrow holdbacks, aggregating to total potential cash consideration of up to $4.21 per share. The final price per share will be subject to a number of factors, including final working capital balances and the amount escrowed contingency reserves ultimately released.

In connection with the merger, MXenergy has agreed to pay in full all amounts owed on outstanding Floating Rate Notes due 2011 and will redeem any and all outstanding 13.25% Senior Subordinated Notes due 2014 at a redemption price of 106.625% plus accrued interest. In addition, MXenergy, Constellation and Sempra Energy Trading entered into a termination agreement under which MXenergy agreed, subject to the closing of the merger, to pay just over $16 million in exchange for its Class B and Class C shares in MXenergy as well as the termination of outstanding hedge agreements. Sempra Energy Trading has provided supplier finance to pay MXenergy since 2009 and voted in favor of the merger.

Constellation has announced its intention to expand its mass market customer base to 1 million by the end of 2011. Until now the company has offered electric choice to residential customers in Maryland, Washington, D.C. and parts of New Jersey and Illinois. The MXenergy acquisition will add over 500,000 customers in some 15 states and two provinces of Canada.

"MXenergy provides us with a broad platform that supplements our growing retail business, particularly in the residential market, at a time when customers are choosing energy suppliers in significant numbers," said Mark Huston, head of Constellation's retail business.

The definitive agreement was signed today by MXenergy and Constellation, and the transaction is expected to close in the third quarter, provided all necessary approvals have been received.

"In merging with MXenergy, Constellation demonstrates its continuing commitment to the retail energy business," said Chaitu Parikh, Executive Vice President of MXenergy who will assume the role of head of MXenergy on the closing date of the merger. "Already a major supplier to large commercial and industrial customers, Constellation sees MXenergy and its proven national platform as an important vehicle for growth of its residential and small to mid-market commercial supply business. This is very exciting news and a huge compliment to the business we have built to date."

Founded in 1999, MXenergy has supplemented its retail energy sales products with offerings of renewable energy products, carbon offsets, and environmental educational programming through the creation of MXenergy TV, an On Demand cable channel designed to educate and inform on the issues of sustainability and green living.

Constellation shares MXenergy's commitment to environmental stewardship and a clean energy future by delivering innovative energy solutions that help customers control energy use, reduce greenhouse gas emissions and utilize sources of renewable energy.

BofA Merrill Lynch acted as financial adviser to MXenergy on the transaction as well as on the replacement and termination of the Sempra Energy Trading supply facility, and Duff & Phelps delivered a fairness opinion to the MXenergy Board of Directors.

**About MXenergy**

MXenergy is one of the fastest growing retail natural gas and electricity suppliers in North America, serving approximately 500,000 customers in 41 utility territories in the United States and Canada. For over 11 years, the company has provided millions of customers with a choice in how they purchase energy to run their homes and businesses. Founded in 1999 to provide natural gas and electricity to consumers in deregulated energy markets, helps residential customers and small business owners control their energy bills by providing both fixed and variable rate plans. MXenergy is committed to best practices in environmental conservation, supporting local communities through various outreach programs and is a member of the Chicago Climate Exchange. For more information, please visit [www.MXenergy.com](http://www.mxenergy.com/).

**About Constellation Energy**

Constellation Energy is a leading competitive supplier of power, natural gas and energy products and services for homes and businesses across the continental United States. It owns a diversified fleet of generating units, totaling approximately 12,000 megawatts of generating capacity, and is a leading advocate for clean, environmentally sustainable energy sources, such as solar power and nuclear energy. The company delivers electricity and natural gas through the Baltimore Gas and Electric Company (BGE), its regulated utility in Central Maryland. A FORTUNE 500 company headquartered in Baltimore, Constellation Energy had revenues of $14.3 billion in 2010.`,
    external_url: "https://www.prnewswire.com/news-releases/constellation-energy-purchases-mxenergy-121725878.html",
    visible: true,
  },
  {
    id: "27",
    slug: "detroit-thermal-attracts-50-million-for-energy-system",
    title: "Detroit Thermal Attracts $50 Million For Energy System",
    author_slug: "charlie-abbott",
    published_at: "2010-11-16",
    excerpt: "A coalition of Detroit business, labor and government groups Tuesday announced a $50 million investment in Detroit they said would isure a long-term, cost-effective and…",
    body_md: `A coalition of Detroit business, labor and government groups Tuesday announced a $50 million investment in Detroit they said would isure a long-term, cost-effective and eco-friendly supply of renewable energy from waste-derived fuel for Detroit's core business district.

Those making the announcement were Detroit Renewable Energy LLC, the new parent company of Detroit Thermal LLC, along with the City of Detroit, the Greater Detroit Resource Recovery Authority, the International Union of Operating Engineers Local 324, Utility Workers Union of America, AFL-CIO Local 223, and DTE Energy.

Detroit Renewable Energy was funded by Greenwich, Conn.-based Atlas Holdings LLC with participation by Youngstown, Ohio-based Thermal Ventures II LP. DRE is a new Detroit-based holding company for several companies that will operate as independent subsidiaries.

"Atlas shares our belief in a strong future in Detroit's downtown core business districts with this new investment," said Victor Koppang, Detroit Thermal president.

Detroit Renewable Energy LLC acquired the Detroit energy-from-waste plant that produces steam and electricity from municipal waste and also purchased Detroit Thermal, which owns and operates the district energy underground steam system along the Woodward Avenue corridor from the riverfront to the New Center and Midtown areas.

DRE also acquired Hamtramck Energy Services LLC, which operates the private industrial steam plants at five General Motors plants. Each of the businesses will operate as independent subsidiaries under the umbrella of newly formed DRE and will be headquartered in Detroit.

The Greater Detroit Resource Recovery Authority will continue to supply the EFW plant with the municipal waste it turns into energy. The EFW plant will operate under the name of Detroit Renewable Power LLC as an independent subsidiary of DRE.

A request is being made to the Detroit City Council for the development of an Industrial Development Plant District.

DTE Energy will continue to purchase all of the electricity generated by Detroit Renewable Power from the EFW plant. The International Union of Operating Engineers Local 324 ratified a new three-year collective bargaining agreement with Detroit Renewable Power.

"This new investment of $50 million, on top of the $35 million we already invested since buying the district energy system in 2003, assures a long-term, cost-effective and environmentally-friendly supply of renewable energy from municipal waste that would otherwise be trucked to landfills," Koppang said. "Detroit Thermal's customers can count on uninterrupted steam energy services and at the same time help improve the environment by lowering emissions and reducing their carbon footprint. We have a 21st century system and nearly $120 million in new customer commitments, and the interest in our service keeps growing. The future looks great to us."

DRE purchased the EFW plant from Energy Investors Fund LLC of Needham, Mass. and Covanta Energy Corp. of Fairfield, N.J. The EFW plant will operate as a separate company and sell steam – its primary product – to Detroit Thermal, LLC and electricity to DTE Energy.

The new investment also means that about 130 skilled EFW employees will get their jobs back with the restart of the plant. The plant was temporarily closed and the employees were laid off earlier this month when its prior contracts expired during the due diligence period that led to the present purchase.

Timelines and specifics of the EFW plant future operations, as well as other details of the new Detroit Renewable Energy LLC were not announced pending finalization of those details.

This is the second time Atlas has made a significant investment in the state of Michigan to revitalize a business. In 2002, Atlas acquired Michigan Seamless Tube LLC, a South Lyon-based manufacturer of steel tubing that had been idled as a result of a bankruptcy filing and had historic environmental liabilities. Atlas worked collaboratively with the Michigan Department of Environmental Quality and the United Steelworkers Union to restart the operation. More than 250 jobs were created in Oakland County as a result of Atlas' investment, and the environmental issues on the site have been minimized.`,
    external_url: null,
    visible: true,
  },
];
