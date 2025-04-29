import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const PasswordEncryptionUtilityDetailed = () => {
  const [activeTab, setActiveTab] = useState("encrypt");
  
  // Encrypt tab state
  const [textToEncrypt, setTextToEncrypt] = useState("");
  const [encryptionMethod, setEncryptionMethod] = useState("base64");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");
  
  // Decrypt tab state
  const [textToDecrypt, setTextToDecrypt] = useState("");
  const [decryptionMethod, setDecryptionMethod] = useState("base64");
  const [decryptionKey, setDecryptionKey] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");

  const { toast } = useToast();
  
  // Base64 Encoding/Decoding
  const encodeBase64 = (text: string): string => {
    try {
      return btoa(text);
    } catch (e) {
      toast({
        title: "Encoding Error",
        description: "Unable to encode text. Make sure it contains valid characters.",
        variant: "destructive"
      });
      return "";
    }
  };
  
  const decodeBase64 = (encoded: string): string => {
    try {
      return atob(encoded);
    } catch (e) {
      toast({
        title: "Decoding Error",
        description: "Unable to decode. The text might not be valid Base64.",
        variant: "destructive"
      });
      return "";
    }
  };
  
  // Simple XOR encryption/decryption with a key
  const xorEncryptDecrypt = (text: string, key: string): string => {
    if (!key) {
      toast({
        title: "Key Required",
        description: "XOR encryption requires a key.",
        variant: "destructive"
      });
      return "";
    }
    
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
  };
  
  // ROT13 encryption/decryption
  const rot13 = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        return String.fromCharCode(
          ((code - (code <= 90 ? 65 : 97) + 13) % 26) + (code <= 90 ? 65 : 97)
        );
      }
      return char;
    });
  };
  
  // Caesar cipher encryption/decryption
  const caesarCipher = (text: string, key: string, decrypt = false): string => {
    // Extract a number from the key, default to 3
    const shift = parseInt(key) || 3;
    const actualShift = decrypt ? (26 - (shift % 26)) : (shift % 26);
    
    return text.replace(/[a-zA-Z]/g, (char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // Uppercase
        return String.fromCharCode(((code - 65 + actualShift) % 26) + 65);
      } else if (code >= 97 && code <= 122) { // Lowercase
        return String.fromCharCode(((code - 97 + actualShift) % 26) + 97);
      }
      return char;
    });
  };
  
  // SHA-256 hashing (one-way)
  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };
  
  // Handle encryption
  const handleEncrypt = async () => {
    if (!textToEncrypt) {
      toast({
        title: "Text Required",
        description: "Please enter text to encrypt.",
        variant: "destructive"
      });
      return;
    }
    
    let result = "";
    
    try {
      switch (encryptionMethod) {
        case "base64":
          result = encodeBase64(textToEncrypt);
          break;
        case "xor":
          result = encodeBase64(xorEncryptDecrypt(textToEncrypt, encryptionKey));
          break;
        case "rot13":
          result = rot13(textToEncrypt);
          break;
        case "caesar":
          result = caesarCipher(textToEncrypt, encryptionKey);
          break;
        case "sha256":
          result = await sha256(textToEncrypt);
          break;
        default:
          result = encodeBase64(textToEncrypt);
      }
      
      setEncryptedResult(result);
      
      if (result) {
        toast({
          title: "Encryption Complete",
          description: `Your text has been ${encryptionMethod === "sha256" ? "hashed" : "encrypted"}.`
        });
      }
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: "An error occurred during encryption.",
        variant: "destructive"
      });
    }
  };
  
  // Handle decryption
  const handleDecrypt = async () => {
    if (!textToDecrypt) {
      toast({
        title: "Text Required",
        description: "Please enter text to decrypt.",
        variant: "destructive"
      });
      return;
    }
    
    if (decryptionMethod === "sha256") {
      toast({
        title: "Cannot Decrypt",
        description: "SHA-256 is a one-way hash function and cannot be decrypted.",
        variant: "destructive"
      });
      return;
    }
    
    let result = "";
    
    try {
      switch (decryptionMethod) {
        case "base64":
          result = decodeBase64(textToDecrypt);
          break;
        case "xor":
          result = xorEncryptDecrypt(decodeBase64(textToDecrypt), decryptionKey);
          break;
        case "rot13":
          result = rot13(textToDecrypt);
          break;
        case "caesar":
          result = caesarCipher(textToDecrypt, decryptionKey, true);
          break;
        default:
          result = decodeBase64(textToDecrypt);
      }
      
      setDecryptedResult(result);
      
      if (result) {
        toast({
          title: "Decryption Complete",
          description: "Your text has been decrypted."
        });
      }
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "An error occurred during decryption. Check if the input is valid for the selected method.",
        variant: "destructive"
      });
    }
  };
  
  // Copy result to clipboard
  const copyToClipboard = (text: string, action: "encrypt" | "decrypt") => {
    if (!text) {
      toast({
        title: "Nothing to Copy",
        description: `Please ${action} some text first.`,
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: "Text copied to clipboard!"
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy text to clipboard.",
          variant: "destructive"
        });
      });
  };
  
  // Clear input and result fields
  const clearFields = (action: "encrypt" | "decrypt") => {
    if (action === "encrypt") {
      setTextToEncrypt("");
      setEncryptionKey("");
      setEncryptedResult("");
    } else {
      setTextToDecrypt("");
      setDecryptionKey("");
      setDecryptedResult("");
    }
  };
  
  // Method requires key
  const methodRequiresKey = (method: string): boolean => {
    return method === "xor" || method === "caesar";
  };

  // Tool interface contains all UI elements
  const toolInterface = (
    <div className="space-y-6">
      <Tabs defaultValue="encrypt" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
        </TabsList>
        
        {/* Encrypt Tab */}
        <TabsContent value="encrypt" className="space-y-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="encryption-method">Encryption Method</Label>
                  <Select
                    value={encryptionMethod}
                    onValueChange={setEncryptionMethod}
                  >
                    <SelectTrigger id="encryption-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base64">Base64 Encoding</SelectItem>
                      <SelectItem value="xor">XOR Encryption</SelectItem>
                      <SelectItem value="rot13">ROT13 Cipher</SelectItem>
                      <SelectItem value="caesar">Caesar Cipher</SelectItem>
                      <SelectItem value="sha256">SHA-256 Hashing (one-way)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {encryptionMethod === "base64" && (
                    <p className="text-xs text-gray-500 mt-1">Base64 encoding is a binary-to-text encoding scheme, not true encryption.</p>
                  )}
                  
                  {encryptionMethod === "sha256" && (
                    <p className="text-xs text-gray-500 mt-1">SHA-256 is a one-way hash function. Once hashed, the original text cannot be recovered.</p>
                  )}
                </div>
                
                {methodRequiresKey(encryptionMethod) && (
                  <div className="space-y-2">
                    <Label htmlFor="encryption-key">
                      {encryptionMethod === "caesar" ? "Shift Value (Number)" : "Encryption Key"}
                    </Label>
                    <Input
                      id="encryption-key"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder={encryptionMethod === "caesar" ? "Enter a number (default: 3)" : "Enter your secret key"}
                      type={encryptionMethod === "caesar" ? "number" : "text"}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="text-to-encrypt">Text to Encrypt</Label>
                  <textarea
                    id="text-to-encrypt"
                    value={textToEncrypt}
                    onChange={(e) => setTextToEncrypt(e.target.value)}
                    placeholder="Enter text to encrypt"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={handleEncrypt} className="flex-1">
                    {encryptionMethod === "sha256" ? "Generate Hash" : "Encrypt"}
                  </Button>
                  <Button onClick={() => clearFields("encrypt")} variant="outline">
                    Clear
                  </Button>
                </div>
                
                {encryptedResult && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="encrypted-result">
                        {encryptionMethod === "sha256" ? "Hash Result" : "Encrypted Result"}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(encryptedResult, "encrypt")}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-sm font-mono break-all">
                      {encryptedResult}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Decrypt Tab */}
        <TabsContent value="decrypt" className="space-y-6 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="decryption-method">Decryption Method</Label>
                  <Select
                    value={decryptionMethod}
                    onValueChange={setDecryptionMethod}
                  >
                    <SelectTrigger id="decryption-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base64">Base64 Decoding</SelectItem>
                      <SelectItem value="xor">XOR Decryption</SelectItem>
                      <SelectItem value="rot13">ROT13 Cipher</SelectItem>
                      <SelectItem value="caesar">Caesar Cipher</SelectItem>
                      <SelectItem value="sha256">SHA-256 Hashing (not reversible)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {decryptionMethod === "sha256" && (
                    <p className="text-xs text-red-500 mt-1">
                      SHA-256 is a one-way hash function and cannot be decrypted. You can only verify if a specific input matches a hash.
                    </p>
                  )}
                </div>
                
                {methodRequiresKey(decryptionMethod) && (
                  <div className="space-y-2">
                    <Label htmlFor="decryption-key">
                      {decryptionMethod === "caesar" ? "Shift Value (Number)" : "Decryption Key"}
                    </Label>
                    <Input
                      id="decryption-key"
                      value={decryptionKey}
                      onChange={(e) => setDecryptionKey(e.target.value)}
                      placeholder={decryptionMethod === "caesar" ? "Enter the same shift value used for encryption" : "Enter the same key used for encryption"}
                      type={decryptionMethod === "caesar" ? "number" : "text"}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="text-to-decrypt">Text to Decrypt</Label>
                  <textarea
                    id="text-to-decrypt"
                    value={textToDecrypt}
                    onChange={(e) => setTextToDecrypt(e.target.value)}
                    placeholder="Enter text to decrypt"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDecrypt}
                    className="flex-1"
                    disabled={decryptionMethod === "sha256"}
                  >
                    Decrypt
                  </Button>
                  <Button onClick={() => clearFields("decrypt")} variant="outline">
                    Clear
                  </Button>
                </div>
                
                {decryptedResult && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="decrypted-result">Decrypted Result</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(decryptedResult, "decrypt")}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-sm font-mono break-all">
                      {decryptedResult}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Encryption Methods</h3>
          <div className="space-y-3 text-sm">
            <ul className="space-y-3">
              <li className="space-y-1">
                <span className="font-medium">Base64:</span>
                <p>A binary-to-text encoding scheme that represents binary data in an ASCII string format. Not true encryption as it can be easily reversed, but useful for transmitting data that needs to be stored and transferred over media that are designed to handle text.</p>
              </li>
              <li className="space-y-1">
                <span className="font-medium">XOR Encryption:</span>
                <p>A simple symmetric encryption algorithm that uses the XOR operation. The same key is used for both encryption and decryption. Security depends entirely on keeping the key secret.</p>
              </li>
              <li className="space-y-1">
                <span className="font-medium">ROT13:</span>
                <p>A simple letter substitution cipher that replaces a letter with the 13th letter after it in the alphabet. ROT13 is its own inverse; applying it twice will revert the text to its original form.</p>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Caesar Cipher:</span>
                <p>One of the simplest encryption techniques, named after Julius Caesar. It shifts each letter in the plaintext by a certain number of places down the alphabet. The shift value acts as the key.</p>
              </li>
              <li className="space-y-1">
                <span className="font-medium">SHA-256:</span>
                <p>A cryptographic hash function that produces a 256-bit (32-byte) hash value. It's a one-way function - once data is hashed, it cannot be unhashed. Used for securely storing passwords and verifying data integrity.</p>
              </li>
            </ul>
            <div className="bg-yellow-50 p-3 rounded-md mt-4">
              <p className="text-yellow-800">
                <span className="font-medium">Important Security Note:</span> The encryption methods provided here are for educational purposes and not recommended for encrypting sensitive data in production environments. For serious security applications, use established cryptographic libraries and consult with security professionals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="password-encryption-utility-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Secure your sensitive data with our versatile Password & Text Encryption Utility - a simple yet powerful tool for encryption and decryption."
          description="Our Password Encryption Utility offers multiple encryption and hashing methods to protect your sensitive information. Choose from Base64 encoding, XOR encryption, ROT13, Caesar cipher, or SHA-256 hashing to secure passwords, messages, and other confidential data. With an intuitive interface for both encryption and decryption, you can quickly transform plain text into encrypted formats and vice versa, all while keeping your data private within your browser."
          howToUse={[
            "Select the 'Encrypt' or 'Decrypt' tab based on your needs",
            "Choose your preferred encryption method from the dropdown menu",
            "For methods that require a key (XOR, Caesar), enter your secret key or shift value",
            "Enter the text you want to encrypt or decrypt in the input area",
            "Click the 'Encrypt' or 'Decrypt' button to process your data",
            "Copy the result to your clipboard with one click",
            "Clear all fields when finished for security"
          ]}
          features={[
            "Multiple encryption and hashing algorithms (Base64, XOR, ROT13, Caesar, SHA-256)",
            "Intuitive tabbed interface for encryption and decryption operations",
            "Key-based encryption options for added security",
            "One-way SHA-256 hashing for secure password storage",
            "One-click copy to clipboard functionality",
            "Client-side processing for maximum privacy",
            "Detailed explanations of each encryption method"
          ]}
          faqs={[
            {
              question: "Which encryption method should I use to protect sensitive data?",
              answer: "For truly sensitive data, SHA-256 is the most secure option offered by this tool, as it's a one-way hash function used in modern security applications. However, remember that once data is hashed with SHA-256, it cannot be decrypted - you can only verify if a specific input matches a hash. For recoverable encryption of highly sensitive data in real-world applications, consider using established cryptographic libraries with AES-256 or similar industry-standard algorithms."
            },
            {
              question: "Is my data secure when using this tool?",
              answer: "Yes. All encryption and decryption processes happen entirely in your browser - your data never leaves your device or gets transmitted to any server. However, the basic encryption methods provided (like XOR, ROT13, and Caesar) are primarily for educational purposes and not recommended for high-security needs."
            },
            {
              question: "What's the difference between encoding and encryption?",
              answer: "Encoding (like Base64) is a reversible transformation of data format, primarily designed for data usability and not for security. Anyone can decode it without a key. Encryption is a process designed specifically for security that transforms data using algorithms and keys, making it unreadable without the correct decryption key."
            },
            {
              question: "Why can't I decrypt my SHA-256 hash?",
              answer: "SHA-256 is a cryptographic hash function designed to be one-way. It mathematically transforms input data into a fixed-size string of characters, but this transformation cannot be reversed. This property makes it ideal for storing passwords securely - when a user enters their password, the system hashes it and compares it to the stored hash rather than storing the actual password."
            },
            {
              question: "What is the XOR encryption key used for?",
              answer: "In XOR encryption, the key is combined with your plaintext using the XOR operation to produce the ciphertext. The same key must be used during decryption to recover the original text. The security of XOR encryption depends entirely on keeping this key secret and using a key that's at least as long as the message for maximum security."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default PasswordEncryptionUtilityDetailed;