import React, { useEffect, useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { login, loadAll, session, setCloudReady, startPolling } from '../lib/cloud';
import { INITIAL_OFFICERS } from '../data/mockData';
import type { Officer } from '../types/police';

const KEYS = ['apf_gun2_officers_list','apf_gun2_battalion_config','apf_gun2_circulars_list','apf_gun2_gallery_photos','apf_gun2_notices_list','apf_gun2_duties_list','apf_gun2_attendance_list'];

// कम्प्युटर कोड तुलना गर्दा: नेपाली अंक → अङ्ग्रेजी, खाली ठाउँ/उद्धरण हटाउने, ".0" हटाउने, ठूलो-सानो बेवास्ता
const norm = (v: unknown) =>
  String(v ?? '')
    .replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)))
    .replace(/[\u200B-\u200D\uFEFF\s]/g, '')
    .replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, '')
    .replace(/^(\d+)\.0+$/, '$1')
    .toLowerCase();

// कम्प्युटर कोडबाट कर्मचारी पहिचान गर्ने (यस फोनमा सुरक्षित सूची, नभए एपको आधारभूत सूची)
function findOfficerByCode(code: string): { officer?: Officer; ambiguous: boolean } {
  const wanted = norm(code);
  if (!wanted) return { ambiguous: false };
  const lists: Officer[][] = [];
  try {
    const saved = localStorage.getItem('apf_gun2_officers_list');
    if (saved) lists.push(JSON.parse(saved));
  } catch { /* सूची पढ्न सकिएन */ }
  lists.push(INITIAL_OFFICERS);
  for (const list of lists) {
    const hits = (list || []).filter((o) => norm(o.computerCode) && norm(o.computerCode) === wanted);
    if (hits.length === 1) return { officer: hits[0], ambiguous: false };
    // एउटै कोड दुई जनासँग भए गलत व्यक्तिको नाममा लगइन नहोस् भनेर रोक्ने
    if (hits.length > 1) return { ambiguous: true };
  }
  return { ambiguous: false };
}

export function LoginGate({ children }: { children: (v: number) => React.ReactNode }) {
  const [ok, setOk] = useState(() => {
    // पहिले लगइन गरिसकेको भए, एप खुल्नुअघि नै त्यही कर्मचारीको पहिचान सेट गर्ने
    const s = session();
    if (s.token && s.role === 'officer' && s.officerId) {
      try { localStorage.setItem('apf_gun2_saved_officer_id', s.officerId); } catch { /* ignore */ }
    }
    return !!s.token;
  });
  const [ver, setVer] = useState(0);
  const [user, setUser] = useState(''); const [pin, setPin] = useState(''); const [admin, setAdmin] = useState(false);
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);

  const sync = async () => {
    const j = await loadAll(KEYS); if (!j.ok) return false;
    let changed = false;
    KEYS.forEach((k) => { const v = j.data[k]; if (v == null) return; const n = JSON.stringify(v); if (localStorage.getItem(k) !== n) { localStorage.setItem(k, n); changed = true; } });
    const s = session();
    localStorage.setItem('apf_gun2_admin_mode_active', s.role === 'admin' ? 'true' : 'false');
    if (s.role === 'officer') localStorage.setItem('apf_gun2_saved_officer_id', s.officerId);
    if (changed) setVer((x) => x + 1);
    return true;
  };
  useEffect(() => { if (!ok) return; sync().then(setCloudReady); return session().role === 'officer' ? startPolling(sync) : undefined; }, [ok]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg('');
    try {
      const code = admin ? pin.trim() : user.trim();
      let params: { officerId?: string; pin: string; admin?: boolean };
      if (admin) {
        params = { pin: code, admin: true };
      } else {
        if (!code) { setMsg('कृपया युजरमा आफ्नो कम्प्युटर कोड प्रविष्ट गर्नुहोस्'); setBusy(false); return; }
        if (!pin.trim()) { setMsg('कृपया पासवर्डमा पनि आफ्नो कम्प्युटर कोड प्रविष्ट गर्नुहोस्'); setBusy(false); return; }
        if (norm(pin) !== norm(code)) { setMsg('पासवर्ड मिलेन! पासवर्डमा पनि उही कम्प्युटर कोड हाल्नुहोस्।'); setBusy(false); return; }
        // कम्प्युटर कोडबाट कर्मचारी पहिचान गरेर सर्भरमा जाँच (कर्मचारी ID अलग्गै हाल्नु पर्दैन)
        const { officer: off, ambiguous } = findOfficerByCode(code);
        if (ambiguous) { setMsg('यो कम्प्युटर कोड एकभन्दा बढी कर्मचारीसँग मिल्छ। कृपया Admin सँग सम्पर्क गर्नुहोस्।'); setBusy(false); return; }
        params = { officerId: off ? off.id : '', pin: off ? String(off.computerCode).trim() : code, admin: false };
      }
      const j = await login(params);
      if (j.ok) {
        try {
          if (j.role === 'officer' && j.officerId) localStorage.setItem('apf_gun2_saved_officer_id', j.officerId);
          localStorage.setItem('apf_gun2_admin_mode_active', j.role === 'admin' ? 'true' : 'false');
        } catch { /* ignore */ }
        setOk(true);
      } else setMsg(j.msg || 'कम्प्युटर कोड मिलेन');
    }
    catch { setMsg('इन्टरनेट वा सर्भर समस्या'); }
    setBusy(false);
  };
  const [hide, setHide] = useState(() => sessionStorage.getItem('apf_hide_install') === '1');
  const banner = !hide && (
    <div className="fixed bottom-2 inset-x-2 z-[100] max-w-md mx-auto">
      <button onClick={() => { sessionStorage.setItem('apf_hide_install', '1'); setHide(true); }} className="absolute -top-2 right-1 z-10 w-6 h-6 rounded-full bg-slate-700 text-white text-xs">✕</button>
      <PWAInstallButton />
    </div>
  );
  if (ok) return <>{children(ver)}{banner}</>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-5">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100">
        <h1 className="text-lg font-bold text-center">सशस्त्र प्रहरी गण नं. २</h1>
        <p className="text-xs text-center text-slate-400">{admin ? 'Admin पासवर्ड प्रविष्ट गरेर खोल्नुहोस्' : 'युजर र पासवर्ड दुवैमा कम्प्युटर कोड प्रविष्ट गरेर मात्र खोल्न सकिन्छ'}</p>
        {!admin && <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="युजर — आफ्नो कम्प्युटर कोड" autoComplete="username" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700" />}
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder={admin ? 'Admin पासवर्ड' : 'पासवर्ड — फेरि उही कम्प्युटर कोड'} autoComplete="current-password" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700" />
        {msg && <p className="text-xs text-red-400">{msg}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl bg-emerald-600 font-bold">{busy ? 'जाँच हुँदैछ…' : 'लगइन'}</button>
        <button type="button" onClick={() => { setAdmin(!admin); setPin(''); setMsg(''); }} className="w-full text-xs text-slate-400">{admin ? 'कर्मचारी लगइन' : 'Admin लगइन'}</button>
      </form>
      {banner}
    </div>
  );
}
