// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

// This check prevents the app from crashing in a serverless environment
// where the admin app might be initialized multiple times.
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    // The private key needs to have newlines escaped in the .env file.
    // This replace call un-escapes them for the SDK.
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the initialized admin instance
export { admin };
