import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt:', { 
      providedUsername: username,
      envUsername: process.env.CMS_USERNAME,
      passwordMatch: password === process.env.CMS_PASSWORD 
    });

    // Check credentials against environment variables
    if (
      username === process.env.CMS_USERNAME &&
      password === process.env.CMS_PASSWORD
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      // Set HTTP-only cookie
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      );

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });

      return response;
    }

    console.log('Invalid credentials');
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 