'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkVerification = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(checkVerification);
        router.push('/dashboard');
      }
    }, 5000);

    return () => clearInterval(checkVerification);
  }, [router]);

  const handleResend = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent.');
      } catch (error) {
        console.error('Error sending verification email:', error);
        setMessage('Error sending email. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-700 mb-6">
          We've sent a verification link to your email address.
          <br />
          Please check your inbox and click the link to verify your account.
        </p>
        <button
          onClick={handleResend}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Resend Verification Email
        </button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
