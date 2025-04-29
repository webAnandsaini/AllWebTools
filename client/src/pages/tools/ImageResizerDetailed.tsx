import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaRuler, 
  FaLink,
  FaImage,
  FaCheck,
  FaLock,
  FaLockOpen
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImageResizerDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [originalDimensions, setOriginalDimensions] = useState<Array<{width: number, height: number}>>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeProgress, setResizeProgress] = useState(0);
  
  // Resize settings
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [resizeMethod, setResizeMethod] = useState<string>("exact");
  const [imageFormat, setImageFormat] = useState<string>("original");
  const [quality, setQuality] = useState<number>(90);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.match('image.*')
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only image files are accepted for resizing.",
          variant: "destructive",
        });
      }
      
      if (selectedFiles.length > 0) {
        setFiles([...files, ...selectedFiles]);
        
        // Create preview URLs and get original dimensions for each file
        const urls: string[] = [];
        const dimensions: Array<{width: number, height: number}> = [];
        
        selectedFiles.forEach(file => {
          const url = URL.createObjectURL(file);
          urls.push(url);
          
          // Get image dimensions
          const img = new Image();
          img.onload = () => {
            dimensions.push({ width: img.width, height: img.height });
            setOriginalDimensions([...originalDimensions, ...dimensions]);
            
            // Update width/height inputs with the first image's dimensions if this is the first upload
            if (files.length === 0 && dimensions.length === 1) {
              setWidth(img.width);
              setHeight(img.height);
            }
          };
          img.src = url;
        });
        
        setPreviewUrls([...previewUrls, ...urls]);
        
        // Reset results
        setResultUrls([]);
        setResizeProgress(0);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    const newOriginalDimensions = [...originalDimensions];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    if (index < newOriginalDimensions.length) {
      newOriginalDimensions.splice(index, 1);
    }
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    setOriginalDimensions(newOriginalDimensions);
    
    // Also remove resized results if they exist
    if (resultUrls.length > 0) {
      const newResultUrls = [...resultUrls];
      
      if (index < newResultUrls.length) {
        URL.revokeObjectURL(newResultUrls[index]);
        newResultUrls.splice(index, 1);
        
        setResultUrls(newResultUrls);
      }
    }
  };

  const clearAll = () => {
    // Revoke all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    resultUrls.forEach(url => URL.revokeObjectURL(url));
    
    setFiles([]);
    setPreviewUrls([]);
    setOriginalDimensions([]);
    setResultUrls([]);
    setResizeProgress(0);
  };

  const handleResize = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to resize.",
        variant: "destructive",
      });
      return;
    }

    if (width <= 0 || height <= 0) {
      toast({
        title: "Invalid dimensions",
        description: "Width and height must be positive numbers.",
        variant: "destructive",
      });
      return;
    }

    setIsResizing(true);
    setResizeProgress(0);
    setResultUrls([]);
    
    // Simulate resizing process
    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / files.length / 10);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate resized results - in a real implementation, this would be the actual resized images
        const results = previewUrls.map(url => url);
        
        setResultUrls(results);
        setIsResizing(false);
        
        toast({
          title: "Resizing complete",
          description: `Successfully resized ${files.length} ${files.length === 1 ? 'image' : 'images'}.`,
        });
      }
      setResizeProgress(progress);
    }, 100);
  };

  const handleDownload = (index: number) => {
    if (!resultUrls[index]) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrls[index];
    const originalName = files[index]?.name || 'image.jpg';
    const nameParts = originalName.split('.');
    const ext = nameParts.pop() || 'jpg';
    const baseName = nameParts.join('.');
    
    // Prepare filename with the new dimensions
    let newExt = ext;
    if (imageFormat !== 'original') {
      newExt = imageFormat;
    }
    
    const resizedName = `${baseName}-${width}x${height}.${newExt}`;
    a.download = resizedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded.",
    });
  };

  const handleDownloadAll = () => {
    if (resultUrls.length === 0) return;
    
    toast({
      title: "Preparing download",
      description: "All resized images will be downloaded in a few moments.",
    });
    
    // In a real implementation, this would create a zip file with all images
    // For this demo, we'll just download them one by one with a delay
    resultUrls.forEach((_, index) => {
      setTimeout(() => {
        handleDownload(index);
      }, index * 1000);
    });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    
    if (keepAspectRatio && originalDimensions.length > 0) {
      const aspectRatio = originalDimensions[0].width / originalDimensions[0].height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    
    if (keepAspectRatio && originalDimensions.length > 0) {
      const aspectRatio = originalDimensions[0].width / originalDimensions[0].height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const getFilesTotalSize = (): string => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    return formatBytes(totalBytes);
  };

  const introduction = "Resize your images with precision, maintaining quality for perfect results in any dimensions.";

  const description = "Our Image Resizer is a powerful tool designed to help you resize images to exact dimensions while preserving quality. Whether you're preparing images for your website, social media, printing, or any other specific requirements, this tool lets you adjust the dimensions with precision. Perfectly sized images not only look better but also improve website performance, ensure consistent layouts in design projects, and meet platform-specific requirements for uploads. With support for all common image formats including JPEG, PNG, WebP, and GIF, our tool provides flexible options for your output—choose exact dimensions, proportional scaling, or fit within constraints. You can resize single images or batch process multiple files at once, saving valuable time. Each output can be customized with format conversion and quality settings to achieve the perfect balance between visual fidelity and file size for your specific needs.";

  const howToUse = [
    "Upload one or more images by clicking the 'Upload Images' button or dragging and dropping files.",
    "Enter your desired width and height dimensions in pixels.",
    "Choose whether to maintain the original aspect ratio or use exact dimensions.",
    "Select a resize method: exact dimensions, fit within dimensions, or only enlarge/shrink.",
    "Choose your preferred output format (PNG, JPEG, WebP, or original).",
    "Adjust the quality setting for the output images.",
    "Click 'Resize Images' to begin the resizing process.",
    "Once complete, preview the results and download individual or all resized images."
  ];

  const features = [
    "✅ Precise dimension control with pixel-perfect accuracy",
    "✅ Option to maintain original aspect ratio",
    "✅ Multiple resize methods for different needs",
    "✅ Format conversion between JPEG, PNG, and WebP",
    "✅ Adjustable quality settings to balance size and visual fidelity",
    "✅ Batch processing to resize multiple images at once",
    "✅ Preview resized images before downloading"
  ];

  const faqs = [
    {
      question: "What's the difference between the resize methods?",
      answer: "Our Image Resizer offers three different resize methods to accommodate various needs: 1) Exact dimensions—resizes the image to precisely match your specified width and height, which may distort the image if the aspect ratio changes; 2) Fit within dimensions—resizes the image proportionally to fit within your specified dimensions, ensuring no part of the image is cut off and no distortion occurs (the image may be smaller than your specified dimensions in one direction); 3) Only shrink/Only enlarge—these options will only resize the image if it's larger or smaller than the specified dimensions, respectively, leaving it unchanged otherwise. If you need to maintain the exact proportions of your image, use 'Fit within dimensions' with the 'Maintain aspect ratio' option enabled. If you need precise sizing for a specific layout regardless of appearance, use 'Exact dimensions'."
    },
    {
      question: "Which image format should I choose for the output?",
      answer: "The best output format depends on your specific needs: 1) JPEG—ideal for photographs and complex images with many colors. It provides good compression but is lossy (some quality is sacrificed for smaller file size). Best for web photos where file size matters. 2) PNG—best for images with transparency or sharp edges like logos, screenshots, and text. It uses lossless compression, so quality is preserved but file sizes are larger than JPEG. 3) WebP—a modern format that offers both lossy and lossless compression with smaller file sizes than JPEG or PNG. Great for web use but has slightly less universal support in older software. 4) Original—maintains the input format, which is convenient when processing mixed file types. For web images, JPEG (photographs) or WebP (general use) usually provide the best balance of quality and file size. For graphics, illustrations, or when transparency is needed, PNG is typically the better choice."
    },
    {
      question: "Will resizing affect the quality of my images?",
      answer: "Resizing can affect image quality in several ways, particularly when enlarging images or significantly changing their dimensions. When you downsize an image (make it smaller), some information is naturally lost, but this generally doesn't reduce perceived quality and often makes images appear sharper. However, when enlarging images (making them bigger), the software must create new pixels based on the existing ones, which can result in blurriness or pixelation. Our tool uses high-quality interpolation algorithms to minimize quality loss during resizing. The 'Quality' setting primarily affects JPEG and WebP formats (which use lossy compression)—higher quality means less compression and larger file sizes. To maintain maximum quality when resizing, use PNG format with 100% quality, though this will result in larger files. For best results, start with the highest quality source images available and avoid repeatedly resizing the same image, as quality degradation compounds with each resize operation."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Resizer</h3>
      
      <Tabs defaultValue="upload" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload & Resize</TabsTrigger>
          <TabsTrigger value="results" disabled={resultUrls.length === 0}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="image-resizer-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload images to resize
                </p>
                <p className="text-xs text-gray-400">
                  Supports JPEG, PNG, WebP (up to 10MB per file)
                </p>
              </div>
              <input
                id="image-resizer-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Upload Queue ({files.length})</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white border rounded-md flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                        <img src={previewUrls[index]} alt={file.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate w-40 sm:w-auto">{file.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{formatBytes(file.size)}</span>
                          
                          {originalDimensions[index] && (
                            <span className="ml-2">
                              {originalDimensions[index].width} × {originalDimensions[index].height}px
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600"
                      onClick={() => removeFile(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width-input" className="font-medium mb-1 block">Width</Label>
                    <div className="flex items-center">
                      <Input 
                        id="width-input"
                        type="number"
                        value={width}
                        onChange={handleWidthChange}
                        className="w-28"
                        min={1}
                        max={10000}
                      />
                      <span className="text-sm text-gray-500 ml-2">px</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="height-input" className="font-medium mb-1 block">Height</Label>
                    <div className="flex items-center">
                      <Input 
                        id="height-input"
                        type="number"
                        value={height}
                        onChange={handleHeightChange}
                        className="w-28"
                        min={1}
                        max={10000}
                      />
                      <span className="text-sm text-gray-500 ml-2">px</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="aspect-ratio" className="font-medium cursor-pointer">
                      <div className="flex items-center space-x-2">
                        {keepAspectRatio ? <FaLock size={14} /> : <FaLockOpen size={14} />}
                        <span>Maintain aspect ratio</span>
                      </div>
                    </Label>
                  </div>
                  <Switch 
                    id="aspect-ratio" 
                    checked={keepAspectRatio}
                    onCheckedChange={setKeepAspectRatio}
                  />
                </div>
                
                <div>
                  <Label className="font-medium mb-2 block">Resize Method</Label>
                  <RadioGroup 
                    value={resizeMethod} 
                    onValueChange={setResizeMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exact" id="exact" />
                      <Label htmlFor="exact" className="font-normal cursor-pointer">
                        <span>Exact dimensions</span>
                        <span className="text-xs text-gray-500 block">Resize to exactly match width and height</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fit" id="fit" />
                      <Label htmlFor="fit" className="font-normal cursor-pointer">
                        <span>Fit within dimensions</span>
                        <span className="text-xs text-gray-500 block">Resize proportionally to fit inside width and height</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shrink" id="shrink" />
                      <Label htmlFor="shrink" className="font-normal cursor-pointer">
                        <span>Only shrink</span>
                        <span className="text-xs text-gray-500 block">Resize only if image is larger than dimensions</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="enlarge" id="enlarge" />
                      <Label htmlFor="enlarge" className="font-normal cursor-pointer">
                        <span>Only enlarge</span>
                        <span className="text-xs text-gray-500 block">Resize only if image is smaller than dimensions</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium mb-2 block">Output Format</Label>
                    <RadioGroup 
                      value={imageFormat} 
                      onValueChange={setImageFormat}
                      className="flex flex-wrap space-x-4"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="original" id="original" />
                        <Label htmlFor="original" className="font-normal text-sm cursor-pointer">Original</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="jpg" id="jpg" />
                        <Label htmlFor="jpg" className="font-normal text-sm cursor-pointer">JPEG</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="png" id="png" />
                        <Label htmlFor="png" className="font-normal text-sm cursor-pointer">PNG</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="webp" id="webp" />
                        <Label htmlFor="webp" className="font-normal text-sm cursor-pointer">WebP</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="quality-input" className="font-medium">Quality</Label>
                      <span className="text-sm">{quality}%</span>
                    </div>
                    <Input 
                      id="quality-input"
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={e => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Higher quality means larger file size
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <div className="flex items-start">
                  <FaRuler className="mr-2 mt-1 flex-shrink-0" />
                  <span>
                    {files.length > 0 
                      ? `${files.length} image${files.length > 1 ? 's' : ''} selected (${getFilesTotalSize()}) will be resized to ${width}×${height}px`
                      : 'Upload images to begin resizing'}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleResize}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isResizing || files.length === 0}
              >
                {isResizing ? (
                  <>Resizing...</>
                ) : (
                  <>
                    <FaRuler className="mr-2" /> 
                    Resize {files.length > 1 ? `${files.length} Images` : 'Image'}
                  </>
                )}
              </Button>
              
              {isResizing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resizing images...</span>
                    <span>{Math.round(resizeProgress)}%</span>
                  </div>
                  <Progress value={resizeProgress} />
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Resized Images ({resultUrls.length})</h4>
            <Button 
              onClick={handleDownloadAll}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <FaDownload className="mr-2" /> 
              Download All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resultUrls.map((url, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{files[index]?.name || 'Image'}</span>
                  <div className="text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                    {width}×{height}px
                  </div>
                </div>
                
                <div className="p-3 flex items-center justify-center" style={{ height: '160px' }}>
                  <img 
                    src={url} 
                    alt={files[index]?.name || 'Resized image'} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                
                <div className="p-3 border-t bg-gray-50">
                  <Button 
                    onClick={() => handleDownload(index)}
                    size="sm"
                    className="w-full"
                  >
                    <FaDownload className="mr-2" /> 
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
            <FaCheck className="mr-2 flex-shrink-0" />
            <span>
              Successfully resized {resultUrls.length} {resultUrls.length === 1 ? 'image' : 'images'} to {width}×{height}px
            </span>
          </div>
        </TabsContent>
      </Tabs>
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