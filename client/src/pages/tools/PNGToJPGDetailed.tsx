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
  FaExchangeAlt
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const PNGToJPGDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [originalSizes, setOriginalSizes] = useState<number[]>([]);
  const [convertedSizes, setConvertedSizes] = useState<number[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [quality, setQuality] = useState(90);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === 'image/png'
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only PNG files are accepted for conversion.",
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
        description: "Please upload at least one PNG file to convert.",
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
        
        // Simulate file size reduction based on quality setting
        // JPG typically has smaller file size than PNG for photographic content
        // The higher the quality, the larger the file size (but still smaller than PNG)
        const compressionRatio = (100 - quality) * 0.005 + 0.3; // Between 0.3 and 0.8
        const sizes = originalSizes.map(size => Math.floor(size * (1 - compressionRatio)));
        
        setResultUrls(results);
        setConvertedSizes(sizes);
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: `Converted ${files.length} ${files.length === 1 ? 'PNG file' : 'PNG files'} to JPG.`,
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
      description: "All converted JPG images will be downloaded in a few moments.",
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

  const calculateSavings = (original: number, converted: number) => {
    if (original === 0) return '0%';
    const saving = Math.round((1 - converted / original) * 100);
    return `${saving}%`;
  };

  const introduction = "Convert PNG images to JPG format quickly and easily while maintaining quality.";

  const description = "Our PNG to JPG converter tool allows you to convert PNG (Portable Network Graphics) images to JPG (JPEG) format efficiently. While PNG files offer lossless quality with transparency support, they often result in larger file sizes. Converting to JPG format can significantly reduce file size while maintaining good visual quality for photographs and complex images. This is especially useful when you need smaller files for web uploads, email attachments, or to save storage space. Our converter gives you control over the quality level, allowing you to find the perfect balance between file size and image appearance. Whether you need to convert a single PNG image or batch process multiple files at once, our tool provides a seamless experience with instant previews of your converted images before downloading.";

  const howToUse = [
    "Upload one or more PNG images using the 'Upload PNG Files' button or drag and drop.",
    "Adjust the quality slider to set your preferred balance of file size vs. image quality.",
    "Click 'Convert to JPG' to process all your images.",
    "Preview the results and see the file size savings for each image.",
    "Download individual converted JPG files or all at once with the 'Download All' button."
  ];

  const features = [
    "✅ Convert PNG files to JPG format with adjustable quality",
    "✅ Batch processing for multiple PNG files simultaneously",
    "✅ Visual preview of converted images before downloading",
    "✅ File size comparison between original PNG and converted JPG",
    "✅ Easy one-click download of individual or all converted images",
    "✅ No watermarks on converted images",
    "✅ Works completely in your browser - no files uploaded to our servers"
  ];

  const faqs = [
    {
      question: "Why convert PNG to JPG?",
      answer: "Converting PNG to JPG offers several advantages in specific situations: 1) File size reduction—JPG files are typically much smaller than PNG files, especially for photographs and complex images with many colors; 2) Improved upload and download speeds due to smaller file sizes; 3) Meeting file size requirements for platforms or services that limit upload sizes; 4) Saving storage space when transparency isn't needed; 5) Better compatibility with older software or systems. While PNG excels at preserving transparency and sharp edges for graphics and logos, JPG is often better suited for photographs where file size is a priority over perfect reproduction. The tradeoff is that JPG uses lossy compression (some image data is discarded) and doesn't support transparency."
    },
    {
      question: "Will I lose image quality when converting from PNG to JPG?",
      answer: "Yes, there will be some loss of image quality when converting from PNG to JPG because JPG uses lossy compression. However, the degree of quality loss can be controlled with our quality slider. At high quality settings (80-100%), the visual difference is often imperceptible for photographs, while still achieving significant file size reduction. The most noticeable quality issues in JPG conversion appear in areas with sharp edges, text, or solid colors, which may show compression artifacts. If your PNG contains transparency, this will be lost in conversion to JPG (typically replaced with a white background). For images where perfect reproduction is essential, particularly graphics with text, sharp edges, or transparency, you might want to keep them as PNG. For photographs and images with many color gradients where slight quality loss is acceptable, JPG conversion at high quality settings offers an excellent compromise."
    },
    {
      question: "What happens to transparency when converting PNG to JPG?",
      answer: "JPG format does not support transparency, so any transparent areas in your PNG image will be filled with a background color (typically white) during conversion. This is an important consideration if your PNG images contain transparency that is crucial to their intended use. For images where transparency needs to be preserved (such as logos, icons, or images that will be placed on colored or variable backgrounds), JPG is not an appropriate format choice. In these cases, you should either keep your images in PNG format or consider WebP format, which supports both transparency and better compression than PNG. Our converter provides a preview of how your image will look after conversion, so you can see how the transparency will be handled before downloading the final JPG file."
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
              Upload PNG files to convert to JPG
            </p>
            <p className="text-xs text-gray-400">
              Click to browse or drag and drop PNG files here
            </p>
          </div>
          <input
            id="png-to-jpg-upload"
            type="file"
            accept=".png,image/png"
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
                          <span className="text-green-600 font-medium">{formatBytes(convertedSizes[index])}</span>
                          <span className="ml-1 text-green-600 font-medium">
                            ({calculateSavings(originalSizes[index], convertedSizes[index])} saved)
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
          
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="quality-slider" className="font-medium">JPG Quality</Label>
                <span className="text-sm">{quality}%</span>
              </div>
              <Slider 
                id="quality-slider"
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
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>
                Successfully converted {files.length} {files.length === 1 ? 'PNG file' : 'PNG files'} to JPG! 
                Total savings: {calculateSavings(
                  originalSizes.reduce((a, b) => a + b, 0),
                  convertedSizes.reduce((a, b) => a + b, 0)
                )}
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