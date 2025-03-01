'use client'; // MUST be the very first line

import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
  
    <div >
      <div>
        <SignupForm/>
      </div>
      <button 
        onClick={handleGoogleSignup}
        className="w-full bg-green-600 text-white p-3 rounded hover:bg-blue-700 transition-colors"
      >
        Continue with Google
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}


