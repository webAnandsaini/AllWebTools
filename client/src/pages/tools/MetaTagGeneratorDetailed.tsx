import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { metaTagsTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaCode, 
  FaCopy, 
  FaDownload, 
  FaFacebook, 
  FaTwitter, 
  FaFileCode,
  FaCheck,
  FaInfoCircle,
  FaImage,
  FaGlobe,
  FaMagic
} from "react-icons/fa";

const MetaTagGeneratorDetailed = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    imageUrl: "",
    url: "",
    siteName: "",
    twitterUsername: ""
  });
  
  const [includeBasic, setIncludeBasic] = useState(true);
  const [includeOpenGraph, setIncludeOpenGraph] = useState(true);
  const [includeTwitter, setIncludeTwitter] = useState(true);
  
  const [generatedCode, setGeneratedCode] = useState("");
  const [activePreviewTab, setActivePreviewTab] = useState("html");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateCode = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your meta tags.",
        variant: "destructive",
      });
      return;
    }

    let code = "";
    
    // Basic meta tags
    if (includeBasic) {
      code += `<title>${escapeHtml(formData.title)}</title>\n`;
      
      if (formData.description) {
        code += `<meta name="description" content="${escapeHtml(formData.description)}" />\n`;
      }
      
      if (formData.keywords) {
        code += `<meta name="keywords" content="${escapeHtml(formData.keywords)}" />\n`;
      }
      
      if (formData.author) {
        code += `<meta name="author" content="${escapeHtml(formData.author)}" />\n`;
      }
      
      code += `<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n`;
      code += `<meta charset="UTF-8" />\n`;
      code += `<meta name="robots" content="index, follow" />\n`;
      
      if (formData.url) {
        code += `<link rel="canonical" href="${escapeHtml(formData.url)}" />\n`;
      }
    }
    
    // Open Graph meta tags
    if (includeOpenGraph) {
      code += `<meta property="og:title" content="${escapeHtml(formData.title)}" />\n`;
      
      if (formData.description) {
        code += `<meta property="og:description" content="${escapeHtml(formData.description)}" />\n`;
      }
      
      if (formData.url) {
        code += `<meta property="og:url" content="${escapeHtml(formData.url)}" />\n`;
      }
      
      code += `<meta property="og:type" content="website" />\n`;
      
      if (formData.imageUrl) {
        code += `<meta property="og:image" content="${escapeHtml(formData.imageUrl)}" />\n`;
        code += `<meta property="og:image:alt" content="${escapeHtml(formData.title)}" />\n`;
      }
      
      if (formData.siteName) {
        code += `<meta property="og:site_name" content="${escapeHtml(formData.siteName)}" />\n`;
      }
    }
    
    // Twitter Card meta tags
    if (includeTwitter) {
      code += `<meta name="twitter:card" content="summary_large_image" />\n`;
      code += `<meta name="twitter:title" content="${escapeHtml(formData.title)}" />\n`;
      
      if (formData.description) {
        code += `<meta name="twitter:description" content="${escapeHtml(formData.description)}" />\n`;
      }
      
      if (formData.imageUrl) {
        code += `<meta name="twitter:image" content="${escapeHtml(formData.imageUrl)}" />\n`;
      }
      
      if (formData.twitterUsername) {
        code += `<meta name="twitter:site" content="@${escapeHtml(formData.twitterUsername.replace('@', ''))}" />\n`;
        code += `<meta name="twitter:creator" content="@${escapeHtml(formData.twitterUsername.replace('@', ''))}" />\n`;
      }
    }
    
    setGeneratedCode(code);
    
    toast({
      title: "Meta tags generated",
      description: "Your meta tags have been successfully generated.",
    });
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Meta tags code copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  const downloadAsHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generatedCode}
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Generated Meta Tags</h1>
  <pre>${escapeHtml(generatedCode)}</pre>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download successful",
      description: "HTML file with meta tags downloaded.",
    });
  };

  const generateFacebookPreview = () => {
    if (!formData.title) return null;
    
    return (
      <div className="border rounded-md overflow-hidden max-w-md">
        {formData.imageUrl && (
          <div className="h-48 bg-gray-200 relative">
            <img 
              src={formData.imageUrl} 
              alt={formData.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/1200x630?text=Image+Preview";
              }} 
            />
          </div>
        )}
        <div className="p-3 bg-white">
          <div className="text-xs text-gray-500 uppercase mb-1">
            {formData.siteName || "Your Website"}
          </div>
          <h3 className="font-medium text-sm line-clamp-2 mb-1">
            {formData.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-3">
            {formData.description || "No description provided."}
          </p>
        </div>
      </div>
    );
  };

  const generateTwitterPreview = () => {
    if (!formData.title) return null;
    
    return (
      <div className="border rounded-md overflow-hidden max-w-md">
        {formData.imageUrl && (
          <div className="h-48 bg-gray-200 relative">
            <img 
              src={formData.imageUrl} 
              alt={formData.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/1200x600?text=Image+Preview";
              }} 
            />
          </div>
        )}
        <div className="p-3 bg-white">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">
            {formData.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-3 mb-2">
            {formData.description || "No description provided."}
          </p>
          <div className="text-xs text-gray-500">
            {formData.twitterUsername ? `@${formData.twitterUsername.replace('@', '')}` : "twitter.com"}
          </div>
        </div>
      </div>
    );
  };

  const renderCodePreview = () => {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-md">
        <pre className="whitespace-pre-wrap overflow-x-auto text-sm font-mono">
          {generatedCode || "Your generated meta tags will appear here..."}
        </pre>
      </div>
    );
  };

  const introduction = "Create optimized meta tags for your website to improve SEO and social media sharing.";

  const description = "Our Meta Tag Generator tool simplifies the process of creating properly formatted meta tags for your website, helping to improve your search engine visibility and enhance your content's appearance when shared on social media platforms. By simply entering your page details like title, description, and image URL, this tool automatically generates the necessary HTML code for all essential meta tags, including basic SEO tags, Open Graph tags for Facebook and LinkedIn, and Twitter Card tags. You can customize your selection to include only the specific tag types you need, preview how your content will appear when shared on social platforms, and easily copy or download the generated code for implementation on your website. Whether you're a web developer looking to save time or a website owner without technical expertise, this tool eliminates the complexity of manually writing meta tags and ensures you implement them correctly for maximum SEO benefit and social media visibility.";

  const howToUse = [
    "Enter your page title, description, and other details in the form fields.",
    "Select which types of meta tags you want to include (Basic SEO, Open Graph, Twitter).",
    "Click the 'Generate Meta Tags' button to create your customized meta tags.",
    "Preview how your content will appear when shared on different social platforms.",
    "View the generated HTML code in the code preview tab.",
    "Copy the code to your clipboard or download it as an HTML file.",
    "Paste the generated code into the <head> section of your HTML document."
  ];

  const features = [
    "✅ Generate all essential meta tags in one click",
    "✅ Customize tags for SEO, Open Graph (Facebook), and Twitter Cards",
    "✅ Preview how your content will appear when shared on social media",
    "✅ Copy-ready HTML code for immediate implementation",
    "✅ Download options for easy sharing with your web development team",
    "✅ Proper HTML escaping to prevent syntax errors",
    "✅ Mobile-friendly viewport and character encoding tags included"
  ];

  const faqs = [
    {
      question: "What are meta tags and why are they important for my website?",
      answer: "Meta tags are snippets of HTML code in your website's header that provide metadata about your page to search engines and social media platforms. They're important for several reasons: 1) SEO Impact - While not all meta tags directly influence rankings, elements like title tags and meta descriptions affect how search engines understand your content and can improve click-through rates from search results; 2) Social Media Integration - Open Graph and Twitter Card meta tags control how your content appears when shared on platforms like Facebook, LinkedIn, and Twitter, making your links more engaging and clickable; 3) User Experience - Tags like viewport settings ensure your site displays properly on mobile devices; 4) Site Functionality - Tags for character encoding and language help browsers render your content correctly. Properly implemented meta tags form the foundation of both search engine optimization and social media marketing strategies. They help search engines index your content appropriately while simultaneously making your shared links more visually appealing and informative across various platforms."
    },
    {
      question: "What's the difference between basic meta tags, Open Graph, and Twitter Cards?",
      answer: "These three categories of meta tags serve different purposes in your website's HTML head section: Basic Meta Tags focus primarily on search engine optimization and browser functionality. They include the title tag (which appears in search results and browser tabs), meta description (the snippet shown in search results), meta keywords (less important for modern SEO), viewport settings (for responsive design), robots directives (controlling search indexing), and canonical URLs (preventing duplicate content issues). Open Graph Tags were developed by Facebook but are now used by LinkedIn, Pinterest, and other platforms. They control how your content appears when shared on these networks, defining elements like title, description, image, URL, content type, and site name. They essentially turn your webpage into a rich 'graph object' in social ecosystems. Twitter Cards are Twitter's equivalent to Open Graph, designed specifically for Twitter's interface. While they share some similarities with Open Graph tags, they have Twitter-specific properties like card type (summary, large image, etc.), Twitter handles for attribution, and specific image requirements. For maximum visibility and control across all platforms, it's recommended to implement all three types of meta tags, which is what our generator helps you do automatically."
    },
    {
      question: "How do I implement the generated meta tags on my website?",
      answer: "Implementing meta tags on your website involves a few straightforward steps: 1) Copy the Generated Code - Use the 'Copy to Clipboard' button in our tool to copy all the generated meta tags; 2) Locate Your Website's <head> Section - Open your website's HTML file(s) or access your content management system's (CMS) SEO settings or theme editor; 3) Paste the Code - Place the copied meta tags inside the <head>...</head> section of your HTML, typically near the top before any non-meta content. For specific CMS platforms: In WordPress, you can use plugins like Yoast SEO or RankMath, or edit your theme's header.php file; In Shopify, access the theme's code editor and modify the theme.liquid file; In Wix, use the SEO Settings panel in the dashboard; In Squarespace, use the SEO panel in the page settings. For proper implementation, make sure to: Replace any existing duplicate meta tags rather than adding multiple versions; Keep the <head> section well-organized for future maintenance; Test your implementation using social media debugging tools like Facebook's Sharing Debugger or Twitter's Card Validator to ensure proper display when shared."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Meta Tag Generator</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="block mb-1">Page Title* <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              name="title"
              placeholder="My Awesome Page | Website Name" 
              value={formData.title}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
          </div>
          
          <div>
            <Label htmlFor="description" className="block mb-1">Meta Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="A brief, compelling description of your page content..." 
              value={formData.description}
              onChange={handleInputChange}
              className="h-24"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keywords" className="block mb-1">Keywords</Label>
              <Input 
                id="keywords" 
                name="keywords"
                placeholder="keyword1, keyword2, keyword3" 
                value={formData.keywords}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="author" className="block mb-1">Author</Label>
              <Input 
                id="author" 
                name="author"
                placeholder="Author or Company Name" 
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="url" className="block mb-1">Page URL</Label>
            <Input 
              id="url" 
              name="url"
              placeholder="https://www.example.com/page-url" 
              value={formData.url}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="imageUrl" className="block mb-1">Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl"
              placeholder="https://www.example.com/image.jpg" 
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended size: 1200×630 pixels for optimal social sharing</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName" className="block mb-1">Site Name</Label>
              <Input 
                id="siteName" 
                name="siteName"
                placeholder="Your Website Name" 
                value={formData.siteName}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="twitterUsername" className="block mb-1">Twitter Username</Label>
              <Input 
                id="twitterUsername" 
                name="twitterUsername"
                placeholder="@username" 
                value={formData.twitterUsername}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-3 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium">Meta Tag Options</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="basic" 
                checked={includeBasic} 
                onCheckedChange={(checked) => setIncludeBasic(checked as boolean)} 
              />
              <Label htmlFor="basic" className="cursor-pointer">Basic SEO Tags</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="opengraph" 
                checked={includeOpenGraph} 
                onCheckedChange={(checked) => setIncludeOpenGraph(checked as boolean)} 
              />
              <Label htmlFor="opengraph" className="cursor-pointer">Open Graph Tags (Facebook, LinkedIn)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="twitter" 
                checked={includeTwitter} 
                onCheckedChange={(checked) => setIncludeTwitter(checked as boolean)} 
              />
              <Label htmlFor="twitter" className="cursor-pointer">Twitter Card Tags</Label>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateCode}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <FaMagic className="mr-2" /> Generate Meta Tags
          </Button>
        </div>
        
        <div className="space-y-4">
          <Tabs defaultValue="html" value={activePreviewTab} onValueChange={setActivePreviewTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="html" className="flex items-center">
                <FaCode className="mr-2" /> HTML Code
              </TabsTrigger>
              <TabsTrigger value="facebook" className="flex items-center">
                <FaFacebook className="mr-2" /> Facebook
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center">
                <FaTwitter className="mr-2" /> Twitter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="html" className="space-y-4 mt-4">
              <div className="flex justify-between">
                <h4 className="font-medium">Generated Meta Tags</h4>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!generatedCode}
                  >
                    <FaCopy className="mr-1" /> Copy
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={downloadAsHtml}
                    disabled={!generatedCode}
                  >
                    <FaDownload className="mr-1" /> Download
                  </Button>
                </div>
              </div>
              
              {renderCodePreview()}
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-blue-800">
                    <p><strong>How to use:</strong> Copy these meta tags and paste them in the <code className="bg-blue-100 px-1 rounded">&lt;head&gt;</code> section of your HTML document.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="facebook" className="mt-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium">Facebook / Open Graph Preview</h4>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => formData.title && setActivePreviewTab("html")}
                  disabled={!formData.title}
                >
                  <FaCode className="mr-1" /> View Code
                </Button>
              </div>
              
              {formData.title ? (
                generateFacebookPreview()
              ) : (
                <div className="p-8 bg-gray-50 rounded-md text-center text-gray-500">
                  <FaImage className="mx-auto mb-2 text-3xl" />
                  <p>Enter a title to see preview</p>
                </div>
              )}
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-blue-800">
                    <p><strong>Note:</strong> This is an approximate preview. Actual appearance may vary slightly on different devices and platforms.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="twitter" className="mt-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium">Twitter Card Preview</h4>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => formData.title && setActivePreviewTab("html")}
                  disabled={!formData.title}
                >
                  <FaCode className="mr-1" /> View Code
                </Button>
              </div>
              
              {formData.title ? (
                generateTwitterPreview()
              ) : (
                <div className="p-8 bg-gray-50 rounded-md text-center text-gray-500">
                  <FaImage className="mx-auto mb-2 text-3xl" />
                  <p>Enter a title to see preview</p>
                </div>
              )}
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-blue-800">
                    <p><strong>Note:</strong> This is an approximate preview. Actual appearance may vary slightly on Twitter.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Best Practices for Meta Tags</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>Title:</strong> Keep between 50-60 characters with the most important keywords near the beginning.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>Description:</strong> Use 150-160 characters to provide a compelling summary that encourages clicks.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>Images:</strong> Use high-quality images sized at 1200×630 pixels for optimal display on social platforms.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span><strong>URL:</strong> Always use the canonical URL to prevent duplicate content issues.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="meta-tag-generator-detailed"
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

export default MetaTagGeneratorDetailed;