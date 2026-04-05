# Nigeria CBT & CBQ Excellence Platform 🇳🇬

An advanced, production-ready Computer-Based Testing (CBT) and Competency-Based Quiz (CBQ) platform built with **Next.js 15**, **Firebase**, and **Tailwind CSS**. Designed specifically for Nigerian educational contexts with a modern Material 3 aesthetic.

## 🚀 Features

### Student Experience
- **Practice Mode**: Untimed sessions for self-paced learning with instant feedback and educational insights.
- **Timed Exams**: Realistic examination simulation with robust countdown timers and auto-submission logic.
- **Live CBQ Competitions**: Real-time nationwide challenges with dynamic leaderboards and participant tracking.
- **Offline-First Support**: Seamlessly continue tests during network outages. Results are cached locally and auto-synced when connection returns.
- **Advanced Anti-Cheat**: Detects tab switching, window blurring, and unauthorized activity with warning thresholds and auto-disqualification.
- **Performance Analytics**: Visual data tracking using Recharts to monitor score trends, subject mastery, strengths, and weaknesses.

### Admin Experience
- **Question Bank Management**: Full CRUD operations for questions across multiple subjects, difficulties, and types (MCQ, Multiple Select, etc.).
- **Live Monitoring**: Track active competitions and student participation in real-time.
- **Role-Based Access**: Secure admin-only dashboard for system configuration and data management.
- **Quiz Builder**: Tools to create and schedule upcoming competitions.

### Technical Excellence
- **Material 3 Design**: Clean, modern UI with Deep Blue (#1E3A8A) and Emerald Green (#10B981) color system.
- **Optimized Performance**: High-quality loading skeletons on all data-heavy screens for a smooth UX.
- **PWA Ready**: Mobile-optimized manifest for an app-like experience on Android and iOS.
- **Confetti Animations**: Celebratory animations for high-scoring students.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore with Persistence, Storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js 18.x or higher
- A Firebase project

### 2. Clone & Install
```bash
git clone <repository-url>
cd CBT-CBQ-EXAM-APP
npm install
```

### 3. Environment Variables
Create a `.env.local` file (or copy `.env.example`) and fill in your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Development Server
```bash
npm run dev
```

## ☁️ Deployment Guide

### Vercel Deployment (Recommended)
1. **Connect Repository**: Push your code to GitHub/GitLab/Bitbucket.
2. **New Project**: In Vercel, import your repository.
3. **Environment Variables**: Add all variables from `.env.local` to the Vercel project settings.
4. **Build Settings**: Vercel will automatically detect Next.js. Click **Deploy**.

### Firebase Configuration
1. **Firestore**: Enable Firestore in your project. Create collections: `users`, `questions`, `results`.
2. **Authentication**: Enable Email/Password or Google authentication.
3. **Security Rules**: Deploy the following rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile access
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Admin only write access for questions
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    // Results access
    match /results/{resultId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
    }
  }
}
```

## 📄 License
MIT © [Your Name/Organization]
