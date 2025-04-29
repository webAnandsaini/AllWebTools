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
    <section id="all-categories" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="section-title">All Tool Categories</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Browse our extensive collection of tools organized by category to find exactly what you need
          </p>
        </div>
        
        {categories.slice(0, visibleCategories).map((category) => (
          <div key={category.id} className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`w-10 h-10 rounded-xl ${category.iconBg} flex items-center justify-center mr-3`}>
                  <i className={`${category.icon} ${category.iconColor}`}></i>
                </div>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
              
              <Link 
                href={`/categories/${category.slug}`} 
                className="group inline-flex items-center text-primary font-medium hover:text-indigo-700 transition-colors"
              >
                View All Tools
                <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.tools.slice(0, 8).map((tool) => (
                <CategoryToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
        
        {visibleCategories < categories.length && (
          <div className="text-center mt-12">
            <button 
              className="btn-secondary inline-flex items-center"
              onClick={showMoreCategories}
            >
              <span>View More Categories</span>
              <i className="fas fa-chevron-down ml-2 transition-transform group-hover:translate-y-1"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolCategories;
