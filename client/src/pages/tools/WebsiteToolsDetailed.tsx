import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SeoScoreResult {
  score: number;
  metrics: {
    title: { score: number; text: string; issues: string[] };
    meta: { score: number; text: string; issues: string[] };
    headings: { score: number; text: string; issues: string[] };
    content: { score: number; text: string; issues: string[] };
    images: { score: number; text: string; issues: string[] };
    links: { score: number; text: string; issues: string[] };
    performance: { score: number; text: string; issues: string[] };
    mobile: { score: number; text: string; issues: string[] };
  };
  suggestions: string[];
}

interface PageSpeedResult {
  score: number;
  loadTime: string;
  firstContentfulPaint: string;
  speedIndex: string;
  largestContentfulPaint: string;
  timeToInteractive: string;
  totalBlockingTime: string;
  metrics: Record<string, { value: number; score: number }>;
  opportunities: Array<{ name: string; description: string; savings: string }>;
}

interface ScreenshotResult {
  imageUrl: string;
  width: number;
  height: number;
  timestamp: string;
}

interface HttpHeadersResult {
  status: number;
  headers: Record<string, string>;
  timing: {
    dns: number;
    connection: number;
    tls: number;
    firstByte: number;
    download: number;
    total: number;
  };
}

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface SitemapResult {
  count: number;
  entries: SitemapEntry[];
  xml: string;
}

interface EncoderResult {
  original: string;
  encoded: string;
  decoded: string;
}

interface ResultsData {
  seoScore?: SeoScoreResult;
  pageSpeed?: PageSpeedResult;
  screenshot?: ScreenshotResult;
  httpHeaders?: HttpHeadersResult;
  sitemap?: SitemapResult;
  encoderDecoder?: EncoderResult;
  pageSize?: {
    htmlSize: number;
    totalSize: number;
    resources: Array<{ url: string; size: number; type: string }>;
  };
  qrCode?: {
    url: string;
    qrImageUrl: string;
  };
  redirect?: {
    original: string;
    redirectCode: number;
    redirectUrl: string;
    htaccessCode: string;
  };
  metadata?: {
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    otherTags: Record<string, string>;
  };
  speedTest?: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
    isp: string;
    location: string;
  };
  formatResult?: {
    original: string;
    formatted: string;
    lineCount: number;
    charCount: number;
  };
  videoInfo?: {
    title: string;
    thumbnailUrl: string;
    duration: string;
    downloadUrl: string;
    formats: Array<{ quality: string; format: string; size: string; url: string }>;
  };
  minifyResult?: {
    original: string;
    minified: string;
    savings: {
      bytes: number;
      percentage: number;
    };
  };
  robotsTxt?: {
    content: string;
    directives: Array<{
      userAgent: string;
      rules: Array<{ type: string; value: string }>;
    }>;
  };
  urlShortener?: {
    originalUrl: string;
    shortUrl: string;
  };
  websiteCheck?: {
    status: string;
    ssl: {
      valid: boolean;
      expires: string;
      issuer: string;
    };
    dns: Record<string, string[]>;
    response: {
      code: number;
      time: number;
    };
    blacklist: {
      listed: boolean;
      sources: string[];
    };
  };
}

