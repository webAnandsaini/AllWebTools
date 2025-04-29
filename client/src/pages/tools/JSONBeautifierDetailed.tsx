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
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Checkbox
} from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const JSONBeautifierDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [beautifiedJSON, setBeautifiedJSON] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const beautifyJSON = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to beautify");
      setBeautifiedJSON('');
      return;
    }

    try {
      // Parse the JSON to validate it
      const parsedJSON = JSON.parse(jsonInput);
      
      // Apply sorting if requested
      let processedJSON = parsedJSON;
      if (sortKeys) {
        processedJSON = sortJSONKeys(parsedJSON);
      }
      
      // Format with the specified indentation
      const formatted = JSON.stringify(processedJSON, null, indentSize);
      setBeautifiedJSON(formatted);
      setError(null);
      
      toast({
        title: "Beautification successful",
        description: "JSON has been formatted and beautified"
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      setBeautifiedJSON('');
      
      toast({
        title: "Beautification error",
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

  const minifyJSON = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to minify");
      setBeautifiedJSON('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      
      setBeautifiedJSON(minified);
      setError(null);
      
      toast({
        title: "Minification successful",
        description: "JSON has been minified"
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      setBeautifiedJSON('');
      
      toast({
        title: "Minification error",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  const clearInput = () => {
    setJsonInput('');
    setBeautifiedJSON('');
    setError(null);
  };

  const copyToClipboard = (text: string, type: 'input' | 'output') => {
    if (!text) {
      toast({
        title: "Nothing to copy",
        description: type === 'input' ? "Please enter some JSON first" : "Please beautify JSON first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type === 'input' ? 'Input' : 'Beautified JSON'} copied to clipboard`
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
    const sampleJSON = JSON.stringify(
      {"id":"a001","type":"donut","name":"Cake","ppu":0.55,"batters":{"batter":[{"id":"1001","type":"Regular"},{"id":"1002","type":"Chocolate"},{"id":"1003","type":"Blueberry"},{"id":"1004","type":"Devil's Food"}]},"topping":[{"id":"5001","type":"None"},{"id":"5002","type":"Glazed"},{"id":"5005","type":"Sugar"},{"id":"5007","type":"Powdered Sugar"},{"id":"5006","type":"Chocolate with Sprinkles"},{"id":"5003","type":"Chocolate"},{"id":"5004","type":"Maple"}],"location":{"city":"New York","state":"NY","street":"123 Broadway"},"available":true,"calories":425,"ingredients":["flour","sugar","cocoa powder","baking soda","eggs","butter"],"reviews":[{"user":"user123","rating":4.5,"comment":"Delicious!"},{"user":"baker44","rating":5,"comment":"Perfect texture and flavor."}]}
    );
    
    setJsonInput(sampleJSON);
    setError(null);
    setBeautifiedJSON('');
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="indent-size" className="block mb-2 text-sm font-medium">Indentation Size</Label>
                <Input
                  id="indent-size"
                  type="number"
                  min="0"
                  max="8"
                  value={indentSize}
                  onChange={(e) => setIndentSize(parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sort-keys" 
                  checked={sortKeys}
                  onCheckedChange={(checked) => setSortKeys(checked as boolean)}
                />
                <Label htmlFor="sort-keys" className="text-sm font-medium">Sort Object Keys</Label>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={beautifyJSON} className="flex-1">Beautify JSON</Button>
              <Button variant="outline" onClick={minifyJSON}>Minify JSON</Button>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            
            {beautifiedJSON && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="block text-sm font-medium">Beautified Output</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(beautifiedJSON, 'output')}>
                    Copy Output
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {beautifiedJSON}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON Beautifier</h3>
          <div className="space-y-3 text-sm">
            <p>
              JSON Beautifier transforms messy, minified, or poorly formatted JSON into a clean, readable structure with proper indentation and spacing. This is essential for developers who need to analyze, debug, or work with JSON data regularly.
            </p>
            
            <h4 className="font-medium mt-4">Benefits of Beautifying JSON</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Improved Readability:</span> Clean formatting makes JSON much easier to read and understand</li>
              <li><span className="font-medium">Easier Debugging:</span> Properly formatted JSON makes it easier to spot errors and structural issues</li>
              <li><span className="font-medium">Better Code Reviews:</span> Beautified JSON is much easier to review and discuss with team members</li>
              <li><span className="font-medium">Enhanced Documentation:</span> Clean JSON is essential for clear documentation and tutorials</li>
            </ul>
            
            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2 text-gray-700">Beautiful vs. Minified Example</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium mb-1 text-gray-600">Beautiful JSON:</h5>
                  <pre className="bg-white p-2 rounded text-xs font-mono text-gray-700 overflow-x-auto">
{`{
  "name": "John",
  "age": 30,
  "isActive": true,
  "interests": [
    "coding",
    "hiking",
    "reading"
  ]
}`}
                  </pre>
                </div>
                <div>
                  <h5 className="text-xs font-medium mb-1 text-gray-600">Minified JSON:</h5>
                  <pre className="bg-white p-2 rounded text-xs font-mono text-gray-700 overflow-x-auto">
                    {"{"}"name":"John","age":30,"isActive":true,"interests":["coding","hiking","reading"]{"}"}
                  </pre>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mt-4">When to Use Each Format</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Beautified JSON:</span> Development, debugging, documentation, code reviews</li>
              <li><span className="font-medium">Minified JSON:</span> Production, API responses, reducing bandwidth, improving load times</li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> When comparing or diffing JSON, the "Sort Object Keys" option can be extremely helpful as it ensures consistent property ordering, making differences easier to spot.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-beautifier-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Transform messy, unformatted JSON into clean, readable code with our intuitive JSON Beautifier tool."
          description="Our JSON Beautifier makes working with JSON data a breeze by transforming dense, unformatted code into beautifully structured, readable JSON. With custom indentation options, alphabetical key sorting, and minification capabilities, you can format your JSON exactly the way you need it. Perfect for developers working with API responses, configuration files, or any JSON data that needs to be more readable, our tool instantly validates your JSON and applies consistent formatting for enhanced readability and easier debugging."
          howToUse={[
            "Paste your raw JSON into the input area or click 'Load Sample' for an example",
            "Set your preferred indentation size (0-8 spaces)",
            "Optionally enable 'Sort Object Keys' to organize properties alphabetically",
            "Click 'Beautify JSON' to transform your data with proper formatting",
            "For compact format, click 'Minify JSON' to remove all whitespace",
            "Copy the beautified or minified output with one click",
            "If your JSON has syntax errors, you'll receive helpful error messages"
          ]}
          features={[
            "Custom indentation settings for personalized formatting",
            "Alphabetical key sorting for consistent property ordering",
            "One-click minification for compact, production-ready JSON",
            "Syntax error detection with clear error messages",
            "Sample JSON loading for quick testing",
            "Direct copy to clipboard functionality for both input and output",
            "Support for large, complex JSON structures"
          ]}
          faqs={[
            {
              question: "What's the difference between JSON beautifying and formatting?",
              answer: "The terms are often used interchangeably. Beautifying typically refers to making JSON more readable with indentation, line breaks, and spacing, while formatting might include additional operations like sorting keys. Our tool does both - it beautifies JSON for readability and provides formatting options like key sorting."
            },
            {
              question: "Why would I want to sort object keys alphabetically?",
              answer: "Sorting keys alphabetically creates a consistent, predictable order that makes it easier to compare different JSON objects, locate specific properties, and track changes. It's particularly useful when diffing JSON files or creating documentation, as the same properties will always appear in the same order."
            },
            {
              question: "When should I use minified JSON instead of beautified?",
              answer: "Minified JSON (with all whitespace removed) is ideal for production environments where file size matters - like API responses, data storage, or web performance optimization. It reduces bandwidth usage and parsing time. Beautified JSON, on the other hand, is better for development, debugging, and any scenario where humans need to read and understand the data."
            },
            {
              question: "Does beautifying change my actual JSON data?",
              answer: "No. Beautifying only changes the formatting (whitespace, indentation, and potentially the order of keys if sorting is enabled). The data values and structure remain exactly the same. The semantic content of your JSON is preserved."
            },
            {
              question: "What if my JSON has syntax errors?",
              answer: "Our beautifier first validates your JSON to ensure it's syntactically correct. If errors are found, the tool will display specific error messages to help you identify and fix the issues. Common errors include missing quotes around property names, trailing commas, or unbalanced brackets and braces."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONBeautifierDetailed;