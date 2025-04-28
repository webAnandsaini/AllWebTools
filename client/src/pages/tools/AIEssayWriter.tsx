import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

type EssayLength = "short" | "medium" | "long";
type EssayTone = "formal" | "casual" | "persuasive" | "informative";
type EssayType = "argumentative" | "narrative" | "descriptive" | "expository";
type AcademicLevel = "high_school" | "college" | "university" | "masters";

const AIEssayWriter = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [essayLength, setEssayLength] = useState<EssayLength>("medium");
  const [tone, setTone] = useState<EssayTone>("formal");
  const [essayType, setEssayType] = useState<EssayType>("argumentative");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("college");
  
  const [generatedEssay, setGeneratedEssay] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "AI Essay Writer - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (generatedEssay) {
      const words = generatedEssay.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [generatedEssay]);

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleGenerateEssay = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic is required",
        description: "Please enter a topic for your essay.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedEssay("");

    try {
      const keywordsList = keywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const response = await apiRequest("POST", "/api/ai/generate-content", {
        promptText: topic,
        contentType: "essay",
        options: {
          length: essayLength,
          tone,
          keywords: keywordsList,
          essayType,
          academicLevel,
          language: "en"
        }
      });

      const data = await response.json();
      setGeneratedEssay(data.generatedContent);
    } catch (error) {
      console.error("Error generating essay:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate essay. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearFields = () => {
    setTopic("");
    setKeywords("");
    setGeneratedEssay("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEssay);
    toast({
      title: "Copied!",
      description: "Essay copied to clipboard.",
    });
  };

  const downloadEssay = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedEssay], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `essay-${topic.substring(0, 20).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              <h1 className="text-2xl font-bold mb-2">AI Essay Writer</h1>
              <p className="text-gray-600">Generate professional essays on any topic with AI assistance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Essay Settings</h3>
                    
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="topic" className="mb-2 block">Essay Topic</Label>
                        <Input
                          id="topic"
                          value={topic}
                          onChange={handleTopicChange}
                          placeholder="Enter your essay topic"
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
                          Add keywords to focus your essay on specific points
                        </p>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Essay Type</Label>
                        <Select value={essayType} onValueChange={(value) => setEssayType(value as EssayType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select essay type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="argumentative">Argumentative</SelectItem>
                            <SelectItem value="narrative">Narrative</SelectItem>
                            <SelectItem value="descriptive">Descriptive</SelectItem>
                            <SelectItem value="expository">Expository</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Academic Level</Label>
                        <Select value={academicLevel} onValueChange={(value) => setAcademicLevel(value as AcademicLevel)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="university">University</SelectItem>
                            <SelectItem value="masters">Master's Degree</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Writing Tone</Label>
                        <Select value={tone} onValueChange={(value) => setTone(value as EssayTone)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="informative">Informative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Essay Length: {
                          essayLength === "short" ? "Short (300-500 words)" :
                          essayLength === "medium" ? "Medium (500-800 words)" :
                          "Long (800-1200 words)"
                        }</Label>
                        
                        <Tabs value={essayLength} onValueChange={(value) => setEssayLength(value as EssayLength)}>
                          <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="short">Short</TabsTrigger>
                            <TabsTrigger value="medium">Medium</TabsTrigger>
                            <TabsTrigger value="long">Long</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col space-y-3">
                      <Button 
                        onClick={handleGenerateEssay} 
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
                            <i className="fas fa-pencil-alt mr-2"></i>
                            <span>Generate Essay</span>
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
                  <p className="mb-2">💡 <strong>Writing tips:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Be specific with your topic for better results</li>
                    <li>Use keywords to guide the focus of your essay</li>
                    <li>Always review and edit AI-generated content</li>
                    <li>Choose the appropriate essay type for your purpose</li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Generated Essay</h3>
                  {generatedEssay && (
                    <div className="text-sm text-gray-500">
                      Approximately {wordCount} words
                    </div>
                  )}
                </div>
                
                <Textarea
                  value={generatedEssay}
                  onChange={(e) => setGeneratedEssay(e.target.value)}
                  placeholder={isGenerating ? "Generating your essay..." : "Your essay will appear here. Make sure to enter a topic and click 'Generate Essay'."}
                  className="min-h-[400px] mb-4 font-sans text-base leading-relaxed"
                />
                
                {generatedEssay && (
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={copyToClipboard} variant="secondary">
                      <i className="far fa-copy mr-2"></i>
                      <span>Copy</span>
                    </Button>
                    
                    <Button onClick={downloadEssay} variant="secondary">
                      <i className="fas fa-download mr-2"></i>
                      <span>Download</span>
                    </Button>
                  </div>
                )}
                
                {isGenerating && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                      <p className="text-blue-700 text-sm">
                        Our AI is working on your essay. This may take a minute...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-lg mb-3">About AI Essay Writer</h3>
              <p className="text-gray-700 mb-3">
                Our AI Essay Writer helps you create professional, well-structured essays on any topic. Whether you're working on an academic paper, a persuasive essay, or a creative narrative, our tool can help you generate high-quality content to get started.
              </p>
              <p className="text-gray-700">
                <strong>Important note:</strong> While our AI generates high-quality content, always review, edit, and fact-check AI-generated essays before submitting them for academic or professional purposes. AI-generated content may contain inaccuracies or lack the personal touch of human writing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEssayWriter;