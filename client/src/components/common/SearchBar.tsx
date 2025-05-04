import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { allTools } from "@/data/tools";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof allTools>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      setIsFocused(false);
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
      <div className={`relative flex items-center transition-all duration-200 rounded-full ${isFocused ? 'shadow-md' : 'shadow-sm'}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for tools..."
          className={`w-full pl-10 pr-4 py-2.5 rounded-full border ${isFocused ? 'border-indigo-200' : 'border-gray-200'} focus:outline-none`}
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2) setShowResults(true);
          }}
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          <i className="fas fa-search"></i>
        </div>

        {query.length > 0 && (
          <button
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => {
              setQuery("");
              setShowResults(false);
              inputRef.current?.focus();
            }}
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-[400px] overflow-y-auto">
          <div className="p-3 border-b border-gray-100 flex items-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Results ({results.length})</span>
          </div>

          {results.map((tool) => (
            <div
              key={tool.id}
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center transition-colors"
              onClick={() => navigateToTool(tool.slug)}
            >
              <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center mr-3`}>
                <i className={`${tool.icon} ${tool.iconColor}`}></i>
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
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-8 px-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <p className="text-gray-500 font-medium">No tools found matching "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">Try using different keywords or checking the categories</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
