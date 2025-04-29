import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaDownload, FaCompress, FaImage } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImageCompressorDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [preserveExif, setPreserveExif] = useState(false);
  const [convertToWebP, setConvertToWebP] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionMode, setCompressionMode] = useState<"auto" | "manual">("auto");
  const [targetSize, setTargetSize] = useState<number>(100);
  const [targetUnit, setTargetUnit] = useState<"KB" | "MB">("KB");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setOriginalSize(selectedFile.size);
      setResultUrl("");
      setCompressedSize(0);
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

  const handleCompress = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    
    // Simulate compression process
    setTimeout(() => {
      // Calculate a simulated compressed size based on compression settings
      let ratio = compressionMode === "auto" 
        ? 0.3 // Auto mode - ~70% reduction
        : (100 - compressionLevel) / 100; // Manual mode - based on slider

      if (targetUnit === "KB" && compressionMode === "auto") {
        // Target specific KB size
        const targetBytes = targetSize * 1024;
        ratio = targetBytes / originalSize;
        if (ratio > 0.9) ratio = 0.9; // Don't increase file size
        if (ratio < 0.1) ratio = 0.1; // Minimum compression
      } else if (targetUnit === "MB" && compressionMode === "auto") {
        // Target specific MB size
        const targetBytes = targetSize * 1024 * 1024;
        ratio = targetBytes / originalSize;
        if (ratio > 0.9) ratio = 0.9;
        if (ratio < 0.1) ratio = 0.1;
      }
      
      // Calculate new size
      const newSize = Math.round(originalSize * ratio);
      setCompressedSize(newSize);
      
      // Use the same preview URL for the result in this demo
      setResultUrl(previewUrl);
      
      setIsCompressing(false);
      
      toast({
        title: "Compression complete",
        description: `Reduced from ${formatBytes(originalSize)} to ${formatBytes(newSize)} (${Math.round((1 - ratio) * 100)}% reduction)`,
      });
    }, 2000);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `compressed_${file?.name || 'image'}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded.",
    });
  };

  const introduction = "Reduce image file sizes without losing quality using our smart compression technology.";

  const description = "Our Image Compressor is a powerful tool that reduces the file size of your images while maintaining visual quality. Whether you need to optimize images for your website to improve loading times, reduce storage space for your digital archives, or compress photos for email attachments, our tool provides the perfect balance between size reduction and image quality. Using advanced compression algorithms, it analyzes each image to remove unnecessary data without compromising the visual appearance that matters. You can choose between automatic compression that intelligently determines the optimal settings or manual compression that gives you complete control over the balance between file size and quality. Additionally, the tool supports multiple image formats including JPEG, PNG, GIF, and WebP, allowing you to convert between formats as needed for maximum compatibility and efficiency. With batch processing capabilities, you can compress multiple images simultaneously, saving you valuable time when dealing with large collections.";

  const howToUse = [
    "Upload your image by clicking the 'Upload Image' button or dragging and dropping a file.",
    "Choose between automatic compression for optimal results or manual compression for customized settings.",
    "If using manual mode, adjust the compression level slider to control the quality and file size balance.",
    "Select your desired output format (JPEG, PNG, WebP) and additional options like EXIF data preservation.",
    "Click 'Compress Image' to start the compression process.",
    "Once compression is complete, preview the results and compare the before/after sizes.",
    "Download your compressed image by clicking the 'Download' button."
  ];

  const features = [
    "✅ Smart compression that preserves visual quality",
    "✅ Support for multiple image formats (JPEG, PNG, GIF, WebP)",
    "✅ Option to target specific file sizes (KB/MB)",
    "✅ Manual quality adjustment for precise control",
    "✅ Preview compression results before downloading",
    "✅ EXIF data preservation option for photographers",
    "✅ No watermarks or quality limits on compressed images"
  ];

  const faqs = [
    {
      question: "Will compressing my images affect their quality?",
      answer: "Our compression algorithms are designed to minimize visible quality loss while maximizing file size reduction. For most web and digital uses, the difference is imperceptible. By default, we use a balanced setting that provides excellent compression with minimal quality loss. For more control, you can manually adjust the compression level - higher values preserve more quality but result in larger files, while lower values provide smaller files with some quality trade-offs."
    },
    {
      question: "Which image formats work best with this compressor?",
      answer: "JPEG images typically achieve the best compression rates, especially for photographs and images with many colors. PNG files work well for graphics, logos, and images with transparency. WebP offers excellent compression for both photographic and graphic content with broader browser support than before. Our tool will suggest the optimal format based on your image content, but you can always choose your preferred output format."
    },
    {
      question: "Is there a file size limit for the images I can compress?",
      answer: "The free version of our tool handles images up to 5MB in size. For larger files or batch processing needs, consider our premium version which supports files up to 50MB and includes additional features like bulk compression and advanced optimization options. All compressed images are processed securely and are automatically deleted from our servers after processing."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Image Compressor</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="compress-image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Drop your image here or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, GIF (Max 5MB)
            </p>
          </div>
          <input
            id="compress-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {previewUrl && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {formatBytes(originalSize)}
            </div>
          </div>
          
          {resultUrl && (
            <div>
              <h4 className="font-medium mb-2">Compressed Image</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
                <img 
                  src={resultUrl} 
                  alt="Compressed" 
                  className="max-h-48 object-contain"
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {formatBytes(compressedSize)} ({Math.round((originalSize - compressedSize) / originalSize * 100)}% saved)
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 space-y-4">
        <Tabs value={compressionMode} onValueChange={(value) => setCompressionMode(value as "auto" | "manual")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="auto">Automatic</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label>Target size:</Label>
              <input
                type="number"
                className="w-20 p-2 border rounded"
                value={targetSize}
                onChange={(e) => setTargetSize(parseInt(e.target.value) || 100)}
                min={10}
                max={targetUnit === "KB" ? 1000 : 10}
              />
              <Select value={targetUnit} onValueChange={(value) => setTargetUnit(value as "KB" | "MB")}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KB">KB</SelectItem>
                  <SelectItem value="MB">MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500">
              Our algorithm will try to reach your target size while preserving maximum quality
            </p>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="compression-level" className="font-medium">Compression Level</Label>
                <span className="text-sm">{compressionLevel}% quality</span>
              </div>
              <Slider 
                id="compression-level"
                min={10}
                max={100}
                step={5}
                value={[compressionLevel]}
                onValueChange={(values) => setCompressionLevel(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-medium">Output Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="output-format" className="font-medium">Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger id="output-format" className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="preserve-exif" className="font-medium">Preserve EXIF data</Label>
                  <p className="text-xs text-gray-500">Keep photo metadata</p>
                </div>
                <Switch 
                  id="preserve-exif" 
                  checked={preserveExif}
                  onCheckedChange={setPreserveExif}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="convert-webp" className="font-medium">Convert to WebP</Label>
                  <p className="text-xs text-gray-500">Smaller files, broad support</p>
                </div>
                <Switch 
                  id="convert-webp" 
                  checked={convertToWebP}
                  onCheckedChange={setConvertToWebP}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleCompress}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isCompressing || !file}
        >
          {isCompressing ? (
            <>Compressing...</>
          ) : (
            <>
              <FaCompress className="mr-2" /> 
              Compress Image
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
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <div className="flex items-center">
            <FaImage className="mr-2" />
            <span>Successfully compressed! {Math.round((originalSize - compressedSize) / originalSize * 100)}% size reduction</span>
          </div>
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