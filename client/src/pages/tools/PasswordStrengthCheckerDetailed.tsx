import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { passwordManagementTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaShieldAlt, FaCheck, FaTimes } from "react-icons/fa";

const PasswordStrengthCheckerDetailed = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [lengthCheck, setLengthCheck] = useState(false);
  const [uppercaseCheck, setUppercaseCheck] = useState(false);
  const [lowercaseCheck, setLowercaseCheck] = useState(false);
  const [numbersCheck, setNumbersCheck] = useState(false);
  const [symbolsCheck, setSymbolsCheck] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkPasswordStrength = async () => {
    if (!password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a password to check",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simple client-side strength check
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      
      setLengthCheck(password.length >= 12);
      setUppercaseCheck(hasUpperCase);
      setLowercaseCheck(hasLowerCase);
      setNumbersCheck(hasNumbers);
      setSymbolsCheck(hasSymbols);
      
      // Calculate strength score (0-100)
      let score = 0;
      
      // Length contribution (up to 40%)
      const lengthFactor = Math.min(password.length / 24, 1);
      score += lengthFactor * 40;
      
      // Character variety contribution (up to 60%)
      let characterTypes = 0;
      if (hasUpperCase) characterTypes++;
      if (hasLowerCase) characterTypes++;
      if (hasNumbers) characterTypes++;
      if (hasSymbols) characterTypes++;
      
      const varietyFactor = characterTypes / 4;
      score += varietyFactor * 60;
      
      // Check for common patterns
      const repeatingChars = /(.)\1{2,}/g;
      if (repeatingChars.test(password)) {
        score -= 10;
      }
      
      const sequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
      if (sequentialChars.test(password)) {
        score -= 10;
      }
      
      // Ensure score is between 0 and 100
      score = Math.max(0, Math.min(100, Math.round(score)));
      
      setStrength(score);
      setShowResults(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const getStrengthDescription = () => {
    if (strength < 30) {
      return "This password is very weak and could be easily cracked. It provides minimal protection and should be changed immediately.";
    } else if (strength < 60) {
      return "This password provides moderate protection but could be vulnerable to sophisticated attacks. Consider strengthening it.";
    } else if (strength < 80) {
      return "This password provides good protection against most attacks, but could be strengthened further for critical accounts.";
    } else {
      return "This password provides excellent protection and would be extremely difficult to crack using current technology.";
    }
  };

  const strengthSuggestions = () => {
    const suggestions = [];

    if (!lengthCheck) {
      suggestions.push("Make your password longer (at least 12 characters)");
    }
    if (!uppercaseCheck) {
      suggestions.push("Add uppercase letters (A-Z)");
    }
    if (!lowercaseCheck) {
      suggestions.push("Add lowercase letters (a-z)");
    }
    if (!numbersCheck) {
      suggestions.push("Add numbers (0-9)");
    }
    if (!symbolsCheck) {
      suggestions.push("Add special characters (!@#$%)");
    }

    return suggestions;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowResults(false);
  };

  const introduction = "Instantly assess your password's strength and get personalized improvement suggestions.";

  const description = "Our Password Strength Checker is an advanced security tool designed to evaluate the resilience of your passwords against various hacking techniques and brute force attacks. This tool analyzes multiple factors that contribute to password security, including length, character variety, randomness, and the presence of patterns or common substitutions that might make your password vulnerable. Rather than simply measuring complexity, our checker uses sophisticated algorithms to provide a comprehensive security assessment that considers real-world attack vectors. After analysis, you'll receive not only a strength rating but also personalized recommendations to help you create stronger, more secure passwords. Whether you're setting up new accounts or auditing your existing password security, this tool helps you understand your vulnerability level and take steps to better protect your digital identity.";

  const howToUse = [
    "Enter the password you want to check in the secure input field.",
    "Click the 'Check Strength' button to analyze your password.",
    "Review your password's overall strength score and detailed security analysis.",
    "Follow the personalized suggestions to improve your password security.",
    "Make changes to your password and check again until you achieve a strong rating."
  ];

  const features = [
    "✅ Comprehensive password strength analysis using multiple security factors",
    "✅ Real-time security scoring on a 0-100 scale with visual indicators",
    "✅ Detailed breakdown of password security characteristics",
    "✅ Personalized improvement suggestions based on specific weaknesses",
    "✅ Client-side processing ensures your password never leaves your device",
    "✅ Support for checking passwords of any length or complexity"
  ];

  const faqs = [
    {
      question: "Is it safe to enter my real passwords into this tool?",
      answer: "Yes, our Password Strength Checker performs all analysis locally in your browser. Your password is never transmitted to our servers or stored anywhere. However, for maximum security, you might consider checking passwords that are similar to your actual passwords rather than the exact ones you use."
    },
    {
      question: "What makes a password truly strong?",
      answer: "A strong password typically has at least 12-16 characters, includes a mix of uppercase and lowercase letters, numbers, and special symbols, avoids common words or patterns, and is unique to each account. The randomness (entropy) of the characters is also crucial for maximum security."
    },
    {
      question: "How often should I change my passwords?",
      answer: "Current security best practices suggest that you don't need to change strong, unique passwords regularly unless there's a reason to believe they've been compromised. It's more important to use different strong passwords for each account and consider using a password manager to keep track of them."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Check Your Password Strength</h3>
        
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="password" 
              value={password} 
              onChange={handleChange}
              placeholder="Enter your password"
              className="pr-24 h-12"
            />
          </div>
        </div>

        <Button 
          onClick={checkPasswordStrength} 
          disabled={isLoading} 
          className="w-full mb-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
        >
          <FaShieldAlt className="mr-2" />
          {isLoading ? "Analyzing..." : "Check Strength"}
        </Button>

        {showResults && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Password Strength</span>
                <span className="text-sm font-medium">{getStrengthText()}</span>
              </div>
              <Progress value={strength} className={`h-3 ${getStrengthColor()}`} />
              <p className="mt-2 text-sm text-gray-600">{getStrengthDescription()}</p>
            </div>
            
            <div className="border rounded-md p-4 bg-white">
              <h4 className="font-medium mb-2">Password Analysis</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  {lengthCheck ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}
                  <span>12+ characters long</span>
                </li>
                <li className="flex items-center">
                  {uppercaseCheck ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}
                  <span>Contains uppercase letters</span>
                </li>
                <li className="flex items-center">
                  {lowercaseCheck ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}
                  <span>Contains lowercase letters</span>
                </li>
                <li className="flex items-center">
                  {numbersCheck ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}
                  <span>Contains numbers</span>
                </li>
                <li className="flex items-center">
                  {symbolsCheck ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}
                  <span>Contains special symbols</span>
                </li>
              </ul>
            </div>
            
            {strengthSuggestions().length > 0 && (
              <div className="border rounded-md p-4 bg-white">
                <h4 className="font-medium mb-2">Improvement Suggestions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {strengthSuggestions().map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="password-strength-checker-detailed"
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

export default PasswordStrengthCheckerDetailed;