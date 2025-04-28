import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { allTools } from "@/data/tools";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof allTools>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const filtered = allTools.filter((tool) =>
        tool.name.toLowerCase().includes(value.toLowerCase()) ||
        tool.description.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToTool = (slug: string) => {
    setShowResults(false);
    setQuery("");
    navigate(`/tools/${slug}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        placeholder="Search for tools..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        value={query}
        onChange={handleSearch}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />
      <div className="absolute left-3 top-2.5 text-gray-400">
        <i className="fas fa-search"></i>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {results.map((tool) => (
            <div
              key={tool.id}
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
              onClick={() => navigateToTool(tool.slug)}
            >
              <div className={`w-8 h-8 rounded-lg ${tool.iconBg} flex items-center justify-center mr-3`}>
                <i className={`${tool.icon} ${tool.iconColor} text-sm`}></i>
              </div>
              <div>
                <h4 className="font-medium">{tool.name}</h4>
                <p className="text-xs text-gray-500">{tool.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center">
          <p className="text-gray-500">No tools found matching "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
