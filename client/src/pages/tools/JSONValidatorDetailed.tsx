import { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const JSONValidatorDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: { message: string; line?: number; column?: number };
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const validateJSON = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to validate",
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
      
      JSON.parse(cleanedInput);
      
      setValidationResult({ isValid: true });
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid and well-formed",
      });
    } catch (err: any) {
      // Extract line and column information from error message if available
      const errorMessage = err.message;
      const positionMatch = errorMessage.match(/position (\d+)/);
      
      let errorInfo: { 
        message: string; 
        line?: number; 
        column?: number 
      } = {
        message: errorMessage,
      };
      
      if (positionMatch && positionMatch[1]) {
        const position = parseInt(positionMatch[1]);
        const lines = jsonInput.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        errorInfo = {
          ...errorInfo,
          line,
          column
        };
      }
      
      setValidationResult({ isValid: false, error: errorInfo });
      toast({
        title: "Invalid JSON",
        description: "Your JSON contains errors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearJSON = () => {
    setJsonInput("");
    setValidationResult(null);
  };

  const getToolContent = () => {
    return {
      title: "JSON Validator",
      introduction: "Check if your JSON is valid and well-formed with detailed error reporting.",
      description: "Our JSON Validator ensures your JSON data is correctly formatted and follows the JSON specification. It provides immediate feedback with detailed error messages, highlighting exactly where syntax errors occur. Perfect for developers, data analysts, or anyone working with JSON who needs to quickly verify data structure before using it in applications or APIs.",
      howToUse: [
        "Enter or paste your JSON data in the input field",
        "Click 'Validate JSON' to check for errors",
        "Review the validation results with detailed error information",
        "Fix any reported errors and validate again if needed"
      ],
      features: [
        "Instant validation of JSON syntax and structure",
        "Detailed error messages with line and column numbers",
        "Support for comments in JSON (automatically removed during validation)",
        "Quick validation of large JSON files",
        "Clear visual feedback on validation status",
        "Browser-based processing for complete data privacy",
        "No file size limitations for validation",
        "Supports all JSON data types and structures"
      ],
      faqs: [
        {
          question: "What makes JSON invalid?",
          answer: "Common JSON errors include missing or extra commas, unquoted property names, trailing commas in arrays or objects, single quotes instead of double quotes, unescaped special characters in strings, and invalid values such as undefined or NaN."
        },
        {
          question: "Why validate JSON before using it?",
          answer: "Validating JSON helps prevent runtime errors in applications, ensures data integrity before storage or transmission, and catches syntax issues early in the development process, saving debugging time and preventing potential security vulnerabilities."
        },
        {
          question: "Does this validator check JSON schema compliance?",
          answer: "No, this tool only validates JSON syntax and structure according to the JSON specification. It doesn't verify that your JSON follows a specific schema or data model. For schema validation, you would need a dedicated JSON Schema validator."
        },
        {
          question: "Can I validate JSON with comments?",
          answer: "Yes, while comments are not part of the official JSON specification, our validator automatically removes both single-line (//) and multi-line (/* */) comments before validating, allowing you to work with commented JSON during development."
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
            <div className="space-y-2">
              <Label htmlFor="jsonInput">Enter JSON</Label>
              <Textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{\n  "example": "Paste your JSON here",\n  "items": [1, 2, 3]\n}'
                className="font-mono min-h-[200px]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={validateJSON} disabled={loading}>
                {loading ? "Validating..." : "Validate JSON"}
              </Button>
              <Button variant="outline" onClick={handleClearJSON}>
                Clear
              </Button>
            </div>
            
            {validationResult && (
              <div className="mt-4">
                {validationResult.isValid ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Valid JSON</span> - Your JSON is well-formed and follows proper syntax.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <div className="font-medium mb-1">Invalid JSON</div>
                      <div className="text-sm font-mono">
                        {validationResult.error?.message}
                      </div>
                      {validationResult.error?.line && (
                        <div className="text-sm mt-2">
                          Error at line {validationResult.error.line}, column {validationResult.error.column}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>This tool validates JSON syntax according to the JSON specification. It checks for properly paired braces, quoted strings, correct use of commas, and valid values.</p>
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

export default JSONValidatorDetailed;