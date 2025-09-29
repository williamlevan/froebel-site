import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '../../../lib/users';
import { SessionManager } from '../../../lib/session';

export async function PUT(request: NextRequest) {
  try {
    const { userId, firstName, lastName } = await request.json();

    if (!userId || !firstName || !lastName) {
      return NextResponse.json({ error: 'User ID, first name, and last name are required' }, { status: 400 });
    }

    const success = await updateUser(userId, { firstName, lastName });

    if (!success) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    // Update the session data
    const sessionId = request.cookies.get('sessionId')?.value;
    if (sessionId) {
      await SessionManager.updateSession(sessionId, {
        firstName: firstName,
        lastName: lastName
      });
    }

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: {
        firstName: firstName,
        lastName: lastName
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
