import { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface JSONFormatterOptions {
  indent: number;
  sortKeys: boolean;
  removeComments: boolean;
  escapeUnicode: boolean;
}

const JSONFormatterDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [formattedJSON, setFormattedJSON] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [options, setOptions] = useState<JSONFormatterOptions>({
    indent: 2,
    sortKeys: false,
    removeComments: true,
    escapeUnicode: false,
  });
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleFormatJSON = () => {
    setError(null);
    setFormattedJSON("");

    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to format",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Clean comments if needed
      let cleanedInput = jsonInput;
      if (options.removeComments) {
        // Remove single-line comments
        cleanedInput = cleanedInput.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments
        cleanedInput = cleanedInput.replace(/\/\*[\s\S]*?\*\//g, '');
      }

      const parsedJSON = JSON.parse(cleanedInput);
      
      // Handle sorting if enabled
      const processedJSON = options.sortKeys ? sortJSONKeys(parsedJSON) : parsedJSON;
      
      // Format with proper indentation
      const formatted = JSON.stringify(
        processedJSON, 
        options.escapeUnicode ? unicodeReplacer : undefined, 
        options.indent
      );
      
      setFormattedJSON(formatted);
      setActiveTab("output");
      toast({
        title: "Success",
        description: "JSON formatted successfully",
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

  // Helper function to handle unicode escaping
  const unicodeReplacer = (_key: string, value: any) => {
    if (typeof value === 'string') {
      return value.replace(/[^\x00-\x7F]/g, (char) => {
        return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
      });
    }
    return value;
  };

  const handleClearJSON = () => {
    setJsonInput("");
    setFormattedJSON("");
    setError(null);
  };

  const handleCopyFormatted = () => {
    if (formattedJSON) {
      navigator.clipboard.writeText(formattedJSON);
      toast({
        title: "Copied",
        description: "Formatted JSON copied to clipboard",
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
      // Clean comments if needed
      let cleanedInput = jsonInput;
      if (options.removeComments) {
        cleanedInput = cleanedInput.replace(/\/\/.*$/gm, '');
        cleanedInput = cleanedInput.replace(/\/\*[\s\S]*?\*\//g, '');
      }

      const parsedJSON = JSON.parse(cleanedInput);
      const minified = JSON.stringify(parsedJSON);
      setFormattedJSON(minified);
      setActiveTab("output");
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

  const handleIndentChange = (value: string) => {
    const indent = parseInt(value);
    if (!isNaN(indent) && indent >= 0 && indent <= 8) {
      setOptions({ ...options, indent });
    }
  };

  const getToolContent = () => {
    switch (toolSlug) {
      case "json-formatter":
        return {
          title: "JSON Formatter",
          introduction: "Format and beautify JSON data with customizable indentation and sorting options.",
          description: "Our JSON Formatter transforms hard-to-read JSON data into a clean, indented format that's easy to understand and analyze. Whether you're working with minified JSON, API responses, or manually created JSON objects, this tool helps you structure your data with customizable indentation, sorting, and formatting options. Perfect for developers, data analysts, and anyone working with JSON data structures.",
          howToUse: [
            "Enter or paste your JSON data in the input field",
            "Customize formatting options (indentation, sorting, etc.)",
            "Click 'Format JSON' to process your data",
            "View and copy the formatted result",
            "Use 'Minify' option to compress your JSON when needed"
          ],
          features: [
            "Customizable indentation levels (1-8 spaces)",
            "Option to alphabetically sort object keys",
            "Comment removal for cleaning up JSON data",
            "Unicode character escaping",
            "One-click minification for compact JSON",
            "Error detection with detailed messages",
            "Copy to clipboard functionality",
            "Works with large JSON files",
            "Completely browser-based processing for data privacy"
          ],
          faqs: [
            {
              question: "What's the difference between formatting and minifying JSON?",
              answer: "Formatting adds proper indentation and line breaks to make JSON readable for humans, while minifying removes all unnecessary whitespace to minimize file size for efficient storage or transmission."
            },
            {
              question: "Why would I want to sort the keys in my JSON object?",
              answer: "Sorting keys alphabetically makes it easier to find specific properties in large objects, helps with version control by reducing arbitrary changes in key order, and creates a consistent structure when comparing different JSON objects."
            },
            {
              question: "Is there a limit to how much JSON I can format?",
              answer: "The tool is optimized for files up to 1MB in size. Very large or deeply nested JSON structures may experience performance issues depending on your browser and device capabilities."
            },
            {
              question: "What does the 'Remove Comments' option do?",
              answer: "Although comments are not part of the official JSON specification, they're sometimes added during development. This option removes both single-line (//) and multi-line (/* */) comments before parsing, allowing you to work with commented JSON files."
            }
          ]
        };
      case "json-beautifier":
        return {
          title: "JSON Beautifier",
          introduction: "Transform messy JSON into beautifully formatted, readable code.",
          description: "Our JSON Beautifier converts unformatted, minified, or poorly structured JSON data into a clean, properly indented format that's easy to read and understand. With customizable indentation, sorting options, and syntax highlighting, this tool helps you transform compact JSON into a well-organized structure that improves readability and makes debugging easier. Perfect for working with API responses, configuration files, or any JSON data that needs beautification.",
          howToUse: [
            "Enter or paste your JSON data in the input field",
            "Adjust beautification options as needed",
            "Click 'Format JSON' to beautify your code",
            "View the beautified result with proper structure",
            "Copy the formatted JSON to your clipboard"
          ],
          features: [
            "Intelligent formatting with customizable indentation",
            "Optional alphabetical sorting of object keys",
            "Comment handling to clean JSON data",
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
      default:
        return {
          title: "JSON Tools",
          introduction: "Format, beautify, and optimize your JSON data",
          description: "Our suite of JSON tools help developers and data analysts work with JSON data more efficiently. Whether you need to view, format, validate, edit, or convert JSON, our web-based tools provide a simple and powerful interface for all your JSON tasks.",
          howToUse: [
            "Enter or paste your JSON data into the text field",
            "Select the desired operation",
            "Configure any formatting options if needed",
            "Process your JSON and view the results",
            "Copy the processed JSON to your clipboard"
          ],
          features: [
            "Multiple JSON formatting options",
            "Customizable indentation and structure",
            "Key sorting and organization",
            "Comment handling capabilities",
            "Error validation and reporting",
            "Copy to clipboard functionality",
            "Browser-based processing for data privacy",
            "Works with all valid JSON structures"
          ],
          faqs: [
            {
              question: "What is JSON?",
              answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate. It's based on JavaScript object syntax but is language-independent and widely used for storing and exchanging data."
            },
            {
              question: "Is there a limit to how much JSON I can process?",
              answer: "Our tools are optimized for files up to 1MB in size. Larger files may experience performance issues depending on your browser and device capabilities."
            },
            {
              question: "Is my data secure when using these tools?",
              answer: "Yes, all processing is done locally in your browser. Your JSON data never leaves your device and is not stored on our servers."
            },
            {
              question: "What's the difference between formatting and beautifying JSON?",
              answer: "Formatting generally refers to standardizing the structure with consistent indentation and spacing, while beautifying focuses on making the JSON as readable as possible, often with additional options like key sorting and special character handling."
            }
          ]
        };
    }
  };

  const toolContent = getToolContent();

  const renderToolInterface = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output" disabled={!formattedJSON && !error}>Output</TabsTrigger>
              </TabsList>
              
              <TabsContent value="input" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jsonInput">Enter JSON</Label>
                  <Textarea
                    id="jsonInput"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={12}
                    placeholder='{\n  "example": "Paste your JSON here",\n  "items": [1, 2, 3]\n}'
                    className="font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="indentSize">Indentation Size</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="indentSize"
                          type="number"
                          min={0}
                          max={8}
                          value={options.indent}
                          onChange={(e) => handleIndentChange(e.target.value)}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">spaces</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="block mb-1">Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sortKeys"
                            checked={options.sortKeys}
                            onCheckedChange={(checked) => setOptions({ ...options, sortKeys: checked as boolean })}
                          />
                          <Label htmlFor="sortKeys" className="text-sm">Sort object keys alphabetically</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="removeComments"
                            checked={options.removeComments}
                            onCheckedChange={(checked) => setOptions({ ...options, removeComments: checked as boolean })}
                          />
                          <Label htmlFor="removeComments" className="text-sm">Remove comments</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="escapeUnicode"
                            checked={options.escapeUnicode}
                            onCheckedChange={(checked) => setOptions({ ...options, escapeUnicode: checked as boolean })}
                          />
                          <Label htmlFor="escapeUnicode" className="text-sm">Escape Unicode characters</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleFormatJSON} disabled={loading}>
                    {loading ? "Processing..." : "Format JSON"}
                  </Button>
                  <Button variant="outline" onClick={handleMinify}>
                    Minify
                  </Button>
                  <Button variant="outline" onClick={handleClearJSON}>
                    Clear
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="output" className="space-y-4">
                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <code className="text-sm font-mono">{error}</code>
                    </AlertDescription>
                  </Alert>
                ) : (
                  formattedJSON && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Formatted JSON</h3>
                        <Button variant="outline" size="sm" onClick={handleCopyFormatted}>
                          <i className="fas fa-copy mr-2"></i> Copy
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 font-mono text-sm overflow-x-auto bg-gray-50">
                        <pre>{formattedJSON}</pre>
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>Format and beautify JSON data by adding proper indentation and line breaks. Use minify to compress JSON by removing whitespace.</p>
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

export default JSONFormatterDetailed;