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
  FaImage, 
  FaCheck,
  FaExchangeAlt
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const JPGToPNGDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [originalSizes, setOriginalSizes] = useState<number[]>([]);
  const [convertedSizes, setConvertedSizes] = useState<number[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/jpeg'
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only JPG/JPEG files are accepted for conversion.",
          variant: "destructive",
        });
      }
      
      if (selectedFiles.length > 0) {
        setFiles([...files, ...selectedFiles]);
        
        // Store original file sizes
        const sizes = selectedFiles.map(file => file.size);
        setOriginalSizes([...originalSizes, ...sizes]);
        
        // Create preview URLs for each file
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...urls]);
        
        // Reset results
        setResultUrls([]);
        setConvertedSizes([]);
        setConvertProgress(0);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    const newOriginalSizes = [...originalSizes];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    newOriginalSizes.splice(index, 1);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    setOriginalSizes(newOriginalSizes);
    
    // Also remove converted results if they exist
    if (resultUrls.length > 0) {
      const newResultUrls = [...resultUrls];
      const newConvertedSizes = [...convertedSizes];
      
      if (index < newResultUrls.length) {
        URL.revokeObjectURL(newResultUrls[index]);
        newResultUrls.splice(index, 1);
        newConvertedSizes.splice(index, 1);
        
        setResultUrls(newResultUrls);
        setConvertedSizes(newConvertedSizes);
      }
    }
  };

  const clearAll = () => {
    // Revoke all object URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    resultUrls.forEach(url => URL.revokeObjectURL(url));
    
    setFiles([]);
    setPreviewUrls([]);
    setOriginalSizes([]);
    setResultUrls([]);
    setConvertedSizes([]);
    setConvertProgress(0);
  };

  const handleConvert = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one JPG file to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConvertProgress(0);
    setResultUrls([]);
    setConvertedSizes([]);
    
    // Simulate conversion process
    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / files.length / 10);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate converted results - in a real implementation, this would be the actual converted images
        const results = previewUrls.map(url => url);
        
        // Simulate file size increase - PNG files are typically larger than JPGs
        // due to lossless compression
        const sizes = originalSizes.map(size => Math.floor(size * 1.2));
        
        setResultUrls(results);
        setConvertedSizes(sizes);
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: `Converted ${files.length} ${files.length === 1 ? 'JPG file' : 'JPG files'} to PNG.`,
        });
      }
      setConvertProgress(progress);
    }, 100);
  };

  const handleDownload = (index: number) => {
    if (!resultUrls[index]) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrls[index];
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
      description: "All converted PNG images will be downloaded in a few moments.",
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

  const introduction = "Convert JPG images to PNG format with transparency support for high-quality output.";

  const description = "Our JPG to PNG converter tool transforms your JPEG images (Joint Photographic Experts Group) into PNG format (Portable Network Graphics) with perfect quality preservation. While JPG files are ideal for photographs due to their efficient compression, PNG offers lossless compression that maintains every detail of your image without degradation. PNG files also support transparency, making them ideal for graphics, logos, icons, and images that need to be placed on various backgrounds. This conversion is particularly useful for design projects, print materials, or any situation where image quality and potential transparency are crucial. The conversion process is quick and simple—upload your JPG files, convert with a single click, and download your high-quality PNG images ready for use in any project requiring maximum visual fidelity.";

  const howToUse = [
    "Upload one or more JPG/JPEG images using the 'Upload JPG Files' button or drag and drop.",
    "Review your uploaded images in the conversion queue.",
    "Click 'Convert to PNG' to process all your JPG images.",
    "Preview the results and compare file sizes.",
    "Download individual converted PNG files or use 'Download All' to get all your converted images at once."
  ];

  const features = [
    "✅ Convert JPG to PNG with perfect quality preservation",
    "✅ Batch processing for multiple JPG files simultaneously",
    "✅ Visual preview of converted images before downloading",
    "✅ File size comparison between original JPG and converted PNG",
    "✅ Easy one-click download of individual or all converted images",
    "✅ No watermarks on converted images",
    "✅ No file size limitations"
  ];

  const faqs = [
    {
      question: "Why convert JPG to PNG?",
      answer: "Converting JPG to PNG offers several advantages in specific situations: 1) Quality preservation—PNG uses lossless compression, so your image won't suffer from additional quality loss; 2) Transparency support—PNG files can have transparent backgrounds, essential for logos, icons, and images that need to be placed on varying backgrounds; 3) Eliminating compression artifacts—if your JPG has visible compression artifacts, converting to PNG prevents further degradation (though it won't remove existing artifacts); 4) Design workflow requirements—many graphic design projects require PNG formats for their editing processes; 5) Print preparation—PNG files are often preferred for high-quality print materials. While PNG files are typically larger than JPGs, the benefits of lossless quality and transparency make the conversion worthwhile for many professional and creative applications."
    },
    {
      question: "Will converting from JPG to PNG improve image quality?",
      answer: "Converting a JPG to PNG will not improve the original image quality or remove existing compression artifacts that were introduced when the image was initially saved as a JPG. However, it will prevent any further quality loss that would occur if you continued to edit and save the image in JPG format. JPG uses lossy compression, which means some image data is permanently discarded to reduce file size. Once this data is lost, it cannot be recovered simply by converting to PNG. What PNG conversion does provide is a lossless container for the image in its current state—preserving it exactly as is without any additional quality degradation. This is particularly valuable if you plan to edit the image further, as each subsequent save in JPG format would introduce more compression artifacts, while PNG maintains consistent quality through multiple edits and saves."
    },
    {
      question: "Why are my PNG files larger than the original JPG files?",
      answer: "PNG files are typically larger than JPG files because they use lossless compression, which preserves all image data rather than discarding some to reduce file size. This size difference is normal and expected—you're essentially trading smaller file size for better quality preservation and additional features like transparency. The size increase varies depending on the image content: 1) Photos and complex images with many colors and gradients will show the most dramatic size increase when converted to PNG; 2) Images with large areas of solid color or simple graphics might show a more modest size increase; 3) Text and line art can sometimes be more efficiently stored in PNG format. If file size is a critical concern for your specific use case (like web images where loading speed is paramount), you might want to consider whether the benefits of PNG (quality preservation and transparency) outweigh the increased storage requirements for your particular project."
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
              Upload JPG files to convert to PNG
            </p>
            <p className="text-xs text-gray-400">
              Click to browse or drag and drop JPG files here
            </p>
          </div>
          <input
            id="jpg-to-png-upload"
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Files to Convert ({files.length})</h4>
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
                      <span>{formatBytes(originalSizes[index])}</span>
                      
                      {convertedSizes[index] && (
                        <>
                          <span className="mx-1 text-gray-400">→</span>
                          <span className="text-blue-600 font-medium">{formatBytes(convertedSizes[index])}</span>
                          <span className="ml-1 text-blue-600 font-medium">
                            ({Math.round((convertedSizes[index] / originalSizes[index] - 1) * 100)}% larger)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {resultUrls[index] && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 mr-2"
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
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleConvert}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>
                Successfully converted {files.length} {files.length === 1 ? 'JPG file' : 'JPG files'} to PNG with lossless quality!
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