import { VoiceState } from '../hooks/useVoiceRecorder';

export const WaveformAnimation = ({ voiceState }) => {
  const isSpeaking = voiceState === VoiceState.SPEAKING;

  if (!isSpeaking) return null;

  return (
    <div className="flex justify-center items-center space-x-1 h-12 w-full my-4">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className="w-1.5 bg-teal-600 rounded-full animate-pulse"
          style={{
            height: `${Math.max(20, Math.random() * 100)}%`,
            animationDelay: `${i * 150}ms`,
            animationDuration: '800ms'
          }}
        />
      ))}
    </div>
  );
};
