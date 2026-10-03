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
  Building
} from 'lucide-react';
import { LeaveRequest, PolicePersonnel, SalarySlip } from '../../types/police';
import { MOCK_PAYSLIP } from '../../data/mockData';

interface LeaveManagementTabProps {
  officer: PolicePersonnel;
  leaveRequests: LeaveRequest[];
  onAddLeaveRequest: (req: LeaveRequest) => void;
}

export const LeaveManagementTab: React.FC<LeaveManagementTabProps> = ({
  officer,
  leaveRequests,
  onAddLeaveRequest,
}) => {
  const [activeSubView, setActiveSubView] = useState<'leave' | 'salary' | 'welfare'>('leave');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'घर विदा' | 'भैपरी विदा' | 'बिरामी विदा' | 'प्रसूति / स्याहार विदा'>('घर विदा');
  const [startDate, setStartDate] = useState('२०८३/०७/१५');
  const [endDate, setEndDate] = useState('२०८३/०७/२२');
  const [totalDays, setTotalDays] = useState(8);
  const [reason, setReason] = useState('');
  const [address, setAddress] = useState('गल्कोट नगरपालिका-३, बागलुङ');
  const [phone, setPhone] = useState(officer.phone);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

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
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            विदा तथा कर्मचारी कल्याणकारी सुविधा
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            डिजिटल विदा आवेदन, मासिक तलब स्लिप र प्रहरी कल्याण कोष विवरण
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveSubView('leave')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubView === 'leave'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            डिजिटल विदा
          </button>
          <button
            onClick={() => setActiveSubView('salary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubView === 'salary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            तलब स्लिप
          </button>
          <button
            onClick={() => setActiveSubView('welfare')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubView === 'welfare'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            अस्पताल / कल्याण
          </button>
        </div>
      </div>

      {isSuccessToast && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>विदाको निवेदन सफलतापुर्वक दर्ता भयो। कमाण्डर तथा गणपति समक्ष पेश गरिएको छ।</span>
          </div>
        </div>
      )}

      {/* LEAVE VIEW */}
      {activeSubView === 'leave' && (
        <div className="space-y-6">
          {/* Leave Quota Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">घर विदा बाँकी</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono-nums">
                {officer.leaveBalance.homeLeave} दिन
              </div>
              <div className="text-[11px] text-slate-500">वार्षिक स्वीकृत कोटाबाट</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">भैपरी विदा बाँकी</div>
              <div className="text-2xl font-bold text-blue-400 font-mono-nums">
                {officer.leaveBalance.casualLeave} दिन
              </div>
              <div className="text-[11px] text-slate-500">आकस्मिक प्रयोजनका लागि</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">बिरामी विदा बाँकी</div>
              <div className="text-2xl font-bold text-amber-400 font-mono-nums">
                {officer.leaveBalance.sickLeave} दिन
              </div>
              <div className="text-[11px] text-slate-500">स्वास्थ्य उपचार प्रयोजन</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">क्रिया / विशेष विदा</div>
              <div className="text-2xl font-bold text-purple-400 font-mono-nums">
                {officer.leaveBalance.specialLeave} दिन
              </div>
              <div className="text-[11px] text-slate-500">नियम अनुसार</div>
            </div>
          </div>

          {/* Action button to trigger leave modal */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">मेरा विदा निवेदनहरूको स्थिति</h3>
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>नयाँ विदा निवेदन दिनुहोस्</span>
            </button>
          </div>

          {/* Leave Requests List */}
          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{req.leaveType}</span>
                      <span className="text-xs font-mono-nums text-slate-400">
                        ({req.totalDays} दिन)
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      मिति: {req.startDate} देखि {req.endDate} सम्म
                    </div>
                  </div>

                  <div>
                    {req.status === 'approved' && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        स्वीकृत (Approved)
                      </span>
                    )}
                    {req.status === 'pending' && (
                      <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        प्रक्रियामा (Pending)
                      </span>
                    )}
                    {req.status === 'rejected' && (
                      <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        अस्वीकृत (Rejected)
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="text-slate-300">
                    <strong className="text-slate-400">कारण: </strong>
                    {req.reason}
                  </div>
                  <div className="text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px]">
                    <span>विदामा बस्ने ठेगाना: <strong className="text-slate-200">{req.contactAddress}</strong></span>
                    <span>सम्पर्क फोन: <strong className="text-slate-200 font-mono-nums">{req.contactPhone}</strong></span>
                  </div>
                </div>

                {req.approvedBy && (
                  <div className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>स्वीकृति प्रदान: {req.approvedBy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SALARY SLIP VIEW */}
      {activeSubView === 'salary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                नेपाल प्रहरी तलब भुक्तानी स्लिप
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                मासिक तलब तथा भत्ता विवरण - {MOCK_PAYSLIP.monthNepali} महिना, {MOCK_PAYSLIP.yearNepali}
              </h3>
              <p className="text-xs text-slate-400">
                कर्मचारी: {officer.rankNepali} {officer.nameNepali} (दर्ता नं: {officer.pmisNo})
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>स्लिप डाउनलोड</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                १. पाउने रकम (Earnings & Allowances)
              </h4>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>सुरु स्केल (Basic Salary)</span>
                  <span className="font-mono-nums font-semibold text-white">रु. {MOCK_PAYSLIP.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>ग्रेड रकम (Grade Increment)</span>
                  <span className="font-mono-nums font-semibold text-white">रु. {MOCK_PAYSLIP.gradeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>रासन भत्ता (Ration Allowance)</span>
                  <span className="font-mono-nums font-semibold text-white">रु. {MOCK_PAYSLIP.rationAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>सशस्त्र विशेष जोखिम भत्ता (Risk Allowance)</span>
                  <span className="font-mono-nums font-semibold text-white">रु. {MOCK_PAYSLIP.riskAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>पोसाक भत्ता (Uniform Allowance)</span>
                  <span className="font-mono-nums font-semibold text-white">रु. {MOCK_PAYSLIP.uniformAllowance.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-emerald-300 text-sm">
                  <span>जम्मा आम्दानी (Gross Salary)</span>
                  <span className="font-mono-nums">रु. {MOCK_PAYSLIP.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                २. कट्टी हुने रकम (Deductions)
              </h4>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>कर्मचारी सञ्चय कोष (PF 10%)</span>
                  <span className="font-mono-nums font-semibold text-rose-300">रु. {MOCK_PAYSLIP.pfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>नागरिक लगानी कोष (CIT)</span>
                  <span className="font-mono-nums font-semibold text-rose-300">रु. {MOCK_PAYSLIP.citDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>प्रहरी सावधिक जीवन बीमा</span>
                  <span className="font-mono-nums font-semibold text-rose-300">रु. {MOCK_PAYSLIP.insuranceDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>प्रहरी कल्याण कोष योगदान</span>
                  <span className="font-mono-nums font-semibold text-rose-300">रु. {MOCK_PAYSLIP.welfareDeduction.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-rose-300 text-sm">
                  <span>जम्मा कट्टी (Total Deductions)</span>
                  <span className="font-mono-nums">
                    रु. {(MOCK_PAYSLIP.pfDeduction + MOCK_PAYSLIP.citDeduction + MOCK_PAYSLIP.insuranceDeduction + MOCK_PAYSLIP.welfareDeduction).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* NET TAKE HOME */}
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-blue-300">बैंक खातामा जम्मा भएको खुद रकम (Net Deposited Salary)</div>
              <div className="text-2xl font-bold text-white font-mono-nums mt-0.5">
                रु. {MOCK_PAYSLIP.netSalary.toLocaleString()} /-
              </div>
            </div>
            <div className="text-xs text-slate-400">
              खाता: राष्ट्रिय वाणिज्य बैंक महाराजगञ्ज शाखा
            </div>
          </div>
        </div>
      )}

      {/* WELFARE & HOSPITAL VIEW */}
      {activeSubView === 'welfare' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Building className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                नेपाल प्रहरी अस्पताल महाराजगञ्ज र कल्याणकारी सेवा
              </h3>
              <p className="text-xs text-slate-400">
                गण परिसर नजिकै रहेको नेपाल प्रहरी अस्पतालबाट प्राप्त हुने प्रत्यक्ष सुविधाहरू
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">निःशुल्क ओपिडी तथा स्वास्थ्य जाँच</h4>
              <p className="text-slate-300 leading-relaxed">
                प्रहरी कर्मचारी तथा आश्रित परिवारका लागि जनरल ओपिडी, ल्याब परीक्षण, एक्सरे, इसिजी तथा निःशुल्क औषधि वितरण।
              </p>
              <div className="text-[11px] text-slate-400 pt-1 font-mono-nums">
                समय: बिहान ०९:०० देखि दिउँसो ०४:०० बजेसम्म (आकस्मिक २४ घण्टा)
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-blue-400 text-sm">कल्याणकारी सहुलियत ऋण तथा छात्रवृत्ति</h4>
              <p className="text-slate-300 leading-relaxed">
                प्रहरी कल्याण कोषबाट घर निर्माण, सन्ततिको उच्च शिक्षा छात्रवृत्ति, तथा आकस्मिक उपचार सहयोग ऋण सुविधा।
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                सिफारिस: गण कल्याण शाखा महाराजगञ्ज मार्फत
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">डिजिटल विदा निवेदन फाराम</h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">विदाको प्रकार</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">अन्तिम मिति</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">कुल दिन संख्या</label>
                <input
                  type="number"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono-nums"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">विदा बस्नुपर्ने स्पष्ट कारण</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="विदा बस्नुको कारण विस्तृत रूपमा उल्लेख गर्नुहोस्..."
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">विदामा बस्ने ठेगाना</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">सम्पर्क फोन नम्बर</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono-nums"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>निवेदन पेस गर्नुहोस्</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
