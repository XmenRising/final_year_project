export default function AuthError({ error }) {
  const getErrorMessage = () => {
    switch (error) {
      case 'SESSION_EXPIRED':
        return 'Your session has expired. Please login again.';
      case 'SESSION_REVOKED':
        return 'Your session was revoked. Please re-authenticate.';
      case 'EMAIL_UNVERIFIED':
        return 'Please verify your email to continue.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="auth-error">
      <p>{getErrorMessage()}</p>
      <Link href="/login">Return to Login</Link>
    </div>
  );
}