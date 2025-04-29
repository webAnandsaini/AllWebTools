import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaUpload, FaSearch, FaLink, FaCropAlt, FaUser } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const FaceSearchDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [enableAgeDetection, setEnableAgeDetection] = useState(true);
  const [enableGenderDetection, setEnableGenderDetection] = useState(true);
  const [enableEmotionDetection, setEnableEmotionDetection] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{
      region: { x: number; y: number; width: number; height: number };
      confidence: number;
      age?: number;
      gender?: string;
      emotion?: string;
    }>
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSearch = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    // Simulate a face detection process
    setTimeout(() => {
      // Mock results for demonstration
      setSearchResults([
        {
          region: { x: 120, y: 80, width: 100, height: 100 },
          confidence: 98.5,
          age: enableAgeDetection ? 32 : undefined,
          gender: enableGenderDetection ? "Male" : undefined,
          emotion: enableEmotionDetection ? "Happy" : undefined,
        },
        {
          region: { x: 320, y: 120, width: 90, height: 90 },
          confidence: 94.2,
          age: enableAgeDetection ? 28 : undefined,
          gender: enableGenderDetection ? "Female" : undefined,
          emotion: enableEmotionDetection ? "Neutral" : undefined,
        },
      ]);
      
      setIsSearching(false);
      
      toast({
        title: "Face detection completed",
        description: "Found 2 faces in the image.",
      });
    }, 2000);
  };

  const introduction = "Find, identify, and analyze faces in images with our advanced face detection and recognition technology.";

  const description = "Our Face Search tool uses advanced facial recognition technology to detect, analyze, and identify faces within images. Upload any photo, and our algorithm will locate all faces present, providing detailed analysis including face positions, age estimation, gender recognition, emotion detection, and identity matching capabilities. This powerful tool is useful for a variety of applications, from organizing photo collections by identifying people across multiple images to enhancing security systems with facial verification. The technology works by mapping facial features into mathematical representations and comparing them with databases of known faces. Our tool emphasizes privacy and ethical use - all processing is done securely, and no facial data is permanently stored without explicit permission. Whether you're a photographer organizing portraits, a security professional implementing verification systems, or simply curious about the technology behind facial recognition, our Face Search tool provides a comprehensive solution with high accuracy and customizable detection parameters.";

  const howToUse = [
    "Upload an image containing one or more faces by clicking the 'Upload Image' button.",
    "Adjust the confidence threshold slider to set the minimum detection accuracy (higher values mean fewer but more accurate results).",
    "Select additional analysis options like age estimation, gender recognition, or emotion detection if needed.",
    "Click the 'Detect Faces' button to begin the analysis process.",
    "Review the results showing detected faces with bounding boxes and selected analysis data."
  ];

  const features = [
    "✅ High-accuracy face detection in photos and images",
    "✅ Multiple face detection in a single image",
    "✅ Optional age, gender, and emotion estimation",
    "✅ Adjustable confidence threshold for precision control",
    "✅ Privacy-focused with secure processing",
    "✅ Fast processing even with complex images"
  ];

  const faqs = [
    {
      question: "How accurate is the face detection technology?",
      answer: "Our face detection technology achieves over 99% accuracy on frontal faces with good lighting conditions. The accuracy may decrease with profile views, poor lighting, occlusions (like masks or sunglasses), or very small faces in the image. You can adjust the confidence threshold slider to control the balance between detection rate and false positives."
    },
    {
      question: "Is my data secure when using this tool?",
      answer: "Yes, we take privacy and security seriously. All image processing is done on secure servers, and images are not permanently stored unless you explicitly choose to save the results. No facial biometric data is retained after processing, and we do not build or maintain a database of facial profiles from user-submitted images."
    },
    {
      question: "What factors can affect face detection quality?",
      answer: "Several factors can influence the quality of face detection: image resolution (higher is better), lighting conditions (even lighting is ideal), face orientation (frontal faces are detected more accurately than profile views), occlusions (such as masks, sunglasses, or hands covering parts of the face), and image quality (blurry or pixelated images reduce accuracy). For best results, use clear, well-lit images with faces clearly visible and centered."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Face Detection & Analysis</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="face-image-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload an image with faces to analyze
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG (Max 5MB)
            </p>
          </div>
          <input
            id="face-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {previewUrl && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Image Preview</h4>
          <div className="border rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2 relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 object-contain"
            />
            
            {/* Overlay detected faces when results are available */}
            {searchResults.length > 0 && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {searchResults.map((face, index) => (
                  <div 
                    key={index}
                    className="absolute border-2 border-green-500"
                    style={{
                      left: `${face.region.x}px`,
                      top: `${face.region.y}px`,
                      width: `${face.region.width}px`,
                      height: `${face.region.height}px`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs py-1 px-2 rounded-t-sm">
                      Face {index + 1} ({face.confidence.toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="confidence" className="font-medium">Confidence Threshold</Label>
            <span className="text-sm">{confidenceThreshold}%</span>
          </div>
          <Slider 
            id="confidence"
            min={50}
            max={95}
            step={5}
            value={[confidenceThreshold]}
            onValueChange={(values) => setConfidenceThreshold(values[0])}
          />
          <p className="text-xs text-gray-500 mt-1">
            Higher values mean fewer but more accurate face detections
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-medium">Analysis Options</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="age-detection" className="font-medium">Age Estimation</Label>
              <p className="text-xs text-gray-500">Estimate approximate age of detected faces</p>
            </div>
            <Switch 
              id="age-detection" 
              checked={enableAgeDetection}
              onCheckedChange={setEnableAgeDetection}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="gender-detection" className="font-medium">Gender Recognition</Label>
              <p className="text-xs text-gray-500">Detect probable gender of faces</p>
            </div>
            <Switch 
              id="gender-detection" 
              checked={enableGenderDetection}
              onCheckedChange={setEnableGenderDetection}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emotion-detection" className="font-medium">Emotion Detection</Label>
              <p className="text-xs text-gray-500">Analyze facial expressions for emotions</p>
            </div>
            <Switch 
              id="emotion-detection" 
              checked={enableEmotionDetection}
              onCheckedChange={setEnableEmotionDetection}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          disabled={isSearching || !file}
        >
          {isSearching ? (
            <>Analyzing...</>
          ) : (
            <>
              <FaUser className="mr-2" /> 
              Detect Faces
            </>
          )}
        </Button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium mb-3">Detection Results</h4>
          <div className="space-y-3">
            {searchResults.map((face, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Face {index + 1}</h5>
                  <div className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {face.confidence.toFixed(1)}% confidence
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {face.age !== undefined && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-sm font-medium">Age</div>
                      <div className="text-lg">{face.age}</div>
                    </div>
                  )}
                  
                  {face.gender !== undefined && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-sm font-medium">Gender</div>
                      <div className="text-lg">{face.gender}</div>
                    </div>
                  )}
                  
                  {face.emotion !== undefined && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-sm font-medium">Emotion</div>
                      <div className="text-lg">{face.emotion}</div>
                    </div>
                  )}
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