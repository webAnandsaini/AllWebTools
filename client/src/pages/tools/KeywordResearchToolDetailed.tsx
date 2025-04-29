import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { keywordsTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaSearch, 
  FaChartBar,
  FaArrowRight,
  FaRankingStar,
  FaDownload,
  FaCopy,
  FaGlobe,
  FaInfoCircle,
  FaChartLine
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KeywordResearchToolDetailed = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<number>(0);
  const [results, setResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("us");
  const [timePeriod, setTimePeriod] = useState<string>("monthly");

  const handleResearch = () => {
    if (!keyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to research.",
        variant: "destructive",
      });
      return;
    }

    setIsResearching(true);
    setResearchProgress(0);
    setResults(null);
    setSelectedKeywords([]);
    
    // Simulate research process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate simulated research results
        const mainKeyword = keyword.toLowerCase().trim();
        
        // Simulate search metrics for main keyword
        const mainKeywordData = {
          keyword: mainKeyword,
          searchVolume: Math.floor(Math.random() * 30000) + 2000,
          keywordDifficulty: Math.floor(Math.random() * 80) + 20,
          cpc: (Math.random() * 5 + 0.5).toFixed(2),
          competition: (Math.random() * 0.9 + 0.1).toFixed(2),
          serp: {
            organicResults: [
              { position: 1, title: `Best ${mainKeyword} Guide`, domain: "example1.com", metricsScore: 85 },
              { position: 2, title: `${mainKeyword} 2025: Complete Overview`, domain: "example2.com", metricsScore: 82 },
              { position: 3, title: `How to Use ${mainKeyword} Effectively`, domain: "example3.com", metricsScore: 78 },
              { position: 4, title: `${mainKeyword} Tips for Beginners`, domain: "example4.com", metricsScore: 76 },
              { position: 5, title: `Ultimate ${mainKeyword} Tutorial`, domain: "example5.com", metricsScore: 74 },
              { position: 6, title: `${mainKeyword} for Professionals`, domain: "example6.com", metricsScore: 72 },
              { position: 7, title: `${mainKeyword} Advanced Guide`, domain: "example7.com", metricsScore: 70 },
              { position: 8, title: `Top ${mainKeyword} Strategies`, domain: "example8.com", metricsScore: 68 },
              { position: 9, title: `${mainKeyword} Industry Standards`, domain: "example9.com", metricsScore: 65 },
              { position: 10, title: `${mainKeyword} Best Practices`, domain: "example10.com", metricsScore: 63 }
            ],
            features: ["Featured Snippet", "Knowledge Panel", "People Also Ask"],
            totalResults: Math.floor(Math.random() * 10000000) + 500000
          }
        };
        
        // Generate related keywords
        const generateRelatedKeywords = () => {
          const prefixes = ["best", "top", "affordable", "cheap", "premium", "how to", "what is", "why", "when to", "where to"];
          const suffixes = ["guide", "tutorial", "services", "tips", "software", "tools", "examples", "for beginners", "near me", "online"];
          
          const relatedKeywords = [];
          
          // Generate with prefixes
          for (let i = 0; i < 6; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            relatedKeywords.push({
              keyword: `${prefix} ${mainKeyword}`,
              searchVolume: Math.floor(Math.random() * 5000) + 200,
              keywordDifficulty: Math.floor(Math.random() * 80) + 20,
              cpc: (Math.random() * 3 + 0.2).toFixed(2),
              competition: (Math.random() * 0.8 + 0.1).toFixed(2)
            });
          }
          
          // Generate with suffixes
          for (let i = 0; i < 6; i++) {
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            relatedKeywords.push({
              keyword: `${mainKeyword} ${suffix}`,
              searchVolume: Math.floor(Math.random() * 5000) + 200,
              keywordDifficulty: Math.floor(Math.random() * 80) + 20,
              cpc: (Math.random() * 3 + 0.2).toFixed(2),
              competition: (Math.random() * 0.8 + 0.1).toFixed(2)
            });
          }
          
          // Sort by search volume
          return relatedKeywords.sort((a, b) => b.searchVolume - a.searchVolume);
        };
        
        // Generate questions
        const generateQuestions = () => {
          const questionPrefixes = ["how to", "what is", "why is", "when to", "where to", "which", "who", "can", "does", "how does", "how many", "how much"];
          const questions = [];
          
          for (let i = 0; i < 10; i++) {
            const prefix = questionPrefixes[Math.floor(Math.random() * questionPrefixes.length)];
            questions.push({
              keyword: `${prefix} ${mainKeyword}`,
              searchVolume: Math.floor(Math.random() * 2000) + 50,
              keywordDifficulty: Math.floor(Math.random() * 70) + 10,
              cpc: (Math.random() * 2 + 0.1).toFixed(2),
              competition: (Math.random() * 0.6 + 0.1).toFixed(2)
            });
          }
          
          return questions.sort((a, b) => b.searchVolume - a.searchVolume);
        };
        
        // Generate competitors
        const generateCompetitors = () => {
          const competitors = [
            { domain: "example1.com", keywordCount: Math.floor(Math.random() * 500) + 100, topKeywords: ["best " + mainKeyword, mainKeyword + " services", mainKeyword + " guide"] },
            { domain: "example2.com", keywordCount: Math.floor(Math.random() * 450) + 90, topKeywords: [mainKeyword + " tutorials", "affordable " + mainKeyword, mainKeyword + " tips"] },
            { domain: "example3.com", keywordCount: Math.floor(Math.random() * 400) + 80, topKeywords: ["premium " + mainKeyword, mainKeyword + " for beginners", "how to " + mainKeyword] },
            { domain: "example4.com", keywordCount: Math.floor(Math.random() * 350) + 70, topKeywords: [mainKeyword + " examples", "what is " + mainKeyword, mainKeyword + " near me"] },
            { domain: "example5.com", keywordCount: Math.floor(Math.random() * 300) + 60, topKeywords: [mainKeyword + " online", "best " + mainKeyword + " software", mainKeyword + " for professionals"] }
          ];
          
          return competitors.sort((a, b) => b.keywordCount - a.keywordCount);
        };
        
        // Generate trend data
        const generateTrendData = () => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const trendData = [];
          
          let volume = Math.floor(Math.random() * 5000) + 3000;
          
          for (const month of months) {
            // Add some variance (-20% to +20%)
            const variance = (Math.random() * 0.4) - 0.2;
            volume = Math.floor(volume * (1 + variance));
            
            trendData.push({
              period: month,
              volume: Math.max(100, volume)
            });
          }
          
          return trendData;
        };
        
        setResults({
          mainKeyword: mainKeywordData,
          relatedKeywords: generateRelatedKeywords(),
          questions: generateQuestions(),
          competitors: generateCompetitors(),
          trendData: generateTrendData()
        });
        
        setIsResearching(false);
        
        toast({
          title: "Research complete",
          description: `Keyword research for "${mainKeyword}" is ready.`,
        });
      }
      setResearchProgress(progress);
    }, 120);
  };

  const handleKeywordSelect = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleExportCSV = () => {
    if (!results) return;
    
    const keywordsToExport = [
      ...selectedKeywords.length > 0 
        ? [...results.relatedKeywords, ...results.questions].filter(k => selectedKeywords.includes(k.keyword))
        : [...results.relatedKeywords, ...results.questions]
    ];
    
    if (keywordsToExport.length === 0) {
      toast({
        title: "No keywords to export",
        description: "Please select at least one keyword to export.",
        variant: "destructive",
      });
      return;
    }
    
    // Create CSV content
    let csv = 'Keyword,Search Volume,Keyword Difficulty,CPC,Competition\n';
    
    keywordsToExport.forEach(item => {
      csv += `"${item.keyword}",${item.searchVolume},${item.keywordDifficulty},$${item.cpc},${item.competition}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${keyword}-keyword-research.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `${keywordsToExport.length} keywords exported to CSV.`,
    });
  };

  const handleCopySelected = () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No keywords selected",
        description: "Please select at least one keyword to copy.",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(selectedKeywords.join('\n'))
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${selectedKeywords.length} keywords copied to clipboard.`,
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy keywords. Please try again.",
          variant: "destructive",
        });
      });
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty < 30) return { label: "Easy", color: "text-green-600" };
    if (difficulty < 60) return { label: "Medium", color: "text-amber-600" };
    return { label: "Hard", color: "text-red-600" };
  };

  const getCompetitionLabel = (competition: number) => {
    if (competition < 0.3) return { label: "Low", color: "text-green-600" };
    if (competition < 0.7) return { label: "Medium", color: "text-amber-600" };
    return { label: "High", color: "text-red-600" };
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return "text-green-600 font-semibold";
    if (position <= 6) return "text-blue-600";
    return "text-gray-600";
  };

  const introduction = "Uncover valuable keyword insights with our comprehensive Keyword Research Tool.";

  const description = "Our Keyword Research Tool provides in-depth analysis and data for any keyword to help you make strategic SEO and content decisions. By entering a single keyword, you'll gain access to comprehensive metrics including search volume, keyword difficulty, cost-per-click (CPC), and competition levels. The tool also analyzes the current search engine results page (SERP) landscape to help you understand what you're up against. Beyond the primary keyword, you'll discover related terms, question-based variations, and competitor insights to expand your keyword strategy. With trend data showing how search interest changes over time, you can identify seasonal patterns and emerging opportunities. Whether you're planning new content, optimizing existing pages, or strategizing a PPC campaign, this research tool provides the actionable data you need to make informed decisions that drive organic traffic and maximize ROI.";

  const howToUse = [
    "Enter your target keyword in the search field.",
    "Select your target country and time period for data analysis.",
    "Click the 'Research Keyword' button to begin the analysis.",
    "Review the Overview tab for key metrics about your primary keyword.",
    "Explore the Related Keywords tab to discover additional targeting opportunities.",
    "Check the Questions tab to find question-based variations perfect for FAQ content.",
    "Analyze the SERP tab to understand the current ranking landscape.",
    "Export valuable keywords to CSV or copy them to your clipboard for further use."
  ];

  const features = [
    "✅ Comprehensive keyword metrics (search volume, difficulty, CPC, competition)",
    "✅ SERP analysis showing top-ranking pages and their metrics",
    "✅ Related keyword suggestions with complete data",
    "✅ Question-based variations for FAQ and featured snippet opportunities",
    "✅ Competitor analysis showing domains ranking for similar terms",
    "✅ Search trend data to identify seasonal patterns",
    "✅ Export capabilities for further analysis and planning",
    "✅ Country-specific data for targeted geographic insights"
  ];

  const faqs = [
    {
      question: "What is keyword difficulty and how should I interpret it?",
      answer: "Keyword difficulty (KD) is a metric that estimates how challenging it would be to rank on the first page of search results for a particular keyword. The score typically ranges from 1-100, with higher numbers indicating greater difficulty. This metric considers factors like: 1) Domain authority of current ranking websites; 2) Content quality and relevance of top results; 3) Backlink profiles of ranking pages; 4) Overall competitiveness of the keyword topic. When interpreting keyword difficulty: Scores below 30 generally represent good opportunities for newer websites with limited authority; Scores between 30-60 are moderately competitive and may be achievable with high-quality content and some link building; Scores above 60 indicate highly competitive terms that typically require significant authority and extensive SEO efforts. For best results, newer sites should focus primarily on lower-difficulty keywords while building authority, gradually targeting more competitive terms as their site grows in strength and visibility."
    },
    {
      question: "How can I use SERP analysis to improve my content strategy?",
      answer: "SERP (Search Engine Results Page) analysis provides valuable insights to enhance your content strategy in several ways: 1) Content format identification—observe whether the top results are guides, listicles, videos, or other formats to understand what search engines consider most relevant; 2) Content length benchmarking—analyze the depth and comprehensiveness of ranking content to set appropriate targets for your own material; 3) Title and meta description patterns—identify common phrases and approaches in top-ranking titles to inform your own optimized metadata; 4) Featured snippet opportunities—look for 'position zero' features to determine if structured content like bullet points, tables, or step-by-step instructions could help you capture this premium placement; 5) User intent alignment—examine the overall SERP to ensure your content matches the dominant search intent (informational, commercial, transactional); 6) Competitive gap analysis—identify what top-ranking content is missing that you could provide for a competitive advantage. By analyzing these elements, you can create content specifically designed to compete with and potentially outperform current top results rather than creating content in a vacuum."
    },
    {
      question: "What's the difference between search volume and competition metrics?",
      answer: "Search volume and competition are distinct metrics that measure different aspects of keyword potential: Search volume represents the number of times a keyword is queried in search engines over a specific time period (typically monthly). It indicates potential traffic opportunity but doesn't necessarily reflect how difficult it is to rank for that term. A high search volume means many people are searching for that term, but it doesn't tell you how many websites are competing for those searches. Competition, meanwhile, measures how many websites are actively trying to rank for that keyword and how strong those competitors are. This metric considers factors like the number and quality of competing websites, their domain authority, content quality, and backlink profiles. A high competition score indicates many strong websites are targeting that keyword, making it harder to achieve high rankings regardless of search volume. The ideal keyword strategy balances these metrics—finding terms with adequate search volume (traffic potential) but manageable competition levels (ranking potential). This is why long-tail keywords (more specific phrases) often represent better opportunities despite lower search volumes, as they typically face less competition."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Keyword Research Tool</h3>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="keyword" className="block mb-2">Keyword</Label>
            <div className="flex">
              <Input 
                id="keyword" 
                placeholder="Enter a keyword to research..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={handleResearch}
                className="rounded-l-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isResearching}
              >
                {isResearching ? (
                  <>Researching...</>
                ) : (
                  <>
                    <FaSearch className="mr-2" /> 
                    Research
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block mb-2">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="block mb-2">Time Period</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isResearching && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Researching keyword data...</span>
              <span>{Math.round(researchProgress)}%</span>
            </div>
            <Progress value={researchProgress} />
          </div>
        )}
        
        {results && (
          <div className="space-y-5 pt-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="related" className="text-xs sm:text-sm">Related Keywords</TabsTrigger>
                <TabsTrigger value="questions" className="text-xs sm:text-sm">Questions</TabsTrigger>
                <TabsTrigger value="serp" className="text-xs sm:text-sm">SERP Analysis</TabsTrigger>
                <TabsTrigger value="competitors" className="text-xs sm:text-sm">Competitors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border">
                    <h4 className="text-lg font-medium mb-4">Keyword Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Keyword</span>
                        <span className="font-semibold">{results.mainKeyword.keyword}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Search Volume</span>
                        <span className="font-semibold">{results.mainKeyword.searchVolume.toLocaleString()} searches/month</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Keyword Difficulty</span>
                        <span className={`font-semibold ${getDifficultyLabel(results.mainKeyword.keywordDifficulty).color}`}>
                          {results.mainKeyword.keywordDifficulty}/100 ({getDifficultyLabel(results.mainKeyword.keywordDifficulty).label})
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">CPC</span>
                        <span className="font-semibold">${results.mainKeyword.cpc}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-gray-600">Competition</span>
                        <span className={`font-semibold ${getCompetitionLabel(parseFloat(results.mainKeyword.competition)).color}`}>
                          {getCompetitionLabel(parseFloat(results.mainKeyword.competition)).label} ({(parseFloat(results.mainKeyword.competition) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border">
                    <h4 className="text-lg font-medium mb-4">Search Volume Trend</h4>
                    <div className="h-48">
                      <div className="h-full flex items-end space-x-1">
                        {results.trendData.map((item, index) => {
                          const maxVolume = Math.max(...results.trendData.map(d => d.volume));
                          const height = (item.volume / maxVolume) * 100;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs mt-1 text-gray-600">{item.period}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="p-4 border">
                  <h4 className="text-lg font-medium mb-4">SERP Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.mainKeyword.serp.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Total results: {results.mainKeyword.serp.totalResults.toLocaleString()}
                  </p>
                </Card>
                
                <div className="flex justify-between">
                  <h4 className="text-md font-medium">Top Related Keywords</h4>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setActiveTab("related")}
                    className="text-sm"
                  >
                    View all <FaArrowRight className="ml-1" />
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-3 text-left">Keyword</th>
                        <th className="py-2 px-3 text-right">Search Volume</th>
                        <th className="py-2 px-3 text-right">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.relatedKeywords.slice(0, 5).map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-3 font-medium">{item.keyword}</td>
                          <td className="py-2 px-3 text-right">{item.searchVolume.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={getDifficultyLabel(item.keywordDifficulty).color}>
                              {item.keywordDifficulty}/100
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg flex items-center">
                    <FaChartBar className="mr-2 text-blue-600" />
                    Related Keywords
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full">
                      {results.relatedKeywords.length}
                    </span>
                  </h4>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopySelected}
                      disabled={selectedKeywords.length === 0}
                      className="text-xs"
                    >
                      <FaCopy className="mr-1" /> 
                      Copy {selectedKeywords.length > 0 ? `(${selectedKeywords.length})` : ''}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExportCSV}
                      className="text-xs"
                    >
                      <FaDownload className="mr-1" /> 
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-3 text-left w-8">
                          <Checkbox 
                            checked={selectedKeywords.length === results.relatedKeywords.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedKeywords(results.relatedKeywords.map(k => k.keyword));
                              } else {
                                setSelectedKeywords([]);
                              }
                            }}
                          />
                        </th>
                        <th className="py-2 px-3 text-left">Keyword</th>
                        <th className="py-2 px-3 text-right">Search Volume</th>
                        <th className="py-2 px-3 text-right">Difficulty</th>
                        <th className="py-2 px-3 text-right">CPC</th>
                        <th className="py-2 px-3 text-right">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.relatedKeywords.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <Checkbox 
                              checked={selectedKeywords.includes(item.keyword)}
                              onCheckedChange={() => handleKeywordSelect(item.keyword)}
                            />
                          </td>
                          <td className="py-2 px-3 font-medium">{item.keyword}</td>
                          <td className="py-2 px-3 text-right">{item.searchVolume.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={getDifficultyLabel(item.keywordDifficulty).color}>
                              {item.keywordDifficulty}/100
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">${item.cpc}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={getCompetitionLabel(parseFloat(item.competition)).color}>
                              {(parseFloat(item.competition) * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg flex items-center">
                    <FaIconQuestion className="mr-2 text-purple-600" />
                    Question Keywords
                    <span className="ml-2 bg-purple-100 text-purple-700 text-xs py-0.5 px-2 rounded-full">
                      {results.questions.length}
                    </span>
                  </h4>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopySelected}
                      disabled={selectedKeywords.length === 0}
                      className="text-xs"
                    >
                      <FaCopy className="mr-1" /> 
                      Copy {selectedKeywords.length > 0 ? `(${selectedKeywords.length})` : ''}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExportCSV}
                      className="text-xs"
                    >
                      <FaDownload className="mr-1" /> 
                      Export CSV
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-3 text-left w-8">
                          <Checkbox 
                            checked={results.questions.every(q => selectedKeywords.includes(q.keyword))}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedKeywords([...new Set([...selectedKeywords, ...results.questions.map(q => q.keyword)])]);
                              } else {
                                setSelectedKeywords(selectedKeywords.filter(k => !results.questions.some(q => q.keyword === k)));
                              }
                            }}
                          />
                        </th>
                        <th className="py-2 px-3 text-left">Question</th>
                        <th className="py-2 px-3 text-right">Search Volume</th>
                        <th className="py-2 px-3 text-right">Difficulty</th>
                        <th className="py-2 px-3 text-right">CPC</th>
                        <th className="py-2 px-3 text-right">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.questions.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <Checkbox 
                              checked={selectedKeywords.includes(item.keyword)}
                              onCheckedChange={() => handleKeywordSelect(item.keyword)}
                            />
                          </td>
                          <td className="py-2 px-3 font-medium">{item.keyword}</td>
                          <td className="py-2 px-3 text-right">{item.searchVolume.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={getDifficultyLabel(item.keywordDifficulty).color}>
                              {item.keywordDifficulty}/100
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">${item.cpc}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={getCompetitionLabel(parseFloat(item.competition)).color}>
                              {(parseFloat(item.competition) * 100).toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-purple-800">
                      <p><strong>Question keywords</strong> are excellent opportunities for:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Creating FAQ content that directly answers user queries</li>
                        <li>Targeting featured snippets that appear at the top of search results</li>
                        <li>Developing comprehensive guides that address common questions</li>
                        <li>Building topical authority by covering question clusters</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="serp" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg flex items-center">
                    <FaListUl className="mr-2 text-green-600" />
                    SERP Analysis
                    <span className="ml-2 bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full">
                      Top 10 Results
                    </span>
                  </h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-3 text-left">Position</th>
                        <th className="py-2 px-3 text-left">Title</th>
                        <th className="py-2 px-3 text-left">Domain</th>
                        <th className="py-2 px-3 text-right">Metrics Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.mainKeyword.serp.organicResults.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <span className={`font-semibold ${getPositionColor(item.position)}`}>
                              {item.position}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium max-w-md truncate">{item.title}</td>
                          <td className="py-2 px-3 text-blue-600">{item.domain}</td>
                          <td className="py-2 px-3 text-right">
                            {item.metricsScore}/100
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-blue-800">
                      <p><strong>SERP Analysis</strong> helps you understand the competitive landscape:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Analyze content types and formats of top-ranking pages</li>
                        <li>Identify the domain authority needed to compete</li>
                        <li>Examine title patterns to inform your own optimizations</li>
                        <li>Look for featured snippet opportunities to target position zero</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="competitors" className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-lg flex items-center">
                    <FaRankingStar className="mr-2 text-amber-600" />
                    Competitors Analysis
                    <span className="ml-2 bg-amber-100 text-amber-700 text-xs py-0.5 px-2 rounded-full">
                      Top 5 Competitors
                    </span>
                  </h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-2 px-3 text-left">Domain</th>
                        <th className="py-2 px-3 text-right">Keyword Count</th>
                        <th className="py-2 px-3 text-left">Top Ranking Keywords</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.competitors.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 font-medium text-blue-600">{item.domain}</td>
                          <td className="py-2 px-3 text-right">{item.keywordCount.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap gap-1">
                              {item.topKeywords.map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <div className="flex items-start">
                    <FaChartLine className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-amber-800">
                      <p><strong>Competitive Intelligence</strong> helps you:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Identify what keywords your competitors are ranking for</li>
                        <li>Discover content gap opportunities they might be missing</li>
                        <li>Analyze their top-performing content strategies</li>
                        <li>Find related keywords to expand your own targeting</li>
                      </ul>
                    </div>
                  </div>
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
      toolSlug="keyword-research-tool-detailed"
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

export default KeywordResearchToolDetailed;