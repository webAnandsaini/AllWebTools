import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

// Types for source information
interface SourceInfo {
  sourceType: string;
  title: string;
  authors: string;
  publicationDate: string;
  publisher?: string;
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  doi?: string;
  accessDate?: string;
  websiteName?: string;
  newspaperName?: string;
  city?: string;
  bookEdition?: string;
  editor?: string;
  translator?: string;
  universityName?: string;
  thesisType?: string;
}

const CitationGeneratorDetailed = () => {
  // Default empty source info
  const defaultSourceInfo: SourceInfo = {
    sourceType: "book",
    title: "",
    authors: "",
    publicationDate: "",
    publisher: "",
    url: "",
    accessDate: new Date().toISOString().split("T")[0] // Today's date
  };

  const [sourceInfo, setSourceInfo] = useState<SourceInfo>(defaultSourceInfo);
  const [citationStyle, setCitationStyle] = useState("apa");
  const [generatedCitations, setGeneratedCitations] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(citationStyle);
  const { toast } = useToast();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSourceInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle source type change and update fields
  const handleSourceTypeChange = (value: string) => {
    // Preserve common fields when changing source type
    const preservedFields = {
      title: sourceInfo.title,
      authors: sourceInfo.authors,
      publicationDate: sourceInfo.publicationDate,
      url: sourceInfo.url,
      accessDate: sourceInfo.accessDate
    };
    
    setSourceInfo({ ...defaultSourceInfo, ...preservedFields, sourceType: value });
  };

  // Generate citations in all supported formats
  const generateCitation = () => {
    // Validate required fields
    if (!sourceInfo.title) {
      toast({
        title: "Missing information",
        description: "Title is required for citation",
        variant: "destructive",
      });
      return;
    }

    const citations: Record<string, string> = {};
    
    // Generate APA citation
    citations.apa = generateAPACitation(sourceInfo);
    
    // Generate MLA citation
    citations.mla = generateMLACitation(sourceInfo);
    
    // Generate Chicago citation
    citations.chicago = generateChicagoCitation(sourceInfo);
    
    // Generate Harvard citation
    citations.harvard = generateHarvardCitation(sourceInfo);
    
    // Generate IEEE citation
    citations.ieee = generateIEEECitation(sourceInfo);
    
    // Generate Vancouver citation
    citations.vancouver = generateVancouverCitation(sourceInfo);
    
    setGeneratedCitations(citations);
    setActiveTab(citationStyle);
    
    toast({
      title: "Citations Generated",
      description: "Your citations are ready in multiple formats",
    });
  };

  const generateAPACitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsAPA(source.authors);
    
    // Format date
    const date = formatDateAPA(source.publicationDate);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors} (${date}). `;
        citation += `<i>${source.title}</i>`;
        if (source.bookEdition) citation += ` (${source.bookEdition} ed.)`;
        if (source.publisher) citation += `. ${source.publisher}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors} (${date}). `;
        citation += `${source.title}. `;
        citation += `<i>${source.journalName}</i>`;
        if (source.volume) citation += `, ${source.volume}`;
        if (source.issue) citation += `(${source.issue})`;
        if (source.pages) citation += `, ${source.pages}`;
        if (source.doi) citation += `. https://doi.org/${source.doi}`;
        else if (source.url) citation += `. ${source.url}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors} (${date}). `;
        citation += `${source.title}. `;
        if (source.websiteName) citation += `<i>${source.websiteName}</i>. `;
        if (source.url) citation += `${source.url}`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors} (${date}). `;
        citation += `${source.title}. `;
        citation += `<i>${source.newspaperName}</i>`;
        if (source.pages) citation += `, ${source.pages}`;
        if (source.url) citation += `. ${source.url}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors} (${date}). `;
        citation += `<i>${source.title}</i> `;
        citation += `[${source.thesisType}, ${source.universityName}]`;
        if (source.url) citation += `. ${source.url}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  const generateMLACitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsMLA(source.authors);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors}. `;
        citation += `<i>${source.title}</i>`;
        if (source.bookEdition) citation += `, ${source.bookEdition} ed.`;
        if (source.publisher) citation += `, ${source.publisher}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        citation += `<i>${source.journalName}</i>`;
        if (source.volume) citation += `, vol. ${source.volume}`;
        if (source.issue) citation += `, no. ${source.issue}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        if (source.pages) citation += `, pp. ${source.pages}`;
        if (source.url) citation += `. ${source.url}`;
        if (source.accessDate) citation += `. Accessed ${formatDateMLA(source.accessDate)}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        if (source.websiteName) citation += `<i>${source.websiteName}</i>, `;
        if (source.publicationDate) citation += `${formatDateMLA(source.publicationDate)}, `;
        if (source.url) citation += `${source.url}`;
        if (source.accessDate) citation += `. Accessed ${formatDateMLA(source.accessDate)}`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        citation += `<i>${source.newspaperName}</i>`;
        if (source.publicationDate) citation += `, ${formatDateMLA(source.publicationDate)}`;
        if (source.pages) citation += `, p. ${source.pages}`;
        if (source.url) citation += `. ${source.url}`;
        if (source.accessDate) citation += `. Accessed ${formatDateMLA(source.accessDate)}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors}. `;
        citation += `<i>${source.title}</i>. `;
        if (source.publicationDate) citation += `${formatYearOnly(source.publicationDate)}, `;
        citation += `${source.universityName}, ${source.thesisType}`;
        if (source.url) citation += `. ${source.url}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  const generateChicagoCitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsChicago(source.authors);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors}. `;
        citation += `<i>${source.title}</i>`;
        if (source.bookEdition) citation += `, ${source.bookEdition} ed.`;
        if (source.city) citation += ` ${source.city}:`;
        if (source.publisher) citation += ` ${source.publisher}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        citation += `<i>${source.journalName}</i>`;
        if (source.volume) citation += ` ${source.volume}`;
        if (source.issue) citation += `, no. ${source.issue}`;
        if (source.publicationDate) citation += ` (${formatYearOnly(source.publicationDate)})`;
        if (source.pages) citation += `: ${source.pages}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        if (source.websiteName) citation += `<i>${source.websiteName}</i>. `;
        if (source.publicationDate) citation += `${formatDateChicago(source.publicationDate)}. `;
        if (source.url) citation += `${source.url}`;
        if (source.accessDate) citation += ` (accessed ${formatDateChicago(source.accessDate)})`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        citation += `<i>${source.newspaperName}</i>`;
        if (source.publicationDate) citation += `, ${formatDateChicago(source.publicationDate)}`;
        if (source.url) citation += `. ${source.url}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors}. `;
        citation += `"${source.title}." `;
        citation += `${source.thesisType}, ${source.universityName}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  const generateHarvardCitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsHarvard(source.authors);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors} `;
        if (source.publicationDate) citation += `(${formatYearOnly(source.publicationDate)}). `;
        citation += `<i>${source.title}</i>`;
        if (source.bookEdition) citation += `, ${source.bookEdition} edn`;
        if (source.city) citation += `, ${source.city}`;
        if (source.publisher) citation += `: ${source.publisher}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors} `;
        if (source.publicationDate) citation += `(${formatYearOnly(source.publicationDate)}). `;
        citation += `'${source.title}', `;
        citation += `<i>${source.journalName}</i>`;
        if (source.volume) citation += `, ${source.volume}`;
        if (source.issue) citation += `(${source.issue})`;
        if (source.pages) citation += `, pp. ${source.pages}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors} `;
        if (source.publicationDate) citation += `(${formatYearOnly(source.publicationDate)}). `;
        citation += `'${source.title}', `;
        if (source.websiteName) citation += `<i>${source.websiteName}</i>. `;
        if (source.url) citation += `Available at: ${source.url} `;
        if (source.accessDate) citation += `(Accessed: ${formatDateHarvard(source.accessDate)})`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors} `;
        if (source.publicationDate) citation += `(${formatYearOnly(source.publicationDate)}). `;
        citation += `'${source.title}', `;
        citation += `<i>${source.newspaperName}</i>`;
        if (source.pages) citation += `, p. ${source.pages}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors} `;
        if (source.publicationDate) citation += `(${formatYearOnly(source.publicationDate)}). `;
        citation += `<i>${source.title}</i>. `;
        citation += `${source.thesisType}. ${source.universityName}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  const generateIEEECitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsIEEE(source.authors);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors}, `;
        citation += `<i>${source.title}</i>`;
        if (source.bookEdition) citation += `, ${source.bookEdition} ed.`;
        if (source.city) citation += ` ${source.city}:`;
        if (source.publisher) citation += ` ${source.publisher}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors}, `;
        citation += `"${source.title}," `;
        citation += `<i>${source.journalName}</i>`;
        if (source.volume) citation += `, vol. ${source.volume}`;
        if (source.issue) citation += `, no. ${source.issue}`;
        if (source.pages) citation += `, pp. ${source.pages}`;
        if (source.publicationDate) citation += `, ${formatDateIEEE(source.publicationDate)}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors}, `;
        citation += `"${source.title}," `;
        if (source.websiteName) citation += `<i>${source.websiteName}</i>. `;
        if (source.url) citation += `[Online]. Available: ${source.url}. `;
        if (source.accessDate) citation += `[Accessed: ${formatDateIEEE(source.accessDate)}]`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors}, `;
        citation += `"${source.title}," `;
        citation += `<i>${source.newspaperName}</i>`;
        if (source.publicationDate) citation += `, ${formatDateIEEE(source.publicationDate)}`;
        if (source.pages) citation += `, p. ${source.pages}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors}, `;
        citation += `"${source.title}," `;
        citation += `${source.thesisType}, ${source.universityName}`;
        if (source.publicationDate) citation += `, ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  const generateVancouverCitation = (source: SourceInfo): string => {
    let citation = "";
    
    // Format authors
    const formattedAuthors = formatAuthorsVancouver(source.authors);
    
    switch (source.sourceType) {
      case "book":
        citation = `${formattedAuthors}. `;
        citation += `${source.title}`;
        if (source.bookEdition) citation += `. ${source.bookEdition} ed`;
        if (source.city) citation += `. ${source.city}:`;
        if (source.publisher) citation += ` ${source.publisher}`;
        if (source.publicationDate) citation += `; ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
        
      case "journal":
        citation = `${formattedAuthors}. `;
        citation += `${source.title}. `;
        citation += `${source.journalName}`;
        if (source.publicationDate) citation += ` ${formatYearOnly(source.publicationDate)}`;
        if (source.volume) citation += `;${source.volume}`;
        if (source.issue) citation += `(${source.issue})`;
        if (source.pages) citation += `:${source.pages}`;
        citation += ".";
        break;
        
      case "website":
        citation = `${formattedAuthors}. `;
        citation += `${source.title} `;
        if (source.websiteName) citation += `[Internet]. ${source.websiteName}; `;
        if (source.publicationDate) citation += `${formatYearOnly(source.publicationDate)} `;
        if (source.url) citation += `[cited ${formatDateVancouver(source.accessDate)}]. Available from: ${source.url}`;
        citation += ".";
        break;
        
      case "newspaper":
        citation = `${formattedAuthors}. `;
        citation += `${source.title}. `;
        citation += `${source.newspaperName}`;
        if (source.publicationDate) citation += ` ${formatDateVancouver(source.publicationDate)}`;
        if (source.pages) citation += `;${source.pages}`;
        citation += ".";
        break;
        
      case "thesis":
        citation = `${formattedAuthors}. `;
        citation += `${source.title} `;
        citation += `[${source.thesisType}]. ${source.universityName}`;
        if (source.publicationDate) citation += `; ${formatYearOnly(source.publicationDate)}`;
        citation += ".";
        break;
    }
    
    return citation;
  };

  // Format authors based on citation style
  const formatAuthorsAPA = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // Extract last name for single author
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      let initials = "";
      
      // Get initials for first and middle names
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].length > 0) {
          initials += parts[i][0] + ". ";
        }
      }
      
      return `${lastName}, ${initials.trim()}`;
    } else if (authorList.length === 2) {
      return `${formatAuthorsAPA(authorList[0])} & ${formatAuthorsAPA(authorList[1])}`;
    } else if (authorList.length > 2) {
      // First author followed by "et al."
      return `${formatAuthorsAPA(authorList[0])} et al.`;
    }
    
    return "";
  };

  const formatAuthorsMLA = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // For MLA, format as "Last, First Middle"
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      const firstMiddle = parts.slice(0, parts.length - 1).join(" ");
      
      return `${lastName}, ${firstMiddle}`;
    } else if (authorList.length === 2) {
      // First author Last, First; second author First Last
      const firstAuthor = formatAuthorsMLA(authorList[0]);
      
      // Format second author as First Last
      const secondAuthorParts = authorList[1].split(" ");
      const secondAuthor = secondAuthorParts.join(" ");
      
      return `${firstAuthor}, and ${secondAuthor}`;
    } else if (authorList.length > 2) {
      // First author followed by "et al."
      return `${formatAuthorsMLA(authorList[0])}, et al.`;
    }
    
    return "";
  };

  const formatAuthorsChicago = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // For Chicago, first author as "Last, First Middle"
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      const firstMiddle = parts.slice(0, parts.length - 1).join(" ");
      
      return `${lastName}, ${firstMiddle}`;
    } else if (authorList.length === 2) {
      // First author Last, First and second author First Last
      const firstAuthor = formatAuthorsChicago(authorList[0]);
      
      // Second author as First Last
      const secondAuthorParts = authorList[1].split(" ");
      const secondAuthor = secondAuthorParts.join(" ");
      
      return `${firstAuthor} and ${secondAuthor}`;
    } else if (authorList.length > 2) {
      // First author followed by "et al."
      return `${formatAuthorsChicago(authorList[0])} et al.`;
    }
    
    return "";
  };

  const formatAuthorsHarvard = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // Format as Last, I.
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      let initials = "";
      
      // Get initials for first and middle names
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].length > 0) {
          initials += parts[i][0] + ".";
        }
      }
      
      return `${lastName}, ${initials}`;
    } else if (authorList.length === 2) {
      return `${formatAuthorsHarvard(authorList[0])} and ${formatAuthorsHarvard(authorList[1])}`;
    } else if (authorList.length <= 3) {
      // All authors for Harvard up to 3
      return authorList.map(author => formatAuthorsHarvard(author)).join(", ").replace(/,([^,]*)$/, ' and$1');
    } else if (authorList.length > 3) {
      // First author followed by "et al."
      return `${formatAuthorsHarvard(authorList[0])} et al.`;
    }
    
    return "";
  };

  const formatAuthorsIEEE = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // Format as I. Last
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      let initials = "";
      
      // Get initials for first and middle names
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].length > 0) {
          initials += parts[i][0] + ". ";
        }
      }
      
      return `${initials}${lastName}`;
    } else if (authorList.length <= 6) {
      // Include up to 6 authors for IEEE
      return authorList.map(author => formatAuthorsIEEE(author)).join(", ");
    } else {
      // First author plus "et al."
      return `${formatAuthorsIEEE(authorList[0])} et al.`;
    }
    
    return "";
  };

  const formatAuthorsVancouver = (authors: string): string => {
    if (!authors) return "";
    
    const authorList = authors.split(",").map(a => a.trim());
    
    if (authorList.length === 1) {
      // Format as Last FM
      const parts = authorList[0].split(" ");
      if (parts.length <= 1) return authorList[0];
      
      const lastName = parts[parts.length - 1];
      let initials = "";
      
      // Get initials for first and middle names
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].length > 0) {
          initials += parts[i][0];
        }
      }
      
      return `${lastName} ${initials}`;
    } else if (authorList.length <= 6) {
      // Include up to 6 authors for Vancouver
      return authorList.map(author => formatAuthorsVancouver(author)).join(", ");
    } else {
      // First 6 authors followed by "et al."
      return `${authorList.slice(0, 6).map(author => formatAuthorsVancouver(author)).join(", ")} et al.`;
    }
    
    return "";
  };

  // Date formatting helpers
  const formatDateAPA = (dateString: string): string => {
    if (!dateString) return "n.d.";
    
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatDateMLA = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatDateChicago = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      return `${month} ${day}, ${year}`;
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatDateHarvard = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatDateIEEE = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${month} ${year}`;
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatDateVancouver = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      
      return `${year} ${month} ${day}`;
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  const formatYearOnly = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString; // Return as is if parsing fails
    }
  };

  // Copy citation to clipboard
  const copyCitation = (style: string) => {
    if (!generatedCitations[style]) return;
    
    // Create temp element to handle HTML entities
    const tempElement = document.createElement("div");
    tempElement.innerHTML = generatedCitations[style];
    const plainText = tempElement.textContent || tempElement.innerText || "";
    
    navigator.clipboard.writeText(plainText);
    
    toast({
      title: "Citation Copied",
      description: `${style.toUpperCase()} citation has been copied to clipboard`,
    });
  };

  // Reset form
  const resetForm = () => {
    setSourceInfo(defaultSourceInfo);
    setGeneratedCitations({});
  };

  // Determine which fields to show based on source type
  const renderSourceFields = () => {
    const commonFields = (
      <>
        <div className="space-y-2">
          <Label htmlFor="title">Title*</Label>
          <Input 
            id="title"
            name="title"
            value={sourceInfo.title}
            onChange={handleInputChange}
            placeholder="Title of the source"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authors">Author(s)</Label>
          <Input 
            id="authors"
            name="authors"
            value={sourceInfo.authors}
            onChange={handleInputChange}
            placeholder="e.g. John Smith, Jane Doe"
          />
          <p className="text-xs text-gray-500">Separate multiple authors with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="publicationDate">Publication Date</Label>
          <Input 
            id="publicationDate"
            name="publicationDate"
            type="date"
            value={sourceInfo.publicationDate}
            onChange={handleInputChange}
          />
        </div>
      </>
    );

    // Additional fields based on source type
    let additionalFields = null;

    switch (sourceInfo.sourceType) {
      case "book":
        additionalFields = (
          <>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input 
                id="publisher"
                name="publisher"
                value={sourceInfo.publisher || ""}
                onChange={handleInputChange}
                placeholder="Publishing company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                name="city"
                value={sourceInfo.city || ""}
                onChange={handleInputChange}
                placeholder="City of publication"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookEdition">Edition</Label>
              <Input 
                id="bookEdition"
                name="bookEdition"
                value={sourceInfo.bookEdition || ""}
                onChange={handleInputChange}
                placeholder="e.g. 2nd"
              />
            </div>
          </>
        );
        break;

      case "journal":
        additionalFields = (
          <>
            <div className="space-y-2">
              <Label htmlFor="journalName">Journal Name</Label>
              <Input 
                id="journalName"
                name="journalName"
                value={sourceInfo.journalName || ""}
                onChange={handleInputChange}
                placeholder="Name of the journal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input 
                  id="volume"
                  name="volume"
                  value={sourceInfo.volume || ""}
                  onChange={handleInputChange}
                  placeholder="Volume number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue">Issue</Label>
                <Input 
                  id="issue"
                  name="issue"
                  value={sourceInfo.issue || ""}
                  onChange={handleInputChange}
                  placeholder="Issue number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input 
                id="pages"
                name="pages"
                value={sourceInfo.pages || ""}
                onChange={handleInputChange}
                placeholder="e.g. 125-140"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input 
                id="doi"
                name="doi"
                value={sourceInfo.doi || ""}
                onChange={handleInputChange}
                placeholder="Digital Object Identifier"
              />
            </div>
          </>
        );
        break;

      case "website":
        additionalFields = (
          <>
            <div className="space-y-2">
              <Label htmlFor="websiteName">Website Name</Label>
              <Input 
                id="websiteName"
                name="websiteName"
                value={sourceInfo.websiteName || ""}
                onChange={handleInputChange}
                placeholder="Name of the website"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url"
                name="url"
                value={sourceInfo.url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessDate">Access Date</Label>
              <Input 
                id="accessDate"
                name="accessDate"
                type="date"
                value={sourceInfo.accessDate || new Date().toISOString().split("T")[0]}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
        break;

      case "newspaper":
        additionalFields = (
          <>
            <div className="space-y-2">
              <Label htmlFor="newspaperName">Newspaper Name</Label>
              <Input 
                id="newspaperName"
                name="newspaperName"
                value={sourceInfo.newspaperName || ""}
                onChange={handleInputChange}
                placeholder="Name of the newspaper"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input 
                id="pages"
                name="pages"
                value={sourceInfo.pages || ""}
                onChange={handleInputChange}
                placeholder="e.g. A1, B5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url"
                name="url"
                value={sourceInfo.url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessDate">Access Date</Label>
              <Input 
                id="accessDate"
                name="accessDate"
                type="date"
                value={sourceInfo.accessDate || new Date().toISOString().split("T")[0]}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
        break;

      case "thesis":
        additionalFields = (
          <>
            <div className="space-y-2">
              <Label htmlFor="thesisType">Thesis Type</Label>
              <Input 
                id="thesisType"
                name="thesisType"
                value={sourceInfo.thesisType || ""}
                onChange={handleInputChange}
                placeholder="e.g. PhD Dissertation, Master's Thesis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="universityName">University</Label>
              <Input 
                id="universityName"
                name="universityName"
                value={sourceInfo.universityName || ""}
                onChange={handleInputChange}
                placeholder="Name of the university"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url"
                name="url"
                value={sourceInfo.url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
          </>
        );
        break;
    }

    return (
      <div className="space-y-4">
        {commonFields}
        {additionalFields}
      </div>
    );
  };

  const toolInterface = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Source Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceType">Source Type</Label>
                  <Select
                    value={sourceInfo.sourceType}
                    onValueChange={handleSourceTypeChange}
                  >
                    <SelectTrigger id="sourceType">
                      <SelectValue placeholder="Select Source Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="journal">Journal Article</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="newspaper">Newspaper Article</SelectItem>
                      <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderSourceFields()}

                <div className="space-y-2">
                  <Label htmlFor="citationStyle">Citation Style</Label>
                  <Select
                    value={citationStyle}
                    onValueChange={setCitationStyle}
                  >
                    <SelectTrigger id="citationStyle">
                      <SelectValue placeholder="Select Citation Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apa">APA (7th Edition)</SelectItem>
                      <SelectItem value="mla">MLA (9th Edition)</SelectItem>
                      <SelectItem value="chicago">Chicago (17th Edition)</SelectItem>
                      <SelectItem value="harvard">Harvard</SelectItem>
                      <SelectItem value="ieee">IEEE</SelectItem>
                      <SelectItem value="vancouver">Vancouver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    onClick={generateCitation}
                    disabled={!sourceInfo.title}
                    className="bg-primary hover:bg-blue-700 transition"
                  >
                    Generate Citation
                  </Button>
                  
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-gray-300"
                  >
                    Reset Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Citation Styles Guide</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Badge className="bg-blue-50 text-blue-700 mt-0.5 mr-2">APA</Badge>
                  <div>
                    <p className="text-sm text-gray-600">American Psychological Association style, commonly used in social sciences, education, and psychology.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="bg-green-50 text-green-700 mt-0.5 mr-2">MLA</Badge>
                  <div>
                    <p className="text-sm text-gray-600">Modern Language Association style, widely used in humanities, literature, arts, and cultural studies.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="bg-purple-50 text-purple-700 mt-0.5 mr-2">Chicago</Badge>
                  <div>
                    <p className="text-sm text-gray-600">Chicago Manual of Style, frequently used in history, arts, and some social sciences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="bg-amber-50 text-amber-700 mt-0.5 mr-2">Harvard</Badge>
                  <div>
                    <p className="text-sm text-gray-600">Author-date citation system popular in universities and academic publications worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="bg-indigo-50 text-indigo-700 mt-0.5 mr-2">IEEE</Badge>
                  <div>
                    <p className="text-sm text-gray-600">Institute of Electrical and Electronics Engineers style, standard for technical fields, engineering, and computer science.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Badge className="bg-rose-50 text-rose-700 mt-0.5 mr-2">Vancouver</Badge>
                  <div>
                    <p className="text-sm text-gray-600">Numbered citation style commonly used in medicine, biomedicine, and other health sciences.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Generated Citations</h3>
                {Object.keys(generatedCitations).length > 0 && (
                  <Badge className="bg-green-50 text-green-700">
                    {Object.keys(generatedCitations).length} styles
                  </Badge>
                )}
              </div>
              
              {Object.keys(generatedCitations).length > 0 ? (
                <div className="space-y-4">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="apa">APA</TabsTrigger>
                      <TabsTrigger value="mla">MLA</TabsTrigger>
                      <TabsTrigger value="chicago">Chicago</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="harvard">Harvard</TabsTrigger>
                      <TabsTrigger value="ieee">IEEE</TabsTrigger>
                      <TabsTrigger value="vancouver">Vancouver</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(generatedCitations).map(([style, citation]) => (
                      <TabsContent key={style} value={style} className="pt-4">
                        <Card>
                          <CardContent className="p-4 bg-gray-50 border-t rounded-lg">
                            <div 
                              className="text-sm font-medium"
                              dangerouslySetInnerHTML={{ __html: citation }}
                            />
                          </CardContent>
                        </Card>
                        <div className="flex justify-end mt-2">
                          <Button
                            onClick={() => copyCitation(style)}
                            variant="outline"
                            className="text-blue-600"
                            size="sm"
                          >
                            Copy {style.toUpperCase()}
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div className="p-12 text-center border rounded-lg">
                  <p className="text-gray-500">
                    Fill in the source information and click "Generate Citation" to see different citation styles here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Citation Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Be thorough and accurate with source details - missing information can lead to incomplete citations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>For books with multiple editions, always specify the edition number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>When citing online sources, include both publication date and access date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>For journal articles, the DOI (Digital Object Identifier) is preferred over URLs when available</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Always check your institution's specific guidelines, as citation style implementations may vary slightly</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Common Citation Mistakes</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✕</span>
                  <span>Inconsistent formatting within a document (mixing citation styles)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✕</span>
                  <span>Incorrect punctuation or capitalization in titles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✕</span>
                  <span>Missing or incorrect page numbers for direct quotations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✕</span>
                  <span>Using an outdated edition of a citation style</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const introduction = "Generate perfectly formatted citations in APA, MLA, Chicago, Harvard, IEEE, and Vancouver styles.";
  
  const description = `
    Our Citation Generator is a comprehensive academic writing tool designed to create properly formatted citations in all major citation styles. Whether you're working on a research paper, thesis, dissertation, or any scholarly work, this tool simplifies the often complex process of creating accurate citations for your bibliography or references section.
    
    Proper citation is a cornerstone of academic integrity, allowing you to give credit to original sources and avoid plagiarism. Our generator supports the six most widely used citation formats: APA (American Psychological Association), MLA (Modern Language Association), Chicago, Harvard, IEEE (Institute of Electrical and Electronics Engineers), and Vancouver, covering the needs of students and researchers across virtually all academic disciplines.
    
    This tool handles a wide range of source types including books, journal articles, websites, newspaper articles, and theses/dissertations. For each source type, the generator presents relevant input fields that capture all necessary information. Once you provide the source details, the tool instantly generates properly formatted citations in all six styles, allowing you to compare formats or select the one required for your specific assignment.
    
    The Citation Generator follows the latest editions of each style guide, ensuring that your citations adhere to current academic standards. You can easily copy the generated citations to your document with proper formatting intact, saving valuable time and eliminating the stress of manually formatting references according to complex style rules.
  `;

  const howToUse = [
    "Select the appropriate source type from the dropdown menu (Book, Journal Article, Website, Newspaper Article, or Thesis/Dissertation).",
    "Fill in the required fields for your selected source type (title, author(s), publication date, etc.).",
    "Choose your preferred citation style from the options (APA, MLA, Chicago, Harvard, IEEE, or Vancouver).",
    "Click the 'Generate Citation' button to create citations in all six major styles.",
    "Review the generated citations on the right panel, organized in tabs by style.",
    "Click 'Copy' next to any citation style to copy it to your clipboard for use in your document.",
    "Use the 'Reset Form' button to clear all fields and start a new citation."
  ];

  const features = [
    "Support for six major citation styles (APA, MLA, Chicago, Harvard, IEEE, Vancouver)",
    "Specialized input fields for different source types (books, journals, websites, etc.)",
    "Simultaneous generation of citations in all formats for easy comparison",
    "One-click copying of formatted citations to clipboard",
    "Current with the latest edition guidelines of each citation style",
    "Proper formatting of author names according to each style's requirements"
  ];

  const faqs = [
    {
      question: "Which citation style should I use for my paper?",
      answer: "The citation style you should use depends primarily on your academic discipline and your instructor's requirements. Generally, APA is common in social sciences, psychology, and education; MLA in humanities and literature; Chicago in history and some humanities; Harvard in various disciplines globally; IEEE in engineering, computer science, and technical fields; and Vancouver in medicine and health sciences. Always check your assignment guidelines or ask your instructor if you're unsure which style to use."
    },
    {
      question: "What information do I need to create a complete citation?",
      answer: "The exact information needed varies by source type, but generally you should collect: author names (all authors if possible), publication date, title of the work, container information (e.g., journal name, book title for a chapter), publisher information, volume/issue numbers for journals, page numbers, and for online sources, the URL and access date. Having a complete set of bibliographic information ready before using the citation generator will result in the most accurate and complete citations."
    },
    {
      question: "Do I need to cite differently for direct quotes versus paraphrasing?",
      answer: "The citation generator creates reference list/bibliography entries, which are formatted the same whether you've quoted or paraphrased a source. However, in-text citations (parenthetical citations within your text) may vary depending on whether you're directly quoting or paraphrasing. Direct quotes typically require page numbers in most styles, while paraphrased content might not. The specifics depend on which citation style you're using, so consult the respective style guide for in-text citation rules."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="citation-generator"
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

export default CitationGeneratorDetailed;