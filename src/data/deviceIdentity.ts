const STORAGE_KEY_IDENTITY = 'apf_gun2_saved_officer_id';
const STORAGE_KEY_ADMIN_STATE = 'apf_gun2_admin_mode_active';
const STORAGE_KEY_DEVICE_ID = 'apf_gun2_device_id';
const STORAGE_KEY_DEVICE_ATTENDANCE = 'apf_gun2_device_attendance';

export function getSavedOfficerId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_IDENTITY);
    if (saved) return saved;
  } catch {
    // fallback
  }
  // Default officer: 'officer-01' (बैकुण्ठ सुवेदी)
  return 'officer-01';
}

export function saveOfficerId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_IDENTITY, id);
  } catch (e) {
    console.error('Failed to save officer id:', e);
  }
}

export function getSavedAdminMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_STATE) === 'true';
  } catch {
    return false;
  }
}

export function saveAdminMode(active: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_STATE, active ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save admin state:', e);
  }
}

export function getDeviceInfoSummary(): string {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let deviceName = 'Android / Mobile Terminal';
  if (/iPhone/i.test(ua)) deviceName = 'Apple iPhone (iOS Terminal)';
  else if (/iPad/i.test(ua)) deviceName = 'Apple iPad Police MDT';
  else if (/Samsung/i.test(ua)) deviceName = 'Samsung Knox Secure Handset';
  else if (/Xiaomi|Redmi/i.test(ua)) deviceName = 'Redmi / Xiaomi Terminal';
  else if (/Macintosh/i.test(ua)) deviceName = 'Command Workstation (macOS)';
  else if (/Windows/i.test(ua)) deviceName = 'Command Center PC (Windows)';
  else if (/Linux/i.test(ua)) deviceName = 'Linux Secure Tactical Console';
  return `${deviceName} • App v2.5 (GPS v4)`;
}

// ---------------------------------------------------------------------------
// हाजिरीका लागि डिभाइस पहिचान
// नियम: एक मोबाइल = एक कर्मचारी = दिनको एक हाजिरी
// ---------------------------------------------------------------------------

// यस डिभाइसको अद्वितीय ID (पहिलो पटक बनाएर सुरक्षित गरिन्छ)
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
    if (!id) {
      const random =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2);
      id = `dev-${random}`;
      localStorage.setItem(STORAGE_KEY_DEVICE_ID, id);
    }
    return id;
  } catch {
    return 'dev-unknown';
  }
}

function readDeviceAttendanceMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEVICE_ATTENDANCE);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

// यो मोबाइलबाट त्यस मितिमा हाजिरी लगाउने कर्मचारीको ID (नलगाएको भए null)
export function getDeviceAttendanceOwner(date: string): string | null {
  return readDeviceAttendanceMap()[date] || null;
}

// यो मोबाइलबाट त्यस मितिमा यो कर्मचारीले हाजिरी लगायो भनेर सम्झने
export function markDeviceAttendance(date: string, officerId: string): void {
  try {
    const map = readDeviceAttendanceMap();
    map[date] = officerId;
    // पुराना मिति मेटाएर पछिल्ला ६० दिन मात्र राख्ने
    const keys = Object.keys(map).sort();
    keys.slice(0, Math.max(0, keys.length - 60)).forEach((k) => delete map[k]);
    localStorage.setItem(STORAGE_KEY_DEVICE_ATTENDANCE, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save device attendance:', e);
  }
}
