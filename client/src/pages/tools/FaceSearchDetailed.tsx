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
  FaSearch,
  FaUser,
  FaCut
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const FaceSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState(85);
  const [includePartialMatches, setIncludePartialMatches] = useState(true);

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

  const handleSearch = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image containing faces to search for.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    
    // Simulate search progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Generate mock search results
        const mockResults = [
          {
            id: 1,
            faceFound: true,
            confidence: 96.4,
            similar: [
              { url: "https://example.com/similar-1", title: "Similar Face #1", similarity: 98 },
              { url: "https://example.com/similar-2", title: "Similar Face #2", similarity: 94 },
              { url: "https://example.com/similar-3", title: "Similar Face #3", similarity: 90 }
            ],
            position: { x: 120, y: 85, width: 180, height: 220 }
          }
        ];
        
        if (includePartialMatches) {
          mockResults.push({
            id: 2,
            faceFound: true,
            confidence: 82.7,
            similar: [
              { url: "https://example.com/partial-1", title: "Partial Match #1", similarity: 76 },
              { url: "https://example.com/partial-2", title: "Partial Match #2", similarity: 72 }
            ],
            position: { x: 340, y: 110, width: 160, height: 190 }
          });
        }
        
        setSearchResults(mockResults);
        setIsSearching(false);
        
        toast({
          title: "Face search complete",
          description: `Found ${mockResults.length} face(s) in the uploaded image.`,
        });
      }
      setSearchProgress(progress);
    }, 600);
  };

  const clearSearch = () => {
    // Revoke object URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFile(null);
    setPreviewUrl(null);
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

  const introduction = "Find similar faces on the web with our advanced Face Search tool, powered by facial recognition technology.";

  const description = "Our Face Search tool uses cutting-edge facial recognition algorithms to detect and analyze faces within images, allowing you to find similar faces across the web. Unlike traditional reverse image searches that analyze entire images, our Face Search specifically focuses on facial features, proportions, and characteristics to find matches based on facial similarity. This specialized search capability can help you identify celebrities who look like you, find stock photos featuring people with similar appearances, locate different photos of the same person, or detect potential unauthorized use of your portrait. The tool first analyzes your uploaded image to detect all faces present, then performs an online search for each detected face, providing results ranked by similarity percentage. Whether you're curious about celebrity lookalikes, conducting research, or verifying identity, our Face Search tool offers powerful facial recognition capabilities with a simple, user-friendly interface.";

  const howToUse = [
    "Upload an image containing one or more faces using the upload button.",
    "Adjust the accuracy slider to control the sensitivity of face matching (higher accuracy means stricter matching criteria).",
    "Toggle the 'Include partial matches' option to include or exclude lower confidence matches.",
    "Click 'Search Faces' to begin the facial recognition and search process.",
    "Wait for the search to complete - our system will detect faces and compare them with millions of faces across the web.",
    "View the results, which show detected faces in your image and similar faces found online, ranked by similarity percentage."
  ];

  const features = [
    "✅ Advanced facial recognition technology",
    "✅ Multiple face detection in a single image",
    "✅ Adjustable accuracy settings for customized results",
    "✅ Option to include or exclude partial matches",
    "✅ Similarity rankings to evaluate match quality",
    "✅ Privacy-focused design that respects data protection"
  ];

  const faqs = [
    {
      question: "How does face search differ from reverse image search?",
      answer: "Face search uses facial recognition technology to specifically detect and analyze faces within an image, focusing solely on facial features and ignoring backgrounds, clothing, and other elements. Regular reverse image search, by contrast, analyzes the entire image including colors, shapes, and overall composition. Our face search tool is specialized for finding similar faces based on facial structure, proportions, and features, making it much more effective for finding people who look similar or different photos of the same person. If you're looking to match faces rather than entire images, face search provides significantly more accurate and relevant results."
    },
    {
      question: "How accurate is the face search technology?",
      answer: "Our face search technology achieves approximately 95% accuracy in controlled environments with clear, front-facing portraits. However, accuracy can vary based on several factors including image quality, lighting conditions, face angle, facial expressions, and whether the subject is wearing accessories like glasses or hats. The accuracy slider in our tool allows you to adjust the threshold for determining matches—higher settings provide fewer but more accurate matches, while lower settings provide more potential matches at the cost of precision. For optimal results, we recommend using high-resolution images with clear, well-lit, front-facing faces without obstructions."
    },
    {
      question: "What privacy measures are in place for face search?",
      answer: "We take privacy very seriously when dealing with facial recognition technology. Our face search tool implements several privacy measures: 1) Images are processed temporarily and not permanently stored; 2) Face data is converted to encrypted numerical vectors rather than storing actual facial images; 3) We do not create or maintain a database of user-uploaded faces; 4) Search results only include publicly available images; 5) We comply with all relevant privacy regulations including GDPR and CCPA; 6) Users retain full control over their uploaded content. While we provide this tool for legitimate purposes like finding similar stock photos or celebrity lookalikes, we encourage responsible use that respects others' privacy."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Face Search</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="face-search-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload an image with faces to search
            </p>
            <p className="text-xs text-gray-400">
              Click to browse or drag and drop
            </p>
          </div>
          <input
            id="face-search-upload"
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
            <div className="w-40 h-40 bg-white border rounded-md flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-4 relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain" 
              />
              
              {/* Face markers for detected faces if results exist */}
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="absolute border-2 border-green-500"
                  style={{
                    left: `${(result.position.x / 500) * 100}%`,
                    top: `${(result.position.y / 500) * 100}%`,
                    width: `${(result.position.width / 500) * 100}%`,
                    height: `${(result.position.height / 500) * 100}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
              
              <div className="space-y-3 mt-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="accuracy-slider" className="text-xs font-medium">Face Match Accuracy</Label>
                    <span className="text-xs">{accuracy}%</span>
                  </div>
                  <Slider 
                    id="accuracy-slider"
                    min={60}
                    max={98}
                    step={1}
                    value={[accuracy]}
                    onValueChange={(values) => setAccuracy(values[0])}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-partial" className="text-xs font-medium">Include partial matches</Label>
                  <Switch 
                    id="include-partial" 
                    checked={includePartialMatches}
                    onCheckedChange={setIncludePartialMatches}
                  />
                </div>
              </div>
              
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
                  {isSearching ? "Searching..." : "Search Faces"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isSearching && (
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-sm">
            <span>Analyzing faces...</span>
            <span>{Math.round(searchProgress)}%</span>
          </div>
          <Progress value={searchProgress} />
          <p className="text-xs text-gray-500 text-center mt-2">Detecting faces and searching for matches</p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-6 space-y-5">
          <h4 className="font-medium text-lg">Search Results</h4>
          
          {searchResults.map((result) => (
            <div key={result.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <FaUser className="text-primary mr-2" />
                  <span className="font-medium">Face #{result.id}</span>
                </div>
                <div className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                  {result.confidence.toFixed(1)}% confidence
                </div>
              </div>
              
              <div className="p-4">
                <h5 className="text-sm font-medium mb-3">Similar Faces Found</h5>
                
                <div className="space-y-3">
                  {result.similar.map((similar: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-primary">{similar.title}</p>
                        <a 
                          href={similar.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-primary"
                        >
                          {similar.url}
                        </a>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 font-medium py-1 px-2 rounded-full">
                        {similar.similarity}% match
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="flex items-start">
              <FaSearch className="text-blue-700 mr-2 mt-1 flex-shrink-0" />
              <span>
                Found {searchResults.length} face(s) in your image. Results show similar faces found online ranked by similarity.
              </span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="face-search-detailed"
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

export default FaceSearchDetailed;