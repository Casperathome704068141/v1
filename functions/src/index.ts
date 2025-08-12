import * as https from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const setUserRole = https.onCall(async (req) => {
  if (req.auth?.token?.role !== 'admin') {
    throw new https.HttpsError('permission-denied', 'Admin only');
  }
  const { uid, role } = req.data as { uid: string; role: 'user' | 'staff' | 'admin' };
  await admin.auth().setCustomUserClaims(uid, { role });
  return { ok: true };
});

