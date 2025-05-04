import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type ParaphrasingMode = "standard" | "fluent" | "creative" | "academic" | "simple";

const ParaphrasingToolDetailed = () => {
  const [originalText, setOriginalText] = useState("");
  const [paraphrasedText, setParaphrasedText] = useState("");
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<ParaphrasingMode>("standard");

  useEffect(() => {
    document.title = "Paraphrasing Tool - AllTooly";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
    if (paraphrasedText) {
      setParaphrasedText("");
    }
  };

  const paraphraseText = async () => {
    if (originalText.trim().length < 30) {
      toast({
        title: "Text too short",
        description: "Please enter at least 30 characters to paraphrase.",
        variant: "destructive",
      });
      return;
    }

    setIsParaphrasing(true);
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
      const response = await apiRequest("POST", "/api/text/paraphrase", {
        text: originalText,
        mode
      });
      const data = await response.json();
      setParaphrasedText(data.paraphrasedText);
    } catch (error) {
      toast({
        title: "Error paraphrasing text",
        description: "An error occurred while paraphrasing your text. Please try again.",
        variant: "destructive",
      });

      // Simulate a response based on the selected mode
      let paraphrasedResult = "";

      switch (mode) {
        case "standard":
          paraphrasedResult = standardParaphrase(originalText);
          break;
        case "fluent":
          paraphrasedResult = fluentParaphrase(originalText);
          break;
        case "creative":
          paraphrasedResult = creativeParaphrase(originalText);
          break;
        case "academic":
          paraphrasedResult = academicParaphrase(originalText);
          break;
        case "simple":
          paraphrasedResult = simpleParaphrase(originalText);
          break;
        default:
          paraphrasedResult = standardParaphrase(originalText);
      }

      setParaphrasedText(paraphrasedResult);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsParaphrasing(false);
    }
  };

  // Simple paraphrasing functions for demonstration
  const standardParaphrase = (text: string): string => {
    // Replace common words and phrases
    return text
      .replace(/([Ii]t is|[Tt]here are)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "There's" : "there's")
      .replace(/([Ii]n order to)/g, "to")
      .replace(/([Hh]owever)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "But" : "but")
      .replace(/([Tt]herefore)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "So" : "so")
      .replace(/([Ii]n addition)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Additionally" : "additionally")
      .replace(/([Cc]onsequently)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "As a result" : "as a result");
  };

  const fluentParaphrase = (text: string): string => {
    // More natural, conversational rewording
    return text
      .replace(/([Ii]t is important to note that)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Importantly" : "importantly")
      .replace(/([Ii]n conclusion)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "To sum up" : "to sum up")
      .replace(/([Tt]his study shows)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "This research demonstrates" : "this research demonstrates")
      .replace(/([Mm]oreover)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "What's more" : "what's more")
      .replace(/([Nn]evertheless)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Even so" : "even so");
  };

  const creativeParaphrase = (text: string): string => {
    // More imaginative and extensive restructuring
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.map(sentence => {
      // Randomly choose some transformations
      if (sentence.length > 10 && Math.random() > 0.5) {
        // Try to move clauses around if there's a comma
        if (sentence.includes(',')) {
          const parts = sentence.split(',');
          if (parts.length >= 2) {
            // Reorder parts
            const rearranged = [...parts];
            const firstPart = rearranged.shift() || '';
            rearranged.push(firstPart);
            return rearranged.join(',');
          }
        }
      }
      return sentence
        .replace(/([Mm]any people believe)/g, match =>
          match.charAt(0) === match.charAt(0).toUpperCase() ? "It's widely thought" : "it's widely thought")
        .replace(/([Tt]he results indicate)/g, match =>
          match.charAt(0) === match.charAt(0).toUpperCase() ? "The findings suggest" : "the findings suggest")
        .replace(/([Aa]s a consequence)/g, match =>
          match.charAt(0) === match.charAt(0).toUpperCase() ? "Consequently" : "consequently")
        .replace(/([Ff]or instance)/g, match =>
          match.charAt(0) === match.charAt(0).toUpperCase() ? "As an example" : "as an example");
    }).join(' ');
  };

  const academicParaphrase = (text: string): string => {
    // More formal, scholarly tone
    return text
      .replace(/([Ss]hows)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Demonstrates" : "demonstrates")
      .replace(/([Ll]ooks like)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Appears to be" : "appears to be")
      .replace(/([Tt]alks about)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Discusses" : "discusses")
      .replace(/([Gg]et)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Obtain" : "obtain")
      .replace(/([Uu]se)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Utilize" : "utilize")
      .replace(/([Ff]ind out)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Determine" : "determine")
      .replace(/([Bb]ig)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Substantial" : "substantial");
  };

  const simpleParaphrase = (text: string): string => {
    // Simplified vocabulary and sentence structure
    return text
      .replace(/([Uu]tilize)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Use" : "use")
      .replace(/([Ii]mplement)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Do" : "do")
      .replace(/([Ss]ubsequently)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Then" : "then")
      .replace(/([Aa]dditionally)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Also" : "also")
      .replace(/([Cc]ommence)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "Start" : "start")
      .replace(/([Tt]erminate)/g, match =>
        match.charAt(0) === match.charAt(0).toUpperCase() ? "End" : "end");
  };

  const clearText = () => {
    setOriginalText("");
    setParaphrasedText("");
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
    navigator.clipboard.writeText(paraphrasedText);
    toast({
      title: "Copied to clipboard",
      description: "The paraphrased text has been copied to your clipboard.",
    });
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Original Text</label>
              <Textarea
                value={originalText}
                onChange={handleTextChange}
                placeholder="Paste your text here to paraphrase..."
                className="w-full h-64 p-4 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <Button
                onClick={paraphraseText}
                disabled={isParaphrasing || originalText.trim().length < 30}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-exchange-alt mr-2"></i>
                <span>{isParaphrasing ? "Paraphrasing..." : "Paraphrase"}</span>
              </Button>

              <label className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer flex items-center text-sm">
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
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm"
              >
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear</span>
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Paraphrasing Mode</label>
              <Select value={mode} onValueChange={(value) => setMode(value as ParaphrasingMode)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select paraphrasing mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between items-center">
              <label className="block text-gray-700 font-medium">Paraphrased Text</label>
              {paraphrasedText && (
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="text-gray-700 text-sm py-1 px-3 h-8"
                >
                  <i className="fas fa-copy mr-2"></i>
                  <span>Copy</span>
                </Button>
              )}
            </div>

            {isParaphrasing ? (
              <div className="bg-gray-50 border rounded-lg p-4 h-64 flex flex-col items-center justify-center">
                <Progress value={progress} className="w-full h-2 mb-4" />
                <p className="text-gray-500">Paraphrasing your text...</p>
              </div>
            ) : paraphrasedText ? (
              <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-auto">
                <p className="text-gray-800 whitespace-pre-wrap">{paraphrasedText}</p>
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-4 h-64 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Your paraphrased text will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-blue-800 font-medium mb-2">About Paraphrasing Modes</h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li><span className="font-medium">Standard:</span> Balanced changes that retain meaning while varying vocabulary and structure.</li>
          <li><span className="font-medium">Fluent:</span> Smooth, natural-sounding result that reads well and flows naturally.</li>
          <li><span className="font-medium">Creative:</span> More extensive rewording with alternative expressions and reorganized sentences.</li>
          <li><span className="font-medium">Academic:</span> Formal tone with scholarly language appropriate for academic writing.</li>
          <li><span className="font-medium">Simple:</span> Clear, straightforward language with simpler vocabulary and sentence structure.</li>
        </ul>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform your writing instantly with our intelligent Paraphrasing Tool.",
    description: "Our Paraphrasing Tool is an advanced AI-powered solution that helps you rewrite text while preserving its original meaning. Whether you're a student looking to avoid plagiarism, a content creator seeking fresh ways to express ideas, or a professional aiming to improve your writing, this tool offers multiple paraphrasing modes to suit your specific needs. The sophisticated algorithms analyze your text's structure and semantics to generate alternative versions with varied vocabulary, sentence structures, and expressions while maintaining context and intent. From academic papers to creative content, our Paraphrasing Tool helps you communicate more effectively with original, plagiarism-free writing.",
    howToUse: [
      "Enter or paste your text into the editor box on the left side.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Select your desired paraphrasing mode from the dropdown menu (Standard, Fluent, Creative, Academic, or Simple).",
      "Click the 'Paraphrase' button to transform your text.",
      "Review the paraphrased version in the output box on the right side.",
      "Use the 'Copy' button to copy the paraphrased text to your clipboard."
    ],
    features: [
      "Five distinct paraphrasing modes optimized for different writing styles and contexts",
      "Semantic analysis that preserves the original meaning while changing wording and structure",
      "Context-aware vocabulary suggestions that maintain the appropriate tone and style",
      "Support for various content types including essays, articles, research papers, and creative writing",
      "Fast processing that delivers results in seconds",
      "Intuitive side-by-side interface to easily compare original and paraphrased text"
    ],
    faqs: [
      {
        question: "Will paraphrased content pass plagiarism checks?",
        answer: "Our Paraphrasing Tool is designed to help you create unique content by rewording and restructuring text. The paraphrased content typically performs well on plagiarism checks, especially when using the Creative or Academic modes which make more substantial changes. However, it's important to note that while the tool helps avoid verbatim copying, proper citation is still necessary when referencing others' ideas or research. For academic work, we recommend using the tool as a starting point and adding your own insights and voice to the paraphrased content."
      },
      {
        question: "Which paraphrasing mode is best for my needs?",
        answer: "The best mode depends on your specific purpose: Standard is ideal for general rewording while preserving tone. Fluent creates natural, flowing text that's easy to read. Creative offers the most original rewording for maximum uniqueness. Academic is optimized for formal, scholarly writing with appropriate terminology. Simple creates clear, straightforward text with simplified vocabulary. We recommend experimenting with different modes to find the one that best suits your particular writing task and audience."
      },
      {
        question: "Is there a limit to how much text I can paraphrase?",
        answer: "For optimal results and performance, we recommend paraphrasing text in chunks of up to 2,000 words at a time. Processing large volumes of text at once may affect the quality of paraphrasing and could take longer to complete. If you need to paraphrase longer documents, consider dividing them into smaller sections and processing them separately to ensure the highest quality output for each part of your content."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="paraphrasing-tool"
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

export default ParaphrasingToolDetailed;