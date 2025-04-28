import { Link } from "wouter";
import { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Link href={`/tools/${tool.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col">
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
