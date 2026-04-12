import * as admin from "firebase-admin"

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.replace(/['"]/g, "").trim(),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.replace(/['"]/g, "").trim(),
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/['"]/g, "").replace(/\\n/g, "\n").trim(),
}

export function initAdmin() {
  if (!admin.apps.length) {
    if (!firebaseAdminConfig.clientEmail || !firebaseAdminConfig.privateKey || !firebaseAdminConfig.projectId) {
      console.warn("Firebase Admin credentials missing. Current values:", {
        projectId: !!firebaseAdminConfig.projectId,
        clientEmail: !!firebaseAdminConfig.clientEmail,
        privateKey: !!firebaseAdminConfig.privateKey,
      })
      return null
    }

    try {
      console.log("Initializing Firebase Admin for project:", firebaseAdminConfig.projectId)
      return admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
        projectId: firebaseAdminConfig.projectId, // Explicitly set projectId
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
