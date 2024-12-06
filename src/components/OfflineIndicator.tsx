import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useLessonStore } from '../store/lessonStore';

export function OfflineIndicator() {
  const { isOffline } = useLessonStore();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
}