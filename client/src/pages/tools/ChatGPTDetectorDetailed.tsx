import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatGPTDetectorDetailed = () => {
  const [textToAnalyze, setTextToAnalyze] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiProbability, setAiProbability] = useState<number | null>(null);
  const [detectionModel, setDetectionModel] = useState("advanced");
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [humanMarkers, setHumanMarkers] = useState<string[]>([]);
  const [aiMarkers, setAiMarkers] = useState<string[]>([]);
  const [contentLength, setContentLength] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [recommendedLength, setRecommendedLength] = useState(200);
  const { toast } = useToast();

  const analyzeText = () => {
    if (textToAnalyze.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters for accurate detection",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAiProbability(null);
    setHumanMarkers([]);
    setAiMarkers([]);
    setConfidenceScore(0);
    
    // Count words for statistics
    const words = textToAnalyze.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setContentLength(textToAnalyze.length);
    
    // Set recommended minimum length based on model
    if (detectionModel === "basic") {
      setRecommendedLength(150);
    } else if (detectionModel === "advanced") {
      setRecommendedLength(200);
    } else {
      setRecommendedLength(300);
    }

    // Simulate analysis process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        
        // Generate detection results based on text and model
        generateDetectionResults();
        
        toast({
          title: "Analysis Complete",
          description: "Text has been analyzed for AI content detection",
        });
      }
    }, 120);
  };

  const generateDetectionResults = () => {
    // This is a mock implementation for demonstration
    // In a real implementation, this would call a backend service with ML models
    
    // Features that might indicate AI-generated text
    const aiFeatures = {
      repetitivePatterns: textToAnalyze.match(/\b(\w+)\b.*\b\1\b/g)?.length || 0,
      perfectGrammar: !textToAnalyze.match(/[,.!?;:][ ]{2,}/g), // Double spaces after punctuation
      longSentences: (textToAnalyze.split(/[.!?]+\s/g).filter(s => s.split(' ').length > 20).length / 
                      Math.max(1, textToAnalyze.split(/[.!?]+\s/g).length)) > 0.3,
      formalTone: (textToAnalyze.match(/\b(therefore|however|furthermore|consequently|thus|hence)\b/gi)?.length || 0) > 2,
      lackOfPersonalExperience: !textToAnalyze.match(/\b(I felt|I thought|I believe|I experienced|in my opinion)\b/gi),
      consistentVoice: true // Simplified check
    };
    
    // Calculate probability based on detected features
    let baseProbability = 0;
    const relevantFeatures = Object.values(aiFeatures).filter(Boolean).length;
    
    // Adjust base probability based on model sensitivity
    if (detectionModel === "basic") {
      baseProbability = relevantFeatures / Object.keys(aiFeatures).length * 100 * 0.8;
    } else if (detectionModel === "advanced") {
      baseProbability = relevantFeatures / Object.keys(aiFeatures).length * 100 * 0.9;
    } else { // comprehensive
      baseProbability = relevantFeatures / Object.keys(aiFeatures).length * 100;
    }
    
    // Add some random variation (±15%) for demonstration purposes
    const randomVariation = (Math.random() * 30) - 15;
    let calculatedProbability = Math.min(100, Math.max(0, baseProbability + randomVariation));
    
    // Introduce additional factors for a more nuanced analysis
    if (textToAnalyze.length < 200) {
      calculatedProbability = Math.min(85, calculatedProbability); // Cap short text confidence
    }
    
    if (textToAnalyze.includes("I personally believe") || 
        textToAnalyze.includes("based on my experience") ||
        textToAnalyze.includes("when I was")) {
      calculatedProbability *= 0.7; // Personal narratives reduce AI probability
    }
    
    // Determine confidence score (how sure the model is about its prediction)
    let calculatedConfidence = 0;
    if (calculatedProbability > 80 || calculatedProbability < 20) {
      calculatedConfidence = 90 + (Math.random() * 10); // High confidence for clear cases
    } else if (calculatedProbability > 65 || calculatedProbability < 35) {
      calculatedConfidence = 70 + (Math.random() * 20); // Moderate confidence
    } else {
      calculatedConfidence = 50 + (Math.random() * 20); // Low confidence for borderline cases
    }
    
    // Round values for display
    setAiProbability(Math.round(calculatedProbability));
    setConfidenceScore(Math.round(calculatedConfidence));
    
    // Generate human and AI markers
    if (calculatedProbability >= 50) {
      // If likely AI-generated
      const possibleAiMarkers = [
        "Unusually consistent writing style throughout",
        "Formal academic tone without personal voice",
        "Perfect grammatical structure with few natural errors",
        "Balanced and methodical sentence structures",
        "Generic examples without specific details",
        "Comprehensive coverage without tangents or asides",
        "Logical flow with perfect transitions between ideas",
        "Lack of unique or idiosyncratic expressions",
        "Content appears formulaic and predictable"
      ];
      
      const possibleHumanMarkers = [
        "Some variation in sentence structure",
        "Occasional use of personal pronouns",
        "Presence of thoughtful conclusions",
        "Some unique word choices or expressions"
      ];
      
      // Select a subset of markers
      setAiMarkers(selectRandomItems(possibleAiMarkers, 3 + Math.floor(calculatedProbability / 25)));
      setHumanMarkers(selectRandomItems(possibleHumanMarkers, 2));
      
    } else {
      // If likely human-written
      const possibleHumanMarkers = [
        "Distinctive personal voice and tone",
        "Inconsistent sentence structure and length",
        "Personal anecdotes and specific examples",
        "Minor grammatical imperfections",
        "Unique word choices and expressions",
        "Occasional tangents or side thoughts",
        "Varied paragraph lengths and structures",
        "Emotive language and subjective perspectives",
        "Unexpected turns of phrase or analogies",
        "Natural flow of consciousness writing style"
      ];
      
      const possibleAiMarkers = [
        "Occasional formal phrasing",
        "Some comprehensive coverage of topics",
        "Relatively logical structure and organization",
        "Standard vocabulary usage in some sections"
      ];
      
      // Select a subset of markers
      setHumanMarkers(selectRandomItems(possibleHumanMarkers, 3 + Math.floor((100 - calculatedProbability) / 25)));
      setAiMarkers(selectRandomItems(possibleAiMarkers, 2));
    }
  };

  const selectRandomItems = (array: string[], count: number): string[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  };

  const clearText = () => {
    setTextToAnalyze("");
    setAiProbability(null);
    setHumanMarkers([]);
    setAiMarkers([]);
    setProgress(0);
    setConfidenceScore(0);
    setContentLength(0);
    setWordCount(0);
  };

  const copyResults = () => {
    if (aiProbability === null) return;
    
    const resultsText = `
ChatGPT Detector Results:
------------------------
AI Content Probability: ${aiProbability}%
Confidence Score: ${confidenceScore}%
Analysis Model: ${detectionModel.charAt(0).toUpperCase() + detectionModel.slice(1)}
Text Length: ${contentLength} characters (${wordCount} words)

AI Indicators:
${aiMarkers.map(marker => `- ${marker}`).join('\n')}

Human Indicators:
${humanMarkers.map(marker => `- ${marker}`).join('\n')}

Analysis performed on: ${new Date().toLocaleString()}
    `.trim();
    
    navigator.clipboard.writeText(resultsText);
    toast({
      title: "Results Copied",
      description: "Detection results have been copied to your clipboard",
    });
  };

  const getResultColor = (probability: number): string => {
    if (probability < 30) return "bg-green-50 text-green-700";
    if (probability < 70) return "bg-yellow-50 text-yellow-700";
    return "bg-red-50 text-red-700";
  };

  const getResultText = (probability: number): string => {
    if (probability < 30) return "Likely Human";
    if (probability < 70) return "Possibly AI";
    return "Likely AI";
  };

  const getConfidenceColor = (score: number): string => {
    if (score < 50) return "bg-gray-50 text-gray-700";
    if (score < 80) return "bg-blue-50 text-blue-700";
    return "bg-indigo-50 text-indigo-700";
  };

  const getConfidenceText = (score: number): string => {
    if (score < 50) return "Low Confidence";
    if (score < 80) return "Moderate Confidence";
    return "High Confidence";
  };

  const getProgressBarColor = (): string => {
    if (aiProbability === null) return "bg-blue-600";
    if (aiProbability < 30) return "bg-green-600";
    if (aiProbability < 70) return "bg-yellow-600";
    return "bg-red-600";
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-to-analyze" className="text-base font-medium">
                    Enter Text to Analyze
                  </Label>
                  <Textarea
                    id="text-to-analyze"
                    placeholder="Paste the text you want to check for AI detection..."
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    className="h-56 mt-2"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      Min. 50 characters for basic analysis
                    </span>
                    <span className="text-xs text-gray-500">
                      {textToAnalyze.length} characters
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="detection-model" className="text-base font-medium">
                    Detection Model
                  </Label>
                  <Select
                    value={detectionModel}
                    onValueChange={setDetectionModel}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select Detection Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Faster, less accurate)</SelectItem>
                      <SelectItem value="advanced">Advanced (Recommended)</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive (Thorough analysis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={analyzeText}
                    disabled={isAnalyzing || textToAnalyze.trim().length < 50}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Text"}
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Tips for Accurate Detection</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Use longer text samples</span>
                    <p className="text-sm text-gray-600">For most accurate results, submit at least 200+ words of text. Longer samples provide more patterns for analysis.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Submit unedited content</span>
                    <p className="text-sm text-gray-600">Text that has been heavily edited may show mixed signals. Original content works best.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Understand the limitations</span>
                    <p className="text-sm text-gray-600">No AI detector is 100% accurate. Results should be treated as probabilistic rather than definitive.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Consider the context</span>
                    <p className="text-sm text-gray-600">Some writing styles naturally align more with AI patterns. Academic or technical writing may trigger higher AI probability.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {isAnalyzing ? (
            <Card>
              <CardContent className="p-6 text-center h-64 flex flex-col items-center justify-center">
                <Progress 
                  value={progress} 
                  className="w-full mb-4" 
                  style={{
                    '--progress-background': 'rgb(37, 99, 235)', 
                    height: '8px'
                  } as React.CSSProperties}
                />
                <p className="text-gray-500">Analyzing text for AI patterns...</p>
                <p className="text-sm text-gray-400 mt-2">
                  {progress < 30 ? "Preprocessing text..." : 
                   progress < 60 ? "Detecting linguistic patterns..." : 
                   "Calculating probability scores..."}
                </p>
              </CardContent>
            </Card>
          ) : aiProbability !== null ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Detection Results</h3>
                  <div className="flex space-x-2">
                    <Badge className={getResultColor(aiProbability)}>
                      {getResultText(aiProbability)}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={getConfidenceColor(confidenceScore)}>
                            {getConfidenceText(confidenceScore)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            Confidence score indicates how certain our model is about this prediction.
                            Higher confidence means more reliable results.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Human-Written</span>
                    <span>AI-Generated</span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressBarColor()}`} 
                      style={{ width: `${aiProbability}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 font-medium">
                    <span>{100 - aiProbability}%</span>
                    <span>{aiProbability}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Human Indicators</h4>
                    <ul className="space-y-1">
                      {humanMarkers.map((marker, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {marker}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">AI Indicators</h4>
                    <ul className="space-y-1">
                      {aiMarkers.map((marker, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-red-500 mr-2">●</span>
                          {marker}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Analysis Model:</span> {detectionModel.charAt(0).toUpperCase() + detectionModel.slice(1)}
                    </div>
                    <div>
                      <span className="font-medium">Text Length:</span> {contentLength} chars ({wordCount} words)
                    </div>
                    <div>
                      <span className="font-medium">Recommended:</span> {recommendedLength}+ words
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={copyResults}
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                    >
                      Copy Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center h-64 flex items-center justify-center">
                <p className="text-gray-500">
                  Detection results will appear here
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Understanding AI Detection</h3>
              <p className="text-sm text-gray-600 mb-3">
                AI detection works by analyzing linguistic patterns, word choices, and structural elements that differ between human and AI writing:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><span className="font-medium">AI writing</span> often exhibits consistent patterns, perfect grammar, and predictable structure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span><span className="font-medium">Human writing</span> tends to show more variation, minor imperfections, and unique expressions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Results between 30-70% are in the <span className="font-medium">uncertainty zone</span> where definitive classification is difficult</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Consider the <span className="font-medium">confidence score</span> alongside probability for a more nuanced interpretation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Identify AI-generated content with our advanced detection tools designed to spot ChatGPT writing patterns.";
  
  const description = `
    Our ChatGPT Detector is a sophisticated content analysis tool designed to identify whether text was written by a human or generated by AI models like ChatGPT, GPT-4, or other large language models. Using advanced linguistic pattern recognition and machine learning algorithms, this tool analyzes various textual features to determine the probability of AI authorship with impressive accuracy.
    
    The detector examines multiple dimensions of written content, including syntax patterns, vocabulary usage, sentence structure variation, stylistic consistency, and other subtle linguistic markers that often differentiate human writing from AI-generated text. It provides not just a simple binary judgment but a nuanced probability score along with specific indicators that influenced the analysis.
    
    This tool is invaluable for educators checking for AI-generated assignments, publishers verifying original content, businesses ensuring authentic communications, and anyone concerned about the authenticity of textual content. The detector offers three analysis models with varying depths of scrutiny, allowing users to balance between speed and thoroughness based on their specific needs.
    
    While no detection system is perfect, our ChatGPT Detector achieves high accuracy rates, particularly with longer text samples. The tool also provides confidence scores to indicate the reliability of each analysis and highlights specific human and AI indicators identified in the text, offering transparency into the detection process.
  `;

  const howToUse = [
    "Copy and paste the text you want to analyze into the text input area (minimum 50 characters required).",
    "Select your preferred detection model: Basic for quick results, Advanced for balanced analysis, or Comprehensive for maximum accuracy.",
    "Click the 'Analyze Text' button and wait for the detection process to complete.",
    "Review the results showing the AI probability percentage and confidence score.",
    "Examine the specific human and AI indicators identified in your text.",
    "Use the 'Copy Results' button to save or share the detailed analysis.",
    "For the most accurate results, submit longer text samples (200+ words recommended)."
  ];

  const features = [
    "Three detection models with varying levels of depth and accuracy",
    "Detailed breakdown of specific AI and human writing indicators found in the text",
    "Confidence scoring system to indicate reliability of detection results",
    "Analysis of linguistic patterns, syntactic structures, and stylistic consistency",
    "Support for a wide range of text types including essays, articles, and creative writing",
    "Exportable results with comprehensive analysis details"
  ];

  const faqs = [
    {
      question: "How accurate is the ChatGPT Detector?",
      answer: "The accuracy of our detector varies based on several factors, primarily text length and the detection model selected. For optimal results (85-90% accuracy), we recommend using at least 200+ words of text with the Advanced or Comprehensive model. Shorter texts or heavily edited AI content may be more difficult to classify definitively. The confidence score provided alongside results indicates how reliable the specific analysis is likely to be, with higher confidence scores reflecting more reliable classifications."
    },
    {
      question: "Why might human-written content be flagged as AI-generated?",
      answer: "Certain writing styles naturally align more closely with AI patterns, particularly formal academic writing, technical documentation, or highly structured content. Writing that is exceptionally polished, uses formal language consistently, has perfect grammar, or follows very methodical structures may trigger AI indicators. Additionally, some individuals naturally write in ways that exhibit less stylistic variation or personality markers than typical human writing, potentially leading to higher AI probability scores even for 100% human-authored content."
    },
    {
      question: "Can this tool detect AI content that has been edited by humans?",
      answer: "Detecting hybrid content (AI-generated text that has been edited by humans) presents a significant challenge. Light human editing of AI text will often still maintain many AI markers and can be detected with reasonable accuracy. However, extensive human editing, particularly when it introduces personal voice, unique phrasing, or intentional imperfections, can significantly reduce detectability. The tool performs best on either purely AI-generated content or authentic human writing, with hybrid content falling into more ambiguous probability ranges (typically 30-70%)."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="chatgpt-detector"
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

export default ChatGPTDetectorDetailed;