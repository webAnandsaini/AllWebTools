import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RomanNumeralsDateConverterDetailed: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [romanDate, setRomanDate] = useState<string>("");
  const [conversionType, setConversionType] = useState<string>("date-to-roman");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Function to convert a number to Roman numerals
  const convertToRoman = (num: number): string => {
    if (num <= 0 || num > 3999) {
      throw new Error("Roman numerals can only represent numbers from 1 to 3999");
    }

    const romanNumerals: [number, string][] = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];

    let result = "";
    
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    
    return result;
  };

  // Function to convert Roman numerals to number
  const convertFromRoman = (roman: string): number => {
    const romanNumerals: Record<string, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let result = 0;
    
    for (let i = 0; i < roman.length; i++) {
      const current = romanNumerals[roman[i]];
      const next = i + 1 < roman.length ? romanNumerals[roman[i + 1]] : 0;
      
      if (current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    
    return result;
  };

  // Convert date to Roman numerals
  const convertDateToRoman = () => {
    try {
      if (!date) {
        setError("Please enter a date");
        return;
      }

      const dateObj = new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        setError("Invalid date format");
        return;
      }
      
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      
      const romanDay = convertToRoman(day);
      const romanMonth = convertToRoman(month);
      const romanYear = convertToRoman(year);
      
      setResult(`Date: ${dateObj.toLocaleDateString()}\nRoman Numerals: ${romanDay}.${romanMonth}.${romanYear}`);
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
    }
  };

  // Convert Roman numerals to date
  const convertRomanToDate = () => {
    try {
      if (!romanDate) {
        setError("Please enter Roman numerals");
        return;
      }
      
      const parts = romanDate.split(".");
      
      if (parts.length !== 3) {
        setError("Invalid format. Please use format like 'XX.IV.MMXXIII'");
        return;
      }
      
      const day = convertFromRoman(parts[0]);
      const month = convertFromRoman(parts[1]);
      const year = convertFromRoman(parts[2]);
      
      if (day < 1 || day > 31) {
        setError("Invalid day. Must be between 1 and 31");
        return;
      }
      
      if (month < 1 || month > 12) {
        setError("Invalid month. Must be between 1 and 12");
        return;
      }
      
      const dateObj = new Date(year, month - 1, day);
      
      if (isNaN(dateObj.getTime())) {
        setError("Invalid date");
        return;
      }
      
      setResult(`Roman Numerals: ${parts.join(".")}\nDate: ${dateObj.toLocaleDateString()}`);
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
    }
  };

  // Handle conversion
  const handleConvert = () => {
    if (conversionType === "date-to-roman") {
      convertDateToRoman();
    } else {
      convertRomanToDate();
    }
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
                  setResult("");
                  setError("");
                }}
              >
                <SelectTrigger id="conversionType" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-to-roman">Date to Roman Numerals</SelectItem>
                  <SelectItem value="roman-to-date">Roman Numerals to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {conversionType === "date-to-roman" ? (
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="romanDate">Roman Numerals Date (Format: DD.MM.YYYY)</Label>
                <Input
                  id="romanDate"
                  type="text"
                  placeholder="e.g., XX.IV.MMXXIII"
                  value={romanDate}
                  onChange={(e) => setRomanDate(e.target.value.toUpperCase())}
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use format like XX.IV.MMXXIII for day.month.year
                </p>
              </div>
            )}

            <Button variant="default" onClick={handleConvert} className="w-full">
              Convert
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 rounded-md bg-green-50 text-green-700 font-medium whitespace-pre-line">
                {result}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Roman Numerals Date Converter</h3>
          <div className="text-sm space-y-4">
            <p>
              Our Roman Numerals Date Converter allows you to convert between standard dates and Roman numeral format.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Creating unique date formats for special occasions</li>
                <li>Understanding historical dates written in Roman numerals</li>
                <li>Learning about Roman numeral conversion</li>
                <li>Adding unique stylings to documents and designs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Transform dates into elegant Roman numerals or decode Roman numeral dates with our powerful converter tool.";
  
  const description = "Our Roman Numerals Date Converter allows you to effortlessly convert standard dates (like 04/30/2023) into Roman numeral format (IV.IV.MMXXIII) and vice versa. Perfect for creating unique date representations for special occasions, understanding historical dates, or adding a classical touch to your documents. This tool supports dates from year 1 to 3999 and follows standard Roman numeral notation rules.";
  
  const howToUse = [
    "Select the conversion direction: Date to Roman Numerals or Roman Numerals to Date",
    "For Date to Roman conversion: Select a date from the calendar",
    "For Roman to Date conversion: Enter the Roman numerals in day.month.year format (e.g., XX.IV.MMXXIII)",
    "Click 'Convert' to see the results instantly",
    "Copy the converted format for your use"
  ];
  
  const features = [
    "✅ Bi-directional conversion between dates and Roman numerals",
    "✅ Easy-to-use interface with clear instructions",
    "✅ Support for the full range of convertible dates (1-3999 CE)",
    "✅ Proper formatting with period separators for day, month, and year",
    "✅ Instant results with clear display of both formats"
  ];
  
  const faqs = [
    {
      question: "What are Roman numerals?",
      answer: "Roman numerals are a number system that originated in ancient Rome using combinations of letters from the Latin alphabet (I, V, X, L, C, D, M) to represent numbers. For example, I represents 1, V is 5, X is 10, L is 50, C is 100, D is 500, and M is 1000."
    },
    {
      question: "How do I input dates for conversion to Roman numerals?",
      answer: "Simply use our date picker to select the date you want to convert. The tool will automatically format it into Roman numerals with the day, month, and year separated by periods."
    },
    {
      question: "How should I format Roman numeral dates for conversion?",
      answer: "Enter Roman numeral dates in the format of day.month.year separated by periods. For example, April 30, 2023, would be entered as XXX.IV.MMXXIII."
    },
    {
      question: "Why would I need to convert dates to Roman numerals?",
      answer: "Roman numeral dates add a classical, elegant touch to wedding invitations, anniversary celebrations, formal documents, historical recreations, and creative designs. They're also useful for understanding dates on historical monuments and documents."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="roman-numerals-date-converter"
      toolContent={
        <ToolContentTemplate
          introduction={introduction}
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

export default RomanNumeralsDateConverterDetailed;