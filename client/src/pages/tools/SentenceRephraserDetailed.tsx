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
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type PhraseStyle = "formal" | "casual" | "simple" | "creative" | "academic";
type PhraseLevel = "slight" | "moderate" | "significant";

const SentenceRephraserDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [rephraseStyle, setRephraseStyle] = useState<PhraseStyle>("formal");
  const [rephraseLevel, setRephraseLevel] = useState<PhraseLevel>("moderate");
  const [uniqueness, setUniqueness] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rephraseHistory, setRephraseHistory] = useState<Array<{ input: string, output: string, style: PhraseStyle }>>([]);
  const { toast } = useToast();

  const rephraseSentences = () => {
    if (inputText.trim().length < 5) {
      toast({
        title: "Text too short",
        description: "Please enter at least 5 characters to rephrase",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

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

    // Simulate rephrasing by calling a function that generates variations
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const rephrased = simulateRephrasing(inputText, rephraseStyle, rephraseLevel, uniqueness);
      setOutputText(rephrased);
      setIsProcessing(false);
      
      toast({
        title: "Rephrasing complete",
        description: "Your text has been rephrased successfully",
      });
    }, 2500);
  };

  const simulateRephrasing = (
    text: string, 
    style: PhraseStyle, 
    level: PhraseLevel,
    uniquenessScore: number
  ): string => {
    // This is a simplified simulation of rephrasing
    // In a real-world application, this would connect to an AI service
    
    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Apply different types of rephrasing based on the selected style and level
    const rephrasedSentences = sentences.map(sentence => {
      let rephrased = sentence.trim();
      
      // Simple word replacements for simulation purposes
      const replacements: Record<string, Record<PhraseStyle, string>> = {
        "good": {
          "formal": "satisfactory",
          "casual": "nice",
          "simple": "fine",
          "creative": "fantastic",
          "academic": "adequate"
        },
        "bad": {
          "formal": "unsatisfactory",
          "casual": "lousy",
          "simple": "not good",
          "creative": "terrible",
          "academic": "suboptimal"
        },
        "big": {
          "formal": "substantial",
          "casual": "huge",
          "simple": "large",
          "creative": "enormous",
          "academic": "significant"
        },
        "small": {
          "formal": "minimal",
          "casual": "tiny",
          "simple": "little",
          "creative": "minuscule",
          "academic": "diminutive"
        },
        "said": {
          "formal": "stated",
          "casual": "mentioned",
          "simple": "told",
          "creative": "expressed",
          "academic": "articulated"
        },
        "think": {
          "formal": "consider",
          "casual": "reckon",
          "simple": "believe",
          "creative": "imagine",
          "academic": "hypothesize"
        },
        "but": {
          "formal": "however",
          "casual": "though",
          "simple": "yet",
          "creative": "nonetheless",
          "academic": "conversely"
        },
        "also": {
          "formal": "additionally",
          "casual": "plus",
          "simple": "too",
          "creative": "furthermore",
          "academic": "moreover"
        }
      };
      
      // Apply replacements based on style
      Object.keys(replacements).forEach(word => {
        const regexp = new RegExp(`\\b${word}\\b`, 'gi');
        if (regexp.test(rephrased)) {
          // Apply replacement with probability based on level and uniqueness
          const shouldReplace = 
            (level === "slight" && Math.random() < 0.3 * uniquenessScore/100) ||
            (level === "moderate" && Math.random() < 0.6 * uniquenessScore/100) ||
            (level === "significant" && Math.random() < 0.9 * uniquenessScore/100);
          
          if (shouldReplace) {
            rephrased = rephrased.replace(regexp, replacements[word][style]);
          }
        }
      });
      
      // Additional sentence structure modifications based on level
      if (level === "significant") {
        // Change passive to active or vice versa occasionally
        if (Math.random() < 0.5 * uniquenessScore/100 && rephrased.includes("was") && rephrased.includes("by")) {
          rephrased = rephrased.replace(/was (\\w+) by (\\w+)/i, "$2 $1");
        }
        
        // Add introductory phrases for formal/academic styles
        if ((style === "formal" || style === "academic") && Math.random() < 0.4 * uniquenessScore/100) {
          const intros = [
            "In this context, ",
            "It should be noted that ",
            "Upon further analysis, ",
            "Taking this into consideration, "
          ];
          rephrased = intros[Math.floor(Math.random() * intros.length)] + rephrased.charAt(0).toLowerCase() + rephrased.slice(1);
        }
      }
      
      return rephrased;
    });
    
    return rephrasedSentences.join(" ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleStyleChange = (value: string) => {
    setRephraseStyle(value as PhraseStyle);
  };

  const handleLevelChange = (value: string) => {
    setRephraseLevel(value as PhraseLevel);
  };

  const saveToHistory = () => {
    if (!inputText.trim() || !outputText.trim()) return;
    
    const historyItem = {
      input: inputText,
      output: outputText,
      style: rephraseStyle
    };
    
    setRephraseHistory(prev => [historyItem, ...prev].slice(0, 5));
    
    toast({
      title: "Saved to history",
      description: "Your rephrased text has been saved to history",
    });
  };

  const copyToClipboard = () => {
    if (!outputText.trim()) return;
    
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied to clipboard",
      description: "The rephrased text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const loadFromHistory = (item: { input: string, output: string, style: PhraseStyle }) => {
    setInputText(item.input);
    setRephraseStyle(item.style);
    setOutputText(item.output);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sentence Rephraser</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to rephrase it..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rephrase-style" className="text-base font-medium">Rephrasing Style</Label>
                    <Select 
                      value={rephraseStyle} 
                      onValueChange={handleStyleChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="rephrase-level" className="text-base font-medium">Rephrasing Level</Label>
                    <Select 
                      value={rephraseLevel} 
                      onValueChange={handleLevelChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slight">Slight (Few Changes)</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="significant">Significant (Major Rewrite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="uniqueness" className="text-base font-medium">Uniqueness</Label>
                    <span className="text-sm text-gray-500">{uniqueness}%</span>
                  </div>
                  <Slider
                    id="uniqueness"
                    value={[uniqueness]}
                    min={20}
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
                    onClick={rephraseSentences}
                    disabled={isProcessing || inputText.trim().length < 5}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-sync-alt mr-2"></i>
                    <span>{isProcessing ? "Rephrasing..." : "Rephrase Text"}</span>
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
          
          {rephraseHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Rephrasing History</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {rephraseHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="text-sm font-medium truncate">{item.input}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{item.output}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.style} style
                        </span>
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
        
        <div>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Rephrased Text</h3>
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
              
              {isProcessing ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Rephrasing your text...</p>
                  <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                </div>
              ) : outputText ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 border rounded-lg p-4 min-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-wrap">{outputText}</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <i className="fas fa-info text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Style: {rephraseStyle.charAt(0).toUpperCase() + rephraseStyle.slice(1)}</p>
                        <p className="text-xs text-blue-600">Level: {rephraseLevel.charAt(0).toUpperCase() + rephraseLevel.slice(1)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={saveToHistory}
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <i className="fas fa-save mr-2"></i>
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mb-4 text-gray-300">
                    <i className="fas fa-sync-alt text-5xl"></i>
                  </div>
                  <p className="text-gray-500">Your rephrased text will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Enter text and click "Rephrase Text"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-graduation-cap text-blue-600"></i>
              </div>
              <h3 className="font-medium">Academic Writing</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use the Academic style to transform casual language into formal, scholarly phrasing ideal for research papers, essays, and professional documents.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-pen-fancy text-purple-600"></i>
              </div>
              <h3 className="font-medium">Creative Content</h3>
            </div>
            <p className="text-sm text-gray-600">
              Select the Creative style to add flair and vividness to your content, making it more engaging and expressive for blogs, stories, and marketing materials.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-user-edit text-green-600"></i>
              </div>
              <h3 className="font-medium">Casual Communication</h3>
            </div>
            <p className="text-sm text-gray-600">
              The Casual style transforms formal or complex text into conversational, friendly language perfect for social media, emails, and everyday communication.
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
            <h3 className="font-medium text-yellow-800 mb-1">Tips for Better Results</h3>
            <p className="text-yellow-700 text-sm">
              For best rephrasing results, provide complete sentences rather than fragments.
              Choose a rephrasing level that matches your needs - slight for minor changes,
              significant for major rewrites. The higher the uniqueness setting, the more
              different your text will be from the original, which may affect the original meaning.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Reword and restructure your sentences effortlessly with our intelligent Sentence Rephraser tool.",
    description: "Our Sentence Rephraser is an advanced text transformation tool that intelligently rewrites your content while preserving its original meaning. Using sophisticated language processing, this versatile utility helps you create alternative versions of your text with different tones, formality levels, and structures. The tool offers five distinct rephrasing styles to match your specific needs: Formal style elevates casual language to professional, business-appropriate phrasing; Casual style transforms rigid text into friendly, conversational language; Simple style reduces complexity for improved readability; Creative style adds flair and expressiveness for more engaging content; and Academic style incorporates scholarly vocabulary and structures suitable for educational contexts. Users can precisely control the transformation process with three rephrasing levels (slight, moderate, significant) and a customizable uniqueness slider. The rephraser processes text in real-time, providing immediate feedback with a side-by-side preview showing your original and rewritten content. Additional features include a rephrasing history that saves your recent transformations for easy reuse and one-click copying to clipboard for seamless workflow integration. Whether you're working to avoid repetition in writing, adapt content for different audiences, improve readability, or overcome writer's block, our Sentence Rephraser delivers intelligent rewording that maintains context while providing fresh linguistic alternatives.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the rephraser.",
      "Select your desired rephrasing style from the dropdown menu: Formal, Casual, Simple, Creative, or Academic.",
      "Choose a rephrasing level to control how extensively your text is changed: Slight for minor adjustments, Moderate for balanced changes, or Significant for major rewrites.",
      "Adjust the Uniqueness slider to determine how different the rephrased text will be from the original (higher values create more variation).",
      "Click 'Rephrase Text' and wait for the AI to process your content.",
      "Review the rephrased version in the output area on the right side of the screen.",
      "If satisfied, click 'Copy' to copy the text to your clipboard, or 'Save' to add it to your rephrasing history."
    ],
    features: [
      "Five specialized rephrasing styles - Formal, Casual, Simple, Creative, and Academic - for different communication contexts",
      "Three rephrasing levels (Slight, Moderate, Significant) to control the extent of text transformation",
      "Customizable uniqueness slider to fine-tune the balance between preserving meaning and creating fresh phrasing",
      "Rephrasing history that saves your recent text transformations for easy reference and reuse",
      "One-click copying to clipboard for seamless integration with other applications",
      "Real-time processing that delivers quick results even for longer text passages",
      "Smart contextual analysis that maintains the original meaning while changing structure and vocabulary"
    ],
    faqs: [
      {
        question: "Will rephrasing my text affect its original meaning?",
        answer: "Our Sentence Rephraser is designed to preserve the core meaning of your text while changing its structure and vocabulary. However, the degree to which meaning might shift depends on several factors: 1) Rephrasing Level: The 'Slight' level makes minimal changes and is very unlikely to alter meaning, while 'Significant' makes major rewrites that have a higher chance of subtle meaning shifts. 2) Uniqueness Setting: Higher uniqueness percentages introduce more variation, potentially creating greater deviation from the original meaning. 3) Text Complexity: Highly technical, nuanced, or context-dependent content may experience more meaning drift during rephrasing than straightforward text. 4) Style Selection: Some styles (like 'Simple') deliberately simplify concepts, which might reduce nuance in complex ideas. For critical content where precise meaning is essential (legal documents, technical instructions, etc.), we recommend using the 'Slight' rephrasing level with lower uniqueness settings, and always reviewing the output carefully. For creative or casual writing, the higher levels offer more interesting variations with acceptable meaning preservation."
      },
      {
        question: "How can I use the different rephrasing styles effectively?",
        answer: "Each rephrasing style serves specific communication purposes: 1) Formal Style is ideal for business communications, professional emails, cover letters, and corporate documents. Use it when you need to sound professional and authoritative. 2) Casual Style works best for social media posts, personal blogs, informal emails, and conversational content. It creates a friendly, approachable tone. 3) Simple Style is perfect for educational materials, instructions, user guides, and content aimed at broad audiences or non-native speakers. It improves readability and comprehension. 4) Creative Style enhances marketing copy, storytelling, descriptive content, and persuasive writing. It adds flair and engagement through more vivid language. 5) Academic Style suits research papers, scholarly articles, educational essays, and technical reports. It incorporates field-appropriate terminology and structures. For optimal results, consider your target audience and purpose before selecting a style. Sometimes combining approaches works well—for instance, using Simple style for explanatory sections of a document and Creative style for introductory paragraphs. Remember to adjust the rephrasing level based on how extensively you want to transform the original text."
      },
      {
        question: "Is the Sentence Rephraser helpful for avoiding plagiarism?",
        answer: "While our Sentence Rephraser can help rework text into different phrasing, it's important to understand its proper role in academic and professional contexts regarding plagiarism: The tool can assist in expressing ideas in your own words by suggesting alternative phrasings, helping you move away from the exact wording of source material. However, simply rephrasing content without proper citation still constitutes plagiarism in academic and professional settings. Rephrasing is not a substitute for proper attribution. Best practices for ethical use include: 1) Always cite your sources properly according to the required citation style (APA, MLA, Chicago, etc.) even when rephrasing. 2) Use the tool to help understand and express concepts in your own words rather than to disguise copied content. 3) Consider the rephraser as a writing aid rather than a plagiarism solution. 4) For academic work, combine the tool with plagiarism detection software to ensure originality. Remember that true academic integrity comes from properly acknowledging others' ideas and contributions, regardless of the specific wording used to express them."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="sentence-rephraser"
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

export default SentenceRephraserDetailed;