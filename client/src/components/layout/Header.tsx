import { useState } from "react";
import { Link } from "wouter";
import SearchBar from "@/components/common/SearchBar";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/#popular-tools" className="text-gray-700 hover:text-primary font-medium">
              Popular Tools
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary font-medium">
              All Categories
            </Link>
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

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
