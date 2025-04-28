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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// Types for text generation
type TextPurpose = "general" | "creative" | "technical" | "persuasive" | "informative" | "conversational";
type TextTone = "formal" | "casual" | "professional" | "friendly" | "humorous" | "serious";
type TextLength = "short" | "medium" | "long" | "custom";

const AITextGeneratorDetailed = () => {
  // State for inputs
  const [prompt, setPrompt] = useState("");
  const [purpose, setPurpose] = useState<TextPurpose>("general");
  const [tone, setTone] = useState<TextTone>("professional");
  const [textLength, setTextLength] = useState<TextLength>("medium");
  const [customWordCount, setCustomWordCount] = useState(300);
  const [activeTab, setActiveTab] = useState("editor");
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeConclusion, setIncludeConclusion] = useState(true);
  const [keywords, setKeywords] = useState("");
  
  // State for output and processing
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  
  const { toast } = useToast();

  // Update word count when generated text changes
  useEffect(() => {
    if (generatedText) {
      const words = generatedText.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [generatedText]);

  // Get target word count based on selected length
  const getTargetWordCount = (): number => {
    if (textLength === "custom") {
      return customWordCount;
    }
    
    switch (textLength) {
      case "short": return 150;
      case "medium": return 300;
      case "long": return 600;
      default: return 300;
    }
  };

  // Generate text when user clicks button
  const handleGenerateText = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate text.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedText("");

    // Simulate text generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the text
          const text = generateMockText();
          setGeneratedText(text);
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Generate text based on user parameters
  const generateMockText = (): string => {
    // In a real application, this would be an API call to an AI service
    // This is a mock implementation for demonstration purposes
    
    const targetCount = getTargetWordCount();
    let text = "";
    
    // Add intro if selected
    if (includeIntro) {
      text += generateIntroduction();
      text += "\n\n";
    }
    
    // Add main content
    text += generateMainContent();
    
    // Add conclusion if selected
    if (includeConclusion) {
      text += "\n\n";
      text += generateConclusion();
    }
    
    // Apply tone adjustments
    text = adjustTextTone(text);
    
    return text;
  };

  // Generate introduction based on prompt and purpose
  const generateIntroduction = (): string => {
    const introsByPurpose = {
      general: [
        `The topic of ${prompt} is one that warrants careful consideration and exploration. In examining this subject, various aspects emerge that help us understand its significance and implications.`,
        `When considering ${prompt}, several key points come to mind that deserve attention. This overview aims to provide insight into the most relevant aspects of this topic.`,
        `${prompt} represents an area of interest with multiple dimensions worth exploring. The following discussion highlights important elements related to this subject.`
      ],
      creative: [
        `The world of ${prompt} unfolds like a tapestry of possibilities, each thread weaving a unique story waiting to be discovered. Let's embark on a journey through this fascinating landscape.`,
        `Imagine a realm where ${prompt} shapes the very fabric of reality. This is the canvas upon which we'll paint our thoughts and explorations.`,
        `The first time I encountered ${prompt}, everything changed. The perspective shift was subtle at first, then overwhelming in its implications.`
      ],
      technical: [
        `This technical overview examines ${prompt} from a systematic perspective, analyzing key components and functional relationships. The following sections detail the most significant aspects of this subject.`,
        `${prompt} presents a complex technical challenge that requires detailed analysis. This document outlines the primary considerations and methodologies relevant to this topic.`,
        `The technical examination of ${prompt} involves multiple interconnected factors. This analysis breaks down these elements to provide a comprehensive understanding.`
      ],
      persuasive: [
        `${prompt} represents one of the most compelling opportunities available today. The evidence supporting this position is substantial and worth careful consideration.`,
        `The case for ${prompt} has never been stronger or more urgent than it is right now. Consider the following points that demonstrate why immediate attention to this matter is essential.`,
        `Anyone serious about achieving results cannot afford to overlook ${prompt}. The following discussion presents clear evidence for why this approach deserves your consideration.`
      ],
      informative: [
        `${prompt} encompasses several key aspects that are important to understand. This informative overview presents the most relevant facts and considerations about this topic.`,
        `To properly understand ${prompt}, one must examine several fundamental concepts. The following information provides a comprehensive introduction to this subject.`,
        `This informative summary explores ${prompt} through an evidence-based approach. The sections below outline what current understanding tells us about this topic.`
      ],
      conversational: [
        `So, let's talk about ${prompt}. It's something that's been on my mind lately, and I think it's worth having a conversation about some of the key points.`,
        `Have you ever wondered about ${prompt}? I've been thinking about it quite a bit, and there are some interesting aspects we should discuss.`,
        `I'd like to share some thoughts on ${prompt} if you have a moment. It's a topic with several angles worth exploring together.`
      ]
    };
    
    // Get random introduction for selected purpose
    const intros = introsByPurpose[purpose] || introsByPurpose.general;
    const randomIndex = Math.floor(Math.random() * intros.length);
    
    return intros[randomIndex];
  };

  // Generate main content based on prompt, purpose and keywords
  const generateMainContent = (): string => {
    let content = "";
    const targetCount = getTargetWordCount();
    let paragraphCount = Math.max(3, Math.ceil(targetCount / 100));
    
    // If intro and conclusion are included, reduce paragraph count
    if (includeIntro) paragraphCount--;
    if (includeConclusion) paragraphCount--;
    
    // Process keywords if provided
    const keywordsList = keywords
      ? keywords.split(",").map(k => k.trim()).filter(k => k.length > 0)
      : [];
    
    // Generate paragraphs
    for (let i = 0; i < paragraphCount; i++) {
      const currentKeyword = keywordsList[i % keywordsList.length];
      content += generateParagraph(i, currentKeyword);
      
      if (i < paragraphCount - 1) {
        content += "\n\n";
      }
    }
    
    return content;
  };

  // Generate a single paragraph
  const generateParagraph = (index: number, keyword?: string): string => {
    // Different paragraph structures based on purpose
    switch (purpose) {
      case "general":
        return generateGeneralParagraph(index, keyword);
      case "creative":
        return generateCreativeParagraph(index, keyword);
      case "technical":
        return generateTechnicalParagraph(index, keyword);
      case "persuasive":
        return generatePersuasiveParagraph(index, keyword);
      case "informative":
        return generateInformativeParagraph(index, keyword);
      case "conversational":
        return generateConversationalParagraph(index, keyword);
      default:
        return generateGeneralParagraph(index, keyword);
    }
  };

  // Generate different types of paragraphs based on purpose
  const generateGeneralParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `One important aspect of ${prompt} involves the consideration of various factors that influence outcomes. `;
    } else if (index === 1) {
      paragraph = `When examining ${prompt} more closely, certain patterns emerge that deserve attention. `;
    } else {
      paragraph = `Another dimension of ${prompt} relates to its broader implications and applications. `;
    }
    
    paragraph += `This perspective allows for a more nuanced understanding of the subject matter. `;
    
    if (keyword) {
      paragraph += `The concept of ${keyword} plays a significant role in this context, providing additional insight into how ${prompt} functions in practice. `;
    }
    
    paragraph += `Various sources have documented the relationship between these elements, suggesting a coherent framework for interpretation. `;
    paragraph += `This approach offers valuable tools for analyzing ${prompt} and its effects in different scenarios.`;
    
    return paragraph;
  };

  const generateCreativeParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `The landscape of ${prompt} shifts like sand beneath a desert wind, never quite settling into a definitive form. `;
    } else if (index === 1) {
      paragraph = `Beneath the surface of ${prompt} lies a world of unexpected connections and hidden meanings. `;
    } else {
      paragraph = `The boundaries between reality and imagination blur when exploring the depths of ${prompt}. `;
    }
    
    paragraph += `Each perspective reveals new dimensions previously unseen, like facets of a gem catching light from different angles. `;
    
    if (keyword) {
      paragraph += `${keyword} emerges from this creative exploration like a thread of gold in weathered stone, connecting disparate elements into a coherent whole. `;
    }
    
    paragraph += `The patterns that emerge tell stories beyond words, inviting deeper reflection and engagement. `;
    paragraph += `In this space of possibility, ${prompt} becomes more than a concept—it transforms into a journey of discovery.`;
    
    return paragraph;
  };

  const generateTechnicalParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `The technical architecture of ${prompt} consists of several interconnected components that function as an integrated system. `;
    } else if (index === 1) {
      paragraph = `Implementation considerations for ${prompt} require careful analysis of resource requirements and performance parameters. `;
    } else {
      paragraph = `The functional specifications of ${prompt} must account for various operational scenarios and edge cases. `;
    }
    
    paragraph += `This technical framework provides the necessary structure for effective development and deployment. `;
    
    if (keyword) {
      paragraph += `The technical element ${keyword} serves as a critical component in this architecture, handling specific functionality that enables system cohesion. `;
    }
    
    paragraph += `Documentation of these specifications facilitates consistent implementation across different environments. `;
    paragraph += `Performance metrics for this approach to ${prompt} indicate optimal efficiency when properly configured according to established parameters.`;
    
    return paragraph;
  };

  const generatePersuasiveParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `The compelling evidence supporting ${prompt} cannot be overlooked by anyone serious about achieving optimal results. `;
    } else if (index === 1) {
      paragraph = `Consider for a moment what would happen if you implemented ${prompt} today—the immediate benefits would transform your situation. `;
    } else {
      paragraph = `The cost of ignoring ${prompt} far outweighs any perceived inconvenience of adoption—can you really afford to miss this opportunity? `;
    }
    
    paragraph += `Leading experts consistently recommend this approach based on extensive research and practical application. `;
    
    if (keyword) {
      paragraph += `The aspect of ${keyword} provides particularly strong support for this position, offering tangible advantages that competitors simply cannot match. `;
    }
    
    paragraph += `Countless success stories demonstrate the real-world impact of implementing these principles effectively. `;
    paragraph += `The question isn't whether you should embrace ${prompt}, but rather how quickly you can begin benefiting from its implementation.`;
    
    return paragraph;
  };

  const generateInformativeParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `Research indicates that ${prompt} involves several key components that contribute to its overall function and significance. `;
    } else if (index === 1) {
      paragraph = `Statistical analysis of ${prompt} reveals important trends that help explain observed outcomes and behaviors. `;
    } else {
      paragraph = `Historical development of ${prompt} provides context for understanding its current applications and limitations. `;
    }
    
    paragraph += `This information establishes a factual foundation for evaluating related concepts and approaches. `;
    
    if (keyword) {
      paragraph += `Data regarding ${keyword} further illuminates this topic, offering specific metrics that quantify important relationships within the broader context of ${prompt}. `;
    }
    
    paragraph += `Comparative studies have documented these findings across multiple contexts and populations. `;
    paragraph += `These evidence-based insights provide valuable knowledge for anyone seeking to understand ${prompt} comprehensively.`;
    
    return paragraph;
  };

  const generateConversationalParagraph = (index: number, keyword?: string): string => {
    let paragraph = "";
    
    if (index === 0) {
      paragraph = `You know what's really interesting about ${prompt}? It's not what most people initially think. `;
    } else if (index === 1) {
      paragraph = `I've been thinking about ${prompt} a lot lately, and I've noticed something that might surprise you. `;
    } else {
      paragraph = `Here's another thing about ${prompt} that doesn't get enough attention in regular conversations. `;
    }
    
    paragraph += `It's one of those topics that gets more fascinating the deeper you go into it. `;
    
    if (keyword) {
      paragraph += `And when you bring ${keyword} into the discussion, everything takes on a new dimension that's worth exploring together. `;
    }
    
    paragraph += `I've found that most people have some experience with this, even if they don't immediately recognize it. `;
    paragraph += `What do you think about ${prompt}? Have you noticed these patterns in your own experiences?`;
    
    return paragraph;
  };

  // Generate conclusion based on prompt and purpose
  const generateConclusion = (): string => {
    const conclusionsByPurpose = {
      general: [
        `In summary, ${prompt} encompasses various aspects worth considering in a broader context. The points discussed provide a foundation for further exploration and understanding of this multifaceted topic.`,
        `To conclude, this overview of ${prompt} highlights key elements that contribute to a comprehensive understanding. These insights may serve as a starting point for more detailed investigation of specific areas of interest.`,
        `In closing, the examination of ${prompt} reveals its complexity and significance across multiple dimensions. This perspective offers valuable context for appreciating the nuances involved.`
      ],
      creative: [
        `As our journey through ${prompt} comes to a close, the pathways we've explored continue to branch into new possibilities, inviting further adventures of imagination and discovery.`,
        `The story of ${prompt} doesn't truly end here—it merely pauses, a breath between chapters in an ongoing narrative that continues to unfold in unexpected ways.`,
        `In the tapestry of ${prompt}, we've examined but a few vibrant threads. The full pattern extends beyond our vision, rich with possibilities yet to be discovered and stories yet to be told.`
      ],
      technical: [
        `This technical analysis of ${prompt} provides a framework for implementation and further development. Additional research may focus on optimizing specific components identified in this overview.`,
        `The technical specifications outlined for ${prompt} establish parameters for effective deployment. Monitoring performance metrics during implementation will enable refinement of this approach.`,
        `This technical documentation of ${prompt} serves as a reference for development teams. Further iterations may incorporate feedback from initial deployment to enhance functionality.`
      ],
      persuasive: [
        `The evidence clearly demonstrates that ${prompt} represents the optimal approach for those seeking superior results. The time to act is now—delay only postpones the benefits you could be experiencing immediately.`,
        `Given the compelling advantages of ${prompt}, the decision to implement should be straightforward. Take the first step today to secure your position ahead of those who hesitate to embrace this opportunity.`,
        `The case for ${prompt} is undeniable based on the evidence presented. Those who recognize this reality and act decisively will gain significant advantages over competitors who fail to appreciate its importance.`
      ],
      informative: [
        `Current research on ${prompt} indicates the patterns and relationships described in this overview. As studies continue, our understanding may evolve to incorporate new findings and perspectives.`,
        `This informative summary of ${prompt} reflects the current state of knowledge on this subject. Ongoing research continues to refine these concepts and may yield additional insights.`,
        `The information presented about ${prompt} provides a factual foundation for understanding this topic. Further study may explore specific aspects in greater detail to expand this knowledge base.`
      ],
      conversational: [
        `So that's my take on ${prompt}. I'd love to hear your thoughts on this too! There's always more to learn, and different perspectives really help round out the picture.`,
        `Anyway, those are just some ideas about ${prompt} that I wanted to share. What's your experience been like? Have you noticed similar things or something completely different?`,
        `That's the general idea behind ${prompt} as I understand it. Of course, this is just one way of looking at things, and I'm sure there's plenty more we could discuss about it next time.`
      ]
    };
    
    // Get random conclusion for selected purpose
    const conclusions = conclusionsByPurpose[purpose] || conclusionsByPurpose.general;
    const randomIndex = Math.floor(Math.random() * conclusions.length);
    
    return conclusions[randomIndex];
  };

  // Adjust text based on selected tone
  const adjustTextTone = (text: string): string => {
    let adjusted = text;
    
    switch (tone) {
      case "formal":
        adjusted = adjusted
          .replace(/I think/gi, "It is proposed that")
          .replace(/I believe/gi, "It is suggested that")
          .replace(/in my opinion/gi, "from an analytical perspective")
          .replace(/you can/gi, "one can")
          .replace(/very/gi, "substantially")
          .replace(/really/gi, "significantly")
          .replace(/huge/gi, "considerable")
          .replace(/amazing/gi, "noteworthy");
        break;
        
      case "casual":
        adjusted = adjusted
          .replace(/it is proposed that/gi, "I think")
          .replace(/it is suggested that/gi, "I'd say")
          .replace(/from an analytical perspective/gi, "the way I see it")
          .replace(/one can/gi, "you can")
          .replace(/therefore/gi, "so")
          .replace(/subsequently/gi, "then")
          .replace(/additionally/gi, "also")
          .replace(/consequently/gi, "so");
        break;
        
      case "professional":
        adjusted = adjusted
          .replace(/think/gi, "assess")
          .replace(/believe/gi, "determine")
          .replace(/look at/gi, "examine")
          .replace(/use/gi, "utilize")
          .replace(/big/gi, "significant")
          .replace(/small/gi, "minimal")
          .replace(/got/gi, "obtained")
          .replace(/a lot/gi, "substantial");
        break;
        
      case "friendly":
        adjusted = adjusted
          .replace(/examine/gi, "take a look at")
          .replace(/however/gi, "but")
          .replace(/therefore/gi, "so")
          .replace(/additionally/gi, "also")
          .replace(/requires/gi, "needs")
          .replace(/obtain/gi, "get")
          .replace(/assist/gi, "help")
          .replace(/regarding/gi, "about");
        break;
        
      case "humorous":
        adjusted = adjusted
          .replace(/important/gi, "earth-shattering")
          .replace(/interesting/gi, "mind-blowing")
          .replace(/difficult/gi, "tougher than explaining TikTok to grandparents")
          .replace(/easy/gi, "easier than finding cat videos online")
          .replace(/good/gi, "awesome")
          .replace(/bad/gi, "tragic")
          .replace(/significant/gi, "game-changing");
          
        // Add occasional humorous asides
        if (adjusted.includes(".")) {
          const sentences = adjusted.split(".");
          for (let i = 1; i < sentences.length; i += 3) {
            if (sentences[i] && sentences[i].length > 5) {
              sentences[i] += " (No, really, I'm serious about this one!)";
            }
          }
          adjusted = sentences.join(".");
        }
        break;
        
      case "serious":
        adjusted = adjusted
          .replace(/awesome/gi, "significant")
          .replace(/amazing/gi, "noteworthy")
          .replace(/cool/gi, "notable")
          .replace(/funny/gi, "remarkable")
          .replace(/kind of/gi, "somewhat")
          .replace(/sort of/gi, "relatively")
          .replace(/pretty/gi, "rather")
          .replace(/huge/gi, "substantial");
        break;
    }
    
    return adjusted;
  };

  // Clear all fields and reset state
  const clearFields = () => {
    setPrompt("");
    setKeywords("");
    setGeneratedText("");
    setProgress(0);
  };

  // Copy generated text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  // Download text as a file
  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    
    // Create filename from prompt
    const filename = prompt
      ? `text-${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
      : "generated-text.txt";
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Text downloaded",
      description: `Your text has been downloaded as "${filename}"`,
    });
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="editor" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Text Generator</TabsTrigger>
          <TabsTrigger value="tips">Writing Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Text Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt" className="text-sm font-medium">
                        Prompt or Topic
                      </Label>
                      <Input
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a topic or prompt for your text"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="purpose" className="text-sm font-medium">
                          Text Purpose
                        </Label>
                        <Select
                          value={purpose}
                          onValueChange={(value) => setPurpose(value as TextPurpose)}
                        >
                          <SelectTrigger id="purpose" className="mt-1">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="informative">Informative</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tone" className="text-sm font-medium">
                          Writing Tone
                        </Label>
                        <Select
                          value={tone}
                          onValueChange={(value) => setTone(value as TextTone)}
                        >
                          <SelectTrigger id="tone" className="mt-1">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="serious">Serious</SelectItem>
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
                        Include specific terms you want incorporated in the text
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Text Length
                      </Label>
                      <Select
                        value={textLength}
                        onValueChange={(value) => setTextLength(value as TextLength)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (~150 words)</SelectItem>
                          <SelectItem value="medium">Medium (~300 words)</SelectItem>
                          <SelectItem value="long">Long (~600 words)</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {textLength === "custom" && (
                        <div className="pt-2">
                          <Label htmlFor="custom-word-count" className="text-xs text-gray-500">
                            Custom word count: {customWordCount}
                          </Label>
                          <Slider
                            id="custom-word-count"
                            value={[customWordCount]}
                            min={50}
                            max={1000}
                            step={50}
                            onValueChange={(value) => setCustomWordCount(value[0])}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-intro" 
                          checked={includeIntro}
                          onCheckedChange={(checked) => setIncludeIntro(checked as boolean)}
                        />
                        <Label htmlFor="include-intro" className="text-sm">
                          Include introduction
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-conclusion" 
                          checked={includeConclusion}
                          onCheckedChange={(checked) => setIncludeConclusion(checked as boolean)}
                        />
                        <Label htmlFor="include-conclusion" className="text-sm">
                          Include conclusion
                        </Label>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateText}
                        disabled={isGenerating || !prompt.trim()}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Text"}
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
                  <h3 className="font-medium text-lg mb-3">Purpose & Tone Guide</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-sm">{purpose.charAt(0).toUpperCase() + purpose.slice(1)} Purpose</h4>
                      <p className="text-gray-700 mt-1">
                        {purpose === "general" && "Versatile text suitable for multiple contexts, balancing information and readability."}
                        {purpose === "creative" && "Imaginative, expressive text that uses literary techniques and creates vivid imagery."}
                        {purpose === "technical" && "Precise, structured text focused on specifications, processes, or technical concepts."}
                        {purpose === "persuasive" && "Compelling text designed to influence opinions or drive action through strong arguments."}
                        {purpose === "informative" && "Educational text that presents facts, data, and information in a clear, objective manner."}
                        {purpose === "conversational" && "Friendly, dialogue-like text that mimics natural speech patterns and engages directly."}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">{tone.charAt(0).toUpperCase() + tone.slice(1)} Tone</h4>
                      <p className="text-gray-700 mt-1">
                        {tone === "formal" && "Academic or official language with complete sentences, no contractions, and precise vocabulary."}
                        {tone === "casual" && "Relaxed, everyday language with contractions, simpler vocabulary, and conversational flow."}
                        {tone === "professional" && "Business-appropriate language that's authoritative and polished while remaining accessible."}
                        {tone === "friendly" && "Warm, approachable language that creates connection and speaks directly to the reader."}
                        {tone === "humorous" && "Light-hearted, amusing language that incorporates wit, playfulness, and entertaining elements."}
                        {tone === "serious" && "Sober, straightforward language focused on gravity and importance without levity."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">Generated Text</h3>
                    {!isGenerating && generatedText && (
                      <div className="flex items-center space-x-1">
                        <Badge className="bg-green-50 text-green-700">
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
                          {progress < 30 ? "Analyzing prompt..." : 
                           progress < 60 ? "Generating content..." : 
                           "Refining text..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Textarea
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        placeholder="Your text will appear here after generation..."
                        className="min-h-[400px] font-serif text-base leading-relaxed"
                      />
                      
                      {generatedText && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="text-blue-600"
                          >
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            onClick={downloadText}
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
              
              {!isGenerating && !generatedText && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use AI Text Generator</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Enter a clear, specific prompt or topic in the input field</li>
                      <li>Select the purpose that best matches your text's goal</li>
                      <li>Choose a writing tone appropriate for your audience</li>
                      <li>Add optional keywords to guide content focus</li>
                      <li>Set your desired text length</li>
                      <li>Toggle introduction and conclusion settings as needed</li>
                      <li>Click "Generate Text" and wait for AI to create your content</li>
                      <li>Edit the generated text to personalize it for your needs</li>
                      <li>Copy or download the finished text</li>
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
                <h3 className="font-medium text-lg mb-4">Tips for Effective Prompts</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Be specific with your prompt (e.g., "Benefits of meditation for anxiety reduction" instead of just "Meditation")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Include context or background information to guide the AI's understanding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Specify any particular aspects of the topic you want emphasized</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Consider your audience when choosing purpose and tone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Use keywords to ensure important concepts are covered</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Experiment with different combinations of settings for varied results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">If results aren't what you expected, try rephrasing your prompt</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Text Purpose Guide</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">General Purpose</h4>
                    <p className="mt-1">
                      Balanced, versatile text suitable for a wide range of contexts. This is a good default choice when you need well-rounded content that combines information with readability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Creative Purpose</h4>
                    <p className="mt-1">
                      Imaginative, expressive text that uses metaphors, vivid descriptions, and literary techniques. Ideal for storytelling, creative writing, or engaging descriptions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Technical Purpose</h4>
                    <p className="mt-1">
                      Precise, structured text that focuses on specifications, processes, or technical concepts. Best for documentation, technical explanations, or specialized content.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Persuasive Purpose</h4>
                    <p className="mt-1">
                      Compelling text designed to influence opinions or drive action. Uses strong arguments, benefits, and calls to action. Perfect for marketing, advocacy, or opinion pieces.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Informative Purpose</h4>
                    <p className="mt-1">
                      Educational text that presents facts, data, and information clearly and objectively. Ideal for explanations, reports, educational content, or journalism.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Conversational Purpose</h4>
                    <p className="mt-1">
                      Friendly, dialogue-like text that mimics natural speech patterns. Creates a sense of direct communication with the reader. Great for social media, personal messaging, or casual blogs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Writing Tone Reference</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Formal Tone</h4>
                    <p className="mt-1">
                      Academic or official language with complete sentences, no contractions, and precise vocabulary. Appropriate for academic papers, legal documents, or official communications.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Casual Tone</h4>
                    <p className="mt-1">
                      Relaxed, everyday language with contractions, simpler vocabulary, and conversational flow. Suitable for blogs, informal communications, or content for general audiences.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Professional Tone</h4>
                    <p className="mt-1">
                      Business-appropriate language that's authoritative and polished while remaining accessible. Ideal for business communications, reports, or industry content.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Friendly Tone</h4>
                    <p className="mt-1">
                      Warm, approachable language that creates connection and speaks directly to the reader. Perfect for customer communications, community content, or personal outreach.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Humorous Tone</h4>
                    <p className="mt-1">
                      Light-hearted, amusing language that incorporates wit, playfulness, and entertaining elements. Great for engaging content, certain marketing materials, or entertainment purposes.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Serious Tone</h4>
                    <p className="mt-1">
                      Sober, straightforward language focused on gravity and importance without levity. Appropriate for sensitive topics, important announcements, or serious discussions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Refining AI-Generated Text</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Review for accuracy:</strong> AI can occasionally include assumptions or inaccuracies. Verify any factual statements or data points before using them.
                  </p>
                  <p>
                    <strong>Add personal perspective:</strong> Incorporate your unique insights, examples, or experiences to make the content more authentic and original.
                  </p>
                  <p>
                    <strong>Enhance specificity:</strong> Replace generic statements with specific examples, data points, or detailed descriptions relevant to your context.
                  </p>
                  <p>
                    <strong>Check tone consistency:</strong> Ensure the tone remains consistent throughout the text and aligns perfectly with your purpose and audience.
                  </p>
                  <p>
                    <strong>Improve flow:</strong> Refine transitions between ideas and paragraphs to create a smoother reading experience.
                  </p>
                  <p>
                    <strong>Add credibility:</strong> Incorporate citations, references, or expert opinions where appropriate to strengthen the content.
                  </p>
                  <p>
                    <strong>Optimize for context:</strong> Adjust the content to better fit the specific medium, platform, or format where it will be published.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Create polished, engaging text on any topic with our versatile AI text generation tool.";
  
  const description = `
    Our AI Text Generator is a sophisticated content creation tool designed to produce high-quality written text for a wide variety of purposes and contexts. Leveraging advanced artificial intelligence, this powerful utility can transform a simple prompt into polished, coherent content tailored specifically to your requirements.
    
    Whether you need creative writing with vivid imagery, technical explanations with precise terminology, persuasive content with compelling arguments, informative text with clear facts, conversational content with natural flow, or general-purpose text that balances multiple qualities, our AI Text Generator delivers exceptional results customized to your exact specifications.
    
    The tool offers comprehensive customization options that allow you to control every aspect of the generated content. You can specify not only your topic but also the purpose of the text, the writing tone, desired length, and even whether to include introductory and concluding sections. The keyword feature ensures that important terms are seamlessly incorporated into the content, while the six different tone options—formal, casual, professional, friendly, humorous, and serious—guarantee that the writing style perfectly matches your intended audience and context.
    
    Created to save time and overcome writer's block, this versatile text generator produces well-structured, coherent content that serves as an excellent starting point for any writing project. The intuitive interface makes it easy to adjust settings and generate multiple versions until you find the perfect text for your needs. While producing high-quality drafts, the tool also allows you to edit and refine the output, enabling you to add your unique perspective and ensure the content perfectly aligns with your vision.
  `;

  const howToUse = [
    "Enter a specific prompt or topic in the input field to guide the AI text generation.",
    "Select the purpose of your text (general, creative, technical, persuasive, informative, or conversational) based on your goals.",
    "Choose the appropriate writing tone (formal, casual, professional, friendly, humorous, or serious) for your audience.",
    "Add optional keywords separated by commas to ensure specific terms are incorporated into the text.",
    "Select your desired text length from preset options or set a custom word count using the slider.",
    "Toggle the introduction and conclusion options based on whether you want these sections included.",
    "Click 'Generate Text' and wait for the AI to create your content based on your specifications.",
    "Review the generated text and make any necessary edits or refinements to personalize it.",
    "Use the copy or download buttons to save your finished text."
  ];

  const features = [
    "Six versatile text purposes (general, creative, technical, persuasive, informative, conversational) to match any writing goal",
    "Multiple writing tone options including formal, casual, professional, friendly, humorous, and serious for perfect audience alignment",
    "Customizable text length with preset options and a custom word count slider for precise control",
    "Optional introduction and conclusion toggles to control text structure based on your needs",
    "Keyword integration feature to ensure important terms are incorporated naturally into the content",
    "Real-time word count tracking to monitor content length as you edit",
    "Comprehensive writing guides and tips for optimizing your prompts and refining AI-generated content"
  ];

  const faqs = [
    {
      question: "What types of text can the AI Text Generator create?",
      answer: "The AI Text Generator can create virtually any type of written content across six different purposes: General text for all-purpose content that balances information and readability; Creative text with imaginative language, metaphors, and vivid descriptions; Technical text focused on precise, structured information about processes or concepts; Persuasive text designed to influence opinions or drive action; Informative text that clearly presents facts and educational content; and Conversational text that mimics natural dialogue patterns. Within each purpose, you can further customize the tone (formal, casual, professional, friendly, humorous, or serious) to perfectly match your specific needs and audience. The tool is versatile enough to help with blog posts, reports, stories, marketing copy, explanations, social media content, and much more."
    },
    {
      question: "How can I get the best results from the AI Text Generator?",
      answer: "For optimal results, be as specific as possible with your prompt—for example, 'Benefits of hydroponics for urban gardeners' rather than just 'gardening.' Select the purpose and tone that best match your needs and audience. Include relevant keywords to ensure the AI incorporates important concepts. Experiment with different settings combinations if your first result isn't quite right. Remember that AI-generated text works best as a strong starting point; always review and edit the output to add your personal touch, verify any factual claims, enhance specificity with relevant examples, and ensure the content perfectly fits your context. The more guidance you provide through detailed prompts and appropriate settings, the better the AI can tailor the text to your specific requirements."
    },
    {
      question: "Is AI-generated text suitable for professional or academic use?",
      answer: "AI-generated text can be valuable for professional and academic contexts when used appropriately. For professional use, AI text serves as an excellent starting point for reports, presentations, emails, and other business communications—but should always be reviewed, edited, and personalized to align with your organization's voice and specific requirements. For academic purposes, AI can help generate initial drafts, outlines, or explanations of concepts, but most educational institutions have specific policies regarding AI-generated content. Always follow your institution's guidelines, which typically require significant original contribution, proper citation of sources, and transparent acknowledgment of AI assistance if used. In both contexts, the responsibility for accuracy, originality, and quality remains with you as the author, so thorough review and enhancement of AI-generated content is essential."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="ai-text-generator"
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

export default AITextGeneratorDetailed;