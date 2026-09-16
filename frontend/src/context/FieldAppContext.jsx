import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialFieldWorker,
  initialPrograms,
  initialSchools,
  initialParticipants,
  initialActivities,
  initialOfflineRecords,
  initialSyncLogs
} from '../data/mockData';

const FieldAppContext = createContext(null);

export const FieldAppProvider = ({ children }) => {
  // 1. Connection & Offline state
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  // Manual override for testing offline simulation in browser
  const [manualOfflineSimulation, setManualOfflineSimulation] = useState(false);

  const effectiveOnline = isOnline && !manualOfflineSimulation;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. User & Field Worker
  const [fieldWorker] = useState(initialFieldWorker);

  // 3. Workflow State (Persisted across steps)
  const [selectedProgram, setSelectedProgram] = useState(initialPrograms[0]); // Default to Ecolympics
  const [selectedSchool, setSelectedSchool] = useState(initialSchools[0]);   // Default to ZP High School

  // 4. Data Collections
  const [schools, setSchools] = useState(initialSchools);
  const [participants, setParticipants] = useState(initialParticipants);
  const [activities, setActivities] = useState(initialActivities);
  const [offlineRecords, setOfflineRecords] = useState(initialOfflineRecords);
  const [syncLogs, setSyncLogs] = useState(initialSyncLogs);

  // 5. Evidence Photos stored in current flow
  const [photos, setPhotos] = useState([
    {
      id: 'photo-01',
      name: 'tree_plantation_01.jpg',
      size: '320 KB',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    },
    {
      id: 'photo-02',
      name: 'students_group_02.jpg',
      size: '290 KB',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    },
    {
      id: 'photo-03',
      name: 'waste_segregation_03.jpg',
      size: '310 KB',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    },
    {
      id: 'photo-04',
      name: 'sapling_care_04.jpg',
      size: '305 KB',
      url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    }
  ]);

  // 6. Sync Statistics
  const [syncProgress, setSyncProgress] = useState(68);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('14 Sep 2025, 06:12 PM');

  // Helper Actions
  const addParticipant = (newParticipant) => {
    const created = {
      id: `part-${Date.now()}`,
      ...newParticipant,
      status: 'Active',
      addedAt: new Date().toISOString().split('T')[0]
    };
    setParticipants(prev => [created, ...prev]);

    // If offline, also record in offline queue
    if (!effectiveOnline) {
      setOfflineRecords(prev => [
        {
          id: `off-part-${Date.now()}`,
          type: 'Participant',
          title: `Participant: ${created.fullName}`,
          school: created.schoolName || selectedSchool?.name || 'Local School',
          status: 'Pending Sync',
          timestamp: 'Just now',
          itemsCount: `Class ${created.className}`
        },
        ...prev
      ]);
    }
    return created;
  };

  const addActivity = (activityData) => {
    const created = {
      id: `act-${Date.now()}`,
      ...activityData,
      timeAgo: 'Just now',
      status: effectiveOnline ? 'Pending Sync' : 'Saved Locally',
      photosCount: photos.length
    };
    setActivities(prev => [created, ...prev]);

    // Add to local offline records queue
    setOfflineRecords(prev => [
      {
        id: `off-${Date.now()}`,
        type: 'Activity',
        title: created.activityName,
        school: created.schoolName || selectedSchool?.name || 'Local School',
        status: 'Pending Sync',
        timestamp: 'Just now',
        itemsCount: `${created.participantsCount || 0} participants, ${photos.length} photos`
      },
      ...prev
    ]);

    return created;
  };

  const addPhotos = (newPhotoFiles) => {
    const formatted = newPhotoFiles.map((file, idx) => ({
      id: `photo-up-${Date.now()}-${idx}`,
      name: file.name || `photo_${idx + 1}.jpg`,
      size: `${Math.round((file.size || 320000) / 1024)} KB`,
      url: file.preview || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    }));
    setPhotos(prev => [...prev, ...formatted]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const triggerSync = async () => {
    setIsSyncing(true);
    setSyncProgress(35);

    setTimeout(() => {
      setSyncProgress(75);
    }, 600);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setLastSyncTime('Just now');
      // Mark pending items synced
      setOfflineRecords(prev =>
        prev.map(r => ({ ...r, status: 'Synced' }))
      );
      setSyncLogs(prev => [
        {
          id: `sync-new-${Date.now()}`,
          entity: 'Full Batch Sync',
          details: `${offlineRecords.length} records processed`,
          status: 'Success',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }, 1200);
  };

  const retryFailedRecords = () => {
    setSyncLogs(prev =>
      prev.map(log =>
        log.status === 'Failed'
          ? { ...log, status: 'Success', details: '1 record resolved & synced' }
          : log
      )
    );
  };

  return (
    <FieldAppContext.Provider
      value={{
        isOnline: effectiveOnline,
        realBrowserOnline: isOnline,
        manualOfflineSimulation,
        setManualOfflineSimulation,
        fieldWorker,
        selectedProgram,
        setSelectedProgram,
        selectedSchool,
        setSelectedSchool,
        schools,
        setSchools,
        participants,
        addParticipant,
        activities,
        addActivity,
        offlineRecords,
        syncLogs,
        photos,
        addPhotos,
        removePhoto,
        syncProgress,
        isSyncing,
        lastSyncTime,
        triggerSync,
        retryFailedRecords
      }}
    >
      {children}
    </FieldAppContext.Provider>
  );
};

export const useFieldApp = () => {
  const context = useContext(FieldAppContext);
  if (!context) {
    throw new Error('useFieldApp must be used within a FieldAppProvider');
  }
  return context;
};
