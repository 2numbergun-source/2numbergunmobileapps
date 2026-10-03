import React, { useState } from 'react';
import { Camera, MapPin, AlertTriangle, Send, X, CheckCircle, ShieldAlert } from 'lucide-react';
import { IncidentProblemReport } from '../types/police';

interface QuickReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: IncidentProblemReport) => void;
  reporterName: string;
  reporterRank: string;
}

export const QuickReportModal: React.FC<QuickReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  reporterName,
  reporterRank,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncidentProblemReport['type']>('ब्यारेक समस्या');
  const [location, setLocation] = useState('सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज परिसर');
  const [priority, setPriority] = useState<IncidentProblemReport['priority']>('उच्च (High)');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePhoto = () => {
    setHasPhoto(true);
    setPhotoPreview('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newReport: IncidentProblemReport = {
      id: `prb-${Date.now()}`,
      title,
      type,
      location,
      reportedBy: reporterName,
      reportedByRank: reporterRank,
      reportedDate: 'आज, २०८३ असोज १०',
      description,
      priority,
      status: 'लम्बित (Pending)',
      hasPhoto,
    };

    onSubmitReport(newReport);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setTitle('');
      setDescription('');
      setPhotoPreview(null);
      setHasPhoto(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">एक क्लिकमा समस्या / घटना रिपोर्ट</h3>
              <p className="text-[11px] text-slate-400">सिधै प्रशासन तथा कमाण्ड शाखामा दर्ता हुनेछ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-base font-bold text-white">रिपोर्ट सफलतापूर्वक दर्ता भयो!</div>
            <p className="text-xs text-slate-300">
              प्रशासन तथा सम्बन्धित शाखाले तत्काल आवश्यक कारवाही अघि बढाउनेछ।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                समस्या वा घटनाको शीर्षक <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. ब्यारेकमा बिजुली समस्या / चोकमा भीडभाड"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">समस्याको प्रकार</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  <option value="ब्यारेक समस्या">ब्यारेक समस्या</option>
                  <option value="पानी/बिजुली">पानी/बिजुली</option>
                  <option value="सवारी साधन">सवारी साधन</option>
                  <option value="हतियार/सञ्चार">हतियार/सञ्चार</option>
                  <option value="फिल्ड घटना/शान्ति सुरक्षा">फिल्ड घटना/शान्ति सुरक्षा</option>
                  <option value="अन्य">अन्य</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">प्राथमिकता</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500"
                >
                  <option value="अत्यावश्यक (Urgent)">अत्यावश्यक (Urgent)</option>
                  <option value="उच्च (High)">उच्च (High)</option>
                  <option value="सामान्य (Normal)">सामान्य (Normal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">घटना / समस्या भएको स्थान</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white outline-none focus:border-blue-500"
                />
                <MapPin className="w-4 h-4 text-rose-400 absolute left-2.5 top-2.5" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>GPS द्वारा स्वतः महाराजगञ्ज गण लोकेसन लिइएको छ।</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                विस्तृत विवरण <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="समस्या के हो? के सहयोग वा मर्मत आवश्यक छ? प्रष्ट खुलाउनुहोस्..."
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">फोटो प्रमाण (ऐच्छिक)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span>{photoPreview ? 'फोटो खिचियो (पुनः खिच्नुहोस्)' : 'क्यामेराबाट फोटो खिच्नुहोस्'}</span>
                </button>
                {photoPreview && (
                  <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    फोटो संलग्न भयो
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-950 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>तुरुन्त रिपोर्ट पेश गर्नुहोस्</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
