const ToolDemo = () => {
  return (
    <section id="tool-demo" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Tool Preview</h2>
        <p className="text-gray-600 mb-8">Here's how a tool page looks like</p>

        {/* Tool Page Example */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Plagiarism Checker</h1>
            <p className="text-gray-600">Check your content for plagiarism and ensure it's original.</p>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
                <textarea 
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" 
                  placeholder="Paste your text here to check for plagiarism..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center">
                <i className="fas fa-search mr-2"></i>
                <span>Check Plagiarism</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                <i className="fas fa-upload mr-2"></i>
                <span>Upload File</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear Text</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">Results</h3>
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500">
                <i className="fas fa-search text-4xl mb-3"></i>
                <p>Your plagiarism check results will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolDemo;
