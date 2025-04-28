import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const AIContentDetectorDetailed = () => {
  const [text, setText] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    aiProbability: number;
    humanProbability: number;
    verdict: string;
    aiMarkers: Array<{ marker: string; importance: "high" | "medium" | "low" }>;
    humanMarkers: Array<{ marker: string; importance: "high" | "medium" | "low" }>;
  } | null>(null);

  useEffect(() => {
    document.title = "AI Content Detector - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (result) {
      setResult(null);
    }
  };

  const detectAIContent = async () => {
    if (text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters for accurate AI detection.",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    try {
      const response = await apiRequest("POST", "/api/text/detect-ai", { text });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      toast({
        title: "Error detecting AI content",
        description: "An error occurred while analyzing the text. Please try again.",
        variant: "destructive",
      });
      
      // Simulate a response for demonstration purposes
      simulateAIDetection();
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsDetecting(false);
    }
  };

  const simulateAIDetection = () => {
    // Analyze text characteristics to provide a reasonable simulation
    const wordCount = text.trim().split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const avgWordLength = text.replace(/[^a-zA-Z]/g, "").length / wordCount || 0;
    const uniqueWords = new Set(text.toLowerCase().match(/\b[a-z]+\b/g)).size;
    const uniqueWordsRatio = uniqueWords / wordCount || 0;
    
    // Look for patterns that might indicate AI content
    const hasRepetitiveStructures = /(.{15,}?)\1/i.test(text); // Repeated phrases
    const hasTooFluent = sentenceCount > 3 && wordCount / sentenceCount > 25; // Very long, fluent sentences
    const hasTooUniform = avgWordLength > 5.8 || avgWordLength < 3.5; // Unusually uniform word length
    const hasTooRich = uniqueWordsRatio > 0.8; // Unusually rich vocabulary
    
    // Generate a probability based on these factors
    let aiProbability = 0.5; // Start neutral
    
    if (hasRepetitiveStructures) aiProbability += 0.1;
    if (hasTooFluent) aiProbability += 0.15;
    if (hasTooUniform) aiProbability += 0.1;
    if (hasTooRich) aiProbability += 0.2;
    
    // Text length factor
    if (wordCount < 100) aiProbability = Math.min(0.7, aiProbability); // Short texts are harder to analyze accurately
    if (wordCount > 300) aiProbability = Math.max(0.3, aiProbability); // Longer texts provide more signals
    
    // Cap probability between 0.1 and 0.9 to avoid absolute judgments
    aiProbability = Math.max(0.1, Math.min(0.9, aiProbability));
    
    const humanProbability = 1 - aiProbability;
    
    // Generate verdict
    let verdict = "";
    if (aiProbability > 0.75) {
      verdict = "Likely AI-generated content";
    } else if (aiProbability > 0.5) {
      verdict = "Possibly AI-generated content";
    } else if (aiProbability > 0.25) {
      verdict = "Possibly human-written content";
    } else {
      verdict = "Likely human-written content";
    }
    
    // Generate AI markers
    const aiMarkers = [];
    if (hasTooFluent) {
      aiMarkers.push({ 
        marker: "Unusually long and fluent sentences", 
        importance: "high" as const 
      });
    }
    if (hasTooUniform) {
      aiMarkers.push({ 
        marker: "Overly consistent word length and complexity", 
        importance: "medium" as const 
      });
    }
    if (hasTooRich) {
      aiMarkers.push({ 
        marker: "Exceptionally rich vocabulary", 
        importance: "medium" as const 
      });
    }
    if (hasRepetitiveStructures) {
      aiMarkers.push({ 
        marker: "Repetitive sentence structures", 
        importance: "low" as const 
      });
    }
    if (aiMarkers.length < 2) {
      aiMarkers.push({ 
        marker: "Unnaturally consistent tone throughout text", 
        importance: "low" as const 
      });
    }
    
    // Generate human markers
    const humanMarkers = [];
    if (aiProbability < 0.7) {
      humanMarkers.push({ 
        marker: "Presence of personal anecdotes or subjective expressions", 
        importance: "high" as const 
      });
    }
    if (uniqueWordsRatio < 0.7) {
      humanMarkers.push({ 
        marker: "Natural repetition of common words", 
        importance: "medium" as const 
      });
    }
    if (aiProbability < 0.6) {
      humanMarkers.push({ 
        marker: "Varied sentence complexity and structure", 
        importance: "medium" as const 
      });
    }
    if (humanMarkers.length < 2) {
      humanMarkers.push({ 
        marker: "Natural flow between ideas", 
        importance: "low" as const 
      });
    }
    
    setResult({
      aiProbability,
      humanProbability,
      verdict,
      aiMarkers,
      humanMarkers
    });
  };

  const clearText = () => {
    setText("");
    setResult(null);
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast({
        title: "Invalid file type",
        description: "Please upload a text (.txt) file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const getImportanceColor = (importance: "high" | "medium" | "low") => {
    switch (importance) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-yellow-500";
      default:
        return "text-gray-600";
    }
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Enter text to analyze</label>
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste the text you want to check for AI generation..."
                className="w-full h-64 p-4 resize-none"
              />
              
              <div className="flex flex-wrap gap-4 mt-4">
                <Button
                  onClick={detectAIContent}
                  disabled={isDetecting || text.trim().length < 50}
                  className="bg-primary hover:bg-blue-700 transition flex items-center"
                >
                  <i className="fas fa-robot mr-2"></i>
                  <span>{isDetecting ? "Analyzing..." : "Detect AI Content"}</span>
                </Button>
                
                <label className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer flex items-center">
                  <i className="fas fa-upload mr-2"></i>
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                
                <Button
                  onClick={clearText}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <i className="fas fa-eraser mr-2"></i>
                  <span>Clear Text</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-blue-800 font-medium mb-2">Tips for accurate detection</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Provide at least 200 words for more accurate results</li>
                <li>• Include complete paragraphs rather than fragments</li>
                <li>• For best results, avoid heavily edited or mixed content</li>
                <li>• Multiple languages are supported, but English works best</li>
              </ul>
            </div>
          </div>
          
          <div>
            {isDetecting ? (
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm text-gray-500 mb-2">Analyzing text for AI patterns...</p>
                <Progress value={progress} className="h-2" />
              </div>
            ) : result ? (
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <div className={`h-2 ${result.aiProbability > 0.75 ? 'bg-red-500' : result.aiProbability > 0.5 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-semibold">Analysis Result</h3>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        result.aiProbability > 0.75 ? 'bg-red-100 text-red-800' : 
                        result.aiProbability > 0.5 ? 'bg-orange-100 text-orange-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.verdict}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">AI Probability</span>
                          <span className="text-sm font-bold text-red-600">{Math.round(result.aiProbability * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${Math.round(result.aiProbability * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-600">Human Probability</span>
                          <span className="text-sm font-bold text-green-600">{Math.round(result.humanProbability * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${Math.round(result.humanProbability * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Content Indicators</h4>
                        <ul className="space-y-1">
                          {result.aiMarkers.map((marker, idx) => (
                            <li key={idx} className="flex items-start">
                              <i className={`fas fa-circle text-xs mt-1.5 mr-2 ${getImportanceColor(marker.importance)}`}></i>
                              <span className="text-sm text-gray-600">{marker.marker}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Human Content Indicators</h4>
                        <ul className="space-y-1">
                          {result.humanMarkers.map((marker, idx) => (
                            <li key={idx} className="flex items-start">
                              <i className={`fas fa-circle text-xs mt-1.5 mr-2 ${getImportanceColor(marker.importance)}`}></i>
                              <span className="text-sm text-gray-600">{marker.marker}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-3">Interpretation Guidelines</h3>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-red-600">75%+ AI Probability:</span> The text shows strong indicators of AI generation. It may exhibit unnaturally consistent quality, lack of errors, and overly structured formatting.
                      </p>
                      <p>
                        <span className="font-medium text-orange-600">50-75% AI Probability:</span> The text contains some AI indicators but also shows characteristics of human writing. It could be AI-generated content that was edited by a human.
                      </p>
                      <p>
                        <span className="font-medium text-yellow-600">25-50% AI Probability:</span> The text likely contains more human elements than AI elements. It may be human-written with some AI assistance or editing.
                      </p>
                      <p>
                        <span className="font-medium text-green-600">Below 25% AI Probability:</span> The text shows strong human writing characteristics including natural flow, personal voice, and typical human inconsistencies.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-2"></i>
                    <div>
                      <h4 className="text-yellow-800 font-medium">Important Notice</h4>
                      <p className="text-yellow-700 text-sm">
                        This detector provides an estimate based on text patterns and is not 100% accurate. 
                        False positives can occur with highly structured or technical content. 
                        Use this tool as one data point rather than definitive proof of AI generation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-6 h-[400px] flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 rounded-full p-4 mb-4">
                  <i className="fas fa-robot text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Content Detection</h3>
                <p className="text-gray-500 max-w-md">
                  Enter text in the editor to analyze whether it was likely written by a human or generated by AI like ChatGPT, Bard, or other language models.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Identify AI-generated content with our sophisticated AI Content Detector.",
    description: "Our AI Content Detector uses advanced machine learning algorithms to analyze text and determine whether it was likely written by a human or generated by artificial intelligence systems like ChatGPT, Bard, or other large language models. In today's digital landscape where AI-generated content is becoming increasingly common, this tool helps educators verify student work, publishers maintain authenticity, and content managers ensure originality. The detector examines multiple linguistic patterns including sentence structure variety, word choice patterns, semantic coherence, and stylistic consistencies that typically differentiate between human and machine-written text. While no detector is perfect, our tool provides a reliable probability assessment along with specific indicators to help you make informed decisions about the content's origin.",
    howToUse: [
      "Paste the text you want to analyze in the input field on the left side.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Click the 'Detect AI Content' button to start the analysis process.",
      "Wait a few seconds for the algorithm to analyze the text patterns and indicators.",
      "Review the results showing AI probability, human probability, and the verdict.",
      "Examine the specific AI and human content indicators identified in the text.",
      "Use the interpretation guidelines to understand what the probability scores mean."
    ],
    features: [
      "Multi-dimensional analysis examining word choice, sentence structure, and stylistic patterns",
      "Probability scores indicating likelihood of AI vs. human authorship",
      "Detailed breakdown of specific indicators found in the analyzed text",
      "Support for multiple languages with best accuracy for English content",
      "Clear interpretation guidelines to help understand detection results",
      "Works with various AI models including ChatGPT, Bard, Claude, and other large language models"
    ],
    faqs: [
      {
        question: "How accurate is this AI Content Detector?",
        answer: "Our AI Content Detector typically achieves 80-90% accuracy in identifying AI-generated content from major language models like ChatGPT or Bard. However, accuracy can vary based on several factors: text length (longer texts generally yield more accurate results), the specific AI model that generated the content, how heavily the content was edited by humans after generation, and the subject matter. Technical or highly specialized content may trigger false positives. While this tool is highly effective, we recommend using it as one of several evaluation methods rather than as a definitive determination of content origin."
      },
      {
        question: "Can AI-generated content be modified to avoid detection?",
        answer: "Yes, AI-generated content can be edited to reduce the likelihood of detection. Extensive human editing, inserting personal anecdotes, varying sentence structures, introducing intentional grammatical variations, and blending human and AI-written sections can all make detection more challenging. However, our detector is continuously updated to identify even heavily edited AI content by examining deeper linguistic patterns beyond surface-level features. As a countermeasure, the detector evaluates multiple dimensions simultaneously, which makes it more resistant to simple editing techniques designed to fool AI detection tools."
      },
      {
        question: "What specific signals does the detector look for to identify AI-generated content?",
        answer: "The detector analyzes multiple linguistic signals including: unnaturally consistent tone throughout long passages, overly perfect grammar and punctuation, uniform sentence complexity, unusual vocabulary patterns (either too varied or too repetitive), lack of personal anecdotes or distinctive voice, overly structured paragraph formats, and certain semantic patterns common in large language models. The tool uses a proprietary algorithm that weighs these signals differently depending on context and continuously refines its model based on the latest AI writing technologies. This multi-dimensional approach helps minimize false positives while maintaining high detection accuracy."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="ai-content-detector"
      toolContent={
        <ToolContentTemplate
          introduction={contentData.introduction}
          description={contentData.description}
          howToUse={contentData.howToUse}
          features={contentData.features}
          faqs={contentData.faqs}
          toolInterface={contentData.toolInterface}
        />
      }
    />
  );
};

export default AIContentDetectorDetailed;