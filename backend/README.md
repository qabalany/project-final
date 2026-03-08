# Logah — Backend API

RESTful API server powering the Logah AI language learning platform.

## Tech Stack

- **Node.js** with **Express**
- **MongoDB** with **Mongoose** (4 models: User, Session, Feedback, AppFeedback)
- **JWT** (`jsonwebtoken`) + **bcryptjs** for authentication
- **Google Auth Library** for OAuth 2.0
- **OpenAI API** for session transcript analysis (CEFR grading)
- **LiveAvatar API** for AI avatar video sessions

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login with email/password |
| POST | `/api/users/google` | Google OAuth login |
| GET | `/api/users/profile` | Get current user profile |
| PATCH | `/api/users/profile` | Update user profile |
| POST | `/api/avatar/create-session` | Create an AI avatar session |
| POST | `/api/avatar/start-session` | Start LiveKit video stream |
| POST | `/api/avatar/stop-session` | Stop session and log to DB |
| POST | `/api/avatar/analyze-session` | AI-powered transcript analysis |
| POST | `/api/feedback` | Submit post-session feedback |
| GET | `/api/feedback` | Get all feedback (admin) |
| POST | `/api/app-feedback` | Submit app bug report/suggestion |
| GET | `/api/app-feedback` | Get all app feedback (admin) |
| GET | `/api/analytics/summary` | Admin analytics summary |

## Getting Started

1. Install dependencies: `npm install`
2. Create a `.env` file (see below)
3. Start the dev server: `npm run dev`

### Environment Variables

```
PORT=8080
MONGO_URI=mongodb://localhost:27017/logah
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_key
LIVEAVATAR_API_KEY=your_liveavatar_key
```

## Seed Data

The server automatically seeds a demo user and admin user on first startup if the database is empty.