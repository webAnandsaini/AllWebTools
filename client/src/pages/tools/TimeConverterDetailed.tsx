import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimeConverterDetailed = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("hour");
  const [toUnit, setToUnit] = useState<string>("minute");
  const [result, setResult] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  // Define time units with conversion factors to seconds (base unit)
  const timeUnits = [
    { name: "Nanosecond", value: "nanosecond", factor: 1e-9 },
    { name: "Microsecond", value: "microsecond", factor: 1e-6 },
    { name: "Millisecond", value: "millisecond", factor: 0.001 },
    { name: "Second", value: "second", factor: 1 },
    { name: "Minute", value: "minute", factor: 60 },
    { name: "Hour", value: "hour", factor: 3600 },
    { name: "Day", value: "day", factor: 86400 },
    { name: "Week", value: "week", factor: 604800 },
    { name: "Month (avg)", value: "month", factor: 2629800 }, // Average month (30.44 days)
    { name: "Year (common)", value: "year", factor: 31536000 }, // Common year (365 days)
    { name: "Decade", value: "decade", factor: 315360000 },
    { name: "Century", value: "century", factor: 3153600000 },
  ];

  useEffect(() => {
    // Calculate result whenever input value or units change
    if (fromUnit && toUnit) {
      convertTime();
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertTime = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult("Please enter a valid number");
      setFormula("");
      return;
    }

    const value = parseFloat(inputValue);
    
    const fromUnitObj = timeUnits.find(u => u.value === fromUnit);
    const toUnitObj = timeUnits.find(u => u.value === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (seconds), then to target unit
      const baseValue = value * fromUnitObj.factor;
      const result = baseValue / toUnitObj.factor;
      
      // Format the result with appropriate precision
      let formattedResult: string;
      if (result < 0.01 && result > 0) {
        formattedResult = result.toExponential(6);
      } else if (result >= 1000000) {
        formattedResult = result.toExponential(6);
      } else {
        formattedResult = result.toPrecision(7).replace(/\.?0+$/, "");
      }
      
      setResult(formattedResult);
      
      // Create formula explanation
      const formula = `${value} ${fromUnitObj.name}${value !== 1 ? 's' : ''} = ${formattedResult} ${toUnitObj.name}${parseFloat(formattedResult) !== 1 ? 's' : ''}`;
      setFormula(formula);
    }
  };

  const handleReset = () => {
    setInputValue("1");
    setFromUnit("hour");
    setToUnit("minute");
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inputValue">Value</Label>
                  <Input
                    id="inputValue"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fromUnit">From</Label>
                  <Select
                    value={fromUnit}
                    onValueChange={setFromUnit}
                  >
                    <SelectTrigger id="fromUnit" className="mt-1">
                      <SelectValue placeholder="Select Time Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center h-10">
                  <Button 
                    variant="outline" 
                    onClick={swapUnits}
                    className="rounded-full p-2 w-10 h-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span className="sr-only">Swap Units</span>
                  </Button>
                </div>
                <div>
                  <Label htmlFor="toUnit">To</Label>
                  <Select
                    value={toUnit}
                    onValueChange={setToUnit}
                  >
                    <SelectTrigger id="toUnit" className="mt-1">
                      <SelectValue placeholder="Select Time Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <Label className="mb-2 block">Result</Label>
                <div className="text-2xl font-bold text-primary">{result}</div>
                {formula && <div className="text-sm text-gray-500 mt-2">{formula}</div>}
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Common Time Conversion References</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Standard Time Conversions</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 minute = 60 seconds</li>
                <li>1 hour = 60 minutes = 3,600 seconds</li>
                <li>1 day = 24 hours = 1,440 minutes</li>
                <li>1 week = 7 days = 168 hours</li>
                <li>1 month (avg) = 30.44 days</li>
                <li>1 year (common) = 365 days = 8,760 hours</li>
                <li>1 year (leap) = 366 days = 8,784 hours</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Small Time Units</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 second = 1,000 milliseconds</li>
                <li>1 millisecond = 1,000 microseconds</li>
                <li>1 microsecond = 1,000 nanoseconds</li>
              </ul>
              
              <h4 className="font-medium mt-4">Large Time Units</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 decade = 10 years</li>
                <li>1 century = 100 years</li>
                <li>1 millennium = 1,000 years</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Did You Know?</h4>
            <p className="text-blue-700 mt-1">
              Time measurements vary across cultures and throughout history. The ancient Egyptians were one of the first civilizations to divide the day into 24 hours, though they used varying hour lengths depending on the season. The concept of standardized minutes and seconds came much later!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="time-converter-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Convert between different units of time with precision using our comprehensive Time Converter tool."
          description="Our Time Converter is a powerful, user-friendly tool designed to convert between various units of time with exceptional accuracy. From nanoseconds to centuries, this converter handles time units across all scales. Whether you're working on scientific calculations, scheduling projects, analyzing historical timeframes, or simply satisfying your curiosity about time relationships, this tool provides instant, precise conversions with clear explanations of the conversion process."
          howToUse={[
            "Enter the numeric value you want to convert in the input field",
            "Select the source time unit from the 'From' dropdown menu",
            "Choose the target time unit from the 'To' dropdown menu",
            "View your conversion result displayed instantly below",
            "Use the swap button to quickly reverse the conversion direction",
            "Click reset to start a new conversion with default values"
          ]}
          features={[
            "Comprehensive coverage of time units from nanoseconds to centuries",
            "Instant conversion with real-time result updates",
            "Clear display of conversion formulas for educational purposes",
            "Simple unit swapping feature to reverse conversions quickly",
            "Mobile-friendly interface that works on any device",
            "Scientific notation for very large or small conversion results",
            "Common time conversion references for quick information"
          ]}
          faqs={[
            {
              question: "How does the converter handle months and years?",
              answer: "Our converter uses standard averages for months (30.44 days) and years (365 days for common years). While these are practical for most conversions, they don't account for variations like leap years or the different lengths of calendar months. For precise calendar calculations involving specific dates, specialized calendar tools may be more appropriate."
            },
            {
              question: "Why do some conversion results appear in scientific notation?",
              answer: "Very large numbers (like converting seconds to centuries) or very small numbers (like converting days to nanoseconds) are displayed in scientific notation (e.g., 1.23e+9) for better readability. This format is standard in scientific and technical contexts when dealing with extreme scales."
            },
            {
              question: "Can I use this tool for physics or astronomy calculations?",
              answer: "Yes, our Time Converter is suitable for basic physics and astronomy calculations. It handles a wide range of time scales from very small (nanoseconds) to very large (centuries). However, for specialized scientific applications requiring extreme precision or additional units like light-years, specialized scientific calculators may be required."
            },
            {
              question: "Is the conversion result rounded?",
              answer: "The converter provides results with appropriate precision based on the magnitude of the number. Small and large numbers use scientific notation with 6 significant digits, while medium-sized numbers show up to 7 significant digits. This approach balances accuracy with readability for practical use."
            },
            {
              question: "Does this tool account for time zones or daylight saving time?",
              answer: "No, this tool performs simple unit conversions between time measurements. It doesn't handle time zone differences, daylight saving time adjustments, or calendar date calculations. For those purposes, please use a dedicated date/time calculator or time zone converter."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default TimeConverterDetailed;