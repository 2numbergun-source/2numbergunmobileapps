import React, { useState, useRef } from 'react';
import { 
  FileImage, 
  Camera, 
  Upload, 
  Send, 
  Plus, 
  Search, 
  Eye, 
  CheckCircle2, 
  X, 
  Trash2, 
  AlertTriangle, 
  Download, 
  Share2, 
  ShieldAlert,
  Building,
  Calendar,
  Lock,
  RefreshCw
} from 'lucide-react';
import { CircularDocument, Officer } from '../../types/police';

interface CircularsTabProps {
  circulars: CircularDocument[];
  onAddCircular: (circular: CircularDocument) => void;
  onDeleteCircular: (circularId: string) => void;
  onAcknowledgeCircular: (circularId: string, officerId: string) => void;
  currentOfficer: Officer;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const CircularsTab: React.FC<CircularsTabProps> = ({
  circulars,
  onAddCircular,
  onDeleteCircular,
  onAcknowledgeCircular,
  currentOfficer,
  isAdmin,
  onRequireAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState<CircularDocument | null>(null);

  // New Circular form state
  const [title, setTitle] = useState('');
  const [circularNo, setCircularNo] = useState('');
  const [issuingOffice, setIssuingOffice] = useState('प्रहरी प्रधान कार्यालय, नक्साल');
  const [priority, setPriority] = useState<CircularDocument['priority']>('जरुरी');
  const [summary, setSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera stream error, using file fallback:', err);
      setIsCameraActive(false);
      alert('क्यामेरा खोल्न सकिएन। कृपया फोटो अपलोड (Upload) प्रयोग गर्नुहोस्।');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoDataUrl(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setPhotoDataUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCreateCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !circularNo.trim()) {
      alert('कृपया परिपत्र शीर्षक र चलानी नं. अनिवार्य भर्नुहोस्।');
      return;
    }

    if (!photoDataUrl) {
      alert('कृपया तालुक कार्यालयबाट आएको परिपत्रको फोटो खिच्नुहोस् वा अपलोड गर्नुहोस्।');
      return;
    }

    const newCirc: CircularDocument = {
      id: `circ-${Date.now()}`,
      circularNo: circularNo.trim(),
      issuingOffice: issuingOffice.trim(),
      title: title.trim(),
      date: new Date().toLocaleDateString('ne-NP'),
      priority,
      photoUrl: photoDataUrl,
      summary: summary.trim() || 'तालुक कार्यालयबाट प्राप्त सुरक्षा निर्देशन।',
      instructions: instructions.trim(),
      postedBy: `${currentOfficer.name} (${currentOfficer.rank})`,
      postedAt: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }),
      acknowledgedOfficerIds: [currentOfficer.id],
    };

    onAddCircular(newCirc);
    setIsComposeOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCircularNo('');
    setSummary('');
    setInstructions('');
    setPhotoDataUrl(null);
    stopCamera();
  };

  const filteredCirculars = circulars.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.circularNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.issuingOffice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.priority === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header & Call-to-Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              तालुक कार्यालयका परिपत्रहरू (HQ Circulars & Directives)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            प्रहरी प्रधान कार्यालय तथा तालुक निकायबाट प्राप्त विभिन्न परिपत्रहरू फोटो खिचेर सम्पूर्ण प्रहरी कर्मचारीहरूलाई तत्काल जानकारी गराउने प्रणाली।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (!isAdmin) {
                onRequireAdmin();
                return;
              }
              setIsComposeOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>+ परिपत्र फोटो खिची पठाउनुहोस्</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Priority Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="परिपत्र शीर्षक, चलानी नं. वा तालुक कार्यालय खोजी गर्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['all', 'अति गोप्य', 'जरुरी', 'सामान्य'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'सबै परिपत्रहरू' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Circulars List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCirculars.map((circ) => {
          const isAcknowledged = circ.acknowledgedOfficerIds.includes(currentOfficer.id);
          return (
            <div
              key={circ.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition group"
            >
              <div>
                {/* Photo Thumbnail with Priority Banner */}
                <div 
                  onClick={() => setSelectedCircular(circ)}
                  className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer border-b border-slate-800/80"
                >
                  <img
                    src={circ.photoUrl}
                    alt={circ.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      circ.priority === 'अति गोप्य'
                        ? 'bg-red-600 text-white'
                        : circ.priority === 'जरुरी'
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {circ.priority}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      {circ.circularNo}
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm text-cyan-300">
                      फोटो क्लिक गरी हेर्नुहोस् &rarr;
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{circ.issuingOffice}</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedCircular(circ)}
                    className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer line-clamp-2 leading-snug"
                  >
                    {circ.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {circ.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Actions: Acknowledge & View */}
              <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {isAcknowledged ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>मैले पढेँ (Verified)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledgeCircular(circ.id, currentOfficer.id)}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-[11px] hover:underline"
                  >
                    <span>पढेको जनाउनुहोस्</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCircular(circ)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>पूर्ण विवरण</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`के तपाईं यो परिपत्र '${circ.title}' हटाउन चाहनुहुन्छ?`)) {
                          onDeleteCircular(circ.id);
                        }
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 transition"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. Modal: Compose & Capture Circular Photo (Admin / In-Charge) */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  तालुक कार्यालयको परिपत्र फोटो खिची पठाउनुहोस्
                </h3>
              </div>
              <button
                onClick={() => {
                  stopCamera();
                  setIsComposeOpen(false);
                }}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Camera Area */}
            <form onSubmit={handleCreateCircular} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Photo Capture & Upload Box */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300">
                  परिपत्रको फोटो (Camera Snapshot / Upload) *
                </label>

