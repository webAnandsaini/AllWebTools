import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [generatingPassword, setGeneratingPassword] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    document.title = "Password Generator - AllTooly";
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generatePassword = async () => {
    // Ensure at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingPassword(true);

    try {
      const response = await apiRequest("POST", "/api/password/generate", {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      });

      const data = await response.json();
      setPassword(data.password);
      setPasswordStrength(data.strength);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPassword(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard.",
    });
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Password Generator</h1>
              <p className="text-gray-600">Create strong, secure passwords that are difficult to crack.</p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Input
                  type="text"
                  value={password}
                  readOnly
                  className="pr-12 font-mono text-lg h-14 shadow-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                  aria-label="Copy to clipboard"
                >
                  <i className="far fa-copy text-lg"></i>
                </button>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Strength: {getStrengthLabel()}</span>
                  <span className="text-sm font-medium">{passwordStrength}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Password Length: {length}</label>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-4 text-sm">8</span>
                      <Slider
                        value={[length]}
                        min={8}
                        max={32}
                        step={1}
                        onValueChange={(value) => setLength(value[0])}
                        className="flex-grow"
                      />
                      <span className="ml-4 text-sm">32</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                      />
                      <label
                        htmlFor="uppercase"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Uppercase Letters (A-Z)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                      />
                      <label
                        htmlFor="lowercase"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Lowercase Letters (a-z)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                      />
                      <label
                        htmlFor="numbers"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Numbers (0-9)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                      />
                      <label
                        htmlFor="symbols"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Symbols (!@#$%^&*)
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-center">
              <Button
                onClick={generatePassword}
                disabled={generatingPassword}
                className="bg-primary hover:bg-blue-700 px-6 py-3 text-lg"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                <span>{generatingPassword ? "Generating..." : "Generate Password"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
