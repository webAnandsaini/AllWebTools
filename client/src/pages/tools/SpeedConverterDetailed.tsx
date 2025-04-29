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

const SpeedConverterDetailed = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("mps");
  const [toUnit, setToUnit] = useState<string>("kmph");
  const [result, setResult] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  // Define speed units with conversion factors to meters per second (base unit)
  const speedUnits = [
    { name: "Meter per second (m/s)", value: "mps", factor: 1 },
    { name: "Kilometer per hour (km/h)", value: "kmph", factor: 3.6 },
    { name: "Mile per hour (mph)", value: "mph", factor: 2.23694 },
    { name: "Foot per second (ft/s)", value: "fps", factor: 3.28084 },
    { name: "Knot (kn)", value: "knot", factor: 1.94384 },
    { name: "Speed of sound (Mach)", value: "mach", factor: 0.00293858 }, // At sea level, 20°C
    { name: "Speed of light (c)", value: "c", factor: 3.33564e-9 },
    { name: "Centimeter per second (cm/s)", value: "cmps", factor: 100 },
    { name: "Kilometer per second (km/s)", value: "kmps", factor: 0.001 },
    { name: "Mile per second (mi/s)", value: "mips", factor: 0.000621371 },
  ];

  useEffect(() => {
    // Calculate result whenever input value or units change
    if (fromUnit && toUnit) {
      convertSpeed();
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertSpeed = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult("Please enter a valid number");
      setFormula("");
      return;
    }

    const value = parseFloat(inputValue);
    
    const fromUnitObj = speedUnits.find(u => u.value === fromUnit);
    const toUnitObj = speedUnits.find(u => u.value === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (meters per second), then to target unit
      const baseValue = value / fromUnitObj.factor;
      const result = baseValue * toUnitObj.factor;
      
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
      let unitNameFrom = fromUnitObj.name.split(' ')[0];
      let unitNameTo = toUnitObj.name.split(' ')[0];
      
      const formula = `${value} ${unitNameFrom} = ${formattedResult} ${unitNameTo}`;
      setFormula(formula);
    }
  };

  const handleReset = () => {
    setInputValue("1");
    setFromUnit("mps");
    setToUnit("kmph");
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
                      <SelectValue placeholder="Select Speed Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {speedUnits.map((unit) => (
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
                      <SelectValue placeholder="Select Speed Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {speedUnits.map((unit) => (
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
          <h3 className="text-lg font-medium mb-4">Speed Reference Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Common Speed Conversions</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 m/s = 3.6 km/h</li>
                <li>1 m/s = 2.23694 mph</li>
                <li>1 km/h = 0.621371 mph</li>
                <li>1 mph = 1.60934 km/h</li>
                <li>1 knot = 1.852 km/h</li>
                <li>1 knot = 1.15078 mph</li>
                <li>1 foot/second = 0.3048 m/s</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Notable Speed References</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Speed of light in vacuum: 299,792,458 m/s</li>
                <li>Speed of sound in air (sea level, 20°C): ~343 m/s</li>
                <li>Typical walking speed: 1.4 m/s (5 km/h)</li>
                <li>Average highway speed limit: 65-75 mph (105-120 km/h)</li>
                <li>Commercial aircraft cruising speed: ~250 m/s (900 km/h)</li>
                <li>International Space Station orbital speed: ~7.66 km/s</li>
                <li>Earth's orbital speed around the Sun: ~29.78 km/s</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Did You Know?</h4>
            <p className="text-blue-700 mt-1">
              The knot, a unit used primarily in maritime and aviation contexts, has an interesting history. One knot equals one nautical mile per hour (1.852 km/h). The term comes from the old method of measuring a ship's speed by using a device called a "common log"—a rope with knots at regular intervals thrown overboard with a log attached to create drag. Sailors would count how many knots paid out in a specific time period to determine the ship's speed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="speed-converter"
      toolContent={
        <ToolContentTemplate
          introduction="Convert between different units of speed with precision using our comprehensive Speed Converter tool."
          description="Our Speed Converter is a powerful, user-friendly tool designed to convert between various units of speed with exceptional accuracy. From everyday units like miles per hour and kilometers per hour to specialized scientific units such as Mach and the speed of light, this converter handles speed conversions across all scales. Whether you're working on transportation logistics, scientific calculations, aviation planning, or simply satisfying your curiosity about speed relationships, this tool provides instant, precise conversions with clear explanations of the conversion process."
          howToUse={[
            "Enter the numeric value you want to convert in the input field",
            "Select the source speed unit from the 'From' dropdown menu",
            "Choose the target speed unit from the 'To' dropdown menu",
            "View your conversion result displayed instantly below",
            "Use the swap button to quickly reverse the conversion direction",
            "Click reset to start a new conversion with default values",
            "Review the conversion formula shown beneath your result for reference"
          ]}
          features={[
            "Comprehensive coverage of speed units from centimeters per second to the speed of light",
            "Support for specialized units like knots and Mach numbers",
            "Instant conversion with real-time result updates",
            "Clear display of conversion formulas for educational purposes",
            "Simple unit swapping feature to reverse conversions quickly",
            "Mobile-friendly interface that works on any device",
            "Notable speed references for practical context"
          ]}
          faqs={[
            {
              question: "What is a knot and how does it compare to other speed units?",
              answer: "A knot is a unit of speed equal to one nautical mile per hour, approximately 1.15078 miles per hour or 1.852 kilometers per hour. It's primarily used in maritime and aviation contexts. The term originated from the historical method of measuring a ship's speed using a log line with knots tied at regular intervals."
            },
            {
              question: "How accurate is the Mach number conversion?",
              answer: "Our converter uses the standard value for Mach 1 of approximately 343 meters per second (1,235 km/h or 767 mph), which is the speed of sound in dry air at sea level and 20°C (68°F). However, the actual speed of sound varies with altitude, temperature, and humidity. For precise aeronautical calculations, specialized tools that account for these variables may be required."
            },
            {
              question: "Why would I need to convert to the speed of light?",
              answer: "Converting to the speed of light (c) is primarily useful for educational purposes, physics calculations, or understanding relativistic effects. It allows you to express speeds as a fraction of c, which is important in relativity theory. For example, seeing that even our fastest spacecraft travel at only a tiny fraction of the speed of light helps illustrate the vast scales involved in space exploration."
            },
            {
              question: "Can I use this converter for vehicle speedometer conversions?",
              answer: "Yes, this tool is perfect for converting between the common speedometer units of miles per hour (mph) and kilometers per hour (km/h). This is particularly useful when driving in countries that use different measurement systems or when interpreting speed limits on international trips."
            },
            {
              question: "How do I interpret scientific notation in the results?",
              answer: "For very large or very small conversion results, we display numbers in scientific notation (e.g., 3.33e-9). This format represents the number multiplied by 10 raised to the power shown. For example, 3.33e-9 means 3.33 × 10^-9 or 0.00000000333. This notation makes very large or small numbers more readable while maintaining precision."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default SpeedConverterDetailed;