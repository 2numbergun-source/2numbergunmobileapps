import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  ShieldAlert, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { BATTALION_FORCE_STRENGTH, INITIAL_PROBLEMS_REPORTS } from '../../data/mockData';
import { IncidentProblemReport } from '../../types/police';

export const ReportsAnalyticsTab: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentProblemReport[]>(INITIAL_PROBLEMS_REPORTS);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const buildSitrepText = () => `
=====================================================
नेपाल प्रहरी · काठमाडौं उपत्यका प्रहरी कार्यालय
सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज, काठमाडौं
दैनिक वस्तुस्थिति प्रतिवेदन (DAILY SITUATION REPORT - SITREP)
मिति: २०८३ असोज १० गते | समय: २४ घण्टे सारांश
=====================================================

१. जनशक्ति मौज्दात (ROLL CALL & FORCE STRENGTH):
- कुल दरबन्दी नफ्री: ${BATTALION_FORCE_STRENGTH.totalStrength} जना
- हाजिर प्रमाणित संख्या: ${BATTALION_FORCE_STRENGTH.presentCount} जना
- फिल्ड तथा चेकपोष्ट ड्युटीमा: ${BATTALION_FORCE_STRENGTH.onDuty} जना
- दंगा नियन्त्रण QRF स्ट्यान्डबाइ: ${BATTALION_FORCE_STRENGTH.standbyQRF} जना (३ मिनेट परिचालन)
- ब्यारेक रिजर्भ नफ्री: ${BATTALION_FORCE_STRENGTH.barrackReserve} जना
- स्वीकृत विदामा: ${BATTALION_FORCE_STRENGTH.onLeave} जना
- अस्पताल/बिरामी: ${BATTALION_FORCE_STRENGTH.medicalHospital} जना
- अनुपस्थित: ${BATTALION_FORCE_STRENGTH.absentCount} जना

२. गस्ती तथा सवारी परिचालन (PATROL & MOBILITY):
- परिचालित गस्ती टोलीहरू: ${BATTALION_FORCE_STRENGTH.activePatrols} टोली (अल्फा, ब्राभो, चार्ली, डेल्टा)
- परिचालित सरकारी सवारी: ${BATTALION_FORCE_STRENGTH.activeVehicles} थान (वाटर क्यानन, जीप, भ्यान)
- GPS ट्र्याकिङ स्थिति: सम्पूर्ण रुट सामान्य, कुनै अवरोध छैन

३. शान्ति सुरक्षा तथा दर्ता भएका घटनाहरू:
- कुल दर्ता रिपोर्ट: ${incidents.length} वटा
${incidents.map((inc, i) => `  [${i + 1}] ${inc.title} (${inc.location}) - स्थिति: ${inc.status}`).join('\n')}

४. कमाण्डर निर्देशन:
काठमाडौं उपत्यका चाडपर्व लक्षित विशेष सुरक्षा कडा गर्नू।
=====================================================
जारीकर्ता: अपरेसन तथा कमाण्ड शाखा, महाराजगञ्ज गण
    `;

  const downloadBlob = (content: string, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const notifySuccess = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleExportExcel = () => {
    // CSV opens directly in Excel / Google Sheets.
    // BOM included so Devanagari renders correctly in Excel.
    const rows: string[][] = [
      ['शीर्षक', 'प्रकार', 'स्थान', 'प्रतिवेदक', 'मिति', 'प्राथमिकता', 'स्थिति'],
      ...incidents.map((inc) => [
        inc.title,
        inc.type,
        inc.location,
        `${inc.reportedByRank} ${inc.reportedBy}`,
        inc.reportedDate,
        inc.priority,
        inc.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    downloadBlob('\uFEFF' + csv, 'text/csv;charset=utf-8', 'GanaNo2_SITREP_Data.csv');
    notifySuccess('Excel/CSV डाटा फाइल डाउनलोड सम्पन्न भयो!');
  };

  const handleExportPdf = () => {
    // Open a print-ready window; users choose "Save as PDF" as the printer.
    const w = window.open('', '_blank');
    if (!w) {
      // Popup blocked — fall back to text download
      downloadBlob(buildSitrepText(), 'text/plain;charset=utf-8', 'GanaNo2_SITREP.txt');
      notifySuccess('SITREP टेक्स्ट फाइल डाउनलोड सम्पन्न भयो!');
      return;
    }
    w.document.write(`<!doctype html><html lang="ne"><head><meta charset="utf-8">
      <title>गण नं. २ महाराजगञ्ज - SITREP प्रतिवेदन</title>
      <style>
        body { font-family: 'Noto Sans Devanagari', 'Mangal', system-ui, sans-serif; padding: 32px; white-space: pre-wrap; line-height: 1.7; font-size: 13px; }
        @media print { body { padding: 0; } }
      </style></head><body>${buildSitrepText().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
    notifySuccess('प्रिन्ट विन्डो खोलियो — "Save as PDF" रोज्नुहोस्।');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                कार्यालय ड्यासबोर्ड तथा प्रतिवेदन प्रणाली (SITREP & Reports)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              दैनिक ड्युटी, जनशक्ति नफ्री, गस्ती, सवारी परिचालन र सुरक्षा घटनाहरूको एकीकृत प्रतिवेदन
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel Export</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF/SITREP डाउनलोड</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* Point 20: 9-Point Dashboard Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 block text-[11px]">👮 कुल कर्मचारी दरबन्दी</span>
          <div className="text-2xl font-black text-white font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.totalStrength}
          </div>
          <span className="text-slate-500 text-[10px]">गण दरबन्दी</span>
        </div>

        <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-4">
          <span className="text-emerald-400 block text-[11px]">🟢 उपस्थित नफ्री</span>
          <div className="text-2xl font-black text-emerald-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.presentCount}
          </div>
          <span className="text-emerald-500 text-[10px]">रोलकल प्रमाणित</span>
        </div>

        <div className="bg-slate-900 border border-blue-900/50 rounded-2xl p-4">
          <span className="text-blue-400 block text-[11px]">🔵 ड्युटीमा खटिएका</span>
          <div className="text-2xl font-black text-blue-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.onDuty}
          </div>
          <span className="text-blue-500 text-[10px]">उपत्यका विभिन्न पोष्ट</span>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-4">
          <span className="text-amber-400 block text-[11px]">🟡 बिदामा रहेका</span>
          <div className="text-2xl font-black text-amber-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.onLeave}
          </div>
          <span className="text-amber-500 text-[10px]">स्वीकृत विदा</span>
        </div>

        <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-4">
          <span className="text-rose-400 block text-[11px]">🔴 बिरामी / अस्पताल</span>
          <div className="text-2xl font-black text-rose-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.medicalHospital}
          </div>
          <span className="text-rose-500 text-[10px]">प्रहरी अस्पताल</span>
        </div>

        <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-4">
          <span className="text-purple-400 block text-[11px]">🚔 गस्ती टोली (Patrol)</span>
          <div className="text-2xl font-black text-purple-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.activePatrols}
          </div>
          <span className="text-purple-500 text-[10px]">सक्रिय गस्ती</span>
        </div>

        <div className="bg-slate-900 border border-cyan-900/50 rounded-2xl p-4">
          <span className="text-cyan-400 block text-[11px]">🚗 परिचालित सवारी</span>
          <div className="text-2xl font-black text-cyan-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.activeVehicles}
          </div>
          <span className="text-cyan-500 text-[10px]">चालु अवस्थामा</span>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <span className="text-slate-300 block text-[11px]">📝 बाँकी प्रशासनिक कार्य</span>
          <div className="text-2xl font-black text-amber-400 font-mono-nums mt-1">
            {BATTALION_FORCE_STRENGTH.pendingTasksCount}
          </div>
          <span className="text-slate-400 text-[10px]">प्रक्रियामा रहेका</span>
        </div>
      </div>

      {/* Point 22: Recent Incidents and Actions Taken */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>दर्ता भएका पछिल्ला सुरक्षा तथा समस्या प्रतिवेदनहरू</span>
          </h3>
          <span className="text-xs text-slate-400">अद्यावधिक: आज</span>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-white text-sm">{inc.title}</span>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    स्थान: {inc.location} | प्रतिवेदक: {inc.reportedByRank} {inc.reportedBy} ({inc.reportedDate})
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  inc.status === 'सम्पन्न (Completed)'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {inc.status}
                </span>
              </div>

              <p className="text-slate-300">{inc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
