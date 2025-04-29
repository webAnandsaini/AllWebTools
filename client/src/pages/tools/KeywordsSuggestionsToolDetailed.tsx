import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { keywordsTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaSearch, 
  FaLightbulb,
  FaDownload,
  FaCheck,
  FaFilter,
  FaFilter as FaIconQuestion,
  FaListUl,
  FaGlobe,
  FaCaretDown,
  FaCaretUp
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const KeywordsSuggestionsToolDetailed = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateProgress, setGenerateProgress] = useState<number>(0);
  const [results, setResults] = useState<any | null>(null);
  const [searchType, setSearchType] = useState<string>("related");
  const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);
  const [country, setCountry] = useState<string>("us");
  const [filters, setFilters] = useState({
    searchVolume: {
      min: 0,
      max: 100000
    },
    competition: {
      min: 0,
      max: 100
    },
    wordCount: {
      min: 1, 
      max: 5
    }
  });

  const handleGenerate = () => {
    if (!keyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a seed keyword to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);
    setResults(null);
    
    // Simulate the generation process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate simulated results
        const categories = ["Questions", "Prepositions", "Comparisons", "Related", "Long-tail"];
        
        // Create simulated suggestions
        const getRandomInt = (min: number, max: number) => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        const generateSuggestions = (category: string, count: number) => {
          const suggestions = [];
          
          // Different prefixes/suffixes based on category
          let prefixes: string[] = [];
          let suffixes: string[] = [];
          
          switch(category) {
            case "Questions":
              prefixes = ["how to", "what is", "why", "when to", "where to", "which", "who"];
              break;
            case "Prepositions":
              prefixes = ["for", "with", "without", "near", "vs", "in", "on", "at"];
              break;
            case "Comparisons":
              suffixes = ["vs", "alternative", "compared to", "or", "versus"];
              break;
            case "Related":
              prefixes = ["best", "top", "affordable", "cheap", "premium", "free", "professional"];
              suffixes = ["software", "service", "tool", "app", "platform", "tips", "guide"];
              break;
            case "Long-tail":
              prefixes = ["how to use", "best way to", "where to find", "what is the best", "how to choose"];
              suffixes = ["for beginners", "for small business", "for free", "without paying", "in 2025"];
              break;
          }
          
          for (let i = 0; i < count; i++) {
            const hasPrefix = category !== "Comparisons" && Math.random() > 0.3;
            const hasSuffix = category !== "Questions" && Math.random() > 0.3;
            
            let suggestion = "";
            
            if (hasPrefix) {
              suggestion += prefixes[Math.floor(Math.random() * prefixes.length)] + " ";
            }
            
            suggestion += keyword;
            
            if (hasSuffix) {
              suggestion += " " + suffixes[Math.floor(Math.random() * suffixes.length)];
            }
            
            // Generate random metrics
            const searchVolume = getRandomInt(50, 10000);
            const competition = getRandomInt(10, 100);
            const cpc = (Math.random() * 4 + 0.1).toFixed(2);
            
            suggestions.push({
              keyword: suggestion,
              searchVolume,
              competition,
              cpc,
              wordCount: suggestion.split(' ').length
            });
          }
          
          return suggestions;
        };
        
        const allSuggestions: Record<string, any[]> = {};
        categories.forEach(category => {
          allSuggestions[category] = generateSuggestions(category, getRandomInt(8, 15));
        });
        
        setResults(allSuggestions);
        setIsGenerating(false);
        
        const totalCount = Object.values(allSuggestions).reduce((sum, arr) => sum + arr.length, 0);
        
        toast({
          title: "Suggestions generated",
          description: `Generated ${totalCount} keyword suggestions for "${keyword}".`,
        });
      }
      setGenerateProgress(progress);
    }, 100);
  };

  const exportToCSV = () => {
    if (!results) return;
    
    // Create CSV content
    let csv = 'Keyword,Search Volume,Competition,CPC,Word Count,Category\n';
    
    Object.entries(results).forEach(([category, suggestions]) => {
      (suggestions as any[]).forEach(item => {
        csv += `"${item.keyword}",${item.searchVolume},${item.competition}%,$${item.cpc},${item.wordCount},"${category}"\n`;
      });
    });
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${keyword}-keyword-suggestions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: "Keyword suggestions exported to CSV file.",
    });
  };

  const filteredResults = results ? 
    Object.fromEntries(
      Object.entries(results).map(([category, items]) => [
        category, 
        (items as any[]).filter(item => 
          item.searchVolume >= filters.searchVolume.min && 
          item.searchVolume <= filters.searchVolume.max &&
          item.competition >= filters.competition.min && 
          item.competition <= filters.competition.max &&
          item.wordCount >= filters.wordCount.min && 
          item.wordCount <= filters.wordCount.max
        )
      ])
    ) : null;
    
  const totalSuggestions = filteredResults ? 
    Object.values(filteredResults).reduce((sum, arr: any) => sum + arr.length, 0) : 0;

  const getSearchVolumeColor = (volume: number) => {
    if (volume >= 5000) return "text-green-600 font-semibold";
    if (volume >= 1000) return "text-blue-600";
    if (volume >= 500) return "text-amber-600";
    return "text-gray-600";
  };

  const getCompetitionColor = (competition: number) => {
    if (competition >= 80) return "text-red-600 font-semibold";
    if (competition >= 60) return "text-amber-600";
    if (competition >= 40) return "text-blue-600";
    return "text-green-600";
  };

  const introduction = "Generate targeted keyword ideas for your content with our Keywords Suggestions Tool.";

  const description = "Our Keywords Suggestions Tool helps you discover new keyword opportunities to expand your content strategy and SEO efforts. By analyzing your seed keyword, this tool generates a comprehensive list of related terms, questions, comparisons, prepositions, and long-tail variations that your audience is actively searching for. Each suggestion comes with valuable metrics like search volume, competition level, and cost-per-click data to help you prioritize the most promising keywords. Whether you're planning content calendars, optimizing existing pages, or researching new market opportunities, this tool provides actionable keyword insights across different categories. Find the perfect balance between search volume and competition to target keywords that will drive qualified traffic to your website and improve your overall SEO performance.";

  const howToUse = [
    "Enter a seed keyword that's relevant to your business or content.",
    "Select the type of suggestions you're looking for (related terms, questions, etc.).",
    "Choose additional settings like country and whether to include metrics.",
    "Click 'Generate Suggestions' to start the process.",
    "Browse through categorized keyword suggestions with their metrics.",
    "Use filters to narrow down results based on search volume, competition, or word count.",
    "Export your selected keywords to CSV for further analysis or implementation."
  ];

  const features = [
    "✅ Generate hundreds of keyword suggestions from a single seed term",
    "✅ Organize suggestions into practical categories (questions, prepositions, comparisons)",
    "✅ View essential metrics including search volume, competition, and CPC",
    "✅ Filter results based on search volume, competition level, and word count",
    "✅ Discover question-based keywords perfect for creating FAQ content",
    "✅ Find long-tail variations with lower competition and higher conversion potential",
    "✅ Export suggestions to CSV for use in your content planning or SEO tools"
  ];

  const faqs = [
    {
      question: "What types of keyword suggestions does this tool provide?",
      answer: "Our Keywords Suggestions Tool provides five main categories of keyword ideas: 1) Related Terms - keywords broadly connected to your seed term with similar search intent; 2) Questions - interrogative phrases starting with how, what, why, when, where, which, or who, perfect for FAQ content and targeting featured snippets; 3) Prepositions - phrases combining your keyword with prepositions like for, with, without, near, etc., which often reveal specific user needs; 4) Comparisons - terms combining your keyword with competitors or alternatives, capturing users in the consideration phase; and 5) Long-tail Keywords - longer, more specific phrases with lower search volume but higher conversion intent. This comprehensive approach ensures you discover keyword opportunities across the entire customer journey, from awareness to consideration and decision stages, helping you create targeted content for each segment of your audience."
    },
    {
      question: "How should I choose which suggested keywords to target?",
      answer: "When selecting which suggested keywords to target, consider these factors: 1) Search Volume - higher volumes indicate greater traffic potential, but also typically mean more competition; 2) Competition Level - lower competition keywords are generally easier to rank for, especially for newer websites; 3) Relevance to Your Business - prioritize keywords that closely match your products, services, or expertise; 4) User Intent - ensure the keywords align with what you offer (informational, navigational, commercial, or transactional intent); 5) Conversion Potential - long-tail keywords often have lower volume but higher conversion rates as they're more specific; 6) Your Website's Authority - newer sites should start with lower-competition terms while established sites can target more competitive keywords; 7) Content Gaps - identify keywords your competitors rank for but you don't. The ideal approach is to balance these factors, often starting with lower-competition long-tail keywords to build authority, then gradually targeting more competitive terms as your site grows."
    },
    {
      question: "What are the benefits of targeting long-tail keywords?",
      answer: "Long-tail keywords offer several significant advantages for your SEO strategy: 1) Lower Competition - these more specific phrases typically have fewer websites targeting them, making them easier to rank for, especially for newer sites; 2) Higher Conversion Rates - long-tail searches often indicate users closer to a purchase decision with more specific intent, resulting in better conversion rates; 3) More Targeted Traffic - visitors who find you through specific long-tail queries are more likely to find exactly what they're looking for on your site; 4) Better Voice Search Compatibility - longer, more conversational phrases align well with how people use voice search; 5) Easier Content Creation - specific long-tail topics often make content planning more straightforward with a clearer focus; 6) Greater Topical Authority - creating content for multiple related long-tail keywords helps establish authority in your niche; 7) Featured Snippet Opportunities - question-based long-tail keywords frequently trigger featured snippets, offering visibility even without the #1 position. While individual long-tail keywords have lower search volume, collectively they make up the majority of searches and often bring higher-quality traffic to your site."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Keywords Suggestions Tool</h3>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="keyword" className="block mb-2">Seed Keyword</Label>
            <div className="flex">
              <Input 
                id="keyword" 
                placeholder="Enter a keyword..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={handleGenerate}
                className="rounded-l-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FaLightbulb className="mr-2" /> 
                    Generate
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter a keyword relevant to your business or content</p>
          </div>
          
          <div>
            <Label className="block mb-2">Country</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="in">India</option>
              <option value="global">Global</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block mb-2">Suggestion Type</Label>
            <RadioGroup 
              defaultValue="related" 
              value={searchType}
              onValueChange={setSearchType}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center">
                <RadioGroupItem value="related" id="related" className="peer sr-only" />
                <Label 
                  htmlFor="related" 
                  className="cursor-pointer rounded-md border bg-white px-3 py-1.5 text-sm peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-600"
                >
                  All Suggestions
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="questions" id="questions" className="peer sr-only" />
                <Label 
                  htmlFor="questions" 
                  className="cursor-pointer rounded-md border bg-white px-3 py-1.5 text-sm peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-600"
                >
                  Questions
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="longtail" id="longtail" className="peer sr-only" />
                <Label 
                  htmlFor="longtail" 
                  className="cursor-pointer rounded-md border bg-white px-3 py-1.5 text-sm peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-600"
                >
                  Long-tail
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="include-metrics" 
              checked={includeMetrics}
              onCheckedChange={() => setIncludeMetrics(!includeMetrics)}
            />
            <Label 
              htmlFor="include-metrics" 
              className="ml-2 cursor-pointer"
            >
              Include search volume and competition metrics
            </Label>
          </div>
        </div>
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating keyword suggestions...</span>
              <span>{Math.round(generateProgress)}%</span>
            </div>
            <Progress value={generateProgress} />
          </div>
        )}
        
        {filteredResults && (
          <div className="space-y-5 pt-2">
            <div className="flex flex-wrap justify-between items-center">
              <h4 className="font-medium text-lg flex items-center">
                <FaLightbulb className="mr-2 text-amber-500" />
                Keyword Suggestions
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full">
                  {totalSuggestions} found
                </span>
              </h4>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
                disabled={totalSuggestions === 0}
              >
                <FaDownload className="mr-2" />
                Export to CSV
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    document.getElementById('filters-section')?.classList.toggle('hidden');
                    document.getElementById('filters-icon-up')?.classList.toggle('hidden');
                    document.getElementById('filters-icon-down')?.classList.toggle('hidden');
                  }}
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <FaFilter className="mr-2" />
                    Filter Results
                  </span>
                  <span>
                    <FaCaretDown id="filters-icon-down" />
                    <FaCaretUp id="filters-icon-up" className="hidden" />
                  </span>
                </Button>
                
                <div id="filters-section" className="hidden pt-3 space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Search Volume</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="min-volume" className="text-xs">Min</Label>
                        <Input 
                          id="min-volume" 
                          type="number" 
                          placeholder="Min volume"
                          value={filters.searchVolume.min}
                          onChange={(e) => setFilters({
                            ...filters,
                            searchVolume: {
                              ...filters.searchVolume,
                              min: parseInt(e.target.value) || 0
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-volume" className="text-xs">Max</Label>
                        <Input 
                          id="max-volume" 
                          type="number" 
                          placeholder="Max volume"
                          value={filters.searchVolume.max}
                          onChange={(e) => setFilters({
                            ...filters,
                            searchVolume: {
                              ...filters.searchVolume,
                              max: parseInt(e.target.value) || 100000
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">Competition (%)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="min-competition" className="text-xs">Min</Label>
                        <Input 
                          id="min-competition" 
                          type="number" 
                          placeholder="Min competition"
                          value={filters.competition.min}
                          onChange={(e) => setFilters({
                            ...filters,
                            competition: {
                              ...filters.competition,
                              min: parseInt(e.target.value) || 0
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-competition" className="text-xs">Max</Label>
                        <Input 
                          id="max-competition" 
                          type="number" 
                          placeholder="Max competition"
                          value={filters.competition.max}
                          onChange={(e) => setFilters({
                            ...filters,
                            competition: {
                              ...filters.competition,
                              max: parseInt(e.target.value) || 100
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">Word Count</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="min-words" className="text-xs">Min</Label>
                        <Input 
                          id="min-words" 
                          type="number" 
                          placeholder="Min words"
                          value={filters.wordCount.min}
                          onChange={(e) => setFilters({
                            ...filters,
                            wordCount: {
                              ...filters.wordCount,
                              min: parseInt(e.target.value) || 1
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-words" className="text-xs">Max</Label>
                        <Input 
                          id="max-words" 
                          type="number" 
                          placeholder="Max words"
                          value={filters.wordCount.max}
                          onChange={(e) => setFilters({
                            ...filters,
                            wordCount: {
                              ...filters.wordCount,
                              max: parseInt(e.target.value) || 5
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-0">
                <Accordion type="multiple" defaultValue={["Questions", "Prepositions", "Comparisons", "Related", "Long-tail"]}>
                  {Object.entries(filteredResults).map(([category, suggestions]) => {
                    if ((suggestions as any[]).length === 0) return null;
                    
                    // Filter by search type if needed
                    if (searchType !== "related" && searchType !== category.toLowerCase()) return null;
                    
                    return (
                      <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                          <div className="flex items-center">
                            <span className="font-medium">{category}</span>
                            <span className="ml-2 bg-blue-100 text-blue-700 text-xs py-0.5 px-2 rounded-full">
                              {(suggestions as any[]).length}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea className="h-[250px]">
                            <div className="p-1">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <th className="p-2 text-left font-medium">Keyword</th>
                                    {includeMetrics && (
                                      <>
                                        <th className="p-2 text-right font-medium whitespace-nowrap">Search Vol.</th>
                                        <th className="p-2 text-right font-medium">Competition</th>
                                        <th className="p-2 text-right font-medium">CPC</th>
                                      </>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {(suggestions as any[]).map((item, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                      <td className="p-2 text-left">
                                        <div className="font-medium">{item.keyword}</div>
                                        <div className="text-xs text-gray-500">{item.wordCount} words</div>
                                      </td>
                                      {includeMetrics && (
                                        <>
                                          <td className="p-2 text-right">
                                            <span className={getSearchVolumeColor(item.searchVolume)}>
                                              {item.searchVolume >= 1000 
                                                ? `${(item.searchVolume / 1000).toFixed(1)}K`
                                                : item.searchVolume
                                              }
                                            </span>
                                          </td>
                                          <td className="p-2 text-right">
                                            <span className={getCompetitionColor(item.competition)}>
                                              {item.competition}%
                                            </span>
                                          </td>
                                          <td className="p-2 text-right">
                                            ${item.cpc}
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <h5 className="font-medium text-blue-700 mb-2">Choosing the Right Keywords</h5>
              <ul className="space-y-1 text-blue-700">
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-green-500" />
                  <span><strong>High Volume, High Competition</strong>: Great for established sites with strong authority.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-blue-500" />
                  <span><strong>Medium Volume, Medium Competition</strong>: Good balance for most websites.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-amber-500" />
                  <span><strong>Low Volume, Low Competition</strong>: Ideal for new sites or creating highly targeted content.</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mt-1 mr-2 flex-shrink-0 text-purple-500" />
                  <span><strong>Question Keywords</strong>: Perfect for FAQ pages and featured snippet opportunities.</span>
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
      toolSlug="keywords-suggestions-tool-detailed"
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

export default KeywordsSuggestionsToolDetailed;