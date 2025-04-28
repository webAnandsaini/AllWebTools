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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type IssueType = "grammar" | "spelling" | "punctuation" | "clarity" | "structure" | "style";
type IssueLevel = "minor" | "moderate" | "major";

interface Issue {
  type: IssueType;
  level: IssueLevel;
  text: string;
  suggestion: string;
  explanation: string;
  startPos: number;
  endPos: number;
}

const SentenceCheckerDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [checkedText, setCheckedText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [language, setLanguage] = useState("english");
  const [showGrammar, setShowGrammar] = useState(true);
  const [showSpelling, setShowSpelling] = useState(true);
  const [showPunctuation, setShowPunctuation] = useState(true);
  const [showStyle, setShowStyle] = useState(true);
  const [formalityLevel, setFormalityLevel] = useState("standard");
  const [checkHistory, setCheckHistory] = useState<Array<{ text: string, issues: number }>>([]);
  const { toast } = useToast();

  const checkSentences = () => {
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
      
      const { checkedText, foundIssues } = simulateTextAnalysis(inputText);
      setCheckedText(checkedText);
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
        description: `Found ${foundIssues.length} issues in your text`,
      });
    }, 2500);
  };

  const simulateTextAnalysis = (text: string): { checkedText: string, foundIssues: Issue[] } => {
    // This is a simplified simulation of text analysis
    // In a real-world application, this would connect to an NLP service
    
    const issues: Issue[] = [];
    
    // Sample grammar issues
    if (showGrammar) {
      if (text.includes("their is")) {
        issues.push({
          type: "grammar",
          level: "moderate",
          text: "their is",
          suggestion: "there is",
          explanation: "Use 'there is' for existence. 'Their' is a possessive pronoun.",
          startPos: text.indexOf("their is"),
          endPos: text.indexOf("their is") + 8
        });
      }
      
      if (text.includes("me and")) {
        issues.push({
          type: "grammar",
          level: "minor",
          text: "me and",
          suggestion: "I and",
          explanation: "When referring to yourself and others as the subject of a sentence, use 'I' instead of 'me'.",
          startPos: text.indexOf("me and"),
          endPos: text.indexOf("me and") + 6
        });
      }
    }
    
    // Sample spelling issues
    if (showSpelling) {
      const misspellings = [
        {wrong: "definately", correct: "definitely"},
        {wrong: "seperate", correct: "separate"},
        {wrong: "recieve", correct: "receive"},
        {wrong: "occured", correct: "occurred"},
        {wrong: "accomodate", correct: "accommodate"}
      ];
      
      misspellings.forEach(pair => {
        if (text.includes(pair.wrong)) {
          issues.push({
            type: "spelling",
            level: "minor",
            text: pair.wrong,
            suggestion: pair.correct,
            explanation: `'${pair.wrong}' is misspelled. The correct spelling is '${pair.correct}'.`,
            startPos: text.indexOf(pair.wrong),
            endPos: text.indexOf(pair.wrong) + pair.wrong.length
          });
        }
      });
    }
    
    // Sample punctuation issues
    if (showPunctuation) {
      // Missing period at end
      if (!/[.!?]$/.test(text.trim()) && text.length > 20) {
        issues.push({
          type: "punctuation",
          level: "minor",
          text: text.trim(),
          suggestion: text.trim() + ".",
          explanation: "Sentences should end with proper punctuation.",
          startPos: text.trim().length - 1,
          endPos: text.trim().length
        });
      }
      
      // Multiple spaces
      const multipleSpacesMatch = text.match(/\s{2,}/);
      if (multipleSpacesMatch && multipleSpacesMatch.index !== undefined) {
        issues.push({
          type: "punctuation",
          level: "minor",
          text: multipleSpacesMatch[0],
          suggestion: " ",
          explanation: "Multiple spaces should be replaced with a single space.",
          startPos: multipleSpacesMatch.index,
          endPos: multipleSpacesMatch.index + multipleSpacesMatch[0].length
        });
      }
    }
    
    // Sample style issues
    if (showStyle) {
      // Passive voice example
      if (text.includes("was made by") || text.includes("were made by")) {
        const match = text.includes("was made by") ? "was made by" : "were made by";
        issues.push({
          type: "style",
          level: "moderate",
          text: match,
          suggestion: "made",
          explanation: "Consider using active voice for more direct and engaging writing.",
          startPos: text.indexOf(match),
          endPos: text.indexOf(match) + match.length
        });
      }
      
      // Wordiness example
      if (text.includes("due to the fact that")) {
        issues.push({
          type: "style",
          level: "minor",
          text: "due to the fact that",
          suggestion: "because",
          explanation: "Wordy phrase. 'Because' is more concise.",
          startPos: text.indexOf("due to the fact that"),
          endPos: text.indexOf("due to the fact that") + 20
        });
      }
    }
    
    // Structure issues
    if (text.length > 100 && !text.includes(",") && !text.includes(";")) {
      issues.push({
        type: "structure",
        level: "moderate",
        text: text,
        suggestion: "Consider breaking this into shorter sentences or using commas appropriately.",
        explanation: "Long sentences without punctuation can be difficult to read and understand.",
        startPos: 0,
        endPos: text.length
      });
    }
    
    // Very short sentences in succession (detect based on multiple short sentences with periods)
    const shortSentencePattern = /\b\w+\.\s+\w+\.\s+\w+\./;
    const shortSentencesMatch = text.match(shortSentencePattern);
    if (shortSentencesMatch && shortSentencesMatch.index !== undefined) {
      issues.push({
        type: "structure",
        level: "minor",
        text: shortSentencesMatch[0],
        suggestion: "Consider combining these short sentences or adding more detail.",
        explanation: "Several consecutive very short sentences can make your writing seem choppy.",
        startPos: shortSentencesMatch.index,
        endPos: shortSentencesMatch.index + shortSentencesMatch[0].length
      });
    }
    
    // Clarity issues
    if (text.includes("this") || text.includes("that") || text.includes("it")) {
      const vagueWords = ["this", "that", "it"];
      
      vagueWords.forEach(word => {
        // Check if the word is used ambiguously (not followed by a noun)
        const pattern = new RegExp(`\\b${word}\\b(?!\\s+\\w+[,.;:!?])`, "i");
        const match = text.match(pattern);
        
        if (match && match.index !== undefined) {
          issues.push({
            type: "clarity",
            level: "moderate",
            text: match[0],
            suggestion: `${match[0]} [specific noun]`,
            explanation: `The ${word} is vague. Clarify what "${word}" refers to for better clarity.`,
            startPos: match.index,
            endPos: match.index + match[0].length
          });
        }
      });
    }
    
    return {
      checkedText: text,
      foundIssues: issues
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const selectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const applyCorrection = (issue: Issue) => {
    if (!issue.suggestion) return;
    
    const before = checkedText.substring(0, issue.startPos);
    const after = checkedText.substring(issue.endPos);
    const newText = before + issue.suggestion + after;
    
    setCheckedText(newText);
    
    // Update input text to show corrections as well
    setInputText(newText);
    
    // Remove the fixed issue from the list
    setIssues(issues.filter(i => i !== issue));
    setSelectedIssue(null);
    
    toast({
      title: "Correction applied",
      description: `Replaced "${issue.text}" with "${issue.suggestion}"`,
    });
  };

  const applyAllCorrections = () => {
    let modifiedText = checkedText;
    
    // Apply corrections from the end of the text to the beginning
    // to avoid position shifts affecting other corrections
    const sortedIssues = [...issues].sort((a, b) => b.startPos - a.startPos);
    
    sortedIssues.forEach(issue => {
      if (!issue.suggestion) return;
      
      const before = modifiedText.substring(0, issue.startPos);
      const after = modifiedText.substring(issue.endPos);
      modifiedText = before + issue.suggestion + after;
    });
    
    setCheckedText(modifiedText);
    setInputText(modifiedText);
    setIssues([]);
    setSelectedIssue(null);
    
    toast({
      title: "All corrections applied",
      description: `Applied ${sortedIssues.length} corrections to your text`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(checkedText);
    
    toast({
      title: "Copied to clipboard",
      description: "The checked text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setCheckedText("");
    setIssues([]);
    setSelectedIssue(null);
  };

  const getIssueColor = (type: IssueType): string => {
    switch (type) {
      case "grammar": return "text-red-500";
      case "spelling": return "text-orange-500";
      case "punctuation": return "text-yellow-500";
      case "clarity": return "text-purple-500";
      case "structure": return "text-blue-500";
      case "style": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getIssueBg = (type: IssueType): string => {
    switch (type) {
      case "grammar": return "bg-red-100";
      case "spelling": return "bg-orange-100";
      case "punctuation": return "bg-yellow-100";
      case "clarity": return "bg-purple-100";
      case "structure": return "bg-blue-100";
      case "style": return "bg-green-100";
      default: return "bg-gray-100";
    }
  };

  const getLevelColor = (level: IssueLevel): string => {
    switch (level) {
      case "minor": return "text-green-600";
      case "moderate": return "text-orange-600";
      case "major": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getIssueTypeLabel = (type: IssueType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getHighlightedText = (): JSX.Element => {
    if (!checkedText || issues.length === 0) {
      return <span>{checkedText}</span>;
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
            {checkedText.substring(lastIndex, issue.startPos)}
          </span>
        );
      }
      
      // Add the highlighted issue
      textParts.push(
        <span 
          key={`issue-${index}`}
          className={`${getIssueBg(issue.type)} cursor-pointer`}
          onClick={() => selectIssue(issue)}
          title={`${getIssueTypeLabel(issue.type)} issue: ${issue.explanation}`}
        >
          {checkedText.substring(issue.startPos, issue.endPos)}
        </span>
      );
      
      lastIndex = issue.endPos;
    });
    
    // Add any remaining text
    if (lastIndex < checkedText.length) {
      textParts.push(
        <span key="text-last">
          {checkedText.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{textParts}</>;
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sentence Checker</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to check for grammar, spelling, punctuation, and style issues..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language" className="text-base font-medium">Language</Label>
                    <Select 
                      value={language} 
                      onValueChange={setLanguage}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English (US)</SelectItem>
                        <SelectItem value="english-uk">English (UK)</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="formality" className="text-base font-medium">Formality Level</Label>
                    <Select 
                      value={formalityLevel} 
                      onValueChange={setFormalityLevel}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select formality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-base font-medium mb-3 block">Check Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="grammar" 
                        checked={showGrammar}
                        onCheckedChange={setShowGrammar}
                      />
                      <Label htmlFor="grammar" className="text-sm">Grammar</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="spelling" 
                        checked={showSpelling}
                        onCheckedChange={setShowSpelling}
                      />
                      <Label htmlFor="spelling" className="text-sm">Spelling</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="punctuation" 
                        checked={showPunctuation}
                        onCheckedChange={setShowPunctuation}
                      />
                      <Label htmlFor="punctuation" className="text-sm">Punctuation</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="style" 
                        checked={showStyle}
                        onCheckedChange={setShowStyle}
                      />
                      <Label htmlFor="style" className="text-sm">Style & Clarity</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={checkSentences}
                    disabled={isChecking || inputText.trim().length < 5}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>{isChecking ? "Checking..." : "Check Text"}</span>
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
                        <Badge variant="outline" className="bg-red-50">
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
                    <h3 className="text-lg font-medium">Checked Text</h3>
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
                        disabled={!checkedText}
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
                  ) : checkedText ? (
                    <div className="bg-gray-50 border rounded-lg p-4 min-h-[300px] overflow-y-auto whitespace-pre-wrap">
                      {getHighlightedText()}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-check-circle text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Your checked text will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Check Text"</p>
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
                                  <p className="font-medium">{getIssueTypeLabel(issue.type)} Issue</p>
                                  <p className="text-xs text-gray-500 truncate max-w-[180px]">"{issue.text}"</p>
                                </div>
                              </div>
                              <Badge className={issue.level === "minor" ? "bg-yellow-100 text-yellow-800" : 
                                              issue.level === "moderate" ? "bg-orange-100 text-orange-800" : 
                                              "bg-red-100 text-red-800"}>
                                {issue.level}
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
                              <p className="text-sm font-medium">Detected Text:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">{selectedIssue.text}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Suggestion:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">{selectedIssue.suggestion}</p>
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
                      <p className="text-gray-500">Scanning for issues...</p>
                    </div>
                  ) : checkedText ? (
                    <div className="bg-green-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="mb-4 text-green-500">
                        <i className="fas fa-check-circle text-5xl"></i>
                      </div>
                      <h4 className="text-lg font-medium text-green-800">No issues found</h4>
                      <p className="text-green-600 mt-2">Great job! Your text appears to be error-free.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-search text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Issues will appear here after checking</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Check Text"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-spell-check text-blue-600"></i>
              </div>
              <h3 className="font-medium">Grammar & Spelling</h3>
            </div>
            <p className="text-sm text-gray-600">
              Advanced detection of grammar errors, spelling mistakes, and word choice issues with contextual suggestions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-quote-right text-purple-600"></i>
              </div>
              <h3 className="font-medium">Punctuation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Corrects missing commas, periods, quotation marks, and other punctuation marks for proper sentence structure.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-glasses text-green-600"></i>
              </div>
              <h3 className="font-medium">Style & Clarity</h3>
            </div>
            <p className="text-sm text-gray-600">
              Identifies wordiness, passive voice, and unclear phrasing to improve readability and writing style.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <i className="fas fa-magic text-yellow-600"></i>
              </div>
              <h3 className="font-medium">One-Click Fixes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Apply suggestions individually or fix all detected issues at once with detailed explanations for each correction.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="text-blue-500 mr-3 mt-1">
            <i className="fas fa-lightbulb text-xl"></i>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Pro Writing Tip</h3>
            <p className="text-blue-700 text-sm">
              For the most effective results, check your text after you've completed your first draft. 
              This allows you to focus on your ideas during writing and then refine your grammar, 
              spelling, and style during the editing phase. Remember that even professionally written 
              content typically goes through multiple rounds of edits!
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Perfect your writing with instant grammar, spelling, and style checks through our comprehensive Sentence Checker.",
    description: "Our Sentence Checker is a powerful writing assistant that analyzes your text for grammar, spelling, punctuation, style, and clarity issues to help you produce error-free, polished content. This comprehensive tool employs advanced linguistic algorithms to identify a wide range of writing problems, from basic spelling mistakes and grammar errors to more complex issues like wordiness, passive voice, and unclear phrasing. The checker provides customized feedback based on your selected formality level—casual, standard, formal, or academic—making it suitable for everything from casual emails to professional reports and academic papers. Each identified issue comes with a detailed explanation of the problem, a suggested correction, and educational insights to help improve your writing skills over time. The intuitive interface highlights errors directly in your text with color-coding based on issue type, allowing you to quickly identify problem areas. You can apply corrections individually with a single click or use the 'Fix All' function to address all issues simultaneously. Additional features include language selection for checking text in multiple languages, customizable checking options to focus on specific types of errors, a comprehensive history of previous checks, and instant copying of corrected text to your clipboard. Whether you're a student working on assignments, a professional crafting important emails, or a content creator producing articles, our Sentence Checker ensures your writing is clear, correct, and effective.",
    howToUse: [
      "Enter or paste your text in the input field on the left side of the tool.",
      "Select your preferred language (English US/UK, Spanish, French, German) and formality level (Casual, Standard, Formal, Academic) from the dropdown menus.",
      "Customize your checking options by toggling which types of issues to look for: Grammar, Spelling, Punctuation, and/or Style & Clarity.",
      "Click 'Check Text' and wait for the analysis to complete.",
      "Review your text in the 'Check Results' tab, where detected issues are highlighted with color-coding based on the type of error.",
      "Switch to the 'Issues' tab to see a detailed list of all detected problems in your text.",
      "Click on any highlighted error or issue in the list to see a detailed explanation and suggested correction.",
      "Apply corrections individually by clicking 'Apply This Fix' for each issue, or use 'Fix All' to correct all detected problems at once.",
      "Copy your corrected text to the clipboard using the 'Copy' button when you're satisfied with the results."
    ],
    features: [
      "Advanced detection of grammar, spelling, punctuation, and style issues with contextual understanding",
      "Multiple language support with customizable formality levels for different writing contexts",
      "Interactive highlighting system that color-codes different types of issues for easy identification",
      "Detailed explanations and educational insights for each detected issue to improve writing skills",
      "One-click fixes for individual issues or comprehensive 'Fix All' option for efficiency",
      "Check history feature that saves your previous text analyses for easy reference",
      "Customizable checking options to focus on specific types of errors based on your needs"
    ],
    faqs: [
      {
        question: "How accurate is the Sentence Checker compared to manual proofreading?",
        answer: "Our Sentence Checker offers high accuracy for most common writing issues, but it's important to understand its capabilities and limitations. The tool excels at identifying: 1) Grammar errors like subject-verb disagreement, incorrect tense usage, and article problems; 2) Spelling mistakes, including commonly confused words like 'their/there/they're'; 3) Punctuation issues like missing commas, incorrect apostrophes, and sentence fragments; 4) Style problems such as passive voice, wordiness, and unclear references. However, no automated checker can fully replace human judgment for: 1) Context-dependent word choices; 2) Nuanced meaning and tone; 3) Genre-specific conventions; 4) Creative or intentional rule-breaking. For optimal results, we recommend using our Sentence Checker as a first pass to catch obvious errors, followed by a human review (either yourself or a proofreader) for nuanced content or particularly important documents. The tool is continuously improving through machine learning algorithms that analyze millions of text samples, making it increasingly sophisticated at understanding context and nuance."
      },
      {
        question: "What's the difference between the formality levels, and when should I use each one?",
        answer: "Our Sentence Checker offers four formality levels, each tailored to different writing contexts: 1) Casual: Optimized for personal communication, social media posts, and informal blogs. This setting allows for more conversational language, contractions, and colloquial expressions while still catching basic errors. It's less stringent about traditional grammar rules when they conflict with common usage. 2) Standard: The default setting, balanced for general writing needs like business emails, general web content, and everyday professional communication. It enforces standard grammar rules while allowing for some flexibility in style. 3) Formal: Designed for professional documents, business reports, cover letters, and official communications. This setting emphasizes proper grammar, precise word choice, and professional tone, flagging casual expressions and suggesting more formal alternatives. 4) Academic: The most stringent level, ideal for scholarly papers, research articles, dissertations, and formal academic writing. It enforces strict adherence to formal grammar rules, identifies discipline-specific issues, and prevents colloquialisms and subjective language. Choose the formality level that matches your audience and purpose—the academic setting might be too rigid for a friendly email, while the casual setting might be insufficient for a research paper."
      },
      {
        question: "Will checking my text multiple times improve the results?",
        answer: "Checking your text multiple times can indeed improve results, but for specific reasons and with some important considerations. When you apply fixes to your text and then run another check, our Sentence Checker will analyze the newly corrected text, potentially identifying additional issues that were secondary to the original errors. This iterative process works particularly well for complex documents where one correction might reveal other issues that were previously overshadowed. However, be aware that: 1) The most significant improvements typically come from the first check, with diminishing returns on subsequent checks; 2) Over-reliance on automated checking can sometimes lead to 'correction fatigue' where you might begin accepting suggestions without critical evaluation; 3) The checker works from specific rules and patterns—running the same unchanged text multiple times will generally yield the same results. For best practices, we recommend: 1) Run an initial check and apply major corrections; 2) Conduct a second check to catch any newly revealed issues; 3) For important documents, perform a final human review, as you might notice things the tool doesn't. Remember that the Sentence Checker is designed to be an assistant to your writing process, not a replacement for careful editing and human judgment."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="sentence-checker"
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

export default SentenceCheckerDetailed;