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
      "speech-to-text": "speech-to-text-detailed"
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
