/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { cloudSet } from './lib/cloud';

// localStorage बाट सूची पढ्ने सुरक्षित तरिका (डाटा बिग्रिएको वा सूची नभए पूर्वनिर्धारित प्रयोग गर्छ)
function loadList<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as T[];
    }
  } catch {
    // fallback
  }
  return fallback;
}

// Admin ले परिवर्तन गर्दा Google Sheet मा बचत गर्ने (पहिलो रेन्डरमा नबचाउने)
function useCloudSave(key: string, value: unknown) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    cloudSet(key, value);
  }, [key, value]);
}

export default function App() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  
  // Officers
  const [officers, setOfficers] = useState<Officer[]>(() =>
    loadList<Officer>('apf_gun2_officers_list', INITIAL_OFFICERS)
  );

  const [currentOfficerId, setCurrentOfficerId] = useState<string>(() => getSavedOfficerId());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getSavedAdminMode());
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Modals state
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMyQrModalOpen, setIsMyQrModalOpen] = useState(false);

  // Battalion Configuration (Editable by Admin)
  const [battalionConfig, setBattalionConfig] = useState<BattalionConfig>(() => {
    try {
      const saved = localStorage.getItem('apf_gun2_battalion_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          // Merge with BATTALION_CONFIG to guarantee fresh commander & darbandi if not explicitly customized
          return {
            ...BATTALION_CONFIG,
            ...parsed,
            chiefCommanderName: parsed.chiefCommanderName && parsed.chiefCommanderName !== 'तिलक भारती' ? parsed.chiefCommanderName : BATTALION_CONFIG.chiefCommanderName,
            totalDarbandiStrength: parsed.totalDarbandiStrength && parsed.totalDarbandiStrength !== 320 ? parsed.totalDarbandiStrength : BATTALION_CONFIG.totalDarbandiStrength,
            availableForces: parsed.availableForces && parsed.availableForces !== 284 ? parsed.availableForces : BATTALION_CONFIG.availableForces,
            dutyOfficerContact: parsed.dutyOfficerContact && parsed.dutyOfficerContact !== '९८५१२३०००२' ? parsed.dutyOfficerContact : BATTALION_CONFIG.dutyOfficerContact,
          };
        }
      }
    } catch {
      // fallback
    }
    return BATTALION_CONFIG;
  });

  // Circulars (तालुक कार्यालयका परिपत्रहरू)
  const [circulars, setCirculars] = useState<CircularDocument[]>(() =>
    loadList<CircularDocument>('apf_gun2_circulars_list', INITIAL_CIRCULARS)
  );

  // Gallery Photos (कार्यालय फोटो ग्यालरी)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() =>
    loadList<GalleryPhoto>('apf_gun2_gallery_photos', INITIAL_GALLERY_PHOTOS)
  );

  // Notice Board (सूचना पाटी)
  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    loadList<NoticeItem>('apf_gun2_notices_list', INITIAL_NOTICES)
  );

  // Duties & Attendance
  const [duties, setDuties] = useState<DutyItem[]>(() =>
    loadList<DutyItem>('apf_gun2_duties_list', INITIAL_DUTIES)
  );

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() =>
    loadList<AttendanceRecord>('apf_gun2_attendance_list', INITIAL_ATTENDANCE)
  );

  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);

  // SOS अलर्टको इतिहास (यो उपकरणमा मात्र राखिन्छ)
  const [alertLog, setAlertLog] = useState<EmergencyAlert[]>(() =>
    loadList<EmergencyAlert>('apf_gun2_alert_log', [])
  );

  // परिवर्तन: localStorage मा राख्ने + Admin भए Google Sheet मा पठाउने (cloudSet ले दुवै गर्छ)
  useCloudSave('apf_gun2_officers_list', officers);
  useCloudSave('apf_gun2_battalion_config', battalionConfig);
  useCloudSave('apf_gun2_circulars_list', circulars);
  useCloudSave('apf_gun2_gallery_photos', galleryPhotos);
  useCloudSave('apf_gun2_notices_list', notices);
  useCloudSave('apf_gun2_duties_list', duties);
  useCloudSave('apf_gun2_attendance_list', attendanceRecords);

  useEffect(() => {
    try {
      localStorage.setItem('apf_gun2_alert_log', JSON.stringify(alertLog));
    } catch (e) {
      console.warn(e);
    }
  }, [alertLog]);

  // Current active officer object
  const currentOfficer =
    officers.find((o) => o.id === currentOfficerId) || officers[0] || INITIAL_OFFICERS[0];

  // Today's duty assigned to this officer
  const todayDuty =
    duties.find((d) => d.officerId === currentOfficer.id) ||
    duties[0];

  // Today's attendance record
  const todayAttendance = attendanceRecords.find(
    (r) => r.officerId === currentOfficer.id && r.date === getCurrentNepaliDate().dateString
  );

  // Switch identity
  const handleSelectOfficer = (id: string) => {
    setCurrentOfficerId(id);
    saveOfficerId(id);
  };

  const handleAddNewOfficer = (newOfficer: Officer) => {
    setOfficers((prev) => [newOfficer, ...prev]);
  };

  // Toggle Admin Mode
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

  // Circulars management
  const handleAddCircular = (newCirc: CircularDocument) => {
    setCirculars((prev) => [newCirc, ...prev]);
  };

  const handleDeleteCircular = (id: string) => {
    setCirculars((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAcknowledgeCircular = (circId: string, officerId: string) => {
    setCirculars((prev) =>
      prev.map((c) => {
        const acked = c.acknowledgedOfficerIds || [];
        if (c.id === circId && !acked.includes(officerId)) {
          return { ...c, acknowledgedOfficerIds: [...acked, officerId] };
        }
        return c;
      })
    );
  };

  // Gallery management
  const handleAddPhoto = (newPhoto: GalleryPhoto) => {
    setGalleryPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    setGalleryPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Notice board management
  const handleAddNotice = (newNotice: NoticeItem) => {
    setNotices((prev) => [newNotice, ...prev]);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Duties management
  const handleAddDuty = (newDuty: DutyItem) => {
    setDuties((prev) => [newDuty, ...prev]);
  };

  const handleRemoveDuty = (dutyId: string) => {
    setDuties((prev) => prev.filter((d) => d.id !== dutyId));
  };

  // Attendance management
  const handleAddAttendanceRecord = (newRecord: AttendanceRecord) => {
    setAttendanceRecords((prev) => {
      // एउटै कर्मचारीको एक दिनमा एक हाजिरी र एउटै मोबाइलबाट एक दिनमा एक जनाको मात्र हाजिरी
      const dup = prev.some(
        (r) =>
          r.date === newRecord.date &&
          (r.officerId === newRecord.officerId ||
            (!!newRecord.deviceId && r.deviceId === newRecord.deviceId))
      );
      if (dup) return prev;
      return [newRecord, ...prev];
    });
  };

  const handleUpdateAttendanceRecord = (recordId: string, updates: Partial<AttendanceRecord>) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, ...updates } : r))
    );
  };

  // Emergency SOS dispatch
  const handleDispatchAlert = (alert: EmergencyAlert) => {
    setActiveAlerts((prev) => [alert, ...prev]);
    setAlertLog((prev) => (prev.some((a) => a.id === alert.id) ? prev : [alert, ...prev]));
  };

  const handleResolveAlert = (alertId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
    setAlertLog((prev) =>
      prev.map((a) =>
        (a.id === alertId || a.officerId === alertId) && a.status !== 'समाधान भयो'
          ? { ...a, status: 'समाधान भयो' as EmergencyAlert['status'] }
          : a
      )
    );
  };

  // Count unread circulars for current officer
  const unreadCircularCount = circulars.filter(
    (c) => !(c.acknowledgedOfficerIds || []).includes(currentOfficer.id)
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

      {/* 2. Device Identity Bar with QR Code trigger */}
      <IdentityBar
        currentOfficer={currentOfficer}
        onOpenSwitchModal={() => setIsIdentityModalOpen(true)}
        onOpenQrModal={() => setIsMyQrModalOpen(true)}
      />

      {/* 3. Main Content Container (with optional Mobile Terminal Frame) */}
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
                onAddCircular={handleAddCircular}
                onDeleteCircular={handleDeleteCircular}
                onAcknowledgeCircular={handleAcknowledgeCircular}
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
                onAddAttendanceRecord={handleAddAttendanceRecord}
                onUpdateAttendanceRecord={handleUpdateAttendanceRecord}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'gallery' && (
              <GalleryTab
                photos={galleryPhotos}
                onAddPhoto={handleAddPhoto}
                onDeletePhoto={handleDeletePhoto}
                isAdmin={isAdmin}
                onRequireAdmin={() => setIsAdminModalOpen(true)}
              />
            )}

            {activeTab === 'notices' && (
              <NoticeBoardTab
                notices={notices}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
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
                onAddDuty={handleAddDuty}
                onRemoveDuty={handleRemoveDuty}
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
                onResolveAlert={handleResolveAlert}
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
            {String(getCurrentNepaliDate().fullText || '').replace(/^(\S+) /, '$1 साल ')}
          </div>
        </div>
      </footer>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />

      {/* 5. Modals */}
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
        onDispatchAlert={handleDispatchAlert}
        activeAlert={activeAlerts.find((a) => a.officerId === currentOfficer.id)}
        onClearAlert={() => handleResolveAlert(currentOfficer.id)}
      />

      <OfficerQrModal
        isOpen={isMyQrModalOpen}
        onClose={() => setIsMyQrModalOpen(false)}
        officer={currentOfficer}
      />

    </div>
  );
}
