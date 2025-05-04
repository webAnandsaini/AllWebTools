import { ReactNode } from "react";
import { Link } from "wouter";
import { allTools, passwordManagementTools } from "@/data/tools";

interface ToolPageProps {
  toolSlug: string;
  toolContent: ReactNode;
}

const ToolPageTemplate = ({ toolSlug, toolContent }: ToolPageProps) => {
  // Find the current tool from all available tools
  const currentTool = allTools.find(tool => tool.slug === toolSlug);

  if (!currentTool) {
    return <div>Tool not found</div>;
  }

  // Determine what tools to show as related tools
  let relatedToolsArray = allTools;

  // For password management tools, only show other password management tools
  if (currentTool.category === "Password Management Tools") {
    relatedToolsArray = passwordManagementTools;
  }

  // Find related tools (up to 4 from the same category)
  const relatedTools = relatedToolsArray
    .filter(tool => tool.slug !== toolSlug && tool.category === currentTool.category)
    .slice(0, 4);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{currentTool.name}</h1>
              <p className="text-gray-600">{currentTool.description}</p>
            </div>

            {/* Tool content section */}
            <div className="space-y-6">{toolContent}</div>

            {/* Related Tools section */}
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Related Tools You May Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
                  >
                    <div className={`w-12 h-12 rounded-lg ${tool.iconBg} flex items-center justify-center mb-2`}>
                      <i className={`${tool.icon} ${tool.iconColor}`}></i>
                    </div>
                    <span className="font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPageTemplate;