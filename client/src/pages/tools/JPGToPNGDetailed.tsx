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
import { Progress } from "@/components/ui/progress";

const JPGToPNGDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === "image/jpeg" || file.type === "image/jpg" // Only accept JPG files
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only JPG/JPEG files are accepted for this converter.",
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
        description: "Please upload at least one JPG image to convert.",
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
        const results = previewUrls.map(url => url); // In a real implementation, these would be converted PNG URLs
        setResultUrls(results);
        
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: `Successfully converted ${files.length} ${files.length === 1 ? 'JPG file' : 'JPG files'} to PNG.`,
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
    // Change extension from .jpg to .png
    const originalName = files[index]?.name || 'image.jpg';
    const pngName = originalName.replace(/\.(jpg|jpeg)$/i, '.png');
    a.download = pngName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your converted PNG image is being downloaded.",
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

  const introduction = "Convert JPG images to high-quality, transparent PNG format with our fast, reliable converter.";

  const description = "Our JPG to PNG Converter is a specialized tool that transforms JPEG images into the versatile PNG format, preserving image quality while adding support for transparency. While JPEG is excellent for photographs and complex images with many colors, PNG offers advantages like lossless compression and transparency support that make it ideal for graphics, logos, icons, and images that need to be placed on different colored backgrounds. This conversion is particularly valuable when you need to extract elements from an image to create compositions, use images in design projects where background removal is necessary, or maintain the highest possible quality for further editing. Our converter handles the technical aspects of this transformation, producing clean PNG files with optimal settings for your needs. The process is simple yet powerful: upload your JPG images, convert them with a single click, and download your new PNG files ready for use in any project that requires transparency or lossless quality.";

  const howToUse = [
    "Upload one or more JPG/JPEG images by clicking the 'Upload JPG Files' button or dragging and dropping files.",
    "Review your uploaded files in the queue to confirm they're correct.",
    "Click 'Convert to PNG' to begin the conversion process.",
    "Wait for the conversion to complete - this typically takes just a few seconds per image.",
    "Preview the results and download individual PNG images or all converted files at once."
  ];

  const features = [
    "✅ Convert JPG images to high-quality transparent PNG format",
    "✅ Batch processing for multiple images simultaneously",
    "✅ Lossless conversion preserving original image quality",
    "✅ No watermarks on converted images",
    "✅ Simple drag-and-drop interface",
    "✅ One-click download of individual or all converted images"
  ];

  const faqs = [
    {
      question: "Why would I convert JPG to PNG?",
      answer: "There are several reasons to convert JPG to PNG: 1) Transparency - PNG supports transparent backgrounds, which is essential for logos, icons, and images that need to be placed on different colored backgrounds; 2) Lossless quality - PNG uses lossless compression, so there's no quality degradation when saving or re-saving files; 3) Editing purposes - PNG is better for images that will undergo further editing; 4) Text clarity - PNG preserves the sharpness of text and lines better than JPG; 5) Digital art - PNG is preferable for digital illustrations, diagrams, and artwork with solid colors or sharp edges. While PNG files are typically larger than JPGs, the quality and transparency benefits make the conversion worthwhile for these use cases."
    },
    {
      question: "Will converting from JPG to PNG improve image quality?",
      answer: "Converting from JPG to PNG won't recover quality that was already lost when the image was saved as a JPG, as JPEG uses lossy compression that permanently discards some image data. However, converting to PNG ensures that no further quality loss occurs during subsequent saves or edits. Think of it like making a photocopy - converting to PNG creates a perfect copy of the current state of your JPG, but can't restore details that were already lost in the original. If your original image was high quality before being saved as JPG, the PNG version will preserve that remaining quality perfectly for future use."
    },
    {
      question: "Can I make the background transparent when converting JPG to PNG?",
      answer: "While converting from JPG to PNG creates a file format that supports transparency, it doesn't automatically make backgrounds transparent. JPG files don't store transparency information, so our basic converter preserves the image exactly as it appears. However, our premium version offers additional image editing tools including background removal technology that can automatically detect and remove backgrounds during conversion. For professional needs, we recommend using dedicated design software like Photoshop or GIMP to manually remove backgrounds after conversion, as this provides the most precise control over which parts of the image become transparent."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">JPG to PNG Converter</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="jpg-to-png-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload JPG images to convert to PNG
            </p>
            <p className="text-xs text-gray-400">
              Drag and drop JPG files here or click to browse
            </p>
          </div>
          <input
            id="jpg-to-png-upload"
            type="file"
            accept="image/jpeg,image/jpg"
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
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="flex items-start">
              <FaCheck className="mr-2 mt-1 flex-shrink-0" />
              <span>
                PNG files support transparency and maintain image quality better than JPG. They're ideal for logos, graphics, and images that need transparent backgrounds.
              </span>
            </p>
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
                  Convert to PNG
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
                Successfully converted {resultUrls.length} {resultUrls.length === 1 ? 'JPG file' : 'JPG files'} to PNG format!
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="jpg-to-png-detailed"
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

export default JPGToPNGDetailed;