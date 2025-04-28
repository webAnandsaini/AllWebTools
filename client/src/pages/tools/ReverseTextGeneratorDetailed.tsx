import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type ReverseMode = "characters" | "words" | "sentences" | "paragraphs";

const ReverseTextGeneratorDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [reverseMode, setReverseMode] = useState<ReverseMode>("characters");
  const [preserveSpaces, setPreserveSpaces] = useState(true);
  const [maintainCase, setMaintainCase] = useState(true);
  const [preserveNumbers, setPreserveNumbers] = useState(true);
  const [reverseHistory, setReverseHistory] = useState<Array<{ input: string, output: string, mode: ReverseMode }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Generate reversed text whenever input or settings change
    if (inputText) {
      reverseText();
    }
  }, [inputText, reverseMode, preserveSpaces, maintainCase, preserveNumbers]);

  const reverseText = () => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    let result = "";

    switch (reverseMode) {
      case "characters":
        result = reverseCharacters(inputText);
        break;
      
      case "words":
        result = reverseWords(inputText);
        break;
      
      case "sentences":
        result = reverseSentences(inputText);
        break;
      
      case "paragraphs":
        result = reverseParagraphs(inputText);
        break;
      
      default:
        result = reverseCharacters(inputText);
    }

    setOutputText(result);
  };

  const reverseCharacters = (text: string): string => {
    if (preserveNumbers) {
      // Split text into segments (numbers and non-numbers)
      const segments = text.split(/(\d+)/);
      
      // Reverse only non-number segments
      return segments.map((segment, index) => {
        // Even indices are non-number segments
        if (index % 2 === 0) {
          return reverseSegment(segment, "");
        }
        // Odd indices are number segments, keep them unchanged
        return segment;
      }).join('');
    } else {
      return reverseSegment(text, "");
    }
  };

  const reverseWords = (text: string): string => {
    // Split by spaces and reverse each word
    const words = text.split(/\s+/);
    
    return words.map(word => {
      if (preserveNumbers && /^\d+$/.test(word)) {
        // Don't reverse pure number words if preserveNumbers is enabled
        return word;
      } else {
        return reverseSegment(word, "");
      }
    }).join(preserveSpaces ? ' ' : '');
  };

  const reverseSentences = (text: string): string => {
    // Split by sentence endings
    const sentences = text.split(/([.!?]+\s*)/);
    const result = [];
    
    // Process sentences and their endings
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const ending = i + 1 < sentences.length ? sentences[i + 1] : "";
      
      // Reverse the words in the sentence
      const words = sentence.split(/\s+/);
      const reversedWords = words.reverse().join(preserveSpaces ? ' ' : '');
      
      result.push(reversedWords + ending);
    }
    
    return result.join('');
  };

  const reverseParagraphs = (text: string): string => {
    // Split by paragraph breaks
    const paragraphs = text.split(/\n\s*\n/);
    
    // Reverse paragraphs
    return paragraphs.reverse().join('\n\n');
  };

  const reverseSegment = (segment: string, separator: string): string => {
    if (maintainCase) {
      // Track the case of each character
      const caseMap = segment.split('').map(char => {
        if (char === char.toUpperCase()) return 'upper';
        if (char === char.toLowerCase()) return 'lower';
        return 'other';
      });
      
      // Reverse the characters
      const reversed = segment.split('').reverse().join(separator);
      
      // Apply original case to reversed string
      return reversed.split('').map((char, i) => {
        if (caseMap[i] === 'upper') return char.toUpperCase();
        if (caseMap[i] === 'lower') return char.toLowerCase();
        return char;
      }).join('');
    } else {
      // Simple reverse
      return segment.split('').reverse().join(separator);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleModeChange = (value: string) => {
    setReverseMode(value as ReverseMode);
  };

  const saveToHistory = () => {
    if (!inputText.trim() || !outputText.trim()) return;
    
    const historyItem = {
      input: inputText,
      output: outputText,
      mode: reverseMode
    };
    
    setReverseHistory(prev => [historyItem, ...prev].slice(0, 5));
    
    toast({
      title: "Saved to history",
      description: "Your reversed text has been saved to history",
    });
  };

  const copyToClipboard = () => {
    if (!outputText.trim()) return;
    
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied to clipboard",
      description: "The reversed text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const loadFromHistory = (item: { input: string, output: string, mode: ReverseMode }) => {
    setInputText(item.input);
    setReverseMode(item.mode);
    setOutputText(item.output);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Reverse Text Generator</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to reverse it..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-32 mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reverse-mode" className="text-base font-medium">Reverse Mode</Label>
                  <Select 
                    value={reverseMode} 
                    onValueChange={handleModeChange}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="characters">Character by Character</SelectItem>
                      <SelectItem value="words">Word by Word</SelectItem>
                      <SelectItem value="sentences">Sentence by Sentence</SelectItem>
                      <SelectItem value="paragraphs">Paragraph by Paragraph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="preserve-spaces" 
                        checked={preserveSpaces}
                        onCheckedChange={setPreserveSpaces}
                      />
                      <Label htmlFor="preserve-spaces">Preserve Spaces</Label>
                    </div>
                    <span className="text-xs text-gray-500">Keep spaces between words</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="maintain-case" 
                        checked={maintainCase}
                        onCheckedChange={setMaintainCase}
                      />
                      <Label htmlFor="maintain-case">Maintain Case</Label>
                    </div>
                    <span className="text-xs text-gray-500">Keep original capitalization</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="preserve-numbers" 
                        checked={preserveNumbers}
                        onCheckedChange={setPreserveNumbers}
                      />
                      <Label htmlFor="preserve-numbers">Preserve Numbers</Label>
                    </div>
                    <span className="text-xs text-gray-500">Don't reverse digits</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={copyToClipboard}
                    disabled={!outputText}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    <span>Copy to Clipboard</span>
                  </Button>
                  
                  <Button
                    onClick={saveToHistory}
                    disabled={!outputText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-save mr-2"></i>
                    <span>Save to History</span>
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
          
          {reverseHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Reversal History</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {reverseHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="text-sm font-medium truncate">{item.input}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{item.output}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.mode} mode
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
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Reversed Text</h3>
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
              
              {outputText ? (
                <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px] break-words">
                  <p className="whitespace-pre-wrap">{outputText}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center min-h-[200px] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 text-gray-300 mb-3">
                    <i className="fas fa-exchange-alt text-4xl"></i>
                  </div>
                  <p className="text-gray-500">Your reversed text will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Enter text and select a reversal mode to begin</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Reverse Mode Examples</h3>
              <Tabs defaultValue="characters" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                  <TabsTrigger value="words">Words</TabsTrigger>
                  <TabsTrigger value="sentences">Sentences</TabsTrigger>
                  <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="characters" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Character by Character</p>
                  <p>Original: Hello World 123</p>
                  <p>Reversed: 321 dlroW olleH</p>
                  <p className="text-xs text-gray-500 mt-2">Reverses each character in the text, reading from right to left.</p>
                </TabsContent>
                
                <TabsContent value="words" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Word by Word</p>
                  <p>Original: Hello World 123</p>
                  <p>Reversed: 123 World Hello</p>
                  <p className="text-xs text-gray-500 mt-2">Keeps each word intact but reverses their order.</p>
                </TabsContent>
                
                <TabsContent value="sentences" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Sentence by Sentence</p>
                  <p>Original: First sentence. Second sentence. Third.</p>
                  <p>Reversed: Third. Second sentence. First sentence.</p>
                  <p className="text-xs text-gray-500 mt-2">Reverses the order of complete sentences in the text.</p>
                </TabsContent>
                
                <TabsContent value="paragraphs" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Paragraph by Paragraph</p>
                  <p>Original: First paragraph. <br/><br/> Second paragraph.</p>
                  <p>Reversed: Second paragraph. <br/><br/> First paragraph.</p>
                  <p className="text-xs text-gray-500 mt-2">Maintains each paragraph but reverses their order.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-puzzle-piece text-blue-600"></i>
              </div>
              <h3 className="font-medium">Word Puzzles</h3>
            </div>
            <p className="text-sm text-gray-600">
              Create fun word games, puzzles, and challenges by reversing text in creative ways for entertainment and education.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-lock text-purple-600"></i>
              </div>
              <h3 className="font-medium">Simple Encoding</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use reversed text as a basic form of text obfuscation for casual privacy or to hide meaning from casual observers.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-brain text-green-600"></i>
              </div>
              <h3 className="font-medium">Brain Training</h3>
            </div>
            <p className="text-sm text-gray-600">
              Improve cognitive flexibility by practicing reading reversed text, which challenges the brain to process information differently.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="text-blue-500 mr-3 mt-1">
            <i className="fas fa-info-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Fun Fact</h3>
            <p className="text-blue-700 text-sm">
              Leonardo da Vinci famously wrote his notes in mirror-reversed handwriting (from right to left).
              This technique, sometimes called "mirror writing," was possibly used to keep his notes private or
              because he was left-handed and wanted to avoid smudging ink as he wrote.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform your text with our versatile Reverse Text Generator - flip words, sentences, or entire paragraphs with ease.",
    description: "Our Reverse Text Generator is a versatile text manipulation tool that allows you to reverse content in multiple ways with complete customization control. This powerful utility enables you to flip text character-by-character (mirror text), reverse words while maintaining their internal structure, reorder sentences within paragraphs, or completely invert paragraph sequences. The tool features four distinct reversal modes to serve various needs: Character mode creates mirror-image text by completely inverting character order; Word mode maintains each word's integrity while reversing their sequence in the text; Sentence mode preserves complete sentences but changes their order; and Paragraph mode keeps paragraphs intact while reversing their arrangement. For precise control over the reversal process, the generator offers customization options including the ability to preserve spaces between words, maintain original capitalization patterns, and protect numbers from being reversed. Each reversal is instantly generated as you type or adjust settings, with a side-by-side preview showing exactly how your output will appear. Additional features include a reversal history that saves your recent transformations for easy reuse, one-click copying to clipboard, and example displays that demonstrate each reversal mode in action. Whether you're creating word puzzles, designing creative text effects, developing simple encodings, or just having fun with linguistic experimentation, our Reverse Text Generator provides the perfect solution with its combination of power and ease of use.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the generator.",
      "Select your desired reversal mode from the dropdown menu: 'Character by Character', 'Word by Word', 'Sentence by Sentence', or 'Paragraph by Paragraph'.",
      "Customize your reversal with the option toggles: 'Preserve Spaces' to maintain spacing, 'Maintain Case' to keep original capitalization, and 'Preserve Numbers' to prevent digit reversal.",
      "View the reversed text as it's automatically generated in the preview area on the right.",
      "Click 'Copy to Clipboard' to copy the reversed text for use in other applications.",
      "Optionally, save your reversal to history by clicking 'Save to History' for future reference.",
      "To reuse a previous reversal, simply click on any item in your reversal history."
    ],
    features: [
      "Four versatile reversal modes: character-by-character, word-by-word, sentence-by-sentence, and paragraph-by-paragraph",
      "Customizable options to preserve spaces, maintain original capitalization, and protect numbers from reversal",
      "Real-time preview that updates instantly as you type or change settings",
      "Reversal history that saves your recent text transformations for easy reuse",
      "One-click copying to clipboard for seamless integration with other applications",
      "Visual examples showing how each reversal mode transforms text differently",
      "Mobile-friendly interface that works across all devices and screen sizes"
    ],
    faqs: [
      {
        question: "How can I create mirror text where letters are flipped horizontally?",
        answer: "To create true mirror text where each letter is horizontally flipped (as if viewed in a mirror), you'll need to use our Character by Character reversal mode, which reverses the order of characters in your text. However, this doesn't actually flip the individual letters themselves - it just reverses their order. For actual horizontally flipped letters (where 'b' looks like 'd'), you would need a specialized mirroring font or tool that transforms each character individually. Our Reverse Text Generator is primarily designed for text sequence reversal rather than individual character transformation. For most creative, puzzle, or casual encoding uses, the character-by-character reversal provides a similar effect that serves the same purpose, as it creates text that reads from right to left instead of left to right."
      },
      {
        question: "Why would someone want to reverse text in different ways?",
        answer: "Text reversal serves numerous practical and creative purposes: 1) Word Puzzles and Games: Creating word scrambles, rebuses, or cipher puzzles for educational or entertainment activities. 2) Creative Writing and Marketing: Developing unique stylistic effects in poetry, song lyrics, or attention-grabbing social media posts. 3) Basic Encoding: Providing a simple form of text obfuscation for casual privacy (though not secure encryption). 4) Educational Tools: Helping students understand language structure by examining words and sentences in reverse. 5) Cognitive Exercises: Creating brain teasers that challenge readers to decipher backwards text, potentially improving mental flexibility. 6) Typography and Design: Creating artistic text layouts where reversed elements create visual balance or interest. 7) Testing Reading Skills: Some educational assessments use reversed text to evaluate cognitive processing abilities. The different reversal modes (character, word, sentence, paragraph) allow users to choose the specific type of transformation that best suits their particular need."
      },
      {
        question: "Is reversed text useful for creating secure messages or encryption?",
        answer: "No, reversed text should not be considered a form of secure encryption or used for truly confidential information. While reversed text can provide a very basic level of obfuscation that might prevent casual observers from immediately reading a message, it's an extremely simple transformation that can be easily reversed by anyone with basic knowledge or tools. Text reversal is what cryptographers would call a 'trivial cipher' - it follows a predictable pattern that's immediately obvious to anyone looking for it. For any situation requiring actual security or privacy, you should use proper encryption methods with strong keys. That said, reversed text can be fun for creating puzzles, games, or light-hearted 'secret messages' where actual security isn't required. It's perfect for scavenger hunts, children's activities, or novelty content, but should never be relied upon for protecting sensitive information."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="reverse-text-generator"
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

export default ReverseTextGeneratorDetailed;