import React, { useState, useRef } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Plus, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldAlert,
  QrCode,
  IdCard,
  UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Officer } from '../../types/police';
import { INITIAL_OFFICERS } from '../../data/mockData';
import { OfficerDetailModal } from '../OfficerDetailModal';
import { OfficerFormModal } from '../OfficerFormModal';
import { OfficerQrModal } from '../OfficerQrModal';

interface PersonnelDirectoryTabProps {
  officers: Officer[];
  onUpdateOfficers: (officers: Officer[]) => void;
  currentOfficerId: string;
  onSelectAsDeviceUser: (officerId: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const PersonnelDirectoryTab: React.FC<PersonnelDirectoryTabProps> = ({
  officers,
  onUpdateOfficers,
  currentOfficerId,
  onSelectAsDeviceUser,
  isAdmin,
  onRequireAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  
  // Modals state
  const [inspectingOfficer, setInspectingOfficer] = useState<Officer | null>(null);
  const [qrModalOfficer, setQrModalOfficer] = useState<Officer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentOfficer = officers.find((o) => o.id === currentOfficerId) || officers[0];

  const ranksList = [
    'सबै दर्जा',
    'प्रहरी उपरीक्षक (SP)',
    'प्रनि — प्रहरी नायव निरीक्षक (SI)',
    'प्र.स.नि. (ASI)',
    'प्रहरी हवल्दार (प्रह)',
    'प्रहरी सहायक हवल्दार (प्रसह्)',
    'प्रहरी सहायक हवल्दार (महिला) (प्रसह्)',
    'प्रहरी जवान (प्रज)',
  ];

  const companiesList = [
    'सबै कम्पनी तथा कार्यदल',
    'क कम्पनी',
    'ख कम्पनी',
    'विशेष कार्यदल (QRF)',
    'प्रमुख कमाण्ड',
  ];

  // Filtering for Admin Table
  const filtered = officers.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.computerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.bgCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.sanketNo && o.sanketNo.includes(searchTerm)) ||
      (o.jobResponsibility && o.jobResponsibility.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.darbandi && o.darbandi.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRank =
      selectedRank === 'all' ||
      selectedRank === 'सबै दर्जा' ||
      o.rank.includes(selectedRank.replace('सबै दर्जा', ''));

    const matchesCompany =
      selectedCompany === 'all' ||
      selectedCompany === 'सबै कम्पनी तथा कार्यदल' ||
      (o.companyOrTeam && o.companyOrTeam.includes(selectedCompany));

    return matchesSearch && matchesRank && matchesCompany;
  });

  // 1. Export Excel function (Admin only)
  const handleExportExcel = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }

    try {
      const exportRows = officers.map((o, index) => ({
        'सि.नं.': index + 1,
        'B.G. कोड': o.bgCode || '',
        'कम्प्युटर कोड': o.computerCode || '',
        'संकेत नं.': o.sanketNo || '',
        'दर्जा': o.rank || '',
        'नामथर': o.name || '',
        'दरबन्दी': o.darbandi || '',
        'द.भ.का.': o.dabhaka || '—',
        'कामको जिम्मेवारी': o.jobResponsibility || '',
        'विशेष क्षमता': o.specialSkills || '',
        'ब्यारेक': o.barrack || '',
        'कोठावाला': o.roomStatus || '—',
        'बस्ने स्थान': o.residenceLocation || '—',
        'लिङ्ग': o.gender || 'पुरुष',
        'कार्यरत कार्यालय': o.currentOffice || '',
        'कार्यरत मिति': o.workingSinceDate || '',
        'भर्ना मिति': o.recruitmentDate || '',
        'सरुवा मिति': o.transferDate || '—',
        'बढुवा मिति': o.promotionDate || '—',
        'साविक दरबन्दी': o.previousDarbandi || '—',
        'जन्म मिति': o.dateOfBirth || '',
        'शैक्षिक योग्यता': o.education || '',
        'CUG भएका': o.cugNumber || '—',
        'आफन्तको नाम': o.relativeName || '—',
        'CUG नभएका': o.nonCugNumber || '—',
        'ड्युटी गर्न सक्ने/नसक्ने': o.dutyFitness || 'योग्य',
        'वतन': o.permanentAddress || '',
        'बुबाको नाम': o.fatherName || '—',
        'आमाको नाम': o.motherName || '—',
        'नागरिकता नं.': o.citizenshipNo || '—',
        'सवारी साधन नं.': o.vehicleNumber || '—',
        'संचाअप नं.': o.sanchaApNo || '—',
        'Email': o.email || '—',
        'भएको/नभएको': o.propertyOrAsset || '—',
        'PAN': o.panNumber || '—',
        'बैंक खाता': o.bankAccount || '—',
        'धर्म': o.religion || '',
        'घरमूलीको नाम': o.headOfFamily || '',
        'कम्पनी तथा कार्यदल': o.companyOrTeam || '',
        'सम्पर्क फोन': o.phone || '',
        'रक्त समूह': o.bloodGroup || '',
        'कै.': o.remarks || '—',
      }));

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'PMIS कर्मचारी अभिलेख');

