import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  FileText, 
  CheckCircle, 
  Building2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  Send,
  Eye
} from 'lucide-react';
import { BattalionNotice } from '../types/police';

interface TalukLetterDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchLetter: (notice: BattalionNotice) => void;
  currentOfficerName: string;
  currentOfficerRank: string;
}

export const TalukLetterDispatchModal: React.FC<TalukLetterDispatchModalProps> = ({
  isOpen,
  onClose,
  onDispatchLetter,
  currentOfficerName,
  currentOfficerRank,
}) => {
  const [talukOffice, setTalukOffice] = useState('प्रहरी प्रधान कार्यालय, नक्साल');
  const [customTalukOffice, setCustomTalukOffice] = useState('');
  const [patraSankhya, setPatraSankhya] = useState('०८२/०८३');
  const [chalaniNo, setChalaniNo] = useState('४८९२');
  const [letterDate, setLetterDate] = useState('२०८३ असोज १०');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BattalionNotice['category']>('तालुक पत्र');
  const [targetAudience, setTargetAudience] = useState<BattalionNotice['targetAudience']>('सबै कर्मचारी');
  const [isUrgent, setIsUrgent] = useState(true);
  const [letterPhoto, setLetterPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Read file as base64 data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLetterPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Provide a crisp sample official letter preview for testing on desktop
  const handleUseSampleLetter = () => {
    // Generate an official looking SVG letter document as data URI
    const svgLetter = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" fill="none">
      <rect width="800" height="1100" fill="%23fcfbfa"/>
      <rect x="25" y="25" width="750" height="1050" stroke="%23c4b5a5" stroke-width="2" fill="none"/>
      <rect x="35" y="35" width="730" height="1030" stroke="%23e7e5e4" stroke-width="1" fill="none"/>
      
      <!-- Top Coat of Arms Header -->
      <circle cx="400" cy="90" r="32" fill="%23dc2626" opacity="0.9"/>
      <path d="M400 65 L415 85 L385 85 Z" fill="%23ffffff"/>
      <circle cx="400" cy="92" r="8" fill="%23facc15"/>
      
      <text x="400" y="145" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b" text-anchor="middle">नेपाल सरकार</text>
      <text x="400" y="172" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23b91c1c" text-anchor="middle">गृह मन्त्रालय / प्रहरी प्रधान कार्यालय</text>
      <text x="400" y="196" font-family="sans-serif" font-size="14" fill="%23475569" text-anchor="middle">कार्य विभाग, अपरेसन तथा कमाण्ड शाखा, नक्साल, काठमाडौं</text>
      <line x1="100" y1="215" x2="700" y2="215" stroke="%23b91c1c" stroke-width="2"/>
      
      <!-- Dispatch info -->
      <text x="80" y="245" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23334155">पत्र संख्या: ०८२/०८३</text>
      <text x="80" y="270" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23334155">चलानी नं.: ४८९२ / अपरेसन</text>
      <text x="600" y="245" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23334155">मिति: २०८३/०६/१०</text>
      
      <!-- Addressee -->
      <text x="80" y="320" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">श्रीमान् गणपतिज्यू,</text>
      <text x="80" y="345" font-family="sans-serif" font-size="13" fill="%23334155">काठमाडौं उपत्यका सशस्त्र प्रहरी गण नं. २, महाराजगञ्ज।</text>
      
      <!-- Subject -->
      <rect x="80" y="375" width="640" height="36" fill="%23f1f5f9" rx="6"/>
      <text x="400" y="399" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="middle">विषय: आसन्न चाडपर्व तथा संवेदनशील क्षेत्र लक्षित विशेष सुरक्षा कमाण्ड सम्बन्धमा।</text>
      
      <!-- Body Text Lines -->
      <text x="80" y="450" font-family="sans-serif" font-size="13" fill="%231e293b">प्रस्तुत विषयमा तालुक कार्यालयको मिति २०८३/०६/१० को निर्णयानुसार काठमाडौं उपत्यकाको</text>
      <text x="80" y="480" font-family="sans-serif" font-size="13" fill="%231e293b">शान्ति सुरक्षा थप चुस्त र दुरुस्त राख्नका लागि त्यस गणबाट विशेष दंगा नियन्त्रण कार्यदल (QRF)</text>
      <text x="80" y="510" font-family="sans-serif" font-size="13" fill="%231e293b">तथा क, ख कम्पनीलाई २४ सै घण्टा स्ट्यान्डबाइ राखी मुख्य बजार, वित्तीय क्षेत्र तथा सार्वजनिक स्थलमा</text>
      <text x="80" y="540" font-family="sans-serif" font-size="13" fill="%231e293b">सघन मोबाइल गस्ती र आकस्मिक चेकपोष्ट परिचालन गर्न आदेशानुसार अनुरोध छ।</text>
      
      <text x="80" y="590" font-family="sans-serif" font-size="13" font-weight="bold" fill="%231e293b">निर्देशन बुँदाहरू:</text>
      <text x="100" y="625" font-family="sans-serif" font-size="12" fill="%23334155">१. संवेदनशील स्थानहरूमा दंगा प्रतिरोधी गियरसहित तत्काल परिचालित हुने व्यवस्था मिलाउने।</text>
      <text x="100" y="655" font-family="sans-serif" font-size="12" fill="%23334155">२. सञ्चार सेट तथा भीड नियन्त्रण उपकरणहरू तयारी हालतमा राख्ने।</text>
      <text x="100" y="685" font-family="sans-serif" font-size="12" fill="%23334155">३. दैनिक SITREP प्रतिवेदन प्रत्येक दिन साँझ १८:०० बजेभित्र यस शाखामा पठाउने।</text>
      
      <!-- Official Stamp & Sign -->
      <circle cx="200" cy="800" r="48" stroke="%231d4ed8" stroke-width="2" stroke-dasharray="6,4" fill="none" opacity="0.8"/>
      <text x="200" y="795" font-family="sans-serif" font-size="10" font-weight="bold" fill="%231d4ed8" text-anchor="middle">नेपाल प्रहरी</text>
      <text x="200" y="810" font-family="sans-serif" font-size="9" fill="%231d4ed8" text-anchor="middle">प्रधान कार्यालय</text>
      <text x="200" y="825" font-family="sans-serif" font-size="8" fill="%231d4ed8" text-anchor="middle">अपरेसन शाखा</text>
      
      <!-- Signature -->
      <path d="M530 790 Q560 760 590 780 T630 770 T660 785" stroke="%231e293b" stroke-width="2.5" fill="none"/>
      <text x="600" y="815" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230f172a" text-anchor="middle">(सुरेश श्रेष्ठ)</text>
      <text x="600" y="835" font-family="sans-serif" font-size="12" fill="%23475569" text-anchor="middle">प्रहरी वरिष्ठ उपरीक्षक (SSP)</text>
      <text x="600" y="855" font-family="sans-serif" font-size="11" fill="%23475569" text-anchor="middle">कार्य विभाग, अपरेसन प्रमुख</text>
      
      <!-- Security Watermark -->
      <text x="400" y="960" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2394a3b8" text-anchor="middle">*** आधिकारिक तालुक परिपत्र - मातहत सम्पूर्ण युनिटहरूमा कार्यान्वयनार्थ ***</text>
    </svg>`;
    setLetterPhoto(svgLetter);
    setPhotoName('taluk_official_circular_order_2083.pdf/img');
    if (!title) {
      setTitle('आसन्न चाडपर्व तथा संवेदनशील क्षेत्र लक्षित विशेष सुरक्षा कमाण्ड परिचालन आदेश');
    }
    if (!description) {
      setDescription('प्रहरी प्रधान कार्यालय कार्य विभागको चलानी नं. ४८९२ को पत्र अनुसार आसन्न चाडपर्वमा उपत्यकाको सुरक्षा संवेदनशीलतालाई मध्यनजर गरी QRF, क तथा ख कम्पनी तत्काल उच्च सतर्कतामा रहने सम्बन्धी।');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const finalTalukOffice = talukOffice === 'अन्य तालुक कार्यालय' ? customTalukOffice : talukOffice;

    const newNotice: BattalionNotice = {
      id: `not-taluk-${Date.now()}`,
      title,
      category: 'तालुक पत्र',
      targetAudience,
      date: letterDate,
      issuedBy: `${finalTalukOffice} (चलानी नं: ${chalaniNo})`,
      description,
      isUrgent,
      letterPhoto: letterPhoto || undefined,
      chalaniNo,
      patraSankhya,
      talukOffice: finalTalukOffice,
      acknowledgedBy: [currentOfficerRank + ' ' + currentOfficerName],
    };

    onDispatchLetter(newNotice);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // reset form
      setTitle('');
      setDescription('');
      setLetterPhoto(null);
      setPhotoName('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 text-left shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-red-950 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  तालुक कार्यालयको पत्र दर्ता तथा मातहत प्रसारण
                </h3>
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-semibold">
                  पत्र प्रसारण प्रणाली
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                प्रधान कार्यालय, उपत्यका कार्यालय वा मन्त्रालयबाट आएको पत्रको फोटो खिची मातहत सम्पूर्ण कर्मचारीहरूलाई तुरुन्तै जानकारी दिनुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-lg font-bold text-white">
              तालुक पत्र सफलतापूर्वक दर्ता तथा मातहत प्रसारण भयो!
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              उक्त पत्रको फोटो, चलानी नम्बर र निर्देशनहरू मातहत सम्पूर्ण अधिकृत तथा जवानहरूको नोटिस बोर्ड तथा डिजिटल पुस्तकालयमा तत्काल उपलब्ध भएको छ।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* 📸 CAMERA & PHOTO CAPTURE ZONE */}
            <div className="bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-400" />
                  पत्रको फोटो खिच्नुहोस् वा स्क्यान फाइल राख्नुहोस् <span className="text-red-400">*</span>
                </span>
                {letterPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setLetterPhoto(null);
                      setPhotoName('');
                    }}
                    className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                  >
                    फोटो हटाउनुहोस्
                  </button>
                )}
              </div>

              {letterPhoto ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 max-h-60 flex items-center justify-center p-2">
                    <img
                      src={letterPhoto}
                      alt="Captured Letter"
                      className="max-h-56 w-auto object-contain rounded shadow-md"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>पत्र संलग्न भयो</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-xs">{photoName || 'पत्रको फोटो'}</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      अर्को फोटो बदल्नुहोस्
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-center py-3">
                  <p className="text-[11px] text-slate-400">
                    पत्रको सक्कली पाना, छाप, हस्ताक्षर र चलानी नं. स्पष्ट देखिने गरी फोटो खिच्नुहोस्
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* Native Camera Trigger */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>क्यामेराबाट फोटो खिच्नुहोस्</span>
                    </button>

                    {/* File / Gallery Upload Trigger */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 cursor-pointer transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>ग्यालरी / फाइल छान्नुहोस्</span>
                    </button>

                    {/* Quick Sample Button for Testing */}
                    <button
                      type="button"
                      onClick={handleUseSampleLetter}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-950/70 hover:bg-blue-900 border border-blue-700/60 text-blue-300 font-medium text-[11px] rounded-xl cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>परीक्षणको लागि नमूना पत्र भर्नुहोस्</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* TALUK OFFICE SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  तालुक कार्यालय (Letter From) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={talukOffice}
                  onChange={(e) => setTalukOffice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="प्रहरी प्रधान कार्यालय, नक्साल">प्रहरी प्रधान कार्यालय (नक्साल)</option>
                  <option value="काठमाडौं उपत्यका प्रहरी कार्यालय, रानीपोखरी">काठमाडौं उपत्यका प्रहरी कार्यालय (रानीपोखरी)</option>
                  <option value="गृह मन्त्रालय, सिंहदरबार">गृह मन्त्रालय (सिंहदरबार)</option>
                  <option value="बागमती प्रदेश प्रहरी कार्यालय">बागमती प्रदेश प्रहरी कार्यालय</option>
                  <option value="काठमाडौं उपत्यका सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज (गणपति आदेश)">गणपति कमाण्ड / गण आदेश</option>
                  <option value="अन्य तालुक कार्यालय">अन्य तालुक कार्यालय (नाम लेख्ने)</option>
                </select>
                {talukOffice === 'अन्य तालुक कार्यालय' && (
                  <input
                    type="text"
                    placeholder="तालुक कार्यालयको पूरा नाम..."
                    value={customTalukOffice}
                    onChange={(e) => setCustomTalukOffice(e.target.value)}
                    className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl p-2 text-white outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  पत्र संख्या तथा चलानी नं. <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="पत्र सं: ०८२/०८३"
                    value={patraSankhya}
                    onChange={(e) => setPatraSankhya(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="चलानी नं: ४८९२"
                    value={chalaniNo}
                    onChange={(e) => setChalaniNo(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SUBJECT & DATE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">
                  पत्रको विषय / परिपत्र आदेश <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा: आसन्न चाडपर्व सुरक्षा परिचालन, भीड नियन्त्रण सतर्कता आदेश..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  पत्र मिति
                </label>
                <input
                  type="text"
                  value={letterDate}
                  onChange={(e) => setLetterDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 font-mono-nums"
                />
              </div>
            </div>

            {/* TARGET AUDIENCE & URGENCY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  मातहत लक्षित समुह (Target Force)
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as BattalionNotice['targetAudience'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="सबै कर्मचारी">सबै कर्मचारी (All Personnel)</option>
                  <option value="अधिकृत मात्र">अधिकृत मात्र (Officers Only)</option>
                  <option value="विशेष कार्यदल">विशेष कार्यदल (QRF Platoon)</option>
                  <option value="क कम्पनी">क कम्पनी (Company A)</option>
                  <option value="ख कम्पनी">ख कम्पनी (Company B)</option>
                  <option value="कोट/स्टोर शाखा">कोट / स्टोर शाखा</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  प्राथमिकता (Urgency Level)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-red-600 focus:ring-0 cursor-pointer"
                    />
                    <span className={isUrgent ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      अति-जरुरी (Red Alert Priority)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* DIRECTIVE SUMMARY */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                पत्रको मुख्य निर्देशन तथा संक्षिप्त व्यहोरा <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="पत्रमा उल्लेख भएका मुख्य बुँदाहरू, मातहत कर्मचारीले तत्काल गर्नुपर्ने काम तथा आवश्यक सतर्कता..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                दर्ताकर्ता: <strong className="text-white">{currentOfficerRank} {currentOfficerName}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-950 transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>मातहत कर्मचारीलाई पत्र प्रसारण गर्नुहोस्</span>
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
