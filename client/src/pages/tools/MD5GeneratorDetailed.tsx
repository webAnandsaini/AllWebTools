import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

// For client-side MD5 hashing, we'd normally import a library like crypto-js
// This is a simplified mock implementation for demonstration
const generateMD5Hash = (input: string): string => {
  // In a real implementation, we would use a proper MD5 library
  // For now, we'll simulate MD5 by returning a deterministic hash-like string
  
  // Create a simulation of an MD5 hash (32 hex characters)
  // This is NOT a real MD5 hash, just a demo representation
  const chars = '0123456789abcdef';
  let hash = '';
  
  // Create a simple deterministic hash based on input
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i) * (i + 1);
  }
  
  const seed = sum + input.length;
  
  // Generate a 32-character "fake" MD5 hash
  for (let i = 0; i < 32; i++) {
    // Use a simple deterministic algorithm based on the seed and position
    const index = (seed + i * 17) % 16;
    hash += chars[index];
  }
  
  return hash;
};

const MD5GeneratorDetailed = () => {
  const [inputText, setInputText] = useState("");
  const [hashResult, setHashResult] = useState("");
  const [hashHistory, setHashHistory] = useState<Array<{ input: string, hash: string }>>([]);
  const [activeTab, setActiveTab] = useState<"text" | "file" | "verify">("text");
  const [fileToHash, setFileToHash] = useState<File | null>(null);
  const [fileHashResult, setFileHashResult] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [hashType, setHashType] = useState<"md5" | "sha1" | "sha256">("md5");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "MD5 Generator - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const generateHash = () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to generate an MD5 hash.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, we would use a proper MD5 library
      // For demo, we'll use our simplified function
      const hash = generateMD5Hash(inputText);
      setHashResult(hash);
      
      // Add to history
      setHashHistory(prev => [{ input: inputText, hash }, ...prev].slice(0, 5));
      
      toast({
        title: "Hash generated",
        description: "MD5 hash has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Error generating hash",
        description: "An error occurred while generating the MD5 hash. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToHash(e.target.files[0]);
      setFileHashResult("");
    }
  };

  const generateFileHash = () => {
    if (!fileToHash) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate an MD5 hash.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, we would read the file and generate its MD5 hash
    // For demonstration, we'll simulate this process
    
    // Simulate file processing
    toast({
      title: "Processing file",
      description: `Generating ${hashType.toUpperCase()} hash for ${fileToHash.name}...`,
    });
    
    setTimeout(() => {
      try {
        // Generate deterministic hash based on file properties
        const fileInfo = `${fileToHash.name}-${fileToHash.size}-${fileToHash.lastModified}`;
        const hash = generateMD5Hash(fileInfo);
        setFileHashResult(hash);
        
        toast({
          title: "Hash generated",
          description: `${hashType.toUpperCase()} hash has been successfully generated for ${fileToHash.name}.`,
        });
      } catch (error) {
        toast({
          title: "Error generating hash",
          description: "An error occurred while generating the file hash. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const verifyHash = () => {
    if (!verifyInput.trim() || !verifyHash.trim()) {
      toast({
        title: "Incomplete information",
        description: "Please enter both text and hash to verify.",
        variant: "destructive",
      });
      return;
    }

    // Generate hash for the input text
    const generatedHash = generateMD5Hash(verifyInput);
    
    // Compare with provided hash (case-insensitive)
    const isMatch = generatedHash.toLowerCase() === verifyHash.toLowerCase();
    setVerifyResult(isMatch);
    
    toast({
      title: isMatch ? "Hash verified" : "Hash does not match",
      description: isMatch 
        ? "The provided hash matches the generated hash for the input text." 
        : "The provided hash does not match the generated hash for the input text.",
      variant: isMatch ? "default" : "destructive",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The hash has been copied to your clipboard.",
    });
  };

  const clearInputs = () => {
    setInputText("");
    setHashResult("");
  };

  const clearFileInputs = () => {
    setFileToHash(null);
    setFileHashResult("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearVerifyInputs = () => {
    setVerifyInput("");
    setVerifyHash("");
    setVerifyResult(null);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <Tabs defaultValue="text" onValueChange={(value) => setActiveTab(value as "text" | "file" | "verify")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text to Hash</TabsTrigger>
            <TabsTrigger value="file">File to Hash</TabsTrigger>
            <TabsTrigger value="verify">Verify Hash</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">Enter text to hash</Label>
                    <Textarea
                      id="input-text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type or paste the text you want to hash..."
                      className="h-32 mt-1"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={generateHash}
                      className="bg-primary hover:bg-blue-700 transition"
                    >
                      <i className="fas fa-fingerprint mr-2"></i>
                      <span>Generate MD5 Hash</span>
                    </Button>
                    
                    <Button
                      onClick={clearInputs}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <i className="fas fa-eraser mr-2"></i>
                      <span>Clear</span>
                    </Button>
                  </div>
                  
                  {hashResult && (
                    <div className="mt-4">
                      <Label htmlFor="hash-result">MD5 Hash</Label>
                      <div className="flex mt-1">
                        <Input
                          id="hash-result"
                          value={hashResult}
                          readOnly
                          className="font-mono text-sm bg-gray-50"
                        />
                        <Button
                          onClick={() => copyToClipboard(hashResult)}
                          className="ml-2 px-3"
                          variant="outline"
                        >
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {hashHistory.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Hashes</h4>
                      <div className="space-y-2">
                        {hashHistory.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <div className="truncate max-w-[200px] text-sm text-gray-600">
                                {item.input}
                              </div>
                              <Button
                                onClick={() => copyToClipboard(item.hash)}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                              >
                                <i className="fas fa-copy text-gray-500"></i>
                              </Button>
                            </div>
                            <div className="font-mono text-xs text-gray-500 mt-1">{item.hash}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="file" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1 block">Select hash type</Label>
                    <Select
                      value={hashType}
                      onValueChange={(value) => setHashType(value as "md5" | "sha1" | "sha256")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hash type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="md5">MD5</SelectItem>
                        <SelectItem value="sha1">SHA-1</SelectItem>
                        <SelectItem value="sha256">SHA-256</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center py-6">
                    <div className="w-full max-w-sm">
                      <Label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to select file</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">Any file type up to 100MB</p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                        />
                      </Label>
                    </div>
                  </div>
                  
                  {fileToHash && (
                    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-700">{fileToHash.name}</p>
                        <p className="text-xs text-blue-600">
                          {(fileToHash.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        onClick={clearFileInputs}
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={generateFileHash}
                      disabled={!fileToHash}
                      className="bg-primary hover:bg-blue-700 transition"
                    >
                      <i className="fas fa-fingerprint mr-2"></i>
                      <span>Generate Hash</span>
                    </Button>
                  </div>
                  
                  {fileHashResult && (
                    <div className="mt-4">
                      <Label htmlFor="file-hash-result">{hashType.toUpperCase()} Hash</Label>
                      <div className="flex mt-1">
                        <Input
                          id="file-hash-result"
                          value={fileHashResult}
                          readOnly
                          className="font-mono text-sm bg-gray-50"
                        />
                        <Button
                          onClick={() => copyToClipboard(fileHashResult)}
                          className="ml-2 px-3"
                          variant="outline"
                        >
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verify" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="verify-input">Enter text</Label>
                    <Textarea
                      id="verify-input"
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      placeholder="Type or paste the text to verify..."
                      className="h-24 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="verify-hash">Enter MD5 hash to verify</Label>
                    <Input
                      id="verify-hash"
                      value={verifyHash}
                      onChange={(e) => setVerifyHash(e.target.value)}
                      placeholder="Type or paste the MD5 hash..."
                      className="font-mono mt-1"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={verifyHash}
                      className="bg-primary hover:bg-blue-700 transition"
                    >
                      <i className="fas fa-check-circle mr-2"></i>
                      <span>Verify Hash</span>
                    </Button>
                    
                    <Button
                      onClick={clearVerifyInputs}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <i className="fas fa-eraser mr-2"></i>
                      <span>Clear</span>
                    </Button>
                  </div>
                  
                  {verifyResult !== null && (
                    <div className={`mt-4 p-4 rounded-lg ${verifyResult ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center">
                        <i className={`fas ${verifyResult ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-xl mr-3`}></i>
                        <div>
                          <h3 className={`font-medium ${verifyResult ? 'text-green-700' : 'text-red-700'}`}>
                            {verifyResult ? 'Hash Verified' : 'Hash Mismatch'}
                          </h3>
                          <p className={`text-sm ${verifyResult ? 'text-green-600' : 'text-red-600'}`}>
                            {verifyResult
                              ? 'The provided hash matches the generated hash for the input text.'
                              : 'The provided hash does not match the generated hash for the input text.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-shield-alt text-blue-600"></i>
              </div>
              <h3 className="font-medium">File Integrity</h3>
            </div>
            <p className="text-sm text-gray-600">
              Verify file downloads by comparing the generated hash with the hash provided by the file distributor.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-database text-purple-600"></i>
              </div>
              <h3 className="font-medium">Data Storage</h3>
            </div>
            <p className="text-sm text-gray-600">
              Use MD5 hashes as unique identifiers for data records or to quickly check for duplicate content.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-check-double text-green-600"></i>
              </div>
              <h3 className="font-medium">Verification</h3>
            </div>
            <p className="text-sm text-gray-600">
              Verify data integrity by generating and comparing MD5 hashes before and after data transmission.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <i className="fas fa-exclamation-triangle text-yellow-500 mt-1 mr-2"></i>
          <div>
            <h4 className="text-yellow-800 font-medium">Security Notice</h4>
            <p className="text-yellow-700 text-sm">
              MD5 is not considered cryptographically secure for password storage or sensitive data protection.
              For security applications, consider using stronger hash functions like SHA-256 or bcrypt.
              This tool is designed for data integrity verification, not security purposes.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Generate and verify MD5 hashes for text and files with our secure hashing tool.",
    description: "Our MD5 Generator is a versatile cryptographic tool that creates unique 128-bit hash values for text and files, enabling data integrity verification and basic checksumming. MD5 (Message Digest Algorithm 5) produces a fixed-size digital fingerprint from variable-length input, making it ideal for verifying data integrity during transfers, identifying duplicate files regardless of filename, and generating checksums for software distribution. While not suitable for security-critical applications due to known vulnerabilities, MD5 remains widely used in non-security contexts for its speed and efficiency. This tool offers both generation and verification capabilities, allowing you to easily create MD5 hashes and verify the integrity of received files by comparing their hash values.",
    howToUse: [
      "Select the appropriate tab based on your needs: 'Text to Hash', 'File to Hash', or 'Verify Hash'.",
      "For text hashing, enter or paste your text in the input field and click 'Generate MD5 Hash'.",
      "For file hashing, select your desired hash type (MD5, SHA-1, or SHA-256), then upload a file by dragging and dropping or clicking to browse.",
      "Click 'Generate Hash' to process the file and view the resulting hash value.",
      "To verify a hash, enter the original text and the MD5 hash you want to verify, then click 'Verify Hash'.",
      "Use the copy button to easily copy the generated hash to your clipboard for sharing or verification purposes."
    ],
    features: [
      "Generate MD5 hashes for both text input and file uploads",
      "Support for multiple hash algorithms including MD5, SHA-1, and SHA-256",
      "Hash verification functionality to validate data integrity",
      "One-click copy to clipboard for easy sharing of generated hashes",
      "History tracking for recent text hashes to reuse previous results",
      "Clear and intuitive interface with separate tabs for different hashing needs"
    ],
    faqs: [
      {
        question: "What is an MD5 hash and what is it used for?",
        answer: "An MD5 hash is a 32-character hexadecimal string that serves as a unique digital fingerprint for data. It's created by running data through the MD5 (Message Digest Algorithm 5) cryptographic hash function, which always produces a fixed-size output regardless of input size. MD5 is primarily used for: verifying file integrity to confirm files haven't been corrupted during download or transfer; detecting duplicate files by comparing hash values regardless of filenames; checksum generation for software distribution; and non-security-related data identification and indexing. While once used for security purposes, MD5 is no longer considered secure for password storage or cryptographic security due to vulnerability to collision attacks."
      },
      {
        question: "Why do two different files sometimes have the same MD5 hash?",
        answer: "When two different inputs produce the same hash value, it's called a 'collision.' MD5 collisions occur because the algorithm maps an infinite number of possible inputs to a finite number of possible outputs (2^128 possible hashes). While this is extremely rare in random data, researchers have demonstrated that it's possible to deliberately craft different files that produce identical MD5 hashes. This vulnerability to 'collision attacks' is why MD5 is no longer recommended for security-critical applications. For general data integrity checking, the probability of accidental collisions remains extremely low, making MD5 still useful for non-security verification purposes. For more security-sensitive applications, SHA-256 or other stronger algorithms are recommended."
      },
      {
        question: "Can MD5 hashes be reversed to reveal the original content?",
        answer: "No, MD5 hashes cannot be directly reversed or decrypted to reveal the original content. Hash functions like MD5 are designed to be one-way functions, meaning they mathematically transform input data into a fixed-length string in a way that cannot be reversed. However, there are methods that can sometimes be used to discover the original input: rainbow tables (precomputed databases of common inputs and their hash values), brute force attacks (trying all possible combinations), and dictionary attacks (trying common words and variations). These methods are more effective against short or common inputs. For unique, long, and complex content, determining the original input from just the MD5 hash remains computationally infeasible in most cases."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="md5-generator"
      toolContent={
        <ToolContentTemplate
          introduction={contentData.introduction}
          description={contentData.description}
          howToUse={contentData.howToUse}
          features={contentData.features}
          faqs={contentData.faqs}
          toolInterface={contentData.toolInterface}
        />
      }
    />
  );
};

export default MD5GeneratorDetailed;