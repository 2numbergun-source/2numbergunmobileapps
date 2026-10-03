import React, { useState } from 'react';
import { 
  MapPin, 
  Radio, 
  Shield, 
  AlertTriangle, 
  Navigation, 
  Car, 
  Layers, 
  Eye, 
  PhoneCall, 
  Crosshair, 
  Clock, 
  RefreshCw,
  Lock,
  Compass
} from 'lucide-react';
import { DutyItem, EmergencyAlert, BattalionConfig } from '../../types/police';

interface PatrolGpsTabProps {
  battalionConfig: BattalionConfig;
  duties: DutyItem[];
  activeAlerts: EmergencyAlert[];
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const PatrolGpsTab: React.FC<PatrolGpsTabProps> = ({
  battalionConfig,
  duties,
  activeAlerts,
  isAdmin,
  onRequireAdmin,
}) => {
  const [selectedPin, setSelectedPin] = useState<{
    id: string;
    type: 'battalion' | 'duty' | 'sos' | 'patrol';
    title: string;
    subtitle: string;
    details: string;
    coords: { lat: number; lng: number };
    status?: string;
    phone?: string;
  } | null>({
    id: 'battalion-hq',
    type: 'battalion',
    title: 'सशस्त्र प्रहरी गण नं. २ (हेडक्वार्टर)',
    subtitle: 'महाराजगञ्ज, काठमाडौँ',
    details: 'केन्द्रीय कमाण्ड तथा ५० मिटर डिजिटल हाजिरी Geofence विन्दु',
    coords: battalionConfig.centerCoords,
  });

  const [activeLayer, setActiveLayer] = useState<'all' | 'duties' | 'patrols' | 'sos'>('all');

  const toSvgX = (lng: number) => {
    const minLng = 85.26;
    const maxLng = 85.38;
    return Math.max(40, Math.min(760, ((lng - minLng) / (maxLng - minLng)) * 800));
  };

  const toSvgY = (lat: number) => {
    const minLat = 27.65;
    const maxLat = 27.76;
    return Math.max(40, Math.min(460, (1 - (lat - minLat) / (maxLat - minLat)) * 500));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              गस्ती व्यवस्थापन तथा GPS लाइभ ट्र्याकिङ (Patrol Command)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ड्युटी रोस्टरमा तोकिएका स्थानहरू, सक्रिय मोबाइल युनिटहरू तथा ५० मिटर हाजिरी बाउन्ड्री स्वतः नक्सामा प्रदर्शन।
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 text-xs">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            सबै ({duties.length + activeAlerts.length + 1})
          </button>
          <button
            onClick={() => setActiveLayer('duties')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'duties' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ड्युटी स्थान ({duties.length})
          </button>
          <button
            onClick={() => setActiveLayer('sos')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'sos' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚨 SOS अलर्ट ({activeAlerts.length})
          </button>
        </div>
      </div>

      {/* Main Map Screen & Side Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Interactive Tactical Map SVG Viewport */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="z-10 flex items-center justify-between pb-2 px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white font-mono">काठमाडौँ उपत्यका कमाण्ड ग्रिड (Sector 02)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>उत्तर (North) • Live GPS Sync</span>
            </div>
          </div>

          <div className="relative w-full h-[420px] sm:h-[480px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full object-cover"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6"/>
                </pattern>
                <radialGradient id="hqGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect width="800" height="500" fill="#030712"/>
              <rect width="800" height="500" fill="url(#grid)"/>

              {/* Major Ring Road & Road Arteries */}
              <g stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
                <ellipse cx="400" cy="250" rx="270" ry="180" stroke="#475569" strokeWidth="4" strokeDasharray="6,4"/>
                <path d="M 120,250 L 400,250 L 680,250" />
                <path d="M 400,60 L 400,430" />
                <path d="M 400,140 L 580,360" />
                <path d="M 400,140 L 220,360" />
              </g>

              {/* Landmark Area Labels */}
              <text x="415" y="125" fill="#64748b" fontSize="11" fontWeight="bold" fontFamily="sans-serif">महाराजगञ्ज</text>
              <text x="210" y="160" fill="#64748b" fontSize="11" fontFamily="sans-serif">नयाँ बसपार्क</text>
              <text x="590" y="380" fill="#64748b" fontSize="11" fontFamily="sans-serif">कोटेश्वर चोक</text>
              <text x="410" y="270" fill="#64748b" fontSize="11" fontFamily="sans-serif">रत्नपार्क / काठमाडौँ केन्द्र</text>
              <text x="560" y="170" fill="#64748b" fontSize="11" fontFamily="sans-serif">चाबहिल / बौद्ध</text>
              <text x="180" y="320" fill="#64748b" fontSize="11" fontFamily="sans-serif">कलंकी चोक</text>

              {/* 1. Battalion HQ with 50-meter Virtual Boundary */}
              {(() => {
                const hqX = toSvgX(battalionConfig.centerCoords.lng);
                const hqY = toSvgY(battalionConfig.centerCoords.lat);
                return (
                  <g 
                    onClick={() => setSelectedPin({
                      id: 'battalion-hq',
                      type: 'battalion',
                      title: battalionConfig.name,
                      subtitle: battalionConfig.address,
                      details: `केन्द्रीय कमाण्ड पोइन्ट • ५० मिटर भर्चुअल बाउन्ड्री दायरा सक्रिय`,
                      coords: battalionConfig.centerCoords,
                    })}
                    className="cursor-pointer group"
                  >
                    <circle cx={hqX} cy={hqY} r="38" fill="url(#hqGlow)" />
                    <circle cx={hqX} cy={hqY} r="38" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,3" className="animate-pulse" />
                    
                    <circle cx={hqX} cy={hqY} r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                    <circle cx={hqX} cy={hqY} r="5" fill="#facc15" />
                    
                    <rect x={hqX - 55} y={hqY - 32} width="110" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                    <text x={hqX} y={hqY - 20} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      गण नं. २ (५०m सिमा)
                    </text>
                  </g>
                );
              })()}

              {/* 2. Duties plotted on the Map */}
              {(activeLayer === 'all' || activeLayer === 'duties') &&
                duties.map((duty) => {
                  const x = toSvgX(duty.coords.lng);
                  const y = toSvgY(duty.coords.lat);
                  const isSelected = selectedPin?.id === duty.id;
                  return (
                    <g 
                      key={duty.id}
                      onClick={() => setSelectedPin({
                        id: duty.id,
                        type: 'duty',
                        title: duty.title,
                        subtitle: duty.locationName,
                        details: `कमाण्डर: ${duty.commanderRank} ${duty.commanderName} • समय: ${duty.timeSlot} • टोली: ${duty.teamMembers.length} जना`,
                        coords: duty.coords,
                        status: duty.status,
                        phone: duty.commanderPhone,
                      })}
                      className="cursor-pointer group"
                    >
                      <circle cx={x} cy={y} r="18" fill="none" stroke={duty.dutyType === 'विशेष Duty' ? '#f43f5e' : '#38bdf8'} strokeWidth="1" opacity="0.6" />
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isSelected ? "11" : "8"} 
                        fill={duty.dutyType === 'विशेष Duty' ? '#e11d48' : '#2563eb'} 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        className="transition-all"
                      />
                      
                      <rect x={x - 45} y={y + 12} width="90" height="16" rx="3" fill="#0f172a" fillOpacity="0.9" stroke="#475569" strokeWidth="0.8" />
                      <text x={x} y={y + 24} fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        {duty.locationName.split('/')[0].slice(0, 12)}
                      </text>
                    </g>
                  );
                })}

              {/* 3. Emergency SOS Locations */}
              {(activeLayer === 'all' || activeLayer === 'sos') &&
                activeAlerts.map((alert) => {
                  const x = toSvgX(alert.coords.lng);
                  const y = toSvgY(alert.coords.lat);
                  return (
                    <g 
                      key={alert.id}
                      onClick={() => setSelectedPin({
                        id: alert.id,
                        type: 'sos',
                        title: `🚨 आपतकालीन अलर्ट: ${alert.officerName}`,
                        subtitle: `${alert.officerRank} • ${alert.locationName}`,
                        details: `समय: ${alert.timestamp} • ब्याट्री: ${alert.batteryLevel}% • फोन: ${alert.phone}`,
                        coords: alert.coords,
                        status: alert.status,
                        phone: alert.phone,
                      })}
                      className="cursor-pointer animate-pulse"
                    >
                      <circle cx={x} cy={y} r="26" fill="#ef4444" opacity="0.3" className="animate-ping" />
                      <circle cx={x} cy={y} r="12" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
                      <text x={x} y={y + 4} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">!</text>
                      
                      <rect x={x - 55} y={y - 28} width="110" height="18" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
                      <text x={x} y={y - 16} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        🚨 SOS: {alert.officerName}
                      </text>
                    </g>
                  );
                })}

            </svg>

            {/* Map Legend Bar */}
            <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex items-center gap-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-white" />
                <span>गण ५०m Geofence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
                <span>ड्युटी स्थान</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>आपतकालीन SOS</span>
              </div>
            </div>

          </div>

          <div className="px-2 pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>काठमाडौँ उपत्यका कमाण्ड फ्रिक्वेन्सी VHF CH-2</span>
            <span>अपडेट: प्रत्यक्ष (Live Connected)</span>
          </div>

        </div>

        {/* Right Side: Selected Point Inspector */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">पोइन्ट विवरण (Point Inspector)</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedPin ? selectedPin.type.toUpperCase() : 'HQ'}
              </span>
            </div>

            {selectedPin ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {selectedPin.title}
                  </h4>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{selectedPin.subtitle}</span>
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Coords:</span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      {selectedPin.coords.lat.toFixed(5)}° N, {selectedPin.coords.lng.toFixed(5)}° E
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-slate-800/80">
                    {selectedPin.details}
                  </div>
                </div>

                {selectedPin.phone && (
                  <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      सम्पर्क फोन:
                    </span>
                    <a href={`tel:${selectedPin.phone}`} className="font-bold text-blue-400 hover:underline font-mono">
                      {selectedPin.phone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                नक्सामा कुनै पनि पोइन्टमा क्लिक गर्नुहोस्।
              </div>
            )}

            {/* Officer Live Location Sharing Section */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>अधिकृत लोकेसन शेयरिङ</span>
                </span>
                {!isAdmin && (
                  <button
                    onClick={onRequireAdmin}
                    className="text-[10px] text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>अधिकृत मात्र</span>
                  </button>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">प्रहरी कर्मचारी: पिताम्बर अधिकारी</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-600/30">
                    Active Share
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>स्थान: महाराजगञ्ज</span>
                  <span className="font-mono text-slate-300">समय: १८:२७</span>
                </div>
                <div className="text-[11px] text-emerald-400">
                  स्थिति: ड्युटीमा सक्रिय / GPS लाइभ
                </div>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              सशस्त्र प्रहरी गण नं. २ • कमाण्ड एण्ड कन्ट्रोल
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
