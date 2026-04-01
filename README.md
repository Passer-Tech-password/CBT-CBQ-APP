# CBT & CBQ Application

An advanced Computer-Based Testing (CBT) and Computer-Based Quiz (CBQ) platform built with Next.js 15, Firebase, and Tailwind CSS.

## Features

- **Student Side**:
  - Practice Mode, Timed Exams, and Live CBQ Competitions.
  - Offline-first support with local result caching and auto-sync.
  - Detailed performance analytics with Recharts.
  - Dark/Light mode support.
- **Admin Side**:
  - Question Bank management (CRUD with image support).
  - Competition scheduling and monitoring.
  - System-wide analytics and student activity tracking.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Framer Motion + canvas-confetti
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd CBT-CBQ-EXAM-APP
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run locally
```bash
npm run dev
```

## Deployment

### Vercel
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

## Firebase Security Rules

Ensure your Firestore rules are set for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /results/{resultId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
    }
  }
}
```

## License
MIT
