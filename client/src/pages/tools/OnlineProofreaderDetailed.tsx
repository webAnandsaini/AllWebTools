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

interface ProofreadingIssue {
  id: string;
  type: "spelling" | "grammar" | "punctuation" | "style" | "consistency" | "wordiness" | "capitalization";
  severity: "low" | "medium" | "high";
  text: string;
  suggestion: string;
  explanation: string;
  position: {
    startIndex: number;
    endIndex: number;
  };
}

interface ProofreadingResult {
  correctedText: string;
  errorCount: number;
  suggestedImprovementCount: number;
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  issues: ProofreadingIssue[];
}

const OnlineProofreaderDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ProofreadingResult | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<ProofreadingIssue | null>(null);
  const [isProofreading, setIsProofreading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("standard");
  const [checkSpelling, setCheckSpelling] = useState(true);
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [checkPunctuation, setCheckPunctuation] = useState(true);
  const [checkStyle, setCheckStyle] = useState(true);
  const [history, setHistory] = useState<Array<{ text: string, issues: number }>>([]);
  const { toast } = useToast();

  const proofreadText = () => {
    if (inputText.trim().length < 5) {
      toast({
        title: "Text too short",
        description: "Please enter at least 5 characters to proofread",
        variant: "destructive",
      });
      return;
    }

    setIsProofreading(true);
    setProgress(0);
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

    // Simulate proofreading by generating a mock result
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const mockResult = generateMockResult(inputText, mode);
      setResult(mockResult);
      
      // Add to history
      setHistory(prev => [{
        text: inputText.length > 50 ? inputText.substring(0, 50) + "..." : inputText,
        issues: mockResult.issues.length
      }, ...prev].slice(0, 5));
      
      setIsProofreading(false);
      
      toast({
        title: "Proofreading complete",
        description: `Found ${mockResult.issues.length} issues in your text`,
      });
    }, 2000);
  };

  const generateMockResult = (text: string, proofreadingMode: string): ProofreadingResult => {
    // Calculate basic stats
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Approx. 200 words per minute
    const readabilityScore = Math.floor(Math.random() * 30) + 50; // Random score between 50-80
    
    // Detect common errors
    const issues: ProofreadingIssue[] = [];
    
    // Spelling errors
    if (checkSpelling) {
      const commonMisspellings = [
        { wrong: "teh", correct: "the", explanation: "Common keyboard error switching 'h' and 'e'" },
        { wrong: "recieve", correct: "receive", explanation: "Remember the rule: 'i before e except after c'" },
        { wrong: "definately", correct: "definitely", explanation: "Commonly misspelled word; there is no 'a' in 'definitely'" },
        { wrong: "seperate", correct: "separate", explanation: "Common misspelling; note the middle 'a'" },
        { wrong: "occured", correct: "occurred", explanation: "Double 'c', double 'r' is correct for this word" },
        { wrong: "accomodate", correct: "accommodate", explanation: "Remember the double 'c' and double 'm'" },
        { wrong: "wierd", correct: "weird", explanation: "Another example of 'i before e except after c'" },
        { wrong: "alot", correct: "a lot", explanation: "'A lot' is always written as two words" },
      ];
      
      commonMisspellings.forEach(mistake => {
        // Case insensitive search for misspellings
        const regex = new RegExp(`\\b${mistake.wrong}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          issues.push({
            id: `spelling-${issues.length}`,
            type: "spelling",
            severity: "medium",
            text: match[0],
            suggestion: mistake.correct,
            explanation: mistake.explanation,
            position: {
              startIndex: match.index,
              endIndex: match.index + match[0].length
            }
          });
        }
      });
    }
    
    // Grammar errors
    if (checkGrammar) {
      const grammarRules = [
        { 
          pattern: /\b(is|are|was|were)\s+(at|in|on)\s+the\s+(\w+)\s+of\b/gi,
          suggestion: "replaces unnecessary prepositions",
          explanation: "Wordy construction. Try to be more direct."
        },
        { 
          pattern: /\b(me|him|her|them|us)\s+(and|or)\s+(I|he|she|they|we)\b/gi,
          suggestion: "correct pronoun order",
          explanation: "Correct pronoun order puts the subject pronoun (I, he, she, etc.) second."
        },
        { 
          pattern: /\b(less)\s+(\w+s)\b/gi,
          suggestion: "fewer $2",
          explanation: "Use 'fewer' with countable nouns and 'less' with uncountable nouns."
        },
        { 
          pattern: /\b(me|I|myself)\s+and\s+(him|her|them)\b/gi,
          suggestion: "pronoun order correction",
          explanation: "When using pronouns together, place yourself last in the list."
        }
      ];
      
      grammarRules.forEach(rule => {
        let match;
        while ((match = rule.pattern.exec(text)) !== null) {
          issues.push({
            id: `grammar-${issues.length}`,
            type: "grammar",
            severity: "high",
            text: match[0],
            suggestion: rule.suggestion.includes("$2") 
              ? rule.suggestion.replace("$2", match[2]) 
              : rule.suggestion,
            explanation: rule.explanation,
            position: {
              startIndex: match.index,
              endIndex: match.index + match[0].length
            }
          });
        }
      });
    }
    
    // Punctuation errors
    if (checkPunctuation) {
      // Check for common punctuation issues
      const punctuationRules = [
        { 
          pattern: /\s+([.,;:!?])/g,
          suggestion: "$1",
          explanation: "There should be no space before punctuation marks."
        },
        { 
          pattern: /([.,;:!?])([A-Za-z])/g,
          suggestion: "$1 $2",
          explanation: "There should be a space after punctuation marks."
        },
        { 
          pattern: /\b(however|nevertheless|moreover|furthermore|therefore|consequently|indeed),/gi,
          suggestion: "transitional word punctuation",
          explanation: "When transitional words start a sentence, they should be followed by a comma."
        },
        {
          pattern: /,\s+(and|or|but)\s+/g,
          suggestion: " $1 ",
          explanation: "Don't use a comma before a coordinating conjunction that joins two independent clauses."
        }
      ];
      
      punctuationRules.forEach(rule => {
        let match;
        while ((match = rule.pattern.exec(text)) !== null) {
          issues.push({
            id: `punctuation-${issues.length}`,
            type: "punctuation",
            severity: "medium",
            text: match[0],
            suggestion: rule.suggestion.includes("$1") 
              ? match[0].replace(rule.pattern, rule.suggestion) 
              : rule.suggestion,
            explanation: rule.explanation,
            position: {
              startIndex: match.index,
              endIndex: match.index + match[0].length
            }
          });
        }
      });
    }
    
    // Style and consistency issues
    if (checkStyle) {
      // Check for style issues based on mode
      const styleRules = [
        { 
          pattern: /\b(very|really|extremely|quite|basically|actually|literally)\s+(\w+)\b/gi,
          suggestion: "stronger word choice",
          explanation: "Intensifiers like 'very' and 'really' often weaken writing. Use a stronger, more specific word instead."
        },
        { 
          pattern: /\b(in order to|due to the fact that|in spite of the fact that|on account of|in the event that)\b/gi,
          suggestion: "simpler alternative",
          explanation: "Wordy phrase. Use a simpler alternative like 'to', 'because', 'although', 'from', or 'if'."
        },
        {
          pattern: /\b(there is|there are|it is)\s+(\w+)\s+that\b/gi,
          suggestion: "more direct construction",
          explanation: "This is an expletive construction that weakens writing. Try to identify the real subject and use it directly."
        }
      ];
      
      // Only check style in non-casual modes
      if (mode !== "casual") {
        styleRules.forEach(rule => {
          let match;
          while ((match = rule.pattern.exec(text)) !== null) {
            issues.push({
              id: `style-${issues.length}`,
              type: "style",
              severity: "low",
              text: match[0],
              suggestion: rule.suggestion,
              explanation: rule.explanation,
              position: {
                startIndex: match.index,
                endIndex: match.index + match[0].length
              }
            });
          }
        });
      }
      
      // Check for consistency in capitalization
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      sentences.forEach((sentence, index) => {
        if (!/^[A-Z]/.test(sentence.trim()) && sentence.trim().length > 0) {
          const startIndexInText = text.indexOf(sentence);
          issues.push({
            id: `capitalization-${index}`,
            type: "capitalization",
            severity: "medium",
            text: sentence.trim().substring(0, 15) + "...",
            suggestion: sentence.trim().charAt(0).toUpperCase() + sentence.trim().substring(1),
            explanation: "Sentences should begin with a capital letter.",
            position: {
              startIndex: startIndexInText,
              endIndex: startIndexInText + 1
            }
          });
        }
      });
      
      // Check for wordiness based on mode
      if (mode === "formal" || mode === "academic") {
        // Look for repeated adjacent words
        const repeatedWordPattern = /\b(\w+)\s+\1\b/gi;
        let match;
        while ((match = repeatedWordPattern.exec(text)) !== null) {
          issues.push({
            id: `wordiness-${issues.length}`,
            type: "wordiness",
            severity: "medium",
            text: match[0],
            suggestion: match[1],
            explanation: "Repeated adjacent words. Remove one instance.",
            position: {
              startIndex: match.index,
              endIndex: match.index + match[0].length
            }
          });
        }
      }
    }
    
    // For mode-specific checks
    if (mode === "academic") {
      // Add academic-specific checks (avoiding first person, passive voice detection, etc.)
      if (checkStyle) {
        const academicRules = [
          {
            pattern: /\b(I|we|my|our)\b/gi,
            suggestion: "Use third person (The research/This study/The results) instead",
            explanation: "Academic writing typically avoids first-person pronouns in favor of more objective language."
          },
          {
            pattern: /\b(a lot of|lots of|kind of|sort of)\b/gi,
            suggestion: "Use precise language (many, numerous, somewhat, relatively)",
            explanation: "Academic writing requires precise language rather than casual expressions."
          }
        ];
        
        academicRules.forEach(rule => {
          let match;
          while ((match = rule.pattern.exec(text)) !== null) {
            issues.push({
              id: `academic-style-${issues.length}`,
              type: "style",
              severity: "high",
              text: match[0],
              suggestion: rule.suggestion,
              explanation: rule.explanation,
              position: {
                startIndex: match.index,
                endIndex: match.index + match[0].length
              }
            });
          }
        });
      }
    }
    
    // Simulate some corrections in the text
    let correctedText = text;
    
    // Apply simple corrections for demonstration
    if (issues.length > 0) {
      // Sort issues from end to beginning to avoid position shifts
      const sortedIssues = [...issues].sort((a, b) => b.position.startIndex - a.position.startIndex);
      
      sortedIssues.forEach(issue => {
        if (issue.type === "spelling" || issue.type === "punctuation") {
          const before = correctedText.substring(0, issue.position.startIndex);
          const after = correctedText.substring(issue.position.endIndex);
          
          // For punctuation and spelling, we can directly apply the fix if it's simple
          if (typeof issue.suggestion === "string" && !issue.suggestion.includes("$") && 
              !["simpler alternative", "stronger word choice", "more direct construction", 
                "transitional word punctuation", "correct pronoun order", "pronoun order correction"].includes(issue.suggestion)) {
            correctedText = before + issue.suggestion + after;
          }
        }
      });
    }
    
    return {
      correctedText,
      errorCount: issues.filter(i => i.severity === "high" || i.severity === "medium").length,
      suggestedImprovementCount: issues.filter(i => i.severity === "low").length,
      wordCount,
      readingTime,
      readabilityScore,
      issues
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleModeChange = (value: string) => {
    setMode(value);
  };

  const selectIssue = (issue: ProofreadingIssue) => {
    setSelectedIssue(issue);
  };

  const applyFix = (issue: ProofreadingIssue) => {
    if (!result || !issue.suggestion) return;
    
    // For suggestions that are actual text replacements (not just descriptions)
    if (typeof issue.suggestion === "string" && 
        !["simpler alternative", "stronger word choice", "more direct construction", 
          "transitional word punctuation", "correct pronoun order", "pronoun order correction"].includes(issue.suggestion)) {
      
      const before = result.correctedText.substring(0, issue.position.startIndex);
      const after = result.correctedText.substring(issue.position.endIndex);
      const newText = before + issue.suggestion + after;
      
      setResult({
        ...result,
        correctedText: newText,
        issues: result.issues.filter(i => i !== issue)
      });
      
      setSelectedIssue(null);
      
      toast({
        title: "Correction applied",
        description: `Fixed "${issue.text}"`,
      });
    } else {
      // For suggestions that require manual intervention
      toast({
        title: "Manual correction needed",
        description: `This issue requires your judgment to fix. See the explanation for guidance.`,
      });
    }
  };

  const applyAllFixes = () => {
    if (!result) return;
    
    // Only auto-apply fixes for spelling and punctuation issues
    // Style and grammar often need human judgment
    const fixableIssues = result.issues.filter(issue => 
      (issue.type === "spelling" || issue.type === "punctuation" || issue.type === "capitalization" || issue.type === "wordiness") &&
      typeof issue.suggestion === "string" && 
      !["simpler alternative", "stronger word choice", "more direct construction", 
        "transitional word punctuation", "correct pronoun order", "pronoun order correction"].includes(issue.suggestion)
    );
    
    if (fixableIssues.length === 0) {
      toast({
        title: "No automatic fixes available",
        description: "The remaining issues require your judgment to fix.",
      });
      return;
    }
    
    let newText = result.correctedText;
    
    // Apply fixes from end to beginning to avoid position shifts
    const sortedIssues = [...fixableIssues].sort((a, b) => b.position.startIndex - a.position.startIndex);
    
    sortedIssues.forEach(issue => {
      const before = newText.substring(0, issue.position.startIndex);
      const after = newText.substring(issue.position.endIndex);
      newText = before + issue.suggestion + after;
    });
    
    // Remove fixed issues
    const remainingIssues = result.issues.filter(issue => !fixableIssues.includes(issue));
    
    setResult({
      ...result,
      correctedText: newText,
      issues: remainingIssues
    });
    
    setSelectedIssue(null);
    
    toast({
      title: "Applied all automatic fixes",
      description: `Fixed ${fixableIssues.length} issues. Some issues may require manual attention.`,
    });
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result.correctedText);
    
    toast({
      title: "Copied to clipboard",
      description: "The corrected text has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setInputText("");
    setResult(null);
    setSelectedIssue(null);
  };

  const getIssueColor = (type: string): string => {
    switch (type) {
      case "spelling": return "text-red-500";
      case "grammar": return "text-amber-500";
      case "punctuation": return "text-green-500";
      case "style": return "text-blue-500";
      case "consistency": return "text-purple-500";
      case "wordiness": return "text-indigo-500";
      case "capitalization": return "text-pink-500";
      default: return "text-gray-500";
    }
  };

  const getIssueBg = (type: string): string => {
    switch (type) {
      case "spelling": return "bg-red-50";
      case "grammar": return "bg-amber-50";
      case "punctuation": return "bg-green-50";
      case "style": return "bg-blue-50";
      case "consistency": return "bg-purple-50";
      case "wordiness": return "bg-indigo-50";
      case "capitalization": return "bg-pink-50";
      default: return "bg-gray-50";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "low": return "text-green-500";
      case "medium": return "text-amber-500";
      case "high": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getSeverityBg = (severity: string): string => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIssueTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getHighlightedText = (): JSX.Element => {
    if (!result || result.issues.length === 0) {
      return <p className="whitespace-pre-wrap">{result?.correctedText || ""}</p>;
    }
    
    // Sort issues by start position
    const sortedIssues = [...result.issues].sort((a, b) => a.position.startIndex - b.position.startIndex);
    
    // Build the highlighted text
    const textParts: JSX.Element[] = [];
    let lastIndex = 0;
    
    sortedIssues.forEach((issue, index) => {
      // Add text before the issue
      if (issue.position.startIndex > lastIndex) {
        textParts.push(
          <span key={`text-${index}`}>
            {result.correctedText.substring(lastIndex, issue.position.startIndex)}
          </span>
        );
      }
      
      // Add the highlighted issue
      textParts.push(
        <span 
          key={`issue-${index}`}
          className={`${getIssueBg(issue.type)} cursor-pointer px-0.5 rounded`}
          onClick={() => selectIssue(issue)}
          title={`${getIssueTypeLabel(issue.type)} issue: ${issue.explanation}`}
        >
          {result.correctedText.substring(issue.position.startIndex, issue.position.endIndex)}
        </span>
      );
      
      lastIndex = issue.position.endIndex;
    });
    
    // Add any remaining text
    if (lastIndex < result.correctedText.length) {
      textParts.push(
        <span key="text-last">
          {result.correctedText.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{textParts}</>;
  };

  const getIssueCount = (type: string): number => {
    if (!result) return 0;
    return result.issues.filter(issue => issue.type === type).length;
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Online Proofreader</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-base font-medium">Enter Your Text</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Type or paste your text here to proofread..."
                    value={inputText}
                    onChange={handleInputChange}
                    className="h-40 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proofreading-mode" className="text-base font-medium">Proofreading Mode</Label>
                    <Select 
                      value={mode} 
                      onValueChange={handleModeChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {mode === "casual" 
                        ? "Focuses on major errors while allowing for casual expressions and style"
                        : mode === "formal"
                        ? "Suggests formal language and style appropriate for professional content"
                        : mode === "academic"
                        ? "Enforces academic writing standards with precise language and third-person perspective"
                        : "Balanced proofreading for general purpose writing"}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-base font-medium mb-3 block">Check Options</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-spelling" 
                        checked={checkSpelling}
                        onCheckedChange={setCheckSpelling}
                      />
                      <Label htmlFor="check-spelling" className="text-sm">Spelling</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-grammar" 
                        checked={checkGrammar}
                        onCheckedChange={setCheckGrammar}
                      />
                      <Label htmlFor="check-grammar" className="text-sm">Grammar</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-punctuation" 
                        checked={checkPunctuation}
                        onCheckedChange={setCheckPunctuation}
                      />
                      <Label htmlFor="check-punctuation" className="text-sm">Punctuation</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="check-style" 
                        checked={checkStyle}
                        onCheckedChange={setCheckStyle}
                      />
                      <Label htmlFor="check-style" className="text-sm">Style & Consistency</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={proofreadText}
                    disabled={isProofreading || inputText.trim().length < 5}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>{isProofreading ? "Proofreading..." : "Proofread Text"}</span>
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
          
          {history.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Recent Checks</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {history.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setInputText(item.text.endsWith("...") ? "" : item.text)}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate max-w-[200px]">{item.text}</p>
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
          <Tabs defaultValue="result" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="result">Proofread Result</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                {result && (
                  <Badge className="ml-2 bg-red-500">{result.issues.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="result">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Proofread Text</h3>
                    <div className="flex space-x-2">
                      {result && result.issues.length > 0 && (
                        <Button
                          onClick={applyAllFixes}
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <i className="fas fa-magic mr-2"></i>
                          <span>Auto-Fix All</span>
                        </Button>
                      )}
                      <Button
                        onClick={copyToClipboard}
                        disabled={!result}
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        <i className="fas fa-copy mr-2"></i>
                        <span>Copy</span>
                      </Button>
                    </div>
                  </div>
                  
                  {isProofreading ? (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <Progress value={progress} className="w-full mb-4" />
                      <p className="text-gray-500">Proofreading your text...</p>
                      <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border rounded-lg p-4 min-h-[180px] overflow-y-auto">
                        {getHighlightedText()}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Text Statistics</h4>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Word Count</p>
                            <p className="font-medium text-blue-800">{result.wordCount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Reading Time</p>
                            <p className="font-medium text-blue-800">{result.readingTime} min</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Errors</p>
                            <p className="font-medium text-blue-800">{result.errorCount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Improvements</p>
                            <p className="font-medium text-blue-800">{result.suggestedImprovementCount}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {["spelling", "grammar", "punctuation", "style", "capitalization", "wordiness"].map(type => {
                          const count = getIssueCount(type);
                          if (count === 0) return null;
                          
                          return (
                            <Badge 
                              key={type}
                              className={`${getIssueBg(type)} ${getIssueColor(type)} border-0`}
                            >
                              {getIssueTypeLabel(type)}: {count}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-check-double text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Your proofread text will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Proofread Text"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Detected Issues</h3>
                  
                  {result && result.issues.length > 0 ? (
                    <div className="space-y-4">
                      <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {result.issues.map((issue, index) => (
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
                              <Badge className={getSeverityBg(issue.severity)}>
                                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
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
                              <p className="text-sm font-medium">Text:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">"{selectedIssue.text}"</p>
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
                              onClick={() => applyFix(selectedIssue)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={!selectedIssue.suggestion || 
                                ["simpler alternative", "stronger word choice", "more direct construction", 
                                  "transitional word punctuation", "correct pronoun order", "pronoun order correction"].includes(selectedIssue.suggestion)}
                            >
                              <i className="fas fa-check mr-2"></i>
                              <span>
                                {!selectedIssue.suggestion || 
                                  ["simpler alternative", "stronger word choice", "more direct construction", 
                                    "transitional word punctuation", "correct pronoun order", "pronoun order correction"].includes(selectedIssue.suggestion)
                                  ? "Manual Fix Required"
                                  : "Apply This Fix"}
                              </span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <p className="text-gray-500">Select an issue to see details and fix suggestions</p>
                        </div>
                      )}
                    </div>
                  ) : isProofreading ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="animate-spin mb-4">
                        <i className="fas fa-circle-notch text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-500">Scanning for issues...</p>
                    </div>
                  ) : result ? (
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
                      <p className="text-gray-500">Issues will appear here after proofreading</p>
                      <p className="text-gray-400 text-sm mt-2">Enter text and click "Proofread Text"</p>
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
              <h3 className="font-medium">Multi-Level Checking</h3>
            </div>
            <p className="text-sm text-gray-600">
              Comprehensive proofreading covering spelling, grammar, punctuation, and style with adjustable modes for different writing contexts.
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
              Apply instant corrections for spelling, punctuation, and other common errors with a single click or use Auto-Fix for multiple issues.
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
              Color-coded issue highlighting makes different types of errors easy to identify and understand at a glance.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <i className="fas fa-graduation-cap text-amber-600"></i>
              </div>
              <h3 className="font-medium">Educational Feedback</h3>
            </div>
            <p className="text-sm text-gray-600">
              Detailed explanations for each issue help you understand the rules and improve your writing skills over time.
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
            <h3 className="font-medium text-blue-800 mb-1">Proofreading Modes Explained</h3>
            <p className="text-blue-700 text-sm">
              <span className="font-medium">Casual:</span> Ideal for emails, social media posts, and informal writing. Focuses on major errors while allowing conversational style and expressions. <br/>
              <span className="font-medium">Standard:</span> Balanced for general writing like blog posts, reports, and everyday professional communication. <br/>
              <span className="font-medium">Formal:</span> Recommended for professional content, business documents, and customer-facing communications. Emphasizes proper language and avoids casual expressions. <br/>
              <span className="font-medium">Academic:</span> Designed for research papers, essays, and scholarly writing. Enforces strict academic conventions including third-person perspective and precise language.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Perfect your writing with instant spelling, grammar, punctuation, and style checks in one powerful online proofreader.",
    description: "Our Online Proofreader is a comprehensive text analysis tool that identifies and corrects errors in spelling, grammar, punctuation, and style to help you produce polished, error-free content. The tool offers multiple proofreading modes—Casual, Standard, Formal, and Academic—each tailored to different writing contexts with specific detection rules and style suggestions appropriate for various content types. The casual mode focuses primarily on critical errors while allowing for conversational language, the standard mode offers balanced checking for general writing, the formal mode suggests more professional language and structure, and the academic mode enforces scholarly conventions including third-person perspective and precise terminology. Each detected issue is highlighted with intuitive color-coding based on type (spelling, grammar, punctuation, style, capitalization, wordiness), making it easy to distinguish between different categories of errors at a glance. The proofreader not only identifies errors but provides educational value by explaining each issue with a clear rationale and suggestion, helping users understand writing principles rather than just fixing mistakes. The one-click correction feature allows users to apply individual suggestions instantly, while the Auto-Fix function can correct multiple spelling and punctuation errors simultaneously. For issues requiring human judgment, such as style recommendations, the tool provides guidance while allowing users to make the final decision. The interface presents both a full view of the corrected text with highlights and a detailed issues list that can be sorted by type and severity. Additional features include comprehensive text statistics (word count, reading time, error count), customizable checking options that allow users to focus on specific error types, and a check history that saves recent proofreading sessions. Whether you're writing an important email, preparing a business document, crafting academic papers, or creating online content, the Online Proofreader ensures your writing is polished, professional, and error-free.",
    howToUse: [
      "Paste or type your text into the input field on the left side of the proofreader.",
      "Select the appropriate proofreading mode for your content: Casual (for informal writing), Standard (for general content), Formal (for professional documents), or Academic (for scholarly writing).",
      "Customize your checking options by toggling which aspects to examine: Spelling, Grammar, Punctuation, and/or Style & Consistency.",
      "Click 'Proofread Text' and wait for the system to process your content.",
      "Review your text in the 'Proofread Result' tab, where detected issues are highlighted with color-coding based on the type of error.",
      "Click on any highlighted error to see detailed information about the issue and suggested corrections.",
      "Switch to the 'Issues' tab to see a comprehensive list of all detected problems in your text.",
      "Apply corrections individually by selecting an issue and clicking 'Apply This Fix', or use the 'Auto-Fix All' button to correct multiple issues at once.",
      "Copy your corrected text to the clipboard using the 'Copy' button when you're satisfied with the results."
    ],
    features: [
      "Multiple proofreading modes (Casual, Standard, Formal, Academic) with tailored checking criteria for different writing contexts",
      "Comprehensive error detection covering spelling, grammar, punctuation, style, consistency, wordiness, and capitalization",
      "Color-coded issue highlighting that makes different types of errors visually distinguishable for easier review",
      "One-click corrections for individual errors and Auto-Fix functionality for correcting multiple issues simultaneously",
      "Educational explanations for each detected issue to help improve your writing skills over time"
    ],
    faqs: [
      {
        question: "How does the Online Proofreader differ for each of the writing modes?",
        answer: "Each writing mode in our Online Proofreader applies different rule sets and detection thresholds tailored to specific content types: 1) Casual Mode is optimized for informal communications like personal emails, social media posts, and conversational writing. It primarily focuses on spelling, significant grammar issues, and major punctuation errors while being more permissive about conversational expressions, contractions, and informal phrasing. Style checks are minimal, allowing for a more relaxed writing style. 2) Standard Mode provides balanced proofreading suitable for general writing such as blog posts, basic business communications, and everyday content. It applies conventional grammar and punctuation rules while maintaining moderate style checking that flags obvious issues like wordiness and inconsistency but allows for some stylistic flexibility. 3) Formal Mode enforces more rigorous standards appropriate for professional documents, business proposals, and customer-facing communications. It flags informal language, suggests more precise phrasing, identifies passive voice overuse, and applies stricter consistency rules. This mode emphasizes clarity, professionalism, and proper structure. 4) Academic Mode implements the strictest checking designed specifically for scholarly writing. It identifies informal language, personal pronouns (I, we, my), casual expressions, imprecise terminology, and other elements inappropriate for academic work. This mode enforces conventions such as third-person perspective, formal language, and precise phrasing expected in research papers, essays, and academic publications. Each mode not only applies different rules but also adjusts the severity rating of issues—what might be flagged as a high-severity issue in Academic mode might be medium or low severity in Casual mode. This contextual approach ensures you receive appropriate feedback for your specific writing purpose."
      },
      {
        question: "What's the difference between 'errors' and 'suggested improvements' in the results?",
        answer: "Our proofreading tool distinguishes between errors and suggested improvements to help you prioritize your editing efforts: 1) Errors are issues that are objectively incorrect according to established language rules and conventions. These include: Spelling mistakes (wrong word spellings); Grammar errors (subject-verb disagreement, incorrect verb tense, etc.); Punctuation problems (missing periods, incorrect comma usage); and Capitalization errors (missing capital letters at sentence beginnings). Errors are typically marked with high or medium severity indicators and should generally be fixed to ensure correct, standard writing. 2) Suggested Improvements are stylistic recommendations that could enhance your writing but aren't technically wrong. These include: Wordiness (phrases that could be more concise); Style suggestions (passive voice alternatives, stronger word choices); Consistency recommendations (maintaining consistent formatting or terminology); and Clarity enhancements (restructuring complex sentences). Improvements are typically marked with low severity indicators and represent opportunities to refine your writing rather than corrections of mistakes. The distinction helps you approach editing in two phases: first correcting objective errors to ensure correctness, then considering stylistic improvements to enhance quality. This separation is particularly helpful when proofreading lengthy documents, as you can focus on critical errors first and then address stylistic refinements if time permits. It also respects your authorial voice by clearly differentiating between necessary corrections and optional stylistic choices."
      },
      {
        question: "Why can't some issues be fixed automatically with the Auto-Fix feature?",
        answer: "The Auto-Fix feature is intentionally limited to certain types of issues for important reasons: 1) Context-Dependent Corrections: Many grammar and style issues require understanding of context that current AI technology cannot reliably interpret. For example, choosing between 'affect' and 'effect' depends on specific sentence meaning, or selecting the right replacement for a wordy phrase requires understanding the author's intended emphasis. 2) Stylistic Judgment: Style suggestions often involve subjective choices that should reflect the author's voice and purpose. For instance, while we might suggest replacing 'very important' with 'crucial', this is ultimately a stylistic preference rather than an objective correction. 3) Multiple Valid Options: Some issues have multiple potential fixes, each with slightly different nuances. For example, fixing a passive voice sentence could be done several ways, each with subtle differences in emphasis. 4) Educational Value: Manual correction of certain issues helps writers learn language principles better than automatic fixes, improving skills over time. The Auto-Fix feature therefore focuses on: Spelling errors with clear corrections; Straightforward punctuation issues (spaces before/after marks, etc.); Simple capitalization fixes; and Duplicate word removal. For more complex issues, we provide detailed guidance but leave the final decision to you. This approach ensures the integrity of your writing while still offering substantial time savings through automation of clear-cut corrections. In academic or professional contexts particularly, this human-in-the-loop approach provides better results than fully automated correction."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="online-proofreader"
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

export default OnlineProofreaderDetailed;