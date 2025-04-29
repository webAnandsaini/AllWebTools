import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { designStudioTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaDownload, FaShareAlt, FaPalette, FaFont, FaImage } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvitationMakerDetailed = () => {
  const [eventTitle, setEventTitle] = useState("Birthday Celebration");
  const [eventDate, setEventDate] = useState("June 15, 2025");
  const [eventTime, setEventTime] = useState("7:00 PM - 10:00 PM");
  const [eventLocation, setEventLocation] = useState("Crystal Garden Venue, 123 Party Lane");
  const [hostName, setHostName] = useState("John & Jane Smith");
  const [message, setMessage] = useState("Please join us for a wonderful evening of celebration.");
  const [rsvpInfo, setRsvpInfo] = useState("RSVP by June 1st: (555) 123-4567");
  const [theme, setTheme] = useState("birthday");
  const [template, setTemplate] = useState("elegant");
  const [color, setColor] = useState("blue");

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your invitation design is being prepared for download.",
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

  const introduction = "Create beautiful, personalized invitations for any occasion with just a few clicks.";

  const description = "Our Invitation Maker is a versatile design tool that helps you create stunning, custom invitations for any event or special occasion. Whether you're planning a wedding, birthday party, baby shower, corporate event, or casual get-together, this tool provides everything you need to design professional-quality invitations that perfectly match your event's theme and style. Choose from a wide range of customizable templates, add your own text, select color schemes, and incorporate decorative elements to create invitations that will impress your guests. The intuitive interface makes it easy for anyone, regardless of design experience, to create beautiful invitations in minutes. You can instantly download your designs as high-resolution files ready for printing or digital sharing, saving you time and money compared to traditional custom invitation services.";

  const howToUse = [
    "Select an event type and template style from our extensive library of designs.",
    "Customize the text with your event details, including title, date, time, location, and RSVP information.",
    "Choose colors, fonts, and decorative elements that match your event theme.",
    "Preview your design to ensure everything looks perfect before finalizing.",
    "Download your invitation as a high-quality image or PDF file for printing or digital sharing."
  ];

  const features = [
    "✅ Hundreds of professionally designed templates for all types of events",
    "✅ Customizable color schemes, fonts, and decorative elements",
    "✅ Easy text editing for all invitation details",
    "✅ High-resolution downloads in multiple formats (JPG, PNG, PDF)",
    "✅ Digital sharing options for email and social media",
    "✅ Real-time preview to visualize your design changes instantly"
  ];

  const faqs = [
    {
      question: "Can I print my invitations at home?",
      answer: "Yes, all invitation designs can be downloaded as high-resolution files suitable for home printing. For best results, use quality cardstock paper and check your printer settings for the highest print quality."
    },
    {
      question: "How do I share my invitation digitally?",
      answer: "After creating your invitation, you can download it as an image file and attach it to emails, text messages, or social media posts. You can also use the 'Share' button to directly share your design through various platforms."
    },
    {
      question: "Can I save my design and edit it later?",
      answer: "Yes, our tool allows you to save your designs to your account and return to edit them anytime. This is especially useful if you need to make last-minute changes to event details or want to create variations of the same invitation."
    }
  ];

  // Simulated preview of different templates
  const renderPreview = () => {
    const templateStyles = {
      elegant: "bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200",
      modern: "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200",
      casual: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200",
      festive: "bg-gradient-to-br from-orange-50 to-red-50 border border-red-200",
    };

    const themeIcons = {
      birthday: "🎂",
      wedding: "💍",
      babyShower: "👶",
      graduation: "🎓",
      corporate: "🏢",
      holiday: "🎄",
    };

    const selectedStyle = templateStyles[template as keyof typeof templateStyles] || templateStyles.elegant;
    const selectedIcon = themeIcons[theme as keyof typeof themeIcons] || themeIcons.birthday;
    
    const colorAccents = {
      blue: "text-blue-700",
      purple: "text-purple-700",
      green: "text-green-700",
      red: "text-red-700",
      gold: "text-amber-700",
    };
    
    const selectedColor = colorAccents[color as keyof typeof colorAccents] || colorAccents.blue;

    return (
      <div className={`p-8 rounded-lg shadow-md flex flex-col items-center ${selectedStyle}`}>
        <div className="text-4xl mb-4">{selectedIcon}</div>
        <h3 className={`text-xl font-script mb-2 ${selectedColor}`}>{eventTitle}</h3>
        <div className="w-16 h-0.5 bg-gray-300 my-2"></div>
        <p className="text-sm mb-4">{message}</p>
        <div className="text-center mb-4">
          <p className="font-medium mb-1">Date & Time</p>
          <p className="text-sm">{eventDate}</p>
          <p className="text-sm">{eventTime}</p>
        </div>
        <div className="text-center mb-4">
          <p className="font-medium mb-1">Location</p>
          <p className="text-sm">{eventLocation}</p>
        </div>
        <p className="text-sm italic mt-2">Hosted by: {hostName}</p>
        <p className="text-xs mt-4 border-t border-gray-200 pt-2 w-full text-center">{rsvpInfo}</p>
      </div>
    );
  };

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Invitation Designer</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-type" className="font-medium">Event Type</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="babyShower">Baby Shower</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="holiday">Holiday Party</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title" className="font-medium">Event Title</Label>
              <Input
                id="event-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. John's 30th Birthday"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="event-date" className="font-medium">Date</Label>
                <Input
                  id="event-date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. June 15, 2025"
                />
              </div>
              
              <div>
                <Label htmlFor="event-time" className="font-medium">Time</Label>
                <Input
                  id="event-time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 7:00 PM - 10:00 PM"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="event-location" className="font-medium">Location</Label>
              <Input
                id="event-location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. Crystal Garden Venue"
              />
            </div>
            
            <div>
              <Label htmlFor="host-name" className="font-medium">Host Name</Label>
              <Input
                id="host-name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. John & Jane Smith"
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="font-medium">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter invitation message"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="rsvp-info" className="font-medium">RSVP Information</Label>
              <Input
                id="rsvp-info"
                value={rsvpInfo}
                onChange={(e) => setRsvpInfo(e.target.value)}
                placeholder="e.g. RSVP by June 1st: (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">
                  <FaPalette className="mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="text">
                  <FaFont className="mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="images">
                  <FaImage className="mr-2" />
                  Images
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
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="festive">Festive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="color" className="font-medium">Color Scheme</Label>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="pt-4">
                <p className="text-sm text-gray-500">
                  Font and text style options would be available here in the full version.
                </p>
              </TabsContent>
              
              <TabsContent value="images" className="pt-4">
                <p className="text-sm text-gray-500">
                  Image upload and decorative element options would be available here in the full version.
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
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
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
      toolSlug="invitation-maker-detailed"
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

export default InvitationMakerDetailed;