import { Link } from "wouter";
import ToolCard from "@/components/common/ToolCard";
import { popularTools } from "@/data/tools";

const PopularTools = () => {
  return (
    <section id="popular-tools" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-50 rounded-full opacity-60 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full opacity-60 translate-y-1/2"></div>
        
        <div className="absolute top-24 right-16 w-4 h-4 bg-pink-300 rounded opacity-30"></div>
        <div className="absolute bottom-24 left-16 w-6 h-6 bg-indigo-300 rounded-full opacity-30"></div>
        <div className="absolute top-40 left-40 w-3 h-3 bg-purple-300 rounded-sm opacity-30 rotate-45"></div>
        <div className="absolute bottom-40 right-40 w-5 h-5 bg-blue-300 rounded-md opacity-30 -rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Most <span className="text-gradient">Popular</span> Tools
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Discover our most-used tools that help thousands of users every day
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/categories" 
            className="btn-primary inline-flex items-center px-8 py-3 rounded-full shadow-md group"
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
