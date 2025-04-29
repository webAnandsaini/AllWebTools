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

// JSON Tools - lazy loaded
const JSONViewerDetailed = lazy(() => import("@/pages/tools/JSONViewerDetailed"));
const JSONFormatterDetailed = lazy(() => import("@/pages/tools/JSONFormatterDetailed"));
const JSONValidatorDetailed = lazy(() => import("@/pages/tools/JSONValidatorDetailed"));
const JSONToXMLDetailed = lazy(() => import("@/pages/tools/JSONToXMLDetailed"));
const JSONEditorDetailed = lazy(() => import("@/pages/tools/JSONEditorDetailed"));
const JSONBeautifierDetailed = lazy(() => import("@/pages/tools/JSONBeautifierDetailed"));

import AllCategories from "@/pages/AllCategories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingFallback from "@/components/common/LoadingFallback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories/:category" component={CategoryPage} />
      
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
      <Route path="/tools/json-viewer-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONViewerDetailed />
        </Suspense>
      )} />
      <Route path="/tools/json-formatter-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONFormatterDetailed />
        </Suspense>
      )} />
      <Route path="/tools/json-validator-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONValidatorDetailed />
        </Suspense>
      )} />
      <Route path="/tools/json-to-xml-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONToXMLDetailed />
        </Suspense>
      )} />
      <Route path="/tools/json-editor-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONEditorDetailed />
        </Suspense>
      )} />
      <Route path="/tools/json-beautifier-detailed" component={() => (
        <Suspense fallback={<LoadingFallback />}>
          <JSONBeautifierDetailed />
        </Suspense>
      )} />
      
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
