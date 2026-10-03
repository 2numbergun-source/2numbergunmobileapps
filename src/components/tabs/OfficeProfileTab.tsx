import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  MapPin, 
  Phone, 
  Award, 
  CheckCircle2, 
  Users, 
  Truck, 
  History, 
  Edit3, 
  Compass, 
  Landmark, 
  Plus, 
  Trash2, 
  Save, 
  Lock, 
  Upload,
  Sparkles
} from 'lucide-react';
import { BattalionConfig } from '../../types/police';
import { BATTALION_EMBLEM, BATTALION_BANNER } from '../../assets/images';

interface OfficeProfileTabProps {
  config: BattalionConfig;
  onUpdateConfig?: (updated: BattalionConfig) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const OfficeProfileTab: React.FC<OfficeProfileTabProps> = ({ 
  config, 
  onUpdateConfig,
  isAdmin,
  onRequireAdmin
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [historyText, setHistoryText] = useState(config.historyOverview || '');
  const [missionText, setMissionText] = useState(config.missionStatement || '');
  const [chiefName, setChiefName] = useState(config.chiefCommanderName || '');
  const [chiefRank, setChiefRank] = useState(config.chiefCommanderRank || '');
  const [dutyContact, setDutyContact] = useState(config.dutyOfficerContact || '');
  const [officeContact, setOfficeContact] = useState(config.officeContact || '');
  const [controlRoom, setControlRoom] = useState(config.controlRoomContact || '');
  const [totalDarbandi, setTotalDarbandi] = useState<number>(config.totalDarbandiStrength || 600);
  const [presentForces, setPresentForces] = useState<number>(config.availableForces || 350);
  const [vehicles, setVehicles] = useState<number>(config.activeVehicles || 4);
  const [estYear, setEstYear] = useState(config.establishmentYear || '२०५६ BS');
  const [address, setAddress] = useState(config.address || 'महाराजगञ्ज, काठमाडौँ');

  // Custom key responsibilities (गणका प्रमुख कार्यक्षेत्र तथा जिम्मेवारीहरू)
  const defaultResponsibilities = [
    { id: '1', title: 'द्रुत प्रतिकार्य (QRF परिचालन)', desc: 'कुनै पनि आकस्मिक अवस्थामा ३ मिनेटभित्र दंगा नियन्त्रण गियरसहित तत्काल परिचालन।' },
    { id: '2', title: 'विशिष्ट व्यक्ति तथा क्षेत्र सुरक्षा', desc: 'उपत्यकाका संवेदनशील कूटनीतिक नियोग र विशिष्ट अतिथिको उच्च सतर्कता सुरक्षा।' },
    { id: '3', title: '२४ घन्टे मोबाइल गस्ती', desc: 'काठमाडौँ उपत्यका चक्रपथ तथा मुख्य नाकाहरूमा निरन्तर सुरक्षा गस्ती र चेकप्वाइन्ट।' },
    { id: '4', title: 'डिजिटल हाजिरी तथा अनुशासन', desc: '५० मिटर Geofence सिमाभित्र प्रमाणित डिजिटल हाजिरी तथा परिपत्र कार्यान्वयन।' }
  ];

  const [responsibilities, setResponsibilities] = useState<{ id: string; title: string; desc: string }[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_responsibilities');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultResponsibilities;
  });

  const [newRespTitle, setNewRespTitle] = useState('');
  const [newRespDesc, setNewRespDesc] = useState('');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateConfig) return;

    const updated: BattalionConfig = {
      ...config,
      historyOverview: historyText,
      missionStatement: missionText,
      chiefCommanderName: chiefName,
      chiefCommanderRank: chiefRank,
      dutyOfficerContact: dutyContact,
      officeContact: officeContact,
      controlRoomContact: controlRoom,
      totalDarbandiStrength: Number(totalDarbandi) || 600,
      availableForces: Number(presentForces) || 350,
      activeVehicles: Number(vehicles) || 4,
      establishmentYear: estYear,
      address: address,
    };

