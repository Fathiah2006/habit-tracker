# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits with local persistence.

## Project Overview

Habit Tracker is a client-side habit tracking application built with Next.js, React, and TypeScript. It allows users to:

- Sign up with email and password
- Log in and log out
- Create, edit, and delete habits
- Mark habits as complete for today
- View current streaks
- Install as a PWA
- Work offline after initial load

All data persists locally in the browser using localStorage.

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create placeholder icon files:
   - `public/icons/favicon.png` (192x192 image)

## Run Instructions

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

Build for production:

```bash
npm run build
npm run start
```

## Test Instructions

Run all tests:

```bash
npm test
```

Run specific test suites:

```bash
npm run test:unit        # Unit tests with coverage
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests with Playwright
```

## Local Persistence Structure

Data is stored in localStorage with three main keys:

### `habit-tracker-users`

Array of user objects:

```json
[
  {
    "id": "unique-id",
    "email": "user@example.com",
    "password": "hashed-password",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `habit-tracker-session`

Current user session or null:

```json
{
  "userId": "unique-id",
  "email": "user@example.com"
}
```

### `habit-tracker-habits`

Array of habit objects:

```json
[
  {
    "id": "habit-id",
    "userId": "user-id",
    "name": "Drink Water",
    "description": "Drink 8 glasses of water",
    "frequency": "daily",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completions": ["2024-01-01", "2024-01-02"]
  }
]
```

## PWA Support Implementation

The application implements PWA features through:

### Manifest (`public/manifest.json`)

- Defines app metadata (name, icons, colors)
- Sets display mode to "standalone"
- Specifies start URL and theme colors

### Service Worker (`public/sw.js`)

- Caches the app shell on first load
- Intercepts fetch requests
- Serves cached content when offline
- Updates cache on subsequent visits

### Service Worker Registration

- Registered in the root layout
- Enables offline functionality
- Allows installation as a PWA

## Trade-offs and Limitations

1. **Local Persistence Only**: Data is stored in localStorage (5-10MB limit depending on browser). No cloud sync or backup.

2. **No Remote Authentication**: Passwords are stored in plain text in localStorage for demo purposes. Never use for production.

3. **Single User Per Browser**: Only one user can be logged in per browser instance.

4. **No Synchronization**: Habits are not synced across devices or browsers.

5. **Limited Offline**: App shell loads offline, but new data cannot be created while offline.

6. **Browser Limitations**: Data persists only in the specific browser and profile where it was created.

## Test Coverage

Tests verify implementation against the technical requirements:

| Test File                               | Purpose                         |
| --------------------------------------- | ------------------------------- |
| `tests/unit/slug.test.ts`               | Habit name slug generation      |
| `tests/unit/validators.test.ts`         | Input validation logic          |
| `tests/unit/streaks.test.ts`            | Current streak calculation      |
| `tests/unit/habits.test.ts`             | Habit completion toggling       |
| `tests/integration/auth-flow.test.tsx`  | Authentication workflows        |
| `tests/integration/habit-form.test.tsx` | Habit CRUD operations           |
| `tests/e2e/app.spec.ts`                 | Full user flows with Playwright |

Minimum 80% line coverage required for `src/lib/` utilities.
