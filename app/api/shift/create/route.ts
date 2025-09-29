import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { SessionManager } from '../../../lib/session';

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

export async function POST(request: NextRequest) {
  try {
    // Get session ID from cookies
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session data
    const sessionData = await SessionManager.getSession(sessionId);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check if user is admin
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const shiftData = await request.json();

    if (!shiftData.title || !shiftData.date || !shiftData.startTime || !shiftData.endTime || !shiftData.location || !shiftData.description || !shiftData.maxVolunteers) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('shifts');
    const shifts = db.collection<Shift>('shifts');

    const newShift: Shift = {
      title: shiftData.title,
      date: shiftData.date,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      location: shiftData.location,
      description: shiftData.description,
      maxVolunteers: shiftData.maxVolunteers,
      spotsFilled: 0, // Always start with 0, will be calculated dynamically
      createdAt: new Date(),
      createdBy: sessionData.email // Use the admin user's email from session
    };

    const result = await shifts.insertOne(newShift);

    if (result.insertedId) {
      return NextResponse.json({ 
        message: 'Shift created successfully',
        shift: {
          id: result.insertedId.toString(),
          ...newShift,
          _id: result.insertedId.toString()
        }
      });
    }

    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
