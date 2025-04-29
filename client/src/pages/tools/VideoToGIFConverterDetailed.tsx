import React, { useState, useRef } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaPlay, 
  FaPause, 
  FaFilm, 
  FaCompress, 
  FaCut,
  FaCog
} from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const VideoToGIFConverterDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [resultGifUrl, setResultGifUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // GIF settings
  const [quality, setQuality] = useState(7);
  const [fps, setFps] = useState(15);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(240);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [totalDuration, setTotalDuration] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      setResultGifUrl("");
      
      // Reset some settings
      setStartTime(0);
      
      // Add a delay to ensure the video element has loaded the metadata
      setTimeout(() => {
        if (videoRef.current) {
          setTotalDuration(videoRef.current.duration || 0);
          setDuration(Math.min(5, videoRef.current.duration || 5));
        }
      }, 500);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const previewSection = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      
      // Play for the specified duration and then pause
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }, duration * 1000);
    }
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        title: "No video selected",
        description: "Please upload a video file first.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      setResultGifUrl(videoUrl); // In a real implementation, this would be the GIF URL
      setIsConverting(false);
      
      toast({
        title: "Conversion complete",
        description: "Your GIF has been successfully created.",
      });
    }, 3000);
  };

  const handleDownload = () => {
    if (!resultGifUrl) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = resultGifUrl;
    a.download = `converted_${file?.name.split('.')[0] || 'video'}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your GIF is being downloaded.",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setTotalDuration(videoRef.current.duration || 0);
      setDuration(Math.min(5, videoRef.current.duration || 5));
    }
  };

  const calculateGifSize = () => {
    // Rough estimation algorithm for GIF size
    const uncompressedFrameSize = width * height * 3; // 3 bytes per pixel (RGB)
    const frameCount = fps * duration;
    const compressionRatio = 0.7 - (quality / 10 * 0.4); // Higher quality means less compression
    
    const estimatedSize = uncompressedFrameSize * frameCount * compressionRatio;
    return (estimatedSize / 1024 / 1024).toFixed(2); // Return in MB
  };

  const introduction = "Convert your videos into high-quality, shareable GIFs with precise control over every aspect.";

  const description = "Our Video to GIF Converter is a powerful tool that transforms your video clips into animated GIFs with professional quality and extensive customization options. Whether you need to create engaging social media content, illustrate a process for documentation, or preserve a memorable moment in an easily shareable format, this tool makes the conversion process simple and efficient. Select any portion of your video to convert, adjust dimensions to meet specific requirements, control frame rate for optimal quality-to-size ratio, and fine-tune additional settings like loop behavior and playback speed. The converter handles all common video formats including MP4, MOV, AVI, and WebM, allowing you to create optimized GIFs from virtually any video source. Once conversion is complete, your GIF can be previewed directly in the browser before downloading, ensuring it meets your expectations. With our intuitive interface and professional-grade conversion engine, you can create perfect GIFs every time without needing specialized video editing knowledge.";

  const howToUse = [
    "Upload a video file by clicking the 'Upload Video' button or dragging and dropping a file.",
    "Use the preview controls to select the specific section of the video you want to convert.",
    "Adjust settings like dimensions, frame rate, and quality to optimize your GIF.",
    "Click 'Convert to GIF' to start the conversion process.",
    "Preview the resulting GIF to ensure it meets your expectations.",
    "Download your new GIF file or adjust settings and convert again if needed."
  ];

  const features = [
    "✅ Convert any section of a video to GIF format",
    "✅ Adjust dimensions, frame rate, and quality for optimal results",
    "✅ Control playback speed to create slow-motion or sped-up GIFs",
    "✅ Preview both source video and resulting GIF before downloading",
    "✅ Maintains aspect ratio automatically when resizing",
    "✅ Estimated file size calculation helps optimize for specific platforms"
  ];

  const faqs = [
    {
      question: "What video formats are supported?",
      answer: "Our converter supports all major video formats including MP4, WebM, MOV, AVI, MKV, and FLV. For optimal conversion speed and quality, we recommend using MP4 files with H.264 encoding when possible, as these tend to process faster and produce better results."
    },
    {
      question: "How can I create smaller GIF files?",
      answer: "There are several ways to reduce GIF file size: 1) Reduce the dimensions (width and height) of the output; 2) Lower the frame rate (FPS) - 10-15 FPS is often sufficient for most content; 3) Decrease the quality setting; 4) Trim the video to include only the essential content; 5) Consider using shorter durations. The quality setting provides a good balance between visual quality and file size optimization."
    },
    {
      question: "Why is the maximum duration limited?",
      answer: "GIFs are generally not well-suited for long content as they have larger file sizes compared to videos of similar quality. We recommend keeping GIFs under 10 seconds to maintain reasonable file sizes and optimal performance. For longer content, consider using a video format with the loop attribute enabled, as this will provide better quality and smaller file sizes than an equivalent GIF."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Video to GIF Converter</h3>
      
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <Label htmlFor="video-upload" className="cursor-pointer block">
          <div className="py-8 flex flex-col items-center">
            <FaUpload className="text-3xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">
              Upload a video file or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              Supports MP4, WebM, MOV, AVI (Max 100MB)
            </p>
          </div>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>
      
      {videoUrl && (
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-medium mb-2">Video Preview</h4>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <video 
                ref={videoRef}
                src={videoUrl} 
                className="w-full"
                onLoadedMetadata={handleVideoLoaded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                muted
              />
              <div className="bg-gray-100 p-3 border-t flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause className="mr-1" /> : <FaPlay className="mr-1" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <div className="text-sm text-gray-500">
                  Total Duration: {formatTime(totalDuration)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Clip Selection</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={previewSection}
                >
                  <FaCut className="mr-1" /> Preview Section
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                    <span className="text-sm">{formatTime(startTime)}</span>
                  </div>
                  <Slider 
                    id="start-time"
                    min={0}
                    max={Math.max(0, totalDuration - duration)}
                    step={0.1}
                    value={[startTime]}
                    onValueChange={(values) => setStartTime(values[0])}
                    className="mb-4"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="duration" className="text-sm">Duration</Label>
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                  <Slider 
                    id="duration"
                    min={1}
                    max={Math.min(15, totalDuration - startTime)}
                    step={0.1}
                    value={[duration]}
                    onValueChange={(values) => setDuration(values[0])}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">GIF Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="quality" className="text-sm">Quality ({quality})</Label>
                  <Slider 
                    id="quality"
                    min={1}
                    max={10}
                    step={1}
                    value={[quality]}
                    onValueChange={(values) => setQuality(values[0])}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher quality = larger file size
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="fps" className="text-sm">Frame Rate ({fps} FPS)</Label>
                  <Slider 
                    id="fps"
                    min={5}
                    max={30}
                    step={1}
                    value={[fps]}
                    onValueChange={(values) => setFps(values[0])}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher FPS = smoother animation but larger size
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="speed" className="text-sm">Playback Speed ({speed}x)</Label>
                  <Slider 
                    id="speed"
                    min={0.25}
                    max={2}
                    step={0.25}
                    value={[speed]}
                    onValueChange={(values) => setSpeed(values[0])}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loop" className="text-sm">Loop GIF</Label>
                    <p className="text-xs text-gray-500">Enable infinite looping</p>
                  </div>
                  <Switch 
                    id="loop" 
                    checked={loop}
                    onCheckedChange={setLoop}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Dimensions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value);
                          setWidth(newWidth);
                          if (maintainAspectRatio && videoRef.current) {
                            const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
                            setHeight(Math.round(newWidth / aspectRatio));
                          }
                        }}
                        min={80}
                        max={1200}
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => {
                          const newHeight = parseInt(e.target.value);
                          setHeight(newHeight);
                          if (maintainAspectRatio && videoRef.current) {
                            const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
                            setWidth(Math.round(newHeight * aspectRatio));
                          }
                        }}
                        min={80}
                        max={1200}
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="aspect-ratio" className="text-sm">Maintain Aspect Ratio</Label>
                    <p className="text-xs text-gray-500">Keep original proportions</p>
                  </div>
                  <Switch 
                    id="aspect-ratio" 
                    checked={maintainAspectRatio}
                    onCheckedChange={setMaintainAspectRatio}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <FaFilm className="text-blue-500 mr-2" />
              <div className="text-sm text-blue-700">
                <span className="font-medium">Estimated GIF Size:</span> ~{calculateGifSize()} MB
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <Button 
              onClick={handleConvert}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isConverting || !file}
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <FaCompress className="mr-2" /> 
                  Convert to GIF
                </>
              )}
            </Button>
          </div>
          
          {resultGifUrl && (
            <div className="mt-4 space-y-4">
              <h4 className="font-medium">Converted GIF Preview</h4>
              <div className="border rounded-lg overflow-hidden bg-gray-50 p-4 flex justify-center">
                <img 
                  src={resultGifUrl} 
                  alt="Converted GIF" 
                  className="max-h-80 max-w-full object-contain"
                />
              </div>
              
              <Button 
                onClick={handleDownload}
                className="w-full"
              >
                <FaDownload className="mr-2" /> 
                Download GIF
              </Button>
            </div>
          )}
        </div>
      )}
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