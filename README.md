 # LinguaLearn

**LinguaLearn** is a modern, full-featured language learning web application built as a Progressive Web App (PWA). It delivers a structured, self-paced curriculum through interactive lessons, spaced-repetition flashcards, and knowledge-check quizzes — all with offline support and real-time cloud sync.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running Locally](#running-locally)
  - [Demo Mode](#demo-mode)
- [Project Structure](#project-structure)
- [Firebase Setup](#firebase-setup)
  - [Firestore Data Model](#firestore-data-model)
  - [Security Rules](#security-rules)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

LinguaLearn is designed for learners at every level — beginner, intermediate, and advanced. The platform tracks individual progress, adapts to offline environments, and syncs seamlessly when connectivity is restored. It is built to be deployed in minutes on Netlify and scaled with Firebase on the back end.

---

## Features

| Feature | Description |
|---|---|
| **Structured Lessons** | Step-by-step lesson viewer with multi-stage content and progress tracking |
| **Spaced-Repetition Flashcards** | Flashcard practice with difficulty scoring and next-review scheduling |
| **Knowledge Quizzes** | Multiple-choice quizzes with per-question explanations and a configurable passing score |
| **Difficulty Levels** | Content tagged Beginner, Intermediate, or Advanced with color-coded filtering |
| **Search & Filter** | Instant search and level filter across the full lesson catalog |
| **Progress Dashboard** | Home screen with completion percentage, lessons-completed count, and a visual progress bar |
| **User Profiles** | Per-user profile with display name, email, and editable settings |
| **Firebase Authentication** | Email/password sign-up and sign-in with full session management |
| **Offline Support** | IndexedDB caching via `idb`; lessons and progress are readable offline |
| **Offline Sync** | Queued progress writes sync back to Firestore automatically when the device comes online |
| **PWA Ready** | Installable on desktop and mobile; service worker managed via Workbox |
| **Netlify Deployment** | Zero-config deploy with SPA redirect rules included |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand |
| **Routing** | React Router DOM 6 |
| **Backend / Auth** | Firebase 10 (Authentication + Firestore) |
| **Offline Storage** | IndexedDB via `idb` |
| **Icons** | Lucide React |
| **PWA** | Workbox Window |
| **Deployment** | Netlify |
| **Linting** | ESLint with TypeScript + React Hooks plugins |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     React SPA                        │
│                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │  Home    │  │ Lessons  │  │    Profile        │  │
│   └──────────┘  └──────────┘  └──────────────────┘  │
│                                                      │
│   ┌──────────────────┐  ┌───────────────────────┐   │
│   │   authStore      │  │     lessonStore        │   │
│   │   (Zustand)      │  │     (Zustand)          │   │
│   └────────┬─────────┘  └──────────┬────────────┘   │
│            │                       │                 │
└────────────┼───────────────────────┼─────────────────┘
             │                       │
     ┌───────▼───────────────────────▼──────┐
     │           Firebase SDK 10             │
     │   ┌──────────────┐  ┌─────────────┐  │
     │   │ Auth         │  │ Firestore   │  │
     │   └──────────────┘  └─────────────┘  │
     └───────────────────────────────────────┘
             │ (offline fallback)
     ┌───────▼──────────────┐
     │   IndexedDB (idb)    │
     │  lessons + progress  │
     └──────────────────────┘
```

**Data flow:**
1. On load, `App.tsx` subscribes to Firebase Auth state and Firestore lesson snapshots.
2. Lesson data is cached to IndexedDB on every Firestore snapshot.
3. When offline, the lesson store falls back to IndexedDB automatically.
4. Progress writes that fail offline are queued and replayed on the `window.online` event.

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Firebase** project with Authentication (Email/Password) and Firestore enabled

### Installation

```bash
git clone https://github.com/Johnv412/sb1-xpc4eg.git
cd sb1-xpc4eg
npm install
```

### Environment Configuration

Copy the example below into a file named `.env` at the project root and fill in your Firebase project values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional — set to true to run without Firebase (see Demo Mode below)
VITE_DEMO_MODE=false
```

> All `VITE_` variables are injected at build time by Vite and are safe for client-side use. Never store server secrets here.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Mode

To preview the full UI without a Firebase project, set `VITE_DEMO_MODE=true` in your `.env` file. In demo mode:

- Authentication is bypassed — the app opens directly to the dashboard.
- A pre-seeded set of five Spanish lessons is loaded from local data.
- Progress tracking and sync are non-persistent (in-memory only).

```env
VITE_DEMO_MODE=true
```

Demo mode is intended for local development and UI review only. Disable it before deploying to production.

---

## Project Structure

```
sb1-xpc4eg/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm.tsx         # Sign-in / sign-up form
│   │   ├── FlashcardComponent.tsx
│   │   ├── LessonCard.tsx       # Lesson grid card
│   │   ├── LessonViewer.tsx     # Step-through lesson modal
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navigation.tsx       # Top nav bar
│   │   ├── OfflineIndicator.tsx # Offline status banner
│   │   └── QuizComponent.tsx    # Multiple-choice quiz modal
│   ├── lib/
│   │   └── firebase.ts          # Firebase app initialization + helpers
│   ├── pages/
│   │   ├── Home.tsx             # Dashboard with progress overview
│   │   ├── Lessons.tsx          # Lesson catalog with search/filter
│   │   └── Profile.tsx          # User profile and stats
│   ├── store/
│   │   ├── authStore.ts         # Auth state (Zustand)
│   │   └── lessonStore.ts       # Lesson + progress state (Zustand)
│   ├── types/
│   │   └── lesson.ts            # Shared TypeScript interfaces
│   ├── utils/
│   │   ├── offlineStorage.ts    # IndexedDB read/write helpers
│   │   ├── seedData.ts          # Initial lesson content + mock data
│   │   └── spaceRepetition.ts   # Spaced-repetition scheduling logic
│   ├── App.tsx                  # Root component, routing, auth listener
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind base styles
├── firestore.rules          # Firestore security rules
├── netlify.toml             # Netlify build + redirect config
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Firebase Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. Under **Authentication → Sign-in method**, enable **Email/Password**.
3. Under **Firestore Database**, create a database in **production mode**.

### 2. Add your web app

In the Firebase console, register a Web app and copy the config values into your `.env` file.

### 3. Seed initial lessons

On first load the app will attempt to read lessons from Firestore. To seed the initial lesson content, call `seedLessons()` from the browser console once after authenticating:

```js
import { seedLessons } from './src/utils/seedData';
await seedLessons();
```

### Firestore Data Model

```
/lessons/{lessonId}
  title         string
  description   string
  content       string
  level         "beginner" | "intermediate" | "advanced"
  duration      number  (minutes)
  flashcards?   array
  quiz?         object

/users/{userId}/progress/{lessonId}
  completed     boolean
  completedAt   string  (ISO 8601)

/users/{userId}/profile/{document}
  displayName   string
  updatedAt     string
```

### Security Rules

The included `firestore.rules` enforce:

- **Lessons** — readable by any authenticated user; not writable by clients.
- **User progress** — readable and writable only by the owning user (`request.auth.uid == userId`).
- **User profile** — readable and writable only by the owning user.

Deploy rules with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

---

## Deployment

LinguaLearn is pre-configured for **Netlify**. To deploy:

1. Push the repository to GitHub.
2. Connect the repo to a new Netlify site.
3. Set the following build settings (already in `netlify.toml`, but verify in the Netlify UI):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
4. Add your `VITE_FIREBASE_*` environment variables in **Netlify → Site Settings → Environment Variables**.
5. Deploy. Netlify will run `npm run build` and serve the `dist/` folder with SPA redirect rules applied.

Every subsequent push to the main branch will trigger an automatic redeploy.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all TypeScript/TSX files |

---

## Roadmap

- [ ] Expand lesson catalog with additional languages (French, German, Mandarin)
- [ ] Leaderboard and social progress sharing
- [ ] Audio pronunciation for vocabulary cards
- [ ] AI-powered adaptive difficulty adjustment
- [ ] Mobile app via React Native or Capacitor
- [ ] Admin dashboard for lesson authoring
- [ ] Stripe integration for premium lesson tiers

---

## Contributing

Contributions are welcome. Please follow this workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with a clear message.
4. Open a pull request against `main` with a description of what changed and why.

Please ensure `npm run lint` passes and the app builds cleanly before submitting a PR.

---

## License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

*Built with React, Firebase, and Tailwind CSS.*
