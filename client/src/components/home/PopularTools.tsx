import { Link } from "wouter";
import ToolCard from "@/components/common/ToolCard";
import { popularTools } from "@/data/tools";

const PopularTools = () => {
  return (
    <section id="popular-tools" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Popular Tools</h2>
          <Link href="/categories" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
