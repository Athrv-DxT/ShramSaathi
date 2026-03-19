import { useState, useEffect } from 'react';

export const useSession = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('shram_saathi_session');
    if (!id) {
       id = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now();
       localStorage.setItem('shram_saathi_session', id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
};
