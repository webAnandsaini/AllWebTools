import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface GeneratorConfig {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  inputPlaceholder: string;
  optionsConfig: {
    toneSelector: boolean;
    lengthSelector: boolean;
    styleSelector: boolean;
    keywordsInput: boolean;
    additionalOptionsSelector: boolean;
  };
  howToUse: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  outputPlaceholder: string;
  generateButtonText: string;
}

const AIContentGeneratorDetailed: React.FC = () => {
  const [location] = useLocation();
  const [contentType, setContentType] = useState<string>("generic");
  const [topic, setTopic] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [tone, setTone] = useState<string>("informative");
  const [length, setLength] = useState<string>("medium");
  const [style, setStyle] = useState<string>("standard");
  const [additionalOptions, setAdditionalOptions] = useState<string>("none");
  const [creativityLevel, setCreativityLevel] = useState<number>(70);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [config, setConfig] = useState<GeneratorConfig | null>(null);

  // Set the content type based on the current URL
  useEffect(() => {
    if (location.includes("ai-writer")) {
      setContentType("writer");
    } else if (location.includes("ai-text-generator")) {
      setContentType("text");
    } else if (location.includes("paragraph-generator")) {
      setContentType("paragraph");
    } else if (location.includes("essay-title-generator")) {
      setContentType("essayTitle");
    } else if (location.includes("plot-generator")) {
      setContentType("plot");
    } else if (location.includes("thesis-statement-generator")) {
      setContentType("thesis");
    } else if (location.includes("ai-story-generator")) {
      setContentType("story");
    } else if (location.includes("conclusion-generator")) {
      setContentType("conclusion");
    } else if (location.includes("ai-email-writer")) {
      setContentType("email");
    } else {
      setContentType("generic");
    }
  }, [location]);

  // Configuration for different content types
  useEffect(() => {
    const configurations: { [key: string]: GeneratorConfig } = {
      writer: {
        title: "AI Writer",
        slug: "ai-writer",
        description: "Leverage the power of artificial intelligence to create high-quality, engaging content for blogs, articles, essays, and more with our AI Writer. This advanced tool uses cutting-edge language models to generate human-like text on any topic, saving you time and helping overcome writer's block. Whether you need polished blog posts, marketing copy, academic essays, or creative content, our AI Writer delivers customizable, coherent, and contextually relevant results tailored to your tone and style preferences.",
        introduction: "Generate professional-quality written content on any topic with advanced AI technology.",
        inputPlaceholder: "Enter your topic or provide a brief for the content you want to generate...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter your topic or provide a brief description of what you want to write about",
          "Select your preferred tone (informative, persuasive, casual, formal, etc.)",
          "Choose the desired content length",
          "Add optional keywords you'd like to include in the content",
          "Click 'Generate Content' and receive AI-written text in seconds"
        ],
        features: [
          "✅ Creates high-quality content on virtually any topic",
          "✅ Customizable tone and style options to match your brand voice",
          "✅ Multiple length options from short paragraphs to full articles",
          "✅ Keyword integration for SEO-friendly content",
          "✅ Instant results with unlimited generations"
        ],
        faqs: [
          {
            question: "How accurate is the AI-generated content?",
            answer: "Our AI Writer generates content that is contextually relevant and coherent. While the AI produces high-quality text, it's always recommended to review and edit the output for factual accuracy, especially for specialized or technical topics."
          },
          {
            question: "Can I use the generated content for commercial purposes?",
            answer: "Yes, all content generated by our AI Writer belongs to you and can be used for commercial purposes, including blogs, websites, marketing materials, and more."
          },
          {
            question: "How can I get the most out of the AI Writer?",
            answer: "For best results, provide clear and specific topic descriptions, include relevant keywords, and specify your desired tone and style. The more guidance you provide, the more tailored the output will be to your needs."
          },
          {
            question: "Does the tool check for plagiarism?",
            answer: "The AI Writer generates original content based on its training data. However, for extra assurance, we recommend running the content through a plagiarism checker, especially for academic or professional use."
          }
        ],
        outputPlaceholder: "Your AI-written content will appear here...",
        generateButtonText: "Generate Content"
      },
      text: {
        title: "AI Text Generator",
        slug: "ai-text-generator",
        description: "Create tailored content for any purpose with our versatile AI Text Generator. Whether you need professional business copy, creative writing, academic papers, or social media posts, our advanced AI technology can generate high-quality text that matches your specified tone, style, and length. The intuitive interface lets you customize your request with keywords and specific requirements to produce content that feels natural and personally crafted. Save time and overcome writer's block with instantly generated text that can be used as-is or as a foundation for your own writing.",
        introduction: "Generate custom text for any purpose with our versatile, easy-to-use AI text generator.",
        inputPlaceholder: "What would you like the AI to write about?",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter your topic or provide context for what you want to generate",
          "Adjust the creativity level slider to control how inventive the AI should be",
          "Select your preferred tone, length, and style options",
          "Add any specific keywords you want to include in the text",
          "Click 'Generate Text' and review your results"
        ],
        features: [
          "✅ Versatile text generation for multiple purposes and formats",
          "✅ Adjustable creativity and style settings",
          "✅ Custom tone options ranging from formal to casual",
          "✅ Length options from short paragraphs to comprehensive articles",
          "✅ User-friendly interface with instant results"
        ],
        faqs: [
          {
            question: "What types of text can this tool generate?",
            answer: "Our AI Text Generator can create virtually any type of content, including blog posts, essays, social media captions, product descriptions, creative stories, business reports, emails, and more."
          },
          {
            question: "How original is the generated text?",
            answer: "The AI creates original content based on your specifications. While it draws on its training data to understand language patterns, the output is freshly generated for your prompt and not copied from existing sources."
          },
          {
            question: "Can I edit the generated text?",
            answer: "Absolutely! Think of the generated text as a starting point or draft. You can copy the text and edit it however you like, adding your personal touch or making factual corrections as needed."
          },
          {
            question: "What's the difference between the creativity levels?",
            answer: "Lower creativity settings produce more conservative, straightforward text that closely follows conventional patterns. Higher creativity settings allow the AI to be more inventive, producing more unique and unexpected phrasings and ideas."
          }
        ],
        outputPlaceholder: "Your generated text will appear here...",
        generateButtonText: "Generate Text"
      },
      paragraph: {
        title: "Paragraph Generator",
        slug: "paragraph-generator",
        description: "Create well-structured, coherent paragraphs on any topic with our AI-powered Paragraph Generator. This specialized tool helps you quickly generate clear, focused paragraphs that maintain logical flow and proper development of ideas. Perfect for students working on essays, content creators needing to expand on key points, or anyone looking to overcome writer's block. Our paragraph generator offers customizable options for tone, length, and style to ensure the content matches your specific needs, whether for academic, professional, or creative purposes.",
        introduction: "Generate well-structured, coherent paragraphs on any topic in seconds.",
        inputPlaceholder: "Enter the topic or main idea for your paragraph...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: false,
          keywordsInput: true,
          additionalOptionsSelector: false
        },
        howToUse: [
          "Enter the main topic or idea for your paragraph",
          "Select the tone that matches your writing style",
          "Choose your preferred paragraph length",
          "Add any key terms or phrases you want to include",
          "Click 'Generate Paragraph' to create your content"
        ],
        features: [
          "✅ Creates logically structured paragraphs with topic sentences and supporting details",
          "✅ Adjustable paragraph length from brief to comprehensive",
          "✅ Multiple tone options to match your writing style",
          "✅ Keyword integration for focused content",
          "✅ Ideal for academic essays, blog posts, or professional writing"
        ],
        faqs: [
          {
            question: "How long are the generated paragraphs?",
            answer: "The length of paragraphs can be customized by selecting short (3-4 sentences), medium (5-7 sentences), or long (8+ sentences) options, depending on your needs."
          },
          {
            question: "Can I use these paragraphs for my school assignments?",
            answer: "Yes, but we recommend using them as starting points or reference material. For academic integrity, you should always review, edit, and personalize the content to ensure it reflects your understanding and meets your assignment's requirements."
          },
          {
            question: "How can I make the paragraph flow better with my existing text?",
            answer: "To improve flow, include key terms from your surrounding text in the keywords field, and choose a tone that matches your overall document. After generating, you may need to add transitional phrases to connect it smoothly with your existing content."
          },
          {
            question: "Are the paragraphs factually accurate?",
            answer: "While our AI strives to generate logical and coherent paragraphs, you should always verify any factual claims, statistics, or specific information, especially for academic or professional use."
          }
        ],
        outputPlaceholder: "Your generated paragraph will appear here...",
        generateButtonText: "Generate Paragraph"
      },
      essayTitle: {
        title: "Essay Title Generator",
        slug: "essay-title-generator",
        description: "Craft compelling, attention-grabbing titles for your essays with our specialized Essay Title Generator. This innovative tool helps students, academics, and content creators overcome the challenge of creating engaging, relevant titles that accurately reflect their essay content. Using advanced AI technology, our generator produces a variety of title options based on your topic and preferences, ranging from straightforward academic titles to creative, thought-provoking alternatives. Save time brainstorming and ensure your essay makes a strong first impression with a professionally crafted title.",
        introduction: "Create compelling, attention-grabbing essay titles in seconds with our AI-powered generator.",
        inputPlaceholder: "Enter your essay topic or main thesis...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: false,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: false
        },
        howToUse: [
          "Enter your essay topic, main thesis, or a brief description of your paper",
          "Select your preferred style (academic, creative, question-based, etc.)",
          "Choose a tone that matches your essay's approach",
          "Add keywords relevant to your essay content",
          "Click 'Generate Titles' to get multiple title options"
        ],
        features: [
          "✅ Creates multiple title options for each request",
          "✅ Offers various title styles from academic to creative",
          "✅ Ensures titles are relevant to your specific essay topic",
          "✅ Helps capture reader interest from the start",
          "✅ Perfect for academic papers, blog posts, and articles"
        ],
        faqs: [
          {
            question: "How many title options will I get?",
            answer: "Our generator typically provides 5-10 different title options for each request, giving you a range of choices that vary in style and approach while remaining relevant to your topic."
          },
          {
            question: "What makes a good essay title?",
            answer: "A good essay title should be concise yet informative, relevant to your content, engaging to your audience, and appropriate for your assignment or publication. It should give readers a clear idea of what to expect while sparking their interest."
          },
          {
            question: "Can I use these titles for academic papers?",
            answer: "Yes! Our generator creates titles suitable for academic papers, including research papers, argumentative essays, analysis papers, and more. When selecting a title for academic work, choose options that best reflect the formal requirements of your assignment."
          },
          {
            question: "How can I customize the generated titles?",
            answer: "Feel free to mix and match elements from different generated titles, or use them as inspiration for your own creation. You can add specificity, change wording, or adjust punctuation to better match your exact needs."
          }
        ],
        outputPlaceholder: "Your generated essay titles will appear here...",
        generateButtonText: "Generate Titles"
      },
      plot: {
        title: "Plot Generator",
        slug: "plot-generator",
        description: "Spark your creativity with our AI-powered Plot Generator, designed to help writers, game developers, filmmakers, and storytellers create compelling narrative foundations. Whether you're working on a novel, short story, screenplay, or role-playing game, our tool generates unique, engaging plot concepts across multiple genres. Customize elements like genre, setting, and character types to receive tailored plot outlines that can serve as a springboard for your creative projects. Overcome writer's block and explore new narrative directions with plots generated specifically to match your storytelling preferences.",
        introduction: "Ignite your storytelling with unique, customizable plot ideas generated in seconds.",
        inputPlaceholder: "Enter any specific themes, elements, or starting points you'd like in your plot...",
        optionsConfig: {
          toneSelector: false,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter any specific themes or elements you want included in your plot",
          "Select a genre or style for your story",
          "Choose how detailed you want the plot outline to be",
          "Add optional keywords for characters, settings, or plot devices",
          "Click 'Generate Plot' to receive your custom story concept"
        ],
        features: [
          "✅ Creates unique plot concepts across multiple genres",
          "✅ Customizable level of detail from brief concepts to extended outlines",
          "✅ Generates character motivations and conflict scenarios",
          "✅ Provides plot twists and resolution ideas",
          "✅ Perfect for novelists, screenwriters, game designers, and creative writing students"
        ],
        faqs: [
          {
            question: "Are the generated plots completely unique?",
            answer: "Yes, our AI creates original plot concepts for each generation. While it draws inspiration from narrative patterns and structures that have proven effective in storytelling, each plot is uniquely generated based on your specifications."
          },
          {
            question: "Can I use these plots for my commercial projects?",
            answer: "Absolutely! The plots generated belong to you and can be used for novels, screenplays, games, or any other creative projects, including commercial ones. We encourage you to develop and adapt them to suit your specific needs."
          },
          {
            question: "What if I only like parts of the generated plot?",
            answer: "That's perfectly normal and part of the creative process! Feel free to take the elements you like and discard the rest, or combine elements from multiple generated plots. The generator is meant to be a starting point for your own creativity."
          },
          {
            question: "What genres work best with the plot generator?",
            answer: "Our generator works well with all major genres including fantasy, science fiction, romance, mystery, thriller, horror, historical fiction, and contemporary drama. Some specialized or niche genres may need additional customization after generation."
          }
        ],
        outputPlaceholder: "Your generated plot will appear here...",
        generateButtonText: "Generate Plot"
      },
      thesis: {
        title: "Thesis Statement Generator",
        slug: "thesis-statement-generator",
        description: "Create clear, focused thesis statements for academic papers with our AI-powered Thesis Statement Generator. This specialized tool helps students, researchers, and academics formulate strong, arguable thesis statements that effectively communicate the main argument of their papers. Simply enter your topic and key points, and our generator will craft well-structured thesis statements with the appropriate level of specificity and clarity for your academic level. Save time brainstorming and ensure your paper has a solid foundation with a professionally crafted thesis that will guide both your writing and your readers.",
        introduction: "Create powerful, arguable thesis statements that perfectly capture your paper's main argument.",
        inputPlaceholder: "Enter your research topic and main points...",
        optionsConfig: {
          toneSelector: false,
          lengthSelector: false,
          styleSelector: false,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter your research topic or paper subject",
          "Add keywords representing your main arguments or evidence",
          "Select your academic level (high school, undergraduate, graduate)",
          "Choose the type of paper (argumentative, analytical, expository)",
          "Click 'Generate Thesis' to receive multiple thesis statement options"
        ],
        features: [
          "✅ Creates clear, concise thesis statements for any academic paper",
          "✅ Offers multiple statement variations to choose from",
          "✅ Adjusts complexity based on academic level",
          "✅ Structures statements appropriate for different paper types",
          "✅ Perfect for essays, research papers, and dissertations"
        ],
        faqs: [
          {
            question: "What makes a good thesis statement?",
            answer: "A strong thesis statement is concise, specific, arguable, and sets clear expectations for the paper. It should present a claim or position that requires evidence and analysis to support, not simply state a fact."
          },
          {
            question: "Where should I place my thesis statement in my paper?",
            answer: "Typically, a thesis statement appears at the end of your introduction paragraph, serving as a bridge between introducing your topic and beginning your argument or analysis in the body paragraphs."
          },
          {
            question: "Can I modify the generated thesis statement?",
            answer: "Absolutely! Consider the generated thesis as a starting point. Feel free to refine it by adjusting language, specificity, or scope to better match your exact research question and available evidence."
          },
          {
            question: "How specific should my thesis statement be?",
            answer: "Your thesis should be narrow enough to be covered thoroughly in your paper, but not so specific that you can't develop it adequately. The right balance depends on your paper length—a 5-page paper needs a more focused thesis than a dissertation."
          }
        ],
        outputPlaceholder: "Your generated thesis statements will appear here...",
        generateButtonText: "Generate Thesis"
      },
      story: {
        title: "AI Story Generator",
        slug: "ai-story-generator",
        description: "Bring imaginative stories to life with our AI Story Generator, a powerful tool that creates unique, engaging narratives across multiple genres and styles. Whether you're looking for creative inspiration, educational content for children, or entertainment, our generator crafts coherent stories with well-developed characters and compelling plots. Customize your story by selecting genre, length, tone, and key elements to receive a tailored narrative that matches your preferences. Perfect for writers seeking inspiration, teachers creating educational materials, or anyone who enjoys reading original short stories.",
        introduction: "Create imaginative, engaging stories with just a few clicks using our AI-powered story generator.",
        inputPlaceholder: "Describe the story you want to create or provide a starting premise...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter a story premise or describe what you'd like the story to be about",
          "Select your preferred genre and storytelling style",
          "Choose the appropriate length and tone for your story",
          "Add keywords for characters, settings, or themes you want included",
          "Click 'Generate Story' to create your unique narrative"
        ],
        features: [
          "✅ Creates complete stories with beginning, middle, and end",
          "✅ Multiple genre options from fantasy to mystery to romance",
          "✅ Customizable story length from flash fiction to short stories",
          "✅ Develops characters and dialogue to engage readers",
          "✅ Perfect for creative inspiration or ready-to-read entertainment"
        ],
        faqs: [
          {
            question: "How long are the generated stories?",
            answer: "Story length can be customized by selecting short (around 300 words), medium (around 600 words), or long (1000+ words) options. The actual length may vary slightly based on the complexity of the narrative and other parameters you select."
          },
          {
            question: "Can I use these stories for my blog or website?",
            answer: "Yes! Stories generated by our tool belong to you and can be used for personal or commercial purposes, including blogs, websites, or social media. We recommend reviewing and editing the content to ensure it perfectly matches your style and requirements."
          },
          {
            question: "Are the stories appropriate for children?",
            answer: "By default, our generator creates generally appropriate content. When creating stories specifically for children, select the 'Children's Story' style option and an appropriate tone to ensure age-suitable content. Always review the generated content before sharing with young audiences."
          },
          {
            question: "How can I get the most creative results?",
            answer: "For maximum creativity, provide a unique or unusual premise, select a high creativity level, and combine unexpected elements in your keywords (e.g., mixing genres or unusual character types). The more specific and original your input, the more distinctive your story will be."
          }
        ],
        outputPlaceholder: "Your generated story will appear here...",
        generateButtonText: "Generate Story"
      },
      conclusion: {
        title: "Conclusion Generator",
        slug: "conclusion-generator",
        description: "Craft powerful, memorable conclusions for your essays, reports, presentations, and articles with our AI-powered Conclusion Generator. This specialized tool helps you create effective closing paragraphs that summarize your main points, reinforce your thesis, and leave readers with a strong final impression. Simply enter your paper's main ideas and thesis, and our generator will produce a well-structured conclusion that provides closure while emphasizing the significance of your work. Perfect for students, professionals, and content creators looking to finish their writing with impact.",
        introduction: "Create powerful conclusions that perfectly wrap up your essays, reports, and articles.",
        inputPlaceholder: "Enter your paper's topic, main points, and thesis statement...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: false,
          keywordsInput: true,
          additionalOptionsSelector: false
        },
        howToUse: [
          "Enter your paper's topic and main thesis statement",
          "List the key points or arguments made in your paper",
          "Select your preferred tone and conclusion length",
          "Add any keywords you want to emphasize in the conclusion",
          "Click 'Generate Conclusion' to create your closing paragraph"
        ],
        features: [
          "✅ Creates well-structured conclusions that effectively summarize content",
          "✅ Reinforces your thesis and main arguments",
          "✅ Offers appropriate closing statements across academic and professional contexts",
          "✅ Customizable length and tone to match your document",
          "✅ Perfect for essays, research papers, business reports, and blog articles"
        ],
        faqs: [
          {
            question: "What makes an effective conclusion?",
            answer: "An effective conclusion restates your thesis (in new words), summarizes your main points, emphasizes the significance of your argument, and leaves readers with a final thought or call to action. It provides closure while reinforcing your paper's importance."
          },
          {
            question: "Should I introduce new information in my conclusion?",
            answer: "No, your conclusion should not introduce completely new ideas or evidence. Its purpose is to synthesize what you've already discussed. However, you can suggest broader implications or future applications of your research or argument."
          },
          {
            question: "How long should my conclusion be?",
            answer: "A good rule of thumb is that your conclusion should be about 10% of your total paper length. For a 5-page paper, aim for a conclusion of about half a page. Our generator allows you to customize length based on your specific needs."
          },
          {
            question: "How can I make my conclusion more impactful?",
            answer: "To enhance impact, make sure your conclusion connects back to your introduction (creating a full circle), uses compelling language, emphasizes why your topic matters, and ends with a memorable final sentence that leaves readers thinking."
          }
        ],
        outputPlaceholder: "Your generated conclusion will appear here...",
        generateButtonText: "Generate Conclusion"
      },
      email: {
        title: "AI Email Writer",
        slug: "ai-email-writer",
        description: "Compose professional, effective emails in seconds with our AI Email Writer. This powerful tool helps you craft well-structured emails for business, academic, or personal purposes with the perfect tone and format. Whether you need to write a formal business proposal, a polite follow-up, a compelling sales pitch, or a friendly personal message, our email generator creates tailored content based on your specifications. Save time, overcome email writing anxiety, and ensure your messages are clear, professional, and appropriate for any situation.",
        introduction: "Write perfect professional and personal emails in seconds with our AI-powered email assistant.",
        inputPlaceholder: "Describe what your email needs to be about...",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Describe the purpose and context of your email",
          "Select the appropriate email type (professional, follow-up, request, etc.)",
          "Choose your preferred tone and length",
          "Add key points or information that must be included",
          "Click 'Generate Email' to create your customized message"
        ],
        features: [
          "✅ Creates professionally structured emails with proper formatting",
          "✅ Multiple email types for different business and personal scenarios",
          "✅ Customizable tone from formal to friendly",
          "✅ Includes appropriate salutations and closings",
          "✅ Perfect for busy professionals, job seekers, and anyone needing effective communication"
        ],
        faqs: [
          {
            question: "What types of emails can I create with this tool?",
            answer: "Our AI Email Writer can generate virtually any type of email, including job applications, meeting requests, business proposals, customer service responses, networking messages, follow-ups, thank you notes, apologies, announcements, sales pitches, and personal correspondence."
          },
          {
            question: "Should I edit the generated emails before sending them?",
            answer: "Yes, we recommend reviewing and personalizing the generated emails. While our AI creates professional content, adding your personal touch, specific details, and ensuring all information is accurate will make your emails more effective and authentic."
          },
          {
            question: "How can I make the emails sound more like me?",
            answer: "After generating your email, personalize it by adjusting the language to match your usual communication style, adding specific details only you would know, and incorporating your standard greeting and sign-off phrases. This will help maintain your authentic voice."
          },
          {
            question: "Are email signatures included?",
            answer: "The generator provides a basic closing but doesn't include detailed signatures with contact information. After generating your email, you should add your standard signature with your name, title, company, phone number, and any other relevant contact details."
          }
        ],
        outputPlaceholder: "Your generated email will appear here...",
        generateButtonText: "Generate Email"
      },
      generic: {
        title: "AI Content Generator",
        slug: "ai-content-generator",
        description: "Create high-quality content for any purpose with our versatile AI Content Generator. This powerful tool leverages advanced artificial intelligence to produce well-written, engaging text for blogs, articles, essays, social media, and more. Customize your content with options for tone, length, style, and keywords to get perfectly tailored results for your specific needs. Whether you're a content creator, marketer, student, or business professional, our generator saves you time and helps overcome writer's block with instant, relevant content you can use immediately or adapt to your requirements.",
        introduction: "Generate high-quality, customized content for any purpose with our advanced AI technology.",
        inputPlaceholder: "What would you like the AI to write about?",
        optionsConfig: {
          toneSelector: true,
          lengthSelector: true,
          styleSelector: true,
          keywordsInput: true,
          additionalOptionsSelector: true
        },
        howToUse: [
          "Enter your topic or describe what you want to generate",
          "Select the appropriate content type, tone, and length",
          "Adjust the creativity level to control how inventive the AI should be",
          "Add any specific keywords you want to include",
          "Click 'Generate Content' and get your results instantly"
        ],
        features: [
          "✅ Creates high-quality content for multiple purposes and formats",
          "✅ Customizable tone, length, and style options",
          "✅ Adjustable creativity levels to match your needs",
          "✅ Keyword integration for focused, relevant content",
          "✅ User-friendly interface with instant results"
        ],
        faqs: [
          {
            question: "What types of content can I create?",
            answer: "Our AI Content Generator can create virtually any type of written content, including blog posts, articles, essays, social media captions, product descriptions, emails, marketing copy, creative writing, and more."
          },
          {
            question: "Is the generated content plagiarism-free?",
            answer: "Yes, our AI generates original content for each request. While it draws on its training data to understand language patterns and topic knowledge, it creates new text rather than copying existing content."
          },
          {
            question: "How can I get the best results?",
            answer: "For optimal results, be specific in your topic description, choose appropriate tone and style settings, and provide relevant keywords. The more guidance you give the AI, the more tailored the output will be to your needs."
          },
          {
            question: "Should I edit the generated content?",
            answer: "We recommend reviewing and editing the generated content to ensure it perfectly matches your voice, add your expertise, verify any factual statements, and make it truly your own. Think of the generated content as a strong first draft."
          }
        ],
        outputPlaceholder: "Your generated content will appear here...",
        generateButtonText: "Generate Content"
      }
    };

    setConfig(configurations[contentType]);
  }, [contentType]);

  // Sample AI content generation function
  const generateContent = () => {
    if (!topic) {
      setError("Please enter a topic or description.");
      return;
    }

    setIsGenerating(true);
    setError("");

    // Simulate AI generation with a delay
    setTimeout(() => {
      const topicWords = topic.split(" ");
      const keywordWords = keywords ? keywords.split(",").map(k => k.trim()) : [];
      
      try {
        let generatedText = "";
        
        // Different generation logic based on content type
        switch (contentType) {
          case "writer":
          case "text":
          case "generic":
            generatedText = generateGenericContent();
            break;
          case "paragraph":
            generatedText = generateParagraphContent();
            break;
          case "essayTitle":
            generatedText = generateTitleContent();
            break;
          case "plot":
            generatedText = generatePlotContent();
            break;
          case "thesis":
            generatedText = generateThesisContent();
            break;
          case "story":
            generatedText = generateStoryContent();
            break;
          case "conclusion":
            generatedText = generateConclusionContent();
            break;
          case "email":
            generatedText = generateEmailContent();
            break;
          default:
            generatedText = generateGenericContent();
        }
        
        setGeneratedContent(generatedText);
        setIsGenerating(false);
      } catch (e) {
        setError("An error occurred while generating content. Please try again.");
        setIsGenerating(false);
      }
    }, 2000);
  };

  // Sample content generation functions
  const generateGenericContent = () => {
    const paragraphCount = length === "short" ? 2 : length === "medium" ? 4 : 6;
    const topicWords = topic.split(" ");
    
    let content = "";
    
    // Introduction
    content += `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
    
    // Generate paragraphs
    for (let i = 0; i < paragraphCount; i++) {
      // Randomize paragraph length between 3-6 sentences
      const sentenceCount = Math.floor(Math.random() * 4) + 3;
      
      for (let j = 0; j < sentenceCount; j++) {
        // Create a random sentence related to the topic
        const sentenceLength = Math.floor(Math.random() * 15) + 5;
        let sentence = "";
        
        for (let k = 0; k < sentenceLength; k++) {
          // 10% chance to include a keyword if available
          if (keywords && keywords.length > 0 && Math.random() < 0.1) {
            const keywordArray = keywords.split(",").map(k => k.trim());
            sentence += keywordArray[Math.floor(Math.random() * keywordArray.length)] + " ";
          } else {
            // Otherwise use a random word from the topic
            sentence += topicWords[Math.floor(Math.random() * topicWords.length)] + " ";
          }
        }
        
        // Clean up and capitalize sentence
        sentence = sentence.trim();
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";
        content += sentence;
      }
      
      content += "\n\n";
    }
    
    // Add conclusion for longer content
    if (paragraphCount > 2) {
      content += "In conclusion, " + topicWords.join(" ") + " represents an important area that deserves attention and consideration. The points discussed highlight the significance and potential impact of this topic in various contexts.";
    }
    
    return content;
  };

  const generateParagraphContent = () => {
    const sentenceCount = length === "short" ? 3 : length === "medium" ? 5 : 8;
    const topicWords = topic.split(" ");
    
    let content = "";
    
    // Topic sentence
    content += `${topic.charAt(0).toUpperCase() + topic.slice(1)} is a subject of significant interest and importance. `;
    
    // Supporting sentences
    for (let i = 1; i < sentenceCount - 1; i++) {
      // Mix in keywords if available
      if (keywords && i % 2 === 0) {
        const keywordArray = keywords.split(",").map(k => k.trim());
        const keyword = keywordArray[Math.floor(Math.random() * keywordArray.length)];
        content += `The concept of ${keyword} plays a crucial role in understanding this topic. `;
      } else {
        content += `It encompasses various aspects including ${topicWords[Math.floor(Math.random() * topicWords.length)]} and related considerations. `;
      }
    }
    
    // Concluding sentence
    content += `Overall, this demonstrates the complexity and relevance of ${topic} in today's context.`;
    
    return content;
  };

  const generateTitleContent = () => {
    const topicWords = topic.split(" ");
    const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
    
    // Generate 5 different title styles
    let titles = "## Essay Title Options\n\n";
    
    // Standard academic title
    titles += `1. **The Impact of ${topic.charAt(0).toUpperCase() + topic.slice(1)} on Modern Society**\n\n`;
    
    // Question-based title
    titles += `2. **How Does ${topic.charAt(0).toUpperCase() + topic.slice(1)} Shape Our Understanding of ${keywordArray.length > 0 ? keywordArray[0] : "Contemporary Issues"}?**\n\n`;
    
    // Colon-based title
    titles += `3. **${topic.charAt(0).toUpperCase() + topic.slice(1)}: Analyzing Its Role in ${keywordArray.length > 0 ? keywordArray[Math.floor(Math.random() * keywordArray.length)] : "Today's World"}**\n\n`;
    
    // Creative/metaphorical title
    titles += `4. **Beyond the Surface: Exploring the Depths of ${topic.charAt(0).toUpperCase() + topic.slice(1)}**\n\n`;
    
    // Comparative title
    titles += `5. **Between Theory and Practice: ${topic.charAt(0).toUpperCase() + topic.slice(1)} in ${keywordArray.length > 0 ? keywordArray[Math.floor(Math.random() * keywordArray.length)] : "Contemporary Discourse"}**\n\n`;
    
    return titles;
  };

  const generatePlotContent = () => {
    const plotLength = length === "short" ? "brief" : length === "medium" ? "moderate" : "detailed";
    
    let content = `# ${topic.charAt(0).toUpperCase() + topic.slice(1)} - Plot Outline\n\n`;
    
    // Introduction and setting
    content += `## Setting\nThe story takes place in a ${keywords ? keywords.split(",")[0] : "fascinating"} world where ${topic} is a central element of society. `;
    
    // Characters
    content += `\n\n## Main Characters\n`;
    content += `- **Protagonist**: A determined individual with a deep connection to ${topic}\n`;
    content += `- **Antagonist**: Someone who opposes the protagonist's goals related to ${topic}\n`;
    content += `- **Supporting Character**: A wise mentor who guides the protagonist\n`;
    
    // Plot structure
    content += `\n\n## Plot Structure\n`;
    
    // Introduction
    content += `### Act 1: Introduction\nThe story begins with our protagonist discovering a unique aspect of ${topic} that changes their perspective. They decide to pursue this new understanding despite obstacles.\n\n`;
    
    // Rising action and conflict
    content += `### Act 2: Rising Action\nAs the protagonist delves deeper into ${topic}, they encounter resistance from the antagonist who has contrary beliefs. The conflict intensifies as both sides gather supporters and resources.\n\n`;
    
    // Only add more detailed middle sections for medium/long plots
    if (plotLength !== "brief") {
      content += `### Act 2.5: Complications\nUnexpected challenges arise when a revelation about ${topic} throws both the protagonist and antagonist's understanding into question. The protagonist must reevaluate their approach.\n\n`;
    }
    
    // Climax
    content += `### Act 3: Climax\nThe conflict reaches its peak when the protagonist and antagonist face off in a decisive confrontation about ${topic}. The protagonist discovers a critical insight that gives them an advantage.\n\n`;
    
    // Resolution
    content += `### Act 4: Resolution\nThrough their journey with ${topic}, the protagonist achieves a new understanding that brings resolution to the conflict. The world is changed as a result of their actions and discoveries.\n\n`;
    
    // Additional details for longer plots
    if (plotLength === "detailed") {
      content += `## Themes\n- The nature of ${topic} and its impact on individuals\n- The conflict between traditional and progressive views\n- Personal growth through adversity\n- The importance of understanding different perspectives\n\n`;
      
      content += `## Potential Plot Twists\n- A character believed to be an ally is revealed to be working with the antagonist\n- The protagonist discovers their understanding of ${topic} has been based on a fundamental misconception\n- A seemingly minor character becomes crucial to the resolution\n`;
    }
    
    return content;
  };

  const generateThesisContent = () => {
    const topicWords = topic.split(" ");
    const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
    
    let content = "## Thesis Statement Options\n\n";
    
    // Argumentative thesis
    content += "### Argumentative Thesis\n";
    content += `Despite common misconceptions, ${topic} significantly impacts ${keywordArray.length > 0 ? keywordArray[0] : "modern society"} through its influence on ${keywordArray.length > 1 ? keywordArray[1] : "key institutions"} and ${keywordArray.length > 2 ? keywordArray[2] : "cultural practices"}, requiring a reevaluation of current approaches and policies.\n\n`;
    
    // Analytical thesis
    content += "### Analytical Thesis\n";
    content += `An examination of ${topic} reveals three critical components: ${keywordArray.length > 0 ? keywordArray[0] : "historical context"}, ${keywordArray.length > 1 ? keywordArray[1] : "contemporary applications"}, and ${keywordArray.length > 2 ? keywordArray[2] : "future implications"}, which together demonstrate its profound significance in ${keywordArray.length > 3 ? keywordArray[3] : "today's discourse"}.\n\n`;
    
    // Expository thesis
    content += "### Expository Thesis\n";
    content += `${topic.charAt(0).toUpperCase() + topic.slice(1)} encompasses multiple dimensions including ${keywordArray.length > 0 ? keywordArray[0] : "social factors"}, ${keywordArray.length > 1 ? keywordArray[1] : "economic considerations"}, and ${keywordArray.length > 2 ? keywordArray[2] : "ethical implications"}, each contributing to its complex role in ${keywordArray.length > 3 ? keywordArray[3] : "modern society"}.\n\n`;
    
    // Comparative thesis
    content += "### Comparative Thesis\n";
    content += `While traditional perspectives on ${topic} emphasize ${keywordArray.length > 0 ? keywordArray[0] : "conventional wisdom"}, contemporary approaches prioritize ${keywordArray.length > 1 ? keywordArray[1] : "innovative solutions"}, revealing a fundamental shift in understanding that has significant implications for ${keywordArray.length > 2 ? keywordArray[2] : "future developments"}.\n\n`;
    
    // Cause-effect thesis
    content += "### Cause-Effect Thesis\n";
    content += `The evolution of ${topic} has been primarily driven by ${keywordArray.length > 0 ? keywordArray[0] : "technological advancements"}, ${keywordArray.length > 1 ? keywordArray[1] : "social changes"}, and ${keywordArray.length > 2 ? keywordArray[2] : "economic factors"}, resulting in profound transformations that continue to shape ${keywordArray.length > 3 ? keywordArray[3] : "contemporary society"}.`;
    
    return content;
  };

  const generateStoryContent = () => {
    const storyLength = length === "short" ? "brief" : length === "medium" ? "moderate" : "detailed";
    const topicWords = topic.split(" ");
    const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
    
    let content = `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
    
    // Introduction
    content += `Once upon a time in a world where ${topic} was central to everyone's lives, there lived a ${keywordArray.length > 0 ? keywordArray[0] : "determined individual"} named Alex. `;
    content += `Alex had always been fascinated by the mysteries of ${topic}, spending countless hours studying and exploring its nuances.\n\n`;
    
    // Rising action
    content += `One ordinary day, as Alex was ${keywordArray.length > 1 ? `exploring the realm of ${keywordArray[1]}` : `going about their usual routine`}, `;
    content += `they discovered something extraordinary about ${topic} that no one had noticed before. `;
    content += `This discovery set Alex on an unexpected journey filled with adventure and challenges.\n\n`;
    
    // Add more details for medium/long stories
    if (storyLength !== "brief") {
      content += `As word of Alex's discovery spread, it caught the attention of ${keywordArray.length > 2 ? keywordArray[2] : "powerful figures"} who had different plans for ${topic}. `;
      content += `They sought to control and manipulate this knowledge for their own benefit. `;
      content += `Alex soon found themselves pursued by these forces while trying to protect what they had learned.\n\n`;
      
      content += `Along the way, Alex met ${keywordArray.length > 3 ? keywordArray[3] : "a wise mentor"} who had been studying ${topic} for decades. `;
      content += `This mentor shared ancient wisdom that helped Alex understand the true significance of their discovery. `;
      content += `Together, they formulated a plan to ensure that the knowledge of ${topic} would benefit everyone, not just a select few.\n\n`;
    }
    
    // Climax
    content += `The confrontation came during ${tone === "formal" ? "a significant assembly" : tone === "casual" ? "a big showdown" : "a crucial moment"} `;
    content += `when Alex had to demonstrate the true nature of ${topic} in front of skeptics and believers alike. `;
    content += `Using everything they had learned, Alex presented a compelling case that ${tone === "formal" ? "elucidated" : tone === "casual" ? "showed" : "revealed"} `;
    content += `the profound importance of ${topic} in ways no one had imagined.\n\n`;
    
    // Resolution
    content += `In the end, Alex's journey transformed not only their own understanding of ${topic} but changed how everyone perceived it. `;
    content += `The discovery became a catalyst for positive change throughout society, inspiring a new generation of explorers and thinkers. `;
    content += `As for Alex, they continued their studies, knowing there was still much more to learn about the fascinating world of ${topic}.\n\n`;
    
    // More detailed ending for long stories
    if (storyLength === "detailed") {
      content += `Years later, Alex established an academy dedicated to the study of ${topic}, where people from all walks of life could come to learn and contribute their own insights. `;
      content += `The legacy of that initial discovery continued to grow and evolve, touching countless lives and opening new frontiers of understanding. `;
      content += `And sometimes, on quiet evenings, Alex would smile remembering that ordinary day that had started an extraordinary journey.`;
    }
    
    return content;
  };

  const generateConclusionContent = () => {
    const topicWords = topic.split(" ");
    const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
    
    let content = "";
    
    // Opening restatement of thesis
    content += `In conclusion, ${topic} represents a significant area of study with far-reaching implications. `;
    
    // Summary of main points
    content += `As demonstrated throughout this ${tone === "formal" ? "paper" : tone === "casual" ? "discussion" : "analysis"}, `;
    content += `the key aspects of ${keywordArray.length > 0 ? keywordArray[0] : "this subject"}, `;
    content += `${keywordArray.length > 1 ? keywordArray[1] : "its applications"}, and `;
    content += `${keywordArray.length > 2 ? keywordArray[2] : "related factors"} `;
    content += `collectively illustrate the complexity and importance of this topic. `;
    
    // Significance statement
    content += `The insights gained from examining ${topic} contribute to our understanding of `;
    content += `${keywordArray.length > 3 ? keywordArray[3] : "broader concepts"} and provide a foundation for future research. `;
    
    // Add more for medium/long conclusions
    if (length !== "short") {
      content += `Moreover, the analysis of ${topic} reveals connections to ${keywordArray.length > 0 ? keywordArray[0] : "related fields"} `;
      content += `that merit further exploration. The implications extend beyond theoretical considerations to practical applications in `;
      content += `${keywordArray.length > 1 ? keywordArray[1] : "various contexts"}. `;
    }
    
    // Closing thought or call to action
    content += `Moving forward, continued investigation into ${topic} will likely yield additional insights that could transform our approach to `;
    content += `${keywordArray.length > 2 ? keywordArray[2] : "contemporary challenges"}. `;
    content += `By building upon the foundation established here, future scholars and practitioners can develop more comprehensive frameworks that address the complexities inherent in this important subject.`;
    
    return content;
  };

  const generateEmailContent = () => {
    const topicWords = topic.split(" ");
    const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
    
    let content = "";
    
    // Email subject
    content += `**Subject:** ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
    
    // Salutation
    content += tone === "formal" ? "Dear Recipient,\n\n" : tone === "casual" ? "Hi there,\n\n" : "Hello,\n\n";
    
    // Introduction
    content += `I am writing to ${topic.toLowerCase().startsWith("request") || topic.toLowerCase().startsWith("inquire") ? topic : `discuss ${topic}`}. `;
    
    // Main content
    if (keywordArray.length > 0) {
      content += `As you may know, ${keywordArray[0]} is a key consideration in this matter. `;
    }
    
    content += `I would like to ${topic.toLowerCase().includes("request") ? "formally request" : topic.toLowerCase().includes("inform") ? "inform you" : "discuss with you"} `;
    content += `the details regarding ${topic} and explore potential next steps.\n\n`;
    
    // Add more details for medium/long emails
    if (length !== "short") {
      content += `Specifically, I am interested in addressing the following points:\n\n`;
      content += `1. The current status of ${topic}\n`;
      content += `2. ${keywordArray.length > 1 ? `The implications of ${keywordArray[1]}` : `Potential opportunities for collaboration`}\n`;
      content += `3. ${keywordArray.length > 2 ? `Next steps regarding ${keywordArray[2]}` : `Timeline for implementation or discussion`}\n\n`;
      
      content += `I believe that addressing these aspects will provide a solid foundation for our ${topic.toLowerCase().includes("proposal") ? "proposal" : "discussion"}. `;
      content += `Your insights on this matter would be greatly valued.\n\n`;
    }
    
    // Request for action or response
    content += `I would appreciate your ${topic.toLowerCase().includes("meeting") ? "availability for a meeting" : "thoughts on this matter"} `;
    content += `at your earliest convenience. `;
    
    if (length === "long") {
      content += `Please let me know if you require any additional information or clarification. `;
      content += `I am available to discuss this further and answer any questions you might have.\n\n`;
    }
    
    // Closing
    content += `Thank you for your ${tone === "formal" ? "consideration" : tone === "casual" ? "help" : "attention"} to this matter.\n\n`;
    
    // Signature
    content += tone === "formal" ? "Sincerely,\n\n[Your Name]\n[Your Title/Position]" : tone === "casual" ? "Thanks,\n\n[Your Name]" : "Best regards,\n\n[Your Name]";
    
    return content;
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="topic">Topic or Description</Label>
              <Textarea
                id="topic"
                placeholder={config.inputPlaceholder}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.optionsConfig.toneSelector && (
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={tone}
                    onValueChange={(value) => setTone(value)}
                  >
                    <SelectTrigger id="tone" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {config.optionsConfig.lengthSelector && (
                <div>
                  <Label htmlFor="length">Length</Label>
                  <Select
                    value={length}
                    onValueChange={(value) => setLength(value)}
                  >
                    <SelectTrigger id="length" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {config.optionsConfig.styleSelector && (
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select
                    value={style}
                    onValueChange={(value) => setStyle(value)}
                  >
                    <SelectTrigger id="style" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="narrative">Narrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {config.optionsConfig.additionalOptionsSelector && (
                <div>
                  <Label htmlFor="additionalOptions">Additional Options</Label>
                  <Select
                    value={additionalOptions}
                    onValueChange={(value) => setAdditionalOptions(value)}
                  >
                    <SelectTrigger id="additionalOptions" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="includeQuotes">Include Quotes</SelectItem>
                      <SelectItem value="includeStatistics">Include Statistics</SelectItem>
                      <SelectItem value="includeExamples">Include Examples</SelectItem>
                      <SelectItem value="includeAcademic">Include Academic Citations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {config.optionsConfig.keywordsInput && (
              <div>
                <Label htmlFor="keywords">Keywords (Optional, separate with commas)</Label>
                <Input
                  id="keywords"
                  placeholder="Enter relevant keywords..."
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}
            
            <div>
              <Label>Creativity Level: {creativityLevel}%</Label>
              <Slider
                value={[creativityLevel]}
                onValueChange={(value) => setCreativityLevel(value[0])}
                min={10}
                max={100}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            <Button 
              variant="default" 
              onClick={generateContent} 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : config.generateButtonText}
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {generatedContent && (
              <div className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <div className="prose max-w-none whitespace-pre-line">
                        {generatedContent.split("\n").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            navigator.clipboard.writeText(generatedContent);
                          }}
                        >
                          Copy Content
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About {config.title}</h3>
          <div className="text-sm space-y-4">
            <p>
              Our {config.title} helps you create high-quality content efficiently and effortlessly. Simply enter your topic, customize your preferences, and let our AI do the work.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Creating content for blogs, articles, and websites</li>
                <li>Generating professional emails and business communications</li>
                <li>Developing educational materials and academic content</li>
                <li>Crafting marketing copy and promotional materials</li>
                <li>Overcoming writer's block and sparking creativity</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>Note: While our AI generates high-quality content, we recommend reviewing and editing the output for your specific needs and to ensure accuracy.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Determine the toolSlug from the current URL
  const getToolSlug = (): string => {
    return config.slug;
  };

  return (
    <ToolPageTemplate
      toolSlug={getToolSlug()}
      toolContent={
        <ToolContentTemplate
          introduction={config.introduction}
          description={config.description}
          howToUse={config.howToUse}
          features={config.features}
          faqs={config.faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default AIContentGeneratorDetailed;