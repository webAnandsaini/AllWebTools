import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const PlagiarismCheckerDetailed = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{
    uniqueContent: number;
    plagiarizedContent: number;
    sources: { url: string; matchPercentage: number }[];
  } | null>(null);

  useEffect(() => {
    document.title = "Plagiarism Checker - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (results) {
      setResults(null);
    }
  };

  const checkPlagiarism = async () => {
    if (text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters to check for plagiarism.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      const response = await apiRequest("POST", "/api/text/plagiarism-check", { text });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      toast({
        title: "Error checking plagiarism",
        description: "An error occurred while checking for plagiarism. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const clearText = () => {
    setText("");
    setResults(null);
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

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your text here to check for plagiarism..."
              className="w-full h-64 p-4 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Character count: {text.length}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button
            onClick={checkPlagiarism}
            disabled={isChecking || text.trim().length < 50}
            className="bg-primary hover:bg-blue-700 transition flex items-center"
          >
            <i className="fas fa-search mr-2"></i>
            <span>{isChecking ? "Checking..." : "Check Plagiarism"}</span>
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

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-3">Results</h3>
        
        {isChecking ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <Progress value={45} className="w-full h-2" />
            </div>
            <p className="text-gray-500">Checking for plagiarism...</p>
          </div>
        ) : results ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4 md:mb-0 md:w-5/12">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Unique Content</h4>
                  <span className="text-green-600 font-semibold text-lg">
                    {results.uniqueContent}%
                  </span>
                </div>
                <Progress value={results.uniqueContent} className="h-2 mt-2 bg-gray-100" />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 md:w-5/12">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Plagiarized Content</h4>
                  <span className="text-red-600 font-semibold text-lg">
                    {results.plagiarizedContent}%
                  </span>
                </div>
                <Progress value={results.plagiarizedContent} className="h-2 mt-2 bg-gray-100" />
              </div>
            </div>
            
            {results.sources.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Matching Sources</h4>
                <div className="space-y-3">
                  {results.sources.map((source, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-md"
                        >
                          {source.url}
                        </a>
                        <span className="text-red-600 font-medium">
                          {source.matchPercentage}% match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              <i className="fas fa-search text-4xl mb-3"></i>
              <p>Your plagiarism check results will appear here</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const contentData = {
    introduction: "Ensure your content is 100% original with our advanced Plagiarism Checker.",
    description: "Our Plagiarism Checker tool uses advanced algorithms to compare your text against billions of web pages, academic papers, and published content across the internet. This powerful tool helps students, writers, and content creators ensure their work is original and properly cited. Detecting plagiarism early can help you avoid serious academic or professional consequences while maintaining your credibility.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Click the 'Check Plagiarism' button to begin the analysis.",
      "Wait for the system to scan your content against our extensive database.",
      "Review the results showing the percentage of unique and plagiarized content along with matching sources."
    ],
    features: [
      "Deep web scanning that covers billions of web pages, academic papers, and publications",
      "Accurate percentage breakdown of original vs. plagiarized content",
      "Source identification that shows exactly where matching content was found",
      "Works with essays, articles, research papers, blog posts, and more",
      "Fast and efficient checking with results in seconds",
      "Secure processing that respects your content's privacy"
    ],
    faqs: [
      {
        question: "How accurate is the plagiarism detection?",
        answer: "Our plagiarism checker uses advanced algorithms to deliver up to 98% accuracy. It scans billions of web pages, academic databases, and published works to identify matching content, giving you reliable results you can trust."
      },
      {
        question: "Can I check multiple documents at once?",
        answer: "Currently, our tool checks one document at a time to ensure thorough analysis. For multiple documents, you'll need to run separate checks for each one to maintain accuracy and detailed reporting."
      },
      {
        question: "Is my content secure when I use this tool?",
        answer: "Yes, your privacy is our priority. All content submitted for plagiarism checking is processed securely and is not stored permanently on our servers or shared with third parties. Your intellectual property remains protected."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="plagiarism-checker"
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

export default PlagiarismCheckerDetailed;