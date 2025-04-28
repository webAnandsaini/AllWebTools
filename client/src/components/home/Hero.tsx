import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="bg-gradient-primary text-white py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">All-in-One Online Tools</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Free online tools to help you with text analysis, design, image editing, SEO, and more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#popular-tools" className="btn-secondary">
              Explore Popular Tools
            </Link>
            <Link href="#all-categories" className="btn-outline">
              View All Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
