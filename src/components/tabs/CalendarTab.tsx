import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const CalendarTab: React.FC = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              गण क्यालेन्डर तथा ड्युटी तालिका (Police Operations Calendar)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            नेपाली संवत् २०८३ साल आश्विन महिना (Ashoj 2083) • परेड, विशेष ड्युटी, पर्व सुरक्षा तथा बिदा
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow">
            २०८३ आश्विन १३ गते, मंगलबार (आज)
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span>आइत</span>
          <span>सोम</span>
          <span>मंगलबार</span>
          <span>बुध</span>
          <span>बिही</span>
          <span>शुक्र</span>
          <span className="text-red-400">शनि</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
          {days.map((day) => {
            const isToday = day === 13;
            const isSaturday = day % 7 === 0;
            const isParade = day === 5 || day === 19;
            const isSpecial = day === 10 || day === 24;

            return (
              <div
                key={day}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center justify-between min-h-[64px] sm:min-h-[72px] transition ${
                  isToday
                    ? 'bg-blue-600 border-blue-400 text-white font-bold ring-2 ring-blue-400 shadow-md'
                    : isSaturday
                    ? 'bg-slate-950/80 border-slate-800 text-red-400'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className={`text-sm font-bold font-mono ${isToday ? 'text-white' : ''}`}>
                  {day}
                </span>

                {isToday && (
                  <span className="text-[9px] font-bold bg-white text-blue-600 px-1 rounded shadow mt-1">
                    आजको ड्युटी
                  </span>
                )}
                {isParade && (
                  <span className="text-[8px] font-semibold text-amber-400 mt-1">
                    परेड अभ्यास
                  </span>
                )}
                {isSpecial && (
                  <span className="text-[8px] font-semibold text-cyan-400 mt-1">
                    भीड नियन्त्रण
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
