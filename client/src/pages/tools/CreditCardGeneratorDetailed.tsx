import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneratedCard {
  number: string;
  type: string;
  formatted: string;
}

const CreditCardGeneratorDetailed: React.FC = () => {
  const [cardType, setCardType] = useState<string>("visa");
  const [quantity, setQuantity] = useState<string>("1");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [error, setError] = useState<string>("");

  // Function to format credit card number with spaces
  const formatCardNumber = (number: string, type: string): string => {
    let formatted = "";
    
    // Different card types have different grouping patterns
    if (type === "amex") {
      // American Express: 4-6-5 grouping
      formatted = number.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    } else {
      // Most cards: 4-4-4-4 grouping
      formatted = number.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    
    return formatted.trim();
  };

  // Generate a random number within range
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Apply Luhn algorithm to generate valid check digit
  const generateCheckDigit = (partialNumber: string): string => {
    const digits = partialNumber.split("").map(Number);
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits in reverse
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    const remainder = sum % 10;
    return remainder === 0 ? "0" : String(10 - remainder);
  };

  // Generate a random credit card number based on type
  const generateCardNumber = (type: string): string => {
    let prefix = "";
    let length = 16;
    
    switch (type) {
      case "visa":
        prefix = "4";
        length = 16;
        break;
      case "mastercard":
        // Mastercard starts with 51-55 or 2221-2720
        prefix = Math.random() > 0.5 
          ? String(getRandomNumber(51, 55))
          : String(getRandomNumber(2221, 2720));
        length = 16;
        break;
      case "amex":
        // American Express starts with 34 or 37
        prefix = Math.random() > 0.5 ? "34" : "37";
        length = 15;
        break;
      case "discover":
        // Discover starts with 6011, 644-649, or 65
        prefix = Math.random() > 0.5 
          ? "6011" 
          : (Math.random() > 0.5 
            ? String(getRandomNumber(644, 649)) 
            : "65");
        length = 16;
        break;
      default:
        prefix = "4";
        length = 16;
    }
    
    // Generate random digits for the remaining length
    const remainingLength = length - prefix.length - 1; // -1 for check digit
    let partialNumber = prefix;
    
    for (let i = 0; i < remainingLength; i++) {
      partialNumber += String(getRandomNumber(0, 9));
    }
    
    // Generate check digit using Luhn algorithm
    const checkDigit = generateCheckDigit(partialNumber);
    
    return partialNumber + checkDigit;
  };

  // Handle card generation
  const handleGenerate = () => {
    try {
      const count = parseInt(quantity);
      
      if (isNaN(count) || count < 1 || count > 10) {
        setError("Please enter a valid quantity between 1 and 10");
        return;
      }
      
      const cards: GeneratedCard[] = [];
      
      for (let i = 0; i < count; i++) {
        const number = generateCardNumber(cardType);
        const formatted = formatCardNumber(number, cardType);
        const displayType = 
          cardType === "visa" ? "Visa" :
          cardType === "mastercard" ? "Mastercard" :
          cardType === "amex" ? "American Express" :
          cardType === "discover" ? "Discover" : "Credit Card";
        
        cards.push({
          number,
          type: displayType,
          formatted
        });
      }
      
      setGeneratedCards(cards);
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="cardType">Card Type</Label>
              <Select
                value={cardType}
                onValueChange={(value) => setCardType(value)}
              >
                <SelectTrigger id="cardType" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                  <SelectItem value="discover">Discover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity (1-10)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <Button variant="default" onClick={handleGenerate} className="w-full">
              Generate Test Cards
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {generatedCards.length > 0 && (
              <div className="p-4 rounded-md bg-gray-50 space-y-4">
                <h3 className="font-medium text-gray-900">Generated Test Credit Cards:</h3>
                <div className="space-y-3">
                  {generatedCards.map((card, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md">
                      <p className="text-sm mb-1"><span className="font-medium">Type:</span> {card.type}</p>
                      <p className="text-sm mb-1"><span className="font-medium">Number:</span> {card.formatted}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(card.formatted);
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>These are TEST credit card numbers that pass Luhn validation but are not actual credit cards. They can be used for testing payment systems but cannot be used for real transactions.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Credit Card Generator</h3>
          <div className="text-sm space-y-4">
            <p>
              Our Credit Card Generator creates valid test credit card numbers that pass the Luhn algorithm check but are not connected to real accounts.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Testing e-commerce checkout systems</li>
                <li>Developing payment processing integrations</li>
                <li>QA testing for payment forms</li>
                <li>Educational purposes to understand card number formats</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p className="mb-1 font-semibold text-red-500">Important Disclaimer:</p>
              <p>The card numbers generated by this tool are for testing purposes only. They follow valid credit card number formats and will pass basic validation checks, but they are not real credit cards and cannot be used for actual purchases. Using these numbers for fraudulent purposes is illegal.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Generate valid test credit card numbers for development and testing purposes.";
  
  const description = "Our Credit Card Generator creates validly formatted test credit card numbers that pass the Luhn algorithm check. These test numbers are perfect for developers testing payment systems, QA engineers validating checkout processes, or anyone who needs to test credit card functionality without using real card data. The generator supports multiple card types including Visa, Mastercard, American Express, and Discover, and allows you to generate multiple test cards at once. All generated numbers follow the proper format for each card type but are not connected to real accounts.";
  
  const howToUse = [
    "Select the credit card type you want to generate (Visa, Mastercard, American Express, or Discover)",
    "Choose how many test cards you want to generate (1-10)",
    "Click the 'Generate Test Cards' button",
    "View the generated card information including type and number",
    "Use the 'Copy' button to easily copy a card number for testing purposes"
  ];
  
  const features = [
    "✅ Generates valid credit card numbers that pass Luhn validation",
    "✅ Supports multiple card types (Visa, Mastercard, Amex, Discover)",
    "✅ Create up to 10 test cards simultaneously",
    "✅ Properly formatted numbers with spaces for easy readability",
    "✅ One-click copying for easy use in testing environments"
  ];
  
  const faqs = [
    {
      question: "Are these real credit card numbers?",
      answer: "No. The numbers generated by this tool are test credit card numbers that follow the proper format and pass Luhn algorithm validation, but they are not connected to real accounts and cannot be used for actual purchases. They are intended for testing payment systems only."
    },
    {
      question: "Will these numbers work with real payment processors?",
      answer: "These numbers will pass basic format validation, but they will fail actual payment processing because they are not real cards. Many payment processors have their own test numbers for development environments - those should be used for complete testing."
    },
    {
      question: "Is it legal to use these generated numbers?",
      answer: "It is legal to use these numbers for their intended purpose: testing payment forms, e-commerce systems, or applications during development. However, attempting to use these numbers for fraudulent purposes is illegal."
    },
    {
      question: "What is the Luhn algorithm?",
      answer: "The Luhn algorithm (also known as the 'modulus 10' algorithm) is a checksum formula used to validate credit card numbers and other identification numbers. Real credit card companies use this algorithm to generate the final check digit of their card numbers, which helps detect errors in transcription."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="credit-card-generator"
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

export default CreditCardGeneratorDetailed;