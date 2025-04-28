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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type TextStyle = "superscript" | "subscript" | "small-caps" | "tiny" | "unicode-small";

const SmallTextGeneratorDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [textStyle, setTextStyle] = useState<TextStyle>("unicode-small");
  const [conversionHistory, setConversionHistory] = useState<Array<{ input: string, output: string, style: TextStyle }>>([]);
  const { toast } = useToast();

  // Maps for various text conversions
  const unicodeSmallMap: Record<string, string> = {
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
    'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ',
    's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ',
    'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ᵠ', 'R': 'ᴿ',
    'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', '.': '·', ',': '‚', ':': '˸', ';': '׆'
  };

  const superscriptMap: Record<string, string> = {
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
    'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'ᵠ', 'r': 'ʳ',
    's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
  };

  const subscriptMap: Record<string, string> = {
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ',
    'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ',
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
  };

  useEffect(() => {
    // Generate the output text whenever input or style changes
    if (inputText) {
      convertText();
    }
  }, [inputText, textStyle]);

  const convertText = () => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    let result = "";

    switch (textStyle) {
      case "unicode-small":
        result = inputText.split('').map(char => unicodeSmallMap[char] || char).join("");
        break;
      
      case "superscript":
        result = inputText.split('').map(char => superscriptMap[char] || char).join("");
        break;
      
      case "subscript":
        result = inputText.split('').map(char => subscriptMap[char] || char).join("");
        break;
      
      case "small-caps":
        result = inputText.toLowerCase().replace(/[a-z]/g, c => String.fromCharCode(c.charCodeAt(0) - 32 + 0x1C4D));
        break;
      
      case "tiny":
        result = `<span style="font-size: 0.7em;">${inputText}</span>`;
        break;
      
      default:
        result = inputText;
    }

    setOutputText(result);
  };

  const handleStyleChange = (value: string) => {
    setTextStyle(value as TextStyle);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const saveToHistory = () => {
    if (!inputText.trim() || !outputText.trim()) return;
    
    const historyItem = {
      input: inputText,
      output: outputText,
      style: textStyle
    };
    
    setConversionHistory(prev => [historyItem, ...prev].slice(0, 5));
    
    toast({
      title: "Saved to history",
      description: "Your conversion has been saved to history",
    });
  };

  const copyToClipboard = () => {
    if (!outputText.trim()) return;
    
    navigator.clipboard.writeText(outputText);
    
    toast({
      title: "Copied to clipboard",
      description: "The small text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const loadFromHistory = (item: { input: string, output: string, style: TextStyle }) => {
    setInputText(item.input);
    setTextStyle(item.style);
    setOutputText(item.output);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Small Text Generator</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to convert to small text..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-32 mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="text-style" className="text-base font-medium">Text Style</Label>
                  <Select 
                    value={textStyle} 
                    onValueChange={handleStyleChange}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unicode-small">Unicode Small Text</SelectItem>
                      <SelectItem value="superscript">Superscript</SelectItem>
                      <SelectItem value="subscript">Subscript</SelectItem>
                      <SelectItem value="small-caps">Small Caps</SelectItem>
                      <SelectItem value="tiny">Tiny HTML Text</SelectItem>
                    </SelectContent>
                  </Select>
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
          
          {conversionHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Conversion History</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {conversionHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="text-sm font-medium truncate">{item.input}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{item.output}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.style.replace('-', ' ')}
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
                <h3 className="text-lg font-medium">Generated Small Text</h3>
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
                    <i className="fas fa-text-height text-4xl"></i>
                  </div>
                  <p className="text-gray-500">Your small text will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Enter text and choose a style to begin</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Style Examples</h3>
              <Tabs defaultValue="unicode-small" className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="unicode-small">Unicode</TabsTrigger>
                  <TabsTrigger value="superscript">Super</TabsTrigger>
                  <TabsTrigger value="subscript">Sub</TabsTrigger>
                  <TabsTrigger value="small-caps">Caps</TabsTrigger>
                  <TabsTrigger value="tiny">Tiny</TabsTrigger>
                </TabsList>
                
                <TabsContent value="unicode-small" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Unicode Small Text</p>
                  <p>Normal: Hello World 123</p>
                  <p>Small: ᴴᵉˡˡᵒ ᵂᵒʳˡᵈ ¹²³</p>
                  <p className="text-xs text-gray-500 mt-2">Works well for most letters, numbers, and some symbols.</p>
                </TabsContent>
                
                <TabsContent value="superscript" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Superscript</p>
                  <p>Normal: Hello World 123</p>
                  <p>Small: ᴴᵉˡˡᵒ ᵂᵒʳˡᵈ ¹²³</p>
                  <p className="text-xs text-gray-500 mt-2">Raises text above the baseline, ideal for mathematical expressions.</p>
                </TabsContent>
                
                <TabsContent value="subscript" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Subscript</p>
                  <p>Normal: Hello World 123</p>
                  <p>Small: ₕₑₗₗₒ ₩ₒᵣₗₐ ₁₂₃</p>
                  <p className="text-xs text-gray-500 mt-2">Places text below the baseline, commonly used in scientific notation.</p>
                </TabsContent>
                
                <TabsContent value="small-caps" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Small Caps</p>
                  <p>Normal: Hello World 123</p>
                  <p>Small: ʜᴇʟʟᴏ ᴡᴏʀʟᴅ 123</p>
                  <p className="text-xs text-gray-500 mt-2">Uppercase letters at a reduced size, ideal for headings and emphasis.</p>
                </TabsContent>
                
                <TabsContent value="tiny" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <p className="font-medium mb-2">Tiny HTML</p>
                  <p>Normal: Hello World 123</p>
                  <p>Small: <span style={{ fontSize: "0.7em" }}>Hello World 123</span></p>
                  <p className="text-xs text-gray-500 mt-2">Uses HTML to reduce text size, only works when pasted into HTML contexts.</p>
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
                <i className="fas fa-comment text-blue-600"></i>
              </div>
              <h3 className="font-medium">Social Media</h3>
            </div>
            <p className="text-sm text-gray-600">
              Make your social media posts stand out with unique small text styles that grab attention and express your personality.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-signature text-purple-600"></i>
              </div>
              <h3 className="font-medium">Signatures</h3>
            </div>
            <p className="text-sm text-gray-600">
              Create distinctive email signatures, forum signatures, or profile bios with small text that adds a professional yet unique touch.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-file-alt text-green-600"></i>
              </div>
              <h3 className="font-medium">Documents</h3>
            </div>
            <p className="text-sm text-gray-600">
              Add subscript, superscript, or small caps to academic papers, technical documents, or creative writing for proper formatting.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="text-yellow-500 mr-3 mt-1">
            <i className="fas fa-exclamation-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">Compatibility Note</h3>
            <p className="text-yellow-700 text-sm">
              Small text relies on Unicode characters that may not display properly in all applications or platforms.
              Always test your small text in the intended platform before using it in important contexts.
              Some styles (like HTML tiny text) only work when pasted into websites or applications that support HTML.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Create stylish small text for social media, signatures, and more with our versatile text generator.",
    description: "Our Small Text Generator transforms standard text into miniaturized versions using a variety of Unicode character substitutions and special formatting techniques. This versatile tool offers multiple style options including Unicode small text, superscript, subscript, small caps, and HTML-based tiny text. Each style serves different purposes, from mathematical notations to aesthetic social media posts. Unicode small text and small caps are perfect for creating distinctive social media profiles, comments, and messages that stand out in busy feeds. Superscript and subscript styles are invaluable for academic and scientific writing, enabling proper formatting for mathematical expressions, chemical formulas, and footnote references. The generator features an intuitive interface that instantly transforms your input text as you type, with a side-by-side preview showing the exact appearance of your converted text. Additional features include a conversion history that saves your recent transformations for easy reuse, one-click copying to clipboard for seamless integration with other applications, and a detailed style guide showing examples of each text format. Whether you're looking to enhance your online presence with unique formatting, properly format academic content, or simply add creative flair to your digital communication, our Small Text Generator provides all the tools you need in one convenient solution.",
    howToUse: [
      "Enter your text in the input field on the left side of the generator.",
      "Select your preferred text style from the dropdown menu (Unicode Small, Superscript, Subscript, Small Caps, or Tiny HTML).",
      "Watch as your text is instantly converted to the selected small text style in the preview area.",
      "Click the 'Copy to Clipboard' button to copy the generated small text for use in other applications.",
      "Optionally, save your conversion to history by clicking 'Save to History' for future reference.",
      "To reuse a previous conversion, simply click on any item in your conversion history.",
      "Use the style examples tab to see previews of how each style will format your text."
    ],
    features: [
      "Five different small text styles including Unicode small, superscript, subscript, small caps, and HTML tiny text",
      "Real-time conversion preview that updates as you type your input text",
      "Conversion history that saves your recent text transformations for easy reuse",
      "One-click copying to clipboard for seamless integration with other applications",
      "Detailed style examples showing how each text format appears with sample text",
      "Compatibility notes to help you choose the right style for your specific use case"
    ],
    faqs: [
      {
        question: "Why isn't my small text displaying correctly in some applications?",
        answer: "Small text generated by this tool primarily uses Unicode characters that may not be supported in all applications, platforms, or fonts. Each application has different levels of Unicode support, and some older systems may have limited character sets. For example, while most modern web browsers, social media platforms, and messaging apps support these special characters, older email clients, certain document editors, or custom applications might not render them correctly. Additionally, the specific font being used can impact display quality – some fonts have more complete Unicode coverage than others. If you notice display issues, try using a different small text style or test the generated text in your target application before using it in important contexts. For maximum compatibility, the 'Tiny HTML' style is best used only in contexts that support HTML formatting, such as websites or rich-text editors."
      },
      {
        question: "What's the difference between the various small text styles?",
        answer: "Each small text style serves different purposes and has unique characteristics: 1) Unicode Small Text uses special Unicode characters to create miniaturized versions of standard letters. It offers good general compatibility and works well for social media and casual use. 2) Superscript places characters above the normal text baseline and is commonly used for exponents, footnotes, and mathematical expressions. 3) Subscript positions characters below the text baseline, making it ideal for chemical formulas, mathematical notation, and footnote references. 4) Small Caps transforms text into uppercase letters at a reduced size, commonly used in publishing for acronyms, headings, and emphasis. 5) Tiny HTML embeds HTML code to reduce text size, making it appropriate for web content but not for plain text contexts. When choosing a style, consider both the aesthetic effect you want to achieve and where you plan to use the text, as compatibility varies between styles."
      },
      {
        question: "Can I use small text generated by this tool for commercial purposes?",
        answer: "Yes, you can use the small text generated by this tool for commercial purposes without restrictions. The tool utilizes standard Unicode characters and formatting techniques that are freely available for any use. There are no copyright restrictions on the output text itself since the tool is simply converting characters using publicly available Unicode standards rather than creating original copyrighted content. However, please note two important considerations: 1) While the generated text itself is free to use commercially, be mindful of the content you're converting – if your original text contains copyrighted material, converting it to small text doesn't change copyright status. 2) Some platforms or applications may have their own terms of service regarding text formatting or special characters, especially for advertising purposes. Always check platform-specific guidelines when using specialized formatting for commercial communications."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="small-text-generator"
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

export default SmallTextGeneratorDetailed;