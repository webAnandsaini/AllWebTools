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
    <section id="all-categories" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">All Tool Categories</h2>
        
        {categories.slice(0, visibleCategories).map((category) => (
          <div key={category.id} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
              <Link href={`/categories/${category.slug}`} className="text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {category.tools.slice(0, 10).map((tool) => (
                <CategoryToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
        
        {visibleCategories < categories.length && (
          <div className="text-center mt-8">
            <button 
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition inline-flex items-center"
              onClick={showMoreCategories}
            >
              <span>View More Categories</span>
              <i className="fas fa-chevron-down ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolCategories;
