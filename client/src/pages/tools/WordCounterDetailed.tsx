import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const WordCounterDetailed = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    document.title = "Word Counter - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Calculate text statistics
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text === "" ? 0 : (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text === "" ? 0 : text.split(/\n+/).filter(para => para.trim() !== "").length;
    
    // Average reading speed is 200-250 words per minute
    const readingTime = Math.ceil(words / 225);
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText("");
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
      <Tabs defaultValue="text-input" className="mb-6">
        <TabsList>
          <TabsTrigger value="text-input">Text Input</TabsTrigger>
          <TabsTrigger value="file-upload">File Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text-input">
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              className="w-full h-64 p-4 resize-none"
            />
            
            <div className="mt-4">
              <Button onClick={clearText} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear Text</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="file-upload">
          <div className="mt-6 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl mb-4"></i>
            <p className="mb-4 text-gray-600">Upload a text file to count words</p>
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

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Words</p>
                <p className="text-2xl font-bold text-primary">{stats.words}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Characters</p>
                <p className="text-2xl font-bold text-primary">{stats.characters}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Characters (no spaces)</p>
                <p className="text-2xl font-bold text-primary">{stats.charactersNoSpaces}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Sentences</p>
                <p className="text-2xl font-bold text-primary">{stats.sentences}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Paragraphs</p>
                <p className="text-2xl font-bold text-primary">{stats.paragraphs}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Reading Time</p>
                <p className="text-2xl font-bold text-primary">{stats.readingTime} min</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Count words, characters, and more with our comprehensive Word Counter tool.",
    description: "Our Word Counter is an essential tool for writers, students, and professionals who need to keep track of their text statistics. It instantly counts words, characters, sentences, and paragraphs while also estimating reading time. Whether you're working within word limits for an essay, optimizing content length for SEO, or just curious about your writing metrics, this tool provides all the data you need in one simple interface.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) by switching to the 'File Upload' tab.",
      "The statistics are calculated automatically as you type or after file upload.",
      "Review the comprehensive statistics in the results section below the input area.",
      "Use the 'Clear Text' button to reset the input and start over with new text."
    ],
    features: [
      "Instant real-time counting with no need to click any buttons",
      "Accurate word count that ignores extra spaces between words",
      "Character count with and without spaces for different requirements",
      "Sentence and paragraph counting for structural analysis",
      "Reading time estimation based on average reading speed",
      "Support for text file uploads to analyze longer documents"
    ],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer: "Reading time is calculated based on an average reading speed of 225 words per minute, which is the standard for adult readers. The calculation takes the total word count and divides it by this average reading speed to estimate how long it would take to read the text."
      },
      {
        question: "Does the Word Counter work with different languages?",
        answer: "Yes, our Word Counter works with most languages that use space-separated words. However, the word count may not be as accurate for character-based languages like Chinese or Japanese where words aren't separated by spaces."
      },
      {
        question: "Can I use this tool for SEO content optimization?",
        answer: "Absolutely! The Word Counter is perfect for SEO content optimization. It helps you maintain optimal content length, ensure readability, and manage keyword density by providing clear metrics about your text."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="word-counter"
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

export default WordCounterDetailed;