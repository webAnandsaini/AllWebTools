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

const JSONEditorDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [currentJson, setCurrentJson] = useState<any>(null);
  const [editPath, setEditPath] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");
  const [editMode, setEditMode] = useState<"add" | "update" | "delete">("update");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prettifyIndent, setPrettifyIndent] = useState<number>(2);
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleParseJSON = () => {
    setError(null);

    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to edit",
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
      
      const parsedJSON = JSON.parse(cleanedInput);
      setCurrentJson(parsedJSON);
      setJsonInput(JSON.stringify(parsedJSON, null, prettifyIndent));
      
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

  const handleApplyEdit = () => {
    if (!currentJson) {
      toast({
        title: "Error",
        description: "Please parse valid JSON first",
        variant: "destructive",
      });
      return;
    }

    if (!editPath.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid JSON path",
        variant: "destructive",
      });
      return;
    }

    try {
      // Split the path into segments (handle both dot notation and bracket notation)
      const pathSegments = editPath.match(/[^.[\]]+/g) || [];
      
      if (pathSegments.length === 0) {
        throw new Error("Invalid path format");
      }

      // Make a deep copy of the current JSON
      const updatedJson = JSON.parse(JSON.stringify(currentJson));
      
      if (editMode === "delete") {
        deleteByPath(updatedJson, pathSegments);
      } else if (editMode === "add" || editMode === "update") {
        // Parse the edit value based on its type
        let parsedValue;
        try {
          // Try to parse as JSON first (for objects, arrays, numbers, booleans, null)
          parsedValue = JSON.parse(editValue);
        } catch (e) {
          // If parsing fails, treat it as a string
          parsedValue = editValue;
        }
        
        setByPath(updatedJson, pathSegments, parsedValue, editMode === "add");
      }
      
      // Update the current JSON and the text in the editor
      setCurrentJson(updatedJson);
      setJsonInput(JSON.stringify(updatedJson, null, prettifyIndent));
      
      toast({
        title: "Success",
        description: `JSON ${editMode === "add" ? "updated with new property" : editMode === "update" ? "property updated" : "property deleted"}`,
      });
      
      // Clear the edit fields
      setEditPath("");
      setEditValue("");
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Helper function to set a value at a specific path in the object
  const setByPath = (obj: any, path: string[], value: any, isAdd: boolean) => {
    const lastKey = path.pop();
    if (!lastKey) return;
    
    // Navigate to the containing object
    const container = path.reduce((o, key) => {
      // Create a path if it doesn't exist
      if (o[key] === undefined) {
        o[key] = isNaN(parseInt(path[path.indexOf(key) + 1] || '')) ? {} : [];
      }
      return o[key];
    }, obj);
    
    // Check if we're trying to add a new property but it already exists
    if (isAdd && container[lastKey] !== undefined) {
      throw new Error(`Property '${lastKey}' already exists at the specified path`);
    }
    
    // Check if we're trying to update a property but it doesn't exist
    if (!isAdd && container[lastKey] === undefined) {
      throw new Error(`Property '${lastKey}' doesn't exist at the specified path`);
    }
    
    // Set the value
    container[lastKey] = value;
  };

  // Helper function to delete a property at a specific path in the object
  const deleteByPath = (obj: any, path: string[]) => {
    const lastKey = path.pop();
    if (!lastKey) return;
    
    // Navigate to the containing object
    const container = path.reduce((o, key) => {
      if (o[key] === undefined) {
        throw new Error(`Path '${path.join('.')}' not found in the JSON`);
      }
      return o[key];
    }, obj);
    
    // Check if the property exists
    if (container[lastKey] === undefined) {
      throw new Error(`Property '${lastKey}' doesn't exist at the specified path`);
    }
    
    // Delete the property
    if (Array.isArray(container)) {
      container.splice(parseInt(lastKey), 1);
    } else {
      delete container[lastKey];
    }
  };

  const handleClearJSON = () => {
    setJsonInput("");
    setCurrentJson(null);
    setError(null);
    setEditPath("");
    setEditValue("");
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
      // Clean comments to handle commented JSON
      const cleanedInput = jsonInput
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
      
      const parsedJSON = JSON.parse(cleanedInput);
      const prettified = JSON.stringify(parsedJSON, null, prettifyIndent);
      setJsonInput(prettified);
      setCurrentJson(parsedJSON);
      
      toast({
        title: "Success",
        description: "JSON prettified",
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
      setJsonInput(minified);
      setCurrentJson(parsedJSON);
      
      toast({
        title: "Success",
        description: "JSON minified",
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
      title: "JSON Editor",
      introduction: "Edit, modify, and transform JSON data with precision and ease.",
      description: "Our interactive JSON Editor allows you to make targeted changes to your JSON data without manually editing the raw text. Add, update, or delete specific properties using JSON path notation, all with real-time validation to prevent syntax errors. Whether you're working with API responses, configuration files, or data templates, this tool provides a safe, structured way to make precise modifications to complex JSON structures.",
      howToUse: [
        "Enter or paste your JSON data in the editor",
        "Click 'Parse JSON' to validate and prepare for editing",
        "Specify the path to the property you want to modify (e.g., 'user.address.city')",
        "Enter the new value or select 'Delete' to remove a property",
        "Click 'Apply Changes' to update your JSON",
        "Copy the modified JSON when you're finished"
      ],
      features: [
        "Add, update, or delete JSON properties using path notation",
        "Path autocompletion for easier navigation (coming soon)",
        "Real-time validation to prevent syntax errors",
        "Automatic type detection for entered values",
        "Pretty print and minify options",
        "Support for complex nested structures",
        "Customizable indentation settings",
        "Consistent formatting of output",
        "Full support for all JSON data types"
      ],
      faqs: [
        {
          question: "How do I specify the path to a property?",
          answer: "Use dot notation for object properties (e.g., 'user.name') and bracket notation with indexes for arrays (e.g., 'users[0].name'). You can combine them for complex paths like 'users[2].addresses[0].city'."
        },
        {
          question: "What happens if I try to modify a property that doesn't exist?",
          answer: "When updating a property, the tool will show an error if the path doesn't exist. When adding a property, parent objects will be created automatically if they don't exist (e.g., adding 'user.address.zip' will create the 'address' object if it doesn't exist)."
        },
        {
          question: "How are different data types handled?",
          answer: "The tool automatically detects the data type based on your input. Numbers, booleans, null, arrays, and objects are recognized when properly formatted (e.g., '42', 'true', 'null', '[1,2,3]', '{\"key\":\"value\"}'), otherwise the value is treated as a string."
        },
        {
          question: "Is there a limit to how complex the JSON can be?",
          answer: "The tool is designed to handle complex nested JSON structures, but extremely large files (>1MB) may experience performance issues depending on your browser and device capabilities."
        }
      ]
    };
  };

  const toolContent = getToolContent();

  const renderToolInterface = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Button variant="outline" onClick={handlePrettify}>
                    Prettify
                  </Button>
                  <Button variant="outline" onClick={handleMinify}>
                    Minify
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="prettifyIndent" className="text-sm">Indent:</Label>
                  <Input
                    id="prettifyIndent"
                    type="number"
                    className="w-16"
                    min={1}
                    max={8}
                    value={prettifyIndent}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 8) {
                        setPrettifyIndent(value);
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jsonInput">JSON Editor</Label>
                <Textarea
                  id="jsonInput"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{\n  "example": "Paste your JSON here",\n  "items": [1, 2, 3],\n  "user": {\n    "name": "John",\n    "email": "john@example.com"\n  }\n}'
                  className="font-mono min-h-[300px]"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleParseJSON} disabled={loading}>
                  {loading ? "Parsing..." : "Parse JSON"}
                </Button>
                <Button variant="outline" onClick={handleCopyJSON}>
                  Copy
                </Button>
                <Button variant="outline" onClick={handleClearJSON}>
                  Clear
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <code className="text-sm font-mono">{error}</code>
                  </AlertDescription>
                </Alert>
              )}
              
              {currentJson && (
                <Card className="mt-4">
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Edit JSON</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="editPath">Property Path</Label>
                        <Input
                          id="editPath"
                          value={editPath}
                          onChange={(e) => setEditPath(e.target.value)}
                          placeholder="e.g., user.name or items[0]"
                        />
                        <p className="text-xs text-gray-500">
                          Use dot notation for object properties (user.name) and bracket notation for arrays (items[0])
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={editMode === "add" ? "default" : "outline"}
                          onClick={() => setEditMode("add")}
                          className="w-full"
                        >
                          Add
                        </Button>
                        <Button
                          variant={editMode === "update" ? "default" : "outline"}
                          onClick={() => setEditMode("update")}
                          className="w-full"
                        >
                          Update
                        </Button>
                        <Button
                          variant={editMode === "delete" ? "default" : "outline"}
                          onClick={() => setEditMode("delete")}
                          className="w-full"
                        >
                          Delete
                        </Button>
                      </div>
                      
                      {editMode !== "delete" && (
                        <div className="space-y-2">
                          <Label htmlFor="editValue">Value</Label>
                          <Textarea
                            id="editValue"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder={`"New value" or 42 or true or {"key": "value"}`}
                            className="font-mono h-20"
                          />
                          <p className="text-xs text-gray-500">
                            For objects or arrays, use valid JSON syntax: {"{"}"key": "value"{"}"}
                          </p>
                        </div>
                      )}
                      
                      <Button onClick={handleApplyEdit}>
                        Apply Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>Use this editor to make precise modifications to your JSON data. Navigate through complex structures using JSON path notation and apply changes with confidence knowing real-time validation will prevent syntax errors.</p>
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

export default JSONEditorDetailed;