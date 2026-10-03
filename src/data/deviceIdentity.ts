const STORAGE_KEY_IDENTITY = 'apf_gun2_saved_officer_id';
const STORAGE_KEY_ADMIN_STATE = 'apf_gun2_admin_mode_active';

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
