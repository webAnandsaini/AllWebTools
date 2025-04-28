import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type RewordStyle = "standard" | "formal" | "simple" | "creative" | "academic" | "business";
type RewordIntensity = "light" | "medium" | "heavy";

const RewordingToolDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [rewordStyle, setRewordStyle] = useState<RewordStyle>("standard");
  const [rewordIntensity, setRewordIntensity] = useState<RewordIntensity>("medium");
  const [uniqueness, setUniqueness] = useState(75);
  const [isRewording, setIsRewording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [rewordHistory, setRewordHistory] = useState<Array<{ input: string, output: string, style: RewordStyle }>>([]);
  const { toast } = useToast();

  const rewordText = () => {
    if (inputText.trim().length < 5) {
      toast({
        title: "Text too short",
        description: "Please enter at least 5 characters to reword",
        variant: "destructive",
      });
      return;
    }

    setIsRewording(true);
    setProgress(0);
    setAlternatives([]);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Simulate rewording by calling a function that generates alternatives
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const { mainReworded, altRewording } = simulateRewording(inputText, rewordStyle, rewordIntensity, uniqueness);
      setOutputText(mainReworded);
      setAlternatives(altRewording);
      setIsRewording(false);
      
      // Add to history
      setRewordHistory(prev => [{
        input: inputText,
        output: mainReworded,
        style: rewordStyle
      }, ...prev].slice(0, 5));
      
      toast({
        title: "Rewording complete",
        description: "Your text has been reworded successfully",
      });
    }, 2500);
  };

  const simulateRewording = (
    text: string, 
    style: RewordStyle, 
    intensity: RewordIntensity,
    uniquenessScore: number
  ): { mainReworded: string, altRewording: string[] } => {
    // This is a simplified simulation of rewording
    // In a real-world application, this would connect to an AI service
    
    // Basic replacements based on style
    const styleReplacements: Record<RewordStyle, { [key: string]: string }> = {
      standard: {
        "good": "nice",
        "bad": "poor",
        "big": "large",
        "small": "little",
        "happy": "pleased",
        "sad": "unhappy",
        "interesting": "intriguing",
        "important": "significant",
        "difficult": "challenging",
        "easy": "simple"
      },
      formal: {
        "good": "excellent",
        "bad": "unfavorable",
        "big": "substantial",
        "small": "diminutive",
        "happy": "gratified",
        "sad": "melancholic",
        "interesting": "compelling",
        "important": "imperative",
        "difficult": "arduous",
        "easy": "straightforward"
      },
      simple: {
        "good": "fine",
        "bad": "not good",
        "big": "huge",
        "small": "tiny",
        "happy": "glad",
        "sad": "upset",
        "interesting": "cool",
        "important": "key",
        "difficult": "hard",
        "easy": "not hard"
      },
      creative: {
        "good": "splendid",
        "bad": "dreadful",
        "big": "enormous",
        "small": "minuscule",
        "happy": "overjoyed",
        "sad": "downhearted",
        "interesting": "captivating",
        "important": "vital",
        "difficult": "formidable",
        "easy": "effortless"
      },
      academic: {
        "good": "advantageous",
        "bad": "suboptimal",
        "big": "considerable",
        "small": "minimal",
        "happy": "contented",
        "sad": "despondent",
        "interesting": "noteworthy",
        "important": "fundamental",
        "difficult": "complex",
        "easy": "uncomplicated"
      },
      business: {
        "good": "beneficial",
        "bad": "unfavorable",
        "big": "significant",
        "small": "limited",
        "happy": "satisfied",
        "sad": "disappointed",
        "interesting": "engaging",
        "important": "critical",
        "difficult": "challenging",
        "easy": "straightforward"
      }
    };
    
    // Alternatives for each style
    const alternativeReplacements: Record<RewordStyle, { [key: string]: string[] }> = {
      standard: {
        "good": ["pleasant", "fine", "satisfactory"],
        "bad": ["inadequate", "negative", "undesirable"],
        "big": ["sizable", "considerable", "substantial"],
        "small": ["modest", "slight", "minor"]
      },
      formal: {
        "good": ["commendable", "favorable", "praiseworthy"],
        "bad": ["inadequate", "unsatisfactory", "detrimental"],
        "big": ["extensive", "considerable", "immense"],
        "small": ["minimal", "negligible", "limited"]
      },
      simple: {
        "good": ["nice", "great", "okay"],
        "bad": ["awful", "not nice", "poor"],
        "big": ["large", "massive", "jumbo"],
        "small": ["little", "mini", "teeny"]
      },
      creative: {
        "good": ["fantastic", "wonderful", "marvelous"],
        "bad": ["terrible", "awful", "disastrous"],
        "big": ["gigantic", "colossal", "mammoth"],
        "small": ["tiny", "microscopic", "pocket-sized"]
      },
      academic: {
        "good": ["efficacious", "beneficial", "meritorious"],
        "bad": ["deficient", "deleterious", "inadequate"],
        "big": ["voluminous", "substantive", "extensive"],
        "small": ["diminutive", "insubstantial", "marginal"]
      },
      business: {
        "good": ["positive", "valuable", "advantageous"],
        "bad": ["adverse", "detrimental", "problematic"],
        "big": ["major", "substantial", "considerable"],
        "small": ["minor", "nominal", "modest"]
      }
    };
    
    // Apply rewording based on style, intensity, and uniqueness
    let reworded = text;
    const replacements = styleReplacements[style];
    
    // Determine how many words to replace based on intensity and uniqueness
    const replaceRate = 
      (intensity === "light" ? 0.3 : 
       intensity === "medium" ? 0.6 : 
       0.9) * (uniquenessScore / 100);
    
    // Split the text into words, keeping punctuation attached
    const words = reworded.match(/\b\w+\b|[^\w\s]/g) || [];
    
    // Create reworded version
    const rewordedWords = words.map(word => {
      const lowerWord = word.toLowerCase();
      if (replacements[lowerWord] && Math.random() < replaceRate) {
        return replacements[lowerWord];
      }
      return word;
    });
    
    reworded = rewordedWords.join(' ')
      .replace(/ ([.,;:!?])/g, '$1') // Fix spacing before punctuation
      .replace(/\s+/g, ' '); // Fix multiple spaces
    
    // Generate alternative versions
    const alternatives: string[] = [];
    const altReplacements = alternativeReplacements[style];
    
    // Create 3 alternative versions
    for (let i = 0; i < 3; i++) {
      const altWords = words.map(word => {
        const lowerWord = word.toLowerCase();
        if (altReplacements[lowerWord] && Math.random() < replaceRate) {
          const altOptions = altReplacements[lowerWord];
          return altOptions[Math.floor(Math.random() * altOptions.length)];
        }
        return word;
      });
      
      const altVersion = altWords.join(' ')
        .replace(/ ([.,;:!?])/g, '$1')
        .replace(/\s+/g, ' ');
      
      alternatives.push(altVersion);
    }
    
    // Add the main reworded version as a fourth alternative if it's different enough
    if (!alternatives.includes(reworded) && reworded !== text) {
      alternatives.push(reworded);
    }
    
    // Make sure we have a distinct primary reworded text
    if (reworded === text && alternatives.length > 0) {
      reworded = alternatives[0];
      alternatives.shift();
    }
    
    return {
      mainReworded: reworded,
      altRewording: alternatives.filter(alt => alt !== text && alt !== reworded)
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleStyleChange = (value: string) => {
    setRewordStyle(value as RewordStyle);
  };

  const handleIntensityChange = (value: string) => {
    setRewordIntensity(value as RewordIntensity);
  };

  const useAlternative = (altText: string) => {
    setOutputText(altText);
    
    toast({
      title: "Alternative applied",
      description: "The alternative rewording has been selected",
    });
  };

  const copyToClipboard = () => {
    if (!outputText.trim()) return;
    
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied to clipboard",
      description: "The reworded text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setAlternatives([]);
  };

  const loadFromHistory = (item: { input: string, output: string, style: RewordStyle }) => {
    setInputText(item.input);
    setRewordStyle(item.style);
    setOutputText(item.output);
  };

  const getStyleDescription = (): string => {
    switch (rewordStyle) {
      case "standard":
        return "A balanced approach to rewording that maintains the original tone while introducing moderate variations.";
      case "formal":
        return "Elevates language to a more sophisticated level, suitable for professional and academic contexts.";
      case "simple":
        return "Rewrites text using straightforward vocabulary and sentence structures for improved readability.";
      case "creative":
        return "Adds flair and originality to the text by incorporating expressive language and diverse phrasings.";
      case "academic":
        return "Employs scholarly vocabulary and complex sentence structures appropriate for academic writing.";
      case "business":
        return "Uses professional terminology and concise phrasing suitable for business communications.";
      default:
        return "";
    }
  };

  const getIntensityDescription = (): string => {
    switch (rewordIntensity) {
      case "light":
        return "Makes minimal changes while preserving most of the original text.";
      case "medium":
        return "Balances original content with new phrasing for moderate rewording.";
      case "heavy":
        return "Extensively rewrites the text for maximum difference from the original.";
      default:
        return "";
    }
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Rewording Tool</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to reword it..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reword-style" className="text-base font-medium">Rewording Style</Label>
                    <Select 
                      value={rewordStyle} 
                      onValueChange={handleStyleChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">{getStyleDescription()}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="reword-intensity" className="text-base font-medium">Rewording Intensity</Label>
                    <Select 
                      value={rewordIntensity} 
                      onValueChange={handleIntensityChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">{getIntensityDescription()}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="uniqueness" className="text-base font-medium">Uniqueness Level</Label>
                    <span className="text-sm text-gray-500">{uniqueness}%</span>
                  </div>
                  <Slider
                    id="uniqueness"
                    value={[uniqueness]}
                    min={30}
                    max={100}
                    step={5}
                    onValueChange={(value) => setUniqueness(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Similar</span>
                    <span>More Unique</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={rewordText}
                    disabled={isRewording || inputText.trim().length < 5}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>
                    <span>{isRewording ? "Rewording..." : "Reword Text"}</span>
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    <span>Clear</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {rewordHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Rewording History</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {rewordHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="text-sm font-medium truncate">{item.input}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{item.output}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={
                          item.style === "formal" ? "bg-blue-50 text-blue-700" :
                          item.style === "simple" ? "bg-green-50 text-green-700" :
                          item.style === "creative" ? "bg-purple-50 text-purple-700" :
                          item.style === "academic" ? "bg-yellow-50 text-yellow-700" :
                          item.style === "business" ? "bg-indigo-50 text-indigo-700" :
                          "bg-gray-50 text-gray-700"
                        }>
                          {item.style} style
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-gray-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.output);
                            toast({
                              title: "Copied",
                              description: "Text copied to clipboard",
                            });
                          }}
                        >
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Reworded Text</h3>
                <Button
                  onClick={copyToClipboard}
                  disabled={!outputText}
                  size="sm"
                  variant="outline"
                  className="text-primary border-primary"
                >
                  <i className="fas fa-copy mr-2"></i>
                  <span>Copy</span>
                </Button>
              </div>
              
              {isRewording ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Rewording your text...</p>
                  <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                </div>
              ) : outputText ? (
                <Tabs defaultValue="main" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="main">Main Result</TabsTrigger>
                    <TabsTrigger value="alternatives">
                      Alternatives
                      {alternatives.length > 0 && (
                        <Badge className="ml-2 bg-primary text-white">{alternatives.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="main">
                    <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] overflow-y-auto">
                      <p className="whitespace-pre-wrap">{outputText}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="alternatives">
                    {alternatives.length > 0 ? (
                      <div className="space-y-3 p-2">
                        {alternatives.map((alt, index) => (
                          <div key={index} className="bg-gray-50 border rounded-lg p-3 relative">
                            <p className="whitespace-pre-wrap pr-24">{alt}</p>
                            <div className="absolute right-3 top-3">
                              <Button
                                size="sm"
                                onClick={() => useAlternative(alt)}
                                className="bg-primary hover:bg-blue-700 text-xs h-8"
                              >
                                Use This
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border rounded-lg p-6 text-center h-48 flex items-center justify-center">
                        <p className="text-gray-500">No alternative rewordings available</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-gray-300">
                    <i className="fas fa-sync-alt text-5xl"></i>
                  </div>
                  <p className="text-gray-500">Your reworded text will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Enter text and click "Reword Text"</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Rewording Style Examples</h3>
              <Tabs defaultValue="standard" className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="formal">Formal</TabsTrigger>
                  <TabsTrigger value="simple">Simple</TabsTrigger>
                  <TabsTrigger value="creative">Creative</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                </TabsList>
                
                <TabsContent value="standard" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Standard Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is a nice concept that might assist us in resolving our large issue.</span></p>
                </TabsContent>
                
                <TabsContent value="formal" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Formal Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is an excellent proposition that may facilitate resolution of our substantial challenge.</span></p>
                </TabsContent>
                
                <TabsContent value="simple" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Simple Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is a fine idea that might help us fix our huge problem.</span></p>
                </TabsContent>
                
                <TabsContent value="creative" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Creative Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is a splendid inspiration that might empower us to conquer our enormous challenge.</span></p>
                </TabsContent>
                
                <TabsContent value="academic" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Academic Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is an advantageous concept that may facilitate resolution of our considerable dilemma.</span></p>
                </TabsContent>
                
                <TabsContent value="business" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Business Style</p>
                  <p className="text-sm text-gray-500 mb-2">Original: <span className="text-gray-700">This is a good idea that could help us solve our big problem.</span></p>
                  <p className="text-sm text-gray-500">Reworded: <span className="text-gray-700">This is a beneficial proposal that may enable us to address our significant issue.</span></p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-fingerprint text-blue-600"></i>
              </div>
              <h3 className="font-medium">Unique Content</h3>
            </div>
            <p className="text-sm text-gray-600">
              Create distinct variations of existing text to avoid duplication while preserving the original meaning.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-palette text-purple-600"></i>
              </div>
              <h3 className="font-medium">Style Adaptation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Transform text to match specific styles like formal, creative, or academic to suit different audiences and contexts.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-lightbulb text-green-600"></i>
              </div>
              <h3 className="font-medium">Alternative Suggestions</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get multiple rewording alternatives for your text, giving you options to choose the best variation for your needs.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <i className="fas fa-sliders-h text-orange-600"></i>
              </div>
              <h3 className="font-medium">Adjustable Intensity</h3>
            </div>
            <p className="text-sm text-gray-600">
              Control how much your text changes with light, medium, or heavy rewording options to match your specific requirements.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="text-yellow-500 mr-3 mt-1">
            <i className="fas fa-lightbulb text-xl"></i>
          </div>
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">Pro Tip</h3>
            <p className="text-yellow-700 text-sm">
              For the best results when rewording content, start with a higher uniqueness level (75-85%) 
              and medium intensity. This provides substantial variations while preserving meaning.
              If the result still sounds too similar to the original, increase both the uniqueness and 
              intensity. For academic or professional content, choose the appropriate style and review 
              the output to ensure it maintains accuracy and proper terminology.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform your text effortlessly with our advanced Rewording Tool - create unique variations while preserving meaning.",
    description: "Our Rewording Tool is a sophisticated text transformation utility that intelligently restructures and rephrases your content to create unique variations while maintaining the original meaning. Using advanced language processing algorithms, it analyzes your text and generates alternative phrasings based on your preferred style and intensity settings. The tool offers six distinct rewording styles to match your specific communication needs: Standard style provides balanced rewording appropriate for general content; Formal style elevates language for professional and official contexts; Simple style reduces complexity for improved readability; Creative style adds expressive elements for engaging content; Academic style incorporates scholarly vocabulary for educational writing; and Business style employs professional terminology for corporate communications. Users have precise control over the transformation process with three rewording intensity levels (light, medium, heavy) and a customizable uniqueness slider that determines how different the output will be from the original text. After processing, the tool provides not only a primary reworded version but also multiple alternatives that offer different approaches to expressing the same ideas. Additional features include a comprehensive rewording history that saves your recent transformations for easy reference and one-click copying to clipboard for seamless workflow integration. Whether you're looking to avoid repetition, adapt existing content for different audiences, overcome writer's block, or simply explore alternative ways to express your ideas, our Rewording Tool delivers intelligent variations that preserve context while offering fresh linguistic approaches.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the tool.",
      "Select your preferred rewording style from the dropdown menu: Standard, Formal, Simple, Creative, Academic, or Business.",
      "Choose a rewording intensity level to determine how extensively your text is changed: Light for minimal changes, Medium for balanced rewording, or Heavy for significant transformations.",
      "Adjust the Uniqueness slider to set how different the reworded text will be from the original (higher percentages create more variation).",
      "Click 'Reword Text' and wait for the process to complete.",
      "Review your primary reworded text in the 'Main Result' tab on the right side of the screen.",
      "Explore additional variations by clicking the 'Alternatives' tab, where you can view and select from multiple rewording options.",
      "If you prefer an alternative version, click 'Use This' to set it as your main result.",
      "Copy your final reworded text to clipboard by clicking the 'Copy' button."
    ],
    features: [
      "Six specialized rewording styles - Standard, Formal, Simple, Creative, Academic, and Business - for different communication contexts",
      "Adjustable rewording intensity with Light, Medium, and Heavy options to control how much your text is transformed",
      "Customizable uniqueness slider to fine-tune the balance between preserving meaning and creating distinctive variations",
      "Multiple rewording alternatives for each input, providing various options to express the same ideas differently",
      "Comprehensive rewording history that saves your recent text transformations for easy reference and reuse",
      "One-click copying to clipboard for seamless integration with other applications and workflows",
      "Style examples showing how each rewording approach transforms the same text differently"
    ],
    faqs: [
      {
        question: "How does the Rewording Tool maintain the original meaning?",
        answer: "Our Rewording Tool preserves meaning through a sophisticated multi-step process: 1) Semantic Analysis: The system first analyzes your text to understand key concepts, relationships between ideas, and the overall intent of the message. 2) Contextual Understanding: It identifies which words and phrases can be substituted without altering the core meaning by analyzing their role in the sentence. 3) Synonym Selection: The algorithm selects alternate words and phrases based on context, ensuring they carry the same denotative meaning as the original. 4) Structural Preservation: While adjusting phrasing, the tool maintains the logical flow and relationships between ideas. 5) Style-Appropriate Substitution: Word choices are filtered through your selected style (formal, creative, etc.) to ensure coherence. The uniqueness and intensity settings you select determine how aggressively the tool applies these transformations. At lower settings, only the most straightforward substitutions are made. At higher settings, more complex restructuring occurs, though still guided by preserving the core meaning. No automated system is perfect, however, which is why we provide multiple alternatives and recommend reviewing the output, especially for nuanced or technical content where precise terminology matters."
      },
      {
        question: "When should I use each rewording style, and what are the differences?",
        answer: "Each rewording style serves specific communication purposes: 1) Standard: Best for everyday content like emails, blog posts, and general writing. It offers balanced rewording that works in most contexts without dramatically shifting tone. 2) Formal: Ideal for professional documents, official communications, business proposals, and contexts requiring heightened language. This style elevates vocabulary and structures sentences more elaborately. 3) Simple: Perfect for educational content, instructions, user guides, or when writing for broad audiences or non-native speakers. It focuses on clarity and straightforward expression. 4) Creative: Excellent for marketing copy, storytelling, descriptions, social media content, and anywhere engaging, vibrant language is needed. It introduces more colorful expressions and varied sentence patterns. 5) Academic: Designed for scholarly papers, research articles, technical reports, and educational contexts. It employs field-appropriate terminology and formal structures while maintaining intellectual rigor. 6) Business: Optimized for corporate communications, reports, workplace emails, and professional presentations. It emphasizes clarity, efficiency, and professional tone with industry-appropriate terminology. For optimal results, match the style to both your audience and purpose—simple style for instructions, creative for marketing materials, academic for scholarly work, etc. Remember that the Uniqueness and Intensity settings allow you to fine-tune how dramatically each style affects your text."
      },
      {
        question: "Is content reworded with this tool detected as AI-generated or plagiarized?",
        answer: "Using our Rewording Tool to create variations of text involves considerations around AI detection and plagiarism that depend on several factors: Regarding AI detection: 1) Modern AI detection tools primarily identify patterns common in AI-generated text rather than comparing content to existing sources. 2) At lower uniqueness and intensity settings, our reworded content may sometimes trigger AI detection tools, as the transformations might follow predictable patterns. 3) At higher settings with more substantial rewording, detection becomes less likely as the output becomes more linguistically diverse. Regarding plagiarism: 1) Rewording alone doesn't address plagiarism concerns from an academic or professional ethics standpoint—proper citation of sources remains essential regardless of how extensively text is reworded. 2) Plagiarism detection tools compare text against databases of existing content, looking for matching sequences. 3) More intensive rewording (higher uniqueness/intensity settings) reduces the likelihood of triggering matching algorithms, but doesn't change the ethical requirement to cite sources. Best practices: 1) Always cite original sources appropriately, even when rewording. 2) Use the tool to explore alternative expressions of your own ideas rather than disguising others' work. 3) For your own original content, use the tool to create variations for different platforms or audiences. 4) Review and personalize reworded output rather than using it verbatim. Remember that academic institutions and publishers have strict policies about both AI use and proper attribution that should be consulted for specific contexts."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="rewording-tool"
      toolContent={
        <ToolContentTemplate
          introduction={contentData.introduction}
          description={contentData.description}
          howToUse={contentData.howToUse}
          features={contentData.features}
          faqs={contentData.faqs}
          toolInterface={contentData.toolInterface}
        />
      }
    />
  );
};

export default RewordingToolDetailed;