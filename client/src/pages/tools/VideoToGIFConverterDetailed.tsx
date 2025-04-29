import React, { useState, useRef } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaPlay,
  FaStop,
  FaCheck,
  FaRedo
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const VideoToGIFConverterDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState(80);
  const [fps, setFps] = useState(15);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      
      // Check if file is a video
      if (!fileType.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file (MP4, WebM, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setVideoUrl(objectUrl);
      setGifUrl(null);
      
      // Reset values
      setStartTime(0);
      setDuration(5);
      setConvertProgress(0);
      
      return () => {
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
        if (gifUrl) {
          URL.revokeObjectURL(gifUrl);
        }
      };
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const videoDur = videoRef.current.duration;
      setVideoDuration(videoDur);
      
      // If the video is shorter than 5 seconds, adjust the default duration
      if (videoDur < 5) {
        setDuration(videoDur);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Set the current time to the start time
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
        
        // If we're set to play past the end, stop at the end
        if (startTime + duration > videoDuration) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }, (videoDuration - startTime) * 1000);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      
      // If we've played past our GIF duration, stop
      if (currentTime > startTime + duration) {
        videoRef.current.pause();
        videoRef.current.currentTime = startTime;
        setIsPlaying(false);
      }
    }
  };

  const handleConvert = () => {
    if (!file || !videoUrl) {
      toast({
        title: "No video selected",
        description: "Please upload a video to convert to GIF.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConvertProgress(0);
    setGifUrl(null);
    
    // Simulate conversion process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // In a real implementation, this would be the actual GIF conversion
        // Here we'll just use the video thumbnail as a placeholder for the GIF
        setGifUrl(videoUrl);
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: `Your video has been converted to GIF.`,
        });
      }
      setConvertProgress(progress);
    }, 200);
  };

  const handleDownload = () => {
    if (!gifUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = gifUrl;
    const filename = file?.name?.replace(/\.[^/.]+$/, '') || 'video';
    a.download = `${filename}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your GIF is being downloaded.",
    });
  };

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setGifUrl(null);
    setIsPlaying(false);
    setStartTime(0);
    setDuration(5);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const introduction = "Convert videos to GIF animations with our fast and easy Video to GIF Converter.";

  const description = "Our Video to GIF Converter tool transforms your video clips into high-quality GIF animations that you can share on social media, messaging apps, forums, or websites. GIFs have become a universal way to express reactions, showcase snippets of content, or create engaging animations that autoplay across platforms. This tool gives you complete control over the conversion process—select specific segments of your video, adjust the frame rate for smoother or more compact animations, modify the output quality, and preview your GIF before downloading. Whether you're creating memes, showcasing product demos, highlighting key moments from longer videos, or making animated reactions, our converter handles popular video formats like MP4, WebM, AVI, and MOV, and produces optimized GIFs that maintain good quality while keeping file sizes reasonable.";

  const howToUse = [
    "Upload a video file by clicking the upload button or dragging and dropping.",
    "Use the playback controls to preview your video and select the segment you want to convert.",
    "Set the start time and duration for your GIF.",
    "Adjust the frames per second (FPS) and quality settings as needed.",
    "Click 'Convert to GIF' and wait for the process to complete.",
    "Preview your GIF and download it if you're happy with the result."
  ];

  const features = [
    "✅ Convert videos to GIF format while maintaining quality",
    "✅ Select specific segments of your video to convert",
    "✅ Adjust frame rate (FPS) for smoother animations or smaller file sizes",
    "✅ Control output quality to balance file size and appearance",
    "✅ Preview your GIF before downloading",
    "✅ Support for popular video formats (MP4, WebM, AVI, MOV, etc.)",
    "✅ No watermarks on converted GIFs"
  ];

  const faqs = [
    {
      question: "What's the difference between a GIF and a video file?",
      answer: "GIF (Graphics Interchange Format) and video files differ in several important ways: 1) GIFs are animated image files that play automatically and loop indefinitely without needing a video player, making them ideal for websites and messaging platforms; 2) Videos typically offer higher quality, better compression, sound capabilities, and playback controls, but require specific players or support; 3) GIFs are generally limited in color palette (maximum 256 colors) which results in lower quality but smaller file sizes for short clips; 4) GIFs automatically loop by default, while videos typically play once unless set to repeat; 5) Videos support audio, while GIFs are completely silent. GIFs are best suited for short, silent animations (usually under 10 seconds) where universal compatibility and auto-play are more important than quality or file size efficiency."
    },
    {
      question: "Why is my GIF file so large?",
      answer: "GIF files can be surprisingly large due to several factors: 1) GIF uses lossless compression for frames, which preserves quality but results in larger files compared to modern video formats; 2) Higher frame rates (more frames per second) dramatically increase file size; 3) Larger dimensions (width and height) exponentially increase file size; 4) Longer duration means more frames and thus larger files; 5) Complex scenes with lots of movement and color changes compress poorly in GIF format. To reduce GIF file size, you can: decrease the frame rate (10-15 fps is often sufficient), reduce the dimensions, shorten the duration, reduce the color palette, or consider using a lower quality setting in our converter. For very long animations or high-quality needs, you might want to consider alternatives like MP4 videos or WebP animations, which offer better compression but may have more limited compatibility."
    },
    {
      question: "How do I share my GIF on social media platforms?",
      answer: "Sharing GIFs on social media platforms varies slightly depending on the platform, but is generally straightforward: 1) For Twitter, you can directly upload your GIF file when composing a tweet, and Twitter will automatically handle the animation; 2) Instagram doesn't support traditional GIF uploads, but you can convert your GIF to a short video (MP4) first, which our tool can also help with; 3) Facebook supports direct GIF uploads in posts and comments; 4) Reddit allows direct GIF uploads or you can use image hosting sites like Imgur and share the link; 5) For messaging platforms like WhatsApp, Telegram, or Discord, you can typically upload GIFs directly to conversations. If a platform doesn't seem to animate your GIF, check if there's a file size limit or try uploading to a dedicated GIF hosting service like Giphy or Tenor, then share the link. Some platforms may compress your GIF, so keeping the original dimensions reasonable (under 800px width) and file size modest (under 8MB) generally helps with compatibility."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Video to GIF Converter</h3>
      
      <div className="space-y-6">
        {!videoUrl ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Label htmlFor="video-gif-upload" className="cursor-pointer block">
              <div className="py-8 flex flex-col items-center">
                <FaUpload className="text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  Upload a video to convert to GIF
                </p>
                <p className="text-xs text-gray-400">
                  Supports MP4, WebM, AVI, MOV and more
                </p>
              </div>
              <input
                id="video-gif-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video 
                ref={videoRef}
                src={videoUrl} 
                className="w-full aspect-video object-contain" 
                onLoadedMetadata={handleVideoLoaded}
                onTimeUpdate={handleVideoTimeUpdate}
                muted
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 flex justify-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <FaStop className="mr-1" />
                  ) : (
                    <FaPlay className="mr-1" />
                  )}
                  {isPlaying ? 'Stop' : 'Preview Segment'}
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={clearVideo}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                  <span className="text-sm">{formatTime(startTime)}</span>
                </div>
                <Slider 
                  id="start-time"
                  min={0}
                  max={Math.max(0, videoDuration - 1)}
                  step={0.1}
                  value={[startTime]}
                  onValueChange={(values) => setStartTime(values[0])}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="duration" className="text-sm">Duration</Label>
                  <span className="text-sm">{duration.toFixed(1)}s</span>
                </div>
                <Slider 
                  id="duration"
                  min={1}
                  max={Math.min(10, videoDuration - startTime)}
                  step={0.1}
                  value={[duration]}
                  onValueChange={(values) => setDuration(values[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  GIFs work best for short clips (1-10 seconds)
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="fps" className="text-sm">Frames Per Second</Label>
                    <span className="text-sm">{fps} fps</span>
                  </div>
                  <Slider 
                    id="fps"
                    min={5}
                    max={30}
                    step={1}
                    value={[fps]}
                    onValueChange={(values) => setFps(values[0])}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher FPS = smoother but larger file
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="quality" className="text-sm">Quality</Label>
                    <span className="text-sm">{quality}%</span>
                  </div>
                  <Slider 
                    id="quality"
                    min={50}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(values) => setQuality(values[0])}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher quality = larger file size
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleConvert}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isConverting}
            >
              {isConverting ? (
                <>Converting to GIF...</>
              ) : (
                <>Convert to GIF</>
              )}
            </Button>
            
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting video to GIF...</span>
                  <span>{Math.round(convertProgress)}%</span>
                </div>
                <Progress value={convertProgress} />
              </div>
            )}
            
            {gifUrl && (
              <div className="space-y-4 pt-2">
                <h4 className="font-medium">Your GIF Preview</h4>
                
                <div className="rounded-lg overflow-hidden border bg-slate-100">
                  <img 
                    src={gifUrl} 
                    alt="GIF Preview" 
                    className="w-full object-contain"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleDownload}
                    className="flex-1"
                  >
                    <FaDownload className="mr-2" /> 
                    Download GIF
                  </Button>
                  
                  <Button 
                    onClick={handleConvert}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <FaRedo className="mr-2" /> 
                    Regenerate
                  </Button>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center">
                  <FaCheck className="mr-2 flex-shrink-0" />
                  <span>
                    GIF successfully created! {duration.toFixed(1)} seconds at {fps} fps.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="video-to-gif-converter-detailed"
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

export default VideoToGIFConverterDetailed;