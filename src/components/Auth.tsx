import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface AuthProps {
  onAuthStateChange: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthStateChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuthStateChange(result.user);
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onAuthStateChange(null);
    } catch (err) {
      console.error(err);
      setError('Çıkış yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="auth-container">
      {auth.currentUser ? (
        <div className="user-info">
          <span>Hoş geldin, {auth.currentUser.displayName}!</span>
          <button
            onClick={handleSignOut}
            className="sign-out-btn"
            disabled={loading}
          >
            Çıkış Yap
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="sign-in-btn"
          disabled={loading}
        >
          Google ile Giriş Yap
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};