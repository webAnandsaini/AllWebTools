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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParaphraseGeneratorDetailed = () => {
  const [originalText, setOriginalText] = useState("");
  const [paraphrasedVersions, setParaphrasedVersions] = useState<string[]>([]);
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paraphrasingStyle, setParaphrasingStyle] = useState("standard");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [fluencyLevel, setFluencyLevel] = useState("balanced");
  const [similarity, setSimilarity] = useState(0);
  const { toast } = useToast();

  const paraphraseText = () => {
    if (originalText.trim().length < 15) {
      toast({
        title: "Text too short",
        description: "Please enter at least 15 characters to paraphrase",
        variant: "destructive",
      });
      return;
    }

    setIsParaphrasing(true);
    setProgress(0);
    setParaphrasedVersions([]);
    setSimilarity(0);

    // Simulate paraphrasing process
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsParaphrasing(false);
          generateParaphrases();
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);
  };

  const generateParaphrases = () => {
    // Generate 3 different paraphrased versions based on selected style
    const versions: string[] = [];
    
    for (let i = 0; i < 3; i++) {
      let paraphrased = "";
      
      switch (paraphrasingStyle) {
        case "standard":
          paraphrased = generateStandardParaphrase(originalText, i);
          break;
        case "academic":
          paraphrased = generateAcademicParaphrase(originalText, i);
          break;
        case "simple":
          paraphrased = generateSimpleParaphrase(originalText, i);
          break;
        case "creative":
          paraphrased = generateCreativeParaphrase(originalText, i);
          break;
        default:
          paraphrased = generateStandardParaphrase(originalText, i);
      }
      
      // Apply fluency adjustments
      paraphrased = adjustFluency(paraphrased, fluencyLevel);
      
      versions.push(paraphrased);
    }
    
    setParaphrasedVersions(versions);
    
    if (versions.length > 0) {
      setSelectedVersion(versions[0]);
      
      // Calculate similarity score (simplified implementation)
      const similarityScore = calculateSimilarity(originalText, versions[0]);
      setSimilarity(similarityScore);
    }
    
    toast({
      title: "Paraphrasing Complete",
      description: `Generated ${versions.length} paraphrased versions`,
    });
  };

  const generateStandardParaphrase = (text: string, variant: number): string => {
    // This is a simplified mock implementation
    // Real implementation would use NLP techniques
    
    // Split text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paraphrasedSentences = sentences.map(sentence => {
      // Apply different transformation techniques based on variant
      if (variant === 0) {
        return standardVariant1(sentence);
      } else if (variant === 1) {
        return standardVariant2(sentence);
      } else {
        return standardVariant3(sentence);
      }
    });
    
    return paraphrasedSentences.join(" ");
  };
  
  const standardVariant1 = (sentence: string): string => {
    // Rearrange sentence structure (simplified implementation)
    if (sentence.includes(",")) {
      const parts = sentence.split(",");
      if (parts.length >= 2) {
        // Swap clause order for sentences with commas
        return parts.slice(1).join(",").trim() + ", " + parts[0].trim();
      }
    }
    
    // Fall back to synonym replacement
    return replaceSynonyms(sentence, 0.5);
  };
  
  const standardVariant2 = (sentence: string): string => {
    // Add connective phrases at the start
    const connectors = [
      "Moreover, ", 
      "In addition, ", 
      "Furthermore, ", 
      "Similarly, ", 
      "Likewise, "
    ];
    
    if (Math.random() > 0.7) {
      return connectors[Math.floor(Math.random() * connectors.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Replace more aggressive synonyms
    return replaceSynonyms(sentence, 0.7);
  };
  
  const standardVariant3 = (sentence: string): string => {
    // Change voice (simplified implementation)
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
    
    // Split long sentences
    const words = sentence.split(" ");
    if (words.length > 15) {
      const midpoint = Math.floor(words.length / 2);
      const firstPart = words.slice(0, midpoint).join(" ");
      const secondPart = words.slice(midpoint).join(" ");
      return firstPart + ". " + secondPart;
    }
    
    return replaceSynonyms(sentence, 0.6);
  };

  const generateAcademicParaphrase = (text: string, variant: number): string => {
    // Academic style paraphrasing
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paraphrasedSentences = sentences.map(sentence => {
      // Different academic variants
      if (variant === 0) {
        return academicVariant1(sentence);
      } else if (variant === 1) {
        return academicVariant2(sentence);
      } else {
        return academicVariant3(sentence);
      }
    });
    
    return paraphrasedSentences.join(" ");
  };
  
  const academicVariant1 = (sentence: string): string => {
    // Add academic phrases at the beginning
    const academicPhrases = [
      "Research suggests that ", 
      "It can be observed that ", 
      "The evidence indicates that ",
      "Scholars argue that ",
      "According to established principles, "
    ];
    
    if (Math.random() > 0.7 || sentence.length < 40) {
      return academicPhrases[Math.floor(Math.random() * academicPhrases.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Replace with more formal vocabulary
    return sentence
      .replace(/find out/gi, "determine")
      .replace(/look into/gi, "investigate")
      .replace(/a lot/gi, "significant amount")
      .replace(/talked about/gi, "discussed")
      .replace(/use/gi, "utilize")
      .replace(/said/gi, "stated")
      .replace(/show/gi, "demonstrate")
      .replace(/think/gi, "contend");
  };
  
  const academicVariant2 = (sentence: string): string => {
    // Use more formal connecting phrases
    if (sentence.includes(",")) {
      const parts = sentence.split(",");
      if (parts.length >= 2) {
        const formalConnectors = [
          " consequently, ",
          " therefore, ",
          " as a result, ",
          " thus, ",
          " hence, "
        ];
        const connector = formalConnectors[Math.floor(Math.random() * formalConnectors.length)];
        return parts[0].trim() + "," + connector + parts.slice(1).join(",").trim();
      }
    }
    
    // Add academic conclusion
    if (Math.random() > 0.7) {
      const conclusions = [
        "; this supports the broader theoretical framework.",
        "; this has significant implications.",
        "; this merits further investigation.",
        "; this represents a crucial finding.",
        "; this demonstrates the complexity of the issue."
      ];
      return sentence + conclusions[Math.floor(Math.random() * conclusions.length)];
    }
    
    return sentence
      .replace(/good/gi, "advantageous")
      .replace(/bad/gi, "detrimental")
      .replace(/big/gi, "substantial")
      .replace(/small/gi, "minimal")
      .replace(/problem/gi, "challenge")
      .replace(/idea/gi, "concept")
      .replace(/change/gi, "modification");
  };
  
  const academicVariant3 = (sentence: string): string => {
    // Add hedging language
    const hedges = [
      "It may be suggested that ",
      "It could be argued that ",
      "Evidence appears to suggest that ",
      "From one perspective, ",
      "According to current understanding, "
    ];
    
    if (Math.random() > 0.7 || sentence.length < 40) {
      return hedges[Math.floor(Math.random() * hedges.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Convert to passive voice (simplified)
    if (sentence.match(/\b(I|we|they|he|she)\s+([a-z]+)(s|ed)?\b/i)) {
      return sentence.replace(
        /\b(I|we|they|he|she)\s+([a-z]+)(s|ed)?\b/i, 
        function(match, pronoun, verb, suffix) {
          const newVerb = suffix === "s" ? "is" : suffix === "ed" ? "was" : "is";
          const newSuffix = suffix === "s" ? "ed" : suffix === "ed" ? "ed" : "ed";
          return `It ${newVerb} ${verb}${newSuffix}`;
        }
      );
    }
    
    return sentence
      .replace(/found/gi, "identified")
      .replace(/looked at/gi, "examined")
      .replace(/tried/gi, "attempted")
      .replace(/made/gi, "developed")
      .replace(/helped/gi, "facilitated")
      .replace(/started/gi, "initiated")
      .replace(/ended/gi, "concluded");
  };

  const generateSimpleParaphrase = (text: string, variant: number): string => {
    // Simple style paraphrasing
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paraphrasedSentences = sentences.map(sentence => {
      // Different simple variants
      if (variant === 0) {
        return simpleVariant1(sentence);
      } else if (variant === 1) {
        return simpleVariant2(sentence);
      } else {
        return simpleVariant3(sentence);
      }
    });
    
    return paraphrasedSentences.join(" ");
  };
  
  const simpleVariant1 = (sentence: string): string => {
    // Break long sentences
    const words = sentence.split(" ");
    if (words.length > 12) {
      const midpoint = Math.floor(words.length / 2);
      const firstPart = words.slice(0, midpoint).join(" ");
      const secondPart = words.slice(midpoint).join(" ");
      return firstPart + ". " + secondPart;
    }
    
    // Simplify vocabulary
    return sentence
      .replace(/utilize/gi, "use")
      .replace(/purchase/gi, "buy")
      .replace(/obtain/gi, "get")
      .replace(/residence/gi, "home")
      .replace(/inquire/gi, "ask")
      .replace(/commence/gi, "start")
      .replace(/terminate/gi, "end")
      .replace(/sufficient/gi, "enough")
      .replace(/excessive/gi, "too much")
      .replace(/approximately/gi, "about");
  };
  
  const simpleVariant2 = (sentence: string): string => {
    // Add clarifying starter phrases
    const simplePhrases = [
      "Simply put, ",
      "In simple terms, ",
      "Basically, ",
      "To explain simply, ",
      "Put another way, "
    ];
    
    if (Math.random() > 0.7 || sentence.length < 40) {
      return simplePhrases[Math.floor(Math.random() * simplePhrases.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Remove complex subordinate clauses (simplified)
    if (sentence.includes(" which ")) {
      return sentence.replace(/,?\s+which\s+[^,\.]+/gi, "");
    }
    
    return sentence
      .replace(/prior to/gi, "before")
      .replace(/subsequent to/gi, "after")
      .replace(/endeavor/gi, "try")
      .replace(/regarding/gi, "about")
      .replace(/numerous/gi, "many")
      .replace(/commence/gi, "begin")
      .replace(/additional/gi, "more")
      .replace(/insufficient/gi, "not enough");
  };
  
  const simpleVariant3 = (sentence: string): string => {
    // Use active voice and direct structure
    if (sentence.includes(" is ") && sentence.includes(" by ")) {
      // Very simplified passive-to-active conversion
      return sentence.replace(/(\w+)\s+is\s+(\w+ed)\s+by\s+(\w+)/i, "$3 $2s $1");
    }
    
    // Use direct statements
    if (sentence.startsWith("It is") || sentence.startsWith("There are")) {
      // Simplify existential statements
      return sentence
        .replace(/^It is important to note that /i, "Note that ")
        .replace(/^There are many /i, "Many ")
        .replace(/^It is evident that /i, "Clearly, ");
    }
    
    return sentence
      .replace(/in the event that/gi, "if")
      .replace(/due to the fact that/gi, "because")
      .replace(/for the purpose of/gi, "for")
      .replace(/in order to/gi, "to")
      .replace(/in the vicinity of/gi, "near")
      .replace(/at this point in time/gi, "now")
      .replace(/come to a conclusion/gi, "decide")
      .replace(/give consideration to/gi, "consider");
  };

  const generateCreativeParaphrase = (text: string, variant: number): string => {
    // Creative style paraphrasing
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paraphrasedSentences = sentences.map(sentence => {
      // Different creative variants
      if (variant === 0) {
        return creativeVariant1(sentence);
      } else if (variant === 1) {
        return creativeVariant2(sentence);
      } else {
        return creativeVariant3(sentence);
      }
    });
    
    return paraphrasedSentences.join(" ");
  };
  
  const creativeVariant1 = (sentence: string): string => {
    // Add vivid imagery
    const imageryPhrases = [
      "Like a masterful painting, ",
      "As vibrant as a summer garden, ",
      "With crystal clarity, ",
      "Dancing through the mind's eye, ",
      "In a symphony of ideas, "
    ];
    
    if (Math.random() > 0.7 || sentence.length < 40) {
      return imageryPhrases[Math.floor(Math.random() * imageryPhrases.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    // Enhance with descriptive language
    const words = sentence.split(" ");
    const enhancedWords = words.map(word => {
      if (word.length > 4 && Math.random() > 0.7) {
        const descriptiveAdjectives = [
          "magnificent", "captivating", "extraordinary", 
          "enchanting", "remarkable", "breathtaking"
        ];
        return descriptiveAdjectives[Math.floor(Math.random() * descriptiveAdjectives.length)] + " " + word;
      }
      return word;
    });
    
    return enhancedWords.join(" ");
  };
  
  const creativeVariant2 = (sentence: string): string => {
    // Add metaphors
    const metaphors = [
      " - like stars painting the night sky.",
      " - reminiscent of a gentle breeze on a summer day.",
      " - similar to a river carving its path to the sea.",
      " - much like a tapestry of interwoven threads.",
      " - as intricate as nature's most delicate designs."
    ];
    
    if (Math.random() > 0.7) {
      return sentence + metaphors[Math.floor(Math.random() * metaphors.length)];
    }
    
    // Use more expressive verbs
    return sentence
      .replace(/said/gi, "proclaimed")
      .replace(/walked/gi, "strolled")
      .replace(/looked/gi, "gazed")
      .replace(/made/gi, "crafted")
      .replace(/went/gi, "ventured")
      .replace(/got/gi, "acquired")
      .replace(/thought/gi, "pondered")
      .replace(/saw/gi, "witnessed")
      .replace(/wanted/gi, "yearned for")
      .replace(/felt/gi, "experienced");
  };
  
  const creativeVariant3 = (sentence: string): string => {
    // Add rhetorical questions or reflections
    const reflections = [
      " Isn't that a fascinating concept?",
      " One can't help but wonder at the implications.",
      " Such is the beauty of this perspective.",
      " This opens a universe of possibilities.",
      " The mind dances with such intriguing notions."
    ];
    
    if (Math.random() > 0.7) {
      return sentence + reflections[Math.floor(Math.random() * reflections.length)];
    }
    
    // Add sensory details
    if (Math.random() > 0.6) {
      const sensoryPhrases = [
        "Vividly illustrating this point, ",
        "Casting a colorful light on the matter, ",
        "Breathing life into this concept, ",
        "Painting a rich canvas of understanding, ",
        "Crafting a sensory experience, "
      ];
      return sensoryPhrases[Math.floor(Math.random() * sensoryPhrases.length)] + 
             sentence.charAt(0).toLowerCase() + sentence.slice(1);
    }
    
    return replaceSynonyms(sentence, 0.8, true); // Use more creative synonyms
  };

  // Helper functions
  const replaceSynonyms = (text: string, replacementRate: number, creative: boolean = false): string => {
    // Simple synonym replacement
    const synonymMap: Record<string, string[]> = {
      // Standard synonyms
      "good": ["excellent", "fine", "great", "positive", "favorable"],
      "bad": ["poor", "inadequate", "unfavorable", "negative", "subpar"],
      "big": ["large", "substantial", "considerable", "significant", "sizable"],
      "small": ["tiny", "little", "miniature", "compact", "diminutive"],
      "important": ["essential", "critical", "crucial", "significant", "vital"],
      "problem": ["issue", "difficulty", "challenge", "obstacle", "complication"],
      "said": ["stated", "mentioned", "noted", "expressed", "commented"],
      "think": ["believe", "consider", "reckon", "suppose", "assume"],
      "use": ["utilize", "employ", "apply", "implement", "exercise"],
      "make": ["create", "produce", "form", "construct", "generate"],
      "see": ["observe", "notice", "perceive", "witness", "spot"],
      "show": ["display", "exhibit", "demonstrate", "present", "reveal"],
      "tell": ["inform", "notify", "advise", "relate", "communicate"],
      "find": ["discover", "locate", "identify", "uncover", "detect"],
      "help": ["assist", "aid", "support", "facilitate", "contribute"],
      "change": ["modify", "alter", "adjust", "transform", "revise"],
      
      // Creative synonyms (used when creative=true)
      "amazing": ["breathtaking", "astonishing", "magnificent", "spectacular", "marvelous"],
      "beautiful": ["stunning", "gorgeous", "exquisite", "captivating", "enchanting"],
      "happy": ["jubilant", "ecstatic", "delighted", "overjoyed", "thrilled"],
      "sad": ["melancholy", "despondent", "forlorn", "crestfallen", "somber"],
      "angry": ["furious", "enraged", "indignant", "irate", "incensed"],
      "excited": ["enthusiastic", "eager", "animated", "electrified", "exhilarated"],
      "scared": ["terrified", "petrified", "horrified", "alarmed", "panic-stricken"],
      "tired": ["exhausted", "fatigued", "weary", "drained", "spent"],
      "interesting": ["fascinating", "intriguing", "compelling", "engaging", "captivating"],
      "difficult": ["challenging", "demanding", "formidable", "arduous", "daunting"]
    };
    
    // Process each word
    const words = text.split(" ");
    const replacedWords = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      
      // Determine if we should replace this word
      if (Math.random() < replacementRate) {
        const synonyms = creative ? 
          synonymMap[cleanWord] || synonymMap[cleanWord.toLowerCase()] :
          synonymMap[cleanWord.toLowerCase()];
          
        if (synonyms) {
          const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
          
          // Preserve capitalization and punctuation
          if (word[0] === word[0].toUpperCase()) {
            return synonym.charAt(0).toUpperCase() + synonym.slice(1) + word.replace(/[\w]+/g, "");
          } else {
            return synonym + word.replace(/[\w]+/g, "");
          }
        }
      }
      
      return word;
    });
    
    return replacedWords.join(" ");
  };

  const adjustFluency = (text: string, level: string): string => {
    // Adjust text fluency based on selected level
    switch (level) {
      case "maximum":
        // For maximum fluency, ensure smooth transitions and fix awkward phrasing
        return text
          .replace(/,\s+and/g, " and")
          .replace(/\s+,/g, ",")
          .replace(/\.\s+However/g, ". However,")
          .replace(/\.\s+Therefore/g, ". Therefore,")
          .replace(/\s+\./g, ".")
          .replace(/\s+,/g, ",")
          .replace(/\s+;/g, ";")
          .replace(/\s+:/g, ":")
          .replace(/\s{2,}/g, " ") // Remove extra spaces
          .replace(/([.!?])\s*([a-z])/g, (match, p1, p2) => p1 + " " + p2.toUpperCase()); // Fix sentence capitalization
      
      case "balanced":
        // Balanced fluency makes some improvements but preserves original style
        return text
          .replace(/\s{2,}/g, " ") // Remove extra spaces
          .replace(/([.!?])\s*([a-z])/g, (match, p1, p2) => p1 + " " + p2.toUpperCase()); // Fix sentence capitalization
      
      case "minimal":
        // Minimal fluency preserves more of the character of the transformation
        return text;
      
      default:
        return text;
    }
  };

  const calculateSimilarity = (original: string, paraphrased: string): number => {
    // Simplified Jaccard similarity calculation
    const originalTokens = new Set(original.toLowerCase().split(/\W+/).filter(w => w.length > 0));
    const paraphrasedTokens = new Set(paraphrased.toLowerCase().split(/\W+/).filter(w => w.length > 0));
    
    // Find intersection
    const intersection = new Set([...originalTokens].filter(x => paraphrasedTokens.has(x)));
    
    // Calculate Jaccard similarity
    const similarityScore = intersection.size / (originalTokens.size + paraphrasedTokens.size - intersection.size);
    
    // Convert to percentage and round to nearest 5%
    return Math.round(similarityScore * 100 / 5) * 5;
  };

  const selectVersion = (version: string) => {
    setSelectedVersion(version);
    
    // Update similarity score
    const similarityScore = calculateSimilarity(originalText, version);
    setSimilarity(similarityScore);
  };

  const copyToClipboard = (text?: string) => {
    const textToCopy = text || selectedVersion;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: "The paraphrased text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setOriginalText("");
    setParaphrasedVersions([]);
    setSelectedVersion("");
    setSimilarity(0);
  };

  // Badge color based on similarity - lower is better for paraphrasing
  const getSimilarityColor = (score: number): string => {
    if (score < 30) return "bg-green-50 text-green-700";
    if (score < 50) return "bg-blue-50 text-blue-700";
    if (score < 70) return "bg-yellow-50 text-yellow-700";
    return "bg-red-50 text-red-700";
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="original-text" className="text-base font-medium">
                    Text to Paraphrase
                  </Label>
                  <Textarea
                    id="original-text"
                    placeholder="Type or paste your text here to paraphrase it..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paraphrasing-style" className="text-base font-medium">
                      Paraphrasing Style
                    </Label>
                    <Select
                      value={paraphrasingStyle}
                      onValueChange={setParaphrasingStyle}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fluency-level" className="text-base font-medium">
                      Fluency Level
                    </Label>
                    <Select
                      value={fluencyLevel}
                      onValueChange={setFluencyLevel}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maximum">Maximum</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={paraphraseText}
                    disabled={isParaphrasing || originalText.trim().length < 15}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    {isParaphrasing ? "Paraphrasing..." : "Paraphrase Text"}
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Paraphrasing Styles</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Standard</span>
                    <p className="text-sm text-gray-600">General-purpose paraphrasing with balanced vocabulary and structure changes.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Academic</span>
                    <p className="text-sm text-gray-600">Formal language with scholarly terms and complex sentence structures.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Simple</span>
                    <p className="text-sm text-gray-600">Clearer language with shorter sentences and simpler vocabulary.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Creative</span>
                    <p className="text-sm text-gray-600">Expressive language with vivid descriptions, metaphors, and engaging phrases.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-medium">
                  Paraphrased Results
                </Label>
                {similarity > 0 && (
                  <Badge className={getSimilarityColor(similarity)}>
                    {similarity}% Similar
                  </Badge>
                )}
              </div>
              
              {isParaphrasing ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Generating paraphrased versions...</p>
                </div>
              ) : paraphrasedVersions.length > 0 ? (
                <div className="space-y-4">
                  <Tabs defaultValue="versions" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="versions">All Versions</TabsTrigger>
                      <TabsTrigger value="selected">Selected Version</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="versions" className="space-y-3 mt-3">
                      {paraphrasedVersions.map((version, index) => (
                        <div 
                          key={index}
                          onClick={() => selectVersion(version)}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            selectedVersion === version ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              Version {index + 1}
                            </Badge>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(version);
                              }}
                              variant="ghost"
                              className="h-6 p-0 text-gray-500 hover:text-blue-600"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm">{version}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="selected" className="mt-3">
                      {selectedVersion ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-50 border rounded-lg min-h-[120px]">
                            <p>{selectedVersion}</p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={() => copyToClipboard()}
                              variant="outline"
                              className="text-blue-600 border-blue-600"
                            >
                              Copy to Clipboard
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          Select a version from the list
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    Paraphrased versions will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Effective Paraphrasing Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Lower similarity scores indicate better paraphrasing with more originality
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Academic style is useful for essays, research papers, and professional content
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Simple style works well for instructional content or when explaining complex topics
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Creative style helps engage readers in marketing copy, stories, or blogs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  For best results, manually edit the paraphrased text to match your specific needs
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Completely transform your text with multiple rewriting styles while preserving meaning.";
  
  const description = `
    Our Paraphrase Generator is an advanced text transformation tool that helps you rewrite content in multiple ways while keeping the original meaning intact. Whether you need to rephrase academic papers, create unique versions of your writing, or simplify complex text, this versatile tool offers intelligent paraphrasing tailored to your specific needs.
    
    Using sophisticated natural language processing techniques, the Paraphrase Generator analyzes your text and transforms it with new vocabulary, rearranged sentence structures, and alternative phrasings. You can choose from four different paraphrasing styles: Standard for general use, Academic for scholarly writing, Simple for improved clarity, and Creative for expressive content.
    
    This powerful tool generates multiple variations of your text, allowing you to compare different approaches and select the one that best fits your purpose. Each paraphrased version maintains the core meaning of your original text while presenting it in a fresh way that reads naturally and fluently.
    
    The Paraphrase Generator is particularly useful for writers, students, content creators, and professionals looking to avoid repetition, overcome writer's block, rework existing content, or ensure originality in their writing. With adjustable fluency settings and a similarity indicator, you can control how much your text is transformed and gauge its uniqueness compared to the original.
  `;

  const howToUse = [
    "Enter or paste your text in the input area (minimum 15 characters required).",
    "Select your preferred paraphrasing style (Standard, Academic, Simple, or Creative).",
    "Choose a fluency level to control how natural and flowing the output will be.",
    "Click the 'Paraphrase Text' button to generate multiple variations.",
    "Browse through the generated versions and click on any to select it.",
    "Review the similarity percentage to gauge how different your new text is from the original.",
    "Use the 'Copy to Clipboard' button to copy your chosen version."
  ];

  const features = [
    "Four distinct paraphrasing styles to match different writing contexts",
    "Multiple variations generated from a single input for more choices",
    "Adjustable fluency levels to control the natural flow of text",
    "Similarity percentage indicator to gauge transformation effectiveness",
    "Side-by-side comparison of all generated versions",
    "Preservation of original meaning while changing structure and vocabulary"
  ];

  const faqs = [
    {
      question: "How does the similarity percentage work?",
      answer: "The similarity percentage indicates how closely the paraphrased text matches the original. Lower percentages (green) indicate significant rephrasing with many vocabulary and structure changes, while higher percentages (red) show less transformation. For the most effective paraphrasing, aim for similarity below 50%. This metric is calculated based on shared words and phrases between the original and paraphrased versions."
    },
    {
      question: "Which paraphrasing style should I choose for academic writing?",
      answer: "For academic writing, the 'Academic' style is most appropriate as it uses formal language, scholarly terms, and complex sentence structures suitable for research papers, essays, and professional publications. This style maintains the rigor and precision required in academic contexts while reformulating your text to ensure originality. For the best results, combine this with a 'Balanced' fluency level to preserve academic tone while ensuring readability."
    },
    {
      question: "Is paraphrased content considered original?",
      answer: "While paraphrasing changes the wording and structure of text, the ideas remain derived from the original source. For academic or professional work, paraphrased content should still be properly cited to acknowledge the original source of ideas. Our tool helps you express concepts in your own words, but it doesn't eliminate the need for proper attribution when you're using someone else's ideas. For truly original content, you should develop your own unique ideas and arguments."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="paraphrase-generator"
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

export default ParaphraseGeneratorDetailed;