# CBT & CBQ Exam App - Project Manual & User Guide

Welcome to the **CBT & CBQ Exam App**, an advanced Computer-Based Testing and Quiz platform designed for students and educators.

---

## 🚀 Getting Started

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up your environment variables in `.env.local`:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
4.  Run the development server: `npm run dev`

### Firebase Security Rules
To fix "Firestore Access Denied" issues, ensure you have deployed the following rules in your Firebase Console -> Firestore -> Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { 
      return isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; 
    }
    
    match /users/{userId} { allow read, write: if isAuthenticated() && (request.auth.uid == userId || isAdmin()); }
    match /subjects/{subjectId} { allow read: if isAuthenticated(); allow write: if isAdmin(); }
    match /questions/{questionId} { allow read: if isAuthenticated(); allow write: if isAdmin(); }
    match /results/{resultId} { 
      allow read: if isAuthenticated() && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 👨‍💼 Admin/Teacher Guide

### 1. Managing Subjects
Navigate to **Subjects** in the sidebar to:
-   **Seed Defaults**: Quickly add common primary school subjects (English, Maths, Quantitative Reasoning, Verbal Reasoning, General Paper) with one click.
-   **Add New Subjects**: Manually include any other subjects required.
-   **Edit/Delete**: Update subject descriptions or remove them.
-   **Categories**: Organize subjects into categories (e.g., Primary, Secondary).

### 2. Question Bank
Navigate to **Questions** to manage your test questions:
-   **Numbering**: All questions are automatically numbered for easy tracking in the management table.
-   **Time Allocation**: Specify a time limit (in seconds) for each question. The total test time is calculated based on these individual limits.
-   **Difficulty Levels**: Categorize questions into Easy, Medium, or Hard.
-   **Dynamic Selection**: Subjects are fetched directly from your managed subjects list.

### 3. Analytics & Live Scores
Navigate to **Analytics** to monitor performance:
-   **Live Scoreboard**: View real-time test submissions as students complete them, including student names, subjects, and scores.
-   **System Metrics**: Track total tests taken, active students, and average pass rates.
-   **Performance Trends**: Visualize daily average scores and pass/fail distributions.
-   **Export Reports**: Generate PDF reports of system performance.

---

## 🎓 Student Guide

### 1. Dashboard
-   **Subject Grid**: View and select available subjects.
-   **Performance Overview**: Track your scores and progress over time.

### 2. Taking a Quiz
-   **Numbered Questions**: Easily see your progress through the test.
-   **Timed Tests**: Keep an eye on the countdown timer.
-   **Instant Results**: Get your score and accuracy report immediately after submission.
-   **Explanations**: Review correct answers and detailed explanations for every question.

---

## 🛠 Features
-   **Dynamic Subject Management**: Admins can add any subject (Primary or Secondary).
-   **Real-time Synchronization**: Live updates for scores and analytics.
-   **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
-   **Offline Support**: Basic offline capabilities for interrupted connections.

---

*This manual was generated on 2026-04-27.*
