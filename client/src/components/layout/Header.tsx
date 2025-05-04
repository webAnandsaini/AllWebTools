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
          ? 'bg-white shadow-md py-3'
          : 'bg-white/90 backdrop-blur-md py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="h-9 w-9 relative mr-2">
                <div className="absolute w-full h-full bg-violet-500 opacity-80 rounded-md rotate-45"></div>
                <div className="absolute w-full h-full flex items-center justify-center">
                  <i className="fas fa-tools text-white"></i>
                </div>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 text-2xl font-bold tracking-tight">AllTooly</span>
            </div>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center ml-10 space-x-1">
            <div className="relative group">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-md hover:bg-gray-50 transition-colors">
                Home
              </Link>
            </div>

            <div className="relative group" onMouseEnter={() => handleMouseEnter('popular')}>
              <button className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center">
                Popular Tools
                <i className={`fas fa-chevron-down text-xs ml-2 transition-transform duration-200 ${megaMenuOpen === 'popular' ? 'rotate-180' : ''}`}></i>
              </button>
            </div>

            <div className="relative group" onMouseEnter={() => handleMouseEnter('categories')}>
              <button className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center">
                All Categories
                <i className={`fas fa-chevron-down text-xs ml-2 transition-transform duration-200 ${megaMenuOpen === 'categories' ? 'rotate-180' : ''}`}></i>
              </button>
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block lg:block flex-grow max-w-lg ml-6">
            <SearchBar />
          </div>

          {/* Right Nav with Sign-in and Free Trial - Desktop */}
          {/* <div className="hidden md:flex items-center space-x-3">
            <Link href="#" className="px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Sign in
            </Link>
            <Link href="#" className="btn-primary px-5 py-2.5 rounded-full text-sm font-medium">
              Try for Free
            </Link>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`${mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pt-3 pb-1">
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
      <MobileMenu isOpen={mobileMenuOpen} isScroll={scrolled} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
