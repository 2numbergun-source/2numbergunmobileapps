import QRCode from 'qrcode';
import { Officer } from '../types/police';

export interface OfficerQrPayload {
  officerId: string;
  computerCode: string;
  sanketNo: string;
  name: string;
  rank: string;
  darbandi: string;
  companyOrTeam: string;
  bloodGroup: string;
  verifiedAt: string;
  authority: string;
}

export async function generateOfficerQrDataUrl(officer: Officer): Promise<string> {
  const payload: OfficerQrPayload = {
    officerId: officer.id,
    computerCode: officer.computerCode,
    sanketNo: officer.sanketNo || '—',
    name: officer.name,
    rank: officer.rank,
    darbandi: officer.darbandi,
    companyOrTeam: officer.companyOrTeam || officer.section || 'क कम्पनी',
    bloodGroup: officer.bloodGroup,
    verifiedAt: '२०८३/०६/१३',
    authority: 'सशस्त्र प्रहरी गण नं. २ महाराजगञ्ज',
  };

  const payloadString = JSON.stringify(payload);

  try {
    return await QRCode.toDataURL(payloadString, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate officer QR Code:', err);
    // Fallback minimal SVG data URL
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#ffffff" />
        <rect x="20" y="20" width="70" height="70" fill="#0f172a" />
        <rect x="210" y="20" width="70" height="70" fill="#0f172a" />
        <rect x="20" y="210" width="70" height="70" fill="#0f172a" />
        <text x="150" y="160" font-family="sans-serif" font-size="12" fill="#0f172a" text-anchor="middle">
          ${officer.computerCode}
        </text>
      </svg>
    `)}`;
  }
}
