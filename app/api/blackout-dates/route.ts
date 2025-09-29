import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blackout_dates');
    const blackoutDates = db.collection('blackout_dates');
    
    const dates = await blackoutDates.find({}).toArray();
    return NextResponse.json({ dates: dates.map(d => d.date) });
  } catch (error) {
    console.error('Error fetching blackout dates:', error);
    return NextResponse.json({ error: 'Failed to fetch blackout dates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('blackout_dates');
    const blackoutDates = db.collection('blackout_dates');
    
    // Check if date already exists
    const existing = await blackoutDates.findOne({ date });
    if (existing) {
      return NextResponse.json({ error: 'Date already blacked out' }, { status: 400 });
    }
    
    await blackoutDates.insertOne({ date, createdAt: new Date() });
    return NextResponse.json({ message: 'Blackout date added successfully' });
  } catch (error) {
    console.error('Error adding blackout date:', error);
    return NextResponse.json({ error: 'Failed to add blackout date' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('blackout_dates');
    const blackoutDates = db.collection('blackout_dates');
    
    const result = await blackoutDates.deleteOne({ date });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blackout date not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blackout date removed successfully' });
  } catch (error) {
    console.error('Error removing blackout date:', error);
    return NextResponse.json({ error: 'Failed to remove blackout date' }, { status: 500 });
  }
}
