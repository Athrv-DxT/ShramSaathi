import React from 'react';
import { ArrowRight, Info } from 'lucide-react';

export const SchemeCard = ({ title, desc, icon: Icon, colorClass, onAsk }) => {
  return (
    <div className={`relative p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4 hover:shadow-md transition bg-white h-full`}>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">{desc}</p>
      </div>
      
      <div className="mt-auto pt-4 w-full flex items-center justify-between border-t border-gray-50">
        <button 
          onClick={onAsk} 
          className="text-xs font-semibold text-teal-600 flex items-center gap-1 hover:text-teal-800 transition"
        >
          Check Eligibility <ArrowRight size={14}/>
        </button>
        <Info size={16} className="text-gray-300"/>
      </div>
    </div>
  );
};
