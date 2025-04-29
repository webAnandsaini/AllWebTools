import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      className={`fixed top-[72px] left-0 right-0 bottom-0 md:hidden bg-white border-t border-gray-200 z-40 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-col">
          {/* Main navigation items */}
          <div className="space-y-2 pb-6 mb-6 border-b border-gray-100">
            <Link 
              href="/" 
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 font-medium transition-colors" 
              onClick={onClose}
            >
              <i className="fas fa-home mr-3 text-indigo-500"></i>
              Home
            </Link>
            
            <Link
              href="/#popular-tools"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 font-medium transition-colors"
              onClick={onClose}
            >
              <i className="fas fa-star mr-3 text-indigo-500"></i>
              Popular Tools
            </Link>
            
            <Link
              href="/categories"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-900 font-medium transition-colors"
              onClick={onClose}
            >
              <i className="fas fa-th-large mr-3 text-indigo-500"></i>
              All Categories
            </Link>
          </div>
          
          {/* Secondary items */}
          <div className="space-y-2 pb-6 mb-6 border-b border-gray-100">
            <h3 className="text-sm font-semibold uppercase text-gray-500 px-4 mb-2">Top Tool Categories</h3>
            
            <Link
              href="/categories/text-analysis"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              onClick={onClose}
            >
              <i className="fas fa-file-alt mr-3 text-violet-500"></i>
              Text Analysis Tools
            </Link>
            
            <Link
              href="/categories/ai-writing"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              onClick={onClose}
            >
              <i className="fas fa-robot mr-3 text-blue-500"></i>
              AI Writing Generators
            </Link>
            
            <Link
              href="/categories/design-studio"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
              onClick={onClose}
            >
              <i className="fas fa-paint-brush mr-3 text-pink-500"></i>
              Design Studio
            </Link>
          </div>
          
          {/* CTA button */}
          <div className="pt-2">
            <Link
              href="#"
              className="btn-primary w-full flex items-center justify-center"
              onClick={onClose}
            >
              <i className="fas fa-user mr-2"></i>
              Sign In
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
