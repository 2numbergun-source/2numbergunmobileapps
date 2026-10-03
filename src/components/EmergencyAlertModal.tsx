import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Battery, 
  Phone, 
  PhoneCall,
  Share2, 
  CheckCircle2, 
  Radio, 
  X, 
  Clock,
  ShieldAlert,
  ArrowRight,
  PhoneForwarded
} from 'lucide-react';
import { Officer, EmergencyAlert } from '../types/police';
import { playEmergencySiren, stopEmergencySiren } from '../lib/alerts';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: Officer;
  onDispatchAlert: (alert: EmergencyAlert) => void;
  activeAlert?: EmergencyAlert | null;
  onClearAlert?: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  officer,
  onDispatchAlert,
  activeAlert,
  onClearAlert,
}) => {
  const [phase, setPhase] = useState<'confirm' | 'active'>('confirm');
  const [countdown, setCountdown] = useState<number>(3);
  const [sirenActive, setSirenActive] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [locationShared, setLocationShared] = useState<boolean>(false);
  
  // Requirement 2: Automatic phone dialer after siren
  const [selectedEmergencyNumber, setSelectedEmergencyNumber] = useState<string>('100');
  const [autoCallCountdown, setAutoCallCountdown] = useState<number>(5);
  const [autoCallTriggered, setAutoCallTriggered] = useState<boolean>(false);
  const autoDialTimerRef = useRef<number | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 27.7369,
    lng: 85.3305,
  });

  // Battery and GPS discovery
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> })
        .getBattery()
        .then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
        })
        .catch(() => setBatteryLevel(85));
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setCurrentCoords({ lat: 27.7369, lng: 85.3305 });
        }
      );
    }
  }, []);

  // Countdown timer for initial confirmation
  useEffect(() => {
    if (!isOpen) {
      setPhase('confirm');
      setCountdown(3);
      setAutoCallCountdown(5);
      setAutoCallTriggered(false);
      stopEmergencySiren();
      if (autoDialTimerRef.current) {
        clearInterval(autoDialTimerRef.current);
        autoDialTimerRef.current = null;
      }
      return;
    }

    if (activeAlert) {
      setPhase('active');
      return;
    }

    if (phase === 'confirm') {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        triggerEmergencyNow();
      }
    }
  }, [isOpen, phase, countdown, activeAlert]);

  // Automatic Call timer when phase becomes 'active'
  useEffect(() => {
    if (phase === 'active' && !autoCallTriggered) {
      const interval = window.setInterval(() => {
        setAutoCallCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            executeAutoDial(selectedEmergencyNumber);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      autoDialTimerRef.current = interval;

      return () => {
        clearInterval(interval);
      };
    }
  }, [phase, autoCallTriggered, selectedEmergencyNumber]);

  const executeAutoDial = (phoneNum: string) => {
    setAutoCallTriggered(true);
    // Automatic dial execution via telephone URI scheme
    try {
      window.location.href = `tel:${phoneNum.replace(/[^0-9]/g, '')}`;
    } catch (e) {
      console.warn('Call execution attempted:', e);
    }
  };

  const triggerEmergencyNow = () => {
    setPhase('active');
    setSirenActive(true);
    playEmergencySiren();

    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      officerId: officer.id,
      officerName: officer.name,
      officerRank: officer.rank,
      phone: officer.phone,
      coords: currentCoords,
      locationName: 'महाराजगञ्ज गण क्षेत्र / नारायणगोपाल चोक नजिक',
      timestamp: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      batteryLevel,
      status: '🚨 आपतकालीन सक्रिय',
      sirenTriggered: true,
      dialedNumber: selectedEmergencyNumber,
      note: 'कर्मचारीद्वारा मोबाइलबाट आपतकालीन SOS तथा स्वचालित कल प्रसारण गरिएको',
    };

    onDispatchAlert(newAlert);
  };

  const toggleSirenSound = () => {
    if (sirenActive) {
      stopEmergencySiren();
      setSirenActive(false);
    } else {
      playEmergencySiren();
      setSirenActive(true);
    }
  };

  const handleShareLocation = () => {
    setLocationShared(true);
    if (navigator.clipboard) {
      const shareText = `[नेपाल प्रहरी आपतकालीन म्याप] कर्मचारी: ${officer.name} (${officer.rank}) | समय: ${new Date().toLocaleTimeString()} | GPS: ${currentCoords.lat.toFixed(5)}, ${currentCoords.lng.toFixed(5)}`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleResolveAndClose = () => {
    stopEmergencySiren();
    if (autoDialTimerRef.current) {
      clearInterval(autoDialTimerRef.current);
    }
    if (onClearAlert) {
      onClearAlert();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Background Siren Beacon Flasher */}
      {phase === 'active' && (
        <div className="absolute inset-0 pointer-events-none animate-siren-flash -z-10" />
      )}

      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden bg-slate-950 transition-all ${
        phase === 'active' ? 'border-red-600 ring-4 ring-red-600/40 animate-pulse-border' : 'border-slate-700'
      }`}>
        
        {/* Modal Top Bar */}
        <div className={`px-5 py-3.5 flex items-center justify-between text-white ${
          phase === 'active' ? 'bg-red-600' : 'bg-slate-900 border-b border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-bounce fill-white text-red-600" />
            <h3 className="font-black text-sm tracking-wide uppercase">
              {phase === 'confirm' ? 'आपतकालीन अवस्था पुष्टिकरण' : '🚨 EMERGENCY SOS / आपतकालीन साइरन तथा स्वचालित कल'}
            </h3>
          </div>
          <button
            onClick={handleResolveAndClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {phase === 'confirm' ? (
            /* Phase 1: 3-Second Confirmation */
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 mx-auto flex items-center justify-center animate-pulse">
                <span className="text-4xl font-black text-red-500 font-mono">
                  {countdown}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  "के तपाईं आपतकालीन अवस्थामा हुनुहुन्छ?"
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {countdown} सेकेन्डभित्र रद्द नगरिएमा साइरन बज्नेछ र <strong>१०० वा तोकिएको कार्यालयमा स्वतः स्वचालित आपतकालीन कल (Auto-Dial)</strong> जानेछ।
                </p>
              </div>

              {/* Emergency Call Target Selection */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-left max-w-sm mx-auto">
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-red-400" />
                  <span>साइरन पश्चात स्वचालित कल जाने नम्बर:</span>
                </label>
                <select
                  value={selectedEmergencyNumber}
                  onChange={(e) => setSelectedEmergencyNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono font-bold"
                >
                  <option value="100">१०० — प्रहरी कन्ट्रोल रूम (केन्द्रीय कमाण्ड)</option>
                  <option value="01-4371234">०१-४३७१२३४ — सशस्त्र प्रहरी गण नं. २ कार्यालय</option>
                  <option value="16600141516">१६६००१४१५१६ — नेपाल प्रहरी टोल-फ्री हटलाइन</option>
                  <option value="9851230002">९८५१२३०००२ — २४/७ ड्युटी अधिकृत (Duty Officer)</option>
                  <option value="103">१०३ — ट्राफिक कन्ट्रोल</option>
                  <option value="102">१०२ — एम्बुलेन्स सेवा</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResolveAndClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
                >
                  रद्द गर्नुहोस् (Cancel)
                </button>
                <button
                  onClick={triggerEmergencyNow}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black transition shadow-lg shadow-red-950/50 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>अहिले नै साइरन बजाउनुहोस् र कल गर्नुहोस्</span>
                </button>
              </div>
            </div>
          ) : (
            /* Phase 2: Active SOS Siren & Automatic Dialer Console */
            <div className="space-y-4">
              
              {/* REQUIREMENT 2 HIGHLIGHT: Automatic Call Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                autoCallTriggered 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-900/90 border-red-500 text-white animate-pulse'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center font-black shrink-0 animate-ring-phone shadow-lg">
                    <PhoneForwarded className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider block text-amber-300">
                      {autoCallTriggered ? 'स्वचालित कल सम्पन्न / चालु' : 'साइरन पश्चात स्वचालित कल (Auto-Calling)'}
                    </span>
                    <h4 className="text-sm sm:text-base font-black">
                      {autoCallTriggered ? (
                        <span>{selectedEmergencyNumber} मा कल डायल भयो</span>
                      ) : (
                        <span>{autoCallCountdown} सेकेन्डमा {selectedEmergencyNumber} मा स्वतः कल जाँदैछ...</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-200">
                      प्रहरी कन्ट्रोल तथा गण कमाण्डलाई तुरुन्त फोन सम्पर्क
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => executeAutoDial(selectedEmergencyNumber)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>अहिले नै कल गर्नुहोस्</span>
                  </button>
                </div>
              </div>

              {/* Siren Control Banner */}
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center animate-spin">
                    <Radio className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-red-300 uppercase tracking-wider">
                      आपतकालीन साइरन चालु छ
                    </h5>
                    <p className="text-[11px] text-red-200/80">
                      ध्वनि साइरन + कम्पन (Vibration) + फ्ल्यास स्क्रिन
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleSirenSound}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    sirenActive 
                      ? 'bg-red-600 text-white hover:bg-red-500' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sirenActive ? (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>साइरन म्युट</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>साइरन बजाउनुहोस्</span>
                    </>
                  )}
                </button>
              </div>

              {/* Officer & Dispatch Details */}
              <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400">कर्मचारी विवरण:</span>
                  <span className="font-bold text-white text-right">
                    {officer.name} [{officer.rank}] • कोड: {officer.computerCode}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    हालको GPS स्थान:
                  </span>
                  <span className="font-semibold text-slate-200 text-right">
                    {currentCoords.lat.toFixed(5)}° N, {currentCoords.lng.toFixed(5)}° E (महाराजगञ्ज)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    समय (Timestamp):
                  </span>
                  <span className="font-bold text-amber-300">
                    {new Date().toLocaleTimeString('ne-NP')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    ब्याट्री स्तर:
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {batteryLevel}% चार्ज (MDT Terminal)
                  </span>
                </div>
              </div>

              {/* Action Buttons: Location Share & Safe Confirmation */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleShareLocation}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    locationShared
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow'
                  }`}
                >
                  {locationShared ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>लोकेशन शेयर गरियो!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>मेरो Location Share गर्नुहोस्</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResolveAndClose}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <span>अवस्था सामान्य भयो / बन्द</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>कन्ट्रोल १०० / टोल-फ्री १६६००१४१५१६</span>
          <span>सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज</span>
        </div>

      </div>
    </div>
  );
};
