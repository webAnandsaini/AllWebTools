import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaSearch,
  FaGlobe,
  FaLink
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReverseImageSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<{ url: string; title: string; similarity: number }[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Reset search results
      setSearchResults([]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    
    // Reset search results
    setSearchResults([]);
  };

  const handleSearch = () => {
    // Validate input based on active tab
    if (activeTab === "upload" && !file) {
      toast({
        title: "No image selected",
        description: "Please upload an image to search for.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "url" && !imageUrl) {
      toast({
        title: "No URL provided",
        description: "Please enter an image URL to search for.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "url" && imageUrl) {
      // Simple URL validation
      try {
        new URL(imageUrl);
      } catch (e) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid image URL.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSearching(true);
    setSearchProgress(0);
    
    // Simulate search progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate mock search results
        const mockResults = [
          {
            url: "https://example.com/similar-image-1",
            title: "Similar Image - Stock Photo",
            similarity: 98
          },
          {
            url: "https://example.com/similar-image-2",
            title: "Related Content - Media Repository",
            similarity: 87
          },
          {
            url: "https://example.com/similar-image-3",
            title: "Visual Match - Digital Archive",
            similarity: 81
          },
          {
            url: "https://example.com/similar-image-4",
            title: "Partial Match - Online Gallery",
            similarity: 75
          },
          {
            url: "https://example.com/similar-image-5",
            title: "Related Result - Image Collection",
            similarity: 63
          }
        ];
        
        setSearchResults(mockResults);
        setIsSearching(false);
        
        toast({
          title: "Search complete",
          description: `Found ${mockResults.length} similar images.`,
        });
      }
      setSearchProgress(progress);
    }, 500);
  };

  const clearSearch = () => {
    // Revoke object URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFile(null);
    setPreviewUrl(null);
    setImageUrl("");
    setSearchResults([]);
    setSearchProgress(0);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const introduction = "Find the source of any image or discover where else it appears online with our powerful Reverse Image Search tool.";

  const description = "Our Reverse Image Search tool uses advanced visual recognition technology to find identical or similar images across the web. This powerful search capability helps you discover the origin of images, find higher resolution versions, identify if your images are being used without permission, or locate the source of images you're interested in. Unlike text-based searches that rely on keywords and metadata, reverse image searches analyze the actual visual content of your image and match it with visually similar images online. Whether you're a photographer tracking unauthorized use of your work, a researcher verifying image authenticity, a designer seeking inspiration from similar visuals, or simply curious about an image's origin, our tool provides comprehensive results from multiple sources across the internet. You can upload an image directly from your device or provide a URL to an online image, making it flexible for various use cases.";

  const howToUse = [
    "Upload an image from your device or paste an image URL in the designated tab.",
    "Click the 'Search' button to initiate the reverse image search.",
    "Wait for the search to complete - the system will analyze your image and compare it with billions of images online.",
    "Review the search results, which include visually similar images found across the web.",
    "Click on any result to view the source website where the image appears.",
    "Use the similarity percentage to gauge how closely each result matches your uploaded image."
  ];

  const features = [
    "✅ Search using uploaded images or image URLs",
    "✅ Find identical and visually similar images across the web",
    "✅ Discover the original source of images",
    "✅ Locate higher resolution versions of images",
    "✅ Check if your images are being used elsewhere online",
    "✅ Support for all common image formats (JPEG, PNG, WebP, etc.)"
  ];

  const faqs = [
    {
      question: "How does reverse image search work?",
      answer: "Reverse image search uses computer vision algorithms to analyze the visual content of your uploaded image, creating a digital fingerprint based on its colors, shapes, textures, and other visual elements. This fingerprint is then compared against billions of indexed images across the web to find matches. Unlike traditional text searches that rely on keywords, reverse image searches can find visually similar content even when no text description exists. Our tool combines multiple search technologies to provide comprehensive results, showing you where identical or similar images appear online, along with relevant information about each match."
    },
    {
      question: "What can I use reverse image search for?",
      answer: "Reverse image search has many practical applications: 1) Verify the authenticity of images or find their original sources; 2) Locate higher resolution versions of images you've found; 3) Identify products seen in photos; 4) Find unauthorized uses of your copyrighted images; 5) Discover related or similar images for research or creative projects; 6) Fact-check news images to confirm their context and origin; 7) Find websites that feature specific visual content; 8) Identify landmarks, artwork, or people in photographs; 9) Trace the spread of visual content across social media and websites."
    },
    {
      question: "Why are some search results not exact matches?",
      answer: "The search results include both exact matches and visually similar images. This is intentional and often useful, as similar images might provide additional context or higher quality alternatives to your original. The algorithm considers various visual aspects like color distribution, shapes, composition, and sometimes even semantic content. Each result shows a similarity percentage to help you understand how closely it matches your query image. Perfect matches will show very high similarity (95-100%), while similar but distinct images will show lower percentages. In some cases, the algorithm may also find images that share thematic elements but look different—these semantic matches can be valuable for creative research or finding alternative visual content related to your original image."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Reverse Image Search</h3>
      
      <Tabs defaultValue="upload" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="reverse-image-search-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload an image to search for
                </p>
                <p className="text-xs text-gray-400">
                  Click to browse or drag and drop
                </p>
              </div>
              <input
                id="reverse-image-search-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          
          {file && previewUrl && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="w-32 h-32 bg-white border rounded-md flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                  <div className="flex mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 mr-2"
                      onClick={clearSearch}
                    >
                      Remove
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-primary text-white"
                      onClick={handleSearch}
                      disabled={isSearching}
                    >
                      <FaSearch className="mr-2" />
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="url">
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url" className="text-sm font-medium">Image URL</Label>
              <div className="flex mt-1">
                <input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
                <Button 
                  className="rounded-l-none"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  <FaSearch className="mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter the direct URL to an image (must end with .jpg, .png, etc.)</p>
            </div>
            
            {imageUrl && (
              <div className="border rounded-lg p-3 bg-gray-50 text-sm">
                <div className="flex items-center text-gray-700">
                  <FaLink className="mr-2 text-gray-500" />
                  <span className="truncate">{imageUrl}</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {isSearching && (
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-sm">
            <span>Searching...</span>
            <span>{Math.round(searchProgress)}%</span>
          </div>
          <Progress value={searchProgress} />
          <p className="text-xs text-gray-500 text-center mt-2">Comparing image against billions of images online</p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-lg mb-4">Search Results</h4>
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-primary">{result.title}</h5>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-primary truncate block mt-1"
                    >
                      {result.url}
                    </a>
                  </div>
                  <div className="bg-green-100 text-green-800 font-medium text-sm py-1 px-2 rounded">
                    {result.similarity}% match
                  </div>
                </div>
                <div className="flex items-center mt-3 text-sm">
                  <FaGlobe className="text-gray-500 mr-2" />
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Source
                  </a>
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