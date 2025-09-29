import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export interface Shift {
  _id?: string;
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

export async function POST(request: NextRequest) {
  try {
    const shiftData = await request.json();

    if (!shiftData.title || !shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.location || !shiftData.description || !shiftData.maxVolunteers) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('users');
    const shifts = db.collection<Shift>('shifts');

    const newShift: Shift = {
      ...shiftData,
      maxVolunteers: parseInt(shiftData.maxVolunteers),
      spotsFilled: parseInt(shiftData.spotsFilled) || 0,
      createdAt: new Date(),
      createdBy: 'admin' // You might want to get this from session
    };

    const result = await shifts.insertOne(newShift);

    if (result.insertedId) {
      return NextResponse.json({ 
        message: 'Shift created successfully',
        shift: {
          id: result.insertedId.toString(),
          ...newShift
        }
      });
    }

    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
