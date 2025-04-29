import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12 pb-12 border-b border-slate-800">
          <div className="lg:w-1/3">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-gradient text-2xl font-bold tracking-tight">ToolsHub</h3>
            </Link>
            <p className="mb-6 text-slate-400 max-w-md">
              All-in-one platform with 300+ free online tools to help you solve everyday digital tasks and challenges.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Popular Categories</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/categories/text-analysis" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Text Analysis Tools
                  </Link>
                </li>
                <li>
                  <Link href="/categories/ai-writing" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    AI Writing Generators
                  </Link>
                </li>
                <li>
                  <Link href="/categories/design-studio" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Design Studio
                  </Link>
                </li>
                <li>
                  <Link href="/categories/images-editing" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Images Editing Tools
                  </Link>
                </li>
                <li>
                  <Link href="/categories/pdf-tools" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    PDF Tools
                  </Link>
                </li>
                <li>
                  <Link href="/categories/seo-tools" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    SEO Tools
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Popular Tools</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/tools/plagiarism-checker" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Plagiarism Checker
                  </Link>
                </li>
                <li>
                  <Link href="/tools/image-compressor" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Image Compressor
                  </Link>
                </li>
                <li>
                  <Link href="/tools/pdf-to-word" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    PDF to Word
                  </Link>
                </li>
                <li>
                  <Link href="/tools/word-counter" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Word Counter
                  </Link>
                </li>
                <li>
                  <Link href="/tools/grammar-checker" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Grammar Checker
                  </Link>
                </li>
                <li>
                  <Link href="/tools/qr-code-generator" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    QR Code Generator
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    <i className="fas fa-chevron-right text-xs mr-2 text-indigo-500"></i>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} ToolsHub. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
