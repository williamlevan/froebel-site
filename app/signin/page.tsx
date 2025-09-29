'use client';

import { useState } from 'react';
import Header from '../components/header';
import '../styles/signin.scss';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Check your email for a magic link to sign in!');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <Header />
      
      <main className="signin-main">
        <div className="signin-container">
          <div className="signin-card">
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">
              Enter your email address and we'll send you a magic link to sign in.
            </p>
            
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="signin-button"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            {message && (
              <div className={`message ${message.includes('Check your email') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
