import { useState, useRef, useCallback, useEffect } from 'react';

export const VoiceState = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error'
};

export const useVoiceRecorder = (apiEndpoint, location, sessionId) => {
  const [voiceState, setVoiceState] = useState(VoiceState.IDLE);
  const [messages, setMessages] = useState([]); // { role: 'user' | 'ai', text: string }
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch initial history when sessionId is available
  useEffect(() => {
    if (!sessionId) return;
    const fetchHistory = async () => {
      try {
        const baseUrl = apiEndpoint.split('/api/voice')[0];
        const res = await fetch(`${baseUrl}/api/chats/${sessionId}`);
        const data = await res.json();
        if (data.success && data.chats) {
           setMessages(data.chats.map(c => ({
              role: c.role,
              text: c.content
           })));
        }
      } catch(e) {
        console.error("Failed to load chat history", e);
      }
    };
    fetchHistory();
  }, [sessionId, apiEndpoint]);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  // We keep track of the currently playing audio to allow interrupting it
  const currentAudio = useRef(null);
  
  // VAD Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const microphoneRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
      }

      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        // Stop audio context
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (audioContextRef.current) audioContextRef.current.close().catch(console.error);
        if (microphoneRef.current) microphoneRef.current.disconnect();

        await processAudio(audioBlob);
        
        // Stop all tracks to release mic light in browser
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setVoiceState(VoiceState.LISTENING);

      // Start Silence Detection (1.5s VAD)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let isSilent = true;

      const detectSilence = () => {
         if (!analyserRef.current || !mediaRecorder.current || mediaRecorder.current.state !== 'recording') return;
         
         analyserRef.current.getByteFrequencyData(dataArray);
         let sum = 0;
         for(let i = 0; i < bufferLength; i++) { sum += dataArray[i]; }
         const average = sum / bufferLength;

         if (average > 10) {
             if (isSilent) {
                 isSilent = false;
                 if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
             }
         } else {
             if (!isSilent) {
                 isSilent = true;
                 silenceTimerRef.current = setTimeout(() => {
                     if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                         console.log("Silence detected. Auto-stopping recording.");
                         mediaRecorder.current.stop();
                         setVoiceState(VoiceState.PROCESSING);
                     }
                 }, 1500); 
             }
         }
         requestAnimationFrame(detectSilence);
      };
      
      detectSilence();

    } catch (error) {
      console.error("Mic access denied or failed", error);
      setErrorMessage("Mic access denied or hardware error.");
      setVoiceState(VoiceState.ERROR);
      setTimeout(() => setVoiceState(VoiceState.IDLE), 3000);
    }
  }, [location, apiEndpoint]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setVoiceState(VoiceState.PROCESSING);
    }
  }, []);

  const processAudio = async (blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    
    // Add location if available
    if (location?.lat && location?.lon) {
      formData.append('lat', location.lat);
      formData.append('lon', location.lon);
    }
    
    // Attach session id to associate with history map
    if (sessionId) {
      formData.append('sessionId', sessionId);
    }

    try {
      const resp = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      const data = await resp.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to process audio");
      }

      // Add user text
      if (data.transcript) {
          setMessages(prev => [...prev, { role: 'user', text: data.transcript }]);
      }

      // Add AI Response
      if (data.response) {
          setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
      }

      // Play audio response if synthesized
      if (data.audioUrl) {
        playResponseAudio(data.audioUrl);
      } else {
        setVoiceState(VoiceState.IDLE);
      }

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Network error occurred.');
      setVoiceState(VoiceState.ERROR);
      setTimeout(() => setVoiceState(VoiceState.IDLE), 3000);
    }
  };

  const playResponseAudio = (relativePath) => {
    // Construct absolute URL mapping to backend
    const baseUrl = apiEndpoint.split('/api/voice')[0]; // Quick hack to get backend base url from API url
    const fullUrl = `${baseUrl}${relativePath}`;

    const audio = new Audio(fullUrl);
    currentAudio.current = audio;

    audio.onplay = () => {
        setVoiceState(VoiceState.SPEAKING);
    };

    audio.onended = () => {
        setVoiceState(VoiceState.IDLE);
        currentAudio.current = null;
    };

    audio.onerror = (e) => {
        console.error("Audio playback failed", e);
        setVoiceState(VoiceState.IDLE);
    };

    audio.play().catch(e => {
        console.error("Autoplay likely blocked by browser", e);
        setVoiceState(VoiceState.IDLE);
    });
  };

  return {
    voiceState,
    messages,
    errorMessage,
    startRecording,
    stopRecording
  };
};
