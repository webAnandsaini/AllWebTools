import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import PlagiarismChecker from "@/pages/tools/PlagiarismChecker";
import WordCounter from "@/pages/tools/WordCounter";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";
import TextToSpeech from "@/pages/tools/TextToSpeech";
import QrCodeGenerator from "@/pages/tools/QrCodeGenerator";
import MD5Generator from "@/pages/tools/MD5Generator";
import UppercaseToLowercase from "@/pages/tools/UppercaseToLowercase";
import ReverseText from "@/pages/tools/ReverseText";

// AI Writing Tools
import AIEssayWriter from "@/pages/tools/AIEssayWriter";
import AIHumanizer from "@/pages/tools/AIHumanizer";
import TitleGenerator from "@/pages/tools/TitleGenerator";

// Detailed Tool Pages
import PlagiarismCheckerDetailed from "@/pages/tools/PlagiarismCheckerDetailed";
import WordCounterDetailed from "@/pages/tools/WordCounterDetailed";
import ArticleRewriterDetailed from "@/pages/tools/ArticleRewriterDetailed";
import GrammarCheckerDetailed from "@/pages/tools/GrammarCheckerDetailed";
import SpellCheckerDetailed from "@/pages/tools/SpellCheckerDetailed";
import ParaphrasingToolDetailed from "@/pages/tools/ParaphrasingToolDetailed";
import TextToSpeechDetailed from "@/pages/tools/TextToSpeechDetailed";
import SpeechToTextDetailed from "@/pages/tools/SpeechToTextDetailed";
import TextSummarizerDetailed from "@/pages/tools/TextSummarizerDetailed";
import AIContentDetectorDetailed from "@/pages/tools/AIContentDetectorDetailed";
import OCRDetailed from "@/pages/tools/OCRDetailed";
import MD5GeneratorDetailed from "@/pages/tools/MD5GeneratorDetailed";
import UppercaseToLowercaseDetailed from "@/pages/tools/UppercaseToLowercaseDetailed";
import WordCombinerDetailed from "@/pages/tools/WordCombinerDetailed";
import ImageToTextDetailed from "@/pages/tools/ImageToTextDetailed";
import TranslateEnglishToHindiDetailed from "@/pages/tools/TranslateEnglishToHindiDetailed";

// Newly added tool pages
import TextToImageDetailed from "@/pages/tools/TextToImageDetailed";
import JPGToWordDetailed from "@/pages/tools/JPGToWordDetailed";
import SmallTextGeneratorDetailed from "@/pages/tools/SmallTextGeneratorDetailed";
import OnlineTextEditorDetailed from "@/pages/tools/OnlineTextEditorDetailed";
import ReverseTextGeneratorDetailed from "@/pages/tools/ReverseTextGeneratorDetailed";
import SentenceRephraserDetailed from "@/pages/tools/SentenceRephraserDetailed";
import SentenceCheckerDetailed from "@/pages/tools/SentenceCheckerDetailed";
import RewordingToolDetailed from "@/pages/tools/RewordingToolDetailed";
import PunctuationCheckerDetailed from "@/pages/tools/PunctuationCheckerDetailed";
import EssayCheckerDetailed from "@/pages/tools/EssayCheckerDetailed";
import PaperCheckerDetailed from "@/pages/tools/PaperCheckerDetailed";
import OnlineProofreaderDetailed from "@/pages/tools/OnlineProofreaderDetailed";
import ParagraphRewriterDetailed from "@/pages/tools/ParagraphRewriterDetailed";
import WordChangerDetailed from "@/pages/tools/WordChangerDetailed";
import SentenceRewriterDetailed from "@/pages/tools/SentenceRewriterDetailed";
import EssayRewriterDetailed from "@/pages/tools/EssayRewriterDetailed";
import ParaphraseGeneratorDetailed from "@/pages/tools/ParaphraseGeneratorDetailed";
import SentenceChangerDetailed from "@/pages/tools/SentenceChangerDetailed";
import ImageTranslatorDetailed from "@/pages/tools/ImageTranslatorDetailed";
import ChatGPTDetectorDetailed from "@/pages/tools/ChatGPTDetectorDetailed";
import CitationGeneratorDetailed from "@/pages/tools/CitationGeneratorDetailed";
import OnlineNotepadDetailed from "@/pages/tools/OnlineNotepadDetailed";
import InvisibleCharacterDetailed from "@/pages/tools/InvisibleCharacterDetailed";
import AIEssayWriterDetailed from "@/pages/tools/AIEssayWriterDetailed";
import AIWriterDetailed from "@/pages/tools/AIWriterDetailed";
import AITextGeneratorDetailed from "@/pages/tools/AITextGeneratorDetailed";
import ParagraphGeneratorDetailed from "@/pages/tools/ParagraphGeneratorDetailed";
import PlotGeneratorDetailed from "@/pages/tools/PlotGeneratorDetailed";
import LogoMakerDetailed from "@/pages/tools/LogoMakerDetailed";
import ResumeBuilderDetailed from "@/pages/tools/ResumeBuilderDetailed";
import FlyerMakerDetailed from "@/pages/tools/FlyerMakerDetailed";
import PosterMakerDetailed from "@/pages/tools/PosterMakerDetailed";
import WhatIsMyIPDetailed from "@/pages/tools/WhatIsMyIPDetailed";
import IPLocationDetailed from "@/pages/tools/IPLocationDetailed";
import FreeDailyProxyListDetailed from "@/pages/tools/FreeDailyProxyListDetailed";

