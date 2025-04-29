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

const JSONToXMLDetailed = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [xmlOutput, setXmlOutput] = useState<string>('');
  const [rootElement, setRootElement] = useState<string>('root');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [includeDeclaration, setIncludeDeclaration] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const convertToXML = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to convert");
      setXmlOutput('');
      return;
    }

    try {
      const jsonObj = JSON.parse(jsonInput);
      const xml = jsonToXML(jsonObj, rootElement, indentSize, includeDeclaration);
      setXmlOutput(xml);
      setError(null);
      
      toast({
        title: "Conversion successful",
        description: "JSON has been converted to XML"
      });
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      setXmlOutput('');
      
      toast({
        title: "Conversion error",
        description: "Please check your JSON syntax",
        variant: "destructive"
      });
    }
  };

  // Function to convert JSON to XML
  const jsonToXML = (
    jsonObj: any, 
    rootName: string = 'root', 
    indent: number = 2,
    includeXmlDeclaration: boolean = true
  ): string => {
    const indentStr = ' '.repeat(indent);
    let xml = '';
    
    // Add XML declaration if requested
    if (includeXmlDeclaration) {
      xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    }
    
    // Helper function for recursive JSON to XML conversion
    const convertObjectToXML = (obj: any, nodeName: string, level: number = 0): string => {
      const padding = indentStr.repeat(level);
      let xmlContent = '';
      
      if (obj === null || obj === undefined) {
        return `${padding}<${nodeName} />\n`;
      }
      
      // If primitive value (string, number, boolean)
      if (typeof obj !== 'object') {
        // Escape special characters in XML content
        const content = String(obj)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        
        return `${padding}<${nodeName}>${content}</${nodeName}>\n`;
      }
      
      // Handle arrays
      if (Array.isArray(obj)) {
        // For array items, use singular form of the node name where possible
        const itemName = getSingularName(nodeName);
        
        xmlContent += `${padding}<${nodeName}>\n`;
        obj.forEach(item => {
          xmlContent += convertObjectToXML(item, itemName, level + 1);
        });
        xmlContent += `${padding}</${nodeName}>\n`;
        
        return xmlContent;
      }
      
      // Handle objects
      xmlContent += `${padding}<${nodeName}>\n`;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Convert camelCase to kebab-case for XML element names if needed
          const elementName = camelToKebab ? camelCaseToKebabCase(key) : key;
          xmlContent += convertObjectToXML(obj[key], elementName, level + 1);
        }
      }
      xmlContent += `${padding}</${nodeName}>\n`;
      
      return xmlContent;
    };
    
    // Start the conversion with the root element
    xml += convertObjectToXML(jsonObj, rootName);
    
    return xml;
  };

  // Helper function to get singular form of a noun (very basic)
  const getSingularName = (name: string): string => {
    if (name.endsWith('ies')) {
      return name.slice(0, -3) + 'y';  // categories -> category
    } else if (name.endsWith('s') && !name.endsWith('ss')) {
      return name.slice(0, -1);  // items -> item
    }
    return name + '-item';  // fallback for non-standard plurals
  };

  // For CamelCase to kebab-case conversion (optional)
  const camelCaseToKebabCase = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  };

  // Flag for camelCase to kebab-case conversion
  const [camelToKebab, setCamelToKebab] = useState<boolean>(false);

  const clearInput = () => {
    setJsonInput('');
    setXmlOutput('');
    setError(null);
  };

  const copyToClipboard = (text: string, type: 'json' | 'xml') => {
    if (!text) {
      toast({
        title: "Nothing to copy",
        description: type === 'json' ? "Please enter some JSON first" : "Please convert JSON to XML first",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type === 'json' ? 'JSON' : 'XML'} copied to clipboard`
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
      "store": {
        "book": [
          {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "year": 1925,
            "price": 9.99,
            "genre": "Classic Fiction",
            "inStock": true
          },
          {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "year": 1960,
            "price": 8.99,
            "genre": "Literary Fiction",
            "inStock": false
          }
        ],
        "bicycle": {
          "model": "Mountain Bike",
          "color": "Red",
          "price": 199.99,
          "inStock": true
        }
      },
      "shopInfo": {
        "name": "My Bookstore",
        "location": {
          "address": "123 Main St",
          "city": "Booktown",
          "zipCode": "12345"
        },
        "established": 1995,
        "employeeCount": 12
      }
    }, null, 2);
    
    setJsonInput(sampleJSON);
    setError(null);
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
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(jsonInput, 'json')}>
                Copy JSON
              </Button>
            </div>
            
            <div>
              <Label className="block mb-2 text-sm font-medium">JSON Input</Label>
              <textarea
                className="w-full h-60 p-4 font-mono text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Enter your JSON here...'
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="root-element" className="block mb-2 text-sm font-medium">Root Element Name</Label>
                <Input
                  id="root-element"
                  value={rootElement}
                  onChange={(e) => setRootElement(e.target.value)}
                  placeholder="root"
                />
              </div>
              
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
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="xml-declaration" 
                  checked={includeDeclaration}
                  onCheckedChange={(checked) => setIncludeDeclaration(checked as boolean)}
                />
                <Label htmlFor="xml-declaration" className="text-sm font-medium">Include XML Declaration</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="camel-to-kebab" 
                  checked={camelToKebab}
                  onCheckedChange={(checked) => setCamelToKebab(checked as boolean)}
                />
                <Label htmlFor="camel-to-kebab" className="text-sm font-medium">Convert camelCase to kebab-case</Label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={convertToXML}>Convert to XML</Button>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            
            {xmlOutput && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="block text-sm font-medium">XML Output</Label>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(xmlOutput, 'xml')}>
                    Copy XML
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
                  <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {xmlOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About JSON to XML Conversion</h3>
          <div className="space-y-3 text-sm">
            <p>
              This tool converts JSON (JavaScript Object Notation) to XML (eXtensible Markup Language) format. While both are data interchange formats, they have different structures and use cases. Converting between these formats is often necessary when integrating with different systems or APIs.
            </p>
            
            <h4 className="font-medium mt-4">Key Differences Between JSON and XML</h4>
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JSON</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XML</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Syntax</td>
                  <td className="px-4 py-2">Lightweight, uses braces and brackets</td>
                  <td className="px-4 py-2">More verbose, uses tags with opening/closing elements</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Data Types</td>
                  <td className="px-4 py-2">Supports numbers, strings, booleans, arrays, objects, null</td>
                  <td className="px-4 py-2">Everything is treated as text by default</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Attributes</td>
                  <td className="px-4 py-2">No concept of attributes</td>
                  <td className="px-4 py-2">Supports attributes in tags</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Comments</td>
                  <td className="px-4 py-2">Does not support comments</td>
                  <td className="px-4 py-2">Supports comments</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">File Size</td>
                  <td className="px-4 py-2">Typically smaller</td>
                  <td className="px-4 py-2">Typically larger</td>
                </tr>
              </tbody>
            </table>
            
            <h4 className="font-medium mt-4">Conversion Challenges</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>JSON allows duplicate keys in objects, while XML requires unique element names at the same level</li>
              <li>XML distinguishes between elements and attributes, which JSON doesn't have</li>
              <li>Handling of arrays can vary, as XML doesn't have a direct equivalent</li>
              <li>XML requires a single root element, while JSON can start with any valid value</li>
            </ul>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> When converting JSON to XML, consider naming conventions. XML typically uses kebab-case (with hyphens) for element names, while JSON often uses camelCase. Our converter offers an option to automatically transform these for better compatibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-to-xml-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Transform JSON data into well-formed XML with our powerful JSON to XML converter tool."
          description="Our JSON to XML converter transforms JSON data into properly structured XML, perfect for integrating with XML-based systems, APIs, or legacy applications. With customizable options like root element naming, indentation control, and automatic case conversion, you can ensure your XML output fits your exact specifications. Our tool preserves your data structure while adapting it to the hierarchical, tag-based format of XML, making cross-format data exchange seamless."
          howToUse={[
            "Paste your JSON data into the input area or click 'Load Sample' for an example",
            "Specify a custom root element name for your XML document (default is 'root')",
            "Adjust the indentation size for the output XML (between 0-8 spaces)",
            "Choose whether to include the XML declaration at the beginning",
            "Optionally convert camelCase property names to kebab-case for XML conventions",
            "Click 'Convert to XML' to transform your JSON",
            "Copy the resulting XML to your clipboard with one click"
          ]}
          features={[
            "Handles complex nested JSON structures including objects and arrays",
            "Customizable root element name for the XML document",
            "Adjustable indentation for readable XML formatting",
            "Option to include or exclude XML declaration",
            "Automatic conversion of camelCase to kebab-case for XML conventions",
            "Special character escaping for valid XML output",
            "Smart handling of array items with appropriate naming"
          ]}
          faqs={[
            {
              question: "How does the converter handle JSON arrays?",
              answer: "Arrays in JSON are converted to repeated elements in XML. For example, an array named 'items' would be represented as an 'items' element containing multiple 'item' elements (the converter attempts to create sensible singular forms of the array name). This preserves the structure while adapting to XML's hierarchical format."
            },
            {
              question: "Why would I need to convert JSON to XML?",
              answer: "While JSON is more common in modern web applications, XML is still widely used in enterprise systems, SOAP APIs, configuration files, and various industry standards (like healthcare and finance). You might need to convert JSON to XML when integrating with these systems, generating reports, or working with legacy applications that only accept XML input."
            },
            {
              question: "What happens to the data types when converting from JSON to XML?",
              answer: "XML doesn't have native support for data types like JSON does - everything in XML is essentially text. Our converter preserves the structure but converts all values to text representations. Numbers, booleans, and other primitive types become text content in the XML elements. For specialized needs, you might need to add XML Schema (XSD) separately to define data types."
            },
            {
              question: "Can I convert very large JSON files?",
              answer: "The tool is designed to handle moderately sized JSON documents. Very large files (multiple MB) might affect browser performance since all processing happens in your browser. For extremely large JSON to XML conversions, consider using server-side tools or dedicated conversion libraries."
            },
            {
              question: "Is my data secure when using this converter?",
              answer: "Yes. All conversion happens entirely in your browser - your JSON data never leaves your device or gets transmitted to any server. We don't store or log any information you enter into the tool."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONToXMLDetailed;