import { useState, useEffect } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';
import { useSession } from './hooks/useSession';

import { Header } from './components/Dashboard/Header';
import { WeatherWidget } from './components/Dashboard/WeatherWidget';
import { SchemeGrid } from './components/Dashboard/SchemeGrid';
import { AssistantModal } from './components/AssistantModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/voice';
const LOGO_URL = 'https://res.cloudinary.com/dkgj0vhjx/image/upload/v1773867477/Picture1_p0wvpb.png';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const sessionId = useSession();
  const { location, error: geoError } = useGeolocation();
  
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => setFadeSplash(true), 2000);
    // Unmount completely after 2.5 seconds
    const removeTimer = setTimeout(() => setShowSplash(false), 2500);
    
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  const { 
    voiceState, 
    messages, 
    errorMessage, 
    startRecording, 
    stopRecording 
  } = useVoiceRecorder(API_URL, location, sessionId);

  const handleOpenAssistant = (initialPromptMessage) => {
    setIsAssistantOpen(true);
    // User can read the initial prompt message out loud when pressing mic
  };

  if (showSplash) {
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col items-center justify-center z-[100] transition-opacity duration-500 ease-in-out ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
        <div className="animate-bounce delay-100 mb-6">
           <img src={LOGO_URL} alt="Shram Saathi Logo" className="w-48 h-auto object-contain drop-shadow-2xl" />
        </div>
        <div className="flex flex-col items-center animate-pulse">
           <h1 className="text-4xl font-extrabold text-teal-800 tracking-tighter shadow-sm">Shram Saathi</h1>
           <p className="text-teal-600 mt-2 font-semibold tracking-wide">A Worker's Companion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gray-50/50 font-sans overflow-x-hidden relative">
      <Header logoUrl={LOGO_URL} onOpenAssistant={() => setIsAssistantOpen(true)} />
      
      <main className="pb-32 w-full mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full bg-white border-b border-gray-100 pt-16 pb-12 px-6 shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center relative overflow-hidden">
             
             {/* Background decorative elements */}
             <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-teal-50 to-transparent rounded-full opacity-60 blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-tl from-emerald-50 to-transparent rounded-full opacity-60 blur-3xl pointer-events-none"></div>

             <div className="relative z-10 w-full flex flex-col items-center text-center max-w-3xl">
                 <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                    Empowering India with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Shram Saathi</span>
                 </h2>
                 <p className="text-xl md:text-2xl font-bold text-teal-700 mb-3 tracking-wide">अपना हक़, अपनी आवाज़</p>
                 <p className="text-gray-500 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-2xl px-4">
                    Your intelligent AI voice assistant for real-time government scheme knowledge, rural welfare, and unorganized worker support.
                 </p>
                 <WeatherWidget location={location} geoError={geoError} />
             </div>
        </section>

        {/* Dashboard Grid Map */}
        <div id="schemes-section" className="w-full">
            <SchemeGrid onOpenAssistant={handleOpenAssistant} />
        </div>
      </main>

      {/* Floating Chat Modal */}
      <AssistantModal 
          isOpen={isAssistantOpen}
          setIsOpen={setIsAssistantOpen}
          voiceState={voiceState}
          messages={messages}
          errorMessage={errorMessage}
          onStart={startRecording}
          onStop={stopRecording}
      />
    </div>
  );
}

export default App;
