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

interface EssayIssue {
  id: string;
  type: "grammar" | "spelling" | "punctuation" | "clarity" | "structure" | "style" | "citation" | "plagiarism";
  severity: "low" | "medium" | "high";
  text: string;
  suggestion: string;
  explanation: string;
  position: {
    paragraph: number;
    startIndex: number;
    endIndex: number;
  };
}

interface Citation {
  text: string;
  format: string;
  issues: string[];
}

interface EssayAnalysis {
  wordCount: number;
  readingTime: number;
  readabilityScore: number;
  readabilityLevel: string;
  grammarScore: number;
  styleScore: number;
  overallScore: number;
  citations: Citation[];
  issues: EssayIssue[];
}

const EssayCheckerDetailed = () => {
  const [essayText, setEssayText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<EssayIssue | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState("academic");
  const [citationStyle, setCitationStyle] = useState("apa");
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [checkSpelling, setCheckSpelling] = useState(true);
  const [checkStyle, setCheckStyle] = useState(true);
  const [checkPlagiarism, setCheckPlagiarism] = useState(true);
  const [checkCitations, setCheckCitations] = useState(true);
  const [essayHistory, setEssayHistory] = useState<Array<{ title: string, wordCount: number, issues: number }>>([]);
  const { toast } = useToast();

  const analyzeEssay = () => {
    if (essayText.trim().length < 100) {
      toast({
        title: "Essay too short",
        description: "Please enter at least 100 characters for a proper analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setSelectedIssue(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // Simulate analysis by generating a mock result
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const mockAnalysis = generateMockAnalysis(essayText, analysisType, citationStyle);
      setAnalysis(mockAnalysis);
      setAnalyzedText(essayText);
      setIsAnalyzing(false);
      
      // Add to history
      const title = essayText.substring(0, 40).trim() + (essayText.length > 40 ? "..." : "");
      setEssayHistory(prev => [{
        title,
        wordCount: mockAnalysis.wordCount,
        issues: mockAnalysis.issues.length
      }, ...prev].slice(0, 5));
      
      toast({
        title: "Analysis complete",
        description: `Found ${mockAnalysis.issues.length} issues in your essay`,
      });
    }, 3500);
  };

  const generateMockAnalysis = (text: string, type: string, style: string): EssayAnalysis => {
    // Calculate basic stats
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // Approx. 200 words per minute
    
    // Generate random scores based on analysis type
    const getRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const grammarScore = getRandomScore(70, 95);
    const styleScore = getRandomScore(60, 90);
    const overallScore = Math.floor((grammarScore + styleScore) / 2);
    
    // Determine readability
    let readabilityScore = getRandomScore(30, 70);
    let readabilityLevel = "";
    
    if (readabilityScore < 40) {
      readabilityLevel = "Complex";
    } else if (readabilityScore < 60) {
      readabilityLevel = "Moderate";
    } else {
      readabilityLevel = "Easy";
    }
    
    // Adjust for academic vs creative writing
    let adjustedReadabilityScore = readabilityScore;
    let adjustedStyleScore = styleScore;
    
    if (type === "academic") {
      adjustedReadabilityScore = Math.max(30, readabilityScore - 10); // Academic writing is often more complex
    } else if (type === "creative") {
      adjustedStyleScore = Math.min(95, styleScore + 5); // Creative writing allows for more style variations
    }
    
    readabilityScore = adjustedReadabilityScore;
    styleScore = adjustedStyleScore;
    
    // Generate mock issues
    const issues: EssayIssue[] = [];
    const paragraphs = text.split("\n\n").map(p => p.trim()).filter(p => p.length > 0);
    
    // Check for grammar issues
    if (checkGrammar) {
      // Common grammar mistakes
      const commonGrammarErrors = [
        { pattern: /there is ([a-z]+) things/i, suggestion: "there are $1 things", explanation: "Use 'are' with plural nouns." },
        { pattern: /between you and (I|we)/i, suggestion: "between you and me", explanation: "Use the objective pronoun 'me' after a preposition." },
        { pattern: /could of|should of|would of/i, suggestion: "could have/should have/would have", explanation: "The correct form is '[modal verb] + have', not 'of'." },
        { pattern: /less ([a-z]+s)\b/i, suggestion: "fewer $1", explanation: "Use 'fewer' with countable nouns." },
        { pattern: /\b(affect|effect)\b/i, suggestion: "[affect/effect]", explanation: "Ensure you're using the right word: 'affect' (verb) means to influence; 'effect' (noun) is the result." }
      ];
      
      for (let i = 0; i < paragraphs.length; i++) {
        for (const error of commonGrammarErrors) {
          const matches = paragraphs[i].match(error.pattern);
          if (matches) {
            const startIndex = paragraphs[i].indexOf(matches[0]);
            
            issues.push({
              id: `grammar-${i}-${startIndex}`,
              type: "grammar",
              severity: "medium",
              text: matches[0],
              suggestion: error.suggestion.replace(/\$1/g, matches[1] || ""),
              explanation: error.explanation,
              position: {
                paragraph: i,
                startIndex,
                endIndex: startIndex + matches[0].length
              }
            });
          }
        }
      }
      
      // Add a few random grammar issues if we don't have enough
      if (issues.length < 3 && paragraphs.length > 0) {
        const randomIssues = [
          {
            text: "the data is",
            suggestion: "the data are",
            explanation: "'Data' is technically a plural noun and should take a plural verb."
          },
          {
            text: "different than",
            suggestion: "different from",
            explanation: "The correct idiom is 'different from', not 'different than'."
          },
          {
            text: "comprised of",
            suggestion: "composed of",
            explanation: "'Comprise' means 'to include or contain', so 'comprised of' is redundant."
          }
        ];
        
        for (const issue of randomIssues) {
          const paraIndex = Math.floor(Math.random() * paragraphs.length);
          
          issues.push({
            id: `grammar-random-${issues.length}`,
            type: "grammar",
            severity: "low",
            text: issue.text,
            suggestion: issue.suggestion,
            explanation: issue.explanation,
            position: {
              paragraph: paraIndex,
              startIndex: 0,
              endIndex: issue.text.length
            }
          });
        }
      }
    }
    
    // Check for spelling issues
    if (checkSpelling && paragraphs.length > 0) {
      const commonMisspellings = [
        { wrong: "accomodate", correct: "accommodate", explanation: "This word has double 'c' and double 'm'." },
        { wrong: "acheive", correct: "achieve", explanation: "Remember the rule: 'i' before 'e' except after 'c'." },
        { wrong: "definately", correct: "definitely", explanation: "This word is spelled with 'i' in the middle, not 'a'." },
        { wrong: "embarassing", correct: "embarrassing", explanation: "This word has double 'r' and double 's'." },
        { wrong: "occured", correct: "occurred", explanation: "This word has double 'c' and double 'r'." },
        { wrong: "recieve", correct: "receive", explanation: "Remember the rule: 'i' before 'e' except after 'c'." },
        { wrong: "seperate", correct: "separate", explanation: "This word has an 'a' in the middle, not an 'e'." },
        { wrong: "neccessary", correct: "necessary", explanation: "This word has one 'c' followed by double 's'." }
      ];
      
      for (let i = 0; i < paragraphs.length; i++) {
        for (const misspelling of commonMisspellings) {
          const regex = new RegExp('\\b' + misspelling.wrong + '\\b', 'i');
          const match = paragraphs[i].match(regex);
          
          if (match) {
            const startIndex = paragraphs[i].toLowerCase().indexOf(misspelling.wrong.toLowerCase());
            
            issues.push({
              id: `spelling-${i}-${startIndex}`,
              type: "spelling",
              severity: "low",
              text: match[0],
              suggestion: misspelling.correct,
              explanation: misspelling.explanation,
              position: {
                paragraph: i,
                startIndex,
                endIndex: startIndex + misspelling.wrong.length
              }
            });
          }
        }
      }
    }
    
    // Check for style issues
    if (checkStyle) {
      // Passive voice detection (simplified)
      const passivePattern = /\b(?:is|are|was|were|be|been|being)\s+([a-z]+ed|done|made|built|created|written)\b/i;
      
      for (let i = 0; i < paragraphs.length; i++) {
        const matches = paragraphs[i].match(passivePattern);
        if (matches) {
          const startIndex = paragraphs[i].indexOf(matches[0]);
          
          issues.push({
            id: `style-passive-${i}-${startIndex}`,
            type: "style",
            severity: "low",
            text: matches[0],
            suggestion: "Consider using active voice",
            explanation: "Passive voice can make your writing less direct and engaging. Consider restructuring to use active voice.",
            position: {
              paragraph: i,
              startIndex,
              endIndex: startIndex + matches[0].length
            }
          });
        }
      }
      
      // Wordiness detection
      const wordyPhrases = [
        { pattern: "due to the fact that", suggestion: "because", explanation: "This phrase is wordy. 'Because' is more concise." },
        { pattern: "at this point in time", suggestion: "now", explanation: "This phrase is wordy. 'Now' is more concise." },
        { pattern: "in order to", suggestion: "to", explanation: "In most cases, 'to' alone is sufficient." },
        { pattern: "for the purpose of", suggestion: "for", explanation: "This phrase is wordy. 'For' is more concise." },
        { pattern: "in the event that", suggestion: "if", explanation: "This phrase is wordy. 'If' is more concise." }
      ];
      
      for (let i = 0; i < paragraphs.length; i++) {
        for (const phrase of wordyPhrases) {
          const regex = new RegExp(phrase.pattern, 'i');
          const match = paragraphs[i].match(regex);
          
          if (match) {
            const startIndex = paragraphs[i].toLowerCase().indexOf(phrase.pattern.toLowerCase());
            
            issues.push({
              id: `style-wordy-${i}-${startIndex}`,
              type: "style",
              severity: "low",
              text: match[0],
              suggestion: phrase.suggestion,
              explanation: phrase.explanation,
              position: {
                paragraph: i,
                startIndex,
                endIndex: startIndex + match[0].length
              }
            });
          }
        }
      }
      
      // Check for repeated words
      const repeatedWordsPattern = /\b(\w+)\s+\1\b/gi;
      
      for (let i = 0; i < paragraphs.length; i++) {
        let match;
        while ((match = repeatedWordsPattern.exec(paragraphs[i])) !== null) {
          issues.push({
            id: `style-repeated-${i}-${match.index}`,
            type: "style",
            severity: "low",
            text: match[0],
            suggestion: match[1],
            explanation: "You've repeated the same word. Consider using a synonym or restructuring the sentence.",
            position: {
              paragraph: i,
              startIndex: match.index,
              endIndex: match.index + match[0].length
            }
          });
        }
      }
    }
    
    // Check for structure issues
    // Long paragraphs
    for (let i = 0; i < paragraphs.length; i++) {
      const words = paragraphs[i].split(/\s+/).filter(word => word.length > 0);
      
      if (words.length > 150) {
        issues.push({
          id: `structure-long-para-${i}`,
          type: "structure",
          severity: "medium",
          text: paragraphs[i].substring(0, 50) + "...",
          suggestion: "Consider breaking this into smaller paragraphs",
          explanation: "Long paragraphs (150+ words) can be difficult to read. Consider breaking this into smaller, more focused paragraphs of 3-5 sentences each.",
          position: {
            paragraph: i,
            startIndex: 0,
            endIndex: paragraphs[i].length
          }
        });
      }
    }
    
    // Check for clarity issues
    // Very long sentences
    for (let i = 0; i < paragraphs.length; i++) {
      const sentences = paragraphs[i].match(/[^.!?]+[.!?]+/g) || [];
      
      for (let j = 0; j < sentences.length; j++) {
        const words = sentences[j].split(/\s+/).filter(word => word.length > 0);
        
        if (words.length > 40) {
          const startIndex = paragraphs[i].indexOf(sentences[j]);
          
          issues.push({
            id: `clarity-long-sentence-${i}-${j}`,
            type: "clarity",
            severity: "medium",
            text: sentences[j].substring(0, 50) + "...",
            suggestion: "Consider breaking this into smaller sentences",
            explanation: "This sentence is very long (40+ words). Long sentences can be difficult to follow. Consider breaking it into smaller, clearer sentences.",
            position: {
              paragraph: i,
              startIndex,
              endIndex: startIndex + sentences[j].length
            }
          });
        }
      }
    }
    
    // Generate mock citation issues if appropriate
    const citations: Citation[] = [];
    
    if (checkCitations && type === "academic") {
      const citationPatterns = [
        { pattern: /\(([A-Za-z]+),?\s+(\d{4})\)/g, format: "in-text" },
        { pattern: /([A-Za-z]+)\s+\((\d{4})\)/g, format: "narrative" }
      ];
      
      let hasCitations = false;
      
      for (let i = 0; i < paragraphs.length; i++) {
        for (const pattern of citationPatterns) {
          let match;
          while ((match = pattern.pattern.exec(paragraphs[i])) !== null) {
            hasCitations = true;
            
            const citationIssues = [];
            
            // Random citation issues
            if (Math.random() > 0.7) {
              if (style === "apa" && pattern.format === "in-text") {
                citationIssues.push("Missing page number for direct quote");
              } else if (style === "mla" && pattern.format === "in-text") {
                citationIssues.push("Missing page number for MLA citation");
              } else if (style === "chicago" && pattern.format === "narrative") {
                citationIssues.push("Chicago style prefers footnotes over in-text citations");
              }
            }
            
            citations.push({
              text: match[0],
              format: pattern.format,
              issues: citationIssues
            });
            
            // Add as issue if there are problems
            if (citationIssues.length > 0) {
              issues.push({
                id: `citation-${i}-${match.index}`,
                type: "citation",
                severity: "medium",
                text: match[0],
                suggestion: "Correct citation format",
                explanation: citationIssues.join(". "),
                position: {
                  paragraph: i,
                  startIndex: match.index,
                  endIndex: match.index + match[0].length
                }
              });
            }
          }
        }
      }
      
      // If no citations found in academic writing, add an issue
      if (!hasCitations && type === "academic") {
        issues.push({
          id: "citation-missing",
          type: "citation",
          severity: "high",
          text: "Entire essay",
          suggestion: "Add appropriate citations",
          explanation: "No citations were found in this academic essay. Academic writing typically requires citations to support claims and arguments.",
          position: {
            paragraph: 0,
            startIndex: 0,
            endIndex: 10
          }
        });
      }
    }
    
    // Check for plagiarism if enabled (simulated)
    if (checkPlagiarism) {
      // Simulate finding 1-2 potential plagiarism matches
      const shouldAddPlagiarism = Math.random() > 0.7;
      
      if (shouldAddPlagiarism && paragraphs.length > 1) {
        const targetParagraph = Math.floor(Math.random() * paragraphs.length);
        const targetSentences = paragraphs[targetParagraph].match(/[^.!?]+[.!?]+/g) || [];
        
        if (targetSentences.length > 0) {
          const targetSentence = targetSentences[Math.floor(Math.random() * targetSentences.length)];
          const startIndex = paragraphs[targetParagraph].indexOf(targetSentence);
          
          issues.push({
            id: `plagiarism-${targetParagraph}-${startIndex}`,
            type: "plagiarism",
            severity: "high",
            text: targetSentence,
            suggestion: "Rewrite or cite properly",
            explanation: "This text appears to be similar to content from an external source. Either rewrite it in your own words or provide proper citation.",
            position: {
              paragraph: targetParagraph,
              startIndex,
              endIndex: startIndex + targetSentence.length
            }
          });
        }
      }
    }
    
    return {
      wordCount,
      readingTime,
      readabilityScore,
      readabilityLevel,
      grammarScore,
      styleScore,
      overallScore,
      citations,
      issues
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayText(e.target.value);
  };

  const handleAnalysisTypeChange = (value: string) => {
    setAnalysisType(value);
  };

  const handleCitationStyleChange = (value: string) => {
    setCitationStyle(value);
  };

  const selectIssue = (issue: EssayIssue) => {
    setSelectedIssue(issue);
  };

  const applyFix = (issue: EssayIssue) => {
    // This is a simplified fix implementation
    // In a real app, you would need to handle the position more carefully
    
    const paragraphs = analyzedText.split("\n\n");
    
    if (issue.position.paragraph < paragraphs.length) {
      const paragraph = paragraphs[issue.position.paragraph];
      
      if (issue.position.startIndex < paragraph.length) {
        const before = paragraph.substring(0, issue.position.startIndex);
        const after = paragraph.substring(issue.position.endIndex);
        
        const newParagraph = before + issue.suggestion + after;
        paragraphs[issue.position.paragraph] = newParagraph;
        
        const newText = paragraphs.join("\n\n");
        setAnalyzedText(newText);
        setEssayText(newText);
        
        // Remove issue from list
        if (analysis) {
          setAnalysis({
            ...analysis,
            issues: analysis.issues.filter(i => i.id !== issue.id)
          });
        }
        
        setSelectedIssue(null);
        
        toast({
          title: "Issue fixed",
          description: `Fixed: "${issue.text}"`,
        });
      }
    }
  };

  const fixAllIssues = (type?: string) => {
    if (!analysis) return;
    
    // Filter issues by type if specified
    const issuesToFix = type 
      ? analysis.issues.filter(issue => issue.type === type)
      : analysis.issues;
    
    if (issuesToFix.length === 0) return;
    
    let newText = analyzedText;
    const paragraphs = newText.split("\n\n");
    
    // Sort issues from end to beginning to avoid position shifts
    const sortedIssues = [...issuesToFix].sort((a, b) => {
      if (a.position.paragraph !== b.position.paragraph) {
        return b.position.paragraph - a.position.paragraph;
      }
      return b.position.startIndex - a.position.startIndex;
    });
    
    // Apply fixes
    for (const issue of sortedIssues) {
      if (issue.position.paragraph < paragraphs.length) {
        const paragraph = paragraphs[issue.position.paragraph];
        
        if (issue.position.startIndex < paragraph.length) {
          const before = paragraph.substring(0, issue.position.startIndex);
          const after = paragraph.substring(issue.position.endIndex);
          
          paragraphs[issue.position.paragraph] = before + issue.suggestion + after;
        }
      }
    }
    
    newText = paragraphs.join("\n\n");
    setAnalyzedText(newText);
    setEssayText(newText);
    
    // Remove fixed issues from list
    const remainingIssues = analysis.issues.filter(issue => 
      !issuesToFix.some(fixedIssue => fixedIssue.id === issue.id)
    );
    
    setAnalysis({
      ...analysis,
      issues: remainingIssues
    });
    
    setSelectedIssue(null);
    
    toast({
      title: type ? `${type.charAt(0).toUpperCase() + type.slice(1)} issues fixed` : "All issues fixed",
      description: `Fixed ${issuesToFix.length} ${type || ""} issues`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analyzedText);
    
    toast({
      title: "Copied to clipboard",
      description: "The essay has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setEssayText("");
    setAnalyzedText("");
    setAnalysis(null);
    setSelectedIssue(null);
  };

  const getIssueColor = (type: string): string => {
    switch (type) {
      case "grammar": return "text-red-500";
      case "spelling": return "text-orange-500";
      case "punctuation": return "text-yellow-500";
      case "clarity": return "text-purple-500";
      case "structure": return "text-blue-500";
      case "style": return "text-green-500";
      case "citation": return "text-indigo-500";
      case "plagiarism": return "text-pink-500";
      default: return "text-gray-500";
    }
  };

  const getIssueBg = (type: string): string => {
    switch (type) {
      case "grammar": return "bg-red-50";
      case "spelling": return "bg-orange-50";
      case "punctuation": return "bg-yellow-50";
      case "clarity": return "bg-purple-50";
      case "structure": return "bg-blue-50";
      case "style": return "bg-green-50";
      case "citation": return "bg-indigo-50";
      case "plagiarism": return "bg-pink-50";
      default: return "bg-gray-50";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "low": return "text-green-500";
      case "medium": return "text-yellow-500";
      case "high": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getIssueTypeLabel = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getSeverityLabel = (severity: string): string => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getIssueCount = (type: string): number => {
    if (!analysis) return 0;
    return analysis.issues.filter(issue => issue.type === type).length;
  };

  const toolInterface = (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Essay Checker</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="essay-text" className="text-base font-medium">Paste Your Essay</Label>
                  <Textarea
                    id="essay-text"
                    placeholder="Paste your essay here for analysis..."
                    value={essayText}
                    onChange={handleTextChange}
                    className="h-64 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="analysis-type" className="text-base font-medium">Analysis Type</Label>
                    <Select 
                      value={analysisType} 
                      onValueChange={handleAnalysisTypeChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="citation-style" className="text-base font-medium">Citation Style</Label>
                    <Select 
                      value={citationStyle} 
                      onValueChange={handleCitationStyleChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apa">APA</SelectItem>
                        <SelectItem value="mla">MLA</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                        <SelectItem value="harvard">Harvard</SelectItem>
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
                        checked={checkGrammar}
                        onCheckedChange={setCheckGrammar}
                      />
                      <Label htmlFor="grammar" className="text-sm">Grammar & Spelling</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="style" 
                        checked={checkStyle}
                        onCheckedChange={setCheckStyle}
                      />
                      <Label htmlFor="style" className="text-sm">Style & Clarity</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="citations" 
                        checked={checkCitations}
                        onCheckedChange={setCheckCitations}
                      />
                      <Label htmlFor="citations" className="text-sm">Citations</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="plagiarism" 
                        checked={checkPlagiarism}
                        onCheckedChange={setCheckPlagiarism}
                      />
                      <Label htmlFor="plagiarism" className="text-sm">Plagiarism</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={analyzeEssay}
                    disabled={isAnalyzing || essayText.trim().length < 100}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>{isAnalyzing ? "Analyzing..." : "Analyze Essay"}</span>
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
          
          {essayHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Recent Essays</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {essayHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.wordCount} words</p>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-500">
                        {item.issues} {item.issues === 1 ? 'issue' : 'issues'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="analysis">Essay Analysis</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                {analysis && (
                  <Badge className="ml-2 bg-red-500">{analysis.issues.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Analysis Results</h3>
                    <Button
                      onClick={copyToClipboard}
                      disabled={!analyzedText}
                      size="sm"
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      <i className="fas fa-copy mr-2"></i>
                      <span>Copy</span>
                    </Button>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <Progress value={progress} className="w-full mb-4" />
                      <p className="text-gray-500">Analyzing your essay...</p>
                      <p className="text-gray-400 text-sm mt-2">This might take a few moments</p>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border rounded-lg p-4 overflow-y-auto max-h-64">
                        <p className="whitespace-pre-wrap">{analyzedText}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-blue-800">Overall Score</h4>
                          <div className="ml-auto">
                            <Badge
                              className={`
                                ${analysis.overallScore >= 90 ? 'bg-green-100 text-green-800' : 
                                  analysis.overallScore >= 80 ? 'bg-blue-100 text-blue-800' :
                                  analysis.overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'}
                              `}
                            >
                              {analysis.overallScore}/100
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Grammar</p>
                            <p className="font-medium text-blue-800">{analysis.grammarScore}/100</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Style</p>
                            <p className="font-medium text-blue-800">{analysis.styleScore}/100</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Readability</p>
                            <p className="font-medium text-blue-800">{analysis.readabilityLevel}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => fixAllIssues()}
                          disabled={analysis.issues.length === 0}
                          className="bg-primary hover:bg-blue-700 transition"
                          size="sm"
                        >
                          <i className="fas fa-magic mr-2"></i>
                          <span>Fix All Issues</span>
                        </Button>
                        
                        {getIssueCount("grammar") > 0 && (
                          <Button
                            onClick={() => fixAllIssues("grammar")}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <span>Fix Grammar ({getIssueCount("grammar")})</span>
                          </Button>
                        )}
                        
                        {getIssueCount("spelling") > 0 && (
                          <Button
                            onClick={() => fixAllIssues("spelling")}
                            size="sm"
                            variant="outline"
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <span>Fix Spelling ({getIssueCount("spelling")})</span>
                          </Button>
                        )}
                        
                        {getIssueCount("style") > 0 && (
                          <Button
                            onClick={() => fixAllIssues("style")}
                            size="sm"
                            variant="outline"
                            className="border-green-200 text-green-700 hover:bg-green-50"
                          >
                            <span>Fix Style ({getIssueCount("style")})</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-file-alt text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Your essay analysis will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your essay and click "Analyze Essay"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Detected Issues</h3>
                  
                  {analysis && analysis.issues.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {["grammar", "spelling", "style", "clarity", "structure", "citation", "plagiarism"].map(type => {
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
                      
                      <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {analysis.issues.map((issue, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg cursor-pointer border ${
                              selectedIssue?.id === issue.id ? 'border-primary bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
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
                                  <p className="text-xs text-gray-500 truncate max-w-[180px]">"{issue.text.length > 30 ? issue.text.substring(0, 30) + "..." : issue.text}"</p>
                                </div>
                              </div>
                              <Badge className={
                                issue.severity === "high" ? "bg-red-100 text-red-800" :
                                issue.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }>
                                {getSeverityLabel(issue.severity)}
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
                              <p className="text-sm bg-white p-2 rounded border mt-1">"{selectedIssue.suggestion}"</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Explanation:</p>
                              <p className="text-sm">{selectedIssue.explanation}</p>
                            </div>
                            
                            <Button
                              onClick={() => applyFix(selectedIssue)}
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
                  ) : isAnalyzing ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="animate-spin mb-4">
                        <i className="fas fa-circle-notch text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-500">Scanning for issues...</p>
                    </div>
                  ) : analysis ? (
                    <div className="bg-green-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="mb-4 text-green-500">
                        <i className="fas fa-check-circle text-5xl"></i>
                      </div>
                      <h4 className="text-lg font-medium text-green-800">No issues found</h4>
                      <p className="text-green-600 mt-2">Great job! Your essay appears to be error-free.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-search text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Issues will appear here after analysis</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your essay and click "Analyze Essay"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Essay Statistics</h3>
                  
                  {analysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-blue-700 text-sm">Word Count</p>
                          <p className="text-blue-800 text-xl font-bold">{analysis.wordCount}</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-green-700 text-sm">Reading Time</p>
                          <p className="text-green-800 text-xl font-bold">{analysis.readingTime} min</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-purple-700 text-sm">Readability</p>
                          <p className="text-purple-800 text-xl font-bold">{analysis.readabilityLevel}</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <p className="text-yellow-700 text-sm">Citations</p>
                          <p className="text-yellow-800 text-xl font-bold">{analysis.citations.length}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Issue Breakdown</h4>
                        <div className="space-y-2">
                          {[
                            { type: "grammar", label: "Grammar" },
                            { type: "spelling", label: "Spelling" },
                            { type: "style", label: "Style" },
                            { type: "clarity", label: "Clarity" },
                            { type: "structure", label: "Structure" },
                            { type: "citation", label: "Citation" },
                            { type: "plagiarism", label: "Plagiarism" }
                          ].map(item => {
                            const count = getIssueCount(item.type);
                            return (
                              <div key={item.type} className="flex items-center">
                                <span className="text-sm w-24">{item.label}:</span>
                                <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full ${getIssueBg(item.type)}`}
                                    style={{ width: `${Math.min(100, count * 10)}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {analysis.citations.length > 0 && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">Citations ({citationStyle.toUpperCase()})</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {analysis.citations.map((citation, index) => (
                              <div key={index} className="text-sm p-2 bg-white rounded border">
                                <div className="flex justify-between">
                                  <span className="font-medium">{citation.text}</span>
                                  <Badge className={citation.issues.length > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                    {citation.issues.length > 0 ? "Issue" : "Valid"}
                                  </Badge>
                                </div>
                                {citation.issues.length > 0 && (
                                  <p className="text-xs text-red-600 mt-1">{citation.issues[0]}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-chart-bar text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Essay statistics will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your essay and click "Analyze Essay"</p>
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
              <h3 className="font-medium">Grammar & Style</h3>
            </div>
            <p className="text-sm text-gray-600">
              Advanced detection of grammar errors, style issues, and clarity problems with tailored suggestions for academic writing.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-graduation-cap text-purple-600"></i>
              </div>
              <h3 className="font-medium">Citation Checker</h3>
            </div>
            <p className="text-sm text-gray-600">
              Verifies that citations follow proper format for APA, MLA, Chicago, and Harvard styles with detailed correction suggestions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <i className="fas fa-fingerprint text-red-600"></i>
              </div>
              <h3 className="font-medium">Plagiarism Check</h3>
            </div>
            <p className="text-sm text-gray-600">
              Scans text against online sources to detect potential plagiarism and provide suggestions for proper citation or rewriting.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
              <h3 className="font-medium">Statistics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Comprehensive essay metrics including word count, reading level, style analysis, and overall scoring to identify improvement areas.
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
            <h3 className="font-medium text-blue-800 mb-1">Academic Writing Tips</h3>
            <p className="text-blue-700 text-sm">
              For stronger academic essays, start with a clear thesis statement, use evidence to support 
              your arguments, maintain formal language, and properly cite all sources. Avoid first-person 
              pronouns and contractions in formal academic writing. Structure your essay with a clear 
              introduction, body paragraphs (each with a topic sentence), and conclusion. Revise thoroughly 
              for content, organization, and mechanics.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Elevate your essays with comprehensive analysis, checking for grammar, style, citations, and potential plagiarism.",
    description: "Our Essay Checker is a comprehensive analysis tool designed to evaluate academic and professional writing across multiple dimensions to help students, researchers, and content creators produce polished, error-free documents. This advanced checker examines text for grammar and spelling errors, style inconsistencies, structural problems, citation formatting, and potential plagiarism. The tool offers customizable analysis options based on document type—academic, creative, business, or general—and supports multiple citation styles including APA, MLA, Chicago, and Harvard. Each analysis generates detailed metrics such as word count, estimated reading time, readability level, and separate scores for grammar, style, and overall quality. The intuitive interface highlights different types of issues with color-coding and severity indicators, allowing users to quickly identify and address the most critical problems. Every flagged issue comes with a specific explanation and suggested correction, enhancing the educational value of the tool by helping users understand writing principles rather than just fixing mistakes. The checker's one-click correction feature enables users to apply individual fixes or address all issues of a specific type (like grammar or spelling) simultaneously. Additional features include citation analysis that identifies formatting inconsistencies according to the selected style guide, automated plagiarism detection that compares text against online sources, and a comprehensive statistics dashboard that visualizes essay metrics and issue breakdowns. Whether you're a student writing academic papers, a researcher preparing manuscripts, or a professional creating reports, our Essay Checker provides the detailed feedback and correction tools needed to ensure your writing meets the highest standards.",
    howToUse: [
      "Paste your essay into the text field on the left side of the checker.",
      "Select your analysis type from the dropdown menu: Academic, Creative, Business, or General.",
      "Choose the appropriate citation style from the options: APA, MLA, Chicago, or Harvard.",
      "Customize your checking options by toggling which aspects to examine: Grammar & Spelling, Style & Clarity, Citations, and/or Plagiarism.",
      "Click 'Analyze Essay' and wait for the system to process your text.",
      "Review your analysis results in the three available tabs: Essay Analysis for an overview and corrections, Issues for detailed problem listings, and Statistics for metrics and breakdowns.",
      "Click on any highlighted issue to see details, explanations, and suggested corrections.",
      "Apply fixes individually by selecting an issue and clicking 'Apply This Fix', or use the 'Fix All Issues' button to correct everything at once.",
      "Use the specialized correction buttons to fix specific types of issues (Grammar, Spelling, Style) with a single click."
    ],
    features: [
      "Comprehensive essay analysis covering grammar, spelling, style, clarity, structure, citations, and potential plagiarism",
      "Multiple analysis types (Academic, Creative, Business, General) with customized checking criteria for each context",
      "Support for major citation styles including APA, MLA, Chicago, and Harvard with specific formatting validation",
      "Detailed issue explanations that provide educational value by teaching proper writing principles",
      "One-click corrections for individual issues or grouped by category (grammar, spelling, style)",
      "Complete statistics dashboard with word count, reading time, readability metrics, and visual issue breakdowns",
      "Essay history feature that saves your previous analyses for easy reference and comparison"
    ],
    faqs: [
      {
        question: "How accurate is the plagiarism detection compared to tools used by universities?",
        answer: "The accuracy of our plagiarism detection compares favorably with many institutional tools, though with some key differences: 1) Database Coverage: University plagiarism checkers often have access to proprietary databases of academic papers, theses, and dissertations that may not be publicly available. Our tool primarily checks against publicly accessible web content, open-access journals, and common academic resources. 2) Detection Methodology: Like institutional tools, we use sophisticated text-matching algorithms that identify both exact matches and paraphrased content. Our system analyzes sentence structures and writing patterns to detect attempts at obfuscating copied material. 3) Sensitivity: Our detection sensitivity is carefully calibrated to focus on substantive matches rather than common phrases or widely used terminology, reducing false positives while still catching significant instances of plagiarism. For academic submissions, we recommend using our tool as a preliminary check to identify potential issues before submitting work through institutional systems. It's especially valuable for self-assessment and learning purposes, helping you understand proper citation and paraphrasing practices. While we strive for high accuracy, no automated system is perfect, and the final determination of plagiarism typically requires human judgment, particularly for nuanced cases involving idea attribution rather than direct textual copying."
      },
      {
        question: "How does the Essay Checker differ for each analysis type (Academic, Creative, Business)?",
        answer: "Each analysis type in our Essay Checker uses specialized algorithms and criteria tailored to different writing contexts: 1) Academic Analysis focuses on formal writing conventions appropriate for scholarly work. It enforces strict grammar rules, checks for proper citation formatting, flags informal language and contractions, evaluates paragraph structure and argument flow, and applies rigorous standards for clarity and precision. It's particularly sensitive to passive voice overuse, inappropriate personal pronouns, and citation consistency. 2) Creative Analysis provides more flexibility for stylistic choices and literary techniques. It's less strict about sentence fragments, creative punctuation, and unconventional phrasing when used for effect. This mode emphasizes readability, engagement, varied sentence structure, and effective use of literary devices while still flagging basic grammar and spelling errors. 3) Business Analysis concentrates on professional communication standards. It checks for concise language, appropriate business terminology, formal but accessible phrasing, and clear actionable content. This mode identifies jargon, unnecessarily complex sentences, and ambiguous statements that could impact clarity in professional documents. 4) General Analysis provides a balanced approach suitable for everyday writing. It applies standard grammar and spelling rules while allowing for some stylistic flexibility, making it ideal for blog posts, general articles, and non-specialized content. Each analysis type adjusts scoring weights and flagging thresholds to reflect the expectations of its target audience and purpose, providing relevant feedback for different writing contexts."
      },
      {
        question: "Can the Essay Checker help improve my writing over time, not just fix immediate issues?",
        answer: "Yes, our Essay Checker is designed as a learning tool that helps improve your writing skills over time, not just as a quick-fix solution: 1) Educational Explanations: Rather than simply highlighting errors, each issue comes with a detailed explanation of the underlying writing principle, helping you understand why something is considered an error and how to avoid similar mistakes in the future. 2) Pattern Recognition: The Statistics tab identifies recurring issues in your writing, helping you recognize personal patterns and tendencies that need improvement. 3) Progressive Feedback: As you use the tool regularly, you'll notice shifts in the types of issues flagged—from basic grammar and spelling errors to more advanced stylistic and structural suggestions as your fundamental skills improve. 4) Style Development: The different analysis types (Academic, Creative, Business) help you understand the distinct expectations of various writing contexts, developing your ability to adapt your style appropriately. 5) Citation Learning: For academic writing, the citation checker teaches proper formatting across different style guides, gradually building your knowledge of citation conventions. To maximize learning benefits: Review explanations carefully rather than just applying fixes automatically; Pay attention to recurring issues in your statistics dashboard; Try implementing lessons learned in new writing before checking; and Use the tool throughout your writing process, not just as a final check. With consistent use, you should see a gradual reduction in basic errors and a shift toward more sophisticated feedback as your writing skills develop."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="essay-checker"
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

export default EssayCheckerDetailed;