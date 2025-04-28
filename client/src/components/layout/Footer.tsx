import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ToolsHub</h3>
            <p className="mb-4">All-in-one platform with 300+ free online tools to help you solve everyday problems.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/categories/text-analysis" className="hover:text-white transition">Text Analysis Tools</Link></li>
              <li><Link href="/categories/ai-writing" className="hover:text-white transition">AI Writing Generators</Link></li>
              <li><Link href="/categories/design-studio" className="hover:text-white transition">Design Studio</Link></li>
              <li><Link href="/categories/images-editing" className="hover:text-white transition">Images Editing Tools</Link></li>
              <li><Link href="/categories/pdf-tools" className="hover:text-white transition">PDF Tools</Link></li>
              <li><Link href="/categories/seo-tools" className="hover:text-white transition">SEO Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/plagiarism-checker" className="hover:text-white transition">Plagiarism Checker</Link></li>
              <li><Link href="/tools/image-compressor" className="hover:text-white transition">Image Compressor</Link></li>
              <li><Link href="/tools/pdf-to-word" className="hover:text-white transition">PDF to Word</Link></li>
              <li><Link href="/tools/word-counter" className="hover:text-white transition">Word Counter</Link></li>
              <li><Link href="/tools/grammar-checker" className="hover:text-white transition">Grammar Checker</Link></li>
              <li><Link href="/tools/qr-code-generator" className="hover:text-white transition">QR Code Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} ToolsHub. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white mx-2 transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white mx-2 transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white mx-2 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
