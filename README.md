# AI Interview Prep

AI interview preparation app with a Node/Express backend and a React/Vite frontend. Users upload a PDF resume plus a job description to generate a structured interview report.

## Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth (cookie-based), Multer, pdf-parse, OpenRouter (via OpenAI SDK)
- Frontend: React, Vite, React Router, Axios, SCSS

## Monorepo Layout

- `backend/` Express API
- `frontend/Ai-int/` React app

## Environment Variables

Create `backend/.env`:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Notes:
- `CORS_ORIGIN` supports comma-separated origins.
- If `PORT` is not set, backend defaults to `3000`.
- Frontend API base URL defaults to `http://localhost:3000` if `VITE_API_URL` is not provided.

Optional frontend env (`frontend/Ai-int/.env`):

```env
VITE_API_URL=http://localhost:3000
```

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3000` by default.

### 2) Frontend

```bash
cd frontend/Ai-int
npm install
npm run dev
```

Frontend runs on Vite's dev URL (typically `http://localhost:5173`).

## API Routes

### Auth (`/api/auth`)

- `POST /register` register user and set auth cookie
- `POST /login` login and set auth cookie
- `GET /logout` clear auth cookie and blacklist token
- `GET /getMe` get current user (protected)

### Interview (`/api/interview`)

- `POST /` generate report (protected, multipart form-data)
    - fields: `resume` (PDF), `jobDescription`, `selfDescription` (optional)
- `GET /` list current user's reports (protected)
- `GET /report/:interviewId` get report by id (protected)

## Current Report Output

Generated report includes:

- `overallScore`
- `title`
- `technicalQuestions`
- `behavioralQuestions`
- `skillGaps`
- `preparationPlan`
