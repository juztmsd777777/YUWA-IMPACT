# YUWA Impact & Evaluation Portal

Offline-first PWA for Waste Warriors Society. Field workers collect Ecolympics and Green Gurukul data (schools, participants, activities, scores, photos) with poor connectivity; data syncs to MongoDB; admins view impact on a dashboard.

Full product spec: [YUWA_MVP_Requirements.md](YUWA_MVP_Requirements.md).  
Team folders and Git: [docs/TEAM.md](docs/TEAM.md).  
API shapes: [docs/api-contract.md](docs/api-contract.md).

## Stack

- Frontend: React + Vite (PWA)
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

Auth is out of scope for the MVP.

## Prerequisites

- Node.js 20+
- MongoDB running locally, **or** Docker:

```bash
docker run -d --name yuwa-mongo -p 27017:27017 mongo:7
```

## Setup

```bash
cd backend
copy .env.example .env
npm install

cd ../frontend
copy .env.example .env
npm install
```

On macOS/Linux use `cp` instead of `copy`.

## Run

Terminal 1 — API (`http://localhost:5000`):

```bash
cd backend
npm run dev
```

Terminal 2 — UI (`http://localhost:5173`):

```bash
cd frontend
npm run dev
```

Optional seed (needs MongoDB):

```bash
cd backend
npm run seed
```

## Apps in the UI

- Field worker: `/`
- Admin dashboard: `/dashboard`

## This scaffold vs later work

This repo is a **team base**: routes, models, placeholder pages, IndexedDB helper, stub APIs. Each member implements their branch (see [docs/TEAM.md](docs/TEAM.md)). Do not sacrifice the P0 flow (create activity → offline save → sync → MongoDB → dashboard) for polish.
