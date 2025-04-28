import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Types for plot generation
type Genre = 
  "fantasy" | "sci-fi" | "romance" | "mystery" | "thriller" | 
  "horror" | "adventure" | "historical" | "comedy" | "drama";

type PlotLength = "short" | "medium" | "long";
type PlotComplexity = "simple" | "moderate" | "complex";
type PlotTone = "dark" | "light" | "neutral" | "hopeful" | "tragic" | "humorous";

interface Character {
  name: string;
  role: string;
}

const PlotGeneratorDetailed = () => {
  // State for inputs
  const [genre, setGenre] = useState<Genre>("fantasy");
  const [plotLength, setPlotLength] = useState<PlotLength>("medium");
  const [complexity, setComplexity] = useState<PlotComplexity>("moderate");
  const [tone, setTone] = useState<PlotTone>("neutral");
  const [mainCharacter, setMainCharacter] = useState("");
  const [mainCharacterRole, setMainCharacterRole] = useState("");
  const [supportingCharacters, setSupportingCharacters] = useState<Character[]>([]);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRole, setNewCharRole] = useState("");
  const [setting, setSetting] = useState("");
  const [theme, setTheme] = useState("");
  const [conflict, setConflict] = useState("");
  const [includeTwist, setIncludeTwist] = useState(true);
  const [includeResolution, setIncludeResolution] = useState(true);
  const [activeTab, setActiveTab] = useState("generator");
  
  // State for output and processing
  const [generatedPlot, setGeneratedPlot] = useState("");
  const [plotOutline, setPlotOutline] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOutline, setShowOutline] = useState(false);
  
  const { toast } = useToast();

  // Add supporting character
  const handleAddCharacter = () => {
    if (newCharName.trim() === "" || newCharRole.trim() === "") {
      toast({
        title: "Character details required",
        description: "Please enter both a name and role for the character.",
        variant: "destructive",
      });
      return;
    }
    
    setSupportingCharacters([
      ...supportingCharacters,
      { name: newCharName, role: newCharRole }
    ]);
    
    setNewCharName("");
    setNewCharRole("");
  };

  // Remove supporting character
  const handleRemoveCharacter = (index: number) => {
    setSupportingCharacters(
      supportingCharacters.filter((_, i) => i !== index)
    );
  };

  // Generate plot when user clicks button
  const handleGeneratePlot = () => {
    // Check that we have at least the minimal required inputs
    if (!setting.trim()) {
      toast({
        title: "Setting required",
        description: "Please enter a setting for your plot.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedPlot("");
    setPlotOutline([]);
    setShowOutline(false);

    // First generate plot outline
    setTimeout(() => {
      const outline = generatePlotOutline();
      setPlotOutline(outline);
      setShowOutline(true);
    }, 1500);

    // Simulate plot generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Once "generation" is complete, show the plot
          const plot = generateMockPlot();
          setGeneratedPlot(plot);
          setIsGenerating(false);
          
          return 100;
        }
        return prev + 3;
      });
    }, 150);
  };

  // Generate plot outline based on user parameters
  const generatePlotOutline = (): string[] => {
    const outline: string[] = [];
    
    // Create an outline based on complexity and genre
    if (complexity === "simple") {
      outline.push("Setup: Introduction to the world and main character");
      outline.push("Inciting Incident: Event that disrupts the status quo");
      outline.push("Rising Action: Character faces challenges");
      outline.push("Climax: Main confrontation or decision point");
      
      if (includeResolution) {
        outline.push("Resolution: Aftermath and conclusion");
      }
    } else if (complexity === "moderate") {
      outline.push("Setup: Introduction to the world and characters");
      outline.push("Inciting Incident: Event that disrupts the status quo");
      outline.push("First Challenge: Initial obstacle or conflict");
      outline.push("Rising Action: Character development and complications");
      outline.push("Midpoint Twist: Significant revelation or change in direction");
      outline.push("Escalating Conflict: Stakes become higher");
      outline.push("Climax: Main confrontation or decision point");
      
      if (includeTwist) {
        outline.push("Plot Twist: Unexpected turn of events");
      }
      
      if (includeResolution) {
        outline.push("Resolution: Aftermath and conclusion");
      }
    } else { // complex
      outline.push("Setup: Introduction to the world, characters, and initial state");
      outline.push("Inciting Incident: Event that disrupts the status quo");
      outline.push("First Challenge: Initial obstacle or conflict");
      outline.push("Character Development: Deeper exploration of motivations");
      outline.push("Subplot Introduction: Secondary storyline begins");
      outline.push("Rising Action: Complications and obstacles increase");
      outline.push("Midpoint Twist: Significant revelation or change in direction");
      outline.push("Subplot Development: Secondary storyline progresses");
      outline.push("Escalating Conflict: Stakes become higher");
      outline.push("Dark Night: Moment of greatest doubt or difficulty");
      outline.push("Rally: Character finds new resolve or approach");
      outline.push("Climax: Main confrontation or decision point");
      
      if (includeTwist) {
        outline.push("Major Plot Twist: Significant unexpected turn of events");
      }
      
      if (includeResolution) {
        outline.push("Resolution: Aftermath and conclusion");
        outline.push("Epilogue: Future implications or character status");
      }
    }
    
    // Add genre-specific elements to the outline
    const genreElement = getGenreSpecificOutlineElement();
    
    // Insert the genre element at an appropriate position
    if (complexity === "simple") {
      outline.splice(2, 0, genreElement);
    } else {
      outline.splice(3, 0, genreElement);
    }
    
    return outline;
  };

  // Get genre-specific outline element
  const getGenreSpecificOutlineElement = (): string => {
    switch (genre) {
      case "fantasy":
        return "Magic System: Introduction to magical elements and rules";
        
      case "sci-fi":
        return "Technology/Science: Explanation of key scientific or technological concepts";
        
      case "romance":
        return "Meet Cute: First significant interaction between love interests";
        
      case "mystery":
        return "Mystery Introduction: Presentation of the central puzzle or question";
        
      case "thriller":
        return "Threat Establishment: Introduction of the main danger or antagonist";
        
      case "horror":
        return "Dread Building: Creation of atmosphere and initial supernatural/horror elements";
        
      case "adventure":
        return "Call to Journey: Character decides or is forced to embark on an adventure";
        
      case "historical":
        return "Historical Context: Establishment of period details and historical significance";
        
      case "comedy":
        return "Comic Setup: Introduction of humorous situation or misunderstanding";
        
      case "drama":
        return "Relationship Dynamics: Exploration of key character relationships and tensions";
        
      default:
        return "Genre Element: Introduction of key genre-specific elements";
    }
  };

  // Generate plot based on user parameters
  const generateMockPlot = (): string => {
    // In a real application, this would be an API call to an AI service
    // This is a mock implementation for demonstration purposes
    
    let plot = "";
    
    // Generate based on selected plot length
    const paragraphCount = plotLength === "short" ? 4 : 
                         plotLength === "medium" ? 6 : 8;
    
    // Generate each section based on the outline
    for (let i = 0; i < Math.min(paragraphCount, plotOutline.length); i++) {
      const outlinePoint = plotOutline[i];
      const sectionName = outlinePoint.split(":")[0];
      plot += generatePlotSection(sectionName, i);
      
      if (i < Math.min(paragraphCount, plotOutline.length) - 1) {
        plot += "\n\n";
      }
    }
    
    // Apply tone adjustments
    plot = adjustPlotTone(plot);
    
    return plot;
  };

  // Generate a plot section based on the outline point
  const generatePlotSection = (sectionName: string, index: number): string => {
    const mainCharName = mainCharacter || "the protagonist";
    const mainCharDesc = mainCharacterRole || "the hero";
    const settingDesc = setting || "the story's world";
    const themeDesc = theme || "the central theme";
    const conflictDesc = conflict || "a significant conflict";
    
    // Get supporting characters or use defaults
    const supportingChar1 = supportingCharacters.length > 0 ? 
      supportingCharacters[0].name : "a supporting character";
    const supportingChar1Role = supportingCharacters.length > 0 ? 
      supportingCharacters[0].role : "an ally";
    
    const supportingChar2 = supportingCharacters.length > 1 ? 
      supportingCharacters[1].name : "another character";
    const supportingChar2Role = supportingCharacters.length > 1 ? 
      supportingCharacters[1].role : "a companion";
    
    // Generate section based on the outline point name
    switch (sectionName) {
      case "Setup":
        return generateSetupSection(
          mainCharName, mainCharDesc, settingDesc, genre
        );
        
      case "Inciting Incident":
        return generateIncitingIncidentSection(
          mainCharName, conflictDesc, settingDesc, genre
        );
        
      case "First Challenge":
        return generateFirstChallengeSection(
          mainCharName, supportingChar1, conflictDesc, genre
        );
        
      case "Character Development":
        return generateCharacterDevelopmentSection(
          mainCharName, themeDesc, genre
        );
        
      case "Subplot Introduction":
        return generateSubplotSection(
          supportingChar1, supportingChar1Role, supportingChar2, mainCharName, genre
        );
        
      case "Rising Action":
        return generateRisingActionSection(
          mainCharName, conflictDesc, settingDesc, genre
        );
        
      case "Midpoint Twist":
        return generateMidpointTwistSection(
          mainCharName, supportingChar1, genre
        );
        
      case "Subplot Development":
        return generateSubplotDevelopmentSection(
          supportingChar1, supportingChar2, mainCharName, genre
        );
        
      case "Escalating Conflict":
        return generateEscalatingConflictSection(
          mainCharName, conflictDesc, genre
        );
        
      case "Dark Night":
        return generateDarkNightSection(
          mainCharName, themeDesc, genre
        );
        
      case "Rally":
        return generateRallySection(
          mainCharName, supportingChar1, genre
        );
        
      case "Climax":
        return generateClimaxSection(
          mainCharName, conflictDesc, genre
        );
        
      case "Major Plot Twist":
      case "Plot Twist":
        return generatePlotTwistSection(
          mainCharName, supportingChar1, genre
        );
        
      case "Resolution":
        return generateResolutionSection(
          mainCharName, themeDesc, genre
        );
        
      case "Epilogue":
        return generateEpilogueSection(
          mainCharName, supportingChar1, settingDesc, genre
        );
        
      // Genre-specific sections
      case "Magic System":
        return generateMagicSystemSection(settingDesc, mainCharName);
        
      case "Technology/Science":
        return generateTechnologySection(settingDesc, mainCharName);
        
      case "Meet Cute":
        return generateMeetCuteSection(mainCharName, supportingChar1);
        
      case "Mystery Introduction":
        return generateMysteryIntroSection(settingDesc, mainCharName);
        
      case "Threat Establishment":
        return generateThreatSection(mainCharName, conflictDesc);
        
      case "Dread Building":
        return generateDreadSection(mainCharName, settingDesc);
        
      case "Call to Journey":
        return generateCallToJourneySection(mainCharName, settingDesc);
        
      case "Historical Context":
        return generateHistoricalContextSection(settingDesc, mainCharName);
        
      case "Comic Setup":
        return generateComicSetupSection(mainCharName, supportingChar1);
        
      case "Relationship Dynamics":
        return generateRelationshipDynamicsSection(mainCharName, supportingChar1);
        
      default:
        return `In this part of the story, ${mainCharName} faces new challenges that test their resolve and move the plot forward. The events in ${settingDesc} continue to unfold in unexpected ways, revealing deeper layers of the narrative.`;
    }
  };

  // Various section generators for different parts of the plot
  const generateSetupSection = (
    character: string, role: string, setting: string, genre: Genre
  ): string => {
    switch (genre) {
      case "fantasy":
        return `In the mystical realm of ${setting}, ${character}, ${role}, lives a seemingly ordinary life unaware of the extraordinary destiny that awaits. Ancient forces stir in the shadows, and whispers of a prophecy begin to circulate among the elders. The balance between light and dark magic has maintained peace for generations, but subtle signs indicate this equilibrium is starting to falter.`;
        
      case "sci-fi":
        return `In the technologically advanced world of ${setting}, ${character}, ${role}, navigates a society transformed by scientific breakthroughs and artificial intelligence. Gleaming skyscrapers and automated systems create an illusion of utopian perfection, but beneath this polished surface, questions about humanity's future remain unanswered. Orbital colonies and interplanetary relations add complexity to an already intricate social structure.`;
        
      case "romance":
        return `${character}, ${role}, has built a comfortable life in ${setting}, focused on career and personal goals while keeping romantic entanglements at bay. Friends and family have long suggested something—or someone—is missing, but ${character} has masterfully deflected these concerns. The rhythms of daily life have become predictable, perhaps too predictable, creating the perfect conditions for an unexpected encounter to shatter this carefully maintained equilibrium.`;
        
      case "mystery":
        return `The peaceful façade of ${setting} conceals secrets that few suspect exist. ${character}, ${role}, possesses a keen eye for details others overlook and an intuitive understanding of human nature. When subtle inconsistencies begin appearing in the fabric of daily life, ${character} notices patterns that seem insignificant to others but suggest something ominous lurking beneath the surface.`;
        
      case "thriller":
        return `${setting} operates by unspoken rules and careful power balances that ${character}, ${role}, has learned to navigate with precision. Years of experience have honed sharp instincts and a network of contacts that provide security in a world where threats often remain invisible until it's too late. Recent developments have created an atmosphere of tension that only those with ${character}'s background can fully perceive.`;
        
      case "horror":
        return `${setting} appears idyllic to newcomers, its picturesque qualities masking a dark history that locals mention only in hushed tones. ${character}, ${role}, has recently arrived, seeking a fresh start and dismissing local superstitions as folklore. Strange occurrences—easily rationalized at first—begin to disturb the peace, while vivid nightmares plague ${character}'s sleep, featuring imagery connected to the area's troubled past.`;
        
      case "adventure":
        return `Maps of ${setting} hang on the walls of ${character}'s home, marked with annotations and possible expedition routes. As ${role}, ${character} has heard countless tales of undiscovered wonders and forgotten treasures but has yet to embark on a truly remarkable journey. A restless spirit and hunger for discovery have been building, creating perfect conditions for the extraordinary opportunity about to present itself.`;
        
      case "historical":
        return `The year is significant in ${setting}, with political tensions and social changes creating an atmosphere of uncertainty and possibility. ${character}, ${role}, witnesses these transformations firsthand, understanding their historical importance while navigating personal circumstances. Family traditions and societal expectations create a framework within which ${character} must define an individual path, all against the backdrop of monumental historical events.`;
        
      case "comedy":
        return `Life in ${setting} has become a series of comically predictable routines for ${character}, ${role}, whose carefully ordered existence leaves little room for spontaneity. Friends and colleagues have come to expect certain behaviors and reactions, making ${character}'s occasional departures from these patterns all the more surprising. An upcoming event promises to disrupt this comfortable predictability in ways no one could anticipate.`;
        
      case "drama":
        return `Complex relationships define ${character}'s existence in ${setting}, where family history and personal choices have created intricate bonds and unspoken tensions. As ${role}, ${character} maintains a delicate balance between conflicting obligations and desires, presenting different faces to different people. Beneath the surface, unresolved emotions and unspoken truths wait for the catalyst that will bring them into the open.`;
        
      default:
        return `${character}, ${role}, lives in the world of ${setting}, where an ordinary existence is about to be transformed by extraordinary events. The established patterns of daily life create a foundation that will soon be tested, revealing both strengths and vulnerabilities that have remained hidden until now.`;
    }
  };

  const generateIncitingIncidentSection = (
    character: string, conflict: string, setting: string, genre: Genre
  ): string => {
    switch (genre) {
      case "fantasy":
        return `Everything changes when ${character} discovers an ancient artifact hidden within a forgotten corner of ${setting}. Upon contact, mysterious symbols on the artifact illuminate, responding to something within ${character}'s blood or spirit. Simultaneously, dark forces sense this awakening and begin converging, while a stranger with knowledge of ancient prophecies appears with warnings about ${conflict} that now threatens not just ${character} but the entire realm.`;
        
      case "sci-fi":
        return `An unprecedented system failure across ${setting}'s central network creates a moment of chaos that reveals classified information never intended for public access. ${character} witnesses data fragments suggesting ${conflict} has been engineered by authorities for purposes contrary to the common good. This discovery places ${character} at a dangerous crossroads between pursuing the truth and maintaining the safety of ignorance.`;
        
      case "romance":
        return `A chance encounter in ${setting} brings ${character} face to face with someone who challenges every preconception about compatibility and attraction. What begins as a simple misunderstanding evolves into a conversation that stretches from minutes to hours, creating an unexpected connection. The meeting concludes with both parties sensing something significant has occurred, even as external circumstances related to ${conflict} threaten to prevent a second encounter.`;
        
      case "mystery":
        return `The discovery of anomalous evidence in ${setting} draws ${character}'s attention to a case others consider closed or insignificant. Initial investigation reveals inconsistencies that suggest the official narrative concerning ${conflict} has been carefully constructed to mislead. When ${character} begins asking questions, subtle warnings arrive from unexpected sources, indicating powerful interests prefer these matters remain undisturbed.`;
        
      case "thriller":
        return `An operation in ${setting} goes catastrophically wrong, leaving ${character} exposed and separated from usual support systems. Evidence suggests the compromise was not accidental but orchestrated by someone with intimate knowledge of procedures and personnel. As the immediate danger intensifies, ${character} discovers connections between this incident and ${conflict}, indicating a conspiracy with implications far beyond this single event.`;
        
      case "horror":
        return `During an exploration of ${setting}, ${character} unknowingly crosses a boundary that has protected the community for generations. This trespass awakens something that has waited patiently in the darkness, something connected to ${conflict} from the area's history. The first manifestations are subtle—easily dismissed as imagination or coincidence—but rapidly escalate in ways that cannot be rationalized or ignored.`;
        
      case "adventure":
        return `An unexpected messenger arrives in ${setting} with information that changes everything for ${character}. A map, a key, or a coded message presents the opportunity for an expedition unlike any before. The promise of discovery comes with warnings about ${conflict} and competing interests that will stop at nothing to reach the objective first. With limited time to prepare, ${character} must decide whether to pursue this dangerous opportunity.`;
        
      case "historical":
        return `A pivotal historical event in ${setting} forces ${character} into a position where neutrality becomes impossible. Personal connections to key figures involved in ${conflict} create divided loyalties, while unique skills or knowledge make ${character}'s participation valuable to multiple factions. The decision made in this moment will not only affect personal circumstances but potentially alter the course of significant historical events.`;
        
      case "comedy":
        return `A spectacular misunderstanding in ${setting} catapults ${character} into a situation that spirals increasingly out of control. What begins as a simple case of mistaken identity or miscommunication quickly escalates as each attempt to resolve the matter only complicates it further. The situation becomes entangled with ${conflict}, creating a precarious position where the truth seems increasingly difficult to establish.`;
        
      case "drama":
        return `An unexpected revelation in ${setting} forces ${character} to confront truths long buried or denied. This information recontextualizes past events and relationships, creating a moment of profound clarity and crisis. The revelation connects directly to ${conflict} that has influenced multiple lives, creating a situation where painful choices must be made, and comfortable illusions can no longer be maintained.`;
        
      default:
        return `A significant event disrupts ${character}'s life in ${setting}, creating a crucial turning point. This development connects directly to ${conflict} that will drive the story forward, forcing decisions that cannot be avoided and setting a new direction that will test resources and resolve in unexpected ways.`;
    }
  };

  const generateFirstChallengeSection = (
    character: string, supportingChar: string, conflict: string, genre: Genre
  ): string => {
    switch (genre) {
      case "fantasy":
        return `${character}'s first test comes when mysterious adversaries launch an unexpected attack, seeking the artifact and the power it represents. With limited understanding of newly awakening abilities, ${character} must improvise defenses while protecting innocent bystanders caught in the conflict. The timely intervention of ${supportingChar} provides crucial assistance, though their motives and true allegiance regarding ${conflict} remain unclear.`;
        
      case "sci-fi":
        return `Security protocols in response to ${character}'s data access escalate rapidly, deploying advanced tracking algorithms and enforcement drones. Evading these measures requires exploiting system vulnerabilities while avoiding patterns that artificial intelligence can predict. An unexpected message from ${supportingChar} offers a potential safe passage, but accepting help means exposing the sensitive information discovered about ${conflict} to someone whose trustworthiness remains unverified.`;
        
      case "romance":
        return `Attempts to arrange another meeting with the intriguing stranger are complicated by professional obligations and social expectations. When ${character} finally creates an opportunity, circumstances surrounding ${conflict} create a misunderstanding that threatens the fragile connection before it can develop. The situation is further complicated when ${supportingChar} provides well-intentioned but potentially misleading advice based on incomplete information.`;
        
      case "mystery":
        return `Initial investigation reveals that evidence has been systematically altered or removed, suggesting a cover-up extending beyond what ${character} first suspected. When official channels block access to crucial information about ${conflict}, alternative approaches become necessary, each with potential legal or professional consequences. An ambiguous message from ${supportingChar} offers assistance but raises questions about how they became aware of the investigation and what their interest might be.`;
        
      case "thriller":
        return `With conventional resources compromised, ${character} establishes a temporary safe location to assess the situation and identify the extent of the betrayal. Surveillance detection reveals that the opposition has deployed significant resources in relation to ${conflict}, suggesting this operation has higher priority than initially apparent. Contact from ${supportingChar} offers potential alliance, but the timing raises suspicions about whether this is genuine assistance or part of an elaborate trap.`;
        
      case "horror":
        return `The first direct encounter with the supernatural force leaves ${character} questioning their sanity as reality itself seems to distort in impossible ways. Physical evidence of the experience disappears, making verification impossible and creating doubt about perceptions related to ${conflict}. When ${character} cautiously discusses these events with ${supportingChar}, their reaction suggests either knowledge they are withholding or similar experiences they have been afraid to acknowledge.`;
        
      case "adventure":
        return `The journey's first obstacle emerges as ${character} discovers that crucial supplies have been sabotaged, forcing a dangerous detour through treacherous territory. This route reveals unexpected evidence that multiple parties are converging toward the same objective, each with their own agenda regarding ${conflict}. An encounter with ${supportingChar} presents an opportunity for alliance that would provide immediate advantages but potentially complicate future stages of the expedition.`;
        
      case "historical":
        return `${character}'s position in the developing historical events draws unwanted attention from authorities concerned about potential influence on ${conflict}. Political pressures and social consequences create immediate practical difficulties that must be navigated while maintaining core principles. An approach from ${supportingChar} representing a different faction offers protection and resources, but accepting would create obligations that might compromise independence of action.`;
        
      case "comedy":
        return `Attempts to resolve the initial misunderstanding lead ${character} into increasingly absurd situations that compound the original problem. What should be a simple explanation becomes impossible to deliver as circumstances repeatedly interrupt at crucial moments, and ${supportingChar}'s well-meaning intervention regarding ${conflict} creates an entirely new layer of confusion that must somehow be managed.`;
        
      case "drama":
        return `The emotional aftermath of the revelation forces ${character} to function while processing profound personal implications. When established relationships become strained by changing perspectives on ${conflict}, maintaining normal appearances becomes increasingly difficult. A conversation with ${supportingChar} provides temporary support but also raises questions about how this new understanding will affect long-standing dynamics and unspoken agreements.`;
        
      default:
        return `${character} faces the first major challenge, testing newly developing skills and resolve. This obstacle related to ${conflict} reveals the true scale of what lies ahead, while an interaction with ${supportingChar} provides both assistance and complications that will influence how future challenges are approached.`;
    }
  };

  const generateCharacterDevelopmentSection = (
    character: string, theme: string, genre: Genre
  ): string => {
    // Implementation for character development section
    return `As events unfold, ${character} undergoes significant internal changes, questioning long-held beliefs about ${theme}. What once seemed clear becomes increasingly complex, forcing a reevaluation of priorities and principles. This internal journey parallels the external challenges, creating moments of doubt and revelation that shape decisions and relationships moving forward.`;
  };

  const generateSubplotSection = (
    character1: string, role1: string, character2: string, mainChar: string, genre: Genre
  ): string => {
    // Implementation for subplot introduction
    return `Meanwhile, ${character1}, ${role1}, pursues their own objectives which initially appear unrelated to the main events. Their interactions with ${character2} reveal motivations and background that will eventually intersect with ${mainChar}'s journey in significant ways. This parallel story adds complexity to the world and creates connections that will become crucial at later turning points.`;
  };

  const generateRisingActionSection = (
    character: string, conflict: string, setting: string, genre: Genre
  ): string => {
    // Implementation for rising action
    return `Tensions escalate as ${character} ventures deeper into the heart of ${conflict}. Each step forward reveals new layers of complexity and raises the stakes. The environment of ${setting} becomes increasingly hostile, whether through natural challenges, opposing forces, or deteriorating circumstances. Resources dwindle while obstacles multiply, testing resolve and adaptability.`;
  };

  const generateMidpointTwistSection = (
    character: string, supportingChar: string, genre: Genre
  ): string => {
    // Implementation for midpoint twist
    return `Everything changes when a stunning revelation forces ${character} to reconsider all that has happened. What appeared to be true is revealed as partial or misleading, creating a fundamental shift in understanding and approach. The relationship with ${supportingChar} transforms in light of this new information, creating both opportunities and complications that will influence all that follows.`;
  };

  const generateSubplotDevelopmentSection = (
    character1: string, character2: string, mainChar: string, genre: Genre
  ): string => {
    // Implementation for subplot development
    return `The parallel story involving ${character1} and ${character2} continues to unfold, developing in ways that will soon directly impact ${mainChar}'s journey. Motivations become clearer while new complications arise, creating momentum that drives this secondary narrative toward its intersection with the main plot. Information unavailable to the main story is revealed here, providing context that will prove crucial for later developments.`;
  };

  const generateEscalatingConflictSection = (
    character: string, conflict: string, genre: Genre
  ): string => {
    // Implementation for escalating conflict
    return `The situation intensifies dramatically as ${character} faces increasingly dangerous opposition. What began as ${conflict} has evolved into something far more threatening, with wider implications than initially apparent. Resources are stretched to their limits, while alliance structures shift under mounting pressure. The point of no return approaches, eliminating easier options and narrowing possible paths forward.`;
  };

  const generateDarkNightSection = (
    character: string, theme: string, genre: Genre
  ): string => {
    // Implementation for dark night/lowest point
    return `At the lowest point, ${character} faces what appears to be insurmountable defeat. External circumstances align with internal doubts to create a moment of profound crisis. The core values related to ${theme} that have driven actions thus far seem inadequate in the face of overwhelming opposition. This moment of despair forces a fundamental reassessment of both means and ends.`;
  };

  const generateRallySection = (
    character: string, supportingChar: string, genre: Genre
  ): string => {
    // Implementation for rally/comeback
    return `From the depths of defeat, ${character} discovers unexpected reserves of determination. A new perspective emerges from the darkness, suggesting an approach not previously considered. Support arrives in unexpected forms, including crucial assistance from ${supportingChar} that provides both practical help and renewed purpose. This turning point creates momentum for the final push toward resolution.`;
  };

  const generateClimaxSection = (
    character: string, conflict: string, genre: Genre
  ): string => {
    // Implementation for climax
    return `All storylines converge in the decisive confrontation as ${character} faces the ultimate test. Everything learned and developed throughout the journey now comes into play as ${conflict} reaches its peak intensity. The stakes could not be higher, with success or failure having far-reaching consequences. In this crucible moment, true character is revealed through choices made under extreme pressure.`;
  };

  const generatePlotTwistSection = (
    character: string, supportingChar: string, genre: Genre
  ): string => {
    // Implementation for plot twist
    return `In a shocking turn of events, assumptions that have guided actions thus far are revealed as fundamentally flawed. What ${character} believed about key allies, enemies, or situations undergoes a dramatic reversal. The relationship with ${supportingChar} takes an unexpected direction based on revealed information or changing circumstances. This twist forces immediate adaptation while recontextualizing all that has come before.`;
  };

  const generateResolutionSection = (
    character: string, theme: string, genre: Genre
  ): string => {
    // Implementation for resolution
    return `In the aftermath of the climactic events, consequences unfold and new equilibrium begins to establish itself. ${character} assesses victories, losses, and compromises made along the journey. The experience has transformed perspectives on ${theme} in ways that will endure beyond this specific story. Some questions find answers while others remain deliberately unresolved, acknowledging the complexity of the issues explored.`;
  };

  const generateEpilogueSection = (
    character: string, supportingChar: string, setting: string, genre: Genre
  ): string => {
    // Implementation for epilogue
    return `Some time later, we glimpse how events have settled into history. ${character} has integrated the experiences into a changed life, while ${setting} itself bears marks of what transpired. The relationship with ${supportingChar} has evolved into its next phase. While this chapter closes, subtle indications suggest that larger stories continue beyond what we have witnessed, acknowledging that endings are also beginnings from a different perspective.`;
  };

  // Genre-specific section generators
  const generateMagicSystemSection = (setting: string, character: string): string => {
    return `The magical forces of ${setting} operate according to ancient rules and principles that few fully comprehend. As ${character} begins to experience awakening abilities, the fundamental patterns of this system become increasingly apparent. Power sources, limitations, and consequences for usage create a framework within which magical actions must operate. Ancient texts and knowledgeable mentors provide partial guidance, but some aspects can only be learned through direct experience.`;
  };

  const generateTechnologySection = (setting: string, character: string): string => {
    return `The advanced technology that defines ${setting} represents generations of scientific development, creating capabilities that previous eras would consider indistinguishable from magic. ${character} interacts with these systems through interfaces designed for efficiency rather than transparency, understanding functional applications while underlying principles remain obscure to most users. Recent breakthroughs have pushed these technologies into new territories where even experts cannot fully predict all implications.`;
  };

  const generateMeetCuteSection = (character: string, loveInterest: string): string => {
    return `Through a series of coincidences that seem too perfect to be entirely random, ${character} encounters ${loveInterest} in circumstances that create immediate interest and connection. The interaction balances between awkwardness and charm, creating memorable moments that linger in both minds. Though brief, this meeting establishes dynamics and impressions that will influence all future interactions, setting expectations that will both be fulfilled and subverted as the relationship develops.`;
  };

  const generateMysteryIntroSection = (setting: string, character: string): string => {
    return `Within the seemingly normal environment of ${setting}, anomalies appear that defy conventional explanation. ${character} notices patterns and inconsistencies that others overlook, piecing together fragments that suggest a coherent but disturbing underlying reality. Initial investigations raise more questions than answers, creating an intellectual puzzle with potentially serious implications. The partial information available suggests that discovering the full truth will require venturing into uncomfortable and possibly dangerous territory.`;
  };

  const generateThreatSection = (character: string, threat: string): string => {
    return `The danger represented by ${threat} begins to manifest in increasingly concrete ways, transitioning from abstract concern to immediate peril. ${character} witnesses capabilities and intentions that establish the seriousness of the threat and its potential consequences. Initial defensive measures prove inadequate against this force, revealing limitations in current preparations and resources. The emerging pattern suggests that the threat is not only dangerous but intelligent in its approach, adapting to resistance in strategic ways.`;
  };

  const generateDreadSection = (character: string, setting: string): string => {
    return `Subtle disturbances in ${setting} create an atmosphere of growing unease that affects ${character} on levels beyond rational thought. Environmental details that once seemed ordinary take on sinister significance as patterns emerge that suggest malevolent design rather than coincidence. Sleep becomes increasingly difficult as subconscious awareness registers threats before conscious mind can identify them. The boundary between psychological response and objective reality blurs, raising questions about whether the danger comes from external sources or from within.`;
  };

  const generateCallToJourneySection = (character: string, setting: string): string => {
    return `The opportunity to leave the familiar confines of ${setting} presents itself to ${character} through circumstances that make the journey both compelling and necessary. Initial reluctance gives way to acceptance as the potential rewards of adventure outweigh the security of the known. Preparations begin with assessment of available resources and gathering of information about territories that have existed previously only in stories or distant reports. The departure point approaches, creating a threshold between established identity and the transformative experiences that lie ahead.`;
  };

  const generateHistoricalContextSection = (setting: string, character: string): string => {
    return `The historical period of ${setting} shapes every aspect of daily life, from personal opportunities to social structures and prevailing beliefs. ${character} navigates these realities while witnessing transformative events whose historical significance is apparent even to contemporary observers. Political movements, technological developments, and shifting cultural values create an environment of change where traditional certainties increasingly give way to new possibilities. These broader historical forces intersect with personal circumstances to create unique challenges and opportunities.`;
  };

  const generateComicSetupSection = (character: string, secondChar: string): string => {
    return `A series of misunderstandings involving ${character} and ${secondChar} establishes the central comedic premise, creating situations where reasonable assumptions lead to increasingly absurd consequences. Initial attempts to resolve confusion only compound the problems as communication failures and timing mishaps prevent clarification. Social pressures and personal embarrassment motivate increasingly elaborate efforts to maintain appearances, setting in motion complications that will require the entire story to fully unravel.`;
  };

  const generateRelationshipDynamicsSection = (character: string, secondChar: string): string => {
    return `The complex relationship between ${character} and ${secondChar} reveals layers of history, unspoken expectations, and conflicting desires that create constant tension beneath surface interactions. Communication patterns reflect established roles and past experiences, with certain topics approached directly while others remain carefully avoided. Moments of genuine connection alternate with misunderstandings and withdrawn, with emotional undercurrents often contradicting words and actions. These relationship dynamics establish core conflicts that will drive character development throughout the story.`;
  };

  // Adjust plot based on selected tone
  const adjustPlotTone = (text: string): string => {
    let adjusted = text;
    
    switch (tone) {
      case "dark":
        adjusted = adjusted
          .replace(/success/g, "partial victory")
          .replace(/overcome/g, "survive")
          .replace(/resolves/g, "endures")
          .replace(/happy/g, "relieved")
          .replace(/triumph/g, "pyrrhic victory")
          .replace(/friendship/g, "uneasy alliance");
        break;
        
      case "light":
        adjusted = adjusted
          .replace(/defeat/g, "setback")
          .replace(/dies/g, "is incapacitated")
          .replace(/killed/g, "defeated")
          .replace(/brutal/g, "challenging")
          .replace(/despair/g, "doubt")
          .replace(/failure/g, "temporary defeat");
        break;
        
      case "neutral":
        // Neutral tone is the default, so no specific adjustments
        break;
        
      case "hopeful":
        adjusted = adjusted
          .replace(/impossible/g, "seemingly impossible")
          .replace(/despair/g, "temporary despair")
          .replace(/doom/g, "great challenge")
          .replace(/sacrifice/g, "necessary sacrifice")
          .replace(/darkness/g, "difficulty")
          .replace(/failure/g, "learning opportunity");
        break;
        
      case "tragic":
        adjusted = adjusted
          .replace(/success/g, "hollow victory")
          .replace(/happiness/g, "brief happiness")
          .replace(/resolves/g, "concludes at great cost")
          .replace(/triumph/g, "tragic realization")
          .replace(/celebrate/g, "reflect somberly")
          .replace(/victory/g, "pyrrhic victory");
        break;
        
      case "humorous":
        adjusted = adjusted
          .replace(/serious/g, "comically serious")
          .replace(/dangerous/g, "theoretically dangerous")
          .replace(/powerful/g, "supposedly powerful")
          .replace(/dramatic/g, "melodramatic")
          .replace(/intense/g, "unnecessarily intense")
          .replace(/crucial/g, "allegedly crucial");
        break;
    }
    
    return adjusted;
  };

  // Clear all fields and reset state
  const clearFields = () => {
    setMainCharacter("");
    setMainCharacterRole("");
    setSupportingCharacters([]);
    setSetting("");
    setTheme("");
    setConflict("");
    setGeneratedPlot("");
    setPlotOutline([]);
    setShowOutline(false);
    setProgress(0);
  };

  // Copy generated plot to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPlot);
    toast({
      title: "Copied to clipboard",
      description: "Plot has been copied to your clipboard",
    });
  };

  // Download plot as a text file
  const downloadPlot = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPlot], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    
    // Create filename from genre and setting
    const filename = setting
      ? `plot-${genre}-${setting.substring(0, 15).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
      : `plot-${genre}.txt`;
      
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Plot downloaded",
      description: `Your plot has been downloaded as "${filename}"`,
    });
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="generator" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Plot Generator</TabsTrigger>
          <TabsTrigger value="examples">Examples & Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Story Elements</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="genre" className="text-sm font-medium">
                        Genre
                      </Label>
                      <Select
                        value={genre}
                        onValueChange={(value) => setGenre(value as Genre)}
                      >
                        <SelectTrigger id="genre" className="mt-1">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                          <SelectItem value="sci-fi">Science Fiction</SelectItem>
                          <SelectItem value="romance">Romance</SelectItem>
                          <SelectItem value="mystery">Mystery</SelectItem>
                          <SelectItem value="thriller">Thriller</SelectItem>
                          <SelectItem value="horror">Horror</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="historical">Historical</SelectItem>
                          <SelectItem value="comedy">Comedy</SelectItem>
                          <SelectItem value="drama">Drama</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="setting" className="text-sm font-medium">
                        Setting
                      </Label>
                      <Input
                        id="setting"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        placeholder="Enter your story setting"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Time period, location, or world where your story takes place
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="character" className="text-sm font-medium">
                          Main Character
                        </Label>
                        <Input
                          id="character"
                          value={mainCharacter}
                          onChange={(e) => setMainCharacter(e.target.value)}
                          placeholder="Character name"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="character-role" className="text-sm font-medium">
                          Character Role
                        </Label>
                        <Input
                          id="character-role"
                          value={mainCharacterRole}
                          onChange={(e) => setMainCharacterRole(e.target.value)}
                          placeholder="e.g., detective, wizard"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Supporting Characters
                      </Label>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={newCharName}
                          onChange={(e) => setNewCharName(e.target.value)}
                          placeholder="Name"
                          className="col-span-1"
                        />
                        <Input
                          value={newCharRole}
                          onChange={(e) => setNewCharRole(e.target.value)}
                          placeholder="Role"
                          className="col-span-1"
                        />
                        <Button 
                          onClick={handleAddCharacter}
                          variant="outline"
                          className="col-span-1"
                          type="button"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {supportingCharacters.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {supportingCharacters.map((char, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="text-sm">
                                <strong>{char.name}</strong> ({char.role})
                              </span>
                              <Button
                                onClick={() => handleRemoveCharacter(index)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="theme" className="text-sm font-medium">
                        Theme (optional)
                      </Label>
                      <Input
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="e.g., redemption, power corruption"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="conflict" className="text-sm font-medium">
                        Main Conflict
                      </Label>
                      <Input
                        id="conflict"
                        value={conflict}
                        onChange={(e) => setConflict(e.target.value)}
                        placeholder="e.g., ancient prophecy, murder mystery"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Plot Structure</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="plot-length" className="text-sm font-medium">
                          Plot Length
                        </Label>
                        <Select
                          value={plotLength}
                          onValueChange={(value) => setPlotLength(value as PlotLength)}
                        >
                          <SelectTrigger id="plot-length" className="mt-1">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="complexity" className="text-sm font-medium">
                          Complexity
                        </Label>
                        <Select
                          value={complexity}
                          onValueChange={(value) => setComplexity(value as PlotComplexity)}
                        >
                          <SelectTrigger id="complexity" className="mt-1">
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="complex">Complex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="tone" className="text-sm font-medium">
                          Tone
                        </Label>
                        <Select
                          value={tone}
                          onValueChange={(value) => setTone(value as PlotTone)}
                        >
                          <SelectTrigger id="tone" className="mt-1">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="hopeful">Hopeful</SelectItem>
                            <SelectItem value="tragic">Tragic</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-twist" 
                          checked={includeTwist}
                          onCheckedChange={(checked) => setIncludeTwist(checked as boolean)}
                        />
                        <Label htmlFor="include-twist" className="text-sm">
                          Include plot twist
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-resolution" 
                          checked={includeResolution}
                          onCheckedChange={(checked) => setIncludeResolution(checked as boolean)}
                        />
                        <Label htmlFor="include-resolution" className="text-sm">
                          Include resolution
                        </Label>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button 
                        onClick={handleGeneratePlot}
                        disabled={isGenerating || !setting.trim()}
                        className="bg-primary hover:bg-blue-700 transition"
                      >
                        {isGenerating ? "Generating..." : "Generate Plot"}
                      </Button>
                      
                      <Button
                        onClick={clearFields}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {showOutline && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">Plot Outline</h3>
                      <Badge className="bg-blue-50 text-blue-700">
                        {plotOutline.length} sections
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {plotOutline.map((point, index) => (
                        <div key={index} className="flex items-start">
                          <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm">
                            {index + 1}
                          </div>
                          <p className="text-sm mt-1">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg">Generated Plot</h3>
                    {!isGenerating && generatedPlot && (
                      <Badge className="bg-green-50 text-green-700">
                        {genre.charAt(0).toUpperCase() + genre.slice(1)} • {
                          plotLength === "short" ? "Short" : 
                          plotLength === "medium" ? "Medium" : "Long"
                        }
                      </Badge>
                    )}
                  </div>
                  
                  {isGenerating ? (
                    <div className="space-y-4">
                      <Progress value={progress} className="w-full h-2" />
                      <div className="px-8 py-12 text-center">
                        <div className="text-sm text-gray-500 mb-2">
                          {progress < 30 ? "Creating story outline..." : 
                           progress < 60 ? "Developing plot elements..." : 
                           "Refining narrative structure..."}
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Textarea
                        value={generatedPlot}
                        onChange={(e) => setGeneratedPlot(e.target.value)}
                        placeholder="Your plot will appear here after generation..."
                        className="min-h-[450px] font-serif text-base leading-relaxed"
                      />
                      
                      {generatedPlot && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Button
                            onClick={copyToClipboard}
                            variant="outline"
                            className="text-blue-600"
                          >
                            Copy to Clipboard
                          </Button>
                          
                          <Button
                            onClick={downloadPlot}
                            variant="outline"
                            className="text-green-600"
                          >
                            Download as Text
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!isGenerating && !generatedPlot && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-3">How to Use Plot Generator</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                      <li>Select a genre that best matches the type of story you want to create</li>
                      <li>Enter a setting where your story will take place</li>
                      <li>Add your main character's name and role in the story</li>
                      <li>Include supporting characters to enrich your plot (optional)</li>
                      <li>Specify a theme and main conflict to drive your story</li>
                      <li>Choose plot length, complexity, and tone to match your vision</li>
                      <li>Toggle plot twist and resolution options based on your preferences</li>
                      <li>Click "Generate Plot" and wait for AI to create your customized plot</li>
                      <li>Review the plot outline and complete narrative</li>
                      <li>Edit the generated plot as needed and save it for your use</li>
                    </ol>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Genre Guide</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Fantasy</h4>
                    <p className="mt-1">
                      Features magical elements, mythical creatures, and otherworldly settings. Often includes quests, prophecies, and the battle between good and evil.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Science Fiction</h4>
                    <p className="mt-1">
                      Explores advanced technology, space exploration, alternative realities, or future societies. Often examines the impact of scientific advances on humanity.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Romance</h4>
                    <p className="mt-1">
                      Centers on relationships and romantic love. Typically follows the development of a relationship with emotional obstacles to overcome.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Mystery</h4>
                    <p className="mt-1">
                      Revolves around solving a puzzle, crime, or unusual event. Features clues, suspects, and a detective or amateur sleuth uncovering the truth.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Thriller</h4>
                    <p className="mt-1">
                      Creates tension, suspense, and excitement. Often includes high stakes, danger, and a race against time to prevent disaster.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Plot Structure Elements</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <h4 className="font-medium">Setup</h4>
                    <p className="mt-1">
                      Introduces the main character, setting, and normal world before the adventure begins. Establishes the status quo that will soon be disrupted.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Inciting Incident</h4>
                    <p className="mt-1">
                      The event that disrupts the protagonist's ordinary world and sets the story in motion. Creates a problem or opportunity that demands response.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Rising Action</h4>
                    <p className="mt-1">
                      Series of escalating challenges and complications that test the protagonist and raise the stakes. Builds tension toward the climax.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Climax</h4>
                    <p className="mt-1">
                      The turning point or highest point of tension in the story. Often features the final confrontation between protagonist and antagonist.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Resolution</h4>
                    <p className="mt-1">
                      Aftermath of the climax showing how conflicts are resolved and establishing a new status quo. Provides closure to the story's arcs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Creating Compelling Characters</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Give characters clear goals and motivations that drive their actions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create flaws and vulnerabilities that make characters relatable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Establish internal conflicts alongside external challenges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Develop character relationships that create dynamics and tensions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Allow for character growth and transformation throughout the story</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create distinctive voice, appearance, and behaviors for each character</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Ensure characters' decisions and actions drive the plot forward</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Plot Development Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Build conflict around character goals, flaws, and external obstacles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create escalating complications that raise the stakes and tension</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Use plot twists that are surprising yet logically connected to established elements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Ensure causal relationships between events (this happens because that happened)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Plant setups early that pay off later for satisfying storytelling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create meaningful subplots that complement or contrast with the main plot</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Maintain a consistent tone while allowing for emotional variety</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const introduction = "Create compelling story plots with tailored characters, settings, and narrative arcs using our intelligent AI plot generator.";
  
  const description = `
    Our Plot Generator is a sophisticated creative writing tool designed to help authors, screenwriters, game developers, and storytelling enthusiasts develop engaging and well-structured narrative frameworks for their stories. By leveraging advanced artificial intelligence, this specialized story planning assistant produces coherent, customized plots tailored to your specific creative vision and requirements.
    
    Whether you're crafting a fantasy epic with magical elements, a science fiction adventure in a futuristic setting, a character-driven romance, a suspenseful mystery, a heart-pounding thriller, a chilling horror tale, an action-packed adventure, a richly detailed historical narrative, a laugh-out-loud comedy, or a thought-provoking drama, our Plot Generator provides the perfect foundation for your storytelling journey.
    
    The generator offers comprehensive customization options that give you complete control over your story's elements. You can specify your genre, setting, main and supporting characters, central conflict, theme, plot length, complexity level, and emotional tone. You can even choose whether to include plot twists and resolutions based on your creative preferences. This multi-layered customization ensures that each generated plot aligns perfectly with your unique storytelling goals.
    
    For writers struggling with writer's block, the Plot Generator provides fresh inspiration and new narrative directions. For experienced authors, it offers an efficient way to experiment with different story structures and approaches. For creative writing teachers and students, it serves as an educational tool to understand narrative architecture. The generated plots include all essential storytelling elements—setup, inciting incident, rising action, climax, and optional resolution—creating a comprehensive story blueprint that you can expand into a complete novel, screenplay, or game narrative.
  `;

  const howToUse = [
    "Select your desired story genre (fantasy, sci-fi, romance, mystery, etc.) from the dropdown menu.",
    "Enter a setting for your story, whether it's a specific location, time period, or fictional world.",
    "Add your main character's name and role (e.g., detective, wizard, scientist) in the appropriate fields.",
    "Create supporting characters by entering their names and roles, then clicking the 'Add' button.",
    "Specify an optional theme that explores the central idea of your story (e.g., redemption, power corruption).",
    "Define the main conflict that will drive your narrative forward.",
    "Choose your plot length (short, medium, long), complexity level (simple, moderate, complex), and tone (dark, light, neutral, etc.).",
    "Toggle whether you want to include a plot twist and/or resolution in your story.",
    "Click 'Generate Plot' and wait for the AI to create your customized plot outline and narrative.",
    "Review, edit, and refine the generated plot to align perfectly with your creative vision."
  ];

  const features = [
    "Ten versatile genre options (fantasy, sci-fi, romance, mystery, thriller, horror, adventure, historical, comedy, drama) to match any storytelling style",
    "Customizable character system allowing for detailed protagonist and supporting character creation",
    "Adjustable plot complexity with three levels (simple, moderate, complex) to fit your narrative needs",
    "Six distinct tone options (dark, light, neutral, hopeful, tragic, humorous) to set the emotional atmosphere of your story",
    "Intelligent structure generation with genre-specific elements integrated into the plot outline",
    "Optional plot twist and resolution toggles to customize narrative arc and ending style",
    "Complete plot outlines showing the structural blueprint of your story alongside fully developed narrative text"
  ];

  const faqs = [
    {
      question: "How can the Plot Generator help with my writer's block?",
      answer: "The Plot Generator is specifically designed to overcome writer's block by providing fresh narrative frameworks when you're feeling stuck. By inputting just a few basic parameters like genre and setting, you can generate complete plot structures that spark new ideas and creative directions. The tool is particularly helpful when you have a character or concept in mind but aren't sure where to take the story. The generated plots offer multiple narrative possibilities with logical progression from setup to resolution, often introducing unexpected elements that can inspire original thinking. You can generate multiple variations by adjusting parameters like complexity, tone, or character details, exploring different approaches until you find one that resonates with your creative vision and breaks through your creative blockage."
    },
    {
      question: "Can I use the generated plots for my commercial projects?",
      answer: "Yes, the plots generated by our tool can be used as the foundation for your commercial creative projects, including novels, screenplays, video games, and other storytelling media. The AI-generated content serves as a starting point or framework that you'll typically expand upon, modify, and infuse with your unique creative voice. The generated plots are not copyrighted content but rather tools to facilitate your own original creation. As with any creative work, the final product that you develop from the generated plot—with your characters, dialogue, scene descriptions, and narrative voice—becomes your intellectual property. We recommend reviewing the specific terms of service for this website, but generally, once you download or copy the generated plot and transform it into your full creative work, you maintain the rights to your finished story."
    },
    {
      question: "How should I develop a generated plot into a full story?",
      answer: "Developing a generated plot into a full story requires a thoughtful expansion process: Start by analyzing the plot structure to understand the narrative foundation, then enrich each section with vivid details and sensory descriptions that bring scenes to life. Develop your characters beyond their basic descriptions by adding backstories, personal motivations, distinct voices, and meaningful relationships. Expand dialogue beyond basic exchanges to reveal character and advance plot while sounding natural. Create a consistent world with established rules, whether for a fantasy realm's magic system or a mystery's investigation procedures. Develop subplots that complement the main story while adding depth and complexity. Enhance emotional impact by exploring characters' internal responses to events. Refine pacing to create rhythm between action, reflection, and exposition. Finally, revise thoroughly, potentially sharing with beta readers for feedback to identify opportunities for improvement."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="plot-generator"
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

export default PlotGeneratorDetailed;