import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  FileText, 
  Users, 
  ShieldAlert, 
  Share2,
  Printer
} from 'lucide-react';
import { BattalionNotice } from '../types/police';

interface LetterViewerModalProps {
  notice: BattalionNotice | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledgeLetter?: (noticeId: string) => void;
  currentOfficerName: string;
  currentOfficerRank: string;
}

export const LetterViewerModal: React.FC<LetterViewerModalProps> = ({
  notice,
  isOpen,
  onClose,
  onAcknowledgeLetter,
  currentOfficerName,
  currentOfficerRank,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  if (!isOpen || !notice) return null;

  const currentPersonnelLabel = `${currentOfficerRank} ${currentOfficerName}`;
  const isAlreadyAck = hasAcknowledged || (notice.acknowledgedBy?.includes(currentPersonnelLabel) ?? false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handleAcknowledge = () => {
    setHasAcknowledged(true);
    if (onAcknowledgeLetter) {
      onAcknowledgeLetter(notice.id);
    }
  };

  const handleDownload = () => {
    if (!notice.letterPhoto) return;
    const link = document.createElement('a');
    link.href = notice.letterPhoto;
    link.download = `taluk_patra_${notice.chalaniNo || 'order'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  {notice.talukOffice || 'तालुक कार्यालय आधिकारिक पत्र'}
                </span>
                {notice.isUrgent && (
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                    अति-जरुरी
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {notice.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="प्रिन्ट गर्नुहोस्"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer hidden sm:flex"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="डाउनलोड गर्नुहोस्"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left is photo viewer, Right is details & acknowledgment */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          
          {/* PHOTO VIEWING SECTION (8 cols on lg) */}
          <div className="lg:col-span-7 bg-slate-950 p-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 relative select-none min-h-[350px]">
            
            {/* Zoom / Rotate Controls Bar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-1 shadow-lg text-xs">
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleRotate}
                title="Rotate 90°"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="px-2 py-1 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                रिसेट
              </button>
            </div>

            {/* Photo Container */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-4 max-h-[500px]">
              {notice.letterPhoto ? (
                <div
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="shadow-2xl rounded-lg overflow-hidden border border-slate-700 max-w-full"
                >
                  <img
                    src={notice.letterPhoto}
                    alt={notice.title}
                    className="max-h-[460px] w-auto object-contain bg-white"
                  />
                </div>
              ) : (
                <div className="text-center p-8 space-y-2">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">पत्रको डिजिटल फोटो संलग्न छैन।</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 mt-2">
              💡 जुम गर्न वा घुमाउन माथिको बटन प्रयोग गर्नुहोस् वा डाउनलोड गरी प्रिन्ट गर्नुहोस्
            </div>
          </div>

          {/* LETTER DETAILS & SUBORDINATE DIRECTIVES (5 cols on lg) */}
          <div className="lg:col-span-5 p-5 space-y-4 flex flex-col justify-between overflow-y-auto bg-slate-900">
            <div className="space-y-4">
              
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">चलानी नम्बर</span>
                  <span className="font-bold text-white font-mono-nums">
                    {notice.chalaniNo || '४८९२ / ०८३'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">पत्र मिति</span>
                  <span className="font-bold text-white font-mono-nums">{notice.date}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">पत्र संख्या</span>
                  <span className="font-bold text-white font-mono-nums">
                    {notice.patraSankhya || '०८२/०८३'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">लक्षित युनिट</span>
                  <span className="font-bold text-blue-400">{notice.targetAudience}</span>
                </div>
              </div>

              {/* Directives Section */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>पत्रको मुख्य आदेश तथा निर्देशन व्यहोरा:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {notice.description}
                </p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  जारीकर्ता: <strong className="text-slate-300">{notice.issuedBy}</strong>
                </div>
              </div>

              {/* Acknowledgment Status Bar */}
              <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>मातहत जानकारी पावती स्थिति</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono-nums text-xs">
                    {(notice.acknowledgedBy?.length || 0) + (isAlreadyAck && !notice.acknowledgedBy?.includes(currentPersonnelLabel) ? 1 : 0)} जनाले बुझेको पुष्टि
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  यो पत्र प्राप्त गरी पढेपछि तलको हरियो बटन थिचेर जानकारी पाएको दर्ता गर्नुहोस्।
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              {isAlreadyAck ? (
                <div className="w-full py-3 px-4 bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>तपाईं ({currentPersonnelLabel}) ले यो पत्र बुझेको जानकारी दर्ता भइसक्यो।</span>
                </div>
              ) : (
                <button
                  onClick={handleAcknowledge}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ मैले यो पत्र पढेँ र जानकारी पाएँ (Acknowledge)</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2 text-slate-400 hover:text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
              >
                विन्डो बन्द गर्नुहोस्
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
