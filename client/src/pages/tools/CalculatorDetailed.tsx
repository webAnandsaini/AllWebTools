import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CalculatorDetailed = () => {
  const [location] = useLocation();
  const currentPath = location.split("/").pop() || "";

  // Initialize state with the appropriate calculator type
  useEffect(() => {
    const path = currentPath.replace("-detailed", "");
    if (path && calculators[path]) {
      setCalculatorType(path);
    }
  }, [currentPath]);

  // Common state
  const [calculatorType, setCalculatorType] = useState<string>("age-calculator");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Age Calculator state
  const [birthDate, setBirthDate] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // Percentage Calculator state
  const [percentValue, setPercentValue] = useState<string>("");
  const [ofValue, setOfValue] = useState<string>("");

  // Average Calculator state
  const [numbersToAverage, setNumbersToAverage] = useState<string>("");

  // Confidence Interval Calculator state
  const [mean, setMean] = useState<string>("");
  const [standardDeviation, setStandardDeviation] = useState<string>("");
  const [sampleSize, setSampleSize] = useState<string>("");
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");

  // Sales Tax Calculator state
  const [amount, setAmount] = useState<string>("");
  const [taxRate, setTaxRate] = useState<string>("");
  
  // Margin Calculator state
  const [cost, setCost] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");
  
  // Probability Calculator state
  const [favorableOutcomes, setFavorableOutcomes] = useState<string>("");
  const [totalOutcomes, setTotalOutcomes] = useState<string>("");
  
  // PayPal Fee Calculator state
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [feeType, setFeeType] = useState<string>("standard");
  
  // Discount Calculator state
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  
  // EPS Calculator state
  const [netIncome, setNetIncome] = useState<string>("");
  const [preferredDividends, setPreferredDividends] = useState<string>("");
  const [outstandingShares, setOutstandingShares] = useState<string>("");
  
  // CPM Calculator state
  const [adCost, setAdCost] = useState<string>("");
  const [impressions, setImpressions] = useState<string>("");
  
  // Loan to Value Calculator state
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string>("");
  
  // GST Calculator state
  const [priceBeforeGST, setPriceBeforeGST] = useState<string>("");
  const [gstRate, setGstRate] = useState<string>("10");
  const [gstInclusive, setGstInclusive] = useState<boolean>(false);
  
  // BMI Calculator state
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  
  // Chronological Age Calculator (same as Age Calculator)
  
  // Loan Calculator state
  const [loanPrincipal, setLoanPrincipal] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [paymentFrequency, setPaymentFrequency] = useState<string>("monthly");
  
  // Hours Calculator state
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [breakTime, setBreakTime] = useState<string>("0");
  
  // Grade Calculator state
  const [assignments, setAssignments] = useState<string>("");
  const [assignmentWeights, setAssignmentWeights] = useState<string>("");
  
  // GPA Calculator state
  const [grades, setGrades] = useState<string>("");
  const [credits, setCredits] = useState<string>("");
  
  // Percentage Increase/Decrease/Change/Difference Calculator state
  const [oldValue, setOldValue] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  
  // Calorie Calculator state
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [activityLevel, setActivityLevel] = useState<string>("sedentary");
  
  // Time Calculator state
  const [hours1, setHours1] = useState<string>("");
  const [minutes1, setMinutes1] = useState<string>("");
  const [seconds1, setSeconds1] = useState<string>("");
  const [hours2, setHours2] = useState<string>("");
  const [minutes2, setMinutes2] = useState<string>("");
  const [seconds2, setSeconds2] = useState<string>("");
  const [operation, setOperation] = useState<string>("add");
  
  // Salary Calculator state
  const [annualSalary, setAnnualSalary] = useState<string>("");
  const [payPeriod, setPayPeriod] = useState<string>("monthly");
  const [workingHours, setWorkingHours] = useState<string>("40");
  
  // Investment Calculator state
  const [initialInvestment, setInitialInvestment] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("");
  const [annualReturn, setAnnualReturn] = useState<string>("");
  const [investmentYears, setInvestmentYears] = useState<string>("");
  
  // TDEE Calculator state
  const [tdeeWeight, setTdeeWeight] = useState<string>("");
  const [tdeeHeight, setTdeeHeight] = useState<string>("");
  const [tdeeAge, setTdeeAge] = useState<string>("");
  const [tdeeGender, setTdeeGender] = useState<string>("male");
  const [tdeeActivity, setTdeeActivity] = useState<string>("sedentary");
  
  // Mean Median Mode Calculator state
  const [dataSet, setDataSet] = useState<string>("");

  // Calculator functions
  const calculators: { [key: string]: { calculate: () => void; title: string; } } = {
    "age-calculator": {
      calculate: () => {
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
      },
      title: "Age Calculator"
    },
    "percentage-calculator": {
      calculate: () => {
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
      },
      title: "Percentage Calculator"
    },
    "average-calculator": {
      calculate: () => {
        try {
          if (!numbersToAverage) {
            setError("Please enter numbers to average");
            return;
          }
          
          const numbers = numbersToAverage.split(",").map(num => parseFloat(num.trim()));
          
          if (numbers.some(isNaN)) {
            setError("Please enter valid numbers separated by commas");
            return;
          }
          
          const sum = numbers.reduce((acc, curr) => acc + curr, 0);
          const avg = sum / numbers.length;
          
          setResult(`Average: ${avg.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating average: " + error);
        }
      },
      title: "Average Calculator"
    },
    "confidence-interval-calculator": {
      calculate: () => {
        try {
          if (!mean || !standardDeviation || !sampleSize) {
            setError("Please fill in all fields");
            return;
          }
          
          const meanValue = parseFloat(mean);
          const sdValue = parseFloat(standardDeviation);
          const n = parseFloat(sampleSize);
          const confLevel = parseFloat(confidenceLevel) / 100;
          
          if (isNaN(meanValue) || isNaN(sdValue) || isNaN(n)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (n <= 0) {
            setError("Sample size must be positive");
            return;
          }
          
          // Z-scores for common confidence levels
          const zScores: { [key: string]: number } = {
            "90": 1.645,
            "95": 1.96,
            "99": 2.576
          };
          
          const zScore = zScores[confidenceLevel] || 1.96; // Default to 95% if not found
          const marginOfError = zScore * (sdValue / Math.sqrt(n));
          
          const lowerBound = meanValue - marginOfError;
          const upperBound = meanValue + marginOfError;
          
          setResult(`${confLevel * 100}% Confidence Interval: ${lowerBound.toFixed(2)} to ${upperBound.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating confidence interval: " + error);
        }
      },
      title: "Confidence Interval Calculator"
    },
    "sales-tax-calculator": {
      calculate: () => {
        try {
          if (!amount || !taxRate) {
            setError("Please fill in all fields");
            return;
          }
          
          const amountValue = parseFloat(amount);
          const rateValue = parseFloat(taxRate);
          
          if (isNaN(amountValue) || isNaN(rateValue)) {
            setError("Please enter valid numbers");
            return;
          }
          
          const taxAmount = amountValue * (rateValue / 100);
          const totalAmount = amountValue + taxAmount;
          
          setResult(`Tax Amount: $${taxAmount.toFixed(2)}\nTotal Amount: $${totalAmount.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating sales tax: " + error);
        }
      },
      title: "Sales Tax Calculator"
    },
    "margin-calculator": {
      calculate: () => {
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
          
          setResult(`Gross Profit: $${grossProfit.toFixed(2)}\nProfit Margin: ${margin.toFixed(2)}%`);
          setError("");
        } catch (error) {
          setError("Error calculating margin: " + error);
        }
      },
      title: "Margin Calculator"
    },
    "probability-calculator": {
      calculate: () => {
        try {
          if (!favorableOutcomes || !totalOutcomes) {
            setError("Please fill in all fields");
            return;
          }
          
          const favorable = parseFloat(favorableOutcomes);
          const total = parseFloat(totalOutcomes);
          
          if (isNaN(favorable) || isNaN(total)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (favorable > total) {
            setError("Favorable outcomes cannot exceed total outcomes");
            return;
          }
          
          if (total <= 0) {
            setError("Total outcomes must be positive");
            return;
          }
          
          const probability = favorable / total;
          
          setResult(`Probability: ${(probability * 100).toFixed(2)}% or ${probability.toFixed(4)} or ${favorable}/${total}`);
          setError("");
        } catch (error) {
          setError("Error calculating probability: " + error);
        }
      },
      title: "Probability Calculator"
    },
    "paypal-fee-calculator": {
      calculate: () => {
        try {
          if (!transactionAmount) {
            setError("Please enter a transaction amount");
            return;
          }
          
          const amount = parseFloat(transactionAmount);
          
          if (isNaN(amount)) {
            setError("Please enter a valid amount");
            return;
          }
          
          let fee = 0;
          let receiveAmount = 0;
          
          // PayPal fee structures (as of 2023)
          if (feeType === "standard") {
            // Standard rate for most transactions: 2.9% + $0.30
            fee = amount * 0.029 + 0.30;
            receiveAmount = amount - fee;
          } else if (feeType === "micropayment") {
            // For transactions under $10: 5% + $0.05
            fee = amount * 0.05 + 0.05;
            receiveAmount = amount - fee;
          } else if (feeType === "international") {
            // International transactions: 4.4% + $0.30
            fee = amount * 0.044 + 0.30;
            receiveAmount = amount - fee;
          }
          
          setResult(`Fee: $${fee.toFixed(2)}\nYou Receive: $${receiveAmount.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating PayPal fee: " + error);
        }
      },
      title: "PayPal Fee Calculator"
    },
    "discount-calculator": {
      calculate: () => {
        try {
          if (!originalPrice || !discountPercentage) {
            setError("Please fill in all fields");
            return;
          }
          
          const price = parseFloat(originalPrice);
          const discount = parseFloat(discountPercentage);
          
          if (isNaN(price) || isNaN(discount)) {
            setError("Please enter valid numbers");
            return;
          }
          
          const discountAmount = price * (discount / 100);
          const finalPrice = price - discountAmount;
          
          setResult(`Discount Amount: $${discountAmount.toFixed(2)}\nFinal Price: $${finalPrice.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating discount: " + error);
        }
      },
      title: "Discount Calculator"
    },
    "earnings-per-share-calculator": {
      calculate: () => {
        try {
          if (!netIncome || !outstandingShares) {
            setError("Please fill in all required fields");
            return;
          }
          
          const income = parseFloat(netIncome);
          const shares = parseFloat(outstandingShares);
          const dividends = preferredDividends ? parseFloat(preferredDividends) : 0;
          
          if (isNaN(income) || isNaN(shares) || isNaN(dividends)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (shares <= 0) {
            setError("Number of shares must be positive");
            return;
          }
          
          const eps = (income - dividends) / shares;
          
          setResult(`Earnings Per Share (EPS): $${eps.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating EPS: " + error);
        }
      },
      title: "Earnings Per Share Calculator"
    },
    "cpm-calculator": {
      calculate: () => {
        try {
          if (!adCost || !impressions) {
            setError("Please fill in all fields");
            return;
          }
          
          const cost = parseFloat(adCost);
          const imps = parseFloat(impressions);
          
          if (isNaN(cost) || isNaN(imps)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (imps <= 0) {
            setError("Impressions must be positive");
            return;
          }
          
          const cpm = (cost / imps) * 1000;
          
          setResult(`CPM (Cost Per Thousand Impressions): $${cpm.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating CPM: " + error);
        }
      },
      title: "CPM Calculator"
    },
    "loan-to-value-calculator": {
      calculate: () => {
        try {
          if (!loanAmount || !propertyValue) {
            setError("Please fill in all fields");
            return;
          }
          
          const loan = parseFloat(loanAmount);
          const value = parseFloat(propertyValue);
          
          if (isNaN(loan) || isNaN(value)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (value <= 0) {
            setError("Property value must be positive");
            return;
          }
          
          const ltv = (loan / value) * 100;
          
          setResult(`Loan-to-Value Ratio: ${ltv.toFixed(2)}%`);
          setError("");
        } catch (error) {
          setError("Error calculating LTV: " + error);
        }
      },
      title: "Loan to Value Calculator"
    },
    "gst-calculator": {
      calculate: () => {
        try {
          if (!priceBeforeGST) {
            setError("Please enter a price");
            return;
          }
          
          const price = parseFloat(priceBeforeGST);
          const rate = parseFloat(gstRate);
          
          if (isNaN(price) || isNaN(rate)) {
            setError("Please enter valid numbers");
            return;
          }
          
          let gstAmount = 0;
          let totalPrice = 0;
          
          if (gstInclusive) {
            // If price includes GST, calculate GST portion
            gstAmount = price - (price / (1 + (rate / 100)));
            totalPrice = price;
          } else {
            // If price excludes GST, calculate GST to add
            gstAmount = price * (rate / 100);
            totalPrice = price + gstAmount;
          }
          
          setResult(`GST Amount: $${gstAmount.toFixed(2)}\nTotal Price: $${totalPrice.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating GST: " + error);
        }
      },
      title: "GST Calculator"
    },
    "bmi-calculator": {
      calculate: () => {
        try {
          if (!weight || !height) {
            setError("Please fill in all fields");
            return;
          }
          
          let weightKg = parseFloat(weight);
          let heightM = parseFloat(height);
          
          if (isNaN(weightKg) || isNaN(heightM)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Convert to metric if needed
          if (weightUnit === "lb") {
            weightKg = weightKg * 0.45359237;
          }
          
          if (heightUnit === "cm") {
            heightM = heightM / 100;
          } else if (heightUnit === "in") {
            heightM = heightM * 0.0254;
          } else if (heightUnit === "ft") {
            heightM = heightM * 0.3048;
          }
          
          if (weightKg <= 0 || heightM <= 0) {
            setError("Weight and height must be positive");
            return;
          }
          
          const bmi = weightKg / (heightM * heightM);
          
          let category = "";
          if (bmi < 18.5) {
            category = "Underweight";
          } else if (bmi < 25) {
            category = "Normal weight";
          } else if (bmi < 30) {
            category = "Overweight";
          } else {
            category = "Obese";
          }
          
          setResult(`BMI: ${bmi.toFixed(1)}\nCategory: ${category}`);
          setError("");
        } catch (error) {
          setError("Error calculating BMI: " + error);
        }
      },
      title: "BMI Calculator"
    },
    "chronological-age-calculator": {
      calculate: () => {
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
          
          // Calculate total days for more precise chronological age
          const millisecondsPerDay = 1000 * 60 * 60 * 24;
          const totalDays = Math.floor((current.getTime() - birth.getTime()) / millisecondsPerDay);
          
          setResult(`Age: ${years} years, ${months} months, ${days} days\nTotal days lived: ${totalDays}`);
          setError("");
        } catch (error) {
          setError("Error calculating chronological age: " + error);
        }
      },
      title: "Chronological Age Calculator"
    },
    "loan-calculator": {
      calculate: () => {
        try {
          if (!loanPrincipal || !interestRate || !loanTerm) {
            setError("Please fill in all fields");
            return;
          }
          
          const principal = parseFloat(loanPrincipal);
          const rate = parseFloat(interestRate);
          const term = parseFloat(loanTerm);
          
          if (isNaN(principal) || isNaN(rate) || isNaN(term)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (principal <= 0 || rate <= 0 || term <= 0) {
            setError("All values must be positive");
            return;
          }
          
          // Convert annual rate to monthly rate
          const monthlyRate = (rate / 100) / 12;
          
          // Convert term to months based on payment frequency
          let totalPayments = term;
          if (paymentFrequency === "monthly") {
            totalPayments = term * 12;
          } else if (paymentFrequency === "biweekly") {
            totalPayments = term * 26;
          } else if (paymentFrequency === "weekly") {
            totalPayments = term * 52;
          }
          
          // Calculate monthly payment using formula: P = r * PV / (1 - (1 + r)^-n)
          const payment = (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
          
          const totalPayment = payment * totalPayments;
          const totalInterest = totalPayment - principal;
          
          setResult(`Payment: $${payment.toFixed(2)} per ${paymentFrequency.slice(0, -2)}\nTotal payment: $${totalPayment.toFixed(2)}\nTotal interest: $${totalInterest.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating loan: " + error);
        }
      },
      title: "Loan Calculator"
    },
    "hours-calculator": {
      calculate: () => {
        try {
          if (!startTime || !endTime) {
            setError("Please fill in start and end times");
            return;
          }
          
          const start = new Date(`1970-01-01T${startTime}`);
          const end = new Date(`1970-01-01T${endTime}`);
          const breakMinutes = parseFloat(breakTime);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(breakMinutes)) {
            setError("Please enter valid times");
            return;
          }
          
          let diffMs = end.getTime() - start.getTime();
          
          // If end time is earlier than start time, assume it's the next day
          if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
          }
          
          // Subtract break time in milliseconds
          diffMs -= breakMinutes * 60 * 1000;
          
          if (diffMs < 0) {
            setError("Break time exceeds working time");
            return;
          }
          
          const diffHrs = diffMs / (1000 * 60 * 60);
          const wholeHours = Math.floor(diffHrs);
          const minutes = Math.round((diffHrs - wholeHours) * 60);
          
          setResult(`Working time: ${wholeHours} hours and ${minutes} minutes`);
          setError("");
        } catch (error) {
          setError("Error calculating hours: " + error);
        }
      },
      title: "Hours Calculator"
    },
    "grade-calculator": {
      calculate: () => {
        try {
          if (!assignments || !assignmentWeights) {
            setError("Please fill in all fields");
            return;
          }
          
          const grades = assignments.split(",").map(g => parseFloat(g.trim()));
          const weights = assignmentWeights.split(",").map(w => parseFloat(w.trim()));
          
          if (grades.some(isNaN) || weights.some(isNaN)) {
            setError("Please enter valid numbers separated by commas");
            return;
          }
          
          if (grades.length !== weights.length) {
            setError("The number of grades must match the number of weights");
            return;
          }
          
          // Check if weights sum to 100%
          const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
          if (Math.abs(totalWeight - 100) > 0.01) {
            setError("Weights should sum to 100%");
            return;
          }
          
          // Calculate weighted average
          let weightedSum = 0;
          for (let i = 0; i < grades.length; i++) {
            weightedSum += grades[i] * (weights[i] / 100);
          }
          
          let letterGrade = "";
          if (weightedSum >= 90) {
            letterGrade = "A";
          } else if (weightedSum >= 80) {
            letterGrade = "B";
          } else if (weightedSum >= 70) {
            letterGrade = "C";
          } else if (weightedSum >= 60) {
            letterGrade = "D";
          } else {
            letterGrade = "F";
          }
          
          setResult(`Final Grade: ${weightedSum.toFixed(2)}%\nLetter Grade: ${letterGrade}`);
          setError("");
        } catch (error) {
          setError("Error calculating grade: " + error);
        }
      },
      title: "Grade Calculator"
    },
    "gpa-calculator": {
      calculate: () => {
        try {
          if (!grades || !credits) {
            setError("Please fill in all fields");
            return;
          }
          
          const gradeValues = grades.split(",").map(g => g.trim().toUpperCase());
          const creditValues = credits.split(",").map(c => parseFloat(c.trim()));
          
          if (creditValues.some(isNaN)) {
            setError("Please enter valid credit hours");
            return;
          }
          
          if (gradeValues.length !== creditValues.length) {
            setError("The number of grades must match the number of credit hours");
            return;
          }
          
          // Standard grade point values
          const gradePoints: { [key: string]: number } = {
            "A+": 4.0, "A": 4.0, "A-": 3.7,
            "B+": 3.3, "B": 3.0, "B-": 2.7,
            "C+": 2.3, "C": 2.0, "C-": 1.7,
            "D+": 1.3, "D": 1.0, "D-": 0.7,
            "F": 0.0
          };
          
          // Check if all grades are valid
          for (const grade of gradeValues) {
            if (!(grade in gradePoints)) {
              setError(`Invalid grade: ${grade}`);
              return;
            }
          }
          
          // Calculate GPA
          let totalQualityPoints = 0;
          let totalCredits = 0;
          
          for (let i = 0; i < gradeValues.length; i++) {
            totalQualityPoints += gradePoints[gradeValues[i]] * creditValues[i];
            totalCredits += creditValues[i];
          }
          
          const gpa = totalQualityPoints / totalCredits;
          
          setResult(`GPA: ${gpa.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating GPA: " + error);
        }
      },
      title: "GPA Calculator"
    },
    "percentage-increase-calculator": {
      calculate: () => {
        try {
          if (!oldValue || !newValue) {
            setError("Please fill in all fields");
            return;
          }
          
          const oldVal = parseFloat(oldValue);
          const newVal = parseFloat(newValue);
          
          if (isNaN(oldVal) || isNaN(newVal)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (oldVal === 0) {
            setError("Old value cannot be zero for percentage calculation");
            return;
          }
          
          const difference = newVal - oldVal;
          const percentageIncrease = (difference / Math.abs(oldVal)) * 100;
          
          if (percentageIncrease >= 0) {
            setResult(`Increase: ${percentageIncrease.toFixed(2)}%`);
          } else {
            setResult(`Decrease: ${Math.abs(percentageIncrease).toFixed(2)}%`);
          }
          setError("");
        } catch (error) {
          setError("Error calculating percentage increase: " + error);
        }
      },
      title: "Percentage Increase Calculator"
    },
    "percentage-decrease-calculator": {
      calculate: () => {
        try {
          if (!oldValue || !newValue) {
            setError("Please fill in all fields");
            return;
          }
          
          const oldVal = parseFloat(oldValue);
          const newVal = parseFloat(newValue);
          
          if (isNaN(oldVal) || isNaN(newVal)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (oldVal === 0) {
            setError("Old value cannot be zero for percentage calculation");
            return;
          }
          
          const difference = oldVal - newVal;
          const percentageDecrease = (difference / Math.abs(oldVal)) * 100;
          
          if (percentageDecrease >= 0) {
            setResult(`Decrease: ${percentageDecrease.toFixed(2)}%`);
          } else {
            setResult(`Increase: ${Math.abs(percentageDecrease).toFixed(2)}%`);
          }
          setError("");
        } catch (error) {
          setError("Error calculating percentage decrease: " + error);
        }
      },
      title: "Percentage Decrease Calculator"
    },
    "percentage-change-calculator": {
      calculate: () => {
        try {
          if (!oldValue || !newValue) {
            setError("Please fill in all fields");
            return;
          }
          
          const oldVal = parseFloat(oldValue);
          const newVal = parseFloat(newValue);
          
          if (isNaN(oldVal) || isNaN(newVal)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (oldVal === 0) {
            setError("Old value cannot be zero for percentage calculation");
            return;
          }
          
          const difference = newVal - oldVal;
          const percentageChange = (difference / Math.abs(oldVal)) * 100;
          
          if (percentageChange >= 0) {
            setResult(`Change: +${percentageChange.toFixed(2)}% (Increase)`);
          } else {
            setResult(`Change: ${percentageChange.toFixed(2)}% (Decrease)`);
          }
          setError("");
        } catch (error) {
          setError("Error calculating percentage change: " + error);
        }
      },
      title: "Percentage Change Calculator"
    },
    "percentage-difference-calculator": {
      calculate: () => {
        try {
          if (!oldValue || !newValue) {
            setError("Please fill in all fields");
            return;
          }
          
          const val1 = parseFloat(oldValue);
          const val2 = parseFloat(newValue);
          
          if (isNaN(val1) || isNaN(val2)) {
            setError("Please enter valid numbers");
            return;
          }
          
          if (val1 === 0 && val2 === 0) {
            setError("Both values cannot be zero for percentage difference calculation");
            return;
          }
          
          // Percentage difference formula: |a - b| / ((a + b) / 2) * 100
          const difference = Math.abs(val1 - val2);
          const average = (Math.abs(val1) + Math.abs(val2)) / 2;
          const percentageDifference = (difference / average) * 100;
          
          setResult(`Percentage Difference: ${percentageDifference.toFixed(2)}%`);
          setError("");
        } catch (error) {
          setError("Error calculating percentage difference: " + error);
        }
      },
      title: "Percentage Difference Calculator"
    },
    "calorie-calculator": {
      calculate: () => {
        try {
          if (!weight || !height || !age) {
            setError("Please fill in all fields");
            return;
          }
          
          let weightKg = parseFloat(weight);
          let heightCm = parseFloat(height);
          const ageValue = parseFloat(age);
          
          if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageValue)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Convert to metric if needed
          if (weightUnit === "lb") {
            weightKg = weightKg * 0.45359237;
          }
          
          if (heightUnit === "in") {
            heightCm = heightCm * 2.54;
          } else if (heightUnit === "ft") {
            heightCm = heightCm * 30.48;
          }
          
          // Calculate BMR using Mifflin-St Jeor Equation
          let bmr = 0;
          if (gender === "male") {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue + 5;
          } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue - 161;
          }
          
          // Apply activity multiplier
          let tdee = 0;
          switch (activityLevel) {
            case "sedentary":
              tdee = bmr * 1.2;
              break;
            case "light":
              tdee = bmr * 1.375;
              break;
            case "moderate":
              tdee = bmr * 1.55;
              break;
            case "active":
              tdee = bmr * 1.725;
              break;
            case "very_active":
              tdee = bmr * 1.9;
              break;
            default:
              tdee = bmr * 1.2;
          }
          
          const weightLossCals = tdee - 500;
          const weightGainCals = tdee + 500;
          
          setResult(`BMR: ${Math.round(bmr)} calories/day\nMaintenance: ${Math.round(tdee)} calories/day\nWeight Loss: ${Math.round(weightLossCals)} calories/day\nWeight Gain: ${Math.round(weightGainCals)} calories/day`);
          setError("");
        } catch (error) {
          setError("Error calculating calories: " + error);
        }
      },
      title: "Calorie Calculator"
    },
    "time-calculator": {
      calculate: () => {
        try {
          const h1 = hours1 ? parseFloat(hours1) : 0;
          const m1 = minutes1 ? parseFloat(minutes1) : 0;
          const s1 = seconds1 ? parseFloat(seconds1) : 0;
          
          const h2 = hours2 ? parseFloat(hours2) : 0;
          const m2 = minutes2 ? parseFloat(minutes2) : 0;
          const s2 = seconds2 ? parseFloat(seconds2) : 0;
          
          if (isNaN(h1) || isNaN(m1) || isNaN(s1) || isNaN(h2) || isNaN(m2) || isNaN(s2)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Convert all to seconds
          const time1InSeconds = h1 * 3600 + m1 * 60 + s1;
          const time2InSeconds = h2 * 3600 + m2 * 60 + s2;
          
          let resultInSeconds = 0;
          
          if (operation === "add") {
            resultInSeconds = time1InSeconds + time2InSeconds;
          } else if (operation === "subtract") {
            resultInSeconds = time1InSeconds - time2InSeconds;
            if (resultInSeconds < 0) {
              setError("Result is negative. Try swapping the order or changing the operation.");
              return;
            }
          } else if (operation === "multiply") {
            if (!hours2 && !minutes2 && !seconds2) {
              setError("Please enter a multiplier");
              return;
            }
            // For multiplication, we just use the first number as multiplier
            resultInSeconds = time1InSeconds * time2InSeconds;
          } else if (operation === "divide") {
            if (time2InSeconds === 0) {
              setError("Cannot divide by zero");
              return;
            }
            resultInSeconds = time1InSeconds / time2InSeconds;
          }
          
          // Convert back to hours, minutes, seconds
          const resultHours = Math.floor(resultInSeconds / 3600);
          const resultMinutes = Math.floor((resultInSeconds % 3600) / 60);
          const resultSeconds = Math.floor(resultInSeconds % 60);
          
          setResult(`Result: ${resultHours} hours, ${resultMinutes} minutes, ${resultSeconds} seconds`);
          setError("");
        } catch (error) {
          setError("Error calculating time: " + error);
        }
      },
      title: "Time Calculator"
    },
    "salary-calculator": {
      calculate: () => {
        try {
          if (!annualSalary) {
            setError("Please enter annual salary");
            return;
          }
          
          const salary = parseFloat(annualSalary);
          const hours = parseFloat(workingHours);
          
          if (isNaN(salary) || isNaN(hours)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Calculate different pay periods
          const monthlySalary = salary / 12;
          const biweeklySalary = salary / 26;
          const weeklySalary = salary / 52;
          const dailySalary = salary / 260; // Assuming 5-day work week, 52 weeks
          const hourlySalary = salary / (hours * 52);
          
          let result = `Annual: $${salary.toFixed(2)}\nMonthly: $${monthlySalary.toFixed(2)}\nBi-weekly: $${biweeklySalary.toFixed(2)}\nWeekly: $${weeklySalary.toFixed(2)}\nDaily: $${dailySalary.toFixed(2)}\nHourly: $${hourlySalary.toFixed(2)}`;
          
          // If user selected specific pay period, highlight that
          if (payPeriod !== "annual") {
            let specific = 0;
            switch (payPeriod) {
              case "monthly":
                specific = monthlySalary;
                break;
              case "biweekly":
                specific = biweeklySalary;
                break;
              case "weekly":
                specific = weeklySalary;
                break;
              case "daily":
                specific = dailySalary;
                break;
              case "hourly":
                specific = hourlySalary;
                break;
            }
            result = `Selected ${payPeriod} rate: $${specific.toFixed(2)}\n\n` + result;
          }
          
          setResult(result);
          setError("");
        } catch (error) {
          setError("Error calculating salary: " + error);
        }
      },
      title: "Salary Calculator"
    },
    "investment-calculator": {
      calculate: () => {
        try {
          if (!initialInvestment || !investmentYears) {
            setError("Please fill in initial investment and years");
            return;
          }
          
          const initial = parseFloat(initialInvestment);
          const monthly = monthlyContribution ? parseFloat(monthlyContribution) : 0;
          const annual = parseFloat(annualReturn);
          const years = parseFloat(investmentYears);
          
          if (isNaN(initial) || isNaN(monthly) || isNaN(annual) || isNaN(years)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Calculate future value
          const monthlyRate = (annual / 100) / 12;
          const numPayments = years * 12;
          
          let futureValue = initial * Math.pow(1 + monthlyRate, numPayments);
          
          // Calculate future value of monthly contributions
          if (monthly > 0) {
            // Future value of an annuity formula
            const contributionFV = monthly * ((Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate);
            futureValue += contributionFV;
          }
          
          const totalContributions = initial + (monthly * numPayments);
          const interestEarned = futureValue - totalContributions;
          
          setResult(`Future Value: $${futureValue.toFixed(2)}\nTotal Contributions: $${totalContributions.toFixed(2)}\nInterest Earned: $${interestEarned.toFixed(2)}`);
          setError("");
        } catch (error) {
          setError("Error calculating investment: " + error);
        }
      },
      title: "Investment Calculator"
    },
    "tdee-calculator": {
      calculate: () => {
        try {
          if (!tdeeWeight || !tdeeHeight || !tdeeAge) {
            setError("Please fill in all fields");
            return;
          }
          
          let weightKg = parseFloat(tdeeWeight);
          let heightCm = parseFloat(tdeeHeight);
          const ageValue = parseFloat(tdeeAge);
          
          if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageValue)) {
            setError("Please enter valid numbers");
            return;
          }
          
          // Convert to metric if needed
          if (weightUnit === "lb") {
            weightKg = weightKg * 0.45359237;
          }
          
          if (heightUnit === "in") {
            heightCm = heightCm * 2.54;
          } else if (heightUnit === "ft") {
            heightCm = heightCm * 30.48;
          }
          
          // Calculate BMR using Mifflin-St Jeor Equation
          let bmr = 0;
          if (tdeeGender === "male") {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue + 5;
          } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue - 161;
          }
          
          // Apply activity multiplier to get TDEE
          let tdee = 0;
          switch (tdeeActivity) {
            case "sedentary":
              tdee = bmr * 1.2;
              break;
            case "light":
              tdee = bmr * 1.375;
              break;
            case "moderate":
              tdee = bmr * 1.55;
              break;
            case "active":
              tdee = bmr * 1.725;
              break;
            case "very_active":
              tdee = bmr * 1.9;
              break;
            default:
              tdee = bmr * 1.2;
          }
          
          // Calculate calorie targets
          const cutCals = tdee * 0.8; // 20% deficit
          const maintainCals = tdee;
          const bulkCals = tdee * 1.1; // 10% surplus
          
          setResult(`BMR: ${Math.round(bmr)} calories/day\nTDEE: ${Math.round(tdee)} calories/day\nCutting: ${Math.round(cutCals)} calories/day\nMaintenance: ${Math.round(maintainCals)} calories/day\nBulking: ${Math.round(bulkCals)} calories/day`);
          setError("");
        } catch (error) {
          setError("Error calculating TDEE: " + error);
        }
      },
      title: "TDEE Calculator"
    },
    "mean-median-mode-calculator": {
      calculate: () => {
        try {
          if (!dataSet) {
            setError("Please enter data set");
            return;
          }
          
          const data = dataSet.split(",").map(num => parseFloat(num.trim()));
          
          if (data.some(isNaN)) {
            setError("Please enter valid numbers separated by commas");
            return;
          }
          
          // Calculate mean (average)
          const sum = data.reduce((acc, val) => acc + val, 0);
          const mean = sum / data.length;
          
          // Calculate median (middle value)
          const sortedData = [...data].sort((a, b) => a - b);
          let median;
          const midIndex = Math.floor(sortedData.length / 2);
          if (sortedData.length % 2 === 0) {
            median = (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
          } else {
            median = sortedData[midIndex];
          }
          
          // Calculate mode (most frequent value)
          const frequency: { [key: number]: number } = {};
          let maxFreq = 0;
          let modes: number[] = [];
          
          data.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) {
              maxFreq = frequency[num];
              modes = [num];
            } else if (frequency[num] === maxFreq && !modes.includes(num)) {
              modes.push(num);
            }
          });
          
          // If all values occur equally often, there is no mode
          const modeText = maxFreq === 1 ? "No mode (all values occur once)" : 
                          modes.length === data.length ? "No mode (all values occur equally often)" : 
                          `Mode: ${modes.join(", ")}`;
          
          // Calculate range
          const range = Math.max(...data) - Math.min(...data);
          
          setResult(`Mean: ${mean.toFixed(2)}\nMedian: ${median.toFixed(2)}\n${modeText}\nRange: ${range}`);
          setError("");
        } catch (error) {
          setError("Error calculating statistics: " + error);
        }
      },
      title: "Mean Median Mode Calculator"
    }
  };

  const getTitle = () => {
    return calculators[calculatorType]?.title || "Calculator";
  };

  const getDescription = () => {
    const descriptions: { [key: string]: string } = {
      "age-calculator": "Calculate the exact age between any two dates with our precise Age Calculator. This tool determines years, months, and days between a birth date (or any start date) and the current date (or any end date), providing an accurate chronological age measurement for documentation, age verification, or personal knowledge.",
      "percentage-calculator": "Our Percentage Calculator is a versatile tool that helps you quickly find percentages of numbers, calculate percentage increases or decreases, and determine what percentage one number is of another. Perfect for financial calculations, discounts, tax calculations, academic grading, and statistical analysis.",
      "average-calculator": "Find the mean value of any set of numbers with our easy-to-use Average Calculator. This essential mathematical tool processes multiple values to calculate their arithmetic mean, helping with grade calculations, financial averaging, data analysis, and any situation requiring a central tendency measure.",
      "confidence-interval-calculator": "Calculate statistical confidence intervals with precision using our Confidence Interval Calculator. This advanced statistical tool uses sample means, standard deviations, and sample sizes to generate reliable confidence intervals at your chosen confidence level, perfect for research, quality control, and data-driven decision making.",
      "sales-tax-calculator": "Instantly calculate sales tax and final prices with our intuitive Sales Tax Calculator. This practical tool determines the exact tax amount and total cost of purchases based on your local tax rate, helping with budgeting, expense planning, and business accounting for both consumers and business owners.",
      "margin-calculator": "Optimize your pricing strategy with our comprehensive Margin Calculator. This business-essential tool calculates profit margins, markup percentages, and selling prices based on costs, helping retailers, wholesalers, and service providers determine profitable pricing structures while maintaining competitive market positions.",
      "probability-calculator": "Calculate exact probabilities for any scenario with our powerful Probability Calculator. This mathematical tool converts favorable outcomes and total possibilities into precise probability values expressed as decimals, percentages, or fractions, making it invaluable for statistics students, researchers, and decision-makers working with uncertainty.",
      "paypal-fee-calculator": "Determine exactly how much you'll receive after PayPal fees with our accurate PayPal Fee Calculator. This specialized tool calculates transaction fees for standard payments, international transfers, and micropayments, helping sellers, freelancers, and online businesses plan their pricing strategies and understand their actual earnings.",
      "discount-calculator": "Calculate savings instantly with our precise Discount Calculator. This shopping-essential tool determines the discounted price and amount saved for any percentage off, helping shoppers maximize their savings during sales and assisting retailers in calculating promotional prices and markdown values.",
      "earnings-per-share-calculator": "Calculate a company's profitability with our Earnings Per Share (EPS) Calculator. This financial tool divides a company's net income (minus preferred dividends) by its outstanding shares, providing a key metric for stock valuation, company performance analysis, and investment decision-making for investors and financial analysts.",
      "cpm-calculator": "Optimize your advertising budget with our CPM (Cost Per Thousand Impressions) Calculator. This marketing tool calculates the cost of reaching 1,000 viewers or impressions, helping advertisers, marketers, and media buyers compare different advertising options and maximize their advertising ROI across platforms.",
      "loan-to-value-calculator": "Assess mortgage risk with our Loan-to-Value (LTV) Calculator. This financial tool calculates the ratio between your loan amount and property value, helping homebuyers, investors, and lenders determine borrowing capacity, refinancing options, and whether private mortgage insurance may be required.",
      "gst-calculator": "Calculate Goods and Services Tax (GST) instantly with our accurate GST Calculator. This tax tool determines the GST amount and total price for both tax-inclusive and tax-exclusive pricing, helping businesses and consumers understand tax obligations, pricing structures, and final costs for products and services.",
      "bmi-calculator": "Calculate your Body Mass Index (BMI) instantly with our accurate BMI Calculator. This health assessment tool uses your height and weight to determine your BMI value and weight category according to WHO standards, helping with basic health screenings and weight management goals.",
      "chronological-age-calculator": "Determine exact age with precision using our Chronological Age Calculator. This detailed calculator provides your age in years, months, days, and even total days lived between any two dates, perfect for developmental assessments, legal documentation, and personal milestone tracking.",
      "loan-calculator": "Plan your borrowing with our comprehensive Loan Calculator. This financial planning tool calculates monthly payments, total interest, and total repayment amount based on loan principal, interest rate, and term length, helping borrowers understand the true cost of loans and make informed financial decisions.",
      "hours-calculator": "Track working hours precisely with our Hours Calculator. This time management tool calculates the exact hours and minutes between start and end times, with options to deduct breaks, helping employees, freelancers, and managers accurately record work hours for payroll, billing, and productivity analysis.",
      "grade-calculator": "Determine your final course grade with our weighted Grade Calculator. This academic tool calculates your overall grade based on assignment scores and their respective weights, helping students track their academic standing, set grade goals, and understand how future assignments will affect their final grade.",
      "gpa-calculator": "Calculate your Grade Point Average (GPA) accurately with our GPA Calculator. This academic performance tool converts letter grades and credit hours into a standardized GPA, helping students track their academic standing, prepare for graduate school applications, and set educational goals.",
      "percentage-increase-calculator": "Calculate exact percentage increases between two values with our Percentage Increase Calculator. This mathematical tool determines how much a value has grown as a percentage of the original amount, helping with financial analysis, growth metrics, inflation calculations, and performance evaluations.",
      "percentage-decrease-calculator": "Measure percentage reductions precisely with our Percentage Decrease Calculator. This mathematical tool calculates how much a value has decreased relative to the original amount, helping with discount analysis, depreciation calculations, cost reduction assessments, and performance decline metrics.",
      "percentage-change-calculator": "Measure value fluctuations with our Percentage Change Calculator. This versatile tool calculates the relative change between two values as a percentage, indicating both direction (increase or decrease) and magnitude, perfect for financial analysis, scientific research, and performance metric evaluation.",
      "percentage-difference-calculator": "Compare relative differences between values with our Percentage Difference Calculator. This statistical tool calculates the relative difference between two numbers as a percentage of their average, providing a symmetrical comparison ideal for scientific data analysis, comparative studies, and variation measurement.",
      "calorie-calculator": "Determine your daily calorie needs with our precise Calorie Calculator. This nutritional tool uses your age, gender, weight, height, and activity level to calculate your basal metabolic rate (BMR) and total daily energy expenditure (TDEE), helping with weight management, meal planning, and fitness goals.",
      "time-calculator": "Perform precise time calculations with our versatile Time Calculator. This time management tool adds, subtracts, multiplies, and divides hours, minutes, and seconds with accuracy, helping with project planning, time tracking, pace calculations, and schedule management.",
      "salary-calculator": "Convert between different pay periods with our comprehensive Salary Calculator. This financial tool translates annual salary into monthly, biweekly, weekly, daily, and hourly rates, helping job seekers compare offers, employees understand their compensation, and employers structure payroll systems.",
      "investment-calculator": "Project your financial future with our powerful Investment Calculator. This financial planning tool calculates the future value of investments based on initial deposit, regular contributions, expected return rate, and time horizon, helping investors visualize growth potential and plan for retirement or other financial goals.",
      "tdee-calculator": "Calculate your Total Daily Energy Expenditure (TDEE) with our accurate TDEE Calculator. This fitness tool determines the total calories you burn daily based on your BMR and physical activity level, providing essential information for weight management, muscle building, and nutrition planning.",
      "mean-median-mode-calculator": "Analyze data distributions with our comprehensive Mean, Median, Mode Calculator. This statistical tool calculates central tendency measures (arithmetic mean, median, and mode) plus range from any data set, helping students, researchers, and analysts understand data characteristics and make informed decisions."
    };

    return descriptions[calculatorType] || "Calculate various mathematical, financial, and statistical values with our versatile calculator tools. From simple arithmetic to complex financial projections, our calculators provide accurate results with clear explanations.";
  };

  const getHowToUse = () => {
    const howToUse: { [key: string]: string[] } = {
      "age-calculator": [
        "Enter your birth date in the first date field",
        "The current date is pre-filled, but you can change it if needed",
        "Click 'Calculate' to see your exact age in years, months, and days",
        "For historical age calculations, adjust both dates as needed"
      ],
      "percentage-calculator": [
        "Enter the percentage value in the first field (e.g., 25)",
        "Enter the number you want to find the percentage of in the second field",
        "Click 'Calculate' to see what percentage of the number you entered",
        "The result shows the exact value of the percentage calculation"
      ],
      "average-calculator": [
        "Enter a series of numbers separated by commas",
        "Make sure there are no spaces between the commas and numbers",
        "Click 'Calculate' to find the average (mean) of the numbers",
        "The result shows the arithmetic mean of all values entered"
      ],
      "confidence-interval-calculator": [
        "Enter the sample mean, standard deviation, and sample size",
        "Select your desired confidence level (commonly 95%)",
        "Click 'Calculate' to generate the confidence interval",
        "Review the lower and upper bounds of the calculated interval"
      ],
      "sales-tax-calculator": [
        "Enter the pre-tax amount in the first field",
        "Enter your local sales tax rate as a percentage",
        "Click 'Calculate' to determine the tax amount and total price",
        "Review both the added tax and final price including tax"
      ],
      "margin-calculator": [
        "Enter the cost amount in the first field",
        "Enter the revenue (selling price) in the second field",
        "Click 'Calculate' to determine gross profit and profit margin",
        "Review both the profit amount and percentage margin"
      ],
      "probability-calculator": [
        "Enter the number of favorable outcomes in the first field",
        "Enter the total number of possible outcomes in the second field",
        "Click 'Calculate' to determine the probability",
        "The result shows probability as a percentage, decimal, and fraction"
      ],
      "paypal-fee-calculator": [
        "Enter the transaction amount in the field",
        "Select the fee type (standard, micropayment, or international)",
        "Click 'Calculate' to determine the PayPal fee and net amount",
        "Review both the fee deducted and the amount you'll receive"
      ]
    };
    
    return howToUse[calculatorType] || [
      "Select the specific calculator type from the dropdown menu",
      "Enter all required values in the input fields",
      "The calculator will provide real-time results as you enter values",
      "For more complex calculations, click the Calculate button after entering all values",
      "Reset the calculator at any time to start a new calculation"
    ];
  };

  const getFeatures = () => {
    const features: { [key: string]: string[] } = {
      "age-calculator": [
        "Precise calculation of years, months, and days between dates",
        "Automatically handles leap years and varying month lengths",
        "Option to set any reference date, not just current date",
        "Perfect for determining exact age for legal or personal purposes",
        "Results update instantly when changing date inputs"
      ],
      "percentage-calculator": [
        "Calculate what percentage one number is of another",
        "Determine percentage increases and decreases",
        "Find the value after applying a percentage change",
        "Calculate the original value before a percentage was applied",
        "Supports decimal precision for exact calculations"
      ]
    };
    
    return features[calculatorType] || [
      "Intuitive user interface with clearly labeled input fields",
      "Real-time calculation updates as you enter values",
      "Comprehensive error checking to prevent invalid inputs",
      "Detailed results with all relevant calculated values",
      "Mobile-friendly design for calculations on any device",
      "Educational explanations of formulas and calculation methods"
    ];
  };

  const getFaqs = () => {
    const generalFaqs = [
      {
        question: "How accurate are these calculators?",
        answer: "Our calculators use standard mathematical formulas and provide results with appropriate precision for each calculation type. Financial calculators typically show results rounded to two decimal places, while statistical calculators may use more significant digits. We regularly verify our calculators against industry standards to ensure accuracy."
      },
      {
        question: "Can I use these calculators for professional purposes?",
        answer: "While our calculators are designed to be accurate and reliable for general use, professional decisions, especially those involving significant financial, health, or legal consequences, should be verified with industry-specific tools and professional advice. Our calculators are excellent for preliminary calculations, estimates, and educational purposes."
      }
    ];

    const specificFaqs: { [key: string]: Array<{ question: string; answer: string }> } = {
      "age-calculator": [
        {
          question: "How does the age calculator handle leap years?",
          answer: "Our age calculator properly accounts for leap years when calculating the exact age. It understands that February has 29 days in leap years, which occur every 4 years (with special rules for century years). This ensures that the day count is accurate regardless of which leap years fall between the birth date and current/end date."
        },
        {
          question: "Why might my age calculator result differ from my 'official' age?",
          answer: "In some cultures or legal contexts, a person's age is counted differently than the exact time elapsed since birth. For example, in some East Asian countries, people are considered 1 year old at birth and gain a year on New Year's Day rather than on their birthday. Our calculator uses the international standard of exact time elapsed since birth."
        },
        {
          question: "Can I use this calculator for calculating age for school admissions?",
          answer: "Yes, this calculator is perfect for determining whether a child meets age requirements for school admissions, sports leagues, or other age-restricted activities. Simply enter the child's birth date and the cutoff date used by the organization to see if they qualify."
        }
      ],
      "percentage-calculator": [
        {
          question: "What's the difference between percentage change and percentage difference?",
          answer: "Percentage change measures how much a value has increased or decreased relative to its original value, and is directional (can be positive or negative). Percentage difference measures the absolute difference between two values relative to their average, providing a symmetrical comparison that's always positive. Use percentage change when order matters (initial vs. final values) and percentage difference when comparing two equivalent values."
        },
        {
          question: "How do I calculate what percentage one number is of another?",
          answer: "To find what percentage A is of B, divide A by B and multiply by 100. For example, to find what percentage 25 is of 200, calculate (25 ÷ 200) × 100 = 12.5%. Our percentage calculator handles this calculation automatically when you enter these values."
        },
        {
          question: "How do I calculate the original price before a discount was applied?",
          answer: "If you know the final price after a discount and the discount percentage, you can calculate the original price by dividing the final price by (1 - discount percentage/100). For example, if an item costs $80 after a 20% discount, the original price was $80 ÷ (1 - 20/100) = $80 ÷ 0.8 = $100."
        }
      ]
    };

    // Return general FAQs plus any specific ones for this calculator type
    return [...(specificFaqs[calculatorType] || []), ...generalFaqs];
  };

  // Render the appropriate calculator interface based on the selected calculator type
  const renderCalculatorInterface = () => {
    switch (calculatorType) {
      case "age-calculator":
      case "chronological-age-calculator":
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
      
      case "percentage-calculator":
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
      
      case "average-calculator":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="numbersToAverage">Enter Numbers (separated by commas)</Label>
              <Input
                id="numbersToAverage"
                placeholder="e.g., 10,15,20,25,30"
                value={numbersToAverage}
                onChange={(e) => setNumbersToAverage(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        );
      
      case "confidence-interval-calculator":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mean">Sample Mean</Label>
              <Input
                id="mean"
                type="number"
                placeholder="e.g., 85.4"
                value={mean}
                onChange={(e) => setMean(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="standardDeviation">Standard Deviation</Label>
              <Input
                id="standardDeviation"
                type="number"
                placeholder="e.g., 15.3"
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
                placeholder="e.g., 100"
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="confidenceLevel">Confidence Level</Label>
              <Select
                value={confidenceLevel}
                onValueChange={(value) => setConfidenceLevel(value)}
              >
                <SelectTrigger id="confidenceLevel" className="mt-1.5">
                  <SelectValue placeholder="Select confidence level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case "sales-tax-calculator":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Pre-Tax Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 199.99"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                placeholder="e.g., 7.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        );
      
      // Handle all other calculator types with a generic message
      default:
        return (
          <div className="text-center py-6">
            <p>Please select a calculator type from the dropdown above.</p>
          </div>
        );
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="calculatorType">Calculator Type</Label>
              <Select
                value={calculatorType}
                onValueChange={(value) => {
                  setCalculatorType(value);
                  setError("");
                  setResult("");
                }}
              >
                <SelectTrigger id="calculatorType" className="mt-1.5">
                  <SelectValue placeholder="Select calculator type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(calculators).map((key) => (
                    <SelectItem key={key} value={key}>
                      {calculators[key].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderCalculatorInterface()}

            <Button 
              variant="default" 
              onClick={() => {
                const calculate = calculators[calculatorType]?.calculate;
                if (calculate) {
                  calculate();
                } else {
                  setError("Calculator type not supported");
                }
              }}
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