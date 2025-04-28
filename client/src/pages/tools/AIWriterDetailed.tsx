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
import { Switch } from "@/components/ui/switch";

// Types for content generation
type ContentType = "blog" | "article" | "social" | "marketing" | "business" | "creative";
type ContentTone = "professional" | "casual" | "friendly" | "persuasive" | "informative" | "enthusiastic";
type ContentLength = "short" | "medium" | "long";

const AIWriterDetailed = () => {
  // State for inputs
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [contentTone, setContentTone] = useState<ContentTone>("professional");
  const [contentLength, setContentLength] = useState<ContentLength>("medium");
  const [keywords, setKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [includedPoints, setIncludedPoints] = useState("");
  const [creativity, setCreativity] = useState(50);
  const [useFirstPerson, setUseFirstPerson] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  
  // State for output and processing
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outline, setOutline] = useState<string[]>([]);
  const [showOutline, setShowOutline] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  const { toast } = useToast();

  // Update word and character count when content changes
  useEffect(() => {
    if (generatedContent) {
      const words = generatedContent.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(generatedContent.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [generatedContent]);

  // Generate content when user clicks the button
  const handleGenerateContent = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent("");
    setOutline([]);
    setShowOutline(false);

    // First generate an outline
    generateOutline();

    // Simulate content generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the content
          const generatedText = generateMockContent();
          setGeneratedContent(generatedText);
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  // Generate outline based on content type and other parameters
  const generateOutline = () => {
    // This is a mock implementation for the demonstration
    // In a real app, this would call an AI service API
    
    let outlinePoints: string[] = [];
    
    // Create outline based on content type
    switch (contentType) {
      case "blog":
        outlinePoints = [
          "Introduction to " + topic,
          "Background and context",
          "Key point 1 about " + topic,
          "Key point 2 about " + topic,
          "Key point 3 about " + topic,
          "Practical implications or applications",
          "Conclusion and final thoughts"
        ];
        break;
        
      case "article":
        outlinePoints = [
          "Headline: Engaging title about " + topic,
          "Introduction with hook about " + topic,
          "Background and current relevance",
          "Main section 1: Primary aspects of " + topic,
          "Main section 2: Analysis and insights",
          "Main section 3: Examples or case studies",
          "Conclusion with key takeaways"
        ];
        break;
        
      case "social":
        outlinePoints = [
          "Attention-grabbing opener about " + topic,
          "Core message or value proposition",
          "Supporting details or evidence",
          "Call to action related to " + topic
        ];
        break;
        
      case "marketing":
        outlinePoints = [
          "Engaging hook about " + topic,
          "Value proposition or pain point addressed",
          "Key benefits and features",
          "Social proof or credibility elements",
          "Urgency or scarcity elements if appropriate",
          "Clear call to action"
        ];
        break;
        
      case "business":
        outlinePoints = [
          "Executive summary about " + topic,
          "Current situation or background analysis",
          "Key findings or insights",
          "Supporting data or evidence",
          "Recommendations or next steps",
          "Implementation considerations",
          "Conclusion"
        ];
        break;
        
      case "creative":
        outlinePoints = [
          "Creative opening scene or setting related to " + topic,
          "Character or situation introduction",
          "Development of main idea or plot",
          "Climax or turning point",
          "Resolution or closing thoughts"
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
    
    // Add included points if provided
    if (includedPoints) {
      const pointsList = includedPoints.split("\n").map(p => p.trim()).filter(p => p.length > 0);
      
      if (pointsList.length > 0) {
        // Add custom points to the outline before the conclusion
        const conclusionPoint = outlinePoints.pop() || "";
        outlinePoints = [
          ...outlinePoints,
          ...pointsList.map(point => `Additional point: ${point}`),
          conclusionPoint
        ];
      }
    }
    
    setOutline(outlinePoints);
    
    // Show outline after a delay to simulate generation
    setTimeout(() => {
      setShowOutline(true);
    }, 1500);
  };

  // Generate content based on parameters
  const generateMockContent = () => {
    // In a real application, this would be an API call to an AI service
    // This is a mock implementation for demonstration
    
    // Base the content length on the selected option
    const targetLength = contentLength === "short" ? 250 : 
                         contentLength === "medium" ? 500 : 800;
    
    // Generate content for each section in the outline
    let sections: string[] = [];
    
    // Introduction
    sections.push(generateIntroduction());
    
    // Main content sections
    for (let i = 1; i < outline.length - 1; i++) {
      sections.push(generateSection(outline[i], i));
    }
    
    // Conclusion
    sections.push(generateConclusion());
    
    // Adjust length if needed
    let combinedContent = sections.join("\n\n");
    
    // Apply tone and style adjustments
    combinedContent = adjustToneAndStyle(combinedContent);
    
    return combinedContent;
  };

  // Generate introduction based on content type and topic
  const generateIntroduction = (): string => {
    const introTemplates = {
      blog: [
        `Have you ever wondered about ${topic}? This fascinating subject has captured the attention of many, and for good reason. In this blog post, we'll explore the key aspects of ${topic} and why it matters today.`,
        `${topic} is becoming increasingly relevant in our rapidly changing world. Whether you're new to this topic or already familiar with it, this post will provide valuable insights and practical takeaways.`,
        `The world of ${topic} is rich with possibilities and insights. In this blog post, we'll dive deep into what makes ${topic} so important and how you can benefit from understanding it better.`
      ],
      article: [
        `In recent years, ${topic} has emerged as a critical area of interest for professionals and enthusiasts alike. This article examines the multifaceted dimensions of ${topic} and its implications for the future.`,
        `The evolution of ${topic} represents one of the most significant developments in this field. This comprehensive analysis explores the current state of ${topic} and its potential trajectory.`,
        `As experts continue to debate the merits and challenges of ${topic}, a closer examination reveals surprising insights. This article offers an in-depth look at the nuances of ${topic} that are often overlooked.`
      ],
      social: [
        `🔥 Just discovered something amazing about ${topic} that's too good not to share! Keep reading to find out what everyone's talking about... #${topic.replace(/\s+/g, '')}`,
        `Anyone else fascinated by ${topic}? I've been researching this for weeks and what I found will change how you think about it! 👇`,
        `The secret to understanding ${topic} that nobody's talking about... until now! This changed everything for me, and it might for you too! ✨`
      ],
      marketing: [
        `Discover how ${topic} can revolutionize your approach and deliver unprecedented results. Our exclusive insights provide the competitive edge you've been searching for.`,
        `Are you missing out on the benefits of ${topic}? Join the growing number of success stories from people who have embraced this game-changing approach.`,
        `Introducing a breakthrough perspective on ${topic} that's helping industry leaders achieve remarkable outcomes. Limited time opportunity to transform your results.`
      ],
      business: [
        `Executive Summary: This report analyzes the strategic implications of ${topic} for organizations seeking to optimize performance and maintain competitive advantage in the current market landscape.`,
        `This business analysis examines ${topic} through the lens of operational efficiency and market positioning, offering actionable recommendations for implementation.`,
        `Purpose: To evaluate the business impact of ${topic} and provide data-driven recommendations for leveraging this insight to achieve organizational objectives.`
      ],
      creative: [
        `The first time I encountered ${topic}, I never imagined how it would change everything. The morning light filtered through the blinds as the realization dawned on me—nothing would ever be the same again.`,
        `Legends spoke of ${topic} in whispered tones, as if saying it too loudly might summon forces beyond understanding. Few knew the truth behind the stories, but those who did guarded the secret zealously.`,
        `In a world where ${topic} defined the boundaries between possible and impossible, one question remained unanswered—what happens when those boundaries begin to blur?`
      ]
    };
    
    // Select a random template based on content type
    const templates = introTemplates[contentType] || introTemplates.blog;
    const randomIndex = Math.floor(Math.random() * templates.length);
    
    // Return the selected template with the topic inserted
    return templates[randomIndex];
  };

  // Generate a content section based on outline point
  const generateSection = (outlinePoint: string, sectionIndex: number): string => {
    // Extract the main point without keywords in parentheses
    const mainPoint = outlinePoint.split("(")[0].trim();
    
    // Extract keyword if present
    const keywordMatch = outlinePoint.match(/incorporating "([^"]+)"/);
    const keyword = keywordMatch ? keywordMatch[1] : "";
    
    // Generate section content based on content type
    let sectionContent = "";
    
    switch (contentType) {
      case "blog":
        sectionContent = `## ${mainPoint}\n\n`;
        sectionContent += `When exploring ${topic}, ${mainPoint.toLowerCase()} stands out as particularly significant. `;
        
        if (keyword) {
          sectionContent += `The concept of ${keyword} plays a crucial role here. `;
        }
        
        sectionContent += `Many people don't realize that this aspect of ${topic} actually connects to broader themes and applications in everyday life. `;
        sectionContent += `Research has shown that understanding ${mainPoint.toLowerCase()} can lead to better outcomes and more informed decisions. `;
        sectionContent += `For instance, consider how this applies in real-world scenarios where ${topic} influences decision-making processes and outcomes. `;
        
        if (useFirstPerson) {
          sectionContent += `I've personally observed how this principle transforms approaches to ${topic} in practical settings. `;
        } else {
          sectionContent += `Observers have noted how this principle transforms approaches to ${topic} in practical settings. `;
        }
        
        sectionContent += `The implications extend beyond the obvious, suggesting new possibilities for how we understand and engage with ${topic}.`;
        break;
        
      case "article":
        sectionContent = `## ${mainPoint}\n\n`;
        sectionContent += `Analysis of ${topic} reveals that ${mainPoint.toLowerCase()} represents a critical component worthy of detailed examination. `;
        
        if (keyword) {
          sectionContent += `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} emerges as a central theme in this context. `;
        }
        
        sectionContent += `The evidence suggests a clear correlation between this element and the overall effectiveness of approaches to ${topic}. `;
        sectionContent += `Experts in the field have documented numerous cases where this factor significantly influenced outcomes. `;
        
        if (targetAudience) {
          sectionContent += `For ${targetAudience}, this insight offers particular value in navigating the complexities of ${topic}. `;
        }
        
        sectionContent += `Historical trends indicate that this aspect of ${topic} has evolved considerably, reflecting changing understandings and priorities. `;
        sectionContent += `Current developments suggest this evolution will continue, with implications for how ${topic} is approached in various contexts.`;
        break;
        
      case "social":
        // For social media, create a shorter, more engaging paragraph
        sectionContent = `${mainPoint} is where the magic happens with ${topic}! `;
        
        if (keyword) {
          sectionContent += `#${keyword.replace(/\s+/g, '')} is the secret ingredient most people miss. `;
        }
        
        sectionContent += `What I've discovered will completely change how you think about this. `;
        
        if (targetAudience) {
          sectionContent += `If you're ${targetAudience}, this is especially going to revolutionize your approach! `;
        }
        
        sectionContent += `The best part? You can start applying this knowledge immediately for amazing results! 🔥`;
        break;
        
      case "marketing":
        sectionContent = `## ${mainPoint}\n\n`;
        sectionContent += `Discover the transformative power of ${mainPoint.toLowerCase()} in maximizing the potential of ${topic}. `;
        
        if (keyword) {
          sectionContent += `Our exclusive approach leverages ${keyword} to deliver unparalleled results. `;
        }
        
        sectionContent += `Unlike conventional methods, this innovative strategy addresses the core challenges associated with ${topic}. `;
        
        if (targetAudience) {
          sectionContent += `Designed specifically for ${targetAudience}, this solution eliminates the typical obstacles and frustrations. `;
        }
        
        sectionContent += `Clients who have implemented this approach report significant improvements in efficiency and effectiveness. `;
        sectionContent += `Don't miss this opportunity to revolutionize your experience with ${topic} and gain the competitive edge you deserve.`;
        break;
        
      case "business":
        sectionContent = `## ${mainPoint}\n\n`;
        sectionContent += `Analysis indicates that ${mainPoint.toLowerCase()} represents a key strategic consideration in the context of ${topic}. `;
        
        if (keyword) {
          sectionContent += `The factor of ${keyword} demonstrates statistically significant correlation with performance metrics. `;
        }
        
        sectionContent += `Quantitative assessment reveals a 37% improvement in relevant outcomes when this element is effectively implemented. `;
        sectionContent += `Comparative analysis of industry benchmarks confirms the validity of this approach across multiple sectors. `;
        
        if (targetAudience) {
          sectionContent += `Organizations with ${targetAudience} characteristics demonstrate particularly strong response to this implementation. `;
        }
        
        sectionContent += `Cost-benefit analysis supports the allocation of resources to this area, with projected ROI exceeding standard thresholds. `;
        sectionContent += `Recommendation: Prioritize the development and integration of this component within the broader ${topic} strategy.`;
        break;
        
      case "creative":
        sectionContent = `${mainPoint} unfolded like a mystery waiting to be solved. `;
        
        if (keyword) {
          sectionContent += `The echo of "${keyword}" lingered in the air, a reminder of what was at stake. `;
        }
        
        sectionContent += `The shadows danced across the landscape of ${topic}, revealing patterns that had remained hidden until now. `;
        
        if (useFirstPerson) {
          sectionContent += `I could feel the weight of understanding settle upon my shoulders as the pieces began to fit together. `;
        } else {
          sectionContent += `The weight of understanding settled upon shoulders as the pieces began to fit together. `;
        }
        
        sectionContent += `There was a moment of perfect clarity—when everything about ${topic} made sense in a way it never had before. `;
        sectionContent += `The revelation brought both answers and questions, the way true discoveries always do. `;
        sectionContent += `What would this mean for everything that came after? Only time would tell.`;
        break;
        
      default:
        sectionContent = `## ${mainPoint}\n\n`;
        sectionContent += `This section explores ${mainPoint.toLowerCase()} as it relates to ${topic}. `;
        sectionContent += `Various perspectives offer insights into how this element functions within the broader context. `;
        sectionContent += `Understanding this aspect contributes significantly to a comprehensive grasp of ${topic} overall.`;
    }
    
    return sectionContent;
  };

  // Generate conclusion based on content type and topic
  const generateConclusion = (): string => {
    const conclusionTemplates = {
      blog: [
        `In conclusion, ${topic} represents an important area that continues to evolve and shape our understanding. By focusing on the key aspects we've explored, you can develop a more nuanced appreciation of this subject and its implications for related areas. Whether you're just beginning to explore ${topic} or looking to deepen your existing knowledge, the insights shared here provide a solid foundation for further exploration.`,
        `As we've seen throughout this post, ${topic} encompasses various dimensions worth understanding. The points discussed highlight the richness and complexity of this subject, inviting further reflection and investigation. I hope this exploration has provided valuable insights and sparked your curiosity to learn more about ${topic} and its significance in our world today.`,
        `To wrap up our discussion on ${topic}, it's clear that this subject offers rich territory for exploration and application. The key takeaways we've covered provide practical guidance for engaging with ${topic} more effectively. Remember that understanding in this area continues to develop, so staying curious and open to new perspectives will serve you well as you continue your journey with ${topic}.`
      ],
      article: [
        `This analysis of ${topic} reveals its multifaceted nature and significant implications across various domains. The evidence presented underscores the importance of a nuanced approach that accounts for the complexity inherent in ${topic}. As research continues to evolve in this area, maintaining awareness of emerging developments will be essential for those seeking to leverage insights related to ${topic} effectively.`,
        `In examining ${topic}, this article has highlighted critical factors that shape its impact and application. The findings suggest important considerations for practitioners and researchers alike, pointing toward promising avenues for further investigation. As understanding of ${topic} continues to develop, the perspectives outlined here offer a framework for interpreting new information and integrating it into existing knowledge structures.`,
        `The preceding analysis of ${topic} demonstrates its significance and the value of a comprehensive understanding. By integrating various perspectives and examining key components, this article has sought to contribute meaningful insights to the discourse surrounding ${topic}. The implications extend beyond theoretical interest, offering practical value for those engaging with ${topic} in professional or academic contexts.`
      ],
      social: [
        `That's the truth about ${topic} nobody's talking about! What do you think? Drop your thoughts in the comments! 👇 #${topic.replace(/\s+/g, '')} #MustShare`,
        `Now you know my secrets about ${topic}! Try these ideas and let me know your results! Don't forget to share this post with anyone who needs this info! 🙌`,
        `Mind blown? Mine too when I first discovered these things about ${topic}! Follow for more insights like this that'll change your game! ⚡ #GameChanger`
      ],
      marketing: [
        `Don't miss this exclusive opportunity to transform your experience with ${topic}. Our proven approach delivers results that speak for themselves. Take action today to secure your advantage and join our community of success stories. Limited availability—click now to learn more about how we can help you achieve your goals with ${topic}.`,
        `The choice is clear: continue with conventional approaches to ${topic} and accept ordinary results, or embrace this revolutionary strategy and unlock extraordinary outcomes. Thousands have already discovered the difference. It's your turn to experience the transformation. Contact us now to begin your journey to unprecedented success with ${topic}.`,
        `Ready to revolutionize your approach to ${topic}? The solution you've been searching for is just one click away. Join industry leaders who have already discovered this game-changing strategy. Don't wait—limited time offer available now. Your future success with ${topic} begins with the decision you make today.`
      ],
      business: [
        `Recommendations: Based on the preceding analysis, the following actions are advised regarding ${topic}: 1) Implement the strategic framework outlined in Section 2, with particular emphasis on integration with existing systems; 2) Allocate appropriate resources to support implementation, with projected ROI justifying the investment; 3) Establish metrics for ongoing evaluation of effectiveness; 4) Develop capability for adaptation based on performance data. Implementation timeline and detailed budget considerations are provided in the appendix.`,
        `Conclusion: This analysis of ${topic} yields actionable insights for organizational strategy and operations. The evidence supports a measured implementation approach with regular assessment of outcomes against established benchmarks. With appropriate execution, the recommendations provided offer significant potential for enhancing competitive position and operational efficiency in relation to ${topic}.`,
        `Summary of Findings: The comprehensive assessment of ${topic} indicates clear strategic value when implemented according to the framework detailed in this report. Key performance indicators should be monitored to ensure alignment with organizational objectives. The data-driven approach outlined here provides a foundation for effective decision-making and resource allocation regarding ${topic} initiatives.`
      ],
      creative: [
        `As the final pieces of the puzzle fell into place, the true nature of ${topic} revealed itself—not as something to be feared, but as a doorway to possibilities previously unimagined. The journey had changed everything, leaving nothing as it had been before. And perhaps that had been the purpose all along—not to find answers, but to discover new questions worth asking.`,
        `When the story of ${topic} concludes, it doesn't truly end. It lives on in the shadows and light it casts, in the minds forever changed by its touch. Some stories aren't meant to be fully understood—they're meant to be felt, carried forward into dawns not yet imagined. And in that carrying forward, their magic endures.`,
        `In the end, ${topic} wasn't what anyone had expected—it was simultaneously less and more, simpler and more complex, more ordinary and more magical. The revelation wasn't a destination but a beginning. And as the horizon opened up to new possibilities, the only certainty was that nothing would ever be seen through the same eyes again.`
      ]
    };
    
    // Select a template based on content type
    const templates = conclusionTemplates[contentType] || conclusionTemplates.blog;
    const randomIndex = Math.floor(Math.random() * templates.length);
    
    // For blog and article, add a heading
    let conclusion = "";
    if (contentType === "blog" || contentType === "article" || contentType === "business" || contentType === "marketing") {
      conclusion = "## Conclusion\n\n";
    }
    
    // Add the conclusion text
    conclusion += templates[randomIndex];
    
    return conclusion;
  };

  // Adjust tone and style based on user settings
  const adjustToneAndStyle = (text: string): string => {
    let adjusted = text;
    
    // Adjust based on tone
    switch (contentTone) {
      case "professional":
        adjusted = adjusted
          .replace(/amazing/gi, "significant")
          .replace(/awesome/gi, "exceptional")
          .replace(/great/gi, "substantial")
          .replace(/huge/gi, "considerable")
          .replace(/good/gi, "beneficial")
          .replace(/bad/gi, "problematic")
          .replace(/I think/gi, "It is evident that")
          .replace(/I believe/gi, "Evidence suggests");
        break;
        
      case "casual":
        adjusted = adjusted
          .replace(/significant/gi, "pretty important")
          .replace(/consequently/gi, "so")
          .replace(/therefore/gi, "that's why")
          .replace(/however/gi, "but")
          .replace(/nevertheless/gi, "still")
          .replace(/it is evident that/gi, "it's clear that")
          .replace(/evidence suggests/gi, "it seems like");
        break;
        
      case "friendly":
        adjusted = adjusted
          .replace(/Hello/gi, "Hey there")
          .replace(/Greetings/gi, "Hi friend")
          .replace(/significant/gi, "really important")
          .replace(/beneficial/gi, "helpful")
          .replace(/In conclusion/gi, "To wrap things up")
          .replace(/Furthermore/gi, "Also");
        break;
        
      case "persuasive":
        adjusted = adjusted
          .replace(/could/gi, "should")
          .replace(/might/gi, "will")
          .replace(/possibly/gi, "certainly")
          .replace(/can/gi, "must")
          .replace(/good/gi, "essential")
          .replace(/helpful/gi, "invaluable")
          .replace(/interesting/gi, "compelling");
        break;
        
      case "informative":
        adjusted = adjusted
          .replace(/I believe/gi, "Research indicates")
          .replace(/I think/gi, "Evidence suggests")
          .replace(/amazing/gi, "noteworthy")
          .replace(/awesome/gi, "significant")
          .replace(/good/gi, "beneficial")
          .replace(/bad/gi, "detrimental");
        break;
        
      case "enthusiastic":
        adjusted = adjusted
          .replace(/good/gi, "amazing")
          .replace(/interesting/gi, "fascinating")
          .replace(/beneficial/gi, "incredible")
          .replace(/significant/gi, "game-changing")
          .replace(/important/gi, "essential")
          .replace(/helpful/gi, "transformative");
        
        // Add more exclamation points for enthusiasm
        adjusted = adjusted.replace(/\./g, (match) => {
          return Math.random() < 0.3 ? "!" : match;
        });
        break;
    }
    
    // Adjust for first person if needed
    if (useFirstPerson && contentType !== "business" && contentType !== "article") {
      adjusted = adjusted
        .replace(/one might consider/gi, "I recommend")
        .replace(/it is recommended/gi, "I recommend")
        .replace(/it can be observed/gi, "I've observed")
        .replace(/research indicates/gi, "I've found")
        .replace(/evidence suggests/gi, "I believe");
    }
    
    // Adjust for creativity level
    if (creativity > 70) {
      // Add more metaphors and vivid language for high creativity
      adjusted = adjusted.replace(/\b(?:important|significant)\b/gi, () => {
        const alternatives = ["transformative", "revolutionary", "groundbreaking", "paradigm-shifting", "game-changing"];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });
      
      // Add occasional metaphors
      if (Math.random() < 0.4) {
        adjusted += `\n\nThink of ${topic} as a tapestry, with each thread representing a different aspect of what we've explored. When woven together, they create a picture more beautiful and complex than any single element could convey.`;
      }
    } else if (creativity < 30) {
      // Make language more straightforward for low creativity
      adjusted = adjusted
        .replace(/transformative/gi, "important")
        .replace(/revolutionary/gi, "significant")
        .replace(/groundbreaking/gi, "notable")
        .replace(/paradigm-shifting/gi, "changing")
        .replace(/game-changing/gi, "impactful");
    }
    
    return adjusted;
  };

  // Clear all fields and reset state
  const clearFields = () => {
    setTopic("");
    setKeywords("");
    setTargetAudience("");
    setIncludedPoints("");
    setGeneratedContent("");
    setOutline([]);
    setShowOutline(false);
    setProgress(0);
  };

  // Copy generated content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };

  // Download content as a text file
  const downloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    
    // Create filename from topic
    const filename = topic
      ? `${contentType}-${topic.substring(0, 20).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
      : `generated-content.txt`;
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Content downloaded",
      description: `Your content has been downloaded as "${filename}"`,
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
          <TabsTrigger value="editor">Content Writer</TabsTrigger>
          <TabsTrigger value="tips">Writing Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Content Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic" className="text-sm font-medium">
                        Topic or Main Idea
                      </Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your content topic or main idea"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="content-type" className="text-sm font-medium">
                          Content Type
                        </Label>
                        <Select
                          value={contentType}
                          onValueChange={(value) => setContentType(value as ContentType)}
                        >
                          <SelectTrigger id="content-type" className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="marketing">Marketing Copy</SelectItem>
                            <SelectItem value="business">Business Document</SelectItem>
                            <SelectItem value="creative">Creative Writing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="content-tone" className="text-sm font-medium">
                          Writing Tone
                        </Label>
                        <Select
                          value={contentTone}
                          onValueChange={(value) => setContentTone(value as ContentTone)}
                        >
                          <SelectTrigger id="content-tone" className="mt-1">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="informative">Informative</SelectItem>
                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
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
                        Include specific keywords to focus your content
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="target-audience" className="text-sm font-medium">
                        Target Audience (optional)
                      </Label>
                      <Input
                        id="target-audience"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Who is this content for?"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="included-points" className="text-sm font-medium">
                        Key Points to Include (optional)
                      </Label>
                      <Textarea
                        id="included-points"
                        value={includedPoints}
                        onChange={(e) => setIncludedPoints(e.target.value)}
                        placeholder="Enter specific points to include (one per line)"
                        className="mt-1 h-20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Content Length
                      </Label>
                      <div className="flex justify-between items-center">
                        <Select
                          value={contentLength}
                          onValueChange={(value) => setContentLength(value as ContentLength)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (~250 words)</SelectItem>
                            <SelectItem value="medium">Medium (~500 words)</SelectItem>
                            <SelectItem value="long">Long (~800 words)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium">
                          Creativity Level
                        </Label>
                        <span className="text-xs text-gray-500">
                          {creativity < 30 ? "Conservative" : 
                           creativity < 70 ? "Balanced" : "Creative"}
                        </span>
                      </div>
                      <Slider
                        value={[creativity]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => setCreativity(value[0])}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="use-first-person"
                        checked={useFirstPerson}
                        onCheckedChange={setUseFirstPerson}
                      />
                      <Label htmlFor="use-first-person" className="text-sm">
                        Use first-person perspective (I, we, our)
                      </Label>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateContent}
                        disabled={isGenerating || !topic.trim()}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Content"}
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
              
              {showOutline && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">Content Outline</h3>
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
                    <h3 className="font-medium text-lg">Generated Content</h3>
                    {!isGenerating && generatedContent && (
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
                          {progress < 30 ? "Researching topic..." : 
                           progress < 50 ? "Developing ideas..." : 
                           progress < 80 ? "Crafting content..." : 
                           "Polishing final text..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        placeholder="Your content will appear here after generation..."
                        className="min-h-[400px] font-serif text-base leading-relaxed"
                      />
                      
                      {generatedContent && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="text-blue-600"
                          >
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            onClick={downloadContent}
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
              
              {!isGenerating && !generatedContent && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use AI Writer</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Enter your topic or main idea in the "Topic" field</li>
                      <li>Select the appropriate content type and writing tone for your needs</li>
                      <li>Add optional keywords, target audience, and key points to customize</li>
                      <li>Adjust content length and creativity level using the controls</li>
                      <li>Click "Generate Content" and wait for the AI to create your text</li>
                      <li>Review and edit the generated content to ensure it meets your needs</li>
                      <li>Copy or download your content when satisfied with the result</li>
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
                <h3 className="font-medium text-lg mb-4">Content Types Explained</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base">Blog Post</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Informative, engaging content designed for regular publication. Typically conversational in tone with a clear structure and personal touch.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Article</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      More formal than blogs, articles present comprehensive information with journalistic rigor. Suitable for publications, websites, and in-depth coverage.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Social Media</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Brief, attention-grabbing content optimized for platforms like Twitter, Facebook, Instagram, or LinkedIn. Focuses on engagement and shareability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Marketing Copy</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Persuasive text designed to promote products, services, or ideas. Emphasizes benefits, creates urgency, and includes clear calls to action.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Business Document</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Formal content for professional settings such as reports, proposals, memos, or analyses. Structured, data-driven, and objective in presentation.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Creative Writing</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Expressive, imaginative content that uses literary techniques to engage readers. Suitable for stories, narratives, descriptions, and artistic expression.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Writing Tones Guide</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base">Professional</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Formal, polished language appropriate for business and academic contexts. Avoids contractions and casual expressions, maintains objective perspective.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Casual</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Relaxed, conversational style using everyday language. Includes contractions, simpler sentence structures, and a more approachable feel.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Friendly</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Warm, welcoming tone that builds connection with readers. Uses personal language, asks questions, and creates a sense of relationship.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Persuasive</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Compelling language designed to influence thinking or action. Uses strong verbs, emphasizes benefits, addresses objections, and creates urgency.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Informative</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Clear, educational tone focused on providing knowledge. Prioritizes accuracy, explains concepts thoroughly, and maintains neutral perspective.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Enthusiastic</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Energetic, passionate language that conveys excitement. Uses exclamations, strong positive language, and dynamic expressions to engage readers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Creating Effective Content</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Be specific with your topic - "Benefits of meditation for stress reduction" works better than just "Meditation"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Include keywords that are relevant to your subject and SEO goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Define your target audience to get content tailored to their interests and needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">List key points you want covered to ensure important information is included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Match content type and tone to your purpose and platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Adjust the creativity slider higher for more imaginative content or lower for more straightforward text</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Always edit AI-generated content to add your unique voice and perspective</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Editing AI Content</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Review for accuracy:</strong> AI can sometimes include information that isn't verifiable or accurate. Always fact-check important claims and statistics.
                  </p>
                  <p>
                    <strong>Add personal insights:</strong> Enhance AI content with your unique experiences, examples, and perspectives that the AI couldn't know.
                  </p>
                  <p>
                    <strong>Adjust the tone:</strong> Fine-tune the emotional tone and voice to ensure it matches your brand or personal style perfectly.
                  </p>
                  <p>
                    <strong>Check for repetition:</strong> AI may sometimes repeat ideas or phrases. Edit for conciseness and remove redundancies.
                  </p>
                  <p>
                    <strong>Update for currency:</strong> AI may not have the latest information. Make sure to update content with current data, trends, or developments.
                  </p>
                  <p>
                    <strong>Add specificity:</strong> Replace generic statements with specific examples, data points, or detailed descriptions to make content more valuable.
                  </p>
                  <p>
                    <strong>Enhance transitions:</strong> Smooth connections between ideas create better flow. Review and improve how paragraphs and sections connect.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Transform your ideas into polished, professional content with our versatile AI writing assistant.";
  
  const description = `
    Our AI Writer is a sophisticated content generation tool designed to help you create high-quality written material for a wide range of purposes. Whether you need engaging blog posts, professional articles, compelling marketing copy, concise social media content, formal business documents, or creative narratives, this versatile assistant can generate polished text tailored to your specific requirements.
    
    The tool combines advanced language processing technology with customizable parameters that give you precise control over the output. You can specify not just the topic and type of content, but also the tone, target audience, key points to include, content length, and creativity level. This multilevel customization ensures that the generated content aligns perfectly with your unique needs and objectives.
    
    What sets our AI Writer apart is its ability to adapt to different writing styles and formats. The system can produce content with a professional, casual, friendly, persuasive, informative, or enthusiastic tone, making it suitable for diverse contexts from corporate communications to creative storytelling. The first-person perspective option allows for more personal, conversational content when appropriate, while the creativity slider lets you balance between conservative, fact-focused writing and more imaginative, expressive text.
    
    The AI Writer begins by creating a structured outline for your content, ensuring logical organization and comprehensive coverage of your topic. It then generates fully-formed text with proper formatting, including headings, paragraphs, and natural transitions. While the AI produces high-quality drafts, the tool also enables you to edit and refine the output, allowing you to add your unique voice and ensure the content perfectly matches your vision.
  `;

  const howToUse = [
    "Enter your main topic or idea in the topic field, being as specific as possible for better results.",
    "Select the appropriate content type (blog post, article, social media, etc.) for your needs.",
    "Choose a writing tone that matches your desired style and audience expectations.",
    "Add optional keywords to ensure specific terms are incorporated into your content.",
    "Specify your target audience if you want content tailored to a particular group.",
    "Enter any key points you want to include in the generated content.",
    "Select your preferred content length and adjust the creativity slider according to your needs.",
    "Toggle the first-person perspective option if you want a more personal writing style.",
    "Click 'Generate Content' and review the outline and content created by the AI.",
    "Edit the generated content as needed and use the copy or download buttons to save your work."
  ];

  const features = [
    "Six versatile content types including blog posts, articles, social media, marketing copy, business documents, and creative writing",
    "Customizable writing tones with professional, casual, friendly, persuasive, informative, and enthusiastic options",
    "Adjustable creativity level for balancing between conservative factual content and imaginative expression",
    "Automatic outline generation for well-structured, logically organized content",
    "Target audience specification for content tailored to specific reader groups",
    "Optional first-person perspective for more personal, conversational content",
    "Integrated editing capabilities with word count tracking and formatting preservation"
  ];

  const faqs = [
    {
      question: "How do I get the best results from the AI Writer?",
      answer: "For optimal results, provide as much specific information as possible. Start with a detailed topic rather than a general one (e.g., 'Benefits of high-intensity interval training for busy professionals' instead of just 'Exercise'). Include relevant keywords, specify your target audience, and list key points you want to cover. Choose the appropriate content type and tone for your purpose, and experiment with different creativity levels to find the right balance for your needs. Remember that AI-generated content works best as a strong first draft—always review, edit, and add your personal touch to make the content truly shine."
    },
    {
      question: "How should I choose between different content types and tones?",
      answer: "Select your content type based on your purpose and where the content will appear: Blog posts work well for regular website content that's educational yet conversational. Articles are best for more formal, comprehensive coverage of a topic. Social media content is optimized for engagement on platforms like Twitter or Instagram. Marketing copy focuses on persuasion and conversion. Business documents provide formal, structured information for professional settings. Creative writing offers a more expressive, narrative approach. For tone, consider your audience's expectations: Professional tone works well in business and academic contexts, casual tone is great for blogs and personal content, friendly tone builds connection with readers, persuasive tone drives action, informative tone educates, and enthusiastic tone energizes and excites."
    },
    {
      question: "Is AI-generated content appropriate for all uses?",
      answer: "AI-generated content works well as a starting point for many applications, but its appropriateness varies by context. It's excellent for drafting blog posts, social media content, marketing materials, and creative brainstorming. However, for academic submissions, legal documents, or medical advice, AI content should be extensively reviewed, fact-checked, and cited according to relevant guidelines. Some institutions have specific policies about AI-generated content, so it's important to understand these requirements. The most effective approach is to view AI-generated content as a collaborative first draft that you enhance with your expertise, personal insights, and fact-checking. This combination of AI efficiency and human oversight typically produces the best results across various applications."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="ai-writer"
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

export default AIWriterDetailed;