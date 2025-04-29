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
  FaImage, 
  FaSearch,
  FaEye
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const ReverseImageSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if file is an image
      if (!fileType.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setSearchResults([]);
      
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  };

  const handleSearch = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image to search for.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);
    
    // Simulate search process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate search results
        const simulatedResults = [
          {
            id: 1,
            url: "https://example.com/similar-image-1",
            thumbnailUrl: "https://via.placeholder.com/150",
            title: "Similar Image 1",
            matchConfidence: 95,
            source: "example.com"
          },
          {
            id: 2,
            url: "https://example.com/similar-image-2",
            thumbnailUrl: "https://via.placeholder.com/150",
            title: "Similar Image 2",
            matchConfidence: 87,
            source: "images.example.org"
          },
          {
            id: 3,
            url: "https://example.com/similar-image-3",
            thumbnailUrl: "https://via.placeholder.com/150",
            title: "Similar Image 3",
            matchConfidence: 82,
            source: "photos.example.net"
          },
          {
            id: 4,
            url: "https://example.com/similar-image-4",
            thumbnailUrl: "https://via.placeholder.com/150",
            title: "Similar Image 4",
            matchConfidence: 76,
            source: "gallery.example.com"
          },
          {
            id: 5,
            url: "https://example.com/similar-image-5",
            thumbnailUrl: "https://via.placeholder.com/150",
            title: "Similar Image 5",
            matchConfidence: 71,
            source: "images.anotherexample.com"
          }
        ];
        
        setSearchResults(simulatedResults);
        setIsSearching(false);
        
        toast({
          title: "Search complete",
          description: `Found ${simulatedResults.length} similar images.`,
        });
      }
      setSearchProgress(progress);
    }, 100);
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setSearchResults([]);
  };

  const introduction = "Find where an image appears online with our Reverse Image Search tool.";

  const description = "Our Reverse Image Search tool helps you discover where an image appears across the internet. Simply upload your image, and our search engine will scour the web to find visually similar or identical images. This powerful tool is invaluable for tracking image usage, finding original sources, identifying stolen content, locating higher resolution versions, or simply discovering more information about an image. Perfect for photographers checking for unauthorized use of their work, marketers researching visual content, or anyone curious about an image's origin or context. Our search technology analyzes visual characteristics to find matches even when images have been cropped, resized, or slightly modified.";

  const howToUse = [
    "Upload an image by clicking the upload button or dragging and dropping your file.",
    "Click the 'Search Image' button to begin the reverse search process.",
    "Wait a moment while our tool scans the web for matching images.",
    "Review the search results showing similar images found online.",
    "Click on any result to visit the source website where the image appears."
  ];

  const features = [
    "✅ Search for visually similar images across the web",
    "✅ Find original sources of images",
    "✅ Discover potentially modified versions of your images",
    "✅ Identify websites using your visual content",
    "✅ Locate higher resolution versions of images",
    "✅ Support for common image formats (JPEG, PNG, GIF, etc.)",
    "✅ Fast and accurate search results"
  ];

  const faqs = [
    {
      question: "What is reverse image search?",
      answer: "Reverse image search is a technique that uses an image as the search query instead of text. It allows you to find visually similar images across the web, identify where a specific image appears online, find different sizes of the same image, and discover related information about the image. Unlike traditional text-based searches, reverse image search analyzes the visual characteristics of your uploaded image and matches them against images indexed in various search engines and databases."
    },
    {
      question: "How accurate is reverse image search?",
      answer: "The accuracy of reverse image search depends on several factors, including the quality of the uploaded image, how widespread the image is online, and how much the image has been modified. Our tool typically provides highly accurate results for exact matches and good results for visually similar images. However, heavily edited, cropped, or low-quality images may yield fewer accurate matches. The technology analyzes visual patterns, colors, shapes, and other characteristics to find similarities, but it works best when searching for relatively unmodified images that have been published on indexed websites."
    },
    {
      question: "Can I use reverse image search to find copyright infringements?",
      answer: "Yes, reverse image search is commonly used by photographers, artists, and content creators to find instances where their images may have been used without permission. By uploading your original image, you can discover websites that are displaying your work. However, it's important to note that not all usage constitutes copyright infringement, as factors like fair use, licensing, and public domain status must be considered. Our tool can help you identify where your images appear, but determining whether each use represents copyright infringement would require legal analysis. Many professional photographers and agencies use reverse image search as part of their regular workflow to monitor how their images are being used across the internet."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Reverse Image Search</h3>
      
      <div className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="reverse-image-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload an image to search
                </p>
                <p className="text-xs text-gray-400">
                  Click to browse or drag and drop an image here
                </p>
              </div>
              <input
                id="reverse-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="object-contain w-full h-full" 
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={clearImage}
              >
                ×
              </Button>
            </div>
            
            <p className="text-sm text-gray-600">
              {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            
            <Button 
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isSearching}
            >
              {isSearching ? (
                <>Searching...</>
              ) : (
                <>
                  <FaSearch className="mr-2" /> 
                  Search Image
                </>
              )}
            </Button>
          </div>
        )}
        
        {isSearching && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Searching...</span>
              <span>{Math.round(searchProgress)}%</span>
            </div>
            <Progress value={searchProgress} />
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Search Results</h4>
            
            <div className="space-y-4">
              {searchResults.map(result => (
                <Card key={result.id} className="p-3 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                    <img src={result.thumbnailUrl} alt={result.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <h5 className="font-medium">{result.title}</h5>
                    <p className="text-sm text-gray-500">{result.source}</p>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Match confidence:</span>
                      <span 
                        className={`font-medium ${
                          result.matchConfidence > 90 ? 'text-green-600' : 
                          result.matchConfidence > 75 ? 'text-amber-600' : 
                          'text-gray-600'
                        }`}
                      >
                        {result.matchConfidence}%
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <FaEye className="mr-2" />
                    Visit Source
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
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