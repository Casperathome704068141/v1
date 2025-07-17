
// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

// This check prevents the app from crashing in a serverless environment
// where the admin app might be initialized multiple times.
if (!admin.apps.length) {
  // Check that the private key exists. This prevents a crash during build time
  // if the environment variable is not set.
  if (process.env.FIREBASE_PRIVATE_KEY) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      // The private key needs to have newlines escaped in the .env file.
      // This replace call un-escapes them for the SDK.
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Log a warning if the key is not found. This is expected in some build environments.
    // The app will still build, but admin features will fail at runtime if the key is truly missing.
    console.warn("Firebase Admin SDK private key not found, skipping initialization.");
  }
}

// Export the initialized admin instance
export { admin };
