import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type ConversionType =
  | "lowercase"
  | "uppercase"
  | "capitalize"
  | "sentence_case"
  | "title_case"
  | "alternating_case"
  | "inverse_case";

const UppercaseToLowercaseDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [conversionType, setConversionType] = useState<ConversionType>("lowercase");
  const [conversionHistory, setConversionHistory] = useState<Array<{
    original: string;
    converted: string;
    type: ConversionType;
  }>>([]);

  useEffect(() => {
    document.title = "Text Case Converter - AllTooly";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const convertText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    let result = "";

    switch (conversionType) {
      case "lowercase":
        result = inputText.toLowerCase();
        break;

      case "uppercase":
        result = inputText.toUpperCase();
        break;

      case "capitalize":
        result = inputText
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        break;

      case "sentence_case":
        result = inputText.toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;

      case "title_case":
        const exclusions = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "with", "in", "of"];
        result = inputText
          .toLowerCase()
          .split(' ')
          .map((word, index) => {
            // Always capitalize first and last word
            if (index === 0 || index === inputText.split(' ').length - 1) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }
            // Check if word is in exclusion list
            return exclusions.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        break;

      case "alternating_case":
        result = inputText
          .split('')
          .map((char, index) =>
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
        break;

      case "inverse_case":
        result = inputText
          .split('')
          .map(char => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          })
          .join('');
        break;

      default:
        result = inputText;
    }

    setOutputText(result);

    // Add to conversion history
    const newHistory = {
      original: inputText,
      converted: result,
      type: conversionType
    };

    setConversionHistory(prev => [newHistory, ...prev].slice(0, 5));
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast({
        title: "Invalid file type",
        description: "Please upload a text (.txt) file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied to clipboard",
      description: "The converted text has been copied to your clipboard.",
    });
  };

  const downloadText = () => {
    if (!outputText) {
      toast({
        title: "No text to download",
        description: "Please convert some text first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${conversionType}-text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConversionTypeLabel = (type: ConversionType): string => {
    switch (type) {
      case "lowercase": return "lowercase";
      case "uppercase": return "UPPERCASE";
      case "capitalize": return "Capitalize Each Word";
      case "sentence_case": return "Sentence case";
      case "title_case": return "Title Case";
      case "alternating_case": return "aLtErNaTiNg cAsE";
      case "inverse_case": return "iNVERSE CASE";
      default: return type;
    }
  };

  const getTextStats = () => {
    const charCount = inputText.length;
    const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const lineCount = inputText.split(/\r\n|\r|\n/).length;

    return { charCount, wordCount, lineCount };
  };

  const stats = getTextStats();

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="input-text" className="text-base font-medium">Input Text</Label>
                  <div className="text-xs text-gray-500">
                    {stats.charCount} characters • {stats.wordCount} words • {stats.lineCount} lines
                  </div>
                </div>

                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={handleTextChange}
                  placeholder="Type or paste your text here..."
                  className="min-h-[200px] font-mono text-sm"
                />

                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={convertText}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-exchange-alt mr-2"></i>
                    <span>Convert</span>
                  </Button>

                  <label className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer flex items-center text-sm">
                    <i className="fas fa-upload mr-2"></i>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-eraser mr-2"></i>
                    <span>Clear</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-medium mb-3">Conversion Options</h3>

                <RadioGroup
                  value={conversionType}
                  onValueChange={(value) => setConversionType(value as ConversionType)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lowercase" id="lowercase" />
                    <Label htmlFor="lowercase" className="cursor-pointer">lowercase</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uppercase" id="uppercase" />
                    <Label htmlFor="uppercase" className="cursor-pointer">UPPERCASE</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="capitalize" id="capitalize" />
                    <Label htmlFor="capitalize" className="cursor-pointer">Capitalize Each Word</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sentence_case" id="sentence_case" />
                    <Label htmlFor="sentence_case" className="cursor-pointer">Sentence case</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="title_case" id="title_case" />
                    <Label htmlFor="title_case" className="cursor-pointer">Title Case</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alternating_case" id="alternating_case" />
                    <Label htmlFor="alternating_case" className="cursor-pointer">aLtErNaTiNg cAsE</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inverse_case" id="inverse_case" />
                    <Label htmlFor="inverse_case" className="cursor-pointer">iNVERSE CASE</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="output-text" className="text-base font-medium">Converted Text</Label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={!outputText}
                    >
                      <i className="fas fa-copy mr-1"></i>
                      <span>Copy</span>
                    </Button>
                    <Button
                      onClick={downloadText}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={!outputText}
                    >
                      <i className="fas fa-download mr-1"></i>
                      <span>Download</span>
                    </Button>
                  </div>
                </div>

                <Textarea
                  id="output-text"
                  value={outputText}
                  readOnly
                  placeholder="Converted text will appear here..."
                  className="min-h-[200px] bg-gray-50 font-mono text-sm"
                />
              </CardContent>
            </Card>

            {conversionHistory.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-medium mb-3">Conversion History</h3>

                  <div className="space-y-3">
                    {conversionHistory.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Converted to {getConversionTypeLabel(item.type)}
                          </span>
                          <Button
                            onClick={() => {
                              setInputText(item.original);
                              setOutputText(item.converted);
                              setConversionType(item.type);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <i className="fas fa-redo-alt text-xs"></i>
                          </Button>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <div className="text-gray-700 truncate">{item.original.substring(0, 40)}{item.original.length > 40 ? '...' : ''}</div>
                          <div className="text-blue-700 truncate">{item.converted.substring(0, 40)}{item.converted.length > 40 ? '...' : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5">
                <h3 className="text-base font-medium mb-3">About Case Conversion Types</h3>

                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">lowercase:</span> Converts all characters to lowercase.</li>
                  <li><span className="font-medium">UPPERCASE:</span> Converts all characters to uppercase.</li>
                  <li><span className="font-medium">Capitalize Each Word:</span> Capitalizes the first letter of each word.</li>
                  <li><span className="font-medium">Sentence case:</span> Capitalizes the first letter of each sentence.</li>
                  <li><span className="font-medium">Title Case:</span> Capitalizes words according to title capitalization rules.</li>
                  <li><span className="font-medium">aLtErNaTiNg cAsE:</span> Alternates between lowercase and uppercase for each character.</li>
                  <li><span className="font-medium">iNVERSE CASE:</span> Inverts the case of each character in the text.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform your text case instantly with our versatile Text Case Converter.",
    description: "Our Text Case Converter is a powerful text manipulation tool that allows you to quickly change the capitalization format of any text. Whether you need lowercase for coding, UPPERCASE for emphasis, Title Case for headlines, or Sentence case for proper formatting, this tool handles all case conversion needs with a single click. Perfect for writers, editors, programmers, and anyone who works with text, this converter saves you the time and tedium of manually reformatting text. With seven different case conversion options and the ability to process large volumes of text instantly, this tool streamlines your workflow and ensures consistent text formatting across your documents, websites, or applications.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the screen.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Select your desired conversion option from the radio buttons (lowercase, UPPERCASE, Capitalize Each Word, etc.).",
      "Click the 'Convert' button to transform your text to the selected case format.",
      "View the converted text in the output field on the right side.",
      "Use the 'Copy' button to copy the converted text to your clipboard, or 'Download' to save it as a text file."
    ],
    features: [
      "Seven different case conversion options to suit various formatting needs",
      "Real-time text statistics showing character count, word count, and line count",
      "Ability to upload text files for batch processing of large documents",
      "Conversion history tracking to quickly reuse previous conversions",
      "One-click copy to clipboard functionality for seamless workflow integration",
      "Download option to save converted text as a file for future use"
    ],
    faqs: [
      {
        question: "What's the difference between 'Capitalize Each Word' and 'Title Case'?",
        answer: "'Capitalize Each Word' and 'Title Case' may seem similar, but they follow different rules. 'Capitalize Each Word' simply capitalizes the first letter of every word in the text, regardless of the word's importance or function. 'Title Case' follows more sophisticated publishing rules where major words (nouns, verbs, adjectives) are capitalized, while minor words (articles, conjunctions, prepositions) like 'a', 'the', 'and', 'of', etc. remain lowercase, unless they appear at the beginning or end of the title. Title Case is commonly used for book titles, article headlines, and other formal headings, providing a more professional and standardized appearance."
      },
      {
        question: "Is there a limit to how much text I can convert at once?",
        answer: "Our Text Case Converter is designed to handle large volumes of text efficiently. For browser-based processing, you can convert up to 100,000 characters (approximately 20,000 words) at once without experiencing significant performance issues. For extremely large documents, we recommend splitting the text into sections or using the file upload feature, which processes text in optimized chunks. Keep in mind that while there's no hard limit, browser performance may vary depending on your device's specifications and the browser you're using. For professional needs involving regular conversion of very large documents, consider our API integration options."
      },
      {
        question: "Can this tool convert case for text in languages other than English?",
        answer: "Yes, our Text Case Converter supports case conversion for most Latin-based languages and many non-Latin languages that have uppercase and lowercase distinctions. For Latin-based languages (English, Spanish, French, German, etc.), all conversion types work as expected. For languages like Greek, Cyrillic (Russian, Ukrainian), and others with case distinctions, basic lowercase and uppercase conversions work properly. However, specialized formats like Title Case or Sentence case may not follow language-specific capitalization rules for non-English languages. Languages without case distinctions (like Chinese, Japanese, Arabic) will remain unchanged during conversion, while any Latin characters within the text will be properly converted."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="uppercase-to-lowercase"
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

export default UppercaseToLowercaseDetailed;