// Password Tool Imports
import PasswordGeneratorDetailed from "@/pages/tools/PasswordGeneratorDetailed";
import PasswordStrengthCheckerDetailed from "@/pages/tools/PasswordStrengthCheckerDetailed";
import PasswordEncryptionUtilityDetailed from "@/pages/tools/PasswordEncryptionUtilityDetailed";

/* We'll comment out these imports since the actual files don't exist yet
import InvitationMakerDetailed from "@/pages/tools/InvitationMakerDetailed";
import BusinessCardMakerDetailed from "@/pages/tools/BusinessCardMakerDetailed";
import MemeGeneratorDetailed from "@/pages/tools/MemeGeneratorDetailed";
import EmojisDetailed from "@/pages/tools/EmojisDetailed";
*/

// Image Editing Tools - newly created components
import ReverseImageSearchDetailed from "@/pages/tools/ReverseImageSearchDetailed";
import FaceSearchDetailed from "@/pages/tools/FaceSearchDetailed";
import ImageCompressorDetailed from "@/pages/tools/ImageCompressorDetailed";
import FaviconGeneratorDetailed from "@/pages/tools/FaviconGeneratorDetailed";
import VideoToGIFConverterDetailed from "@/pages/tools/VideoToGIFConverterDetailed";
import ImageResizerDetailed from "@/pages/tools/ImageResizerDetailed";

/* We'll comment out these imports since the actual files don't exist yet
import PhotoResizerInKBDetailed from "@/pages/tools/PhotoResizerInKBDetailed";
import CropImageDetailed from "@/pages/tools/CropImageDetailed";
import ConvertToJPGDetailed from "@/pages/tools/ConvertToJPGDetailed";
import RGBToHexDetailed from "@/pages/tools/RGBToHexDetailed";
*/

// Keyword Tools
import KeywordPositionDetailed from "@/pages/tools/KeywordPositionDetailed";
import KeywordsDensityCheckerDetailed from "@/pages/tools/KeywordsDensityCheckerDetailed";
import KeywordsSuggestionsToolDetailed from "@/pages/tools/KeywordsSuggestionsToolDetailed";
import KeywordResearchToolDetailed from "@/pages/tools/KeywordResearchToolDetailed";

// Meta Tags Tools
import MetaTagsAnalyzerDetailed from "@/pages/tools/MetaTagsAnalyzerDetailed";
import MetaTagGeneratorDetailed from "@/pages/tools/MetaTagGeneratorDetailed";

// Image format converters
import PNGToJPGDetailed from "@/pages/tools/PNGToJPGDetailed";
import JPGToPNGDetailed from "@/pages/tools/JPGToPNGDetailed";

