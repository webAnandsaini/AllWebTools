import { Link } from "wouter";
import { Tool } from "@/data/tools";

interface CategoryToolCardProps {
  tool: Tool;
}

const CategoryToolCard = ({ tool }: CategoryToolCardProps) => {
  // Map specific tools to their detailed page versions
  const getToolUrl = (slug: string) => {
    const detailedToolsMap: Record<string, string> = {
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
      "sentence-rephraser": "sentence-rephraser-detailed"
    };
    
    return `/tools/${detailedToolsMap[slug] || slug}`;
  };

  return (
    <Link
      href={getToolUrl(tool.slug)}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex items-center"
    >
      <div className={`w-10 h-10 rounded-lg ${tool.iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
        <i className={`${tool.icon} ${tool.iconColor}`}></i>
      </div>
      <span className="font-medium truncate">{tool.name}</span>
    </Link>
  );
};

export default CategoryToolCard;
