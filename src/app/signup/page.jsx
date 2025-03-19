'use client';

import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <SignupForm/>
    </div>
  );
}