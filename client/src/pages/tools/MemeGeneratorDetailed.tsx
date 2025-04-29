import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { designStudioTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaDownload, FaShareAlt, FaImage, FaFont, FaPlus } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MemeGeneratorDetailed = () => {
  const [topText, setTopText] = useState("WHEN YOU FINALLY");
  const [bottomText, setBottomText] = useState("FINISH CODING A PROJECT");
  const [fontSize, setFontSize] = useState(36);
  const [template, setTemplate] = useState("success-kid");
  const [textColor, setTextColor] = useState("white");
  const [textOutline, setTextOutline] = useState("black");

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your meme is being prepared for download.",
    });
    // In a real app, this would generate an image file
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share options would open in a real application.",
    });
    // In a real app, this would open sharing options
  };

  const introduction = "Create hilarious, shareable memes in seconds with our easy-to-use meme generator.";

  const description = "Our Meme Generator is a fun, intuitive tool that lets you create custom memes in seconds without any design skills. Choose from a vast library of popular meme templates or upload your own images, add witty captions, customize text styles, and generate high-quality memes ready to share on social media. This tool provides all the flexibility you need to create both classic memes and unique content that reflects your personal humor. Whether you're looking to make your friends laugh, engage with your social media audience, or simply express yourself through humor, our Meme Generator offers a user-friendly interface that makes meme creation accessible to everyone. Create unlimited memes, download them in high resolution, or share them directly to your favorite platforms with just a few clicks.";

  const howToUse = [
    "Choose a popular meme template from our extensive library or upload your own image.",
    "Add your top and bottom text captions to create your meme's message.",
    "Customize text size, color, and outline to make your text stand out.",
    "Preview your meme to ensure it looks exactly how you want it.",
    "Download your meme as a high-quality image or share it directly to social media."
  ];

  const features = [
    "✅ Extensive library of popular and trending meme templates",
    "✅ Custom text positioning, sizing, and styling options",
    "✅ Ability to upload your own images for unique memes",
    "✅ High-resolution downloads for sharp-looking memes",
    "✅ One-click social media sharing",
    "✅ No watermarks on any generated memes"
  ];

  const faqs = [
    {
      question: "Can I use my own images to create memes?",
      answer: "Yes! While we offer a large library of popular meme templates, you can also upload your own images to create completely unique memes. This is perfect for creating personalized content featuring friends, pets, or specific situations."
    },
    {
      question: "Are the memes I create watermarked?",
      answer: "No, all memes created with our generator are completely watermark-free. You get clean, high-quality images that you can share anywhere without any branding or attribution required."
    },
    {
      question: "Can I edit a meme after I've created it?",
      answer: "Yes, you can edit your memes at any time before downloading or sharing. If you want to make changes to a previously downloaded meme, simply recreate it with your new text or styling preferences."
    }
  ];

  // Simulated preview of different meme templates
  const renderPreview = () => {
    const templates = {
      "success-kid": "🧒",
      "distracted-boyfriend": "👨👩👩",
      "drake": "👨‍🎤",
      "expanding-brain": "🧠",
      "woman-yelling": "👩‍👩",
      "doge": "🐕",
    };

    const selectedTemplate = templates[template as keyof typeof templates] || templates["success-kid"];
    
    return (
      <div className="relative bg-gray-900 w-full h-full min-h-[300px] rounded-md flex flex-col items-center justify-between p-4">
        <div 
          className="text-center py-2 px-4 w-full font-bold"
          style={{ 
            fontSize: `${fontSize}px`,
            color: textColor,
            textShadow: `2px 2px 0 ${textOutline}, -2px -2px 0 ${textOutline}, 2px -2px 0 ${textOutline}, -2px 2px 0 ${textOutline}`,
            WebkitTextStroke: `1px ${textOutline}`
          }}
        >
          {topText.toUpperCase()}
        </div>
        
        <div className="text-7xl my-4">
          {selectedTemplate}
        </div>
        
        <div 
          className="text-center py-2 px-4 w-full font-bold"
          style={{ 
            fontSize: `${fontSize}px`,
            color: textColor,
            textShadow: `2px 2px 0 ${textOutline}, -2px -2px 0 ${textOutline}, 2px -2px 0 ${textOutline}, -2px 2px 0 ${textOutline}`,
            WebkitTextStroke: `1px ${textOutline}`
          }}
        >
          {bottomText.toUpperCase()}
        </div>
        
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Demo Mode: Image placeholder
        </div>
      </div>
    );
  };

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Meme Generator</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <Label htmlFor="template" className="font-medium">Meme Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select meme template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success-kid">Success Kid</SelectItem>
                <SelectItem value="distracted-boyfriend">Distracted Boyfriend</SelectItem>
                <SelectItem value="drake">Drake Hotline Bling</SelectItem>
                <SelectItem value="expanding-brain">Expanding Brain</SelectItem>
                <SelectItem value="woman-yelling">Woman Yelling at Cat</SelectItem>
                <SelectItem value="doge">Doge</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-3 flex items-center">
              <Button variant="outline" size="sm" className="w-full">
                <FaImage className="mr-2" /> Upload Your Own Image
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="top-text" className="font-medium">Top Text</Label>
              <Input
                id="top-text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Enter top text"
              />
            </div>
            
            <div>
              <Label htmlFor="bottom-text" className="font-medium">Bottom Text</Label>
              <Input
                id="bottom-text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Enter bottom text"
              />
            </div>
          </div>
          
          <div className="space-y-5 pt-2">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                <span className="text-sm text-gray-500">{fontSize}px</span>
              </div>
              <Slider
                id="font-size"
                min={20}
                max={60}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="text-color" className="font-medium">Text Color</Label>
                <Select value={textColor} onValueChange={setTextColor}>
                  <SelectTrigger id="text-color">
                    <SelectValue placeholder="Select text color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="text-outline" className="font-medium">Text Outline</Label>
                <Select value={textOutline} onValueChange={setTextOutline}>
                  <SelectTrigger id="text-outline">
                    <SelectValue placeholder="Select outline color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="font-medium">Advanced Options</Label>
              <p className="text-sm text-gray-500 mt-1 mb-2">
                Additional options available in the full version.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <FaPlus className="mr-2" /> Add Text Box
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
            {renderPreview()}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
              onClick={handleDownload}
            >
              <FaDownload className="mr-2" /> Download
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleShare}
            >
              <FaShareAlt className="mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="meme-generator-detailed"
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

export default MemeGeneratorDetailed;