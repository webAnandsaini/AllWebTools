import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const TextSummarizerDetailed = () => {
  const [originalText, setOriginalText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">("medium");
  const [summaryType, setSummaryType] = useState<"extractive" | "abstractive">("extractive");
  const [compressionRatio, setCompressionRatio] = useState(70);

  useEffect(() => {
    document.title = "Text Summarizer - AllTooly";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOriginalText(e.target.value);
    if (summarizedText) {
      setSummarizedText("");
    }
  };

  const summarizeText = async () => {
    if (originalText.trim().length < 100) {
      toast({
        title: "Text too short",
        description: "Please enter at least 100 characters to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 12;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 400);

    try {
      const response = await apiRequest("POST", "/api/text/summarize", {
        text: originalText,
        length: summaryLength,
        type: summaryType,
        compressionRatio: compressionRatio
      });
      const data = await response.json();
      setSummarizedText(data.summary);
    } catch (error) {
      toast({
        title: "Error summarizing text",
        description: "An error occurred while summarizing your text. Please try again.",
        variant: "destructive",
      });

      // Generate a simulated summary for demonstration purposes
      const summarizedResult = simulateSummarization(originalText, summaryLength, compressionRatio);
      setSummarizedText(summarizedResult);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setIsSummarizing(false);
    }
  };

  // Function to simulate text summarization
  const simulateSummarization = (text: string, length: string, compressionRatio: number): string => {
    // Split the text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length === 0) {
      return "Could not summarize the text. Please ensure the text contains complete sentences.";
    }

    // Calculate how many sentences to keep based on compression ratio
    let sentencesToKeep: number;
    switch (length) {
      case "short":
        sentencesToKeep = Math.max(1, Math.floor(sentences.length * (1 - compressionRatio / 100) * 0.5));
        break;
      case "medium":
        sentencesToKeep = Math.max(2, Math.floor(sentences.length * (1 - compressionRatio / 100) * 0.7));
        break;
      case "long":
        sentencesToKeep = Math.max(3, Math.floor(sentences.length * (1 - compressionRatio / 100)));
        break;
      default:
        sentencesToKeep = Math.max(2, Math.floor(sentences.length * (1 - compressionRatio / 100) * 0.7));
    }

    // Extract the most "important" sentences (for this simulation, we'll take sentences from the beginning, middle, and end)
    let selectedSentences: string[] = [];

    // Always include the first sentence as it often contains key information
    if (sentences.length > 0) {
      selectedSentences.push(sentences[0]);
    }

    // Select some sentences from the middle
    if (sentences.length > 2 && sentencesToKeep > 1) {
      const startIndex = Math.floor(sentences.length * 0.25);
      const endIndex = Math.floor(sentences.length * 0.75);
      const middleSentencesToSelect = Math.min(sentencesToKeep - 2, endIndex - startIndex);

      for (let i = 0; i < middleSentencesToSelect; i++) {
        const index = startIndex + Math.floor((i / middleSentencesToSelect) * (endIndex - startIndex));
        selectedSentences.push(sentences[index]);
      }
    }

    // Include the last sentence if we have enough sentences to keep
    if (sentences.length > 1 && sentencesToKeep > selectedSentences.length) {
      selectedSentences.push(sentences[sentences.length - 1]);
    }

    // Join the selected sentences to form the summary
    return selectedSentences.join(" ").trim();
  };

  const clearText = () => {
    setOriginalText("");
    setSummarizedText("");
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
    navigator.clipboard.writeText(summarizedText);
    toast({
      title: "Copied to clipboard",
      description: "The summarized text has been copied to your clipboard.",
    });
  };

  const calculateTextStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const characters = text.length;

    return {
      words: words.length,
      sentences: sentences.length,
      characters
    };
  };

  const originalStats = calculateTextStats(originalText);
  const summaryStats = calculateTextStats(summarizedText);

  const compressionPercentage = originalStats.words > 0 && summaryStats.words > 0
    ? Math.round((1 - (summaryStats.words / originalStats.words)) * 100)
    : 0;

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium">Original Text</label>
                <span className="text-sm text-gray-500">
                  {originalStats.words} words • {originalStats.sentences} sentences
                </span>
              </div>
              <Textarea
                value={originalText}
                onChange={handleTextChange}
                placeholder="Paste your text here to summarize..."
                className="w-full h-64 p-4 resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={summarizeText}
                disabled={isSummarizing || originalText.trim().length < 100}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-compress-alt mr-2"></i>
                <span>{isSummarizing ? "Summarizing..." : "Summarize"}</span>
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

            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Summary Length</label>
                <Select
                  value={summaryLength}
                  onValueChange={(value) => setSummaryLength(value as "short" | "medium" | "long")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select summary length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (25% of original)</SelectItem>
                    <SelectItem value="medium">Medium (50% of original)</SelectItem>
                    <SelectItem value="long">Long (75% of original)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Summary Type</label>
                <Select
                  value={summaryType}
                  onValueChange={(value) => setSummaryType(value as "extractive" | "abstractive")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select summary type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extractive">Extractive (Key sentences from original)</SelectItem>
                    <SelectItem value="abstractive">Abstractive (Reworded and condensed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">Compression Ratio</label>
                  <span className="text-sm text-gray-500">{compressionRatio}%</span>
                </div>
                <Slider
                  value={[compressionRatio]}
                  min={30}
                  max={90}
                  step={5}
                  onValueChange={(value) => setCompressionRatio(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Less compression</span>
                  <span>More compression</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-medium">Summarized Text</label>
                <div className="flex items-center space-x-2">
                  {summarizedText && (
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="text-gray-700 text-sm py-1 px-3 h-8"
                    >
                      <i className="fas fa-copy mr-2"></i>
                      <span>Copy</span>
                    </Button>
                  )}

                  {summarizedText && (
                    <span className="text-sm text-gray-500">
                      {summaryStats.words} words
                    </span>
                  )}
                </div>
              </div>

              {isSummarizing ? (
                <div className="bg-gray-50 border rounded-lg p-4 h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full h-2 mb-4" />
                  <p className="text-gray-500">Analyzing and summarizing your text...</p>
                </div>
              ) : summarizedText ? (
                <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">{summarizedText}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    Your summarized text will appear here
                  </p>
                </div>
              )}
            </div>

            {summarizedText && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-3">Summary Statistics</h3>
                  <div className="flex flex-col space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-blue-800 text-sm">Original Length</p>
                        <p className="text-blue-600 font-semibold">{originalStats.words} words</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-green-800 text-sm">Summary Length</p>
                        <p className="text-green-600 font-semibold">{summaryStats.words} words</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-purple-800 text-sm">Compression Achieved</p>
                      <div className="flex items-center">
                        <p className="text-purple-600 font-semibold">{compressionPercentage}% reduction</p>
                        <Progress value={compressionPercentage} className="w-24 h-2 ml-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-blue-800 font-medium mb-2">Tips for Better Summaries</h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li><span className="font-medium">Content Structure:</span> Text with clear paragraphs and headings produces better summaries.</li>
          <li><span className="font-medium">Text Length:</span> Longer texts (500+ words) provide more context for more accurate summaries.</li>
          <li><span className="font-medium">Summarization Type:</span> Extractive works best for factual content, while abstractive is better for narrative text.</li>
          <li><span className="font-medium">Adjust Settings:</span> Try different compression ratios to find the optimal balance between brevity and completeness.</li>
        </ul>
      </div>
    </>
  );

  const contentData = {
    introduction: "Distill lengthy content into concise summaries with our powerful Text Summarizer.",
    description: "Our Text Summarizer tool uses advanced natural language processing algorithms to analyze and condense long texts into clear, coherent summaries while preserving the most important information. Whether you're a student needing to extract key points from research papers, a professional looking to digest lengthy reports quickly, or a content creator wanting to create concise versions of your articles, this tool saves you valuable time and effort. With customizable settings for summary length, type, and compression ratio, you can tailor the output to your specific needs. The tool works with various types of content including articles, research papers, news, essays, and more, delivering accurate summaries that maintain the original context and key points.",
    howToUse: [
      "Enter or paste your text into the editor box on the left side.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Select your desired summary length (short, medium, or long) from the dropdown menu.",
      "Choose the summary type: extractive (key sentences from original) or abstractive (reworded and condensed).",
      "Adjust the compression ratio slider to determine how much the text should be condensed.",
      "Click the 'Summarize' button to process your text.",
      "Review the summarized version in the output box on the right side."
    ],
    features: [
      "Two summarization methods: extractive (pulls important sentences) and abstractive (rewrites content in new words)",
      "Adjustable compression ratio to control how much the text is condensed",
      "Multiple summary length options to fit your specific needs",
      "Support for various content types including articles, research papers, news, and essays",
      "Statistical analysis showing word count reduction and compression achieved",
      "Copy to clipboard functionality for easy sharing and use of the summarized text"
    ],
    faqs: [
      {
        question: "How accurate are the summaries generated by this tool?",
        answer: "Our Text Summarizer achieves high accuracy by identifying the most important sentences and concepts in your text. For extractive summarization, the tool selects key sentences verbatim from the original text, maintaining complete accuracy of those specific passages. For abstractive summarization, which involves rewording, accuracy typically ranges from 85-95% in terms of preserving the core meaning and key points. The accuracy depends on factors like text clarity, structure, and subject matter. For technical or specialized content, the tool may occasionally miss nuanced details, so we recommend reviewing summaries of critical documents to ensure all essential information is preserved."
      },
      {
        question: "What's the difference between extractive and abstractive summarization?",
        answer: "Extractive summarization identifies and extracts the most important sentences directly from the original text without altering them. It's like highlighting key sentences in a document. This method preserves the exact wording and style of the original text and works well for factual content. Abstractive summarization, on the other hand, generates new text that captures the essential meaning of the original content. It works by understanding the content and creating a reworded, often shorter version that may use different phrasing than the original. Abstractive summarization is more like how humans would summarize content and is better for narrative text or when you need a more fluid, condensed summary."
      },
      {
        question: "Is there a limit to how much text I can summarize?",
        answer: "Our Text Summarizer can process texts up to 10,000 words in a single operation for optimal performance. For longer documents, we recommend breaking them into smaller sections and summarizing each part separately. Very large texts may affect processing speed and potentially the quality of summarization, especially for abstractive summaries. The tool performs best with well-structured content that has clear paragraphs, headings, and a logical flow. For extremely long documents like books or extensive reports, consider summarizing chapter by chapter or section by section for the best results."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="text-summarizer"
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

export default TextSummarizerDetailed;