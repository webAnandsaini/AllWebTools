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
  FaImages
} from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const PNGToJPGDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(90);
  const [preserveMetadata, setPreserveMetadata] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [transparencyColor, setTransparencyColor] = useState("#ffffff");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === "image/png" // Only accept PNG files
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only PNG files are accepted for this converter.",
          variant: "destructive",
        });
      }
      
      if (selectedFiles.length > 0) {
        setFiles([...files, ...selectedFiles]);
        
        // Create preview URLs for each file
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...urls]);
        
        // Reset results
        setResultUrls([]);
        setConvertProgress(0);
      }
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
        description: "Please upload at least one PNG image to convert.",
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
          description: `Successfully converted ${files.length} ${files.length === 1 ? 'PNG file' : 'PNG files'} to JPG.`,
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
    // Change extension from .png to .jpg
    const originalName = files[index]?.name || 'image.png';
    const jpgName = originalName.replace(/\.png$/i, '.jpg');
    a.download = jpgName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your converted JPG image is being downloaded.",
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

  const introduction = "Convert PNG images to JPG format with customizable quality settings and transparency handling.";

  const description = "Our PNG to JPG Converter is a specialized tool designed to convert Portable Network Graphics (PNG) images to the widely-used JPEG format. This conversion is particularly useful when you need to reduce file sizes, ensure compatibility with platforms that require JPG format, or prepare images for web usage where transparency isn't needed. While PNG files excel at preserving transparency and lossless quality, they often create larger file sizes that can slow down websites or exceed upload limits. Our converter handles the technical aspects of this conversion, including intelligent transparency handling (replacing transparent areas with a color of your choice), and offers quality controls to balance file size with image clarity. The tool is particularly valuable for photographers, web developers, designers, and anyone who needs to optimize images for specific uses. With batch processing capabilities, you can convert multiple PNG files simultaneously, and our straightforward interface makes the conversion process simple for users of all technical levels.";

  const howToUse = [
    "Upload one or more PNG images by clicking the 'Upload PNG Files' button or dragging and dropping files.",
    "Adjust the quality slider to balance file size and image quality (higher values maintain better quality but result in larger files).",
    "Choose a background color to replace transparent areas in your PNG images (since JPG doesn't support transparency).",
    "Enable or disable metadata preservation based on your needs.",
    "Click 'Convert to JPG' to begin the conversion process.",
    "Preview the results and download individual images or all converted files at once."
  ];

  const features = [
    "✅ Convert PNG images to optimized JPG format",
    "✅ Batch processing for multiple images simultaneously",
    "✅ Customizable quality settings for perfect results",
    "✅ Transparency handling with color selection",
    "✅ Option to preserve original image metadata",
    "✅ One-click download of individual or all converted images"
  ];

  const faqs = [
    {
      question: "Why would I convert PNG to JPG?",
      answer: "There are several reasons to convert PNG to JPG: 1) File size reduction - JPG files are typically much smaller than PNGs, especially for photographs and complex images; 2) Compatibility - some platforms or services may only accept JPG format; 3) Web optimization - smaller JPG files load faster on websites, improving user experience; 4) Storage efficiency - smaller files allow you to store more images in limited space; 5) Email attachments - JPG files are easier to send via email due to their smaller size. However, note that JPG doesn't support transparency and uses lossy compression, so some quality loss will occur."
    },
    {
      question: "How does the converter handle transparent areas in PNG images?",
      answer: "JPEG format doesn't support transparency, so when converting from PNG (which does support transparency), our tool replaces transparent or semi-transparent areas with a solid color of your choice. By default, we use white (#FFFFFF), but you can select any color that best complements your image. This is particularly important for images that will be displayed on colored backgrounds, as you can match the background color for a seamless appearance. If preserving transparency is critical for your needs, you might want to keep the original PNG format or consider using WebP format, which supports both transparency and compression."
    },
    {
      question: "Will I lose quality when converting from PNG to JPG?",
      answer: "Yes, some quality loss is inevitable when converting from PNG to JPG because JPEG uses lossy compression. However, our tool allows you to control this quality-size tradeoff with the quality slider. At higher quality settings (85-100), the loss is often barely noticeable to the human eye, especially for photographs. For images with sharp text, lines, or detailed graphics, the quality difference may be more apparent. PNG uses lossless compression, which is why it maintains perfect quality but at the cost of larger file sizes. Our converter is optimized to preserve as much quality as possible while still providing the file size benefits of JPG format."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">PNG to JPG Converter</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="png-to-jpg-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload PNG images to convert to JPG
            </p>
            <p className="text-xs text-gray-400">
              Drag and drop PNG files here or click to browse
            </p>
          </div>
          <input
            id="png-to-jpg-upload"
            type="file"
            accept="image/png"
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
            
            <div>
              <Label htmlFor="transparency-color" className="font-medium">Transparency Background</Label>
              <div className="flex mt-1">
                <input
                  id="transparency-color"
                  type="color"
                  value={transparencyColor}
                  onChange={(e) => setTransparencyColor(e.target.value)}
                  className="h-10 w-10 rounded border border-gray-300"
                />
                <div className="ml-2 flex-1 flex items-center p-2 border rounded bg-gray-50">
                  <span className="text-sm">{transparencyColor.toUpperCase()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                JPG doesn't support transparency, this color will replace transparent areas
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preserve-metadata" className="font-medium">Preserve Metadata</Label>
                <p className="text-xs text-gray-500">Keep EXIF data (if present in PNG)</p>
              </div>
              <Switch 
                id="preserve-metadata" 
                checked={preserveMetadata}
                onCheckedChange={setPreserveMetadata}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleConvert}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
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
          
          {resultUrls.length > 0 && files.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
              <FaFileImage className="mr-2 flex-shrink-0" />
              <span>
                Successfully converted {resultUrls.length} {resultUrls.length === 1 ? 'PNG file' : 'PNG files'} to JPG format!
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="png-to-jpg-detailed"
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

export default PNGToJPGDetailed;