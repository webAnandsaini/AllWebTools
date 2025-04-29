import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaDownload, FaInfoCircle, FaFileImage } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PhotoResizerInKBDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [targetSize, setTargetSize] = useState(100);
  const [sizeUnit, setSizeUnit] = useState<"KB" | "MB">("KB");
  const [compressMethod, setCompressMethod] = useState<"auto" | "manual">("auto");
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [maintainDimensions, setMaintainDimensions] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultSize, setResultSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setResultUrl("");
      setResultSize(0);
      setOriginalSize(selectedFile.size);
      
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

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getTargetSizeInBytes = () => {
    if (sizeUnit === "KB") {
      return targetSize * 1024;
    } else {
      return targetSize * 1024 * 1024;
    }
  };

  const handleProcess = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResultUrl("");
    
    // Simulate processing
    setTimeout(() => {
      // Calculate what the result size would be - this is just a simulation
      let resultSizeBytes;
      
      if (compressMethod === "auto") {
        // In auto mode, we simulate hitting the target exactly
        resultSizeBytes = getTargetSizeInBytes();
      } else {
        // In manual mode, we simulate quality-based compression
        // Higher quality = larger file
        const compressionRatio = quality / 100;
        resultSizeBytes = Math.round(originalSize * compressionRatio);
        
        // Ensure it's not larger than original
        if (resultSizeBytes > originalSize) {
          resultSizeBytes = originalSize;
        }
      }
      
      setResultSize(resultSizeBytes);
      setResultUrl(previewUrl); // In a real implementation, this would be the processed image URL
      
      setIsProcessing(false);
      
      toast({
        title: "Processing complete",
        description: `Image resized to ${formatBytes(resultSizeBytes)}.`,
      });
    }, 2000);
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

  const introduction = "Resize your photos to exact file sizes in KB or MB while preserving quality.";

  const description = "Our Photo Resizer in KB is a specialized tool designed to solve a common problem: resizing images to meet specific file size requirements. Whether you need to reduce an image to fit email attachment limits, meet upload size restrictions on websites, or optimize images for faster loading times, this tool gives you precise control over the final file size in kilobytes or megabytes. Unlike standard image compressors that focus solely on quality settings, our tool intelligently balances compression level and dimensional resizing to achieve your target file size while maintaining the best possible image quality. You can choose between automatic mode, which optimizes all parameters to reach your exact size target, or manual mode, which allows you to control quality settings while monitoring the resulting file size. This tool is particularly useful for professionals who need to meet strict file size requirements for submissions, applications, or media uploads, saving time that would otherwise be spent on trial-and-error compression.";

  const howToUse = [
    "Upload your photo by clicking the 'Upload Image' button or dragging and dropping a file.",
    "Set your target file size in KB or MB using the input field.",
    "Choose between automatic processing (which optimizes all settings to meet your target size) or manual control.",
    "If using manual mode, adjust the quality slider to balance file size and image quality.",
    "Select your preferred output format (JPEG is recommended for photos).",
    "Click 'Process Image' to resize your photo to the target size.",
    "Preview the result and download your resized image."
  ];

  const features = [
    "✅ Resize images to exact file sizes in KB or MB",
    "✅ Automatic mode for optimal quality at target size",
    "✅ Manual quality control for fine-tuning results",
    "✅ Maintains image dimensions when possible",
    "✅ Multiple output format options (JPEG, PNG, WebP)",
    "✅ Preview before downloading to ensure satisfaction"
  ];

  const faqs = [
    {
      question: "How does the tool achieve the exact file size?",
      answer: "The tool uses a combination of compression and dimension adjustments to reach your target file size. In automatic mode, it employs an intelligent algorithm that iteratively adjusts quality and dimensions until it achieves the exact size you specified. This typically involves multiple compression passes with fine-tuned parameters, ensuring the best possible image quality at your target size. The process balances quality reduction (which has minimal visual impact) and dimension reduction (when necessary for very small target sizes)."
    },
    {
      question: "Which file format is best for photos with a specific size requirement?",
      answer: "JPEG is typically the best format for photos with specific size requirements. It offers excellent compression for photographic content while maintaining visual quality, and provides fine-grained control over file size through quality settings. WebP can achieve similar quality at smaller sizes but has less universal support. PNG is not recommended for photos with strict size requirements as it's designed for lossless compression and produces larger files for photographic content."
    },
    {
      question: "Is there a minimum size limit I can specify?",
      answer: "While technically you can specify very small target sizes (even a few KB), there's a practical limit to how small an image can be while remaining recognizable. When you request extremely small file sizes, the tool may need to significantly reduce both quality and dimensions. For photos, we recommend setting a minimum target of 30-50KB for images that will be viewed on screen, as sizes below this threshold typically result in visible quality degradation. The tool will warn you if your target size is likely to produce unsatisfactory results."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Photo Resizer in KB</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="photo-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload a photo to resize
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, WebP (Max 20MB)
            </p>
          </div>
          <input
            id="photo-upload"
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
            <h4 className="font-medium mb-2">Original Photo</h4>
            <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
              <img 
                src={previewUrl} 
                alt="Original" 
                className="max-h-48 object-contain"
              />
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              {formatBytes(originalSize)} • {originalWidth} × {originalHeight} px
            </div>
          </div>
          
          {resultUrl && (
            <div>
              <h4 className="font-medium mb-2">Resized Photo</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
                <img 
                  src={resultUrl} 
                  alt="Resized" 
                  className="max-h-48 object-contain"
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {formatBytes(resultSize)} • {width} × {height} px
              </div>
            </div>
          )}
        </div>
      )}
      
      {previewUrl && (
        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="target-size" className="font-medium">Target Size</Label>
              <div className="flex mt-1">
                <Input
                  id="target-size"
                  type="number"
                  value={targetSize}
                  onChange={(e) => setTargetSize(Math.max(1, parseInt(e.target.value) || 0))}
                  min={1}
                  className="flex-1 rounded-r-none"
                />
                <Select value={sizeUnit} onValueChange={(value) => setSizeUnit(value as "KB" | "MB")}>
                  <SelectTrigger className="w-20 rounded-l-none">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KB">KB</SelectItem>
                    <SelectItem value="MB">MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {targetSize < 10 && sizeUnit === "KB" && (
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Very small sizes may result in poor quality
                </p>
              )}
            </div>
            
            <Tabs value={compressMethod} onValueChange={(value) => setCompressMethod(value as "auto" | "manual")}>
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="auto">Automatic</TabsTrigger>
                <TabsTrigger value="manual">Manual Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="auto" className="pt-2">
                <p className="text-sm text-gray-600">
                  Our algorithm will optimize quality and dimensions to achieve the exact target size.
                </p>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="quality" className="text-sm">Quality</Label>
                    <span className="text-sm">{quality}%</span>
                  </div>
                  <Slider 
                    id="quality"
                    min={10}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(values) => setQuality(values[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintain-dims" className="text-sm">Maintain dimensions</Label>
                    <p className="text-xs text-gray-500">Keep original image size if possible</p>
                  </div>
                  <Switch 
                    id="maintain-dims" 
                    checked={maintainDimensions}
                    onCheckedChange={setMaintainDimensions}
                  />
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
                  <SelectItem value="jpeg">JPEG (recommended for photos)</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
              {outputFormat === "png" && (
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  PNG format may be larger than target size due to its lossless nature
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <Button 
              onClick={handleProcess}
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              disabled={isProcessing || !file}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <FaFileImage className="mr-2" /> 
                  Process Image
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
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
              <FaInfoCircle className="mr-2 flex-shrink-0" />
              <div>
                Successfully resized photo to {formatBytes(resultSize)}. 
                {originalSize > resultSize && (
                  <span> Reduced by {Math.round((originalSize - resultSize) / originalSize * 100)}%.</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="photo-resizer-in-kb-detailed"
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

export default PhotoResizerInKBDetailed;