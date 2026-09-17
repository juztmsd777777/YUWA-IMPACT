# YUWA Impact & Evaluation Portal - Backend API Reference

Backend service built for **Waste Warriors Society** to support youth climate action programs (**Ecolympics** & **Green Gurukul**).

This backend stores data in MongoDB and exposes RESTful JSON APIs for:
* **Schools**
* **Participants**
* **Activities**

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Ensure `.env` exists in `backend/` with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/yuwa_portal
```

### 4. Start the Server
* Development mode (auto-reload on save):
  ```bash
  npm run dev
  ```
* Production mode:
  ```bash
  npm start
  ```

---

## 🌐 Standard Response Format

### Success (200 / 201)
```json
{
  "success": true,
  "message": "Resource created / retrieved successfully",
  "data": { ... }
}
```

### Error (400 / 404 / 409 / 500)
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 🏫 Schools API (`/api/schools`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/schools` | Register a new school |
| `GET` | `/api/schools` | List all schools (supports `?district=...` and `?program=...`) |
| `GET` | `/api/schools/:id` | Get details of a single school |
| `PUT` | `/api/schools/:id` | Update school details |
| `DELETE` | `/api/schools/:id` | Delete a school |

### `POST /api/schools` Request Body Example:
```json
{
  "schoolName": "Govt Girls Inter College",
  "location": "Rajpur Road",
  "district": "Dehradun",
  "state": "Uttarakhand",
  "contactPerson": "Sunita Rawat",
  "contactPhone": "9876543210",
  "contactEmail": "sunita@ggic.edu.in",
  "program": "Both"
}
```
* `program` options: `"Ecolympics"`, `"Green Gurukul"`, `"Both"`

---

## 👦 Participants API (`/api/participants`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/participants` | Register a new participant / student |
| `GET` | `/api/participants` | List all participants (supports `?schoolId=...` and `?program=...`) |
| `GET` | `/api/participants/:id` | Get details of a single participant |
| `PUT` | `/api/participants/:id` | Update participant details |
| `DELETE` | `/api/participants/:id` | Delete a participant |

### `POST /api/participants` Request Body Example:
```json
{
  "name": "Aarav Verma",
  "age": 14,
  "gender": "Male",
  "schoolId": "6aaa60aed528b1a47bb654b2",
  "gradeOrClass": "Class 9",
  "program": "Ecolympics"
}
```
* Note: `schoolId` must be a valid ID of an existing School in the database.

---

## 🧹 Activities API (`/api/activities`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/activities` | Record a school activity / session |
| `GET` | `/api/activities` | List all activities (supports `?schoolId=...`, `?activityType=...`, and `?program=...`) |
| `GET` | `/api/activities/:id` | Get details of a single activity |
| `PUT` | `/api/activities/:id` | Update activity details |
| `DELETE` | `/api/activities/:id` | Delete an activity |

### `POST /api/activities` Request Body Example:
```json
{
  "schoolId": "6aaa60aed528b1a47bb654b2",
  "program": "Ecolympics",
  "activityName": "Campus Waste Audit & Segregation Drive",
  "activityType": "Waste Audit",
  "date": "2026-09-16T10:00:00.000Z",
  "description": "Students audited single-use plastic waste generated across 12 classrooms.",
  "participantCount": 25,
  "participants": [
    "6aaa61ad7e0795e0e666715b"
  ],
  "photos": [
    {
      "url": "https://storage.wastewarriors.org/evidence/audit1.jpg",
      "caption": "Students sorting dry waste into categories"
    }
  ]
}
```
* `program` options: `"Ecolympics"`, `"Green Gurukul"`.
* `activityType` options: `"Waste Audit"`, `"Cleanliness Drive"`, `"Segregation Workshop"`, `"Composting Session"`, `"Upcycling Workshop"`, `"Awareness Rally"`, `"Quiz / Competition"`, `"Other"`.

---

## 🤝 Integration Guidelines for Teammates

### For Member 1 — Frontend Field App
* Load schools into your dropdown using `GET /api/schools`.
* Submit newly registered students using `POST /api/participants`.
* Submit completed field activities and photo URLs using `POST /api/activities`.

### For Member 2 — Frontend Dashboard
* Fetch all activities: `GET /api/activities` to compute total events and attendance metrics.
* Filter participants by school: `GET /api/participants?schoolId=<ID>`.
* Filter schools by district: `GET /api/schools?district=Dehradun`.

### For Member 4 — Offline & Sync
* When field devices go offline, store requests locally.
* When connection is re-established, iterate through the queue and send `POST` requests to `/api/schools`, `/api/participants`, and `/api/activities`.
* All endpoints return standard HTTP status codes (`201` for created, `400` for validation errors) for simple retry logic.

### For Member 5 — Full Stack Evaluation
* Link your evaluation scores and before/after metrics using the `_id` of any `School`, `Participant`, or `Activity`.
