
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
      const options = {
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      const response = NextResponse.json({ success: true }, { status: 200 });
      response.cookies.set(options);
      return response;

    } catch (error) {
      console.error('Error creating session cookie:', error);
      return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 401 });
    }
  }

  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}
