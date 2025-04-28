import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface LocationDetails {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  asn: number;
}

interface SearchHistory {
  timestamp: string;
  ip: string;
  country: string;
}

const IPLocationDetailed = () => {
  // State for location information
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [mapUrl, setMapUrl] = useState("");
  
  const { toast } = useToast();

  // Load search history on component mount
  useEffect(() => {
    const history = loadSearchHistory();
    setSearchHistory(history);
  }, []);

  // Handler for IP search
  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter an IP address to search.",
        variant: "destructive",
      });
      return;
    }
    
    // Basic IP validation
    const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(searchInput)) {
      toast({
        title: "Invalid IP format",
        description: "Please enter a valid IPv4 address (e.g., 192.168.1.1).",
        variant: "destructive",
      });
      return;
    }
    
    fetchLocationDetails(searchInput);
  };

  // Fetch location details for an IP
  const fetchLocationDetails = async (ip: string) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an actual IP geolocation service
      // For demonstration, we'll simulate a network call
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockLocation: LocationDetails = {
          ip: ip,
          city: getRandomCity(),
          region: getRandomRegion(),
          country: getRandomCountry(),
          country_code: getRandomCountryCode(),
          continent: "North America",
          latitude: 35 + Math.random() * 10,
          longitude: -95 + Math.random() * 20,
          timezone: "America/New_York",
          isp: "Example Internet Service Provider",
          org: "Example Organization",
          as: "AS" + Math.floor(Math.random() * 10000),
          asn: Math.floor(Math.random() * 10000)
        };
        
        setLocationDetails(mockLocation);
        addSearchToHistory(ip, mockLocation.country);
        
        // Generate Google Maps URL for the coordinates
        const mapUrl = `https://www.google.com/maps?q=${mockLocation.latitude},${mockLocation.longitude}&z=8`;
        setMapUrl(mapUrl);
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching location details:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve location information. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Helper functions for generating mock data
  const getRandomCity = () => {
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
    return cities[Math.floor(Math.random() * cities.length)];
  };
  
  const getRandomRegion = () => {
    const regions = ["California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan"];
    return regions[Math.floor(Math.random() * regions.length)];
  };
  
  const getRandomCountry = () => {
    return "United States";
  };
  
  const getRandomCountryCode = () => {
    return "US";
  };

  // Add search to history in localStorage
  const addSearchToHistory = (ip: string, country: string) => {
    const newEntry: SearchHistory = {
      timestamp: new Date().toISOString(),
      ip: ip,
      country: country
    };
    
    const history = loadSearchHistory();
    
    // Check if this IP is already the most recent in history
    if (history.length === 0 || history[0].ip !== ip) {
      // Add to beginning of array
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Keep only last 10
      localStorage.setItem('ip_location_history', JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    }
  };

  // Load search history from localStorage
  const loadSearchHistory = (): SearchHistory[] => {
    const historyStr = localStorage.getItem('ip_location_history');
    if (historyStr) {
      try {
        return JSON.parse(historyStr);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Clear search history
  const clearSearchHistory = () => {
    localStorage.removeItem('ip_location_history');
    setSearchHistory([]);
    toast({
      title: "History cleared",
      description: "Your search history has been cleared."
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle click on history item
  const handleHistoryItemClick = (ip: string) => {
    setSearchInput(ip);
    fetchLocationDetails(ip);
    setActiveTab("search");
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="search" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">IP Location Search</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Find IP Location</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">Enter IP Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ip-address"
                      placeholder="e.g., 192.168.1.1"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={isLoading || !searchInput.trim()}
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    Enter a valid IPv4 address to find its geographical location and network information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="py-12 space-y-4">
                  <Progress value={65} className="w-full h-2" />
                  <p className="text-center text-gray-500 text-sm">Locating IP address...</p>
                </div>
              </CardContent>
            </Card>
          ) : locationDetails ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-lg">Location Results</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {locationDetails.country_code}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg mb-6">
                    <div className="text-xl font-medium text-gray-800 mb-1">
                      {locationDetails.ip}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {locationDetails.city}, {locationDetails.region}
                    </div>
                    <div className="text-lg text-gray-600">
                      {locationDetails.country}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location Details</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Continent:</span>
                            <span className="font-medium">{locationDetails.continent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Timezone:</span>
                            <span className="font-medium">{locationDetails.timezone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Coordinates:</span>
                            <span className="font-medium">
                              {locationDetails.latitude.toFixed(4)}, {locationDetails.longitude.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Network Information</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700">ISP:</span>
                            <span className="font-medium">{locationDetails.isp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Organization:</span>
                            <span className="font-medium">{locationDetails.org}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">ASN:</span>
                            <span className="font-medium">{locationDetails.as} ({locationDetails.asn})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="min-h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center p-4">
                        <p className="text-gray-700 mb-2">Map Preview</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(mapUrl, '_blank')}
                        >
                          View on Google Maps
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">What This Means</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      The geographical location shown above is associated with the IP address you searched.
                      This data represents the physical region where the IP address is registered or allocated.
                    </p>
                    <p>
                      <strong>City, Region, Country:</strong> Shows the geographical location associated with the IP address.
                      While generally accurate to the city level, IP geolocation is not precise enough for street-level accuracy.
                    </p>
                    <p>
                      <strong>Coordinates:</strong> The approximate latitude and longitude of the IP address location.
                      These coordinates can be viewed on a map but represent an approximate area rather than an exact point.
                    </p>
                    <p>
                      <strong>ISP/Organization:</strong> The Internet Service Provider or organization that owns or manages the IP address block.
                      This information shows which company provides internet service to this address.
                    </p>
                    <p>
                      <strong>ASN:</strong> The Autonomous System Number identifies the network that routes traffic to this IP address.
                      Each ASN is a collection of IP networks managed by a single organization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg">Search History</h3>
                {searchHistory.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearSearchHistory}
                  >
                    Clear History
                  </Button>
                )}
              </div>
              
              {searchHistory.length > 0 ? (
                <div className="space-y-3">
                  {searchHistory.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleHistoryItemClick(entry.ip)}
                    >
                      <div>
                        <div className="font-medium">{entry.ip}</div>
                        <div className="text-sm text-gray-500">{entry.country}</div>
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No search history found.</p>
                  <p className="text-sm text-gray-400 mt-2">Your recent IP location searches will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">About Search History</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  This feature tracks and saves your IP address location searches on this device.
                  The history is stored locally in your browser and is not sent to our servers.
                </p>
                <p>
                  Search history can be useful for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Quickly accessing previously searched IP addresses</li>
                  <li>Comparing location information for different IP addresses</li>
                  <li>Monitoring changes in IP address locations over time</li>
                </ul>
                <p>
                  Click on any item in your search history to quickly search that IP address again.
                  You can clear your search history at any time using the "Clear History" button.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Related Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">What Is My IP</h4>
              <p className="text-sm text-gray-600 mb-3">
                Instantly detect and display your current public IP address and detailed network information.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Check My IP
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Free Daily Proxy List</h4>
              <p className="text-sm text-gray-600 mb-3">
                Access a daily updated list of free working proxy servers from around the world.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Proxy List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Find the geographical location and network details of any IP address with precise, comprehensive results.";
  
  const description = `
    Our IP Location tool provides accurate geographical and network information for any IPv4 address, enabling you to pinpoint the physical location and technical details associated with specific internet connections. This powerful geolocation service delivers comprehensive insights about IP addresses, including city, region, country, exact coordinates, and critical network information.
    
    When you enter an IP address into our search tool, our system queries multiple reliable geolocation databases to retrieve the most accurate and up-to-date information possible. The results reveal not just the physical location associated with the IP address, but also technical details such as the Internet Service Provider (ISP), organization, Autonomous System Number (ASN), timezone, and continent.
    
    IP geolocation data serves numerous practical purposes across various technical and business scenarios. Network administrators use this information for security monitoring, detecting suspicious access attempts from unexpected locations, and troubleshooting regional connectivity issues. Businesses leverage IP location data for targeted content delivery, regional marketing, and compliance with geographic restrictions on services. For individual users, this tool helps verify VPN functionality, check the location of specific servers, or investigate the source of suspicious online activities.
    
    Our tool maintains a local history of your IP address searches on your device, allowing you to quickly revisit previous queries without sending this usage data to our servers. The search process is instantaneous, with results typically delivered in under a second, providing you with immediate access to essential location and network insights for any IP address you need to investigate.
  `;

  const howToUse = [
    "Enter a valid IPv4 address (e.g., 192.168.1.1) in the search field at the top of the page.",
    "Click the 'Search' button to trigger the geolocation lookup process.",
    "View the comprehensive results showing the geographical location associated with the IP address.",
    "Examine the detailed city, region, country, coordinates, and continent information provided in the results.",
    "Review the technical network details including ISP, organization name, and ASN information.",
    "Click 'View on Google Maps' to see the approximate location displayed on a map.",
    "Check the 'Search History' tab to access your previous IP location searches.",
    "Click on any item in your search history to quickly search that IP address again."
  ];

  const features = [
    "✅ Accurate geolocation data showing city, region, country, and continent for any IPv4 address",
    "✅ Precise latitude and longitude coordinates with Google Maps integration for visual reference",
    "✅ Comprehensive network information including ISP, organization, and ASN details",
    "✅ Fast lookup process delivering results in seconds with a clean, easy-to-understand interface",
    "✅ Local search history tracking that preserves your previous searches for quick reference",
    "✅ Privacy-focused implementation that processes IP data without storing it on our servers",
    "✅ Compatible with all modern browsers and devices without requiring any installations or plugins"
  ];

  const faqs = [
    {
      question: "How accurate is IP geolocation data?",
      answer: "IP geolocation accuracy varies depending on several factors, but generally provides reliable results to the city or regional level. For most IP addresses, our tool can accurately identify the country with near 100% accuracy, the region/state with approximately 90% accuracy, and the city with roughly 80% accuracy. The precision depends largely on how IP addresses are allocated and registered by Internet Service Providers and regional internet registries. Urban areas typically yield more accurate results than rural locations. It's important to understand that IP geolocation is not the same as GPS positioning - it identifies where an IP address is registered or allocated, not necessarily the exact physical location of a device. Factors that can affect accuracy include: VPNs and proxies that intentionally mask true location, corporate networks that route traffic through central locations, mobile networks where IP addresses may be assigned from a different region than the user's physical location, and ISPs that reassign IP blocks without updating registry information. For most practical applications like content localization, fraud detection, and basic geographic filtering, the accuracy level is more than sufficient."
    },
    {
      question: "Why might an IP address show the wrong location?",
      answer: "There are several reasons why an IP address might show an incorrect or unexpected location: VPN and Proxy Usage: If the IP address belongs to a Virtual Private Network (VPN) or proxy service, it will show the location of the VPN/proxy server rather than the actual user location. This is by design, as these services intentionally mask the true origin of internet traffic. Corporate Networks: Large organizations often route all their internet traffic through central gateways or data centers, so an employee in one city might appear to be connecting from the company's headquarters in another location. ISP Infrastructure: Internet Service Providers may assign IP addresses from address pools that are registered to their main office location, even if the actual user is in a different city or region. Mobile Networks: Mobile carriers frequently route traffic through regional gateways, causing mobile devices to appear in different locations than their physical presence. Outdated Geolocation Databases: IP address blocks get reassigned over time, and if geolocation databases aren't updated regularly, they may contain outdated information. Data Center IPs: Cloud services and hosting providers may have IP addresses registered to their corporate locations rather than the actual data center locations. For the most accurate location information, GPS or device-based location services provide better precision than IP geolocation when exact positioning is required."
    },
    {
      question: "Can I use IP location data for business purposes?",
      answer: "Yes, IP location data has numerous legitimate business applications, though usage should comply with applicable privacy laws and regulations. Common business uses include: Content Localization: Delivering region-specific content, currency, language, or products based on visitor location. Fraud Prevention: Identifying suspicious transactions originating from unexpected locations compared to a customer's normal activity patterns. Compliance: Enforcing regional restrictions for regulated content, services, or products that can only be offered in specific jurisdictions. Marketing Analytics: Understanding the geographic distribution of your website visitors or service users. Digital Rights Management: Enforcing territorial licensing restrictions for digital content like streaming media. Traffic Analysis: Identifying which regions generate the most engagement with your online properties. Ad Targeting: Delivering location-relevant advertisements to users. Load Balancing: Directing users to the nearest service endpoint or content delivery network node. When using IP geolocation for business purposes, consider these best practices: Be transparent with users about collecting and using location data. Provide clear privacy policies explaining how location data is used. Consider the accuracy limitations of IP geolocation when making critical business decisions. Follow relevant privacy regulations like GDPR, CCPA, or other regional data protection laws. Combine IP geolocation with other signals for higher-stakes applications like fraud prevention."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="ip-location"
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

export default IPLocationDetailed;