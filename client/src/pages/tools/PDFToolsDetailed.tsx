import { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFResult {
  originalFile?: {
    name: string;
    size: number;
    type: string;
  };
  convertedFile?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  mergedFile?: {
    name: string;
    size: number;
    pageCount: number;
    url: string;
  };
  compressedFile?: {
    name: string;
    originalSize: number;
    newSize: number;
    compressionRatio: number;
    url: string;
  };
  watermarkedFile?: {
    name: string;
    url: string;
  };
  splitResults?: Array<{
    name: string;
    pageRange: string;
    size: number;
    url: string;
  }>;
  protectionResult?: {
    success: boolean;
    message: string;
    name: string;
    url?: string;
  };
  rotatedFile?: {
    name: string;
    url: string;
    degrees: number;
  };
  preview?: {
    imageUrl: string;
    pageCount: number;
    currentPage: number;
  };
}

const PDFToolsDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PDFResult | null>(null);
  const [options, setOptions] = useState({
    password: "",
    watermarkText: "Confidential",
    watermarkColor: "#FF0000",
    watermarkOpacity: 30,
    rotation: 90,
    quality: 80,
    targetSize: 200, // in KB
    pageRanges: "",
    protectionType: "password",
  });
  const { toast } = useToast();

  // Extract the actual tool slug without the "-detailed" suffix
  const pathSegments = window.location.pathname.split('/');
  let toolSlug = pathSegments[pathSegments.length - 1].replace('-detailed', '');
  
  // Handle direct routes without /tools/ prefix
  if (pathSegments.length === 2) {
    toolSlug = pathSegments[1].replace('-detailed', '');
  }

  const getFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const handleSecondaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSecondaryFile(files[0]);
    }
  };

  const handleProcessFile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    // If the tool requires a second file (like merging) and it's not provided
    if ((toolSlug === "merge-pdf") && !secondaryFile) {
      toast({
        title: "Error",
        description: "Please select a second PDF file for merging",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate processing with timeout
    setTimeout(() => {
      let demoResult: PDFResult = {};

      switch (toolSlug) {
        case "pdf-to-word":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".pdf", ".docx"),
              size: Math.round(file.size * 0.9),
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              url: "#",
            },
          };
          break;

        case "word-to-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".docx", ".pdf").replace(".doc", ".pdf"),
              size: Math.round(file.size * 1.1),
              type: "application/pdf",
              url: "#",
            },
          };
          break;

        case "pdf-to-jpg":
        case "pdf-to-png":
        case "pdf-to-bmp":
        case "pdf-to-tiff":
        case "pdf-to-svg":
          const extension = toolSlug.split("-").pop(); // jpg, png, etc.
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".pdf", `.${extension}`),
              size: Math.round(file.size * 0.8),
              type: `image/${extension === "jpg" ? "jpeg" : extension}`,
              url: "#",
            },
            preview: {
              imageUrl: "https://via.placeholder.com/800x1100?text=PDF+Preview",
              pageCount: 5,
              currentPage: 1,
            },
          };
          break;

        case "jpg-to-pdf":
        case "png-to-pdf":
        case "bmp-to-pdf":
        case "tiff-to-pdf":
        case "svg-to-pdf":
        case "gif-to-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(/\.[^.]+$/, ".pdf"),
              size: Math.round(file.size * 1.2),
              type: "application/pdf",
              url: "#",
            },
            preview: {
              imageUrl: URL.createObjectURL(file),
              pageCount: 1,
              currentPage: 1,
            },
          };
          break;

        case "merge-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            mergedFile: {
              name: "merged_document.pdf",
              size: file.size + (secondaryFile ? secondaryFile.size : 0),
              pageCount: 10, // Example page count
              url: "#",
            },
          };
          break;

        case "compress-pdf":
        case "compress-pdf-to-50kb":
        case "compress-pdf-to-100kb":
        case "compress-pdf-to-150kb":
        case "compress-pdf-to-200kb":
        case "compress-pdf-to-300kb":
        case "compress-pdf-to-500kb":
        case "compress-pdf-to-1mb":
        case "compress-pdf-to-2mb":
        case "resize-pdf-to-200kb":
          // Extract target size from slug if present
          let targetSize = options.targetSize;
          if (toolSlug.includes("-to-")) {
            const sizeMatch = toolSlug.match(/to-(\d+)(kb|mb)/i);
            if (sizeMatch) {
              const size = parseInt(sizeMatch[1]);
              const unit = sizeMatch[2].toLowerCase();
              targetSize = unit === "mb" ? size * 1024 : size;
            }
          }
          
          const compressionRatio = Math.min(targetSize * 1024 / file.size, 0.9);
          const newSize = Math.max(Math.round(file.size * compressionRatio), targetSize * 1024 * 0.9);
          
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            compressedFile: {
              name: file.name.replace(".pdf", "_compressed.pdf"),
              originalSize: file.size,
              newSize: newSize,
              compressionRatio: (1 - newSize / file.size) * 100,
              url: "#",
            },
          };
          break;

        case "rotate-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            rotatedFile: {
              name: file.name.replace(".pdf", "_rotated.pdf"),
              url: "#",
              degrees: options.rotation,
            },
            preview: {
              imageUrl: "https://via.placeholder.com/800x1100?text=Rotated+PDF+Preview",
              pageCount: 5,
              currentPage: 1,
            },
          };
          break;

        case "unlock-pdf":
        case "remove-password-from-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            protectionResult: {
              success: true,
              message: "Password successfully removed from PDF",
              name: file.name.replace(".pdf", "_unlocked.pdf"),
              url: "#",
            },
          };
          break;

        case "lock-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            protectionResult: {
              success: true,
              message: `PDF successfully encrypted with password`,
              name: file.name.replace(".pdf", "_secured.pdf"),
              url: "#",
            },
          };
          break;

        case "watermark":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            watermarkedFile: {
              name: file.name.replace(".pdf", "_watermarked.pdf"),
              url: "#",
            },
            preview: {
              imageUrl: "https://via.placeholder.com/800x1100?text=Watermarked+PDF+Preview",
              pageCount: 5,
              currentPage: 1,
            },
          };
          break;

        case "powerpoint-to-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".pptx", ".pdf").replace(".ppt", ".pdf"),
              size: Math.round(file.size * 0.95),
              type: "application/pdf",
              url: "#",
            },
          };
          break;

        case "excel-to-pdf":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".xlsx", ".pdf").replace(".xls", ".pdf"),
              size: Math.round(file.size * 0.9),
              type: "application/pdf",
              url: "#",
            },
          };
          break;

        case "split-pdf":
        case "delete-pages-from-pdf":
        case "pdf-page-remover":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            splitResults: [
              {
                name: file.name.replace(".pdf", "_part1.pdf"),
                pageRange: "1-3",
                size: Math.round(file.size * 0.4),
                url: "#",
              },
              {
                name: file.name.replace(".pdf", "_part2.pdf"),
                pageRange: "4-7",
                size: Math.round(file.size * 0.6),
                url: "#",
              },
            ],
          };
          break;

        case "pdf-to-zip":
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name.replace(".pdf", ".zip"),
              size: Math.round(file.size * 0.7),
              type: "application/zip",
              url: "#",
            },
          };
          break;

        default:
          // Generic conversion result for other tools
          demoResult = {
            originalFile: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            convertedFile: {
              name: file.name + ".converted",
              size: Math.round(file.size * 0.9),
              type: "application/pdf",
              url: "#",
            },
          };
      }

      setResult(demoResult);
      setLoading(false);
    }, 2000);
  };

  const getToolContent = (toolSlug: string) => {
    switch (toolSlug) {
      case "pdf-to-word":
        return {
          title: "PDF to Word Converter",
          introduction: "Convert PDF files to editable Word documents online with our free converter.",
          description: "Our PDF to Word converter transforms your PDF files into fully editable Microsoft Word documents with remarkable accuracy. Maintain original formatting including paragraphs, bullet points, tables, and images. This free online tool extracts text, images, and layout from your PDF files to create DOC and DOCX files that can be easily edited in any word processor.",
          howToUse: [
            "Upload your PDF file using the file selector or drag-and-drop area",
            "Wait while we convert your PDF document to Word format",
            "Download your editable Word document when conversion is complete"
          ],
          features: [
            "High-fidelity conversion that preserves original formatting",
            "Supports multiple PDF formats including native and scanned PDFs",
            "Maintains tables, bullets, and numbering",
            "Preserves images, diagrams, and charts",
            "Fast processing with no watermarks",
            "Advanced OCR for scanned documents",
            "Free to use with no registration required",
            "Secure conversion with automatic file deletion"
          ],
          faqs: [
            {
              question: "Will my PDF formatting be preserved in the Word document?",
              answer: "Yes, our converter maintains the structure, formatting, and layout of your original PDF including text, images, tables, and lists. While complex layouts might require minor adjustments, most elements will be accurately preserved."
            },
            {
              question: "What file formats are supported for the output?",
              answer: "Our converter supports both DOC and DOCX output formats, with DOCX being the default as it's the modern Microsoft Word format with better formatting preservation capabilities."
            },
            {
              question: "Can I convert password-protected PDFs?",
              answer: "To convert a password-protected PDF, you'll need to remove the password protection first using our 'Unlock PDF' tool, then convert the unlocked PDF to Word."
            },
            {
              question: "How accurate is the conversion for scanned PDFs?",
              answer: "Our converter uses advanced OCR (Optical Character Recognition) to extract text from scanned PDFs. The accuracy depends on the quality of the scan, but typically achieves 95-99% accuracy for clear, high-resolution scans."
            }
          ]
        };
      
      case "word-to-pdf":
        return {
          title: "Word to PDF Converter",
          introduction: "Convert Word documents to PDF format instantly with our free online converter.",
          description: "Our Word to PDF converter transforms Microsoft Word documents (DOC, DOCX) into professional-quality PDF files. The conversion preserves all formatting, fonts, images, and layouts from your original document. Use this tool to create universally compatible PDF files from your Word documents for sharing, printing, or archiving, all while maintaining the exact appearance of your original document.",
          howToUse: [
            "Upload your Word document using the file selector",
            "Wait a few seconds for our system to convert your file",
            "Download your newly created PDF file"
          ],
          features: [
            "Preserves all original document formatting",
            "Maintains images, charts, and diagrams",
            "Supports both DOC and DOCX file formats",
            "Keeps all fonts and styling intact",
            "Preserves hyperlinks and bookmarks",
            "Creates searchable PDF documents",
            "Processes files quickly with no watermarks",
            "Secure conversion with privacy protection"
          ],
          faqs: [
            {
              question: "Does the converter work with all versions of Word documents?",
              answer: "Yes, our converter supports all Microsoft Word formats including DOC (Word 97-2003) and DOCX (Word 2007 and later)."
            },
            {
              question: "Will my images and charts be preserved in the PDF?",
              answer: "Yes, all images, charts, graphs, and other visual elements in your Word document will be preserved with their original quality and positioning in the PDF."
            },
            {
              question: "What happens to hyperlinks in my Word document?",
              answer: "All hyperlinks in your Word document will be preserved as clickable links in the generated PDF file, maintaining their original destinations."
            },
            {
              question: "Does this conversion affect the file size?",
              answer: "Generally, PDF files may be slightly smaller or larger than the original Word document depending on content. Our converter optimizes the output for the best balance between quality and file size."
            }
          ]
        };
      
      case "pdf-to-jpg":
        return {
          title: "PDF to JPG Converter",
          introduction: "Convert PDF documents to JPG images online with our free converter.",
          description: "Our PDF to JPG converter transforms each page of your PDF document into high-quality JPG images. Perfect for sharing on social media, including in presentations, or using in situations where image formats are required. This tool extracts images from your PDF with adjustable quality settings, allowing you to balance between image quality and file size according to your needs.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Choose quality settings (if needed)",
            "Process the file and wait for conversion",
            "Download your JPG images individually or as a ZIP archive"
          ],
          features: [
            "Converts each PDF page to a separate JPG image",
            "Maintains original colors and image quality",
            "Adjustable resolution and compression settings",
            "Supports multi-page PDFs with batch conversion",
            "Option to download all images as a ZIP file",
            "Preview of converted images before download",
            "Fast processing even for large documents",
            "No watermarks on converted images"
          ],
          faqs: [
            {
              question: "What resolution will the JPG images have?",
              answer: "By default, our converter produces high-resolution JPG images at 300 DPI. You can adjust the quality settings to increase or decrease the resolution based on your needs."
            },
            {
              question: "Can I convert only specific pages from my PDF?",
              answer: "Yes, our tool allows you to select specific pages or page ranges to convert instead of processing the entire document."
            },
            {
              question: "How good is the quality of the converted images?",
              answer: "The image quality depends on the quality setting you choose. At high quality (100%), the JPG images will look identical to the original PDF pages with minimal compression artifacts."
            },
            {
              question: "Is there a limit to the number of pages I can convert?",
              answer: "Our free tool supports PDFs with up to 100 pages. For larger documents, you may need to split the PDF first or process it in sections."
            }
          ]
        };
      
      case "jpg-to-pdf":
        return {
          title: "JPG to PDF Converter",
          introduction: "Convert JPG images to PDF documents online with our free converter.",
          description: "Our JPG to PDF converter allows you to create PDF documents from one or multiple JPG images. Perfect for creating documents from scanned pages, photographs, or any image files you need in PDF format. Customize page size, orientation, and margins to create professional-looking PDFs from your JPG images with just a few clicks.",
          howToUse: [
            "Upload one or multiple JPG images",
            "Arrange the images in the desired order",
            "Select page size and orientation (optional)",
            "Click 'Convert to PDF' to process the images",
            "Download your newly created PDF document"
          ],
          features: [
            "Supports single or multiple JPG image conversion",
            "Maintains original image quality",
            "Customizable page size (A4, Letter, etc.)",
            "Portrait or landscape orientation options",
            "Adjustable page margins and image positioning",
            "Option to add text elements or watermarks",
            "Merge multiple images into a single PDF document",
            "Fast processing with preview capability"
          ],
          faqs: [
            {
              question: "Can I convert multiple JPG images to a single PDF?",
              answer: "Yes, you can upload multiple JPG images and combine them into a single PDF document. Our tool allows you to arrange the order of the images before conversion."
            },
            {
              question: "What other image formats are supported besides JPG?",
              answer: "While this tool is optimized for JPG/JPEG files, it also supports other common image formats including PNG, BMP, GIF, and TIFF."
            },
            {
              question: "Can I control the size of the PDF file?",
              answer: "Yes, you can adjust the quality settings to balance between image quality and file size. Lower quality settings will produce smaller PDF files, while higher settings preserve more detail but result in larger files."
            },
            {
              question: "What's the maximum number of images I can convert at once?",
              answer: "Our free tool supports up to 20 images per conversion. For larger batches, you may need to process them in multiple sessions."
            }
          ]
        };
      
      case "merge-pdf":
        return {
          title: "Merge PDF Files",
          introduction: "Combine multiple PDF files into a single document with our free PDF merger.",
          description: "Our PDF Merger tool allows you to combine multiple PDF files into a single document in your preferred order. Whether you need to join chapters of a book, consolidate reports, or create a comprehensive document from multiple sources, our tool makes it simple. Arrange your files in any order, preview the merged document, and download the result with just a few clicks—all without compromising quality or security.",
          howToUse: [
            "Upload two or more PDF files using the file selector",
            "Arrange the files in your desired order by dragging and dropping",
            "Click the 'Merge PDFs' button to combine the files",
            "Download your merged PDF document when processing is complete"
          ],
          features: [
            "Combine unlimited PDF files into one document",
            "Drag-and-drop interface for easy file ordering",
            "Preview of all PDF files before merging",
            "Maintains original formatting and quality",
            "Option to delete or rotate specific pages",
            "Bookmark preservation for easy navigation",
            "Fast processing even for large documents",
            "Secure processing with no data retention"
          ],
          faqs: [
            {
              question: "Is there a limit to how many PDF files I can merge?",
              answer: "Our free tool allows you to merge up to 20 PDF files at once. For larger projects, you can merge documents in batches and then combine those batches."
            },
            {
              question: "Will bookmarks and links be preserved in the merged PDF?",
              answer: "Yes, our merger preserves bookmarks from the original PDF files and adjusts their positions to work correctly in the merged document. Internal links within each document will continue to function."
            },
            {
              question: "Can I merge password-protected PDF files?",
              answer: "To merge password-protected PDFs, you'll need to unlock them first using our 'Unlock PDF' tool, then use the unprotected files in the Merge tool."
            },
            {
              question: "Does merging PDFs affect the quality of the documents?",
              answer: "No, our PDF Merger maintains the original quality, resolution, and formatting of all merged documents. There is no quality loss during the merging process."
            }
          ]
        };
      
      case "compress-pdf":
        return {
          title: "Compress PDF",
          introduction: "Reduce PDF file size without losing quality with our free compression tool.",
          description: "Our PDF Compressor reduces file size while maintaining document quality and readability. Ideal for sharing via email, uploading to websites, or saving storage space. Choose from different compression levels to balance between file size and quality, preview the results, and download your optimized PDF in seconds. Our intelligent compression algorithm identifies and optimizes images, removes redundant information, and streamlines the document structure.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Select your preferred compression level (strong, medium, or light)",
            "Click 'Compress PDF' and wait a few seconds",
            "Preview the compressed PDF and check the size reduction",
            "Download your optimized PDF file"
          ],
          features: [
            "Smart compression that maintains document quality",
            "Multiple compression level options",
            "Preview before downloading",
            "Batch compression for multiple files",
            "Size reduction up to 90% for image-heavy PDFs",
            "Maintains text sharpness and readability",
            "Original and compressed size comparison",
            "No visible quality loss for most documents"
          ],
          faqs: [
            {
              question: "How much can I expect to reduce my PDF file size?",
              answer: "Compression rates vary depending on the content of your PDF. Image-heavy documents may see reductions of 70-90%, while text-based documents typically achieve 20-50% reduction."
            },
            {
              question: "Will compressing affect the quality of my document?",
              answer: "Our default compression settings balance size reduction and quality preservation. Text and vector elements remain crisp and clear, while images are intelligently compressed to minimize visible quality loss."
            },
            {
              question: "Is there a file size limit for compression?",
              answer: "Our free tool handles PDF files up to 50MB. For larger files, consider breaking them into smaller sections or compressing them at strong settings."
            },
            {
              question: "Can I compress PDF forms with fillable fields?",
              answer: "Yes, our compression maintains interactive elements like form fields, hyperlinks, and buttons. You can compress fillable PDF forms without losing their functionality."
            }
          ]
        };
      
      case "rotate-pdf":
        return {
          title: "Rotate PDF",
          introduction: "Rotate PDF pages to the correct orientation with our free online tool.",
          description: "Our PDF Rotation tool allows you to fix pages that are upside down or sideways. Rotate individual pages or the entire document by 90, 180, or 270 degrees in either direction. Preview the rotated PDF before downloading to ensure all pages are properly oriented. Perfect for fixing scanned documents, presentations, or any PDF with incorrect page orientation.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Select individual pages or the entire document",
            "Choose the rotation angle (90°, 180°, or 270°)",
            "Click 'Rotate PDF' to process your document",
            "Preview the rotated pages and download the result"
          ],
          features: [
            "Rotate all pages or select specific pages",
            "90°, 180°, and 270° rotation options",
            "Clockwise and counterclockwise rotation",
            "Preview of rotated pages before saving",
            "Maintain PDF quality and metadata",
            "Apply different rotations to different pages",
            "Fast processing with immediate preview",
            "No registration or software installation required"
          ],
          faqs: [
            {
              question: "Can I rotate just specific pages in my PDF?",
              answer: "Yes, our tool allows you to select individual pages or page ranges to rotate, while leaving other pages in their original orientation."
            },
            {
              question: "Will rotating affect the quality of my PDF?",
              answer: "No, rotating pages is a lossless operation that doesn't affect the quality of text, images, or other elements in your PDF document."
            },
            {
              question: "Can I rotate password-protected PDFs?",
              answer: "You'll need to remove password protection using our 'Unlock PDF' tool before rotating the pages. After rotation, you can re-apply password protection if needed."
            },
            {
              question: "What if I don't know which pages need rotation?",
              answer: "Our tool provides a preview of all pages, making it easy to identify which ones need rotation. You can make adjustments incrementally and preview the results before downloading."
            }
          ]
        };
      
      case "unlock-pdf":
        return {
          title: "Unlock PDF",
          introduction: "Remove password protection from PDF files with our free online tool.",
          description: "Our PDF Unlock tool removes password protection from secured PDF documents, allowing you to freely access, edit, print, and share your files. Simply upload your password-protected PDF, enter the correct password, and download the unlocked version. This tool removes restrictions on printing, editing, copying, and other limitations that may have been placed on the document.",
          howToUse: [
            "Upload your password-protected PDF file",
            "Enter the correct password for the document",
            "Click 'Unlock PDF' to remove protection",
            "Download your unlocked PDF file"
          ],
          features: [
            "Removes both user and owner password protection",
            "Eliminates restrictions on printing, editing, and copying",
            "Maintains original document quality and formatting",
            "Fast processing with immediate download",
            "Supports all PDF versions",
            "Works with various encryption methods",
            "No watermarks added to unlocked files",
            "Secure processing with file deletion after completion"
          ],
          faqs: [
            {
              question: "What's the difference between user and owner passwords?",
              answer: "A user password restricts access to open the PDF, while an owner password allows opening but restricts actions like printing, editing, or copying. Our tool can remove both types of protection when the appropriate password is provided."
            },
            {
              question: "Do I need to know the password to unlock my PDF?",
              answer: "Yes, for standard PDF encryption, you must know the password to unlock the document. If you don't know the password, we cannot legally bypass the encryption."
            },
            {
              question: "Will unlocking affect the PDF content or quality?",
              answer: "No, unlocking only removes the encryption and restrictions. All content, formatting, images, and metadata remain exactly the same as in the original document."
            },
            {
              question: "Is this process legal?",
              answer: "Using this tool is legal if you are the rightful owner of the document or have been authorized by the owner to remove the password protection. It should not be used to circumvent legitimate copyright protections."
            }
          ]
        };
      
      case "lock-pdf":
        return {
          title: "Lock PDF",
          introduction: "Add password protection to your PDF files with our free encryption tool.",
          description: "Our PDF Lock tool allows you to secure your sensitive PDF documents with strong encryption. Add password protection to restrict who can open your PDF or set permissions to control whether users can edit, print, or copy content from your document. Create secure financial reports, confidential business proposals, personal documents, or any PDF file that contains sensitive information that you want to protect.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Enter your desired password (use a strong, unique password)",
            "Select restriction options (prevent printing, editing, copying, etc.)",
            "Click 'Protect PDF' to encrypt your document",
            "Download your password-protected PDF file"
          ],
          features: [
            "256-bit AES encryption for maximum security",
            "Set open password (user password) to restrict access",
            "Set permission password (owner password) to limit actions",
            "Control printing, editing, copying, and form-filling permissions",
            "Maintain PDF quality and functionality",
            "Secure processing with privacy protection",
            "Compatible with all standard PDF readers",
            "Free to use with no watermarks"
          ],
          faqs: [
            {
              question: "What encryption method is used to protect the PDF?",
              answer: "We use industry-standard 256-bit AES encryption, which is considered highly secure and is supported by all modern PDF readers including Adobe Acrobat."
            },
            {
              question: "Can I set different passwords for opening and editing?",
              answer: "Yes, you can set a user password (required to open the document) and a separate owner password (to control permissions like printing and editing)."
            },
            {
              question: "What if I forget my password?",
              answer: "There is no backdoor or recovery method if you forget your password. Be sure to store your password in a secure location like a password manager to avoid permanent loss of access."
            },
            {
              question: "Will adding a password affect my PDF's appearance?",
              answer: "No, adding password protection doesn't change the appearance or structure of your PDF. The document will look and function exactly the same, except for any restrictions you've applied."
            }
          ]
        };
      
      case "watermark":
        return {
          title: "Add Watermark to PDF",
          introduction: "Add custom text or image watermarks to your PDF documents.",
          description: "Our PDF Watermark tool allows you to add professional text or image watermarks to your PDF documents. Protect your intellectual property, brand your documents, mark documents as drafts, or add confidentiality notices with customizable watermarks. Control the position, opacity, size, and rotation of your watermarks to perfectly balance visibility and readability of your document content.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Choose between text or image watermark",
            "For text: enter your watermark text and customize font, size, color, and opacity",
            "For image: upload your logo or image and adjust size and opacity",
            "Position the watermark and apply to all or selected pages",
            "Preview and download your watermarked PDF"
          ],
          features: [
            "Text and image watermark options",
            "Customizable font, size, color, and opacity",
            "Diagonal, horizontal, or vertical text orientation",
            "Apply to all pages or selected pages only",
            "Adjustable positioning anywhere on the page",
            "Preview before saving",
            "No quality loss of the original document",
            "Support for logos and transparent images"
          ],
          faqs: [
            {
              question: "Can I use my company logo as a watermark?",
              answer: "Yes, you can upload your company logo or any image as a watermark. For best results, use images with transparency (PNG format) to avoid blocking the document content."
            },
            {
              question: "Is it possible to remove a watermark after adding it?",
              answer: "Once applied and saved, watermarks become part of the document content. While they cannot be easily removed, you can adjust the opacity to make them less intrusive while still visible."
            },
            {
              question: "Can I add different watermarks to different pages?",
              answer: "Yes, our advanced options allow you to apply different watermarks to specific pages or page ranges within your document."
            },
            {
              question: "Will watermarking affect the text searchability of my PDF?",
              answer: "No, adding a watermark doesn't affect the searchability or selectable text in your PDF. All text remains fully searchable and selectable."
            }
          ]
        };
      
      case "powerpoint-to-pdf":
        return {
          title: "PowerPoint to PDF Converter",
          introduction: "Convert PowerPoint presentations to PDF format with our free online converter.",
          description: "Our PowerPoint to PDF converter transforms your PowerPoint presentations (PPT and PPTX) into high-quality PDF documents. Maintain all slides, animations (as static elements), images, charts, and formatting from your original presentation. The PDF format ensures your presentation can be viewed on any device without PowerPoint software, making it perfect for distribution, sharing, or archiving your slideshows.",
          howToUse: [
            "Upload your PowerPoint file (PPT or PPTX)",
            "Wait briefly while we convert your presentation",
            "Download your converted PDF file"
          ],
          features: [
            "Preserves all slides and formatting",
            "Maintains images, charts, and graphics at high quality",
            "Supports both PPT and PPTX formats",
            "Converts animations to static elements",
            "Preserves speaker notes (optional)",
            "Creates bookmarks for easy navigation",
            "Fast processing for large presentations",
            "Secure conversion with no data retention"
          ],
          faqs: [
            {
              question: "Will my animations be preserved in the PDF?",
              answer: "Animations will be converted to static images showing their final state. Dynamic elements like transitions and animations cannot be preserved in PDF format as it doesn't support animation."
            },
            {
              question: "Can I include speaker notes in the converted PDF?",
              answer: "Yes, you can choose to include speaker notes in the conversion. They will appear as additional pages or sections in the PDF document."
            },
            {
              question: "Does the converter maintain hyperlinks?",
              answer: "Yes, all hyperlinks from your original presentation will be preserved as clickable links in the PDF document."
            },
            {
              question: "What's the maximum file size or number of slides?",
              answer: "Our free tool supports presentations up to 50MB or approximately 300 slides. For larger presentations, consider splitting them into multiple files."
            }
          ]
        };
      
      case "excel-to-pdf":
        return {
          title: "Excel to PDF Converter",
          introduction: "Convert Excel spreadsheets to PDF format with our free online converter.",
          description: "Our Excel to PDF converter transforms your Excel spreadsheets (XLS and XLSX) into professional-quality PDF documents. Preserve all formatting, formulas (as values), charts, tables, and images from your original spreadsheet. The conversion maintains column widths, row heights, cell colors, borders, and font styling to ensure your data looks exactly as intended in the resulting PDF.",
          howToUse: [
            "Upload your Excel file (XLS or XLSX)",
            "Select conversion options (full workbook or specific sheets)",
            "Click 'Convert to PDF' and wait briefly",
            "Download your converted PDF file"
          ],
          features: [
            "Preserves all formatting and styling",
            "Maintains charts, tables, and images",
            "Supports both XLS and XLSX formats",
            "Option to convert specific worksheets or entire workbook",
            "Preserves headers and footers",
            "Automatically adjusts page breaks",
            "Handles large spreadsheets efficiently",
            "High-quality output perfect for printing"
          ],
          faqs: [
            {
              question: "Will formulas be preserved in the PDF?",
              answer: "Formulas will be converted to their calculated values in the PDF, as PDF is a static format that doesn't support dynamic calculations."
            },
            {
              question: "How are multiple worksheets handled?",
              answer: "You can choose to convert all worksheets (each as a separate section in the PDF) or select specific worksheets to include in the conversion."
            },
            {
              question: "Can I control page breaks and scaling?",
              answer: "Yes, our advanced options allow you to adjust scaling to fit content to page width, fit entire content to one page, or maintain the exact scale from Excel. You can also respect existing page breaks from Excel."
            },
            {
              question: "What about hidden rows or columns?",
              answer: "By default, hidden rows and columns will remain hidden in the PDF. You can choose to include them in the advanced settings if needed."
            }
          ]
        };
      
      case "split-pdf":
        return {
          title: "Split PDF",
          introduction: "Divide your PDF documents into multiple files with our free splitting tool.",
          description: "Our PDF Split tool allows you to divide large PDF documents into smaller, more manageable files. Extract specific pages, split by chapter, create equal-sized parts, or separate even and odd pages. This tool is perfect for extracting sections from large reports, creating separate documents from scanned pages, or dividing a book into chapters for easier sharing and distribution.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Choose your preferred splitting method:",
            "- Extract specific pages (e.g., 1-5, 8, 11-13)",
            "- Split into equal parts (e.g., every 10 pages)",
            "- Split by top-level bookmarks",
            "- Extract even or odd pages",
            "Click 'Split PDF' to process your document",
            "Download individual files or a ZIP archive of all parts"
          ],
          features: [
            "Multiple splitting methods for different needs",
            "Extract specific pages or page ranges",
            "Split into equal parts with custom page count",
            "Split by bookmarks or chapters",
            "Extract even or odd pages (perfect for double-sided scanning)",
            "Preview all parts before downloading",
            "Download individual parts or all as ZIP",
            "Maintains original quality and formatting"
          ],
          faqs: [
            {
              question: "How do I specify which pages to extract?",
              answer: "Use comma-separated values and hyphens to specify page ranges. For example, '1-5, 8, 11-13' will extract pages 1 through 5, page 8, and pages 11 through 13."
            },
            {
              question: "What happens to bookmarks when splitting a PDF?",
              answer: "When splitting by bookmarks, each resulting PDF will contain the relevant bookmarks for its section. When splitting by other methods, bookmarks pointing to pages within each part will be preserved."
            },
            {
              question: "Can I split a password-protected PDF?",
              answer: "You'll need to remove password protection using our 'Unlock PDF' tool before splitting the document. After splitting, you can reapply password protection to individual parts if needed."
            },
            {
              question: "Is there a limit to how many parts I can split a PDF into?",
              answer: "Our free tool supports splitting into up to 50 separate parts. For documents requiring more divisions, you may need to process them in batches."
            }
          ]
        };
      
      case "delete-pages-from-pdf":
      case "pdf-page-remover":
        return {
          title: "Delete Pages from PDF",
          introduction: "Remove unwanted pages from PDF documents with our free online tool.",
          description: "Our PDF Page Remover allows you to delete unnecessary pages from your PDF files without needing expensive software. Remove blank pages, duplicates, outdated information, or sensitive content before sharing or publishing your document. The tool maintains the quality and formatting of the remaining pages, creating a clean, professional document without the hassle of recreating the entire file.",
          howToUse: [
            "Upload your PDF file using the file selector",
            "Preview all pages in the document",
            "Select the pages you want to delete by clicking on them",
            "Alternatively, specify page numbers to remove (e.g., 3, 5-7, 12)",
            "Click 'Delete Pages' to process your document",
            "Preview the result and download your edited PDF"
          ],
          features: [
            "Visual page selection with thumbnails",
            "Multiple selection methods (individual clicks, ranges, or all)",
            "Preview before and after deletion",
            "Maintain quality and formatting of remaining pages",
            "Remove single pages or page ranges",
            "Fast processing even for large documents",
            "Option to extract deleted pages as a separate PDF",
            "No watermarks on processed documents"
          ],
          faqs: [
            {
              question: "Will removing pages affect the quality of my PDF?",
              answer: "No, removing pages doesn't affect the quality of the remaining pages. All text, images, and formatting will remain exactly as they were in the original document."
            },
            {
              question: "What happens to bookmarks when I remove pages?",
              answer: "Bookmarks pointing to removed pages will be deleted, while those pointing to remaining pages will be adjusted to maintain proper navigation in the new document."
            },
            {
              question: "Can I delete pages from a password-protected PDF?",
              answer: "You'll need to unlock the PDF first using our 'Unlock PDF' tool, then remove the pages. After editing, you can reapply password protection if needed."
            },
            {
              question: "Is there an option to recover deleted pages if I make a mistake?",
              answer: "We recommend downloading both the modified PDF and the extracted pages as a separate document. If you remove pages by mistake, you can merge the documents again using our 'Merge PDF' tool."
            }
          ]
        };

      // Additional tool contents for each PDF tool type
      case "compress-pdf-to-50kb":
      case "compress-pdf-to-100kb":
      case "compress-pdf-to-150kb":
      case "compress-pdf-to-200kb":
      case "compress-pdf-to-300kb":
      case "compress-pdf-to-500kb":
      case "compress-pdf-to-1mb":
      case "compress-pdf-to-2mb":
      case "resize-pdf-to-200kb":
        // Extract target size from slug
        let targetSize = "medium size";
        if (toolSlug.includes("-to-")) {
          const sizeMatch = toolSlug.match(/to-(\d+)(kb|mb)/i);
          if (sizeMatch) {
            const size = sizeMatch[1];
            const unit = sizeMatch[2].toLowerCase();
            targetSize = `${size} ${unit.toUpperCase()}`;
          }
        }
        
        return {
          title: `Compress PDF to ${targetSize}`,
          introduction: `Reduce PDF file size to approximately ${targetSize} with our free compression tool.`,
          description: `Our PDF Compression tool helps you reduce your PDF files to a target size of around ${targetSize}, making them ideal for email attachments, website uploads, or meeting specific file size requirements. The intelligent compression algorithm maintains document quality while optimizing images, removing redundant data, and streamlining content to achieve the target file size.`,
          howToUse: [
            "Upload your PDF file using the file selector",
            "Our system will automatically adjust compression settings to target the required size",
            `Click 'Compress to ${targetSize}' and wait a few seconds`,
            "Preview the compressed PDF and verify the file size",
            "Download your optimized PDF file"
          ],
          features: [
            `Target file size of approximately ${targetSize}`,
            "Smart compression algorithms that balance size and quality",
            "Preview before downloading",
            "Comparison between original and compressed sizes",
            "Maintains readability of text content",
            "Optimizes embedded images efficiently",
            "Fast processing even for large documents",
            "No watermarks or quality limitations"
          ],
          faqs: [
            {
              question: `Can every PDF be compressed to exactly ${targetSize}?`,
              answer: `While our tool targets ${targetSize}, the actual result may vary slightly depending on the content of your PDF. Text-heavy documents may compress more effectively than those with many images or complex graphics.`
            },
            {
              question: "Will the compression affect the quality of my document?",
              answer: "Our compression algorithm intelligently balances quality and size reduction. Text remains crisp and readable, while images are optimized to maintain acceptable visual quality while meeting size targets."
            },
            {
              question: "What types of content compress most effectively?",
              answer: "Text-based content compresses very efficiently with minimal quality loss. Images, especially photographs, will see more visible compression to meet tight size constraints."
            },
            {
              question: "Can I compress password-protected PDFs?",
              answer: "Password-protected PDFs need to be unlocked before compression. Use our 'Unlock PDF' tool first, then compress the document. You can reapply protection afterward if needed."
            }
          ]
        };
      
      case "pdf-to-png":
      case "pdf-to-bmp":
      case "pdf-to-tiff":
      case "pdf-to-svg":
        const imageFormat = toolSlug.split("-").pop().toUpperCase();
        return {
          title: `PDF to ${imageFormat} Converter`,
          introduction: `Convert PDF documents to ${imageFormat} images online with our free converter.`,
          description: `Our PDF to ${imageFormat} converter transforms each page of your PDF document into high-quality ${imageFormat} images. ${imageFormat} format is ideal for ${
            imageFormat === "PNG" ? "transparency and lossless quality" : 
            imageFormat === "BMP" ? "compatibility with legacy systems" :
            imageFormat === "TIFF" ? "high-quality printing and archiving" :
            imageFormat === "SVG" ? "scalable graphics and web use" : "various purposes"
          }. Extract content from your PDF with precise quality settings and download individual images or a complete set.`,
          howToUse: [
            "Upload your PDF file using the file selector",
            "Choose quality settings (if needed)",
            "Process the file and wait for conversion",
            `Download your ${imageFormat} images individually or as a ZIP archive`
          ],
          features: [
            `Converts each PDF page to a separate ${imageFormat} image`,
            "Maintains original colors and image quality",
            "Adjustable resolution and quality settings",
            "Supports multi-page PDFs with batch conversion",
            "Option to download all images as a ZIP file",
            "Preview of converted images before download",
            "Fast processing even for large documents",
            "No watermarks on converted images"
          ],
          faqs: [
            {
              question: `Why choose ${imageFormat} format over other image formats?`,
              answer: imageFormat === "PNG" ? "PNG is ideal when you need transparency and lossless quality. It's perfect for images with text, line art, or areas of solid color, and supports transparency for overlays." : 
                      imageFormat === "BMP" ? "BMP provides raw, uncompressed image data, ensuring maximum quality and compatibility with legacy systems and specialized software that requires raw bitmap data." :
                      imageFormat === "TIFF" ? "TIFF is excellent for high-quality printing, professional publishing, and archiving. It supports various color modes and compression methods while maintaining quality." :
                      imageFormat === "SVG" ? "SVG creates scalable vector graphics that can be resized without quality loss, making them perfect for web use, logos, and graphics that need to display well at any size." : 
                      "This format has specific advantages for your particular use case."
            },
            {
              question: "What resolution will the images have?",
              answer: `By default, our converter produces high-resolution ${imageFormat} images at 300 DPI. You can adjust the resolution settings based on your specific needs for quality and file size.`
            },
            {
              question: "Can I convert only specific pages from my PDF?",
              answer: "Yes, our tool allows you to select specific pages or page ranges to convert instead of processing the entire document."
            },
            {
              question: "Is there a limit to the number of pages I can convert?",
              answer: "Our free tool supports PDFs with up to 100 pages. For larger documents, you may need to split the PDF first or process it in sections."
            }
          ]
        };
      
      case "png-to-pdf":
      case "bmp-to-pdf":
      case "tiff-to-pdf":
      case "svg-to-pdf":
      case "gif-to-pdf":
        const sourceFormat = toolSlug.split("-to-")[0].toUpperCase();
        return {
          title: `${sourceFormat} to PDF Converter`,
          introduction: `Convert ${sourceFormat} images to PDF documents online with our free converter.`,
          description: `Our ${sourceFormat} to PDF converter allows you to create professional PDF documents from your ${sourceFormat} image files. Perfect for converting diagrams, charts, artwork, or any ${sourceFormat} images into document format for easier sharing and viewing. Customize page size, orientation, and margins to create high-quality PDFs that preserve the original image quality.`,
          howToUse: [
            `Upload one or multiple ${sourceFormat} images`,
            "Arrange the images in the desired order (for multiple images)",
            "Select page size and orientation (optional)",
            "Click 'Convert to PDF' to process the images",
            "Download your newly created PDF document"
          ],
          features: [
            `Supports single or multiple ${sourceFormat} image conversion`,
            "Maintains original image quality and properties",
            "Customizable page size (A4, Letter, etc.)",
            "Portrait or landscape orientation options",
            "Adjustable page margins and image positioning",
            "Option to add text elements or watermarks",
            "Merge multiple images into a single PDF document",
            "Fast processing with preview capability"
          ],
          faqs: [
            {
              question: `What are the advantages of converting ${sourceFormat} to PDF?`,
              answer: `Converting ${sourceFormat} to PDF makes your images easier to share, view, and print across different devices and platforms. PDFs have universal compatibility and can combine multiple ${sourceFormat} images into a single, organized document.`
            },
            {
              question: `Can I convert multiple ${sourceFormat} images to a single PDF?`,
              answer: `Yes, you can upload multiple ${sourceFormat} images and combine them into a single PDF document. Our tool allows you to arrange the order of the images before conversion.`
            },
            {
              question: "Can I control the quality of the PDF file?",
              answer: `Yes, you can adjust the quality settings to balance between image fidelity and file size. Our default settings preserve the original ${sourceFormat} quality while optimizing for reasonable file sizes.`
            },
            {
              question: `What's the maximum file size for ${sourceFormat} images?`,
              answer: "Our free tool supports image files up to 50MB each, with a total upload limit of 100MB for multiple images. Larger images may need to be processed individually."
            }
          ]
        };
      
      case "pdf-to-zip":
        return {
          title: "PDF to ZIP Converter",
          introduction: "Convert and compress PDF files to ZIP format with our free online tool.",
          description: "Our PDF to ZIP converter allows you to compress PDF files into the ZIP archive format, significantly reducing file size for easier storage and sharing. This tool is ideal for archiving PDF documents, compressing multiple PDFs into a single file, or reducing the file size for email attachments. The ZIP format maintains the complete quality and functionality of your original PDFs while providing substantial space savings.",
          howToUse: [
            "Upload one or more PDF files using the file selector",
            "Select compression level (optional)",
            "Click 'Convert to ZIP' to process the files",
            "Download the compressed ZIP archive"
          ],
          features: [
            "Compress PDF files without quality loss",
            "Support for multiple PDF files in one operation",
            "Adjustable compression levels",
            "Password protection option for ZIP archives",
            "Significant file size reduction",
            "Fast processing with immediate download",
            "Secure conversion process",
            "No limits on file quantity (within size limits)"
          ],
          faqs: [
            {
              question: "How much smaller will the ZIP file be?",
              answer: "ZIP compression typically reduces PDF file size by 10-20%. The exact reduction depends on the content of your PDF - documents with many images may see less compression than text-heavy PDFs."
            },
            {
              question: "Can I protect the ZIP file with a password?",
              answer: "Yes, our tool offers optional password protection for your ZIP archives. This adds an extra layer of security during storage or transmission of sensitive documents."
            },
            {
              question: "Will the PDF quality be affected?",
              answer: "No, ZIP is a lossless compression format that doesn't affect the quality or content of your PDF files. Once extracted, the PDFs will be identical to the originals."
            },
            {
              question: "Is there a file size limit?",
              answer: "Our free tool supports PDF files up to 100MB total. For larger collections, you may need to process them in batches."
            }
          ]
        };
      
      case "remove-password-from-pdf":
        return {
          title: "Remove Password from PDF",
          introduction: "Remove password protection from PDF files with our free online tool.",
          description: "Our 'Remove Password from PDF' tool unlocks password-protected PDF documents, allowing unrestricted access for editing, printing, and copying. Eliminate encryption and restrictions with a simple process - just upload your PDF, enter the current password, and download the unprotected version. The tool maintains the original quality and formatting while removing all security limitations.",
          howToUse: [
            "Upload your password-protected PDF file",
            "Enter the correct password for the document",
            "Click 'Remove Password' to eliminate protection",
            "Download your unlocked PDF file"
          ],
          features: [
            "Removes both user and owner password protection",
            "Eliminates restrictions on printing, editing, and copying",
            "Maintains original document quality and formatting",
            "Fast processing with immediate download",
            "Supports all PDF versions and encryption methods",
            "Works with 40-bit and 128-bit encryption",
            "No watermarks added to unlocked files",
            "Secure processing with file deletion after completion"
          ],
          faqs: [
            {
              question: "What types of PDF protection can this tool remove?",
              answer: "Our tool can remove both open passwords (required to view the document) and permission passwords (that restrict editing, printing, or copying) as long as you have the correct password."
            },
            {
              question: "Do I need to know the password to unlock my PDF?",
              answer: "Yes, you must know the correct password to remove protection. This tool doesn't circumvent or crack passwords, which would be illegal and unethical."
            },
            {
              question: "Will removing the password affect my PDF content?",
              answer: "No, removing password protection doesn't alter any content, formatting, or quality of your PDF. It only removes the encryption and restrictions while keeping everything else identical."
            },
            {
              question: "Is this process legal?",
              answer: "Using this tool is legal when you're the rightful owner of the document or have permission from the owner to remove the password. It should not be used to access or modify documents you don't have rights to."
            }
          ]
        };
        
      default:
        // Generic PDF tool content
        return {
          title: "PDF Tools",
          introduction: "Professional PDF tools for all your document needs.",
          description: "Our comprehensive suite of PDF tools helps you manage, modify, and optimize your PDF documents. Convert between formats, compress large files, merge multiple documents, add protection, and perform other essential PDF operations all in one place. These powerful, user-friendly tools eliminate the need for expensive desktop software while providing professional-grade results.",
          howToUse: [
            "Select the specific tool you need for your task",
            "Upload your PDF file(s) using the file selector",
            "Configure any necessary options or settings",
            "Process your document and preview the results",
            "Download the modified PDF file"
          ],
          features: [
            "Comprehensive suite of PDF manipulation tools",
            "High-quality processing that maintains document integrity",
            "Fast and efficient operation even with large files",
            "Secure handling of your documents",
            "Intuitive interface with clear instructions",
            "Preview capabilities before downloading",
            "No registration or software installation required",
            "Compatible with all standard PDF formats"
          ],
          faqs: [
            {
              question: "Are these tools free to use?",
              answer: "Yes, our basic PDF tools are completely free to use. We offer premium features for users who need additional capabilities or batch processing."
            },
            {
              question: "Is my data secure when using these tools?",
              answer: "Yes, we take data security seriously. Your files are processed securely, not stored permanently, and automatically deleted after processing. We never access the content of your documents."
            },
            {
              question: "What's the maximum file size I can process?",
              answer: "Our free tools support PDF files up to 50MB. For larger files, try using our compression tool first to reduce the size, or consider our premium options."
            },
            {
              question: "Do I need to install any software?",
              answer: "No, all our PDF tools are web-based and work directly in your browser. There's no need to download or install any software on your computer."
            }
          ]
        };
    }
  };

  const toolContent = getToolContent(toolSlug);

  const renderInterface = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleProcessFile} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdfFile" className="block mb-2">
                    Select PDF file
                  </Label>
                  <Input
                    id="pdfFile"
                    type="file"
                    accept={toolSlug.startsWith("pdf-to") ? ".pdf" : 
                           toolSlug === "word-to-pdf" ? ".doc,.docx" :
                           toolSlug === "powerpoint-to-pdf" ? ".ppt,.pptx" :
                           toolSlug === "excel-to-pdf" ? ".xls,.xlsx" :
                           toolSlug.endsWith("-to-pdf") ? `.${toolSlug.split("-to-")[0]}` :
                           ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {file.name} ({getFileSize(file.size)})
                    </p>
                  )}
                </div>

                {/* Additional fields based on tool type */}
                {toolSlug === "merge-pdf" && (
                  <div>
                    <Label htmlFor="secondaryFile" className="block mb-2">
                      Select second PDF file to merge
                    </Label>
                    <Input
                      id="secondaryFile"
                      type="file"
                      accept=".pdf"
                      onChange={handleSecondaryFileChange}
                      className="cursor-pointer"
                    />
                    {secondaryFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {secondaryFile.name} ({getFileSize(secondaryFile.size)})
                      </p>
                    )}
                  </div>
                )}

                {(toolSlug === "unlock-pdf" || toolSlug === "remove-password-from-pdf") && (
                  <div>
                    <Label htmlFor="pdfPassword" className="block mb-2">
                      PDF Password
                    </Label>
                    <Input
                      id="pdfPassword"
                      type="password"
                      placeholder="Enter password to unlock PDF"
                      value={options.password}
                      onChange={(e) => setOptions({...options, password: e.target.value})}
                    />
                  </div>
                )}

                {toolSlug === "lock-pdf" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pdfPassword" className="block mb-2">
                        Set Password
                      </Label>
                      <Input
                        id="pdfPassword"
                        type="password"
                        placeholder="Create a strong password"
                        value={options.password}
                        onChange={(e) => setOptions({...options, password: e.target.value})}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Use a strong, unique password with at least 8 characters including letters, numbers, and symbols
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="block">Protection Options</Label>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Checkbox 
                            id="preventPrinting" 
                            checked={options.protectionType === 'printing'}
                            onCheckedChange={() => setOptions({...options, protectionType: 'printing'})}
                          />
                          <Label htmlFor="preventPrinting" className="ml-2 text-sm">
                            Prevent printing
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="preventEditing" 
                            checked={options.protectionType === 'editing'} 
                            onCheckedChange={() => setOptions({...options, protectionType: 'editing'})}
                          />
                          <Label htmlFor="preventEditing" className="ml-2 text-sm">
                            Prevent editing
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="preventCopying" 
                            checked={options.protectionType === 'copying'} 
                            onCheckedChange={() => setOptions({...options, protectionType: 'copying'})}
                          />
                          <Label htmlFor="preventCopying" className="ml-2 text-sm">
                            Prevent content copying
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {toolSlug === "watermark" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="watermarkText" className="block mb-2">
                        Watermark Text
                      </Label>
                      <Input
                        id="watermarkText"
                        placeholder="Enter watermark text (e.g., Confidential, Draft)"
                        value={options.watermarkText}
                        onChange={(e) => setOptions({...options, watermarkText: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="watermarkColor" className="block mb-2">
                        Watermark Color
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="watermarkColor"
                          type="color"
                          value={options.watermarkColor}
                          onChange={(e) => setOptions({...options, watermarkColor: e.target.value})}
                          className="w-14 h-8 p-1"
                        />
                        <span className="text-sm text-gray-600">{options.watermarkColor}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="watermarkOpacity" className="block mb-2">
                        Opacity: {options.watermarkOpacity}%
                      </Label>
                      <Slider
                        id="watermarkOpacity"
                        min={10}
                        max={100}
                        step={5}
                        defaultValue={[options.watermarkOpacity]}
                        onValueChange={(value) => setOptions({...options, watermarkOpacity: value[0]})}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {toolSlug === "rotate-pdf" && (
                  <div className="space-y-4">
                    <Label className="block">Rotation Angle</Label>
                    <div className="flex items-center space-x-4 justify-center">
                      <Button
                        type="button"
                        variant={options.rotation === 90 ? "default" : "outline"}
                        onClick={() => setOptions({...options, rotation: 90})}
                        className="flex-1"
                      >
                        Rotate 90° ↻
                      </Button>
                      <Button
                        type="button"
                        variant={options.rotation === 180 ? "default" : "outline"}
                        onClick={() => setOptions({...options, rotation: 180})}
                        className="flex-1"
                      >
                        Rotate 180° ↻
                      </Button>
                      <Button
                        type="button"
                        variant={options.rotation === 270 ? "default" : "outline"}
                        onClick={() => setOptions({...options, rotation: 270})}
                        className="flex-1"
                      >
                        Rotate 270° ↻
                      </Button>
                    </div>
                  </div>
                )}

                {(toolSlug === "compress-pdf" || toolSlug.includes("compress-pdf-to") || toolSlug.includes("resize-pdf-to")) && (
                  <div className="space-y-4">
                    {!toolSlug.includes("-to-") && (
                      <>
                        <Label htmlFor="compressionLevel" className="block mb-2">
                          Compression Level: {options.quality}%
                        </Label>
                        <Slider
                          id="compressionLevel"
                          min={1}
                          max={100}
                          step={1}
                          defaultValue={[options.quality]}
                          onValueChange={(value) => setOptions({...options, quality: value[0]})}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Higher Compression</span>
                          <span>Higher Quality</span>
                        </div>
                      </>
                    )}
                    
                    {toolSlug.includes("-to-") && (
                      <Alert>
                        <AlertDescription>
                          Optimizing to target size of approximately {
                            toolSlug.includes("mb") ? 
                            toolSlug.match(/(\d+)mb/i)[1] + " MB" : 
                            toolSlug.match(/(\d+)kb/i)[1] + " KB"
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {(toolSlug === "split-pdf" || toolSlug === "delete-pages-from-pdf" || toolSlug === "pdf-page-remover") && (
                  <div>
                    <Label htmlFor="pageRanges" className="block mb-2">
                      {toolSlug === "split-pdf" ? "Page Ranges (e.g., 1-3, 5, 7-9)" : "Pages to Remove (e.g., 2, 4-6)"}
                    </Label>
                    <Input
                      id="pageRanges"
                      placeholder={toolSlug === "split-pdf" ? "e.g., 1-3, 5, 7-9" : "e.g., 2, 4-6"}
                      value={options.pageRanges}
                      onChange={(e) => setOptions({...options, pageRanges: e.target.value})}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {toolSlug === "split-pdf" ? 
                        "Enter page ranges to extract or leave empty to split into individual pages." : 
                        "Enter the page numbers you want to remove from the document."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading || !file} className="w-full md:w-auto">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Process ${file ? file.name : "File"}`
              )}
            </Button>
          </div>
        </form>

        {/* Results Display */}
        {result && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Processed Result</h3>
              
              {/* Conversion result display */}
              {result.convertedFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{result.convertedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {getFileSize(result.convertedFile.size)} • {result.convertedFile.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                      <Button>
                        <i className="fas fa-download mr-2"></i> Download
                      </Button>
                    </div>
                  </div>
                  
                  {result.preview && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Preview</span>
                        <span className="text-sm text-gray-600">
                          Page {result.preview.currentPage} of {result.preview.pageCount}
                        </span>
                      </div>
                      <div className="p-4">
                        <img 
                          src={result.preview.imageUrl} 
                          alt="Document Preview" 
                          className="max-w-full h-auto mx-auto border shadow-sm" 
                        />
                      </div>
                      {result.preview.pageCount > 1 && (
                        <div className="bg-gray-100 p-2 flex justify-center space-x-2">
                          <Button variant="outline" size="sm" disabled={result.preview.currentPage === 1}>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm" disabled={result.preview.currentPage === result.preview.pageCount}>
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Compressed file result */}
              {result.compressedFile && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:w-1/2 bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Original Size</p>
                      <p className="text-xl font-semibold">{getFileSize(result.compressedFile.originalSize)}</p>
                    </div>
                    <div className="hidden sm:block">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="w-full sm:w-1/2 bg-green-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Compressed Size</p>
                      <p className="text-xl font-semibold">{getFileSize(result.compressedFile.newSize)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Size Reduction: {result.compressedFile.compressionRatio.toFixed(1)}%</span>
                      <span className="text-sm text-green-600">Saved {getFileSize(result.compressedFile.originalSize - result.compressedFile.newSize)}</span>
                    </div>
                    <Progress value={result.compressedFile.compressionRatio} className="h-2" />
                  </div>
                  
                  <div className="flex justify-center">
                    <Button>
                      <i className="fas fa-download mr-2"></i> Download Compressed PDF
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Merged file result */}
              {result.mergedFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{result.mergedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {getFileSize(result.mergedFile.size)} • {result.mergedFile.pageCount} pages
                        </p>
                      </div>
                      <Button>
                        <i className="fas fa-download mr-2"></i> Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                    <p className="font-medium">Success!</p>
                    <p>Your PDF files have been successfully merged into a single document with {result.mergedFile.pageCount} pages.</p>
                  </div>
                </div>
              )}
              
              {/* Split results */}
              {result.splitResults && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                    <p className="font-medium">Success!</p>
                    <p>Your PDF has been split into {result.splitResults.length} separate files.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {result.splitResults.map((part, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-sm text-gray-600">
                              {getFileSize(part.size)} • Pages {part.pageRange}
                            </p>
                          </div>
                          <Button size="sm">
                            <i className="fas fa-download mr-2"></i> Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Button variant="outline">
                      <i className="fas fa-file-archive mr-2"></i> Download All as ZIP
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Protection result */}
              {result.protectionResult && (
                <div className="space-y-4">
                  <div className={`p-4 ${result.protectionResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} rounded-lg`}>
                    <p className="font-medium">{result.protectionResult.success ? 'Success!' : 'Error'}</p>
                    <p>{result.protectionResult.message}</p>
                  </div>
                  
                  {result.protectionResult.success && result.protectionResult.url && (
                    <div className="flex justify-center">
                      <Button>
                        <i className="fas fa-download mr-2"></i> Download {toolSlug.includes("unlock") ? "Unlocked" : "Protected"} PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Watermarked file result */}
              {result.watermarkedFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{result.watermarkedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          Watermark applied: "{options.watermarkText}"
                        </p>
                      </div>
                      <Button>
                        <i className="fas fa-download mr-2"></i> Download
                      </Button>
                    </div>
                  </div>
                  
                  {result.preview && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Preview with Watermark</span>
                        <span className="text-sm text-gray-600">
                          Page {result.preview.currentPage} of {result.preview.pageCount}
                        </span>
                      </div>
                      <div className="p-4 relative">
                        <img 
                          src={result.preview.imageUrl} 
                          alt="Watermarked Document Preview" 
                          className="max-w-full h-auto mx-auto border shadow-sm" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="transform rotate-45 text-2xl font-bold opacity-30" style={{color: options.watermarkColor}}>
                            {options.watermarkText}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Rotated file result */}
              {result.rotatedFile && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{result.rotatedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          Rotated {result.rotatedFile.degrees}° {result.rotatedFile.degrees === 180 ? "" : result.rotatedFile.degrees === 90 ? "clockwise" : "counterclockwise"}
                        </p>
                      </div>
                      <Button>
                        <i className="fas fa-download mr-2"></i> Download
                      </Button>
                    </div>
                  </div>
                  
                  {result.preview && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rotated Preview</span>
                        <span className="text-sm text-gray-600">
                          Page {result.preview.currentPage} of {result.preview.pageCount}
                        </span>
                      </div>
                      <div className="p-4">
                        <img 
                          src={result.preview.imageUrl} 
                          alt="Rotated Document Preview" 
                          className={`max-w-full h-auto mx-auto border shadow-sm transform ${
                            result.rotatedFile.degrees === 90 ? 'rotate-90' : 
                            result.rotatedFile.degrees === 180 ? 'rotate-180' : 
                            'rotate-270'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <ToolPageTemplate
      toolSlug={toolSlug}
      toolContent={
        <ToolContentTemplate
          introduction={toolContent.introduction}
          description={toolContent.description}
          howToUse={toolContent.howToUse}
          features={toolContent.features}
          faqs={toolContent.faqs}
          toolInterface={renderInterface()}
        />
      }
    />
  );
};

export default PDFToolsDetailed;