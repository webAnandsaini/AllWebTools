import { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type BacklinkItem = {
  url: string;
  anchor: string;
  authority: number;
  dofollow: boolean;
};

type CompetitorItem = {
  domain: string;
  backlinks: number;
  uniqueDomains: number;
};

interface ResultsData {
  domain?: string;
  totalBacklinks?: number;
  uniqueDomains?: number;
  backlinks?: BacklinkItem[];
  competitors?: CompetitorItem[];
  brokenLinks?: Array<{url: string; statusCode: number; brokenSince: string}>;
  linkCounts?: {internal: number; external: number; total: number};
  reciprocalLinks?: Array<{domain: string; linksTo: boolean; linksFrom: boolean}>;
  linkValues?: Array<{url: string; estimatedValue: number; metrics: {da: number; pa: number; trust: number}}>;
  anchorTextDistribution?: Array<{text: string; count: number; percentage: string}>;
}

const BacklinkToolsDetailed = () => {
  const [domain, setDomain] = useState<string>("");
  const [competitorDomain, setCompetitorDomain] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [linkUrl, setLinkUrl] = useState<string>("");
  const { toast } = useToast();
  
  const getToolContent = (toolSlug: string) => {
    if (toolSlug === "backlink-checker") {
      return {
        title: "Backlink Checker",
        introduction: "Analyze your website's backlink profile with our comprehensive Backlink Checker tool.",
        description: "Our Backlink Checker helps you discover all the websites that link to your domain. Understand your backlink profile, identify valuable link opportunities, and monitor your competitors' link building strategies. This tool provides detailed metrics on each backlink, including domain authority and follow status.",
        howToUse: [
          "Enter your website URL in the input field",
          "Click the 'Check Backlinks' button",
          "Review the comprehensive backlink analysis",
          "Export the results for further analysis or reporting"
        ],
        features: [
          "Comprehensive backlink discovery",
          "Domain authority and metrics for each backlink",
          "Follow/nofollow status identification",
          "Anchor text analysis",
          "Competitor backlink comparison",
          "Exportable reports"
        ],
        faqs: [
          {
            question: "How often should I check my backlinks?",
            answer: "It's recommended to check your backlinks at least once a month to monitor new links and identify any potentially harmful ones."
          },
          {
            question: "Can I see my competitors' backlinks?",
            answer: "Yes, our tool allows you to analyze competitors' backlinks by entering their domain in the competitor analysis section."
          },
          {
            question: "What metrics are used to evaluate backlink quality?",
            answer: "We analyze domain authority, page authority, relevance, follow status, and anchor text to determine backlink quality."
          },
          {
            question: "How many backlinks can I analyze at once?",
            answer: "Our tool can analyze up to 10,000 backlinks per domain in a single report."
          }
        ]
      };
    } else if (toolSlug === "backlink-maker") {
      return {
        title: "Backlink Maker",
        introduction: "Create high-quality backlinks to improve your website's SEO with our Backlink Maker tool.",
        description: "Our Backlink Maker helps you create strategic backlinks to boost your website's authority and search engine rankings. Submit your website to our network of reputable directories and partner sites to build a strong backlink profile. The tool provides detailed guidance on anchor text optimization and placement strategies.",
        howToUse: [
          "Enter your website URL in the input field",
          "Provide your target keywords and anchor text preferences",
          "Select the category and type of backlinks you want to create",
          "Click the 'Create Backlinks' button",
          "Follow the instructions to complete the backlink creation process"
        ],
        features: [
          "Access to reputable directory submissions",
          "Anchor text optimization suggestions",
          "Industry-specific backlink opportunities",
          "Backlink tracking and monitoring",
          "Quality metrics for potential backlink sites",
          "Scheduled backlink building plans"
        ],
        faqs: [
          {
            question: "Are all the backlinks created dofollow?",
            answer: "Our network includes both dofollow and nofollow links. While dofollow links pass more SEO value, a natural backlink profile should include both types."
          },
          {
            question: "How long does it take for new backlinks to impact SEO?",
            answer: "It typically takes 4-8 weeks for new backlinks to be discovered by search engines and begin affecting your rankings."
          },
          {
            question: "Is there a limit to how many backlinks I can create?",
            answer: "We recommend creating no more than 5-10 quality backlinks per week to maintain a natural growth pattern."
          },
          {
            question: "Can I specify the anchor text for my backlinks?",
            answer: "Yes, our tool allows you to suggest preferred anchor text, though the final decision may rest with the linking site."
          }
        ]
      };
    } else if (toolSlug === "website-link-count-checker") {
      return {
        title: "Website Link Count Checker",
        introduction: "Count and analyze all internal and external links on your website with our Link Count Checker.",
        description: "Our Website Link Count Checker helps you understand the link structure of your website. Count the total number of internal and external links on any webpage, analyze link distribution, and identify pages with excessive linking. This tool provides valuable insights for improving your site's navigation and SEO.",
        howToUse: [
          "Enter the webpage URL you want to analyze",
          "Click the 'Count Links' button",
          "Review the detailed breakdown of internal and external links",
          "Use the insights to optimize your link structure"
        ],
        features: [
          "Total link count analysis",
          "Internal vs. external link breakdown",
          "Link destination categorization",
          "Identification of broken links",
          "Navigation structure analysis",
          "Link density metrics"
        ],
        faqs: [
          {
            question: "What's the ideal number of links on a webpage?",
            answer: "While there's no strict limit, it's generally recommended to keep the total number of links on a page under 100 for optimal user experience and SEO."
          },
          {
            question: "Does the tool count links in navigation menus?",
            answer: "Yes, our tool counts all links on a page, including those in navigation menus, footers, and content areas."
          },
          {
            question: "Can I analyze multiple pages at once?",
            answer: "Currently, the tool analyzes one page at a time, but you can run sequential analyses for different pages."
          },
          {
            question: "Does this tool identify broken links?",
            answer: "This tool counts links but doesn't verify their status. Use our Broken Link Checker for that purpose."
          }
        ]
      };
    } else if (toolSlug === "website-broken-link-checker") {
      return {
        title: "Website Broken Link Checker",
        introduction: "Find and fix broken links on your website with our comprehensive Broken Link Checker.",
        description: "Our Website Broken Link Checker helps you identify and fix broken links that can harm user experience and SEO. Scan your entire website or specific pages to discover 404 errors, redirect chains, and other link issues. The tool provides detailed reports with recommendations for fixing each broken link.",
        howToUse: [
          "Enter your website URL in the input field",
          "Choose whether to scan the entire site or specific pages",
          "Click the 'Check Broken Links' button",
          "Review the comprehensive report of all broken links",
          "Use the suggested fixes to repair problematic links"
        ],
        features: [
          "Complete website scanning",
          "Detection of 404 errors and broken links",
          "Redirect chain identification",
          "Link status code reporting",
          "Fix recommendations",
          "Scheduled scans and monitoring",
          "Email notifications for new broken links"
        ],
        faqs: [
          {
            question: "How often should I check for broken links?",
            answer: "It's recommended to scan for broken links at least once a month, or after making significant changes to your website."
          },
          {
            question: "Can the tool automatically fix broken links?",
            answer: "Our tool identifies broken links and provides recommendations, but the actual fixes must be implemented manually in your website's code."
          },
          {
            question: "How deep does the scan go?",
            answer: "You can set the scan depth from 1 level (just the page you enter) up to 5 levels deep into your site's structure."
          },
          {
            question: "Does it check external links too?",
            answer: "Yes, the tool checks both internal links (within your domain) and external links (to other websites)."
          }
        ]
      };
    } else if (toolSlug === "link-price-calculator") {
      return {
        title: "Link Price Calculator",
        introduction: "Calculate the fair market value of backlinks with our Link Price Calculator.",
        description: "Our Link Price Calculator helps you determine the appropriate price for purchasing or selling backlinks based on domain metrics. Evaluate link value using factors like domain authority, traffic, relevance, and more. This tool provides data-driven pricing recommendations for your link building campaigns.",
        howToUse: [
          "Enter the domain URL you want to evaluate",
          "Provide additional metrics if available (traffic, niche, etc.)",
          "Click the 'Calculate Link Value' button",
          "Review the estimated price range and value metrics",
          "Use these insights for negotiating link placements"
        ],
        features: [
          "Domain authority-based valuation",
          "Traffic and engagement factor analysis",
          "Niche relevance consideration",
          "Link placement value assessment",
          "Competitive pricing analysis",
          "Historical pricing data",
          "ROI estimation"
        ],
        faqs: [
          {
            question: "What factors influence backlink pricing the most?",
            answer: "Domain authority, traffic, niche relevance, link placement (homepage vs inner page), and whether the link is dofollow or nofollow are the main factors affecting link value."
          },
          {
            question: "Is buying backlinks a recommended SEO strategy?",
            answer: "Purchasing links purely for SEO can violate search engine guidelines. This tool is meant for understanding fair value in legitimate sponsorship and advertising relationships."
          },
          {
            question: "How accurate is the price estimation?",
            answer: "Our calculator provides a range based on industry averages and current market rates, but actual prices may vary based on negotiation and other factors."
          },
          {
            question: "Can I calculate the value of links on my own site?",
            answer: "Yes, this tool works both ways—for evaluating links you want to acquire and for understanding the value of links you might sell on your own site."
          }
        ]
      };
    } else if (toolSlug === "reciprocal-link-checker") {
      return {
        title: "Reciprocal Link Checker",
        introduction: "Discover mutual linking relationships with our Reciprocal Link Checker tool.",
        description: "Our Reciprocal Link Checker helps you identify websites that both link to you and receive links from you. Analyze your reciprocal linking patterns, ensure compliance with search engine guidelines, and identify opportunities for diversifying your link profile. This tool provides detailed reports on all mutual linking relationships.",
        howToUse: [
          "Enter your website URL in the input field",
          "Click the 'Check Reciprocal Links' button",
          "Review the comprehensive report of mutual linking relationships",
          "Use the insights to diversify your link building strategy"
        ],
        features: [
          "Complete reciprocal link discovery",
          "Link quality assessment",
          "Over-optimization risk alerts",
          "Natural vs. artificial link pattern analysis",
          "Historical linking relationship tracking",
          "Recommendation engine for link diversification"
        ],
        faqs: [
          {
            question: "Are reciprocal links bad for SEO?",
            answer: "Reciprocal links aren't inherently bad, but excessive mutual linking patterns can appear manipulative to search engines. A healthy link profile should have a natural mix of reciprocal and one-way links."
          },
          {
            question: "How many reciprocal links are too many?",
            answer: "There's no exact number, but our tool will flag when your reciprocal links exceed 30% of your total backlink profile, which could suggest an unnatural pattern."
          },
          {
            question: "Does Google penalize for reciprocal linking?",
            answer: "Google doesn't explicitly penalize reciprocal linking, but excessive mutual linking schemes that appear manipulative can trigger algorithmic filters."
          },
          {
            question: "Should I remove reciprocal links?",
            answer: "Only if they're low-quality or part of obvious link schemes. Natural reciprocal links between related websites that make sense for users are perfectly acceptable."
          }
        ]
      };
    } else if (toolSlug === "website-link-analyzer") {
      return {
        title: "Website Link Analyzer Tool",
        introduction: "Get comprehensive insights into your website's link structure with our Link Analyzer.",
        description: "Our Website Link Analyzer provides in-depth analysis of your site's internal and external linking patterns. Evaluate link equity distribution, identify opportunities for improved internal linking, and understand how link juice flows through your website. This tool helps optimize your site architecture for better SEO performance.",
        howToUse: [
          "Enter your website URL in the input field",
          "Select the analysis depth and parameters",
          "Click the 'Analyze Links' button",
          "Review the detailed report with visualizations and metrics",
          "Implement the recommended optimizations"
        ],
        features: [
          "Link equity flow visualization",
          "Internal linking structure analysis",
          "PageRank distribution mapping",
          "Orphaned page identification",
          "Pillar content and topic cluster detection",
          "Link value leakage identification",
          "Actionable optimization recommendations"
        ],
        faqs: [
          {
            question: "What's the difference between this and the Link Count Checker?",
            answer: "While the Link Count Checker provides basic quantitative data, the Website Link Analyzer offers qualitative analysis of how links affect your site's SEO, including equity distribution and structural optimizations."
          },
          {
            question: "How deep does the analysis go?",
            answer: "You can set the crawl depth from 1 to 5 levels. For most websites, a 3-level deep analysis provides sufficient insights without excessive processing time."
          },
          {
            question: "Can I analyze specific sections of my website?",
            answer: "Yes, you can specify subsections or directories to focus the analysis on particular areas of your site."
          },
          {
            question: "How often should I run a link analysis?",
            answer: "For most websites, quarterly analysis is sufficient. However, if you're actively working on site structure or have a large, frequently updated site, monthly analysis may be beneficial."
          }
        ]
      };
    } else if (toolSlug === "broken-backlink-checker") {
      return {
        title: "Broken Backlink Checker",
        introduction: "Recover lost link equity by finding and fixing broken backlinks with our specialized tool.",
        description: "Our Broken Backlink Checker helps you identify external websites that contain broken links pointing to your domain. These are valuable opportunities to reclaim lost link equity by implementing redirects or requesting updates. The tool provides detailed reports on all broken backlinks with outreach templates.",
        howToUse: [
          "Enter your domain name in the input field",
          "Click the 'Find Broken Backlinks' button",
          "Review the comprehensive report of all broken incoming links",
          "Use the provided templates to contact webmasters or implement redirects",
          "Track the status of fixed backlinks"
        ],
        features: [
          "Complete broken backlink discovery",
          "Link equity value assessment",
          "Ready-to-use outreach templates",
          "Redirect suggestion generator",
          "Webmaster contact information finder",
          "Backlink recovery tracking",
          "Scheduling for regular checks"
        ],
        faqs: [
          {
            question: "How do backlinks become broken?",
            answer: "Backlinks typically break when you change URLs, remove pages, restructure your site, or when the linking site mistypes your URL."
          },
          {
            question: "What's the best way to recover broken backlinks?",
            answer: "The most effective approach is to implement 301 redirects from the old URLs to the most relevant existing pages, then contact webmasters to update the links to the current URLs when possible."
          },
          {
            question: "How much link equity is lost with broken backlinks?",
            answer: "A broken backlink passes no link equity at all, so recovering these links can provide significant SEO value, especially for high-authority referring domains."
          },
          {
            question: "How often should I check for broken backlinks?",
            answer: "It's recommended to check monthly, or immediately after any website restructuring or URL changes."
          }
        ]
      };
    } else if (toolSlug === "valuable-backlink-checker") {
      return {
        title: "Valuable Backlink Checker",
        introduction: "Identify your most valuable backlinks and focus your outreach efforts with our specialized tool.",
        description: "Our Valuable Backlink Checker helps you discover which backlinks provide the most SEO value to your website. Analyze backlinks based on domain authority, relevance, traffic, and other metrics to prioritize your link building and relationship management efforts. This tool provides actionable insights for maximizing your backlink ROI.",
        howToUse: [
          "Enter your domain name in the input field",
          "Click the 'Analyze Valuable Backlinks' button",
          "Review the ranked list of your most valuable backlinks",
          "Use the detailed metrics to inform your link building strategy",
          "Save and export the report for future reference"
        ],
        features: [
          "Backlink value scoring algorithm",
          "Domain authority assessment",
          "Traffic estimation for referring pages",
          "Relevance and contextual analysis",
          "Link attributes evaluation (dofollow, text, placement)",
          "Historical link performance tracking",
          "Competitor valuable backlink comparison"
        ],
        faqs: [
          {
            question: "What makes a backlink valuable?",
            answer: "The most valuable backlinks come from high-authority domains in your niche, are dofollow, use relevant anchor text, appear in the main content rather than footers, and drive referral traffic in addition to passing link equity."
          },
          {
            question: "Should I focus only on high-authority backlinks?",
            answer: "While high-authority links are important, a natural backlink profile should include a mix of authority levels. Relevant links from medium-authority sites in your exact niche can often be more valuable than general links from unrelated high-authority sites."
          },
          {
            question: "How can I get more valuable backlinks?",
            answer: "The tool includes a section with suggestions for acquiring similar valuable backlinks through strategic content creation, relationship building, and targeted outreach."
          },
          {
            question: "Does social media sharing affect backlink value?",
            answer: "While most social media links are nofollow and don't directly pass link equity, high engagement and sharing can indirectly lead to more valuable backlinks as your content reaches potential linkers."
          }
        ]
      };
    } else if (toolSlug === "backlinks-competitors") {
      return {
        title: "Backlinks Competitors",
        introduction: "Discover and analyze your competitors' backlink profiles with our competitive intelligence tool.",
        description: "Our Backlinks Competitors tool helps you uncover the backlink strategies of your top competitors. Identify their most valuable links, common referring domains, and link building patterns to inform your own SEO strategy. This competitive intelligence provides opportunities for acquiring similar high-quality backlinks.",
        howToUse: [
          "Enter your domain and up to 5 competitor domains",
          "Click the 'Analyze Competitor Backlinks' button",
          "Review the comparative backlink analysis",
          "Identify link gap opportunities and common referring domains",
          "Use the insights to enhance your link building strategy"
        ],
        features: [
          "Side-by-side backlink profile comparison",
          "Common referring domain identification",
          "Unique backlink opportunity discovery",
          "Link velocity and growth pattern analysis",
          "Anchor text distribution comparison",
          "Content-driven link acquisition insights",
          "Link building strategy recommendations"
        ],
        faqs: [
          {
            question: "How do I identify my true SEO competitors?",
            answer: "Your SEO competitors may differ from business competitors. Look for domains ranking for your target keywords in search results, rather than just industry rivals."
          },
          {
            question: "Can I see which links my competitors have that I don't?",
            answer: "Yes, the tool includes a 'link gap analysis' showing domains that link to your competitors but not to you, sorted by authority and relevance."
          },
          {
            question: "How can I use competitor backlink data effectively?",
            answer: "Rather than copying your competitors' every move, look for patterns and themes in their successful link building. Focus on replicating their strategy types rather than targeting identical links."
          },
          {
            question: "Is it against Google's guidelines to pursue the same links as competitors?",
            answer: "No, analyzing competitors is a standard SEO practice. Just ensure you're pursuing links through legitimate means that add value, rather than using manipulative tactics."
          }
        ]
      };
    } else if (toolSlug === "anchor-text-distribution") {
      return {
        title: "Anchor Text Distribution",
        introduction: "Analyze and optimize your anchor text profile with our specialized SEO tool.",
        description: "Our Anchor Text Distribution tool helps you understand the diversity and balance of anchor texts in your backlink profile. Maintain a natural link pattern, avoid over-optimization penalties, and ensure a healthy mix of branded, keyword-rich, and generic anchors. This tool provides detailed analysis and recommendations for your anchor text strategy.",
        howToUse: [
          "Enter your domain name in the input field",
          "Click the 'Analyze Anchor Text' button",
          "Review the comprehensive anchor text distribution report",
          "Check for potential over-optimization issues",
          "Use the recommendations to guide your link building strategy"
        ],
        features: [
          "Complete anchor text categorization",
          "Natural vs. unnatural pattern detection",
          "Over-optimization risk assessment",
          "Branded vs. non-branded anchor balance",
          "Historical anchor text trend analysis",
          "Competitor anchor text comparison",
          "Anchor text strategy recommendations"
        ],
        faqs: [
          {
            question: "What's the ideal anchor text distribution?",
            answer: "While there's no perfect formula, a natural profile typically includes 40-60% branded anchors, 20-30% URL/generic anchors (click here, website, etc.), 10-15% topic anchors, and only 5-10% exact match keyword anchors."
          },
          {
            question: "Can exact match anchor text hurt my SEO?",
            answer: "Yes, excessive exact match anchor text (using precise target keywords as anchors) can trigger over-optimization filters. Our tool will alert you if your exact match percentage is potentially problematic."
          },
          {
            question: "How can I improve my anchor text distribution?",
            answer: "The tool provides specific recommendations based on your current profile, but generally focus on acquiring more branded and natural variation anchors if you're over-optimized for keywords."
          },
          {
            question: "Should different pages have different anchor text strategies?",
            answer: "Yes, homepage backlinks typically have more branded anchors, while internal pages can naturally have more topical and descriptive anchors related to their specific content."
          }
        ]
      };
    }
    
    // Default content
    return {
      title: "Backlink Analysis Tool",
      introduction: "Optimize your website's backlink profile with our powerful analysis tools.",
      description: "Our suite of backlink analysis tools helps you understand, improve, and monitor your website's link profile. Whether you're checking existing backlinks, finding broken links, analyzing competitors, or planning your next link building campaign, our tools provide comprehensive data and actionable insights.",
      howToUse: [
        "Enter your website URL in the input field",
        "Select the specific analysis you want to perform",
        "Review the detailed results and recommendations",
        "Implement the suggestions to improve your backlink profile"
      ],
      features: [
        "Comprehensive backlink analysis and discovery",
        "Link quality and authority metrics",
        "Competitor backlink comparison",
        "Broken link identification and recovery",
        "Anchor text distribution analysis",
        "Link building opportunity identification",
        "Detailed reporting and recommendations"
      ],
      faqs: [
        {
          question: "Why are backlinks important for SEO?",
          answer: "Backlinks act as votes of confidence from other websites, signaling to search engines that your content is valuable and trustworthy. They remain one of the most important ranking factors in search algorithms."
        },
        {
          question: "How many backlinks do I need for good SEO?",
          answer: "Quality matters more than quantity. A few high-authority, relevant backlinks can provide more SEO value than hundreds of low-quality links. Focus on building a natural, diverse link profile."
        },
        {
          question: "How often should I analyze my backlinks?",
          answer: "For most websites, monthly analysis is sufficient to track progress and identify issues. However, if you're actively building links or recovering from a penalty, weekly checks may be beneficial."
        },
        {
          question: "What makes a backlink harmful to SEO?",
          answer: "Links from spammy sites, link farms, unrelated content, or those obtained through manipulative schemes can harm your SEO. Our tools help identify potentially harmful links in your profile."
        }
      ]
    };
  };

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  // Function to generate realistic demo data for backlink checking
  const generateBacklinkData = () => {
    const mockDomains = [
      "example.com", "blog.wordpress.com", "nytimes.com", "cnn.com", 
      "medium.com", "reddit.com", "github.com", "stackexchange.com",
      "wikipedia.org", "shopify.com", "forbes.com", "entrepreneur.com",
      "techcrunch.com", "wired.com", "mashable.com", "theverge.com"
    ];
    
    const mockAnchors = [
      "Click here", "Read more", domain, "Website", "Learn more",
      "Great resource", "Official website", "Check this out",
      "Visit website", domain.split('.')[0], "Source", "Reference",
      "More information", "According to", "As seen on", "Full article"
    ];

    const backlinks: BacklinkItem[] = [];
    const totalBacklinks = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < totalBacklinks; i++) {
      backlinks.push({
        url: mockDomains[Math.floor(Math.random() * mockDomains.length)],
        anchor: mockAnchors[Math.floor(Math.random() * mockAnchors.length)],
        authority: Math.floor(Math.random() * 100),
        dofollow: Math.random() > 0.3
      });
    }
    
    const competitors = [
      {
        domain: "competitor1.com",
        backlinks: Math.floor(Math.random() * 1000) + 100,
        uniqueDomains: Math.floor(Math.random() * 200) + 50
      },
      {
        domain: "competitor2.com",
        backlinks: Math.floor(Math.random() * 1000) + 100,
        uniqueDomains: Math.floor(Math.random() * 200) + 50
      },
      {
        domain: "competitor3.com",
        backlinks: Math.floor(Math.random() * 1000) + 100,
        uniqueDomains: Math.floor(Math.random() * 200) + 50
      }
    ];
    
    return {
      domain,
      totalBacklinks: backlinks.length,
      uniqueDomains: new Set(backlinks.map(link => link.url)).size,
      backlinks,
      competitors
    };
  };
  
  // Generate broken links data
  const generateBrokenLinksData = () => {
    const statusCodes = [404, 500, 301, 302, 410];
    const paths = ["/old-page", "/products/discontinued", "/blog/draft", "/events/past", "/about/team/former"];
    const dates = ["2023-01-15", "2023-03-22", "2023-05-07", "2023-06-19", "2023-08-30"];
    
    const brokenLinks = [];
    const linkCount = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 0; i < linkCount; i++) {
      brokenLinks.push({
        url: domain + paths[Math.floor(Math.random() * paths.length)],
        statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
        brokenSince: dates[Math.floor(Math.random() * dates.length)]
      });
    }
    
    return {
      domain,
      brokenLinks
    };
  };
  
  // Generate link count data
  const generateLinkCountData = () => {
    const internal = Math.floor(Math.random() * 50) + 10;
    const external = Math.floor(Math.random() * 30) + 5;
    
    return {
      domain,
      linkCounts: {
        internal,
        external,
        total: internal + external
      }
    };
  };
  
  // Generate reciprocal links data
  const generateReciprocalLinksData = () => {
    const domains = [
      "partner1.com", "partner2.org", "affiliate.net", "industry-blog.com",
      "related-site.co", "vendor.com", "supplier.net", "client1.biz",
      "association.org", "directory.com"
    ];
    
    const reciprocalLinks = domains.map(domain => ({
      domain,
      linksTo: Math.random() > 0.3,
      linksFrom: Math.random() > 0.3
    })).filter(link => link.linksTo || link.linksFrom);
    
    return {
      domain,
      reciprocalLinks
    };
  };
  
  // Generate link value data
  const generateLinkValueData = () => {
    const domains = [
      "authority-site.com", "niche-blog.org", "industry-leader.net",
      "news-site.com", "edu-resource.edu", "gov-portal.gov",
      "top-directory.com", "expert-forum.org", "research-institute.org"
    ];
    
    const linkValues = domains.map(domain => ({
      url: domain,
      estimatedValue: Math.floor(Math.random() * 900) + 100,
      metrics: {
        da: Math.floor(Math.random() * 100),
        pa: Math.floor(Math.random() * 100),
        trust: Math.floor(Math.random() * 10)
      }
    }));
    
    return {
      domain,
      linkValues
    };
  };
  
  // Generate anchor text distribution data
  const generateAnchorTextData = () => {
    const anchors = [
      domain.split('.')[0], "Click here", "Website", "Learn more",
      "Official site", domain, "Read more", "Visit now",
      "Great resource", "Information", "Source", "Link"
    ];
    
    let totalCount = 0;
    const anchorCounts = anchors.map(anchor => {
      const count = Math.floor(Math.random() * 20) + 1;
      totalCount += count;
      return { text: anchor, count };
    });
    
    const anchorTextDistribution = anchorCounts.map(item => ({
      ...item,
      percentage: ((item.count / totalCount) * 100).toFixed(1) + "%"
    }));
    
    return {
      domain,
      anchorTextDistribution
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate different results based on the tool being used
      let generatedResults: ResultsData = {};
      
      if (toolSlug === "backlink-checker" || toolSlug === "valuable-backlink-checker" || toolSlug === "backlinks-competitors") {
        generatedResults = generateBacklinkData();
      } else if (toolSlug === "website-broken-link-checker" || toolSlug === "broken-backlink-checker") {
        generatedResults = generateBrokenLinksData();
      } else if (toolSlug === "website-link-count-checker") {
        generatedResults = generateLinkCountData();
      } else if (toolSlug === "reciprocal-link-checker") {
        generatedResults = generateReciprocalLinksData();
      } else if (toolSlug === "link-price-calculator") {
        generatedResults = generateLinkValueData();
      } else if (toolSlug === "anchor-text-distribution") {
        generatedResults = generateAnchorTextData();
      } else if (toolSlug === "website-link-analyzer") {
        // For the analyzer, combine multiple data types
        generatedResults = {
          ...generateLinkCountData(),
          ...generateBacklinkData(),
          ...generateAnchorTextData()
        };
      } else {
        // Default to backlink checker
        generatedResults = generateBacklinkData();
      }
      
      setResults(generatedResults);
      setLoading(false);
    }, 1500);
  };

  const renderInterface = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Enter Website URL</Label>
              <Input
                id="domain"
                type="text"
                placeholder="e.g., example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Enter a full domain name without http:// or www
              </p>
            </div>
            
            {toolSlug === "backlinks-competitors" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="competitor">Competitor Domain (Optional)</Label>
                <Input
                  id="competitor"
                  type="text"
                  placeholder="e.g., competitor.com"
                  value={competitorDomain}
                  onChange={(e) => setCompetitorDomain(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : `Check ${toolSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
          </Button>
        </form>

        {loading && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <Progress value={45} className="h-2" />
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Analyzing backlink data... This may take a moment.
            </p>
          </div>
        )}

        {results && !loading && (
          <div className="mt-8">
            <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {results.backlinks && <TabsTrigger value="backlinks">Backlinks</TabsTrigger>}
                {results.competitors && <TabsTrigger value="competitors">Competitors</TabsTrigger>}
                {results.brokenLinks && <TabsTrigger value="broken">Broken Links</TabsTrigger>}
                {results.linkCounts && <TabsTrigger value="counts">Link Counts</TabsTrigger>}
                {results.reciprocalLinks && <TabsTrigger value="reciprocal">Reciprocal</TabsTrigger>}
                {results.linkValues && <TabsTrigger value="values">Link Values</TabsTrigger>}
                {results.anchorTextDistribution && <TabsTrigger value="anchors">Anchor Text</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {results.totalBacklinks && (
                        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                          <span className="text-3xl font-bold text-blue-600">{results.totalBacklinks}</span>
                          <span className="text-sm text-gray-600 mt-1">Total Backlinks</span>
                        </div>
                      )}
                      
                      {results.uniqueDomains && (
                        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                          <span className="text-3xl font-bold text-green-600">{results.uniqueDomains}</span>
                          <span className="text-sm text-gray-600 mt-1">Unique Domains</span>
                        </div>
                      )}
                      
                      {results.linkCounts && (
                        <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                          <span className="text-3xl font-bold text-purple-600">{results.linkCounts.total}</span>
                          <span className="text-sm text-gray-600 mt-1">Total Links</span>
                        </div>
                      )}
                      
                      {results.brokenLinks && (
                        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                          <span className="text-3xl font-bold text-red-600">{results.brokenLinks.length}</span>
                          <span className="text-sm text-gray-600 mt-1">Broken Links</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center mt-6">
                  <Button onClick={() => window.print()} className="mr-2">
                    <i className="fas fa-print mr-2"></i> Print Report
                  </Button>
                  <Button variant="outline">
                    <i className="fas fa-download mr-2"></i> Export as CSV
                  </Button>
                </div>
              </TabsContent>
              
              {results.backlinks && (
                <TabsContent value="backlinks">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Referring Domain</TableHead>
                            <TableHead>Anchor Text</TableHead>
                            <TableHead>Authority</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.backlinks.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell>{link.url}</TableCell>
                              <TableCell>{link.anchor}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="mr-2">{link.authority}</span>
                                  <Progress value={link.authority} className="h-2 w-16" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={link.dofollow ? "default" : "outline"}>
                                  {link.dofollow ? "Dofollow" : "Nofollow"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.competitors && (
                <TabsContent value="competitors">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain</TableHead>
                            <TableHead>Total Backlinks</TableHead>
                            <TableHead>Unique Domains</TableHead>
                            <TableHead>Comparison</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-blue-50">
                            <TableCell className="font-medium">{domain}</TableCell>
                            <TableCell>{results.totalBacklinks}</TableCell>
                            <TableCell>{results.uniqueDomains}</TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                          {results.competitors.map((competitor, index) => (
                            <TableRow key={index}>
                              <TableCell>{competitor.domain}</TableCell>
                              <TableCell>{competitor.backlinks}</TableCell>
                              <TableCell>{competitor.uniqueDomains}</TableCell>
                              <TableCell>
                                <Badge variant={competitor.backlinks > (results.totalBacklinks || 0) ? "destructive" : "success"}>
                                  {competitor.backlinks > (results.totalBacklinks || 0) ? 
                                    `${Math.round((competitor.backlinks / (results.totalBacklinks || 1) - 1) * 100)}% more` : 
                                    `${Math.round(((results.totalBacklinks || 0) / competitor.backlinks - 1) * 100)}% less`
                                  }
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.brokenLinks && (
                <TabsContent value="broken">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>URL</TableHead>
                            <TableHead>Status Code</TableHead>
                            <TableHead>Broken Since</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.brokenLinks.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{link.url}</TableCell>
                              <TableCell>
                                <Badge variant={link.statusCode === 404 ? "destructive" : "outline"}>
                                  {link.statusCode}
                                </Badge>
                              </TableCell>
                              <TableCell>{link.brokenSince}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Fix</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.linkCounts && (
                <TabsContent value="counts">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                          <span className="text-3xl font-bold text-blue-600">{results.linkCounts.internal}</span>
                          <span className="text-sm text-gray-600 mt-1">Internal Links</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
                          <span className="text-3xl font-bold text-amber-600">{results.linkCounts.external}</span>
                          <span className="text-sm text-gray-600 mt-1">External Links</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                          <span className="text-3xl font-bold text-purple-600">{results.linkCounts.total}</span>
                          <span className="text-sm text-gray-600 mt-1">Total Links</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Link Distribution</h3>
                        <div className="w-full h-4 rounded-full overflow-hidden bg-gray-200">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${Math.round((results.linkCounts.internal / results.linkCounts.total) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>{Math.round((results.linkCounts.internal / results.linkCounts.total) * 100)}% Internal</span>
                          <span>{Math.round((results.linkCounts.external / results.linkCounts.total) * 100)}% External</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.reciprocalLinks && (
                <TabsContent value="reciprocal">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain</TableHead>
                            <TableHead>Links To You</TableHead>
                            <TableHead>Links From You</TableHead>
                            <TableHead>Relationship</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.reciprocalLinks.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{link.domain}</TableCell>
                              <TableCell>
                                {link.linksTo ? 
                                  <Badge variant="success" className="bg-green-100 text-green-800">Yes</Badge> : 
                                  <Badge variant="outline">No</Badge>
                                }
                              </TableCell>
                              <TableCell>
                                {link.linksFrom ? 
                                  <Badge variant="success" className="bg-green-100 text-green-800">Yes</Badge> : 
                                  <Badge variant="outline">No</Badge>
                                }
                              </TableCell>
                              <TableCell>
                                {link.linksTo && link.linksFrom ? 
                                  <Badge className="bg-amber-100 text-amber-800">Reciprocal</Badge> : 
                                  <Badge variant="outline">{link.linksTo ? "Inbound Only" : "Outbound Only"}</Badge>
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.linkValues && (
                <TabsContent value="values">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain</TableHead>
                            <TableHead>Domain Authority</TableHead>
                            <TableHead>Page Authority</TableHead>
                            <TableHead>Estimated Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.linkValues.map((link, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{link.url}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="mr-2">{link.metrics.da}</span>
                                  <Progress value={link.metrics.da} className="h-2 w-16" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="mr-2">{link.metrics.pa}</span>
                                  <Progress value={link.metrics.pa} className="h-2 w-16" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">
                                  ${link.estimatedValue}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {results.anchorTextDistribution && (
                <TabsContent value="anchors">
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Anchor Text</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Distribution</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.anchorTextDistribution.map((anchor, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{anchor.text}</TableCell>
                              <TableCell>{anchor.count}</TableCell>
                              <TableCell>{anchor.percentage}</TableCell>
                              <TableCell>
                                <Progress 
                                  value={parseFloat(anchor.percentage)} 
                                  className="h-2 w-full" 
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>
    );
  };

  const toolContent = getToolContent(toolSlug);

  return (
    <ToolPageTemplate
      toolSlug={toolSlug}
      toolContent={
        <ToolContentTemplate
          introduction={toolContent.introduction}
          description={toolContent.description}
          howToUse={toolContent.howToUse}
          features={toolContent.features}
          faqs={toolContent.faqs}
          toolInterface={renderInterface()}
        />
      }
    />
  );
};

export default BacklinkToolsDetailed;