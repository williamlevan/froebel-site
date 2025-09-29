import { useRouter } from 'next/navigation';

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

interface ShiftCardProps {
  shift: Shift;
}

export default function ShiftCard({ shift }: ShiftCardProps) {
  const router = useRouter();

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
      weekday: 'short',
      month: 'short',
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

  const handleSignUp = () => {
    router.push(`/shift/${shift._id}`);
  };

  return (
    <div className="event-card">
      <div className="event-card-left-bar"></div>
      <div className="event-card-content">
        <div className="event-card-header">
          <span className="event-title">{shift.title}</span>
          <span className="event-time-tag">
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </span>
        </div>
        <div className="event-details">
          <p>
            <span className="icon">🕒</span> {formatDate(shift.date)} at {formatTime(shift.startTime)} - {formatTime(shift.endTime)} ({getDuration(shift.startTime, shift.endTime)} hours)
          </p>
          <p>
            <span className="icon">👤</span> {shift.spotsFilled}/{shift.maxVolunteers} spots filled ({getAvailableSpots(shift.maxVolunteers, shift.spotsFilled)} available)
          </p>
          <p>
            <span className="icon">📍</span> {shift.location}
          </p>
        </div>
        <p className="event-description">{shift.description}</p>
      </div>
      <div className="event-card-actions">
        <button className="sign-up-button" onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}