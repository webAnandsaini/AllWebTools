import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface GeneratedName {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  username: string;
}

const FakeNameGeneratorDetailed: React.FC = () => {
  const [gender, setGender] = useState<string>("any");
  const [quantity, setQuantity] = useState<string>("1");
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [error, setError] = useState<string>("");

  // First names data
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

  // Last names data
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"
  ];

  // Email domains
  const emailDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", 
    "icloud.com", "mail.com", "protonmail.com", "example.com", "test.com"
  ];

  // Generate a random element from an array
  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate a random integer within range
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a username from name
  const generateUsername = (firstName: string, lastName: string): string => {
    const options = [
      `${firstName.toLowerCase()}${getRandomInt(1, 999)}`,
      `${firstName[0].toLowerCase()}${lastName.toLowerCase()}${getRandomInt(1, 99)}`,
      `${lastName.toLowerCase()}${firstName[0].toLowerCase()}${getRandomInt(1, 99)}`,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${getRandomInt(1, 999)}`
    ];
    
    return getRandomElement(options);
  };

  // Generate an email from name
  const generateEmail = (firstName: string, lastName: string): string => {
    const options = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(emailDomains)}`,
      `${firstName[0].toLowerCase()}${lastName.toLowerCase()}@${getRandomElement(emailDomains)}`,
      `${firstName.toLowerCase()}${getRandomInt(1, 999)}@${getRandomElement(emailDomains)}`,
      `${lastName.toLowerCase()}${firstName[0].toLowerCase()}@${getRandomElement(emailDomains)}`
    ];
    
    return getRandomElement(options);
  };

  // Generate a single fake name with associated info
  const generateFakeName = (): GeneratedName => {
    const chosenGender = gender === "any" 
      ? (Math.random() > 0.5 ? "male" : "female") 
      : gender;
    
    const firstName = chosenGender === "male" 
      ? getRandomElement(maleFirstNames) 
      : getRandomElement(femaleFirstNames);
    
    const lastName = getRandomElement(lastNames);
    const username = generateUsername(firstName, lastName);
    const email = generateEmail(firstName, lastName);
    
    return {
      firstName,
      lastName,
      gender: chosenGender === "male" ? "Male" : "Female",
      username,
      email
    };
  };

  // Handle name generation
  const handleGenerate = () => {
    try {
      const count = parseInt(quantity);
      
      if (isNaN(count) || count < 1 || count > 20) {
        setError("Please enter a valid quantity between 1 and 20");
        return;
      }
      
      const names: GeneratedName[] = [];
      
      for (let i = 0; i < count; i++) {
        names.push(generateFakeName());
      }
      
      setGeneratedNames(names);
      setError("");
    } catch (error: any) {
      setError("Error: " + error.message);
    }
  };

  const toolInterface = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
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
            
            <div>
              <Label htmlFor="quantity">Quantity (1-20)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <Button variant="default" onClick={handleGenerate} className="w-full">
              Generate Names
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {generatedNames.length > 0 && (
              <div className="p-4 rounded-md bg-gray-50 space-y-4 overflow-auto">
                <h3 className="font-medium text-gray-900">Generated Names:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border border-gray-200">First Name</th>
                        <th className="p-2 border border-gray-200">Last Name</th>
                        <th className="p-2 border border-gray-200">Gender</th>
                        <th className="p-2 border border-gray-200">Username</th>
                        <th className="p-2 border border-gray-200">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedNames.map((name, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-2 border border-gray-200">{name.firstName}</td>
                          <td className="p-2 border border-gray-200">{name.lastName}</td>
                          <td className="p-2 border border-gray-200">{name.gender}</td>
                          <td className="p-2 border border-gray-200">{name.username}</td>
                          <td className="p-2 border border-gray-200">{name.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const csvContent = [
                        ["First Name", "Last Name", "Gender", "Username", "Email"].join(","),
                        ...generatedNames.map(name => [
                          name.firstName,
                          name.lastName,
                          name.gender,
                          name.username,
                          name.email
                        ].join(","))
                      ].join("\n");
                      
                      navigator.clipboard.writeText(csvContent);
                    }}
                  >
                    Copy as CSV
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About Fake Name Generator</h3>
          <div className="text-sm space-y-4">
            <p>
              Our Fake Name Generator creates realistic-looking random names for various testing, development, and creative purposes.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Testing user registration systems</li>
                <li>Populating databases with sample user data</li>
                <li>Creating placeholder content for website mockups</li>
                <li>Generating character names for creative writing</li>
                <li>Privacy protection when needing example names</li>
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

  const introduction = "Generate realistic fake names complete with usernames and emails for testing and development.";
  
  const description = "Our Fake Name Generator creates realistic random names that can be used for testing applications, populating databases, creating sample user accounts, or developing creative content. Each generated entry includes a first name, last name, gender, username, and email address that follows common naming patterns. You can customize the output by selecting a specific gender and generating up to 20 names at once. This tool is perfect for developers, testers, writers, and anyone who needs placeholder identity data that looks authentic but doesn't represent real individuals.";
  
  const howToUse = [
    "Select your preferred gender option (Any, Male, or Female)",
    "Choose how many names you want to generate (1-20)",
    "Click the 'Generate Names' button",
    "View the generated names including first name, last name, gender, username, and email",
    "Use the 'Copy as CSV' button to export the data in a format suitable for spreadsheets or databases"
  ];
  
  const features = [
    "✅ Generates realistic first and last name combinations",
    "✅ Creates matching usernames and email addresses",
    "✅ Customizable gender selection",
    "✅ Generate up to 20 names in a single batch",
    "✅ Export results in CSV format with one click"
  ];
  
  const faqs = [
    {
      question: "Are these generated names of real people?",
      answer: "No. The names generated by this tool are created randomly by combining common first and last names. Any resemblance to real individuals is purely coincidental. No personal data is used in the generation process."
    },
    {
      question: "Can I use these names for my website/app/project?",
      answer: "Yes. These randomly generated names are perfect for testing applications, populating sample databases, creating mockups, or using as placeholder content. Just remember that they should not be used to create fake accounts on real services, as that may violate terms of service."
    },
    {
      question: "Do the email addresses actually work?",
      answer: "No. The email addresses generated by this tool are not registered and do not belong to real mailboxes. They follow common email address patterns but are created solely for testing purposes. Do not attempt to send emails to these addresses."
    },
    {
      question: "Why would I need fake names?",
      answer: "Fake names are useful in numerous scenarios: testing user registration systems, developing database prototypes, creating realistic mockups, designing UI elements with user data, writing fiction, or any situation where you need example names without using real people's identities."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="fake-name-generator"
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

export default FakeNameGeneratorDetailed;