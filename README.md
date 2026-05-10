# AI Interview Prep

An AI-powered interview preparation platform that generates personalized questions and guidance based on your resume and target job description.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Node.js, Express 5, MongoDB (Mongoose), Google Gemini AI, JWT, Multer, pdf-parse |
| Frontend | React 19, Vite, React Router, Axios, SCSS |

## Project Structure

```
Interview-Prep/
├── backend/          # Express REST API (port 3000)
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── models/       # Mongoose schemas (User, InterviewReport)
│   │   ├── routes/       # auth.js, interview.js
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Gemini AI integration
│   │   └── middlewares/  # Auth, file upload
│   └── server.js
└── frontend/Ai-int/  # React + Vite app (port 5173)
    └── src/
        ├── features/auth/      # Login / Register
        └── features/Interview/ # Interview form & report view
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

```bash
npm start        # http://localhost:3000
```

### Frontend

```bash
cd frontend/Ai-int
npm install
npm run dev      # http://localhost:5173
```

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT cookie |
| POST | `/logout` | Clear auth cookie |
| GET | `/getMe` | Get current authenticated user |

### Interview — `/api/interview`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Generate report (multipart: `resume` PDF, `jobDescription`, `selfDescription`) |
| GET | `/` | List all reports for current user |
| GET | `/report/:interviewId` | Get a specific report |

## How It Works

1. Register or log in
2. Upload your PDF resume and enter the job description
3. The backend parses the PDF, sends data to Gemini AI, and returns:
   - Overall match score (0–100)
   - 5–7 technical questions with answers and interviewer intent
   - 5–7 behavioral questions with STAR-method guidance
   - Skill gap analysis and a custom preparation plan
4. Reports are saved to MongoDB and accessible any time

## License

ISC
