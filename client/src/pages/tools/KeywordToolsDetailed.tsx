import React, { useState, useEffect } from "react";
import ToolPageTemplate from "../../components/tools/ToolPageTemplate";
import ToolContentTemplate from "../../components/tools/ToolContentTemplate";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { useLocation, useRoute } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Define types for our keyword data
interface KeywordItem {
  keyword: string;
  google: number;
  bing: number;
  yahoo: number;
  change?: number;
  position?: number;
  volume?: number;
  difficulty?: number;
  competition?: number;
  searchVolume?: number;
  density?: number;
  density_percent?: number;
  count?: number;
}

interface CompetitorItem {
  name: string;
  score: number;
  rank: number;
}

interface KeywordToolConfig {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  howToUse: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  options?: {
    hasSearchEngineSelect?: boolean;
    hasLocationSelect?: boolean;
    hasLanguageSelect?: boolean;
    hasDifficultyScale?: boolean;
    hasKeywordDensityChart?: boolean;
    hasCompetitionAnalysis?: boolean;
    hasSearchVolumeMetric?: boolean;
    hasKeywordSuggestions?: boolean;
    hasContentAnalysis?: boolean;
  };
}

const KeywordToolsDetailed: React.FC = () => {
  const [toolType, setToolType] = useState<string>("keyword-position");
  const [config, setConfig] = useState<KeywordToolConfig | null>(null);
  const [keywords, setKeywords] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [searchEngine, setSearchEngine] = useState<string>("google");
  const [location, setLocation] = useState<string>("united_states");
  const [language, setLanguage] = useState<string>("english");
  const [results, setResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [, setLocation_nav] = useLocation();
  const [match, params] = useRoute("/tools/:tool");
  const [match2] = useRoute("/:tool");
  const currentPath = window.location.pathname;

  useEffect(() => {
    // Set tool type based on URL
    if (currentPath.includes("keyword-position")) {
      setToolType("keyword-position");
    } else if (currentPath.includes("keyword-density-checker")) {
      setToolType("keyword-density-checker");
    } else if (currentPath.includes("keywords-suggestions-tool")) {
      setToolType("keywords-suggestions-tool");
    } else if (currentPath.includes("keyword-research-tool")) {
      setToolType("keyword-research-tool");
    } else if (currentPath.includes("keyword-competition-tool")) {
      setToolType("keyword-competition-tool");
    } else if (currentPath.includes("related-keywords-finder")) {
      setToolType("related-keywords-finder");
    } else if (currentPath.includes("long-tail-keyword-suggestion-tool")) {
      setToolType("long-tail-keyword-suggestion-tool");
    } else if (currentPath.includes("keywords-rich-domains-suggestions-tool")) {
      setToolType("keywords-rich-domains-suggestions-tool");
    } else if (currentPath.includes("seo-keyword-competition-analysis")) {
      setToolType("seo-keyword-competition-analysis");
    } else if (currentPath.includes("live-keyword-analyzer")) {
      setToolType("live-keyword-analyzer");
    } else if (currentPath.includes("keyword-overview-tool")) {
      setToolType("keyword-overview-tool");
    } else if (currentPath.includes("keyword-difficulty-checker")) {
      setToolType("keyword-difficulty-checker");
    } else if (currentPath.includes("paid-keyword-finder")) {
      setToolType("paid-keyword-finder");
    } else {
      setToolType("keyword-position"); // Default
    }
  }, [currentPath]);

  useEffect(() => {
    // Configure the tool based on the type
    const configurations: { [key: string]: KeywordToolConfig } = {
      "keyword-position": {
        title: "Keyword Position Checker",
        slug: "keyword-position",
        description: "Track and analyze your keyword rankings in search engine results with our Keyword Position Checker. This essential SEO tool helps you monitor where your website ranks for important keywords across multiple search engines. Stay informed about your ranking changes, identify opportunities for improvement, and benchmark against competitors. Understanding your keyword positions is the first step to improving your search visibility and driving more organic traffic to your website.",
        introduction: "Track your website's ranking position for target keywords across major search engines.",
        howToUse: [
          "Enter your website URL in the designated field",
          "Add your target keywords (one per line or comma-separated)",
          "Select the search engine you want to check rankings for",
          "Choose your target location and language if needed",
          "Click 'Check Positions' and wait for the results to be analyzed"
        ],
        features: [
          "✅ Check rankings across Google, Bing, Yahoo, and other major search engines",
          "✅ Location-specific ranking checks for accurate local SEO insights",
          "✅ Historical ranking data to track position changes over time",
          "✅ Competitor comparison to see how you rank against other websites",
          "✅ Mobile vs. desktop ranking differentiation for comprehensive insights"
        ],
        faqs: [
          {
            question: "How often should I check my keyword positions?",
            answer: "For most websites, checking keyword positions once a week is sufficient to track meaningful changes while avoiding temporary fluctuations. However, after making significant website changes or during competitive seasons, you might want to check more frequently (2-3 times per week) to monitor immediate impacts. For larger websites targeting hundreds of keywords, consider setting up scheduled checks with different keyword groups on different days."
          },
          {
            question: "Why are my keyword rankings different from what I see when I search?",
            answer: "Search results vary based on several factors including your location, search history, device type, and personalization settings. Our Keyword Position Checker uses neutral, non-personalized searches to provide objective ranking data that represents what the average user would see. Additionally, rankings fluctuate throughout the day as search engines update their indexes and algorithms."
          },
          {
            question: "What does it mean if my keyword isn't found in the top 100 results?",
            answer: "If your keyword isn't found in the top 100 results, it means your website is ranking beyond page 10 for that term. This usually indicates that: 1) The keyword is highly competitive, 2) Your content isn't sufficiently optimized for that keyword, 3) Your website might need more authority to rank for that term, or 4) The keyword might not be relevant enough to your content from the search engine's perspective."
          },
          {
            question: "How can I improve my keyword positions?",
            answer: "To improve keyword positions: 1) Create high-quality, in-depth content that thoroughly addresses the search intent, 2) Optimize on-page elements like titles, headings, meta descriptions, and URL structure, 3) Build quality backlinks from reputable websites in your industry, 4) Improve technical SEO aspects like site speed, mobile-friendliness, and schema markup, 5) Enhance user experience metrics like bounce rate and dwell time, and 6) Update content regularly to keep it fresh and relevant."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: false,
          hasKeywordSuggestions: false,
          hasContentAnalysis: false
        }
      },
      "keyword-density-checker": {
        title: "Keyword Density Checker",
        slug: "keyword-density-checker",
        description: "Analyze your content's keyword usage with our Keyword Density Checker to ensure optimal SEO performance without keyword stuffing. This intelligent tool calculates the frequency and distribution of keywords throughout your content, helping you maintain the ideal keyword density for search engine algorithms. By identifying primary, secondary, and LSI keywords along with their usage patterns, you can create perfectly balanced content that ranks well while remaining natural and reader-friendly. Avoid over-optimization penalties and create content that satisfies both search engines and human readers.",
        introduction: "Calculate the optimal keyword density in your content for better SEO results while avoiding keyword stuffing.",
        howToUse: [
          "Paste your content into the text box or upload your document",
          "Click 'Analyze Density' to process your content",
          "Review the keyword density percentages and distribution",
          "Examine suggestions for improving keyword usage",
          "Make adjustments to your content based on the analysis"
        ],
        features: [
          "✅ Calculate precise keyword and phrase density percentages",
          "✅ Identify primary, secondary, and LSI keywords automatically",
          "✅ Visualize keyword distribution throughout your content",
          "✅ Compare your density metrics against ideal ranges for your industry",
          "✅ Receive actionable suggestions to improve keyword usage"
        ],
        faqs: [
          {
            question: "What is the ideal keyword density for SEO?",
            answer: "While there's no universal perfect percentage, most SEO experts recommend a keyword density between 1-2% for primary keywords. This generally means using your main keyword once every 100-200 words. For secondary keywords, aim for 0.5-1%. However, these ranges vary by industry, content type, and search intent. The quality and context of keyword usage matter more than the exact percentage - focus on natural integration rather than hitting specific numbers."
          },
          {
            question: "Can high keyword density hurt my rankings?",
            answer: "Yes, excessive keyword density (often called 'keyword stuffing') can trigger search engine penalties and hurt your rankings. Modern search algorithms like Google's are sophisticated enough to detect when keywords are being unnaturally overused. Content with unnaturally high keyword density not only risks algorithmic penalties but also typically offers a poor user experience, leading to higher bounce rates and lower engagement signals that further harm rankings."
          },
          {
            question: "Should I focus on single keywords or phrases?",
            answer: "Modern SEO requires a balanced approach to both. While traditional keyword density often focused on single keywords, today's search engines understand semantic relationships and context. You should analyze both single keywords and relevant phrases (especially long-tail keywords and natural language questions). Our tool analyzes single words, 2-word phrases, and 3-word phrases to give you a comprehensive view of your content's keyword usage patterns."
          },
          {
            question: "How does keyword density affect my content readability?",
            answer: "Keyword density directly impacts readability. When density is too high, content sounds repetitive, unnatural, and harder to read, creating a poor user experience. Conversely, appropriate keyword density makes content flow naturally while still signaling relevance to search engines. Always prioritize readability and natural language over hitting specific density targets. If adding a keyword would make your content sound awkward, it's better to use synonyms or related terms instead."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: false,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: true,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: false,
          hasKeywordSuggestions: false,
          hasContentAnalysis: true
        }
      },
      "keywords-suggestions-tool": {
        title: "Keyword Suggestions Tool",
        slug: "keywords-suggestions-tool",
        description: "Discover high-potential keywords to enhance your content strategy with our Keyword Suggestions Tool. This powerful utility analyzes search patterns and user intent to generate relevant keyword ideas tailored to your niche or topic. Uncover popular search terms, questions, and related phrases that your target audience is actively using. Our tool provides a comprehensive set of keyword variations including long-tail keywords, semantic alternatives, and trending terms to help expand your content reach and connect with more potential visitors.",
        introduction: "Generate relevant keyword ideas to expand your content strategy and reach more potential visitors.",
        howToUse: [
          "Enter a seed keyword or topic in the search field",
          "Select your target location and language (optional)",
          "Click 'Generate Suggestions' to discover related keywords",
          "Filter results by search volume, competition, or keyword type",
          "Export your selected keywords for use in your content planning"
        ],
        features: [
          "✅ Generate hundreds of relevant keyword suggestions from a single seed term",
          "✅ Discover long-tail keywords with higher conversion potential",
          "✅ Identify questions your audience is asking about your topic",
          "✅ Uncover semantically-related terms to expand your content scope",
          "✅ Find trending keywords with growing search volume"
        ],
        faqs: [
          {
            question: "What's the difference between short and long-tail keywords?",
            answer: "Short keywords (1-2 words) are typically broader terms with high search volume and high competition, making them difficult to rank for. Examples include 'running shoes' or 'dog food.' Long-tail keywords (3+ words) are more specific phrases with lower search volume but higher conversion potential and less competition. Examples include 'women's trail running shoes for flat feet' or 'grain-free puppy food for sensitive stomachs.' Our suggestion tool provides both types, but long-tail keywords often offer better opportunities for newer websites."
          },
          {
            question: "How many keywords should I target in a single piece of content?",
            answer: "Most SEO experts recommend focusing on one primary keyword and 2-5 closely related secondary keywords per content piece. This approach allows you to create focused content that thoroughly addresses a specific topic rather than superficially covering multiple topics. Our keyword suggestions tool helps you identify clusters of related keywords that can be naturally incorporated into a single piece of comprehensive content, supporting your primary keyword while expanding your semantic relevance."
          },
          {
            question: "Why are question-based keywords important?",
            answer: "Question-based keywords are valuable for several reasons: 1) They directly reflect what your audience wants to know, 2) They align perfectly with voice search queries, which are growing rapidly, 3) They provide opportunities to appear in Google's Featured Snippets and People Also Ask sections, 4) They help structure content around actual user needs, and 5) They naturally lead to more comprehensive, valuable content. Our tool specifically identifies question formats like who, what, when, where, why, and how related to your topic."
          },
          {
            question: "How often should I look for new keyword suggestions?",
            answer: "Search trends evolve continuously, so refreshing your keyword research regularly is important. For most industries, conducting comprehensive keyword research quarterly is a good practice. However, for rapidly changing or trending topics, monthly keyword research may be necessary. Our tool incorporates trending data to help you spot emerging opportunities before they become highly competitive. Set a calendar reminder to run new searches periodically to keep your content strategy ahead of the curve."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "keyword-research-tool": {
        title: "Keyword Research Tool",
        slug: "keyword-research-tool",
        description: "Discover high-value keywords to drive your content strategy with our comprehensive Keyword Research Tool. This powerful SEO utility provides in-depth analysis on search volume, competition levels, difficulty scores, and trend data to help you identify the most strategic keywords for your website. Uncover untapped opportunities with detailed metrics on CPC, SERP features, and click-through rates. Our tool combines data from multiple sources to give you the most accurate and actionable keyword insights, enabling you to make data-driven decisions for your SEO and content marketing campaigns.",
        introduction: "Find the perfect keywords to boost your SEO performance with comprehensive search metrics and competition analysis.",
        howToUse: [
          "Enter a seed keyword, domain, or topic to analyze",
          "Select your target location and language",
          "Click 'Research Keywords' to generate comprehensive data",
          "Filter results by volume, difficulty, CPC, or other metrics",
          "Export your selected keywords with full metrics for your SEO strategy"
        ],
        features: [
          "✅ Comprehensive data including search volume, trends, and competition",
          "✅ Keyword difficulty scoring to identify realistic ranking opportunities",
          "✅ Historical trend data to spot seasonal patterns and emerging terms",
          "✅ Click potential analysis showing estimated traffic values",
          "✅ Content gap finder to discover keywords your competitors rank for but you don't"
        ],
        faqs: [
          {
            question: "What metrics should I prioritize when selecting keywords?",
            answer: "The most important metrics to consider are: 1) Search Volume - how many monthly searches the keyword receives, 2) Keyword Difficulty - how hard it will be to rank for, 3) Intent Match - whether the keyword aligns with your content goals (informational, commercial, etc.), 4) Relevance - how closely it matches your actual offerings, and 5) Trend Direction - whether interest is growing or declining. For newer websites, prioritize lower difficulty keywords with good volume. For established sites, you can target more competitive terms. Always prioritize relevance over pure volume."
          },
          {
            question: "How do I choose between keywords with similar metrics?",
            answer: "When keywords have similar metrics, consider these additional factors: 1) Conversion Potential - which term is more likely to lead to your desired action, 2) Content Opportunity - which keyword allows you to create more valuable, comprehensive content, 3) SERP Features - which term has features you can target (featured snippets, etc.), 4) Competition Quality - analyze who ranks for each term and their domain authority, and 5) Business Value - which term aligns better with your products/services. Sometimes the best keyword isn't the one with the highest volume but the one with the best alignment to your specific goals."
          },
          {
            question: "How accurate is the search volume data?",
            answer: "Search volume data is an approximation rather than an exact figure. Our tool aggregates data from multiple sources to provide the most reliable estimates, but variations of 10-20% are normal. Additionally, search volume can fluctuate seasonally and during events that affect your industry. For this reason, we provide both average monthly volume and trend data to give you context. Focus on the relative volumes between keywords rather than the absolute numbers, and use trends to identify seasonal patterns."
          },
          {
            question: "How many keywords should I research before creating content?",
            answer: "For a comprehensive content strategy, research at least 200-300 potential keywords initially, then narrow down to 50-100 core keywords organized by topic clusters. This approach ensures you're not missing valuable opportunities while allowing you to focus your efforts efficiently. For each individual piece of content, examine 10-20 closely related keywords to understand the full scope of the topic, then select 3-5 to actively target. Our research tool makes this process efficient by grouping semantically related keywords that can be addressed in the same content piece."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: true,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "keyword-competition-tool": {
        title: "Keyword Competition Tool",
        slug: "keyword-competition-tool",
        description: "Analyze the competitive landscape for your target keywords with our advanced Keyword Competition Tool. This specialized utility examines the websites currently ranking for your keywords and provides detailed competitive metrics including domain authority, content quality, backlink profiles, and more. Understand exactly what you're up against and identify keywords with the optimal balance of search volume and competition level. Our tool helps you make strategic decisions about which keywords to target based on your website's current strengths and realistic ranking potential.",
        introduction: "Assess the competition level for your target keywords to identify the most strategic ranking opportunities.",
        howToUse: [
          "Enter your target keywords (up to 10 per analysis)",
          "Select your target location and search engine",
          "Click 'Analyze Competition' to evaluate ranking difficulty",
          "Review detailed metrics about current top-ranking pages",
          "Identify keywords with the best opportunity-to-effort ratio"
        ],
        features: [
          "✅ Competition score from 1-100 for quick difficulty assessment",
          "✅ In-depth analysis of top-ranking domains and their authority",
          "✅ Content quality evaluation of current top results",
          "✅ Backlink profile analysis of ranking competitors",
          "✅ Actionable recommendations for competitive keywords you can realistically target"
        ],
        faqs: [
          {
            question: "What factors determine keyword competition level?",
            answer: "Keyword competition is determined by multiple factors including: 1) Domain Authority of ranking websites, 2) Page Authority of specific ranking pages, 3) Backlink quality and quantity pointing to ranking content, 4) Content depth and quality of top results, 5) On-page optimization level, 6) User engagement metrics of ranking pages, 7) Brand signals and exact match domains, and 8) SERP features present for the keyword. Our competition tool analyzes these factors to provide a comprehensive difficulty score and detailed breakdown to help you understand the specific competitive challenges."
          },
          {
            question: "How long would it take to rank for keywords at different competition levels?",
            answer: "Ranking timeframes vary based on your website's authority and resources, but generally: Low competition keywords (score 0-30) may show results within 1-3 months with quality content and basic optimization. Medium competition keywords (score 31-60) typically require 3-6 months of focused content and link building. High competition keywords (score 61-85) usually need 6-12 months of comprehensive SEO efforts. Very high competition keywords (score 86-100) often take 12+ months and significant resources to crack the top positions."
          },
          {
            question: "Should new websites avoid all high-competition keywords?",
            answer: "While new websites should focus primarily on low to medium competition keywords, there are strategic reasons to include some higher-competition terms in your overall strategy. Instead of avoiding them entirely, consider: 1) Creating foundational content now that can rank for these terms as your site gains authority, 2) Targeting long-tail variations of competitive terms that have lower difficulty, 3) Building topic clusters around competitive themes with easier subtopics, and 4) Monitoring these terms for future opportunities. This balanced approach builds toward long-term goals while securing shorter-term wins."
          },
          {
            question: "What's more important - search volume or competition level?",
            answer: "The ideal keywords balance both factors, but for most websites, competition level should weigh more heavily in your decision-making process. A keyword with moderate search volume (500-1,000 monthly searches) and low competition will typically drive more actual traffic than a high-volume keyword (10,000+ searches) where you can't crack the top 20 positions. Focus on keywords where the competition score aligns with your website's current capabilities, gradually targeting more competitive terms as your site authority grows. Our tool provides an 'opportunity score' that balances these factors."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: true,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: false,
          hasContentAnalysis: false
        }
      },
      "related-keywords-finder": {
        title: "Related Keywords Finder",
        slug: "related-keywords-finder",
        description: "Discover semantically related keywords to enhance your content relevance with our Related Keywords Finder. This intelligent tool identifies terms that are conceptually connected to your primary keyword, helping you create more comprehensive content that thoroughly covers your topic. By incorporating semantically related terms, you can improve your topical authority, increase content depth, and align with modern search engine algorithms that evaluate content quality based on semantic relevance. Our tool goes beyond simple variations to find truly related concepts that enrich your content strategy.",
        introduction: "Find semantically related keywords to create more comprehensive content that ranks better in search results.",
        howToUse: [
          "Enter your primary keyword or topic",
          "Select your content category for more relevant suggestions",
          "Click 'Find Related Keywords' to generate results",
          "Review the related terms organized by semantic relevance",
          "Export your selected keywords for content planning"
        ],
        features: [
          "✅ Discover semantically related terms beyond simple variations",
          "✅ Organize keywords by topical clusters for better content planning",
          "✅ Identify complementary concepts to expand your content scope",
          "✅ Find entity relationships that strengthen topical relevance",
          "✅ Access synonyms, related questions, and concept variations"
        ],
        faqs: [
          {
            question: "How are related keywords different from keyword variations?",
            answer: "Keyword variations are typically similar phrases with slightly different wording (e.g., 'best running shoes' vs. 'top running shoes'). Related keywords, by contrast, are semantically connected concepts that might use entirely different words but are conceptually linked to your topic (e.g., for 'running shoes,' related keywords might include 'pronation,' 'cushioning,' 'marathon training,' or 'foot strike'). Our Related Keywords Finder focuses on these deeper conceptual connections that help build comprehensive content demonstrating true expertise on a topic."
          },
          {
            question: "Why are semantically related keywords important for SEO?",
            answer: "Modern search algorithms like Google's BERT and MUM evaluate content quality partly based on how comprehensively it covers a topic. Using semantically related keywords: 1) Signals to search engines that your content has depth and expertise, 2) Improves topical relevance scores, 3) Helps content rank for a broader range of related queries, 4) Aligns with natural language processing that understands conceptual relationships, and 5) Creates more valuable content that answers related questions users might have. This approach matches how search engines understand topics rather than just matching exact keywords."
          },
          {
            question: "How many related keywords should I include in my content?",
            answer: "Rather than focusing on a specific number, aim to cover your topic comprehensively. For a typical 1,500-word article, naturally incorporating 15-25 related terms and concepts is reasonable. The key is integration that feels natural and adds value – forced inclusion of related terms can harm readability. Our tool groups related keywords by subtopics, making it easier to create a logical content structure that covers the semantic field thoroughly while maintaining excellent readability and user experience."
          },
          {
            question: "Can using related keywords help me rank for queries I don't explicitly target?",
            answer: "Yes! This is one of the main benefits of semantically enriched content. Modern search engines understand the relationships between concepts, allowing your content to rank for queries that use different terminology but seek the same information. For example, content about 'intermittent fasting' that properly incorporates related concepts like 'time-restricted eating,' 'metabolic window,' and 'autophagy' might rank for queries about these related terms even if they aren't your primary target keywords. This expands your content's reach without requiring separate pages for every keyword variation."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: false,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "long-tail-keyword-suggestion-tool": {
        title: "Long-Tail Keyword Suggestion Tool",
        slug: "long-tail-keyword-suggestion-tool",
        description: "Discover valuable long-tail keywords that drive targeted traffic with our specialized Long-Tail Keyword Suggestion Tool. This advanced utility focuses on generating longer, more specific keyword phrases that typically have lower competition but higher conversion potential. Ideal for niche targeting and content that addresses specific user questions, long-tail keywords collectively can drive significant traffic while being easier to rank for. Our tool uncovers these hidden opportunities by analyzing search patterns, questions, and specific modifiers relevant to your primary topic.",
        introduction: "Find specific, low-competition long-tail keywords that convert better and are easier to rank for.",
        howToUse: [
          "Enter a primary keyword or topic to expand into long-tail variations",
          "Select your industry or niche for more relevant suggestions",
          "Click 'Generate Long-Tail Keywords' to discover specific phrases",
          "Filter results by word count, question format, or other parameters",
          "Export your selected long-tail keywords for content planning"
        ],
        features: [
          "✅ Generate hundreds of specific 3-6 word keyword phrases",
          "✅ Discover question-based keywords perfect for featured snippets",
          "✅ Find purchase-intent modifiers for commercial content",
          "✅ Identify informational long-tail keywords for top-of-funnel content",
          "✅ Access modifiers that indicate high conversion potential"
        ],
        faqs: [
          {
            question: "What makes a keyword 'long-tail' and why are they valuable?",
            answer: "Long-tail keywords are longer, more specific phrases (usually 3+ words) that target narrower audience segments with precise intent. For example, instead of 'running shoes,' a long-tail version might be 'women's waterproof trail running shoes for wide feet.' They're valuable because they: 1) Have lower competition and are easier to rank for, 2) Demonstrate higher conversion rates due to their specificity, 3) Match more precisely what certain segments of your audience are searching for, and 4) Collectively can drive substantial traffic despite individually lower search volumes."
          },
          {
            question: "How should I organize content around long-tail keywords?",
            answer: "Rather than creating separate content for each long-tail keyword, the most effective strategy is to group related long-tail keywords into topic clusters. Create a comprehensive pillar page around your main topic, then address clusters of related long-tail keywords within that content or in supporting articles. For example, a pillar page about 'home office setup' might naturally incorporate long-tail keywords about desk ergonomics, lighting solutions, and productivity layouts, with more specific long-tail terms addressed in linked supporting content."
          },
          {
            question: "Are question-based long-tail keywords worth targeting?",
            answer: "Question-based long-tail keywords are extremely valuable for several reasons: 1) They can help you win featured snippets and 'People Also Ask' placements, 2) They align perfectly with voice search queries, which are increasingly common, 3) They clearly signal the content format users expect (an answer to their specific question), and 4) They often have very specific intent that's easier to address comprehensively. Our tool specifically identifies question formats (who, what, when, where, why, how) and categorizes them for strategic content planning."
          },
          {
            question: "How do search volumes for long-tail keywords compare to short keywords?",
            answer: "Individual long-tail keywords typically have much lower search volumes than their shorter, broader counterparts. While a general term like 'protein powder' might have 100,000 monthly searches, a long-tail version like 'best plant-based protein powder for muscle building' might only have 1,000 searches. However, the collective volume of all related long-tail variations often exceeds the head term volume. Additionally, the conversion rate for specific long-tail terms is typically 2-5 times higher, making them extremely valuable despite lower individual volumes."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: false,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "keywords-rich-domains-suggestions-tool": {
        title: "Keyword-Rich Domain Suggestions Tool",
        slug: "keywords-rich-domains-suggestions-tool",
        description: "Find available domain names that incorporate your target keywords with our Keyword-Rich Domain Suggestions Tool. This specialized utility helps you discover brandable, memorable domain options that naturally include strategic keywords, potentially providing SEO advantages while creating a clear brand identity. Our tool checks domain availability in real-time across multiple TLDs (.com, .net, .org, etc.) and provides suggestions that balance keyword inclusion with brandability, helping you find the perfect domain name for your new website or project.",
        introduction: "Discover available domain names that naturally incorporate your target keywords for better branding and SEO.",
        howToUse: [
          "Enter your primary keywords or phrases (up to 3 recommended)",
          "Select domain extensions you're interested in (.com, .net, etc.)",
          "Choose domain name style preferences (prefix, suffix, exact match)",
          "Click 'Generate Domain Suggestions' to see available options",
          "Review suggestions and check real-time availability"
        ],
        features: [
          "✅ Generate dozens of available keyword-rich domain suggestions",
          "✅ Check real-time availability across multiple TLDs",
          "✅ Balance SEO value with brandability and memorability",
          "✅ Discover creative word combinations that include your keywords",
          "✅ Evaluate domain quality with our proprietary scoring system"
        ],
        faqs: [
          {
            question: "Do keyword-rich domains still provide SEO benefits?",
            answer: "While exact-match domains (EMDs) don't provide the strong ranking advantage they once did, keyword-rich domains can still offer benefits: 1) They create immediate relevance signals to both users and search engines, 2) They typically earn higher click-through rates when they match search queries, 3) They naturally attract relevant backlinks with optimized anchor text, and 4) They support brand recognition when the keyword relates to your primary offerings. The key is finding a domain that incorporates keywords naturally without sacrificing brandability or appearing spammy."
          },
          {
            question: "Which is better: a keyword-rich domain or a brandable domain?",
            answer: "The ideal domain combines both qualities - it includes relevant keywords while remaining distinctive and brandable. If forced to choose between the two, most digital marketing experts now recommend prioritizing brandability over exact keyword matching. A unique, memorable brand name typically provides more long-term value than keyword inclusion alone. Our domain suggestion tool aims to find the sweet spot - domains that incorporate your keywords in a way that still creates a distinctive brand identity rather than generic-sounding exact match domains."
          },
          {
            question: "Should I choose .com or consider alternative TLDs?",
            answer: "While .com remains the gold standard for commercial websites due to its familiarity and credibility, alternative TLDs can sometimes provide advantages: 1) Greater availability of premium names, 2) Industry-specific relevance (like .tech for technology companies), 3) Potential for creative brand integration (like del.icio.us historically), and 4) Sometimes lower registration costs. If you choose an alternative TLD, ensure it's widely recognized (.org, .net, .io) or clearly relates to your industry to minimize confusion. Always secure the .com version if possible, even if you primarily use another extension."
          },
          {
            question: "What makes a good keyword-rich domain name?",
            answer: "A strong keyword-rich domain should: 1) Be relatively short (ideally under 15 characters), 2) Be easy to spell and pronounce, 3) Avoid hyphens and numbers that create confusion, 4) Incorporate keywords naturally without feeling forced, 5) Have brandability and memorability beyond just the keywords, and 6) Be available on a trustworthy TLD like .com. Balance is crucial - the best domains suggest what your business does through keywords while still functioning as a distinctive brand name that can grow with your business."
          }
        ],
        options: {
          hasSearchEngineSelect: false,
          hasLocationSelect: false,
          hasLanguageSelect: false,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: false,
          hasSearchVolumeMetric: false,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "seo-keyword-competition-analysis": {
        title: "SEO Keyword Competition Analysis",
        slug: "seo-keyword-competition-analysis",
        description: "Get in-depth competitive intelligence on your target keywords with our comprehensive SEO Keyword Competition Analysis tool. This advanced utility provides detailed insights into the websites currently ranking for your keywords, including domain authority metrics, content quality analysis, backlink profiles, and on-page optimization factors. Understand exactly what level of effort would be required to rank for specific terms and identify the most strategic opportunities based on your website's current position. Our tool helps you make data-driven decisions about where to focus your SEO resources for maximum impact.",
        introduction: "Analyze exactly what it will take to outrank competitors for your target keywords with comprehensive competitive metrics.",
        howToUse: [
          "Enter your target keywords and your website URL (optional)",
          "Select depth of analysis (standard or advanced)",
          "Click 'Analyze Competition' to evaluate ranking difficulty",
          "Review detailed competitive metrics for each keyword",
          "Export a complete competitive analysis report for your strategy planning"
        ],
        features: [
          "✅ Comprehensive analysis of top 10 ranking pages for each keyword",
          "✅ Detailed domain and page authority metrics with comparative analysis",
          "✅ Content quality assessment including word count, readability, and topic coverage",
          "✅ Backlink profile evaluation with quality and quantity metrics",
          "✅ Custom difficulty score with specific recommendations for ranking improvement"
        ],
        faqs: [
          {
            question: "How is SEO Keyword Competition Analysis different from basic keyword research?",
            answer: "Standard keyword research typically provides surface-level metrics like search volume and a general difficulty score. Our SEO Keyword Competition Analysis goes much deeper by: 1) Analyzing each ranking website's specific strengths and weaknesses, 2) Providing page-level metrics rather than just domain-level data, 3) Evaluating content quality factors like comprehensiveness and readability, 4) Analyzing backlink quality rather than just quantity, and 5) Identifying specific ranking factors you need to improve to compete. This depth allows for truly strategic decisions rather than relying on general difficulty scores."
          },
          {
            question: "How can I use the competition analysis to improve my SEO strategy?",
            answer: "The competitive insights should directly inform your strategy in several ways: 1) Content Development - seeing exactly what depth, format and topics are working for competitors, 2) Link Building - understanding the quantity and quality of links needed to compete, 3) On-page Optimization - identifying technical and structural elements successful pages share, 4) Resource Allocation - focusing efforts on keywords where you have a realistic chance to rank, and 5) Benchmarking - setting realistic timelines and expectations for ranking improvements based on the competitive gap."
          },
          {
            question: "What competitive metrics matter most for ranking potential?",
            answer: "While all metrics provide valuable insights, the most predictive factors for ranking potential are: 1) Page-level authority and relevance (more important than domain-wide metrics), 2) Content comprehensiveness relative to ranking pages, 3) Quality and relevance of backlinks rather than just quantity, 4) User engagement signals (estimated through bounce rate and dwell time), and 5) Topical authority established across your domain. Our analysis weighs these factors accordingly to provide the most accurate competitive assessment and actionable recommendations."
          },
          {
            question: "How often should I update my competitive keyword analysis?",
            answer: "For most industries, refreshing your competitive analysis quarterly is sufficient to stay current with market changes. However, in highly competitive or rapidly evolving niches, monthly updates may be necessary. Additionally, you should perform a new analysis whenever: 1) You're planning new content or site sections, 2) You notice significant ranking fluctuations, 3) After completing major SEO initiatives to measure impact, or 4) When new competitors emerge in your space. Our tool makes it easy to save previous analyses and compare changes over time."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: true,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: false,
          hasContentAnalysis: true
        }
      },
      "live-keyword-analyzer": {
        title: "Live Keyword Analyzer",
        slug: "live-keyword-analyzer",
        description: "Monitor your keyword performance in real-time with our dynamic Live Keyword Analyzer. This powerful tool provides continuous updates on your keyword rankings, search volume fluctuations, and competitive positioning as they happen. Track daily ranking changes, identify emerging trends, and receive instant alerts when significant shifts occur. Perfect for managing time-sensitive SEO campaigns, responding to algorithm updates, or monitoring the immediate impact of your optimization efforts. Our live analyzer gives you the up-to-the-minute data you need to make agile, responsive SEO decisions.",
        introduction: "Track keyword rankings and metrics in real-time to capitalize on opportunities as they emerge.",
        howToUse: [
          "Enter your website URL and target keywords to monitor",
          "Select refresh frequency (hourly, daily, or custom intervals)",
          "Set up alert parameters for significant ranking changes",
          "View real-time performance across search engines and locations",
          "Track historical performance with interactive timeline graphs"
        ],
        features: [
          "✅ Real-time ranking updates with configurable refresh intervals",
          "✅ Live SERP feature tracking to capture featured snippet opportunities",
          "✅ Instant alerts for significant ranking changes or competitor movements",
          "✅ Interactive dashboards showing minute-by-minute performance",
          "✅ Comparative analysis with live competitor rank tracking"
        ],
        faqs: [
          {
            question: "How often does the Live Keyword Analyzer update rankings?",
            answer: "Our Live Keyword Analyzer offers flexible update frequencies to match your needs. The standard setting checks rankings every 24 hours, but premium users can configure updates as frequently as hourly for their most critical keywords. For most businesses, daily updates provide the right balance of timeliness and data reliability since search rankings naturally fluctuate throughout the day. For time-sensitive campaigns or during major algorithm updates, the hourly tracking option provides the most responsive monitoring available."
          },
          {
            question: "Are real-time ranking fluctuations something I should worry about?",
            answer: "Minor real-time fluctuations are normal and usually don't require immediate action. Search engines constantly test and adjust results, causing positions to shift slightly throughout the day. Our analyzer distinguishes between normal fluctuations and significant changes by highlighting sustained movements or trends over time. Focus on changes that persist for at least 48-72 hours or show a clear directional trend rather than reacting to every small movement. The tool's trend analysis helps separate meaningful shifts from normal ranking volatility."
          },
          {
            question: "How is live keyword analysis different from standard rank tracking?",
            answer: "Standard rank tracking typically provides periodic snapshots of your positions (often weekly or monthly), focusing on long-term trends. Our Live Keyword Analyzer offers several advantages: 1) Much more frequent updates to capture time-sensitive opportunities, 2) Immediate notification of significant changes, 3) Real-time competitor monitoring to identify new competitive threats, 4) Continuous tracking of SERP feature changes that might affect click-through rates, and 5) The ability to correlate ranking changes with specific optimization efforts or external events almost immediately."
          },
          {
            question: "How can I use live keyword data most effectively?",
            answer: "To maximize the value of real-time keyword data: 1) Set up custom alerts for your most valuable keywords to respond quickly to significant changes, 2) Use the timeline feature to correlate ranking shifts with specific content updates, backlink acquisitions, or algorithm updates, 3) Monitor competitor movements to identify new optimization strategies they might be implementing, 4) Track performance immediately after implementing changes to gauge their impact, and 5) Use the geographic comparison feature to identify location-based ranking opportunities. Live data is most valuable when you're prepared to take timely action based on the insights."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: false,
          hasContentAnalysis: false
        }
      },
      "keyword-overview-tool": {
        title: "Keyword Overview Tool",
        slug: "keyword-overview-tool",
        description: "Get a comprehensive 360-degree view of any keyword with our all-in-one Keyword Overview Tool. This powerful utility aggregates essential metrics from multiple data sources to provide a complete understanding of a keyword's potential, including search volume trends, competition levels, SERP features, click-through rates, and cost-per-click data. Perfect for quickly evaluating keyword opportunities without switching between multiple tools. Our keyword overview gives you the complete picture to make informed decisions about which terms to target in your content and SEO strategy.",
        introduction: "Access all essential keyword metrics in one place to quickly evaluate SEO and content opportunities.",
        howToUse: [
          "Enter any keyword to analyze its full profile",
          "Select your target location and language for localized data",
          "View the comprehensive dashboard of all key metrics",
          "Analyze SERP features and ranking difficulty",
          "Export complete keyword reports for your strategy planning"
        ],
        features: [
          "✅ Comprehensive data including search volume, CPC, and competition",
          "✅ Historical trends showing seasonal patterns and growth trajectory",
          "✅ SERP feature analysis showing snippet opportunities",
          "✅ Click-through rate estimates based on current SERP layouts",
          "✅ Related keywords and questions for content planning"
        ],
        faqs: [
          {
            question: "What makes this Keyword Overview Tool different from basic keyword research?",
            answer: "Our Keyword Overview Tool provides a uniquely comprehensive view by aggregating data from multiple sources that typically require separate tools. While basic keyword research might only show volume and generic difficulty, our overview includes: 1) Click potential based on SERP layout analysis, 2) Historical trend data going back 5 years, 3) Device-specific performance metrics (mobile vs. desktop), 4) Complete SERP feature analysis showing all ranking enhancements, 5) Intent classification with confidence scoring, and 6) Integrated competitor analysis showing who currently ranks. This 360-degree view enables much more informed decision-making."
          },
          {
            question: "How accurate is the search volume data in the overview?",
            answer: "Our search volume data combines multiple authoritative sources to maximize accuracy, but all keyword tools provide estimates rather than exact figures. We typically find our volume estimates to be within 10-15% of actual search volume. For more reliable analysis, focus on the relative volumes between keywords and the trend direction rather than exact numbers. For this reason, we provide confidence intervals alongside our volume data as well as trend indicators showing whether interest in the term is growing, stable, or declining over time."
          },
          {
            question: "What are SERP features and why do they matter for keyword selection?",
            answer: "SERP (Search Engine Results Page) features are special elements that appear alongside traditional organic listings, including featured snippets, knowledge panels, image carousels, video results, local packs, shopping results, and more. They matter tremendously for keyword selection because they: 1) Affect the click-through rate for organic positions, 2) Provide special ranking opportunities (like position zero for featured snippets), 3) Indicate search intent signals, and 4) Can dramatically change the visibility of standard organic listings. Our overview shows all features appearing for each keyword to help you target the most valuable opportunities."
          },
          {
            question: "How should I use the keyword intent classification in the overview?",
            answer: "Our intent classification system categorizes keywords into four main types: Informational (looking for knowledge), Navigational (seeking a specific website), Commercial Investigation (researching products/services), and Transactional (ready to purchase). Use this classification to: 1) Match content types to appropriate intents (guides for informational, product pages for transactional), 2) Align keywords with your marketing funnel stages, 3) Set appropriate KPIs based on intent (engagement metrics for informational, conversion metrics for transactional), and 4) Identify potential mismatches between your content approach and user intent. The confidence score indicates how clearly the keyword signals a particular intent."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: true,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      },
      "keyword-difficulty-checker": {
        title: "Keyword Difficulty Checker",
        slug: "keyword-difficulty-checker",
        description: "Accurately assess how challenging it will be to rank for specific keywords with our specialized Keyword Difficulty Checker. This analytical tool evaluates multiple ranking factors to provide a precise difficulty score and estimated timeframe for ranking success. Understand the specific obstacles you'll face for each keyword, including domain authority requirements, content complexity, and backlink thresholds needed to compete. Our checker helps you prioritize keywords based on your website's current strengths and realistic ranking potential, ensuring you focus your SEO efforts where they'll be most effective.",
        introduction: "Measure exactly how difficult it will be to rank for your target keywords with precise scoring and time estimates.",
        howToUse: [
          "Enter your target keywords (up to 50 per batch)",
          "Add your website URL for personalized difficulty assessment",
          "Select target search engine and location",
          "Click 'Check Difficulty' to analyze ranking challenges",
          "Review detailed difficulty scores and ranking requirements"
        ],
        features: [
          "✅ Precise difficulty scoring on a 1-100 scale with ranking probability",
          "✅ Personalized assessment based on your website's current metrics",
          "✅ Estimated time-to-rank based on your site's authority",
          "✅ Specific benchmarks showing required backlinks and content quality",
          "✅ Competitive gap analysis comparing your site to current top rankers"
        ],
        faqs: [
          {
            question: "How is keyword difficulty calculated?",
            answer: "Our difficulty score analyzes multiple factors, weighted for their impact on ranking potential: 1) Domain and page authority of current top-ranking sites (40%), 2) Quality and relevance of backlink profiles (25%), 3) Content depth and comprehensiveness of ranking pages (20%), 4) On-page optimization levels and technical SEO factors (10%), and 5) User engagement metrics and click-through rates (5%). This multi-factor approach provides a more nuanced and accurate difficulty assessment than tools that rely solely on domain authority or backlink counts."
          },
          {
            question: "What difficulty score should I target for my website?",
            answer: "The appropriate difficulty range depends on your website's current authority and resources. As a general guideline: New websites (less than 1 year old) should focus primarily on keywords with difficulty scores under 30. Established sites with moderate authority should target the 30-50 range. Authoritative sites with strong backlink profiles can successfully target keywords in the 50-70 range. Only very authoritative domains should pursue keywords with difficulty scores above 70. Our personalized assessment helps refine these recommendations based on your specific website metrics."
          },
          {
            question: "How accurate are the time-to-rank estimates?",
            answer: "Our time-to-rank estimates are based on statistical analysis of historical ranking data across thousands of websites and keywords. They assume consistent, quality SEO work and indicate when you might reach the top 10 positions. These estimates are most accurate (within 1-2 months) for lower difficulty keywords. For higher difficulty terms, more variables come into play, widening the confidence interval. The estimates also assume steady improvement in your site's authority; major changes in your SEO efforts or algorithm updates can affect these timeframes."
          },
          {
            question: "Should I avoid high-difficulty keywords entirely?",
            answer: "Rather than avoiding high-difficulty keywords completely, develop a balanced approach: 1) Build your initial SEO foundation with lower-difficulty terms to establish relevance and authority, 2) Create aspirational content for higher-difficulty keywords that can improve in rankings over time as your site gains authority, 3) Target long-tail variations of difficult keywords that have lower competition but related relevance, and 4) Develop a long-term strategy for eventually competing on high-value, high-difficulty terms. This tiered approach provides both short-term wins and long-term growth potential."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: true,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: false,
          hasContentAnalysis: false
        }
      },
      "paid-keyword-finder": {
        title: "Paid Keyword Finder",
        slug: "paid-keyword-finder",
        description: "Discover high-performing keywords for your PPC campaigns with our specialized Paid Keyword Finder. This powerful tool identifies profitable keyword opportunities specifically for paid search advertising, providing comprehensive metrics on cost-per-click, competition levels, conversion potential, and ROI estimates. Uncover valuable long-tail variations with lower costs, identify negative keywords to exclude, and find the optimal balance between search volume and bid prices. Our paid keyword tool helps you build more cost-effective, higher-converting PPC campaigns across Google Ads, Microsoft Advertising, and other platforms.",
        introduction: "Find the most profitable keywords for your PPC campaigns with detailed cost and conversion metrics.",
        howToUse: [
          "Enter your primary keywords or website URL",
          "Select your industry and target locations",
          "Specify your average conversion value for ROI calculations",
          "Click 'Find Paid Keywords' to discover profitable opportunities",
          "Filter results by CPC, competition, conversion potential, or other metrics"
        ],
        features: [
          "✅ Comprehensive CPC data across multiple ad platforms",
          "✅ Conversion potential scoring based on intent analysis",
          "✅ ROI projections based on industry average conversion rates",
          "✅ Negative keyword suggestions to improve campaign efficiency",
          "✅ Ad group organization recommendations for account structure"
        ],
        faqs: [
          {
            question: "How are paid keywords different from organic SEO keywords?",
            answer: "While there's overlap, effective paid keywords often differ from organic targets in several ways: 1) Commercial Intent - paid keywords typically focus more heavily on transactional and commercial investigation terms, 2) ROI Sensitivity - paid keywords must generate positive returns more immediately, 3) Competition Factors - different metrics matter (bid prices vs. domain authority), 4) Specificity - paid campaigns often target more specific long-tail terms for efficiency, and 5) Negative Keywords - paid strategies require explicit exclusions. Our Paid Keyword Finder specifically evaluates terms through the lens of PPC performance rather than organic potential."
          },
          {
            question: "What metrics matter most when selecting paid keywords?",
            answer: "While volume and CPC are important, the most successful paid search advertisers prioritize: 1) Conversion Intent - how likely the keyword is to drive valuable actions, 2) ROI Potential - the estimated return accounting for both costs and conversion rates, 3) Relevance Match - how closely the keyword aligns with your specific offerings, 4) Quality Score Potential - how well your landing pages and ads can satisfy the intent, and 5) Competitive Differentiation - where you can outperform competitors despite their bids. Our tool specifically highlights these metrics rather than just showing the highest volume terms."
          },
          {
            question: "How accurate are the CPC estimates?",
            answer: "Our CPC estimates combine data from multiple sources including real campaign data, platform APIs, and predictive models. For established keywords with substantial advertising history, the estimates typically fall within 10-15% of actual costs. For newer or niche terms with less historical data, the variance may be larger. Remember that actual CPCs depend on many factors including your quality score, ad relevance, landing page experience, and competitive landscape at the exact moment of the auction. Use our estimates as directional guidance rather than exact predictions."
          },
          {
            question: "Should I focus on high-volume or low-competition paid keywords?",
            answer: "The most effective paid search strategy typically combines both approaches: 1) High-volume, competitive keywords provide visibility and traffic scale but at higher costs, 2) Low-competition, specific keywords offer better ROI and conversion rates with lower volume. We recommend a tiered approach: allocate the core of your budget to proven, high-intent keywords with reasonable competition, while testing both higher competition terms (with strict ROI monitoring) and discovering niche long-tail terms that competitors might miss. Our tool highlights 'hidden gem' keywords that offer the optimal balance between volume and competition."
          }
        ],
        options: {
          hasSearchEngineSelect: true,
          hasLocationSelect: true,
          hasLanguageSelect: true,
          hasDifficultyScale: false,
          hasKeywordDensityChart: false,
          hasCompetitionAnalysis: true,
          hasSearchVolumeMetric: true,
          hasKeywordSuggestions: true,
          hasContentAnalysis: false
        }
      }
    };

    // Set the config based on the tool type, defaulting to keyword-position if not found
    setConfig(configurations[toolType] || configurations["keyword-position"]);
  }, [toolType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!keywords.trim()) {
      setErrorMessage("Please enter at least one keyword.");
      return;
    }

    // For tools that need a URL
    if ((toolType === "keyword-position" || toolType === "live-keyword-analyzer") && !url.trim()) {
      setErrorMessage("Please enter a website URL.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    // Simulate processing delay
    setTimeout(() => {
      // Generate mock results based on the tool type
      let mockResults = simulateResults();
      setResults(mockResults);
      setIsProcessing(false);
    }, 2000);
  };

  const simulateResults = () => {
    // Mock results based on tool type
    switch (toolType) {
      case "keyword-position":
        return simulatePositionResults();
      case "keyword-density-checker":
        return simulateDensityResults();
      case "keywords-suggestions-tool":
      case "related-keywords-finder":
      case "long-tail-keyword-suggestion-tool":
        return simulateSuggestionResults();
      case "keyword-research-tool":
      case "keyword-overview-tool":
        return simulateResearchResults();
      case "keyword-competition-tool":
      case "seo-keyword-competition-analysis":
      case "keyword-difficulty-checker":
        return simulateCompetitionResults();
      case "live-keyword-analyzer":
        return simulateLiveAnalyzerResults();
      case "keywords-rich-domains-suggestions-tool":
        return simulateDomainSuggestions();
      case "paid-keyword-finder":
        return simulatePaidKeywordResults();
      default:
        return {
          message: "Analysis complete",
          data: []
        };
    }
  };

  const simulatePositionResults = () => {
    const keywordsList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      url: url,
      keywords: keywordsList.map(keyword => ({
        keyword,
        google: Math.floor(Math.random() * 100) + 1,
        bing: Math.floor(Math.random() * 100) + 1,
        yahoo: Math.floor(Math.random() * 100) + 1,
        previousPosition: Math.floor(Math.random() * 100) + 1,
        change: Math.floor(Math.random() * 20) - 10
      }))
    };
  };

  const simulateDensityResults = () => {
    const wordCount = Math.floor(Math.random() * 1000) + 500;
    const keywordsArray = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      wordCount,
      keywordDensity: keywordsArray.map(keyword => ({
        keyword,
        count: Math.floor(Math.random() * 20) + 1,
        density: ((Math.random() * 3) + 0.5).toFixed(2) + '%',
        isOptimal: Math.random() > 0.5
      })),
      topWords: [
        { word: 'content', count: Math.floor(Math.random() * 30) + 10 },
        { word: 'seo', count: Math.floor(Math.random() * 25) + 8 },
        { word: 'website', count: Math.floor(Math.random() * 20) + 6 },
        { word: 'search', count: Math.floor(Math.random() * 18) + 5 },
        { word: 'engine', count: Math.floor(Math.random() * 15) + 4 }
      ]
    };
  };

  const simulateSuggestionResults = () => {
    const mainKeyword = keywords.split(/[\n,]+/)[0].trim();
    
    return {
      baseKeyword: mainKeyword,
      suggestions: [
        { keyword: `best ${mainKeyword}`, volume: Math.floor(Math.random() * 9000) + 1000, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${mainKeyword} vs`, volume: Math.floor(Math.random() * 5000) + 500, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `how to use ${mainKeyword}`, volume: Math.floor(Math.random() * 3000) + 300, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${mainKeyword} for beginners`, volume: Math.floor(Math.random() * 2000) + 200, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${mainKeyword} examples`, volume: Math.floor(Math.random() * 1500) + 150, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `affordable ${mainKeyword}`, volume: Math.floor(Math.random() * 1200) + 120, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${mainKeyword} tutorial`, volume: Math.floor(Math.random() * 4000) + 400, difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${mainKeyword} software`, volume: Math.floor(Math.random() * 3500) + 350, difficulty: Math.floor(Math.random() * 100) }
      ],
      questions: [
        { question: `What is ${mainKeyword}?`, volume: Math.floor(Math.random() * 2000) + 200 },
        { question: `How does ${mainKeyword} work?`, volume: Math.floor(Math.random() * 1800) + 180 },
        { question: `Why is ${mainKeyword} important?`, volume: Math.floor(Math.random() * 1500) + 150 },
        { question: `When to use ${mainKeyword}?`, volume: Math.floor(Math.random() * 1200) + 120 }
      ]
    };
  };

  const simulateResearchResults = () => {
    const keywordsList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      keywords: keywordsList.map(keyword => ({
        keyword,
        volume: Math.floor(Math.random() * 10000) + 500,
        difficulty: Math.floor(Math.random() * 100),
        cpc: (Math.random() * 10).toFixed(2),
        trends: [40, 45, 48, 50, 53, 55, 60, 58, 56, 60, 65, 70],
        intent: ['informational', 'commercial', 'transactional'][Math.floor(Math.random() * 3)]
      }))
    };
  };

  const simulateCompetitionResults = () => {
    const keywordsList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      keywords: keywordsList.map(keyword => ({
        keyword,
        difficulty: Math.floor(Math.random() * 100),
        topCompetitors: [
          { 
            domain: 'competitor1.com', 
            authority: Math.floor(Math.random() * 100), 
            backlinks: Math.floor(Math.random() * 10000)
          },
          { 
            domain: 'competitor2.com', 
            authority: Math.floor(Math.random() * 100), 
            backlinks: Math.floor(Math.random() * 10000)
          },
          { 
            domain: 'competitor3.com', 
            authority: Math.floor(Math.random() * 100), 
            backlinks: Math.floor(Math.random() * 10000)
          }
        ],
        avgWordCount: Math.floor(Math.random() * 2000) + 1000,
        avgBacklinks: Math.floor(Math.random() * 500) + 50,
        timeToRank: Math.floor(Math.random() * 12) + 1 + ' months'
      }))
    };
  };

  const simulateLiveAnalyzerResults = () => {
    const keywordsList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      url: url,
      timestamp: new Date().toLocaleString(),
      keywords: keywordsList.map(keyword => ({
        keyword,
        currentPosition: Math.floor(Math.random() * 100) + 1,
        hourlyChanges: [0, 1, -1, 2, 0, -2, 1, 0, 0, 3, -1, 0, 1, -2, 0, 2, 1, 0, -1, 2, 0, -1, 1, 0],
        competitorMovements: [
          { 
            domain: 'competitor1.com', 
            position: Math.floor(Math.random() * 10) + 1,
            change: Math.floor(Math.random() * 5) - 2
          },
          { 
            domain: 'competitor2.com', 
            position: Math.floor(Math.random() * 10) + 1,
            change: Math.floor(Math.random() * 5) - 2
          }
        ]
      }))
    };
  };

  const simulateDomainSuggestions = () => {
    const mainKeyword = keywords.split(/[\n,]+/)[0].trim().replace(/\s+/g, '');
    
    return {
      keyword: mainKeyword,
      availableDomains: [
        { domain: `${mainKeyword}.com`, available: Math.random() > 0.7, price: '$3,995' },
        { domain: `${mainKeyword}.net`, available: Math.random() > 0.5, price: '$1,995' },
        { domain: `${mainKeyword}.org`, available: Math.random() > 0.4, price: '$1,495' },
        { domain: `my${mainKeyword}.com`, available: Math.random() > 0.3, price: '$14.99' },
        { domain: `the${mainKeyword}.com`, available: Math.random() > 0.3, price: '$14.99' },
        { domain: `${mainKeyword}online.com`, available: Math.random() > 0.2, price: '$14.99' },
        { domain: `${mainKeyword}hub.com`, available: Math.random() > 0.2, price: '$14.99' },
        { domain: `${mainKeyword}pro.com`, available: Math.random() > 0.2, price: '$14.99' },
        { domain: `best${mainKeyword}.com`, available: Math.random() > 0.2, price: '$14.99' },
        { domain: `${mainKeyword}expert.com`, available: Math.random() > 0.1, price: '$14.99' }
      ]
    };
  };

  const simulatePaidKeywordResults = () => {
    const keywordsList = keywords.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
    
    return {
      keywords: keywordsList.map(keyword => ({
        keyword,
        searchVolume: Math.floor(Math.random() * 10000) + 500,
        cpc: (Math.random() * 10 + 0.5).toFixed(2),
        competition: (Math.random() * 0.9 + 0.1).toFixed(2),
        potentialROI: (Math.random() * 300 + 100).toFixed(2) + '%',
        suggestedBid: (Math.random() * 12 + 0.5).toFixed(2),
        estimatedClicks: Math.floor(Math.random() * 500) + 50,
        estimatedConversions: Math.floor(Math.random() * 50) + 5
      })),
      negativeKeywords: [
        'free', 'diy', 'how to', 'youtube', 'download'
      ]
    };
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Input for Keywords */}
        <div>
          <Label htmlFor="keywords">Enter Keywords</Label>
          <Textarea 
            id="keywords" 
            placeholder={`Enter your keywords here${toolType.includes("density") ? "\n\nOr paste your content for analysis" : "\n(one per line or comma-separated)"}`}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="h-32"
            required
          />
        </div>

        {/* Website URL Input (for specific tools) */}
        {(toolType === "keyword-position" || toolType === "live-keyword-analyzer" || toolType === "seo-keyword-competition-analysis") && (
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input 
              id="url" 
              type="url" 
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required={toolType === "keyword-position" || toolType === "live-keyword-analyzer"}
            />
            <p className="text-sm text-gray-500 mt-1">
              {toolType === "seo-keyword-competition-analysis" 
                ? "Optional: Add your website to see how you compare" 
                : "Enter the website you want to check rankings for"}
            </p>
          </div>
        )}

        {/* Search Engine Selector */}
        {config?.options?.hasSearchEngineSelect && (
          <div>
            <Label htmlFor="search-engine">Search Engine</Label>
            <Select value={searchEngine} onValueChange={setSearchEngine}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Search Engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="yahoo">Yahoo</SelectItem>
                <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Selector */}
        {config?.options?.hasLocationSelect && (
          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="united_states">United States</SelectItem>
                <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Language Selector */}
        {config?.options?.hasLanguageSelect && (
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="portuguese">Portuguese</SelectItem>
                <SelectItem value="russian">Russian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Analyzing..." : getButtonText()}
        </Button>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
      </div>
    </form>
  );

  const getButtonText = () => {
    switch (toolType) {
      case "keyword-position":
        return "Check Positions";
      case "keyword-density-checker":
        return "Analyze Density";
      case "keywords-suggestions-tool":
      case "related-keywords-finder":
      case "long-tail-keyword-suggestion-tool":
        return "Generate Suggestions";
      case "keyword-research-tool":
        return "Research Keywords";
      case "keyword-competition-tool":
      case "seo-keyword-competition-analysis":
        return "Analyze Competition";
      case "keyword-difficulty-checker":
        return "Check Difficulty";
      case "live-keyword-analyzer":
        return "Start Analyzing";
      case "keyword-overview-tool":
        return "Get Overview";
      case "keywords-rich-domains-suggestions-tool":
        return "Find Domains";
      case "paid-keyword-finder":
        return "Find Paid Keywords";
      default:
        return "Analyze Keywords";
    }
  };

  const renderResults = () => {
    if (!results) return null;

    switch (toolType) {
      case "keyword-position":
        return renderPositionResults();
      case "keyword-density-checker":
        return renderDensityResults();
      case "keywords-suggestions-tool":
      case "related-keywords-finder":
      case "long-tail-keyword-suggestion-tool":
        return renderSuggestionResults();
      case "keyword-research-tool":
      case "keyword-overview-tool":
        return renderResearchResults();
      case "keyword-competition-tool":
      case "seo-keyword-competition-analysis":
      case "keyword-difficulty-checker":
        return renderCompetitionResults();
      case "live-keyword-analyzer":
        return renderLiveAnalyzerResults();
      case "keywords-rich-domains-suggestions-tool":
        return renderDomainSuggestions();
      case "paid-keyword-finder":
        return renderPaidKeywordResults();
      default:
        return (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p>Analysis complete. Check the console for detailed results.</p>
          </div>
        );
    }
  };

  const renderPositionResults = () => (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Keyword Rankings for {results.url}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Google</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bing</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yahoo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.keywords.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.google > 100 ? "100+" : item.google}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.bing > 100 ? "100+" : item.bing}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.yahoo > 100 ? "100+" : item.yahoo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.change > 0 ? 'bg-green-100 text-green-800' : item.change < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.change > 0 ? '+' : ''}{item.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDensityResults = () => (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Content Analysis Results
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Total word count: {results.wordCount}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Density</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.keywordDensity.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.density}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.isOptimal ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Optimal</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Needs Improvement</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Top Words Used
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {results.topWords.map((item, index) => (
              <div key={index} className="px-3 py-2 bg-gray-100 rounded-full text-sm">
                {item.word} <span className="font-medium">({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuggestionResults = () => (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Keyword Suggestions for: <span className="font-bold">{results.baseKeyword}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.suggestions.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${item.difficulty < 33 ? 'bg-green-500' : item.difficulty < 66 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${item.difficulty}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs">{item.difficulty}/100</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {results.questions && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Questions People Ask
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {results.questions.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.question}</span>
                  <Badge className="bg-blue-100 text-blue-800">{item.volume} searches/mo</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderResearchResults = () => (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Keyword Research Results
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.keywords.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${item.difficulty < 33 ? 'bg-green-500' : item.difficulty < 66 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.difficulty}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{item.difficulty}/100</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.cpc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge className={`
                    ${item.intent === 'informational' ? 'bg-blue-100 text-blue-800' : 
                      item.intent === 'commercial' ? 'bg-purple-100 text-purple-800' : 
                      'bg-green-100 text-green-800'}
                  `}>
                    {item.intent}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="h-6 flex items-end space-x-1">
                    {item.trends.map((value, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 bg-blue-${Math.max(300, Math.min(700, 300 + Math.floor(value / 10) * 50))}`} 
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompetitionResults = () => (
    <div className="mt-6 space-y-6">
      {results.keywords.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {item.keyword}
              </h3>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Difficulty:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${item.difficulty < 33 ? 'bg-green-500' : item.difficulty < 66 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${item.difficulty}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium">{item.difficulty}/100</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Top Ranking Competitors</h4>
            <div className="space-y-4">
              {item.topCompetitors.map((competitor, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-32 flex-shrink-0">
                    <span className="text-sm font-medium">{competitor.domain}</span>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center mb-1">
                      <span className="text-xs text-gray-500 w-28">Domain Authority:</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-blue-600"
                          style={{ width: `${competitor.authority}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs">{competitor.authority}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 w-28">Backlinks:</span>
                      <span className="text-xs">{competitor.backlinks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Average Word Count</p>
                <p className="text-lg font-medium mt-2">{item.avgWordCount.toLocaleString()} words</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Average Backlinks</p>
                <p className="text-lg font-medium mt-2">{item.avgBacklinks.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-blue-700">
                  Estimated time to rank: <span className="font-medium">{item.timeToRank}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLiveAnalyzerResults = () => (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Live Analysis for {results.url}
            </h3>
            <span className="text-sm text-gray-500">Last updated: {results.timestamp}</span>
          </div>
        </div>
      </div>

      {results.keywords.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">
                {item.keyword}
              </h4>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Current Position:</span>
                <Badge className={`
                  ${item.currentPosition <= 3 ? 'bg-green-100 text-green-800' : 
                    item.currentPosition <= 10 ? 'bg-blue-100 text-blue-800' : 
                    item.currentPosition <= 30 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}
                `}>
                  {item.currentPosition}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">24-Hour Ranking Changes</h5>
            <div className="h-16 flex items-end space-x-1">
              {item.hourlyChanges.map((change, i) => (
                <div 
                  key={i} 
                  className={`w-3 ${change > 0 ? 'bg-green-500' : change < 0 ? 'bg-red-500' : 'bg-gray-300'}`}
                  style={{ 
                    height: `${Math.abs(change) * 20 + 5}%`,
                    marginTop: change > 0 ? 'auto' : '0' 
                  }}
                  title={`Hour ${i+1}: ${change > 0 ? '+' : ''}${change}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>Now</span>
            </div>
            
            <div className="mt-8">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Competitor Movements</h5>
              <div className="space-y-2">
                {item.competitorMovements.map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{comp.domain}</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Rank: {comp.position}</span>
                      <span className={`text-xs ${comp.change > 0 ? 'text-green-600' : comp.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {comp.change > 0 ? '▲' : comp.change < 0 ? '▼' : '■'} 
                        {comp.change !== 0 && Math.abs(comp.change)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDomainSuggestions = () => (
    <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Domain Suggestions for: <span className="font-bold">{results.keyword}</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.availableDomains.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.domain}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.available ? (
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Taken</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.available ? item.price : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaidKeywordResults = () => (
    <div className="mt-6 space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Paid Keyword Analysis Results
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. ROI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.keywords.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.searchVolume.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.cpc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            parseFloat(item.competition) < 0.33 ? 'bg-green-500' : 
                            parseFloat(item.competition) < 0.66 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${parseFloat(item.competition) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs">{parseFloat(item.competition).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge className={`
                      ${
                        parseFloat(item.potentialROI) > 200 ? 'bg-green-100 text-green-800' : 
                        parseFloat(item.potentialROI) > 100 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }
                    `}>
                      {item.potentialROI}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {results.negativeKeywords && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Suggested Negative Keywords
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {results.negativeKeywords.map((keyword, index) => (
                <Badge key={index} className="bg-red-50 text-red-700 px-3 py-1.5">
                  -{keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const toolInterface = (
    <div className="rounded-lg border p-6 shadow-sm">
      {renderForm()}
      {renderResults()}
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug={toolType}
      toolContent={
        <ToolContentTemplate
          introduction={config?.introduction || "Analyze your keywords for better SEO performance."}
          description={config?.description || "This tool helps you analyze and optimize your keywords for better search engine rankings."}
          howToUse={config?.howToUse || [
            "Enter your keywords in the input field",
            "Configure any additional options if needed",
            "Click the analyze button to process your keywords",
            "Review the detailed results and insights"
          ]}
          features={config?.features || [
            "✅ Comprehensive keyword analysis",
            "✅ Detailed metrics and insights",
            "✅ User-friendly interface",
            "✅ Actionable recommendations",
            "✅ Save and export results"
          ]}
          faqs={config?.faqs || [
            {
              question: "What is keyword analysis?",
              answer: "Keyword analysis is the process of researching and evaluating search terms that people use in search engines. It helps identify valuable keywords for your content strategy."
            },
            {
              question: "How can keyword analysis improve my SEO?",
              answer: "Keyword analysis helps you understand what terms your target audience is searching for, allowing you to optimize your content accordingly and improve your search rankings."
            },
            {
              question: "How often should I perform keyword analysis?",
              answer: "It's recommended to perform keyword analysis at least quarterly to stay updated with changing search trends and user behavior."
            },
            {
              question: "What makes a good keyword?",
              answer: "Good keywords have a balance of search volume, relevance to your content, and reasonable competition. Long-tail keywords (3+ words) often provide better targeting opportunities."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default KeywordToolsDetailed;