# AI Interview Prep

An AI-powered interview preparation platform that generates personalized interview questions and guidance based on your resume and target job description.

## 🎯 Features

- **User Authentication**: Secure registration & login with JWT tokens
- **Resume Parsing**: Upload PDF resumes and extract text content
- **AI-Generated Interview Prep**:
  - Overall match score (0-100)
  - 5-7 technical questions with detailed answers & interviewer intentions
  - 5-7 behavioral questions with STAR method guidance
  - Skill gaps analysis
  - Custom preparation plan
- **Report Storage**: Save and retrieve all interview reports
- **Responsive UI**: React-based frontend with SCSS styling

## 🏗️ Architecture

```
AI_Interview/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── models/   # MongoDB schemas
│   │   ├── routes/   # API endpoints
│   │   ├── controllers/   # Business logic
│   │   ├── services/      # AI integration
│   │   └── middlewares/   # Auth, file upload
│   └── server.js
└── frontend/Ai-int/  # React + Vite
    ├── src/
    │   ├── features/auth/     # Login/Register
    │   ├── features/Interview/ # Main interview page
    │   └── styles/
    └── vite.config.js
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Google Gemini AI API
- JWT Authentication
- PDF parsing

**Frontend:**
- React 19
- Vite
- React Router
- Axios
- SCSS

## 📋 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Google Gemini API key
- OpenAI API key (optional)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
CORS_ORIGIN=http://localhost:5000
```

Start server:
```bash
npm start
# Runs on port 3000
```

### Frontend Setup
```bash
cd frontend/Ai-int
npm install
npm run dev
# Runs on http://localhost:5000
```

## 🚀 API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/getMe` - Get current user

### Interview
- `POST /api/interview/` - Generate interview report (form: resume PDF, jobDescription, selfDescription)
- `GET /api/interview/` - Get all user's reports
- `GET /api/interview/report/:interviewId` - Get specific report

## 📝 Usage Workflow

1. **Register/Login** → Create account or sign in
2. **Upload Resume** → Upload PDF resume file
3. **Enter Details** → Job description & self-description
4. **Generate Report** → AI generates personalized interview prep
5. **View Report** → Review questions, answers, skill gaps & prep plan
6. **Track Progress** → Access all past reports anytime

## 🔑 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@google/genai` | Google Gemini AI API |
| `pdf-parse@1.1.1` | PDF text extraction |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT authentication |
| `multer` | File upload handling |
| `bcrypt` | Password hashing |
| `axios` | HTTP client |

## 📦 Database Schema

**User**
- email, password, createdAt

**Interview Report**
- userId, resume, jobDescription, selfDescription
- overallScore, title, technicalQuestions, behavioralQuestions
- skillGaps, preparationPlan, createdAt

## ⚠️ Known Issues & Fixes

- **pdf-parse version**: Ensure `v1.1.1` is installed (not v2.4.5)
- **API Keys**: Must be set in `.env` before starting backend
- **CORS**: Frontend must match CORS_ORIGIN setting

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes via authMiddleware
- File upload validation (PDF only)

## 📄 License

ISC

## 👤 Author

AI Interview Prep Team

---

**Last Updated**: May 2026 | **Status**: Active Development
