# YUWA Field App — Service Layer & Backend Integration Guide

**Author:** Frontend Developer 1 (Field App)  
**Target Audience:** Member 3 (Backend Developer - Database & APIs), Member 4 (Backend Developer - Offline & Sync), Member 5 (Full Stack - Evaluation)

---

## 1. Architecture Overview

```text
Field Worker Browser UI (Screens 1–8)
         │
         ▼
  FieldAppContext (State, Offline Queue, Online/Offline Detector)
         │
         ▼
  Frontend Services Layer (src/services/)
   ├── schoolService.js
   ├── participantService.js
   ├── activityService.js
   ├── photoService.js
   └── syncService.js
         │
    ┌────┴────────────────────────┐
    ▼                             ▼
[Online Mode]              [Offline Mode]
HTTP REST API Calls        Local Browser Queue (IndexedDB / localStorage)
(Endpoints in apiConfig)   (Pending Sync records queue)
    │                             │
    ▼ (Internet Restored)         ▼
Member 3 & Member 4         Member 4 Sync Service
Backend Node / Express      Background Batch Push
    │                             │
    ▼                             ▼
MongoDB Collections        MongoDB Collections
```

---

## 2. Centralized Configuration (`src/services/apiConfig.js`)

All endpoint paths are strictly centralized. To connect to your backend server, update `.env` or set `VITE_API_BASE_URL`:

```javascript
VITE_API_BASE_URL=http://localhost:5000/api
```

```javascript
export const API_ENDPOINTS = {
  // Member 3 - REST APIs
  SCHOOLS: `${API_BASE_URL}/schools`,
  SCHOOL_BY_ID: (id) => `${API_BASE_URL}/schools/${id}`,
  PROGRAMS: `${API_BASE_URL}/programs`,
  PARTICIPANTS: `${API_BASE_URL}/participants`,
  ACTIVITIES: `${API_BASE_URL}/activities`,
  PHOTOS_UPLOAD: `${API_BASE_URL}/photos/upload`,

  // Member 4 - Sync APIs
  SYNC_STATUS: `${API_BASE_URL}/sync/status`,
  SYNC_TRIGGER: `${API_BASE_URL}/sync/trigger`,
  SYNC_RETRY: `${API_BASE_URL}/sync/retry`
};
```

---

## 3. Service Contracts

### A. School Service (`src/services/schoolService.js`)
* **`getSchools(query)`**
  * `GET /api/schools`
  * Response: `Array<School>`
* **`getSchoolById(schoolId)`**
  * `GET /api/schools/:id`
* **`createSchool(schoolData)`**
  * `POST /api/schools`
  * Expected Body:
    ```json
    {
      "name": "Sunrise High School",
      "location": "Warangal, Telangana",
      "district": "Warangal",
      "mandal": "Warangal Urban",
      "code": "SMHS-WGL-07"
    }
    ```

### B. Participant Service (`src/services/participantService.js`)
* **`getParticipants(schoolId)`**
  * `GET /api/participants?schoolId=...`
* **`createParticipant(participantData)`**
  * `POST /api/participants`
  * Expected Body:
    ```json
    {
      "fullName": "Rahul Sharma",
      "className": "Class 8",
      "age": 14,
      "gender": "Male",
      "schoolId": "sch-01",
      "schoolName": "ZP High School",
      "contact": "+91 98765 43210",
      "score": 85,
      "notes": "Eco-club volunteer"
    }
    ```

### C. Activity Service (`src/services/activityService.js`)
* **`getActivities()`**
  * `GET /api/activities`
* **`createActivity(activityData)`**
  * `POST /api/activities`
  * Expected Body:
    ```json
    {
      "programId": "prog-ecolympics",
      "programName": "Ecolympics",
      "schoolId": "sch-01",
      "schoolName": "ZP High School, Warangal",
      "activityType": "Tree Plantation",
      "activityName": "Tree Plantation Drive",
      "date": "2025-09-16",
      "participantsCount": 25,
      "averageScore": 82,
      "description": "Native saplings planted across campus."
    }
    ```

### D. Photo Evidence Service (`src/services/photoService.js`)
* **`uploadPhotos(photos, activityId)`**
  * `POST /api/photos/upload`
  * Content-Type: `multipart/form-data`
  * Parameters: `photos: File[]`, `activityId: string`
  * Expected Response:
    ```json
    {
      "success": true,
      "uploadedCount": 4,
      "fileUrls": ["https://storage.../p1.jpg"]
    }
    ```

### E. Sync Service (`src/services/syncService.js`)
* **`getSyncStatus()`**
  * `GET /api/sync/status`
  * Returns: `{ progressPercent, totalRecords, syncedRecords, pendingRecords, failedRecords, lastSynced, logs }`
* **`triggerSync(pendingBatch)`**
  * `POST /api/sync/trigger`
  * Pushes offline queue items to central database.
* **`retryFailed()`**
  * `POST /api/sync/retry`

---

## 4. Teammate Handoff Notes

1. **Member 2 (Frontend Dashboard):**
   * Can import shared tokens from `src/styles/variables.css`.
   * Screens 9–13 can be added as child routes inside `AppLayout.jsx` without altering Screens 1–8.
2. **Member 3 (Backend DB & APIs):**
   * Simply activate the commented `fetch()` calls in `src/services/*Service.js` once endpoints are hosted.
3. **Member 4 (Offline & Sync):**
   * Hook into `FieldAppContext.jsx` state `offlineRecords` to wire the real IndexedDB / background service worker synchronization engine.
4. **Member 5 (Evaluation):**
   * Use `score` and `averageScore` fields from `participantService` and `activityService` to feed evaluation models.
