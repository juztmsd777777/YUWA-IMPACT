import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { schoolService } from '../services/schoolService';
import { participantService } from '../services/participantService';
import { activityService } from '../services/activityService';
import { syncService } from '../services/syncService';

const FieldAppContext = createContext(null);

export const FieldAppProvider = ({ children }) => {
  // 1. Connection & Offline state
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
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
  const [fieldWorker] = useState({
    id: 'fw-yuwa-01',
    name: 'Priya Sharma',
    role: 'Field Coordinator',
    location: 'Warangal & Dehradun Region',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  });

  // 3. Workflow State (Persisted across steps)
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // 4. Live Data Collections from MongoDB & LocalStorage for Offline Queue
  const [schools, setSchools] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [offlineRecords, setOfflineRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('yuwa_offline_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [syncLogs, setSyncLogs] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Sync offlineRecords to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('yuwa_offline_records', JSON.stringify(offlineRecords));
    } catch (e) {
      console.warn('Failed to save offline records to localStorage:', e);
    }
  }, [offlineRecords]);

  // 5. Evidence Photos stored in current flow
  const [photos, setPhotos] = useState([]);

  // 6. Sync Statistics (Cached in localStorage)
  const [syncProgress, setSyncProgress] = useState(100);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [syncSummary, setSyncSummary] = useState(() => {
    try {
      const saved = localStorage.getItem('yuwa_sync_summary');
      return saved ? JSON.parse(saved) : {
        totalRecords: 14,
        syncedRecords: 14,
        pendingRecords: 0,
        failedRecords: 0
      };
    } catch {
      return {
        totalRecords: 14,
        syncedRecords: 14,
        pendingRecords: 0,
        failedRecords: 0
      };
    }
  });

  // Fetch all live data from database
  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Fetch programs from API
      const progsRes = await fetch('/api/programs').catch(() => null);
      if (progsRes && progsRes.ok) {
        const progsData = await progsRes.json();
        const progsList = progsData.data || progsData || [];
        setPrograms(progsList);
        if (progsList.length > 0 && !selectedProgram) {
          setSelectedProgram(progsList[0]);
        }
      }

      // Fetch live schools from DB
      const dbSchools = await schoolService.getSchools();
      setSchools(dbSchools);
      if (dbSchools.length > 0 && !selectedSchool) {
        setSelectedSchool(dbSchools[0]);
      }

      // Fetch live participants from DB
      const dbParticipants = await participantService.getParticipants();
      setParticipants(dbParticipants);

      // Fetch live activities from DB
      const dbActivities = await activityService.getActivities();
      setActivities(dbActivities);

      // Extract real photos from activities
      const allPhotos = [];
      dbActivities.forEach((act, actIdx) => {
        const actPhotos = Array.isArray(act.photos) && act.photos.length > 0 ? act.photos : (act.photoUrls || []);
        if (Array.isArray(actPhotos)) {
          actPhotos.forEach((ph, phIdx) => {
            const url = typeof ph === 'string' ? ph : (ph.url || ph.fileUrl || ph.preview || '');
            if (url) {
              allPhotos.push({
                id: `db-photo-${act._id || actIdx}-${phIdx}`,
                name: act.activityName || act.activity || `Evidence Photo ${phIdx + 1}`,
                size: '350 KB',
                url: url,
                tag: act.activityType || 'Field Evidence'
              });
            }
          });
        }
      });
      setPhotos(allPhotos);

      // Fetch live sync status & logs from DB
      const syncStatus = await syncService.getSyncStatus();
      if (syncStatus && syncStatus.totalRecords !== undefined) {
        setSyncProgress(syncStatus.progressPercent !== undefined ? syncStatus.progressPercent : 100);
        setSyncLogs(syncStatus.logs || []);
        const newSummary = {
          totalRecords: syncStatus.totalRecords,
          syncedRecords: syncStatus.syncedRecords,
          pendingRecords: syncStatus.pendingRecords || 0,
          failedRecords: syncStatus.failedRecords || 0
        };
        setSyncSummary(newSummary);
        try {
          localStorage.setItem('yuwa_sync_summary', JSON.stringify(newSummary));
        } catch {}

        if (syncStatus.lastSynced) {
          try {
            setLastSyncTime(new Date(syncStatus.lastSynced).toLocaleString());
          } catch {
            setLastSyncTime(String(syncStatus.lastSynced));
          }
        }
      }
    } catch (err) {
      console.error('[FieldAppContext] Error fetching database data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedProgram, selectedSchool]);

  useEffect(() => {
    refreshData();
  }, []);

  // Actions
  const addParticipant = async (newParticipant) => {
    const payload = {
      name: newParticipant.fullName || newParticipant.name,
      fullName: newParticipant.fullName || newParticipant.name,
      age: parseInt(newParticipant.age, 10) || 14,
      gender: newParticipant.gender || 'Prefer not to say',
      schoolId: newParticipant.schoolId || selectedSchool?._id || selectedSchool?.id,
      schoolName: newParticipant.schoolName || selectedSchool?.schoolName || selectedSchool?.name || '',
      gradeOrClass: newParticipant.className || newParticipant.gradeOrClass || 'Class 8',
      className: newParticipant.className || newParticipant.gradeOrClass || 'Class 8',
      contact: newParticipant.contact || '',
      score: parseInt(newParticipant.score, 10) || 80,
      notes: newParticipant.notes || '',
      program: selectedProgram?.name || 'Ecolympics'
    };

    let created = null;

    if (effectiveOnline) {
      try {
        created = await participantService.createParticipant(payload);
        setParticipants(prev => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Network error saving participant, queueing offline:', err);
      }
    }

    // Offline fallback queue
    created = {
      id: `local-part-${Date.now()}`,
      ...payload,
      status: 'Pending Sync'
    };
    setParticipants(prev => [created, ...prev]);
    setOfflineRecords(prev => [
      {
        id: `off-part-${Date.now()}`,
        type: 'Participant',
        title: `Participant: ${created.fullName}`,
        school: created.schoolName || 'Local School',
        status: 'Pending Sync',
        timestamp: 'Just now',
        itemsCount: `Class ${created.className}`,
        rawPayload: payload
      },
      ...prev
    ]);

    return created;
  };

  const addActivity = async (activityData) => {
    const payload = {
      schoolId: activityData.schoolId || selectedSchool?._id || selectedSchool?.id,
      schoolName: activityData.schoolName || selectedSchool?.schoolName || selectedSchool?.name || '',
      program: activityData.program || selectedProgram?.name || 'Ecolympics',
      programName: activityData.program || selectedProgram?.name || 'Ecolympics',
      activityName: activityData.activityName,
      title: activityData.activityName,
      name: activityData.activityName,
      activityType: activityData.activityType || 'Cleanliness Drive',
      date: activityData.date || new Date().toISOString(),
      description: activityData.description || '',
      participantCount: parseInt(activityData.participantsCount, 10) || 0,
      participantsCount: parseInt(activityData.participantsCount, 10) || 0,
      averageScore: parseInt(activityData.averageScore, 10) || 80,
      photos: photos.map(p => ({ url: p.url, caption: p.name }))
    };

    let created = null;

    if (effectiveOnline) {
      try {
        created = await activityService.createActivity(payload);
        setActivities(prev => [created, ...prev]);
        refreshData();
        return created;
      } catch (err) {
        console.warn('Network error saving activity, queueing offline:', err);
      }
    }

    // Offline fallback queue
    created = {
      id: `local-act-${Date.now()}`,
      ...payload,
      status: 'Pending Sync'
    };
    setActivities(prev => [created, ...prev]);
    setOfflineRecords(prev => [
      {
        id: `off-${Date.now()}`,
        type: 'Activity',
        title: created.activityName,
        school: created.schoolName || 'Local School',
        status: 'Pending Sync',
        timestamp: 'Just now',
        itemsCount: `${created.participantsCount} participants`,
        rawPayload: payload
      },
      ...prev
    ]);

    return created;
  };

  const saveOfflinePhotos = (photosList) => {
    const list = photosList || photos;
    if (!list || list.length === 0) return null;

    const schoolTitle = selectedSchool?.schoolName || selectedSchool?.name || 'Local School';
    const progTitle = selectedProgram?.name || 'Ecolympics';

    const newRecord = {
      id: `off-photo-${Date.now()}`,
      type: 'Photo',
      title: `${list.length} Evidence Photo${list.length > 1 ? 's' : ''} Stored`,
      school: schoolTitle,
      status: 'Pending Sync',
      timestamp: 'Just now',
      itemsCount: `${list.length} photo${list.length > 1 ? 's' : ''}`,
      rawPayload: {
        photos: list.map(p => ({ url: p.url || p.preview, caption: p.name || 'Field Evidence Photo' })),
        schoolId: selectedSchool?._id || selectedSchool?.id,
        schoolName: schoolTitle,
        program: progTitle
      }
    };

    setOfflineRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const addPhotos = (newPhotoFiles) => {
    const formatted = newPhotoFiles.map((file, idx) => ({
      id: `photo-up-${Date.now()}-${idx}`,
      name: file.name || `photo_${idx + 1}.jpg`,
      size: `${Math.round((file.size || 320000) / 1024)} KB`,
      url: file.preview || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      tag: 'Compressed'
    }));
    setPhotos(prev => [...prev, ...formatted]);

    // If currently offline, automatically stage into offlineRecords
    if (!effectiveOnline) {
      saveOfflinePhotos(formatted);
    }
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const triggerSync = async () => {
    setIsSyncing(true);
    setSyncProgress(35);

    try {
      // Build reports payload from offline queue
      const reports = offlineRecords.map((rec) => ({
        clientGeneratedId: rec.id,
        schoolId: rec.rawPayload?.schoolId || null,
        schoolName: rec.rawPayload?.schoolName || rec.school,
        programName: rec.rawPayload?.program || 'Ecolympics',
        studentCount: rec.rawPayload?.participantCount || (rec.type === 'Participant' ? 1 : 0),
        activityDetails: rec.rawPayload || { title: rec.title },
        photoUrls: rec.rawPayload?.photos?.map(p => p.url).filter(Boolean) || [],
        clientCreatedAt: new Date().toISOString()
      }));

      if (reports.length > 0) {
        await syncService.triggerSync({ reports });
      }

      setSyncProgress(100);
      setOfflineRecords([]);
      try {
        localStorage.removeItem('yuwa_offline_records');
      } catch {}
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      await refreshData();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const retryFailedRecords = async () => {
    try {
      await syncService.retryFailed();
      await refreshData();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  return (
    <FieldAppContext.Provider
      value={{
        isOnline: effectiveOnline,
        realBrowserOnline: isOnline,
        manualOfflineSimulation,
        setManualOfflineSimulation,
        fieldWorker,
        programs,
        selectedProgram,
        setSelectedProgram,
        schools,
        setSchools,
        selectedSchool,
        setSelectedSchool,
        participants,
        addParticipant,
        activities,
        addActivity,
        offlineRecords,
        setOfflineRecords,
        saveOfflinePhotos,
        syncLogs,
        photos,
        addPhotos,
        removePhoto,
        syncProgress,
        syncSummary,
        isSyncing,
        lastSyncTime,
        triggerSync,
        retryFailedRecords,
        refreshData,
        isLoadingData
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
