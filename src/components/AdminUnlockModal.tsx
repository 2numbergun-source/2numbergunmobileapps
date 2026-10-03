import React, { useState } from 'react';
import { X, Lock, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { verifyAdminPin, getDefaultAdminHint } from '../data/adminAuth';

interface AdminUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminUnlockModal: React.FC<AdminUnlockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await verifyAdminPin(pin)) {
      setError(false);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">कमाण्ड / Admin प्रमाणिकरण</h3>
              <p className="text-[11px] text-slate-400">
                अधिकृत एड्मिन लगइन (परिपत्र, ग्यालरी, सूचना पाटी तथा कर्मचारी नियन्त्रण)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Admin मास्टर पासवर्ड (Security Password)</span>
              <span className="text-[10px] text-slate-500">गोप्य</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                autoFocus
                placeholder="पासवर्ड प्रविष्ट गर्नुहोस् ••••••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-slate-950 border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition font-mono ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-emerald-500'
                }`}
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>प्रमाणिकरण पासवर्ड मिलेन। कृपया सही Admin पासवर्ड प्रयोग गर्नुहोस्।</span>
              </p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Admin मोड अनलक गर्नुहोस्</span>
            </button>

          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>सुरक्षा स्तर: कमाण्ड इनक्रिप्टेड</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            रद्द गर्नुहोस्
          </button>
        </div>

      </div>
    </div>
  );
};
