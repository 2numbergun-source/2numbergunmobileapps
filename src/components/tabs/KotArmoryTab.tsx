import React, { useState } from 'react';
import { Shield, Crosshair, CheckCircle2, AlertTriangle, QrCode, Search, RefreshCw, FileCheck } from 'lucide-react';
import { KotItem, PolicePersonnel } from '../../types/police';

interface KotArmoryTabProps {
  officer: PolicePersonnel;
  kotItems: KotItem[];
  onToggleKotStatus: (id: string) => void;
}

export const KotArmoryTab: React.FC<KotArmoryTabProps> = ({
  officer,
  kotItems,
  onToggleKotStatus,
}) => {
  const [filter, setFilter] = useState<'my' | 'all'>('my');
  const [showPassModal, setShowPassModal] = useState<KotItem | null>(null);

  const displayedItems = kotItems.filter((item) => {
    if (filter === 'my') {
      return item.allocatedTo && item.allocatedTo.includes(officer.nameNepali);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header and kot banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              कोट शाखा: हतियार, गोलीगठ्ठा तथा दंगा नियन्त्रण सामग्री
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            गण नं. २ महाराजगञ्ज - व्यक्तिगत जारी हतियार तथा डिजिटल कोट पासबुक
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
          <button
            onClick={() => setFilter('my')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'my'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            मेरो जिम्मामा रहेको हतियार
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            गण कोट मौज्दात सूची
          </button>
        </div>
      </div>

      {/* Security Assurance Warning */}
      <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-white">डिजिटल सुरक्षा अनुशासन: </strong>
          ड्युटी सकिनासाथ तोकिएको समयभित्र आफ्नो हतियार तथा गोलीगठ्ठा कोट शाखामा बुझाई डिजिटल रसिद अनिवार्य लिनुहोला। 
          कुनै पनि हिनामिना वा हतियार क्षति भएमा नेपाल प्रहरी ऐन अनुसार कडा कारवाही हुनेछ।
        </div>
      </div>

      {/* Kot Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono-nums text-amber-400">
                  {item.itemType}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{item.itemName}</h3>
                <div className="text-xs text-slate-400 font-mono-nums mt-0.5">
                  सि.नं. (Serial): <strong className="text-slate-200">{item.serialNumber}</strong>
                </div>
              </div>

              <div>
                {item.status === 'issued' ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    जारी भएको (Issued)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                    कोटमा मौज्दात (In Kot)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">जिम्मेवार कर्मचारी:</span>
                <span className="font-medium text-white">{item.allocatedTo || 'कोट मौज्दात'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">जारी भएको गोली (Ammunition):</span>
                <span className="font-mono-nums font-bold text-amber-400">{item.ammunitionIssued} राउण्ड</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">हतियारको अवस्था:</span>
                <span className="text-emerald-400 font-medium">{item.condition}</span>
              </div>
              {item.issuedAt && (
                <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <span>जारी मिति:</span>
                  <span className="font-mono-nums text-slate-300">{item.issuedAt}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowPassModal(item)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-400" />
                <span>डिजिटल कोट पास हेर्नुहोस्</span>
              </button>

              <button
                onClick={() => onToggleKotStatus(item.id)}
                className="py-2 px-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {item.status === 'issued' ? 'कोटमा दाखिला गर्नुहोस्' : 'ड्युटीका लागि जारी गर्नुहोस्'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DIGITAL KOT PASS MODAL */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                कोट शाखा · गण नं. २ महाराजगञ्ज
              </div>
              <h3 className="text-base font-bold text-white mt-1">डिजिटल हतियार पासबुक</h3>
            </div>

            <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
              <div className="w-40 h-40 bg-slate-950 flex flex-col items-center justify-center p-2 rounded-lg text-white">
                <QrCode className="w-28 h-28 text-white" />
                <span className="text-[9px] font-mono tracking-wider text-slate-400 mt-1">
                  {showPassModal.serialNumber}
                </span>
              </div>
            </div>

            <div className="text-left text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div><strong className="text-slate-400">हतियार: </strong><span className="text-white font-semibold">{showPassModal.itemName}</span></div>
              <div><strong className="text-slate-400">सि.नं: </strong><span className="text-slate-200 font-mono-nums">{showPassModal.serialNumber}</span></div>
              <div><strong className="text-slate-400">गोली संख्या: </strong><span className="text-amber-400 font-mono-nums font-bold">{showPassModal.ammunitionIssued} राउण्ड</span></div>
              <div><strong className="text-slate-400">जिम्मेवार: </strong><span className="text-slate-200">{showPassModal.allocatedTo || 'कोट शाखा'}</span></div>
            </div>

            <button
              onClick={() => setShowPassModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
