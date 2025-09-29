'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import ShiftList from '../components/ShiftList';
import { useSession } from '../hooks/useSession';
import '../styles/home.scss';

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

export default function HomePage() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [shifts, setShifts] = useState<GroupedShifts>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const { user, loading: sessionLoading } = useSession();

  const [schoolFormData, setSchoolFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    date: '',
    arrivalTime: '',
    departureTime: '',
    gradePreference: '',
    organization: '',
    comments: ''
  });

  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);

  useEffect(() => {
    const loginStatus = searchParams.get('login');

    if (loginStatus === 'success') {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);

      window.history.replaceState({}, '', '/home');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchShifts(1);
  }, []);

  useEffect(() => {
    if (user) {
      setSchoolFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchShifts = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shifts?page=${page}&limit=10`);
      const data = await response.json();

      console.log('�� Home page received data:', data); // Add this line

      if (response.ok) {
        setShifts(data.shifts);
        setPagination(data.pagination);
        setError('');
      } else {
        setError('Failed to load shifts');
      }
    } catch (err) {
      setError('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchShifts(newPage);
  };

  const handleSchoolFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If it's a date change, check if it's a weekend
    if (name === 'date' && value) {
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();
      
      // If it's Saturday (6) or Sunday (0), clear the date
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setSchoolFormData(prev => ({
          ...prev,
          [name]: ''
        }));
        return;
      }
    }
    
    setSchoolFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSchoolFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('School form data:', schoolFormData);
    
    // Check if the selected date is disabled
    if (isDateDisabled(schoolFormData.date)) {
      alert('Please select a valid date. Past dates, weekends, and blackout dates are not available.');
      return;
    }
    
    // Additional weekend check as safety net
    if (schoolFormData.date) {
      const selectedDate = new Date(schoolFormData.date);
      const dayOfWeek = selectedDate.getDay();

      console.log('Day of week:', dayOfWeek);
      
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        alert('Weekend dates are not available for school signups. Please select a weekday.');
        return;
      }
    }
    
    console.log('User:', user);
    try {
      const response = await fetch('/api/signups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...schoolFormData,
          userId: user?.userId,
          startTime: schoolFormData.arrivalTime,
          endTime: schoolFormData.departureTime,
          location: 'Froebel School',
          type: 'school'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thank you for signing up to volunteer at the school!');
        // Reset form
        setSchoolFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          date: '',
          arrivalTime: '',
          departureTime: '',
          gradePreference: '',
          organization: '',
          comments: ''
        });
      } else {
        alert(data.error || 'Failed to submit volunteer form');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  const fetchBlackoutDates = async () => {
    try {
      const response = await fetch('/api/blackout-dates');
      const data = await response.json();
      
      if (response.ok) {
        setBlackoutDates(data.dates);
      }
    } catch (error) {
      console.error('Failed to fetch blackout dates:', error);
    }
  };

  useEffect(() => {
    fetchBlackoutDates();
  }, []);

  const isDateDisabled = (date: string) => {
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isPast = dateObj < today;
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Sunday or Saturday
    const isBlackedOut = blackoutDates.includes(date);
    
    return isPast || isWeekend || isBlackedOut;
  };

  if (sessionLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="home-page">
      {/* Header */}
      <Header />

      {/* Success Snackbar */}
      {showSnackbar && user && (
        <div className="snackbar success">
          <span className="snackbar-icon">✓</span>
          <span className="snackbar-message">
            Successfully logged in as {user.email}!
          </span>
          <button 
            className="snackbar-close"
            onClick={() => setShowSnackbar(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* About Froebel School Section */}
      <section className="about-section">
        <div className="container">
          <h1 className="about-title">About Froebel School</h1>
          <p className="about-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet diam sed turpis dictum convallis. Praesent id lorem vel metus sagittis commodo. Vivamus porta
            ligula ut nisl bibendum, at tincidunt lacus vestibulum. Integer euismod turpis et mi porttitor, in euismod risus venenatis. Duis euismod mi vel arcu placerat, et volutpat
            neque luctus. Cras fermentum justo sed sapien cursus tempor. In at dui a ligula fermentum pulvinar et a purus.
          </p>
        </div>
      </section>

      <main className="main-content">
        {/* How to Volunteer Section */}
        <section className="how-to-volunteer-section">
          <div className="container">
            <h2 className="section-title">How to Volunteer</h2>
            <p className="how-to-volunteer-text">
              There are <span className="highlight">two options</span> for volunteering at the Froebel School. You can self-select your shift and hours to volunteer at the
              school where you can do thing #1, thing #2, or thing #3. Alternatively, you can sign up for specific shifts working in the
              warehouse where you will do thing #1, thing #2 or thing #3.
            </p>
            <br />
            <p className="how-to-volunteer-text">
              To volunteer, you must fill out [NAME OF FORMS] forms. <span className="highlight">If you are under 18</span>, you must download the following forms, complete them, and send a PDF to anndillon@gmail.com. <span className="italicize">1 week is required to process these forms.</span> <span className="highlight">NOTE:</span> If you are renewing your application, you <span className="highlight">do not</span> need a reference.
            </p>
            <br />
            <p className="how-to-volunteer-text">
              <span className="highlight">If you are 18 or older</span>, you must complete the online application here. <span className="italicize">3 weeks is required to process these applications.</span> For instructions, go here. For any question, please email anndillon@gmail.com.
            </p>
          </div>
        </section>

        {/* Volunteer at the School Section (Form) */}
        <section className="volunteer-school-section">
          <div className="container">
            <h2 className="section-title">Volunteer at the School</h2>
            {/* Update the form to have separate first/last name fields and handle submission */}
            <form className="volunteer-form" onSubmit={handleSchoolFormSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName"
                    value={schoolFormData.firstName}
                    onChange={handleSchoolFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={schoolFormData.lastName}
                    onChange={handleSchoolFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="text" 
                    id="phone" 
                    name="phoneNumber"
                    value={schoolFormData.phoneNumber}
                    onChange={handleSchoolFormChange}
                    placeholder="(123) 456-7890" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={schoolFormData.email}
                    onChange={handleSchoolFormChange}
                    placeholder="john@doe.com" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="schoolDate">Date</label>
                  <input
                    type="date"
                    id="schoolDate"
                    name="date"
                    value={schoolFormData.date}
                    onChange={handleSchoolFormChange}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    className={isDateDisabled(schoolFormData.date) ? 'disabled-date' : ''}
                    required
                  />
                  {isDateDisabled(schoolFormData.date) && (
                    <div className="date-warning">
                      {blackoutDates.includes(schoolFormData.date) && 'This date is blacked out for signups.'}
                      {!blackoutDates.includes(schoolFormData.date) && 
                       (new Date(schoolFormData.date) < new Date(new Date().setHours(0, 0, 0, 0))) && 
                       'Cannot select past dates.'}
                      {!blackoutDates.includes(schoolFormData.date) && 
                       !(new Date(schoolFormData.date) < new Date(new Date().setHours(0, 0, 0, 0))) && 
                       (new Date(schoolFormData.date).getDay() === 0 || new Date(schoolFormData.date).getDay() === 6) && 
                       'Weekend dates are not available for school signups.'}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="arrival-time">Arrival Time</label>
                  <input 
                    type="time" 
                    id="arrival-time" 
                    name="arrivalTime"
                    value={schoolFormData.arrivalTime}
                    onChange={handleSchoolFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departure-time">Departure Time</label>
                  <input 
                    type="time" 
                    id="departure-time" 
                    name="departureTime"
                    value={schoolFormData.departureTime}
                    onChange={handleSchoolFormChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="grade-preference">Grade preference?</label>
                  <select 
                    id="grade-preference"
                    name="gradePreference"
                    value={schoolFormData.gradePreference}
                    onChange={handleSchoolFormChange}
                  >
                    <option value="">Select a grade</option>
                    <option value="Pre-k">Pre-k</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="1st Grade">1st Grade</option>
                    <option value="2nd Grade">2nd Grade</option>
                    <option value="3rd Grade">3rd Grade</option>
                    <option value="4th Grade">4th Grade</option>
                    <option value="5th Grade">5th Grade</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="organization">What is your organization/affiliation?</label>
                  <input type="text" id="organization" placeholder="Your Organization (optional)" />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="comments">Comments/Questions</label>
                <textarea 
                  id="comments" 
                  name="comments"
                  value={schoolFormData.comments}
                  onChange={handleSchoolFormChange}
                  placeholder="Any additional comments or questions..."
                  rows={3}
                />
              </div>
              <button type="submit" className="continue-button">Submit Volunteer Request</button>
            </form>
          </div>
        </section>

        {/* Volunteer at the Warehouse Section (Event Listings) */}
        <section className="volunteer-warehouse-section">
          <div className="container">
            <h2 className="section-title">Volunteer at the Warehouse</h2>
            <div className="filters-pagination">
              <div className="filters">
                <span>Filters</span>
                <select>
                  <option>Activities</option>
                </select>
                <select>
                  <option>Slots Remaining</option>
                </select>
                <div className="input-with-icon">
                  <input type="text" placeholder="10/01/2025" />
                  <span className="icon">🗓️</span>
                </div>
                <a href="#" className="clear-link">Clear</a>
              </div>
              <div className="pagination-per-page">
                <select>
                  <option>10</option>
                </select>
                <span>per page</span>
              </div>
            </div>

            {/* Event Listings */}
            <ShiftList 
              shifts={shifts}
              pagination={pagination}
              loading={loading}
              error={error}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        {/* Content for the footer */}
      </footer>
    </div>
  );
}
