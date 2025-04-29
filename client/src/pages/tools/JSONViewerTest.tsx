import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  Slider 
} from "@/components/ui/slider";
import {
  Checkbox
} from "@/components/ui/checkbox";
import {
  Button
} from "@/components/ui/button";
import {
  Label
} from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const JSONViewerTest = () => {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [passwordStrengthColor, setPasswordStrengthColor] = useState<string>("");
  
  const { toast } = useToast();

  const generatePassword = () => {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const similarChars = "il1Lo0O";
    
    let chars = "";
    
    if (includeLowercase) chars += lowercaseChars;
    if (includeUppercase) chars += uppercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
    
    if (excludeSimilar) {
      // Remove similar chars
      for (let i = 0; i < similarChars.length; i++) {
        chars = chars.replace(similarChars[i], "");
      }
    }
    
    if (chars.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }
    
    let newPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      newPassword += chars[randomIndex];
    }
    
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };
  
  const calculatePasswordStrength = (pw: string) => {
    let strength = 0;
    
    // Check length
    if (pw.length >= 8) strength += 1;
    if (pw.length >= 12) strength += 1;
    if (pw.length >= 16) strength += 1;
    
    // Check character variety
    if (/[a-z]/.test(pw)) strength += 1;
    if (/[A-Z]/.test(pw)) strength += 1;
    if (/[0-9]/.test(pw)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pw)) strength += 1;
    
    // Check character diversity
    const uniqueChars = new Set(pw).size;
    if (uniqueChars >= pw.length * 0.7) strength += 1;
    
    // Set strength level
    let strengthText = "";
    let strengthColor = "";
    
    if (strength < 3) {
      strengthText = "Very Weak";
      strengthColor = "bg-red-500";
    } else if (strength < 5) {
      strengthText = "Weak";
      strengthColor = "bg-orange-500";
    } else if (strength < 7) {
      strengthText = "Moderate";
      strengthColor = "bg-yellow-500";
    } else if (strength < 9) {
      strengthText = "Strong";
      strengthColor = "bg-green-500";
    } else {
      strengthText = "Very Strong";
      strengthColor = "bg-emerald-500";
    }
    
    setPasswordStrength(strengthText);
    setPasswordStrengthColor(strengthColor);
  };
  
  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard"
      });
    } else {
      toast({
        title: "No Password",
        description: "Generate a password first",
        variant: "destructive"
      });
    }
  };

  const resetOptions = () => {
    setPasswordLength(12);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeSimilar(false);
    setPassword("");
    setPasswordStrength("");
    setPasswordStrengthColor("");
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Generated Password</h3>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-3 rounded-md flex-1 font-mono text-lg relative min-h-[48px] flex items-center">
                  {password ? password : <span className="text-gray-400">Password will appear here</span>}
                </div>
                <Button 
                  onClick={copyPassword}
                  variant="outline"
                  disabled={!password}
                >
                  Copy
                </Button>
              </div>
              
              {passwordStrength && (
                <div className="flex flex-col space-y-1">
                  <div className="text-sm">Strength: <span className="font-medium">{passwordStrength}</span></div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrengthColor}`} 
                      style={{ 
                        width: `${password ? 
                          (passwordStrength === "Very Weak" ? 20 : 
                          passwordStrength === "Weak" ? 40 : 
                          passwordStrength === "Moderate" ? 60 : 
                          passwordStrength === "Strong" ? 80 : 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Password Length: {passwordLength}</Label>
                </div>
                <Slider 
                  value={[passwordLength]} 
                  min={4}
                  max={64}
                  step={1}
                  onValueChange={(value) => setPasswordLength(value[0])}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Character Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeLowercase" 
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                    />
                    <Label htmlFor="includeLowercase">Include Lowercase (a-z)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeUppercase" 
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                    />
                    <Label htmlFor="includeUppercase">Include Uppercase (A-Z)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeNumbers" 
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                    />
                    <Label htmlFor="includeNumbers">Include Numbers (0-9)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSymbols" 
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                    />
                    <Label htmlFor="includeSymbols">Include Symbols (!@#$%^&*)</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="excludeSimilar" 
                  checked={excludeSimilar}
                  onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
                />
                <Label htmlFor="excludeSimilar">Exclude Similar Characters (i, l, 1, L, o, 0, O)</Label>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button onClick={generatePassword} className="flex-1">Generate Password</Button>
                <Button onClick={resetOptions} variant="outline">Reset</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Password Tips</h3>
          <div className="space-y-3 text-sm">
            <p>
              A strong password is your first line of defense against unauthorized access. Here are some tips for creating and managing secure passwords:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a minimum of 12 characters, the more characters the better</li>
              <li>Include a mix of uppercase and lowercase letters, numbers, and special characters</li>
              <li>Avoid using common words, phrases, or personal information</li>
              <li>Don't reuse passwords across multiple sites or services</li>
              <li>Consider using a password manager to generate and store complex passwords</li>
              <li>Change your passwords periodically, especially for critical accounts</li>
            </ul>
            <p className="text-red-600 font-medium mt-4">
              Remember: Never share your passwords with others, and be cautious of phishing attempts that try to trick you into revealing your login credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="json-viewer-test"
      toolContent={
        <ToolContentTemplate
          introduction="Generate strong, secure, and customizable passwords in seconds with our advanced Password Generator tool."
          description="Our Password Generator creates random, secure passwords that are difficult to crack yet easy to customize. Choose password length, include uppercase letters, lowercase letters, numbers, and symbols, and even exclude confusing characters. Each generated password is analyzed for strength, giving you confidence in your digital security."
          howToUse={[
            "Select your desired password length using the slider (4-64 characters)",
            "Choose which character types to include: uppercase, lowercase, numbers, and symbols",
            "Optionally exclude similar characters that might be confusing",
            "Click 'Generate Password' to create a new secure password",
            "Copy your password to clipboard with one click",
            "Check the strength indicator to ensure your password meets security standards"
          ]}
          features={[
            "Fully customizable password generation options",
            "Password strength analyzer with visual indicator",
            "Option to exclude similar characters for better readability",
            "One-click copy to clipboard functionality",
            "Clean, intuitive interface for easy use",
            "No password storage - all generation happens in your browser for security"
          ]}
          faqs={[
            {
              question: "How secure are the passwords generated by this tool?",
              answer: "Very secure. By default, passwords include uppercase letters, lowercase letters, numbers, and symbols, creating strong combinations that are resistant to brute-force attacks. The longer and more varied your password, the more secure it will be."
            },
            {
              question: "Does this tool store my generated passwords?",
              answer: "No. All password generation happens directly in your browser. We never transmit or store your passwords on our servers, ensuring complete privacy and security."
            },
            {
              question: "What makes a password 'strong'?",
              answer: "A strong password typically has at least 12 characters and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. Our strength analyzer also considers the diversity of characters used and the overall entropy of the password."
            },
            {
              question: "How often should I change my passwords?",
              answer: "Security experts recommend changing passwords for important accounts every 3-6 months. However, using unique, strong passwords for each service is more important than frequent changes."
            },
            {
              question: "Can I generate multiple passwords at once?",
              answer: "Currently, the tool generates one password at a time. However, you can quickly generate multiple passwords by clicking the 'Generate Password' button repeatedly."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default JSONViewerTest;