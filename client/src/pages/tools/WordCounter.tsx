import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const WordCounter = () => {
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
    // Scroll to the top when the component mounts
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

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Word Counter</h1>
              <p className="text-gray-600">Count words, characters, sentences, and paragraphs in your text.</p>
            </div>

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
                  <label className="btn-primary cursor-pointer">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
