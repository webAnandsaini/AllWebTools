import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { passwordManagementTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaCopy, FaKey, FaRedo } from "react-icons/fa";

const PasswordGeneratorDetailed = () => {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generatePassword = async () => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one character type.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/password/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          length: passwordLength,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPassword(data.password);
        setPasswordStrength(data.strength);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to generate password",
        });
      }
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

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const introduction = "Create secure, randomized passwords instantly with our powerful password generator.";

  const description = "Our Password Generator is a secure, user-friendly tool designed to help you create strong, random passwords that protect your online accounts from unauthorized access and potential security breaches. In a digital world where password strength is critical for protecting your sensitive information, this tool helps you generate complex passwords that are difficult for hackers to crack, yet can be customized to meet specific requirements. With options to include uppercase letters, lowercase letters, numbers, and special symbols, you can create unique passwords that match the security criteria of any website or application while maintaining high entropy and unpredictability. Whether you're setting up new accounts, updating existing passwords for better security, or implementing password policies for an organization, our Password Generator helps you strengthen your digital security efficiently.";

  const howToUse = [
    "Set your desired password length using the slider (8-32 characters recommended).",
    "Select the types of characters to include: uppercase letters, lowercase letters, numbers, and symbols.",
    "Click the 'Generate Password' button to create a new random password.",
    "Use the copy button to copy the password to your clipboard.",
    "Generate a new password anytime by clicking the refresh button."
  ];

  const features = [
    "✅ Customizable password length from 8 to 32 characters",
    "✅ Options to include uppercase letters, lowercase letters, numbers, and special symbols",
    "✅ Instant password strength assessment with visual indicator",
    "✅ One-click copy functionality for easy password use",
    "✅ Secure random generation algorithm for maximum protection",
    "✅ No password storage - all passwords are generated client-side for security"
  ];

  const faqs = [
    {
      question: "How strong are the passwords created by this generator?",
      answer: "The passwords created by our generator are highly secure when using the recommended settings. A password with 16+ characters that includes a mix of uppercase, lowercase, numbers, and symbols can take billions of years to crack using current technology."
    },
    {
      question: "How long should my password be?",
      answer: "For most accounts, we recommend passwords that are at least 16 characters long. Critical accounts like email, banking, or cryptocurrency wallets should use 20+ character passwords for maximum security."
    },
    {
      question: "Should I use the same password for multiple accounts?",
      answer: "No, you should never reuse passwords across different accounts. Even with a strong password, if one site experiences a data breach, all your accounts using that password become vulnerable. Generate a unique password for each account."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Generate a Secure Password</h3>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="password-length" className="font-medium">Password Length: {passwordLength}</Label>
          </div>
          <Slider 
            id="password-length"
            value={[passwordLength]} 
            min={8} 
            max={32} 
            step={1} 
            onValueChange={(value) => setPasswordLength(value[0])}
            className="my-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="uppercase" 
              checked={includeUppercase} 
              onCheckedChange={(checked) => setIncludeUppercase(checked === true)} 
            />
            <Label htmlFor="uppercase" className="font-medium">Uppercase (A-Z)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lowercase" 
              checked={includeLowercase} 
              onCheckedChange={(checked) => setIncludeLowercase(checked === true)} 
            />
            <Label htmlFor="lowercase" className="font-medium">Lowercase (a-z)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="numbers" 
              checked={includeNumbers} 
              onCheckedChange={(checked) => setIncludeNumbers(checked === true)} 
            />
            <Label htmlFor="numbers" className="font-medium">Numbers (0-9)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="symbols" 
              checked={includeSymbols} 
              onCheckedChange={(checked) => setIncludeSymbols(checked === true)} 
            />
            <Label htmlFor="symbols" className="font-medium">Symbols (!@#$%)</Label>
          </div>
        </div>

        <Button 
          onClick={generatePassword} 
          disabled={isLoading} 
          className="w-full mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
        >
          <FaKey className="mr-2" />
          {isLoading ? "Generating..." : "Generate Password"}
        </Button>

        {password && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Input 
                value={password} 
                readOnly 
                className="pr-24 font-mono text-sm h-12"
              />
              <div className="absolute right-1 top-1 flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                        <FaCopy />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy password</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" onClick={generatePassword}>
                        <FaRedo />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate new password</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Password Strength</span>
                <span className="text-sm font-medium">{getStrengthText()}</span>
              </div>
              <Progress value={passwordStrength} className={`h-2 ${getStrengthColor()}`} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="password-generator-detailed"
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

export default PasswordGeneratorDetailed;