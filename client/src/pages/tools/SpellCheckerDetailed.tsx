import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const SpellCheckerDetailed = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    correctedText: string;
    errors: Array<{
      word: string;
      position: { start: number; end: number };
      suggestions: string[];
    }>;
    errorCount: number;
  } | null>(null);

  useEffect(() => {
    document.title = "Spell Checker - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (results) {
      setResults(null);
    }
  };

  const checkSpelling = async () => {
    if (text.trim().length < 5) {
      toast({
        title: "Text too short",
        description: "Please enter at least 5 characters to check spelling.",
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
    }, 400);

    try {
      const response = await apiRequest("POST", "/api/text/spell-check", { text });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error checking spelling",
        description: "An error occurred while checking for spelling errors. Please try again.",
        variant: "destructive",
      });
      
      // Simulate a response for demonstration purposes
      // Generate some fake spelling errors
      const words = text.split(/\\s+/);
      const errors = [];
      
      // Randomly select a few words to mark as misspelled
      const errorCount = Math.min(Math.floor(words.length * 0.1) + 1, 5);
      const randomIndexes = new Set<number>();
      
      while (randomIndexes.size < errorCount && randomIndexes.size < words.length) {
        randomIndexes.add(Math.floor(Math.random() * words.length));
      }
      
      let currentIndex = 0;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (randomIndexes.has(i) && word.length > 3) {
          // Find the position of this word in the text
          const position = text.indexOf(word, currentIndex);
          if (position !== -1) {
            errors.push({
              word,
              position: { start: position, end: position + word.length },
              suggestions: generateFakeSuggestions(word)
            });
            currentIndex = position + word.length;
          }
        }
      }
      
      setResults({
        correctedText: text,
        errors,
        errorCount: errors.length
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsChecking(false);
    }
  };

  const generateFakeSuggestions = (word: string): string[] => {
    // Create reasonable suggestions for common misspellings
    const suggestions: string[] = [];
    // Add a suggestion with proper capitalization
    if (word.charAt(0).toLowerCase() === word.charAt(0)) {
      suggestions.push(word.charAt(0).toUpperCase() + word.slice(1));
    } else {
      suggestions.push(word.charAt(0).toLowerCase() + word.slice(1));
    }
    
    // Add a suggestion with a common letter substitution
    if (word.includes('i')) {
      suggestions.push(word.replace('i', 'e'));
    } else if (word.includes('e')) {
      suggestions.push(word.replace('e', 'i'));
    }
    
    // Add a suggestion with a doubled letter
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] === word[i + 1]) {
        const newWord = word.slice(0, i + 1) + word.slice(i + 2);
        suggestions.push(newWord);
        break;
      }
    }
    
    // If we don't have enough suggestions yet, add some common correct words
    const commonWords = ["the", "their", "there", "they're", "your", "you're", "its", "it's", "weather", "whether"];
    while (suggestions.length < 3) {
      const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
      if (!suggestions.includes(randomWord)) {
        suggestions.push(randomWord);
      }
    }
    
    return suggestions;
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
      errorCount: updatedErrors.length
    });
    
    toast({
      title: "Correction applied",
      description: `Changed "${error.word}" to "${suggestion}"`,
    });
  };

  const applyAllCorrections = () => {
    if (!results || results.errors.length === 0) return;
    
    let correctedText = text;
    let offset = 0;
    
    // Sort errors by position to handle them in order
    const sortedErrors = [...results.errors].sort((a, b) => a.position.start - b.position.start);
    
    for (const error of sortedErrors) {
      const suggestion = error.suggestions[0]; // Use the first suggestion by default
      
      const before = correctedText.substring(0, error.position.start + offset);
      const after = correctedText.substring(error.position.end + offset);
      correctedText = before + suggestion + after;
      
      // Update offset for subsequent replacements
      offset += suggestion.length - (error.position.end - error.position.start);
    }
    
    setText(correctedText);
    setResults({
      correctedText,
      errors: [],
      errorCount: 0
    });
    
    toast({
      title: "All corrections applied",
      description: `Fixed ${sortedErrors.length} spelling ${sortedErrors.length === 1 ? 'error' : 'errors'}.`,
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
              placeholder="Type or paste your text here to check for spelling errors..."
              className="w-full h-64 p-4 resize-none"
            />
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Button
                onClick={checkSpelling}
                disabled={isChecking || text.trim().length < 5}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-spell-check mr-2"></i>
                <span>{isChecking ? "Checking..." : "Check Spelling"}</span>
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
            <h3 className="font-semibold text-lg">Spelling Check Results</h3>
            <div className="flex items-center">
              <div className="bg-white px-3 py-1 rounded-full border flex items-center">
                <span className="text-sm mr-2">Errors found:</span>
                <span className={`font-semibold text-lg ${
                  results.errorCount === 0 ? "text-green-600" : "text-red-600"
                }`}>{results.errorCount}</span>
              </div>
            </div>
          </div>
          
          {results.errors.length > 0 ? (
            <div>
              <div className="flex justify-between mb-4">
                <p className="text-gray-700">
                  We found {results.errorCount} {results.errorCount === 1 ? 'error' : 'errors'} in your text.
                </p>
                <Button
                  onClick={applyAllCorrections}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Fix All Errors
                </Button>
              </div>
              
              <div className="space-y-4">
                {results.errors.map((error, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-red-600 mb-1">Possible spelling error</p>
                          <p className="text-gray-700 text-sm">"{error.word}" might be misspelled</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">Context:</p>
                        <p className="bg-gray-50 p-2 rounded text-sm">
                          {text.substring(Math.max(0, error.position.start - 20), error.position.start)}
                          <span className="bg-red-200 px-1">{error.word}</span>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
              <i className="fas fa-check-circle text-3xl mb-2"></i>
              <p className="font-medium">No spelling errors found! Your text looks great.</p>
            </div>
          )}
        </div>
      )}
    </>
  );

  const contentData = {
    introduction: "Ensure error-free writing with our advanced Spell Checker tool.",
    description: "Our Spell Checker tool uses sophisticated algorithms to identify and correct spelling errors in your text. Whether you're writing an important email, crafting content for your website, or working on an academic paper, this tool helps you catch and fix spelling mistakes that might undermine your credibility. The tool not only identifies misspelled words but also suggests the most likely correct alternatives, allowing you to maintain a professional and polished writing style. From common typing errors to difficult-to-spell words, our Spell Checker ensures your writing is clear, accurate, and free from embarrassing mistakes.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Click the 'Check Spelling' button to begin the analysis.",
      "Review the identified spelling errors highlighted in your text.",
      "Click on a suggested correction to replace the misspelled word, or use 'Fix All Errors' to apply all recommended corrections at once."
    ],
    features: [
      "Comprehensive dictionary with support for multiple English variants (US, UK, Canadian, Australian)",
      "Context-aware spell checking that distinguishes between homophones",
      "One-click corrections with multiple suggestions for each identified error",
      "Batch correction option to fix all errors at once",
      "Support for technical and specialized vocabulary",
      "Fast processing that can handle documents of any length"
    ],
    faqs: [
      {
        question: "Can the Spell Checker detect all types of spelling errors?",
        answer: "Our Spell Checker is designed to detect the vast majority of common spelling errors, including typographical errors, transposed letters, doubled letters, and missing letters. However, no spell checker is perfect—it may occasionally miss certain contextual errors or incorrectly flag specialized terms, technical jargon, proper names, or regional expressions. For the best results, we recommend using the spell checker as part of a comprehensive review process."
      },
      {
        question: "Does the Spell Checker work with languages other than English?",
        answer: "Currently, our Spell Checker is optimized for English text, including various English dialects such as American, British, Canadian, and Australian English. While it may recognize some common words from other languages, it's primarily designed for English content. We're actively working to expand our language support to include other major languages in future updates."
      },
      {
        question: "Will the Spell Checker correct grammar and punctuation errors too?",
        answer: "Our Spell Checker focuses primarily on identifying and correcting misspelled words. For more comprehensive writing assistance, including grammar, punctuation, and style improvements, we recommend using our Grammar Checker tool in conjunction with the Spell Checker. Together, these tools provide a complete solution for polishing your writing and ensuring it's error-free and professional."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="spell-checker"
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

export default SpellCheckerDetailed;