// JSON Tools
import JSONViewerDetailed from "@/pages/tools/JSONViewerDetailed";
import JSONFormatterDetailed from "@/pages/tools/JSONFormatterDetailed";
import JSONValidatorDetailed from "@/pages/tools/JSONValidatorDetailed";
import JSONToXMLDetailed from "@/pages/tools/JSONToXMLDetailed";
import JSONEditorDetailed from "@/pages/tools/JSONEditorDetailed";
import JSONBeautifierDetailed from "@/pages/tools/JSONBeautifierDetailed";

// Unit Converter Tools
import UnitConverterDetailed from "@/pages/tools/UnitConverterDetailed";
import TimeConverterDetailed from "@/pages/tools/TimeConverterDetailed";
import PowerConverterDetailed from "@/pages/tools/PowerConverterDetailed";
import SpeedConverterDetailed from "@/pages/tools/SpeedConverterDetailed";
import BinaryConverterDetailed from "@/pages/tools/BinaryConverterDetailed";
import CalculatorDetailed from "@/pages/tools/CalculatorDetailed";

// Name Generator Tools
import RomanNumeralsDateConverterDetailed from "@/pages/tools/RomanNumeralsDateConverterDetailed";
import CreditCardValidatorDetailed from "@/pages/tools/CreditCardValidatorDetailed";
import CreditCardGeneratorDetailed from "@/pages/tools/CreditCardGeneratorDetailed";
import FakeNameGeneratorDetailed from "@/pages/tools/FakeNameGeneratorDetailed";

