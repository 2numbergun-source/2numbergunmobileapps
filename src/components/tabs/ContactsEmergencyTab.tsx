import React, { useState } from 'react';
import { 
  PhoneCall, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Copy 
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../data/mockData';
import { EmergencyContact } from '../../types/police';

export const ContactsEmergencyTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'कन्ट्रोल', 'गण', 'कमाण्डर', 'शाखा', 'अस्पताल'];

  const filteredContacts = EMERGENCY_CONTACTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyNumber = (contact: EmergencyContact) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.phone.replace(/[^0-9]/g, ''));
      setCopiedId(contact.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                🚨 आपतकालीन सम्पर्क प्रणाली (Emergency Call System)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              नेपाल प्रहरी आधिकारिक वेबसाइट तथा नियमावली अनुसार प्रमाणित आपतकालीन कन्ट्रोल, टोल-फ्री, ट्राफिक तथा गण नं. २ का आधिकारिक सम्पर्कहरू।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              २४/७ चौबिसै घण्टा सक्रिय
            </span>
          </div>
        </div>
      </div>

      {/* Official Highlight Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Police Control 100 */}
        <div className="bg-red-950/50 border-2 border-red-600/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black text-red-400 uppercase tracking-wider block">
                नेपाल प्रहरी केन्द्रीय कमाण्ड
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">प्रहरी कन्ट्रोल १००</h3>
              <p className="text-xs text-red-200/80">आकस्मिक प्रहरी सहायता तथा उद्धार</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-sm shadow">
              100
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href="tel:100"
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>📞 Call Now १००</span>
            </a>
          </div>
        </div>

        {/* 2. Toll-Free Hotline 16600141516 */}
        <div className="bg-blue-950/50 border-2 border-blue-600/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider block">
                निःशुल्क हटलाइन (Toll-Free)
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">नेपाल प्रहरी टोल-फ्री</h3>
              <p className="text-xs text-blue-200/80">गुनासो तथा आपतकालीन सूचना आदानप्रदान</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow">
              Toll
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href="tel:16600141516"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>📞 Call Now १६६००१४१५१६</span>
            </a>
          </div>
        </div>

        {/* 3. Traffic Police 103 */}
        <div className="bg-amber-950/40 border-2 border-amber-600/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                काठमाडौँ उपत्यका ट्राफिक
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">ट्राफिक कन्ट्रोल १०३</h3>
              <p className="text-xs text-amber-200/80">सडक दुर्घटना, जाम तथा आकस्मिक मार्ग</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow">
              103
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href="tel:103"
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>📞 Call Now १०३</span>
            </a>
          </div>
        </div>

      </div>

      {/* Search & Category Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="नम्बर, कार्यालय वा अधिकृत खोजी गर्नुहोस्..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                  selectedType === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'सबै' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Cards Grid with prominent '📞 Call Now' button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-md flex items-center justify-between gap-3 hover:border-slate-700 transition"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate">
                  {contact.name}
                </span>
                {contact.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {contact.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{contact.title}</p>
              <div className="text-xs font-mono font-bold text-cyan-300">
                फोन: {contact.phone}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyNumber(contact)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="नम्बर कपी गर्नुहोस्"
              >
                {copiedId === contact.id ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>📞 Call Now</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
