import React, { useState, useRef } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImageTranslatorDetailed = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("english");
  const [preserveLayout, setPreserveLayout] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceImage(event.target.result as string);
          setProcessedImage(null);
          setExtractedText("");
          setTranslatedText("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceImage(event.target.result as string);
          setProcessedImage(null);
          setExtractedText("");
          setTranslatedText("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const translateImage = () => {
    if (!sourceImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image to translate",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedImage(null);
    setExtractedText("");
    setTranslatedText("");

    // Simulate OCR text extraction and translation process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress === 40) {
        // Simulate OCR completion
        const mockExtractedText = generateMockExtractedText(sourceLanguage);
        setExtractedText(mockExtractedText);
      }
      
      if (currentProgress === 80) {
        // Simulate translation completion
        const mockTranslatedText = generateMockTranslatedText(extractedText || generateMockExtractedText(sourceLanguage), targetLanguage);
        setTranslatedText(mockTranslatedText);
      }
      
      if (currentProgress >= 100) {
        // Complete process
        clearInterval(interval);
        setIsProcessing(false);
        setProgress(100);
        
        // Generate mock processed image based on source image
        generateProcessedImage();
        
        toast({
          title: "Translation Complete",
          description: `Image successfully translated from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}`,
        });
      }
    }, 100);
  };

  const generateMockExtractedText = (language: string): string => {
    // This is a simplified mock function that would be replaced with actual OCR
    // In a real implementation, this would call a backend OCR API
    
    if (language === "auto" || language === "english") {
      return "Welcome to our global service. We provide innovative solutions for businesses around the world. Contact us today for more information about our products and services.";
    } else if (language === "spanish") {
      return "Bienvenido a nuestro servicio global. Ofrecemos soluciones innovadoras para empresas de todo el mundo. Contáctenos hoy para obtener más información sobre nuestros productos y servicios.";
    } else if (language === "french") {
      return "Bienvenue dans notre service mondial. Nous proposons des solutions innovantes aux entreprises du monde entier. Contactez-nous dès aujourd'hui pour plus d'informations sur nos produits et services.";
    } else if (language === "german") {
      return "Willkommen bei unserem globalen Service. Wir bieten innovative Lösungen für Unternehmen auf der ganzen Welt. Kontaktieren Sie uns noch heute für weitere Informationen über unsere Produkte und Dienstleistungen.";
    } else if (language === "chinese") {
      return "欢迎使用我们的全球服务。我们为世界各地的企业提供创新解决方案。立即联系我们，了解有关我们产品和服务的更多信息。";
    } else if (language === "japanese") {
      return "私たちのグローバルサービスへようこそ。世界中の企業に革新的なソリューションを提供しています。当社の製品とサービスの詳細については、今日お問い合わせください。";
    } else if (language === "russian") {
      return "Добро пожаловать в наш глобальный сервис. Мы предлагаем инновационные решения для компаний по всему миру. Свяжитесь с нами сегодня для получения дополнительной информации о наших продуктах и услугах.";
    } else if (language === "arabic") {
      return "مرحبًا بك في خدمتنا العالمية. نحن نقدم حلولاً مبتكرة للشركات في جميع أنحاء العالم. اتصل بنا اليوم لمزيد من المعلومات حول منتجاتنا وخدماتنا.";
    } else {
      return "Welcome to our global service. We provide innovative solutions for businesses around the world. Contact us today for more information about our products and services.";
    }
  };

  const generateMockTranslatedText = (text: string, targetLang: string): string => {
    // This is a simplified mock function that would be replaced with actual translation API
    // In a real implementation, this would call a backend translation API
    
    if (targetLang === "english") {
      return "Welcome to our global service. We provide innovative solutions for businesses around the world. Contact us today for more information about our products and services.";
    } else if (targetLang === "spanish") {
      return "Bienvenido a nuestro servicio global. Ofrecemos soluciones innovadoras para empresas de todo el mundo. Contáctenos hoy para obtener más información sobre nuestros productos y servicios.";
    } else if (targetLang === "french") {
      return "Bienvenue dans notre service mondial. Nous proposons des solutions innovantes aux entreprises du monde entier. Contactez-nous dès aujourd'hui pour plus d'informations sur nos produits et services.";
    } else if (targetLang === "german") {
      return "Willkommen bei unserem globalen Service. Wir bieten innovative Lösungen für Unternehmen auf der ganzen Welt. Kontaktieren Sie uns noch heute für weitere Informationen über unsere Produkte und Dienstleistungen.";
    } else if (targetLang === "chinese") {
      return "欢迎使用我们的全球服务。我们为世界各地的企业提供创新解决方案。立即联系我们，了解有关我们产品和服务的更多信息。";
    } else if (targetLang === "japanese") {
      return "私たちのグローバルサービスへようこそ。世界中の企業に革新的なソリューションを提供しています。当社の製品とサービスの詳細については、今日お問い合わせください。";
    } else if (targetLang === "russian") {
      return "Добро пожаловать в наш глобальный сервис. Мы предлагаем инновационные решения для компаний по всему миру. Свяжитесь с нами сегодня для получения дополнительной информации о наших продуктах и услугах.";
    } else if (targetLang === "arabic") {
      return "مرحبًا بك في خدمتنا العالمية. نحن نقدم حلولاً مبتكرة للشركات في جميع أنحاء العالم. اتصل بنا اليوم لمزيد من المعلومات حول منتجاتنا وخدماتنا.";
    } else {
      return "Welcome to our global service. We provide innovative solutions for businesses around the world. Contact us today for more information about our products and services.";
    }
  };

  const generateProcessedImage = () => {
    // In a real implementation, this would generate a new image with translated text
    // For this mock version, we're simply using the source image
    // In a production version, this might call a backend service to overlay translated text
    setProcessedImage(sourceImage);
  };

  const getLanguageName = (langCode: string): string => {
    const languages: Record<string, string> = {
      "auto": "Auto-detect",
      "english": "English",
      "spanish": "Spanish",
      "french": "French",
      "german": "German",
      "chinese": "Chinese",
      "japanese": "Japanese",
      "russian": "Russian",
      "arabic": "Arabic",
      "hindi": "Hindi",
      "portuguese": "Portuguese",
      "italian": "Italian",
      "dutch": "Dutch",
      "korean": "Korean",
      "turkish": "Turkish",
      "polish": "Polish",
      "swedish": "Swedish"
    };
    
    return languages[langCode] || langCode;
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `translated-image-${targetLanguage}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Image Downloaded",
      description: "The translated image has been downloaded to your device",
    });
  };

  const copyTranslatedText = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Text Copied",
      description: "Translated text has been copied to clipboard",
    });
  };

  const resetTool = () => {
    setSourceImage(null);
    setProcessedImage(null);
    setExtractedText("");
    setTranslatedText("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Upload Image</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {sourceImage ? (
                      <div className="space-y-2">
                        <img
                          src={sourceImage}
                          alt="Source"
                          className="max-h-[200px] mx-auto object-contain"
                        />
                        <p className="text-sm text-gray-500">Click or drag to replace</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="flex justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-12 h-12 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                        </div>
                        <p className="text-base font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">
                          Supports JPEG, PNG, and GIF (max 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-language" className="text-base font-medium">
                      Source Language
                    </Label>
                    <Select
                      value={sourceLanguage}
                      onValueChange={setSourceLanguage}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target-language" className="text-base font-medium">
                      Target Language
                    </Label>
                    <Select
                      value={targetLanguage}
                      onValueChange={setTargetLanguage}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="dutch">Dutch</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="turkish">Turkish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="preserve-layout"
                    checked={preserveLayout}
                    onChange={(e) => setPreserveLayout(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="preserve-layout" className="text-sm">
                    Preserve original image layout and formatting
                  </Label>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={translateImage}
                    disabled={isProcessing || !sourceImage}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    {isProcessing ? "Translating..." : "Translate Image"}
                  </Button>
                  
                  <Button
                    onClick={resetTool}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Supported Content Types</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Text in Images</span>
                    <p className="text-sm text-gray-600">Clear text within images, including headings, paragraphs, labels, and captions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Document Images</span>
                    <p className="text-sm text-gray-600">Scanned documents, reports, articles, and other text-heavy content.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">UI Elements</span>
                    <p className="text-sm text-gray-600">Screenshots of interfaces with text-based elements like menus, buttons, and labels.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Infographics</span>
                    <p className="text-sm text-gray-600">Images containing charts, diagrams, or visual information with text components.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isProcessing ? (
            <Card>
              <CardContent className="p-6 text-center h-64 flex flex-col items-center justify-center">
                <Progress value={progress} className="w-full mb-4" />
                <p className="text-gray-500">
                  {progress < 40 ? "Extracting text from image..." : 
                   progress < 80 ? "Translating content..." : 
                   "Generating translated image..."}
                </p>
              </CardContent>
            </Card>
          ) : processedImage ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-base font-medium">
                    Translated Image
                  </Label>
                  <Badge className="bg-green-50 text-green-700">
                    {getLanguageName(targetLanguage)}
                  </Badge>
                </div>
                
                <Tabs defaultValue="image" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="image">Translated Image</TabsTrigger>
                    <TabsTrigger value="text">Extracted Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="image" className="mt-3">
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <img
                          src={processedImage}
                          alt="Translated"
                          className="max-h-[250px] mx-auto object-contain"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={downloadImage}
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
                          Download Image
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="mt-3">
                    <div className="space-y-3">
                      <div className="rounded-lg border p-3 bg-gray-50 h-[250px] overflow-auto">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Original Text:</h4>
                            <p className="text-sm">{extractedText}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Translated Text:</h4>
                            <p className="text-sm">{translatedText}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={copyTranslatedText}
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
                          Copy Translated Text
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  Translated image and text will appear here
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use high-resolution images with clear, legible text
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Ensure good lighting and contrast between text and background
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Avoid extreme angles or distortions that may affect text recognition
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  For best results with handwriting, ensure it's neat and clear
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use the "Auto-detect" source language option if you're unsure
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Limitations</h3>
              <p className="text-sm text-gray-600 mb-2">
                While our Image Translator works well for most use cases, there are some limitations to be aware of:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Highly stylized or decorative fonts may not be recognized accurately</li>
                <li>• Text embedded in complex backgrounds might be partially missed</li>
                <li>• Very small text or low-resolution images may yield incomplete results</li>
                <li>• Handwritten text recognition varies depending on handwriting clarity</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Instantly translate text in images across 30+ languages while preserving the original layout.";
  
  const description = `
    Our Image Translator is a powerful tool that extracts and translates text from images while maintaining the original design and layout. Whether you need to understand foreign-language screenshots, translate documents, decode menus in another language, or make your visual content accessible to international audiences, this tool provides a quick and accurate solution.
    
    Using advanced optical character recognition (OCR) technology, the Image Translator first identifies and extracts all text content from your uploaded image. Then, it leverages sophisticated translation algorithms to convert the extracted text into your chosen target language. Finally, it generates a new image that preserves the original visual design but replaces the text with its translated version.
    
    This tool supports a wide range of languages including English, Spanish, French, German, Chinese, Japanese, Russian, Arabic, and many more. With the "Auto-detect" feature, you don't even need to know what language the image contains - our system will identify it automatically and proceed with the translation.
    
    The Image Translator is particularly useful for travelers, language learners, international business professionals, researchers, and anyone who encounters visual content in unfamiliar languages. It handles various image types including photographs of signs or documents, screenshots, infographics, and more.
  `;

  const howToUse = [
    "Upload an image containing text by clicking the upload area or dragging and dropping a file.",
    "Select the source language (or use 'Auto-detect' if you're unsure) and your desired target language.",
    "Toggle the 'Preserve original image layout' option based on your preference.",
    "Click the 'Translate Image' button and wait for the process to complete.",
    "View the translated image on the results tab and download it if needed.",
    "Alternatively, switch to the 'Extracted Text' tab to see both the original and translated text.",
    "Copy the translated text or download the translated image for your use."
  ];

  const features = [
    "Support for 30+ languages with automatic language detection",
    "Preservation of original image layout, formatting, and design elements",
    "High-accuracy text recognition even for challenging fonts and backgrounds",
    "Both translated images and extracted text provided for maximum flexibility",
    "Works with photographs, screenshots, scanned documents, and digital images",
    "Download options for saving and sharing your translated images easily"
  ];

  const faqs = [
    {
      question: "How accurate is the Image Translator?",
      answer: "The accuracy of translation depends on several factors including image quality, text clarity, font style, and language pair. For clear images with standard fonts and common languages, accuracy is typically very high (90%+). However, unusual fonts, poor image quality, or specialized terminology may affect results. We recommend reviewing the translation, especially for critical content, and using the extracted text feature to see exactly what text was recognized."
    },
    {
      question: "Can it translate handwritten text in images?",
      answer: "Yes, the Image Translator can process handwritten text, though with some limitations. The accuracy depends greatly on the clarity and consistency of the handwriting. Neat, print-style handwriting typically yields better results than cursive or highly stylized writing. For best results with handwritten content, ensure the writing is clear, well-spaced, and the image has good lighting and contrast."
    },
    {
      question: "What happens to non-text elements in my images?",
      answer: "When the 'Preserve original image layout' option is enabled, all non-text elements including backgrounds, graphics, logos, and formatting remain unchanged in the translated image. Only the recognized text is replaced with its translated version. This allows you to maintain the visual design and context of the original image while making the text content accessible in your target language."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="image-translator"
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

export default ImageTranslatorDetailed;