'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import { useSession } from '../hooks/useSession';
import '../styles/admin.scss';
import MyShiftList from '../components/MyShiftList';
import ShiftManagementList from '../components/ShiftManagementList';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  type: string; // Add this line
}

interface GroupedShifts {
  [date: string]: Shift[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AdminPage() {
  const { user, loading, logout } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  // Shift creation form state
  const [shiftForm, setShiftForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    maxVolunteers: '',
    spotsFilled: '0'
  });
  const [isCreatingShift, setIsCreatingShift] = useState(false);
  const [shiftMessage, setShiftMessage] = useState('');

  const [shifts, setShifts] = useState<GroupedShifts>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [shiftsLoading, setShiftsLoading] = useState(false);
  const [shiftsError, setShiftsError] = useState('');
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const [myShifts, setMyShifts] = useState<GroupedShifts>({});
  const [myShiftsPagination, setMyShiftsPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [myShiftsLoading, setMyShiftsLoading] = useState(false);
  const [myShiftsError, setMyShiftsError] = useState('');

  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [blackoutLoading, setBlackoutLoading] = useState(false);
  const [blackoutMessage, setBlackoutMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
    if (user && user.role !== 'admin') {
      router.push('/user');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchShifts(1);
    }
  }, [user]);

  // Add this useEffect to fetch user's shifts
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMyShifts(1);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchBlackoutDates();
    }
  }, [user]);

  const fetchShifts = async (page: number) => {
    try {
      setShiftsLoading(true);
      const response = await fetch(`/api/shifts?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setShifts(data.shifts);
        setPagination(data.pagination);
        setShiftsError('');
      } else {
        setShiftsError('Failed to load shifts');
      }
    } catch (err) {
      setShiftsError('Failed to load shifts');
    } finally {
      setShiftsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchShifts(newPage);
  };

  const fetchMyShifts = async (page: number) => {
    try {
      setMyShiftsLoading(true);
      const response = await fetch(`/api/signups/my-shifts?page=${page}&limit=10&userId=${user?.userId}`);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setMyShifts(data.shifts);
        setMyShiftsPagination(data.pagination);
        setMyShiftsError('');
      } else {
        setMyShiftsError('Failed to load your shifts');
      }
    } catch (err) {
      setMyShiftsError('Failed to load your shifts');
    } finally {
      setMyShiftsLoading(false);
    }
  };

  const handleMyShiftsPageChange = (newPage: number) => {
    fetchMyShifts(newPage);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setActiveTab('create');
    // Pre-fill the form with the shift data
    setShiftForm({
      title: shift.title,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      location: shift.location,
      description: shift.description,
      maxVolunteers: shift.maxVolunteers.toString(),
      spotsFilled: shift.spotsFilled.toString()
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShiftInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShiftForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.userId,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account updated successfully!');
        setIsEditing(false);
        window.location.reload();
      } else {
        setMessage(data.error || 'Failed to update account');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingShift(true);
    setShiftMessage('');

    try {
      const response = await fetch('/api/shift/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shiftForm),
      });

      const data = await response.json();

      if (response.ok) {
        setShiftMessage('Shift created successfully!');
        setShiftForm({
          title: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
          description: '',
          maxVolunteers: '',
          spotsFilled: '0'
        });
      } else {
        setShiftMessage(data.error || 'Failed to create shift');
      }
    } catch (error) {
      setShiftMessage('Something went wrong. Please try again.');
    } finally {
      setIsCreatingShift(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/home');
  };

  const fetchBlackoutDates = async () => {
    try {
      setBlackoutLoading(true);
      const response = await fetch('/api/blackout-dates');
      const data = await response.json();
      
      if (response.ok) {
        setBlackoutDates(data.dates);
      } else {
        setBlackoutMessage('Failed to load blackout dates');
      }
    } catch (error) {
      setBlackoutMessage('Failed to load blackout dates');
    } finally {
      setBlackoutLoading(false);
    }
  };

  const handleDateClick = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    try {
      if (blackoutDates.includes(dateString)) {
        // Remove blackout date
        const response = await fetch(`/api/blackout-dates?date=${dateString}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setBlackoutDates(prev => prev.filter(d => d !== dateString));
          setBlackoutMessage('Blackout date removed');
        } else {
          setBlackoutMessage('Failed to remove blackout date');
        }
      } else {
        // Add blackout date
        const response = await fetch('/api/blackout-dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateString })
        });
        
        if (response.ok) {
          setBlackoutDates(prev => [...prev, dateString]);
          setBlackoutMessage('Blackout date added');
        } else {
          setBlackoutMessage('Failed to add blackout date');
        }
      }
    } catch (error) {
      setBlackoutMessage('Something went wrong');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  if (user.role !== 'admin') {
    return null; // Will redirect to user page
  }

  return (
    <div className="admin-page">
      <Header />

      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-header">
            <div className="admin-tabs">
              <button
                className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                My Account
              </button>
              <button
                className={`tab-button ${activeTab === 'my-shifts' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-shifts')}
              >
                My Shifts
              </button>
              <button
                className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                {editingShift ? 'Edit Shift' : 'Create New Shift'}
              </button>
              <button
                className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
                onClick={() => setActiveTab('manage')}
              >
                Manage Shifts
              </button>
              <button
                className={`tab-button ${activeTab === 'blackout' ? 'active' : ''}`}
                onClick={() => setActiveTab('blackout')}
              >
                Blackout Dates
              </button>
            </div>
          </div>

          {activeTab === 'account' && (
            <div className="admin-card">
              <h2 className="card-title">My Account</h2>

              <div className="account-info">
                <div className="info-item">
                  <label>Email</label>
                  <span className="info-value">{user.email}</span>
                </div>

                <div className="info-item">
                  <label>Role</label>
                  <span className="info-value">{user.role}</span>
                </div>
              </div>

              <form onSubmit={handleSave} className="account-form">
                <h3>Personal Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
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
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                {message && (
                  <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="form-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-button"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="edit-button"
                    >
                      Edit Information
                    </button>
                  )}
                </div>
              </form>

              <div className="account-actions">
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === 'my-shifts' && (
            <div className="my-shifts-section">
              <h2>My Shifts</h2>
              <MyShiftList
                shifts={myShifts}
                pagination={myShiftsPagination}
                loading={myShiftsLoading}
                error={myShiftsError}
                onPageChange={handleMyShiftsPageChange}
              />
            </div>
          )}

          {activeTab === 'create' && (
            <div className="admin-card">
              <h2 className="card-title">
                {editingShift ? 'Edit Shift' : 'Create New Shift'}
              </h2>

              <form onSubmit={handleCreateShift} className="shift-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Shift Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={shiftForm.title}
                      onChange={handleShiftInputChange}
                      placeholder="e.g., Saturday Cook & Pack"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={shiftForm.date}
                      onChange={handleShiftInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={shiftForm.startTime}
                      onChange={handleShiftInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={shiftForm.endTime}
                      onChange={handleShiftInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={shiftForm.location}
                      onChange={handleShiftInputChange}
                      placeholder="e.g., 3117 Olive Street, St. Louis, MO 63103"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxVolunteers">Max Volunteers</label>
                    <input
                      type="number"
                      id="maxVolunteers"
                      name="maxVolunteers"
                      value={shiftForm.maxVolunteers}
                      onChange={handleShiftInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={shiftForm.description}
                    onChange={handleShiftInputChange}
                    placeholder="Describe what volunteers will be doing..."
                    rows={4}
                    required
                  />
                </div>

                {shiftMessage && (
                  <div className={`message ${shiftMessage.includes('success') ? 'success' : 'error'}`}>
                    {shiftMessage}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="create-button"
                    disabled={isCreatingShift}
                  >
                    {isCreatingShift ? 'Creating...' : 'Create Shift'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="manage-shifts-section">
              <h2>Manage Shifts</h2>
              <ShiftManagementList
                shifts={shifts}
                pagination={pagination}
                loading={shiftsLoading}
                error={shiftsError}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {activeTab === 'blackout' && (
            <div className="admin-card">
              <h2 className="card-title">Blackout Dates</h2>
              <p>Click on dates to toggle blackout status. Blacked out dates will prevent new signups.</p>
              
              <div className="calendar-container">
                <Calendar
                  onClickDay={handleDateClick}
                  tileClassName={({ date }) => {
                    const dateString = date.toISOString().split('T')[0];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = date < today;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
                    const isBlackedOut = blackoutDates.includes(dateString);
                    
                    let className = '';
                    if (isBlackedOut) {
                      className += ' blackout-date';
                    }
                    if (isPast || isWeekend) {
                      className += ' disabled-date';
                    }
                    return className;
                  }}
                  tileContent={({ date }) => {
                    const dateString = date.toISOString().split('T')[0];
                    return blackoutDates.includes(dateString) ? (
                      <div className="blackout-indicator">🚫</div>
                    ) : null;
                  }}
                  formatShortWeekday={(locale, date) => {
                    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                    return weekdays[date.getDay()];
                  }}
                  locale="en-US"
                  tileDisabled={({ date }) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = date < today;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return isPast || isWeekend;
                  }}
                />
              </div>
              
              {blackoutMessage && (
                <div className={`message ${blackoutMessage.includes('success') || blackoutMessage.includes('added') || blackoutMessage.includes('removed') ? 'success' : 'error'}`}>
                  {blackoutMessage}
                </div>
              )}
              
              <div className="blackout-list">
                <h3>Current Blackout Dates:</h3>
                {blackoutDates.length === 0 ? (
                  <p>No blackout dates set</p>
                ) : (
                  <ul>
                    {blackoutDates.map(date => (
                      <li key={date}>
                        {new Date(date).toLocaleDateString()}
                        <button 
                          onClick={() => handleDateClick(new Date(date))}
                          className="remove-blackout-btn"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
