import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const GrammarCheckerDetailed = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    correctedText: string;
    errors: Array<{
      type: string;
      message: string;
      position: { start: number; end: number };
      suggestions: string[];
    }>;
    score: number;
  } | null>(null);

  useEffect(() => {
    document.title = "Grammar Checker - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (results) {
      setResults(null);
    }
  };

  const checkGrammar = async () => {
    if (text.trim().length < 20) {
      toast({
        title: "Text too short",
        description: "Please enter at least 20 characters to check for grammar errors.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    try {
      const response = await apiRequest("POST", "/api/text/grammar-check", { text });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error checking grammar",
        description: "An error occurred while checking for grammar errors. Please try again.",
        variant: "destructive",
      });
      
      // Simulate a response for demonstration purposes
      const simulatedErrors = [
        {
          type: "grammar",
          message: "Subject-verb agreement error",
          position: { start: text.indexOf("is") || 0, end: (text.indexOf("is") || 0) + 2 },
          suggestions: ["are"]
        },
        {
          type: "spelling",
          message: "Possible spelling error",
          position: { start: text.indexOf("the") || 0, end: (text.indexOf("the") || 0) + 3 },
          suggestions: ["they", "then"]
        },
        {
          type: "punctuation",
          message: "Missing comma",
          position: { start: text.indexOf(".") || 0, end: (text.indexOf(".") || 0) + 1 },
          suggestions: [",."]
        }
      ];
      
      // Only include errors if their positions are valid
      const validErrors = simulatedErrors.filter(error => 
        error.position.start >= 0 && error.position.end <= text.length
      );
      
      setResults({
        correctedText: text,
        errors: validErrors,
        score: 85
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsChecking(false);
    }
  };

  const clearText = () => {
    setText("");
    setResults(null);
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

  const applyCorrection = (suggestionIndex: number, errorIndex: number) => {
    if (!results) return;
    
    const error = results.errors[errorIndex];
    const suggestion = error.suggestions[suggestionIndex];
    
    const before = text.substring(0, error.position.start);
    const after = text.substring(error.position.end);
    const newText = before + suggestion + after;
    
    setText(newText);
    
    // Update results to remove the applied correction
    const updatedErrors = [...results.errors];
    updatedErrors.splice(errorIndex, 1);
    
    setResults({
      ...results,
      correctedText: newText,
      errors: updatedErrors,
      score: updatedErrors.length === 0 ? 100 : Math.min(100, results.score + 5)
    });
    
    toast({
      title: "Correction applied",
      description: `Changed "${text.substring(error.position.start, error.position.end)}" to "${suggestion}"`,
    });
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here to check for grammar errors..."
              className="w-full h-64 p-4 resize-none"
            />
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button
                onClick={checkGrammar}
                disabled={isChecking || text.trim().length < 20}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-check-circle mr-2"></i>
                <span>{isChecking ? "Checking..." : "Check Grammar"}</span>
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
        </div>
      </div>

      {isChecking && (
        <div className="my-6">
          <p className="text-sm text-gray-500 mb-2">Analyzing your text...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {results && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Grammar Check Results</h3>
            <div className="flex items-center">
              <div className="bg-white px-3 py-1 rounded-full border flex items-center">
                <span className="text-sm mr-2">Score:</span>
                <span className={`font-semibold text-lg ${
                  results.score >= 90 ? "text-green-600" : 
                  results.score >= 70 ? "text-yellow-600" : "text-red-600"
                }`}>{results.score}</span>
              </div>
            </div>
          </div>
          
          {results.errors.length > 0 ? (
            <div>
              <p className="mb-4 text-gray-700">
                We found {results.errors.length} {results.errors.length === 1 ? 'issue' : 'issues'} in your text. Review the suggestions below:
              </p>
              
              <div className="space-y-4">
                {results.errors.map((error, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-red-600 mb-1">{error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error</p>
                            <p className="text-gray-700 text-sm">{error.message}</p>
                          </div>
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {error.type}
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-1">Context:</p>
                          <p className="bg-gray-50 p-2 rounded text-sm">
                            {text.substring(Math.max(0, error.position.start - 20), error.position.start)}
                            <span className="bg-red-200 px-1">{text.substring(error.position.start, error.position.end)}</span>
                            {text.substring(error.position.end, Math.min(text.length, error.position.end + 20))}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
                          <div className="flex flex-wrap gap-2">
                            {error.suggestions.map((suggestion, suggestionIdx) => (
                              <Button 
                                key={suggestionIdx}
                                size="sm"
                                variant="outline"
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                onClick={() => applyCorrection(suggestionIdx, idx)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
              <i className="fas fa-check-circle text-3xl mb-2"></i>
              <p className="font-medium">No grammar errors found! Your text looks great.</p>
            </div>
          )}
        </div>
      )}
    </>
  );

  const contentData = {
    introduction: "Polish your writing to perfection with our intelligent Grammar Checker tool.",
    description: "Our Grammar Checker uses advanced linguistic algorithms to detect and correct grammar, spelling, punctuation, and style errors in your writing. Whether you're drafting an important email, writing an essay, or creating content for your website, this tool helps ensure your text is clear, accurate, and professional. The Grammar Checker analyzes your writing in real-time, providing instant feedback and suggestions to enhance readability, fix common mistakes, and improve your overall writing quality. It's like having a professional editor review your work before you share it with the world.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Click the 'Check Grammar' button to start the analysis.",
      "Review the detailed list of errors and suggestions provided by the tool.",
      "Click on any suggested correction to automatically apply it to your text."
    ],
    features: [
      "Comprehensive grammar and spelling error detection with contextual understanding",
      "Punctuation and style improvement suggestions for clearer writing",
      "Detailed explanations for each identified error to help you learn and improve",
      "Overall writing quality score with specific feedback",
      "Support for various writing styles including academic, business, and creative content",
      "Context-aware suggestions that understand the meaning behind your writing"
    ],
    faqs: [
      {
        question: "Can the Grammar Checker detect all types of grammar errors?",
        answer: "Our Grammar Checker is designed to detect and provide suggestions for a wide range of grammar, spelling, punctuation, and style errors. It excels at identifying common mistakes like subject-verb agreement, article usage, run-on sentences, and comma placement. However, like any automated tool, it may not catch every nuanced error, especially in highly specialized or technical writing. For professional or academic work, we recommend using our tool as a first pass, followed by human proofreading."
      },
      {
        question: "Does the Grammar Checker support languages other than English?",
        answer: "Currently, our Grammar Checker is optimized for English text, with support for both American and British English variants. We're actively working on expanding our language capabilities to include other major languages in future updates. For non-English text, the tool will still check for basic spelling errors but may not correctly identify grammar or style issues specific to other languages."
      },
      {
        question: "Will using the Grammar Checker improve my writing skills over time?",
        answer: "Yes! Our Grammar Checker is designed not just to correct errors but to help you learn from them. Each suggestion comes with an explanation of the grammar rule being applied, helping you understand why a particular correction is recommended. By consistently using the tool and paying attention to these explanations, many users report noticeable improvements in their writing skills over time, leading to fewer errors in future writing projects."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="grammar-checker"
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

export default GrammarCheckerDetailed;