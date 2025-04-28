import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface IPDetails {
  ip: string;
  type: string;
  version: string;
  hostname?: string;
  asn?: string;
  isp?: string;
  last_checked?: string;
}

interface IPHistory {
  timestamp: string;
  ip: string;
}

const WhatIsMyIPDetailed = () => {
  // State for IP information
  const [ipDetails, setIpDetails] = useState<IPDetails | null>(null);
  const [ipHistory, setIpHistory] = useState<IPHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ip-info");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const { toast } = useToast();

  // Fetch IP details on component mount
  useEffect(() => {
    fetchIPDetails();
    
    // Load IP history from localStorage
    const history = loadIPHistory();
    setIpHistory(history);
  }, []);

  // Fetch IP details from a service
  const fetchIPDetails = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an actual IP detection service
      // For demonstration, we'll simulate a network call
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const mockIPDetails: IPDetails = {
          ip: "192.168.1." + Math.floor(Math.random() * 255),
          type: "IPv4",
          version: "4",
          hostname: "user-" + Math.floor(Math.random() * 100000) + ".provider.net",
          asn: "AS" + Math.floor(Math.random() * 10000),
          isp: "Example Internet Service Provider",
          last_checked: new Date().toISOString()
        };
        
        setIpDetails(mockIPDetails);
        addIPToHistory(mockIPDetails.ip);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching IP details:", error);
      toast({
        title: "Error",
        description: "Failed to retrieve your IP address. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Add IP to history in localStorage
  const addIPToHistory = (ip: string) => {
    const newEntry: IPHistory = {
      timestamp: new Date().toISOString(),
      ip: ip
    };
    
    const history = loadIPHistory();
    
    // Check if this IP is already the most recent in history
    if (history.length === 0 || history[0].ip !== ip) {
      // Add to beginning of array
      const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Keep only last 10
      localStorage.setItem('ip_history', JSON.stringify(updatedHistory));
      setIpHistory(updatedHistory);
    }
  };

  // Load IP history from localStorage
  const loadIPHistory = (): IPHistory[] => {
    const historyStr = localStorage.getItem('ip_history');
    if (historyStr) {
      try {
        return JSON.parse(historyStr);
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  // Clear IP history
  const clearIPHistory = () => {
    localStorage.removeItem('ip_history');
    setIpHistory([]);
    toast({
      title: "History cleared",
      description: "Your IP address history has been cleared."
    });
  };

  // Refresh IP details
  const handleRefreshIP = () => {
    fetchIPDetails();
  };

  // Copy IP to clipboard
  const copyToClipboard = () => {
    if (!ipDetails) return;
    
    navigator.clipboard.writeText(ipDetails.ip);
    setCopySuccess(true);
    
    toast({
      title: "IP Copied",
      description: "Your IP address has been copied to clipboard."
    });
    
    setTimeout(() => setCopySuccess(false), 2000);
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

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="ip-info" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ip-info">IP Information</TabsTrigger>
          <TabsTrigger value="history">IP History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ip-info" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg">Your Current IP Address</h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefreshIP}
                  disabled={isLoading}
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              
              {isLoading ? (
                <div className="py-12 space-y-4">
                  <Progress value={65} className="w-full h-2" />
                  <p className="text-center text-gray-500 text-sm">Detecting your IP address...</p>
                </div>
              ) : ipDetails ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {ipDetails.ip}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {ipDetails.type}
                      </Badge>
                      {ipDetails.hostname && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Hostname Available
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyToClipboard} 
                      className="mt-4"
                    >
                      {copySuccess ? "Copied!" : "Copy to Clipboard"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">IP Version</h4>
                        <p className="text-gray-900">{ipDetails.version}</p>
                      </div>
                      {ipDetails.hostname && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Hostname</h4>
                          <p className="text-gray-900 break-all">{ipDetails.hostname}</p>
                        </div>
                      )}
                      {ipDetails.last_checked && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Last Checked</h4>
                          <p className="text-gray-900">{formatDate(ipDetails.last_checked)}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {ipDetails.asn && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">ASN</h4>
                          <p className="text-gray-900">{ipDetails.asn}</p>
                        </div>
                      )}
                      {ipDetails.isp && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Internet Service Provider</h4>
                          <p className="text-gray-900">{ipDetails.isp}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Could not retrieve IP information. Please try again.</p>
                  <Button className="mt-4" onClick={handleRefreshIP}>
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">What This Means</h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <p>
                  Your IP address is a unique identifier assigned to your device when connected to the internet.
                  It serves as your device's "address" for sending and receiving data online.
                </p>
                <p>
                  The information above shows your current public IP address and related details detected by our system.
                  This is the IP address that websites and online services see when you connect to them.
                </p>
                <p>
                  <strong>IP Type (IPv4/IPv6):</strong> Indicates which version of the Internet Protocol your connection is using.
                  IPv4 addresses look like 192.168.1.1, while IPv6 addresses are longer and include both letters and numbers.
                </p>
                <p>
                  <strong>Hostname:</strong> A human-readable name associated with your IP address, often assigned by your ISP.
                </p>
                <p>
                  <strong>ASN/ISP:</strong> Shows which Internet Service Provider or network is providing your internet connection.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-lg">IP Address History</h3>
                {ipHistory.length > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearIPHistory}
                  >
                    Clear History
                  </Button>
                )}
              </div>
              
              {ipHistory.length > 0 ? (
                <div className="space-y-3">
                  {ipHistory.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{entry.ip}</div>
                      <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No IP history found.</p>
                  <p className="text-sm text-gray-400 mt-2">Your recently detected IP addresses will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">About IP History</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  This feature tracks and saves your previously detected IP addresses on this device.
                  The history is stored locally in your browser and is not sent to our servers.
                </p>
                <p>
                  IP history can be useful for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tracking changes in your IP address over time</li>
                  <li>Verifying if your VPN or proxy is working correctly</li>
                  <li>Confirming when your ISP has assigned you a new IP address</li>
                </ul>
                <p>
                  You can clear your IP history at any time using the "Clear History" button.
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
              <h4 className="font-medium mb-2">IP Location</h4>
              <p className="text-sm text-gray-600 mb-3">
                Find the geographical location associated with any IP address including country, city, and coordinates.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Check IP Location
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

  const introduction = "Instantly detect and display your current public IP address and detailed network information.";
  
  const description = `
    Our "What is My IP" tool provides a fast, reliable way to identify your current public IP address and view detailed information about your internet connection. This essential networking tool instantly detects the unique numerical identifier that online services use to recognize your device on the internet, giving you valuable insights into your digital presence.
    
    When you connect to the internet through your Internet Service Provider (ISP), you're assigned either an IPv4 address (like 192.168.1.1) or the newer IPv6 address format. Our tool automatically detects which version you're using and displays it prominently along with related technical details such as your hostname, Autonomous System Number (ASN), and the name of your Internet Service Provider.
    
    Understanding your IP address is crucial for various technical tasks and digital privacy considerations. Network administrators use this information for troubleshooting connectivity issues, configuring firewalls, and setting up remote access. For everyday users, knowing your IP address helps when setting up home networks, connecting to online gaming services, or verifying that your VPN (Virtual Private Network) is functioning correctly by confirming your IP address has changed.
    
    Our tool maintains a local history of previously detected IP addresses on your device, allowing you to track changes over time without sending this sensitive data to our servers. This feature is particularly useful for monitoring when your ISP assigns you a new dynamic IP address or for verifying that your privacy tools are working correctly. The entire process happens instantly, with no need to create an account or provide any personal information.
  `;

  const howToUse = [
    "Visit the 'What is My IP' tool page - your IP address will be automatically detected and displayed.",
    "View your current public IP address prominently shown at the top of the page.",
    "Examine additional details about your connection, including IP version, hostname, ASN, and ISP information.",
    "Click the 'Copy to Clipboard' button to easily copy your IP address for use in other applications.",
    "Use the 'Refresh' button if you've recently changed networks or connected to a VPN and want to see your updated IP.",
    "Switch to the 'IP History' tab to view a record of previously detected IP addresses on this device.",
    "Clear your IP history at any time by clicking the 'Clear History' button if desired."
  ];

  const features = [
    "Instant detection and display of your current public IPv4 or IPv6 address",
    "Detailed technical information including IP version, hostname, ASN, and Internet Service Provider",
    "Local IP address history tracking to monitor changes in your IP address over time",
    "One-click copy to clipboard functionality for easy sharing and usage",
    "Privacy-focused implementation that processes your IP data without storing it on our servers",
    "Works with both standard connections and when using VPNs or proxy servers",
    "Compatible with all modern browsers and devices without requiring any installations or plugins"
  ];

  const faqs = [
    {
      question: "What is an IP address and why should I know mine?",
      answer: "An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to a computer network that uses the Internet Protocol for communication. It serves as your device's 'address' on the internet, similar to how a physical address identifies your home. Knowing your IP address is important for various reasons: it helps with network troubleshooting, setting up remote access to services, configuring certain applications or games, verifying VPN functionality, and understanding your digital footprint. For network administrators, it's essential for security configurations, while for everyday users, it can help diagnose connection issues or ensure privacy tools are working correctly."
    },
    {
      question: "What's the difference between IPv4 and IPv6 addresses?",
      answer: "IPv4 (Internet Protocol version 4) and IPv6 (Internet Protocol version 6) are two generations of IP addressing systems. The key differences include: Format: IPv4 addresses use a 32-bit format displayed as four numbers separated by dots (e.g., 192.168.1.1), while IPv6 uses a 128-bit format displayed as eight groups of hexadecimal digits separated by colons (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334). Address space: IPv4 has approximately 4.3 billion possible addresses, which are being exhausted due to the growing number of internet-connected devices. IPv6 offers an astronomically larger number of addresses (about 340 undecillion). Configuration: IPv4 often requires manual configuration or DHCP, while IPv6 includes auto-configuration capabilities. Performance: IPv6 was designed with improvements in routing efficiency, packet processing, and network security. Most modern devices and networks now support both standards, with a gradual transition toward IPv6 as the primary protocol."
    },
    {
      question: "Is it dangerous if someone knows my IP address?",
      answer: "While sharing your IP address isn't inherently dangerous, it does come with some privacy and security considerations. Your IP address alone doesn't give someone access to your personal files or accounts, but it can reveal general information about your location (usually city-level) and internet service provider. In most cases, knowing your IP address alone isn't enough for malicious activities. However, there are potential risks: A technically skilled person could attempt to scan your IP for vulnerabilities or open ports. In online gaming or certain online communities, individuals might attempt DDoS attacks using your IP address. Your general geographic location could be determined through IP geolocation. To protect yourself, consider using a VPN (Virtual Private Network) when privacy is important, keep your devices and routers updated with security patches, use a firewall, and be cautious about sharing your IP address in public forums. For most everyday internet activities, the normal visibility of your IP address to websites you visit poses minimal risk."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="what-is-my-ip"
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

export default WhatIsMyIPDetailed;