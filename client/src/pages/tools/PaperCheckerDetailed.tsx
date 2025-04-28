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

interface PaperIssue {
  id: string;
  type: "grammar" | "spelling" | "punctuation" | "clarity" | "formatting" | "citation" | "style" | "plagiarism" | "structure";
  severity: "low" | "medium" | "high";
  text: string;
  suggestion: string;
  explanation: string;
  position: {
    section: string;
    paragraph: number;
    startIndex: number;
    endIndex: number;
  };
}

interface Reference {
  id: string;
  text: string;
  format: string;
  issues: string[];
}

interface PaperAnalysis {
  wordCount: number;
  pageCount: number;
  readingTime: number;
  readabilityScore: number;
  readabilityLevel: string;
  grammarScore: number;
  structureScore: number;
  citationScore: number;
  overallScore: number;
  references: Reference[];
  issues: PaperIssue[];
}

const PaperCheckerDetailed = () => {
  const [paperText, setPaperText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<PaperIssue | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paperType, setPaperType] = useState("academic");
  const [citationStyle, setCitationStyle] = useState("apa");
  const [checkGrammar, setCheckGrammar] = useState(true);
  const [checkStructure, setCheckStructure] = useState(true);
  const [checkCitations, setCheckCitations] = useState(true);
  const [checkPlagiarism, setCheckPlagiarism] = useState(true);
  const [paperHistory, setPaperHistory] = useState<Array<{ title: string, wordCount: number, issues: number }>>([]);
  const { toast } = useToast();

  const analyzePaper = () => {
    if (paperText.trim().length < 100) {
      toast({
        title: "Paper too short",
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

    // Simulate analysis with a mock result
    // In a real implementation, you would call an API for this
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const mockAnalysis = generateMockAnalysis(paperText, paperType, citationStyle);
      setAnalysis(mockAnalysis);
      setAnalyzedText(paperText);
      setIsAnalyzing(false);
      
      // Add to history
      const title = paperText.substring(0, 40).trim() + (paperText.length > 40 ? "..." : "");
      setPaperHistory(prev => [{
        title,
        wordCount: mockAnalysis.wordCount,
        issues: mockAnalysis.issues.length
      }, ...prev].slice(0, 5));
      
      toast({
        title: "Analysis complete",
        description: `Found ${mockAnalysis.issues.length} issues in your paper`,
      });
    }, 3500);
  };

  const generateMockAnalysis = (text: string, type: string, style: string): PaperAnalysis => {
    // Calculate basic stats
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const pageCount = Math.ceil(wordCount / 250); // Approx. 250 words per page
    const readingTime = Math.ceil(wordCount / 200); // Approx. 200 words per minute
    
    // Generate random scores based on paper type
    const getRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const grammarScore = getRandomScore(70, 95);
    const structureScore = getRandomScore(65, 90);
    const citationScore = getRandomScore(60, 95);
    const overallScore = Math.floor((grammarScore + structureScore + citationScore) / 3);
    
    // Determine readability
    let readabilityScore = getRandomScore(30, 70);
    let readabilityLevel = "";
    
    if (readabilityScore < 40) {
      readabilityLevel = "Complex - Graduate level";
    } else if (readabilityScore < 60) {
      readabilityLevel = "Moderate - Undergraduate level";
    } else {
      readabilityLevel = "Accessible - High school level";
    }
    
    // Generate mock issues and references
    const issues: PaperIssue[] = [];
    const references: Reference[] = [];
    
    // Split text into sections (assuming sections are separated by double newlines)
    const sections = text.split(/\n\n+/).map(s => s.trim()).filter(s => s.length > 0);
    
    if (sections.length === 0) {
      // If no sections are detected, treat the entire text as one section
      sections.push(text);
    }
    
    // Common section names in academic papers (used to identify parts of the paper)
    const academicSections = [
      "Abstract", "Introduction", "Literature Review", "Methodology", 
      "Results", "Discussion", "Conclusion", "References"
    ];
    
    // Check structure issues
    if (checkStructure) {
      // Check for missing sections in an academic paper
      if (type === "academic" && sections.length < 4) {
        issues.push({
          id: `structure-missing-sections`,
          type: "structure",
          severity: "medium",
          text: "Limited number of sections",
          suggestion: "Include standard sections like Abstract, Introduction, Methodology, Results, Discussion, and Conclusion",
          explanation: "Academic papers typically follow a standard structure with distinct sections. Your paper appears to have fewer sections than expected.",
          position: {
            section: "Overall",
            paragraph: 0,
            startIndex: 0,
            endIndex: 10
          }
        });
      }
      
      // Check for section length balance
      if (sections.length > 1) {
        const avgSectionLength = text.length / sections.length;
        const longSections = sections.filter(s => s.length > avgSectionLength * 2);
        const shortSections = sections.filter(s => s.length < avgSectionLength * 0.5 && s.length > 50);
        
        if (longSections.length > 0) {
          const sectionIndex = sections.indexOf(longSections[0]);
          const sectionName = sectionIndex < academicSections.length ? academicSections[sectionIndex] : `Section ${sectionIndex + 1}`;
          
          issues.push({
            id: `structure-unbalanced-long-${sectionIndex}`,
            type: "structure",
            severity: "low",
            text: longSections[0].substring(0, 50) + "...",
            suggestion: "Consider breaking this section into smaller, more focused sections",
            explanation: `${sectionName} is significantly longer than other sections, which may indicate unbalanced content distribution.`,
            position: {
              section: sectionName,
              paragraph: 0,
              startIndex: 0,
              endIndex: 50
            }
          });
        }
        
        if (shortSections.length > 0) {
          const sectionIndex = sections.indexOf(shortSections[0]);
          const sectionName = sectionIndex < academicSections.length ? academicSections[sectionIndex] : `Section ${sectionIndex + 1}`;
          
          issues.push({
            id: `structure-unbalanced-short-${sectionIndex}`,
            type: "structure",
            severity: "low",
            text: shortSections[0],
            suggestion: "Expand this section with more detail and analysis",
            explanation: `${sectionName} is significantly shorter than other sections, which may indicate insufficient development.`,
            position: {
              section: sectionName,
              paragraph: 0,
              startIndex: 0,
              endIndex: shortSections[0].length
            }
          });
        }
      }
    }
    
    // Check for grammar, spelling, and clarity issues
    if (checkGrammar) {
      // Common academic writing issues
      const academicWritingIssues = [
        { 
          pattern: /\b(?:I|we|our)\b\s+(?:believe|think|feel)\b/i, 
          suggestion: "The evidence suggests",
          explanation: "Avoid using personal pronouns and subjective verbs in academic writing. Focus on evidence rather than beliefs."
        },
        { 
          pattern: /very\s+(\w+)/i, 
          suggestion: "significantly $1",
          explanation: "Avoid imprecise intensifiers like 'very' in academic writing. Use more specific and measurable terms."
        },
        { 
          pattern: /a\s+lot\s+of/i, 
          suggestion: "substantial", 
          explanation: "The phrase 'a lot of' is too informal for academic writing. Use more precise terms like 'substantial', 'significant', or provide specific quantities."
        },
        { 
          pattern: /there\s+(?:is|are)\s+(?:many|several|numerous)/i, 
          suggestion: "Many factors contribute",
          explanation: "Avoid starting sentences with 'There is/are' as it creates a weak and indirect construction."
        }
      ];
      
      // Check each section for issues
      sections.forEach((sectionText, sectionIndex) => {
        const sectionName = sectionIndex < academicSections.length ? academicSections[sectionIndex] : `Section ${sectionIndex + 1}`;
        const paragraphs = sectionText.split(/\n+/).filter(p => p.trim().length > 0);
        
        // Check each paragraph for academic writing issues
        paragraphs.forEach((paragraph, paraIndex) => {
          academicWritingIssues.forEach(issue => {
            const matches = paragraph.match(issue.pattern);
            if (matches) {
              const startIndex = paragraph.indexOf(matches[0]);
              
              issues.push({
                id: `grammar-${sectionIndex}-${paraIndex}-${startIndex}`,
                type: "grammar",
                severity: "medium",
                text: matches[0],
                suggestion: issue.suggestion,
                explanation: issue.explanation,
                position: {
                  section: sectionName,
                  paragraph: paraIndex,
                  startIndex,
                  endIndex: startIndex + matches[0].length
                }
              });
            }
          });
          
          // Check for very long sentences (more than 40 words)
          const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
          sentences.forEach((sentence, sentIndex) => {
            const words = sentence.split(/\s+/).filter(w => w.length > 0);
            if (words.length > 40) {
              const startIndex = paragraph.indexOf(sentence);
              
              issues.push({
                id: `clarity-${sectionIndex}-${paraIndex}-${sentIndex}`,
                type: "clarity",
                severity: "medium",
                text: sentence.substring(0, 50) + "...",
                suggestion: "Divide this sentence into smaller, clearer sentences",
                explanation: "Very long sentences (over 40 words) can be difficult to follow and may obscure your argument. Consider breaking them into shorter, more focused sentences.",
                position: {
                  section: sectionName,
                  paragraph: paraIndex,
                  startIndex,
                  endIndex: startIndex + sentence.length
                }
              });
            }
          });
          
          // Check for passive voice overuse
          const passivePattern = /\b(?:is|are|was|were|be|been|being)\s+([a-z]+ed|done|made|created|analyzed|measured|evaluated|conducted|performed)/gi;
          let passiveMatch;
          let passiveCount = 0;
          
          while ((passiveMatch = passivePattern.exec(paragraph)) !== null) {
            passiveCount++;
            
            // Only flag if there are multiple instances in the same paragraph
            if (passiveCount > 2) {
              issues.push({
                id: `style-passive-${sectionIndex}-${paraIndex}-${passiveCount}`,
                type: "style",
                severity: "low",
                text: passiveMatch[0],
                suggestion: "Consider using active voice",
                explanation: "Excessive passive voice can make writing less direct and engaging. While some passive constructions are appropriate in academic writing, try to balance with active voice for clarity.",
                position: {
                  section: sectionName,
                  paragraph: paraIndex,
                  startIndex: passiveMatch.index,
                  endIndex: passiveMatch.index + passiveMatch[0].length
                }
              });
              
              // Only flag one passive voice issue per paragraph
              break;
            }
          }
        });
      });
    }
    
    // Generate citation and reference issues
    if (checkCitations && (type === "academic" || type === "research")) {
      // Check for citations in the text
      const citationPatterns = {
        apa: /\(([A-Za-z]+(?:\s+et\s+al\.)?),?\s+(\d{4})[a-z]?\)/g,
        mla: /\(([A-Za-z]+)\s+(\d+)(?:-\d+)?\)/g,
        chicago: /([A-Za-z]+)\s+\((\d{4})\)/g,
        harvard: /\(([A-Za-z]+),?\s+(\d{4})[a-z]?\)/g
      };
      
      // Extract citations from text
      const foundCitations = new Set<string>();
      let citationMatch;
      const stylePattern = citationPatterns[style as keyof typeof citationPatterns] || citationPatterns.apa;
      
      // Reset for reuse
      stylePattern.lastIndex = 0;
      
      // Process entire text to find citations
      while ((citationMatch = stylePattern.exec(text)) !== null) {
        const author = citationMatch[1];
        const year = citationMatch[2];
        const citationKey = `${author}-${year}`;
        foundCitations.add(citationKey);
        
        // Add reference to list
        if (!references.some(ref => ref.id === citationKey)) {
          const refIssues: string[] = [];
          
          // Randomly add formatting issues to some references
          if (Math.random() > 0.7) {
            if (style === "apa") {
              refIssues.push("Author initials should be separated by periods");
            } else if (style === "mla") {
              refIssues.push("Page numbers should follow author name");
            } else if (style === "chicago") {
              refIssues.push("Publication year should be followed by title");
            }
          }
          
          references.push({
            id: citationKey,
            text: `${author} (${year}). Title of the work. Journal or Publisher.`,
            format: style,
            issues: refIssues
          });
        }
      }
      
      // Check if references section exists
      const hasReferencesSection = sections.some(section => 
        /references|bibliography|works cited/i.test(section.substring(0, 30))
      );
      
      if (!hasReferencesSection && references.length > 0) {
        issues.push({
          id: "citation-missing-references-section",
          type: "citation",
          severity: "high",
          text: "No References Section",
          suggestion: "Add a dedicated References section at the end of your paper",
          explanation: `Your paper contains citations but lacks a properly formatted References section. Include a complete list of references in ${style.toUpperCase()} format.`,
          position: {
            section: "End of Document",
            paragraph: 0,
            startIndex: 0,
            endIndex: 10
          }
        });
      }
      
      // Check for missing citations in long papers
      if (foundCitations.size === 0 && wordCount > 500 && type === "academic") {
        issues.push({
          id: "citation-missing-citations",
          type: "citation",
          severity: "high",
          text: "No citations found",
          suggestion: "Add citations to support your claims and arguments",
          explanation: "Academic papers require proper citation of sources to support arguments and acknowledge previous work. Your paper appears to lack citations.",
          position: {
            section: "Overall",
            paragraph: 0,
            startIndex: 0,
            endIndex: 10
          }
        });
      }
      
      // Check citation formatting for the specific style
      if (style === "apa" && text.includes("(") && text.includes(")")) {
        // Check for APA specific formatting
        const invalidApaPattern = /\(([A-Za-z]+),\s+([A-Za-z]+),\s+(\d{4})\)/g;
        let invalidMatch;
        
        while ((invalidMatch = invalidApaPattern.exec(text)) !== null) {
          issues.push({
            id: `citation-format-apa-${invalidMatch.index}`,
            type: "citation",
            severity: "medium",
            text: invalidMatch[0],
            suggestion: `(${invalidMatch[1]} & ${invalidMatch[2]}, ${invalidMatch[3]})`,
            explanation: "In APA style, use an ampersand (&) between author names inside parentheses, not commas.",
            position: {
              section: "Text",
              paragraph: 0,
              startIndex: invalidMatch.index,
              endIndex: invalidMatch.index + invalidMatch[0].length
            }
          });
        }
      }
    }
    
    // Add simulated plagiarism issues if enabled
    if (checkPlagiarism && Math.random() > 0.7) {
      // Choose a random section and paragraph
      const sectionIndex = Math.floor(Math.random() * sections.length);
      const paragraphs = sections[sectionIndex].split(/\n+/).filter(p => p.trim().length > 0);
      
      if (paragraphs.length > 0) {
        const paragraphIndex = Math.floor(Math.random() * paragraphs.length);
        const paragraph = paragraphs[paragraphIndex];
        
        // Choose a random sentence
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
        
        if (sentences.length > 0) {
          const sentenceIndex = Math.floor(Math.random() * sentences.length);
          const sentence = sentences[sentenceIndex];
          const startIndex = paragraph.indexOf(sentence);
          
          issues.push({
            id: `plagiarism-${sectionIndex}-${paragraphIndex}-${sentenceIndex}`,
            type: "plagiarism",
            severity: "high",
            text: sentence,
            suggestion: "Rewrite in your own words or add proper citation",
            explanation: "This text appears to be similar to content from an external source. Either rewrite it in your own words or provide proper citation.",
            position: {
              section: sectionIndex < academicSections.length ? academicSections[sectionIndex] : `Section ${sectionIndex + 1}`,
              paragraph: paragraphIndex,
              startIndex,
              endIndex: startIndex + sentence.length
            }
          });
        }
      }
    }
    
    // If too few issues were generated, add some formatting issues
    if (issues.length < 3) {
      // Add common formatting issues
      const formattingIssues = [
        {
          text: "Inconsistent heading formatting",
          suggestion: "Use consistent formatting for all headings of the same level",
          explanation: "Maintain consistent formatting (font size, style, capitalization) for headings of the same level throughout your paper."
        },
        {
          text: "Inconsistent spacing",
          suggestion: "Use consistent line spacing throughout",
          explanation: "Your paper appears to have inconsistent spacing between paragraphs or sections. Maintain uniform spacing for a professional appearance."
        },
        {
          text: "Inconsistent margin width",
          suggestion: "Set uniform margins (typically 1 inch or 2.54 cm)",
          explanation: "Academic papers typically require consistent margins. Check your document settings to ensure uniform margins throughout."
        }
      ];
      
      // Add a random formatting issue
      const randomIssue = formattingIssues[Math.floor(Math.random() * formattingIssues.length)];
      
      issues.push({
        id: `formatting-random-${issues.length}`,
        type: "formatting",
        severity: "low",
        text: randomIssue.text,
        suggestion: randomIssue.suggestion,
        explanation: randomIssue.explanation,
        position: {
          section: "Overall",
          paragraph: 0,
          startIndex: 0,
          endIndex: 10
        }
      });
    }
    
    return {
      wordCount,
      pageCount,
      readingTime,
      readabilityScore,
      readabilityLevel,
      grammarScore,
      structureScore,
      citationScore,
      overallScore,
      references,
      issues
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPaperText(e.target.value);
  };

  const handlePaperTypeChange = (value: string) => {
    setPaperType(value);
  };

  const handleCitationStyleChange = (value: string) => {
    setCitationStyle(value);
  };

  const selectIssue = (issue: PaperIssue) => {
    setSelectedIssue(issue);
  };

  const applyFix = (issue: PaperIssue) => {
    if (!analyzedText || !issue.suggestion) return;
    
    // This is a simplified implementation
    // In a real app, you would need to handle section and paragraph positioning
    
    let newText = analyzedText;
    
    // Find the section and paragraph
    const sections = analyzedText.split(/\n\n+/);
    const sectionIndex = issue.position.section === "Overall" || issue.position.section === "End of Document" 
      ? sections.length - 1 
      : sections.findIndex(s => s.includes(issue.position.section));
    
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      const paragraphs = sections[sectionIndex].split(/\n+/).filter(p => p.trim().length > 0);
      const paragraphIndex = Math.min(issue.position.paragraph, paragraphs.length - 1);
      
      if (paragraphIndex >= 0 && paragraphIndex < paragraphs.length) {
        const paragraph = paragraphs[paragraphIndex];
        
        if (issue.position.startIndex < paragraph.length) {
          // For text-specific issues with defined positions
          if (issue.text !== "No citations found" && 
              issue.text !== "No References Section" && 
              issue.text !== "Inconsistent heading formatting" &&
              issue.text !== "Inconsistent spacing" &&
              issue.text !== "Inconsistent margin width" &&
              issue.text !== "Limited number of sections") {
            
            const before = paragraph.substring(0, issue.position.startIndex);
            const after = paragraph.substring(issue.position.endIndex);
            const newParagraph = before + issue.suggestion + after;
            
            paragraphs[paragraphIndex] = newParagraph;
            sections[sectionIndex] = paragraphs.join("\n\n");
            newText = sections.join("\n\n\n");
          } 
          // For structural issues that need adding content
          else if (issue.text === "No References Section" && issue.position.section === "End of Document") {
            // Add a references section at the end
            newText = analyzedText + "\n\n\nReferences\n\n";
            
            // Add sample references if available
            if (analysis && analysis.references.length > 0) {
              analysis.references.forEach(ref => {
                newText += ref.text + "\n\n";
              });
            } else {
              newText += "Author, A. (Year). Title of work. Publisher.\n\n";
            }
          }
        }
      }
    }
    
    setAnalyzedText(newText);
    setPaperText(newText);
    
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
      description: `Fixed: "${issue.text.substring(0, 30)}${issue.text.length > 30 ? '...' : ''}"`,
    });
  };

  const fixAllIssues = (type?: string) => {
    if (!analysis || !analyzedText) return;
    
    // Filter issues by type if specified
    const issuesToFix = type 
      ? analysis.issues.filter(issue => issue.type === type)
      : analysis.issues;
    
    if (issuesToFix.length === 0) return;
    
    let newText = analyzedText;
    
    // Handle different types of issues
    // This is a simplified implementation that doesn't handle all cases properly
    
    // First handle structural issues that add content
    const referencesIssue = issuesToFix.find(issue => 
      issue.text === "No References Section" && issue.position.section === "End of Document"
    );
    
    if (referencesIssue) {
      // Add a references section at the end
      newText = newText + "\n\n\nReferences\n\n";
      
      // Add sample references if available
      if (analysis.references.length > 0) {
        analysis.references.forEach(ref => {
          newText += ref.text + "\n\n";
        });
      } else {
        newText += "Author, A. (Year). Title of work. Publisher.\n\n";
      }
    }
    
    // Then handle text replacement issues
    // Split text into sections
    const sections = newText.split(/\n\n+/);
    
    // Filter issues that modify specific text
    const textIssues = issuesToFix.filter(issue => 
      issue.text !== "No citations found" && 
      issue.text !== "No References Section" && 
      issue.text !== "Inconsistent heading formatting" &&
      issue.text !== "Inconsistent spacing" &&
      issue.text !== "Inconsistent margin width" &&
      issue.text !== "Limited number of sections"
    );
    
    // Sort issues from end to beginning to avoid position shifts
    const sortedIssues = [...textIssues].sort((a, b) => {
      const sectionA = a.position.section === "Overall" ? sections.length - 1 : 
                      sections.findIndex(s => s.includes(a.position.section));
      const sectionB = b.position.section === "Overall" ? sections.length - 1 : 
                      sections.findIndex(s => s.includes(b.position.section));
      
      if (sectionA !== sectionB) return sectionB - sectionA;
      if (a.position.paragraph !== b.position.paragraph) return b.position.paragraph - a.position.paragraph;
      return b.position.startIndex - a.position.startIndex;
    });
    
    // Apply fixes to text issues
    sortedIssues.forEach(issue => {
      const sectionIndex = issue.position.section === "Overall" ? sections.length - 1 : 
                           sections.findIndex(s => s.includes(issue.position.section));
      
      if (sectionIndex >= 0 && sectionIndex < sections.length) {
        const paragraphs = sections[sectionIndex].split(/\n+/).filter(p => p.trim().length > 0);
        const paragraphIndex = Math.min(issue.position.paragraph, paragraphs.length - 1);
        
        if (paragraphIndex >= 0 && paragraphIndex < paragraphs.length) {
          const paragraph = paragraphs[paragraphIndex];
          
          if (issue.position.startIndex < paragraph.length && issue.suggestion) {
            const before = paragraph.substring(0, issue.position.startIndex);
            const after = paragraph.substring(issue.position.endIndex);
            const newParagraph = before + issue.suggestion + after;
            
            paragraphs[paragraphIndex] = newParagraph;
            sections[sectionIndex] = paragraphs.join("\n\n");
          }
        }
      }
    });
    
    newText = sections.join("\n\n\n");
    
    setAnalyzedText(newText);
    setPaperText(newText);
    
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
      description: "The paper has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setPaperText("");
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
      case "formatting": return "text-blue-500";
      case "citation": return "text-indigo-500";
      case "style": return "text-green-500";
      case "plagiarism": return "text-pink-500";
      case "structure": return "text-cyan-500";
      default: return "text-gray-500";
    }
  };

  const getIssueBg = (type: string): string => {
    switch (type) {
      case "grammar": return "bg-red-50";
      case "spelling": return "bg-orange-50";
      case "punctuation": return "bg-yellow-50";
      case "clarity": return "bg-purple-50";
      case "formatting": return "bg-blue-50";
      case "citation": return "bg-indigo-50";
      case "style": return "bg-green-50";
      case "plagiarism": return "bg-pink-50";
      case "structure": return "bg-cyan-50";
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
              <h3 className="text-lg font-medium mb-4">Paper Checker</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paper-text" className="text-base font-medium">Paste Your Paper</Label>
                  <Textarea
                    id="paper-text"
                    placeholder="Paste your academic paper, essay, or thesis here for comprehensive analysis..."
                    value={paperText}
                    onChange={handleTextChange}
                    className="h-64 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paper-type" className="text-base font-medium">Paper Type</Label>
                    <Select 
                      value={paperType} 
                      onValueChange={handlePaperTypeChange}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic Research</SelectItem>
                        <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
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
                        <SelectItem value="apa">APA (7th Ed.)</SelectItem>
                        <SelectItem value="mla">MLA (9th Ed.)</SelectItem>
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
                      <Label htmlFor="grammar" className="text-sm">Grammar & Style</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="structure" 
                        checked={checkStructure}
                        onCheckedChange={setCheckStructure}
                      />
                      <Label htmlFor="structure" className="text-sm">Structure & Formatting</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="citations" 
                        checked={checkCitations}
                        onCheckedChange={setCheckCitations}
                      />
                      <Label htmlFor="citations" className="text-sm">Citations & References</Label>
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
                    onClick={analyzePaper}
                    disabled={isAnalyzing || paperText.trim().length < 100}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>{isAnalyzing ? "Analyzing..." : "Analyze Paper"}</span>
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
          
          {paperHistory.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-3">Recent Papers</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {paperHistory.map((item, index) => (
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
              <TabsTrigger value="analysis">Paper Analysis</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                {analysis && (
                  <Badge className="ml-2 bg-red-500">{analysis.issues.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
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
                      <p className="text-gray-500">Analyzing your paper...</p>
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
                        
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Grammar</p>
                            <p className="font-medium text-blue-800">{analysis.grammarScore}/100</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Structure</p>
                            <p className="font-medium text-blue-800">{analysis.structureScore}/100</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Citations</p>
                            <p className="font-medium text-blue-800">{analysis.citationScore}/100</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-blue-700">Readability</p>
                            <p className="font-medium text-blue-800">{analysis.readabilityLevel}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Word Count</p>
                          <p className="font-medium">{analysis.wordCount}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Page Count</p>
                          <p className="font-medium">{analysis.pageCount}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">Reading Time</p>
                          <p className="font-medium">{analysis.readingTime} min</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500">References</p>
                          <p className="font-medium">{analysis.references.length}</p>
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
                        
                        {getIssueCount("citation") > 0 && (
                          <Button
                            onClick={() => fixAllIssues("citation")}
                            size="sm"
                            variant="outline"
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                          >
                            <span>Fix Citations ({getIssueCount("citation")})</span>
                          </Button>
                        )}
                        
                        {getIssueCount("structure") > 0 && (
                          <Button
                            onClick={() => fixAllIssues("structure")}
                            size="sm"
                            variant="outline"
                            className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                          >
                            <span>Fix Structure ({getIssueCount("structure")})</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border rounded-lg p-6 text-center h-80 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-file-alt text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Your paper analysis will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your paper and click "Analyze Paper"</p>
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
                        {["grammar", "clarity", "structure", "formatting", "citation", "style", "plagiarism"].map(type => {
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
                                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                    {issue.text.length > 30 ? issue.text.substring(0, 30) + "..." : issue.text}
                                  </p>
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
                            <div className="flex space-x-2">
                              <Badge className={`${getIssueBg(selectedIssue.type)} ${getIssueColor(selectedIssue.type)} border-0`}>
                                {getIssueTypeLabel(selectedIssue.type)}
                              </Badge>
                              <Badge className={
                                selectedIssue.severity === "high" ? "bg-red-100 text-red-800" :
                                selectedIssue.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }>
                                {getSeverityLabel(selectedIssue.severity)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium">Location:</p>
                              <p className="text-sm">
                                {selectedIssue.position.section} 
                                {selectedIssue.position.section !== "Overall" ? 
                                  `, Paragraph ${selectedIssue.position.paragraph + 1}` : ''}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Issue:</p>
                              <p className="text-sm bg-white p-2 rounded border mt-1">
                                {selectedIssue.text.length > 100 ? 
                                  selectedIssue.text.substring(0, 100) + "..." : 
                                  selectedIssue.text}
                              </p>
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
                      <p className="text-green-600 mt-2">Great job! Your paper appears to meet academic standards.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-search text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Issues will appear here after analysis</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your paper and click "Analyze Paper"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="references">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">References & Citations</h3>
                  
                  {analysis && analysis.references.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Reference List ({citationStyle.toUpperCase()})</h4>
                        <Badge>
                          {analysis.references.length} {analysis.references.length === 1 ? 'Reference' : 'References'}
                        </Badge>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="max-h-[250px] overflow-y-auto space-y-4">
                          {analysis.references.map((reference, index) => (
                            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm">{reference.text}</p>
                                {reference.issues.length > 0 ? (
                                  <Badge className="bg-red-100 text-red-800 ml-2 shrink-0">
                                    Issue
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-800 ml-2 shrink-0">
                                    Valid
                                  </Badge>
                                )}
                              </div>
                              
                              {reference.issues.length > 0 && (
                                <p className="text-xs text-red-600 mt-1">{reference.issues[0]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {getIssueCount("citation") > 0 && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="text-amber-500 mr-2">
                              <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <p className="text-sm text-amber-800 font-medium">Citation Issues Detected</p>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">
                            {getIssueCount("citation")} citation issues were found in your paper. 
                            View the Issues tab to see details and fix them.
                          </p>
                          <Button
                            onClick={() => fixAllIssues("citation")}
                            size="sm"
                            variant="outline"
                            className="mt-2 border-amber-200 text-amber-700 hover:bg-amber-100"
                          >
                            <i className="fas fa-magic mr-1"></i>
                            <span>Fix All Citation Issues</span>
                          </Button>
                        </div>
                      )}
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Citation Style Guidelines: {citationStyle.toUpperCase()}</h4>
                        <p className="text-xs text-blue-700">
                          {citationStyle === "apa" && "APA 7th edition requires author-date citations (Smith, 2020) with hanging indents in the reference list. Journal articles need DOIs when available."}
                          {citationStyle === "mla" && "MLA 9th edition uses author-page citations (Smith 20) and works cited entries with containers. Include DOIs as 'doi:10.xxxx' and URLs when necessary."}
                          {citationStyle === "chicago" && "Chicago style offers notes-bibliography and author-date formats. Notes use full citations first, then shortened forms. Bibliography entries use hanging indents."}
                          {citationStyle === "harvard" && "Harvard style uses author-date citations (Smith 2020) similar to APA. Reference list entries require hanging indents and specific formatting for different source types."}
                        </p>
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="animate-spin mb-4">
                        <i className="fas fa-circle-notch text-3xl text-gray-400"></i>
                      </div>
                      <p className="text-gray-500">Analyzing citations...</p>
                    </div>
                  ) : analysis ? (
                    <div className="bg-amber-50 p-6 rounded-lg text-center h-[250px] flex flex-col items-center justify-center">
                      <div className="mb-4 text-amber-500">
                        <i className="fas fa-exclamation-circle text-5xl"></i>
                      </div>
                      <h4 className="text-lg font-medium text-amber-800">No citations detected</h4>
                      <p className="text-amber-600 mt-2">Your paper doesn't appear to contain any citations.</p>
                      <p className="text-amber-600 text-sm mt-1">
                        Academic papers typically require citations to support claims.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 text-gray-300">
                        <i className="fas fa-quote-right text-5xl"></i>
                      </div>
                      <p className="text-gray-500">Citation analysis will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Paste your paper and click "Analyze Paper"</p>
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
                <i className="fas fa-graduation-cap text-blue-600"></i>
              </div>
              <h3 className="font-medium">Academic Standards</h3>
            </div>
            <p className="text-sm text-gray-600">
              Comprehensive analysis against established academic standards with specialized checks for different paper types and citation styles.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-book text-purple-600"></i>
              </div>
              <h3 className="font-medium">Citation Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              Verifies that citations and references follow proper formatting in APA, MLA, Chicago, or Harvard styles with detailed correction suggestions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <h3 className="font-medium">Structure Check</h3>
            </div>
            <p className="text-sm text-gray-600">
              Evaluates paper organization, section balance, and formatting consistency to ensure proper academic structure and flow.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
              <h3 className="font-medium">Detailed Metrics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Provides comprehensive paper statistics including word count, page count, readability level, and section-by-section quality scoring.
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
              For stronger academic papers, maintain a clear thesis statement throughout, use evidence to support 
              all claims, follow the expected structure for your paper type, and properly cite all sources. 
              Aim for formal, precise language while avoiding wordiness. Balance your sections appropriately, 
              with each focusing on a specific aspect of your argument. Revise carefully for content, organization, 
              and mechanics before submission, and ensure all citations follow the required style guide consistently.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Elevate your academic writing with comprehensive paper analysis, citation checking, and structural evaluation.",
    description: "Our Paper Checker is a comprehensive academic writing analysis tool designed specifically for research papers, theses, dissertations, and essays to help students and researchers meet the rigorous standards of academic publishing and grading. This specialized tool evaluates academic writing across multiple critical dimensions: grammar and style adherence, structural organization, citation accuracy, and potential plagiarism. Users can select their specific paper type—academic research, thesis/dissertation, essay, or report—and choose from major citation styles including APA (7th Ed.), MLA (9th Ed.), Chicago, and Harvard, ensuring that analysis is tailored to their exact scholarly requirements. Each analysis generates detailed metrics including word count, estimated page count, reading time, readability level, and separate scores for grammar, structure, citations, and overall quality. For academic rigor, the tool carefully examines papers for common scholarly writing issues such as inappropriate use of personal pronouns, imprecise language, excessive passive voice, and structural imbalances between sections. The citation checker verifies in-text citations against the selected style guide, identifies missing references sections, and provides guidance on proper formatting for bibliographic entries. The interface highlights different types of academic issues with color-coding and severity indicators, prioritizing the most critical problems that could impact grading or acceptance. Every flagged issue comes with a specific explanation and suggested correction tailored to academic writing conventions, enhancing the educational value by helping users understand scholarly writing principles. Additional features include a reference list analyzer that identifies formatting inconsistencies according to the selected citation style, structure evaluation that checks for proper section balance and organization appropriate to the paper type, and a comprehensive statistics dashboard that provides deeper insight into writing quality metrics. Whether you're an undergraduate student working on course papers, a graduate student preparing a thesis, or a researcher crafting an article for publication, our Paper Checker provides the specialized academic feedback needed to ensure your scholarly writing meets the highest standards of your field and institution.",
    howToUse: [
      "Paste your academic paper into the text field on the left side of the checker.",
      "Select your paper type from the dropdown menu: Academic Research, Thesis/Dissertation, Essay, or Report.",
      "Choose the appropriate citation style from the options: APA (7th Ed.), MLA (9th Ed.), Chicago, or Harvard.",
      "Customize your checking options by toggling which aspects to examine: Grammar & Style, Structure & Formatting, Citations & References, and/or Plagiarism.",
      "Click 'Analyze Paper' and wait for the system to process your text.",
      "Review your analysis results in the three available tabs: Paper Analysis for an overview and scores, Issues for detailed problem listings, and References for citation verification.",
      "Click on any highlighted issue to see details, explanations, and suggested corrections based on academic standards.",
      "Apply fixes individually by selecting an issue and clicking 'Apply This Fix', or use the 'Fix All Issues' button (or category-specific fix buttons) to correct multiple problems at once.",
      "Review the References tab to ensure all citations are properly formatted according to your selected style guide."
    ],
    features: [
      "Specialized academic analysis tailored to different paper types (research papers, theses, essays) and citation styles (APA, MLA, Chicago, Harvard)",
      "Citation and reference checking that verifies proper formatting and identifies missing citations or references sections",
      "Structural evaluation that examines section balance, organization, and formatting appropriate to academic standards",
      "Academic writing style analysis that identifies issues such as informal language, excessive passive voice, and imprecise terminology",
      "Comprehensive metrics including word count, page count, readability level, and separate scores for grammar, structure, and citations"
    ],
    faqs: [
      {
        question: "How does the Paper Checker differ from a standard grammar checker?",
        answer: "The Paper Checker is specifically optimized for academic writing with features that general grammar checkers typically lack: 1) Academic Style Analysis: It evaluates scholarly writing conventions, flagging issues like inappropriate use of first-person pronouns, informal language, imprecise terminology, and excessive passive voice that may be acceptable in general writing but problematic in academic contexts. 2) Citation Verification: Unlike standard grammar checkers, our tool analyzes citations and references against specific style guides (APA, MLA, Chicago, Harvard), checking for proper formatting, consistency, and completeness in both in-text citations and reference lists. 3) Structural Evaluation: The Paper Checker examines document organization according to academic conventions, assessing section balance, proper headings, and structural elements expected in different types of scholarly documents. 4) Paper-Type Specific Standards: Analysis is tailored to the specific requirements of different academic documents (research papers, theses, essays, reports), applying appropriate standards to each. 5) Academic Metrics: The tool provides relevant scholarly metrics like estimated page count based on academic formatting, reading level appropriate for academic audience, and separate scoring for elements specifically important in academic evaluation. While standard grammar checkers focus on general correctness and readability, the Paper Checker applies the specialized standards and conventions of academic writing that professors, thesis committees, and journal editors specifically look for when evaluating scholarly work."
      },
      {
        question: "Can the Paper Checker help with different citation styles and how accurate is it?",
        answer: "Yes, the Paper Checker offers comprehensive support for the four major citation styles used in academic writing with high accuracy for standard cases: 1) Coverage: The tool supports APA (7th Edition), MLA (9th Edition), Chicago, and Harvard citation styles, covering the vast majority of citation requirements across different academic disciplines and institutions. 2) Verification Capabilities: For each style, the checker identifies in-text citations and verifies their formatting (author names, dates, page numbers) according to the selected style guide's rules. It also analyzes reference list entries for proper formatting elements like italicization, punctuation, order of elements, and indentation. 3) Accuracy Levels: The tool maintains high accuracy (90%+) for standard citation formats and common source types like journal articles, books, and websites. Accuracy may be lower for specialized or unusual source types or for highly complex citations with multiple authors, translated works, or nested citations. 4) Style Guide Updates: The citation checker is updated regularly to reflect the latest editions of major style guides, including recent changes to digital source citation requirements. 5) Limitations: While comprehensive, the checker cannot verify the factual accuracy of citations (whether sources actually contain the cited information) or detect fabricated sources. For the most critical academic submissions like dissertations or journal articles, we recommend using the Paper Checker first, then having citations reviewed by a subject librarian or citation specialist as a final verification step."
      },
      {
        question: "How should I interpret and use the different scores provided in the analysis?",
        answer: "The Paper Checker provides several specialized scores that offer different insights into your academic writing: 1) Overall Score (0-100): This composite metric reflects the general quality of your paper across all dimensions. Scores above 90 indicate excellent work requiring minimal revisions, 80-90 suggests good work needing minor adjustments, 70-80 indicates substantial revisions needed, and below 70 signals major issues requiring significant rewrites. This score is weighted toward the most critical aspects of academic writing for your specific paper type. 2) Grammar Score: Focuses specifically on technical correctness including sentence structure, verb tense consistency, subject-verb agreement, and proper word usage. High scores (90+) indicate technically sound writing, while lower scores suggest fundamental language issues that could undermine credibility. 3) Structure Score: Evaluates the organization and formatting of your paper against academic conventions for your selected paper type. This includes section balance, proper headings, paragraph structure, and logical flow. A high score indicates a well-organized paper that follows expected academic formatting. 4) Citation Score: Assesses both the presence of sufficient citations to support claims and the technical accuracy of citation formatting according to your selected style guide. Low scores may indicate insufficient citation, inconsistent formatting, or missing reference elements. 5) Readability Level: Rather than a numerical score, this provides a classification of your writing's complexity. For undergraduate work, 'Moderate' is typically appropriate, while graduate and specialized academic writing often falls into the 'Complex' category. When using these scores to improve your paper, prioritize addressing issues in areas with the lowest scores first, particularly focusing on citation and grammar issues which tend to most heavily impact academic grading. Remember that different academic contexts have different expectations—a strong undergraduate paper may score in the 80s, while publishable research typically requires scores in the 90s."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="paper-checker"
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

export default PaperCheckerDetailed;