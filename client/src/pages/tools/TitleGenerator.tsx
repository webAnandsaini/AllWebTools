import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

type ContentType = "blog" | "article" | "video" | "news" | "creative" | "seo";

const TitleGenerator = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeEmotional, setIncludeEmotional] = useState(true);
  
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "Title Generator - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentType);
  };

  const handleGenerateTitles = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic is required",
        description: "Please enter a topic to generate titles.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedTitles([]);
    setSelectedTitle("");

    try {
      const keywordsList = keywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

      // Create a prompt that includes all the parameters
      let topicText = topic;
      if (keywordsList.length > 0) {
        topicText += ` with focus on ${keywordsList.join(", ")}`;
      }
      
      if (contentType) {
        topicText += ` for ${contentType}`;
      }
      
      if (includeNumbers) {
        topicText += ` include numbers`;
      }
      
      if (includeEmotional) {
        topicText += ` make it emotional`;
      }

      const response = await apiRequest("POST", "/api/ai/generate-content", {
        promptText: topicText,
        contentType: "title",
        options: {
          language: "en"
        }
      });

      const data = await response.json();
      const titles = data.generatedContent.split("\n\n").filter((t: string) => t.trim().length > 0);
      setGeneratedTitles(titles);
    } catch (error) {
      console.error("Error generating titles:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearFields = () => {
    setTopic("");
    setKeywords("");
    setGeneratedTitles([]);
    setSelectedTitle("");
  };

  const copyToClipboard = (title: string) => {
    navigator.clipboard.writeText(title);
    setSelectedTitle(title);
    toast({
      title: "Copied!",
      description: "Title copied to clipboard.",
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Title Generator</h1>
              <p className="text-gray-600">Create catchy and SEO-friendly titles for your content.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Title Settings</h3>
                    
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="topic" className="mb-2 block">Topic</Label>
                        <Input
                          id="topic"
                          value={topic}
                          onChange={handleTopicChange}
                          placeholder="Enter your content topic"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="keywords" className="mb-2 block">Keywords (optional)</Label>
                        <Input
                          id="keywords"
                          value={keywords}
                          onChange={handleKeywordsChange}
                          placeholder="Enter keywords separated by commas"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Add keywords to focus your titles on specific terms
                        </p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Content Type</Label>
                        <Select value={contentType} onValueChange={handleContentTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="seo">SEO Focused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="block">Title Style</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeNumbers" 
                            checked={includeNumbers}
                            onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                          />
                          <label
                            htmlFor="includeNumbers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include numbers
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeEmotional" 
                            checked={includeEmotional}
                            onCheckedChange={(checked) => setIncludeEmotional(!!checked)}
                          />
                          <label
                            htmlFor="includeEmotional"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include emotional words
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col space-y-3">
                      <Button 
                        onClick={handleGenerateTitles} 
                        disabled={isGenerating || !topic.trim()} 
                        className="bg-primary hover:bg-blue-700"
                      >
                        {isGenerating ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-heading mr-2"></i>
                            <span>Generate Titles</span>
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={clearFields} 
                        variant="outline" 
                        className="border-gray-300"
                      >
                        <i className="fas fa-eraser mr-2"></i>
                        <span>Clear All</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">💡 <strong>Tips for great titles:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Be specific with your topic</li>
                    <li>Use emotional triggers (amazing, essential, etc.)</li>
                    <li>Numbers tend to perform better (e.g. "10 Ways to...")</li>
                    <li>Keep titles under 60 characters for SEO</li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">Generated Titles</h3>
                  <p className="text-sm text-gray-500">
                    Click on a title to copy it to clipboard
                  </p>
                </div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-500">Generating creative titles for you...</p>
                  </div>
                ) : generatedTitles.length > 0 ? (
                  <div className="space-y-3">
                    {generatedTitles.map((title, index) => (
                      <div 
                        key={index}
                        onClick={() => copyToClipboard(title)}
                        className={`p-4 border rounded-lg cursor-pointer transition hover:bg-gray-50 ${selectedTitle === title ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{title}</p>
                          <button className="text-gray-400 hover:text-primary ml-2">
                            <i className="far fa-copy"></i>
                          </button>
                        </div>
                        {selectedTitle === title && (
                          <div className="mt-2 text-xs text-primary">
                            ✓ Copied to clipboard
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <i className="fas fa-heading text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500 mb-2">Generated titles will appear here</p>
                    <p className="text-sm text-gray-400">Enter a topic and click "Generate Titles"</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-lg mb-3">Why Great Titles Matter</h3>
              <p className="text-gray-700 mb-3">
                A compelling title is crucial for getting your content noticed. Great titles can increase your click-through rates by up to 500% and significantly improve social media engagement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="font-medium mb-1 text-blue-600">For SEO</div>
                  <p className="text-sm text-gray-600">
                    Search engines place higher importance on words in titles, making them critical for ranking.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="font-medium mb-1 text-purple-600">For Engagement</div>
                  <p className="text-sm text-gray-600">
                    Emotional titles with power words can increase shares and comments by up to 70%.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="font-medium mb-1 text-green-600">For Conversion</div>
                  <p className="text-sm text-gray-600">
                    A well-crafted title can improve conversion rates by making your offer more compelling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleGenerator;