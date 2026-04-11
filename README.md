# CBT & CBQ Excellence Platform

A professional, high-performance Computer-Based Testing (CBT) and Case-Based Questions (CBQ) application designed for educational excellence. Built with Next.js 15, Firebase, and Tailwind CSS, this platform provides a seamless examination experience with offline support, real-time analytics, and professional PDF result exporting.

## 🚀 Key Features

- **Advanced CBT & CBQ Engine**: Support for multiple choice and complex case-based questions with deep educational insights.
- **Professional PDF Exporting**: Beautifully designed, official result reports with performance pie charts and detailed question breakdowns.
- **Admin Dashboard**: Comprehensive system overview with student management, analytics, and competition building.
- **Offline Support**: Robust persistence layer ensuring exams can be taken even with intermittent internet connectivity.
- **Security & Anti-Cheat**: Tab switching detection, question randomization, and secure authentication.
- **Modern UI/UX**: Clean, responsive Material 3 design system with smooth animations and dark mode support.
- **Performance Analytics**: Real-time tracking of student progress and system-wide performance metrics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Authentication & Database**: [Firebase](https://firebase.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cbt-cbq-exam-app.git
   cd cbt-cbq-exam-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Copy the contents from `.env.example` and fill in your Firebase credentials.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔥 Firebase Setup

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Create a **Firestore Database** in test mode (or production with appropriate rules).
4. Go to Project Settings > General > Your apps and add a Web app to get your config object.
5. (Optional) For admin features, generate a new private key in Project Settings > Service accounts and add the credentials to your environment variables.

## ☁️ Vercel Deployment

1. Push your code to a GitHub repository.
2. Import the project in [Vercel](https://vercel.com/).
3. Add all environment variables from your `.env.local` to the Vercel project settings.
4. Click **Deploy**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for educational excellence.
