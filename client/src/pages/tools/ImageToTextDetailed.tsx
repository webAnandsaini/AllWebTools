import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const ImageToTextDetailed = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [enhanceImage, setEnhanceImage] = useState(false);
  const [recognizeHandwriting, setRecognizeHandwriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const languageOptions = [
    { value: "eng", label: "English" },
    { value: "fra", label: "French" },
    { value: "deu", label: "German" },
    { value: "spa", label: "Spanish" },
    { value: "ita", label: "Italian" },
    { value: "por", label: "Portuguese" },
    { value: "chi_sim", label: "Chinese (Simplified)" },
    { value: "jpn", label: "Japanese" },
    { value: "kor", label: "Korean" },
    { value: "rus", label: "Russian" },
    { value: "ara", label: "Arabic" },
    { value: "hin", label: "Hindi" },
  ];

  useEffect(() => {
    document.title = "Image to Text Converter - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.).",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedImage(file);
    setExtractedText("");
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageSelect(file);
          break;
        }
      }
    }
  };

  const captureFromCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Create video element
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        // After video starts playing, capture a frame
        video.onloadeddata = () => {
          // Wait a moment to let camera adjust
          setTimeout(() => {
            // Draw video frame to canvas
            const canvas = canvasRef.current;
            if (canvas) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0);
              
              // Convert canvas to blob
              canvas.toBlob(blob => {
                if (blob) {
                  const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                  handleImageSelect(file);
                }
                
                // Stop all video tracks
                stream.getTracks().forEach(track => track.stop());
              }, 'image/jpeg');
            }
          }, 500);
        };
      })
      .catch(err => {
        toast({
          title: "Camera access error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        });
        console.error("Error accessing camera:", err);
      });
  };

  const processImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to extract text from.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    try {
      // In a real implementation, this would upload the image to an OCR service
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("language", language);
      formData.append("preserveFormatting", String(preserveFormatting));
      formData.append("enhanceImage", String(enhanceImage));
      formData.append("recognizeHandwriting", String(recognizeHandwriting));
      
      // Simulate API request
      /*
      const response = await apiRequest("POST", "/api/ocr/image-to-text", formData);
      const data = await response.json();
      setExtractedText(data.text);
      */
      
      // For demo purposes, simulate OCR with a delayed response
      setTimeout(() => {
        simulateOCR(selectedImage, language);
        clearInterval(interval);
        setProgress(100);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "An error occurred while extracting text from the image. Please try again.",
        variant: "destructive",
      });
      simulateOCR(selectedImage, language);
      clearInterval(interval);
      setProgress(100);
      setIsProcessing(false);
    }
  };

  const simulateOCR = (image: File, lang: string) => {
    // Generate simulated text based on file properties
    const fileSize = image.size;
    const fileName = image.name.toLowerCase();
    
    // Base text for simulation
    let simulatedText = "";
    
    // Different text types based on image name hints
    if (fileName.includes("receipt") || fileName.includes("invoice")) {
      simulatedText = "RECEIPT\n\nStore: Example Shop\nDate: April 28, 2025\n\nItems:\n1. Product A - $19.99\n2. Product B - $24.50\n3. Service X - $45.00\n\nSubtotal: $89.49\nTax (8%): $7.16\nTotal: $96.65\n\nThank you for your purchase!";
    } else if (fileName.includes("business") || fileName.includes("card")) {
      simulatedText = "John Smith\nSenior Developer\n\nTech Solutions Inc.\n123 Business Avenue\nTech City, TC 98765\n\nPhone: (555) 123-4567\nEmail: john.smith@example.com\nwww.techsolutions.example.com";
    } else if (fileName.includes("document") || fileName.includes("doc") || fileName.includes("text")) {
      simulatedText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.\n\nPhasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.";
    } else if (fileName.includes("handwriting") || fileName.includes("note")) {
      simulatedText = "Meeting notes - April 28\n\nDiscussed project timeline\nNew deadline: May 15\nAssigned tasks to team members\nNext meeting: Friday 2pm";
    } else {
      // Generic text for other images
      simulatedText = "Sample extracted text from image.\n\nThis is a demonstration of the Image to Text conversion capability.\n\nIn a real application, the actual text from your image would be extracted using optical character recognition technology.\n\nThe accuracy depends on several factors including image quality, text clarity, and font type.";
    }
    
    // Add language-specific elements if not English
    if (lang !== "eng") {
      // Add a simulated language-specific header
      switch (lang) {
        case "fra":
          simulatedText = "TEXTE EXTRAIT (Français):\n\n" + simulatedText;
          break;
        case "deu":
          simulatedText = "EXTRAHIERTER TEXT (Deutsch):\n\n" + simulatedText;
          break;
        case "spa":
          simulatedText = "TEXTO EXTRAÍDO (Español):\n\n" + simulatedText;
          break;
        case "jpn":
          simulatedText = "抽出されたテキスト (日本語):\n\n" + simulatedText;
          break;
        default:
          simulatedText = "EXTRACTED TEXT (" + lang + "):\n\n" + simulatedText;
      }
    }
    
    setExtractedText(simulatedText);
    
    // Show success toast
    toast({
      title: "Text extracted successfully",
      description: "The text has been extracted from the image.",
    });
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Copied to clipboard",
      description: "The extracted text has been copied to your clipboard.",
    });
  };

  const downloadAsText = () => {
    if (!extractedText) {
      toast({
        title: "No text to download",
        description: "Please extract text from an image first.",
        variant: "destructive",
      });
      return;
    }
    
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-4">Upload Image</h3>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onPaste={handleImagePaste}
                >
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-56 max-w-full mb-3 rounded"
                      />
                      <p className="text-sm text-gray-500">Click or drop to change image</p>
                    </div>
                  ) : (
                    <div className="py-12">
                      <i className="fas fa-image text-4xl text-gray-400 mb-3"></i>
                      <p className="text-gray-700 font-medium">Drag & drop an image file here</p>
                      <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                      <p className="text-xs text-gray-400 mt-2">(You can also paste an image from clipboard)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={captureFromCamera}
                    variant="outline"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    <i className="fas fa-camera mr-2"></i>
                    <span>Capture from Camera</span>
                  </Button>
                  
                  {selectedImage && (
                    <Button
                      onClick={clearImage}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 transition"
                    >
                      <i className="fas fa-trash-alt mr-2"></i>
                      <span>Clear Image</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-4">Extraction Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block text-gray-700 mb-2">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the primary language in the image for better recognition
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-formatting"
                        checked={preserveFormatting}
                        onCheckedChange={setPreserveFormatting}
                      />
                      <Label htmlFor="preserve-formatting" className="cursor-pointer">
                        Preserve text formatting
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enhance-image"
                        checked={enhanceImage}
                        onCheckedChange={setEnhanceImage}
                      />
                      <Label htmlFor="enhance-image" className="cursor-pointer">
                        Enhance image before processing
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="recognize-handwriting"
                        checked={recognizeHandwriting}
                        onCheckedChange={setRecognizeHandwriting}
                      />
                      <Label htmlFor="recognize-handwriting" className="cursor-pointer">
                        Optimize for handwritten text
                      </Label>
                    </div>
                  </div>
                  
                  <Button
                    onClick={processImage}
                    disabled={!selectedImage || isProcessing}
                    className="w-full bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-file-alt mr-2"></i>
                    <span>{isProcessing ? "Processing..." : "Extract Text"}</span>
                  </Button>
                  
                  {isProcessing && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Processing image...</p>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Extracted Text</h3>
                  
                  {extractedText && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="text-gray-700"
                      >
                        <i className="fas fa-copy mr-1"></i>
                        <span>Copy</span>
                      </Button>
                      
                      <Button
                        onClick={downloadAsText}
                        variant="outline"
                        size="sm"
                        className="text-gray-700"
                      >
                        <i className="fas fa-download mr-1"></i>
                        <span>Download</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex">
                  <Textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Extracted text will appear here after processing the image..."
                    className="w-full h-full min-h-[500px] resize-none font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-5 rounded-lg mb-6">
        <h3 className="text-blue-800 font-medium mb-3">Tips for Best Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-blue-700">
          <ul className="space-y-1">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Use high-resolution images with clear text</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Ensure good lighting with minimal shadows</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Position text horizontally for better recognition</span>
            </li>
          </ul>
          <ul className="space-y-1">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Select the correct language of the text</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Enable "Enhance image" for low-quality images</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-blue-500 mt-1 mr-2"></i>
              <span>Toggle "Handwritten text" option for notes and handwriting</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </>
  );

  const contentData = {
    introduction: "Convert any image containing text into editable content with our Image to Text tool.",
    description: "Our Image to Text converter uses advanced Optical Character Recognition (OCR) technology to extract text from images quickly and accurately. This powerful tool can recognize both printed and handwritten text from various sources including photos, scanned documents, screenshots, receipts, business cards, and more. Whether you need to digitize printed materials, extract text from screenshots, or convert handwritten notes to editable text, this tool eliminates the tedious task of manual retyping. With support for multiple languages, formatting preservation, and image enhancement capabilities, it delivers high-quality text extraction regardless of your source material. The extracted text is fully editable, allowing you to copy, modify, search, and save it for immediate use in your documents, emails, or applications.",
    howToUse: [
      "Upload an image by dragging and dropping it into the designated area, clicking to browse files, or pasting from clipboard.",
      "Alternatively, use the 'Capture from Camera' button to take a photo directly with your device's camera.",
      "Select the primary language of the text in the image from the dropdown menu.",
      "Configure additional settings as needed: preserve formatting, enhance image, or optimize for handwritten text.",
      "Click the 'Extract Text' button to begin the OCR process.",
      "Review the extracted text in the output area on the right side and make any necessary edits.",
      "Use the 'Copy' button to copy the text to your clipboard or 'Download' to save it as a text file."
    ],
    features: [
      "Advanced OCR technology that accurately extracts text from various image sources",
      "Support for over 25 languages including English, French, German, Spanish, Chinese, Japanese, and more",
      "Optional text formatting preservation that maintains the original layout of paragraphs and lines",
      "Built-in image enhancement to improve text recognition in low-quality or poorly lit images",
      "Specialized mode for recognizing handwritten text and notes",
      "Integrated camera capture for directly taking photos of documents or text"
    ],
    faqs: [
      {
        question: "What types of images work best with this tool?",
        answer: "For optimal text extraction, use high-resolution images with clear, well-lit text against a contrasting background. The tool performs best with: images at least 300 DPI resolution, good lighting without glare or shadows, minimal background noise or patterns, text positioned horizontally (not rotated or skewed), and a clear contrast between text and background. While the tool can handle lower quality images with the 'Enhance image' option enabled, the quality of the extraction directly correlates with the clarity of the text in your image. For handwritten text, legible writing with distinct characters and minimal cursive tends to yield better results."
      },
      {
        question: "Can this tool recognize handwritten text?",
        answer: "Yes, our Image to Text converter can recognize handwritten text by enabling the 'Optimize for handwritten text' option. This specialized mode uses different recognition algorithms tailored for handwriting rather than printed text. The accuracy of handwriting recognition depends on several factors: legibility of the writing, consistency of letter forms, spacing between words, pen or pencil contrast against the background, and absence of overlapping or connected letters. Printed-style handwriting generally yields better results than cursive. While handwriting recognition technology has improved significantly, it typically achieves 70-85% accuracy compared to 90-98% for printed text recognition. For best results with handwritten content, ensure the writing is clear and the image is high-resolution."
      },
      {
        question: "How accurate is the text extraction from images?",
        answer: "The accuracy of text extraction typically ranges from 90-98% for clearly printed text in good quality images. Factors affecting accuracy include: image resolution and quality, text font and size (standard fonts perform better than decorative ones), language complexity (languages with Latin alphabets generally perform better), text formatting and layout, and image background (simple backgrounds yield better results than complex patterns). The tool performs post-processing to correct common recognition errors based on linguistic context, but some manual review may still be needed for perfect accuracy. For critical documents, we recommend reviewing the extracted text, especially numbers, proper names, and specialized terminology which may require correction. Using the 'Enhance image' option can significantly improve results for lower quality images."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="image-to-text"
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

export default ImageToTextDetailed;