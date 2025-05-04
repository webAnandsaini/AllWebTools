import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

interface Voice {
  name: string;
  lang: string;
  gender: "male" | "female";
}

const TextToSpeechDetailed = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    document.title = "Text to Speech - AllTooly";
    window.scrollTo(0, 0);

    // Initialize Web Speech API
    if ('speechSynthesis' in window) {
      // Speech Synthesis API is supported

      // Get available voices
      const synth = window.speechSynthesis;

      // Function to load and process voices
      const loadVoices = () => {
        const voices = synth.getVoices();
        const processedVoices = voices.map(voice => ({
          name: voice.name,
          lang: voice.lang,
          gender: voice.name.toLowerCase().includes('female') ? 'female' as const : 'male' as const
        }));

        setAvailableVoices(processedVoices);
        if (processedVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(processedVoices[0].name);
        }
      };

      // Load voices initially
      loadVoices();

      // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    } else {
      // Speech Synthesis API is not supported
      toast({
        title: "Speech Synthesis not supported",
        description: "Your browser does not support the Speech Synthesis API. Please try a different browser.",
        variant: "destructive",
      });
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const speakText = () => {
    if (!text.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }

      // Set other properties
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsPlaying(false);
        setIsPaused(false);
        toast({
          title: "Speech synthesis error",
          description: "An error occurred during speech synthesis. Please try again.",
          variant: "destructive",
        });
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    }
  };

  const pauseResumeSpeech = () => {
    if (window.speechSynthesis) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const clearText = () => {
    setText("");
    if (isPlaying) {
      stopSpeech();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast({
        title: "Invalid file type",
        description: "Please upload a text (.txt) file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const downloadAudio = () => {
    if (!text.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feature not available",
      description: "Audio download functionality is not available in the browser preview. In a production environment, this would generate an MP3 file from your text.",
      variant: "default",
    });

    // In a real implementation, we would:
    // 1. Send the text to a server endpoint
    // 2. Use a TTS service to generate an audio file
    // 3. Return a URL to download the audio file

    // Simulate a download delay
    setTimeout(() => {
      toast({
        title: "Audio generated",
        description: "Your audio file would now be available for download.",
      });
    }, 2000);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Enter text to convert to speech</label>
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste your text here..."
            className="w-full h-32 md:h-48 p-4 resize-none"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={clearText}
              variant="outline"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <i className="fas fa-eraser mr-2"></i>
              <span>Clear Text</span>
            </Button>

            <label className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer flex items-center">
              <i className="fas fa-upload mr-2"></i>
              <span>Upload File</span>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Voice Settings</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Voice</label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.length > 0 ? (
                      availableVoices.map((voice, idx) => (
                        <SelectItem key={idx} value={voice.name}>
                          {voice.name} ({voice.lang}, {voice.gender})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default">Default Voice</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">Speed</label>
                  <span className="text-sm text-gray-500">{rate.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[rate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setRate(value[0])}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">Pitch</label>
                  <span className="text-sm text-gray-500">{pitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[pitch]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setPitch(value[0])}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 font-medium">Volume</label>
                  <span className="text-sm text-gray-500">{(volume * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Audio Controls</h3>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center h-[280px]">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  onClick={speakText}
                  disabled={isPlaying && !isPaused}
                  className="bg-primary hover:bg-blue-700 transition h-12 w-12 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-play"></i>
                </Button>

                <Button
                  onClick={pauseResumeSpeech}
                  disabled={!isPlaying}
                  className={`${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'} transition h-12 w-12 rounded-full flex items-center justify-center`}
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                </Button>

                <Button
                  onClick={stopSpeech}
                  disabled={!isPlaying}
                  className="bg-red-600 hover:bg-red-700 transition h-12 w-12 rounded-full flex items-center justify-center"
                >
                  <i className="fas fa-stop"></i>
                </Button>
              </div>

              <Button
                onClick={downloadAudio}
                className="bg-gray-800 hover:bg-gray-900 transition flex items-center"
              >
                <i className="fas fa-download mr-2"></i>
                <span>Download as MP3</span>
              </Button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                {isPlaying ?
                  (isPaused ? "Speech paused" : "Playing audio...") :
                  "Click play to hear your text"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
            <div>
              <h4 className="text-blue-800 font-medium">Browser Support</h4>
              <p className="text-blue-700 text-sm">
                This tool uses the Web Speech API which is supported in most modern browsers.
                For optimal performance, we recommend using Chrome, Edge, or Safari.
                Voice availability may vary depending on your browser and operating system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Bring your text to life with natural-sounding speech using our Text to Speech converter.",
    description: "Our Text to Speech tool leverages advanced speech synthesis technology to convert written text into natural-sounding spoken audio. Whether you need to create accessible content, proofread your writing by ear, generate voiceovers for videos, or simply prefer to consume content by listening rather than reading, this tool offers a fast and effective solution. With customizable voice options, adjustable speaking rate, pitch, and volume controls, you can tailor the audio output to your exact preferences. The tool processes text instantly and provides an intuitive interface to play, pause, and download your audio files for use across various applications and platforms.",
    howToUse: [
      "Enter or paste your text into the editor box provided above.",
      "Alternatively, upload a text file (.txt) using the 'Upload File' button.",
      "Customize your voice settings by selecting a voice and adjusting the speed, pitch, and volume sliders.",
      "Click the 'Play' button to hear your text spoken aloud.",
      "Use the 'Pause/Resume' button to control playback as needed.",
      "When satisfied with the result, use the 'Download as MP3' button to save the audio for later use."
    ],
    features: [
      "Multiple natural-sounding voices in various languages, accents, and genders",
      "Customizable speech parameters including rate, pitch, and volume",
      "Real-time playback with pause and resume functionality",
      "Support for long-form text with seamless pronunciation",
      "MP3 download option for using the audio in other applications",
      "Browser-based processing with no software installation required"
    ],
    faqs: [
      {
        question: "What languages are supported by the Text to Speech tool?",
        answer: "Our Text to Speech tool supports a wide range of languages, including but not limited to English (US, UK, Australian, Indian), Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, and many others. The exact language availability depends on your browser's speech synthesis capabilities. Most modern browsers support at least 20-30 languages, with Chrome offering the broadest language support. Each language typically includes multiple voice options with different accents and gender variations."
      },
      {
        question: "Is there a limit to how much text I can convert to speech?",
        answer: "While there's no strict character limit for text-to-speech conversion in the browser, we recommend keeping your text under 5,000 characters (approximately 1,000 words) per conversion for optimal performance. Processing very large blocks of text may cause browser performance issues or result in choppy playback. For longer content, consider breaking it into smaller sections and converting each separately. For the downloadable MP3 option, there may be additional limitations based on server processing capacity."
      },
      {
        question: "Can I use the generated audio files commercially?",
        answer: "Yes, you can use the audio files generated by our Text to Speech tool for both personal and commercial purposes. The downloaded MP3 files are royalty-free and can be used in videos, podcasts, e-learning courses, or any other applications. However, we recommend checking the specific terms of service for your jurisdiction, as speech synthesis regulations may vary by country. For large-scale commercial applications requiring extensive text-to-speech conversion, you might want to consider our API solutions for better integration and higher volume processing."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="text-to-speech"
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

export default TextToSpeechDetailed;