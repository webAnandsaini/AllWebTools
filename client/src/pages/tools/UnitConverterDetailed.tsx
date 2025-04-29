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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const UnitConverterDetailed = () => {
  const [activeTab, setActiveTab] = useState("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  // Define conversion units and factors for each category
  const unitTypes = {
    length: {
      units: [
        { name: "Meter", abbr: "m", factor: 1 },
        { name: "Kilometer", abbr: "km", factor: 0.001 },
        { name: "Centimeter", abbr: "cm", factor: 100 },
        { name: "Millimeter", abbr: "mm", factor: 1000 },
        { name: "Inch", abbr: "in", factor: 39.37008 },
        { name: "Foot", abbr: "ft", factor: 3.28084 },
        { name: "Yard", abbr: "yd", factor: 1.09361 },
        { name: "Mile", abbr: "mi", factor: 0.000621371 },
      ],
      defaultFrom: "m",
      defaultTo: "cm",
    },
    weight: {
      units: [
        { name: "Kilogram", abbr: "kg", factor: 1 },
        { name: "Gram", abbr: "g", factor: 1000 },
        { name: "Milligram", abbr: "mg", factor: 1000000 },
        { name: "Ton", abbr: "t", factor: 0.001 },
        { name: "Pound", abbr: "lb", factor: 2.20462 },
        { name: "Ounce", abbr: "oz", factor: 35.274 },
        { name: "Stone", abbr: "st", factor: 0.157473 },
      ],
      defaultFrom: "kg",
      defaultTo: "g",
    },
    volume: {
      units: [
        { name: "Liter", abbr: "L", factor: 1 },
        { name: "Milliliter", abbr: "mL", factor: 1000 },
        { name: "Cubic Meter", abbr: "m³", factor: 0.001 },
        { name: "Gallon (US)", abbr: "gal", factor: 0.264172 },
        { name: "Quart (US)", abbr: "qt", factor: 1.05669 },
        { name: "Pint (US)", abbr: "pt", factor: 2.11338 },
        { name: "Cup (US)", abbr: "cup", factor: 4.22675 },
        { name: "Fluid Ounce (US)", abbr: "fl oz", factor: 33.814 },
        { name: "Tablespoon (US)", abbr: "tbsp", factor: 67.628 },
        { name: "Teaspoon (US)", abbr: "tsp", factor: 202.884 },
      ],
      defaultFrom: "L",
      defaultTo: "mL",
    },
    area: {
      units: [
        { name: "Square Meter", abbr: "m²", factor: 1 },
        { name: "Square Kilometer", abbr: "km²", factor: 0.000001 },
        { name: "Square Centimeter", abbr: "cm²", factor: 10000 },
        { name: "Square Millimeter", abbr: "mm²", factor: 1000000 },
        { name: "Square Inch", abbr: "in²", factor: 1550.0031 },
        { name: "Square Foot", abbr: "ft²", factor: 10.7639 },
        { name: "Square Yard", abbr: "yd²", factor: 1.19599 },
        { name: "Acre", abbr: "ac", factor: 0.000247105 },
        { name: "Hectare", abbr: "ha", factor: 0.0001 },
      ],
      defaultFrom: "m²",
      defaultTo: "cm²",
    },
    temperature: {
      units: [
        { name: "Celsius", abbr: "°C", factor: 1 },
        { name: "Fahrenheit", abbr: "°F", factor: 33.8 },
        { name: "Kelvin", abbr: "K", factor: 274.15 },
      ],
      defaultFrom: "°C",
      defaultTo: "°F",
      // Special case - will handle with custom formulas
    },
  };

  useEffect(() => {
    // Set default from/to units when tab changes
    const category = unitTypes[activeTab as keyof typeof unitTypes];
    if (category) {
      setFromUnit(category.defaultFrom);
      setToUnit(category.defaultTo);
    }
  }, [activeTab]);
  
  useEffect(() => {
    // Calculate result whenever input value or units change
    if (fromUnit && toUnit) {
      convertUnit();
    }
  }, [inputValue, fromUnit, toUnit]);

  useEffect(() => {
    // Calculate result whenever input value or units change
    if (fromUnit && toUnit) {
      convertUnit();
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertUnit = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult("Please enter a valid number");
      setFormula("");
      return;
    }

    const value = parseFloat(inputValue);
    const category = unitTypes[activeTab as keyof typeof unitTypes];
    
    // Handle special case for temperature
    if (activeTab === "temperature") {
      const tempResult = convertTemperature(value, fromUnit, toUnit);
      setResult(tempResult.result);
      setFormula(tempResult.formula);
      return;
    }

    if (category) {
      const fromUnitObj = category.units.find(u => u.abbr === fromUnit);
      const toUnitObj = category.units.find(u => u.abbr === toUnit);

      if (fromUnitObj && toUnitObj) {
        // Convert to base unit, then to target unit
        const baseValue = value / fromUnitObj.factor;
        const result = baseValue * toUnitObj.factor;
        
        // Format the result with appropriate precision
        let formattedResult: string;
        if (result < 0.01) {
          formattedResult = result.toExponential(6);
        } else if (result >= 1000000) {
          formattedResult = result.toExponential(6);
        } else {
          formattedResult = result.toPrecision(7).replace(/\.?0+$/, "");
        }
        
        setResult(formattedResult);
        
        // Create formula explanation
        const formula = `${value} ${fromUnitObj.name} = ${formattedResult} ${toUnitObj.name}`;
        setFormula(formula);
      }
    }
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let result: number;
    let formula: string;

    // Convert to Celsius first (as base unit)
    let celsius: number;
    
    if (from === "°C") {
      celsius = value;
    } else if (from === "°F") {
      celsius = (value - 32) * (5/9);
      formula = `(${value}°F - 32) × 5/9 = ${celsius.toFixed(4)}°C`;
    } else { // Kelvin
      celsius = value - 273.15;
      formula = `${value}K - 273.15 = ${celsius.toFixed(4)}°C`;
    }

    // Convert from Celsius to target unit
    if (to === "°C") {
      result = celsius;
      if (from === "°C") {
        formula = `${value}°C = ${result.toFixed(4)}°C`;
      }
    } else if (to === "°F") {
      result = (celsius * 9/5) + 32;
      if (from === "°C") {
        formula = `(${value}°C × 9/5) + 32 = ${result.toFixed(4)}°F`;
      } else if (from === "°F") {
        formula = `${value}°F = ${result.toFixed(4)}°F`;
      } else { // from Kelvin
        formula = `(${value}K - 273.15) × 9/5 + 32 = ${result.toFixed(4)}°F`;
      }
    } else { // Kelvin
      result = celsius + 273.15;
      if (from === "°C") {
        formula = `${value}°C + 273.15 = ${result.toFixed(4)}K`;
      } else if (from === "°F") {
        formula = `(${value}°F - 32) × 5/9 + 273.15 = ${result.toFixed(4)}K`;
      } else { // from Kelvin
        formula = `${value}K = ${result.toFixed(4)}K`;
      }
    }

    // Format the result based on magnitude
    let formattedResult: string;
    if (Math.abs(result) < 0.01 && result !== 0) {
      formattedResult = result.toExponential(6);
    } else {
      formattedResult = result.toFixed(4).replace(/\.?0+$/, "");
    }

    return { result: formattedResult, formula };
  };

  const handleReset = () => {
    setInputValue("1");
    const category = unitTypes[activeTab as keyof typeof unitTypes];
    if (category) {
      setFromUnit(category.defaultFrom);
      setToUnit(category.defaultTo);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getCategoryName = (key: string): string => {
    const categoryNames: { [key: string]: string } = {
      length: "Length",
      weight: "Weight",
      volume: "Volume",
      area: "Area",
      temperature: "Temperature"
    };
    return categoryNames[key] || key;
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs 
            defaultValue="length" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="length">Length</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
            </TabsList>

            {Object.keys(unitTypes).map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
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
                          <SelectValue placeholder={`Select ${getCategoryName(category)} Unit`} />
                        </SelectTrigger>
                        <SelectContent>
                          {unitTypes[category as keyof typeof unitTypes].units.map((unit) => (
                            <SelectItem key={unit.abbr} value={unit.abbr}>
                              {unit.name} ({unit.abbr})
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
                          <SelectValue placeholder={`Select ${getCategoryName(category)} Unit`} />
                        </SelectTrigger>
                        <SelectContent>
                          {unitTypes[category as keyof typeof unitTypes].units.map((unit) => (
                            <SelectItem key={unit.abbr} value={unit.abbr}>
                              {unit.name} ({unit.abbr})
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Common Conversion Formulas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Length</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 meter = 100 centimeters</li>
                <li>1 meter = 3.28084 feet</li>
                <li>1 kilometer = 0.621371 miles</li>
                <li>1 inch = 2.54 centimeters</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Weight</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 kilogram = 2.20462 pounds</li>
                <li>1 kilogram = 1000 grams</li>
                <li>1 pound = 16 ounces</li>
                <li>1 stone = 14 pounds</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Temperature</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>°F = (°C × 9/5) + 32</li>
                <li>°C = (°F - 32) × 5/9</li>
                <li>K = °C + 273.15</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Volume</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 liter = 1000 milliliters</li>
                <li>1 liter = 0.264172 gallons (US)</li>
                <li>1 gallon (US) = 3.78541 liters</li>
                <li>1 cup (US) = 236.588 milliliters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="unit-converter-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Convert between different units of measurement instantly with our comprehensive Unit Converter tool."
          description="Our Unit Converter is a versatile tool designed to help you convert between various units of measurement with precision and ease. Whether you need to convert length, weight, volume, area, or temperature, our tool provides accurate conversions across metric, imperial, and other measurement systems. Perfect for students, professionals, DIY enthusiasts, or anyone needing quick and reliable unit conversions for daily tasks or specialized projects."
          howToUse={[
            "Select the type of conversion you need (length, weight, volume, area, or temperature)",
            "Enter the value you want to convert in the input field",
            "Choose the unit you're converting from in the 'From' dropdown",
            "Select the unit you want to convert to in the 'To' dropdown",
            "View your conversion result displayed instantly",
            "Use the swap button to quickly reverse the conversion direction",
            "Click the reset button to start a new conversion"
          ]}
          features={[
            "Comprehensive coverage of length, weight, volume, area, and temperature conversions",
            "Support for both metric and imperial measurement systems",
            "Instant conversion with real-time result updates",
            "Clear display of conversion formulas for educational purposes",
            "Simple unit swapping feature to reverse conversions quickly",
            "Mobile-friendly interface that works on any device",
            "Precise calculations with appropriate decimal precision"
          ]}
          faqs={[
            {
              question: "How accurate are the unit conversions?",
              answer: "Our Unit Converter uses standard conversion factors and provides results with appropriate precision for each unit type. For most everyday purposes, the conversions are accurate to several decimal places. For scientific or highly precise work, please verify with specialized tools."
            },
            {
              question: "Can I convert between metric and imperial units?",
              answer: "Yes, you can easily convert between metric units (like meters, kilograms, liters) and imperial units (like feet, pounds, gallons). Our tool supports cross-system conversions for all measurement categories."
            },
            {
              question: "Why do temperature conversions use different formulas?",
              answer: "Unlike other unit types, temperature scales (Celsius, Fahrenheit, and Kelvin) don't have a simple multiplicative relationship. Each scale has a different zero point and scale factor, requiring specific formulas for accurate conversion between them."
            },
            {
              question: "Is there a limit to how large or small the numbers can be?",
              answer: "The converter can handle a wide range of values, from very small to very large. For extremely large or small numbers, the result will be displayed in scientific notation (e.g., 1.23e+6 for 1,230,000) for better readability."
            },
            {
              question: "Can I use this tool offline?",
              answer: "Our Unit Converter runs entirely in your browser. Once the page has loaded, you can use the tool without an internet connection. However, you'll need to keep the browser tab open, as refreshing would require reconnecting to load the page again."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default UnitConverterDetailed;