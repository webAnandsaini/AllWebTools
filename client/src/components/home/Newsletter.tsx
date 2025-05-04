import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Here we would typically send this to an API
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter",
    });

    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 -z-10">
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-bl from-blue-100 to-indigo-100 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-14 max-w-5xl mx-auto relative overflow-hidden border border-gray-100">
          {/* Decorative corner gradients */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br from-indigo-100 to-transparent rounded-full opacity-30"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gradient-to-tl from-purple-100 to-transparent rounded-full opacity-30"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center relative z-10">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold mb-6 relative">
                <span className="relative">
                  Stay Updated with
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full min-w-24 max-w-48"></div>
                </span>
                <span className="block mt-1 text-gradient">New Tools</span>
              </h2>

              <p className="text-gray-600 mb-6 text-lg">
                Subscribe to our newsletter to get notified when we release new tools and features. We send updates twice a month.
              </p>

              <ul className="space-y-3 mb-8">
                {["New tool announcements", "Tips & tutorials", "Early access to beta features"].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-white py-6 px-4 sm:p-8 rounded-2xl shadow-sm border border-indigo-50">
                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center py-3.5 rounded-xl shadow-md"
                >
                  <i className="fas fa-envelope-open-text mr-2"></i>
                  Subscribe Now
                </button>
                <p className="text-xs text-gray-500 mt-4 text-center">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
