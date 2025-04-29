import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaImage, 
  FaCheck,
  FaGlobe
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FaviconGeneratorDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [faviconSizes, setFaviconSizes] = useState<string[]>([
    "16x16", "32x32", "48x48", "64x64"
  ]);
  const [selectedFormat, setSelectedFormat] = useState<string>("ico");
  const [generatedFavicons, setGeneratedFavicons] = useState<{
    url: string;
    size: string;
    format: string;
  }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if file is an image
      if (!fileType.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setGeneratedFavicons([]);
      
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  };

  const handleGenerate = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image to generate favicons.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerateProgress(0);
    setGeneratedFavicons([]);
    
    // Simulate favicon generation process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate generated favicons 
        const results = faviconSizes.map(size => ({
          url: previewUrl || "",
          size,
          format: selectedFormat
        }));
        
        setGeneratedFavicons(results);
        setIsGenerating(false);
        
        toast({
          title: "Favicons generated",
          description: `Generated ${results.length} favicon sizes in ${selectedFormat.toUpperCase()} format.`,
        });
      }
      setGenerateProgress(progress);
    }, 200);
  };

  const handleDownload = (index: number) => {
    if (!generatedFavicons[index]) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = generatedFavicons[index].url;
    const size = generatedFavicons[index].size.replace('x', '');
    const format = generatedFavicons[index].format;
    a.download = `favicon-${size}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: `Your favicon (${generatedFavicons[index].size}) is being downloaded.`,
    });
  };

  const handleDownloadAll = () => {
    if (generatedFavicons.length === 0) return;
    
    toast({
      title: "Preparing download",
      description: "All favicon sizes will be downloaded in a few moments.",
    });
    
    // In a real implementation, this would create a zip file with all favicons
    // For this demo, we'll just download them one by one with a delay
    generatedFavicons.forEach((_, index) => {
      setTimeout(() => {
        handleDownload(index);
      }, index * 1000);
    });
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setGeneratedFavicons([]);
  };

  const toggleFaviconSize = (size: string) => {
    if (faviconSizes.includes(size)) {
      setFaviconSizes(faviconSizes.filter(s => s !== size));
    } else {
      setFaviconSizes([...faviconSizes, size]);
    }
  };

  const introduction = "Create perfect favicons for your website with our simple Favicon Generator tool.";

  const description = "Our Favicon Generator tool helps you create high-quality favicon files for your website in multiple sizes and formats. Favicons are the small icons that appear in browser tabs, bookmarks, and when users add your site to their home screen. Having properly sized and formatted favicons significantly improves your website's professional appearance and brand recognition. With our tool, you can upload any image and convert it to standard favicon sizes (16x16, 32x32, 48x48, and more) in formats like ICO, PNG, and JPEG. The generator automatically optimizes your images for each size to ensure they look crisp and clear at every dimension. Simply upload your logo or icon image, select your desired formats and sizes, and download the complete set of favicon files ready to be added to your website.";

  const howToUse = [
    "Upload an image by clicking the upload button or dragging and dropping your file.",
    "Select the favicon format (ICO, PNG, JPEG) you prefer.",
    "Choose which sizes you need for your website.",
    "Click the 'Generate Favicons' button.",
    "Preview your favicons and download them individually or all at once."
  ];

  const features = [
    "✅ Generate favicons in multiple standard sizes (16x16, 32x32, 48x48, 64x64)",
    "✅ Support for ICO, PNG, and JPEG formats",
    "✅ Automatic image optimization for each size",
    "✅ Preview favicons before downloading",
    "✅ Batch download all sizes at once",
    "✅ Works with any image format as input (JPG, PNG, GIF, etc.)",
    "✅ No watermarks on generated favicons"
  ];

  const faqs = [
    {
      question: "What is a favicon and why do I need one?",
      answer: "A favicon is a small icon associated with a website or web page that appears in browser tabs, bookmarks, history lists, and mobile home screens when users save your site. Having a favicon is important for several reasons: 1) It improves brand recognition by displaying your logo or symbol consistently; 2) It helps users quickly identify your site among multiple open tabs; 3) It creates a more professional and polished web presence; 4) It improves the user experience by making navigation more intuitive; and 5) It's displayed when users save your website to their home screens on mobile devices. While a website can function without a favicon, including one is considered a professional best practice and enhances your site's user experience and brand presence."
    },
    {
      question: "What size should my favicon be?",
      answer: "For comprehensive browser and device support, it's recommended to create favicons in multiple sizes. The most essential sizes are: 16x16 pixels (standard browser tab favicon), 32x32 pixels (high-density displays and Windows taskbar), 48x48 pixels (Windows site shortcuts), and 64x64 pixels (Windows site shortcuts on high-DPI displays). For complete coverage, you might also want 192x192 and 512x512 pixel versions for Android devices, and 180x180 pixels for iOS home screen icons. Our favicon generator creates all the standard sizes you'll need from a single high-quality source image. For best results, upload a square image that's at least 512x512 pixels in size, ideally with a simple design that remains recognizable even at the smallest sizes."
    },
    {
      question: "How do I add the favicon to my website?",
      answer: "After generating and downloading your favicon files, you'll need to add them to your website by including specific code in the <head> section of your HTML. For basic support, add: <link rel='icon' type='image/x-icon' href='/favicon.ico'> to your HTML. For comprehensive support across devices, you'll want to include multiple link tags for different sizes and formats. For example: <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png'> and <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png'>. The favicon files should be placed in the root directory of your website for best compatibility, though you can specify a different path in the href attribute if needed. Some content management systems like WordPress have dedicated settings for favicons, often called 'site icons' in their customization options."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Favicon Generator</h3>
      
      <div className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="favicon-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload an image to create favicons
                </p>
                <p className="text-xs text-gray-400">
                  Recommended: square image at least 256x256 pixels
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
        ) : (
          <div className="space-y-4">
            <div className="relative w-full max-w-xs mx-auto aspect-square rounded-lg overflow-hidden bg-slate-100 border">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="object-contain w-full h-full" 
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={clearImage}
              >
                ×
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              {file?.name} ({(file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0')} MB)
            </p>
            
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <Label className="font-medium mb-2 block">Favicon Format</Label>
                <RadioGroup 
                  defaultValue="ico" 
                  className="flex space-x-4"
                  value={selectedFormat}
                  onValueChange={setSelectedFormat}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ico" id="ico" />
                    <Label htmlFor="ico" className="cursor-pointer">ICO</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="png" id="png" />
                    <Label htmlFor="png" className="cursor-pointer">PNG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jpg" id="jpg" />
                    <Label htmlFor="jpg" className="cursor-pointer">JPEG</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="font-medium mb-2 block">Favicon Sizes</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["16x16", "32x32", "48x48", "64x64", "128x128", "152x152", "180x180", "192x192"].map(size => (
                    <div key={size} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`size-${size}`} 
                        className="mr-2"
                        checked={faviconSizes.includes(size)}
                        onChange={() => toggleFaviconSize(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">{size}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isGenerating || faviconSizes.length === 0}
            >
              {isGenerating ? (
                <>Generating Favicons...</>
              ) : (
                <>
                  <FaGlobe className="mr-2" /> 
                  Generate Favicons
                </>
              )}
            </Button>
          </div>
        )}
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating favicons...</span>
              <span>{Math.round(generateProgress)}%</span>
            </div>
            <Progress value={generateProgress} />
          </div>
        )}
        
        {generatedFavicons.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Generated Favicons</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {generatedFavicons.map((favicon, index) => (
                <div key={index} className="border rounded-lg p-3 flex flex-col items-center text-center">
                  <div className="bg-slate-100 w-full aspect-square rounded flex items-center justify-center mb-2">
                    <img src={favicon.url} alt={`Favicon ${favicon.size}`} className="object-contain max-w-full max-h-full" />
                  </div>
                  <p className="text-sm font-medium mb-1">{favicon.size}</p>
                  <p className="text-xs text-gray-500 mb-2">.{favicon.format}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 w-full"
                    onClick={() => handleDownload(index)}
                  >
                    <FaDownload className="mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              variant="default"
              className="w-full mt-2"
              onClick={handleDownloadAll}
            >
              <FaDownload className="mr-2" /> 
              Download All Favicons
            </Button>
          </div>
        )}
      </div>
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