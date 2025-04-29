import React from "react";

const LoadingFallback = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">Loading tool...</p>
    </div>
  );
};

export default LoadingFallback;