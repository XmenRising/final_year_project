import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { validateFirebaseConfig } from '@/lib/validateEnv';

export default function MyApp({ Component, pageProps }) {
  if (typeof window === 'undefined') {
    validateFirebaseConfig();;
  }
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('Auth state:', user ? 'Authenticated' : 'Not authenticated');
    });
    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}