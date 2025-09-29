import { NextRequest, NextResponse } from 'next/server';
import { magicLinks } from '../../../lib/magic-links';
import { findUserByEmail, updateUserLastLogin } from '../../../lib/users';
import { SessionManager } from '../../../lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/signin?error=invalid-token', request.url));
    }

    const magicLinkData = await magicLinks.get(token);

    if (!magicLinkData) {
      return NextResponse.redirect(new URL('/signin?error=invalid-token', request.url));
    }

    // Check if the token has expired
    if (Date.now() > magicLinkData.expires) {
      await magicLinks.delete(token);
      return NextResponse.redirect(new URL('/signin?error=expired-token', request.url));
    }

    // Clean up the used token
    await magicLinks.delete(token);

    // Check if user exists in MongoDB
    let user = await findUserByEmail(magicLinkData.email);

    if (!user) {
      // User doesn't exist, redirect to registration
      const signinSuccessUrl = new URL('/signin/success', request.url);
      signinSuccessUrl.searchParams.set('email', magicLinkData.email);
      return NextResponse.redirect(signinSuccessUrl);
    } else {
      // User exists, update last login and create session
      await updateUserLastLogin(magicLinkData.email);
      
      // Create session
      const sessionId = await SessionManager.createSession({
        userId: user._id!.toString(), // Convert ObjectId to string
        email: user.email,
        firstName: user.firstName!,
        lastName: user.lastName!,
        role: user.role
      });

      // Set session cookie and redirect to home
      const homeUrl = new URL('/home', request.url);
      homeUrl.searchParams.set('login', 'success');
      
      const response = NextResponse.redirect(homeUrl);
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });
      
      return response;
    }
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(new URL('/signin?error=verification-failed', request.url));
  }
}
