import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// Types for logo generation
type LogoStyle = "minimalist" | "modern" | "vintage" | "geometric" | "handdrawn" | "abstract";
type LogoColor = "blue" | "green" | "red" | "purple" | "orange" | "monochrome" | "gradient" | "custom";
type LogoIndustry = "technology" | "food" | "fashion" | "health" | "education" | "finance" | "entertainment" | "other";

const LogoMakerDetailed = () => {
  // State for inputs
  const [companyName, setCompanyName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [industry, setIndustry] = useState<LogoIndustry>("technology");
  const [logoStyle, setLogoStyle] = useState<LogoStyle>("modern");
  const [colorScheme, setColorScheme] = useState<LogoColor>("blue");
  const [customColor, setCustomColor] = useState("#4a86e8");
  const [activeTab, setActiveTab] = useState("generator");
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [includeText, setIncludeText] = useState(true);
  
  // State for output and processing
  const [logoUrl, setLogoUrl] = useState("");
  const [alternativeLogos, setAlternativeLogos] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { toast } = useToast();

  // Generate logo when user clicks the button
  const handleGenerateLogo = () => {
    if (!companyName.trim() && includeText) {
      toast({
        title: "Company name required",
        description: "Please enter a company name to generate a logo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setLogoUrl("");
    setAlternativeLogos([]);

    // Simulate logo generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the logo
          const logos = generateMockLogos();
          setLogoUrl(logos[0]);
          setAlternativeLogos(logos.slice(1));
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Generate mock logos based on user parameters
  const generateMockLogos = (): string[] => {
    // In a real application, this would be an API call to a design service
    // This is a mock implementation for demonstration purposes
    
    // Base SVG patterns for different logo styles
    const basePatterns = {
      minimalist: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          <circle cx="150" cy="130" r="80" fill="${getColorValue()}"/>
          ${includeSymbol ? `<path d="M120,160 L180,160 L150,120 Z" fill="white"/>` : ''}
          ${includeText ? `
            <text x="150" y="240" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `,
      
      modern: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          ${includeSymbol ? `
            <rect x="80" y="80" width="140" height="140" rx="20" fill="${getColorValue()}"/>
            <circle cx="150" cy="150" r="50" fill="white" fill-opacity="0.3"/>
          ` : ''}
          ${includeText ? `
            <text x="150" y="240" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `,
      
      vintage: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          ${includeSymbol ? `
            <circle cx="150" cy="120" r="70" fill="none" stroke="${getColorValue()}" stroke-width="4"/>
            <path d="M110,120 L190,120 M150,80 L150,160" stroke="${getColorValue()}" stroke-width="4"/>
          ` : ''}
          ${includeText ? `
            <text x="150" y="220" font-family="serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="250" font-family="serif" font-size="14" font-style="italic" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `,
      
      geometric: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          ${includeSymbol ? `
            <polygon points="150,60 120,100 100,150 120,200 150,240 180,200 200,150 180,100" fill="${getColorValue()}" stroke="none"/>
            <polygon points="150,80 130,110 120,150 130,190 150,220 170,190 180,150 170,110" fill="white" fill-opacity="0.2"/>
          ` : ''}
          ${includeText ? `
            <text x="150" y="270" font-family="Arial" font-size="22" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="290" font-family="Arial" font-size="12" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `,
      
      handdrawn: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          ${includeSymbol ? `
            <path d="M100,100 C120,80 180,80 200,100 C220,120 220,180 200,200 C180,220 120,220 100,200 C80,180 80,120 100,100 Z" fill="none" stroke="${getColorValue()}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M130,130 C140,120 160,120 170,130 C180,140 180,160 170,170 C160,180 140,180 130,170 C120,160 120,140 130,130 Z" fill="none" stroke="${getColorValue()}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          ` : ''}
          ${includeText ? `
            <text x="150" y="240" font-family="cursive" font-size="24" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="270" font-family="cursive" font-size="14" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `,
      
      abstract: `
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="transparent"/>
          ${includeSymbol ? `
            <path d="M80,150 Q150,50 220,150 Q150,250 80,150 Z" fill="${getColorValue()}"/>
            <path d="M120,150 Q150,100 180,150 Q150,200 120,150 Z" fill="white" fill-opacity="0.3"/>
          ` : ''}
          ${includeText ? `
            <text x="150" y="240" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="${getTextColorValue()}">${companyName}</text>
            ${slogan ? `<text x="150" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="${getTextColorValue()}">${slogan}</text>` : ''}
          ` : ''}
        </svg>
      `
    };
    
    // Industry-specific symbol additions
    const industryElements = {
      technology: `<path d="M130,120 L170,120 L170,160 L130,160 Z" fill="white" fill-opacity="0.5"/>`,
      food: `<circle cx="150" cy="150" r="30" fill="white" fill-opacity="0.5"/>`,
      fashion: `<path d="M120,120 L180,120 L150,180 Z" fill="white" fill-opacity="0.5"/>`,
      health: `<path d="M130,130 L130,170 L170,170 L170,130 Z" fill="white" fill-opacity="0.5"/>`,
      education: `<path d="M120,150 L180,150 M150,120 L150,180" stroke="white" stroke-opacity="0.5" stroke-width="10"/>`,
      finance: `<path d="M140,130 L160,130 L160,170 L140,170 Z" fill="white" fill-opacity="0.5"/>`,
      entertainment: `<circle cx="150" cy="150" r="25" fill="white" fill-opacity="0.5"/>`,
      other: ``
    };
    
    // Generate variations of the selected style
    const mainSvg = basePatterns[logoStyle]
      .replace('${getColorValue()}', getColorValue())
      .replace('${getTextColorValue()}', getTextColorValue())
      .replace(/\${companyName}/g, companyName)
      .replace(/\${slogan}/g, slogan);
      
    // Create variations by tweaking colors and symbols
    const variations = [];
    
    // Variation 1: Different color shade
    const colorVar1 = adjustColor(getColorValue(), 20);
    let variation1 = basePatterns[logoStyle]
      .replace('${getColorValue()}', colorVar1)
      .replace('${getTextColorValue()}', getTextColorValue())
      .replace(/\${companyName}/g, companyName)
      .replace(/\${slogan}/g, slogan);
    variations.push(variation1);
    
    // Variation 2: Different layout
    const stylesToShow = Object.keys(basePatterns).filter(style => style !== logoStyle);
    const alternateStyle = stylesToShow[Math.floor(Math.random() * stylesToShow.length)] as LogoStyle;
    let variation2 = basePatterns[alternateStyle]
      .replace('${getColorValue()}', getColorValue())
      .replace('${getTextColorValue()}', getTextColorValue())
      .replace(/\${companyName}/g, companyName)
      .replace(/\${slogan}/g, slogan);
    variations.push(variation2);
    
    // Variation 3: Industry specific elements
    if (includeSymbol && industry && industry !== 'other') {
      let variation3 = basePatterns[logoStyle]
        .replace('${getColorValue()}', getColorValue())
        .replace('${getTextColorValue()}', getTextColorValue())
        .replace(/\${companyName}/g, companyName)
        .replace(/\${slogan}/g, slogan);
        
      // Insert industry elements
      variation3 = variation3.replace(
        includeSymbol ? `<path d="M120,160 L180,160 L150,120 Z" fill="white"/>` : '',
        industryElements[industry]
      );
      
      variations.push(variation3);
    } else {
      // Alternative variation if no industry
      const colorVar3 = adjustColor(getColorValue(), -20);
      let variation3 = basePatterns[logoStyle]
        .replace('${getColorValue()}', colorVar3)
        .replace('${getTextColorValue()}', getTextColorValue())
        .replace(/\${companyName}/g, companyName)
        .replace(/\${slogan}/g, slogan);
      variations.push(variation3);
    }
    
    // Convert SVGs to data URLs
    const mainLogoDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(mainSvg)}`;
    const variationDataUrls = variations.map(svg => 
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    );
    
    return [mainLogoDataUrl, ...variationDataUrls];
  };

  // Helper function to get color value based on selection
  const getColorValue = (): string => {
    if (colorScheme === 'custom') {
      return customColor;
    }
    
    const colorMap = {
      blue: '#4a86e8',
      green: '#6aa84f',
      red: '#e06666',
      purple: '#8e7cc3',
      orange: '#e69138',
      monochrome: '#2f2f2f',
      gradient: 'url(#gradient)'
    };
    
    return colorMap[colorScheme] || colorMap.blue;
  };

  // Helper function for text color (contrasting with logo color)
  const getTextColorValue = (): string => {
    if (colorScheme === 'monochrome') {
      return '#ffffff';
    }
    
    // For other colors, use dark text
    return '#333333';
  };

  // Helper function to adjust colors for variations
  const adjustColor = (color: string, amount: number): string => {
    // Only works for hex colors
    if (!color.startsWith('#')) return color;
    
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    
    R = Math.max(0, Math.min(255, R + amount));
    G = Math.max(0, Math.min(255, G + amount));
    B = Math.max(0, Math.min(255, B + amount));
    
    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');
    
    return `#${RR}${GG}${BB}`;
  };

  // Download logo as SVG
  const downloadLogo = (url: string, format: 'svg' | 'png' = 'svg') => {
    // For SVG download
    if (format === 'svg') {
      const svgContent = decodeURIComponent(url.split(',')[1]);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-logo.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(blobUrl);
    } 
    // For PNG download (would need canvas conversion in real app)
    else {
      toast({
        title: "PNG Download",
        description: "In a complete app, this would download a PNG version of your logo.",
      });
    }
  };

  // Use a different logo variation
  const selectAlternativeLogo = (index: number) => {
    const selectedLogo = alternativeLogos[index];
    
    // Swap with main logo
    setAlternativeLogos(prev => {
      const newAlternatives = [...prev];
      newAlternatives[index] = logoUrl;
      return newAlternatives;
    });
    
    setLogoUrl(selectedLogo);
    
    toast({
      title: "Logo Selected",
      description: "You've selected an alternative logo design.",
    });
  };

  // Clear all fields and reset state
  const clearFields = () => {
    setCompanyName("");
    setSlogan("");
    setLogoUrl("");
    setAlternativeLogos([]);
    setProgress(0);
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="generator" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Logo Maker</TabsTrigger>
          <TabsTrigger value="examples">Examples & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Logo Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <Input
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter your company name"
                        className="mt-1"
                        disabled={!includeText}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="slogan" className="text-sm font-medium">
                        Slogan (optional)
                      </Label>
                      <Input
                        id="slogan"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        placeholder="Enter your company slogan"
                        className="mt-1"
                        disabled={!includeText}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="industry" className="text-sm font-medium">
                        Industry
                      </Label>
                      <Select
                        value={industry}
                        onValueChange={(value) => setIndustry(value as LogoIndustry)}
                      >
                        <SelectTrigger id="industry" className="mt-1">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="food">Food & Restaurant</SelectItem>
                          <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                          <SelectItem value="health">Health & Wellness</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="finance">Finance & Business</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-symbol" 
                          checked={includeSymbol}
                          onCheckedChange={(checked) => setIncludeSymbol(checked as boolean)}
                        />
                        <Label htmlFor="include-symbol" className="text-sm">
                          Include Symbol/Icon
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-text" 
                          checked={includeText}
                          onCheckedChange={(checked) => setIncludeText(checked as boolean)}
                        />
                        <Label htmlFor="include-text" className="text-sm">
                          Include Company Name/Slogan
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Design Style</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo-style" className="text-sm font-medium">
                        Logo Style
                      </Label>
                      <Select
                        value={logoStyle}
                        onValueChange={(value) => setLogoStyle(value as LogoStyle)}
                      >
                        <SelectTrigger id="logo-style" className="mt-1">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="geometric">Geometric</SelectItem>
                          <SelectItem value="handdrawn">Hand-drawn</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="color-scheme" className="text-sm font-medium">
                        Color Scheme
                      </Label>
                      <Select
                        value={colorScheme}
                        onValueChange={(value) => setColorScheme(value as LogoColor)}
                      >
                        <SelectTrigger id="color-scheme" className="mt-1">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="monochrome">Monochrome</SelectItem>
                          <SelectItem value="custom">Custom Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {colorScheme === 'custom' && (
                      <div>
                        <Label htmlFor="custom-color" className="text-sm font-medium">
                          Choose Custom Color
                        </Label>
                        <div className="flex mt-1">
                          <Input
                            id="custom-color"
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="ml-2 flex-grow"
                            maxLength={7}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateLogo}
                        disabled={isGenerating || (!companyName.trim() && includeText)}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Logo"}
                      </Button>
                      
                      <Button
                        onClick={clearFields}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">Your Logo</h3>
                    
                    {!isGenerating && logoUrl && (
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-50 text-blue-700">
                          {logoStyle.charAt(0).toUpperCase() + logoStyle.slice(1)}
                        </Badge>
                        <Button
                          onClick={() => downloadLogo(logoUrl)}
                          variant="outline"
                          size="sm"
                          className="text-sm"
                        >
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isGenerating ? (
                    <div className="space-y-4 py-20">
                      <Progress value={progress} className="w-full h-2" />
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-2">
                          {progress < 30 ? "Analyzing brand elements..." : 
                           progress < 60 ? "Creating design concepts..." : 
                           "Finalizing logo design..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {logoUrl ? (
                        <div className="flex justify-center p-10 bg-gray-50 rounded-lg">
                          <img 
                            src={logoUrl} 
                            alt="Generated Logo" 
                            className="max-h-64 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                          <div className="text-gray-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 9V6c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                              <path d="M2 11v5a2 2 0 0 0 2 2h5"></path>
                              <path d="m10 7 4 10"></path>
                              <path d="M7 7h7"></path>
                              <path d="M12 7v4"></path>
                            </svg>
                          </div>
                          <p className="text-gray-500 text-center max-w-xs">
                            Your logo will appear here. Fill in the details and click "Generate Logo" to create your design.
                          </p>
                        </div>
                      )}
                      
                      {alternativeLogos.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium text-base mb-3">Alternative Designs</h4>
                          <div className="grid grid-cols-3 gap-4">
                            {alternativeLogos.map((altLogo, index) => (
                              <div 
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => selectAlternativeLogo(index)}
                              >
                                <img 
                                  src={altLogo} 
                                  alt={`Alternative Logo ${index + 1}`} 
                                  className="max-h-24 w-full object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!isGenerating && !logoUrl && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use Logo Maker</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Enter your company name and optional slogan in the input fields</li>
                      <li>Select your industry for industry-specific design elements</li>
                      <li>Choose whether to include symbols/icons and text in your logo</li>
                      <li>Select a logo style that matches your brand's personality</li>
                      <li>Choose a color scheme or specify a custom color</li>
                      <li>Click "Generate Logo" to create your custom logo design</li>
                      <li>Browse alternative designs and select the one you prefer</li>
                      <li>Download your logo in SVG format for high-quality usage</li>
                    </ol>
                  </CardContent>
                </Card>
              )}
              
              {!isGenerating && logoUrl && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">Next Steps</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Download your logo in SVG format for scalable, high-quality graphics</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Use your logo on business cards, websites, social media, and marketing materials</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Consider testing alternative color schemes if the current design doesn't feel right</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>For advanced customization, edit the SVG file in a vector graphics editor</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Logo Style Guide</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Minimalist</h4>
                    <p className="mt-1">
                      Simple, clean designs with minimal elements. Perfect for modern brands that value clarity and directness. Often uses geometric shapes and limited color palettes.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Modern</h4>
                    <p className="mt-1">
                      Contemporary, sleek designs with clean lines and forward-thinking aesthetics. Ideal for technology, digital services, and innovative companies.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Vintage</h4>
                    <p className="mt-1">
                      Retro-inspired designs that evoke nostalgia and timelessness. Often features badges, banners, and ornate details that create a sense of heritage and tradition.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Geometric</h4>
                    <p className="mt-1">
                      Based on precise shapes and mathematical patterns. Creates a sense of order, balance, and technical perfection. Popular in architecture, engineering, and technology.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Hand-drawn</h4>
                    <p className="mt-1">
                      Organic, artistic designs with a human touch. Creates warmth, authenticity, and personality. Ideal for artisanal brands, creative services, and businesses targeting younger audiences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Color Psychology</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                    <h4 className="font-medium">Blue</h4>
                    <p className="text-gray-600">Trust, reliability, professionalism</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                    <h4 className="font-medium">Green</h4>
                    <p className="text-gray-600">Growth, health, sustainability</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-red-500"></div>
                    <h4 className="font-medium">Red</h4>
                    <p className="text-gray-600">Energy, passion, urgency</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500"></div>
                    <h4 className="font-medium">Purple</h4>
                    <p className="text-gray-600">Creativity, luxury, wisdom</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                    <h4 className="font-medium">Orange</h4>
                    <p className="text-gray-600">Enthusiasm, friendliness, confidence</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-gray-800"></div>
                    <h4 className="font-medium">Monochrome</h4>
                    <p className="text-gray-600">Sophistication, timelessness, clarity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Logo Design Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Keep it simple - logos should be easily recognizable at a glance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Ensure scalability - your logo should look good at any size, from favicon to billboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Aim for memorability - distinctive elements help your logo stand out</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Consider versatility - your logo should work across different media and backgrounds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Match your brand personality - logo style should reflect your brand values</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Think timeless over trendy - avoid designs that will quickly feel dated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Test in context - see how your logo looks on business cards, websites, etc.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Industry-Specific Considerations</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Technology</h4>
                    <p className="mt-1">
                      Modern, forward-thinking designs with clean lines and abstract elements. Often uses blue, purple, or monochromatic color schemes to convey innovation and reliability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Food & Restaurant</h4>
                    <p className="mt-1">
                      Warm, appetizing designs that evoke sensory experiences. Effective logos in this space often incorporate menu items, utensils, or other food-related imagery.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Health & Wellness</h4>
                    <p className="mt-1">
                      Clean, positive designs that communicate vitality and wellbeing. Green and blue tones are popular for conveying health, freshness, and tranquility.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Finance & Business</h4>
                    <p className="mt-1">
                      Professional, trustworthy designs that project stability and expertise. Often uses symbols of growth, security, or precision alongside blue or monochrome color schemes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Related Design Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h4 className="font-medium text-sm mb-2">Resume Builder</h4>
                  <p className="text-xs text-gray-600">Create professional resumes with customizable templates</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h4 className="font-medium text-sm mb-2">Flyer Maker</h4>
                  <p className="text-xs text-gray-600">Design eye-catching flyers for events and promotions</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h4 className="font-medium text-sm mb-2">Business Card Maker</h4>
                  <p className="text-xs text-gray-600">Create professional business cards with your logo</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <h4 className="font-medium text-sm mb-2">Poster Maker</h4>
                  <p className="text-xs text-gray-600">Design attention-grabbing posters for any purpose</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Create professional, custom logos in minutes with our intuitive AI-powered logo design tool.";
  
  const description = `
    Our Logo Maker is a powerful yet user-friendly design tool that enables anyone to create professional, high-quality logos without graphic design experience or expensive software. Whether you're launching a new business, rebranding an existing one, or creating a logo for a project or event, this intelligent design assistant helps you generate custom logos that capture your brand's unique identity in minutes.
    
    The tool offers comprehensive customization options to ensure your logo perfectly represents your brand. You can select from multiple design styles including minimalist, modern, vintage, geometric, hand-drawn, and abstract approaches to match your brand personality. The color selection feature allows you to choose from popular color schemes with proven psychological impacts or specify custom colors that align with your existing brand palette.
    
    What sets our Logo Maker apart is its industry-specific design elements that automatically incorporate relevant symbols and visual cues based on your business type. Whether you're in technology, food service, healthcare, education, or another industry, the tool generates designs that resonate with your target audience and communicate your business focus effectively.
    
    Each generated logo follows fundamental design principles including scalability (looking good at any size), simplicity (being immediately recognizable), and versatility (working across different media). The tool produces your main logo design along with multiple variations, giving you alternatives to consider or use in different contexts. All logos are generated in SVG format, ensuring perfect scaling for everything from business cards to billboards without loss of quality.
  `;

  const howToUse = [
    "Enter your company name in the input field, which will appear in your logo design.",
    "Add an optional slogan if you want it incorporated into your logo.",
    "Select your industry from the dropdown menu to get industry-specific design elements.",
    "Toggle the options to include symbols/icons and text based on your preferences.",
    "Choose a logo style (minimalist, modern, vintage, etc.) that matches your brand personality.",
    "Select a color scheme from the predefined options or specify a custom color using the color picker.",
    "Click the 'Generate Logo' button and wait for the AI to create your custom logo design.",
    "Review the generated logo and alternative designs shown below the main logo.",
    "Click on any alternative design to select it as your main logo if you prefer it.",
    "Download your finished logo in SVG format for high-quality, scalable usage across all your branding materials."
  ];

  const features = [
    "Six versatile logo styles (minimalist, modern, vintage, geometric, hand-drawn, abstract) to match any brand personality",
    "Industry-specific design elements that automatically incorporate relevant symbols for your business type",
    "Multiple color schemes with psychological impact information to help select the right emotional tone",
    "Alternative design variations giving you multiple options to choose from in one generation",
    "SVG format downloads providing infinitely scalable, high-quality vector graphics",
    "Options to include or exclude text and symbols for complete design flexibility",
    "Custom color selection for perfect brand color matching"
  ];

  const faqs = [
    {
      question: "Can I use my logo for commercial purposes?",
      answer: "Yes, all logos created with our Logo Maker are yours to use for any commercial or non-commercial purpose. You receive full usage rights to the logos you generate, allowing you to use them on business cards, websites, marketing materials, products, storefronts, or any other application. The SVG files provided give you complete flexibility to resize your logo without quality loss, and you can further customize them in any vector editing software. There are no recurring fees or hidden licensing costs—once you create and download your logo, it belongs to you entirely for unlimited use."
    },
    {
      question: "How do I choose the right logo style and colors for my brand?",
      answer: "Selecting the right logo style and colors depends on your brand's personality, industry, and target audience. For style: Modern and minimalist designs work well for technology, digital services, and contemporary brands. Vintage styles suit artisanal, heritage, or traditional businesses. Geometric designs convey precision and technical expertise. Hand-drawn styles create warmth and authenticity for creative or artisanal brands. For colors: Blue communicates trust, reliability, and professionalism (ideal for finance, technology, healthcare). Green suggests growth, health, and sustainability (perfect for wellness, environmental, or outdoor brands). Red conveys energy, passion, and urgency (effective for food, entertainment, or youth-focused brands). Purple indicates creativity, luxury, and wisdom (suitable for premium or artistic offerings). Review our style guide and color psychology sections for more detailed guidance tailored to your specific industry."
    },
    {
      question: "What file formats do I receive, and how can I use them?",
      answer: "Our Logo Maker provides your logo in SVG (Scalable Vector Graphics) format, which is the industry standard for logo design. SVG files offer several significant advantages: Perfect scalability—unlike JPG or PNG files, SVG files maintain perfect quality at any size, from tiny favicons to large billboards. Editability—SVG files can be opened and customized in vector editing software like Adobe Illustrator, Inkscape (free), or Affinity Designer. Transparency support—SVGs maintain transparent backgrounds, allowing your logo to be placed on any colored surface without a visible box around it. Web-friendliness—SVGs can be directly used on websites for fast loading and perfect display on any screen resolution. For specific applications that require raster formats (like social media profile pictures), you can easily convert your SVG to PNG or JPG using free online tools or basic graphics software."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="logo-maker"
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

export default LogoMakerDetailed;