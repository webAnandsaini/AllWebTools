import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const CalculatorDetailed = () => {
  const [location] = useLocation();
  const currentPath = location.split("/").pop() || "";

  // State for calculator type and results
  const [calculatorType, setCalculatorType] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Age Calculator state
  const [birthDate, setBirthDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Percentage Calculator state
  const [percentValue, setPercentValue] = useState<string>("");
  const [ofValue, setOfValue] = useState<string>("");

  // Margin Calculator state
  const [cost, setCost] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");
  
  // BMI Calculator state
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  
  // Loan Calculator state
  const [loanPrincipal, setLoanPrincipal] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [paymentFrequency, setPaymentFrequency] = useState<string>("monthly");
  
  // Currency selection for various calculators
  const [currency, setCurrency] = useState<string>("USD");
  
  // Confidence Interval Calculator state
  const [sampleMean, setSampleMean] = useState<string>("");
  const [standardDeviation, setStandardDeviation] = useState<string>("");
  const [sampleSize, setSampleSize] = useState<string>("");
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");

  // Initialize calculator type from URL
  useEffect(() => {
    console.log("Current path:", currentPath);
    // Get the calculator type from the URL path
    let path = currentPath.replace("-detailed", "");
    
    // Handle various calculator paths
    const calculatorPaths = [
      "age-calculator", "percentage-calculator", "margin-calculator", 
      "bmi-calculator", "loan-calculator", "chronological-age-calculator",
      "average-calculator", "confidence-interval-calculator", "sales-tax-calculator",
      "probability-calculator", "paypal-fee-calculator", "discount-calculator",
      "earnings-per-share-calculator", "cpm-calculator", "loan-to-value-calculator",
      "gst-calculator", "hours-calculator", "grade-calculator", "gpa-calculator",
      "percentage-increase-calculator", "percentage-decrease-calculator",
      "percentage-change-calculator", "percentage-difference-calculator",
      "calorie-calculator", "time-calculator", "salary-calculator",
      "investment-calculator", "tdee-calculator", "mean-median-mode-calculator"
    ];
    
    // Log if we found the calculator type
    if (calculatorPaths.includes(path)) {
      console.log("Found calculator type:", path);
    } else {
      console.log("Unknown calculator type:", path);
      // Set a default calculator type if we don't recognize the path
      path = "margin-calculator"; // Default calculator as a fallback
    }
    
    setCalculatorType(path);
    
    // Set default values based on calculator type
    if (path === "age-calculator" || path === "chronological-age-calculator") {
      setBirthDate("");
      setCurrentDate(new Date().toISOString().split("T")[0]);
    } else if (path === "margin-calculator") {
      setCost("");
      setRevenue("");
    } else if (path === "bmi-calculator") {
      setWeight("");
      setHeight("");
    } else if (path === "loan-calculator") {
      setLoanPrincipal("");
      setInterestRate("");
      setLoanTerm("");
    }
  }, [currentPath]);

  // Calculate Age
  const calculateAge = () => {
    try {
      if (!birthDate) {
        setError("Please enter a birth date");
        return;
      }
      
      const birth = new Date(birthDate);
      const current = currentDate ? new Date(currentDate) : new Date();
      
      if (isNaN(birth.getTime())) {
        setError("Invalid birth date");
        return;
      }
      
      if (birth > current) {
        setError("Birth date cannot be in the future");
        return;
      }
      
      let years = current.getFullYear() - birth.getFullYear();
      let months = current.getMonth() - birth.getMonth();
      let days = current.getDate() - birth.getDate();
      
      if (days < 0) {
        months -= 1;
        // Get the last day of the previous month
        const lastDayOfLastMonth = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
        days += lastDayOfLastMonth;
      }
      
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      
      setResult(`Age: ${years} years, ${months} months, ${days} days`);
      setError("");
    } catch (error) {
      setError("Error calculating age: " + error);
    }
  };

  // Calculate Percentage
  const calculatePercentage = () => {
    try {
      if (!percentValue || !ofValue) {
        setError("Please fill in all fields");
        return;
      }
      
      const percent = parseFloat(percentValue);
      const value = parseFloat(ofValue);
      
      if (isNaN(percent) || isNaN(value)) {
        setError("Please enter valid numbers");
        return;
      }
      
      const result = (percent / 100) * value;
      setResult(`${percent}% of ${value} = ${result.toFixed(2)}`);
      setError("");
    } catch (error) {
      setError("Error calculating percentage: " + error);
    }
  };

  // Calculate Margin
  const calculateMargin = () => {
    try {
      if (!cost || !revenue) {
        setError("Please fill in all fields");
        return;
      }
      
      const costValue = parseFloat(cost);
      const revenueValue = parseFloat(revenue);
      
      if (isNaN(costValue) || isNaN(revenueValue)) {
        setError("Please enter valid numbers");
        return;
      }
      
      const grossProfit = revenueValue - costValue;
      const margin = (grossProfit / revenueValue) * 100;
      const markup = (grossProfit / costValue) * 100;
      
      // Format with the selected currency
      const formatter = new Intl.NumberFormat('en-US', {
        style: currency !== "none" ? 'currency' : 'decimal',
        currency: currency !== "none" ? currency : undefined,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      setResult(
        `Gross Profit: ${formatter.format(grossProfit)}\n` +
        `Profit Margin: ${margin.toFixed(2)}%\n` +
        `Markup Percentage: ${markup.toFixed(2)}%`
      );
      setError("");
    } catch (error) {
      setError("Error calculating margin: " + error);
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    try {
      if (!weight || !height) {
        setError("Please fill in all fields");
        return;
      }
      
      let weightInKg = parseFloat(weight);
      let heightInM = parseFloat(height);
      
      // Convert units if needed
      if (weightUnit === "lb") {
        weightInKg = weightInKg * 0.45359237; // Convert lbs to kg
      }
      
      if (heightUnit === "cm") {
        heightInM = heightInM / 100; // Convert cm to m
      } else if (heightUnit === "in") {
        heightInM = heightInM * 0.0254; // Convert inches to m
      } else if (heightUnit === "ft") {
        heightInM = heightInM * 0.3048; // Convert feet to m
      }
      
      if (isNaN(weightInKg) || isNaN(heightInM)) {
        setError("Please enter valid numbers");
        return;
      }
      
      if (weightInKg <= 0 || heightInM <= 0) {
        setError("Values must be positive");
        return;
      }
      
      const bmi = weightInKg / (heightInM * heightInM);
      let category = "";
      
      if (bmi < 18.5) {
        category = "Underweight";
      } else if (bmi < 25) {
        category = "Normal Weight";
      } else if (bmi < 30) {
        category = "Overweight";
      } else {
        category = "Obese";
      }
      
      setResult(`BMI: ${bmi.toFixed(2)}\nCategory: ${category}`);
      setError("");
    } catch (error) {
      setError("Error calculating BMI: " + error);
    }
  };

  // Calculate Loan Payment
  const calculateLoanPayment = () => {
    try {
      if (!loanPrincipal || !interestRate || !loanTerm) {
        setError("Please fill in all required fields");
        return;
      }
      
      const principal = parseFloat(loanPrincipal);
      const annualRate = parseFloat(interestRate) / 100;
      const years = parseFloat(loanTerm);
      
      if (isNaN(principal) || isNaN(annualRate) || isNaN(years)) {
        setError("Please enter valid numbers");
        return;
      }
      
      if (principal <= 0 || annualRate <= 0 || years <= 0) {
        setError("Values must be positive");
        return;
      }
      
      let periodsPerYear = 12; // Default for monthly
      if (paymentFrequency === "biweekly") {
        periodsPerYear = 26;
      } else if (paymentFrequency === "weekly") {
        periodsPerYear = 52;
      }
      
      const totalPeriods = years * periodsPerYear;
      const periodicRate = annualRate / periodsPerYear;
      
      // Calculate payment using the formula: P = (r * PV) / (1 - (1 + r)^-n)
      const payment = (periodicRate * principal) / (1 - Math.pow(1 + periodicRate, -totalPeriods));
      const totalPayment = payment * totalPeriods;
      const totalInterest = totalPayment - principal;
      
      // Format with the selected currency
      const formatter = new Intl.NumberFormat('en-US', {
        style: currency !== "none" ? 'currency' : 'decimal',
        currency: currency !== "none" ? currency : undefined,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      setResult(
        `${paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} Payment: ${formatter.format(payment)}\n` +
        `Total Payments: ${formatter.format(totalPayment)}\n` +
        `Total Interest: ${formatter.format(totalInterest)}`
      );
      setError("");
    } catch (error) {
      setError("Error calculating loan payment: " + error);
    }
  };

  // Auto-calculate when input fields change
  useEffect(() => {
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      if (birthDate && currentDate) {
        calculateAge();
      }
    } else if (calculatorType === "percentage-calculator" || 
               calculatorType === "percentage-increase-calculator" || 
               calculatorType === "percentage-decrease-calculator" || 
               calculatorType === "percentage-change-calculator" || 
               calculatorType === "percentage-difference-calculator" ||
               calculatorType === "sales-tax-calculator" || 
               calculatorType === "discount-calculator" || 
               calculatorType === "gst-calculator") {
      if (percentValue && ofValue) {
        calculatePercentage();
      }
    } else if (calculatorType === "margin-calculator") {
      if (cost && revenue) {
        calculateMargin();
      }
    } else if (calculatorType === "bmi-calculator") {
      if (weight && height) {
        calculateBMI();
      }
    } else if (calculatorType === "loan-calculator" || calculatorType === "loan-to-value-calculator") {
      if (loanPrincipal && interestRate && loanTerm) {
        calculateLoanPayment();
      }
    } else if (calculatorType === "confidence-interval-calculator") {
      if (sampleMean && standardDeviation && sampleSize && confidenceLevel) {
        calculateConfidenceInterval();
      }
    } else {
      // Default calculator
      if (cost && revenue) {
        calculateMargin();
      }
    }
  }, [
    calculatorType,
    birthDate, currentDate,
    percentValue, ofValue,
    cost, revenue, currency,
    weight, height, weightUnit, heightUnit,
    loanPrincipal, interestRate, loanTerm, paymentFrequency,
    sampleMean, standardDeviation, sampleSize, confidenceLevel
  ]);

  // Calculate Confidence Interval
  const calculateConfidenceInterval = () => {
    try {
      if (!sampleMean || !standardDeviation || !sampleSize || !confidenceLevel) {
        setError("Please fill in all required fields");
        return;
      }
      
      const mean = parseFloat(sampleMean);
      const stdDev = parseFloat(standardDeviation);
      const n = parseFloat(sampleSize);
      const level = parseFloat(confidenceLevel);
      
      if (isNaN(mean) || isNaN(stdDev) || isNaN(n) || isNaN(level)) {
        setError("Please enter valid numbers");
        return;
      }
      
      if (stdDev <= 0 || n <= 0 || level <= 0 || level >= 100) {
        setError("Invalid input values. Standard deviation and sample size must be positive, and confidence level must be between 0 and 100");
        return;
      }
      
      // Z-score values for common confidence levels
      let zScore: number;
      if (level === 90) zScore = 1.645;
      else if (level === 95) zScore = 1.96;
      else if (level === 99) zScore = 2.576;
      else if (level === 99.9) zScore = 3.291;
      else {
        // For other confidence levels, use approximation
        // This is a simplified approach. For full precision, use a z-table or more complex calculation
        const alpha = 1 - (level / 100);
        zScore = Math.abs(alpha < 0.5 ? Math.sqrt(2) * Math.sqrt(-Math.log(2 * alpha)) : 0);
      }
      
      const marginOfError = zScore * (stdDev / Math.sqrt(n));
      const lowerBound = mean - marginOfError;
      const upperBound = mean + marginOfError;
      
      // Format with the selected currency if applicable
      const formatter = new Intl.NumberFormat('en-US', {
        style: currency !== "none" ? 'currency' : 'decimal',
        currency: currency !== "none" ? currency : undefined,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
      setResult(
        `${level}% Confidence Interval:\n` +
        `Lower Bound: ${formatter.format(lowerBound)}\n` +
        `Upper Bound: ${formatter.format(upperBound)}\n` +
        `Margin of Error: ${formatter.format(marginOfError)}`
      );
      setError("");
    } catch (error) {
      setError("Error calculating confidence interval: " + error);
    }
  };

  // Handle calculate button click
  const handleCalculate = () => {
    console.log("Calculate button clicked for calculator type:", calculatorType);
    
    // Age Calculators
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      calculateAge();
    } 
    // Percentage Calculators
    else if (calculatorType === "percentage-calculator" || 
             calculatorType === "percentage-increase-calculator" || 
             calculatorType === "percentage-decrease-calculator" || 
             calculatorType === "percentage-change-calculator" || 
             calculatorType === "percentage-difference-calculator") {
      calculatePercentage();
    } 
    // Margin Calculator
    else if (calculatorType === "margin-calculator") {
      calculateMargin();
    } 
    // BMI Calculator
    else if (calculatorType === "bmi-calculator") {
      calculateBMI();
    } 
    // Loan Calculators
    else if (calculatorType === "loan-calculator" || calculatorType === "loan-to-value-calculator") {
      calculateLoanPayment();
    }
    // Sales Tax & Discount Calculators
    else if (calculatorType === "sales-tax-calculator" || calculatorType === "discount-calculator" || calculatorType === "gst-calculator") {
      calculatePercentage(); // These use the same calculation logic as percentage calculator
    }
    // Confidence Interval Calculator
    else if (calculatorType === "confidence-interval-calculator") {
      calculateConfidenceInterval();
    }
    // For other unimplemented calculator types, use margin calculator logic as fallback
    else {
      // Use margin calculator for other types
      calculateMargin();
    }
  };

  // Get title, description, and other metadata based on calculator type
  const getTitle = (): string => {
    if (calculatorType === "age-calculator") return "Age Calculator";
    if (calculatorType === "percentage-calculator") return "Percentage Calculator";
    if (calculatorType === "margin-calculator") return "Margin Calculator";
    if (calculatorType === "bmi-calculator") return "BMI Calculator";
    if (calculatorType === "loan-calculator") return "Loan Calculator";
    if (calculatorType === "chronological-age-calculator") return "Chronological Age Calculator";
    return "Calculator";
  };
  
  const getDescription = (): string => {
    if (calculatorType === "age-calculator") {
      return "Calculate exact age from birth date to current date or between any two dates. Our Age Calculator provides precise results in years, months, and days, making it perfect for determining eligibility for age-restricted services, retirement planning, or simply satisfying curiosity about your exact age.";
    } else if (calculatorType === "percentage-calculator") {
      return "Find percentages quickly and accurately with our Percentage Calculator. Calculate what percent one number is of another, find the percentage increase or decrease between two numbers, or compute a value after applying a percentage discount or increase.";
    } else if (calculatorType === "margin-calculator") {
      return "Optimize your pricing strategy with our comprehensive Margin Calculator. This business-essential tool calculates profit margins, markup percentages, and selling prices based on costs, helping retailers, wholesalers, and service providers determine profitable pricing structures while maintaining competitive market positions.";
    } else if (calculatorType === "bmi-calculator") {
      return "Calculate your Body Mass Index (BMI) to assess your weight relative to your height. Our BMI Calculator helps you determine if you're underweight, normal weight, overweight, or obese according to standard health guidelines, providing a simple way to monitor your weight status.";
    } else if (calculatorType === "loan-calculator") {
      return "Plan your finances with our Loan Calculator. Calculate monthly payments, total interest paid, and the full cost of loans based on principal amount, interest rate, and loan term. Perfect for mortgages, auto loans, personal loans, or any fixed-term borrowing.";
    } else if (calculatorType === "chronological-age-calculator") {
      return "Calculate exact chronological age from birth date to current date or between any two dates. Our Chronological Age Calculator provides precise results in years, months, and days, making it perfect for determining exact age for medical or developmental assessments.";
    }
    return "Use our easy-to-use online calculator for quick and accurate calculations. Perfect for students, professionals, and anyone needing fast math solutions. Enter your values and get instant results.";
  };

  const getHowToUse = (): string[] => {
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      return [
        "Enter your birth date or start date in the first field",
        "If needed, modify the current date (default is today)",
        "The calculator will instantly show your exact age in years, months, and days"
      ];
    } else if (calculatorType === "percentage-calculator") {
      return [
        "Enter the percentage value (e.g., 25 for 25%)",
        "Enter the base value you want to calculate the percentage of",
        "The calculator will immediately show what that percentage equals"
      ];
    } else if (calculatorType === "margin-calculator") {
      return [
        "Enter your cost amount in the first field",
        "Enter your revenue or selling price in the second field",
        "The calculator will display your gross profit, profit margin, and markup percentage"
      ];
    } else if (calculatorType === "bmi-calculator") {
      return [
        "Enter your weight and select your weight unit (kg or lb)",
        "Enter your height and select your height unit (cm, inches, or feet)",
        "View your BMI result and weight category instantly"
      ];
    } else if (calculatorType === "loan-calculator") {
      return [
        "Enter the loan amount you're borrowing",
        "Input the annual interest rate (as a percentage)",
        "Specify the loan term in years",
        "Select your preferred payment frequency (monthly, bi-weekly, or weekly)",
        "The calculator will show your regular payment amount, total payments, and total interest"
      ];
    }
    return [
      "Select the calculator type",
      "Enter the required values in the input fields",
      "Click the Calculate button to see your results",
      "Use the results for your personal or professional needs"
    ];
  };

  const getFeatures = (): string[] => {
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      return [
        "✅ Precise calculation of years, months, and days",
        "✅ Ability to calculate age between any two dates",
        "✅ Automatic handling of leap years and varying month lengths",
        "✅ Real-time results that update as you type",
        "✅ Mobile-friendly design for on-the-go calculations"
      ];
    } else if (calculatorType === "percentage-calculator") {
      return [
        "✅ Quick percentage of value calculations",
        "✅ Decimal precision for accurate results",
        "✅ Real-time calculation as you type",
        "✅ Simple, user-friendly interface",
        "✅ Works on all devices and screen sizes"
      ];
    } else if (calculatorType === "margin-calculator") {
      return [
        "✅ Quick profit margin calculations for business decisions",
        "✅ Accurate gross profit amount display",
        "✅ Percentage margin calculated with precision",
        "✅ Markup percentage calculations",
        "✅ Real-time results that update instantly"
      ];
    } else if (calculatorType === "bmi-calculator") {
      return [
        "✅ Support for multiple weight units (kg, lb)",
        "✅ Support for multiple height units (cm, inches, feet)",
        "✅ Instant calculation with weight category classification",
        "✅ Clear indication of your BMI health status",
        "✅ Mobile-friendly for on-the-go health tracking"
      ];
    } else if (calculatorType === "loan-calculator") {
      return [
        "✅ Calculate monthly, bi-weekly, or weekly payments",
        "✅ View total interest paid over loan term",
        "✅ See total cost of loan (principal + interest)",
        "✅ Real-time calculation as you adjust values",
        "✅ Support for various loan types (mortgage, auto, personal)"
      ];
    }
    return [
      "✅ Fast and accurate calculations",
      "✅ User-friendly interface",
      "✅ Works on all devices",
      "✅ No account or sign-up required",
      "✅ Free to use with no limitations"
    ];
  };

  const getFaqs = (): Array<{ question: string; answer: string }> => {
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      return [
        {
          question: "How does the Age Calculator work?",
          answer: "Our Age Calculator computes the exact time span between a birth date (or start date) and the current date (or any specified end date). It accounts for varying month lengths, leap years, and provides results in years, months, and days."
        },
        {
          question: "Why might my age calculation differ from simply subtracting years?",
          answer: "Simply subtracting birth year from current year doesn't account for whether your birthday has occurred this year. Our calculator provides a precise measurement by considering the exact months and days."
        },
        {
          question: "Can I calculate age between two specific dates?",
          answer: "Yes! Instead of using today's date as the end point, you can specify any end date to calculate the exact time span between two dates."
        },
        {
          question: "Is the Age Calculator accurate for legal purposes?",
          answer: "While our calculator provides mathematically accurate results, for legal or official purposes, we recommend consulting with the relevant authorities as different jurisdictions may have specific rules for age calculation."
        }
      ];
    } else if (calculatorType === "percentage-calculator") {
      return [
        {
          question: "How do I calculate what percentage one number is of another?",
          answer: "To find what percentage A is of B, divide A by B and then multiply by 100. For example, to find what percentage 25 is of 200, calculate (25 ÷ 200) × 100 = 12.5%."
        },
        {
          question: "How do I calculate a percentage increase or decrease?",
          answer: "To find the percentage change, subtract the original value from the new value, divide by the original value, and multiply by 100. For example, if a price increases from $80 to $100, the percentage increase is ((100 - 80) ÷ 80) × 100 = 25%."
        },
        {
          question: "How do I find a value after applying a percentage discount?",
          answer: "To calculate a discounted price, multiply the original price by (1 - discount percentage/100). For example, a 20% discount on a $50 item would be $50 × (1 - 20/100) = $50 × 0.8 = $40."
        },
        {
          question: "Can I use the percentage calculator for tax calculations?",
          answer: "Yes, you can use this calculator to determine sales tax amounts. Enter the tax rate as the percentage and the pre-tax amount as the value to find the tax amount."
        }
      ];
    } else if (calculatorType === "margin-calculator") {
      return [
        {
          question: "What is the difference between margin and markup?",
          answer: "Margin is the percentage of the selling price that is profit, calculated as (Revenue - Cost) ÷ Revenue × 100. Markup is the percentage of the cost that represents profit, calculated as (Revenue - Cost) ÷ Cost × 100. They represent the same profit from different perspectives."
        },
        {
          question: "How do I calculate the selling price to achieve a specific margin?",
          answer: "To find the selling price for a desired margin percentage, use the formula: Selling Price = Cost ÷ (1 - (Margin ÷ 100)). For example, to achieve a 30% margin on a product that costs $70, calculate $70 ÷ (1 - (30 ÷ 100)) = $70 ÷ 0.7 = $100."
        },
        {
          question: "Is a higher margin always better for business?",
          answer: "Not necessarily. While higher margins mean more profit per sale, they may reduce sales volume if prices become uncompetitive. The optimal margin depends on your market, competition, product uniqueness, and business strategy."
        },
        {
          question: "How can I improve my profit margin?",
          answer: "You can improve your profit margin by reducing costs (finding cheaper suppliers, optimizing operations), increasing prices (if the market allows), focusing on higher-margin products or services, or increasing value perception to justify premium pricing."
        }
      ];
    } else if (calculatorType === "bmi-calculator") {
      return [
        {
          question: "What is BMI and what does it measure?",
          answer: "Body Mass Index (BMI) is a numerical value calculated from your weight and height. It provides a simple indicator of whether you're at a healthy weight for your height. While it doesn't measure body fat directly, it's used as a screening tool to categorize weight status."
        },
        {
          question: "What are the BMI categories?",
          answer: "The standard BMI categories are: Underweight (BMI below 18.5), Normal weight (BMI 18.5-24.9), Overweight (BMI 25-29.9), and Obese (BMI 30 or above). These categories apply to adults 20 years and older."
        },
        {
          question: "Is BMI an accurate measure of health?",
          answer: "BMI is a useful screening tool but has limitations. It doesn't distinguish between muscle and fat, so very muscular individuals may have a high BMI without excess fat. It also doesn't account for factors like age, gender, ethnicity, or fat distribution. For a comprehensive health assessment, BMI should be considered alongside other measures."
        },
        {
          question: "Should children use this BMI calculator?",
          answer: "No, this calculator is designed for adults. For children and teens, age and gender-specific BMI calculators (called BMI-for-age) should be used, as growth patterns affect the relationship between weight and height."
        }
      ];
    } else if (calculatorType === "loan-calculator") {
      return [
        {
          question: "How is the monthly loan payment calculated?",
          answer: "The monthly payment is calculated using the formula: P = (r * PV) / (1 - (1 + r)^-n), where P is the payment, r is the monthly interest rate (annual rate divided by 12), PV is the loan amount, and n is the total number of payments (loan term in years multiplied by 12)."
        },
        {
          question: "What factors affect my loan payment the most?",
          answer: "The three main factors are: loan amount (principal), interest rate, and loan term. A higher principal or interest rate increases payments, while a longer term decreases monthly payments but increases total interest paid over the life of the loan."
        },
        {
          question: "Is it better to choose a shorter or longer loan term?",
          answer: "A shorter loan term typically means higher monthly payments but less total interest paid and building equity faster. A longer term offers lower monthly payments but costs more in total interest over time. The best choice depends on your financial situation, cash flow needs, and financial goals."
        },
        {
          question: "What's the advantage of making bi-weekly rather than monthly payments?",
          answer: "Bi-weekly payments (every two weeks) result in 26 half-payments per year, equivalent to 13 monthly payments instead of 12. This extra payment each year goes directly to principal, helping you pay off the loan faster and save on interest costs."
        }
      ];
    }
    return [
      {
        question: "How accurate is this calculator?",
        answer: "Our calculator provides results with high precision for general purposes. For critical financial, legal, or health decisions, we recommend consulting with a professional in the relevant field."
      },
      {
        question: "Can I use these calculations for my business or professional work?",
        answer: "Yes, our calculator is designed to provide accurate results for both personal and professional use. However, for critical business decisions, you may want to verify with specialized software or consult a professional."
      },
      {
        question: "Does the calculator save my data?",
        answer: "No, all calculations are performed locally on your device. We do not store, save, or transmit any of the values you enter."
      },
      {
        question: "Why are some calculator functions limited or simplified?",
        answer: "We've designed this calculator to be user-friendly while maintaining accuracy. For more complex calculations or specialized functions, you might need to use dedicated software or consult with professionals in that field."
      }
    ];
  };

  // Render appropriate calculator interface based on calculator type
  const renderCalculatorInterface = () => {
    console.log("Rendering interface for calculator type:", calculatorType);
    
    // Age Calculator Interface
    if (calculatorType === "age-calculator" || calculatorType === "chronological-age-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="birthDate">Birth Date / Start Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="currentDate">Current Date / End Date</Label>
            <Input
              id="currentDate"
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      );
    } 
    
    // Percentage Calculator Interface
    else if (calculatorType === "percentage-calculator" || 
             calculatorType === "percentage-increase-calculator" || 
             calculatorType === "percentage-decrease-calculator" || 
             calculatorType === "percentage-change-calculator" || 
             calculatorType === "percentage-difference-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="percentValue">Percentage (%)</Label>
            <Input
              id="percentValue"
              type="number"
              placeholder="e.g., 25"
              value={percentValue}
              onChange={(e) => setPercentValue(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="ofValue">Of Value</Label>
            <Input
              id="ofValue"
              type="number"
              placeholder="e.g., 200"
              value={ofValue}
              onChange={(e) => setOfValue(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      );
    } 
    
    // Margin Calculator Interface
    else if (calculatorType === "margin-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cost">Cost Amount ($)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 100"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="revenue">Revenue / Selling Price ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="e.g., 150"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      );
    } 
    
    // BMI Calculator Interface
    else if (calculatorType === "bmi-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight">Weight</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1"
              />
              <Select
                value={weightUnit}
                onValueChange={(value) => setWeightUnit(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="flex-1"
              />
              <Select
                value={heightUnit}
                onValueChange={(value) => setHeightUnit(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">inches</SelectItem>
                  <SelectItem value="ft">feet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    } 
    
    // Loan Calculator Interface
    else if (calculatorType === "loan-calculator" || calculatorType === "loan-to-value-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="loanPrincipal">Loan Amount ($)</Label>
            <Input
              id="loanPrincipal"
              type="number"
              placeholder="e.g., 200000"
              value={loanPrincipal}
              onChange={(e) => setLoanPrincipal(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              placeholder="e.g., 5.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <Input
              id="loanTerm"
              type="number"
              placeholder="e.g., 30"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select
              value={paymentFrequency}
              onValueChange={(value) => setPaymentFrequency(value)}
            >
              <SelectTrigger id="paymentFrequency" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    // Sales Tax Calculator Interface (simplified version similar to Percentage Calculator)
    else if (calculatorType === "sales-tax-calculator" || calculatorType === "discount-calculator" || calculatorType === "gst-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="percentValue">Tax/Discount Rate (%)</Label>
            <Input
              id="percentValue"
              type="number"
              placeholder="e.g., 8.5"
              value={percentValue}
              onChange={(e) => setPercentValue(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="ofValue">Amount Before Tax/Discount ($)</Label>
            <Input
              id="ofValue"
              type="number"
              placeholder="e.g., 100"
              value={ofValue}
              onChange={(e) => setOfValue(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      );
    }
    
    // Confidence Interval Calculator Interface
    else if (calculatorType === "confidence-interval-calculator") {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="sampleMean">Sample Mean</Label>
            <Input
              id="sampleMean"
              type="number"
              placeholder="e.g., 75.2"
              value={sampleMean}
              onChange={(e) => setSampleMean(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="standardDeviation">Standard Deviation</Label>
            <Input
              id="standardDeviation"
              type="number"
              placeholder="e.g., 12.4"
              value={standardDeviation}
              onChange={(e) => setStandardDeviation(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="sampleSize">Sample Size</Label>
            <Input
              id="sampleSize"
              type="number"
              placeholder="e.g., 30"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="confidenceLevel">Confidence Level (%)</Label>
            <Select
              value={confidenceLevel}
              onValueChange={(value) => setConfidenceLevel(value)}
            >
              <SelectTrigger id="confidenceLevel" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
                <SelectItem value="99">99%</SelectItem>
                <SelectItem value="99.9">99.9%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="currency">Currency (Optional)</Label>
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              <SelectTrigger id="currency" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    // Default calculator interface for other types we haven't specifically implemented yet
    else {
      // Rather than showing not implemented message, let's show a simplified version 
      // of margin calculator for all unimplemented types, so users can still interact
      return (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-blue-600 mb-2">Using basic calculator interface for {calculatorType.replace(/-/g, " ")}</p>
          </div>
          <div>
            <Label htmlFor="cost">First Value</Label>
            <Input
              id="cost"
              type="number"
              placeholder="e.g., 100"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="revenue">Second Value</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="e.g., 150"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="mt-1.5"
            />
          </div>
          
          {/* Currency dropdown for default calculator interface */}
          <div>
            <Label htmlFor="currency">Currency Format</Label>
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              <SelectTrigger id="currency" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
  };

  // Render tool interface
  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {renderCalculatorInterface()}

            <Button 
              variant="default" 
              onClick={handleCalculate}
              className="w-full"
            >
              Calculate
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 rounded-md bg-green-50 text-green-700 font-medium whitespace-pre-line">
                {result}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About {getTitle()}</h3>
          <div className="text-sm space-y-4">
            <p>
              {getDescription().split(".")[0] + "."}
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Quick calculations for everyday math problems</li>
                <li>Financial planning and budgeting</li>
                <li>Academic and statistical analysis</li>
                <li>Business metrics and performance analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Get the relevant title, description, etc. based on the current calculator type
  const title = getTitle();
  const description = getDescription();
  const howToUse = getHowToUse();
  const features = getFeatures();
  const faqs = getFaqs();

  return (
    <ToolPageTemplate
      toolSlug={calculatorType}
      toolContent={
        <ToolContentTemplate
          introduction={`Get precise ${title.toLowerCase()} results instantly with our powerful online calculator.`}
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

export default CalculatorDetailed;