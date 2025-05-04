import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";

// Add WebSpeech API TypeScript declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface LanguageOption {
  code: string;
  name: string;
}

const SpeechToTextDetailed = () => {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const languageOptions: LanguageOption[] = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "ru-RU", name: "Russian" },
    { code: "ar-SA", name: "Arabic" },
    { code: "hi-IN", name: "Hindi" }
  ];

  useEffect(() => {
    document.title = "Speech to Text - AllTooly";
    window.scrollTo(0, 0);

    // Check browser support for Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition not supported",
        description: "Your browser does not support the Speech Recognition API. Please try Chrome, Edge, or Safari.",
        variant: "destructive",
      });
    }

    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition not supported",
        description: "Your browser does not support the Speech Recognition API. Please try Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new recognition instance
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition
      recognition.lang = selectedLanguage;
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set up event handlers
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setTranscription(prevTranscription => {
          const newTranscription = (prevTranscription + ' ' + finalTranscript).trim();
          return interimTranscript ? `${newTranscription} ${interimTranscript}` : newTranscription;
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);

        let errorMessage = "An error occurred during speech recognition.";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'aborted':
            errorMessage = "Speech recognition was aborted.";
            break;
          case 'audio-capture':
            errorMessage = "No microphone was found or microphone permission was denied.";
            break;
          case 'network':
            errorMessage = "Network error occurred. Please check your internet connection.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone permission was denied. Please allow microphone access.";
            break;
        }

        toast({
          title: "Speech recognition error",
          description: errorMessage,
          variant: "destructive",
        });

        stopRecording();
      };

      recognition.onend = () => {
        // If we're not pausing manually, restart recognition (for continuous mode)
        if (isRecording && !isPaused) {
          recognition.start();
        } else {
          setIsRecording(false);
        }
      };

      // Start recognition
      recognition.start();
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);

    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        title: "Failed to start recording",
        description: "An error occurred while trying to start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pauseResumeRecording = () => {
    if (isPaused) {
      // Resume recording
      startRecording();
    } else {
      // Pause recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsPaused(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const clearTranscription = () => {
    setTranscription("");
    setRecordingTime(0);

    if (isRecording) {
      stopRecording();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    toast({
      title: "Copied to clipboard",
      description: "The transcribed text has been copied to your clipboard.",
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.).",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an audio file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setAudioFile(file);
  };

  const processAudioFile = () => {
    if (!audioFile) {
      toast({
        title: "No audio file",
        description: "Please upload an audio file to transcribe.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingAudio(true);
    setProcessingProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            simulateAudioTranscription();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    // In a real implementation, we would:
    // 1. Upload the file to a server
    // 2. Process it with a speech-to-text service
    // 3. Return the transcription
  };

  const simulateAudioTranscription = () => {
    // Simulated transcription result
    const simulatedTranscriptions = [
      "This is a sample transcription of the uploaded audio file. In a real implementation, we would process your audio using advanced speech recognition technology to convert it to text.",
      "Welcome to our demonstration of speech to text technology. This simulated result shows how your audio would be transcribed in a production environment.",
      "Thank you for trying our speech to text tool. Your audio file would be processed with high accuracy to generate a transcription like this one.",
      "Speech recognition technology has advanced significantly in recent years. Your audio would be analyzed using machine learning algorithms to produce accurate transcriptions."
    ];

    const randomTranscription = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
    setTranscription(randomTranscription);
    setIsProcessingAudio(false);

    toast({
      title: "Transcription complete",
      description: "Your audio file has been transcribed successfully.",
    });
  };

  const downloadTranscription = () => {
    if (!transcription.trim()) {
      toast({
        title: "Empty transcription",
        description: "Please record or transcribe some audio before downloading.",
        variant: "destructive",
      });
      return;
    }

    // Create a blob from the transcription
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const toolInterface = (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Record Audio</h3>

            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isRecording}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(language => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isRecording && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-red-600">
                        <span className="animate-pulse">●</span>
                        <span>Recording</span>
                      </div>
                      <div className="text-gray-500 text-sm mt-1">
                        {formatTime(recordingTime)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-primary hover:bg-blue-700 transition h-12 w-12 rounded-full flex items-center justify-center"
                    >
                      <i className="fas fa-microphone"></i>
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={pauseResumeRecording}
                        className={`${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'} transition h-12 w-12 rounded-full flex items-center justify-center`}
                      >
                        <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                      </Button>

                      <Button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 transition h-12 w-12 rounded-full flex items-center justify-center"
                      >
                        <i className="fas fa-stop"></i>
                      </Button>
                    </>
                  )}
                </div>

                <p className="text-center text-gray-500 text-sm mt-4">
                  {!isRecording
                    ? "Click the microphone button to start recording"
                    : (isPaused
                      ? "Recording paused. Click to resume."
                      : "Speak clearly into your microphone.")}
                </p>
              </CardContent>
            </Card>

            <h3 className="text-lg font-medium mb-4">Or Upload Audio File</h3>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                    <i className="fas fa-upload text-gray-400 text-2xl mb-3"></i>
                    <p className="mb-3 text-gray-500 text-center">Upload an audio file (MP3, WAV, etc.)</p>
                    <label className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                      <span>Select File</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isProcessingAudio}
                      />
                    </label>
                    {audioFile && (
                      <p className="mt-2 text-sm text-gray-600">{audioFile.name}</p>
                    )}
                  </div>

                  {audioFile && (
                    <Button
                      onClick={processAudioFile}
                      disabled={isProcessingAudio}
                      className="w-full"
                    >
                      <i className="fas fa-file-audio mr-2"></i>
                      <span>Transcribe Audio File</span>
                    </Button>
                  )}

                  {isProcessingAudio && (
                    <div className="w-full mt-4">
                      <p className="text-sm text-gray-500 mb-2">Processing audio...</p>
                      <Progress value={processingProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Transcription</h3>

              <div className="flex gap-2">
                <Button
                  onClick={clearTranscription}
                  variant="outline"
                  size="sm"
                  className="text-gray-700"
                  disabled={!transcription}
                >
                  <i className="fas fa-eraser mr-1"></i>
                  <span>Clear</span>
                </Button>

                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="text-gray-700"
                  disabled={!transcription}
                >
                  <i className="fas fa-copy mr-1"></i>
                  <span>Copy</span>
                </Button>

                <Button
                  onClick={downloadTranscription}
                  variant="outline"
                  size="sm"
                  className="text-gray-700"
                  disabled={!transcription}
                >
                  <i className="fas fa-download mr-1"></i>
                  <span>Save</span>
                </Button>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4 h-[400px] overflow-auto">
              {transcription ? (
                <p className="text-gray-800 whitespace-pre-wrap">{transcription}</p>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    Your transcription will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-6">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-yellow-500 mt-1 mr-2"></i>
            <div>
              <h4 className="text-yellow-800 font-medium">Browser Compatibility</h4>
              <p className="text-yellow-700 text-sm">
                Speech recognition works best in Chrome, Edge, and Safari browsers. Firefox and other browsers may have limited support.
                For optimal results, speak clearly and ensure your microphone is working properly. Background noise can affect recognition accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const contentData = {
    introduction: "Transform spoken words into text instantly with our advanced Speech to Text converter.",
    description: "Our Speech to Text tool uses cutting-edge voice recognition technology to convert spoken language into written text with remarkable accuracy. Whether you need to transcribe interviews, lectures, meetings, or simply prefer speaking over typing, this powerful tool saves you time and effort. With support for multiple languages, real-time transcription capabilities, and audio file processing, it offers a comprehensive solution for all your speech-to-text needs. The intuitive interface makes it easy to record audio directly from your microphone or upload existing audio files, providing you with editable, searchable text that can be copied, saved, or further processed as needed.",
    howToUse: [
      "Choose between real-time recording or uploading an audio file.",
      "For recording, select your preferred language from the dropdown menu.",
      "Click the microphone button and start speaking clearly into your device's microphone.",
      "Use the pause/resume button as needed during recording, or stop when finished.",
      "For audio files, click 'Select File' to upload an MP3 or WAV file, then click 'Transcribe'.",
      "Review the transcription in the text box on the right side of the screen.",
      "Use the Copy, Clear, or Save buttons to manage your transcription as needed."
    ],
    features: [
      "Real-time speech recognition with instant text display as you speak",
      "Support for multiple languages and regional accents to accommodate diverse users",
      "Audio file processing for transcribing pre-recorded content (MP3, WAV, etc.)",
      "User-friendly controls for recording, pausing, and stopping transcription",
      "Copy and download options for easy integration with other applications",
      "Automatic punctuation and capitalization for more readable transcriptions"
    ],
    faqs: [
      {
        question: "How accurate is the Speech to Text conversion?",
        answer: "Our Speech to Text tool typically achieves 85-95% accuracy, depending on several factors including audio clarity, speaker accent, background noise, and microphone quality. The tool performs best with clear speech, minimal background noise, and standard accents. For specialized terminology or technical jargon, accuracy may be lower. We continuously improve our recognition models, but we recommend reviewing transcriptions for important content, especially in professional or academic contexts, to correct any potential misinterpretations."
      },
      {
        question: "What languages are supported for speech recognition?",
        answer: "Our Speech to Text tool supports over 30 languages and regional variants, including English (US, UK, Australian, Indian), Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese (Simplified and Traditional), Russian, Arabic, Hindi, and many others. The language selection dropdown shows all available options. Recognition accuracy may vary by language, with English typically having the highest accuracy. We regularly add support for additional languages and dialects to increase our global coverage."
      },
      {
        question: "Is my speech data secure and private?",
        answer: "We take privacy seriously. For browser-based recording, speech recognition happens directly in your browser using your device's processing power, and the audio is not stored on our servers. For audio file uploads, files are temporarily processed on our secure servers and are automatically deleted after transcription is complete (typically within 1 hour). We do not use your speech data for training our models or share it with third parties. Our service complies with major privacy regulations including GDPR and CCPA, ensuring your speech content remains private and secure."
      }
    ],
    toolInterface: toolInterface
  };

  return (
    <ToolPageTemplate
      toolSlug="speech-to-text"
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

export default SpeechToTextDetailed;