                {photoDataUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-emerald-500/50 max-h-56 bg-black flex items-center justify-center">
                    <img src={photoDataUrl} alt="Captured Circular" className="w-full h-full object-contain max-h-56" />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow hover:bg-red-500"
                      title="पुन: खिच्नुहोस्"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-emerald-400">
                      ✓ फोटो सुरक्षित भयो
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-amber-500 bg-black flex flex-col items-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-h-64 object-cover" />
                    <div className="p-3 bg-slate-950 w-full flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>फोटो खिच्नुहोस् (Snap Photo)</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                      >
                        रद्द
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="p-5 rounded-xl border border-dashed border-amber-500/60 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Camera className="w-7 h-7 text-amber-400" />
                      <span>क्यामेराबाट फोटो खिच्नुहोस्</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 rounded-xl border border-dashed border-blue-500/60 bg-blue-950/20 hover:bg-blue-950/40 text-blue-300 font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-7 h-7 text-blue-400" />
                      <span>ग्यालरीबाट फोटो अपलोड गर्नुहोस्</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">परिपत्र शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: काठमाडौँ उपत्यका चाडपर्व विशेष सुरक्षा सतर्कता सम्बन्धमा"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">चलानी / पत्र संख्या *</label>
                  <input
                    type="text"
                    required
                    placeholder="प.सं. ०८३/०८४-११२"
                    value={circularNo}
                    onChange={(e) => setCircularNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">प्राथमिकता *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as CircularDocument['priority'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="अति गोप्य">अति गोप्य</option>
                    <option value="जरुरी">जरुरी</option>
                    <option value="सामान्य">सामान्य</option>
                    <option value="सुरक्षा सतर्कता">सुरक्षा सतर्कता</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">जारी गर्ने तालुक कार्यालय *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: प्रहरी प्रधान कार्यालय नक्साल / उपत्यका प्रहरी कार्यालय"
                  value={issuingOffice}
                  onChange={(e) => setIssuingOffice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">परिपत्रको सार संक्षेप (Summary)</label>
                <textarea
                  rows={2}
                  placeholder="परिपत्रमा उल्लेख मुख्य निर्देशन छोटकरीमा लेख्नुहोस्..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">पालना गर्नुपर्ने विशेष निर्देशन (Instructions)</label>
                <textarea
                  rows={2}
                  placeholder="१. सम्पूर्ण युनिट स्ट्यान्डबाइ रहने। २. डिजिटल हाजिरी ५०m भित्र मात्र गर्नू।"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>सम्पूर्ण कर्मचारीहरूलाई तुरुन्त परिपत्र पठाउनुहोस्</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. Modal: Full Screen Circular Viewer */}
      {selectedCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {selectedCircular.issuingOffice}
                </span>
                <h3 className="text-sm font-bold text-white">{selectedCircular.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCircular(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Photo Display with Download/Zoom */}
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex justify-center">
                <img
                  src={selectedCircular.photoUrl}
                  alt={selectedCircular.title}
                  className="w-full max-h-[460px] object-contain"
                />
              </div>

              {/* Meta details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>चलानी नं.: <strong className="text-white font-mono">{selectedCircular.circularNo}</strong></div>
                  <div>मिति: <strong className="text-white">{selectedCircular.date}</strong></div>
                  <div>जारीकर्ता: <strong className="text-white">{selectedCircular.postedBy}</strong></div>
                  <div>प्राथमिकता: <strong className="text-red-400">{selectedCircular.priority}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-400 block mb-1">सारसंक्षेप:</span>
                  {selectedCircular.summary}
                </div>

                {selectedCircular.instructions && (
                  <div className="pt-2 border-t border-slate-800 text-slate-200 leading-relaxed">
                    <span className="font-bold text-slate-400 block mb-1">पालना गर्नुपर्ने निर्देशन:</span>
                    <pre className="font-sans whitespace-pre-wrap">{selectedCircular.instructions}</pre>
                  </div>
                )}
              </div>

              {/* Acknowledgment action */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400">
                  कुल हेरेका/बुझेका कर्मचारी: <strong className="text-emerald-400">{selectedCircular.acknowledgedOfficerIds.length} जना</strong>
                </div>

                {!selectedCircular.acknowledgedOfficerIds.includes(currentOfficer.id) && (
                  <button
                    onClick={() => {
                      onAcknowledgeCircular(selectedCircular.id, currentOfficer.id);
                      setSelectedCircular((prev) => prev ? {
                        ...prev,
                        acknowledgedOfficerIds: [...prev.acknowledgedOfficerIds, currentOfficer.id]
                      } : null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>मैले यो परिपत्र अध्ययन गरी बुझें</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
