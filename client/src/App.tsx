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
import AllCategories from "@/pages/AllCategories";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories/:category" component={CategoryPage} />
      <Route path="/tools/plagiarism-checker" component={PlagiarismChecker} />
      <Route path="/tools/word-counter" component={WordCounter} />
      <Route path="/tools/password-generator" component={PasswordGenerator} />
      <Route path="/tools/text-to-speech" component={TextToSpeech} />
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
