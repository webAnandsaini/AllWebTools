import React from 'react';
import { Link } from 'wouter';
import { Category } from '@/data/categories';
import { Tool } from '@/data/tools';

interface MegaMenuProps {
  isOpen: boolean;
  type: 'categories' | 'popular';
  categories: Category[];
  popularTools: Tool[];
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  type,
  categories,
  popularTools,
  onClose
}) => {
  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 py-8 border-t border-gray-100"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4">
        {type === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-8 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-800">All Categories</h3>
              <Link href="/categories" onClick={handleLinkClick} className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                View All Categories
                <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <Link 
                    href={`/categories/${category.slug}`}
                    onClick={handleLinkClick}
                    className="flex flex-col hover:bg-gray-50 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100 hover:shadow-sm group"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${category.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${category.icon} ${category.iconColor} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <i className="fas fa-tools text-xs mr-1 text-indigo-500"></i>
                        <span>{category.tools.length} tools</span>
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'popular' && (
          <div>
            <div className="flex justify-between items-center mb-8 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-800">Popular Tools</h3>
              <Link href="/categories" onClick={handleLinkClick} className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                Explore All Tools
                <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popularTools.map((tool) => (
                <Link 
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={handleLinkClick}
                  className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-100 hover:shadow-sm text-center group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${tool.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${tool.icon} ${tool.iconColor} text-xl`}></i>
                  </div>
                  <span className="font-medium text-gray-800">{tool.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{tool.category}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;