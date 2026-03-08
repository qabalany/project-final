# Logah — Frontend

React-based single-page application for the Logah AI language learning platform.

## Tech Stack

- **React 18** with Vite for fast dev/build
- **Tailwind CSS v4** for utility-first styling
- **React Router v7** for client-side routing
- **Context API** for global state (Auth, Language/i18n, Theme)
- **Axios** for HTTP requests
- **Recharts** for analytics charts
- **LiveKit** (`@livekit/components-react`, `livekit-client`) for real-time video/audio avatar sessions

## Key Features

- JWT + Google OAuth authentication
- Bilingual interface (Arabic/English) with full RTL support
- Dark/light mode toggle
- Real-time AI avatar video sessions via WebRTC
- 7-step post-session feedback wizard
- Admin dashboard with session analytics and charts
- Fully responsive (320px–1600px+), mobile-first design
- WCAG 2.1 AA accessibility (skip link, ARIA, focus management, reduced-motion)

## Non-Curriculum React Hooks Used

- `useRef` — DOM references, timers, session state in AvatarSession
- `useCallback` — memoised handlers to prevent unnecessary re-renders
- `useMemo` — computed data for charts and analytics
- Custom hooks: `useAuth()`, `useLanguage()`, `useTheme()`

## Getting Started

1. Install dependencies: `npm install`
2. Create a `.env` file (see below)
3. Start the dev server: `npm run dev`

### Environment Variables

```
VITE_BACKEND_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Build for Production

```
npm run build
npm run preview
```