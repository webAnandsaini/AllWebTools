import { useState } from "react";
import { Link } from "wouter";
import CategoryToolCard from "@/components/common/CategoryToolCard";
import { categories } from "@/data/categories";

const ToolCategories = () => {
  const [visibleCategories, setVisibleCategories] = useState(3); // Default number of visible categories
  
  const showMoreCategories = () => {
    setVisibleCategories((prev) => 
      prev + 3 > categories.length ? categories.length : prev + 3
    );
  };

  return (
    <section id="all-categories" className="py-24 bg-gradient-to-b from-[#f5f7ff] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">
            All Tool <span className="text-gradient">Categories</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Browse our extensive collection of tools organized by category to find exactly what you need
          </p>
        </div>
        
        {/* Decorative shapes */}
        <div className="relative">
          <div className="absolute -top-16 -left-4 w-20 h-20 opacity-10 rounded-full bg-blue-400 blur-xl"></div>
          <div className="absolute top-1/4 -right-6 w-32 h-32 opacity-10 rounded-full bg-purple-400 blur-xl"></div>
          <div className="absolute bottom-0 left-1/4 w-24 h-24 opacity-10 rounded-full bg-pink-400 blur-xl"></div>
        </div>
        
        {categories.slice(0, visibleCategories).map((category) => (
          <div key={category.id} className="mb-20 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`w-12 h-12 rounded-2xl ${category.iconBg} flex items-center justify-center mr-4 shadow-md`}>
                  <i className={`${category.icon} ${category.iconColor}`}></i>
                </div>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
              
              <Link 
                href={`/categories/${category.slug}`} 
                className="group inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                View All Tools
                <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {category.tools.slice(0, 8).map((tool) => (
                <CategoryToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
        
        {visibleCategories < categories.length && (
          <div className="text-center mt-16">
            <button 
              className="btn-primary inline-flex items-center px-8 py-3 rounded-full"
              onClick={showMoreCategories}
            >
              <span>View More Categories</span>
              <i className="fas fa-chevron-down ml-2 transition-transform duration-300 group-hover:translate-y-1"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolCategories;
