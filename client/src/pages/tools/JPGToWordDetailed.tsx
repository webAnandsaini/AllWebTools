import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const JPGToWordDetailed = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [conversionHistory, setConversionHistory] = useState<Array<{ name: string, size: string, url: string }>>([]);
  const [conversionType, setConversionType] = useState<"basic" | "ocr">("basic");
  const [ocrLanguage, setOcrLanguage] = useState("english");
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [imageQuality, setImageQuality] = useState("medium");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.classList.add("border-primary", "bg-blue-50");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.classList.remove("border-primary", "bg-blue-50");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.classList.remove("border-primary", "bg-blue-50");
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/jpg" || 
      file.type === "image/png"
    );
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload JPG or PNG image files only",
        variant: "destructive",
      });
      return;
    }
    
    if (imageFiles.length > 10) {
      toast({
        title: "Too many files",
        description: "You can upload a maximum of 10 images at once",
        variant: "destructive",
      });
      return;
    }
    
    setFiles(imageFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertFiles = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one JPG image to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    // Simulate conversion completion after some time
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Create a placeholder .docx download URL
      // In a real implementation, this would be a URL to the converted file from the server
      const dummyDocxUrl = "#";
      setConvertedUrl(dummyDocxUrl);
      
      // Add to conversion history
      const newHistoryItem = {
        name: files.length > 1 
          ? `${files.length} images converted.docx` 
          : files[0].name.replace(/\.(jpg|jpeg|png)$/i, ".docx"),
        size: "215 KB",
        url: dummyDocxUrl
      };
      
      setConversionHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
      setIsConverting(false);
      
      toast({
        title: "Conversion complete",
        description: `${files.length} ${files.length === 1 ? "image has" : "images have"} been converted to Word format`,
      });
    }, 3000);
  };

  const downloadConverted = () => {
    if (!convertedUrl) return;
    
    // In a real implementation, this would trigger the actual download
    // For this demo, we'll simulate a download by showing a toast
    toast({
      title: "Download started",
      description: "Your converted Word document is being downloaded",
    });
    
    // Actual implementation would use something like:
    // const a = document.createElement("a");
    // a.href = convertedUrl;
    // a.download = "converted-document.docx";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Upload JPG Images</h3>
            
            <Tabs defaultValue="upload" className="w-full mb-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="settings">Conversion Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="pt-4">
                <div>
                  <div
                    ref={dragAreaRef}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200 mb-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                      <i className="fas fa-cloud-upload-alt text-5xl"></i>
                    </div>
                    <p className="text-gray-700 mb-2">Drag & drop your JPG images here</p>
                    <p className="text-gray-500 text-sm mb-4">or</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <i className="fas fa-images mr-2"></i>
                      Browse Images
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats: JPG, JPEG, PNG (max. 10 images, 10MB each)
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Selected Files ({files.length})</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={clearFiles}
                            className="h-8 px-2 text-gray-500"
                          >
                            <i className="fas fa-times-circle mr-1"></i>
                            Clear All
                          </Button>
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {files.map((file, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between bg-white p-2 rounded"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center mr-3">
                                  <i className="fas fa-file-image text-blue-600"></i>
                                </div>
                                <div className="truncate max-w-[150px]">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-700"
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={convertFiles}
                          disabled={isConverting || files.length === 0}
                          className="bg-primary hover:bg-blue-700 transition"
                        >
                          <i className="fas fa-exchange-alt mr-2"></i>
                          <span>{isConverting ? "Converting..." : "Convert to Word"}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="conversionType" className="text-base font-medium">Conversion Type</Label>
                  <Select 
                    value={conversionType} 
                    onValueChange={(value) => setConversionType(value as "basic" | "ocr")}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select conversion type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Images Only)</SelectItem>
                      <SelectItem value="ocr">OCR (Extract Text from Images)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {conversionType === "ocr" && (
                  <div>
                    <Label htmlFor="ocrLanguage" className="text-base font-medium">OCR Language</Label>
                    <Select 
                      value={ocrLanguage} 
                      onValueChange={setOcrLanguage}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select OCR language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="dutch">Dutch</SelectItem>
                        <SelectItem value="chinese">Chinese (Simplified)</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="preserveLayout" 
                      checked={preserveLayout}
                      onCheckedChange={setPreserveLayout}
                    />
                    <Label htmlFor="preserveLayout">Preserve Original Layout</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="includeImages" 
                      checked={includeImages}
                      onCheckedChange={setIncludeImages}
                    />
                    <Label htmlFor="includeImages">Include Images in Document</Label>
                  </div>
                </div>
                
                {includeImages && (
                  <div>
                    <Label htmlFor="imageQuality" className="text-base font-medium">Image Quality</Label>
                    <Select 
                      value={imageQuality} 
                      onValueChange={setImageQuality}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select image quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Smaller File Size)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Better Quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Conversion Output</h3>
            
            {isConverting ? (
              <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                <Progress value={progress} className="w-full mb-4" />
                <p className="text-gray-700">Converting your images to Word...</p>
                <p className="text-gray-500 text-sm mt-2">This might take a few moments</p>
              </div>
            ) : convertedUrl ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-3">
                      <i className="fas fa-check text-green-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Conversion Successful</h4>
                      <p className="text-sm text-green-700">
                        Your {files.length} {files.length === 1 ? "image has" : "images have"} been successfully converted to Word format
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <i className="fas fa-file-word text-blue-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {files.length > 1 
                          ? `${files.length} images converted.docx` 
                          : files[0].name.replace(/\.(jpg|jpeg|png)$/i, ".docx")}
                      </p>
                      <p className="text-xs text-gray-500">Word Document • 215 KB</p>
                    </div>
                    <Button
                      onClick={downloadConverted}
                      className="bg-primary hover:bg-blue-700 transition"
                    >
                      <i className="fas fa-download mr-2"></i>
                      <span>Download</span>
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <p><span className="font-medium">Conversion Type:</span> {conversionType === "ocr" ? "OCR (Text Extraction)" : "Basic"}</p>
                    {conversionType === "ocr" && <p><span className="font-medium">OCR Language:</span> {ocrLanguage.charAt(0).toUpperCase() + ocrLanguage.slice(1)}</p>}
                    <p><span className="font-medium">Layout Preserved:</span> {preserveLayout ? "Yes" : "No"}</p>
                    <p><span className="font-medium">Images Included:</span> {includeImages ? "Yes" : "No"}</p>
                    {includeImages && <p><span className="font-medium">Image Quality:</span> {imageQuality.charAt(0).toUpperCase() + imageQuality.slice(1)}</p>}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    onClick={clearFiles}
                    variant="outline"
                  >
                    <i className="fas fa-redo mr-2"></i>
                    <span>Convert Another</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 text-gray-300">
                  <i className="fas fa-file-word text-5xl"></i>
                </div>
                <p className="text-gray-500">Your converted Word document will appear here</p>
                <p className="text-gray-400 text-sm mt-2">Upload JPG images and click "Convert to Word"</p>
              </div>
            )}
            
            {conversionHistory.length > 0 && !isConverting && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Recent Conversions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {conversionHistory.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          <i className="fas fa-file-word text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[180px]">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={downloadConverted}
                      >
                        <i className="fas fa-download text-gray-600"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-cog text-blue-600"></i>
              </div>
              <h3 className="font-medium">OCR Technology</h3>
            </div>
            <p className="text-sm text-gray-600">
              Our advanced OCR technology can recognize and extract text from your JPG images, making it fully editable in the resulting Word document.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-file-alt text-purple-600"></i>
              </div>
              <h3 className="font-medium">Layout Preservation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Maintains the original layout of your JPG images in the Word document, including text positioning, tables, and formatting.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-language text-green-600"></i>
              </div>
              <h3 className="font-medium">Multi-language Support</h3>
            </div>
            <p className="text-sm text-gray-600">
              Our OCR engine supports text extraction in multiple languages, ensuring accurate conversion regardless of the content language.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const contentData = {
    introduction: "Convert JPG images to editable Word documents with accurate text recognition and layout preservation.",
    description: "Our JPG to Word converter is a powerful tool that transforms static JPG images into fully editable Microsoft Word documents. Using advanced Optical Character Recognition (OCR) technology, this tool can identify and extract text content from your images with high accuracy, while preserving the original formatting and layout. The converter offers two primary conversion modes: Basic mode for simple image insertion into Word documents, and OCR mode for text extraction that makes the content fully editable. Supporting multiple languages including English, Spanish, French, German, Chinese, Japanese, and more, the tool accommodates diverse global content. With options to preserve original layouts, include or exclude images, and adjust image quality, users have complete control over the conversion process. Whether you're digitizing printed documents, extracting text from scanned pages, or converting image-based reports into editable formats, our JPG to Word converter streamlines the process, eliminating the need for manual retyping and ensuring you get a professionally formatted, editable Word document in seconds.",
    howToUse: [
      "Upload your JPG images by dragging and dropping them into the upload area or clicking 'Browse Images' to select files from your device.",
      "Choose your conversion settings: select 'Basic' for simple image insertion or 'OCR' to extract and make text editable.",
      "If using OCR, select the language of the text in your images from the supported languages list.",
      "Toggle options for layout preservation, image inclusion, and image quality according to your needs.",
      "Click 'Convert to Word' and wait for the conversion process to complete.",
      "Once conversion is finished, preview the conversion details and click 'Download' to save your new Word document.",
      "For multiple conversions, use the 'Convert Another' button or access your recent conversions from the history section."
    ],
    features: [
      "Advanced OCR technology that accurately recognizes and extracts text from images",
      "Support for multiple languages including English, Spanish, French, German, Chinese, and more",
      "Layout preservation that maintains the original formatting structure of your documents",
      "Batch conversion supporting up to 10 images at once for efficient document processing",
      "Adjustable image quality settings to balance file size and visual fidelity",
      "Conversion history that lets you access and download your recently converted documents",
      "Intuitive drag-and-drop interface for easy file uploading and management"
    ],
    faqs: [
      {
        question: "How accurate is the text recognition for JPG to Word conversion?",
        answer: "The accuracy of our JPG to Word text recognition depends on several factors including image quality, text clarity, and formatting complexity. For clear, high-resolution images with standard fonts, our OCR technology typically achieves 95-99% accuracy. However, factors that may reduce accuracy include: low image resolution, blurry or distorted text, unusual fonts or stylized text, complex layouts with multiple columns or tables, background patterns or watermarks that interfere with text, and handwritten text (which is more challenging for OCR). For best results, we recommend using clear, high-resolution images with good contrast between text and background. If you're scanning physical documents, set your scanner to at least 300 DPI for optimal OCR performance."
      },
      {
        question: "What happens to tables, images, and special formatting during conversion?",
        answer: "Our JPG to Word converter handles various document elements differently depending on the conversion mode and settings you select: 1) Tables: In OCR mode with layout preservation enabled, the converter attempts to recognize table structures and recreate them in the Word document. Complex tables may require some manual adjustment after conversion. 2) Images: With the 'Include Images' option enabled, any non-text elements are preserved as images in the Word document. You can adjust image quality to balance visual fidelity with file size. 3) Special formatting: Text styles (bold, italic, underline), font sizes, and basic alignment are typically preserved. More complex formatting such as text boxes, columns, or decorative elements may be approximated or simplified. 4) Headers/footers: These elements are usually recognized and placed appropriately in the Word document structure. For documents with highly specialized or complex formatting, some manual adjustments may be necessary after conversion."
      },
      {
        question: "Is there a limit to the file size or number of JPG images I can convert?",
        answer: "Yes, our JPG to Word converter has certain limitations to ensure system performance and service availability: 1) Number of files: You can convert up to 10 JPG images in a single batch. For larger documents, you may need to process them in multiple batches. 2) File size: Each individual JPG image must not exceed 10MB. Larger files should be compressed or resized before uploading. 3) Cumulative size: The total size of all files in a batch should not exceed 50MB. 4) Image dimensions: While there's no strict limit on image dimensions (width and height), extremely large images (e.g., over 5000x5000 pixels) may be automatically resized for processing. 5) Processing time: Larger and more complex images will naturally take longer to process, particularly when using OCR. These limits apply to the free version of our tool. For users with more extensive conversion needs, we offer premium plans with higher limits and additional features. If you regularly need to convert large volumes of JPG images to Word, upgrading to a premium plan would provide a more suitable solution."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="jpg-to-word"
      toolContent={
        <ToolContentTemplate
          introduction={contentData.introduction}
          description={contentData.description}
          howToUse={contentData.howToUse}
          features={contentData.features}
          faqs={contentData.faqs}
          toolInterface={contentData.toolInterface}
        />
      }
    />
  );
};

export default JPGToWordDetailed;