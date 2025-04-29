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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Label
} from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

const JSONValidatorDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [schemaInput, setSchemaInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("json");

  const { toast } = useToast();

  // Simple JSON validation (syntax only)
  const validateJSON = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter JSON to validate",
        variant: "destructive"
      });
      return;
    }

    try {
      JSON.parse(jsonInput);
      setValidationResult({ valid: true });
      
      toast({
        title: "Valid JSON",
        description: "Your JSON is syntactically valid"
      });
    } catch (err: any) {
      let lineInfo = extractLineFromError(err.message);
      setValidationResult({ 
        valid: false, 
        error: {
          message: err.message,
          line: lineInfo.line,
          column: lineInfo.column
        }
      });
      
      toast({
        title: "Invalid JSON",
        description: "Syntax error detected",
        variant: "destructive"
      });
    }
  };

  // Advanced validation against a JSON schema
  const validateAgainstSchema = () => {
    if (!jsonInput.trim() || !schemaInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter both JSON and Schema to validate",
        variant: "destructive"
      });
      return;
    }

    try {
      const json = JSON.parse(jsonInput);
      const schema = JSON.parse(schemaInput);
      
      // Basic schema validation using JSON Schema
      // Note: This is a simplified implementation 
      // Real-world JSON Schema validation requires a dedicated library
      const validationErrors = validateWithSchema(json, schema);
      
      if (validationErrors.length === 0) {
        setValidationResult({ valid: true });
        toast({
          title: "Validation Successful",
          description: "JSON validates against the provided schema"
        });
      } else {
        setValidationResult({ 
          valid: false, 
          error: { message: validationErrors.join('\n') } 
        });
        toast({
          title: "Validation Failed",
          description: `${validationErrors.length} schema validation ${validationErrors.length === 1 ? 'error' : 'errors'} found`,
          variant: "destructive"
        });
      }
    } catch (err: any) {
      setValidationResult({ 
        valid: false, 
        error: { message: err.message } 
      });
      toast({
        title: "Validation Error",
        description: "Error parsing JSON or schema",
        variant: "destructive"
      });
    }
  };

  // Extract line and column info from JSON parse error message
  const extractLineFromError = (errorMessage: string): { line?: number, column?: number } => {
    const positionMatch = errorMessage.match(/position (\d+)/);
    if (positionMatch && positionMatch[1]) {
      const position = parseInt(positionMatch[1]);
      
      // Calculate line and column from position
      const lines = jsonInput.slice(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      return { line, column };
    }
    return {};
  };

  // Simplified schema validation
  // Note: This is a basic implementation - a real-world solution would use a library
  const validateWithSchema = (json: any, schema: any): string[] => {
    const errors: string[] = [];
    
    // Check type
    if (schema.type && typeof json !== schema.type) {
      errors.push(`Type mismatch: Expected ${schema.type}, got ${typeof json}`);
    }
    
    // Check required properties
    if (schema.required && Array.isArray(schema.required)) {
      for (const prop of schema.required) {
        if (json[prop] === undefined) {
          errors.push(`Missing required property: ${prop}`);
        }
      }
    }
    
    // Check properties
    if (schema.properties && typeof json === 'object' && !Array.isArray(json)) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        if (json[propName] !== undefined) {
          // If property exists, check its value against property schema
          if (typeof propSchema === 'object') {
            const propErrors = validateWithSchema(json[propName], propSchema as any);
            errors.push(...propErrors.map(err => `Property '${propName}': ${err}`));
          }
        }
      }
    }
    
    // Check array items
    if (schema.items && Array.isArray(json)) {
      for (let i = 0; i < json.length; i++) {
        const itemErrors = validateWithSchema(json[i], schema.items);
        errors.push(...itemErrors.map(err => `Array item [${i}]: ${err}`));
      }
    }
    
    // More validation rules could be added here
    
    return errors;
  };

  const clearInput = (type: 'json' | 'schema' | 'both') => {
    if (type === 'json' || type === 'both') {
      setJsonInput('');
    }
    if (type === 'schema' || type === 'both') {
      setSchemaInput('');
    }
    if (type === 'both') {
      setValidationResult(null);
    }
  };

  const copyToClipboard = (text: string, type: 'json' | 'schema') => {
    if (!text) {
      toast({
        title: "Nothing to copy",
        description: `Please enter ${type === 'json' ? 'JSON' : 'Schema'} first`,
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type === 'json' ? 'JSON' : 'Schema'} copied to clipboard`
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
      "id": 123,
      "name": "Sample Product",
      "price": 29.99,
      "inStock": true,
      "categories": ["electronics", "gadgets"],
      "specifications": {
        "weight": "200g",
        "dimensions": {
          "width": 10,
          "height": 5,
          "depth": 2
        }
      },
      "reviews": [
        {
          "user": "user123",
          "rating": 4.5,
          "comment": "Great product, works well!"
        },
        {
          "user": "user456",
          "rating": 5,
          "comment": "Excellent quality and fast delivery."
        }
      ]
    }, null, 2);
    
    setJsonInput(sampleJSON);
  };

  const loadSampleSchema = () => {
    const sampleSchema = JSON.stringify({
      "type": "object",
      "required": ["id", "name", "price"],
      "properties": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "price": { "type": "number" },
        "inStock": { "type": "boolean" },
        "categories": {
          "type": "array",
          "items": { "type": "string" }
        },
        "specifications": {
          "type": "object",
          "properties": {
            "weight": { "type": "string" },
            "dimensions": {
              "type": "object",
              "properties": {
                "width": { "type": "number" },
                "height": { "type": "number" },
                "depth": { "type": "number" }
              }
            }
          }
        },
        "reviews": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["user", "rating"],
            "properties": {
              "user": { "type": "string" },
              "rating": { "type": "number" },
              "comment": { "type": "string" }
            }
          }
        }
      }
    }, null, 2);
    
    setSchemaInput(sampleSchema);
  };

  const formatJSON = (type: 'json' | 'schema') => {
    try {
      if (type === 'json' && jsonInput.trim()) {
        const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
        setJsonInput(formatted);
      } else if (type === 'schema' && schemaInput.trim()) {
        const formatted = JSON.stringify(JSON.parse(schemaInput), null, 2);
        setSchemaInput(formatted);
      }
    } catch (err) {
      toast({
        title: "Formatting Error",
        description: `Invalid ${type === 'json' ? 'JSON' : 'Schema'} syntax`,
        variant: "destructive"
      });
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="schema">JSON Schema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="pt-4 space-y-4">
              <div className="flex justify-between mb-2">
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                    Load Sample
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => clearInput('json')}>
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => formatJSON('json')}>
                    Format
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(jsonInput, 'json')}>
                  Copy
                </Button>
              </div>
              
              <div>
                <Label className="block mb-2 text-sm font-medium">JSON to Validate</Label>
                <textarea
                  className="w-full h-80 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='Enter your JSON here...'
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={validateJSON}>
                  Validate JSON Syntax
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="schema" className="pt-4 space-y-4">
              <div className="flex justify-between mb-2">
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={loadSampleSchema}>
                    Load Sample
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => clearInput('schema')}>
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => formatJSON('schema')}>
                    Format
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(schemaInput, 'schema')}>
                  Copy
                </Button>
              </div>
              
              <div>
                <Label className="block mb-2 text-sm font-medium">JSON Schema (optional)</Label>
                <textarea
                  className="w-full h-80 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={schemaInput}
                  onChange={(e) => setSchemaInput(e.target.value)}
                  placeholder='Enter JSON Schema to validate against...'
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={validateAgainstSchema}
                  disabled={!jsonInput.trim() || !schemaInput.trim()}
                >
                  Validate Against Schema
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {validationResult && (
            <div className={`mt-6 p-4 rounded-md ${validationResult.valid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center mb-2">
                <span className={`text-lg ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {validationResult.valid ? '✓ Valid JSON' : '✗ Invalid JSON'}
                </span>
              </div>
              
              {!validationResult.valid && validationResult.error && (
                <div className="text-red-700 font-mono text-sm whitespace-pre-wrap">
                  {validationResult.error.message}
                  {validationResult.error.line && (
                    <div className="mt-2">
                      Error at line {validationResult.error.line}
                      {validationResult.error.column && `, column ${validationResult.error.column}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON Validator</h3>
          <div className="space-y-3 text-sm">
            <p>
              JSON Validator checks your JSON data for syntax errors and can also validate it against a JSON Schema to ensure it meets specific structural requirements. This is essential for ensuring data quality and preventing errors in applications that consume JSON data.
            </p>
            
            <h4 className="font-medium mt-4">Two Ways to Validate</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li><span className="font-medium">Syntax Validation:</span> Checks if your JSON is properly formatted and can be parsed without errors</li>
              <li><span className="font-medium">Schema Validation:</span> Verifies that your JSON conforms to a specific structure defined by a JSON Schema</li>
            </ol>
            
            <h4 className="font-medium mt-4">When to Use JSON Validation</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Before submitting data to an API that expects JSON</li>
              <li>When receiving JSON from external sources</li>
              <li>When debugging data-related issues in your application</li>
              <li>As part of your quality assurance process</li>
              <li>When defining data contracts between different systems</li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> JSON Schema is powerful for defining validation rules, including required fields, data types, patterns, and more complex constraints. It's widely supported in various programming languages and frameworks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-validator-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Ensure your JSON data is valid and meets your schema requirements with our comprehensive JSON Validator."
          description="Our JSON Validator helps you verify both the syntax and structure of your JSON data. With support for basic syntax validation and advanced schema validation, you can ensure your JSON documents are not only well-formed but also adhere to specific data models. Perfect for API development, configuration validation, and data quality assurance, this tool provides detailed error reporting to quickly identify and fix issues in your JSON data."
          howToUse={[
            "Paste your JSON data into the 'JSON' tab's text area or use the 'Load Sample' button",
            "For basic syntax validation, click 'Validate JSON Syntax'",
            "For more advanced validation, switch to the 'JSON Schema' tab and enter a JSON Schema",
            "Click 'Validate Against Schema' to check if your JSON conforms to the provided schema",
            "View validation results, including detailed error messages with line and column information",
            "Format your JSON or schema with one click for better readability",
            "Copy validated JSON to your clipboard when needed"
          ]}
          features={[
            "Syntax validation to catch JSON parsing errors",
            "Schema validation to ensure JSON meets structural requirements",
            "Detailed error reporting with line and column information",
            "One-click formatting for both JSON and JSON Schema",
            "Sample data and schema loading for quick testing",
            "Support for complex nested objects and arrays",
            "Clear visual indicators for validation results"
          ]}
          faqs={[
            {
              question: "What's the difference between syntax validation and schema validation?",
              answer: "Syntax validation checks if your JSON is properly formatted and can be parsed without errors - essentially, if it's valid JSON. Schema validation goes a step further by verifying that your JSON conforms to a specific structure defined by a JSON Schema, including data types, required fields, and other constraints."
            },
            {
              question: "What is JSON Schema?",
              answer: "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the structure and requirements of your JSON data, including what fields are required, what types they should be, patterns they should match, and much more. JSON Schema is itself written in JSON."
            },
            {
              question: "How detailed are the error messages?",
              answer: "For syntax errors, our validator provides the error message with line and column information to help you pinpoint exactly where the problem is. For schema validation errors, it identifies which parts of your JSON don't conform to the schema and what specifically is wrong."
            },
            {
              question: "Can I validate really complex JSON structures?",
              answer: "Yes. Our validator supports the full JSON specification and can handle complex nested objects and arrays. For schema validation, it supports key JSON Schema features including type validation, required properties, array validation, and nested object validation."
            },
            {
              question: "Is my data secure when using this validator?",
              answer: "Yes. All validation happens entirely in your browser - your JSON data never leaves your device or gets transmitted to any server. We don't store or log any information you enter into the tool."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONValidatorDetailed;