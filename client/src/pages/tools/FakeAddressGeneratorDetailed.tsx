import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface GeneratedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const FakeAddressGeneratorDetailed: React.FC = () => {
  const [country, setCountry] = useState<string>("usa");
  const [quantity, setQuantity] = useState<string>("1");
  const [generatedAddresses, setGeneratedAddresses] = useState<GeneratedAddress[]>([]);
  const [error, setError] = useState<string>("");

  // Data for US addresses
  const usStreetNames = [
    "Main Street", "Oak Street", "Maple Avenue", "Washington Avenue", "Park Avenue",
    "Elm Street", "Lake Drive", "Pine Street", "Cedar Avenue", "Highland Avenue",
    "Hillside Drive", "Madison Avenue", "Jefferson Street", "Lincoln Avenue", "Franklin Street",
    "Broadway", "Sunset Drive", "Meadow Lane", "Valley Road", "5th Street",
    "Willow Lane", "Church Street", "Ridge Road", "Dogwood Lane", "Forest Drive",
    "River Road", "Walnut Street", "Chestnut Street", "Poplar Street", "4th Street"
  ];
  
  const usStreetTypes = [
    "Street", "Avenue", "Boulevard", "Drive", "Lane", "Road", "Place", "Court", "Terrace", "Way"
  ];
  
  const usCities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", 
    "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", 
    "Indianapolis", "Charlotte", "San Francisco", "Seattle", "Denver", "Boston",
    "Nashville", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee",
    "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Atlanta", "Kansas City", "Omaha"
  ];
  
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];
  
  const usStateAbbreviations = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", 
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", 
    "VA", "WA", "WV", "WI", "WY"
  ];

  // Data for UK addresses
  const ukStreetNames = [
    "High Street", "Station Road", "London Road", "Church Street", "Victoria Road",
    "Green Lane", "Manor Road", "Church Lane", "Park Road", "Queens Road",
    "King Street", "The Avenue", "New Road", "Main Street", "Mill Lane",
    "West Street", "North Street", "East Street", "South Street", "York Road",
    "Windsor Road", "Richmond Road", "Highfield Road", "Albert Road", "School Lane",
    "The Green", "Springfield Road", "Grange Road", "Victoria Street", "Park Lane"
  ];
  
  const ukCities = [
    "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Leeds", "Newcastle", 
    "Sheffield", "Bristol", "Edinburgh", "Cardiff", "Belfast", "Nottingham", "Leicester", 
    "Coventry", "Reading", "Blackpool", "Bolton", "Brighton", "Derby",
    "Aberdeen", "Cambridge", "Exeter", "Oxford", "York", "Swansea", "Southampton",
    "Plymouth", "Bradford", "Northampton", "Bournemouth", "Norwich", "Swindon", "Dundee", "Ipswich"
  ];
  
  const ukCounties = [
    "Greater London", "West Midlands", "Greater Manchester", "West Yorkshire", "Merseyside",
    "South Yorkshire", "Tyne and Wear", "Essex", "Kent", "Lancashire",
    "Hampshire", "Surrey", "Hertfordshire", "Cheshire", "Derbyshire",
    "Devon", "Staffordshire", "Nottinghamshire", "Norfolk", "Lincolnshire",
    "Leicestershire", "Northamptonshire", "Cambridgeshire", "Suffolk", "Oxfordshire",
    "Gloucestershire", "Warwickshire", "Somerset", "Durham", "Dorset"
  ];

  // Data for Canadian addresses
  const canadaStreetNames = [
    "Main Street", "Queen Street", "King Street", "Yonge Street", "Dundas Street",
    "Front Street", "Bay Street", "Bloor Street", "St. Catherine Street", "Rue Sainte-Catherine",
    "Avenue Road", "Bay View Avenue", "Elgin Street", "Rideau Street", "Robson Street",
    "Broadway", "Wellington Street", "Portage Avenue", "Jasper Avenue", "Bank Street",
    "Donald Street", "Princess Street", "Laurier Avenue", "Spadina Avenue", "College Street",
    "St. Laurent Boulevard", "René-Lévesque Boulevard", "Sherbrooke Street", "McGill Street", "Victoria Avenue"
  ];
  
  const canadaCities = [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", 
    "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", 
    "Windsor", "Saskatoon", "Regina", "St. John's", "Barrie", "Kelowna",
    "Abbotsford", "Sherbrooke", "Trois-Rivières", "Guelph", "Moncton", "Thunder Bay",
    "Saint John", "Brantford", "Fredericton", "Red Deer", "Lethbridge", "Kamloops", "Prince George", "Medicine Hat", "Drummondville"
  ];
  
  const canadaProvinces = [
    "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", 
    "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", 
    "Prince Edward Island", "Northwest Territories", "Yukon", "Nunavut"
  ];
  
  const canadaProvinceAbbreviations = [
    "ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE", "NT", "YT", "NU"
  ];

  // Generate a random element from an array
  const getRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate a random integer within range
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random US address
  const generateUSAddress = (): GeneratedAddress => {
    const streetNumber = getRandomInt(1, 9999);
    const streetName = getRandomElement(usStreetNames);
    const city = getRandomElement(usCities);
    const stateIndex = getRandomInt(0, usStates.length - 1);
    const state = usStates[stateIndex];
    const stateAbbr = usStateAbbreviations[stateIndex];
    
    // US ZIP codes are 5 digits
    const zipCode = `${getRandomInt(10000, 99999)}`;
    
    return {
      street: `${streetNumber} ${streetName}`,
      city,
      state: `${state} (${stateAbbr})`,
      zipCode,
      country: "United States"
    };
  };

  // Generate a random UK address
  const generateUKAddress = (): GeneratedAddress => {
    const houseNumber = getRandomInt(1, 150);
    const streetName = getRandomElement(ukStreetNames);
    const city = getRandomElement(ukCities);
    const county = getRandomElement(ukCounties);
    
    // UK postcodes have a format like "AB12 3CD"
    const postcodePrefixes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const postcodePrefix1 = postcodePrefixes.charAt(getRandomInt(0, postcodePrefixes.length - 1));
    const postcodePrefix2 = postcodePrefixes.charAt(getRandomInt(0, postcodePrefixes.length - 1));
    const postcodeNumber = getRandomInt(1, 99);
    const postcodeSuffix1 = getRandomInt(1, 9);
    const postcodeSuffix2 = postcodePrefixes.charAt(getRandomInt(0, postcodePrefixes.length - 1));
    const postcodeSuffix3 = postcodePrefixes.charAt(getRandomInt(0, postcodePrefixes.length - 1));
    
    const postcode = `${postcodePrefix1}${postcodePrefix2}${postcodeNumber} ${postcodeSuffix1}${postcodeSuffix2}${postcodeSuffix3}`;
    
    return {
      street: `${houseNumber} ${streetName}`,
      city,
      state: county,
      zipCode: postcode,
      country: "United Kingdom"
    };
  };

  // Generate a random Canadian address
  const generateCanadaAddress = (): GeneratedAddress => {
    const streetNumber = getRandomInt(1, 9999);
    const streetName = getRandomElement(canadaStreetNames);
    const city = getRandomElement(canadaCities);
    const provinceIndex = getRandomInt(0, canadaProvinces.length - 1);
    const province = canadaProvinces[provinceIndex];
    const provinceAbbr = canadaProvinceAbbreviations[provinceIndex];
    
    // Canadian postal codes have a format like "A1A 1A1"
    const postalCodeLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const postalCode = `${postalCodeLetters.charAt(getRandomInt(0, postalCodeLetters.length - 1))}${getRandomInt(1, 9)}${postalCodeLetters.charAt(getRandomInt(0, postalCodeLetters.length - 1))} ${getRandomInt(1, 9)}${postalCodeLetters.charAt(getRandomInt(0, postalCodeLetters.length - 1))}${getRandomInt(1, 9)}`;
    
    return {
      street: `${streetNumber} ${streetName}`,
      city,
      state: `${province} (${provinceAbbr})`,
      zipCode: postalCode,
      country: "Canada"
    };
  };

  // Generate an address based on country selection
  const generateAddress = (): GeneratedAddress => {
    switch (country) {
      case "usa":
        return generateUSAddress();
      case "uk":
        return generateUKAddress();
      case "canada":
        return generateCanadaAddress();
      default:
        return generateUSAddress();
    }
  };

  // Handle address generation
  const handleGenerate = () => {
    try {
      const count = parseInt(quantity);
      
      if (isNaN(count) || count < 1 || count > 20) {
        setError("Please enter a valid quantity between 1 and 20");
        return;
      }
      
      const addresses: GeneratedAddress[] = [];
      
      for (let i = 0; i < count; i++) {
        addresses.push(generateAddress());
      }
      
      setGeneratedAddresses(addresses);
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
              <Label htmlFor="country">Country</Label>
              <Select
                value={country}
                onValueChange={(value) => setCountry(value)}
              >
                <SelectTrigger id="country" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
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
              Generate Addresses
            </Button>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {error}
              </div>
            )}

            {generatedAddresses.length > 0 && (
              <div className="p-4 rounded-md bg-gray-50 space-y-4 overflow-auto">
                <h3 className="font-medium text-gray-900">Generated Addresses:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border border-gray-200">Street</th>
                        <th className="p-2 border border-gray-200">City</th>
                        <th className="p-2 border border-gray-200">State/Province</th>
                        <th className="p-2 border border-gray-200">ZIP/Postal Code</th>
                        <th className="p-2 border border-gray-200">Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedAddresses.map((address, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="p-2 border border-gray-200">{address.street}</td>
                          <td className="p-2 border border-gray-200">{address.city}</td>
                          <td className="p-2 border border-gray-200">{address.state}</td>
                          <td className="p-2 border border-gray-200">{address.zipCode}</td>
                          <td className="p-2 border border-gray-200">{address.country}</td>
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
                        ["Street", "City", "State/Province", "ZIP/Postal Code", "Country"].join(","),
                        ...generatedAddresses.map(address => [
                          address.street,
                          address.city,
                          address.state,
                          address.zipCode,
                          address.country
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
          <h3 className="text-lg font-medium mb-4">About Fake Address Generator</h3>
          <div className="text-sm space-y-4">
            <p>
              Our Fake Address Generator creates realistic-looking random addresses for testing, development, and creative purposes.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Testing e-commerce checkout systems</li>
                <li>Populating databases with sample address data</li>
                <li>Creating placeholder content for website mockups</li>
                <li>Testing shipping and delivery systems</li>
                <li>Privacy protection when examples are needed</li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>Note: These randomly generated addresses are not connected to real locations. Any resemblance to actual addresses is coincidental.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Generate realistic fake addresses for the US, UK, and Canada with our versatile address generator.";
  
  const description = "Our Fake Address Generator creates realistic random addresses that can be used for testing applications, populating databases, creating sample shipping details, or developing mockups. You can generate addresses for the United States, United Kingdom, or Canada, each following the correct address format for that country. The tool creates complete addresses with street numbers, street names, cities, states/provinces, and ZIP/postal codes that look authentic but don't correspond to real locations. Perfect for developers, testers, designers, and anyone who needs sample address data without using real addresses.";
  
  const howToUse = [
    "Select the country for which you want to generate addresses (US, UK, or Canada)",
    "Choose how many addresses you want to generate (1-20)",
    "Click the 'Generate Addresses' button",
    "View the generated addresses in table format with all address components",
    "Use the 'Copy as CSV' button to export the data for use in spreadsheets or databases"
  ];
  
  const features = [
    "✅ Generates realistic street addresses for multiple countries",
    "✅ Country-specific formatting for addresses (US, UK, Canada)",
    "✅ Proper regional naming conventions for streets, cities, and states/provinces",
    "✅ Correctly formatted postal/ZIP codes for each country",
    "✅ Export generated addresses as CSV with one click"
  ];
  
  const faqs = [
    {
      question: "Are these real addresses?",
      answer: "No. The addresses generated by this tool are created by combining random street names, numbers, cities, and states/provinces in a realistic format. They are not verified against actual postal databases and do not correspond to real locations. Any resemblance to actual addresses is coincidental."
    },
    {
      question: "Can I use these addresses for testing my website?",
      answer: "Yes! These randomly generated addresses are perfect for testing e-commerce checkout flows, address validation systems, or any other application that requires address data. Just remember that since they aren't real addresses, they won't pass validation systems that check against official postal databases."
    },
    {
      question: "Why do I need fake addresses instead of using real ones?",
      answer: "Using fake addresses instead of real ones protects privacy, avoids inadvertently sending mail to real people during testing, prevents potential legal issues, and provides consistent test data across different environments. It's especially important for public demonstrations, documentation, and development work."
    },
    {
      question: "What countries are supported by this generator?",
      answer: "Currently, the generator supports address formats for the United States, United Kingdom, and Canada. Each country has its own specific format, including the appropriate postal/ZIP code formats and regional naming conventions."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="fake-address-generator"
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

export default FakeAddressGeneratorDetailed;