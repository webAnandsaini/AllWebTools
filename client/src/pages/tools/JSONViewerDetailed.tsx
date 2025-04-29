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

const JSONViewerDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"tree" | "raw">("tree");
  const [expandLevel, setExpandLevel] = useState<number>(1);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [showDataTypes, setShowDataTypes] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleProcessJSON = () => {
    setError(null);
    setJsonResult(null);

    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to process",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const parsedJSON = JSON.parse(jsonInput);
      setJsonResult(parsedJSON);
      setError(null);
      
      toast({
        title: "Success",
        description: "JSON parsed successfully",
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

  const handleClearJSON = () => {
    setJsonInput("");
    setJsonResult(null);
    setError(null);
  };

  const handlePrettify = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to prettify",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedJSON = JSON.parse(jsonInput);
      const prettified = JSON.stringify(parsedJSON, null, 2);
      setJsonInput(prettified);
      setJsonResult(parsedJSON);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: err.message,
        variant: "destructive",
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
      const parsedJSON = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsedJSON);
      setJsonInput(minified);
      setJsonResult(parsedJSON);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Invalid JSON",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCopyJSON = () => {
    if (jsonInput) {
      navigator.clipboard.writeText(jsonInput);
      toast({
        title: "Copied",
        description: "JSON copied to clipboard",
      });
    }
  };

  const renderJSONTree = (obj: any, level = 0) => {
    if (level > expandLevel && expandLevel > 0) {
      return (
        <div className="ml-4 cursor-pointer text-blue-500 hover:underline" onClick={() => setExpandLevel(expandLevel + 2)}>
          ... (click to expand more)
        </div>
      );
    }

    if (obj === null) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof obj === "undefined") {
      return <span className="text-gray-500">undefined</span>;
    }

    if (typeof obj === "string") {
      return <span className="text-green-600">"{obj}"</span>;
    }

    if (typeof obj === "number") {
      return <span className="text-blue-600">{obj}</span>;
    }

    if (typeof obj === "boolean") {
      return <span className="text-purple-600">{obj.toString()}</span>;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return <span className="text-gray-700">[ ]</span>;
      }

      return (
        <div>
          <span className="text-gray-700">[</span>
          <div className="ml-4">
            {obj.map((item, index) => (
              <div key={index} className="mb-1">
                {showLineNumbers && <span className="text-xs text-gray-400 mr-2">{index + 1}</span>}
                {renderJSONTree(item, level + 1)}
                {index < obj.length - 1 && <span className="text-gray-700">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-700">]</span>
        </div>
      );
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      
      if (keys.length === 0) {
        return <span className="text-gray-700">{ }</span>;
      }

      // Apply filter if provided
      const filteredKeys = filter 
        ? keys.filter(key => key.toLowerCase().includes(filter.toLowerCase()) || 
                             JSON.stringify(obj[key]).toLowerCase().includes(filter.toLowerCase()))
        : keys;

      return (
        <div>
          <span className="text-gray-700">{'{'}</span>
          <div className="ml-4">
            {filteredKeys.map((key, index) => (
              <div key={key} className="mb-1">
                {showLineNumbers && <span className="text-xs text-gray-400 mr-2">{index + 1}</span>}
                <span className="text-red-500">"{key}"</span>
                <span className="text-gray-700">: </span>
                {renderJSONTree(obj[key], level + 1)}
                {showDataTypes && (
                  <span className="text-xs text-gray-400 ml-2">
                    ({Array.isArray(obj[key]) ? "array" : typeof obj[key]})
                  </span>
                )}
                {index < filteredKeys.length - 1 && <span className="text-gray-700">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-700">{'}'}</span>
        </div>
      );
    }

    return null;
  };

  const getToolContent = () => {
    switch (toolSlug) {
      case "json-viewer":
        return {
          title: "JSON Viewer",
          introduction: "View and explore JSON data with syntax highlighting and tree view.",
          description: "Our JSON Viewer provides a clean, interactive interface for exploring and analyzing JSON data. Easily navigate through complex JSON structures, expand/collapse nested objects, search for specific keys or values, and visualize your data in a structured tree format. Perfect for developers, data analysts, or anyone working with JSON data who needs to quickly understand and explore JSON structure.",
          howToUse: [
            "Enter or paste your JSON data in the input field",
            "Click 'Process JSON' to validate and view it",
            "Use the tree view to explore nested objects and arrays",
            "Adjust display settings to customize the view",
            "Search for specific keys or values using the filter"
          ],
          features: [
            "Interactive tree view for exploring complex JSON structures",
            "Syntax highlighting for improved readability",
            "Expand/collapse controls for nested objects",
            "Search/filter functionality to find specific data",
            "Line numbers and data type indicators",
            "Raw and tree view modes",
            "Error detection and validation",
            "Copy formatted JSON to clipboard",
            "Prettify and minify options"
          ],
          faqs: [
            {
              question: "What is the maximum size of JSON that can be processed?",
              answer: "Our JSON Viewer is optimized for files up to 1MB in size. Larger files may experience performance issues, especially with deeply nested structures."
            },
            {
              question: "Is my JSON data secure when using this tool?",
              answer: "Yes, all processing is done locally in your browser. Your JSON data never leaves your device and is not stored on any servers."
            },
            {
              question: "Can I use this tool to validate my JSON?",
              answer: "Yes, the tool automatically validates your JSON when you process it and provides detailed error messages if the JSON is invalid."
            },
            {
              question: "How can I navigate large JSON structures?",
              answer: "You can use the expand/collapse controls to focus on specific parts of your JSON, adjust the expansion level, and use the search filter to find specific keys or values."
            }
          ]
        };
      default:
        return {
          title: "JSON Tools",
          introduction: "Free online tools for working with JSON data",
          description: "Our suite of JSON tools help developers and data analysts work with JSON data more efficiently. Whether you need to view, format, validate, edit, or convert JSON, our web-based tools provide a simple and powerful interface for all your JSON tasks.",
          howToUse: [
            "Enter or paste your JSON data into the text field",
            "Select the desired operation",
            "Click the appropriate button to process your JSON",
            "View the results and download or copy as needed"
          ],
          features: [
            "Multiple JSON tools in one convenient interface",
            "Syntax highlighting for improved readability",
            "Error detection and validation",
            "Copy and download options",
            "Browser-based processing (your data stays private)",
            "Support for large JSON files",
            "Interactive tree view for complex structures",
            "Search and filter functionality"
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
              question: "Can I use these tools offline?",
              answer: "Currently, these tools require an internet connection to load. However, once loaded, the actual JSON processing happens locally in your browser."
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
            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="output" disabled={!jsonResult && !error}>Output</TabsTrigger>
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
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleProcessJSON} disabled={loading}>
                    {loading ? "Processing..." : "Process JSON"}
                  </Button>
                  <Button variant="outline" onClick={handlePrettify}>
                    Prettify
                  </Button>
                  <Button variant="outline" onClick={handleMinify}>
                    Minify
                  </Button>
                  <Button variant="outline" onClick={handleCopyJSON}>
                    Copy
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
                  jsonResult && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <Label htmlFor="displayMode">Display Mode</Label>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant={displayMode === "tree" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setDisplayMode("tree")}
                            >
                              Tree View
                            </Button>
                            <Button 
                              variant={displayMode === "raw" ? "default" : "outline"} 
                              size="sm"
                              onClick={() => setDisplayMode("raw")}
                            >
                              Raw View
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-x-3 flex items-center">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showLineNumbers"
                              checked={showLineNumbers}
                              onCheckedChange={(checked) => setShowLineNumbers(checked as boolean)}
                            />
                            <Label htmlFor="showLineNumbers" className="text-sm">Line Numbers</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="showDataTypes"
                              checked={showDataTypes}
                              onCheckedChange={(checked) => setShowDataTypes(checked as boolean)}
                            />
                            <Label htmlFor="showDataTypes" className="text-sm">Data Types</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="jsonFilter">Filter</Label>
                        <Input
                          id="jsonFilter"
                          placeholder="Filter by key or value..."
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expandLevel">Expansion Level: {expandLevel === 0 ? 'All' : expandLevel}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="expandLevel"
                            type="range"
                            min="0"
                            max="10"
                            value={expandLevel}
                            onChange={(e) => setExpandLevel(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-500 w-16">{expandLevel === 0 ? 'All' : expandLevel}</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 font-mono text-sm overflow-x-auto bg-gray-50">
                        {displayMode === "tree" ? (
                          <div className="json-tree">{renderJSONTree(jsonResult)}</div>
                        ) : (
                          <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>Enter valid JSON to visualize its structure. The tool supports tree view with collapsible nodes and syntax highlighting.</p>
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

export default JSONViewerDetailed;