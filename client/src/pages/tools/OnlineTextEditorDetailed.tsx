import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

const OnlineTextEditorDetailed = () => {
  const [text, setText] = useState("");
  const [documentName, setDocumentName] = useState("Untitled Document");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("14px");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [documents, setDocuments] = useState<Array<{name: string, content: string}>>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSaveTimeRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate word and character count whenever the text changes
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    setWordCount(words);
    setCharCount(chars);
    setIsSaved(false);
  }, [text]);

  const handleEditorChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setText(content);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    // Auto-save every 30 seconds after a change
    const now = Date.now();
    if (!lastSaveTimeRef.current || now - lastSaveTimeRef.current > 30000) {
      saveDocument();
      lastSaveTimeRef.current = now;
    }
    
    // Prevent default tab behavior and insert tab instead
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
    setIsSaved(false);
  };

  const toggleBold = () => {
    document.execCommand('bold', false, undefined);
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    document.execCommand('italic', false, undefined);
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    document.execCommand('underline', false, undefined);
    setIsUnderline(!isUnderline);
  };

  const setTextFormatting = (command: string, value: string) => {
    document.execCommand(command, false, value);
  };

  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    setTextFormatting('fontName', value);
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    
    // Convert px to pt for execCommand (approximate conversion)
    const sizeMap: Record<string, string> = {
      "10px": "1",
      "12px": "2",
      "14px": "3",
      "16px": "4",
      "18px": "5",
      "24px": "6",
      "32px": "7"
    };
    
    setTextFormatting('fontSize', sizeMap[value] || "3");
  };

  const handleTextAlignChange = (value: "left" | "center" | "right" | "justify") => {
    setTextAlign(value);
    setTextFormatting('justify' + value.charAt(0).toUpperCase() + value.slice(1), "");
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    setTextFormatting('foreColor', color);
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBackgroundColor(color);
    setTextFormatting('hiliteColor', color);
  };

  const newDocument = () => {
    if (!isSaved) {
      const confirmNew = window.confirm("You have unsaved changes. Create a new document anyway?");
      if (!confirmNew) return;
    }
    
    setText("");
    setDocumentName("Untitled Document");
    setIsSaved(true);
    resetFormatting();
    
    toast({
      title: "New document created",
      description: "Started a new blank document",
    });
  };

  const saveDocument = () => {
    // Add to documents list if it's a new document or update existing
    const existingDocIndex = documents.findIndex(doc => doc.name === documentName);
    
    if (existingDocIndex >= 0) {
      // Update existing document
      const updatedDocs = [...documents];
      updatedDocs[existingDocIndex] = { name: documentName, content: text };
      setDocuments(updatedDocs);
    } else {
      // Add new document
      setDocuments(prev => [...prev, { name: documentName, content: text }]);
    }
    
    setIsSaved(true);
    lastSaveTimeRef.current = Date.now();
    
    toast({
      title: "Document saved",
      description: `"${documentName}" has been saved`,
    });
  };

  const loadDocument = (doc: {name: string, content: string}) => {
    if (!isSaved) {
      const confirmLoad = window.confirm("You have unsaved changes. Load another document anyway?");
      if (!confirmLoad) return;
    }
    
    setDocumentName(doc.name);
    setText(doc.content);
    setIsSaved(true);
    
    // Ensure the editor content reflects the loaded document
    if (editorRef.current) {
      editorRef.current.innerHTML = doc.content;
    }
    
    toast({
      title: "Document loaded",
      description: `"${doc.name}" has been loaded`,
    });
  };

  const downloadDocument = () => {
    // First save the document to ensure it's up to date
    saveDocument();
    
    // Create a blob with the document content
    const fileExtension = ".html"; // Store as HTML to preserve formatting
    const fileName = `${documentName}${fileExtension}`;
    const blob = new Blob([text], { type: "text/html" });
    
    // Create download link and trigger click
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document downloaded",
      description: `"${fileName}" has been downloaded to your device`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.html')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt or .html file",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      // Set document name from file name
      const fileName = file.name.replace(/\.(txt|html)$/, '');
      setDocumentName(fileName);
      
      // Set content in editor
      setText(content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
      
      setIsSaved(false);
      
      toast({
        title: "File uploaded",
        description: `"${fileName}" has been loaded into the editor`,
      });
    };
    
    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:", "https://");
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const resetFormatting = () => {
    setFontFamily("Arial");
    setFontSize("14px");
    setTextAlign("left");
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextColor("#000000");
    setBackgroundColor("#ffffff");
  };

  const clearFormatting = () => {
    // Focus the editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand('removeFormat', false, undefined);
    resetFormatting();
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  className="max-w-xs font-medium"
                />
                
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={newDocument}
                    className="h-9"
                  >
                    <i className="fas fa-file mr-2"></i>
                    <span>New</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    <span>Upload</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.html"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveDocument}
                    className="h-9"
                  >
                    <i className="fas fa-save mr-2"></i>
                    <span>Save</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadDocument}
                    className="h-9"
                  >
                    <i className="fas fa-download mr-2"></i>
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-b">
              <Tabs defaultValue="format" className="w-full">
                <div className="px-4">
                  <TabsList>
                    <TabsTrigger value="format">Format</TabsTrigger>
                    <TabsTrigger value="insert">Insert</TabsTrigger>
                    <TabsTrigger value="view">View</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="format" className="px-4 py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      value={fontFamily}
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={fontSize}
                      onValueChange={handleFontSizeChange}
                    >
                      <SelectTrigger className="w-[80px] h-8">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10px">10px</SelectItem>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                        <SelectItem value="24px">24px</SelectItem>
                        <SelectItem value="32px">32px</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isBold ? "default" : "outline"}
                            size="icon"
                            onClick={toggleBold}
                            className="h-8 w-8"
                          >
                            <i className="fas fa-bold"></i>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isItalic ? "default" : "outline"}
                            size="icon"
                            onClick={toggleItalic}
                            className="h-8 w-8"
                          >
                            <i className="fas fa-italic"></i>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isUnderline ? "default" : "outline"}
                            size="icon"
                            onClick={toggleUnderline}
                            className="h-8 w-8"
                          >
                            <i className="fas fa-underline"></i>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Underline</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <label htmlFor="text-color" className="block text-sm mr-1">Text:</label>
                            <input
                              type="color"
                              id="text-color"
                              value={textColor}
                              onChange={handleTextColorChange}
                              className="h-6 w-8 rounded border cursor-pointer"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Text Color</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <label htmlFor="bg-color" className="block text-sm mr-1">Highlight:</label>
                            <input
                              type="color"
                              id="bg-color"
                              value={backgroundColor}
                              onChange={handleBackgroundColorChange}
                              className="h-6 w-8 rounded border cursor-pointer"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Highlight Color</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Separator orientation="vertical" className="h-8" />
                    
                    <div className="flex">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={textAlign === "left" ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleTextAlignChange("left")}
                              className="h-8 w-8 rounded-r-none"
                            >
                              <i className="fas fa-align-left"></i>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Align Left</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={textAlign === "center" ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleTextAlignChange("center")}
                              className="h-8 w-8 rounded-none border-l-0 border-r-0"
                            >
                              <i className="fas fa-align-center"></i>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Align Center</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={textAlign === "right" ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleTextAlignChange("right")}
                              className="h-8 w-8 rounded-none"
                            >
                              <i className="fas fa-align-right"></i>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Align Right</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={textAlign === "justify" ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleTextAlignChange("justify")}
                              className="h-8 w-8 rounded-l-none"
                            >
                              <i className="fas fa-align-justify"></i>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Justify</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={clearFormatting}
                            className="h-8 w-8 ml-auto"
                          >
                            <i className="fas fa-remove-format"></i>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Clear Formatting</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>
                
                <TabsContent value="insert" className="px-4 py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={insertLink}
                      className="h-8"
                    >
                      <i className="fas fa-link mr-2"></i>
                      <span>Link</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={insertImage}
                      className="h-8"
                    >
                      <i className="fas fa-image mr-2"></i>
                      <span>Image</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.execCommand('insertHorizontalRule', false, undefined)}
                      className="h-8"
                    >
                      <i className="fas fa-minus mr-2"></i>
                      <span>Divider</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.execCommand('insertOrderedList', false, undefined)}
                      className="h-8"
                    >
                      <i className="fas fa-list-ol mr-2"></i>
                      <span>Numbered List</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.execCommand('insertUnorderedList', false, undefined)}
                      className="h-8"
                    >
                      <i className="fas fa-list-ul mr-2"></i>
                      <span>Bullet List</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="view" className="px-4 py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">Words: {wordCount}</span>
                      <span>Characters: {charCount}</span>
                    </div>
                    
                    <div className="ml-auto text-sm">
                      {!isSaved && <span className="text-amber-500 mr-2"><i className="fas fa-exclamation-circle mr-1"></i> Unsaved changes</span>}
                      {isSaved && <span className="text-green-500 mr-2"><i className="fas fa-check-circle mr-1"></i> All changes saved</span>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex">
              <div 
                ref={editorRef}
                contentEditable
                className={`w-full h-[400px] p-4 outline-none overflow-y-auto editor-content`}
                style={{ 
                  fontFamily, 
                  fontSize, 
                  textAlign,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                }}
                onInput={handleEditorChange}
                onKeyDown={handleEditorKeyDown}
                onFocus={() => setIsEditorFocused(true)}
                onBlur={() => setIsEditorFocused(false)}
                suppressContentEditableWarning={true}
              ></div>
              
              {documents.length > 0 && (
                <div className="w-72 border-l overflow-y-auto">
                  <div className="p-3 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-700">Saved Documents</h3>
                  </div>
                  <div className="p-2">
                    {documents.map((doc, index) => (
                      <div 
                        key={index} 
                        className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                        onClick={() => loadDocument(doc)}
                      >
                        <i className="fas fa-file-alt text-blue-500 mr-2"></i>
                        <span className="truncate">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-keyboard text-blue-600"></i>
              </div>
              <h3 className="font-medium">Keyboard Shortcuts</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Ctrl+B:</span> Bold</p>
              <p><span className="font-medium">Ctrl+I:</span> Italic</p>
              <p><span className="font-medium">Ctrl+U:</span> Underline</p>
              <p><span className="font-medium">Tab:</span> Indent</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-cloud text-purple-600"></i>
              </div>
              <h3 className="font-medium">Auto-Save</h3>
            </div>
            <p className="text-sm text-gray-600">
              Documents are auto-saved every 30 seconds after changes. Also manually save using the Save button or Ctrl+S.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-file-export text-green-600"></i>
              </div>
              <h3 className="font-medium">Export Options</h3>
            </div>
            <p className="text-sm text-gray-600">
              Download your documents as HTML to preserve all formatting, styling, links, and images.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <i className="fas fa-exclamation-triangle text-yellow-600"></i>
              </div>
              <h3 className="font-medium">Browser Storage</h3>
            </div>
            <p className="text-sm text-gray-600">
              Documents are stored in browser memory. Clear your browser cache will erase saved documents.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const contentData = {
    introduction: "Create, edit, and format text documents right in your browser with our powerful online text editor.",
    description: "Our Online Text Editor is a versatile, browser-based rich text editor that allows you to create, edit, and format documents without the need for installed software. This intuitive tool provides word processing capabilities comparable to desktop applications, all accessible directly through your web browser. The editor features a comprehensive set of text formatting options including font selection, size adjustment, styling (bold, italic, underline), color customization, and text alignment. Advanced formatting tools enable you to create structured documents with bullet points, numbered lists, hyperlinks, images, and horizontal dividers for professional-looking content. Document management features allow you to create multiple documents, save them within the browser, and easily switch between them. The auto-save functionality ensures your work is preserved every 30 seconds after changes, while the manual save option gives you additional control. For file operations, the editor supports uploading existing text or HTML files and downloading your documents in HTML format to preserve all formatting. Real-time statistics track word and character counts as you type, helping you monitor document length. Whether you're drafting a quick note, composing an essay, writing a report, or formatting content for publication, our Online Text Editor provides all the essential tools in a clean, accessible interface that works anywhere you have internet access.",
    howToUse: [
      "Start by giving your document a name in the text field at the top of the editor (it defaults to 'Untitled Document').",
      "Begin typing directly in the main editing area to create your content, or upload an existing .txt or .html file using the Upload button.",
      "Use the formatting toolbar to customize your text: select fonts, adjust sizes, apply styles (bold, italic, underline), change text colors, add highlighting, and set alignment.",
      "Insert additional elements like links, images, horizontal dividers, and lists using the Insert tab in the toolbar.",
      "The document will auto-save every 30 seconds after changes, or you can manually save using the Save button.",
      "To create a new document, click the New button. Your current document will be saved before creating a blank one.",
      "To switch between saved documents, select from the list in the sidebar on the right.",
      "When finished, download your document using the Download button, which will save it as an HTML file with all formatting preserved."
    ],
    features: [
      "Rich text formatting with multiple fonts, sizes, styles, colors, and alignment options",
      "Insert capabilities for links, images, dividers, and ordered/unordered lists",
      "Document management system with the ability to create, save, and switch between multiple documents",
      "Auto-save functionality that preserves your work every 30 seconds after changes",
      "File operations including uploading existing text/HTML files and downloading documents with formatting",
      "Real-time word and character count tracking as you type",
      "Responsive design that works on desktop, tablet, and mobile devices"
    ],
    faqs: [
      {
        question: "Will I lose my documents if I close my browser?",
        answer: "The documents you save in the Online Text Editor are stored in your browser's memory (session storage), which means they will persist during your current browsing session. However, there are several important considerations: 1) If you close the browser tab or window but don't exit the browser completely, your documents should remain accessible when you return to the tool. 2) If you completely close your browser or restart your computer, the documents may be lost depending on your browser settings. 3) Clearing your browser cache/cookies will definitely erase saved documents. For longer-term storage, we strongly recommend downloading important documents to your device using the Download button. This saves your content as an HTML file with formatting preserved. For critical documents, always keep local copies on your device or in cloud storage."
      },
      {
        question: "Can I use this editor for collaborative writing with others?",
        answer: "Currently, our Online Text Editor does not support real-time collaborative editing where multiple users can work on the same document simultaneously. The editor is designed for individual use, with documents stored locally in your browser. However, there are several ways you can use this tool as part of a collaborative workflow: 1) You can download your document using the Download button and share the HTML file with collaborators via email or messaging platforms. 2) Collaborators can upload the shared file to their own editor instance, make changes, and share the updated version back. 3) For version tracking, you might consider including date or version information in the document name. For projects requiring true real-time collaboration with features like simultaneous editing, comments, or revision history, you may need to use dedicated collaborative document platforms. We're evaluating adding collaborative features in future updates based on user feedback."
      },
      {
        question: "What types of formatting and elements can I add to my document?",
        answer: "Our Online Text Editor supports a comprehensive range of formatting options and elements to create professional-looking documents: 1) Text Formatting: Font selection (Arial, Times New Roman, Georgia, etc.), font sizes from 10px to 32px, text styles (bold, italic, underline), text colors, background highlighting, and text alignment (left, center, right, justify). 2) Lists and Structure: Ordered (numbered) lists, unordered (bullet) lists, and horizontal dividers to separate content sections. 3) Media and Links: Insert hyperlinks to external websites or resources, embed images via URL, and create simple tables for data organization. 4) Special Elements: Special characters can be inserted using your system's character map or keyboard shortcuts. For more advanced formatting needs, the editor preserves HTML if you're familiar with basic HTML tags. Note that while the editor offers rich formatting capabilities, extremely complex layouts or advanced features like document templates, advanced table formatting, or embedded media players are not supported."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="online-text-editor"
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

export default OnlineTextEditorDetailed;