import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const EssayRewriterDetailed = () => {
  const [originalEssay, setOriginalEssay] = useState("");
  const [rewrittenEssay, setRewrittenEssay] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rewritingStyle, setRewritingStyle] = useState("standard");
  const [preserveParagraphs, setPreserveParagraphs] = useState(true);
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [wordCount, setWordCount] = useState(0);
  const [newWordCount, setNewWordCount] = useState(0);
  const [plagiarismSafe, setPlagiarismSafe] = useState(false);
  const { toast } = useToast();

  // Calculate word count when original essay changes
  React.useEffect(() => {
    if (originalEssay) {
      const count = originalEssay.trim().split(/\s+/).length;
      setWordCount(count);
    } else {
      setWordCount(0);
    }
  }, [originalEssay]);

  const rewriteEssay = () => {
    if (originalEssay.trim().length < 100) {
      toast({
        title: "Essay too short",
        description: "Please enter an essay with at least 100 characters",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    setProgress(0);
    setPlagiarismSafe(false);

    // Simulate rewriting process with realistic timing based on length
    const totalTime = Math.min(3000, originalEssay.length * 5); // Cap at 3 seconds
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsRewriting(false);
          generateRewrittenEssay();
          return 100;
        }
        return prevProgress + 2;
      });
    }, totalTime / 50);
  };

  const generateRewrittenEssay = () => {
    // In a real app, this would call an API for advanced rewriting
    
    // Break essay into paragraphs
    const paragraphs = originalEssay.split(/\n\n+/);
    let rewritten = "";

    if (preserveParagraphs) {
      // Rewrite paragraph by paragraph while maintaining structure
      rewritten = paragraphs.map(paragraph => rewriteParagraph(paragraph)).join("\n\n");
    } else {
      // Treat entire essay as one block of text
      rewritten = rewriteParagraph(originalEssay);
    }

    setRewrittenEssay(rewritten);
    
    // Calculate new word count
    const newCount = rewritten.trim().split(/\s+/).length;
    setNewWordCount(newCount);
    
    // Set plagiarism safety indicator
    const similarity = calculateSimilarity(originalEssay, rewritten);
    setPlagiarismSafe(similarity < 0.3); // If less than 30% similar, considered safe

    toast({
      title: "Essay Rewritten Successfully",
      description: "Your essay has been rewritten according to your preferences.",
    });
  };

  const rewriteParagraph = (paragraph: string): string => {
    if (!paragraph.trim()) return "";

    // Different rewriting strategies based on selected style
    switch (rewritingStyle) {
      case "academic":
        return rewriteAcademic(paragraph);
      case "creative":
        return rewriteCreative(paragraph);
      case "simplified":
        return rewriteSimplified(paragraph);
      case "standard":
      default:
        return rewriteStandard(paragraph);
    }
  };

  const rewriteStandard = (text: string): string => {
    // Standard rewrite - change sentence structure and some vocabulary
    const sentences = text.split(/(?<=[.!?])\s+/);
    const rewrittenSentences = sentences.map(sentence => {
      // Apply different transformations based on creativity level
      if (Math.random() < creativityLevel / 100) {
        // More creative changes at higher creativity
        return transformSentenceStructure(sentence);
      } else {
        // Basic synonym replacement
        return replaceSynonyms(sentence);
      }
    });
    
    return rewrittenSentences.join(" ");
  };

  const rewriteAcademic = (text: string): string => {
    // Academic style - formal language, passive voice, scholarly terms
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const academicPhrases = [
      "Research suggests that", 
      "It can be observed that", 
      "Evidence indicates that",
      "Studies have demonstrated that",
      "It is worth noting that"
    ];
    
    const rewrittenSentences = sentences.map((sentence, index) => {
      if (index === 0 || Math.random() < 0.2) {
        // Occasionally add academic starter phrases
        return academicPhrases[Math.floor(Math.random() * academicPhrases.length)] + " " + 
               sentence.charAt(0).toLowerCase() + sentence.slice(1);
      }
      
      // Replace casual words with formal alternatives
      let result = sentence
        .replace(/a lot of/gi, "numerous")
        .replace(/get/gi, "obtain")
        .replace(/big/gi, "substantial")
        .replace(/show/gi, "demonstrate")
        .replace(/think/gi, "consider")
        .replace(/also/gi, "furthermore")
        .replace(/but/gi, "however")
        .replace(/use/gi, "utilize");
      
      // Attempt to use passive voice occasionally
      if (Math.random() < 0.3) {
        result = convertToPassive(result);
      }
      
      return result;
    });
    
    return rewrittenSentences.join(" ");
  };

  const rewriteCreative = (text: string): string => {
    // Creative style - expressive language, metaphors, vivid descriptions
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const creativePhrases = [
      "Like a tapestry of ideas, ",
      "Imagine a world where ",
      "In a symphony of concepts, ",
      "As if painting with words, ",
      "Dancing through the landscape of thoughts, "
    ];
    
    const rewrittenSentences = sentences.map((sentence, index) => {
      // Add creative phrases to some sentences
      if (index === 0 || Math.random() < 0.15) {
        return creativePhrases[Math.floor(Math.random() * creativePhrases.length)] + 
               sentence.charAt(0).toLowerCase() + sentence.slice(1);
      }
      
      // Add descriptive adjectives
      let words = sentence.split(" ");
      words = words.map(word => {
        if (word.length > 4 && Math.random() < 0.2 * (creativityLevel/100)) {
          const descriptiveAdjectives = ["captivating", "vivid", "enchanting", "remarkable", "brilliant"];
          return descriptiveAdjectives[Math.floor(Math.random() * descriptiveAdjectives.length)] + " " + word;
        }
        return word;
      });
      
      // Add metaphors occasionally
      let result = words.join(" ");
      if (Math.random() < 0.1 * (creativityLevel/100)) {
        const metaphors = [
          " - like stars in the night sky.",
          " - reminiscent of a gentle breeze on a summer day.",
          " - much like a river carving its path through stone.",
          " - as intricate as nature's finest designs.",
          " - similar to a melody that lingers in memory."
        ];
        result += metaphors[Math.floor(Math.random() * metaphors.length)];
      }
      
      return result;
    });
    
    return rewrittenSentences.join(" ");
  };

  const rewriteSimplified = (text: string): string => {
    // Simplified style - shorter sentences, simpler vocabulary
    // Break long sentences into shorter ones
    let sentences = text.split(/(?<=[.!?])\s+/);
    let simplifiedSentences: string[] = [];
    
    sentences.forEach(sentence => {
      const words = sentence.split(" ");
      
      // If sentence is too long, break it up
      if (words.length > 15) {
        const midpoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, midpoint).join(" ") + ".";
        const secondHalf = words.slice(midpoint).join(" ");
        
        simplifiedSentences.push(firstHalf);
        simplifiedSentences.push(secondHalf);
      } else {
        simplifiedSentences.push(sentence);
      }
    });
    
    // Simplify vocabulary
    simplifiedSentences = simplifiedSentences.map(sentence => {
      return sentence
        .replace(/utilize/gi, "use")
        .replace(/approximately/gi, "about")
        .replace(/sufficient/gi, "enough")
        .replace(/endeavor/gi, "try")
        .replace(/subsequently/gi, "then")
        .replace(/nevertheless/gi, "still")
        .replace(/furthermore/gi, "also")
        .replace(/additional/gi, "more")
        .replace(/initiate/gi, "start")
        .replace(/terminate/gi, "end");
    });
    
    return simplifiedSentences.join(" ");
  };

  // Helper functions for sentence transformation
  const transformSentenceStructure = (sentence: string): string => {
    // Apply different structural transformations
    const transformations = [
      // Invert clause order for sentences with commas
      (s: string) => {
        if (s.includes(",")) {
          const parts = s.split(",");
          if (parts.length >= 2) {
            return parts.slice(1).join(",").trim() + " " + parts[0].trim() + ".";
          }
        }
        return s;
      },
      
      // Add connector phrases
      (s: string) => {
        const connectors = ["In addition,", "Moreover,", "Furthermore,", "As a result,", "Consequently,"];
        return connectors[Math.floor(Math.random() * connectors.length)] + " " + s.charAt(0).toLowerCase() + s.slice(1);
      },
      
      // Change from active to passive or vice versa (simplified implementation)
      (s: string) => {
        if (s.match(/was|were/i) && s.match(/by/i)) {
          // Attempt to convert passive to active (very simplified)
          return s.replace(/was|were/i, "did").replace(/\sby\s[^.]+/i, "");
        } else if (s.match(/\b(I|we|they|he|she)\b/i)) {
          // Attempt to convert active to passive (very simplified)
          return s.replace(/\b(I|we|they|he|she)\s+([a-z]+ed)\b/i, "It was $2 by $1");
        }
        return s;
      }
    ];
    
    // Apply a random transformation
    const transformation = transformations[Math.floor(Math.random() * transformations.length)];
    return transformation(sentence);
  };

  const replaceSynonyms = (sentence: string): string => {
    // Simple synonym replacement
    return sentence
      .replace(/good/gi, "excellent")
      .replace(/bad/gi, "poor")
      .replace(/big/gi, "large")
      .replace(/small/gi, "tiny")
      .replace(/important/gi, "essential")
      .replace(/problem/gi, "issue")
      .replace(/difficult/gi, "challenging")
      .replace(/easy/gi, "straightforward")
      .replace(/interesting/gi, "fascinating")
      .replace(/beautiful/gi, "attractive");
  };

  const convertToPassive = (sentence: string): string => {
    // Very simplified passive voice conversion
    // This is a mock implementation - real NLP would be more sophisticated
    if (sentence.match(/\b(I|we|they|he|she)\s+([a-z]+)(s|ed)?\b/i)) {
      return sentence.replace(
        /\b(I|we|they|he|she)\s+([a-z]+)(s|ed)?\b/i, 
        function(match, pronoun, verb, suffix) {
          const newVerb = suffix === "s" ? "is" : suffix === "ed" ? "was" : "is";
          const newSuffix = suffix === "s" ? "ed" : suffix === "ed" ? "ed" : "ed";
          return `It ${newVerb} ${verb}${newSuffix} by ${pronoun.toLowerCase()}`;
        }
      );
    }
    return sentence;
  };

  const calculateSimilarity = (original: string, rewritten: string): number => {
    // This is a simplified similarity calculation
    // Real implementation would use more sophisticated metrics
    
    // Normalize texts
    const text1 = original.toLowerCase().replace(/[^\w\s]/g, "");
    const text2 = rewritten.toLowerCase().replace(/[^\w\s]/g, "");
    
    // Calculate word frequency
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    // Count common words
    const commonWords = words1.filter(word => words2.includes(word));
    
    // Calculate Jaccard similarity
    return commonWords.length / (words1.length + words2.length - commonWords.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenEssay);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten essay has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setOriginalEssay("");
    setRewrittenEssay("");
    setWordCount(0);
    setNewWordCount(0);
    setPlagiarismSafe(false);
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="original-essay" className="text-base font-medium">
                  Original Essay
                </Label>
                {wordCount > 0 && (
                  <Badge variant="outline" className="text-gray-600">
                    {wordCount} words
                  </Badge>
                )}
              </div>
              <Textarea
                id="original-essay"
                placeholder="Paste your essay here to rewrite it..."
                value={originalEssay}
                onChange={(e) => setOriginalEssay(e.target.value)}
                className="h-64 mt-2"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="rewriting-style" className="text-base font-medium">
                    Rewriting Style
                  </Label>
                  <Select
                    value={rewritingStyle}
                    onValueChange={setRewritingStyle}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="simplified">Simplified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="creativity-level" className="text-base font-medium">
                      Creativity Level
                    </Label>
                    <span className="text-sm text-gray-500">{creativityLevel}%</span>
                  </div>
                  <Slider
                    id="creativity-level"
                    min={10}
                    max={90}
                    step={10}
                    defaultValue={[50]}
                    value={[creativityLevel]}
                    onValueChange={(values) => setCreativityLevel(values[0])}
                    className="mt-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="preserve-paragraphs"
                  checked={preserveParagraphs}
                  onCheckedChange={setPreserveParagraphs}
                />
                <Label htmlFor="preserve-paragraphs">
                  Preserve paragraph structure
                </Label>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={rewriteEssay}
                  disabled={isRewriting || originalEssay.trim().length < 100}
                  className="bg-primary hover:bg-blue-700 transition"
                >
                  {isRewriting ? "Rewriting..." : "Rewrite Essay"}
                </Button>
                
                <Button
                  onClick={clearText}
                  variant="outline"
                  className="border-gray-300"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Essay Rewriter Styles</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Standard:</span>
                    <p className="text-sm text-gray-600">General rewriting that keeps the same tone while changing structure and vocabulary.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Academic:</span>
                    <p className="text-sm text-gray-600">Formal language with scholarly terms, passive voice, and more complex sentence structures.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Creative:</span>
                    <p className="text-sm text-gray-600">Expressive language with metaphors, descriptive adjectives, and vivid imagery.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Simplified:</span>
                    <p className="text-sm text-gray-600">Clearer, more concise language with shorter sentences and simpler vocabulary.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base font-medium">
                  Rewritten Essay
                </Label>
                <div className="flex items-center space-x-2">
                  {newWordCount > 0 && (
                    <Badge variant="outline" className="text-gray-600">
                      {newWordCount} words
                    </Badge>
                  )}
                  {plagiarismSafe && (
                    <Badge className="bg-green-50 text-green-700">
                      Plagiarism-Safe
                    </Badge>
                  )}
                </div>
              </div>
              
              {isRewriting ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Rewriting your essay...</p>
                </div>
              ) : rewrittenEssay ? (
                <div className="mt-2">
                  <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-auto">
                    <p className="whitespace-pre-wrap">{rewrittenEssay}</p>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    Your rewritten essay will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Tips for Better Results</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  For academic papers, use "Academic" style with 30-50% creativity
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Higher creativity levels produce more significant changes to your text
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  The "Preserve paragraph structure" option keeps your formatting intact
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  For creative writing, try the "Creative" style with 70-90% creativity
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use "Simplified" style when writing for younger audiences or non-experts
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Plagiarism Safety</h3>
              <p className="text-sm text-gray-600 mb-2">
                Our essay rewriter is designed to help you create unique content. The "Plagiarism-Safe" indicator appears when your rewritten essay differs significantly from the original text.
              </p>
              <p className="text-sm text-gray-600">
                However, always review the generated content and make additional edits as needed, especially for academic submissions where originality is crucial.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Transform your essays into fresh, unique content while preserving the original meaning.";
  
  const description = `
    Our Essay Rewriter tool is an advanced content transformation solution designed to help you rewrite essays, papers, and long-form content with professional results. Whether you need to refresh existing content, adapt material for different audiences, or ensure originality in your writing, this powerful tool provides intelligent rewrites that maintain the core meaning while changing the structure and expression.
    
    Using sophisticated language processing techniques, the Essay Rewriter analyzes your text at both sentence and paragraph levels to produce cohesive, natural-sounding results. Unlike simple word replacement tools, our Essay Rewriter understands context and semantic relationships, ensuring that the rewritten content flows naturally and makes logical sense.
    
    The tool offers multiple rewriting styles to match your specific needs: Standard for general purposes, Academic for scholarly writing, Creative for expressive content, and Simplified for improved readability. You can also adjust the creativity level to control how much variation appears in the output, and choose whether to preserve your original paragraph structure.
    
    Particularly valuable for students, writers, content creators, and professionals, the Essay Rewriter helps you overcome writer's block, improve your writing, and create alternative versions of your work. With its user-friendly interface and powerful capabilities, you can transform lengthy texts with just a few clicks.
  `;

  const howToUse = [
    "Paste your essay or long-form content into the input area (minimum 100 characters).",
    "Select your preferred rewriting style (Standard, Academic, Creative, or Simplified).",
    "Adjust the creativity level slider to control how much the text will be changed.",
    "Choose whether to preserve paragraph structure based on your formatting needs.",
    "Click the 'Rewrite Essay' button and wait for the process to complete.",
    "Review the rewritten essay, make any manual adjustments if needed, and copy to clipboard."
  ];

  const features = [
    "Four distinct rewriting styles to suit different writing contexts",
    "Adjustable creativity level to control the degree of transformation",
    "Paragraph structure preservation option to maintain your text organization",
    "Word count tracking to monitor content length before and after rewriting",
    "Plagiarism safety indicator for content that differs significantly from the original",
    "Context-aware rewriting that maintains coherence across paragraphs"
  ];

  const faqs = [
    {
      question: "Will the Essay Rewriter tool make my content 100% plagiarism-free?",
      answer: "While our Essay Rewriter significantly transforms your text to create a unique version, it's designed as an assistive tool rather than a guaranteed plagiarism solution. The 'Plagiarism-Safe' indicator appears when the rewritten content differs substantially from the original, but we recommend additional manual editing, especially for academic submissions. Always follow your institution's guidelines on academic integrity and proper citation."
    },
    {
      question: "What's the difference between the various rewriting styles?",
      answer: "The Standard style offers general rewriting while maintaining a similar tone. Academic style employs formal language, scholarly terms, and complex sentences suitable for academic papers. Creative style uses expressive language with metaphors and vivid descriptions ideal for narrative or marketing content. Simplified style creates clearer, more accessible content with shorter sentences and simpler vocabulary for improved readability."
    },
    {
      question: "Is there a limit to how much text I can rewrite at once?",
      answer: "The tool is optimized for essays and articles of typical length (up to several thousand words). While there's no strict character limit, very long documents (10,000+ words) might experience slower processing times. For extremely long texts, we recommend breaking them into sections and processing each section separately for optimal results."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="essay-rewriter"
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

export default EssayRewriterDetailed;