// pages/api/validate-session.js
import { adminAuth } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  try {
    const { sessionCookie } = req.body;
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    res.status(200).json({ valid: true, uid: decodedClaims.uid });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
}