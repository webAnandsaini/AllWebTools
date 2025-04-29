import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { passwordManagementTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaLock, FaUnlock, FaCopy, FaSyncAlt } from "react-icons/fa";

// This is a client-side implementation using built-in Web Crypto API
// For production apps, server-side encryption might be more appropriate

const PasswordEncryptionUtilityDetailed = () => {
  const [tab, setTab] = useState("encrypt");
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to encrypt the password
  const encryptPassword = async () => {
    if (!password || !masterKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both a password and encryption key",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert master key to a crypto key
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.digest(
        "SHA-256",
        encoder.encode(masterKey)
      );

      // Generate initialization vector
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Import the key
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );

      // Encrypt the data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        encoder.encode(password)
      );

      // Combine IV and encrypted data for storage
      const encryptedArray = new Uint8Array(iv.byteLength + encryptedData.byteLength);
      encryptedArray.set(iv, 0);
      encryptedArray.set(new Uint8Array(encryptedData), iv.byteLength);

      // Convert to base64 for display
      const base64Result = btoa(String.fromCharCode(...new Uint8Array(encryptedArray)));
      setResult(base64Result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Encryption Error",
        description: "Failed to encrypt the password. Please try again.",
      });
      console.error("Encryption error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to decrypt the password
  const decryptPassword = async () => {
    if (!result || !masterKey) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both an encrypted string and the encryption key",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Decode from base64
      const encryptedBytes = atob(result);
      const encryptedData = new Uint8Array(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        encryptedData[i] = encryptedBytes.charCodeAt(i);
      }

      // Extract IV (first 12 bytes) and encrypted content
      const iv = encryptedData.slice(0, 12);
      const encrypted = encryptedData.slice(12);

      // Generate key from master key
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.digest(
        "SHA-256",
        encoder.encode(masterKey)
      );

      // Import the key
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Decrypt the content
      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        encrypted
      );

      // Convert to string
      const decoder = new TextDecoder();
      const decryptedPassword = decoder.decode(decryptedContent);
      setPassword(decryptedPassword);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decryption Error",
        description: "Failed to decrypt. Please check your encryption key and try again.",
      });
      console.error("Decryption error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    }
  };

  const clearFields = () => {
    setPassword("");
    setMasterKey("");
    setResult("");
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    clearFields();
  };

  const introduction = "Securely encrypt and decrypt your passwords with military-grade encryption.";

  const description = "Our Password Encryption Utility is a sophisticated security tool that allows you to encrypt your sensitive passwords and credentials using advanced AES-256 encryption algorithms. This utility provides a secure way to store your passwords or share them across devices without exposing them to potential threats. By encrypting your passwords with a master key that only you know, you create an additional layer of protection even if your password storage is compromised. The tool uses client-side encryption, meaning all cryptographic operations happen directly in your browser without transmitting sensitive data to any server. Whether you're looking to create encrypted backups of your credentials, securely share passwords with trusted contacts, or add an extra security layer to your password management system, our Password Encryption Utility offers a user-friendly solution with military-grade protection.";

  const howToUse = [
    "Select either 'Encrypt' or 'Decrypt' mode based on your needs.",
    "For encryption: Enter the password you want to encrypt and a strong master key to secure it.",
    "Click 'Encrypt' to generate the encrypted version of your password.",
    "Copy the encrypted result and store it securely.",
    "For decryption: Paste in your encrypted text, enter the same master key used for encryption, and click 'Decrypt'."
  ];

  const features = [
    "✅ Military-grade AES-256 encryption for maximum security",
    "✅ Client-side processing ensures your passwords never leave your device",
    "✅ Simple interface for both encryption and decryption operations",
    "✅ Secure password sharing capability with anyone who has the master key",
    "✅ One-click copy functionality for easy transfer of encrypted text",
    "✅ Compatible with all modern browsers and devices"
  ];

  const faqs = [
    {
      question: "How secure is the encryption used in this tool?",
      answer: "This tool uses AES-256 encryption with GCM mode, which is considered military-grade encryption and is used by governments and financial institutions worldwide. When implemented correctly with a strong master key, it is virtually unbreakable with current technology."
    },
    {
      question: "What happens if I forget my master key?",
      answer: "If you forget the master key used to encrypt your passwords, there is no way to recover the original password. There are no backdoors or recovery mechanisms intentionally, as these would compromise security. Always store your master key securely and consider creating a secure backup of it."
    },
    {
      question: "Is it safe to share the encrypted password with others?",
      answer: "Yes, you can safely share the encrypted password with others. However, you should share the master key through a different, secure channel. Anyone who has both the encrypted password and the master key will be able to decrypt and access the original password."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-slate-50 to-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-center">Password Encryption Utility</h3>
      
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encrypt">Encrypt Password</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encrypt" className="space-y-4">
          <div>
            <Label htmlFor="password-input" className="font-medium">Password to Encrypt</Label>
            <Input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to encrypt"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="master-key" className="font-medium">Master Encryption Key</Label>
            <Input
              id="master-key"
              type="password"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              placeholder="Enter a strong master key"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This key will be needed to decrypt. Keep it secure and don't forget it!
            </p>
          </div>
          
          <Button 
            onClick={encryptPassword} 
            disabled={isLoading} 
            className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
          >
            <FaLock className="mr-2" />
            {isLoading ? "Encrypting..." : "Encrypt Password"}
          </Button>
          
          {result && (
            <div className="mt-4">
              <Label htmlFor="encrypted-result" className="font-medium">Encrypted Result</Label>
              <div className="relative mt-1">
                <Input
                  id="encrypted-result"
                  value={result}
                  readOnly
                  className="pr-10 font-mono text-xs"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard(result)}
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                >
                  <FaCopy />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="decrypt" className="space-y-4">
          <div>
            <Label htmlFor="encrypted-input" className="font-medium">Encrypted Text</Label>
            <Input
              id="encrypted-input"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Paste encrypted text here"
              className="mt-1 font-mono text-xs"
            />
          </div>
          
          <div>
            <Label htmlFor="decrypt-key" className="font-medium">Master Encryption Key</Label>
            <Input
              id="decrypt-key"
              type="password"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              placeholder="Enter the original master key"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={decryptPassword} 
            disabled={isLoading} 
            className="w-full mt-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
          >
            <FaUnlock className="mr-2" />
            {isLoading ? "Decrypting..." : "Decrypt Password"}
          </Button>
          
          {password && tab === "decrypt" && (
            <div className="mt-4">
              <Label htmlFor="decrypted-result" className="font-medium">Decrypted Password</Label>
              <div className="relative mt-1">
                <Input
                  id="decrypted-result"
                  type="text"
                  value={password}
                  readOnly
                  className="pr-10"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard(password)}
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                >
                  <FaCopy />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button variant="outline" size="sm" onClick={clearFields}>
          <FaSyncAlt className="mr-2" /> Clear All Fields
        </Button>
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="password-encryption-utility-detailed"
      toolContent={
        <ToolContentTemplate
          introduction={introduction}
          description={description}
          howToUse={howToUse}
          features={features}
          faqs={faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default PasswordEncryptionUtilityDetailed;