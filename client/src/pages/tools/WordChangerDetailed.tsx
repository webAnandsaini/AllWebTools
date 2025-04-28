import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const WordChangerDetailed = () => {
  const [text, setText] = useState("");
  const [resultText, setResultText] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [replacementWord, setReplacementWord] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [changeMode, setChangeMode] = useState("single");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWordOnly, setWholeWordOnly] = useState(true);
  const [wordPairs, setWordPairs] = useState<{original: string; replacement: string}[]>([]);
  const [replacementCount, setReplacementCount] = useState(0);
  const [recentlyChanged, setRecentlyChanged] = useState<{word: string; count: number}[]>([]);
  const { toast } = useToast();

  const addWordPair = () => {
    if (targetWord.trim() === "" || replacementWord.trim() === "") {
      toast({
        title: "Error",
        description: "Both original and replacement words are required",
        variant: "destructive",
      });
      return;
    }

    // Add new word pair
    setWordPairs([...wordPairs, { original: targetWord, replacement: replacementWord }]);
    
    // Clear input fields
    setTargetWord("");
    setReplacementWord("");
  };

  const removeWordPair = (index: number) => {
    const updatedPairs = [...wordPairs];
    updatedPairs.splice(index, 1);
    setWordPairs(updatedPairs);
  };

  const processText = () => {
    if (text.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    if (changeMode === "single" && targetWord.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a word to replace",
        variant: "destructive",
      });
      return;
    }

    if (changeMode === "single" && replacementWord.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a replacement word",
        variant: "destructive",
      });
      return;
    }

    if (changeMode === "multiple" && wordPairs.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one word pair",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          performReplacement();
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);
  };

  const performReplacement = () => {
    let result = text;
    let count = 0;
    const changedWords: { word: string; count: number }[] = [];

    if (changeMode === "single") {
      // Process single word replacement
      const replacements = replaceWord(
        result, 
        targetWord, 
        replacementWord, 
        caseSensitive, 
        wholeWordOnly
      );
      result = replacements.text;
      count = replacements.count;
      
      if (count > 0) {
        changedWords.push({ word: targetWord, count });
      }
    } else {
      // Process multiple word replacements
      wordPairs.forEach(pair => {
        const replacements = replaceWord(
          result, 
          pair.original, 
          pair.replacement, 
          caseSensitive, 
          wholeWordOnly
        );
        result = replacements.text;
        
        if (replacements.count > 0) {
          changedWords.push({ word: pair.original, count: replacements.count });
          count += replacements.count;
        }
      });
    }

    setResultText(result);
    setReplacementCount(count);
    setRecentlyChanged(changedWords);

    toast({
      title: "Text Processed",
      description: `Replaced ${count} occurrence${count === 1 ? '' : 's'}`,
    });
  };

  const replaceWord = (
    text: string, 
    target: string, 
    replacement: string, 
    caseSensitive: boolean, 
    wholeWord: boolean
  ): { text: string; count: number } => {
    if (!target) return { text, count: 0 };

    let count = 0;
    let result = text;

    // Create the appropriate regular expression based on options
    let flags = "g";
    if (!caseSensitive) flags += "i";
    
    let pattern;
    if (wholeWord) {
      pattern = new RegExp(`\\b${escapeRegExp(target)}\\b`, flags);
    } else {
      pattern = new RegExp(escapeRegExp(target), flags);
    }

    // Perform replacement
    result = result.replace(pattern, (match) => {
      count++;
      
      // Preserve case if not case-sensitive
      if (!caseSensitive && replacement) {
        if (match === match.toUpperCase()) {
          return replacement.toUpperCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        }
      }
      
      return replacement;
    });

    return { text: result, count };
  };

  // Utility function to escape special characters in regex
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    toast({
      title: "Copied to clipboard",
      description: "The processed text has been copied to your clipboard",
    });
  };

  const clearAll = () => {
    setText("");
    setResultText("");
    setTargetWord("");
    setReplacementWord("");
    setWordPairs([]);
    setReplacementCount(0);
    setRecentlyChanged([]);
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="original-text" className="text-base font-medium">
                Enter Your Text
              </Label>
              <Textarea
                id="original-text"
                placeholder="Type or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-32 mt-2"
              />
              
              <div className="mt-4">
                <Label className="text-base font-medium">Replacement Mode</Label>
                <Select
                  value={changeMode}
                  onValueChange={setChangeMode}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Word Replacement</SelectItem>
                    <SelectItem value="multiple">Multiple Word Replacements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {changeMode === "single" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="target-word" className="text-sm font-medium">
                      Word to Replace
                    </Label>
                    <Input
                      id="target-word"
                      placeholder="Enter word to replace"
                      value={targetWord}
                      onChange={(e) => setTargetWord(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="replacement-word" className="text-sm font-medium">
                      Replacement Word
                    </Label>
                    <Input
                      id="replacement-word"
                      placeholder="Enter replacement word"
                      value={replacementWord}
                      onChange={(e) => setReplacementWord(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target-word" className="text-sm font-medium">
                        Word to Replace
                      </Label>
                      <Input
                        id="target-word"
                        placeholder="Enter word to replace"
                        value={targetWord}
                        onChange={(e) => setTargetWord(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="replacement-word" className="text-sm font-medium">
                        Replacement Word
                      </Label>
                      <Input
                        id="replacement-word"
                        placeholder="Enter replacement word"
                        value={replacementWord}
                        onChange={(e) => setReplacementWord(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Button 
                      onClick={addWordPair}
                      variant="outline" 
                      className="text-sm"
                    >
                      Add Word Pair
                    </Button>
                  </div>
                  
                  {wordPairs.length > 0 && (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Original Word</TableHead>
                            <TableHead>Replacement Word</TableHead>
                            <TableHead className="w-20"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wordPairs.map((pair, index) => (
                            <TableRow key={index}>
                              <TableCell>{pair.original}</TableCell>
                              <TableCell>{pair.replacement}</TableCell>
                              <TableCell>
                                <Button 
                                  onClick={() => removeWordPair(index)}
                                  variant="ghost" 
                                  className="h-8 px-2 text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="case-sensitive"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="case-sensitive" className="text-sm">
                    Case Sensitive
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="whole-word"
                    checked={wholeWordOnly}
                    onChange={(e) => setWholeWordOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="whole-word" className="text-sm">
                    Whole Words Only
                  </Label>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={processText}
                  disabled={isProcessing || text.trim() === ""}
                  className="bg-primary hover:bg-blue-700 transition"
                >
                  {isProcessing ? "Processing..." : "Process Text"}
                </Button>
                
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="border-gray-300"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-medium flex justify-between">
                <span>Processed Text</span>
                {replacementCount > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {replacementCount} replacement{replacementCount === 1 ? '' : 's'}
                  </Badge>
                )}
              </Label>
              
              {isProcessing ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-48 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Processing your text...</p>
                </div>
              ) : resultText ? (
                <div className="mt-2">
                  <div className="bg-gray-50 border rounded-lg p-4 h-48 overflow-auto">
                    <p className="whitespace-pre-wrap">{resultText}</p>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-48 flex items-center justify-center">
                  <p className="text-gray-500">
                    Your processed text will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {recentlyChanged.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-medium mb-2">Change Summary</h3>
                <div className="space-y-2">
                  {recentlyChanged.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-sm">{item.word}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {item.count} occurrence{item.count === 1 ? '' : 's'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-medium mb-2">Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use "Case Sensitive" option to match the exact case of words
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  "Whole Words Only" prevents replacing parts of larger words
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Multiple Word Replacement is useful for batch processing
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Replace specific words in your text with precision and flexibility.";
  
  const description = `
    Our Word Changer tool provides a powerful yet easy-to-use solution for replacing specific words or phrases in your text. Whether you need to update terminology, improve consistency, or simply revise your content, this tool makes the process quick and accurate.
    
    With both single word and multiple word replacement modes, you can efficiently modify your text according to your needs. The single word mode allows you to replace all instances of a specific word, while the multiple word mode enables you to define multiple word pairs for batch processing.
    
    The Word Changer tool offers advanced options including case sensitivity and whole word matching to ensure precise replacements. Case sensitivity allows you to match words exactly as typed, which is useful when working with proper nouns or acronyms. The whole word option prevents unwanted changes to larger words that contain your target word.
    
    This versatile tool can be used for various purposes, from editing documents and refining content to standardizing terminology across multiple texts. It's particularly useful for writers, editors, students, and professionals who need to maintain consistency in their documents or adapt existing text for different audiences.
  `;

  const howToUse = [
    "Enter or paste your text in the input area.",
    "Choose between Single Word Replacement or Multiple Word Replacements.",
    "For single mode, enter the word to replace and its replacement.",
    "For multiple mode, add multiple word pairs using the 'Add Word Pair' button.",
    "Set your preferences for case sensitivity and whole word matching.",
    "Click 'Process Text' to perform the replacements.",
    "Review the processed text and copy it to your clipboard if desired."
  ];

  const features = [
    "Single and multiple word replacement modes for different needs",
    "Case sensitivity option for precise matching",
    "Whole word matching to prevent unwanted partial replacements",
    "Detailed change summary showing each replaced word and count",
    "Batch processing with multiple word pairs for efficient editing",
    "Preserves original formatting and structure of your text"
  ];

  const faqs = [
    {
      question: "Can I replace phrases with the Word Changer tool?",
      answer: "Yes, you can replace phrases as well as single words. Simply enter the entire phrase in the 'Word to Replace' field and provide your desired replacement. Note that when using phrases, the 'Whole Words Only' option will ensure the phrase is only replaced when it appears as a complete unit."
    },
    {
      question: "Will the tool preserve capitalization when replacing words?",
      answer: "When case sensitivity is turned off, the tool attempts to preserve the original capitalization pattern. For example, if you replace 'word' with 'term', instances of 'Word' will become 'Term' and 'WORD' will become 'TERM'. When case sensitivity is turned on, all replacements will use the exact replacement text you provide."
    },
    {
      question: "Is there a limit to how many word pairs I can add in multiple replacement mode?",
      answer: "There is no set limit to the number of word pairs you can add for multiple replacements. However, for very large documents with many replacement pairs, you may experience slightly longer processing times. The tool is optimized for typical editing scenarios with dozens of word pairs."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="word-changer"
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

export default WordChangerDetailed;