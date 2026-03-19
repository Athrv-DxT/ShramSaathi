import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, ThermometerSun } from 'lucide-react';

export const WeatherWidget = ({ location, geoError }) => {
   const [weather, setWeather] = useState(null);

   useEffect(() => {
     if (location?.lat && location?.lon) {
        // Fetch weather from open-meteo just for a quick display widget
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`)
           .then(res => res.json())
           .then(data => setWeather(data.current_weather))
           .catch(e => console.error("Weather widget error:", e));
     }
   }, [location]);

   if (geoError) {
      return (
         <div className="bg-amber-50 p-4 rounded-xl flex items-center gap-3 border border-amber-100 text-amber-800 shadow-sm max-w-sm w-full mx-auto">
            <ThermometerSun className="text-amber-500 shrink-0"/>
            <p className="text-xs font-medium">Weather location unavailable. Please allow access.</p>
         </div>
      );
   }

   if (!weather) return null;

   return (
      <div className="bg-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] ring-1 ring-gray-100 max-w-[280px] w-full mx-auto transform hover:scale-105 transition duration-300">
         <div className="flex flex-col items-start">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Local Temp</span>
           <div className="flex items-start gap-1">
             <h4 className="text-3xl font-extrabold text-gray-800 tracking-tighter">{Math.round(weather.temperature)}°</h4>
           </div>
         </div>
         <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full text-teal-500 shadow-inner">
            {weather.weathercode > 50 ? <CloudRain size={32} strokeWidth={2}/> : weather.weathercode > 2 ? <Cloud size={32} strokeWidth={2}/> : <Sun size={32} strokeWidth={2}/>}
         </div>
      </div>
   );
};
