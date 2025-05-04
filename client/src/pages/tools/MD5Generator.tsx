import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const MD5Generator = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = "MD5 Generator - AllTooly";
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset result when text changes
    if (result) {
      setResult("");
    }
  };

  const generateMD5 = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to generate an MD5 hash.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest("POST", "/api/text/md5-generate", { text });
      const data = await response.json();
      setResult(data.hash);
    } catch (error) {
      toast({
        title: "Error generating MD5 hash",
        description: "An error occurred while generating the MD5 hash. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearText = () => {
    setText("");
    setResult("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "MD5 hash copied to clipboard.",
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">MD5 Generator</h1>
              <p className="text-gray-600">Generate MD5 hash from text for security and verification purposes.</p>
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
                  <Textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Type or paste your text here to generate MD5 hash..."
                    className="w-full h-40 p-4 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Button
                  onClick={generateMD5}
                  disabled={isGenerating || !text.trim()}
                  className="bg-primary hover:bg-blue-700 transition flex items-center"
                >
                  <i className="fas fa-shield-alt mr-2"></i>
                  <span>{isGenerating ? "Generating..." : "Generate MD5"}</span>
                </Button>

                <Button
                  onClick={clearText}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <i className="fas fa-eraser mr-2"></i>
                  <span>Clear Text</span>
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Generated MD5 Hash</h3>

              {result ? (
                <div>
                  <div className="relative">
                    <Input
                      type="text"
                      value={result}
                      readOnly
                      className="pr-12 font-mono text-sm bg-white"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                      aria-label="Copy to clipboard"
                    >
                      <i className="far fa-copy"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    The MD5 hash is a 32-character hexadecimal number representing your input text.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-shield-alt text-3xl mb-2 text-gray-300"></i>
                  <p>Your MD5 hash will appear here</p>
                </div>
              )}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-lg mb-3">What is MD5?</h3>
              <p className="text-gray-700 mb-3">
                MD5 (Message Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, typically expressed as a 32-character hexadecimal number.
              </p>
              <p className="text-gray-700 mb-3">
                While MD5 is commonly used for verifying data integrity and storing passwords, it's important to note that it's no longer considered secure for cryptographic purposes due to vulnerabilities.
              </p>
              <p className="text-gray-700">
                Use cases include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                <li>Verifying file integrity</li>
                <li>Checking for duplicate files</li>
                <li>Creating unique identifiers for data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MD5Generator;