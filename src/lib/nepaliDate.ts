// नेपाली विक्रम संवत् (BS) क्यालेन्डर क्याल्कुलेटर तथा महिनाका गतेहरूको यकिन विवरण

export const NEPALI_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज (आश्विन)', 
  'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const NEPALI_NUMBERS: { [key: string]: string } = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

export function toNepaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => NEPALI_NUMBERS[digit] || digit);
}

// विक्रम संवत् २०८० देखि २०८५ सम्म प्रत्येक महिनाका वास्तविक दिन संख्या (Days in BS Months)
// बैशाख देखि चैत सम्मका १२ महिनाका आधिकारिक दिनहरू
export const BS_MONTH_DAYS: { [year: number]: number[] } = {
  2080: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2085: [31, 32, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
};

// दिइएको नेपाली वर्ष र महिनाको कुल गते संख्या निकाल्ने (जस्तै: असोज = ३०, साउन = ३१, असार = ३२ आदि)
export function getDaysInNepaliMonth(year: number = 2083, monthIndex: number = 5): number {
  const yearData = BS_MONTH_DAYS[year] || BS_MONTH_DAYS[2083];
  // monthIndex: 0 = बैशाख, 5 = असोज
  const days = yearData[monthIndex] || 30;
  return days;
}

// मिति देखाउनका लागि महिनाका छोटा नाम (असोज = आश्विन)
export const NEPALI_MONTHS_DISPLAY = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'
];

export const NEPALI_WEEKDAYS = [
  'आइतवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'बिहीवार', 'शुक्रवार', 'शनिवार'
];

// तालिकामा भएका वर्ष मात्र प्रयोग गर्ने (नभए नजिकको वर्षको ढाँचा)
function getBsYearData(year: number): number[] {
  if (BS_MONTH_DAYS[year]) return BS_MONTH_DAYS[year];
  const years = Object.keys(BS_MONTH_DAYS).map(Number);
  return BS_MONTH_DAYS[year < years[0] ? years[0] : years[years.length - 1]];
}

// आधार मिति: वि.सं. २०८३ बैशाख १ = २०२६ अप्रिल १४ (ई.सं.)
const BS_ANCHOR_YEAR = 2083;
const BS_ANCHOR_UTC = Date.UTC(2026, 3, 14);
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // नेपाल समय UTC+५:४५

const pad2 = (n: number) => (n < 10 ? '०' + toNepaliNumber(n) : toNepaliNumber(n));

// समय नेपालको घडी अनुसार (फोनको टाइमजोन जे भए पनि)
export function getNepaliTimeString(now: Date = new Date()): string {
  const np = new Date(now.getTime() + NEPAL_OFFSET_MS);
  const h24 = np.getUTCHours();
  const m = np.getUTCMinutes();
  const s = np.getUTCSeconds();
  const period = h24 < 4 ? 'राति' : h24 < 12 ? 'बिहान' : h24 < 16 ? 'दिउँसो' : h24 < 19 ? 'साँझ' : 'राति';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${period} ${pad2(h12)}:${pad2(m)}:${pad2(s)}`;
}

// हालको नेपाली वर्ष, महिना र गते स्वचालित रूपमा निकाल्ने (नेपाल समय अनुसार)
export function getCurrentNepaliDate(now: Date = new Date()): { 
  year: number; 
  month: number; 
  day: number; 
  dateString: string; 
  monthName: string;
  totalDaysInMonth: number;
  weekdayName: string;
  fullText: string;
  timeString: string;
} {
  const np = new Date(now.getTime() + NEPAL_OFFSET_MS);
  const todayUtc = Date.UTC(np.getUTCFullYear(), np.getUTCMonth(), np.getUTCDate());
  let diff = Math.round((todayUtc - BS_ANCHOR_UTC) / 86400000); // आधार मितिदेखि बितेका दिन

  let year = BS_ANCHOR_YEAR;
  let monthIndex = 0;
  let day = 1;

  if (diff >= 0) {
    while (true) {
      const md = getBsYearData(year)[monthIndex];
      if (diff < md - (day - 1)) { day += diff; break; }
      diff -= md - (day - 1);
      day = 1;
      monthIndex++;
      if (monthIndex === 12) { monthIndex = 0; year++; }
    }
  } else {
    while (diff < 0) {
      if (day + diff >= 1) { day += diff; diff = 0; break; }
      diff += day;
      monthIndex--;
      if (monthIndex < 0) { monthIndex = 11; year--; }
      day = getBsYearData(year)[monthIndex];
    }
  }

  const month = monthIndex + 1;
  const totalDaysInMonth = getDaysInNepaliMonth(year, monthIndex);
  const weekdayName = NEPALI_WEEKDAYS[np.getUTCDay()];

  return {
    year,
    month,
    day,
    dateString: `${toNepaliNumber(year)}-${pad2(month)}-${pad2(day)}`,
    monthName: NEPALI_MONTHS[monthIndex],
    totalDaysInMonth,
    weekdayName,
    fullText: `${toNepaliNumber(year)} ${NEPALI_MONTHS_DISPLAY[monthIndex]} ${toNepaliNumber(day)} गते, ${weekdayName}`,
    timeString: getNepaliTimeString(now),
  };
}

// नेपाली महिना अनुसार ठ्याक्कै १ देखि (२९/३०/३१/३२) गते सम्मका दिनहरूको एरे
export function getNepaliDaysOfMonth(totalDays: number): number[] {
  return Array.from({ length: totalDays }, (_, i) => i + 1);
}

// वि.सं. मितिबाट हप्ताको वार निकाल्ने (० = आइतवार ... ६ = शनिवार)
export function getWeekdayOfBsDate(year: number, monthIndex: number, day: number): number {
  let offset = 0;
  if (year >= BS_ANCHOR_YEAR) {
    for (let y = BS_ANCHOR_YEAR; y < year; y++) {
      offset += getBsYearData(y).reduce((a, b) => a + b, 0);
    }
  } else {
    for (let y = year; y < BS_ANCHOR_YEAR; y++) {
      offset -= getBsYearData(y).reduce((a, b) => a + b, 0);
    }
  }
  const months = getBsYearData(year);
  for (let m = 0; m < monthIndex; m++) offset += months[m];
  offset += day - 1;
  return new Date(BS_ANCHOR_UTC + offset * 86400000).getUTCDay();
}

// "२०८३-०६-१३" जस्ता मितिको अक्षर (नेपाली/अङ्ग्रेजी अंक दुवै) लाई {year, month, day} मा बदल्ने
export function parseNepaliDateString(
  str: string
): { year: number; month: number; day: number } | null {
  if (!str) return null;
  const ascii = String(str).replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)));
  const m = ascii.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 32) return null;
  return { year, month, day };
}
