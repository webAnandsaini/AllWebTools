import { Link } from "wouter";
import { recentTools } from "@/data/tools";

const RecentTools = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Recently Added Tools</h2>
          <Link href="/categories" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentTools.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col">
              <div className={`w-12 h-12 rounded-lg ${tool.iconBg} flex items-center justify-center mb-4`}>
                <i className={`${tool.icon} ${tool.iconColor} text-xl`}></i>
              </div>
              <div className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-3">New</div>
              <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm flex-grow">{tool.description}</p>
              <div className="flex items-center mt-4 text-sm text-primary font-medium">
                <span>Use Tool</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentTools;
