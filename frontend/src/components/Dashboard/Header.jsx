import React from 'react';

export const Header = ({ logoUrl, onOpenAssistant }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Shram Saathi Logo" className="h-12 w-auto object-contain" />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-teal-800 leading-tight">Shram Saathi</h1>
          <p className="text-xs text-gray-500 font-medium">Empowering Workers</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-teal-700 transition">Home</button>
        <button onClick={() => document.getElementById('schemes-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-teal-700 transition">Schemes</button>
        <button onClick={onOpenAssistant} className="hover:text-teal-800 transition text-teal-600 font-bold flex items-center gap-1">
          Saathi <span className="text-lg"></span>
        </button>
      </div>
    </header>
  );
};
