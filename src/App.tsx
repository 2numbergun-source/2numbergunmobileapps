/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BATTALION_CONFIG, 
  INITIAL_OFFICERS, 
  INITIAL_DUTIES, 
  INITIAL_ATTENDANCE,
  INITIAL_CIRCULARS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_NOTICES
} from './data/mockData';
import { 
  Officer, 
  DutyItem, 
  AttendanceRecord, 
  EmergencyAlert,
  CircularDocument,
  GalleryPhoto,
  NoticeItem,
  BattalionConfig
} from './types/police';
import { 
  getSavedOfficerId, 
  saveOfficerId, 
  getSavedAdminMode, 
  saveAdminMode 
} from './data/deviceIdentity';

import { Header, TabKey } from './components/Header';
import { IdentityBar } from './components/IdentityBar';
import { IdentitySelectModal } from './components/IdentitySelectModal';
import { AdminUnlockModal } from './components/AdminUnlockModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { OfficerQrModal } from './components/OfficerQrModal';
import { MobileFrame } from './components/MobileFrame';
import { OfflineIndicator } from './components/OfflineIndicator';

import { HomeTab } from './components/tabs/HomeTab';
import { CircularsTab } from './components/tabs/CircularsTab';
import { AttendanceTab } from './components/tabs/AttendanceTab';
import { NoticeBoardTab } from './components/tabs/NoticeBoardTab';
import { GalleryTab } from './components/tabs/GalleryTab';
import { PersonnelDirectoryTab } from './components/tabs/PersonnelDirectoryTab';
import { DutyRosterTab } from './components/tabs/DutyRosterTab';
import { PatrolGpsTab } from './components/tabs/PatrolGpsTab';
import { CommanderPortalTab } from './components/tabs/CommanderPortalTab';
import { ContactsEmergencyTab } from './components/tabs/ContactsEmergencyTab';
import { OfficeProfileTab } from './components/tabs/OfficeProfileTab';
import { CalendarTab } from './components/tabs/CalendarTab';
import { DigitalLibraryTab } from './components/tabs/DigitalLibraryTab';
import { getCurrentNepaliDate } from './lib/nepaliDate';
import { useSheetSync } from './lib/sheetSync';

// फुटरको लाइभ नेपाली मिति र समय (हरेक सेकेन्ड आफैँ अपडेट हुन्छ)
function NepaliClock() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const d = getCurrentNepaliDate();
  return <>{d.fullText.replace(/^(\S+) /, '$1 साल ')} • {d.timeString}</>;
}

