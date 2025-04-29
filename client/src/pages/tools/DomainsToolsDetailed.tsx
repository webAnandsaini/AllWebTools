import { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface DomainResult {
  name: string;
  ip?: string;
  age?: {
    registered: string;
    years: number;
  };
  authority?: {
    score: number;
    status: "poor" | "fair" | "good" | "excellent";
  };
  hosting?: {
    provider: string;
    location: string;
    dataCenter: string;
  };
  dns?: {
    a: string[];
    mx: string[];
    ns: string[];
    txt: string[];
    cname: string[];
  };
  blacklist?: {
    status: string;
    listedOn: string[];
    safeOn: string[];
  };
  indexed?: {
    google: number;
    bing: number;
    total: number;
  };
  expired?: boolean;
  expiryDate?: string;
  domainRating?: number;
  trustScore?: number;
  spam?: boolean;
  backlinks?: number;
  mobileCompatible?: boolean;
  metrics?: {
    loadTime: number;
    pageSize: number;
    seoScore: number;
    securityScore: number;
  };
  errors?: string[];
  warnings?: string[];
}

interface BulkDomainResult {
  domain: string;
  rating: number;
  authority: number;
  backlinks: number;
  status: "active" | "expired" | "error";
}

const DomainsToolsDetailed = () => {
  const [domain, setDomain] = useState<string>("");
  const [bulkDomains, setBulkDomains] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [targetTLD, setTargetTLD] = useState<string>(".com");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<DomainResult | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkDomainResult[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [expiredResults, setExpiredResults] = useState<{domain: string, expiryDate: string, backlinks: number}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("lookup");
  const { toast } = useToast();

  // Extract the tool slug from the URL
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleDomainLookup = () => {
    setError(null);
    setResults(null);

    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const mockResult: DomainResult = {
          name: domain.toLowerCase(),
        };

        // Add tool-specific data based on toolSlug
        switch (toolSlug) {
          case "domain-age-checker":
            mockResult.age = {
              registered: "2010-03-15",
              years: 14,
            };
            break;
          case "domain-ip-lookup":
          case "domain-to-ip":
            mockResult.ip = "192.168.1.1";
            break;
          case "domain-hosting-checker":
            mockResult.hosting = {
              provider: "Amazon Web Services",
              location: "Virginia, USA",
              dataCenter: "AWS us-east-1",
            };
            break;
          case "domain-authority-checker":
            mockResult.authority = {
              score: 68,
              status: "good",
            };
            mockResult.backlinks = 12458;
            mockResult.trustScore = 72;
            break;
          case "find-dns-records":
            mockResult.dns = {
              a: ["192.168.1.1"],
              mx: ["mail.example.com"],
              ns: ["ns1.example.com", "ns2.example.com"],
              txt: ["v=spf1 include:_spf.example.com ~all"],
              cname: ["www.example.com"],
            };
            break;
          case "check-blacklist-ip":
            mockResult.blacklist = {
              status: "Clean",
              listedOn: [],
              safeOn: ["SpamCop", "Spamhaus", "Barracuda", "SORBS"],
            };
            break;
          case "index-pages-checker":
            mockResult.indexed = {
              google: 15280,
              bing: 12450,
              total: 27730,
            };
            break;
          default:
            // Generic information for other tools
            mockResult.age = {
              registered: "2010-03-15",
              years: 14,
            };
            mockResult.ip = "192.168.1.1";
            mockResult.hosting = {
              provider: "Amazon Web Services",
              location: "Virginia, USA",
              dataCenter: "AWS us-east-1",
            };
            mockResult.authority = {
              score: 68,
              status: "good",
            };
            mockResult.dns = {
              a: ["192.168.1.1"],
              mx: ["mail.example.com"],
              ns: ["ns1.example.com", "ns2.example.com"],
              txt: ["v=spf1 include:_spf.example.com ~all"],
              cname: ["www.example.com"],
            };
            mockResult.metrics = {
              loadTime: 1.2,
              pageSize: 3.5,
              seoScore: 82,
              securityScore: 75,
            };
            break;
        }

        setResults(mockResult);
        toast({
          title: "Success",
          description: `Domain analysis for ${domain} completed.`,
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 1500); // Simulate API delay
  };

  const handleBulkCheck = () => {
    setError(null);
    setBulkResults([]);

    if (!bulkDomains.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one domain",
        variant: "destructive",
      });
      return;
    }

    const domainList = bulkDomains
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d);

    if (domainList.length > 20) {
      toast({
        title: "Warning",
        description: "For demo purposes, we've limited the bulk check to 20 domains.",
      });
    }

    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const mockResults: BulkDomainResult[] = domainList.slice(0, 20).map((domain) => ({
          domain,
          rating: Math.floor(Math.random() * 100),
          authority: Math.floor(Math.random() * 100),
          backlinks: Math.floor(Math.random() * 10000),
          status: Math.random() > 0.9 ? "expired" : "active",
        }));

        setBulkResults(mockResults);
        toast({
          title: "Success",
          description: `Checked ${mockResults.length} domains successfully.`,
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 2000); // Simulate API delay
  };

  const handleDomainSearch = () => {
    setError(null);
    setSearchResults([]);

    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter keywords for domain search",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const keywordsList = keywords.toLowerCase().split(" ");
        const mockDomains: string[] = [];

        // Generate domain suggestions based on keywords
        for (const keyword of keywordsList) {
          if (keyword.length > 3) {
            mockDomains.push(`${keyword}${targetTLD}`);
            mockDomains.push(`the${keyword}${targetTLD}`);
            mockDomains.push(`${keyword}online${targetTLD}`);
            mockDomains.push(`${keyword}web${targetTLD}`);
            mockDomains.push(`my${keyword}${targetTLD}`);
          }
        }

        // Generate combinations of keywords
        if (keywordsList.length > 1) {
          for (let i = 0; i < keywordsList.length - 1; i++) {
            for (let j = i + 1; j < keywordsList.length; j++) {
              mockDomains.push(`${keywordsList[i]}${keywordsList[j]}${targetTLD}`);
              mockDomains.push(`${keywordsList[i]}-${keywordsList[j]}${targetTLD}`);
            }
          }
        }

        // Check for TLD variations
        const tldVariations = [".com", ".net", ".org", ".io"];
        if (keywordsList.length >= 1) {
          for (const tld of tldVariations) {
            if (tld !== targetTLD) {
              mockDomains.push(`${keywordsList[0]}${tld}`);
            }
          }
        }

        setSearchResults(Array.from(new Set(mockDomains)).slice(0, 20)); // Remove duplicates and limit to 20
        toast({
          title: "Success",
          description: `Found ${Math.min(mockDomains.length, 20)} potential domain names.`,
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 1500); // Simulate API delay
  };

  const handleFindExpiredDomains = () => {
    setError(null);
    setExpiredResults([]);

    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter keywords for finding expired domains",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call with mock data
    setTimeout(() => {
      try {
        const keywordsList = keywords.toLowerCase().split(" ");
        const mockExpiredDomains: {domain: string, expiryDate: string, backlinks: number}[] = [];

        // Generate expired domain suggestions based on keywords
        for (const keyword of keywordsList) {
          if (keyword.length > 3) {
            // Generate random expiry dates in the past 30 days
            const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() - randomDaysAgo);
            const formattedDate = expiryDate.toISOString().split('T')[0];
            
            mockExpiredDomains.push({
              domain: `${keyword}site.com`,
              expiryDate: formattedDate,
              backlinks: Math.floor(Math.random() * 5000)
            });
            
            mockExpiredDomains.push({
              domain: `${keyword}web.net`,
              expiryDate: formattedDate,
              backlinks: Math.floor(Math.random() * 5000)
            });
            
            mockExpiredDomains.push({
              domain: `my${keyword}.org`,
              expiryDate: formattedDate,
              backlinks: Math.floor(Math.random() * 5000)
            });
          }
        }

        // Sort by backlinks (higher first)
        mockExpiredDomains.sort((a, b) => b.backlinks - a.backlinks);

        setExpiredResults(mockExpiredDomains.slice(0, 10)); // Limit to 10
        toast({
          title: "Success",
          description: `Found ${Math.min(mockExpiredDomains.length, 10)} expired domains.`,
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 2000); // Simulate API delay
  };

  const getAuthorityColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getAuthorityText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "poor":
        return "Poor";
      default:
        return "Unknown";
    }
  };

  const getToolContent = () => {
    // Default content
    let content = {
      introduction: "Analyze domain information with precision and ease.",
      description: "Our comprehensive domain analysis tools provide detailed insights into domain age, IP address, hosting information, and more. Whether you're researching competitors, checking domain information for SEO, or looking for expired domains, our suite of tools gives you accurate, up-to-date information to make informed decisions.",
      howToUse: [
        "Enter the domain name you want to analyze",
        "Select the specific domain tool based on your needs",
        "Click the analyze button to get detailed domain information",
        "Review the comprehensive results provided by the tool"
      ],
      features: [
        "Fast and accurate domain analysis",
        "Comprehensive data about domain age, IP, hosting",
        "DNS records and technical information",
        "Domain authority and rating metrics",
        "Blacklist and security checks",
        "Search engine indexing information",
        "Bulk domain checking capabilities"
      ],
      faqs: [
        {
          question: "How accurate is the domain age information?",
          answer: "Our domain age checker pulls data from WHOIS databases to provide the most accurate registration information available. However, some domains may have privacy protection that limits the visible information."
        },
        {
          question: "Can I use these tools for bulk domain analysis?",
          answer: "Yes, our bulk domain rating checker allows you to analyze multiple domains at once, saving you time when researching several properties."
        },
        {
          question: "How often is the domain information updated?",
          answer: "Our tools pull real-time information from various sources whenever you run an analysis, ensuring you get the most current data available."
        },
        {
          question: "What does domain authority mean?",
          answer: "Domain authority is a metric developed to predict how well a website will rank on search engines. It's calculated based on factors like age, popularity, and size, with scores ranging from 1 to 100."
        }
      ]
    };

    // Tool-specific content
    switch (toolSlug) {
      case "domain-age-checker":
        content = {
          introduction: "Discover exactly how old any domain is with our Domain Age Checker.",
          description: "Our Domain Age Checker tool reveals when a domain was first registered, giving you valuable insights for SEO research, domain acquisition, or competitor analysis. Understanding domain age helps evaluate credibility, as older domains often have established authority, backlink profiles, and trust with search engines.",
          howToUse: [
            "Enter the domain name you want to check (e.g., example.com)",
            "Click 'Check Domain Age'",
            "View detailed information about when the domain was registered",
            "See the exact age of the domain in years, months, and days"
          ],
          features: [
            "Accurate registration date verification",
            "Precise domain age calculation",
            "Historical ownership information (where available)",
            "Last renewal date tracking",
            "Expiration date monitoring",
            "Domain maturity assessment for SEO"
          ],
          faqs: [
            {
              question: "Why is domain age important?",
              answer: "Domain age is a factor in SEO rankings, as older domains generally have more established authority. It's also important for assessing the reputation and legitimacy of a website or business."
            },
            {
              question: "Does domain age directly impact SEO?",
              answer: "While not a direct ranking factor, domain age correlates with authority. Older domains have had more time to build quality backlinks, content, and user engagement signals that do impact rankings."
            },
            {
              question: "Can I check domain age for any TLD?",
              answer: "Yes, our tool works with all top-level domains, including .com, .net, .org, country codes like .uk or .au, and newer extensions like .io or .app."
            },
            {
              question: "How accurate is the domain age information?",
              answer: "Our tool accesses WHOIS databases for accurate registration dates. However, domains with privacy protection or those transferred between registrars may have limited available information."
            }
          ]
        };
        break;
        
      case "domain-ip-lookup":
        content = {
          introduction: "Find the IP address of any domain with our Domain IP Lookup tool.",
          description: "Our Domain IP Lookup tool allows you to quickly discover the IP address (or addresses) associated with any domain name. This is invaluable for network troubleshooting, security research, website migration planning, or simply understanding the hosting infrastructure of a website.",
          howToUse: [
            "Enter the domain name you want to look up (e.g., example.com)",
            "Click 'Lookup IP Address'",
            "View the IP address(es) associated with the domain",
            "See additional information like location and hosting provider"
          ],
          features: [
            "Fast DNS resolution to IP addresses",
            "Support for multiple A records",
            "IPv4 and IPv6 address detection",
            "Geolocation information for IPs",
            "Hosting provider identification",
            "Additional technical details"
          ],
          faqs: [
            {
              question: "Why would I need to look up a domain's IP address?",
              answer: "IP lookups are useful for network troubleshooting, checking if multiple domains share the same server, security research, verifying email senders, or preparing for website migrations."
            },
            {
              question: "Can a domain have multiple IP addresses?",
              answer: "Yes, many domains use multiple IP addresses for load balancing, redundancy, or content delivery networks (CDNs). Our tool displays all associated IPs."
            },
            {
              question: "Does the tool work with subdomains?",
              answer: "Yes, you can look up IPs for both main domains (example.com) and subdomains (blog.example.com), which may resolve to different IP addresses."
            },
            {
              question: "Can IP addresses change over time?",
              answer: "Yes, websites may change their hosting providers or infrastructure, resulting in new IP addresses. Our tool always shows the current IP resolution."
            }
          ]
        };
        break;
        
      case "domain-hosting-checker":
        content = {
          introduction: "Discover where any website is hosted with our Domain Hosting Checker.",
          description: "Our Domain Hosting Checker reveals the hosting provider, server location, and data center information for any domain. This intelligence is valuable for competitive research, performance analysis, or when planning website migrations to evaluate potential hosting options.",
          howToUse: [
            "Enter the domain name you want to investigate (e.g., example.com)",
            "Click 'Check Hosting'",
            "View detailed hosting information including provider and location",
            "See additional server and infrastructure details"
          ],
          features: [
            "Accurate hosting provider identification",
            "Server location detection",
            "Data center information",
            "IP address verification",
            "Server type detection (when available)",
            "Hosting infrastructure insights"
          ],
          faqs: [
            {
              question: "How can knowing a domain's hosting provider be useful?",
              answer: "This information helps with competitive research, troubleshooting performance issues, evaluating hosting options based on competitors, and understanding website infrastructure."
            },
            {
              question: "Can the tool detect all hosting providers?",
              answer: "Our tool identifies most major hosting providers and services. Some custom or private hosting arrangements may show the network provider rather than the specific hosting company."
            },
            {
              question: "Does server location affect website performance?",
              answer: "Yes, server location impacts loading speeds for visitors in different geographic regions. Servers closer to users generally provide faster load times."
            },
            {
              question: "Can I check if multiple websites share the same hosting?",
              answer: "Yes, by checking multiple domains and comparing results, you can identify websites that may be hosted on the same server or with the same provider."
            }
          ]
        };
        break;
        
      case "domain-authority-checker":
        content = {
          introduction: "Check the SEO strength of any domain with our Domain Authority Checker.",
          description: "Our Domain Authority Checker tool measures the predicted search engine ranking strength of a domain on a 1-100 scale. This metric helps you evaluate website credibility, compare competitive domains, track SEO progress over time, and identify valuable domains for acquisition or link building.",
          howToUse: [
            "Enter the domain name you want to analyze (e.g., example.com)",
            "Click 'Check Domain Authority'",
            "View the domain authority score (1-100)",
            "Review additional metrics like trust score and backlink data"
          ],
          features: [
            "Accurate domain authority measurement",
            "Trust score assessment",
            "Backlink quantity analysis",
            "Referring domain evaluation",
            "Historical authority tracking",
            "Competitive domain comparison"
          ],
          faqs: [
            {
              question: "What is a good domain authority score?",
              answer: "Scores are relative and should be compared to direct competitors. Generally, scores above 50 are considered good, above 60 are strong, and above 80 are excellent."
            },
            {
              question: "How can I improve my domain authority?",
              answer: "Focus on quality backlinks from reputable sites, create excellent content, improve technical SEO, maintain a good user experience, and be patient as authority builds over time."
            },
            {
              question: "Is domain authority a Google ranking factor?",
              answer: "No, domain authority is a third-party metric and not directly used by Google. However, it correlates well with many factors that do influence search rankings."
            },
            {
              question: "How often is domain authority updated?",
              answer: "Our tool provides real-time domain authority checks. The underlying metrics typically update monthly, but significant changes to a site can be reflected sooner."
            }
          ]
        };
        break;
        
      case "find-dns-records":
        content = {
          introduction: "Reveal all DNS records for any domain with our DNS Records Finder.",
          description: "Our DNS Records Finder tool provides comprehensive access to all DNS records associated with a domain, including A, MX, NS, TXT, and CNAME records. This information is invaluable for domain management, email setup, troubleshooting, security analysis, and technical configuration verification.",
          howToUse: [
            "Enter the domain name you want to investigate (e.g., example.com)",
            "Click 'Find DNS Records'",
            "View all DNS records organized by type",
            "Analyze the complete DNS configuration of the domain"
          ],
          features: [
            "Complete A record lookup (IPv4 addresses)",
            "MX record discovery for email servers",
            "NS (nameserver) record identification",
            "TXT record display (SPF, DKIM, verification records)",
            "CNAME record detection",
            "AAAA record lookup (IPv6 addresses)",
            "TTL (Time To Live) values"
          ],
          faqs: [
            {
              question: "Why would I need to check a domain's DNS records?",
              answer: "DNS lookups are useful for verifying email server configuration, diagnosing website issues, confirming domain ownership verification, checking SPF/DKIM for email security, and validating technical setup."
            },
            {
              question: "What are the different types of DNS records?",
              answer: "A records point to IPv4 addresses, AAAA to IPv6 addresses, MX records direct email delivery, NS records specify nameservers, CNAME records are aliases to other domains, and TXT records hold text information like SPF policies."
            },
            {
              question: "How long do DNS changes take to propagate?",
              answer: "DNS propagation typically takes 24-48 hours worldwide, though many changes appear much faster in some regions. The TTL value indicates how long record caching is permitted."
            },
            {
              question: "Can I check DNS records for subdomains?",
              answer: "Yes, our tool allows you to check DNS records for both main domains and subdomains, revealing their specific configurations."
            }
          ]
        };
        break;
        
      case "domain-name-search":
        content = {
          introduction: "Find the perfect domain name with our Domain Name Search tool.",
          description: "Our Domain Name Search tool helps you discover available domain names based on your keywords and business ideas. Whether you're launching a new website, business, or project, this tool generates creative domain suggestions across various extensions to help you secure the ideal online identity.",
          howToUse: [
            "Enter keywords related to your business or project",
            "Select your preferred TLD (Top-Level Domain) extension",
            "Click 'Search Domains'",
            "Browse available domain suggestions based on your keywords",
            "Filter and sort results to find the perfect domain name"
          ],
          features: [
            "Keyword-based domain suggestions",
            "Multiple TLD options (.com, .net, .org, etc.)",
            "Availability checking",
            "Creative name combinations",
            "Alternative suggestion generation",
            "Domain quality assessment"
          ],
          faqs: [
            {
              question: "What makes a good domain name?",
              answer: "Good domain names are memorable, easy to spell, relatively short, relate to your brand or content, avoid hyphens and numbers when possible, and use appropriate extensions for your purpose."
            },
            {
              question: "Which domain extension should I choose?",
              answer: ".com remains the most recognized and preferred extension for businesses. However, .org (nonprofits), .io (tech), .co (business), or country-specific extensions may be appropriate depending on your project."
            },
            {
              question: "Should I get multiple domain extensions?",
              answer: "If budget allows, securing your name across multiple extensions (especially .com, .net, .org) protects your brand and prevents competitors or others from using similar domains."
            },
            {
              question: "How do I check if a domain name is trademarked?",
              answer: "Our tool checks availability, but you should separately verify trademark status through trademark databases or legal counsel to avoid potential infringement issues."
            }
          ]
        };
        break;
        
      case "domain-to-ip":
        content = {
          introduction: "Convert any domain name to its IP address with our Domain to IP tool.",
          description: "Our Domain to IP conversion tool allows you to quickly translate domain names into their corresponding IP addresses. This essential networking utility helps with server configuration, network troubleshooting, security research, and understanding website hosting infrastructure.",
          howToUse: [
            "Enter the domain name you want to convert (e.g., example.com)",
            "Click 'Convert to IP'",
            "View the IP address(es) the domain resolves to",
            "See additional hosting and location information"
          ],
          features: [
            "Fast domain to IP resolution",
            "Support for both IPv4 and IPv6 addresses",
            "Multiple IP detection for load-balanced domains",
            "Geolocation information",
            "Hosting provider identification",
            "Bulk conversion capabilities"
          ],
          faqs: [
            {
              question: "How is this different from the Domain IP Lookup tool?",
              answer: "The Domain to IP tool focuses specifically on the direct translation between domain names and IP addresses, with a streamlined interface for quick reference and bulk processing."
            },
            {
              question: "Why would I need to convert a domain to an IP address?",
              answer: "This conversion is useful for server configuration, firewall rules, troubleshooting network issues, bypassing DNS, or verifying if multiple domains share the same server."
            },
            {
              question: "Can I convert multiple domains at once?",
              answer: "Yes, our tool supports bulk conversion by entering multiple domains (one per line) to efficiently process several lookups simultaneously."
            },
            {
              question: "Will this show all IP addresses for a domain?",
              answer: "Yes, if a domain uses multiple IP addresses for load balancing or global distribution, our tool will display all associated IP addresses."
            }
          ]
        };
        break;
        
      case "check-blacklist-ip":
        content = {
          introduction: "Verify if an IP address is blacklisted with our IP Blacklist Checker.",
          description: "Our IP Blacklist Checker tool scans an IP address across major spam databases and blocklists to determine if it has been flagged for suspicious activity. This is crucial for email deliverability, server reputation management, and diagnosing delivery issues for websites and mail servers.",
          howToUse: [
            "Enter the IP address or domain you want to check",
            "Click 'Check Blacklist Status'",
            "View comprehensive results from multiple blacklist databases",
            "See which lists, if any, have flagged the IP address"
          ],
          features: [
            "Checks against 50+ major DNSBL/RBL databases",
            "Domain to IP resolution for domain checks",
            "Detailed listing information for flagged IPs",
            "Reason codes for blacklisting (when available)",
            "Whitelist verification",
            "Reputation score assessment"
          ],
          faqs: [
            {
              question: "Why might an IP address be blacklisted?",
              answer: "IPs can be blacklisted for sending spam, hosting malware, participating in botnet activity, having vulnerable servers, sending high bounce rate emails, or being reported by users for suspicious activity."
            },
            {
              question: "How does blacklisting affect a website or email?",
              answer: "Blacklisted IPs may experience reduced email deliverability (emails go to spam or are rejected), website accessibility issues, lower search rankings, payment processing problems, and general reputation damage."
            },
            {
              question: "What should I do if my IP is blacklisted?",
              answer: "Identify and fix the underlying issue (secure compromised servers, stop spam activities), then submit delisting requests to each blacklist with evidence of remediation. Prevention through proper security and email practices is always preferable."
            },
            {
              question: "How often should I check my IP reputation?",
              answer: "For businesses sending emails or hosting important services, monthly checks are recommended. After any security incident or if experiencing deliverability issues, immediate checks should be performed."
            }
          ]
        };
        break;
        
      case "find-expired-domains":
        content = {
          introduction: "Discover valuable expired domains with our Expired Domain Finder.",
          description: "Our Expired Domain Finder helps you identify recently expired domain names that are available for registration. These domains often come with existing backlinks, age authority, and established traffic, making them valuable for new projects, redirects to boost SEO, or developing authoritative websites in specific niches.",
          howToUse: [
            "Enter keywords related to your niche or industry",
            "Click 'Find Expired Domains'",
            "Browse recently expired domains matching your criteria",
            "View detailed metrics including backlinks and expiry dates",
            "Sort and filter to find the most valuable domains"
          ],
          features: [
            "Keyword-based expired domain discovery",
            "Backlink profile analysis",
            "Domain age verification",
            "Expiration date confirmation",
            "Traffic estimation",
            "Niche relevance scoring",
            "Available TLD variations"
          ],
          faqs: [
            {
              question: "Why are expired domains valuable?",
              answer: "Expired domains can have existing backlinks, established age (important for SEO), previous traffic, indexed pages, and industry relevance—all factors that would take years to build from scratch with a new domain."
            },
            {
              question: "How do I evaluate an expired domain's quality?",
              answer: "Look at backlink quantity and quality, domain age, previous traffic, relevance to your niche, absence of spam history, consistent topical focus, and brand potential."
            },
            {
              question: "Can I use expired domains for a new website?",
              answer: "Yes, expired domains can be used for new websites, but it's important to maintain topical relevance to the domain's history to benefit from existing authority and backlinks."
            },
            {
              question: "Are all expired domains immediately available?",
              answer: "No, many domains go through a redemption period where the original owner can reclaim them. Our tool focuses on domains that have completed this process and are available for general registration."
            }
          ]
        };
        break;
        
      case "bulk-domain-rating-checker":
        content = {
          introduction: "Analyze multiple domains at once with our Bulk Domain Rating Checker.",
          description: "Our Bulk Domain Rating Checker tool allows you to evaluate the authority, backlink profiles, and overall SEO strength of multiple domains simultaneously. This is invaluable for competitive analysis, link prospecting, acquisition research, or efficiently auditing a portfolio of websites.",
          howToUse: [
            "Enter multiple domains (one per line)",
            "Click 'Check Domains'",
            "View comprehensive metrics for all domains in a single report",
            "Compare and analyze domain performance side by side"
          ],
          features: [
            "Process up to 100 domains simultaneously",
            "Domain rating/authority scores",
            "Backlink profile analysis",
            "Referring domains count",
            "Trust metrics",
            "Export results functionality",
            "Comparative analysis tools"
          ],
          faqs: [
            {
              question: "How many domains can I check at once?",
              answer: "Our tool allows checking up to 100 domains at once, making it efficient for large-scale analysis while maintaining accuracy and reasonable processing times."
            },
            {
              question: "What metrics are included in bulk reports?",
              answer: "Reports include domain authority/rating, trust scores, total backlinks, referring domains count, estimated organic traffic, and domain status (active/expired)."
            },
            {
              question: "How can I use bulk domain analysis for SEO?",
              answer: "Use bulk analysis to identify strong link opportunities, evaluate competitor websites, research potential domain acquisitions, audit client portfolios, or monitor your domains' progress over time."
            },
            {
              question: "Can I export the bulk analysis results?",
              answer: "Yes, our tool allows exporting results in CSV format for further analysis, reporting, or integration with other SEO tools and workflows."
            }
          ]
        };
        break;
        
      case "index-pages-checker":
        content = {
          introduction: "Discover how many pages are indexed by search engines with our Index Pages Checker.",
          description: "Our Index Pages Checker reveals how many pages from a domain are currently indexed in major search engines like Google and Bing. This vital SEO metric helps you identify indexation issues, confirm content visibility, track crawling progress, and compare your site's footprint against competitors.",
          howToUse: [
            "Enter the domain you want to analyze (e.g., example.com)",
            "Click 'Check Indexed Pages'",
            "View the number of pages indexed in major search engines",
            "Analyze indexation patterns and potential issues"
          ],
          features: [
            "Google indexation statistics",
            "Bing indexation data",
            "Subpath indexation analysis",
            "Historical indexation tracking",
            "Comparative indexation reporting",
            "Indexation issue identification"
          ],
          faqs: [
            {
              question: "Why is knowing indexed page count important?",
              answer: "Indexation metrics help identify crawling issues, confirm content visibility in search engines, evaluate site structure effectiveness, and understand your site's search footprint compared to competitors."
            },
            {
              question: "What causes pages not to be indexed?",
              answer: "Common reasons include robots.txt blocking, noindex tags, poor internal linking, low-quality content, duplicate content issues, technical problems like server errors, or slow loading pages."
            },
            {
              question: "Is higher indexation always better?",
              answer: "Not necessarily. Quality matters more than quantity. Having too many low-value pages indexed (like tag pages, thin content, etc.) can dilute your site's authority. Focus on meaningful, valuable content."
            },
            {
              question: "How can I improve indexation?",
              answer: "Improve indexation by creating quality content, implementing proper internal linking, using sitemaps, ensuring good technical SEO, fixing crawl errors, avoiding duplicate content, and regularly publishing new content."
            }
          ]
        };
        break;
    }

    return content;
  };

  const toolContent = getToolContent();

  const renderDomainAgeResults = () => {
    if (!results || !results.age) return null;
    
    const registrationDate = new Date(results.age.registered);
    const formattedDate = registrationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Domain Age</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="text-lg font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Domain Age</p>
                  <p className="text-lg font-medium">{results.age.years} years</p>
                </div>
                <div className="pt-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {results.age.years > 10 ? "Mature Domain" : "Developing Domain"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Domain Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Domain Name</p>
                  <p className="text-lg font-medium">{results.name}</p>
                </div>
                {results.ip && (
                  <div>
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="font-mono">{results.ip}</p>
                  </div>
                )}
                {results.hosting && (
                  <div>
                    <p className="text-sm text-gray-500">Hosting Provider</p>
                    <p>{results.hosting.provider}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Age Analysis</h3>
            <p className="mb-4">
              {results.name} was registered on {formattedDate}, making it {results.age.years} years old. 
              {results.age.years > 10 
                ? " This is a mature domain with significant age, which can be beneficial for search engine rankings and credibility." 
                : " This domain is still developing age authority, which develops over time."}
            </p>
            
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Domain Age Significance</p>
              <Progress value={Math.min(results.age.years * 5, 100)} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>New</span>
                <span>5 Years</span>
                <span>10 Years</span>
                <span>15+ Years</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderIPLookupResults = () => {
    if (!results || !results.ip) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">IP Address Results</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Domain Name</p>
                <p className="text-lg font-medium">{results.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <p className="text-lg font-mono">{results.ip}</p>
              </div>
              {results.hosting && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Server Location</p>
                    <p>{results.hosting.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hosting Provider</p>
                    <p>{results.hosting.provider}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {results.dns && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Additional DNS Information</h3>
              <div className="space-y-3">
                {results.dns.ns && results.dns.ns.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Nameservers</p>
                    <ul className="list-disc list-inside">
                      {results.dns.ns.map((ns, index) => (
                        <li key={index}>{ns}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.dns.mx && results.dns.mx.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Mail Servers</p>
                    <ul className="list-disc list-inside">
                      {results.dns.mx.map((mx, index) => (
                        <li key={index}>{mx}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderHostingResults = () => {
    if (!results || !results.hosting) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Hosting Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Domain Name</p>
                  <p className="text-lg font-medium">{results.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hosting Provider</p>
                  <p className="text-lg font-medium">{results.hosting.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Server Location</p>
                  <p>{results.hosting.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data Center</p>
                  <p>{results.hosting.dataCenter}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
              <div className="space-y-3">
                {results.ip && (
                  <div>
                    <p className="text-sm text-gray-500">IP Address</p>
                    <p className="font-mono">{results.ip}</p>
                  </div>
                )}
                {results.dns && results.dns.ns && (
                  <div>
                    <p className="text-sm text-gray-500">Nameservers</p>
                    <ul className="text-sm">
                      {results.dns.ns.map((ns, index) => (
                        <li key={index}>{ns}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.metrics && (
                  <div>
                    <p className="text-sm text-gray-500">Server Performance</p>
                    <p>Response Time: {results.metrics.loadTime}s</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderAuthorityResults = () => {
    if (!results || !results.authority) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Domain Authority</h3>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-blue-50 mb-3">
                    <span className="text-4xl font-bold text-blue-600">{results.authority.score}</span>
                  </div>
                  <p className="text-center">
                    <Badge className={getAuthorityColor(results.authority.score)}>
                      {getAuthorityText(results.authority.status)}
                    </Badge>
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-1">Domain Authority Scale</p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full" 
                      style={{ width: `${results.authority.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Additional Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Domain Name</p>
                  <p className="text-lg font-medium">{results.name}</p>
                </div>
                {results.trustScore !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Trust Score</p>
                    <div className="flex items-center">
                      <p className="text-lg font-medium mr-2">{results.trustScore}/100</p>
                      <Badge className={getAuthorityColor(results.trustScore)}>
                        {results.trustScore >= 70 ? "High Trust" : results.trustScore >= 50 ? "Moderate Trust" : "Low Trust"}
                      </Badge>
                    </div>
                  </div>
                )}
                {results.backlinks !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Backlinks</p>
                    <p className="text-lg font-medium">{results.backlinks.toLocaleString()}</p>
                  </div>
                )}
                {results.age && (
                  <div>
                    <p className="text-sm text-gray-500">Domain Age</p>
                    <p>{results.age.years} years</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Authority Analysis</h3>
            <p className="mb-4">
              {results.name} has a domain authority score of {results.authority.score}, which is considered {results.authority.status}.
              {results.authority.score >= 60 
                ? " This indicates strong SEO potential and established credibility." 
                : results.authority.score >= 40
                ? " This shows moderate SEO potential with room for improvement."
                : " This suggests the domain is still developing its SEO strength."}
            </p>
            
            {results.backlinks !== undefined && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">Backlink Profile: {results.backlinks.toLocaleString()} backlinks</p>
                <Progress 
                  value={Math.min(results.backlinks / 100, 100)} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {results.backlinks > 10000 
                    ? "Strong backlink profile" 
                    : results.backlinks > 1000
                    ? "Developing backlink profile"
                    : "Limited backlink profile"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDNSResults = () => {
    if (!results || !results.dns) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">DNS Records for {results.name}</h3>
            
            {results.dns.a && results.dns.a.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">A Records</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {results.dns.a.map((record, index) => (
                    <div key={index} className="font-mono text-sm mb-1">{record}</div>
                  ))}
                </div>
              </div>
            )}
            
            {results.dns.mx && results.dns.mx.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">MX Records</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {results.dns.mx.map((record, index) => (
                    <div key={index} className="font-mono text-sm mb-1">{record}</div>
                  ))}
                </div>
              </div>
            )}
            
            {results.dns.ns && results.dns.ns.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">NS Records</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {results.dns.ns.map((record, index) => (
                    <div key={index} className="font-mono text-sm mb-1">{record}</div>
                  ))}
                </div>
              </div>
            )}
            
            {results.dns.txt && results.dns.txt.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">TXT Records</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {results.dns.txt.map((record, index) => (
                    <div key={index} className="font-mono text-sm mb-1 break-all">{record}</div>
                  ))}
                </div>
              </div>
            )}
            
            {results.dns.cname && results.dns.cname.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-2">CNAME Records</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {results.dns.cname.map((record, index) => (
                    <div key={index} className="font-mono text-sm mb-1">{record}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBlacklistResults = () => {
    if (!results || !results.blacklist) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold">Blacklist Check Results</h3>
              <Badge className={
                results.blacklist.status === "Clean" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }>
                {results.blacklist.status}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Domain/IP Checked</p>
                <p className="text-lg font-medium">{results.name}</p>
                {results.ip && <p className="text-sm font-mono">{results.ip}</p>}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Blacklist Status</p>
                <p className="text-lg font-medium">
                  {results.blacklist.status === "Clean" 
                    ? "Not listed on any blacklists" 
                    : `Listed on ${results.blacklist.listedOn.length} blacklists`}
                </p>
              </div>
            </div>
            
            {results.blacklist.listedOn && results.blacklist.listedOn.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Listed On</h4>
                <div className="bg-red-50 p-3 rounded-md">
                  {results.blacklist.listedOn.map((list, index) => (
                    <div key={index} className="flex items-center text-sm mb-1">
                      <span className="text-red-500 mr-2">●</span>
                      {list}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {results.blacklist.safeOn && results.blacklist.safeOn.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Safe On</h4>
                <div className="bg-green-50 p-3 rounded-md">
                  {results.blacklist.safeOn.map((list, index) => (
                    <div key={index} className="flex items-center text-sm mb-1">
                      <span className="text-green-500 mr-2">●</span>
                      {list}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderIndexedPagesResults = () => {
    if (!results || !results.indexed) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Indexed Pages Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Domain</p>
                  <p className="text-lg font-medium">{results.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Indexed Pages</p>
                  <p className="text-3xl font-bold text-blue-600">{results.indexed.total.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Google</p>
                    <p className="text-lg font-medium">{results.indexed.google.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bing</p>
                    <p className="text-lg font-medium">{results.indexed.bing.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Indexation Analysis</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Google Indexation</p>
                  <Progress 
                    value={(results.indexed.google / (results.indexed.total || 1)) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((results.indexed.google / (results.indexed.total || 1)) * 100)}% of total indexed pages
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bing Indexation</p>
                  <Progress 
                    value={(results.indexed.bing / (results.indexed.total || 1)) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((results.indexed.bing / (results.indexed.total || 1)) * 100)}% of total indexed pages
                  </p>
                </div>
                
                <div className="pt-2">
                  <Badge className={
                    results.indexed.total > 10000 
                      ? "bg-green-100 text-green-800" 
                      : results.indexed.total > 1000
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }>
                    {results.indexed.total > 10000 
                      ? "Large Website" 
                      : results.indexed.total > 1000
                      ? "Medium Website"
                      : "Small Website"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderDomainSearchResults = () => {
    if (!searchResults || searchResults.length === 0) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Domain Suggestions</h3>
            <p className="mb-4">
              We found {searchResults.length} potential domain names based on your keywords.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((domain, index) => (
                <div key={index} className="flex items-center p-3 border rounded-md">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-2">
                    ✓
                  </span>
                  <span className="font-medium">{domain}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  const renderBulkRatingResults = () => {
    if (!bulkResults || bulkResults.length === 0) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Bulk Domain Analysis Results</h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Backlinks</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.domain}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{result.rating}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${result.rating}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAuthorityColor(result.authority)}>
                          {result.authority}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.backlinks.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          result.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }>
                          {result.status === "active" ? "Active" : "Expired"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderExpiredDomainsResults = () => {
    if (!expiredResults || expiredResults.length === 0) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Expired Domains Found</h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Backlinks</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.domain}</TableCell>
                      <TableCell>{result.expiryDate}</TableCell>
                      <TableCell>{result.backlinks.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          result.backlinks > 1000 
                            ? "bg-green-100 text-green-800" 
                            : result.backlinks > 100
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }>
                          {result.backlinks > 1000 
                            ? "High" 
                            : result.backlinks > 100
                            ? "Medium"
                            : "Low"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDefaultResults = () => {
    if (!results) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Domain Analysis Results</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Domain Name</p>
                <p className="text-lg font-medium">{results.name}</p>
              </div>
              {results.ip && (
                <div>
                  <p className="text-sm text-gray-500">IP Address</p>
                  <p className="font-mono">{results.ip}</p>
                </div>
              )}
              {results.age && (
                <div>
                  <p className="text-sm text-gray-500">Domain Age</p>
                  <p>{results.age.years} years (Registered: {results.age.registered})</p>
                </div>
              )}
              {results.authority && (
                <div>
                  <p className="text-sm text-gray-500">Domain Authority</p>
                  <div className="flex items-center">
                    <p className="text-lg font-medium mr-2">{results.authority.score}/100</p>
                    <Badge className={getAuthorityColor(results.authority.score)}>
                      {getAuthorityText(results.authority.status)}
                    </Badge>
                  </div>
                </div>
              )}
              {results.hosting && (
                <div>
                  <p className="text-sm text-gray-500">Hosting Provider</p>
                  <p>{results.hosting.provider} ({results.hosting.location})</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {results.dns && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">DNS Records</h3>
              <div className="space-y-3">
                {results.dns.a && results.dns.a.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">A Records</p>
                    <ul className="list-disc list-inside">
                      {results.dns.a.map((record, index) => (
                        <li key={index} className="font-mono text-sm">{record}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.dns.ns && results.dns.ns.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Nameservers</p>
                    <ul className="list-disc list-inside">
                      {results.dns.ns.map((ns, index) => (
                        <li key={index}>{ns}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {results.metrics && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">SEO Score</p>
                  <Progress value={results.metrics.seoScore} className="h-2" />
                  <p className="text-right text-xs text-gray-500 mt-1">{results.metrics.seoScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Security Score</p>
                  <Progress value={results.metrics.securityScore} className="h-2" />
                  <p className="text-right text-xs text-gray-500 mt-1">{results.metrics.securityScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Load Time</p>
                  <p>{results.metrics.loadTime}s</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Page Size</p>
                  <p>{results.metrics.pageSize} MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderToolInterface = () => {
    return (
      <div className="space-y-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="lookup">Domain Lookup</TabsTrigger>
            <TabsTrigger value="search">Domain Search</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Check</TabsTrigger>
            <TabsTrigger value="expired">Expired Domains</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lookup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Enter Domain Name</Label>
                <div className="flex space-x-2 mt-1.5">
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  />
                  <Button onClick={handleDomainLookup} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {results && (
                <div className="mt-6">
                  {toolSlug === "domain-age-checker" && renderDomainAgeResults()}
                  {(toolSlug === "domain-ip-lookup" || toolSlug === "domain-to-ip") && renderIPLookupResults()}
                  {toolSlug === "domain-hosting-checker" && renderHostingResults()}
                  {toolSlug === "domain-authority-checker" && renderAuthorityResults()}
                  {toolSlug === "find-dns-records" && renderDNSResults()}
                  {toolSlug === "check-blacklist-ip" && renderBlacklistResults()}
                  {toolSlug === "index-pages-checker" && renderIndexedPagesResults()}
                  {![
                    "domain-age-checker", 
                    "domain-ip-lookup", 
                    "domain-to-ip",
                    "domain-hosting-checker", 
                    "domain-authority-checker", 
                    "find-dns-records",
                    "check-blacklist-ip",
                    "index-pages-checker"
                  ].includes(toolSlug) && renderDefaultResults()}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="keywords">Enter Keywords</Label>
                <Textarea
                  id="keywords"
                  placeholder="marketing business online"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tld">Preferred TLD</Label>
                  <select
                    id="tld"
                    value={targetTLD}
                    onChange={(e) => setTargetTLD(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value=".com">.com</option>
                    <option value=".net">.net</option>
                    <option value=".org">.org</option>
                    <option value=".io">.io</option>
                    <option value=".co">.co</option>
                    <option value=".app">.app</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={handleDomainSearch} disabled={loading} className="w-full">
                    {loading ? "Searching..." : "Search Domains"}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {renderDomainSearchResults()}
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkDomains">Enter Domains (One Per Line)</Label>
                <Textarea
                  id="bulkDomains"
                  placeholder="example.com
google.com
facebook.com"
                  value={bulkDomains}
                  onChange={(e) => setBulkDomains(e.target.value)}
                  className="mt-1.5 min-h-[150px]"
                />
              </div>
              
              <div className="flex">
                <Button onClick={handleBulkCheck} disabled={loading} className="ml-auto">
                  {loading ? "Checking..." : "Check Domains"}
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {renderBulkRatingResults()}
            </div>
          </TabsContent>
          
          <TabsContent value="expired" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="expiredKeywords">Enter Niche Keywords</Label>
                <Textarea
                  id="expiredKeywords"
                  placeholder="marketing business online"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleFindExpiredDomains} disabled={loading}>
                  {loading ? "Searching..." : "Find Expired Domains"}
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {renderExpiredDomainsResults()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

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
          toolInterface={renderToolInterface()}
        />
      }
    />
  );
};

export default DomainsToolsDetailed;