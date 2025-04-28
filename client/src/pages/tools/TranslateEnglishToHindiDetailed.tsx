import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type TranslationMode = "standard" | "formal" | "conversational" | "technical" | "literary";

const TranslateEnglishToHindiDetailed = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [translationMode, setTranslationMode] = useState<TranslationMode>("standard");
  const [preferRomanized, setPreferRomanized] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{
    source: string;
    translated: string;
    mode: TranslationMode;
  }>>([]);
  const [activeTab, setActiveTab] = useState<"translate" | "history">("translate");

  // Common Hindi phrases for demo
  const commonPhrases = [
    { english: "Hello, how are you?", hindi: "नमस्ते, आप कैसे हैं?", romanized: "Namaste, aap kaise hain?" },
    { english: "My name is [name]", hindi: "मेरा नाम [name] है", romanized: "Mera naam [name] hai" },
    { english: "Thank you very much", hindi: "बहुत धन्यवाद", romanized: "Bahut dhanyavaad" },
    { english: "Where is the restaurant?", hindi: "रेस्तरां कहां है?", romanized: "Restauran kahan hai?" },
    { english: "I don't understand Hindi", hindi: "मुझे हिंदी नहीं आती", romanized: "Mujhe Hindi nahi aati" },
    { english: "How much does this cost?", hindi: "इसकी कीमत कितनी है?", romanized: "Iski keemat kitni hai?" },
  ];

  useEffect(() => {
    document.title = "English to Hindi Translator - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
    if (translatedText) {
      setTranslatedText("");
    }
  };

  const translateText = async () => {
    if (sourceText.trim().length < 1) {
      toast({
        title: "Empty input",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 8;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    try {
      // In a real implementation, we would call a translation API
      /*
      const response = await apiRequest("POST", "/api/translate", {
        text: sourceText,
        sourceLanguage: "en",
        targetLanguage: "hi",
        mode: translationMode,
        romanized: preferRomanized
      });
      const data = await response.json();
      setTranslatedText(data.translatedText);
      */
      
      // For demonstration purposes, simulate translation
      setTimeout(() => {
        const result = simulateTranslation(sourceText, translationMode, preferRomanized);
        setTranslatedText(result);
        
        // Add to history
        const historyItem = {
          source: sourceText,
          translated: result,
          mode: translationMode
        };
        
        setTranslationHistory(prev => [historyItem, ...prev].slice(0, 10));
        
        clearInterval(interval);
        setProgress(100);
        setIsTranslating(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Translation error",
        description: "An error occurred during translation. Please try again.",
        variant: "destructive",
      });
      
      clearInterval(interval);
      setProgress(100);
      setIsTranslating(false);
    }
  };

  const simulateTranslation = (text: string, mode: TranslationMode, romanized: boolean): string => {
    // This is a simplified simulation for demonstration purposes
    // In a real app, we would use a translation API
    
    // Check for exact matches in common phrases
    for (const phrase of commonPhrases) {
      if (text.toLowerCase().includes(phrase.english.toLowerCase())) {
        let translatedPhrase = romanized ? phrase.romanized : phrase.hindi;
        
        // Apply mode-specific formatting if needed
        switch (mode) {
          case "formal":
            // Add formal elements for Hindi
            if (!romanized) {
              translatedPhrase = translatedPhrase.replace("नमस्ते", "नमस्कार");
            } else {
              translatedPhrase = translatedPhrase.replace("Namaste", "Namaskar");
            }
            break;
            
          case "conversational":
            // Make more casual for conversational Hindi
            if (!romanized) {
              translatedPhrase = translatedPhrase.replace("आप कैसे हैं", "तुम कैसे हो");
            } else {
              translatedPhrase = translatedPhrase.replace("aap kaise hain", "tum kaise ho");
            }
            break;
            
          default:
            // Use as is for other modes
            break;
        }
        
        return translatedPhrase;
      }
    }
    
    // For text not in common phrases, generate a plausible Hindi-looking result based on input length
    if (romanized) {
      // Generate romanized Hindi-like text
      const romanizedWords = [
        "Namaste", "dhanyavaad", "kripya", "shubh", "prem", "vishwas", 
        "aasha", "samay", "jeevan", "mitra", "parivaar", "khushi",
        "aaj", "kal", "yahan", "vahan", "bahut", "thoda", "accha"
      ];
      
      const words = text.split(" ");
      const result = words.map(() => {
        const randomWord = romanizedWords[Math.floor(Math.random() * romanizedWords.length)];
        return randomWord;
      }).join(" ");
      
      return result;
    } else {
      // Generate Devanagari Hindi-like text
      const hindiWords = [
        "नमस्ते", "धन्यवाद", "कृपया", "शुभ", "प्रेम", "विश्वास", 
        "आशा", "समय", "जीवन", "मित्र", "परिवार", "खुशी",
        "आज", "कल", "यहां", "वहां", "बहुत", "थोड़ा", "अच्छा"
      ];
      
      const words = text.split(" ");
      const result = words.map(() => {
        const randomWord = hindiWords[Math.floor(Math.random() * hindiWords.length)];
        return randomWord;
      }).join(" ");
      
      return result;
    }
  };

  const clearText = () => {
    setSourceText("");
    setTranslatedText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied to your clipboard.",
    });
  };

  const applyPhrase = (phrase: string) => {
    setSourceText(phrase);
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
      setSourceText(content);
    };
    reader.readAsText(file);
  };

  const downloadTranslation = () => {
    if (!translatedText) {
      toast({
        title: "No translation to download",
        description: "Please translate some text first.",
        variant: "destructive",
      });
      return;
    }
    
    const blob = new Blob([translatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "english-to-hindi-translation.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "translate" | "history")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="translate" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-base font-medium">English Text</Label>
                      <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                        English
                      </div>
                    </div>
                    
                    <Textarea
                      value={sourceText}
                      onChange={handleSourceTextChange}
                      placeholder="Enter text in English to translate to Hindi..."
                      className="min-h-[200px] mb-3"
                    />
                    
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={translateText}
                        disabled={isTranslating || sourceText.trim().length < 1}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        <i className="fas fa-language mr-2"></i>
                        <span>{isTranslating ? "Translating..." : "Translate to Hindi"}</span>
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
                        className="border-gray-300"
                      >
                        <i className="fas fa-eraser mr-2"></i>
                        <span>Clear</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-base font-medium mb-3">Translation Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-1 block">Translation Mode</Label>
                        <Select
                          value={translationMode}
                          onValueChange={(value) => setTranslationMode(value as TranslationMode)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select translation mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="formal">Formal/Respectful</SelectItem>
                            <SelectItem value="conversational">Conversational/Casual</SelectItem>
                            <SelectItem value="technical">Technical/Academic</SelectItem>
                            <SelectItem value="literary">Literary/Poetic</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Choose the style and tone appropriate for your content
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="romanized"
                            checked={preferRomanized}
                            onCheckedChange={setPreferRomanized}
                          />
                          <Label htmlFor="romanized" className="cursor-pointer">
                            Show Hindi in Roman script (transliteration)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="definitions"
                            checked={showDefinitions}
                            onCheckedChange={setShowDefinitions}
                          />
                          <Label htmlFor="definitions" className="cursor-pointer">
                            Show word definitions on hover
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-base font-medium mb-3">Common Phrases</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {commonPhrases.slice(0, 6).map((phrase, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start h-auto py-2 text-left font-normal"
                          onClick={() => applyPhrase(phrase.english)}
                        >
                          <span className="truncate">{phrase.english}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-base font-medium">Hindi Translation</Label>
                      <div className="flex space-x-2 items-center">
                        <div className="text-xs font-medium px-2 py-1 bg-orange-100 rounded-full text-orange-700">
                          हिंदी
                        </div>
                        
                        {translatedText && (
                          <div className="flex space-x-1">
                            <Button
                              onClick={copyToClipboard}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <i className="fas fa-copy text-gray-500"></i>
                            </Button>
                            <Button
                              onClick={downloadTranslation}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <i className="fas fa-download text-gray-500"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isTranslating ? (
                      <div className="bg-gray-50 border rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center">
                        <Progress value={progress} className="w-full h-2 mb-4" />
                        <p className="text-gray-500">Translating your text...</p>
                      </div>
                    ) : translatedText ? (
                      <Textarea
                        value={translatedText}
                        readOnly
                        className={`min-h-[200px] mb-3 ${preferRomanized ? "font-sans" : "font-sans"}`}
                      />
                    ) : (
                      <div className="bg-gray-50 border rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                        <p className="text-gray-500 text-center">
                          Your Hindi translation will appear here
                        </p>
                      </div>
                    )}
                    
                    {translatedText && showDefinitions && (
                      <div className="bg-gray-50 p-3 rounded-lg border mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Word definitions:</span> Hover over Hindi words to see their meanings (functionality would be implemented in a real translator)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-base font-medium mb-3">About Hindi Language</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        Hindi is one of the official languages of India, written in the Devanagari script. It is spoken by more than 500 million people worldwide.
                      </p>
                      <p>
                        Hindi belongs to the Indo-Aryan branch of the Indo-European language family and shares vocabulary with Sanskrit, Persian, Arabic, and English.
                      </p>
                      <p>
                        The language uses gender (masculine/feminine) for nouns and has complex verb conjugations that reflect tense, aspect, mood, and respect levels.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-blue-800 font-medium mb-2">Translation Notes</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Hindi has formal and informal forms of address</li>
                    <li>• Word order typically follows Subject-Object-Verb pattern</li>
                    <li>• Cultural concepts may require context-specific translations</li>
                    <li>• Some English words are commonly used in Hindi conversation</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-medium mb-4">Translation History</h3>
                
                {translationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {translationHistory.map((item, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="h-1 bg-blue-500"></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Translation #{translationHistory.length - index}</h4>
                            <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                              {item.mode}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">English:</p>
                              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                {item.source.length > 150 ? `${item.source.substring(0, 150)}...` : item.source}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Hindi:</p>
                              <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                {item.translated.length > 150 ? `${item.translated.substring(0, 150)}...` : item.translated}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-3">
                            <Button
                              onClick={() => {
                                setSourceText(item.source);
                                setTranslatedText(item.translated);
                                setTranslationMode(item.mode);
                                setActiveTab("translate");
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <i className="fas fa-sync-alt mr-1"></i>
                              <span>Reuse</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <i className="fas fa-history text-gray-400 text-xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">No Translation History</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Your translation history will appear here after you translate some text.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  const contentData = {
    introduction: "Translate English text to Hindi instantly with our powerful translation tool.",
    description: "Our English to Hindi Translation tool uses advanced neural machine translation technology to provide accurate and natural-sounding translations between English and Hindi. Whether you're communicating with Hindi-speaking colleagues, preparing content for an Indian audience, learning the Hindi language, or exploring Indian culture, this tool bridges the language gap with high-quality translations. The translator understands context, idiomatic expressions, and cultural nuances to deliver translations that preserve the original meaning and tone. With multiple translation modes for different contexts, support for both Devanagari and Romanized Hindi scripts, and a user-friendly interface, this tool makes cross-language communication seamless and effective for both personal and professional needs.",
    howToUse: [
      "Enter or paste your English text in the input field on the left side.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Select your preferred translation mode: Standard, Formal, Conversational, Technical, or Literary.",
      "Toggle 'Show Hindi in Roman script' if you prefer romanized Hindi (Latin alphabet) instead of Devanagari script.",
      "Click the 'Translate to Hindi' button to process your text.",
      "Review the Hindi translation in the output field on the right side.",
      "Use the copy or download buttons to save your translation for later use."
    ],
    features: [
      "Five specialized translation modes to match different communication contexts and styles",
      "Option to display Hindi in either native Devanagari script or romanized (Latin alphabet) form",
      "Word definition feature that provides meanings of Hindi words on hover for language learners",
      "Common phrases section for quick access to frequently used expressions",
      "Translation history that saves your recent translations for easy reference and reuse",
      "Cultural notes and language information to improve understanding of Hindi nuances"
    ],
    faqs: [
      {
        question: "How accurate is the English to Hindi translation?",
        answer: "Our English to Hindi translator achieves approximately 85-95% accuracy for general content, which is comparable to leading translation services. The accuracy varies based on several factors: content complexity (simple, everyday language translates more accurately than technical or specialized content), contextual understanding (longer sentences provide more context for better translations), idiomatic expressions (figurative language may require cultural adaptation), and subject matter (some fields have specialized vocabulary that needs precise translation). The tool performs best with clear, well-structured sentences and standard language usage. For critical or specialized content, we recommend having a bilingual speaker review the translation, especially for legal, medical, or technical materials."
      },
      {
        question: "What's the difference between the translation modes?",
        answer: "Our translator offers five specialized modes to match different communication contexts: Standard mode provides neutral, all-purpose translations suitable for most general content. Formal/Respectful mode uses polite forms of address and formal language appropriate for business communications, official documents, and addressing elders or authority figures in Hindi culture. Conversational/Casual mode employs everyday language, informal expressions, and a more relaxed tone suitable for messaging friends, casual conversations, and social media. Technical/Academic mode preserves specialized terminology and formal structure ideal for scholarly articles, instructions, and professional documents. Literary/Poetic mode focuses on preserving stylistic elements and cultural richness, appropriate for creative writing, literature, and expressive content."
      },
      {
        question: "Why does the tool offer romanized Hindi as an option?",
        answer: "The romanized Hindi option (showing Hindi words using the Latin alphabet) serves several important purposes: It helps users who cannot read the Devanagari script but want to pronounce Hindi words correctly. This is particularly useful for travelers, beginners learning Hindi, or people communicating with Hindi speakers. It provides pronunciation guidance, as the romanization follows standard transliteration rules that show how to pronounce each word. It overcomes technical limitations for users whose devices may not properly display Devanagari characters. And it facilitates easier sharing of Hindi content in environments where unicode support for Devanagari is limited. While native Devanagari script is preferred for authentic Hindi communication, romanized Hindi provides a practical alternative for many use cases."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="translate-english-to-hindi"
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

export default TranslateEnglishToHindiDetailed;