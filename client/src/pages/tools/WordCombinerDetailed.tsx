import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

type CombinationMode = "all_combinations" | "pairs" | "with_separator" | "with_prefix_suffix";

const WordCombinerDetailed = () => {
  const [inputWords, setInputWords] = useState<string>("");
  const [combinedOutput, setCombinedOutput] = useState<string>("");
  const [mode, setMode] = useState<CombinationMode>("all_combinations");
  const [separator, setSeparator] = useState<string>(" ");
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [randomOrder, setRandomOrder] = useState<boolean>(false);
  const [limitResults, setLimitResults] = useState<boolean>(false);
  const [resultLimit, setResultLimit] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>("input");

  useEffect(() => {
    document.title = "Word Combiner - AllTooly";
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputWords(e.target.value);
  };

  const combineWords = () => {
    const words = inputWords
      .split(/[\n,]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (words.length === 0) {
      toast({
        title: "No words to combine",
        description: "Please enter at least one word in the input field.",
        variant: "destructive",
      });
      return;
    }

    if (words.length === 1) {
      setCombinedOutput(words[0]);
      setActiveTab("output");
      return;
    }

    let combinations: string[] = [];

    switch (mode) {
      case "all_combinations":
        combinations = generateAllCombinations(words);
        break;

      case "pairs":
        combinations = generatePairs(words);
        break;

      case "with_separator":
        combinations = generateWithSeparator(words, separator);
        break;

      case "with_prefix_suffix":
        combinations = generateWithPrefixSuffix(words, prefix, suffix);
        break;
    }

    if (randomOrder) {
      combinations = shuffleArray(combinations);
    }

    if (limitResults && combinations.length > resultLimit) {
      combinations = combinations.slice(0, resultLimit);
    }

    const output = combinations.join("\n");
    setCombinedOutput(output);

    // Show toast with info about the results
    toast({
      title: "Words combined successfully",
      description: `Generated ${combinations.length} combinations.`,
    });

    // Switch to output tab
    setActiveTab("output");
  };

  const generateAllCombinations = (words: string[]): string[] => {
    // Maximum safe number of combinations to avoid browser hanging
    const MAX_SAFE_COMBINATIONS = 10000;

    // Calculate total possible combinations
    const totalPossibleCombinations = Math.pow(2, words.length) - 1;

    if (totalPossibleCombinations > MAX_SAFE_COMBINATIONS) {
      toast({
        title: "Warning: Large number of combinations",
        description: `Limited to ${MAX_SAFE_COMBINATIONS} combinations for performance.`,
        variant: "destructive",
      });
    }

    const result: string[] = [];
    const maxCombinations = Math.min(totalPossibleCombinations, MAX_SAFE_COMBINATIONS);

    function backtrack(start: number, current: string[]) {
      if (result.length >= maxCombinations) return;

      if (current.length > 0) {
        result.push(current.join(' '));
      }

      for (let i = start; i < words.length; i++) {
        current.push(words[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }

    backtrack(0, []);
    return result;
  };

  const generatePairs = (words: string[]): string[] => {
    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        if (i !== j) {
          result.push(`${words[i]} ${words[j]}`);
        }
      }
    }

    return result;
  };

  const generateWithSeparator = (words: string[], sep: string): string[] => {
    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        if (i !== j) {
          result.push(`${words[i]}${sep}${words[j]}`);
        }
      }
    }

    return result;
  };

  const generateWithPrefixSuffix = (words: string[], pre: string, suf: string): string[] => {
    return words.map(word => `${pre}${word}${suf}`);
  };

  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const clearInput = () => {
    setInputWords("");
    setCombinedOutput("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(combinedOutput);
    toast({
      title: "Copied to clipboard",
      description: "The combined words have been copied to your clipboard.",
    });
  };

  const downloadCombinations = () => {
    if (!combinedOutput) {
      toast({
        title: "Nothing to download",
        description: "Please generate combinations first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([combinedOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-combinations.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Label className="text-base font-medium">Enter words to combine</Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Enter one word per line, or separate with commas
                  </p>
                  <Textarea
                    value={inputWords}
                    onChange={handleInputChange}
                    placeholder="Enter words here...
example
test
sample"
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={combineWords}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-object-group mr-2"></i>
                    <span>Combine Words</span>
                  </Button>

                  <Button
                    onClick={clearInput}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <i className="fas fa-eraser mr-2"></i>
                    <span>Clear</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">Combination Settings</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mode-select">Combination Mode</Label>
                    <Select
                      value={mode}
                      onValueChange={(value) => setMode(value as CombinationMode)}
                    >
                      <SelectTrigger id="mode-select" className="mt-1">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_combinations">All Possible Combinations</SelectItem>
                        <SelectItem value="pairs">Word Pairs</SelectItem>
                        <SelectItem value="with_separator">With Custom Separator</SelectItem>
                        <SelectItem value="with_prefix_suffix">With Prefix & Suffix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {mode === "with_separator" && (
                    <div>
                      <Label htmlFor="separator-input">Separator</Label>
                      <Input
                        id="separator-input"
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        placeholder="Enter separator"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {mode === "with_prefix_suffix" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prefix-input">Prefix</Label>
                        <Input
                          id="prefix-input"
                          value={prefix}
                          onChange={(e) => setPrefix(e.target.value)}
                          placeholder="Enter prefix"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="suffix-input">Suffix</Label>
                        <Input
                          id="suffix-input"
                          value={suffix}
                          onChange={(e) => setSuffix(e.target.value)}
                          placeholder="Enter suffix"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="random-order"
                      checked={randomOrder}
                      onCheckedChange={setRandomOrder}
                    />
                    <Label htmlFor="random-order" className="cursor-pointer">
                      Randomize order of combinations
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="limit-results"
                      checked={limitResults}
                      onCheckedChange={setLimitResults}
                    />
                    <Label htmlFor="limit-results" className="cursor-pointer">
                      Limit number of results
                    </Label>
                  </div>

                  {limitResults && (
                    <div>
                      <Label htmlFor="limit-input">Maximum results</Label>
                      <Input
                        id="limit-input"
                        type="number"
                        min={1}
                        max={10000}
                        value={resultLimit}
                        onChange={(e) => setResultLimit(Number(e.target.value))}
                        className="mt-1 w-32"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="output" className="space-y-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-base font-medium">Combined Words</Label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={!combinedOutput}
                    >
                      <i className="fas fa-copy mr-1"></i>
                      <span>Copy</span>
                    </Button>
                    <Button
                      onClick={downloadCombinations}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={!combinedOutput}
                    >
                      <i className="fas fa-download mr-1"></i>
                      <span>Download</span>
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={combinedOutput}
                  readOnly
                  placeholder="Combined words will appear here..."
                  className="min-h-[300px]"
                />

                <div className="flex justify-between mt-3">
                  <Button
                    onClick={() => setActiveTab("input")}
                    variant="outline"
                    size="sm"
                  >
                    <i className="fas fa-arrow-left mr-1"></i>
                    <span>Back to Input</span>
                  </Button>

                  <div className="text-sm text-gray-500">
                    {combinedOutput ? combinedOutput.split("\n").length : 0} combinations
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">Common Uses</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Brainstorming product or domain names</li>
                    <li>• Creating keyword combinations for SEO</li>
                    <li>• Generating username ideas</li>
                    <li>• Password generation (use with caution)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium mb-2">Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• For large word sets, use the result limit option</li>
                    <li>• Use prefix/suffix for domain extensions (.com, .net)</li>
                    <li>• Try different separators like hyphens or underscores</li>
                    <li>• Randomize for creative brainstorming sessions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <h3 className="text-lg font-medium mb-3">About Combination Modes</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h4 className="text-base font-medium">All Possible Combinations</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Generates all possible combinations of words, from single words to groups.
                  For example, with words "red", "blue", "green":
                </p>
                <pre className="bg-gray-50 p-2 rounded text-xs mt-1">
                  red{"\n"}
                  blue{"\n"}
                  green{"\n"}
                  red blue{"\n"}
                  red green{"\n"}
                  blue green{"\n"}
                  red blue green
                </pre>
              </div>

              <div>
                <h4 className="text-base font-medium">Word Pairs</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Creates pairs of words, combining each word with every other word.
                  For example, with words "fast", "car", "ride":
                </p>
                <pre className="bg-gray-50 p-2 rounded text-xs mt-1">
                  fast car{"\n"}
                  fast ride{"\n"}
                  car fast{"\n"}
                  car ride{"\n"}
                  ride fast{"\n"}
                  ride car
                </pre>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-medium">With Custom Separator</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Joins pairs of words with a custom separator.
                  For example, with words "cloud", "data" and separator "-":
                </p>
                <pre className="bg-gray-50 p-2 rounded text-xs mt-1">
                  cloud-data{"\n"}
                  data-cloud
                </pre>
              </div>

              <div>
                <h4 className="text-base font-medium">With Prefix & Suffix</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Adds a prefix and suffix to each word.
                  For example, with words "site", "shop", prefix "my" and suffix ".com":
                </p>
                <pre className="bg-gray-50 p-2 rounded text-xs mt-1">
                  mysite.com{"\n"}
                  myshop.com
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const contentData = {
    introduction: "Create powerful word combinations with our flexible Word Combiner tool.",
    description: "Our Word Combiner tool is an essential resource for creatives, marketers, and developers who need to generate and explore word combinations. This versatile utility creates permutations and combinations from your input words using various combination methods. Whether you're brainstorming brand names, generating username ideas, creating keyword combinations for SEO, or exploring domain name availability, this tool streamlines the process by automatically producing hundreds of combinations in seconds. The flexible combination modes allow you to generate all possible combinations, create word pairs, join words with custom separators, or add prefixes and suffixes to each word. With options to randomize results or limit output size, you'll quickly discover new word combinations that might have taken hours to come up with manually.",
    howToUse: [
      "Enter your list of words in the input field, with one word per line or separated by commas.",
      "Choose your desired combination mode from the dropdown menu: All Possible Combinations, Word Pairs, With Custom Separator, or With Prefix & Suffix.",
      "If using Custom Separator mode, enter your preferred separator (dash, dot, space, etc.).",
      "If using Prefix & Suffix mode, specify the text to add before and after each word.",
      "Optionally select 'Randomize order' to shuffle the combinations or 'Limit results' to set a maximum number of outputs.",
      "Click the 'Combine Words' button to generate your combinations.",
      "Review the results in the Output tab, then use the Copy or Download buttons to save your combinations."
    ],
    features: [
      "Four different combination modes to suit various word combination needs",
      "Custom separator option for creating hyphenated, underscored, or uniquely joined combinations",
      "Prefix and suffix functionality perfect for domain name brainstorming",
      "Randomize feature to inspire creativity and discover unexpected combinations",
      "Result limiting capabilities to manage large combination sets",
      "Easy copy and download options for seamless workflow integration"
    ],
    faqs: [
      {
        question: "How many words can I combine at once?",
        answer: "The Word Combiner tool can handle up to 20-30 words in a single operation, depending on the combination mode you select. However, keep in mind that the number of possible combinations grows exponentially with each additional word. For 'All Possible Combinations' mode, we limit the output to 10,000 combinations to maintain browser performance. For 'Word Pairs' mode, you can combine more words since the growth is quadratic rather than exponential. If you need to process a larger word set, we recommend breaking it down into smaller groups or using the 'Limit results' option to cap the output. For truly large word sets (100+ words), you might consider our API service which can process combinations server-side without browser limitations."
      },
      {
        question: "What's the difference between 'All Possible Combinations' and 'Word Pairs' modes?",
        answer: "'All Possible Combinations' and 'Word Pairs' serve different combinatorial purposes. 'All Possible Combinations' generates every possible grouping of your words, including single words, pairs, trios, and so on up to using all words together. For example, with inputs 'red', 'car', 'fast', it would generate: 'red', 'car', 'fast', 'red car', 'red fast', 'car fast', and 'red car fast'. This is useful for comprehensive exploration. 'Word Pairs' specifically creates two-word combinations, pairing each word with every other word. Using the same example, it would generate: 'red car', 'red fast', 'car red', 'car fast', 'fast red', 'fast car'. This mode is ideal when you specifically need word pairs, such as for brand name brainstorming or compound keyword research."
      },
      {
        question: "Can I use this tool for generating domain name ideas?",
        answer: "Yes, the Word Combiner is excellent for domain name brainstorming. For the most effective domain name generation, we recommend using the 'With Custom Separator' mode with a hyphen (-) or no separator at all, or the 'With Prefix & Suffix' mode where you can add domain extensions as suffixes. For example, enter your keywords like 'creative', 'design', 'studio', then use the Prefix & Suffix mode with no prefix and '.com' as the suffix to generate 'creative.com', 'design.com', and 'studio.com'. Or combine keywords with separators to get options like 'creative-design.com'. By using different combinations of your core business terms, you'll quickly generate dozens of potential domain names to check for availability. Remember that shorter combinations typically make better domain names."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="word-combiner"
      toolContent={
        <ToolContentTemplate
          introduction={contentData.introduction}
          description={contentData.description}
          howToUse={contentData.howToUse}
          features={contentData.features}
          faqs={contentData.faqs}
          toolInterface={contentData.toolInterface}
        />
      }
    />
  );
};

export default WordCombinerDetailed;