import { Link } from "wouter";
import { Tool } from "@/data/tools";

interface CategoryToolCardProps {
  tool: Tool;
}

const CategoryToolCard = ({ tool }: CategoryToolCardProps) => {
  // Check if the slug already has a "-detailed" suffix
  const getToolUrl = (slug: string) => {
    // Some tools have a special case - they can be accessed directly
    const directAccessSlugs = [
      // Unit converter tools
      "unit-converter", "time-converter", "power-converter", "speed-converter",
      "volume-conversion", "length-converter", "voltage-converter", "area-converter",
      "weight-converter", "byte-converter", "temperature-conversion", "torque-converter",
      "pressure-conversion",
      // JSON tools
      "json-viewer", "json-formatter", "json-validator", "json-to-xml", 
      "json-editor", "json-beautifier",
      // Domain tools
      "domain-age-checker", "domain-ip-lookup", "domain-hosting-checker", 
      "domain-authority-checker", "find-dns-records", "domain-name-search", 
      "domain-to-ip", "check-blacklist-ip", "find-expired-domains", 
      "bulk-domain-rating-checker", "index-pages-checker"
    ];
    
    if (directAccessSlugs.includes(slug)) {
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
      "ptcl-speed-test": "ptcl-speed-test-detailed",
      "link-tracker": "link-tracker-detailed",
      "reverse-ip-lookup": "reverse-ip-lookup-detailed",
      "check-server-status": "check-server-status-detailed",
      "class-c-ip-checker": "class-c-ip-checker-detailed",
      "code-to-text-ratio-checker": "code-to-text-ratio-checker-detailed",
      "alexa-rank-comparison": "alexa-rank-comparison-detailed",
      "page-comparison": "page-comparison-detailed",
      "spider-simulator": "spider-simulator-detailed",
      "comparison-search": "comparison-search-detailed",
      "google-cache-checker": "google-cache-checker-detailed",
      "whois-lookup": "whois-lookup-detailed",
      "mozrank-checker": "mozrank-checker-detailed",
      "page-authority-checker": "page-authority-checker-detailed",
      "google-index-checker": "google-index-checker-detailed",
      "alexa-rank-checker": "alexa-rank-checker-detailed",
      "redirect-checker": "redirect-checker-detailed",
      "similar-site-checker": "similar-site-checker-detailed",
      "cloaking-checker": "cloaking-checker-detailed",
      "google-malware-checker": "google-malware-checker-detailed",
      "find-facebook-id": "find-facebook-id-detailed",
      "check-gzip-compression": "check-gzip-compression-detailed",
      "ssl-checker": "ssl-checker-detailed",
      "pokemon-go-server-status-finder": "pokemon-go-server-status-finder-detailed",
      "find-blog-sites": "find-blog-sites-detailed",
      "geo-ip-locator": "geo-ip-locator-detailed",
      "apps-rank-tracking-tool": "apps-rank-tracking-tool-detailed",
      "what-is-my-browser": "what-is-my-browser-detailed",
      "check-social-status": "check-social-status-detailed",
      "pdf-to-word": "pdf-to-word-detailed",
      "word-to-pdf": "word-to-pdf-detailed",
      "pdf-to-jpg": "pdf-to-jpg-detailed",
      "jpg-to-pdf": "jpg-to-pdf-detailed",
      "merge-pdf": "merge-pdf-detailed",
      "compress-pdf": "compress-pdf-detailed",
      "rotate-pdf": "rotate-pdf-detailed",
      "unlock-pdf": "unlock-pdf-detailed",
      "lock-pdf": "lock-pdf-detailed",
      "watermark": "watermark-detailed",
      "powerpoint-to-pdf": "powerpoint-to-pdf-detailed",
      "excel-to-pdf": "excel-to-pdf-detailed",
      "split-pdf": "split-pdf-detailed",
      "compress-pdf-to-50kb": "compress-pdf-to-50kb-detailed",
      "compress-pdf-to-100kb": "compress-pdf-to-100kb-detailed",
      "compress-pdf-to-150kb": "compress-pdf-to-150kb-detailed",
      "compress-pdf-to-200kb": "compress-pdf-to-200kb-detailed",
      "resize-pdf-to-200kb": "resize-pdf-to-200kb-detailed",
      "compress-pdf-to-300kb": "compress-pdf-to-300kb-detailed",
      "compress-pdf-to-500kb": "compress-pdf-to-500kb-detailed",
      "compress-pdf-to-1mb": "compress-pdf-to-1mb-detailed",
      "compress-pdf-to-2mb": "compress-pdf-to-2mb-detailed",
      "pdf-to-zip": "pdf-to-zip-detailed",
      "delete-pages-from-pdf": "delete-pages-from-pdf-detailed",
      "pdf-to-bmp": "pdf-to-bmp-detailed",
      "gif-to-pdf": "gif-to-pdf-detailed",
      "pdf-to-tiff": "pdf-to-tiff-detailed",
      "tiff-to-pdf": "tiff-to-pdf-detailed",
      "png-to-pdf": "png-to-pdf-detailed",
      "svg-to-pdf": "svg-to-pdf-detailed",
      "pdf-to-svg": "pdf-to-svg-detailed",
      "pdf-to-png": "pdf-to-png-detailed",
      "bmp-to-pdf": "bmp-to-pdf-detailed",
      "remove-password-from-pdf": "remove-password-from-pdf-detailed",
      "pdf-page-remover": "pdf-page-remover-detailed"
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
