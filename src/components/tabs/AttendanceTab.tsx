import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin,
  CheckCircle2,
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
import { getDeviceInfoSummary, getDeviceId, getDeviceAttendanceOwner, markDeviceAttendance } from '../../data/deviceIdentity';
import {
  getCurrentNepaliDate,
  toNepaliNumber,
  getNepaliDaysOfMonth,
  getDaysInNepaliMonth,
  getWeekdayOfBsDate,
  parseNepaliDateString,
  NEPALI_MONTHS,
  NEPALI_WEEKDAYS
} from '../../lib/nepaliDate';

// ---------------------------------------------------------------------------
// स्थिरांकहरू (Constants)
// ---------------------------------------------------------------------------
const DUTY_START_MINUTES = 9 * 60; // बिहान ९:०० बजे ड्युटी सुरु
const NEPAL_TZ = 'Asia/Kathmandu';
const MAX_POSITION_AGE_MS = 30 * 1000; // ३० सेकेन्डभन्दा पुरानो GPS स्थान मान्य छैन
const PIN_MAX_ATTEMPTS = 5; // गलत PIN को अधिकतम प्रयास
const PIN_LOCK_MS = 60 * 1000; // सीमा नाघेपछि १ मिनेट लक
// गेटको QR मा लेखिने कोड। battalionConfig.qrToken सेट गरेर यसलाई गोप्य राख्नुहोस्।
const DEFAULT_QR_TOKEN = 'APF-GAN2-MAHARAJGUNJ-GATE';

type DayStatus = 'P' | 'L' | 'A' | 'OFF' | '-';

// मिति → तुलना गर्न मिल्ने अंक (YYYYMMDD)
const keyOfDate = (str: string): number => {
  const p = parseNepaliDateString(str);
  return p ? p.year * 10000 + p.month * 100 + p.day : 0;
};

