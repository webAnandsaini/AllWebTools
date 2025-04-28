const Features = () => {
  const features = [
    {
      id: 1,
      icon: "fas fa-bolt",
      title: "Fast & Efficient",
      description: "Our tools are optimized for speed and efficiency, saving you valuable time.",
      color: "blue",
    },
    {
      id: 2,
      icon: "fas fa-check-circle",
      title: "Easy to Use",
      description: "Simple, intuitive interfaces that anyone can use without a learning curve.",
      color: "green",
    },
    {
      id: 3,
      icon: "fas fa-lock",
      title: "Secure & Private",
      description: "Your data stays private. We don't store your content after processing.",
      color: "purple",
    },
    {
      id: 4,
      icon: "fas fa-tools",
      title: "All-in-One Solution",
      description: "Access over 100 different tools in one place, all free to use.",
      color: "yellow",
    },
    {
      id: 5,
      icon: "fas fa-sync",
      title: "Regular Updates",
      description: "We're constantly adding new tools and improving existing ones.",
      color: "red",
    },
    {
      id: 6,
      icon: "fas fa-mobile-alt",
      title: "Mobile Friendly",
      description: "All tools are fully responsive and work on any device.",
      color: "indigo",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-primary";
      case "green":
        return "bg-green-100 text-green-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      case "red":
        return "bg-red-100 text-red-600";
      case "indigo":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose ToolsHub</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers a comprehensive collection of tools designed to make your online tasks easier and more efficient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className={`w-12 h-12 rounded-full ${getColorClasses(feature.color)} flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
