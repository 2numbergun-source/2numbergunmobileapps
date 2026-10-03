import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledNotice(true);
        setTimeout(() => setInstalledNotice(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      alert('ब्राउजरको तीनवटा थोप्लो (Settings) मा गई "Install App" वा "Add to Home Screen" थिच्नुहोस्।');
    }
  };

  if (isInstalled && !installedNotice) {
    return null;
  }

  return (
    <>
      <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                मोबाइलमा एप इन्स्टल गरी अफलाइन चलाउनुहोस्
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              गृह स्क्रिनमा जोड्नुहोस्, इन्टरनेट नभएको बेला पनि परिपत्र, रोस्टर, सूचना र सम्पर्क चल्नेछ।
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-950 transition shrink-0 cursor-pointer"
        >
          {installedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>सफलतापूर्वक थपियो!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>मोबाइलमा डाउनलोड गर्नुहोस्</span>
            </>
          )}
        </button>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">iPhone / iPad मा इन्स्टल गर्ने तरिका</h4>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
              <li>सफारी (Safari) ब्राउजरको तल रहेको <strong>Share (शेयर)</strong> बटन थिच्नुहोस्।</li>
              <li>तल स्क्रोल गरी <strong>'Add to Home Screen'</strong> छान्नुहोस्।</li>
              <li>माथि दायाँपट्टि रहेको <strong>'Add'</strong> मा ट्याप गर्नुहोस्।</li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              बुझें (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
