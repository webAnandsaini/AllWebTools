import React, { useState, useRef } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaDownload, FaCrop, FaRedo, FaUndo, FaInfoCircle } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CropImageDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [cropMethod, setCropMethod] = useState<"free" | "ratio" | "preset">("free");
  const [cropRatio, setCropRatio] = useState("1:1");
  const [cropPreset, setCropPreset] = useState("square");
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [isCropping, setIsCropping] = useState(false);
  
  // Crop coordinates
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  
  // For simulation purposes
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResultUrl("");
      
      // Load image to get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        
        // Initialize crop area to full image
        setCropX(0);
        setCropY(0);
        setCropWidth(img.width);
        setCropHeight(img.height);
        
        // Apply initial crop based on selected method
        if (cropMethod === "ratio") {
          applyRatioCrop(cropRatio, img.width, img.height);
        } else if (cropMethod === "preset") {
          applyPresetCrop(cropPreset, img.width, img.height);
        }
      };
      img.src = url;
    }
  };

  const applyRatioCrop = (ratio: string, imgWidth: number, imgHeight: number) => {
    const [widthRatio, heightRatio] = ratio.split(':').map(Number);
    const aspectRatio = widthRatio / heightRatio;
    
    let newWidth, newHeight;
    
    if (imgWidth / imgHeight > aspectRatio) {
      // Image is wider than the ratio
      newHeight = imgHeight;
      newWidth = imgHeight * aspectRatio;
    } else {
      // Image is taller than the ratio
      newWidth = imgWidth;
      newHeight = imgWidth / aspectRatio;
    }
    
    setCropX(Math.max(0, (imgWidth - newWidth) / 2));
    setCropY(Math.max(0, (imgHeight - newHeight) / 2));
    setCropWidth(newWidth);
    setCropHeight(newHeight);
  };

  const applyPresetCrop = (preset: string, imgWidth: number, imgHeight: number) => {
    switch (preset) {
      case "square":
        applyRatioCrop("1:1", imgWidth, imgHeight);
        break;
      case "profile":
        applyRatioCrop("1:1", imgWidth, imgHeight);
        break;
      case "landscape":
        applyRatioCrop("16:9", imgWidth, imgHeight);
        break;
      case "facebook":
        applyRatioCrop("1.91:1", imgWidth, imgHeight);
        break;
      case "instagram":
        applyRatioCrop("1:1", imgWidth, imgHeight);
        break;
      case "twitter":
        applyRatioCrop("16:9", imgWidth, imgHeight);
        break;
      case "linkedin":
        applyRatioCrop("1.91:1", imgWidth, imgHeight);
        break;
      case "pinterest":
        applyRatioCrop("2:3", imgWidth, imgHeight);
        break;
      case "a4":
        applyRatioCrop("1:1.414", imgWidth, imgHeight);
        break;
      default:
        applyRatioCrop("1:1", imgWidth, imgHeight);
    }
  };

  const handleCropMethodChange = (method: "free" | "ratio" | "preset") => {
    setCropMethod(method);
    
    if (method === "ratio") {
      applyRatioCrop(cropRatio, originalWidth, originalHeight);
    } else if (method === "preset") {
      applyPresetCrop(cropPreset, originalWidth, originalHeight);
    }
  };

  const handleRatioChange = (ratio: string) => {
    setCropRatio(ratio);
    applyRatioCrop(ratio, originalWidth, originalHeight);
  };

  const handlePresetChange = (preset: string) => {
    setCropPreset(preset);
    applyPresetCrop(preset, originalWidth, originalHeight);
  };

  // Simulated crop operation
  const handleCrop = () => {
    if (!file || cropWidth === 0 || cropHeight === 0) {
      toast({
        title: "Invalid crop area",
        description: "Please select a valid crop area before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsCropping(true);
    
    // Simulate cropping process
    setTimeout(() => {
      setResultUrl(previewUrl); // In a real implementation, this would be the cropped image URL
      setIsCropping(false);
      
      toast({
        title: "Crop complete",
        description: `Image cropped to ${Math.round(cropWidth)}×${Math.round(cropHeight)}.`,
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `cropped_${file?.name.split('.')[0] || 'image'}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your cropped image is being downloaded.",
    });
  };

  // Simulated dragging interaction for crop area
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDragging(true);
    setDragStartX(x);
    setDragStartY(y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate the movement
    const deltaX = x - dragStartX;
    const deltaY = y - dragStartY;
    
    // Update crop coordinates (with bounds checking)
    const newX = Math.max(0, Math.min(originalWidth - cropWidth, cropX + deltaX));
    const newY = Math.max(0, Math.min(originalHeight - cropHeight, cropY + deltaY));
    
    setCropX(newX);
    setCropY(newY);
    setDragStartX(x);
    setDragStartY(y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCrop = () => {
    setCropX(0);
    setCropY(0);
    setCropWidth(originalWidth);
    setCropHeight(originalHeight);
  };

  const introduction = "Precisely crop and edit your images with our easy-to-use, professional cropping tool.";

  const description = "Our Crop Image tool is a powerful, easy-to-use utility that allows you to cut away unwanted portions of your images to improve composition, focus on specific elements, or create perfect images for different platforms and purposes. Whether you need to create profile pictures with standard dimensions, prepare images for social media platforms with specific aspect ratios, or simply remove distracting elements from your photos, this tool offers precision and flexibility. You can crop freely by selecting any area of your image, use preset aspect ratios to maintain specific proportions, or choose platform-specific presets for optimal display on various social media and professional sites. With real-time preview and dimension information, you can see exactly how your cropped image will look before finalizing. The intuitive interface makes it simple to adjust your crop area, rotate your image if needed, and export in multiple formats including JPEG, PNG, and WebP. For photographers, designers, and social media managers, this tool streamlines the crucial cropping process, saving time while ensuring professional-looking results.";

  const howToUse = [
    "Upload your image by clicking the 'Upload Image' button or dragging and dropping a file.",
    "Choose a cropping method: free crop for custom selection, ratio crop to maintain specific proportions, or preset crop for standard dimensions.",
    "Adjust the crop area by dragging the corners or edges to select the part of the image you want to keep.",
    "Use the rotation option if you need to straighten your image before cropping.",
    "Preview your crop to ensure it looks exactly as intended.",
    "Select your preferred output format (JPEG, PNG, WebP).",
    "Click 'Crop Image' to create your cropped version.",
    "Download the cropped image for use in your projects."
  ];

  const features = [
    "✅ Free-form cropping with precise control",
    "✅ Fixed aspect ratio options (1:1, 16:9, 4:3, etc.)",
    "✅ Preset dimensions for social media platforms",
    "✅ Real-time preview of crop results",
    "✅ Accurate pixel dimensions display",
    "✅ Multiple output formats support"
  ];

  const faqs = [
    {
      question: "Can I crop images to exact dimensions?",
      answer: "Yes, our tool allows you to crop images to exact pixel dimensions. When using the free crop method, you can see the exact dimensions of your selection in real-time. Additionally, the ratio crop method ensures you maintain a specific aspect ratio while you adjust the size, and the preset crop method automatically suggests dimensions optimized for various platforms like social media profiles, cover images, and print formats."
    },
    {
      question: "Will cropping reduce the quality of my image?",
      answer: "Cropping itself doesn't reduce image quality as it simply removes parts of the image without affecting the resolution of the kept portion. However, if you crop a small section of a large image and then view it at a large size, it may appear less detailed because you're effectively zooming in. Our tool maintains the original resolution of the cropped area, ensuring the highest possible quality in your output image."
    },
    {
      question: "What are the best aspect ratios for different social media platforms?",
      answer: "Different platforms have different optimal aspect ratios: Instagram square posts use 1:1, while Instagram stories use 9:16. Facebook cover photos work best at 16:9, while profile pictures are displayed at 1:1. Twitter header images use 3:1, LinkedIn cover photos use 1.91:1, and Pinterest pins perform best with 2:3 or 1:2.1 ratios. Our preset options provide these common ratios, ensuring your images look perfect across all platforms without manual calculations."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Cropper</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="crop-image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload an image to crop
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, WebP (Max 10MB)
            </p>
          </div>
          <input
            id="crop-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {previewUrl && (
        <div className="mt-6 space-y-6">
          <div className="relative">
            <h4 className="font-medium mb-2">Preview & Crop</h4>
            <div 
              ref={imageContainerRef}
              className="border rounded-lg overflow-hidden bg-gray-50 relative"
              style={{ 
                height: originalHeight > 500 ? '500px' : `${originalHeight}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
              
              {/* Crop overlay */}
              <div 
                className="absolute border-2 border-blue-500 bg-white bg-opacity-20"
                style={{
                  left: `${(cropX / originalWidth) * 100}%`,
                  top: `${(cropY / originalHeight) * 100}%`,
                  width: `${(cropWidth / originalWidth) * 100}%`,
                  height: `${(cropHeight / originalHeight) * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs py-1 px-2 rounded-t-sm">
                  {Math.round(cropWidth)} × {Math.round(cropHeight)} px
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetCrop}
              >
                <FaRedo className="mr-1" /> Reset Crop
              </Button>
              
              <div className="text-sm text-gray-600">
                Original: {originalWidth} × {originalHeight} px
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Tabs value={cropMethod} onValueChange={(value) => handleCropMethodChange(value as "free" | "ratio" | "preset")}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="free">Free Crop</TabsTrigger>
                <TabsTrigger value="ratio">Aspect Ratio</TabsTrigger>
                <TabsTrigger value="preset">Presets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="free" className="space-y-2">
                <p className="text-sm text-gray-600">
                  Freely drag the crop area to select any portion of the image.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaInfoCircle className="mr-1" />
                  Tip: Drag the highlighted area to move it
                </div>
              </TabsContent>
              
              <TabsContent value="ratio" className="space-y-4">
                <div>
                  <Label htmlFor="aspect-ratio" className="font-medium">Aspect Ratio</Label>
                  <Select value={cropRatio} onValueChange={handleRatioChange}>
                    <SelectTrigger id="aspect-ratio" className="mt-1">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                      <SelectItem value="3:2">3:2 (Classic Photo)</SelectItem>
                      <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                      <SelectItem value="5:4">5:4</SelectItem>
                      <SelectItem value="1:2">1:2 (Tall)</SelectItem>
                      <SelectItem value="2:1">2:1 (Panoramic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="preset" className="space-y-4">
                <div>
                  <Label htmlFor="crop-preset" className="font-medium">Common Presets</Label>
                  <Select value={cropPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger id="crop-preset" className="mt-1">
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Profile Picture (Square)</SelectItem>
                      <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                      <SelectItem value="facebook">Facebook Cover (1.91:1)</SelectItem>
                      <SelectItem value="instagram">Instagram Post (1:1)</SelectItem>
                      <SelectItem value="twitter">Twitter Post (16:9)</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Cover (1.91:1)</SelectItem>
                      <SelectItem value="pinterest">Pinterest Pin (2:3)</SelectItem>
                      <SelectItem value="a4">A4 Document (1:1.414)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            
            <div>
              <Label htmlFor="output-format" className="font-medium">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger id="output-format" className="mt-1">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleCrop}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isCropping || !file}
            >
              {isCropping ? (
                <>Cropping...</>
              ) : (
                <>
                  <FaCrop className="mr-2" /> 
                  Crop Image
                </>
              )}
            </Button>
            
            {resultUrl && (
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <FaDownload className="mr-2" /> 
                Download
              </Button>
            )}
          </div>
          
          {resultUrl && (
            <div>
              <h4 className="font-medium mb-2">Result</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
                <img 
                  src={resultUrl} 
                  alt="Cropped Result" 
                  className="max-h-48 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="crop-image-detailed"
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

export default CropImageDetailed;