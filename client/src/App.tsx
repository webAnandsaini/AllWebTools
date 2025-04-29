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

// All image tools now use the unified ImageToolsDetailed component

// All keyword tools now use the unified KeywordToolsDetailed component
import KeywordToolsDetailed from "@/pages/tools/KeywordToolsDetailed";
import BacklinkToolsDetailed from "@/pages/tools/BacklinkToolsDetailed";
import WebsiteToolsDetailed from "@/pages/tools/WebsiteToolsDetailed";
import PDFToolsDetailed from "@/pages/tools/PDFToolsDetailed";

// Meta Tags Tools
import MetaTagsAnalyzerDetailed from "@/pages/tools/MetaTagsAnalyzerDetailed";
import MetaTagGeneratorDetailed from "@/pages/tools/MetaTagGeneratorDetailed";

// All image format converters use the unified ImageToolsDetailed component

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
import FakeAddressGeneratorDetailed from "@/pages/tools/FakeAddressGeneratorDetailed";
import NameGeneratorDetailed from "@/pages/tools/NameGeneratorDetailed";
import AIContentGeneratorDetailed from "@/pages/tools/AIContentGeneratorDetailed";
import DesignStudioDetailed from "@/pages/tools/DesignStudioDetailed";
import ImageToolsDetailed from "@/pages/tools/ImageToolsDetailed";

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
      <Route path="/tools/logo-maker-detailed" component={DesignStudioDetailed} />
      <Route path="/tools/resume-builder-detailed" component={DesignStudioDetailed} />
      <Route path="/tools/flyer-maker-detailed" component={DesignStudioDetailed} />
      <Route path="/tools/poster-maker-detailed" component={DesignStudioDetailed} />
      <Route path="/tools/what-is-my-ip-detailed" component={WhatIsMyIPDetailed} />
      <Route path="/tools/ip-location-detailed" component={IPLocationDetailed} />
      <Route path="/tools/free-daily-proxy-list-detailed" component={FreeDailyProxyListDetailed} />
      
      {/* Password Tools */}
      <Route path="/tools/password-generator-detailed" component={PasswordGeneratorDetailed} />
      <Route path="/tools/password-strength-checker-detailed" component={PasswordStrengthCheckerDetailed} />
      <Route path="/tools/password-encryption-utility-detailed" component={PasswordEncryptionUtilityDetailed} />
      
      {/* Image Editing Tools - All using ImageToolsDetailed component */}
      <Route path="/tools/reverse-image-search-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/face-search-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/image-compressor-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/favicon-generator-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/video-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/image-resizer-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/photo-resizer-in-kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/crop-image-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/convert-to-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/rgb-to-hex-detailed" component={ImageToolsDetailed} />
      
      {/* Image format converters */}
      <Route path="/tools/png-to-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpg-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-image-to-50kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-image-to-20kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-jpeg-to-100kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-jpeg-to-200kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/resize-image-to-50kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/resize-image-to-100kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/resize-image-to-20kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/reduce-image-size-in-kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-image-to-10kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-jpeg-to-30kb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-image-to-1mb-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/mb-to-kb-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/mp4-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-jpg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/svg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/webp-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/svg-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-ico-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/avif-to-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-optimizer-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-png-detailed" component={ImageToolsDetailed} />
      
      {/* Direct routes for Image Tools */}
      <Route path="/reverse-image-search" component={ImageToolsDetailed} />
      <Route path="/face-search" component={ImageToolsDetailed} />
      <Route path="/image-compressor" component={ImageToolsDetailed} />
      <Route path="/favicon-generator" component={ImageToolsDetailed} />
      <Route path="/video-to-gif-converter" component={ImageToolsDetailed} />
      <Route path="/video-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/video-to-gif-converter" component={ImageToolsDetailed} />
      <Route path="/tools/video-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/image-resizer" component={ImageToolsDetailed} />
      <Route path="/photo-resizer-in-kb" component={ImageToolsDetailed} />
      <Route path="/crop-image" component={ImageToolsDetailed} />
      <Route path="/convert-to-jpg" component={ImageToolsDetailed} />
      <Route path="/rgb-to-hex" component={ImageToolsDetailed} />
      <Route path="/png-to-jpg" component={ImageToolsDetailed} />
      <Route path="/jpg-to-png" component={ImageToolsDetailed} />
      <Route path="/compress-image-to-50kb" component={ImageToolsDetailed} />
      <Route path="/compress-image-to-20kb" component={ImageToolsDetailed} />
      <Route path="/compress-jpeg-to-100kb" component={ImageToolsDetailed} />
      <Route path="/compress-jpeg-to-200kb" component={ImageToolsDetailed} />
      <Route path="/compress-jpg" component={ImageToolsDetailed} />
      <Route path="/resize-image-to-50kb" component={ImageToolsDetailed} />
      <Route path="/resize-image-to-100kb" component={ImageToolsDetailed} />
      <Route path="/resize-image-to-20kb" component={ImageToolsDetailed} />
      <Route path="/reduce-image-size-in-kb" component={ImageToolsDetailed} />
      <Route path="/compress-image-to-10kb" component={ImageToolsDetailed} />
      <Route path="/compress-jpeg-to-30kb" component={ImageToolsDetailed} />
      <Route path="/compress-image-to-1mb" component={ImageToolsDetailed} />
      <Route path="/mb-to-kb-converter" component={ImageToolsDetailed} />
      <Route path="/mp4-to-gif-converter" component={ImageToolsDetailed} />
      <Route path="/mp4-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/mp4-to-gif-converter" component={ImageToolsDetailed} />
      <Route path="/tools/mp4-to-gif-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/heic-to-jpg-converter" component={ImageToolsDetailed} />
      <Route path="/heic-to-jpg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-jpg-converter" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-jpg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/heic-to-png" component={ImageToolsDetailed} />
      <Route path="/heic-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-png" component={ImageToolsDetailed} />
      <Route path="/tools/heic-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/svg-converter" component={ImageToolsDetailed} />
      <Route path="/svg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/svg-converter" component={ImageToolsDetailed} />
      <Route path="/tools/svg-converter-detailed" component={ImageToolsDetailed} />
      <Route path="/png-to-svg" component={ImageToolsDetailed} />
      <Route path="/png-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-svg" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/jpg-to-svg" component={ImageToolsDetailed} />
      <Route path="/jpg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpg-to-svg" component={ImageToolsDetailed} />
      <Route path="/tools/jpg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/jpeg-to-svg" component={ImageToolsDetailed} />
      <Route path="/jpeg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-to-svg" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-to-svg-detailed" component={ImageToolsDetailed} />
      <Route path="/webp-to-png" component={ImageToolsDetailed} />
      <Route path="/webp-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/webp-to-png" component={ImageToolsDetailed} />
      <Route path="/tools/webp-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/svg-to-png" component={ImageToolsDetailed} />
      <Route path="/svg-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/svg-to-png" component={ImageToolsDetailed} />
      <Route path="/tools/svg-to-png-detailed" component={ImageToolsDetailed} />
      <Route path="/png-to-ico" component={ImageToolsDetailed} />
      <Route path="/png-to-ico-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-ico" component={ImageToolsDetailed} />
      <Route path="/tools/png-to-ico-detailed" component={ImageToolsDetailed} />
      <Route path="/avif-to-jpg" component={ImageToolsDetailed} />
      <Route path="/avif-to-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/avif-to-jpg" component={ImageToolsDetailed} />
      <Route path="/tools/avif-to-jpg-detailed" component={ImageToolsDetailed} />
      <Route path="/jpeg-optimizer" component={ImageToolsDetailed} />
      <Route path="/jpeg-optimizer-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-optimizer" component={ImageToolsDetailed} />
      <Route path="/tools/jpeg-optimizer-detailed" component={ImageToolsDetailed} />
      <Route path="/compress-png" component={ImageToolsDetailed} />
      <Route path="/compress-png-detailed" component={ImageToolsDetailed} />
      <Route path="/tools/compress-png" component={ImageToolsDetailed} />
      <Route path="/tools/compress-png-detailed" component={ImageToolsDetailed} />
      
      {/* Keyword Tools - All using KeywordToolsDetailed component */}
      <Route path="/tools/keyword-position-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keywords-density-checker-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keyword-density-checker-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keywords-suggestions-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keyword-research-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keyword-competition-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/related-keywords-finder-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/long-tail-keyword-suggestion-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keywords-rich-domains-suggestions-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/seo-keyword-competition-analysis-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/live-keyword-analyzer-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keyword-overview-tool-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/keyword-difficulty-checker-detailed" component={KeywordToolsDetailed} />
      <Route path="/tools/paid-keyword-finder-detailed" component={KeywordToolsDetailed} />
      
      {/* Backlink Tools - All using BacklinkToolsDetailed component */}
      <Route path="/tools/backlink-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/backlink-maker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/website-link-count-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/website-broken-link-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/link-price-calculator-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/reciprocal-link-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/website-link-analyzer-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/broken-backlink-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/valuable-backlink-checker-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/backlinks-competitors-detailed" component={BacklinkToolsDetailed} />
      <Route path="/tools/anchor-text-distribution-detailed" component={BacklinkToolsDetailed} />
      
      {/* Website Management Tools - All using WebsiteToolsDetailed component */}
      <Route path="/tools/website-seo-score-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/google-pagerank-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/online-ping-website-tool-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/page-speed-test-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/website-page-size-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/website-page-snooper-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/website-hit-counter-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/xml-sitemap-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/url-rewriting-tool-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/what-is-my-screen-resolution-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/url-encoder-decoder-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/adsense-calculator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/open-graph-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/open-graph-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/qr-code-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/htaccess-redirect-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/get-http-headers-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/twitter-card-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/internet-speed-test-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/wordpress-theme-detector-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/instant-search-suggestions-tool-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/online-virus-scan-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/website-screenshot-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/secure-email-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/mobile-friendly-test-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/facebook-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/soundcloud-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/vimeo-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/instagram-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/dailymotion-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/minify-css-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/minify-html-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/minify-js-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/robots-txt-generator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/url-shortener-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/website-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/url-opener-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/php-formatter-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/html-formatter-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/html-editor-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/html-viewer-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/xml-formatter-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/xml-beautifier-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/twitter-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/twitter-gif-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/tiktok-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/instagram-reels-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/facebook-reels-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/tiktok-to-mp4-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/instagram-to-mp4-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/twitter-to-mp4-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/facebook-to-mp4-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/pinterest-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/reddit-video-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/mp4-downloader-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/ptcl-speed-test-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/link-tracker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/reverse-ip-lookup-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/check-server-status-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/class-c-ip-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/code-to-text-ratio-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/alexa-rank-comparison-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/page-comparison-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/spider-simulator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/comparison-search-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/google-cache-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/whois-lookup-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/mozrank-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/page-authority-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/google-index-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/alexa-rank-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/redirect-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/similar-site-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/cloaking-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/google-malware-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/find-facebook-id-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/check-gzip-compression-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/ssl-checker-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/pokemon-go-server-status-finder-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/find-blog-sites-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/geo-ip-locator-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/apps-rank-tracking-tool-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/what-is-my-browser-detailed" component={WebsiteToolsDetailed} />
      <Route path="/tools/check-social-status-detailed" component={WebsiteToolsDetailed} />
      
      {/* PDF Tools - All using PDFToolsDetailed component */}
      <Route path="/tools/pdf-to-word-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/word-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-jpg-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/jpg-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/merge-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/rotate-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/unlock-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/lock-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/watermark-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/powerpoint-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/excel-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/split-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-50kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-100kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-150kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-200kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/resize-pdf-to-200kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-300kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-500kb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-1mb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/compress-pdf-to-2mb-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-zip-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/delete-pages-from-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-bmp-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/gif-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-tiff-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/tiff-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/png-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/svg-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-svg-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-to-png-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/bmp-to-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/remove-password-from-pdf-detailed" component={PDFToolsDetailed} />
      <Route path="/tools/pdf-page-remover-detailed" component={PDFToolsDetailed} />
      
      {/* Direct routes for Keyword Tools */}
      <Route path="/keyword-position" component={KeywordToolsDetailed} />
      <Route path="/keywords-density-checker" component={KeywordToolsDetailed} />
      <Route path="/keyword-density-checker" component={KeywordToolsDetailed} />
      <Route path="/keywords-suggestions-tool" component={KeywordToolsDetailed} />
      <Route path="/keyword-research-tool" component={KeywordToolsDetailed} />
      <Route path="/keyword-competition-tool" component={KeywordToolsDetailed} />
      <Route path="/related-keywords-finder" component={KeywordToolsDetailed} />
      <Route path="/long-tail-keyword-suggestion-tool" component={KeywordToolsDetailed} />
      <Route path="/keywords-rich-domains-suggestions-tool" component={KeywordToolsDetailed} />
      <Route path="/seo-keyword-competition-analysis" component={KeywordToolsDetailed} />
      <Route path="/live-keyword-analyzer" component={KeywordToolsDetailed} />
      <Route path="/keyword-overview-tool" component={KeywordToolsDetailed} />
      <Route path="/keyword-difficulty-checker" component={KeywordToolsDetailed} />
      <Route path="/paid-keyword-finder" component={KeywordToolsDetailed} />
      
      {/* Direct routes for Backlink Tools */}
      <Route path="/backlink-checker" component={BacklinkToolsDetailed} />
      <Route path="/backlink-maker" component={BacklinkToolsDetailed} />
      <Route path="/website-link-count-checker" component={BacklinkToolsDetailed} />
      <Route path="/website-broken-link-checker" component={BacklinkToolsDetailed} />
      <Route path="/link-price-calculator" component={BacklinkToolsDetailed} />
      <Route path="/reciprocal-link-checker" component={BacklinkToolsDetailed} />
      <Route path="/website-link-analyzer" component={BacklinkToolsDetailed} />
      <Route path="/broken-backlink-checker" component={BacklinkToolsDetailed} />
      <Route path="/valuable-backlink-checker" component={BacklinkToolsDetailed} />
      <Route path="/backlinks-competitors" component={BacklinkToolsDetailed} />
      <Route path="/anchor-text-distribution" component={BacklinkToolsDetailed} />
      
      {/* Direct routes for Website Management Tools */}
      <Route path="/website-seo-score-checker" component={WebsiteToolsDetailed} />
      <Route path="/google-pagerank-checker" component={WebsiteToolsDetailed} />
      <Route path="/online-ping-website-tool" component={WebsiteToolsDetailed} />
      <Route path="/page-speed-test" component={WebsiteToolsDetailed} />
      <Route path="/website-page-size-checker" component={WebsiteToolsDetailed} />
      <Route path="/website-page-snooper" component={WebsiteToolsDetailed} />
      <Route path="/website-hit-counter" component={WebsiteToolsDetailed} />
      <Route path="/xml-sitemap-generator" component={WebsiteToolsDetailed} />
      <Route path="/url-rewriting-tool" component={WebsiteToolsDetailed} />
      <Route path="/what-is-my-screen-resolution" component={WebsiteToolsDetailed} />
      <Route path="/url-encoder-decoder" component={WebsiteToolsDetailed} />
      <Route path="/adsense-calculator" component={WebsiteToolsDetailed} />
      <Route path="/open-graph-checker" component={WebsiteToolsDetailed} />
      <Route path="/open-graph-generator" component={WebsiteToolsDetailed} />
      <Route path="/qr-code-generator" component={WebsiteToolsDetailed} />
      <Route path="/htaccess-redirect-generator" component={WebsiteToolsDetailed} />
      <Route path="/get-http-headers" component={WebsiteToolsDetailed} />
      <Route path="/twitter-card-generator" component={WebsiteToolsDetailed} />
      <Route path="/internet-speed-test" component={WebsiteToolsDetailed} />
      <Route path="/wordpress-theme-detector" component={WebsiteToolsDetailed} />
      <Route path="/instant-search-suggestions-tool" component={WebsiteToolsDetailed} />
      <Route path="/online-virus-scan" component={WebsiteToolsDetailed} />
      <Route path="/website-screenshot-generator" component={WebsiteToolsDetailed} />
      <Route path="/secure-email" component={WebsiteToolsDetailed} />
      <Route path="/mobile-friendly-test" component={WebsiteToolsDetailed} />
      <Route path="/video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/facebook-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/soundcloud-downloader" component={WebsiteToolsDetailed} />
      <Route path="/vimeo-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/instagram-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/dailymotion-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/minify-css" component={WebsiteToolsDetailed} />
      <Route path="/minify-html" component={WebsiteToolsDetailed} />
      <Route path="/minify-js" component={WebsiteToolsDetailed} />
      <Route path="/robots-txt-generator" component={WebsiteToolsDetailed} />
      <Route path="/url-shortener" component={WebsiteToolsDetailed} />
      <Route path="/website-checker" component={WebsiteToolsDetailed} />
      <Route path="/url-opener" component={WebsiteToolsDetailed} />
      <Route path="/php-formatter" component={WebsiteToolsDetailed} />
      <Route path="/html-formatter" component={WebsiteToolsDetailed} />
      <Route path="/html-editor" component={WebsiteToolsDetailed} />
      <Route path="/html-viewer" component={WebsiteToolsDetailed} />
      <Route path="/xml-formatter" component={WebsiteToolsDetailed} />
      <Route path="/xml-beautifier" component={WebsiteToolsDetailed} />
      <Route path="/twitter-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/twitter-gif-downloader" component={WebsiteToolsDetailed} />
      <Route path="/tiktok-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/instagram-reels-downloader" component={WebsiteToolsDetailed} />
      <Route path="/facebook-reels-downloader" component={WebsiteToolsDetailed} />
      <Route path="/tiktok-to-mp4" component={WebsiteToolsDetailed} />
      <Route path="/instagram-to-mp4" component={WebsiteToolsDetailed} />
      <Route path="/twitter-to-mp4" component={WebsiteToolsDetailed} />
      <Route path="/facebook-to-mp4" component={WebsiteToolsDetailed} />
      <Route path="/pinterest-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/reddit-video-downloader" component={WebsiteToolsDetailed} />
      <Route path="/mp4-downloader" component={WebsiteToolsDetailed} />
      <Route path="/ptcl-speed-test" component={WebsiteToolsDetailed} />
      <Route path="/link-tracker" component={WebsiteToolsDetailed} />
      <Route path="/reverse-ip-lookup" component={WebsiteToolsDetailed} />
      <Route path="/check-server-status" component={WebsiteToolsDetailed} />
      <Route path="/class-c-ip-checker" component={WebsiteToolsDetailed} />
      <Route path="/code-to-text-ratio-checker" component={WebsiteToolsDetailed} />
      <Route path="/alexa-rank-comparison" component={WebsiteToolsDetailed} />
      <Route path="/page-comparison" component={WebsiteToolsDetailed} />
      <Route path="/spider-simulator" component={WebsiteToolsDetailed} />
      <Route path="/comparison-search" component={WebsiteToolsDetailed} />
      <Route path="/google-cache-checker" component={WebsiteToolsDetailed} />
      <Route path="/whois-lookup" component={WebsiteToolsDetailed} />
      <Route path="/mozrank-checker" component={WebsiteToolsDetailed} />
      <Route path="/page-authority-checker" component={WebsiteToolsDetailed} />
      <Route path="/google-index-checker" component={WebsiteToolsDetailed} />
      <Route path="/alexa-rank-checker" component={WebsiteToolsDetailed} />
      <Route path="/redirect-checker" component={WebsiteToolsDetailed} />
      <Route path="/similar-site-checker" component={WebsiteToolsDetailed} />
      <Route path="/cloaking-checker" component={WebsiteToolsDetailed} />
      <Route path="/google-malware-checker" component={WebsiteToolsDetailed} />
      <Route path="/find-facebook-id" component={WebsiteToolsDetailed} />
      <Route path="/check-gzip-compression" component={WebsiteToolsDetailed} />
      <Route path="/ssl-checker" component={WebsiteToolsDetailed} />
      <Route path="/pokemon-go-server-status-finder" component={WebsiteToolsDetailed} />
      <Route path="/find-blog-sites" component={WebsiteToolsDetailed} />
      <Route path="/geo-ip-locator" component={WebsiteToolsDetailed} />
      <Route path="/apps-rank-tracking-tool" component={WebsiteToolsDetailed} />
      <Route path="/what-is-my-browser" component={WebsiteToolsDetailed} />
      <Route path="/check-social-status" component={WebsiteToolsDetailed} />
      
      {/* Direct routes for PDF Tools */}
      <Route path="/pdf-to-word" component={PDFToolsDetailed} />
      <Route path="/word-to-pdf" component={PDFToolsDetailed} />
      <Route path="/pdf-to-jpg" component={PDFToolsDetailed} />
      <Route path="/jpg-to-pdf" component={PDFToolsDetailed} />
      <Route path="/merge-pdf" component={PDFToolsDetailed} />
      <Route path="/compress-pdf" component={PDFToolsDetailed} />
      <Route path="/rotate-pdf" component={PDFToolsDetailed} />
      <Route path="/unlock-pdf" component={PDFToolsDetailed} />
      <Route path="/lock-pdf" component={PDFToolsDetailed} />
      <Route path="/watermark" component={PDFToolsDetailed} />
      <Route path="/powerpoint-to-pdf" component={PDFToolsDetailed} />
      <Route path="/excel-to-pdf" component={PDFToolsDetailed} />
      <Route path="/split-pdf" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-50kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-100kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-150kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-200kb" component={PDFToolsDetailed} />
      <Route path="/resize-pdf-to-200kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-300kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-500kb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-1mb" component={PDFToolsDetailed} />
      <Route path="/compress-pdf-to-2mb" component={PDFToolsDetailed} />
      <Route path="/pdf-to-zip" component={PDFToolsDetailed} />
      <Route path="/delete-pages-from-pdf" component={PDFToolsDetailed} />
      <Route path="/pdf-to-bmp" component={PDFToolsDetailed} />
      <Route path="/gif-to-pdf" component={PDFToolsDetailed} />
      <Route path="/pdf-to-tiff" component={PDFToolsDetailed} />
      <Route path="/tiff-to-pdf" component={PDFToolsDetailed} />
      <Route path="/png-to-pdf" component={PDFToolsDetailed} />
      <Route path="/svg-to-pdf" component={PDFToolsDetailed} />
      <Route path="/pdf-to-svg" component={PDFToolsDetailed} />
      <Route path="/pdf-to-png" component={PDFToolsDetailed} />
      <Route path="/bmp-to-pdf" component={PDFToolsDetailed} />
      <Route path="/remove-password-from-pdf" component={PDFToolsDetailed} />
      <Route path="/pdf-page-remover" component={PDFToolsDetailed} />
      
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
      <Route path="/tools/fake-address-generator" component={FakeAddressGeneratorDetailed} />
      <Route path="/fake-address-generator" component={FakeAddressGeneratorDetailed} />
      <Route path="/tools/japanese-name-generator" component={NameGeneratorDetailed} />
      <Route path="/japanese-name-generator" component={NameGeneratorDetailed} />
      <Route path="/tools/last-name-generator" component={NameGeneratorDetailed} />
      <Route path="/last-name-generator" component={NameGeneratorDetailed} />
      <Route path="/tools/random-name-generator" component={NameGeneratorDetailed} />
      <Route path="/random-name-generator" component={NameGeneratorDetailed} />
      <Route path="/tools/korean-name-generator" component={NameGeneratorDetailed} />
      <Route path="/korean-name-generator" component={NameGeneratorDetailed} />
      <Route path="/tools/spanish-name-generator" component={NameGeneratorDetailed} />
      <Route path="/spanish-name-generator" component={NameGeneratorDetailed} />
      
      {/* AI Writing Tools - Both tool and direct routes */}
      <Route path="/tools/ai-writer" component={AIContentGeneratorDetailed} />
      <Route path="/ai-writer" component={AIContentGeneratorDetailed} />
      <Route path="/tools/ai-text-generator" component={AIContentGeneratorDetailed} />
      <Route path="/ai-text-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/paragraph-generator" component={AIContentGeneratorDetailed} />
      <Route path="/paragraph-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/essay-title-generator" component={AIContentGeneratorDetailed} />
      <Route path="/essay-title-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/plot-generator" component={AIContentGeneratorDetailed} />
      <Route path="/plot-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/thesis-statement-generator" component={AIContentGeneratorDetailed} />
      <Route path="/thesis-statement-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/ai-story-generator" component={AIContentGeneratorDetailed} />
      <Route path="/ai-story-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/conclusion-generator" component={AIContentGeneratorDetailed} />
      <Route path="/conclusion-generator" component={AIContentGeneratorDetailed} />
      <Route path="/tools/ai-email-writer" component={AIContentGeneratorDetailed} />
      <Route path="/ai-email-writer" component={AIContentGeneratorDetailed} />
      
      {/* Design Studio Tools - Both tool and direct routes */}
      <Route path="/tools/logo-maker" component={DesignStudioDetailed} />
      <Route path="/logo-maker" component={DesignStudioDetailed} />
      <Route path="/tools/resume-builder" component={DesignStudioDetailed} />
      <Route path="/resume-builder" component={DesignStudioDetailed} />
      <Route path="/tools/flyer-maker" component={DesignStudioDetailed} />
      <Route path="/flyer-maker" component={DesignStudioDetailed} />
      <Route path="/tools/poster-maker" component={DesignStudioDetailed} />
      <Route path="/poster-maker" component={DesignStudioDetailed} />
      <Route path="/tools/invitation-maker" component={DesignStudioDetailed} />
      <Route path="/invitation-maker" component={DesignStudioDetailed} />
      <Route path="/tools/business-card-maker" component={DesignStudioDetailed} />
      <Route path="/business-card-maker" component={DesignStudioDetailed} />
      <Route path="/tools/meme-generator" component={DesignStudioDetailed} />
      <Route path="/meme-generator" component={DesignStudioDetailed} />
      <Route path="/tools/emojis" component={DesignStudioDetailed} />
      <Route path="/emojis" component={DesignStudioDetailed} />
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
