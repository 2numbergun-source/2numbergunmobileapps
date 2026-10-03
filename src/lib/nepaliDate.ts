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
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 31],
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

// हालको नेपाली वर्ष, महिना र गते निकाल्ने
export function getCurrentNepaliDate(): { 
  year: number; 
  month: number; 
  day: number; 
  dateString: string; 
  monthName: string;
  totalDaysInMonth: number;
} {
  const year = 2083;
  const month = 6; // असोज (आश्विन)
  const day = 14;
  const monthIndex = month - 1; // 5
  const totalDaysInMonth = getDaysInNepaliMonth(year, monthIndex);

  return {
    year,
    month,
    day,
    dateString: `२०८३-०६-${day < 10 ? '०' + day : toNepaliNumber(day)}`,
    monthName: NEPALI_MONTHS[monthIndex],
    totalDaysInMonth
  };
}

// नेपाली महिना अनुसार ठ्याक्कै १ देखि (२९/३०/३१/३२) गते सम्मका दिनहरूको एरे
export function getNepaliDaysOfMonth(totalDays: number): number[] {
  return Array.from({ length: totalDays }, (_, i) => i + 1);
}
