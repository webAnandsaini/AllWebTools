import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CreditCardValidatorDetailed: React.FC = () => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{
    isValid: boolean;
    cardType: string;
    formatted: string;
  } | null>(null);

  // Function to format credit card number with spaces
  const formatCardNumber = (number: string): string => {
    const digits = number.replace(/\D/g, "");
    let formatted = "";
    
    // Different card types have different grouping patterns
    if (/^3[47]/.test(digits)) {
      // American Express: 4-6-5 grouping
      formatted = digits.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    } else {
      // Most cards: 4-4-4-4 grouping
      formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    
    return formatted.trim();
  };

  // Luhn algorithm for card number validation
  const validateWithLuhn = (number: string): boolean => {
    const digits = number.replace(/\D/g, "");
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }
    
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits in reverse
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Function to detect card type based on number pattern
  const detectCardType = (number: string): string => {
    const digits = number.replace(/\D/g, "");
    
    // Visa
    if (/^4/.test(digits)) {
      return "Visa";
    }
    
    // Mastercard
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) {
      return "Mastercard";
    }
    
    // American Express
    if (/^3[47]/.test(digits)) {
      return "American Express";
    }
    
    // Discover
    if (/^6(?:011|5)/.test(digits)) {
      return "Discover";
    }
    
    // JCB
    if (/^35/.test(digits)) {
      return "JCB";
    }
    
    // Diners Club
    if (/^3(?:0[0-5]|[68])/.test(digits)) {
      return "Diners Club";
    }
    
    return "Unknown";
  };

  // Handle validation of the credit card
  const handleValidate = () => {
    try {
      if (!cardNumber) {
        setError("Please enter a credit card number");
        setResult(null);
        return;
      }
      
      const digits = cardNumber.replace(/\D/g, "");
      
      if (digits.length < 13 || digits.length > 19) {
        setError("Credit card number should be between 13 and 19 digits");
        setResult(null);
        return;
      }
      
      const isValid = validateWithLuhn(digits);
      const cardType = detectCardType(digits);
      const formatted = formatCardNumber(digits);
      
      setResult({
        isValid,
        cardType,
        formatted,
      });
      
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
      setResult(null);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, spaces, and dashes
    const value = e.target.value.replace(/[^\d\s-]/g, "");
    setCardNumber(value);
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="cardNumber">Credit Card Number</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="Enter credit card number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="mt-1.5"
                maxLength={23}
              />
              <p className="text-xs text-gray-500 mt-1">
                For testing, you can use: 4111 1111 1111 1111 (Visa test number)
              </p>
            </div>

            <Button variant="default" onClick={handleValidate} className="w-full">
              Validate Card
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 rounded-md bg-gray-50 text-gray-700 font-medium">
                <div className="flex items-center justify-between mb-2">
                  <span>Validation Result:</span>
                  {result.isValid ? (
                    <Badge className="bg-green-500">Valid</Badge>
                  ) : (
                    <Badge className="bg-red-500">Invalid</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <p>Card Type: {result.cardType}</p>
                  <p>Formatted: {result.formatted}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Credit Card Validator</h3>
          <div className="text-sm space-y-4">
            <p>
              Our Credit Card Validator uses the Luhn algorithm to verify the validity of credit card numbers and automatically identifies the card type.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verifying credit card numbers before processing payments</li>
                <li>Checking if a card number format is correct</li>
                <li>Identifying the credit card company or type</li>
                <li>Testing e-commerce payment systems</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p className="mb-1">Note: This tool only validates the format of the number using the Luhn algorithm and identifies card types based on number patterns. It does not verify if the card actually exists or if it has sufficient funds.</p>
              <p>No card data is stored or transmitted to any external services.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Instantly verify credit card numbers and identify card types with our secure validation tool.";
  
  const description = "Our Credit Card Validator tool uses the industry-standard Luhn algorithm to instantly check if a credit card number is properly formatted and potentially valid. Beyond validation, this tool automatically detects the card type (Visa, Mastercard, American Express, etc.) and displays a properly formatted version of the number. Perfect for businesses implementing payment systems, developers testing e-commerce applications, or anyone who needs to verify credit card numbers without processing actual payments.";
  
  const howToUse = [
    "Enter the credit card number you want to validate (spaces and dashes are allowed)",
    "Click the 'Validate Card' button",
    "View the validation result, including whether the card is valid according to the Luhn algorithm",
    "See the detected card type (Visa, Mastercard, Amex, etc.)",
    "The tool will also show you the properly formatted version of the card number"
  ];
  
  const features = [
    "✅ Validates credit card numbers using the Luhn algorithm",
    "✅ Automatically detects card type based on number pattern",
    "✅ Formats card numbers with proper spacing",
    "✅ Supports all major card types (Visa, Mastercard, Amex, Discover, etc.)",
    "✅ 100% secure - no card data is stored or transmitted"
  ];
  
  const faqs = [
    {
      question: "What is the Luhn algorithm?",
      answer: "The Luhn algorithm (also known as the 'modulus 10' algorithm) is a checksum formula used to validate a variety of identification numbers, including credit card numbers. It's used to distinguish valid numbers from mistyped or otherwise incorrect numbers."
    },
    {
      question: "Is it safe to enter my credit card number in this tool?",
      answer: "Yes. This tool performs all validation locally in your browser. No credit card information is ever stored or transmitted to any server. For extra security, you can use test card numbers instead of real ones if you're just testing the functionality."
    },
    {
      question: "Can this tool tell me if a credit card is active or has available funds?",
      answer: "No. This tool only validates the format of the card number using the Luhn algorithm and identifies the card type. It cannot verify if the card actually exists, is active, or has available funds. That would require processing through a payment gateway."
    },
    {
      question: "Which credit card types does this validator recognize?",
      answer: "This validator can identify Visa, Mastercard, American Express, Discover, JCB, and Diners Club cards based on their number patterns."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="credit-card-validator"
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

export default CreditCardValidatorDetailed;