import { Link } from "wouter";
import { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  // Map specific tools to their detailed page versions
  const getToolUrl = (slug: string) => {
    const detailedToolsMap: Record<string, string> = {
      // Text Analysis Tools
      "article-rewriter": "article-rewriter-detailed",
      "plagiarism-checker": "plagiarism-checker-detailed",
      "word-counter": "word-counter-detailed",
      "grammar-checker": "grammar-checker-detailed",
      "spell-checker": "spell-checker-detailed",
      "paraphrasing-tool": "paraphrasing-tool-detailed",
      "text-to-speech": "text-to-speech-detailed",
      "speech-to-text": "speech-to-text-detailed",
      "text-summarizer": "text-summarizer-detailed",
      "ai-content-detector": "ai-content-detector-detailed",
      "ocr": "ocr-detailed",
      "md5-generator": "md5-generator-detailed",
      "uppercase-to-lowercase": "uppercase-to-lowercase-detailed",
      "word-combiner": "word-combiner-detailed",
      "image-to-text": "image-to-text-detailed",
      "translate-english-to-hindi": "translate-english-to-hindi-detailed",
      "text-to-image": "text-to-image-detailed",
      "jpg-to-word": "jpg-to-word-detailed",
      "small-text-generator": "small-text-generator-detailed",
      "online-text-editor": "online-text-editor-detailed",
      "reverse-text-generator": "reverse-text-generator-detailed",
      "sentence-rephraser": "sentence-rephraser-detailed",
      "sentence-checker": "sentence-checker-detailed",
      "rewording-tool": "rewording-tool-detailed",
      "punctuation-checker": "punctuation-checker-detailed",
      "essay-checker": "essay-checker-detailed",
      "paper-checker": "paper-checker-detailed",
      "online-proofreader": "online-proofreader-detailed",
      "word-changer": "word-changer-detailed",
      "sentence-rewriter": "sentence-rewriter-detailed",
      "essay-rewriter": "essay-rewriter-detailed",
      "paraphrase-generator": "paraphrase-generator-detailed",
      "sentence-changer": "sentence-changer-detailed",
      "image-translator": "image-translator-detailed",
      "chatgpt-detector": "chatgpt-detector-detailed",
      "citation-generator": "citation-generator-detailed",
      "online-notepad": "online-notepad-detailed",
      "invisible-character": "invisible-character-detailed",
      
      // Design Studio Tools
      "logo-maker": "logo-maker-detailed",
      "resume-builder": "resume-builder-detailed",
      "flyer-maker": "flyer-maker-detailed",
      "poster-maker": "poster-maker-detailed",
      "invitation-maker": "invitation-maker-detailed", 
      "business-card-maker": "business-card-maker-detailed",
      "meme-generator": "meme-generator-detailed",
      "emojis": "emojis-detailed",
      
      // IP Tools
      "what-is-my-ip": "what-is-my-ip-detailed",
      "ip-location": "ip-location-detailed",
      "free-daily-proxy-list": "free-daily-proxy-list-detailed"
    };
    
    return `/tools/${detailedToolsMap[slug] || slug}`;
  };

  return (
    <Link href={getToolUrl(tool.slug)} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col">
      <div className={`w-12 h-12 rounded-lg ${tool.iconBg} flex items-center justify-center mb-4`}>
        <i className={`${tool.icon} ${tool.iconColor} text-xl`}></i>
      </div>
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600 text-sm flex-grow">{tool.description}</p>
      <div className="flex items-center mt-4 text-sm text-primary font-medium">
        <span>Use Tool</span>
        <i className="fas fa-arrow-right ml-2"></i>
      </div>
    </Link>
  );
};

export default ToolCard;
