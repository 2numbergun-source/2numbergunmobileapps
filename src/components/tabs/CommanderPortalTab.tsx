import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Car, 
  Radio, 
  CheckCircle2, 
  Send, 
  Lock, 
  Unlock, 
  Building2,
  PhoneCall,
  Edit
} from 'lucide-react';
import { EmergencyAlert, Officer, DutyItem, BattalionConfig } from '../../types/police';

interface CommanderPortalTabProps {
  activeAlerts: EmergencyAlert[];
  officers: Officer[];
  duties: DutyItem[];
  battalionConfig: BattalionConfig;
  onUpdateBattalionConfig: (config: BattalionConfig) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
  onResolveAlert: (alertId: string) => void;
}

export const CommanderPortalTab: React.FC<CommanderPortalTabProps> = ({
  activeAlerts,
  officers,
  duties,
  battalionConfig,
  onUpdateBattalionConfig,
  isAdmin,
  onRequireAdmin,
  onResolveAlert,
}) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Quick ticker edit
  const [tickerText, setTickerText] = useState(battalionConfig.announcementTicker || '');
  const [tickerSaved, setTickerSaved] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setAnnouncementText('');
    }, 3000);
  };

  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBattalionConfig({
      ...battalionConfig,
      announcementTicker: tickerText,
    });
    setTickerSaved(true);
    setTimeout(() => setTickerSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              कमाण्डर ड्यासबोर्ड तथा नियन्त्रण कक्ष (Commander Portal)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            गणपति तथा अधिकृत कमाण्ड डेस्क • २४/७ परिचालन, आकस्मिक SOS अनुगमन, परिपत्र तथा गण सूचना नियन्त्रण
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5" />
              <span>कमाण्ड अधिकार सक्रिय</span>
            </span>
          ) : (
            <button
              onClick={onRequireAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin / कमाण्डर अनलक</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Emergency SOS Inbound Queue */}
      <div className="bg-slate-900 border-2 border-red-600/60 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>कार्यालय आपतकालीन ALERT मनिटर (Office SOS Inbound Queue)</span>
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-600/40">
            {activeAlerts.length} सक्रिय अलर्ट
          </span>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-red-950/40 border border-red-500/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse-border"
              >
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">
                      🚨 EMERGENCY ALERT: {alert.officerName}
                    </span>
                    <span className="text-[11px] font-bold text-red-300">[{alert.officerRank}]</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-300">
                    <div>कर्मचारी: <strong className="text-white">{alert.officerName} ({alert.officerId})</strong></div>
                    <div>समय: <strong className="text-amber-300 font-mono">{alert.timestamp}</strong></div>
                    <div>स्थान: <strong className="text-cyan-300">{alert.locationName}</strong></div>
                    <div>अवस्था: <strong className="text-red-400">{alert.status}</strong></div>
                    <div>सम्पर्क नम्बर: <a href={`tel:${alert.phone}`} className="text-blue-400 underline font-mono">{alert.phone}</a></div>
                    <div>डायल गरिएको नम्बर: <strong className="text-emerald-400">{alert.dialedNumber || '१००'}</strong></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${alert.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>तत्काल कल गर्नुहोस्</span>
                  </a>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    समाधान भयो (Resolve)
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <span className="font-bold text-white block">हाल कुनै पनि आपतकालीन SOS अलर्ट छैन।</span>
            <span className="text-[11px]">सबै गस्ती युनिटहरू सामान्य तथा सुरक्षित अवस्थामा परिचालित छन्।</span>
          </div>
        )}
      </div>

      {/* Battalion Tactical Strength Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>कुल नफ्री (Strength)</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{officers.length}</div>
          <span className="text-[11px] text-emerald-400">१००% हाजिर तथा ड्युटीमा</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>सक्रिय ड्युटी सेक्टर</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">{duties.length}</div>
          <span className="text-[11px] text-slate-400">Patrol, Reserve & QRF</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>सवारी साधन परिचालन</span>
            <Car className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">४ वटा</div>
          <span className="text-[11px] text-emerald-400">Scorpio, Hilux, Troop Van</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>हातहतियार भण्डार (कोट)</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">दुरुस्त</div>
          <span className="text-[11px] text-slate-400">आर्मरी तथा दंगा गियर रेडी</span>
        </div>
      </div>

      {/* Admin Home Page Ticker & Quick Announcement Update */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            <span>गृह पृष्ठको तत्काल सूचना टिकर सम्पादन (Live Home Ticker)</span>
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold">
            {isAdmin ? 'सम्पादन खुला' : 'Admin मात्र'}
          </span>
        </div>

        <form onSubmit={handleSaveTicker} className="space-y-3">
          <input
            type="text"
            disabled={!isAdmin}
            placeholder="गृह पृष्ठको रातो पट्टीमा तत्काल देखिने सूचना टाइप गर्नुहोस्..."
            value={tickerText}
            onChange={(e) => setTickerText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * यहाँ लेखिएको व्यहोरा गृह पृष्ठ (Home Page) मा रातो पट्टीमा तुरुन्तै देखिनेछ।
            </span>

            {isAdmin ? (
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <span>टिकर अद्यावधिक गर्नुहोस्</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onRequireAdmin}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs border border-slate-700 cursor-pointer"
              >
                <span>सम्पादन गर्न Admin लगइन गर्नुहोस्</span>
              </button>
            )}
          </div>

          {tickerSaved && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-500 rounded-lg text-xs text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>गृह पृष्ठको टिकर सूचना सफलतापूर्वक सुरक्षित गरियो!</span>
            </div>
          )}
        </form>
      </div>

      {/* Commander Direct Radio / Broadcast Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-400" />
          <span>कमाण्डर प्रत्यक्ष निर्देशन तथा प्रसारण (Tactical Broadcast)</span>
        </h3>

        <form onSubmit={handleBroadcast} className="space-y-3">
          <textarea
            rows={3}
            placeholder="सम्पूर्ण गस्ती टोली तथा कमाण्ड प्लाटुनलाई जारी गरिने विशेष आदेश वा निर्देशन टाइप गर्नुहोस्..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * यो सन्देश मोबाइल एपमा सबै कर्मचारीको गृह स्क्रिन तथा सञ्चार सेटमा पुग्नेछ।
            </span>

            <button
              type="submit"
              disabled={!announcementText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>निर्देशन प्रसारण गर्नुहोस्</span>
            </button>
          </div>

          {broadcastSent && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>आदेश सफलतापूर्वक सम्पूर्ण युनिटमा प्रसारण भयो!</span>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};
