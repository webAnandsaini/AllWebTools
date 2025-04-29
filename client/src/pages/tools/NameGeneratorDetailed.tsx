import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface GeneratedName {
  firstName: string;
  lastName: string;
  fullName: string;
}

const NameGeneratorDetailed: React.FC = () => {
  const [location] = useLocation();
  const [nameType, setNameType] = useState<string>("generic");
  const [gender, setGender] = useState<string>("any");
  const [quantity, setQuantity] = useState<string>("1");
  const [includeLastName, setIncludeLastName] = useState<boolean>(true);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [error, setError] = useState<string>("");

  // Set the name type based on the current URL
  useEffect(() => {
    if (location.includes("japanese-name-generator")) {
      setNameType("japanese");
    } else if (location.includes("last-name-generator")) {
      setNameType("last");
      setIncludeLastName(false);
    } else if (location.includes("random-name-generator")) {
      setNameType("random");
    } else if (location.includes("korean-name-generator")) {
      setNameType("korean");
    } else if (location.includes("spanish-name-generator")) {
      setNameType("spanish");
    } else {
      setNameType("generic");
    }
  }, [location]);

  // Generic western first names
  const maleFirstNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
    "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan",
    "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
    "Benjamin", "Samuel", "Gregory", "Alexander", "Frank", "Patrick", "Raymond", "Jack", "Dennis", "Jerry"
  ];

  const femaleFirstNames = [
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Lisa", "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle",
    "Carol", "Amanda", "Dorothy", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia",
    "Amy", "Kathleen", "Angela", "Shirley", "Brenda", "Emma", "Anna", "Pamela", "Nicole", "Samantha",
    "Katherine", "Christine", "Helen", "Debra", "Rachel", "Carolyn", "Janet", "Maria", "Catherine", "Heather"
  ];

  // Japanese names data
  const japaneseFirstNamesMale = [
    "Haruto", "Yuto", "Sota", "Yuki", "Hayato", "Haruki", "Ryusei", "Koki", "Sora", "Sosuke",
    "Riku", "Takumi", "Kota", "Kazuki", "Kaito", "Yamato", "Ryota", "Hiroto", "Yuma", "Daiki",
    "Minato", "Akito", "Naoki", "Shota", "Keita", "Daisuke", "Takeru", "Tatsuya", "Kouki", "Ren"
  ];

  const japaneseFirstNamesFemale = [
    "Yui", "Yuna", "Hina", "Riko", "Koharu", "Yume", "Sakura", "Akari", "Mao", "Miyu",
    "Hinata", "Mei", "Saki", "Aoi", "Ichika", "Rin", "Honoka", "Rio", "Mio", "Misaki",
    "Himari", "Momoka", "Yuka", "Hana", "Nana", "Risa", "Nanami", "Ayaka", "Haruka", "Noa"
  ];

  const japaneseLastNames = [
    "Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato",
    "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu", "Saito",
    "Ikeda", "Hashimoto", "Ishikawa", "Mori", "Ogawa", "Maeda", "Fujita", "Okada", "Goto", "Hasegawa"
  ];

  // Korean names data
  const koreanFirstNamesMale = [
    "Min-jun", "Ji-hun", "Seo-jun", "Jun-seo", "Do-yun", "Min-seo", "Ji-ho", "Ha-jun", "Ye-jun", "Jun-ho",
    "Seung-min", "Hyun-woo", "Joon-hyuk", "Ji-woo", "Sung-jae", "Min-jae", "Hyun-jun", "Tae-ho", "Dong-hyun", "Jun-young",
    "Jae-hwan", "Seung-hoon", "Sung-hoon", "Tae-yong", "Jae-min", "Yong-hoon", "Ji-sung", "Dong-wook", "Young-ho", "Hee-chul"
  ];

  const koreanFirstNamesFemale = [
    "Ji-woo", "Seo-yeon", "Soo-ah", "Ha-eun", "Ye-eun", "Min-seo", "Ji-a", "Seo-ah", "Yu-na", "Eun-ha",
    "Ha-young", "So-yeon", "Da-yeon", "Ji-hye", "Min-ji", "Da-som", "Ye-jin", "Hyun-joo", "Eun-jung", "Ji-eun",
    "Yoo-jin", "Seung-ah", "Hye-jin", "So-jin", "Na-young", "Ji-young", "Min-young", "Su-jin", "Hye-won", "Ji-su"
  ];

  const koreanLastNames = [
    "Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim",
    "Han", "Oh", "Seo", "Kwon", "Hwang", "Shin", "Ahn", "Song", "Yoo", "Hong",
    "Ryu", "Bae", "Moon", "Na", "Chung", "Jeon", "Kwak", "Ko", "Baek", "Shim"
  ];

  // Spanish names data
  const spanishFirstNamesMale = [
    "Alejandro", "Carlos", "Daniel", "Diego", "Eduardo", "Emilio", "Fernando", "Gabriel", "Hector", "Ignacio",
    "Javier", "Jorge", "Juan", "Luis", "Manuel", "Miguel", "Pablo", "Pedro", "Rafael", "Raúl",
    "Roberto", "Santiago", "Sergio", "Antonio", "Andrés", "Alberto", "Enrique", "Victor", "Francisco", "José"
  ];

  const spanishFirstNamesFemale = [
    "Ana", "Beatriz", "Carmen", "Claudia", "Daniela", "Elena", "Francisca", "Gabriela", "Isabel", "Julieta",
    "Laura", "Lucía", "María", "Natalia", "Olivia", "Patricia", "Raquel", "Rosa", "Sofia", "Teresa",
    "Valentina", "Victoria", "Adriana", "Alejandra", "Camila", "Diana", "Eva", "Lorena", "Mariana", "Paula"
  ];

  const spanishLastNames = [
    "García", "Fernández", "González", "Rodríguez", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
    "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro",
    "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Suárez", "Molina"
  ];

  // Generic last names
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"
  ];

  // Generate a random element from an array
  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate a first name based on gender and name type
  const generateFirstName = (nameGender: string, type: string): string => {
    // Determine gender (if "any", randomly pick one)
    const actualGender = nameGender === "any" 
      ? (Math.random() > 0.5 ? "male" : "female") 
      : nameGender;
    
    if (type === "japanese") {
      return actualGender === "male" 
        ? getRandomElement(japaneseFirstNamesMale) 
        : getRandomElement(japaneseFirstNamesFemale);
    } else if (type === "korean") {
      return actualGender === "male" 
        ? getRandomElement(koreanFirstNamesMale) 
        : getRandomElement(koreanFirstNamesFemale);
    } else if (type === "spanish") {
      return actualGender === "male" 
        ? getRandomElement(spanishFirstNamesMale) 
        : getRandomElement(spanishFirstNamesFemale);
    } else if (type === "last") {
      // For last name generator, return a last name as "first name"
      return getRandomElement(lastNames);
    } else {
      // Default/random/generic
      return actualGender === "male" 
        ? getRandomElement(maleFirstNames) 
        : getRandomElement(femaleFirstNames);
    }
  };

  // Generate a last name based on name type
  const generateLastName = (type: string): string => {
    if (type === "japanese") {
      return getRandomElement(japaneseLastNames);
    } else if (type === "korean") {
      return getRandomElement(koreanLastNames);
    } else if (type === "spanish") {
      return getRandomElement(spanishLastNames);
    } else {
      // Default/random/generic/last
      return getRandomElement(lastNames);
    }
  };

  // Generate a single name
  const generateName = (): GeneratedName => {
    const firstName = generateFirstName(gender, nameType);
    const lastName = includeLastName ? generateLastName(nameType) : "";
    
    const fullName = includeLastName ? `${firstName} ${lastName}` : firstName;
    
    return {
      firstName,
      lastName,
      fullName
    };
  };

  // Handle name generation
  const handleGenerate = () => {
    try {
      const count = parseInt(quantity);
      
      if (isNaN(count) || count < 1 || count > 50) {
        setError("Please enter a valid quantity between 1 and 50");
        return;
      }
      
      const names: GeneratedName[] = [];
      
      for (let i = 0; i < count; i++) {
        names.push(generateName());
      }
      
      setGeneratedNames(names);
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
    }
  };

  // Get the proper title based on the name type
  const getTitle = (): string => {
    if (nameType === "japanese") return "Japanese Name Generator";
    if (nameType === "last") return "Last Name Generator";
    if (nameType === "korean") return "Korean Name Generator";
    if (nameType === "spanish") return "Spanish Name Generator";
    return "Random Name Generator";
  };

  // Get the proper description based on the name type
  const getDescription = (): string => {
    if (nameType === "japanese") {
      return "Our Japanese Name Generator creates authentic Japanese names with proper given names and family names. Generate realistic Japanese names for characters in your fiction, role-playing games, or creative projects. Each name is carefully crafted to reflect Japanese naming conventions and cultural authenticity.";
    } else if (nameType === "last") {
      return "Our Last Name Generator creates a wide variety of surnames from different cultural backgrounds. Generate authentic-sounding last names for characters, creative writing, or anonymous examples. Each surname is carefully selected to sound natural and believable.";
    } else if (nameType === "korean") {
      return "Our Korean Name Generator creates authentic Korean names with proper given names and family names. Generate realistic Korean names for characters in your stories, games, or creative projects. Each name follows Korean naming conventions and cultural authenticity.";
    } else if (nameType === "spanish") {
      return "Our Spanish Name Generator creates authentic Spanish and Hispanic names with proper given names and surnames. Generate realistic Spanish names for characters in your fiction, games, or creative projects. Each name follows Spanish naming conventions and cultural authenticity.";
    } else {
      return "Our Random Name Generator creates diverse names from various cultural backgrounds. Generate realistic names for characters in your fiction, role-playing games, or any creative projects. Each name is designed to sound authentic and believable.";
    }
  };

  // Get the proper introduction based on the name type
  const getIntroduction = (): string => {
    if (nameType === "japanese") {
      return "Generate authentic Japanese names for characters in your stories, games, or creative projects.";
    } else if (nameType === "last") {
      return "Generate realistic surnames from diverse cultural backgrounds for characters or creative projects.";
    } else if (nameType === "korean") {
      return "Create authentic Korean names with proper given names and family names for your creative works.";
    } else if (nameType === "spanish") {
      return "Generate authentic Spanish names for characters in your fiction, games, or creative projects.";
    } else {
      return "Create diverse, authentic-sounding names for characters in your stories, games, or creative projects.";
    }
  };

  // Get the proper features based on the name type
  const getFeatures = (): string[] => {
    if (nameType === "japanese") {
      return [
        "✅ Generates authentic Japanese first and last names",
        "✅ Option to select gender-specific names or random gender",
        "✅ Culturally appropriate name combinations",
        "✅ Generate up to 50 names in a single batch",
        "✅ Easy copy functionality for all generated names"
      ];
    } else if (nameType === "last") {
      return [
        "✅ Generates diverse surnames from multiple cultural backgrounds",
        "✅ Creates believable last names for fictional characters",
        "✅ Generate up to 50 surnames in a single batch",
        "✅ Easy copy functionality for all generated names",
        "✅ Perfect for writers, game developers, and creative projects"
      ];
    } else if (nameType === "korean") {
      return [
        "✅ Generates authentic Korean first and last names",
        "✅ Option to select gender-specific names or random gender",
        "✅ Culturally appropriate Korean name combinations",
        "✅ Generate up to 50 names in a single batch",
        "✅ Easy copy functionality for all generated names"
      ];
    } else if (nameType === "spanish") {
      return [
        "✅ Generates authentic Spanish and Hispanic names",
        "✅ Option to select gender-specific names or random gender",
        "✅ Culturally appropriate Spanish name combinations",
        "✅ Generate up to 50 names in a single batch",
        "✅ Easy copy functionality for all generated names"
      ];
    } else {
      return [
        "✅ Generates diverse names from multiple cultural backgrounds",
        "✅ Option to select gender-specific names or random gender",
        "✅ Creates believable character names for any purpose",
        "✅ Generate up to 50 names in a single batch",
        "✅ Easy copy functionality for all generated names"
      ];
    }
  };

  // Get the proper FAQs based on the name type
  const getFaqs = (): Array<{ question: string; answer: string }> => {
    if (nameType === "japanese") {
      return [
        {
          question: "Are these authentic Japanese names?",
          answer: "Yes. This generator uses a database of common Japanese given names and family names to create authentic-sounding Japanese names that follow proper Japanese naming conventions."
        },
        {
          question: "Can I use these names for my fiction/game/project?",
          answer: "Absolutely! These generated names are perfect for creating characters for novels, short stories, video games, role-playing games, or any other creative projects where you need Japanese characters."
        },
        {
          question: "Do Japanese names have specific meanings?",
          answer: "Yes, Japanese names often have specific meanings based on the kanji (Chinese characters) used to write them. While our generator doesn't display these meanings, the names are based on real Japanese names that would have meaning in Japanese culture."
        },
        {
          question: "Why is the family name shown first in some Japanese contexts?",
          answer: "In traditional Japanese naming conventions, the family name comes before the given name. However, our generator displays names in Western order (given name followed by family name) for familiarity. In Japan, you might see 'Tanaka Haruto' rather than 'Haruto Tanaka'."
        }
      ];
    } else if (nameType === "last") {
      return [
        {
          question: "Where do these last names come from?",
          answer: "Our last name generator draws from a diverse database of surnames from various cultural backgrounds, including English, American, European, and global origins. This provides a wide variety of authentic-sounding surnames."
        },
        {
          question: "Can I use these surnames for fiction writing?",
          answer: "Absolutely! These generated surnames are perfect for creating characters for novels, short stories, screenplays, video games, role-playing games, or any other creative projects where you need character names."
        },
        {
          question: "How can I find a surname from a specific culture?",
          answer: "Currently, our basic generator provides a mix of surnames from various backgrounds. For culture-specific surnames, try our specialized name generators for Japanese, Korean, or Spanish names."
        },
        {
          question: "Are these real surnames?",
          answer: "Yes, the surnames generated are based on real surnames that exist in various cultures. However, the generator creates random selections, so any resemblance to specific real individuals is coincidental."
        }
      ];
    } else if (nameType === "korean") {
      return [
        {
          question: "Are these authentic Korean names?",
          answer: "Yes. This generator uses a database of common Korean given names and family names to create authentic-sounding Korean names that follow proper Korean naming conventions."
        },
        {
          question: "Can I use these names for my fiction/game/project?",
          answer: "Absolutely! These generated names are perfect for creating characters for novels, short stories, video games, role-playing games, or any other creative projects where you need Korean characters."
        },
        {
          question: "Why are Korean last names so short compared to first names?",
          answer: "Korean surnames are typically single syllables (like Kim, Lee, Park), while given names are often two syllables. This reflects traditional Korean naming patterns where there are relatively few family names but many possible given names."
        },
        {
          question: "What's the correct name order in Korean culture?",
          answer: "In Korean naming conventions, the family name comes before the given name. For example, in 'Kim Min-jun', 'Kim' is the family name and 'Min-jun' is the given name. Our generator displays names in this traditional Korean order."
        }
      ];
    } else if (nameType === "spanish") {
      return [
        {
          question: "Are these authentic Spanish names?",
          answer: "Yes. This generator uses a database of common Spanish given names and surnames to create authentic-sounding Spanish names that follow proper Spanish naming conventions."
        },
        {
          question: "Can I use these names for my fiction/game/project?",
          answer: "Absolutely! These generated names are perfect for creating characters for novels, short stories, video games, role-playing games, or any other creative projects where you need Spanish or Hispanic characters."
        },
        {
          question: "Do these names work for all Spanish-speaking countries?",
          answer: "The names generated are generally common across many Spanish-speaking countries, though some names may be more common in certain regions than others. The generator aims to provide names that would be recognizable throughout the Spanish-speaking world."
        },
        {
          question: "How do Spanish double surnames work?",
          answer: "In Spanish naming traditions, people often use two surnames: the first from the father and the second from the mother. Our basic generator shows only one surname for simplicity, but in a real Spanish context, many people would have two surnames."
        }
      ];
    } else {
      return [
        {
          question: "What types of names does this generator create?",
          answer: "Our Random Name Generator creates a diverse mix of names from various cultural backgrounds, primarily focusing on common Western/English names. The names are designed to sound natural and believable for use in various creative projects."
        },
        {
          question: "Can I use these names for my fiction/game/project?",
          answer: "Absolutely! These generated names are perfect for creating characters for novels, short stories, video games, role-playing games, or any other creative projects where you need character names."
        },
        {
          question: "How can I get names from specific cultures?",
          answer: "For culture-specific names, try our specialized name generators like Japanese Name Generator, Korean Name Generator, or Spanish Name Generator. Each creates authentic names for that specific cultural background."
        },
        {
          question: "Are these real names of actual people?",
          answer: "The names generated are based on common real names, but they are randomly combined. Any resemblance to specific real individuals is coincidental. The generator is designed for creating fictional character names, not representing real people."
        }
      ];
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {nameType !== "last" && (
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                >
                  <SelectTrigger id="gender" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="quantity">Quantity (1-50)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5"
              />
            </div>
            
            {nameType !== "last" && (
              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-last-name" 
                  checked={includeLastName}
                  onCheckedChange={setIncludeLastName}
                />
                <Label htmlFor="include-last-name">Include Last Name</Label>
              </div>
            )}

            <Button variant="default" onClick={handleGenerate} className="w-full">
              Generate Names
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {generatedNames.length > 0 && (
              <div className="p-4 rounded-md bg-gray-50 space-y-4">
                <h3 className="font-medium text-gray-900">Generated Names:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generatedNames.map((name, index) => (
                    <div key={index} className="p-2 border border-gray-200 rounded-md bg-white flex justify-between items-center">
                      <span>{name.fullName}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(name.fullName);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const namesList = generatedNames.map(name => name.fullName).join("\n");
                      navigator.clipboard.writeText(namesList);
                    }}
                  >
                    Copy All Names
                  </Button>
                </div>
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
              Our {getTitle()} creates realistic{nameType !== "generic" ? ` ${nameType}` : ""} names for characters, creative writing, games, and more.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Creating characters for fiction writing</li>
                <li>Developing personas for role-playing games</li>
                <li>Generating character names for video games</li>
                <li>Creating placeholder names for design mockups</li>
                <li>Finding inspiration for naming characters in creative projects</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>Note: These randomly generated names are not connected to real individuals. Any resemblance to actual persons is coincidental.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Use the helper functions to get the appropriate content based on name type
  const introduction = getIntroduction();
  const description = getDescription();
  const howToUse = [
    nameType !== "last" ? "Select your preferred gender option (Any, Male, or Female)" : "Choose how many surnames you want to generate",
    `Choose how many ${nameType === "last" ? "surnames" : "names"} you want to generate (1-50)`,
    nameType !== "last" ? "Toggle whether to include last names or generate first names only" : "",
    `Click the 'Generate Names' button`,
    `View the generated ${nameType === "last" ? "surnames" : "names"} and copy individual names or all names at once`,
  ].filter(Boolean);
  
  const features = getFeatures();
  const faqs = getFaqs();

  // Determine the toolSlug from the current URL
  const getToolSlug = (): string => {
    if (location.includes("japanese-name-generator")) {
      return "japanese-name-generator";
    } else if (location.includes("last-name-generator")) {
      return "last-name-generator";
    } else if (location.includes("korean-name-generator")) {
      return "korean-name-generator";
    } else if (location.includes("spanish-name-generator")) {
      return "spanish-name-generator";
    } else {
      return "random-name-generator";
    }
  };

  return (
    <ToolPageTemplate
      toolSlug={getToolSlug()}
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

export default NameGeneratorDetailed;