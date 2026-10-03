import React from 'react';
import { UserCheck, RefreshCw, QrCode } from 'lucide-react';
import { Officer } from '../types/police';

interface IdentityBarProps {
  currentOfficer: Officer;
  onOpenSwitchModal: () => void;
  onOpenQrModal?: () => void;
}

export const IdentityBar: React.FC<IdentityBarProps> = ({
  currentOfficer,
  onOpenSwitchModal,
  onOpenQrModal,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>यो फोन / डिभाइस:</span>
          <span className="font-semibold text-white">
            {currentOfficer.name}
          </span>
          <span className="text-slate-400">
            [{currentOfficer.rank}]
          </span>
          <span className="hidden sm:inline text-slate-500">
            • दर्ता नं: {currentOfficer.computerCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenQrModal && (
            <button
              onClick={onOpenQrModal}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition cursor-pointer hover:underline"
            >
              <QrCode className="w-3 h-3" />
              <span>मेरो QR कोड</span>
            </button>
          )}

          <button
            onClick={onOpenSwitchModal}
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition cursor-pointer hover:underline ml-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>बदल्नुहोस्</span>
          </button>
        </div>
      </div>
    </div>
  );
};
