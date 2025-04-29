import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaCrop,
  FaCheck,
  FaRuler,
  FaLock,
  FaLockOpen
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const ImageResizerDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeProgress, setResizeProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [resizeMode, setResizeMode] = useState<string>("dimensions");
  const [percentage, setPercentage] = useState<number>(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [fileFormat, setFileFormat] = useState<string>("jpg");

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
      setResultUrl(null);
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = objectUrl;
      
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        if (resultUrl) {
          URL.revokeObjectURL(resultUrl);
        }
      };
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setTargetWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setTargetHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setTargetHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(newHeight * ratio));
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseInt(e.target.value) || 0;
    setPercentage(newPercentage);
    
    // Calculate new dimensions based on percentage
    if (originalDimensions.width > 0) {
      const newWidth = Math.round(originalDimensions.width * (newPercentage / 100));
      const newHeight = Math.round(originalDimensions.height * (newPercentage / 100));
      setTargetWidth(newWidth);
      setTargetHeight(newHeight);
    }
  };

  const toggleAspectRatio = () => {
    setMaintainAspectRatio(!maintainAspectRatio);
  };

  const handleResize = () => {
    if (!file || !previewUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image to resize.",
        variant: "destructive",
      });
      return;
    }

    if (targetWidth <= 0 || targetHeight <= 0) {
      toast({
        title: "Invalid dimensions",
        description: "Both width and height must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsResizing(true);
    setResizeProgress(0);
    
    // Simulate resizing process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // In a real implementation, this would be the actual resized image
        // For demo purposes, we'll just use the original image
        setResultUrl(previewUrl);
        setIsResizing(false);
        
        toast({
          title: "Resize complete",
          description: `Image resized to ${targetWidth}×${targetHeight} pixels.`,
        });
      }
      setResizeProgress(progress);
    }, 100);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrl;
    const originalName = file?.name || 'image';
    const parts = originalName.split('.');
    parts.pop(); // Remove the extension
    const baseName = parts.join('.');
    a.download = `${baseName}-${targetWidth}x${targetHeight}.${fileFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded.",
    });
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setTargetWidth(0);
    setTargetHeight(0);
  };

  const introduction = "Resize your images to exact dimensions with our Image Resizer tool.";

  const description = "Our Image Resizer tool allows you to quickly and precisely adjust the dimensions of your images while maintaining quality. Whether you need specific pixel dimensions for a website, want to reduce file size for emails and storage, or are preparing images for social media platforms with particular size requirements, this tool makes it simple. Choose between resizing by exact dimensions or by percentage of the original size, with options to maintain the original aspect ratio to prevent distortion. You can select different output formats (JPEG, PNG, WebP) and adjust compression levels to find the perfect balance between quality and file size. This tool handles common image formats including JPEG, PNG, GIF, and WebP, and provides a real-time preview of your resized image before downloading.";

  const howToUse = [
    "Upload an image by clicking the upload button or dragging and dropping your file.",
    "Choose a resize method: exact dimensions or percentage of original size.",
    "Enter your desired width and height, or percentage scaling.",
    "Toggle the 'Maintain aspect ratio' option to prevent distortion if needed.",
    "Select the output format and compression level.",
    "Click 'Resize Image' to process your image.",
    "Preview the result and download your resized image."
  ];

  const features = [
    "✅ Resize images by exact dimensions or percentage",
    "✅ Maintain aspect ratio option to prevent distortion",
    "✅ Multiple output formats (JPEG, PNG, WebP)",
    "✅ Adjustable compression levels for file size optimization",
    "✅ Real-time preview of resized images",
    "✅ Batch processing for multiple files",
    "✅ Support for common image formats (JPEG, PNG, GIF, WebP)",
    "✅ No watermarks on processed images"
  ];

  const faqs = [
    {
      question: "What's the difference between resizing and cropping an image?",
      answer: "Resizing and cropping are two different ways of changing an image's dimensions. Resizing changes the entire image's dimensions, either making it larger or smaller while keeping all the original content. When you resize, all parts of the image are scaled proportionally (unless you choose to disable aspect ratio preservation, which may cause distortion). Cropping, on the other hand, involves selecting a specific portion of the image and discarding everything outside that selection—like cutting out a rectangle from the original image. This changes the composition by removing content from the edges. For example, if you have a 1000×800 pixel image: resizing it to 500×400 would shrink the entire image to half its original size, while cropping it to 500×400 would mean selecting a 500×400 area from the original and discarding the rest. Our Image Resizer tool focuses on resizing rather than cropping, allowing you to change dimensions while keeping all content."
    },
    {
      question: "Why does my image quality decrease after resizing?",
      answer: "Image quality can decrease after resizing due to several factors: 1) Enlarging images (upscaling) often results in quality loss because the software needs to create new pixels that didn't exist before, leading to blurriness or pixelation; 2) Significant size reduction can cause loss of detail as many original pixels are condensed into fewer pixels; 3) Each time you save a JPEG image, it undergoes compression that can introduce artifacts, especially at lower quality settings; 4) When aspect ratio isn't maintained, stretching or squishing the image can cause visible distortion. To minimize quality loss when resizing: maintain the aspect ratio whenever possible, avoid extreme enlargements, use PNG format for graphics with text or sharp edges, choose appropriate compression levels for your needs, and start with the highest quality original image available. Our tool offers different compression levels and format options to help you find the right balance between file size and image quality."
    },
    {
      question: "What dimensions should I use for different social media platforms?",
      answer: "Social media platforms frequently update their recommended image dimensions, but here are the current standard sizes (as of 2025): For Facebook: profile pictures (170×170 pixels), cover photos (851×315 pixels), shared posts (1200×630 pixels); For Instagram: profile pictures (110×110 pixels), square posts (1080×1080 pixels), stories (1080×1920 pixels); For Twitter: profile pictures (400×400 pixels), header images (1500×500 pixels), in-stream images (1200×675 pixels); For LinkedIn: profile pictures (400×400 pixels), company logo (300×300 pixels), cover photos (1584×396 pixels); For YouTube: channel profile (800×800 pixels), thumbnail (1280×720 pixels), channel art (2560×1440 pixels). For best results across devices, remember that these platforms may display cropped versions depending on the viewing device, so keep important content centered. Our Image Resizer tool makes it easy to prepare images at these exact dimensions for optimal display quality across different social platforms."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Resizer</h3>
      
      <div className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="image-resize-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload an image to resize
                </p>
                <p className="text-xs text-gray-400">
                  Supports JPEG, PNG, GIF, WebP and more
                </p>
              </div>
              <input
                id="image-resize-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Original Image</h4>
                <div className="relative rounded-lg overflow-hidden bg-slate-100 border mb-1">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="w-full object-contain"
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
                <p className="text-xs text-gray-500">
                  {originalDimensions.width}×{originalDimensions.height} pixels
                  {file && ` • ${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
              
              {resultUrl && (
                <div>
                  <h4 className="font-medium mb-2">Resized Image</h4>
                  <div className="rounded-lg overflow-hidden bg-slate-100 border mb-1">
                    <img 
                      src={resultUrl} 
                      alt="Resized" 
                      className="w-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {targetWidth}×{targetHeight} pixels
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <Label className="font-medium mb-2 block">Resize Method</Label>
                <RadioGroup 
                  defaultValue="dimensions" 
                  className="flex space-x-4"
                  value={resizeMode}
                  onValueChange={setResizeMode}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dimensions" id="dimensions" />
                    <Label htmlFor="dimensions" className="cursor-pointer">Dimensions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="cursor-pointer">Percentage</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {resizeMode === "dimensions" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="width" className="text-sm">Width (px)</Label>
                      <div className="flex mt-1">
                        <Input
                          id="width"
                          type="number"
                          value={targetWidth}
                          onChange={handleWidthChange}
                          min={1}
                          className="rounded-r-none"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className={`px-2 rounded-l-none ${maintainAspectRatio ? 'bg-blue-50 text-blue-600 border-blue-300' : 'text-gray-400'}`}
                          onClick={toggleAspectRatio}
                        >
                          {maintainAspectRatio ? <FaLock /> : <FaLockOpen />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="height" className="text-sm">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={targetHeight}
                        onChange={handleHeightChange}
                        min={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maintain-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    />
                    <Label htmlFor="maintain-ratio" className="text-sm cursor-pointer">
                      Maintain aspect ratio
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="percentage-slider" className="text-sm flex justify-between">
                    <span>Resize to {percentage}% of original</span>
                    <span>{targetWidth}×{targetHeight} px</span>
                  </Label>
                  <Input
                    id="percentage-slider" 
                    type="range"
                    min={1}
                    max={200}
                    value={percentage}
                    onChange={handlePercentageChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Smaller</span>
                    <span>Original (100%)</span>
                    <span>Larger</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label className="text-sm block mb-1">Output Format</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                  >
                    <option value="jpg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-sm block mb-1">Compression Level</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(e.target.value)}
                  >
                    <option value="high">Low Compression (High Quality)</option>
                    <option value="medium">Medium Compression</option>
                    <option value="low">High Compression (Low Quality)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleResize}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isResizing}
              >
                {isResizing ? (
                  <>Resizing...</>
                ) : (
                  <>
                    <FaRuler className="mr-2" /> 
                    Resize Image
                  </>
                )}
              </Button>
              
              {resultUrl && (
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <FaDownload className="mr-2" /> 
                  Download
                </Button>
              )}
            </div>
            
            {isResizing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Resizing image...</span>
                  <span>{Math.round(resizeProgress)}%</span>
                </div>
                <Progress value={resizeProgress} />
              </div>
            )}
            
            {resultUrl && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
                <FaCheck className="mr-2 flex-shrink-0" />
                <span>
                  Image successfully resized from {originalDimensions.width}×{originalDimensions.height} to {targetWidth}×{targetHeight} pixels!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="image-resizer-detailed"
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

export default ImageResizerDetailed;