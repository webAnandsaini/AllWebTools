import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { designStudioTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaDownload, FaShareAlt, FaPalette, FaFont, FaLayerGroup } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BusinessCardMakerDetailed = () => {
  // Form state
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Marketing Director");
  const [company, setCompany] = useState("Acme Corporation");
  const [email, setEmail] = useState("john.doe@acmecorp.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [website, setWebsite] = useState("www.acmecorp.com");
  const [address, setAddress] = useState("123 Business Ave., Suite 200, New York, NY 10001");
  
  // Design state
  const [template, setTemplate] = useState("modern");
  const [color, setColor] = useState("blue");
  const [orientation, setOrientation] = useState("horizontal");

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your business card design is being prepared for download.",
    });
    // In a real app, this would generate a PDF or image file
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share options would open in a real application.",
    });
    // In a real app, this would open sharing options
  };

  const introduction = "Create professional business cards that make a lasting impression in minutes.";

  const description = "Our Business Card Maker is a powerful yet easy-to-use design tool that helps professionals, entrepreneurs, and businesses create stunning, customized business cards without any design experience. Choose from dozens of professionally designed templates and customize every element to match your brand identity. Add your logo, adjust colors and fonts, and input your contact information to create business cards that effectively represent you and your business. This tool offers both standard and creative design options, from minimal and elegant layouts to bold and unique styles that stand out. Once your design is complete, download high-resolution files ready for professional printing or digital sharing. Whether you're establishing a new business, rebranding, or simply need to update your contact information, our Business Card Maker streamlines the process of creating professional-quality business cards that make a lasting impression.";

  const howToUse = [
    "Select a business card template that matches your professional style.",
    "Enter your personal and business information including name, title, and contact details.",
    "Customize colors, fonts, and layout to align with your brand identity.",
    "Add your logo or other visual elements to personalize your design.",
    "Preview your business card from different angles to ensure everything looks perfect.",
    "Download your design as a high-resolution PDF or image file for printing."
  ];

  const features = [
    "✅ Dozens of professional business card templates for various industries",
    "✅ Customizable colors, fonts, and layout options",
    "✅ Support for both standard and creative card designs",
    "✅ Logo upload and placement customization",
    "✅ High-resolution downloads in print-ready formats",
    "✅ Both horizontal and vertical orientation options"
  ];

  const faqs = [
    {
      question: "What size are the business card designs?",
      answer: "Our business card designs follow the standard size of 3.5 x 2 inches (88.9 x 50.8 mm), which is the most common business card size used worldwide. This ensures compatibility with most printing services."
    },
    {
      question: "Where can I get my business cards printed?",
      answer: "You can download your design and have it printed at any local print shop or online printing service. Our designs include bleed areas and are exported at 300 DPI to ensure professional print quality."
    },
    {
      question: "Can I include a QR code on my business card?",
      answer: "Yes! In the full version of our tool, you can add a QR code that links to your website, social media profile, or digital contact card. This is a modern feature that makes it easy for people to save your contact information or visit your online presence."
    }
  ];

  // Simulated preview of different templates
  const renderPreview = () => {
    const templateStyles = {
      modern: "bg-white border border-gray-200",
      classic: "bg-slate-50 border border-slate-200",
      creative: "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200",
      minimal: "bg-gray-50 border border-gray-200",
    };

    const colorAccents = {
      blue: "text-blue-700 border-blue-700",
      red: "text-red-700 border-red-700",
      green: "text-green-700 border-green-700",
      purple: "text-purple-700 border-purple-700",
      black: "text-gray-900 border-gray-900",
    };
    
    const selectedStyle = templateStyles[template as keyof typeof templateStyles] || templateStyles.modern;
    const selectedColor = colorAccents[color as keyof typeof colorAccents] || colorAccents.blue;
    
    // Horizontal or vertical layout
    const isHorizontal = orientation === "horizontal";
    const cardClass = isHorizontal 
      ? "w-64 h-36 p-4" 
      : "w-36 h-64 p-4";
    
    const contentLayout = isHorizontal
      ? "flex-col justify-between"
      : "flex-col justify-between h-full";

    return (
      <div className={`${cardClass} ${selectedStyle} rounded-md shadow-md flex ${contentLayout}`}>
        <div>
          <h3 className={`font-bold text-lg ${selectedColor}`}>{name}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xs font-semibold mt-1">{company}</p>
        </div>
        
        <div className={`border-t ${selectedColor} mt-2 pt-2`}>
          <div className="text-xs space-y-1">
            <p>{phone}</p>
            <p className="text-xs">{email}</p>
            <p className="text-xs">{website}</p>
            <p className="text-xs text-gray-500">{address}</p>
          </div>
        </div>
      </div>
    );
  };

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Business Card Designer</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="title" className="font-medium">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Marketing Director"
              />
            </div>
            
            <div>
              <Label htmlFor="company" className="font-medium">Company Name</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corporation"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. (555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="font-medium">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@company.com"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="website" className="font-medium">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. www.company.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="font-medium">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Business Ave, Suite 200"
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">
                  <FaPalette className="mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <FaLayerGroup className="mr-2" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="font">
                  <FaFont className="mr-2" />
                  Typography
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="design" className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="template" className="font-medium">Template Style</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select template style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="color" className="font-medium">Primary Color</Label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select primary color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="pt-4">
                <div>
                  <Label htmlFor="orientation" className="font-medium">Card Orientation</Label>
                  <Select value={orientation} onValueChange={setOrientation}>
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal (Landscape)</SelectItem>
                      <SelectItem value="vertical">Vertical (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Layout options such as logo placement and alignment would be available here in the full version.
                </p>
              </TabsContent>
              
              <TabsContent value="font" className="pt-4">
                <p className="text-sm text-gray-500">
                  Font and typography options would be available here in the full version.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
            {renderPreview()}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
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
      toolSlug="business-card-maker-detailed"
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

export default BusinessCardMakerDetailed;