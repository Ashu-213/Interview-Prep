# AI Interview Assistant

An AI-powered interview prep app that analyzes your resume, job description, and self-description to generate a personalized interview report with technical/behavioral questions, skill gaps, and a preparation plan.

## Run & Operate

- **Frontend dev**: `cd frontend/Ai-int && npm run dev` (port 5000)
- **Backend dev**: `cd backend && node server.js` (port 3000)
- **Frontend build**: `cd frontend/Ai-int && npm run build`

### Required Secrets
- `MONGO_URL` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `GEMINI_API_KEY` — Google Gemini API key for AI report generation

## Stack

- **Frontend**: React 19, React Router 7, Vite 7, SCSS/Sass
- **Backend**: Node.js 20, Express 5, Mongoose, JWT auth, bcrypt
- **AI**: Google Gemini 2.0 Flash via `@google/genai`
- **File upload**: Multer (PDF resume parsing via pdf-parse)
- **Runtime**: Node.js 20 (NixOS stable-25_05)

## Where things live

- `frontend/Ai-int/src/` — React app source
  - `features/auth/` — Auth context, hooks, pages, services
  - `features/Interview/` — Interview context, hooks, pages, services
  - `appRoutes.jsx` — React Router route definitions
- `backend/src/` — Express app source
  - `controllers/` — Route handlers
  - `routes/` — Express routers
  - `models/` — Mongoose schemas
  - `middlewares/` — Auth + file upload middleware
  - `services/aiServices.js` — Gemini AI integration
  - `config/database.js` — MongoDB connection

## Architecture decisions

- Vite dev server proxies `/api` requests to backend on port 3000, avoiding CORS issues in dev
- JWT tokens stored in httpOnly cookies for security
- Token blacklisting on logout using a MongoDB collection
- AI report schema enforced via Zod + zod-to-json-schema for structured Gemini output
- Frontend uses axios with relative base URLs (works via Vite proxy in dev)

## Product

- User registration and login (JWT cookie auth)
- Upload PDF resume + enter job description + self-description
- AI generates: match score, technical questions, behavioral questions, skill gaps, preparation plan
- View past interview reports (sorted by date)

## User preferences

_Populate as you build_

## Gotchas

- Backend must be running on port 3000 for Vite proxy to work in dev
- `MONGO_URL` must be set or the server will crash on startup
- Frontend `axios` uses relative base URLs — do NOT change to absolute localhost URLs

## Pointers

- AI service: `backend/src/services/aiServices.js`
- DB schema: `backend/src/models/`
- Route map: `backend/src/routes/`