      const filename = `APF_PMIS_Personnel_Directory_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, filename);

      setNoticeMessage('एक्सेल फाइल सफलतापूर्वक डाउनलोड भयो!');
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (e) {
      console.error(e);
      alert('एक्सेल डाउनलोड गर्दा समस्या आयो।');
    }
  };

  // 2. Batch Upload Excel function
  const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws);

        if (!rows || rows.length === 0) {
          alert('फाइलमा कुनै डाटा फेला परेन।');
          return;
        }

        let updatedList = [...officers];
        let addedCount = 0;
        let updatedCount = 0;

        rows.forEach((row) => {
          const compCode = String(row['कम्प्युटर कोड'] || row['computerCode'] || '').trim();
          const name = String(row['नामथर'] || row['name'] || '').trim();
          const bgCode = String(row['B.G. कोड'] || row['bgCode'] || `BG-2083-${Math.floor(1000 + Math.random() * 9000)}`).trim();
          const sanketNo = String(row['संकेत नं.'] || row['sanketNo'] || '').trim();

          if (!name) return;

          const existingIndex = updatedList.findIndex(
            (o) =>
              (compCode && o.computerCode === compCode) ||
              (sanketNo && o.sanketNo === sanketNo)
          );

          const officerData: Officer = {
            id: existingIndex >= 0 ? updatedList[existingIndex].id : `officer-${Date.now()}-${Math.random()}`,
            bgCode: bgCode || 'BG-2083-0000',
            computerCode: compCode || `CC-${Math.floor(100000 + Math.random() * 900000)}`,
            sanketNo: sanketNo || '—',
            rank: String(row['दर्जा'] || row['rank'] || 'प्रहरी जवान (प्रज)').trim(),
            name: name,
            darbandi: String(row['दरबन्दी'] || row['darbandi'] || 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज').trim(),
            dabhaka: String(row['द.भ.का.'] || row['dabhaka'] || '—').trim(),
            jobResponsibility: String(row['कामको जिम्मेवारी'] || row['jobResponsibility'] || '—').trim(),
            specialSkills: String(row['विशेष क्षमता'] || row['specialSkills'] || '—').trim(),
            barrack: String(row['ब्यारेक'] || row['barrack'] || 'जवान ब्यारेक').trim(),
            roomStatus: String(row['कोठावाला'] || '—').trim(),
            residenceLocation: String(row['बस्ने स्थान'] || '—').trim(),
            gender: String(row['लिङ्ग'] || 'पुरुष').trim(),
            currentOffice: String(row['कार्यरत कार्यालय'] || 'महाराजगञ्ज कमाण्ड').trim(),
            workingSinceDate: String(row['कार्यरत मिति'] || '२०८०/०२/०१').trim(),
            recruitmentDate: String(row['भर्ना मिति'] || '२०७०/०१/१२').trim(),
            transferDate: String(row['सरुवा मिति'] || '—').trim(),
            promotionDate: String(row['बढुवा मिति'] || '—').trim(),
            previousDarbandi: String(row['साविक दरबन्दी'] || '—').trim(),
            dateOfBirth: String(row['जन्म मिति'] || '२०५०/०१/०१').trim(),
            education: String(row['शैक्षिक योग्यता'] || '+२ उत्तीर्ण').trim(),
            cugNumber: String(row['CUG भएका'] || '—').trim(),
            relativeName: String(row['आफन्तको नाम'] || '—').trim(),
            nonCugNumber: String(row['CUG नभएका'] || '—').trim(),
            dutyFitness: String(row['ड्युटी गर्न सक्ने/नसक्ने'] || 'योग्य').trim(),
            permanentAddress: String(row['वतन'] || '—').trim(),
            fatherName: String(row['बुबाको नाम'] || '—').trim(),
            motherName: String(row['आमाको नाम'] || '—').trim(),
            citizenshipNo: String(row['नागरिकता नं.'] || '—').trim(),
            vehicleNumber: String(row['सवारी साधन नं.'] || '—').trim(),
            sanchaApNo: String(row['संचाअप नं.'] || '—').trim(),
            email: String(row['Email'] || '—').trim(),
            propertyOrAsset: String(row['भएको/नभएको'] || '—').trim(),
            panNumber: String(row['PAN'] || '—').trim(),
            bankAccount: String(row['बैंक खाता'] || '—').trim(),
            religion: String(row['धर्म'] || 'हिन्दु').trim(),
            headOfFamily: String(row['घरमूलीको नाम'] || '—').trim(),
            companyOrTeam: String(row['कम्पनी तथा कार्यदल'] || 'क कम्पनी').trim(),
            phone: String(row['सम्पर्क फोन'] || row['phone'] || '९८४१००००००').trim(),
            bloodGroup: String(row['रक्त समूह'] || 'B +ve').trim(),
            remarks: String(row['कै.'] || row['कैफियत'] || '—').trim(),
            role: String(row['कामको जिम्मेवारी'] || 'सुरक्षा तथा कमाण्ड').trim(),
            section: String(row['कम्पनी तथा कार्यदल'] || 'कमाण्ड प्लाटुन').trim(),
            pin: '1234',
          };

          if (existingIndex >= 0) {
            updatedList[existingIndex] = officerData;
            updatedCount++;
          } else {
            updatedList.push(officerData);
            addedCount++;
          }
        });

        onUpdateOfficers(updatedList);
        setNoticeMessage(`एक्सेल डाटा लोड सम्पन्न! (नयाँ थपिएको: ${addedCount}, अद्यावधिक: ${updatedCount})`);
        setTimeout(() => setNoticeMessage(null), 5000);
      } catch (err) {
        console.error(err);
        alert('एक्सेल फाइल पढ्दा समस्या आयो। कृपया सही ढाँचाको फाइल छान्नुहोस्।');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // 3. Reset to Initial Seed Data
  const handleResetToInitial = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    if (confirm('के तपाईं कर्मचारी अभिलेखलाई मूल (Default) डाटामा फर्काउन चाहनुहुन्छ?')) {
      onUpdateOfficers(INITIAL_OFFICERS);
      setNoticeMessage('कर्मचारी अभिलेख मूल डाटामा फिर्ता गरियो।');
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  // 4. Delete Single Officer
  const handleDeleteOfficer = (id: string, name: string) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    if (confirm(`के तपाईं '${name}' को अभिलेख हटाउन निश्चित हुनुहुन्छ?`)) {
      const updated = officers.filter((o) => o.id !== id);
      onUpdateOfficers(updated);
      setNoticeMessage(`'${name}' को अभिलेख सफलतापूर्वक हटाइयो।`);
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  // 5. Save Single Officer (from form modal)
  const handleSaveOfficer = (savedOfficer: Officer) => {
    const existingIndex = officers.findIndex((o) => o.id === savedOfficer.id);
    let updated: Officer[];
    if (existingIndex >= 0) {
      updated = [...officers];
      updated[existingIndex] = savedOfficer;
      setNoticeMessage(`'${savedOfficer.name}' को अभिलेख अद्यावधिक भयो।`);
    } else {
      updated = [savedOfficer, ...officers];
      setNoticeMessage(`'${savedOfficer.name}' नयाँ कर्मचारीको रूपमा थपियो।`);
    }
    onUpdateOfficers(updated);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header Box */}
      <div className="bg-[#0b132b] border border-blue-950 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                प्रहरी कर्मचारी डिजिटल अभिलेख तथा QR कोड प्रणाली (PMIS Directory)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              प्रत्येक कर्मचारीको छुट्टा छुट्टै QR कोडको व्यवस्था। {isAdmin ? 'एड्मिन लगइन सक्रिय छ — सबै कर्मचारीहरूको अभिलेख नियन्त्रण गर्न सकिन्छ।' : 'गोपनीयता नीति: एक-अर्काको विवरण हेर्न नमिल्ने व्यवस्था गरिएको छ।'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>Admin मोड सक्रिय (सम्पूर्ण पहुँच)</span>
              </span>
            ) : (
              <button
                onClick={onRequireAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow transition cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Admin लगइन (सम्पूर्ण सूची हेर्न)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {noticeMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* 2. REQUIREMENT 6 FULFILLMENT: STRICT PRIVACY WHEN NOT IN ADMIN MODE */}
      {!isAdmin ? (
        /* Regular Officer View: Sees ONLY their own personal profile & QR Code */
        <div className="space-y-5">
          
          {/* Privacy Security Banner */}
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🔒 आचारसंहिता तथा व्यक्तिगत गोपनीयता सुरक्षा नीति</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/30">
                    Strict Privacy Mode
                  </span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  प्रहरी नियमावली तथा गोपनियता नियम अनुसार <strong>एक कर्मचारीले अर्को कर्मचारीको व्यक्तिगत विवरण हेर्न मिल्दैन।</strong> तपाईंको यो डिभाइसमा तपाईंको आफ्नै डिजिटल परिचय पत्र र व्यक्तिगत QR कोड मात्र सुरक्षित रूपमा उपलब्ध छ।
                </p>
                <p className="text-[11px] text-slate-400">
                  सम्पूर्ण कर्मचारीहरूको एकीकृत विवरण र व्यवस्थापन केवल अधिकृत <strong>Admin / गणपति कमाण्ड</strong> ले मात्र हेर्न पाउनेछ।
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                यदि तपाईं अधिकृत Admin हुनुहुन्छ भने लगइन गर्नुहोस्:
              </span>
              <button
                onClick={onRequireAdmin}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin पिन मार्फत अनलक गर्नुहोस्</span>
              </button>
            </div>
          </div>

          {/* Current Officer Personal E-ID & QR Card */}
          <div className="bg-[#0b132b] border border-blue-900/80 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-950">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border-2 border-blue-500 text-blue-400 flex items-center justify-center font-bold text-lg shadow">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-bold">मेरो व्यक्तिगत अभिलेख (My Verified Profile)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-white">{currentOfficer.name}</h3>
                  <p className="text-xs text-slate-400">{currentOfficer.rank} • कम्प्युटर कोड: {currentOfficer.computerCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQrModalOfficer(currentOfficer)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>मेरो QR कोड ठूलो हेर्नुहोस्</span>
                </button>

                <button
                  onClick={() => setInspectingOfficer(currentOfficer)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40 text-xs font-semibold transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>पूरा PMIS फारम</span>
                </button>
              </div>
            </div>

            {/* Quick 2-Column Summary for this Officer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">B.G. कोड:</span>
                <span className="font-mono font-bold text-cyan-300 block">{currentOfficer.bgCode}</span>
              </div>
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">संकेत नं.:</span>
                <span className="font-mono font-bold text-slate-100 block">{currentOfficer.sanketNo || '—'}</span>
              </div>
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">दरबन्दी:</span>
                <span className="font-bold text-white block">{currentOfficer.darbandi}</span>
              </div>
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">कामको जिम्मेवारी:</span>
                <span className="font-bold text-slate-200 block">{currentOfficer.jobResponsibility || '—'}</span>
              </div>
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">कम्पनी तथा कार्यदल:</span>
                <span className="font-bold text-amber-300 block">{currentOfficer.companyOrTeam || currentOfficer.section}</span>
              </div>
              <div className="bg-[#070e24] p-3 rounded-xl border border-blue-950 space-y-1">
                <span className="text-slate-400">सम्पर्क फोन / CUG:</span>
                <span className="font-mono font-bold text-blue-400 block">{currentOfficer.phone}</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Admin View: Full PMIS Directory + QR Code for Every Officer + Excel Controls */
        <div className="space-y-4">
          
          {/* Action Controls Bar */}
          <div className="bg-[#0b132b] border border-blue-950 rounded-2xl p-4 shadow-lg space-y-3.5">
            
            {/* Search & Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="नाम, संकेत नं., B.G. कोड, कम्प्युटर कोड वा विवरण खोज्नुहोस्..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#070e24] border border-blue-950/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className="w-full bg-[#070e24] border border-blue-950/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {ranksList.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full bg-[#070e24] border border-blue-950/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {companiesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>एक्सेल डाउनलोड (.xlsx)</span>
              </button>

              <button
                onClick={() => {
                  setEditingOfficer(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नयाँ कर्मचारी थप्नुहोस् (एक-एक जना)</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>एक्सेल डाटा लोड (धेरै जना एकैचोटि)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleUploadExcel}
                className="hidden"
              />

              <button
                onClick={handleResetToInitial}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>मूल डाटामा फर्कनुहोस्</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-blue-950/80">
              Admin ड्यासबोर्ड: सम्पूर्ण {officers.length} जना कर्मचारीहरूको अभिलेख तथा प्रत्येकको QR कोड नियन्त्रणमा उपलब्ध छ।
            </p>
          </div>

          {/* Full PMIS Table with QR Code button in each row */}
          <div className="bg-[#0b132b] border border-blue-950 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-blue-950 flex items-center justify-between text-xs">
              <span className="font-bold text-white">कर्मचारी अभिलेख तथा QR कोड तालिका</span>
              <span className="text-slate-400 font-mono">देखाइएको: {filtered.length} / {officers.length}</span>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full text-left text-xs text-slate-200 border-collapse">
                
                <thead className="bg-[#070e24] text-slate-400 font-semibold border-b border-blue-950 uppercase tracking-wider text-[11px] select-none">
                  <tr>
                    <th className="px-3 py-3.5 w-12 sticky left-0 z-20 bg-[#070e24] border-r border-blue-950/60 text-center">सि.नं.</th>
                    <th className="px-3.5 py-3.5 min-w-[130px] sticky left-12 z-20 bg-[#070e24] border-r border-blue-950/60">B.G. कोड</th>
                    <th className="px-3.5 py-3.5 min-w-[130px] sticky left-[178px] z-20 bg-[#070e24] border-r border-blue-950/60">कम्प्युटर कोड</th>
                    <th className="px-3.5 py-3.5 min-w-[120px] sticky left-[308px] z-20 bg-[#070e24] border-r border-blue-950/60">संकेत नं.</th>
                    <th className="px-3.5 py-3.5 min-w-[90px] sticky left-[428px] z-20 bg-[#070e24] border-r border-blue-950/60">दर्जा</th>
                    <th className="px-4 py-3.5 min-w-[160px] sticky left-[518px] z-20 bg-[#070e24] border-r border-blue-950/80 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">नामथर</th>
                    
                    {/* Scrollable Columns */}
                    <th className="px-3 py-3.5 w-24 text-center">QR कोड</th>
                    <th className="px-4 py-3.5 min-w-[200px]">कामको जिम्मेवारी</th>
                    <th className="px-3.5 py-3.5 min-w-[90px]">धर्म</th>
                    <th className="px-3.5 py-3.5 min-w-[140px]">घरमूलीको नाम</th>
                    <th className="px-3.5 py-3.5 min-w-[160px]">दरबन्दी</th>
                    <th className="px-3.5 py-3.5 min-w-[110px]">कम्पनी</th>
                    <th className="px-3.5 py-3.5 min-w-[110px]">सम्पर्क फोन</th>
                    <th className="px-3 py-3.5 w-16 text-center">कार्य</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-blue-950/60 text-[11px] font-mono">
                  {filtered.length > 0 ? (
                    filtered.map((officer, index) => {
                      const isCurrent = officer.id === currentOfficerId;
                      return (
                        <tr 
                          key={officer.id}
                          onClick={() => setInspectingOfficer(officer)}
                          className="hover:bg-blue-950/40 transition cursor-pointer group"
                        >
                          {/* 1. सि.नं. (Sticky) */}
                          <td className="px-3 py-3 text-center text-slate-400 sticky left-0 z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/60">
                            {index + 1}
                          </td>

                          {/* 2. B.G. कोड (Sticky) */}
                          <td className="px-3.5 py-3 font-bold text-cyan-400 sticky left-12 z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/60 whitespace-nowrap">
                            <span className="hover:underline">{officer.bgCode || '—'}</span>
                          </td>

                          {/* 3. कम्प्युटर कोड (Sticky) */}
                          <td className="px-3.5 py-3 font-bold text-cyan-300 sticky left-[178px] z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/60 whitespace-nowrap">
                            <span className="hover:underline">{officer.computerCode}</span>
                          </td>

                          {/* 4. संकेत नं. (Sticky) */}
                          <td className="px-3.5 py-3 text-slate-200 sticky left-[308px] z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/60 whitespace-nowrap">
                            {officer.sanketNo || '—'}
                          </td>

                          {/* 5. दर्जा (Sticky) */}
                          <td className="px-3.5 py-3 font-sans font-bold text-amber-400 sticky left-[428px] z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/60 whitespace-nowrap">
                            {officer.rank.split(' ')[0] || officer.rank}
                          </td>

                          {/* 6. नामथर (Sticky) */}
                          <td className="px-4 py-3 font-sans font-bold text-white sticky left-[518px] z-10 bg-[#0b132b] group-hover:bg-[#0f1d40] border-r border-blue-950/80 shadow-[2px_0_5px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{officer.name}</span>
                              {isCurrent && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="यो फोनमा सक्रिय" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {officer.rank}
                            </div>
                          </td>

                          {/* 7. Unique QR Code action button */}
                          <td 
                            className="px-3 py-3 text-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrModalOfficer(officer);
                            }}
                          >
                            <button
                              className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition"
                              title="यो कर्मचारीको QR कोड हेर्नुहोस्"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>QR</span>
                            </button>
                          </td>

                          {/* 8. कामको जिम्मेवारी */}
                          <td className="px-4 py-3 font-sans text-slate-300 truncate max-w-[220px]">
                            {officer.jobResponsibility && officer.jobResponsibility !== '—'
                              ? officer.jobResponsibility
                              : '—'}
                          </td>

                          {/* 9. धर्म */}
                          <td className="px-3.5 py-3 font-sans text-slate-300">
                            {officer.religion || '—'}
                          </td>

                          {/* 10. घरमूलीको नाम */}
                          <td className="px-3.5 py-3 font-sans text-slate-300">
                            {officer.headOfFamily || '—'}
                          </td>

                          {/* 11. दरबन्दी */}
                          <td className="px-3.5 py-3 font-sans text-slate-300 truncate max-w-[180px]">
                            {officer.darbandi || 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज'}
                          </td>

                          {/* 12. कम्पनी */}
                          <td className="px-3.5 py-3 font-sans text-slate-300">
                            {officer.companyOrTeam || 'क कम्पनी'}
                          </td>

                          {/* 13. सम्पर्क फोन */}
                          <td className="px-3.5 py-3 text-cyan-300 font-mono">
                            {officer.phone}
                          </td>

                          {/* 14. कार्य (Delete 🗑️) */}
                          <td 
                            className="px-3 py-3 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleDeleteOfficer(officer.id, officer.name)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/60 transition"
                              title="अभिलेख हटाउनुहोस्"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={14} className="px-4 py-10 text-center text-slate-500 font-sans">
                        कुनै पनि कर्मचारी विवरण फेला परेन।
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      )}

      {/* Modals */}
      <OfficerDetailModal
        officer={inspectingOfficer}
        onClose={() => setInspectingOfficer(null)}
        isAdmin={isAdmin}
        onEdit={(officer) => {
          setInspectingOfficer(null);
          setEditingOfficer(officer);
          setIsFormOpen(true);
        }}
      />

      {qrModalOfficer && (
        <OfficerQrModal
          isOpen={!!qrModalOfficer}
          onClose={() => setQrModalOfficer(null)}
          officer={qrModalOfficer}
        />
      )}

      <OfficerFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOfficer(null);
        }}
        onSave={handleSaveOfficer}
        initialOfficer={editingOfficer}
      />

    </div>
  );
};
