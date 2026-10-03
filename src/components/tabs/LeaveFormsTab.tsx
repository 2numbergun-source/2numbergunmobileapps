import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Download, 
  HeartHandshake,
  Send,
  Building,
  ArrowRight,
  Layers,
  FileCheck
} from 'lucide-react';
import { PolicePersonnel, DigitalForm, SalarySlip, LeaveRequest } from '../../types/police';
import { INITIAL_DIGITAL_FORMS, MOCK_PAYSLIP } from '../../data/mockData';

interface LeaveFormsTabProps {
  officer: PolicePersonnel;
  leaveRequests: LeaveRequest[];
  onAddLeaveRequest: (req: LeaveRequest) => void;
}

export const LeaveFormsTab: React.FC<LeaveFormsTabProps> = ({
  officer,
  leaveRequests,
  onAddLeaveRequest,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'forms' | 'leaves' | 'pipeline' | 'salary'>('forms');
  const [formsList, setFormsList] = useState<DigitalForm[]>(INITIAL_DIGITAL_FORMS);
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [formType, setFormType] = useState<DigitalForm['formType']>('बिदा आवेदन');
  const [formTitle, setFormTitle] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // New leave modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'घर विदा' | 'भैपरी विदा' | 'बिरामी विदा' | 'प्रसूति / स्याहार विदा'>('घर विदा');
  const [startDate, setStartDate] = useState('२०८३/०७/१५');
  const [endDate, setEndDate] = useState('२०८३/०७/२२');
  const [totalDays, setTotalDays] = useState(8);
  const [reason, setReason] = useState('');
  const [address, setAddress] = useState('गल्कोट नगरपालिका-३, बागलुङ');
  const [phone, setPhone] = useState(officer.phone);

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDetails.trim()) return;

    const newForm: DigitalForm = {
      id: `df-${Date.now()}`,
      formType,
      applicantName: officer.nameNepali,
      applicantRank: officer.rankNepali,
      applicantPmis: officer.pmisNo,
      title: formTitle,
      details: formDetails,
      submittedDate: 'आज, २०८३ असोज १०',
      stage: 'दर्ता',
      actionOfficer: 'प्रशासन शाखा प्रमुख'
    };

    setFormsList([newForm, ...formsList]);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowNewFormModal(false);
      setFormTitle('');
      setFormDetails('');
    }, 1500);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      personnelId: officer.id,
      personnelName: officer.nameNepali,
      rank: officer.rankNepali,
      pmisNo: officer.pmisNo,
      company: officer.company,
      leaveType,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      reason,
      appliedDate: 'आज, २०८३ असोज १०',
      status: 'pending',
      contactAddress: address,
      contactPhone: phone,
    };

    onAddLeaveRequest(newReq);
    setShowApplyModal(false);
    setReason('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                डिजिटल निवेदन, विदा तथा प्रशासनिक स्वीकृति प्रणाली
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              कागजी फाराम शून्य बनाउने उद्देश्य सहित दर्ता, सिफारिस र स्वीकृतिको स्वचालित कार्यप्रवाह
            </p>
          </div>

          <button
            onClick={() => setShowNewFormModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-950 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>नयाँ डिजिटल निवेदन दर्ता गर्नुहोस्</span>
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'forms'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            १. डिजिटल फारामहरू ({formsList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'pipeline'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            २. Digital Approval कार्यप्रवाह
          </button>
          <button
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'leaves'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            ३. विदा आवेदन र मौज्दात
          </button>
          <button
            onClick={() => setActiveSubTab('salary')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'salary'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800'
            }`}
          >
            ४. तलब स्लिप र कल्याण
          </button>
        </div>
      </div>

      {/* 1. DIGITAL FORMS LIST */}
      {activeSubTab === 'forms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formsList.map((form) => (
              <div
                key={form.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {form.formType}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">{form.title}</h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    form.stage === 'सम्पन्न' || form.stage === 'स्वीकृति'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : form.stage === 'शाखा सिफारिस'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    चरण: {form.stage}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {form.details}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>निवेदक: {form.applicantRank} {form.applicantName}</span>
                  <span className="font-mono-nums">{form.submittedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DIGITAL APPROVAL PIPELINE TRACKER */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>डिजिटल स्वीकृति कार्यप्रवाह (Digital Approval Pipeline)</span>
            </h3>
            <p className="text-xs text-slate-400">
              प्रत्येक निवेदनलाई ४ चरणमा पारदर्शी ढंगले सम्बोधन गरिन्छ:
            </p>

            {/* Visual 4-Stage Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/50">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mx-auto mb-2 font-mono-nums">
                  १
                </div>
                <div className="font-bold text-white">१. दर्ता (Submitted)</div>
                <div className="text-[10px] text-slate-400 mt-1">कर्मचारीद्वारा मोबाइलबाट पेश</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/50">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mx-auto mb-2 font-mono-nums">
                  २
                </div>
                <div className="font-bold text-white">२. सम्बन्धित शाखा</div>
                <div className="text-[10px] text-slate-400 mt-1">फाइल अध्ययन तथा कागजात पुष्टी</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/50">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mx-auto mb-2 font-mono-nums">
                  ३
                </div>
                <div className="font-bold text-white">३. सिफारिस (Recommended)</div>
                <div className="text-[10px] text-slate-400 mt-1">कम्पनी/फाँट कमाण्डर सिफारिस</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/50">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto mb-2 font-mono-nums">
                  ४
                </div>
                <div className="font-bold text-white">४. स्वीकृति (Approved)</div>
                <div className="text-[10px] text-slate-400 mt-1">गणपति / कमाण्डर अन्तिम निर्णय</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LEAVE QUOTA & APPLICATION */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400">घर विदा बाँकी</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono-nums">
                {officer.leaveBalance.homeLeave} दिन
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400">भैपरी विदा बाँकी</span>
              <div className="text-2xl font-bold text-blue-400 font-mono-nums">
                {officer.leaveBalance.casualLeave} दिन
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400">बिरामी विदा बाँकी</span>
              <div className="text-2xl font-bold text-amber-400 font-mono-nums">
                {officer.leaveBalance.sickLeave} दिन
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
              <span className="text-xs text-slate-400">सट्टा विदा</span>
              <div className="text-2xl font-bold text-purple-400 font-mono-nums">
                {officer.leaveBalance.substituteLeave} दिन
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">मेरा विदा निवेदनहरू</h3>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
            >
              + विदा निवेदन दिनुहोस्
            </button>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{req.leaveType} ({req.totalDays} दिन)</span>
                  <span className="text-emerald-400 font-medium">स्थिति: {req.status}</span>
                </div>
                <p className="text-slate-300">{req.reason}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  मिति: {req.startDate} देखि {req.endDate} सम्म | ठेगाना: {req.contactAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SALARY SLIP VIEW */}
      {activeSubTab === 'salary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-blue-400 font-semibold uppercase">नेपाल प्रहरी तलब भुक्तानी स्लिप</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                मासिक तलब तथा भत्ता विवरण - {MOCK_PAYSLIP.monthNepali} {MOCK_PAYSLIP.yearNepali}
              </h3>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>प्रिन्ट / डाउनलोड</span>
            </button>
          </div>

          <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-300">खुद खातामा जम्मा भएको रकम (Net Deposited)</span>
              <div className="text-2xl font-bold text-white font-mono-nums mt-1">
                रु. {MOCK_PAYSLIP.netSalary.toLocaleString()} /-
              </div>
            </div>
            <span className="text-xs text-slate-400">रा.वा. बैंक महाराजगञ्ज</span>
          </div>
        </div>
      )}

      {/* NEW DIGITAL FORM MODAL */}
      {showNewFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>डिजिटल निवेदन / फाराम दर्ता</span>
              </h3>
              <button
                onClick={() => setShowNewFormModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">निवेदन सफलतापूर्वक दर्ता भयो!</div>
              </div>
            ) : (
              <form onSubmit={handleCreateForm} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">फारामको प्रकार</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="बिदा आवेदन">बिदा आवेदन</option>
                    <option value="काज माग">काज माग</option>
                    <option value="सवारी माग">सवारी माग</option>
                    <option value="सामान माग">सामान माग (स्टोर)</option>
                    <option value="मर्मत माग">मर्मत माग</option>
                    <option value="ड्युटी परिवर्तन">ड्युटी परिवर्तन</option>
                    <option value="ब्यारेक समस्या निवेदन">ब्यारेक समस्या निवेदन</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">विषय / शीर्षक</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="उदा. चाडपर्व काज माग / युनिफर्म माग"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">विस्तृत व्यहोरा</label>
                  <textarea
                    rows={4}
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    placeholder="निवेदनको विस्तृत विवरण..."
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewFormModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    रद्द
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                  >
                    निवेदन दर्ता गर्नुहोस्
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NEW LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">डिजिटल विदा निवेदन फाराम</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">विदाको प्रकार</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                >
                  <option value="घर विदा">घर विदा (बाँकी: १८ दिन)</option>
                  <option value="भैपरी विदा">भैपरी विदा (बाँकी: ४ दिन)</option>
                  <option value="बिरामी विदा">बिरामी विदा (बाँकी: १० दिन)</option>
                  <option value="प्रसूति / स्याहार विदा">प्रसूति / स्याहार विदा</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">सुरु मिति</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">अन्तिम मिति</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">स्पष्ट कारण</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="विदा बस्नुको कारण..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  रद्द
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  पेस गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
