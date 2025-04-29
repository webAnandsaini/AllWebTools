import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { designStudioTools } from "@/data/tools";

const PosterMakerDetailed = () => {
  const [dimensions, setDimensions] = useState<string>("11x17");
  const [posterTitle, setPosterTitle] = useState<string>("");
  const [posterDescription, setPosterDescription] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("event");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePoster = () => {
    if (!posterTitle.trim()) {
      alert("Please enter a poster title");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate poster generation
    setTimeout(() => {
      setIsGenerating(false);
      alert("Your poster has been generated! You can now download or edit it further.");
    }, 2000);
  };

  // Filter only the design tools from all tools
  const relatedTools = designStudioTools.filter(tool => 
    tool.slug !== "poster-maker-detailed" && 
    ["logo-maker-detailed", "resume-builder-detailed", "flyer-maker-detailed"].includes(tool.slug)
  );

  return (
    <ToolPageTemplate
      toolSlug="poster-maker-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Create stunning professional posters in minutes with our easy-to-use Poster Maker."
          
          description="Our Poster Maker is a powerful, intuitive design tool that lets you create high-quality posters for any occasion. Whether you need eye-catching promotional materials for your business, informative educational displays, or attention-grabbing event announcements, our tool provides everything you need to design professional posters quickly and easily. No design experience is necessary - our user-friendly interface and extensive library of templates, graphics, and fonts make poster creation accessible to everyone. Choose from various dimensions, customize with your brand colors, add compelling text, and insert high-quality images to create posters that get noticed. Perfect for businesses, educators, event planners, and anyone who needs to create professional-looking posters without the complexity of traditional design software or the expense of hiring a graphic designer."
          
          howToUse={[
            "Select your preferred poster dimensions and template from our extensive collection.",
            "Customize the template with your own text, images, and branding elements.",
            "Adjust colors, fonts, and layout to match your vision and requirements.",
            "Preview your poster to ensure it looks perfect from every angle.",
            "Download your finished poster in high-resolution format ready for printing or digital use."
          ]}
          
          features={[
            "✅ Diverse collection of professional poster templates for events, promotions, education, and more",
            "✅ Customizable dimensions to fit standard poster sizes including 11×17, 18×24, 24×36 inches and custom sizes",
            "✅ Rich library of high-quality images, icons, and graphics to enhance your designs",
            "✅ Text customization with hundreds of fonts, sizing options, and text effects",
            "✅ Easy drag-and-drop interface requiring no graphic design experience",
            "✅ High-resolution downloads ready for professional printing or digital distribution",
            "✅ Save your designs to edit later or create variations for different campaigns"
          ]}
          
          faqs={[
            {
              question: "What file formats can I download my poster in?",
              answer: "You can download your completed poster in several high-quality formats including PDF (ideal for printing), PNG (with transparent background if needed), and JPG (for web usage or digital displays). All formats are available in high resolution to ensure your poster looks crisp and professional when printed."
            },
            {
              question: "Do I need design experience to create a poster?",
              answer: "Absolutely not! Our Poster Maker is designed to be user-friendly for everyone, regardless of design experience. The intuitive interface, pre-designed templates, and drag-and-drop functionality make it easy to create professional-looking posters without any specialized skills."
            },
            {
              question: "Can I create custom-sized posters for special requirements?",
              answer: "Yes, while we offer standard poster sizes like 11×17, 18×24, and 24×36 inches, our tool also allows you to set custom dimensions to meet specific requirements. This makes it perfect for unusual display spaces or special printing needs."
            },
            {
              question: "How do I ensure my poster will print correctly?",
              answer: "Our Poster Maker includes a print preview feature that shows exactly how your poster will look when printed. We also provide guidelines for bleed areas and safe zones to ensure critical elements aren't cut off. Additionally, all downloads include high-resolution files optimized for professional printing."
            },
            {
              question: "Can I save my poster design and edit it later?",
              answer: "Yes, you can save your poster designs to your account and return to edit them at any time. This is particularly useful if you need to make seasonal updates to promotional posters or create variations of the same basic design for different events or campaigns."
            }
          ]}
          
          toolInterface={
            <Card className="p-6 border-2 border-primary/10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Create Your Poster</h3>
                  <p className="text-gray-600 mb-6">Design a professional poster in minutes with our easy-to-use tool.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template">Choose a Template</Label>
                      <Select 
                        value={selectedTemplate} 
                        onValueChange={setSelectedTemplate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event Poster</SelectItem>
                          <SelectItem value="business">Business Promotion</SelectItem>
                          <SelectItem value="education">Educational/Academic</SelectItem>
                          <SelectItem value="movie">Movie/Entertainment</SelectItem>
                          <SelectItem value="sale">Sale/Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dimensions">Poster Dimensions</Label>
                      <Select 
                        value={dimensions} 
                        onValueChange={setDimensions}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11x17">11×17 inches (Tabloid)</SelectItem>
                          <SelectItem value="18x24">18×24 inches (Small Poster)</SelectItem>
                          <SelectItem value="24x36">24×36 inches (Large Poster)</SelectItem>
                          <SelectItem value="custom">Custom Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Poster Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter your attention-grabbing title" 
                        value={posterTitle}
                        onChange={(e) => setPosterTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description/Details</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter event details, promotional information, etc."
                        rows={4}
                        value={posterDescription}
                        onChange={(e) => setPosterDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] border border-dashed border-gray-300">
                    {selectedTemplate && (
                      <div className="text-center">
                        <div className="w-full h-48 bg-gradient-to-r from-primary/5 to-primary/20 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-primary font-semibold">
                            {posterTitle ? posterTitle : "Your Poster Preview"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {selectedTemplate === "event" && "Event Poster Template"}
                          {selectedTemplate === "business" && "Business Promotion Template"}
                          {selectedTemplate === "education" && "Educational Poster Template"}
                          {selectedTemplate === "movie" && "Movie/Entertainment Poster Template"}
                          {selectedTemplate === "sale" && "Sale/Discount Poster Template"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={generatePoster}
                    disabled={isGenerating}
                    className="w-full md:w-auto"
                  >
                    {isGenerating ? "Generating Poster..." : "Generate Your Poster"}
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>Your design will be available to download in PDF, PNG, and JPG formats</p>
                </div>
              </div>
            </Card>
          }
        />
      }
    />
  );
};

export default PosterMakerDetailed;