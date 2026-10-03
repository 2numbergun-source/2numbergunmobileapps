// SVG and encoded visual assets for Armed Police Battalion No. 2 Maharajgunj

export const BATTALION_EMBLEM = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="crimson" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </linearGradient>
    <linearGradient id="darkNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <!-- Outer Gold Rim -->
  <circle cx="100" cy="100" r="94" fill="url(#crimson)" stroke="url(#gold)" stroke-width="8"/>
  <circle cx="100" cy="100" r="82" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  
  <!-- Crossed Khukuris -->
  <g transform="translate(100, 100)">
    <!-- Khukuri 1 -->
    <path d="M-40,30 C-25,10 -15,-20 0,-40 C-8,-25 -18,-5 -30,20 Z" fill="#475569" stroke="#0F172A" stroke-width="2"/>
    <rect x="-42" y="24" width="8" height="18" rx="2" fill="url(#gold)" transform="rotate(-30, -38, 33)"/>
    <!-- Khukuri 2 -->
    <path d="M40,30 C25,10 15,-20 0,-40 C8,-25 18,-5 30,20 Z" fill="#475569" stroke="#0F172A" stroke-width="2"/>
    <rect x="34" y="24" width="8" height="18" rx="2" fill="url(#gold)" transform="rotate(30, 38, 33)"/>
  </g>

  <!-- Police Star & Emblem -->
  <polygon points="100,42 108,60 128,62 112,74 118,92 100,80 82,92 88,74 72,62 92,60" fill="url(#gold)" stroke="#B45309" stroke-width="1.5"/>
  <circle cx="100" cy="69" r="7" fill="url(#crimson)"/>

  <!-- Battalion Badge Ribbon -->
  <path d="M35,135 Q100,165 165,135 L160,155 Q100,185 40,155 Z" fill="url(#darkNavy)" stroke="url(#gold)" stroke-width="2"/>
  <text x="100" y="148" font-family="sans-serif" font-weight="bold" font-size="11" fill="#FEF08A" text-anchor="middle" letter-spacing="1">सशस्त्र प्रहरी बल</text>
  <text x="100" y="125" font-family="sans-serif" font-weight="900" font-size="18" fill="#1E293B" text-anchor="middle">गण नं. २</text>
  <text x="100" y="172" font-family="sans-serif" font-weight="bold" font-size="9" fill="#047857" text-anchor="middle">महाराजगञ्ज, काठमाडौँ</text>
</svg>
`)}`;

export const BATTALION_BANNER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="800" height="320">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="mtnGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <linearGradient id="mtnGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="800" height="320" fill="url(#skyGrad)"/>
  
  <!-- Himalayan Peaks in background -->
  <polygon points="0,180 120,70 240,180" fill="url(#mtnGrad1)" opacity="0.6"/>
  <polygon points="180,180 320,50 480,180" fill="url(#mtnGrad1)" opacity="0.8"/>
  <polygon points="420,180 560,80 700,180" fill="url(#mtnGrad1)" opacity="0.7"/>
  <polygon points="620,180 740,100 800,160 800,180" fill="url(#mtnGrad1)" opacity="0.5"/>
  
  <!-- Dark Mountain Ridge -->
  <polygon points="0,220 180,130 360,220 540,140 720,210 800,170 800,320 0,320" fill="url(#mtnGrad2)"/>
  
  <!-- Parade Ground Grid / Formation Silhouettes -->
  <rect y="210" width="800" height="110" fill="#0f172a" opacity="0.95"/>
  <line x1="0" y1="210" x2="800" y2="210" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>

  <!-- Tactical Formation Troops -->
  <g fill="#1e293b" stroke="#334155" stroke-width="1">
    ${Array.from({ length: 18 })
      .map((_, i) => {
        const x = 70 + i * 38;
        return `
          <circle cx="${x}" cy="225" r="7" fill="#3b82f6"/>
          <path d="M${x - 8},234 L${x + 8},234 L${x + 6},265 L${x - 6},265 Z" fill="#1e3a8a"/>
          <line x1="${x - 3}" y1="265" x2="${x - 3}" y2="288" stroke="#cbd5e1" stroke-width="3"/>
          <line x1="${x + 3}" y1="265" x2="${x + 3}" y2="288" stroke="#cbd5e1" stroke-width="3"/>
          <path d="M${x - 8},222 Q${x},216 ${x + 9},222 Z" fill="#dc2626"/>
        `;
      })
      .join('')}
  </g>
  
  <!-- Text Overlay Badge -->
  <rect x="24" y="24" width="360" height="58" rx="8" fill="#020617" fill-opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="38" y="48" font-family="sans-serif" font-weight="bold" font-size="14" fill="#60a5fa">सशस्त्र प्रहरी बल, नेपाल</text>
  <text x="38" y="68" font-family="sans-serif" font-size="12" fill="#94a3b8">गण नं. २ महाराजगञ्ज • कमाण्ड हेडक्वार्टर</text>
