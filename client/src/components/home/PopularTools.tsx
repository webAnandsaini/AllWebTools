import { Link } from "wouter";
import ToolCard from "@/components/common/ToolCard";
import { popularTools } from "@/data/tools";

const PopularTools = () => {
  return (
    <section id="popular-tools" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="section-title">Most Popular Tools</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Discover our most-used tools that help thousands of users every day
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/categories" 
            className="btn-primary inline-flex items-center group"
          >
            <span>Explore All Tools</span>
            <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
