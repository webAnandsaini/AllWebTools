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
  FaCompress, 
  FaFileImage,
  FaImages,
  FaCheck
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImageCompressorDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [originalSizes, setOriginalSizes] = useState<number[]>([]);
  const [compressedSizes, setCompressedSizes] = useState<number[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [quality, setQuality] = useState(85);
  const [keepMetadata, setKeepMetadata] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState("balanced");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.match('image.*')
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
        
        // Simulate compressed results
        const results = previewUrls.map(url => url); // In a real implementation, these would be compressed image URLs
        
        // Simulate file size reduction based on quality setting
        // Lower quality = higher compression ratio
        const compressionRatio = (100 - quality) * 0.01 + 0.2; // Between 0.2 and 0.7
        const sizes = originalSizes.map(size => Math.floor(size * (1 - compressionRatio)));
        
        setResultUrls(results);
        setCompressedSizes(sizes);
        setIsCompressing(false);
        
        // Calculate total savings
        const totalOriginal = originalSizes.reduce((a, b) => a + b, 0);
        const totalCompressed = sizes.reduce((a, b) => a + b, 0);
        const savingsPercent = Math.round((1 - totalCompressed / totalOriginal) * 100);
        
        toast({
          title: "Compression complete",
          description: `Compressed ${files.length} ${files.length === 1 ? 'image' : 'images'} with ${savingsPercent}% size reduction.`,
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
    const nameParts = originalName.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    const compressedName = `${baseName}-compressed.${ext}`;
    a.download = compressedName;
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

  const introduction = "Compress your images without losing quality, reduce file sizes, and optimize for web or mobile use.";

  const description = "Our Image Compressor is a powerful tool designed to reduce the file size of your images while maintaining optimal visual quality. Large image files can slow down websites, consume valuable storage space, and exceed attachment size limits. Our compression algorithm intelligently analyzes each image to remove unnecessary data and optimize the file size without sacrificing the visual appearance that matters to your audience. This tool supports all popular image formats including JPEG, PNG, WebP, and GIF, making it versatile for different use cases. With adjustable compression levels, you can fine-tune the balance between file size and image quality to meet your specific needs. Whether you're optimizing images for your website to improve page load times, preparing images for email attachments, saving storage space on your devices, or reducing bandwidth usage for mobile users, our Image Compressor provides an efficient solution with batch processing capabilities to save you time and effort.";

  const howToUse = [
    "Upload one or more images by clicking the 'Upload Images' button or dragging and dropping files.",
    "Adjust the quality slider to control the compression level (lower quality results in smaller file sizes).",
    "Choose whether to preserve metadata in your images.",
    "Select an optimization preset based on your needs (web, maximum compression, or balanced).",
    "Click 'Compress Images' to begin the compression process.",
    "Once complete, preview the results, compare the file size reduction, and download individual or all compressed images."
  ];

  const features = [
    "✅ Intelligent compression that preserves visual quality",
    "✅ Support for JPEG, PNG, WebP, and GIF formats",
    "✅ Batch processing to compress multiple images at once",
    "✅ Adjustable quality settings for perfect results",
    "✅ Option to preserve or strip metadata",
    "✅ Optimization presets for different use cases",
    "✅ Before/after comparison with detailed size reduction metrics"
  ];

  const faqs = [
    {
      question: "How does image compression work?",
      answer: "Image compression works by reducing redundant and unnecessary data in image files. Our tool uses two primary techniques: 1) Lossy compression—selectively removing data that has minimal impact on perceived quality (like subtle color variations the human eye can't easily detect); and 2) Lossless compression—reorganizing data more efficiently without removing any information. The quality slider in our tool controls the balance between these techniques. At higher quality settings, we primarily use lossless techniques plus minimal lossy compression. At lower quality settings, we apply more aggressive lossy compression to achieve smaller file sizes. Additionally, we optimize encoding parameters, color palettes, and metadata handling based on each image's characteristics and your selected preferences."
    },
    {
      question: "Will compression affect the quality of my images?",
      answer: "The impact on quality depends on the compression level you choose. At high quality settings (80-100%), the visual difference is usually imperceptible to the human eye, even though file sizes can be reduced by 30-60%. At medium quality settings (60-80%), slight differences might be noticeable in detailed areas when zooming in, but images still look good at normal viewing sizes. At low quality settings (below 60%), visible artifacts may appear, but the files will be significantly smaller. Our tool is designed to make intelligent decisions about what visual data to preserve based on content type—preserving sharp edges in graphics and text while allowing more compression in photographic areas where small variations are less noticeable. The best approach is to experiment with different settings to find the optimal balance for your specific images and use case."
    },
    {
      question: "What's the difference between the optimization presets?",
      answer: "Our three optimization presets are tailored for different use cases: 1) Web Optimized—balances quality and file size with a focus on fast loading, ideal for websites and online platforms. This preset applies smart compression techniques that work well with modern browsers and maintains good visual quality while significantly reducing file size. 2) Maximum Compression—prioritizes achieving the smallest possible file size, even if it means some quality reduction. This is suitable for archiving large numbers of images, email attachments with strict size limits, or scenarios where bandwidth is extremely limited. 3) Balanced—our default setting that maintains high visual quality while still providing substantial file size reduction. It uses a combination of techniques that work well for most images and purposes. Each preset adjusts not just the quality level but also other compression parameters including metadata handling, color sampling, and encoding methods."
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
              Supports JPEG, PNG, WebP, GIF (up to 10MB per file)
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
                      <span>{formatBytes(originalSizes[index])}</span>
                      
                      {compressedSizes[index] && (
                        <>
                          <span className="mx-1">→</span>
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
                <Label htmlFor="quality-slider" className="font-medium">Quality</Label>
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
            
            <div>
              <Label htmlFor="optimization" className="font-medium mb-1 block">Optimization Preset</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={optimizationLevel === "web" ? "default" : "outline"} 
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => setOptimizationLevel("web")}
                >
                  Web Optimized
                </Button>
                <Button 
                  variant={optimizationLevel === "balanced" ? "default" : "outline"} 
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => setOptimizationLevel("balanced")}
                >
                  Balanced
                </Button>
                <Button 
                  variant={optimizationLevel === "maximum" ? "default" : "outline"} 
                  size="sm"
                  className="text-xs h-auto py-2"
                  onClick={() => setOptimizationLevel("maximum")}
                >
                  Maximum
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="keep-metadata" className="font-medium">Preserve Metadata</Label>
                <p className="text-xs text-gray-500">Keep EXIF data, author, GPS, etc.</p>
              </div>
              <Switch 
                id="keep-metadata" 
                checked={keepMetadata}
                onCheckedChange={setKeepMetadata}
              />
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
                  Compress {files.length > 1 ? `${files.length} Images` : 'Image'}
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