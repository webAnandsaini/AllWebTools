import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ImageToolConfig {
  title: string;
  slug: string;
  description: string;
  introduction: string;
  howToUse: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
  supportedFormats: string[];
  maxFileSize: number;
  options?: {
    hasQualitySlider?: boolean;
    hasSizeSlider?: boolean;
    hasDimensionInputs?: boolean;
    hasCropOptions?: boolean;
    hasColorPicker?: boolean;
    hasTargetSize?: boolean;
    hasConversionOptions?: boolean;
  };
}

const ImageToolsDetailed: React.FC = () => {
  const [location] = useLocation();
  const [toolType, setToolType] = useState<string>("generic");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [outputFileUrl, setOutputFileUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [config, setConfig] = useState<ImageToolConfig | null>(null);
  
  // Image options states
  const [quality, setQuality] = useState<number>(80);
  const [targetSize, setTargetSize] = useState<number>(100);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [convertTo, setConvertTo] = useState<string>("jpg");
  const [cropOptions, setCropOptions] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [colorValue, setColorValue] = useState<string>("#FFFFFF");
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 255, b: 255 });
  const [targetUnit, setTargetUnit] = useState<"kb" | "mb">("kb");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Set the tool type based on the current URL
  useEffect(() => {
    const currentPath = location.toLowerCase();
    
    if (currentPath.includes("reverse-image-search")) {
      setToolType("reverse-image-search");
    } else if (currentPath.includes("face-search")) {
      setToolType("face-search");
    } else if (currentPath.includes("image-compressor")) {
      setToolType("image-compressor");
    } else if (currentPath.includes("favicon-generator")) {
      setToolType("favicon-generator");
    } else if (currentPath.includes("video-to-gif")) {
      setToolType("video-to-gif");
    } else if (currentPath.includes("image-resizer")) {
      setToolType("image-resizer");
    } else if (currentPath.includes("photo-resizer-in-kb")) {
      setToolType("photo-resizer-in-kb");
    } else if (currentPath.includes("crop-image")) {
      setToolType("crop-image");
    } else if (currentPath.includes("convert-to-jpg")) {
      setToolType("convert-to-jpg");
    } else if (currentPath.includes("rgb-to-hex")) {
      setToolType("rgb-to-hex");
    } else if (currentPath.includes("png-to-jpg")) {
      setToolType("png-to-jpg");
    } else if (currentPath.includes("jpg-to-png")) {
      setToolType("jpg-to-png");
    } else if (currentPath.includes("compress-image-to-50kb")) {
      setToolType("compress-image-to-50kb");
      setTargetSize(50);
    } else if (currentPath.includes("compress-image-to-20kb")) {
      setToolType("compress-image-to-20kb");
      setTargetSize(20);
    } else if (currentPath.includes("compress-jpeg-to-100kb")) {
      setToolType("compress-jpeg-to-100kb");
      setTargetSize(100);
    } else if (currentPath.includes("compress-jpeg-to-200kb")) {
      setToolType("compress-jpeg-to-200kb");
      setTargetSize(200);
    } else if (currentPath.includes("compress-jpg")) {
      setToolType("compress-jpg");
    } else if (currentPath.includes("resize-image-to-50kb")) {
      setToolType("resize-image-to-50kb");
      setTargetSize(50);
    } else if (currentPath.includes("resize-image-to-100kb")) {
      setToolType("resize-image-to-100kb");
      setTargetSize(100);
    } else if (currentPath.includes("resize-image-to-20kb")) {
      setToolType("resize-image-to-20kb");
      setTargetSize(20);
    } else if (currentPath.includes("reduce-image-size-in-kb")) {
      setToolType("reduce-image-size-in-kb");
    } else if (currentPath.includes("compress-image-to-10kb")) {
      setToolType("compress-image-to-10kb");
      setTargetSize(10);
    } else if (currentPath.includes("compress-jpeg-to-30kb")) {
      setToolType("compress-jpeg-to-30kb");
      setTargetSize(30);
    } else if (currentPath.includes("compress-image-to-1mb")) {
      setToolType("compress-image-to-1mb");
      setTargetSize(1024);
      setTargetUnit("mb");
    } else if (currentPath.includes("mb-to-kb-converter")) {
      setToolType("mb-to-kb-converter");
    } else if (currentPath.includes("mp4-to-gif-converter")) {
      setToolType("mp4-to-gif-converter");
    } else if (currentPath.includes("heic-to-jpg-converter")) {
      setToolType("heic-to-jpg-converter");
    } else if (currentPath.includes("heic-to-png")) {
      setToolType("heic-to-png");
    } else if (currentPath.includes("svg-converter")) {
      setToolType("svg-converter");
    } else if (currentPath.includes("png-to-svg")) {
      setToolType("png-to-svg");
    } else if (currentPath.includes("jpg-to-svg")) {
      setToolType("jpg-to-svg");
    } else if (currentPath.includes("jpeg-to-svg")) {
      setToolType("jpeg-to-svg");
    } else if (currentPath.includes("webp-to-png")) {
      setToolType("webp-to-png");
    } else if (currentPath.includes("svg-to-png")) {
      setToolType("svg-to-png");
    } else if (currentPath.includes("png-to-ico")) {
      setToolType("png-to-ico");
    } else if (currentPath.includes("avif-to-jpg")) {
      setToolType("avif-to-jpg");
    } else if (currentPath.includes("jpeg-optimizer")) {
      setToolType("jpeg-optimizer");
    } else if (currentPath.includes("compress-png")) {
      setToolType("compress-png");
    } else {
      setToolType("image-compressor"); // Default
    }
  }, [location]);

  // Configuration for different image tool types
  useEffect(() => {
    const configurations: { [key: string]: ImageToolConfig } = {
      "reverse-image-search": {
        title: "Reverse Image Search",
        slug: "reverse-image-search",
        description: "Find the source and similar images across the web with our advanced Reverse Image Search tool. Simply upload any image, and our technology will scour the internet to identify matching or visually similar images, helping you discover original sources, higher resolution versions, or related content. This powerful tool is perfect for verifying image authenticity, finding uncredited uses of your work, locating the creator of artwork, or simply discovering more content similar to images you enjoy.",
        introduction: "Discover where an image appears online and find visually similar content with our powerful search technology.",
        howToUse: [
          "Click the 'Upload Image' button and select an image from your device",
          "Wait briefly while our system analyzes your image",
          "Review the results showing visually similar images and their sources",
          "Click on any result to visit the website where the image appears",
          "Use filters to refine results by size, type, or visual similarity"
        ],
        features: [
          "✅ Searches billions of images across the internet for matches",
          "✅ Finds visually similar images even when not exact matches",
          "✅ Provides direct links to websites containing the image",
          "✅ Supports all common image formats (JPG, PNG, WEBP, etc.)",
          "✅ Fast results with powerful image recognition technology"
        ],
        faqs: [
          {
            question: "How accurate is the reverse image search?",
            answer: "Our reverse image search uses advanced computer vision algorithms to find matches and similar images. It's highly accurate for finding exact matches and reasonably good at finding visually similar images. However, results depend on the uniqueness of the image and whether it exists elsewhere online."
          },
          {
            question: "What can I use reverse image search for?",
            answer: "Common uses include: verifying the authenticity of images, finding the original creator of artwork, checking if your photos are being used without permission, finding higher resolution versions of an image, discovering the source of memes or viral images, or finding similar products based on a photo."
          },
          {
            question: "What image formats are supported?",
            answer: "Our tool supports all common image formats including JPEG, PNG, GIF, WEBP, BMP, and TIFF. The maximum file size is 20MB, and for best results, we recommend using clear images with good resolution."
          },
          {
            question: "Why might I not find any matches for my image?",
            answer: "If no matches are found, it could be because: the image doesn't exist elsewhere online, the image has been significantly modified from the original, the image is very recent and hasn't been indexed yet, or the image contains very common visual elements that make it difficult to distinguish from others."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"],
        maxFileSize: 20, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "face-search": {
        title: "Face Search",
        slug: "face-search",
        description: "Identify faces in images and find similar faces across the web with our advanced Face Search tool. This specialized search engine uses cutting-edge facial recognition technology to detect, analyze, and match facial features in uploaded images with those found online. Perfect for finding appearances of specific individuals in media, locating different photos of the same person, or helping to identify unknown individuals in images. Our responsible implementation prioritizes ethical usage and privacy considerations.",
        introduction: "Find similar faces and identify individuals in images with our advanced facial recognition technology.",
        howToUse: [
          "Upload a clear image containing one or more faces",
          "Our system will automatically detect and analyze facial features",
          "Review the search results showing similar faces from across the web",
          "Click on any result to see the full image and source",
          "Use the confidence score to determine the reliability of each match"
        ],
        features: [
          "✅ Advanced facial recognition that works even with partial face visibility",
          "✅ Multi-face detection capabilities for group photos",
          "✅ Search results ranked by similarity confidence score",
          "✅ Works with various image qualities and lighting conditions",
          "✅ Ethical implementation with privacy safeguards"
        ],
        faqs: [
          {
            question: "How accurate is the face recognition technology?",
            answer: "Our face search uses advanced AI technology that can achieve up to 99.9% accuracy in ideal conditions (clear, front-facing images with good lighting). However, accuracy decreases with poor image quality, partial face visibility, unusual angles, or extreme lighting conditions."
          },
          {
            question: "What are the privacy considerations when using this tool?",
            answer: "We've designed this tool with privacy in mind. Images you upload are processed only for the purpose of face detection and search, are not stored permanently, and aren't added to our search database. We encourage responsible use and compliance with applicable privacy regulations and ethical guidelines."
          },
          {
            question: "What factors affect the quality of face search results?",
            answer: "Several factors can impact results, including: image resolution and clarity, lighting conditions, face angle and expression, portion of the face visible, presence of accessories (glasses, hats, makeup), and whether the person appears in publicly accessible online images."
          },
          {
            question: "Can this tool identify unknown people in photos?",
            answer: "This tool can find visually similar faces across the web, but it doesn't have a comprehensive database of identified individuals. It works best for finding other instances of the same face online rather than putting a name to an unknown face. For public figures who appear frequently online, related information may appear in the search results."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 10, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "image-compressor": {
        title: "Image Compressor",
        slug: "image-compressor",
        description: "Reduce file size while maintaining image quality with our powerful Image Compressor. This essential tool uses advanced compression algorithms to significantly decrease the size of your images without noticeable quality loss, making them perfect for websites, email attachments, or storage optimization. Our compressor supports all major image formats, offers customizable compression levels, and processes files quickly and securely right in your browser. Save bandwidth, improve page load times, and optimize storage without sacrificing visual appeal.",
        introduction: "Compress images to a fraction of their original size while preserving quality with our powerful optimization tool.",
        howToUse: [
          "Upload your image by clicking the 'Choose File' button",
          "Select your desired compression level with the quality slider",
          "Preview the compressed result and compare with the original",
          "Download your optimized image",
          "For batch processing, use our premium version to compress multiple files at once"
        ],
        features: [
          "✅ Reduces file size by up to 90% while maintaining visual quality",
          "✅ Supports all major image formats (JPEG, PNG, WEBP, etc.)",
          "✅ Adjustable compression levels to balance size and quality",
          "✅ No watermarks or quality limitations in the free version",
          "✅ Secure processing - all compression happens in your browser"
        ],
        faqs: [
          {
            question: "How much can this tool compress my images?",
            answer: "Compression ratios vary depending on the original image and quality settings, but typically you can expect 50-90% reduction in file size. Photos with lots of details and colors may see less reduction than simpler images. Using the quality slider, you can find the optimal balance between file size and visual quality for your needs."
          },
          {
            question: "Will compressing images affect their quality?",
            answer: "Our compressor uses smart algorithms that prioritize visual quality while reducing file size. At high quality settings (70-90%), the compression is virtually imperceptible to the human eye. At lower settings, some visual artifacts may become noticeable, but the images remain perfectly usable for many purposes. You can preview before downloading to ensure you're satisfied with the results."
          },
          {
            question: "Is there a limit to how many images I can compress?",
            answer: "The free version allows you to compress images one at a time with no daily limit. For bulk compression needs, consider our premium version which offers batch processing of multiple images simultaneously, along with additional features like automated compression workflows."
          },
          {
            question: "Are my images safe when using this tool?",
            answer: "Absolutely. We prioritize your privacy and security. All image processing happens directly in your browser - your images are never uploaded to our servers, ensuring complete privacy. After compression, no copies of your images are retained anywhere."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: true,
          hasConversionOptions: false
        }
      },
      "favicon-generator": {
        title: "Favicon Generator",
        slug: "favicon-generator",
        description: "Create professional favicons for your website with our easy-to-use Favicon Generator. Transform any image into a complete set of favicon files in multiple sizes and formats (ICO, PNG, Apple Touch) to ensure compatibility across all browsers, devices, and operating systems. Our tool automatically optimizes your favicon for perfect display in browser tabs, bookmarks, and home screens. Simply upload your logo or any image, adjust as needed, and download a complete favicon package ready for implementation on your website.",
        introduction: "Create perfect favicons for your website in seconds with our comprehensive favicon generator.",
        howToUse: [
          "Upload your logo or image (square images work best)",
          "Our tool will automatically center and crop if needed",
          "Preview how your favicon will look in browser tabs and bookmarks",
          "Adjust colors and background if desired",
          "Download your complete favicon package with all required sizes and formats"
        ],
        features: [
          "✅ Generates all required favicon formats and sizes for complete browser compatibility",
          "✅ Creates ICO files for classic browsers and PNG files for modern ones",
          "✅ Includes Apple Touch icons for iOS devices and Android home screen icons",
          "✅ Automatically generates the necessary HTML code to add to your website",
          "✅ Options to customize background colors and padding"
        ],
        faqs: [
          {
            question: "What is a favicon and why do I need one?",
            answer: "A favicon is the small icon that appears in browser tabs, bookmarks, and when users add your site to their home screen. It's an essential branding element that helps users identify your site quickly. A professional favicon improves user experience and adds a polished touch to your web presence."
          },
          {
            question: "What makes a good favicon image?",
            answer: "The best favicons are simple, recognizable designs that remain clear at small sizes. Logos, initials, or simple symbols work well. Avoid complex details that will be lost at small sizes. Square images work best, but our tool can crop and center non-square images automatically."
          },
          {
            question: "How do I add the favicon to my website?",
            answer: "After downloading your favicon package, upload all files to your website's root directory. Then copy the HTML code we provide and paste it into the <head> section of your website's HTML. For content management systems like WordPress, you can typically upload the favicon through the customization settings."
          },
          {
            question: "Why do I need multiple favicon sizes and formats?",
            answer: "Different browsers, devices, and operating systems require different favicon formats and sizes. For example, Internet Explorer uses .ico files, while most modern browsers use .png. Mobile devices need larger icons for home screens. Our package ensures your favicon displays correctly everywhere."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "svg"],
        maxFileSize: 5, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: true,
          hasColorPicker: true,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "video-to-gif-converter": {
        title: "Video to GIF Converter",
        slug: "video-to-gif-converter",
        description: "Transform your videos into high-quality, shareable GIFs with our powerful Video to GIF Converter. This versatile tool allows you to convert any video clip into an animated GIF with customizable settings for frame rate, quality, dimensions, and duration. Perfect for creating engaging content for social media, presentations, websites, or messaging apps. Our converter processes your videos securely in your browser, ensuring privacy while delivering optimized GIFs that maintain visual quality with efficient file sizes.",
        introduction: "Convert any video clip into a high-quality, shareable GIF in just seconds with our easy-to-use converter.",
        howToUse: [
          "Upload your video file (MP4, MOV, WEBM, etc.)",
          "Select the portion of the video you want to convert",
          "Adjust settings like dimensions, frame rate, and quality",
          "Preview your GIF before finalizing",
          "Download your animated GIF ready for sharing"
        ],
        features: [
          "✅ Converts videos up to 500MB in size to GIF format",
          "✅ Customizable frame rate, dimensions, and quality settings",
          "✅ Option to trim specific sections of your video",
          "✅ Add custom text captions or watermarks",
          "✅ Optimizes GIFs for the best balance of quality and file size"
        ],
        faqs: [
          {
            question: "What video formats can I convert to GIF?",
            answer: "Our converter supports all common video formats including MP4, MOV, AVI, WEBM, MKV, and more. For best results and fastest processing, we recommend using MP4 files with H.264 encoding."
          },
          {
            question: "How long can my GIF be?",
            answer: "There's no strict duration limit, but we recommend keeping GIFs under 10 seconds for optimal file size and compatibility with most platforms. Longer GIFs will result in larger file sizes, which may be less practical for sharing and may load slowly on websites."
          },
          {
            question: "What's the best resolution for GIFs?",
            answer: "For most web uses, 320-480 pixels wide provides a good balance between quality and file size. Higher resolutions (up to 720p) can be selected for better quality but will result in significantly larger files. Our tool will suggest optimal dimensions based on your source video."
          },
          {
            question: "How do I reduce the file size of my GIF?",
            answer: "To create smaller GIFs, you can: reduce the dimensions, lower the frame rate (10-15 fps works well for most content), shorten the duration, or reduce the color palette. Our tool includes optimization options to help you balance quality and file size based on your needs."
          }
        ],
        supportedFormats: ["mp4", "mov", "avi", "webm", "mkv", "flv"],
        maxFileSize: 500, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "image-resizer": {
        title: "Image Resizer",
        slug: "image-resizer",
        description: "Resize images with precision and quality using our powerful Image Resizer tool. Whether you need to scale images for websites, social media, printing, or any other purpose, our resizer gives you complete control over dimensions while maintaining aspect ratio and visual quality. Resize by exact pixels, percentages, or to fit specific requirements, and preview results in real-time before downloading. Our advanced resizing algorithms preserve sharpness and details even when significantly changing image dimensions, ensuring professional results every time.",
        introduction: "Resize any image to exact dimensions while maintaining quality with our easy-to-use image resizing tool.",
        howToUse: [
          "Upload your image by clicking the 'Choose File' button",
          "Enter your desired width and/or height",
          "Toggle 'Maintain aspect ratio' to prevent distortion (recommended)",
          "Preview your resized image",
          "Download the resized image in your preferred format"
        ],
        features: [
          "✅ Resize by exact dimensions in pixels or percentages",
          "✅ Maintain aspect ratio to prevent image distortion",
          "✅ Smart scaling algorithms that preserve image quality and sharpness",
          "✅ Support for all common image formats (JPG, PNG, WEBP, etc.)",
          "✅ Option to optimize file size while resizing"
        ],
        faqs: [
          {
            question: "Will resizing affect my image quality?",
            answer: "Our resizer uses advanced algorithms to maintain image quality during resizing. When reducing dimensions, some pixel data is necessarily removed, but our tool does this intelligently to preserve visual quality. When enlarging images, there are natural limitations since new detail cannot be created, but our tool maximizes smoothness and clarity."
          },
          {
            question: "What's the difference between resizing and compressing an image?",
            answer: "Resizing changes the dimensions (width and height) of an image and consequently may reduce file size. Compression reduces file size by optimizing how the image data is stored, without changing the dimensions. For best results when you need smaller file sizes, use both: resize to appropriate dimensions, then compress if needed."
          },
          {
            question: "What size should I make my images for different platforms?",
            answer: "Recommended dimensions vary by platform: For websites, general content images are often 1200-1600px wide. For social media, sizes vary (Instagram: 1080x1080px for squares, Facebook cover: 851x315px, etc.). For print, use at least 300 DPI (dots per inch). Our tool includes presets for common platforms to make this easier."
          },
          {
            question: "Why should I maintain aspect ratio?",
            answer: "Maintaining aspect ratio (the proportional relationship between width and height) prevents your image from looking stretched or squished. When you change only the width or height with aspect ratio locked, our tool automatically calculates the other dimension to keep the image proportionally correct. This ensures your resized images look professional and undistorted."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxFileSize: 100, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "photo-resizer-in-kb": {
        title: "Photo Resizer in KB",
        slug: "photo-resizer-in-kb",
        description: "Precisely resize your photos to a specific file size in kilobytes with our specialized Photo Resizer in KB tool. Unlike standard image resizers that only adjust dimensions, this tool intelligently combines dimension scaling and quality optimization to achieve your exact target file size. Perfect for meeting upload requirements on platforms with strict size limits, optimizing images for email attachments, or ensuring consistent file sizes across multiple images. Our advanced algorithms maintain the best possible visual quality while hitting your specified KB target.",
        introduction: "Resize photos to an exact file size in KB while maintaining the best possible quality.",
        howToUse: [
          "Upload your photo (JPG, PNG, or WEBP format)",
          "Specify your target file size in KB",
          "Optionally adjust maximum dimensions if needed",
          "Click 'Resize' to process your image",
          "Download your resized photo that matches your KB requirement"
        ],
        features: [
          "✅ Resizes photos to an exact KB size you specify",
          "✅ Smart algorithm balances dimension scaling and compression",
          "✅ Maintains aspect ratio to prevent distortion",
          "✅ Shows quality preview before downloading",
          "✅ Perfect for meeting upload size requirements on various platforms"
        ],
        faqs: [
          {
            question: "How does resizing to KB work differently than regular resizing?",
            answer: "Regular image resizing just changes dimensions, which may reduce file size but not to a specific target. Our KB resizer uses an intelligent algorithm that combines dimension scaling and compression adjustments to achieve your exact KB target, making it perfect for meeting strict file size requirements."
          },
          {
            question: "Will my resized photo lose quality?",
            answer: "Some quality loss is inevitable when reducing file size, but our algorithm minimizes this by finding the optimal balance between dimension changes and compression. For moderate size reductions, the difference is usually barely noticeable. For more dramatic reductions (e.g., from 5MB to 100KB), some visible quality loss should be expected."
          },
          {
            question: "What's the smallest size I can resize my photo to?",
            answer: "Technically, you can resize to any KB value, but quality degradation becomes more noticeable below certain thresholds. For photos, going below 50-100KB for a full-sized image will typically show noticeable quality loss. The minimum recommended size depends on the original image dimensions and complexity."
          },
          {
            question: "Why would I need to resize an image to a specific KB size?",
            answer: "Many platforms enforce strict file size limits: social media profile pictures, email attachments, CMS uploads, form submissions, etc. Additionally, keeping images at consistent KB sizes helps with web performance optimization, predictable page load times, and managing storage quotas."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 100, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: true,
          hasConversionOptions: false
        }
      },
      "crop-image": {
        title: "Crop Image",
        slug: "crop-image",
        description: "Precisely crop any image with our intuitive Crop Image tool. This essential photo editing utility allows you to select and extract exactly the portion of an image you want, removing unwanted areas and creating perfect compositions. Featuring adjustable crop frames, preset aspect ratios, rotation capabilities, and fine-tuning controls, our tool makes it easy to create perfectly cropped images for any purpose. Whether you're preparing photos for social media, removing distractions from pictures, or creating custom thumbnails, our Image Cropper delivers professional results in seconds.",
        introduction: "Crop images with precision using our intuitive, easy-to-use crop tool with live preview.",
        howToUse: [
          "Upload your image using the 'Choose File' button",
          "Use the drag handles to set your crop area",
          "Select a preset aspect ratio or create a custom one",
          "Use rotation options if needed to straighten the image",
          "Preview and download your perfectly cropped image"
        ],
        features: [
          "✅ Interactive crop interface with real-time preview",
          "✅ Preset aspect ratios for common uses (square, 16:9, 4:3, etc.)",
          "✅ Rotation and straightening capabilities",
          "✅ Fine-tuning controls for precise cropping",
          "✅ Maintains original image quality in the cropped area"
        ],
        faqs: [
          {
            question: "Will cropping reduce my image quality?",
            answer: "No, cropping only removes portions of the image without affecting the quality of the remaining area. The cropped result maintains the same resolution and quality as the original image in the selected area. However, if you crop to a very small section and then enlarge it, quality loss may occur due to the enlargement."
          },
          {
            question: "What aspect ratios should I use for different purposes?",
            answer: "Common aspect ratios include: Square (1:1) for Instagram posts and profile pictures, 16:9 for YouTube thumbnails and widescreen displays, 4:3 for traditional photos, 2:3 for standard portrait photos, 3:2 for landscape photos, and 9:16 for stories on Instagram, Facebook, etc. Our tool includes these presets for convenience."
          },
          {
            question: "Can I crop a specific size in pixels?",
            answer: "Yes, our tool allows you to specify exact pixel dimensions for your crop. This is useful when you need images of specific sizes for websites, profiles, or other applications with strict dimensional requirements. Simply enter the desired width and height in the provided input fields."
          },
          {
            question: "How do I crop a photo to focus on a specific subject?",
            answer: "To focus on a specific subject, upload your image and adjust the crop frame to center around your subject. Use the rule of thirds grid (visible in our crop interface) as a guide—placing your subject at the intersection points of the grid lines often creates a more visually appealing composition."
          }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: true,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "rgb-to-hex": {
        title: "RGB to HEX Color Converter",
        slug: "rgb-to-hex",
        description: "Convert colors between RGB and HEX formats instantly with our RGB to HEX converter. This essential tool for designers and developers allows you to translate RGB color values (Red, Green, Blue) to hexadecimal color codes and vice versa with perfect accuracy. Features include a visual color picker, saved color history, and the ability to adjust colors and see conversions in real-time. Perfect for web design, graphic design, and ensuring color consistency across different platforms and applications.",
        introduction: "Convert between RGB and HEX color formats instantly with our user-friendly color conversion tool.",
        howToUse: [
          "Enter RGB values (0-255) for Red, Green, and Blue",
          "See the HEX color code update instantly",
          "Or enter a HEX code (with or without # prefix) to see RGB values",
          "Use the color picker for visual selection",
          "Copy the converted values with one click"
        ],
        features: [
          "✅ Instant bidirectional conversion between RGB and HEX formats",
          "✅ Visual color picker for intuitive color selection",
          "✅ Color preview showing your selected color",
          "✅ Color history to save and compare multiple colors",
          "✅ Support for RGB, RGBA, HEX, and HEXA (with alpha/transparency)"
        ],
        faqs: [
          {
            question: "What's the difference between RGB and HEX color formats?",
            answer: "RGB (Red, Green, Blue) represents colors using three values from 0-255 for each color channel. For example, rgb(255, 0, 0) is pure red. HEX is a hexadecimal notation that represents the same colors in a format like #FF0000 (also pure red). Both represent the same colors but in different formats—RGB is commonly used in design software while HEX is standard in web development."
          },
          {
            question: "How do I convert colors with transparency/alpha?",
            answer: "For colors with transparency, use the RGBA format which adds an alpha channel (0-1, where 0 is transparent and 1 is opaque). For example, rgba(255, 0, 0, 0.5) is semi-transparent red. In HEX, transparency is added as an additional two-digit value, like #FF0000CC (where CC represents approximately 80% opacity). Our converter handles both formats."
          },
          {
            question: "Why would I need to convert between RGB and HEX?",
            answer: "Conversions are commonly needed when moving between different design environments or coding. Design software like Photoshop often uses RGB, while web development uses HEX in CSS. Ensuring consistent colors across platforms requires converting between these formats while maintaining exact color values."
          },
          {
            question: "How accurate is this color converter?",
            answer: "Our converter provides 100% accurate conversions between RGB and HEX as these are direct mathematical conversions. Each RGB channel (0-255) directly corresponds to a two-digit hexadecimal value (00-FF). The conversion is lossless, meaning no color information is lost when converting between formats."
          }
        ],
        supportedFormats: [],
        maxFileSize: 0, // N/A
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: true,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "png-to-jpg": {
        title: "PNG to JPG Converter",
        slug: "png-to-jpg",
        description: "Convert PNG images to JPG format quickly and easily with our PNG to JPG converter. This specialized tool transforms transparent PNG files into compressed JPG files with customizable quality settings, background color options for transparent areas, and batch processing capabilities. Perfect for reducing file sizes, meeting format requirements, or preparing images for platforms that don't support transparency. Our converter maintains image quality while providing significantly smaller file sizes, ideal for web usage, email attachments, or storage optimization.",
        introduction: "Convert PNG images to JPG format in seconds while maintaining quality and reducing file size.",
        howToUse: [
          "Upload your PNG image using the 'Choose File' button",
          "Select your desired JPG quality level (higher quality = larger file)",
          "Choose a background color for transparent areas (white is default)",
          "Preview the converted image",
          "Download your new JPG file"
        ],
        features: [
          "✅ Converts PNG to JPG while maintaining visual quality",
          "✅ Significantly reduces file size (typically 70-90% smaller)",
          "✅ Customizable quality settings to balance size and appearance",
          "✅ Options for handling transparent areas in PNG files",
          "✅ Batch conversion available for multiple files"
        ],
        faqs: [
          {
            question: "Why convert PNG to JPG?",
            answer: "Converting PNG to JPG typically results in much smaller file sizes, which is beneficial for web pages, email attachments, or conserving storage space. JPG is ideal for photographs and complex images with many colors. However, note that JPG doesn't support transparency and uses lossy compression, so it's not ideal for images that need transparent backgrounds or require perfect quality."
          },
          {
            question: "What happens to transparent areas when converting to JPG?",
            answer: "Since JPG doesn't support transparency, transparent areas in PNG files need to be filled with a color. By default, we use white, but our converter allows you to select any background color. This is important to consider if your image will be placed on a colored background after conversion."
          },
          {
            question: "How do I choose the right JPG quality setting?",
            answer: "The optimal quality setting depends on your needs. Higher quality (80-100%) maintains visual fidelity but results in larger files. Medium quality (60-80%) offers a good balance for most web uses. Lower quality (below 60%) provides the smallest files but may show visible compression artifacts. We recommend previewing different settings to find the right balance for your specific image."
          },
          {
            question: "Will I lose image quality when converting from PNG to JPG?",
            answer: "JPG uses lossy compression, which means some image data is discarded during conversion. For photographs, the difference is often imperceptible at high quality settings. For graphics with sharp edges, text, or solid colors, you may notice some quality loss, particularly around edges and in areas with high contrast. If perfect quality is essential, PNG or other lossless formats are recommended."
          }
        ],
        supportedFormats: ["png"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: true,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "jpg-to-png": {
        title: "JPG to PNG Converter",
        slug: "jpg-to-png",
        description: "Convert JPG images to PNG format with our efficient JPG to PNG converter. This specialized tool transforms your JPEG/JPG files into high-quality PNG format, preserving image quality while providing the benefits of PNG format, including lossless compression and optional transparency. Perfect for designers, developers, and anyone needing PNG files for professional work, web graphics, or maintaining maximum image quality. Our converter processes images quickly and securely, with options to adjust settings for optimal results.",
        introduction: "Convert JPG/JPEG images to high-quality PNG format with perfect preservation of details.",
        howToUse: [
          "Upload your JPG image using the 'Choose File' button",
          "Adjust settings if needed (resolution, transparency options)",
          "Preview the converted image",
          "Download your new PNG file",
          "For batch conversion, use our premium version"
        ],
        features: [
          "✅ Lossless conversion from JPG to PNG format",
          "✅ Maintains or improves image quality in the conversion process",
          "✅ Optional background removal tools for creating transparent PNGs",
          "✅ No watermarks or quality limitations",
          "✅ Secure browser-based processing - no files uploaded to servers"
        ],
        faqs: [
          {
            question: "Why convert JPG to PNG?",
            answer: "Converting JPG to PNG is useful when you need: lossless image quality with no compression artifacts, transparent background options (with additional editing), support for more colors and better gradients, or images for professional design work. PNGs are ideal for graphics, logos, illustrations, and images with text where quality and clarity are essential."
          },
          {
            question: "Will converting JPG to PNG make my image transparent?",
            answer: "No, a standard JPG to PNG conversion will not automatically create transparency. JPGs don't contain transparency information, so the converted PNG will have a solid background. However, our tool includes optional background removal tools that can help you create transparency after conversion, particularly for images with solid-colored backgrounds."
          },
          {
            question: "Will the PNG file be larger than the original JPG?",
            answer: "Yes, PNG files are typically larger than JPG files because PNG uses lossless compression that preserves all image data. The size difference depends on the image content, but PNGs are usually 5-10 times larger than JPGs of the same dimensions. This size difference is the trade-off for the improved quality and features that PNG provides."
          },
          {
            question: "Can I recover lost quality by converting JPG to PNG?",
            answer: "Converting from JPG to PNG cannot recover quality that was already lost during JPG compression. The conversion will preserve the current quality of your JPG without further degradation, but cannot restore details that were discarded when the file was saved as JPG. For best results, convert original images or high-quality JPGs."
          }
        ],
        supportedFormats: ["jpg", "jpeg"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "compress-png": {
        title: "PNG Compressor",
        slug: "compress-png",
        description: "Reduce the file size of PNG images without losing quality with our specialized PNG Compressor. This powerful tool uses advanced lossless compression algorithms designed specifically for PNG files to significantly decrease file sizes while perfectly preserving transparency, colors, and details. Ideal for web developers, designers, and anyone looking to optimize PNG images for faster website loading, reduced storage usage, or easier sharing. Our intelligent compression preserves the benefits of PNG format while eliminating unnecessary data for maximum efficiency.",
        introduction: "Compress PNG images to smaller file sizes while maintaining quality and transparency with our specialized tool.",
        howToUse: [
          "Upload your PNG image using the 'Choose File' button",
          "Select compression level (Optimal balance or Maximum compression)",
          "Wait briefly while our algorithm analyzes and compresses your image",
          "Preview and compare the original and compressed versions",
          "Download your optimized PNG with significant file size savings"
        ],
        features: [
          "✅ Lossless PNG compression that maintains perfect image quality",
          "✅ Preserves transparency and alpha channels completely",
          "✅ Reduces file size by 25-80% depending on the image",
          "✅ Specialized algorithms optimized specifically for PNG format",
          "✅ Secure processing with all compression happening in your browser"
        ],
        faqs: [
          {
            question: "How is PNG compression different from JPG compression?",
            answer: "PNG compression is lossless, meaning it reduces file size without discarding any image data or reducing quality. It works by finding more efficient ways to encode the same information. By contrast, JPG uses lossy compression, which achieves smaller files by permanently discarding some image data. Our PNG compressor uses advanced lossless techniques specifically optimized for the PNG format."
          },
          {
            question: "How much smaller will my PNG files become?",
            answer: "Compression rates vary depending on the content of the image and its original optimization state. Typically, you can expect file size reductions of 25-40% with optimal settings while maintaining perfect quality. Images with large areas of solid color or simple patterns may see reductions of up to 80%. Already heavily optimized PNGs may see smaller improvements."
          },
          {
            question: "Will compression affect transparency in my PNG files?",
            answer: "No, our PNG compression maintains all transparency information perfectly. Alpha channels, fully transparent areas, and semi-transparent pixels will remain exactly as they were in the original image. This is one of the key advantages of our specialized PNG compression algorithm compared to general image compressors."
          },
          {
            question: "When should I use PNG compression vs. converting to JPG?",
            answer: "Use PNG compression when you need to maintain transparency, require perfect image quality, or have graphics with text, sharp edges, or limited color palettes. Choose JPG conversion when you need the smallest possible file size and can accept some quality loss, typically for photographs or complex images without transparency needs."
          }
        ],
        supportedFormats: ["png"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "jpeg-optimizer": {
        title: "JPEG Optimizer",
        slug: "jpeg-optimizer",
        description: "Optimize your JPEG images with precision using our advanced JPEG Optimizer tool. This specialized utility intelligently balances image quality and file size, allowing you to compress your JPEG files while preserving visual clarity. Perfect for website optimization, reducing storage usage, and improving page load times. Our intelligent algorithms analyze each image to apply the optimal level of compression based on its unique characteristics, ensuring ideal results every time.",
        introduction: "Reduce JPEG file sizes while maintaining optimal visual quality with our intelligent optimization tool.",
        howToUse: [
          "Upload your JPEG image using the 'Choose File' button",
          "Adjust the quality slider to your preferred balance of size and quality",
          "Preview the optimized result to compare with the original",
          "View file size reduction and quality information",
          "Download your optimized JPEG ready for web or other uses"
        ],
        features: [
          "✅ Smart compression that maintains important image details",
          "✅ Adjustable quality settings with real-time file size preview",
          "✅ Removes unnecessary metadata to further reduce file size",
          "✅ Specialized algorithms tuned specifically for JPEG format",
          "✅ Secure processing with all optimization happening in your browser"
        ],
        faqs: [
          {
            question: "How does JPEG optimization differ from standard compression?",
            answer: "JPEG optimization uses intelligent algorithms that analyze image content to apply varying compression levels to different parts of the image. This preserves details in important areas while more aggressively compressing less noticeable regions. Standard compression applies the same level throughout, often resulting in visible quality loss or unnecessarily large files."
          },
          {
            question: "Will optimizing my photos affect their quality?",
            answer: "Our optimizer is designed to preserve visible quality while reducing file size. At high quality settings (70-90%), the difference is typically imperceptible to the human eye. Lower settings will show some quality reduction but still maintain overall image integrity. You can preview and adjust until you find your ideal balance between file size and quality."
          },
          {
            question: "What's the difference between JPEG Optimizer and Image Compressor?",
            answer: "JPEG Optimizer is specifically designed for JPEG files with algorithms tailored to this format's unique characteristics. It focuses on intelligent quality reduction while preserving visual integrity. Our Image Compressor tool supports multiple formats and includes additional optimization techniques beyond compression, making it more versatile but less specialized for JPEG-specific optimization."
          },
          {
            question: "Why should I optimize my JPEG images?",
            answer: "Optimizing JPEGs provides multiple benefits: faster website loading times (improving user experience and SEO rankings), reduced storage space usage, lower bandwidth consumption (important for mobile users), quicker email transmission, and improved performance on social media platforms that might otherwise apply their own, less controlled compression."
          }
        ],
        supportedFormats: ["jpg", "jpeg"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: false
        }
      },
      "avif-to-jpg": {
        title: "AVIF to JPG Converter",
        slug: "avif-to-jpg",
        description: "Convert AVIF images to widely-compatible JPG format with our easy-to-use AVIF to JPG converter. AVIF is a newer, highly efficient image format that offers excellent compression but isn't yet universally supported. Our converter bridges this compatibility gap by transforming your AVIF files into JPG format, ensuring they can be viewed and used across all devices, browsers, and applications. Maintain high image quality while gaining universal compatibility with just a few clicks.",
        introduction: "Convert modern AVIF images to universally compatible JPG format while preserving quality.",
        howToUse: [
          "Upload your AVIF image using the 'Choose File' button",
          "Adjust the quality setting if desired (higher values maintain more detail)",
          "Click 'Convert' and wait briefly while processing",
          "Preview the converted JPG image",
          "Download your new JPG file ready for universal compatibility"
        ],
        features: [
          "✅ Converts cutting-edge AVIF format to universally supported JPG",
          "✅ Maintains excellent image quality during conversion",
          "✅ Adjustable quality settings to balance size and detail",
          "✅ Simple one-click conversion process",
          "✅ No software installation required - works entirely in your browser"
        ],
        faqs: [
          {
            question: "What is AVIF and why would I need to convert it to JPG?",
            answer: "AVIF (AV1 Image File Format) is a modern image format that offers excellent compression efficiency and quality. However, it's still not universally supported across all devices, browsers, and applications. Converting to JPG ensures your images can be viewed and used anywhere, including older software, social media platforms, and various devices that don't yet support AVIF."
          },
          {
            question: "Will I lose image quality when converting from AVIF to JPG?",
            answer: "There may be some quality loss during conversion because JPG uses lossy compression while AVIF can support both lossy and lossless compression. However, our converter is optimized to maintain the highest possible quality. At high quality settings (80-100%), the difference is typically minimal. You can adjust the quality setting to find your preferred balance between file size and image quality."
          },
          {
            question: "What advantages does JPG have over AVIF?",
            answer: "While AVIF offers better compression efficiency, JPG has universal compatibility as its main advantage. JPG files can be opened on virtually any device or software created in the last 25+ years. Other advantages include faster decoding (important for mobile devices), better support in editing software, and broader acceptance on websites and platforms."
          },
          {
            question: "Are there any alternatives to converting AVIF to JPG?",
            answer: "Yes, depending on your needs, you might consider converting AVIF to PNG (for better quality and transparency support) or WebP (for good compression while maintaining better quality than JPG). However, JPG remains the most universally compatible option. If you need alternatives, check out our other conversion tools like AVIF to PNG or AVIF to WebP."
          }
        ],
        supportedFormats: ["avif"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "png-to-ico": {
        title: "PNG to ICO Converter",
        slug: "png-to-ico",
        description: "Transform PNG images into ICO favicon files with our specialized PNG to ICO converter. This essential tool for web developers and designers converts standard PNG images into the ICO format required for website favicons. Our converter creates multiple resolution versions within a single ICO file, ensuring your favicon displays properly across all browsers and devices. The process preserves transparency and detail from your original PNG, resulting in professional-quality favicons that enhance your website's brand identity.",
        introduction: "Convert PNG images to ICO favicon files for your website with our easy-to-use conversion tool.",
        howToUse: [
          "Upload your PNG image using the 'Choose File' button",
          "Select which sizes to include in your ICO file (16x16, 32x32, 48x48)",
          "Click 'Convert' to process your image",
          "Preview the ICO at different resolutions",
          "Download your multi-resolution ICO file ready for website implementation"
        ],
        features: [
          "✅ Creates standard favicon.ico files from PNG images",
          "✅ Generates multiple resolutions in a single ICO file",
          "✅ Preserves transparency from the original PNG",
          "✅ Optimizes the ICO file for minimum file size",
          "✅ Provides guidance on implementing the favicon on your website"
        ],
        faqs: [
          {
            question: "What is an ICO file and why do I need it for my website?",
            answer: "An ICO file is a special image format primarily used for website favicons - the small icon that appears in browser tabs, bookmarks, and history lists. While modern browsers support other formats like PNG for favicons, the ICO format remains the most universally compatible option, especially for older browsers. ICO files can also contain multiple image sizes in a single file, allowing browsers to select the most appropriate size."
          },
          {
            question: "What makes a good favicon PNG before conversion?",
            answer: "The best PNG images for favicon conversion are: 1) Square in shape, 2) Simple and recognizable at small sizes, 3) High contrast with few details, 4) Ideally 256x256 pixels or larger (we'll resize it properly), and 5) Include transparency if desired. Logos and simple symbols work best, while photographs or complex images typically don't scale well to favicon sizes."
          },
          {
            question: "How do I add the ICO file to my website?",
            answer: "After downloading your ICO file, rename it to 'favicon.ico' and upload it to the root directory of your website. Then add this line in the head section of your HTML: \"<link rel='icon' type='image/x-icon' href='/favicon.ico'>\". For more comprehensive favicon support across all devices, you may want to generate additional formats like PNG and use a full favicon code snippet that includes multiple sizes and formats."
          },
          {
            question: "What ICO sizes should I include in my favicon?",
            answer: "For optimal cross-browser and device compatibility, we recommend including at least three sizes in your ICO file: 16x16 pixels (for browser tabs and address bars), 32x32 pixels (for shortcuts and higher resolution displays), and 48x48 pixels (for Windows taskbar and higher resolution displays). Our tool automatically generates these recommended sizes from your original PNG."
          }
        ],
        supportedFormats: ["png"],
        maxFileSize: 10, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "svg-to-png": {
        title: "SVG to PNG Converter",
        slug: "svg-to-png",
        description: "Convert scalable vector graphics (SVG) to PNG format with our professional SVG to PNG converter. This powerful tool transforms vector-based SVG files into raster-based PNG images with precise control over dimensions and quality. Perfect for creating compatible images for websites, applications, or design projects that require raster formats. Our converter maintains transparency and renders SVG elements with high fidelity, ensuring your PNG output looks exactly as intended at any resolution you specify.",
        introduction: "Transform vector-based SVG files into high-quality PNG images at any resolution you need.",
        howToUse: [
          "Upload your SVG file using the 'Choose File' button",
          "Enter your desired output dimensions (width and height in pixels)",
          "Select the scale factor if needed (for higher resolution/retina display output)",
          "Click 'Convert' to process your SVG",
          "Download your PNG file at your specified dimensions"
        ],
        features: [
          "✅ Converts SVG vector graphics to PNG raster format",
          "✅ Allows custom output dimensions at any resolution",
          "✅ Preserves transparency from the original SVG",
          "✅ Renders complex SVG elements with high fidelity",
          "✅ Supports both simple icons and complex vector illustrations"
        ],
        faqs: [
          {
            question: "Why would I need to convert SVG to PNG?",
            answer: "While SVG offers advantages like resolution independence and small file sizes, there are many scenarios where PNG is needed: 1) Compatibility with platforms that don't support SVG, 2) Email signatures and newsletters, 3) Use in applications that require raster inputs, 4) Creating specific size thumbnails or previews, 5) Consistency across browsers (as some may render SVGs slightly differently)."
          },
          {
            question: "What dimensions should I choose for my PNG output?",
            answer: "The ideal dimensions depend on your use case. For web icons, common sizes include 16x16, 32x32, 64x64, or 128x128 pixels. For logos or images on websites, you might want 200-500 pixels wide. For high-resolution or print usage, you might need 1000+ pixels. One advantage of converting from SVG is that you can generate PNGs at any size without quality loss, so choose dimensions appropriate for your specific needs."
          },
          {
            question: "Will my PNG maintain the transparency from my SVG?",
            answer: "Yes, our converter fully preserves transparency from your SVG. Any transparent or semi-transparent areas in your original SVG will be correctly rendered in the PNG output with an alpha channel. This ensures your PNG images can be placed over different colored backgrounds while maintaining the same visual appearance as the original SVG."
          },
          {
            question: "Are there any limitations when converting SVG to PNG?",
            answer: "While our converter handles most SVG features, there are a few limitations: 1) External resources referenced in the SVG (like images or fonts) may not be included, 2) Some advanced SVG filters might not render exactly the same, 3) As a raster format, the PNG will not scale infinitely like the original SVG, and 4) Very complex SVGs with thousands of elements might have slight rendering differences. For best results, use self-contained SVGs without external dependencies."
          }
        ],
        supportedFormats: ["svg"],
        maxFileSize: 15, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "webp-to-png": {
        title: "WebP to PNG Converter",
        slug: "webp-to-png",
        description: "Convert WebP images to widely-compatible PNG format with our efficient WebP to PNG converter. While WebP offers excellent compression, PNG provides universal compatibility and lossless quality with transparency support. Our tool makes the conversion process simple and maintains the visual quality of your images. Perfect for ensuring your images work across all platforms, browsers, and applications without compatibility issues.",
        introduction: "Transform WebP images to universally compatible PNG format while preserving quality and transparency.",
        howToUse: [
          "Upload your WebP image using the 'Choose File' button",
          "Click 'Convert' to process your file",
          "Preview the converted PNG image",
          "Download your new PNG file ready for use anywhere"
        ],
        features: [
          "✅ Converts WebP images to universally compatible PNG format",
          "✅ Preserves transparency and image quality during conversion",
          "✅ Maintains original image dimensions perfectly",
          "✅ Simple one-click conversion process",
          "✅ Works with both lossy and lossless WebP types"
        ],
        faqs: [
          {
            question: "Why would I need to convert WebP to PNG?",
            answer: "While WebP offers excellent compression, there are several reasons to convert to PNG: 1) Universal compatibility - PNG works on virtually all software and platforms, 2) Some image editors don't support WebP, 3) PNG offers lossless quality with transparency support, 4) Certain websites or applications might require PNG format for uploads, 5) For archiving purposes, as PNG is a more established format with long-term support."
          },
          {
            question: "Will I lose image quality when converting from WebP to PNG?",
            answer: "Generally, no. PNG is a lossless format, so it preserves all the detail present in your WebP image. However, if your original WebP was created using lossy compression, our converter can't restore details that were already lost in the original WebP. The conversion itself doesn't introduce additional quality loss - it preserves the image exactly as it appears in the WebP."
          },
          {
            question: "Will transparency be preserved in the conversion?",
            answer: "Yes, our WebP to PNG converter fully preserves transparency. If your WebP image has transparent or semi-transparent areas, these will be correctly maintained in the PNG output. This makes it perfect for converting logos, icons, and other graphics that need to be placed over different backgrounds."
          },
          {
            question: "How does the file size compare between WebP and PNG?",
            answer: "PNG files are typically larger than their WebP counterparts. WebP was designed specifically for efficient compression, while PNG prioritizes lossless quality. The size difference varies depending on the image content - expect PNG files to be anywhere from 20% to 100% larger than the equivalent WebP. For images where file size is critical, you might want to consider our PNG compression tool after conversion."
          }
        ],
        supportedFormats: ["webp"],
        maxFileSize: 50, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "jpeg-to-svg": {
        title: "JPEG to SVG Converter",
        slug: "jpeg-to-svg",
        description: "Transform JPEG photographs and images into scalable vector graphics with our JPEG to SVG converter. This specialized tool uses advanced vectorization algorithms to trace and convert raster JPEG images into clean, scalable SVG vector files. Perfect for creating logos, illustrations, or artwork that can be resized infinitely without quality loss. Our converter offers customizable settings to control detail levels, color simplification, and smoothing to achieve the best possible vector results from your JPEG images.",
        introduction: "Convert JPEG images into infinitely scalable SVG vector graphics with our advanced vectorization tool.",
        howToUse: [
          "Upload your JPEG image using the 'Choose File' button",
          "Adjust vectorization settings (detail level, color simplification, smoothing)",
          "Click 'Convert' and wait while our algorithm processes your image",
          "Preview the SVG result and adjust settings if needed",
          "Download your new SVG file ready for infinite scaling"
        ],
        features: [
          "✅ Converts raster JPEG images to scalable vector SVG format",
          "✅ Adjustable detail levels for precise control over results",
          "✅ Color simplification options for clean, professional vectors",
          "✅ Path smoothing to create elegant curves from pixel data",
          "✅ Perfect for creating logos, icons, and illustrations from photos"
        ],
        faqs: [
          {
            question: "What types of JPEG images work best for SVG conversion?",
            answer: "Images with clear outlines, solid or limited colors, and distinct shapes vectorize best. Logos, cartoons, simple illustrations, silhouettes, and graphics with clean edges produce the highest quality SVG results. Photographs with many details, gradients, or complex textures will convert, but may result in either very complex SVGs (large file size) or simplified representations depending on your settings."
          },
          {
            question: "How accurate will my SVG conversion be?",
            answer: "The accuracy depends on your source image and settings. For simple, high-contrast images with few colors, the conversion can be very accurate. For complex photos, the result will be a vectorized interpretation rather than an exact replica. Our tool allows you to adjust detail levels - higher settings preserve more details but result in larger files with more complex paths, while lower settings produce cleaner, more simplified vectors."
          },
          {
            question: "What are the advantages of converting JPEG to SVG?",
            answer: "Converting to SVG provides several benefits: 1) Infinite scalability without quality loss, 2) Smaller file sizes for simple images, 3) Easy editability in vector software like Illustrator or Inkscape, 4) Perfect rendering at any resolution or size, 5) Ability to modify individual elements and colors after conversion, 6) Better accessibility for web use, and 7) Suitability for printing at any size."
          },
          {
            question: "How do I use the SVG file after conversion?",
            answer: "SVG files can be used in many ways: 1) Insert directly into websites with the img tag or inline SVG code, 2) Import into vector editing software like Adobe Illustrator, Inkscape, or Affinity Designer for further editing, 3) Use in design applications like Photoshop or Figma, 4) Include in documents created with Word, PowerPoint, or publishing software, or 5) Send to printing services for physical reproduction at any size."
          }
        ],
        supportedFormats: ["jpg", "jpeg"],
        maxFileSize: 20, // MB
        options: {
          hasQualitySlider: false,
          hasSizeSlider: false,
          hasDimensionInputs: false,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      },
      "mp4-to-gif-converter": {
        title: "MP4 to GIF Converter",
        slug: "mp4-to-gif-converter",
        description: "Transform video clips into animated GIFs with our efficient MP4 to GIF converter. This versatile tool converts short MP4 video clips into GIF animations that can be easily shared on websites, social media, messaging apps, and emails without requiring video players. Our converter offers customizable frame rate, dimensions, and quality settings to create the perfect GIF for your needs while optimizing for file size. Perfect for creating reaction GIFs, short animations, product demonstrations, or converting video memes into shareable GIF format.",
        introduction: "Convert MP4 video clips into shareable animated GIFs with our easy-to-use conversion tool.",
        howToUse: [
          "Upload your MP4 video using the 'Choose File' button",
          "Set your desired GIF dimensions (width and height in pixels)",
          "Adjust frame rate (lower for smaller files, higher for smoother animation)",
          "Select the portion of the video to convert (start and end times)",
          "Click 'Convert' and download your animated GIF"
        ],
        features: [
          "✅ Converts MP4 videos to widely-compatible GIF format",
          "✅ Customizable frame rate for balancing quality and file size",
          "✅ Adjustable dimensions to fit your specific needs",
          "✅ Trim functionality to select exact portion of video",
          "✅ Optional dithering to improve color appearance in GIFs"
        ],
        faqs: [
          {
            question: "What's the ideal length for converting MP4 to GIF?",
            answer: "For best results, we recommend limiting your GIFs to 5-15 seconds. Shorter clips work better for several reasons: 1) File size remains manageable (GIFs can become very large), 2) Many platforms have file size limits for GIFs, 3) Brief, focused animations are typically more engaging, and 4) Processing time is reduced. If you need a longer animation, consider using our video compression tool instead."
          },
          {
            question: "Why is my GIF file so large compared to the MP4?",
            answer: "GIF is an older format that doesn't use modern compression techniques available to video formats like MP4. GIFs store each frame as a separate image with limited compression, while MP4 uses sophisticated temporal compression that only stores changes between frames. To reduce GIF size: 1) Lower the frame rate, 2) Reduce dimensions, 3) Trim to only essential content, or 4) Use our GIF optimizer tool after conversion."
          },
          {
            question: "How can I make my GIF look best while keeping file size reasonable?",
            answer: "To optimize your GIF's quality-to-size ratio: 1) Choose appropriate dimensions (usually 320-480px wide), 2) Set frame rate to 10-15fps for most content (lower for simpler animations, higher for fast action), 3) Trim to only the essential portion of the video, 4) Consider reducing colors if your content doesn't need full color range, and 5) For text visibility, ensure high contrast and sufficient size in the original video."
          },
          {
            question: "What types of MP4 videos convert best to GIFs?",
            answer: "Videos with these characteristics convert most successfully: 1) Simple backgrounds or limited scene changes, 2) Clear subject with good contrast, 3) Limited camera movement, 4) Brief duration (under 10 seconds ideal), 5) Not reliant on audio, and 6) Strong visual impact that works without sound. Videos with fast action may require higher frame rates, increasing file size."
          }
        ],
        supportedFormats: ["mp4"],
        maxFileSize: 100, // MB
        options: {
          hasQualitySlider: true,
          hasSizeSlider: false,
          hasDimensionInputs: true,
          hasCropOptions: false,
          hasColorPicker: false,
          hasTargetSize: false,
          hasConversionOptions: true
        }
      }
    };

    // For specific compression tools, use the image-compressor config but override certain properties
    const specificTargetSizes = [
      "compress-image-to-10kb", "compress-image-to-20kb", "compress-image-to-50kb", 
      "compress-jpeg-to-30kb", "compress-jpeg-to-100kb", "compress-jpeg-to-200kb",
      "compress-image-to-1mb", "compress-jpg", "resize-image-to-20kb",
      "resize-image-to-50kb", "resize-image-to-100kb", "reduce-image-size-in-kb"
    ];
    
    if (specificTargetSizes.includes(toolType)) {
      let baseConfig = { ...configurations["image-compressor"] };
      let targetSizeStr = "";
      let sizeMatch = toolType.match(/\d+/);
      
      if (sizeMatch) {
        let size = parseInt(sizeMatch[0]);
        let unit = toolType.includes("mb") ? "MB" : "KB";
        targetSizeStr = `${size}${unit}`;
        
        baseConfig.title = `${targetSizeStr} Image Compressor`;
        baseConfig.slug = toolType;
        baseConfig.introduction = `Compress images to exactly ${targetSizeStr} while maintaining the best possible quality.`;
        
        // Update description to be more specific
        baseConfig.description = baseConfig.description.replace(
          "Reduce file size while maintaining image quality",
          `Compress images to exactly ${targetSizeStr} while maintaining the best possible quality`
        );
      } else if (toolType === "compress-jpg") {
        baseConfig.title = "JPG Compressor";
        baseConfig.slug = "compress-jpg";
        baseConfig.introduction = "Compress JPG images to smaller file sizes while maintaining visual quality.";
        baseConfig.description = baseConfig.description.replace(
          "Reduce file size while maintaining image quality",
          "Compress JPG/JPEG images to significantly smaller file sizes while maintaining visual quality"
        );
        // Limit formats to just JPG
        baseConfig.supportedFormats = ["jpg", "jpeg"];
      } else if (toolType === "reduce-image-size-in-kb") {
        baseConfig.title = "Reduce Image Size in KB";
        baseConfig.slug = "reduce-image-size-in-kb";
        baseConfig.introduction = "Intelligently reduce image size to your target KB value while preserving quality.";
        baseConfig.description = baseConfig.description.replace(
          "Reduce file size while maintaining image quality",
          "Intelligently reduce image file size to your exact KB requirements while preserving the highest possible quality"
        );
      }
      
      setConfig(baseConfig);
    } else if (toolType.startsWith("convert-") || 
               toolType.includes("-to-") || 
               toolType.includes("-converter")) {
      // For conversion tools, determine what formats are involved
      let fromFormat = "";
      let toFormat = "";
      
      if (toolType.includes("-to-")) {
        const parts = toolType.split("-to-");
        fromFormat = parts[0];
        toFormat = parts[1].replace("-converter", "").replace("-detailed", "");
      }
      
      // If we have valid formats, create a conversion-specific config
      if ((fromFormat && toFormat) || toolType === "convert-to-jpg") {
        if (toolType === "convert-to-jpg") {
          fromFormat = "any";
          toFormat = "jpg";
        }
        
        // Capitalize formats for display
        const fromFormatDisplay = fromFormat.toUpperCase();
        const toFormatDisplay = toFormat.toUpperCase();
        
        const conversionConfig: ImageToolConfig = {
          title: `${fromFormatDisplay} to ${toFormatDisplay} Converter`,
          slug: toolType,
          description: `Convert ${fromFormatDisplay} images to ${toFormatDisplay} format with our easy-to-use conversion tool. This specialized converter transforms your ${fromFormatDisplay} files into high-quality ${toFormatDisplay} format with customizable settings to meet your exact needs. Our converter maintains image quality while providing the benefits of ${toFormatDisplay} format, making it perfect for web optimization, compatibility requirements, or specific project needs. The secure, browser-based processing ensures your images remain private while delivering fast, reliable results.`,
          introduction: `Convert ${fromFormatDisplay} images to ${toFormatDisplay} format quickly and easily while maintaining quality.`,
          howToUse: [
            `Upload your ${fromFormatDisplay} image using the 'Choose File' button`,
            "Adjust conversion settings if needed",
            "Preview the converted image",
            `Download your new ${toFormatDisplay} file`,
            "For batch conversion, use our premium version"
          ],
          features: [
            `✅ Fast and accurate ${fromFormatDisplay} to ${toFormatDisplay} conversion`,
            "✅ Maintains highest possible image quality during conversion",
            "✅ Customizable settings for optimal results",
            "✅ No watermarks or quality limitations in free version",
            "✅ Secure browser-based processing for complete privacy"
          ],
          faqs: [
            {
              question: `Why convert ${fromFormatDisplay} to ${toFormatDisplay}?`,
              answer: `Converting from ${fromFormatDisplay} to ${toFormatDisplay} is useful for various reasons including file size optimization, format compatibility with different platforms, or specific project requirements. ${toFormatDisplay} files offer particular advantages such as ${getFormatAdvantages(toFormat)}.`
            },
            {
              question: "Will I lose quality during the conversion?",
              answer: getQualityAnswer(fromFormat, toFormat)
            },
            {
              question: `What's the difference between ${fromFormatDisplay} and ${toFormatDisplay} formats?`,
              answer: getFormatComparison(fromFormat, toFormat)
            },
            {
              question: "Are there any limitations to the conversion?",
              answer: getLimitations(fromFormat, toFormat)
            }
          ],
          supportedFormats: [fromFormat],
          maxFileSize: 50, // MB
          options: {
            hasQualitySlider: toFormat === "jpg" || toFormat === "jpeg" || toFormat === "webp",
            hasSizeSlider: false,
            hasDimensionInputs: false,
            hasCropOptions: false,
            hasColorPicker: (fromFormat === "png" || fromFormat === "svg") && (toFormat === "jpg" || toFormat === "jpeg"),
            hasTargetSize: false,
            hasConversionOptions: true
          }
        };
        
        setConfig(conversionConfig);
      } else {
        // Default to image compressor if we can't determine formats
        setConfig(configurations["image-compressor"]);
      }
    } else {
      // Set the config based on the tool type, defaulting to image-compressor if not found
      setConfig(configurations[toolType] || configurations["image-compressor"]);
    }
  }, [toolType]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (config && file.size > config.maxFileSize * 1024 * 1024) {
      setErrorMessage(`File size exceeds the maximum allowed size of ${config.maxFileSize}MB.`);
      return;
    }
    
    // Check file format if there are supported formats specified
    if (config && config.supportedFormats.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!config.supportedFormats.includes(fileExtension)) {
        setErrorMessage(`Unsupported file format. Please upload one of the following formats: ${config.supportedFormats.join(', ')}.`);
        return;
      }
    }
    
    setUploadedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFileUrl(reader.result as string);
      
      // Reset states
      setProcessingState("idle");
      setOutputFileUrl("");
      setErrorMessage("");
      
      // If it's an image, get dimensions
      if (file.type.startsWith('image/') && !file.type.includes('svg')) {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  // Process the image based on the tool type
  const processImage = () => {
    if (!uploadedFile || !config) {
      setErrorMessage("Please upload a file first.");
      return;
    }
    
    setProcessingState("processing");
    setErrorMessage("");
    
    // Simulate processing with timeout (in a real implementation, this would be actual image processing)
    setTimeout(() => {
      try {
        // Process differently based on tool type
        switch (toolType) {
          case "reverse-image-search":
          case "face-search":
            // These would typically make API calls to external services
            simulateSearchResults();
            break;
          
          case "image-compressor":
          case "compress-png":
          case "compress-jpg":
          case "compress-image-to-50kb":
          case "compress-image-to-20kb":
          case "compress-jpeg-to-100kb":
          case "compress-jpeg-to-200kb":
          case "compress-image-to-10kb":
          case "compress-jpeg-to-30kb":
          case "compress-image-to-1mb":
          case "reduce-image-size-in-kb":
            simulateImageCompression();
            break;
          
          case "image-resizer":
          case "resize-image-to-50kb":
          case "resize-image-to-100kb":
          case "resize-image-to-20kb":
          case "photo-resizer-in-kb":
            simulateImageResize();
            break;
          
          case "crop-image":
            simulateImageCrop();
            break;
          
          case "favicon-generator":
            simulateFaviconGeneration();
            break;
          
          case "video-to-gif-converter":
          case "mp4-to-gif-converter":
            simulateVideoToGifConversion();
            break;
          
          case "rgb-to-hex":
            // This is handled directly in the UI without processing
            setProcessingState("success");
            break;
          
          case "png-to-jpg":
          case "jpg-to-png":
          case "convert-to-jpg":
          case "webp-to-png":
          case "heic-to-jpg-converter":
          case "heic-to-png":
          case "svg-to-png":
          case "png-to-svg":
          case "jpg-to-svg":
          case "jpeg-to-svg":
          case "png-to-ico":
          case "avif-to-jpg":
            simulateFormatConversion();
            break;
          
          default:
            // Generic processing for other tools
            simulateGenericProcessing();
        }
      } catch (error) {
        console.error("Error processing image:", error);
        setProcessingState("error");
        setErrorMessage("An error occurred while processing your image. Please try again.");
      }
    }, 2000);
  };

  // Simulation functions for different processing types
  const simulateSearchResults = () => {
    // In a real implementation, this would call an API to search for similar images
    setProcessingState("success");
    
    // Since we can't actually search the web, we'll just simulate a success message
    const resultMessage = toolType === "reverse-image-search"
      ? "Image analysis complete! We found 28 similar images across the web."
      : "Face detection complete! We found 5 images with similar faces.";
    
    alert(resultMessage);
  };

  const simulateImageCompression = () => {
    // In a real implementation, this would use canvas or a library like compressorjs
    setProcessingState("success");
    
    // Just use the same image for demo purposes
    setOutputFileUrl(uploadedFileUrl);
  };

  const simulateImageResize = () => {
    if (!uploadedFile || !uploadedFileUrl) return;
    
    // In a real implementation, this would use canvas to resize the image
    if (canvasRef.current && width && height) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Calculate new dimensions
      let newWidth = width;
      let newHeight = height;
      
      if (maintainAspectRatio) {
        const ratio = width / height;
        if (newWidth && !newHeight) {
          newHeight = Math.round(newWidth / ratio);
        } else if (!newWidth && newHeight) {
          newWidth = Math.round(newHeight * ratio);
        }
      }
      
      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw image onto canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert canvas to data URL
        try {
          const dataUrl = canvas.toDataURL(uploadedFile.type);
          setOutputFileUrl(dataUrl);
          setProcessingState("success");
        } catch (e) {
          setProcessingState("error");
          setErrorMessage("Failed to process image. The image might be from an external source or have format issues.");
        }
      };
      img.src = uploadedFileUrl;
    } else {
      // Fallback if canvas isn't available
      setOutputFileUrl(uploadedFileUrl);
      setProcessingState("success");
    }
  };

  const simulateImageCrop = () => {
    // In a real implementation, this would use canvas to crop the image
    setProcessingState("success");
    setOutputFileUrl(uploadedFileUrl);
  };

  const simulateFaviconGeneration = () => {
    // In a real implementation, this would generate multiple favicon sizes
    setProcessingState("success");
    setOutputFileUrl(uploadedFileUrl);
  };

  const simulateVideoToGifConversion = () => {
    // In a real implementation, this would use a library to convert video to GIF
    setProcessingState("success");
    
    // Since we can't actually convert a video in this demo, just show a message
    alert("Video converted to GIF successfully! In a real implementation, this would generate an actual GIF file.");
  };

  const simulateFormatConversion = () => {
    // In a real implementation, this would convert between image formats
    setProcessingState("success");
    setOutputFileUrl(uploadedFileUrl);
  };

  const simulateGenericProcessing = () => {
    // Generic fallback for other tool types
    setProcessingState("success");
    setOutputFileUrl(uploadedFileUrl);
  };

  // Helper functions for format-specific text
  function getFormatAdvantages(format: string): string {
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'smaller file sizes ideal for photographs and web use, universal compatibility, and efficient storage';
      case 'png':
        return 'transparency support, lossless quality, and better rendering of text and graphics with sharp edges';
      case 'gif':
        return 'animation support, small file sizes for simple graphics, and wide compatibility';
      case 'webp':
        return 'modern compression that offers smaller file sizes than JPG while supporting transparency like PNG';
      case 'svg':
        return 'vector scalability to any size without quality loss, small file sizes for graphics, and animation support';
      case 'ico':
        return 'favicon support across all browsers and operating systems';
      default:
        return 'specific advantages for your use case';
    }
  }

  function getQualityAnswer(fromFormat: string, toFormat: string): string {
    if ((fromFormat === 'png' || fromFormat === 'svg' || fromFormat === 'webp') && 
        (toFormat === 'jpg' || toFormat === 'jpeg')) {
      return 'There may be some quality loss when converting to JPG since it uses lossy compression and doesn\'t support transparency. However, our converter optimizes the process to maintain the best possible visual quality. For photographs, the difference is often minimal at high quality settings.';
    } else if (toFormat === 'png' || toFormat === 'webp') {
      return 'Our converter maintains high image quality during conversion. When converting to PNG or WebP, the visual quality should remain excellent, though file sizes may increase compared to lossy formats like JPG.';
    } else if (fromFormat === 'svg') {
      return 'Converting from SVG (vector) to a raster format means the scalability advantage of vector graphics will be lost. The resulting image will have fixed dimensions and may lose sharpness when enlarged, unlike the original SVG.';
    } else {
      return 'Some quality changes may occur during format conversion depending on the specific formats involved. Our converter uses advanced algorithms to maintain the best possible quality during the conversion process.';
    }
  }

  function getFormatComparison(fromFormat: string, toFormat: string): string {
    if ((fromFormat === 'png' && toFormat === 'jpg') || (fromFormat === 'jpg' && toFormat === 'png')) {
      return 'PNG is a lossless format that supports transparency and is ideal for graphics, logos, and images with text. JPG uses lossy compression to create smaller file sizes, making it better for photographs and complex images without transparency needs. PNG files maintain perfect quality but are larger, while JPG files are smaller but may show some compression artifacts.';
    } else if ((fromFormat === 'webp' && toFormat === 'png') || (fromFormat === 'webp' && toFormat === 'jpg')) {
      return 'WebP is a modern format developed by Google that offers both lossy and lossless compression with transparency support. It typically produces smaller files than both JPG and PNG while maintaining similar quality. However, WebP isn\'t universally supported in all software and older browsers, which is why conversion to more widely compatible formats like PNG or JPG is sometimes necessary.';
    } else if (fromFormat === 'svg' || toFormat === 'svg') {
      return 'SVG is a vector format that uses mathematical formulas to define images, allowing them to scale to any size without quality loss. Other formats like PNG, JPG, and WebP are raster formats composed of pixels with fixed dimensions. Vector SVGs are ideal for logos, icons, and simple illustrations, while raster formats are better for photographs and complex images.';
    } else {
      return `${fromFormat.toUpperCase()} and ${toFormat.toUpperCase()} are different image formats with unique characteristics. They offer different balances of quality, file size, transparency support, and compatibility that make each suitable for specific use cases. Our conversion tool helps you take advantage of the benefits of each format depending on your needs.`;
    }
  }

  function getLimitations(fromFormat: string, toFormat: string): string {
    if ((fromFormat === 'png' || fromFormat === 'svg' || fromFormat === 'webp') && 
        (toFormat === 'jpg' || toFormat === 'jpeg')) {
      return 'The main limitation is that JPG doesn\'t support transparency. Any transparent areas in your original image will be filled with a background color (white by default, but you can select a different color). Additionally, JPG uses lossy compression which may introduce some very slight artifacts, especially around sharp edges and text.';
    } else if (fromFormat === 'jpg' && toFormat === 'png') {
      return 'Converting JPG to PNG will not recover any quality already lost in the JPG compression. While the PNG will prevent further quality loss, it cannot restore details that were already discarded. Also, the resulting PNG file will be significantly larger than the original JPG.';
    } else if (toFormat === 'svg') {
      return 'Automatic conversion of raster images to SVG has significant limitations. The process works best for simple images with clear shapes and limited colors. Complex photographs will not convert well to SVG. For best results, professional vector tracing by a designer is recommended for converting photos to true vector SVGs.';
    } else if (fromFormat === 'heic') {
      return 'HEIC is Apple\'s High Efficiency Image Format which offers excellent compression but limited compatibility. Our converter extracts the image data and converts it to more universally compatible formats, though some metadata might not transfer perfectly.';
    } else {
      return 'All format conversions have some trade-offs in terms of file size, quality, feature support, or compatibility. Our converter optimizes the process to give you the best possible results, but certain format-specific features may not have direct equivalents in the target format.';
    }
  }

  const renderToolOptions = () => {
    if (!config || !config.options) return null;
    
    return (
      <div className="space-y-6">
        {/* Quality slider for compression tools */}
        {config.options.hasQualitySlider && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quality">Quality: {quality}%</Label>
            </div>
            <Slider
              id="quality"
              min={0}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={(value) => setQuality(value[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        )}
        
        {/* Target size input for size-specific tools */}
        {config.options.hasTargetSize && (
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="col-span-2">
              <Label htmlFor="targetSize">Target Size</Label>
              <Input
                id="targetSize"
                type="number"
                min={1}
                value={targetSize}
                onChange={(e) => setTargetSize(parseInt(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="targetUnit">Unit</Label>
              <Select
                value={targetUnit}
                onValueChange={(value: "kb" | "mb") => setTargetUnit(value)}
              >
                <SelectTrigger id="targetUnit" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kb">KB</SelectItem>
                  <SelectItem value="mb">MB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Dimension inputs for resizing tools */}
        {config.options.hasDimensionInputs && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min={1}
                  value={width || ""}
                  onChange={(e) => {
                    const newWidth = parseInt(e.target.value) || 0;
                    setWidth(newWidth);
                    
                    if (maintainAspectRatio && height && width) {
                      const ratio = width / height;
                      setHeight(Math.round(newWidth / ratio));
                    }
                  }}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min={1}
                  value={height || ""}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value) || 0;
                    setHeight(newHeight);
                    
                    if (maintainAspectRatio && width && height) {
                      const ratio = width / height;
                      setWidth(Math.round(newHeight * ratio));
                    }
                  }}
                  className="mt-1.5"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="maintainAspectRatio"
                checked={maintainAspectRatio}
                onCheckedChange={setMaintainAspectRatio}
              />
              <Label htmlFor="maintainAspectRatio">Maintain aspect ratio</Label>
            </div>
          </div>
        )}
        
        {/* Format conversion options */}
        {config.options.hasConversionOptions && (
          <div>
            <Label htmlFor="convertTo">Output Format</Label>
            <Select
              value={convertTo}
              onValueChange={setConvertTo}
            >
              <SelectTrigger id="convertTo" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toolType.includes("to-jpg") || toolType.includes("to-jpeg") ? (
                  <SelectItem value="jpg">JPG</SelectItem>
                ) : toolType.includes("to-png") ? (
                  <SelectItem value="png">PNG</SelectItem>
                ) : toolType.includes("to-webp") ? (
                  <SelectItem value="webp">WebP</SelectItem>
                ) : toolType.includes("to-gif") ? (
                  <SelectItem value="gif">GIF</SelectItem>
                ) : toolType.includes("to-svg") ? (
                  <SelectItem value="svg">SVG</SelectItem>
                ) : toolType.includes("to-ico") ? (
                  <SelectItem value="ico">ICO</SelectItem>
                ) : (
                  <>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="gif">GIF</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Color picker for transparent background */}
        {config.options.hasColorPicker && (
          <div className="space-y-4">
            {convertTo === "jpg" || convertTo === "jpeg" ? (
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color (for transparent areas)</Label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="color"
                    id="backgroundColor"
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-200"
                  />
                  <Input
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            ) : toolType === "rgb-to-hex" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="r">Red (0-255)</Label>
                    <Input
                      id="r"
                      type="number"
                      min={0}
                      max={255}
                      value={rgbValues.r}
                      onChange={(e) => {
                        const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                        setRgbValues(prev => ({...prev, r: value}));
                        // Update HEX value
                        const hexValue = `#${value.toString(16).padStart(2, '0')}${rgbValues.g.toString(16).padStart(2, '0')}${rgbValues.b.toString(16).padStart(2, '0')}`;
                        setColorValue(hexValue);
                      }}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="g">Green (0-255)</Label>
                    <Input
                      id="g"
                      type="number"
                      min={0}
                      max={255}
                      value={rgbValues.g}
                      onChange={(e) => {
                        const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                        setRgbValues(prev => ({...prev, g: value}));
                        // Update HEX value
                        const hexValue = `#${rgbValues.r.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}${rgbValues.b.toString(16).padStart(2, '0')}`;
                        setColorValue(hexValue);
                      }}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="b">Blue (0-255)</Label>
                    <Input
                      id="b"
                      type="number"
                      min={0}
                      max={255}
                      value={rgbValues.b}
                      onChange={(e) => {
                        const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0));
                        setRgbValues(prev => ({...prev, b: value}));
                        // Update HEX value
                        const hexValue = `#${rgbValues.r.toString(16).padStart(2, '0')}${rgbValues.g.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}`;
                        setColorValue(hexValue);
                      }}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hexColor">HEX Color Code</Label>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="color"
                      id="hexColor"
                      value={colorValue}
                      onChange={(e) => {
                        const hexValue = e.target.value;
                        setColorValue(hexValue);
                        // Update RGB values
                        const r = parseInt(hexValue.slice(1, 3), 16);
                        const g = parseInt(hexValue.slice(3, 5), 16);
                        const b = parseInt(hexValue.slice(5, 7), 16);
                        setRgbValues({r, g, b});
                      }}
                      className="h-10 w-10 rounded border border-gray-200"
                    />
                    <Input
                      value={colorValue}
                      onChange={(e) => {
                        let hexValue = e.target.value;
                        if (hexValue.startsWith('#') && hexValue.length === 7) {
                          setColorValue(hexValue);
                          // Update RGB values
                          try {
                            const r = parseInt(hexValue.slice(1, 3), 16);
                            const g = parseInt(hexValue.slice(3, 5), 16);
                            const b = parseInt(hexValue.slice(5, 7), 16);
                            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                              setRgbValues({r, g, b});
                            }
                          } catch (e) {
                            // Invalid hex value
                          }
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="h-20 w-full mt-4 rounded border border-gray-200" style={{backgroundColor: colorValue}}>
                    <div className="h-full w-full flex items-center justify-center text-white text-shadow">
                      Color Preview
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Crop options */}
        {config.options.hasCropOptions && (
          <div className="space-y-4">
            <div className="aspect-video relative border border-gray-200 rounded overflow-hidden">
              {uploadedFileUrl && (
                <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{backgroundImage: `url(${uploadedFileUrl})`}}>
                  {/* In a real implementation, this would have an interactive crop overlay */}
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-40">
                    <p>Interactive crop interface would appear here</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select value="custom" onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Aspect Ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="2:3">2:3</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value="0" onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Rotation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Rotation</SelectItem>
                  <SelectItem value="90">90° Right</SelectItem>
                  <SelectItem value="180">180°</SelectItem>
                  <SelectItem value="270">90° Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  const renderInterface = () => {
    // RGB to HEX converter doesn't need file upload
    if (toolType === "rgb-to-hex") {
      return (
        <Card className="mb-6">
          <CardContent className="pt-6">
            {renderToolOptions()}
            
            <div className="mt-6">
              <Button className="w-full" onClick={() => processImage()}>
                Convert Color
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // MB to KB converter is a simple calculator
    if (toolType === "mb-to-kb-converter") {
      return (
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mbValue">Megabytes (MB)</Label>
                <Input
                  id="mbValue"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Enter MB value"
                  value={targetSize}
                  onChange={(e) => setTargetSize(parseFloat(e.target.value) || 0)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="kbResult">Kilobytes (KB)</Label>
                <Input
                  id="kbResult"
                  type="number"
                  readOnly
                  value={(targetSize * 1024).toFixed(2)}
                  className="mt-1.5 bg-gray-50"
                />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md text-sm">
              <p className="font-medium mb-2">Conversion Formula:</p>
              <p>1 Megabyte (MB) = 1024 Kilobytes (KB)</p>
            </div>
            
            <div className="text-sm text-gray-500">
              <h4 className="font-medium mb-1">Common Conversions:</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                <li>0.1 MB = 102.4 KB</li>
                <li>0.5 MB = 512 KB</li>
                <li>1 MB = 1,024 KB</li>
                <li>2 MB = 2,048 KB</li>
                <li>5 MB = 5,120 KB</li>
                <li>10 MB = 10,240 KB</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Standard interface for image processing tools
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                      <line x1="16" y1="5" x2="22" y2="5"></line>
                      <line x1="19" y1="2" x2="19" y2="8"></line>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        {config.supportedFormats.length > 0 
                          ? `Supported formats: ${config.supportedFormats.map(f => f.toUpperCase()).join(', ')}`
                          : "Upload your file to process"}
                      </p>
                      <p className="text-xs text-gray-500">Max size: {config.maxFileSize}MB</p>
                    </div>
                  </div>
                  <input
                    id="imageUpload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={config.supportedFormats.map(format => `.${format}`).join(',')}
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              
              {uploadedFile && (
                <div className="p-4 bg-gray-50 rounded-md flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {uploadedFileUrl && (
                        <img 
                          src={uploadedFileUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedFileUrl("");
                      setProcessingState("idle");
                      setOutputFileUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
              
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              
              {renderToolOptions()}
              
              <Button
                className="w-full"
                disabled={!uploadedFile || processingState === "processing"}
                onClick={processImage}
              >
                {processingState === "processing" ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : processingState === "success" ? (
                  "Process Again"
                ) : (
                  `Process ${config.title.split(' ')[0]}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Processing Canvas (hidden) */}
        <canvas ref={canvasRef} style={{display: 'none'}} />
        <canvas ref={cropCanvasRef} style={{display: 'none'}} />
        
        {/* Results section */}
        {processingState === "success" && outputFileUrl && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Processed Result</h3>
              
              <div className="border rounded-md overflow-hidden mb-4">
                <img 
                  src={outputFileUrl} 
                  alt="Processed" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    // In a real implementation, this would generate an actual download
                    const a = document.createElement('a');
                    a.href = outputFileUrl;
                    a.download = `processed-${uploadedFile?.name || 'image'}.${convertTo || uploadedFile?.name.split('.').pop()}`;
                    a.click();
                  }}
                >
                  Download Result
                </Button>
                
                {/* Example for sharing options in a real implementation */}
                <Button variant="outline" className="w-full">
                  Share Result
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const toolInterface = (
    <div className="space-y-6">
      {renderInterface()}
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">About {config.title}</h3>
          <div className="text-sm space-y-4">
            <p>
              Our {config.title} helps you {
                toolType.includes("compressor") || toolType.includes("compress") ? "reduce file sizes while maintaining quality" :
                toolType.includes("converter") || toolType.includes("-to-") ? "convert between formats with perfect quality" :
                toolType.includes("resizer") || toolType.includes("resize") ? "resize images with precision while preserving quality" :
                toolType.includes("search") ? "find similar images or faces across the web" :
                "process your images professionally"
              }. Simply upload your {
                toolType.includes("video") ? "video" : "image"
              }, adjust your preferences, and let our tool handle the rest.
            </p>
            
            <div>
              <h4 className="font-medium mb-2">Common Uses:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {toolType.includes("compressor") || toolType.includes("compress") ? (
                  <>
                    <li>Optimizing images for websites to improve loading speed</li>
                    <li>Reducing file sizes for email attachments</li>
                    <li>Meeting file size requirements for uploads</li>
                    <li>Saving storage space while maintaining quality</li>
                    <li>Creating web-optimized versions of high-resolution photos</li>
                  </>
                ) : toolType.includes("converter") || toolType.includes("-to-") ? (
                  <>
                    <li>Converting between formats for compatibility</li>
                    <li>Creating transparent PNGs from JPGs with background removal</li>
                    <li>Converting to web-optimized formats</li>
                    <li>Creating specific formats required for projects</li>
                    <li>Batch converting multiple files to a standard format</li>
                  </>
                ) : toolType.includes("resizer") || toolType.includes("resize") ? (
                  <>
                    <li>Resizing images for social media profiles and posts</li>
                    <li>Creating specific dimensions for website layouts</li>
                    <li>Preparing images for printing at the right dimensions</li>
                    <li>Creating thumbnails from larger images</li>
                    <li>Standardizing image sizes for a consistent look</li>
                  </>
                ) : toolType.includes("search") ? (
                  <>
                    <li>Finding the original source of an image</li>
                    <li>Verifying image authenticity</li>
                    <li>Discovering where an image appears online</li>
                    <li>Finding higher resolution versions of images</li>
                    <li>Checking if your images are being used without permission</li>
                  </>
                ) : (
                  <>
                    <li>Enhancing images for professional or personal use</li>
                    <li>Preparing images for specific platforms or purposes</li>
                    <li>Creating optimized images for various projects</li>
                    <li>Editing and adjusting images to meet requirements</li>
                    <li>Converting and transforming images between formats</li>
                  </>
                )}
              </ul>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>Note: For best results, we recommend using high-quality original images when possible. All processing happens directly in your browser for complete privacy.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ToolPageTemplate
      toolSlug={config.slug}
      toolContent={
        <ToolContentTemplate
          introduction={config.introduction}
          description={config.description}
          howToUse={config.howToUse}
          features={config.features}
          faqs={config.faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default ImageToolsDetailed;