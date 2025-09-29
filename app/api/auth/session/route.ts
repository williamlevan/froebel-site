import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from '../../../lib/session';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ user: null });
    }

    const sessionData = await SessionManager.getSession(sessionId);
    
    if (!sessionData) {
      // Session expired or invalid, clear cookie
      const response = NextResponse.json({ user: null });
      response.cookies.delete('sessionId');
      return response;
    }

    // Extend session on each request
    await SessionManager.extendSession(sessionId);

    return NextResponse.json({ user: sessionData });
  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (sessionId) {
      await SessionManager.deleteSession(sessionId);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('sessionId');
    return response;
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
