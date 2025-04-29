import { useState, useEffect } from "react";
import { Link } from "wouter";
import SearchBar from "@/components/common/SearchBar";
import MobileMenu from "./MobileMenu";
import MegaMenu from "./MegaMenu";
import { categories } from "@/data/categories";
import { popularTools } from "@/data/tools";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<'categories' | 'popular' | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-gradient text-2xl font-bold tracking-tight">ToolsHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-grow max-w-xl mx-6">
            <SearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('popular')}
            >
              <button 
                className="text-gray-700 hover:text-primary font-medium flex items-center transition-colors"
              >
                Popular Tools
                <i className="fas fa-chevron-down text-xs ml-1 transition-transform duration-200"></i>
              </button>
            </div>
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('categories')}
            >
              <button 
                className="text-gray-700 hover:text-primary font-medium flex items-center transition-colors"
              >
                All Categories
                <i className="fas fa-chevron-down text-xs ml-1 transition-transform duration-200"></i>
              </button>
            </div>
            <Link href="#" className="btn-primary">
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pt-3 pb-2">
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
