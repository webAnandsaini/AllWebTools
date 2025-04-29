const Features = () => {
  const features = [
    {
      id: 1,
      icon: "fas fa-bolt",
      title: "Lightning Fast",
      description: "Our tools are optimized for speed and efficiency, saving you valuable time on every task.",
      color: "pink-purple",
    },
    {
      id: 2,
      icon: "fas fa-check-circle",
      title: "Easy to Use",
      description: "Simple, intuitive interfaces that anyone can use without a learning curve.",
      color: "blue-indigo",
    },
    {
      id: 3,
      icon: "fas fa-lock",
      title: "Secure & Private",
      description: "Your data stays private. We don't store your content after processing.",
      color: "purple-indigo",
    },
    {
      id: 4,
      icon: "fas fa-magic",
      title: "All-in-One Solution",
      description: "Access over 300 different tools in one place, all free to use.",
      color: "teal-blue",
    },
    {
      id: 5,
      icon: "fas fa-sync",
      title: "Regular Updates",
      description: "We're constantly adding new tools and improving existing ones.",
      color: "indigo-violet",
    },
    {
      id: 6,
      icon: "fas fa-mobile-alt",
      title: "Mobile Friendly",
      description: "All tools are fully responsive and work on any device, anywhere.",
      color: "orange-pink",
    },
  ];

  const getGradientClasses = (color: string) => {
    switch (color) {
      case "pink-purple":
        return "from-pink-500 to-purple-600";
      case "blue-indigo":
        return "from-blue-500 to-indigo-600";
      case "purple-indigo":
        return "from-purple-500 to-indigo-600";
      case "teal-blue":
        return "from-teal-400 to-blue-500";
      case "indigo-violet":
        return "from-indigo-500 to-violet-600";
      case "orange-pink":
        return "from-orange-400 to-pink-500";
      default:
        return "from-indigo-500 to-violet-600";
    }
  };

  return (
    <section className="py-24 bg-[#f5f7ff] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full translate-y-1/3 -translate-x-1/4 opacity-70"></div>
        
        {/* Small decorative elements */}
        <div className="absolute top-24 right-16 animate-float w-6 h-6 rounded-full bg-pink-100 opacity-60"></div>
        <div className="absolute bottom-32 left-16 animate-float-slow w-8 h-8 rounded-full bg-violet-100 opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 animate-float-slow w-10 h-10 rounded-full bg-indigo-100 opacity-60"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Why Choose <span className="text-gradient">ToolsHub</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Our platform offers a comprehensive collection of tools designed to make your online tasks easier and more efficient
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden border border-gray-50">
              {/* Gradient background with reduced opacity */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
              
              {/* Icon with gradient background */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClasses(feature.color)} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transform transition-transform duration-300`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              
              {/* Feature content */}
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
