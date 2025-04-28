import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const InvisibleCharacterDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [detectionInput, setDetectionInput] = useState("");
  const [detectionResult, setDetectionResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [charCount, setCharCount] = useState({ visible: 0, invisible: 0, total: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Character codes for invisible characters
  const invisibleCharacters = {
    zeroWidthSpace: '\u200B',
    zeroWidthNonJoiner: '\u200C',
    zeroWidthJoiner: '\u200D',
    zeroWidthNoBreakSpace: '\uFEFF',
    hairSpace: '\u200A',
    brailleBlankPattern: '\u2800'
  };

  // Update detection result when detection input changes
  useEffect(() => {
    if (detectionInput) {
      const result = detectInvisibleCharacters(detectionInput);
      setDetectionResult(result);
    } else {
      setDetectionResult(null);
    }
  }, [detectionInput]);

  // Insert invisible characters between every character in the input
  const insertInvisibleCharacters = (
    text: string, 
    character: keyof typeof invisibleCharacters = 'zeroWidthSpace'
  ): string => {
    if (!text) return "";
    
    const invisible = invisibleCharacters[character];
    let result = "";
    
    for (let i = 0; i < text.length; i++) {
      result += text[i] + invisible;
    }
    
    // Count characters
    const visibleCount = text.length;
    const invisibleCount = text.length; // One invisible char per visible char
    
    setCharCount({
      visible: visibleCount,
      invisible: invisibleCount,
      total: visibleCount + invisibleCount
    });
    
    return result;
  };

  // Replace spaces with invisible characters
  const replaceSpacesWithInvisible = (
    text: string, 
    character: keyof typeof invisibleCharacters = 'brailleBlankPattern'
  ): string => {
    if (!text) return "";
    
    const invisible = invisibleCharacters[character];
    const result = text.replace(/\s/g, invisible);
    
    // Count characters
    const visibleNonSpaceCount = text.replace(/\s/g, '').length;
    const spaceCount = text.length - visibleNonSpaceCount;
    
    setCharCount({
      visible: visibleNonSpaceCount,
      invisible: spaceCount,
      total: text.length
    });
    
    return result;
  };

  // Add invisible characters at random positions
  const addRandomInvisibleCharacters = (
    text: string, 
    character: keyof typeof invisibleCharacters = 'zeroWidthSpace',
    frequency: number = 0.5 // Probability of adding invisible char after each char
  ): string => {
    if (!text) return "";
    
    const invisible = invisibleCharacters[character];
    let result = "";
    let invisibleCount = 0;
    
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      // Randomly decide whether to add invisible character
      if (Math.random() < frequency) {
        result += invisible;
        invisibleCount++;
      }
    }
    
    // Count characters
    setCharCount({
      visible: text.length,
      invisible: invisibleCount,
      total: text.length + invisibleCount
    });
    
    return result;
  };

  // Hide message in carrier text using invisible characters
  const hideMessageInText = (
    message: string, 
    carrierText: string, 
    character: keyof typeof invisibleCharacters = 'zeroWidthSpace'
  ): string => {
    if (!message || !carrierText) return carrierText;
    
    const invisible = invisibleCharacters[character];
    const encodedMessage = message.split('').map(char => char + invisible).join('');
    
    // Insert the encoded message at the beginning of the carrier text
    const result = encodedMessage + carrierText;
    
    // Count characters
    setCharCount({
      visible: carrierText.length + message.length,
      invisible: message.length, // One invisible char per message char
      total: carrierText.length + message.length * 2
    });
    
    return result;
  };

  // Detect invisible characters in text
  const detectInvisibleCharacters = (text: string): string => {
    if (!text) return "";
    
    let result = "";
    const invisibleCharsFound: Record<string, number> = {};
    let totalInvisible = 0;
    
    // Check for each known invisible character
    for (const [name, char] of Object.entries(invisibleCharacters)) {
      const regex = new RegExp(char, 'g');
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      
      if (count > 0) {
        invisibleCharsFound[name] = count;
        totalInvisible += count;
      }
    }
    
    // If no invisible characters found
    if (totalInvisible === 0) {
      return "No invisible characters detected in the text.";
    }
    
    // Build result message
    result = `Found ${totalInvisible} invisible character${totalInvisible > 1 ? 's' : ''} in the text:\n\n`;
    
    for (const [name, count] of Object.entries(invisibleCharsFound)) {
      if (count > 0) {
        result += `• ${formatCharacterName(name)}: ${count} character${count > 1 ? 's' : ''}\n`;
      }
    }
    
    result += `\nVisible length: ${text.length - totalInvisible} characters\n`;
    result += `Total length (including invisible): ${text.length} characters`;
    
    return result;
  };

  // Format character name for display
  const formatCharacterName = (camelCaseName: string): string => {
    return camelCaseName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Generate invisible text based on selected method
  const generateInvisibleText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }
    
    // For this demo, we'll use the "insert between" method
    // In a real app, you might have UI to select different methods
    const result = insertInvisibleCharacters(inputText);
    setOutputText(result);
    setShowPreview(true);
    
    toast({
      title: "Invisible Characters Added",
      description: "Text has been modified with invisible characters",
    });
  };

  // Copy output text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied to Clipboard",
      description: "Modified text has been copied to your clipboard",
    });
  };

  // Clear all fields
  const clearFields = () => {
    if (activeTab === "generate") {
      setInputText("");
      setOutputText("");
      setShowPreview(false);
      setCharCount({ visible: 0, invisible: 0, total: 0 });
    } else {
      setDetectionInput("");
      setDetectionResult(null);
    }
  };

  // Preview component that visually indicates invisible characters
  const TextPreview = ({ text }: { text: string }) => {
    // Replace invisible characters with visible markers for demonstration
    const visibleRepresentation = text
      .replace(/\u200B/g, '<span class="text-rose-500">⟦ZWS⟧</span>')
      .replace(/\u200C/g, '<span class="text-blue-500">⟦ZWNJ⟧</span>')
      .replace(/\u200D/g, '<span class="text-green-500">⟦ZWJ⟧</span>')
      .replace(/\uFEFF/g, '<span class="text-purple-500">⟦ZWNBSP⟧</span>')
      .replace(/\u200A/g, '<span class="text-amber-500">⟦HS⟧</span>')
      .replace(/\u2800/g, '<span class="text-teal-500">⟦BP⟧</span>');
    
    return (
      <div 
        className="bg-gray-50 p-3 border rounded-md mt-2 text-sm font-mono"
        dangerouslySetInnerHTML={{ __html: visibleRepresentation }}
      />
    );
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="generate" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Invisible Characters</TabsTrigger>
          <TabsTrigger value="detect">Detect Invisible Characters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">
                    Input Text
                  </Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="min-h-[120px] mt-2"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={generateInvisibleText}
                    disabled={!inputText.trim()}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    Add Invisible Characters
                  </Button>
                  
                  <Button
                    onClick={clearFields}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {outputText && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Output Text with Invisible Characters
                    </Label>
                    
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPreview(!showPreview)}
                              className="text-gray-500 h-8"
                            >
                              {showPreview ? "Hide Preview" : "Show Preview"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-[200px]">
                              Preview shows invisible characters with visible markers.
                              These markers are not part of the actual text.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Textarea
                      value={outputText}
                      readOnly
                      className="min-h-[120px] font-mono"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {/* Character indicators can go here */}
                    </div>
                  </div>
                  
                  {showPreview && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Visual Preview (with markers)
                      </Label>
                      <TextPreview text={outputText} />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="bg-gray-50 p-3 rounded border">
                      <span className="font-medium">Visible:</span> {charCount.visible}
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <span className="font-medium">Invisible:</span> {charCount.invisible}
                    </div>
                    <div className="bg-gray-50 p-3 rounded border">
                      <span className="font-medium">Total:</span> {charCount.total}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="detect" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="detection-input" className="text-base font-medium">
                    Paste Text to Analyze
                  </Label>
                  <Textarea
                    id="detection-input"
                    value={detectionInput}
                    onChange={(e) => setDetectionInput(e.target.value)}
                    placeholder="Paste text to check for invisible characters..."
                    className="min-h-[120px] mt-2"
                  />
                </div>
                
                <Button
                  onClick={clearFields}
                  variant="outline"
                  className="border-gray-300"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {detectionResult && (
            <Card>
              <CardContent className="p-6">
                <Label className="text-base font-medium">
                  Detection Results
                </Label>
                
                <div className="bg-gray-50 p-4 rounded-md border mt-2 whitespace-pre-line font-mono text-sm">
                  {detectionResult}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-3">Available Invisible Characters</h3>
            <ul className="space-y-3">
              <li>
                <div className="font-medium">Zero Width Space (ZWS)</div>
                <p className="text-sm text-gray-600">Used between words where a line break should not occur.</p>
              </li>
              <li>
                <div className="font-medium">Zero Width Non-Joiner (ZWNJ)</div>
                <p className="text-sm text-gray-600">Prevents two adjacent characters from joining when they would normally join.</p>
              </li>
              <li>
                <div className="font-medium">Zero Width Joiner (ZWJ)</div>
                <p className="text-sm text-gray-600">Allows characters to join when they normally wouldn't, like in emoji sequences.</p>
              </li>
              <li>
                <div className="font-medium">Zero Width No-Break Space (ZWNBSP)</div>
                <p className="text-sm text-gray-600">Also known as Byte Order Mark (BOM), this prevents line breaks.</p>
              </li>
              <li>
                <div className="font-medium">Hair Space</div>
                <p className="text-sm text-gray-600">Very thin space, barely visible but technically has width.</p>
              </li>
              <li>
                <div className="font-medium">Braille Blank Pattern</div>
                <p className="text-sm text-gray-600">Empty braille character that appears as a space but has different properties.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-3">Common Uses</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Prevent text from being copied accurately in copy-protected content</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Hide secret messages within normal text (steganography)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Create text formatting tricks that bypass character limits</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Prevent automated systems from correctly parsing text</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Add unique fingerprints to text for tracking purposes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Create unique usernames that look identical to others</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">Format text in situations where spaces are not allowed</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const introduction = "Add and detect invisible characters in text for various purposes like fingerprinting, steganography, and copy protection.";
  
  const description = `
    Our Invisible Character tool is a versatile utility that allows you to insert and detect invisible Unicode characters in text. These characters have zero or near-zero width, making them imperceptible to human readers while remaining part of the text data. This creates numerous possibilities for text manipulation that serves both practical and creative purposes.
    
    The tool supports several types of invisible characters including Zero Width Space, Zero Width Joiner, Zero Width Non-Joiner, and others that each have different technical properties and use cases. You can insert these characters between existing visible characters, replace spaces with invisible equivalents, or even hide entire messages within normal-looking carrier text using advanced text steganography techniques.
    
    In addition to generating text with invisible characters, this tool also provides detection capabilities to analyze text and identify any invisible characters it may contain. This feature is particularly useful for security purposes, allowing you to verify whether text contains hidden data or has been manipulated in ways not immediately obvious.
    
    Common applications for invisible characters include digital watermarking (adding unique identifiers to text to track its source), steganography (hiding messages within innocent-looking text), bypass techniques for character limits on social media, and creating special text formatting effects where normal spacing isn't supported.
  `;

  const howToUse = [
    "Navigate to the 'Generate Invisible Characters' tab to add invisible characters to your text.",
    "Enter the text you want to modify in the input field.",
    "Click the 'Add Invisible Characters' button to insert invisible characters between each visible character.",
    "Review the output text, which will appear identical to your input but contain invisible characters.",
    "Use the 'Show Preview' option to see a visual representation of where invisible characters have been placed.",
    "Copy the modified text to use it elsewhere by clicking the 'Copy' button.",
    "To check if text contains invisible characters, switch to the 'Detect Invisible Characters' tab, paste the text, and view the analysis results."
  ];

  const features = [
    "Support for multiple types of invisible Unicode characters including Zero Width Space and Zero Width Joiner",
    "Visual preview mode to see where invisible characters are placed in the text",
    "Character count statistics showing visible, invisible, and total character counts",
    "Detection functionality to analyze and identify invisible characters in text",
    "Copy functionality to easily use modified text in other applications",
    "Detailed information about each invisible character type and its properties"
  ];

  const faqs = [
    {
      question: "Are these invisible characters supported everywhere?",
      answer: "Most modern browsers, text editors, and applications support Unicode invisible characters, but support can vary. Some platforms may strip or replace these characters for security reasons. Social media platforms, in particular, often filter out some invisible characters to prevent misuse. Additionally, when copying text with invisible characters between different applications, the preservation of these characters depends on how each application handles Unicode text. For best results, test the modified text in your specific target environment."
    },
    {
      question: "Can invisible characters be used to hide messages?",
      answer: "Yes, invisible characters can be used for basic text steganography - hiding messages within seemingly normal text. By encoding information in patterns of invisible characters interspersed with visible text, you can embed secret messages that aren't apparent to casual readers. However, be aware that this is not secure encryption. Anyone who checks for invisible characters can detect their presence, even if they may not be able to easily decode your specific message. For truly secure communication, proper encryption methods should be used instead of or in addition to invisible character techniques."
    },
    {
      question: "Will adding invisible characters affect text length limits?",
      answer: "Yes, invisible characters count toward character limits in most systems, even though they're not visible. Each invisible character uses the same amount of data storage as a visible character. This means that text with many invisible characters may reach length limits faster than expected. On the other hand, this property can sometimes be useful - for instance, when you want to make text appear shorter than its technical character count, or when working with fixed-width display environments where you need precise control over text positioning."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="invisible-character"
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

export default InvisibleCharacterDetailed;