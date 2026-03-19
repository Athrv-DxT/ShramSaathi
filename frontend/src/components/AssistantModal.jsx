import React, { useState } from 'react';
import { MicButton } from './MicButton';
import { TranscriptCard } from './TranscriptCard';
import { StatusBar } from './StatusBar';
import { WaveformAnimation } from './WaveformAnimation';
import { MessageSquare, X } from 'lucide-react';

export const AssistantModal = ({ voiceState, messages, errorMessage, onStart, onStop, isOpen, setIsOpen }) => {

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer z-50 ring-4 ring-teal-100"
        >
          <MessageSquare size={28} className="text-white" />
        </button>
      )}

      {/* Slide-over Side Panel / Modal */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[412px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-teal-50/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center relative bg-teal-100">
                    <span className="text-xl">🤖</span>
                    {/* Pulsing indicator if active */}
                    {(voiceState === 'listening' || voiceState === 'processing') && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Shram Saathi Assistant</h3>
                    <p className="text-[10px] text-teal-600 font-medium">Bolo Kya Janna Hai</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-500 transition">
                <X size={20} />
            </button>
        </div>

        {/* Status Bar */}
        <StatusBar voiceState={voiceState} />

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50">
           {/* Error message slot */}
           {errorMessage && (
             <div className="bg-red-50 text-red-600 text-xs px-4 py-2 text-center absolute top-2 left-4 right-4 rounded-md shadow-sm z-50">
               {errorMessage}
             </div>
           )}

           <TranscriptCard messages={messages} voiceState={voiceState} />
           <WaveformAnimation voiceState={voiceState} />
        </div>

        {/* Bottom Mic Dock */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
             <MicButton 
               voiceState={voiceState} 
               onStart={onStart} 
               onStop={onStop} 
             />
        </div>
      </div>
      
      {/* Backdrop overlay for mobile */}
      {isOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 sm:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
      )}
    </>
  );
};
