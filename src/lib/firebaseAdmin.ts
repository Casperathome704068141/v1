
// src/lib/firebaseAdmin.ts
import 'server-only';
import admin from 'firebase-admin';

// This check prevents the app from crashing in a serverless environment
// where the admin app might be initialized multiple times.
if (!admin.apps.length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn("Firebase Admin SDK private key not found, skipping initialization.");
  }
}

// Export the initialized admin instance and auth service
const auth = admin.apps.length ? admin.auth() : null;
export { admin, auth };
