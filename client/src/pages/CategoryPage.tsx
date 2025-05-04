import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import CategoryToolCard from "@/components/common/CategoryToolCard";
import { categories } from "@/data/categories";
import { Category } from "@/data/categories";

const CategoryPage = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState<Category | null>(null);

  useEffect(() => {
    // Find the category data based on the slug from the URL
    const foundCategory = categories.find((c) => c.slug === category);

    if (foundCategory) {
      setCategoryData(foundCategory);
      document.title = `${foundCategory.name} - AllTooly`;
    }

    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, [category]);

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">We couldn't find the category you were looking for.</p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-4">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">{categoryData.name}</h1>
          <p className="text-gray-600 mt-2">{categoryData.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categoryData.tools.map((tool) => (
            <CategoryToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
