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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type ImageStyle = "photorealistic" | "cartoon" | "painting" | "sketch" | "3d";
type ImageAspectRatio = "1:1" | "16:9" | "4:3" | "3:2" | "9:16";

const TextToImageDetailed = () => {
  const [prompt, setPrompt] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photorealistic");
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>("1:1");
  const [detailLevel, setDetailLevel] = useState(50);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const generateImage = () => {
    if (prompt.trim().length < 10) {
      toast({
        title: "Prompt too short",
        description: "Please enter a more detailed description (at least 10 characters)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Simulate image generation (in a real app, this would call an API)
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);

      // For demo, we'll use a placeholder image based on style
      let placeholderUrl = "";
      switch (imageStyle) {
        case "photorealistic":
          placeholderUrl = "https://source.unsplash.com/random/800x800/?nature";
          break;
        case "cartoon":
          placeholderUrl = "https://source.unsplash.com/random/800x800/?cartoon";
          break;
        case "painting":
          placeholderUrl = "https://source.unsplash.com/random/800x800/?painting";
          break;
        case "sketch":
          placeholderUrl = "https://source.unsplash.com/random/800x800/?sketch";
          break;
        case "3d":
          placeholderUrl = "https://source.unsplash.com/random/800x800/?3d,rendering";
          break;
        default:
          placeholderUrl = "https://source.unsplash.com/random/800x800";
      }

      setGeneratedImageUrl(placeholderUrl);
      setGenerationHistory((prev) => [placeholderUrl, ...prev].slice(0, 5));
      setIsGenerating(false);

      toast({
        title: "Image generated",
        description: "Your image has been generated successfully!",
      });
    }, 3000);
  };

  const resetForm = () => {
    setPrompt("");
    setImageStyle("photorealistic");
    setAspectRatio("1:1");
    setDetailLevel(50);
    setNegativePrompt("");
    setIsAdvancedMode(false);
    setGeneratedImageUrl("");
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;

    // Create an anchor element and trigger download
    const a = document.createElement("a");
    a.href = generatedImageUrl;
    a.download = `text-to-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard",
    });
  };

  const handleImageSelect = (url: string) => {
    setGeneratedImageUrl(url);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger 
                    value="advanced"
                    onClick={() => setIsAdvancedMode(true)}
                  >
                    Advanced
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt" className="text-base font-medium">Describe your image</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe the image you want to create in detail (e.g., 'A majestic mountain landscape with a blue lake, pine trees, and snow-capped peaks under a sunset sky')"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-32 mt-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="style" className="text-base font-medium">Image Style</Label>
                        <Select 
                          value={imageStyle} 
                          onValueChange={(value) => setImageStyle(value as ImageStyle)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photorealistic">Photorealistic</SelectItem>
                            <SelectItem value="cartoon">Cartoon</SelectItem>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="sketch">Sketch</SelectItem>
                            <SelectItem value="3d">3D Render</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="ratio" className="text-base font-medium">Aspect Ratio</Label>
                        <Select 
                          value={aspectRatio} 
                          onValueChange={(value) => setAspectRatio(value as ImageAspectRatio)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select ratio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1:1">Square (1:1)</SelectItem>
                            <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                            <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                            <SelectItem value="3:2">Landscape (3:2)</SelectItem>
                            <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="detail" className="text-base font-medium">Detail Level</Label>
                        <span className="text-sm text-gray-500">{detailLevel}%</span>
                      </div>
                      <Slider
                        id="detail"
                        value={[detailLevel]}
                        min={20}
                        max={100}
                        step={5}
                        onValueChange={(value) => setDetailLevel(value[0])}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Simple</span>
                        <span>Detailed</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt-adv" className="text-base font-medium">Prompt</Label>
                      <Textarea
                        id="prompt-adv"
                        placeholder="Detailed prompt with specific elements, lighting, mood, etc."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-24 mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="negative-prompt" className="text-base font-medium">Negative Prompt</Label>
                      <Textarea
                        id="negative-prompt"
                        placeholder="Elements to exclude (e.g., 'blurry, low quality, distorted faces')"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="h-16 mt-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="style-adv" className="text-base font-medium">Style</Label>
                        <Select 
                          value={imageStyle} 
                          onValueChange={(value) => setImageStyle(value as ImageStyle)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photorealistic">Photorealistic</SelectItem>
                            <SelectItem value="cartoon">Cartoon</SelectItem>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="sketch">Sketch</SelectItem>
                            <SelectItem value="3d">3D Render</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="ratio-adv" className="text-base font-medium">Aspect Ratio</Label>
                        <Select 
                          value={aspectRatio} 
                          onValueChange={(value) => setAspectRatio(value as ImageAspectRatio)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select ratio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1:1">Square (1:1)</SelectItem>
                            <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                            <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                            <SelectItem value="3:2">Landscape (3:2)</SelectItem>
                            <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="detail-adv" className="text-base font-medium">Detail Level</Label>
                        <span className="text-sm text-gray-500">{detailLevel}%</span>
                      </div>
                      <Slider
                        id="detail-adv"
                        value={[detailLevel]}
                        min={20}
                        max={100}
                        step={5}
                        onValueChange={(value) => setDetailLevel(value[0])}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="enhance" />
                      <label
                        htmlFor="enhance"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use AI enhancement (improves details and quality)
                      </label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  onClick={generateImage}
                  disabled={isGenerating || prompt.length < 10}
                  className="bg-primary hover:bg-blue-700 transition"
                >
                  <i className="fas fa-magic mr-2"></i>
                  <span>{isGenerating ? "Generating..." : "Generate Image"}</span>
                </Button>
                
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-gray-300"
                >
                  <i className="fas fa-redo mr-2"></i>
                  <span>Reset</span>
                </Button>
                
                {prompt.length > 0 && (
                  <Button
                    onClick={copyPrompt}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    <span>Copy Prompt</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {generationHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Generation History</h3>
                <div className="grid grid-cols-3 gap-2">
                  {generationHistory.map((url, index) => (
                    <div 
                      key={index}
                      className={`
                        relative cursor-pointer rounded-lg overflow-hidden border-2
                        ${generatedImageUrl === url ? 'border-primary' : 'border-transparent'}
                      `}
                      onClick={() => handleImageSelect(url)}
                    >
                      <img 
                        src={url} 
                        alt={`Generated image ${index + 1}`} 
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Image Preview</h3>
                {generatedImageUrl && (
                  <Button
                    onClick={downloadImage}
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary"
                  >
                    <i className="fas fa-download mr-2"></i>
                    <span>Download</span>
                  </Button>
                )}
              </div>
              
              {isGenerating ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Generating your image...</p>
                  <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                </div>
              ) : generatedImageUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      ref={imageRef}
                      src={generatedImageUrl}
                      alt="Generated image"
                      className="max-w-full h-auto"
                    />
                  </div>
                  
                  <div className="w-full text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Image prompt:</p>
                    <p>{prompt}</p>
                    {negativePrompt && (
                      <>
                        <p className="font-medium mt-2 mb-1">Negative prompt:</p>
                        <p>{negativePrompt}</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 mb-4 text-gray-300">
                    <i className="fas fa-image text-6xl"></i>
                  </div>
                  <p className="text-gray-500">Your generated image will appear here</p>
                  <p className="text-gray-400 text-sm mt-2">Enter a detailed prompt and click "Generate Image"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-lightbulb text-blue-600"></i>
              </div>
              <h3 className="font-medium">Prompt Tips</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use detailed, descriptive language with specific references to style, lighting, mood, and composition for the best results.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-sliders-h text-purple-600"></i>
              </div>
              <h3 className="font-medium">Customize</h3>
            </div>
            <p className="text-sm text-gray-600">
              Experiment with different styles, aspect ratios, and detail levels to achieve the perfect image for your needs.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-ban text-green-600"></i>
              </div>
              <h3 className="font-medium">Negative Prompts</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use negative prompts in advanced mode to specify elements you want to exclude from your generated image.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform your text descriptions into stunning visual imagery with our AI-powered Text to Image generator.",
    description: "Our Text to Image tool harnesses the power of advanced AI to convert textual descriptions into high-quality, detailed images. By analyzing your written prompts, our system generates visual representations that closely match your descriptions, making it ideal for creators, marketers, designers, and anyone seeking to bring their ideas to life without artistic expertise. The tool offers a wide range of customization options including different artistic styles (photorealistic, cartoon, painting, sketch, and 3D renders), aspect ratios to suit various media formats, and detail level adjustments to fine-tune the complexity of your generated images. Additionally, the advanced mode provides negative prompting capabilities to exclude unwanted elements and further refine your results. Whether you're creating concept art for a project, generating custom illustrations for content, visualizing design ideas, or simply expressing your creativity, our Text to Image converter transforms your words into compelling visuals with just a few clicks.",
    howToUse: [
      "Enter a detailed description of the image you want to create in the prompt field. Be specific about elements, style, colors, and composition for best results.",
      "Select your preferred image style from options like Photorealistic, Cartoon, Painting, Sketch, or 3D Render.",
      "Choose the appropriate aspect ratio for your needs (Square, Landscape, or Portrait).",
      "Adjust the detail level slider to set how intricate you want your image to be.",
      "For more control, switch to the Advanced tab to add negative prompts (elements to exclude) and access additional settings.",
      "Click 'Generate Image' and wait for the AI to create your visual based on the provided description.",
      "Once generated, you can download your image, copy the prompt for future use, or make adjustments and generate a new version."
    ],
    features: [
      "AI-powered text-to-image conversion with multiple artistic style options",
      "Customizable aspect ratios to match your specific needs (1:1, 16:9, 4:3, 3:2, 9:16)",
      "Detail level adjustment to control the complexity of generated images",
      "Advanced mode with negative prompting to exclude unwanted elements",
      "One-click downloads of generated images in high quality",
      "Generation history to revisit and reuse your previous creations",
      "User-friendly interface with real-time preview and progress tracking"
    ],
    faqs: [
      {
        question: "How detailed should my prompts be for the best results?",
        answer: "For optimal results, your prompts should be detailed and specific. Instead of simply writing 'a beach scene,' try 'a tranquil tropical beach at sunset with palm trees, gentle waves lapping at golden sand, and a clear orange sky with wispy clouds.' Include information about style, mood, lighting, colors, composition, and specific elements you want to see. The more detailed your description, the better the AI can match your vision. However, avoid making prompts excessively long or contradictory, as this may confuse the AI."
      },
      {
        question: "What is a negative prompt and how does it improve my images?",
        answer: "A negative prompt specifies elements you want to exclude from your generated image. This feature helps refine results by telling the AI what NOT to include. For example, if you're generating a landscape and don't want any people or buildings, you might add 'people, buildings, structures' as a negative prompt. This is particularly useful for eliminating common AI generation artifacts like distorted faces, extra limbs, or poor text rendering. Negative prompts work as a filtering mechanism that improves image quality by reducing unwanted elements, allowing you to create more precisely targeted visuals."
      },
      {
        question: "Can I use the generated images for commercial purposes?",
        answer: "The usage rights for generated images depend on several factors including the AI model used, the source data it was trained on, and the licensing terms of our service. While many AI-generated images can be used for commercial purposes, there are important considerations: 1) Some AI models may incorporate copyrighted material in their training data, potentially affecting the copyright status of outputs. 2) If your prompt specifically references copyrighted characters, brands, or designs, the resulting images may infringe on intellectual property rights. 3) Different regions have varying laws regarding AI-generated content. For commercial usage, we recommend consulting our specific terms of service and potentially seeking legal advice for your particular use case."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="text-to-image"
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

export default TextToImageDetailed;