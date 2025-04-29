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

const JSONToXMLDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [xmlOutput, setXmlOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [options, setOptions] = useState({
    rootElementName: "root",
    indentSize: 2,
    includeDeclaration: true,
    arrayItemName: "item",
  });
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const handleConvertToXML = () => {
    setError(null);
    setXmlOutput("");

    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter some JSON to convert",
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
      const xml = jsonToXml(parsedJSON, options);
      setXmlOutput(xml);
      setActiveTab("output");
      
      toast({
        title: "Success",
        description: "JSON converted to XML successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const jsonToXml = (
    obj: any, 
    options: { rootElementName: string; indentSize: number; includeDeclaration: boolean; arrayItemName: string },
    level = 0
  ): string => {
    const indent = ' '.repeat(options.indentSize * level);
    const indentInner = ' '.repeat(options.indentSize * (level + 1));
    let xml = '';

    if (level === 0 && options.includeDeclaration) {
      xml += '<?xml version="1.0" encoding="UTF-8" ?>\n';
    }

    if (level === 0) {
      // Root element
      xml += `${indent}<${options.rootElementName}>\n`;
      xml += jsonToXml(obj, options, level + 1);
      xml += `${indent}</${options.rootElementName}>\n`;
    } else {
      // Handle different types
      if (obj === null || obj === undefined) {
        return `${indentInner}<null/>\n`;
      } else if (typeof obj === 'boolean' || typeof obj === 'number' || typeof obj === 'string') {
        return `${indent}${escapeXml(String(obj))}\n`;
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          xml += `${indent}<${options.arrayItemName}>\n`;
          xml += jsonToXml(item, options, level + 1);
          xml += `${indent}</${options.arrayItemName}>\n`;
        }
      } else if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
          const safeKey = makeXmlElementName(key);
          
          if (value === null || value === undefined) {
            xml += `${indent}<${safeKey}/>\n`;
          } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
            xml += `${indent}<${safeKey}>${escapeXml(String(value))}</${safeKey}>\n`;
          } else {
            xml += `${indent}<${safeKey}>\n`;
            xml += jsonToXml(value, options, level + 1);
            xml += `${indent}</${safeKey}>\n`;
          }
        }
      }
    }

    return xml;
  };

  // Helper function to escape XML special characters
  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Helper function to ensure XML element names are valid
  const makeXmlElementName = (str: string): string => {
    // XML element names must start with a letter or underscore, followed by letters, digits, hyphens, underscores, or periods
    let safeName = str;
    
    // Replace invalid starting characters
    if (!/^[a-zA-Z_]/.test(safeName)) {
      safeName = '_' + safeName;
    }
    
    // Replace invalid characters in the rest of the name
    safeName = safeName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    
    return safeName;
  };

  const handleClearJSON = () => {
    setJsonInput("");
    setXmlOutput("");
    setError(null);
  };

  const handleCopyXML = () => {
    if (xmlOutput) {
      navigator.clipboard.writeText(xmlOutput);
      toast({
        title: "Copied",
        description: "XML copied to clipboard",
      });
    }
  };

  const getToolContent = () => {
    return {
      title: "JSON to XML Converter",
      introduction: "Convert JSON to XML format with customizable options.",
      description: "Our JSON to XML converter transforms your JSON data into well-formed XML format, making it compatible with XML parsers and processors. Whether you need to interface with legacy systems, comply with XML requirements, or simply convert between data formats, this tool provides a reliable way to transform your JSON structures into equivalent XML representations with customizable elements and formatting options.",
      howToUse: [
        "Enter or paste your JSON data in the input field",
        "Configure XML output options (root element name, indentation, etc.)",
        "Click 'Convert to XML' to process your data",
        "Review the generated XML in the output window",
        "Copy the result to your clipboard or use as needed"
      ],
      features: [
        "Intelligent conversion preserving data structure",
        "Customizable root element name",
        "Control over XML declaration inclusion",
        "Array item element name customization",
        "Proper handling of nested objects and arrays",
        "Special character escaping for valid XML",
        "Customizable indentation for readable output",
        "Support for all JSON data types",
        "Clean conversion of complex data structures"
      ],
      faqs: [
        {
          question: "How are JSON arrays converted to XML?",
          answer: "JSON arrays are converted to repeated XML elements with the name specified in the 'Array item name' setting (defaults to 'item'). Each array element becomes a separate XML element with the appropriate structure based on its type."
        },
        {
          question: "What happens to JSON property names in the XML output?",
          answer: "JSON property names become XML element names. Since XML has stricter naming rules than JSON, any invalid characters in property names are replaced with underscores, and names not starting with a letter or underscore will have an underscore prepended."
        },
        {
          question: "Does this conversion preserve all the original data?",
          answer: "Yes, all data values are preserved in the conversion. However, due to the differences between JSON and XML formats, the structure representation changes. JSON is more compact and flexible, while XML is more verbose with stricter structural rules."
        },
        {
          question: "Can I convert XML back to JSON?",
          answer: "While this particular tool converts from JSON to XML, the conversion from XML back to JSON would require a separate tool. The conversion is not always perfectly reversible due to the structural differences between the formats and special handling of arrays and attributes in XML."
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
            <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input">Input (JSON)</TabsTrigger>
                <TabsTrigger value="output" disabled={!xmlOutput && !error}>Output (XML)</TabsTrigger>
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
                      <Label htmlFor="rootElementName">Root Element Name</Label>
                      <Input
                        id="rootElementName"
                        value={options.rootElementName}
                        onChange={(e) => setOptions({...options, rootElementName: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="arrayItemName">Array Item Element Name</Label>
                      <Input
                        id="arrayItemName"
                        value={options.arrayItemName}
                        onChange={(e) => setOptions({...options, arrayItemName: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="indentSize">Indentation Size</Label>
                      <Input
                        id="indentSize"
                        type="number"
                        min={0}
                        max={8}
                        value={options.indentSize}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 8) {
                            setOptions({...options, indentSize: value});
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="includeDeclaration"
                        checked={options.includeDeclaration}
                        onCheckedChange={(checked) => setOptions({...options, includeDeclaration: checked as boolean})}
                      />
                      <Label htmlFor="includeDeclaration">Include XML Declaration</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleConvertToXML} disabled={loading}>
                    {loading ? "Converting..." : "Convert to XML"}
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
                  xmlOutput && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">XML Output</h3>
                        <Button variant="outline" size="sm" onClick={handleCopyXML}>
                          <i className="fas fa-copy mr-2"></i> Copy
                        </Button>
                      </div>
                      
                      <div className="border rounded-md p-4 font-mono text-sm overflow-x-auto bg-gray-50 max-h-96 overflow-y-auto">
                        <pre>{xmlOutput}</pre>
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500 px-1">
          <p>Convert your JSON data to XML format with full control over the output structure. Customize element names, indentation, and more to produce valid XML that meets your specific requirements.</p>
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

export default JSONToXMLDetailed;