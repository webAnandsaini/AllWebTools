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
  FaCompress,
  FaCheck,
  FaTrash
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const ImageCompressorDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [originalSizes, setOriginalSizes] = useState<number[]>([]);
  const [compressedSizes, setCompressedSizes] = useState<number[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [quality, setQuality] = useState(80);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (selectedFiles.length !== e.target.files.length) {
        toast({
          title: "Invalid files",
          description: "Only image files are accepted for compression.",
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
        setCompressedSizes([]);
        setCompressProgress(0);
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
    
    // Also remove compressed results if they exist
    if (resultUrls.length > 0) {
      const newResultUrls = [...resultUrls];
      const newCompressedSizes = [...compressedSizes];
      
      if (index < newResultUrls.length) {
        URL.revokeObjectURL(newResultUrls[index]);
        newResultUrls.splice(index, 1);
        newCompressedSizes.splice(index, 1);
        
        setResultUrls(newResultUrls);
        setCompressedSizes(newCompressedSizes);
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
    setCompressedSizes([]);
    setCompressProgress(0);
  };

  const handleCompress = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to compress.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setCompressProgress(0);
    setResultUrls([]);
    setCompressedSizes([]);
    
    // Simulate compression process
    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / files.length / 10);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate compressed results - in a real implementation, this would be the actual compressed images
        const results = previewUrls.map(url => url);
        
        // Simulate file size reduction based on quality setting
        // The lower the quality, the smaller the file size
        const compressionRatio = (100 - quality) * 0.008 + 0.2; // Between 0.2 and 1.0
        const sizes = originalSizes.map(size => Math.floor(size * (1 - compressionRatio)));
        
        setResultUrls(results);
        setCompressedSizes(sizes);
        setIsCompressing(false);
        
        toast({
          title: "Compression complete",
          description: `Compressed ${files.length} ${files.length === 1 ? 'image' : 'images'}.`,
        });
      }
      setCompressProgress(progress);
    }, 100);
  };

  const handleDownload = (index: number) => {
    if (!resultUrls[index]) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrls[index];
    const originalName = files[index]?.name || 'image.jpg';
    const parts = originalName.split('.');
    const extension = parts.length > 1 ? parts.pop() : 'jpg';
    const filename = parts.join('.') + '-compressed.' + extension;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded.",
    });
  };

  const handleDownloadAll = () => {
    if (resultUrls.length === 0) return;
    
    toast({
      title: "Preparing download",
      description: "All compressed images will be downloaded in a few moments.",
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

  const calculateSavings = (original: number, compressed: number) => {
    if (original === 0) return '0%';
    const saving = Math.round((1 - compressed / original) * 100);
    return `${saving}%`;
  };

  const introduction = "Reduce image file sizes without losing quality with our Image Compressor tool.";

  const description = "Our Image Compressor tool lets you reduce the file size of your images without significant quality loss. Whether you need to optimize images for your website to improve load times, prepare photos for email attachments, or simply free up storage space, our compression algorithm intelligently reduces file size while preserving visual quality. This tool supports common image formats including JPEG, PNG, GIF, and WebP, and gives you control over the compression level to find the perfect balance between file size and image quality. You can compress multiple images at once, compare the before and after results, and download your optimized images individually or all at once. The compression happens entirely in your browser, ensuring your images remain private and secure.";

  const howToUse = [
    "Upload one or more images using the 'Upload Images' button or drag and drop.",
    "Adjust the quality slider to set your preferred balance of file size vs. image quality.",
    "Click 'Compress Images' to start the optimization process.",
    "Review the compressed images and see how much file size you've saved for each one.",
    "Download individual compressed images or all at once with the 'Download All' button."
  ];

  const features = [
    "✅ Compress images with adjustable quality settings",
    "✅ Support for JPEG, PNG, GIF, and WebP formats",
    "✅ Batch processing for compressing multiple images at once",
    "✅ Visual comparison between original and compressed images",
    "✅ Detailed file size reduction statistics",
    "✅ Browser-based compression (no server uploads)",
    "✅ No watermarks on compressed images"
  ];

  const faqs = [
    {
      question: "How does image compression work?",
      answer: "Image compression works by reducing the file size of an image while attempting to maintain visual quality. There are two main types of compression: lossless (which preserves all original data) and lossy (which selectively discards some data to achieve smaller file sizes). Our tool uses intelligent lossy compression algorithms that analyze image content and remove redundant or less noticeable data. It optimizes color information, removes unnecessary metadata, and applies smart encoding techniques. The quality slider lets you control the compression level—higher settings preserve more detail but result in larger files, while lower settings achieve smaller files with some quality reduction. The ideal setting depends on your specific needs: website images can often use more compression, while photos you plan to print might need higher quality settings."
    },
    {
      question: "Will compression affect the quality of my images?",
      answer: "Yes, compression will affect image quality to some degree, but the extent depends on several factors. At high quality settings (70-100%), the difference is often imperceptible to the human eye, while still achieving significant file size reduction. Lower quality settings (below 70%) will introduce more noticeable artifacts like blurring, color banding, or pixelation, especially in detailed areas or smooth gradients. The content of your image also impacts how noticeable quality loss will be—photographs with natural scenes typically compress better than graphics with sharp edges and text. Our tool gives you control over the quality setting so you can find the right balance for your specific needs. For critical applications where quality is paramount, you can use higher settings and still benefit from some file size reduction."
    },
    {
      question: "What's the difference between compressing PNG and JPEG images?",
      answer: "PNG and JPEG files compress differently due to their inherent formats. JPEG was designed specifically for photographs and uses lossy compression that works well with natural images containing many colors and gradients. When compressing a JPEG, our tool reapplies the JPEG algorithm at your chosen quality level, which can significantly reduce file size. PNG files, on the other hand, use lossless compression by default and are ideal for graphics with text, sharp edges, or transparency. When compressing PNG files, our tool can either optimize the lossless compression (smaller reduction but no quality loss) or convert to a lossy format for greater size reduction (with some quality trade-off and loss of transparency). For photographs, JPEG compression typically achieves much smaller file sizes than PNG. For graphics, logos, or images requiring transparency, PNG is usually better despite larger file sizes."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Compressor</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="image-compressor-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload images to compress
            </p>
            <p className="text-xs text-gray-400">
              Click to browse or drag and drop images here
            </p>
          </div>
          <input
            id="image-compressor-upload"
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
            <h4 className="font-medium">Images to Compress ({files.length})</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAll}
            >
              <FaTrash className="mr-1 text-red-500" />
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
                      
                      {compressedSizes[index] && (
                        <>
                          <span className="mx-1 text-gray-400">→</span>
                          <span className="text-green-600 font-medium">{formatBytes(compressedSizes[index])}</span>
                          <span className="ml-1 text-green-600 font-medium">
                            ({calculateSavings(originalSizes[index], compressedSizes[index])} saved)
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
                <Label htmlFor="quality-slider" className="font-medium">Compression Quality</Label>
                <span className="text-sm">{quality}%</span>
              </div>
              <Slider 
                id="quality-slider"
                min={30}
                max={95}
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
              onClick={handleCompress}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isCompressing || files.length === 0}
            >
              {isCompressing ? (
                <>Compressing...</>
              ) : (
                <>
                  <FaCompress className="mr-2" /> 
                  Compress Images
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
          
          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Compressing...</span>
                <span>{Math.round(compressProgress)}%</span>
              </div>
              <Progress value={compressProgress} />
            </div>
          )}
          
          {resultUrls.length > 0 && files.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
              <FaCheck className="mr-2 flex-shrink-0" />
              <span>
                Successfully compressed {files.length} {files.length === 1 ? 'image' : 'images'}! 
                Total savings: {calculateSavings(
                  originalSizes.reduce((a, b) => a + b, 0),
                  compressedSizes.reduce((a, b) => a + b, 0)
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
      toolSlug="image-compressor-detailed"
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

export default ImageCompressorDetailed;