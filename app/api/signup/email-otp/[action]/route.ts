import { NextRequest, NextResponse } from 'next/server';

const allowedActions = new Set(['send', 'verify']);
const masterOtpBaseUrl = 'https://master.orixs.io/api/signup/email-otp';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> }
) {
  const { action } = await context.params;

  if (!allowedActions.has(action)) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 422 });
  }

  try {
    const upstream = await fetch(`${masterOtpBaseUrl}/${action}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const payload = await upstream.text();

    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Email verification is temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    );
  }
}
