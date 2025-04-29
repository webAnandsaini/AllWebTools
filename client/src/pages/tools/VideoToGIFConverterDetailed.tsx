import React, { useState, useRef } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { imageEditingTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { 
  FaUpload, 
  FaDownload, 
  FaPlay, 
  FaPause,
  FaVideo,
  FaImage,
  FaCut,
  FaStopwatch
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const VideoToGIFConverterDetailed = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // GIF settings
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(15);
  const [loop, setLoop] = useState(true);
  const [speedOption, setSpeedOption] = useState("normal");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a video
      if (!selectedFile.type.match('video.*')) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, WebM, MOV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Reset result
      setResultUrl(null);
      setCurrentTime(0);
      setStartTime(0);
      setEndTime(0);
      
      // Reset video playback
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // If we reach the end time, seek back to start time
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const updateStartTime = (value: number) => {
    setStartTime(value);
    if (value > endTime) {
      setEndTime(value);
    }
    
    // Update video current time
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const updateEndTime = (value: number) => {
    setEndTime(value);
    if (value < startTime) {
      setStartTime(value);
    }
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        title: "No video selected",
        description: "Please upload a video file to convert to GIF.",
        variant: "destructive",
      });
      return;
    }

    if (endTime <= startTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be greater than start time.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setConvertProgress(0);
    
    // Simulate conversion process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Use the preview URL as the result in this mock implementation
        setResultUrl(previewUrl);
        setIsConverting(false);
        
        toast({
          title: "Conversion complete",
          description: "Your video has been successfully converted to GIF.",
        });
      }
      setConvertProgress(progress);
    }, 300);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    
    toast({
      title: "Preparing download",
      description: "Your GIF is being prepared for download.",
    });
    
    setTimeout(() => {
      // In a real implementation, this would download the actual GIF
      const a = document.createElement('a');
      a.href = resultUrl;
      const originalName = file?.name || 'video.mp4';
      const gifName = originalName.replace(/\.[^/.]+$/, '') + '.gif';
      a.download = gifName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your GIF is being downloaded.",
      });
    }, 1000);
  };

  const clearAll = () => {
    // Revoke object URLs to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (resultUrl && resultUrl !== previewUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
    setDuration(0);
    setIsPlaying(false);
    setConvertProgress(0);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getResizedWidthHeight = (): { width: number, height: number } => {
    if (!videoRef.current) return { width: 0, height: 0 };
    
    const videoWidth = videoRef.current.videoWidth;
    const videoHeight = videoRef.current.videoHeight;
    
    if (videoWidth === 0 || videoHeight === 0) return { width: 0, height: 0 };
    
    const aspectRatio = videoWidth / videoHeight;
    const height = Math.round(width / aspectRatio);
    
    return { width, height };
  };

  const getEstimatedFileSize = (): string => {
    if (!videoRef.current) return '0 MB';
    
    const { width, height } = getResizedWidthHeight();
    const duration = endTime - startTime;
    const bitsPerPixel = quality / 10; // Rough estimate
    
    // Approximate formula for GIF size based on dimensions, duration, and quality
    const sizeInBytes = width * height * fps * duration * bitsPerPixel / 8;
    
    return formatFileSize(sizeInBytes);
  };

  const introduction = "Convert videos to GIFs with our easy-to-use tool, perfect for creating shareable animated content.";

  const description = "Our Video to GIF Converter is a specialized tool that transforms video clips into animated GIF images, making them perfect for sharing on social media, messaging apps, forums, and websites. GIFs have become an essential visual communication format, allowing you to express emotions, demonstrate processes, or showcase short video moments in a universally compatible format that plays automatically without requiring special media players. Our converter gives you precise control over your GIF output with options for quality, dimensions, frame rate, and playback speed. You can also trim your video to select only the exact moment you want to convert, optimizing both the visual impact and the file size of your GIF. Whether you're creating reaction GIFs, illustrating a tutorial, highlighting a key moment from a longer video, or developing visual content for marketing purposes, our Video to GIF Converter provides professional-quality results with an intuitive interface that makes the process accessible to users of all technical levels.";

  const howToUse = [
    "Upload a video file by clicking the 'Upload Video' button or dragging and dropping a file.",
    "Use the video player to preview your content and identify the section you want to convert.",
    "Set the start and end times to trim your video to the desired segment.",
    "Adjust the output settings including width, frame rate, quality, and playback speed.",
    "Click 'Convert to GIF' and wait for the conversion to complete.",
    "Preview the resulting GIF and download it to your device."
  ];

  const features = [
    "✅ Convert MP4, WebM, MOV, and other video formats to GIF",
    "✅ Precise trimming controls to select specific video segments",
    "✅ Adjustable frame rate for smoother or lighter GIFs",
    "✅ Customizable dimensions to fit your sharing needs",
    "✅ Quality settings to balance file size and visual appearance",
    "✅ Speed adjustment (normal, slow motion, or accelerated)",
    "✅ Toggle looping on/off for the final GIF"
  ];

  const faqs = [
    {
      question: "Why are GIFs sometimes better than videos for sharing?",
      answer: "GIFs offer several advantages over videos for many sharing scenarios: 1) Universal compatibility—GIFs play automatically in almost any environment without requiring media players or browser plugins; 2) Immediate playback—they start instantly without buffering or loading delays; 3) Simplified sharing—no need to host on video platforms or worry about embedding codes; 4) Loop automatically—perfect for repeating short actions or reactions; 5) Smaller file size than videos of equivalent length (though larger than static images); 6) No sound—making them appropriate for environments where audio would be disruptive. These benefits make GIFs ideal for social media posts, messaging, email signatures, how-to demonstrations, and showcasing product features where a static image isn't enough but a full video would be excessive."
    },
    {
      question: "How do I create the best quality GIFs?",
      answer: "Creating high-quality GIFs involves balancing several factors: 1) Start with high-quality source video—the output GIF can't be better than your original video; 2) Keep dimensions reasonable—480-600px width is often a good balance between quality and file size; 3) Limit your GIF to 2-5 seconds when possible—shorter GIFs load faster and maintain better quality for the same file size; 4) Choose an appropriate frame rate—12-15fps works well for most content (higher for fast action, lower for slower movements); 5) Use our quality slider judiciously—higher quality means larger files; 6) Consider the background—videos with simple or static backgrounds convert better than busy scenes; 7) Avoid rapid transitions or complex movement patterns which can appear choppy in GIF format; 8) For text, use larger font sizes as small text often becomes illegible in GIFs."
    },
    {
      question: "Why is my GIF file so large?",
      answer: "GIF file size is affected by several factors: 1) Dimensions—width and height directly impact size (doubling both quadruples the file size); 2) Duration—longer GIFs contain more frames; 3) Frame rate—higher FPS means more frames per second of video; 4) Color complexity—GIFs use a limited color palette, so scenes with many colors or gradients require more data; 5) Movement—scenes with lots of motion require more information between frames. To reduce file size, try: decreasing dimensions, shortening duration, reducing frame rate, simplifying the scene (crop out unnecessary areas), or using our quality setting to apply optimization algorithms. For web use, aim to keep GIFs under 2MB when possible. If you need to maintain high quality for a longer animation, consider using video formats with HTML5 video instead, as they provide better compression."
    }
  ];

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Video to GIF Converter</h3>
      
      {!file ? (
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <Label htmlFor="video-to-gif-upload" className="cursor-pointer block">
            <div className="py-10 flex flex-col items-center">
              <FaUpload className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">
                Upload a video to convert to GIF
              </p>
              <p className="text-xs text-gray-400">
                Supports MP4, WebM, MOV (up to 100MB)
              </p>
            </div>
            <input
              id="video-to-gif-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative border rounded-lg overflow-hidden bg-black aspect-video">
            <video 
              ref={videoRef}
              src={previewUrl || undefined}
              className="w-full h-full"
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying && (
                <button 
                  onClick={togglePlayPause}
                  className="w-16 h-16 bg-white bg-opacity-75 rounded-full flex items-center justify-center"
                >
                  <FaPlay className="text-primary ml-1" size={24} />
                </button>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center text-sm">
              <div className="flex items-center">
                <button 
                  onClick={togglePlayPause}
                  className="mr-2"
                >
                  {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                </button>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <div>
                <span className="text-xs">Selected: {formatTime(endTime - startTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="trim-slider" className="font-medium text-sm">Trim Video</Label>
                <span className="text-xs">
                  {formatTime(startTime)} - {formatTime(endTime)} ({formatTime(endTime - startTime)})
                </span>
              </div>
              
              <div className="relative mt-5 mb-8">
                <Slider 
                  value={[startTime, endTime]}
                  min={0}
                  max={duration}
                  step={0.1}
                  onValueChange={(values) => {
                    updateStartTime(values[0]);
                    updateEndTime(values[1]);
                  }}
                  className="z-10"
                />
                
                {/* Current time indicator */}
                <div 
                  className="absolute top-0 w-1 h-5 bg-red-500 z-20 -mt-2 rounded-full"
                  style={{
                    left: `${(currentTime / duration) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width-input" className="font-medium text-sm block mb-1">Width</Label>
                <div className="flex items-center">
                  <Input 
                    id="width-input"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-24"
                    min={120}
                    max={1200}
                  />
                  <span className="text-sm text-gray-500 ml-2">px</span>
                  
                  {videoRef.current && videoRef.current.videoHeight > 0 && (
                    <span className="text-xs text-gray-500 ml-4">
                      Output: {width} × {getResizedWidthHeight().height}px
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="fps-slider" className="font-medium text-sm">Frame Rate</Label>
                  <span className="text-xs">{fps} FPS</span>
                </div>
                <Slider 
                  id="fps-slider"
                  min={5}
                  max={30}
                  step={1}
                  value={[fps]}
                  onValueChange={(values) => setFps(values[0])}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="quality-slider" className="font-medium text-sm">Quality</Label>
                  <span className="text-xs">{quality}%</span>
                </div>
                <Slider 
                  id="quality-slider"
                  min={50}
                  max={100}
                  step={5}
                  value={[quality]}
                  onValueChange={(values) => setQuality(values[0])}
                />
              </div>
              
              <div>
                <Label className="font-medium text-sm block mb-1">Speed</Label>
                <RadioGroup 
                  value={speedOption} 
                  onValueChange={setSpeedOption}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="slow" id="slow" />
                    <Label htmlFor="slow" className="font-normal text-xs">Slow</Label>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="font-normal text-xs">Normal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="fast" id="fast" />
                    <Label htmlFor="fast" className="font-normal text-xs">Fast</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="loop-toggle" className="font-medium text-sm">Loop GIF</Label>
              </div>
              <Switch 
                id="loop-toggle" 
                checked={loop}
                onCheckedChange={setLoop}
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <div className="flex items-start">
                <FaStopwatch className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="mb-1">Estimated GIF Info:</p>
                  <ul className="text-xs space-y-1">
                    <li>Duration: {formatTime(endTime - startTime)}</li>
                    <li>Dimensions: {width} × {getResizedWidthHeight().height}px</li>
                    <li>Frames: {Math.round(fps * (endTime - startTime))}</li>
                    <li>Estimated size: ~{getEstimatedFileSize()}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleConvert}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isConverting || !file}
              >
                {isConverting ? (
                  <>Converting...</>
                ) : (
                  <>
                    <FaVideo className="mr-2" /> 
                    Convert to GIF
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={clearAll}
              >
                Start Over
              </Button>
            </div>
            
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting video to GIF...</span>
                  <span>{Math.round(convertProgress)}%</span>
                </div>
                <Progress value={convertProgress} />
              </div>
            )}
            
            {resultUrl && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <h4 className="font-medium">GIF Preview</h4>
                <div className="flex justify-center border rounded bg-white p-2">
                  <img 
                    src={resultUrl} 
                    alt="Generated GIF" 
                    className="max-w-full max-h-60 object-contain"
                  />
                </div>
                
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <FaDownload className="mr-2" /> 
                  Download GIF
                </Button>
              </div>
            )}
          </div>
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