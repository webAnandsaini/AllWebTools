import { Express } from "express";
import { storage } from "../storage";

interface GenerateContentOptions {
  topic?: string;
  length?: "short" | "medium" | "long";
  tone?: "formal" | "casual" | "persuasive" | "informative";
  keywords?: string[];
  language?: string;
}

interface EssayOptions extends GenerateContentOptions {
  essayType?: "argumentative" | "narrative" | "descriptive" | "expository";
  academicLevel?: "high_school" | "college" | "university" | "masters";
}

interface StoryOptions extends GenerateContentOptions {
  genre?: string;
  characters?: string[];
  setting?: string;
}

export function setupAIToolsRoutes(app: Express) {
  // General content generation endpoint
  app.post("/api/ai/generate-content", async (req, res) => {
    try {
      const { 
        promptText, 
        contentType = "general",
        options = {} 
      } = req.body;

      if (!promptText || typeof promptText !== "string") {
        return res.status(400).json({ error: "Prompt text is required" });
      }

      // In a real implementation, we would connect to an AI service API like OpenAI
      // For this implementation, we'll simulate the AI response based on the input
      
      // Prepare the response based on the content type
      let generatedText = "";
      const paragraphCount = options.length === "short" 
        ? 1 
        : options.length === "long" 
          ? 3 
          : 2;

      const simulateDelay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

      // Simulate AI content generation with sample content
      switch (contentType) {
        case "general":
          generatedText = generateGenericContent(promptText, paragraphCount);
          break;
        case "essay":
          generatedText = generateEssayContent(promptText, paragraphCount, options as EssayOptions);
          break;
        case "title":
          generatedText = generateTitles(promptText);
          break;
        case "paragraph":
          generatedText = generateParagraphs(promptText, paragraphCount);
          break;
        case "story":
          generatedText = generateStoryContent(promptText, paragraphCount, options as StoryOptions);
          break;
        case "email":
          generatedText = generateEmailContent(promptText, options);
          break;
        case "thesis":
          generatedText = generateThesisStatements(promptText);
          break;
        case "conclusion":
          generatedText = generateConclusion(promptText);
          break;
        default:
          generatedText = generateGenericContent(promptText, paragraphCount);
      }

      // Simulate a delay
      setTimeout(() => {
        res.json({
          generatedContent: generatedText,
          contentType,
          tokens: generatedText.length,
          language: options.language || "en",
        });
      }, simulateDelay);

    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // AI Humanizer API
  app.post("/api/ai/humanize", async (req, res) => {
    try {
      const { text, level = "medium" } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text content is required" });
      }

      // In a real implementation, we would use an AI model to humanize the content
      // For this implementation, we'll make minor modifications to the text

      let humanizedText = text;
      
      // Apply different levels of humanization
      switch (level) {
        case "light":
          // Light humanization - minor changes
          humanizedText = applyLightHumanization(text);
          break;
        case "medium":
          // Medium humanization - more substantial changes
          humanizedText = applyMediumHumanization(text);
          break;
        case "heavy":
          // Heavy humanization - significant restructuring
          humanizedText = applyHeavyHumanization(text);
          break;
        default:
          humanizedText = applyMediumHumanization(text);
      }

      // Simulate a delay
      setTimeout(() => {
        res.json({
          originalText: text,
          humanizedText,
          level,
          changes: calculateChangePercentage(text, humanizedText),
        });
      }, 1500);

    } catch (error) {
      console.error("Error humanizing content:", error);
      res.status(500).json({ error: "Failed to humanize content" });
    }
  });
}

// Helper functions for generating different types of content

function generateGenericContent(prompt: string, paragraphCount: number): string {
  const paragraphs = [];
  
  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(generateDummyParagraph(prompt, 3 + i));
  }
  
  return paragraphs.join("\n\n");
}

function generateEssayContent(prompt: string, paragraphCount: number, options: EssayOptions): string {
  const { essayType = "informative", academicLevel = "college" } = options;
  
  // Introduction
  let essay = generateDummyParagraph(`Introduction to ${prompt}`, 3);
  
  // Body paragraphs
  for (let i = 0; i < paragraphCount; i++) {
    essay += "\n\n" + generateDummyParagraph(`Point ${i+1} about ${prompt}`, 4);
  }
  
  // Conclusion
  essay += "\n\n" + generateDummyParagraph(`Conclusion about ${prompt}`, 3);
  
  return essay;
}

function generateTitles(topic: string): string {
  const titles = [
    `The Ultimate Guide to ${capitalize(topic)}`,
    `10 Ways to Improve Your ${capitalize(topic)}`,
    `Why ${capitalize(topic)} Matters in Today's World`,
    `The Future of ${capitalize(topic)}: Trends and Predictions`,
    `Understanding ${capitalize(topic)}: A Comprehensive Guide`,
  ];
  
  return titles.join("\n\n");
}

function generateParagraphs(topic: string, count: number): string {
  const paragraphs = [];
  
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateDummyParagraph(topic, 4 + Math.floor(Math.random() * 4)));
  }
  
  return paragraphs.join("\n\n");
}

