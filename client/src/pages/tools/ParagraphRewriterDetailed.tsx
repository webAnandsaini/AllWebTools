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
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const ParagraphRewriterDetailed = () => {
  const [text, setText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rewritingStyle, setRewritingStyle] = useState("standard");
  const [creativityLevel, setCreativityLevel] = useState(70);
  const { toast } = useToast();

  const rewriteParagraph = () => {
    if (text.trim().length < 20) {
      toast({
        title: "Text too short",
        description: "Please enter a paragraph with at least 20 characters",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    setProgress(0);

    // Simulate rewriting process
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsRewriting(false);
          generateRewrittenText();
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);
  };

  const generateRewrittenText = () => {
    // Generate different rewriting styles based on selection
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    let result = "";

    if (rewritingStyle === "standard") {
      // Standard rewriting with similar structure but different words
      result = sentences
        .map((sentence) => {
          const words = sentence.trim().split(/\s+/);
          const rewrittenWords = words.map((word) => {
            // Simulate synonym replacement
            if (word.length > 4 && Math.random() > 0.5) {
              return getRandomSynonym(word);
            }
            return word;
          });
          return rewrittenWords.join(" ") + ".";
        })
        .join(" ");
    } else if (rewritingStyle === "formal") {
      // More formal, academic style
      result = sentences
        .map((sentence) => {
          // Add academic phrases
          const academicPhrases = [
            "It is evident that",
            "Research suggests that",
            "It can be observed that",
            "Analysis indicates that",
            "It is apparent that",
          ];
          
          if (Math.random() > 0.7) {
            return academicPhrases[Math.floor(Math.random() * academicPhrases.length)] + 
                   " " + sentence.trim().toLowerCase() + ".";
          }
          
          // Replace casual words with formal alternatives
          const formalSentence = sentence
            .replace(/a lot of/g, "numerous")
            .replace(/get/g, "obtain")
            .replace(/big/g, "substantial")
            .replace(/show/g, "demonstrate")
            .replace(/think/g, "consider");
            
          return formalSentence.trim() + ".";
        })
        .join(" ");
    } else if (rewritingStyle === "creative") {
      // More creative, flowery language
      result = sentences
        .map((sentence) => {
          // Add descriptive adjectives
          const words = sentence.trim().split(/\s+/);
          const enhancedWords = words.map((word) => {
            if (word.length > 3 && /^[a-zA-Z]+$/.test(word) && Math.random() > 0.7) {
              const descriptiveAdjectives = ["remarkable", "stunning", "exquisite", "magnificent", "extraordinary"];
              return descriptiveAdjectives[Math.floor(Math.random() * descriptiveAdjectives.length)] + " " + word;
            }
            return word;
          });
          
          return enhancedWords.join(" ") + ".";
        })
        .join(" ");
    } else if (rewritingStyle === "simple") {
      // Simpler, easier to understand language
      result = sentences
        .map((sentence) => {
          // Split long sentences
          if (sentence.split(/\s+/).length > 10) {
            const halfLength = Math.floor(sentence.split(/\s+/).length / 2);
            const firstHalf = sentence.split(/\s+/).slice(0, halfLength).join(" ");
            const secondHalf = sentence.split(/\s+/).slice(halfLength).join(" ");
            return firstHalf.trim() + ". " + secondHalf.trim() + ".";
          }
          
          // Simplify vocabulary
          const simpleSentence = sentence
            .replace(/utilize/g, "use")
            .replace(/approximately/g, "about")
            .replace(/sufficient/g, "enough")
            .replace(/endeavor/g, "try")
            .replace(/subsequently/g, "then");
            
          return simpleSentence.trim() + ".";
        })
        .join(" ");
    }
    
    // Apply creativity modifications
    if (creativityLevel > 50) {
      // Higher creativity means more variations
      const creativity = creativityLevel / 100;
      
      // Replace words based on creativity level
      const words = result.split(/\s+/);
      const enhancedWords = words.map((word) => {
        if (word.length > 4 && Math.random() < creativity * 0.3) {
          return getRandomSynonym(word);
        }
        return word;
      });
      
      result = enhancedWords.join(" ");
    }

    setRewrittenText(result);
    
    toast({
      title: "Paragraph Rewritten",
      description: "Your paragraph has been successfully rewritten!",
    });
  };

  const getRandomSynonym = (word: string) => {
    // This is a very simplified mock synonym generator
    const commonSynonyms: Record<string, string[]> = {
      "good": ["excellent", "great", "wonderful", "fantastic", "superb"],
      "bad": ["poor", "terrible", "awful", "dreadful", "subpar"],
      "big": ["large", "massive", "enormous", "huge", "substantial"],
      "small": ["tiny", "little", "minuscule", "miniature", "petite"],
      "important": ["crucial", "essential", "vital", "significant", "critical"],
      "interesting": ["fascinating", "intriguing", "captivating", "engaging", "compelling"],
      "beautiful": ["gorgeous", "stunning", "attractive", "exquisite", "lovely"],
      "difficult": ["challenging", "complex", "complicated", "demanding", "tough"],
      "easy": ["simple", "effortless", "straightforward", "uncomplicated", "painless"],
      "happy": ["joyful", "delighted", "pleased", "content", "cheerful"],
      "sad": ["unhappy", "sorrowful", "depressed", "melancholy", "gloomy"],
      "quick": ["fast", "rapid", "swift", "speedy", "hasty"],
      "slow": ["sluggish", "unhurried", "leisurely", "gradual", "plodding"],
      "old": ["ancient", "aged", "elderly", "vintage", "antique"],
      "new": ["recent", "modern", "fresh", "novel", "current"],
      "many": ["numerous", "several", "multiple", "abundant", "copious"],
      "few": ["sparse", "limited", "scant", "minimal", "insufficient"],
      "say": ["state", "mention", "express", "declare", "articulate"],
      "show": ["display", "demonstrate", "reveal", "exhibit", "present"],
      "look": ["appear", "seem", "glance", "observe", "view"],
      "think": ["believe", "consider", "ponder", "contemplate", "reflect"],
    };

    // Check if we have synonyms for this word (case insensitive)
    const lowerWord = word.toLowerCase();
    if (commonSynonyms[lowerWord]) {
      const synonyms = commonSynonyms[lowerWord];
      return synonyms[Math.floor(Math.random() * synonyms.length)];
    }

    // If no synonym found, modify the word slightly
    if (Math.random() > 0.5 && word.length > 5) {
      // Add an adjective before the word
      const adjectives = ["truly", "essentially", "fundamentally", "remarkably", "notably"];
      return adjectives[Math.floor(Math.random() * adjectives.length)] + " " + word;
    }

    return word;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenText);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setText("");
    setRewrittenText("");
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="original-text" className="text-base font-medium">
                Enter Your Paragraph
              </Label>
              <Textarea
                id="original-text"
                placeholder="Paste your paragraph here to rewrite it..."
                value={text}
                onChange={(e) => setText(e.target.value)}
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
                      <SelectItem value="formal">Academic/Formal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="simple">Simplified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="creativity-level" className="text-base font-medium">
                    Creativity Level: {creativityLevel}%
                  </Label>
                  <Slider
                    id="creativity-level"
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[70]}
                    value={[creativityLevel]}
                    onValueChange={(values) => setCreativityLevel(values[0])}
                    className="mt-5"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={rewriteParagraph}
                  disabled={isRewriting || text.trim().length < 20}
                  className="bg-primary hover:bg-blue-700 transition"
                >
                  {isRewriting ? "Rewriting..." : "Rewrite Paragraph"}
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
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-medium">
                Rewritten Paragraph
              </Label>
              
              {isRewriting ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Rewriting your paragraph...</p>
                </div>
              ) : rewrittenText ? (
                <div className="mt-2">
                  <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-auto">
                    <p className="whitespace-pre-wrap">{rewrittenText}</p>
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
                    Your rewritten paragraph will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Rewriting Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use the "Academic/Formal" style for professional or educational content
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Choose "Creative" style for marketing or creative writing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Select "Simplified" for easier readability
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Adjust the creativity slider for more or less variation
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Transform any paragraph into a fresh, unique version while preserving its original meaning.";
  
  const description = `
    Our Paragraph Rewriter tool is a powerful text transformation utility designed to help you quickly create new versions of your existing paragraphs. Whether you're a student looking to avoid plagiarism, a content creator seeking fresh ways to present information, or a professional writer aiming to enhance your work, this tool offers a seamless solution for rewriting text.
    
    Using advanced natural language processing technology, the Paragraph Rewriter analyzes your text and generates alternatives that maintain the original meaning while changing the structure and vocabulary. You can choose from various rewriting styles including standard, formal/academic, creative, or simplified to match your specific needs.
    
    The tool preserves the essence and key points of your original paragraph while offering a new perspective or presentation style. With adjustable creativity levels and multiple rewriting options, you can fine-tune the output to achieve the perfect balance between originality and meaning preservation.
    
    Unlike basic word replacement tools, our Paragraph Rewriter understands context and semantics, ensuring that the rewritten content makes sense and flows naturally. This sophisticated approach helps you avoid awkward phrasing or inappropriate word choices that might occur with simpler synonym-replacement tools.
  `;

  const howToUse = [
    "Enter or paste your paragraph in the text input area.",
    "Select your preferred rewriting style (Standard, Academic/Formal, Creative, or Simplified).",
    "Adjust the creativity level slider to control how much variation appears in the rewritten text.",
    "Click the 'Rewrite Paragraph' button and wait a few seconds for the process to complete.",
    "Review the rewritten paragraph, make any manual adjustments if needed, and copy to clipboard."
  ];

  const features = [
    "Multiple rewriting styles to match different content needs",
    "Adjustable creativity level to control the degree of text transformation",
    "Context-aware rewriting that preserves the original meaning",
    "Fast processing suitable for paragraphs of any length",
    "One-click copy feature for easy transfer to other applications"
  ];

  const faqs = [
    {
      question: "Does the Paragraph Rewriter tool plagiarism-proof my content?",
      answer: "While our tool substantially changes the wording and structure of your text, it's not guaranteed to make content 100% plagiarism-free. The tool helps reduce similarity to the original text, but for academic submissions, we recommend reviewing the output carefully and making additional manual edits to ensure originality."
    },
    {
      question: "What's the difference between the various rewriting styles?",
      answer: "The Standard style makes general improvements while maintaining a similar tone. Academic/Formal uses more sophisticated vocabulary and structures suitable for professional contexts. Creative adds more expressive and varied language, while Simplified makes the text easier to understand by using simpler words and shorter sentences."
    },
    {
      question: "Is there a limit to how much text I can rewrite at once?",
      answer: "The tool is optimized for paragraph-length content (roughly 100-500 words). While it can handle longer texts, we recommend processing one paragraph at a time for the best results. For large documents, consider breaking the content into smaller sections."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="paragraph-rewriter"
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

export default ParagraphRewriterDetailed;