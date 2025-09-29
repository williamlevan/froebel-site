import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export interface Signup {
  _id?: ObjectId;
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
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shiftId = searchParams.get('shiftId');
    const userId = searchParams.get('userId');

    if (!shiftId || !userId) {
      return NextResponse.json({ error: 'Shift ID and User ID are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('signups');
    const signups = db.collection<Signup>('signups');

    const signup = await signups.findOne({ 
      shiftId: shiftId,
      userId: userId 
    });

    return NextResponse.json({
      signup: signup ? {
        ...signup,
        _id: signup._id?.toString()
      } : null
    });
  } catch (error) {
    console.error('Error checking signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
