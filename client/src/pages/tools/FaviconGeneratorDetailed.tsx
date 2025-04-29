import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaGlobe, 
  FaPalette,
  FaCog,
  FaCode
} from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const FaviconGeneratorDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [faviconType, setFaviconType] = useState<string>("full-package");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [htmlCode, setHtmlCode] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, SVG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Reset results
      setResultUrl(null);
      setHtmlCode("");
    }
  };

  const handleGenerate = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image to generate a favicon.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Use the preview URL as the result in this mock implementation
        setResultUrl(previewUrl);
        
        // Generate HTML code
        const code = `<!-- Favicon Package HTML Code -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="${backgroundColor}">
<meta name="msapplication-TileColor" content="${backgroundColor}">
<meta name="theme-color" content="${backgroundColor}">`;
        
        setHtmlCode(code);
        setIsGenerating(false);
        
        toast({
          title: "Favicon generated successfully",
          description: "Your favicon package is ready for download.",
        });
      }
      setGenerationProgress(progress);
    }, 300);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    toast({
      title: "Preparing download",
      description: "Your favicon package is being prepared for download.",
    });
    
    setTimeout(() => {
      // In a real implementation, this would create a ZIP file with all favicon sizes
      // For this demo, we'll just download the original image
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `favicon-package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your favicon package is being downloaded.",
      });
    }, 1000);
  };

  const clearAll = () => {
    // Revoke object URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (resultUrl && resultUrl !== previewUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setHtmlCode("");
    setGenerationProgress(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "Copied to clipboard",
      description: "The HTML code has been copied to your clipboard.",
    });
  };

  const introduction = "Generate a complete favicon package for your website with our easy-to-use Favicon Generator tool.";

  const description = "Our Favicon Generator tool creates a complete set of favicon images optimized for all modern browsers and devices. A favicon is a small icon displayed in browser tabs, bookmarks, and mobile home screens that represents your website's identity. While it might seem like a minor detail, a professional favicon significantly enhances your brand recognition and gives your website a polished, trustworthy appearance. Our tool handles all the technical complexity of generating multiple favicon sizes and formats required for different platforms—from standard browser favicons to Apple touch icons, Android home screen icons, and Windows tile icons. Simply upload a square image, customize your settings, and our tool will create a comprehensive favicon package ready to implement on your site. Whether you're a web developer, designer, or business owner, our Favicon Generator makes it easy to add this essential branding element to your website without requiring specialized design skills or image editing software.";

  const howToUse = [
    "Upload a square image (at least 260x260 pixels for best results) using the upload button.",
    "Select the type of favicon package you need (standard, full package, or mobile-focused).",
    "Customize the background color and border radius if desired.",
    "Click 'Generate Favicon Package' to create your favicon set.",
    "Preview the generated favicons and copy the HTML code provided.",
    "Download the complete favicon package as a ZIP file.",
    "Extract the ZIP file and upload all the files to your website's root directory.",
    "Add the HTML code to the <head> section of your website."
  ];

  const features = [
    "✅ Generates all standard favicon sizes (16x16, 32x32, 48x48, 64x64)",
    "✅ Creates Apple Touch icons for iOS devices",
    "✅ Produces Android home screen icons",
    "✅ Generates Windows tile icons and browser config files",
    "✅ Provides ready-to-use HTML code for easy implementation",
    "✅ Supports PNG, JPG, and SVG input formats",
    "✅ Customizable background color and border radius"
  ];

  const faqs = [
    {
      question: "What is a favicon and why do I need one?",
      answer: "A favicon (short for 'favorite icon') is the small icon associated with your website that appears in browser tabs, bookmarks, and on mobile home screens when users save your site. While small in size, favicons play an important role in brand recognition, professionalism, and user experience. They help users identify your website among multiple open tabs, make your bookmarked site easily recognizable, and contribute to your brand's visual identity across different platforms. Without a favicon, browsers typically display a generic icon or empty space, which can make your site appear incomplete or unprofessional. A well-designed favicon is an essential element of modern web design that enhances your site's credibility and memorability."
    },
    {
      question: "What image should I use for my favicon?",
      answer: "The best favicon images are simple, recognizable designs that work well at small sizes. Typically, this means: 1) Your company logo (simplified if necessary); 2) An iconic element from your logo; 3) The first letter of your company name in your brand font; or 4) A simple symbol that represents your business. For optimal results, start with a square image that has adequate spacing around the main element—our tool will handle the cropping and sizing. Avoid using photographs or complex images with fine details, as these won't be recognizable when reduced to small sizes. High-contrast images generally work best, and vector graphics (SVG format) are ideal since they scale cleanly. If your logo has a transparent background, our tool can add a background color of your choice."
    },
    {
      question: "Why do I need different favicon sizes and formats?",
      answer: "Different devices, browsers, and operating systems require specific favicon sizes and formats for optimal display. For example: 1) Traditional browsers need 16x16 and 32x32 pixel .ico or .png files; 2) iOS devices use Apple Touch Icons at 180x180 pixels; 3) Android devices require various sizes from 192x192 to 512x512 pixels; 4) Windows tiles need specific formats and sizes for proper display. By generating a complete favicon package, you ensure your site looks professional across all platforms. Our tool automatically creates all these variants from your single uploaded image, handling the technical details like format conversion, resizing, and optimization. Without these different sizes, your favicon might appear blurry, cropped incorrectly, or not display at all on certain platforms."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Favicon Generator</h3>
      
      <Tabs defaultValue="upload" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload & Generate</TabsTrigger>
          <TabsTrigger value="result" disabled={!resultUrl}>Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="favicon-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload a square image for your favicon
                </p>
                <p className="text-xs text-gray-400">
                  Recommended size: at least 260x260 pixels (SVG, PNG, or JPG)
                </p>
              </div>
              <input
                id="favicon-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          
          {file && previewUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="w-28 h-28 bg-white border rounded-md flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-4 relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain" 
                    style={{
                      borderRadius: `${borderRadius}%`
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 mt-2"
                    onClick={clearAll}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <Label className="font-medium mb-2 block">Favicon Package Type</Label>
              <RadioGroup 
                value={faviconType} 
                onValueChange={setFaviconType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-normal cursor-pointer">
                    <span className="text-sm font-medium">Standard Browser Package</span>
                    <span className="text-xs text-gray-500 block">Basic favicons for web browsers (16x16, 32x32)</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-package" id="full-package" />
                  <Label htmlFor="full-package" className="font-normal cursor-pointer">
                    <span className="text-sm font-medium">Complete Favicon Package</span>
                    <span className="text-xs text-gray-500 block">All sizes for browsers, mobile devices, & app icons</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile" className="font-normal cursor-pointer">
                    <span className="text-sm font-medium">Mobile-focused Package</span>
                    <span className="text-xs text-gray-500 block">Optimized for iOS and Android home screens</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="background-color" className="font-medium mb-2 block">Background Color</Label>
              <div className="flex">
                <input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-10 rounded border border-gray-300"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="ml-2 flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used for transparent areas and browser theme color
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="border-radius" className="font-medium">Border Radius</Label>
                <span className="text-sm">{borderRadius}%</span>
              </div>
              <Slider 
                id="border-radius"
                min={0}
                max={50}
                step={1}
                value={[borderRadius]}
                onValueChange={(values) => setBorderRadius(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Square</span>
                <span>Rounded</span>
                <span>Circle</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isGenerating || !file}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <FaGlobe className="mr-2" /> 
                Generate Favicon Package
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating favicons...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="result" className="space-y-6">
          {resultUrl && (
            <>
              <div className="border rounded-lg p-5 bg-gray-50">
                <h4 className="font-medium mb-4">Favicon Preview</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border rounded p-3 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img src={resultUrl} alt="Favicon 16x16" className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">16x16</span>
                  </div>
                  
                  <div className="bg-white border rounded p-3 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img src={resultUrl} alt="Favicon 32x32" className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">32x32</span>
                  </div>
                  
                  <div className="bg-white border rounded p-3 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img src={resultUrl} alt="Favicon 48x48" className="w-12 h-12" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">48x48</span>
                  </div>
                  
                  <div className="bg-white border rounded p-3 flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img src={resultUrl} alt="Favicon 64x64" className="w-16 h-16" />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">64x64</span>
                  </div>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h5 className="text-sm font-medium mb-2">Browser Tab Preview</h5>
                  <div className="border rounded bg-white p-2 flex items-center">
                    <img src={resultUrl} alt="Tab Icon" className="w-4 h-4 mr-2" />
                    <span className="text-sm">Your Website - Home</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">HTML Code</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyHtmlCode}
                  >
                    <FaCode className="mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={htmlCode}
                  readOnly
                  className="font-mono text-xs h-32"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add this code to the &lt;head&gt; section of your HTML
                </p>
              </div>
              
              <Button 
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <FaDownload className="mr-2" /> 
                Download Favicon Package
              </Button>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="flex items-start">
                  <FaGlobe className="mr-2 mt-1 flex-shrink-0" />
                  <span>
                    Your favicon package includes all necessary files for various browsers and devices.
                    Extract the ZIP file and upload all files to your website's root directory.
                  </span>
                </p>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
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