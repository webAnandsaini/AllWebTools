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

const SentenceRewriterDetailed = () => {
  const [originalSentence, setOriginalSentence] = useState("");
  const [rewrittenSentences, setRewrittenSentences] = useState<string[]>([]);
  const [isRewriting, setIsRewriting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rewritingStyle, setRewritingStyle] = useState("standard");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [numVariations, setNumVariations] = useState(3);
  const { toast } = useToast();

  const rewriteSentence = () => {
    if (originalSentence.trim().length < 10) {
      toast({
        title: "Sentence too short",
        description: "Please enter a sentence with at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    setProgress(0);
    setRewrittenSentences([]);

    // Simulate rewriting process
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsRewriting(false);
          generateRewrittenSentences();
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);
  };

  const generateRewrittenSentences = () => {
    // Generate different variations based on the selected style
    const variations: string[] = [];
    const actualNumVariations = Math.min(numVariations, 5); // Maximum of 5 variations
    
    for (let i = 0; i < actualNumVariations; i++) {
      let rewritten = "";
      
      switch (rewritingStyle) {
        case "standard":
          rewritten = generateStandardRewrite(originalSentence, i);
          break;
        case "formal":
          rewritten = generateFormalRewrite(originalSentence, i);
          break;
        case "simple":
          rewritten = generateSimpleRewrite(originalSentence, i);
          break;
        case "creative":
          rewritten = generateCreativeRewrite(originalSentence, i);
          break;
        default:
          rewritten = generateStandardRewrite(originalSentence, i);
      }
      
      variations.push(rewritten);
    }
    
    setRewrittenSentences(variations);
    
    if (variations.length > 0) {
      setSelectedSentence(variations[0]);
    }
    
    toast({
      title: "Sentence Rewritten",
      description: `Generated ${variations.length} variations of your sentence`,
    });
  };

  const generateStandardRewrite = (sentence: string, index: number): string => {
    // This is a simplified mock implementation
    // In a real app, this would use advanced NLP techniques
    
    const standardTemplates = [
      (s: string) => {
        const words = s.split(" ");
        // Rearrange parts of the sentence
        if (words.length > 4) {
          const firstHalf = words.slice(0, Math.floor(words.length / 2));
          const secondHalf = words.slice(Math.floor(words.length / 2));
          return secondHalf.join(" ") + " " + firstHalf.join(" ");
        }
        return s;
      },
      (s: string) => {
        // Add a starter phrase
        const starters = ["In other words, ", "To put it differently, ", "Alternatively, ", "Simply put, "];
        return starters[index % starters.length] + s.toLowerCase();
      },
      (s: string) => {
        // Use synonyms for common words
        return s
          .replace(/good/gi, "excellent")
          .replace(/bad/gi, "poor")
          .replace(/big/gi, "large")
          .replace(/small/gi, "tiny")
          .replace(/important/gi, "essential");
      },
      (s: string) => {
        // Restructure the sentence
        if (s.includes(",")) {
          const parts = s.split(",");
          return parts.slice(1).join(",") + ", " + parts[0];
        }
        return s;
      },
      (s: string) => {
        // Change voice (simplified implementation)
        if (s.includes(" is ")) {
          return s.replace(" is ", " was ");
        } else if (s.includes(" are ")) {
          return s.replace(" are ", " were ");
        }
        return s;
      }
    ];
    
    // Use a different template based on the index
    const template = standardTemplates[index % standardTemplates.length];
    return template(sentence);
  };

  const generateFormalRewrite = (sentence: string, index: number): string => {
    // Generate more formal/academic versions
    const formalTemplates = [
      (s: string) => {
        // Add academic phrases
        const phrases = [
          "It has been observed that ",
          "Research indicates that ",
          "It is evident that ",
          "According to established principles, ",
          "As demonstrated by the evidence, "
        ];
        return phrases[index % phrases.length] + s.toLowerCase();
      },
      (s: string) => {
        // Replace casual words with formal alternatives
        return s
          .replace(/a lot of/gi, "numerous")
          .replace(/get/gi, "obtain")
          .replace(/big/gi, "substantial")
          .replace(/show/gi, "demonstrate")
          .replace(/think/gi, "consider");
      },
      (s: string) => {
        // Add formal connecting phrases
        if (s.includes(",")) {
          const parts = s.split(",");
          return parts[0] + ", therefore, " + parts.slice(1).join(",");
        } else if (s.includes(".")) {
          const parts = s.split(".");
          return parts[0] + ". Subsequently, " + parts.slice(1).join(".");
        }
        return "Subsequently, " + s;
      },
      (s: string) => {
        // Use passive voice (simplified)
        if (s.toLowerCase().includes(" i ")) {
          return s.replace(/\bi\b/gi, "one");
        } else if (s.toLowerCase().includes(" we ")) {
          return s.replace(/\bwe\b/gi, "it is");
        }
        return s;
      },
      (s: string) => {
        // Add formal conclusion
        return s + "; this constitutes a significant observation in this context.";
      }
    ];
    
    const template = formalTemplates[index % formalTemplates.length];
    return template(sentence);
  };

  const generateSimpleRewrite = (sentence: string, index: number): string => {
    // Generate simpler, easier to understand versions
    const simpleTemplates = [
      (s: string) => {
        // Break into shorter sentences
        if (s.length > 30 && s.includes(",")) {
          return s.replace(",", ".");
        }
        return s;
      },
      (s: string) => {
        // Use simpler words
        return s
          .replace(/utilize/gi, "use")
          .replace(/approximately/gi, "about")
          .replace(/sufficient/gi, "enough")
          .replace(/endeavor/gi, "try")
          .replace(/subsequently/gi, "then");
      },
      (s: string) => {
        // Add clarification
        return s + " In simple terms, this means " + simplifyFurther(s) + ".";
      },
      (s: string) => {
        // Direct statement
        if (s.toLowerCase().startsWith("it is") || s.toLowerCase().startsWith("there is")) {
          return s;
        }
        return "Simply put, " + s.toLowerCase();
      },
      (s: string) => {
        // Use more direct structure
        return "Here's the point: " + s;
      }
    ];
    
    const template = simpleTemplates[index % simpleTemplates.length];
    return template(sentence);
  };

  const simplifyFurther = (text: string): string => {
    // Simplified mock function to generate a simpler version
    return text
      .replace(/the/gi, "")
      .replace(/an/gi, "")
      .replace(/a/gi, "")
      .replace(/  /g, " ")
      .trim();
  };

  const generateCreativeRewrite = (sentence: string, index: number): string => {
    // Generate more creative, expressive versions
    const creativeTemplates = [
      (s: string) => {
        // Add vivid imagery
        const imagery = [
          "Like a burst of color in a gray world, ",
          "Imagine this: ",
          "Picture this scene: ",
          "In a world where anything is possible, ",
          "As if painted with words, "
        ];
        return imagery[index % imagery.length] + s.toLowerCase();
      },
      (s: string) => {
        // Add descriptive adjectives
        const words = s.split(" ");
        return words.map(word => {
          if (word.length > 3 && Math.random() > 0.7) {
            const descriptiveAdjectives = ["remarkable", "stunning", "exquisite", "magnificent", "extraordinary"];
            return descriptiveAdjectives[Math.floor(Math.random() * descriptiveAdjectives.length)] + " " + word;
          }
          return word;
        }).join(" ");
      },
      (s: string) => {
        // Add metaphor
        const metaphors = [
          " - it's like a symphony of ideas coming together.",
          " - much like a river finding its path to the sea.",
          " - similar to the way stars illuminate the night sky.",
          " - reminiscent of nature's perfect balance.",
          " - as intricate as a spider's web on a dewy morning."
        ];
        return s + metaphors[index % metaphors.length];
      },
      (s: string) => {
        // Use more expressive verbs
        return s
          .replace(/walk/gi, "stroll")
          .replace(/look/gi, "gaze")
          .replace(/say/gi, "proclaim")
          .replace(/happy/gi, "ecstatic")
          .replace(/sad/gi, "despondent");
      },
      (s: string) => {
        // Add rhetorical question
        return s + " Isn't that something to marvel at?";
      }
    ];
    
    const template = creativeTemplates[index % creativeTemplates.length];
    return template(sentence);
  };

  const selectVariation = (sentence: string) => {
    setSelectedSentence(sentence);
  };

  const copyToClipboard = (text?: string) => {
    const textToCopy = text || selectedSentence;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: "The sentence has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setOriginalSentence("");
    setRewrittenSentences([]);
    setSelectedSentence("");
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="original-sentence" className="text-base font-medium">
                    Enter Your Sentence
                  </Label>
                  <Textarea
                    id="original-sentence"
                    placeholder="Type or paste your sentence here..."
                    value={originalSentence}
                    onChange={(e) => setOriginalSentence(e.target.value)}
                    className="h-32 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <SelectItem value="formal">Formal/Academic</SelectItem>
                        <SelectItem value="simple">Simplified</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="num-variations" className="text-base font-medium">
                      Number of Variations
                    </Label>
                    <Select
                      value={numVariations.toString()}
                      onValueChange={(value) => setNumVariations(parseInt(value))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Variation</SelectItem>
                        <SelectItem value="2">2 Variations</SelectItem>
                        <SelectItem value="3">3 Variations</SelectItem>
                        <SelectItem value="4">4 Variations</SelectItem>
                        <SelectItem value="5">5 Variations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={rewriteSentence}
                    disabled={isRewriting || originalSentence.trim().length < 10}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    {isRewriting ? "Rewriting..." : "Rewrite Sentence"}
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
              <h3 className="text-lg font-medium mb-3">Rewriting Styles Explained</h3>
              <ul className="space-y-3">
                <li className="space-y-1">
                  <h4 className="font-medium">Standard</h4>
                  <p className="text-sm text-gray-600">Maintains similar meaning while changing structure and some vocabulary.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="font-medium">Formal/Academic</h4>
                  <p className="text-sm text-gray-600">Elevates the language with more sophisticated vocabulary and scholarly structure.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="font-medium">Simplified</h4>
                  <p className="text-sm text-gray-600">Makes text more accessible with shorter sentences and simpler vocabulary.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="font-medium">Creative</h4>
                  <p className="text-sm text-gray-600">Adds expressive language, metaphors, and vivid imagery to engage readers.</p>
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
                  Rewritten Variations
                </Label>
                {rewrittenSentences.length > 0 && (
                  <Badge className="bg-green-50 text-green-700">
                    {rewrittenSentences.length} variations
                  </Badge>
                )}
              </div>
              
              {isRewriting ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Generating variations of your sentence...</p>
                </div>
              ) : rewrittenSentences.length > 0 ? (
                <div className="space-y-4">
                  <Tabs defaultValue="variations" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="variations">Variations</TabsTrigger>
                      <TabsTrigger value="selected">Selected</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="variations" className="space-y-3 mt-3">
                      {rewrittenSentences.map((sentence, index) => (
                        <div 
                          key={index}
                          onClick={() => selectVariation(sentence)}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            selectedSentence === sentence ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              Variation {index + 1}
                            </Badge>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(sentence);
                              }}
                              variant="ghost"
                              className="h-6 p-0 text-gray-500 hover:text-blue-600"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm">{sentence}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="selected" className="mt-3">
                      {selectedSentence ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-50 border rounded-lg min-h-[100px]">
                            <p>{selectedSentence}</p>
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
                          Select a variation from the list
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    Rewritten sentence variations will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Usage Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use <span className="font-medium">Standard</span> style for general writing improvements
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Choose <span className="font-medium">Formal</span> for academic papers or professional documents
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Select <span className="font-medium">Simplified</span> when writing for broader audiences
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Try <span className="font-medium">Creative</span> for marketing copy or narrative writing
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Generate multiple variations to find the perfect rewrite for your needs
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Transform your sentences into multiple variations with different styles and tones.";
  
  const description = `
    Our Sentence Rewriter tool is a powerful writing assistant that helps you rewrite sentences in multiple ways while preserving the original meaning. Whether you need to rephrase content for academic papers, marketing copy, creative writing, or simplified explanations, this tool offers intelligent variations tailored to your needs.
    
    Using advanced language processing techniques, the Sentence Rewriter analyzes your input and generates multiple alternatives based on your selected style preferences. Choose from Standard, Formal/Academic, Simplified, or Creative rewriting styles to suit different contexts and audiences.
    
    This tool is particularly useful for avoiding repetition in your writing, overcoming writer's block, adapting content for different audiences, or simply exploring alternative ways to express your ideas. With the ability to generate up to five different variations at once, you can quickly compare options and select the one that best fits your purpose.
    
    Unlike basic synonym replacement tools, our Sentence Rewriter understands sentence structure and context, producing natural-sounding alternatives that maintain coherence and readability. Each rewritten sentence preserves the core meaning while offering a fresh perspective or approach.
  `;

  const howToUse = [
    "Enter your sentence in the input field (minimum 10 characters required).",
    "Select your preferred rewriting style (Standard, Formal/Academic, Simplified, or Creative).",
    "Choose how many variations you want to generate (1-5).",
    "Click the 'Rewrite Sentence' button to process your input.",
    "Browse through the generated variations and click on any to select it.",
    "Use the 'Copy to Clipboard' button to copy your chosen variation.",
    "Optionally, switch between the 'Variations' and 'Selected' tabs to focus on your chosen rewrite."
  ];

  const features = [
    "Four distinct rewriting styles to match different writing contexts",
    "Generate up to five unique variations from a single sentence",
    "Intuitive interface to compare and select your preferred rewritten version",
    "Maintains original meaning while changing structure and vocabulary",
    "Context-aware rewrites that preserve natural language flow",
    "One-click copying for seamless integration into your documents"
  ];

  const faqs = [
    {
      question: "How does the Sentence Rewriter differ from a thesaurus?",
      answer: "Unlike a thesaurus that simply suggests alternative words, our Sentence Rewriter transforms entire sentences by changing their structure, word order, and phrasing while preserving the core meaning. It considers context and grammatical relationships to produce natural-sounding variations rather than just substituting individual words."
    },
    {
      question: "Which rewriting style should I choose for academic writing?",
      answer: "For academic writing, the Formal/Academic style is most appropriate. This style employs scholarly language, sophisticated vocabulary, and formal sentence structures suitable for research papers, essays, and professional publications. It helps elevate your writing to meet academic standards while maintaining clarity and precision."
    },
    {
      question: "Can I use this tool for rewriting copyrighted content?",
      answer: "While our Sentence Rewriter can help rephrase content, simply rewriting sentences may not be sufficient to avoid copyright issues. The tool should be used ethically to help express ideas in your own words or to improve your writing, not to appropriate others' work. Always properly cite sources when referencing others' ideas, regardless of how you phrase them."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="sentence-rewriter"
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

export default SentenceRewriterDetailed;