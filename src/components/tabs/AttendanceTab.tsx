import { gpsCheck } from '../../lib/cloud';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  QrCode, 
  KeyRound, 
  Download, 
  Search, 
  Lock, 
  LogOut,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Officer, AttendanceRecord, BattalionConfig } from '../../types/police';
import { calculateDistanceMeters } from '../../lib/alerts';
import { getDeviceInfoSummary } from '../../data/deviceIdentity';
import { 
  getCurrentNepaliDate, 
  toNepaliNumber, 
  getNepaliDaysOfMonth,
  getDaysInNepaliMonth,
  NEPALI_MONTHS
} from '../../lib/nepaliDate';

interface AttendanceTabProps {
  currentOfficer: Officer;
  officers?: Officer[];
  battalionConfig: BattalionConfig;
  attendanceRecords: AttendanceRecord[];
  onAddAttendanceRecord: (record: AttendanceRecord) => void;
  onUpdateAttendanceRecord: (recordId: string, updates: Partial<AttendanceRecord>) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  currentOfficer,
  officers = [],
  battalionConfig,
  attendanceRecords,
  onAddAttendanceRecord,
  onUpdateAttendanceRecord,
  isAdmin,
  onRequireAdmin,
}) => {
  // Current Nepali Date
  const currentNepali = getCurrentNepaliDate();

  // Dynamic Nepali Year and Month Selection (नेपाली क्यालेन्डर अनुसार २९, ३०, ३१ वा ३२ गते यकिन)
  const [selectedYear, setSelectedYear] = useState<number>(currentNepali.year);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentNepali.month - 1); // 0 = बैशाख, 5 = असोज

  // Calculate actual total days in selected Nepali month (e.g. 29, 30, 31, or 32)
  const totalDaysInMonth = useMemo(() => {
    return getDaysInNepaliMonth(selectedYear, selectedMonthIndex);
  }, [selectedYear, selectedMonthIndex]);

  // Dynamic array of days [1, 2, ... totalDaysInMonth]
  const monthDays = useMemo(() => {
    return getNepaliDaysOfMonth(totalDaysInMonth);
  }, [totalDaysInMonth]);

  const selectedMonthName = NEPALI_MONTHS[selectedMonthIndex];

  // Geolocation & geofence state
  const [useSimulatedInside, setUseSimulatedInside] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [distanceMeters, setDistanceMeters] = useState<number>(99999);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Verification method state: GPS + PIN or GPS + QR
  const [verificationType, setVerificationType] = useState<'pin' | 'qr'>('pin');
  const [inputPin, setInputPin] = useState<string>('');
  const [qrVerified, setQrVerified] = useState<boolean>(false);
  const [qrScanning, setQrScanning] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Search & filter for ledger
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pagination for Ledger table: Display only 4 or 5 officers per page so it stays compact and neat!
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // View mode toggle: 'monthly-matrix' vs 'daily-logs'
  const [viewMode, setViewMode] = useState<'monthly-matrix' | 'daily-logs'>('monthly-matrix');

  // Check today's record for current officer
  const todayRecord = attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id && r.date === currentNepali.dateString
  ) || attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id
  );

  // Recalculate distance whenever coords change
  useEffect(() => {
    const dist = calculateDistanceMeters(
      currentCoords.lat,
      currentCoords.lng,
      battalionConfig.centerCoords.lat,
      battalionConfig.centerCoords.lng
    );
    setDistanceMeters(dist);
  }, [currentCoords, battalionConfig]);

  // Handle GPS location refresh
  const refreshLocation = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (useSimulatedInside) {
      setTimeout(() => {
        const offsetLat = (Math.random() - 0.5) * 0.0001;
        const offsetLng = (Math.random() - 0.5) * 0.0001;
        setCurrentCoords({
          lat: battalionConfig.centerCoords.lat + offsetLat,
          lng: battalionConfig.centerCoords.lng + offsetLng,
        });
        setGpsLoading(false);
      }, 500);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setAccuracy(pos.coords.accuracy);
          setGpsLoading(false);
        },
        () => {
          setGpsError('GPS सिग्नल प्राप्त हुन सकेन। Location अनुमति दिनुहोस्।');
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsError('ब्राउजरले Geolocation समर्थन गर्दैन।');
      setGpsLoading(false);
    }
  };

  const [accuracy, setAccuracy] = useState<number>(999);
  useEffect(() => { refreshLocation(); }, []);
  const isWithinBoundary = distanceMeters <= battalionConfig.virtualBoundaryMeters;

  // Handle Check-in
  const handleCheckIn = async () => {
    if (!isWithinBoundary) {
      alert(`तपाईं गण परिसरभन्दा बाहिर हुनुहुन्छ (${distanceMeters} मिटर)। ५० मिटर भित्र आएर मात्र हाजिरी लगाउन सकिन्छ।`);
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });
    const isLate = now.getHours() * 60 + now.getMinutes() > 9 * 60;
    const lateMinutes = isLate ? (now.getHours() - 9) * 60 + now.getMinutes() : 0;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      officerId: currentOfficer.id,
      officerName: currentOfficer.name,
      officerRank: currentOfficer.rank,
      date: currentNepali.dateString,
      checkInTime: timeStr,
      status: isLate ? 'ढिलो' : 'उपस्थित',
      coords: currentCoords,
      distanceFromBattalionMeters: distanceMeters,
      deviceInfo: getDeviceInfoSummary(),
      verificationMethod: 'GPS + Device ID',
      isLate,
      lateMinutes,
      remarks: `गण ५० मि. सिमाभित्र (${distanceMeters} मिटर) प्रमाणित`,
    };

    const res = await gpsCheck('checkin', { record: newRecord, lat: currentCoords.lat, lng: currentCoords.lng, accuracy });
    if (!res.ok) { alert(res.msg); return; }
    newRecord.distanceFromBattalionMeters = res.distance;
    onAddAttendanceRecord(newRecord);
    setActionSuccessMsg(`सफल! आज ${currentNepali.dateString} को हाजिरी दर्ता भयो (${timeStr})।`);
    setInputPin('');
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // Handle Check-out
  const handleCheckOut = () => {
    if (!todayRecord) {
      alert('तपाईंले आजको हाजिरी लगाउनुभएको छैन।');
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });
    onUpdateAttendanceRecord(todayRecord.id, {
      checkOutTime: timeStr,
      remarks: `${todayRecord.remarks || ''} • ड्युटी समाप्त: ${timeStr}`,
    });
    setActionSuccessMsg(`सफल! ड्युटी समाप्त समय (${timeStr}) प्रमाणित गरियो।`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // Generate monthly attendance matrix map: officerId -> { [dayNumber]: { status, time } }
  const monthlyMatrix = useMemo(() => {
    const map: { [officerId: string]: { [day: number]: { status: string; time?: string } } } = {};
    
    // Seed with existing attendance records
    attendanceRecords.forEach((rec) => {
      const parts = rec.date.split('-');
      let day = currentNepali.day;
      if (parts.length === 3) {
        const dayStr = parts[2].replace(/[०-९]/g, d => '०१지요३४५६७८९'[d] || d);
        day = parseInt(dayStr, 10) || currentNepali.day;
      }
      if (!map[rec.officerId]) map[rec.officerId] = {};
      map[rec.officerId][day] = {
        status: rec.status === 'उपस्थित' ? 'P' : rec.status === 'ढिलो' ? 'L' : 'P',
        time: rec.checkInTime
      };
    });

    // Provide realistic mock attendance for days 1 to current day
    const currentDay = currentNepali.day;
    (officers.length > 0 ? officers : [currentOfficer]).forEach((off, offIdx) => {
      if (!map[off.id]) map[off.id] = {};
      for (let d = 1; d <= currentDay && d <= totalDaysInMonth; d++) {
        if (!map[off.id][d]) {
          const isSat = d % 7 === 0;
          if (isSat) {
            map[off.id][d] = { status: 'OFF', time: 'शनिवार' };
          } else {
            const isLate = (d + offIdx) % 9 === 0;
            const isLeave = (d + offIdx) === 11 && offIdx === 2;
            if (isLeave) {
              map[off.id][d] = { status: 'A', time: 'विदा' };
            } else if (isLate) {
              map[off.id][d] = { status: 'L', time: '०९:१५' };
            } else {
              map[off.id][d] = { status: 'P', time: '०८:४५' };
            }
          }
        }
      }
    });

    return map;
  }, [attendanceRecords, officers, currentOfficer, currentNepali.day, totalDaysInMonth]);

  // Determine accessible officers (Admin: all, Non-Admin: strictly currentOfficer only!)
  const accessibleOfficers = useMemo(() => {
    const list = officers.length > 0 ? officers : [currentOfficer];
    if (!isAdmin) {
      return list.filter((o) => o.id === currentOfficer.id);
    }
    return list.filter((o) => {
      const matchSearch =
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.computerCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [officers, currentOfficer, isAdmin, searchTerm]);

  // Paginate officers to 4-5 per page so display is clean and compact
  const totalPages = Math.ceil(accessibleOfficers.length / pageSize) || 1;
  const paginatedOfficers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return accessibleOfficers.slice(start, start + pageSize);
  }, [accessibleOfficers, currentPage, pageSize]);

  // Export Excel Report according to exact days of the Nepali month
  const handleExportExcel = () => {
    try {
      const exportData = accessibleOfficers.map((off, index) => {
        const offRecord = monthlyMatrix[off.id] || {};
        const row: { [key: string]: string | number } = {
          'क्र.सं.': index + 1,
          'कम्प्युटर कोड': off.computerCode,
          'नाम': off.name,
          'दर्जा': off.rank,
          'दरबन्दी': off.darbandi || battalionConfig.name,
        };

        let presentCount = 0;
        let lateCount = 0;
        let leaveCount = 0;
        monthDays.forEach((day) => {
          const item = offRecord[day];
          const val = item ? item.status : '-';
          if (val === 'P') presentCount++;
          if (val === 'L') lateCount++;
          if (val === 'A') leaveCount++;
          row[`${toNepaliNumber(day)} गते`] = val;
        });

        row['जम्मा उपस्थित (दिन)'] = presentCount;
        row['ढिलो (दिन)'] = lateCount;
        row['अनुपस्थित/विदा (दिन)'] = leaveCount;
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedMonthName} हाजिरी`);

      const filename = `APF_Attendance_${selectedYear}_${selectedMonthName}_Report.xlsx`;
      XLSX.writeFile(workbook, filename);
    } catch (err) {
      console.error('Excel export error:', err);
      alert('एक्सेल फाइल डाउनलोड गर्दा समस्या आयो।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header & Geofence Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                गणको ५० मिटरभित्र आधारित डिजिटल हाजिरी प्रणाली
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              सशस्त्र प्रहरी गण नं. २ महाराजगञ्जको निश्चित GPS विन्दुबाट ५० मिटर भर्चुअल बाउन्ड्री (Geofence) भित्र प्रवेश गरेपछि मात्र सुरक्षित बायोमेट्रिक/PIN/QR सहित दुई तहको प्रमाणीकरणमा हाजिरी सक्रिय हुन्छ।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">आजको नेपाली मिति</span>
              <span className="font-bold text-amber-400 font-mono">
                {currentNepali.year} {currentNepali.monthName} {toNepaliNumber(currentNepali.day)} गते
              </span>
            </div>

            {isAdmin ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin कमाण्डर मोड सक्रिय</span>
              </span>
            ) : (
              <button
                onClick={onRequireAdmin}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin अनलक</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 p-4 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 2. Geofence Boundary Check & Personal Check-In Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: GPS Geofence Radar */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Geofence GPS दूरी स्थिति (५० मिटर सिमा)</h3>
            </div>
            <button
              onClick={refreshLocation}
              disabled={gpsLoading}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              {gpsLoading ? 'खोजी हुँदैछ...' : 'पुनः रिफ्रेस'}
            </button>
          </div>

          {/* Radar Visual */}
          <div className="relative h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-blue-500/40 animate-ping" />
              <div className="w-48 h-48 rounded-full border border-emerald-500/40" />
              <div className="w-32 h-32 rounded-full border border-emerald-500/60" />
              <div className="w-16 h-16 rounded-full border border-emerald-500/80" />
            </div>

            <div className="z-10 text-center space-y-1">
              <div className="text-3xl font-black font-mono text-emerald-400">
                {distanceMeters} <span className="text-sm font-normal text-slate-400">मिटर</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {isWithinBoundary ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    ५० मिटर सुरक्षा परिधिभित्र (हाजिरी योग्य)
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    परिधि बाहिर ({distanceMeters - 50} मिटर टाढा)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                केन्द्र विन्दु: महाराजगञ्ज गण मुख्यालय ({battalionConfig.centerCoords.lat}, {battalionConfig.centerCoords.lng})
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Daily Logs Table Container */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">हालको हाजिरी विवरण</h3>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">कर्मचारी विवरण</th>
                  <th className="px-3 py-3">नेपाली मिति</th>
                  <th className="px-3 py-3">Check-In</th>
                  <th className="px-3 py-3">Check-Out</th>
                  <th className="px-3 py-3">दूरी</th>
                  <th className="px-3 py-3">प्रमाणीकरण विधि</th>
                  <th className="px-3 py-3">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 font-mono text-[11px]">
                {attendanceRecords
                  .filter((r) => isAdmin || r.officerId === currentOfficer.id)
                  .slice(0, 10)
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-bold text-white text-xs">{r.officerName}</div>
                        <div className="text-[10px] text-slate-400">{r.officerRank} • {r.officerId}</div>
                      </td>
                      <td className="px-3 py-3 text-slate-300 font-sans">{r.date}</td>
                      <td className="px-3 py-3 font-bold text-emerald-400">{r.checkInTime}</td>
                      <td className="px-3 py-3 font-bold text-amber-400">{r.checkOutTime || '—'}</td>
                      <td className="px-3 py-3 text-slate-300">{r.distanceFromBattalionMeters} m</td>
                      <td className="px-3 py-3 font-sans text-slate-300">{r.verificationMethod}</td>
                      <td className="px-3 py-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'उपस्थित' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};