import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Checkbox
} from "@/components/ui/checkbox";
import {
  Label
} from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const JSONFormatterDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [formattedJSON, setFormattedJSON] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const formatJSON = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to format");
      setFormattedJSON('');
      return;
    }

    try {
      // Parse the JSON to validate it
      const parsedJSON = JSON.parse(jsonInput);
      
      // Format the JSON with specified options
      let formatted: string;
      
      if (sortKeys) {
        // Create a sorted version of the JSON object
        const sortedJSON = sortJSONKeys(parsedJSON);
        formatted = JSON.stringify(sortedJSON, null, indentSize);
      } else {
        formatted = JSON.stringify(parsedJSON, null, indentSize);
      }
      
      setFormattedJSON(formatted);
      setError(null);
      
      toast({
        title: "Formatting successful",
        description: "JSON has been formatted and prettified"
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      setFormattedJSON('');
      
      toast({
        title: "Formatting error",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  // Helper function to recursively sort keys in an object
  const sortJSONKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sortJSONKeys);
    }
    
    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, any>, key) => {
        result[key] = sortJSONKeys(obj[key]);
        return result;
      }, {});
  };

  const clearInput = () => {
    setJsonInput('');
    setFormattedJSON('');
    setError(null);
  };

  const copyToClipboard = (text: string, type: 'input' | 'output') => {
    if (!text) {
      toast({
        title: "Nothing to copy",
        description: type === 'input' ? "Please enter some JSON first" : "Please format JSON first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type === 'input' ? 'Input' : 'Formatted JSON'} copied to clipboard`
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    });
  };

  const loadSampleJSON = () => {
    const sampleJSON = JSON.stringify({
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "isActive": true,
      "roles": ["admin", "user"],
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipcode": "12345"
      },
      "preferences": {
        "theme": "dark",
        "notifications": {
          "email": true,
          "push": false,
          "sms": true
        }
      },
      "lastLogin": "2023-07-15T10:30:45Z"
    });
    
    setJsonInput(sampleJSON);
    setError(null);
    setFormattedJSON('');
  };

  const minifyJSON = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to minify");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      
      setFormattedJSON(minified);
      setError(null);
      
      toast({
        title: "Minification successful",
        description: "JSON has been minified"
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      setFormattedJSON('');
      
      toast({
        title: "Minification error",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between mb-2">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                  Load Sample
                </Button>
                <Button variant="outline" size="sm" onClick={clearInput}>
                  Clear
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(jsonInput, 'input')}>
                Copy Input
              </Button>
            </div>
            
            <div>
              <Label className="block mb-2 text-sm font-medium">Input JSON</Label>
              <textarea
                className="w-full h-60 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Enter your JSON here...'
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <Label htmlFor="indent-size" className="block mb-2 text-sm font-medium">Indentation</Label>
                <Select 
                  value={indentSize.toString()} 
                  onValueChange={(val) => setIndentSize(parseInt(val))}
                >
                  <SelectTrigger id="indent-size" className="w-32">
                    <SelectValue placeholder="Indent Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Spaces</SelectItem>
                    <SelectItem value="4">4 Spaces</SelectItem>
                    <SelectItem value="6">6 Spaces</SelectItem>
                    <SelectItem value="8">8 Spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sort-keys" 
                  checked={sortKeys}
                  onCheckedChange={(checked) => setSortKeys(checked as boolean)}
                />
                <Label htmlFor="sort-keys" className="text-sm font-medium">Sort Object Keys</Label>
              </div>
              
              <div className="ml-auto space-x-2">
                <Button onClick={formatJSON}>Format & Prettify</Button>
                <Button variant="outline" onClick={minifyJSON}>Minify</Button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            
            {formattedJSON && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="block text-sm font-medium">Formatted Output</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(formattedJSON, 'output')}>
                    Copy Output
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {formattedJSON}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON Formatter</h3>
          <div className="space-y-3 text-sm">
            <p>
              JSON (JavaScript Object Notation) is a lightweight data interchange format that's widely used for API responses, configuration files, and data exchange between web applications. Our JSON Formatter tool helps you transform dense, unformatted JSON into a clean, readable format or compact minified JSON for production use.
            </p>
            
            <h4 className="font-medium mt-4">Why Format JSON?</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Improved Readability:</span> Properly formatted JSON with consistent indentation makes code easier to read and understand</li>
              <li><span className="font-medium">Error Detection:</span> Formatting can help identify JSON syntax errors that might be hard to spot in minified code</li>
              <li><span className="font-medium">Debugging:</span> Properly formatted JSON is easier to debug when developing applications</li>
              <li><span className="font-medium">Documentation:</span> Well-formatted JSON is better for documentation and knowledge sharing</li>
            </ul>
            
            <h4 className="font-medium mt-4">Why Minify JSON?</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Reduced File Size:</span> Removing whitespace and formatting reduces the file size</li>
              <li><span className="font-medium">Faster Transmission:</span> Smaller files load faster and use less bandwidth</li>
              <li><span className="font-medium">Performance:</span> In high-volume applications, minified JSON can improve performance</li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> When developing, use formatted JSON for readability. For production environments or API responses, consider using minified JSON to improve performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-formatter-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Transform messy JSON into clean, readable code with our powerful JSON Formatter tool."
          description="Our JSON Formatter takes raw, unformatted JSON data and transforms it into well-structured, readable code with customizable indentation and formatting options. Whether you need to beautify compact JSON for development, minify it for production, or sort object keys for consistency, our tool makes it easy to work with JSON data of any complexity. With instant validation to catch syntax errors and one-click copying, you can streamline your workflow when working with JSON files, API responses, or configuration data."
          howToUse={[
            "Paste your unformatted JSON into the input area or click 'Load Sample' for an example",
            "Select your preferred indentation size (2, 4, 6, or 8 spaces)",
            "Choose whether to sort object keys alphabetically",
            "Click 'Format & Prettify' to beautify your JSON with proper indentation",
            "Alternatively, click 'Minify' to create compact, whitespace-free JSON",
            "Copy the formatted result to your clipboard with one click",
            "If any syntax errors exist in your JSON, you'll see detailed error messages"
          ]}
          features={[
            "Custom indentation options (2, 4, 6, or 8 spaces)",
            "Alphabetical key sorting for consistent output",
            "One-click JSON minification for production use",
            "Real-time syntax validation with error reporting",
            "Easy copy-to-clipboard functionality for both input and output",
            "Sample JSON loading for quick testing",
            "Support for complex nested objects and arrays"
          ]}
          faqs={[
            {
              question: "What's the difference between formatting and minifying JSON?",
              answer: "Formatting JSON adds proper indentation, line breaks, and spacing to make the code human-readable. Minifying does the opposite - it removes all unnecessary whitespace and formatting to create the smallest possible file size, which is useful for production environments where every byte counts."
            },
            {
              question: "Why would I want to sort object keys in my JSON?",
              answer: "Sorting keys alphabetically creates consistent output that's easier to compare across different versions of the same data. It's particularly useful when diffing JSON files or when you want a predictable order for documentation or testing purposes."
            },
            {
              question: "Does this tool modify my actual JSON data?",
              answer: "No. The formatter preserves all your actual data values and structure. It only changes the formatting (whitespace, indentation, and potentially the order of keys if sorting is enabled). The semantic content of your JSON remains exactly the same."
            },
            {
              question: "Is there a size limit for the JSON I can format?",
              answer: "While our tool can handle most common JSON sizes, very large files (several MB) might affect browser performance since all processing happens in your browser. For extremely large JSON files, consider using a desktop application or command-line tool."
            },
            {
              question: "Is my JSON data secure when using this formatter?",
              answer: "Yes. All formatting happens entirely in your browser - your JSON data never leaves your device or gets transmitted to any server. We don't store or log any information you enter into the tool."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONFormatterDetailed;