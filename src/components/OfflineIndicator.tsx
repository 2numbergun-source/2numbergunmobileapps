import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-12 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 border border-amber-400 px-3.5 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>अफलाइन मोड (Offline Mode) — रोस्टर, परिपत्र र सम्पर्क सुरक्षित चल्दैछ।</span>
    </div>
  );
};