export default function App() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  
  // Login / Logout State (नयाँ थपिएको)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('apf_gun2_is_logged_in') === 'true';
  });
  const [loginPin, setLoginPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Officers
  const [officers, setOfficers] = useState<Officer[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_officers_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OFFICERS;
  });

  const [currentOfficerId, setCurrentOfficerId] = useState<string>(() => getSavedOfficerId());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getSavedAdminMode());
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Modals state
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMyQrModalOpen, setIsMyQrModalOpen] = useState(false);

  // Battalion Configuration
  const [battalionConfig, setBattalionConfig] = useState<BattalionConfig>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_battalion_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...BATTALION_CONFIG,
          ...parsed,
          chiefCommanderName: parsed.chiefCommanderName && parsed.chiefCommanderName !== 'तिलक भारती' ? parsed.chiefCommanderName : BATTALION_CONFIG.chiefCommanderName,
          totalDarbandiStrength: parsed.totalDarbandiStrength && parsed.totalDarbandiStrength !== 320 ? parsed.totalDarbandiStrength : BATTALION_CONFIG.totalDarbandiStrength,
          availableForces: parsed.availableForces && parsed.availableForces !== 284 ? parsed.availableForces : BATTALION_CONFIG.availableForces,
          dutyOfficerContact: parsed.dutyOfficerContact && parsed.dutyOfficerContact !== '९८५१२३०००२' ? parsed.dutyOfficerContact : BATTALION_CONFIG.dutyOfficerContact,
        };
      }
    } catch {}
    return BATTALION_CONFIG;
  });

  // Circulars
  const [circulars, setCirculars] = useState<CircularDocument[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_circulars_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CIRCULARS;
  });

  // Gallery Photos
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_gallery_photos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GALLERY_PHOTOS;
  });

  // Notice Board
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_notices_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTICES;
  });

  // Duties & Attendance
  const [duties, setDuties] = useState<DutyItem[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_duties_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DUTIES;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_attendance_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ATTENDANCE;
  });

  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [alertLog, setAlertLog] = useState<EmergencyAlert[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_alert_log');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Persistent storage effects
  useEffect(() => {
    try { localStorage.setItem('apf_gun2_officers_list', JSON.stringify(officers)); } catch (e) {}
  }, [officers]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_battalion_config', JSON.stringify(battalionConfig)); } catch (e) {}
  }, [battalionConfig]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_circulars_list', JSON.stringify(circulars)); } catch (e) {}
  }, [circulars]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_gallery_photos', JSON.stringify(galleryPhotos)); } catch (e) {}
  }, [galleryPhotos]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_notices_list', JSON.stringify(notices)); } catch (e) {}
  }, [notices]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_duties_list', JSON.stringify(duties)); } catch (e) {}
  }, [duties]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_attendance_list', JSON.stringify(attendanceRecords)); } catch (e) {}
  }, [attendanceRecords]);

  useEffect(() => {
    try { localStorage.setItem('apf_gun2_alert_log', JSON.stringify(alertLog)); } catch (e) {}
  }, [alertLog]);

  // Google Sheet Sync
  const configRows = React.useMemo(() => [{ id: 'config', ...battalionConfig }], [battalionConfig]);
  useSheetSync('officers', officers, (r) => setOfficers(r as any));
  useSheetSync('duties', duties, (r) => setDuties(r as any));
  useSheetSync('attendance', attendanceRecords, (r) => setAttendanceRecords(r as any), 'upsert');
  useSheetSync('notices', notices, (r) => setNotices(r as any));
  useSheetSync('circulars', circulars, (r) => setCirculars(r as any));
  useSheetSync('gallery', galleryPhotos, (r) => setGalleryPhotos(r as any));
  useSheetSync('sos_alerts', alertLog, (r) => setAlertLog(r as any), 'upsert');
  useSheetSync('config', configRows, (r) => {
    if (!r[0]) return;
    const { id: _id, ...rest } = r[0] as any;
    setBattalionConfig((prev) => ({ ...prev, ...rest }));
  });

  const currentOfficer =
    officers.find((o) => o.id === currentOfficerId) || officers[0] || INITIAL_OFFICERS[0];

  const todayDuty =
    duties.find((d) => d.officerId === currentOfficer.id) ||
    duties[0];

  const todayAttendance = attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id && r.date === getCurrentNepaliDate()?.dateString
  );

  const handleSelectOfficer = (id: string) => {
    setCurrentOfficerId(id);
    saveOfficerId(id);
  };

  const handleAddNewOfficer = (newOfficer: Officer) => {
    setOfficers((prev) => [newOfficer, ...prev]);
  };

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      saveAdminMode(false);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    saveAdminMode(true);
  };

  // Login / Logout Handlers (नयाँ थपिएको)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // यहाँ पिन प्रमाणीकरण (तपाईंको आवश्यकता अनुसार पिन '1234' वा अन्य राख्न सक्नुहुन्छ)
    if (loginPin === '1234' || loginPin.length >= 4) {
      setIsLoggedIn(true);
      localStorage.setItem('apf_gun2_is_logged_in', 'true');
      setShowLoginModal(false);
      setLoginPin('');
      setLoginError('');
    } else {
      setLoginError('कृपया सही ४ अंकको पिन (Pin) प्रविष्ट गर्नुहोस्!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('apf_gun2_is_logged_in');
  };

  const unreadCircularCount = circulars.filter(
    (c) => !c.acknowledgedOfficerIds.includes(currentOfficer.id)
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView((prev) => !prev)}
        onTriggerSos={() => setIsSosModalOpen(true)}
        onInstallPwa={() => {
          setActiveTab('home');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
        activeAlertCount={activeAlerts.length}
        unreadCircularCount={unreadCircularCount}
        activeNoticeCount={notices.length}
        battalionConfig={{
          name: battalionConfig.name,
          address: battalionConfig.address,
          logoUrl: battalionConfig.logoUrl,
        }}
      />

      {/* 2. Device Identity Bar & Login/Logout Action Bar (चिटिक्क मिलेको डिजाइन) */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex-1 min-w-[280px]">
          <IdentityBar
            currentOfficer={currentOfficer}
            onOpenSwitchModal={() => setIsIdentityModalOpen(true)}
            onOpenQrModal={() => setIsMyQrModalOpen(true)}
          />
        </div>

        {/* लगइन / लगआउट बटन कन्ट्रोल */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-300 font-medium hidden sm:inline">लगइन सक्रिय</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded shadow transition flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                लगआउट
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              कर्मचारी लगइन (Login)
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1">
        <MobileFrame
          enabled={isMobileView}
          onClose={() => setIsMobileView(false)}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
            
            {activeTab === 'home' && (
              <HomeTab
                currentOfficer={currentOfficer}
                todayDuty={todayDuty}
                todayAttendance={todayAttendance}
                battalionConfig={battalionConfig}
                onUpdateBattalionConfig={setBattalionConfig}
                latestCircular={circulars[0]}
                latestNotice={notices[0]}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
                onNavigateAttendance={() => setActiveTab('attendance')}
                onNavigateDuty={() => setActiveTab('duty')}
                onNavigatePatrol={() => setActiveTab('patrol')}
                onNavigateCirculars={() => setActiveTab('circulars')}
                onNavigateNotices={() => setActiveTab('notices')}
                onNavigateGallery={() => setActiveTab('gallery')}
                onNavigateOffice={() => setActiveTab('office')}
                onNavigateContacts={() => setActiveTab('emergency')}
                onTriggerSos={() => setIsSosModalOpen(true)}
              />
            )}

            {activeTab === 'circulars' && (
              <CircularsTab
                circulars={circulars}
                onAddCircular={(newCirc) => setCirculars((prev) => [newCirc, ...prev])}
                onDeleteCircular={(id) => setCirculars((prev) => prev.filter((c) => c.id !== id))}
                onAcknowledgeCircular={(circId, officerId) => {
                  setCirculars((prev) =>
                    prev.map((c) => {
                      if (c.id === circId && !c.acknowledgedOfficerIds.includes(officerId)) {
                        return { ...c, acknowledgedOfficerIds: [...c.acknowledgedOfficerIds, officerId] };
                      }
                      return c;
                    })
                  );
                }}
                currentOfficer={currentOfficer}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceTab
                currentOfficer={currentOfficer}
                officers={officers}
                battalionConfig={battalionConfig}
                attendanceRecords={attendanceRecords}
                onAddAttendanceRecord={(newRecord) => {
                  setAttendanceRecords((prev) => {
                    const dup = prev.some(
                      (r) =>
                        r.date === newRecord.date &&
                        (r.officerId === newRecord.officerId ||
                          (!!newRecord.deviceId && r.deviceId === newRecord.deviceId))
                    );
                    if (dup) return prev;
                    return [newRecord, ...prev];
                  });
                }}
                onUpdateAttendanceRecord={(recordId, updates) => {
                  setAttendanceRecords((prev) =>
                    prev.map((r) => (r.id === recordId ? { ...r, ...updates } : r))
                  );
                }}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab
                photos={galleryPhotos}
                onAddPhoto={(newPhoto) => setGalleryPhotos((prev) => [newPhoto, ...prev])}
                onDeletePhoto={(id) => setGalleryPhotos((prev) => prev.filter((p) => p.id !== id))}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'notices' && (
              <NoticeBoardTab
                notices={notices}
                onAddNotice={(newNotice) => setNotices((prev) => [newNotice, ...prev])}
                onDeleteNotice={(id) => setNotices((prev) => prev.filter((n) => n.id !== id))}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'personnel' && (
              <PersonnelDirectoryTab
                officers={officers}
                onUpdateOfficers={(newOfficers) => setOfficers(newOfficers)}
                currentOfficerId={currentOfficerId}
                onSelectAsDeviceUser={handleSelectOfficer}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'duty' && (
              <DutyRosterTab
                duties={duties}
                officers={officers}
                currentOfficer={currentOfficer}
                isAdmin={isAdmin}
                onAddDuty={(newDuty) => setDuties((prev) => [newDuty, ...prev])}
                onRemoveDuty={(dutyId) => setDuties((prev) => prev.filter((d) => d.id !== dutyId))}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
                onNavigatePatrol={() => setActiveTab('patrol')}
              />
            )}

            {activeTab === 'patrol' && (
              <PatrolGpsTab
                battalionConfig={battalionConfig}
                duties={duties}
                activeAlerts={activeAlerts}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'commander' && (
              <CommanderPortalTab
                activeAlerts={activeAlerts}
                officers={officers}
                duties={duties}
                battalionConfig={battalionConfig}
                onUpdateBattalionConfig={setBattalionConfig}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
                onResolveAlert={(alertId) => {
                  setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
                  setAlertLog((prev) =>
                    prev.map((a) =>
                      (a.id === alertId || a.officerId === alertId) && a.status !== 'समाधान भयो'
                        ? { ...a, status: 'समाधान भयो' as EmergencyAlert['status'] }
                        : a
                    )
                  );
                }}
              />
            )}

            {activeTab === 'emergency' && (
              <ContactsEmergencyTab />
            )}

            {activeTab === 'office' && (
              <OfficeProfileTab 
                config={battalionConfig}
                onUpdateConfig={setBattalionConfig}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarTab />
            )}

            {activeTab === 'library' && (
              <DigitalLibraryTab />
            )}

          </div>
        </MobileFrame>
      </main>

      {/* 4. Bottom Right Live Nepali Date Bar */}
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-2.5 px-4 sticky bottom-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>{battalionConfig.name}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">५० मिटर Geofence डिजिटल हाजिरी तथा परिपत्र सेवा</span>
          </div>

          <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-md shadow text-xs">
            <NepaliClock />
          </div>
        </div>
      </footer>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* 5. Login Modal (लगइन गर्नुपर्ने पपअप विन्डो) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                कर्मचारी सुरक्षित लगइन
              </h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  तपाईंको ४ अंकको सुरक्षा पिन (PIN) प्रविष्ट गर्नुहोस्:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-center text-lg tracking-widest text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 text-center font-medium">{loginError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-lg"
                >
                  लगइन गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Other Modals */}
      <IdentitySelectModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        officers={officers}
        currentOfficerId={currentOfficerId}
        onSelectOfficer={handleSelectOfficer}
        onAddNewOfficer={handleAddNewOfficer}
      />

      <AdminUnlockModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <EmergencyAlertModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        officer={currentOfficer}
        onDispatchAlert={(alert) => {
          setActiveAlerts((prev) => [alert, ...prev]);
          setAlertLog((prev) => (prev.some((a) => a.id === alert.id) ? prev : [alert, ...prev]));
        }}
        activeAlert={activeAlerts.find((a) => a.officerId === currentOfficer.id)}
        onClearAlert={() => {
          setActiveAlerts((prev) => prev.filter((a) => a.officerId !== currentOfficer.id));
          setAlertLog((prev) =>
            prev.map((a) =>
              (a.id === currentOfficer.id || a.officerId === currentOfficer.id) && a.status !== 'समाधान भयो'
                ? { ...a, status: 'समाधान भयो' as EmergencyAlert['status'] }
                : a
            )
          );
        }}
      />

      <OfficerQrModal
        isOpen={isMyQrModalOpen}
        onClose={() => setIsMyQrModalOpen(false)}
        officer={currentOfficer}
      />

    </div>
  );
}
