import { useEffect, useRef } from 'react';

export const TranscriptCard = ({ messages, voiceState }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceState]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
        <p className="text-lg font-medium mb-2">श्रम साथी में आपका स्वागत है</p>
        <p className="text-sm">नीचे दिए गए माइक को दबाएं और अपना सवाल पूछें।</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user';
        return (
          <div key={i} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-[15px] leading-relaxed
                ${isUser 
                  ? 'bg-gray-100 text-gray-800 rounded-tr-sm' 
                  : 'bg-teal-50 text-teal-900 border border-teal-100 rounded-tl-sm'
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
      
      {/* Loading state bubble */}
      {(voiceState === 'processing' || voiceState === 'speaking') && (
         <div className="flex w-full justify-start">
            <div className="max-w-[85%] rounded-2xl p-4 bg-teal-50 border border-teal-100 rounded-tl-sm shadow-sm flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }}/>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }}/>
            </div>
         </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
};
