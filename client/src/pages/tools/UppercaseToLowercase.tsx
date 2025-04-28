import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const UppercaseToLowercase = () => {
  const [text, setText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [activeTab, setActiveTab] = useState("lowercase");

  useEffect(() => {
    document.title = "Uppercase To Lowercase - ToolsHub";
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Apply transformation whenever text or selected tab changes
    applyTransformation();
  }, [text, activeTab]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const applyTransformation = () => {
    if (!text) {
      setTransformedText("");
      return;
    }

    switch (activeTab) {
      case "lowercase":
        setTransformedText(text.toLowerCase());
        break;
      case "uppercase":
        setTransformedText(text.toUpperCase());
        break;
      case "capitalize":
        setTransformedText(
          text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")
        );
        break;
      case "sentence":
        // Capitalize first letter of each sentence
        setTransformedText(
          text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase())
        );
        break;
      case "alternating":
        // Alternate between lowercase and uppercase
        setTransformedText(
          text.split("").map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join("")
        );
        break;
      case "inverse":
        // Inverse case of each character
        setTransformedText(
          text.split("").map(char => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          }).join("")
        );
        break;
      default:
        setTransformedText(text.toLowerCase());
    }
  };

  const clearText = () => {
    setText("");
    setTransformedText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transformedText);
    toast({
      title: "Copied!",
      description: "Transformed text copied to clipboard.",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Uppercase To Lowercase Converter</h1>
              <p className="text-gray-600">Convert text between uppercase, lowercase, and other case formats.</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here to convert case..."
                className="w-full h-40 p-4 resize-none"
              />
              <div className="mt-2 text-right text-sm text-gray-500">
                {text.length} characters / {text.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>

            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="lowercase">lowercase</TabsTrigger>
                  <TabsTrigger value="uppercase">UPPERCASE</TabsTrigger>
                  <TabsTrigger value="capitalize">Title Case</TabsTrigger>
                  <TabsTrigger value="sentence">Sentence case</TabsTrigger>
                  <TabsTrigger value="alternating">aLtErNaTiNg</TabsTrigger>
                  <TabsTrigger value="inverse">InVeRsE cAsE</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lowercase" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Converts all characters to lowercase.
                  </p>
                </TabsContent>
                
                <TabsContent value="uppercase" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Converts all characters to uppercase.
                  </p>
                </TabsContent>
                
                <TabsContent value="capitalize" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Capitalizes the first letter of each word.
                  </p>
                </TabsContent>
                
                <TabsContent value="sentence" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Capitalizes the first letter of each sentence.
                  </p>
                </TabsContent>
                
                <TabsContent value="alternating" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Alternates between lowercase and uppercase for each character.
                  </p>
                </TabsContent>
                
                <TabsContent value="inverse" className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Inverts the case of each character.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Transformed text</label>
              <Textarea
                value={transformedText}
                readOnly
                className="w-full h-40 p-4 resize-none bg-gray-50"
                placeholder="Transformed text will appear here"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={copyToClipboard}
                disabled={!transformedText}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="far fa-copy mr-2"></i>
                <span>Copy to Clipboard</span>
              </Button>

              <Button
                onClick={clearText}
                variant="outline"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear Text</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UppercaseToLowercase;