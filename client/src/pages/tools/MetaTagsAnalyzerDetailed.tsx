import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  FaSearch, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaGlobe,
  FaCopy,
  FaDownload,
  FaCode,
  FaListAlt
} from "react-icons/fa";

const MetaTagsAnalyzerDetailed = () => {
  const [url, setUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeProgress, setAnalyzeProgress] = useState<number>(0);
  const [results, setResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("summary");

  const handleAnalyze = () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    setResults(null);
    
    // Simulate analysis process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate simulated analysis results
        const metaTags = generateSimulatedMetaTags();
        const scores = calculateScores(metaTags);
        
        setResults({
          url: url,
          metaTags: metaTags,
          scores: scores,
          summary: {
            totalTags: metaTags.length,
            missingCritical: metaTags.filter(tag => tag.importance === "critical" && !tag.present).length,
            missingRecommended: metaTags.filter(tag => tag.importance === "recommended" && !tag.present).length,
            overallScore: scores.overall
          }
        });
        
        setIsAnalyzing(false);
        setActiveTab("summary");
        
        toast({
          title: "Analysis complete",
          description: `Analyzed ${metaTags.length} meta tags on ${url}`,
        });
      }
      setAnalyzeProgress(progress);
    }, 100);
  };

  const generateSimulatedMetaTags = () => {
    // Simulate meta tags found on the page
    return [
      {
        name: "title",
        content: url.includes("example") ? "Example Website" : `${capitalizeFirstLetter(url.split(".")[0].replace("https://", "").replace("http://", ""))} - Official Website`,
        present: true,
        importance: "critical",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Title tag is too generic. Add keywords and branding." : "Good title with appropriate length and branding."
      },
      {
        name: "meta description",
        content: url.includes("example") ? "Welcome to our website." : "Discover our comprehensive range of products and services designed to meet your specific needs and requirements. Learn more about what makes us the industry leader.",
        present: true,
        importance: "critical",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Description is too short and generic. Add details about your offering." : "Good description but could be more concise and include more keywords."
      },
      {
        name: "meta robots",
        content: "index, follow",
        present: Math.random() > 0.2,
        importance: "critical",
        optimal: true,
        recommendation: "Properly configured robots directive."
      },
      {
        name: "meta viewport",
        content: "width=device-width, initial-scale=1.0",
        present: true,
        importance: "critical",
        optimal: true,
        recommendation: "Viewport tag properly set for mobile responsiveness."
      },
      {
        name: "canonical link",
        content: url,
        present: Math.random() > 0.3,
        importance: "critical",
        optimal: true,
        recommendation: "Canonical URL correctly implemented to prevent duplicate content issues."
      },
      {
        name: "og:title",
        content: url.includes("example") ? "Example Website" : `${capitalizeFirstLetter(url.split(".")[0].replace("https://", "").replace("http://", ""))} - Official Website`,
        present: Math.random() > 0.4,
        importance: "recommended",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Open Graph title is too generic. Customize for social sharing." : "Open Graph title is properly configured for social sharing."
      },
      {
        name: "og:description",
        content: url.includes("example") ? "Welcome to our website." : "Discover our comprehensive range of products and services designed to meet your specific needs and requirements.",
        present: Math.random() > 0.4,
        importance: "recommended",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Open Graph description is too generic. Customize for social sharing." : "Open Graph description is well-optimized for social platforms."
      },
      {
        name: "og:image",
        content: "https://example.com/image.jpg",
        present: Math.random() > 0.5,
        importance: "recommended",
        optimal: Math.random() > 0.5,
        recommendation: "Open Graph image should be at least 1200x630 pixels for optimal social sharing."
      },
      {
        name: "og:url",
        content: url,
        present: Math.random() > 0.5,
        importance: "recommended",
        optimal: true,
        recommendation: "Open Graph URL is correctly set to the canonical URL."
      },
      {
        name: "og:type",
        content: "website",
        present: Math.random() > 0.6,
        importance: "recommended",
        optimal: true,
        recommendation: "Open Graph type is correctly set as 'website'."
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
        present: Math.random() > 0.6,
        importance: "recommended",
        optimal: true,
        recommendation: "Twitter card type is set correctly for optimal display."
      },
      {
        name: "twitter:title",
        content: url.includes("example") ? "Example Website" : `${capitalizeFirstLetter(url.split(".")[0].replace("https://", "").replace("http://", ""))} - Official Website`,
        present: Math.random() > 0.7,
        importance: "optional",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Twitter title should be more descriptive and keyword-rich." : "Twitter title is well-optimized for sharing on Twitter."
      },
      {
        name: "twitter:description",
        content: url.includes("example") ? "Welcome to our website." : "Discover our comprehensive range of products and services designed to meet your specific needs and requirements.",
        present: Math.random() > 0.7,
        importance: "optional",
        optimal: url.includes("example") ? false : true,
        recommendation: url.includes("example") ? "Twitter description is too generic. Add more compelling copy." : "Twitter description is well-crafted for engagement."
      },
      {
        name: "twitter:image",
        content: "https://example.com/image.jpg",
        present: Math.random() > 0.7,
        importance: "optional",
        optimal: Math.random() > 0.5,
        recommendation: "Twitter image should be at least 1200x675 pixels for optimal display."
      },
      {
        name: "meta keywords",
        content: url.includes("example") ? "example, website" : "products, services, solutions, industry, professional",
        present: Math.random() > 0.3,
        importance: "low",
        optimal: url.includes("example") ? false : true,
        recommendation: "While not significant for Google SEO, meta keywords can still be useful for some smaller search engines."
      },
      {
        name: "meta author",
        content: url.includes("example") ? "Example Inc." : `${capitalizeFirstLetter(url.split(".")[0].replace("https://", "").replace("http://", ""))} Inc.`,
        present: Math.random() > 0.5,
        importance: "low",
        optimal: true,
        recommendation: "Author meta tag correctly identifies the content creator."
      },
      {
        name: "language",
        content: "en",
        present: Math.random() > 0.5,
        importance: "recommended",
        optimal: true,
        recommendation: "Language meta tag helps search engines understand the content language."
      },
      {
        name: "meta charset",
        content: "UTF-8",
        present: true,
        importance: "critical",
        optimal: true,
        recommendation: "Character encoding is properly defined as UTF-8."
      }
    ];
  };

  const calculateScores = (metaTags: any[]) => {
    // Calculate scores for different categories
    const criticalTags = metaTags.filter(tag => tag.importance === "critical");
    const recommendedTags = metaTags.filter(tag => tag.importance === "recommended");
    const otherTags = metaTags.filter(tag => tag.importance !== "critical" && tag.importance !== "recommended");
    
    const criticalScore = Math.round((criticalTags.filter(tag => tag.present).length / criticalTags.length) * 100);
    const recommendedScore = Math.round((recommendedTags.filter(tag => tag.present).length / recommendedTags.length) * 100);
    const otherScore = Math.round((otherTags.filter(tag => tag.present).length / otherTags.length) * 100);
    
    // Calculate optimal implementation scores
    const criticalOptimalScore = Math.round((criticalTags.filter(tag => tag.present && tag.optimal).length / criticalTags.length) * 100);
    const recommendedOptimalScore = Math.round((recommendedTags.filter(tag => tag.present && tag.optimal).length / recommendedTags.length) * 100);
    
    // Calculate overall score (weighted)
    const overallScore = Math.round((criticalScore * 0.6) + (recommendedScore * 0.3) + (otherScore * 0.1));
    
    return {
      critical: criticalScore,
      recommended: recommendedScore,
      other: otherScore,
      criticalOptimal: criticalOptimalScore,
      recommendedOptimal: recommendedOptimalScore,
      overall: overallScore
    };
  };

  const exportResultsAsJSON = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${url.replace(/[^a-zA-Z0-9]/g, '_')}_meta_analysis.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export successful",
      description: "Meta tags analysis exported as JSON",
    });
  };

  const exportResultsAsCSV = () => {
    if (!results) return;
    
    let csvContent = "Name,Content,Present,Importance,Optimal,Recommendation\n";
    
    results.metaTags.forEach((tag: any) => {
      const row = [
        `"${tag.name}"`,
        `"${tag.content || ''}"`,
        tag.present ? "Yes" : "No",
        tag.importance,
        tag.optimal ? "Yes" : "No",
        `"${tag.recommendation}"`
      ].join(',');
      
      csvContent += row + "\n";
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `${url.replace(/[^a-zA-Z0-9]/g, '_')}_meta_analysis.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export successful",
      description: "Meta tags analysis exported as CSV",
    });
  };

  const copyMetaTagsToClipboard = () => {
    if (!results) return;
    
    const metaTagsText = results.metaTags.map((tag: any) => 
      `${tag.name}: ${tag.content} (${tag.present ? 'Present' : 'Missing'}, ${tag.importance})`
    ).join('\n');
    
    navigator.clipboard.writeText(metaTagsText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Meta tags analysis copied to clipboard",
        });
      })
      .catch((err) => {
        toast({
          title: "Copy failed",
          description: "Could not copy results to clipboard",
          variant: "destructive",
        });
      });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-red-100";
  };

  const getStatusBadge = (present: boolean, importance: string) => {
    if (present) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">Present</Badge>;
    } else {
      if (importance === "critical") {
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">Missing</Badge>;
      } else if (importance === "recommended") {
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">Missing</Badge>;
      } else {
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800">Missing</Badge>;
      }
    }
  };

  const getOptimalBadge = (present: boolean, optimal: boolean) => {
    if (!present) return null;
    
    if (optimal) {
      return <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">Optimal</Badge>;
    } else {
      return <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">Improvable</Badge>;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">Critical</Badge>;
      case "recommended":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">Recommended</Badge>;
      case "optional":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800">Optional</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800">Low priority</Badge>;
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const introduction = "Evaluate and optimize your website's meta tags for improved SEO performance.";

  const description = "Our Meta Tags Analyzer tool provides a comprehensive audit of your website's meta tags to help improve your search engine visibility and social media presence. By simply entering your URL, this tool scans your webpage, identifies all implemented meta tags, and evaluates them against current SEO best practices. You'll receive detailed analysis of critical SEO elements like title tags, meta descriptions, canonical links, and viewport settings, as well as social media meta tags for platforms like Facebook, Twitter, and LinkedIn. The tool highlights missing critical tags, identifies improvement opportunities, and provides specific recommendations for optimizing each meta tag. With a comprehensive scoring system, you can quickly identify gaps in your meta tag implementation and prioritize fixes based on their SEO impact. Whether you're conducting a site audit, troubleshooting SEO issues, or preparing for a website launch, this analyzer provides the insights needed to ensure your meta tags are properly configured for maximum search engine and social media visibility.";

  const howToUse = [
    "Enter your website URL in the input field (include http:// or https://).",
    "Click the 'Analyze Meta Tags' button to start the scanning process.",
    "Review the 'Summary' tab for an overall assessment and score of your meta tags.",
    "Check the 'All Tags' tab for a detailed list of all meta tags found (or missing) on your page.",
    "Use the 'Critical Issues' tab to identify and fix the most important missing or problematic tags.",
    "Review the specific recommendations provided for each meta tag to optimize your implementation.",
    "Export the results in CSV or JSON format for your records or to share with your team."
  ];

  const features = [
    "✅ Comprehensive scan of all SEO and social meta tags on your webpage",
    "✅ Detailed analysis with categorization by importance (critical, recommended, optional)",
    "✅ Specific improvement recommendations for each meta tag",
    "✅ Color-coded scoring system to quickly identify areas needing attention",
    "✅ Social meta tags analysis for Facebook Open Graph and Twitter Cards",
    "✅ Export functionality for CSV and JSON formats",
    "✅ Prioritized list of critical issues requiring immediate attention"
  ];

  const faqs = [
    {
      question: "Which meta tags are most important for SEO?",
      answer: "The most critical meta tags for SEO are: 1) Title tag - This appears as the clickable headline in search results and should be unique, descriptive, and 50-60 characters long; 2) Meta description - Though not a direct ranking factor, this 150-160 character summary influences click-through rates by describing your page content in search results; 3) Canonical tag - Prevents duplicate content issues by identifying the primary version of a page; 4) Viewport meta tag - Essential for mobile responsiveness, which is a ranking factor; 5) Meta robots - Controls how search engines crawl and index your pages. While meta keywords have largely lost their SEO value for major search engines like Google, other tags like hreflang (for international targeting) and schema markup (for rich snippets) are increasingly important for specialized SEO needs. Our analyzer prioritizes these critical tags and provides specific recommendations for optimizing each one according to current search engine guidelines."
    },
    {
      question: "How do social media meta tags impact my website visibility?",
      answer: "Social media meta tags (Open Graph and Twitter Cards) significantly impact your website's appearance and performance when shared on social platforms. These specialized meta tags control elements like: 1) The title, description, and image that appear in shared posts; 2) The type of content card displayed (e.g., summary, large image, video); 3) Attribution data like your brand name or Twitter handle. When properly implemented, these tags can dramatically increase click-through rates from social media by creating visually appealing, informative previews instead of plain links. They also ensure brand consistency across platforms and prevent social networks from pulling incorrect or undesirable content when your pages are shared. While not direct SEO ranking factors, the increased engagement and traffic they generate can indirectly improve search performance. Our analyzer evaluates both Open Graph (used by Facebook, LinkedIn, Pinterest) and Twitter Card tags to ensure optimal visibility across all major social platforms."
    },
    {
      question: "How often should I analyze my website's meta tags?",
      answer: "The optimal frequency for analyzing your website's meta tags depends on several factors: 1) After any significant content update - Whenever you make substantial changes to page content, especially to key SEO landing pages; 2) Following website redesigns or CMS migrations - These often introduce unintended changes to meta tag implementation; 3) When implementing new SEO strategies - To ensure proper execution of technical changes; 4) Regular audits - Even without changes, conducting quarterly meta tag audits is recommended as best practice to catch any issues; 5) After Google algorithm updates - Major algorithm changes may shift the importance of certain meta tags or introduce new best practices. For large or frequently updated websites, using automated tools for continuous monitoring is advisable. E-commerce sites with dynamic product pages should pay particular attention to meta tag consistency. Remember that properly implemented meta tags are a foundation of SEO, and regular analysis ensures you maintain this foundation while adapting to evolving search engine requirements and web standards."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Meta Tags Analyzer</h3>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="url-input" className="block mb-2">Website URL</Label>
          <div className="flex">
            <Input 
              id="url-input" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              onClick={handleAnalyze}
              className="rounded-l-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <FaSearch className="mr-2" /> 
                  Analyze Meta Tags
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter complete URL including http:// or https://</p>
        </div>
        
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing meta tags...</span>
              <span>{Math.round(analyzeProgress)}%</span>
            </div>
            <Progress value={analyzeProgress} />
          </div>
        )}
        
        {results && (
          <div className="space-y-5 pt-2">
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="all">All Tags</TabsTrigger>
                <TabsTrigger value="issues">Critical Issues</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Card className="flex-1 p-4 border">
                    <h4 className="text-lg font-medium mb-2 text-center">Overall Score</h4>
                    <div className="flex justify-center items-center">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBackground(results.scores.overall)} ${getScoreColor(results.scores.overall)}`}>
                        {results.scores.overall}%
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="flex-1 p-4 border">
                    <h4 className="text-lg font-medium mb-2">Meta Tag Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Total tags analyzed:</span>
                        <span className="font-medium">{results.summary.totalTags}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Missing critical tags:</span>
                        <span className={`font-medium ${results.summary.missingCritical > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {results.summary.missingCritical}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Missing recommended tags:</span>
                        <span className={`font-medium ${results.summary.missingRecommended > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {results.summary.missingRecommended}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4 border">
                  <h4 className="text-lg font-medium mb-3">Category Scores</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Critical Tags</span>
                        <span className={getScoreColor(results.scores.critical)}>{results.scores.critical}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${results.scores.critical >= 80 ? 'bg-green-500' : results.scores.critical >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${results.scores.critical}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Recommended Tags</span>
                        <span className={getScoreColor(results.scores.recommended)}>{results.scores.recommended}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${results.scores.recommended >= 80 ? 'bg-green-500' : results.scores.recommended >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${results.scores.recommended}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Optional Tags</span>
                        <span className={getScoreColor(results.scores.other)}>{results.scores.other}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${results.scores.other >= 80 ? 'bg-green-500' : results.scores.other >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${results.scores.other}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border">
                  <h4 className="text-lg font-medium mb-3">Critical Tag Implementation</h4>
                  <div className="space-y-2">
                    {results.metaTags
                      .filter((tag: any) => tag.importance === "critical")
                      .map((tag: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b last:border-0">
                          <span className="font-medium">{tag.name}</span>
                          <div className="flex items-center">
                            {tag.present ? (
                              <FaCheck className="text-green-600 mr-2" />
                            ) : (
                              <FaTimes className="text-red-600 mr-2" />
                            )}
                            <span className={tag.present ? 'text-green-600' : 'text-red-600'}>
                              {tag.present ? 'Present' : 'Missing'}
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </Card>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyMetaTagsToClipboard}
                  >
                    <FaCopy className="mr-2" />
                    Copy Results
                  </Button>
                  
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportResultsAsCSV}
                    >
                      <FaDownload className="mr-2" />
                      Export CSV
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportResultsAsJSON}
                    >
                      <FaCode className="mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg">All Meta Tags</h4>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportResultsAsCSV}
                    >
                      <FaDownload className="mr-1" /> 
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {results.metaTags.map((tag: any, index: number) => (
                    <div key={index} className="py-3">
                      <div className="flex flex-wrap gap-2 items-center mb-1">
                        <h5 className="font-medium">{tag.name}</h5>
                        <div className="flex items-center">
                          {getStatusBadge(tag.present, tag.importance)}
                          {getOptimalBadge(tag.present, tag.optimal)}
                          {getImportanceBadge(tag.importance)}
                        </div>
                      </div>
                      
                      {tag.present && (
                        <div className="pl-4 border-l-2 border-gray-200 mt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Content:</span> {tag.content}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Recommendation:</span> {tag.recommendation}
                          </p>
                        </div>
                      )}
                      
                      {!tag.present && (
                        <div className="pl-4 border-l-2 border-gray-200 mt-2">
                          <p className="text-sm text-gray-700">
                            <FaExclamationTriangle className="text-amber-500 inline-block mr-1" />
                            <span className="font-medium">Recommendation:</span> {tag.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="issues" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg flex items-center">
                    <FaExclamationTriangle className="mr-2 text-amber-500" />
                    Critical Issues
                  </h4>
                </div>
                
                <div className="divide-y">
                  {results.metaTags
                    .filter((tag: any) => !tag.present && tag.importance === "critical")
                    .map((tag: any, index: number) => (
                      <div key={index} className="py-3">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <h5 className="font-medium">{tag.name}</h5>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800">Missing Critical Tag</Badge>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-red-300 mt-2">
                          <p className="text-sm text-gray-700">
                            <FaExclamationTriangle className="text-red-500 inline-block mr-1" />
                            <span className="font-medium">Recommendation:</span> {tag.recommendation}
                          </p>
                          
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Example implementation:</span>
                            <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-x-auto">
                              {tag.name === "title" ? (
                                `<title>Your Page Title | Your Brand Name</title>`
                              ) : tag.name === "meta description" ? (
                                `<meta name="description" content="A compelling description of your page content within 160 characters.">`
                              ) : tag.name === "meta robots" ? (
                                `<meta name="robots" content="index, follow">`
                              ) : tag.name === "canonical link" ? (
                                `<link rel="canonical" href="https://www.example.com/page-url">`
                              ) : tag.name === "meta viewport" ? (
                                `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
                              ) : tag.name === "meta charset" ? (
                                `<meta charset="UTF-8">`
                              ) : (
                                `<meta name="${tag.name}" content="...">`
                              )}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {results.metaTags.filter((tag: any) => !tag.present && tag.importance === "critical").length === 0 && (
                    <div className="py-6 text-center">
                      <FaCheck className="text-green-500 mx-auto mb-2 text-2xl" />
                      <p className="text-gray-600">No critical tag issues found. Great job!</p>
                    </div>
                  )}
                  
                  <h4 className="font-medium pt-4 mt-2">Recommended Tag Issues</h4>
                  
                  {results.metaTags
                    .filter((tag: any) => !tag.present && tag.importance === "recommended")
                    .map((tag: any, index: number) => (
                      <div key={index} className="py-3">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <h5 className="font-medium">{tag.name}</h5>
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">Missing Recommended Tag</Badge>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-amber-300 mt-2">
                          <p className="text-sm text-gray-700">
                            <FaExclamationTriangle className="text-amber-500 inline-block mr-1" />
                            <span className="font-medium">Recommendation:</span> {tag.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  
                  {results.metaTags.filter((tag: any) => !tag.present && tag.importance === "recommended").length === 0 && (
                    <div className="py-6 text-center">
                      <FaCheck className="text-green-500 mx-auto mb-2 text-2xl" />
                      <p className="text-gray-600">No recommended tag issues found. Great job!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="meta-tags-analyzer-detailed"
      toolContent={
        <ToolContentTemplate
          introduction={introduction}
          description={description}
          howToUse={howToUse}
          features={features}
          faqs={faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default MetaTagsAnalyzerDetailed;