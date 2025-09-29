'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/header';
import '../../styles/signin.scss';

function SignInSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      setMessage('Please fill in both first and last name.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'volunteer' // Default role for new users
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account created successfully, redirect to home with success message
        router.push(`/home?login=success&email=${encodeURIComponent(email || '')}`);
      } else {
        setMessage(data.error || 'Failed to create account. Please try again.');
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
            <h1 className="signin-title">Welcome to Froebel School Volunteer Portal</h1>
            <p className="signin-subtitle">
              We're excited to have you join our volunteer community! Please complete your profile to get started.
            </p>
            
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email || ''}
                  disabled
                  className="disabled-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="signin-button"
                disabled={isLoading || !firstName.trim() || !lastName.trim()}
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignInSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInSuccessContent />
    </Suspense>
  );
}
