import React, { useState } from 'react';
import { X, Shield, Check, User, Phone, Plus } from 'lucide-react';
import { Officer } from '../types/police';

interface IdentitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  officers: Officer[];
  currentOfficerId: string;
  onSelectOfficer: (officerId: string) => void;
  onAddNewOfficer?: (newOfficer: Officer) => void;
}

export const IdentitySelectModal: React.FC<IdentitySelectModalProps> = ({
  isOpen,
  onClose,
  officers,
  currentOfficerId,
  onSelectOfficer,
  onAddNewOfficer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('प्रहरी जवान');
  const [newCode, setNewCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSection, setNewSection] = useState('कमाण्ड प्लाटुन १');

  if (!isOpen) return null;

  const filteredOfficers = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.computerCode.includes(searchTerm) ||
      o.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAndSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newOfficer: Officer = {
      id: `officer-custom-${Date.now()}`,
      bgCode: `BG-2083-${Math.floor(1000 + Math.random() * 9000)}`,
      computerCode: newCode.trim(),
      sanketNo: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      name: newName.trim(),
      rank: newRank,
      darbandi: 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज',
      phone: newPhone.trim() || '९८४०००००००',
      bloodGroup: 'B +ve',
      role: 'विशेष कार्यदल / सुरक्षा',
      section: newSection,
      companyOrTeam: newSection,
      pin: '1234',
    };

    if (onAddNewOfficer) {
      onAddNewOfficer(newOfficer);
    }
    onSelectOfficer(newOfficer.id);
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">कर्मचारी पहिचान चयन / बदल्नुहोस्</h3>
              <p className="text-[11px] text-slate-400">
                एकपटक चयन गरेपछि यो फोनले स्वतः याद राख्नेछ
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

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          
          {!showAddForm ? (
            <>
              {/* Search & Add button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="नाम, कम्प्युटर कोड वा दर्जा खोजी गर्नुहोस्..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नयाँ थप्नुहोस्</span>
                </button>
              </div>

              {/* Officer List */}
              <div className="space-y-2">
                {filteredOfficers.map((officer) => {
                  const isCurrent = officer.id === currentOfficerId;
                  return (
                    <div
                      key={officer.id}
                      onClick={() => {
                        onSelectOfficer(officer.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{officer.name}</span>
                            <span className="text-[11px] text-blue-400 font-medium">({officer.rank})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>कम्प्युटर कोड: <strong className="text-slate-300 font-mono">{officer.computerCode}</strong></span>
                            <span>• {officer.section}</span>
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>सक्रिय</span>
                        </div>
                      ) : (
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1 rounded bg-slate-700/50 hover:bg-slate-700">
                          चयन गर्नुहोस्
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Add Officer Form */
            <form onSubmit={handleCreateAndSelect} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">नयाँ प्रहरी कर्मचारी डाटा एन्ट्री</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  रद्द गर्नुहोस्
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">पूरा नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: बैकुण्ठ सुवेदी"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">दर्जा (Rank) *</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                      <option value="प्रहरी कार्यालय सहयोगी">प्रहरी कार्यालय सहयोगी</option>
                    <option value="प्रहरी जवान">प्रहरी जवान</option>
                    <option value="प्रहरी सहायक हवल्दार">प्रहरी सहायक हवल्दार</option>
                    <option value="प्रहरी हवल्दार">प्रहरी हवल्दार</option>
                     <option value="प्रहरी बरिष्ठ हवल्दार">प्रहरी बरिष्ठ हवल्दार</option>
                    <option value="प्र.स.नि. (ASI)">प्र.स.नि. (ASI)</option>
                    <option value="प्र.ना.नि. (SI)">प्र.ना.नि. (SI)</option>
                      <option value="प्र.ब.ना.नि. (SSI)">प्र.ब.ना.नि. (SSI)</option>
                    <option value="प्रहरी निरीक्षक (Inspector)">प्रहरी निरीक्षक (Inspector)</option>
                    <option value="प्रहरी नायव उपरीक्षक (DSP)">प्रहरी नायव उपरीक्षक (DSP)</option>
                    <option value="प्रहरी उपरीक्षक (SP)">प्रहरी उपरीक्षक (SP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">कम्प्युटर कोड *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: 371209"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">मोबाइल सम्पर्क</label>
                  <input
                    type="text"
                    placeholder="९८४xxxxxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">शाखा / प्लाटुन</label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                >
                  सुरक्षित गरी यो फोनमा सक्रिय गर्नुहोस्
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            बन्द गर्नुहोस्
          </button>
        </div>

      </div>
    </div>
  );
};
