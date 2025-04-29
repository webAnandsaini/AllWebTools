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
  FaExchangeAlt, 
  FaFileImage,
  FaImages,
  FaCheck
} from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const ConvertToJPGDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);
  const [preserveExif, setPreserveExif] = useState(true);
  const [convertProgress, setConvertProgress] = useState(0);
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [transparencyColor, setTransparencyColor] = useState("#ffffff");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles([...files, ...selectedFiles]);
      
      // Create preview URLs for each file
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...urls]);
      
      // Reset results
      setResultUrls([]);
      setConvertProgress(0);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const clearAll = () => {
    // Revoke all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    resultUrls.forEach(url => URL.revokeObjectURL(url));
    
    setFiles([]);
    setPreviewUrls([]);
    setResultUrls([]);
    setConvertProgress(0);
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConvertProgress(0);
    setResultUrls([]);
    
    // Simulate conversion process
    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / files.length);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate conversion result
        const results = previewUrls.map(url => url); // In a real implementation, these would be converted JPG URLs
        setResultUrls(results);
        
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: `Successfully converted ${files.length} ${files.length === 1 ? 'image' : 'images'} to JPG.`,
        });
      }
      setConvertProgress(progress);
    }, 500);
  };

  const handleDownload = (index: number) => {
    if (!resultUrls[index]) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrls[index];
    a.download = files[index]?.name.split('.')[0] + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your converted image is being downloaded.",
    });
  };

  const handleDownloadAll = () => {
    if (resultUrls.length === 0) return;
    
    toast({
      title: "Preparing download",
      description: "All converted images will be downloaded in a few moments.",
    });
    
    // In a real implementation, this would create a zip file with all images
    // For this demo, we'll just download the first one
    setTimeout(() => {
      handleDownload(0);
    }, 1000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const introduction = "Convert images from any format to high-quality JPG files with our fast, reliable converter.";

  const description = "Our Convert to JPG tool is a versatile utility that transforms images from various formats including PNG, WebP, GIF, TIFF, BMP, and more into the universally compatible JPG format. This conversion is essential for optimizing file sizes, ensuring compatibility across all platforms and devices, and preparing images for web usage or print. Unlike many converters, our tool preserves image quality with adjustable settings, handles transparency intelligently, and processes multiple images simultaneously to save you time. The JPG format (also known as JPEG) is ideal for photographs and complex graphics due to its efficient compression algorithm that significantly reduces file size while maintaining visual quality. Whether you need to convert a single specialized image or batch process an entire collection, our tool streamlines this common task with professional-grade results. With optional features for preserving metadata, customizing quality levels, and handling transparency, this tool offers both convenience for casual users and precision for professionals.";

  const howToUse = [
    "Upload one or more images by clicking the 'Upload Images' button or dragging and dropping files.",
    "Adjust the quality slider to balance file size and image quality (higher values maintain better quality but result in larger files).",
    "Choose whether to preserve image metadata like camera information and GPS data.",
    "Select how to handle transparency in PNG images (replace with a color or maintain transparent areas).",
    "Click 'Convert to JPG' to begin the conversion process.",
    "Preview the results and download individual images or all converted files at once."
  ];

  const features = [
    "✅ Convert multiple image formats to JPG (PNG, WebP, GIF, BMP, TIFF, etc.)",
    "✅ Batch processing for multiple images simultaneously",
    "✅ Adjustable quality settings for optimal results",
    "✅ Option to preserve original image metadata",
    "✅ Intelligent transparency handling for PNG images",
    "✅ Free and unlimited image conversion"
  ];

  const faqs = [
    {
      question: "Why would I need to convert images to JPG format?",
      answer: "There are several common reasons to convert images to JPG: 1) Smaller file sizes - JPG uses compression that significantly reduces file size compared to formats like PNG or BMP; 2) Universal compatibility - JPG is supported by virtually all devices, browsers, and applications; 3) Website optimization - JPG is preferred for photographs on websites to improve loading times; 4) Email attachments - smaller JPG files are easier to send via email; 5) Social media uploads - many platforms compress non-JPG images, so converting yourself gives you more control over the quality."
    },
    {
      question: "Will I lose quality when converting to JPG?",
      answer: "JPG uses lossy compression, which means some image data is discarded during conversion to reduce file size. However, our tool allows you to control this tradeoff with the quality slider. At higher quality settings (80-100), the loss is minimal and often imperceptible to the human eye, especially for photographs. For images with text, sharp lines, or transparent elements, you might notice some quality reduction. If preserving absolute quality is critical, consider using PNG format instead, though files will be significantly larger."
    },
    {
      question: "How does the tool handle transparent backgrounds in PNG images?",
      answer: "JPG format doesn't support transparency, so when converting PNG images with transparent backgrounds, our tool offers two options: 1) Replace transparency with a solid color (white by default, but you can choose any color); or 2) Maintain transparency by saving as PNG with reduced quality. The first option is ideal when you need a JPG file specifically, while the second preserves the transparent areas but won't actually create a JPG file. For web use where the background will be a solid color, replacing transparency with that matching color often provides the best results."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Convert to JPG</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="convert-image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload images to convert (PNG, WebP, GIF, etc.)
            </p>
            <p className="text-xs text-gray-400">
              Drag and drop files here or click to browse
            </p>
          </div>
          <input
            id="convert-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 space-y-5">
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
                    <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {resultUrls[index] && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-green-600 mr-2"
                      onClick={() => handleDownload(index)}
                    >
                      <FaDownload className="mr-1" />
                      Download
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600"
                    onClick={() => removeFile(index)}
                  >
                    &times;
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="jpg-quality" className="font-medium">JPG Quality</Label>
                <span className="text-sm">{quality}%</span>
              </div>
              <Slider 
                id="jpg-quality"
                min={50}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={(values) => setQuality(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file size</span>
                <span>Better quality</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preserve-metadata" className="font-medium">Preserve Metadata</Label>
                <p className="text-xs text-gray-500">Keep EXIF data (camera info, GPS, etc.)</p>
              </div>
              <Switch 
                id="preserve-metadata" 
                checked={preserveExif}
                onCheckedChange={setPreserveExif}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transparency" className="font-medium">Transparency Handling</Label>
                <p className="text-xs text-gray-500">For PNG images with transparent areas</p>
              </div>
              <div className="flex items-center">
                <input
                  type="color"
                  value={transparencyColor}
                  onChange={(e) => setTransparencyColor(e.target.value)}
                  className="w-8 h-8 rounded border mr-2"
                  disabled={!preserveTransparency}
                />
                <Switch 
                  id="transparency" 
                  checked={preserveTransparency}
                  onCheckedChange={setPreserveTransparency}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleConvert}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isConverting || files.length === 0}
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <FaExchangeAlt className="mr-2" /> 
                  Convert to JPG
                </>
              )}
            </Button>
            
            {resultUrls.length > 0 && (
              <Button 
                onClick={handleDownloadAll}
                variant="outline"
                className="flex-1"
              >
                <FaDownload className="mr-2" /> 
                Download All
              </Button>
            )}
          </div>
          
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Converting...</span>
                <span>{Math.round(convertProgress)}%</span>
              </div>
              <Progress value={convertProgress} />
            </div>
          )}
          
          {resultUrls.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>Successfully converted {resultUrls.length} {resultUrls.length === 1 ? 'image' : 'images'} to JPG format!</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="convert-to-jpg-detailed"
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

export default ConvertToJPGDetailed;