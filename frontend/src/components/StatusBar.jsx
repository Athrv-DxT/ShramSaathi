import { VoiceState } from '../hooks/useVoiceRecorder';

export const StatusBar = ({ voiceState }) => {
  let statusText = "तैयार"; // Ready
  let statusColor = "text-gray-500";
  
  switch (voiceState) {
    case VoiceState.LISTENING:
      statusText = "सुन रहा हूँ..."; // Listening
      statusColor = "text-red-500";
      break;
    case VoiceState.PROCESSING:
      statusText = "सोच रहा हूँ..."; // Thinking
      statusColor = "text-teal-600 animate-pulse";
      break;
    case VoiceState.SPEAKING:
      statusText = "बोल रहा हूँ..."; // Speaking
      statusColor = "text-teal-900 font-medium";
      break;
    case VoiceState.ERROR:
      statusText = "कुछ गलत हो गया"; // Something went wrong
      statusColor = "text-red-500";
      break;
    default:
      break;
  }

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-teal-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          श्र
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Shram Saathi</h1>
      </div>
      <div className={`text-sm tracking-wide ${statusColor}`}>
        {statusText}
      </div>
    </div>
  );
};
