# YUWA team ownership

Five developers work in parallel. Stay inside your folders unless you are integrating.

## Roles

| Member | Role | Branch | Own these paths |
| --- | --- | --- | --- |
| FE 1 | Field app | `feature/field-frontend` | `frontend/src/pages/field/`, `frontend/src/offline/`, field-related `frontend/src/hooks/` |
| FE 2 | Admin dashboard | `feature/dashboard` | `frontend/src/pages/dashboard/` |
| BE 1 | Core APIs + DB | `feature/core-backend` | `backend/models/`, `backend/controllers/` (CRUD), `backend/routes/` (core) |
| BE 2 | Offline + sync + media | `feature/offline-sync` | `backend/services/syncService.js`, `POST /api/sync`, `backend/uploads/`, photo upload |
| BE 3 | Evaluation + integration | `feature/evaluation` | `backend/services/evaluationService.js`, dashboard/evaluation routes, `backend/seed/` |

Shared (coordinate before changing):

- `frontend/src/services/api.js`
- `frontend/src/components/`
- `docs/api-contract.md`
- `backend/server.js`

## Git workflow

```text
main
├── feature/field-frontend
├── feature/dashboard
├── feature/core-backend
├── feature/offline-sync
└── feature/evaluation
```

1. Create your branch from `main`.
2. Commit and push only that branch.
3. Open a PR into `main`.
4. Tell BE 3 (integration) before merging.

Do not push directly to `main`.

## Parallel work

Frontend can use mock data in `frontend/src/services/mockData.js` until APIs return real MongoDB documents.

Phase 1 (this scaffold): schema, endpoints, folder layout, contracts.

Phase 2: each person fills their stubs.

Phase 3: wire Field App → Core API → MongoDB, then Sync, then Evaluation → Dashboard.
