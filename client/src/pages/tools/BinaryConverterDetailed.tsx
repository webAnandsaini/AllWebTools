import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

const BinaryConverterDetailed = () => {
  const [location] = useLocation();
  const currentPath = location.split("/").pop() || "";

  // State for tool operation
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [conversionType, setConversionType] = useState<string>("text-to-binary");

  // Define conversion functions
  useEffect(() => {
    // Set the conversion type based on the URL path
    const path = currentPath.replace("-detailed", "");
    if (path && conversions[path]) {
      setConversionType(path);
    }
  }, [currentPath]);

  // Perform conversion when input changes or conversion type changes
  useEffect(() => {
    if (inputValue) {
      performConversion();
    }
  }, [inputValue, conversionType]);

  const conversions: { [key: string]: { convert: (input: string) => string; title: string } } = {
    "text-to-binary": {
      convert: (text) => {
        return text
          .split("")
          .map((char) => {
            return char.charCodeAt(0).toString(2).padStart(8, "0");
          })
          .join(" ");
      },
      title: "Text to Binary"
    },
    "binary-to-text": {
      convert: (binary) => {
        // Remove spaces and non-binary characters
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              return String.fromCharCode(parseInt(bin, 2));
            } catch (e) {
              return "";
            }
          })
          .join("");
      },
      title: "Binary to Text"
    },
    "binary-to-hex": {
      convert: (binary) => {
        // Remove spaces and non-binary characters
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              return parseInt(bin, 2).toString(16).toUpperCase().padStart(2, "0");
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "Binary to HEX"
    },
    "hex-to-binary": {
      convert: (hex) => {
        // Remove spaces and non-hex characters
        const cleanHex = hex.replace(/[^0-9A-Fa-f\s]/g, "");
        return cleanHex
          .split(/\s+/)
          .map((h) => {
            if (!h) return "";
            try {
              return parseInt(h, 16).toString(2).padStart(8, "0");
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "HEX to Binary"
    },
    "binary-to-ascii": {
      convert: (binary) => {
        // Remove spaces and non-binary characters
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              const decimal = parseInt(bin, 2);
              return decimal.toString();
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "Binary to ASCII"
    },
    "ascii-to-binary": {
      convert: (ascii) => {
        // Assume ASCII numbers are space separated
        return ascii
          .split(/\s+/)
          .map((num) => {
            if (!num) return "";
            try {
              const decimal = parseInt(num, 10);
              return decimal.toString(2).padStart(8, "0");
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "ASCII to Binary"
    },
    "binary-to-decimal": {
      convert: (binary) => {
        // Remove spaces and non-binary characters
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              return parseInt(bin, 2).toString(10);
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "Binary to Decimal"
    },
    "decimal-to-binary": {
      convert: (decimal) => {
        // Assume decimal numbers are space separated
        return decimal
          .split(/\s+/)
          .map((num) => {
            if (!num) return "";
            try {
              return parseInt(num, 10).toString(2).padStart(8, "0");
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "Decimal to Binary"
    },
    "text-to-ascii": {
      convert: (text) => {
        return text
          .split("")
          .map((char) => {
            return char.charCodeAt(0).toString(10);
          })
          .join(" ");
      },
      title: "Text to ASCII"
    },
    "decimal-to-hex": {
      convert: (decimal) => {
        // Assume decimal numbers are space separated
        return decimal
          .split(/\s+/)
          .map((num) => {
            if (!num) return "";
            try {
              return parseInt(num, 10).toString(16).toUpperCase();
            } catch (e) {
              return "";
            }
          })
          .join(" ");
      },
      title: "Decimal to HEX"
    },
    "binary-translator": {
      convert: (text) => {
        // Same as text-to-binary for simplicity
        return text
          .split("")
          .map((char) => {
            return char.charCodeAt(0).toString(2).padStart(8, "0");
          })
          .join(" ");
      },
      title: "Binary Translator"
    },
    "english-to-binary": {
      convert: (text) => {
        // Same as text-to-binary for English
        return text
          .split("")
          .map((char) => {
            return char.charCodeAt(0).toString(2).padStart(8, "0");
          })
          .join(" ");
      },
      title: "English to Binary"
    },
    "binary-to-english": {
      convert: (binary) => {
        // Same as binary-to-text for English
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              return String.fromCharCode(parseInt(bin, 2));
            } catch (e) {
              return "";
            }
          })
          .join("");
      },
      title: "Binary to English"
    },
    "binary-decoder": {
      convert: (binary) => {
        // Same as binary-to-text for general purpose decoding
        const cleanBinary = binary.replace(/[^01\s]/g, "");
        return cleanBinary
          .split(/\s+/)
          .map((bin) => {
            if (!bin) return "";
            try {
              return String.fromCharCode(parseInt(bin, 2));
            } catch (e) {
              return "";
            }
          })
          .join("");
      },
      title: "Binary Decoder"
    },
    "hex-to-text": {
      convert: (hex) => {
        // Remove spaces and non-hex characters
        const cleanHex = hex.replace(/[^0-9A-Fa-f\s]/g, "");
        return cleanHex
          .split(/\s+/)
          .map((h) => {
            if (!h) return "";
            try {
              return String.fromCharCode(parseInt(h, 16));
            } catch (e) {
              return "";
            }
          })
          .join("");
      },
      title: "HEX to Text"
    },
    "ascii-to-text": {
      convert: (ascii) => {
        // Assume ASCII numbers are space separated
        return ascii
          .split(/\s+/)
          .map((num) => {
            if (!num) return "";
            try {
              return String.fromCharCode(parseInt(num, 10));
            } catch (e) {
              return "";
            }
          })
          .join("");
      },
      title: "ASCII to Text"
    }
  };

  const performConversion = () => {
    try {
      if (!inputValue.trim()) {
        setOutputValue("");
        return;
      }

      const conversion = conversions[conversionType];
      if (conversion) {
        const result = conversion.convert(inputValue);
        setOutputValue(result);
      } else {
        setOutputValue("Conversion type not supported");
      }
    } catch (error) {
      console.error("Conversion error:", error);
      setOutputValue("Error performing conversion. Please check your input.");
    }
  };

  const handleConvert = () => {
    performConversion();
  };

  const handleReset = () => {
    setInputValue("");
    setOutputValue("");
  };

  const handleSwap = () => {
    // Find the opposite conversion if available
    const currentConversion = conversionType;
    let oppositeConversion = "";

    if (currentConversion.includes("to-")) {
      // e.g., text-to-binary -> binary-to-text
      const [from, to] = currentConversion.split("-to-");
      oppositeConversion = `${to}-to-${from}`;
    } else if (currentConversion === "binary-translator") {
      // No direct opposite
      oppositeConversion = "binary-translator";
    } else if (currentConversion === "binary-decoder") {
      // No direct opposite
      oppositeConversion = "text-to-binary";
    } else {
      // Default fallback
      oppositeConversion = "text-to-binary";
    }

    // Check if the opposite conversion exists
    if (conversions[oppositeConversion]) {
      // Swap input and output values
      setInputValue(outputValue);
      setOutputValue(inputValue);
      setConversionType(oppositeConversion);
    }
  };

  const getTitle = () => {
    return conversions[conversionType]?.title || "Binary Converter";
  };

  const getDescription = () => {
    const descriptions: { [key: string]: string } = {
      "text-to-binary": "Convert plain text into binary code (0s and 1s) with our easy-to-use text to binary converter. Perfect for learning about binary encoding or preparing data for binary systems.",
      "binary-to-text": "Transform binary code back into readable text with our binary to text converter. Quickly decode binary messages, verify binary translations, or convert binary data for human readability.",
      "binary-to-hex": "Convert binary numbers to hexadecimal format effortlessly. Our binary to hex converter streamlines calculations for programming, computer science work, or digital system design.",
      "hex-to-binary": "Transform hexadecimal values into their binary equivalents with precision. Our hex to binary converter is essential for programming, data analysis, and understanding digital representations.",
      "binary-to-ascii": "Convert binary code into ASCII decimal values instantly. This converter helps in understanding the relationship between binary and ASCII numeric representations.",
      "ascii-to-binary": "Transform ASCII decimal values into binary code with ease. Perfect for computer science education, programming tasks, and digital communication development.",
      "binary-to-decimal": "Convert binary numbers to their decimal equivalents quickly and accurately. Essential for computer science students, programmers, and anyone working with different number systems.",
      "decimal-to-binary": "Transform decimal numbers into binary format with precision. Our converter is ideal for programming, computer science education, and working with digital systems.",
      "text-to-ascii": "Convert plain text to ASCII decimal values to understand character encoding. This tool reveals the numeric codes behind every character in your text.",
      "decimal-to-hex": "Convert decimal numbers to hexadecimal format instantly. Perfect for programming, color codes, memory addresses, and digital system design.",
      "binary-translator": "Translate between human text and binary code in both directions. Our binary translator makes binary communication accessible to everyone.",
      "english-to-binary": "Convert English text into binary representation. Perfect for creating binary messages, coding projects, or learning about data representation.",
      "binary-to-english": "Transform binary code back into readable English text. Decode binary messages and make binary data human-readable instantly.",
      "binary-decoder": "Decode binary data into various formats including text, decimal, and hexadecimal. Our comprehensive decoder handles multiple binary conversion needs.",
      "hex-to-text": "Convert hexadecimal values to readable text with our convenient hex to text converter. Decode hex data for programming, security analysis, and data recovery.",
      "ascii-to-text": "Transform ASCII decimal values into readable text characters. Perfect for decoding ASCII data streams or understanding character encoding."
    };

    return descriptions[conversionType] || "Convert between binary, text, and various numeric formats with our comprehensive binary conversion tool suite. Perfect for programming, education, and data transformation tasks.";
  };

  const getHowToUse = () => {
    return [
      `Select "${getTitle()}" from the conversion type dropdown`,
      "Enter your input in the top text area",
      "The conversion happens automatically as you type",
      "View the converted output in the bottom text area",
      "Use the Swap button to reverse the conversion direction",
      "Click Reset to clear both input and output fields"
    ];
  };

  const getFeatures = () => {
    return [
      "Instant real-time conversion as you type",
      "Support for multiple encoding formats (binary, text, ASCII, hexadecimal, decimal)",
      "Clean and intuitive user interface",
      "Error handling for invalid inputs",
      "Bidirectional conversion capability",
      "Space-preserved binary format for better readability",
      "Mobile-friendly design for conversions on any device"
    ];
  };

  const getFaqs = () => {
    const generalFaqs = [
      {
        question: "What is binary code?",
        answer: "Binary code is a system that represents text, instructions, or any other data using a two-symbol system, typically 0 and 1. It's the most basic language computers understand, where each digit is called a bit. Eight bits make a byte, which often represents one character in text encoding systems like ASCII or UTF-8."
      },
      {
        question: "Why would I need to convert between binary and other formats?",
        answer: "Binary conversion is useful for programming, computer science education, data analysis, cryptography, and digital communication. Understanding how data is encoded at the binary level provides insights into how computers store and process information. It's also helpful for debugging, working with low-level systems, or creating binary art and messages."
      },
      {
        question: "How accurate is this binary converter?",
        answer: "Our binary converter implements standard encoding algorithms with careful handling of edge cases. It accurately converts between binary and other formats according to common encoding standards. However, very large inputs may be subject to browser limitations, and certain special characters or extended Unicode may require additional handling in some conversion types."
      }
    ];

    const specificFaqs: { [key: string]: Array<{ question: string; answer: string }> } = {
      "text-to-binary": [
        {
          question: "How is text converted to binary?",
          answer: "Each character in text is converted to its ASCII or Unicode numeric value, then that value is converted to its binary representation. For example, the letter 'A' has the ASCII value 65, which in binary is 01000001. Our converter uses 8-bit binary by default (padded with leading zeros when needed) for consistent representation."
        },
        {
          question: "Why are there spaces between the binary numbers?",
          answer: "We add spaces between each 8-bit binary sequence for readability, helping you distinguish one character from another. This makes it easier to verify or manipulate the binary output. Without spaces, a string like 'hi' would be 0110100001101001 instead of the more readable 01101000 01101001."
        }
      ],
      "binary-to-text": [
        {
          question: "What happens if I enter invalid binary?",
          answer: "Our converter ignores non-binary characters (anything other than 0s, 1s, and spaces). If binary sequences are invalid or don't correspond to valid character codes, they might produce unexpected characters or be skipped. For best results, ensure your binary input consists of 8-bit sequences (8 binary digits representing one byte) separated by spaces."
        },
        {
          question: "Can this converter handle binary data that doesn't represent text?",
          answer: "This converter is primarily designed for text-based binary conversions. While it can process any binary sequence into corresponding character codes, binary data representing non-text information (like images or executables) will produce seemingly random or unreadable text when converted."
        }
      ]
    };

    // Return general FAQs plus any specific ones for this conversion type
    return [...(specificFaqs[conversionType] || []), ...generalFaqs];
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="conversionType">Conversion Type</Label>
              <Select
                value={conversionType}
                onValueChange={(value) => {
                  setConversionType(value);
                  // Clear the fields when changing conversion type
                  setInputValue("");
                  setOutputValue("");
                }}
              >
                <SelectTrigger id="conversionType" className="mt-1.5">
                  <SelectValue placeholder="Select conversion type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(conversions).map((key) => (
                    <SelectItem key={key} value={key}>
                      {conversions[key].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="inputText">Input</Label>
              <Textarea
                id="inputText"
                placeholder={`Enter ${conversionType.split("-to-")[0]} to convert...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1.5 min-h-24"
              />
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwap}
                className="flex items-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Swap</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2v6h6"></path>
                  <path d="M3 8L12 17"></path>
                  <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                  <path d="M21 22v-6h-6"></path>
                  <path d="M21 16L12 7"></path>
                  <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                </svg>
                <span>Reset</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handleConvert}
                className="flex items-center space-x-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 10 4 15 9 20"></polyline>
                  <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                </svg>
                <span>Convert</span>
              </Button>
            </div>

            <div>
              <Label htmlFor="outputText">Output</Label>
              <Textarea
                id="outputText"
                value={outputValue}
                readOnly
                className="mt-1.5 min-h-24 bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Binary Conversion</h3>
          <div className="text-sm space-y-4">
            <p>
              Binary is the most fundamental language of computing, consisting solely of 0s and 1s. Each binary digit (or "bit") represents one of two possible states: on/off, true/false, or yes/no.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Conversions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-mono">A</span> in ASCII is 65, which in binary is <span className="font-mono">01000001</span></li>
                <li><span className="font-mono">01001000 01101001</span> in binary converts to the text <span className="font-mono">Hi</span></li>
                <li>The decimal number <span className="font-mono">42</span> in binary is <span className="font-mono">00101010</span></li>
                <li>The binary <span className="font-mono">11111111</span> in decimal is <span className="font-mono">255</span></li>
                <li>The binary <span className="font-mono">11111111</span> in hexadecimal is <span className="font-mono">FF</span></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Get the relevant title, description, etc. based on the current conversion type
  const title = getTitle();
  const description = getDescription();
  const howToUse = getHowToUse();
  const features = getFeatures();
  const faqs = getFaqs();

  return (
    <ToolPageTemplate
      toolSlug={conversionType}
      toolContent={
        <ToolContentTemplate
          introduction={`Effortlessly convert between ${title.toLowerCase()} formats with our powerful online converter.`}
          description={description}
          howToUse={howToUse}
          features={features}
          faqs={faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default BinaryConverterDetailed;