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
import { getSavedOfficerId, saveOfficerId } from './data/deviceIdentity';
import * as cloud from './lib/cloud';

import { Header, TabKey } from './components/Header';
import { IdentityBar } from './components/IdentityBar';
import { IdentitySelectModal } from './components/IdentitySelectModal';
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
import { useSosSiren } from './lib/sosSiren';

// फुटरको लाइभ नेपाली मिति र समय
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
  
  // Officers
  const [officers, setOfficers] = useState<Officer[]>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_officers_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OFFICERS;
  });

  // बाहिरको LoginGate बाट भएको लगइनको आधारमा पहिचान तथा Admin अवस्था तय हुन्छ
  const loginSession: any = cloud.session();
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(() =>
    loginSession.role === 'officer' && loginSession.officerId ? loginSession.officerId : getSavedOfficerId()
  );
  // कर्मचारी लगइन भएको छ भने पहिचान सधैं उसकै कम्प्युटर कोडको कर्मचारी मात्र हुन्छ (बदल्न मिल्दैन)
  const currentOfficerId: string =
    loginSession.role === 'officer' && loginSession.officerId ? loginSession.officerId : selectedOfficerId;
  const isAdmin: boolean = loginSession.role === 'admin';
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Modals state
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
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

  // Sheet बाट आएका सक्रिय SOS सबै उपकरणमा देखाउने
  useEffect(() => {
    setActiveAlerts(alertLog.filter((a) => a.status !== 'समाधान भयो'));
  }, [alertLog]);

  // अर्को कर्मचारीको नयाँ SOS आउँदा साइरन, कम्पन र सूचना (एप खुला हुँदा मात्र)
  useSosSiren(activeAlerts, currentOfficerId);

  const currentOfficer =
    officers.find((o) => o.id === currentOfficerId) || officers[0] || INITIAL_OFFICERS[0];

  const todayDuty =
    duties.find((d) => d.officerId === currentOfficer.id) ||
    duties[0];

  const todayAttendance = attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id && r.date === getCurrentNepaliDate()?.dateString
  );

  // पहिचान बदल्ने सुविधा Admin का लागि मात्र; कर्मचारीले अर्काको नाम चयन गर्न सक्दैन
  const handleSelectOfficer = (id: string) => {
    if (!isAdmin) return;
    setSelectedOfficerId(id);
    saveOfficerId(id);
  };

  // नयाँ कर्मचारी थप्ने काम पनि Admin का लागि मात्र
  const handleAddNewOfficer = (newOfficer: Officer) => {
    if (!isAdmin) return;
    setOfficers((prev) => [newOfficer, ...prev]);
  };

  const handleOpenSwitchModal = () => {
    if (!isAdmin) {
      alert('पहिचान बदल्ने सुविधा Admin का लागि मात्र हो। तपाईं आफ्नै कम्प्युटर कोडबाट लगइन हुनुभएको छ।');
      return;
    }
    setIsIdentityModalOpen(true);
  };

  // Admin हक नभएको कर्मचारीले Admin-मात्र सुविधा थिच्दा सूचना
  const requireAdmin = () => {
    alert('यो सुविधा Admin लगइनबाट मात्र खुल्छ।');
  };

  const handleToggleAdmin = () => {
    if (!isAdmin) requireAdmin();
  };

  // लगआउट: कर्मचारी र Admin दुवैका लागि
  const handleLogout = () => {
    try { (cloud as any).logout?.(); } catch {}
    try {
      [localStorage, sessionStorage].forEach((st) => {
        Object.keys(st)
          .filter((k) => /token|session/i.test(k))
          .forEach((k) => st.removeItem(k));
      });
      localStorage.removeItem('apf_gun2_admin_mode_active');
      localStorage.removeItem('apf_gun2_saved_officer_id');
      localStorage.removeItem('apf_gun2_is_logged_in');
    } catch {}
    window.location.reload();
  };

  const unreadCircularCount = circulars.filter(
    (c) => !c.acknowledgedOfficerIds.includes(currentOfficer.id)
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Top Header (सार्न नपर्ने गरी एकै नजरमा देखिने चिटिक्कको मेनु) */}
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

      {/* 2. Device Identity Bar & Login/Logout Control (Compact layout) */}
      <div className="bg-slate-900 border-b border-slate-800 px-2 sm:px-6 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
        <div className="w-full sm:w-auto flex-1">
          <IdentityBar
            currentOfficer={currentOfficer}
            onOpenSwitchModal={handleOpenSwitchModal}
            onOpenQrModal={() => setIsMyQrModalOpen(true)}
          />
        </div>

        {/* लगइन स्थिति तथा लगआउट बटन */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-emerald-300 font-semibold">
              {isAdmin ? 'Admin (लगइन)' : `${currentOfficer.rank} ${currentOfficer.name} (लगइन)`}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded transition flex items-center gap-1 ml-1"
            >
              लगआउट
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1">
        <MobileFrame
          enabled={isMobileView}
          onClose={() => setIsMobileView(false)}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4">

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
                onRequireAdmin={requireAdmin}
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
                onRequireAdmin={requireAdmin}
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
                onRequireAdmin={requireAdmin}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab
                photos={galleryPhotos}
                onAddPhoto={(newPhoto) => setGalleryPhotos((prev) => [newPhoto, ...prev])}
                onDeletePhoto={(id) => setGalleryPhotos((prev) => prev.filter((p) => p.id !== id))}
                isAdmin={isAdmin}
                onRequireAdmin={requireAdmin}
              />
            )}

            {activeTab === 'notices' && (
              <NoticeBoardTab
                notices={notices}
                onAddNotice={(newNotice) => setNotices((prev) => [newNotice, ...prev])}
                onDeleteNotice={(id) => setNotices((prev) => prev.filter((n) => n.id !== id))}
                isAdmin={isAdmin}
                onRequireAdmin={requireAdmin}
              />
            )}

            {activeTab === 'personnel' && (
              <PersonnelDirectoryTab
                officers={officers}
                onUpdateOfficers={(newOfficers) => setOfficers(newOfficers)}
                currentOfficerId={currentOfficerId}
                onSelectAsDeviceUser={handleSelectOfficer}
                isAdmin={isAdmin}
                onRequireAdmin={requireAdmin}
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
                onRequireAdmin={requireAdmin}
                onNavigatePatrol={() => setActiveTab('patrol')}
              />
            )}

            {activeTab === 'patrol' && (
              <PatrolGpsTab
                battalionConfig={battalionConfig}
                duties={duties}
                activeAlerts={activeAlerts}
                isAdmin={isAdmin}
                onRequireAdmin={requireAdmin}
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
                onRequireAdmin={requireAdmin}
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
                onRequireAdmin={requireAdmin}
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
      <footer className="bg-slate-900/90 border-t border-slate-800 text-xs text-slate-400 py-2 px-4 sticky bottom-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>{battalionConfig.name}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">५० मिटर Geofence डिजिटल हाजिरी तथा परिपत्र सेवा</span>
          </div>

          <div className="bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded shadow text-xs">
            <NepaliClock />
          </div>
        </div>
      </footer>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* 6. Other Modals */}
      <IdentitySelectModal
        isOpen={isAdmin && isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        officers={officers}
        currentOfficerId={currentOfficerId}
        onSelectOfficer={handleSelectOfficer}
        onAddNewOfficer={handleAddNewOfficer}
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
