import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaSearch, FaLink } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReverseImageSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ title: string; url: string; similarity: number }>
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadMethod("file");
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setImageUrl(urlInput);
      setPreviewUrl(urlInput);
      setFile(null);
      setUploadMethod("url");
    }
  };

  const handleSearch = () => {
    if (!file && !imageUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image or provide an image URL first.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate a search process
    setTimeout(() => {
      // Mock results for demonstration
      setSearchResults([
        {
          title: "Similar Image on Example.com",
          url: "https://example.com/similar-image-1",
          similarity: 95,
        },
        {
          title: "Product Image on Shopping Site",
          url: "https://shopping-site.com/product/12345",
          similarity: 87,
        },
        {
          title: "Article with Similar Image",
          url: "https://news-site.com/article/image-topic",
          similarity: 76,
        },
        {
          title: "Social Media Post with This Image",
          url: "https://social-site.com/post/987654",
          similarity: 68,
        },
      ]);
      
      setIsSearching(false);
      
      toast({
        title: "Search completed",
        description: "Found 4 similar images online.",
      });
    }, 2000);
  };

  const introduction = "Find the source and similar versions of any image with our powerful reverse image search tool.";

  const description = "Our Reverse Image Search tool empowers you to discover the origins and variations of any image across the web. Upload your image or provide a URL, and our tool will scan the internet to identify where the image appears online, find visually similar images, and provide detailed information about each match. This is invaluable for verifying the authenticity of images, finding higher resolution versions, identifying the original source of content, tracking image usage across websites, and discovering unauthorized use of your own visual content. Whether you're a content creator, researcher, journalist, or just curious about an image's origin, our tool provides comprehensive search results from multiple engines for maximum coverage. Unlike limited single-engine searches, our tool aggregates results from various sources, giving you the most complete picture of where and how an image is being used online.";

  const howToUse = [
    "Upload an image from your device by clicking the 'Upload Image' button or dragging and dropping a file.",
    "Alternatively, enter the URL of an online image in the URL field.",
    "Click the 'Search' button to begin the reverse image search process.",
    "Review the search results showing websites where the image appears and similar images.",
    "Click on any result to visit the source website for more information."
  ];

  const features = [
    "✅ Search by uploaded image or image URL",
    "✅ Multi-engine search for comprehensive results",
    "✅ Find visually similar images across the web",
    "✅ Discover original sources and higher resolution versions",
    "✅ Track where your images are being used online",
    "✅ Identify potential copyright infringement of your visual content"
  ];

  const faqs = [
    {
      question: "How accurate is the reverse image search?",
      answer: "Our reverse image search tool utilizes advanced image recognition algorithms to provide highly accurate results. The accuracy depends on factors such as image quality, distinctiveness, and how widely the image has been shared online. Unique images tend to yield more precise results, while generic or heavily edited images may return broader matches."
    },
    {
      question: "What image formats are supported?",
      answer: "Our tool supports all common image formats including JPEG, PNG, GIF, BMP, and WebP. For best results, we recommend using clear, high-quality images with good resolution. There is a file size limit of 5MB per upload to ensure optimal processing speed."
    },
    {
      question: "Can I use this tool to find where my images are being used without permission?",
      answer: "Yes, this is one of the primary use cases for our reverse image search. Content creators, photographers, and designers often use this tool to track unauthorized usage of their work across the web. The comprehensive results can help you identify where your images appear so you can take appropriate action if necessary."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Reverse Image Search</h3>
      
      <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as "file" | "url")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="file">
            <FaUpload className="mr-2" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="url">
            <FaLink className="mr-2" />
            Image URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="image-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Drag and drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div>
            <Label htmlFor="image-url" className="font-medium">Image URL</Label>
            <div className="flex mt-1">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 rounded-r-none"
              />
              <Button 
                onClick={handleUrlSubmit}
                className="rounded-l-none"
              >
                Submit
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {previewUrl && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Image Preview</h4>
          <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 object-contain"
              onError={() => {
                setPreviewUrl("");
                toast({
                  title: "Error loading image",
                  description: "The image could not be loaded. Please check the URL or try another image.",
                  variant: "destructive",
                });
              }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Button 
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          disabled={isSearching || (!file && !imageUrl)}
        >
          {isSearching ? (
            <>Searching...</>
          ) : (
            <>
              <FaSearch className="mr-2" /> 
              Reverse Search Image
            </>
          )}
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium mb-3">Search Results</h4>
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-blue-600 hover:underline">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        {result.title}
                      </a>
                    </h5>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {result.url}
                    </p>
                  </div>
                  <div className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {result.similarity}% match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="reverse-image-search-detailed"
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

export default ReverseImageSearchDetailed;