    onUpdateConfig(updated);
    try {
      localStorage.setItem('apf_gun2_responsibilities', JSON.stringify(responsibilities));
    } catch (err) {
      console.warn(err);
    }
    setIsEditing(false);
  };

  const handleAddResponsibility = () => {
    if (!newRespTitle.trim()) return;
    const newItems = [
      ...responsibilities, 
      { id: Date.now().toString(), title: newRespTitle.trim(), desc: newRespDesc.trim() || 'कार्य विवरण...' }
    ];
    setResponsibilities(newItems);
    setNewRespTitle('');
    setNewRespDesc('');
    try {
      localStorage.setItem('apf_gun2_responsibilities', JSON.stringify(newItems));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDeleteResponsibility = (id: string) => {
    const updated = responsibilities.filter(r => r.id !== id);
    setResponsibilities(updated);
    try {
      localStorage.setItem('apf_gun2_responsibilities', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header Banner & Main Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="h-48 sm:h-64 relative overflow-hidden bg-slate-950">
          <img 
            src={config.bannerUrl || BATTALION_BANNER} 
            alt="कार्यालय कमाण्ड हेडक्वार्टर" 
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 ring-4 ring-amber-400 shadow-2xl shrink-0 overflow-hidden">
                <img 
                  src={config.logoUrl || BATTALION_EMBLEM} 
                  alt="गण लोगो" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                    सशस्त्र प्रहरी बल, नेपाल
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    २४/७ कमाण्ड सक्रिय
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white">{config.name}</h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {config.address} • कमाण्ड हेडक्वार्टर तथा द्रुत प्रतिकार्य (QRF) आधार शिविर
                </p>
              </div>
            </div>

            {/* Admin Edit Trigger Button */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 text-right shrink-0">
                <span className="text-[11px] text-slate-400 block font-medium">स्थापना वर्ष</span>
                <span className="text-base font-bold text-amber-400 font-mono">{config.establishmentYear}</span>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer ${
                    isEditing 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white ring-2 ring-amber-300' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'सम्पादन बन्द' : 'परिचय सम्पादन (Admin)'}</span>
                </button>
              ) : (
                <button
                  onClick={onRequireAdmin}
                  className="px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin लगइन</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800 bg-slate-950 border-t border-slate-800 text-xs">
          <div className="p-4 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              कुल स्वीकृत दरबन्दी
            </span>
            <span className="text-xl font-black text-cyan-300 font-mono block">
              {config.totalDarbandiStrength} जना
            </span>
            <span className="text-[10px] text-emerald-400">उपस्थित: {config.availableForces} जना</span>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              गणपति (कमाण्डर)
            </span>
            <span className="text-sm font-bold text-white block">
              {config.chiefCommanderRank}
            </span>
            <span className="text-xs font-extrabold text-amber-400 block">
              {config.chiefCommanderName}
            </span>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              सक्रिय सुरक्षा सवारी
            </span>
            <span className="text-xl font-black text-blue-300 font-mono block">
              {config.activeVehicles} वटा
            </span>
            <span className="text-[10px] text-slate-400">QRF Van, Scorpio, Riot Control</span>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              डिजिटल हाजिरी सिमा
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono block">
              ५० मिटर
            </span>
            <span className="text-[10px] text-slate-400">कडा Geofence सुरक्षा परिधि</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Inline Editor Form (यदि Admin ले एडिट खोलेमा) */}
      {isEditing && (
        <form onSubmit={handleSaveAll} className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">कार्यालयको परिचय तथा सम्पूर्ण विवरण सम्पादन (Admin)</h3>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>परिवर्तन सुरक्षित गर्नुहोस् (Save)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">गणपति (कमाण्डर) नाम</label>
              <input
                type="text"
                value={chiefName}
                onChange={(e) => setChiefName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">कमाण्डर दर्जा</label>
              <input
                type="text"
                value={chiefRank}
                onChange={(e) => setChiefRank(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">स्थापना वर्ष</label>
              <input
                type="text"
                value={estYear}
                onChange={(e) => setEstYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">कुल स्वीकृत दरबन्दी (संख्या)</label>
              <input
                type="number"
                value={totalDarbandi}
                onChange={(e) => setTotalDarbandi(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">हाल उपस्थित फौज (संख्या)</label>
              <input
                type="number"
                value={presentForces}
                onChange={(e) => setPresentForces(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">सक्रिय सुरक्षा सवारी (संख्या)</label>
              <input
                type="number"
                value={vehicles}
                onChange={(e) => setVehicles(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">२४ घन्टे ड्युटी अधिकृत सम्पर्क</label>
              <input
                type="text"
                value={dutyContact}
                onChange={(e) => setDutyContact(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">कार्यालय टेलिफोन</label>
              <input
                type="text"
                value={officeContact}
                onChange={(e) => setOfficeContact(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">आपतकालीन कन्ट्रोल रुम</label>
              <input
                type="text"
                value={controlRoom}
                onChange={(e) => setControlRoom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-400 font-semibold">कार्यालयको ऐतिहासिक परिचय तथा पृष्ठभूमि विवरण</label>
            <textarea
              rows={3}
              value={historyText}
              onChange={(e) => setHistoryText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white leading-relaxed"
            />
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-400 font-semibold">गणको मूल आदर्श वाक्य तथा उद्देश्य (Mandate)</label>
            <textarea
              rows={2}
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white leading-relaxed"
            />
          </div>
        </form>
      )}

      {/* 2. विस्तृत कार्यालय परिचय (Battalion History & Identity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: इतिहास तथा परिचय */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">
                  कार्यालयको ऐतिहासिक परिचय तथा पृष्ठभूमि
                </h2>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {config.historyOverview || 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज काठमाडौँ उपत्यकाको संवेदनशील प्रशासनिक तथा कूटनीतिक क्षेत्रको प्रमुख सुरक्षा कमाण्ड गण हो। यसले उपत्यकाभर दंगा नियन्त्रण तथा आपतकालीन सुरक्षा सेवा प्रवाह गर्दै आएको छ।'}
            </p>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>गणको मूल आदर्श वाक्य तथा उद्देश्य (Mandate):</span>
              </span>
              <p className="text-slate-300 italic leading-relaxed">
                "{config.missionStatement}"
              </p>
            </div>
          </div>

          {/* मुख्य जिम्मेवारी तथा कार्यनीति (Admin ले नयाँ थप्न वा हटाउन मिल्ने) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  गणका प्रमुख कार्यक्षेत्र तथा जिम्मेवारीहरू
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                कुल {responsibilities.length} कार्यनीति
              </span>
            </div>

            {/* List of Responsibilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              {responsibilities.map((resp) => (
                <div key={resp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2.5 group hover:border-slate-700 transition">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{resp.title}</strong>
                      <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">{resp.desc}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteResponsibility(resp.id)}
                      className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="यो जिम्मेवारी हटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Admin Add New Responsibility Form */}
            {isAdmin && (
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-dashed border-slate-700 text-xs space-y-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>नयाँ कार्य जिम्मेवारी थप्नुहोस् (Admin)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="शीर्षक (उदा: भीड नियन्त्रण तथा स्ट्राइक टोली)"
                    value={newRespTitle}
                    onChange={(e) => setNewRespTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="छोटो विवरण..."
                    value={newRespDesc}
                    onChange={(e) => setNewRespDesc(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  disabled={!newRespTitle.trim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>जिम्मेवारी थप्नुहोस्</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: सम्पर्क विवरण, ठेगाना र GPS */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* कमाण्ड सम्पर्क कार्ड */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Phone className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">कार्यालय सम्पर्क तथा हेल्पलाइन</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">२४ घन्टे ड्युटी अधिकृत (Duty Officer)</span>
                <a 
                  href={`tel:${config.dutyOfficerContact}`} 
                  className="text-base font-mono font-bold text-amber-400 hover:underline block mt-0.5"
                >
                  {config.dutyOfficerContact}
                </a>
                <span className="text-[10px] text-slate-500">कमाण्ड डेस्क महाराजगञ्ज</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">कार्यालय टेलिफोन</span>
                <a 
                  href={`tel:${config.officeContact}`} 
                  className="text-sm font-mono font-bold text-emerald-400 hover:underline block mt-0.5"
                >
                  {config.officeContact}
                </a>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">आपतकालीन नियन्त्रण कक्ष</span>
                <a 
                  href="tel:100" 
                  className="text-sm font-mono font-bold text-red-400 hover:underline block mt-0.5"
                >
                  {config.controlRoomContact}
                </a>
              </div>
            </div>
          </div>

          {/* भौगोलिक स्थिति तथा GPS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <MapPin className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold text-white">भौगोलिक केन्द्र (Geofence GPS)</h3>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">स्थान / ठेगाना:</span>
                <span className="text-white font-semibold">{config.address}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">अक्षांश (Latitude):</span>
                <span className="text-cyan-300 font-bold">{config.centerCoords.lat}° N</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">देशान्तर (Longitude):</span>
                <span className="text-cyan-300 font-bold">{config.centerCoords.lng}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">हाजिरी सिमा:</span>
                <span className="text-emerald-400 font-bold">५० मिटर Geofence Radius</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * सम्पूर्ण सुरक्षा कर्मचारी तथा अधिकृतहरूको दैनिक डिजिटल हाजिरी यही ५० मिटर परिधिभित्र मात्र रुजु हुने गरी सुरक्षा प्रणाली जोडिएको छ।
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
