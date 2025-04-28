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

import AllCategories from "@/pages/AllCategories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
