import React, { useState } from 'react';
import { 
  Car, 
  Fuel, 
  Wrench, 
  User, 
  Phone, 
  Plus, 
  Clock, 
  CheckCircle, 
  Gauge, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { VEHICLES_FLEET_DATA } from '../../data/mockData';
import { VehicleRecord } from '../../types/police';

export const TransportFleetTab: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(VEHICLES_FLEET_DATA);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqVehicleType, setReqVehicleType] = useState('जीप (Scorpio/Hilux)');
  const [reqHours, setReqHours] = useState('४ घण्टा');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPurpose.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowReqModal(false);
      setReqPurpose('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                सवारी साधन व्यवस्थापन तथा यातायात लगबुक (Fleet Management)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              गणका सम्पूर्ण परिचालन गाडी, दंगा नियन्त्रण वाटर क्यानन, भ्यान, चालक विवरण तथा इन्धन अभिलेख
            </p>
          </div>

          <button
            onClick={() => setShowReqModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-950 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ड्युटी प्रयोजनका लागि सवारी माग गर्नुहोस्</span>
          </button>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono-nums text-blue-400 font-bold block">
                  {v.vehicleNo}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{v.type}</h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">{v.assignedTeam}</span>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                v.condition === 'दुरुस्त (Operational)'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : v.condition === 'गस्तीमा (On Patrol)'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {v.condition}
              </span>
            </div>

            {/* Driver & Contact */}
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  चालक:
                </span>
                <span className="font-semibold text-white">{v.driver}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  सम्पर्क:
                </span>
                <span className="font-mono-nums text-white">{v.driverPhone}</span>
              </div>
            </div>

            {/* Fuel & Mileage Meters */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  इन्धन मौज्दात
                </span>
                <span className="font-bold text-white font-mono-nums">{v.fuelLevelPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full ${
                    v.fuelLevelPercent > 50 ? 'bg-emerald-500' : v.fuelLevelPercent > 25 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${v.fuelLevelPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono-nums">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-slate-500" />
                  कुल कि.मी.: {v.totalKm.toLocaleString()} km
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate max-w-[180px]">मर्मत: {v.lastMaintenance}</span>
              <span className="text-blue-400 font-semibold cursor-pointer hover:underline">लगबुक हेर्नुहोस्</span>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Request Modal */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" />
                <span>डिजिटल सवारी माग फाराम</span>
              </h3>
              <button
                onClick={() => setShowReqModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">सवारी माग फाराम दर्ता भयो!</div>
                <p className="text-xs text-slate-400">सवारी तथा यातायात शाखाबाट तत्काल स्वीकृति विवरण प्राप्त हुनेछ।</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">सवारी प्रकार</label>
                  <select
                    value={reqVehicleType}
                    onChange={(e) => setReqVehicleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="जीप (Scorpio/Hilux)">जीप (Scorpio/Hilux)</option>
                    <option value="मोबाइल भ्यान (Van)">मोबाइल भ्यान (Van)</option>
                    <option value="दंगा नियन्त्रण वाटर क्यानन">दंगा नियन्त्रण वाटर क्यानन</option>
                    <option value="प्रहरी बस">प्रहरी बस (Bus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">आवश्यक अवधि</label>
                  <input
                    type="text"
                    value={reqHours}
                    onChange={(e) => setReqHours(e.target.value)}
                    placeholder="उदा. ४ घण्टा / दिनभरि"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">मागको प्रयोजन तथा ड्युटी रुट</label>
                  <textarea
                    rows={3}
                    value={reqPurpose}
                    onChange={(e) => setReqPurpose(e.target.value)}
                    placeholder="कुन ड्युटी वा सुरक्षा टोलीका लागि सवारी माग गरिएको हो?..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowReqModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    रद्द
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  >
                    माग पेश गर्नुहोस्
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
