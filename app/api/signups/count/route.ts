import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shiftId = searchParams.get('shiftId');

    if (!shiftId) {
      return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('users');
    const signups = db.collection('signups');

    const count = await signups.countDocuments({ shiftId });
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting signups:', error);
    return NextResponse.json({ error: 'Failed to count signups' }, { status: 500 });
  }
}
