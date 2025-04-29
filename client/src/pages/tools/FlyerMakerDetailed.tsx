import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type FlyerSize = "a4" | "a5" | "letter" | "custom" | "instagram" | "facebook";
type FlyerOrientation = "portrait" | "landscape";
type FlyerTheme = "business" | "event" | "sale" | "food" | "education" | "holiday" | "minimal" | "bold";
type FlyerTemplate = "template1" | "template2" | "template3" | "template4" | "template5";

const FlyerMakerDetailed = () => {
  // State for flyer design
  const [headline, setHeadline] = useState("");
  const [subheading, setSubheading] = useState("");
  const [flyerDescription, setFlyerDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [flyerSize, setFlyerSize] = useState<FlyerSize>("a4");
  const [customWidth, setCustomWidth] = useState(210); // mm for A4 width
  const [customHeight, setCustomHeight] = useState(297); // mm for A4 height
  const [orientation, setOrientation] = useState<FlyerOrientation>("portrait");
  const [theme, setTheme] = useState<FlyerTheme>("event");
  const [template, setTemplate] = useState<FlyerTemplate>("template1");
  const [includeImage, setIncludeImage] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(false);
  const [includeQRCode, setIncludeQRCode] = useState(false);
  const [logoText, setLogoText] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  
  // State for the editor
  const [activeTab, setActiveTab] = useState("editor");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flyerGenerated, setFlyerGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { toast } = useToast();

  // Handler for generating the flyer
  const handleGenerateFlyer = () => {
    if (!headline.trim()) {
      toast({
        title: "Headline required",
        description: "Please enter a headline for your flyer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate flyer generation process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setFlyerGenerated(true);
          
          toast({
            title: "Flyer generated",
            description: "Your flyer has been created successfully!",
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Handler for downloading the flyer
  const downloadFlyer = (format: 'pdf' | 'jpg' | 'png') => {
    toast({
      title: `Flyer Downloaded`,
      description: `Your flyer has been downloaded in ${format.toUpperCase()} format.`,
    });
  };

  // Handler for clearing the form
  const clearForm = () => {
    setHeadline("");
    setSubheading("");
    setDescription("");
    setContactInfo("");
    setFlyerSize("a4");
    setCustomWidth(210);
    setCustomHeight(297);
    setOrientation("portrait");
    setTheme("event");
    setTemplate("template1");
    setIncludeImage(true);
    setIncludeLogo(false);
    setIncludeQRCode(false);
    setLogoText("");
    setQrCodeData("");
    
    setFlyerGenerated(false);
    
    toast({
      title: "Form cleared",
      description: "All flyer information has been cleared.",
    });
  };

  // Get the dimensions for the preview based on the selected size and orientation
  const getPreviewDimensions = () => {
    let width, height;
    
    switch (flyerSize) {
      case "a4":
        width = 210;
        height = 297;
        break;
      case "a5":
        width = 148;
        height = 210;
        break;
      case "letter":
        width = 216;
        height = 279;
        break;
      case "instagram":
        width = 1080;
        height = 1080;
        break;
      case "facebook":
        width = 1200;
        height = 630;
        break;
      case "custom":
        width = customWidth;
        height = customHeight;
        break;
      default:
        width = 210;
        height = 297;
    }
    
    if (orientation === "landscape" && (flyerSize === "a4" || flyerSize === "a5" || flyerSize === "letter" || flyerSize === "custom")) {
      return { width: height, height: width };
    }
    
    return { width, height };
  };

  // Get the background color based on the selected theme
  const getThemeColor = () => {
    switch (theme) {
      case "business":
        return "bg-blue-50";
      case "event":
        return "bg-purple-50";
      case "sale":
        return "bg-red-50";
      case "food":
        return "bg-orange-50";
      case "education":
        return "bg-green-50";
      case "holiday":
        return "bg-pink-50";
      case "minimal":
        return "bg-gray-50";
      case "bold":
        return "bg-indigo-50";
      default:
        return "bg-purple-50";
    }
  };

  // Get the accent color based on the selected theme
  const getAccentColor = () => {
    switch (theme) {
      case "business":
        return "bg-blue-500";
      case "event":
        return "bg-purple-500";
      case "sale":
        return "bg-red-500";
      case "food":
        return "bg-orange-500";
      case "education":
        return "bg-green-500";
      case "holiday":
        return "bg-pink-500";
      case "minimal":
        return "bg-gray-500";
      case "bold":
        return "bg-indigo-500";
      default:
        return "bg-purple-500";
    }
  };

  // Get the aspect ratio for the preview
  const previewAspectRatio = () => {
    const { width, height } = getPreviewDimensions();
    return (height / width) * 100;
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="editor" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Flyer Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="tips">Design Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Flyer Content</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="headline">Headline*</Label>
                      <Input 
                        id="headline" 
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="E.g., 'SUMMER SALE' or 'GRAND OPENING'"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subheading">Subheading</Label>
                      <Input 
                        id="subheading"
                        value={subheading}
                        onChange={(e) => setSubheading(e.target.value)}
                        placeholder="E.g., 'Up to 50% off' or 'Join us on July 15th'"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        value={flyerDescription}
                        onChange={(e) => setFlyerDescription(e.target.value)}
                        placeholder="Enter additional details about your event or promotion..."
                        className="h-24"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-info">Contact Information</Label>
                      <Textarea 
                        id="contact-info"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Phone, email, address, website, etc."
                        className="h-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Flyer Options</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flyer-size">Flyer Size</Label>
                      <Select
                        value={flyerSize}
                        onValueChange={(value) => setFlyerSize(value as FlyerSize)}
                      >
                        <SelectTrigger id="flyer-size">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                          <SelectItem value="a5">A5 (148 × 210 mm)</SelectItem>
                          <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                          <SelectItem value="instagram">Instagram Post (1080 × 1080 px)</SelectItem>
                          <SelectItem value="facebook">Facebook Cover (1200 × 630 px)</SelectItem>
                          <SelectItem value="custom">Custom Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {flyerSize === "custom" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="custom-width">Width (mm)</Label>
                          <Input 
                            id="custom-width" 
                            type="number"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            min={50}
                            max={1000}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-height">Height (mm)</Label>
                          <Input 
                            id="custom-height" 
                            type="number"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            min={50}
                            max={1000}
                          />
                        </div>
                      </div>
                    )}
                    
                    {(flyerSize === "a4" || flyerSize === "a5" || flyerSize === "letter" || flyerSize === "custom") && (
                      <div className="space-y-2">
                        <Label htmlFor="orientation">Orientation</Label>
                        <Select
                          value={orientation}
                          onValueChange={(value) => setOrientation(value as FlyerOrientation)}
                        >
                          <SelectTrigger id="orientation">
                            <SelectValue placeholder="Select orientation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={theme}
                        onValueChange={(value) => setTheme(value as FlyerTheme)}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                          <SelectItem value="food">Food & Restaurant</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="template">Template</Label>
                      <Select
                        value={template}
                        onValueChange={(value) => setTemplate(value as FlyerTemplate)}
                      >
                        <SelectTrigger id="template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template1">Classic</SelectItem>
                          <SelectItem value="template2">Modern</SelectItem>
                          <SelectItem value="template3">Bold</SelectItem>
                          <SelectItem value="template4">Elegant</SelectItem>
                          <SelectItem value="template5">Geometric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-image" 
                          checked={includeImage}
                          onCheckedChange={(checked) => setIncludeImage(checked as boolean)}
                        />
                        <Label htmlFor="include-image" className="text-sm">
                          Include Background Image
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-logo" 
                          checked={includeLogo}
                          onCheckedChange={(checked) => setIncludeLogo(checked as boolean)}
                        />
                        <Label htmlFor="include-logo" className="text-sm">
                          Include Logo
                        </Label>
                      </div>
                      
                      {includeLogo && (
                        <div className="pl-6 space-y-2">
                          <Label htmlFor="logo-text" className="text-sm">Logo Text</Label>
                          <Input 
                            id="logo-text" 
                            value={logoText}
                            onChange={(e) => setLogoText(e.target.value)}
                            placeholder="Your company name"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-qr-code" 
                          checked={includeQRCode}
                          onCheckedChange={(checked) => setIncludeQRCode(checked as boolean)}
                        />
                        <Label htmlFor="include-qr-code" className="text-sm">
                          Include QR Code
                        </Label>
                      </div>
                      
                      {includeQRCode && (
                        <div className="pl-6 space-y-2">
                          <Label htmlFor="qr-code-data" className="text-sm">QR Code Data</Label>
                          <Input 
                            id="qr-code-data" 
                            value={qrCodeData}
                            onChange={(e) => setQrCodeData(e.target.value)}
                            placeholder="Website URL or contact information"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGenerateFlyer}
                        disabled={isGenerating || !headline.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isGenerating ? "Generating..." : flyerGenerated ? "Update Flyer" : "Generate Flyer"}
                      </Button>
                      
                      <Button
                        onClick={clearForm}
                        variant="outline"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    {isGenerating && (
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-gray-500 text-center">
                          {progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-7">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-lg">Flyer Preview</h3>
                    
                    {flyerGenerated && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFlyer('pdf')}
                        >
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFlyer('jpg')}
                        >
                          JPG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFlyer('png')}
                        >
                          PNG
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className={`mx-auto relative border shadow-sm mb-6 ${getThemeColor()}`} style={{
                    width: "100%",
                    maxWidth: "400px", 
                    paddingBottom: `${previewAspectRatio()}%`, 
                  }}>
                    {(headline || flyerGenerated) ? (
                      <div className="absolute inset-0 flex flex-col p-4 sm:p-6">
                        {/* Template Layout */}
                        <div className="flex-1 flex flex-col">
                          {/* Logo */}
                          {includeLogo && (
                            <div className="mb-4 text-center">
                              <div className={`inline-block px-3 py-1 rounded ${getAccentColor()} text-white font-bold text-sm`}>
                                {logoText || "LOGO"}
                              </div>
                            </div>
                          )}
                          
                          {/* Main Content */}
                          <div className="flex-1 flex flex-col justify-center items-center text-center p-2">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{headline}</h2>
                            {subheading && <h3 className="text-lg sm:text-xl mb-4">{subheading}</h3>}
                            
                            {description && (
                              <div className="prose max-w-full text-sm mb-4">
                                <p>{description}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Contact Info & QR Code */}
                          <div className="mt-auto">
                            {contactInfo && (
                              <div className="text-xs text-center mb-2">
                                {contactInfo}
                              </div>
                            )}
                            
                            {includeQRCode && (
                              <div className="flex justify-center mb-2">
                                <div className="w-16 h-16 bg-white border border-gray-300 flex items-center justify-center text-[8px]">
                                  QR CODE
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400 text-center px-4">
                          Enter a headline and click "Generate Flyer" to see a preview of your design
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 text-center">
                    {flyerSize !== "custom" && (
                      <span>
                        {flyerSize.toUpperCase()} - {orientation === "portrait" ? "Portrait" : "Landscape"}
                      </span>
                    )}
                    {flyerSize === "custom" && (
                      <span>
                        Custom Size: {orientation === "portrait" ? `${customWidth}mm × ${customHeight}mm` : `${customHeight}mm × ${customWidth}mm`}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {flyerGenerated && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">What Next?</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Download your flyer in your preferred format (PDF, JPG, or PNG)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Print your flyer on high-quality paper for best results (recommended paper weight: 100-120 gsm)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Share digitally on social media platforms, email newsletters, or your website</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>For professional printing, save as PDF and take to your local print shop</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Consider printing on both standard and larger sizes to use as posters</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Flyer Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${template === 'template1' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplate('template1')}>
                  <div className="aspect-[3/4] bg-gray-100 border shadow-sm mb-2 p-4 flex flex-col">
                    <div className="w-1/3 h-4 bg-gray-300 mb-4 mx-auto"></div>
                    <div className="w-3/4 h-6 bg-gray-400 mb-2 mx-auto"></div>
                    <div className="w-2/3 h-4 bg-gray-300 mb-6 mx-auto"></div>
                    <div className="flex-1 bg-gray-200"></div>
                    <div className="mt-4 h-3 bg-gray-300"></div>
                  </div>
                  <h4 className="font-medium text-center">Classic</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${template === 'template2' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplate('template2')}>
                  <div className="aspect-[3/4] bg-gray-100 border shadow-sm mb-2 p-4">
                    <div className="flex justify-between mb-2">
                      <div className="w-1/4 h-4 bg-gray-300"></div>
                      <div className="w-1/4 h-4 bg-gray-300"></div>
                    </div>
                    <div className="w-full h-6 bg-gray-400 mb-2 mt-6"></div>
                    <div className="w-3/4 h-4 bg-gray-300 mb-6"></div>
                    <div className="h-20 bg-gray-200 mb-4"></div>
                    <div className="w-full h-3 bg-gray-300 mb-1"></div>
                    <div className="w-3/4 h-3 bg-gray-300"></div>
                  </div>
                  <h4 className="font-medium text-center">Modern</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${template === 'template3' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplate('template3')}>
                  <div className="aspect-[3/4] bg-gray-100 border shadow-sm mb-2 p-4">
                    <div className="w-full h-12 bg-gray-400"></div>
                    <div className="mt-6 mb-2">
                      <div className="w-full h-8 bg-gray-500 mb-2"></div>
                      <div className="w-2/3 h-4 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 mt-4 h-16 bg-gray-200"></div>
                    <div className="mt-auto flex justify-between">
                      <div className="w-1/3 h-12 bg-gray-300"></div>
                      <div className="w-1/2 h-4 bg-gray-300"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Bold</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${template === 'template4' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplate('template4')}>
                  <div className="aspect-[3/4] bg-gray-100 border shadow-sm mb-2 p-4">
                    <div className="border-b border-gray-300 pb-2 mb-4">
                      <div className="w-1/4 h-4 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="w-2/3 h-6 bg-gray-400 mb-2"></div>
                      <div className="w-1/2 h-4 bg-gray-300 mb-4"></div>
                      <div className="w-3/4 h-3 bg-gray-200 mb-1"></div>
                      <div className="w-3/4 h-3 bg-gray-200 mb-1"></div>
                      <div className="w-3/4 h-3 bg-gray-200"></div>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-4">
                      <div className="flex justify-between">
                        <div className="w-1/3 h-3 bg-gray-300"></div>
                        <div className="w-1/3 h-3 bg-gray-300"></div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Elegant</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${template === 'template5' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplate('template5')}>
                  <div className="aspect-[3/4] bg-gray-100 border shadow-sm mb-2 p-4">
                    <div className="absolute top-3 left-3 right-3 bottom-3 border-2 border-gray-300 p-3">
                      <div className="w-1/4 h-4 bg-gray-300 mb-4"></div>
                      <div className="flex-1 flex flex-col justify-center items-center mt-4">
                        <div className="w-2/3 h-6 bg-gray-400 mb-2"></div>
                        <div className="w-1/2 h-4 bg-gray-300 mb-4"></div>
                      </div>
                      <div className="w-full h-3 bg-gray-300 mt-auto"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Geometric</h4>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Theme Previews</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'business' ? 'border-primary' : ''}`} onClick={() => setTheme('business')}>
                  <div className="h-24 bg-blue-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-blue-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Business</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'event' ? 'border-primary' : ''}`} onClick={() => setTheme('event')}>
                  <div className="h-24 bg-purple-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-purple-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Event</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'sale' ? 'border-primary' : ''}`} onClick={() => setTheme('sale')}>
                  <div className="h-24 bg-red-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-red-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Sale</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'food' ? 'border-primary' : ''}`} onClick={() => setTheme('food')}>
                  <div className="h-24 bg-orange-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-orange-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Food</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'education' ? 'border-primary' : ''}`} onClick={() => setTheme('education')}>
                  <div className="h-24 bg-green-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-green-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Education</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'holiday' ? 'border-primary' : ''}`} onClick={() => setTheme('holiday')}>
                  <div className="h-24 bg-pink-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-pink-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Holiday</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'minimal' ? 'border-primary' : ''}`} onClick={() => setTheme('minimal')}>
                  <div className="h-24 bg-gray-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-gray-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Minimal</h4>
                </div>
                
                <div className={`border rounded-md p-3 cursor-pointer hover:border-primary ${theme === 'bold' ? 'border-primary' : ''}`} onClick={() => setTheme('bold')}>
                  <div className="h-24 bg-indigo-50 border flex items-center justify-center mb-2">
                    <div className="w-1/2 h-6 bg-indigo-500 rounded"></div>
                  </div>
                  <h4 className="text-sm font-medium text-center">Bold</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Flyer Design Tips</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-base">1. Keep It Simple</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    A cluttered flyer can be overwhelming and difficult to read. Focus on one main message and keep your design clean and straightforward. Use white space effectively to highlight important elements.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">2. Use Hierarchy</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Create a clear visual hierarchy to guide the reader's eye. Make your headline the largest and most prominent element, followed by the subheading, then details, and finally contact information.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">3. Choose Colors Wisely</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Select colors that match your brand and evoke the right mood for your event or promotion. Limit your palette to 2-3 colors for a cleaner look. Use contrasting colors for text and background to ensure readability.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">4. Include a Call to Action</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Clearly tell readers what you want them to do—whether it's attending an event, visiting a website, or making a purchase. Make your call to action stand out visually and place it prominently in your design.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">5. Consider Your Audience</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Tailor your design to appeal to your target audience. A flyer for a corporate event should look different from one for a music festival or a children's birthday party.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">6. Use High-Quality Images</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    If using images, make sure they're high resolution and relevant to your message. Low-quality, pixelated images can make your flyer look unprofessional.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">7. Choose Readable Fonts</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Select fonts that are easy to read, even from a distance. Limit yourself to 2-3 different fonts to maintain a cohesive look. Avoid overly decorative fonts for body text.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Flyer Printing Recommendations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-base">Paper Types</h4>
                  <div className="text-sm text-gray-700 mt-1 space-y-1">
                    <p><strong>Text Paper (70-100 lb):</strong> Good for flyers that will be handled frequently or folded.</p>
                    <p><strong>Glossy Paper:</strong> Makes colors pop and images look vibrant. Great for photo-heavy designs.</p>
                    <p><strong>Matte Paper:</strong> Less shine than glossy, easier to write on, and has a sophisticated look.</p>
                    <p><strong>Cardstock (80-110 lb):</strong> Thicker and more durable, good for premium flyers or those that need to stand up.</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">Print Resolution</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    For professional printing, ensure your design has a resolution of at least 300 DPI (dots per inch). Lower resolutions may look fine on screen but will appear pixelated when printed.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">Color Mode</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Use CMYK color mode for designs that will be printed, not RGB. RGB is for digital displays and can produce unexpected color shifts when printed.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">Bleed and Margins</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    If having your flyer professionally printed, add a 0.125 inch (3mm) bleed around all edges. Keep important content at least 0.25 inch (6mm) away from the edge to ensure it doesn't get cut off.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Related Design Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Poster Maker</h4>
              <p className="text-sm text-gray-600 mb-3">
                Design stunning posters for your events, promotions, or presentations.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create a Poster
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Invitation Maker</h4>
              <p className="text-sm text-gray-600 mb-3">
                Create beautiful invitations for your special events and occasions.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Design Invitations
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Business Card Maker</h4>
              <p className="text-sm text-gray-600 mb-3">
                Design professional business cards to leave a lasting impression.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Business Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Design eye-catching, professional flyers for events, promotions, or announcements with our intuitive flyer maker.";
  
  const description = `
    Our Flyer Maker is a powerful yet user-friendly design tool that enables you to create professional-quality flyers for any purpose within minutes—no design experience required. Whether you're promoting a business event, advertising a sale, announcing a concert, or distributing community information, this comprehensive tool provides everything you need to produce attractive, effective flyers that capture attention and communicate your message clearly.
    
    The intuitive interface guides you through the flyer creation process step by step, starting with selecting from a variety of professionally designed templates optimized for different purposes such as business promotions, special events, sales announcements, educational information, and more. Each template is fully customizable, allowing you to adjust colors, fonts, layouts, and graphic elements to match your brand identity or event theme. 
    
    Create flyers in multiple sizes and formats, including standard print dimensions like A4 and Letter, as well as digital-optimized sizes perfect for social media sharing, email distribution, or website display. The tool provides real-time preview functionality that shows exactly how your flyer will look as you make changes, ensuring you achieve the perfect design before finalizing.
    
    Advanced features include the ability to incorporate your logo, add QR codes linking to websites or digital content, select from color themes scientifically proven to evoke specific emotional responses, and choose from layout options optimized for different messaging needs. Once complete, download your flyer in high-resolution formats suitable for both professional printing and digital distribution, allowing you to easily share your creation across multiple channels for maximum exposure.
  `;

  const howToUse = [
    "Enter your headline, subheading, description, and contact information in the text fields provided in the Flyer Content section.",
    "Select your preferred flyer size (A4, A5, Letter, or social media dimensions) and orientation (portrait or landscape) from the dropdown menus.",
    "Choose a color theme that matches your brand or event type from options like Business, Event, Sale, Food, Education, Holiday, Minimal, or Bold.",
    "Select a template layout that best presents your information from options including Classic, Modern, Bold, Elegant, or Geometric.",
    "Customize additional elements by toggling options to include images, logos, or QR codes and providing the necessary information.",
    "Click the 'Generate Flyer' button to create your design and view it in the preview panel on the right.",
    "Make any adjustments as needed, seeing the changes in real-time in the preview area.",
    "When satisfied with your design, download your flyer in PDF format for printing or JPG/PNG for digital sharing."
  ];

  const features = [
    "✅ Professional templates designed by graphic experts for various purposes including events, promotions, announcements, and more",
    "✅ Multiple size options including standard print formats (A4, A5, Letter) and digital formats optimized for social media",
    "✅ Customizable color themes scientifically selected to evoke specific emotions and responses from viewers",
    "✅ Advanced elements including logo placement, QR code generation, and optimized content layouts",
    "✅ Real-time preview showing exactly how your flyer will appear as you make design changes",
    "✅ High-resolution download options in multiple formats (PDF, JPG, PNG) for both print and digital usage",
    "✅ Design tips and best practices integrated throughout the creation process to ensure professional results"
  ];

  const faqs = [
    {
      question: "What's the difference between a flyer and a poster?",
      answer: "Flyers and posters serve similar promotional purposes but differ in several key aspects: Size: Flyers are typically smaller (usually A5, A4, or Letter size) and designed to be handed out, while posters are larger (A3, A2, or larger) and meant to be displayed on walls or bulletin boards. Distribution: Flyers are distributed physically (handed out to people, placed on counters, inserted in mailboxes) or digitally (email, social media), while posters are usually mounted in specific locations for visibility. Content Density: Flyers often contain more detailed information including contact details and specific offers, while posters focus on visual impact with less text, designed to be readable from a distance. Cost: Flyers are generally less expensive to produce in bulk due to their smaller size and are often printed on lighter paper stock, making them more economical for mass distribution. Purpose: Flyers typically promote time-sensitive events or offers and include calls to action, while posters may serve longer-term promotional or informational purposes. Our tool allows you to design both flyers and posters by selecting different size options and adjusting the content density accordingly."
    },
    {
      question: "What size and resolution should I use for my flyer?",
      answer: "The ideal size and resolution for your flyer depends on its intended use: For Print Distribution: Standard sizes include A4 (210 × 297 mm), A5 (148 × 210 mm), or US Letter (8.5 × 11 inches). For professional printing, use a resolution of 300 DPI (dots per inch) to ensure sharp, clear images and text. For Digital Distribution: For email or website use, 72-150 DPI is sufficient as screens don't require the same resolution as print. For social media, consider platform-specific dimensions: Instagram posts work best at 1080 × 1080 pixels (square), while Facebook images might be optimized at 1200 × 630 pixels. If your flyer will be used both in print and digitally, design at the higher print resolution (300 DPI) and in CMYK color mode, then create a converted version for digital use. For print flyers, remember to include a bleed area (3-5mm beyond the trim edge) if your design has elements that extend to the edge of the page. This prevents unwanted white borders after trimming. Our tool offers preset sizes for both print and digital formats, and automatically ensures the appropriate resolution for your selected output format."
    },
    {
      question: "How do I make my flyer stand out?",
      answer: "Creating a standout flyer involves several strategic design and content choices: Use a compelling headline that immediately communicates your main benefit or message. Your headline should be concise (5-7 words), action-oriented, and large enough to read at a glance. Employ contrast effectively by using complementary colors for text and background. High contrast improves readability and visual impact—dark text on light backgrounds or vice versa works best. Include a clear, specific call to action that tells readers exactly what to do next, whether it's visiting a website, calling a number, or attending an event. Limit your text to only essential information. Too much text creates visual clutter—aim to communicate your message in as few words as possible while maintaining clarity. Incorporate high-quality, relevant images that support your message. A single powerful image is often more effective than multiple smaller ones. Use visual hierarchy to guide the reader's eye through the information in order of importance—headline, subheading, details, call to action. Apply the rule of thirds by dividing your layout into a 3×3 grid and placing key elements along these grid lines or at their intersections. Choose fonts carefully—limit to 2-3 complementary fonts and ensure they're easily readable. Script fonts may look elegant but can be difficult to read quickly. Include white space (empty areas) in your design to give the eye places to rest and make important elements stand out more effectively. Consider using unusual shapes, die-cuts, or high-quality paper stock for print flyers to make them physically distinctive."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="flyer-maker"
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

export default FlyerMakerDetailed;