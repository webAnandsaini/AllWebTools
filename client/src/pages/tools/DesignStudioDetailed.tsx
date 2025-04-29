import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface DesignConfig {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  howToUse: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  templateCategories: string[];
  defaultFormFields: {
    title: string;
    subtitle?: string;
    description?: string;
    contactInfo?: string;
    name?: string;
    position?: string;
    company?: string;
    date?: string;
    location?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  colorSchemes: Array<{
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  }>;
}

const DesignStudioDetailed: React.FC = () => {
  const [location] = useLocation();
  const [designType, setDesignType] = useState<string>("generic");
  const [tab, setTab] = useState<string>("design");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location_, setLocation_] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>("professional");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [logoText, setLogoText] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDesign, setGeneratedDesign] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [config, setConfig] = useState<DesignConfig | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Set the design type based on the current URL
  useEffect(() => {
    if (location.includes("logo-maker")) {
      setDesignType("logo");
    } else if (location.includes("resume-builder")) {
      setDesignType("resume");
    } else if (location.includes("flyer-maker")) {
      setDesignType("flyer");
    } else if (location.includes("poster-maker")) {
      setDesignType("poster");
    } else if (location.includes("invitation-maker")) {
      setDesignType("invitation");
    } else if (location.includes("business-card-maker")) {
      setDesignType("business-card");
    } else if (location.includes("meme-generator")) {
      setDesignType("meme");
    } else if (location.includes("emojis")) {
      setDesignType("emoji");
    } else {
      setDesignType("generic");
    }
  }, [location]);

  // Configuration for different design types
  useEffect(() => {
    const configurations: { [key: string]: DesignConfig } = {
      logo: {
        title: "Logo Maker",
        slug: "logo-maker",
        description: "Create a professional, eye-catching logo for your business or brand in minutes with our intuitive Logo Maker. Choose from hundreds of customizable templates across various industries, add your company name and tagline, select your color scheme, and generate a high-quality logo instantly. Our simple drag-and-drop editor lets you fine-tune every element until your logo perfectly represents your brand identity. Download your creation in multiple formats suitable for websites, social media, business cards, and more—no design experience required.",
        introduction: "Create a professional logo for your business or brand in minutes, no design skills required.",
        howToUse: [
          "Enter your company or brand name and optional tagline",
          "Select a template style that matches your industry or aesthetic",
          "Choose a color scheme that represents your brand identity",
          "Customize the design elements, fonts, and layout as desired",
          "Generate your logo and download it in multiple formats (PNG, JPG, SVG)"
        ],
        features: [
          "✅ Hundreds of professionally designed templates across multiple industries",
          "✅ Wide variety of fonts, icons, and design elements to choose from",
          "✅ Customizable color schemes with professional combinations",
          "✅ High-resolution output in multiple file formats",
          "✅ Simple drag-and-drop editor with no design experience required"
        ],
        faqs: [
          {
            question: "Do I own the rights to the logo I create?",
            answer: "Yes, once you create and download your logo, you own all rights to use it for both personal and commercial purposes. Our terms of service grant you full ownership of your created designs."
          },
          {
            question: "What file formats can I download my logo in?",
            answer: "You can download your logo in PNG (with transparent background), JPG, and SVG formats. PNG and JPG are perfect for digital use, while SVG is a vector format that allows for scaling to any size without losing quality—ideal for printing."
          },
          {
            question: "Can I edit my logo after I've created it?",
            answer: "Absolutely! Your design remains editable in our system. You can return to modify colors, fonts, layouts, or any other elements of your logo at any time before or after downloading it."
          },
          {
            question: "Do I need design skills to create a good logo?",
            answer: "Not at all. Our Logo Maker is specifically designed for non-designers. The intuitive interface, pre-designed templates, and suggested color combinations make it easy for anyone to create a professional-looking logo without any design experience."
          }
        ],
        templateCategories: [
          "Business & Consulting", "Technology", "Food & Restaurant", "Retail & Fashion", 
          "Health & Wellness", "Education", "Arts & Entertainment", "Sports & Fitness"
        ],
        defaultFormFields: {
          title: "Company Name",
          subtitle: "Tagline (Optional)"
        },
        colorSchemes: [
          {
            name: "Professional Blue",
            primary: "#1a4b8e",
            secondary: "#2d7dd2",
            accent: "#f45b69",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Earthy Green",
            primary: "#2e6e41",
            secondary: "#78c28d",
            accent: "#f2c14e",
            background: "#f9f9f9",
            text: "#2c3e50"
          },
          {
            name: "Bold Red",
            primary: "#c41e3a",
            secondary: "#f04b4b",
            accent: "#344966",
            background: "#ffffff",
            text: "#222222"
          },
          {
            name: "Elegant Black",
            primary: "#222222",
            secondary: "#444444",
            accent: "#f8c300",
            background: "#ffffff",
            text: "#222222"
          },
          {
            name: "Creative Purple",
            primary: "#5e2ca5",
            secondary: "#8b5cf6",
            accent: "#f97316",
            background: "#ffffff",
            text: "#333333"
          }
        ]
      },
      resume: {
        title: "Resume Builder",
        slug: "resume-builder",
        description: "Create a professional, customized resume in minutes with our intuitive Resume Builder. Choose from ATS-friendly templates designed by career experts, easily add your personal information, work experience, education, and skills, and generate a polished resume that stands out to employers. Our tool offers expert-written content suggestions, real-time previews, multiple formatting options, and downloadable files in various formats. Whether you're a recent graduate, changing careers, or updating your professional profile, our Resume Builder helps you create an impressive resume that showcases your qualifications effectively.",
        introduction: "Create a professional, ATS-friendly resume in minutes with our easy-to-use builder.",
        howToUse: [
          "Choose a professional resume template that matches your style",
          "Enter your personal information, work experience, education, and skills",
          "Customize the layout, sections, and formatting to suit your preferences",
          "Use our content suggestions to highlight your achievements effectively",
          "Preview your resume and download it in your preferred format (PDF, DOCX)"
        ],
        features: [
          "✅ ATS-friendly templates designed by career experts",
          "✅ Expert-written content suggestions for different industries",
          "✅ Real-time preview of your resume as you build it",
          "✅ Multiple formatting options with customizable sections",
          "✅ Downloadable in multiple file formats (PDF, DOCX, TXT)"
        ],
        faqs: [
          {
            question: "What is an ATS-friendly resume?",
            answer: "An ATS (Applicant Tracking System) friendly resume is designed to pass through automated resume scanning software used by many employers. Our templates use clean formatting, standard sections, and appropriate keywords to ensure your resume gets past these systems and into the hands of hiring managers."
          },
          {
            question: "Can I create multiple versions of my resume?",
            answer: "Yes! We recommend tailoring your resume for different positions. Our tool allows you to save multiple versions of your resume, so you can customize each one for specific job applications or industries."
          },
          {
            question: "How long should my resume be?",
            answer: "For most professionals, a one-page resume is ideal. However, if you have extensive relevant experience, two pages may be appropriate. Our templates are designed to maximize space efficiency while maintaining readability, helping you fit more content without overcrowding."
          },
          {
            question: "What should I include in my resume?",
            answer: "A strong resume typically includes contact information, a professional summary or objective, work experience, education, skills, and optionally, certifications or awards. Our builder guides you through each section and offers suggestions on what information will make the biggest impact."
          }
        ],
        templateCategories: [
          "Professional", "Modern", "Creative", "Simple", "Executive", 
          "Entry-Level", "Technical", "Academic"
        ],
        defaultFormFields: {
          name: "Full Name",
          title: "Professional Title",
          email: "Email Address",
          phone: "Phone Number",
          location: "City, State",
          website: "Portfolio URL (Optional)",
          description: "Professional Summary"
        },
        colorSchemes: [
          {
            name: "Professional Blue",
            primary: "#0d47a1",
            secondary: "#2196f3",
            accent: "#f50057",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Conservative Black",
            primary: "#212121",
            secondary: "#616161",
            accent: "#42a5f5",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Subtle Green",
            primary: "#2e7d32",
            secondary: "#66bb6a",
            accent: "#ff6f00",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Executive Gray",
            primary: "#455a64",
            secondary: "#78909c",
            accent: "#ff5722",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Creative Purple",
            primary: "#4a148c",
            secondary: "#9c27b0",
            accent: "#00bcd4",
            background: "#ffffff",
            text: "#333333"
          }
        ]
      },
      flyer: {
        title: "Flyer Maker",
        slug: "flyer-maker",
        description: "Design eye-catching, professional flyers for events, promotions, or announcements with our intuitive Flyer Maker. Choose from hundreds of customizable templates, add your own text and images, select color schemes, and generate print-ready flyers in minutes. Perfect for marketing campaigns, business promotions, community events, or any occasion requiring attention-grabbing printed materials. Our user-friendly interface makes it easy to create striking flyers that communicate your message effectively—no design experience required.",
        introduction: "Create professional, eye-catching flyers for any purpose in just minutes.",
        howToUse: [
          "Choose a template from our library of professionally designed flyer layouts",
          "Customize the title, text, and other content to fit your specific event or promotion",
          "Upload your own images or select from our library of stock photos",
          "Select a color scheme that matches your brand or event theme",
          "Download your finished flyer in high-resolution format ready for printing or digital sharing"
        ],
        features: [
          "✅ Hundreds of professionally designed templates for various purposes",
          "✅ Easy customization of text, images, colors, and layout",
          "✅ High-quality stock image library if you don't have your own photos",
          "✅ Print-ready output in multiple formats (PDF, JPG, PNG)",
          "✅ Preset dimensions for standard flyer sizes (8.5×11, 5×7, 4×6, etc.)"
        ],
        faqs: [
          {
            question: "What size should my flyer be?",
            answer: "Standard flyer sizes include 8.5×11 inches (letter size), 5×7 inches, and 4×6 inches. Our templates are available in all these dimensions, and you can select the appropriate size based on your distribution method and budget. For digital flyers, we also offer social media-optimized dimensions."
          },
          {
            question: "Can I print the flyers myself or should I use a professional printer?",
            answer: "Our flyers are designed to look great whether printed at home, at an office supply store, or by a professional print shop. For small runs or test prints, home printing works well. For larger quantities or premium quality (especially for business purposes), we recommend professional printing services."
          },
          {
            question: "How do I make my flyer stand out?",
            answer: "To create an eye-catching flyer, use a bold headline, include a clear call to action, don't overcrowd with text, use high-quality images, and incorporate colors that pop while remaining on-brand. Our templates are designed with these principles in mind to help your flyer get noticed."
          },
          {
            question: "Can I save my flyer design and edit it later?",
            answer: "Yes! All your designs are automatically saved to your account. You can return at any time to make edits, update information, or create variations of your flyer for different events or promotions."
          }
        ],
        templateCategories: [
          "Event", "Business", "Sale & Promotion", "Real Estate", "Food & Restaurant", 
          "Education", "Community", "Holiday & Seasonal"
        ],
        defaultFormFields: {
          title: "Event/Promotion Title",
          subtitle: "Subtitle/Tagline",
          description: "Description/Details",
          date: "Date & Time",
          location: "Location",
          contactInfo: "Contact Information"
        },
        colorSchemes: [
          {
            name: "Vibrant Red",
            primary: "#d32f2f",
            secondary: "#f44336",
            accent: "#ffeb3b",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Cool Blue",
            primary: "#1976d2",
            secondary: "#42a5f5",
            accent: "#ff9800",
            background: "#f5f5f5",
            text: "#333333"
          },
          {
            name: "Fresh Green",
            primary: "#388e3c",
            secondary: "#66bb6a",
            accent: "#ff4081",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Modern Purple",
            primary: "#7b1fa2",
            secondary: "#ba68c8",
            accent: "#ffc107",
            background: "#fafafa",
            text: "#424242"
          },
          {
            name: "High Contrast",
            primary: "#000000",
            secondary: "#212121",
            accent: "#f44336",
            background: "#ffffff",
            text: "#000000"
          }
        ]
      },
      poster: {
        title: "Poster Maker",
        slug: "poster-maker",
        description: "Create stunning, professional-quality posters for any purpose with our easy-to-use Poster Maker. Whether you're promoting an event, decorating a space, or creating educational materials, our tool provides hundreds of customizable templates, powerful editing features, and high-resolution output options. Choose from various sizes and orientations, add your own text and images, and customize every detail to create eye-catching posters that get your message across effectively. Perfect for marketing, education, home decor, or any situation requiring large-format visual communication.",
        introduction: "Design stunning, professional posters for events, marketing, education, or decoration in minutes.",
        howToUse: [
          "Select a poster size and orientation (portrait or landscape)",
          "Choose from our library of professionally designed templates",
          "Customize the headline, text content, and images to fit your needs",
          "Select colors, fonts, and styling to match your brand or theme",
          "Preview your design and download in high-resolution format ready for printing"
        ],
        features: [
          "✅ Multiple poster size options (standard and custom dimensions)",
          "✅ Hundreds of professionally designed templates for various purposes",
          "✅ Easy image upload and positioning with smart alignment tools",
          "✅ Typography controls with access to hundreds of fonts",
          "✅ High-resolution output perfect for large-format printing"
        ],
        faqs: [
          {
            question: "What's the difference between a poster and a flyer?",
            answer: "Posters are typically larger than flyers (often 11×17 inches or larger) and are designed to be displayed on walls or bulletin boards rather than handed out. They generally contain less text and rely more heavily on visual impact to communicate from a distance, while flyers contain more detailed information for close reading."
          },
          {
            question: "Where can I print my poster?",
            answer: "Large-format posters can be printed at copy shops, print stores (like Staples, Office Depot), or online printing services (like Vistaprint or Moo). For the highest quality, especially for marketing or professional uses, we recommend using a professional printing service that specializes in posters."
          },
          {
            question: "What resolution should my poster be for printing?",
            answer: "For best results, posters should be designed at 300 DPI (dots per inch). Our poster maker automatically creates your design at this high resolution to ensure crisp, clear printing even at large sizes. The file you download will be ready for professional printing without quality concerns."
          },
          {
            question: "How do I design an effective poster?",
            answer: "An effective poster has a clear hierarchy of information, with a large headline visible from a distance, supporting information in decreasing size, and a clear call to action. Use high-quality images, ensure text is readable from 6-10 feet away, and include only essential information. Our templates are designed with these principles in mind."
          }
        ],
        templateCategories: [
          "Event", "Movie", "Educational", "Business", "Motivational", 
          "Retail", "Political", "Art & Exhibition"
        ],
        defaultFormFields: {
          title: "Main Headline",
          subtitle: "Subheading",
          description: "Body Text/Details",
          date: "Date Information (if applicable)",
          location: "Location Information (if applicable)",
          contactInfo: "Contact Information (if applicable)"
        },
        colorSchemes: [
          {
            name: "Bold Impact",
            primary: "#d50000",
            secondary: "#ff5131",
            accent: "#ffea00",
            background: "#ffffff",
            text: "#000000"
          },
          {
            name: "Artistic Blue",
            primary: "#0d47a1",
            secondary: "#5472d3",
            accent: "#ffab40",
            background: "#e3f2fd",
            text: "#263238"
          },
          {
            name: "Modern Black",
            primary: "#212121",
            secondary: "#424242",
            accent: "#e040fb",
            background: "#f5f5f5",
            text: "#212121"
          },
          {
            name: "Vintage Brown",
            primary: "#5d4037",
            secondary: "#8b6b61",
            accent: "#26a69a",
            background: "#efebe9",
            text: "#3e2723"
          },
          {
            name: "Vibrant Gradient",
            primary: "#6200ea",
            secondary: "#7c4dff",
            accent: "#1de9b6",
            background: "#ffffff",
            text: "#212121"
          }
        ]
      },
      invitation: {
        title: "Invitation Maker",
        slug: "invitation-maker",
        description: "Create beautiful, personalized invitations for any occasion with our easy-to-use Invitation Maker. Choose from hundreds of professionally designed templates for weddings, birthdays, baby showers, graduations, corporate events, and more. Customize every aspect with our intuitive editor—add your event details, select fonts and colors, upload photos, and personalize the layout to perfectly match your event's style. Our tool generates high-quality invitations ready for printing at home, through professional services, or sharing digitally via email and social media.",
        introduction: "Create beautiful, personalized invitations for any event or occasion in minutes.",
        howToUse: [
          "Select the type of event for your invitation (wedding, birthday, corporate, etc.)",
          "Choose from our library of professionally designed templates",
          "Customize the text with your event details, date, time, and location",
          "Upload photos or graphics if desired, and adjust colors to match your event theme",
          "Preview your design and download in your preferred format for printing or digital sharing"
        ],
        features: [
          "✅ Hundreds of templates for all types of events and occasions",
          "✅ Easy customization of text, colors, images, and layout",
          "✅ RSVP card design options for formal events",
          "✅ Digital sharing options for eco-friendly electronic invitations",
          "✅ Print-ready output in multiple formats and standard invitation sizes"
        ],
        faqs: [
          {
            question: "When should I send out invitations?",
            answer: "For most casual events, 3-4 weeks in advance is appropriate. For formal events like weddings, 6-8 weeks is standard. For destination events or during busy holiday periods, 2-3 months advance notice is considerate. Digital invitations can be sent slightly closer to the event date than paper invitations."
          },
          {
            question: "What information should I include on my invitation?",
            answer: "Essential information includes: who is hosting the event, what the event is, who is invited, when it takes place (date and time), where it will be held (with address), and how to RSVP. Depending on the event, you might also include dress code, registry information, accommodation details, or special instructions."
          },
          {
            question: "Can I print these invitations at home?",
            answer: "Yes! Our invitations are designed to look great on home printers. For best results, use quality cardstock paper (65-110 lb weight). If you're printing many invitations or want professional quality, you can also download your design and use a local print shop or online printing service."
          },
          {
            question: "How do I send digital invitations?",
            answer: "After creating your invitation, select the digital format option to download a shareable image file or PDF. You can then email this to your guests, share it via messaging apps, or use it with digital invitation platforms. We also offer direct integration with email sending for convenience."
          }
        ],
        templateCategories: [
          "Wedding", "Birthday", "Baby Shower", "Graduation", "Corporate", 
          "Holiday Party", "Dinner Party", "Retirement"
        ],
        defaultFormFields: {
          title: "Event Title",
          description: "Event Details",
          date: "Date & Time",
          location: "Location/Address",
          contactInfo: "RSVP Information"
        },
        colorSchemes: [
          {
            name: "Elegant Gold",
            primary: "#bf9b30",
            secondary: "#e6c35c",
            accent: "#5d4037",
            background: "#ffffff",
            text: "#3e2723"
          },
          {
            name: "Wedding Blush",
            primary: "#f8bbd0",
            secondary: "#fce4ec",
            accent: "#9e9e9e",
            background: "#ffffff",
            text: "#424242"
          },
          {
            name: "Celebration Blue",
            primary: "#1565c0",
            secondary: "#bbdefb",
            accent: "#ffc107",
            background: "#ffffff",
            text: "#263238"
          },
          {
            name: "Birthday Bright",
            primary: "#6200ea",
            secondary: "#b388ff",
            accent: "#76ff03",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Formal Black",
            primary: "#212121",
            secondary: "#757575",
            accent: "#b0bec5",
            background: "#ffffff",
            text: "#212121"
          }
        ]
      },
      "business-card": {
        title: "Business Card Maker",
        slug: "business-card-maker",
        description: "Design professional business cards that make a lasting impression with our easy-to-use Business Card Maker. Choose from hundreds of modern templates, customize with your personal or company information, select from various layouts and color schemes, and create print-ready business cards in minutes. Our tool generates high-resolution files suitable for professional printing services or home printing, ensuring your business cards look polished and professional. Perfect for entrepreneurs, freelancers, small businesses, or anyone looking to enhance their networking with quality business cards.",
        introduction: "Create professional business cards that make a lasting impression in just minutes.",
        howToUse: [
          "Select a business card template that matches your industry or personal style",
          "Enter your name, job title, company, and contact information",
          "Customize colors, fonts, and layout to match your brand identity",
          "Upload your logo or choose from our icon library (optional)",
          "Preview both sides of your card and download in print-ready format"
        ],
        features: [
          "✅ Hundreds of professionally designed templates across industries",
          "✅ Standard business card sizing (3.5×2 inches in US, 85×55mm international)",
          "✅ Double-sided design options with front and back customization",
          "✅ Logo uploading and positioning tools",
          "✅ Print-ready output in high resolution (300 DPI) PDF or PNG formats"
        ],
        faqs: [
          {
            question: "What information should I include on my business card?",
            answer: "Essential information typically includes your name, job title, company name, phone number, email address, and website. Depending on your business and preferences, you might also include a physical address, social media handles, QR code, or a brief tagline. Our templates are designed to accommodate various information needs while maintaining clean design."
          },
          {
            question: "Where can I get my business cards printed?",
            answer: "You can print your business cards at local print shops, office supply stores (like Staples or Office Depot), or through online printing services (like Moo, Vistaprint, or GotPrint). Our designs are optimized for professional printing with proper bleed areas and margins."
          },
          {
            question: "What paper stock should I choose for business cards?",
            answer: "For professional business cards, we recommend 14-16pt cardstock (approximately 350-400gsm). You can choose matte, glossy, or uncoated finishes depending on your preference. Matte is versatile and allows for writing on the card, glossy provides vibrant colors, and uncoated gives a more natural feel."
          },
          {
            question: "Should I include a QR code on my business card?",
            answer: "QR codes can be very useful on business cards, linking to your website, portfolio, or digital contact details. Our business card maker includes an option to generate and position a QR code on your design. This modern touch makes it easy for contacts to quickly access your online presence."
          }
        ],
        templateCategories: [
          "Corporate", "Creative", "Minimalist", "Modern", "Traditional", 
          "Real Estate", "Medical", "Technology"
        ],
        defaultFormFields: {
          name: "Full Name",
          title: "Job Title",
          company: "Company/Organization",
          phone: "Phone Number",
          email: "Email Address",
          website: "Website URL",
          address: "Address (Optional)"
        },
        colorSchemes: [
          {
            name: "Corporate Blue",
            primary: "#0d47a1",
            secondary: "#1976d2",
            accent: "#ffab00",
            background: "#ffffff",
            text: "#263238"
          },
          {
            name: "Minimal Black",
            primary: "#212121",
            secondary: "#757575",
            accent: "#f50057",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Creative Orange",
            primary: "#e65100",
            secondary: "#ff9800",
            accent: "#37474f",
            background: "#fafafa",
            text: "#333333"
          },
          {
            name: "Professional Green",
            primary: "#1b5e20",
            secondary: "#388e3c",
            accent: "#ff6f00",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Modern Gray",
            primary: "#455a64",
            secondary: "#78909c",
            accent: "#00bcd4",
            background: "#eceff1",
            text: "#263238"
          }
        ]
      },
      meme: {
        title: "Meme Generator",
        slug: "meme-generator",
        description: "Create hilarious, share-worthy memes in seconds with our easy-to-use Meme Generator. Choose from hundreds of popular meme templates or upload your own images, add customized text with various fonts and styles, and generate high-quality memes perfect for social media sharing. Our tool makes it simple to create trending memes, personalized jokes, or custom image macros that will get likes, shares, and laughs across platforms. Whether you're a casual meme enthusiast or a content creator, our Meme Generator helps you quickly craft humorous content to entertain your friends, followers, or audience.",
        introduction: "Create hilarious, share-worthy memes in seconds with our easy-to-use generator.",
        howToUse: [
          "Select from our library of popular meme templates or upload your own image",
          "Add top and bottom text captions or position text anywhere on the image",
          "Customize font, size, color, and style to match your meme's vibe",
          "Preview your creation and make any needed adjustments",
          "Download your meme or share directly to social media platforms"
        ],
        features: [
          "✅ Hundreds of popular and trending meme templates always updated",
          "✅ Custom text positioning, fonts, and styling options",
          "✅ Image upload capability for creating unique memes",
          "✅ One-click social media sharing to all major platforms",
          "✅ High-quality output optimized for digital sharing"
        ],
        faqs: [
          {
            question: "Can I use these memes commercially?",
            answer: "While our Meme Generator tool is free to use, the copyright status of many popular meme templates is complex. We recommend using memes for personal or social sharing. For commercial purposes, we suggest using only your own uploaded images or public domain/properly licensed content."
          },
          {
            question: "How do I keep up with trending meme formats?",
            answer: "Our library of meme templates is regularly updated with trending formats. Check the 'Trending' category to see what's popular right now. You can also follow our blog or social media channels where we highlight new meme trends and how to use them effectively."
          },
          {
            question: "What's the best image size for memes?",
            answer: "For optimal sharing on most social platforms, we recommend memes with a 1:1 (square) or 4:5 ratio. Our generator automatically optimizes your meme for the best size, but if you're uploading custom images, aim for at least 1080×1080 pixels for high quality."
          },
          {
            question: "Can I edit a meme after I've created it?",
            answer: "Yes! Your recently created memes are saved in your session, allowing you to go back and edit them. For long-term editing, we recommend creating an account, which allows you to save your meme creations and return to edit them anytime."
          }
        ],
        templateCategories: [
          "Classic Memes", "Trending", "Reaction Images", "Animal Memes", 
          "TV/Movie Memes", "Wholesome Memes", "Political", "Sports"
        ],
        defaultFormFields: {
          title: "Top Text",
          subtitle: "Bottom Text"
        },
        colorSchemes: [
          {
            name: "Classic White",
            primary: "#ffffff",
            secondary: "#eeeeee",
            accent: "#000000",
            background: "#ffffff",
            text: "#000000"
          },
          {
            name: "Bold Impact",
            primary: "#000000",
            secondary: "#212121",
            accent: "#ffffff",
            background: "#000000",
            text: "#ffffff"
          },
          {
            name: "Vibrant",
            primary: "#2196f3",
            secondary: "#bbdefb",
            accent: "#f50057",
            background: "#ffffff",
            text: "#000000"
          },
          {
            name: "Retro",
            primary: "#ff4081",
            secondary: "#f8bbd0",
            accent: "#2979ff",
            background: "#f5f5f5",
            text: "#212121"
          },
          {
            name: "Dark Mode",
            primary: "#424242",
            secondary: "#616161",
            accent: "#00e5ff",
            background: "#303030",
            text: "#ffffff"
          }
        ]
      },
      emoji: {
        title: "Emojis",
        slug: "emojis",
        description: "Access and use thousands of emojis for all your digital communication needs with our comprehensive Emojis tool. Browse through categorized collections of standard Unicode emojis, copy them with a single click, and paste them into social media posts, messages, emails, or documents. Our tool includes the latest emoji releases, shows emoji compatibility across different platforms, and provides quick search functionality to find exactly the expression you need. Perfect for adding personality and emotion to your digital communications, creating engaging social content, or simply finding that perfect emoji reaction.",
        introduction: "Find, copy, and use thousands of emojis for all your digital communication needs.",
        howToUse: [
          "Browse through emoji categories or use the search bar to find specific emojis",
          "Click on any emoji to instantly copy it to your clipboard",
          "Paste the copied emoji into your social media posts, messages, or documents",
          "View emoji compatibility across different platforms (Apple, Google, Twitter, etc.)",
          "Create and save custom emoji combinations for quick access"
        ],
        features: [
          "✅ Complete library of Unicode-standard emojis constantly updated",
          "✅ One-click copy functionality for instant use",
          "✅ Detailed emoji search with keywords and descriptions",
          "✅ Platform compatibility information for each emoji",
          "✅ Recently used and favorite emoji sections for quick access"
        ],
        faqs: [
          {
            question: "Why do emojis look different on different devices?",
            answer: "Each platform (Apple, Google, Microsoft, Samsung, Twitter, etc.) designs their own visual interpretation of Unicode emoji standards. While the meaning remains the same, the appearance can vary significantly. Our tool shows you how each emoji looks across major platforms to avoid miscommunication."
          },
          {
            question: "How often are new emojis added?",
            answer: "The Unicode Consortium typically releases new emoji standards once per year. Our emoji library is updated promptly following each official release to ensure you always have access to the latest emojis, though compatibility with all devices depends on operating system updates."
          },
          {
            question: "Can I use emojis on my website or in documents?",
            answer: "Yes! Emojis are Unicode characters that work in most modern text environments. They can be used in website content, document titles, social media posts, and most digital text. For professional settings, we recommend using emojis sparingly and appropriately to maintain professionalism."
          },
          {
            question: "What's the difference between emojis and emoticons?",
            answer: "Emoticons are typed using keyboard characters to create expressions, like :-) for a smile. Emojis are actual graphic characters in the Unicode standard that display as colorful images. Emojis offer vastly more variety and expression than traditional emoticons, with thousands of options available."
          }
        ],
        templateCategories: [
          "Smileys & Emotion", "People & Body", "Animals & Nature", "Food & Drink", 
          "Travel & Places", "Activities", "Objects", "Symbols", "Flags"
        ],
        defaultFormFields: {
          title: "Search Emojis"
        },
        colorSchemes: [
          {
            name: "Emoji Yellow",
            primary: "#ffeb3b",
            secondary: "#fff9c4",
            accent: "#f44336",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Social Blue",
            primary: "#2196f3",
            secondary: "#bbdefb",
            accent: "#ff9800",
            background: "#ffffff",
            text: "#333333"
          },
          {
            name: "Playful Purple",
            primary: "#9c27b0",
            secondary: "#e1bee7",
            accent: "#76ff03",
            background: "#fafafa",
            text: "#333333"
          },
          {
            name: "Modern Light",
            primary: "#f5f5f5",
            secondary: "#eeeeee",
            accent: "#00bcd4",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Dark Theme",
            primary: "#212121",
            secondary: "#424242",
            accent: "#ff4081",
            background: "#303030",
            text: "#ffffff"
          }
        ]
      },
      generic: {
        title: "Design Studio",
        slug: "design-studio",
        description: "Create professional designs for any purpose with our versatile Design Studio. Whether you need logos, business cards, flyers, posters, invitations, or social media graphics, our intuitive tool provides templates, customization options, and export capabilities for all your design needs. Choose from hundreds of professionally created templates, customize with your own text and images, select from curated color schemes, and generate high-quality designs in minutes. Our user-friendly interface makes professional design accessible to everyone—no graphic design experience required.",
        introduction: "Create professional designs for any purpose with our easy-to-use design studio.",
        howToUse: [
          "Select the type of design you want to create from our range of options",
          "Choose a template that matches your style or purpose",
          "Customize the design with your text, images, colors, and branding",
          "Preview your creation and make adjustments as needed",
          "Download your finished design in your preferred file format"
        ],
        features: [
          "✅ Comprehensive suite of design tools for multiple purposes",
          "✅ Hundreds of professionally designed templates",
          "✅ Easy customization with intuitive drag-and-drop interface",
          "✅ High-quality downloads in multiple formats (PNG, JPG, PDF, SVG)",
          "✅ No design experience necessary to create professional results"
        ],
        faqs: [
          {
            question: "What types of designs can I create with this tool?",
            answer: "Our Design Studio supports a wide range of design projects including logos, business cards, social media graphics, flyers, posters, invitations, banners, brochures, letterheads, and more. Each design type comes with specialized templates and features optimized for that specific purpose."
          },
          {
            question: "Do I need design experience to use this tool?",
            answer: "Not at all. Our Design Studio is specifically created for non-designers. The intuitive interface, pre-designed templates, and guided customization process make it easy for anyone to create professional-looking designs without any prior design knowledge or experience."
          },
          {
            question: "Can I use my own images and logos in the designs?",
            answer: "Yes! You can easily upload your own images, logos, and graphics to incorporate into any design. We support common file formats (JPG, PNG, SVG) and provide tools to resize, position, and adjust your images within your design projects."
          },
          {
            question: "What file formats can I download my designs in?",
            answer: "Depending on the design type, you can download your creations in various formats including PNG (with transparency options), JPG, PDF (for print materials), and SVG (for logos and vector graphics). Each format is optimized for its intended use, whether digital or print."
          }
        ],
        templateCategories: [
          "Business", "Marketing", "Social Media", "Events", "Personal", 
          "Education", "Non-Profit", "Holiday"
        ],
        defaultFormFields: {
          title: "Design Title",
          subtitle: "Subtitle/Tagline"
        },
        colorSchemes: [
          {
            name: "Professional",
            primary: "#1976d2",
            secondary: "#2196f3",
            accent: "#ff9800",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Creative",
            primary: "#6200ea",
            secondary: "#7c4dff",
            accent: "#00e5ff",
            background: "#ffffff",
            text: "#212121"
          },
          {
            name: "Elegant",
            primary: "#5d4037",
            secondary: "#8d6e63",
            accent: "#ffc107",
            background: "#fffde7",
            text: "#3e2723"
          },
          {
            name: "Modern",
            primary: "#212121",
            secondary: "#757575",
            accent: "#f50057",
            background: "#f5f5f5",
            text: "#212121"
          },
          {
            name: "Vibrant",
            primary: "#d50000",
            secondary: "#ff5131",
            accent: "#ffff00",
            background: "#ffffff",
            text: "#212121"
          }
        ]
      }
    };

    setConfig(configurations[designType]);
  }, [designType]);

  // Get design templates based on category
  const getTemplates = () => {
    // This would normally fetch from a more comprehensive template library
    // For now we'll return a simple sample set
    const allTemplates = [
      {id: 1, name: "Modern", category: "Professional", thumbnail: "modern-template.jpg"},
      {id: 2, name: "Classic", category: "Traditional", thumbnail: "classic-template.jpg"},
      {id: 3, name: "Bold", category: "Creative", thumbnail: "bold-template.jpg"},
      {id: 4, name: "Minimal", category: "Business", thumbnail: "minimal-template.jpg"},
      {id: 5, name: "Elegant", category: "Wedding", thumbnail: "elegant-template.jpg"},
      {id: 6, name: "Playful", category: "Birthday", thumbnail: "playful-template.jpg"},
    ];
    
    if (selectedCategory === "all") {
      return allTemplates;
    }
    
    return allTemplates.filter(template => template.category === selectedCategory);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate the design based on inputs
  const handleGenerate = () => {
    setIsGenerating(true);
    setError("");
    
    // Basic validation based on design type
    if (designType === "logo" && !logoText) {
      setError("Please enter your company or brand name");
      setIsGenerating(false);
      return;
    }
    
    if ((designType === "flyer" || designType === "poster" || designType === "invitation") && !title) {
      setError("Please enter a title for your " + designType);
      setIsGenerating(false);
      return;
    }
    
    if (designType === "resume" && (!name || !position)) {
      setError("Please enter your name and professional title");
      setIsGenerating(false);
      return;
    }
    
    if (designType === "business-card" && (!name || !company)) {
      setError("Please enter your name and company name");
      setIsGenerating(false);
      return;
    }
    
    if (designType === "meme" && (!title || !uploadedImage)) {
      setError("Please enter text and upload or select an image");
      setIsGenerating(false);
      return;
    }
    
    // For this demo, we'll simulate design generation with a timeout
    setTimeout(() => {
      // In a real implementation, this would generate an actual design
      // For now, we'll just provide a success message and mock preview
      setGeneratedDesign("Your design has been generated successfully!");
      
      // Render a basic preview in the canvas
      renderDesignPreview();
      
      setIsGenerating(false);
    }, 1500);
  };

  // Render a basic design preview in the canvas
  const renderDesignPreview = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.innerHTML = ""; // Clear previous content
    
    // Get selected color scheme
    const colorScheme = config?.colorSchemes.find(scheme => scheme.name.toLowerCase() === selectedColorScheme.toLowerCase()) 
      || config?.colorSchemes[0];
    
    // Create the preview container
    const previewContainer = document.createElement("div");
    previewContainer.style.width = "100%";
    previewContainer.style.padding = "20px";
    previewContainer.style.boxSizing = "border-box";
    previewContainer.style.backgroundColor = colorScheme?.background || "#ffffff";
    previewContainer.style.color = colorScheme?.text || "#000000";
    previewContainer.style.fontFamily = "'Inter', sans-serif";
    previewContainer.style.borderRadius = "8px";
    previewContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    
    // Create and style design content based on design type
    switch (designType) {
      case "logo":
        createLogoPreview(previewContainer, colorScheme);
        break;
      case "resume":
        createResumePreview(previewContainer, colorScheme);
        break;
      case "flyer":
      case "poster":
        createPosterFlyerPreview(previewContainer, colorScheme);
        break;
      case "invitation":
        createInvitationPreview(previewContainer, colorScheme);
        break;
      case "business-card":
        createBusinessCardPreview(previewContainer, colorScheme);
        break;
      case "meme":
        createMemePreview(previewContainer, colorScheme);
        break;
      case "emoji":
        createEmojiPreview(previewContainer);
        break;
      default:
        createGenericPreview(previewContainer, colorScheme);
    }
    
    canvas.appendChild(previewContainer);
  };

  // Create logo preview
  const createLogoPreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.textAlign = "center";
    container.style.padding = "40px 20px";
    
    if (uploadedImageUrl) {
      const logoImg = document.createElement("img");
      logoImg.src = uploadedImageUrl;
      logoImg.style.maxWidth = "150px";
      logoImg.style.marginBottom = "10px";
      container.appendChild(logoImg);
    } else {
      const logoSymbol = document.createElement("div");
      logoSymbol.style.width = "60px";
      logoSymbol.style.height = "60px";
      logoSymbol.style.backgroundColor = colorScheme.primary;
      logoSymbol.style.borderRadius = selectedTemplate === "modern" ? "8px" : "50%";
      logoSymbol.style.margin = "0 auto 15px";
      container.appendChild(logoSymbol);
    }
    
    const logoName = document.createElement("h1");
    logoName.textContent = logoText || "Company Name";
    logoName.style.color = colorScheme.primary;
    logoName.style.margin = "0 0 5px";
    logoName.style.fontSize = "24px";
    logoName.style.fontWeight = "bold";
    logoName.style.letterSpacing = "0.5px";
    container.appendChild(logoName);
    
    if (tagline) {
      const logoTagline = document.createElement("p");
      logoTagline.textContent = tagline;
      logoTagline.style.color = colorScheme.secondary;
      logoTagline.style.margin = "5px 0 0";
      logoTagline.style.fontSize = "14px";
      container.appendChild(logoTagline);
    }
  };

  // Create resume preview
  const createResumePreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.padding = "30px";
    
    // Header with name and title
    const header = document.createElement("div");
    header.style.borderBottom = `2px solid ${colorScheme.primary}`;
    header.style.paddingBottom = "15px";
    header.style.marginBottom = "20px";
    
    const personName = document.createElement("h1");
    personName.textContent = name || "Your Name";
    personName.style.color = colorScheme.primary;
    personName.style.margin = "0 0 5px";
    personName.style.fontSize = "26px";
    personName.style.fontWeight = "bold";
    
    const personTitle = document.createElement("h2");
    personTitle.textContent = position || "Professional Title";
    personTitle.style.color = colorScheme.secondary;
    personTitle.style.margin = "0";
    personTitle.style.fontSize = "18px";
    personTitle.style.fontWeight = "normal";
    
    header.appendChild(personName);
    header.appendChild(personTitle);
    container.appendChild(header);
    
    // Contact information
    const contactSection = document.createElement("div");
    contactSection.style.marginBottom = "20px";
    contactSection.style.display = "flex";
    contactSection.style.justifyContent = "space-between";
    contactSection.style.flexWrap = "wrap";
    contactSection.style.fontSize = "14px";
    
    if (email) {
      const emailDiv = document.createElement("div");
      emailDiv.textContent = email;
      contactSection.appendChild(emailDiv);
    }
    
    if (phone) {
      const phoneDiv = document.createElement("div");
      phoneDiv.textContent = phone;
      contactSection.appendChild(phoneDiv);
    }
    
    if (location_) {
      const locationDiv = document.createElement("div");
      locationDiv.textContent = location_;
      contactSection.appendChild(locationDiv);
    }
    
    container.appendChild(contactSection);
    
    // Summary section
    if (description) {
      const summarySection = document.createElement("div");
      summarySection.style.marginBottom = "20px";
      
      const summaryTitle = document.createElement("h3");
      summaryTitle.textContent = "Professional Summary";
      summaryTitle.style.color = colorScheme.primary;
      summaryTitle.style.fontSize = "16px";
      summaryTitle.style.marginBottom = "10px";
      
      const summaryText = document.createElement("p");
      summaryText.textContent = description;
      summaryText.style.margin = "0";
      summaryText.style.fontSize = "14px";
      summaryText.style.lineHeight = "1.5";
      
      summarySection.appendChild(summaryTitle);
      summarySection.appendChild(summaryText);
      container.appendChild(summarySection);
    }
    
    // Placeholder sections for a complete resume look
    const sections = ["Experience", "Education", "Skills"];
    sections.forEach(sectionName => {
      const section = document.createElement("div");
      section.style.marginBottom = "20px";
      
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = sectionName;
      sectionTitle.style.color = colorScheme.primary;
      sectionTitle.style.fontSize = "16px";
      sectionTitle.style.marginBottom = "10px";
      
      const placeholderText = document.createElement("p");
      placeholderText.textContent = `[Your ${sectionName} information will appear here]`;
      placeholderText.style.color = "#888";
      placeholderText.style.fontStyle = "italic";
      placeholderText.style.fontSize = "14px";
      
      section.appendChild(sectionTitle);
      section.appendChild(placeholderText);
      container.appendChild(section);
    });
  };

  // Create flyer or poster preview
  const createPosterFlyerPreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.textAlign = "center";
    container.style.padding = "30px";
    
    // Header/Title
    const mainTitle = document.createElement("h1");
    mainTitle.textContent = title || `${designType.charAt(0).toUpperCase() + designType.slice(1)} Title`;
    mainTitle.style.color = colorScheme.primary;
    mainTitle.style.margin = "0 0 10px";
    mainTitle.style.fontSize = "28px";
    mainTitle.style.fontWeight = "bold";
    mainTitle.style.letterSpacing = "0.5px";
    container.appendChild(mainTitle);
    
    // Subtitle if available
    if (subtitle) {
      const subtitleElem = document.createElement("h2");
      subtitleElem.textContent = subtitle;
      subtitleElem.style.color = colorScheme.secondary;
      subtitleElem.style.margin = "0 0 20px";
      subtitleElem.style.fontSize = "20px";
      subtitleElem.style.fontWeight = "normal";
      container.appendChild(subtitleElem);
    }
    
    // Image placeholder or uploaded image
    const imageContainer = document.createElement("div");
    imageContainer.style.margin = "20px 0";
    imageContainer.style.padding = "10px";
    imageContainer.style.backgroundColor = "#f5f5f5";
    imageContainer.style.borderRadius = "4px";
    
    if (uploadedImageUrl) {
      const img = document.createElement("img");
      img.src = uploadedImageUrl;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "200px";
      img.style.objectFit = "contain";
      imageContainer.appendChild(img);
    } else {
      const placeholderText = document.createElement("div");
      placeholderText.textContent = "Image Placeholder";
      placeholderText.style.height = "150px";
      placeholderText.style.display = "flex";
      placeholderText.style.alignItems = "center";
      placeholderText.style.justifyContent = "center";
      placeholderText.style.color = "#888";
      imageContainer.appendChild(placeholderText);
    }
    
    container.appendChild(imageContainer);
    
    // Description text
    if (description) {
      const descriptionElem = document.createElement("p");
      descriptionElem.textContent = description;
      descriptionElem.style.margin = "20px 0";
      descriptionElem.style.fontSize = "16px";
      descriptionElem.style.lineHeight = "1.5";
      container.appendChild(descriptionElem);
    }
    
    // Date, Location, Contact Info
    const detailsContainer = document.createElement("div");
    detailsContainer.style.marginTop = "30px";
    detailsContainer.style.padding = "15px";
    detailsContainer.style.backgroundColor = colorScheme.secondary + "30"; // 30% opacity
    detailsContainer.style.borderRadius = "4px";
    
    if (date) {
      const dateElem = document.createElement("p");
      dateElem.textContent = `📅 ${date}`;
      dateElem.style.margin = "5px 0";
      dateElem.style.fontWeight = "bold";
      detailsContainer.appendChild(dateElem);
    }
    
    if (location_) {
      const locationElem = document.createElement("p");
      locationElem.textContent = `📍 ${location_}`;
      locationElem.style.margin = "5px 0";
      detailsContainer.appendChild(locationElem);
    }
    
    if (contactInfo) {
      const contactElem = document.createElement("p");
      contactElem.textContent = `📞 ${contactInfo}`;
      contactElem.style.margin = "5px 0";
      detailsContainer.appendChild(contactElem);
    }
    
    container.appendChild(detailsContainer);
  };

  // Create invitation preview
  const createInvitationPreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.textAlign = "center";
    container.style.padding = "30px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
    
    // Header decoration
    const decoration = document.createElement("div");
    decoration.style.height = "5px";
    decoration.style.width = "60%";
    decoration.style.margin = "0 auto 25px";
    decoration.style.background = `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.accent})`;
    decoration.style.borderRadius = "3px";
    container.appendChild(decoration);
    
    // Title - "You're Invited" or custom title
    const inviteTitle = document.createElement("h1");
    inviteTitle.textContent = title || "You're Invited";
    inviteTitle.style.color = colorScheme.primary;
    inviteTitle.style.margin = "0 0 20px";
    inviteTitle.style.fontSize = "26px";
    inviteTitle.style.fontWeight = "bold";
    inviteTitle.style.letterSpacing = "1px";
    container.appendChild(inviteTitle);
    
    // Description or event details
    if (description) {
      const descriptionElem = document.createElement("p");
      descriptionElem.textContent = description;
      descriptionElem.style.margin = "15px 0";
      descriptionElem.style.fontSize = "16px";
      descriptionElem.style.lineHeight = "1.5";
      container.appendChild(descriptionElem);
    }
    
    // Date and time
    if (date) {
      const dateContainer = document.createElement("div");
      dateContainer.style.margin = "25px 0";
      
      const dateLabel = document.createElement("span");
      dateLabel.textContent = "When:";
      dateLabel.style.fontWeight = "bold";
      dateLabel.style.color = colorScheme.secondary;
      dateLabel.style.display = "block";
      dateLabel.style.marginBottom = "5px";
      
      const dateValue = document.createElement("span");
      dateValue.textContent = date;
      dateValue.style.fontSize = "18px";
      
      dateContainer.appendChild(dateLabel);
      dateContainer.appendChild(dateValue);
      container.appendChild(dateContainer);
    }
    
    // Location
    if (location_) {
      const locationContainer = document.createElement("div");
      locationContainer.style.margin = "25px 0";
      
      const locationLabel = document.createElement("span");
      locationLabel.textContent = "Where:";
      locationLabel.style.fontWeight = "bold";
      locationLabel.style.color = colorScheme.secondary;
      locationLabel.style.display = "block";
      locationLabel.style.marginBottom = "5px";
      
      const locationValue = document.createElement("span");
      locationValue.textContent = location_;
      locationValue.style.fontSize = "18px";
      
      locationContainer.appendChild(locationLabel);
      locationContainer.appendChild(locationValue);
      container.appendChild(locationContainer);
    }
    
    // RSVP information
    if (contactInfo) {
      const rsvpContainer = document.createElement("div");
      rsvpContainer.style.margin = "25px 0 15px";
      rsvpContainer.style.padding = "10px";
      rsvpContainer.style.border = `1px solid ${colorScheme.accent}`;
      rsvpContainer.style.borderRadius = "4px";
      
      const rsvpLabel = document.createElement("span");
      rsvpLabel.textContent = "RSVP:";
      rsvpLabel.style.fontWeight = "bold";
      rsvpLabel.style.color = colorScheme.accent;
      rsvpLabel.style.display = "block";
      rsvpLabel.style.marginBottom = "5px";
      
      const rsvpValue = document.createElement("span");
      rsvpValue.textContent = contactInfo;
      
      rsvpContainer.appendChild(rsvpLabel);
      rsvpContainer.appendChild(rsvpValue);
      container.appendChild(rsvpContainer);
    }
    
    // Bottom decoration
    const bottomDecoration = document.createElement("div");
    bottomDecoration.style.height = "5px";
    bottomDecoration.style.width = "60%";
    bottomDecoration.style.margin = "25px auto 0";
    bottomDecoration.style.background = `linear-gradient(to right, ${colorScheme.accent}, ${colorScheme.primary})`;
    bottomDecoration.style.borderRadius = "3px";
    container.appendChild(bottomDecoration);
  };

  // Create business card preview
  const createBusinessCardPreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.width = "350px";
    container.style.height = "200px";
    container.style.padding = "20px";
    container.style.margin = "0 auto";
    container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-between";
    container.style.position = "relative";
    container.style.overflow = "hidden";
    
    // Add a decorative element based on template
    if (selectedTemplate === "modern") {
      const decoration = document.createElement("div");
      decoration.style.position = "absolute";
      decoration.style.top = "0";
      decoration.style.right = "0";
      decoration.style.width = "40%";
      decoration.style.height = "100%";
      decoration.style.background = colorScheme.primary;
      decoration.style.clipPath = "polygon(100% 0, 0 0, 100% 100%)";
      decoration.style.opacity = "0.1";
      decoration.style.zIndex = "0";
      container.appendChild(decoration);
    }
    
    // Logo/Company area
    const topSection = document.createElement("div");
    topSection.style.zIndex = "1";
    
    if (uploadedImageUrl) {
      const logoImg = document.createElement("img");
      logoImg.src = uploadedImageUrl;
      logoImg.style.maxWidth = "100px";
      logoImg.style.maxHeight = "40px";
      logoImg.style.marginBottom = "5px";
      topSection.appendChild(logoImg);
    }
    
    const companyName = document.createElement("h2");
    companyName.textContent = company || "Company Name";
    companyName.style.color = colorScheme.primary;
    companyName.style.margin = "0";
    companyName.style.fontSize = "18px";
    companyName.style.fontWeight = "bold";
    topSection.appendChild(companyName);
    
    container.appendChild(topSection);
    
    // Personal info area
    const middleSection = document.createElement("div");
    middleSection.style.zIndex = "1";
    
    const personName = document.createElement("h1");
    personName.textContent = name || "Your Name";
    personName.style.color = colorScheme.text;
    personName.style.margin = "0 0 2px";
    personName.style.fontSize = "22px";
    personName.style.fontWeight = "bold";
    middleSection.appendChild(personName);
    
    if (position) {
      const personTitle = document.createElement("p");
      personTitle.textContent = position;
      personTitle.style.color = colorScheme.secondary;
      personTitle.style.margin = "0";
      personTitle.style.fontSize = "14px";
      middleSection.appendChild(personTitle);
    }
    
    container.appendChild(middleSection);
    
    // Contact details area
    const bottomSection = document.createElement("div");
    bottomSection.style.zIndex = "1";
    bottomSection.style.fontSize = "12px";
    
    if (phone) {
      const phoneElem = document.createElement("p");
      phoneElem.textContent = `📱 ${phone}`;
      phoneElem.style.margin = "3px 0";
      bottomSection.appendChild(phoneElem);
    }
    
    if (email) {
      const emailElem = document.createElement("p");
      emailElem.textContent = `✉️ ${email}`;
      emailElem.style.margin = "3px 0";
      bottomSection.appendChild(emailElem);
    }
    
    if (website) {
      const websiteElem = document.createElement("p");
      websiteElem.textContent = `🌐 ${website}`;
      websiteElem.style.margin = "3px 0";
      bottomSection.appendChild(websiteElem);
    }
    
    container.appendChild(bottomSection);
  };

  // Create meme preview
  const createMemePreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.textAlign = "center";
    container.style.padding = "0";
    container.style.position = "relative";
    container.style.maxWidth = "400px";
    container.style.margin = "0 auto";
    
    // Image container
    const imageContainer = document.createElement("div");
    imageContainer.style.position = "relative";
    imageContainer.style.width = "100%";
    imageContainer.style.paddingBottom = "75%"; // 4:3 aspect ratio
    imageContainer.style.backgroundColor = "#000";
    imageContainer.style.overflow = "hidden";
    
    if (uploadedImageUrl) {
      const img = document.createElement("img");
      img.src = uploadedImageUrl;
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      imageContainer.appendChild(img);
    } else {
      const placeholderText = document.createElement("div");
      placeholderText.textContent = "Meme Image Placeholder";
      placeholderText.style.position = "absolute";
      placeholderText.style.top = "0";
      placeholderText.style.left = "0";
      placeholderText.style.width = "100%";
      placeholderText.style.height = "100%";
      placeholderText.style.display = "flex";
      placeholderText.style.alignItems = "center";
      placeholderText.style.justifyContent = "center";
      placeholderText.style.color = "#fff";
      placeholderText.style.backgroundColor = "#444";
      imageContainer.appendChild(placeholderText);
    }
    
    // Top text
    const topText = document.createElement("div");
    topText.textContent = title || "TOP TEXT";
    topText.style.position = "absolute";
    topText.style.top = "10px";
    topText.style.left = "0";
    topText.style.width = "100%";
    topText.style.padding = "0 15px";
    topText.style.fontSize = "24px";
    topText.style.fontWeight = "800";
    topText.style.color = "#fff";
    topText.style.textShadow = "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000";
    topText.style.textTransform = "uppercase";
    topText.style.letterSpacing = "1px";
    imageContainer.appendChild(topText);
    
    // Bottom text
    const bottomText = document.createElement("div");
    bottomText.textContent = subtitle || "BOTTOM TEXT";
    bottomText.style.position = "absolute";
    bottomText.style.bottom = "10px";
    bottomText.style.left = "0";
    bottomText.style.width = "100%";
    bottomText.style.padding = "0 15px";
    bottomText.style.fontSize = "24px";
    bottomText.style.fontWeight = "800";
    bottomText.style.color = "#fff";
    bottomText.style.textShadow = "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000";
    bottomText.style.textTransform = "uppercase";
    bottomText.style.letterSpacing = "1px";
    imageContainer.appendChild(bottomText);
    
    container.appendChild(imageContainer);
  };

  // Create emoji preview
  const createEmojiPreview = (container: HTMLDivElement) => {
    container.style.padding = "20px";
    
    // Search result title
    const resultTitle = document.createElement("h3");
    resultTitle.textContent = title ? `Search results for "${title}"` : "Popular Emojis";
    resultTitle.style.marginBottom = "20px";
    resultTitle.style.fontSize = "18px";
    container.appendChild(resultTitle);
    
    // Emoji grid
    const emojiGrid = document.createElement("div");
    emojiGrid.style.display = "grid";
    emojiGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(45px, 1fr))";
    emojiGrid.style.gap = "15px";
    emojiGrid.style.textAlign = "center";
    
    // Sample emojis
    const sampleEmojis = ["😀", "😂", "😍", "🤔", "👍", "❤️", "🎉", "👏", "🔥", "✨", "🌟", "💯", "🙏", "🌈", "🍕", "🚀"];
    
    sampleEmojis.forEach(emoji => {
      const emojiContainer = document.createElement("div");
      emojiContainer.style.fontSize = "28px";
      emojiContainer.style.cursor = "pointer";
      emojiContainer.style.padding = "5px";
      emojiContainer.style.borderRadius = "5px";
      emojiContainer.style.transition = "background-color 0.2s";
      emojiContainer.style.userSelect = "none";
      emojiContainer.textContent = emoji;
      
      // Hover effect
      emojiContainer.addEventListener("mouseover", () => {
        emojiContainer.style.backgroundColor = "#f0f0f0";
      });
      
      emojiContainer.addEventListener("mouseout", () => {
        emojiContainer.style.backgroundColor = "transparent";
      });
      
      emojiGrid.appendChild(emojiContainer);
    });
    
    container.appendChild(emojiGrid);
    
    // Category tabs
    const categoryTabs = document.createElement("div");
    categoryTabs.style.marginTop = "25px";
    categoryTabs.style.borderTop = "1px solid #e0e0e0";
    categoryTabs.style.paddingTop = "15px";
    categoryTabs.style.display = "flex";
    categoryTabs.style.overflowX = "auto";
    categoryTabs.style.gap = "10px";
    
    const categories = ["Smileys", "People", "Animals", "Food", "Activities", "Travel", "Objects", "Symbols", "Flags"];
    
    categories.forEach(category => {
      const tab = document.createElement("div");
      tab.textContent = category;
      tab.style.padding = "5px 10px";
      tab.style.borderRadius = "15px";
      tab.style.backgroundColor = "#f0f0f0";
      tab.style.fontSize = "14px";
      tab.style.whiteSpace = "nowrap";
      tab.style.cursor = "pointer";
      categoryTabs.appendChild(tab);
    });
    
    container.appendChild(categoryTabs);
  };

  // Create generic preview
  const createGenericPreview = (container: HTMLDivElement, colorScheme: any) => {
    container.style.textAlign = "center";
    container.style.padding = "25px";
    
    // Title
    const designTitle = document.createElement("h2");
    designTitle.textContent = title || "Your Design Title";
    designTitle.style.color = colorScheme.primary;
    designTitle.style.margin = "0 0 15px";
    designTitle.style.fontSize = "24px";
    container.appendChild(designTitle);
    
    if (subtitle) {
      const designSubtitle = document.createElement("h3");
      designSubtitle.textContent = subtitle;
      designSubtitle.style.color = colorScheme.secondary;
      designSubtitle.style.margin = "0 0 20px";
      designSubtitle.style.fontSize = "18px";
      designSubtitle.style.fontWeight = "normal";
      container.appendChild(designSubtitle);
    }
    
    // Image or placeholder
    const imageContainer = document.createElement("div");
    imageContainer.style.margin = "20px 0";
    
    if (uploadedImageUrl) {
      const img = document.createElement("img");
      img.src = uploadedImageUrl;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "200px";
      img.style.borderRadius = "4px";
      imageContainer.appendChild(img);
    } else {
      const placeholderBox = document.createElement("div");
      placeholderBox.style.width = "100%";
      placeholderBox.style.height = "160px";
      placeholderBox.style.backgroundColor = colorScheme.secondary + "20"; // 20% opacity
      placeholderBox.style.borderRadius = "4px";
      placeholderBox.style.display = "flex";
      placeholderBox.style.alignItems = "center";
      placeholderBox.style.justifyContent = "center";
      placeholderBox.textContent = "Placeholder Image";
      placeholderBox.style.color = colorScheme.secondary;
      imageContainer.appendChild(placeholderBox);
    }
    
    container.appendChild(imageContainer);
    
    // Description text if available
    if (description) {
      const descText = document.createElement("p");
      descText.textContent = description;
      descText.style.margin = "15px 0";
      descText.style.lineHeight = "1.5";
      container.appendChild(descText);
    }
    
    // Action button
    const actionButton = document.createElement("button");
    actionButton.textContent = "View Details";
    actionButton.style.backgroundColor = colorScheme.accent;
    actionButton.style.color = "#fff";
    actionButton.style.border = "none";
    actionButton.style.borderRadius = "4px";
    actionButton.style.padding = "8px 16px";
    actionButton.style.fontWeight = "bold";
    actionButton.style.cursor = "pointer";
    actionButton.style.marginTop = "20px";
    container.appendChild(actionButton);
  };

  // Set default form fields based on config when it changes
  useEffect(() => {
    if (config?.defaultFormFields) {
      // Only set fields if they're empty (allow user to keep their entered data)
      if (config.defaultFormFields.title && !title) {
        setTitle(config.defaultFormFields.title);
      }
      
      if (config.defaultFormFields.subtitle && !subtitle) {
        setSubtitle(config.defaultFormFields.subtitle);
      }
      
      if (config.defaultFormFields.description && !description) {
        setDescription(config.defaultFormFields.description);
      }
      
      if (config.defaultFormFields.contactInfo && !contactInfo) {
        setContactInfo(config.defaultFormFields.contactInfo);
      }
      
      if (config.defaultFormFields.name && !name) {
        setName(config.defaultFormFields.name);
      }
      
      if (config.defaultFormFields.position && !position) {
        setPosition(config.defaultFormFields.position);
      }
      
      if (config.defaultFormFields.company && !company) {
        setCompany(config.defaultFormFields.company);
      }
      
      if (config.defaultFormFields.date && !date) {
        setDate(config.defaultFormFields.date);
      }
      
      if (config.defaultFormFields.location && !location_) {
        setLocation_(config.defaultFormFields.location);
      }
      
      if (config.defaultFormFields.website && !website) {
        setWebsite(config.defaultFormFields.website);
      }
      
      if (config.defaultFormFields.email && !email) {
        setEmail(config.defaultFormFields.email);
      }
      
      if (config.defaultFormFields.phone && !phone) {
        setPhone(config.defaultFormFields.phone);
      }
    }
  }, [config]);

  if (!config) {
    return <div>Loading...</div>;
  }

  // Determine which form fields to show based on design type
  const renderFormFields = () => {
    switch (designType) {
      case "logo":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="logoText">Company/Brand Name</Label>
                <Input
                  id="logoText"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="Enter your company or brand name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline (Optional)</Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Enter a slogan or tagline"
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        );
        
      case "resume":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="position">Professional Title</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location_}
                  onChange={(e) => setLocation_(e.target.value)}
                  placeholder="City, State"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yourwebsite.com"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Professional Summary</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief summary of your professional background and key qualifications..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>
          </>
        );
        
      case "flyer":
      case "poster":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter your ${designType} title`}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Add a subtitle or tagline"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description/Details</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Enter the main content for your ${designType}`}
                  className="mt-1.5 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date & Time (Optional)</Label>
                  <Input
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. June 15, 2023 at 7 PM"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={location_}
                    onChange={(e) => setLocation_(e.target.value)}
                    placeholder="Enter event location or address"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contactInfo">Contact Information (Optional)</Label>
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Phone, email, or website"
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        );
        
      case "invitation":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sarah's Wedding"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Event Details</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event..."
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date & Time</Label>
                  <Input
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Saturday, August 12 at 5 PM"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location_}
                    onChange={(e) => setLocation_(e.target.value)}
                    placeholder="Enter venue and address"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contactInfo">RSVP Information</Label>
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. RSVP by July 15 to 555-123-4567"
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        );
        
      case "business-card":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="position">Job Title</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Marketing Director"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(123) 456-7890"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.company.com"
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        );
        
      case "meme":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Top Text</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter top text"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Bottom Text</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter bottom text"
                  className="mt-1.5"
                />
              </div>
            </div>
          </>
        );
        
      case "emoji":
        return (
          <>
            <div>
              <Label htmlFor="title">Search Emojis</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by keyword or description..."
                className="mt-1.5"
              />
            </div>
          </>
        );
        
      default:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle/Tagline (Optional)</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter subtitle or tagline"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description or additional text"
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
            </div>
          </>
        );
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Content</TabsTrigger>
          <TabsTrigger value="style">Style & Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="space-y-6 pt-4">
          <Card>
            <CardContent className="pt-6">
              {renderFormFields()}
              
              {/* File upload - shown for relevant design types */}
              {(designType === "logo" || designType === "meme" || 
                designType === "flyer" || designType === "poster") && (
                <div className="mt-6">
                  <Label htmlFor="image">Upload Image {designType === "meme" ? "(Required)" : "(Optional)"}</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-1.5"
                    accept="image/*"
                  />
                  
                  {uploadedImageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Preview:</p>
                      <img 
                        src={uploadedImageUrl} 
                        alt="Preview" 
                        className="max-h-[150px] max-w-full rounded border border-gray-200" 
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-6 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Template selection */}
                <div>
                  <Label>Template Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {config.templateCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Template grid */}
                <div>
                  <Label className="block mb-3">Select Template</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {getTemplates().map((template) => (
                      <div 
                        key={template.id}
                        className={`p-2 border rounded-md cursor-pointer transition-colors ${
                          selectedTemplate === template.name.toLowerCase()
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedTemplate(template.name.toLowerCase())}
                      >
                        <div className="aspect-video bg-gray-100 flex items-center justify-center mb-2 text-xs text-gray-500">
                          {template.name}
                        </div>
                        <p className="text-xs font-medium truncate">{template.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Color scheme selection */}
                <div>
                  <Label className="block mb-3">Color Scheme</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {config.colorSchemes.map((scheme) => (
                      <div 
                        key={scheme.name}
                        className={`p-2 border rounded-md cursor-pointer transition-colors flex items-center ${
                          selectedColorScheme === scheme.name.toLowerCase()
                            ? "border-primary"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedColorScheme(scheme.name.toLowerCase())}
                      >
                        <div className="flex gap-1.5 mr-3">
                          <div 
                            className="w-5 h-5 rounded-full" 
                            style={{ backgroundColor: scheme.primary }}
                          ></div>
                          <div 
                            className="w-5 h-5 rounded-full" 
                            style={{ backgroundColor: scheme.secondary }}
                          ></div>
                          <div 
                            className="w-5 h-5 rounded-full" 
                            style={{ backgroundColor: scheme.accent }}
                          ></div>
                        </div>
                        <span className="text-sm">{scheme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button 
        variant="default" 
        onClick={handleGenerate} 
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : `Generate ${config.title}`}
      </Button>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      {generatedDesign && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Design Preview</h3>
              <div 
                ref={canvasRef} 
                className="min-h-[200px] rounded-lg overflow-hidden border border-gray-200"
              ></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Download</Button>
                <Button variant="outline">Share</Button>
                <Button>Edit Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Determine the toolSlug from the current URL
  const getToolSlug = (): string => {
    return config.slug;
  };

  return (
    <ToolPageTemplate
      toolSlug={getToolSlug()}
      toolContent={
        <ToolContentTemplate
          introduction={config.introduction}
          description={config.description}
          howToUse={config.howToUse}
          features={config.features}
          faqs={config.faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default DesignStudioDetailed;