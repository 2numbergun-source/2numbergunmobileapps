import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  Radio, 
  Car, 
  FileText, 
  CheckCircle2, 
  IdCard, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  X,
  FileImage,
  Image as ImageIcon,
  BellRing,
  QrCode,
  Building2,
  Lock,
  Edit,
  Save,
  Award,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';
import { Officer, DutyItem, AttendanceRecord, BattalionConfig, CircularDocument, NoticeItem } from '../../types/police';
import { BATTALION_EMBLEM, BATTALION_BANNER } from '../../assets/images';
import { PWAInstallButton } from '../PWAInstallButton';
import { OfficerQrModal } from '../OfficerQrModal';

interface HomeTabProps {
  currentOfficer: Officer;
  todayDuty: DutyItem | undefined;
  todayAttendance: AttendanceRecord | undefined;
  battalionConfig: BattalionConfig;
  onUpdateBattalionConfig: (newConfig: BattalionConfig) => void;
  latestCircular?: CircularDocument;
  latestNotice?: NoticeItem;
  isAdmin: boolean;
  onRequireAdmin: () => void;
  onNavigateAttendance: () => void;
  onNavigateDuty: () => void;
  onNavigatePatrol: () => void;
  onNavigateCirculars: () => void;
  onNavigateNotices: () => void;
  onNavigateGallery: () => void;
  onNavigateOffice?: () => void;
  onNavigateContacts: () => void;
  onTriggerSos: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentOfficer,
  todayDuty,
  todayAttendance,
  battalionConfig,
  onUpdateBattalionConfig,
  latestCircular,
  latestNotice,
  isAdmin,
  onRequireAdmin,
  onNavigateAttendance,
  onNavigateDuty,
  onNavigatePatrol,
  onNavigateCirculars,
  onNavigateNotices,
  onNavigateGallery,
  onNavigateOffice,
  onNavigateContacts,
  onTriggerSos,
}) => {
  const [showIdCard, setShowIdCard] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);

  // Battalion edit form state
  const [editName, setEditName] = useState(battalionConfig.name);
  const [editAddress, setEditAddress] = useState(battalionConfig.address);
  const [editCommander, setEditCommander] = useState(battalionConfig.chiefCommanderName);
  const [editCommanderRank, setEditCommanderRank] = useState(battalionConfig.chiefCommanderRank);
  const [editDutyOfficer, setEditDutyOfficer] = useState(battalionConfig.dutyOfficerContact);
  const [editOfficeContact, setEditOfficeContact] = useState(battalionConfig.officeContact);
  const [editMission, setEditMission] = useState(battalionConfig.missionStatement);
  const [editTicker, setEditTicker] = useState(battalionConfig.announcementTicker || '');
  const [editLogoUrl, setEditLogoUrl] = useState(battalionConfig.logoUrl || '');
  const [editBannerUrl, setEditBannerUrl] = useState(battalionConfig.bannerUrl || '');
  const [editDarbandi, setEditDarbandi] = useState<number>(battalionConfig.totalDarbandiStrength || 600);
  const [editAvailable, setEditAvailable] = useState<number>(battalionConfig.availableForces || 350);

  // Keep form state in sync when battalionConfig updates
  React.useEffect(() => {
    setEditName(battalionConfig.name);
    setEditAddress(battalionConfig.address);
    setEditCommander(battalionConfig.chiefCommanderName);
    setEditCommanderRank(battalionConfig.chiefCommanderRank);
    setEditDutyOfficer(battalionConfig.dutyOfficerContact);
    setEditOfficeContact(battalionConfig.officeContact);
    setEditMission(battalionConfig.missionStatement);
    setEditTicker(battalionConfig.announcementTicker || '');
    setEditLogoUrl(battalionConfig.logoUrl || '');
    setEditBannerUrl(battalionConfig.bannerUrl || '');
    setEditDarbandi(battalionConfig.totalDarbandiStrength || 600);
    setEditAvailable(battalionConfig.availableForces || 350);
  }, [battalionConfig]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setEditLogoUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setEditBannerUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBattalionConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BattalionConfig = {
      ...battalionConfig,
      name: editName,
      address: editAddress,
      chiefCommanderName: editCommander,
      chiefCommanderRank: editCommanderRank,
      dutyOfficerContact: editDutyOfficer,
      officeContact: editOfficeContact,
      missionStatement: editMission,
      announcementTicker: editTicker,
      totalDarbandiStrength: Number(editDarbandi) || 600,
      availableForces: Number(editAvailable) || 350,
      logoUrl: editLogoUrl || undefined,
      bannerUrl: editBannerUrl || undefined,
    };
    onUpdateBattalionConfig(updated);
    setShowAdminEditModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Live Urgent Announcement Ticker */}
      {battalionConfig.announcementTicker && (
        <div className="bg-red-950/80 border border-red-600/70 rounded-xl px-4 py-2 text-xs flex items-center justify-between gap-3 text-red-200 shadow-md">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="font-bold text-red-300 shrink-0">आकस्मिक सूचना:</span>
            <span className="truncate">{battalionConfig.announcementTicker}</span>
          </div>
          <button
            onClick={onNavigateNotices}
            className="text-[11px] text-amber-300 hover:underline font-bold shrink-0"
          >
            सूचना हेर्नुहोस् &rarr;
          </button>
        </div>
      )}

      {/* 2. Main Hero Battalion Profile & Officer Identification Banner */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Officer & Battalion Info */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
            
            {/* Top Badge */}
            <div className="flex items-center gap-3">
              {/* Logo with direct Admin Edit Trigger */}
              <div className="relative group shrink-0">
                <div 
                  onClick={() => {
                    if (!isAdmin) {
                      onRequireAdmin();
                    } else {
                      setShowAdminEditModal(true);
                    }
                  }}
                  className="w-14 h-14 rounded-full bg-white p-1 ring-2 ring-amber-400 shadow overflow-hidden cursor-pointer hover:ring-amber-300 transition"
                  title={isAdmin ? "गण लोगो परिवर्तन गर्नुहोस्" : "लोगो परिवर्तन गर्न Admin पिन आवश्यक छ"}
                >
                  <img 
                    src={battalionConfig.logoUrl || BATTALION_EMBLEM} 
                    alt="गण लोगो" 
                    className="w-full h-full object-contain"
                  />
                </div>
                {isAdmin ? (
                  <button
                    onClick={() => setShowAdminEditModal(true)}
                    title="गण लोगो परिवर्तन गर्नुहोस् (Admin)"
                    className="absolute -bottom-1 -right-1 p-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg border border-slate-900 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={onRequireAdmin}
                    title="लोगो परिवर्तन गर्न Admin लगइन गर्नुहोस्"
                    className="absolute -bottom-1 -right-1 p-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-full shadow-lg border border-slate-900 cursor-pointer opacity-70 hover:opacity-100"
                  >
                    <Lock className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-medium">
                    सशस्त्र प्रहरी बल, नेपाल • कमाण्ड हेडक्वार्टर
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    २४/७ स्ट्यान्डबाइ सक्रिय
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  {battalionConfig.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {battalionConfig.address} • डिजिटल कमाण्ड, हाजिरी तथा परिपत्र प्रणाली
                </p>
              </div>
            </div>

            {/* Officer Meta Row & QR / ID card Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">{currentOfficer.rank}</span>
                  <span>{currentOfficer.name}</span>
                </div>
                <div className="text-xs text-slate-400">
                  दर्ता नं: <span className="text-slate-200 font-mono font-semibold">{currentOfficer.computerCode}</span> • {currentOfficer.role}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>मेरो QR कोड</span>
                </button>

                <button
                  onClick={() => setShowIdCard(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  <IdCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>डिजिटल परिचय पत्र</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Tactical Troops Banner with Overlay */}
          <div className="lg:col-span-5 relative min-h-[160px] lg:min-h-[200px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden group">
            <img 
              src={battalionConfig.bannerUrl || BATTALION_BANNER} 
              alt="Battalion Photo / Formation"
              className="w-full h-full object-cover object-center brightness-95"
            />
            {isAdmin ? (
              <button
                onClick={() => setShowAdminEditModal(true)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/50 text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur cursor-pointer z-10"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>कार्यालय फोटो फेर्नुहोस् (Admin)</span>
              </button>
            ) : (
              <button
                onClick={onRequireAdmin}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium flex items-center gap-1.5 shadow backdrop-blur cursor-pointer z-10 opacity-70 hover:opacity-100"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>फोटो फेर्न Admin लगइन</span>
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-mono">
                  {battalionConfig.address} हेडक्वार्टर बेस
                </span>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                  अलर्ट कमाण्ड
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. REQUIREMENT 3 HIGHLIGHT: BATTALION PROFILE & INFO (बाहिरबाट नै देखिने गण सम्बन्धी जानकारी विवरण) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>गण सम्बन्धी जानकारी तथा कमाण्ड विवरण (Battalion Profile)</span>
              </h2>
              <p className="text-xs text-slate-400">
                स्थापना: {battalionConfig.establishmentYear} • {battalionConfig.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateOffice && (
              <button
                onClick={onNavigateOffice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition cursor-pointer"
                title="कार्यालयको विस्तृत परिचय तथा विवरण हेर्नुहोस्"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>कार्यालय परिचय पूरा हेर्नुहोस् →</span>
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={() => setShowAdminEditModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>गण विवरण सम्पादन (Admin ड्यासबोर्ड)</span>
              </button>
            ) : (
              <button
                onClick={onRequireAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs transition cursor-pointer"
                title="यो विवरण एड्मिनले मात्र परिवर्तन गर्न सक्छ"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin नियन्त्रण</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Battalion Quick Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">गणपति (कमाण्डर)</span>
            <span className="text-sm font-bold text-white block">
              {battalionConfig.chiefCommanderRank}
            </span>
            <span className="text-xs font-extrabold text-amber-400 block">
              {battalionConfig.chiefCommanderName}
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">कुल स्वीकृत दरबन्दी</span>
            <span className="text-lg font-black text-cyan-300 font-mono block">
              {battalionConfig.totalDarbandiStrength} जना
            </span>
            <span className="text-[10px] text-emerald-400 block">
              उपस्थित: {battalionConfig.availableForces} जना
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">२४ घन्टे ड्युटी अधिकृत</span>
            <a 
              href={`tel:${battalionConfig.dutyOfficerContact}`} 
              className="text-sm font-mono font-bold text-blue-400 hover:underline block"
            >
              {battalionConfig.dutyOfficerContact}
            </a>
            <span className="text-[10px] text-slate-400 block">कमाण्ड डेस्क महाराजगञ्ज</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">कार्यालय टेलिफोन</span>
            <a 
              href={`tel:${battalionConfig.officeContact}`} 
              className="text-sm font-mono font-bold text-emerald-400 hover:underline block"
            >
              {battalionConfig.officeContact}
            </a>
            <span className="text-[10px] text-slate-400 block">कन्ट्रोल १०० / ०१-४३७५६७८</span>
          </div>
        </div>

        {/* Mission & Key Mandate */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>गणको मुख्य जिम्मेवारी तथा कार्यक्षेत्र (Battalion Mandate):</span>
          </span>
          <p className="text-slate-300 leading-relaxed">
            {battalionConfig.missionStatement}
          </p>
        </div>
      </div>

      {/* 4. REQUIREMENT 1 HIGHLIGHT: LATEST TALUK CIRCULAR (तालुक परिपत्र फोटो पूर्वावलोकन कार्ड) */}
      <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                  ताजा परिपत्र (Circular Alert)
                </span>
                <span className="text-xs text-slate-400">
                  {latestCircular?.date || '२०८३/०६/१०'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {latestCircular?.title || 'काठमाडौँ उपत्यका चाडपर्व विशेष सुरक्षा सतर्कता तथा QRF स्ट्यान्डबाइ सम्बन्धमा'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateCirculars}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              <span>सबै परिपत्रहरू हेर्नुहोस् &rarr;</span>
            </button>
          </div>
        </div>

        {/* Circular Mini Preview */}
        {latestCircular && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div 
              onClick={onNavigateCirculars}
              className="w-full sm:w-28 h-24 rounded-lg bg-black overflow-hidden border border-slate-700 shrink-0 cursor-pointer relative group"
            >
              <img 
                src={latestCircular.photoUrl} 
                alt="Circular Thumbnail" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[10px] text-white font-bold">
                फोटो हेर्नुहोस्
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="text-slate-400">
                जारी गर्ने निकाय: <strong className="text-white">{latestCircular.issuingOffice}</strong> • चलानी नं: <span className="font-mono text-cyan-300">{latestCircular.circularNo}</span>
              </div>
              <p className="text-slate-300 leading-relaxed line-clamp-2">
                {latestCircular.summary}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px]">
                <span className="text-amber-400 font-bold">
                  प्राथमिकता: {latestCircular.priority}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">
                  {latestCircular.acknowledgedOfficerIds.includes(currentOfficer.id) ? '✓ तपाईंले पढिसक्नुभयो' : '⚠️ तपाईंले अध्ययन गर्न बाँकी छ'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. PWA Installation Box */}
      <PWAInstallButton />

      {/* 6. Quick Digital Attendance Status Banner */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                गण ५० मिटर डिजिटल हाजिरी स्थिति
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {todayAttendance?.status || 'उपस्थित'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-200">
              <span>आजको हाजिरी (Check-in): <strong className="text-emerald-400 font-mono">{todayAttendance?.checkInTime || '०८:४५'}</strong></span>
              <span>Check-out: <strong className="text-amber-400 font-mono">{todayAttendance?.checkOutTime || '१७:०५'}</strong></span>
              <span className="text-slate-400">दूरी: <strong className="text-white">{todayAttendance?.distanceFromBattalionMeters || 8} मिटर (सिमाभित्र)</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateAttendance}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <span>हाजिरी प्रणाली खोल्नुहोस्</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7. Special System: 'Mero Aaja' Daily Duty Briefing */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-5">
        
        {/* Duty Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>विशेष प्रणाली: "मेरो आज" दैनिक ड्युटी ब्रिफिङ</span>
              </h2>
              <p className="text-xs text-slate-400">
                आज, {todayDuty?.date || '२०८३ असोज १३ गते'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
              {todayDuty?.timeSlot || '०६:०० बजे - १४:०० बजे'}
            </div>
            <button
              onClick={onNavigateDuty}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              सम्पूर्ण रोस्टर &rarr;
            </button>
          </div>
        </div>

        {/* 6 Duty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: ड्युटी कहाँ छ? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>१. आज मेरो ड्युटी कहाँ छ?</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white pl-6">
              {todayDuty?.locationName || 'कोटेश्वर गण मुख्य स्ट्यान्डबाइ / कोटेश्वर चोक'}
            </div>
            <div className="pl-6 pt-1">
              <button
                onClick={onNavigatePatrol}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>GPS नक्सामा लाइभ हेर्नुहोस्</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: कति बजे सुरु र समाप्त हुन्छ? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>२. कति बजे सुरु र समाप्त हुन्छ?</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 pl-6">
              {todayDuty?.timeSlot || 'बिहान ०६:०० बजे देखि दिउँसो १४:०० बजे सम्म'}
            </div>
            <p className="text-[11px] text-slate-400 pl-6">
              शिफ्ट सुरु हुनुभन्दा १५ मिनेट अगाडि रोलकल तथा ब्रिफिङ अनिवार्य।
            </p>
          </div>

          {/* Card 3: को-को टोलीमा छन्? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span>३. को-को टोलीमा छन्? ({todayDuty?.teamMembers.length || 5} जना)</span>
            </div>
            <div className="text-xs text-slate-300 pl-6 leading-relaxed">
              {todayDuty?.teamMembers.map((m, idx) => (
                <span key={idx}>
                  <strong className={m.role?.includes('तपाईं') ? 'text-amber-400' : 'text-slate-100'}>
                    {m.name}
                  </strong>
                  {idx < (todayDuty?.teamMembers.length || 5) - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: टोली प्रमुख (कमाण्डर) को हो? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>४. टोली प्रमुख (कमाण्डर) को हो?</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-amber-300 pl-6 flex items-center flex-wrap gap-2">
              <span>{todayDuty?.commanderRank || 'प्र.स.नि. (ASI)'} {todayDuty?.commanderName || 'शिव श्रेष्ठ'}</span>
              <a 
                href={`tel:${todayDuty?.commanderPhone || '9851100123'}`} 
                className="text-xs font-mono text-blue-400 hover:text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{todayDuty?.commanderPhone || '९८५११००१२३'}</span>
              </a>
            </div>
          </div>

          {/* Card 5: कुन सवारी प्रयोग गर्ने? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Car className="w-4 h-4 text-purple-400" />
              <span>५. कुन सवारी प्रयोग गर्ने?</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white pl-6">
              <span>{todayDuty?.vehicleNumber || 'बा. १ ग २१०४'}</span>
              <span className="text-slate-300 font-normal"> ({todayDuty?.vehicleModel || 'Scorpio QRF Van'})</span>
            </div>
            <div className="text-xs text-slate-400 pl-6">
              चालक: <span className="text-slate-200">{todayDuty?.driverName || 'प्र.ज. सुमन केसी'}</span> • फोन: <a href={`tel:${todayDuty?.driverPhone || '9841230099'}`} className="text-blue-400 hover:underline">{todayDuty?.driverPhone || '९८४१२३००९९'}</a>
            </div>
          </div>

          {/* Card 6: ड्युटी सम्बन्धी विशेष निर्देशन के छ? */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>६. ड्युटी सम्बन्धी विशेष निर्देशन के छ?</span>
            </div>
            <ul className="text-xs text-slate-300 pl-6 space-y-1.5 list-decimal list-outside">
              {todayDuty?.instructions.map((inst, i) => (
                <li key={i} className="leading-snug">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 8. Emergency Calling Speed Dial Footer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>नेपाल प्रहरी आधिकारिक आपतकालीन हटलाइनहरू (२४/७ सेवा)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            प्रहरी कन्ट्रोल १००, टोल-फ्री १६६००१४१५१६, ट्राफिक १०३, गण कार्यालय ०१-४३७१२३४
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:100"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-bold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>कन्ट्रोल १००</span>
          </a>

          <a
            href="tel:16600141516"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 text-xs font-bold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>टोल-फ्री १६६००१४१५१६</span>
          </a>

          <button
            onClick={onNavigateContacts}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            सबै नम्बर हेर्नुहोस् &rarr;
          </button>
        </div>
      </div>

      {/* Modal: Admin Edit Battalion Config Dashboard (Admin Only) */}
      {showAdminEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">गण विवरण, लोगो तथा कार्यालय फोटो सम्पादन</h3>
              </div>
              <button
                onClick={() => setShowAdminEditModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBattalionConfig} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">गणको नाम</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">स्थान तथा ठेगाना</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">गणपति (कमाण्डर) नाम</label>
                  <input
                    type="text"
                    required
                    value={editCommander}
                    onChange={(e) => setEditCommander(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">कमाण्डर दर्जा (Rank)</label>
                  <input
                    type="text"
                    required
                    value={editCommanderRank}
                    onChange={(e) => setEditCommanderRank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">कुल स्वीकृत दरबन्दी (संख्या)</label>
                  <input
                    type="number"
                    required
                    value={editDarbandi}
                    onChange={(e) => setEditDarbandi(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">हाल उपस्थित फौज (संख्या)</label>
                  <input
                    type="number"
                    required
                    value={editAvailable}
                    onChange={(e) => setEditAvailable(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">२४ घन्टे ड्युटी अधिकृत सम्पर्क</label>
                  <input
                    type="text"
                    required
                    value={editDutyOfficer}
                    onChange={(e) => setEditDutyOfficer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">कार्यालय सम्पर्क</label>
                  <input
                    type="text"
                    required
                    value={editOfficeContact}
                    onChange={(e) => setEditOfficeContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">आकस्मिक सूचना टिकर (Notice Ticker)</label>
                <input
                  type="text"
                  placeholder="गृह पृष्ठमा रातो ब्यानरमा देखिने सूचना..."
                  value={editTicker}
                  onChange={(e) => setEditTicker(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">गणको मूल जिम्मेवारी तथा लक्ष्य (Mandate)</label>
                <textarea
                  rows={3}
                  value={editMission}
                  onChange={(e) => setEditMission(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Logo and Office Banner Photo Upload */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>गणको लोगो तथा कार्यालय फोटो / ब्यानर परिवर्तन</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1. Logo upload */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-300">गणको लोगो (Battalion Emblem / Logo)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-amber-400 overflow-hidden shrink-0">
                        <img 
                          src={editLogoUrl || BATTALION_EMBLEM} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer shadow">
                          <Upload className="w-3.5 h-3.5" />
                          <span>लोगो अपलोड</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoUpload} 
                            className="hidden" 
                          />
                        </label>
                        {editLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditLogoUrl('')}
                            className="block text-[10px] text-red-400 hover:underline"
                          >
                            डिफल्ट लोगोमा फर्काउने
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Office Banner / Photo upload */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-300">कार्यालय फोटो / कमाण्ड ब्यानर (Office Photo / Banner)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
                        <img 
                          src={editBannerUrl || BATTALION_BANNER} 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer shadow">
                          <Camera className="w-3.5 h-3.5" />
                          <span>फोटो अपलोड</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBannerUpload} 
                            className="hidden" 
                          />
                        </label>
                        {editBannerUrl && (
                          <button
                            type="button"
                            onClick={() => setEditBannerUrl('')}
                            className="block text-[10px] text-red-400 hover:underline"
                          >
                            डिफल्ट फोटोमा फर्काउने
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  रद्द
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>सुरक्षित गर्नुहोस् (Update)</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Digital ID Card Modal */}
      {showIdCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/60 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                नेपाल प्रहरी डिजिटल परिचय पत्र (E-ID)
              </span>
              <button
                onClick={() => setShowIdCard(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-amber-400 mx-auto overflow-hidden p-1 shadow-md">
                <img 
                  src={battalionConfig.logoUrl || BATTALION_EMBLEM} 
                  alt="Emblem"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{currentOfficer.name}</h3>
                <p className="text-xs font-semibold text-amber-400">{currentOfficer.rank}</p>
                <p className="text-xs text-slate-400">{battalionConfig.name} {battalionConfig.address}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">कम्प्युटर कोड:</span>
                <span className="font-mono font-bold text-white">{currentOfficer.computerCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">रक्त समूह (Blood Group):</span>
                <span className="font-bold text-red-400">{currentOfficer.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">शाखा / कार्यदल:</span>
                <span className="font-semibold text-slate-200">{currentOfficer.companyOrTeam || currentOfficer.section}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">सम्पर्क:</span>
                <span className="font-mono text-blue-400">{currentOfficer.phone}</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => {
                  setShowIdCard(false);
                  setShowQrModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
              >
                <QrCode className="w-4 h-4" />
                <span>व्यक्तिगत QR कोड हेर्नुहोस्</span>
              </button>
            </div>

            <button
              onClick={() => setShowIdCard(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal for Current Officer */}
      {showQrModal && (
        <OfficerQrModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          officer={currentOfficer}
        />
      )}

    </div>
  );
};
