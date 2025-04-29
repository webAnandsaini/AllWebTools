import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo-900 opacity-20 -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-indigo-900 opacity-20 translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        {/* Top Section with Logo and Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 pb-16 border-b border-slate-700/50">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-gradient-bright text-3xl font-bold tracking-tight">ToolsHub</h3>
            </Link>
            <p className="mb-8 text-slate-400 max-w-md text-base leading-relaxed">
              All-in-one platform with 300+ free online tools to help you solve everyday digital tasks and challenges.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-11 h-11 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-md">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-md">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-md">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-11 h-11 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-300 shadow-md">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-white text-lg font-semibold mb-6 border-b border-slate-700/30 pb-2">Popular Categories</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/categories/text-analysis" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Text Analysis Tools</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/ai-writing" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>AI Writing Generators</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/design-studio" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Design Studio</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/images-editing" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Images Editing Tools</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/pdf-tools" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>PDF Tools</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories/seo-tools" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>SEO Tools</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-6 border-b border-slate-700/30 pb-2">Popular Tools</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/tools/plagiarism-checker" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Plagiarism Checker</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/image-compressor" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Image Compressor</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/pdf-to-word" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>PDF to Word</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/word-counter" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Word Counter</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/grammar-checker" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Grammar Checker</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tools/qr-code-generator" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>QR Code Generator</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white text-lg font-semibold mb-6 border-b border-slate-700/30 pb-2">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Contact</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-300 transition-colors group flex items-center">
                    <i className="fas fa-angle-right text-xs mr-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"></i>
                    <span>Blog</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">© {new Date().getFullYear()} ToolsHub. All rights reserved.</p>
          <div className="mt-6 md:mt-0 flex flex-wrap gap-x-8 gap-y-3">
            <a href="#" className="text-slate-400 hover:text-indigo-300 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-300 transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-indigo-300 transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
