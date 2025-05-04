import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

type HumanizationLevel = "light" | "medium" | "heavy";

const AIHumanizer = () => {
  const [text, setText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizationLevel, setHumanizationLevel] = useState<HumanizationLevel>("medium");
  const [changePercentage, setChangePercentage] = useState(0);

  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "AI Humanizer - AllTooly";
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset humanized text when original text changes
    if (humanizedText) {
      setHumanizedText("");
      setChangePercentage(0);
    }
  };

  const handleHumanizationLevelChange = (value: string) => {
    setHumanizationLevel(value as HumanizationLevel);
  };

  const handleHumanizeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Text is required",
        description: "Please enter some text to humanize.",
        variant: "destructive",
      });
      return;
    }

    setIsHumanizing(true);
    setHumanizedText("");
    setChangePercentage(0);

    try {
      const response = await apiRequest("POST", "/api/ai/humanize", {
        text,
        level: humanizationLevel
      });

      const data = await response.json();
      setHumanizedText(data.humanizedText);
      setChangePercentage(data.changes);
    } catch (error) {
      console.error("Error humanizing text:", error);
      toast({
        title: "Humanization failed",
        description: "Failed to humanize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  const clearFields = () => {
    setText("");
    setHumanizedText("");
    setChangePercentage(0);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(humanizedText);
    toast({
      title: "Copied!",
      description: "Humanized text copied to clipboard.",
    });
  };

  const getChangeColor = () => {
    if (changePercentage < 20) return "bg-blue-500";
    if (changePercentage < 40) return "bg-green-500";
    if (changePercentage < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">AI Humanizer</h1>
              <p className="text-gray-600">Make AI-generated content sound more human and natural.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Original AI Text</label>
                      <Textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Paste your AI-generated text here..."
                        className="w-full h-64 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Character count: {text.length}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-3">Humanization Level</h3>
                      <RadioGroup value={humanizationLevel} onValueChange={handleHumanizationLevelChange}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="cursor-pointer flex-1">
                              <div className="font-medium">Light</div>
                              <div className="text-xs text-gray-500">Minor tweaks</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="cursor-pointer flex-1">
                              <div className="font-medium">Medium</div>
                              <div className="text-xs text-gray-500">Moderate changes</div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition">
                            <RadioGroupItem value="heavy" id="heavy" />
                            <Label htmlFor="heavy" className="cursor-pointer flex-1">
                              <div className="font-medium">Heavy</div>
                              <div className="text-xs text-gray-500">Major restructuring</div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <Button
                        onClick={handleHumanizeText}
                        disabled={isHumanizing || !text.trim()}
                        className="bg-primary hover:bg-blue-700"
                      >
                        {isHumanizing ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            <span>Humanizing...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-edit mr-2"></i>
                            <span>Humanize Text</span>
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={clearFields}
                        variant="outline"
                        className="border-gray-300"
                      >
                        <i className="fas fa-eraser mr-2"></i>
                        <span>Clear All</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-medium">Humanized Text</label>
                        {humanizedText && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">Change Intensity:</span>
                            <div className="w-32">
                              <Progress value={changePercentage} className={`h-2 ${getChangeColor()}`} />
                            </div>
                            <span className="text-xs ml-2">{changePercentage}%</span>
                          </div>
                        )}
                      </div>
                      <Textarea
                        value={humanizedText}
                        onChange={(e) => setHumanizedText(e.target.value)}
                        readOnly={isHumanizing}
                        placeholder={isHumanizing ? "Humanizing your text..." : "Humanized text will appear here"}
                        className="w-full h-64 resize-none bg-gray-50"
                      />
                    </div>

                    {humanizedText && (
                      <Button onClick={copyToClipboard} variant="secondary" className="w-full">
                        <i className="far fa-copy mr-2"></i>
                        <span>Copy to Clipboard</span>
                      </Button>
                    )}

                    {isHumanizing && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                          <p className="text-blue-700 text-sm">
                            Analyzing and humanizing your text...
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-lg mb-3">How AI Humanizer Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-2">
                      <i className="fas fa-robot"></i>
                    </div>
                    <h4 className="font-medium">Detect AI Patterns</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our AI analyzes the text to identify common patterns and structures typically found in AI-generated content.
                  </p>
                </div>
                <div>
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-2">
                      <i className="fas fa-random"></i>
                    </div>
                    <h4 className="font-medium">Apply Transformations</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on the selected level, the tool applies various transformations to make the content feel more natural and human-written.
                  </p>
                </div>
                <div>
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-2">
                      <i className="fas fa-user"></i>
                    </div>
                    <h4 className="font-medium">Enhance Readability</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    The final text preserves your original meaning while adding human-like variations in sentence structure, contractions, and expression.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHumanizer;