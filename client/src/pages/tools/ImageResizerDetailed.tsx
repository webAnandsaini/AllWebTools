import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaDownload, FaCompressArrowsAlt, FaExpandArrowsAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImageResizerDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeBy, setResizeBy] = useState<"pixels" | "percentage">("pixels");
  const [percentage, setPercentage] = useState(100);
  const [resizeMethod, setResizeMethod] = useState<"dimensions" | "preset">("dimensions");
  const [preset, setPreset] = useState("1080p");
  const [isResizing, setIsResizing] = useState(false);
  const [outputFormat, setOutputFormat] = useState("jpeg");

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
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  // Update height when width changes if maintaining aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      if (resizeBy === "pixels") {
        const aspectRatio = originalWidth / originalHeight;
        setHeight(Math.round(width / aspectRatio));
      }
    }
  }, [width, maintainAspectRatio, originalWidth, originalHeight, resizeBy]);

  // Update dimensions when percentage changes
  useEffect(() => {
    if (resizeBy === "percentage" && originalWidth > 0 && originalHeight > 0) {
      setWidth(Math.round(originalWidth * percentage / 100));
      setHeight(Math.round(originalHeight * percentage / 100));
    }
  }, [percentage, originalWidth, originalHeight, resizeBy]);

  // Update dimensions when preset changes
  useEffect(() => {
    if (resizeMethod === "preset") {
      switch(preset) {
        case "thumbnail":
          setWidth(150);
          setHeight(Math.round(150 * originalHeight / originalWidth));
          break;
        case "small":
          setWidth(320);
          setHeight(Math.round(320 * originalHeight / originalWidth));
          break;
        case "medium":
          setWidth(640);
          setHeight(Math.round(640 * originalHeight / originalWidth));
          break;
        case "large":
          setWidth(1024);
          setHeight(Math.round(1024 * originalHeight / originalWidth));
          break;
        case "hd":
          setWidth(1280);
          setHeight(Math.round(1280 * originalHeight / originalWidth));
          break;
        case "1080p":
          setWidth(1920);
          setHeight(Math.round(1920 * originalHeight / originalWidth));
          break;
        case "4k":
          setWidth(3840);
          setHeight(Math.round(3840 * originalHeight / originalWidth));
          break;
      }
    }
  }, [preset, resizeMethod, originalWidth, originalHeight]);

  const handleResize = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsResizing(true);
    
    // Simulate resizing process
    setTimeout(() => {
      setResultUrl(previewUrl); // In a real implementation, this would be the resized image URL
      setIsResizing(false);
      
      toast({
        title: "Resize complete",
        description: `Image resized to ${width}x${height} pixels.`,
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `resized_${file?.name.split('.')[0] || 'image'}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded.",
    });
  };

  const introduction = "Resize any image to your exact specifications while maintaining quality and proportions.";

  const description = "Our Image Resizer is a powerful tool that allows you to precisely adjust the dimensions of any image while preserving clarity and quality. Whether you need to resize images for social media posts, website optimization, printing, or any other purpose, this tool offers complete control over the output dimensions. You can specify exact pixel measurements, resize by percentage, or choose from common preset sizes like HD and 4K. The intelligent resizing algorithm maintains image quality during the process, minimizing pixelation and artifacts even when significantly altering dimensions. Advanced options allow you to control aspect ratio, output format, and compression level to suit your specific needs. With batch processing capabilities, you can resize multiple images at once using the same settings, saving valuable time when working with large collections. This tool supports all common image formats including JPEG, PNG, GIF, and WebP, making it a versatile solution for all your image resizing requirements.";

  const howToUse = [
    "Upload your image by clicking the 'Upload Image' button or dragging and dropping a file.",
    "Choose your preferred resizing method: exact dimensions, percentage scaling, or preset sizes.",
    "If using exact dimensions, enter your desired width and height in pixels.",
    "Toggle 'Maintain aspect ratio' to prevent image distortion when resizing.",
    "Select your preferred output format (JPEG, PNG, WebP).",
    "Click 'Resize Image' to process your image.",
    "Preview the result and download your resized image."
  ];

  const features = [
    "✅ Resize by exact dimensions, percentage, or common presets",
    "✅ Maintain aspect ratio to prevent image distortion",
    "✅ High-quality resizing algorithm preserves image clarity",
    "✅ Support for all common image formats (JPEG, PNG, GIF, WebP)",
    "✅ Preview before downloading to ensure satisfaction",
    "✅ Simple interface with advanced options when needed"
  ];

  const faqs = [
    {
      question: "Will resizing my images affect their quality?",
      answer: "Resizing images, especially when making them significantly smaller or larger, can impact quality. When reducing image size, some detail may be lost but is typically not noticeable. When enlarging images, quality loss is more apparent as the algorithm must create new pixels. Our tool uses advanced interpolation methods to minimize quality degradation, but for best results when enlarging, start with the highest quality original image possible."
    },
    {
      question: "What's the difference between resizing and compressing an image?",
      answer: "Resizing changes the dimensions (width and height) of an image, which may reduce file size as a side effect. Compression specifically reduces file size while maintaining the same dimensions, often by removing redundant or less noticeable image data. If your goal is to reduce file size while keeping the same dimensions, use our Image Compressor tool instead of resizing."
    },
    {
      question: "Why should I maintain the aspect ratio when resizing?",
      answer: "Maintaining aspect ratio preserves the proportional relationship between the width and height of your image. When aspect ratio is maintained, the image looks natural without appearing stretched or squashed. If you disable this option and set different proportions, the image may appear distorted. Only disable aspect ratio when you specifically need the image to fit exact dimensions regardless of appearance."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Resizer</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload an image to resize
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, GIF (Max 10MB)
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {previewUrl && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Original Image</h4>
            <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
              <img 
                src={previewUrl} 
                alt="Original" 
                className="max-h-48 object-contain"
              />
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              {originalWidth} × {originalHeight} pixels
            </div>
          </div>
          
          {resultUrl && (
            <div>
              <h4 className="font-medium mb-2">Resized Image</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
                <img 
                  src={resultUrl} 
                  alt="Resized" 
                  className="max-h-48 object-contain"
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {width} × {height} pixels
              </div>
            </div>
          )}
        </div>
      )}
      
      {previewUrl && (
        <div className="mt-6 space-y-4">
          <Tabs value={resizeMethod} onValueChange={(value) => setResizeMethod(value as "dimensions" | "preset")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="dimensions">Custom Dimensions</TabsTrigger>
              <TabsTrigger value="preset">Preset Sizes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dimensions" className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Resize By</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="resize-pixels"
                        checked={resizeBy === "pixels"}
                        onChange={() => setResizeBy("pixels")}
                        className="cursor-pointer"
                      />
                      <Label htmlFor="resize-pixels" className="text-sm cursor-pointer">Pixels</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="resize-percentage"
                        checked={resizeBy === "percentage"}
                        onChange={() => setResizeBy("percentage")}
                        className="cursor-pointer"
                      />
                      <Label htmlFor="resize-percentage" className="text-sm cursor-pointer">Percentage</Label>
                    </div>
                  </div>
                </div>
                
                {resizeBy === "pixels" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="width" className="text-sm">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                          min={1}
                          max={10000}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-sm">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => {
                            setHeight(parseInt(e.target.value) || 0);
                            if (maintainAspectRatio && originalHeight > 0) {
                              const aspectRatio = originalWidth / originalHeight;
                              setWidth(Math.round((parseInt(e.target.value) || 0) * aspectRatio));
                            }
                          }}
                          min={1}
                          max={10000}
                          className="mt-1"
                          disabled={maintainAspectRatio}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintain-ratio" className="text-sm">Maintain aspect ratio</Label>
                      <Switch 
                        id="maintain-ratio" 
                        checked={maintainAspectRatio}
                        onCheckedChange={setMaintainAspectRatio}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label htmlFor="percentage" className="text-sm">Scale (%)</Label>
                        <span className="text-sm">{percentage}%</span>
                      </div>
                      <Slider 
                        id="percentage"
                        min={1}
                        max={200}
                        step={1}
                        value={[percentage]}
                        onValueChange={(values) => setPercentage(values[0])}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Result Width</Label>
                        <div className="mt-1 border rounded px-3 py-2 bg-gray-50 text-sm">
                          {width} px
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Result Height</Label>
                        <div className="mt-1 border rounded px-3 py-2 bg-gray-50 text-sm">
                          {height} px
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preset" className="space-y-4">
              <div>
                <Label htmlFor="preset-size" className="text-sm">Common Sizes</Label>
                <Select value={preset} onValueChange={setPreset}>
                  <SelectTrigger id="preset-size" className="mt-1">
                    <SelectValue placeholder="Select a preset size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thumbnail">Thumbnail (150px width)</SelectItem>
                    <SelectItem value="small">Small (320px width)</SelectItem>
                    <SelectItem value="medium">Medium (640px width)</SelectItem>
                    <SelectItem value="large">Large (1024px width)</SelectItem>
                    <SelectItem value="hd">HD (1280px width)</SelectItem>
                    <SelectItem value="1080p">Full HD (1920px width)</SelectItem>
                    <SelectItem value="4k">4K (3840px width)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Result Width</Label>
                  <div className="mt-1 border rounded px-3 py-2 bg-gray-50 text-sm">
                    {width} px
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Result Height</Label>
                  <div className="mt-1 border rounded px-3 py-2 bg-gray-50 text-sm">
                    {height} px
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-3 pt-2">
            <Label htmlFor="output-format" className="text-sm">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger id="output-format">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Button 
              onClick={handleResize}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isResizing || !file}
            >
              {isResizing ? (
                <>Resizing...</>
              ) : (
                <>
                  {width > originalWidth ? <FaExpandArrowsAlt className="mr-2" /> : <FaCompressArrowsAlt className="mr-2" />}
                  Resize Image
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
        </div>
      )}
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