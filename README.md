# Logah — AI-Powered Language Learning Platform

Logah is a full-stack language learning web application that connects Arabic-speaking users with AI-powered video avatars for real-time English conversation practice, complete with session analysis, personalised feedback, and progress tracking.

## The problem

Language learners struggle to find affordable, judgment-free speaking practice. Logah solves this by pairing users with AI avatars (powered by LiveKit + OpenAI) that hold real-time video conversations, adapt dynamically to the user's proficiency level, and deliver post-session grammar and vocabulary feedback.

### Approach & Planning

- Designed the full system in Figma and pitched it early in the course
- Planned using a task board and incremental commits; iterated weekly based on peer feedback
- Used a MERN stack (MongoDB, Express, React, Node.js) with Vite + Tailwind CSS on the frontend
- Integrated LiveKit for WebRTC video streaming and OpenAI for avatar intelligence and session analysis
- Implemented JWT + Passport.js (Local & Google OAuth) for authentication
- Built a bilingual (Arabic/English) interface with full RTL support using React Context
- Applied WCAG 2.1 AA accessibility standards throughout (focus management, ARIA, reduced-motion, keyboard navigation)

### Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | Passport.js (Local + Google OAuth), JWT |
| AI / Video | OpenAI API, LiveKit (WebRTC) |
| Deployment | Azure VM + Coolify (frontend, backend, and MongoDB) |

### What I'd do with more time

- Generate customised exercises targeting each user's specific weaknesses identified from their session history
- Add spaced-repetition vocabulary review between sessions
- Implement native push notifications for daily practice reminders
- Expand avatar personas with more accents and professional domains
- Add a full Lighthouse CI pipeline to maintain the 100 score on every deploy

## View it live

**Frontend:** https://logah.fartist.live

**Backend API:** https://api.logah.fartist.live/api



## Requirements Checklist

| # | Requirement | Status |
|---|---|---|
| 1 | **Frontend: React** | **PASS** — React 18 with Vite |
| 2 | **Backend: Node.js with Express** | **PASS** — Express 4 |
| 3 | **Database: MongoDB** | **PASS** — Mongoose with 4 models (User, Session, Feedback, AppFeedback) |
| 4 | **Authentication** | **PASS** — JWT + bcrypt + Google OAuth, role-based admin guard |
| 5 | **React Router navigation** | **PASS** — v7, nested layouts, 3 route guard types |
| 6 | **Global state management** | **PASS** — 3 Contexts: Auth, Language (i18n/RTL), Theme (dark mode) |
| 7 | **2+ external libraries** | **PASS** — 13+ (LiveKit, Recharts, Axios, Tailwind, bcryptjs, jsonwebtoken, google-auth-library, etc.) |
| 8 | **Non-curriculum React hook** | **PASS** — `useRef`, `useCallback`, `useMemo` + 3 custom hooks (`useAuth`, `useLanguage`, `useTheme`) |
| 9 | **Chrome, Firefox, Safari support** | **PASS** — standard React/Vite build, no browser-specific code |
| 10 | **Responsive 320px–1600px** | **PASS** — mobile-first Tailwind with `sm:`, `md:`, `lg:`, `xl:` breakpoints everywhere |
| 11 | **Accessibility / Lighthouse 100%** | **PASS** — Skip link, semantic HTML, ARIA roles, focus-visible, reduced-motion, `lang` attribute |
| 12 | **Clean Code** | **PASS** — Clear file structure, consistent naming conventions |
| 13 | **Visual: Box model / margins** | **PASS** — `box-sizing: border-box` reset, consistent spacing |
| 14 | **Visual: h1–h6 typography** | **PASS** — Cairo font, consistent heading styles |
| 15 | **Visual: Color scheme** | **PASS** — CSS custom properties, dark mode support |
| 16 | **Visual: Mobile-optimized** | **PASS** — Mobile-first design throughout |


---

