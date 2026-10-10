# PeerCraft — Project Status & Handoff Document

**Last Updated:** 2026-10-10  
**Overall Status:** Operational & Fully Functional Full-Stack Application  
**Node Version:** v24.21.0  
**Frontend Port:** 5173  
**Backend Port:** 3001  

---

## 1. Current Architecture
- **Frontend:** React 19.2.8 + Vite 8.3.0 (`http://localhost:5173`) with Vanilla CSS design system, dark/light theme support, and responsive layouts.
- **Backend:** Node.js + Express (`http://localhost:3001`) with CORS, centralized error handling, and structured REST routes.
- **AI Integration:** Dify Workflow (`POST /v1/workflows/run`) for PEERCRAFT application with deterministic local matching fallback and transparent score explanations.
- **Data Layer:** File-backed persistent store (`server/data/store.json`) with double-entry auditable ledger, concurrency safety, and PostgreSQL / Supabase migration schema (`server/migrations/001_initial_schema.sql`).
- **Security:** Dify API key strictly isolated on the backend, CORS origin whitelisting (`http://localhost:5173`), request validation schemas, prevention of self-awarded reputation reviews, and transaction idempotency.

---

## 2. Feature Implementation & Verification Status

| Feature | Implemented | Verified | Status Notes |
|---|---|---|---|
| **Frontend Foundation** | Yes | **Yes** | Built cleanly with Vite (`dist/` created in 662ms), zero lint errors with Oxlint |
| **Backend Express Server** | Yes | **Yes** | Running on port 3001, passed all 7 automated unit and integration tests |
| **Health Check (`/api/health`)** | Yes | **Yes** | Returns 200 OK with operational report for server, storage, and Dify status |
| **AI Team Finder** | Yes | **Yes** | Full UI with animated multi-stage loading, candidate ranking, score badges, and invite modal |
| **Student Profiles** | Yes | **Yes** | Search, skill proficiencies visual meters, peer review modals, and live profile editing (`PUT /api/profiles/:id`) |
| **Resource Exchange** | Yes | **Yes** | Category filters, search, upvoting, downloads, and contribution modal awarding +15 credits |
| **Campus Credits & Ledger** | Yes | **Yes** | Authoritative balance (240 CC), auditable transaction ledger, idempotency protection, and perk redemption |
| **Trust & Reputation** | Yes | **Yes** | Verified milestone reviews, self-review rejection, and peer feedback calculations |
| **Student Dashboard** | Yes | **Yes** | Aggregated view of profile, credits balance, reputation score, recent resources, and ledger feed |

---

## 3. Bugs Fixed & Resolved

1. **BUG-001 (Critical):** Missing `src/` directory and frontend entry points (`index.html:11`). Fixed by creating modular React 19 application tree (`main.jsx`, `App.jsx`, `index.css`, components).
2. **BUG-002 (Critical):** Missing Node dependencies in root. Fixed via `npm install` matching lockfile.
3. **BUG-003 (Critical):** Missing backend server directory. Fixed by scaffolding complete Express server (`server/src/app.js`, `server/src/server.js`, services, routes).
4. **BUG-004 (Minor):** Misnamed `gitignore.txt`. Renamed to `.gitignore`.
5. **BUG-005 (Major):** Missing Vite proxy forwarding `/api` to Express port 3001. Fixed in `vite.config.js`.
6. **BUG-006 (Medium):** Missing `lucide-react` `Github` export. Fixed with custom accessible SVG component.
7. **BUG-007 (Medium):** Test server port collision (`EADDRINUSE 3001`). Fixed by cleanly decoupling `app.js` and `server.js`.

---

## 4. Tests & Verification Record

- **Backend Test Suite:** Executed `npm test` in `server/`.
  - Result: 7/7 passing tests across health, team finder, credits ledger, and peer reputation (0 failures, duration 471ms).
- **Frontend Production Build:** Executed `npm run build`.
  - Result: Success in 662ms (`dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js`).
- **Static Code Analysis & Linting:** Executed `npm run lint` (`oxlint`).
  - Result: 0 errors, 0 warnings across 29 files.
- **Live Health Endpoint Check:** Executed `GET http://localhost:3001/api/health`.
  - Result: HTTP 200 OK (`success: true, status: "healthy"`).
- **Live Frontend Dev Server:** Executed `GET http://localhost:5173`.
  - Result: HTTP 200 OK.

---

## 5. Security & Configuration Findings

- `server/.env` configured with placeholders for safe execution. Secrets are never exposed to the client.
- CORS restricted to authorized dev origins.
- Idempotency keys prevent double-crediting in ledger transactions.
- Peer reviews forbid self-evaluation (`reviewerId !== recipientId`).
- PostgreSQL / Supabase schema provided in `server/migrations/001_initial_schema.sql` with check constraints and Row Level Security (RLS) policies.

---

## 6. How to Run the Application

### 1. Start the Backend API Server
```powershell
cd c:\peercraft\server
npm start
# Server listens on http://localhost:3001
```

### 2. Start the Frontend Dev Server
```powershell
cd c:\peercraft
npm run dev
# Vite runs on http://localhost:5173
```

### 3. Run Automated Tests
```powershell
cd c:\peercraft\server
npm test
```

### 4. Run Oxlint Linter
```powershell
cd c:\peercraft
npm run lint
```

### 5. Build for Production
```powershell
cd c:\peercraft
npm run build
```
