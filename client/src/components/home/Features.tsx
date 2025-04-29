const Features = () => {
  const features = [
    {
      id: 1,
      icon: "fas fa-bolt",
      title: "Lightning Fast",
      description: "Our tools are optimized for speed and efficiency, saving you valuable time on every task.",
      color: "indigo",
    },
    {
      id: 2,
      icon: "fas fa-check-circle",
      title: "Easy to Use",
      description: "Simple, intuitive interfaces that anyone can use without a learning curve.",
      color: "blue",
    },
    {
      id: 3,
      icon: "fas fa-lock",
      title: "Secure & Private",
      description: "Your data stays private. We don't store your content after processing.",
      color: "violet",
    },
    {
      id: 4,
      icon: "fas fa-magic",
      title: "All-in-One Solution",
      description: "Access over 300 different tools in one place, all free to use.",
      color: "purple",
    },
    {
      id: 5,
      icon: "fas fa-sync",
      title: "Regular Updates",
      description: "We're constantly adding new tools and improving existing ones.",
      color: "teal",
    },
    {
      id: 6,
      icon: "fas fa-mobile-alt",
      title: "Mobile Friendly",
      description: "All tools are fully responsive and work on any device, anywhere.",
      color: "cyan",
    },
  ];

  const getGradientClasses = (color: string) => {
    switch (color) {
      case "indigo":
        return "from-indigo-500 to-indigo-600";
      case "blue":
        return "from-blue-500 to-blue-600";
      case "violet":
        return "from-violet-500 to-violet-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "teal":
        return "from-teal-500 to-teal-600";
      case "cyan":
        return "from-cyan-500 to-cyan-600";
      default:
        return "from-indigo-500 to-indigo-600";
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full translate-y-1/3 -translate-x-1/4 opacity-70"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="section-title">Why Choose ToolsHub</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Our platform offers a comprehensive collection of tools designed to make your online tasks easier and more efficient
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="rf-card p-6 hover:-translate-y-2 transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradientClasses(feature.color)} text-white flex items-center justify-center mb-6 shadow-lg`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
