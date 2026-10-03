import React, { useState, useEffect } from 'react';
import { X, Shield, PhoneCall, Printer, Edit3, QrCode, Download } from 'lucide-react';
import { Officer } from '../types/police';
import { generateOfficerQrDataUrl } from '../lib/qrCodeUtil';

interface OfficerDetailModalProps {
  officer: Officer | null;
  onClose: () => void;
  onEdit?: (officer: Officer) => void;
  isAdmin?: boolean;
}

export const OfficerDetailModal: React.FC<OfficerDetailModalProps> = ({
  officer,
  onClose,
  onEdit,
  isAdmin,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (officer) {
      generateOfficerQrDataUrl(officer).then(setQrUrl);
    }
  }, [officer]);

  if (!officer) return null;

  const renderField = (label: string, value?: string | null) => (
    <div className="bg-[#0c1630] border border-blue-950/70 rounded-xl px-4 py-3 flex flex-col justify-center min-h-[58px] shadow-sm">
      <span className="text-[11px] text-slate-400 font-medium block leading-tight mb-1">
        {label}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-slate-100 break-words leading-snug">
        {value && value.trim() !== '' ? value : '—'}
      </span>
    </div>
  );

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `APF_QR_${officer.computerCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#070e24] border border-blue-900/60 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#091333] border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {officer.name}
                </h3>
                <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30">
                  {officer.rank}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                कम्प्युटर कोड: {officer.computerCode} • संकेत नं: {officer.sanketNo || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && isAdmin && (
              <button
                onClick={() => onEdit(officer)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>सम्पादन</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              title="प्रिन्ट गर्नुहोस्"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Officer QR Badge + Exact 2-Column Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Individual Officer QR Code Presentation Card */}
          <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white p-1 rounded-xl shadow-lg border border-slate-300 shrink-0">
                {qrUrl ? (
                  <img src={qrUrl} alt="Officer QR" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">QR...</div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    व्यक्तिगत डिजिटल QR कोड
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {officer.computerCode}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {officer.name} — आधिकारिक ई-परिचय कोड
                </h4>
                <p className="text-xs text-slate-300">
                  यो QR कोड स्क्यान गर्दा कर्मचारीको पद, दरबन्दी, रक्त समूह र आचारसंहिता विवरण डिजिटल रूपमा प्रमाणित हुन्छ।
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadQr}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>QR सुरक्षित गर्नुहोस्</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Row 1 */}
            {renderField('B.G. कोड', officer.bgCode)}
            {renderField('कम्प्युटर कोड', officer.computerCode)}

            {/* Row 2 */}
            {renderField('संकेत नं.', officer.sanketNo)}
            {renderField('दर्जा', officer.rank)}

            {/* Row 3 */}
            {renderField('नामथर', officer.name)}
            {renderField('दरबन्दी', officer.darbandi)}

            {/* Row 4 */}
            {renderField('द.भ.का.', officer.dabhaka)}
            {renderField('कामको जिम्मेवारी', officer.jobResponsibility)}

            {/* Row 5 */}
            {renderField('विशेष क्षमता', officer.specialSkills)}
            {renderField('ब्यारेक', officer.barrack)}

            {/* Row 6 */}
            {renderField('कोठावाला', officer.roomStatus)}
            {renderField('बस्ने स्थान', officer.residenceLocation)}

            {/* Row 7 */}
            {renderField('लिङ्ग', officer.gender)}
            {renderField('कार्यरत कार्यालय', officer.currentOffice)}

            {/* Row 8 */}
            {renderField('कार्यरत मिति', officer.workingSinceDate)}
            {renderField('भर्ना मिति', officer.recruitmentDate)}

            {/* Row 9 */}
            {renderField('सरुवा मिति', officer.transferDate)}
            {renderField('बढुवा मिति', officer.promotionDate)}

            {/* Row 10 */}
            {renderField('साविक दरबन्दी', officer.previousDarbandi)}
            {renderField('जन्म मिति', officer.dateOfBirth)}

            {/* Row 11 */}
            {renderField('शैक्षिक योग्यता', officer.education)}
            {renderField('CUG भएका', officer.cugNumber)}

            {/* Row 12 */}
            {renderField('आफन्तको नाम', officer.relativeName)}
            {renderField('CUG नभएका', officer.nonCugNumber)}

            {/* Row 13 */}
            {renderField('ड्युटी गर्न सक्ने/नसक्ने', officer.dutyFitness)}
            {renderField('वतन', officer.permanentAddress)}

            {/* Row 14 */}
            {renderField('बुबाको नाम', officer.fatherName)}
            {renderField('आमाको नाम', officer.motherName)}

            {/* Row 15 */}
            {renderField('नागरिकता नं.', officer.citizenshipNo)}
            {renderField('सवारी साधन नं.', officer.vehicleNumber)}

            {/* Row 16 */}
            {renderField('संचाअप नं.', officer.sanchaApNo)}
            {renderField('Email', officer.email)}

            {/* Row 17 */}
            {renderField('भएको/नभएको', officer.propertyOrAsset)}
            {renderField('PAN', officer.panNumber)}

            {/* Row 18 */}
            {renderField('बैंक खाता', officer.bankAccount)}
            {renderField('कै.', officer.remarks)}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 bg-[#091333] border-t border-blue-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>सम्पर्क फोन:</span>
            <a href={`tel:${officer.phone}`} className="font-bold text-blue-400 hover:underline font-mono">
              {officer.phone}
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            बन्द गर्नुहोस्
          </button>
        </div>

      </div>
    </div>
  );
};
