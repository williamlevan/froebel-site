'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/header';
import { useSession } from '../../hooks/useSession';
import '../../styles/shift-detail.scss';

interface Shift {
    _id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    maxVolunteers: number;
    spotsFilled: number;
    createdAt: string;
    createdBy: string;
}

interface Signup {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    shiftId?: string;
    startTime: string;
    endTime: string;
    date: string;
    gradePreference?: string;
    organization?: string;
    location: string;
    type: 'warehouse' | 'school';
    createdAt: string;
}

export default function ShiftDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: sessionLoading } = useSession();
    const [shift, setShift] = useState<Shift | null>(null);
    const [existingSignup, setExistingSignup] = useState<Signup | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gradePreference: '',
        organization: '',
        comments: ''
    });

    useEffect(() => {
        if (sessionLoading) {
            return; // Wait for session to load
        }

        if (!user) {
            router.push('/signin');
            return;
        }

        if (params.id) {
            fetchShiftData(params.id as string);
        }
    }, [params.id, user, sessionLoading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: '',
                gradePreference: '',
                organization: '',
                comments: ''
            });
        }
    }, [user]);

    const fetchShiftData = async (shiftId: string) => {
        try {
            setLoading(true);
            const [shiftResponse, signupResponse] = await Promise.all([
                fetch(`/api/shifts/${shiftId}`),
                fetch(`/api/signups/check?shiftId=${shiftId}&userId=${user?.userId}`)
            ]);

            const shiftData = await shiftResponse.json();
            const signupData = await signupResponse.json();

            if (shiftResponse.ok) {
                setShift(shiftData.shift);
            } else {
                setError(shiftData.error || 'Failed to load shift');
            }

            if (signupResponse.ok && signupData.signup) {
                setExistingSignup(signupData.signup);
            }
        } catch (err) {
            setError('Failed to load shift data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSigningUp(true);
        setMessage('');

        try {
            const response = await fetch('/api/signups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user?.userId,
                    shiftId: shift?._id,
                    startTime: shift?.startTime,
                    endTime: shift?.endTime,
                    date: shift?.date,
                    location: shift?.location,
                    type: 'warehouse'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Successfully signed up for this shift!');
                setExistingSignup(data.signup);
                // Update shift spots filled
                if (shift) {
                    setShift(prev => prev ? { ...prev, spotsFilled: prev.spotsFilled + 1 } : null);
                }
            } else {
                setMessage(data.error || 'Failed to sign up for shift');
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsSigningUp(false);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAvailableSpots = (maxVolunteers: number, spotsFilled: number) => {
        return maxVolunteers - spotsFilled;
    };

    const getDuration = (startTime: string, endTime: string) => {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        return diffHours;
    };

    if (sessionLoading || loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className="shift-detail-page">
                <Header />
                <div className="error-container">
                    <h1>Error</h1>
                    <p>{error}</p>
                    <button onClick={() => router.push('/home')} className="back-button">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!shift) {
        return (
            <div className="shift-detail-page">
                <Header />
                <div className="error-container">
                    <h1>Shift Not Found</h1>
                    <p>The shift you're looking for doesn't exist.</p>
                    <button onClick={() => router.push('/home')} className="back-button">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="shift-detail-page">
            <Header />

            <main className="shift-detail-main">
                <div className="container">
                    <div className="shift-detail-card">
                        <div className="shift-header">
                            <h1 className="shift-title">{shift.title}</h1>
                            <div className="shift-meta">
                                <span className="shift-date">{formatDate(shift.date)}</span>
                                <span className="shift-time">
                                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                </span>
                                <span className="shift-duration">({getDuration(shift.startTime, shift.endTime)} hours)</span>
                            </div>
                        </div>

                        <div className="shift-details">
                            <div className="detail-section">
                                <h3>Location</h3>
                                <p><span className="icon">📍</span> {shift.location}</p>
                            </div>

                            <div className="detail-section">
                                <h3>Volunteer Spots</h3>
                                <p>
                                    <span className="icon">👤</span> {shift.spotsFilled}/{shift.maxVolunteers} spots filled
                                    ({getAvailableSpots(shift.maxVolunteers, shift.spotsFilled)} available)
                                </p>
                                <div className="spots-progress">
                                    <div
                                        className="spots-filled"
                                        style={{ width: `${(shift.spotsFilled / shift.maxVolunteers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Description</h3>
                                <p className="shift-description">{shift.description}</p>
                            </div>
                        </div>

                        {existingSignup ? (
                            <div className="already-signed-up">
                                <h3>✅ You're already signed up for this shift!</h3>
                                <p>Thank you for volunteering. We'll see you on {formatDate(shift.date)} at {formatTime(shift.startTime)}.</p>
                                <button onClick={() => router.push('/home')} className="back-button">
                                    Back to All Shifts
                                </button>
                            </div>
                        ) : (
                            <div className="signup-form-section">
                                <h3>Sign Up for This Shift</h3>
                                <form onSubmit={handleSignUp} className="signup-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="(123) 456-7890"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="comments">Comments/Questions (Optional)</label>
                                        <textarea
                                            id="comments"
                                            name="comments"
                                            value={formData.comments}
                                            onChange={handleInputChange}
                                            placeholder="Any additional comments or questions..."
                                            rows={3}
                                        />
                                    </div>

                                    {message && (
                                        <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
                                            {message}
                                        </div>
                                    )}

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="signup-button"
                                            disabled={isSigningUp}
                                        >
                                            {isSigningUp ? 'Signing Up...' : 'Confirm Sign Up'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push('/home')}
                                            className="back-button"
                                        >
                                            Back to All Shifts
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