import AllCategories from "@/pages/AllCategories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingFallback from "@/components/common/LoadingFallback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories/:category" component={CategoryPage} />
      
      {/* Direct routes without /tools/ prefix for Unit Converter Tools */}
      <Route path="/unit-converter" component={UnitConverterDetailed} />
      <Route path="/time-converter" component={TimeConverterDetailed} />
      <Route path="/power-converter" component={PowerConverterDetailed} />
      <Route path="/speed-converter" component={SpeedConverterDetailed} />
      <Route path="/volume-conversion" component={UnitConverterDetailed} />
      <Route path="/length-converter" component={UnitConverterDetailed} />
      <Route path="/voltage-converter" component={UnitConverterDetailed} />
      <Route path="/area-converter" component={UnitConverterDetailed} />
      <Route path="/weight-converter" component={UnitConverterDetailed} />
      <Route path="/byte-converter" component={UnitConverterDetailed} />
      <Route path="/temperature-conversion" component={UnitConverterDetailed} />
      <Route path="/torque-converter" component={UnitConverterDetailed} />
      <Route path="/pressure-conversion" component={UnitConverterDetailed} />
      
      {/* Text Analysis Tools */}
      <Route path="/tools/plagiarism-checker" component={PlagiarismChecker} />
      <Route path="/tools/word-counter" component={WordCounter} />
      <Route path="/tools/text-to-speech" component={TextToSpeech} />
      <Route path="/tools/md5-generator" component={MD5Generator} />
      <Route path="/tools/uppercase-to-lowercase" component={UppercaseToLowercase} />
      <Route path="/tools/reverse-text" component={ReverseText} />
      
      {/* AI Writing Tools */}
      <Route path="/tools/ai-essay-writer" component={AIEssayWriter} />
      <Route path="/tools/ai-humanizer" component={AIHumanizer} />
      <Route path="/tools/title-generator" component={TitleGenerator} />
      
      {/* Other Tools */}
      <Route path="/tools/password-generator" component={PasswordGenerator} />
      <Route path="/tools/qr-code-generator" component={QrCodeGenerator} />
      
      {/* Detailed Tool Pages */}
      <Route path="/tools/plagiarism-checker-detailed" component={PlagiarismCheckerDetailed} />
      <Route path="/tools/word-counter-detailed" component={WordCounterDetailed} />
      <Route path="/tools/article-rewriter-detailed" component={ArticleRewriterDetailed} />
      <Route path="/tools/grammar-checker-detailed" component={GrammarCheckerDetailed} />
      <Route path="/tools/spell-checker-detailed" component={SpellCheckerDetailed} />
      <Route path="/tools/paraphrasing-tool-detailed" component={ParaphrasingToolDetailed} />
      <Route path="/tools/text-to-speech-detailed" component={TextToSpeechDetailed} />
      <Route path="/tools/speech-to-text-detailed" component={SpeechToTextDetailed} />
      <Route path="/tools/text-summarizer-detailed" component={TextSummarizerDetailed} />
      <Route path="/tools/ai-content-detector-detailed" component={AIContentDetectorDetailed} />
      <Route path="/tools/ocr-detailed" component={OCRDetailed} />
      <Route path="/tools/md5-generator-detailed" component={MD5GeneratorDetailed} />
      <Route path="/tools/uppercase-to-lowercase-detailed" component={UppercaseToLowercaseDetailed} />
      <Route path="/tools/word-combiner-detailed" component={WordCombinerDetailed} />
      <Route path="/tools/image-to-text-detailed" component={ImageToTextDetailed} />
      <Route path="/tools/translate-english-to-hindi-detailed" component={TranslateEnglishToHindiDetailed} />
      
      {/* Newly added detailed tool pages */}
      <Route path="/tools/text-to-image-detailed" component={TextToImageDetailed} />
      <Route path="/tools/jpg-to-word-detailed" component={JPGToWordDetailed} />
      <Route path="/tools/small-text-generator-detailed" component={SmallTextGeneratorDetailed} />
      <Route path="/tools/online-text-editor-detailed" component={OnlineTextEditorDetailed} />
      <Route path="/tools/reverse-text-generator-detailed" component={ReverseTextGeneratorDetailed} />
      <Route path="/tools/sentence-rephraser-detailed" component={SentenceRephraserDetailed} />
      <Route path="/tools/sentence-checker-detailed" component={SentenceCheckerDetailed} />
      <Route path="/tools/rewording-tool-detailed" component={RewordingToolDetailed} />
      <Route path="/tools/punctuation-checker-detailed" component={PunctuationCheckerDetailed} />
      <Route path="/tools/essay-checker-detailed" component={EssayCheckerDetailed} />
      <Route path="/tools/paper-checker-detailed" component={PaperCheckerDetailed} />
      <Route path="/tools/online-proofreader-detailed" component={OnlineProofreaderDetailed} />
      <Route path="/tools/paragraph-rewriter-detailed" component={ParagraphRewriterDetailed} />
      <Route path="/tools/word-changer-detailed" component={WordChangerDetailed} />
      <Route path="/tools/sentence-rewriter-detailed" component={SentenceRewriterDetailed} />
      <Route path="/tools/essay-rewriter-detailed" component={EssayRewriterDetailed} />
      <Route path="/tools/paraphrase-generator-detailed" component={ParaphraseGeneratorDetailed} />
      <Route path="/tools/sentence-changer-detailed" component={SentenceChangerDetailed} />
      <Route path="/tools/image-translator-detailed" component={ImageTranslatorDetailed} />
      <Route path="/tools/chatgpt-detector-detailed" component={ChatGPTDetectorDetailed} />
      <Route path="/tools/citation-generator-detailed" component={CitationGeneratorDetailed} />
      <Route path="/tools/online-notepad-detailed" component={OnlineNotepadDetailed} />
      <Route path="/tools/invisible-character-detailed" component={InvisibleCharacterDetailed} />
      <Route path="/tools/ai-essay-writer-detailed" component={AIEssayWriterDetailed} />
      <Route path="/tools/ai-writer-detailed" component={AIWriterDetailed} />
      <Route path="/tools/ai-text-generator-detailed" component={AITextGeneratorDetailed} />
      <Route path="/tools/paragraph-generator-detailed" component={ParagraphGeneratorDetailed} />
      <Route path="/tools/plot-generator-detailed" component={PlotGeneratorDetailed} />
      <Route path="/tools/logo-maker-detailed" component={LogoMakerDetailed} />
      <Route path="/tools/resume-builder-detailed" component={ResumeBuilderDetailed} />
      <Route path="/tools/flyer-maker-detailed" component={FlyerMakerDetailed} />
      <Route path="/tools/poster-maker-detailed" component={PosterMakerDetailed} />
      <Route path="/tools/what-is-my-ip-detailed" component={WhatIsMyIPDetailed} />
      <Route path="/tools/ip-location-detailed" component={IPLocationDetailed} />
      <Route path="/tools/free-daily-proxy-list-detailed" component={FreeDailyProxyListDetailed} />
      
      {/* Password Tools */}
      <Route path="/tools/password-generator-detailed" component={PasswordGeneratorDetailed} />
      <Route path="/tools/password-strength-checker-detailed" component={PasswordStrengthCheckerDetailed} />
      <Route path="/tools/password-encryption-utility-detailed" component={PasswordEncryptionUtilityDetailed} />
      
      {/* Image Editing Tools */}
      <Route path="/tools/reverse-image-search-detailed" component={ReverseImageSearchDetailed} />
      <Route path="/tools/face-search-detailed" component={FaceSearchDetailed} />
      <Route path="/tools/image-compressor-detailed" component={ImageCompressorDetailed} />
      <Route path="/tools/favicon-generator-detailed" component={FaviconGeneratorDetailed} />
      <Route path="/tools/video-to-gif-converter-detailed" component={VideoToGIFConverterDetailed} />
      <Route path="/tools/image-resizer-detailed" component={ImageResizerDetailed} />
      
      {/* Image format converters */}
      <Route path="/tools/png-to-jpg-detailed" component={PNGToJPGDetailed} />
      <Route path="/tools/jpg-to-png-detailed" component={JPGToPNGDetailed} />
      
      {/* Keyword Tools */}
      <Route path="/tools/keyword-position-detailed" component={KeywordPositionDetailed} />
      <Route path="/tools/keywords-density-checker-detailed" component={KeywordsDensityCheckerDetailed} />
      <Route path="/tools/keywords-suggestions-tool-detailed" component={KeywordsSuggestionsToolDetailed} />
      <Route path="/tools/keyword-research-tool-detailed" component={KeywordResearchToolDetailed} />
      
      {/* Meta Tags Tools */}
      <Route path="/tools/meta-tags-analyzer-detailed" component={MetaTagsAnalyzerDetailed} />
      <Route path="/tools/meta-tag-generator-detailed" component={MetaTagGeneratorDetailed} />
      
      {/* JSON Tools */}
      <Route path="/tools/json-viewer-detailed" component={JSONViewerDetailed} />
      <Route path="/tools/json-formatter-detailed" component={JSONFormatterDetailed} />
      <Route path="/tools/json-validator-detailed" component={JSONValidatorDetailed} />
      <Route path="/tools/json-to-xml-detailed" component={JSONToXMLDetailed} />
      <Route path="/tools/json-editor-detailed" component={JSONEditorDetailed} />
      <Route path="/tools/json-beautifier-detailed" component={JSONBeautifierDetailed} />
      
      {/* Unit Converter Tools */}
      <Route path="/tools/unit-converter-detailed" component={UnitConverterDetailed} />
      <Route path="/tools/time-converter-detailed" component={TimeConverterDetailed} />
      <Route path="/tools/power-converter-detailed" component={PowerConverterDetailed} />
      <Route path="/tools/speed-converter-detailed" component={SpeedConverterDetailed} />
      
      {/* Non-detailed versions of Unit Converter Tools */}
      <Route path="/tools/unit-converter" component={UnitConverterDetailed} />
      <Route path="/tools/time-converter" component={TimeConverterDetailed} />
      <Route path="/tools/power-converter" component={PowerConverterDetailed} />
      <Route path="/tools/speed-converter" component={SpeedConverterDetailed} />
      
      {/* Additional Unit Converter Tools from the image */}
      <Route path="/tools/volume-conversion" component={UnitConverterDetailed} />
      <Route path="/tools/length-converter" component={UnitConverterDetailed} />
      <Route path="/tools/voltage-converter" component={UnitConverterDetailed} />
      <Route path="/tools/area-converter" component={UnitConverterDetailed} />
      <Route path="/tools/weight-converter" component={UnitConverterDetailed} />
      <Route path="/tools/byte-converter" component={UnitConverterDetailed} />
      <Route path="/tools/temperature-conversion" component={UnitConverterDetailed} />
      <Route path="/tools/torque-converter" component={UnitConverterDetailed} />
      <Route path="/tools/pressure-conversion" component={UnitConverterDetailed} />
      
      {/* Binary Converter Tools */}
      <Route path="/tools/text-to-binary" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-to-text" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-to-hex" component={BinaryConverterDetailed} />
      <Route path="/tools/hex-to-binary" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-to-ascii" component={BinaryConverterDetailed} />
      <Route path="/tools/ascii-to-binary" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-to-decimal" component={BinaryConverterDetailed} />
      <Route path="/tools/decimal-to-binary" component={BinaryConverterDetailed} />
      <Route path="/tools/text-to-ascii" component={BinaryConverterDetailed} />
      <Route path="/tools/decimal-to-hex" component={BinaryConverterDetailed} />
      
      {/* Name Generator Tools - Both tool and direct routes */}
      <Route path="/tools/roman-numerals-date-converter" component={RomanNumeralsDateConverterDetailed} />
      <Route path="/roman-numerals-date-converter" component={RomanNumeralsDateConverterDetailed} />
      <Route path="/tools/credit-card-validator" component={CreditCardValidatorDetailed} />
      <Route path="/credit-card-validator" component={CreditCardValidatorDetailed} />
      <Route path="/tools/credit-card-generator" component={CreditCardGeneratorDetailed} />
      <Route path="/credit-card-generator" component={CreditCardGeneratorDetailed} />
      <Route path="/tools/fake-name-generator" component={FakeNameGeneratorDetailed} />
      <Route path="/fake-name-generator" component={FakeNameGeneratorDetailed} />
      <Route path="/tools/binary-translator" component={BinaryConverterDetailed} />
      <Route path="/tools/english-to-binary" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-to-english" component={BinaryConverterDetailed} />
      <Route path="/tools/binary-decoder" component={BinaryConverterDetailed} />
      <Route path="/tools/hex-to-text" component={BinaryConverterDetailed} />
      <Route path="/tools/ascii-to-text" component={BinaryConverterDetailed} />
      
      {/* Direct routes for Binary Converter Tools */}
      <Route path="/text-to-binary" component={BinaryConverterDetailed} />
      <Route path="/binary-to-text" component={BinaryConverterDetailed} />
      <Route path="/binary-to-hex" component={BinaryConverterDetailed} />
      <Route path="/hex-to-binary" component={BinaryConverterDetailed} />
      <Route path="/binary-to-ascii" component={BinaryConverterDetailed} />
      <Route path="/ascii-to-binary" component={BinaryConverterDetailed} />
      <Route path="/binary-to-decimal" component={BinaryConverterDetailed} />
      <Route path="/decimal-to-binary" component={BinaryConverterDetailed} />
      <Route path="/text-to-ascii" component={BinaryConverterDetailed} />
      <Route path="/decimal-to-hex" component={BinaryConverterDetailed} />
      <Route path="/binary-translator" component={BinaryConverterDetailed} />
      <Route path="/english-to-binary" component={BinaryConverterDetailed} />
      <Route path="/binary-to-english" component={BinaryConverterDetailed} />
      <Route path="/binary-decoder" component={BinaryConverterDetailed} />
      <Route path="/hex-to-text" component={BinaryConverterDetailed} />
      <Route path="/ascii-to-text" component={BinaryConverterDetailed} />
      
      {/* Calculator Tools */}
      <Route path="/tools/age-calculator" component={CalculatorDetailed} />
      <Route path="/tools/percentage-calculator" component={CalculatorDetailed} />
      <Route path="/tools/average-calculator" component={CalculatorDetailed} />
      <Route path="/tools/confidence-interval-calculator" component={CalculatorDetailed} />
      <Route path="/tools/sales-tax-calculator" component={CalculatorDetailed} />
      <Route path="/tools/margin-calculator" component={CalculatorDetailed} />
      <Route path="/tools/probability-calculator" component={CalculatorDetailed} />
      <Route path="/tools/paypal-fee-calculator" component={CalculatorDetailed} />
      <Route path="/tools/discount-calculator" component={CalculatorDetailed} />
      <Route path="/tools/earnings-per-share-calculator" component={CalculatorDetailed} />
      <Route path="/tools/cpm-calculator" component={CalculatorDetailed} />
      <Route path="/tools/loan-to-value-calculator" component={CalculatorDetailed} />
      <Route path="/tools/gst-calculator" component={CalculatorDetailed} />
      <Route path="/tools/bmi-calculator" component={CalculatorDetailed} />
      <Route path="/tools/chronological-age-calculator" component={CalculatorDetailed} />
      <Route path="/tools/loan-calculator" component={CalculatorDetailed} />
      <Route path="/tools/hours-calculator" component={CalculatorDetailed} />
      <Route path="/tools/grade-calculator" component={CalculatorDetailed} />
      <Route path="/tools/gpa-calculator" component={CalculatorDetailed} />
      <Route path="/tools/percentage-increase-calculator" component={CalculatorDetailed} />
      <Route path="/tools/percentage-decrease-calculator" component={CalculatorDetailed} />
      <Route path="/tools/percentage-change-calculator" component={CalculatorDetailed} />
      <Route path="/tools/percentage-difference-calculator" component={CalculatorDetailed} />
      <Route path="/tools/calorie-calculator" component={CalculatorDetailed} />
      <Route path="/tools/time-calculator" component={CalculatorDetailed} />
      <Route path="/tools/salary-calculator" component={CalculatorDetailed} />
      <Route path="/tools/investment-calculator" component={CalculatorDetailed} />
      <Route path="/tools/tdee-calculator" component={CalculatorDetailed} />
      <Route path="/tools/mean-median-mode-calculator" component={CalculatorDetailed} />
      
      {/* Direct routes for Calculator Tools */}
      <Route path="/age-calculator" component={CalculatorDetailed} />
      <Route path="/percentage-calculator" component={CalculatorDetailed} />
      <Route path="/average-calculator" component={CalculatorDetailed} />
      <Route path="/confidence-interval-calculator" component={CalculatorDetailed} />
      <Route path="/sales-tax-calculator" component={CalculatorDetailed} />
      <Route path="/margin-calculator" component={CalculatorDetailed} />
      <Route path="/probability-calculator" component={CalculatorDetailed} />
      <Route path="/paypal-fee-calculator" component={CalculatorDetailed} />
      <Route path="/discount-calculator" component={CalculatorDetailed} />
      <Route path="/earnings-per-share-calculator" component={CalculatorDetailed} />
      <Route path="/cpm-calculator" component={CalculatorDetailed} />
      <Route path="/loan-to-value-calculator" component={CalculatorDetailed} />
      <Route path="/gst-calculator" component={CalculatorDetailed} />
      <Route path="/bmi-calculator" component={CalculatorDetailed} />
      <Route path="/chronological-age-calculator" component={CalculatorDetailed} />
      <Route path="/loan-calculator" component={CalculatorDetailed} />
      <Route path="/hours-calculator" component={CalculatorDetailed} />
      <Route path="/grade-calculator" component={CalculatorDetailed} />
      <Route path="/gpa-calculator" component={CalculatorDetailed} />
      <Route path="/percentage-increase-calculator" component={CalculatorDetailed} />
      <Route path="/percentage-decrease-calculator" component={CalculatorDetailed} />
      <Route path="/percentage-change-calculator" component={CalculatorDetailed} />
      <Route path="/percentage-difference-calculator" component={CalculatorDetailed} />
      <Route path="/calorie-calculator" component={CalculatorDetailed} />
      <Route path="/time-calculator" component={CalculatorDetailed} />
      <Route path="/salary-calculator" component={CalculatorDetailed} />
      <Route path="/investment-calculator" component={CalculatorDetailed} />
      <Route path="/tdee-calculator" component={CalculatorDetailed} />
      <Route path="/mean-median-mode-calculator" component={CalculatorDetailed} />
      
      <Route path="/categories" component={AllCategories} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
