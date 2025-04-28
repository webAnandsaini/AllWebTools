import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

interface PunctuationIssue {
  type: string;
  text: string;
  issue: string;
  suggestion: string;
  explanation: string;
  startPos: number;
  endPos: number;
}

const PunctuationCheckerDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [issues, setIssues] = useState<PunctuationIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<PunctuationIssue | null>(null);
  const [punctuationStyle, setPunctuationStyle] = useState("standard");
  const [checkCommas, setCheckCommas] = useState(true);
  const [checkPeriods, setCheckPeriods] = useState(true);
  const [checkQuotations, setCheckQuotations] = useState(true);
  const [checkApostrophes, setCheckApostrophes] = useState(true);
  const [checkHistory, setCheckHistory] = useState<Array<{ text: string, issues: number }>>([]);
  const { toast } = useToast();

  const checkPunctuation = () => {
    if (inputText.trim().length < 5) {
      toast({
        title: "Text too short",
        description: "Please enter at least 5 characters to check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setProgress(0);
    setIssues([]);
    setSelectedIssue(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Simulate checking by calling a function that analyzes the text
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const { newText, foundIssues } = analyzePunctuation(inputText);
      setCorrectedText(newText);
      setIssues(foundIssues);
      setIsChecking(false);
      
      // Add to history
      if (foundIssues.length > 0) {
        setCheckHistory(prev => [{
          text: inputText.length > 50 ? inputText.substring(0, 50) + "..." : inputText,
          issues: foundIssues.length
        }, ...prev].slice(0, 5));
      }
      
      toast({
        title: "Check complete",
        description: `Found ${foundIssues.length} punctuation issues in your text`,
      });
    }, 2500);
  };

  const analyzePunctuation = (text: string): { newText: string, foundIssues: PunctuationIssue[] } => {
    // This is a simplified simulation of punctuation analysis
    // In a real-world application, this would connect to an NLP service
    
    const issues: PunctuationIssue[] = [];
    let modifiedText = text;
    
    // Check for missing periods at end of sentences
    if (checkPeriods) {
      // Sentences ending without proper punctuation
      const sentenceEndPattern = /(\w+)(\s+)([A-Z])/g;
      let periodMatch;
      
      while ((periodMatch = sentenceEndPattern.exec(text)) !== null) {
        const startPos = periodMatch.index;
        const endPos = startPos + periodMatch[1].length;
        
        issues.push({
          type: "period",
          text: periodMatch[1],
          issue: "Missing period",
          suggestion: periodMatch[1] + ".",
          explanation: "A sentence should end with proper punctuation (period, question mark, or exclamation point).",
          startPos,
          endPos
        });
      }
    }
    
    // Check for comma issues
    if (checkCommas) {
      // Missing comma after introductory phrase
      const introPhrasesPattern = /(However|Nevertheless|Moreover|Furthermore|In addition|For example|On the other hand)(\s+)(\w+)/g;
      let commaMatch;
      
      while ((commaMatch = introPhrasesPattern.exec(text)) !== null) {
        const startPos = commaMatch.index;
        const endPos = startPos + commaMatch[1].length;
        
        if (commaMatch[0].indexOf(",") === -1) {
          issues.push({
            type: "comma",
            text: commaMatch[1],
            issue: "Missing comma after introductory phrase",
            suggestion: commaMatch[1] + ",",
            explanation: "Introductory phrases should be followed by a comma to separate them from the main clause.",
            startPos,
            endPos
          });
        }
      }
      
      // Missing commas in a list of three or more items
      const listPattern = /(\w+)( and | or )(\w+)( and | or )(\w+)/g;
      let listMatch;
      
      while ((listMatch = listPattern.exec(text)) !== null) {
        if (listMatch[0].indexOf(",") === -1) {
          const startPos = listMatch.index;
          const endPos = startPos + listMatch[1].length + listMatch[2].length + listMatch[3].length;
          
          issues.push({
            type: "comma",
            text: listMatch[1] + listMatch[2] + listMatch[3],
            issue: "Missing comma in a list",
            suggestion: listMatch[1] + "," + listMatch[2] + listMatch[3],
            explanation: "In a list of three or more items, use commas to separate the items (Oxford/serial comma).",
            startPos,
            endPos
          });
        }
      }
    }
    
    // Check for quotation issues
    if (checkQuotations) {
      // Unclosed quotation marks
      const openingQuotes = (text.match(/"/g) || []).length;
      const closingQuotes = (text.match(/"/g) || []).length;
      
      if (openingQuotes > closingQuotes) {
        // Find the last opening quote without a closing pair
        const lastQuotePos = text.lastIndexOf("\"");
        
        if (lastQuotePos !== -1) {
          issues.push({
            type: "quotation",
            text: text.substring(lastQuotePos, Math.min(lastQuotePos + 20, text.length)),
            issue: "Unclosed quotation marks",
            suggestion: "Add a closing quotation mark at the appropriate position",
            explanation: "Each opening quotation mark should have a matching closing quotation mark.",
            startPos: lastQuotePos,
            endPos: lastQuotePos + 1
          });
        }
      }
      
      // Check for period/comma placement with quotation marks (American style)
      if (punctuationStyle === "american") {
        const outsidePunctPattern = /"([^"]+)"([.,])/g;
        let americanMatch;
        
        while ((americanMatch = outsidePunctPattern.exec(text)) !== null) {
          const startPos = americanMatch.index;
          const endPos = startPos + americanMatch[0].length;
          
          issues.push({
            type: "quotation",
            text: americanMatch[0],
            issue: "Punctuation outside quotation marks",
            suggestion: americanMatch[0].replace("\"" + americanMatch[2], americanMatch[2] + "\""),
            explanation: "In American English, periods and commas go inside quotation marks.",
            startPos,
            endPos
          });
        }
      }
      
      // Check for period/comma placement with quotation marks (British style)
      if (punctuationStyle === "british") {
        const insidePunctPattern = /"([^"]+[.,])"/g;
        let britishMatch;
        
        while ((britishMatch = insidePunctPattern.exec(text)) !== null) {
          const startPos = britishMatch.index;
          const endPos = startPos + britishMatch[0].length;
          
          issues.push({
            type: "quotation",
            text: britishMatch[0],
            issue: "Punctuation inside quotation marks",
            suggestion: britishMatch[0].replace(britishMatch[1], britishMatch[1].substring(0, britishMatch[1].length - 1)) + britishMatch[1].substring(britishMatch[1].length - 1) + "\"",
            explanation: "In British English, periods and commas go outside quotation marks unless part of the quoted material.",
            startPos,
            endPos
          });
        }
      }
    }
    
    // Check for apostrophe issues
    if (checkApostrophes) {
      // Incorrect possessive apostrophes for plural nouns
      const pluralPossessivePattern = /(\w+)s'(\s+)/g;
      let apostropheMatch;
      
      while ((apostropheMatch = pluralPossessivePattern.exec(text)) !== null) {
        // Check if it's a common plural possessive exception
        const exceptions = ["kids", "boys", "girls", "parents"];
        if (!exceptions.includes(apostropheMatch[1].toLowerCase() + "s")) {
          const startPos = apostropheMatch.index;
          const endPos = startPos + apostropheMatch[1].length + 2;
          
          issues.push({
            type: "apostrophe",
            text: apostropheMatch[1] + "s'",
            issue: "Potential incorrect apostrophe usage",
            suggestion: apostropheMatch[1] + "'s",
            explanation: "Use 's for singular possession and s' for plural possession. Verify if this noun is singular or plural.",
            startPos,
            endPos
          });
        }
      }
      
      // Common apostrophe mistakes
      const commonMistakes = [
        { wrong: "its been", correct: "it's been", explanation: "\"It's\" is a contraction of \"it is\" or \"it has\"." },
        { wrong: "whos ", correct: "who's ", explanation: "\"Who's\" is a contraction of \"who is\" or \"who has\"." },
        { wrong: "your welcome", correct: "you're welcome", explanation: "\"You're\" is a contraction of \"you are\"." },
        { wrong: "they're book", correct: "their book", explanation: "\"Their\" is the possessive form of \"they\"." },
        { wrong: "its a", correct: "it's a", explanation: "\"It's\" is a contraction of \"it is\"." }
      ];
      
      commonMistakes.forEach(mistake => {
        let pos = text.indexOf(mistake.wrong);
        while (pos !== -1) {
          issues.push({
            type: "apostrophe",
            text: mistake.wrong,
            issue: "Incorrect apostrophe usage",
            suggestion: mistake.correct,
            explanation: mistake.explanation,
            startPos: pos,
            endPos: pos + mistake.wrong.length
          });
          
          pos = text.indexOf(mistake.wrong, pos + 1);
        }
      });
    }
    
    // Double punctuation
    const doublePunctPattern = /([.,:;!?])(\s*)([.,:;!?])/g;
    let doublePunctMatch;
    
    while ((doublePunctMatch = doublePunctPattern.exec(text)) !== null) {
      const startPos = doublePunctMatch.index;
      const endPos = startPos + doublePunctMatch[0].length;
      
      // Exclude legitimate cases like ellipsis (...)
      if (!(doublePunctMatch[1] === "." && doublePunctMatch[3] === "." && text.substring(startPos, startPos + 3) === "...")) {
        issues.push({
          type: "double",
          text: doublePunctMatch[0],
          issue: "Double punctuation",
          suggestion: doublePunctMatch[1],
          explanation: "Avoid using multiple punctuation marks in succession unless using ellipsis (...).",
          startPos,
          endPos
        });
      }
    }
    
    // Extra spaces before punctuation
    const spaceBeforePunctPattern = /(\s+)([.,:;!?])/g;
    let spaceMatch;
    
    while ((spaceMatch = spaceBeforePunctPattern.exec(text)) !== null) {
      const startPos = spaceMatch.index;
      const endPos = startPos + spaceMatch[0].length;
      
      issues.push({
        type: "spacing",
        text: spaceMatch[0],
        issue: "Space before punctuation mark",
        suggestion: spaceMatch[2],
        explanation: "Punctuation marks should not have spaces before them.",
        startPos,
        endPos
      });
    }
    
    return {
      newText: modifiedText,
      foundIssues: issues
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const selectIssue = (issue: PunctuationIssue) => {
    setSelectedIssue(issue);
  };

  const applyCorrection = (issue: PunctuationIssue) => {
    if (!issue.suggestion) return;
    
    const before = correctedText.substring(0, issue.startPos);
    const after = correctedText.substring(issue.endPos);
    const newText = before + issue.suggestion + after;
    
    setCorrectedText(newText);
    
    // Update input text to show corrections as well
    setInputText(newText);
    
    // Remove the fixed issue from the list
    setIssues(issues.filter(i => i !== issue));
    setSelectedIssue(null);
    
    toast({
      title: "Correction applied",
      description: `Fixed "${issue.text}" issue`,
    });
  };

  const applyAllCorrections = () => {
    let modifiedText = correctedText;
    
    // Apply corrections from the end of the text to the beginning
    // to avoid position shifts affecting other corrections
    const sortedIssues = [...issues].sort((a, b) => b.startPos - a.startPos);
    
    sortedIssues.forEach(issue => {
      if (!issue.suggestion) return;
      
      const before = modifiedText.substring(0, issue.startPos);
      const after = modifiedText.substring(issue.endPos);
      modifiedText = before + issue.suggestion + after;
    });
    
    setCorrectedText(modifiedText);
    setInputText(modifiedText);
    setIssues([]);
    setSelectedIssue(null);
    
    toast({
      title: "All corrections applied",
      description: `Applied ${sortedIssues.length} punctuation corrections to your text`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText);
    
    toast({
      title: "Copied to clipboard",
      description: "The corrected text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setCorrectedText("");
    setIssues([]);
    setSelectedIssue(null);
  };

  const getIssueColor = (type: string): string => {
    switch (type) {
      case "period": return "text-red-500";
      case "comma": return "text-orange-500";
      case "quotation": return "text-purple-500";
      case "apostrophe": return "text-blue-500";
      case "double": return "text-green-500";
      case "spacing": return "text-indigo-500";
      default: return "text-gray-500";
    }
  };

  const getIssueBg = (type: string): string => {
    switch (type) {
      case "period": return "bg-red-100";
      case "comma": return "bg-orange-100";
      case "quotation": return "bg-purple-100";
      case "apostrophe": return "bg-blue-100";
      case "double": return "bg-green-100";
      case "spacing": return "bg-indigo-100";
      default: return "bg-gray-100";
    }
  };

  const getHighlightedText = (): JSX.Element => {
    if (!correctedText || issues.length === 0) {
      return <span>{correctedText}</span>;
    }
    
    // Sort issues by start position
    const sortedIssues = [...issues].sort((a, b) => a.startPos - b.startPos);
    
    // Build the highlighted text
    const textParts: JSX.Element[] = [];
    let lastIndex = 0;
    
    sortedIssues.forEach((issue, index) => {
      // Add text before the issue
      if (issue.startPos > lastIndex) {
        textParts.push(
          <span key={`text-${index}`}>
            {correctedText.substring(lastIndex, issue.startPos)}
          </span>
        );
      }
      
      // Add the highlighted issue
      textParts.push(
        <span 
          key={`issue-${index}`}
          className={`${getIssueBg(issue.type)} cursor-pointer`}
          onClick={() => selectIssue(issue)}
          title={`${issue.issue}: ${issue.explanation}`}
        >
          {correctedText.substring(issue.startPos, issue.endPos)}
        </span>
      );
      
      lastIndex = issue.endPos;
    });
    
    // Add any remaining text
    if (lastIndex < correctedText.length) {
      textParts.push(
        <span key="text-last">
          {correctedText.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{textParts}</>;
  };

  const getIssueTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Punctuation Checker</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to check for punctuation issues..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="punctuation-style" className="text-base font-medium">Punctuation Style</Label>
                    <Select 
                      value={punctuationStyle} 
                      onValueChange={setPunctuationStyle}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="american">American Style</SelectItem>
                        <SelectItem value="british">British Style</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {punctuationStyle === "american" 
                        ? "American style places periods and commas inside quotation marks."
                        : punctuationStyle === "british"
                        ? "British style places periods and commas outside quotation marks unless part of the quoted material."
                        : "Standard style checks for common punctuation issues."}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-base font-medium mb-3 block">Check Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-commas" 
                        checked={checkCommas}
                        onCheckedChange={setCheckCommas}
                      />
                      <Label htmlFor="check-commas" className="text-sm">Comma Usage</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-periods" 
                        checked={checkPeriods}
                        onCheckedChange={setCheckPeriods}
                      />
                      <Label htmlFor="check-periods" className="text-sm">Period Usage</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-quotations" 
                        checked={checkQuotations}
                        onCheckedChange={setCheckQuotations}
                      />
                      <Label htmlFor="check-quotations" className="text-sm">Quotation Marks</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-apostrophes" 
                        checked={checkApostrophes}
                        onCheckedChange={setCheckApostrophes}
                      />
                      <Label htmlFor="check-apostrophes" className="text-sm">Apostrophes</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={checkPunctuation}
                    disabled={isChecking || inputText.trim().length < 5}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>{isChecking ? "Checking..." : "Check Punctuation"}</span>
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    <span>Clear</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {checkHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Check History</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {checkHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setInputText(item.text.endsWith("...") ? "" : item.text)}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{item.text}</p>
                        <Badge variant="outline" className="bg-red-50 text-red-500">
                          {item.issues} {item.issues === 1 ? 'issue' : 'issues'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4">
          <Tabs defaultValue="check" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="check">Check Results</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                {issues.length > 0 && (
                  <Badge className="ml-2 bg-red-500">{issues.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="check">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Corrected Text</h3>
                    <div className="flex gap-2">
                      {issues.length > 0 && (
                        <Button
                          onClick={applyAllCorrections}
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <i className="fas fa-magic mr-2"></i>
                          <span>Fix All</span>
                        </Button>
                      )}
                      <Button
                        onClick={copyToClipboard}
                        disabled={!correctedText}
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        <i className="fas fa-copy mr-2"></i>
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>
                  
                  {isChecking ? (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <Progress value={progress} className="w-full mb-4" />
                      <p className="text-gray-500">Checking your text...</p>
                      <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                    </div>
                  ) : correctedText ? (
                    <div className="bg-gray-50 border rounded-lg p-4 min-h-[300px] overflow-y-auto whitespace-pre-wrap">
                      {getHighlightedText()}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-quote-right text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Your checked text will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Check Punctuation"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Detected Issues</h3>
                  
                  {issues.length > 0 ? (
                    <div className="space-y-4">
                      <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {issues.map((issue, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg cursor-pointer border ${
                              selectedIssue === issue ? 'border-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => selectIssue(issue)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full ${getIssueBg(issue.type)} flex items-center justify-center mr-2`}>
                                  <i className={`fas fa-exclamation-circle ${getIssueColor(issue.type)}`}></i>
                                </div>
                                <div>
                                  <p className="font-medium">{issue.issue}</p>
                                  <p className="text-xs text-gray-500 truncate max-w-[180px]">"{issue.text}"</p>
                                </div>
                              </div>
                              <Badge className={getIssueBg(issue.type)}>
                                {getIssueTypeLabel(issue.type)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {selectedIssue ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Issue Details</h4>
                            <Badge className={`${getIssueBg(selectedIssue.type)} ${getIssueColor(selectedIssue.type)} border-0`}>
                              {getIssueTypeLabel(selectedIssue.type)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium">Current Text:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">"{selectedIssue.text}"</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Suggestion:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">"{selectedIssue.suggestion}"</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Explanation:</p>
                              <p className="text-sm">{selectedIssue.explanation}</p>
                            </div>
                            
                            <Button
                              onClick={() => applyCorrection(selectedIssue)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <i className="fas fa-check mr-2"></i>
                              <span>Apply This Fix</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-gray-500">Select an issue to see details and fix suggestions</p>
                        </div>
                      )}
                    </div>
                  ) : isChecking ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="animate-spin mb-4">
                        <i className="fas fa-circle-notch text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-500">Scanning for punctuation issues...</p>
                    </div>
                  ) : correctedText ? (
                    <div className="bg-green-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="mb-4 text-green-500">
                        <i className="fas fa-check-circle text-5xl"></i>
                      </div>
                      <h4 className="text-lg font-medium text-green-800">No punctuation issues found</h4>
                      <p className="text-green-600 mt-2">Great job! Your text has proper punctuation.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-search text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Punctuation issues will appear here after checking</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Check Punctuation"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Punctuation Guide</h3>
              <Tabs defaultValue="commas" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="commas">Commas</TabsTrigger>
                  <TabsTrigger value="quotation">Quotation Marks</TabsTrigger>
                  <TabsTrigger value="apostrophes">Apostrophes</TabsTrigger>
                  <TabsTrigger value="periods">Periods</TabsTrigger>
                </TabsList>
                
                <TabsContent value="commas" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <div className="space-y-2">
                    <p className="font-medium">Common Comma Rules:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Use commas to separate items in a list</li>
                      <li>Place a comma after introductory phrases</li>
                      <li>Use commas to separate independent clauses with coordinating conjunctions</li>
                      <li>Set off non-essential information with commas</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="quotation" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <div className="space-y-2">
                    <p className="font-medium">Quotation Mark Rules:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Every opening quotation mark needs a closing quotation mark</li>
                      <li>In American English, periods and commas go inside quotation marks</li>
                      <li>In British English, periods and commas go outside quotation marks unless part of the quoted material</li>
                      <li>Quotation marks indicate direct speech, quotations, or titles of short works</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="apostrophes" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <div className="space-y-2">
                    <p className="font-medium">Apostrophe Rules:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Use 's to show singular possession (e.g., the dog's bone)</li>
                      <li>Use s' to show plural possession (e.g., the dogs' bones)</li>
                      <li>Use apostrophes in contractions to show where letters are omitted (e.g., don't, it's)</li>
                      <li>Don't use apostrophes to make plural forms (e.g., CDs not CD's)</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="periods" className="p-4 bg-gray-50 rounded-lg mt-3">
                  <div className="space-y-2">
                    <p className="font-medium">Period Rules:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Use a period at the end of a complete sentence</li>
                      <li>Use a period after most abbreviations (e.g., Dr., Inc., etc.)</li>
                      <li>Use three periods for an ellipsis (...) to indicate omitted text</li>
                      <li>Don't use a period after titles or headings</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-check-double text-blue-600"></i>
              </div>
              <h3 className="font-medium">Style Options</h3>
            </div>
            <p className="text-sm text-gray-600">
              Support for both American and British punctuation styles with customizable checking options for different needs.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-highlighter text-purple-600"></i>
              </div>
              <h3 className="font-medium">Visual Highlighting</h3>
            </div>
            <p className="text-sm text-gray-600">
              Color-coded issue identification that makes it easy to spot different types of punctuation problems in your text.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-magic text-green-600"></i>
              </div>
              <h3 className="font-medium">One-Click Fixes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Apply corrections to individual issues or fix all punctuation problems at once with detailed explanations.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <i className="fas fa-book text-yellow-600"></i>
              </div>
              <h3 className="font-medium">Punctuation Guide</h3>
            </div>
            <p className="text-sm text-gray-600">
              Built-in reference guide for commas, quotation marks, apostrophes, and periods to improve punctuation knowledge.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="text-blue-500 mr-3 mt-1">
            <i className="fas fa-info-circle text-xl"></i>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Punctuation Style Differences</h3>
            <p className="text-blue-700 text-sm">
              American and British English have different conventions for quotation mark punctuation.
              In American English, periods and commas go inside quotation marks (e.g., "text," and "text.").
              In British English, periods and commas go outside quotation marks unless they're part of the quoted material
              (e.g., "text", and "text".). Choose the appropriate style for your audience.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Perfect your writing with precise punctuation checks and instant corrections using our specialized Punctuation Checker.",
    description: "Our Punctuation Checker is a specialized text analysis tool that examines your writing specifically for punctuation errors and inconsistencies to help you create flawlessly punctuated content. The tool meticulously scans your text to identify and correct common punctuation issues including misplaced or missing commas, period usage errors, quotation mark inconsistencies, and apostrophe mistakes. Supporting both American and British punctuation styles, the checker adapts to your preferred writing conventions – particularly important for quotation mark rules, where American style places periods and commas inside quotation marks, while British style typically places them outside. The intuitive interface highlights potential issues directly in your text with distinct color-coding based on the type of problem, allowing for quick identification of different categories of punctuation errors. Each identified issue comes with a specific explanation and correction suggestion, helping you not only fix the immediate error but also improve your understanding of punctuation rules for future writing. You can apply corrections individually with a single click, learning from each fix, or use the 'Fix All' function to instantly correct all detected problems at once. Additional features include customizable checking options to focus on specific punctuation marks, a comprehensive history of previous checks, one-click copying of corrected text, and an integrated punctuation guide that provides quick reference rules for commas, quotation marks, apostrophes, and periods. Whether you're a student polishing an essay, a professional preparing important correspondence, or a writer editing draft content, our Punctuation Checker ensures your writing communicates clearly and professionally without distracting punctuation errors.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the checker.",
      "Select your preferred punctuation style from the dropdown menu: Standard, American Style, or British Style.",
      "Customize your checking options by toggling which types of punctuation to examine: Comma Usage, Period Usage, Quotation Marks, and/or Apostrophes.",
      "Click 'Check Punctuation' and wait for the analysis to complete.",
      "Review your text in the 'Check Results' tab, where detected issues are highlighted with color-coding based on the type of punctuation error.",
      "Switch to the 'Issues' tab to see a detailed list of all detected punctuation problems in your text.",
      "Click on any highlighted error or issue in the list to see a detailed explanation and suggested correction.",
      "Apply corrections individually by clicking 'Apply This Fix' for each issue, or use 'Fix All' to correct all detected problems at once.",
      "Reference the 'Punctuation Guide' tabs below the results for quick access to common punctuation rules."
    ],
    features: [
      "Support for both American and British punctuation styles with customizable checking options",
      "Color-coded issue identification that makes different types of punctuation problems visually distinguishable",
      "Detailed explanations with each issue that teach proper punctuation rules while correcting errors",
      "One-click fixes for individual issues or comprehensive 'Fix All' option for quick correction",
      "Integrated punctuation guide with reference rules for commas, quotation marks, apostrophes, and periods",
      "Check history feature that saves your previous text analyses for easy reference",
      "Side-by-side view of issues and your text to easily locate and understand punctuation errors"
    ],
    faqs: [
      {
        question: "What's the difference between American and British punctuation styles?",
        answer: "The primary difference between American and British punctuation styles relates to how they handle quotation marks and their interaction with other punctuation marks: 1) American Style: Periods and commas are placed inside quotation marks, regardless of whether they're part of the quoted material. For example: She said, \"I'm going to the store.\" The movie was described as \"entertaining,\" but I found it boring. 2) British Style: Periods and commas are placed outside quotation marks unless they're part of the quoted material. For example: She said, \"I'm going to the store\". The movie was described as \"entertaining\", but I found it boring. Both styles are consistent in placing question marks and exclamation points based on whether they belong to the quoted material. Other minor differences include: British English sometimes uses single quotation marks ('like this') where American English prefers double quotation marks (\"like this\"). British style tends to use fewer commas than American style, particularly with elements like dates, addresses, and certain phrases. Our punctuation checker adapts to your selected style preference, applying the appropriate rules to your text."
      },
      {
        question: "Why do most punctuation errors go unnoticed in regular proofreading?",
        answer: "Punctuation errors frequently slip through during regular proofreading for several key reasons: 1) Cognitive Auto-correction: Our brains tend to automatically fill in what should be there rather than what actually is there. We mentally insert missing commas or correct apostrophe usage without consciously noticing the errors. 2) Focus on Content: When proofreading, we often prioritize checking for spelling mistakes, word choice issues, and overall meaning, giving less attention to small punctuation marks. 3) Punctuation Rule Complexity: Many punctuation rules have exceptions or vary by style guide, making consistent application difficult without specialized knowledge. 4) Visual Subtlety: Punctuation marks are small visual elements that don't stand out compared to misspelled words or grammatical errors. 5) Reading Flow: When reading for flow and comprehension, we process punctuation subconsciously rather than analytically. Our Punctuation Checker addresses these challenges by: Systematically analyzing text specifically for punctuation issues; Color-coding different types of punctuation problems to make them visually distinct; Providing specific explanations that build punctuation knowledge; And offering immediate corrections with educational context. This specialized approach catches the subtle punctuation issues that general proofreading might miss, resulting in more polished, professional writing."
      },
      {
        question: "Can punctuation really change the meaning of my writing?",
        answer: "Yes, punctuation can dramatically alter the meaning of your writing, sometimes with significant consequences. Consider these examples: 1) Missing comma changing meaning: \"Let's eat, Grandma\" (inviting Grandma to eat) vs. \"Let's eat Grandma\" (suggesting cannibalism). 2) Apostrophe placement altering possession: \"The dogs' bones\" (bones belonging to multiple dogs) vs. \"The dog's bones\" (bones belonging to one dog). 3) Period placement changing context: \"The suspect said the witness lied. He was telling the truth.\" vs. \"The suspect said the witness lied he was telling the truth.\" 4) Semicolon vs. period affecting relationship between ideas: \"She didn't go to the party; she had too much work\" (connecting related thoughts) vs. \"She didn't go to the party. She had too much work\" (separating distinct thoughts). Beyond preventing potential misunderstandings, proper punctuation also: Signals to readers how to pace their reading and where to pause; Indicates relationships between ideas and clauses; Distinguishes between questions, statements, and exclamations; Enhances professionalism and credibility; And reflects attention to detail. In professional contexts, punctuation errors can undermine authority and trust, while in academic settings, they can affect grades and comprehension. Our Punctuation Checker helps eliminate these issues, ensuring your writing conveys exactly what you intend."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="punctuation-checker"
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

export default PunctuationCheckerDetailed;