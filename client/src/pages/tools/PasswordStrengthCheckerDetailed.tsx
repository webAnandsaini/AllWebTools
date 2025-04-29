import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Progress
} from "@/components/ui/progress";
import {
  Label
} from "@/components/ui/label";

const PasswordStrengthCheckerDetailed = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [strengthText, setStrengthText] = useState('');
  const [strengthColor, setStrengthColor] = useState('');
  const [timeToHack, setTimeToHack] = useState('');
  const [checklist, setChecklist] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
    noCommonWords: true,
    noSequential: true,
    noRepeated: true
  });

  // Evaluate password strength when password changes
  useEffect(() => {
    if (password) {
      calculateStrength(password);
    } else {
      resetResults();
    }
  }, [password]);

  const resetResults = () => {
    setStrength(0);
    setStrengthText('');
    setStrengthColor('');
    setTimeToHack('');
    setFeedbackMessages([]);
    setChecklist({
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      noCommonWords: true,
      noSequential: true,
      noRepeated: true
    });
  };

  const calculateStrength = (password: string) => {
    let score = 0;
    let feedback: string[] = [];
    
    // Check password length
    const hasGoodLength = password.length >= 12;
    setChecklist(prev => ({...prev, length: hasGoodLength}));
    
    if (password.length < 8) {
      score += 0;
      feedback.push("Password is too short, use at least 8 characters");
    } else if (password.length < 12) {
      score += 20;
      feedback.push("Better length, but 12+ characters is recommended");
    } else if (password.length < 16) {
      score += 40;
      feedback.push("Good length");
    } else {
      score += 50;
      feedback.push("Excellent length");
    }
    
    // Check for uppercase letters
    const hasUppercase = /[A-Z]/.test(password);
    setChecklist(prev => ({...prev, uppercase: hasUppercase}));
    
    if (hasUppercase) {
      score += 10;
    } else {
      feedback.push("Add uppercase letters (A-Z)");
    }
    
    // Check for lowercase letters
    const hasLowercase = /[a-z]/.test(password);
    setChecklist(prev => ({...prev, lowercase: hasLowercase}));
    
    if (hasLowercase) {
      score += 10;
    } else {
      feedback.push("Add lowercase letters (a-z)");
    }
    
    // Check for numbers
    const hasNumbers = /[0-9]/.test(password);
    setChecklist(prev => ({...prev, numbers: hasNumbers}));
    
    if (hasNumbers) {
      score += 10;
    } else {
      feedback.push("Add numbers (0-9)");
    }
    
    // Check for symbols
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    setChecklist(prev => ({...prev, symbols: hasSymbols}));
    
    if (hasSymbols) {
      score += 10;
    } else {
      feedback.push("Add special characters (!@#$%^&*)");
    }
    
    // Check for common patterns and weaknesses
    const hasSequential = /(?:ABCDEFGHIJKLMNOPQRSTUVWXYZ|abcdefghijklmnopqrstuvwxyz|0123456789|qwertyuiop|asdfghjkl|zxcvbnm)/i.test(password);
    setChecklist(prev => ({...prev, noSequential: !hasSequential}));
    
    if (hasSequential) {
      score -= 20;
      feedback.push("Avoid sequential letters or numbers");
    }
    
    // Check for repeated characters
    const hasRepeated = /(.)\1{2,}/i.test(password);
    setChecklist(prev => ({...prev, noRepeated: !hasRepeated}));
    
    if (hasRepeated) {
      score -= 15;
      feedback.push("Avoid repeating characters");
    }
    
    // Check for common passwords (very simplified check)
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'letmein', 'monkey', 'password123'];
    const lowercasePassword = password.toLowerCase();
    const hasCommonPassword = commonPasswords.some(common => lowercasePassword.includes(common));
    setChecklist(prev => ({...prev, noCommonWords: !hasCommonPassword}));
    
    if (hasCommonPassword) {
      score -= 30;
      feedback.push("Your password contains common words or patterns");
    }
    
    // Calculate diversity of characters
    const uniqueChars = new Set(password).size;
    const uniqueRatio = uniqueChars / password.length;
    
    if (uniqueRatio > 0.7) {
      score += 10;
      feedback.push("Good variety of characters");
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(score, 100));
    
    // Set feedback based on score
    if (score < 20) {
      setStrengthText('Very Weak');
      setStrengthColor('bg-red-500');
      estimateHackingTime(password, 'very-weak');
    } else if (score < 40) {
      setStrengthText('Weak');
      setStrengthColor('bg-orange-500');
      estimateHackingTime(password, 'weak');
    } else if (score < 60) {
      setStrengthText('Moderate');
      setStrengthColor('bg-yellow-500');
      estimateHackingTime(password, 'moderate');
    } else if (score < 80) {
      setStrengthText('Strong');
      setStrengthColor('bg-green-500');
      estimateHackingTime(password, 'strong');
    } else {
      setStrengthText('Very Strong');
      setStrengthColor('bg-emerald-500');
      estimateHackingTime(password, 'very-strong');
    }
    
    setStrength(score);
    
    // Filter and limit feedback
    if (feedback.length > 0) {
      setFeedbackMessages(feedback.slice(0, 3));
    } else {
      setFeedbackMessages(['Excellent password!']);
    }
  };
  
  const estimateHackingTime = (password: string, strengthLevel: string) => {
    // This is a simplified estimate based on patterns and length
    // Real password cracking times depend on many factors
    
    let timeEstimate = "";
    const length = password.length;
    const hasComplex = /[^a-zA-Z0-9]/.test(password) && /[0-9]/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password);
    
    switch(strengthLevel) {
      case 'very-weak':
        timeEstimate = "Seconds to minutes";
        break;
      case 'weak':
        timeEstimate = length < 10 ? "Hours to days" : "Days to weeks";
        break;
      case 'moderate':
        timeEstimate = hasComplex ? "Months to years" : "Weeks to months";
        break;
      case 'strong':
        timeEstimate = hasComplex && length >= 12 ? "Years to decades" : "Years";
        break;
      case 'very-strong':
        timeEstimate = hasComplex && length >= 16 ? "Centuries" : "Decades to centuries";
        break;
      default:
        timeEstimate = "Unknown";
    }
    
    setTimeToHack(timeEstimate);
  };

  const clearPassword = () => {
    setPassword('');
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password-input">Enter Password to Check</Label>
              <div className="flex space-x-2">
                <Input
                  id="password-input"
                  type="password"
                  placeholder="Enter your password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={clearPassword} variant="outline">
                  Clear
                </Button>
              </div>
            </div>
          </div>
          
          {password && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Password Strength: {strengthText}</span>
                  <span className="text-sm">{strength}%</span>
                </div>
                <Progress value={strength} className={`h-2 ${strengthColor}`} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.length ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.length ? '✓' : '✕'}
                      </span>
                      12+ characters in length
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.uppercase ? '✓' : '✕'}
                      </span>
                      Uppercase letters (A-Z)
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.lowercase ? '✓' : '✕'}
                      </span>
                      Lowercase letters (a-z)
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.numbers ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.numbers ? '✓' : '✕'}
                      </span>
                      Numbers (0-9)
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.symbols ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.symbols ? '✓' : '✕'}
                      </span>
                      Special characters (!@#$%^&*)
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Common Problems</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.noCommonWords ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.noCommonWords ? '✓' : '✕'}
                      </span>
                      No common words or patterns
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.noSequential ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.noSequential ? '✓' : '✕'}
                      </span>
                      No sequential letters or numbers
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${checklist.noRepeated ? 'text-green-500' : 'text-red-500'}`}>
                        {checklist.noRepeated ? '✓' : '✕'}
                      </span>
                      No repeated characters
                    </li>
                  </ul>
                  
                  {timeToHack && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                      <span className="text-sm font-medium">Estimated time to crack: </span>
                      <span className={`text-sm font-bold ${strength > 60 ? 'text-green-600' : strength > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {timeToHack}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {feedbackMessages.length > 0 && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium">Feedback</h3>
                  <ul className="space-y-1">
                    {feedbackMessages.map((message, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">What Makes a Strong Password?</h3>
          <div className="space-y-3 text-sm">
            <p>
              Strong passwords are the foundation of your online security. Here's what makes a password strong:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Length:</span> Aim for at least 12-16 characters, the longer the better</li>
              <li><span className="font-medium">Complexity:</span> Mix uppercase letters, lowercase letters, numbers, and special characters</li>
              <li><span className="font-medium">Unpredictability:</span> Avoid common words, phrases, and predictable patterns</li>
              <li><span className="font-medium">Uniqueness:</span> Use a different password for each account</li>
            </ul>
            <p className="mt-2">
              Remember that even a password rated as "very strong" could potentially be compromised if:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You reuse it across multiple sites</li>
              <li>It contains personal information that could be guessed</li>
              <li>You share it with others or store it insecurely</li>
              <li>The website or service storing it is compromised</li>
            </ul>
            <div className="p-3 bg-blue-50 rounded-md mt-4">
              <p className="text-blue-800">
                <span className="font-medium">Tip:</span> Consider using a password manager to generate and securely store unique, complex passwords for all your accounts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug="password-strength-checker-detailed"
      toolContent={
        <ToolContentTemplate
          introduction="Check how secure your passwords really are with our comprehensive Password Strength Checker tool."
          description="Our Password Strength Checker analyzes your password's security by evaluating length, complexity, uniqueness, and resistance to common cracking methods. Get detailed feedback on strengths and weaknesses, with visual indicators showing how well your password stands up to potential attacks. Learn how to create stronger passwords with actionable recommendations and understand estimated cracking times based on current computing capabilities."
          howToUse={[
            "Enter your password in the input field (your password is never stored or transmitted)",
            "View the strength score and rating immediately",
            "Check which security requirements your password meets or fails",
            "Review the estimated time it would take for a hacker to crack your password",
            "Read the personalized feedback to understand how to improve your password security",
            "Clear the input when finished for your security"
          ]}
          features={[
            "Real-time password strength evaluation with percentage score",
            "Visual strength meter with intuitive color coding",
            "Detailed checklist of password requirements",
            "Estimated password cracking time based on complexity",
            "Personalized feedback and improvement suggestions",
            "Complete privacy - all analysis happens in your browser"
          ]}
          faqs={[
            {
              question: "Is it safe to enter my real passwords here?",
              answer: "Yes. All analysis happens directly in your browser and your password is never stored or transmitted over the network. However, as a general security practice, you might want to test passwords that are similar to your real ones rather than the exact passwords you use for critical accounts."
            },
            {
              question: "How accurate is the cracking time estimate?",
              answer: "The estimated cracking time is an approximation based on common attack methods and current computing power. Actual times may vary based on attacker resources, methods used, and future increases in computing power. It's best to interpret these estimates as relative indicators rather than precise predictions."
            },
            {
              question: "Why does my password with special characters still show as weak?",
              answer: "Adding special characters helps, but it's just one factor. A password might still be weak if it's too short, uses common patterns, or contains easily guessable words. For example, 'P@ssw0rd!' contains special characters but follows a common pattern and would be quickly cracked."
            },
            {
              question: "What's the difference between a strong and very strong password?",
              answer: "A strong password meets basic security requirements with good length and complexity. A very strong password goes beyond this with exceptional length (16+ characters), high character diversity, absence of patterns, and maximum unpredictability. Very strong passwords would take significant resources and time to crack even with advanced methods."
            },
            {
              question: "Should I use the same password for all my accounts if it's very strong?",
              answer: "No. Even a very strong password should never be reused across multiple accounts. If one service experiences a data breach, all your accounts using that password become vulnerable. Use unique passwords for each account and consider a password manager to help keep track of them."
            }
          ]}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default PasswordStrengthCheckerDetailed;