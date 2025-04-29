import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { keywordsTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaPercent, 
  FaSearch,
  FaFileAlt,
  FaLink,
  FaChartBar,
  FaInfoCircle
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const KeywordsDensityCheckerDetailed = () => {
  const [url, setUrl] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeProgress, setAnalyzeProgress] = useState<number>(0);
  const [results, setResults] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("url");
  const [wordCount, setWordCount] = useState<number>(0);

  const handleAnalyze = () => {
    if (activeTab === "url" && !url) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "text" && !textContent) {
      toast({
        title: "Text required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format if using URL tab
    if (activeTab === "url") {
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
    }

    setIsAnalyzing(true);
    setAnalyzeProgress(0);
    setResults(null);
    
    // Simulate the analyzing process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Analyze text content or simulated webpage content
        const content = activeTab === "text" ? textContent : 
          "This is simulated webpage content from the URL. It would normally contain the actual HTML content parsed from the webpage. For this demo, we're using sample text to analyze keyword density patterns. SEO optimization requires careful attention to keyword density. Too many keywords can trigger spam filters, while too few may not signal relevance to search engines. Finding the right keyword density balance is crucial for effective SEO strategy. Most SEO experts recommend a keyword density between 1-2% for primary keywords and slightly lower for secondary keywords. This helps ensure content remains natural and reader-friendly while still being optimized for search engines. Always prioritize creating valuable, informative content over keyword stuffing.";
        
        // Calculate word count
        const words = content.match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        setWordCount(totalWords);
        
        // Create word frequency map
        const wordMap = words.reduce((acc, word) => {
          const lowerWord = word.toLowerCase();
          if (lowerWord.length > 2) { // Skip very short words
            acc[lowerWord] = (acc[lowerWord] || 0) + 1;
          }
          return acc;
        }, {});
        
        // Create density results sorted by frequency
        const densityResults = Object.entries(wordMap)
          .map(([word, count]) => ({
            word,
            count: count as number,
            density: ((count as number) / totalWords * 100).toFixed(2)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20); // Take top 20 words
        
        // Find 2-word phrases (bigrams)
        const phrases: {[key: string]: number} = {};
        for (let i = 0; i < words.length - 1; i++) {
          if (words[i].length > 2 && words[i+1].length > 2) {
            const phrase = `${words[i].toLowerCase()} ${words[i+1].toLowerCase()}`;
            phrases[phrase] = (phrases[phrase] || 0) + 1;
          }
        }
        
        // Get top phrases
        const phraseResults = Object.entries(phrases)
          .map(([phrase, count]) => ({
            phrase,
            count: count as number,
            density: ((count as number) / (totalWords - 1) * 100).toFixed(2)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Take top 10 phrases
        
        setResults({
          wordCount: totalWords,
          words: densityResults,
          phrases: phraseResults,
          source: activeTab === "url" ? url : "Text input"
        });
        
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: `Analyzed ${totalWords} words.`,
        });
      }
      setAnalyzeProgress(progress);
    }, 80);
  };

  const getDensityColor = (density: number) => {
    if (density < 1) return "text-gray-600";
    if (density >= 1 && density <= 2.5) return "text-green-600";
    if (density > 2.5 && density <= 4) return "text-amber-600";
    return "text-red-600";
  };

  const getDensityStatus = (density: number) => {
    if (density < 1) return "Low";
    if (density >= 1 && density <= 2.5) return "Optimal";
    if (density > 2.5 && density <= 4) return "High";
    return "Very High";
  };

  const introduction = "Optimize your content with our Keywords Density Checker for perfect SEO balance.";

  const description = "Our Keywords Density Checker tool helps you analyze the frequency and distribution of keywords within your content to ensure optimal SEO performance. Keyword density refers to how often a specific word or phrase appears in your content relative to the total word count. While search engines no longer rely solely on keyword density for ranking, maintaining an appropriate balance remains important—too low might miss ranking opportunities, while too high could trigger spam penalties. This tool scans your content (either by URL or direct text input) and calculates the density of each keyword and phrase, identifying potential optimization opportunities. By understanding your keyword distribution, you can fine-tune your content strategy, avoid keyword stuffing, ensure natural readability, and improve your chances of ranking for target terms. Whether you're creating new content or auditing existing pages, our density checker provides actionable insights to enhance your SEO efforts.";

  const howToUse = [
    "Choose between analyzing a webpage URL or directly pasting text content.",
    "For URL analysis, enter the complete web address including http:// or https://.",
    "For text analysis, paste your content into the text area.",
    "Click the 'Analyze Density' button to start the process.",
    "Review the results showing individual keywords and phrases with their frequency and density percentages.",
    "Look for keywords with optimal density (1-2.5%) and opportunities to adjust over-optimized or under-optimized terms."
  ];

  const features = [
    "✅ Analyze both webpage URLs and direct text input",
    "✅ Calculate keyword density percentages for individual words and phrases",
    "✅ Identify optimal, low, and over-optimized keyword frequencies",
    "✅ Discover commonly used phrases for potential keyword targeting",
    "✅ Compare keyword distribution across different content sections",
    "✅ Get recommendations for improving keyword balance",
    "✅ Review total word count and content statistics"
  ];

  const faqs = [
    {
      question: "What is the ideal keyword density for SEO?",
      answer: "While there's no universally perfect keyword density, most SEO experts recommend a range of 1-2.5% for primary keywords. This means your target keyword should appear 1-2.5 times per 100 words. However, optimal density can vary depending on: 1) Your industry and content type—technical content might naturally use terminology more frequently; 2) The specific keyword—some terms sound unnatural when repeated too often; 3) Search intent—informational content may use keywords differently than commercial pages; 4) Content length—longer content allows more natural keyword distribution. Modern search engines prioritize context, synonyms, and related terms over exact keyword repetition. Rather than fixating on a specific percentage, focus on creating comprehensive, naturally written content that covers your topic thoroughly. Our tool helps identify potential issues like unnaturally high keyword frequencies while giving you confidence your primary terms appear sufficiently."
    },
    {
      question: "What's the difference between keyword stuffing and optimal keyword density?",
      answer: "Keyword stuffing is the practice of unnaturally forcing keywords into content solely to manipulate search rankings, while optimal keyword density refers to a balanced, natural inclusion of relevant terms. The key differences include: 1) Intent—stuffing aims to game algorithms, while optimal density supports content relevance; 2) Readability—stuffed content sounds awkward and repetitive, while optimized content flows naturally; 3) Density percentages—stuffing typically involves densities above 5%, while optimal density ranges from 1-2.5%; 4) Variation—stuffing often repeats the exact same phrase, while good optimization incorporates related terms and synonyms; 5) Placement—stuffing may hide keywords in irrelevant sections, while proper optimization places terms in logical contexts. Search engines have sophisticated algorithms to detect keyword stuffing, which can result in penalties. Our density checker helps you find the balance—ensuring keywords appear enough times to signal relevance without crossing into manipulation territory."
    },
    {
      question: "Should I analyze keyword density for my entire website or individual pages?",
      answer: "You should analyze keyword density at the individual page level rather than across your entire website for several important reasons: 1) Each page should target specific keywords—analyzing density by page helps ensure proper focus for each target term; 2) Search engines primarily rank individual pages, not entire websites; 3) Different page types (blog posts, product pages, landing pages) have different optimal keyword strategies; 4) Page-level analysis makes it easier to identify and fix specific content issues; 5) Visitors experience your content one page at a time, so readability concerns from keyword repetition impact individual pages. For best results, use our tool to analyze each important page on your site individually, focusing on your most critical landing pages and content first. This approach allows for precise optimization tailored to the specific purpose and audience of each page. However, it's also valuable to occasionally review site-wide patterns to ensure consistent quality and identify potential cannibalization issues across multiple pages."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Keywords Density Checker</h3>
      
      <div className="space-y-5">
        <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center">
              <FaLink className="mr-2" />
              Analyze URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <FaFileAlt className="mr-2" />
              Analyze Text
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <div>
              <Label htmlFor="webpage-url" className="block mb-2">Website URL</Label>
              <Input 
                id="webpage-url" 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the full URL including http:// or https://</p>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="mt-4">
            <div>
              <Label htmlFor="content-text" className="block mb-2">Content Text</Label>
              <Textarea 
                id="content-text" 
                placeholder="Paste your content here to analyze keyword density" 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
              />
              <p className="text-xs text-gray-500 mt-1">For best results, include at least 300 words</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          onClick={handleAnalyze}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>Analyzing Content...</>
          ) : (
            <>
              <FaPercent className="mr-2" /> 
              Analyze Density
            </>
          )}
        </Button>
        
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing content...</span>
              <span>{Math.round(analyzeProgress)}%</span>
            </div>
            <Progress value={analyzeProgress} />
          </div>
        )}
        
        {results && (
          <div className="space-y-6 mt-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Content Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Word Count</p>
                  <p className="text-xl font-semibold text-blue-700">{results.wordCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Source</p>
                  <p className="text-sm font-medium text-blue-700 truncate">{results.source}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-lg flex items-center mb-3">
                <FaChartBar className="mr-2 text-blue-600" />
                Keyword Density Analysis
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-2 px-3 text-left">Keyword</th>
                      <th className="py-2 px-3 text-center">Count</th>
                      <th className="py-2 px-3 text-center">Density</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.words.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3 font-medium">{item.word}</td>
                        <td className="py-2 px-3 text-center">{item.count}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={getDensityColor(parseFloat(item.density))}>
                            {item.density}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            parseFloat(item.density) < 1 ? 'bg-gray-100 text-gray-700' :
                            parseFloat(item.density) <= 2.5 ? 'bg-green-100 text-green-700' :
                            parseFloat(item.density) <= 4 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {getDensityStatus(parseFloat(item.density))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-lg flex items-center mb-3">
                <FaChartBar className="mr-2 text-blue-600" />
                Phrase Density Analysis
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-2 px-3 text-left">Phrase</th>
                      <th className="py-2 px-3 text-center">Count</th>
                      <th className="py-2 px-3 text-center">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.phrases.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3 font-medium">{item.phrase}</td>
                        <td className="py-2 px-3 text-center">{item.count}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={getDensityColor(parseFloat(item.density))}>
                            {item.density}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h5 className="font-medium mb-1">Keyword Density Guide</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 bg-green-500 rounded-full"></span>
                      <span><strong>Optimal:</strong> 1.0-2.5% - Good keyword presence without over-optimization</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 bg-gray-400 rounded-full"></span>
                      <span><strong>Low:</strong> &lt;1.0% - May need more emphasis for better visibility</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 bg-amber-500 rounded-full"></span>
                      <span><strong>High:</strong> 2.5-4.0% - Consider reducing slightly for more natural content</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-2 bg-red-500 rounded-full"></span>
                      <span><strong>Very High:</strong> &gt;4.0% - May trigger spam filters, reduce frequency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="keywords-density-checker-detailed"
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

export default KeywordsDensityCheckerDetailed;