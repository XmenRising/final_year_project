export const handleFirebaseError = (error) => {
  console.error('Auth Error:', error.code);
  
  const messages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-not-found': 'Account not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/email-already-in-use': 'Email already registered',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    default: 'An error occurred. Please try again.'
  };

  return messages[error.code] || messages.default;
};