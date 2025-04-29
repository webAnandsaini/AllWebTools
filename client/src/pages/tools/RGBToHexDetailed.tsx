import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaPalette, FaCopy, FaEyeDropper, FaHistory, FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ColorHistoryItem {
  rgb: string;
  hex: string;
  timestamp: number;
}

const RGBToHexDetailed = () => {
  const [redValue, setRedValue] = useState(0);
  const [greenValue, setGreenValue] = useState(0);
  const [blueValue, setBlueValue] = useState(0);
  const [hexValue, setHexValue] = useState("#000000");
  const [inputMethod, setInputMethod] = useState<"sliders" | "text" | "picker">("sliders");
  const [hexInput, setHexInput] = useState("");
  const [colorHistory, setColorHistory] = useState<ColorHistoryItem[]>([]);
  const [rgbInput, setRgbInput] = useState("");
  const [isValidRgb, setIsValidRgb] = useState(true);
  const [isValidHex, setIsValidHex] = useState(true);
  
  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + 
      (r | 0).toString(16).padStart(2, '0') +
      (g | 0).toString(16).padStart(2, '0') +
      (b | 0).toString(16).padStart(2, '0');
  };
  
  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  // Update hex when RGB values change
  useEffect(() => {
    setHexValue(rgbToHex(redValue, greenValue, blueValue));
  }, [redValue, greenValue, blueValue]);

  const handleRgbInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRgbInput(value);
    
    // Try to parse RGB input
    try {
      const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
      const matches = value.match(rgbRegex);
      
      if (matches) {
        const r = parseInt(matches[1]);
        const g = parseInt(matches[2]);
        const b = parseInt(matches[3]);
        
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          setRedValue(r);
          setGreenValue(g);
          setBlueValue(b);
          setIsValidRgb(true);
          return;
        }
      }
      
      setIsValidRgb(false);
    } catch (error) {
      setIsValidRgb(false);
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);
    
    // Basic hex validation
    const hexRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
    const isValid = hexRegex.test(value);
    setIsValidHex(isValid);
    
    if (isValid) {
      try {
        const hex = value.startsWith('#') ? value : `#${value}`;
        const { r, g, b } = hexToRgb(hex);
        setRedValue(r);
        setGreenValue(g);
        setBlueValue(b);
      } catch (error) {
        setIsValidHex(false);
      }
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const { r, g, b } = hexToRgb(value);
    setRedValue(r);
    setGreenValue(g);
    setBlueValue(b);
    setHexInput(value);
  };

  const saveToHistory = () => {
    const newHistoryItem: ColorHistoryItem = {
      rgb: `rgb(${redValue}, ${greenValue}, ${blueValue})`,
      hex: hexValue.toUpperCase(),
      timestamp: Date.now()
    };
    
    // Add to history and limit to 10 items
    setColorHistory([newHistoryItem, ...colorHistory.slice(0, 9)]);
    
    toast({
      title: "Color saved",
      description: `${newHistoryItem.rgb} / ${newHistoryItem.hex} added to history.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    });
  };

  const loadFromHistory = (item: ColorHistoryItem) => {
    const { r, g, b } = hexToRgb(item.hex);
    setRedValue(r);
    setGreenValue(g);
    setBlueValue(b);
    setHexInput(item.hex);
    setRgbInput(item.rgb);
  };

  const introduction = "Convert RGB color values to hexadecimal codes and vice versa with our versatile color converter.";

  const description = "Our RGB to Hex converter is an essential tool for web developers, designers, and digital artists who need to translate between different color formats. RGB (Red, Green, Blue) and hexadecimal are the two most common ways to represent colors in digital environments, with RGB being used in design software and CSS, while hexadecimal codes are frequently used in HTML and CSS programming. This tool provides instant, accurate conversion between these formats, allowing you to input colors using intuitive RGB sliders, direct RGB value input, or a visual color picker. The conversions happen in real-time as you adjust values, giving you immediate feedback on your color choices. Additional features include a color history to track your recently used colors, one-click copying of values for easy integration into your projects, and the ability to visualize the selected color. Whether you're developing websites, creating digital art, or designing user interfaces, this converter streamlines your workflow by eliminating the need for manual color format calculations.";

  const howToUse = [
    "Choose your preferred input method: RGB sliders, direct RGB text input, or color picker.",
    "When using sliders, adjust the Red, Green, and Blue values (0-255) to create your color.",
    "For text input, type RGB values in the format 'rgb(R, G, B)' or enter a hex code with or without the # symbol.",
    "View the corresponding color and its values in both formats in real-time.",
    "Click the copy button next to any value to copy it to your clipboard.",
    "Save colors to your history for future reference by clicking the 'Add to History' button.",
    "Click on any color in your history to load it back into the converter."
  ];

  const features = [
    "✅ Real-time conversion between RGB and hexadecimal formats",
    "✅ Multiple input methods: sliders, direct text input, and color picker",
    "✅ Visual color preview for immediate feedback",
    "✅ One-click copying of color values to clipboard",
    "✅ Color history to save and reuse your previous colors",
    "✅ Format validation to ensure accurate conversions"
  ];

  const faqs = [
    {
      question: "What's the difference between RGB and hexadecimal color formats?",
      answer: "RGB (Red, Green, Blue) and hexadecimal are two ways of representing the same colors in digital formats. RGB uses three separate values from 0-255 to represent the intensity of red, green, and blue light. For example, rgb(255, 0, 0) is pure red. Hexadecimal colors combine these values into a single code with a # symbol followed by six characters, where each pair of characters represents red, green, and blue in hexadecimal notation (base-16, using 0-9 and A-F). For example, #FF0000 is the hex equivalent of rgb(255, 0, 0). Both formats are used in web development and digital design, with hex being more compact."
    },
    {
      question: "Why would I need to convert between RGB and hex colors?",
      answer: "There are several reasons to convert between these formats: 1) Different platforms and tools may require different formats - design software often uses RGB while web development typically uses hex; 2) CSS in web development accepts both formats, but hex is more concise; 3) Some color manipulation operations are easier to perform in one format than the other; 4) When copying colors from design mockups or existing websites, you may need to convert to match your preferred format. Our tool makes these conversions instant and error-free."
    },
    {
      question: "Are there shorthand versions of hex color codes?",
      answer: "Yes, there is a shorthand notation for certain hex colors. When a hex color has identical pairs of characters (like #FFAA22), it can be shortened to three characters by using just one character from each pair (#FA2). This only works when both characters in each pair are identical. Our converter supports both 6-digit and 3-digit hex codes as input, and will always output the full 6-digit version for maximum compatibility."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">RGB to Hex Converter</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as "sliders" | "text" | "picker")}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="sliders">
                <FaPalette className="mr-2" />
                Sliders
              </TabsTrigger>
              <TabsTrigger value="text">
                Text Input
              </TabsTrigger>
              <TabsTrigger value="picker">
                <FaEyeDropper className="mr-2" />
                Color Picker
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sliders" className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="red-slider" className="text-sm font-medium">Red (R)</Label>
                  <span className="text-sm">{redValue}</span>
                </div>
                <Slider 
                  id="red-slider"
                  min={0}
                  max={255}
                  step={1}
                  value={[redValue]}
                  onValueChange={(values) => setRedValue(values[0])}
                  className="mb-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="green-slider" className="text-sm font-medium">Green (G)</Label>
                  <span className="text-sm">{greenValue}</span>
                </div>
                <Slider 
                  id="green-slider"
                  min={0}
                  max={255}
                  step={1}
                  value={[greenValue]}
                  onValueChange={(values) => setGreenValue(values[0])}
                  className="mb-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="blue-slider" className="text-sm font-medium">Blue (B)</Label>
                  <span className="text-sm">{blueValue}</span>
                </div>
                <Slider 
                  id="blue-slider"
                  min={0}
                  max={255}
                  step={1}
                  value={[blueValue]}
                  onValueChange={(values) => setBlueValue(values[0])}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="rgb-input" className="text-sm font-medium">RGB Value</Label>
                <div className="relative mt-1">
                  <Input
                    id="rgb-input"
                    placeholder="rgb(255, 255, 255)"
                    value={rgbInput}
                    onChange={handleRgbInputChange}
                    className={`pr-10 ${!isValidRgb ? 'border-red-300' : ''}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => copyToClipboard(`rgb(${redValue}, ${greenValue}, ${blueValue})`)}
                  >
                    <FaCopy />
                  </Button>
                </div>
                {!isValidRgb && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid RGB value (e.g., rgb(255, 0, 128))
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="hex-input" className="text-sm font-medium">Hex Value</Label>
                <div className="relative mt-1">
                  <Input
                    id="hex-input"
                    placeholder="#FFFFFF"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    className={`pr-10 ${!isValidHex ? 'border-red-300' : ''}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => copyToClipboard(hexValue)}
                  >
                    <FaCopy />
                  </Button>
                </div>
                {!isValidHex && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid hex value (e.g., #FF00FF or FF00FF)
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="picker" className="space-y-4">
              <div className="flex flex-col items-center">
                <Label htmlFor="color-picker" className="text-sm font-medium mb-2">Choose a Color</Label>
                <input
                  id="color-picker"
                  type="color"
                  value={hexValue}
                  onChange={handleColorPickerChange}
                  className="w-32 h-32 cursor-pointer"
                />
                <p className="text-sm text-center mt-2">
                  Use your device's color picker to select a color
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          <div className="pt-2">
            <h4 className="font-medium mb-3">Current Color</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-md border mr-3 flex-shrink-0"
                  style={{ backgroundColor: hexValue }}
                />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">RGB:</span>
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      rgb({redValue}, {greenValue}, {blueValue})
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(`rgb(${redValue}, ${greenValue}, ${blueValue})`)}
                    >
                      <FaCopy className="text-xs" />
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">Hex:</span>
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {hexValue.toUpperCase()}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(hexValue.toUpperCase())}
                    >
                      <FaCopy className="text-xs" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={saveToHistory}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Color History</h4>
            <FaHistory className="text-gray-400" />
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {colorHistory.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                <p>Your saved colors will appear here</p>
                <p className="text-xs mt-1">Use the Save button to add colors</p>
              </div>
            ) : (
              colorHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => loadFromHistory(item)}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded border mr-3 flex-shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div>
                      <div className="flex items-center">
                        <code className="text-xs bg-white px-1.5 py-0.5 rounded border">
                          {item.hex}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="ml-1 h-5 w-5 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(item.hex);
                          }}
                        >
                          <FaCopy className="text-xs" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.rgb}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium mb-3">Color Palette</h4>
            <div className="grid grid-cols-5 gap-2">
              {[
                "#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00",
                "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF",
                "#FF00FF", "#FF0080", "#FFFFFF", "#C0C0C0", "#808080",
                "#404040", "#000000", "#FF8080", "#80FF80", "#8080FF"
              ].map((color, index) => (
                <div 
                  key={index}
                  className="w-full pt-[100%] rounded border relative cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const { r, g, b } = hexToRgb(color);
                    setRedValue(r);
                    setGreenValue(g);
                    setBlueValue(b);
                    setHexInput(color);
                  }}
                >
                  {color === hexValue && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white bg-opacity-70 flex items-center justify-center">
                        <FaCheck className="text-green-600 text-xs" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="rgb-to-hex-detailed"
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

export default RGBToHexDetailed;