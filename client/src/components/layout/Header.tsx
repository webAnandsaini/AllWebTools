import { useState } from "react";
import { Link } from "wouter";
import SearchBar from "@/components/common/SearchBar";
import MobileMenu from "./MobileMenu";
import MegaMenu from "./MegaMenu";
import { categories } from "@/data/categories";
import { popularTools } from "@/data/tools";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<'categories' | 'popular' | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMouseEnter = (menuType: 'categories' | 'popular') => {
    setMegaMenuOpen(menuType);
  };

  const handleMouseLeave = () => {
    setMegaMenuOpen(null);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">ToolsHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-grow max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 relative">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('popular')}
            >
              <Link 
                href="/#popular-tools" 
                className="text-gray-700 hover:text-primary font-medium flex items-center"
              >
                Popular Tools
                <i className="fas fa-chevron-down text-xs ml-1"></i>
              </Link>
            </div>
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('categories')}
            >
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-primary font-medium flex items-center"
              >
                All Categories
                <i className="fas fa-chevron-down text-xs ml-1"></i>
              </Link>
            </div>
            <Link href="#" className="btn-primary">
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mega Menu - Desktop Only */}
      <div className="hidden md:block relative">
        <MegaMenu 
          isOpen={megaMenuOpen === 'categories'} 
          type="categories" 
          categories={categories} 
          popularTools={popularTools} 
          onClose={handleMouseLeave} 
        />
        <MegaMenu 
          isOpen={megaMenuOpen === 'popular'} 
          type="popular" 
          categories={categories} 
          popularTools={popularTools} 
          onClose={handleMouseLeave} 
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
