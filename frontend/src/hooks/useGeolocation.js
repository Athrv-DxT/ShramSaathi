import { useState, useEffect } from 'react';

/**
 * Custom hook for geolocation
 * Fetches geolocation on mount based on user preference ON_LOAD
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Project requirement: Geo requested on load
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (err) => {
        console.warn("Geolocation blocked or failed:", err.message);
        setError(err.message);
      }
    );
  }, []);

  return { location, error };
};
