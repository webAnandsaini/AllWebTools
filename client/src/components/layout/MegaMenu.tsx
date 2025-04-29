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
      className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 py-6 border-t border-gray-100"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4">
        {type === 'categories' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="mb-6">
                  <Link 
                    href={`/categories/${category.slug}`}
                    onClick={handleLinkClick}
                    className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg ${category.iconBg} flex items-center justify-center shrink-0 mr-3`}>
                      <i className={`${category.icon} ${category.iconColor} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.tools.length} tools</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'popular' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Popular Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {popularTools.map((tool) => (
                <Link 
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={handleLinkClick}
                  className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-center"
                >
                  <div className={`w-12 h-12 rounded-full ${tool.iconBg} flex items-center justify-center mb-2`}>
                    <i className={`${tool.icon} ${tool.iconColor}`}></i>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{tool.name}</span>
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