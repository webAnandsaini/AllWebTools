import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-white">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-indigo-50 to-blue-50 opacity-50"></div>
        <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-indigo-100 opacity-60"></div>
        <div className="absolute -left-20 top-1/2 w-72 h-72 rounded-full bg-blue-100 opacity-60"></div>
        <div className="absolute right-10 bottom-10 w-48 h-48 rounded-full bg-purple-100 opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text content */}
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
              <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-5">
                300+ Tools for every need
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                All-in-One <span className="text-gradient">Online Tools</span> for Everyone
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Free and powerful online utilities to help you with text analysis, design, image editing, SEO, development and much more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#popular-tools" className="btn-primary">
                  <i className="fas fa-tools mr-2"></i>
                  Explore Popular Tools
                </Link>
                <Link href="#all-categories" className="btn-secondary">
                  <i className="fas fa-th-large mr-2"></i>
                  View All Categories
                </Link>
              </div>
            </div>
            
            {/* Decorative Image */}
            <div className="lg:w-1/2 relative">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl -rotate-6 opacity-20"></div>
                <div className="absolute top-10 -right-5 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl rotate-12 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 z-10">
                  <div className="grid grid-cols-3 gap-4 p-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                        <i className={`fas fa-${getIcon(i)} text-${getColor(i)}-500 text-2xl`}></i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-auto">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 64L60 58.7C120 53 240 43 360 48.3C480 53 600 75 720 69.7C840 64 960 32 1080 21.3C1200 11 1320 21 1380 26.7L1440 32V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V64Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
  );
};

// Helper functions to get icon and color for decorative grid
function getIcon(index: number): string {
  const icons = ["font", "image", "chart-bar", "search", "globe", "code", "key", "lock", "file-pdf"];
  return icons[index - 1];
}

function getColor(index: number): string {
  const colors = ["indigo", "blue", "purple", "green", "yellow", "red", "pink", "orange", "teal"];
  return colors[index - 1];
}

export default Hero;