// नेपाल समय (Asia/Kathmandu) अनुसार घण्टा र मिनेट — फोनको टाइमजोन फेरेर छल्न नसकियोस्
const getNepalClock = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: NEPAL_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return { h, m };
};

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
  const todayKey = keyOfDate(currentNepali.dateString);

  // Dynamic Nepali Year and Month Selection
  const [selectedYear, setSelectedYear] = useState<number>(currentNepali.year);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentNepali.month - 1);

  const totalDaysInMonth = useMemo(() => {
    return getDaysInNepaliMonth(selectedYear, selectedMonthIndex);
  }, [selectedYear, selectedMonthIndex]);

  const monthDays = useMemo(() => {
    return getNepaliDaysOfMonth(totalDaysInMonth);
  }, [totalDaysInMonth]);

  const selectedMonthName = NEPALI_MONTHS[selectedMonthIndex];

  // Geolocation & geofence state (वास्तविक GPS मात्र)
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: battalionConfig.centerCoords.lat,
    lng: battalionConfig.centerCoords.lng,
  });
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [gpsFixed, setGpsFixed] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Verification method state: GPS + PIN or GPS + QR
  const [verificationType, setVerificationType] = useState<'pin' | 'qr'>('pin');
  const [inputPin, setInputPin] = useState<string>('');
  const [pinAttempts, setPinAttempts] = useState<number>(0);
  const [pinLockedUntil, setPinLockedUntil] = useState<number>(0);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // QR स्क्यान (वास्तविक क्यामेरा + BarcodeDetector, नभए म्यानुअल कोड)
  const [qrVerified, setQrVerified] = useState<boolean>(false);
  const [qrScanning, setQrScanning] = useState<boolean>(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrManual, setQrManual] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const expectedQr: string = String((battalionConfig as any).qrToken || DEFAULT_QR_TOKEN);

  // Search & filter for ledger
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const [viewMode, setViewMode] = useState<'monthly-matrix' | 'daily-logs'>('daily-logs');
  const [selectedDay, setSelectedDay] = useState<number>(currentNepali.day);

  // Excel डाउनलोड (Admin मात्र)
  const [exportScope, setExportScope] = useState<'day' | 'month' | 'range'>('day');
  const [rangeFrom, setRangeFrom] = useState<{ month: number; day: number }>({ month: currentNepali.month - 1, day: 1 });
  const [rangeTo, setRangeTo] = useState<{ month: number; day: number }>({ month: currentNepali.month - 1, day: currentNepali.day });

  // Check today's record for current officer
  const todayRecord = attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id && r.date === currentNepali.dateString
  );

  // एक मोबाइल = एक कर्मचारी = दिनको एक हाजिरी
  const deviceOwnerToday = getDeviceAttendanceOwner(currentNepali.dateString);
  const deviceUsedByOther = !!deviceOwnerToday && deviceOwnerToday !== currentOfficer.id;
  const deviceOwnerName =
    (officers.find((o) => o.id === deviceOwnerToday)?.name) || 'अर्का कर्मचारी';
  const alreadyCheckedIn = !!todayRecord;
  const checkInBlocked = deviceUsedByOther || alreadyCheckedIn;

  // Recalculate distance whenever coords change
  useEffect(() => {
    const dist = calculateDistanceMeters(
      currentCoords.lat,
      currentCoords.lng,
      battalionConfig.centerCoords.lat,
      battalionConfig.centerCoords.lng
    );
    setDistanceMeters(Math.round(dist));
  }, [currentCoords, battalionConfig]);

  // वास्तविक GPS बाट ताजा स्थान लिने
  const getFreshPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('ब्राउजरले Geolocation समर्थन गर्दैन।'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });

  // Handle GPS location refresh
  const refreshLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    getFreshPosition()
      .then((pos) => {
        setCurrentCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsFixed(true);
        setGpsLoading(false);
      })
      .catch((err: any) => {
        setGpsFixed(false);
        setGpsError(
          err && err.code === 1
            ? 'GPS अनुमति दिइएको छैन। ब्राउजर/फोन सेटिङमा Location अनुमति दिनुहोस्।'
            : 'GPS सिग्नल प्राप्त हुन सकेन। खुला ठाउँमा गएर पुनः रिफ्रेस गर्नुहोस्।'
        );
        setGpsLoading(false);
      });
  };

  // पेज खुल्दा नै स्वचालित GPS खोज्ने
  useEffect(() => {
    refreshLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isWithinBoundary = gpsFixed && distanceMeters <= battalionConfig.virtualBoundaryMeters;

  // ---------------- QR स्क्यानर ----------------
  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setQrScanning(false);
  };

  const startScanner = async () => {
    setQrError(null);
    const BD = (window as any).BarcodeDetector;
    if (!BD || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setQrError('यो ब्राउजरले क्यामेरा QR स्क्यान समर्थन गर्दैन। तल QR कोड म्यानुअल प्रविष्ट गर्नुहोस्।');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setQrScanning(true);
    } catch {
      setQrError('क्यामेरा अनुमति दिइएको छैन। अनुमति दिनुहोस् वा QR कोड म्यानुअल प्रविष्ट गर्नुहोस्।');
    }
  };

  // स्क्यान सुरु भएपछि भिडियो जोड्ने र QR पढ्ने
  useEffect(() => {
    if (!qrScanning) return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    video.play().catch(() => {});

    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
    let busy = false;
    const timer = window.setInterval(async () => {
      if (busy || video.readyState < 2) return;
      busy = true;
      try {
        const codes = await detector.detect(video);
        if (codes && codes.length > 0) {
          const raw = String(codes[0].rawValue || '').trim();
          if (raw === expectedQr) {
            setQrVerified(true);
            setQrError(null);
            stopScanner();
          } else {
            setQrError('गलत QR कोड! गणको आधिकारिक गेट QR मात्र स्क्यान गर्नुहोस्।');
          }
        }
      } catch {
        /* पढ्न सकिएन, पुनः प्रयास हुन्छ */
      } finally {
        busy = false;
      }
    }, 400);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrScanning]);

  // कम्पोनेन्ट बन्द हुँदा क्यामेरा बन्द गर्ने
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleManualQr = () => {
    if (qrManual.trim() === expectedQr) {
      setQrVerified(true);
      setQrError(null);
    } else {
      setQrVerified(false);
      setQrError('गलत QR कोड! सही कोड प्रविष्ट गर्नुहोस्।');
    }
  };

  // Handle Check-in
  const handleCheckIn = async () => {
    if (alreadyCheckedIn) {
      alert('तपाईंले आजको हाजिरी पहिले नै लगाइसक्नुभएको छ।');
      return;
    }
    if (deviceUsedByOther) {
      alert(`यो मोबाइलबाट आजको हाजिरी ${deviceOwnerName} ले लगाइसकेको छ। एउटा मोबाइलबाट एक दिनमा एक जनाको मात्र हाजिरी लाग्छ। कृपया आफ्नै मोबाइल प्रयोग गर्नुहोस्।`);
      return;
    }

    // ---- दोस्रो तहको प्रमाणीकरण (PIN / QR) ----
    if (verificationType === 'pin') {
      if (Date.now() < pinLockedUntil) {
        const secs = Math.ceil((pinLockedUntil - Date.now()) / 1000);
        alert(`धेरै गलत प्रयास भयो। ${secs} सेकेन्डपछि पुनः प्रयास गर्नुहोस्।`);
        return;
      }
      const requiredPin = currentOfficer.pin;
      if (!requiredPin) {
        alert('तपाईंको हाजिरी PIN सेट गरिएको छैन। कृपया Admin सँग सम्पर्क गरी PIN सेट गर्नुहोस्।');
        return;
      }
      if (!/^\d{4}$/.test(inputPin) || inputPin !== String(requiredPin)) {
        const attempts = pinAttempts + 1;
        if (attempts >= PIN_MAX_ATTEMPTS) {
          setPinAttempts(0);
          setPinLockedUntil(Date.now() + PIN_LOCK_MS);
          alert('५ पटक गलत PIN प्रविष्ट भयो। १ मिनेटका लागि लक गरियो।');
        } else {
          setPinAttempts(attempts);
          alert(`गलत कर्मचारी पिन (PIN)! बाँकी प्रयास: ${PIN_MAX_ATTEMPTS - attempts}`);
        }
        return;
      }
      setPinAttempts(0);
    } else {
      if (!qrVerified) {
        alert('कृपया पहिला गणको QR कोड स्क्यान गर्नुहोस्।');
        return;
      }
    }

    // ---- हाजिरी लगाउने बेलामा फेरि ताजा GPS ले ५० मिटर जाँच ----
    let coords = currentCoords;
    let dist = distanceMeters;
    try {
      const pos = await getFreshPosition();
      if (Date.now() - pos.timestamp > MAX_POSITION_AGE_MS) {
        alert('GPS स्थान पुरानो छ। पुनः रिफ्रेस गरेर प्रयास गर्नुहोस्।');
        return;
      }
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      dist = Math.round(
        calculateDistanceMeters(
          coords.lat,
          coords.lng,
          battalionConfig.centerCoords.lat,
          battalionConfig.centerCoords.lng
        )
      );
      setCurrentCoords(coords);
      setDistanceMeters(dist);
      setGpsAccuracy(Math.round(pos.coords.accuracy));
      setGpsFixed(true);
      if (pos.coords.accuracy > battalionConfig.virtualBoundaryMeters) {
        alert(`GPS को सटीकता कमजोर छ (±${Math.round(pos.coords.accuracy)} मिटर)। खुला ठाउँमा गएर केही बेरपछि पुनः प्रयास गर्नुहोस्।`);
        return;
      }
    } catch {
      setGpsFixed(false);
      alert('वास्तविक GPS स्थान प्राप्त हुन सकेन। Location अनुमति दिएर पुनः प्रयास गर्नुहोस्। GPS बिना हाजिरी लाग्दैन।');
      return;
    }
    if (dist > battalionConfig.virtualBoundaryMeters) {
      alert(`तपाईं गण परिसरभन्दा बाहिर हुनुहुन्छ (${dist} मिटर)। ${battalionConfig.virtualBoundaryMeters} मिटर भित्र आएर मात्र हाजिरी लगाउन सकिन्छ।`);
      return;
    }

    // ---- समय र ढिलो गणना (नेपाल समय अनुसार, ९:०० बजेदेखि मिनेट गणना) ----
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit', timeZone: NEPAL_TZ });
    const { h, m } = getNepalClock();
    const minutesSinceMidnight = h * 60 + m;
    const lateMinutes = Math.max(0, minutesSinceMidnight - DUTY_START_MINUTES);
    const isLate = lateMinutes > 0;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      officerId: currentOfficer.id,
      officerName: currentOfficer.name,
      officerRank: currentOfficer.rank,
      date: currentNepali.dateString,
      checkInTime: timeStr,
      status: isLate ? 'ढिलो' : 'उपस्थित',
      coords,
      distanceFromBattalionMeters: dist,
      deviceInfo: getDeviceInfoSummary(),
      deviceId: getDeviceId(),
      verificationMethod: verificationType === 'pin' ? 'GPS + PIN' : 'GPS + QR',
      isLate,
      lateMinutes,
      remarks: `गण ${battalionConfig.virtualBoundaryMeters} मि. सिमाभित्र (${dist} मिटर) प्रमाणित`,
    };

    onAddAttendanceRecord(newRecord);
    markDeviceAttendance(currentNepali.dateString, currentOfficer.id);
    setActionSuccessMsg(`सफल! आज ${currentNepali.dateString} को हाजिरी दर्ता भयो (${timeStr})।`);
    setInputPin('');
    setQrVerified(false);
    setQrManual('');
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // Handle Check-out
  const handleCheckOut = () => {
    if (!todayRecord) {
      alert('तपाईंले आजको हाजिरी लगाउनुभएको छैन।');
      return;
    }
    const timeStr = new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit', timeZone: NEPAL_TZ });
    onUpdateAttendanceRecord(todayRecord.id, {
      checkOutTime: timeStr,
      remarks: `${todayRecord.remarks || ''} • ड्युटी समाप्त: ${timeStr}`,
    });
    setActionSuccessMsg(`सफल! ड्युटी समाप्त समय (${timeStr}) प्रमाणित गरियो।`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  // चयन गरिएको वर्ष/महिनाको मात्र हाजिरी: officerId -> { [day]: { status, time } }
  const monthlyMatrix = useMemo(() => {
    const map: { [officerId: string]: { [day: number]: { status: 'P' | 'L'; time?: string } } } = {};
    attendanceRecords.forEach((rec) => {
      const parsed = parseNepaliDateString(rec.date);
      if (!parsed) return;
      if (parsed.year !== selectedYear || parsed.month !== selectedMonthIndex + 1) return;
      if (!map[rec.officerId]) map[rec.officerId] = {};
      map[rec.officerId][parsed.day] = {
        status: rec.status === 'ढिलो' ? 'L' : 'P',
        time: rec.checkInTime,
      };
    });
    return map;
  }, [attendanceRecords, selectedYear, selectedMonthIndex]);

  // एउटा कर्मचारीको एक गतेको स्थिति:
  //  P = उपस्थित, L = ढिलो, A = कार्यदिनमा हाजिर नगरेको (बितेको मिति), OFF = शनिबार, - = आउने/आजको (बाँकी)
  const dayStatus = (officerId: string, day: number): DayStatus => {
    const item = monthlyMatrix[officerId]?.[day];
    if (item) return item.status;
    if (getWeekdayOfBsDate(selectedYear, selectedMonthIndex, day) === 6) return 'OFF';
    const key = selectedYear * 10000 + (selectedMonthIndex + 1) * 100 + day;
    if (key < todayKey) return 'A';
    return '-';
  };

  // Admin: सबै, अरू: आफ्नो मात्र
  const accessibleOfficers = useMemo(() => {
    const list = officers.length > 0 ? officers : [currentOfficer];
    if (!isAdmin) {
      return list.filter((o) => o.id === currentOfficer.id);
    }
    const q = searchTerm.toLowerCase();
    return list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.rank.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        (o.computerCode || '').toLowerCase().includes(q)
    );
  }, [officers, currentOfficer, isAdmin, searchTerm]);

  const totalPages = Math.ceil(accessibleOfficers.length / pageSize) || 1;
  const paginatedOfficers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return accessibleOfficers.slice(start, start + pageSize);
  }, [accessibleOfficers, currentPage, pageSize]);

  // खोज वा सूची घट्दा पेज सीमाभन्दा बाहिर नजाओस्
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // म्याट्रिक्सका पङ्क्ति (P / L / A को गणना सहित)
  const matrixRows = useMemo(() => {
    return paginatedOfficers.map((off) => {
      let p = 0;
      let l = 0;
      let a = 0;
      const cells = monthDays.map((day) => {
        const s = dayStatus(off.id, day);
        if (s === 'P') p++;
        else if (s === 'L') l++;
        else if (s === 'A') a++;
        return { day, status: s, time: monthlyMatrix[off.id]?.[day]?.time };
      });
      return { off, cells, p, l, a };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedOfficers, monthDays, monthlyMatrix, selectedYear, selectedMonthIndex, todayKey]);

  // ---- दैनिक हाजिरी (चयन गरिएको मितिको) ----
  const effectiveDay = Math.min(selectedDay, totalDaysInMonth);
  const selectedKey = selectedYear * 10000 + (selectedMonthIndex + 1) * 100 + effectiveDay;
  const selectedWeekday = getWeekdayOfBsDate(selectedYear, selectedMonthIndex, effectiveDay);

  const dailyRecords = useMemo(() => {
    return attendanceRecords
      .filter((r) => keyOfDate(r.date) === selectedKey && (isAdmin || r.officerId === currentOfficer.id))
      .slice()
      .sort((x, y) => String(x.checkInTime || '').localeCompare(String(y.checkInTime || '')));
  }, [attendanceRecords, selectedKey, isAdmin, currentOfficer.id]);

  // Admin: त्यो दिन हाजिर नगर्ने कर्मचारी (शनिबार र आउने मिति बाहेक)
  const absentOfficers = useMemo(() => {
    if (!isAdmin || selectedWeekday === 6 || selectedKey > todayKey) return [] as Officer[];
    return officers.filter(
      (o) => !attendanceRecords.some((r) => r.officerId === o.id && keyOfDate(r.date) === selectedKey)
    );
  }, [isAdmin, officers, attendanceRecords, selectedKey, todayKey, selectedWeekday]);

  const dailyPresentCount = dailyRecords.filter((r) => r.status === 'उपस्थित').length;
  const dailyLateCount = dailyRecords.filter((r) => r.status === 'ढिलो').length;

  // ---- Excel डाउनलोड: दैनिक वा मिति दायरा ----
  const handleExportLogExcel = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    try {
      const from = exportScope === 'day' ? { month: selectedMonthIndex, day: effectiveDay } : rangeFrom;
      const to = exportScope === 'day' ? { month: selectedMonthIndex, day: effectiveDay } : rangeTo;
      const fromKey = selectedYear * 10000 + (from.month + 1) * 100 + from.day;
      const toKey = selectedYear * 10000 + (to.month + 1) * 100 + to.day;
      if (fromKey > toKey) {
        alert('सुरु मिति अन्त्य मितिभन्दा पछाडि छ। मिति मिलाउनुहोस्।');
        return;
      }

      const codeOf = (id: string) => officers.find((o) => o.id === id)?.computerCode || '';

      const inRange = attendanceRecords
        .filter((r) => {
          const k = keyOfDate(r.date);
          return k >= fromKey && k <= toKey;
        })
        .slice()
        .sort(
          (x, y) =>
            keyOfDate(x.date) - keyOfDate(y.date) ||
            String(x.checkInTime || '').localeCompare(String(y.checkInTime || ''))
        );

      const rows: { [key: string]: string | number }[] = inRange.map((r, i) => ({
        'क्र.सं.': i + 1,
        'नेपाली मिति': r.date,
        'कम्प्युटर कोड': codeOf(r.officerId),
        'नाम': r.officerName,
        'दर्जा': r.officerRank,
        'Check-In': r.checkInTime || '',
        'Check-Out': r.checkOutTime || '',
        'स्थिति': r.status,
        'ढिलो (मिनेट)': r.lateMinutes || 0,
        'दूरी (मिटर)': r.distanceFromBattalionMeters ?? '',
        'प्रमाणीकरण': r.verificationMethod || '',
        'कैफियत': r.remarks || '',
      }));

      // दैनिक डाउनलोडमा हाजिर नगर्नेहरू पनि थप्ने
      if (exportScope === 'day' && selectedWeekday !== 6 && selectedKey <= todayKey) {
        absentOfficers.forEach((o) => {
          rows.push({
            'क्र.सं.': rows.length + 1,
            'नेपाली मिति': `${toNepaliNumber(selectedYear)}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(effectiveDay).padStart(2, '0')}`,
            'कम्प्युटर कोड': o.computerCode || '',
            'नाम': o.name,
            'दर्जा': o.rank,
            'Check-In': '',
            'Check-Out': '',
            'स्थिति': 'हाजिर गरेको छैन',
            'ढिलो (मिनेट)': '',
            'दूरी (मिटर)': '',
            'प्रमाणीकरण': '',
            'कैफियत': '',
          });
        });
      }

      if (rows.length === 0) {
        alert('यो अवधिमा कुनै हाजिरी रेकर्ड छैन।');
        return;
      }

      const pad = (n: number) => String(n).padStart(2, '0');
      const label =
        fromKey === toKey
          ? `${selectedYear}-${pad(from.month + 1)}-${pad(from.day)}`
          : `${selectedYear}-${pad(from.month + 1)}-${pad(from.day)}_to_${pad(to.month + 1)}-${pad(to.day)}`;

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = [6, 14, 14, 24, 16, 10, 10, 16, 12, 12, 14, 40].map((w) => ({ wch: w }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'हाजिरी');
      XLSX.writeFile(workbook, `APF_Attendance_${label}.xlsx`);
    } catch (err) {
      console.error('Excel export error:', err);
      alert('एक्सेल फाइल डाउनलोड गर्दा समस्या आयो।');
    }
  };

  // Excel: महिनाभरको म्याट्रिक्स (सबै कर्मचारी, खोजीबाट प्रभावित हुँदैन)
  const handleExportExcel = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    try {
      const allOfficers = officers.length > 0 ? officers : [currentOfficer];
      const exportData = allOfficers.map((off, index) => {
        const row: { [key: string]: string | number } = {
          'क्र.सं.': index + 1,
          'कम्प्युटर कोड': off.computerCode,
          'नाम': off.name,
          'दर्जा': off.rank,
          'दरबन्दी': off.darbandi || battalionConfig.name,
        };

        let presentCount = 0;
        let lateCount = 0;
        let absentCount = 0;
        monthDays.forEach((day) => {
          const s = dayStatus(off.id, day);
          if (s === 'P') presentCount++;
          else if (s === 'L') lateCount++;
          else if (s === 'A') absentCount++;
          row[`${toNepaliNumber(day)} गते`] = s === 'OFF' ? 'शनि' : s;
        });

        row['जम्मा उपस्थित (दिन)'] = presentCount;
        row['ढिलो (दिन)'] = lateCount;
        row['अनुपस्थित (दिन)'] = absentCount;
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedMonthName} हाजिरी`);
      XLSX.writeFile(workbook, `APF_Attendance_${selectedYear}_${selectedMonthName}_Report.xlsx`);
    } catch (err) {
      console.error('Excel export error:', err);
      alert('एक्सेल फाइल डाउनलोड गर्दा समस्या आयो।');
    }
  };

  // Excel बटनले चयन गरिएको प्रकार अनुसार डाउनलोड गर्छ
  const handleDownload = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    if (exportScope === 'month') handleExportExcel();
    else handleExportLogExcel();
  };

  // मिति दायरा छनोटको सानो चयनकर्ता (महिना + गते)
  const renderDatePick = (
    val: { month: number; day: number },
    setVal: (v: { month: number; day: number }) => void
  ) => {
    const dim = getDaysInNepaliMonth(selectedYear, val.month);
    return (
      <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
        <select
          value={val.month}
          onChange={(e) => {
            const m = Number(e.target.value);
            setVal({ month: m, day: Math.min(val.day, getDaysInNepaliMonth(selectedYear, m)) });
          }}
          className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
        >
          {NEPALI_MONTHS.map((mName, idx) => (
            <option key={mName} value={idx} className="bg-slate-900 text-white">{mName}</option>
          ))}
        </select>
        <select
          value={Math.min(val.day, dim)}
          onChange={(e) => setVal({ month: val.month, day: Number(e.target.value) })}
          className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
        >
          {getNepaliDaysOfMonth(dim).map((d) => (
            <option key={d} value={d} className="bg-slate-900 text-white">{toNepaliNumber(d)}</option>
          ))}
        </select>
      </span>
    );
  };

  const pinLocked = Date.now() < pinLockedUntil;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* 1. Header & Geofence Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                गणको {toNepaliNumber(battalionConfig.virtualBoundaryMeters)} मिटरभित्र आधारित डिजिटल हाजिरी प्रणाली
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              सशस्त्र प्रहरी गण नं. २ महाराजगञ्जको निश्चित GPS विन्दुबाट {toNepaliNumber(battalionConfig.virtualBoundaryMeters)} मिटर भर्चुअल बाउन्ड्री (Geofence) भित्र प्रवेश गरेपछि मात्र PIN वा QR सहितको दुई तहको प्रमाणीकरणमा हाजिरी सक्रिय हुन्छ।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px]">आजको नेपाली मिति</span>
              <span className="font-bold text-amber-400 font-mono">
                {toNepaliNumber(currentNepali.year)} {currentNepali.monthName} {toNepaliNumber(currentNepali.day)} गते, {currentNepali.weekdayName}
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
              <h3 className="text-sm font-bold text-white">
                Geofence GPS दूरी स्थिति ({toNepaliNumber(battalionConfig.virtualBoundaryMeters)} मिटर सिमा)
              </h3>
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
                {gpsFixed ? distanceMeters : '—'} <span className="text-sm font-normal text-slate-400">मिटर</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {!gpsFixed ? (
                  <span className="text-amber-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {gpsLoading ? 'वास्तविक GPS स्थान खोजिँदैछ...' : 'GPS स्थान प्राप्त भएको छैन (हाजिरी लाग्दैन)'}
                  </span>
                ) : isWithinBoundary ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {toNepaliNumber(battalionConfig.virtualBoundaryMeters)} मिटर सुरक्षा परिधिभित्र (हाजिरी योग्य)
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    परिधि बाहिर ({distanceMeters - battalionConfig.virtualBoundaryMeters} मिटर टाढा) — हाजिरी लाग्दैन
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                केन्द्र विन्दु: महाराजगञ्ज गण मुख्यालय ({battalionConfig.centerCoords.lat}, {battalionConfig.centerCoords.lng})
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span>वास्तविक GPS मात्र ({toNepaliNumber(battalionConfig.virtualBoundaryMeters)} मि. नियम कडा)</span>
            <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${gpsFixed ? 'bg-emerald-900/70 text-emerald-200' : 'bg-red-900/80 text-red-200 border border-red-700'}`}>
              {gpsFixed ? `GPS प्राप्त${gpsAccuracy !== null ? ` (±${gpsAccuracy} मि.)` : ''}` : 'GPS छैन'}
            </span>
          </div>
          {gpsError && (
            <div className="bg-red-950/70 border border-red-500/50 p-2.5 rounded-lg text-[11px] text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Check-In / Check-Out Controls */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">कर्मचारी हाजिरी प्रमाणीकरण (Attendance Action)</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{currentOfficer.name}</span>
            </div>

            {/* Verification Method: PIN or QR */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  stopScanner();
                  setVerificationType('pin');
                }}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  verificationType === 'pin'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>कर्मचारी PIN</span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationType('qr')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  verificationType === 'qr'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>गेट QR कोड स्क्यान</span>
              </button>
            </div>

            {verificationType === 'pin' ? (
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  आफ्नो ४ अंकको सुरक्षा पिन प्रविष्ट गर्नुहोस्:
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  disabled={pinLocked}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono tracking-widest text-center disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500">
                  * आफ्नो व्यक्तिगत कर्मचारी हाजिरी पिन प्रविष्ट गर्नुहोस्।
                  {pinAttempts > 0 && ` (गलत प्रयास: ${pinAttempts}/${PIN_MAX_ATTEMPTS})`}
                </p>
                {!currentOfficer.pin && (
                  <p className="text-[11px] text-amber-400">
                    * तपाईंको PIN सेट छैन। Admin सँग सम्पर्क गर्नुहोस्।
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <p className="text-xs text-slate-300">
                  गणको मुख्य गेटमा राखिएको आधिकारिक QR कोड स्क्यान गर्नुहोस्
                </p>

                {qrScanning && (
                  <div className="space-y-2">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full max-h-48 rounded-lg border border-slate-700 bg-black object-cover"
                    />
                    <button
                      type="button"
                      onClick={stopScanner}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700 cursor-pointer"
                    >
                      स्क्यान रोक्नुहोस्
                    </button>
                  </div>
                )}

                {!qrScanning && (
                  <button
                    type="button"
                    onClick={startScanner}
                    disabled={qrVerified}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      qrVerified
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700'
                    }`}
                  >
                    {qrVerified ? '✓ QR कोड प्रमाणित भयो!' : 'क्यामेराबाट QR स्क्यान गर्नुहोस्'}
                  </button>
                )}

                {!qrVerified && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="वा QR कोड म्यानुअल प्रविष्ट गर्नुहोस्"
                      value={qrManual}
                      onChange={(e) => setQrManual(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleManualQr}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                    >
                      जाँच
                    </button>
                  </div>
                )}

                {qrError && (
                  <p className="text-[11px] text-red-300 flex items-start gap-1 text-left">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{qrError}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {deviceUsedByOther && (
            <div className="bg-red-950/70 border border-red-500/50 p-2.5 rounded-lg text-[11px] text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>यो मोबाइलबाट आजको हाजिरी {deviceOwnerName} ले लगाइसकेको छ। एउटा मोबाइलबाट दिनमा एक जनाको मात्र हाजिरी लाग्छ।</span>
            </div>
          )}
          {alreadyCheckedIn && !deviceUsedByOther && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-lg text-[11px] text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>तपाईंको आजको हाजिरी दर्ता भइसकेको छ ({todayRecord?.checkInTime})।</span>
            </div>
          )}

          {/* Action Buttons: 🟢 Check-in & 🔴 Check-out */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCheckIn}
              disabled={!isWithinBoundary || checkInBlocked}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                isWithinBoundary && !checkInBlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-70'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>🟢 हाजिरी सुरु (Check-in)</span>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!todayRecord || !!todayRecord.checkOutTime}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                todayRecord && !todayRecord.checkOutTime
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 cursor-pointer shadow'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>🔴 ड्युटी समाप्त / Check-out</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. सम्पूर्ण कर्मचारी हाजिरी विवरण तथा लग (Battalion Attendance Ledger) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">

        {/* Top Header of Ledger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                सम्पूर्ण कर्मचारी हाजिरी विवरण तथा लग (Battalion Attendance Ledger)
              </h3>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Admin अनलक (सबै कर्मचारी दृश्य)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
                  आफ्नो मात्र व्यक्तिगत हाजिरी
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAdmin
                ? `नेपाली क्यालेन्डर अनुसार: ${toNepaliNumber(selectedYear)} ${selectedMonthName} (कुल ${toNepaliNumber(totalDaysInMonth)} गते) • प्रत्येक कर्मचारीको एउटै लाइनमा (प्रति पेज ${pageSize} जना)।`
                : `तपाईंको आफ्नो व्यक्तिगत महिनाभरको हाजिरी विवरण (${selectedMonthName} महिना - कुल ${toNepaliNumber(totalDaysInMonth)} गते)।`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Nepali Month Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-400 text-[11px]">महिना:</span>
              <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                {NEPALI_MONTHS.map((mName, idx) => (
                  <option key={mName} value={idx} className="bg-slate-900 text-white">
                    {mName} ({getDaysInNepaliMonth(selectedYear, idx)} दिन)
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setViewMode('monthly-matrix')}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  viewMode === 'monthly-matrix'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                १-{toNepaliNumber(totalDaysInMonth)} गते म्याट्रिक्स
              </button>
              <button
                onClick={() => setViewMode('daily-logs')}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  viewMode === 'daily-logs'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                दैनिक लग
              </button>
            </div>

            {isAdmin ? (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer"
                title="चयन गरिएको अवधिको हाजिरी एक्सेलमा डाउनलोड गर्नुहोस्"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel डाउनलोड</span>
              </button>
            ) : (
              <button
                onClick={onRequireAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin लगइन</span>
              </button>
            )}
          </div>
        </div>

        {/* Excel डाउनलोड प्यानल (Admin मात्र) */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950 border border-slate-800 rounded-xl p-3">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Excel डाउनलोड (Admin)
            </span>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value as 'day' | 'month' | 'range')}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-amber-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="day">दैनिक (चयन गरिएको गते)</option>
              <option value="month">महिनाभरको (म्याट्रिक्स)</option>
              <option value="range">मिति दायरा (देखि – सम्म)</option>
            </select>
            {exportScope === 'day' && (
              <span className="text-slate-400">
                {toNepaliNumber(selectedYear)} {NEPALI_MONTHS[selectedMonthIndex]} {toNepaliNumber(effectiveDay)} गते
              </span>
            )}
            {exportScope === 'month' && (
              <span className="text-slate-400">{toNepaliNumber(selectedYear)} {selectedMonthName} (सबै कर्मचारी)</span>
            )}
            {exportScope === 'range' && (
              <>
                <span className="text-slate-400">देखि</span>
                {renderDatePick(rangeFrom, setRangeFrom)}
                <span className="text-slate-400">सम्म</span>
                {renderDatePick(rangeTo, setRangeTo)}
              </>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow cursor-pointer"
            >
              डाउनलोड
            </button>
          </div>
        )}

        {/* Search bar & Attendance Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {isAdmin ? (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="कर्मचारी नाम, दर्जा, कोड खोजी..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="text-slate-400">
              प्रहरी कर्मचारी: <strong className="text-white">{currentOfficer.rank} {currentOfficer.name}</strong> ({currentOfficer.computerCode})
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-emerald-600 text-white font-bold inline-flex items-center justify-center text-[10px]">P</span>
              <span>उपस्थित</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-amber-600 text-white font-bold inline-flex items-center justify-center text-[10px]">L</span>
              <span>ढिलो</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-red-800 text-white font-bold inline-flex items-center justify-center text-[10px]">A</span>
              <span>अनुपस्थित (हाजिर नगरेको)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 font-bold inline-flex items-center justify-center text-[10px]">-</span>
              <span>शनिवार/बाँकी</span>
            </span>
          </div>
        </div>

        {/* 4. Monthly Attendance Matrix */}
        {viewMode === 'monthly-matrix' ? (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5 sticky left-0 z-20 bg-slate-900 border-r border-slate-800 min-w-[190px]">
                      कर्मचारी विवरण ({selectedMonthName})
                    </th>
                    {monthDays.map((day) => {
                      const isToday = day === currentNepali.day && selectedMonthIndex === (currentNepali.month - 1) && selectedYear === currentNepali.year;
                      const isSat = getWeekdayOfBsDate(selectedYear, selectedMonthIndex, day) === 6;
                      return (
                        <th
                          key={day}
                          className={`px-1.5 py-2 text-center font-mono min-w-[28px] border-r border-slate-800/60 ${
                            isToday ? 'bg-blue-900/60 text-white font-bold' : isSat ? 'text-red-400 bg-slate-950/40' : ''
                          }`}
                          title={`${day} गते`}
                        >
                          <div className="text-[10px]">{toNepaliNumber(day)}</div>
                        </th>
                      );
                    })}
                    <th className="px-2 py-2 text-center text-emerald-400 font-bold min-w-[40px]" title="कुल उपस्थित दिन">
                      P
                    </th>
                    <th className="px-2 py-2 text-center text-amber-400 font-bold min-w-[40px]" title="कुल ढिलो दिन">
                      L
                    </th>
                    <th className="px-2 py-2 text-center text-red-400 font-bold min-w-[40px]" title="कुल अनुपस्थित दिन">
                      A
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono text-[11px]">
                  {matrixRows.length > 0 ? (
                    matrixRows.map(({ off, cells, p, l, a }) => (
                      <tr key={off.id} className="hover:bg-slate-900/60 transition group">
                        <td className="px-3 py-2.5 font-sans sticky left-0 z-10 bg-slate-950 group-hover:bg-slate-900/90 border-r border-slate-800">
                          <div className="font-bold text-white text-xs truncate max-w-[170px]" title={off.name}>
                            {off.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                            {off.rank} • {off.computerCode || off.id}
                          </div>
                        </td>

                        {cells.map(({ day, status, time }) => {
                          const isToday =
                            selectedMonthIndex === (currentNepali.month - 1) &&
                            selectedYear === currentNepali.year &&
                            day === currentNepali.day;
                          return (
                            <td
                              key={day}
                              className={`px-1 py-1.5 text-center border-r border-slate-800/40 text-[10px] ${
                                isToday ? 'bg-blue-950/40 font-bold' : ''
                              }`}
                              title={`${off.name}: ${day} गते ${time || status}`}
                            >
                              {status === 'P' && (
                                <span className="w-5 h-5 rounded bg-emerald-600/90 text-white font-bold inline-flex items-center justify-center">P</span>
                              )}
                              {status === 'L' && (
                                <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold inline-flex items-center justify-center">L</span>
                              )}
                              {status === 'A' && (
                                <span className="w-5 h-5 rounded bg-red-800 text-white font-bold inline-flex items-center justify-center">A</span>
                              )}
                              {status === 'OFF' && (
                                <span className="text-red-400/80 text-[9px] font-sans">शनि</span>
                              )}
                              {status === '-' && <span className="text-slate-600">-</span>}
                            </td>
                          );
                        })}

                        <td className="px-2 py-2 text-center font-bold text-emerald-400 bg-emerald-950/20">{p}</td>
                        <td className="px-2 py-2 text-center font-bold text-amber-400 bg-amber-950/20">{l}</td>
                        <td className="px-2 py-2 text-center font-bold text-red-400 bg-red-950/20">{a}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={totalDaysInMonth + 4} className="px-4 py-8 text-center text-slate-500 font-sans">
                        कुनै पनि कर्मचारीको हाजिरी विवरण फेला परेन।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-1">
              <div>
                देखाउँदै: <strong>{paginatedOfficers.length}</strong> / <strong>{accessibleOfficers.length}</strong> जना
                (प्रति पेज {pageSize} जना)
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    title="अघिल्लो पेज"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 font-mono text-white bg-slate-950 rounded-lg border border-slate-800">
                    पेज {toNepaliNumber(currentPage)} / {toNepaliNumber(totalPages)}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    title="पछिल्लो पेज"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* दैनिक हाजिरी */
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
                <span className="text-slate-400 text-[11px]">गते:</span>
                <select
                  value={effectiveDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
                >
                  {monthDays.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">{toNepaliNumber(d)}</option>
                  ))}
                </select>
                <span className="text-slate-300 font-semibold">
                  {selectedMonthName} {toNepaliNumber(selectedYear)} • {NEPALI_WEEKDAYS[selectedWeekday]}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedYear(currentNepali.year);
                  setSelectedMonthIndex(currentNepali.month - 1);
                  setSelectedDay(currentNepali.day);
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                आजको हाजिरी
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2 text-[11px] font-semibold">
                  <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40">उपस्थित: {toNepaliNumber(dailyPresentCount)}</span>
                  <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40">ढिलो: {toNepaliNumber(dailyLateCount)}</span>
                  <span className="px-2 py-1 rounded-lg bg-red-950 text-red-300 border border-red-500/40">हाजिर नगरेका: {toNepaliNumber(absentOfficers.length)}</span>
                </div>
              )}
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
                  {dailyRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-bold text-white text-xs">{r.officerName}</div>
                        <div className="text-[10px] text-slate-400">{r.officerRank} • {r.officerId}</div>
                      </td>
                      <td className="px-3 py-3 text-slate-300 font-sans">{r.date}</td>
                      <td className="px-3 py-3 font-bold text-emerald-400">
                        {r.checkInTime}
                        {r.isLate && r.lateMinutes ? (
                          <span className="ml-1 text-[10px] font-normal text-amber-400">(+{r.lateMinutes} मि.)</span>
                        ) : null}
                      </td>
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

                  {isAdmin && absentOfficers.map((o) => (
                    <tr key={`absent-${o.id}`} className="bg-red-950/10">
                      <td className="px-4 py-3 font-sans">
                        <div className="font-bold text-white text-xs">{o.name}</div>
                        <div className="text-[10px] text-slate-400">{o.rank} • {o.computerCode || o.id}</div>
                      </td>
                      <td className="px-3 py-3 text-slate-500 font-sans">—</td>
                      <td className="px-3 py-3 text-slate-600">—</td>
                      <td className="px-3 py-3 text-slate-600">—</td>
                      <td className="px-3 py-3 text-slate-600">—</td>
                      <td className="px-3 py-3 text-slate-600">—</td>
                      <td className="px-3 py-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/40">
                          हाजिर गरेको छैन
                        </span>
                      </td>
                    </tr>
                  ))}

                  {dailyRecords.length === 0 && absentOfficers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-sans">
                        {isAdmin ? 'यो मितिमा कुनै हाजिरी रेकर्ड छैन।' : 'तपाईंको यो मितिमा हाजिरी रेकर्ड छैन।'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isAdmin && (
              <p className="text-[11px] text-slate-500">
                * सबै कर्मचारीको हाजिरी हेर्न र Excel डाउनलोड गर्न Admin अनलक गर्नुहोस्।
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
