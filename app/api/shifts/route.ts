import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export interface Shift {
  _id?: ObjectId;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  maxVolunteers: number;
  spotsFilled: number;
  createdAt: Date;
  createdBy: string;
}

interface GroupedShifts {
  [date: string]: any[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const shiftsDb = client.db('shifts');
    const shifts = shiftsDb.collection<Shift>('shifts');
    const signupsDb = client.db('signups');
    const signups = signupsDb.collection('signups');

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter to only include shifts from today onwards
    const filter = { date: { $gte: today } };

    const totalCount = await shifts.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get shifts with pagination and date filter
    const shiftsData = await shifts
      .find(filter)
      .sort({ date: 1, startTime: 1 }) // Sort by date first, then by start time
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get spots filled count for each shift
    const shiftsWithCounts = await Promise.all(
      shiftsData.map(async (shift) => {
        const spotsFilled = await signups.countDocuments({ shiftId: shift._id?.toString() });
        return {
          ...shift,
          _id: shift._id?.toString(),
          spotsFilled
        };
      })
    );

    // Group shifts by date
    const groupedShifts: GroupedShifts = {};
    shiftsWithCounts.forEach(shift => {
      const date = shift.date;
      if (!groupedShifts[date]) {
        groupedShifts[date] = [];
      }
      groupedShifts[date].push(shift);
    });

    return NextResponse.json({
      shifts: groupedShifts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}
