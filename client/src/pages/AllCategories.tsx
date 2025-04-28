import { useEffect } from "react";
import { Link } from "wouter";
import { categories } from "@/data/categories";

const AllCategories = () => {
  useEffect(() => {
    document.title = "All Categories - ToolsHub";
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-4">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">All Categories</h1>
          <p className="text-gray-600 mt-2">Browse all tool categories available on ToolsHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-lg ${category.iconBg} flex items-center justify-center mb-4`}>
                <i className={`${category.icon} ${category.iconColor} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{category.tools.length} tools</span>
                <span className="text-sm text-primary font-medium">View Category</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
