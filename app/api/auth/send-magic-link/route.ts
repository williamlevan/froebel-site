import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { magicLinks } from '../../../lib/magic-links';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a secure token
    const token = randomBytes(32).toString('hex');
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store the magic link
    await magicLinks.set(token, { email, expires });
    
    console.log('Stored token:', token);

    // Create the magic link URL
    const magicLinkUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/verify-magic-link?token=${token}`;

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Froebel School <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Magic Link to Sign In',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Sign in to Froebel School Volunteer Site</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${magicLinkUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Sign In
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 15 minutes. If you didn't request this, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${magicLinkUrl}">${magicLinkUrl}</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Magic link sent successfully' });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
