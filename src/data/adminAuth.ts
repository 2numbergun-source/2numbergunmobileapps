// Admin पासवर्ड अब Google Apps Script (Script Properties) मा मात्र छ; क्लाइन्टमा छैन
export function getDefaultAdminHint(): string { return 'Admin पासवर्ड प्रविष्ट गर्नुहोस्'; }
export async function verifyAdminPin(pin: string): Promise<boolean> { const { login } = await import('../lib/cloud'); const j = await login({ pin, admin: true }); return !!j.ok; }
