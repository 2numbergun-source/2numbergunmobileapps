import React, { useState } from 'react';
import { 
  Shield, 
  Crosshair, 
  Package, 
  Home, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Utensils, 
  Search,
  Plus,
  Wrench,
  Layers
} from 'lucide-react';
import { PolicePersonnel, KotItem, StoreItem, BarrackRoom } from '../../types/police';
import { INITIAL_KOT_ITEMS, STORE_INVENTORY_DATA, BARRACK_ROOMS_DATA } from '../../data/mockData';

interface ArmoryStoreTabProps {
  officer: PolicePersonnel;
  kotItems: KotItem[];
  onToggleKotStatus: (id: string) => void;
}

export const ArmoryStoreTab: React.FC<ArmoryStoreTabProps> = ({
  officer,
  kotItems,
  onToggleKotStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kot' | 'store' | 'barrack'>('kot');
  const [filterKot, setFilterKot] = useState<'my' | 'all'>('my');
  const [storeItems, setStoreItems] = useState<StoreItem[]>(STORE_INVENTORY_DATA);
  const [barrackRooms, setBarrackRooms] = useState<BarrackRoom[]>(BARRACK_ROOMS_DATA);
  const [selectedKotItem, setSelectedKotItem] = useState<KotItem | null>(null);

  const displayedKotItems = kotItems.filter((item) => {
    if (filterKot === 'my') {
      return item.allocatedTo && item.allocatedTo.includes(officer.nameNepali);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                कोट हातहतियार, बन्दोबस्ती स्टोर तथा ब्यारेक व्यवस्थापन
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              हतियार पासबुक, गोलीगठ्ठा, पोशाक, दंगा नियन्त्रण गियर र ब्यारेक मेस व्यवस्थापन
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('kot')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'kot'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            १. कोट हातहतियार पासबुक
          </button>
          <button
            onClick={() => setActiveSubTab('store')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'store'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            २. बन्दोबस्ती तथा स्टोर मौज्दात
          </button>
          <button
            onClick={() => setActiveSubTab('barrack')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'barrack'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            ३. ब्यारेक तथा मेस व्यवस्थापन
          </button>
        </div>
      </div>

      {/* 1. KOT ARMORY SUB-TAB */}
      {activeSubTab === 'kot' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>व्यक्तिगत जारी हतियार तथा कोट भण्डार सूची</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setFilterKot('my')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                  filterKot === 'my' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                मेरो जिम्मामा रहेको हतियार
              </button>
              <button
                onClick={() => setFilterKot('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                  filterKot === 'all' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                गण कोट मौज्दात सूची
              </button>
            </div>
          </div>

          {/* Kot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedKotItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono-nums text-amber-400 font-bold block">
                      {item.itemType}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{item.itemName}</h3>
                    <div className="text-xs text-slate-400 font-mono-nums mt-0.5">
                      सि.नं. (Serial): <strong className="text-slate-200">{item.serialNumber}</strong>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    item.status === 'issued'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.status === 'issued' ? 'जारी भएको (Issued)' : 'कोटमा सुरक्षित'}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">जिम्मा लिने कर्मचारी:</span>
                    <span className="font-semibold text-white">{item.allocatedTo || 'कोट रिजर्भ भण्डार'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">गोलीगठ्ठा संख्या (Rounds):</span>
                    <span className="font-mono-nums font-bold text-amber-300">{item.ammunitionIssued} राउन्ड</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">भौतिक अवस्था:</span>
                    <span className="text-emerald-400">{item.condition}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onToggleKotStatus(item.id)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
                  >
                    {item.status === 'issued' ? 'कोटमा फिर्ता दाखिला गर्नुहोस्' : 'ड्युटीका लागि हतियार निकासा लिनुहोस्'}
                  </button>

                  <button
                    onClick={() => setSelectedKotItem(item)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    पासबुक हेर्नुहोस् →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. STORE INVENTORY SUB-TAB */}
      {activeSubTab === 'store' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>बन्दोबस्ती तथा स्टोर सामग्री मौज्दात विवरण (Logistics Store)</span>
            </h3>

            <div className="space-y-3">
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">{item.category}</span>
                    <h4 className="text-sm font-bold text-white">{item.itemName}</h4>
                    <span className="text-slate-400 text-[11px]">अवस्था: {item.condition} | पछिल्लो प्राप्ति: {item.lastProcuredDate}</span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block">मौज्दात / जम्मा</span>
                      <span className="font-bold text-emerald-400 text-sm font-mono-nums">
                        {item.availableStock} / {item.totalStock} {item.unit}
                      </span>
                    </div>

                    <button 
                      onClick={() => alert(`"${item.itemName}" को माग फाराम दर्ता गरियो।`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      माग फाराम
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. BARRACK & MESS SUB-TAB */}
      {activeSubTab === 'barrack' && (
        <div className="space-y-6">
          {/* Mess Schedule */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>आजको मेस तालिका तथा समय (Battalion Mess Schedule)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono-nums">मेस नं. १ र २</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-amber-400 font-bold">बिहान/दिउँसोको खाना (१०:०० बजे)</span>
                <p className="text-slate-200">दाल, भात, मौसमी तरकारी (काउली/आलु), ताजा अचार</p>
                <span className="text-[11px] text-slate-400 pt-1 block">ड्युटी टोलीका लागि विशेष व्यवस्था</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1">
                <span className="text-blue-400 font-bold">साँझको खाना (१८:३० बजे)</span>
                <p className="text-slate-200">भात / रोटी, कुखुराको मासु, मौसमी हरियो साग, सलाद</p>
                <span className="text-[11px] text-slate-400 pt-1 block">रात्रिकालीन पिकेटका लागि हट-केसमा खाना</span>
              </div>
            </div>
          </div>

          {/* Barrack Rooms Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-400" />
              <span>ब्यारेक तथा कोठा बसोबास विवरण (Barrack Management)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {barrackRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{room.block} - कोठा {room.roomNo}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                      सरसफाइ: {room.cleanliness}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">बेड संख्या:</span>
                    <span className="font-mono-nums font-semibold text-white">
                      {room.occupiedBeds} / {room.totalBeds} भरिएको ({room.totalBeds - room.occupiedBeds} खाली)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    बस्ने कर्मचारी: <span className="text-slate-200">{room.residents.join(', ')}</span>
                  </div>

                  {room.maintenanceIssues && (
                    <div className="text-[10px] text-amber-400 pt-1">
                      ⚠️ मर्मत विषय: {room.maintenanceIssues}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Kot Passbook Modal */}
      {selectedKotItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Crosshair className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{selectedKotItem.itemName}</h3>
              <div className="text-xs text-slate-400 font-mono-nums">सि.नं.: {selectedKotItem.serialNumber}</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">हालको अवस्था:</span>
                <span className="text-emerald-400 font-bold">{selectedKotItem.status === 'issued' ? 'जारी भएको' : 'कोट मौज्दात'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">जिम्मा:</span>
                <span className="text-white font-medium">{selectedKotItem.allocatedTo || 'कोट इनचार्ज'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">गोलीगठ्ठा:</span>
                <span className="font-mono-nums text-amber-400 font-bold">{selectedKotItem.ammunitionIssued} राउन्ड</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedKotItem(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
