import { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const JSONBeautifierDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [beautifiedJSON, setBeautifiedJSON] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleBeautifyJSON = () => {
    setError(null);
    setBeautifiedJSON("");

    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to beautify",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Clean comments to handle commented JSON
      const cleanedInput = jsonInput
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
      
      let parsedJSON = JSON.parse(cleanedInput);
      
      // Sort keys if option is selected
      if (sortKeys) {
        parsedJSON = sortJSONKeys(parsedJSON);
      }
      
      // Format with proper indentation
      const beautified = JSON.stringify(parsedJSON, null, indentSize);
      setBeautifiedJSON(beautified);
      
      toast({
        title: "Success",
        description: "JSON beautified successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to sort JSON keys
  const sortJSONKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: Record<string, any> = {};
    
    for (const key of sortedKeys) {
      sortedObj[key] = sortJSONKeys(obj[key]);
    }
    
    return sortedObj;
  };

  const handleClearJSON = () => {
    setJsonInput("");
    setBeautifiedJSON("");
    setError(null);
  };

  const handleCopyBeautified = () => {
    if (beautifiedJSON) {
      navigator.clipboard.writeText(beautifiedJSON);
      toast({
        title: "Copied",
        description: "Beautified JSON copied to clipboard",
      });
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to minify",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean comments to handle commented JSON
      const cleanedInput = jsonInput
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
      
      const parsedJSON = JSON.parse(cleanedInput);
      const minified = JSON.stringify(parsedJSON);
      setBeautifiedJSON(minified);
      
      toast({
        title: "Success",
        description: "JSON minified successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getToolContent = () => {
    return {
      title: "JSON Beautifier",
      introduction: "Transform messy JSON into beautifully formatted, readable code.",
      description: "Our JSON Beautifier converts unformatted, minified, or poorly structured JSON data into a clean, properly indented format that's easy to read and understand. With customizable indentation, sorting options, and automatic validation, this tool helps you transform compact JSON into a well-organized structure that improves readability and makes debugging easier. Perfect for working with API responses, configuration files, or any JSON data that needs beautification.",
      howToUse: [
        "Enter or paste your JSON data in the input field",
        "Adjust beautification options as needed (indentation size, key sorting)",
        "Click 'Beautify JSON' to transform your code",
        "View the beautified result with proper structure",
        "Copy the formatted JSON to your clipboard"
      ],
      features: [
        "Intelligent formatting with customizable indentation",
        "Optional alphabetical sorting of object keys",
        "Automatic correction of common formatting issues",
        "One-click copying of beautified results",
        "Detailed error reporting for invalid JSON",
        "Works with all JSON structures including nested objects and arrays",
        "Browser-based processing for privacy and security",
        "Instant beautification with no file size limitations*"
      ],
      faqs: [
        {
          question: "How does the JSON Beautifier differ from the JSON Formatter?",
          answer: "While they perform similar functions, the JSON Beautifier focuses on transforming minified or poorly formatted JSON into a readable structure with a focus on aesthetics, while the Formatter offers more technical options for standardizing JSON representation."
        },
        {
          question: "Will beautifying my JSON change its structure or values?",
          answer: "No, beautification only affects the presentation of your JSON by adding whitespace and line breaks. The actual data structure, keys, and values remain exactly the same."
        },
        {
          question: "Can I beautify incomplete or invalid JSON?",
          answer: "No, the JSON must be valid according to the JSON specification for beautification to work. If your JSON is invalid, the tool will provide a detailed error message to help you identify and fix the problem."
        },
        {
          question: "What's the best indentation level for readable JSON?",
          answer: "Most developers prefer 2 or 4 spaces for indentation. Two spaces provide a good balance between readability and compact representation, while 4 spaces can make deeply nested structures more distinguishable."
        }
      ]
    };
  };

  const toolContent = getToolContent();

  const renderToolInterface = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="indentSize">Indentation Size</Label>
                  <Input
                    id="indentSize"
                    type="number"
                    min={0}
                    max={8}
                    value={indentSize}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 8) {
                        setIndentSize(value);
                      }
                    }}
                    className="w-24"
                  />
                  <p className="text-xs text-gray-500">Number of spaces (0-8)</p>
                </div>
              </div>
              
              <div className="space-y-3 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sortKeys"
                    checked={sortKeys}
                    onCheckedChange={(checked) => setSortKeys(checked as boolean)}
                  />
                  <Label htmlFor="sortKeys">Sort object keys alphabetically</Label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jsonInput">Input JSON</Label>
                <Textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"example":"Paste your minified JSON here","nested":{"property":123},"items":[1,2,3]}'
                  className="font-mono min-h-[250px]"
                />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleBeautifyJSON} disabled={loading}>
                    {loading ? "Processing..." : "Beautify JSON"}
                  </Button>
                  <Button variant="outline" onClick={handleMinify}>
                    Minify
                  </Button>
                  <Button variant="outline" onClick={handleClearJSON}>
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="beautifiedJSON">Output (Beautified JSON)</Label>
                  {beautifiedJSON && (
                    <Button variant="ghost" size="sm" onClick={handleCopyBeautified}>
                      <i className="fas fa-copy mr-1"></i> Copy
                    </Button>
                  )}
                </div>
                
                {error ? (
                  <Alert variant="destructive" className="min-h-[250px] flex items-start">
                    <AlertDescription>
                      <code className="text-sm font-mono">{error}</code>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Textarea
                    id="beautifiedJSON"
                    value={beautifiedJSON}
                    readOnly
                    placeholder="Beautified JSON will appear here"
                    className="font-mono min-h-[250px]"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>The JSON Beautifier transforms your compact or poorly formatted JSON into a clean, readable format with proper indentation and line breaks. Perfect for making complex JSON structures easier to understand and debug.</p>
        </div>
      </div>
    );
  };

  return (
    <ToolPageTemplate
      toolSlug={toolSlug}
      toolContent={
        <ToolContentTemplate
          introduction={toolContent.introduction}
          description={toolContent.description}
          howToUse={toolContent.howToUse}
          features={toolContent.features}
          faqs={toolContent.faqs}
          toolInterface={renderToolInterface()}
        />
      }
    />
  );
};

export default JSONBeautifierDetailed;