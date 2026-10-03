import React, { useEffect, useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { login, loadAll, session, setCloudReady, startPolling } from '../lib/cloud';

const KEYS = ['apf_gun2_officers_list','apf_gun2_battalion_config','apf_gun2_circulars_list','apf_gun2_gallery_photos','apf_gun2_notices_list','apf_gun2_duties_list','apf_gun2_attendance_list'];

export function LoginGate({ children }: { children: (v: number) => React.ReactNode }) {
  const [ok, setOk] = useState(!!session().token);
  const [ver, setVer] = useState(0);
  const [id, setId] = useState(''); const [pin, setPin] = useState(''); const [admin, setAdmin] = useState(false);
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
    try { const j = await login({ officerId: id.trim(), pin: pin.trim(), admin }); if (j.ok) setOk(true); else setMsg(j.msg); }
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
        <p className="text-xs text-center text-slate-400">कम्प्युटर कोड प्रविष्ट गरेर मात्र खोल्न सकिन्छ</p>
        {!admin && <input value={id} onChange={(e) => setId(e.target.value)} placeholder="कर्मचारी ID (जस्तै officer-01)" className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700" />}
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder={admin ? 'Admin पासवर्ड' : 'व्यक्तिगत कम्प्युटर कोड'} className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700" />
        {msg && <p className="text-xs text-red-400">{msg}</p>}
        <button disabled={busy} className="w-full py-3 rounded-xl bg-emerald-600 font-bold">{busy ? 'जाँच हुँदैछ…' : 'लगइन'}</button>
        <button type="button" onClick={() => setAdmin(!admin)} className="w-full text-xs text-slate-400">{admin ? 'कर्मचारी लगइन' : 'Admin लगइन'}</button>
      </form>
      {banner}
    </div>
  );
}
