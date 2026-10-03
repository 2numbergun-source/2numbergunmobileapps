import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, ShieldCheck, User, Phone, CheckCircle2, Copy } from 'lucide-react';
import { Officer } from '../types/police';
import { generateOfficerQrDataUrl } from '../lib/qrCodeUtil';
import { BATTALION_EMBLEM } from '../assets/images';

interface OfficerQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: Officer;
}

export const OfficerQrModal: React.FC<OfficerQrModalProps> = ({
  isOpen,
  onClose,
  officer,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && officer) {
      setLoading(true);
      generateOfficerQrDataUrl(officer).then((url) => {
        setQrDataUrl(url);
        setLoading(false);
      });
    }
  }, [isOpen, officer]);

  if (!isOpen) return null;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `APF_Officer_QR_${officer.computerCode}_${officer.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`कर्मचारी: ${officer.name} | दर्जा: ${officer.rank} | कम्प्युटर कोड: ${officer.computerCode} | संकेत: ${officer.sanketNo || '—'}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-emerald-500/60 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-5 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              व्यक्तिगत सुरक्षा QR कोड (E-ID)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-white rounded-2xl p-4 shadow-inner flex flex-col items-center justify-center border border-slate-200 text-slate-900">
          {/* Battalion small badge at top */}
          <div className="flex items-center gap-1.5 mb-2">
            <img src={BATTALION_EMBLEM} alt="Logo" className="w-6 h-6 object-contain" />
            <span className="text-[11px] font-black text-slate-800 tracking-tight">
              सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज
            </span>
          </div>

          {loading ? (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              QR कोड जेनेरेट हुँदैछ...
            </div>
          ) : (
            <div className="relative p-1 bg-white rounded-xl">
              <img 
                src={qrDataUrl} 
                alt={`QR for ${officer.name}`} 
                className="w-56 h-56 object-contain rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-slate-900 p-1 border-2 border-white shadow">
                  <img src={BATTALION_EMBLEM} alt="Center Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-2">
            <span className="text-xs font-mono font-black text-slate-900 tracking-wider">
              {officer.computerCode}
            </span>
            <div className="text-[10px] text-slate-600 font-semibold">
              स्क्यान गरी तत्काल डिजिटल प्रमाणिकरण गर्न सकिने
            </div>
          </div>
        </div>

        {/* Officer Quick Meta */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">नामथर:</span>
            <span className="font-bold text-white">{officer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">दर्जा (Rank):</span>
            <span className="font-bold text-amber-400">{officer.rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">संकेत नं.:</span>
            <span className="font-mono text-slate-200">{officer.sanketNo || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">रक्त समूह:</span>
            <span className="font-bold text-red-400">{officer.bloodGroup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">कम्पनी / कार्यदल:</span>
            <span className="text-slate-200">{officer.companyOrTeam || officer.section}</span>
          </div>
        </div>

        {/* Action Controls: Download QR, Copy info */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleDownloadQr}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>QR डाउनलोड (.png)</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>कपी भयो!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>विवरण कपी</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
