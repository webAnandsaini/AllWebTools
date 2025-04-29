import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaStar, 
  FaImage, 
  FaCode, 
  FaApple, 
  FaAndroid, 
  FaWindows, 
  FaGlobe 
} from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const FaviconGeneratorDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  
  // Options
  const [generateAll, setGenerateAll] = useState(true);
  const [includeApple, setIncludeApple] = useState(true);
  const [includeAndroid, setIncludeAndroid] = useState(true);
  const [includeMicrosoft, setIncludeMicrosoft] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [shapeOption, setShapeOption] = useState("square");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setGeneratedUrls([]);
      setShowCode(false);
    }
  };

  const handleGenerate = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedUrls([]);
    
    // Simulate favicon generation process
    setTimeout(() => {
      // Mock result URLs for demonstration
      const mockUrls = [
        { size: "16x16", url: previewUrl },
        { size: "32x32", url: previewUrl },
        { size: "48x48", url: previewUrl },
        { size: "64x64", url: previewUrl },
        { size: "180x180", url: previewUrl }, // Apple touch icon
        { size: "192x192", url: previewUrl }, // Android
        { size: "512x512", url: previewUrl }, // Android
      ].map(item => item.url);
      
      setGeneratedUrls(mockUrls);
      setIsGenerating(false);
      
      toast({
        title: "Favicons generated",
        description: "Your favicon package is ready to download.",
      });
    }, 2000);
  };

  const handleDownload = () => {
    if (generatedUrls.length === 0) return;
    
    toast({
      title: "Download started",
      description: "Your favicon package is being downloaded.",
    });
    
    // In a real implementation, this would create a zip file with all favicon sizes
  };

  const getFaviconCode = () => {
    return `<!-- Standard Favicon -->
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">

<!-- Android Icon -->
<link rel="manifest" href="site.webmanifest">

<!-- Microsoft Tiles -->
<meta name="msapplication-TileColor" content="${backgroundColor}">
<meta name="msapplication-TileImage" content="mstile-144x144.png">`;
  };

  const introduction = "Create beautiful, professional favicons for your website in all required formats and sizes.";

  const description = "Our Favicon Generator is a comprehensive tool that converts any logo or image into a complete set of favicons for your website, web application, or progressive web app. Favicons are essential for brand recognition, providing a visual identifier for your site in browser tabs, bookmarks, and mobile home screens. This tool not only creates the standard favicon.ico file but also generates all required sizes and formats for modern browsers and devices, including Apple touch icons, Android app icons, and Microsoft tile images. Simply upload your logo or image, customize settings like background color and icon shape, and our tool handles the complex resizing and optimization process. The generator ensures your favicon displays properly across all platforms by creating the appropriate image sizes and HTML code. After generation, you can download a complete package with all favicon files and ready-to-use HTML code that you can easily add to your website.";

  const howToUse = [
    "Upload your logo or image by clicking the 'Upload Image' button (square images work best).",
    "Customize options such as background color, icon shape, and platform support.",
    "Click 'Generate Favicons' to create all necessary favicon sizes and formats.",
    "Preview the generated favicons in different sizes and contexts.",
    "Copy the HTML code provided to add to your website's <head> section.",
    "Download the complete favicon package containing all necessary files."
  ];

  const features = [
    "✅ Generate all standard favicon sizes (16x16, 32x32, 48x48, 64x64)",
    "✅ Create platform-specific icons for Apple, Android, and Microsoft devices",
    "✅ Customize background color and shape for better brand consistency",
    "✅ Get ready-to-use HTML code for simple implementation",
    "✅ Download a complete package with all necessary files",
    "✅ Preview your favicon in browser tabs and on different devices"
  ];

  const faqs = [
    {
      question: "What's the best image to use for a favicon?",
      answer: "The ideal image for a favicon is a simple, recognizable design with a limited color palette. Logos or brand symbols work best. We recommend using a square image (at least 512x512 pixels) with your design centered and some space around the edges. Since favicons appear quite small in browser tabs, avoid complex designs with small details as they won't be visible at smaller sizes."
    },
    {
      question: "How do I add the favicons to my website?",
      answer: "After generating your favicons, you need to: 1) Download the favicon package containing all the necessary files; 2) Upload all the favicon files to the root directory of your website; 3) Copy the provided HTML code from our tool; 4) Paste the HTML code into the <head> section of your website's HTML. This ensures browsers and devices can find and display the appropriate favicon version."
    },
    {
      question: "Why do I need different favicon sizes?",
      answer: "Different devices and platforms require different favicon sizes for optimal display. Standard browsers use the 16x16, 32x32, and 48x48 pixel versions. Apple devices need specific 'Apple Touch Icons' for home screen shortcuts (typically 180x180 pixels). Android uses 192x192 and 512x512 pixel icons for Progressive Web Apps and homescreen shortcuts. Microsoft Windows requires special tile images for pinned sites. Our generator creates all these variations to ensure your site looks professional across all platforms."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Favicon Generator</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="favicon-image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload your logo or icon (square image recommended)
            </p>
            <p className="text-xs text-gray-400">
              Supports PNG, JPG, SVG (Max 2MB)
            </p>
          </div>
          <input
            id="favicon-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {previewUrl && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Image Preview</h4>
          <div className="flex justify-center">
            <div className="border rounded-lg overflow-hidden bg-gray-50 p-4 inline-flex flex-col items-center">
              <img 
                src={previewUrl} 
                alt="Original" 
                className="max-h-32 max-w-32 object-contain mb-3"
              />
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto border bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img src={previewUrl} alt="16x16" className="w-4 h-4 object-contain" />
                  </div>
                  <p className="text-xs mt-1">16x16</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto border bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img src={previewUrl} alt="32x32" className="w-6 h-6 object-contain" />
                  </div>
                  <p className="text-xs mt-1">32x32</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto border bg-white rounded-md flex items-center justify-center overflow-hidden">
                    <img src={previewUrl} alt="48x48" className="w-8 h-8 object-contain" />
                  </div>
                  <p className="text-xs mt-1">48x48</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 space-y-4">
        <Tabs defaultValue="options">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="space-y-4">
            <div>
              <Label htmlFor="background-color" className="font-medium">Background Color</Label>
              <div className="flex mt-1">
                <input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="ml-2 p-2 rounded border flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used for transparent icons and Microsoft tiles
              </p>
            </div>
            
            <div>
              <Label className="font-medium">Icon Shape</Label>
              <RadioGroup value={shapeOption} onValueChange={setShapeOption} className="mt-2">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="square" id="shape-square" />
                    <Label htmlFor="shape-square">Square</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rounded" id="shape-rounded" />
                    <Label htmlFor="shape-rounded">Rounded</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="circle" id="shape-circle" />
                    <Label htmlFor="shape-circle">Circle</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="generate-all" className="font-medium">Generate All Sizes</Label>
                <p className="text-xs text-gray-500">Create all standard favicon sizes</p>
              </div>
              <Switch 
                id="generate-all" 
                checked={generateAll}
                onCheckedChange={setGenerateAll}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="platforms" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaApple className="mr-2 text-gray-700" />
                <div>
                  <Label htmlFor="include-apple" className="font-medium">Apple Touch Icons</Label>
                  <p className="text-xs text-gray-500">For iOS home screens</p>
                </div>
              </div>
              <Switch 
                id="include-apple" 
                checked={includeApple}
                onCheckedChange={setIncludeApple}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaAndroid className="mr-2 text-gray-700" />
                <div>
                  <Label htmlFor="include-android" className="font-medium">Android Icons</Label>
                  <p className="text-xs text-gray-500">For PWAs and shortcuts</p>
                </div>
              </div>
              <Switch 
                id="include-android" 
                checked={includeAndroid}
                onCheckedChange={setIncludeAndroid}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaWindows className="mr-2 text-gray-700" />
                <div>
                  <Label htmlFor="include-microsoft" className="font-medium">Microsoft Tiles</Label>
                  <p className="text-xs text-gray-500">For Windows pinned sites</p>
                </div>
              </div>
              <Switch 
                id="include-microsoft" 
                checked={includeMicrosoft}
                onCheckedChange={setIncludeMicrosoft}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isGenerating || !file}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <FaStar className="mr-2" /> 
              Generate Favicons
            </>
          )}
        </Button>
      </div>
      
      {generatedUrls.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="font-medium">Generated Favicons</h4>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 bg-gray-50 p-3 rounded-lg border">
            {generatedUrls.map((url, index) => (
              <div key={index} className="text-center">
                <div className="border bg-white rounded-md p-2 mx-auto flex items-center justify-center">
                  <img src={url} alt={`Favicon ${index}`} className="w-full h-full object-contain" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <h4 className="font-medium">HTML Code</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              <FaCode className="mr-2" />
              {showCode ? "Hide Code" : "Show Code"}
            </Button>
          </div>
          
          {showCode && (
            <Textarea
              value={getFaviconCode()}
              readOnly
              className="font-mono text-xs h-40"
            />
          )}
          
          <div className="mt-4 flex space-x-4">
            <Button 
              onClick={handleDownload}
              className="flex-1"
            >
              <FaDownload className="mr-2" /> 
              Download Package
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(getFaviconCode());
                toast({
                  title: "Code copied",
                  description: "HTML code copied to clipboard.",
                });
              }}
            >
              <FaCode className="mr-2" /> 
              Copy HTML
            </Button>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <div className="flex items-start">
              <FaGlobe className="mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Implementation Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 mt-1">
                  <li>Download the favicon package</li>
                  <li>Extract and upload all files to your website's root directory</li>
                  <li>Add the HTML code to the &lt;head&gt; section of your website</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="favicon-generator-detailed"
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

export default FaviconGeneratorDetailed;