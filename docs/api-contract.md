# Frontend ↔ backend API contract

Base URL (local): `http://localhost:5000/api`

All JSON responses use `{ success, ... }`. Adjust fields only after telling the other team.

Auth is **out of scope** for MVP. No tokens.

---

## Health

`GET /api/health`

```json
{ "success": true, "status": "ok" }
```

---

## Programs

`GET /api/programs` → `{ "success": true, "data": [] }`

`POST /api/programs`

```json
{ "name": "Ecolympics", "description": "Youth climate program" }
```

---

## Schools

`GET /api/schools`  
`POST /api/schools`

```json
{ "name": "ABC School", "location": "Dehradun", "programId": "program123" }
```

---

## Participants

`GET /api/participants`  
`POST /api/participants`

```json
{ "name": "Asha", "age": 14, "schoolId": "school123", "score": 76 }
```

---

## Create activity

`POST /api/activities`

Request:

```json
{
  "programId": "program123",
  "schoolId": "school123",
  "activityType": "Climate Quiz",
  "date": "2026-09-16",
  "participants": 40,
  "averageScore": 76,
  "notes": "Climate awareness quiz",
  "photos": [],
  "localId": "abc123"
}
```

Response:

```json
{
  "success": true,
  "activity": { "id": "activity123" }
}
```

`GET /api/activities`  
`GET /api/activities/:id`

---

## Assessments

`POST /api/assessments`

```json
{
  "participantId": "p1",
  "programId": "program123",
  "beforeScore": 45,
  "afterScore": 75
}
```

`GET /api/assessments`

---

## Dashboard

`GET /api/dashboard`

Expected shape (BE 3 fills aggregation):

```json
{
  "success": true,
  "data": {
    "totalSchools": 0,
    "totalParticipants": 0,
    "totalActivities": 0,
    "totalPhotos": 0,
    "byProgram": []
  }
}
```

---

## Sync (offline)

`POST /api/sync`

Request:

```json
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

Response:

```json
{
  "success": true,
  "synced": ["abc123"],
  "failed": []
}
```

Use `localId` as the idempotency key. Duplicate posts must not create duplicate MongoDB documents.

---

## Evaluation

`GET /api/evaluation`  
`GET /api/evaluation/:programId`

```json
{
  "success": true,
  "data": {
    "participants": 500,
    "averageBefore": 45,
    "averageAfter": 75,
    "improvement": 30
  }
}
```
