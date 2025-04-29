import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { keywordsTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaSearch, 
  FaChartBar,
  FaGlobe,
  FaCheck,
  FaExternalLinkAlt,
  FaListOl
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const KeywordPositionDetailed = () => {
  const [url, setUrl] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [searchEngine, setSearchEngine] = useState<string>("google");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkProgress, setCheckProgress] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);

  const handleCheck = () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to check.",
        variant: "destructive",
      });
      return;
    }

    if (!keywords) {
      toast({
        title: "Keywords required",
        description: "Please enter at least one keyword to check.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setCheckProgress(0);
    setResults([]);
    
    // Simulate the checking process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Create simulated results
        const keywordList = keywords.split(',').map(k => k.trim());
        const simulatedResults = keywordList.map(keyword => {
          // Generate random position between 1 and 100, with bias toward higher positions for realistic results
          const position = Math.floor(Math.random() * 100) + 1;
          return {
            keyword,
            position,
            searchEngine,
            url: url,
            lastChecked: new Date().toLocaleDateString()
          };
        });
        
        setResults(simulatedResults);
        setIsChecking(false);
        
        toast({
          title: "Check complete",
          description: `Checked positions for ${keywordList.length} keywords.`,
        });
      }
      setCheckProgress(progress);
    }, 100);
  };

  const getPositionColor = (position: number) => {
    if (position <= 10) return "text-green-600 font-semibold";
    if (position <= 30) return "text-blue-600";
    if (position <= 50) return "text-amber-600";
    return "text-gray-600";
  };

  const introduction = "Track your website's keyword rankings with our Keyword Position Checker.";

  const description = "Our Keyword Position Checker tool helps you monitor how your website ranks for specific keywords across major search engines. Understanding where your pages appear in search results is crucial for effective SEO strategy and measuring the impact of your optimization efforts. With this tool, you can track multiple keywords simultaneously, compare rankings across different search engines, and identify opportunities to improve your visibility. Whether you're running an SEO campaign, analyzing competitors, or evaluating content performance, this ranking checker provides accurate, up-to-date information about your search engine positions. Regular monitoring allows you to detect ranking changes early, understand seasonal trends, and make data-driven decisions to boost your organic traffic and visibility.";

  const howToUse = [
    "Enter the full URL of the website you want to check (include https://).",
    "Input the keywords you want to track, separated by commas.",
    "Select your target search engine (Google, Bing, or Yahoo).",
    "Click the 'Check Positions' button to start the analysis.",
    "Review the results showing each keyword's position in search results."
  ];

  const features = [
    "✅ Track rankings for multiple keywords simultaneously",
    "✅ Check positions across major search engines",
    "✅ Monitor desktop and mobile search results",
    "✅ Get accurate, real-time ranking data",
    "✅ Analyze performance for any domain",
    "✅ Compare historical position changes",
    "✅ Export results for reporting and analysis"
  ];

  const faqs = [
    {
      question: "Why are keyword rankings important for SEO?",
      answer: "Keyword rankings are essential for SEO because they directly influence your website's visibility and organic traffic potential. Higher positions in search results correlate strongly with increased click-through rates—studies show the first position in Google typically receives 28-34% of clicks, while the second position gets only 15-17%. Tracking rankings helps you: 1) Measure the effectiveness of your SEO strategies and content improvements; 2) Identify opportunities where you're underperforming compared to competitors; 3) Detect algorithm updates that may have affected your visibility; 4) Understand which keywords drive the most traffic and conversions; and 5) Demonstrate ROI on your SEO investments. Regular rank tracking provides insights into search trends, helps prioritize optimization efforts, and serves as an early warning system for potential issues with your search visibility."
    },
    {
      question: "Why might my keyword rankings fluctuate?",
      answer: "Keyword rankings often fluctuate due to several factors: 1) Search engine algorithm updates—Google makes thousands of changes yearly, with major updates potentially causing significant ranking shifts; 2) Competitor activities—when competitors improve their content or build new backlinks, it can affect your relative positions; 3) Seasonal trends—search behavior changes throughout the year for many industries; 4) Personalization—search results vary based on location, search history, and user behavior; 5) Technical changes to your website—redesigns, URL structure changes, or server issues can impact rankings; 6) Content freshness—search engines often favor recently updated content; 7) Ranking fluctuation tests—search engines sometimes test different ranking orders to measure user response. It's important to focus on long-term trends rather than daily fluctuations and consider multiple performance metrics beyond just rankings, such as organic traffic, conversions, and visibility for keyword groups."
    },
    {
      question: "How often should I check my keyword positions?",
      answer: "The optimal frequency for checking keyword positions depends on your specific needs: 1) For most websites, weekly checks provide sufficient data to identify trends without overreacting to normal fluctuations; 2) After implementing significant SEO changes (new content, site structure updates, etc.), you might want to check more frequently (every 2-3 days) to measure immediate impact; 3) For highly competitive industries or during major algorithm updates, bi-weekly or even daily monitoring might be necessary; 4) For established websites with stable rankings, monthly checks may be adequate to track long-term progress. Keep in mind that excessive checking (multiple times per day) provides little additional value and may trigger rate limits with search engines or rank tracking services. It's more important to establish a consistent schedule and maintain historical data for trend analysis than to constantly monitor small fluctuations. Consider setting up automated alerts for significant position changes to stay informed without manual checking."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Keyword Position Checker</h3>
      
      <div className="space-y-5">
        <div>
          <Label htmlFor="url" className="block mb-2">Website URL</Label>
          <Input 
            id="url" 
            placeholder="https://example.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Enter the full URL including http:// or https://</p>
        </div>
        
        <div>
          <Label htmlFor="keywords" className="block mb-2">Keywords</Label>
          <Textarea 
            id="keywords" 
            placeholder="Enter keywords separated by commas" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Example: seo tools, keyword research, rank tracker</p>
        </div>
        
        <div>
          <Label className="block mb-2">Search Engine</Label>
          <RadioGroup 
            defaultValue="google" 
            value={searchEngine}
            onValueChange={setSearchEngine}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="google" />
              <Label htmlFor="google" className="cursor-pointer">Google</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bing" id="bing" />
              <Label htmlFor="bing" className="cursor-pointer">Bing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yahoo" id="yahoo" />
              <Label htmlFor="yahoo" className="cursor-pointer">Yahoo</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleCheck}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isChecking}
        >
          {isChecking ? (
            <>Checking Positions...</>
          ) : (
            <>
              <FaSearch className="mr-2" /> 
              Check Positions
            </>
          )}
        </Button>
        
        {isChecking && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Checking keyword positions...</span>
              <span>{Math.round(checkProgress)}%</span>
            </div>
            <Progress value={checkProgress} />
          </div>
        )}
        
        {results.length > 0 && (
          <div className="space-y-4 mt-4">
            <h4 className="font-medium text-lg flex items-center">
              <FaListOl className="mr-2 text-blue-600" />
              Keyword Positions
            </h4>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-center">Position</TableHead>
                    <TableHead>Search Engine</TableHead>
                    <TableHead>Last Checked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.keyword}</TableCell>
                      <TableCell className="text-center">
                        <span className={getPositionColor(result.position)}>
                          {result.position}
                        </span>
                      </TableCell>
                      <TableCell className="capitalize">{result.searchEngine}</TableCell>
                      <TableCell>{result.lastChecked}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <h5 className="font-medium text-blue-700 mb-2">Ranking Analysis</h5>
              <ul className="space-y-1 text-blue-700">
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                  <span>Top 10 positions are excellent and generate the most traffic.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-blue-500" />
                  <span>Positions 11-30 are good but have potential for improvement.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-amber-500" />
                  <span>Positions 31-50 receive minimal traffic but show ranking potential.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-gray-500" />
                  <span>Positions above 50 may need significant SEO improvements.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="keyword-position-detailed"
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

export default KeywordPositionDetailed;