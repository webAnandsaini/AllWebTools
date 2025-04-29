import React, { useState, useEffect } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const JSONViewerDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [parsedJSON, setParsedJSON] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");

  const { toast } = useToast();

  useEffect(() => {
    if (jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput);
        setParsedJSON(parsed);
        setError(null);
      } catch (err) {
        setError("Invalid JSON format");
        setParsedJSON(null);
      }
    } else {
      setParsedJSON(null);
      setError(null);
    }
  }, [jsonInput]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const clearInput = () => {
    setJsonInput('');
    setParsedJSON(null);
    setError(null);
  };

  const copyToClipboard = () => {
    if (!jsonInput) {
      toast({
        title: "Nothing to copy",
        description: "Please enter some JSON first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(jsonInput).then(() => {
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard"
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
      "name": "John Doe",
      "age": 30,
      "isActive": true,
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345"
      },
      "phoneNumbers": [
        {
          "type": "home",
          "number": "555-1234"
        },
        {
          "type": "work",
          "number": "555-5678"
        }
      ],
      "skills": ["JavaScript", "React", "Node.js"]
    }, null, 2);
    
    setJsonInput(sampleJSON);
  };

  const toggleSection = (path: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Helper function to render JSON tree view
  const renderJSONTree = (data: any, path = 'root', level = 0) => {
    if (data === null) return <span className="text-gray-400 italic">null</span>;
    
    if (typeof data !== 'object') {
      // Render primitive values
      if (typeof data === 'string') return <span className="text-green-600">"{data}"</span>;
      if (typeof data === 'number') return <span className="text-blue-600">{data}</span>;
      if (typeof data === 'boolean') return <span className="text-purple-600">{data.toString()}</span>;
      return <span>{String(data)}</span>;
    }

    if (Array.isArray(data)) {
      // Render arrays
      const isExpanded = expandedSections[path] !== false; // Default to expanded
      
      return (
        <div className="ml-4">
          <div className="flex items-center">
            <span 
              className="cursor-pointer mr-1 text-gray-600 inline-block w-4"
              onClick={() => toggleSection(path)}
            >
              {isExpanded ? '▼' : '►'}
            </span>
            <span className="text-gray-700">[</span>
            {!isExpanded && <span className="text-gray-400 ml-1">Array({data.length})</span>}
          </div>
          
          {isExpanded && data.map((item, index) => (
            <div key={`${path}-${index}`} className="ml-4 flex">
              <span className="text-gray-500 mr-2">{index}:</span>
              <div className="flex-1">{renderJSONTree(item, `${path}-${index}`, level + 1)}</div>
              {index < data.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          
          <div className={isExpanded ? "ml-4" : ""}>
            <span className="text-gray-700">]</span>
          </div>
        </div>
      );
    } else {
      // Render objects
      const keys = Object.keys(data);
      const isExpanded = expandedSections[path] !== false; // Default to expanded
      
      return (
        <div className="ml-4">
          <div className="flex items-center">
            <span 
              className="cursor-pointer mr-1 text-gray-600 inline-block w-4"
              onClick={() => toggleSection(path)}
            >
              {isExpanded ? '▼' : '►'}
            </span>
            <span className="text-gray-700">{"{"}</span>
            {!isExpanded && <span className="text-gray-400 ml-1">Object({keys.length})</span>}
          </div>
          
          {isExpanded && keys.map((key, index) => (
            <div key={`${path}-${key}`} className="ml-4 flex">
              <span className="text-red-500 mr-2">"{key}":</span>
              <div className="flex-1">{renderJSONTree(data[key], `${path}-${key}`, level + 1)}</div>
              {index < keys.length - 1 && <span className="text-gray-700">,</span>}
            </div>
          ))}
          
          <div className={isExpanded ? "ml-4" : ""}>
            <span className="text-gray-700">{"}"}</span>
          </div>
        </div>
      );
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">JSON Input</TabsTrigger>
              <TabsTrigger value="viewer" disabled={!parsedJSON && !error}>Viewer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="pt-4 space-y-4">
              <div className="flex justify-between mb-2">
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                    Load Sample
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearInput}>
                    Clear
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
              
              <textarea
                className="w-full h-80 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                value={jsonInput}
                onChange={handleInputChange}
                placeholder='Enter your JSON here...'
              />
              
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              {parsedJSON && !error && (
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("viewer")}>
                    View as Tree
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="viewer" className="pt-4">
              {parsedJSON && (
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px] font-mono text-sm">
                  {renderJSONTree(parsedJSON)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON Viewer</h3>
          <div className="space-y-3 text-sm">
            <p>
              JSON (JavaScript Object Notation) is a lightweight data interchange format that's easy for humans to read and write, and easy for machines to parse and generate. Our JSON Viewer tool helps you visualize and navigate complex JSON structures with ease.
            </p>
            <h4 className="font-medium mt-4">Key Features:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collapsible tree view for easy navigation</li>
              <li>Syntax highlighting to distinguish different data types</li>
              <li>Error detection to identify invalid JSON</li>
              <li>Simple interface for copying and clearing JSON data</li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> Use the JSON Viewer to inspect API responses, debug configurations, or analyze data structures. The collapsible tree view makes it especially useful for navigating large, nested JSON objects.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-viewer-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Visualize and navigate complex JSON structures with our interactive JSON Viewer tool."
          description="Our JSON Viewer transforms raw JSON data into an interactive, collapsible tree view, making it easy to explore and understand complex data structures. With color-coded syntax highlighting for different data types, expandable/collapsible sections for nested objects and arrays, and instant error detection for invalid JSON, you can quickly make sense of even the most complex JSON files. Perfect for developers working with APIs, configuration files, or any JSON-formatted data."
          howToUse={[
            "Paste your JSON data into the text area or click 'Load Sample' for an example",
            "Your JSON will be automatically validated as you type",
            "Click 'View as Tree' to see the interactive tree view representation",
            "Expand or collapse nested objects and arrays by clicking the arrow icons",
            "Navigate through even deeply nested structures with ease",
            "Copy your JSON to clipboard with one click",
            "Clear the input when you're done to start fresh"
          ]}
          features={[
            "Interactive tree view visualization with expandable/collapsible sections",
            "Color-coded syntax highlighting for different data types",
            "Real-time JSON validation with error messages",
            "Ability to navigate complex nested structures",
            "One-click copy to clipboard functionality",
            "Sample JSON loader for quick testing",
            "Clean, intuitive interface designed for developers"
          ]}
          faqs={[
            {
              question: "What is JSON and why would I need a JSON viewer?",
              answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format widely used for API responses, configuration files, and data storage. A JSON viewer helps you visualize and navigate complex JSON structures that would be difficult to read in their raw text form, especially when dealing with deeply nested objects or large arrays."
            },
            {
              question: "How do I know if my JSON is valid?",
              answer: "Our JSON Viewer automatically validates your JSON as you type. If there's an error in your JSON syntax, you'll see an error message below the input area, helping you identify and fix formatting issues quickly."
            },
            {
              question: "Can I edit JSON in the viewer?",
              answer: "This tool is primarily for viewing and navigating JSON. For editing functionality, check out our JSON Editor tool, which provides a more comprehensive environment for modifying JSON data with syntax highlighting and validation."
            },
            {
              question: "Is my JSON data secure when using this tool?",
              answer: "Yes. All processing happens entirely in your browser - your JSON data never leaves your device or gets transmitted to any server. We don't store or log any information you enter into the tool."
            },
            {
              question: "How does the tree view help with large JSON files?",
              answer: "The tree view transforms nested JSON structures into collapsible sections, allowing you to focus on specific parts of your data without getting overwhelmed. You can expand only the sections you need to examine, making it much easier to navigate large or complex JSON objects."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONViewerDetailed;