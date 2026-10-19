import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle2, UserPlus, Save } from 'lucide-react';
import { Officer } from '../types/police';

interface OfficerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (officer: Officer) => void;
  initialOfficer?: Officer | null;
}

export const OfficerFormModal: React.FC<OfficerFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOfficer,
}) => {
  const [formData, setFormData] = useState<Partial<Officer>>({
    bgCode: '',
    computerCode: '',
    sanketNo: '',
    rank: 'प्रहरी हवल्दार (प्रह)',
    name: '',
    darbandi: 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज',
    dabhaka: '—',
    jobResponsibility: '',
    specialSkills: '',
    barrack: 'जवान ब्यारेक',
    roomStatus: '—',
    residenceLocation: '—',
    gender: 'पुरुष',
    currentOffice: 'महाराजगञ्ज कमाण्ड',
    workingSinceDate: '२०८०/०२/०१',
    recruitmentDate: '२०६९/०१/१२',
    transferDate: '—',
    promotionDate: '—',
    previousDarbandi: '—',
    dateOfBirth: '२०५०/०१/०१',
    education: '+२ उत्तीर्ण',
    cugNumber: '—',
    relativeName: '—',
    nonCugNumber: '—',
    dutyFitness: 'योग्य',
    permanentAddress: '',
    fatherName: '—',
    motherName: '—',
    citizenshipNo: '—',
    vehicleNumber: '—',
    sanchaApNo: '—',
    email: '—',
    propertyOrAsset: '—',
    panNumber: '—',
    bankAccount: '—',
    remarks: '—',
    religion: 'हिन्दु',
    headOfFamily: '—',
    companyOrTeam: 'फिल्डको लागि दक्ष)',
    phone: '९८४१००००००',
    bloodGroup: 'B +ve',
    role: 'सुरक्षा तथा कमाण्ड',
    section: 'कमाण्ड प्लाटुन',
  });

  useEffect(() => {
    if (initialOfficer) {
      setFormData(initialOfficer);
    } else {
      setFormData({
        bgCode: `BG-2083-${Math.floor(1000 + Math.random() * 9000)}`,
        computerCode: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
        sanketNo: `${Math.floor(100000 + Math.random() * 900000)}`,
        rank: 'प्रहरी जवान (प्रज)',
        name: '',
        darbandi: 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज',
        dabhaka: '—',
        jobResponsibility: '',
        specialSkills: '',
        barrack: 'जवान ब्यारेक',
        roomStatus: '—',
        residenceLocation: '—',
        gender: 'पुरुष',
        currentOffice: 'महाराजगञ्ज कमाण्ड',
        workingSinceDate: '२०८०/०२/०१',
        recruitmentDate: '२०७०/०१/१२',
        transferDate: '—',
        promotionDate: '—',
        previousDarbandi: '—',
        dateOfBirth: '२०५२/०१/०१',
        education: '+२ उत्तीर्ण',
        cugNumber: '—',
        relativeName: '—',
        nonCugNumber: '—',
        dutyFitness: 'योग्य',
        permanentAddress: '',
        fatherName: '—',
        motherName: '—',
        citizenshipNo: '—',
        vehicleNumber: '—',
        sanchaApNo: '—',
        email: '—',
        propertyOrAsset: '—',
        panNumber: '—',
        bankAccount: '—',
        remarks: '—',
        religion: 'हिन्दु',
        headOfFamily: '—',
        companyOrTeam: 'फिल्डको लागि दक्ष',
        phone: '९८४१००००००',
        bloodGroup: 'B +ve',
        role: 'सुरक्षा तथा कमाण्ड',
        section: 'कमाण्ड प्लाटुन',
      });
    }
  }, [initialOfficer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Officer, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.computerCode?.trim()) {
      alert('कृपया कर्मचारीको नाम र कम्प्युटर कोड अनिवार्य भर्नुहोस्।');
      return;
    }

    const officerToSave: Officer = {
      id: initialOfficer ? initialOfficer.id : `officer-${Date.now()}`,
      bgCode: formData.bgCode || 'BG-2083-0000',
      computerCode: formData.computerCode || '',
      sanketNo: formData.sanketNo || '—',
      rank: formData.rank || 'प्रहरी जवान',
      name: formData.name || '',
      darbandi: formData.darbandi || 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज',
      dabhaka: formData.dabhaka || '—',
      jobResponsibility: formData.jobResponsibility || '—',
      specialSkills: formData.specialSkills || '—',
      barrack: formData.barrack || '—',
      roomStatus: formData.roomStatus || '—',
      residenceLocation: formData.residenceLocation || '—',
      gender: formData.gender || 'पुरुष',
      currentOffice: formData.currentOffice || 'महाराजगञ्ज कमाण्ड',
      workingSinceDate: formData.workingSinceDate || '—',
      recruitmentDate: formData.recruitmentDate || '—',
      transferDate: formData.transferDate || '—',
      promotionDate: formData.promotionDate || '—',
      previousDarbandi: formData.previousDarbandi || '—',
      dateOfBirth: formData.dateOfBirth || '—',
      education: formData.education || '—',
      cugNumber: formData.cugNumber || '—',
      relativeName: formData.relativeName || '—',
      nonCugNumber: formData.nonCugNumber || '—',
      dutyFitness: formData.dutyFitness || 'योग्य',
      permanentAddress: formData.permanentAddress || '—',
      fatherName: formData.fatherName || '—',
      motherName: formData.motherName || '—',
      citizenshipNo: formData.citizenshipNo || '—',
      vehicleNumber: formData.vehicleNumber || '—',
      sanchaApNo: formData.sanchaApNo || '—',
      email: formData.email || '—',
      propertyOrAsset: formData.propertyOrAsset || '—',
      panNumber: formData.panNumber || '—',
      bankAccount: formData.bankAccount || '—',
      remarks: formData.remarks || '—',
      religion: formData.religion || '—',
      headOfFamily: formData.headOfFamily || '—',
      companyOrTeam: formData.companyOrTeam || 'गुल्म नं. १',
      phone: formData.phone || '९८४१००००००',
      bloodGroup: formData.bloodGroup || 'B +ve',
      role: formData.jobResponsibility || formData.role || 'विशेष कार्यदल',
      section: formData.companyOrTeam || formData.section || 'कमाण्ड प्लाटुन',
      pin: '1234',
    };

    onSave(officerToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#070e24] border border-blue-900/70 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#091333] border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {initialOfficer ? 'प्रहरी कर्मचारी विवरण सम्पादन' : 'नयाँ प्रहरी कर्मचारी दर्ता फारम (PMIS Registration)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                सबै विवरण भरेर सुरक्षित गर्नुहोस् वा पछि पनि सम्पादन गर्न सकिन्छ।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body in 2-column Grid */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Row 1 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">B.G. कोड *</label>
              <input
                type="text"
                required
                value={formData.bgCode || ''}
                onChange={(e) => handleChange('bgCode', e.target.value)}
                placeholder="उदा: BG-2075-1029"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कम्प्युटर कोड *</label>
              <input
                type="text"
                required
                value={formData.computerCode || ''}
                onChange={(e) => handleChange('computerCode', e.target.value)}
                placeholder="उदा: CC-2075-1029 वा 371209"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">संकेत नं.</label>
              <input
                type="text"
                value={formData.sanketNo || ''}
                onChange={(e) => handleChange('sanketNo', e.target.value)}
                placeholder="उदा: १०२९४४"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">दर्जा (Rank) *</label>
              <select
                value={formData.rank || 'प्रहरी जवान (प्रज)'}
                onChange={(e) => handleChange('rank', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="प्रहरी उपरीक्षक (SP)">प्रहरी उपरीक्षक (SP)</option>
                <option value="प्रहरी नायव उपरीक्षक (DSP)">प्रहरी नायव उपरीक्षक (DSP)</option>
                <option value="प्रहरी निरीक्षक (Inspector)">प्रहरी निरीक्षक (Inspector)</option>
                  <option value="प्रहरी बरिष्ठ नायव निरीक्षक (SSI)">प्रहरी बरिष्ठ नायव निरीक्षक (SSI)</option>
                <option value="प्रनानि — प्रहरी नायव निरीक्षक (SI)">प्रनि — प्रहरी नायव निरीक्षक (SI)</option>
                <option value="प्र.स.नि. (ASI)">प्र.स.नि. (ASI)</option>
                 <option value="प्रहरी बरिष्ठ हवल्दार (प्रबह)">प्रहरी बरिष्ठ हवल्दार (प्रबह)</option>
                <option value="प्रहरी हवल्दार (प्रह)">प्रहरी हवल्दार (प्रह)</option>
                <option value="प्रहरी सहायक हवल्दार (प्रसह)">प्रहरी सहायक हवल्दार (प्रसह)</option>
                             <option value="प्रहरी जवान (प्रज)">प्रहरी जवान (प्रज)</option>
                      <option value="प्रहरी कार्यालय सहयोगी (प्रकास)">प्रहरी कार्यालय सहयोगी (प्रकास)</option>
              </select>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">नामथर *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="उदा: प्रकाश शर्मा"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">दरबन्दी</label>
              <input
                type="text"
                value={formData.darbandi || 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज'}
                onChange={(e) => handleChange('darbandi', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">द.भ.का.</label>
              <input
                type="text"
                value={formData.dabhaka || '—'}
                onChange={(e) => handleChange('dabhaka', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कामको जिम्मेवारी</label>
              <input
                type="text"
                value={formData.jobResponsibility || ''}
                onChange={(e) => handleChange('jobResponsibility', e.target.value)}
                placeholder="उदा: क कम्पनी इन्चार्ज तथा फिल्ड अपरेशन कमाण्डर"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Row 5 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">विशेष क्षमता</label>
              <input
                type="text"
                value={formData.specialSkills || ''}
                onChange={(e) => handleChange('specialSkills', e.target.value)}
                placeholder="उदा: अपरेशन योजना, भीड वार्तालाप"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ब्यारेक</label>
              <input
                type="text"
                value={formData.barrack || 'अधिकृत आवास क्वाटर'}
                onChange={(e) => handleChange('barrack', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Row 6 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कोठावाला</label>
              <input
                type="text"
                value={formData.roomStatus || '—'}
                onChange={(e) => handleChange('roomStatus', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">बस्ने स्थान</label>
              <input
                type="text"
                value={formData.residenceLocation || '—'}
                onChange={(e) => handleChange('residenceLocation', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Row 7 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">लिङ्ग</label>
              <select
                value={formData.gender || 'पुरुष'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="पुरुष">पुरुष</option>
                <option value="महिला">महिला</option>
                <option value="अन्य">अन्य</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कार्यरत कार्यालय</label>
              <input
                type="text"
                value={formData.currentOffice || 'महाराजगञ्ज कमाण्ड'}
                onChange={(e) => handleChange('currentOffice', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Row 8 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">सम्पर्क मोबाइल</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="९८४xxxxxxx"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कम्पनी तथा कार्यदल</label>
              <select
                value={formData.companyOrTeam || 'क कम्पनी'}
                onChange={(e) => handleChange('companyOrTeam', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="क कम्पनी">क कम्पनी</option>
                <option value="ख कम्पनी">ख कम्पनी</option>
                <option value="विशेष कार्यदल (QRF)">विशेष कार्यदल (QRF)</option>
                <option value="प्रमुख कमाण्ड">प्रमुख कमाण्ड</option>
              </select>
            </div>

            {/* Row 9 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">रक्त समूह (Blood Group)</label>
              <select
                value={formData.bloodGroup || 'B +ve'}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="A +ve">A +ve</option>
                <option value="A -ve">A -ve</option>
                <option value="B +ve">B +ve</option>
                <option value="B -ve">B -ve</option>
                <option value="AB +ve">AB +ve</option>
                <option value="AB -ve">AB -ve</option>
                <option value="O +ve">O +ve</option>
                <option value="O -ve">O -ve</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">वतन (ठेगाना)</label>
              <input
                type="text"
                value={formData.permanentAddress || ''}
                onChange={(e) => handleChange('permanentAddress', e.target.value)}
                placeholder="उदा: काठमाडौँ, महाराजगञ्ज"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>


            {/* सबै बाँकी विवरण (Sheet का सबै स्तम्भ अनुसार) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कार्यरत मिति</label>
              <input
                type="text"
                value={formData.workingSinceDate && formData.workingSinceDate !== '—' ? formData.workingSinceDate : ''}
                onChange={(e) => handleChange('workingSinceDate', e.target.value)}
                placeholder="उदा: २०८०/०२/०१"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">भर्ना मिति</label>
              <input
                type="text"
                value={formData.recruitmentDate && formData.recruitmentDate !== '—' ? formData.recruitmentDate : ''}
                onChange={(e) => handleChange('recruitmentDate', e.target.value)}
                placeholder="उदा: २०७०/०१/१२"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">सरुवा मिति</label>
              <input
                type="text"
                value={formData.transferDate && formData.transferDate !== '—' ? formData.transferDate : ''}
                onChange={(e) => handleChange('transferDate', e.target.value)}
                placeholder="उदा: २०८१/०५/१०"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">बढुवा मिति</label>
              <input
                type="text"
                value={formData.promotionDate && formData.promotionDate !== '—' ? formData.promotionDate : ''}
                onChange={(e) => handleChange('promotionDate', e.target.value)}
                placeholder="उदा: २०८२/०१/०१"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">साविक दरबन्दी</label>
              <input
                type="text"
                value={formData.previousDarbandi && formData.previousDarbandi !== '—' ? formData.previousDarbandi : ''}
                onChange={(e) => handleChange('previousDarbandi', e.target.value)}
                placeholder="उदा: सशस्त्र प्रहरी गण नं. १"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">जन्म मिति</label>
              <input
                type="text"
                value={formData.dateOfBirth && formData.dateOfBirth !== '—' ? formData.dateOfBirth : ''}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                placeholder="उदा: २०५२/०१/०१"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">शैक्षिक योग्यता</label>
              <input
                type="text"
                value={formData.education && formData.education !== '—' ? formData.education : ''}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="उदा: +२ उत्तीर्ण"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">CUG भएका</label>
              <input
                type="text"
                value={formData.cugNumber && formData.cugNumber !== '—' ? formData.cugNumber : ''}
                onChange={(e) => handleChange('cugNumber', e.target.value)}
                placeholder="उदा: ९८५१xxxxxx"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">आफन्तको नाम</label>
              <input
                type="text"
                value={formData.relativeName && formData.relativeName !== '—' ? formData.relativeName : ''}
                onChange={(e) => handleChange('relativeName', e.target.value)}
                placeholder="आपतकालीन सम्पर्क व्यक्तिको नाम"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">CUG नभएका</label>
              <input
                type="text"
                value={formData.nonCugNumber && formData.nonCugNumber !== '—' ? formData.nonCugNumber : ''}
                onChange={(e) => handleChange('nonCugNumber', e.target.value)}
                placeholder="उदा: ९८४१xxxxxx"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ड्युटी गर्न सक्ने/नसक्ने</label>
              <select
                value={formData.dutyFitness || 'योग्य'}
                onChange={(e) => handleChange('dutyFitness', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="योग्य">योग्य</option>
                <option value="अयोग्य">अयोग्य</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">बुबाको नाम</label>
              <input
                type="text"
                value={formData.fatherName && formData.fatherName !== '—' ? formData.fatherName : ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="उदा: राम बहादुर शर्मा"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">आमाको नाम</label>
              <input
                type="text"
                value={formData.motherName && formData.motherName !== '—' ? formData.motherName : ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                placeholder="उदा: सीता शर्मा"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">नागरिकता नं.</label>
              <input
                type="text"
                value={formData.citizenshipNo && formData.citizenshipNo !== '—' ? formData.citizenshipNo : ''}
                onChange={(e) => handleChange('citizenshipNo', e.target.value)}
                placeholder="उदा: ०१-०१-७५-१२३४५"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">सवारी साधन नं.</label>
              <input
                type="text"
                value={formData.vehicleNumber && formData.vehicleNumber !== '—' ? formData.vehicleNumber : ''}
                onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                placeholder="उदा: बा १ प १२३४"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">संचाअप नं.</label>
              <input
                type="text"
                value={formData.sanchaApNo && formData.sanchaApNo !== '—' ? formData.sanchaApNo : ''}
                onChange={(e) => handleChange('sanchaApNo', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="text"
                value={formData.email && formData.email !== '—' ? formData.email : ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="उदा: name@gmail.com"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">भएको/नभएको</label>
              <input
                type="text"
                value={formData.propertyOrAsset && formData.propertyOrAsset !== '—' ? formData.propertyOrAsset : ''}
                onChange={(e) => handleChange('propertyOrAsset', e.target.value)}
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">PAN</label>
              <input
                type="text"
                value={formData.panNumber && formData.panNumber !== '—' ? formData.panNumber : ''}
                onChange={(e) => handleChange('panNumber', e.target.value)}
                placeholder="उदा: १२३४५६७८९"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">बैंक खाता</label>
              <input
                type="text"
                value={formData.bankAccount && formData.bankAccount !== '—' ? formData.bankAccount : ''}
                onChange={(e) => handleChange('bankAccount', e.target.value)}
                placeholder="उदा: बैंकको नाम र खाता नं."
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">धर्म</label>
              <input
                type="text"
                value={formData.religion && formData.religion !== '—' ? formData.religion : ''}
                onChange={(e) => handleChange('religion', e.target.value)}
                placeholder="उदा: हिन्दु"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">घरमूलीको नाम</label>
              <input
                type="text"
                value={formData.headOfFamily && formData.headOfFamily !== '—' ? formData.headOfFamily : ''}
                onChange={(e) => handleChange('headOfFamily', e.target.value)}
                placeholder="उदा: घरमूलीको नाम"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">कै.</label>
              <input
                type="text"
                value={formData.remarks && formData.remarks !== '—' ? formData.remarks : ''}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="कैफियत"
                className="w-full bg-[#0c1630] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              रद्द गर्नुहोस्
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>सुरक्षित गर्नुहोस् (Save)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
