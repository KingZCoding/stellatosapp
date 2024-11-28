'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/login.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isLogin) {
      // Handle login
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid credentials' : result.error);
      } else {
        // Check for verified user (optional, if verification is required)
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        if (session?.user?.verifiedAt) {
          router.push('/');
        } else {
          setError('Please verify your email before logging in.');
        }
      }
    } else {
      // Handle signup
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(
            'Account created! Check your email for a verification link. Please check your spam folder as well.'
          );
          setIsLogin(true);
        } else {
          setError(data.message || 'Something went wrong.');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch('/api/auth/sendVerificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setSuccessMessage('Verification email resent. Please check your inbox or spam folder.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Signup'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <p className="switch-mode">
        {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
        <button onClick={toggleMode}>{isLogin ? 'Signup' : 'Login'}</button>
      </p>

      {/* Resend Verification (optional) */}
      {isLogin && formData.email && (
        <button onClick={handleResendVerification} className="resend-button">
          Resend Verification Email
        </button>
      )}
    </div>
  );
}
