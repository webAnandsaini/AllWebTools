import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const synth = useRef<SpeechSynthesis | null>(null);
  const speechUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    document.title = "Text to Speech - AllTooly";
    window.scrollTo(0, 0);

    // Initialize speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);

        // Set default voice to first English voice or first available
        const englishVoice = availableVoices.find(v => v.lang.includes('en'));
        if (englishVoice) {
          setVoice(englishVoice.name);
        } else if (availableVoices.length > 0) {
          setVoice(availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }

      loadVoices();
    }

    // Cleanup function
    return () => {
      if (synth.current?.speaking) {
        synth.current.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (!synth.current) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    if (synth.current.speaking) {
      synth.current.cancel();
    }

    // Create a new utterance
    speechUtterance.current = new SpeechSynthesisUtterance(text);

    // Set properties
    if (voice) {
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) {
        speechUtterance.current.voice = selectedVoice;
      }
    }

    speechUtterance.current.rate = rate;
    speechUtterance.current.pitch = pitch;
    speechUtterance.current.volume = volume;

    // Set event handlers
    speechUtterance.current.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    speechUtterance.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechUtterance.current.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
      toast({
        title: "Error",
        description: "An error occurred during speech synthesis.",
        variant: "destructive",
      });
    };

    // Start speaking
    synth.current.speak(speechUtterance.current);
  };

  const pause = () => {
    if (synth.current?.speaking) {
      synth.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synth.current?.paused) {
      synth.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (synth.current?.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText("");
    stop();
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-primary hover:underline inline-flex items-center mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Home</span>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Text to Speech</h1>
              <p className="text-gray-600">Convert your text into natural-sounding speech.</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Enter your text</label>
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here..."
                className="w-full h-64 p-4 resize-none"
              />

              <div className="mt-2 text-right text-sm text-gray-500">
                {text.length} characters / {text.split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Voice</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4 h-full">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-scroll"
                    checked={isAutoScroll}
                    onCheckedChange={setIsAutoScroll}
                  />
                  <Label htmlFor="auto-scroll">Auto-scroll text</Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Speed: {rate.toFixed(1)}x</label>
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
                  <label className="text-sm font-medium">Pitch: {pitch.toFixed(1)}</label>
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
                  <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
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

            <div className="flex flex-wrap gap-4 justify-center">
              {!isSpeaking ? (
                <Button onClick={speak} className="bg-primary hover:bg-blue-700 transition flex items-center">
                  <i className="fas fa-play mr-2"></i>
                  <span>Speak</span>
                </Button>
              ) : isPaused ? (
                <Button onClick={resume} className="bg-green-600 hover:bg-green-700 transition flex items-center">
                  <i className="fas fa-play mr-2"></i>
                  <span>Resume</span>
                </Button>
              ) : (
                <Button onClick={pause} className="bg-yellow-600 hover:bg-yellow-700 transition flex items-center">
                  <i className="fas fa-pause mr-2"></i>
                  <span>Pause</span>
                </Button>
              )}

              <Button
                onClick={stop}
                disabled={!isSpeaking}
                className="bg-red-600 hover:bg-red-700 transition flex items-center disabled:opacity-50"
              >
                <i className="fas fa-stop mr-2"></i>
                <span>Stop</span>
              </Button>

              <Button onClick={clearText} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                <i className="fas fa-eraser mr-2"></i>
                <span>Clear Text</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
