import { adminAuth } from '@/lib/firebase-admin';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;
    
    // Verify and create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000 // 5 days
    });

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('__session', sessionCookie, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5 // 5 days
    }));

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Login API Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}