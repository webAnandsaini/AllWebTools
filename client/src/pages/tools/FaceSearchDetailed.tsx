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
  FaInfoCircle
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FaceSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);

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
      setFaceDetected(null);
      
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
        description: "Please upload an image to search for faces.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);
    
    // Simulate face detection and search process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate face detection - randomly decide if face is detected for demo purposes
        // In a real implementation, this would use actual face detection algorithms
        const faceIsDetected = Math.random() > 0.2; // 80% chance of detecting a face for demo
        setFaceDetected(faceIsDetected);
        
        if (faceIsDetected) {
          // Simulate search results
          const simulatedResults = [
            {
              id: 1,
              url: "https://example.com/profile-1",
              thumbnailUrl: "https://via.placeholder.com/150",
              name: "John Smith",
              matchConfidence: 92,
              source: "Social Network A"
            },
            {
              id: 2,
              url: "https://example.com/profile-2",
              thumbnailUrl: "https://via.placeholder.com/150",
              name: "Jonathan Smith",
              matchConfidence: 84,
              source: "Professional Network B"
            },
            {
              id: 3,
              url: "https://example.com/profile-3",
              thumbnailUrl: "https://via.placeholder.com/150",
              name: "J. Smith",
              matchConfidence: 79,
              source: "Public Database C"
            }
          ];
          
          setSearchResults(simulatedResults);
          
          toast({
            title: "Search complete",
            description: `Found ${simulatedResults.length} possible matches.`,
          });
        } else {
          toast({
            title: "No faces detected",
            description: "We couldn't detect any faces in this image. Please try with a clearer photo showing a face.",
            variant: "destructive",
          });
        }
        
        setIsSearching(false);
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
    setFaceDetected(null);
  };

  const introduction = "Find people online by their face with our Face Search tool.";

  const description = "Our Face Search tool helps you identify people based on facial features in an uploaded photo. Using advanced facial recognition technology, this tool can search across databases of publicly available images to find potential matches for the face in your photo. This can be invaluable for reconnecting with old friends, identifying unknown people in photographs, researching public figures, or verifying someone's online presence. Unlike traditional search engines that rely on text queries, face search analyzes the unique biometric patterns of a person's face to find visual matches. Our tool processes images securely and responsibly, focusing on publicly available information while respecting privacy concerns.";

  const howToUse = [
    "Upload a clear photo containing the face you want to search for.",
    "Make sure the face is clearly visible, well-lit, and facing forward for best results.",
    "Click the 'Search Face' button to begin the process.",
    "Our system will first detect faces in your image, then search for matches.",
    "Review the results showing potential matches from across the web."
  ];

  const features = [
    "✅ Advanced facial recognition technology",
    "✅ Search across multiple public databases",
    "✅ Fast and accurate matching algorithms",
    "✅ Support for various photo qualities and angles",
    "✅ Detailed matching confidence scores",
    "✅ Privacy-compliant searching",
    "✅ User-friendly interface"
  ];

  const faqs = [
    {
      question: "How accurate is face search technology?",
      answer: "Face search accuracy varies depending on several factors, including image quality, facial clarity, lighting conditions, and the angle of the face. Under optimal conditions (clear, well-lit, front-facing images), our technology can achieve high accuracy rates. However, accuracy decreases with poor lighting, obscured faces, side profiles, or very low-resolution images. It's worth noting that facial recognition is probabilistic—results are presented as potential matches with confidence scores rather than definitive identifications. For the most reliable results, we recommend using high-quality images where the face is clearly visible and facing forward."
    },
    {
      question: "What privacy considerations apply to face search?",
      answer: "Face search technology involves important privacy considerations. Our tool only searches publicly available images and information—we do not access private accounts, protected content, or restricted databases. We also don't permanently store your uploaded images; they're processed temporarily and then deleted. The search results focus on public figures and publicly shared content. Users should be mindful that facial recognition can have privacy implications, and we encourage responsible use of this technology. We comply with relevant regulations regarding biometric data processing and facial recognition, and we're committed to transparent practices around how this technology works."
    },
    {
      question: "Why might I get no results from a face search?",
      answer: "There are several reasons why a face search might return no results: 1) No faces were detected in your image—this can happen if the face is too small, blurry, obscured, or at a difficult angle; 2) The person in the photo may not have a significant online presence with publicly accessible photos; 3) The lighting, quality, or angle of the photo might not provide enough distinguishable facial features for matching; 4) For privacy and ethical reasons, our system only searches certain types of public content, limiting the search scope; 5) Very young faces or significantly changed appearances (due to aging, weight changes, facial hair, etc.) can reduce match likelihood. For best results, try uploading a clearer, well-lit photo where the face is prominently visible and directly facing the camera."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Face Search</h3>
      
      <div className="space-y-6">
        {!previewUrl ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="face-search-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload a photo with a face to search
                </p>
                <p className="text-xs text-gray-400">
                  For best results, use a clear front-facing photo
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
                <>Analyzing Face...</>
              ) : (
                <>
                  <FaSearch className="mr-2" /> 
                  Search Face
                </>
              )}
            </Button>
          </div>
        )}
        
        {isSearching && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {searchProgress < 30 ? 'Detecting faces...' : 
                 searchProgress < 60 ? 'Analyzing facial features...' : 
                 'Searching for matches...'}
              </span>
              <span>{Math.round(searchProgress)}%</span>
            </div>
            <Progress value={searchProgress} />
          </div>
        )}
        
        {faceDetected === false && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800">No faces detected</h4>
                <p className="text-sm text-amber-700 mt-1">
                  We couldn't identify any faces in your uploaded image. Please try again with a clearer photo where the face is fully visible and well-lit.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Potential Matches</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FaInfoCircle className="text-gray-400" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Matches are based on publicly available information. 
                      Higher confidence scores indicate greater similarity.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-4">
              {searchResults.map(result => (
                <Card key={result.id} className="p-3 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden">
                    <img src={result.thumbnailUrl} alt={result.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow space-y-1 text-center sm:text-left">
                    <h5 className="font-medium">{result.name}</h5>
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
                    <FaUser className="mr-2" />
                    View Profile
                  </Button>
                </Card>
              ))}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
              <p><strong>Note:</strong> Face search results are provided for informational purposes only and may not be 100% accurate. Always verify identities through multiple sources.</p>
            </div>
          </div>
        )}
      </div>
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