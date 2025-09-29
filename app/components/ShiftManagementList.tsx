import ShiftManagementCard from './ShiftManagementCard';

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

interface ShiftManagementListProps {
  shifts: GroupedShifts;
  pagination: PaginationInfo;
  loading: boolean;
  error: string;
  onPageChange: (page: number) => void;
}

export default function ShiftManagementList({
  shifts,
  pagination,
  loading,
  error,
  onPageChange,
}: ShiftManagementListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading shifts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (Object.keys(shifts).length === 0) {
    return <div className="no-shifts">No shifts available at the moment.</div>;
  }

  const sortedDates = Object.keys(shifts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <>
      <div className="event-list">
        {sortedDates.map(date => (
          <div key={date}>
            <h3 className="event-date-header">{formatDate(date)}</h3>
            {shifts[date].map(shift => (
              <ShiftManagementCard
                key={shift._id}
                shift={shift}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bottom-pagination">
          <button
            className="pagination-arrow"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            &lt;
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-number ${page === pagination.currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-arrow"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}