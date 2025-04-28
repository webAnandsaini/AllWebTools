import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
type EssayLength = "short" | "medium" | "long";
type EssayTone = "formal" | "casual" | "persuasive" | "informative";
type EssayType = "argumentative" | "narrative" | "descriptive" | "expository";
type AcademicLevel = "high_school" | "college" | "university" | "masters";

const AIEssayWriterDetailed = () => {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [essayLength, setEssayLength] = useState<EssayLength>("medium");
  const [tone, setTone] = useState<EssayTone>("formal");
  const [essayType, setEssayType] = useState<EssayType>("argumentative");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("college");
  const [selectedTab, setSelectedTab] = useState("editor");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedEssay, setGeneratedEssay] = useState("");
  const [outlineVisible, setOutlineVisible] = useState(false);
  const [outline, setOutline] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [targetWordCount, setTargetWordCount] = useState(600);
  
  const { toast } = useToast();

  // Update target word count when essay length changes
  useEffect(() => {
    switch (essayLength) {
      case "short":
        setTargetWordCount(400);
        break;
      case "medium":
        setTargetWordCount(600);
        break;
      case "long":
        setTargetWordCount(1000);
        break;
      default:
        setTargetWordCount(600);
    }
  }, [essayLength]);

  // Update word count when essay changes
  useEffect(() => {
    if (generatedEssay) {
      const words = generatedEssay.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [generatedEssay]);

  // Generate essay when user clicks "Generate Essay" button
  const handleGenerateEssay = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your essay.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedEssay("");
    setOutline([]);
    setOutlineVisible(false);

    // First generate an outline
    generateOutline();

    // Simulate AI essay generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the essay
          const mockEssay = generateMockEssay();
          setGeneratedEssay(mockEssay);
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  // Generate essay outline
  const generateOutline = () => {
    // This is a mock implementation for the demonstration
    // In a real app, this would call an AI service API
    
    let outlinePoints: string[] = [];
    
    // Create outline based on essay type
    switch (essayType) {
      case "argumentative":
        outlinePoints = [
          "Introduction and thesis statement",
          "Background information on " + topic,
          "Main argument 1 with supporting evidence",
          "Main argument 2 with supporting evidence",
          "Main argument 3 with supporting evidence",
          "Counterarguments and rebuttals",
          "Conclusion restating thesis and summarizing arguments"
        ];
        break;
        
      case "narrative":
        outlinePoints = [
          "Introduction setting the scene",
          "Background context and character introduction",
          "Rising action - initial events related to " + topic,
          "Climax - the main turning point",
          "Falling action - events following the climax",
          "Resolution and reflection",
          "Conclusion with lessons learned or insights"
        ];
        break;
        
      case "descriptive":
        outlinePoints = [
          "Introduction presenting the subject: " + topic,
          "Overview of the main characteristics",
          "Detailed description of first major aspect",
          "Detailed description of second major aspect",
          "Detailed description of third major aspect",
          "Sensory details and imagery",
          "Conclusion summarizing the overall impression"
        ];
        break;
        
      case "expository":
        outlinePoints = [
          "Introduction explaining the purpose and defining " + topic,
          "Background information and context",
          "First key point with factual evidence",
          "Second key point with factual evidence",
          "Third key point with factual evidence",
          "Analysis of findings or information",
          "Conclusion summarizing the explanation"
        ];
        break;
        
      default:
        outlinePoints = [
          "Introduction to " + topic,
          "Main point 1",
          "Main point 2",
          "Main point 3",
          "Conclusion"
        ];
    }
    
    // Add keywords to outline if provided
    if (keywords) {
      const keywordsList = keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
      
      if (keywordsList.length > 0) {
        // Integrate keywords into outline points
        outlinePoints = outlinePoints.map((point, index) => {
          if (index > 0 && index < outlinePoints.length - 1 && index <= keywordsList.length) {
            return `${point} (incorporating "${keywordsList[index-1]}")`;
          }
          return point;
        });
      }
    }
    
    setOutline(outlinePoints);
    
    // Show outline after a delay to simulate generation
    setTimeout(() => {
      setOutlineVisible(true);
    }, 1500);
  };

  // Generate mock essay based on parameters
  const generateMockEssay = () => {
    // In a real application, this would be an API call to an AI service
    // This is a mock implementation for demonstration
    
    const essayIntros = {
      argumentative: `In the contemporary discourse surrounding ${topic}, a critical examination reveals several compelling arguments worth consideration. This essay will explore the multifaceted dimensions of this subject, presenting a nuanced analysis of the key factors at play. By examining the evidence systematically, this paper aims to demonstrate that ${topic} represents a significant area of concern that demands our attention.`,
      
      narrative: `The first time I encountered ${topic}, I couldn't have imagined how profoundly it would change my perspective. The experience unfolded on an ordinary day that quickly became extraordinary. What follows is an account of that transformative journey and the lasting impact it has had on my understanding of the world around me.`,
      
      descriptive: `${topic} presents itself as a tapestry of intricate details and striking characteristics that captivate the observer's attention. Its unique qualities evoke a sense of wonder and fascination that rewards careful observation. This essay will paint a vivid picture of ${topic}, highlighting its distinctive features and the sensory experience it creates.`,
      
      expository: `${topic} represents a complex phenomenon that warrants careful explanation and analysis. By breaking down its constituent elements and examining their relationships, we can develop a comprehensive understanding of how it functions. This essay will provide a clear explanation of ${topic}, its key components, and the broader implications of its existence.`
    };
    
    const essayConclusions = {
      argumentative: `In conclusion, the evidence presented in this essay strongly supports the position that ${topic} merits serious consideration in contemporary discourse. The arguments examined demonstrate the complexity of the issue and the need for nuanced approaches. As society continues to grapple with this matter, it becomes increasingly important to base our understanding on rigorous analysis rather than superficial assessments.`,
      
      narrative: `Looking back on my experience with ${topic}, I recognize it as a defining moment that has shaped my understanding in unexpected ways. The journey described in this narrative has revealed insights that continue to influence my perspective. Some experiences leave an indelible mark on our consciousness, and my encounter with ${topic} certainly belongs in that category.`,
      
      descriptive: `The remarkable features of ${topic} come together to create an experience that resonates deeply with those who engage with it. Its distinctive qualities combine to form a cohesive whole that is greater than the sum of its parts. Having explored these characteristics in detail, one gains a newfound appreciation for the unique nature of ${topic} and its significance in its broader context.`,
      
      expository: `This examination of ${topic} has illuminated its fundamental characteristics and operational mechanisms. By analyzing its key components and their interrelationships, we have developed a clearer understanding of how it functions. This knowledge provides a foundation for further exploration and practical application, highlighting the importance of ${topic} in its relevant domain.`
    };
    
    // Determine length based on selected essay length
    const paragraphCount = essayLength === "short" ? 5 : essayLength === "medium" ? 7 : 10;
    
    // Generate essay with appropriate tone and academic level
    let paragraphs = [];
    
    // Add introduction
    paragraphs.push(essayIntros[essayType] || essayIntros.expository);
    
    // Add body paragraphs
    for (let i = 1; i < paragraphCount - 1; i++) {
      let paragraph = "";
      
      // Generate paragraph content based on outline points
      if (i < outline.length - 1) {
        const outlinePoint = outline[i].split("(")[0].trim(); // Get outline point without keywords
        paragraph = generateParagraphForOutlinePoint(outlinePoint, i);
      } else {
        paragraph = generateGenericParagraph(i);
      }
      
      // Adjust tone
      paragraph = adjustToneAndLevel(paragraph);
      
      paragraphs.push(paragraph);
    }
    
    // Add conclusion
    paragraphs.push(essayConclusions[essayType] || essayConclusions.expository);
    
    return paragraphs.join("\n\n");
  };

  // Generate a paragraph based on an outline point
  const generateParagraphForOutlinePoint = (point: string, index: number) => {
    // Get keywords if available
    const keywordsList = keywords
      ? keywords.split(",").map(k => k.trim()).filter(k => k.length > 0)
      : [];
    
    const keyword = index <= keywordsList.length ? keywordsList[index - 1] : "";
    
    // Different paragraph structures based on essay type
    switch (essayType) {
      case "argumentative":
        return `${point} presents a crucial perspective on ${topic}. ${keyword ? `Considering the concept of "${keyword}", ` : ""}it becomes evident that this aspect contributes significantly to our understanding of the subject. Research indicates that there is substantial evidence supporting this viewpoint. Critics might challenge this position by pointing to alternative interpretations, but a careful analysis reveals that these counterarguments often lack empirical support. When examining the available data objectively, the strength of this argument becomes increasingly apparent.`;
        
      case "narrative":
        return `As the events related to ${point} unfolded, I found myself increasingly drawn into the experience. ${keyword ? `The presence of "${keyword}" added a new dimension to the situation. ` : ""}The atmosphere was charged with anticipation, and every detail seemed to take on heightened significance. Looking back, I recognize this moment as pivotal in the broader narrative. The reactions of those involved revealed much about human nature and the complexities of interpersonal dynamics. This chapter of the story would prove instrumental in shaping what was to come.`;
        
      case "descriptive":
        return `${point} reveals itself through a rich array of sensory details. ${keyword ? `The element of "${keyword}" stands out prominently in this context. ` : ""}Visually, the patterns and textures create an intricate tapestry that rewards close observation. The subtle interplay of light and shadow enhances the dimensional quality of the subject. These visual characteristics are complemented by other sensory aspects that contribute to a holistic experience. When observed from different perspectives, new details emerge that add depth to one's appreciation of ${topic}.`;
        
      case "expository":
        return `An examination of ${point} provides valuable insights into the nature of ${topic}. ${keyword ? `The concept of "${keyword}" is particularly relevant to this discussion. ` : ""}This component functions as an integral part of the larger system, contributing to its overall effectiveness. Analysis reveals several key factors that influence how this element operates in various contexts. Understanding these mechanisms helps clarify the broader implications of ${topic} and its applications. The functional relationship between this aspect and other components demonstrates the sophisticated organization of the subject under study.`;
        
      default:
        return generateGenericParagraph(index);
    }
  };

  // Generate a generic paragraph when needed
  const generateGenericParagraph = (index: number) => {
    return `Further analysis of ${topic} reveals additional dimensions worth exploring. When considering the broader context, patterns emerge that illuminate the significance of this subject. Various scholars have contributed to our understanding through their research and theoretical frameworks. These perspectives provide valuable tools for interpreting the evidence and drawing meaningful conclusions. As our knowledge continues to evolve, new questions arise that prompt further investigation. This ongoing process of inquiry enriches our comprehension of ${topic} and its implications.`;
  };

  // Adjust essay tone and academic level
  const adjustToneAndLevel = (text: string) => {
    let adjusted = text;
    
    // Adjust for tone
    switch (tone) {
      case "formal":
        adjusted = adjusted
          .replace(/I think/g, "It is evident that")
          .replace(/I believe/g, "It can be asserted that")
          .replace(/In my opinion/g, "Analysis suggests that");
        break;
        
      case "casual":
        adjusted = adjusted
          .replace(/It is evident that/g, "I think")
          .replace(/analysis indicates/gi, "we can see")
          .replace(/demonstrates/g, "shows");
        break;
        
      case "persuasive":
        adjusted = adjusted
          .replace(/might/g, "clearly")
          .replace(/could be/g, "is certainly")
          .replace(/may suggest/g, "strongly indicates");
        break;
        
      case "informative":
        adjusted = adjusted
          .replace(/I argue that/g, "Research shows that")
          .replace(/clearly/g, "potentially")
          .replace(/certainly/g, "typically");
        break;
    }
    
    // Adjust for academic level
    switch (academicLevel) {
      case "high_school":
        adjusted = adjusted
          .replace(/multifaceted/g, "many-sided")
          .replace(/empirical/g, "observed")
          .replace(/theoretical frameworks/g, "ideas");
        break;
        
      case "university":
        adjusted = adjusted
          .replace(/suggests/g, "postulates")
          .replace(/important/g, "significant")
          .replace(/used/g, "utilized");
        break;
        
      case "masters":
        adjusted = adjusted
          .replace(/shows/g, "demonstrates")
          .replace(/think about/g, "conceptualize")
          .replace(/look at/g, "examine critically");
        break;
    }
    
    return adjusted;
  };

  // Clear all input fields and generated content
  const clearFields = () => {
    setTopic("");
    setKeywords("");
    setGeneratedEssay("");
    setOutline([]);
    setOutlineVisible(false);
    setProgress(0);
  };

  // Copy generated essay to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEssay);
    toast({
      title: "Copied to clipboard",
      description: "The essay has been copied to your clipboard",
    });
  };

  // Download essay as a text file
  const downloadEssay = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedEssay], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    
    // Create filename from topic
    const filename = topic
      ? `essay-${topic.substring(0, 20).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
      : "generated-essay.txt";
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Essay downloaded",
      description: `Your essay has been downloaded as "${filename}"`,
    });
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="editor" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Essay Generator</TabsTrigger>
          <TabsTrigger value="tips">Writing Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Essay Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic" className="text-sm font-medium">
                        Essay Topic
                      </Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your essay topic"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="keywords" className="text-sm font-medium">
                        Keywords (optional)
                      </Label>
                      <Input
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter keywords separated by commas"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Include specific keywords to focus your essay
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="essay-type" className="text-sm font-medium">
                          Essay Type
                        </Label>
                        <Select
                          value={essayType}
                          onValueChange={(value) => setEssayType(value as EssayType)}
                        >
                          <SelectTrigger id="essay-type" className="mt-1">
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
                        <Label htmlFor="academic-level" className="text-sm font-medium">
                          Academic Level
                        </Label>
                        <Select
                          value={academicLevel}
                          onValueChange={(value) => setAcademicLevel(value as AcademicLevel)}
                        >
                          <SelectTrigger id="academic-level" className="mt-1">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">High School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="university">University</SelectItem>
                            <SelectItem value="masters">Master's</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tone" className="text-sm font-medium">
                          Writing Tone
                        </Label>
                        <Select
                          value={tone}
                          onValueChange={(value) => setTone(value as EssayTone)}
                        >
                          <SelectTrigger id="tone" className="mt-1">
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
                        <Label htmlFor="length" className="text-sm font-medium">
                          Essay Length
                        </Label>
                        <Select
                          value={essayLength}
                          onValueChange={(value) => setEssayLength(value as EssayLength)}
                        >
                          <SelectTrigger id="length" className="mt-1">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (300-500 words)</SelectItem>
                            <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                            <SelectItem value="long">Long (800-1200 words)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateEssay}
                        disabled={isGenerating || !topic.trim()}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Essay"}
                      </Button>
                      
                      <Button
                        onClick={clearFields}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {outlineVisible && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">Essay Outline</h3>
                      <Badge className="bg-blue-50 text-blue-700">
                        {outline.length} sections
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {outline.map((point, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm">
                            {index + 1}
                          </div>
                          <p className="text-sm mt-1">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">Generated Essay</h3>
                    {!isGenerating && generatedEssay && (
                      <div className="flex items-center space-x-1">
                        <Badge 
                          className={
                            wordCount < targetWordCount * 0.8 ? "bg-amber-50 text-amber-700" : 
                            wordCount > targetWordCount * 1.2 ? "bg-purple-50 text-purple-700" : 
                            "bg-green-50 text-green-700"
                          }
                        >
                          {wordCount} words
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {isGenerating ? (
                    <div className="space-y-4">
                      <Progress value={progress} className="w-full h-2" />
                      <div className="px-8 py-12 text-center">
                        <div className="text-sm text-gray-500 mb-2">
                          {progress < 30 ? "Researching topic..." : 
                           progress < 50 ? "Creating essay structure..." : 
                           progress < 80 ? "Writing content..." : 
                           "Refining and finalizing essay..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Textarea
                        value={generatedEssay}
                        onChange={(e) => setGeneratedEssay(e.target.value)}
                        placeholder="Your essay will appear here after generation..."
                        className="min-h-[400px] font-serif text-base leading-relaxed"
                      />
                      
                      {generatedEssay && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="text-blue-600"
                          >
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            onClick={downloadEssay}
                            variant="outline"
                            className="text-green-600"
                          >
                            Download as Text
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!isGenerating && !generatedEssay && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use AI Essay Writer</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Enter a descriptive topic for your essay in the "Essay Topic" field</li>
                      <li>Add optional keywords to guide the essay's focus</li>
                      <li>Select the essay type, academic level, tone, and desired length</li>
                      <li>Click "Generate Essay" and wait for the AI to create your content</li>
                      <li>Review and edit the generated essay to ensure it meets your needs</li>
                      <li>Copy or download your essay when satisfied with the result</li>
                    </ol>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Essay Types Explained</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base">Argumentative</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Presents a claim or position and supports it with evidence and reasoning. Great for debate topics, controversial issues, or policy discussions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Narrative</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Tells a story or recounts an experience, often in chronological order. Ideal for personal experiences, creative writing, or illustrating concepts through storytelling.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Descriptive</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Focuses on creating a vivid picture of a person, place, object, or experience using rich sensory details. Perfect for creative assignments or detailed analyses.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Expository</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Explains a topic or concept clearly and objectively. Best for informational pieces, how-to essays, or concept explanations without personal opinion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Effective Writing Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Always edit AI-generated content to add your unique voice and perspective</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Verify any facts, statistics, or citations provided by the AI</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Use specific, detailed topics rather than broad ones for better results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Include keywords related to your specific assignment requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Review for coherence and logical flow between paragraphs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Consider the generated essay as a starting point, not a final draft</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Adjust the academic level to match your course requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Academic Integrity Guidelines</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Using AI tools responsibly:</strong> While AI essay writers can be valuable tools for learning and drafting, submitting AI-generated content as your own work without substantial editing and original contribution may violate academic integrity policies at many institutions.
                  </p>
                  <p>
                    <strong>Recommended uses:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Overcome writer's block and generate initial ideas</li>
                    <li>Help structure your thoughts on complex topics</li>
                    <li>Learn effective writing patterns and structures</li>
                    <li>Use as a starting draft that you significantly revise</li>
                    <li>Practice editing and improving content</li>
                  </ul>
                  <p>
                    Always consult your instructor or institution's policies regarding the use of AI writing tools for academic assignments.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Essay Structure Guide</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-base">Introduction</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Hook the reader, provide context, and present your thesis statement. Should be 10-15% of your total essay length.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Body Paragraphs</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Each paragraph should focus on a single main idea with a topic sentence, supporting evidence, analysis, and a transition to the next point. Make up 70-80% of your essay.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Conclusion</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Restate your thesis, summarize main points, and end with a thought-provoking statement or call to action. Should be 10-15% of your total essay length.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium text-base">Paragraph Structure (PEEL)</h4>
                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                      <li><strong>P</strong>oint: State your main idea</li>
                      <li><strong>E</strong>vidence: Provide supporting facts or examples</li>
                      <li><strong>E</strong>xplain: Analyze how your evidence supports the point</li>
                      <li><strong>L</strong>ink: Connect to your thesis or the next paragraph</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Create high-quality academic essays on any topic with our AI-powered essay generator.";
  
  const description = `
    Our AI Essay Writer is a sophisticated tool designed to help students, researchers, and professionals craft well-structured, thoughtful essays on virtually any topic. Using advanced artificial intelligence, this tool analyzes your specified topic and parameters to generate comprehensive, coherent essays tailored to your exact requirements.
    
    Whether you need an argumentative essay that presents a compelling case with supporting evidence, a narrative essay that tells an engaging story, a descriptive essay rich with sensory details, or an expository essay that clearly explains complex concepts, our AI Essay Writer delivers content that meets academic standards across educational levels from high school to master's degree.
    
    The tool offers extensive customization options, allowing you to specify not only your topic but also the desired tone (formal, casual, persuasive, or informative), essay length, and academic level. You can further refine your results by including specific keywords you want incorporated into the essay. The AI will create a logical outline for your essay before generating the complete text, ensuring well-organized content with proper introduction, body paragraphs, and conclusion.
    
    While producing high-quality content, the AI Essay Writer serves as an excellent starting point for your writing process. It can help overcome writer's block, provide structure for your thoughts, demonstrate effective writing patterns, and give you a solid foundation to refine with your personal insights and voice. The generated essays include properly structured paragraphs, relevant arguments, and natural transitions between ideas.
  `;

  const howToUse = [
    "Enter your essay topic in the text field, being as specific as possible for optimal results.",
    "Add optional keywords separated by commas to guide the essay's focus on particular aspects of the topic.",
    "Select the essay type (argumentative, narrative, descriptive, or expository) that best fits your assignment needs.",
    "Choose the appropriate academic level (high school, college, university, or master's) to match your requirements.",
    "Specify your preferred writing tone (formal, casual, persuasive, or informative) and desired essay length.",
    "Click the 'Generate Essay' button and wait for the AI to create your essay and outline.",
    "Review the generated content, make any necessary edits or additions to personalize it, and use the copy or download buttons to save your work."
  ];

  const features = [
    "Four essay types (argumentative, narrative, descriptive, expository) to accommodate different writing assignments",
    "Customizable academic levels from high school to master's degree with appropriate vocabulary and complexity",
    "Multiple tone options including formal, casual, persuasive, and informative to suit various contexts",
    "Automatic outline generation to ensure well-structured, logically organized content",
    "Real-time word count tracking with target ranges based on selected essay length",
    "Built-in writing tips and academic integrity guidelines for responsible use"
  ];

  const faqs = [
    {
      question: "Is it ethical to use an AI Essay Writer for academic assignments?",
      answer: "The ethical use of AI writing tools depends on how they're employed. Using the AI Essay Writer as a learning aid, research assistant, or to help overcome writer's block is generally acceptable. However, submitting AI-generated content as entirely your own work without substantial editing, critical thinking, and original contribution would be considered academically dishonest at most institutions. We recommend using our tool to generate initial drafts that you then significantly revise, enhance with your own research and insights, and properly cite if required by your instructor. Always consult your institution's specific policies regarding AI-assisted writing."
    },
    {
      question: "How can I make the AI-generated essay more original and personal?",
      answer: "To personalize and improve AI-generated essays: 1) Add your unique experiences, examples, and perspectives that only you would know; 2) Incorporate current and specific research from credible sources with proper citations; 3) Adjust the language and phrasing to match your natural writing style; 4) Critically evaluate the AI's arguments and reasoning, strengthening weak points and adding nuance; 5) Reorganize sections if needed to improve flow and logic; 6) Add transitions that connect ideas in your own voice; and 7) Consider the essay a collaborative first draft rather than a finished product. The more you contribute your own thinking and voice, the more original the final essay will be."
    },
    {
      question: "What's the difference between the different essay types, and which should I choose?",
      answer: "Select your essay type based on your assignment's purpose: Choose Argumentative essays when you need to present and defend a specific position with evidence and reasoning—ideal for controversial topics or policy discussions. Narrative essays tell a story or recount an experience, usually in chronological order—perfect for personal reflections or creative assignments. Descriptive essays create a vivid picture of a subject using sensory details and imagery—great for bringing places, people, or objects to life. Expository essays explain or inform about a topic objectively without personal opinion—best for explaining concepts, processes, or ideas clearly. If your assignment doesn't specify a type, consider what your instructor is asking you to accomplish (persuade, explain, describe, or narrate) and choose accordingly."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="ai-essay-writer"
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

export default AIEssayWriterDetailed;