import React, { useState, useEffect } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type for saved notes
interface SavedNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const OnlineNotepadDetailed = () => {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");
  const [fontSize, setFontSize] = useState("16");
  const [fontFamily, setFontFamily] = useState("default");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isNewNote, setIsNewNote] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Effect to update word and character count
  useEffect(() => {
    const words = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(noteContent.length);
  }, [noteContent]);

  // Effect to load saved notes from localStorage on component mount
  useEffect(() => {
    const savedNotesJson = localStorage.getItem("online_notepad_notes");
    if (savedNotesJson) {
      try {
        const parsedNotes = JSON.parse(savedNotesJson);
        // Convert date strings back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setSavedNotes(notesWithDates);
      } catch (error) {
        console.error("Error parsing saved notes:", error);
      }
    }

    // Also try to load the current note from localStorage
    const currentNoteJson = localStorage.getItem("online_notepad_current_note");
    if (currentNoteJson) {
      try {
        const currentNote = JSON.parse(currentNoteJson);
        setNoteTitle(currentNote.title || "");
        setNoteContent(currentNote.content || "");
        setCurrentNoteId(currentNote.id || null);
        setIsNewNote(currentNote.isNewNote !== false);
        if (currentNote.lastSavedAt) {
          setLastSavedAt(new Date(currentNote.lastSavedAt));
        }
      } catch (error) {
        console.error("Error parsing current note:", error);
      }
    }
  }, []);

  // Effect to save current note state to localStorage
  useEffect(() => {
    const currentNoteState = {
      id: currentNoteId,
      title: noteTitle,
      content: noteContent,
      isNewNote,
      lastSavedAt: lastSavedAt ? lastSavedAt.toISOString() : null
    };
    localStorage.setItem("online_notepad_current_note", JSON.stringify(currentNoteState));
  }, [noteTitle, noteContent, currentNoteId, isNewNote, lastSavedAt]);

  // Save current note
  const saveNote = () => {
    const now = new Date();
    
    if (!noteTitle.trim()) {
      // Generate title from content if empty
      const generatedTitle = noteContent.trim().split("\n")[0].substring(0, 30) || "Untitled Note";
      setNoteTitle(generatedTitle);
    }
    
    if (isNewNote) {
      // Create new note
      const newNote: SavedNote = {
        id: Date.now().toString(),
        title: noteTitle.trim() || "Untitled Note",
        content: noteContent,
        createdAt: now,
        updatedAt: now
      };
      
      const updatedNotes = [...savedNotes, newNote];
      setSavedNotes(updatedNotes);
      localStorage.setItem("online_notepad_notes", JSON.stringify(updatedNotes));
      
      setCurrentNoteId(newNote.id);
      setIsNewNote(false);
    } else if (currentNoteId) {
      // Update existing note
      const updatedNotes = savedNotes.map(note => {
        if (note.id === currentNoteId) {
          return {
            ...note,
            title: noteTitle.trim() || "Untitled Note",
            content: noteContent,
            updatedAt: now
          };
        }
        return note;
      });
      
      setSavedNotes(updatedNotes);
      localStorage.setItem("online_notepad_notes", JSON.stringify(updatedNotes));
    }
    
    setLastSavedAt(now);
    
    toast({
      title: "Note Saved",
      description: "Your note has been saved successfully",
    });
  };

  // Create new note
  const createNewNote = () => {
    setNoteTitle("");
    setNoteContent("");
    setCurrentNoteId(null);
    setIsNewNote(true);
    setLastSavedAt(null);
    setActiveTab("editor");
  };

  // Load a saved note
  const loadNote = (noteId: string) => {
    const noteToLoad = savedNotes.find(note => note.id === noteId);
    if (noteToLoad) {
      setNoteTitle(noteToLoad.title);
      setNoteContent(noteToLoad.content);
      setCurrentNoteId(noteToLoad.id);
      setIsNewNote(false);
      setLastSavedAt(noteToLoad.updatedAt);
      setActiveTab("editor");
    }
  };

  // Delete a saved note
  const deleteNote = (noteId: string) => {
    const updatedNotes = savedNotes.filter(note => note.id !== noteId);
    setSavedNotes(updatedNotes);
    localStorage.setItem("online_notepad_notes", JSON.stringify(updatedNotes));
    
    // If the deleted note is the current note, reset to a new note
    if (currentNoteId === noteId) {
      createNewNote();
    }
    
    toast({
      title: "Note Deleted",
      description: "Your note has been deleted",
    });
  };

  // Download note as text file
  const downloadNote = () => {
    const fileContent = noteContent;
    const fileName = `${noteTitle || "Untitled Note"}.txt`;
    
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Note Downloaded",
      description: `Your note has been downloaded as "${fileName}"`,
    });
  };

  // Copy note to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(noteContent);
    
    toast({
      title: "Copied to Clipboard",
      description: "Note content has been copied to your clipboard",
    });
  };

  // Clear the editor
  const clearEditor = () => {
    if (noteContent.trim() === "") return;
    
    setNoteContent("");
    
    toast({
      title: "Editor Cleared",
      description: "All content has been cleared from the editor",
    });
  };

  // Format the date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter notes based on search term
  const filteredNotes = searchTerm.trim() === ""
    ? savedNotes
    : savedNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Sort notes by most recently updated
  const sortedNotes = [...filteredNotes].sort((a, b) => 
    b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  const toolInterface = (
    <div className="space-y-6">
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <TabsList className="mb-0">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="saved">
              Saved Notes
              {savedNotes.length > 0 && (
                <Badge className="ml-2 bg-blue-100 text-blue-700">
                  {savedNotes.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select
              value={fontSize}
              onValueChange={setFontSize}
            >
              <SelectTrigger className="w-[110px] h-9">
                <SelectValue placeholder="Font Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={fontFamily}
              onValueChange={setFontFamily}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="editor" className="m-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex items-center">
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title"
                  className="font-medium bg-transparent border-0 text-lg p-0 h-auto focus-visible:ring-0"
                />
              </div>
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start typing your note here..."
                className={`min-h-[400px] border-0 rounded-none p-4 resize-none focus-visible:ring-0
                  font-${fontFamily === 'default' ? 'sans' : fontFamily}`}
                style={{ fontSize: `${fontSize}px` }}
              />
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 border-t">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                  {lastSavedAt && (
                    <>
                      <span>•</span>
                      <span>Last saved: {formatDate(lastSavedAt)}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={clearEditor}
                    variant="outline"
                    size="sm"
                    className="text-gray-700"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="text-blue-600"
                  >
                    Copy
                  </Button>
                  <Button
                    onClick={downloadNote}
                    variant="outline"
                    size="sm"
                    className="text-green-600"
                  >
                    Download
                  </Button>
                  <Button
                    onClick={saveNote}
                    size="sm"
                    className="bg-primary"
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="m-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-medium">Your Saved Notes</h3>
                <div className="flex gap-2">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search notes..."
                    className="w-[200px] h-9"
                  />
                  <Button
                    onClick={createNewNote}
                    size="sm"
                    className="bg-primary"
                  >
                    New Note
                  </Button>
                </div>
              </div>
              
              {savedNotes.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <p className="text-gray-500 mb-2">You don't have any saved notes yet</p>
                  <Button 
                    onClick={createNewNote}
                    variant="outline"
                  >
                    Create Your First Note
                  </Button>
                </div>
              ) : sortedNotes.length === 0 ? (
                <div className="text-center py-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No notes match your search</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                  {sortedNotes.map(note => (
                    <div
                      key={note.id}
                      className={`p-3 border rounded-lg hover:bg-gray-50 transition cursor-pointer ${
                        currentNoteId === note.id ? 'border-blue-300 bg-blue-50' : ''
                      }`}
                      onClick={() => loadNote(note.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium line-clamp-1">{note.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              loadNote(note.id);
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              const tempContent = note.content;
                              navigator.clipboard.writeText(tempContent);
                              toast({
                                title: "Copied to Clipboard",
                                description: "Note content has been copied",
                              });
                            }}>
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {note.content.substring(0, 150)}
                        {note.content.length > 150 && '...'}
                      </p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>
                          {formatDate(note.updatedAt)}
                        </span>
                        <span>
                          {note.content.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Save Note</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Select All</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + A</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Copy</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + C</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cut</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + X</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Paste</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + V</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Undo</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Redo</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Ctrl + Y</kbd>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-3">Online Notepad Features</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Autosaving functionality keeps your work safe</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Store multiple notes with titles and organize them</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Works offline after initial load</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Customize font size and style for better readability</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Word and character count tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Export notes as text files</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Data stored locally on your device (no server uploads)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const introduction = "A distraction-free online notepad with auto-save, customization options, and local storage.";
  
  const description = `
    Our Online Notepad is a clean, intuitive text editor that runs entirely in your browser. It's designed for quick note-taking, drafting content, jotting down ideas, or working on text documents without the bloat of complex word processors. With a focus on simplicity and functionality, this tool provides everything you need for efficient text editing while eliminating distractions.
    
    This versatile notepad automatically saves your work locally on your device, so you'll never lose your notes even if you close the browser or experience a crash. The data remains private and is stored only on your computer—we don't upload your notes to any servers. You can create and manage multiple notes, each with its own title and content, making it easy to organize different projects or topics.
    
    The interface offers useful customization options like adjustable font sizes and different typefaces to suit your reading preferences. Real-time word and character counts help you track the length of your content. When you're ready to save your work externally, you can download notes as text files or copy the content to your clipboard with a single click.
    
    Perfect for students, writers, researchers, or anyone who needs a reliable digital notepad, this tool works across all modern browsers and even functions offline after the initial page load. Its lightweight design ensures fast performance even with lengthy documents, and the clean interface helps you focus on your writing without unnecessary distractions.
  `;

  const howToUse = [
    "Start typing in the editor area to create a note or use the 'New Note' button to begin with a fresh document.",
    "Enter a title for your note in the title field at the top of the editor.",
    "Customize your writing experience by selecting your preferred font size and style from the dropdown menus.",
    "Your work is automatically saved to your browser's local storage as you type.",
    "Click the 'Save Note' button to store your note in your saved notes collection.",
    "Switch to the 'Saved Notes' tab to view, search, and manage all your stored notes.",
    "Use the download button to export your current note as a text file, or copy it to your clipboard with the copy button."
  ];

  const features = [
    "Automatic saving to browser's local storage prevents data loss",
    "Multiple note management with title organization and search functionality",
    "Customizable font sizes and typefaces for comfortable reading and writing",
    "Real-time word and character counting for content length tracking",
    "One-click export to text files and clipboard copying",
    "Clean, distraction-free interface optimized for writing",
    "Works offline after initial page load with no server uploads"
  ];

  const faqs = [
    {
      question: "Are my notes private and secure?",
      answer: "Yes, your notes are completely private. All data is stored locally on your device using your browser's localStorage feature. We don't upload your notes to any servers, and the content never leaves your computer. This also means your notes are only accessible from the device and browser where you created them. For additional security, remember that anyone with access to your device could potentially view your notes if they use the same browser profile."
    },
    {
      question: "Will I lose my notes if I clear my browser cache?",
      answer: "Yes, clearing your browser's cache, cookies, or local storage will erase your saved notes. Before performing browser maintenance like cache clearing or using privacy tools that delete local storage data, we recommend exporting any important notes using the download feature. You can then import these text files back into the notepad later if needed."
    },
    {
      question: "Is there a limit to how many notes I can save or how long they can be?",
      answer: "There is a practical limit based on your browser's localStorage capacity, which varies by browser but is typically between 5-10MB total. This is usually enough for hundreds of text-only notes. For extremely long documents or if you need to store a large number of notes, we recommend periodically downloading important content as text files to avoid reaching storage limits. The notepad also performs better with documents under 100,000 characters, though it can handle longer texts with slightly reduced performance."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="online-notepad"
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

export default OnlineNotepadDetailed;