</svg>
`)}`;

export const SAMPLE_CIRCULAR_IMAGE_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <rect width="600" height="800" fill="#fdfbf7" stroke="#cbd5e1" stroke-width="4"/>
  <rect x="20" y="20" width="560" height="760" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,2"/>
  
  <!-- Letterhead -->
  <text x="300" y="60" font-family="sans-serif" font-weight="bold" font-size="18" fill="#b91c1c" text-anchor="middle">नेपाल सरकार</text>
  <text x="300" y="85" font-family="sans-serif" font-weight="bold" font-size="20" fill="#0f172a" text-anchor="middle">प्रहरी प्रधान कार्यालय / तालुक कार्यालय</text>
  <text x="300" y="110" font-family="sans-serif" font-weight="medium" font-size="14" fill="#475569" text-anchor="middle">कार्य एवं अपराध अनुसन्धान विभाग, नक्साल, काठमाडौँ</text>
  <line x1="60" y1="125" x2="540" y2="125" stroke="#b91c1c" stroke-width="2"/>
  
  <text x="60" y="155" font-family="sans-serif" font-size="13" fill="#1e293b">प.सं.: ०८३/०८४-प्रशासन-११२</text>
  <text x="420" y="155" font-family="sans-serif" font-size="13" fill="#1e293b">मिति: २०८३/०६/१०</text>
  <text x="60" y="180" font-family="sans-serif" font-size="13" fill="#1e293b">चलानी नं.: ४४०९</text>
  
  <rect x="200" y="205" width="200" height="30" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="1"/>
  <text x="300" y="225" font-family="sans-serif" font-weight="bold" font-size="14" fill="#dc2626" text-anchor="middle">अति गोप्य / तुरुन्त कार्यान्वयन</text>
  
  <text x="300" y="275" font-family="sans-serif" font-weight="bold" font-size="16" fill="#0f172a" text-anchor="middle">विषय: काठमाडौँ उपत्यका चाडपर्व विशेष सुरक्षा सतर्कता तथा QRF स्ट्यान्डबाइ सम्बन्धमा।</text>
  
  <text x="60" y="320" font-family="sans-serif" font-size="14" fill="#334155">श्री सशस्त्र प्रहरी गण नं. २,</text>
  <text x="60" y="342" font-family="sans-serif" font-size="14" fill="#334155">महाराजगञ्ज, काठमाडौँ।</text>
  
  <foreignObject x="60" y="370" width="480" height="280">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:13px; line-height:1.7; color:#334155; text-align:justify;">
      प्रस्तुत विषयमा आसन्न चाडपर्वलाई लक्षित गरी काठमाडौँ उपत्यकाको संवेदनशील क्षेत्र, मुख्य व्यापारिक केन्द्र, बैंक तथा वित्तीय संस्था एवं चक्रपथ खण्डमा अवाञ्छित गतिविधि नियन्त्रण गर्न २४ सै घण्टा द्रुत प्रतिकार्य टोली (QRF) र मोबाइल गस्ती परिचालन गर्नुहुन निर्देशन गरिन्छ। गण मातहतका सम्पूर्ण अधिकृत तथा जवानहरूको विदा कटौती गरी शतप्रतिशत उपस्थिति कायम राख्न र डिजिटल हाजिरी नियमित गराउन यो परिपत्र जारी गरिएको छ।
    </div>
  </foreignObject>
  
  <!-- Stamp and Signature -->
  <circle cx="460" cy="680" r="35" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,2" opacity="0.8"/>
  <text x="460" y="675" font-family="sans-serif" font-size="9" fill="#2563eb" text-anchor="middle">प्रहरी प्रधान कार्यालय</text>
  <text x="460" y="690" font-family="sans-serif" font-size="9" fill="#2563eb" text-anchor="middle">काठमाडौँ, नेपाल</text>
  <path d="M420,720 Q450,700 480,725 Q510,710 520,730" fill="none" stroke="#1e3a8a" stroke-width="2"/>
  <text x="470" y="748" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0f172a" text-anchor="middle">(प्रहरी नायव महानिरीक्षक - DIGP)</text>
</svg>
`)}`;
