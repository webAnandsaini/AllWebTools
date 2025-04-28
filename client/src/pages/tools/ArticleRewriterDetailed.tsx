import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const ArticleRewriterDetailed = () => {
  const [originalText, setOriginalText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.title = "Article Rewriter - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
  };

  const rewriteText = async () => {
    if (originalText.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please enter at least 50 characters to rewrite.",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
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
    }, 500);

    try {
      const response = await apiRequest("POST", "/api/text/rewrite", { text: originalText });
      const data = await response.json();
      setRewrittenText(data.rewrittenText);
    } catch (error) {
      toast({
        title: "Error rewriting text",
        description: "An error occurred while rewriting your text. Please try again.",
        variant: "destructive",
      });
      // If we're using mock data for now
      const paragraphs = originalText.split("\n\n");
      const rewrittenParagraphs = paragraphs.map(paragraph => {
        const sentences = paragraph.split(". ");
        const rewrittenSentences = sentences.map(sentence => {
          // Simple rewriting logic - replace some words
          return sentence
            .replace(/good/gi, "excellent")
            .replace(/bad/gi, "poor")
            .replace(/big/gi, "large")
            .replace(/small/gi, "tiny")
            .replace(/important/gi, "crucial")
            .replace(/happy/gi, "delighted")
            .replace(/sad/gi, "unhappy");
        });
        return rewrittenSentences.join(". ");
      });
      setRewrittenText(rewrittenParagraphs.join("\n\n"));
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsRewriting(false);
    }
  };

  const clearText = () => {
    setOriginalText("");
    setRewrittenText("");
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
      setOriginalText(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenText);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten text has been copied to your clipboard.",
    });
  };

  const toolInterface = (
    <>
      <Tabs defaultValue="text-input" className="mb-6">
        <TabsList>
          <TabsTrigger value="text-input">Text Input</TabsTrigger>
          <TabsTrigger value="file-upload">File Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-input">
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Enter your text to rewrite</label>
            <Textarea
              value={originalText}
              onChange={handleTextChange}
              placeholder="Paste your article or text here to rewrite..."
              className="w-full h-48 p-4 resize-none"
            />
            
            <div className="mt-4 flex flex-wrap gap-4">
              <Button
                onClick={rewriteText}
                disabled={isRewriting || originalText.trim().length < 50}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                <span>{isRewriting ? "Rewriting..." : "Rewrite Text"}</span>
              </Button>
              
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
        </TabsContent>
        
        <TabsContent value="file-upload">
          <div className="mt-6 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-4"></i>
            <p className="mb-4 text-gray-600">Upload a text file to rewrite</p>
            <label className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
              <span>Select File</span>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </TabsContent>
      </Tabs>

      {isRewriting && (
        <div className="my-6">
          <p className="text-sm text-gray-500 mb-2">Rewriting your text...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {rewrittenText && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Rewritten Text</h3>
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="text-gray-700 text-sm py-1 px-3 h-8"
            >
              <i className="fas fa-copy mr-2"></i>
              <span>Copy</span>
            </Button>
          </div>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="bg-white p-4 rounded-md border border-gray-100 min-h-48">
                {rewrittenText.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const contentData = {
    introduction: "Transform your content instantly with our intelligent Article Rewriter tool.",
    description: "Our Article Rewriter is an advanced AI-powered tool designed to help you create unique, plagiarism-free content with just a few clicks. Whether you're a content creator, student, marketer, or blogger, this tool helps you rephrase articles, essays, and any text while maintaining the original meaning. The sophisticated algorithm analyzes your text's structure and semantics to generate fresh content that reads naturally and engages your audience. Save time and boost productivity while avoiding duplicate content penalties in search engine rankings.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) using the 'File Upload' tab.",
      "Click the 'Rewrite Text' button to start the rewriting process.",
      "Wait for our AI to analyze and rewrite your content while maintaining its original meaning.",
      "Review the rewritten text in the results section and copy it using the 'Copy' button."
    ],
    features: [
      "Advanced AI technology that understands context and meaning",
      "Multiple rewriting styles to match your tone and purpose",
      "Preserves the original meaning while changing the wording completely",
      "Works with various content types including articles, essays, and blog posts",
      "Fast processing that delivers results in seconds",
      "Maintains proper grammar and natural sentence structure"
    ],
    faqs: [
      {
        question: "Will the rewritten content pass plagiarism checks?",
        answer: "Yes, our Article Rewriter was designed to produce uniquely worded content that will typically pass plagiarism checks. The tool changes sentence structure and vocabulary while maintaining the original meaning, resulting in fresh content that differs significantly from the source text."
      },
      {
        question: "Does the Article Rewriter work with all languages?",
        answer: "Currently, our tool works best with English text. While it may process other languages, the quality and accuracy of rewriting are optimized for English content. We're continuously working to expand language support in future updates."
      },
      {
        question: "Is there a limit to how much text I can rewrite at once?",
        answer: "For optimal results, we recommend rewriting content in chunks of up to 3,000 words at a time. Larger texts can be processed in sections to ensure the highest quality output and maintain the context integrity throughout the rewriting process."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="article-rewriter"
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

export default ArticleRewriterDetailed;