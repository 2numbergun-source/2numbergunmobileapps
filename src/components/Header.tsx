import React from 'react';
import { 
  Home, 
  Building2, 
  Users, 
  CalendarClock, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  Download, 
  Smartphone, 
  AlertTriangle,
  Lock,
  Unlock,
  FileImage,
  Image as ImageIcon,
  BellRing,
  QrCode
} from 'lucide-react';
import { BATTALION_EMBLEM } from '../assets/images';

export type TabKey = 
  | 'home'
  | 'circulars'
  | 'attendance'
  | 'notices'
  | 'gallery'
  | 'personnel'
  | 'duty'
  | 'patrol'
  | 'commander'
  | 'office'
  | 'emergency'
  | 'calendar'
  | 'library';

interface HeaderProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  onTriggerSos: () => void;
  onInstallPwa: () => void;
  activeAlertCount?: number;
  unreadCircularCount?: number;
  activeNoticeCount?: number;
  battalionConfig?: {
    name: string;
    address: string;
    logoUrl?: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isAdmin,
  onToggleAdmin,
  isMobileView,
  onToggleMobileView,
  onTriggerSos,
  onInstallPwa,
  activeAlertCount = 0,
  unreadCircularCount = 0,
  activeNoticeCount = 0,
  battalionConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer shrink-0 group py-1"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-inner ring-2 ring-amber-400/80 group-hover:scale-105 transition-transform shrink-0">
              <img 
                src={battalionConfig?.logoUrl || BATTALION_EMBLEM} 
                alt="गण लोगो" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white tracking-tight leading-tight">
                  {battalionConfig?.name || 'सशस्त्र प्रहरी गण नं. २'}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="प्रणाली अनलाइन" />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {battalionConfig?.address || 'महाराजगञ्ज, काठमाडौँ'} • कमाण्ड, परिपत्र तथा मोबाइल सेवा
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs">
            
            <button
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>गृह (Home)</span>
            </button>

            {/* कार्यालय (गण परिचय तथा अन्य सम्पूर्ण विवरण) - गृह पेज नजिकै */}
            <button
              onClick={() => onSelectTab('office')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'office'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-cyan-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>कार्यालय परिचय</span>
            </button>

            {/* तालुक परिपत्रहरू (Circulars with Camera / Photo capture) */}
            <button
              onClick={() => onSelectTab('circulars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all relative ${
                activeTab === 'circulars'
                  ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileImage className="w-3.5 h-3.5 text-amber-400" />
              <span>तालुक परिपत्र</span>
              {unreadCircularCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* डिजिटल हाजिरी (GPS 50m) */}
            <button
              onClick={() => onSelectTab('attendance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'attendance'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>हाजिरी (GPS)</span>
            </button>

            {/* सूचना पाटी (Notice Board) */}
            <button
              onClick={() => onSelectTab('notices')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'notices'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-yellow-400" />
              <span>सूचना पाटी</span>
            </button>

            {/* फोटो ग्यालरी (Battalion Photo Gallery) */}
            <button
              onClick={() => onSelectTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>फोटो ग्यालरी</span>
            </button>

            {/* कर्मचारी विवरण (PMIS & Unique QR Codes) */}
            <button
              onClick={() => onSelectTab('personnel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'personnel'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>कर्मचारी / QR</span>
            </button>

            {/* ड्युटी रोस्टर */}
            <button
              onClick={() => onSelectTab('duty')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'duty'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>ड्युटी रोस्टर</span>
            </button>

            {/* गस्ती / GPS */}
            <button
              onClick={() => onSelectTab('patrol')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'patrol'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>गस्ती/GPS</span>
            </button>

            {/* कमाण्डर ड्यासबोर्ड (Admin Controlled) */}
            <button
              onClick={() => onSelectTab('commander')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === 'commander'
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                  : 'text-amber-300/90 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>कमाण्डर ड्यासबोर्ड</span>
            </button>

          </nav>

          {/* Right Action Controls: PWA, Admin Toggle, Mobile Frame, SOS */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Install PWA Button */}
            <button
              onClick={onInstallPwa}
              title="मोबाइलमा एप इन्स्टल गर्नुहोस्"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">एप डाउनलोड</span>
            </button>

            {/* Admin Mode Toggle */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                isAdmin
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={isAdmin ? 'Admin मोड बन्द गर्नुहोस्' : 'Admin लगइन गर्नुहोस्'}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Admin सक्रिय</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Admin लगइन</span>
                </>
              )}
            </button>

            {/* Mobile View Toggle */}
            <button
              onClick={onToggleMobileView}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                isMobileView
                  ? 'bg-blue-900/60 border-blue-500 text-blue-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="मोबाइल स्क्रिन फ्रेम टगल गर्नुहोस्"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">मोबाइल</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={onTriggerSos}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-red-950/50 ring-2 ring-red-400 animate-pulse hover:animate-none transition"
              title="आपतकालीन आपतकालीन अलर्ट (Emergency SOS)"
            >
              <AlertTriangle className="w-4 h-4 fill-white" />
              <span>SOS</span>
              {activeAlertCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-red-600 text-[10px] flex items-center justify-center font-black">
                  {activeAlertCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
