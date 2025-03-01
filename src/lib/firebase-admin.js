import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!global.firebaseAdminApp) {
  global.firebaseAdminApp = initializeApp({
    credential: cert(serviceAccount)
  });
}

export const auth = getAuth(global.firebaseAdminApp);