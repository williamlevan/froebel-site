import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const shiftsDb = client.db('shifts');
    const shifts = shiftsDb.collection<Shift>('shifts');

    const signupsDb = client.db('signups');
    const signups = signupsDb.collection('signups');

    const shift = await shifts.findOne({ _id: new ObjectId(params.id) });

    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    // Get spots filled count
    const spotsFilled = await signups.countDocuments({ shiftId: params.id });

    const shiftWithCount = {
      ...shift,
      _id: shift._id?.toString(),
      spotsFilled
    };

    return NextResponse.json({ shift: shiftWithCount });
  } catch (error) {
    console.error('Error fetching shift:', error);
    return NextResponse.json({ error: 'Failed to fetch shift' }, { status: 500 });
  }
}
