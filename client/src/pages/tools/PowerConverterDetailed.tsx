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

const PowerConverterDetailed = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("watt");
  const [toUnit, setToUnit] = useState<string>("kilowatt");
  const [result, setResult] = useState<string>("");
  const [formula, setFormula] = useState<string>("");

  // Define power units with conversion factors to watts (base unit)
  const powerUnits = [
    { name: "Watt (W)", value: "watt", factor: 1 },
    { name: "Kilowatt (kW)", value: "kilowatt", factor: 0.001 },
    { name: "Megawatt (MW)", value: "megawatt", factor: 1e-6 },
    { name: "Gigawatt (GW)", value: "gigawatt", factor: 1e-9 },
    { name: "Horsepower (hp)", value: "horsepower", factor: 0.00134102 },
    { name: "Foot-pound/second", value: "ftlb_s", factor: 0.737562 },
    { name: "Calorie/second (cal/s)", value: "cal_s", factor: 0.239006 },
    { name: "BTU/hour", value: "btu_hr", factor: 3.41214 },
    { name: "Kilocalorie/hour (kcal/h)", value: "kcal_h", factor: 859.845 },
    { name: "Joule/second (J/s)", value: "joule_s", factor: 1 }, // Same as watt
    { name: "Volt-ampere (VA)", value: "va", factor: 1 }, // For AC circuits; equivalent to watt
    { name: "DBm", value: "dbm", factor: 1000 }, // Special case requiring logarithmic conversion
  ];

  useEffect(() => {
    // Calculate result whenever input value or units change
    if (fromUnit && toUnit) {
      convertPower();
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertPower = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setResult("Please enter a valid number");
      setFormula("");
      return;
    }

    const value = parseFloat(inputValue);
    
    // Special case for dBm (logarithmic unit)
    if (fromUnit === "dbm" || toUnit === "dbm") {
      const result = convertWithDBm(value, fromUnit, toUnit);
      setResult(result.result);
      setFormula(result.formula);
      return;
    }
    
    const fromUnitObj = powerUnits.find(u => u.value === fromUnit);
    const toUnitObj = powerUnits.find(u => u.value === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (watts), then to target unit
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

  // Handle dBm conversions (logarithmic scale)
  const convertWithDBm = (value: number, from: string, to: string) => {
    let result: number;
    let formula: string;
    
    // Convert from dBm to watts
    if (from === "dbm" && to !== "dbm") {
      // dBm to Watts: P(W) = 10^((dBm - 30) / 10)
      const watts = Math.pow(10, (value - 30) / 10);
      
      // Convert from watts to target unit
      const toUnitObj = powerUnits.find(u => u.value === to);
      if (toUnitObj) {
        result = watts * toUnitObj.factor;
        formula = `${value} dBm = 10^((${value} - 30) / 10) = ${watts.toExponential(6)} W = ${result.toPrecision(7)} ${toUnitObj.name.split(' ')[0]}`;
      } else {
        result = watts;
        formula = `${value} dBm = 10^((${value} - 30) / 10) = ${watts.toExponential(6)} W`;
      }
    }
    // Convert from watts to dBm
    else if (from !== "dbm" && to === "dbm") {
      // First convert to watts
      const fromUnitObj = powerUnits.find(u => u.value === from);
      let watts: number;
      
      if (fromUnitObj) {
        watts = value / fromUnitObj.factor;
        
        // Watts to dBm: P(dBm) = 10 * log10(P(W)) + 30
        result = 10 * Math.log10(watts) + 30;
        formula = `${value} ${fromUnitObj.name.split(' ')[0]} = ${watts.toExponential(6)} W = 10 * log10(${watts.toExponential(6)}) + 30 = ${result.toPrecision(7)} dBm`;
      } else {
        result = 0;
        formula = "Invalid unit selection";
      }
    }
    // dBm to dBm (just for completeness)
    else {
      result = value;
      formula = `${value} dBm = ${value} dBm`;
    }
    
    // Format the result
    let formattedResult: string;
    if (Math.abs(result) < 0.01 && result !== 0) {
      formattedResult = result.toExponential(6);
    } else if (Math.abs(result) >= 1000000) {
      formattedResult = result.toExponential(6);
    } else {
      formattedResult = result.toPrecision(7).replace(/\.?0+$/, "");
    }
    
    return { result: formattedResult, formula };
  };

  const handleReset = () => {
    setInputValue("1");
    setFromUnit("watt");
    setToUnit("kilowatt");
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
                      <SelectValue placeholder="Select Power Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {powerUnits.map((unit) => (
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
                      <SelectValue placeholder="Select Power Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {powerUnits.map((unit) => (
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
          <h3 className="text-lg font-medium mb-4">Power Conversion Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Common Power Conversions</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>1 kilowatt (kW) = 1,000 watts (W)</li>
                <li>1 megawatt (MW) = 1,000,000 watts (W)</li>
                <li>1 gigawatt (GW) = 1,000,000,000 watts (W)</li>
                <li>1 horsepower (hp) = 745.7 watts (W)</li>
                <li>1 watt (W) = 3.41214 BTU/hour</li>
                <li>1 watt (W) = 1 joule/second (J/s)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Understanding dBm</h4>
              <p>dBm is a logarithmic unit relative to 1 milliwatt:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>0 dBm = 1 milliwatt (mW)</li>
                <li>10 dBm = 10 milliwatts (mW)</li>
                <li>20 dBm = 100 milliwatts (mW)</li>
                <li>30 dBm = 1 watt (W)</li>
                <li>Formula: P(dBm) = 10 × log₁₀(P(mW))</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md mt-6">
            <h4 className="font-medium text-blue-800">Practical Examples</h4>
            <ul className="list-disc pl-5 space-y-1 text-blue-700 mt-2">
              <li>A typical household light bulb: 40-100 watts</li>
              <li>Microwave oven: 600-1200 watts</li>
              <li>Home electric heater: 1000-1500 watts (1-1.5 kW)</li>
              <li>Average car engine: 110-150 horsepower (82-112 kW)</li>
              <li>Small wind turbine: 1-10 kilowatts</li>
              <li>Large power plant: 1-2 gigawatts</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="power-converter-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Convert between watts, horsepower, and other power units with precision using our Power Converter tool."
          description="Our Power Converter is a comprehensive tool for converting between different units of power with exceptional accuracy. Supporting a wide range of units from watts and kilowatts to horsepower, BTU/hour, and specialized units like dBm, this converter is perfect for electrical engineers, HVAC professionals, science students, DIY enthusiasts, and anyone working with energy calculations. Whether you're designing electrical systems, analyzing energy consumption, or comparing equipment specifications, this tool provides instant and reliable power unit conversions."
          howToUse={[
            "Enter the numeric value you want to convert in the input field",
            "Select the source power unit from the 'From' dropdown menu",
            "Choose the target power unit from the 'To' dropdown menu",
            "View your conversion result displayed instantly below",
            "Use the swap button to quickly reverse the conversion direction",
            "Click reset to start a new conversion with default values",
            "Review the conversion formula shown beneath your result for reference"
          ]}
          features={[
            "Support for 12 different power units including watts, kilowatts, horsepower, and more",
            "Special handling for logarithmic units like dBm with proper formulas",
            "Instant conversion with real-time result updates",
            "Clear display of conversion formulas for educational purposes",
            "Simple unit swapping feature to reverse conversions quickly",
            "Mobile-friendly interface that works on any device",
            "Practical examples and reference guide for common power measurements"
          ]}
          faqs={[
            {
              question: "What's the difference between watts and volt-amperes?",
              answer: "Watts measure real power—the actual power consumed or produced in an electrical system. Volt-amperes (VA) measure apparent power, which includes both real power and reactive power in AC circuits. In DC circuits or purely resistive AC circuits, watts and volt-amperes are equivalent. However, in circuits with inductive or capacitive loads, volt-amperes will be greater than watts due to the presence of reactive power."
            },
            {
              question: "Why is dBm conversion different from other power units?",
              answer: "dBm is a logarithmic unit, while other power units are linear. One dBm equals 1 milliwatt, but the relationship isn't linear—every 10 dBm increase represents a 10-fold power increase. For example, 0 dBm = 1 mW, 10 dBm = 10 mW, 20 dBm = 100 mW, and so on. This logarithmic nature requires special conversion formulas, which our tool automatically applies."
            },
            {
              question: "Is mechanical horsepower the same as electrical horsepower?",
              answer: "The converter uses the mechanical horsepower standard (1 hp = 745.7 watts), which is most commonly used. Electrical horsepower is slightly different at 746 watts. For most practical purposes, the difference is negligible, but in highly precise engineering calculations, it's important to know which standard is being referenced."
            },
            {
              question: "How accurate are these power conversions?",
              answer: "Our Power Converter uses standard conversion factors and provides results with appropriate precision (up to 7 significant digits for most conversions). This level of precision is suitable for most engineering, educational, and practical applications. However, for extremely critical applications requiring higher precision, specialized tools may be necessary."
            },
            {
              question: "Can I use this for calculating electrical consumption costs?",
              answer: "This tool helps convert between power units, which is the first step in energy cost calculations. To calculate energy consumption costs, you'd multiply the power (in kilowatts) by time (in hours) to get kilowatt-hours (kWh), then multiply by your electricity rate. For example, a 2000W (2kW) appliance running for 3 hours uses 6kWh of energy."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default PowerConverterDetailed;