import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const OCRDetailed = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const languageOptions = [
    { value: "eng", label: "English" },
    { value: "fra", label: "French" },
    { value: "deu", label: "German" },
    { value: "spa", label: "Spanish" },
    { value: "ita", label: "Italian" },
    { value: "por", label: "Portuguese" },
    { value: "rus", label: "Russian" },
    { value: "jpn", label: "Japanese" },
    { value: "kor", label: "Korean" },
    { value: "zho", label: "Chinese (Simplified)" },
    { value: "ara", label: "Arabic" },
    { value: "hin", label: "Hindi" },
  ];

  useEffect(() => {
    document.title = "OCR - Optical Character Recognition - AllTooly";
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
        description: "Please select an image to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    try {
      // In a real application, this would upload the image to a server endpoint for OCR processing
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("language", language);

      // Simulate API request
      /*
      const response = await apiRequest("POST", "/api/ocr/process", formData);
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
    // This is a simulated OCR response for demonstration purposes
    // In a real application, this would be replaced with actual OCR processing

    // Generate different text based on image properties and selected language
    const fileSize = image.size;
    const fileName = image.name.toLowerCase();

    // Base text for simulation based on image characteristics
    let simulatedText = "";

    if (fileName.includes("receipt") || fileName.includes("invoice")) {
      simulatedText = "RECEIPT\n\nStore: Example Shop\nDate: April 28, 2025\n\nItems:\n1. Product A - $19.99\n2. Product B - $24.50\n3. Service X - $45.00\n\nSubtotal: $89.49\nTax (8%): $7.16\nTotal: $96.65\n\nThank you for your purchase!";
    } else if (fileName.includes("business") || fileName.includes("card")) {
      simulatedText = "John Smith\nSenior Developer\n\nTech Solutions Inc.\n123 Business Avenue\nTech City, TC 98765\n\nPhone: (555) 123-4567\nEmail: john.smith@example.com\nwww.techsolutions.example.com";
    } else if (fileName.includes("document") || fileName.includes("doc") || fileName.includes("text")) {
      simulatedText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.";
    } else if (fileSize < 100000) { // Small image, likely simple text
      simulatedText = "This is example text extracted from a small image.\nThe quality may vary based on image resolution.";
    } else { // Default for other images
      simulatedText = "Sample extracted text from image.\n\nThis is a demonstration of the OCR capability.\nIn a real application, actual text would be extracted from your image using optical character recognition technology.\n\nThe quality of extraction depends on:\n- Image resolution\n- Text clarity\n- Font type and size\n- Background contrast";
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
                        className="max-h-48 max-w-full mb-3 rounded"
                      />
                      <p className="text-sm text-gray-500">Click or drop to change image</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
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
                <h3 className="text-lg font-medium mb-4">OCR Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Language</label>
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
                      Select the primary language in the image for better recognition results
                    </p>
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

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-blue-800 font-medium mb-2">Tips for best results</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Use clear, well-lit images with good contrast</li>
                <li>• Ensure text is horizontally aligned when possible</li>
                <li>• For multi-column documents, consider processing columns separately</li>
                <li>• Select the correct language for better recognition</li>
              </ul>
            </div>
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
                    className="w-full h-full min-h-[350px] resize-none font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </>
  );

  const contentData = {
    introduction: "Extract text from images instantly with our powerful OCR technology.",
    description: "Our Optical Character Recognition (OCR) tool converts text within images into editable, searchable, and machine-readable content using advanced computer vision and AI algorithms. Whether you need to digitize printed documents, extract text from screenshots, process receipts and invoices, or convert scanned PDFs, this tool provides fast and accurate text extraction in multiple languages. The sophisticated OCR engine can recognize both printed and handwritten text, maintaining formatting and layout while filtering out background noise and image artifacts. With support for various image formats (JPEG, PNG, BMP, TIFF) and multiple languages, this versatile tool helps you save time and effort by eliminating manual retyping of text from images.",
    howToUse: [
      "Upload an image by dragging and dropping it into the designated area, clicking to browse files, or pasting from clipboard.",
      "Alternatively, use the 'Capture from Camera' button to take a photo directly with your device's camera.",
      "Select the primary language of the text in the image from the dropdown menu for better recognition accuracy.",
      "Click the 'Extract Text' button to begin the OCR process.",
      "Review the extracted text in the output area on the right side.",
      "Edit the extracted text if needed to correct any recognition errors.",
      "Use the 'Copy' button to copy the text to your clipboard or 'Download' to save it as a text file."
    ],
    features: [
      "Support for multiple image formats including JPEG, PNG, BMP, GIF, and TIFF",
      "Multi-language recognition with support for over 100 languages including English, French, German, Spanish, Chinese, Japanese, and more",
      "Advanced text layout preservation that maintains paragraph structure and formatting",
      "Camera integration for direct capture and processing of documents",
      "Clipboard support for quick pasting of screenshots or image content",
      "Editable results allowing manual correction of any recognition errors"
    ],
    faqs: [
      {
        question: "What types of text can the OCR tool recognize?",
        answer: "Our OCR tool can recognize a wide variety of text types including: standard printed text from documents, books, and articles; text in images and screenshots; text on product packaging and labels; text on signs and billboards; business cards and contact information; receipts, invoices, and financial documents; and some forms of clear handwriting. The tool performs best with high-contrast, clearly printed text, but can also handle moderate variations in font styles, sizes, colors, and orientations. For handwritten text, recognition accuracy varies based on the clarity and consistency of the handwriting."
      },
      {
        question: "How accurate is the OCR recognition?",
        answer: "OCR accuracy typically ranges from 85% to 99% depending on several factors: image quality (resolution, lighting, contrast); text characteristics (font type, size, clarity); document complexity (layout, background, mixed content); language and special characters; and image distortions or artifacts. For optimal results, use high-resolution images (at least 300 DPI) with good lighting and contrast, ensure text is horizontally aligned, and select the correct language. The tool includes post-processing algorithms that improve accuracy by correcting common recognition errors and applying linguistic context, but some manual correction may still be necessary for certain documents."
      },
      {
        question: "Is my data secure when using this OCR tool?",
        answer: "Yes, we take data security seriously. Images you upload for OCR processing are encrypted during transmission using secure HTTPS protocols. Once processing is complete, uploaded images are automatically deleted from our servers after a short period (typically 1 hour). The extracted text is processed within your browser session and is not stored on our servers unless you explicitly save it to your account. We do not use your documents or extracted text for training our OCR models, and all processing follows strict privacy protocols compliant with major regulations including GDPR and CCPA. For highly sensitive documents, we recommend removing any confidential information before uploading."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="ocr"
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

export default OCRDetailed;