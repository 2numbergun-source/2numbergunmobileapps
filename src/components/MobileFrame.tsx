import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onClose: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  enabled,
  onClose,
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="py-6 px-2 sm:px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-950/80">
      <div className="flex items-center justify-between w-full max-w-[440px] mb-2 px-2 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>मोबाइल टर्मिनल भ्यू (Police MDT)</span>
        </span>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 font-semibold underline text-[11px]"
        >
          डेस्कटप भ्यूमा फर्कनुहोस्
        </button>
      </div>

      {/* Realistic Phone Bezel Frame */}
      <div className="w-full max-w-[440px] bg-slate-900 border-4 border-slate-700 rounded-[40px] shadow-2xl shadow-black overflow-hidden ring-1 ring-slate-800 flex flex-col h-[840px] max-h-[92vh]">
        
        {/* Phone Notch & Status Bar */}
        <div className="h-8 bg-slate-950 px-6 flex items-center justify-between text-[11px] text-slate-400 shrink-0 border-b border-slate-800 select-none">
          <span className="font-mono font-bold text-slate-200">०८:४५</span>
          {/* Dynamic Speaker Island */}
          <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800 mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3 text-emerald-400" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-slate-950/95">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0 border-t border-slate-900">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>

      </div>
    </div>
  );
};