const WebsiteToolsDetailed = () => {
  const [url, setUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const getToolContent = (toolSlug: string) => {
    switch (toolSlug) {
      case "website-seo-score-checker":
        return {
          title: "Website SEO Score Checker",
          introduction: "Check and improve your website's SEO score with our comprehensive analysis tool.",
          description: "Our Website SEO Score Checker performs a thorough analysis of your website's search engine optimization factors. Get detailed insights on title tags, meta descriptions, headings, content quality, image optimization, link structure, and more. This tool helps you identify SEO issues and provides actionable recommendations to improve your search engine rankings.",
          howToUse: [
            "Enter your website URL in the input field",
            "Click the 'Check SEO Score' button",
            "Review the comprehensive SEO analysis",
            "Implement the suggested improvements to boost your rankings"
          ],
          features: [
            "Complete on-page SEO analysis",
            "Page title and meta description evaluation",
            "Heading structure assessment",
            "Content quality analysis",
            "Image optimization check",
            "Internal and external link analysis",
            "Mobile-friendliness test",
            "Page speed insights",
            "Actionable improvement recommendations"
          ],
          faqs: [
            {
              question: "How is the SEO score calculated?",
              answer: "Our SEO score is calculated based on numerous factors including title optimization, meta descriptions, heading structure, content quality, keyword usage, image optimization, link structure, page speed, and mobile-friendliness."
            },
            {
              question: "How often should I check my website's SEO score?",
              answer: "We recommend checking your SEO score after any major website updates and at least once every month to monitor your progress and identify new optimization opportunities."
            },
            {
              question: "Can I check my competitors' websites?",
              answer: "Yes, you can analyze any public website to understand their SEO strengths and weaknesses, helping you develop a more competitive strategy."
            },
            {
              question: "What score is considered good?",
              answer: "A score above 80 is considered good, 60-80 indicates room for improvement, and below 60 suggests significant SEO issues that should be addressed promptly."
            }
          ]
        };
      
      case "page-speed-test":
        return {
          title: "Page Speed Test",
          introduction: "Optimize your website's performance with our comprehensive Page Speed Test tool.",
          description: "Our Page Speed Test tool provides detailed insights into your website's loading performance. Analyze key metrics like First Contentful Paint, Largest Contentful Paint, Time to Interactive, and Total Blocking Time. Get actionable recommendations to optimize images, reduce server response times, eliminate render-blocking resources, and improve overall user experience.",
          howToUse: [
            "Enter your website URL in the input field",
            "Click the 'Test Speed' button",
            "Review the detailed performance analysis",
            "Implement the suggested optimizations to improve load times"
          ],
          features: [
            "Comprehensive performance metrics analysis",
            "Mobile and desktop speed testing",
            "Core Web Vitals assessment",
            "Resource loading visualization",
            "Waterfall chart of network requests",
            "Render-blocking resources identification",
            "Image optimization opportunities",
            "JavaScript and CSS optimization suggestions",
            "Server response time analysis"
          ],
          faqs: [
            {
              question: "Why is page speed important for SEO?",
              answer: "Page speed is a direct ranking factor for search engines. Faster websites provide better user experience, reduce bounce rates, and improve conversion rates. Google specifically considers Core Web Vitals as part of its ranking algorithm."
            },
            {
              question: "What is a good page load time?",
              answer: "Ideally, pages should load in under 2 seconds. For optimal user experience, aim for First Contentful Paint under 1.8 seconds and Largest Contentful Paint under 2.5 seconds."
            },
            {
              question: "How often should I run page speed tests?",
              answer: "Run tests after significant website changes, when adding new features or content, and at least monthly as a regular maintenance check."
            },
            {
              question: "Do you test mobile speed separately?",
              answer: "Yes, our tool tests both mobile and desktop performance since they often differ significantly, and mobile optimization is particularly important for search rankings."
            }
          ]
        };
      
      case "website-screenshot-generator":
        return {
          title: "Website Screenshot Generator",
          introduction: "Capture high-quality screenshots of any website with our free Screenshot Generator tool.",
          description: "Our Website Screenshot Generator creates full-page captures of any website instantly. Perfect for design inspiration, competitor analysis, documentation, presentations, or archiving web content. Choose from multiple viewport sizes to simulate desktop, tablet, or mobile devices, and download images in PNG or JPG formats with customizable dimensions.",
          howToUse: [
            "Enter the website URL you want to capture",
            "Select the desired viewport size (desktop, tablet, mobile)",
            "Choose your preferred image format (PNG or JPG)",
            "Click the 'Generate Screenshot' button",
            "View and download the high-quality screenshot"
          ],
          features: [
            "Full-page website screenshots",
            "Multiple device viewport sizes",
            "High-resolution image quality",
            "PNG and JPG format options",
            "No watermarks on images",
            "Fast processing speed",
            "Desktop and mobile rendering",
            "Customizable capture dimensions",
            "Easy download options"
          ],
          faqs: [
            {
              question: "Can I capture password-protected websites?",
              answer: "Our tool can only capture publicly accessible websites. Password-protected or login-required sites will show the login page in the screenshot."
            },
            {
              question: "What is the maximum resolution for screenshots?",
              answer: "The standard screenshots are generated at 1920×1080 resolution for desktop view, but you can select custom dimensions up to 2560×1440."
            },
            {
              question: "How long does it take to generate a screenshot?",
              answer: "Most screenshots are generated within 5-10 seconds, depending on the website's size and complexity."
            },
            {
              question: "Can I capture dynamic content like sliders?",
              answer: "The tool captures the website as it appears on initial load. Some dynamic content may not be visible if it requires user interaction or takes time to load."
            }
          ]
        };
      
      case "get-http-headers":
        return {
          title: "Get HTTP Headers",
          introduction: "Analyze HTTP headers of any website with our comprehensive header checker tool.",
          description: "Our HTTP Headers tool helps you inspect and analyze the HTTP response headers from any website. Useful for debugging, security analysis, SEO audits, and understanding server configurations. Examine status codes, content types, caching directives, security headers, and more to gain valuable insights into how websites are configured and delivered.",
          howToUse: [
            "Enter the URL you want to analyze",
            "Click the 'Get Headers' button",
            "Review the complete HTTP header response",
            "Analyze security headers, caching settings, content types, and more"
          ],
          features: [
            "Complete HTTP header analysis",
            "Response status code inspection",
            "Security header evaluation",
            "Cache-Control analysis",
            "Server information detection",
            "Content-Type verification",
            "Connection timing metrics",
            "Redirect chain tracking",
            "Custom header detection"
          ],
          faqs: [
            {
              question: "What can I learn from HTTP headers?",
              answer: "HTTP headers reveal valuable information about server configuration, content delivery, caching policies, security measures, compression methods, and potential vulnerabilities or misconfigurations."
            },
            {
              question: "Which security headers should websites implement?",
              answer: "Important security headers include Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection. Our tool checks for these and provides recommendations."
            },
            {
              question: "Can I check headers for specific file types?",
              answer: "Yes, you can enter the direct URL to any resource (images, scripts, stylesheets, etc.) to analyze its specific headers."
            },
            {
              question: "How do HTTP headers affect SEO?",
              answer: "Headers like status codes (e.g., 200, 301, 404), cache controls, and content-type declarations impact how search engines crawl, index, and understand your content, directly affecting SEO performance."
            }
          ]
        };
      
      case "xml-sitemap-generator":
        return {
          title: "XML Sitemap Generator",
          introduction: "Create comprehensive XML sitemaps for better search engine indexing with our free generator tool.",
          description: "Our XML Sitemap Generator helps you create complete sitemaps that improve your website's visibility to search engines. A sitemap is a crucial SEO element that lists all important URLs on your site, helping search engines discover and index your content more efficiently. Our tool automatically crawls your website, identifies all relevant pages, and generates a properly formatted XML sitemap with customizable priorities and change frequencies.",
          howToUse: [
            "Enter your website URL in the input field",
            "Set the crawl depth (1-5) and maximum pages to include",
            "Choose which page types to include (posts, pages, categories, etc.)",
            "Configure change frequency and priority settings",
            "Click 'Generate Sitemap' and download the XML file",
            "Upload the sitemap to your site and submit it to search engines"
          ],
          features: [
            "Automatic website crawling",
            "Customizable crawl settings",
            "Properly formatted XML output",
            "Change frequency customization",
            "Priority level settings",
            "Last modified date inclusion",
            "Exclude specific URLs or patterns",
            "Support for large websites",
            "Image sitemap integration",
            "Google Search Console compatibility"
          ],
          faqs: [
            {
              question: "Why do I need a sitemap?",
              answer: "A sitemap helps search engines discover and index all important pages on your website, especially those that might not be easily accessible through your site's navigation structure. This improves your overall SEO and ensures all your content can be found by users."
            },
            {
              question: "Where should I upload my sitemap?",
              answer: "Upload your sitemap.xml file to the root directory of your website (e.g., https://yourwebsite.com/sitemap.xml). Then submit the sitemap URL to search engines through Google Search Console, Bing Webmaster Tools, etc."
            },
            {
              question: "How often should I update my sitemap?",
              answer: "Update your sitemap whenever you add, remove, or significantly modify content on your website. For frequently updated sites, regenerate your sitemap at least monthly; for more static sites, quarterly updates may be sufficient."
            },
            {
              question: "Is there a limit to how many URLs I can include?",
              answer: "Our free tool allows up to 500 URLs in a single sitemap. For larger sites, you can generate multiple sitemaps or use a sitemap index file that references multiple sitemap files."
            }
          ]
        };

      case "url-encoder-decoder":
        return {
          title: "URL Encoder Decoder",
          introduction: "Easily encode and decode URLs with our free online tool.",
          description: "Our URL Encoder Decoder tool helps you convert special characters in URLs to a format that can be transmitted over the Internet. URL encoding replaces unsafe ASCII characters with a '%' followed by hexadecimal digits. This tool is essential for web developers, digital marketers, and anyone working with URLs containing special characters, spaces, or non-ASCII characters.",
          howToUse: [
            "Enter the text you want to encode or decode",
            "Select whether you want to encode or decode",
            "Click the appropriate button to process your text",
            "Copy the result for use in your applications, links, or communications"
          ],
          features: [
            "Accurate URL encoding and decoding",
            "Support for all special characters",
            "Batch processing capability",
            "UTF-8 character handling",
            "Automatic detection of already encoded text",
            "Component-specific encoding options",
            "Reserved character handling",
            "Easy copy-to-clipboard functionality",
            "Clear explanation of encoded characters"
          ],
          faqs: [
            {
              question: "What characters need URL encoding?",
              answer: "Characters that need encoding include spaces, quotes, <, >, #, %, {, }, |, \\, ^, ~, [, ], `, and non-ASCII characters. Spaces are encoded as %20 or + (in query parameters)."
            },
            {
              question: "When should I use URL encoding?",
              answer: "Use URL encoding when creating links with special characters, generating dynamic URLs, passing parameters in query strings, or submitting data through HTML forms to ensure proper transmission and interpretation of data."
            },
            {
              question: "What's the difference between URL encoding and HTML encoding?",
              answer: "URL encoding is specifically for characters in URLs, using % followed by hex codes (e.g., space becomes %20). HTML encoding is for displaying special characters in HTML content, using & followed by character codes (e.g., space remains a space, < becomes &lt;)."
            },
            {
              question: "Can I encode an already encoded URL?",
              answer: "While technically possible, encoding an already encoded URL will double-encode it, which usually causes issues. Our tool attempts to detect if text is already encoded to prevent this problem."
            }
          ]
        };
      
      case "qr-code-generator":
        return {
          title: "QR Code Generator",
          introduction: "Create customizable QR codes instantly with our free online generator.",
          description: "Our QR Code Generator creates high-quality, scannable QR codes for websites, text, contact details, Wi-Fi networks, and more. Customize your QR codes with different colors, sizes, error correction levels, and even add your logo or image. Perfect for marketing materials, business cards, product packaging, or any application where you need to connect physical items to digital content.",
          howToUse: [
            "Choose the QR code content type (URL, text, vCard, etc.)",
            "Enter the information you want to encode",
            "Customize appearance (colors, size, error correction)",
            "Optionally add your logo or image to the center",
            "Generate and preview your QR code",
            "Download in your preferred format (PNG, SVG, PDF)"
          ],
          features: [
            "Multiple content type support (URL, text, vCard, SMS, email, Wi-Fi)",
            "High-resolution QR code generation",
            "Custom colors and design options",
            "Logo or image embedding capability",
            "Adjustable error correction levels",
            "Multiple download formats (PNG, SVG, PDF)",
            "Size customization",
            "Instant QR code preview",
            "No registration required",
            "100% free to use"
          ],
          faqs: [
            {
              question: "Can I add my logo to the QR code?",
              answer: "Yes, you can upload and add your logo or image to the center of your QR code. Our generator automatically adjusts the error correction level to ensure the code remains scannable even with a logo."
            },
            {
              question: "What's the best error correction level?",
              answer: "The 'High' error correction level is recommended if you're adding a logo or if the QR code might get dirty or partially damaged. For standard use without logos, 'Medium' offers a good balance between code size and reliability."
            },
            {
              question: "Are there size limitations for QR codes?",
              answer: "Our generator can create QR codes up to 1000×1000 pixels. The minimum recommended size for printing is 2×2 cm to ensure proper scanning on most devices."
            },
            {
              question: "Can I track how many times my QR code is scanned?",
              answer: "Our basic generator doesn't include tracking. However, you can generate a QR code with a URL that includes UTM parameters or use a URL shortener that offers analytics before generating the QR code."
            }
          ]
        };
      
      case "htaccess-redirect-generator":
        return {
          title: "Htaccess Redirect Generator",
          introduction: "Create secure and efficient .htaccess redirects with our free online tool.",
          description: "Our Htaccess Redirect Generator helps you create proper redirect rules for your Apache web server. Whether you need 301 permanent redirects, 302 temporary redirects, or specific URL rewriting rules, our tool generates clean, efficient .htaccess code. Perfect for site migrations, fixing broken links, implementing HTTPS, or creating user-friendly URLs without needing to understand complex Apache syntax.",
          howToUse: [
            "Select the type of redirect you need (301, 302, or custom)",
            "Enter the old URL or path pattern you want to redirect from",
            "Enter the new URL or path you want to redirect to",
            "Specify any conditions or exceptions (optional)",
            "Click 'Generate .htaccess Code'",
            "Copy the generated code to your .htaccess file"
          ],
          features: [
            "301 permanent redirect generation",
            "302 temporary redirect creation",
            "www to non-www redirection rules",
            "HTTP to HTTPS redirect support",
            "Wildcard and pattern matching",
            "Domain change redirection",
            "Individual page redirect rules",
            "Directory redirect options",
            "Query string handling",
            "Regular expression support"
          ],
          faqs: [
            {
              question: "Where do I place the .htaccess file?",
              answer: "The .htaccess file should be placed in the root directory of your website (or the specific directory you want the rules to apply to). Make sure the file name is exactly '.htaccess' (with the dot)."
            },
            {
              question: "What's the difference between 301 and 302 redirects?",
              answer: "A 301 redirect is permanent and tells search engines to transfer all ranking signals to the new URL. A 302 redirect is temporary and indicates that the original URL should retain its ranking. Use 301 for permanent site changes and 302 for temporary moves."
            },
            {
              question: "Do I need to restart my server after adding .htaccess rules?",
              answer: "No, Apache automatically detects and applies .htaccess changes immediately. No server restart is required."
            },
            {
              question: "Can .htaccess redirects slow down my website?",
              answer: "Properly implemented redirects have minimal impact on performance. However, excessive or poorly configured redirects (especially chains of redirects) can affect load times. Our generator creates optimized rules to minimize any performance impact."
            }
          ]
        };
      
      case "open-graph-checker":
        return {
          title: "Open Graph Checker",
          introduction: "Analyze and optimize your website's social sharing metadata with our Open Graph Checker.",
          description: "Our Open Graph Checker tool helps you verify and improve how your website appears when shared on social media platforms. Analyze your Open Graph tags, Twitter Card properties, and other social metadata to ensure attractive, accurate previews on Facebook, Twitter, LinkedIn, and other platforms. Identify missing tags, incorrect image dimensions, or suboptimal descriptions that could be limiting your social media engagement.",
          howToUse: [
            "Enter your webpage URL in the input field",
            "Click the 'Check Open Graph Tags' button",
            "Review the comprehensive analysis of your social metadata",
            "See how your page would appear when shared on different platforms",
            "Implement the suggested improvements using our recommendations"
          ],
          features: [
            "Complete Open Graph tag analysis",
            "Twitter Card validation",
            "Social preview simulation",
            "Image dimension verification",
            "Missing tag identification",
            "Title and description optimization suggestions",
            "Social platform-specific recommendations",
            "Schema.org structured data detection",
            "Social sharing best practices guidance",
            "Copy-paste code suggestions for missing tags"
          ],
          faqs: [
            {
              question: "What are Open Graph tags?",
              answer: "Open Graph (OG) tags are special meta tags that control how URLs are displayed when shared on social media. They define elements like title, description, and images that appear in social media posts when your content is shared."
            },
            {
              question: "Why are my Open Graph images not showing correctly?",
              answer: "Social platforms have specific image size requirements. Facebook prefers 1200×630 pixels, while Twitter works best with 1200×600 pixels. Our tool checks if your images meet these requirements and suggests optimizations."
            },
            {
              question: "Do I need both Open Graph and Twitter Card tags?",
              answer: "Yes, for optimal display across all platforms. While some platforms will fall back to Open Graph tags, Twitter performs best with its specific card tags. Our tool checks for both types of metadata."
            },
            {
              question: "How often should I check my Open Graph tags?",
              answer: "Check whenever you redesign your site, change your content management system, or notice issues with how your content appears when shared. Regular checks (quarterly) are recommended for active websites."
            }
          ]
        };
      
      case "robots-txt-generator":
        return {
          title: "Robots.txt Generator",
          introduction: "Create a perfect robots.txt file to control search engine crawling with our free generator.",
          description: "Our Robots.txt Generator helps you create a properly formatted robots.txt file to guide search engines on how to crawl your website. This essential SEO tool allows you to block certain pages from being indexed, protect private content, prevent duplicate content issues, and optimize your crawl budget. Create custom rules for different search engines, specify sitemap locations, and generate clean, error-free robots.txt files without needing technical expertise.",
          howToUse: [
            "Select which search engines you want to create rules for",
            "Specify directories or files you want to block from crawling",
            "Add your sitemap URL (recommended)",
            "Set crawl delays if needed for specific bots",
            "Add any custom rules or specific paths",
            "Click 'Generate Robots.txt'",
            "Copy the code and save it as robots.txt in your site's root directory"
          ],
          features: [
            "Search engine-specific rules generation",
            "Directory and file path blocking",
            "Sitemap declaration support",
            "Crawl delay configuration",
            "Wildcard pattern support",
            "User-agent specification",
            "Clean, validated output",
            "Common patterns library",
            "Custom directive support",
            "Syntax highlighting and error checking"
          ],
          faqs: [
            {
              question: "Where should I put my robots.txt file?",
              answer: "Your robots.txt file must be placed in the root directory of your website (e.g., https://www.example.com/robots.txt). Any other location will not be recognized by search engines."
            },
            {
              question: "Will robots.txt prevent my pages from appearing in search results?",
              answer: "Not necessarily. While robots.txt prevents crawling, search engines may still index pages they can't crawl if they find links to them. For complete exclusion from search results, use meta robots tags or canonical tags in addition to robots.txt directives."
            },
            {
              question: "Should I block my images from being crawled?",
              answer: "Generally no, unless you have specific reasons to prevent image indexing. Images can drive traffic from image search, so blocking them may reduce your visibility."
            },
            {
              question: "What's the difference between Disallow and Allow directives?",
              answer: "Disallow tells search engines not to crawl specified paths. Allow creates exceptions to Disallow rules, permitting crawling of specific paths within otherwise disallowed directories."
            }
          ]
        };
      
      case "minify-html":
      case "minify-css":
      case "minify-js":
        const type = toolSlug.includes("html") ? "HTML" : toolSlug.includes("css") ? "CSS" : "JavaScript";
        return {
          title: `Minify ${type}`,
          introduction: `Optimize your ${type} files by removing unnecessary characters with our free minifier tool.`,
          description: `Our ${type} Minifier tool helps you reduce file size by removing unnecessary characters like white space, comments, and formatting without changing functionality. Smaller file sizes mean faster loading websites, reduced bandwidth usage, and improved user experience. Our tool applies industry-standard minification techniques to produce clean, efficient code ready for production use.`,
          howToUse: [
            `Paste your ${type} code into the input field`,
            "Set your preferred minification options (if available)",
            `Click the 'Minify ${type}' button`,
            "Review the minified output and size reduction statistics",
            "Copy the minified code or download it as a file"
          ],
          features: [
            "White space removal",
            "Comment elimination",
            "Syntax optimization",
            "Code structure preservation",
            "Size reduction statistics",
            "Before/after comparison",
            "Error checking and validation",
            "Large file support",
            "Preservation of important comments option",
            "One-click copy functionality"
          ],
          faqs: [
            {
              question: `Will minifying ${type} break my code?`,
              answer: `No, our minifier removes only unnecessary characters while preserving functionality. However, ${type === "JavaScript" ? "if your code relies on specific formatting or contains syntax errors, issues may occur" : "the code structure and functionality remain unchanged."}`
            },
            {
              question: `How much smaller will my ${type} files be after minification?`,
              answer: `Typically, ${type} files can be reduced by 20-70% depending on the original formatting, amount of comments, and variable name lengths. You'll see the exact savings percentage after minification.`
            },
            {
              question: `Should I minify during development or only for production?`,
              answer: `We recommend developing with unminified code for readability and debugging, then minifying for production deployment. Keep original files for future editing.`
            },
            {
              question: `Can I preserve specific comments in the minified output?`,
              answer: `Yes, our tool has an option to preserve important comments marked with special syntax like /*! */ or @license. These are typically copyright notices or license information that should be retained.`
            }
          ]
        };
      
      case "url-shortener":
        return {
          title: "URL Shortener",
          introduction: "Create compact, trackable short links with our free URL shortener tool.",
          description: "Our URL Shortener tool converts long URLs into concise, easy-to-share links. Ideal for social media posts with character limits, text messages, print materials, or anywhere space is limited. Our shortened links never expire, include click analytics to track performance, and maintain compatibility across all platforms and devices. Create branded, memorable links that improve click-through rates while maintaining reliability.",
          howToUse: [
            "Paste your long URL in the input field",
            "Choose custom alias (optional) or use auto-generated short code",
            "Click the 'Shorten URL' button",
            "Copy your new shortened link",
            "Share it anywhere you need a more compact link"
          ],
          features: [
            "Instant URL shortening",
            "Permanent links that never expire",
            "Optional custom aliases",
            "Click tracking and analytics",
            "QR code generation for shortened links",
            "Password protection option",
            "Link expiration setting (optional)",
            "Mobile-friendly redirects",
            "Social media optimization",
            "Fast redirect performance"
          ],
          faqs: [
            {
              question: "Do shortened links expire?",
              answer: "No, our shortened URLs never expire by default and will remain active indefinitely. However, you can optionally set an expiration date if you need a link to work only for a limited time."
            },
            {
              question: "Can I track clicks on my shortened links?",
              answer: "Yes, our service provides basic analytics for all shortened links, including click count, geographical distribution, referring sources, and device types used by visitors."
            },
            {
              question: "Are there any restrictions on what URLs I can shorten?",
              answer: "We prohibit shortening URLs that lead to malware, phishing, illegal content, or spam. Our system automatically scans URLs to ensure they comply with our terms of service."
            },
            {
              question: "Can I customize the shortened URL?",
              answer: "Yes, you can create custom aliases instead of using the automatically generated codes. Custom aliases are subject to availability and must be at least 4 characters long."
            }
          ]
        };
      
      case "website-checker":
        return {
          title: "Website Checker",
          introduction: "Comprehensive website analysis tool for diagnosing technical issues and security vulnerabilities.",
          description: "Our Website Checker performs a thorough technical analysis of any website, identifying performance issues, security vulnerabilities, SEO problems, and accessibility concerns. Get detailed insights on server response, SSL certificate validity, DNS configuration, blacklist status, mobile compatibility, broken links, and more. This tool helps webmasters, developers, and site owners ensure their websites are secure, fast, and optimized for both users and search engines.",
          howToUse: [
            "Enter the website URL you want to analyze",
            "Select which aspects you want to check (or use the comprehensive scan)",
            "Click the 'Analyze Website' button",
            "Review the detailed report with findings and recommendations",
            "Implement the suggested fixes to improve your website"
          ],
          features: [
            "Comprehensive technical analysis",
            "SSL certificate validation",
            "DNS record verification",
            "Security header checking",
            "Blacklist status monitoring",
            "Response time measurement",
            "Mobile compatibility testing",
            "Broken link detection",
            "Mixed content identification",
            "Accessibility evaluation",
            "Server configuration analysis"
          ],
          faqs: [
            {
              question: "How long does a complete website check take?",
              answer: "A standard check typically takes 30-60 seconds, depending on the website's size and complexity. More comprehensive scans that include broken link checking may take several minutes for larger sites."
            },
            {
              question: "Will this tool work on password-protected websites?",
              answer: "Our basic checks work on public-facing elements of any website. For complete analysis of password-protected sites, you'll need to check the public areas and login sections separately."
            },
            {
              question: "How often should I check my website?",
              answer: "We recommend running a complete website check monthly and after any significant changes to your site. Critical sites handling sensitive information or e-commerce should be checked weekly."
            },
            {
              question: "Will this tool detect all security vulnerabilities?",
              answer: "While our tool checks for common security issues like outdated SSL certificates, missing security headers, and blacklist presence, it's not a replacement for a dedicated security audit or penetration testing for high-security applications."
            }
          ]
        };
      
      case "url-rewriting-tool":
        return {
          title: "URL Rewriting Tool",
          introduction: "Create clean, SEO-friendly URLs with our powerful URL rewriting tool.",
          description: "Our URL Rewriting Tool helps you transform complex, parameter-heavy URLs into clean, readable, and search engine-friendly formats. Generate proper rewrite rules for Apache (.htaccess), Nginx, or IIS web servers to implement user-friendly URLs without changing your underlying code. Improve your site's usability, boost SEO rankings, and make links more shareable and memorable with properly structured URL patterns.",
          howToUse: [
            "Enter your original dynamic URL with parameters",
            "Input your desired clean URL format",
            "Select your web server type (Apache, Nginx, or IIS)",
            "Choose additional options like case sensitivity or query string handling",
            "Click 'Generate Rewrite Rules'",
            "Copy the generated code to your server configuration"
          ],
          features: [
            "Multiple web server support (Apache, Nginx, IIS)",
            "Dynamic parameter mapping",
            "Regular expression pattern creation",
            "Query string preservation option",
            "Case sensitivity configuration",
            "Redirect type selection (301, 302)",
            "Batch URL processing",
            "Rule testing and validation",
            "URL structure suggestions",
            "Implementation instructions"
          ],
          faqs: [
            {
              question: "Will changing my URLs affect my search rankings?",
              answer: "When implemented correctly with proper 301 redirects, URL rewriting should maintain or improve your search rankings over time. Always ensure old URLs redirect to new ones to preserve link equity."
            },
            {
              question: "Do I need technical knowledge to implement these rules?",
              answer: "Basic server administration knowledge is helpful. The rules must be added to your server configuration files (.htaccess for Apache, server block for Nginx, or web.config for IIS). We provide implementation instructions with each generated rule."
            },
            {
              question: "Can I rewrite URLs for any website?",
              answer: "You need administrative access to your web server to implement rewrite rules. If you're using a managed platform, check if they support custom URL rewriting or have built-in options for clean URLs."
            },
            {
              question: "What makes a good URL structure?",
              answer: "Good URLs are readable, contain relevant keywords, use hyphens instead of underscores, avoid unnecessary parameters, maintain a logical hierarchy, and are reasonably short. Our tool provides suggestions based on best practices."
            }
          ]
        };
      
      default:
        return {
          title: "Website Management Tools",
          introduction: "Optimize and manage your website with our comprehensive suite of web tools.",
          description: "Our website management tools help webmasters, developers, and site owners analyze, optimize, and maintain their websites. From SEO analysis and performance testing to security scanning and content optimization, our tools provide actionable insights and solutions for common web management challenges. Improve your site's visibility, speed, security, and user experience with our professional-grade web tools.",
          howToUse: [
            "Select the specific tool you need from our suite",
            "Enter your website URL or paste the relevant code",
            "Configure any additional settings or parameters",
            "Run the analysis or processing",
            "Review the results and recommendations",
            "Implement the suggested improvements on your website"
          ],
          features: [
            "Comprehensive website analysis",
            "Performance optimization tools",
            "SEO audit and improvement suggestions",
            "Security scanning and validation",
            "Code minification and optimization",
            "Meta tag and structured data tools",
            "Image and media optimization",
            "URL management utilities",
            "Server configuration assistance",
            "Mobile compatibility testing"
          ],
          faqs: [
            {
              question: "Are these tools suitable for beginners?",
              answer: "Yes, our tools are designed with intuitive interfaces suitable for users of all skill levels. Each tool includes clear explanations and implementation guidance to help beginners make effective use of the results."
            },
            {
              question: "Will using these tools affect my live website?",
              answer: "No, our analysis tools are non-invasive and don't make any changes to your website. The tools generate reports and recommendations that you can implement at your discretion."
            },
            {
              question: "How accurate are the analysis results?",
              answer: "Our tools use industry-standard methods and best practices to provide highly accurate results. However, web technologies are complex, and some context-specific factors may require human judgment in addition to our automated analysis."
            },
            {
              question: "Can I use these tools on websites I don't own?",
              answer: "Our analysis tools can be used on any publicly accessible website to gather public information. However, implementing changes requires appropriate access and permissions for the target website."
            }
          ]
        };
    }
  };

  const handleGenerateDemoResults = () => {
    setLoading(true);
    
    // Generate mock results based on the tool type
    setTimeout(() => {
      let demoResults: ResultsData = {};
      
      switch (toolSlug) {
        case "website-seo-score-checker":
          demoResults = {
            seoScore: {
              score: 68,
              metrics: {
                title: { 
                  score: 70, 
                  text: "Your title tag is well-structured but could be more optimized for keywords.",
                  issues: ["Title length (58 characters) is good", "Missing primary keyword near the beginning"]
                },
                meta: { 
                  score: 65, 
                  text: "Meta description exists but could be improved for click-through rate.",
                  issues: ["Meta description is slightly too short (120 characters)", "Doesn't include a clear call to action"]
                },
                headings: { 
                  score: 80, 
                  text: "Heading structure is mostly well-organized with proper hierarchy.",
                  issues: ["Some H2s are too long (over 70 characters)", "Good keyword usage in headings"]
                },
                content: { 
                  score: 75, 
                  text: "Content has good length and readability, but keyword density could be improved.",
                  issues: ["Good content length (1,854 words)", "Readability score is good", "Keyword density is slightly low (0.8%)"]
                },
                images: { 
                  score: 60, 
                  text: "Several images are missing alt tags or have non-descriptive alt text.",
                  issues: ["6 of 12 images are missing alt attributes", "Some alt texts are too generic"]
                },
                links: { 
                  score: 85, 
                  text: "Internal linking structure is good with descriptive anchor text.",
                  issues: ["Good internal linking", "Descriptive anchor text present", "No broken links detected"]
                },
                performance: { 
                  score: 65, 
                  text: "Page load time is acceptable but could be improved for better user experience.",
                  issues: ["Page load time: 3.2 seconds (recommended: under 3 seconds)", "Some render-blocking resources detected"]
                },
                mobile: { 
                  score: 55, 
                  text: "Several mobile usability issues detected that need attention.",
                  issues: ["Clickable elements too close together", "Text too small to read on mobile", "Content wider than screen"]
                }
              },
              suggestions: [
                "Optimize your title tag to include your primary keyword near the beginning",
                "Expand your meta description to 150-160 characters and include a call to action",
                "Add descriptive alt text to all images for better accessibility and SEO",
                "Improve mobile usability by increasing font sizes and fixing tap target spacing",
                "Optimize page load speed by addressing render-blocking resources"
              ]
            }
          };
          break;
        
        case "page-speed-test":
          demoResults = {
            pageSpeed: {
              score: 72,
              loadTime: "3.2s",
              firstContentfulPaint: "1.8s",
              speedIndex: "2.4s",
              largestContentfulPaint: "2.9s",
              timeToInteractive: "3.6s",
              totalBlockingTime: "350ms",
              metrics: {
                "First Contentful Paint": { value: 1800, score: 75 },
                "Speed Index": { value: 2400, score: 80 },
                "Largest Contentful Paint": { value: 2900, score: 65 },
                "Time to Interactive": { value: 3600, score: 60 },
                "Total Blocking Time": { value: 350, score: 70 },
                "Cumulative Layout Shift": { value: 0.12, score: 80 }
              },
              opportunities: [
                { 
                  name: "Properly size images", 
                  description: "Serve images that are appropriately-sized to save cellular data and improve load time.",
                  savings: "1.2s"
                },
                { 
                  name: "Eliminate render-blocking resources", 
                  description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.",
                  savings: "0.8s"
                },
                { 
                  name: "Efficiently encode images", 
                  description: "Optimized images load faster and consume less cellular data.",
                  savings: "0.6s"
                },
                { 
                  name: "Reduce unused JavaScript", 
                  description: "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
                  savings: "0.5s"
                }
              ]
            }
          };
          break;
        
        case "website-screenshot-generator":
          demoResults = {
            screenshot: {
              imageUrl: "https://via.placeholder.com/800x600?text=Website+Screenshot+Demo",
              width: 1920,
              height: 1080,
              timestamp: new Date().toISOString()
            }
          };
          break;
        
        case "get-http-headers":
          demoResults = {
            httpHeaders: {
              status: 200,
              headers: {
                "content-type": "text/html; charset=UTF-8",
                "server": "nginx/1.18.0",
                "date": new Date().toUTCString(),
                "content-length": "48279",
                "cache-control": "max-age=600",
                "strict-transport-security": "max-age=31536000; includeSubDomains",
                "x-content-type-options": "nosniff",
                "x-frame-options": "SAMEORIGIN",
                "x-xss-protection": "1; mode=block",
                "content-encoding": "gzip",
                "vary": "Accept-Encoding",
                "access-control-allow-origin": "*",
                "connection": "keep-alive"
              },
              timing: {
                dns: 45,
                connection: 120,
                tls: 210,
                firstByte: 340,
                download: 280,
                total: 995
              }
            }
          };
          break;
          
        case "xml-sitemap-generator":
          demoResults = {
            sitemap: {
              count: 8,
              entries: [
                { url: `https://${url}/`, lastmod: "2023-09-15", changefreq: "weekly", priority: "1.0" },
                { url: `https://${url}/about`, lastmod: "2023-08-22", changefreq: "monthly", priority: "0.8" },
                { url: `https://${url}/services`, lastmod: "2023-09-10", changefreq: "monthly", priority: "0.8" },
                { url: `https://${url}/contact`, lastmod: "2023-07-18", changefreq: "yearly", priority: "0.5" },
                { url: `https://${url}/blog`, lastmod: "2023-09-14", changefreq: "daily", priority: "0.9" },
                { url: `https://${url}/blog/post-1`, lastmod: "2023-09-14", changefreq: "monthly", priority: "0.7" },
                { url: `https://${url}/blog/post-2`, lastmod: "2023-09-01", changefreq: "monthly", priority: "0.7" },
                { url: `https://${url}/products`, lastmod: "2023-09-05", changefreq: "weekly", priority: "0.8" }
              ],
              xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://${url}/</loc>\n    <lastmod>2023-09-15</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>https://${url}/about</loc>\n    <lastmod>2023-08-22</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n  <!-- More URLs omitted for brevity -->\n</urlset>`
            }
          };
          break;
          
        case "url-encoder-decoder":
          const sampleText = "Example text with spaces and special characters: !@#$%^&*() / ?";
          demoResults = {
            encoderDecoder: {
              original: sampleText,
              encoded: encodeURIComponent(sampleText),
              decoded: text ? decodeURIComponent(text) : sampleText
            }
          };
          break;
          
        case "qr-code-generator":
          demoResults = {
            qrCode: {
              url: url || "https://example.com",
              qrImageUrl: "https://via.placeholder.com/300x300?text=QR+Code+Demo"
            }
          };
          break;
          
        case "htaccess-redirect-generator":
          demoResults = {
            redirect: {
              original: "/old-page.html",
              redirectCode: 301,
              redirectUrl: "/new-page.html",
              htaccessCode: `RewriteEngine On\nRewriteRule ^old-page\\.html$ /new-page.html [R=301,L]`
            }
          };
          break;
          
        case "open-graph-checker":
          demoResults = {
            metadata: {
              ogTags: {
                "og:title": "Example Website - Home Page",
                "og:description": "This is an example website description for demonstration purposes.",
                "og:image": "https://example.com/image.jpg",
                "og:url": `https://${url}/`,
                "og:type": "website"
              },
              twitterTags: {
                "twitter:card": "summary_large_image",
                "twitter:title": "Example Website - Home Page",
                "twitter:description": "This is an example website description for demonstration purposes.",
                "twitter:image": "https://example.com/image.jpg"
              },
              otherTags: {
                "description": "This is the meta description of the page.",
                "canonical": `https://${url}/`,
                "robots": "index, follow"
              }
            }
          };
          break;
          
        case "minify-html":
        case "minify-css":
        case "minify-js":
          const type = toolSlug.includes("html") ? "HTML" : toolSlug.includes("css") ? "CSS" : "JavaScript";
          const sampleCode = type === "HTML" ? 
            `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Example Page</title>\n    <!-- This is a comment -->\n    <meta name="description" content="Example page">\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is a paragraph with some text.</p>\n  </body>\n</html>` :
            type === "CSS" ?
            `/* This is a CSS comment */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333333;\n  font-size: 24px;\n  margin-bottom: 20px;\n}` :
            `// This is a JavaScript comment\nfunction greet() {\n  const name = "World";\n  console.log("Hello " + name);\n}\n\n// Call the function\ngreet();`;
            
          const minified = type === "HTML" ? 
            sampleCode.replace(/\s+</g, "<").replace(/>\s+/g, ">").replace(/<!--.*?-->/g, "") :
            type === "CSS" ?
            sampleCode.replace(/\/\*.*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*:\s*/g, ":").replace(/\s*;\s*/g, ";") :
            sampleCode.replace(/\/\/.*?\n/g, "").replace(/\s+/g, " ").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}");
            
          demoResults = {
            minifyResult: {
              original: text || sampleCode,
              minified: minified,
              savings: {
                bytes: (text || sampleCode).length - minified.length,
                percentage: Math.round(((text || sampleCode).length - minified.length) / (text || sampleCode).length * 100)
              }
            }
          };
          break;
          
        case "robots-txt-generator":
          demoResults = {
            robotsTxt: {
              content: "User-agent: *\nDisallow: /admin/\nDisallow: /private/\nAllow: /\n\nUser-agent: Googlebot\nDisallow: /no-google/\n\nSitemap: https://example.com/sitemap.xml",
              directives: [
                {
                  userAgent: "*",
                  rules: [
                    { type: "Disallow", value: "/admin/" },
                    { type: "Disallow", value: "/private/" },
                    { type: "Allow", value: "/" }
                  ]
                },
                {
                  userAgent: "Googlebot",
                  rules: [
                    { type: "Disallow", value: "/no-google/" }
                  ]
                }
              ]
            }
          };
          break;
          
        case "url-shortener":
          demoResults = {
            urlShortener: {
              originalUrl: url || "https://example.com/very/long/url/with/many/parameters?param1=value1&param2=value2",
              shortUrl: "https://short.url/abc123"
            }
          };
          break;
          
        case "website-checker":
          demoResults = {
            websiteCheck: {
              status: "online",
              ssl: {
                valid: true,
                expires: "2024-06-15",
                issuer: "Let's Encrypt Authority X3"
              },
              dns: {
                "A": ["93.184.216.34"],
                "AAAA": ["2606:2800:220:1:248:1893:25c8:1946"],
                "MX": ["10 aspmx.l.google.com", "20 alt1.aspmx.l.google.com"],
                "TXT": ["v=spf1 include:_spf.google.com ~all"]
              },
              response: {
                code: 200,
                time: 325
              },
              blacklist: {
                listed: false,
                sources: []
              }
            }
          };
          break;
          
        default:
          // Generic results for other tools
          demoResults = {
            seoScore: {
              score: 75,
              metrics: {
                title: { score: 80, text: "Title is well optimized", issues: [] },
                meta: { score: 70, text: "Meta description could be improved", issues: ["Too short"] },
                headings: { score: 85, text: "Heading structure is good", issues: [] },
                content: { score: 75, text: "Content is good quality", issues: [] },
                images: { score: 60, text: "Image optimization needed", issues: ["Missing alt tags"] },
                links: { score: 80, text: "Link structure is good", issues: [] },
                performance: { score: 65, text: "Performance could be improved", issues: ["Slow load time"] },
                mobile: { score: 85, text: "Mobile experience is good", issues: [] }
              },
              suggestions: [
                "Add more descriptive meta description",
                "Optimize images with alt tags",
                "Improve page load speed"
              ]
            }
          };
      }
      
      setResults(demoResults);
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && toolSlug !== "url-encoder-decoder" && toolSlug !== "minify-html" && toolSlug !== "minify-css" && toolSlug !== "minify-js") {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    handleGenerateDemoResults();
  };

  const renderInterface = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {(toolSlug === "url-encoder-decoder" || toolSlug.includes("minify")) ? (
            <div>
              <Label htmlFor="text">Enter text to {toolSlug === "url-encoder-decoder" ? "encode/decode" : "minify"}</Label>
              <Textarea
                id="text"
                placeholder={`Enter ${toolSlug === "url-encoder-decoder" ? "text" : toolSlug.split("-")[1]} code`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-40 font-mono"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="url">Enter website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}
          
          {/* Tool-specific options */}
          {toolSlug === "xml-sitemap-generator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="crawlDepth">Crawl Depth</Label>
                <Select onValueChange={(value) => setOptions({...options, crawlDepth: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crawl depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 level (homepage only)</SelectItem>
                    <SelectItem value="2">2 levels (default)</SelectItem>
                    <SelectItem value="3">3 levels</SelectItem>
                    <SelectItem value="4">4 levels</SelectItem>
                    <SelectItem value="5">5 levels (comprehensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxPages">Maximum Pages</Label>
                <Select onValueChange={(value) => setOptions({...options, maxPages: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select max pages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 pages</SelectItem>
                    <SelectItem value="100">100 pages</SelectItem>
                    <SelectItem value="250">250 pages</SelectItem>
                    <SelectItem value="500">500 pages (free limit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {toolSlug === "htaccess-redirect-generator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="redirectType">Redirect Type</Label>
                <Select onValueChange={(value) => setOptions({...options, redirectType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select redirect type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 (Permanent Redirect)</SelectItem>
                    <SelectItem value="302">302 (Temporary Redirect)</SelectItem>
                    <SelectItem value="303">303 (See Other)</SelectItem>
                    <SelectItem value="307">307 (Temporary Redirect)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input
                  id="targetUrl"
                  placeholder="/new-page.html"
                  onChange={(e) => setOptions({...options, targetUrl: e.target.value})}
                />
              </div>
            </div>
          )}
          
          {toolSlug === "minify-html" || toolSlug === "minify-css" || toolSlug === "minify-js" ? (
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-comments"
                checked={options.preserveComments}
                onCheckedChange={(checked) => setOptions({...options, preserveComments: checked})}
              />
              <Label htmlFor="preserve-comments">Preserve license/important comments</Label>
            </div>
          ) : null}
          
          {toolSlug === "qr-code-generator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qrSize">QR Code Size</Label>
                <Select onValueChange={(value) => setOptions({...options, size: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (200×200)</SelectItem>
                    <SelectItem value="medium">Medium (300×300)</SelectItem>
                    <SelectItem value="large">Large (400×400)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (500×500)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="errorCorrection">Error Correction</Label>
                <Select onValueChange={(value) => setOptions({...options, errorCorrection: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? 
              "Processing..." : 
              `Analyze ${toolSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`
            }
          </Button>
        </form>

        {results && (
          <div className="mt-8">
            {/* Tool-specific results display */}
            {results.seoScore && (
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                      <path
                        className="stroke-current text-gray-200"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`stroke-current ${
                          results.seoScore.score >= 80 ? "text-green-500" : 
                          results.seoScore.score >= 60 ? "text-yellow-500" : 
                          "text-red-500"
                        }`}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${results.seoScore.score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold">{results.seoScore.score}</span>
                    </div>
                  </div>
                  <span className="text-lg font-medium mt-2">
                    {results.seoScore.score >= 80 ? "Excellent" : 
                     results.seoScore.score >= 60 ? "Good" : 
                     results.seoScore.score >= 40 ? "Needs Improvement" : 
                     "Poor"}
                  </span>
                </div>
                
                <Tabs defaultValue="metrics">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="metrics">SEO Metrics</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metrics" className="space-y-4">
                    {Object.entries(results.seoScore.metrics).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium capitalize">{key}</h3>
                            <Badge variant={value.score >= 80 ? "default" : value.score >= 60 ? "outline" : "destructive"}>
                              {value.score}/100
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{value.text}</p>
                          {value.issues.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Issues:</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {value.issues.map((issue, i) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="suggestions">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Recommendations to Improve Your Score</h3>
                        <ul className="space-y-2">
                          {results.seoScore.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex">
                              <span className="text-green-500 mr-2">✓</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {results.pageSpeed && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                        <path
                          className="stroke-current text-gray-200"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`stroke-current ${
                            results.pageSpeed.score >= 90 ? "text-green-500" : 
                            results.pageSpeed.score >= 50 ? "text-yellow-500" : 
                            "text-red-500"
                          }`}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${results.pageSpeed.score}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold">{results.pageSpeed.score}</span>
                      </div>
                    </div>
                    <span className="text-lg font-medium mt-2">
                      {results.pageSpeed.score >= 90 ? "Fast" : 
                       results.pageSpeed.score >= 50 ? "Average" : 
                       "Slow"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Load Time</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.loadTime}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">First Paint</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.firstContentfulPaint}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Speed Index</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.speedIndex}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">LCP</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.largestContentfulPaint}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Interactive</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.timeToInteractive}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Blocking Time</p>
                      <p className="text-xl font-semibold">{results.pageSpeed.totalBlockingTime}</p>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="metrics">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="metrics">Metrics Detail</TabsTrigger>
                    <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metrics">
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Score</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(results.pageSpeed.metrics).map(([metric, data]) => (
                              <TableRow key={metric}>
                                <TableCell className="font-medium">{metric}</TableCell>
                                <TableCell>
                                  {data.value >= 1000 ? `${(data.value / 1000).toFixed(1)}s` : `${data.value}ms`}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <span className="mr-2">{data.score}</span>
                                    <Progress 
                                      value={data.score} 
                                      className="h-2 w-16"
                                      indicatorClassName={
                                        data.score >= 90 ? "bg-green-500" : 
                                        data.score >= 50 ? "bg-yellow-500" : 
                                        "bg-red-500"
                                      } 
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="opportunities">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Optimization Opportunities</h3>
                        <div className="space-y-4">
                          {results.pageSpeed.opportunities.map((opportunity, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{opportunity.name}</h4>
                                <Badge className="bg-green-100 text-green-800">Save {opportunity.savings}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{opportunity.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {results.screenshot && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Screenshot Generated</h3>
                      <p className="text-sm text-gray-600">
                        Resolution: {results.screenshot.width}×{results.screenshot.height}px • 
                        Captured: {new Date(results.screenshot.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={results.screenshot.imageUrl} 
                        alt="Website Screenshot" 
                        className="w-full h-auto" 
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="mr-2">
                        <i className="fas fa-download mr-2"></i> Download PNG
                      </Button>
                      <Button>
                        <i className="fas fa-code mr-2"></i> Copy Image URL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.httpHeaders && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">HTTP Response Headers</h3>
                      <Badge
                        variant={
                          results.httpHeaders.status >= 200 && results.httpHeaders.status < 300
                            ? "default"
                            : results.httpHeaders.status >= 300 && results.httpHeaders.status < 400
                            ? "outline"
                            : "destructive"
                        }
                      >
                        Status: {results.httpHeaders.status}
                      </Badge>
                    </div>
                    
                    <Tabs defaultValue="headers">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="timing">Timing</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="headers">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Header</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(results.httpHeaders.headers).map(([header, value]) => (
                              <TableRow key={header}>
                                <TableCell className="font-medium">{header}</TableCell>
                                <TableCell className="font-mono text-sm break-all">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="timing">
                        <div className="space-y-4">
                          <div className="w-full bg-gray-100 h-8 rounded-lg relative overflow-hidden">
                            {Object.entries(results.httpHeaders.timing).map(([phase, time], i, arr) => {
                              const phases = ["dns", "connection", "tls", "firstByte", "download"];
                              if (phases.includes(phase)) {
                                const previousTime = phases
                                  .slice(0, phases.indexOf(phase))
                                  .reduce((acc, curr) => acc + (results.httpHeaders.timing[curr] || 0), 0);
                                
                                const percentage = (time / results.httpHeaders.timing.total) * 100;
                                
                                return (
                                  <div
                                    key={phase}
                                    className={`absolute h-full ${
                                      phase === "dns" ? "bg-blue-500" :
                                      phase === "connection" ? "bg-green-500" :
                                      phase === "tls" ? "bg-purple-500" :
                                      phase === "firstByte" ? "bg-yellow-500" :
                                      "bg-red-500"
                                    }`}
                                    style={{
                                      left: `${(previousTime / results.httpHeaders.timing.total) * 100}%`,
                                      width: `${percentage}%`
                                    }}
                                  ></div>
                                );
                              }
                              return null;
                            })}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-sm">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                              <p className="font-medium">DNS</p>
                              <p>{results.httpHeaders.timing.dns}ms</p>
                            </div>
                            <div className="p-2 rounded-lg bg-green-100 text-green-800">
                              <p className="font-medium">Connection</p>
                              <p>{results.httpHeaders.timing.connection}ms</p>
                            </div>
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                              <p className="font-medium">TLS</p>
                              <p>{results.httpHeaders.timing.tls}ms</p>
                            </div>
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-800">
                              <p className="font-medium">First Byte</p>
                              <p>{results.httpHeaders.timing.firstByte}ms</p>
                            </div>
                            <div className="p-2 rounded-lg bg-red-100 text-red-800">
                              <p className="font-medium">Download</p>
                              <p>{results.httpHeaders.timing.download}ms</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-600">0ms</span>
                            <span className="font-medium">Total: {results.httpHeaders.timing.total}ms</span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.sitemap && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">XML Sitemap Generator</h3>
                      <Badge>{results.sitemap.count} URLs found</Badge>
                    </div>
                    
                    <Tabs defaultValue="urls">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="urls">URLs</TabsTrigger>
                        <TabsTrigger value="xml">XML Output</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="urls">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>URL</TableHead>
                              <TableHead className="hidden md:table-cell">Last Modified</TableHead>
                              <TableHead className="hidden md:table-cell">Change Frequency</TableHead>
                              <TableHead>Priority</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.sitemap.entries.map((entry, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium break-all">
                                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {entry.url}
                                  </a>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{entry.lastmod || "-"}</TableCell>
                                <TableCell className="hidden md:table-cell">{entry.changefreq || "-"}</TableCell>
                                <TableCell>{entry.priority || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="xml">
                        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">{results.sitemap.xml}</pre>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" className="mr-2">
                            <i className="fas fa-download mr-2"></i> Download XML
                          </Button>
                          <Button>
                            <i className="fas fa-copy mr-2"></i> Copy XML
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.encoderDecoder && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">URL Encoding Results</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Original Text:</h4>
                        <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono break-all">
                          {results.encoderDecoder.original}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">URL Encoded:</h4>
                        <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono break-all">
                          {results.encoderDecoder.encoded}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <i className="fas fa-copy mr-2"></i> Copy Encoded
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">URL Decoded:</h4>
                        <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono break-all">
                          {results.encoderDecoder.decoded}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <i className="fas fa-copy mr-2"></i> Copy Decoded
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.qrCode && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 flex justify-center items-start mb-4 md:mb-0">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <img 
                            src={results.qrCode.qrImageUrl} 
                            alt="QR Code" 
                            className="w-full max-w-xs h-auto" 
                          />
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 md:pl-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">QR Code Generated</h3>
                          <p className="text-sm text-gray-600">Scan this QR code to access the URL</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Encoded URL:</Label>
                          <div className="p-3 bg-gray-100 rounded-lg text-sm break-all mt-1">
                            {results.qrCode.url}
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Download Options:</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                              <i className="fas fa-download mr-2"></i> PNG
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-download mr-2"></i> SVG
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-download mr-2"></i> PDF
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button>
                            <i className="fas fa-redo mr-2"></i> Regenerate with Options
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.redirect && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Htaccess Redirect Code Generated</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Original Path:</Label>
                          <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono mt-1">
                            {results.redirect.original}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Redirect To:</Label>
                          <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono mt-1">
                            {results.redirect.redirectUrl}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Redirect Type:</Label>
                        <Badge className="mt-1">
                          {results.redirect.redirectCode === 301 ? "301 Permanent" : 
                           results.redirect.redirectCode === 302 ? "302 Temporary" : 
                           `${results.redirect.redirectCode} Redirect`}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Htaccess Code:</Label>
                        <div className="p-3 bg-gray-100 rounded-lg text-sm font-mono mt-1 whitespace-pre">
                          {results.redirect.htaccessCode}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <i className="fas fa-copy mr-2"></i> Copy Code
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                        <p className="font-medium">Implementation Instructions:</p>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                          <li>Open or create the .htaccess file in your website's root directory</li>
                          <li>Copy and paste the code above into your .htaccess file</li>
                          <li>Save the file and upload it to your server</li>
                          <li>Test the redirect to ensure it's working correctly</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.metadata && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Open Graph and Social Metadata Analysis</h3>
                    
                    <Tabs defaultValue="og">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="og">Open Graph</TabsTrigger>
                        <TabsTrigger value="twitter">Twitter Card</TabsTrigger>
                        <TabsTrigger value="other">Other Meta</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="og">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(results.metadata.ogTags).map(([property, value]) => (
                              <TableRow key={property}>
                                <TableCell className="font-medium">{property}</TableCell>
                                <TableCell className="break-all">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="twitter">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(results.metadata.twitterTags).map(([property, value]) => (
                              <TableRow key={property}>
                                <TableCell className="font-medium">{property}</TableCell>
                                <TableCell className="break-all">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      
                      <TabsContent value="other">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              <TableHead>Value</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(results.metadata.otherTags).map(([property, value]) => (
                              <TableRow key={property}>
                                <TableCell className="font-medium">{property}</TableCell>
                                <TableCell className="break-all">{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6 p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Social Preview Simulation</h4>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-2 text-sm">facebook.com</div>
                        <div className="p-4">
                          <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                            <i className="fas fa-image text-3xl"></i>
                          </div>
                          <h3 className="font-bold text-lg">{results.metadata.ogTags["og:title"] || "No title specified"}</h3>
                          <p className="text-gray-600 text-sm mt-1">{results.metadata.ogTags["og:description"] || "No description specified"}</p>
                          <p className="text-gray-500 text-xs mt-2">{results.metadata.ogTags["og:url"] || url}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.minifyResult && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {toolSlug.includes("html") ? "HTML" : toolSlug.includes("css") ? "CSS" : "JavaScript"} Minification Results
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        {results.minifyResult.savings.percentage}% smaller
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm font-medium mb-2">Original Size:</p>
                          <p className="text-2xl font-semibold">{results.minifyResult.original.length} bytes</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Minified Size:</p>
                          <p className="text-2xl font-semibold">{results.minifyResult.minified.length} bytes</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-2">You saved {results.minifyResult.savings.bytes} bytes ({results.minifyResult.savings.percentage}%)</p>
                        <Progress value={results.minifyResult.savings.percentage} className="h-2" />
                      </div>
                      
                      <Tabs defaultValue="minified">
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="original">Original</TabsTrigger>
                          <TabsTrigger value="minified">Minified</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="original">
                          <div className="bg-gray-100 p-4 rounded-lg max-h-80 overflow-auto">
                            <pre className="text-sm font-mono whitespace-pre-wrap">{results.minifyResult.original}</pre>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="minified">
                          <div className="bg-gray-100 p-4 rounded-lg max-h-80 overflow-auto">
                            <pre className="text-sm font-mono whitespace-pre-wrap break-all">{results.minifyResult.minified}</pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">
                          <i className="fas fa-download mr-2"></i> Download
                        </Button>
                        <Button>
                          <i className="fas fa-copy mr-2"></i> Copy Minified Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.robotsTxt && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Robots.txt Generator</h3>
                    
                    <Tabs defaultValue="preview">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="directives">Directives</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="preview">
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <pre className="text-sm font-mono whitespace-pre-wrap">{results.robotsTxt.content}</pre>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline">
                            <i className="fas fa-download mr-2"></i> Download robots.txt
                          </Button>
                          <Button>
                            <i className="fas fa-copy mr-2"></i> Copy to Clipboard
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="directives">
                        <div className="space-y-6">
                          {results.robotsTxt.directives.map((directive, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                              <h4 className="font-medium">User-agent: {directive.userAgent}</h4>
                              <ul className="mt-2 space-y-1">
                                {directive.rules.map((rule, j) => (
                                  <li key={j} className="flex items-center">
                                    <Badge
                                      variant={rule.type === "Allow" ? "default" : "outline"}
                                      className="mr-2"
                                    >
                                      {rule.type}
                                    </Badge>
                                    <code className="text-sm">{rule.value}</code>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm">
                      <h4 className="font-medium text-blue-800">Implementation Instructions:</h4>
                      <ol className="mt-2 space-y-1 list-decimal list-inside text-blue-800">
                        <li>Copy the generated robots.txt content</li>
                        <li>Create a new file named "robots.txt"</li>
                        <li>Paste the content into the file</li>
                        <li>Upload the robots.txt file to the root directory of your website (e.g., www.example.com/robots.txt)</li>
                        <li>Verify that the file is accessible by visiting yourdomain.com/robots.txt</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.urlShortener && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">URL Shortener</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Original URL:</Label>
                        <div className="p-3 bg-gray-100 rounded-lg text-sm break-all mt-1">
                          {results.urlShortener.originalUrl}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Shortened URL:</Label>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-800 font-medium mt-1">
                          {results.urlShortener.shortUrl}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <i className="fas fa-copy mr-2"></i> Copy URL
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <i className="fas fa-qrcode mr-2"></i> Generate QR Code
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <i className="fas fa-share-alt mr-2"></i> Share
                          </Button>
                        </div>
                        
                        <Button variant="default" size="sm">
                          <i className="fas fa-chart-bar mr-2"></i> Track Clicks
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {results.websiteCheck && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Website Check Results</h3>
                      <Badge
                        variant={
                          results.websiteCheck.status === "online" ? "default" :
                          results.websiteCheck.status === "warning" ? "outline" :
                          "destructive"
                        }
                      >
                        {results.websiteCheck.status === "online" ? "Online" :
                         results.websiteCheck.status === "warning" ? "Warning" :
                         "Offline"}
                      </Badge>
                    </div>
                    
                    <Tabs defaultValue="overview">
                      <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="ssl">SSL</TabsTrigger>
                        <TabsTrigger value="dns">DNS</TabsTrigger>
                        <TabsTrigger value="blacklist">Blacklist</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Server Response</h4>
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  results.websiteCheck.response.code >= 200 && results.websiteCheck.response.code < 300 ? "default" :
                                  results.websiteCheck.response.code >= 300 && results.websiteCheck.response.code < 400 ? "outline" :
                                  "destructive"
                                }
                                className="mr-2"
                              >
                                {results.websiteCheck.response.code}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Response Time: {results.websiteCheck.response.time}ms
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">SSL Certificate</h4>
                            <div className="flex items-center">
                              <Badge
                                variant={results.websiteCheck.ssl.valid ? "default" : "destructive"}
                                className="mr-2"
                              >
                                {results.websiteCheck.ssl.valid ? "Valid" : "Invalid"}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Expires: {results.websiteCheck.ssl.expires}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">Blacklist Status</h4>
                            <div className="flex items-center">
                              <Badge
                                variant={results.websiteCheck.blacklist.listed ? "destructive" : "default"}
                                className="mr-2"
                              >
                                {results.websiteCheck.blacklist.listed ? "Listed" : "Clean"}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Checked against 100 blacklists
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium mb-2">DNS Records</h4>
                            <div className="text-sm text-gray-600">
                              {Object.keys(results.websiteCheck.dns).length} DNS record types found
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.keys(results.websiteCheck.dns).map((recordType) => (
                                <Badge key={recordType} variant="outline">
                                  {recordType}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ssl">
                        <div className="p-4 border rounded-lg mt-4">
                          <div className="flex items-center mb-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                                ${results.websiteCheck.ssl.valid ? "bg-green-100" : "bg-red-100"}`}
                            >
                              <i
                                className={`fas ${results.websiteCheck.ssl.valid ? "fa-lock text-green-600" : "fa-unlock text-red-600"}`}
                              ></i>
                            </div>
                            <div>
                              <h4 className="font-medium">SSL Certificate</h4>
                              <p className="text-sm text-gray-600">
                                {results.websiteCheck.ssl.valid ? 
                                  "Valid certificate found" : 
                                  "Invalid or missing SSL certificate"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm">
                                <span className="font-medium">Status:</span>
                                <Badge
                                  variant={results.websiteCheck.ssl.valid ? "default" : "destructive"}
                                  className="ml-2"
                                >
                                  {results.websiteCheck.ssl.valid ? "Valid" : "Invalid"}
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Issuer:</span> {results.websiteCheck.ssl.issuer}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm">
                                <span className="font-medium">Expires:</span> {results.websiteCheck.ssl.expires}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="dns">
                        <div className="space-y-4 mt-4">
                          {Object.entries(results.websiteCheck.dns).map(([recordType, records]) => (
                            <Card key={recordType}>
                              <CardContent className="pt-6">
                                <h4 className="font-medium mb-2">{recordType} Records</h4>
                                <div className="space-y-2">
                                  {records.map((record, i) => (
                                    <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                                      {record}
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="blacklist">
                        <div className="mt-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="flex items-center mb-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 
                                    ${results.websiteCheck.blacklist.listed ? "bg-red-100" : "bg-green-100"}`}
                                >
                                  <i
                                    className={`fas ${results.websiteCheck.blacklist.listed ? "fa-ban text-red-600" : "fa-check text-green-600"}`}
                                  ></i>
                                </div>
                                <div>
                                  <h4 className="font-medium">Blacklist Status</h4>
                                  <p className="text-sm text-gray-600">
                                    {results.websiteCheck.blacklist.listed ? 
                                      "Your domain is listed on spam blacklists" : 
                                      "Your domain is not listed on any spam blacklists"}
                                  </p>
                                </div>
                              </div>
                              
                              {results.websiteCheck.blacklist.listed ? (
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Listed on:</h5>
                                  <div className="space-y-2">
                                    {results.websiteCheck.blacklist.sources.map((source, i) => (
                                      <div key={i} className="p-2 bg-red-50 text-red-800 rounded text-sm">
                                        {source}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 bg-green-50 text-green-800 rounded text-sm">
                                  Clean status across all major blacklists
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}
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

export default WebsiteToolsDetailed;