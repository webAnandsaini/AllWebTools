import { Link } from "wouter";
import { Tool } from "@/data/tools";

interface CategoryToolCardProps {
  tool: Tool;
}

const CategoryToolCard = ({ tool }: CategoryToolCardProps) => {
  // Check if the slug already has a "-detailed" suffix
  const getToolUrl = (slug: string) => {
    // Unit converter tools have a special case - they can be accessed directly
    const unitConverterSlugs = [
      "unit-converter", "time-converter", "power-converter", "speed-converter",
      "volume-conversion", "length-converter", "voltage-converter", "area-converter",
      "weight-converter", "byte-converter", "temperature-conversion", "torque-converter",
      "pressure-conversion"
    ];
    
    if (unitConverterSlugs.includes(slug)) {
      return `/${slug}`;
    }
    
    // If the slug already ends with "-detailed", use it directly
    if (slug.endsWith("-detailed")) {
      return `/tools/${slug}`;
    }
    
    // Otherwise, map it to the detailed version
    const detailedToolsMap: Record<string, string> = {
      // Text Analysis Tools
      "article-rewriter": "article-rewriter-detailed",
      "plagiarism-checker": "plagiarism-checker-detailed",
      "word-counter": "word-counter-detailed",
      "grammar-checker": "grammar-checker-detailed",
      "spell-checker": "spell-checker-detailed",
      "paraphrasing-tool": "paraphrasing-tool-detailed",
      "text-to-speech": "text-to-speech-detailed",
      "speech-to-text": "speech-to-text-detailed",
      "text-summarizer": "text-summarizer-detailed",
      "ai-content-detector": "ai-content-detector-detailed",
      "ocr": "ocr-detailed",
      "md5-generator": "md5-generator-detailed",
      "uppercase-to-lowercase": "uppercase-to-lowercase-detailed",
      "word-combiner": "word-combiner-detailed",
      "image-to-text": "image-to-text-detailed",
      "translate-english-to-hindi": "translate-english-to-hindi-detailed",
      "text-to-image": "text-to-image-detailed",
      "jpg-to-word": "jpg-to-word-detailed",
      "small-text-generator": "small-text-generator-detailed",
      "online-text-editor": "online-text-editor-detailed",
      "reverse-text-generator": "reverse-text-generator-detailed",
      "sentence-rephraser": "sentence-rephraser-detailed",
      "sentence-checker": "sentence-checker-detailed",
      "rewording-tool": "rewording-tool-detailed",
      "punctuation-checker": "punctuation-checker-detailed",
      "essay-checker": "essay-checker-detailed",
      "paper-checker": "paper-checker-detailed",
      "online-proofreader": "online-proofreader-detailed",
      "word-changer": "word-changer-detailed",
      "sentence-rewriter": "sentence-rewriter-detailed",
      "essay-rewriter": "essay-rewriter-detailed",
      "paraphrase-generator": "paraphrase-generator-detailed",
      "sentence-changer": "sentence-changer-detailed",
      "image-translator": "image-translator-detailed",
      "chatgpt-detector": "chatgpt-detector-detailed",
      "citation-generator": "citation-generator-detailed",
      "online-notepad": "online-notepad-detailed",
      "invisible-character": "invisible-character-detailed",
      
      // Design Studio Tools
      "logo-maker": "logo-maker-detailed",
      "resume-builder": "resume-builder-detailed",
      "flyer-maker": "flyer-maker-detailed",
      "poster-maker": "poster-maker-detailed",
      "invitation-maker": "invitation-maker-detailed", 
      "business-card-maker": "business-card-maker-detailed",
      "meme-generator": "meme-generator-detailed",
      "emojis": "emojis-detailed",
      
      // IP Tools
      "what-is-my-ip": "what-is-my-ip-detailed",
      "ip-location": "ip-location-detailed",
      "free-daily-proxy-list": "free-daily-proxy-list-detailed",
      
      // Password Management Tools
      "password-generator": "password-generator-detailed",
      "password-strength-checker": "password-strength-checker-detailed",
      "password-encryption-utility": "password-encryption-utility-detailed",
      
      // Image Editing Tools
      "reverse-image-search": "reverse-image-search-detailed",
      "face-search": "face-search-detailed",
      "image-compressor": "image-compressor-detailed",
      "favicon-generator": "favicon-generator-detailed",
      "video-to-gif-converter": "video-to-gif-converter-detailed",
      "image-resizer": "image-resizer-detailed",
      "photo-resizer-in-kb": "photo-resizer-in-kb-detailed",
      "crop-image": "crop-image-detailed",
      "convert-to-jpg": "convert-to-jpg-detailed",
      "rgb-to-hex": "rgb-to-hex-detailed",
      "png-to-jpg": "png-to-jpg-detailed",
      "jpg-to-png": "jpg-to-png-detailed",
      
      // JSON Tools
      "json-viewer": "json-viewer-detailed",
      "json-formatter": "json-formatter-detailed",
      "json-validator": "json-validator-detailed",
      "json-to-xml": "json-to-xml-detailed",
      "json-editor": "json-editor-detailed",
      "json-beautifier": "json-beautifier-detailed",
      
      // Keyword Tools
      "keyword-position": "keyword-position-detailed",
      "keyword-density-checker": "keyword-density-checker-detailed",
      "keywords-density-checker": "keywords-density-checker-detailed", 
      "keywords-suggestions-tool": "keywords-suggestions-tool-detailed",
      "keyword-research-tool": "keyword-research-tool-detailed",
      "keyword-competition-tool": "keyword-competition-tool-detailed",
      "related-keywords-finder": "related-keywords-finder-detailed", 
      "long-tail-keyword-suggestion-tool": "long-tail-keyword-suggestion-tool-detailed",
      "keywords-rich-domains-suggestions-tool": "keywords-rich-domains-suggestions-tool-detailed",
      "seo-keyword-competition-analysis": "seo-keyword-competition-analysis-detailed",
      "live-keyword-analyzer": "live-keyword-analyzer-detailed",
      "keyword-overview-tool": "keyword-overview-tool-detailed",
      "keyword-difficulty-checker": "keyword-difficulty-checker-detailed",
      "paid-keyword-finder": "paid-keyword-finder-detailed",
      
      // Backlink Tools
      "backlink-checker": "backlink-checker-detailed",
      "backlink-maker": "backlink-maker-detailed",
      "website-link-count-checker": "website-link-count-checker-detailed",
      "website-broken-link-checker": "website-broken-link-checker-detailed",
      "link-price-calculator": "link-price-calculator-detailed",
      "reciprocal-link-checker": "reciprocal-link-checker-detailed",
      "website-link-analyzer": "website-link-analyzer-detailed",
      "broken-backlink-checker": "broken-backlink-checker-detailed",
      "valuable-backlink-checker": "valuable-backlink-checker-detailed",
      "backlinks-competitors": "backlinks-competitors-detailed",
      "anchor-text-distribution": "anchor-text-distribution-detailed",
      
      // Website Management Tools
      "website-seo-score-checker": "website-seo-score-checker-detailed",
      "google-pagerank-checker": "google-pagerank-checker-detailed",
      "online-ping-website-tool": "online-ping-website-tool-detailed",
      "page-speed-test": "page-speed-test-detailed",
      "website-page-size-checker": "website-page-size-checker-detailed",
      "website-page-snooper": "website-page-snooper-detailed",
      "website-hit-counter": "website-hit-counter-detailed",
      "xml-sitemap-generator": "xml-sitemap-generator-detailed",
      "url-rewriting-tool": "url-rewriting-tool-detailed",
      "what-is-my-screen-resolution": "what-is-my-screen-resolution-detailed",
      "url-encoder-decoder": "url-encoder-decoder-detailed",
      "adsense-calculator": "adsense-calculator-detailed",
      "open-graph-checker": "open-graph-checker-detailed",
      "open-graph-generator": "open-graph-generator-detailed",
      "qr-code-generator": "qr-code-generator-detailed",
      "htaccess-redirect-generator": "htaccess-redirect-generator-detailed",
      "get-http-headers": "get-http-headers-detailed",
      "twitter-card-generator": "twitter-card-generator-detailed",
      "internet-speed-test": "internet-speed-test-detailed",
      "wordpress-theme-detector": "wordpress-theme-detector-detailed",
      "instant-search-suggestions-tool": "instant-search-suggestions-tool-detailed",
      "online-virus-scan": "online-virus-scan-detailed",
      "website-screenshot-generator": "website-screenshot-generator-detailed",
      "secure-email": "secure-email-detailed",
      "mobile-friendly-test": "mobile-friendly-test-detailed",
      "video-downloader": "video-downloader-detailed",
      "facebook-video-downloader": "facebook-video-downloader-detailed",
      "soundcloud-downloader": "soundcloud-downloader-detailed",
      "vimeo-video-downloader": "vimeo-video-downloader-detailed",
      "instagram-video-downloader": "instagram-video-downloader-detailed",
      "dailymotion-video-downloader": "dailymotion-video-downloader-detailed",
      "minify-css": "minify-css-detailed",
      "minify-html": "minify-html-detailed",
      "minify-js": "minify-js-detailed",
      "robots-txt-generator": "robots-txt-generator-detailed",
      "url-shortener": "url-shortener-detailed",
      "website-checker": "website-checker-detailed",
      "url-opener": "url-opener-detailed",
      "php-formatter": "php-formatter-detailed",
      "html-formatter": "html-formatter-detailed",
      "html-editor": "html-editor-detailed",
      "html-viewer": "html-viewer-detailed",
      "xml-formatter": "xml-formatter-detailed",
      "xml-beautifier": "xml-beautifier-detailed",
      "twitter-video-downloader": "twitter-video-downloader-detailed",
      "twitter-gif-downloader": "twitter-gif-downloader-detailed",
      "tiktok-video-downloader": "tiktok-video-downloader-detailed",
      "instagram-reels-downloader": "instagram-reels-downloader-detailed",
      "facebook-reels-downloader": "facebook-reels-downloader-detailed",
      "tiktok-to-mp4": "tiktok-to-mp4-detailed",
      "instagram-to-mp4": "instagram-to-mp4-detailed",
      "twitter-to-mp4": "twitter-to-mp4-detailed",
      "facebook-to-mp4": "facebook-to-mp4-detailed",
      "pinterest-video-downloader": "pinterest-video-downloader-detailed",
      "reddit-video-downloader": "reddit-video-downloader-detailed",
      "mp4-downloader": "mp4-downloader-detailed",
      "ptcl-speed-test": "ptcl-speed-test-detailed"
    };
    
    return `/tools/${detailedToolsMap[slug] || slug}`;
  };

  return (
    <Link
      href={getToolUrl(tool.slug)}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex items-center"
    >
      <div className={`w-10 h-10 rounded-lg ${tool.iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
        <i className={`${tool.icon} ${tool.iconColor}`}></i>
      </div>
      <span className="font-medium truncate">{tool.name}</span>
    </Link>
  );
};

export default CategoryToolCard;
