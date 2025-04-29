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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 skew-y-3 -translate-y-20 -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h2 className="text-3xl font-bold mb-4">Stay Updated with New Tools</h2>
              <p className="text-gray-600 mb-4">
                Subscribe to our newsletter to get notified when we release new tools and features. We send updates twice a month.
              </p>
              
              <ul className="space-y-2 mb-6">
                {["New tool announcements", "Tips & tutorials", "Early access to beta features"].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <i className="fas fa-check text-indigo-600 text-xs"></i>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <i className="fas fa-envelope-open-text mr-2"></i>
                  Subscribe Now
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
