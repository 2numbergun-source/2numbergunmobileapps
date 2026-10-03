import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Trash2, 
  MapPin, 
  Users, 
  Radio, 
  Car, 
  FileText, 
  CheckCircle2, 
  X,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { DutyItem, Officer } from '../../types/police';

interface DutyRosterTabProps {
  duties: DutyItem[];
  officers: Officer[];
  currentOfficer: Officer;
  isAdmin: boolean;
  onAddDuty: (duty: DutyItem) => void;
  onRemoveDuty: (dutyId: string) => void;
  onRequireAdmin: () => void;
  onNavigatePatrol: () => void;
}

export const DutyRosterTab: React.FC<DutyRosterTabProps> = ({
  duties,
  officers,
  currentOfficer,
  isAdmin,
  onAddDuty,
  onRemoveDuty,
  onRequireAdmin,
  onNavigatePatrol,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Duty form state
  const [title, setTitle] = useState('');
  const [assignedOfficerId, setAssignedOfficerId] = useState(currentOfficer.id);
  const [dutyType, setDutyType] = useState<DutyItem['dutyType']>('Patrol Duty');
  const [locationName, setLocationName] = useState('');
  const [timeSlot, setTimeSlot] = useState('बिहान ०६:०० बजे देखि दिउँसो १४:०० बजे सम्म');
  const [commanderName, setCommanderName] = useState('शिव श्रेष्ठ');
  const [commanderRank, setCommanderRank] = useState('प्र.स.नि. (ASI)');
  const [commanderPhone, setCommanderPhone] = useState('९८५११००१२३');
  const [vehicleNumber, setVehicleNumber] = useState('बा. १ ग २१०४');
  const [vehicleModel, setVehicleModel] = useState('Scorpio QRF Van');
  const [driverName, setDriverName] = useState('प्र.ज. सुमन केसी');
  const [driverPhone, setDriverPhone] = useState('९८४१२३००९९');
  const [instructionText, setInstructionText] = useState('नियमित पेट्रोलिङ तथा भीडभाड नियन्त्रणमा सतर्क रहने।');

  const dutyTypesList = [
    'Patrol Duty',
    'Reserve Duty',
    'कार्यालय Duty',
    'विशेष Duty',
    'Night Duty',
  ];

  const filteredDuties = duties.filter((d) => {
    if (selectedFilter === 'all') return true;
    return d.dutyType === selectedFilter;
  });

  const handleCreateDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    let coords = { lat: 27.7369, lng: 85.3305 };
    if (locationName.includes('कोटेश्वर')) coords = { lat: 27.6775, lng: 85.3486 };
    else if (locationName.includes('बसपार्क') || locationName.includes('बालाजु')) coords = { lat: 27.7345, lng: 85.3112 };
    else if (locationName.includes('धोबीखोला') || locationName.includes('सुकेधारा')) coords = { lat: 27.7391, lng: 85.3421 };
    else if (locationName.includes('चाबहिल') || locationName.includes('गौशाला')) coords = { lat: 27.7172, lng: 85.3484 };
    else if (locationName.includes('कलंकी') || locationName.includes('सीतापाइला')) coords = { lat: 27.6934, lng: 85.2818 };

    const newDuty: DutyItem = {
      id: `duty-${Date.now()}`,
      officerId: assignedOfficerId,
      title: title.trim(),
      date: '२०८३ असोज १३ गते',
      timeSlot,
      dutyType,
      locationName: locationName.trim(),
      coords,
      teamMembers: [
        { name: currentOfficer.name, rank: currentOfficer.rank, role: 'कमाण्डर/सदस्य' },
        { name: 'प्र.ह. राम बहादुर थापा', rank: 'प्र.ह.' },
        { name: 'प्र.स.ह. रमेश श्रेष्ठ', rank: 'प्र.स.ह.' },
        { name: 'प्र.ज. सन्तोष बुढा', rank: 'प्र.ज.' },
      ],
      commanderName,
      commanderRank,
      commanderPhone,
      vehicleNumber,
      vehicleModel,
      driverName,
      driverPhone,
      instructions: instructionText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status: 'सक्रिय',
    };

    onAddDuty(newDuty);
    setIsAddModalOpen(false);
    setTitle('');
    setLocationName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              गण ड्युटी व्यवस्थापन तथा रोस्टर (Duty Management)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            गस्ती (Patrol), रिजर्भ (Reserve), कार्यालय (Office), विशेष (QRF/Special) तथा रात्रिकालीन (Night) ड्युटीहरूको विवरण
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नयाँ ड्युटी थप्नुहोस् (Admin)</span>
            </button>
          ) : (
            <button
              onClick={onRequireAdmin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ड्युटी थप/हटाउन (Admin लगइन)</span>
            </button>
          )}

          <button
            onClick={onNavigatePatrol}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-semibold transition cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>GPS नक्सामा हेर्नुहोस्</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          सबै ड्युटीहरू ({duties.length})
        </button>

        {dutyTypesList.map((type) => {
          const count = duties.filter((d) => d.dutyType === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                selectedFilter === type
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Duty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDuties.map((duty) => (
          <div
            key={duty.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4 hover:border-slate-700 transition relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  duty.dutyType === 'विशेष Duty'
                    ? 'bg-red-950 text-red-400 border border-red-500/40'
                    : duty.dutyType === 'Night Duty'
                    ? 'bg-purple-950 text-purple-400 border border-purple-500/40'
                    : duty.dutyType === 'Patrol Duty'
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    : 'bg-blue-950 text-blue-400 border border-blue-500/40'
                }`}>
                  {duty.dutyType}
                </span>

                <span className="text-xs font-mono font-bold text-emerald-400">
                  {duty.timeSlot}
                </span>
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm(`के तपाईं '${duty.title}' ड्युटी रोस्टरबाट हटाउन चाहनुहुन्छ?`)) {
                      onRemoveDuty(duty.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 transition border border-red-500/20"
                  title="ड्युटी हटाउनुहोस्"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{duty.title}</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>स्थान: <strong className="text-white">{duty.locationName}</strong></span>
              </div>
            </div>

            {/* Team Members & Commander */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-amber-400" />
                  कमाण्डर:
                </span>
                <span className="font-bold text-amber-300">
                  {duty.commanderRank} {duty.commanderName}
                </span>
                <div className="text-[11px] text-blue-400 font-mono">
                  सम्पर्क: {duty.commanderPhone}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Car className="w-3 h-3 text-purple-400" />
                  सवारी साधन & चालक:
                </span>
                <span className="font-bold text-slate-200">
                  {duty.vehicleNumber} ({duty.vehicleModel})
                </span>
                <div className="text-[11px] text-slate-400">
                  चालक: {duty.driverName}
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                टोली सदस्यहरू:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed pl-5">
                {duty.teamMembers.map((m) => m.name).join(', ')}
              </p>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                विशेष निर्देशनहरू:
              </span>
              <ul className="text-slate-300 text-[11px] space-y-1 pl-5 list-disc list-outside">
                {duty.instructions.map((inst, idx) => (
                  <li key={idx} className="leading-snug">
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Add New Duty (Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">नयाँ ड्युटी थप्नुहोस् (Admin Duty Assignment)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDuty} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ड्युटी शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: चक्रपथ मोबाइल गस्ती / कोटेश्वर चोक"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ड्युटीको प्रकार *</label>
                  <select
                    value={dutyType}
                    onChange={(e) => setDutyType(e.target.value as DutyItem['dutyType'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {dutyTypesList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">कर्मचारी चयन</label>
                  <select
                    value={assignedOfficerId}
                    onChange={(e) => setAssignedOfficerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {officers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.rank})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ड्युटीको स्थान (Location Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: कोटेश्वर चोक, नयाँ बसपार्क, महाराजगञ्ज"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ड्युटी समय (Time Slot)</label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ड्युटी कमाण्डर</label>
                  <input
                    type="text"
                    value={commanderName}
                    onChange={(e) => setCommanderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">कमाण्डर सम्पर्क</label>
                  <input
                    type="text"
                    value={commanderPhone}
                    onChange={(e) => setCommanderPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">सवारी साधन नं.</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">चालक नाम</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ड्युटी सम्बन्धी विशेष निर्देशनहरू</label>
                <textarea
                  rows={2}
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow cursor-pointer"
                >
                  ड्युटी रोस्टरमा थप्नुहोस् र म्यापमा अपडेट गर्नुहोस्
                </button>
              </div>
            </form>

            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                रद्द
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
