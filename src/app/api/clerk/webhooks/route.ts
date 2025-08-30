import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Get the body
    const payload = await req.json();
    
    // Basic webhook handling without svix verification for now
    console.log('Clerk webhook received:', payload);

    // Handle different webhook events
    switch (payload.type) {
      case 'user.created':
        console.log('New user created:', payload.data);
        break;
      case 'user.updated':
        console.log('User updated:', payload.data);
        break;
      case 'session.created':
        console.log('Session created:', payload.data);
        break;
      default:
        console.log('Unhandled webhook type:', payload.type);
    }

    return NextResponse.json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
