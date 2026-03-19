import { Mic, Square, Loader2 } from 'lucide-react';
import { VoiceState } from '../hooks/useVoiceRecorder';

export const MicButton = ({ voiceState, onStart, onStop }) => {
  const isListening = voiceState === VoiceState.LISTENING;
  const isProcessing = voiceState === VoiceState.PROCESSING;
  const isSpeaking = voiceState === VoiceState.SPEAKING;

  const handleClick = () => {
    if (isListening) onStop();
    else onStart();
  };

  return (
    <div className="relative flex justify-center items-center w-full h-32 mb-8">
      {/* Listening Pulse */}
      {isListening && (
        <div className="absolute w-24 h-24 bg-teal-900 rounded-full animate-ring pointer-events-none" />
      )}
      
      {/* Main Button */}
      <button
        onClick={handleClick}
        disabled={isProcessing || isSpeaking}
        className={`z-10 flex items-center justify-center w-20 h-20 rounded-full text-white shadow-lg transition-all duration-300
          ${isListening ? 'bg-red-500 scale-110' : 'bg-teal-900'}
          ${(isProcessing || isSpeaking) ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105'}
        `}
        aria-label="Toggle Microphone"
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isListening ? (
          <Square className="w-8 h-8 fill-current" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>

      {/* Speaking Indicator could be overlaid here if desired, 
          but usually we use the waveform or status bar for that */}
    </div>
  );
};
