import * as admin from "firebase-admin"

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

export function initAdmin() {
  if (!admin.apps.length) {
    if (!firebaseAdminConfig.clientEmail || !firebaseAdminConfig.privateKey) {
      console.warn("Firebase Admin credentials missing. Server-side validation will be disabled.")
      return null
    }

    try {
      return admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
      })
    } catch (error) {
      console.error("Firebase Admin initialization error", error)
      return null
    }
  }
  return admin.app()
}

export const adminAuth = () => {
  const app = initAdmin()
  return app ? admin.auth(app) : null
}

export const adminDb = () => {
  const app = initAdmin()
  return app ? admin.firestore(app) : null
}
