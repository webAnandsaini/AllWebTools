import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const ReverseText = () => {
  const [text, setText] = useState("");
  const [reversedText, setReversedText] = useState("");
  const [reverseOption, setReverseOption] = useState("characters");

  useEffect(() => {
    document.title = "Reverse Text Generator - ToolsHub";
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    reverseText(e.target.value, reverseOption);
  };

  const handleReverseOptionChange = (value: string) => {
    setReverseOption(value);
    reverseText(text, value);
  };

  const reverseText = (inputText: string, option: string) => {
    if (!inputText) {
      setReversedText("");
      return;
    }

    let result = "";

    switch (option) {
      case "characters":
        // Reverse all characters
        result = inputText.split("").reverse().join("");
        break;
      case "words":
        // Reverse the order of words but keep characters in each word the same
        result = inputText.split(" ").reverse().join(" ");
        break;
      case "sentences":
        // Reverse the order of sentences
        result = inputText
          .split(/([.!?]+)/)
          .reduce((arr: string[], part, i, parts) => {
            if (i % 2 === 0) {
              arr.push(part + (parts[i + 1] || ""));
            }
            return arr;
          }, [])
          .reverse()
          .join("");
        break;
      case "paragraphs":
        // Reverse the order of paragraphs
        result = inputText.split(/\n+/).reverse().join("\n");
        break;
      case "words_and_characters":
        // Reverse both the order of words and the characters in each word
        result = inputText
          .split(" ")
          .map(word => word.split("").reverse().join(""))
          .reverse()
          .join(" ");
        break;
      default:
        // Default to reversing characters
        result = inputText.split("").reverse().join("");
    }

    setReversedText(result);
  };

  const clearText = () => {
    setText("");
    setReversedText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reversedText);
    toast({
      title: "Copied!",
      description: "Reversed text copied to clipboard.",
    });
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
              <h1 className="text-2xl font-bold mb-2">Reverse Text Generator</h1>
              <p className="text-gray-600">Reverse the order of characters, words, sentences, or paragraphs in your text.</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here to reverse..."
                className="w-full h-40 p-4 resize-none"
              />
              <div className="mt-2 text-right text-sm text-gray-500">
                {text.length} characters / {text.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>

            <div className="mb-6">
              <div className="font-medium text-gray-700 mb-3">Reverse options</div>
              <RadioGroup value={reverseOption} onValueChange={handleReverseOptionChange}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="characters" id="characters" />
                    <Label htmlFor="characters">Reverse Characters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words" id="words" />
                    <Label htmlFor="words">Reverse Words</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sentences" id="sentences" />
                    <Label htmlFor="sentences">Reverse Sentences</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paragraphs" id="paragraphs" />
                    <Label htmlFor="paragraphs">Reverse Paragraphs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words_and_characters" id="words_and_characters" />
                    <Label htmlFor="words_and_characters">Reverse Words & Characters</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Reversed text</label>
              <Textarea
                value={reversedText}
                readOnly
                className="w-full h-40 p-4 resize-none bg-gray-50"
                placeholder="Reversed text will appear here"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={copyToClipboard}
                disabled={!reversedText}
                className="bg-primary hover:bg-blue-700 transition flex items-center"
              >
                <i className="far fa-copy mr-2"></i>
                <span>Copy to Clipboard</span>
              </Button>

              <Button
                onClick={clearText}
                variant="outline"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear Text</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseText;