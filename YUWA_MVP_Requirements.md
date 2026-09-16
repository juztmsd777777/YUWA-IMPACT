# YUWA Impact & Evaluation Portal --- MVP Requirements

## 1. Project Overview

YUWA is an **offline-first web application (PWA)** for Waste Warriors
Society.

The application helps field workers collect data from youth climate
programs such as:

-   Ecolympics
-   Green Gurukul

The field worker should be able to collect school, participant,
activity, score, and photo data even when internet connectivity is poor.

When internet becomes available, offline data should synchronize with
the backend.

An NGO/admin user should then be able to see the collected information
and impact through a simple dashboard.

------------------------------------------------------------------------

# 2. MVP Goal

Build only the **core end-to-end functionality**.

### Core flow

``` text
Field Worker
    ↓
Select Program
    ↓
Select School
    ↓
Record Participants / Activity / Scores
    ↓
Add Photos
    ↓
Save
    ↓
Works Offline
    ↓
Internet Returns
    ↓
Sync
    ↓
Backend
    ↓
MongoDB
    ↓
Evaluation / Impact
    ↓
Admin Dashboard
```

## 3. Explicitly Out of Scope

Do NOT spend time building:

-   Login
-   Registration
-   Authentication
-   Complex role/permission systems
-   Password reset
-   Email verification
-   Advanced admin management
-   Payment systems
-   Notifications
-   Chat
-   Complex reporting/export systems
-   Unnecessary animations
-   Extra features not required for the core demo

The priority is a working MVP, not a large feature set.

------------------------------------------------------------------------

# 4. Team Structure

There are 5 developers.

  -----------------------------------------------------------------------
  Member                  Role                    Ownership
  ----------------------- ----------------------- -----------------------
  FE 1                    Frontend -- Field App   Field data collection
                                                  experience

  FE 2                    Frontend -- Dashboard   Admin dashboard and
                                                  analytics

  BE 1                    Backend -- Core APIs    Database and main CRUD
                                                  APIs

  BE 2                    Backend -- Offline/Sync Offline synchronization
                                                  and media handling

  BE 3                    Backend -- Evaluation + Impact calculations,
                          Integration             evaluation APIs and
                                                  integration
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Frontend Developer 1 --- Field App

## Goal

Build the complete field-worker experience.

The field worker should be able to record what happened during a school
activity.

## Pages / Screens

### Field Home

Show:

-   Number of activities recorded
-   Number of pending sync records
-   Online/offline status
-   Button to add activity
-   Recent activities

### Program Selection

Programs:

-   Ecolympics
-   Green Gurukul

The UI should allow the user to select a program.

### School Selection

Show available schools.

Minimum information:

-   School name
-   Location

### Activity Form

Fields:

-   Program
-   School
-   Activity type
-   Date
-   Number of participants
-   Score / average score
-   Notes

### Participant Data

For MVP, support basic participant information:

-   Name
-   Age
-   School
-   Score (if applicable)

Do not overcomplicate participant management.

### Photo Upload

Allow the user to:

-   Select a photo
-   Capture a photo where supported
-   Preview the photo
-   Upload/save the photo

Images should be compressed before upload where practical.

### Offline UI

The user must clearly see:

``` text
Online
```

or

``` text
Offline
```

When offline, saving an activity must still work.

Show:

``` text
3 records pending sync
```

After successful synchronization:

``` text
All records synced
```

## Frontend 1 Functional Requirements

The frontend is NOT just a visual design.

It must include:

-   Form handling
-   Form validation
-   API calls
-   Offline local storage
-   Online/offline detection
-   Pending-sync status
-   Photo handling
-   Loading states
-   Error states
-   Success messages

------------------------------------------------------------------------

# 6. Frontend Developer 2 --- Admin Dashboard

## Goal

Build a simple dashboard that helps the NGO understand the collected
data.

## Dashboard

Display:

-   Total schools reached
-   Total students/participants
-   Total activities
-   Total photos/evidence if available

## Program Statistics

Show statistics separately for:

-   Ecolympics
-   Green Gurukul

Possible metrics:

-   Schools reached
-   Participants
-   Activities
-   Average score

## Activity List

Display:

-   School
-   Program
-   Activity type
-   Date
-   Participants
-   Score

Allow the user to open an activity to see more details.

## Impact / Evaluation

Show:

-   Before assessment average
-   After assessment average
-   Improvement

Example:

``` text
Before: 45%
After: 75%
Improvement: +30 percentage points
```

## Filters

Keep filters simple:

-   Program
-   School
-   Date

## Charts

Use simple charts only where useful.

Do not spend excessive time making complicated visualizations.

## Frontend 2 Functional Requirements

The frontend must include:

-   API integration
-   Loading states
-   Empty states
-   Error states
-   Charts
-   Filters
-   Real data display

Initially, mock data may be used so development can continue before
backend APIs are ready.

------------------------------------------------------------------------

# 7. Backend Developer 1 --- Core Backend + Database

## Goal

Build the main backend and database structure.

Recommended stack:

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

## Main Models

Keep the data model simple.

### Program

``` text
_id
name
description
```

### School

``` text
_id
name
location
programId
```

### Participant

``` text
_id
name
age
schoolId
score
```

### Activity

``` text
_id
programId
schoolId
activityType
date
participants
averageScore
notes
photos
createdAt
updatedAt
```

### Assessment

``` text
_id
participantId
programId
beforeScore
afterScore
```

Do not create unnecessary collections unless required.

------------------------------------------------------------------------

# 8. Core APIs

## Programs

``` http
GET /api/programs
POST /api/programs
```

## Schools

``` http
GET /api/schools
POST /api/schools
```

## Participants

``` http
GET /api/participants
POST /api/participants
```

## Activities

``` http
GET /api/activities
GET /api/activities/:id
POST /api/activities
```

## Assessments

``` http
POST /api/assessments
GET /api/assessments
```

## Dashboard

``` http
GET /api/dashboard
```

The dashboard API should return aggregated information needed by the
frontend.

------------------------------------------------------------------------

# 9. Backend Developer 2 --- Offline + Synchronization

## Goal

Make the application useful when there is no internet.

The offline system is mainly a frontend + backend collaboration.

## Frontend Side

Use browser local storage suitable for structured offline data,
preferably **IndexedDB**.

When offline:

``` text
User enters activity
        ↓
Save locally
        ↓
Mark as pending
```

Example local record:

``` json
{
  "localId": "abc123",
  "type": "activity",
  "syncStatus": "pending",
  "data": {}
}
```

## Sync

When internet becomes available:

``` text
Detect connection
      ↓
Find pending records
      ↓
Send to backend
      ↓
Backend processes records
      ↓
Mark records as synced
```

## Sync API

``` http
POST /api/sync
```

Example request:

``` json
{
  "records": [
    {
      "localId": "abc123",
      "type": "activity",
      "data": {}
    }
  ]
}
```

Example response:

``` json
{
  "success": true,
  "synced": ["abc123"],
  "failed": []
}
```

## Duplicate Prevention

If the same offline record is submitted twice, the backend should not
create duplicate records.

Use the `localId` as an idempotency/reference key.

## Retry

If synchronization fails:

``` text
Sync failed
    ↓
Keep record locally
    ↓
Retry later
```

Do not delete unsynchronized data.

## Image Handling

Coordinate with FE 1 for:

``` text
Photo
 ↓
Compress
 ↓
Store / Upload
 ↓
Sync if necessary
```

Keep image handling simple for the MVP.

------------------------------------------------------------------------

# 10. Backend Developer 3 --- Evaluation + Integration

## Goal

Handle impact calculations and make sure the complete application works
together.

## Evaluation

Support basic before/after assessment calculations.

Example:

``` text
Before average = 45
After average = 75

Improvement = 30 percentage points
```

## Evaluation APIs

``` http
GET /api/evaluation
GET /api/evaluation/:programId
```

Example response:

``` json
{
  "participants": 500,
  "averageBefore": 45,
  "averageAfter": 75,
  "improvement": 30
}
```

## Impact Metrics

Support simple metrics such as:

-   Schools reached
-   Participants reached
-   Activities completed
-   Average score
-   Before/after improvement
-   Program-wise statistics

## Integration

This developer should help connect:

``` text
FE 1 → Core APIs
FE 2 → Dashboard APIs
FE 1 → Sync API
Evaluation → Dashboard
```

They should also help with:

-   API testing
-   End-to-end testing
-   Fixing integration bugs
-   Seed/demo data
-   Final demo flow

------------------------------------------------------------------------

# 11. Frontend ↔ Backend Contract

The frontend and backend teams must agree on API request/response
formats before implementation.

Example:

## Create Activity

``` http
POST /api/activities
```

Request:

``` json
{
  "programId": "program123",
  "schoolId": "school123",
  "activityType": "Climate Quiz",
  "date": "2026-09-16",
  "participants": 40,
  "averageScore": 76,
  "notes": "Climate awareness quiz"
}
```

Response:

``` json
{
  "success": true,
  "activity": {
    "id": "activity123"
  }
}
```

The exact schema can be adjusted by the backend team, but changes must
be communicated to the frontend team.

------------------------------------------------------------------------

# 12. Recommended Project Structure

``` text
YUWA/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── offline/
│   │   └── utils/
│   │
│   └── public/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

------------------------------------------------------------------------

# 13. Git Workflow

Use separate branches.

``` text
main
│
├── feature/field-frontend
├── feature/dashboard
├── feature/core-backend
├── feature/offline-sync
└── feature/evaluation
```

Each developer should:

1.  Work on their own branch.
2.  Commit regularly.
3.  Push their branch.
4.  Create a PR.
5.  Inform the integration person before merging.

Avoid everyone directly pushing to `main`.

------------------------------------------------------------------------

# 14. Development Order

## Phase 1 --- Setup

Everyone agrees on:

-   Database schema
-   API endpoints
-   Request/response formats
-   Folder structure
-   Git branches

## Phase 2 --- Parallel Development

``` text
FE 1 → Field App
FE 2 → Dashboard
BE 1 → Database + Core APIs
BE 2 → Offline + Sync
BE 3 → Evaluation
```

Frontend developers can initially use mock data.

## Phase 3 --- Integration

Connect:

``` text
Field App
    ↓
Core API
    ↓
MongoDB
```

Then:

``` text
Offline App
    ↓
Sync API
    ↓
MongoDB
```

Then:

``` text
MongoDB
    ↓
Evaluation
    ↓
Dashboard
```

------------------------------------------------------------------------

# 15. Final Demo Scenario

The final application should demonstrate this exact story.

### Step 1

Open the field app.

### Step 2

Select:

``` text
Program: Ecolympics
School: ABC School
```

### Step 3

Enter:

``` text
Participants: 40
Activity: Climate Quiz
Average Score: 76
```

### Step 4

Add a photo.

### Step 5

Turn off internet.

### Step 6

Create another activity.

The application should still save it.

### Step 7

Turn internet back on.

The application synchronizes the pending record.

### Step 8

Open the admin dashboard.

The new activity should appear.

### Step 9

Show:

``` text
Schools reached
Participants
Activities
Scores
Impact
```

This proves the complete product works.

------------------------------------------------------------------------

# 16. MVP Success Criteria

The project is successful if all of these work:

-   [ ] Field worker can select a program
-   [ ] Field worker can select a school
-   [ ] Field worker can record an activity
-   [ ] Participant information can be recorded
-   [ ] Scores can be recorded
-   [ ] Photos can be added
-   [ ] Activity can be saved offline
-   [ ] Pending offline records are visible
-   [ ] Records synchronize when internet returns
-   [ ] Duplicate records are prevented during sync
-   [ ] Data is stored in MongoDB
-   [ ] Dashboard displays real data
-   [ ] Program statistics are displayed
-   [ ] Activity details are displayed
-   [ ] Basic evaluation/impact is calculated
-   [ ] Complete end-to-end demo works

------------------------------------------------------------------------

# 17. Priority Order

If time becomes limited, follow this priority:

### P0 --- Must Work

``` text
Activity creation
      ↓
Offline save
      ↓
Sync
      ↓
MongoDB
      ↓
Dashboard
```

### P1 --- Important

``` text
Participants
Scores
Photos
Evaluation
```

### P2 --- Nice to Have

``` text
Advanced charts
Advanced filters
Extra UI polish
Additional reports
```

**Never sacrifice the P0 flow to build P2 features.**

------------------------------------------------------------------------

# 18. Core Product Statement

> **YUWA is an offline-first field data collection and impact management
> platform that helps Waste Warriors collect youth climate-program data
> in low-connectivity environments, synchronize it reliably, and
> understand program impact through a centralized dashboard.**
