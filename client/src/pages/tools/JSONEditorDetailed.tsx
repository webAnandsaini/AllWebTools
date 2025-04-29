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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const JSONEditorDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonParsed, setJsonParsed] = useState<any>(null);
  const [editPath, setEditPath] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editValueType, setEditValueType] = useState<string>('string');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [jsonPaths, setJsonPaths] = useState<string[]>([]);

  const { toast } = useToast();

  // Parse JSON input and extract paths when input changes
  useEffect(() => {
    if (jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput);
        setJsonParsed(parsed);
        setErrorMsg(null);
        
        // Generate paths for the JSON object
        const paths = getAllPaths(parsed);
        setJsonPaths(paths);
      } catch (err: any) {
        setErrorMsg(err.message || "Invalid JSON format");
        setJsonParsed(null);
        setJsonPaths([]);
      }
    } else {
      setJsonParsed(null);
      setErrorMsg(null);
      setJsonPaths([]);
    }
  }, [jsonInput]);

  // Helper function to get all paths in a JSON object
  const getAllPaths = (obj: any, parentPath: string = '', result: string[] = []): string[] => {
    if (obj === null || typeof obj !== 'object') {
      if (parentPath) result.push(parentPath);
      return result;
    }
    
    if (Array.isArray(obj)) {
      if (parentPath) result.push(parentPath);
      
      obj.forEach((item, index) => {
        const newPath = parentPath ? `${parentPath}[${index}]` : `[${index}]`;
        getAllPaths(item, newPath, result);
      });
    } else {
      if (parentPath) result.push(parentPath);
      
      Object.keys(obj).forEach(key => {
        const newPath = parentPath ? `${parentPath}.${key}` : key;
        getAllPaths(obj[key], newPath, result);
      });
    }
    
    return result;
  };

  // Convert a path string to an array of segments
  const parseJsonPath = (path: string): (string | number)[] => {
    if (!path) return [];
    
    const segments: (string | number)[] = [];
    let currentSegment = '';
    let inBracket = false;
    
    for (let i = 0; i < path.length; i++) {
      const char = path[i];
      
      if (char === '.' && !inBracket) {
        if (currentSegment) {
          segments.push(currentSegment);
          currentSegment = '';
        }
      } else if (char === '[') {
        if (currentSegment) {
          segments.push(currentSegment);
          currentSegment = '';
        }
        inBracket = true;
      } else if (char === ']') {
        if (currentSegment) {
          // Convert array indices to numbers
          const index = parseInt(currentSegment);
          segments.push(isNaN(index) ? currentSegment : index);
          currentSegment = '';
        }
        inBracket = false;
      } else {
        currentSegment += char;
      }
    }
    
    // Add the last segment if there is one
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    return segments;
  };

  // Get a value at a specific path in the JSON object
  const getValueAtPath = (obj: any, path: string): any => {
    const segments = parseJsonPath(path);
    
    let current = obj;
    for (const segment of segments) {
      if (current === undefined || current === null) return undefined;
      current = current[segment];
    }
    
    return current;
  };

  // Set a value at a specific path in the JSON object (returns a new object)
  const setValueAtPath = (obj: any, path: string, value: any): any => {
    const segments = parseJsonPath(path);
    
    // If path is empty or root, replace the entire object
    if (segments.length === 0) {
      return value;
    }
    
    // Clone the object to avoid modifying the original
    const result = Array.isArray(obj) ? [...obj] : { ...obj };
    let current = result;
    
    // Traverse the path, creating objects/arrays as needed
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      const nextSegment = segments[i + 1];
      
      // If segment doesn't exist, create it
      if (current[segment] === undefined) {
        // Determine if the next segment is an array index
        current[segment] = typeof nextSegment === 'number' ? [] : {};
      }
      
      current = current[segment];
    }
    
    // Set the value at the final segment
    const lastSegment = segments[segments.length - 1];
    current[lastSegment] = value;
    
    return result;
  };

  // Delete a value at a specific path in the JSON object (returns a new object)
  const deleteValueAtPath = (obj: any, path: string): any => {
    const segments = parseJsonPath(path);
    
    // If path is empty or root, return empty object
    if (segments.length === 0) {
      return Array.isArray(obj) ? [] : {};
    }
    
    // Clone the object to avoid modifying the original
    const result = Array.isArray(obj) ? [...obj] : { ...obj };
    let current = result;
    
    // Traverse the path to the parent of the target
    for (let i = 0; i < segments.length - 1; i++) {
      if (current === undefined || current === null) return result;
      current = current[segments[i]];
    }
    
    // Delete the value at the final segment
    const lastSegment = segments[segments.length - 1];
    if (Array.isArray(current)) {
      if (typeof lastSegment === 'number') {
        current.splice(lastSegment, 1);
      }
    } else {
      delete current[lastSegment];
    }
    
    return result;
  };

  // Convert string value to the specified type
  const convertValueToType = (value: string, type: string): any => {
    try {
      switch (type) {
        case 'string':
          return value;
        case 'number':
          const num = Number(value);
          if (isNaN(num)) throw new Error('Invalid number');
          return num;
        case 'boolean':
          if (value.toLowerCase() === 'true') return true;
          if (value.toLowerCase() === 'false') return false;
          throw new Error('Boolean must be "true" or "false"');
        case 'null':
          return null;
        case 'array':
        case 'object':
          return JSON.parse(value);
        default:
          return value;
      }
    } catch (error) {
      throw new Error(`Cannot convert value to ${type}: ${error}`);
    }
  };

  // Apply edit to the JSON
  const applyEdit = () => {
    if (!jsonParsed) {
      toast({
        title: "No valid JSON",
        description: "Please enter valid JSON first",
        variant: "destructive"
      });
      return;
    }
    
    if (!editPath) {
      toast({
        title: "No path specified",
        description: "Please enter a path to edit",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Convert the value to the specified type
      const typedValue = convertValueToType(editValue, editValueType);
      
      // Update the JSON object
      const updatedJson = setValueAtPath(jsonParsed, editPath, typedValue);
      
      // Update the JSON input and parsed value
      const formattedJson = JSON.stringify(updatedJson, null, 2);
      setJsonInput(formattedJson);
      setJsonParsed(updatedJson);
      
      // Clear the edit fields
      setEditValue('');
      
      toast({
        title: "Edit applied",
        description: `Value at "${editPath}" updated successfully`
      });
      
      // Refresh paths
      const paths = getAllPaths(updatedJson);
      setJsonPaths(paths);
    } catch (err: any) {
      toast({
        title: "Edit failed",
        description: err.message || "Failed to apply edit",
        variant: "destructive"
      });
    }
  };

  // Delete a value at the specified path
  const deleteValue = () => {
    if (!jsonParsed) {
      toast({
        title: "No valid JSON",
        description: "Please enter valid JSON first",
        variant: "destructive"
      });
      return;
    }
    
    if (!editPath) {
      toast({
        title: "No path specified",
        description: "Please enter a path to delete",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Delete the value from the JSON object
      const updatedJson = deleteValueAtPath(jsonParsed, editPath);
      
      // Update the JSON input and parsed value
      const formattedJson = JSON.stringify(updatedJson, null, 2);
      setJsonInput(formattedJson);
      setJsonParsed(updatedJson);
      
      // Clear the edit fields
      setEditPath('');
      setEditValue('');
      
      toast({
        title: "Delete successful",
        description: `Value at "${editPath}" has been deleted`
      });
      
      // Refresh paths
      const paths = getAllPaths(updatedJson);
      setJsonPaths(paths);
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete value",
        variant: "destructive"
      });
    }
  };

  // Format the JSON
  const formatJSON = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter JSON to format",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      
      toast({
        title: "JSON formatted",
        description: "Your JSON has been formatted successfully"
      });
    } catch (err: any) {
      toast({
        title: "Format failed",
        description: err.message || "Invalid JSON syntax",
        variant: "destructive"
      });
    }
  };

  // Load path value when path changes
  useEffect(() => {
    if (jsonParsed && editPath) {
      try {
        const value = getValueAtPath(jsonParsed, editPath);
        
        // Determine the type of the value
        let valueType = 'string';
        let valueStr = '';
        
        if (value === null) {
          valueType = 'null';
          valueStr = 'null';
        } else if (typeof value === 'boolean') {
          valueType = 'boolean';
          valueStr = String(value);
        } else if (typeof value === 'number') {
          valueType = 'number';
          valueStr = String(value);
        } else if (typeof value === 'object') {
          valueType = Array.isArray(value) ? 'array' : 'object';
          valueStr = JSON.stringify(value, null, 2);
        } else if (typeof value === 'string') {
          valueStr = value;
        }
        
        setEditValueType(valueType);
        setEditValue(valueStr);
      } catch (error) {
        // Path doesn't exist yet, leave value empty for new values
        setEditValue('');
      }
    } else {
      setEditValue('');
    }
  }, [jsonParsed, editPath]);

  // Clear input and results
  const clearAll = () => {
    setJsonInput('');
    setJsonParsed(null);
    setEditPath('');
    setEditValue('');
    setErrorMsg(null);
    setJsonPaths([]);
  };

  // Copy JSON to clipboard
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

  // Load sample JSON
  const loadSampleJSON = () => {
    const sampleJSON = JSON.stringify({
      "person": {
        "name": "John Doe",
        "age": 30,
        "isEmployed": true,
        "contact": {
          "email": "john.doe@example.com",
          "phone": "555-1234"
        },
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zipCode": "12345"
        },
        "interests": ["programming", "hiking", "reading"],
        "education": [
          {
            "degree": "Bachelor's",
            "field": "Computer Science",
            "year": 2012
          },
          {
            "degree": "Master's",
            "field": "Data Science",
            "year": 2015
          }
        ]
      },
      "settings": {
        "theme": "dark",
        "notifications": true,
        "autoSave": false
      }
    }, null, 2);
    
    setJsonInput(sampleJSON);
  };

  // UI for the tool
  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">JSON Editor</TabsTrigger>
              <TabsTrigger value="view">JSON Viewer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between mb-2">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                        Load Sample
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        Clear
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={formatJSON}>
                        Format
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <textarea
                      className="w-full h-[400px] p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='Enter your JSON here...'
                    />
                  </div>
                  
                  {errorMsg && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
                      <span className="font-medium">Error:</span> {errorMsg}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Edit JSON Value</label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500">Path</label>
                        <div className="relative">
                          <Select
                            value={editPath}
                            onValueChange={setEditPath}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a path or type a custom path" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {jsonPaths.map((path) => (
                                <SelectItem key={path} value={path}>
                                  {path}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <label className="block text-xs text-gray-500">Value</label>
                          <Select
                            value={editValueType}
                            onValueChange={setEditValueType}
                          >
                            <SelectTrigger className="w-24 h-6 text-xs">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="null">Null</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <textarea
                          className="w-full h-40 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder={editValueType === 'object' ? '{ "key": "value" }' :
                                      editValueType === 'array' ? '[ "item1", "item2" ]' :
                                      editValueType === 'boolean' ? 'true or false' :
                                      editValueType === 'null' ? 'null' :
                                      editValueType === 'number' ? '123' : 'Enter value...'}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button onClick={applyEdit} className="flex-1">
                          Apply Edit
                        </Button>
                        <Button onClick={deleteValue} variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mt-4">
                    <h4 className="text-sm font-medium mb-2">Editor Help</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li><span className="font-medium">Path format:</span> Use dot notation (obj.prop) for properties and brackets [0] for array indices</li>
                      <li><span className="font-medium">New properties:</span> Enter a new path to create properties that don't exist yet</li>
                      <li><span className="font-medium">Arrays:</span> Use numeric indices like items[0] or array paths like education[1].year</li>
                      <li><span className="font-medium">Objects/Arrays:</span> Enter valid JSON when editing objects or arrays</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="view" className="space-y-4 pt-4">
              {jsonParsed ? (
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[600px]">
                  <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {JSON.stringify(jsonParsed, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {errorMsg ? (
                    <p>Please fix the JSON syntax errors to view formatted JSON</p>
                  ) : (
                    <p>Enter valid JSON in the editor to see the formatted view</p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON Editor</h3>
          <div className="space-y-3 text-sm">
            <p>
              The JSON Editor allows you to modify JSON data with precision by navigating through object properties and array elements using a path-based approach. Whether you're creating configuration files, debugging API responses, or preparing data for an application, this tool makes it easy to edit JSON without breaking its structure.
            </p>
            
            <h4 className="font-medium mt-4">Key Features</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Path-based editing:</span> Navigate complex nested structures with simple path expressions</li>
              <li><span className="font-medium">Type handling:</span> Convert values between different data types (string, number, boolean, object, array)</li>
              <li><span className="font-medium">Syntax validation:</span> Automatic checking ensures your JSON remains valid</li>
              <li><span className="font-medium">Auto-formatting:</span> Keep your JSON well-formatted and readable</li>
            </ul>
            
            <h4 className="font-medium mt-4">JSON Path Examples</h4>
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">person.name</td>
                  <td className="px-4 py-2">Access a property in an object</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">person.address.city</td>
                  <td className="px-4 py-2">Access a nested property</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">person.interests[0]</td>
                  <td className="px-4 py-2">Access the first element in an array</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-xs">person.education[1].year</td>
                  <td className="px-4 py-2">Access a property in an object within an array</td>
                </tr>
              </tbody>
            </table>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> When editing objects or arrays, make sure to enter valid JSON syntax. For objects, use <code className="text-xs bg-blue-100 px-1 rounded">{"{ \"key\": \"value\" }"}</code> format, and for arrays, use <code className="text-xs bg-blue-100 px-1 rounded">["item1", "item2"]</code> format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-editor-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Edit and modify JSON with precision using our interactive JSON Editor tool."
          description="Our JSON Editor provides a powerful yet intuitive interface for modifying complex JSON data structures. Navigate through nested objects and arrays using path-based editing, easily change data types, add new properties, or remove existing ones. With real-time validation, automatic formatting, and an intelligent path navigator, you can make precise modifications to your JSON without breaking its structure. Perfect for developers working with API payloads, configuration files, or any JSON-based data."
          howToUse={[
            "Paste your JSON into the editor or click 'Load Sample' to start with an example",
            "Use the path selector to navigate to a specific value, or enter a custom path",
            "Select the appropriate data type for your edit (string, number, boolean, object, array, or null)",
            "Enter the new value in the value field",
            "Click 'Apply Edit' to update the JSON with your changes",
            "To remove a value, select its path and click 'Delete'",
            "Format your JSON anytime with the 'Format' button for better readability",
            "Copy the entire edited JSON with one click when you're done"
          ]}
          features={[
            "Path-based navigation for precise editing of nested structures",
            "Support for all JSON data types with automatic type conversion",
            "Real-time syntax validation to prevent invalid JSON",
            "Path highlighting and suggestion for easy navigation",
            "Add, edit, or delete properties and array elements",
            "Automatic path discovery and suggestions",
            "Clean, intuitive interface designed for complex editing tasks"
          ]}
          faqs={[
            {
              question: "How do I specify paths to deeply nested properties?",
              answer: "Use dot notation for object properties and square brackets for array indices. For example, 'user.address.city' accesses the city property inside the address object of a user object. For arrays, use something like 'user.hobbies[0]' to access the first hobby in the hobbies array. You can combine these for complex paths like 'users[0].addresses[1].zipCode'."
            },
            {
              question: "Can I add new properties that don't exist yet?",
              answer: "Yes! Simply enter a path that doesn't exist yet, provide a value, and click 'Apply Edit'. The editor will create any necessary objects or arrays along the path. For example, if you set 'user.settings.notifications.email' to 'true' when the 'settings' object doesn't exist yet, the editor will create the entire structure."
            },
            {
              question: "How do I edit arrays or objects?",
              answer: "When editing arrays or objects, select 'Array' or 'Object' from the type dropdown, then enter valid JSON syntax in the value field. For objects, use the format {\"key1\": \"value1\", \"key2\": 123}, and for arrays, use [\"item1\", \"item2\", 123]. The editor will validate your input before applying it."
            },
            {
              question: "What happens if I make a syntax error?",
              answer: "The editor performs real-time validation and will show error messages if your JSON syntax is invalid. Edits with invalid syntax won't be applied, keeping your JSON data intact. The specific error message will help you identify and fix the issue."
            },
            {
              question: "Is my data secure when using this editor?",
              answer: "Yes. All editing happens entirely in your browser - your JSON data never leaves your device or gets transmitted to any server. We don't store or log any information you enter into the tool."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONEditorDetailed;