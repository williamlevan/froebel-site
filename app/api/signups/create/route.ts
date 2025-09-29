import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Update the signup interface to include comments
interface SignupData {
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
  comments?: string; // Add this field
  createdAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const signupData = await request.json();

    console.log('Signup data:', signupData);
    
    if (!signupData.userId || !signupData.firstName || !signupData.lastName || !signupData.email || !signupData.phoneNumber) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('signups');
    const signups = db.collection<SignupData>('signups');

    // Check if user is already signed up for this shift
    if (signupData.shiftId) {
      const existingSignup = await signups.findOne({
        shiftId: signupData.shiftId,
        userId: signupData.userId
      });

      if (existingSignup) {
        return NextResponse.json({ error: 'You are already signed up for this shift' }, { status: 400 });
      }
    }

    // Add this check before creating the signup
    const blackoutDb = client.db('settings');
    const blackoutDates = blackoutDb.collection('blackoutDates');

    const isBlackedOut = await blackoutDates.findOne({ date: signupData.date });
    if (isBlackedOut) {
      return NextResponse.json({ error: 'Signups are not allowed on this date' }, { status: 400 });
    }

    const newSignup: SignupData = {
      userId: signupData.userId,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
      shiftId: signupData.shiftId,
      startTime: signupData.startTime,
      endTime: signupData.endTime,
      date: signupData.date,
      gradePreference: signupData.gradePreference,
      organization: signupData.organization,
      location: signupData.location,
      type: signupData.type || 'warehouse',
      comments: signupData.comments, // Add comments to newSignup
      createdAt: new Date()
    };

    const result = await signups.insertOne(newSignup);

    if (result.insertedId) {
      return NextResponse.json({ 
        message: 'Successfully signed up for shift',
        signup: {
          id: result.insertedId.toString(),
          ...newSignup,
          _id: result.insertedId.toString()
        }
      });
    }

    return NextResponse.json({ error: 'Failed to create signup' }, { status: 500 });
  } catch (error) {
    console.error('Error creating signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
