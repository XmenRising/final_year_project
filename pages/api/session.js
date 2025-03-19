import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  try {
    const sessionCookie = req.cookies.__session;
    
    if (!sessionCookie) {
      return res.status(401).json({ 
        valid: false,
        error: 'NO_SESSION',
        message: 'No authentication session found'
      });
    }

    // Verify session cookie with revocation check
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie, 
      true // Check if token is revoked
    );

    // Additional security checks
    if (!decodedClaims.email_verified) {
      return res.status(403).json({
        valid: false,
        error: 'EMAIL_UNVERIFIED',
        message: 'Email address not verified'
      });
    }

    // Get fresh user data from Firestore
    const userRecord = await adminAuth.getUser(decodedClaims.uid);
    
    return res.status(200).json({
      valid: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        metadata: userRecord.metadata,
        customClaims: userRecord.customClaims
      }
    });

  } catch (error) {
    console.error('Session verification error:', error.message);
    
    // Different error handling for various scenarios
    const errorMap = {
      'auth/session-cookie-expired': {
        code: 401,
        error: 'SESSION_EXPIRED',
        message: 'Session has expired'
      },
      'auth/session-cookie-revoked': {
        code: 401,
        error: 'SESSION_REVOKED',
        message: 'Session was revoked'
      },
      'auth/argument-error': {
        code: 400,
        error: 'INVALID_SESSION',
        message: 'Invalid session format'
      }
    };

    const errorInfo = errorMap[error.code] || {
      code: 500,
      error: 'SERVER_ERROR',
      message: 'Internal server error'
    };

    return res.status(errorInfo.code).json({
      valid: false,
      error: errorInfo.error,
      message: errorInfo.message,
      // Only include stack in development
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}