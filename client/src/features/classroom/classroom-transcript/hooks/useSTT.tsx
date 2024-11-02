"use client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useSTT = () => {
  const {
    listening,
    transcript,
    resetTranscript,
    isMicrophoneAvailable,
    finalTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  return {
    isListening: listening,
    isAvailable: browserSupportsSpeechRecognition && isMicrophoneAvailable,
    transcript,
    finalTranscript,
    startListening: () =>
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      }),
    stopListening: SpeechRecognition.stopListening,
    reset: resetTranscript,
  };
};
