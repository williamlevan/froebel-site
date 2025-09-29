import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '../../../lib/users';
import { SessionManager } from '../../../lib/session';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, role } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Email, first name, and last name are required' }, { status: 400 });
    }

    // Create the user
    const user = await createUser({
      email,
      firstName,
      lastName,
      role: role || 'volunteer'
    });

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create session
    const sessionId = await SessionManager.createSession({
      userId: user._id!.toString(), // Convert ObjectId to string
      email: user.email,
      firstName: user.firstName!,
      lastName: user.lastName!,
      role: user.role
    });

    const response = NextResponse.json({ 
      message: 'User account created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

    // Set session cookie
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
