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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Types for paragraph generation
type ParagraphType = "descriptive" | "narrative" | "expository" | "persuasive" | "technical" | "creative";
type ParagraphTone = "formal" | "casual" | "professional" | "friendly" | "enthusiastic" | "neutral";

const ParagraphGeneratorDetailed = () => {
  // State for inputs
  const [topic, setTopic] = useState("");
  const [paragraphType, setParagraphType] = useState<ParagraphType>("descriptive");
  const [tone, setTone] = useState<ParagraphTone>("professional");
  const [keywords, setKeywords] = useState("");
  const [wordCount, setWordCount] = useState(150);
  const [includeEvidence, setIncludeEvidence] = useState(false);
  const [includeTransition, setIncludeTransition] = useState(true);
  const [activeTab, setActiveTab] = useState("generator");
  
  // State for output and processing
  const [generatedParagraph, setGeneratedParagraph] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputWordCount, setOutputWordCount] = useState(0);
  
  const { toast } = useToast();

  // Update output word count when generated paragraph changes
  useEffect(() => {
    if (generatedParagraph) {
      const words = generatedParagraph.trim().split(/\s+/).filter(word => word.length > 0);
      setOutputWordCount(words.length);
    } else {
      setOutputWordCount(0);
    }
  }, [generatedParagraph]);

  // Generate paragraph when user clicks button
  const handleGenerateParagraph = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate a paragraph.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedParagraph("");

    // Simulate paragraph generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the paragraph
          const paragraph = generateMockParagraph();
          setGeneratedParagraph(paragraph);
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Generate paragraph based on user parameters
  const generateMockParagraph = (): string => {
    // In a real application, this would be an API call to an AI service
    // This is a mock implementation for demonstration purposes
    
    // Process keywords if provided
    const keywordsList = keywords
      ? keywords.split(",").map(k => k.trim()).filter(k => k.length > 0)
      : [];
    
    // Generate topic sentence
    let paragraph = generateTopicSentence();
    
    // Add supporting sentences
    paragraph += generateSupportingSentences(keywordsList);
    
    // Add evidence if selected
    if (includeEvidence) {
      paragraph += generateEvidence();
    }
    
    // Add transition sentence if selected
    if (includeTransition) {
      paragraph += generateTransitionSentence();
    }
    
    // Add concluding sentence
    paragraph += generateConcludingSentence();
    
    // Apply tone adjustments
    paragraph = adjustParagraphTone(paragraph);
    
    return paragraph;
  };

  // Generate a topic sentence based on the paragraph type
  const generateTopicSentence = (): string => {
    switch (paragraphType) {
      case "descriptive":
        return `${topic} presents a remarkable combination of features that immediately capture one's attention. `;
        
      case "narrative":
        return `The first time I encountered ${topic}, it left an impression that would stay with me for years to come. `;
        
      case "expository":
        return `${topic} can be understood as a complex phenomenon with several key characteristics worth examining. `;
        
      case "persuasive":
        return `There are compelling reasons to consider ${topic} as an essential element that deserves our immediate attention. `;
        
      case "technical":
        return `The technical analysis of ${topic} reveals several critical components that function as an integrated system. `;
        
      case "creative":
        return `In the realm where ${topic} exists, reality bends and transforms into something extraordinary and unexpected. `;
        
      default:
        return `${topic} represents an interesting subject with multiple dimensions worth exploring. `;
    }
  };

  // Generate supporting sentences with incorporated keywords
  const generateSupportingSentences = (keywordsList: string[]): string => {
    let sentences = "";
    
    switch (paragraphType) {
      case "descriptive":
        sentences += `Its distinctive qualities stand out against the backdrop of similar entities, creating a unique profile. `;
        sentences += `The various elements combine to form a harmonious whole that appeals to multiple senses. `;
        
        if (keywordsList.length > 0) {
          sentences += `Particularly noteworthy is the aspect of ${keywordsList[0]}, which contributes significantly to its overall character. `;
        }
        
        sentences += `The interplay of these characteristics creates a memorable impression that lingers in one's mind. `;
        break;
        
      case "narrative":
        sentences += `What began as an ordinary encounter quickly transformed into something significant. `;
        sentences += `The circumstances surrounding this experience were unique in ways I couldn't have anticipated. `;
        
        if (keywordsList.length > 0) {
          sentences += `The element of ${keywordsList[0]} stood out prominently in this unfolding story. `;
        }
        
        sentences += `As events progressed, the significance of this experience became increasingly clear. `;
        break;
        
      case "expository":
        sentences += `Research indicates several key factors that contribute to our understanding of this subject. `;
        sentences += `Analysis of available data reveals patterns that help explain its fundamental nature. `;
        
        if (keywordsList.length > 0) {
          sentences += `The concept of ${keywordsList[0]} provides particular insight into how this phenomenon operates. `;
        }
        
        sentences += `These findings are consistent across multiple studies and contexts, suggesting their validity. `;
        break;
        
      case "persuasive":
        sentences += `The evidence supporting this position is substantial and comes from multiple reliable sources. `;
        sentences += `Those who have implemented this approach report significant positive outcomes across various metrics. `;
        
        if (keywordsList.length > 0) {
          sentences += `The aspect of ${keywordsList[0]} demonstrates particularly strong benefits that cannot be ignored. `;
        }
        
        sentences += `Critics who dismiss these advantages often fail to consider the comprehensive body of evidence available. `;
        break;
        
      case "technical":
        sentences += `The primary mechanisms involve a sequence of operations that maintain system integrity and efficiency. `;
        sentences += `Performance metrics indicate optimal functionality within specified parameters and conditions. `;
        
        if (keywordsList.length > 0) {
          sentences += `The technical element of ${keywordsList[0]} serves as a critical component in maintaining operational stability. `;
        }
        
        sentences += `Documentation of these specifications facilitates consistent implementation across different environments. `;
        break;
        
      case "creative":
        sentences += `Colors and shadows dance in patterns that defy conventional understanding yet feel strangely familiar. `;
        sentences += `The boundaries between what is and what could be blur into a tapestry of possibilities. `;
        
        if (keywordsList.length > 0) {
          sentences += `The essence of ${keywordsList[0]} weaves through this experience like a golden thread binding disparate elements. `;
        }
        
        sentences += `Time seems to follow different rules here, expanding and contracting according to its own mysterious logic. `;
        break;
        
      default:
        sentences += `Several aspects of this topic merit closer examination and consideration. `;
        sentences += `The interrelationships between various elements create a complex but comprehensible system. `;
        
        if (keywordsList.length > 0) {
          sentences += `The dimension of ${keywordsList[0]} plays a particularly important role in this context. `;
        }
        
        sentences += `Understanding these relationships provides valuable insight into the broader implications. `;
    }
    
    return sentences;
  };

  // Generate evidence sentence if that option is selected
  const generateEvidence = (): string => {
    switch (paragraphType) {
      case "descriptive":
        return `Detailed observations conducted over extended periods confirm the consistency of these characteristics across different conditions. `;
        
      case "narrative":
        return `Accounts from others who shared this experience corroborate the sequence of events and their significance. `;
        
      case "expository":
        return `Statistical analysis of collected data indicates a correlation coefficient of 0.78, suggesting a strong relationship between these variables. `;
        
      case "persuasive":
        return `A recent study published in a peer-reviewed journal found that 87% of participants reported positive outcomes after implementation. `;
        
      case "technical":
        return `Performance testing under standard conditions demonstrated a 42% improvement in efficiency compared to previous systems. `;
        
      case "creative":
        return `Witnesses to this phenomenon have described remarkably similar experiences despite having no prior contact or shared context. `;
        
      default:
        return `Evidence gathered from multiple sources supports these observations and their implications. `;
    }
  };

  // Generate transition sentence if that option is selected
  const generateTransitionSentence = (): string => {
    switch (paragraphType) {
      case "descriptive":
        return `Beyond these immediate characteristics, there are deeper aspects that reveal themselves with careful attention. `;
        
      case "narrative":
        return `What happened next would reshape my understanding of not just this experience, but related situations as well. `;
        
      case "expository":
        return `These findings lead to several important implications for how we understand related phenomena. `;
        
      case "persuasive":
        return `Given these compelling advantages, the question becomes not whether to adopt this approach, but how quickly to implement it. `;
        
      case "technical":
        return `These specifications provide the foundation for examining additional components and their integration. `;
        
      case "creative":
        return `As this reality shifts, new patterns emerge that connect to broader themes and unexpected territories. `;
        
      default:
        return `This understanding leads us to consider additional aspects and implications of the topic. `;
    }
  };

  // Generate concluding sentence
  const generateConcludingSentence = (): string => {
    switch (paragraphType) {
      case "descriptive":
        return `Together, these features create a distinctive profile that differentiates ${topic} from similar entities and contributes to its unique identity.`;
        
      case "narrative":
        return `This encounter with ${topic} ultimately served as a turning point that continues to influence my perspective even now.`;
        
      case "expository":
        return `These aspects of ${topic} provide a framework for understanding its functions and significance within its broader context.`;
        
      case "persuasive":
        return `The advantages of embracing ${topic} are clear, substantial, and available to those who recognize its value and potential.`;
        
      case "technical":
        return `The technical architecture of ${topic} represents an optimized approach that balances functionality, efficiency, and adaptability.`;
        
      case "creative":
        return `In this space where ${topic} exists, imagination and reality merge into something that transcends ordinary understanding.`;
        
      default:
        return `This examination of ${topic} highlights its significant aspects and their relevance to broader concepts and applications.`;
    }
  };

  // Adjust paragraph based on selected tone
  const adjustParagraphTone = (text: string): string => {
    let adjusted = text;
    
    switch (tone) {
      case "formal":
        adjusted = adjusted
          .replace(/I think/gi, "It is proposed that")
          .replace(/I believe/gi, "It is suggested that")
          .replace(/a lot/gi, "significantly")
          .replace(/lots of/gi, "numerous")
          .replace(/really/gi, "notably")
          .replace(/very/gi, "substantially")
          .replace(/big/gi, "substantial")
          .replace(/small/gi, "minimal");
        break;
        
      case "casual":
        adjusted = adjusted
          .replace(/it is proposed that/gi, "I think")
          .replace(/it is suggested that/gi, "I believe")
          .replace(/significantly/gi, "a lot")
          .replace(/numerous/gi, "lots of")
          .replace(/subsequently/gi, "then")
          .replace(/furthermore/gi, "also")
          .replace(/consequently/gi, "so")
          .replace(/therefore/gi, "so");
        break;
        
      case "professional":
        adjusted = adjusted
          .replace(/think/gi, "assess")
          .replace(/believe/gi, "determine")
          .replace(/look at/gi, "examine")
          .replace(/use/gi, "utilize")
          .replace(/make/gi, "develop")
          .replace(/big/gi, "significant")
          .replace(/small/gi, "minimal")
          .replace(/good/gi, "effective")
          .replace(/bad/gi, "problematic");
        break;
        
      case "friendly":
        adjusted = adjusted
          .replace(/examine/gi, "take a look at")
          .replace(/analyze/gi, "check out")
          .replace(/however/gi, "but")
          .replace(/therefore/gi, "so")
          .replace(/additionally/gi, "also")
          .replace(/consequently/gi, "because of this")
          .replace(/investigate/gi, "look into")
          .replace(/utilize/gi, "use");
        break;
        
      case "enthusiastic":
        adjusted = adjusted
          .replace(/good/gi, "excellent")
          .replace(/important/gi, "essential")
          .replace(/interesting/gi, "fascinating")
          .replace(/helpful/gi, "invaluable")
          .replace(/significant/gi, "crucial")
          .replace(/useful/gi, "indispensable");
          
        // Add some exclamation points
        adjusted = adjusted.replace(/\./g, (match) => {
          return Math.random() < 0.3 ? "!" : match;
        });
        break;
        
      case "neutral":
        adjusted = adjusted
          .replace(/excellent/gi, "good")
          .replace(/fascinating/gi, "interesting")
          .replace(/invaluable/gi, "helpful")
          .replace(/crucial/gi, "important")
          .replace(/indispensable/gi, "useful")
          .replace(/amazing/gi, "notable")
          .replace(/terrible/gi, "problematic");
          
        // Remove excessive qualifiers
        adjusted = adjusted
          .replace(/very /gi, "")
          .replace(/really /gi, "")
          .replace(/extremely /gi, "");
        break;
    }
    
    return adjusted;
  };

  // Clear all fields and reset state
  const clearFields = () => {
    setTopic("");
    setKeywords("");
    setGeneratedParagraph("");
    setProgress(0);
  };

  // Copy generated paragraph to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedParagraph);
    toast({
      title: "Copied to clipboard",
      description: "Paragraph has been copied to your clipboard",
    });
  };

  // Download paragraph as a text file
  const downloadParagraph = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedParagraph], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    
    // Create filename from topic
    const filename = topic
      ? `paragraph-${topic.substring(0, 20).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
      : "generated-paragraph.txt";
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Paragraph downloaded",
      description: `Your paragraph has been downloaded as "${filename}"`,
    });
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="generator" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Paragraph Generator</TabsTrigger>
          <TabsTrigger value="examples">Examples & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Paragraph Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic" className="text-sm font-medium">
                        Topic or Main Idea
                      </Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your paragraph topic"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Be specific for better results (e.g., "Benefits of daily meditation" instead of just "Meditation")
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paragraph-type" className="text-sm font-medium">
                          Paragraph Type
                        </Label>
                        <Select
                          value={paragraphType}
                          onValueChange={(value) => setParagraphType(value as ParagraphType)}
                        >
                          <SelectTrigger id="paragraph-type" className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="descriptive">Descriptive</SelectItem>
                            <SelectItem value="narrative">Narrative</SelectItem>
                            <SelectItem value="expository">Expository</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tone" className="text-sm font-medium">
                          Writing Tone
                        </Label>
                        <Select
                          value={tone}
                          onValueChange={(value) => setTone(value as ParagraphTone)}
                        >
                          <SelectTrigger id="tone" className="mt-1">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                        Include specific terms you want incorporated in the paragraph
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="word-count" className="text-sm font-medium">
                          Target Word Count: {wordCount}
                        </Label>
                        <span className="text-xs text-gray-500">
                          {wordCount < 100 ? "Short" : 
                          wordCount < 200 ? "Medium" : "Long"}
                        </span>
                      </div>
                      <Slider
                        id="word-count"
                        value={[wordCount]}
                        min={50}
                        max={300}
                        step={25}
                        onValueChange={(value) => setWordCount(value[0])}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-evidence" 
                          checked={includeEvidence}
                          onCheckedChange={(checked) => setIncludeEvidence(checked as boolean)}
                        />
                        <Label htmlFor="include-evidence" className="text-sm">
                          Include evidence/examples
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-transition" 
                          checked={includeTransition}
                          onCheckedChange={(checked) => setIncludeTransition(checked as boolean)}
                        />
                        <Label htmlFor="include-transition" className="text-sm">
                          Include transition sentence
                        </Label>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateParagraph}
                        disabled={isGenerating || !topic.trim()}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Paragraph"}
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
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-3">Current Selection</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paragraph Type:</span>
                      <Badge className="bg-blue-50 text-blue-700">
                        {paragraphType.charAt(0).toUpperCase() + paragraphType.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Writing Tone:</span>
                      <Badge className="bg-purple-50 text-purple-700">
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Length:</span>
                      <Badge className="bg-green-50 text-green-700">
                        {wordCount} words
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Structure:</span>
                      <span className="text-gray-700 text-xs">
                        Topic sentence + Supporting content
                        {includeEvidence ? " + Evidence" : ""}
                        {includeTransition ? " + Transition" : ""}
                        + Conclusion
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">Generated Paragraph</h3>
                    {!isGenerating && generatedParagraph && (
                      <div className="flex items-center space-x-1">
                        <Badge className={
                          outputWordCount < wordCount * 0.8 ? "bg-amber-50 text-amber-700" : 
                          outputWordCount > wordCount * 1.2 ? "bg-purple-50 text-purple-700" : 
                          "bg-green-50 text-green-700"
                        }>
                          {outputWordCount} words
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {isGenerating ? (
                    <div className="space-y-4">
                      <Progress value={progress} className="w-full h-2" />
                      <div className="px-8 py-12 text-center">
                        <div className="text-sm text-gray-500 mb-2">
                          {progress < 30 ? "Analyzing topic..." : 
                           progress < 60 ? "Crafting paragraph..." : 
                           "Refining language..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Textarea
                        value={generatedParagraph}
                        onChange={(e) => setGeneratedParagraph(e.target.value)}
                        placeholder="Your paragraph will appear here after generation..."
                        className="min-h-[200px] font-serif text-base leading-relaxed"
                      />
                      
                      {generatedParagraph && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="text-blue-600"
                          >
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            onClick={downloadParagraph}
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
              
              {!isGenerating && !generatedParagraph && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use Paragraph Generator</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Enter a specific topic for your paragraph in the input field</li>
                      <li>Select the paragraph type that matches your writing purpose</li>
                      <li>Choose a writing tone appropriate for your audience</li>
                      <li>Add optional keywords to guide content focus</li>
                      <li>Set your desired paragraph length using the slider</li>
                      <li>Customize structure options (evidence, transitions)</li>
                      <li>Click "Generate Paragraph" and wait for AI to create your content</li>
                      <li>Edit the generated paragraph as needed</li>
                      <li>Copy or download the finished paragraph</li>
                    </ol>
                  </CardContent>
                </Card>
              )}
              
              {!isGenerating && generatedParagraph && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">Paragraph Structure</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>Topic sentence:</strong> Introduces the main idea of the paragraph.
                      </p>
                      <p>
                        <strong>Supporting sentences:</strong> Develop the main idea with details, examples, or explanations.
                      </p>
                      {includeEvidence && (
                        <p>
                          <strong>Evidence/examples:</strong> Provides specific data, statistics, or examples to support the main point.
                        </p>
                      )}
                      {includeTransition && (
                        <p>
                          <strong>Transition sentence:</strong> Creates a bridge to the next paragraph or idea.
                        </p>
                      )}
                      <p>
                        <strong>Concluding sentence:</strong> Summarizes the paragraph's main point or provides closure.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Paragraph Types Guide</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Descriptive</h4>
                    <p className="mt-1">
                      Creates a vivid picture using sensory details (sight, sound, touch, taste, smell). Good for describing places, people, objects, or experiences. Uses rich adjectives and imagery.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Narrative</h4>
                    <p className="mt-1">
                      Tells a story or relates an experience, often in chronological order. Includes characters, setting, conflict, and resolution elements. Uses first or third person perspective.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Expository</h4>
                    <p className="mt-1">
                      Explains or informs about a topic in a clear, objective manner. Presents facts, statistics, examples, or definitions. Focuses on clarity and logical organization.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Persuasive</h4>
                    <p className="mt-1">
                      Attempts to convince the reader of a position or action. Includes strong arguments, evidence, and appeals to logic or emotion. Often addresses counterarguments.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Technical</h4>
                    <p className="mt-1">
                      Focuses on specialized information, processes, or systems. Uses precise terminology and structured explanation. Emphasizes clarity and accuracy for specific audiences.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Creative</h4>
                    <p className="mt-1">
                      Uses imaginative language, metaphors, and unique perspectives. Offers freedom for artistic expression and unconventional approaches. May blend elements of other paragraph types.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Example Paragraphs</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-600">Descriptive Example</h4>
                    <p className="text-gray-700 mt-1 italic">
                      The ancient oak tree stands as a majestic sentinel at the edge of the meadow. Its massive trunk, gnarled and weathered by centuries of seasons, rises from the earth like a natural monument. Branches extend outward in a complex canopy, creating a patchwork of sunlight and shadow on the ground below. In spring, tender green leaves emerge to dance in the breeze, while autumn transforms them into a brilliant display of amber and gold. Birds nest in its protective embrace, and the rough bark bears silent witness to generations of human passers-by who have sought rest in its shade.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-600">Expository Example</h4>
                    <p className="text-gray-700 mt-1 italic">
                      Photosynthesis is the biochemical process through which plants convert sunlight into chemical energy. This essential process begins when chlorophyll molecules in the plant's cells absorb light energy, typically from the blue and red wavelengths of the visible spectrum. This captured energy facilitates the conversion of carbon dioxide and water into glucose and oxygen. The glucose serves as the plant's primary energy source, fueling growth and cellular functions, while oxygen is released as a byproduct. This process not only sustains plant life but also produces much of the oxygen in Earth's atmosphere, making it fundamental to most life forms on our planet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Writing Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Focus on a single main idea per paragraph to maintain clarity and coherence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Start with a clear topic sentence that states the main point or purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Use transitional words and phrases to connect ideas smoothly (however, furthermore, consequently, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Support main points with specific evidence, examples, or explanations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Vary sentence structure and length to create rhythm and maintain reader interest</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Use strong, specific vocabulary appropriate for your audience and purpose</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">End with a concluding sentence that reinforces the main idea or provides closure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">PEEL Paragraph Structure</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    The PEEL structure is a powerful framework for crafting effective paragraphs, especially in academic and professional writing:
                  </p>
                  
                  <div>
                    <h4 className="font-medium text-purple-600">P - Point</h4>
                    <p className="mt-1">
                      Start with a clear topic sentence that states the main idea or argument of the paragraph. This sentence should be concise and directly related to your overall thesis.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-600">E - Evidence</h4>
                    <p className="mt-1">
                      Support your point with relevant evidence such as facts, statistics, examples, or quotations from credible sources. This strengthens your argument and shows you've done your research.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-600">E - Explanation</h4>
                    <p className="mt-1">
                      Explain how your evidence supports your point. Analyze the evidence and clarify its significance to your argument. Don't assume the connection is obvious to the reader.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-600">L - Link</h4>
                    <p className="mt-1">
                      Connect back to your overall thesis or link to the next paragraph. This creates coherence in your writing and helps guide the reader through your argument.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Generate well-structured, coherent paragraphs on any topic with our intelligent AI paragraph creator.";
  
  const description = `
    Our Paragraph Generator is a sophisticated tool designed to help writers, students, and professionals create high-quality, well-structured paragraphs on virtually any topic. By leveraging advanced artificial intelligence, this specialized text generation tool produces coherent, focused paragraphs tailored to your specific requirements in seconds.
    
    Whether you need a descriptive paragraph rich with sensory details, a narrative paragraph that tells a compelling story, an expository paragraph that clearly explains a concept, a persuasive paragraph that makes a strong argument, a technical paragraph that presents specialized information, or a creative paragraph that showcases imaginative language, our tool delivers exceptional results customized to your needs.
    
    The generator offers comprehensive customization options that give you complete control over your paragraph's characteristics. You can specify not only your topic but also the type of paragraph, writing tone, desired length, and structural elements like evidence and transitions. The keyword feature ensures that important terms are seamlessly incorporated into your paragraph, while the six different tone options—formal, casual, professional, friendly, enthusiastic, and neutral—guarantee that the writing style perfectly matches your intended audience and context.
    
    Each generated paragraph follows proper structure with a clear topic sentence, supporting details, and conclusion, creating a cohesive unit of thought that effectively communicates your main idea. The tool is invaluable for overcoming writer's block, drafting content efficiently, or providing a solid foundation that you can further refine with your personal touch. Whether for academic assignments, business communications, creative writing projects, or website content, our Paragraph Generator helps you produce polished, effective paragraphs in a fraction of the time it would take to write them from scratch.
  `;

  const howToUse = [
    "Enter a specific topic for your paragraph in the input field (e.g., 'Benefits of regular exercise' rather than just 'Exercise').",
    "Select the paragraph type that best suits your purpose: descriptive, narrative, expository, persuasive, technical, or creative.",
    "Choose an appropriate writing tone for your audience and context from the six available options.",
    "Add optional keywords separated by commas to ensure specific terms are incorporated into your paragraph.",
    "Adjust the target word count using the slider to determine the approximate length of your paragraph.",
    "Toggle the evidence/examples option if you want your paragraph to include supporting data or specific instances.",
    "Toggle the transition sentence option if you want to include a sentence that bridges to the next paragraph or idea.",
    "Click 'Generate Paragraph' and wait for the AI to create your customized paragraph.",
    "Review the generated paragraph and make any necessary edits or refinements to personalize it.",
    "Use the copy or download buttons to save your finished paragraph for use in your document."
  ];

  const features = [
    "Six versatile paragraph types (descriptive, narrative, expository, persuasive, technical, creative) to match any writing purpose",
    "Multiple writing tone options including formal, casual, professional, friendly, enthusiastic, and neutral for perfect audience alignment",
    "Adjustable paragraph length with a word count slider for precise control over content size",
    "Optional evidence and transition toggles to customize paragraph structure based on your specific needs",
    "Keyword integration feature to ensure important terms are incorporated naturally into the paragraph",
    "Proper paragraph structure with topic sentence, supporting details, and conclusion for coherent communication",
    "PEEL structure guidance (Point, Evidence, Explanation, Link) for academic and professional writing contexts"
  ];

  const faqs = [
    {
      question: "What makes a good paragraph, and how does the Paragraph Generator help achieve this?",
      answer: "A good paragraph has several key characteristics: unity (focuses on one main idea), coherence (ideas flow logically), adequate development (supports the main idea with sufficient detail), and proper structure (includes a topic sentence, supporting details, and concluding sentence). Our Paragraph Generator ensures these qualities by creating content with a clear topic sentence that introduces the main idea, several well-connected supporting sentences that develop this idea with details or examples, optional evidence to strengthen the point, optional transition sentences to improve flow, and a concluding sentence that reinforces the main idea. The tool also allows you to customize the paragraph type, tone, length, and structure to match your specific writing context, ensuring the paragraph not only follows proper form but also effectively serves your unique communication purpose."
    },
    {
      question: "How can I customize the paragraphs for different writing contexts?",
      answer: "Our Paragraph Generator offers multiple customization options to tailor content to specific writing contexts: First, select the paragraph type that matches your purpose—descriptive for vivid imagery, narrative for storytelling, expository for explaining concepts, persuasive for arguments, technical for specialized information, or creative for imaginative expression. Then choose a writing tone appropriate for your audience—formal for academic or official contexts, professional for business settings, casual or friendly for conversational pieces, enthusiastic for engaging content, or neutral for balanced coverage. Adjust the word count to fit your document's requirements. Toggle structural elements like evidence inclusion for academic or analytical writing, and transition sentences for multi-paragraph documents. Finally, add keywords to ensure specific terminology is incorporated naturally. After generation, you can further edit the paragraph to add your personal voice or specialized context."
    },
    {
      question: "Can I use the generated paragraphs for academic assignments?",
      answer: "Generated paragraphs can serve as valuable starting points for academic assignments, but should be used responsibly according to your institution's academic integrity policies. Most educational institutions require original work and consider submitting AI-generated content without substantial modification to be a form of academic dishonesty. For appropriate academic use: 1) Use the generator to overcome writer's block or create a structural template; 2) Heavily revise and expand the generated content with your own analysis, research, and insights; 3) Add proper citations and references for any factual information; 4) Ensure the final submission reflects your understanding and voice; 5) When in doubt, consult your instructor regarding acceptable use of AI writing tools. The tool is particularly valuable for brainstorming, organizing thoughts, learning paragraph structure principles, and practicing editing skills—all of which contribute to developing your writing abilities."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="paragraph-generator"
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

export default ParagraphGeneratorDetailed;