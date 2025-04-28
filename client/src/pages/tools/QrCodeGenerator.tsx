import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const QrCodeGenerator = () => {
  const [content, setContent] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState("text");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(1);
  const [format, setFormat] = useState("png");
  
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "QR Code Generator - ToolsHub";
    window.scrollTo(0, 0);
  }, []);

  const generateQrCode = async () => {
    if (!content.trim()) {
      setError("Please enter content for the QR code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/qrcode/generate", {
        content,
        contentType,
        color: color.replace("#", ""),
        bgColor: bgColor.replace("#", ""),
        size,
        margin,
        format
      });
      
      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl);
    } catch (error) {
      setError("Failed to generate QR code. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQrCode = () => {
    if (!qrCodeUrl) return;
    
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qrcode.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    setContent("");
  };

  const getPlaceholder = () => {
    switch (contentType) {
      case "url":
        return "https://example.com";
      case "email":
        return "example@email.com";
      case "phone":
        return "+1234567890";
      case "sms":
        return "+1234567890";
      case "wifi":
        return "SSID:MyWifi;PASSWORD:mypassword;TYPE:WPA";
      case "vcard":
        return "BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD";
      default:
        return "Enter text here...";
    }
  };

  const getInputComponent = () => {
    switch (contentType) {
      case "url":
        return (
          <Input
            type="url"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://example.com"
            className="w-full"
          />
        );
      case "email":
        return (
          <Input
            type="email"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="example@email.com"
            className="w-full"
          />
        );
      case "phone":
        return (
          <Input
            type="tel"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="+1234567890"
            className="w-full"
          />
        );
      case "sms":
        return (
          <div className="space-y-3">
            <Input
              type="tel"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="+1234567890"
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Message text (optional)"
              className="w-full"
              onChange={(e) => {
                if (e.target.value) {
                  setContent(`${content.split(':')[0]}:${e.target.value}`);
                }
              }}
            />
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="SSID (Network name)"
              className="w-full"
              onChange={(e) => {
                const ssid = e.target.value;
                setContent(`SSID:${ssid};TYPE:WPA;PASSWORD:${content.split(';')[2]?.split(':')[1] || ''}`);
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full"
              onChange={(e) => {
                const password = e.target.value;
                setContent(`SSID:${content.split(';')[0]?.split(':')[1] || ''};TYPE:WPA;PASSWORD:${password}`);
              }}
            />
            <Select defaultValue="WPA" onValueChange={(value) => {
              setContent(content.replace(/TYPE:[^;]+/, `TYPE:${value}`));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Security Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">No Password</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return (
          <Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full"
          />
        );
    }
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
              <h1 className="text-2xl font-bold mb-2">QR Code Generator</h1>
              <p className="text-gray-600">Generate QR codes for URLs, text, contact information, and more.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="content" className="mb-8">
                      <TabsList className="mb-4">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                      </TabsList>
                    
                      <TabsContent value="content">
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-2 block">Content Type</Label>
                            <Select value={contentType} onValueChange={handleContentTypeChange}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone Number</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="wifi">WiFi</SelectItem>
                                <SelectItem value="vcard">vCard (Contact)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">Content</Label>
                            {getInputComponent()}
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                          </div>
                        </div>
                      </TabsContent>
                    
                      <TabsContent value="style">
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-2 block">QR Code Color</Label>
                            <div className="flex items-center gap-3">
                              <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">Background Color</Label>
                            <div className="flex items-center gap-3">
                              <Input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                type="text"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Size: {size}px</Label>
                            </div>
                            <Slider
                              value={[size]}
                              min={100}
                              max={500}
                              step={10}
                              onValueChange={(value) => setSize(value[0])}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label>Margin: {margin}</Label>
                            </div>
                            <Slider
                              value={[margin]}
                              min={0}
                              max={5}
                              step={1}
                              onValueChange={(value) => setMargin(value[0])}
                            />
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">File Format</Label>
                            <RadioGroup value={format} onValueChange={setFormat} className="flex gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="png" id="png" />
                                <Label htmlFor="png">PNG</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="svg" id="svg" />
                                <Label htmlFor="svg">SVG</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="jpeg" id="jpeg" />
                                <Label htmlFor="jpeg">JPEG</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-6 flex flex-col space-y-3">
                      <Button onClick={generateQrCode} disabled={loading} className="bg-primary hover:bg-blue-700">
                        {loading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-qrcode mr-2"></i>
                            <span>Generate QR Code</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Generated QR Code</h3>
                    
                    <div ref={qrCodeRef} className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-4 h-64">
                      {loading ? (
                        <div className="text-center">
                          <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
                          <p className="text-gray-500">Generating QR code...</p>
                        </div>
                      ) : qrCodeUrl ? (
                        <img 
                          src={qrCodeUrl} 
                          alt="Generated QR Code"
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <div className="text-center">
                          <i className="fas fa-qrcode text-5xl text-gray-300 mb-2"></i>
                          <p className="text-gray-500">Your QR code will appear here</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        onClick={downloadQrCode}
                        disabled={!qrCodeUrl}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        <i className="fas fa-download mr-2"></i>
                        <span>Download QR Code</span>
                      </Button>
                    </div>
                    
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>QR code will be downloaded as {format.toUpperCase()} file</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
