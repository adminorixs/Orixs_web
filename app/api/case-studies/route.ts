import { NextResponse } from 'next/server';

// CMS functionality temporarily disabled
export async function GET() {
  return NextResponse.json({ message: 'CMS functionality temporarily disabled' }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ message: 'CMS functionality temporarily disabled' }, { status: 503 });
} 