function generateStoryContent(prompt: string, paragraphCount: number, options: StoryOptions): string {
  const { genre = "fiction", characters = ["protagonist"], setting = "modern day" } = options;
  
  // Introduction
  let story = generateDummyParagraph(`Once upon a time in ${setting}, ${characters[0]} was confronted with a challenge related to ${prompt}.`, 3);
  
  // Story development
  for (let i = 0; i < paragraphCount; i++) {
    story += "\n\n" + generateDummyParagraph(`The ${genre} story continues with ${characters[0]} dealing with ${prompt}`, 4);
  }
  
  // Conclusion
  story += "\n\n" + generateDummyParagraph(`Finally, the situation with ${prompt} was resolved.`, 3);
  
  return story;
}

function generateEmailContent(prompt: string, options: GenerateContentOptions): string {
  const { tone = "formal" } = options;
  
  let salutation = "Dear Recipient,";
  let closing = "Best regards,\nSender";
  
  if (tone === "casual") {
    salutation = "Hi there,";
    closing = "Cheers,\nSender";
  }
  
  const body = generateDummyParagraph(prompt, 3);
  const followUp = generateDummyParagraph(`Additional information about ${prompt}`, 2);
  
  return `${salutation}\n\n${body}\n\n${followUp}\n\n${closing}`;
}

function generateThesisStatements(topic: string): string {
  const statements = [
    `This paper argues that ${topic} significantly impacts societal development through multiple economic and cultural channels.`,
    `An analysis of ${topic} reveals that contrary to popular belief, its influence on modern society has been largely misunderstood.`,
    `This research examines the relationship between ${topic} and global technological advancement, suggesting a strong correlation that has been previously overlooked.`,
    `By investigating ${topic} through a multidisciplinary lens, this study demonstrates its crucial role in shaping contemporary discourse.`,
    `This thesis contends that the conventional understanding of ${topic} fails to account for recent developments in the field.`,
  ];
  
  return statements.join("\n\n");
}

function generateConclusion(topic: string): string {
  return generateDummyParagraph(`In conclusion, ${topic} demonstrates significant importance in its field.`, 3) + 
    "\n\n" + 
    generateDummyParagraph(`The implications of ${topic} extend beyond immediate applications and suggest future areas for research and development.`, 2);
}

// Humanization helper functions

function applyLightHumanization(text: string): string {
  // For simulation purposes, we'll make simple changes
  // In a real implementation, this would use AI to make the text more human-like
  
  // Replace some common AI phrases
  return text
    .replace(/it is important to note that/gi, "notably")
    .replace(/in conclusion/gi, "to sum up")
    .replace(/additionally/gi, "also")
    .replace(/furthermore/gi, "moreover")
    .replace(/in order to/gi, "to");
}

function applyMediumHumanization(text: string): string {
  // Medium level applies light changes and then more
  let humanized = applyLightHumanization(text);
  
  // Add some contractions
  humanized = humanized
    .replace(/it is/gi, "it's")
    .replace(/that is/gi, "that's")
    .replace(/there is/gi, "there's")
    .replace(/will not/gi, "won't")
    .replace(/cannot/gi, "can't");
  
  return humanized;
}

function applyHeavyHumanization(text: string): string {
  // Heavy level applies medium changes and then restructures
  let humanized = applyMediumHumanization(text);
  
  // Break up some longer sentences (simplistic approach for simulation)
  humanized = humanized.replace(/([.!?]) ([A-Z])/g, "$1\n\n$2");
  
  // Occasionally add a personal touch
  if (Math.random() > 0.7) {
    humanized = "I think " + humanized.charAt(0).toLowerCase() + humanized.slice(1);
  }
  
  if (Math.random() > 0.8) {
    humanized += "\n\nAt least, that's my take on it.";
  }
  
  return humanized;
}

function calculateChangePercentage(original: string, modified: string): number {
  // A very simplistic way to calculate change percentage
  const levenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[b.length][a.length];
  };
  
  const distance = levenshteinDistance(original, modified);
  const changePercentage = Math.min(100, Math.round((distance / original.length) * 100));
  
  return changePercentage;
}

// Utility functions

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateDummyParagraph(topic: string, sentenceCount: number): string {
  const sentences = [];
  const topicWords = topic.split(" ");
  
  for (let i = 0; i < sentenceCount; i++) {
    // Create a variety of sentence structures using the topic
    if (i === 0) {
      sentences.push(`${capitalize(topic)} is a fascinating subject that deserves thorough examination.`);
    } else if (i === sentenceCount - 1) {
      sentences.push(`Understanding ${topic.toLowerCase()} can lead to significant insights and applications.`);
    } else {
      const randomWord = topicWords[Math.floor(Math.random() * topicWords.length)];
      sentences.push(`The concept of ${randomWord.toLowerCase()} plays a crucial role in the broader context of ${topic.toLowerCase()}.`);
    }
  }
  
  return sentences.join(" ");
}