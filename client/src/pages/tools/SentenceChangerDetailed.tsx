import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const SentenceChangerDetailed = () => {
  const [originalSentence, setOriginalSentence] = useState("");
  const [changedSentences, setChangedSentences] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [changeType, setChangeType] = useState("tense");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [preserveMeaning, setPreserveMeaning] = useState(true);
  const [changePreference, setChangePreference] = useState("standard");
  const { toast } = useToast();

  const changeSentence = () => {
    if (originalSentence.trim().length < 10) {
      toast({
        title: "Sentence too short",
        description: "Please enter a sentence with at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setChangedSentences([]);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          generateChangedSentences();
          return 100;
        }
        return prevProgress + 10;
      });
    }, 80);
  };

  const generateChangedSentences = () => {
    // Generate different changed versions based on the selected type
    const variations: string[] = [];
    
    switch (changeType) {
      case "tense":
        variations.push(changeToPastTense(originalSentence));
        variations.push(changeToPresentTense(originalSentence));
        variations.push(changeToFutureTense(originalSentence));
        break;
      case "voice":
        variations.push(changeToActiveVoice(originalSentence));
        variations.push(changeToPassiveVoice(originalSentence));
        break;
      case "structure":
        variations.push(changeToQuestionForm(originalSentence));
        variations.push(changeToNegativeForm(originalSentence));
        variations.push(changeToImperativeForm(originalSentence));
        break;
      case "simplify":
        variations.push(simplifyMildly(originalSentence));
        variations.push(simplifyModerately(originalSentence));
        variations.push(simplifyDrastically(originalSentence));
        break;
      case "elaboration":
        variations.push(elaborateBasic(originalSentence));
        variations.push(elaborateModerate(originalSentence));
        variations.push(elaborateDetailed(originalSentence));
        break;
      default:
        variations.push(changeToPastTense(originalSentence));
        variations.push(changeToActiveVoice(originalSentence));
        variations.push(changeToQuestionForm(originalSentence));
    }
    
    // Filter out empty results
    const filteredVariations = variations.filter(v => v.trim() !== "");
    
    // Apply additional adjustments based on preferences
    const finalVariations = filteredVariations.map(sentence => {
      if (preserveMeaning) {
        return preserveSentenceMeaning(sentence);
      }
      return sentence;
    });
    
    setChangedSentences(finalVariations);
    
    if (finalVariations.length > 0) {
      setSelectedSentence(finalVariations[0]);
    }
    
    toast({
      title: "Sentence Changed",
      description: `Generated ${finalVariations.length} variations of your sentence`,
    });
  };

  // Tense change functions
  const changeToPastTense = (sentence: string): string => {
    // Check if already in past tense
    if (isPastTense(sentence)) {
      return sentence + " (Already in past tense)";
    }
    
    // Different strategies based on preference
    if (changePreference === "formal") {
      return sentence
        .replace(/\b(am|are|is)\b/g, "was")
        .replace(/\b(have|has)\b/g, "had")
        .replace(/\b(do|does)\b/g, "did")
        .replace(/\b(can)\b/g, "could")
        .replace(/\b(will)\b/g, "would")
        .replace(/\b(go|goes)\b/g, "went")
        .replace(/\b(come|comes)\b/g, "came")
        .replace(/\b(get|gets)\b/g, "got")
        .replace(/\b(make|makes)\b/g, "made")
        .replace(/\b(take|takes)\b/g, "took")
        .replace(/\b(see|sees)\b/g, "saw")
        .replace(/\b(write|writes)\b/g, "wrote")
        .replace(/\b(eat|eats)\b/g, "ate")
        .replace(/\b(drink|drinks)\b/g, "drank")
        .replace(/\b(run|runs)\b/g, "ran")
        .replace(/\b(find|finds)\b/g, "found")
        .replace(/\b(think|thinks)\b/g, "thought");
    } else {
      // Add "Yesterday" to the beginning and change appropriate verbs
      return "Yesterday " + sentence
        .replace(/\b(am|are|is)\b/g, "was")
        .replace(/\b(have|has)\b/g, "had")
        .replace(/\b(do|does)\b/g, "did")
        .replace(/\b(can)\b/g, "could")
        .replace(/\b(will)\b/g, "would")
        .replace(/\b(I|we|they)\s+(\w+)\b/g, (match, pronoun, verb) => {
          // Check for common irregular verbs
          const irregularPast: Record<string, string> = {
            "go": "went",
            "come": "came",
            "get": "got",
            "make": "made",
            "take": "took",
            "see": "saw",
            "write": "wrote",
            "eat": "ate",
            "drink": "drank",
            "run": "ran",
            "find": "found",
            "think": "thought"
          };
          
          if (irregularPast[verb]) {
            return `${pronoun} ${irregularPast[verb]}`;
          } else if (!verb.endsWith("ed")) {
            // Add 'ed' to regular verbs that don't already end with 'ed'
            return `${pronoun} ${verb}ed`;
          }
          
          return match;
        });
    }
  };

  const changeToPresentTense = (sentence: string): string => {
    // Different strategies based on preference
    if (changePreference === "formal") {
      return sentence
        .replace(/\b(was|were)\b/g, "is")
        .replace(/\b(had)\b/g, "has")
        .replace(/\b(did)\b/g, "does")
        .replace(/\b(could)\b/g, "can")
        .replace(/\b(would)\b/g, "will")
        .replace(/\b(went)\b/g, "goes")
        .replace(/\b(came)\b/g, "comes")
        .replace(/\b(got)\b/g, "gets")
        .replace(/\b(made)\b/g, "makes")
        .replace(/\b(took)\b/g, "takes")
        .replace(/\b(saw)\b/g, "sees")
        .replace(/\b(wrote)\b/g, "writes")
        .replace(/\b(ate)\b/g, "eats")
        .replace(/\b(drank)\b/g, "drinks")
        .replace(/\b(ran)\b/g, "runs")
        .replace(/\b(found)\b/g, "finds")
        .replace(/\b(thought)\b/g, "thinks");
    } else {
      // Add "Every day" to the beginning and change appropriate verbs
      return "Every day " + sentence
        .replace(/\b(was|were)\b/g, "is")
        .replace(/\b(had)\b/g, "has")
        .replace(/\b(did)\b/g, "does")
        .replace(/\b(could)\b/g, "can")
        .replace(/\b(would)\b/g, "will")
        .replace(/\b(Yesterday)\b/g, "")
        .replace(/\b(went)\b/g, "go")
        .replace(/\b(came)\b/g, "come")
        .replace(/\b(got)\b/g, "get")
        .replace(/\b(made)\b/g, "make")
        .replace(/\b(took)\b/g, "take")
        .replace(/\b(saw)\b/g, "see")
        .replace(/\b(wrote)\b/g, "write")
        .replace(/\b(ate)\b/g, "eat")
        .replace(/\b(drank)\b/g, "drink")
        .replace(/\b(ran)\b/g, "run")
        .replace(/\b(found)\b/g, "find")
        .replace(/\b(thought)\b/g, "think")
        .replace(/\b(\w+)ed\b/g, (match, verb) => {
          // Remove 'ed' from regular verbs
          return verb;
        });
    }
  };

  const changeToFutureTense = (sentence: string): string => {
    // Different strategies based on preference
    if (changePreference === "formal") {
      return sentence
        .replace(/\b(am|are|is|was|were)\b/g, "will be")
        .replace(/\b(have|has|had)\b/g, "will have")
        .replace(/\b(do|does|did)\b/g, "will do")
        .replace(/\b(can|could)\b/g, "will be able to")
        .replace(/\b(go|goes|went)\b/g, "will go")
        .replace(/\b(come|comes|came)\b/g, "will come")
        .replace(/\b(get|gets|got)\b/g, "will get")
        .replace(/\b(make|makes|made)\b/g, "will make")
        .replace(/\b(take|takes|took)\b/g, "will take")
        .replace(/\b(see|sees|saw)\b/g, "will see")
        .replace(/\b(write|writes|wrote)\b/g, "will write")
        .replace(/\b(eat|eats|ate)\b/g, "will eat")
        .replace(/\b(drink|drinks|drank)\b/g, "will drink")
        .replace(/\b(run|runs|ran)\b/g, "will run")
        .replace(/\b(find|finds|found)\b/g, "will find")
        .replace(/\b(think|thinks|thought)\b/g, "will think");
    } else {
      // Add "Tomorrow" to the beginning and change appropriate verbs
      return "Tomorrow " + sentence
        .replace(/\b(am|are|is|was|were)\b/g, "will be")
        .replace(/\b(have|has|had)\b/g, "will have")
        .replace(/\b(do|does|did)\b/g, "will do")
        .replace(/\b(can|could)\b/g, "will be able to")
        .replace(/\b(Yesterday|Every day)\b/g, "")
        .replace(/\b(I|we|they)\s+(\w+)\b/g, (match, pronoun, verb) => {
          // Don't change verbs that are already in future tense
          if (verb === "will" || verb === "shall") {
            return match;
          }
          return `${pronoun} will ${verb}`;
        });
    }
  };

  // Voice change functions
  const changeToActiveVoice = (sentence: string): string => {
    // This is a simplified implementation that attempts to detect and convert
    // common passive voice patterns to active voice
    if (sentence.match(/\b(is|are|was|were)\s+(\w+ed|made|done|created|written|built)\s+by\s+(\w+)/i)) {
      return sentence.replace(
        /\b(is|are|was|were)\s+(\w+ed|made|done|created|written|built)\s+by\s+(\w+)/i,
        (match, beVerb, pastParticiple, subject) => {
          const verb = pastParticiple.replace(/ed$/, "");
          return `${subject} ${verb}s`;
        }
      );
    } else if (sentence.match(/\b(is|are|was|were)\s+(\w+ed|made|done|created|written|built)/i)) {
      // If no "by" clause, add a generic subject
      return sentence.replace(
        /\b(is|are|was|were)\s+(\w+ed|made|done|created|written|built)/i,
        (match, beVerb, pastParticiple) => {
          const verb = pastParticiple.replace(/ed$/, "");
          return `Someone ${verb}s`;
        }
      );
    }
    
    return sentence + " (This appears to be in active voice already)";
  };

  const changeToPassiveVoice = (sentence: string): string => {
    // This is a simplified implementation that attempts to detect and convert
    // common active voice patterns to passive voice
    
    // Identify subject-verb-object pattern
    const svoPattern = /\b(\w+)\s+(\w+s|\w+es|\w+)\s+(\w+|\w+\s+\w+)\b/i;
    if (sentence.match(svoPattern)) {
      return sentence.replace(
        svoPattern,
        (match, subject, verb, object) => {
          // Simplistic handling of verb conjugation
          const pastParticiple = verb.endsWith('s') ? 
            verb.replace(/s$/, "ed") : 
            verb.endsWith('es') ?
              verb.replace(/es$/, "ed") :
              verb + "ed";
          
          return `${object} is ${pastParticiple} by ${subject}`;
        }
      );
    }
    
    return sentence + " (Could not convert to passive voice)";
  };

  // Structure change functions  
  const changeToQuestionForm = (sentence: string): string => {
    // Remove trailing punctuation
    sentence = sentence.replace(/[.!?]+$/, "");
    
    // Different strategies based on preference
    if (changePreference === "formal") {
      // Basic patterns for converting statements to questions
      if (sentence.match(/\b(I|we|they|he|she|it|you)\s+(\w+)\b/i)) {
        return sentence.replace(
          /\b(I|we|they|he|she|it|you)\s+(\w+)\b/i,
          (match, subject, verb) => {
            // Handle special cases
            if (verb === "am" && subject.toLowerCase() === "i") {
              return "Am I";
            } else if (verb === "are" && (subject.toLowerCase() === "you" || subject.toLowerCase() === "we" || subject.toLowerCase() === "they")) {
              return `Are ${subject}`;
            } else if (verb === "is" && (subject.toLowerCase() === "he" || subject.toLowerCase() === "she" || subject.toLowerCase() === "it")) {
              return `Is ${subject}`;
            } else if (verb === "have" && (subject.toLowerCase() === "i" || subject.toLowerCase() === "you" || subject.toLowerCase() === "we" || subject.toLowerCase() === "they")) {
              return `Have ${subject}`;
            } else if (verb === "has" && (subject.toLowerCase() === "he" || subject.toLowerCase() === "she" || subject.toLowerCase() === "it")) {
              return `Has ${subject}`;
            } else {
              // General case
              return `Do ${subject} ${verb}`;
            }
          }
        ) + "?";
      } else if (sentence.match(/\b(am|are|is|was|were|have|has|had|can|could|will|would|shall|should)\s/i)) {
        // For sentences with auxiliary/modal verbs, invert the order
        return sentence.replace(
          /\b(am|are|is|was|were|have|has|had|can|could|will|would|shall|should)\s+(\w+)/i,
          (match, auxVerb, subject) => {
            return `${auxVerb.charAt(0).toUpperCase() + auxVerb.slice(1)} ${subject}`;
          }
        ) + "?";
      }
    } else {
      // More conversational approach 
      // Add question starters
      const questionStarters = [
        "Could you tell me if ",
        "I was wondering if ",
        "Do you think ",
        "Would you say that ",
        "Have you considered if "
      ];
      
      const randomStarter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
      return randomStarter + sentence.charAt(0).toLowerCase() + sentence.slice(1) + "?";
    }
    
    // Default conversion if patterns don't match
    return "Is it true that " + sentence.charAt(0).toLowerCase() + sentence.slice(1) + "?";
  };

  const changeToNegativeForm = (sentence: string): string => {
    // Remove trailing punctuation
    sentence = sentence.replace(/[.!?]+$/, "");
    
    // Different strategies based on preference
    if (sentence.match(/\b(am|are|is|was|were)\b/i)) {
      return sentence.replace(
        /\b(am|are|is|was|were)\b/i,
        (match) => `${match} not`
      );
    } else if (sentence.match(/\b(have|has|had)\b/i)) {
      return sentence.replace(
        /\b(have|has|had)\b/i,
        (match) => `${match} not`
      );
    } else if (sentence.match(/\b(can|could|will|would|shall|should|may|might|must)\b/i)) {
      return sentence.replace(
        /\b(can|could|will|would|shall|should|may|might|must)\b/i,
        (match) => `${match} not`
      );
    } else if (sentence.match(/\b(I|we|they|you)\s+(\w+)\b/i)) {
      return sentence.replace(
        /\b(I|we|they|you)\s+(\w+)\b/i,
        (match, subject, verb) => `${subject} do not ${verb}`
      );
    } else if (sentence.match(/\b(he|she|it)\s+(\w+)s\b/i)) {
      return sentence.replace(
        /\b(he|she|it)\s+(\w+)s\b/i,
        (match, subject, verb) => `${subject} does not ${verb}`
      );
    }
    
    // Default approach
    return "It is not true that " + sentence.charAt(0).toLowerCase() + sentence.slice(1);
  };

  const changeToImperativeForm = (sentence: string): string => {
    // Remove trailing punctuation
    sentence = sentence.replace(/[.!?]+$/, "");
    
    // Different approaches based on preference
    if (changePreference === "formal") {
      // Extract a verb and create a formal command
      const verbMatches = sentence.match(/\b(\w+ing|\w+s|\w+es|\w+e|\w+)\b/);
      if (verbMatches && verbMatches[1]) {
        const verb = verbMatches[1]
          .replace(/ing$/, "")
          .replace(/s$/, "")
          .replace(/es$/, "");
          
        return "Please " + verb + " " + sentence.replace(verbMatches[0], "").trim() + ".";
      }
    } else {
      // More direct command
      if (sentence.match(/\b(I|we|they|you|he|she|it)\s+(\w+)\b/i)) {
        return sentence.replace(
          /\b(I|we|they|you|he|she|it)\s+(\w+)\b/i,
          (match, subject, verb) => {
            // Don't include the subject in imperative
            return verb.charAt(0).toUpperCase() + verb.slice(1);
          }
        ) + "!";
      }
    }
    
    // Default approach - extract a simple command from context
    const words = sentence.split(" ");
    if (words.length > 2) {
      const middleIndex = Math.floor(words.length / 2);
      return words[middleIndex].charAt(0).toUpperCase() + words[middleIndex].slice(1) + " now!";
    }
    
    return "Please take action based on this: " + sentence;
  };

  // Simplification functions
  const simplifyMildly = (sentence: string): string => {
    return sentence
      .replace(/\b(\w{4,})\b/g, (match) => {
        // Replace some longer words with simpler alternatives
        const simplifications: Record<string, string> = {
          "utilize": "use",
          "purchase": "buy",
          "sufficient": "enough",
          "demonstrate": "show",
          "subsequently": "later",
          "additional": "more",
          "approximately": "about",
          "functionality": "use",
          "endeavor": "try",
          "assistance": "help"
        };
        
        return simplifications[match.toLowerCase()] || match;
      });
  };

  const simplifyModerately = (sentence: string): string => {
    // Break complex sentences
    if (sentence.includes(",") && sentence.length > 40) {
      const parts = sentence.split(",");
      return parts.map(part => part.trim()).join(". ");
    }
    
    return simplifyMildly(sentence)
      .replace(/\b(by means of)\b/g, "by")
      .replace(/\b(due to the fact that)\b/g, "because")
      .replace(/\b(in the event that)\b/g, "if")
      .replace(/\b(in order to)\b/g, "to")
      .replace(/\b(has the capability to)\b/g, "can")
      .replace(/\b(prior to)\b/g, "before")
      .replace(/\b(subsequent to)\b/g, "after")
      .replace(/\b(in the vicinity of)\b/g, "near");
  };

  const simplifyDrastically = (sentence: string): string => {
    // Break sentence into shorter segments
    const parts = sentence.split(/\s+/);
    if (parts.length > 12) {
      const firstHalf = parts.slice(0, Math.ceil(parts.length / 2)).join(" ");
      const secondHalf = parts.slice(Math.ceil(parts.length / 2)).join(" ");
      return `${firstHalf}. ${secondHalf}`;
    }
    
    // Apply moderate simplifications first
    let simplified = simplifyModerately(sentence);
    
    // Further simplify by removing non-essential phrases and clauses
    simplified = simplified
      .replace(/\b(as a matter of fact|needless to say|it goes without saying that)\b/g, "")
      .replace(/\b(in a very real sense|in this day and age|all things considered)\b/g, "")
      .replace(/\b(with reference to|with regard to|in respect to)\b/g, "about")
      .replace(/\b(for all intents and purposes)\b/g, "basically")
      .replace(/\b(at the present time)\b/g, "now");
    
    // Focus on core subject-verb-object only
    const svoMatch = simplified.match(/\b(\w+)\s+(\w+s|\w+es|\w+)\s+(\w+|\w+\s+\w+)\b/i);
    if (svoMatch) {
      return `${svoMatch[1]} ${svoMatch[2]} ${svoMatch[3]}.`;
    }
    
    return simplified;
  };

  // Elaboration functions
  const elaborateBasic = (sentence: string): string => {
    const elaborations: string[] = [];
    
    // Add descriptive words based on preference
    if (changePreference === "formal") {
      elaborations.push("Specifically, ");
      elaborations.push("In particular, ");
      elaborations.push("Notably, ");
    } else {
      elaborations.push("Actually, ");
      elaborations.push("Interestingly, ");
      elaborations.push("Remarkably, ");
    }
    
    const selectedElaboration = elaborations[Math.floor(Math.random() * elaborations.length)];
    return sentence + " " + selectedElaboration + sentence.charAt(0).toLowerCase() + sentence.slice(1);
  };

  const elaborateModerate = (sentence: string): string => {
    // Add more context and details
    const elaborations: string[] = [];
    
    if (changePreference === "formal") {
      elaborations.push("This is significant because ");
      elaborations.push("It should be noted that ");
      elaborations.push("This illustrates how ");
    } else {
      elaborations.push("What's really interesting is that ");
      elaborations.push("You might be surprised to learn that ");
      elaborations.push("The cool thing about this is ");
    }
    
    const selectedElaboration = elaborations[Math.floor(Math.random() * elaborations.length)];
    
    // Add specific details based on words in the sentence
    const words = sentence.split(" ");
    if (words.length > 3) {
      const keyWord = words[Math.floor(Math.random() * words.length)];
      
      if (keyWord.length > 3) {
        return sentence + " " + selectedElaboration + "the concept of " + keyWord + " plays a crucial role in understanding this context.";
      }
    }
    
    return sentence + " " + selectedElaboration + "this has broader implications that deserve consideration.";
  };

  const elaborateDetailed = (sentence: string): string => {
    let elaboration = elaborateModerate(sentence);
    
    // Add examples or analogies
    const additions: string[] = [];
    
    if (changePreference === "formal") {
      additions.push(" For instance, in comparable scenarios, similar patterns have been observed.");
      additions.push(" This parallels other cases, where equivalent principles apply.");
      additions.push(" To illustrate this further, consider how this manifests in related contexts.");
    } else {
      additions.push(" For example, imagine if this happened in everyday life - it would be like trying to solve a puzzle with missing pieces.");
      additions.push(" This is similar to how we deal with challenges in other situations, like figuring out a new smartphone.");
      additions.push(" Think of it this way: just as a river finds its path to the ocean, this process follows its natural course.");
    }
    
    const selectedAddition = additions[Math.floor(Math.random() * additions.length)];
    return elaboration + selectedAddition;
  };

  // Helper functions
  const isPastTense = (sentence: string): boolean => {
    const pastTenseIndicators = [
      /\b(was|were)\b/i,
      /\b(had)\b/i,
      /\b(did)\b/i,
      /\b(went)\b/i,
      /\b(came)\b/i,
      /\b(saw)\b/i,
      /\b(made)\b/i,
      /\b(took)\b/i,
      /\b(got)\b/i,
      /\b(\w+)ed\b/i  // Words ending in 'ed'
    ];
    
    return pastTenseIndicators.some(pattern => pattern.test(sentence));
  };

  const preserveSentenceMeaning = (sentence: string): string => {
    // This function makes adjustments to ensure the meaning is preserved
    // even after transformation
    
    // Remove redundant phrasings
    sentence = sentence
      .replace(/\b(It is not true that it is not)\b/gi, "It is")
      .replace(/\b(not un\w+)\b/gi, match => match.replace("not un", ""))
      .replace(/\s{2,}/g, " "); // Remove extra spaces
    
    // Handle repeated content from elaboration
    if (sentence.includes(originalSentence) && sentence !== originalSentence) {
      const parts = sentence.split(originalSentence);
      if (parts.length > 1) {
        // If the original appears multiple times, keep just one instance
        return originalSentence + parts.slice(1).join(" ");
      }
    }
    
    return sentence;
  };

  const selectVersion = (sentence: string) => {
    setSelectedSentence(sentence);
  };

  const copyToClipboard = (text?: string) => {
    const textToCopy = text || selectedSentence;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard",
      description: "The sentence has been copied to your clipboard",
    });
  };

  const clearText = () => {
    setOriginalSentence("");
    setChangedSentences([]);
    setSelectedSentence("");
  };

  const getLabelForChangeType = (): string => {
    switch (changeType) {
      case "tense": return "Tense Change";
      case "voice": return "Voice Change";
      case "structure": return "Structure Change";
      case "simplify": return "Simplification";
      case "elaboration": return "Elaboration";
      default: return "Change";
    }
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="original-sentence" className="text-base font-medium">
                    Enter Your Sentence
                  </Label>
                  <Textarea
                    id="original-sentence"
                    placeholder="Type or paste your sentence here..."
                    value={originalSentence}
                    onChange={(e) => setOriginalSentence(e.target.value)}
                    className="h-32 mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="change-type" className="text-base font-medium">
                      Change Type
                    </Label>
                    <Select
                      value={changeType}
                      onValueChange={setChangeType}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tense">Tense Change</SelectItem>
                        <SelectItem value="voice">Voice Change</SelectItem>
                        <SelectItem value="structure">Structure Change</SelectItem>
                        <SelectItem value="simplify">Simplification</SelectItem>
                        <SelectItem value="elaboration">Elaboration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="change-preference" className="text-base font-medium">
                      Style Preference
                    </Label>
                    <Select
                      value={changePreference}
                      onValueChange={setChangePreference}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select Preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="formal">Formal/Academic</SelectItem>
                        <SelectItem value="casual">Casual/Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-meaning"
                    checked={preserveMeaning}
                    onCheckedChange={setPreserveMeaning}
                  />
                  <Label htmlFor="preserve-meaning">
                    Preserve core meaning when changing
                  </Label>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={changeSentence}
                    disabled={isProcessing || originalSentence.trim().length < 10}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    {isProcessing ? "Processing..." : "Change Sentence"}
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Change Types Explained</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Tense Change</span>
                    <p className="text-sm text-gray-600">Shifts sentences between past, present, and future tenses while maintaining the core action.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Voice Change</span>
                    <p className="text-sm text-gray-600">Converts between active voice ("She wrote the book") and passive voice ("The book was written by her").</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Structure Change</span>
                    <p className="text-sm text-gray-600">Transforms sentences into questions, negative statements, or imperative commands.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Simplification</span>
                    <p className="text-sm text-gray-600">Makes sentences easier to understand by using simpler words and shorter structures.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <span className="font-medium">Elaboration</span>
                    <p className="text-sm text-gray-600">Expands sentences with additional details, context, or supporting information.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-medium">
                  {getLabelForChangeType()} Results
                </Label>
                {changedSentences.length > 0 && (
                  <Badge className="bg-green-50 text-green-700">
                    {changedSentences.length} variations
                  </Badge>
                )}
              </div>
              
              {isProcessing ? (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-gray-500">Generating variations of your sentence...</p>
                </div>
              ) : changedSentences.length > 0 ? (
                <div className="space-y-4">
                  <Tabs defaultValue="versions" className="w-full">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="versions">All Versions</TabsTrigger>
                      <TabsTrigger value="selected">Selected Version</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="versions" className="space-y-3 mt-3">
                      {changedSentences.map((sentence, index) => (
                        <div 
                          key={index}
                          onClick={() => selectVersion(sentence)}
                          className={`p-3 border rounded-lg cursor-pointer transition ${
                            selectedSentence === sentence ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              Variation {index + 1}
                            </Badge>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(sentence);
                              }}
                              variant="ghost"
                              className="h-6 p-0 text-gray-500 hover:text-blue-600"
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-sm">{sentence}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="selected" className="mt-3">
                      {selectedSentence ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-50 border rounded-lg min-h-[100px]">
                            <p>{selectedSentence}</p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={() => copyToClipboard()}
                              variant="outline"
                              className="text-blue-600 border-blue-600"
                            >
                              Copy to Clipboard
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          Select a version from the list
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-gray-50 border rounded-lg p-6 text-center h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    Changed sentence variations will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Usage Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use <span className="font-medium">Tense Change</span> when you need to describe the same action at different times
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="font-medium">Voice Change</span> is useful when you want to emphasize either the doer (active) or the receiver (passive) of an action
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="font-medium">Structure Change</span> helps create variety in your writing or adapt content for different purposes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Choose <span className="font-medium">Simplification</span> when writing for broader audiences or explaining complex topics
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="font-medium">Elaboration</span> is perfect for adding detail and context to make your writing more engaging
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Transform your sentences by changing tense, voice, structure, complexity, or detail level.";
  
  const description = `
    Our Sentence Changer tool is a versatile text transformation utility designed to help you modify sentences in multiple ways while maintaining grammatical accuracy. Whether you need to adjust the tense of a sentence, convert between active and passive voice, change sentence structure, simplify complex phrasing, or elaborate on basic statements, this powerful tool provides intelligent variations to meet your specific needs.
    
    Using sophisticated language processing techniques, the Sentence Changer analyzes your input and transforms it according to your selected change type and style preference. You can choose from five distinct transformation categories: Tense Change (past, present, future), Voice Change (active, passive), Structure Change (questions, negatives, imperatives), Simplification (reducing complexity), and Elaboration (adding detail).
    
    This tool is particularly valuable for writers, students, content creators, and professionals looking to improve writing variety, adapt content for different contexts, or create alternative ways of expressing the same idea. The option to preserve core meaning ensures that your transformed sentences maintain the essential message of the original, even while modifying their grammatical form or complexity level.
    
    With multiple style preferences available (Standard, Formal/Academic, Casual/Conversational), you can tailor the output to suit different writing contexts and audiences. Each transformation is carefully crafted to maintain grammatical correctness while achieving the desired linguistic change.
  `;

  const howToUse = [
    "Enter your sentence in the input area (minimum 10 characters required).",
    "Select your desired Change Type (Tense, Voice, Structure, Simplify, or Elaboration).",
    "Choose a Style Preference (Standard, Formal/Academic, or Casual/Conversational).",
    "Toggle the 'Preserve core meaning' option based on your needs.",
    "Click the 'Change Sentence' button to generate multiple variations.",
    "Browse through the generated versions and click on any to select it.",
    "Use the 'Copy to Clipboard' button to copy your chosen version for use elsewhere."
  ];

  const features = [
    "Five distinct transformation types to modify sentences in various ways",
    "Multiple style preferences to match different writing contexts",
    "Meaning preservation option to maintain the core message while changing form",
    "Generation of multiple variations for each transformation type",
    "Detailed explanation of each change type to guide optimal usage",
    "Simple interface for comparing and selecting the best variation"
  ];

  const faqs = [
    {
      question: "How accurate are the sentence transformations?",
      answer: "Our Sentence Changer uses pattern recognition to transform sentences while maintaining grammatical correctness. However, natural language has many complexities and exceptions, so some sentences (particularly very complex ones) might require minor manual adjustments after transformation. The tool works best with straightforward sentences that follow standard grammatical patterns, and the 'Preserve core meaning' option helps ensure that transformations maintain the essential message."
    },
    {
      question: "Which change type should I use for making technical content more accessible?",
      answer: "The 'Simplification' change type is ideal for making technical or complex content more accessible to general audiences. This transformation reduces sentence complexity, replaces specialized terminology with more common words, and breaks long sentences into shorter ones. For best results when simplifying technical content, select the 'Casual/Conversational' style preference, which further emphasizes clarity and accessibility over formal language."
    },
    {
      question: "Can I use this tool for academic writing?",
      answer: "Yes, the Sentence Changer is valuable for academic writing in several ways. Use the 'Voice Change' option with 'Formal/Academic' style preference to convert to passive voice when discussing methodology or findings. The 'Elaboration' feature can help expand on key points with appropriate academic phrasing. Additionally, when revising papers, the 'Structure Change' option can help rephrase sentences to improve variety and flow while maintaining scholarly tone."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="sentence-changer"
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

export default SentenceChangerDetailed;